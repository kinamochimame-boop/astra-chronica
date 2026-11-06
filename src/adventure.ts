import {mapEventReason,validSymbolContact,captureReturn,settleWorld,syncWorldProgress} from './exploration/access';
import type {SymbolContact} from './exploration/types';
import {timeDevices,type TimeMode,landmarks} from './data/exploration-conditions';
import {explorationRestriction} from './exploration-conditions';
import {grantConsumable} from './consumables';
import {weaponById} from './data/weapons';
import {chapters,type Chapter,type AdventureEvent} from './data/chapter-one';
import {encounters} from './data/encounters';
import {grantWeapon} from './equipment';
import {gainExperience} from './progression';
import type {Progress} from './save';
export interface ChapterProgress {currentLocationId:string;completed:string[]}
export interface AdventureProgress {chapters:Record<string,ChapterProgress>;serial:number;resolved:number;selectedChapterId?:string;landmarks?:string[];timeStates?:Record<string,TimeMode>;exploration?:Record<string,{visited:string[];complete:boolean}>;pending?:{serial:number;chapterId:string;eventId:string}}
export const initialAdventure=():AdventureProgress=>({chapters:{},serial:0,resolved:0});
export const chapterState=(state:AdventureProgress,c:Chapter):ChapterProgress=>state.chapters[c.id]??{currentLocationId:c.locations[0].id,completed:[]};
export const eventOpen=(state:ChapterProgress,e:AdventureEvent)=>e.requires.every(id=>state.completed.includes(id));
export function locationOpen(state:ChapterProgress,c:Chapter,id:string){const index=c.locations.findIndex(l=>l.id===id);return index>=0&&c.locations.slice(0,index).every(l=>c.events.filter(e=>e.locationId===l.id).every(e=>state.completed.includes(e.id)))}
export const chapterCleared=(state:AdventureProgress,c:Chapter)=>c.events.filter(e=>e.kind==='clear').every(e=>chapterState(state,c).completed.includes(e.id));
export function chapterOpen(state:AdventureProgress,c:Chapter):boolean{if(!c.requiresChapterId)return true;const previous=chapters.find(p=>p.id===c.requiresChapterId);return !!previous&&chapterCleared(state,previous)}
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const integer=(n:unknown):n is number=>typeof n==='number'&&Number.isSafeInteger(n)&&n>=0&&n<Number.MAX_SAFE_INTEGER;
export function normalizeAdventure(raw:unknown):AdventureProgress {
 const state=initialAdventure();if(!record(raw))return state;
 if(integer(raw.serial))state.serial=raw.serial;
 if(integer(raw.resolved)&&raw.resolved<=state.serial)state.resolved=raw.resolved;
 for(const c of chapters){
  if(!chapterOpen(state,c))continue;
  const saved=record(raw.chapters)?raw.chapters[c.id]:undefined;if(!record(saved))continue;
  const progress:ChapterProgress={currentLocationId:c.locations[0].id,completed:[]};
  const ids=Array.isArray(saved.completed)?saved.completed.filter((id):id is string=>typeof id==='string'):[];
  // Prerequisites define a valid prefix; unknown/out-of-order flags cannot unlock locations.
  for(const e of c.events)if(ids.includes(e.id)&&eventOpen(progress,e))progress.completed.push(e.id);
  if(progress.completed.includes(c.events.find(e=>e.kind==='boss')?.id??''))for(const e of c.events.filter(e=>e.kind==='clear'))if(eventOpen(progress,e)&&!progress.completed.includes(e.id))progress.completed.push(e.id);
  if(typeof saved.currentLocationId==='string'&&locationOpen(progress,c,saved.currentLocationId))progress.currentLocationId=saved.currentLocationId;
  state.chapters[c.id]=progress;
 }
 if(record(raw.exploration))for(const c of chapters){const h=raw.exploration[c.id];if(!chapterOpen(state,c)||!record(h)||!Array.isArray(h.visited))continue;const visited=c.locations.filter(l=>h.visited instanceof Array&&h.visited.includes(l.id)&&locationOpen(chapterState(state,c),c,l.id)).map(l=>l.id);(state.exploration??={})[c.id]={visited,complete:h.complete===true&&visited.includes(chapterState(state,c).currentLocationId)&&c.events.filter(e=>chapterState(state,c).completed.includes(e.id)).every(e=>visited.includes(e.locationId))};}
 if(Array.isArray(raw.landmarks))state.landmarks=landmarks.filter(l=>{const c=chapters.find(c=>c.id===l.chapterId)!;return raw.landmarks instanceof Array&&raw.landmarks.includes(l.id)&&chapterOpen(state,c)&&chapterState(state,c).completed.includes(l.requiresEvent)&&locationOpen(chapterState(state,c),c,l.locationId)}).map(l=>l.id);
 if(record(raw.timeStates)){const modes:Record<string,TimeMode>={};for(const d of timeDevices){const c=chapters.find(c=>c.id===d.chapterId)!;if(!chapterOpen(state,c)||!chapterState(state,c).completed.includes(d.requiresEvent)||!locationOpen(chapterState(state,c),c,d.locationId))continue;const value=raw.timeStates[d.id];if(value==='stopped'||value==='flowing')modes[d.id]=chapterState(state,c).completed.includes(d.settledByEvent)?'flowing':value;}state.timeStates=modes;}
 const selected=chapters.find(c=>c.id===raw.selectedChapterId);if(selected&&chapterOpen(state,selected))state.selectedChapterId=selected.id;
 const p=raw.pending;
 if(record(p)&&integer(p.serial)&&p.serial>state.resolved&&p.serial<=state.serial){
  const c=chapters.find(c=>c.id===p.chapterId),e=c?.events.find(e=>e.id===p.eventId);
  if(c&&e&&chapterOpen(state,c)&&['battle','boss'].includes(e.kind)&&eventOpen(chapterState(state,c),e)&&!chapterState(state,c).completed.includes(e.id))state.pending={serial:p.serial,chapterId:c.id,eventId:e.id};
 }
 return state;
}
export function visitLocation(state:AdventureProgress,c:Chapter,id:string):boolean {
 const progress=chapterState(state,c);if(!chapterOpen(state,c)||!locationOpen(progress,c,id))return false;
 const started=!!state.chapters[c.id],old=state.exploration?.[c.id];(state.exploration??={})[c.id]={visited:c.locations.filter(l=>new Set([...(old?.visited??[]),id]).has(l.id)).map(l=>l.id),complete:old?.complete??!started};
 progress.currentLocationId=id;state.chapters[c.id]=progress;return true;
}
export function discoverLandmark(state:AdventureProgress,id:string):boolean {
 const l=landmarks.find(l=>l.id===id),c=chapters.find(c=>c.id===l?.chapterId);if(!l||!c||!chapterOpen(state,c)||state.landmarks?.includes(id))return false;const progress=chapterState(state,c);if(progress.currentLocationId!==l.locationId||!progress.completed.includes(l.requiresEvent)||!locationOpen(progress,c,l.locationId))return false;(state.landmarks??=[]).push(id);return true;
}
export function changeTimeState(state:AdventureProgress,id:string,mode:TimeMode):boolean {
 const device=timeDevices.find(d=>d.id===id),c=chapters.find(c=>c.id===device?.chapterId);if(!device||!c||!['stopped','flowing'].includes(mode)||!chapterOpen(state,c))return false;const progress=chapterState(state,c);if(progress.currentLocationId!==device.locationId||!locationOpen(progress,c,device.locationId)||!progress.completed.includes(device.requiresEvent)||progress.completed.includes(device.settledByEvent)||(state.timeStates?.[id]??'stopped')===mode)return false;(state.timeStates??={})[id]=mode;return true;
}
export function completeEvent(p:Progress,c:Chapter,id:string,answer?:string[]):{ok:boolean;message:string} {
 const state=chapterState(p.adventure,c),event=c.events.find(e=>e.id===id);
 if(!chapterOpen(p.adventure,c)||!event||!eventOpen(state,event)||['battle','boss'].includes(event.kind))return {ok:false,message:'このイベントはまだ完了できません。'};
 const proximity=mapEventReason(p,event.id);if(proximity)return {ok:false,message:proximity};
 const restriction=explorationRestriction(p.adventure,c.id,event.locationId,event.id);if(restriction)return {ok:false,message:restriction};
 if(state.completed.includes(id))return {ok:false,message:'初回の完了・報酬は取得済みです。'};
 if(event.choiceId&&!p.choices[event.choiceId])return {ok:false,message:'会話の選択肢を選んでください。'};
 if(event.puzzle&&(!answer||answer.length!==event.puzzle.solution.length||!event.puzzle.solution.every((id,i)=>answer[i]===id)))return {ok:false,message:event.puzzle.errorMessage??(event.puzzle.mode==='cycle'?'音律が違います。文字のヒントを見て何度でも試せます。':event.puzzle.mode==='rotate'?'結晶の向きが違います。ヒントを見て何度でも回せます。':'断片の順番が違います。ヒントを見て何度でも組み直せます。')};
 if(event.itemReward&&!grantConsumable(p.consumables,event.itemReward.id,event.itemReward.count))return {ok:false,message:'回復品の所持上限に達しています。'};
 if(event.weaponReward&&!grantWeapon(p.equipment,event.weaponReward))return {ok:false,message:'所持数の上限に達しています。報酬を受け取れないため未完了のままです。'};
 state.completed.push(id);p.adventure.chapters[c.id]=state;syncWorldProgress(p);
 return {ok:true,message:event.weaponReward?`${weaponById(event.weaponReward)!.name}を1個入手しました。`:event.itemReward?'回復品を受け取りました。':event.kind==='rest'?'泉で休息しました。次の戦闘はHP・MP全快で開始します。':'イベントを完了しました。'};
}
export function beginAdventureBattle(p:Progress,c:Chapter,id:string,source?:SymbolContact):number|undefined {
 const state=chapterState(p.adventure,c),e=c.events.find(e=>e.id===id);
 if(!chapterOpen(p.adventure,c)||!e||!['battle','boss'].includes(e.kind)||!e.encounter||!encounters[e.encounter]||!eventOpen(state,e)||state.completed.includes(id)||p.adventure.serial>=Number.MAX_SAFE_INTEGER-1)return;
 if(!validSymbolContact(p,e.id,source)||explorationRestriction(p.adventure,c.id,e.locationId,e.id))return;
 const serial=++p.adventure.serial;p.adventure.pending={serial,chapterId:c.id,eventId:id};p.adventure.chapters[c.id]=state;captureReturn(p,id,serial,source);return serial;
}
/** One mutation + one caller-owned save commits flags, receipt, EXP and counters together. */
export function resolveAdventureBattle(p:Progress,serial:number,result:'victory'|'defeat') {
 const receipt=p.adventure.pending,c=chapters.find(c=>c.id===receipt?.chapterId),e=c?.events.find(e=>e.id===receipt?.eventId);
 if(!receipt||receipt.serial!==serial||serial<=p.adventure.resolved||!c||!chapterOpen(p.adventure,c)||!e||!['battle','boss'].includes(e.kind)||!e.encounter||!encounters[e.encounter])return {applied:false,xp:0,levels:{} as Record<string,number>,cleared:false};
 const state=chapterState(p.adventure,c);if(!eventOpen(state,e)||state.completed.includes(e.id))return {applied:false,xp:0,levels:{} as Record<string,number>,cleared:false};
 let xp=0;const levels:Record<string,number>={};p.battles++;
 if(result==='victory'){
  if(e.weaponReward&&(p.equipment.inventory[e.weaponReward]??0)<9999)grantWeapon(p.equipment,e.weaponReward);
  p.wins++;xp=encounters[e.encounter!].enemies.reduce((sum,u)=>sum+u.experienceReward,0);
  for(const [id,h] of Object.entries(p.party))levels[id]=gainExperience(h,xp);
  state.completed.push(e.id);if(e.kind==='boss')for(const clear of c.events.filter(e=>e.kind==='clear'))if(eventOpen(state,clear)&&!state.completed.includes(clear.id))state.completed.push(clear.id);
 }
 p.adventure.chapters[c.id]=state;p.adventure.resolved=serial;p.adventure.pending=undefined;settleWorld(p,serial,result);
 return {applied:true,xp,levels,cleared:chapterCleared(p.adventure,c)};
}
