import {describe,it,expect} from 'vitest';
import {Battle,skills} from '../src/battle';
import {cloneUnit,heroes} from '../src/data/combat';
import {inflict,modify,clearStatus,endTurn,statValue,affinity,statusDefinitions} from '../src/effects';
import {ELEMENTS} from '../src/data/effects';
import {gainExperience,growUnit,initialParty,PROGRESSION,requiredExperience} from '../src/progression';
import {load,save,SAVE_KEY} from '../src/save';
import type {Element,StatusId} from '../src/types';
const hero=()=>cloneUnit(heroes[0]);
function until(b:Battle,id:string){for(let n=0;n<100&&b.current?.id!==id&&!b.result;n++){
 if(b.blocked)b.skipTurn();else if(b.phase==='enemy')b.enemyAct();else b.act('defend');
}expect(b.current?.id).toBe(id)}
describe('status foundation',()=>{
 it.each(Object.keys(statusDefinitions) as StatusId[])('%s has probability, duration, refresh and manual removal',id=>{
  const u=hero();const defaults=hero();expect(inflict(defaults,id,()=>statusDefinitions[id].chance)).toBe(false);expect(inflict(defaults,id,()=>0)).toBe(true);expect(inflict(u,id,()=>0,0)).toBe(false);expect(inflict(u,id,()=>0.99,1,2)).toBe(true);
  expect(inflict(u,id,()=>0,1,1)).toBe(true);expect(u.statuses).toHaveLength(1);expect(u.statuses[0].remaining).toBe(2);
  endTurn(u);expect(u.statuses[0].remaining).toBe(1);endTurn(u);expect(u.statuses).toEqual([]);
  inflict(u,id,()=>0,1,3);clearStatus(u,id);expect(u.statuses).toEqual([]);
  u.statusResistance[id]=1;expect(inflict(u,id,()=>0,1)).toBe(false);
 });
 it('validates duration and probability, and rejects dead targets',()=>{const u=hero();expect(inflict(u,'poison',()=>0,1,0)).toBe(false);expect(inflict(u,'poison',()=>0,NaN,3)).toBe(false);u.hp=0;expect(inflict(u,'sleep',()=>0)).toBe(false)});
 it('poison and burn tick at end of own turn, including skipped turns, and can cause defeat',()=>{
  const b=new Battle(()=>0.99);b.applyStatus('astel','poison',1,2);b.applyStatus('astel','burn',1,2);b.applyStatus('astel','sleep',1,2);
  const hp=b.allies[0].hp;expect(b.blocked).toBe('sleep');b.skipTurn();expect(b.allies[0].hp).toBe(hp-9-5);expect(b.allies[0].statuses.every(s=>s.remaining===1)).toBe(true);
  const c=new Battle(()=>0.99);c.allies[1].hp=0;c.allies[2].hp=0;c.allies[0].hp=1;c.applyStatus('astel','poison',1,1);c.act('defend');expect(c.result).toBe('defeat');expect(c.allies[0].statuses).toEqual([]);
 });
 it.each(['sleep','freeze'] as StatusId[])('%s automatically consumes a skipped turn and wakes on damage',id=>{
  const b=new Battle(()=>0);b.applyStatus('astel',id,1,2);expect(b.act('attack','enemy0').ok).toBe(false);expect(b.skipTurn().ok).toBe(true);expect(b.allies[0].statuses[0].remaining).toBe(1);
  b.enemyAct();expect(b.allies[0].statuses).toEqual([]);until(b,'astel');expect(b.blocked).toBeUndefined();expect(b.canUse('attack')).toBe(true);
 });
 it('paralysis rolls once per turn and silence blocks magic but not free commands',()=>{
  const b=new Battle(()=>0);b.applyStatus('astel','paralysis',1,2);expect(b.blocked).toBe('paralysis');expect(b.canUse('defend')).toBe(false);expect(b.skipTurn().ok).toBe(true);
  const c=new Battle(()=>0.99);c.applyStatus('astel','paralysis',1,2);expect(c.blocked).toBeUndefined();expect(c.canUse('attack')).toBe(true);
  until(c,'mei');c.applyStatus('mei','silence',1,2);expect(c.canUse('fire')).toBe(false);expect(c.canUse('heal')).toBe(false);expect(c.canUse('attack')).toBe(true);expect(c.canUse('defend')).toBe(true);c.clearStatus('mei');expect(c.canUse('fire')).toBe(true);
 });
 it('blind causes physical misses without blocking magic; burn lowers physical attack',()=>{
  const b=new Battle(()=>0.99);b.applyStatus('astel','blind',1,3);const before=b.enemies[0].hp;const r=b.act('attack','enemy0');expect(r.ok&&r.event.label).toBe('ミス');expect(b.enemies[0].hp).toBe(before);
  until(b,'mei');b.applyStatus('mei','blind',1,3);expect(b.act('fire','enemy0').ok).toBe(true);expect(b.enemies[0].hp).toBeLessThan(before);
  const u=hero();inflict(u,'burn',()=>0,1);expect(statValue(u,'attack')).toBeCloseTo(u.attack*0.8);
 });
 it('applies partial status resistance and reaches victory from a status tick',()=>{
  const u=hero();u.statusResistance.poison=0.5;expect(inflict(u,'poison',()=>0.4,0.8)).toBe(false);expect(inflict(u,'poison',()=>0.39,0.8)).toBe(true);
  const b=new Battle(()=>0.99);b.enemies[0].hp=0;b.enemies[1].hp=0;b.enemies[2].hp=1;until(b,'enemy2');
  b.applyStatus('enemy2','poison',1,1);b.applyStatus('enemy2','sleep',1,1);expect(b.skipTurn().ok).toBe(true);expect(b.result).toBe('victory');expect(b.current).toBeUndefined();
 });
 it('enemy definitions can apply status effects and cover redirects the status as well',()=>{
  const b=new Battle(()=>0);until(b,'rina');b.act('cover','astel');b.enemies[1].attackStatuses=[{id:'poison',chance:1,turns:2}];
  const r=b.enemyAct();expect(r.ok&&r.event.target).toBe('rina');expect(b.allies[1].statuses[0]?.id).toBe('poison');expect(b.allies[0].statuses).toEqual([]);
 });
 it('all units can sleep without softlocking and skipped enemies remain automated',()=>{
  const b=new Battle(()=>0.99);for(const u of b.units)b.applyStatus(u.id,'sleep',1,1);
  let skipped=0;for(let i=0;i<6;i++){expect(b.blocked).toBe('sleep');expect(b.skipTurn().ok).toBe(true);skipped++}
  expect(skipped).toBe(6);expect(b.round).toBe(2);expect(b.units.every(u=>!u.statuses.length)).toBe(true);expect(b.canUse('attack')).toBe(true);
 });
});
describe('element and modifier foundation',()=>{
 it.each(Object.keys(ELEMENTS) as Element[])('%s supports neutral, weakness and resistance (none always neutral)',element=>{
  const b=new Battle(()=>0.99);b.allies[0].attackElement=element;b.enemies[0].affinities[element]=1.5;
  const r=b.act('attack','enemy0');expect(r.ok&&r.event.amount).toBe(element==='none'?32:48);
  const u=hero();u.affinities[element]=0.5;expect(affinity(u,element)).toBe(element==='none'?1:0.5);
 });
 it('applies actual resistance, immunity and fixed fire element',()=>{
  const b=new Battle(()=>0.99);b.enemies[0].affinities.water=0.5;b.allies[0].attackElement='water';const r=b.act('strong','enemy0');expect(r.ok&&r.event.amount).toBe(32);
  const c=new Battle(()=>0.99);c.allies[0].attackElement='light';c.enemies[0].affinities.light=0;const immune=c.act('attack','enemy0');expect(immune.ok&&immune.event.amount).toBe(0);
  until(b,'mei');const fire=b.act('fire','enemy1');expect(fire.ok&&fire.event.element).toBe('fire');expect(fire.ok&&fire.event.amount).toBe(108);
 });
 it('adds same-sign stacks, caps, refreshes duration, combines debuffs and expires',()=>{
  const u=hero();modify(u,{stat:'attack',amount:0.5,turns:2});modify(u,{stat:'attack',amount:0.5,turns:3});
  expect(u.modifiers).toHaveLength(1);expect(statValue(u,'attack')).toBe(56);expect(u.modifiers[0].remaining).toBe(3);
  modify(u,{stat:'attack',amount:-0.25,turns:1});expect(statValue(u,'attack')).toBe(48);endTurn(u);expect(statValue(u,'attack')).toBe(56);
  endTurn(u);endTurn(u);expect(statValue(u,'attack')).toBe(32);expect(u.modifiers).toEqual([]);
  expect(modify(u,{stat:'speed',amount:Infinity,turns:2})).toBe(false);
 });
 it('modifies attack and defense damage and speed from the next round',()=>{
  const b=new Battle(()=>0.99);b.applyModifier('astel',{stat:'attack',amount:0.5,turns:2});b.applyModifier('enemy0',{stat:'defense',amount:0.5,turns:2});
  const r=b.act('attack','enemy0');expect(r.ok&&r.event.amount).toBe(32);
  const c=new Battle(()=>0.99);c.applyModifier('mei',{stat:'speed',amount:0.75,turns:3});expect(c.current?.id).toBe('astel');for(let i=0;i<6;i++){if(c.phase==='enemy')c.enemyAct();else c.act('defend')}expect(c.round).toBe(2);expect(c.current?.id).toBe('mei');
 });
 it('skill definitions execute status and modifier payloads and clones do not leak',()=>{
  const before=skills.strong.modifiers;skills.strong.modifiers=[{stat:'defense',amount:-0.25,turns:2}];
  try{const b=new Battle(()=>0);b.act('strong','enemy0');expect(b.enemies[0].modifiers[0].amount).toBe(-0.25)}finally{skills.strong.modifiers=before}
  const b=new Battle(()=>0);until(b,'mei');b.act('fire','enemy0');expect(b.enemies[0].statuses.some(s=>s.id==='burn')).toBe(true);expect(new Battle().enemies[0].statuses).toEqual([]);
 });
});
describe('progression and save migration',()=>{
 it('gains multiple levels with remainder, grows base stats and caps at max level',()=>{
  const p={level:1,experience:0};expect(gainExperience(p,260)).toBe(2);expect(p).toEqual({level:3,experience:10});const u=growUnit(hero(),p);expect(u.maxHp).toBe(204);expect(u.attack).toBe(38);expect(u.defense).toBe(12);expect(u.speed).toBe(26);expect(u.mp).toBe(u.maxMp);
  gainExperience(p,1000000);expect(p.level).toBe(PROGRESSION.maxLevel);expect(p.experience).toBe(0);expect(()=>gainExperience(p,-1)).toThrow();
 });
 it('migrates v1 counters, round-trips v2 and recovers malformed hero entries independently',()=>{
  let raw=JSON.stringify({version:1,started:true,wins:4,battles:7});const storage={getItem:()=>raw,setItem:(key:string,value:string)=>{expect(key).toBe(SAVE_KEY);raw=value}};
  const p=load(storage);expect(p.version).toBe(2);expect(p.wins).toBe(4);expect(p.battles).toBe(7);expect(p.party).toEqual(initialParty());gainExperience(p.party.astel,120);save(p,storage);expect(load(storage)).toEqual(p);
  const bad=JSON.parse(raw);bad.party.mei={level:-1,experience:100};raw=JSON.stringify(bad);const restored=load(storage);expect(restored.party.mei.level).toBe(1);expect(restored.party.astel.level).toBe(2);expect(restored.wins).toBe(4);
 });
 it('creates level-scaled battles and keeps base templates and old saves untouched until saving',()=>{
  const party=initialParty();gainExperience(party.astel,120);const b=new Battle(()=>0.99,party);expect(b.allies[0].level).toBe(2);expect(b.allies[0].attack).toBe(35);expect(b.experienceReward).toBe(120);expect(heroes[0].attack).toBe(32);expect(requiredExperience(2)).toBe(150);
 });
});
