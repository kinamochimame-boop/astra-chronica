import {battleAnchor,type BattleLayout} from './battle-layout';
import {battleActorScales} from './battle-actor-scale';
import {battleEventParts} from './types';
import {actorStyle,drawActor} from './battle-actors';
import {animationPlan,elementColor} from './battle-animations';
import Phaser from 'phaser';
import {heroes,type Unit,type BattleEvent} from './battle';
/** Shared side-view scene, including the save-free lab. No calculations or turn progression live here. */
export class Stage extends Phaser.Scene {
 figures=new Map<string,Phaser.GameObjects.Container>();private rings=new Map<string,Phaser.GameObjects.Graphics>();private homes=new Map<string,{x:number;y:number}>();layout:BattleLayout='side';private generation=0;
 targets:string[]=[];units:Unit[]=heroes;selected=0;enemy=-1;
 constructor(){super('stage')}
 create(){this.paint();this.scale.on('resize',this.paint,this);this.events.once('shutdown',()=>{this.scale.off('resize',this.paint,this);this.time.removeAllEvents();this.tweens.killAll()});this.game.events.on('battle-effect',this.effect,this);this.game.events.on('stage',this.show,this);this.events.once('shutdown',()=>{this.game.events.off('battle-effect',this.effect,this);this.game.events.off('stage',this.show,this)})}
 show(units:Unit[],selected=0,enemy=-1,targets:string[]=[]){this.targets=targets;this.units=units;this.selected=selected;this.enemy=enemy;this.paint()}
 paint(){
 this.generation++;this.time.removeAllEvents();this.figures.clear();this.rings.clear();this.homes.clear();this.tweens.killAll();this.children.removeAll(true);
 const height=this.scale.gameSize.height,hasEnemies=this.units.length>3,enemyCount=this.units.length-3,g=this.add.graphics();g.fillStyle(0x102b40);g.fillRect(0,0,390,height);g.lineStyle(1,0x809dba,.15);for(let y=15;y<height;y+=35)g.lineBetween(0,y,390,y+30);g.lineStyle(1,0xdbc68a,.2);g.lineBetween(195,5,195,height-5);
 const scales=battleActorScales(this.units,height,this.layout),models=this.units.map((u,i)=>{
  const anchor=battleAnchor(i,height,hasEnemies,this.layout,enemyCount),active=i===this.selected,targeted=i===this.enemy||this.targets.includes(u.id),style=actorStyle(u,i<3),c=drawActor(this,u,i<3).setPosition(anchor.x,anchor.y).setScale(scales[i]).setAlpha(u.hp>0?1:.25);this.figures.set(u.id,c);this.homes.set(u.id,anchor);
  if(u.hp>0)c.setSize(90,94).setInteractive().on('pointerup',()=>this.game.events.emit('unit-tap',u.id));
  const ring=this.add.graphics();this.rings.set(u.id,ring);ring.lineStyle(3,targeted?0xf2d58c:0x8cddec,targeted||active?1:.2);ring.strokeEllipse(0,30,70,14);if(targeted){ring.fillStyle(0xf6d98c);ring.fillTriangle(-5,-53,5,-53,0,-45)}c.addAt(ring,0);
  if(u.guarding||u.covering){const shield=this.add.graphics();shield.lineStyle(3,0x9cdcf2,.8);shield.strokeRoundedRect(12,-36,28,63,9);c.add(shield)}
  if(u.hp>0&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)this.tweens.add({targets:c,y:c.y-(active?3:1.5),duration:900+i*80,yoyo:true,repeat:-1});
  return {id:u.id,...anchor,side:i<3?'ally':'enemy',alive:u.hp>0,targeted,active,...style};
 });this.game.canvas.dataset.actors=JSON.stringify(models);this.game.canvas.dataset.layout=hasEnemies?this.layout:'portraits';
 }
 /** Realtime updates must not destroy another character's in-flight tween. */
 syncRealtime(targetId:string,actingIds:string[]){
  for(const u of this.units){const figure=this.figures.get(u.id),ring=this.rings.get(u.id);if(!figure||!ring)continue;if(u.hp<=0)figure.setAlpha(.25);const target=u.id===targetId,active=actingIds.includes(u.id);ring.clear();ring.lineStyle(3,target?0xf2d58c:0x8cddec,target||active?1:.2);ring.strokeEllipse(0,30,70,14);if(target){ring.fillStyle(0xf6d98c);ring.fillTriangle(-5,-53,5,-53,0,-45)}if(u.hp>0&&(u.guarding||u.covering)){ring.lineStyle(3,0x9cdcf2,.8);ring.strokeRoundedRect(12,-36,28,63,9);}}
  const models=JSON.parse(this.game.canvas.dataset.actors??'[]');for(const m of models){m.alive=(this.units.find(u=>u.id===m.id)?.hp??0)>0;m.active=actingIds.includes(m.id);m.targeted=m.id===targetId;}this.game.canvas.dataset.actors=JSON.stringify(models);
 }
 effect(event:BattleEvent){
 const generation=this.generation,reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches,plans=animationPlan(event,this.units);this.game.canvas.dataset.effects=JSON.stringify(plans);
 const later=(ms:number,fn:()=>void)=>this.time.delayedCall(ms,()=>{if(generation===this.generation)fn()});
 for(const [i,plan] of plans.entries())later(reduced?0:plan.delay,()=>{
  const actor=this.figures.get(plan.actor),target=this.figures.get(plan.target);if(!actor||!target)return;
  if(!reduced&&plan.attack&&!plan.selfEffect&&!plan.ranged){const home=this.homes.get(plan.actor)!;this.tweens.killTweensOf(actor);actor.setPosition(home.x,home.y);this.tweens.add({targets:actor,x:home.x+plan.direction*22,duration:100,yoyo:true})}
  if((plan.covered||plan.castCover)&&!reduced){const protector=plan.castCover?actor:target,victim=plan.castCover?target:this.figures.get(this.units.find(u=>u.id===plan.target)?.covering??'');const home=this.homes.get(plan.castCover?plan.actor:plan.target)!;this.tweens.killTweensOf(protector);protector.setPosition(home.x,home.y);this.tweens.add({targets:protector,x:home.x+30,y:victim?.y??home.y,duration:100,yoyo:true})}
  if(plan.ranged||plan.kind==='heal'){const cast=this.add.graphics();cast.lineStyle(3,elementColor(plan.element),.75);cast.strokeCircle(actor.x,actor.y,26);later(reduced?150:280,()=>cast.destroy())}
  const fx=this.add.graphics(),color=plan.critical?0xffd978:plan.kind==='heal'?0x8de9ad:elementColor(plan.element);fx.lineStyle(plan.counter?5:3,color,.95);
  if(plan.ranged&&!reduced){fx.fillStyle(color);fx.fillCircle(0,0,plan.element==='none'?3:7);fx.setPosition(actor.x,actor.y);this.tweens.add({targets:fx,x:target.x,y:target.y,duration:130,onComplete:()=>fx.destroy()})}
  else {if(plan.kind==='heal')fx.strokeEllipse(target.x,target.y,62,70);else if(plan.kind==='status')fx.strokeRoundedRect(target.x-30,target.y-35,60,65,8);else if(plan.missed)fx.strokeCircle(target.x,target.y,25);else{fx.lineBetween(target.x-18,target.y+18,target.x+18,target.y-18);fx.lineBetween(target.x-12,target.y-18,target.x+12,target.y+18)}later(reduced?180:300,()=>fx.destroy())}
  if(plan.kind==='damage'&&!plan.missed&&!reduced)this.tweens.add({targets:target,alpha:.15,duration:60,yoyo:true,repeat:1,onComplete:()=>target.setAlpha(this.units.find(u=>u.id===plan.target)!.hp>0?1:.25)});
  if(plan.ultimate){const halo=this.add.graphics();halo.lineStyle(5,0xffdf91,.8);halo.strokeEllipse(actor.x,actor.y,95,90);later(400,()=>halo.destroy())}
 });
 }
}
