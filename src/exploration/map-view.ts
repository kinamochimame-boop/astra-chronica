import {fatePhase,fateLabel,fateRoute} from './fate-path';
import {makeFateEffects} from './fate-effects';
import {memoryPhase,memoryLabel} from './memory-projection';
import {makeMemoryEffects} from './memory-effects';
import {stellarPhase,phaseLabel,phaseKey,phaseOrder,linkLabel} from './stellar-phase';
import {makePhaseEffects} from './phase-effects';
import {gravityPhase,gravityLabel} from './gravity';
import {makeArkEffects} from './ark-effects';
import {networkForMap,transitGuidance} from './transit';
import {celestialPhase,celestialLabel} from './celestial';
import {makeGearEffects} from './gear-effects';
import {railGuidance,type RailTicket} from './railway';
import {mountRailway} from './railway-view';
import {surveyFor,miniMapSnapshot} from './minimap';
import {mountMiniMap} from './minimap-view';
import {lightPathPhase,lightPathLabel} from './light-path';
import {makeGloomEffects} from './gloom-effects';
import {activeMap} from './active-map';
import {resonancePhase,resonanceLabel} from './resonance';
import {navigationTarget,routeGuidance} from './navigation';
import {makePaleEffects} from './pale-effects';
import {mainObjective} from './objective';
import {approachPoint} from './approach';
import {tidePhase,tideLabel} from './tide';
import {makeSeaEffects} from './sea-effects';
import {drawTerrain} from './map-art';
import {transitionReason,objectConditionReason,objectRevealed} from './transitions';
import Phaser from 'phaser';
import type {Progress} from '../save';
import {chapterState,eventOpen,locationOpen} from '../adventure';
import {chapters} from '../data/chapter-one';
import {mountAdventure} from '../adventure-view';
import {collectQuestObjective} from '../side-quests';
import {mapById} from './map-data';
import {mapOpen} from './exploration-save';
import {closeEnough,distance,cell,center,canInteract} from './collision';
import {MapRuntime} from './map-runtime';
import type {MapObject,SymbolContact} from './types';
import './exploration.css';
export interface MapActions {railTravel:(ticket:RailTicket)=>void;battle:(source:SymbolContact)=>void;travel:(mapId:string)=>void;location:(id:string)=>void;list:()=>void;home:()=>void;equipment:()=>void;tree:()=>void;quests:()=>void;journal:()=>void;records:()=>void}
/** One view owns one Phaser scene, all listeners and timers. No battle logic lives here. */
export function mountMap(host:HTMLElement,p:Progress,persist:()=>boolean,actions:MapActions){
 const saved=p.world!,map=activeMap(mapById(saved.mapId)!,p.adventure,p.choices),initialTide=tidePhase(p.adventure)+resonancePhase(p.adventure)+lightPathPhase(p.adventure)+celestialPhase(p.adventure)+gravityPhase(p.adventure)+phaseKey(p.adventure)+memoryPhase(p.adventure)+fatePhase(p.adventure)+fateRoute(p.choices),chapter=chapters.find(c=>c.id===map.chapterId)!;
 const done=()=>chapterState(p.adventure,chapter).completed;
 const available=(id:string)=>{const e=chapter.events.find(e=>e.id===id);return !!e&&eventOpen(chapterState(p.adventure,chapter),e)&&!done().includes(id)};
 const runtime=new MapRuntime(map,saved,available,id=>p.world!.defeated.includes(id),.65);const survey=surveyFor(p,map);survey.discover(map,saved);runtime.onVisit=point=>survey.discover(map,point);
 host.classList.add('free-map-screen');host.innerHTML=`<div class="world-heading"><div><p class="eyebrow">CHAPTER ${String(chapters.findIndex(c=>c.id===map.chapterId)+1).padStart(2,'0')} · EXPLORE</p><h1>${map.name}</h1></div><button id="world-menu-button" class="secondary" aria-label="探索メニュー">☰</button></div><aside id="world-objective" aria-label="現在の冒険目的"></aside><div id="world-viewport" role="region" aria-label="アステルの歩行マップ"></div><p id="world-notice" role="status"></p><button id="world-approach" class="secondary" hidden>選んだ対象の近くへ移動</button><div id="world-nearby" aria-label="近くの対象"></div><p class="world-help">地面をタップして歩く · 矢印／WASDでも移動<br>人・装置・宝箱・出口は輪の範囲に近づいてタップ</p><dialog id="world-menu"><h2>探索メニュー</h2><div class="world-menu-items"></div><button id="world-menu-close" class="secondary">探索に戻る</button></dialog><dialog id="world-event"><div id="world-event-content"></div></dialog>`;
 const viewport=host.querySelector<HTMLElement>('#world-viewport')!,notice=host.querySelector<HTMLElement>('#world-notice')!,nearby=host.querySelector<HTMLElement>('#world-nearby')!,menu=host.querySelector<HTMLDialogElement>('#world-menu')!,eventDialog=host.querySelector<HTMLDialogElement>('#world-event')!;
 const minimap=mountMiniMap(viewport,()=>sync(0,true),p);
 let railwayDispose:(()=>void)|undefined;
 let touchCanvas:HTMLCanvasElement|undefined;
 // Keep native drag scrolling, but prevent a touch-end's synthetic click hitting a newly mounted screen.
 let finishTouch:((event:TouchEvent)=>void)|undefined;
 let approachTarget:MapObject|undefined;let objectiveKey='';
 const refreshObjective=()=>{const goal=mainObjective(p.adventure,chapter),key=goal.title+goal.destination+goal.action+tidePhase(p.adventure)+resonancePhase(p.adventure)+lightPathPhase(p.adventure)+celestialPhase(p.adventure)+gravityPhase(p.adventure)+phaseKey(p.adventure)+memoryPhase(p.adventure)+fatePhase(p.adventure)+fateRoute(p.choices)+routeGuidance(p,map,runtime.hero,runtime.symbols);if(key===objectiveKey)return false;objectiveKey=key;host.querySelector<HTMLElement>('#world-objective')!.textContent=`目的：${goal.title} ｜ ${goal.destination} — ${goal.action} ｜ ${routeGuidance(p,map,runtime.hero,runtime.symbols)}${chapter.id==='chapter-17'?` 星路：${fateLabel(fatePhase(p.adventure))} ｜ 先行路：${!p.choices['c17-branch']?'未選択':fateRoute(p.choices)==='direct'?'北・近道':'南・避難路'}`:''}${chapter.id==='chapter-16'?` 記憶：${memoryLabel(memoryPhase(p.adventure))}`:''}${chapter.id==='chapter-15'?` 位相：${phaseLabel(stellarPhase(p.adventure))} ｜ 接続：${phaseOrder(p.adventure).map(linkLabel).join('→')||'未選択'}`:''}${chapter.id==='chapter-14'?` 重力：${gravityLabel(gravityPhase(p.adventure))}${transitGuidance(p,networkForMap(map.id)!)}`:''}${chapter.id==='chapter-13'?` 天球儀：${celestialLabel(celestialPhase(p.adventure))}${railGuidance(p)}`:''}${chapter.id==='chapter-12'?` 光路：${lightPathLabel(lightPathPhase(p.adventure))}`:''}${chapter.id==='chapter-11'?` 共鳴：${resonanceLabel(resonancePhase(p.adventure))}`:''}${chapter.id==='chapter-10'?` 潮位：${tideLabel(tidePhase(p.adventure))}`:''}`;return true};
 // Lay out the guide before Phaser measures its canvas; otherwise a new guide shifts touch input.
 refreshObjective();
 let disposed=false,saveElapsed=0,lastPublished=0,nearKey='',transitionTimer:number|undefined,frame=0,dirty=false,wasMoving=false;
 const say=(text:string)=>{notice.textContent=text;};
 const flush=()=>{dirty=false;if(!disposed&&!persist())say('保存できません。現在の探索は続けられます。')};
 const pause=()=>{runtime.paused=true;runtime.stop();sync(0,true);flush()};
 const resume=()=>{runtime.paused=document.hidden;nearKey='';sync(0,true)};
 const eventClose=()=>{eventDialog.close();if(p.world?.event&&done().includes(p.world.event.id))p.world.event=undefined;if(initialTide!==tidePhase(p.adventure)+resonancePhase(p.adventure)+lightPathPhase(p.adventure)+celestialPhase(p.adventure)+gravityPhase(p.adventure)+phaseKey(p.adventure)+memoryPhase(p.adventure)+fatePhase(p.adventure)+fateRoute(p.choices)){flush();actions.travel(map.id);return;}flush();resume()};
 const inspect=(o:MapObject)=>{
  if(disposed||runtime.paused||runtime.locked)return;
  const condition=objectConditionReason(p,map,o);if(condition){runtime.stop();host.querySelector<HTMLButtonElement>('#world-approach')!.hidden=true;say(condition);sync(0,true);return}
  if(!canInteract(map,runtime.hero,o)){approachTarget=o;host.querySelector<HTMLButtonElement>('#world-approach')!.hidden=false;const goal=approachPoint(map,runtime.hero,o);if(goal){runtime.moveTo(goal);say('対象の近くへ移動します。到着後、もう一度調べてください。')}else say('壁や閉じた通路のため近くへ移動できません。通れる道を確かめてください。');return}host.querySelector<HTMLButtonElement>('#world-approach')!.hidden=true;
  runtime.stop();scene.pale?.pulse(o,frame);sync(0,true);
  if(o.kind==='exit'){
   const reason=transitionReason(p,map,o);if(reason){say(reason);return}flush();if(o.targetMap)actions.travel(o.targetMap);else if(o.targetLocation)actions.location(o.targetLocation);return;
  }
  if(o.questId&&o.objectiveId){if(collectQuestObjective(p,o.questId,o.objectiveId)){say(o.text??'依頼の手掛かりを調べました。');flush()}else say(p.quests[o.questId]?.objectives.includes(o.objectiveId)?'この手掛かりは調査済みです。':'依頼を受注し、必要な手掛かりを先に調べてください。');return;}
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
  viewport.dataset.state=JSON.stringify({fate:fatePhase(p.adventure),fateRoute:fateRoute(p.choices),memory:memoryPhase(p.adventure),mapId:map.id,chapterId:map.chapterId,locationId:map.locationId,hero:{x:runtime.hero.x,y:runtime.hero.y,facing:runtime.hero.facing,moving:!!runtime.hero.path.length},camera:runtime.camera,width:390,height:scene.scale?.gameSize.height??480,paused:runtime.paused,contactGrace:runtime.contactGrace,stellarPhase:chapter.id==='chapter-15'?stellarPhase(p.adventure):undefined,phaseOrder:chapter.id==='chapter-15'?phaseOrder(p.adventure):undefined,gravity:chapter.id==='chapter-14'?gravityPhase(p.adventure):undefined,celestial:chapter.id==='chapter-13'?celestialPhase(p.adventure):undefined,lightPath:chapter.id==='chapter-12'?lightPathPhase(p.adventure):undefined,resonance:chapter.id==='chapter-11'?resonancePhase(p.adventure):undefined,tide:chapter.id==='chapter-10'?tidePhase(p.adventure):undefined,locked:runtime.locked,tile:map.tile,grid:map.grid,objects:map.objects,symbols:runtime.symbols.map(s=>({id:s.definition.id,x:s.x,y:s.y,state:s.state,updates:s.updates,eventId:s.definition.eventId}))});
  if(refreshObjective())game.scale.updateBounds();if(minimap.open)minimap.update(miniMapSnapshot(p,map,runtime.hero,survey,runtime.symbols));
  const objects=map.objects.filter(o=>objectRevealed(p,map,o)&&canInteract(map,runtime.hero,o)).sort((a,b)=>distance(runtime.hero,a)-distance(runtime.hero,b)),key=objects.map(o=>o.id+(o.eventId?String(done().includes(o.eventId)):o.questId?String(p.quests[o.questId]?.objectives.includes(o.objectiveId!)):'')).join('|');
  const nextTarget=navigationTarget(p,map,runtime.hero,runtime.symbols);if(key!==nearKey){nearKey=key;nearby.replaceChildren();for(const o of objects){const b=document.createElement('button');b.className='secondary';b.dataset.worldObject=o.id;const next=nextTarget?.point.x===o.x&&nextTarget?.point.y===o.y&&nextTarget.name===o.name;const checked=!!o.eventId&&done().includes(o.eventId)||!!o.questId&&!!o.objectiveId&&!!p.quests[o.questId]?.objectives.includes(o.objectiveId);b.dataset.inspected=String(checked);b.dataset.objective=String(next);b.textContent=o.kind==='exit'?`↗ ${o.name}`:`${checked?'✓ ':(o.icon==='phaseDevice'||o.icon==='memoryDevice'||o.icon==='fateDevice')?'装 ':o.kind==='npc'?'人 ':o.kind==='chest'?'箱 ':'装 '}${o.name}を調べる`;b.disabled=o.kind==='chest'&&!!o.eventId&&done().includes(o.eventId);if(b.disabled)b.textContent=`${o.name} · 開封済み`;if(next)b.textContent=`次 ▶ ${b.textContent}`;b.onclick=()=>inspect(o);nearby.append(b)}}
  if(wasMoving&&!runtime.hero.path.length&&dirty){saveElapsed=0;flush()}wasMoving=!!runtime.hero.path.length;
 }
 class WalkScene extends Phaser.Scene {
  phase?:ReturnType<typeof makePhaseEffects>;ark?:ReturnType<typeof makeArkEffects>;gear?:ReturnType<typeof makeGearEffects>;gloom?:ReturnType<typeof makeGloomEffects>;pale?:ReturnType<typeof makePaleEffects>;sea?:ReturnType<typeof makeSeaEffects>;hero!:Phaser.GameObjects.Container;enemies=new Map<string,Phaser.GameObjects.Container>();objects=new Map<string,Phaser.GameObjects.Container>();pointerStart?:{x:number;y:number};
  constructor(){super('free-exploration')}
  create(){
   touchCanvas=this.game.canvas;const touch=this.game.input.touch,original=touch.onTouchEnd as (event:TouchEvent)=>void;
   // Phaser ignores an already prevented event, so process it before suppressing its synthetic click.
   finishTouch=event=>{original(event);if(event.cancelable)event.preventDefault()};
   touchCanvas.removeEventListener('touchend',original);touchCanvas.addEventListener('touchend',finishTouch,{passive:false});
   this.cameras.main.setBounds(0,0,map.width*map.tile,map.height*map.tile);drawTerrain(this,map);makeFateEffects(this,map,fatePhase(p.adventure),fateRoute(p.choices));makeMemoryEffects(this,map,memoryPhase(p.adventure));this.sea=makeSeaEffects(this,map);this.pale=makePaleEffects(this,map);this.gloom=makeGloomEffects(this,map,lightPathPhase(p.adventure));this.gear=makeGearEffects(this,map,celestialPhase(p.adventure));this.ark=makeArkEffects(this,map,gravityPhase(p.adventure));this.phase=makePhaseEffects(this,map,stellarPhase(p.adventure));
   for(const o of map.objects){const c=this.add.container(o.x,o.y);const range=this.add.graphics();range.lineStyle(1,0xe0cd91,.35);range.strokeCircle(0,0,52);range.name='interaction-range';range.setVisible(false);c.add(range);const a=this.add.graphics();a.fillStyle(o.kind==='chest'?0xc7a25f:o.kind==='exit'?0x95c7b2:0x8cadd0);a.fillRoundedRect(-12,-12,24,24,5);if(o.kind==='npc'&&o.icon!=='phaseDevice'&&o.icon!=='memoryDevice'&&o.icon!=='fateDevice'){a.fillStyle(0xf1d5b5);a.fillCircle(0,-17,9)}if(o.icon==='ship'){a.fillStyle(0xd8bd80);a.fillTriangle(-25,0,25,0,12,16);a.lineStyle(3,0xe5d4b3);a.lineBetween(0,0,0,-35);a.fillStyle(0xd6eefa);a.fillTriangle(2,-34,2,-5,28,-7)}if(o.icon==='fateDevice'){a.clear();a.lineStyle(3,0xe6d299);a.lineBetween(0,16,0,0);a.lineBetween(0,0,-16,-16);a.lineBetween(0,0,16,-16);a.strokeCircle(0,0,5)}if(o.icon==='memoryDevice'){a.clear();a.lineStyle(2,0xb9d8e2);a.strokeRect(-15,-15,30,30);a.lineBetween(-15,0,15,0);a.strokeRect(-9,-9,18,18)}if(o.icon==='phaseDevice'){a.clear();a.lineStyle(3,0x9fdbef);a.strokeCircle(0,0,15);a.lineBetween(-19,0,19,0);a.fillStyle(0xe6d19e);a.fillTriangle(0,-8,-6,6,6,6)}c.add(a);const label=this.add.text(0,18,o.name,{fontSize:'10px',fontFamily:'sans-serif',color:'#f5ead0',backgroundColor:'#112b25'}).setOrigin(.5,0);label.name='object-label';c.add(label);this.objects.set(o.id,c)}
   this.hero=this.figure(0x71b4e1);this.hero.setDepth(10);
   for(const s of runtime.symbols){const c=this.figure(0xc98c88);c.setScale(s.definition.radius/10);const contact=this.add.graphics();contact.lineStyle(1,0xf4a795,.8);contact.strokeCircle(0,0,10);c.addAt(contact,0);c.setDepth(9);c.add(this.add.text(0,25,`${s.definition.name} · ${{idle:'待',patrol:'巡',chase:'追'}[s.definition.mode]}`,{fontSize:'10px',fontFamily:'sans-serif',color:'#ffe3d1',backgroundColor:'#2b2020'}).setOrigin(.5,0));this.enemies.set(s.definition.id,c)}
   this.input.on('pointerdown',(pointer:Phaser.Input.Pointer)=>{this.pointerStart={x:pointer.x,y:pointer.y}});
   this.input.on('pointerup',(pointer:Phaser.Input.Pointer)=>{const start=this.pointerStart;this.pointerStart=undefined;if(!start||Math.hypot(start.x-pointer.x,start.y-pointer.y)>10||runtime.paused||runtime.locked)return;const point={x:pointer.x+runtime.camera.x,y:pointer.y+runtime.camera.y},object=map.objects.find(o=>objectRevealed(p,map,o)&&distance(point,o)<22);if(object)inspect(object);else {runtime.moveTo(point);say(runtime.notice);sync(0,true)}});
   this.input.on('pointerupoutside',()=>{this.pointerStart=undefined});this.input.on('gameout',()=>{this.pointerStart=undefined});
  }
  /** Future SD textures can replace only this factory; movement uses world poses, not sprite bounds. */
  figure(color:number){const c=this.add.container(0,0),g=this.add.graphics();g.fillStyle(0x000000,.25);g.fillEllipse(0,12,25,10);g.fillStyle(color);g.fillRoundedRect(-8,-1,16,18,5);g.fillStyle(0xf1d5b5);g.fillCircle(0,-9,10);g.fillStyle(color);g.fillEllipse(0,-15,22,9);g.fillStyle(0x192e32);g.fillCircle(-3,-9,1.5);g.fillCircle(3,-9,1.5);c.add(g);const arrow=this.add.triangle(0,22,-4,0,4,0,0,5,0xf1d797);arrow.name='direction';c.add(arrow);return c;}
  update(_:number,delta:number){if(disposed)return;const contact=runtime.step(delta/1000,390,this.scale.gameSize.height),reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;frame+=Math.min(delta,250);this.sea?.update(frame,reduced);this.pale?.update(frame,reduced,runtime.camera,this.scale.gameSize.height);this.gloom?.update(frame,reduced,runtime.camera,this.scale.gameSize.height);this.gear?.update(frame,reduced,runtime.camera,this.scale.gameSize.height);this.ark?.update(frame,reduced,runtime.camera,this.scale.gameSize.height);this.phase?.update(frame,reduced,runtime.camera,this.scale.gameSize.height);this.hero.setPosition(runtime.hero.x,runtime.hero.y+(runtime.hero.path.length&&!reduced?Math.sin(frame/85)*2:0));const arrow=this.hero.getByName('direction') as Phaser.GameObjects.Triangle;arrow.setRotation(({down:0,left:Math.PI/2,up:Math.PI,right:-Math.PI/2})[runtime.hero.facing]);
   const nextTarget=navigationTarget(p,map,runtime.hero,runtime.symbols);for(const s of runtime.symbols){const c=this.enemies.get(s.definition.id)!;c.setPosition(s.x,s.y);c.setVisible(s.state!=='hidden'&&s.state!=='defeated')}for(const o of map.objects){const c=this.objects.get(o.id)!;c.setVisible(objectRevealed(p,map,o));const next=nextTarget?.point.x===o.x&&nextTarget?.point.y===o.y&&nextTarget.name===o.name;const checked=!!o.eventId&&done().includes(o.eventId)||!!o.questId&&!!o.objectiveId&&!!p.quests[o.questId]?.objectives.includes(o.objectiveId);(c.getByName('object-label') as Phaser.GameObjects.Text).setText(`${next?'次 ':''}${o.kind==='exit'?'':checked?'✓ ':(o.icon==='phaseDevice'||o.icon==='memoryDevice'||o.icon==='fateDevice')?'装 ':o.kind==='npc'?'人 ':o.kind==='chest'?'箱 ':'装 '}${o.name}`);c.setAlpha(o.kind==='chest'&&p.world!.opened.includes(o.id)?.4:checked?.65:1);c.setScale(canInteract(map,runtime.hero,o)?1.08:1);(c.getByName('interaction-range') as Phaser.GameObjects.Graphics).setScale(1/c.scaleX).setVisible(next||canInteract(map,runtime.hero,o))}
   this.cameras.main.setScroll(runtime.camera.x,runtime.camera.y);sync(Math.min(delta/1000,.25));if(contact){sync(0,true);flush();viewport.classList.add('encounter-flash');say('敵に接触しました。戦闘へ移ります。');transitionTimer=window.setTimeout(()=>{if(!disposed)actions.battle(contact)},reduced?0:160);}
  }
 }
 const scene=new WalkScene(),game=new Phaser.Game({type:Phaser.AUTO,width:390,height:480,parent:viewport,scene,backgroundColor:'#16392c',banner:false,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},input:{touch:{capture:false}}});
 const resize=()=>{if(game.isBooted&&viewport.clientWidth){const height=Math.round(390*viewport.clientHeight/viewport.clientWidth);game.scale.setGameSize(390,height);game.scale.updateBounds()}};const observer=new ResizeObserver(resize);observer.observe(viewport);game.events.once(Phaser.Core.Events.READY,resize);
 host.querySelector<HTMLButtonElement>('#world-approach')!.onclick=()=>{if(!approachTarget||runtime.paused||runtime.locked)return;const reason=objectConditionReason(p,map,approachTarget);if(reason){say(reason);return}const goal=approachPoint(map,runtime.hero,approachTarget);if(!goal){say('対象へ近づける通路がありません。別の出口や手順を確かめてください。');return}runtime.moveTo(goal);host.querySelector<HTMLButtonElement>('#world-approach')!.hidden=true;say('近くまで移動します。到着後、もう一度対象をタップしてください。');sync(0,true)};
 const key=(e:KeyboardEvent)=>{const dirs:Record<string,[number,number]>={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]};const dir=dirs[e.key];if(!dir||runtime.paused||runtime.locked||disposed)return;e.preventDefault();if(e.repeat&&runtime.hero.path.length)return;const c=cell(map,runtime.hero);runtime.moveTo(center(map,{x:c.x+dir[0],y:c.y+dir[1]}));say(runtime.notice);sync(0,true)};
 const refreshInputBounds=()=>{if(game.isBooted)game.scale.updateBounds()};viewport.addEventListener('touchstart',refreshInputBounds,{capture:true,passive:true});viewport.addEventListener('mousedown',refreshInputBounds,true);
 const visibility=()=>{if(document.hidden)pause();else if(!menu.open&&!eventDialog.open&&!host.querySelector<HTMLDialogElement>('#railway-dialog')?.open)resume()};
 const hide=()=>{runtime.stop();sync(0,true);flush()};window.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',hide);
 host.querySelector<HTMLButtonElement>('#world-menu-button')!.onclick=()=>{pause();menu.showModal()};host.querySelector<HTMLButtonElement>('#world-menu-close')!.onclick=()=>{menu.close();resume()};menu.addEventListener('cancel',()=>resume());eventDialog.addEventListener('cancel',()=>{if(p.world?.event&&done().includes(p.world.event.id))p.world.event=undefined;flush();resume()});
 const network=networkForMap(map.id);if(network){const b=document.createElement('button');b.id=network.id==='railway'?'world-railway':'world-ark-control';b.className='secondary';b.textContent=network.label;b.onclick=()=>{if(disposed||runtime.locked)return;pause();menu.close();railwayDispose?.();railwayDispose=mountRailway(p,host,ticket=>actions.railTravel(ticket),resume,network)};host.querySelector('.world-menu-items')!.append(b)}
 for(const [label,action] of [['地点一覧',actions.list],['装備',actions.equipment],['スキルツリー',actions.tree],['サブクエスト',actions.quests],['冒険手帳',actions.journal],['探索記録',actions.records],['ホームへ戻る',actions.home]] as const){const b=document.createElement('button');b.className='secondary';b.textContent=label;b.onclick=()=>{hide();menu.close();action()};host.querySelector('.world-menu-items')!.append(b)}
 say(saved.recovered?'中断した戦闘を取り消し、安全な場所から再開しました。未確定の報酬は付与していません。':saved.event?'中断した会話は、対象の近くで再開できます。':'地面をタップして歩きましょう。');saved.recovered=undefined;
 return ()=>{if(disposed)return;hide();disposed=true;if(transitionTimer!==undefined)clearTimeout(transitionTimer);observer.disconnect();railwayDispose?.();runtime.onVisit=undefined;minimap.dispose();viewport.removeEventListener('touchstart',refreshInputBounds,true);viewport.removeEventListener('mousedown',refreshInputBounds,true);if(finishTouch)touchCanvas?.removeEventListener('touchend',finishTouch);window.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',hide);game.destroy(true);host.classList.remove('free-map-screen');};
}
