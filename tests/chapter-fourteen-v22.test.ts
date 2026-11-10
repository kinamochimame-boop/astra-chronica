import {futureChaptersNotice} from '../src/chapter-selection';
import {describe,it,expect} from 'vitest';
import {chapters} from '../src/data/chapter-one';
import {chapterFourteen as c} from '../src/data/chapter-fourteen';
import {arkEnemies,arkEncounters} from '../src/data/chapter-fourteen-enemies';
import {chapterFourteenWeapons} from '../src/data/weapons';
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
import {gravityPhase} from '../src/exploration/gravity';
import {mainObjective} from '../src/exploration/objective';
const buildLegacy=()=>{const p=beforeSeven();for(const ch of chapters.slice(6,13))complete(p,ch);return p};
// This deterministic prerequisite is shared; every scenario still owns a deep copy.
const legacyBaseline=buildLegacy();
export const ready=()=>structuredClone(legacyBaseline);
const qs=sideQuests.filter(q=>q.chapterId===c.id),choices=dialogueChoices.filter(q=>q.chapterId===c.id);
function quest(p:ReturnType<typeof ready>,id:string){const q=qs.find(q=>q.id===id)!;expect(acceptQuest(p,id)).toBe(true);for(const o of q.objectives){visitLocation(p.adventure,c,o.locationId);const f=walkMaps.flatMap(map=>map.objects.filter(o2=>o2.objectiveId===o.id).map(object=>({map,object})))[0];if(f){enterMap(p,f.map.id);Object.assign(p.world!,{x:f.object.x+32,y:f.object.y})}expect(collectQuestObjective(p,id,o.id)).toBe(true)}visitLocation(p.adventure,c,q.returnLocation);expect(claimQuest(p,id).ok).toBe(true)}
describe('chapter fourteen prerequisite fixture isolation',()=>{
 it('cached prerequisite equals the complete original thirteen-chapter API setup',()=>{expect(ready()).toEqual(buildLegacy())});
 it('nested changes in one scenario never reach another or the cached prerequisite',()=>{const first=ready(),untouched=ready();first.party.astel.level=1;first.adventure.chapters['chapter-01'].completed.length=0;first.equipment.equipped.astel=null;first.skillTree.astel.push('fixture-mutation');first.consumables.potion=0;expect(ready()).toEqual(untouched);expect(first).not.toEqual(untouched)});
});
describe('chapter fourteen story, save and choices',()=>{
 it('future notice never labels implemented chapters as unavailable',()=>{expect(futureChaptersNotice()).toBe('第18章：今後の更新予定。現在はプレイできません。')});
 it('registers exact sixteen locations, twenty-eight events, five choices, three quests and no chapter fifteen',()=>{expect(chapters).toHaveLength(17);expect(c.locations.map(l=>l.id)).toEqual('gateway shore dock deck hall beacon gravity refuge records garden sanctuary bridge gate charts altar core'.split(' ').map(x=>'c14-'+x));expect(c.events).toHaveLength(28);expect(new Set(c.events.map(e=>e.id)).size).toBe(28);expect(c.events.every(e=>e.pages.length&&e.pages.every(p=>p.text.length>10))).toBe(true);expect(qs).toHaveLength(3);expect(choices).toHaveLength(5);expect(chapters.some(c=>c.id==='chapter-18')).toBe(false)});
 it('thirteenth clear gates thirteenth and locked maps/locations cannot be entered',()=>{const p=beforeSeven();for(const ch of chapters.slice(6,12))complete(p,ch);expect(chapterOpen(p.adventure,c)).toBe(false);expect(enterMap(p,'ark-gateway')).toBe(false);complete(p,chapters[12]);expect(chapterOpen(p.adventure,c)).toBe(true);expect(enterMap(p,'ark-gateway')).toBe(true);expect(visitLocation(p.adventure,c,'c14-core')).toBe(false)});
 it('all events grant six wins and three weapons once without changing older chapters',()=>{const p=ready(),old=structuredClone(p);complete(p,c);expect(chapterState(p.adventure,c).completed).toHaveLength(28);expect(p.wins-old.wins).toBe(6);for(const ch of chapters.slice(0,13))expect(p.adventure.chapters[ch.id]).toEqual(old.adventure.chapters[ch.id]);expect(p.adventure.landmarks).toEqual(old.adventure.landmarks);expect(p.adventure.timeStates).toEqual(old.adventure.timeStates);expect(p.skillTree).toEqual(old.skillTree);for(const w of chapterFourteenWeapons)expect(p.equipment.inventory[w.id]).toBe(1);const full=structuredClone(p);complete(p,c);expect(p).toEqual(full);expect(load({getItem:()=>JSON.stringify(p)})).toEqual(p)});
 it('all thirty-two choice combinations complete and confirmed choices cannot be replaced',()=>{for(let mask=0;mask<32;mask++){const p=ready();for(const e of c.events){if(e.choiceId){arrange(p,c,e.id);const q=choices.find(q=>q.id===e.choiceId)!,i=(mask>>choices.indexOf(q))&1;expect(recordChoice(p,q.id,q.options[i].id)).toBe(true);expect(recordChoice(p,q.id,q.options[1-i].id)).toBe(false)}complete(p,c,e.id)}expect(chapterState(p.adventure,c).completed).toHaveLength(28)}});
 it('puzzle rejects wrong order, resets safely via reload and completes once',()=>{const p=ready();complete(p,c,'c14-gate-tune');arrange(p,c,'c14-gravity-stabilize');const before=structuredClone(p);expect(completeEvent(p,c,'c14-gravity-stabilize',['route','anchor','balance']).ok).toBe(false);expect(p).toEqual(before);const q=load({getItem:()=>JSON.stringify(p)});expect(completeEvent(q,c,'c14-gravity-stabilize',['anchor','route','balance']).ok).toBe(true);expect(completeEvent(q,c,'c14-gravity-stabilize',['anchor','route','balance']).ok).toBe(false)});
 it.each(qs)('$id is completable before and after clear with one reward',q=>{for(const after of [false,true]){const p=ready();complete(p,c,after?'c14-clear':'c14-promise');quest(p,q.id);const before=structuredClone(p);expect(claimQuest(p,q.id).ok).toBe(false);expect(p).toEqual(before);expect(load({getItem:()=>JSON.stringify(p)}).quests[q.id]).toEqual(p.quests[q.id])}});
 it.each(['potion','ether'] as const)('%s cap leaves the report unclaimed',item=>{const p=ready();complete(p,c);const q=qs.find(q=>q.reward.item===item)!;quest(p,q.id);p.quests[q.id].claimed=false;p.consumables[item]=98;expect(claimQuest(p,q.id).ok).toBe(false);expect(p.quests[q.id].claimed).toBe(false);p.consumables[item]=96;expect(claimQuest(p,q.id).ok).toBe(true);expect(p.consumables[item]).toBe(99)});
 it('eight journal articles and exploration completion reveal only confirmed facts',()=>{const p=ready();expect(journalFor(p,c).entries).toEqual([]);expect(JSON.stringify(mainObjective(p.adventure,c))).not.toContain('ノアゼロ');complete(p,c,'c14-arrival');expect(journalFor(p,c).entries).toHaveLength(1);complete(p,c);expect(journalFor(p,c).entries).toHaveLength(8);expect(explorationRecord(p,c).denominator).toBe(47);expect(explorationRecord(p,c).percent).toBe(93);for(const q of qs)quest(p,q.id);expect(explorationRecord(p,c).percent).toBe(100)});
 it('v2.0 save and unknown thirteenth fields preserve thirteen chapters and do not invent choices/tides',()=>{const p=ready(),q=load({getItem:()=>JSON.stringify({...p,tide:'high',objective:'spoiler'})});expect(q).toEqual(p);expect(q.adventure.chapters[c.id]).toBeUndefined();expect(gravityPhase(q.adventure)).toBe('normal');expect(enterMap(q,'ark-core')).toBe(false);const raw=structuredClone(p);raw.adventure.chapters[c.id]={currentLocationId:'bad',completed:['unknown','c14-clear']};raw.choices['c14-keeper']='bad';const safe=load({getItem:()=>JSON.stringify(raw)});expect(chapterState(safe.adventure,c).completed).toEqual([]);for(const ch of chapters.slice(0,13))expect(safe.adventure.chapters[ch.id]).toEqual(p.adventure.chapters[ch.id])});
});
describe('chapter fourteen combat profiles and gear',()=>{
 it('six regular enemies/two bosses reuse existing elements/statuses',()=>{expect(Object.keys(arkEnemies)).toHaveLength(8);expect(Object.keys(arkEncounters)).toHaveLength(6);for(const e of Object.values(arkEnemies))for(const el of Object.keys(e.affinities))expect(['fire','water','wind','earth','light','dark','none']).toContain(el);expect(arkEnemies.eater.enemyPattern).toBe('voidWatcher')});
 it.each(Object.keys(arkEncounters))('%s allows valid deterministic turns',id=>{const b=battle(ready(),id,seededRandom(38));for(let n=0;n<20&&!b.result;n++){if(b.blocked)b.skipTurn();else if(b.phase==='enemy')expect(b.enemyAct().ok).toBe(true);else expect(b.act('attack',b.enemies.find(e=>e.hp>0)!.id).ok).toBe(true)}expect(b.units.every(u=>u.hp>=0&&u.mp>=0)).toBe(true)});
 it.each(['scout','guard','drone','repair','phantom','eater'] as const)('%s executes its real behavior',key=>{const b=new Battle(()=>.01,ready().party,undefined,undefined,{name:key,enemies:[{...arkEnemies[key],id:'enemy0'}]});until(b,'enemy0');const e=ev(b.enemyAct());if(key==='scout')expect(b.enemies[0].speed).toBe(78);if(key==='guard'){until(b,'enemy0');expect(ev(b.enemyAct()).label).toBe('反撃態勢')}if(key==='drone')expect(e.element).toBe('water');if(key==='repair')expect(b.allies.some(a=>a.statuses.some(s=>s.id==='poison'))).toBe(true);if(key==='phantom')expect(e.element).toBe('dark');if(key==='eater'){until(b,'enemy0');expect(ev(b.enemyAct()).hint).toContain('虚空放射');until(b,'enemy0');const warned=ev(b.enemyAct());expect(warned.actionName).toBe('虚空放射');expect(warned.effects).toHaveLength(3)}});
 it('guardian uses magic, guards before its warned AoE and respects barriers',()=>{const b=battle(ready(),'ark-guardian');until(b,'enemy0');expect(ev(b.enemyAct()).element).toBe('earth');until(b,'enemy0');expect(ev(b.enemyAct()).hint).toContain('反転重圧');until(b,'enemy0');for(const u of b.allies)u.barrierCharges=1;const e=ev(b.enemyAct());expect(e.effects).toHaveLength(3);expect(e.effects!.every(e=>e.element==='earth'&&e.damageTrace?.barrierMultiplier===.5)).toBe(true)});
 it('Celestial Zero starts with a single attack and retains phase-two charge through sleep into phase three',()=>{const b=battle(ready(),'ark-zero'),boss=b.enemies[0];until(b,boss.id);expect(ev(b.enemyAct()).amount).toBeGreaterThan(0);boss.hp=Math.floor(boss.maxHp*.6);until(b,boss.id);expect(ev(b.enemyAct()).hint).toContain('忘却の奔流');boss.hp=Math.floor(boss.maxHp*.2);boss.statuses.push({id:'sleep',remaining:1});until(b,boss.id);b.skipTurn();until(b,boss.id);const e=ev(b.enemyAct());expect(e.actionName).toBe('忘却の奔流');expect(e.effects!.every(part=>part.damageTrace?.power===144)).toBe(true);until(b,boss.id);b.enemyAct();until(b,boss.id);expect(ev(b.enemyAct()).hint).toContain('星海崩壊');until(b,boss.id);const final=ev(b.enemyAct());expect(final.actionName).toBe('星海崩壊');expect(final.effects).toHaveLength(3);expect(final.effects!.every(e=>e.damageTrace?.power===174)).toBe(true)});
 it.each(chapterFourteenWeapons)('$id applies real combat stats and correct silhouette, owner restricted',w=>{const p=ready();complete(p,c);expect(equipWeapon(p.equipment,w.owner,w.id)).toBe(true);const b=battle(p,'ark-gateway'),u=b.allies.find(u=>u.id===w.owner)!;expect(u.weaponId).toBe(w.id);const base=growUnit(cloneUnit(heroes.find(h=>h.id===w.owner)!),p.party[w.owner]);for(const [stat,amount] of Object.entries(w.bonuses))expect(u[stat as keyof typeof u]).toBe((base[stat as keyof typeof base] as number)+amount);expect(actorStyle(u,true).family).toBe(w.family);expect(equipWeapon(p.equipment,w.owner==='astel'?'mei':'astel',w.id)).toBe(false);expect(equipWeapon(p.equipment,w.owner,w.id)).toBe(true);expect(battle(p,'ark-gateway').allies.find(u=>u.id===w.owner)!.attack).toBe(u.attack);if(w.owner==='mei'){b.allies[1].hp-=200;until(b,'mei');expect(ev(b.act('heal','rina')).amount).toBe(Math.round(skills.heal.power!*1.2))}});
 it.each([false,true])('twenty full chapter seeds, quests=%s, without mandatory high-level nodes',all=>{for(let seed=1;seed<=20;seed++){const p=ready();for(const e of c.events){arrange(p,c,e.id);if(e.encounter)expect(fight(battle(p,e.encounter,seededRandom(seed))),`${seed}/${e.id}`).toBe('victory');complete(p,c,e.id);if(all&&e.id==='c14-promise')for(const q of qs)quest(p,q.id)}expect(chapterState(p.adventure,c).completed).toHaveLength(28)}});
});
describe('thirteenth symbol receipts',()=>{
 it.each(['victory','defeat'] as const)('%s settles once and restores the road at a safe entry',result=>{const p=ready();complete(p,c,'c14-arrival');arrange(p,c,'c14-gateway-fight');const f=symbolForEvent('c14-gateway-fight')!,serial=beginAdventureBattle(p,c,f.symbol.eventId,{mapId:f.map.id,symbolId:f.symbol.id,position:f.symbol})!,wins=p.wins;expect(beginAdventureBattle(p,c,f.symbol.eventId,{mapId:f.map.id,symbolId:f.symbol.id,position:f.symbol})).toBeUndefined();expect(resolveAdventureBattle(p,serial,result).applied).toBe(true);expect(p.world!).toMatchObject(f.map.entry);expect(p.wins).toBe(wins+(result==='victory'?1:0));const before=structuredClone(p);expect(resolveAdventureBattle(p,serial,result).applied).toBe(false);expect(p).toEqual(before)});
 it('interrupted contact grants no XP or result and no unsafe return',()=>{const p=ready();complete(p,c,'c14-arrival');arrange(p,c,'c14-gateway-fight');const f=symbolForEvent('c14-gateway-fight')!,serial=beginAdventureBattle(p,c,f.symbol.eventId,{mapId:f.map.id,symbolId:f.symbol.id,position:f.symbol})!,q=load({getItem:()=>JSON.stringify(p)});expect(q.party).toEqual(p.party);expect(q.wins).toBe(p.wins);expect(q.adventure.pending).toBeUndefined();expect(q.world!.recovered).toBe(true);expect(resolveAdventureBattle(q,serial,'victory').applied).toBe(false)});
});

