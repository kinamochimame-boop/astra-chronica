import {cell,center,walkable,clearCircle,clearSegment,distance} from './collision';
import type {Point,WalkMap} from './types';
export const pathDistance=(start:Point,path:readonly Point[])=>path.reduce((sum,p,i)=>sum+distance(i?path[i-1]:start,p),0);
/** Radius-aware eight-neighbour A*, followed by safe farthest-visible string pulling. */
export function findPath(map:WalkMap,start:Point,end:Point,radius=10):Point[]|undefined{
 if(!clearCircle(map,start,radius)||!clearCircle(map,end,radius))return;
 if(clearSegment(map,start,end,radius))return distance(start,end)<1e-8?[]:[{x:end.x,y:end.y}];
 const a=cell(map,start),b=cell(map,end),key=(p:Point)=>p.y*map.width+p.x,goal=key(b),first=map.width*map.height;
 const position=(id:number)=>id===first?start:center(map,{x:id%map.width,y:Math.floor(id/map.width)});
 const open:{id:number;g:number;f:number}[]=[],cost=new Map([[first,0]]),parent=new Map<number,number>(),closed=new Set<number>();
 const goalCenter=center(map,b),h=(id:number)=>{if(id===first)return distance(start,goalCenter)/map.tile;const dx=Math.abs(id%map.width-b.x),dy=Math.abs(Math.floor(id/map.width)-b.y);return Math.max(dx,dy)+(Math.SQRT2-1)*Math.min(dx,dy);};
 const less=(a:typeof open[number],b:typeof open[number])=>a.f<b.f||a.f===b.f&&a.id<b.id;
 const push=(id:number,g:number)=>{const value={id,g,f:g+h(id)};let i=open.length;open.push(value);while(i){const p=(i-1)>>1;if(!less(value,open[p]))break;open[i]=open[p];i=p;}open[i]=value;};
 const pop=()=>{const value=open[0],last=open.pop()!;if(open.length){let i=0;while(i*2+1<open.length){let c=i*2+1;if(c+1<open.length&&less(open[c+1],open[c]))c++;if(!less(open[c],last))break;open[i]=open[c];i=c;}open[i]=last;}return value;};push(first,0);
 while(open.length){const item=pop(),id=item.id;if(closed.has(id)||item.g!==cost.get(id))continue;if(id===goal){
   const ids=[id];while(ids[0]!==first)ids.unshift(parent.get(ids[0])!);
   const points=[...ids.slice(1).map(position),{x:end.x,y:end.y}];if(!clearSegment(map,position(goal),end,radius))return;
   const result:Point[]=[];let anchor=start,index=0;while(index<points.length){let next=points.length-1;while(next>index&&!clearSegment(map,anchor,points[next],radius))next--;if(!clearSegment(map,anchor,points[next],radius))return;result.push(points[next]);anchor=points[next];index=next+1;}return result;
  }
  closed.add(id);const x=id===first?a.x:id%map.width,y=id===first?a.y:Math.floor(id/map.width);
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
   if(!dx&&!dy&&id!==first)continue;const next={x:x+dx,y:y+dy},n=key(next);if(!walkable(map,next.x,next.y)||closed.has(n)||dx&&dy&&(!walkable(map,x+dx,y)||!walkable(map,x,y+dy)))continue;
   // Centre-to-centre edges are safe up to half a tile when both diagonal side cells are open.
   const p=position(n);if((id===first||radius>map.tile/2)&&!clearSegment(map,position(id),p,radius))continue;
   const g=cost.get(id)!+(id===first?distance(start,p)/map.tile:dx&&dy?Math.SQRT2:1);if(g<(cost.get(n)??Infinity)){cost.set(n,g);parent.set(n,id);push(n,g);}
  }
 }return;
}
