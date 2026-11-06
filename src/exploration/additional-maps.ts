import {grid} from './map-grid';
import type {WalkMap,Point} from './types';
const at=(x:number,y:number):Point=>({x:(x+.5)*32,y:(y+.5)*32});
/** Additional chapter-seven/eight sites use their original event IDs and rewards. */
export const additionalMaps:readonly WalkMap[]=[
 {id:'grove-village',chapterId:'chapter-07',locationId:'c7-village',name:'樹上の集落',kind:'camp',theme:'village',tile:32,width:28,height:24,entry:{...at(4,12),facing:'right'},grid:grid(28,24,[{x:7,y:4,w:5,h:5},{x:18,y:5,w:5,h:5},{x:10,y:17,w:7,h:3}]),decorations:[{kind:'building',...at(9,6),w:110,h:100},{kind:'building',...at(20,7),w:100,h:100},{kind:'lamp',...at(5,10)},{kind:'flowers',...at(20,19)}],objects:[
 {id:'gran',name:'グラン',kind:'npc',...at(6,12),eventId:'c7-gran'},
 {id:'village-sign',name:'枝の案内板',kind:'inspect',...at(11,12),text:'幹を守るだけでなく、若葉を支える集落。グランと話すと温室への道が開きます。'},
 {id:'village-camp',name:'野営地へ',kind:'exit',...at(1,12),targetMap:'grove-camp'},
 {id:'village-trail',name:'小径へ',kind:'exit',...at(26,12),targetMap:'grove-trail'},
 {id:'village-greenhouse',name:'薬草師の温室へ',kind:'exit',...at(14,22),targetLocation:'c7-herbarium',requires:['c7-gran']},
 ],symbols:[]},
 {id:'grove-garden',chapterId:'chapter-07',locationId:'c7-garden',name:'忘れられた星の庭',kind:'field',theme:'garden',tile:32,width:30,height:24,entry:{...at(4,12),facing:'right'},grid:grid(30,24,[{x:11,y:3,w:5,h:5},{x:18,y:15,w:5,h:5},{x:6,y:17,w:5,h:3,type:'~'}]),decorations:[{kind:'flowers',...at(8,7)},{kind:'flowers',...at(18,9)},{kind:'crystal',...at(13,5)},{kind:'flowers',...at(25,18)}],objects:[
 {id:'seles-memory',name:'セレス',kind:'npc',...at(7,12),eventId:'c7-seles-truth'},
 {id:'garden-ring',name:'若葉の観測印',kind:'inspect',...at(14,12),text:'古い記憶を分けた先に、新しい葉が育っています。'},
 {id:'garden-ruins',name:'観測遺跡へ',kind:'exit',...at(1,12),targetMap:'grove-ruins'},
 {id:'garden-sanctum',name:'星樹の祭壇へ',kind:'exit',...at(28,12),targetLocation:'c7-sanctum',requires:['c7-seles-truth']},
 ],symbols:[]},
 {id:'sky-town',chapterId:'chapter-08',locationId:'c8-town',name:'雲上の居住区',kind:'camp',theme:'town',tile:32,width:28,height:24,entry:{...at(4,12),facing:'right'},grid:grid(28,24,[{x:7,y:4,w:4,h:5},{x:17,y:4,w:6,h:5},{x:8,y:17,w:4,h:4},{x:18,y:16,w:6,h:5}]),decorations:[{kind:'building',...at(8,6),w:80,h:100},{kind:'building',...at(20,6),w:120,h:100},{kind:'lamp',...at(12,10)},{kind:'lamp',...at(15,16)}],objects:[
 {id:'valto',name:'ヴァルト',kind:'npc',...at(6,12),eventId:'c8-residents'},
 {id:'town-light',name:'帰還の案内灯',kind:'inspect',...at(13,12),text:'先へ進む人にも、帰る人にも見える灯り。避難の順路が刻まれています。'},
 {id:'town-island',name:'風の庭へ',kind:'exit',...at(1,12),targetMap:'sky-island'},
 {id:'town-port',name:'飛行艇港へ',kind:'exit',...at(26,12),targetMap:'sky-port'},
 {id:'town-workshop',name:'整備場へ',kind:'exit',...at(14,22),targetLocation:'c8-workshop',requires:['c8-residents']},
 ],symbols:[]},
 {id:'sky-tower',chapterId:'chapter-08',locationId:'c8-observatory',name:'天空観測塔',kind:'dungeon',theme:'tower',tile:32,width:28,height:24,entry:{...at(4,12),facing:'right'},grid:grid(28,24,[{x:9,y:3,w:2,h:7},{x:16,y:3,w:2,h:7},{x:9,y:15,w:9,h:3},{x:20,y:6,w:3,h:3}]),decorations:[{kind:'machine',...at(13,16),w:140,h:60},{kind:'crystal',...at(21,7)},{kind:'lamp',...at(5,9)}],objects:[
 {id:'elysia',name:'エリシア',kind:'npc',...at(6,12),eventId:'c8-records'},
 {id:'tower-chart',name:'空と海の航路図',kind:'inspect',...at(13,11),text:'帰港しなかった便の先にも、観測記録の流れは続いています。'},
 {id:'tower-ruins',name:'空渡りの遺跡へ',kind:'exit',...at(1,12),targetMap:'sky-ruins'},
 {id:'tower-town',name:'居住区へ',kind:'exit',...at(26,12),targetMap:'sky-town'},
 {id:'tower-altar',name:'星翼の祭壇へ',kind:'exit',...at(14,22),targetLocation:'c8-altar',requires:['c8-records']},
 ],symbols:[]},
];
