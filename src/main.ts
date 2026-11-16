import {gameVersionLabel} from './game-release';
import {firstBattleGuide} from './player-guidance';
import './player-guidance.css';
import {ViewFrameLoop} from './view-frame-loop';
import {ViewSession,captureReturnSpot,returnScroll,type ReturnSpot} from './adventure-view-navigation';
import './adventure-quality.css';
import {mountDashboard} from './adventure-dashboard';
import {mountCompass} from './adventure-compass-view';
import {mountSaveBackup} from './save-backup-view';
import {compassChapter} from './adventure-compass';
import {completeTransit} from './exploration/transit';
import {mountMap} from './exploration/map-view';
import {mapForLocation,mapById,symbolForEvent,walkMaps} from './exploration/map-data';
import {enterMap} from './exploration/exploration-save';
import type {SymbolContact} from './exploration/types';
import {visitLocation,chapterState} from './adventure';
import './chapter-six.css';
import './chapter-five.css';
import {mountJournal} from './journal';
import './chapter-four.css';
import {mountSideQuests} from './side-quest-view';
import {mountExplorationRecords} from './exploration-records';
import './chapter-three.css';
import {mountChapterSelection} from './chapter-selection';
import {isItem} from './consumables';
import './chapter-two.css';
import {mountSkillTree} from './skill-tree-view';
import {withSkillTree} from './skill-tree';
import {mountAdventure} from './adventure-view';
import {chapterOne,chapters,type Chapter} from './data/chapter-one';
import {beginAdventureBattle,resolveAdventureBattle} from './adventure';
import {encounterSetup} from './data/encounters';
import type {BattleSetup} from './battle';
import {mountEquipment} from './equipment-view';
import {equippedUnit} from './equipment';
import type {HeroId} from './data/weapons';
import {mountEnding} from './ending-view';
import {endingAvailable,gameCleared} from './ending';
import Phaser from 'phaser';
import {Battle,heroes,skills,commandsFor,type Unit,type Command,type ActionResult} from './battle';
import {BALANCE} from './balance';
import {load,save} from './save';
import {cloneUnit} from './data/combat';
import {gainExperience,requiredExperience,growUnit} from './progression';
import {mountLab} from './lab';
import {AtbView} from './atb-view';
import {AtbCombat} from './atb-combat';
import {ATB_RULES} from './atb-rules';
import './atb-ui.css';
import {statusSnapshot,statusNotices} from './battle-presentation';
import {Stage} from './visuals';
import './style.css';
import './battle-ui.css';
const app=document.querySelector<HTMLDivElement>('#app')!;
let progress=load(),battle:Battle,selected=0,busy=false;
let command:Command='attack',targetId='',battleSession=0;
let turnTimer:number|undefined;
let battleView:AtbView|undefined;
let atb:AtbCombat|undefined;
let stopAtb:(()=>void)|undefined;
let actingId:string|undefined,actionRound=1;
let activeChapter:Chapter=chapters.find(c=>c.id===progress.adventure.selectedChapterId)??chapters.find(c=>c.id===mapById(progress.world?.mapId)?.chapterId)??[...chapters].reverse().find(c=>progress.adventure.chapters[c.id])??chapterOne;
let adventureBattle:{serial:number;eventId:string}|undefined;
let worldDispose:(()=>void)|undefined;
let endingDispose:(()=>void)|undefined;
let screen='title';let storageOK=true;const views=new ViewSession();
app.innerHTML=`<div class="shell"><header><span class="sigil">✧</span><span>ASTRA CHRONICA<small>星詠みの遺した約束</small></span><span class="version">${gameVersionLabel()}</span></header><section id="content"></section><footer>✦ 星の記憶は、あなたとともに。</footer></div>`;
const content=document.querySelector<HTMLElement>('#content')!;
const stage=new Stage();
const game=new Phaser.Game({type:Phaser.AUTO,width:390,height:310,transparent:true,scene:stage,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},banner:false,parent:document.createElement('div')});
const canvasHost=game.config.parent as HTMLElement;canvasHost.className='stage';canvasHost.setAttribute('aria-label','図形で描かれたパーティと戦場');
const resizeStage=()=>{if(!game.isBooted||!canvasHost.clientWidth||!canvasHost.clientHeight)return;const height=Math.round(390*canvasHost.clientHeight/canvasHost.clientWidth);if(game.scale.gameSize.height!==height)game.scale.resize(390,height)};
new ResizeObserver(resizeStage).observe(canvasHost);game.events.once(Phaser.Core.Events.READY,resizeStage);
function persist(){storageOK=save(progress);let warning=app.querySelector<HTMLElement>('#save-warning');if(!warning){warning=document.createElement('p');warning.id='save-warning';warning.setAttribute('role','alert');app.querySelector('.shell')!.prepend(warning)}const noteText=storageOK?'進行はこのブラウザに自動保存されます':'保存できません。現在のプレイは続行できます';app.querySelectorAll('.save-note').forEach(note=>{if(note.textContent!==noteText)note.textContent=noteText});if(warning.hidden!==storageOK)warning.hidden=storageOK;const message=storageOK?'':'保存できません。再読込・終了前に保存先の空き容量やブラウザ設定を確認してください。';if(warning.textContent!==message)warning.textContent=message;return storageOK}
function button(label:string,action:()=>void,cls='primary',parent:HTMLElement=content){const b=document.createElement('button');b.textContent=label;b.className=cls;b.onclick=views.guard(b,()=>{if(!b.disabled){b.focus({preventScroll:true});action()}});parent.append(b);return b}
function partyUnits(){return heroes.map(h=>withSkillTree(equippedUnit(growUnit(cloneUnit(h),progress.party[h.id]),progress.equipment.equipped[h.id as HeroId]),progress.skillTree[h.id as HeroId]))}
function draw(units=partyUnits()){content.append(canvasHost);game.events.emit('stage',units,selected,screen==='battle'?battle.units.findIndex(u=>u.id===targetId):-1)}
function leaveWorld(){if(worldDispose){const dispose=worldDispose;worldDispose=undefined;dispose();game.loop.wake();}}
function heading(kicker:string,title:string){views.enter();content.classList.toggle('adventure-home',screen==='home');window.scrollTo(0,0);if(screen!=='ending'&&endingDispose){endingDispose();endingDispose=undefined;}if(screen!=='world')leaveWorld();if(screen!=='battle'){battleView?.dispose();battleView=undefined;}content.classList.remove('result-screen','city-clear','wind-clear','crystal-clear','desert-clear','dawn-clear');content.classList.toggle('in-battle',screen==='battle');content.innerHTML=`<p class="eyebrow">${kicker}</p><h1>${title}</h1>`;queueMicrotask(views.guard(content,()=>{if(!document.querySelector('dialog[open]')&&!content.contains(document.activeElement)){const h=content.querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}}}))}
function home(){screen='home';busy=false;heading('STARGAZER’S CAMP','星灯りの野営地');mountDashboard(content,progress,adventure,{tree:()=>showGrowth('tree',home),equipment:()=>showGrowth('equipment',home),builds:()=>showGrowth('tree',home,true),quests:()=>showQuests(home)});
 const menu=(title:string)=>{const section=document.createElement('section'),h=document.createElement('h2'),nav=document.createElement('nav');section.className='home-menu';h.textContent=title;nav.setAttribute('aria-label',title);section.append(h,nav);content.append(section);return nav};
 const records=menu('冒険・記録と設定');for(const [label,action] of [['冒険コンパス',()=>showCompass(home)],['サブクエスト',()=>showQuests(home)],['章選択',chapterSelection],['冒険手帳',()=>showJournal(home)],['探索記録',()=>showRecords(home)],['セーブデータ管理',showBackup]] as const)button(label,action,'secondary',records);
 const figures=document.createElement('details');figures.className='home-figures';const summary=document.createElement('summary');summary.textContent='仲間と戦績';const wins=document.createElement('span');wins.className='home-win-count';wins.textContent=`勝利 ${progress.wins}回`;summary.append(wins);figures.append(summary);content.append(figures);draw();figures.append(canvasHost);const stats=document.createElement('p');stats.textContent=`戦闘 ${progress.battles}回 ／ 勝利 ${progress.wins}回 ／ 星露の小瓶 ${progress.consumables.potion}個 ／ 灯火の雫 ${progress.consumables.ether}個`;figures.append(stats);
 const other=menu('補助操作');button('冒険へ出発',adventure,'secondary',other);button('戦闘開始　→',start,'secondary',other);button('編成を見る',formation,'secondary',other);button('戦闘基盤テスト（保存なし）',()=>{cancelTurn();views.enter();screen='lab';content.classList.remove('adventure-home');mountLab(content,views.guard(content,home),{host:canvasHost,show:(units,selected,target,targets)=>game.events.emit('stage',units,selected,units.findIndex(u=>u.id===target),targets),effect:event=>game.events.emit('battle-effect',event)})},'secondary',other);button('タイトルへ',title,'text-button',other);
 if(gameCleared(progress)){const mark=document.createElement('p');mark.className='clear-data-badge';mark.textContent='✧ 全18章クリア済み';content.append(mark);button('エンディングを振り返る',()=>showEnding(true),'secondary')}else if(endingAvailable(progress))button('エンディングを再開',()=>showEnding(),'secondary');status();}

