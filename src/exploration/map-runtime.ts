import {cameraFor,clearCircle,distance} from './collision';
import {findPath} from './pathfinding';
import {advance,type Mover} from './movement';
import {createSymbols,stepSymbol} from './enemy-symbols';
import type {Point,Pose,SymbolContact,WalkMap} from './types';
export class MapRuntime {
 hero:Mover;symbols;paused=false;locked=false;notice='';contactGrace=0;camera={x:0,y:0};
 constructor(readonly map:WalkMap,pose:Pose,readonly available:(event:string)=>boolean,readonly defeated:(id:string)=>boolean,contactGrace=0){this.contactGrace=Math.max(0,contactGrace);this.hero={...pose,path:[]};this.symbols=createSymbols(map)}
 moveTo(point:Point){if(this.paused||this.locked)return false;const path=findPath(this.map,this.hero,point);this.hero.path=path??[];this.notice=path?'':'そこへは進めません。歩ける地面を選んでください。';return !!path;}
 stop(){this.hero.path=[]}
 step(seconds:number,width:number,height:number):SymbolContact|undefined {
  this.camera=cameraFor(this.map,this.hero,width,height);if(this.paused||this.locked)return;
  // Large background gaps are deliberately not simulated on resume.
  let remaining=Math.max(0,Math.min(.25,seconds));do {const dt=Math.min(.05,remaining);remaining-=dt;this.contactGrace=Math.max(0,this.contactGrace-dt);if(this.contactGrace<1e-8)this.contactGrace=0;advance(this.hero,130,dt);this.camera=cameraFor(this.map,this.hero,width,height);
  for(const s of this.symbols){if(this.defeated(s.definition.id)){s.state='defeated';continue}if(!this.available(s.definition.eventId)){s.state='hidden';continue}
   const visible=s.x>=this.camera.x-64&&s.x<=this.camera.x+width+64&&s.y>=this.camera.y-64&&s.y<=this.camera.y+height+64;
   if(!visible)continue;stepSymbol(this.map,s,this.hero,dt);if(!clearCircle(this.map,s,s.definition.radius)){s.x=s.definition.x;s.y=s.definition.y;s.path=[];}
   if(this.contactGrace===0&&distance(this.hero,s)<=10+s.definition.radius){this.locked=true;this.stop();return {mapId:this.map.id,symbolId:s.definition.id,position:{x:s.x,y:s.y}};}
  }
  }while(remaining>1e-8);
 }
}
