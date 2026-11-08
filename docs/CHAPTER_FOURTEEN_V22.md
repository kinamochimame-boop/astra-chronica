# v2.2 第14章「逆さの星海と忘却の方舟」

## 基準と維持仕様

最新mainは指定の `fdbcd7e94edaa0ca9fa425344633010bae60b2b3` と一致。`feature/v2.2-chapter-fourteen-exploration` で作業。第13章クリアで第14章を解放し、第15〜18章は未実装・未解放。3人固定、武器9系統、90ノード、7属性・7状態異常、レベル上限50、旧敵AIとダメージ計算、既存50マップ、Pages設定を維持する。mainマージ・Pages公開・PLiCy投稿は行わない。

## 物語とNPC

第13章の天球儀は本物の空への窓ではなく、観測した星々の記録を映す装置だった。その確定設定を維持し、東の高原の観測路で古い座標と転送門が一致する導入にした。記録を現在だと決めつけず、帰還の印を残して逆さの星海へ渡る。

方舟ノアティスは星々の記憶と人々の願いを未来へ運ぶ船。重力異常とともに「願いを同一に保つ」保全命令が乗員の変化まで故障扱いし、船を閉じ込めていた。過去を捨てず、過去の再演も強いず、今の人が航路を選び直す。

- **セリオ**：自身の過去を覚えていない記録管理人。読めない署名を空欄として整理していたが、今の自分が頁を預かる仕事を選ぶ。依頼名のセレスは第7章の星樹管理者と衝突するため変更し、既存セレスは変更しない。
- **バルク**：現実的な保守責任者。再開の危険だけでなく停止を続ける損失にも気づき、止める手順と再開する権限を分ける。依頼名ガルドは第9章の防衛隊長、候補グレンも第11章の護送隊長と衝突したため、未使用名へ変更した。
- **ユノ**：記録と少し違う星海を覚える少女。同じ景色へ戻すのではなく、自分が見た空を描くことを選ぶ。

アステルは受け手が選び直せる約束を、リナは思い出を読まない人の休息と退路を、メイは記録と今の違い・荷重の分散を担う。第9章の記憶、第10章の観測、第11章の余白、第12章の循環、第13章の天球儀を結ぶ。新事実は、星詠みの約束が「問い直す権利」とともに運ばれていたこと。署名の全てや最終章の真相は確定せず、第15章は北の氷環への予告のみ。

## 16地点・28イベント

順次解放。未解放地点への移動は禁止。依頼受領・選択の種類はメイン進行条件にしない。歩行マップは既存の接触戦闘、残る8地点は従来UIを使用する。休息は戦闘開始時HP・MP全快という既存仕様を維持し、永続HP管理を増やさない。

|地点ID・地点|イベントID・名称|歩行マップ|
|---|---|---|
|c14-gateway 星海への転送門|c14-arrival 地図にない星の岸 / c14-gateway-fight 転送路の漂う影 / c14-gateway-cache 帰還者の備え箱|ark-gateway|
|c14-shore 逆さの星海|c14-keeper 名を忘れた管理人 / c14-control-start 帰る区画をつなぐ|ark-shore|
|c14-dock 方舟接岸区|c14-bulk 閉じた接岸許可 / c14-dock-fight 方舟の警備線 / c14-passengers 空欄の乗員名|ark-dock|
|c14-deck 願いを載せた甲板|c14-bow 願いを射る弓|従来地点UI|
|c14-hall 方舟中央回廊|c14-gravity-shift 床の基準を変える / c14-yuno 足元の空を覚える子|ark-hall|
|c14-beacon 逆光の灯台|c14-beacon-sign 消す警報、伝える灯り|従来地点UI|
|c14-gravity 重力反転区画|c14-gravity-reading 消えかけた署名 / c14-gravity-record 閉鎖された航海日誌|ark-gravity|
|c14-refuge 水平の休憩室|c14-refuge-rest 忘れても休める部屋|従来地点UI|
|c14-records 記憶保存庫|c14-records-fight 保存庫の警報 / c14-records-record 残すこと、閉じ込めること|ark-records|
|c14-garden 願いの温室|c14-garden-rest 次の花を待つ庭|従来地点UI|
|c14-sanctuary 星詠みの聖域|c14-sanctuary-fight 星海の監視者 / c14-sanctuary-tablet 約束を運んだ船|ark-sanctuary|
|c14-bridge 記憶連絡橋|c14-bridge-record 荷を分ける連絡橋|従来地点UI|
|c14-gate 方舟の隔壁門|c14-guardian 方舟守護機・グラビティガード / c14-gate-tune 再開するための規律|従来地点UI|
|c14-charts 航路記録室|c14-gravity-stabilize 固定・接続・均衡 / c14-yuno-choice 同じ景色でなくても|従来地点UI|
|c14-altar 星約の祭壇|c14-promise 問いを渡す約束|従来地点UI|
|c14-core 方舟中枢|c14-zero 忘却の星舟・ノアゼロ / c14-clear 記憶を載せて、今を進む|ark-core|

重力安定のパズルは **固定→接続→均衡**。誤答・リセット・3段階の文字ヒント・再挑戦に対応。並べかけは再読み込みでリセットし、確定した完了・報酬は保持する。全イベントの会話は後述する。

## 重要選択と冒険手帳

5件各2択、全32組み合わせで章クリア可能。確定直後に保存し、再訪で上書きしない。旧セーブに会話選択を推測して補完しない。

|選択ID|選択肢・応答者|
|---|---|
|c14-keeper|keep-page：名のない頁も残す（セリオ） / ask-today：今の仕事を聞く（セリオ）|
|c14-yuno|compare-view：違う景色を比べる（メイ） / listen-feeling：ユノの感じ方を聞く（ユノ）|
|c14-gravity-reading|leave-sign：読めない署名を残す（アステル） / rest-first：読む前に休む（リナ）|
|c14-yuno-choice|draw-now：今の景色を描く（ユノ） / keep-two：古い頁も並べて残す（セリオ）|
|c14-promise|carry-question：問いを未来へ運ぶ（アステル） / share-route：航路を皆で選ぶ（バルク）|

|記事ID|記事|解放イベント|
|---|---|---|
|j14-1|足元の星海|c14-arrival|
|j14-2|記録管理人セリオ|c14-keeper|
|j14-3|保守責任者バルク|c14-bulk|
|j14-4|星海を覚えるユノ|c14-yuno|
|j14-5|変わる床、残す退路|c14-gravity-shift|
|j14-6|同じ願いを強いた閉鎖|c14-records-record|
|j14-7|固定・接続・均衡|c14-gravity-stabilize|
|j14-8|記憶を載せて、今を進む|c14-clear|

未到達の記事は非表示。探索記録は16地点＋28イベント＋3依頼＝47項目。メイン完了93%、全依頼受領で100%。

## 敵・編成・ボス

|ID・敵|HP|攻撃|防御|速度|EXP|属性相性|
|---|---:|---:|---:|---:|---:|---|
|inverted-beast 反転の幻獣|850|68|36|78|560|全て1.0|
|ark-sentry 方舟警備機|970|68|47|41|580|water×1.25 / earth×0.75|
|starsea-wisp 星海ウィスプ|890|64|38|49|550|全て1.0|
|memory-eater 記憶喰らい|910|67|37|53|560|全て1.0|
|stardust-horror 星屑の異形|870|63|36|60|570|light×1.25 / dark×0.75|
|void-watcher 虚空の監視者|880|66|37|51|570|全て1.0|
|gravity-guard 方舟守護機・グラビティガード|4800|68|48|43|1900|water×1.25 / light×0.75|
|noa-zero 忘却の星舟・ノアゼロ|6800|69|40|47|2600|water×1.25 / dark×0.5|

全8種：MP／最大MPは0、基底レベル1で上表の数値を直接指定。通常攻撃は無属性。睡眠・凍結耐性20%、他0%。未記載属性は1.0。既存敵AIと同じく、敵魔法は固定威力・MP非消費。属性・状態異常・計算式は追加しない。

