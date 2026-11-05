import {describe,it,expect} from 'vitest';
import {LabSession,seededRandom} from '../src/lab-session';
import {statValue} from '../src/effects';
import {ELEMENTS} from '../src/data/effects';
import type {Element,StatusId} from '../src/types';
const lab=()=>new LabSession(()=>0.99);
function toActor(s:LabSession,id:string){for(let i=0;i<12&&s.battle.current?.id!==id;i++)s.step('defend',true);expect(s.battle.current?.id).toBe(id)}
describe('v0.4 deterministic lab scenarios',()=>{
 it.each(['sleep','freeze'] as StatusId[])('%s expires naturally after three own opportunities without damage',id=>{
  const s=lab();s.enemyAttacksEnabled=false;s.inflict(id,1,3);const hp=s.battle.allies[0].hp;
  for(const remaining of [2,1,0]){expect(s.targetOpportunity().ok).toBe(true);expect(s.battle.allies[0].statuses.find(a=>a.id===id)?.remaining??0).toBe(remaining);expect(s.battle.allies[0].hp).toBe(hp)}
  expect(s.logs.join('\n')).toContain(`${id==='sleep'?'睡眠':'凍結'}：期限切れ`);expect(s.lastOpportunity).toContain('1 → 0');
  toActor(s,'astel');expect(s.battle.canUse('attack')).toBe(true);
 });
 it.each(['sleep','freeze'] as StatusId[])('%s wakes on attack without waiting for duration expiry',id=>{
  const s=lab();s.effectTarget='enemy0';s.inflict(id,1,3);s.step('attack');expect(s.battle.enemies[0].statuses).toEqual([]);expect(s.logs.join('\n')).toContain('被攻撃');expect(s.logs.join('\n')).not.toContain('期限切れ');
 });
 it('enemy attack suppression waits, keeps turn processing, and can be switched off',()=>{
  const s=lab();s.enemyAttacksEnabled=false;s.step('defend');const hp=s.battle.allies.map(u=>u.hp);expect(s.battle.phase).toBe('enemy');s.step();expect(s.battle.allies.map(u=>u.hp)).toEqual(hp);expect(s.logs.join('\n')).toContain('検証用に待機');
  s.enemyAttacksEnabled=true;s.step('defend');s.step();expect(s.battle.allies.some((u,i)=>u.hp<hp[i])).toBe(true);
 });
 it('disabled enemy attacks still process poison damage and duration expiry',()=>{const s=lab();s.enemyAttacksEnabled=false;s.step('defend');s.effectTarget='enemy0';s.inflict('poison',1,1);const hp=s.battle.enemies[0].hp;s.step();expect(s.battle.enemies[0].hp).toBe(hp-12);expect(s.battle.enemies[0].statuses).toEqual([]);expect(s.logs.join(' ')).toContain('毒：期限切れ')});
 it.each([0,0.99])('paralysis uses stable roll %s and consumes exactly three opportunities',random=>{
  const s=new LabSession(()=>random);s.inflict('paralysis',1,3);
  for(const left of [2,1,0]){toActor(s,'astel');expect(!!s.battle.blocked).toBe(random===0);s.targetOpportunity();expect(s.battle.allies[0].statuses[0]?.remaining??0).toBe(left)}
  toActor(s,'astel');expect(s.battle.blocked).toBeUndefined();
 });
 it('silence blocks three magic opportunities, never consumes MP on rejection, and allows the fourth',()=>{
  const s=lab();s.effectTarget='mei';s.inflict('silence',1,3);s.attackTarget='enemy0';
  for(let n=0;n<3;n++){toActor(s,'mei');expect(s.battle.canUse('fire')).toBe(false);const mp=s.battle.current!.mp;expect(s.step('fire').ok).toBe(false);expect(s.logs.join(' ')).toContain('沈黙でファイアを使用不可');expect(s.battle.current!.mp).toBe(mp);s.targetOpportunity()}
  toActor(s,'mei');expect(s.battle.canUse('fire')).toBe(true);expect(s.step('fire').ok).toBe(true);
 });
 it('stacks attack buffs and expires them without changing base stats',()=>{
  const s=lab();for(let i=0;i<2;i++)s.modify({stat:'attack',amount:0.25,turns:3});expect(statValue(s.battle.allies[0],'attack')).toBe(48);
  for(let i=0;i<3;i++)s.targetOpportunity();expect(statValue(s.battle.allies[0],'attack')).toBe(32);expect(s.logs.join('\n')).toContain('能力補正重複');expect(s.logs.join('\n')).toContain('解除（期限切れ）');
 });
 it('keeps current round fixed, moves Mei in round 2 and restores order in round 4',()=>{
  const s=lab(),original=s.battle.roundOrder.map(x=>x.id);s.effectTarget='mei';s.modify({stat:'speed',amount:0.5,turns:3});
  expect(s.battle.roundOrder.map(x=>x.id)).toEqual(original);expect(s.battle.projectedOrder[1].id).toBe('mei');
  s.nextRound();expect(s.battle.round).toBe(2);expect(s.battle.roundOrder[1]).toEqual({id:'mei',speed:24});
  s.nextRound();expect(s.battle.roundOrder[1].id).toBe('mei');s.nextRound();expect(s.battle.round).toBe(4);expect(s.battle.roundOrder.map(x=>x.id)).toEqual(original);expect(statValue(s.battle.allies[2],'speed')).toBe(16);
 });
 it('Astel +25% legitimately remains first in the next round',()=>{const s=lab();s.modify({stat:'speed',amount:0.25,turns:3});s.nextRound();expect(s.battle.roundOrder[0]).toEqual({id:'astel',speed:30})});
 it.each(Object.keys(ELEMENTS) as Element[])('%s weakness/resistance uses actual damage and trace factors',element=>{
  for(const multiplier of [1.5,0.5]){const s=lab();s.battle.allies[0].attackElement=element;s.battle.enemies[0].affinities[element]=multiplier;const result=s.step('attack');expect(result.ok).toBe(true);if(result.ok){expect(result.event.amount).toBe(element==='none'?32:32*multiplier);expect(result.event.damageTrace?.elementMultiplier).toBe(element==='none'?1:multiplier)}}
 });
 it('never conflates effect target and attack target and auto-selects the next living enemy',()=>{
  const s=lab();s.attackTarget='enemy1';s.effectTarget='astel';s.modify({stat:'attack',amount:0.25,turns:3});expect(s.attackTarget).toBe('enemy1');expect(s.step().ok).toBe(true);expect(s.battle.enemies[1].hp).toBe(220);expect(s.effectTarget).toBe('astel');
  const c=lab();c.battle.enemies[0].hp=1;c.step();expect(c.attackTarget).toBe('enemy1');expect(c.logs.join('\n')).toContain('攻撃対象切替');expect(c.effectTarget).toBe('astel');
 });
 it('seeded rolls replay exactly and timing snapshots do not mutate round decisions',()=>{const a=seededRandom(),b=seededRandom();expect(Array.from({length:30},()=>a())).toEqual(Array.from({length:30},()=>b()));const s=lab();const order=s.battle.roundOrder;order[0].speed=999;expect(s.battle.roundOrder[0].speed).toBe(24)});
});
