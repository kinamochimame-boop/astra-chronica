/** Dev-server-only integration fixture; no production entry or progress writes. */
import Phaser from 'phaser';
import {Battle,type Unit} from '../src/battle';
import {AtbCombat} from '../src/atb-combat';
import {AtbView} from '../src/atb-view';
import {Stage} from '../src/visuals';
import {initialParty} from '../src/progression';
import {encounterSetup} from '../src/data/encounters';
import '../src/style.css';import '../src/battle-ui.css';import '../src/atb-ui.css';
interface Config{random?:number;opening?:boolean;waiting?:boolean;progress?:Record<string,number>;ep?:Record<string,number>;busy?:number;auto?:boolean;encounter?:string;units?:Record<string,Partial<Unit>>}
const host=document.querySelector<HTMLElement>('#content')!,canvas=document.createElement('div');canvas.className='stage';
const stage=new Stage(),game=new Phaser.Game({type:Phaser.AUTO,width:390,height:240,parent:canvas,scene:stage,banner:false,scale:{mode:Phaser.Scale.FIT}});
new ResizeObserver(()=>{if(game.isBooted&&canvas.clientWidth&&canvas.clientHeight){const h=Math.round(390*canvas.clientHeight/canvas.clientWidth);if(game.scale.gameSize.height!==h)game.scale.resize(390,h)}}).observe(canvas);
let combat:AtbCombat,view:AtbView;
function refresh(){view.update();stage.syncRealtime(combat.targetId,combat.battle.units.filter(u=>combat.slot(u.id).busyUntil>combat.time).map(u=>u.id));}
function configure(config:Config={}){combat?.dispose();view?.dispose();const party=initialParty();for(const p of Object.values(party))p.level=30;const b=new Battle(()=>config.random??.99,party,undefined,undefined,config.encounter?encounterSetup(config.encounter):undefined);for(const u of b.units){u.hp=u.maxHp=10000;u.mp=0;if(config.units?.[u.id])Object.assign(u,config.units[u.id]);}combat=new AtbCombat(b);if(!config.opening)for(const s of combat.slots.values())s.firstAttack=false;if(!config.waiting)combat.start();combat.auto=config.auto??false;for(const u of b.allies){combat.slot(u.id).progress=config.progress?.[u.id]??0;combat.slot(u.id).ep=config.ep?.[u.id]??15;combat.slot(u.id).busyUntil=config.busy??0;}
 view=new AtbView(host,canvas,combat,()=>{combat.dispose();view.dispose();host.innerHTML='<h1>撤退済み</h1>';});combat.onEvent=e=>{view.present(e);game.events.emit('battle-effect',e)};game.events.emit('stage',b.units,0,3);refresh();}
const api={configure,stageTap:(id:string)=>view.target(id),advance:(seconds:number)=>{combat.advance(seconds);refresh()},snapshot:()=>({state:JSON.parse(host.dataset.atbState!),events:JSON.parse(host.dataset.events??'[]')}),figures:()=>({width:game.scale.gameSize.width,height:game.scale.gameSize.height,units:[...stage.figures].map(([id,c])=>({id,x:c.x,y:c.y,scale:c.scaleX,displayWidth:c.displayWidth,displayHeight:c.displayHeight}))}),positions:()=>Object.fromEntries([...stage.figures].map(([id,c])=>[id,{x:c.x,y:c.y}])),ready:()=>game.scene.isActive('stage')};
declare global{interface Window{atbFixture:typeof api}}
window.atbFixture=api;game.events.once(Phaser.Core.Events.READY,()=>configure());
