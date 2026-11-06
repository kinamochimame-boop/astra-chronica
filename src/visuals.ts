import {battleAnchor,attackOffset,type BattleLayout} from './battle-layout';
import {battleEventParts} from './types';
import Phaser from 'phaser';
import {heroes,type Unit,type BattleEvent} from './battle';
/** Set Unit.texture to a preloaded asset key to replace the placeholder. */
export class Stage extends Phaser.Scene {
 figures=new Map<string,Phaser.GameObjects.Container>();
 layout:BattleLayout='rows';
 private generation=0;
 targets:string[]=[];
 units:Unit[]=heroes; selected=0; enemy=-1;
 constructor(){super('stage')}
 create(){this.paint();this.scale.on('resize',this.paint,this);this.events.once('shutdown',()=>this.scale.off('resize',this.paint,this));this.game.events.on('battle-effect',this.effect,this);this.events.once('shutdown',()=>this.game.events.off('battle-effect',this.effect,this));this.game.events.on('stage',this.show,this);this.events.once('shutdown',()=>this.game.events.off('stage',this.show,this));}
 show(units:Unit[],selected=0,enemy=-1,targets:string[]=[]){this.targets=targets;this.units=units;this.selected=selected;this.enemy=enemy;this.paint()}
 paint(){
 this.generation++;
 const height=this.scale.gameSize.height;
 this.figures.clear();this.tweens.killAll();this.children.removeAll(true);const g=this.add.graphics();g.fillGradientStyle(0x112846,0x112846,0x1d3c50,0x1d3c50,1);g.fillRect(0,0,390,height);
 for(let i=0;i<35;i++){g.fillStyle(0xcbd8eb,0.25+(i%3)*.2);g.fillCircle((i*73+19)%390,(i*47)%Math.max(1,height*.7),1)}
 g.fillStyle(0x152e3c);g.fillTriangle(0,height*.85,95,height*.35,180,height*.85);g.fillTriangle(100,height*.85,260,height*.25,390,height*.85);
 g.lineStyle(1,0xbda474,.3);g.strokeEllipse(195,height*.86,350,height*.22);g.strokeEllipse(195,height*.86,300,height*.15);
 this.units.forEach((u,i)=>{
 const enemies=this.units.length>3;const {x,y}=battleAnchor(i,height,enemies,this.layout);
 const active=i===this.selected,targeted=i===this.enemy||this.targets.includes(u.id);
 const c=this.add.container(x,y).setScale(enemies?Math.min(1,height/250):1).setAlpha(u.hp>0?1:.25);
 this.figures.set(u.id,c);
 if(u.hp>0)c.setSize(80,110).setInteractive().on('pointerup',()=>this.game.events.emit('unit-tap',u.id));
 const s=this.add.graphics();s.fillStyle(0x000000,.25);s.fillEllipse(0,43,63,15);
 if(u.hp>0&&targeted){s.lineStyle(3,0xe6c780,.95);s.strokeEllipse(0,43,74,20)}
 if(u.hp>0&&active){s.lineStyle(3,0x8edcfa,.95);s.strokeCircle(0,0,34)}
 c.add(s);
 if(u.texture&&this.textures.exists(u.texture)){c.add(this.add.image(0,0,u.texture).setDisplaySize(70,95));this.idle(c,u,active,i);return;}
 const b=this.add.graphics();b.fillStyle(u.color);b.fillRoundedRect(-19,0,38,39,10);b.fillStyle(0x253652);b.fillRoundedRect(-18,32,13,15,3);b.fillRoundedRect(5,32,13,15,3);
 b.fillStyle(i<3?0xf3d7bd:0xa5adce);b.fillCircle(0,-17,24);b.fillStyle(u.color);b.fillEllipse(0,-33,49,20);b.fillTriangle(-24,-30,-17,0,-6,-30);
 b.fillStyle(0x13243b);b.fillCircle(-8,-16,2.5);b.fillCircle(8,-16,2.5);
 b.lineStyle(4,0xe5cd91);b.lineBetween(25,20,34,-17);b.fillStyle(0xdcc282);b.fillCircle(34,-20,5);
 if(u.id==='rina'){b.fillStyle(0xe1b86c);b.fillRoundedRect(-34,8,22,30,6)}
 c.add(b);this.idle(c,u,active,i);
 });
 }
 private idle(figure:Phaser.GameObjects.Container,u:Unit,active:boolean,index:number){
 if(u.hp>0&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)this.tweens.add({targets:figure,y:figure.y-(active?4:2),duration:1000+index*90,yoyo:true,repeat:-1});
 }
 effect(event:BattleEvent){
 const generation=this.generation;
 const parts=battleEventParts(event),actor=this.figures.get(event.actor);
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(actor&&!reduced&&parts.some(p=>p.kind==='damage'||p.label==='ミス')){
  this.tweens.killTweensOf(actor);const offset=attackOffset(this.units.findIndex(u=>u.id===event.actor)<3,this.layout);
  this.tweens.add({targets:actor,x:actor.x+offset.x,y:actor.y+offset.y,duration:140,yoyo:true});
 }
 parts.forEach((part,index)=>this.time.delayedCall(index*90,()=>{
  if(generation!==this.generation)return;
  const target=this.figures.get(part.target);if(!target?.active)return;
  if(part.kind==='damage'&&!reduced)this.tweens.add({targets:target,alpha:.12,duration:60,yoyo:true,repeat:1});
  if(part.kind==='heal'){
   const glow=this.add.graphics();glow.lineStyle(5,0x94e9ba,.9);glow.strokeEllipse(target.x,target.y,74,85);
   if(reduced)this.time.delayedCall(550,()=>glow.destroy());else this.tweens.add({targets:glow,alpha:0,duration:550,onComplete:()=>glow.destroy()});
  }
 }));
 }
}
