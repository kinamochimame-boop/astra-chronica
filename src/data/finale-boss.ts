import type {Unit} from '../types';
export const FINALE_PHASES=['記録された終焉','固定された未来','砕ける星の記録','最後の約束'] as const;
export const finalePhase=(u:Pick<Unit,'hp'|'maxHp'>)=>u.hp/u.maxHp<=.2?4:u.hp/u.maxHp<=.45?3:u.hp/u.maxHp<=.75?2:1;
export const finaleScriptKey=(u:Pick<Unit,'hp'|'maxHp'>)=>'astraEnd'+(finalePhase(u)===1?'':finalePhase(u));
export const finaleLines=[
 ['アステル：記録は警告。僕らの決断は、今ここで受け取る！','リナ：予兆を読んで備える。帰る道は守るわ。','メイ：過去の観測を消さずに、今の条件を確かめる。'],
 ['リナ：速さを奪われても、考える時間までは渡さない。','アステル：行動順を見て、回復する仲間を守ろう。','メイ：速度補正は次のラウンド。予約攻撃にも備えて。'],
 ['メイ：星図、歌、羅針盤。時環と翼。違う記録を、違うままつなぐ！','リナ：誰かを置き去りにする命令は、ここで止める！','アステル：旅の答えは一つじゃなかった。だから、この先へ進める！'],
 ['アステル：僕らだけで、誰かの明日を決めない！','リナ：生きて帰る。守られる人も、私自身も！','メイ：次の観測を、未来を選ぶ人へ！']
];
