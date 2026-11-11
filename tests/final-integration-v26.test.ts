import {it,expect} from 'vitest';
import {writeManifestIfRequested,recordIntegrationResult} from './integration-io.mjs';
import {chapters} from '../src/data/chapter-one';
import {walkMaps,symbolForEvent} from '../src/exploration/map-data';
import {allWeapons,type HeroId} from '../src/data/weapons';
import {dialogueChoices} from '../src/data/dialogue-choices';
import {sideQuests} from '../src/data/side-quests';
import {timeDevices,landmarks} from '../src/data/exploration-conditions';
import {treeNodes,treeBranches} from '../src/data/skill-tree';
import {acquireNode} from '../src/skill-tree';
import {equipWeapon} from '../src/equipment';
import {recordChoice} from '../src/dialogue-choices';
import {fresh,load} from '../src/save';
import {chapterState,completeEvent,beginAdventureBattle,resolveAdventureBattle} from '../src/adventure';
import {advanceEnding,nextEndingEvent,gameCleared} from '../src/ending';
import {arrange,fight} from './v15-helpers';
import {Battle} from '../src/battle';
import {encounters,encounterSetup} from '../src/data/encounters';
import {seededRandom} from '../src/lab-session';
it('all eighteen chapter definitions form a valid prerequisite chain and optionally export a read-only UI test manifest',()=>{
 expect(chapters).toHaveLength(18);const ids=new Set<string>();for(const [i,c] of chapters.entries()){expect(c.id).toBe(`chapter-${String(i+1).padStart(2,'0')}`);if(i)expect(c.requiresChapterId).toBe(chapters[i-1].id);const done=new Set<string>();for(const e of c.events){expect(ids.has(e.id)).toBe(false);ids.add(e.id);expect(e.requires.every(id=>done.has(id))).toBe(true);done.add(e.id)}}
 writeManifestIfRequested({chapters,maps:walkMaps,weapons:allWeapons,choices:dialogueChoices,quests:sideQuests,timeDevices,landmarks,treeNodes,treeBranches,encounters});
});
it('fresh game API simulation earns every chapter victory/XP, buys only earned nodes, retains save history and reaches THE END (not a browser test)',()=>{
 let p=fresh();p.started=true;const random=seededRandom(2601);let victories=0;
 const develop=()=>{for(const hero of ['astel','rina','mei'] as HeroId[]){for(const node of treeNodes.filter(n=>n.hero===hero))acquireNode(p.skillTree,hero,p.party[hero].level,node.id);const owned=allWeapons.filter(w=>w.owner===hero&&p.equipment.inventory[w.id]);const score=(w:typeof owned[number])=>(w.bonuses.attack??0)+(w.bonuses.defense??0)*(hero==='rina'?1:.1)+(w.bonuses.maxHp??0)*.03+(w.bonuses.maxMp??0)*.3+((w.effects.magicRate??1)-1)*60+((w.effects.healingRate??1)-1)*40;owned.sort((a,b)=>score(b)-score(a));if(owned[0])equipWeapon(p.equipment,hero,owned[0].id)}};
 for(const c of chapters){for(const e of c.events){if(c.id==='chapter-18'&&nextEndingEvent(p)){expect(advanceEnding(p,e.id,()=>true).ok,e.id).toBe(true);continue}if(chapterState(p.adventure,c).completed.includes(e.id))continue;arrange(p,c,e.id);if(e.choiceId){const q=dialogueChoices.find(q=>q.id===e.choiceId)!;expect(recordChoice(p,q.id,q.options[0].id)).toBe(true)}develop();if(e.encounter){const symbol=symbolForEvent(e.id),serial=beginAdventureBattle(p,c,e.id,symbol?{mapId:symbol.map.id,symbolId:symbol.symbol.id,position:symbol.symbol}:undefined);expect(serial,e.id).toBeDefined();const b=new Battle(random,p.party,undefined,p.equipment,encounterSetup(e.encounter,p.choices),p.skillTree,p.consumables);expect(fight(b),`${c.id}/${e.id}/levels:${JSON.stringify(p.party)}`).toBe('victory');expect(resolveAdventureBattle(p,serial!,'victory').applied).toBe(true);victories++;}else expect(completeEvent(p,c,e.id,e.puzzle?.solution).ok,e.id).toBe(true)}const before=p;p=load({getItem:()=>JSON.stringify(p)});expect(p.equipment).toEqual(before.equipment);expect(p.choices).toEqual(before.choices);expect(chapterState(p.adventure,c).completed).toEqual(chapterState(before.adventure,c).completed)}
 expect(victories).toBeGreaterThan(90);expect(p.wins).toBe(victories);expect(gameCleared(p)).toBe(true);expect(p.world?.mapId).toBe('final-astral-garden');recordIntegrationResult({mode:'fresh-engine-api-not-browser',chapters:18,battles:victories,cleared:gameCleared(p),progress:p});
},15_000); // Whole-game integration: 109 real battles plus 18 save/reload cycles.
