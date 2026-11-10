import {prerequisite,buildPrerequisite} from './legacy-fixtures-v25';
import {futureChaptersNotice} from '../src/chapter-selection';
import {describe,it,expect} from 'vitest';
import {chapters} from '../src/data/chapter-one';
import {chapterTwelve as c} from '../src/data/chapter-twelve';
import {gloomEnemies,gloomEncounters} from '../src/data/chapter-twelve-enemies';
import {chapterTwelveWeapons} from '../src/data/weapons';
import {sideQuests} from '../src/data/side-quests';
import {dialogueChoices} from '../src/data/dialogue-choices';
import {ready as beforeSeven,complete,arrange,battle,fight,until,ev} from './v15-helpers';
import {load} from '../src/save';
import {Battle} from '../src/battle';
import {heroes,cloneUnit,skills} from '../src/data/combat';
import {growUnit} from '../src/progression';
import {chapterOpen,chapterState,visitLocation,completeEvent,beginAdventureBattle,resolveAdventureBattle} from '../src/adventure';
import {acceptQuest,collectQuestObjective,claimQuest} from '../src/side-quests';
import {recordChoice} from '../src/dialogue-choices';
import {journalFor} from '../src/journal';
import {explorationRecord} from '../src/exploration-records';
import {seededRandom} from '../src/lab-session';
import {enterMap} from '../src/exploration/exploration-save';
import {walkMaps,symbolForEvent} from '../src/exploration/map-data';
import {equipWeapon} from '../src/equipment';
import {actorStyle} from '../src/battle-actors';
import {lightPathPhase} from '../src/exploration/light-path';
import {mainObjective} from '../src/exploration/objective';
export const ready=()=>prerequisite(11);
const qs=sideQuests.filter(q=>q.chapterId===c.id),choices=dialogueChoices.filter(q=>q.chapterId===c.id);
function quest(p:ReturnType<typeof ready>,id:string){const q=qs.find(q=>q.id===id)!;expect(acceptQuest(p,id)).toBe(true);for(const o of q.objectives){visitLocation(p.adventure,c,o.locationId);const f=walkMaps.flatMap(map=>map.objects.filter(o2=>o2.objectiveId===o.id).map(object=>({map,object})))[0];if(f){enterMap(p,f.map.id);Object.assign(p.world!,{x:f.object.x+32,y:f.object.y})}expect(collectQuestObjective(p,id,o.id)).toBe(true)}visitLocation(p.adventure,c,q.returnLocation);expect(claimQuest(p,id).ok).toBe(true)}
describe('chapter twelve story, save and choices',()=>{
 it('future notice never labels implemented chapters as unavailable',()=>{expect(futureChaptersNotice()).toBe('第18章：今後の更新予定。現在はプレイできません。')});
 it('registers exact sixteen locations, twenty-eight events, five choices, three quests and no chapter thirteen',()=>{expect(chapters).toHaveLength(17);expect(c.locations.map(l=>l.id)).toEqual('road village woods watch lake ridge roots shelter shrine garden archive channel gate vault altar core'.split(' ').map(x=>'c12-'+x));expect(c.events).toHaveLength(28);expect(new Set(c.events.map(e=>e.id)).size).toBe(28);expect(c.events.every(e=>e.pages.length&&e.pages.every(p=>p.text.length>10))).toBe(true);expect(qs).toHaveLength(3);expect(choices).toHaveLength(5);expect(chapters.some(c=>c.id==='chapter-18')).toBe(false)});
 it('eleventh clear gates twelfth and locked maps/locations cannot be entered',()=>{const p=beforeSeven();for(const ch of chapters.slice(6,10))complete(p,ch);expect(chapterOpen(p.adventure,c)).toBe(false);expect(enterMap(p,'gloom-road')).toBe(false);complete(p,chapters[10]);expect(chapterOpen(p.adventure,c)).toBe(true);expect(enterMap(p,'gloom-road')).toBe(true);expect(visitLocation(p.adventure,c,'c12-core')).toBe(false)});
 it('all events grant six wins and three weapons once without changing older chapters',()=>{const p=ready(),old=structuredClone(p);complete(p,c);expect(chapterState(p.adventure,c).completed).toHaveLength(28);expect(p.wins-old.wins).toBe(6);for(const ch of chapters.slice(0,11))expect(p.adventure.chapters[ch.id]).toEqual(old.adventure.chapters[ch.id]);expect(p.adventure.landmarks).toEqual(old.adventure.landmarks);expect(p.adventure.timeStates).toEqual(old.adventure.timeStates);expect(p.skillTree).toEqual(old.skillTree);for(const w of chapterTwelveWeapons)expect(p.equipment.inventory[w.id]).toBe(1);const full=structuredClone(p);complete(p,c);expect(p).toEqual(full);expect(load({getItem:()=>JSON.stringify(p)})).toEqual(p)});
 it('all thirty-two choice combinations complete and confirmed choices cannot be replaced',()=>{for(let mask=0;mask<32;mask++){const p=ready();for(const e of c.events){if(e.choiceId){arrange(p,c,e.id);const q=choices.find(q=>q.id===e.choiceId)!,i=(mask>>choices.indexOf(q))&1;expect(recordChoice(p,q.id,q.options[i].id)).toBe(true);expect(recordChoice(p,q.id,q.options[1-i].id)).toBe(false)}complete(p,c,e.id)}expect(chapterState(p.adventure,c).completed).toHaveLength(28)}});
 it('puzzle rejects wrong order, resets safely via reload and completes once',()=>{const p=ready();complete(p,c,'c12-gate-tune');arrange(p,c,'c12-vault-code');const before=structuredClone(p);expect(completeEvent(p,c,'c12-vault-code',['divide','receive','pass']).ok).toBe(false);expect(p).toEqual(before);const q=load({getItem:()=>JSON.stringify(p)});expect(completeEvent(q,c,'c12-vault-code',['receive','divide','pass']).ok).toBe(true);expect(completeEvent(q,c,'c12-vault-code',['receive','divide','pass']).ok).toBe(false)});
 it.each(qs)('$id is completable before and after clear with one reward',q=>{for(const after of [false,true]){const p=ready();complete(p,c,after?'c12-clear':'c12-promise');quest(p,q.id);const before=structuredClone(p);expect(claimQuest(p,q.id).ok).toBe(false);expect(p).toEqual(before);expect(load({getItem:()=>JSON.stringify(p)}).quests[q.id]).toEqual(p.quests[q.id])}});
 it.each(['potion','ether'] as const)('%s cap leaves the report unclaimed',item=>{const p=ready();complete(p,c);const q=qs.find(q=>q.reward.item===item)!;quest(p,q.id);p.quests[q.id].claimed=false;p.consumables[item]=98;expect(claimQuest(p,q.id).ok).toBe(false);expect(p.quests[q.id].claimed).toBe(false);p.consumables[item]=96;expect(claimQuest(p,q.id).ok).toBe(true);expect(p.consumables[item]).toBe(99)});
 it('eight journal articles and exploration completion reveal only confirmed facts',()=>{const p=ready();expect(journalFor(p,c).entries).toEqual([]);expect(JSON.stringify(mainObjective(p.adventure,c))).not.toContain('アストラヴォア');complete(p,c,'c12-arrival');expect(journalFor(p,c).entries).toHaveLength(1);complete(p,c);expect(journalFor(p,c).entries).toHaveLength(8);expect(explorationRecord(p,c).denominator).toBe(47);expect(explorationRecord(p,c).percent).toBe(93);for(const q of qs)quest(p,q.id);expect(explorationRecord(p,c).percent).toBe(100)});
 it('v1.9 save and unknown twelfth fields preserve eleven chapters and do not invent choices/tides',()=>{const p=ready(),q=load({getItem:()=>JSON.stringify({...p,tide:'high',objective:'spoiler'})});expect(q).toEqual(p);expect(q.adventure.chapters[c.id]).toBeUndefined();expect(lightPathPhase(q.adventure)).toBe('dark');expect(enterMap(q,'gloom-core')).toBe(false);const raw=structuredClone(p);raw.adventure.chapters[c.id]={currentLocationId:'bad',completed:['unknown','c12-clear']};raw.choices['c12-luna']='bad';const safe=load({getItem:()=>JSON.stringify(raw)});expect(chapterState(safe.adventure,c).completed).toEqual([]);for(const ch of chapters.slice(0,11))expect(safe.adventure.chapters[ch.id]).toEqual(p.adventure.chapters[ch.id])});
});
describe('chapter twelve combat profiles and gear',()=>{
 it('six regular enemies/two bosses reuse existing elements/statuses',()=>{expect(Object.keys(gloomEnemies)).toHaveLength(8);expect(Object.keys(gloomEncounters)).toHaveLength(6);for(const e of Object.values(gloomEnemies))for(const el of Object.keys(e.affinities))expect(['fire','water','wind','earth','light','dark','none']).toContain(el);expect(gloomEnemies.larva.enemyPattern).toBe('gloomLarva')});
 it.each(Object.keys(gloomEncounters))('%s allows valid deterministic turns',id=>{const b=battle(ready(),id,seededRandom(38));for(let n=0;n<20&&!b.result;n++){if(b.blocked)b.skipTurn();else if(b.phase==='enemy')expect(b.enemyAct().ok).toBe(true);else expect(b.act('attack',b.enemies.find(e=>e.hp>0)!.id).ok).toBe(true)}expect(b.units.every(u=>u.hp>=0&&u.mp>=0)).toBe(true)});
 it.each(['golem','sprite','beast','sentinel','wisp','larva'] as const)('%s executes its configured behavior',key=>{const u=gloomEnemies[key],b=new Battle(()=>.01,ready().party,undefined,undefined,{name:key,enemies:[{...u,id:'enemy0'}]});until(b,'enemy0');const e=ev(b.enemyAct());if(key==='golem')expect(b.enemies[0].defense).toBe(44);if(key==='sprite'){expect(e.element).toBe('wind');expect(b.allies.some(a=>a.statuses.some(s=>s.id==='blind'))).toBe(true)}if(key==='beast')expect(b.allies.some(a=>a.statuses.some(s=>s.id==='paralysis'))).toBe(true);if(key==='wisp'){expect(e.element).toBe('fire');expect(b.allies.some(a=>a.statuses.some(s=>s.id==='burn'))).toBe(true)}if(key==='sentinel'){until(b,'enemy0');expect(ev(b.enemyAct()).label).toBe('反撃態勢')}if(key==='larva'){until(b,'enemy0');expect(ev(b.enemyAct()).hint).toContain('食星弾');until(b,'enemy0');expect(ev(b.enemyAct()).actionName).toBe('食星弾')}});
 it('guardian arms counter and a warned earth AoE with existing per-hit guards/barriers',()=>{const b=battle(ready(),'gloom-guardian'),boss=b.enemies[0];until(b,boss.id);b.enemyAct();until(b,boss.id);expect(ev(b.enemyAct()).hint).toContain('生存する味方全体');expect(boss.counterReady).toBe(true);until(b,'astel');expect(ev(b.act('attack',boss.id)).reactions).toHaveLength(1);until(b,boss.id);for(const u of b.allies)u.barrierCharges=1;const e=ev(b.enemyAct());expect(e.actionName).toBe('根縛りの奔流');expect(e.effects).toHaveLength(3);expect(e.effects!.every(e=>e.element==='earth'&&e.damageTrace?.barrierMultiplier===.5)).toBe(true)});
 it('Astravore starts with a single attack and retains phase-two charge through sleep into phase three',()=>{const b=battle(ready(),'gloom-astravore'),boss=b.enemies[0];until(b,boss.id);expect(ev(b.enemyAct()).amount).toBeGreaterThan(0);boss.hp=Math.floor(boss.maxHp*.6);until(b,boss.id);expect(ev(b.enemyAct()).hint).toContain('閉季の星波');boss.hp=Math.floor(boss.maxHp*.2);boss.statuses.push({id:'sleep',remaining:1});until(b,boss.id);b.skipTurn();until(b,boss.id);const e=ev(b.enemyAct());expect(e.actionName).toBe('閉季の星波');expect(e.effects!.every(part=>part.damageTrace?.power===134)).toBe(true);until(b,boss.id);b.enemyAct();until(b,boss.id);expect(ev(b.enemyAct()).hint).toContain('暴走する星脈')});
 it.each(chapterTwelveWeapons)('$id applies real combat stats and correct silhouette, owner restricted',w=>{const p=ready();complete(p,c);expect(equipWeapon(p.equipment,w.owner,w.id)).toBe(true);const b=battle(p,'gloom-road'),u=b.allies.find(u=>u.id===w.owner)!;expect(u.weaponId).toBe(w.id);const base=growUnit(cloneUnit(heroes.find(h=>h.id===w.owner)!),p.party[w.owner]);for(const [stat,amount] of Object.entries(w.bonuses))expect(u[stat as keyof typeof u]).toBe((base[stat as keyof typeof base] as number)+amount);expect(actorStyle(u,true).family).toBe(w.family);expect(equipWeapon(p.equipment,w.owner==='astel'?'mei':'astel',w.id)).toBe(false);expect(equipWeapon(p.equipment,w.owner,w.id)).toBe(true);expect(battle(p,'gloom-road').allies.find(u=>u.id===w.owner)!.attack).toBe(u.attack);if(w.owner==='mei'){until(b,'mei');const fire=ev(b.act('fire',b.enemies[0].id));expect(fire.damageTrace!.power).toBeCloseTo(skills.fire.power!*1.27)}});
 it.each([false,true])('twenty full chapter seeds, quests=%s, without mandatory high-level nodes',all=>{for(let seed=1;seed<=20;seed++){const p=ready();for(const e of c.events){arrange(p,c,e.id);if(e.encounter)expect(fight(battle(p,e.encounter,seededRandom(seed))),`${seed}/${e.id}`).toBe('victory');complete(p,c,e.id);if(all&&e.id==='c12-promise')for(const q of qs)quest(p,q.id)}expect(chapterState(p.adventure,c).completed).toHaveLength(28)}});
});
describe('twelfth symbol receipts',()=>{
 it.each(['victory','defeat'] as const)('%s settles once and restores the road at a safe entry',result=>{const p=ready();complete(p,c,'c12-arrival');arrange(p,c,'c12-road-fight');const f=symbolForEvent('c12-road-fight')!,serial=beginAdventureBattle(p,c,f.symbol.eventId,{mapId:f.map.id,symbolId:f.symbol.id,position:f.symbol})!,wins=p.wins;expect(beginAdventureBattle(p,c,f.symbol.eventId,{mapId:f.map.id,symbolId:f.symbol.id,position:f.symbol})).toBeUndefined();expect(resolveAdventureBattle(p,serial,result).applied).toBe(true);expect(p.world!).toMatchObject(f.map.entry);expect(p.wins).toBe(wins+(result==='victory'?1:0));const before=structuredClone(p);expect(resolveAdventureBattle(p,serial,result).applied).toBe(false);expect(p).toEqual(before)});
 it('interrupted contact grants no XP or result and no unsafe return',()=>{const p=ready();complete(p,c,'c12-arrival');arrange(p,c,'c12-road-fight');const f=symbolForEvent('c12-road-fight')!,serial=beginAdventureBattle(p,c,f.symbol.eventId,{mapId:f.map.id,symbolId:f.symbol.id,position:f.symbol})!,q=load({getItem:()=>JSON.stringify(p)});expect(q.party).toEqual(p.party);expect(q.wins).toBe(p.wins);expect(q.adventure.pending).toBeUndefined();expect(q.world!.recovered).toBe(true);expect(resolveAdventureBattle(q,serial,'victory').applied).toBe(false)});
});

