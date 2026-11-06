import type Phaser from 'phaser';
import type {WalkMap} from './types';
/** Two batched graphics, refreshed at 10 Hz. Motion is decorative, never a tide clock. */
export function makeSeaEffects(scene:Phaser.Scene,map:WalkMap){
 if(!['coast','seaside','harbor','beach','observatory','seacave','undersea','tidecore'].includes(map.theme??''))return;
 const water=scene.add.graphics().setDepth(1),light=scene.add.graphics().setDepth(2);let last=-1000;
 return {update(time:number,reduced:boolean){if(reduced&&last>=0||!reduced&&time-last<100)return;last=time;water.clear();light.clear();const wave=reduced?0:Math.sin(time/900)*3;
 for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++)if(map.grid[y][x]==='~'){water.lineStyle(1,0xc4ecf0,.25);water.lineBetween(x*32+4,y*32+13+wave,x*32+25,y*32+13+wave);water.fillStyle(0xd8f0dd,.08);water.fillRect(x*32+10,y*32+22-wave,12,3)}
 for(const d of map.decorations??[])if(d.kind==='lamp'||d.kind==='machine'){light.fillStyle(0xe6e6af,reduced?.18:.14+(Math.sin(time/1100)+1)*.06);light.fillCircle(d.x,d.y,d.kind==='machine'?23:14)}
 }};
}
