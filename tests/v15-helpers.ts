import {expect} from 'vitest';
import {chapters,type Chapter} from '../src/data/chapter-one';
import {chapterFive} from '../src/data/chapter-five';
import {chapterSeven as c} from '../src/data/chapter-seven';
import {enterMap} from '../src/exploration/exploration-save';
import {objectForEvent,symbolForEvent,walkMaps} from '../src/exploration/map-data';
import {sideQuests as allQuests} from '../src/data/side-quests';
import {dialogueChoices as allChoices} from '../src/data/dialogue-choices';
import {recordChoice} from '../src/dialogue-choices';
import {acceptQuest,collectQuestObjective,claimQuest} from '../src/side-quests';
import {chapterState,visitLocation,completeEvent,beginAdventureBattle,resolveAdventureBattle,discoverLandmark,changeTimeState} from '../src/adventure';
import {fresh,type Progress} from '../src/save';
import {encounterSetup} from '../src/data/encounters';
import {Battle,type ActionResult,type Command} from '../src/battle';
const sideQuests=allQuests.filter(q=>q.chapterId==='chapter-07');
const dialogueChoices=allChoices.filter(q=>q.chapterId==='chapter-07');
const ev=(r:ActionResult)=>{expect(r.ok).toBe(true);if(!r.ok)throw Error(r.reason);return r.event};
function until(b:Battle,id:string){for(let n=0;n<30&&!b.result&&b.current?.id!==id;n++)b.waitTurn();expect(b.current?.id).toBe(id)}
function arrange(p:Progress,ch:Chapter,eventId:string){visitLocation(p.adventure,ch,ch.events.find(e=>e.id===eventId)!.locationId);const obj=objectForEvent(eventId),symbol=symbolForEvent(eventId);if(obj){enterMap(p,obj.map.id);Object.assign(p.world!,{x:obj.object.x+32,y:obj.object.y});}if(symbol){enterMap(p,symbol.map.id);Object.assign(p.world!,{x:symbol.symbol.x,y:symbol.symbol.y});}if(ch.id===chapterFive.id&&ch.events.find(e=>e.id===eventId)!.puzzle)discoverLandmark(p.adventure,'c5-temple-windmark');if(eventId==='c6-canal-tune')changeTimeState(p.adventure,'c6-canal-clock','flowing');if(eventId==='c6-clock-puzzle')changeTimeState(p.adventure,'c6-corridor-clock','flowing');}
function complete(p:Progress,ch:Chapter,last=ch.events.at(-1)!.id){for(const e of ch.events){if(!chapterState(p.adventure,ch).completed.includes(e.id)){arrange(p,ch,e.id);if(e.choiceId&&!p.choices[e.choiceId])expect(recordChoice(p,e.choiceId,allChoices.find(q=>q.id===e.choiceId)!.options[0].id)).toBe(true);if(e.encounter){const f=symbolForEvent(e.id),serial=beginAdventureBattle(p,ch,e.id,f?{mapId:f.map.id,symbolId:f.symbol.id,position:f.symbol}:undefined)!;expect(resolveAdventureBattle(p,serial,'victory').applied).toBe(true)}else expect(completeEvent(p,ch,e.id,e.puzzle?.solution).ok).toBe(true)}if(e.id===last)break}}
function ready(){const p=fresh();for(const ch of chapters.slice(0,6))complete(p,ch);return p}
const battle=(p:Progress,id:string,random=()=>0.99)=>new Battle(random,p.party,undefined,p.equipment,encounterSetup(id),p.skillTree,p.consumables);
function doQuest(p:Progress,id:string){const q=sideQuests.find(q=>q.id===id)!;expect(acceptQuest(p,id)).toBe(true);for(const o of q.objectives){expect(visitLocation(p.adventure,c,o.locationId)).toBe(true);const f=walkMaps.flatMap(map=>map.objects.filter(obj=>obj.objectiveId===o.id).map(object=>({map,object})))[0];if(f){enterMap(p,f.map.id);Object.assign(p.world!,{x:f.object.x+32,y:f.object.y});}expect(collectQuestObjective(p,id,o.id)).toBe(true)}visitLocation(p.adventure,c,q.returnLocation);expect(claimQuest(p,id).ok).toBe(true)}
function fight(b:Battle){for(let n=0;n<450&&!b.result;n++){
 if(b.blocked){b.skipTurn();continue}if(b.phase==='enemy'){b.enemyAct();continue}
 const u=b.current!,enemy=b.enemies.find(e=>e.hp>0)!,w=b.allies.filter(a=>a.hp>0&&a.hp/a.maxHp<0.65).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp);let cmd:Command='attack',target=enemy.id;
 if(w[0]&&w[0].hp/w[0].maxHp<0.4&&b.canUse('potion')){cmd='potion';target=w[0].id}
 else if(b.allies[2].hp>0&&b.allies[2].mp<8&&b.canUse('ether')){cmd='ether';target='mei'}
 else if(u.id==='astel')cmd=b.canUse('starSlash')?'starSlash':b.canUse('strong')?'strong':'attack';
 else if(u.id==='rina')cmd=b.canUse('oathShield')?'oathShield':b.enemies.length===1&&b.canUse('taunt')&&!u.tauntRounds?'taunt':'attack';
 else if(u.id==='mei'){if(w.length>1&&b.canUse('miracle'))cmd='miracle';else if(w[0]&&b.canUse('heal')){cmd='heal';target=w[0].id}else if(enemy.affinities.water&&enemy.affinities.water>1&&b.canUse('ice'))cmd='ice';else if(enemy.affinities.wind&&enemy.affinities.wind>1&&b.canUse('thunder'))cmd='thunder';else if(b.canUse('fire'))cmd='fire'}
 ev(b.act(cmd,target));for(const a of b.allies){expect(a.hp).toBeGreaterThanOrEqual(0);expect(a.mp).toBeGreaterThanOrEqual(0);expect(a.star).toBeLessThanOrEqual(100)}
 }expect(b.result).not.toBeNull();return b.result!}

export {c,arrange,complete,ready,battle,doQuest,fight,ev,until,sideQuests,dialogueChoices};
