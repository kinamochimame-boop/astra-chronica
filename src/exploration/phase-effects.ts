import type Phaser from 'phaser';
import type {Point,WalkMap} from './types';
import type {StellarPhase} from './stellar-phase';
/** A light overlay, independent of collision, input and the camera's orientation. */
export function makePhaseEffects(scene:Phaser.Scene,map:WalkMap,phase:StellarPhase){
 if(map.chapterId!=='chapter-15')return;
 const graphics=scene.add.graphics().setDepth(2);let last=-1000,key='';
 return {update(time:number,reduced:boolean,camera:Point,height:number){
  const next=`${Math.round(camera.x/16)}:${Math.round(camera.y/16)}`;
  if(reduced&&last>=0&&key===next||!reduced&&time-last<100)return;
  last=time;key=next;graphics.clear();
  const colors={chaotic:0xa4acc0,synced:0xd3c49b,inverted:0xbba9df,stable:0xa1dfd1};
  graphics.lineStyle(1,colors[phase],.45);
  const drift=reduced?0:Math.sin(time/1800)*2;
  for(let y=0;y<3;y++)for(let x=0;x<7;x++){
   const px=camera.x+24+x*56,py=camera.y+height-28-y*36+drift;
   graphics.strokeCircle(px,py,phase==='chaotic'?2:4);graphics.lineBetween(px-6,py,px+6,py);
  }
 }};
}
