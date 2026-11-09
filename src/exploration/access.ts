import {safeReturnPose} from './safe-return';
import {activeMap} from './active-map';
import type {Progress} from '../save';
import type {SymbolContact} from './types';
import {mapById,objectForEvent,symbolForEvent,walkMaps} from './map-data';
import {clearCircle,closeEnough,distance,canInteract} from './collision';
export function mapEventReason(p:Progress,eventId:string){const found=objectForEvent(eventId);if(!found)return '';return p.world?.mapId===found.map.id&&p.adventure.chapters[found.map.chapterId]?.currentLocationId===found.map.locationId&&canInteract(activeMap(found.map,p.adventure),p.world,found.object)?'':'歩行マップで対象の近くへ移動して調べてください。'}
export function validSymbolContact(p:Progress,eventId:string,source?:SymbolContact){
 const found=symbolForEvent(eventId);if(!found)return !source;
 if(!source||!p.world||p.world.mapId!==found.map.id||source.mapId!==found.map.id||source.symbolId!==found.symbol.id||p.adventure.chapters[found.map.chapterId]?.currentLocationId!==found.map.locationId)return false;
 if(p.adventure.pending&&p.world.returnInfo?.serial===p.adventure.pending.serial)return false;
 return clearCircle(activeMap(found.map,p.adventure),p.world)&&clearCircle(activeMap(found.map,p.adventure),source.position,found.symbol.radius)&&distance(found.symbol,source.position)<=found.symbol.leash+1&&closeEnough(p.world,source.position,10+found.symbol.radius+.5);
}
/** Event completion is the authority; arrays are receipts for rendering/save inspection only. */
export function syncWorldProgress(p:Progress){if(!p.world)return;const done=(chapterId:string)=>p.adventure.chapters[chapterId]?.completed??[];p.world.defeated=walkMaps.flatMap(m=>m.symbols.filter(s=>done(m.chapterId).includes(s.eventId)).map(s=>s.id));p.world.opened=walkMaps.flatMap(m=>m.objects.filter(o=>o.kind==='chest'&&o.eventId&&done(m.chapterId).includes(o.eventId)).map(o=>o.id));}
export function captureReturn(p:Progress,eventId:string,serial:number,source?:SymbolContact){const found=symbolForEvent(eventId);if(!found||!source||!p.world)return;p.world.event=undefined;p.world.returnInfo={chapterId:found.map.chapterId,mapId:found.map.id,symbolId:found.symbol.id,eventId,encounterId:found.symbol.encounterId,serial,pose:{x:p.world.x,y:p.world.y,facing:p.world.facing}};}
export function settleWorld(p:Progress,serial:number,result:'victory'|'defeat'){syncWorldProgress(p);const r=p.world?.returnInfo;if(!p.world||r?.serial!==serial)return;const map=mapById(r.mapId);if(!map)return;const effective=activeMap(map,p.adventure),pose=map.returnToContact?safeReturnPose(effective,r.pose,map.symbols.filter(s=>!p.world!.defeated.includes(s.id)).map(s=>({x:s.x,y:s.y}))):map.entry;Object.assign(p.world,pose);r.outcome=result;}

export function mapObjectiveReason(p:Progress,id:string){const found=walkMaps.flatMap(map=>map.objects.filter(o=>o.objectiveId===id).map(object=>({map,object})))[0];return !found||p.world?.mapId===found.map.id&&p.adventure.chapters[found.map.chapterId]?.currentLocationId===found.map.locationId&&canInteract(activeMap(found.map,p.adventure),p.world,found.object)?'':'歩行マップで調査対象の近くへ移動してください。';}
