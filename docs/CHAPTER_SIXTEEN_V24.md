# v2.4 第16章「星の墓標と終焉の観測者」

基準main：`aaa94f7e68a13bb1b549669962867982035ed4aa`。作業ブランチ：`feature/v2.4-chapter-sixteen-exploration`。

## 全体設計と維持事項

第15章で部分修復した星冠が示した遠い星脈の座標は、消えた星の記録を保管する墓標だった。ノアティスと星冠の記録を照合し、終焉に選択が関わった可能性と、まだ届いていない返事の所在を追う。「終わりを知っていても、人は未来を選べるのか」を描く。第17章への手がかりまでとし、第18章の結末は確定しない。

アステル・リナ・メイの3人、9武器系統、7属性・7状態異常、星力・必殺技、90ノード、最大Lv50を維持。レベル上限・成長式・ダメージ式・属性倍率・旧セーブ形式は変更しない。新章は第15章装備・Lv50・必須ノードなしで検証する。正式キャラクター画像とジョブは追加しない。

16地点、38メインイベント、新規8マップ。全8マップに進行に対応したNPC／調査装置、敵シンボル、実報酬付き宝箱、調査対象、出口と障害を配置。追加の通常戦闘と備蓄箱もデータ定義で既存イベントAPIへ登録し、新しい移動・報酬エンジンを作らない。依頼は任意で、章の前後どちらでも完了できる。

## NPCと既存設定

- エルシア：記録官。終焉時刻だけでなく、出典・受領先・欠けた箇所を残すことを学ぶ。
- カイル：巡回守護者。封鎖命令を守る立場から、今ここにいる人の帰還も守る任務へ移る。
- リュリア：声の断片を聞く少女。候補名「ミラ」は第6章・第11章の既存人物と衝突するため変更。既存のミラの名前・設定・結末は変更しない。
- 第15章の「遠い星脈の合流点」は、墓標で得る未送信の宛先によって第17章への行路として具体化する。既存の予告を上書きせず補足する。

## 16地点と38イベント

|順|地点ID|名称|説明|
|---|---|---|---|
|1|`c16-gateway`|星墓の入口|星冠の新座標へ。帰還座標を記録し、漂う星屑の間に道を探す。|
|2|`c16-field`|星屑の荒野|記録官エルシアと、名前を失った星々の記録を確かめる。|
|3|`c16-monuments`|崩壊文明の遺跡|投影装置のある遺跡。見える橋と渡れる橋を分けて調べる。|
|4|`c16-camp`|記録官の野営地|消えた文明の食事や生活を記した帳面が残る休息地。|
|5|`c16-sanctum`|記憶の回廊|声の断片を受け取る少女リュリア。聞こえない部分は空白のまま残す。|
|6|`c16-seal`|巡回守護者の詰所|カイルの任務記録と、撤退命令の矛盾を調べる。|
|7|`c16-archive`|失われた観測所|終焉時刻だけでなく、選択を交わした通信の履歴が残る。|
|8|`c16-garden`|静止した庭|失われた日常を見送り、今の呼吸を取り戻す休息地。|
|9|`c16-gate`|守護機の封鎖門|アストラセンチネルが装置を守る。予兆と反撃を見極めよう。|
|10|`c16-bridge`|消えた連絡橋|過去の橋を今の座標へ接続する。投影と実体は同じではない。|
|11|`c16-corridor`|星魂の祭壇|過去の記録を今の選択と照合する。消えた星の声を一つに束ねない。|
|12|`c16-refuge`|帰還灯の避難所|記録を見るのをやめる時間も必要だ。道と仲間を確かめ直す。|
|13|`c16-fracture`|終焉の塔|終わりの時刻へ向けて並べられた記録に、空白の通信を発見する。|
|14|`c16-observatory`|重ね合わせの調律座|過去と現在を照合して統合する。異なる記録は消さずに保つ。|
|15|`c16-altar`|最後の観測台|終焉の観測者に、記録だけでは決められない問いを渡す。|
|16|`c16-core`|観測者の中枢|終わりを記録し続ける存在と向き合い、次の星脈へ続く手がかりを得る。|

|順|イベントID|地点|種別|内容|前提|報酬・戦闘|
|---|---|---|---|---|---|---|
|1|`c16-arrival`|`c16-gateway`|story|残された座標|なし|—|
|2|`c16-gateway-fight`|`c16-gateway`|battle|星屑の巡回者|c16-arrival|grave-gate|
|3|`c16-gateway-cache`|`c16-gateway`|treasure|入口の救援箱|c16-gateway-fight|{'id': 'potion', 'count': 2}|
|4|`c16-elsia`|`c16-field`|story|記録官の問い|c16-gateway-cache|—|
|5|`c16-field-fight`|`c16-field`|battle|星屑の荒野の巡回者|c16-elsia|grave-field|
|6|`c16-field-record`|`c16-field`|story|終焉時刻の余白|c16-field-fight|—|
|7|`c16-field-cache`|`c16-field`|treasure|荒野の携行箱|c16-field-record|{'id': 'potion', 'count': 1}|
|8|`c16-projection`|`c16-monuments`|story|過去の輪郭|c16-field-cache|—|
|9|`c16-kyle`|`c16-monuments`|story|巡回守護者との対立|c16-projection|—|
|10|`c16-ruins-fight`|`c16-monuments`|battle|遺跡の巡回防衛|c16-kyle|grave-ruins|
|11|`c16-monument-record`|`c16-monuments`|story|二つの命令書|c16-ruins-fight|—|
|12|`c16-ruins-cache`|`c16-monuments`|treasure|遺跡の避難備蓄|c16-monument-record|{'id': 'potion', 'count': 1}|
|13|`c16-camp-rest`|`c16-camp`|rest|冷めた食卓のそばで|c16-ruins-cache|—|
|14|`c16-lyria`|`c16-sanctum`|story|断片を聞く少女|c16-camp-rest|—|
|15|`c16-sanctum-fight`|`c16-sanctum`|battle|記憶をほどく影|c16-lyria|grave-memory|
|16|`c16-hall-cache`|`c16-sanctum`|treasure|回廊の記録箱|c16-sanctum-fight|{'id': 'ether', 'count': 1}|
|17|`c16-seal-record`|`c16-seal`|story|声を消さない筆記|c16-hall-cache|—|
|18|`c16-archive-fight`|`c16-archive`|battle|観測所の残存防衛|c16-seal-record|grave-observatory|
|19|`c16-archive-record`|`c16-archive`|story|転送されなかった返事|c16-archive-fight|—|
|20|`c16-observatory-cache`|`c16-archive`|treasure|観測所の保守箱|c16-archive-record|{'id': 'ether', 'count': 1}|
|21|`c16-garden-rest`|`c16-garden`|rest|庭に残る一日|c16-observatory-cache|—|
|22|`c16-sentinel`|`c16-gate`|battle|守護機の封鎖|c16-garden-rest|grave-sentinel|
|23|`c16-connection`|`c16-gate`|story|記憶を支える足場|c16-sentinel|endward-shield-spear|
|24|`c16-bridge-record`|`c16-bridge`|story|渡った人の順序|c16-connection|—|
|25|`c16-sanctuary-fight`|`c16-corridor`|battle|祭壇の防衛反応|c16-bridge-record|grave-sanctuary|
|26|`c16-civilization-record`|`c16-corridor`|story|残された星の名前|c16-sanctuary-fight|—|
|27|`c16-memory-cache`|`c16-corridor`|treasure|祭壇の保管箱|c16-civilization-record|{'id': 'potion', 'count': 2}|
|28|`c16-refuge-rest`|`c16-refuge`|rest|帰還灯を見直す|c16-memory-cache|—|
|29|`c16-fracture-fight`|`c16-fracture`|battle|終焉の塔の残響|c16-refuge-rest|grave-tower|
|30|`c16-tower-reading`|`c16-fracture`|story|未来を射抜くのではなく|c16-fracture-fight|grave-longbow|
|31|`c16-tower-cache`|`c16-fracture`|treasure|塔の帰還備蓄|c16-tower-reading|{'id': 'potion', 'count': 1}|
|32|`c16-integration`|`c16-observatory`|story|過去と現在の照合|c16-tower-cache|—|
|33|`c16-seer-record`|`c16-observatory`|story|返事の保留欄|c16-integration|—|
|34|`c16-promise`|`c16-altar`|story|観測者へ渡す問い|c16-seer-record|—|
|35|`c16-inherit`|`c16-altar`|story|中枢への通行記録|c16-promise|—|
|36|`c16-core-cache`|`c16-core`|treasure|中枢の待機備蓄|c16-inherit|{'id': 'potion', 'count': 1}|
|37|`c16-end-observer`|`c16-core`|boss|終わりを記録する者|c16-core-cache|grave-end-observer|
|38|`c16-clear`|`c16-core`|clear|未送信の宛先|c16-end-observer|—|

