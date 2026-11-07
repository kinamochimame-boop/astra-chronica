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
/** Ray samples narrower than a tile prevent interaction through walls, without changing movement collision. */
export function canInteract(map:WalkMap,a:Point,b:Point,radius=52){if(!closeEnough(a,b,radius))return false;const steps=Math.max(1,Math.ceil(distance(a,b)/4));for(let i=0;i<=steps;i++){const c=cell(map,{x:a.x+(b.x-a.x)*i/steps,y:a.y+(b.y-a.y)*i/steps});if(!walkable(map,c.x,c.y))return false}return true}