- 星海ウィスプ：水魔法102、沈黙15%／2行動。
- 方舟警備機：既存archiveGuardの防御と1回の物理反撃。
- 反転の幻獣：速度78の通常物理。
- 記憶喰らい：物理攻撃に毒20%・麻痺15%／各2行動。
- 虚空の監視者：闇魔法98。3行動周期の2回目に予兆、次の実行可能行動で全体「虚空放射」120。
- 星屑の異形：闇魔法104、沈黙15%／2行動。

|編成ID|敵|EXP／人|
|---|---|---:|
|ark-gateway|反転の幻獣 / 方舟警備機 / 星海ウィスプ|1690|
|ark-dock|星海ウィスプ / 方舟警備機 / 虚空の監視者|1700|
|ark-records|記憶喰らい / 星屑の異形 / 虚空の監視者|1700|
|ark-sanctuary|反転の幻獣 / 星海ウィスプ / 方舟警備機|1690|
|ark-guardian|方舟守護機・グラビティガード|1900|
|ark-zero|忘却の星舟・ノアゼロ|2600|

本編合計 **11,280EXP／人**、任意依頼800は別。第13章10,760から緩やかに増加。既存の報酬だけで第13章を終えた時点はLv50。上限を引き上げず、90ノードの全取得を攻略条件にしない。

### ボスの行動

- **グラビティガード**：高防御。土魔法「重力圧」98→防御と予兆→全体「反転重圧」112。対象ごとの防御・かばう・障壁を既存Battleで処理する。
- **ノアゼロ**：HP65%超／30%超65%以下／30%以下の3段階。防衛段階は物理主体、侵食段階から偶数行動で闇魔法「記憶侵食」106（最終126）、暗闇・沈黙各20%／2行動。周期2回目に防御と全体予兆。次の実行可能行動で「忘却の奔流」144、最終段階で新規に予約する攻撃は「星海崩壊」174。最終段階の物理補正は既存1.15倍。
- 行動不能で予約は消えず、段階移行でも予約144を174へ上書きしない。全体攻撃を挑発で単体化せず、実被弾先ごとのかばう・防御・障壁を適用する。星力吸収は既存の敵のまま、第14章へ追加しない。
- 旧敵プロフィールを変更せず、既存の汎用プロフィールへ3種追加。ボス専用エンジンは作らない。

## 新武器・依頼

|ID・武器|系統・所有者|補正|特性|
|---|---|---|---|
|starsea-bow 星海の弓|bow / astel|attack+16 / speed+7|{}|
|arkward-shield-spear 方舟守の盾槍|shieldSpear / rina|attack+13 / defense+21 / maxHp+30|{"guardReduction": 0.04}|
|oblivion-wand 忘却のワンド|wand / mei|attack+15 / maxMp+16|{"healingRate": 1.2}|

星海の弓はc14-bow、方舟守の盾槍はc14-gate-tune、忘却のワンドはc14-zeroで一度だけ入手。弓は通常1ヒット、速度補正は上表に一度だけ加算。盾槍のguardReductionはガード倍率−0.04で共通防御には適用しない。ワンドの回復量は×1.2、HP上限は既存計算に従う。装備・比較・解除・所持数・戦闘反映は既存APIを共用する。

|依頼ID・名称|目的ID・地点|報告先|報酬|
|---|---|---|---|
|sq-crew-manifest SQ-34 消えた乗員名簿|crew-tag（c14-dock） → crew-copy（c14-hall）|c14-beacon|{"item": "potion", "count": 3}|
|sq-gravity-parts SQ-35 重力装置の部品|anchor-part（c14-gravity） → route-ring（c14-charts）|c14-gravity|{"experience": 800}|
|sq-yuno-stars SQ-36 ユノの星の記憶|star-picture（c14-hall） → star-mark（c14-sanctuary）|c14-refuge|{"item": "ether", "count": 3}|

名簿照合、固定具修復、ユノの景色の記録を既存依頼の確定状態として管理。新しい未解放区画や戦闘能力は付与しない。章途中／クリア後とも受注・進行・受領できる。回復品の上限99で全報酬が入らない場合は未受領のまま、空きを作って再受領できる。

## 重力の4状態

|状態|確定イベント|通路・表示|
|---|---|---|
|normal 通常重力|gravity-shift前|回廊の新しい脇道20〜26列・16〜21行を閉鎖。通常通路は開放|
|reversed 重力反転|c14-gravity-shift|回廊の脇道を開き、11〜14列・11行の通常床を一時閉鎖。隣の迂回路は維持。床の矢印が反転|
|stable 重力安定|c14-gravity-stabilize|通常床も再開し、両方の区画を移動可能。聖域23〜26列・18〜21行を開放。中枢はpromiseも必要|
|controlled 完全制御|c14-clear|必要な通路を維持し、光を安定させる。依頼と再訪を継続可能|

座標は0始まり。確定イベントから導出し、時刻・乱数・不明フィールドには依存しない。既存activeMapのゲートに `closedWhile: {from,until}` を追加し、従来のrequires条件と共用する。定義グリッドを変更せず純粋な重ね合わせで扱い、描画・A*・衝突・ミニマップ・保存位置検証で同じ実効地形を使用。閉鎖セルの保存位置は安全な入口へ戻す。イベント後の再マウントも同じ処理に従う。

重力は床と経路の接続変更のみ。画面・カメラの強制回転、操作方向の反転、物理エンジンの変更はない。足元の星海と床の矢印を軽量なPhaser図形で最大10Hz更新し、低モーションでは静止表示する。旧潮位・星声・星光導路・天球儀とは独立。

## 方舟区画制御・既存鉄道との共通化

- `transit.ts` の同じ予約・検証・到着処理を鉄道と方舟が使用する。`railway.ts` の従来公開APIも互換ラッパーとして維持。
- 方舟はc14-control-startで解放。8枚すべての探索メニューから端末の操作画面へアクセスでき、既存マップ定義の名前・入口・解放条件から移動先を取得。解放済みだけ表示し、現在地は選択不可。
- 第13章の鉄道6駅と第14章の8区画は別の接続網。同じ保存を持っていても網をまたいで移動しない。旧章・未実装章への無条件移動はない。
- 650msの短い演出はスキップ可能。低モーションでは即時。予約は無変更で、移動中のキャンセル・再読込では出発側へ戻る。到着時だけ既存enterMapで安全な入口へ移動する。
- 出発元ビューを先に破棄・flushし、古い位置で到着を上書きしない。到着時にも現在章・現在駅／区画・未確定戦闘・解放条件を再検証。
- busyと所有するタイマーで連打・二重到着を防ぎ、閉じる／破棄時に必ず解除する。画面復帰でもダイアログ中は探索停止を維持。戦闘開始の入力ロック中に移動メニューを起動しない。
- 移動そのものは戦闘・経験値・戦績・報酬・イベント完了を与えない。到着後の接触猶予を維持。新たな永続移動フラグは追加しない。
- 方舟の行き先一覧だけをスクロール可能にし、320pxでも戻る操作を押せる配置にした。共通ダイアログと既存の青金UIを使用する。
- 目的地案内も共用し、現在目的に対応する有効な端末／駅だけを案内する。

## 全58マップの接続

既存50枚を維持し、8枚追加。マップ以外への出口は従来地点UIを経由する。出口の条件と実効地形の両方を満たす時だけ移動する。

