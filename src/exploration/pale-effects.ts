import type Phaser from 'phaser';
import type {Point,WalkMap} from './types';
/** Bounded graphics only: no timers/listeners or random game-state writes. */
export function makePaleEffects(scene:Phaser.Scene,map:WalkMap){if(map.chapterId!=='chapter-11')return;const g=scene.add.graphics().setDepth(2);let last=-1000,pulseAt=-1000,pulse:Point|undefined,lastCamera='';return {pulse(p:Point,time:number){pulse=p;pulseAt=time},update(time:number,reduced:boolean,camera:Point,height:number){const key=`${Math.round(camera.x/16)}:${Math.round(camera.y/16)}`;if(reduced&&last>=0&&key===lastCamera||!reduced&&time-last<100)return;last=time;lastCamera=key;g.clear();const visible=(p:Point)=>p.x>=camera.x-40&&p.x<=camera.x+430&&p.y>=camera.y-40&&p.y<=camera.y+height+40;
 for(let i=0;i<32;i++){const p={x:(i*137+(reduced?0:time/50))%(map.width*32),y:(i*83+17)%(map.height*32)};if(!visible(p))continue;g.fillStyle(0xe8ebed,.26);g.fillCircle(p.x,p.y,1.5);if(!reduced){g.lineStyle(1,0xc6d6e5,.14);g.lineBetween(p.x-13,p.y,p.x,p.y)}}
 for(const o of map.objects.filter(o=>o.kind==='inspect'||o.kind==='npc'))if(visible(o)){g.lineStyle(1,0xc4e7ff,reduced?.25:.25+.1*Math.sin(time/850));g.strokeCircle(o.x,o.y,18)}
 if(pulse&&visible(pulse)&&time-pulseAt<600){g.lineStyle(2,0xf5e8b8,.8*(1-(time-pulseAt)/600));g.strokeCircle(pulse.x,pulse.y,reduced?23:18+(time-pulseAt)/20)}
 }};}
