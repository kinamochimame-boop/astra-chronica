import type {AdventureProgress} from '../adventure';
export type MemoryPhase='severed'|'projected'|'connected'|'integrated';
/** Records, not wall time or extra save flags, determine the four stages. */
export function memoryPhase(a:AdventureProgress):MemoryPhase{const done=a.chapters['chapter-16']?.completed??[];return done.includes('c16-integration')?'integrated':done.includes('c16-connection')?'connected':done.includes('c16-projection')?'projected':'severed'}
export const memoryLabel=(phase:MemoryPhase)=>({severed:'記録断絶',projected:'記憶投影（輪郭のみ・橋は通行不可）',connected:'記憶接続（橋の通行可）',integrated:'記憶統合（中枢路開放）'})[phase];

/** Historical bridges are water/gaps until connected; all consumers receive this same grid. */
export function projectedMap(map:import('./types').WalkMap,a:AdventureProgress):import('./types').WalkMap{
 if(map.chapterId!=='chapter-16'||!map.projection?.length||['connected','integrated'].includes(memoryPhase(a)))return map;
 const rows=map.grid.map(row=>row.split(''));
 for(const b of map.projection)for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)if(rows[y]?.[x]==='.')rows[y][x]='~';
 return {...map,grid:rows.map(row=>row.join(''))};
}
