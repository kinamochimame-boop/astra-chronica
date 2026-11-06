import Phaser from 'phaser';
import type {Progress} from '../save';
import {chapterState,eventOpen,locationOpen} from '../adventure';
import {chapters} from '../data/chapter-one';
import {mountAdventure} from '../adventure-view';
import {collectQuestObjective} from '../side-quests';
import {mapById} from './map-data';
import {mapOpen} from './exploration-save';
import {closeEnough,distance,cell,center} from './collision';
import {MapRuntime} from './map-runtime';
import type {MapObject,SymbolContact} from './types';
import './exploration.css';
export interface MapActions {battle:(source:SymbolContact)=>void;travel:(mapId:string)=>void;location:(id:string)=>void;list:()=>void;home:()=>void;equipment:()=>void;tree:()=>void;quests:()=>void;journal:()=>void;records:()=>void}
/** One view owns one Phaser scene, all listeners and timers. No battle logic lives here. */
export function mountMap(host:HTMLElement,p:Progress,persist:()=>boolean,actions:MapActions){
 const saved=p.world!,map=mapById(saved.mapId)!,chapter=chapters.find(c=>c.id===map.chapterId)!;
 const done=()=>chapterState(p.adventure,chapter).completed;
 const available=(id:string)=>{const e=chapter.events.find(e=>e.id===id);return !!e&&eventOpen(chapterState(p.adventure,chapter),e)&&!done().includes(id)};
 const runtime=new MapRuntime(map,saved,available,id=>p.world!.defeated.includes(id));
 host.classList.add('free-map-screen');host.innerHTML=`<div class="world-heading"><div><p class="eyebrow">CHAPTER ${String(chapters.findIndex(c=>c.id===map.chapterId)+1).padStart(2,'0')} · EXPLORE</p><h1>${map.name}</h1></div><button id="world-menu-button" class="secondary" aria-label="探索メニュー">☰</button></div><div id="world-viewport" role="region" aria-label="アステルの歩行マップ"></div><p id="world-notice" role="status"></p><div id="world-nearby" aria-label="近くの対象"></div><p class="world-help">地面をタップして歩く · 矢印／WASDでも移動<br>人・宝箱・出口は近づいてタップ</p><dialog id="world-menu"><h2>探索メニュー</h2><div class="world-menu-items"></div><button id="world-menu-close" class="secondary">探索に戻る</button></dialog><dialog id="world-event"><div id="world-event-content"></div></dialog>`;
 const viewport=host.querySelector<HTMLElement>('#world-viewport')!,notice=host.querySelector<HTMLElement>('#world-notice')!,nearby=host.querySelector<HTMLElement>('#world-nearby')!,menu=host.querySelector<HTMLDialogElement>('#world-menu')!,eventDialog=host.querySelector<HTMLDialogElement>('#world-event')!;
 let touchCanvas:HTMLCanvasElement|undefined;
 // Keep native drag scrolling, but prevent a touch-end's synthetic click hitting a newly mounted screen.
 let finishTouch:((event:TouchEvent)=>void)|undefined;
 let disposed=false,saveElapsed=0,lastPublished=0,nearKey='',transitionTimer:number|undefined,frame=0,dirty=false,wasMoving=false;
 const say=(text:string)=>{notice.textContent=text;};
 const flush=()=>{dirty=false;if(!disposed&&!persist())say('保存できません。現在の探索は続けられます。')};
 const pause=()=>{runtime.paused=true;runtime.stop();sync(0,true);flush()};
 const resume=()=>{runtime.paused=document.hidden;nearKey='';sync(0,true)};
 const eventClose=()=>{eventDialog.close();if(p.world?.event&&done().includes(p.world.event.id))p.world.event=undefined;flush();resume()};
 const inspect=(o:MapObject)=>{
  if(disposed||runtime.paused||runtime.locked)return;
  if(!closeEnough(runtime.hero,o)){say('対象の近くへ歩いてから調べてください。');return}
  runtime.stop();sync(0,true);
  if(o.kind==='exit'){
   if(o.targetMap){const target=mapById(o.targetMap)!;if(!mapOpen(p.adventure,target)){say('先の地点のメインイベントを完了すると、この出口が開きます。');return}flush();actions.travel(target.id);}
   else if(o.targetLocation){if(!locationOpen(chapterState(p.adventure,chapter),chapter,o.targetLocation)){say('この地点のメインイベントを完了してください。');return}flush();actions.location(o.targetLocation);}return;
  }
  if(o.questId&&o.objectiveId){if(collectQuestObjective(p,o.questId,o.objectiveId)){say('依頼の手掛かりを調べました。');flush()}else say(p.quests[o.questId]?.objectives.includes(o.objectiveId)?'この手掛かりは調査済みです。':'依頼を受注し、必要な手掛かりを先に調べてください。');return;}
  if(!o.eventId){say(o.text??o.name);return}
  const event=chapter.events.find(e=>e.id===o.eventId)!;
  if(!eventOpen(chapterState(p.adventure,chapter),event)){say('先の会話や戦闘を終えてから調べてください。');return}
  if(o.kind==='chest'&&done().includes(event.id)){say('この宝箱は開封済みです。');return}
  pause();const page=p.world!.event?.id===event.id?p.world!.event.page:0;
  if(!done().includes(event.id))p.world!.event={id:event.id,page};flush();eventDialog.showModal();
  mountAdventure(host.querySelector<HTMLElement>('#world-event-content')!,p,persist,()=>{},eventClose,chapter,undefined,undefined,undefined,undefined,{eventId:event.id,page,onPage:index=>{if(!done().includes(event.id))p.world!.event={id:event.id,page:index};flush()},onClose:eventClose});
 };
 function sync(dt:number,force=false){
  if(disposed)return;if(p.world!.x!==runtime.hero.x||p.world!.y!==runtime.hero.y||p.world!.facing!==runtime.hero.facing)dirty=true;Object.assign(p.world!,{x:runtime.hero.x,y:runtime.hero.y,facing:runtime.hero.facing});saveElapsed+=dt;lastPublished+=dt;
  if(saveElapsed>=.75){saveElapsed=0;if(dirty)flush()}
  if(!force&&lastPublished<.1)return;lastPublished=0;
  viewport.dataset.state=JSON.stringify({mapId:map.id,hero:{x:runtime.hero.x,y:runtime.hero.y,facing:runtime.hero.facing,moving:!!runtime.hero.path.length},camera:runtime.camera,width:390,height:scene.scale?.gameSize.height??480,paused:runtime.paused,locked:runtime.locked,tile:map.tile,grid:map.grid,objects:map.objects,symbols:runtime.symbols.map(s=>({id:s.definition.id,x:s.x,y:s.y,state:s.state,updates:s.updates,eventId:s.definition.eventId}))});
  const objects=map.objects.filter(o=>closeEnough(runtime.hero,o)),key=objects.map(o=>o.id+(o.eventId?String(done().includes(o.eventId)):'')).join('|');
  if(key!==nearKey){nearKey=key;nearby.replaceChildren();for(const o of objects){const b=document.createElement('button');b.className='secondary';b.dataset.worldObject=o.id;b.textContent=o.kind==='exit'?o.name:`${o.name}を調べる`;b.disabled=o.kind==='chest'&&!!o.eventId&&done().includes(o.eventId);if(b.disabled)b.textContent=`${o.name} · 開封済み`;b.onclick=()=>inspect(o);nearby.append(b)}}
  if(wasMoving&&!runtime.hero.path.length&&dirty){saveElapsed=0;flush()}wasMoving=!!runtime.hero.path.length;
 }
 class WalkScene extends Phaser.Scene {
  hero!:Phaser.GameObjects.Container;enemies=new Map<string,Phaser.GameObjects.Container>();objects=new Map<string,Phaser.GameObjects.Container>();pointerStart?:{x:number;y:number};
  constructor(){super('free-exploration')}
  create(){
   touchCanvas=this.game.canvas;const touch=this.game.input.touch,original=touch.onTouchEnd as (event:TouchEvent)=>void;
   // Phaser ignores an already prevented event, so process it before suppressing its synthetic click.
   finishTouch=event=>{original(event);if(event.cancelable)event.preventDefault()};
   touchCanvas.removeEventListener('touchend',original);touchCanvas.addEventListener('touchend',finishTouch,{passive:false});
   this.cameras.main.setBounds(0,0,map.width*map.tile,map.height*map.tile);const g=this.add.graphics();
   for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){const t=map.grid[y][x],floor=map.theme==='sky'?[0x3b5667,0x405f71]:map.kind==='dungeon'?[0x263d3a,0x2c4440]:[0x234934,0x294f38];g.fillStyle(t==='~'?(map.theme==='sky'?0x91b9d0:0x28596b):t==='#'?(map.theme==='sky'?0x293e59:0x102c25):floor[(x+y)%2]);g.fillRect(x*32,y*32,32,32);if(t==='#'){g.lineStyle(1,0x547e57,.5);g.strokeRect(x*32+3,y*32+3,26,26);if(map.kind!=='dungeon'&&map.theme!=='sky'){g.fillStyle(0x346344);g.fillCircle(x*32+16,y*32+13,12)}}}
   for(const o of map.objects){const c=this.add.container(o.x,o.y);const a=this.add.graphics();a.fillStyle(o.kind==='chest'?0xc7a25f:o.kind==='exit'?0x95c7b2:0x8cadd0);a.fillRoundedRect(-12,-12,24,24,5);if(o.kind==='npc'){a.fillStyle(0xf1d5b5);a.fillCircle(0,-17,9)}if(o.icon==='ship'){a.fillStyle(0xd8bd80);a.fillTriangle(-25,0,25,0,12,16);a.lineStyle(3,0xe5d4b3);a.lineBetween(0,0,0,-35);a.fillStyle(0xd6eefa);a.fillTriangle(2,-34,2,-5,28,-7)}c.add(a);const label=this.add.text(0,18,o.name,{fontSize:'10px',fontFamily:'sans-serif',color:'#f5ead0',backgroundColor:'#112b25'}).setOrigin(.5,0);c.add(label);this.objects.set(o.id,c)}
   this.hero=this.figure(0x71b4e1);this.hero.setDepth(10);
   for(const s of runtime.symbols){const c=this.figure(0xc98c88);c.setScale(.7);c.setDepth(9);c.add(this.add.text(0,25,s.definition.name,{fontSize:'12px',fontFamily:'sans-serif',color:'#ffe3d1',backgroundColor:'#2b2020'}).setOrigin(.5,0));this.enemies.set(s.definition.id,c)}
   this.input.on('pointerdown',(pointer:Phaser.Input.Pointer)=>{this.pointerStart={x:pointer.x,y:pointer.y}});
   this.input.on('pointerup',(pointer:Phaser.Input.Pointer)=>{const start=this.pointerStart;this.pointerStart=undefined;if(!start||Math.hypot(start.x-pointer.x,start.y-pointer.y)>10||runtime.paused||runtime.locked)return;const point={x:pointer.x+runtime.camera.x,y:pointer.y+runtime.camera.y},object=map.objects.find(o=>distance(point,o)<19);if(object)inspect(object);else {runtime.moveTo(point);say(runtime.notice);sync(0,true)}});
   this.input.on('pointerupoutside',()=>{this.pointerStart=undefined});this.input.on('gameout',()=>{this.pointerStart=undefined});
  }
  /** Future SD textures can replace only this factory; movement uses world poses, not sprite bounds. */
  figure(color:number){const c=this.add.container(0,0),g=this.add.graphics();g.fillStyle(0x000000,.25);g.fillEllipse(0,12,25,10);g.fillStyle(color);g.fillRoundedRect(-8,-1,16,18,5);g.fillStyle(0xf1d5b5);g.fillCircle(0,-9,10);g.fillStyle(color);g.fillEllipse(0,-15,22,9);g.fillStyle(0x192e32);g.fillCircle(-3,-9,1.5);g.fillCircle(3,-9,1.5);c.add(g);const arrow=this.add.triangle(0,22,-4,0,4,0,0,5,0xf1d797);arrow.name='direction';c.add(arrow);return c;}
  update(_:number,delta:number){if(disposed)return;const contact=runtime.step(delta/1000,390,this.scale.gameSize.height),reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;frame+=Math.min(delta,250);this.hero.setPosition(runtime.hero.x,runtime.hero.y+(runtime.hero.path.length&&!reduced?Math.sin(frame/85)*2:0));const arrow=this.hero.getByName('direction') as Phaser.GameObjects.Triangle;arrow.setRotation(({down:0,left:Math.PI/2,up:Math.PI,right:-Math.PI/2})[runtime.hero.facing]);
   for(const s of runtime.symbols){const c=this.enemies.get(s.definition.id)!;c.setPosition(s.x,s.y);c.setVisible(s.state!=='hidden'&&s.state!=='defeated')}for(const o of map.objects)this.objects.get(o.id)!.setAlpha(o.kind==='chest'&&p.world!.opened.includes(o.id)?.4:1);
   this.cameras.main.setScroll(runtime.camera.x,runtime.camera.y);sync(Math.min(delta/1000,.25));if(contact){sync(0,true);flush();viewport.classList.add('encounter-flash');say('敵に接触しました。戦闘へ移ります。');transitionTimer=window.setTimeout(()=>{if(!disposed)actions.battle(contact)},reduced?0:160);}
  }
 }
 const scene=new WalkScene(),game=new Phaser.Game({type:Phaser.AUTO,width:390,height:480,parent:viewport,scene,backgroundColor:'#16392c',banner:false,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},input:{touch:{capture:false}}});
 const resize=()=>{if(game.isBooted&&viewport.clientWidth){const height=Math.round(390*viewport.clientHeight/viewport.clientWidth);game.scale.setGameSize(390,height)}};const observer=new ResizeObserver(resize);observer.observe(viewport);game.events.once(Phaser.Core.Events.READY,resize);
 const key=(e:KeyboardEvent)=>{const dirs:Record<string,[number,number]>={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]};const dir=dirs[e.key];if(!dir||runtime.paused||runtime.locked||disposed)return;e.preventDefault();if(e.repeat&&runtime.hero.path.length)return;const c=cell(map,runtime.hero);runtime.moveTo(center(map,{x:c.x+dir[0],y:c.y+dir[1]}));say(runtime.notice);sync(0,true)};
 const visibility=()=>{if(document.hidden)pause();else if(!menu.open&&!eventDialog.open)resume()};
 const hide=()=>{runtime.stop();sync(0,true);flush()};window.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',hide);
 host.querySelector<HTMLButtonElement>('#world-menu-button')!.onclick=()=>{pause();menu.showModal()};host.querySelector<HTMLButtonElement>('#world-menu-close')!.onclick=()=>{menu.close();resume()};menu.addEventListener('cancel',()=>resume());eventDialog.addEventListener('cancel',()=>{if(p.world?.event&&done().includes(p.world.event.id))p.world.event=undefined;flush();resume()});
 for(const [label,action] of [['地点一覧',actions.list],['装備',actions.equipment],['スキルツリー',actions.tree],['サブクエスト',actions.quests],['冒険手帳',actions.journal],['探索記録',actions.records],['ホームへ戻る',actions.home]] as const){const b=document.createElement('button');b.className='secondary';b.textContent=label;b.onclick=()=>{hide();menu.close();action()};host.querySelector('.world-menu-items')!.append(b)}
 say(saved.recovered?'中断した戦闘を取り消し、安全な場所から再開しました。未確定の報酬は付与していません。':saved.event?'中断した会話は、対象の近くで再開できます。':'地面をタップして歩きましょう。');saved.recovered=undefined;
 return ()=>{if(disposed)return;hide();disposed=true;if(transitionTimer!==undefined)clearTimeout(transitionTimer);observer.disconnect();if(finishTouch)touchCanvas?.removeEventListener('touchend',finishTouch);window.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',hide);game.destroy(true);host.classList.remove('free-map-screen');};
}
