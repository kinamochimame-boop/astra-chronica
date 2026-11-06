import {cell,center,walkable,clearCircle} from './collision';
import type {Point,WalkMap} from './types';
/** Four-neighbour A*: no diagonal corner cutting, bounded by the finite map grid. */
export function findPath(map:WalkMap,start:Point,end:Point):Point[]|undefined{
 if(!clearCircle(map,start)||!Number.isFinite(end.x)||!Number.isFinite(end.y))return;
 const a=cell(map,start),b=cell(map,end);if(!walkable(map,b.x,b.y))return;
 const key=(p:Point)=>p.y*map.width+p.x,goal=key(b),first=key(a),open=[first],cost=new Map([[first,0]]),parent=new Map<number,number>(),closed=new Set<number>();
 const h=(id:number)=>Math.abs(id%map.width-b.x)+Math.abs(Math.floor(id/map.width)-b.y);
 while(open.length){open.sort((x,y)=>cost.get(x)!+h(x)-cost.get(y)!-h(y)||x-y);const id=open.shift()!;if(id===goal){const path=[id];while(path[0]!==first)path.unshift(parent.get(path[0])!);return path.map(n=>center(map,{x:n%map.width,y:Math.floor(n/map.width)}));}closed.add(id);const x=id%map.width,y=Math.floor(id/map.width);for(const next of [{x:x+1,y},{x:x-1,y},{x,y:y+1},{x,y:y-1}]){const n=key(next);if(!walkable(map,next.x,next.y)||closed.has(n))continue;const g=cost.get(id)!+1;if(g<(cost.get(n)??Infinity)){cost.set(n,g);parent.set(n,id);if(!open.includes(n))open.push(n)}}
 }return;
}
