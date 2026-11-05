import type {EquipmentState} from '../src/equipment';
/** Vite dev-only integration fixture. This file is not an entry in the production build. */
import Phaser from 'phaser';
import {Battle,type Command,type Unit,type BattleEvent} from '../src/battle';
import {BattleView} from '../src/battle-view';
import {statusSnapshot,statusNotices} from '../src/battle-presentation';
import {Stage} from '../src/visuals';
import '../src/style.css';
import '../src/battle-ui.css';
interface Config {
 equipment?:EquipmentState;
 actor?:string;random?:number;target?:string;
 units?:Record<string,Partial<Pick<Unit,'hp'|'mp'|'affinities'|'attackElement'|'star'|'level'|'barrierCharges'|'tauntRounds'>>>;
 statuses?:{target:string;id:Unit['statuses'][number]['id'];turns:number}[];
 modifiers?:{target:string;stat:Unit['modifiers'][number]['stat'];amount:number;turns:number}[];
}
const host=document.querySelector<HTMLElement>('#content')!,canvas=document.createElement('div');canvas.className='stage';
const game=new Phaser.Game({type:Phaser.AUTO,width:390,height:310,parent:canvas,scene:new Stage(),banner:false,scale:{mode:Phaser.Scale.FIT}});
const resize=()=>{if(game.isBooted&&canvas.clientWidth&&canvas.clientHeight){const h=Math.round(390*canvas.clientHeight/canvas.clientWidth);if(game.scale.gameSize.height!==h)game.scale.resize(390,h)}};
new ResizeObserver(resize).observe(canvas);
let battle:Battle,view:BattleView,command:Command='attack',targetId='enemy0',busy=false,actingId:string|undefined,actionRound=1,timer:number|undefined,lastEvent:BattleEvent|undefined;
function render(){view.update({battle,command,targetId,busy,actingId,actionRound});game.events.emit('stage',battle.units,battle.units.findIndex(u=>u.id===(busy?actingId:battle.current?.id)),battle.units.findIndex(u=>u.id===targetId),command==='guardianField'||command==='oathShield'||command==='groupHeal'||command==='miracle'?battle.allies.filter(u=>u.hp>0).map(u=>u.id):[])}
function choose(c:Command){command=c;if(['guardianField','oathShield','groupHeal','miracle'].includes(c)){targetId='all-allies';render();return}const list=battle.targets(c);if(!list.some(u=>u.id===targetId))targetId=list.find(u=>c!=='heal'||u.hp<u.maxHp)?.id||list[0]?.id||'';render()}
function configure(config:Config={}){
 window.clearTimeout(timer);view?.dispose();battle=new Battle(()=>config.random??0.99,undefined,undefined,config.equipment);for(let n=0;n<12&&battle.current?.id!==(config.actor||'astel');n++)battle.waitTurn();
 for(const [id,values] of Object.entries(config.units||{}))Object.assign(battle.units.find(u=>u.id===id)!,values);
 for(const status of config.statuses||[])battle.applyStatus(status.target,status.id,1,status.turns);
 for(const mod of config.modifiers||[])battle.applyModifier(mod.target,mod);
 command='attack';targetId=config.target||battle.enemies.find(u=>u.hp>0)?.id||'';busy=false;actingId=undefined;lastEvent=undefined;
 view=new BattleView(host,canvas,{
  choose,target:id=>{if(!busy&&!['guardianField','oathShield','groupHeal','miracle'].includes(command)&&battle.targets(command).some(u=>u.id===id)){targetId=id;render()}},
  execute:()=>{if(busy)return;const before=statusSnapshot(battle.units);actionRound=battle.round;const result=battle.act(command,targetId);if(!result.ok)return;lastEvent=result.event;busy=true;actingId=result.event.actor;render();view.present(result.event,statusNotices(before,battle.units));game.events.emit('battle-effect',result.event);timer=window.setTimeout(()=>{busy=false;actingId=undefined;command='attack';targetId=battle.enemies.find(u=>u.hp>0)?.id||'';view.clearEffects();if(battle.current)render()},850)},
  retreat:()=>{window.clearTimeout(timer);busy=false;view.dispose();host.innerHTML='<h1>撤退済み</h1>'},
 });render();
}
game.events.on('unit-tap',(id:string)=>{if(!busy&&!['guardianField','oathShield','groupHeal','miracle'].includes(command)&&battle.targets(command).some(u=>u.id===id)){targetId=id;render()}});
const api={configure,snapshot:()=>({busy,command,targetId,actor:battle.current?.id,round:battle.round,units:battle.units.map(u=>({...u})),event:lastEvent}),ready:()=>game.scene.isActive('stage')};
declare global {interface Window {battleFixture:typeof api}}
window.battleFixture=api;configure();