describe('populated legacy progression',()=>{
 it('retains all ninety acquired nodes, old claimed quests and equipped quantities through chapter clear and reload',async()=>{
  const {treeNodes}=await import('../src/data/skill-tree');const p=ready();
  for(const hero of ['astel','rina','mei'] as const)p.skillTree[hero]=treeNodes.filter(n=>n.hero===hero).map(n=>n.id);
  p.equipment.inventory['starengine-duals']=2;p.equipment.equipped={astel:'starengine-duals',rina:'celestial-shield-rapier',mei:'starchart-mace'};
  p.quests['sq-stopped-clock']={accepted:true,objectives:['clock-gear','clock-hand'],claimed:true};
  const q=load({getItem:()=>JSON.stringify(p)}),old=structuredClone(q);expect(Object.values(q.skillTree).flat()).toHaveLength(90);
  complete(q,c);const restored=load({getItem:()=>JSON.stringify(q)});
  expect(restored.skillTree).toEqual(old.skillTree);expect(restored.equipment.equipped).toEqual(old.equipment.equipped);expect(restored.equipment.inventory['starengine-duals']).toBe(2);expect(restored.quests['sq-stopped-clock']).toEqual(old.quests['sq-stopped-clock']);expect(restored.choices).toMatchObject(old.choices);expect(restored.wins-old.wins).toBe(6);expect(restored.adventure.chapters['chapter-14'].completed).toHaveLength(28);
 });
});

describe('ark bosses preserve shared protection and resources',()=>{
 it.each(['ark-guardian','ark-zero'])('%s keeps AoE recipients despite taunt, honors cover/guard/heal, and never inherits star absorption',id=>{
  const b=battle(ready(),id);b.enemies[0].hp=Math.floor(b.enemies[0].maxHp*.6);
  until(b,'enemy0');ev(b.enemyAct());until(b,'enemy0');ev(b.enemyAct());until(b,'enemy0');
  for(const a of b.allies)a.star=60;const rina=b.allies[1],mei=b.allies[2];rina.tauntRounds=2;rina.covering=mei.id;rina.guarding='guard';const before=mei.hp,e=ev(b.enemyAct());
  expect(e.effects!.map(p=>p.target)).toEqual(['astel','rina','rina']);expect(e.effects![2].covered).toBe(true);expect(e.effects![1].damageTrace!.guardMultiplier).toBeLessThan(1);expect(mei.hp).toBe(before);expect(b.allies.map(a=>a.star)).toEqual([70,80,60]);
  const hp=rina.hp;until(b,'mei');expect(ev(b.act('heal',rina.id)).amount).toBeGreaterThan(0);expect(rina.hp).toBeGreaterThan(hp);
 });
});