ボスは最後の戦闘。中枢の備蓄箱を開けてから対面し、勝利時は既存の確定処理で章クリアと武器・経験値・戦績を一度だけ反映する。クリア後、マップの記録装置から後日談全文を読める。敗北・撤退・中断では該当戦闘の進行を確定しない。

## 記憶投影4段階

|段階|確定条件|地形・演出|
|---|---|---|
|記録断絶 severed|初期|歴史の輪郭なし。消えた橋の範囲は水／空隙として通行不可。|
|記憶投影 projected|c16-projection|過去の建物・橋の半透明な輪郭。表示だけで足場にはならない。|
|記憶接続 connected|c16-connection|荷重記録を解放し、橋の実地形が歩行可能になる。|
|記憶統合 integrated|c16-integration|過去と現在を照合。最終会話後、中枢への進行が可能になる。|

`memoryPhase`は確定イベントのみを見る。第15章の`stellarPhase`、第14章の重力、第13章の天球儀などを読み替えない。保存に偽の`memoryPhase`があっても無視する。

既存`activeMap`に純粋な`projectedMap`を追加し、既存の潮位・gate処理と合成する。描画・MapRuntime・A*・衝突・ミニマップ・座標復元の全てが同じ実効gridを使う。半透明の輪郭はPhaser Graphicsでシーン作成時に一度描画する静止表現。粒子・画面反転・毎フレームの地形再計算は加えず、低モーションでも同じ情報を表示する。第15章の漂う輪とは異なる、建物の格子・橋桁の輪郭と文字表示にする。

橋の閉鎖中に保存された不正座標は既存の読み込み処理で安全位置へ補正する。接続後の合法な橋上座標は保持する。必須NPC・調査対象・宝箱と常設の安全路は、閉鎖する橋の範囲から外してある。

## 共通探索の改善

- `navigationTarget`を実マップの「次」表示と輪、既存目的地案内・ミニマップで共用。未解放対象は既存`objectRevealed`で非表示。確認済みは✓と薄い表示で区別。選択範囲と近くの対象ボタンを維持する。
- 恒久的な訪問履歴は既存`AdventureProgress.exploration`、重要調査は完了イベント、依頼は目的達成フラグを使用する。新しい保存フィールドは追加しない。既存探索記録画面で区別し、旧セーブの未確認訪問を推測しない。
- `MapSurvey`の色はページ内セッションだけの探索色で、訪問履歴と混同しない。案内板にも違いを明記する。
- 新8マップは`returnToContact`を指定。勝利後は合法な元の接触位置へ戻り、敵が残る撤退・敗北後は最寄りの到達可能かつ敵から176px以上離れた位置へ戻す。見つからなければ入口へ戻す。判定は既存の実効地形・A*を使用する。
- `safeReturnPose`は共通APIとして実装。旧66マップは従来の入口復帰を維持し、古い確定・中断復帰の挙動を不用意に変えない。新しい復帰位置を保存形式へ追加せず、既存の接触姿勢・結果・serialを使用する。
- 移動・会話・演出・戦闘予約のキャンセルと入力ロックは既存の所有者・破棄処理を再利用する。過剰な毎フレームの地形・経路計算を避け、案内のキャッシュを共用する。

## 74マップと接続

旧66マップのIDと定義は維持。追加8マップは下表。16地点の間に自由歩行と従来の地点UIを共存させ、すべて既存`visitLocation`・`enterMap`・出口条件で移動する。

|マップID|地点ID|名称|解放条件|出入口|
|---|---|---|---|---|
|`grave-gate`|`c16-gateway`|星墓の入口|第15章クリア|星屑の荒野へ → grave-field|
|`grave-field`|`c16-field`|星屑の荒野|c16-arrival, c16-gateway-fight, c16-gateway-cache|星墓の入口へ → grave-gate / 崩壊文明の遺跡へ → grave-ruins|
|`grave-ruins`|`c16-monuments`|崩壊文明の遺跡|c16-elsia, c16-field-fight, c16-field-record, c16-field-cache|星屑の荒野へ → grave-field / 記録官の野営地へ → c16-camp|
|`grave-memory`|`c16-sanctum`|記憶の回廊|c16-camp-rest|記録官の野営地へ → c16-camp / 巡回守護者の詰所へ → c16-seal|
|`grave-observatory`|`c16-archive`|失われた観測所|c16-seal-record|巡回守護者の詰所へ → c16-seal / 静止した庭へ → c16-garden|
|`grave-sanctuary`|`c16-corridor`|星魂の祭壇|c16-bridge-record|消えた連絡橋へ → c16-bridge / 帰還灯の避難所へ → c16-refuge|
|`grave-tower`|`c16-fracture`|終焉の塔|c16-refuge-rest|帰還灯の避難所へ → c16-refuge / 重ね合わせの調律座へ → c16-observatory|
|`grave-core`|`c16-core`|観測者の中枢|c16-promise, c16-inherit|最後の観測台へ → c16-altar|

既存マップの一覧・接続は基準mainの [第15章仕様](CHAPTER_FIFTEEN_V23.md) を維持。追加分を合わせた74マップ全件を単体と4幅ブラウザ巡回で検証する。

## 74マップ接続の一覧