function status(){content.insertAdjacentHTML('beforeend',`<p class="save-note">${storageOK?'進行はこのブラウザに自動保存されます':'保存できません。現在のプレイは続行できます'}</p>`)}
function title(){screen='title';heading('A PROMISE WRITTEN IN THE STARS','アストラ<br>クロニカ');content.insertAdjacentHTML('beforeend','<p class="subtitle">〜星詠みの遺した約束〜</p>');draw();content.insertAdjacentHTML('beforeend','<p class="prologue">あの日、星に誓った。<br>もう一度、君と夜明けを見ると。</p>');if(gameCleared(progress))content.insertAdjacentHTML('beforeend','<p class="clear-data-badge">✧ クリア済みデータがあります</p>');button(progress.started?'ゲーム開始 · 続きから':'ゲーム開始',()=>{progress.started=true;persist();home()});status()}
function returnTo(back:()=>void,spot:ReturnSpot){return views.guard(content,()=>{back();const top=returnScroll(spot,screen,progress.world?.mapId);const restore=views.guard(content,()=>{window.scrollTo(0,top);const visible=(e:HTMLElement)=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.top>=0&&r.bottom<=innerHeight};const controls=Array.from(content.querySelectorAll<HTMLElement>('button,summary'));const original=spot.focusLabel?controls.find(e=>e.textContent?.trim()===spot.focusLabel):undefined;const h=content.querySelector<HTMLElement>('h1');const target=original??(h&&visible(h)?h:controls.find(visible)??h);target?.focus({preventScroll:true});if(original&&!visible(original))original.scrollIntoView({block:'nearest'})});restore()})}
function originSpot(){return captureReturnSpot(screen,progress.world?.mapId,window.scrollY,document.activeElement instanceof HTMLButtonElement?document.activeElement.textContent?.trim():undefined)}
function showGrowth(kind:'tree'|'equipment',back:()=>void,builds=false,origin=originSpot()){if(screen==='battle')return;cancelTurn();screen=kind==='tree'?'skill-tree':'equipment';content.classList.remove('skill-tree-screen','equipment-screen');heading(kind==='tree'?'SKILL TREE':'EQUIPMENT',kind==='tree'?'スキルツリー':'装備');const options={backLabel:origin.screen==='home'?'ホームへ戻る':'探索へ戻る',inBattle:()=>screen==='battle',onTree:()=>showGrowth('tree',back,false,origin),onEquipment:()=>showGrowth('equipment',back,false,origin)};const done=returnTo(back,origin),returnToGame=()=>{content.classList.remove('skill-tree-screen','equipment-screen');done()};if(kind==='tree')mountSkillTree(content,progress,persist,returnToGame,options);else mountEquipment(content,progress,persist,returnToGame,options);if(builds){const panel=content.querySelector<HTMLDetailsElement>('.growth-panel');if(panel){panel.open=true;panel.scrollIntoView({block:'start'});queueMicrotask(()=>{if(panel.isConnected)panel.querySelector<HTMLElement>('summary')?.focus({preventScroll:true})})}}}

