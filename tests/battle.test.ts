import {describe,it,expect} from 'vitest';
import {Battle} from '../src/battle';
import {fresh,load,save} from '../src/save';
describe('battle v2',()=>{
 const create=()=>new Battle(()=>0.99);
 function until(b:Battle,id:string){for(let n=0;n<30&&b.current?.id!==id&&!b.result;n++){if(b.phase==='enemy')b.enemyAct();else b.act('defend')}expect(b.current?.id).toBe(id)}
 it('orders all six units by speed and alternates automatic enemy turns',()=>{const b=create();expect([b.current!,...b.upcoming].slice(0,6).map(u=>u.id)).toEqual(['astel','enemy0','rina','enemy1','mei','enemy2']);expect(b.enemyAct().ok).toBe(false);b.act('attack','enemy0');expect(b.phase).toBe('enemy');expect(b.act('defend').ok).toBe(false);b.enemyAct();expect(b.current?.id).toBe('rina')});
 it('rejects wrong targets, wrong actor and skills without changing MP or turns',()=>{const b=create();expect(b.act('heal','astel').ok).toBe(false);expect(b.act('strong','astel').ok).toBe(false);expect(b.act('attack','enemy0','mei').ok).toBe(false);expect(b.current?.id).toBe('astel');expect(b.allies[0].mp).toBe(24);b.allies[0].mp=0;expect(b.canUse('strong')).toBe(false);expect(b.act('strong','enemy0').ok).toBe(false);expect(b.act('attack','enemy0').ok).toBe(true)});
 it('spends MP once and strong attack deals double damage',()=>{const b=create();const r=b.act('strong','enemy0');expect(r.ok&&r.event.amount).toBe(64);expect(b.allies[0].mp).toBe(18);expect(b.act('strong','enemy0','astel').ok).toBe(false)});
 it('guards damage until the next owner turn and then expires',()=>{const b=create();until(b,'rina');b.act('guard');b.allies[0].hp=0;b.allies[2].hp=0;const r=b.enemyAct();expect(r.ok&&r.event.amount).toBe(5);expect(b.allies[1].guarding).toBe('guard');until(b,'rina');expect(b.allies[1].guarding).toBeUndefined()});
 it('redirects damage to the living cover user and expires',()=>{const b=new Battle(()=>0);until(b,'rina');const before=b.allies[0].hp;const hp=b.allies[1].hp;expect(b.act('cover','astel').ok).toBe(true);const r=b.enemyAct();expect(r.ok&&r.event.covered).toBe(true);expect(r.ok&&r.event.target).toBe('rina');expect(b.allies[0].hp).toBe(before);expect(b.allies[1].hp).toBeLessThan(hp);until(b,'rina');expect(b.allies[1].covering).toBeUndefined()});
 it('does not allow self-cover, dead cover targets, or dead protectors',()=>{const b=new Battle(()=>0);until(b,'rina');expect(b.act('cover','rina').ok).toBe(false);b.allies[2].hp=0;expect(b.act('cover','mei').ok).toBe(false);b.act('cover','astel');b.allies[1].hp=0;const r=b.enemyAct();expect(r.ok&&r.event.covered).toBe(false);expect(r.ok&&r.event.target).toBe('astel')});
 it('heals living allies, caps recovery and rejects full HP and dead targets',()=>{const b=create();until(b,'mei');b.allies[1].hp=b.allies[1].maxHp;expect(b.act('heal','rina').ok).toBe(false);b.allies[1].hp=0;expect(b.act('heal','rina').ok).toBe(false);b.allies[0].hp=170;const r=b.act('heal','astel');expect(r.ok&&r.event.amount).toBe(10);expect(b.allies[0].hp).toBe(180);expect(b.allies[2].mp).toBe(40)});
 it('fire uses MP and critical damage is reported',()=>{const b=new Battle(()=>0);until(b,'mei');const r=b.act('fire','enemy0');expect(r.ok&&r.event.critical).toBe(true);expect(r.ok&&r.event.amount).toBe(108);expect(b.allies[2].mp).toBe(41)});
 it('skips defeated units and completes victory without further actions',()=>{const b=create();b.enemies[0].hp=1;b.act('attack','enemy0');expect(b.current?.id).toBe('rina');expect(b.upcoming.every(u=>u.hp>0)).toBe(true);for(let n=0;n<150&&!b.result;n++){if(b.phase==='enemy')b.enemyAct();else b.act('attack',b.enemies.find(e=>e.hp>0)!.id)}expect(b.result).toBe('victory');expect(b.phase).toBe('finished');expect(b.act('defend').ok).toBe(false);expect(b.enemyAct().ok).toBe(false)});
 it('reaches defeat through normal enemy actions and clamps HP',()=>{const b=create();b.allies.forEach(a=>a.hp=1);for(let n=0;n<30&&!b.result;n++){if(b.phase==='enemy')b.enemyAct();else b.act('defend')}expect(b.result).toBe('defeat');expect(b.allies.every(a=>a.hp===0)).toBe(true)});
 it('allows free defense and attack when everyone has no MP',()=>{const b=create();b.allies.forEach(a=>a.mp=0);for(let n=0;n<12;n++){const r=b.phase==='enemy'?b.enemyAct():b.act('defend');expect(r.ok).toBe(true)}expect(b.round).toBe(3);expect(b.current?.id).toBe('astel')});
 it('supports beginner skill strategy across 100 deterministic battles',()=>{
  let wins=0;const rounds:number[]=[];
  for(let seed=1;seed<=100;seed++){
   let state=seed;const b=new Battle(()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296});
   for(let n=0;n<200&&!b.result;n++){
    if(b.phase==='enemy'){b.enemyAct();continue}
    const actor=b.current!;const enemy=b.enemies.find(e=>e.hp>0)!;
    const hurt=b.allies.filter(a=>a.hp>0&&a.maxHp-a.hp>=65).sort((a,c)=>a.hp/a.maxHp-c.hp/c.maxHp)[0];
    if(actor.id==='mei'&&hurt&&b.canUse('heal'))b.act('heal',hurt.id);
    else if(actor.id==='mei'&&b.canUse('fire'))b.act('fire',enemy.id);
    else if(actor.id==='astel'&&b.canUse('strong'))b.act('strong',enemy.id);
    else b.act('attack',enemy.id);
   }
   if(b.result==='victory'){wins++;rounds.push(b.round)}
   expect(b.result).not.toBeNull();
  }
  expect(wins).toBeGreaterThanOrEqual(95);expect(Math.max(...rounds)).toBeLessThanOrEqual(12);
 });
 it('keeps initial data immutable between fights',()=>{const a=create();a.allies[0].hp=1;a.allies[0].mp=0;const b=create();expect(b.allies[0].hp).toBe(180);expect(b.allies[0].mp).toBe(24)});
});
describe('save',()=>{
 it('round trips progress',()=>{let value='';const storage={getItem:()=>value,setItem:(_:string,v:string)=>{value=v}};const p={...fresh(),started:true,wins:1,battles:2};expect(save(p,storage)).toBe(true);expect(load(storage)).toEqual(p)});
 it('recovers from corrupt saves and unavailable storage',()=>{expect(load({getItem:()=>'{broken'})).toEqual(fresh());expect(load({getItem:()=>'{"version":1,"started":true,"wins":-1,"battles":0}'})).toEqual(fresh());expect(save(fresh(),{setItem:()=>{throw Error('blocked')}})).toBe(false)})
});
