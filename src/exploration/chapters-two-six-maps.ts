import {chapters} from '../data/chapter-one';
import {sideQuests} from '../data/side-quests';
import {grid} from './map-grid';
import type {WalkMap,Point,MapTheme} from './types';
const tile=32,at=(x:number,y:number):Point=>({x:(x+.5)*tile,y:(y+.5)*tile});
const themes:MapTheme[]=['town','sky','cave','market','city'];
/** Placements only: story, conditions, encounters and rewards remain the existing chapter data. */
export const chaptersTwoSixMaps:readonly WalkMap[]=chapters.slice(1,6).flatMap((chapter,chapterIndex)=>chapter.locations.map((location,index):WalkMap=>{
 const events=chapter.events.filter(e=>e.locationId===location.id),quests=sideQuests.filter(q=>q.chapterId===chapter.id);
 const mapId=(id:string)=>`walk-${id}`;
 return {id:mapId(location.id),chapterId:chapter.id,locationId:location.id,name:location.name,
  kind:events.some(e=>e.kind==='rest')?'camp':events.some(e=>e.kind==='boss')?'dungeon':'field',theme:themes[chapterIndex],
  tile,width:24,height:20,entry:{...at(3,9),facing:'right'},
  grid:grid(24,20,[{x:8,y:2,w:4,h:4},{x:9,y:10,w:3,h:2},{x:17,y:12,w:4,h:3,type:'~'}]),
  decorations:[{kind:chapterIndex===1?'crystal':chapterIndex===2?'ore':'lamp',...at(5,4)}],
  objects:[
   ...(index?[{id:`${location.id}-back`,name:`${chapter.locations[index-1].name}へ`,kind:'exit' as const,...at(1,9),targetMap:mapId(chapter.locations[index-1].id)}]:[]),
   ...(index<chapter.locations.length-1?[{id:`${location.id}-next`,name:`${chapter.locations[index+1].name}へ`,kind:'exit' as const,...at(22,9),targetMap:mapId(chapter.locations[index+1].id)}]:[{id:`${location.id}-next-chapter`,name:'次の章への道',kind:'inspect' as const,...at(22,9),requires:chapter.events.filter(e=>e.kind==='clear').map(e=>e.id),text:'この章の冒険を完了しました。探索メニューからホームへ戻り、章選択で次の章へ進めます。'}]),
   ...events.filter(e=>!e.encounter).map((e,i)=>({id:`${e.id}-object`,name:e.name,kind:e.kind==='treasure'?'chest' as const:e.kind==='story'&&!e.puzzle?'npc' as const:'inspect' as const,...at(5+i*3,7),eventId:e.id})),
   ...quests.flatMap(q=>q.objectives.filter(o=>o.locationId===location.id).map(o=>({q,o}))).map(({q,o},i)=>({id:`${o.id}-object`,name:o.name,kind:'inspect' as const,...at(5+i*3,13),questId:q.id,objectiveId:o.id})),
   ...quests.filter(q=>q.returnLocation===location.id).map((q,i)=>({id:`${q.id}-giver`,name:q.giver,kind:'npc' as const,...at(2+i*3,15),text:`${q.name}：探索メニューの「サブクエスト」で依頼の受注・報告ができます。`})),
   {id:`${location.id}-guide`,name:'旅の道標',kind:'inspect' as const,...at(5,17),text:'地面をタップして歩き、対象へ接近してもう一度調べます。出口は手前のイベント完了で解放されます。装置やパズルも対象を調べて操作できます。'},
  ],
  symbols:events.filter(e=>!!e.encounter).map((e,i)=>({id:`${e.id}-symbol`,name:e.name,mode:'idle' as const,...at(12+i*3,9),speed:0,radius:11,aggro:0,leash:0,route:[],eventId:e.id,encounterId:e.encounter!})),
 };
}));
