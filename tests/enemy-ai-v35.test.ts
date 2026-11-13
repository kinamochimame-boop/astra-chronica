import {describe,it,expect} from 'vitest';
import {ENEMY_AI,EnemyTactics,chooseEnemyTarget,enemyAiConfig} from '../src/enemy-ai';
import {Battle,heroes} from '../src/battle';
import {cloneUnit} from '../src/data/combat';
import {encounters,encounterSetup,forestEnemies} from '../src/data/encounters';
import {cityEnemies} from '../src/data/chapter-two-enemies';
import {saharaEnemies} from '../src/data/chapter-five-enemies';
import {chapters} from '../src/data/chapter-one';
import {AtbCombat} from '../src/atb-combat';
import {attackInterval} from '../src/atb-rules';
import {seededRandom} from '../src/lab-session';
import type {Unit,ActionResult} from '../src/types';
const party=()=>heroes.map(cloneUnit);
const enemy=(u:Unit)=>({...cloneUnit(u),id:'enemy0',enemyTemplateId:u.id});
const one=(u:Unit,random=()=>.99)=>new Battle(random,undefined,undefined,undefined,{name:'AI test',enemies:[enemy(u)]});
const ev=(r:ActionResult)=>{if(!r.ok)throw Error(r.reason);return r.event};
const step=(b:Battle)=>ev(b.resolveRealtime('enemy0','attack',undefined,true));

describe('v3.5 deterministic target choice',()=>{
 it.each(['shadow-bat','ash-bat','starpath-echo','not-configured'])('random target and exactly one draw for %s',id=>{const a=enemy(forestEnemies.bat);a.enemyTemplateId=id;const p=party();p[0].hp=1;let calls=0;const d=chooseEnemyTarget(a,p,()=>{calls++;return .8});expect(d).toEqual({target:p[2]});expect(calls).toBe(1)});
 it('full-health aggression still uses one legacy random draw',()=>{const p=party();let calls=0;expect(chooseEnemyTarget(enemy(forestEnemies.wolf),p,()=>{calls++;return .6}).target).toBe(p[1]);expect(calls).toBe(1)});
 it('one wounded survivor preserves the legacy single draw and later proc stream',()=>{const p=party();p[0].hp=0;p[1].hp=0;p[2].hp=1;let calls=0;expect(chooseEnemyTarget(enemy(forestEnemies.wolf),p,()=>{calls++;return .99})).toEqual({target:p[2]});expect(calls).toBe(1)});
 it('focus at .59 and random fallback at .60',()=>{const p=party();p[0].hp=10;p[2].hp=30;expect(chooseEnemyTarget(enemy(forestEnemies.wolf),p,()=>.59)).toEqual({target:p[0],reason:'wounded'});const values=[.6,.99];expect(chooseEnemyTarget(enemy(forestEnemies.wolf),p,()=>values.shift()!)).toEqual({target:p[2]})});
 it('compares proportions rather than absolute HP',()=>{const p=party();p[0].hp=90;p[1].hp=96;p[2].hp=100;expect(chooseEnemyTarget(enemy(forestEnemies.wolf),p,()=>0).target).toBe(p[1])});
 it.each([0,.99])('equal lowest ratios keep stable candidate order then use injected random=%s',r=>{const p=party();p[0].hp=p[0].maxHp/2;p[2].hp=p[2].maxHp/2;const draws=[0,r];expect(chooseEnemyTarget(enemy(forestEnemies.wolf),p,()=>draws.shift()!).target).toBe(p[r===0?0:2])});
 it('never chooses dead allies; an empty party consumes no random value',()=>{const p=party();p[0].hp=0;expect(chooseEnemyTarget(enemy(forestEnemies.wolf),p,()=>0).target).not.toBe(p[0]);p.forEach(u=>u.hp=0);expect(chooseEnemyTarget(enemy(forestEnemies.wolf),p,()=>{throw Error('unexpected draw')})).toEqual({target:undefined})});
 it('taunt wins without extra random draws; dead taunter is ignored',()=>{const p=party();p[0].hp=1;p[1].tauntRounds=2;expect(chooseEnemyTarget(enemy(forestEnemies.wolf),p,()=>{throw Error('taunt must not draw')})).toEqual({target:p[1]});p[1].hp=0;expect(chooseEnemyTarget(enemy(forestEnemies.wolf),p,()=>0).target).toBe(p[0])});
 it('fixed seeds reproduce every decision and preserve a random share',()=>{const select=(seed:number)=>{const p=party();p[0].hp=1;const r=seededRandom(seed);return Array.from({length:3000},()=>chooseEnemyTarget(enemy(forestEnemies.wolf),p,r).target!.id)};const ids=select(35);expect(ids).toEqual(select(35));const focus=ids.filter(id=>id==='astel').length/ids.length;expect(focus).toBeGreaterThan(.69);expect(focus).toBeLessThan(.77);expect(new Set(ids)).toEqual(new Set(['astel','rina','mei']))});
 it('name changes never affect policy; source template survives enemy0 renaming',()=>{const b=new Battle(()=>0,undefined,undefined,undefined,encounterSetup('forest-entry'));const w=b.enemies[2];expect(w.id).toBe('enemy2');expect(w.enemyTemplateId).toBe('forest-wolf');w.name='任意の表示名';expect(enemyAiConfig(w)?.role).toBe('aggressive')});
 it('wounded focus resolves cover only after selection',()=>{const b=one(forestEnemies.wolf,()=>0);b.allies[0].hp=1;b.allies[1].covering='astel';const hp=b.allies[0].hp,e=step(b);expect(e.target).toBe('rina');expect(e.covered).toBe(true);expect(b.allies[0].hp).toBe(hp);expect(e.logs.some(x=>x.includes('弱ったアステル'))).toBe(true);expect(e.damageTrace!.coverMultiplier).toBe(.65)});
 it('taunt then cover still overrides the tactical priority',()=>{const b=one(forestEnemies.wolf,()=>0);b.allies[0].hp=1;b.allies[2].tauntRounds=2;b.allies[1].covering='mei';const e=step(b);expect(e.taunted).toBe(true);expect(e.covered).toBe(true);expect(e.target).toBe('rina');expect(e.logs.join('')).not.toContain('弱った')});
 it.each(['protector','recipient'])('dead %s cannot redirect an attack',kind=>{const b=one(forestEnemies.wolf,()=>0);b.allies[0].hp=1;b.allies[1].covering='astel';b.allies[kind==='protector'?1:0].hp=0;const e=step(b);expect(e.covered).toBe(false);expect(e.target).not.toBe(kind==='protector'?'rina':'astel')});
});

