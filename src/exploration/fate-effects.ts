import type Phaser from 'phaser';
import type {WalkMap} from './types';
import type {FatePhase,FateRoute} from './fate-path';
/** Static forked linework and readable signs. Reduced motion loses no state information. */
export function makeFateEffects(scene:Phaser.Scene,map:WalkMap,phase:FatePhase,route:FateRoute){
 if(map.chapterId!=='chapter-17')return;
 const g=scene.add.graphics().setDepth(2);
 for(const b of map.fatePaths??[]){const open=phase==='reconnected'||phase==='branched'&&b.route===route,x=b.x*map.tile,y=b.y*map.tile,w=b.w*map.tile,h=b.h*map.tile;
  g.lineStyle(2,open?0xe6d299:0xb3a3d2,open?.8:.4);if(open)g.strokeRect(x,y,w,h);else for(let dx=0;dx<w;dx+=16){g.lineBetween(x+dx,y,x+dx+8,y);g.lineBetween(x+dx,y+h,x+dx+8,y+h)}
  if(phase!=='fixed'){g.lineBetween(x,y+h/2,x+w,y+h/2);g.lineBetween(x+w/2,y+h/2,x+w/2+12,y+h/2-12);g.lineBetween(x+w/2,y+h/2,x+w/2+12,y+h/2+12)}
  scene.add.text(x,y-19,`${b.route==='direct'?'北・近道':'南・避難路'} ${open?'接続済':'未接続'}`,{fontSize:'11px',color:open?'#fff0bd':'#e0d4f5',backgroundColor:'#242539'}).setDepth(3);
 }
 return g;
}
