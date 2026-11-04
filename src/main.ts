import Phaser from 'phaser';
import {Battle,heroes,type Unit} from './battle';
import {load,save} from './save';
import {Stage} from './visuals';
import './style.css';
const app=document.querySelector<HTMLDivElement>('#app')!;
let progress=load(),battle:Battle,selected=0,target=0,busy=false;
let screen='title';let messages:string[]=[];let storageOK=true;
app.innerHTML=`<div class="shell"><header><span class="sigil">✧</span><span>ASTRA CHRONICA<small>星詠みの遺した約束</small></span><span class="version">PROTOTYPE<br>ver. 0.1</span></header><section id="content"></section><footer>✦ 星の記憶は、あなたとともに。</footer></div>`;
const content=document.querySelector<HTMLElement>('#content')!;
const stage=new Stage();
const game=new Phaser.Game({type:Phaser.AUTO,width:390,height:310,transparent:true,scene:stage,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},banner:false,parent:document.createElement('div')});
const canvasHost=game.config.parent as HTMLElement;canvasHost.className='stage';canvasHost.setAttribute('aria-label','図形で描かれたパーティと戦場');
function persist(){storageOK=save(progress)}
function button(label:string,action:()=>void,cls='primary'){const b=document.createElement('button');b.textContent=label;b.className=cls;b.onclick=action;content.append(b);return b}
function draw(units=heroes){content.append(canvasHost);game.events.emit('stage',units,selected,screen==='battle'?target+3:-1)}
function heading(kicker:string,title:string){content.innerHTML=`<p class="eyebrow">${kicker}</p><h1>${title}</h1>`}
function home(){screen='home';busy=false;heading('STARGAZER’S CAMP','星灯りの野営地');content.insertAdjacentHTML('beforeend',`<p class="intro">失われた星の記憶を、もう一度。</p>`);draw();content.insertAdjacentHTML('beforeend',`<div class="names">${heroes.map(h=>`<span>${h.name}<small>${h.role}</small></span>`).join('')}</div><article><span class="eyebrow">CHAPTER 01 · PROLOGUE</span><h2>約束のはじまり</h2><p>「星が消えても、約束は消えない」<br>星詠みの言葉を胸に、三人は霧の森へ踏み出す。</p></article><div class="stats">戦闘 ${progress.battles}回 <span>勝利 ${progress.wins}回</span></div>`);
 button('戦闘開始　→',start);button('編成を見る',formation,'secondary');button('タイトルへ',title,'text-button');status();}
function status(){content.insertAdjacentHTML('beforeend',`<p class="save-note">${storageOK?'進行はこのブラウザに自動保存されます':'保存できません。現在のプレイは続行できます'}</p>`)}
function title(){screen='title';heading('A PROMISE WRITTEN IN THE STARS','アストラ<br>クロニカ');content.insertAdjacentHTML('beforeend','<p class="subtitle">〜星詠みの遺した約束〜</p>');draw();content.insertAdjacentHTML('beforeend','<p class="prologue">あの日、星に誓った。<br>もう一度、君と夜明けを見ると。</p>');button(progress.started?'ゲーム開始 · 続きから':'ゲーム開始',()=>{progress.started=true;persist();home()});status()}
function formation(){screen='formation';heading('PARTY','旅の仲間');draw();content.insertAdjacentHTML('beforeend',`<article><p>編成は仮画面です。三人の役割は固定です。</p>${heroes.map(h=>`<h2>${h.name} <small>${h.role}</small></h2><p>使用武器：${h.weapons.join('／')}<br>HP ${h.maxHp} · 攻撃力 ${h.attack}</p>`).join('')}<p>武器の変更機能は未実装です。</p></article>`);button('ホームへ戻る',home)}
function start(){battle=new Battle();selected=0;target=0;busy=false;messages=['霧の森で、三体の魔物が立ちはだかった。'];screen='battle';renderBattle()}
function hp(u:Unit){return `<div class="hp"><i style="width:${u.hp/u.maxHp*100}%"></i></div><small>HP ${u.hp} / ${u.maxHp}</small>`}
function renderBattle(){
 heading(`MISTWOOD · TURN ${battle.round}`,'霧の森の遭遇');
 const enemies=document.createElement('div');enemies.className='enemies';battle.enemies.forEach((e,i)=>{const b=document.createElement('button');b.className=`enemy ${i===target?'selected':''}`;b.disabled=e.hp===0||busy;b.innerHTML=`${e.name}${hp(e)}`;b.onclick=()=>{target=i;renderBattle()};enemies.append(b)});content.append(enemies);
 draw([...battle.allies,...battle.enemies]);
 content.insertAdjacentHTML('beforeend',`<div class="battle-log" role="status" aria-live="polite">${messages.slice(-3).join('<br>')}</div><p class="hint">味方と敵を選択 → 攻撃。三人の行動後、敵のターン。</p>`);
 const party=document.createElement('div');party.className='party';battle.allies.forEach((a,i)=>{const b=document.createElement('button');b.className=`ally ${selected===i?'selected':''}`;b.disabled=busy||a.hp===0||battle.used.has(i);b.innerHTML=`<strong>${a.name}</strong><span>${a.role}</span>${hp(a)}<em>${a.hp===0?'戦闘不能':battle.used.has(i)?'行動済み':'行動可能'}</em>`;b.onclick=()=>{selected=i;renderBattle()};party.append(b)});content.append(party);
 const attack=button(busy?'敵のターン…':`${battle.allies[selected].name}で攻撃`,act);attack.disabled=busy||battle.used.has(selected)||battle.allies[selected].hp===0;
 button('撤退する（敗北）',()=>finish('defeat'),'text-button');
}
function act(){if(busy)return;const logs=battle.attack(selected,target);if(!logs.length)return;messages=logs;if(battle.result){finish(battle.result);return}
 if(battle.enemies[target].hp===0)target=battle.enemies.findIndex(e=>e.hp>0);
 if(battle.turnComplete){busy=true;renderBattle();window.setTimeout(()=>{if(screen!=='battle')return;messages=battle.enemyTurn();busy=false;if(battle.result){finish(battle.result);return}selected=battle.allies.findIndex(a=>a.hp>0);renderBattle()},650)}else{selected=battle.allies.findIndex((a,i)=>a.hp>0&&!battle.used.has(i));renderBattle()}}
function finish(result:'victory'|'defeat'){screen='result';busy=false;progress.battles++;if(result==='victory')progress.wins++;persist();heading(result==='victory'?'VICTORY':'DEFEAT',result==='victory'?'星明かりの勝利':'まだ、旅は終わらない');draw(battle.allies);content.insertAdjacentHTML('beforeend',`<article><h2>${result==='victory'?'約束へ、一歩。':'もう一度、星を見上げて。'}</h2><p>${result==='victory'?'アステルたちは霧を払い、森の奥に小さな星の欠片を見つけた。':'三人は野営地に戻り、次の旅に備える。'}</p><p>累計勝利 ${progress.wins}回</p></article>`);button('ホームへ戻る',home);button('もう一度挑む',start,'secondary');status()}
title();