function formation(){screen='formation';heading('PARTY','旅の仲間');draw();content.insertAdjacentHTML('beforeend',`<article><p>編成は仮画面です。三人の役割は固定です。</p>${partyUnits().map(h=>`<h2>${h.name} Lv.${h.level} <small>${h.role}</small></h2><p>使用武器：${h.weapons.join('／')}<br>HP ${h.maxHp} · MP ${h.maxMp}<br>攻撃力 ${h.attack} · 防御力 ${h.defense} · 素早さ ${h.speed}</p>`).join('')}<p>武器はホームの「装備」から変更できます。</p></article>`);button('ホームへ戻る',home)}
function cancelTurn(){if(stage.sys?.isActive()){stage.tweens.timeScale=1;stage.time.timeScale=1;}stopAtb?.();stopAtb=undefined;atb?.dispose();atb=undefined;battleSession++;if(turnTimer!==undefined)window.clearTimeout(turnTimer);turnTimer=undefined}
function showCompass(back:()=>void){if(screen==='battle')return;const spot=originSpot();cancelTurn();screen='compass';heading('ADVENTURE COMPASS','冒険コンパス');mountCompass(content,progress);button('サブクエスト',()=>showQuests(back,spot),'secondary');button(spot.screen==='home'?'ホームへ戻る':'探索へ戻る',returnTo(back,spot),'secondary')}
function showBackup(){if(screen==='battle')return;const spot=originSpot();cancelTurn();screen='backup';heading('BACKUP','セーブデータ管理');mountSaveBackup(content,progress,persist,next=>{cancelTurn();leaveWorld();adventureBattle=undefined;progress=next;activeChapter=compassChapter(progress);storageOK=true;home()},returnTo(home,spot))}
function showQuests(back:()=>void,spot=originSpot()){if(screen==='battle')return;cancelTurn();screen='quests';heading('QUESTS','サブクエスト');mountSideQuests(content,progress,persist,returnTo(back,spot),spot.screen==='home'?'ホームへ戻る':'探索へ戻る')}
function showRecords(back:()=>void,spot=originSpot()){if(screen==='battle')return;cancelTurn();screen='records';heading('RECORDS','探索記録');mountExplorationRecords(content,progress,returnTo(back,spot),spot.screen==='home'?'ホームへ戻る':'探索へ戻る')}
function showJournal(back:()=>void,spot=originSpot()){if(screen==='battle')return;cancelTurn();screen='journal';heading('JOURNAL','冒険手帳');mountJournal(content,progress,returnTo(back,spot),spot.screen==='home'?'ホームへ戻る':'探索へ戻る')}
function chapterSelection(){cancelTurn();screen='chapters';heading('CHAPTERS','冒険の記録');mountChapterSelection(content,progress,selectChapter,home)}
function selectChapter(c:Chapter){activeChapter=c;progress.adventure.selectedChapterId=c.id;persist();adventure()}
function showEnding(replay=false){if(screen==='ending'&&endingDispose)return;cancelTurn();leaveWorld();endingDispose?.();screen='ending';heading('FINALE','星詠みの遺した約束');game.loop.sleep();endingDispose=mountEnding(content,progress,()=>{endingDispose?.();endingDispose=undefined;game.loop.wake();home()},next=>{storageOK=save(next);if(storageOK)Object.assign(progress,next);return storageOK},replay,()=>{endingDispose?.();endingDispose=undefined;game.loop.wake();activeChapter=chapters.find(c=>c.id===progress.adventure.selectedChapterId)??chapters.find(c=>c.id===mapById(progress.world?.mapId)?.chapterId)??[...chapters].reverse().find(c=>progress.adventure.chapters[c.id])??chapterOne;adventure()})}
function adventure(){if(activeChapter.id==='chapter-18'&&endingAvailable(progress)&&!gameCleared(progress)){showEnding();return}showAdventure(false)}
function locationList(){showAdventure(true)}
function showAdventure(list:boolean){const m=mapForLocation(activeChapter.id,chapterState(progress.adventure,activeChapter).currentLocationId);if(m&&!list){openMap(m.id);return}cancelTurn();screen='adventure';heading('ADVENTURE',activeChapter.name);mountAdventure(content,progress,persist,startAdventure,home,activeChapter,selectChapter,()=>showQuests(adventure),()=>showRecords(adventure),()=>showJournal(adventure),walkMaps.some(m=>m.chapterId===activeChapter.id)?{onMapLocation:openMap}:undefined)}
function openMap(id:string){leaveWorld();content.classList.remove('adventure-screen');if(!enterMap(progress,id)){showAdventure(true);return}activeChapter=chapters.find(c=>c.id===mapById(id)!.chapterId)!;persist();cancelTurn();screen='world';heading('EXPLORATION',mapById(id)!.name);game.loop.sleep();worldDispose=mountMap(content,progress,persist,{railTravel:ticket=>{leaveWorld();if(completeTransit(progress,ticket))openMap(ticket.to);else adventure()},battle:contact=>{const symbol=mapById(contact.mapId)!.symbols.find(s=>s.id===contact.symbolId)!;startAdventure(symbol.eventId,contact)},travel:openMap,location:id=>{if(visitLocation(progress.adventure,activeChapter,id)){persist();adventure()}},list:locationList,home,equipment:()=>showGrowth('equipment',adventure),tree:()=>showGrowth('tree',adventure),quests:()=>showQuests(adventure),journal:()=>showJournal(adventure),records:()=>showRecords(adventure),compass:()=>showCompass(adventure)});}