|章|マップID|地点|解放イベント|接続先と条件|
|---|---|---|---|---|
|chapter-07|`grove-camp`|樹海の野営地|章・地点の解放条件|`grove-village` / `grove-trail`|
|chapter-07|`grove-trail`|木漏れ日の小径|章・地点の解放条件|`grove-camp` / `grove-ruins` / `c7-stream`|
|chapter-07|`grove-ruins`|苔むした観測遺跡|章・地点の解放条件|`grove-trail` / `grove-garden` / `c7-pond`|
|chapter-08|`sky-port`|風待ちの飛行艇港|章・地点の解放条件|`sky-town` / `sky-island` / `c8-deck`|
|chapter-08|`sky-island`|第一浮島・風の庭|章・地点の解放条件|`sky-port` / `sky-ruins` / `c8-town`|
|chapter-08|`sky-ruins`|空渡りの遺跡|章・地点の解放条件|`sky-island` / `sky-tower` / `c8-reactor`|
|chapter-07|`grove-village`|樹上の集落|章・地点の解放条件|`grove-camp` / `grove-trail` / `c7-herbarium`（c7-gran）|
|chapter-07|`grove-garden`|忘れられた星の庭|章・地点の解放条件|`grove-ruins` / `c7-sanctum`（c7-seles-truth）|
|chapter-08|`sky-town`|雲上の居住区|章・地点の解放条件|`sky-island` / `sky-port` / `c8-workshop`（c8-residents）|
|chapter-08|`sky-tower`|天空観測塔|章・地点の解放条件|`sky-ruins` / `sky-town` / `c8-altar`（c8-records）|
|chapter-09|`star-cave`|星脈洞窟・入口|章・地点の解放条件|`star-path`（c9-arrival）|
|chapter-09|`star-path`|蒼光の地下道|章・地点の解放条件|`star-cave` / `c9-gate`（c9-path-cache） / `star-city`（c9-gate-meeting）|
|chapter-09|`star-city`|星脈都市・中央広場|章・地点の解放条件|`star-path` / `star-market`（c9-city-rest）|
|chapter-09|`star-market`|地底の交易区|章・地点の解放条件|`star-city` / `c9-residence`（c9-market-blades） / `star-waterway`（c9-workshop-clue）|
|chapter-09|`star-waterway`|地下水路|章・地点の解放条件|`star-market` / `star-mine`（c9-waterway-record）|
|chapter-09|`star-mine`|水晶採掘跡|章・地点の解放条件|`star-waterway` / `c9-guard`（c9-mine-token） / `star-archive`（c9-seal-repair）|
|chapter-09|`star-archive`|古代記録庫|c9-seal-repair|`star-mine` / `c9-lab`（c9-archive-record） / `star-core`（c9-sanctum-promise）|
|chapter-09|`star-core`|星脈中枢|c9-sanctum-promise|`star-archive`|
|chapter-10|`tide-road`|海辺への街道|章・地点の解放条件|`tide-town`（c10-road-cache）|
|chapter-10|`tide-town`|潮見の町|章・地点の解放条件|`tide-road` / `tide-port`（c10-rest）|
|chapter-10|`tide-port`|漁港|章・地点の解放条件|`tide-town` / `c10-market`（c10-high-tide） / `tide-beach`（c10-bow）|
|chapter-10|`tide-beach`|星砂の浜辺|章・地点の解放条件|`tide-port` / `c10-cliff`（c10-fiona） / `tide-cave`（c10-low-tide）|
|chapter-10|`tide-observatory`|海辺の観測所|章・地点の解放条件|`c10-cliff` / `c10-tower`（c10-observatory-record）|
|chapter-10|`tide-cave`|潮騒の洞窟|c10-low-tide|`tide-beach` / `c10-tidepool`（c10-cave-record） / `tide-ruins`（c10-pool-rest）|
|chapter-10|`tide-ruins`|沈んだ遺跡|c10-low-tide|`tide-cave` / `c10-channel`（c10-ruins-tablet）|
|chapter-10|`tide-core`|海底星脈中枢|c10-promise|`c10-sanctum`|
|chapter-11|`pale-road`|白銀への街道|章・地点の解放条件|`pale-village`（c11-road-cache）|
|chapter-11|`pale-village`|巡礼者の集落|章・地点の解放条件|`pale-road` / `pale-field`（c11-rest）|
|chapter-11|`pale-field`|白銀の大平原|章・地点の解放条件|`pale-village` / `c11-waystation`（c11-escort-plan） / `pale-stones`（c11-blades）|
|chapter-11|`pale-stones`|星文字の石碑群|章・地点の解放条件|`pale-field` / `c11-ridge`（c11-mira） / `pale-sanctuary`（c11-shelter-rest）|
|chapter-11|`pale-ravine`|白い断層|章・地点の解放条件|`c11-ridge` / `c11-shelter`（c11-ravine-record）|
|chapter-11|`pale-sanctuary`|沈黙の礼拝堂|c11-shelter-rest|`pale-stones` / `c11-garden`（c11-sanctuary-record） / `pale-archive`（c11-garden-rest）|
|chapter-11|`pale-archive`|巡礼記録庫|c11-shelter-rest|`pale-sanctuary` / `c11-passage`（c11-archive-tablet） / `pale-core`（c11-promise）|
|chapter-11|`pale-core`|星声の中枢|c11-promise|`c11-altar`|
|chapter-12|`gloom-road`|深森への街道|章・地点の解放条件|`gloom-village`（c12-road-cache）|
|chapter-12|`gloom-village`|木漏れ日の集落|章・地点の解放条件|`gloom-road` / `gloom-woods`（c12-rest）|
|chapter-12|`gloom-woods`|常闇の森|章・地点の解放条件|`gloom-village` / `c12-watch`（c12-sheltered-record） / `gloom-lake`（c12-sword）|
|chapter-12|`gloom-lake`|星映しの湖|章・地点の解放条件|`gloom-woods` / `c12-ridge`（c12-ciel） / `gloom-shrine`（c12-shelter-rest）|
|chapter-12|`gloom-roots`|巨大樹の根道|章・地点の解放条件|`c12-ridge` / `c12-shelter`（c12-roots-record）|
|chapter-12|`gloom-shrine`|古樹の祠|c12-shelter-rest|`gloom-lake` / `c12-garden`（c12-shrine-record） / `gloom-archive`（c12-garden-rest）|
|chapter-12|`gloom-archive`|樹海の記録庫|c12-shelter-rest|`gloom-shrine` / `c12-channel`（c12-archive-tablet） / `gloom-core`（c12-promise）|
|chapter-12|`gloom-core`|星喰い樹の中枢|c12-promise|`c12-altar`|
|chapter-13|`gear-rail`|星脈鉄道跡|章・地点の解放条件|`gear-station`（c13-rail-cache）|
|chapter-13|`gear-station`|古代鉄道駅|章・地点の解放条件|`gear-rail` / `gear-city`（c13-rail-start）|
|chapter-13|`gear-city`|機巧都市中央区|章・地点の解放条件|`gear-station` / `c13-platform`（c13-residents） / `gear-market`（c13-duals）|
|chapter-13|`gear-market`|歯車市場|章・地点の解放条件|`gear-city` / `c13-clock`（c13-fiora） / `gear-workshop`（c13-refuge-rest）|
|chapter-13|`gear-lower`|都市下層区|章・地点の解放条件|`c13-clock` / `c13-refuge`（c13-lower-record）|
|chapter-13|`gear-workshop`|機巧工房|c13-refuge-rest|`gear-market` / `c13-garden`（c13-workshop-record） / `gear-observatory`（c13-garden-rest）|
|chapter-13|`gear-observatory`|天球儀観測塔|c13-refuge-rest|`gear-workshop` / `c13-bridge`（c13-observatory-tablet） / `gear-core`（c13-promise）|
|chapter-13|`gear-core`|天球儀中枢|c13-promise|`c13-altar`|
|chapter-14|`ark-gateway`|星海への転送門|章・地点の解放条件|`ark-shore`（c14-gateway-cache）|
|chapter-14|`ark-shore`|逆さの星海|章・地点の解放条件|`ark-gateway` / `ark-dock`（c14-control-start）|
|chapter-14|`ark-dock`|方舟接岸区|章・地点の解放条件|`ark-shore` / `c14-deck`（c14-passengers） / `ark-hall`（c14-bow）|
|chapter-14|`ark-hall`|方舟中央回廊|章・地点の解放条件|`ark-dock` / `c14-beacon`（c14-yuno） / `ark-records`（c14-refuge-rest）|
|chapter-14|`ark-gravity`|重力反転区画|章・地点の解放条件|`c14-beacon` / `c14-refuge`（c14-gravity-record）|
|chapter-14|`ark-records`|記憶保存庫|c14-refuge-rest|`ark-hall` / `c14-garden`（c14-records-record） / `ark-sanctuary`（c14-garden-rest）|
|chapter-14|`ark-sanctuary`|星詠みの聖域|c14-refuge-rest|`ark-records` / `c14-bridge`（c14-sanctuary-tablet） / `ark-core`（c14-promise）|
|chapter-14|`ark-core`|方舟中枢|c14-promise|`c14-altar`|
|chapter-15|`void-gate`|虚空の門|章・地点の解放条件|`void-court`（c15-gateway-cache）|
|chapter-15|`void-court`|星冠の前庭|章・地点の解放条件|`void-gate` / `void-corridor`（c15-field-record）|
|chapter-15|`void-corridor`|位相の回廊|章・地点の解放条件|`void-court` / `c15-camp`（c15-monument-record）|
|chapter-15|`void-mirror`|未来映しの鏡殿|c15-camp-rest|`c15-camp` / `c15-seal`（c15-sanctum-fight）|
|chapter-15|`void-archive`|聖域記録庫|c15-seal-record|`c15-seal` / `c15-garden`（c15-archive-record）|
|chapter-15|`void-garden`|忘却の庭|c15-key|`c15-bridge` / `c15-refuge`（c15-link-anchor, c15-link-observe, c15-link-choice）|
|chapter-15|`void-sanctum`|星冠の祭壇|c15-refuge-rest|`c15-refuge` / `c15-observatory`（c15-fracture-reading）|
|chapter-15|`void-core`|砕けた星冠の中枢|c15-inherit|`c15-altar`|
|chapter-16|`grave-gate`|星墓の入口|章・地点の解放条件|`grave-field`（c16-arrival, c16-gateway-fight, c16-gateway-cache）|
|chapter-16|`grave-field`|星屑の荒野|c16-arrival, c16-gateway-fight, c16-gateway-cache|`grave-gate` / `grave-ruins`（c16-elsia, c16-field-fight, c16-field-record, c16-field-cache）|
|chapter-16|`grave-ruins`|崩壊文明の遺跡|c16-elsia, c16-field-fight, c16-field-record, c16-field-cache|`grave-field` / `c16-camp`（c16-projection, c16-kyle, c16-ruins-fight, c16-monument-record, c16-ruins-cache）|
|chapter-16|`grave-memory`|記憶の回廊|c16-camp-rest|`c16-camp` / `c16-seal`（c16-lyria, c16-sanctum-fight, c16-hall-cache）|
|chapter-16|`grave-observatory`|失われた観測所|c16-seal-record|`c16-seal` / `c16-garden`（c16-archive-fight, c16-archive-record, c16-observatory-cache）|
|chapter-16|`grave-sanctuary`|星魂の祭壇|c16-bridge-record|`c16-bridge` / `c16-refuge`（c16-sanctuary-fight, c16-civilization-record, c16-memory-cache）|
|chapter-16|`grave-tower`|終焉の塔|c16-refuge-rest|`c16-refuge` / `c16-observatory`（c16-fracture-fight, c16-tower-reading, c16-tower-cache）|
|chapter-16|`grave-core`|観測者の中枢|c16-promise, c16-inherit|`c16-altar`|

