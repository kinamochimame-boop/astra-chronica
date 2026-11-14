/// <reference types="vite/client" />
import {describe,it,expect} from 'vitest';
import {Battle,type BattleEvent} from '../src/battle';
import {AtbCombat} from '../src/atb-combat';
import {ULTIMATE_EP,epCost,WEAPON_CT,attackInterval} from '../src/atb-rules';
import {initialParty} from '../src/progression';
import {fresh,save,load,SAVE_KEY} from '../src/save';
import {treeNodes} from '../src/data/skill-tree';
import {normalizeHeroNodes} from '../src/skill-tree';
import {allWeapons,weapons,HERO_IDS} from '../src/data/weapons';
import {contexts,simulate,summaryContext,weaponWindow,skillTrials} from './balance-v36/harness';
const oldSaves=import.meta.glob<string>('./balance-v36/old-save-chapter-*.json',{query:'?raw',import:'default',eager:true});
function setup(){const party=initialParty();for(const u of Object.values(party))u.level=10;const b=new Battle(()=>.99,party);for(const e of b.enemies)e.hp=e.maxHp=100000;const c=new AtbCombat(b);c.auto=false;c.start();return {b,c}}

describe('v3.6 individual ultimate EP tuning, no combat rule changes',()=>{
 it.each([['astel','starSlash',3],['rina','oathShield',4],['mei','miracle',5]] as const)('%s %s exact cost, insufficient EP, refund and single debit', (hero,command,cost)=>{
  const {b,c}=setup(),u=b.allies.find(u=>u.id===hero)!,s=c.slot(hero);for(const a of b.allies)a.hp-=100;
  expect(epCost(u,command)).toBe(cost);s.ep=cost-1;
  expect(c.reserve(hero,command).ok).toBe(false);expect(s.ep).toBe(cost-1);expect(s.queue).toHaveLength(0);
  s.ep=15;s.busyUntil=1;const r=c.reserve(hero,command);expect(r.ok).toBe(true);expect(s.ep).toBe(15-cost);
  expect(c.cancel(hero,r.id!)).toBe(true);expect(s.ep).toBe(15);expect(c.cancel(hero,r.id!)).toBe(false);
  c.reserve(hero,command);const before=u.mp;c.advance(1);expect(s.ep).toBe(15-cost);expect(s.queue).toHaveLength(0);expect(u.mp).toBe(before);
 });
 it('four queued ultimates remain FIFO, capacity includes escrow, fifth rejected',()=>{const {c}=setup(),s=c.slot('astel');s.ep=15;s.busyUntil=10;for(let i=0;i<4;i++)expect(c.reserve('astel','starSlash','enemy0').ok).toBe(true);expect(s.ep).toBe(3);expect(c.reserve('astel','starSlash','enemy0').ok).toBe(false);expect(s.queue.map(r=>r.cost)).toEqual([3,3,3,3]);for(const r of [...s.queue])expect(c.cancel('astel',r.id)).toBe(true);expect(s.ep).toBe(15);});
 it('first-CT start wait and immediate reservation remain independent',()=>{const {b}=setup(),c=new AtbCombat(b);c.slot('astel').ep=3;expect(c.reserve('astel','starSlash','enemy0').ok).toBe(false);c.advance(100);expect(c.time).toBe(0);c.start();expect(c.chargeInterval('astel')).toBe(Math.max(0,attackInterval(b.allies[0])-4));expect(c.chargeInterval('enemy0')).toBe(attackInterval(b.enemies[0],false));let time=-1;c.onEvent=e=>{if(e.command==='starSlash')time=c.time};expect(c.reserve('astel','starSlash','enemy0').ok).toBe(true);c.advance(.01);expect(time).toBe(0);expect(c.slot('astel').firstAttack).toBe(true);});
 it('power and protection/cleanse retain their actual event values',()=>{const {b,c}=setup();for(const u of b.allies){u.hp-=120;u.statuses=[{id:'poison',remaining:3}]}const events:BattleEvent[]=[];c.onEvent=v=>{events.push(v)};c.slot('mei').ep=5;c.reserve('mei','miracle');c.advance(.01);expect(events.at(-1)!.effects!.map(v=>v.amount)).toEqual([120,120,120]);expect(b.allies.every(u=>!u.statuses.length)).toBe(true);c.slot('rina').ep=4;c.reserve('rina','oathShield');c.advance(.01);expect(b.allies.every(u=>u.barrierCharges===1)).toBe(true);c.slot('astel').ep=3;c.reserve('astel','starSlash','enemy0');c.advance(.01);expect(events.at(-1)!.damageTrace!.power).toBe(b.allies[0].attack*3.5);});
 it('measured ultimate damage per EP exceeds strong while potency stays fixed',()=>{const rows=skillTrials(),strong=rows.find(r=>r.command==='strong')!,star=rows.find(r=>r.command==='starSlash')!;expect(star.damagePerEp).toBeGreaterThan(strong.damagePerEp);expect(rows.find(r=>r.command==='miracle')!.healingPerEp).toBeGreaterThan(rows.find(r=>r.command==='heal')!.healingPerEp);expect(rows.find(r=>r.command==='oathShield')!.barriers).toBe(3)});
 it('EP table and all weapon CTs stay bounded and approved',()=>{expect(ULTIMATE_EP).toEqual({starSlash:3,oathShield:4,miracle:5});expect(WEAPON_CT).toEqual({dualBlades:6,sword:8,bow:10,shieldRapier:7,shieldSpear:8,shieldFlail:11,wand:7,rod:9,mace:10});expect(treeNodes).toHaveLength(90);const {b}=setup();expect(epCost(b.allies[0],'strong')).toBe(2);expect(epCost(b.allies[2],'heal')).toBe(2);});
});

