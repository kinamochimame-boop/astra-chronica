import type {Progress} from '../save';
import type {Point,WalkMap,MapObject} from './types';
import {chapters} from '../data/chapter-one';
import {chapterState,locationOpen} from '../adventure';
import {mainObjective} from './objective';
import {mapById,walkMaps} from './map-data';
import {transitionReason,objectConditionReason} from './transitions';
import {findPath} from './pathfinding';
import {mapOpen} from './exploration-save';
const arrow=(from:Point,to:Point)=>{const x=to.x-from.x,y=to.y-from.y;if(Math.hypot(x,y)<32)return '◎';return ['→','↘','↓','↙','←','↖','↑','↗'][(Math.round(Math.atan2(y,x)/(Math.PI/4))+8)%8]};
/** Route search uses actual map exits; legacy places connect through the existing unlocked-place list. */
export function routeGuidance(p:Progress,map:WalkMap,hero:Point,liveSymbols:readonly {x:number;y:number;definition:{id:string}}[]=[]){const chapter=chapters.find(c=>c.id===map.chapterId)!,goal=mainObjective(p.adventure,chapter);if(!goal.eventId||!goal.locationId)return '';
 const local=map.objects.find(o=>o.eventId===goal.eventId)??map.symbols.find(s=>s.eventId===goal.eventId);if(local)return `${arrow(hero,liveSymbols.find(s=>s.definition.id===local.id)??local)} ${'kind'in local&&local.kind==='chest'?'宝箱':'目的の対象'}：${'name'in local?local.name:goal.title}`;
 const state=chapterState(p.adventure,chapter),maps=walkMaps.filter(m=>m.chapterId===chapter.id),byLocation=new Map(maps.map(m=>[m.locationId,m]));
 const exits=(m:WalkMap)=>m.objects.filter(o=>o.kind==='exit'&&!objectConditionReason(p,m,o)&&(o.targetMap?!!mapById(o.targetMap)&&mapOpen(p.adventure,mapById(o.targetMap)!):!!o.targetLocation&&locationOpen(state,chapter,o.targetLocation)));
 const target=(o:MapObject)=>o.targetMap?mapById(o.targetMap)?.locationId:o.targetLocation;
 const reachable=(first:string)=>{const queue=[{id:first,steps:0}],seen=new Set<string>();for(let i=0;i<queue.length;i++){const {id,steps}=queue[i];if(id===goal.locationId)return steps;if(seen.has(id))continue;seen.add(id);const m=byLocation.get(id);const ids:string[]=[];if(m)ids.push(...exits(m).map(target).filter((s):s is string=>!!s));else {const ix=chapter.locations.findIndex(l=>l.id===id);for(const n of [ix-1,ix+1]){const l=chapter.locations[n];if(l&&locationOpen(state,chapter,l.id))ids.push(l.id)}}for(const next of ids)if(!seen.has(next))queue.push({id:next,steps:steps+1})}return Infinity};
 const next=exits(map).filter(o=>!transitionReason(p,map,o)&&!!findPath(map,hero,o)).map(o=>({o,steps:reachable(target(o)!)})).filter(v=>Number.isFinite(v.steps)).sort((a,b)=>a.steps-b.steps)[0]?.o;
 return next?`${arrow(hero,next)} 出口：${next.name}`:'目的地へは探索メニューの地点一覧から。未解放の出口は案内しません。';
}