## 敵・ボス数値

全敵MP0。未指定の属性倍率は1、睡眠・凍結耐性20%、他の状態耐性0。既存のダメージ・会心・軽減・状態付与の計算を使用する。

|ID|名前|HP|攻撃|防御|速度|経験値|
|---|---|---|---|---|---|---|
|`stardust-ghost`|星屑の亡霊|960|68|39|53|650|
|`grave-sentry`|墓標の番兵|1040|70|51|42|660|
|`memory-eater`|記憶喰らい|940|68|40|55|640|
|`hollow-star-wisp`|虚星のウィスプ|900|68|38|83|650|
|`collapsed-soldier`|崩壊機兵|1020|72|47|45|670|
|`end-apostle`|終焉の使徒|970|69|42|54|680|
|`grave-sentinel`|墓標守護機・アストラセンチネル|4700|73|53|47|2300|
|`end-observer`|終焉の観測者・エンドオブザーバー|6400|71|44|51|3000|

- 星屑の亡霊：闇属性魔法102と攻撃力−15%・2行動。魔法の能力補正は既存`Skill.modifiers`へ渡す。定義の補正配列は戦闘ごとに複製。
- 墓標の番兵：既存archiveGuardの防御・反撃。水×1.25、土×0.75。
- 記憶喰らい：通常攻撃に睡眠15%／沈黙20%、各2行動。
- 虚星のウィスプ：風属性魔法100、高速83。
- 崩壊機兵：既存予約機構に物理予兆を指定。通常は攻撃72、3行動周期の第2行動で予兆、次回に物理110。
- 終焉の使徒：既存火・水を行動数に応じて使い分ける。通常102、予約126。新属性は追加しない。
- アストラセンチネル：物理重撃105、防御・反撃を伴う予兆、次回に物理120の全体攻撃。水×1.25、光×0.75。勝利後に荷重記録を解放。
- エンドオブザーバー：HP65%・30%で3段階。第1段階は防壁と物理、第2段階は闇／光の魔法112と攻撃力−15%、暗闇・沈黙各20%・2行動。第3段階は通常132、全体予兆180と別予兆168を切り替える。以前の予約150は行動不能・段階移行後も保持し、実際に予約した数値と名称で解放。風×1.25、闇×0.5。既存のサンダー（雷表現・内部wind）で弱点を突ける。

新AIは既存EnemyScriptへ任意の物理予約・単体威力・交互属性・補正・別予兆を追加したもの。旧プロファイルのデータ値は変更しない。単体攻撃は挑発→かばう、全体攻撃は各生存者に個別のかばう・ガード・軽減を適用する。星力は実際のHP減少に基づく既存処理。数値表示はBattleEventの実測値を使う。