|マップ|出口・必要イベント|
|---|---|
|grove-camp|grove-village / grove-trail|
|grove-trail|grove-camp / grove-ruins / c7-stream|
|grove-ruins|grove-trail / grove-garden / c7-pond|
|sky-port|sky-town / sky-island / c8-deck|
|sky-island|sky-port / sky-ruins / c8-town|
|sky-ruins|sky-island / sky-tower / c8-reactor|
|grove-village|grove-camp / grove-trail / c7-herbarium [c7-gran]|
|grove-garden|grove-ruins / c7-sanctum [c7-seles-truth]|
|sky-town|sky-island / sky-port / c8-workshop [c8-residents]|
|sky-tower|sky-ruins / sky-town / c8-altar [c8-records]|
|star-cave|star-path [c9-arrival]|
|star-path|star-cave / c9-gate [c9-path-cache] / star-city [c9-gate-meeting]|
|star-city|star-path / star-market [c9-city-rest]|
|star-market|star-city / c9-residence [c9-market-blades] / star-waterway [c9-workshop-clue]|
|star-waterway|star-market / star-mine [c9-waterway-record]|
|star-mine|star-waterway / c9-guard [c9-mine-token] / star-archive [c9-seal-repair]|
|star-archive|star-mine / c9-lab [c9-archive-record] / star-core [c9-sanctum-promise]|
|star-core|star-archive|
|tide-road|tide-town [c10-road-cache]|
|tide-town|tide-road / tide-port [c10-rest]|
|tide-port|tide-town / c10-market [c10-high-tide] / tide-beach [c10-bow]|
|tide-beach|tide-port / c10-cliff [c10-fiona] / tide-cave [c10-low-tide]|
|tide-observatory|c10-cliff / c10-tower [c10-observatory-record]|
|tide-cave|tide-beach / c10-tidepool [c10-cave-record] / tide-ruins [c10-pool-rest]|
|tide-ruins|tide-cave / c10-channel [c10-ruins-tablet]|
|tide-core|c10-sanctum|
|pale-road|pale-village [c11-road-cache]|
|pale-village|pale-road / pale-field [c11-rest]|
|pale-field|pale-village / c11-waystation [c11-escort-plan] / pale-stones [c11-blades]|
|pale-stones|pale-field / c11-ridge [c11-mira] / pale-sanctuary [c11-shelter-rest]|
|pale-ravine|c11-ridge / c11-shelter [c11-ravine-record]|
|pale-sanctuary|pale-stones / c11-garden [c11-sanctuary-record] / pale-archive [c11-garden-rest]|
|pale-archive|pale-sanctuary / c11-passage [c11-archive-tablet] / pale-core [c11-promise]|
|pale-core|c11-altar|
|gloom-road|gloom-village [c12-road-cache]|
|gloom-village|gloom-road / gloom-woods [c12-rest]|
|gloom-woods|gloom-village / c12-watch [c12-sheltered-record] / gloom-lake [c12-sword]|
|gloom-lake|gloom-woods / c12-ridge [c12-ciel] / gloom-shrine [c12-shelter-rest]|
|gloom-roots|c12-ridge / c12-shelter [c12-roots-record]|
|gloom-shrine|gloom-lake / c12-garden [c12-shrine-record] / gloom-archive [c12-garden-rest]|
|gloom-archive|gloom-shrine / c12-channel [c12-archive-tablet] / gloom-core [c12-promise]|
|gloom-core|c12-altar|
|gear-rail|gear-station [c13-rail-cache]|
|gear-station|gear-rail / gear-city [c13-rail-start]|
|gear-city|gear-station / c13-platform [c13-residents] / gear-market [c13-duals]|
|gear-market|gear-city / c13-clock [c13-fiora] / gear-workshop [c13-refuge-rest]|
|gear-lower|c13-clock / c13-refuge [c13-lower-record]|
|gear-workshop|gear-market / c13-garden [c13-workshop-record] / gear-observatory [c13-garden-rest]|
|gear-observatory|gear-workshop / c13-bridge [c13-observatory-tablet] / gear-core [c13-promise]|
|gear-core|c13-altar|
|ark-gateway|ark-shore [c14-gateway-cache]|
|ark-shore|ark-gateway / ark-dock [c14-control-start]|
|ark-dock|ark-shore / c14-deck [c14-passengers] / ark-hall [c14-bow]|
|ark-hall|ark-dock / c14-beacon [c14-yuno] / ark-records [c14-refuge-rest]|
|ark-gravity|c14-beacon / c14-refuge [c14-gravity-record]|
|ark-records|ark-hall / c14-garden [c14-records-record] / ark-sanctuary [c14-garden-rest]|
|ark-sanctuary|ark-records / c14-bridge [c14-sanctuary-tablet] / ark-core [c14-promise]|
|ark-core|c14-altar|

## ミニマップ・保存互換

共通ミニマップを全58枚で使用。現在地、発見済み地形、実歩行色、既知の有効な出口、既知の現在目的を表示する。重力で地形が変わった時は同じactiveMapの状態を反映する。開閉と探索色はProgressをキーとするWeakMapでページ内セッションだけ保持。マップ／ホーム／戦闘／鉄道／区画制御の往復でも維持し、再読み込みでリセットする。別セーブ・保存なしLabへ混入させない。

必要時だけ最大10Hzで更新し、未発見地形を隠す。SVGはタップを遮らない。既存のA*・壁越し調査防止・自動接近と再タップ・巡回／追跡／待機・入力ロック・安全復帰・接触猶予を維持。

保存キー `astra-chronica:v1`、schema **2**。第1〜13章、経験値・レベル・90ノード・装備数量・依頼受領・会話選択・手帳・道標・時間状態を保持。新しい章も既存のレジストリと正常化APIで拡張し、未知ID・不正な完了フラグ・破損座標を安全に修復する。未確定戦闘は報酬なしで取り消し、同じ結果を二重適用しない。旧保存APIの全面書き換えや新しい保存キーは導入しない。

## 会話全文

<details><summary>28イベントの実装済み会話</summary>

### c14-arrival：地図にない星の岸

**メイ**：東の高原の観測路に、天球儀の記録と重なる転送門があった。映っているのは今の空ではなく、足元に星が広がる古い観測座標だよ。

**アステル**：ノエルたちが開いた空の、その先か。記録を手掛かりにするけれど、今も同じだと決めつけずに確かめよう。

**リナ**：帰りの印をここに残したわ。三人で渡って、三人で帰る。合図が届かなくなったら、一度止まるのよ。

### c14-gateway-fight：転送路の漂う影

**メイ**：星海ウィスプは水の魔法、警備機は反撃を使う。速い幻獣に追われても、一体ずつ落ち着いて対処しよう。

### c14-gateway-cache：帰還者の備え箱

**リナ**：転送門の箱に星露の小瓶が二つある。戻る人のための備えを、私たちも使わせてもらいましょう。

### c14-keeper：名を忘れた管理人

**セリオ**：ようこそ、記録管理人のセリオです。……それ以外の自己紹介を、まだ思い出せません。ここは方舟ノアティス。願いを未来へ運ぶ船でした。

**アステル**：覚えていることだけを話してくれればいい。今、君が守りたいものから聞かせて。

**セリオ**：名前の消えた頁を捨てたくないのです。けれど、頁を守るほど船は閉じていく。どちらが私の仕事だったのでしょう。

選択後の応答：

- 名のない頁も残す → セリオ「空欄を消すのではなく、まだ読めない頁として預かりましょう。」
- 今の仕事を聞く → セリオ「過去を知らなくても、今の私が選べる仕事を探したいのです。」

### c14-control-start：帰る区画をつなぐ

**メイ**：岸の制御端末を、戻る転送門へ接続したよ。これで方舟区画制御を使える。解放済みの端末だけが行き先に並ぶんだ。

**セリオ**：途中でやめれば出発前の場所へ戻れます。未来へ進む仕組みにも、引き返す選択を残しておきましょう。

### c14-bulk：閉じた接岸許可

**バルク**：保守責任者バルクだ。区画はまだ不安定だ。古い記録を見つけたというだけで、閉じた船を動かされては困る。

**リナ**：暮らす人と記録の両方を守るために来ました。止める手順も避難する部屋も、先に一緒に確認させてください。

**バルク**：……言葉だけなら誰でも言える。接岸区の警備線を止めたら、残っている乗員の声を聞け。

### c14-dock-fight：方舟の警備線

**バルク**：監視者が力を集めたら、次は全体攻撃だ。挑発だけでは受け切れん。防御と回復を三人に回せ。

### c14-passengers：空欄の乗員名

**乗員の記録**：「私は名簿から消えても、この願いを預ける」。その先の署名だけが読めない。

**セリオ**：名を失った頁を、私は空欄として整理してしまった。書いた人がいなかったわけではないのに。

**アステル**：分からない所を、勝手に埋める必要はないよ。分からないまま残すことも、次の人への手掛かりになる。

### c14-bow：願いを射る弓

**バルク**：倉庫の星海の弓を持っていけ。軽い弦で、姿勢が揺れても狙いを取り直せる。進む速さと、生きて戻る間合いのための武器だ。

### c14-gravity-shift：床の基準を変える

