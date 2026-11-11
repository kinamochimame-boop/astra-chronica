import {chapterEighteen as chapter} from './data/chapter-eighteen';
import {dialogueChoices} from './data/dialogue-choices';
import {chapterState,chapterCleared,completeEvent,visitLocation} from './adventure';
import {enterMap} from './exploration/exploration-save';
import {save,type Progress} from './save';
import type {Dialogue} from './data/chapter-one';
/** Event receipts are the only ending cursor. No second save format or inferred choices. */
export const endingEvents=chapter.events.slice(chapter.events.findIndex(e=>e.id==='c18-aftermath'));
export const gameCleared=(p:Progress)=>chapterCleared(p.adventure,chapter);
export const endingAvailable=(p:Progress)=>chapterState(p.adventure,chapter).completed.includes('c18-final-boss');
export const nextEndingEvent=(p:Progress)=>endingAvailable(p)?endingEvents.find(e=>!chapterState(p.adventure,chapter).completed.includes(e.id)):undefined;
export function endingPages(p:Progress,id:string):Dialogue[]{
 const e=endingEvents.find(e=>e.id===id);if(!e)return [];const pages=e.pages.map(v=>({...v}));
 if(id==='c18-journey')for(let n=1;n<=17;n++){const chapterId=`chapter-${String(n).padStart(2,'0')}`,choice=[...dialogueChoices].reverse().find(c=>c.chapterId===chapterId&&p.choices[c.id]);const answer=choice?.options.find(o=>o.id===p.choices[choice.id]);if(answer)pages.push({speaker:answer.speaker,text:`第${n}章で選んだ言葉「${answer.label}」。その返事は、今も旅の記録に残っている。`})}
 if(id==='c18-tomorrow')for(const choice of dialogueChoices.filter(c=>c.chapterId==='chapter-18')){const answer=choice.options.find(o=>o.id===p.choices[choice.id]);if(answer)pages.push({speaker:answer.speaker,text:answer.response})}
 return pages;
}
/** Save the draft first. A failed write cannot consume the current scene or change memory. */
export function advanceEnding(p:Progress,id:string,write:(p:Progress)=>boolean=save):{ok:boolean;message:string}{
 if(nextEndingEvent(p)?.id!==id)return {ok:false,message:'この場面はまだ確定できないか、すでに完了しています。'};
 const draft=JSON.parse(JSON.stringify(p)) as Progress,e=nextEndingEvent(draft)!;
 if(!visitLocation(draft.adventure,chapter,e.locationId))return {ok:false,message:'先の場面を完了してください。'};
 const result=completeEvent(draft,chapter,id);if(!result.ok)return result;
 if(id==='c18-clear'&&!enterMap(draft,'final-astral-garden'))return {ok:false,message:'帰還先を確認できません。進行は変更していません。'};
 try{if(!write(draft))return {ok:false,message:'保存できません。同じ場面から保存を再試行できます。'}}catch{return {ok:false,message:'保存できません。同じ場面から保存を再試行できます。'}}
 Object.assign(p,draft);return {ok:true,message:id==='c18-clear'?'クリアデータを保存しました。':'この場面を保存しました。'};
}