```json
{
  "collapseSoldier": {
    "observer": false,
    "physicalFirst": true,
    "chargePhysical": true,
    "guardOnCharge": false,
    "element": "earth",
    "normalPower": 0,
    "finalNormalPower": 0,
    "chargePower": 110,
    "finalChargePower": 110,
    "spell": "崩壊打撃",
    "charge": "破断の踏み込み",
    "finalCharge": "破断の踏み込み",
    "statuses": []
  },
  "endApostle": {
    "observer": false,
    "alwaysMagic": true,
    "guardOnCharge": false,
    "element": "fire",
    "alternateElement": "water",
    "normalPower": 102,
    "finalNormalPower": 102,
    "chargePower": 126,
    "finalChargePower": 126,
    "spell": "交差する終焉術",
    "charge": "対星の反響",
    "finalCharge": "対星の反響",
    "statuses": []
  },
  "graveSentinel": {
    "singlePower": 105,
    "observer": false,
    "physicalFirst": true,
    "chargePhysical": true,
    "guardOnCharge": true,
    "counterOnCharge": true,
    "chargeAll": true,
    "element": "earth",
    "normalPower": 0,
    "finalNormalPower": 0,
    "chargePower": 120,
    "finalChargePower": 120,
    "spell": "守護機の重撃",
    "charge": "墓標防衛波",
    "finalCharge": "墓標防衛波",
    "statuses": []
  },
  "endObserver": {
    "finalAlternatePower": 168,
    "finalAlternateCharge": "帰還路の断層",
    "observer": true,
    "guardFirst": true,
    "guardLabel": "第1段階：観測防壁",
    "physicalFirst": true,
    "guardOnCharge": true,
    "chargeAll": true,
    "element": "dark",
    "alternateElement": "light",
    "normalPower": 112,
    "finalNormalPower": 132,
    "chargePower": 150,
    "finalChargePower": 180,
    "spell": "記録改変",
    "charge": "終焉時刻の予測",
    "finalCharge": "終焉の再予測",
    "statuses": [
      {
        "id": "blind",
        "chance": 0.2,
        "turns": 2
      },
      {
        "id": "silence",
        "chance": 0.2,
        "turns": 2
      }
    ],
    "normalModifiers": [
      {
        "stat": "attack",
        "amount": -0.15,
        "turns": 2
      }
    ]
  }
}
```

### 戦闘の出現位置

- `grave-gate`：`grave-gate-gateway-fight`、(624, 496)、patrol、`grave-gate`。
- `grave-field`：`grave-field-field-fight`、(624, 496)、patrol、`grave-field`。
- `grave-ruins`：`grave-ruins-ruins-fight`、(624, 496)、patrol、`grave-ruins`。
- `grave-memory`：`grave-memory-sanctum-fight`、(624, 496)、patrol、`grave-memory`。
- `grave-observatory`：`grave-observatory-archive-fight`、(624, 496)、patrol、`grave-observatory`。
- `grave-sanctuary`：`grave-sanctuary-sanctuary-fight`、(624, 496)、patrol、`grave-sanctuary`。
- `grave-tower`：`grave-tower-fracture-fight`、(624, 496)、patrol、`grave-tower`。
- `grave-core`：`grave-core-end-observer`、(688, 496)、idle、`grave-end-observer`。
- 中ボスは従来の地点UI `c16-gate` のイベント `c16-sentinel` から開始。

## 新武器

```json
[
  {
    "id": "grave-longbow",
    "name": "星墓の長弓",
    "family": "bow",
    "owner": "astel",
    "bonuses": {
      "attack": 21,
      "speed": 7
    },
    "effects": {},
    "description": "帰還灯を探す長弓。攻撃＋21、速度＋7。系統補正の二重加算はしない。"
  },
  {
    "id": "endward-shield-spear",
    "name": "終焉守の盾槍",
    "family": "shieldSpear",
    "owner": "rina",
    "bonuses": {
      "attack": 17,
      "defense": 23,
      "maxHp": 30
    },
    "effects": {
      "guardReduction": 0.06,
      "coverReduction": 0.04
    },
    "description": "帰還路を守る盾槍。攻撃＋17、防御＋23、HP＋30。ガード軽減＋6%、かばう軽減＋4%。"
  },
  {
    "id": "memory-rod",
    "name": "記憶のロッド",
    "family": "rod",
    "owner": "mei",
    "bonuses": {
      "attack": 20,
      "maxMp": 22
    },
    "effects": {
      "magicRate": 1.2
    },
    "description": "異なる声を重ねて残すロッド。攻撃＋20、MP＋22。属性魔法20%強化。"
  }
]
```

リナは接続イベント、アステルは塔の会話、メイは最終ボスで一度だけ取得。既存所有数・装備制限・比較・成長・戦闘開始時の能力反映を使い、系統特性を別に重ねない。メイのロッドは属性魔法20%強化。スキル習得レベルや星力の保存は変更しない。

## 依頼・選択・冒険手帳

