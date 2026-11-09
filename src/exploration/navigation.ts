import type {Progress} from '../save';
import type {Point,WalkMap,MapObject} from './types';
import {chapters} from '../data/chapter-one';
import {chapterState,eventOpen,locationOpen} from '../adventure';
import {mainObjective} from './objective';
import {mapById,walkMaps} from './map-data';
import {transitionReason,objectConditionReason} from './transitions';
import {findPath} from './pathfinding';
import {approachPoint} from './approach';
import {activeMap} from './active-map';
import {mapOpen} from './exploration-save';
const arrow=(from:Point,to:Point)=>{const x=to.x-from.x,y=to.y-from.y;if(Math.hypot(x,y)<32)return '◎';return ['→','↘','↓','↙','←','↖','↑','↗'][(Math.round(Math.atan2(y,x)/(Math.PI/4))+8)%8]};
export interface NavigationTarget {point:Point;name:string;kind:'object'|'chest'|'exit'|'device'}
const cache=new WeakMap<Progress,{key:string;grid:WalkMap['grid'];target?:NavigationTarget}>();
/** One target drives the text and minimap. Only open, physically reachable links are eligible. */
export function navigationTarget(p:Progress,map:WalkMap,hero:Point,live:readonly {x:number;y:number;definition:{id:string}}[]=[]):NavigationTarget|undefined{
 const chapter=chapters.find(c=>c.id===map.chapterId)!,state=chapterState(p.adventure,chapter),goal=mainObjective(p.adventure,chapter);
 const key=[map.id,goal.eventId,Math.floor(hero.x/map.tile),Math.floor(hero.y/map.tile),state.completed.join(','),live.map(s=>s.definition.id+':'+Math.floor(s.x/map.tile)+':'+Math.floor(s.y/map.tile)).join(',')].join('|'),old=cache.get(p);
 if(old?.key===key&&old.grid===map.grid)return old.target;
 const target=resolve();cache.set(p,{key,grid:map.grid,target});return target;
 function resolve():NavigationTarget|undefined{
  if(!goal.eventId||!goal.locationId)return;
  const local=map.objects.find(o=>o.eventId===goal.eventId)??map.symbols.find(s=>s.eventId===goal.eventId);
  if(local){const point=live.find(s=>s.definition.id===local.id)??local;
   if(approachPoint(map,hero,point))return {point,name:local.name,kind:'kind'in local&&local.kind==='chest'?'chest':'object'};
   // A closed target never becomes a false route. Offer an available, reachable device instead.
   const device=map.objects.find(o=>{const e=chapter.events.find(e=>e.id===o.eventId);return o.id!==local.id&&e&&!state.completed.includes(e.id)&&eventOpen(state,e)&&!objectConditionReason(p,map,o)&&!!approachPoint(map,hero,o)});
   return device?{point:device,name:device.name,kind:'device'}:undefined;
  }
  const maps=walkMaps.filter(m=>m.chapterId===chapter.id),byLocation=new Map(maps.map(m=>[m.locationId,m]));
  const exits=(m:WalkMap,from:Point)=>m.objects.filter(o=>o.kind==='exit'&&!objectConditionReason(p,m,o)&&(o.targetMap?!!mapById(o.targetMap)&&mapOpen(p.adventure,mapById(o.targetMap)!):!!o.targetLocation&&locationOpen(state,chapter,o.targetLocation))&&!!findPath(m,from,o));
  const destination=(o:MapObject)=>o.targetMap?mapById(o.targetMap)?.locationId:o.targetLocation;
  const reachable=(first:string)=>{const queue=[{id:first,steps:0}],seen=new Set<string>();for(let i=0;i<queue.length;i++){const {id,steps}=queue[i];if(id===goal.locationId)return steps;if(seen.has(id))continue;seen.add(id);const base=byLocation.get(id),ids:string[]=[];if(base){const effective=activeMap(base,p.adventure);ids.push(...exits(effective,effective.entry).map(destination).filter((s):s is string=>!!s))}else {const ix=chapter.locations.findIndex(l=>l.id===id);for(const n of [ix-1,ix+1]){const l=chapter.locations[n];if(l&&locationOpen(state,chapter,l.id))ids.push(l.id)}}for(const next of ids)if(!seen.has(next))queue.push({id:next,steps:steps+1})}return Infinity};
  const next=exits(map,hero).filter(o=>!transitionReason(p,map,o)).map(o=>({o,steps:reachable(destination(o)!)})).filter(v=>Number.isFinite(v.steps)).sort((a,b)=>a.steps-b.steps)[0]?.o;
  return next?{point:next,name:next.name,kind:'exit'}:undefined;
 }
}
export function routeGuidance(p:Progress,map:WalkMap,hero:Point,live:readonly {x:number;y:number;definition:{id:string}}[]=[]){
 const goal=mainObjective(p.adventure,chapters.find(c=>c.id===map.chapterId)!);if(!goal.eventId)return '';
 const target=navigationTarget(p,map,hero,live);
 return target?`${arrow(hero,target.point)} ${{object:'目的の対象',chest:'宝箱',exit:'出口',device:'先に必要な装置・イベント'}[target.kind]}：${target.name}`:'目的地へは探索メニューの地点一覧から。未解放・通行不能の出口は案内しません。手前の装置やイベントを確認してください。';
}