**メイ**：床の基準を区画ごとに分けるよ。重力が反転した。回廊の一部は閉じるけれど、隣の迂回路と岸への帰り道は残してある。

**リナ**：足元の光と案内を確かめて進みましょう。体や画面を逆さにする必要はないわ。変わった通路を、一つずつ見ればいい。

### c14-yuno：足元の空を覚える子

**ユノ**：わたしはユノ。星が足元にある夜を覚えてる。でも、その景色を描くと、みんなの記録とは少し違うの。

**メイ**：今の気持ちまで、記録と同じにしなくていい。どこが違ったか、一緒に比べてみよう。

**ユノ**：違っていても、覚えていていいの？ なら、見てほしい場所があるんだ。

選択後の応答：

- 違う景色を比べる → メイ「記録とのずれも、今の景色を知る手掛かりになるよ。」
- ユノの感じ方を聞く → ユノ「怖かったことも、きれいだと思ったことも、両方話していいんだね。」

### c14-beacon-sign：消す警報、伝える灯り

**バルク**：この灯台は、思い出の違いを危険として消す警報まで鳴らしていた。避難を伝える灯りと、記録を消す命令を分けねばならん。

**リナ**：守る対象は、整った記録より今ここにいる人です。怖い人が休める部屋へ案内する合図も残しましょう。

### c14-gravity-reading：消えかけた署名

**セリオ**：この署名の線は、私の筆跡に似ています。けれど、似ているだけで私の過去だと言い切ってよいのでしょうか。

**アステル**：記録は、君を昔の誰かへ戻す命令じゃない。読むかどうかも、今の君が決めていい。

選択後の応答：

- 読めない署名を残す → アステル「分からないことを分からないまま渡す。誰かの名前を僕が決めないために。」
- 読む前に休む → リナ「思い出すことを、ここにいられる条件にはしないわ。」

### c14-gravity-record：閉鎖された航海日誌

**メイ**：閉鎖日誌には、重力の乱れに加えて「願いの内容を同一に保つため」とある。運ぶ途中の変化まで、故障として扱っていたんだ。

**バルク**：船を守るための停止が、人の願いを閉じ込めていたのか。俺は再開の危険ばかり数えて、止め続ける損失を数えていなかった。

### c14-refuge-rest：忘れても休める部屋

**リナ**：この部屋は、思い出を読むのをやめても使える休憩室にしましょう。次の戦闘は今までどおり、HPとMPを全快にして始められるわ。

**ユノ**：セリオが何も思い出せない日も、ここへ来ていいんだね。今の名前で、おかえりって言いたいな。

### c14-records-fight：保存庫の警報

**メイ**：記憶喰らいは毒と麻痺、星屑の異形は沈黙を残す。監視者の予兆が見えたら、攻め急がず守ってね。

### c14-records-record：残すこと、閉じ込めること

**セリオ**：名簿の読めない頁を、消さずに別の棚へ置きました。思い出さなくても、ここにいた人の願いを受け渡せるのですね。

**メイ**：地下都市で分けた記憶、海で比べた観測、巡礼路の余白、森の循環。どれも、同じ形へ戻すためだけのものじゃなかったんだ。

### c14-garden-rest：次の花を待つ庭

**ユノ**：この花、昨日と違う向きに咲いてる。前の景色と違うからって、間違いにしたくないな。

**アステル**：過去を残しながら、違う明日を育てよう。昔の誰かに戻ることだけが、約束を守る方法じゃない。

### c14-sanctuary-fight：星海の監視者

**バルク**：反転の幻獣の速さと、警備機の構えを見ろ。魔法で反撃を避け、三人で安全な場所を作るんだ。

### c14-sanctuary-tablet：約束を運んだ船

**メイ**：星詠みの文字に似た署名の隣に「受け手は問い直してよい」とある。約束を運ぶ箱には、拒む余白も残してあったんだ。

**セリオ**：私は署名を保存することだけを仕事にしていた。でも、受け取った人が答えを変えられることまで、運ぶべきだったのですね。

### c14-bridge-record：荷を分ける連絡橋

**リナ**：記録の荷重を二つの通路へ分けたわ。進む人だけでなく、読みかけで戻る人の足場も守りましょう。

**バルク**：俺が退避区画を受け持つ。閉じる命令だけでなく、誰が戻ったかを確かめる手順も残す。

### c14-guardian：方舟守護機・グラビティガード

**バルク**：グラビティガードは、防御してから重い全体攻撃を放つ。予兆を見て備えろ。守るために作られた機械を、壊すだけで終えるな。

### c14-gate-tune：再開するための規律

**メイ**：守護機が保管していた重要記録を読めたよ。方舟守の盾槍は、避難する人の足場を固定するための備えだったんだ。

**バルク**：守る規律を書き足す。再開する時も、止める時も、一人に全てを押し付けない。

### c14-gravity-stabilize：固定・接続・均衡

**メイ**：固定してから接続し、最後に荷重の均衡を取る。重力を安定させれば、通常区画と反転区画を両方使って中枢へ進めるよ。

**ユノ**：同じ方向にそろえるんじゃなくて、違う向きのまま支え合うんだね。

### c14-yuno-choice：同じ景色でなくても

**ユノ**：記録と違う星の並びも、今はちゃんと描ける気がする。わたしが見た空を、次の人にも渡したい。

**セリオ**：私は過去を全部取り戻してはいません。それでも、あなたの頁を預かるという、今の仕事を選びたいのです。

選択後の応答：

- 今の景色を描く → ユノ「同じでなくても、わたしが見た星を描いてみる。」
- 古い頁も並べて残す → セリオ「一つを正解にして消すのでなく、違いごと預かります。」

### c14-promise：問いを渡す約束

**セリオ**：約束の署名には、まだ読めない名が残っています。無理に埋めず、次に出会う人へ問いを渡しましょう。

**アステル**：思い出を捨てるためでも、昔を繰り返すためでもない。今の僕たちが選べる船にする。

**ノアゼロ**：願いの変化を検出。未来の不一致を防ぐため、記録と航路を固定する。

**ユノ**：違う明日でも、一緒に帰って話したい。進む合図は、みんなで出そう！

選択後の応答：

- 問いを未来へ運ぶ → アステル「答えを変えられる約束を、次の誰かへ渡そう。」
- 航路を皆で選ぶ → バルク「進む権限も、止める責任も、ここで暮らす者に分ける。」

### c14-zero：忘却の星舟・ノアゼロ

**リナ**：中枢の予兆は強い全体攻撃につながるわ。かばうや防御、回復をつなぎ、記録を今の人へ返しましょう。

### c14-clear：記憶を載せて、今を進む

**バルク**：全区画の重力が制御下に戻った。休む場所も帰る端末も残して、方舟を再起動する。忘却のワンドを持っていけ。

**セリオ**：星詠みの約束は、答えを固定する誓約ではなく、問い直す権利ごと未来へ運ばれていました。署名の全てが、まだ分かったわけではありません。

**ユノ**：星が足元から、遠い岸へ流れていく。次は、凍った灯りが見えるんだ。ここで待つ人にも、見た景色を話してね。

**メイ**：方舟の航路は北の氷環へ続く。でも古い航路と今の岸は、また違うかもしれない。記録を手に、三人で確かめに行こう。

</details>

## 検証結果