```json
{
  "quests": [
    {
      "id": "sq-lost-star-names",
      "chapterId": "chapter-16",
      "name": "SQ-40 消えた星の名前",
      "giver": "エルシア",
      "description": "星名の札と観測台帳の索引を照合して、消えた星を別々の名前で残す。",
      "returnLocation": "c16-camp",
      "objectives": [
        {
          "id": "star-name",
          "name": "遺跡の星名札",
          "locationId": "c16-monuments",
          "requires": []
        },
        {
          "id": "star-index",
          "name": "観測所の索引",
          "locationId": "c16-archive",
          "requires": [
            "star-name"
          ]
        }
      ],
      "reward": {
        "item": "potion",
        "count": 3
      }
    },
    {
      "id": "sq-last-patrol",
      "chapterId": "chapter-16",
      "name": "SQ-41 守護者の最後の任務",
      "giver": "カイル",
      "description": "巡回標識と連絡端子を修復し、帰還する者を迎える道を守る。",
      "returnLocation": "c16-seal",
      "objectives": [
        {
          "id": "patrol-sign",
          "name": "回廊の巡回標識",
          "locationId": "c16-sanctum",
          "requires": []
        },
        {
          "id": "patrol-terminal",
          "name": "詰所の連絡端子",
          "locationId": "c16-seal",
          "requires": [
            "patrol-sign"
          ]
        }
      ],
      "reward": {
        "experience": 1000
      }
    },
    {
      "id": "sq-memory-promise",
      "chapterId": "chapter-16",
      "name": "SQ-42 記憶の向こうの約束",
      "giver": "リュリア",
      "description": "祭壇の声と塔の返信票を、話者を決めつけず照合する。",
      "returnLocation": "c16-refuge",
      "objectives": [
        {
          "id": "voice-note",
          "name": "祭壇の声の断片",
          "locationId": "c16-corridor",
          "requires": []
        },
        {
          "id": "reply-slip",
          "name": "塔の返信票",
          "locationId": "c16-fracture",
          "requires": [
            "voice-note"
          ]
        }
      ],
      "reward": {
        "item": "ether",
        "count": 3
      }
    }
  ],
  "choices": [
    {
      "id": "c16-elsia",
      "eventId": "c16-elsia",
      "chapterId": "chapter-16",
      "name": "どこから記録を読むか",
      "options": [
        {
          "id": "confirm",
          "label": "欠けた通信を確かめる",
          "speaker": "エルシア",
          "response": "欠けている部分も、確かめた条件と一緒に残しましょう。"
        },
        {
          "id": "listen",
          "label": "日常の記録を探す",
          "speaker": "エルシア",
          "response": "終わりだけでなく、その前にあった暮らしも読み直してみるわ。"
        }
      ]
    },
    {
      "id": "c16-kyle",
      "eventId": "c16-kyle",
      "chapterId": "chapter-16",
      "name": "守護者への返事",
      "options": [
        {
          "id": "confirm",
          "label": "命令の届け先を調べる",
          "speaker": "カイル",
          "response": "受領欄まで確かめる。命令だけで現場を決めてはならないな。"
        },
        {
          "id": "listen",
          "label": "今守る相手を確かめる",
          "speaker": "カイル",
          "response": "今ここにいる者の帰還も、私の任務として記そう。"
        }
      ]
    },
    {
      "id": "c16-lyria",
      "eventId": "c16-lyria",
      "chapterId": "chapter-16",
      "name": "断片の声の残し方",
      "options": [
        {
          "id": "confirm",
          "label": "空白もそのまま記す",
          "speaker": "リュリア",
          "response": "聞こえなかったと言ってもいいんだね。ありがとう。"
        },
        {
          "id": "listen",
          "label": "別々の声として残す",
          "speaker": "リュリア",
          "response": "違っている声を、私が勝手に一人にしなくていいんだね。"
        }
      ]
    },
    {
      "id": "c16-tower-reading",
      "eventId": "c16-tower-reading",
      "chapterId": "chapter-16",
      "name": "終わりを知った先で",
      "options": [
        {
          "id": "confirm",
          "label": "今できることを選ぶ",
          "speaker": "アステル",
          "response": "知ったことで、今の一歩を誰かに任せたりしないよ。"
        },
        {
          "id": "listen",
          "label": "まだ知らないことを残す",
          "speaker": "アステル",
          "response": "分からない所を残すことも、次に確かめる道になる。"
        }
      ]
    },
    {
      "id": "c16-promise",
      "eventId": "c16-promise",
      "chapterId": "chapter-16",
      "name": "未来への問い",
      "options": [
        {
          "id": "confirm",
          "label": "帰る道を一緒に残す",
          "speaker": "リナ",
          "response": "行く道と帰る道の両方を守る。答えを急ぐ必要はないわ。"
        },
        {
          "id": "listen",
          "label": "問いを次の人に渡す",
          "speaker": "リナ",
          "response": "受け取る人が選べるように、私たちの見た条件も添えましょう。"
        }
      ]
    }
  ],
  "journal": [
    {
      "id": "j16-1",
      "chapterId": "chapter-16",
      "eventId": "c16-arrival",
      "kind": "summary",
      "title": "星冠が示した墓標",
      "text": "星冠の部分修復で広がった観測範囲から、消えた星の記録が眠る座標を得た。"
    },
    {
      "id": "j16-2",
      "chapterId": "chapter-16",
      "eventId": "c16-elsia",
      "kind": "npc",
      "title": "記録官エルシア",
      "text": "終焉の時刻だけでなく、欠けた通信と日常の記録を出典付きで調べる記録官。"
    },
    {
      "id": "j16-3",
      "chapterId": "chapter-16",
      "eventId": "c16-kyle",
      "kind": "npc",
      "title": "巡回守護者カイル",
      "text": "命令と受領先を照合し、記録を守る任務へ今いる旅人の帰還を加えた。"
    },
    {
      "id": "j16-4",
      "chapterId": "chapter-16",
      "eventId": "c16-lyria",
      "kind": "npc",
      "title": "声を聞くリュリア",
      "text": "消えた声の断片を聞き取る少女。霜境や白銀のミラとは別人で、空白も声と一緒に残す。"
    },
    {
      "id": "j16-5",
      "chapterId": "chapter-16",
      "eventId": "c16-projection",
      "kind": "record",
      "title": "見える橋と渡れる橋",
      "text": "記憶投影で橋の輪郭が現れた。接続するまで荷重を支えず、通路にはならない。"
    },
    {
      "id": "j16-6",
      "chapterId": "chapter-16",
      "eventId": "c16-connection",
      "kind": "record",
      "title": "今を支える記憶接続",
      "text": "守護機の認証で荷重記録を解放した。過去の構造を今の足場として利用できる。"
    },
    {
      "id": "j16-7",
      "chapterId": "chapter-16",
      "eventId": "c16-seer-record",
      "kind": "record",
      "title": "返事の保留欄",
      "text": "接続先を選ぶ照会と返事の保留が並ぶ。星の消滅に選択が関わった可能性はあるが、原因も選んだ者もまだ断定できない。"
    },
    {
      "id": "j16-8",
      "chapterId": "chapter-16",
      "eventId": "c16-clear",
      "kind": "summary",
      "title": "終焉記録の宛先",
      "text": "観測者の原本から、星脈の合流点へ続く未送信の宛先を得た。記憶のロッドを携え、第17章へ進む準備をする。"
    }
  ]
}
```

依頼を完了しなくても主筋は進める。受領状態と報酬は既存の一括確定を使い、回復品の上限で受け取れない場合は未受領のまま再試行できる。選択は確定直後に保存し、再訪で上書きしない。手帳は各到達イベント・確定選択に応じて解放し、未到達の情報や欠けた旧選択を補完しない。

## 会話全文

### 残された座標（`c16-arrival`）

- **メイ**：星冠の未接続環に、新しい座標が浮かんだ。第15章で残した別の道が、観測の範囲を広げたんだ。
- **リナ**：戻る座標も記しておくわ。先の終わりが見えても、ここへ帰る道まで手放さない。
- **アステル**：星の墓標……消えた星にも、名前を呼ぶ人がいたはずだ。まず、その記録から探そう。

### 星屑の巡回者（`c16-gateway-fight`）

- **カイル**：そこから先は記録保全区域だ。残骸の動きが変わった。立ち止まらず、互いの退路を守れ。
- **リナ**：敵の予兆は文字でも確かめる。メイ、回復の余力を残して。

### 入口の救援箱（`c16-gateway-cache`）

- **エルシア**：持っていって。救援隊の備えは、誰かが戻ってくるために置かれたものだから。
- **アステル**：使った分も記しておくよ。届かなかった救援の記録まで、なかったことにはしない。

### 記録官の問い（`c16-elsia`）

- **エルシア**：私は記録官エルシア。この星が終わった時刻は分かる。でも、その直前の通信は一部が欠けている。
- **アステル**：時刻だけで、ここにいた人の選択まで決められない。残っているものを一緒に確かめたい。
- **エルシア**：記録を信じることと、記録だけを信じることは違うのね。あなたたちは、どこから調べたい？

### 星屑の荒野の巡回者（`c16-field-fight`）

- **エルシア**：記録板へ近づくと、星屑の群れが動くわ。歩ける場所を確かめながら進みましょう。
- **アステル**：星の名前を調べるための道だ。皆が戻れる場所も残して切り開くよ。

### 終焉時刻の余白（`c16-field-record`）

- **メイ**：同じ終焉時刻なのに、避難路の開閉記録が一致しない。時計が壊れただけでは説明できないよ。
- **エルシア**：誰かが誤りを直そうとして上書きしたと思っていた。でも、別々の立場の記録だったのかもしれない。

