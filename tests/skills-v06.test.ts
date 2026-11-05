import {describe,it,expect} from 'vitest';
import {Battle,skills,commandsFor} from '../src/battle';
import {EXTRA_COMMANDS} from '../src/data/combat';
import {ELEMENTS} from '../src/data/effects';
import {isSkillLearned} from '../src/learning';
import {statValue} from '../src/effects';
import {fresh,load,save} from '../src/save';
import type {ActionResult,Command} from '../src/types';
function event(result:ActionResult){expect(result.ok).toBe(true);if(!result.ok)throw Error(result.reason);return result.event}
function toActor(b:Battle,id:string){for(let n=0;n<20&&b.current?.id!==id&&!b.result;n++)b.waitTurn();expect(b.current?.id).toBe(id)}
function ready(id='astel',random:()=>number=()=>0.99){const b=new Battle(random);toActor(b,id);for(const u of b.allies)u.level=10;return b}
const newSkills=Object.entries(EXTRA_COMMANDS).flatMap(([owner,list])=>list.map(command=>({owner,command})));
describe('v0.6 learning and command validation',()=>{
 it.each(newSkills)('$owner / $command is locked until its required level',({owner,command})=>{
  const b=ready(owner),u=b.current!,level=skills[command].unlockLevel!;u.star=100;b.allies[0].hp-=1;
  u.level=level-1;expect(isSkillLearned(u,command)).toBe(false);expect(b.canUse(command)).toBe(false);
  const before={mp:u.mp,star:u.star,actor:b.current?.id,round:b.round};expect(b.act(command,'enemy0').ok).toBe(false);expect({mp:u.mp,star:u.star,actor:b.current?.id,round:b.round}).toEqual(before);
  u.level=level;expect(isSkillLearned(u,command)).toBe(true);expect(b.canUse(command)).toBe(true);
 });
 it('allows independent story unlock policy without changing levels or cross-role access',()=>{const b=new Battle(()=>0.99,undefined,(u,c)=>isSkillLearned(u,c,['starSlash']));b.allies[0].star=100;expect(b.canUse('starSlash')).toBe(true);expect(b.allies[0].level).toBe(1);expect(b.canUse('miracle')).toBe(false);expect(commandsFor(b.allies[0])).not.toContain('miracle')});
 it('rejects MP shortage, dead targets and malformed targets without star or action gain',()=>{
  const b=ready();b.allies[0].mp=0;expect(b.act('fang','enemy0').ok).toBe(false);b.allies[0].mp=24;b.enemies[0].hp=0;expect(b.act('fang','enemy0').ok).toBe(false);expect(b.act('fang','mei').ok).toBe(false);expect(b.act('fang','missing').ok).toBe(false);expect(b.current?.id).toBe('astel');expect(b.allies[0].star).toBe(0);expect(b.allies[0].mp).toBe(24);
 });
 it('preserves seven element IDs and maps ice to water, thunder to wind',()=>{expect(Object.keys(ELEMENTS)).toHaveLength(7);expect(skills.ice.element).toBe('water');expect(skills.thunder.element).toBe('wind')});
});
describe('Astel attacks and compound actions',()=>{
 it('resolves two hits and gains skill star only once',()=>{const b=ready();const e=event(b.act('fang','enemy0'));expect(e.effects?.map(p=>p.amount)).toEqual([21,21]);expect(e.amount).toBe(42);expect(b.enemies[0].hp).toBe(198);expect(b.allies[0].mp).toBe(16);expect(b.allies[0].star).toBe(10)});
 it('stops on intermediate defeat and never retargets',()=>{const b=ready();b.enemies[0].hp=1;const e=event(b.act('fang','enemy0'));expect(e.effects).toHaveLength(1);expect(e.effects![0].hpLoss).toBe(1);expect(b.enemies[1].hp).toBe(260);expect(b.enemies[2].hp).toBe(280);expect(b.current?.id).toBe('rina')});
 it('rolls each hit critical separately and wakes sleep/freeze on the actual hit',()=>{
  let values:number[]=[];const b=ready('astel',()=>values.shift()??0.99);b.applyStatus('enemy0','sleep',1,3);b.applyStatus('enemy0','freeze',1,3);values=[0,0.99];
  const e=event(b.act('fang','enemy0'));expect(e.effects?.map(p=>[p.amount,p.critical])).toEqual([[31,true],[21,false]]);expect(b.enemies[0].statuses).toEqual([]);expect(e.effects![0].logs.join(' ')).toContain('睡眠がダメージで解除');expect(e.effects![1].logs.join(' ')).not.toContain('ダメージで解除');
 });
 it('applies affinity and rounding per hit, including misses',()=>{
  const b=ready();b.allies[0].attackElement='fire';b.enemies[0].affinities.fire=0.5;expect(event(b.act('fang','enemy0')).effects?.map(p=>p.amount)).toEqual([10,10]);
  const c=ready();c.applyStatus('astel','blind',1,3);const e=event(c.act('fang','enemy0'));expect(e.effects?.every(p=>p.label==='ミス')).toBe(true);expect(e.amount).toBe(0);expect(c.allies[0].star).toBe(10);
 });
 it('armor break deals its hit before debuff and expires after target opportunities',()=>{
  const b=ready();expect(event(b.act('armorBreak','enemy0')).amount).toBe(38);expect(b.enemies[0].modifiers).toEqual([{stat:'defense',amount:-0.2,remaining:3}]);
  toActor(b,'astel');expect(event(b.act('attack','enemy0')).amount).toBe(40);for(let n=0;n<2;n++){toActor(b,'enemy0');b.waitTurn()}expect(b.enemies[0].modifiers).toEqual([]);
 });
 it('gale slash increases own speed and preserves existing self-buff countdown rules',()=>{
  const b=ready();expect(event(b.act('galeSlash','enemy0')).amount).toBe(35);expect(statValue(b.allies[0],'speed')).toBeCloseTo(28.8);expect(b.allies[0].modifiers[0].remaining).toBe(2);
  toActor(b,'astel');expect(b.roundOrder[0].speed).toBeCloseTo(28.8);b.waitTurn();toActor(b,'astel');b.waitTurn();expect(statValue(b.allies[0],'speed')).toBe(24);
 });
 it('star slash costs exactly 100, consumes one opportunity and does not give skill star',()=>{const b=ready();b.allies[0].star=100;const e=event(b.act('starSlash','enemy0'));expect(e.amount).toBe(112);expect(e.ultimate).toBe(true);expect(b.allies[0].star).toBe(0);expect(b.allies[0].mp).toBe(24);expect(b.current?.id).toBe('enemy0')});
});
describe('Rina protection',()=>{
 it('taunt forces attacks for the cast round and next round then expires',()=>{
  const b=ready('rina');event(b.act('taunt'));expect(b.allies[1].tauntRounds).toBe(2);expect(event(b.enemyAct()).target).toBe('rina');toActor(b,'enemy2');expect(event(b.enemyAct()).target).toBe('rina');expect(b.round).toBe(2);expect(b.allies[1].tauntRounds).toBe(1);toActor(b,'enemy0');expect(event(b.enemyAct()).target).toBe('rina');toActor(b,'enemy2');event(b.enemyAct());expect(b.round).toBe(3);expect(b.allies[1].tauntRounds).toBe(0);toActor(b,'enemy0');expect(event(b.enemyAct()).target).toBe('mei');
 });
 it('taunt ceases immediately when the protector is defeated',()=>{const b=ready('rina');event(b.act('taunt'));b.allies[1].hp=1;event(b.enemyAct());expect(b.allies[1].hp).toBe(0);expect(b.allies[1].tauntRounds).toBeUndefined();toActor(b,'enemy2');expect(event(b.enemyAct()).target).toBe('mei')});
 it('guardian field buffs only living allies with per-owner duration',()=>{const b=ready('rina');b.allies[0].hp=0;const e=event(b.act('guardianField'));expect(e.effects?.map(p=>p.target)).toEqual(['rina','mei']);expect(b.allies[0].modifiers).toEqual([]);expect(statValue(b.allies[1],'defense')).toBe(12);expect(b.allies[1].modifiers[0].remaining).toBe(2);expect(b.allies[2].modifiers[0].remaining).toBe(3);expect(b.allies[1].mp).toBe(18)});
 it.each([[0.24,true],[0.25,false]])('shield bash probability boundary %s', (roll,inflicted)=>{const b=ready('rina',()=>roll);expect(event(b.act('shieldBash','enemy0')).amount).toBe(22);expect(b.enemies[0].statuses.some(s=>s.id==='paralysis')).toBe(inflicted)});
 it('oath gives each ally one independent charge and only a real hit consumes it',()=>{
  const b=ready('rina');b.allies[1].star=100;event(b.act('oathShield'));expect(b.allies.map(u=>u.barrierCharges)).toEqual([1,1,1]);expect(b.allies[1].star).toBe(0);
  b.enemies[1].attackElement='fire';b.allies[2].affinities.fire=0;expect(event(b.enemyAct()).amount).toBe(0);expect(b.allies[2].barrierCharges).toBe(1);expect(b.allies[2].star).toBe(0);
  toActor(b,'enemy2');const hit=event(b.enemyAct());expect(hit.amount).toBe(11);expect(hit.damageTrace?.barrierMultiplier).toBe(0.5);expect(b.allies[2].barrierCharges).toBe(0);expect(b.allies[0].barrierCharges).toBe(1);expect(b.allies[2].star).toBe(10);
 });
 it('barrier stacks multiplicatively with guard and cover, not with itself',()=>{
  const b=ready('rina');b.allies[1].star=100;event(b.act('oathShield'));b.allies[1].covering='mei';b.allies[1].guarding='guard';const e=event(b.enemyAct());expect(e.target).toBe('rina');expect(e.covered).toBe(true);expect(e.amount).toBe(2);expect(b.allies[1].barrierCharges).toBe(0);expect(b.allies[2].barrierCharges).toBe(1);
 });
});
describe('Mei spells and healing',()=>{
 it.each([['ice',68,'freeze'],['thunder',76,'paralysis']] as const)('%s uses the configured affinity and 20%% status chance', (command,power,status)=>{
  for(const [roll,expected] of [[0.19,true],[0.2,false]] as const){const b=ready('mei',()=>roll);b.enemies[0].affinities[skills[command].element]=1.5;const e=event(b.act(command,'enemy0'));expect(e.amount).toBe(power*1.5);expect(b.enemies[0].statuses.some(s=>s.id===status)).toBe(expected)}
 });
 it('group heal caps each HP, excludes fallen allies, and records actual amounts',()=>{
  const b=ready('mei');b.allies[0].hp=170;b.allies[1].hp=210;b.allies[2].hp=100;const e=event(b.act('groupHeal'));expect(e.effects?.map(p=>p.amount)).toEqual([10,30,45]);expect(e.amount).toBe(85);expect(b.allies.map(u=>u.hp)).toEqual([180,240,145]);expect(b.allies[2].mp).toBe(32);expect(b.allies[2].star).toBe(10);
  const c=ready('mei');c.allies[0].hp=0;c.allies[1].hp=100;expect(event(c.act('groupHeal')).effects?.map(p=>p.target)).toEqual(['rina','mei']);expect(c.allies[0].hp).toBe(0);
 });
 it('does not consume resources when group heal has no useful target',()=>{const b=ready('mei');expect(b.act('groupHeal').ok).toBe(false);expect(b.allies[2].mp).toBe(48);expect(b.allies[2].star).toBe(0);expect(b.current?.id).toBe('mei')});
 it('miracle heals living allies and cleanses all seven conditions without resurrection',()=>{
  const b=ready('mei');b.allies[0].hp=0;b.allies[1].hp=100;b.allies[2].hp=25;b.allies[2].star=100;
  for(const id of ['poison','sleep','paralysis','blind','silence','burn','freeze'] as const)b.applyStatus('rina',id,1,3);
  const e=event(b.act('miracle'));expect(e.ultimate).toBe(true);expect(e.effects?.map(p=>p.amount)).toEqual([120,120]);expect(b.allies.map(u=>u.hp)).toEqual([0,220,145]);expect(b.allies[1].statuses).toEqual([]);expect(b.allies[2].star).toBe(0);expect(b.allies[2].mp).toBe(48);
 });
 it('permits a full-HP miracle for cleansing but blocks it under silence',()=>{const b=ready('mei');b.allies[2].star=100;b.applyStatus('astel','poison',1,3);expect(b.canUse('miracle')).toBe(true);b.applyStatus('mei','silence',1,3);expect(b.act('miracle').ok).toBe(false);expect(b.allies[2].star).toBe(100);b.clearStatus('mei');expect(event(b.act('miracle')).amount).toBe(0);expect(b.allies[0].statuses).toEqual([])});
});
describe('star resource and save compatibility',()=>{
 it('gains +15 per successful normal attack, +10 per skill/defense and per HP-loss event',()=>{
  const b=ready();event(b.act('attack','enemy0'));expect(b.allies[0].star).toBe(15);event(b.enemyAct());expect(b.allies[2].star).toBe(10);event(b.act('defend'));expect(b.allies[1].star).toBe(10);
  const c=ready();event(c.act('strong','enemy0'));expect(c.allies[0].star).toBe(10);
 });
 it('does not reward a missed/immune normal attack or an incapacitated action',()=>{
  const b=ready();b.applyStatus('astel','blind',1,3);event(b.act('attack','enemy0'));expect(b.allies[0].star).toBe(0);
  const c=ready();c.allies[0].attackElement='fire';c.enemies[0].affinities.fire=0;event(c.act('attack','enemy0'));expect(c.allies[0].star).toBe(0);
  const d=ready();d.applyStatus('astel','sleep',1,3);expect(d.act('defend').ok).toBe(false);event(d.skipTurn());expect(d.allies[0].star).toBe(0);
 });
 it('counts actual poison/burn HP loss as damage star but not extra action reward',()=>{const b=ready();b.applyStatus('astel','poison',1,3);b.applyStatus('astel','burn',1,3);b.applyStatus('astel','sleep',1,3);event(b.skipTurn());expect(b.allies[0].star).toBe(20)});
 it('caps independently at 100 and blocks insufficient ultimate star without consuming anything',()=>{const b=ready();b.allies[0].star=95;event(b.act('attack','enemy0'));expect(b.allies[0].star).toBe(100);expect(b.allies[1].star).toBe(0);toActor(b,'astel');b.allies[0].star=99;const mp=b.allies[0].mp;expect(b.act('starSlash','enemy0').ok).toBe(false);expect(b.allies[0].star).toBe(99);expect(b.allies[0].mp).toBe(mp);expect(b.current?.id).toBe('astel')});
 it('resets stars and new transient effects at victory, defeat, and explicit retreat cleanup',()=>{
  const b=ready();b.allies.forEach(u=>{u.star=100;u.barrierCharges=1;u.tauntRounds=2});b.enemies.forEach((u,i)=>u.hp=i?0:1);event(b.act('starSlash','enemy0'));expect(b.result).toBe('victory');expect(b.allies.every(u=>u.star===0&&u.barrierCharges===undefined&&u.tauntRounds===undefined)).toBe(true);
  const c=ready();c.allies.forEach((u,i)=>{u.star=100;u.hp=i?0:1});c.applyStatus('astel','poison',1,1);event(c.act('defend'));expect(c.result).toBe('defeat');expect(c.allies.every(u=>u.star===0)).toBe(true);
  const d=ready();d.allies.forEach(u=>u.star=80);d.resetBattleResources();expect(d.allies.every(u=>u.star===0)).toBe(true);expect(new Battle().allies.every(u=>u.star===0)).toBe(true);
 });
 it('derives skills from old/current saved levels and never writes star or learned flags',()=>{
  const old=load({getItem:()=>JSON.stringify({version:1,started:true,wins:3,battles:5})});expect(old.wins).toBe(3);expect(new Battle(()=>0.99,old.party).canUse('fang')).toBe(false);
  const p=fresh();p.party.astel.level=3;let raw='';save(p,{setItem:(_,value)=>raw=value});const b=new Battle(()=>0.99,load({getItem:()=>raw}).party);expect(b.canUse('fang')).toBe(true);expect(b.allies[0].star).toBe(0);expect(raw).not.toMatch(/"(?:star|learned|commands)"\s*:/);
 });
});

