import type {WalkMap,Point} from './types';
import {grid} from './map-grid';
const at=(x:number,y:number):Point=>({x:(x+.5)*32,y:(y+.5)*32});
export const skyMaps:readonly WalkMap[]=[
 {id:'sky-port',chapterId:'chapter-08',locationId:'c8-port',name:'風待ちの飛行艇港',kind:'camp',theme:'sky',tile:32,width:28,height:24,entry:{...at(4,12),facing:'right'},grid:grid(28,24,[{x:7,y:5,w:4,h:4},{x:16,y:6,w:4,h:5,type:'~'},{x:8,y:16,w:4,h:3},{x:20,y:17,w:3,h:3}]),objects:[
 {id:'arka',name:'アルカ',kind:'npc',...at(6,12),eventId:'c8-arka'},
 {id:'port-lamp',name:'帰港の灯り',kind:'npc',...at(12,14),eventId:'c8-port-rest'},
 {id:'port-sign',name:'搭乗案内',kind:'inspect',...at(4,5),text:'桟橋から甲板へ。飛行後は東の出口で風の庭へ渡れます。'},
 {id:'port-town',name:'雲上の居住区へ',kind:'exit',...at(26,20),targetMap:'sky-town'},
 {id:'port-island',name:'風の庭へ',kind:'exit',...at(26,12),targetMap:'sky-island'},
 {id:'port-deck',name:'飛行艇の甲板へ',kind:'exit',icon:'ship',...at(14,22),targetLocation:'c8-deck'},
 ],symbols:[]},
 {id:'sky-island',chapterId:'chapter-08',locationId:'c8-island',name:'第一浮島・風の庭',kind:'field',theme:'sky',tile:32,width:28,height:24,entry:{...at(3,12),facing:'right'},grid:grid(28,24,[{x:9,y:1,w:3,h:9,type:'~'},{x:9,y:13,w:3,h:10,type:'~'},{x:17,y:8,w:6,h:3},{x:4,y:17,w:3,h:3},{x:15,y:3,w:4,h:2}]),objects:[
 {id:'island-port',name:'飛行艇港へ',kind:'exit',...at(1,12),targetMap:'sky-port'},
 {id:'island-ruins',name:'空渡りの遺跡へ',kind:'exit',...at(26,12),targetMap:'sky-ruins'},
 {id:'sky-rope',name:'飛行艇の組紐',kind:'inspect',...at(5,16),questId:'sq-airship-keepsake',objectiveId:'sky-rope'},
 {id:'island-town',name:'雲上の居住区へ',kind:'exit',...at(14,22),targetLocation:'c8-town'},
 ],symbols:[{id:'island-patrol',name:'風刃の群れ',mode:'patrol',...at(18,15),speed:38,radius:10,aggro:0,leash:192,route:[at(18,15),at(22,15),at(22,19),at(18,19)],eventId:'c8-island-fight',encounterId:'sky-island'}]},
 {id:'sky-ruins',chapterId:'chapter-08',locationId:'c8-ruins',name:'空渡りの遺跡',kind:'dungeon',theme:'sky',tile:32,width:28,height:26,entry:{...at(3,12),facing:'right'},grid:grid(28,26,[{x:8,y:2,w:1,h:8},{x:8,y:13,w:1,h:11},{x:9,y:6,w:7,h:1},{x:19,y:6,w:7,h:1},{x:14,y:17,w:4,h:3},{x:20,y:18,w:4,h:4,type:'~'}]),objects:[
 {id:'sky-ruins-west',name:'風の庭へ',kind:'exit',...at(1,12),targetMap:'sky-island'},
 {id:'sky-disk',name:'航路の観測盤',kind:'npc',...at(5,9),eventId:'c8-ruins-record'},
 {id:'sky-chest',name:'帰還者の箱',kind:'chest',...at(24,23),eventId:'c8-sword-chest'},
 {id:'wing-tablet',name:'翼の航路片',kind:'inspect',...at(6,22),questId:'sq-wing-records',objectiveId:'wing-tablet'},
 {id:'ruins-tower',name:'天空観測塔へ',kind:'exit',...at(14,24),targetMap:'sky-tower'},
 {id:'ruins-reactor',name:'浮遊炉の外郭へ',kind:'exit',...at(26,23),targetLocation:'c8-reactor'},
 ],symbols:[
 {id:'sky-sentry',name:'浮遊甲冑',mode:'idle',...at(12,12),speed:0,radius:11,aggro:0,leash:0,route:[],eventId:'c8-ruins-fight',encounterId:'sky-sentry'},
 {id:'sky-chaser',name:'航路の追跡灯',mode:'chase',...at(21,14),speed:60,radius:10,aggro:150,leash:210,route:[],eventId:'c8-orb-fight',encounterId:'sky-orb'},
 ]},
];
