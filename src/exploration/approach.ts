import {cell,center,clearCircle,distance} from './collision';
import {findPath} from './pathfinding';
import type {Point,WalkMap} from './types';
/** Stop on a reachable adjacent tile, never inside an NPC/exit, and never auto-activate it. */
export function approachPoint(map:WalkMap,start:Point,target:Point){const c=cell(map,target);return [{x:c.x-1,y:c.y},{x:c.x+1,y:c.y},{x:c.x,y:c.y-1},{x:c.x,y:c.y+1}].map(p=>center(map,p)).filter(p=>clearCircle(map,p)).map(p=>({point:p,path:findPath(map,start,p)})).filter(v=>v.path).sort((a,b)=>a.path!.length-b.path!.length||distance(start,a.point)-distance(start,b.point))[0]?.point}