describe('new skill battle simulations',()=>{
 it.each([3,5,7,10])('completes level %s battles across fixed seeds without invalid resources',level=>{
  let wins=0;
  for(let seed=1;seed<=30;seed++){
   let state=seed;const p=fresh();for(const hero of Object.values(p.party))hero.level=level;
   const b=new Battle(()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296},p.party);
   for(let n=0;n<300&&!b.result;n++){
    if(b.blocked){b.skipTurn();continue}if(b.phase==='enemy'){b.enemyAct();continue}
    const actor=b.current!,enemy=b.enemies.find(u=>u.hp>0)!;
    const wounded=b.allies.filter(u=>u.hp>0&&u.hp<u.maxHp).sort((a,c)=>a.hp/a.maxHp-c.hp/c.maxHp);
    let command:Command='attack',target=enemy.id;
    if(actor.id==='astel'){command=b.canUse('starSlash')?'starSlash':b.canUse('armorBreak')&&!enemy.modifiers.some(m=>m.stat==='defense')?'armorBreak':b.canUse('fang')?'fang':b.canUse('strong')?'strong':'attack'}
    if(actor.id==='rina'){command=b.canUse('oathShield')?'oathShield':b.canUse('taunt')&&!actor.tauntRounds?'taunt':b.canUse('guardianField')&&!actor.modifiers.length?'guardianField':b.canUse('shieldBash')?'shieldBash':'attack'}
    if(actor.id==='mei'){
     if(b.canUse('miracle'))command='miracle';
     else if(wounded.filter(u=>u.maxHp-u.hp>=35).length>=2&&b.canUse('groupHeal'))command='groupHeal';
     else if(wounded[0]&&wounded[0].hp/wounded[0].maxHp<0.6&&b.canUse('heal')){command='heal';target=wounded[0].id}
     else command=b.canUse('thunder')?'thunder':b.canUse('ice')?'ice':b.canUse('fire')?'fire':'attack';
    }
    expect(b.act(command,target).ok).toBe(true);
    for(const u of b.allies){expect(Number.isFinite(u.hp)).toBe(true);expect(u.mp).toBeGreaterThanOrEqual(0);expect(u.star).toBeGreaterThanOrEqual(0);expect(u.star).toBeLessThanOrEqual(100)}
   }
   expect(b.result).not.toBeNull();if(b.result==='victory')wins++;
  }
  expect(wins).toBeGreaterThanOrEqual(28);
 });
});