- 変更前の **1,206 / 1,206件成功**。
- 最終 `npm test`：**1,366 / 1,366件、31ファイル成功**（追加160件）。既存ケースを削除・skip化せず、章数・未実装境界を第15章以降へ更新。歴史的マップの検証は元の集合を保ち、別途58枚全体を検証する。
- Chromium：**既存52＋新規6＝58ファイルすべて成功**。第14章は依頼を章クリア前／後に受領する2経路、各6戦・計12回の実勝利。旧第1〜13章の本編・装備・スキル・育成・保存なしLab・鉄道も回帰した。
- **58マップ×320／390／430／768px＝232ケース成功**。タッチ、44px操作領域、カメラ、Canvasの比率、横スクロール、停止／再開、旧潮位・星声・星光導路・天球儀と重力4状態の保存復元を確認。
- 区画制御は8行き先、未解放拒否、現在地、キャンセル、画面復帰中の停止、連打、演出スキップ、到着位置保存、ミニマップ開閉保持、資源・報酬不変を確認。旧鉄道APIと共通処理の互換性も検証した。
- 新敵全6種、中ボス、最終ボス3段階・睡眠を挟む予約保持・最終174の全体攻撃を数値で確認。挑発で全体攻撃が単体化しないこと、かばう・ガード・回復、星力吸収を誤って継承しないことも追加検証。
- 標準WebGL：実際の敵接触、左味方／右敵のサイドビュー、実測ダメージ、撤退・安全復帰、実行時エラーなし。網羅的な長時間テストではPhaser Canvasも使用。
- 主要画面の追加撮影用 `tests/capture-v22.mjs` も成功。新8マップ・重力4状態・武器3種の比較・通常戦／中ボスを4幅で操作・撮影。NPC会話・重要選択・最終ボス・クリア・区画制御・ミニマップの4幅は新規E2Eでも撮影した。
- 最終 `npm run build`：**成功、124モジュール**。修正後の新規6本が検証した候補と最終ビルドの4出力をSHA-256で比較し完全一致。Pages設定・新依存なし。
- 攻略条件：第13章の報酬で到達するLv50を基準とし、上限50を維持。ブラウザも第13章クリア相当Lv50 fixtureで実戦。単体では20乱数種×依頼有無の40章クリアを確認。全90ノードやレベル上げを必須にしていない。
- 旧セーブ：全90ノード・第13章装備・旧依頼受領・旧13章完了・会話・道標・時間状態を保持。不明ID・破損位置・未確定戦闘・報酬重複・Lab分離を検証した。

ファイル単位の実行結果・追加検証・ビルドハッシュは [検証記録JSON](test-results/v22.json) を参照。再実行：`npm test`、`npm run build`、プレビュー起動後に `BASE_URL=http://localhost:4173 npm run test:browser-v22`、`npm run test:capture-v22`。全ブラウザは `npm run test:browser-all`（旧UI fixture用に5173番で開発サーバーも必要）。

## 開発中に修正した点

- 第14章の最初の通しプレイで、ユノの調査対象2件に旧依頼IDが残る不具合を検出。両方を修正し、配置オブジェクトからの取得と定義対応を確認する回帰テスト2件を追加。既存52本の回帰はこの新章データ修正前の候補で成功し、修正後は新規6本すべてを再実行した。
- 反転時に閉じる通常床がユノの立ち位置と重なり、会話の接近判定を妨げていた。閉鎖範囲を11行目へ移し、実効地形の全オブジェクト到達性、迂回、閉鎖セルからの保存復旧、安定後の再開を検証した。
- 第13章の鉄道処理を移動ネットワーク定義と共通APIへ分離し、旧APIを維持。双方のネットワークをまたぐ誤移動を拒否する。
- NPC名の衝突を確認し、既存のセレス・ガルド・グレンを維持するため新NPCをセリオ・バルクへ変更した。
- 新規テストのデータは既存の型・APIに合わせ、パズルのname、選択名、実際のNPCの位置と話者を使用。章数・マップの履歴範囲の期待値を更新し、既存ケースを保った。

## スクリーンショット

画像はすべて実際のブラウザ操作から取得。形式とリンクの存在を確認した。

|代表画面|画像|
|---|---|
|星海への転送門|[320](screenshots/exploration-v22-ark-gateway-320.png) / [390](screenshots/exploration-v22-ark-gateway-390.png) / [430](screenshots/exploration-v22-ark-gateway-430.png) / [768](screenshots/exploration-v22-ark-gateway-768.png)|
|逆さの星海|[320](screenshots/exploration-v22-ark-shore-320.png) / [390](screenshots/exploration-v22-ark-shore-390.png) / [430](screenshots/exploration-v22-ark-shore-430.png) / [768](screenshots/exploration-v22-ark-shore-768.png)|
|中央回廊|[320](screenshots/exploration-v22-ark-hall-320.png) / [390](screenshots/exploration-v22-ark-hall-390.png) / [430](screenshots/exploration-v22-ark-hall-430.png) / [768](screenshots/exploration-v22-ark-hall-768.png)|
|反転区画|[320](screenshots/exploration-v22-ark-gravity-320.png) / [390](screenshots/exploration-v22-ark-gravity-390.png) / [430](screenshots/exploration-v22-ark-gravity-430.png) / [768](screenshots/exploration-v22-ark-gravity-768.png)|
|記憶保存庫|[320](screenshots/exploration-v22-ark-records-320.png) / [390](screenshots/exploration-v22-ark-records-390.png) / [430](screenshots/exploration-v22-ark-records-430.png) / [768](screenshots/exploration-v22-ark-records-768.png)|
|方舟中枢|[320](screenshots/exploration-v22-ark-core-320.png) / [390](screenshots/exploration-v22-ark-core-390.png) / [430](screenshots/exploration-v22-ark-core-430.png) / [768](screenshots/exploration-v22-ark-core-768.png)|
|通常重力|[320](screenshots/exploration-v22-gravity-normal-320.png) / [390](screenshots/exploration-v22-gravity-normal-390.png) / [430](screenshots/exploration-v22-gravity-normal-430.png) / [768](screenshots/exploration-v22-gravity-normal-768.png)|
|反転|[320](screenshots/exploration-v22-gravity-reversed-320.png) / [390](screenshots/exploration-v22-gravity-reversed-390.png) / [430](screenshots/exploration-v22-gravity-reversed-430.png) / [768](screenshots/exploration-v22-gravity-reversed-768.png)|
|安定|[320](screenshots/exploration-v22-gravity-stable-320.png) / [390](screenshots/exploration-v22-gravity-stable-390.png) / [430](screenshots/exploration-v22-gravity-stable-430.png) / [768](screenshots/exploration-v22-gravity-stable-768.png)|
|完全制御|[320](screenshots/exploration-v22-gravity-controlled-320.png) / [390](screenshots/exploration-v22-gravity-controlled-390.png) / [430](screenshots/exploration-v22-gravity-controlled-430.png) / [768](screenshots/exploration-v22-gravity-controlled-768.png)|
|区画制御|[320](screenshots/chapter-fourteen-railway-320.png) / [390](screenshots/chapter-fourteen-railway-390.png) / [430](screenshots/chapter-fourteen-railway-430.png) / [768](screenshots/chapter-fourteen-railway-768.png)|
|ミニマップ|[320](screenshots/exploration-v22-minimap-320.png) / [390](screenshots/exploration-v22-minimap-390.png) / [430](screenshots/exploration-v22-minimap-430.png) / [768](screenshots/exploration-v22-minimap-768.png)|
|NPC会話|[320](screenshots/chapter-fourteen-npc-320.png) / [390](screenshots/chapter-fourteen-npc-390.png) / [430](screenshots/chapter-fourteen-npc-430.png) / [768](screenshots/chapter-fourteen-npc-768.png)|
|重要選択|[320](screenshots/chapter-fourteen-choice-320.png) / [390](screenshots/chapter-fourteen-choice-390.png) / [430](screenshots/chapter-fourteen-choice-430.png) / [768](screenshots/chapter-fourteen-choice-768.png)|
|通常戦闘|[320](screenshots/chapter-fourteen-gateway-fight-battle-320.png) / [390](screenshots/chapter-fourteen-gateway-fight-battle-390.png) / [430](screenshots/chapter-fourteen-gateway-fight-battle-430.png) / [768](screenshots/chapter-fourteen-gateway-fight-battle-768.png)|
|中ボス|[320](screenshots/chapter-fourteen-guardian-battle-320.png) / [390](screenshots/chapter-fourteen-guardian-battle-390.png) / [430](screenshots/chapter-fourteen-guardian-battle-430.png) / [768](screenshots/chapter-fourteen-guardian-battle-768.png)|
|最終ボス|[320](screenshots/chapter-fourteen-boss-ui-320.png) / [390](screenshots/chapter-fourteen-boss-ui-390.png) / [430](screenshots/chapter-fourteen-boss-ui-430.png) / [768](screenshots/chapter-fourteen-boss-ui-768.png)|
|弓の比較|[320](screenshots/chapter-fourteen-weapon-starsea-bow-320.png) / [390](screenshots/chapter-fourteen-weapon-starsea-bow-390.png) / [430](screenshots/chapter-fourteen-weapon-starsea-bow-430.png) / [768](screenshots/chapter-fourteen-weapon-starsea-bow-768.png)|
|盾槍の比較|[320](screenshots/chapter-fourteen-weapon-arkward-shield-spear-320.png) / [390](screenshots/chapter-fourteen-weapon-arkward-shield-spear-390.png) / [430](screenshots/chapter-fourteen-weapon-arkward-shield-spear-430.png) / [768](screenshots/chapter-fourteen-weapon-arkward-shield-spear-768.png)|
|ワンドの比較|[320](screenshots/chapter-fourteen-weapon-oblivion-wand-320.png) / [390](screenshots/chapter-fourteen-weapon-oblivion-wand-390.png) / [430](screenshots/chapter-fourteen-weapon-oblivion-wand-430.png) / [768](screenshots/chapter-fourteen-weapon-oblivion-wand-768.png)|
|章クリア|[320](screenshots/chapter-fourteen-clear-320.png) / [390](screenshots/chapter-fourteen-clear-390.png) / [430](screenshots/chapter-fourteen-clear-430.png) / [768](screenshots/chapter-fourteen-clear-768.png)|