describe('v3.5 existing defense action and temporary history',()=>{
 it.each([.35,.34])('HP ratio %s permits a 30%% guard decision',ratio=>{const a=enemy(forestEnemies.slime);a.hp=a.maxHp*ratio;expect(new EnemyTactics().shouldGuard(a,1,()=>.299)).toBe(true)});
 it('above threshold does not even draw; chance boundary is exclusive',()=>{const a=enemy(forestEnemies.slime);a.hp=a.maxHp*.351;expect(new EnemyTactics().shouldGuard(a,1,()=>{throw Error('draw')})).toBe(false);a.hp=1;expect(new EnemyTactics().shouldGuard(a,1,()=>.3)).toBe(false)});
 it('cannot guard consecutively; clears between battles and is per enemy instance',()=>{const a=enemy(forestEnemies.slime);a.hp=1;const t=new EnemyTactics();expect(t.shouldGuard(a,1,()=>0)).toBe(true);expect(t.shouldGuard(a,2,()=>{throw Error('cooldown draw')})).toBe(false);expect(t.shouldGuard(a,3,()=>0)).toBe(true);expect(t.shouldGuard({...a,id:'enemy1'},3,()=>0)).toBe(true);t.clear();expect(t.shouldGuard(a,1,()=>0)).toBe(true);expect(new EnemyTactics().shouldGuard(a,1,()=>0)).toBe(true)});
 it('dead enemies cannot guard',()=>{const a=enemy(forestEnemies.slime);a.hp=0;expect(new EnemyTactics().shouldGuard(a,1,()=>0)).toBe(false)});
 it('uses defend multiplier, ends on next opportunity, does not repeat',()=>{const b=one(forestEnemies.slime,()=>0);b.enemies[0].hp=Math.floor(b.enemies[0].maxHp*.35);expect(step(b)).toMatchObject({command:'defend',target:'enemy0',kind:'status'});expect(b.enemies[0].guarding).toBe('defend');const hit=ev(b.resolveRealtime('astel','attack','enemy0',true));expect(hit.damageTrace!.guardMultiplier).toBe(.5);expect(step(b).command).toBe('attack');expect(b.enemies[0].guarding).toBeUndefined()});
 it('guard consumes the enemy normal CT and retains next reset',()=>{const b=one(forestEnemies.slime,()=>0);b.enemies[0].hp=50;const c=new AtbCombat(b);c.auto=false;c.start();const ct=attackInterval(b.enemies[0],false);const events:ReturnType<typeof ev>[]=[];c.onEvent=e=>events.push(e);c.advance(ct-.01);expect(events).toHaveLength(0);c.advance(.01);expect(events[0].command).toBe('defend');expect(c.slot('enemy0').progress).toBeCloseTo(0);c.advance(ct);expect(events[1].command).toBe('attack');expect(c.slot('enemy0').progress).toBeCloseTo(0)});
 it('sleep opportunities do not guard or consume tactical randomness',()=>{const b=one(forestEnemies.slime,()=>0);b.enemies[0].hp=20;b.enemies[0].statuses=[{id:'sleep',remaining:3}];for(let n=0;n<3;n++){expect(step(b).label).toBe('睡眠');expect(b.enemies[0].guarding).toBeUndefined()}expect(step(b).command).toBe('defend')});
 it('legacy counter posture is preserved at low HP',()=>{const b=one(saharaEnemies.soldier,()=>0);b.enemies[0].hp=100;expect(step(b).command).toBe('attack');expect(step(b).label).toBe('反撃態勢');expect(b.enemies[0].counterReady).toBe(true);const hit=ev(b.resolveRealtime('astel','attack','enemy0',true));expect(hit.reactions).toHaveLength(1);expect(b.enemies[0].counterReady).toBe(false)});
});

