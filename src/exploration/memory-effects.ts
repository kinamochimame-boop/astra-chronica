import type Phaser from 'phaser';
import type {WalkMap} from './types';
import type {MemoryPhase} from './memory-projection';
/** Static historical outlines: no particles, input transform or per-frame redraw. */
export function makeMemoryEffects(scene:Phaser.Scene,map:WalkMap,phase:MemoryPhase){
 if(map.chapterId!=='chapter-16'||phase==='severed')return;
 const g=scene.add.graphics().setDepth(2),projected=phase==='projected',color=projected?0x94c8e1:0xd6dfb8;
 g.lineStyle(2,color,projected?.35:.7);
 // Buildings survive only as outlines, visually distinct from chapter15's drifting rings.
 for(const x of [160,576]){g.strokeRect(x,80,128,144);for(let n=1;n<4;n++)g.lineBetween(x+n*32,80,x+n*32,224);g.lineBetween(x,128,x+128,128)}
 for(const b of map.projection??[]){const x=b.x*map.tile,y=b.y*map.tile,w=b.w*map.tile,h=b.h*map.tile;g.fillStyle(color,projected?.08:.22);g.fillRect(x,y,w,h);g.strokeRect(x,y,w,h);for(let i=0;i<h;i+=16)g.lineBetween(x,y+i,x+w,y+i);scene.add.text(x,y-20,projected?'投影のみ・通行不可':'接続済みの橋',{fontSize:'12px',color:projected?'#b6d8e8':'#e4e8bf',backgroundColor:'#172630'}).setDepth(3)}
 return g;
}
