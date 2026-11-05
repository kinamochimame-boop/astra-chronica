import {journalEntries} from './data/journal';
import {dialogueChoices} from './data/dialogue-choices';
import {chapters,type Chapter} from './data/chapter-one';
import {chapterState,chapterCleared,chapterOpen} from './adventure';
import type {Progress} from './save';
/** Derived from confirmed events only. Never infer entries from level, location or unlock. */
export function journalFor(p:Progress,c:Chapter){const done=chapterState(p.adventure,c).completed;return {entries:journalEntries.filter(e=>e.chapterId===c.id&&done.includes(e.eventId)),choices:dialogueChoices.filter(d=>d.chapterId===c.id&&done.includes(d.eventId)&&p.choices[d.id]).map(d=>({name:d.name,option:d.options.find(o=>o.id===p.choices[d.id])!})),cleared:chapterCleared(p.adventure,c)}}
export function mountJournal(host:HTMLElement,p:Progress,onBack:()=>void,backLabel='ホームへ戻る'){
 host.classList.add('journal-screen');host.innerHTML='<p class="eyebrow">ADVENTURE JOURNAL</p><h1>冒険手帳</h1><p class="hint">物語と選んだ言葉を振り返ります。未到達の記録は表示しません。探索達成率は「探索記録」で確認できます。</p>';
 for(const c of chapters){const data=journalFor(p,c),card=document.createElement('article');card.dataset.journalChapter=c.id;const title=document.createElement('h2');title.textContent=`${c.name}：${data.cleared?'クリア済み':chapterOpen(p.adventure,c)?'冒険中':'未解放'}`;card.append(title);
  if(!data.entries.length){const hint=document.createElement('p');hint.textContent='まだ確認できる記録はありません。';card.append(hint)}
  for(const entry of data.entries){const h=document.createElement('h3');h.textContent=`${entry.kind==='npc'?'人物':entry.kind==='record'?'星詠みの記録':'あらすじ'}：${entry.title}`;const text=document.createElement('p');text.dataset.journalEntry=entry.id;text.textContent=entry.text;card.append(h,text)}
  for(const choice of data.choices){const h=document.createElement('h3');h.textContent=`会話選択：${choice.name}`;const text=document.createElement('p');text.textContent=`${choice.option.label} ／ ${choice.option.response}`;card.append(h,text)}host.append(card);
 }const back=document.createElement('button');back.className='secondary';back.textContent=backLabel;back.onclick=()=>{host.classList.remove('journal-screen');onBack()};host.append(back);
}
