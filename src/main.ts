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
import Phaser from 'phaser';
import {Battle,heroes,skills,commandsFor,type Unit,type Command,type ActionResult} from './battle';
import {BALANCE} from './balance';
import {load,save} from './save';
import {cloneUnit} from './data/combat';
import {gainExperience,requiredExperience,growUnit} from './progression';
import {mountLab} from './lab';
import {BattleView} from './battle-view';
import {statusSnapshot,statusNotices} from './battle-presentation';
import {Stage} from './visuals';
import './style.css';
import './battle-ui.css';
const app=document.querySelector<HTMLDivElement>('#app')!;
let progress=load(),battle:Battle,selected=0,busy=false;
let command:Command='attack',targetId='',battleSession=0;
let turnTimer:number|undefined;
let battleView:BattleView|undefined;
let actingId:string|undefined,actionRound=1;
let activeChapter:Chapter=chapters.find(c=>c.id===progress.adventure.selectedChapterId)??chapterOne;
let adventureBattle:{serial:number;eventId:string}|undefined;
let screen='title';let storageOK=true;
app.innerHTML=`<div class="shell"><header><span class="sigil">✧</span><span>ASTRA CHRONICA<small>星詠みの遺した約束</small></span><span class="version">PROTOTYPE<br>ver. 1.4</span></header><section id="content"></section><footer>✦ 星の記憶は、あなたとともに。</footer></div>`;
const content=document.querySelector<HTMLElement>('#content')!;
const stage=new Stage();
const game=new Phaser.Game({type:Phaser.AUTO,width:390,height:310,transparent:true,scene:stage,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},banner:false,parent:document.createElement('div')});
const canvasHost=game.config.parent as HTMLElement;canvasHost.className='stage';canvasHost.setAttribute('aria-label','図形で描かれたパーティと戦場');
const resizeStage=()=>{if(!game.isBooted||!canvasHost.clientWidth||!canvasHost.clientHeight)return;const height=Math.round(390*canvasHost.clientHeight/canvasHost.clientWidth);if(game.scale.gameSize.height!==height)game.scale.resize(390,height)};
new ResizeObserver(resizeStage).observe(canvasHost);game.events.once(Phaser.Core.Events.READY,resizeStage);
function persist(){storageOK=save(progress);return storageOK}
function button(label:string,action:()=>void,cls='primary'){const b=document.createElement('button');b.textContent=label;b.className=cls;b.onclick=action;content.append(b);return b}
function partyUnits(){return heroes.map(h=>withSkillTree(equippedUnit(growUnit(cloneUnit(h),progress.party[h.id]),progress.equipment.equipped[h.id as HeroId]),progress.skillTree[h.id as HeroId]))}
function draw(units=partyUnits()){content.append(canvasHost);game.events.emit('stage',units,selected,screen==='battle'?battle.units.findIndex(u=>u.id===targetId):-1)}
function heading(kicker:string,title:string){if(screen!=='battle'){battleView?.dispose();battleView=undefined;}content.classList.remove('result-screen','city-clear','wind-clear','crystal-clear','desert-clear','dawn-clear');content.classList.toggle('in-battle',screen==='battle');content.innerHTML=`<p class="eyebrow">${kicker}</p><h1>${title}</h1>`}
function home(){screen='home';busy=false;heading('STARGAZER’S CAMP','星灯りの野営地');content.insertAdjacentHTML('beforeend',`<p class="intro">失われた星の記憶を、もう一度。</p>`);draw();content.insertAdjacentHTML('beforeend',`<div class="names">${heroes.map(h=>`<span>${h.name}<small>${h.role} Lv.${progress.party[h.id].level}</small></span>`).join('')}</div><article><span class="eyebrow">CHAPTER 01 · PROLOGUE</span><h2>約束のはじまり</h2><p>「星が消えても、約束は消えない」<br>星詠みの言葉を胸に、三人は霧の森へ踏み出す。</p></article><div class="stats">戦闘 ${progress.battles}回 <span>勝利 ${progress.wins}回</span></div><p class="hint">所持品：星露の小瓶 ${progress.consumables.potion}個 ／ 灯火の雫 ${progress.consumables.ether}個</p>`);
 button('冒険へ出発',adventure);button('章選択',chapterSelection,'secondary');button('サブクエスト',()=>showQuests(home),'secondary');button('探索記録',()=>showRecords(home),'secondary');button('冒険手帳',()=>showJournal(home),'secondary');button('戦闘開始　→',start);button('編成を見る',formation,'secondary');button('スキルツリー',()=>{screen='skill-tree';mountSkillTree(content,progress,persist,home)},'secondary');button('装備',()=>{screen='equipment';mountEquipment(content,progress,persist,home)},'secondary');button('戦闘基盤テスト（保存なし）',()=>{cancelTurn();screen='lab';mountLab(content,home)},'secondary');button('タイトルへ',title,'text-button');status();}