describe('forest-specific battle tactics',()=>{
 it('AstraVore phase one uses physical roots even on its second action',()=>{const b=battle(ready(),'gloom-astravore');for(let i=0;i<2;i++){until(b,'enemy0');const e=ev(b.enemyAct());expect(e.command).toBe('attack');expect(e.damageTrace?.power).toBe(b.enemies[0].attack)}});
 it('root guardian binds with existing paralysis and no new status ID',()=>{const b=battle(ready(),'gloom-guardian',()=>.01);until(b,'enemy0');b.enemyAct();expect(b.allies.some(a=>a.statuses.some(s=>s.id==='paralysis'))).toBe(true)});
 it('star absorption is per actual recipient after real damage, bounded at zero',()=>{const b=battle(ready(),'gloom-astravore');b.enemies[0].hp=Math.floor(b.enemies[0].maxHp*.6);until(b,'enemy0');b.enemyAct();until(b,'enemy0');expect(ev(b.enemyAct()).hint).toContain('閉季の星波');for(const a of b.allies)a.star=60;until(b,'enemy0');const e=ev(b.enemyAct());expect(e.effects).toHaveLength(3);expect(b.allies.map(a=>a.star)).toEqual([50,50,50]);expect(e.logs.join(' ')).toContain('星力が20吸収');for(const a of b.allies)a.star=0;until(b,'enemy0');b.enemyAct();expect(b.allies.every(a=>a.star>=0)).toBe(true)});
 it('zero HP loss never drains star, even during the all-target release',()=>{const b=battle(ready(),'gloom-astravore');b.enemies[0].hp=Math.floor(b.enemies[0].maxHp*.6);until(b,'enemy0');b.enemyAct();until(b,'enemy0');b.enemyAct();for(const a of b.allies){a.affinities.dark=0;a.star=60}until(b,'enemy0');const e=ev(b.enemyAct());expect(e.effects!.every(p=>p.hpLoss===0)).toBe(true);expect(b.allies.map(a=>a.star)).toEqual([60,60,60]);expect(e.logs.join(' ')).not.toContain('吸収された')});
});

