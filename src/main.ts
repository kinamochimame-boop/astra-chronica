import Phaser from 'phaser';
import {Battle,heroes,skills,commandsFor,type Unit,type Command,type ActionResult} from './battle';
import {BALANCE} from './balance';
import {load,save} from './save';
import {Stage} from './visuals';
import './style.css';
const app=document.querySelector<HTMLDivElement>('#app')!;
let progress=load(),battle:Battle,selected=0,busy=false;
let command:Command='attack',targetId='',battleSession=0;
let turnTimer:number|undefined;
let screen='title';let storageOK=true;
app.innerHTML=`<div class="shell"><header><span class="sigil">✧</span><span>ASTRA CHRONICA<small>星詠みの遺した約束</small></span><span class="version">PROTOTYPE<br>ver. 0.2</span></header><section id="content"></section><footer>✦ 星の記憶は、あなたとともに。</footer></div>`;
const content=document.querySelector<HTMLElement>('#content')!;
const stage=new Stage();
const game=new Phaser.Game({type:Phaser.AUTO,width:390,height:310,transparent:true,scene:stage,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},banner:false,parent:document.createElement('div')});
const canvasHost=game.config.parent as HTMLElement;canvasHost.className='stage';canvasHost.setAttribute('aria-label','図形で描かれたパーティと戦場');
function persist(){storageOK=save(progress)}
function button(label:string,action:()=>void,cls='primary'){const b=document.createElement('button');b.textContent=label;b.className=cls;b.onclick=action;content.append(b);return b}
function draw(units=heroes){content.append(canvasHost);game.events.emit('stage',units,selected,screen==='battle'?battle.units.findIndex(u=>u.id===targetId):-1)}
function heading(kicker:string,title:string){content.classList.remove('result-screen');content.classList.toggle('in-battle',screen==='battle');content.innerHTML=`<p class="eyebrow">${kicker}</p><h1>${title}</h1>`}
function home(){screen='home';busy=false;heading('STARGAZER’S CAMP','星灯りの野営地');content.insertAdjacentHTML('beforeend',`<p class="intro">失われた星の記憶を、もう一度。</p>`);draw();content.insertAdjacentHTML('beforeend',`<div class="names">${heroes.map(h=>`<span>${h.name}<small>${h.role}</small></span>`).join('')}</div><article><span class="eyebrow">CHAPTER 01 · PROLOGUE</span><h2>約束のはじまり</h2><p>「星が消えても、約束は消えない」<br>星詠みの言葉を胸に、三人は霧の森へ踏み出す。</p></article><div class="stats">戦闘 ${progress.battles}回 <span>勝利 ${progress.wins}回</span></div>`);
 button('戦闘開始　→',start);button('編成を見る',formation,'secondary');button('タイトルへ',title,'text-button');status();}