describe('v3.6 honest reproducible measurement',()=>{
 it('covers every encounter once with earned XP and available inventory only',()=>{const rows=contexts();expect(rows).toHaveLength(109);expect(new Set(rows.map(r=>r.event)).size).toBe(109);expect(new Set(rows.map(r=>r.chapter)).size).toBe(18);expect(rows[0].progress.party.astel.level).toBe(1);expect(rows[1].progress.party.astel.level).toBe(2);for(const row of rows)for(const hero of HERO_IDS){const p=row.progress;expect(p.equipment.inventory[p.equipment.equipped[hero]!]).toBeGreaterThan(0);expect(normalizeHeroNodes(p.skillTree[hero],hero,p.party[hero].level)).toEqual(p.skillTree[hero])}expect(summaryContext(rows[0]).armor).toMatch(/not implemented/);});
 it('seed and policy reproduce full metrics without altering progress',()=>{const ctx=contexts()[0],before=structuredClone(ctx);const a=simulate(ctx,36,'tactical');expect(simulate(ctx,36,'tactical')).toEqual(a);expect(ctx).toEqual(before);expect(a.outcome).toBe('victory');expect(a.epGained).toBeLessThanOrEqual(a.normalHits);expect(a.consumed).toEqual({potion:0,ether:0});});
 it.each([1,2,3])('early tactical seed %s completes without virtual items',seed=>{const a=simulate(contexts()[0],seed,'tactical');expect(a.outcome).toBe('victory');expect(a.knockouts).toBe(0);expect(a.remaining.every(u=>u.hp>0)).toBe(true)});
 it('marks exhausted time budgets, rather than manufacturing a victory',()=>{expect(simulate(contexts()[0],36,'auto',undefined,.01).outcome).toBe('timeout')});
 it.each(weapons.map(w=>[w.id,w.family] as const))('training window %s uses real CT/EP and records cap losses',id=>{const r=weaponWindow(id,20,60,'auto');expect(r.seconds).toBe(60);expect(r.attacks).toBe(Math.floor((60-Math.max(0,r.ct-4))/r.ct)+1);expect(r.epCredited).toBe(Math.min(15,r.hits));expect(r.epCredited).toBe(r.epSpent+r.epRemaining);expect(r.damage).toBeGreaterThan(0)});
 it('dual blades preserve two actual hits, while single-hit weapon and skill do not duplicate',()=>{const d=weaponWindow('twinmoon-daggers',20,30,'auto'),s=weaponWindow('travelers-sword',20,30,'auto');expect(d.hits).toBe(d.attacks*2);expect(s.hits).toBe(s.attacks);expect(weaponWindow('travelers-sword',20,30,'tactical').skills.strong).toBeGreaterThan(0)});
 it.each([0,54,108])('old saves at encounter index %s retain progress/equipment/tree/items',index=>{const p=contexts('balanced')[index].progress;let value='';expect(save(p,{setItem:(key,data)=>{expect(key).toBe(SAVE_KEY);value=data}})).toBe(true);const restored=load({getItem:()=>value});expect(restored.version).toBe(2);expect(restored.party).toEqual(p.party);expect(restored.equipment).toEqual(p.equipment);expect(restored.skillTree).toEqual(p.skillTree);expect(restored.consumables).toEqual(p.consumables);expect(restored.adventure).toEqual(fresh().adventure);expect(allWeapons.length).toBeGreaterThan(9)});
 it.each(['01','09','18'])('actual v3.5.1 chapter %s save retains chapter flags and all owned growth data',chapter=>{
  const raw=JSON.parse(oldSaves['./balance-v36/old-save-chapter-'+chapter+'.json']);
  const p=load({getItem:()=>JSON.stringify(raw)});
  for(const key of ['party','equipment','skillTree','consumables','quests','choices','wins','battles'] as const)expect(p[key]).toEqual(raw[key]);
  for(const [id,state] of Object.entries(raw.adventure.chapters) as [string,{completed:string[]}][])expect(p.adventure.chapters[id].completed).toEqual(state.completed);
  const restored=load({getItem:()=>JSON.stringify(p)});expect(restored).toEqual(p);expect(p.version).toBe(2);
 });
});
