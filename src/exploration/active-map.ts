import {fateMap} from './fate-path';
import {projectedMap} from './memory-projection';
import type {AdventureProgress} from '../adventure';
import type {WalkMap} from './types';
import {tidalMap} from './tide';
/** Pure overlay: immutable definitions + confirmed events, shared by drawing, collision and save validation. */
export function activeMap(base:WalkMap,a:AdventureProgress,choices:Record<string,string>={}):WalkMap{const map=fateMap(projectedMap(tidalMap(base,a),a),a,choices),done=a.chapters[map.chapterId]?.completed??[],closed=map.gates?.filter(g=>g.requires.some(id=>!done.includes(id))||!!g.closedWhile&&done.includes(g.closedWhile.from)&&!done.includes(g.closedWhile.until));if(!closed?.length)return map;const grid=map.grid.map(row=>row.split(''));for(const {area:b} of closed)for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)if(grid[y]?.[x]==='.')grid[y][x]='#';return {...map,grid:grid.map(row=>row.join(''))}}
