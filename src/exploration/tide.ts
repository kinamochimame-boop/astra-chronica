import type {AdventureProgress} from '../adventure';
import type {WalkMap} from './types';
export type TidePhase='normal'|'high'|'low';
/** Derived exclusively from confirmed events: never from clock time or untrusted save flags. */
export function tidePhase(a:AdventureProgress):TidePhase {const done=a.chapters['chapter-10']?.completed??[];return done.includes('c10-clear')?'normal':done.includes('c10-low-tide')?'low':done.includes('c10-high-tide')?'high':'normal'}
export const tideLabel=(phase:TidePhase)=>({normal:'通常潮位',high:'満潮',low:'干潮'})[phase];
export function tidalMap(map:WalkMap,a:AdventureProgress):WalkMap {
 if(!map.tidal||tidePhase(a)!=='high')return map;
 const rows=map.grid.map(row=>row.split(''));for(const b of map.tidal)for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)if(rows[y]?.[x]==='.')rows[y][x]='~';
 return {...map,grid:rows.map(row=>row.join(''))};
}
export function tideReason(a:AdventureProgress,map:WalkMap,needsLow?:boolean){return needsLow&&map.chapterId==='chapter-10'&&tidePhase(a)==='high'?'満潮のため通行できません。断崖から観測所へ進み、星灯塔で信号を分けると干潮になります。':''}