### 荒野の携行箱（`c16-field-cache`）

- **エルシア**：星名の札を守っていた人の携行箱ね。記録の裏に、救援のための薬が残っている。
- **リナ**：持ち出す品と使い道を記しておくわ。次に来る人へ、何が残ったか伝えましょう。

### 過去の輪郭（`c16-projection`）

- **メイ**：投影装置が応答した！ 建物と橋の輪郭が見える。でも荷重の記録がない。今は眺められるだけで、渡れないよ。
- **リナ**：見えることと、安全に使えることを分けましょう。足元の通路は現実のまま残しておくわ。
- **エルシア**：薄い線は記憶投影、足場のある線は接続済み。案内にも、その違いを残す。

### 巡回守護者との対立（`c16-kyle`）

- **カイル**：装置を触るな。私は墓標を変えずに守ると命じられた。あの日、退路を閉じた命令まで変えていいのか。
- **リナ**：記録を守るために、今いる人まで閉じ込めるの？ 私は、その境目を確かめたい。
- **カイル**：守る相手を取り違えたくはない。ならば、命令書と現場を照合しろ。私も同行する。

### 遺跡の巡回防衛（`c16-ruins-fight`）

- **カイル**：崩壊機兵が巡回路へ戻ってきた。踏み込みの予兆を見たら、装甲の陰へ誘導するより先に防御を。
- **メイ**：投影された壁には隠れられないよ。今の足場だけを使って備えよう。

### 二つの命令書（`c16-monument-record`）

- **メイ**：封鎖命令の裏に、避難許可がある。どちらも本物で、届け先が違う。同じ記録を全員に見せれば済む話じゃないんだ。
- **アステル**：誰に届いたのかも調べよう。命令を出した人だけが、ここで選んだわけじゃない。

### 遺跡の避難備蓄（`c16-ruins-cache`）

- **リナ**：二つの命令書のそばに、避難する人のための備蓄がある。ここへ残った人も、帰還を待っていたのね。
- **カイル**：記録はそのまま残す。物資は今、必要な者へ渡そう。

### 冷めた食卓のそばで（`c16-camp-rest`）

- **エルシア**：終焉の記録ばかり見ていると、ここで朝食を待った人がいたことを忘れそうになる。
- **リナ**：私たちも休みましょう。次の戦いはいつもどおりHP・MPを整えてから。見る人が倒れたら、記録は届かないわ。

### 断片を聞く少女（`c16-lyria`）

- **リュリア**：私はリュリア。ここには、もういない人の声が時々重なるの。「待って」と「先へ」が、同じ場所から聞こえる。
- **メイ**：一つの声にまとめなくていい。聞こえた順序と、聞こえなかった所を一緒に残そう。
- **リュリア**：分からないと言っても、ちゃんと聞いたことになる？ なら、二人とも置いていかずに済むね。

### 記憶をほどく影（`c16-sanctum-fight`）

- **リュリア**：声の隙間に、別の音が入ってくる。私の言葉まで薄くなりそう……。
- **リナ**：ここは私が守る。状態異常と残りMPを見ながら、焦らず一体ずつ止めましょう。

### 回廊の記録箱（`c16-hall-cache`）

- **リュリア**：箱の札からも声が聞こえる。「これを持って、道を間違えないで」って。誰かを送り出した声だと思う。
- **アステル**：誰の声か分からない所も書いておこう。今受け取った気持ちは、僕たちが先へ持っていく。

### 声を消さない筆記（`c16-seal-record`）

- **カイル**：任務記録には、撤退した者を失踪と記せとある。だが、この声は戻る約束を話している。
- **エルシア**：結末が記録と違っても、その人の言葉は消さない。失踪と避難を同じ欄へ押し込めないわ。

### 観測所の残存防衛（`c16-archive-fight`）

- **メイ**：観測所の機兵が起きた。属性の弱点を確かめよう。魔法だけで押し切らず、予兆が出たら防御も選んで。
- **アステル**：記録を読む場所を守って、皆で先へ進むよ。

### 転送されなかった返事（`c16-archive-record`）

- **エルシア**：星の消滅前に、選択を求める照会があった。でも住民からの返事だけ、送信済みの印がない。
- **メイ**：故障か、保留か、誰かの操作か。今の記録だけじゃ断定できない。観測者が原本を持っているかもしれないよ。

### 観測所の保守箱（`c16-observatory-cache`）

- **メイ**：観測器を止めるための薬剤と、魔力を補う品が分けてある。装置を動かし続けるだけが、保守の仕事ではなかったんだね。
- **エルシア**：休止した記録にも意味がある。必要な分を受け取って、残りを確かめましょう。

### 庭に残る一日（`c16-garden-rest`）

- **アステル**：誰かがこの庭へ帰ってくると思って、花を植えたんだろうな。終わりを知っていたら、植えなかったのかな。
- **リュリア**：聞こえたよ。「今日の花を見てほしい」って。明日のためだけじゃなかったんだね。

### 守護機の封鎖（`c16-sentinel`）

- **カイル**：墓標守護機・アストラセンチネル。高い装甲と反撃機構がある。強攻撃と広域放射は別々の予兆を出す。
- **リナ**：予兆を見て備える。守ることが止まることと同じか、私たちの戦い方で示すわ。

### 記憶を支える足場（`c16-connection`）

- **カイル**：認証が通った。観測所の荷重記録を解放する。これは消えた星を生き返らせる鍵ではない。今いる者が橋を渡る許可だ。
- **メイ**：記憶接続が成立したよ。半透明だった橋に、今の足場が重なった。地図の通路も同じ状態に更新された。
- **リナ**：終焉守の盾槍、預かるわ。記録だけでなく、今ここを歩く人も守るために。

### 渡った人の順序（`c16-bridge-record`）

- **エルシア**：橋の通過記録が戻った。避難の列は途中で戻り、誰かを待っていた。命令どおりに進んだ一列ではない。
- **アステル**：迷いながら選んだ足跡なんだ。結末だけを見て、間違いだったと片づけたくない。

### 祭壇の防衛反応（`c16-sanctuary-fight`）

- **カイル**：祭壇の防衛が反応した。複数の属性を扱う使徒がいる。敵の行動名と次の予兆を見てくれ。
- **メイ**：私たちの属性相性も今までと同じ。弱点を突ける時に攻めて、無理な時は備えよう。

### 残された星の名前（`c16-civilization-record`）

- **リュリア**：ここからなら、声が別々に聞こえる。星の名前を呼び合っているの。消えたあとも、相手の名前を忘れないように。
- **エルシア**：年代と場所を添えて残すわ。名前が似ていても、一つの星と決めつけない。

### 祭壇の保管箱（`c16-memory-cache`）

- **カイル**：持ち出し記録に空欄がある。必要な人が使った品を、盗難として処理したのかもしれない。
- **リナ**：今日は使い道と受取人を残していきましょう。戻ってくる人が、次に困らないように。

### 帰還灯を見直す（`c16-refuge-rest`）

- **リナ**：帰還灯は点いている。私たちの時間は、終焉の記録へ閉じ込められていない。ここで少し息を整えましょう。
- **メイ**：過去を知ったことと、同じ結末になることは違う。次の戦いの準備も、今の私たちが決めるんだね。

