import {chapterOne as chapter,type AdventureEvent} from './data/chapter-one';
import {chapterState,chapterCleared,locationOpen,eventOpen,visitLocation,completeEvent} from './adventure';
import type {Progress} from './save';
import './adventure.css';
export function mountAdventure(host:HTMLElement,p:Progress,persist:()=>boolean,onBattle:(id:string)=>void,onBack:()=>void){
 let dialogue:AdventureEvent|undefined,index=0,notice='';
 const state=()=>chapterState(p.adventure,chapter);
 visitLocation(p.adventure,chapter,state().currentLocationId);if(!persist())notice='保存できません。再読込すると保存前の状態へ戻ります。';
 const store=()=>{if(!persist())notice+=' 保存できません。再読込すると保存前の状態へ戻ります。'};
 function render(){
  const progress=state(),location=chapter.locations.find(l=>l.id===progress.currentLocationId)!,cleared=chapterCleared(p.adventure,chapter);
  host.classList.add('adventure-screen');host.innerHTML=`<p class="eyebrow">CHAPTER 01 · MISTWOOD</p><h1>約束のはじまり</h1><p class="chapter-progress" role="status">${cleared?'第1章クリア済み':`イベント ${progress.completed.length} / ${chapter.events.length}`}</p><nav class="location-list" aria-label="探索地点"></nav><section class="location-scene"><div class="location-icon" aria-hidden="true">${location.icon}</div><h2>${location.name}</h2><p>${location.description}</p></section><section class="adventure-content"></section><p id="adventure-notice" role="status"></p><button id="adventure-home" class="secondary">ホームへ戻る</button>`;
  const get=<T extends HTMLElement=HTMLElement>(q:string)=>host.querySelector<T>(q)!;
  for(const [n,l] of chapter.locations.entries()){
   const open=locationOpen(progress,chapter,l.id),done=chapter.events.filter(e=>e.locationId===l.id).every(e=>progress.completed.includes(e.id));
   const button=document.createElement('button');button.className='location-button';button.dataset.locationId=l.id;button.disabled=!open;button.setAttribute('aria-current',String(l.id===location.id));button.textContent=`${n+1}. ${l.name} ${!open?'🔒 未解放':done?'✓ 完了':'◇ 未完了'}`;
   button.onclick=()=>{if(visitLocation(p.adventure,chapter,l.id)){dialogue=undefined;notice='';store();render()}};get('.location-list').append(button);
  }
  const panel=get('.adventure-content');
  if(dialogue){
   const page=dialogue.pages[index],box=document.createElement('article');box.className='dialogue';box.innerHTML='<p class="dialogue-count"></p><h2 class="dialogue-speaker"></h2><p class="dialogue-text"></p>';
   box.querySelector('.dialogue-count')!.textContent=`${dialogue.name} ｜ ${index+1} / ${dialogue.pages.length}`;box.querySelector('.dialogue-speaker')!.textContent=page.speaker;box.querySelector('.dialogue-text')!.textContent=page.text;
   const next=document.createElement('button');next.className='primary';next.id='dialogue-next';next.textContent=index+1<dialogue.pages.length?'次へ':['battle','boss'].includes(dialogue.kind)?'戦闘を開始':'会話を終える';
   next.onclick=()=>{if(!dialogue)return;if(++index<dialogue.pages.length){render();return}const e=dialogue;dialogue=undefined;index=0;if(['battle','boss'].includes(e.kind)){host.classList.remove('adventure-screen');onBattle(e.id);return}const result=completeEvent(p,chapter,e.id);notice=result.message;if(result.ok)store();render()};box.append(next);panel.append(box);
   const close=document.createElement('button');close.className='secondary';close.textContent='会話を中断して探索へ戻る';close.onclick=()=>{dialogue=undefined;render()};panel.append(close);
  }else{
   if(p.adventure.pending){const pending=document.createElement('p');pending.textContent='中断した戦闘は開始前から再挑戦できます。未確定の経験値や報酬は付与していません。';panel.append(pending)}
   for(const e of chapter.events.filter(e=>e.locationId===location.id)){
    const done=progress.completed.includes(e.id),open=eventOpen(progress,e),card=document.createElement('article');card.className='event-card';card.dataset.eventId=e.id;
    const title=document.createElement('h2');title.textContent=`${e.name} ${done?'✓ 完了':''}`;const detail=document.createElement('p');detail.textContent=done&&['battle','boss','treasure'].includes(e.kind)?'初回の報酬・進行は確定済みです。':e.kind==='rest'?'ここでひと休み。戦闘開始時にはHP・MPが全快します。':e.kind==='boss'?'霧を吸い込む予兆の後は強攻撃。防御と回復で備えましょう。':e.kind==='treasure'?'初回限定の武器を入手できます。':'三人の言葉を聞き、道を進みましょう。';
    const action=document.createElement('button');action.className='primary';action.dataset.eventAction=e.id;action.disabled=!open||(done&&['battle','boss','treasure'].includes(e.kind));action.textContent=!open?'先のイベントを完了してください':done&&['battle','boss','treasure'].includes(e.kind)?'完了済み':e.kind==='treasure'?'宝箱を開ける':e.kind==='rest'?'泉で休む':['battle','boss'].includes(e.kind)?'会話を読んで戦闘へ':done?'会話を読み返す':'物語を読む';action.onclick=()=>{dialogue=e;index=0;notice='';render()};card.append(title,detail,action);panel.append(card);
   }
   const nextLocation=chapter.locations[chapter.locations.findIndex(l=>l.id===location.id)+1];
   if(nextLocation){const button=document.createElement('button');button.className='primary';button.id='adventure-next-location';button.disabled=!locationOpen(progress,chapter,nextLocation.id);button.textContent=`次の地点へ：${nextLocation.name}`;button.onclick=()=>{visitLocation(p.adventure,chapter,nextLocation.id);notice='';store();render()};panel.append(button)}
   if(cleared){const preview=document.createElement('p');preview.className='chapter-preview';preview.textContent=chapter.preview+'（第2章は未実装です）';panel.append(preview)}
  }
  get('#adventure-notice').textContent=notice;
  get('#adventure-home').onclick=()=>{host.classList.remove('adventure-screen');onBack()};
 }
 render();
}
