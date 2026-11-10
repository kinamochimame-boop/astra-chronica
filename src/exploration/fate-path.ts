import type {AdventureProgress} from '../adventure';
import type {WalkMap} from './types';
export type FatePhase='fixed'|'decoded'|'branched'|'reconnected';
/** Only confirmed event receipts establish a phase; choices determine route, not unlocks. */
export function fatePhase(a:AdventureProgress):FatePhase{const done=a.chapters['chapter-17']?.completed??[];return done.includes('c17-reconnect')?'reconnected':done.includes('c17-branch')?'branched':done.includes('c17-decode')?'decoded':'fixed'}
export const fateLabel=(phase:FatePhase)=>({fixed:'記録固定（星路閉鎖）',decoded:'記録解読（破線は通行不可）',branched:'未来分岐（選んだ星路を通行可）',reconnected:'運命再接続（両星路を通行可）'})[phase];
export type FateRoute='direct'|'shelter';
export const fateRoute=(choices:Record<string,string>):FateRoute=>choices['c17-branch']==='listen'?'shelter':'direct';
/** Same effective grid serves drawing, pathfinding, collision, minimap and save repair. */
export function fateMap(map:WalkMap,a:AdventureProgress,choices:Record<string,string>={}):WalkMap{
 if(map.chapterId!=='chapter-17'||!map.fatePaths?.length)return map;
 const phase=fatePhase(a),route=fateRoute(choices),rows=map.grid.map(r=>r.split(''));
 for(const b of map.fatePaths){const open=phase==='reconnected'||phase==='branched'&&b.route===route;if(!open)for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)if(rows[y]?.[x]==='.')rows[y][x]='~'}
 return {...map,grid:rows.map(r=>r.join(''))};
}