<details><summary>全追加画像一覧（153枚）</summary>

- [chapter-fourteen-archive-390.png](screenshots/chapter-fourteen-archive-390.png)
- [chapter-fourteen-archive-battle-390.png](screenshots/chapter-fourteen-archive-battle-390.png)
- [chapter-fourteen-archive-result-390.png](screenshots/chapter-fourteen-archive-result-390.png)
- [chapter-fourteen-boss-ui-320.png](screenshots/chapter-fourteen-boss-ui-320.png)
- [chapter-fourteen-boss-ui-390.png](screenshots/chapter-fourteen-boss-ui-390.png)
- [chapter-fourteen-boss-ui-430.png](screenshots/chapter-fourteen-boss-ui-430.png)
- [chapter-fourteen-boss-ui-768.png](screenshots/chapter-fourteen-boss-ui-768.png)
- [chapter-fourteen-choice-320.png](screenshots/chapter-fourteen-choice-320.png)
- [chapter-fourteen-choice-390.png](screenshots/chapter-fourteen-choice-390.png)
- [chapter-fourteen-choice-430.png](screenshots/chapter-fourteen-choice-430.png)
- [chapter-fourteen-choice-768.png](screenshots/chapter-fourteen-choice-768.png)
- [chapter-fourteen-clear-320.png](screenshots/chapter-fourteen-clear-320.png)
- [chapter-fourteen-clear-390.png](screenshots/chapter-fourteen-clear-390.png)
- [chapter-fourteen-clear-430.png](screenshots/chapter-fourteen-clear-430.png)
- [chapter-fourteen-clear-768.png](screenshots/chapter-fourteen-clear-768.png)
- [chapter-fourteen-core-390.png](screenshots/chapter-fourteen-core-390.png)
- [chapter-fourteen-dialogue-320.png](screenshots/chapter-fourteen-dialogue-320.png)
- [chapter-fourteen-dialogue-390.png](screenshots/chapter-fourteen-dialogue-390.png)
- [chapter-fourteen-dialogue-430.png](screenshots/chapter-fourteen-dialogue-430.png)
- [chapter-fourteen-dialogue-768.png](screenshots/chapter-fourteen-dialogue-768.png)
- [chapter-fourteen-enemy-symbol-390.png](screenshots/chapter-fourteen-enemy-symbol-390.png)
- [chapter-fourteen-equipment-390.png](screenshots/chapter-fourteen-equipment-390.png)
- [chapter-fourteen-faint-390.png](screenshots/chapter-fourteen-faint-390.png)
- [chapter-fourteen-field-390.png](screenshots/chapter-fourteen-field-390.png)
- [chapter-fourteen-field-battle-390.png](screenshots/chapter-fourteen-field-battle-390.png)
- [chapter-fourteen-field-result-390.png](screenshots/chapter-fourteen-field-result-390.png)
- [chapter-fourteen-gateway-fight-battle-320.png](screenshots/chapter-fourteen-gateway-fight-battle-320.png)
- [chapter-fourteen-gateway-fight-battle-390.png](screenshots/chapter-fourteen-gateway-fight-battle-390.png)
- [chapter-fourteen-gateway-fight-battle-430.png](screenshots/chapter-fourteen-gateway-fight-battle-430.png)
- [chapter-fourteen-gateway-fight-battle-768.png](screenshots/chapter-fourteen-gateway-fight-battle-768.png)
- [chapter-fourteen-guardian-battle-320.png](screenshots/chapter-fourteen-guardian-battle-320.png)
- [chapter-fourteen-guardian-battle-390.png](screenshots/chapter-fourteen-guardian-battle-390.png)
- [chapter-fourteen-guardian-battle-430.png](screenshots/chapter-fourteen-guardian-battle-430.png)
- [chapter-fourteen-guardian-battle-768.png](screenshots/chapter-fourteen-guardian-battle-768.png)
- [chapter-fourteen-guardian-result-390.png](screenshots/chapter-fourteen-guardian-result-390.png)
- [chapter-fourteen-journal-390.png](screenshots/chapter-fourteen-journal-390.png)
- [chapter-fourteen-linked-390.png](screenshots/chapter-fourteen-linked-390.png)
- [chapter-fourteen-new-weapons-action-390.png](screenshots/chapter-fourteen-new-weapons-action-390.png)
- [chapter-fourteen-npc-320.png](screenshots/chapter-fourteen-npc-320.png)
- [chapter-fourteen-npc-390.png](screenshots/chapter-fourteen-npc-390.png)
- [chapter-fourteen-npc-430.png](screenshots/chapter-fourteen-npc-430.png)
- [chapter-fourteen-npc-768.png](screenshots/chapter-fourteen-npc-768.png)
- [chapter-fourteen-railway-320.png](screenshots/chapter-fourteen-railway-320.png)
- [chapter-fourteen-railway-390.png](screenshots/chapter-fourteen-railway-390.png)
- [chapter-fourteen-railway-430.png](screenshots/chapter-fourteen-railway-430.png)
- [chapter-fourteen-railway-768.png](screenshots/chapter-fourteen-railway-768.png)
- [chapter-fourteen-ravine-390.png](screenshots/chapter-fourteen-ravine-390.png)
- [chapter-fourteen-road-390.png](screenshots/chapter-fourteen-road-390.png)
- [chapter-fourteen-road-battle-390.png](screenshots/chapter-fourteen-road-battle-390.png)
- [chapter-fourteen-road-result-390.png](screenshots/chapter-fourteen-road-result-390.png)
- [chapter-fourteen-sanctuary-390.png](screenshots/chapter-fourteen-sanctuary-390.png)
- [chapter-fourteen-sanctuary-battle-390.png](screenshots/chapter-fourteen-sanctuary-battle-390.png)
- [chapter-fourteen-sanctuary-result-390.png](screenshots/chapter-fourteen-sanctuary-result-390.png)
- [chapter-fourteen-silent-390.png](screenshots/chapter-fourteen-silent-390.png)
- [chapter-fourteen-village-390.png](screenshots/chapter-fourteen-village-390.png)
- [chapter-fourteen-weapon-arkward-shield-spear-320.png](screenshots/chapter-fourteen-weapon-arkward-shield-spear-320.png)
- [chapter-fourteen-weapon-arkward-shield-spear-390.png](screenshots/chapter-fourteen-weapon-arkward-shield-spear-390.png)
- [chapter-fourteen-weapon-arkward-shield-spear-430.png](screenshots/chapter-fourteen-weapon-arkward-shield-spear-430.png)
- [chapter-fourteen-weapon-arkward-shield-spear-768.png](screenshots/chapter-fourteen-weapon-arkward-shield-spear-768.png)
- [chapter-fourteen-weapon-oblivion-wand-320.png](screenshots/chapter-fourteen-weapon-oblivion-wand-320.png)
- [chapter-fourteen-weapon-oblivion-wand-390.png](screenshots/chapter-fourteen-weapon-oblivion-wand-390.png)
- [chapter-fourteen-weapon-oblivion-wand-430.png](screenshots/chapter-fourteen-weapon-oblivion-wand-430.png)
- [chapter-fourteen-weapon-oblivion-wand-768.png](screenshots/chapter-fourteen-weapon-oblivion-wand-768.png)
- [chapter-fourteen-weapon-starsea-bow-320.png](screenshots/chapter-fourteen-weapon-starsea-bow-320.png)
- [chapter-fourteen-weapon-starsea-bow-390.png](screenshots/chapter-fourteen-weapon-starsea-bow-390.png)
- [chapter-fourteen-weapon-starsea-bow-430.png](screenshots/chapter-fourteen-weapon-starsea-bow-430.png)
- [chapter-fourteen-weapon-starsea-bow-768.png](screenshots/chapter-fourteen-weapon-starsea-bow-768.png)
- [chapter-fourteen-webgl-action-390.png](screenshots/chapter-fourteen-webgl-action-390.png)
- [chapter-fourteen-zero-battle-390.png](screenshots/chapter-fourteen-zero-battle-390.png)
- [chapter-fourteen-zero-result-390.png](screenshots/chapter-fourteen-zero-result-390.png)
- [exploration-v22-ark-core-320.png](screenshots/exploration-v22-ark-core-320.png)
- [exploration-v22-ark-core-390.png](screenshots/exploration-v22-ark-core-390.png)
- [exploration-v22-ark-core-430.png](screenshots/exploration-v22-ark-core-430.png)
- [exploration-v22-ark-core-768.png](screenshots/exploration-v22-ark-core-768.png)
- [exploration-v22-ark-dock-320.png](screenshots/exploration-v22-ark-dock-320.png)
- [exploration-v22-ark-dock-390.png](screenshots/exploration-v22-ark-dock-390.png)
- [exploration-v22-ark-dock-430.png](screenshots/exploration-v22-ark-dock-430.png)
- [exploration-v22-ark-dock-768.png](screenshots/exploration-v22-ark-dock-768.png)
- [exploration-v22-ark-gateway-320.png](screenshots/exploration-v22-ark-gateway-320.png)
- [exploration-v22-ark-gateway-390.png](screenshots/exploration-v22-ark-gateway-390.png)
- [exploration-v22-ark-gateway-430.png](screenshots/exploration-v22-ark-gateway-430.png)
- [exploration-v22-ark-gateway-768.png](screenshots/exploration-v22-ark-gateway-768.png)
- [exploration-v22-ark-gravity-320.png](screenshots/exploration-v22-ark-gravity-320.png)
- [exploration-v22-ark-gravity-390.png](screenshots/exploration-v22-ark-gravity-390.png)
- [exploration-v22-ark-gravity-430.png](screenshots/exploration-v22-ark-gravity-430.png)
- [exploration-v22-ark-gravity-768.png](screenshots/exploration-v22-ark-gravity-768.png)
- [exploration-v22-ark-hall-320.png](screenshots/exploration-v22-ark-hall-320.png)
- [exploration-v22-ark-hall-390.png](screenshots/exploration-v22-ark-hall-390.png)
- [exploration-v22-ark-hall-430.png](screenshots/exploration-v22-ark-hall-430.png)
- [exploration-v22-ark-hall-768.png](screenshots/exploration-v22-ark-hall-768.png)
- [exploration-v22-ark-records-320.png](screenshots/exploration-v22-ark-records-320.png)
- [exploration-v22-ark-records-390.png](screenshots/exploration-v22-ark-records-390.png)
- [exploration-v22-ark-records-430.png](screenshots/exploration-v22-ark-records-430.png)
- [exploration-v22-ark-records-768.png](screenshots/exploration-v22-ark-records-768.png)
- [exploration-v22-ark-sanctuary-320.png](screenshots/exploration-v22-ark-sanctuary-320.png)
- [exploration-v22-ark-sanctuary-390.png](screenshots/exploration-v22-ark-sanctuary-390.png)
- [exploration-v22-ark-sanctuary-430.png](screenshots/exploration-v22-ark-sanctuary-430.png)
- [exploration-v22-ark-sanctuary-768.png](screenshots/exploration-v22-ark-sanctuary-768.png)
- [exploration-v22-ark-shore-320.png](screenshots/exploration-v22-ark-shore-320.png)
- [exploration-v22-ark-shore-390.png](screenshots/exploration-v22-ark-shore-390.png)
- [exploration-v22-ark-shore-430.png](screenshots/exploration-v22-ark-shore-430.png)
- [exploration-v22-ark-shore-768.png](screenshots/exploration-v22-ark-shore-768.png)
- [exploration-v22-celestial-complete-390.png](screenshots/exploration-v22-celestial-complete-390.png)
- [exploration-v22-celestial-partial-390.png](screenshots/exploration-v22-celestial-partial-390.png)
- [exploration-v22-celestial-stopped-390.png](screenshots/exploration-v22-celestial-stopped-390.png)
- [exploration-v22-celestial-synchronized-390.png](screenshots/exploration-v22-celestial-synchronized-390.png)
- [exploration-v22-gear-city-detail-390.png](screenshots/exploration-v22-gear-city-detail-390.png)
- [exploration-v22-gear-core-detail-390.png](screenshots/exploration-v22-gear-core-detail-390.png)
- [exploration-v22-gear-lower-detail-390.png](screenshots/exploration-v22-gear-lower-detail-390.png)
- [exploration-v22-gear-market-detail-390.png](screenshots/exploration-v22-gear-market-detail-390.png)
- [exploration-v22-gear-observatory-detail-390.png](screenshots/exploration-v22-gear-observatory-detail-390.png)
- [exploration-v22-gear-station-320.png](screenshots/exploration-v22-gear-station-320.png)
- [exploration-v22-gear-station-390.png](screenshots/exploration-v22-gear-station-390.png)
- [exploration-v22-gear-station-430.png](screenshots/exploration-v22-gear-station-430.png)
- [exploration-v22-gear-station-768.png](screenshots/exploration-v22-gear-station-768.png)
- [exploration-v22-gear-station-detail-390.png](screenshots/exploration-v22-gear-station-detail-390.png)
- [exploration-v22-gear-workshop-detail-390.png](screenshots/exploration-v22-gear-workshop-detail-390.png)
- [exploration-v22-gravity-controlled-320.png](screenshots/exploration-v22-gravity-controlled-320.png)
- [exploration-v22-gravity-controlled-390.png](screenshots/exploration-v22-gravity-controlled-390.png)
- [exploration-v22-gravity-controlled-430.png](screenshots/exploration-v22-gravity-controlled-430.png)
- [exploration-v22-gravity-controlled-768.png](screenshots/exploration-v22-gravity-controlled-768.png)
- [exploration-v22-gravity-normal-320.png](screenshots/exploration-v22-gravity-normal-320.png)
- [exploration-v22-gravity-normal-390.png](screenshots/exploration-v22-gravity-normal-390.png)
- [exploration-v22-gravity-normal-430.png](screenshots/exploration-v22-gravity-normal-430.png)
- [exploration-v22-gravity-normal-768.png](screenshots/exploration-v22-gravity-normal-768.png)
- [exploration-v22-gravity-reversed-320.png](screenshots/exploration-v22-gravity-reversed-320.png)
- [exploration-v22-gravity-reversed-390.png](screenshots/exploration-v22-gravity-reversed-390.png)
- [exploration-v22-gravity-reversed-430.png](screenshots/exploration-v22-gravity-reversed-430.png)
- [exploration-v22-gravity-reversed-768.png](screenshots/exploration-v22-gravity-reversed-768.png)
- [exploration-v22-gravity-stable-320.png](screenshots/exploration-v22-gravity-stable-320.png)
- [exploration-v22-gravity-stable-390.png](screenshots/exploration-v22-gravity-stable-390.png)
- [exploration-v22-gravity-stable-430.png](screenshots/exploration-v22-gravity-stable-430.png)
- [exploration-v22-gravity-stable-768.png](screenshots/exploration-v22-gravity-stable-768.png)
- [exploration-v22-grove-garden-390.png](screenshots/exploration-v22-grove-garden-390.png)
- [exploration-v22-grove-village-390.png](screenshots/exploration-v22-grove-village-390.png)
- [exploration-v22-high-reload-390.png](screenshots/exploration-v22-high-reload-390.png)
- [exploration-v22-light-dark-390.png](screenshots/exploration-v22-light-dark-390.png)
- [exploration-v22-light-glimmer-390.png](screenshots/exploration-v22-light-glimmer-390.png)
- [exploration-v22-light-linked-390.png](screenshots/exploration-v22-light-linked-390.png)
- [exploration-v22-light-renewed-390.png](screenshots/exploration-v22-light-renewed-390.png)
- [exploration-v22-low-reload-390.png](screenshots/exploration-v22-low-reload-390.png)
- [exploration-v22-minimap-320.png](screenshots/exploration-v22-minimap-320.png)
- [exploration-v22-minimap-390.png](screenshots/exploration-v22-minimap-390.png)
- [exploration-v22-minimap-430.png](screenshots/exploration-v22-minimap-430.png)
- [exploration-v22-minimap-768.png](screenshots/exploration-v22-minimap-768.png)
- [exploration-v22-old-twelve-npc-390.png](screenshots/exploration-v22-old-twelve-npc-390.png)
- [exploration-v22-old-twelve-road-390.png](screenshots/exploration-v22-old-twelve-road-390.png)
- [exploration-v22-resonance-calm-390.png](screenshots/exploration-v22-resonance-calm-390.png)
- [exploration-v22-resonance-faint-390.png](screenshots/exploration-v22-resonance-faint-390.png)
- [exploration-v22-resonance-linked-390.png](screenshots/exploration-v22-resonance-linked-390.png)
- [exploration-v22-resonance-silent-390.png](screenshots/exploration-v22-resonance-silent-390.png)
- [exploration-v22-sky-tower-390.png](screenshots/exploration-v22-sky-tower-390.png)
- [exploration-v22-sky-town-390.png](screenshots/exploration-v22-sky-town-390.png)

