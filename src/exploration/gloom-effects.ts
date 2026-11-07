import type Phaser from 'phaser';
import type {Point,WalkMap} from './types';
import type {LightPath} from './light-path';
/** Decorative 10 Hz batches; no randomness, persistent state or background timers. */
export function makeGloomEffects(scene:Phaser.Scene,map:WalkMap,phase:LightPath){if(map.chapterId!=='chapter-12')return;const g=scene.add.graphics().setDepth(2);let last=-1000,lastCamera='';return {update(time:number,reduced:boolean,camera:Point,height:number){const key=`${Math.round(camera.x/16)}:${Math.round(camera.y/16)}`;if(reduced&&last>=0&&key===lastCamera||!reduced&&time-last<100)return;last=time;lastCamera=key;g.clear();const visible=(p:Point)=>p.x>=camera.x-48&&p.x<=camera.x+438&&p.y>=camera.y-48&&p.y<=camera.y+height+48,rate={dark:.25,glimmer:.45,linked:.65,renewed:.8}[phase];
 for(let i=0;i<24;i++){const p={x:(i*143+35+(reduced?0:Math.sin(time/2000+i)*8))%(map.width*32),y:(i*89+45)%(map.height*32)};if(visible(p)){g.fillStyle(0xd0e4a3,rate*(reduced?.6:.65+.35*Math.sin(time/1200+i)));g.fillCircle(p.x,p.y,2)}}
 const devices=map.objects.filter(o=>o.kind==='inspect'||o.kind==='npc');for(const o of devices)if(visible(o)){g.lineStyle(1,0xa7ddb5,rate);g.strokeCircle(o.x,o.y,reduced?18:18+2*Math.sin(time/1700))}
 }};}