describe('star absorption and existing protection',()=>{
 it('AoE keeps all three recipients despite taunt, and drains the actual cover bearer per hit',()=>{
  const b=battle(ready(),'gloom-astravore');b.enemies[0].hp=Math.floor(b.enemies[0].maxHp*.6);
  until(b,'enemy0');b.enemyAct();until(b,'enemy0');b.enemyAct();until(b,'enemy0');
  for(const a of b.allies)a.star=60;const rina=b.allies[1],mei=b.allies[2];rina.tauntRounds=2;rina.covering=mei.id;
  const hp=mei.hp,e=ev(b.enemyAct());expect(e.effects!.map(p=>p.target)).toEqual(['astel','rina','rina']);expect(e.effects![2].covered).toBe(true);expect(mei.hp).toBe(hp);expect(b.allies.map(a=>a.star)).toEqual([50,40,60]);
 });
});

describe('populated legacy progression',()=>{
 it('retains all ninety acquired nodes, old claimed quests and equipped quantities through chapter clear and reload',async()=>{
  const {treeNodes}=await import('../src/data/skill-tree');const p=ready();
  for(const hero of ['astel','rina','mei'] as const)p.skillTree[hero]=treeNodes.filter(n=>n.hero===hero).map(n=>n.id);
  p.equipment.inventory['whitestar-dual-blades']=2;p.equipment.equipped={astel:'whitestar-dual-blades',rina:'pilgrim-shield-flail',mei:'starvoice-wand'};
  p.quests['sq-returning-pilgrim']={accepted:true,objectives:['pilgrim-strap','pilgrim-mark'],claimed:true};
  const q=load({getItem:()=>JSON.stringify(p)}),old=structuredClone(q);expect(Object.values(q.skillTree).flat()).toHaveLength(90);
  complete(q,c);const restored=load({getItem:()=>JSON.stringify(q)});
  expect(restored.skillTree).toEqual(old.skillTree);expect(restored.equipment.equipped).toEqual(old.equipment.equipped);expect(restored.equipment.inventory['whitestar-dual-blades']).toBe(2);expect(restored.quests['sq-returning-pilgrim']).toEqual(old.quests['sq-returning-pilgrim']);expect(restored.choices).toMatchObject(old.choices);expect(restored.wins-old.wins).toBe(6);expect(restored.adventure.chapters['chapter-12'].completed).toHaveLength(28);
 });
});

describe('chapter12 deterministic prerequisite isolation',()=>{
 it('matches the original complete API setup exactly',()=>{expect(ready()).toEqual(buildPrerequisite(11))});
 it('does not share mutable party,inventory,choices or event receipts',()=>{const a=ready(),b=ready(),snapshot=structuredClone(b);a.party.astel.level=1;a.equipment.inventory['travelers-sword']=999;a.choices['probe']='probe';a.adventure.chapters['chapter-01'].completed.length=0;expect(b).toEqual(snapshot);expect(ready()).toEqual(snapshot)});
});
