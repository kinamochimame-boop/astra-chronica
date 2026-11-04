import Phaser from 'phaser';
import {heroes,type Unit,type BattleEvent} from './battle';
/** Set Unit.texture to a preloaded asset key to replace the placeholder. */
export class Stage extends Phaser.Scene {
 figures=new Map<string,Phaser.GameObjects.Container>();
 units:Unit[]=heroes; selected=0; enemy=-1;
 constructor(){super('stage')}
 create(){this.paint();this.game.events.on('battle-effect',this.effect,this);this.events.once('shutdown',()=>this.game.events.off('battle-effect',this.effect,this));this.game.events.on('stage',this.show,this);this.events.once('shutdown',()=>this.game.events.off('stage',this.show,this));}
 show(units:Unit[],selected=0,enemy=-1){this.units=units;this.selected=selected;this.enemy=enemy;this.paint()}
 paint(){
 this.figures.clear();this.tweens.killAll();this.children.removeAll(true);const g=this.add.graphics();g.fillGradientStyle(0x112846,0x112846,0x1d3c50,0x1d3c50,1);g.fillRect(0,0,390,310);
 for(let i=0;i<35;i++){g.fillStyle(0xcbd8eb,0.25+(i%3)*.2);g.fillCircle((i*73+19)%390,(i*47)%220,1)}
 g.fillStyle(0x152e3c);g.fillTriangle(0,250,95,100,180,250);g.fillTriangle(100,250,260,70,390,250);
 g.lineStyle(1,0xbda474,.3);g.strokeEllipse(195,251,350,73);g.strokeEllipse(195,251,300,53);
 this.units.forEach((u,i)=>{
 const enemies=this.units.length>3;const x=70+(i%3)*125,y=enemies?(i<3?211:90):195;
 const active=i===this.selected||i===this.enemy;
 const c=this.add.container(x,y).setAlpha(u.hp>0?1:.25);
 this.figures.set(u.id,c);
 const s=this.add.graphics();s.fillStyle(0x000000,.25);s.fillEllipse(0,43,63,15);
 if(active){s.lineStyle(2,0xe6c780,.9);s.strokeEllipse(0,43,72,20)}
 c.add(s);
 if(u.texture&&this.textures.exists(u.texture)){c.add(this.add.image(0,0,u.texture).setDisplaySize(70,95));return;}
 const b=this.add.graphics();b.fillStyle(u.color);b.fillRoundedRect(-19,0,38,39,10);b.fillStyle(0x253652);b.fillRoundedRect(-18,32,13,15,3);b.fillRoundedRect(5,32,13,15,3);
 b.fillStyle(i<3?0xf3d7bd:0xa5adce);b.fillCircle(0,-17,24);b.fillStyle(u.color);b.fillEllipse(0,-33,49,20);b.fillTriangle(-24,-30,-17,0,-6,-30);
 b.fillStyle(0x13243b);b.fillCircle(-8,-16,2.5);b.fillCircle(8,-16,2.5);
 b.lineStyle(4,0xe5cd91);b.lineBetween(25,20,34,-17);b.fillStyle(0xdcc282);b.fillCircle(34,-20,5);
 if(u.id==='rina'){b.fillStyle(0xe1b86c);b.fillRoundedRect(-34,8,22,30,6)}
 c.add(b);if(active&&u.hp>0)this.tweens.add({targets:c,y:y-4,duration:1000,yoyo:true,repeat:-1});
 });
 }
 effect(event:BattleEvent){
 const actor=this.figures.get(event.actor),target=this.figures.get(event.target);
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(actor&&!reduced){this.tweens.killTweensOf(actor);this.tweens.add({targets:actor,x:actor.x+12,duration:120,yoyo:true});}
 if(target){
 if(!reduced&&event.kind==='damage')this.tweens.add({targets:target,alpha:.3,duration:90,yoyo:true,repeat:2});
 const label=event.kind==='heal'?`+${event.amount}`:event.kind==='damage'?`${event.critical?'クリティカル!\n':''}${event.amount}`:event.command==='cover'?'かばう':event.command==='guard'?'ガード':'防御';
 const text=this.add.text(target.x,target.y-55,label,{fontFamily:'sans-serif',fontSize:'22px',fontStyle:'bold',color:event.kind==='heal'?'#9ff0c3':event.critical?'#ffe19b':'#ffffff',stroke:'#10243c',strokeThickness:4,align:'center'}).setOrigin(.5).setDepth(10);
 this.tweens.add({targets:text,y:text.y-(reduced?0:28),alpha:0,duration:800,onComplete:()=>text.destroy()});
 }
 }

}
