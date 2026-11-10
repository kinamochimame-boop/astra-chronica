import type {Progress} from '../save';
import {mapById} from './map-data';
import {enterMap,mapOpen} from './exploration-save';
import {activeMap} from './active-map';
import {clearCircle} from './collision';
import {chapters} from '../data/chapter-one';
import {mainObjective} from './objective';
/** Networks hold only existing map IDs. All names, conditions and entries come from map definitions. */
export interface TransitNetwork {id:string;chapterId:string;unlockEvent:string;label:string;place:string;lockedReason:string;mapIds:readonly string[]}
export const railNetwork:TransitNetwork={id:'railway',chapterId:'chapter-13',unlockEvent:'c13-rail-start',label:'星脈鉄道',place:'駅',lockedReason:'古代鉄道駅で制動機と動力を復旧してください。',mapIds:['gear-rail','gear-station','gear-city','gear-workshop','gear-observatory','gear-core']};
export const arkNetwork:TransitNetwork={id:'ark',chapterId:'chapter-14',unlockEvent:'c14-control-start',label:'方舟区画制御',place:'区画',lockedReason:'逆さの星海で制御端末の接続を復旧してください。',mapIds:['ark-gateway','ark-shore','ark-dock','ark-hall','ark-gravity','ark-records','ark-sanctuary','ark-core']};
export const transitNetworks:readonly TransitNetwork[]=[railNetwork,arkNetwork];
export interface TransitTicket {from:string;to:string}
export const networkForMap=(id:unknown)=>transitNetworks.find(n=>typeof id==='string'&&n.mapIds.includes(id));
export const transitRestored=(p:Progress,n:TransitNetwork)=>(p.adventure.chapters[n.chapterId]?.completed??[]).includes(n.unlockEvent);
export function transitDestinations(p:Progress,n:TransitNetwork){return transitRestored(p,n)?n.mapIds.map(id=>mapById(id)!).filter(m=>!!m&&m.chapterId===n.chapterId&&mapOpen(p.adventure,m)&&clearCircle(activeMap(m,p.adventure,p.choices),m.entry)):[]}
export function transitReason(p:Progress,to:string,n:TransitNetwork){const source=mapById(p.world?.mapId),state=p.adventure.chapters[n.chapterId];if(p.adventure.pending)return `戦闘中は${n.label}を利用できません。`;if(!transitRestored(p,n))return n.lockedReason;if(!source||p.adventure.selectedChapterId!==n.chapterId||!n.mapIds.includes(source.id)||source.chapterId!==n.chapterId||state?.currentLocationId!==source.locationId||!mapOpen(p.adventure,source))return `この章の解放済みの${n.place}から利用してください。`;if(!transitDestinations(p,n).some(m=>m.id===to))return `この${n.place}はまだ解放されていません。`;if(to===source.id)return `現在この${n.place}にいます。`;return ''}
/** Pure reservation. No save writes, rewards, or in-flight flags. */
export function beginTransit(p:Progress,to:string,n:TransitNetwork):TransitTicket|undefined{return transitReason(p,to,n)?undefined:{from:p.world!.mapId,to}}
/** Dispose and flush the origin view BEFORE committing; revalidate the network at arrival. */
export function completeTransit(p:Progress,t:TransitTicket,n=networkForMap(t?.from)){if(!n||!t||p.world?.mapId!==t.from||transitReason(p,t.to,n))return false;const m=mapById(t.to)!;if(!enterMap(p,m.id))return false;Object.assign(p.world!,m.entry);p.world!.event=undefined;return true}
export function transitGuidance(p:Progress,n:TransitNetwork){const m=mapById(p.world?.mapId);if(!m||!n.mapIds.includes(m.id))return '';const c=chapters.find(c=>c.id===n.chapterId)!,goal=mainObjective(p.adventure,c),to=transitDestinations(p,n).find(s=>s.locationId===goal.locationId&&s.id!==m.id);return to&&!transitReason(p,to.id,n)?` ${n.id==='railway'?'鉄道':'区画制御'}：解放済みの${to.name}${n.id==='railway'?'駅':''}へ移動できます。`:''}
