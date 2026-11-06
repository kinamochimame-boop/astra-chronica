import {chapters,type Chapter} from './data/chapter-one';
import {chapterOpen,chapterCleared,chapterState} from './adventure';
import type {Progress} from './save';
export function mountChapterSelection(host:HTMLElement,p:Progress,onSelect:(c:Chapter)=>void,onBack:()=>void){
 host.innerHTML='<p class="eyebrow">CHAPTERS</p><h1>冒険の記録</h1><div class="chapter-list"></div><p class="hint">第8〜18章：今後の更新予定。現在はプレイできません。</p>';
 for(const [i,c] of chapters.entries()){const open=chapterOpen(p.adventure,c),done=chapterCleared(p.adventure,c),started=!!p.adventure.chapters[c.id];const card=document.createElement('article');const title=document.createElement('h2');title.textContent=`第${i+1}章 ${c.name}`;const info=document.createElement('p');info.textContent=!open?`未解放：第${i}章をクリアしてください`:done?'クリア済み':started?`進行中：${chapterState(p.adventure,c).completed.length}イベント完了`:'進行中：未出発';const button=document.createElement('button');button.className='primary';button.dataset.chapterId=c.id;button.disabled=!open;button.textContent=`第${i+1}章へ`;button.onclick=()=>onSelect(c);card.append(title,info,button);host.querySelector('.chapter-list')!.append(card)}
 const back=document.createElement('button');back.className='secondary';back.textContent='ホームへ戻る';back.onclick=onBack;host.append(back);
}
