import type {Progress} from './save';
import {HERO_IDS} from './data/weapons';
import {remainingSP} from './skill-tree';
import {ATB_RULES} from './atb-rules';
/** Contextual presentation only: no tutorial flags, progression writes or availability rules. */
export function homePlayerGuide(p:Progress,chapterId:string){
 if(chapterId!=='chapter-01')return;
 const done=p.adventure.chapters[chapterId]?.completed??[];
 if(!done.includes('c1-departure'))return '「冒険を再開」から森へ。地面をタップして歩き、人の近くでもう一度調べると会話が始まります。';
 if(done.includes('c1-first-battle')&&!done.includes('c1-stele-story')&&HERO_IDS.some(id=>remainingSP(p.skillTree,id,p.party[id].level)>0))return '仲間が成長しました。下の「スキルツリー」で残りSPと習得内容を確認できます。装備も戦闘の外で変更できます。';
}
export function firstExplorationGuide(p:Progress,chapterId:string,locationId:string){return chapterId==='chapter-01'&&locationId==='c1-camp'&&!p.adventure.chapters[chapterId]?.completed.includes('c1-departure')?'地面をタップして移動。人へ近づき、もう一度調べると会話が始まります。':undefined;}
export const firstBattleGuide=(p:Pick<Progress,'battles'>)=>p.battles===0;
export const FIRST_BATTLE_TIP='スタートで自動攻撃。EPが貯まったら技を選んで予約できます。詳しくは「戦闘の操作」へ。';
export const BATTLE_HELP:readonly {title:string;text:string}[]=[
 {title:'開始とCT',text:'スタートまでは味方・敵とも停止中です。AUTO ONではCTが満ちたキャラがそれぞれ通常攻撃します。CTは次の攻撃までの待ち時間で、武器と素早さによって変わります。'},
 {title:'EPと技',text:`通常攻撃が命中すると、そのキャラのEPが増えます。最大${ATB_RULES.maxEp}。技ボタンの必要EPと使用できない理由を確認してください。`},
 {title:'キャラ・技・対象',text:'味方カードで操作するキャラを選び、技を選択します。敵への技は敵カード、回復などは表示された味方対象をタップし、下の予約ボタンで確定します。'},
 {title:'予約と取消',text:`予約はキャラごとに最大${ATB_RULES.maxReservations}件。予約時にEPを消費し、本人が行動可能になると発動します。未発動の予約は再タップか予約一覧から取り消せ、消費EPが返ります。`},
 {title:'停止と速度',text:'一時停止・AUTO・速度は上部で切り替えます。AUTO OFFではCTが満ちたキャラの通常攻撃を手動で行えます。この説明を閉じると、開く前の一時停止状態に戻ります。'}
];