function status(){content.insertAdjacentHTML('beforeend',`<p class="save-note">${storageOK?'進行はこのブラウザに自動保存されます':'保存できません。現在のプレイは続行できます'}</p>`)}
function title(){screen='title';heading('A PROMISE WRITTEN IN THE STARS','アストラ<br>クロニカ');content.insertAdjacentHTML('beforeend','<p class="subtitle">〜星詠みの遺した約束〜</p>');draw();content.insertAdjacentHTML('beforeend','<p class="prologue">あの日、星に誓った。<br>もう一度、君と夜明けを見ると。</p>');button(progress.started?'ゲーム開始 · 続きから':'ゲーム開始',()=>{progress.started=true;persist();home()});status()}
function formation(){screen='formation';heading('PARTY','旅の仲間');draw();content.insertAdjacentHTML('beforeend',`<article><p>編成は仮画面です。三人の役割は固定です。</p>${heroes.map(h=>`<h2>${h.name} <small>${h.role}</small></h2><p>使用武器：${h.weapons.join('／')}<br>HP ${h.maxHp} · 攻撃力 ${h.attack}</p>`).join('')}<p>武器の変更機能は未実装です。</p></article>`);button('ホームへ戻る',home)}
function cancelTurn(){battleSession++;if(turnTimer!==undefined)window.clearTimeout(turnTimer);turnTimer=undefined}
function start(){cancelTurn();battle=new Battle();selected=0;busy=false;command='attack';targetId=battle.enemies[0].id;screen='battle';renderBattle();scheduleEnemy()}
function hp(u:Unit){return `<div class="hp"><i style="width:${u.hp/u.maxHp*100}%"></i></div><small>HP ${u.hp} / ${u.maxHp}</small>`}
function mp(u:Unit){return `<div class="hp mp"><i style="width:${u.mp/u.maxMp*100}%"></i></div><small>MP ${u.mp} / ${u.maxMp}</small>`}
function chooseCommand(next:Command){command=next;const targets=battle.targets(command);targetId=targets.some(u=>u.id===targetId)?targetId:targets[0]?.id||'';renderBattle()}
function renderBattle(){
 const current=busy?battle.units[selected]:battle.current;
 if(!current)return;
 if(!busy)selected=battle.units.indexOf(current);
 heading(`MISTWOOD · ROUND ${battle.round}`,'霧の森の遭遇');
 content.insertAdjacentHTML('beforeend',`<div class="turn-banner" role="status">${busy?'行動中':battle.phase==='enemy'?'敵の行動':'コマンドを選択'}：<strong>${busy?battle.units[selected]?.name:current.name}</strong></div><p class="turn-order">次の行動：${(busy&&battle.current?[battle.current,...battle.upcoming].slice(0,6):battle.upcoming).map(u=>u.name).join(' → ')||'戦闘終了'}</p>`);
 const selecting=battle.phase==='player'&&!busy;
 const validTargets=selecting?battle.targets(command):[];
 const enemies=document.createElement('div');enemies.className='enemies';
 battle.enemies.forEach(e=>{const b=document.createElement('button');b.className=`enemy ${targetId===e.id?'selected':''}`;b.disabled=!validTargets.includes(e);b.setAttribute('aria-pressed',String(targetId===e.id));b.innerHTML=`${e.name}${hp(e)}`;b.onclick=()=>{targetId=e.id;renderBattle()};enemies.append(b)});content.append(enemies);
 draw([...battle.allies,...battle.enemies]);
 content.insertAdjacentHTML('beforeend',`<div class="battle-log" role="log" aria-live="polite">${battle.log.slice(-3).join('<br>')}</div><details class="log-history"><summary>戦闘ログを開く</summary><div>${battle.log.join('<br>')}</div></details>`);
 const controls=document.createElement('div');controls.className='battle-controls';content.append(controls);
 const party=document.createElement('div');party.className='party';
 battle.allies.forEach(a=>{const b=document.createElement('button');b.className=`ally ${targetId===a.id?'selected':''} ${current===a?'acting':''}`;b.disabled=!validTargets.includes(a);b.setAttribute('aria-pressed',String(targetId===a.id));b.innerHTML=`<strong>${a.name}</strong><span>${a.role}</span>${hp(a)}${mp(a)}<em>${a.hp===0?'戦闘不能':a.guarding==='guard'?'ガード中':a.guarding?'防御中':a.covering?'かばう中':current===a?'行動中':'待機中'}</em>`;b.onclick=()=>{targetId=a.id;renderBattle()};party.append(b)});controls.append(party);
 const commands=document.createElement('div');commands.className='commands';controls.append(commands);
 if(battle.phase==='player')commandsFor(current).forEach(c=>{const skill=skills[c];const b=document.createElement('button');b.className=`command ${command===c?'selected':''}`;b.textContent=`${skill.name}${skill.cost?` MP${skill.cost}`:''}`;b.disabled=busy||!battle.canUse(c);b.setAttribute('aria-pressed',String(command===c));b.onclick=()=>chooseCommand(c);commands.append(b)});
 const info=document.createElement('p');info.className='hint';info.textContent=selecting?`${skills[command].description}。対象：${battle.units.find(u=>u.id===targetId)?.name||'選択してください'}`:'敵の行動を待っています…';controls.append(info);
 const attack=document.createElement('button');attack.className='primary';attack.textContent=selecting?`${skills[command].name}を実行`:'行動中…';attack.disabled=!selecting||!battle.canUse(command)||!validTargets.some(u=>u.id===targetId)||(command==='heal'&&battle.allies.some(u=>u.id===targetId&&u.hp===u.maxHp));
 attack.onclick=()=>{if(!busy&&screen==='battle')perform(battle.act(command,targetId,current.id))};controls.append(attack);
 button('撤退する（敗北）',()=>finish('defeat'),'text-button');
}
function perform(result:ActionResult){
 if(screen!=='battle'||busy)return;
 if(!result.ok){battle.log.push(result.reason);renderBattle();return}
 busy=true;
 const event=result.event;
 selected=battle.units.findIndex(u=>u.id===event.actor);
 renderBattle();game.events.emit('battle-effect',event);
 const session=battleSession;
 turnTimer=window.setTimeout(()=>{
  if(session!==battleSession||screen!=='battle')return;
  busy=false;
  if(battle.result){finish(battle.result);return}
  command='attack';targetId=battle.enemies.find(e=>e.hp>0)?.id||'';
  renderBattle();scheduleEnemy();
 },BALANCE.animationMs);
}
function scheduleEnemy(){
 if(screen!=='battle'||busy||battle.phase!=='enemy')return;
 const session=battleSession,actor=battle.current!.id;
 turnTimer=window.setTimeout(()=>{if(session!==battleSession||screen!=='battle'||busy)return;perform(battle.enemyAct(actor))},450);
}
function finish(result:'victory'|'defeat'){if(screen!=='battle')return;cancelTurn();screen='result';busy=false;progress.battles++;if(result==='victory')progress.wins++;persist();heading(result==='victory'?'VICTORY':'DEFEAT',result==='victory'?'星明かりの勝利':'まだ、旅は終わらない');draw(battle.allies);content.classList.add('result-screen');content.insertAdjacentHTML('beforeend',`<article><h2>${result==='victory'?'約束へ、一歩。':'もう一度、星を見上げて。'}</h2><p>${result==='victory'?'アステルたちは霧を払い、森の奥に小さな星の欠片を見つけた。':'三人は野営地に戻り、次の旅に備える。'}</p><p>累計勝利 ${progress.wins}回</p></article>`);button('ホームへ戻る',home);button('もう一度挑む',start,'secondary');status()}
title();
