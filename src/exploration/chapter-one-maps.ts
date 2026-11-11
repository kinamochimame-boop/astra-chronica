import {chapterOne} from '../data/chapter-one';
import {grid} from './map-grid';
import type {WalkMap,Point} from './types';
const tile=32,at=(x:number,y:number):Point=>({x:(x+.5)*tile,y:(y+.5)*tile});
/** Only terrain and placement are new; all events/rewards/encounters belong to chapterOne. */
export const chapterOneMaps:readonly WalkMap[]=chapterOne.locations.map((location,index)=>{
 const events=chapterOne.events.filter(e=>e.locationId===location.id);
 return {id:`mistwood-${location.id.slice(3)}`,chapterId:chapterOne.id,locationId:location.id,name:location.name,
  kind:index===0||index===4?'camp':index===6?'dungeon':'field',theme:index===0?'village':index===4?'garden':'path',
  tile,width:20,height:18,entry:{...at(3,9),facing:'right'},
  grid:grid(20,18,[{x:7,y:3,w:3,h:4},{x:7,y:11,w:3,h:4},{x:13,y:3,w:3,h:3,type:'~'}]),
  decorations:[{kind:index===4?'flowers':'lamp',...at(5,5)}],
  objects:[
   ...(index>0?[{id:`${location.id}-back`,name:`${chapterOne.locations[index-1].name}へ`,kind:'exit' as const,...at(1,9),targetMap:`mistwood-${chapterOne.locations[index-1].id.slice(3)}`}]:[]),
   ...(index<6?[{id:`${location.id}-next`,name:`${chapterOne.locations[index+1].name}へ`,kind:'exit' as const,...at(18,9),targetMap:`mistwood-${chapterOne.locations[index+1].id.slice(3)}`}]:[{id:'c1-next-chapter',name:'第2章の旅へ',kind:'inspect' as const,...at(18,9),requires:['c1-clear'],text:'第1章クリア。探索メニューからホームへ戻り、章選択で第2章へ進めます。'}]),
   ...events.filter(e=>!e.encounter).map((e,i)=>({id:`${e.id}-object`,name:e.name,kind:e.kind==='treasure'?'chest' as const:e.id==='c1-departure'?'npc' as const:'inspect' as const,...at(5+i*2,8),eventId:e.id})),
   {id:`${location.id}-guide`,name:'森の道標',kind:'inspect' as const,...at(4,12),text:'地面をタップして移動。人・石碑・宝箱をタップすると接近します。到着後にもう一度調べ、出口から次の場所へ。敵には近づくと接触します。'},
  ],
  symbols:events.filter(e=>!!e.encounter).map(e=>({id:`${e.id}-symbol`,name:e.name,mode:'idle' as const,...at(12,9),speed:0,radius:11,aggro:0,leash:0,route:[],eventId:e.id,encounterId:e.encounter!})),
 };
});
