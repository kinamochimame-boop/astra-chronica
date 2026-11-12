import type {Point,WalkMap} from './types';
export const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
export const cell=(map:WalkMap,p:Point)=>({x:Math.floor(p.x/map.tile),y:Math.floor(p.y/map.tile)});
export const center=(map:WalkMap,p:Point)=>({x:(p.x+.5)*map.tile,y:(p.y+.5)*map.tile});
export const walkable=(map:WalkMap,x:number,y:number)=>map.grid[y]?.[x]==='.';
export function clearCircle(map:WalkMap,p:Point,radius=10){
 if(!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<radius||p.y<radius||p.x>map.width*map.tile-radius||p.y>map.height*map.tile-radius)return false;
 for(let y=Math.floor((p.y-radius)/map.tile);y<=Math.floor((p.y+radius)/map.tile);y++)for(let x=Math.floor((p.x-radius)/map.tile);x<=Math.floor((p.x+radius)/map.tile);x++)if(!walkable(map,x,y)){const q={x:Math.max(x*map.tile,Math.min(p.x,(x+1)*map.tile)),y:Math.max(y*map.tile,Math.min(p.y,(y+1)*map.tile))};if(distance(p,q)<radius)return false;}return true;
}
export function cameraFor(map:WalkMap,hero:Point,width:number,height:number){return {x:Math.max(0,Math.min(map.width*map.tile-width,hero.x-width/2)),y:Math.max(0,Math.min(map.height*map.tile-height,hero.y-height/2))}}
export const closeEnough=(a:Point,b:Point,radius=52)=>distance(a,b)<=radius;
/** Exact unobstructed interaction ray, including thin corner crossings between old samples. */
export function canInteract(map:WalkMap,a:Point,b:Point,radius=52){return closeEnough(a,b,radius)&&clearSegment(map,a,b,1e-6)}
/** Exact swept-circle clearance against closed tile rectangles (tangency is allowed). */
export function clearSegment(map:WalkMap,a:Point,b:Point,radius=10){
 if(!Number.isFinite(radius)||radius<=0||!clearCircle(map,a,radius)||!clearCircle(map,b,radius))return false;
 const pointSegment2=(p:Point)=>{const dx=b.x-a.x,dy=b.y-a.y,d=dx*dx+dy*dy,t=d?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/d)):0;return (p.x-a.x-t*dx)**2+(p.y-a.y-t*dy)**2};
 for(let y=Math.floor((Math.min(a.y,b.y)-radius)/map.tile);y<=Math.floor((Math.max(a.y,b.y)+radius)/map.tile);y++)for(let x=Math.floor((Math.min(a.x,b.x)-radius)/map.tile);x<=Math.floor((Math.max(a.x,b.x)+radius)/map.tile);x++){
  if(walkable(map,x,y))continue;const left=x*map.tile,right=left+map.tile,top=y*map.tile,bottom=top+map.tile;
  let lo=0,hi=1;for(const [p,d,min,max] of [[a.x,b.x-a.x,left,right],[a.y,b.y-a.y,top,bottom]]){if(d===0){if(p<min||p>max){lo=1;hi=0;break}}else{const u=(min-p)/d,v=(max-p)/d;lo=Math.max(lo,Math.min(u,v));hi=Math.min(hi,Math.max(u,v));}}
  if(lo<=hi)return false;
  const rectDistance2=(p:Point)=>Math.max(left-p.x,0,p.x-right)**2+Math.max(top-p.y,0,p.y-bottom)**2;
  if(Math.min(rectDistance2(a),rectDistance2(b),...[[left,top],[left,bottom],[right,top],[right,bottom]].map(([x,y])=>pointSegment2({x,y})))<radius*radius-1e-9)return false;
 }return true;
}
