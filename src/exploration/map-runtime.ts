import {cameraFor,clearCircle,distance,cell,center} from './collision';
import {findPath} from './pathfinding';
import {advance,type Mover} from './movement';
import {createSymbols,stepSymbol} from './enemy-symbols';
import type {Point,Pose,SymbolContact,WalkMap} from './types';
export class MapRuntime {
 suggestion?:Point;private destination?:Point;private terrain='';
 hero:Mover;symbols;paused=false;locked=false;notice='';contactGrace=0;onVisit?: (point:Point)=>void;camera={x:0,y:0};
 constructor(public map:WalkMap,pose:Pose,readonly available:(event:string)=>boolean,readonly defeated:(id:string)=>boolean,contactGrace=0){this.contactGrace=Math.max(0,contactGrace);this.hero={...pose,path:[]};this.symbols=createSymbols(map);this.terrain=map.grid.join('\n')}
 moveTo(point:Point){if(this.paused||this.locked)return false;this.suggestion=undefined;const path=findPath(this.map,this.hero,point);this.hero.path=path??[];this.destination=path?{...point}:undefined;this.notice=path?'':'そこへは進めません。歩ける地面を選んでください。';
 if(!path&&Number.isFinite(point.x)&&Number.isFinite(point.y)&&!clearCircle(this.map,point)){const at=cell(this.map,point),candidates:Point[]=[];for(let y=Math.max(0,at.y-2);y<=Math.min(this.map.height-1,at.y+2);y++)for(let x=Math.max(0,at.x-2);x<=Math.min(this.map.width-1,at.x+2);x++)candidates.push(center(this.map,{x,y}));candidates.sort((a,b)=>distance(a,point)-distance(b,point)||a.y-b.y||a.x-b.x);this.suggestion=candidates.find(q=>clearCircle(this.map,q)&&!!findPath(this.map,this.hero,q));if(this.suggestion)this.notice='そこへは進めません。近くの安全な地点を候補にしました。移動する場合は確認してください。'}return !!path;}
 stop(){this.suggestion=undefined;this.hero.path=[];this.destination=undefined}
 updateMap(map:WalkMap){if(map.id!==this.map.id||map.tile!==this.map.tile||map.width!==this.map.width||map.height!==this.map.height)return false;this.map=map;this.refreshTerrain();return true;}
 private refreshTerrain(){const key=this.map.grid.join('\n');if(key===this.terrain)return;this.terrain=key;this.hero.path=this.destination?findPath(this.map,this.hero,this.destination)??[]:[];for(const s of this.symbols){s.path=[];s.goalCell=undefined;}if(this.destination&&distance(this.hero,this.destination)>.001&&!this.hero.path.length)this.notice='通路が変わりました。歩ける地面を選んでください。';}
 step(seconds:number,width:number,height:number):SymbolContact|undefined {
  this.refreshTerrain();this.camera=cameraFor(this.map,this.hero,width,height);if(this.paused||this.locked)return;
  // Large background gaps are deliberately not simulated on resume.
  let remaining=Math.max(0,Math.min(.25,Number.isFinite(seconds)?seconds:0));do {const dt=Math.min(.05,remaining);remaining-=dt;this.contactGrace=Math.max(0,this.contactGrace-dt);if(this.contactGrace<1e-8)this.contactGrace=0;advance(this.hero,130,dt,this.map);this.onVisit?.(this.hero);this.camera=cameraFor(this.map,this.hero,width,height);
  for(const s of this.symbols){if(this.defeated(s.definition.id)){s.state='defeated';continue}if(!this.available(s.definition.eventId)){s.state='hidden';continue}
   const visible=s.x>=this.camera.x-64&&s.x<=this.camera.x+width+64&&s.y>=this.camera.y-64&&s.y<=this.camera.y+height+64;
   if(!visible)continue;stepSymbol(this.map,s,this.hero,dt);if(!clearCircle(this.map,s,s.definition.radius)){s.x=s.definition.x;s.y=s.definition.y;s.path=[];}
   if(this.contactGrace===0&&distance(this.hero,s)<=10+s.definition.radius){this.locked=true;this.stop();return {mapId:this.map.id,symbolId:s.definition.id,position:{x:s.x,y:s.y}};}
  }
  }while(remaining>1e-8);
 }
}
