import {activeMap} from './active-map';
import {chapters} from '../data/chapter-one';
import {chapterOpen,chapterState,eventOpen,locationOpen,visitLocation,type AdventureProgress} from '../adventure';
import type {Progress} from '../save';
import {clearCircle,distance} from './collision';
import {mapById,walkMaps,symbolForEvent,objectForEvent} from './map-data';
import {syncWorldProgress} from './access';
import type {Facing,Pose,WalkMap,WorldSave} from './types';
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const face=(v:unknown):Facing=>['up','down','left','right'].includes(v as string)?v as Facing:'down';
export function mapOpen(adventure:AdventureProgress,map:WalkMap){const c=chapters.find(c=>c.id===map.chapterId)!;return !!c&&chapterOpen(adventure,c)&&locationOpen(chapterState(adventure,c),c,map.locationId)&&(map.requires??[]).every(id=>chapterState(adventure,c).completed.includes(id))}
function recordedPose(map:WalkMap,raw:unknown):Pose {return record(raw)&&typeof raw.x==='number'&&typeof raw.y==='number'&&clearCircle(map,{x:raw.x,y:raw.y})?{x:raw.x,y:raw.y,facing:face(raw.facing)}:{...map.entry}}
export function safePose(map:WalkMap,raw:unknown,adventure:AdventureProgress):Pose {
 if(!record(raw)||typeof raw.x!=='number'||typeof raw.y!=='number'||!clearCircle(map,{x:raw.x,y:raw.y}))return {...map.entry};
 const p={x:raw.x,y:raw.y,facing:face(raw.facing)},done=adventure.chapters[map.chapterId]?.completed??[];
 for(const s of map.symbols.filter(s=>!done.includes(s.eventId))){if(distance(p,s)<56||(s.mode==='chase'&&distance(p,s)<s.aggro+56))return {...map.entry};if(s.mode==='patrol'&&s.route.some(q=>distance(p,q)<64))return {...map.entry};}return p;
}
export function normalizeWorld(raw:unknown,adventure:AdventureProgress,choices:Record<string,string>={}):WorldSave|undefined {
 if(!record(raw))return;const requested=mapById(raw.mapId),map=requested&&mapOpen(adventure,requested)?requested:walkMaps.find(m=>mapOpen(adventure,m));if(!map)return;
 const active=activeMap(map,adventure,choices);const pose=safePose(active,requested?.id===map.id?raw:undefined,adventure),done=adventure.chapters[map.chapterId]?.completed??[];
 const out:WorldSave={mapId:map.id,...pose,defeated:walkMaps.flatMap(m=>m.symbols.filter(s=>(adventure.chapters[m.chapterId]?.completed??[]).includes(s.eventId)).map(s=>s.id)),opened:walkMaps.flatMap(m=>m.objects.filter(o=>o.kind==='chest'&&!!o.eventId&&(adventure.chapters[m.chapterId]?.completed??[]).includes(o.eventId)).map(o=>o.id))};
 const savedEvent=raw.event;if(record(savedEvent)&&typeof savedEvent.id==='string'){const found=objectForEvent(savedEvent.id),c=chapters.find(c=>c.id===map.chapterId)!,e=c.events.find(e=>e.id===savedEvent.id);if(found?.map.id===map.id&&e&&eventOpen(chapterState(adventure,c),e)&&!done.includes(e.id)&&Number.isInteger(savedEvent.page)&&Number(savedEvent.page)>=0&&Number(savedEvent.page)<e.pages.length)out.event={id:e.id,page:Number(savedEvent.page)}}
 const r=raw.returnInfo;if(record(r)&&typeof r.eventId==='string'){const f=symbolForEvent(r.eventId);if(f?.map.id===map.id&&r.mapId===map.id&&r.chapterId===map.chapterId&&r.symbolId===f.symbol.id&&r.encounterId===f.symbol.encounterId&&Number.isSafeInteger(r.serial)&&Number(r.serial)>0&&Number(r.serial)<=adventure.serial){const pending=adventure.pending?.serial===r.serial&&adventure.pending?.eventId===r.eventId,settled=Number(r.serial)<=adventure.resolved&&(r.outcome==='defeat'||r.outcome==='victory'&&done.includes(r.eventId));if(pending||settled){out.returnInfo={chapterId:map.chapterId,mapId:map.id,symbolId:f.symbol.id,eventId:r.eventId,encounterId:f.symbol.encounterId,serial:Number(r.serial),pose:recordedPose(map,r.pose),...(settled?{outcome:r.outcome as 'victory'|'defeat'}:{})};Object.assign(out,map.entry);}}}
 return out;
}
/** An interrupted map battle is abandoned, never counted as victory or defeat. Old chapters are untouched. */
export function recoverWorld(p:Progress){const pending=p.adventure.pending,found=pending&&symbolForEvent(pending.eventId);if(found&&mapOpen(p.adventure,found.map)){p.world??={mapId:found.map.id,...found.map.entry,defeated:[],opened:[]};p.world.mapId=found.map.id;const c=chapters.find(c=>c.id===found.map.chapterId)!;visitLocation(p.adventure,c,found.map.locationId);p.adventure.selectedChapterId=c.id;Object.assign(p.world,found.map.entry);p.world.returnInfo=undefined;p.world.event=undefined;p.world.recovered=true;p.adventure.resolved=pending!.serial;p.adventure.pending=undefined;syncWorldProgress(p);}}
export function enterMap(p:Progress,id:string){const map=mapById(id);if(!map||!mapOpen(p.adventure,map)||!clearCircle(activeMap(map,p.adventure,p.choices),map.entry))return false;const c=chapters.find(c=>c.id===map.chapterId)!;if(!visitLocation(p.adventure,c,map.locationId))return false;p.adventure.selectedChapterId=c.id;if(!p.world||p.world.mapId!==id)p.world={mapId:id,...map.entry,defeated:[],opened:[]};else {Object.assign(p.world,safePose(activeMap(map,p.adventure,p.choices),p.world,p.adventure));p.world.returnInfo=undefined;}syncWorldProgress(p);return true;}