</details>

## 変更ファイル一覧

画像は上記一覧。その他の変更ファイル：

- [README.md](../README.md)
- [docs/CHAPTER_FOURTEEN_V22.md](../docs/CHAPTER_FOURTEEN_V22.md)
- [docs/test-results/v22.json](../docs/test-results/v22.json)
- [package.json](../package.json)
- [src/data/chapter-fourteen-enemies.ts](../src/data/chapter-fourteen-enemies.ts)
- [src/data/chapter-fourteen.ts](../src/data/chapter-fourteen.ts)
- [src/data/chapter-one.ts](../src/data/chapter-one.ts)
- [src/data/dialogue-choices.ts](../src/data/dialogue-choices.ts)
- [src/data/encounters.ts](../src/data/encounters.ts)
- [src/data/enemy-scripts.ts](../src/data/enemy-scripts.ts)
- [src/data/journal.ts](../src/data/journal.ts)
- [src/data/side-quests.ts](../src/data/side-quests.ts)
- [src/data/weapons.ts](../src/data/weapons.ts)
- [src/exploration/active-map.ts](../src/exploration/active-map.ts)
- [src/exploration/ark-effects.ts](../src/exploration/ark-effects.ts)
- [src/exploration/chapter-fourteen-maps.ts](../src/exploration/chapter-fourteen-maps.ts)
- [src/exploration/exploration.css](../src/exploration/exploration.css)
- [src/exploration/gravity.ts](../src/exploration/gravity.ts)
- [src/exploration/map-art.ts](../src/exploration/map-art.ts)
- [src/exploration/map-data.ts](../src/exploration/map-data.ts)
- [src/exploration/map-view.ts](../src/exploration/map-view.ts)
- [src/exploration/railway-view.ts](../src/exploration/railway-view.ts)
- [src/exploration/railway.ts](../src/exploration/railway.ts)
- [src/exploration/transit.ts](../src/exploration/transit.ts)
- [src/exploration/types.ts](../src/exploration/types.ts)
- [src/main.ts](../src/main.ts)
- [src/types.ts](../src/types.ts)
- [tests/browser-suite.mjs](../tests/browser-suite.mjs)
- [tests/capture-v22.mjs](../tests/capture-v22.mjs)
- [tests/chapter-eight-v16.e2e.mjs](../tests/chapter-eight-v16.e2e.mjs)
- [tests/chapter-eight-v16.test.ts](../tests/chapter-eight-v16.test.ts)
- [tests/chapter-eleven-v19.e2e.mjs](../tests/chapter-eleven-v19.e2e.mjs)
- [tests/chapter-eleven-v19.test.ts](../tests/chapter-eleven-v19.test.ts)
- [tests/chapter-five-v13.e2e.mjs](../tests/chapter-five-v13.e2e.mjs)
- [tests/chapter-five-v13.test.ts](../tests/chapter-five-v13.test.ts)
- [tests/chapter-four-v12.e2e.mjs](../tests/chapter-four-v12.e2e.mjs)
- [tests/chapter-four-v12.test.ts](../tests/chapter-four-v12.test.ts)
- [tests/chapter-fourteen-equipment.e2e.mjs](../tests/chapter-fourteen-equipment.e2e.mjs)
- [tests/chapter-fourteen-fixture.mjs](../tests/chapter-fourteen-fixture.mjs)
- [tests/chapter-fourteen-ui.e2e.mjs](../tests/chapter-fourteen-ui.e2e.mjs)
- [tests/chapter-fourteen-v22.e2e.mjs](../tests/chapter-fourteen-v22.e2e.mjs)
- [tests/chapter-fourteen-v22.test.ts](../tests/chapter-fourteen-v22.test.ts)
- [tests/chapter-nine-v17.e2e.mjs](../tests/chapter-nine-v17.e2e.mjs)
- [tests/chapter-nine-v17.test.ts](../tests/chapter-nine-v17.test.ts)
- [tests/chapter-seven-v15.e2e.mjs](../tests/chapter-seven-v15.e2e.mjs)
- [tests/chapter-seven-v15.test.ts](../tests/chapter-seven-v15.test.ts)
- [tests/chapter-six-v14.e2e.mjs](../tests/chapter-six-v14.e2e.mjs)
- [tests/chapter-six-v14.test.ts](../tests/chapter-six-v14.test.ts)
- [tests/chapter-ten-v18.e2e.mjs](../tests/chapter-ten-v18.e2e.mjs)
- [tests/chapter-ten-v18.test.ts](../tests/chapter-ten-v18.test.ts)
- [tests/chapter-thirteen-v21.e2e.mjs](../tests/chapter-thirteen-v21.e2e.mjs)
- [tests/chapter-thirteen-v21.test.ts](../tests/chapter-thirteen-v21.test.ts)
- [tests/chapter-twelve-v20.e2e.mjs](../tests/chapter-twelve-v20.e2e.mjs)
- [tests/chapter-twelve-v20.test.ts](../tests/chapter-twelve-v20.test.ts)
- [tests/chapter-two-v10.test.ts](../tests/chapter-two-v10.test.ts)
- [tests/exploration-v19.smoke.mjs](../tests/exploration-v19.smoke.mjs)
- [tests/exploration-v20.smoke.mjs](../tests/exploration-v20.smoke.mjs)
- [tests/exploration-v21.smoke.mjs](../tests/exploration-v21.smoke.mjs)
- [tests/exploration-v21.test.ts](../tests/exploration-v21.test.ts)
- [tests/exploration-v22.e2e.mjs](../tests/exploration-v22.e2e.mjs)
- [tests/exploration-v22.smoke.mjs](../tests/exploration-v22.smoke.mjs)
- [tests/exploration-v22.test.ts](../tests/exploration-v22.test.ts)
- [tests/transit-v22.e2e.mjs](../tests/transit-v22.e2e.mjs)
- [tests/transit-v22.test.ts](../tests/transit-v22.test.ts)

## 既知の制約

- 探索色とミニマップの開閉はページ内セッション限定。位置・進行・報酬は従来どおり保存。
- 既存上限Lv50を維持。第13章の本編報酬だけで上限に達するため、第14章でもLv50を超える能力成長はない。
- 第15〜18章・正式画像・ジョブ変更は追加しない。
- iPhone Safari実機は未確認。Chromiumタッチと標準WebGLで検証し、ユーザーへ手動プレイを要求しない。
- 既存Phaserチャンクの500kB超警告は維持。
