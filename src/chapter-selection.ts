import {chapters,type Chapter} from './data/chapter-one';
import {chapterOpen,chapterCleared,chapterState} from './adventure';
import type {Progress} from './save';
export function futureChaptersNotice(p?:Progress){
 if(p){const count=chapters.filter(c=>chapterOpen(p.adventure,c)).length;return `全${chapters.length}章を収録。現在選択できるのは${count}章です。${count<chapters.length?'章をクリアすると次の章が解放されます。':'解放済みの章で探索や記録を振り返れます。'}`}
 return chapters.length===17?'第18章：今後の更新予定。現在はプレイできません。':chapters.length<18?`第${chapters.length+1}〜18章：今後の更新予定。現在はプレイできません。`:'全18章の冒険を選択できます。';
}

export function mountChapterSelection(host:HTMLElement,p:Progress,onSelect:(c:Chapter)=>void,onBack:()=>void){
 host.innerHTML=`<p class="eyebrow">CHAPTERS</p><h1>冒険の記録</h1><div class="chapter-list"></div><p class="hint">${futureChaptersNotice(p)}</p>`;
 for(const [i,c] of chapters.entries()){const open=chapterOpen(p.adventure,c),done=chapterCleared(p.adventure,c),started=!!p.adventure.chapters[c.id];const card=document.createElement('article');const title=document.createElement('h2');title.textContent=open?`第${i+1}章 ${c.name}`:`第${i+1}章 未解放`;const info=document.createElement('p');info.textContent=!open?`未解放：第${i}章をクリアしてください`:done?'クリア済み':started?`進行中：${chapterState(p.adventure,c).completed.length}イベント完了`:'進行中：未出発';const button=document.createElement('button');button.className='primary';button.dataset.chapterId=c.id;button.disabled=!open;button.textContent=`第${i+1}章へ`;button.onclick=()=>{if(button.isConnected&&!button.disabled&&chapterOpen(p.adventure,c))onSelect(c)};card.append(title,info,button);host.querySelector('.chapter-list')!.append(card)}
 const back=document.createElement('button');back.className='secondary';back.textContent='ホームへ戻る';back.onclick=()=>{if(back.isConnected)onBack()};host.append(back);
}
