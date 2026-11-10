import type {Progress} from './save';
import {endingEvents,endingPages,nextEndingEvent,advanceEnding,gameCleared} from './ending';
import './ending.css';
/** One mounted presenter, one synchronous commit per scene; replay is entirely read-only. */
export function mountEnding(host:HTMLElement,p:Progress,onReturn:()=>void,write:(p:Progress)=>boolean,replay=false,onExplore=onReturn){
 let replayIndex=0,page=0,notice='',disposed=false,locked=false,frame=0;
 const current=()=>replay?endingEvents[replayIndex]:nextEndingEvent(p);
 function render(){if(disposed)return;const e=current();host.classList.add('ending-screen');host.replaceChildren();
  if(!e){host.dataset.endingEvent='completed';const h=document.createElement('h1');h.textContent='THE END';const text=document.createElement('p');text.textContent=replay?'エンディングの再生を終えました。':'クリアデータを保存しました。解放済みの場所で探索や依頼を続けられます。';const b=document.createElement('button');b.className='primary';b.id='ending-return';b.textContent='クリア後の探索へ';b.onclick=()=>{if(!disposed)onExplore()};host.append(h,text,b);return}
  const pages=endingPages(p,e.id),line=pages[page];host.dataset.endingEvent=e.id;host.dataset.endingPage=String(page);host.dataset.endingReplay=String(replay);
  const kicker=document.createElement('p');kicker.className='eyebrow';kicker.textContent=e.id==='c18-credits'?'STAFF ROLL':e.id==='c18-the-end'?'THE END':'星詠みの遺した約束';const title=document.createElement('h1');title.textContent=e.name;
  const box=document.createElement('article');box.className=e.id==='c18-credits'?'ending-dialogue credits-list':'ending-dialogue';const speaker=document.createElement('h2');speaker.textContent=line.speaker;const text=document.createElement('p');text.id='ending-text';text.textContent=line.text;const count=document.createElement('p');count.className='hint';count.textContent=`${replay?'再生：保存データは変更しません。':'場面の完了ごとに保存します。'} ${page+1} / ${pages.length}`;box.append(speaker,text,count);
  const stars=document.createElement('div');stars.className='ending-stars';stars.innerHTML='<svg viewBox="0 0 320 64" role="img" aria-label="記録を残し、三つの星からそれぞれの未来へ道が開く"><path d="M40 48 L110 32 L160 48 L210 32 L280 48 M110 32 L90 8 M210 32 L230 8 M160 48 L160 8" fill="none" stroke="#e9ca81" stroke-width="2"/><g fill="#fff0b9"><circle cx="40" cy="48" r="4"/><circle cx="160" cy="48" r="5"/><circle cx="280" cy="48" r="4"/><circle cx="90" cy="8" r="3"/><circle cx="160" cy="8" r="3"/><circle cx="230" cy="8" r="3"/></g></svg>';
  const next=document.createElement('button');next.className='primary';next.id='ending-next';next.textContent=page+1<pages.length?'次へ':e.id==='c18-clear'&&!replay?'クリアデータを保存':e.id==='c18-the-end'?'クリアデータへ':'次の場面へ';
  const step=(skip=false)=>{if(disposed||locked||current()?.id!==e.id)return;locked=true;
   if(!skip&&page+1<pages.length)page++;else if(replay){replayIndex++;page=0}else {const result=advanceEnding(p,e.id,write);notice=result.message;if(result.ok)page=0}
   render();frame=requestAnimationFrame(()=>{locked=false});};next.onclick=()=>step();host.append(kicker,title,stars,box,next);
  if(e.id==='c18-credits'){const skip=document.createElement('button');skip.id='credits-skip';skip.className='secondary';skip.textContent='スタッフロールをスキップ';skip.onclick=()=>step(true);host.append(skip)}
  const status=document.createElement('p');status.id='ending-notice';status.setAttribute('role','status');status.textContent=notice;const pause=document.createElement('button');pause.className='secondary';pause.id='ending-pause';pause.textContent='中断してホームへ';pause.onclick=()=>{if(!disposed)onReturn()};host.append(status,pause);
 }
 render();return ()=>{disposed=true;cancelAnimationFrame(frame);host.classList.remove('ending-screen');delete host.dataset.endingEvent;delete host.dataset.endingPage;delete host.dataset.endingReplay};
}
