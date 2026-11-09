import type {Point,Pose,WalkMap} from './types';
import {clearCircle,distance} from './collision';
import {findPath} from './pathfinding';
/** Find the nearest reachable safe cell after contact; entry remains the final fallback. */
export function safeReturnPose(map:WalkMap,pose:Pose,danger:Point[]):Pose{
 const safe=(p:Point)=>clearCircle(map,p)&&danger.every(s=>distance(p,s)>=176);
 if(safe(pose))return {...pose};
 const candidates:Point[]=[];
 for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){const p={x:(x+.5)*map.tile,y:(y+.5)*map.tile};if(safe(p))candidates.push(p)}
 candidates.sort((a,b)=>distance(a,pose)-distance(b,pose));
 const result=candidates.find(p=>!!findPath(map,map.entry,p));
 return result?{...result,facing:pose.facing}:{...map.entry};
}