describe('v3.5 existing status effects, no new proc rolls',()=>{
 const effect={id:'blind' as const,chance:.25,turns:2};
 it('prioritizes a currently unaffected candidate and falls back when all affected',()=>{const p=party();p[0].statuses=[{id:'blind',remaining:2}];const a=enemy(cityEnemies.shadow);expect(chooseEnemyTarget(a,p,()=>0,[effect])).toEqual({target:p[1],reason:'unaffected'});p.forEach(u=>u.statuses=[{id:'blind',remaining:2}]);expect(chooseEnemyTarget(a,p,()=>0,[effect])).toEqual({target:p[0]})});
 it('multiple statuses use missing count, and zero-probability effects do not bias',()=>{const p=party();p[0].statuses=[{id:'blind',remaining:2}];p[1].statuses=[{id:'blind',remaining:2},{id:'sleep',remaining:1}];const a=enemy(cityEnemies.shadow);expect(chooseEnemyTarget(a,p,()=>0,[effect,{id:'sleep',chance:.15}]).target).toBe(p[2]);expect(chooseEnemyTarget(a,p,()=>0,[{...effect,chance:0}])).toEqual({target:p[0]})});
 it('taunt precedes fresh-status preference and cover precedes damage',()=>{const b=one(cityEnemies.shadow,()=>0);b.allies[0].statuses=[{id:'blind',remaining:2}];b.allies[0].tauntRounds=2;b.allies[1].covering='astel';const e=step(b);expect(e.taunted).toBe(true);expect(e.target).toBe('rina');expect(e.covered).toBe(true)});
 it.each([0,.249,.25,.99])('physical blind proc retains 25%% and two opportunities at random %s',r=>{const b=one(cityEnemies.shadow,()=>r);b.allies[0].tauntRounds=2;step(b);expect(b.allies[0].statuses).toEqual(r<.25?[{id:'blind',remaining:2}]:[])});
 it('magic targets use actual spell statuses, original power and duration',()=>{const b=one(saharaEnemies.orb,()=>0);b.allies[0].statuses=[{id:'silence',remaining:2}];const e=step(b);expect(e.target).toBe('rina');expect(e.command).toBe('fire');expect(e.damageTrace!.power).toBe(52);expect(e.element).toBe('earth');expect(b.allies[1].statuses).toEqual([{id:'silence',remaining:2}])});
});

describe('v3.5 explicit opt-in and protected scripts',()=>{
 it.each(Object.keys(ENEMY_AI))('profile %s exists in ordinary encounters, never a boss',id=>{const found=Object.values(encounters).flatMap(e=>e.enemies).filter(u=>u.id===id);expect(found.length).toBeGreaterThan(0);expect(found.every(u=>!u.enemyPattern)).toBe(true);const bossIds=chapters.flatMap(c=>c.events.filter(e=>e.kind==='boss')).flatMap(e=>encounters[e.encounter!].enemies.map(u=>u.id));expect(bossIds).not.toContain(id)});
 const bosses=chapters.flatMap(c=>c.events.filter(e=>e.kind==='boss'));
 it.each(bosses)('boss $id is excluded regardless of HP, name or injected profile ID',e=>{for(const u of encounterSetup(e.encounter!)!.enemies){u.hp=1;expect(u.enemyPattern).toBeTruthy();expect(enemyAiConfig({...u,enemyTemplateId:'mist-slime'})).toBeUndefined();expect(new EnemyTactics().shouldGuard({...u,enemyTemplateId:'mist-slime'},1,()=>{throw Error('boss random changed')})).toBe(false)}});
 it('unknown future patterns and missing profiles stay on legacy AI',()=>{expect(enemyAiConfig({...enemy(forestEnemies.wolf),enemyPattern:'future' as Unit['enemyPattern']})).toBeUndefined();expect(enemyAiConfig({...enemy(forestEnemies.wolf),enemyTemplateId:'future-template'})).toBeUndefined()});
});
