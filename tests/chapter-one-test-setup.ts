/** Unit fixtures use real map permissions; movement itself is tested through MapRuntime/browser touch. */
import type {Progress} from '../src/save';
import {chapterOne, type Chapter} from '../src/data/chapter-one';
import {enterMap} from '../src/exploration/exploration-save';
import {objectForEvent,symbolForEvent} from '../src/exploration/map-data';
export function positionForChapterOne(p:Progress,c:Chapter,id:string){
 const e=c.events.find(e=>e.id===id),done=p.adventure.chapters[c.id]?.completed??[];if(!/^chapter-0[1-6]$/.test(c.id)||!e||done.includes(id)||e.requires.some(id=>!done.includes(id))||p.adventure.pending)return;
 const object=objectForEvent(id),symbol=symbolForEvent(id),map=object?.map??symbol?.map;
 if(map&&enterMap(p,map.id))Object.assign(p.world!,object?{x:object.object.x+32,y:object.object.y}:{x:symbol!.symbol.x,y:symbol!.symbol.y});
}
export function chapterOneContact(id:string){const f=symbolForEvent(id);return f?{mapId:f.map.id,symbolId:f.symbol.id,position:f.symbol}:undefined;}