function status(){content.insertAdjacentHTML('beforeend',`<p class="save-note">${storageOK?'進行はこのブラウザに自動保存されます':'保存できません。現在のプレイは続行できます'}</p>`)}
function title(){screen='title';heading('A PROMISE WRITTEN IN THE STARS','アストラ<br>クロニカ');content.insertAdjacentHTML('beforeend','<p class="subtitle">〜星詠みの遺した約束〜</p>');draw();content.insertAdjacentHTML('beforeend','<p class="prologue">あの日、星に誓った。<br>もう一度、君と夜明けを見ると。</p>');button(progress.started?'ゲーム開始 · 続きから':'ゲーム開始',()=>{progress.started=true;persist();home()});status()}
function formation(){screen='formation';heading('PARTY','旅の仲間');draw();content.insertAdjacentHTML('beforeend',`<article><p>編成は仮画面です。三人の役割は固定です。</p>${partyUnits().map(h=>`<h2>${h.name} Lv.${h.level} <small>${h.role}</small></h2><p>使用武器：${h.weapons.join('／')}<br>HP ${h.maxHp} · MP ${h.maxMp}<br>攻撃力 ${h.attack} · 防御力 ${h.defense} · 素早さ ${h.speed}</p>`).join('')}<p>武器はホームの「装備」から変更できます。</p></article>`);button('ホームへ戻る',home)}
function cancelTurn(){battleSession++;if(turnTimer!==undefined)window.clearTimeout(turnTimer);turnTimer=undefined}
function showQuests(back:()=>void){cancelTurn();screen='quests';heading('QUESTS','サブクエスト');mountSideQuests(content,progress,persist,back)}
function showRecords(back:()=>void){cancelTurn();screen='records';heading('RECORDS','探索記録');mountExplorationRecords(content,progress,back,back===home?'ホームへ戻る':'探索へ戻る')}
function showJournal(back:()=>void){cancelTurn();screen='journal';heading('JOURNAL','冒険手帳');mountJournal(content,progress,back,back===home?'ホームへ戻る':'探索へ戻る')}
function chapterSelection(){cancelTurn();screen='chapters';heading('CHAPTERS','冒険の記録');mountChapterSelection(content,progress,selectChapter,home)}
function selectChapter(c:Chapter){activeChapter=c;progress.adventure.selectedChapterId=c.id;persist();adventure()}
function adventure(){cancelTurn();screen='adventure';heading('ADVENTURE',activeChapter.name);mountAdventure(content,progress,persist,startAdventure,home,activeChapter,selectChapter,()=>showQuests(adventure),()=>showRecords(adventure),()=>showJournal(adventure))}
function startAdventure(eventId:string){const e=activeChapter.events.find(e=>e.id===eventId);const serial=beginAdventureBattle(progress,activeChapter,eventId);if(serial===undefined||!e?.encounter){adventure();return}adventureBattle={serial,eventId};persist();launchBattle(encounterSetup(e.encounter))}
function start(){adventureBattle=undefined;launchBattle()}
function launchBattle(setup?:BattleSetup){cancelTurn();battleView?.dispose();battleView=undefined;actingId=undefined;battle=new Battle(Math.random,progress.party,undefined,progress.equipment,setup,progress.skillTree,progress.consumables);selected=0;busy=false;command='attack';targetId=battle.enemies[0].id;screen='battle';renderBattle();scheduleEnemy()}
function chooseCommand(next:Command){
 if(busy||!battle.current)return;
 command=next;if(skills[command].target==='allAllies'){targetId='all-allies';renderBattle();return}
 const targets=battle.targets(command);
 targetId=targets.some(u=>u.id===targetId)?targetId:(command==='heal'?targets.find(u=>u.hp<u.maxHp)?.id:undefined)||targets[0]?.id||'';
 renderBattle();
}
function renderBattle(){
 if(!battleView){
  battleView=new BattleView(content,canvasHost,{
   choose:chooseCommand,
   target:id=>{if(!busy&&skills[command].target!=='allAllies'&&battle.targets(command).some(u=>u.id===id)){targetId=id;renderBattle()}},
   execute:()=>{
    if(busy||screen!=='battle'||battle.phase!=='player'||!battle.current)return;
    const before=statusSnapshot(battle.units),round=battle.round;
    perform(battle.act(command,targetId,battle.current.id),before,round);
   },
   retreat:()=>finish('defeat'),
  });
 }
 if(!busy)selected=battle.units.findIndex(u=>u.id===battle.current?.id);
 battleView.update({battle,command,targetId,busy,actingId,actionRound});
 game.events.emit('stage',battle.units,selected,battle.units.findIndex(u=>u.id===targetId),skills[command].target==='allAllies'?battle.allies.filter(u=>u.hp>0).map(u=>u.id):[]);
}
game.events.on('unit-tap',(id:string)=>{if(screen==='battle'&&!busy&&skills[command].target!=='allAllies'&&battle.targets(command).some(u=>u.id===id)){targetId=id;renderBattle()}});
function perform(result:ActionResult,before:ReturnType<typeof statusSnapshot>,round:number){
 if(screen!=='battle'||busy)return;
 if(!result.ok){battle.log.push(result.reason);renderBattle();return}
 busy=true;
 const event=result.event;if(isItem(event.command)){progress.consumables=battle.itemInventory();persist()}actingId=event.actor;actionRound=round;
 selected=battle.units.findIndex(u=>u.id===event.actor);
 renderBattle();game.events.emit('battle-effect',event);battleView!.present(event,statusNotices(before,battle.units));
 const session=battleSession;
 turnTimer=window.setTimeout(()=>{
  if(session!==battleSession||screen!=='battle')return;
  busy=false;battleView?.clearEffects();actingId=undefined;
  if(battle.result){finish(battle.result);return}
  command='attack';targetId=battle.enemies.find(e=>e.hp>0)?.id||'';
  renderBattle();scheduleEnemy();
 },BALANCE.animationMs);
}
function scheduleEnemy(){
 if(screen!=='battle'||busy||(battle.phase!=='enemy'&&!battle.blocked))return;
 const session=battleSession,actor=battle.current!.id;
 turnTimer=window.setTimeout(()=>{if(session!==battleSession||screen!=='battle'||busy)return;const before=statusSnapshot(battle.units),round=battle.round;perform(battle.blocked?battle.skipTurn():battle.enemyAct(actor),before,round)},450);
}
function finish(result:'victory'|'defeat'){if(adventureBattle){finishAdventure(result);return}finishRegular(result)}
function finishRegular(result:'victory'|'defeat'){if(screen!=='battle')return;cancelTurn();battle.resetBattleResources();screen='result';busy=false;progress.battles++;let rewardText='';if(result==='victory'){progress.wins++;const xp=battle.experienceReward;rewardText=`一人につき経験値 ${xp} 獲得。<br>`+battle.allies.map(h=>{const p=progress.party[h.id];const levels=gainExperience(p,xp);return `${h.name} Lv.${p.level}${levels?`（${levels}レベルアップ！）`:''} EXP ${p.experience}/${requiredExperience(p.level)}`}).join('<br>')}persist();heading(result==='victory'?'VICTORY':'DEFEAT',result==='victory'?'星明かりの勝利':'まだ、旅は終わらない');draw(battle.allies);content.classList.add('result-screen');content.insertAdjacentHTML('beforeend',`<article><h2>${result==='victory'?'約束へ、一歩。':'もう一度、星を見上げて。'}</h2><p>${result==='victory'?'アステルたちは霧を払い、森の奥に小さな星の欠片を見つけた。':'三人は野営地に戻り、次の旅に備える。'}</p><p>${rewardText}</p><p>累計勝利 ${progress.wins}回</p></article>`);button('ホームへ戻る',home);button('もう一度挑む',start,'secondary');status()}
function finishAdventure(result:'victory'|'defeat'){
 if(screen!=='battle'||!adventureBattle)return;
 const context=adventureBattle;cancelTurn();battle.resetBattleResources();screen='result';busy=false;
 const settled=resolveAdventureBattle(progress,context.serial,result);persist();
 heading(settled.cleared?'CHAPTER CLEAR':result==='victory'?'VICTORY':'RETRY',settled.cleared?`第${chapters.indexOf(activeChapter)+1}章クリア`:result==='victory'?(activeChapter.id===chapterOne.id?'霧の先へ、一歩':activeChapter.id==='chapter-02'?'灰の先へ、一歩':activeChapter.id==='chapter-03'?'風の先へ、一歩':activeChapter.id==='chapter-04'?'歌の先へ、一歩':activeChapter.id==='chapter-05'?'砂の先へ、一歩':'朝の先へ、一歩'):'野営地で立て直そう');draw(battle.allies);content.classList.add('result-screen');
 const text=document.createElement('article');const message=document.createElement('p');message.textContent=result==='victory'?`一人につき経験値 ${settled.xp} 獲得。`:'地点は未クリアのままです。装備を整え、もう一度挑戦できます。';text.append(message);
 if(result==='victory')for(const hero of battle.allies){const line=document.createElement('p');line.textContent=`${hero.name} Lv.${progress.party[hero.id].level}${settled.levels[hero.id]?'（レベルアップ！）':''}`;text.append(line)}
 if(settled.cleared){const line=document.createElement('p');line.textContent=(activeChapter.id===chapterOne.id?'守護獣は静かに眠り、森の霧が晴れていく。':activeChapter.id==='chapter-02'?'鐘が静まり、星図が街へ戻った。灯火のロッドを入手した。':activeChapter.id==='chapter-03'?'風路がつながり、空渡りの道が戻った。星風のワンドを入手した。':activeChapter.id==='chapter-04'?'セレナ「歌が変わり、人々が目覚め始めました。一人ずつ声を聞きに行きます」。月晶のロッドを入手した。':activeChapter.id==='chapter-05'?'ザイラ「星砂は王都と砂海の両方へ流れた」。嵐が収まり、商隊が帰り始めた。蜃気楼のワンドを入手した。':'エイルがミラと再会し、クロノリアに次の朝が来た。ルシエルは記録を守り、旅の続きを託す。暁晶のロッドを入手した。')+activeChapter.preview;text.append(line)}
 if(settled.cleared&&activeChapter.id==='chapter-02')content.classList.add('city-clear');if(settled.cleared&&activeChapter.id==='chapter-03')content.classList.add('wind-clear');if(settled.cleared&&activeChapter.id==='chapter-04')content.classList.add('crystal-clear');if(settled.cleared&&activeChapter.id==='chapter-05')content.classList.add('desert-clear');if(settled.cleared&&activeChapter.id==='chapter-06')content.classList.add('dawn-clear');content.append(text);button('冒険へ戻る',adventure);if(result==='defeat')button('この地点に再挑戦',()=>startAdventure(context.eventId),'secondary');button('ホームへ戻る',home,'secondary');status();
}

title();
