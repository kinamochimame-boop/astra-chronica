import {cell,center,clearCircle,distance,canInteract} from './collision';
import {pathDistance,findPath} from './pathfinding';
import type {Point,WalkMap} from './types';
/** Choose the shortest reachable interaction position; Euclidean bounds avoid redundant searches. */
export function approachPoint(map:WalkMap,start:Point,target:Point){
 const c=cell(map,target),candidates=[{x:c.x-1,y:c.y},{x:c.x+1,y:c.y},{x:c.x,y:c.y-1},{x:c.x,y:c.y+1}].map(p=>center(map,p)).filter(p=>clearCircle(map,p)&&canInteract(map,p,target)&&distance(p,target)>=20).sort((a,b)=>distance(start,a)-distance(start,b));
 let best:Point|undefined,length=Infinity;
 for(const point of candidates){if(distance(start,point)>=length)continue;const path=findPath(map,start,point);if(!path)continue;const d=pathDistance(start,path);if(d<length){length=d;best=point;}}
 return best;
}
