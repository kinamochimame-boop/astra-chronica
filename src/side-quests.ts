import {explorationRestriction} from './exploration-conditions';
import {sideQuests,type SideQuest} from './data/side-quests';
import {chapters} from './data/chapter-one';
import {chapterOpen,chapterState,locationOpen,type AdventureProgress} from './adventure';
import {grantConsumable,itemDefinitions} from './consumables';
import {gainExperience} from './progression';
import type {Progress} from './save';
export interface QuestProgress {accepted:boolean;objectives:string[];claimed:boolean}
export type QuestState=Record<string,QuestProgress>;
export const initialQuests=():QuestState=>({});
export function questProgress(state:QuestState,id:string):QuestProgress{return state[id]??{accepted:false,objectives:[],claimed:false}}
export function questAvailable(p:Pick<Progress,'adventure'>,q:SideQuest){const c=chapters.find(c=>c.id===q.chapterId);return !!c&&chapterOpen(p.adventure,c)}
export const questReady=(s:QuestProgress,q:SideQuest)=>s.accepted&&q.objectives.every(o=>s.objectives.includes(o.id));
export function normalizeQuests(raw:unknown,adventure:AdventureProgress):QuestState{
 const state=initialQuests(),source=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw as Record<string,unknown>:{};
 for(const q of sideQuests){const entry=source[q.id];if(!questAvailable({adventure},q)||!entry||typeof entry!=='object'||Array.isArray(entry))continue;const v=entry as Record<string,unknown>;if(v.accepted!==true)continue;const c=chapters.find(c=>c.id===q.chapterId)!,s:QuestProgress={accepted:true,objectives:[],claimed:false};const ids=Array.isArray(v.objectives)?v.objectives:[];for(const o of q.objectives)if(ids.includes(o.id)&&!explorationRestriction(adventure,c.id,o.locationId,o.id)&&locationOpen(chapterState(adventure,c),c,o.locationId)&&o.requires.every(id=>s.objectives.includes(id)))s.objectives.push(o.id);s.claimed=v.claimed===true&&questReady(s,q);state[q.id]=s}
 return state;
}
export function acceptQuest(p:Progress,id:string):boolean{const q=sideQuests.find(q=>q.id===id);if(!q||!questAvailable(p,q)||questProgress(p.quests,id).accepted)return false;p.quests[id]={accepted:true,objectives:[],claimed:false};return true}
export function collectQuestObjective(p:Progress,id:string,objectiveId:string):boolean{
 const q=sideQuests.find(q=>q.id===id),s=questProgress(p.quests,id),o=q?.objectives.find(o=>o.id===objectiveId),c=chapters.find(c=>c.id===q?.chapterId);
 if(!q||!c||!o||!questAvailable(p,q)||!s.accepted||s.claimed||s.objectives.includes(o.id)||chapterState(p.adventure,c).currentLocationId!==o.locationId||!locationOpen(chapterState(p.adventure,c),c,o.locationId)||!o.requires.every(id=>s.objectives.includes(id)))return false;
 if(explorationRestriction(p.adventure,c.id,o.locationId,o.id))return false;s.objectives.push(o.id);return true;
}
export function questClaimReason(p:Progress,q:SideQuest):string{const s=questProgress(p.quests,q.id),c=chapters.find(c=>c.id===q.chapterId)!;if(!questAvailable(p,q))return '章が未解放です';if(s.claimed)return '報酬受取済み';if(!questReady(s,q))return '依頼の目的が未達成です';if(chapterState(p.adventure,c).currentLocationId!==q.returnLocation)return `報告場所：${c.locations.find(l=>l.id===q.returnLocation)!.name}`;if(q.reward.item&&(p.consumables[q.reward.item]+q.reward.count!>99))return '所持上限のため報酬を受け取れません';return ''}
export function claimQuest(p:Progress,id:string):{ok:boolean;message:string}{const q=sideQuests.find(q=>q.id===id);if(!q)return {ok:false,message:'依頼がありません'};const reason=questClaimReason(p,q);if(reason)return {ok:false,message:reason};if(q.reward.item&&!grantConsumable(p.consumables,q.reward.item,q.reward.count!))return {ok:false,message:'報酬を受け取れませんでした'};if(q.reward.experience)for(const h of Object.values(p.party))gainExperience(h,q.reward.experience);p.quests[id].claimed=true;return {ok:true,message:q.reward.item?`${itemDefinitions[q.reward.item].name}を${q.reward.count}個受け取りました。`:`一人につき経験値${q.reward.experience}を受け取りました。`}}