function startAdventure(eventId:string,source?:SymbolContact){const e=activeChapter.events.find(e=>e.id===eventId);const serial=beginAdventureBattle(progress,activeChapter,eventId,source);if(serial===undefined||!e?.encounter){adventure();return}adventureBattle={serial,eventId};persist();launchBattle(encounterSetup(e.encounter,progress.choices))}
function start(){adventureBattle=undefined;launchBattle()}
function launchBattle(setup?:BattleSetup){
 leaveWorld();cancelTurn();views.enter();battleView?.dispose();actingId=undefined;
 battle=new Battle(Math.random,progress.party,undefined,progress.equipment,setup,progress.skillTree,progress.consumables);
 screen='battle';busy=false;selected=0;
 const units=battle.units,combat=atb=new AtbCombat(battle),view=battleView=new AtbView(content,canvasHost,combat,views.guard(content,()=>finish('defeat')),firstBattleGuide(progress));
 if(stage.sys?.isActive()){stage.tweens.timeScale=0;stage.time.timeScale=0;}game.events.emit('stage',units,0,3);
 combat.onEvent=event=>{if(screen!=='battle'||atb!==combat)return;if(isItem(event.command)){progress.consumables=battle.itemInventory();persist()}view.present(event);game.events.emit('battle-effect',event);};
 let last=0,closed=false,ending=false;
 const suspend=()=>{last=0;frames.suspend();if(turnTimer!==undefined){window.clearTimeout(turnTimer);turnTimer=undefined;ending=false}if(stage.sys?.isActive()){stage.tweens.timeScale=0;stage.time.timeScale=0;}};
 const resetClock=()=>{last=0;if(document.hidden)suspend();else frames.resume()};
 const onPageHide=(event:PageTransitionEvent)=>{if(event.persisted)suspend();else cancelTurn()};
 const onPageShow=(event:PageTransitionEvent)=>{if(event.persisted&&!closed){last=0;if(!document.hidden)frames.resume()}};
 stopAtb=()=>{if(closed)return;closed=true;frames.dispose();document.removeEventListener('visibilitychange',resetClock);window.removeEventListener('pagehide',onPageHide);window.removeEventListener('pageshow',onPageShow);if(stage.sys?.isActive()){stage.tweens.timeScale=1;stage.time.timeScale=1;}};
 const tick=(now:number)=>{if(closed||screen!=='battle'||atb!==combat)return false;const elapsed=last?Math.max(0,(now-last)/1000):0,seconds=elapsed>ATB_RULES.suspensionGap?0:elapsed;last=now;
  const ready=stage.sys?.isActive();if(ready){stage.tweens.timeScale=!combat.started||combat.paused||document.hidden?0:combat.speed;stage.time.timeScale=!combat.started||combat.paused||document.hidden?0:combat.speed;}if(!document.hidden)combat.advance(seconds);view.update();if(ready){if(stage.units!==units)game.events.emit('stage',units,0,3);stage.syncRealtime(combat.targetId,units.filter(u=>combat.slot(u.id).busyUntil>combat.time).map(u=>u.id));}
  if(battle.result&&!ending){ending=true;const session=battleSession;turnTimer=window.setTimeout(()=>{if(session===battleSession&&screen==='battle')finish(battle.result!)},BALANCE.animationMs/combat.speed);}
  return !ending;
 };const frames=new ViewFrameLoop(tick);document.addEventListener('visibilitychange',resetClock);window.addEventListener('pagehide',onPageHide);window.addEventListener('pageshow',onPageShow);if(!document.hidden)frames.resume();
}
game.events.on('unit-tap',(id:string)=>{if(screen==='battle')battleView?.target(id)});
function finish(result:'victory'|'defeat'){if(adventureBattle){finishAdventure(result);return}finishRegular(result)}
function finishRegular(result:'victory'|'defeat'){if(screen!=='battle')return;cancelTurn();battle.resetBattleResources();screen='result';busy=false;progress.battles++;let rewardText='';if(result==='victory'){progress.wins++;const xp=battle.experienceReward;rewardText=`一人につき経験値 ${xp} 獲得。<br>`+battle.allies.map(h=>{const p=progress.party[h.id];const levels=gainExperience(p,xp);return `${h.name} Lv.${p.level}${levels?`（${levels}レベルアップ！）`:''} EXP ${p.experience}/${requiredExperience(p.level)}`}).join('<br>')}persist();heading(result==='victory'?'VICTORY':'DEFEAT',result==='victory'?'星明かりの勝利':'まだ、旅は終わらない');draw(battle.allies);content.classList.add('result-screen');content.insertAdjacentHTML('beforeend',`<article><h2>${result==='victory'?'約束へ、一歩。':'もう一度、星を見上げて。'}</h2><p>${result==='victory'?'アステルたちは霧を払い、森の奥に小さな星の欠片を見つけた。':'三人は野営地に戻り、次の旅に備える。'}</p><p>${rewardText}</p><p>累計勝利 ${progress.wins}回</p></article>`);button('ホームへ戻る',home);button('もう一度挑む',start,'secondary');status()}
function finishAdventure(result:'victory'|'defeat'){
 if(screen!=='battle'||!adventureBattle)return;
 const context=adventureBattle;cancelTurn();battle.resetBattleResources();screen='result';busy=false;
 const settled=resolveAdventureBattle(progress,context.serial,result);persist();
 heading(settled.cleared?'CHAPTER CLEAR':result==='victory'?'VICTORY':'RETRY',settled.cleared?`第${chapters.indexOf(activeChapter)+1}章クリア`:result==='victory'?(activeChapter.id===chapterOne.id?'霧の先へ、一歩':activeChapter.id==='chapter-02'?'灰の先へ、一歩':activeChapter.id==='chapter-03'?'風の先へ、一歩':activeChapter.id==='chapter-04'?'歌の先へ、一歩':activeChapter.id==='chapter-05'?'砂の先へ、一歩':activeChapter.id==='chapter-06'?'朝の先へ、一歩':activeChapter.id==='chapter-17'?'選び直す未来へ':activeChapter.id==='chapter-16'?'終わりの記録、その先へ':activeChapter.id==='chapter-15'?'星の眠り、次の岸':activeChapter.id==='chapter-14'?'記憶を載せて、今を進む':activeChapter.id==='chapter-13'?'違う空を選ぶ駅へ':activeChapter.id==='chapter-12'?'次の芽が出る余白へ':activeChapter.id==='chapter-11'?'余白に残る足音へ':activeChapter.id==='chapter-10'?'潮騒の先、帰る灯りへ':activeChapter.id==='chapter-09'?'灯りと記憶、その先へ':activeChapter.id==='chapter-08'?'帰る灯りと、その先へ':'若葉の先へ、一歩'):'野営地で立て直そう');draw(battle.allies);content.classList.add('result-screen');
 const text=document.createElement('article');const message=document.createElement('p');message.textContent=result==='victory'?`一人につき経験値 ${settled.xp} 獲得。`:'地点は未クリアのままです。装備を整え、もう一度挑戦できます。';text.append(message);
 if(result==='victory')for(const hero of battle.allies){const line=document.createElement('p');line.textContent=`${hero.name} Lv.${progress.party[hero.id].level}${settled.levels[hero.id]?'（レベルアップ！）':''}`;text.append(line)}
 if(settled.cleared){const line=document.createElement('p');line.textContent=(activeChapter.id===chapterOne.id?'守護獣は静かに眠り、森の霧が晴れていく。':activeChapter.id==='chapter-02'?'鐘が静まり、星図が街へ戻った。灯火のロッドを入手した。':activeChapter.id==='chapter-03'?'風路がつながり、空渡りの道が戻った。星風のワンドを入手した。':activeChapter.id==='chapter-04'?'セレナ「歌が変わり、人々が目覚め始めました。一人ずつ声を聞きに行きます」。月晶のロッドを入手した。':activeChapter.id==='chapter-05'?'ザイラ「星砂は王都と砂海の両方へ流れた」。嵐が収まり、商隊が帰り始めた。蜃気楼のワンドを入手した。':activeChapter.id==='chapter-06'?'エイルがミラと再会し、クロノリアに次の朝が来た。ルシエルは記録を守り、旅の続きを託す。暁晶のロッドを入手した。':activeChapter.id==='chapter-17'?'星詠みの約束の核心を知り、約束の始原への接続権限を得た。運命のロッドを入手した。最終決戦は第18章へ。':activeChapter.id==='chapter-16'?'終焉の記録を受け取り、未送信の宛先へ続く道を得た。記憶のロッドを入手した。':activeChapter.id==='chapter-15'?'星冠を部分修復し、聖域の位相が安定した。選び直す未来へ続く接続を残した。星界のワンドを入手した。':activeChapter.id==='chapter-14'?'方舟が再起動し、過去を残しながら今の航路を選ぶ。忘却のワンドを入手した。':activeChapter.id==='chapter-13'?'天球儀が再起動し、人々は記録を映す空と休む場所を選ぶ。星図のメイスを入手した。':activeChapter.id==='chapter-12'?'森の導路が戻り、樹は次の芽へ光を渡し始める。古樹のロッドを入手した。':activeChapter.id==='chapter-11'?'巡礼路は言葉の主へ戻り、ミラは自分で頁を選ぶ。星声のワンドを入手した。':activeChapter.id==='chapter-10'?'ルミナリアは変化を伝える星灯へ戻り、町は観測記録を共有する。星灯のロッドを入手した。':activeChapter.id==='chapter-09'?'メモリアは緩衝路の見守りへ戻り、街は記憶を開く範囲を住民が選ぶ。記憶晶のメイスを入手した。':activeChapter.id==='chapter-08'?'浮島の灯りが戻り、アルカは迎える翼を選んだ。アストレイアは今の空を支える。星風のロッドを入手した。':'星樹の根が記録を分け、新しい苗が葉を開いた。セレスは庭に残り、旅人へ西の海の観測印を託す。星樹のワンドを入手した。')+activeChapter.preview;text.append(line)}
 if(settled.cleared&&activeChapter.id==='chapter-02')content.classList.add('city-clear');if(settled.cleared&&activeChapter.id==='chapter-03')content.classList.add('wind-clear');if(settled.cleared&&activeChapter.id==='chapter-04')content.classList.add('crystal-clear');if(settled.cleared&&activeChapter.id==='chapter-05')content.classList.add('desert-clear');if(settled.cleared&&activeChapter.id==='chapter-06')content.classList.add('dawn-clear');content.append(text);if(activeChapter.id==='chapter-18'&&context.eventId==='c18-final-boss'&&result==='victory'){content.classList.add('finale-victory');button('エンディングへ',()=>showEnding());}button('冒険へ戻る',adventure);if(result==='defeat')symbolForEvent(context.eventId)?button('探索から再挑戦',adventure,'secondary'):button('この地点に再挑戦',()=>startAdventure(context.eventId),'secondary');button('ホームへ戻る',home,'secondary');status();
}

title();
