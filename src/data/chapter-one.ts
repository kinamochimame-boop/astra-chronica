import {chapterTwelve} from './chapter-twelve';
import {chapterEleven} from './chapter-eleven';
import {chapterTen} from './chapter-ten';
import {chapterNine} from './chapter-nine';
import {chapterEight} from './chapter-eight';
import {chapterSeven} from './chapter-seven';
import {chapterSix} from './chapter-six';
import {chapterFive} from './chapter-five';
import {chapterFour} from './chapter-four';
import {chapterThree} from './chapter-three';
import {chapterTwo} from './chapter-two';
import type {ItemId} from '../consumables';
export type EventKind='story'|'battle'|'treasure'|'rest'|'boss'|'clear';
export interface Dialogue {speaker:string;text:string}
export interface AdventureEvent {id:string;locationId:string;kind:EventKind;name:string;requires:string[];pages:Dialogue[];choiceId?:string;encounter?:string;weaponReward?:string;itemReward?:{id:ItemId;count:number};puzzle?:{mode?:'rotate'|'cycle';title?:string;states?:{id:string;name:string}[];hints?:string[];checkLabel?:string;resetLabel?:string;errorMessage?:string;successMessage?:string;pieces:{id:string;name:string}[];solution:string[];hint:string}}
export interface Location {id:string;name:string;icon:string;description:string}
export interface Chapter {id:string;requiresChapterId?:string;name:string;setting:string;locations:Location[];events:AdventureEvent[];preview:string}
const page=(speaker:string,text:string):Dialogue=>({speaker,text});
export const chapterOne:Chapter={id:'chapter-01',name:'約束のはじまり',setting:'霧の森',preview:'第2章予告：欠けた星図の先、風の街に眠るもうひとつの約束。',locations:[
 {id:'c1-camp',name:'星灯りの野営地',icon:'✧',description:'消えかけた焚き火の向こうに、霧の森が広がっている。'},
 {id:'c1-entrance',name:'霧の森・入口',icon:'♧',description:'足音を吸い込む白い霧。木々の間に小さな影が揺れた。'},
 {id:'c1-stele',name:'古びた石碑',icon:'▥',description:'苔に覆われた石碑には、星を囲む三つの印が刻まれている。'},
 {id:'c1-fork',name:'森の分かれ道',icon:'⑂',description:'倒木の根元に古い箱がある。奥の獣道から低い唸り声が響く。'},
 {id:'c1-spring',name:'忘れられた泉',icon:'◉',description:'霧が途切れ、水面にだけ、昼の星が映っている。'},
 {id:'c1-altar',name:'星詠みの祭壇',icon:'◇',description:'欠けた祭壇の中央で、メイの持つ星図が淡く光る。'},
 {id:'c1-depths',name:'霧の森・最深部',icon:'♜',description:'森を閉ざす霧の中心。大きな獣が、壊れた星の印を守っている。'},
],events:[
 {id:'c1-departure',locationId:'c1-camp',kind:'story',name:'星詠みの遺した言葉',requires:[],pages:[page('アステル','「星が消えても、約束は消えない」。あの人は、なぜ最後にそう言ったんだろう。'),page('メイ','遺された星図には、森の祭壇だけが光っているの。答えがあると決まったわけじゃないけれど……。'),page('リナ','なら、確かめに行こう。急ぐときほど、三人で歩幅を合わせる。これも、あの人との約束でしょう？'),page('アステル','うん。誰も置いていかない。霧の先まで、一緒に行こう。')]},
 {id:'c1-first-battle',locationId:'c1-entrance',kind:'battle',name:'霧の中の気配',requires:['c1-departure'],encounter:'forest-entry',pages:[page('リナ','動く影が三つ。私が前に出る。アステルは敵を一体ずつ、メイは回復をお願い。'),page('メイ','いつもの戦い方で大丈夫。魔力が足りなくなったら通常攻撃も使ってね。')]},
 {id:'c1-stele-story',locationId:'c1-stele',kind:'story',name:'三つの印',requires:['c1-first-battle'],pages:[page('メイ','読める部分は……「力を合わせ、境を守れ」。星詠みの文字と似ているけど、ずっと古い。'),page('アステル','この三つの印、僕たちの持つ欠片にもあった。偶然じゃないのかな。'),page('リナ','今は決めつけないでおこう。石碑が道標なら、進んだ先にも同じ印があるはず。'),page('メイ','星図に写しておくね。いつか、欠けた文字を読める場所が見つかるかもしれない。')]},
 {id:'c1-chest',locationId:'c1-fork',kind:'treasure',name:'旅人の置き土産',requires:['c1-stele-story'],weaponReward:'windcut-bow',pages:[page('アステル','箱に弓と、短い手紙がある。「次に森を渡る人へ」。'),page('リナ','誰かが残してくれた備えね。必要な時に使って、私たちもいつか次の旅人へ返そう。')]},
 {id:'c1-fork-battle',locationId:'c1-fork',kind:'battle',name:'獣道を開く',requires:['c1-chest'],encounter:'forest-fork',pages:[page('リナ','番狼が道を塞いでいる。倒すなら手早く。弱った仲間を放っておかないで。')]},
 {id:'c1-rest',locationId:'c1-spring',kind:'rest',name:'水面に映る星',requires:['c1-fork-battle'],pages:[page('メイ','ここの水は澄んでいる。少し休んで、魔法の呼吸を整えよう。'),page('アステル','静かだね。森全部が、誰かの返事を待っているみたいだ。'),page('リナ','返事を急がなくていい。休めるときに休むのも、旅を続けるための力だから。'),page('メイ','次の戦いもHPとMPは全快で始まるよ。装備を見直すなら、一度野営地に戻ろう。')]},
 {id:'c1-altar-story',locationId:'c1-altar',kind:'story',name:'守るもの、閉ざすもの',requires:['c1-rest'],pages:[page('メイ','祭壇の印が割れている。霧は外から来たんじゃない。ここから溢れている……。'),page('リナ','奥の獣も、印を守っているのかもしれない。でも、このままじゃ森が持たない。'),page('アステル','倒して終わりじゃなく、霧から解き放とう。あの人が守りたかったものを、僕たちも見つけたい。'),page('メイ','獣が霧を吸い込んだら、次は強い攻撃が来るはず。防御やガードで備えてね。')]},
 {id:'c1-guardian',locationId:'c1-depths',kind:'boss',name:'霧喰らいの守護獣',requires:['c1-altar-story'],encounter:'forest-guardian',pages:[page('霧喰らいの守護獣','――低い咆哮が、霧を震わせる。'),page('リナ','来る！ 三人とも、約束を忘れないで。誰も置いていかない！')]},
 {id:'c1-clear',locationId:'c1-depths',kind:'clear',name:'霧の向こうの約束',requires:['c1-guardian'],pages:[page('メイ','霧が晴れていく……。獣は消えずに、静かに眠った。祭壇の光も落ち着いている。'),page('アステル','欠片に新しい線が浮かんだ。森だけじゃない。この星図は、まだ先へ続いているんだ。'),page('リナ','まずは、帰って休もう。次の約束を探す旅は、明日から。'),page('メイ','遠い風の街に、同じ印の記録があるって聞いたことがある。星詠みが歩いた道を、少しずつ辿ろう。')]},
]};
/** Register later chapters here without assigning meaning to unknown save IDs. */
export const chapters:readonly Chapter[]=[chapterOne,chapterTwo,chapterThree,chapterFour,chapterFive,chapterSix,chapterSeven,chapterEight,chapterNine,chapterTen,chapterEleven,chapterTwelve];
