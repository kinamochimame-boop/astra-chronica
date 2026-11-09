import {graveMaps} from './chapter-sixteen-maps';
import {voidMaps} from './chapter-fifteen-maps';
import {arkMaps} from './chapter-fourteen-maps';
import {gearMaps} from './chapter-thirteen-maps';
import {gloomMaps} from './chapter-twelve-maps';
import {paleMaps} from './chapter-eleven-maps';
import {tideMaps} from './chapter-ten-maps';
import {additionalMaps} from './additional-maps';
import {veinMaps} from './chapter-nine-maps';
import {skyMaps} from './chapter-eight-maps';
import {grid} from './map-grid';
import type {WalkMap,Point} from './types';
const tile=32,at=(x:number,y:number):Point=>({x:(x+.5)*tile,y:(y+.5)*tile});
export const walkMaps:readonly WalkMap[]=[
 {id:'grove-camp',chapterId:'chapter-07',locationId:'c7-camp',name:'樹海の野営地',kind:'camp',tile,width:28,height:24,entry:{...at(4,12),facing:'down'},grid:grid(28,24,[{x:7,y:5,w:4,h:4},{x:16,y:6,w:4,h:5,type:'~'},{x:8,y:16,w:4,h:3},{x:20,y:17,w:3,h:3}]),objects:[
  {id:'fine',name:'フィーネ',kind:'npc',...at(6,12),eventId:'c7-fine'},
  {id:'campfire',name:'焚き火',kind:'npc',...at(12,14),eventId:'c7-camp-rest'},
  {id:'camp-sign',name:'森の道標',kind:'inspect',...at(4,5),text:'小径へは東。足元をタップして歩き、近くの人や物を調べられます。'},
  {id:'camp-village',name:'樹上の集落へ',kind:'exit',...at(14,22),targetMap:'grove-village'},
  {id:'camp-east',name:'小径へ',kind:'exit',...at(26,12),targetMap:'grove-trail'},
 ],symbols:[]},
 {id:'grove-trail',chapterId:'chapter-07',locationId:'c7-trail',name:'木漏れ日の小径',kind:'field',tile,width:28,height:24,entry:{...at(3,12),facing:'right'},grid:grid(28,24,[{x:9,y:1,w:3,h:9,type:'~'},{x:9,y:13,w:3,h:10,type:'~'},{x:17,y:8,w:6,h:3},{x:4,y:17,w:3,h:3},{x:15,y:3,w:4,h:2}]),objects:[
  {id:'trail-west',name:'野営地へ',kind:'exit',...at(1,12),targetMap:'grove-camp'},
  {id:'trail-east',name:'観測遺跡へ',kind:'exit',...at(26,12),targetMap:'grove-ruins'},
  {id:'basket-handle',name:'薬草籠の持ち手',kind:'inspect',...at(5,16),questId:'sq-herb-basket',objectiveId:'basket-handle'},
  {id:'trail-stream',name:'星映しの小川へ',kind:'exit',...at(14,22),targetLocation:'c7-stream'},
 ],symbols:[{id:'trail-patrol',name:'苔牙の群れ',mode:'patrol',...at(18,15),speed:36,radius:10,aggro:0,leash:192,route:[at(18,15),at(22,15),at(22,19),at(18,19)],eventId:'c7-trail-fight',encounterId:'grove-trail'}]},
 {id:'grove-ruins',chapterId:'chapter-07',locationId:'c7-ruins',name:'苔むした観測遺跡',kind:'dungeon',tile,width:28,height:26,entry:{...at(3,12),facing:'right'},grid:grid(28,26,[{x:8,y:2,w:1,h:8},{x:8,y:13,w:1,h:11},{x:9,y:6,w:7,h:1},{x:19,y:6,w:7,h:1},{x:14,y:17,w:4,h:3},{x:20,y:18,w:4,h:4,type:'~'}]),objects:[
  {id:'ruins-west',name:'小径へ',kind:'exit',...at(1,12),targetMap:'grove-trail'},
  {id:'observation-disk',name:'観測盤',kind:'npc',...at(5,9),eventId:'c7-ruins-record'},
  {id:'ruins-chest',name:'古い宝箱',kind:'chest',...at(24,23),eventId:'c7-dual-chest'},
  {id:'oath-stone',name:'古い誓いの碑',kind:'inspect',...at(6,22),questId:'sq-guardian-oath',objectiveId:'oath-stone'},
  {id:'ruins-garden',name:'星の庭へ',kind:'exit',...at(14,24),targetMap:'grove-garden'},
  {id:'ruins-pond',name:'記憶の水鏡へ',kind:'exit',...at(26,23),targetLocation:'c7-pond'},
 ],symbols:[
  {id:'ruins-sentry',name:'古木の歩哨',mode:'idle',...at(12,12),speed:0,radius:11,aggro:0,leash:0,route:[],eventId:'c7-ruins-fight',encounterId:'grove-sentry'},
  {id:'ruins-chaser',name:'根脈の追跡者',mode:'chase',...at(21,14),speed:58,radius:10,aggro:150,leash:210,route:[],eventId:'c7-orb-fight',encounterId:'grove-orb'},
 ]},
 ...skyMaps,...additionalMaps,...veinMaps,...tideMaps,...paleMaps,...gloomMaps,...gearMaps,...arkMaps,...voidMaps,...graveMaps,
];
export const mapById=(id:unknown)=>typeof id==='string'?walkMaps.find(m=>m.id===id):undefined;
export const mapForLocation=(chapterId:string,locationId:string)=>walkMaps.find(m=>m.chapterId===chapterId&&m.locationId===locationId);
export const objectForEvent=(id:string)=>walkMaps.flatMap(map=>map.objects.filter(o=>o.eventId===id).map(object=>({map,object})))[0];
export const symbolForEvent=(id:string)=>walkMaps.flatMap(map=>map.symbols.filter(s=>s.eventId===id).map(symbol=>({map,symbol})))[0];
