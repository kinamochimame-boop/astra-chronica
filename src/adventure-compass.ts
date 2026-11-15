import type {Progress} from './save';
import {chapters,chapterOne} from './data/chapter-one';
import {chapterOpen,chapterState,locationOpen} from './adventure';
import {mainObjective} from './exploration/objective';
import {mapById} from './exploration/map-data';
import {activeMap} from './exploration/active-map';
import {navigationTarget,routeGuidance} from './exploration/navigation';
import {sideQuests,type SideQuest} from './data/side-quests';
import {questAvailable,questProgress,questReady,questClaimReason} from './side-quests';
import {explorationRestriction} from './exploration-conditions';
import {growthTransaction} from './growth-builds';
export function compassChapter(p:Progress){return chapters.find(c=>c.id===p.adventure.selectedChapterId&&chapterOpen(p.adventure,c))??chapters.find(c=>c.id===mapById(p.world?.mapId)?.chapterId&&chapterOpen(p.adventure,c))??[...chapters].reverse().find(c=>p.adventure.chapters[c.id]&&chapterOpen(p.adventure,c))??chapterOne}
export function normalizeTrackedQuest(id:unknown,p:Pick<Progress,'quests'|'adventure'>){const q=sideQuests.find(q=>q.id===id);if(!q||!questAvailable(p,q))return;const s=questProgress(p.quests,q.id);return s.accepted&&!s.claimed?q.id:undefined}
export function trackQuest(p:Progress,id:string|undefined,persist:()=>boolean){if(id!==undefined&&normalizeTrackedQuest(id,p)!==id)return {ok:false as const,reason:'受注済み・未受取の依頼だけ追跡できます'};return growthTransaction(p,persist,()=>{if(id)p.trackedQuestId=id;else delete p.trackedQuestId;return {ok:true}})}
export function questStatus(p:Progress,q:SideQuest){const s=questProgress(p.quests,q.id);return s.claimed?'報酬受取済み':!s.accepted?'未受注':!questReady(s,q)?'進行中':!questClaimReason(p,q)?'報告可能':'目標達成'}
export function questGuide(p:Progress,q:SideQuest){
 const s=questProgress(p.quests,q.id),c=chapters.find(c=>c.id===q.chapterId)!;if(!s.accepted||s.claimed)return {text:'追跡できません'};
 const ready=questReady(s,q),o=q.objectives.find(o=>!s.objectives.includes(o.id)&&o.requires.every(id=>s.objectives.includes(id))),location=ready?q.returnLocation:o?.locationId;
 if(!location||!locationOpen(chapterState(p.adventure,c),c,location))return {text:'現在のメイン目的を進めると、依頼の行き先が解放されます。'};
 const restriction=!ready&&o?explorationRestriction(p.adventure,c.id,location,o.id):'';if(restriction)return {text:restriction};
 const name=c.locations.find(l=>l.id===location)!.name,base=mapById(p.world?.mapId);
 if(base?.chapterId!==c.id)return {text:`${name}：章選択から解放済みの章へ戻ってください。`};
 const map=activeMap(base,p.adventure,p.choices),point=p.world!,target=navigationTarget(p,map,point,[],{locationId:location,questId:q.id,objectiveId:ready?undefined:o?.id});
 if(base.locationId===location&&ready)return {text:`${name}：依頼画面で報告してください。`};
 return {text:target?`${name} → ${target.kind==='exit'?'出口':'調査対象'}：${target.name}`:`${name}：現在到達できる経路がありません。解放条件や装置を確認してください。`};
}
export function adventureCompass(p:Progress){const chapter=compassChapter(p),state=chapterState(p.adventure,chapter),goal=mainObjective(p.adventure,chapter),base=mapById(p.world?.mapId);const tracked=sideQuests.find(q=>q.id===normalizeTrackedQuest(p.trackedQuestId,p));return {chapter,goal,restriction:goal.eventId&&goal.locationId?explorationRestriction(p.adventure,chapter.id,goal.locationId,goal.eventId):'',current:chapter.locations.find(l=>l.id===state.currentLocationId)?.name??chapter.locations[0].name,completed:chapter.events.filter(e=>state.completed.includes(e.id)).length,total:chapter.events.length,route:base?.chapterId===chapter.id&&p.world?routeGuidance(p,activeMap(base,p.adventure,p.choices),p.world):'冒険を再開すると、解放済みの出口・対象をご案内します。',quests:sideQuests.filter(q=>questAvailable(p,q)),tracked,trackedGuide:tracked?questGuide(p,tracked).text:undefined}}
