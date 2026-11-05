import {dialogueChoices} from './data/dialogue-choices';
import {chapters} from './data/chapter-one';
import {chapterOpen,chapterState,eventOpen,type AdventureProgress} from './adventure';
import type {Progress} from './save';
export type ChoiceRecords=Record<string,string>;
export function normalizeChoices(raw:unknown,adventure:AdventureProgress):ChoiceRecords {
 const result:ChoiceRecords={},source=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw as Record<string,unknown>:{};
 for(const choice of dialogueChoices){const c=chapters.find(c=>c.id===choice.chapterId)!,e=c.events.find(e=>e.id===choice.eventId)!;
  if(chapterOpen(adventure,c)&&eventOpen(chapterState(adventure,c),e)&&choice.options.some(o=>o.id===source[choice.id]))result[choice.id]=source[choice.id] as string;
 }return result;
}
/** First valid selection wins; a replay cannot silently replace it. */
export function recordChoice(p:Progress,id:string,optionId:string):boolean {
 const choice=dialogueChoices.find(c=>c.id===id);if(!choice||p.choices[id]||!choice.options.some(o=>o.id===optionId))return false;
 const c=chapters.find(c=>c.id===choice.chapterId)!,e=c.events.find(e=>e.id===choice.eventId)!,state=chapterState(p.adventure,c);
 if(!chapterOpen(p.adventure,c)||!eventOpen(state,e)||state.currentLocationId!==e.locationId)return false;
 p.choices[id]=optionId;return true;
}