### 終焉の塔の残響（`c16-fracture-fight`）

- **エルシア**：塔は星の最後の観測を保管している。防衛記録が動くわ。読み解く時間を確保しましょう。
- **アステル**：僕が道を作る。終わりの記録の奥に、まだ届かなかった返事があるはずだ。

### 未来を射抜くのではなく（`c16-tower-reading`）

- **アステル**：星墓の長弓には、戻る人の灯りを探す照準がある。結末を射止めるための道具じゃないんだ。
- **リュリア**：聞こえた言葉を書いてもいい？ 「終わると分かっていても、君の選ぶことを止めたくない」って。
- **アステル**：誰が誰へ言ったのか、まだ分からない。僕たち自身の答えも、記録の代わりにはしないよ。

### 塔の帰還備蓄（`c16-tower-cache`）

- **リナ**：塔から下りる人へ向けた箱だわ。上へ進む者のためだけじゃなく、帰る者の用意もあった。
- **カイル**：今日の巡回記録へ、そのことも追記する。もう封鎖命令だけの塔にはしない。

### 過去と現在の照合（`c16-integration`）

- **メイ**：まず過去の記録を読み、次に現在の足場で確かめ、最後に違いを残したまま統合する。一致しない声を消す必要はないよ。
- **エルシア**：消えた橋の輪郭と、今を支える接続が並んだ。記憶統合が成立すれば、中枢への安全路が開く。

### 返事の保留欄（`c16-seer-record`）

- **メイ**：星の消滅は、ただの自然現象ではなかった可能性がある。この欄には「接続先の選択」と「返事の保留」が並んでいる。
- **エルシア**：でも、誰が何を選んだかは欠けている。終焉の原因だと断定せず、次の原本と照合しなければ。
- **アステル**：重大な選択があったかもしれない。それを知って、今どうするかは僕たちが決める。

### 観測者へ渡す問い（`c16-promise`）

- **リュリア**：終わりを聞いた声も、今ここにいる私の声とは違う。怖くても、続きを聞きたいって、私は選べるかな。
- **リナ**：選べるわ。聞くのをやめることも、また戻ってくることも。あなたの声を私たちの答えにすり替えない。
- **カイル**：私は帰還路を守る。記録の終点を、旅人の終点にはしない。

### 中枢への通行記録（`c16-inherit`）

- **エルシア**：記憶統合を確認した。中枢へ進む許可と、ここへ戻る経路を同じ記録に残す。
- **メイ**：消えた星の過去と、私たちの現在が混ざらず並んでいる。あとは観測者本人に、聞いてみよう。

### 中枢の待機備蓄（`c16-core-cache`）

- **エルシア**：観測を受ける前の待機箱。次へ進む人にも、ここで引き返す人にも開けられるよう残されている。
- **メイ**：今の準備を確かめよう。記憶の統合は終わったけれど、戦い方は私たちが選ぶんだ。

### 終わりを記録する者（`c16-end-observer`）

- **エンドオブザーバー**：我は終焉の観測者。記録の終端に至る者を、三度観測する。防護、記録改変、終焉予測。
- **アステル**：終わりの記録は消さない。でも、その先へ進む人を止める答えにはさせない。
- **メイ**：予測が始まっても、私たちの行動は止まらない。予兆を見て、守って、回復して、選び直すよ。

### 未送信の宛先（`c16-clear`）

- **エンドオブザーバー**：観測を終える。星の消滅の前に、接続先を選ぶ照会が送られた。返事を受け取る場所は、この墓標ではない。
- **エルシア**：未送信の宛先……星脈の合流点。第17章へつながる原本の所在を、今度こそ出典と一緒に残すわ。
- **リュリア**：消えた声は戻らない。でも、今聞いたことを誰に渡すかは選べる。私は、まだ続きを聞きたい。
- **リナ**：カイルが帰る灯りを守ってくれている。私たちも今の道を歩きましょう。
- **アステル**：結末はまだ僕たちのものじゃない。星の墓標で受け取った問いを、次の人へ持っていこう。

## 保存互換性と計算順序

保存キー`astra-chronica:v1`、schema2を維持。新章進行は既存のcompleted配列・章別訪問・選択・依頼・装備数量で保持する。記憶投影を保存フラグとして増設しない。未知ID・不正な順序・不正座標を既存正規化で検証する。旧1〜15章、90ノード、レベル、装備、回復品、依頼、選択、手帳条件、鉄道6駅・方舟8区画・星界位相を保持する。

能力は従来どおり、基本値→レベル成長→装備／星脈の恒久補正→戦闘中の実効補正。ダメージは既存の物理／魔法、会心、属性、守備・かばう・盾、上限処理を維持する。変更は新AIが渡す威力・属性・追加補正と予約名称の選択であり、計算式を書き換えない。新しい物理重撃・物理予約は基準威力に実効攻撃力／基本攻撃力の比を掛け、攻撃バフ・デバフと火傷を一度だけ反映する。物理の属性は従来どおり攻撃者のattackElement（新敵は無属性）で、プロフィールのelementは魔法側に用いる。正常な旧プロファイルの分岐結果は変わらない。戦闘開始時は従来どおりHP・MP全快で、永続HPを追加しない。

未確定戦闘は結果・報酬を与えず既存の安全復帰へ戻す。確定済みserialとイベントは再適用しない。保存なしLabは独立したProgressを使い、本編の装備・会話・探索へ混入させない。

## 検証手順

```sh
npm test
npm run build
# 別ターミナルで npm run dev -- --port 5174 と npm run preview -- --port 4195 を起動
BASE_URL=http://localhost:4195 UI_TEST_URL=http://localhost:5174 node tests/browser-suite.mjs --v24
BASE_URL=http://localhost:4195 UI_TEST_URL=http://localhost:5174 node tests/browser-suite.mjs --legacy
BASE_URL=http://localhost:4195 npm run test:capture-v24
```

標準Chromiumは`/usr/bin/chromium`。必要に応じて長時間の巡回はCanvasを使用するが、標準WebGLのsmokeは分離して実行する。`CHROMIUM_PATH`と`WEBGL_CHROMIUM_PATH`で実行ファイルを指定できる。追加依存は不要。

## 検証結果（実行中）

基準mainは33ファイル・1,572件成功。初回の新章単体テストでは重複登録・重複ID・追加宝箱に伴う前提変更を検出し修正。投影段階の橋・74マップ・全38イベント・Lv50戦闘を再検証中。旧章の章数・未実装章表示は第16章追加に合わせた厳密な期待値へ更新し、既存テストの削除・skip・時間制限緩和は行わない。

利用上限で一度停止し、再開直後は終了していたテスト用HTTPサーバーへの接続が失敗した。これはブラウザがゲームを読み込む前の環境失敗として、ゲーム内テストの成否と分離する。実際の最終結果・件数・画像は完了後に追記する。未実行の成功は記載しない。

## 未確認・範囲外

iPhone Safari実機は未確認。Chromiumタッチと4幅、標準WebGLで確認する。第17〜18章・正式画像・ジョブ変更・mainマージ・GitHub Pages公開・PLiCy投稿は行わない。既存Phaserチャンクの500kB超警告は残る。新8マップは共通の仮グリッド・図形を使用し、正式な背景制作は含まない。
