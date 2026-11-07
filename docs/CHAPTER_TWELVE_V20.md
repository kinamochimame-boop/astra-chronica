# v2.0 第12章「常闇の深森と星を喰む樹」

## 基準と維持仕様

v1.9 main `043e51f71b673303be8e4c032fe32d28022ee3b7` から `feature/v2.0-chapter-twelve-exploration` を作成。第1〜11章、3人固定・9武器系統・90ノード・既存サイドビュー・7属性・7状態異常・成長・所持品・会話選択・手帳・保存なし検証を維持する。第11章クリアで解放し、第13〜18章は未実装・未解放。mainへのマージ・Pages公開・PLiCy投稿は行わない。

## 物語とNPC

主題は「守るために閉じ込めたものを、再び未来へ返す」。第11章の巡礼記録に従って東の森へ進む。巨大樹は声を種へ渡す装置だったが、喪失を避けるために同じ季節を保存し、次の命から力を奪っている。第9章の記憶、第10章の観測、第11章の余白を、受け手が選べる循環としてつなぐ。

- **ルゥナ**：粒の光を読む明るい案内人。父を奥へ案内した後に父が約束を忘れたため、自分を責めている。終盤は過去を完全復元することより、現在の父と新しい種を植えることを選ぶ。
- **ヴァルド**：巨大樹だけを守ればよいと信じた守人。若木の芽吹きまで止まったことを認め、人が戻る道を守る役目を引き受ける。
- **シエル**：年輪を読む研究者。預けた声を一度に解放せず、根で受け、枝へ分け、種へ渡す方法を提案する。

既存のルシエル／ヴァルトとは別の名前であり、既存人物は変更しない。アステルは今の相手に問い直し、リナは戻る人と立ち止まる自由を守り、メイは術式を解読する。樹を倒して全記憶を都合よく戻す結末にはしない。北の風化した石の台地を第13章への導入とし、第18章の真相は確定しない。

## 全16地点・28イベント

原則として直前イベントが前提。依頼未完でも全メインを進行可能。会話は複数ページ・中断再開・再訪再読に対応。

|地点ID・名称|イベントID（c12-接頭辞）|歩行マップ|
|---|---|---|
|c12-road 深森への街道|arrival（昼を忘れた森） / road-fight（木陰に集うもの） / road-cache（戻る旅人の小箱）|gloom-road|
|c12-village 木漏れ日の集落|luna（読める光と読めない怖さ） / rest（小さな木漏れ日）|gloom-village|
|c12-woods 常闇の森|vald（森を閉じる守り） / woods-fight（常闇に沈む光） / sheltered-record（守人の空いた席）|gloom-woods|
|c12-watch 守人の見張り台|sword（星樹の一振り）|従来地点UI|
|c12-lake 星映しの湖|lake-light（最初の返光） / ciel（樹が抱えた季節）|gloom-lake|
|c12-ridge 苔むす尾根|ridge-sign（暗くても戻れる尾根）|従来地点UI|
|c12-roots 巨大樹の根道|roots-reading（根が留めた声） / roots-record（案内人が恐れた道）|gloom-roots|
|c12-shelter 旅人の樹洞|shelter-rest（思い出せない日の続きを）|従来地点UI|
|c12-shrine 古樹の祠|shrine-fight（古樹の祠の警報） / shrine-record（未来へ送る樹）|gloom-shrine|
|c12-garden 種待ちの庭|garden-rest（芽を待つ場所）|従来地点UI|
|c12-archive 樹海の記録庫|archive-fight（年輪を閉じる番兵） / archive-tablet（預けられた願い）|gloom-archive|
|c12-channel 星脈の水路|channel-record（根と枝の間に）|従来地点UI|
|c12-gate 根門の守域|guardian（古樹守護機・ルートセンチネル） / gate-tune（守りの手順を書き足す）|従来地点UI|
|c12-vault 年輪の書室|vault-code（光を未来へ渡す順番） / luna-choice（戻らない声と歩く人）|従来地点UI|
|c12-altar 返光の祭壇|promise（閉じた季節を開く約束）|従来地点UI|
|c12-core 星喰い樹の中枢|astravore（星喰いの大樹・アストラヴォア） / clear（次の芽が出る余白）|gloom-core|

休息では永続HP管理を増やさず、既存の各戦闘開始時HP・MP全快を尊重する。パズルは **受ける→分ける→渡す**。誤答・再挑戦・リセット・3段階ヒントに対応し、並べかけのみ再読み込みでリセット。確定イベントは保持する。

### 重要選択と手帳

|選択ID|選択肢ID|
|---|---|
|c12-luna|read-together：皆の合図と一緒に読む / keep-the-return：先に帰り道を確かめる|
|c12-ciel|ask-the-forest：森で暮らす人に聞く / compare-the-rings：違う年輪の記録を比べる|
|c12-roots-reading|share-the-flow：返す流れを分ける / respect-the-pause：今は受け取れない人も尊重する|
|c12-luna-choice|plant-today：今の父と種を植える / ask-again：受け取りたい声を聞き直す|
|c12-promise|return-the-light：光を次の芽へ返す / keep-a-way-back：変わることが怖い人の道も残す|

各2択、全32通りでクリア可能。確定直後に保存し、再訪で上書きしない。旧セーブへ選択を推測補完しない。

|手帳ID|記事|公開イベント|
|---|---|---|
|j12-1|昼を忘れた森|c12-arrival|
|j12-2|案内人ルゥナ|c12-luna|
|j12-3|森の守人ヴァルド|c12-vald|
|j12-4|記録研究者シエル|c12-ciel|
|j12-5|最初の返光|c12-lake-light|
|j12-6|未来へ送る樹|c12-shrine-record|
|j12-7|根・枝・種|c12-vault-code|
|j12-8|次の芽が出る余白|c12-clear|

未到達の情報は非表示。探索記録は16地点＋28イベント＋3依頼＝47項目。メイン完了93%、全依頼受領で100%。

## 敵・編成・ボス

|内部ID・敵|HP|攻撃|防御|速度|EXP|属性相性|
|---|---:|---:|---:|---:|---:|---|
|starmoss-golem 星苔ゴーレム|850|60|44|35|500|fire×1.25 / wind×0.75|
|darkleaf-sprite 闇葉スプライト|770|56|33|70|510|全て1.0|
|rootbound-beast 根縛りの獣|790|59|32|51|510|全て1.0|
|elder-sentinel 古樹の番兵|860|63|40|38|520|全て1.0|
|nightglow-wisp 夜光ウィスプ|820|57|34|44|520|全て1.0|
|star-eater-larva 星喰いの幼体|790|59|32|46|510|light×1.25 / dark×0.75|
|gloom-guardian 古樹守護機・ルートセンチネル|4300|63|42|40|1700|fire×1.25 / earth×0.75|
|astravore 星喰いの大樹・アストラヴォア|6200|64|36|44|2300|fire×1.25 / dark×0.5|

全8種の睡眠・凍結耐性20%、その他0%。未記載の属性倍率1.0。敵ごとのランダム武器ドロップは追加しない。

- 星苔ゴーレム：高防御の通常物理。
- 闇葉スプライト：風魔法94、暗闇20%・2行動。
- 根縛りの獣：通常物理に麻痺25%・2行動。
- 夜光ウィスプ：火魔法94、火傷20%・2行動。
- 古樹の番兵：既存archiveGuardの防御・1回の物理反撃。
- 星喰いの幼体：闇魔法88、3行動周期の2回目で予兆、次に単体「食星弾」108。

街道＝ゴーレム／スプライト／獣（1520EXP）、森＝スプライト／番兵／幼体（1540）、祠＝獣／ウィスプ／幼体（1540）、記録庫＝ゴーレム／ウィスプ／番兵（1540）、中ボス1700、最終ボス2300。合計 **10140EXP／人**、任意依頼700は別。第11章の9600から緩やかに増加する。章開始想定Lv43、必須の高レベルツリーノードなし。

### ボス詳細

- **ルートセンチネル**：通常攻撃（麻痺25%・2行動）→防御・1回の反撃・全体予兆→土属性全体「根縛りの奔流」102。撃破後に守護機の記録と盾槍を受け取る。
- **アストラヴォア**：HP65%超／30%超65%以下／30%以下で3段階。第1段階は物理のみ。第2段階以降は偶数行動に闇魔法「星脈吸収」98（第3段階116）、周期2回目は防御と全体予兆。次の行動に「閉季の星波」134、第3段階で新たに予約した攻撃は「暴走する星脈」162。魔法に沈黙20%・麻痺15%・各2行動。第3段階の物理補正は既存1.15倍。
- 予約攻撃は既存の保存先を使い、行動不能では消えず、フェーズ移行でも予約134を162へ上書きしない。
- 単体は既存の挑発・かばう、全体は生存味方ごとに実被弾先と防御・障壁を処理。全体を挑発で1人へ集めない。
- 星力吸収は第2段階以降の魔法で実HPが減った生存者にのみ適用。既存の被弾星力+10の後、最大20を0下限で減算。例：60→被弾70→吸収50。無効ダメージでは減らない。HP・ダメージ・属性倍率の式は変更しない。
- 防御・誓盾・回復・状態異常で対処可能。表示はBattleEventの実測値、ログも実減少量を表示する。

## 新武器と依頼

|武器ID・表示名|系統・所有者|能力補正|特性・入手|
|---|---|---|---|
|startree-sword 星樹の剣|sword / astel|attack+16 / defense+3|{} / c12-sword|
|emerald-shield-spear 翠星の盾槍|shieldSpear / rina|attack+10 / defense+20 / maxHp+20|{"guardReduction": 0.02} / c12-gate-tune|
|eldertree-rod 古樹のロッド|rod / mei|attack+13 / maxMp+14|{"magicRate": 1.27} / c12-astravore|

剣は通常1ヒット。双剣の2ヒットや弓の速度を重複適用しない。盾槍は防御とガード、ロッドは属性魔法1.27倍で、ワンドの回復1.25倍とは交換となる。装備・解除・比較・数量・所有者制限は既存APIを使う。

|依頼ID・名前|目的ID・場所|報告先|報酬|
|---|---|---|---|
|sq-forest-light SQ-28 森に消えた灯り|light-wick（c12-woods） → light-lens（c12-lake）|c12-woods|{"item": "potion", "count": 3}|
|sq-warden-record SQ-29 守人の忘れ物|warden-mark（c12-roots） → warden-note（c12-vault）|c12-roots|{"experience": 700}|
|sq-luna-seeds SQ-30 ルゥナの星の種|star-seed（c12-lake） → seed-record（c12-archive）|c12-shelter|{"item": "ether", "count": 3}|

受注・目的順序・接近条件・報告・保存を既存処理に接続。所持上限99で報酬を全て受け取れない場合は未受領のまま。章途中／クリア後のどちらも達成可能。初回武器・宝箱・経験値・戦績は完了イベントと戦闘serialで重複を防止する。

## 星光の導路

|段階|確定条件|経路|
|---|---|---|
|常闇 dark|lake-light前|湖の20〜26列・16〜21行を閉鎖。尾根は維持|
|微光 glimmer|c12-lake-light|湖畔の導路を開放。祠の行先にはshelter-restも必要|
|星光連結 linked|c12-vault-code|記録庫23〜26列・18〜21行を開放。中枢の行先にはpromiseも必要|
|再生 renewed|c12-clear|開放した通路を維持し、粒子の光が安定|

座標は0始まり。`activeMap` の既存gatesを使用し、描画・A*・調査判定・保存位置復元が同じ地形を見る。閉鎖通路の不正保存位置は常設入口へ戻す。導路変更でシーンと経路を再評価する。実時間・乱数・未知の派生フィールドを根拠にしない。第10章潮位・第11章共鳴・旧時間装置と独立。

## 全42マップの接続

第7章5＋第8章5＋第9〜12章各8＝42枚。既存34枚の地形・出口定義は変更しない。以下は実際の出口データ。条件未達・未解放の出口は共通APIが拒否し、案内から除外する。地点IDへの出口は従来地点UIを経由する。

|マップID|出口（条件イベント）|
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

遠方対象タップは既存A*で隣まで接近し、会話・出口は再タップで実行。壁越し調査拒否、巡回／追跡／待機、画面外AI抑制、入場0.65秒猶予、戦闘中／メニュー中停止、安全入口復帰、撃破済み復活防止を維持。

## 共通ミニマップ

- 第7〜12章の全42枚に共通実装。独立した地形定義や追加canvasは作らず、同じ実効グリッドをSVGの3つのバッチ地形パスで表示。
- 現在地●、既知かつ解放済み出口◆、現在目的◎。目的は現在イベントの既知の対象だけで、敵は実位置を使用する。未発見・未解放・壁の向こうの情報は表示しない。
- 現在地から3タイル以内、4px間隔の視線で地形を発見。最初の障害物までを表示。近くの既知の床と、実際に歩いた金色の床を区別する。
- 位置は論理マップ座標÷32。カメラや画面幅に依存しない。移動の小刻みな更新で歩行セルを記録し、低FPSで足跡を飛ばさない。
- すべての幅で最初は折りたたみ。48×44pxのボタンで開閉し、canvasサイズやページ高さを変更しない。パネルは入力を遮らず、地面タップが既存Phaserへ届く。
- 開いている場合のみ最大10Hzで表示更新。静止時は地形パスを再構築せず、セル移動・地形変更時だけ調査する。別タイマーは作らない。
- **探索色はページ内セッション限定**。既存world保存には地形版と既訪問セルの移行規約がないため、42枚の地形改修にまたがる新しい永続データを本版で増やさない。同じProgressのホーム往復・マップ往復・戦闘復帰では保持し、ページ再読み込みでリセット。WeakMapに保持し、saveのschema2と保存項目は増やさない。画面にリセット仕様を明記。別セーブ・保存なし検証とは分離する。
- 星空粒子24個・導光装置の輪は10HzバッチのPhaser図形で画面外を除外。低モーションでは静止表現。画像・音声・外部URL・依存追加なし。

## 保存互換性

保存キー `astra-chronica:v1`、schema **2**、save.tsの形式を維持。章・選択・依頼・武器・会話ページ・敵撃破・箱は既存構造を拡張登録する。未知ID・破損フラグ・不正座標・未解放マップは既存正規化で復元。旧章・レベル・経験値・SP・90ノード・装備・数量・戦績・探索・時間装置を保持。未確定戦闘は報酬なしで取消・安全復帰し、同一結果を二重処理しない。光路は確定イベントから導出し、保存なしLabは本編を書き換えない。

## 検証結果

- 変更前v1.9：**948/948成功**。既存テストを削除・skip化せず維持。
- `npm test`：**1065/1065成功、25ファイル**。実測時間 `42.33s`。第12章42件、共通探索74件、既存の汎用目的テストの第12章1ケースを追加。32選択の全組合せ、両依頼経路各20seed、予兆保持、星力吸収、全90ノード取得済み旧セーブ、武器実補正、42マップを検証。
- Chromiumタッチの第12章通し：**両経路成功、計12回の実勝利**。初期Lv43・強制習得ノードなし。会話途中／パズル途中の再読み込み、撤退と再挑戦、依頼の章クリア前／後の受領、5選択、旧11章保持、保存なしLab分離を確認。開始時fixture以外、勝敗や移動座標を実行途中に注入していない。
- 全42マップ×320/390/430/768px：**168ケース成功**。ミニマップの論理座標、開閉時のcanvas寸法一致、44px領域、接近・出口・メニュー中停止・横スクロールなしを確認。
- 潮位2状態・共鳴4状態・光路4状態：再読込と不正な閉鎖地点からの安全復元に成功。未知の派生フィールドで確定進行を上書きできない。
- ミニマップ専用テスト：実歩行色、現在地、タップ透過、同一セッション保持、マップ間分離、再読み込み時の探索色リセット、本編保存フィールドの非追加に成功。
- 新武器3種：装備・所有者制限・4幅・保存再読込・数量維持・実測1ヒットと星力15を確認。装備前後の能力比較画像も取得。
- 会話／ボス／章クリアの4幅：成功。低モーション、選択中の資源非消費、撤退、安全復帰、実再挑戦・勝利を確認（レイアウト専用Lv50 fixture）。
- 標準WebGL：成功。歩行、NPC、巡回敵への実接触、左右のサイドビュー、実測ポップアップ、撤退と安全復帰を確認。新規6ブラウザファイルの実行時エラーは0件。
- **既存ブラウザ40ファイル＋新規6ファイル、全成功**。既存の第1〜11章、育成・装備・旧探索・サイドビュー・保存なし検証を維持。専用fixture用の開発サーバー未起動で失敗した戦闘UIは、起動後に同じテストを再実行して成功。
- `npm run build`：**TypeScript＋Vite本番ビルド成功、111モジュール、11.08s**。ブラウザ終了後に全件テストとビルドを単独実行。最終distの全4ファイルがブラウザ検証用候補とバイト単位で一致。
- 詳細な実行対象と互換性記録：[test-results/v20.json](test-results/v20.json)。

```sh
npm test
npm run build
# 別ターミナルで npm run preview -- --port 4173
BASE_URL=http://localhost:4173 npm run test:browser-v20
# 既存の専用fixtureには追加で npm run dev -- --port 5173 が必要
BASE_URL=http://localhost:4173 UI_TEST_URL=http://localhost:5173 npm run test:browser-all
```

長い通しはChromiumのCanvasフォールバック、標準WebGLは別smokeで実施。製品のPhaser.AUTO設定は変更していない。iPhone Safari実機は未確認で、手動確認をユーザーへ依頼しない。

## スクリーンショット

主要画面を実際のタッチ操作後に取得。会話・集落・ミニマップ・ボス・クリア結果は4幅を含む。武器比較は詳細領域をそのまま撮影し、その他は実画面の全体画像。

|画面|画像|
|---|---|
|森の集落|[320](screenshots/exploration-v20-gloom-village-320.png) / [390](screenshots/exploration-v20-gloom-village-390.png) / [430](screenshots/exploration-v20-gloom-village-430.png) / [768](screenshots/exploration-v20-gloom-village-768.png)|
|ミニマップ|[320](screenshots/exploration-v20-minimap-320.png) / [390](screenshots/exploration-v20-minimap-390.png) / [430](screenshots/exploration-v20-minimap-430.png) / [768](screenshots/exploration-v20-minimap-768.png)|
|会話|[320](screenshots/chapter-twelve-dialogue-320.png) / [390](screenshots/chapter-twelve-dialogue-390.png) / [430](screenshots/chapter-twelve-dialogue-430.png) / [768](screenshots/chapter-twelve-dialogue-768.png)|
|ボス戦UI|[320](screenshots/chapter-twelve-boss-ui-320.png) / [390](screenshots/chapter-twelve-boss-ui-390.png) / [430](screenshots/chapter-twelve-boss-ui-430.png) / [768](screenshots/chapter-twelve-boss-ui-768.png)|
|章クリア|[320](screenshots/chapter-twelve-clear-320.png) / [390](screenshots/chapter-twelve-clear-390.png) / [430](screenshots/chapter-twelve-clear-430.png) / [768](screenshots/chapter-twelve-clear-768.png)|
|光路4段階|[常闇](screenshots/exploration-v20-light-dark-390.png) / [微光](screenshots/exploration-v20-light-glimmer-390.png) / [星光連結](screenshots/exploration-v20-light-linked-390.png) / [再生](screenshots/exploration-v20-light-renewed-390.png)|
|新武器比較|[星樹の剣](screenshots/chapter-twelve-weapon-startree-sword-390.png) / [翠星の盾槍](screenshots/chapter-twelve-weapon-emerald-shield-spear-390.png) / [古樹のロッド](screenshots/chapter-twelve-weapon-eldertree-rod-390.png)|
|戦闘|[通常戦闘](screenshots/chapter-twelve-road-battle-390.png) / [中ボス](screenshots/chapter-twelve-guardian-battle-390.png) / [最終ボス](screenshots/chapter-twelve-astravore-battle-390.png) / [WebGL実測表示](screenshots/chapter-twelve-webgl-action-390.png)|

<details>
<summary>全スクリーンショット（83枚）</summary>

- [chapter-twelve-archive-390.png](screenshots/chapter-twelve-archive-390.png)
- [chapter-twelve-archive-battle-390.png](screenshots/chapter-twelve-archive-battle-390.png)
- [chapter-twelve-archive-result-390.png](screenshots/chapter-twelve-archive-result-390.png)
- [chapter-twelve-astravore-battle-390.png](screenshots/chapter-twelve-astravore-battle-390.png)
- [chapter-twelve-astravore-result-390.png](screenshots/chapter-twelve-astravore-result-390.png)
- [chapter-twelve-boss-ui-320.png](screenshots/chapter-twelve-boss-ui-320.png)
- [chapter-twelve-boss-ui-390.png](screenshots/chapter-twelve-boss-ui-390.png)
- [chapter-twelve-boss-ui-430.png](screenshots/chapter-twelve-boss-ui-430.png)
- [chapter-twelve-boss-ui-768.png](screenshots/chapter-twelve-boss-ui-768.png)
- [chapter-twelve-choice-390.png](screenshots/chapter-twelve-choice-390.png)
- [chapter-twelve-clear-320.png](screenshots/chapter-twelve-clear-320.png)
- [chapter-twelve-clear-390.png](screenshots/chapter-twelve-clear-390.png)
- [chapter-twelve-clear-430.png](screenshots/chapter-twelve-clear-430.png)
- [chapter-twelve-clear-768.png](screenshots/chapter-twelve-clear-768.png)
- [chapter-twelve-core-390.png](screenshots/chapter-twelve-core-390.png)
- [chapter-twelve-dialogue-320.png](screenshots/chapter-twelve-dialogue-320.png)
- [chapter-twelve-dialogue-390.png](screenshots/chapter-twelve-dialogue-390.png)
- [chapter-twelve-dialogue-430.png](screenshots/chapter-twelve-dialogue-430.png)
- [chapter-twelve-dialogue-768.png](screenshots/chapter-twelve-dialogue-768.png)
- [chapter-twelve-enemy-symbol-390.png](screenshots/chapter-twelve-enemy-symbol-390.png)
- [chapter-twelve-equipment-390.png](screenshots/chapter-twelve-equipment-390.png)
- [chapter-twelve-faint-390.png](screenshots/chapter-twelve-faint-390.png)
- [chapter-twelve-field-390.png](screenshots/chapter-twelve-field-390.png)
- [chapter-twelve-field-battle-390.png](screenshots/chapter-twelve-field-battle-390.png)
- [chapter-twelve-field-result-390.png](screenshots/chapter-twelve-field-result-390.png)
- [chapter-twelve-guardian-battle-390.png](screenshots/chapter-twelve-guardian-battle-390.png)
- [chapter-twelve-guardian-result-390.png](screenshots/chapter-twelve-guardian-result-390.png)
- [chapter-twelve-journal-390.png](screenshots/chapter-twelve-journal-390.png)
- [chapter-twelve-linked-390.png](screenshots/chapter-twelve-linked-390.png)
- [chapter-twelve-new-weapons-action-390.png](screenshots/chapter-twelve-new-weapons-action-390.png)
- [chapter-twelve-npc-390.png](screenshots/chapter-twelve-npc-390.png)
- [chapter-twelve-ravine-390.png](screenshots/chapter-twelve-ravine-390.png)
- [chapter-twelve-road-390.png](screenshots/chapter-twelve-road-390.png)
- [chapter-twelve-road-battle-390.png](screenshots/chapter-twelve-road-battle-390.png)
- [chapter-twelve-road-result-390.png](screenshots/chapter-twelve-road-result-390.png)
- [chapter-twelve-sanctuary-390.png](screenshots/chapter-twelve-sanctuary-390.png)
- [chapter-twelve-sanctuary-battle-390.png](screenshots/chapter-twelve-sanctuary-battle-390.png)
- [chapter-twelve-sanctuary-result-390.png](screenshots/chapter-twelve-sanctuary-result-390.png)
- [chapter-twelve-silent-390.png](screenshots/chapter-twelve-silent-390.png)
- [chapter-twelve-village-390.png](screenshots/chapter-twelve-village-390.png)
- [chapter-twelve-weapon-eldertree-rod-390.png](screenshots/chapter-twelve-weapon-eldertree-rod-390.png)
- [chapter-twelve-weapon-emerald-shield-spear-390.png](screenshots/chapter-twelve-weapon-emerald-shield-spear-390.png)
- [chapter-twelve-weapon-startree-sword-390.png](screenshots/chapter-twelve-weapon-startree-sword-390.png)
- [chapter-twelve-webgl-action-390.png](screenshots/chapter-twelve-webgl-action-390.png)
- [exploration-v20-gloom-archive-390.png](screenshots/exploration-v20-gloom-archive-390.png)
- [exploration-v20-gloom-archive-detail-390.png](screenshots/exploration-v20-gloom-archive-detail-390.png)
- [exploration-v20-gloom-core-390.png](screenshots/exploration-v20-gloom-core-390.png)
- [exploration-v20-gloom-core-detail-390.png](screenshots/exploration-v20-gloom-core-detail-390.png)
- [exploration-v20-gloom-lake-390.png](screenshots/exploration-v20-gloom-lake-390.png)
- [exploration-v20-gloom-lake-detail-390.png](screenshots/exploration-v20-gloom-lake-detail-390.png)
- [exploration-v20-gloom-road-390.png](screenshots/exploration-v20-gloom-road-390.png)
- [exploration-v20-gloom-roots-390.png](screenshots/exploration-v20-gloom-roots-390.png)
- [exploration-v20-gloom-roots-detail-390.png](screenshots/exploration-v20-gloom-roots-detail-390.png)
- [exploration-v20-gloom-shrine-390.png](screenshots/exploration-v20-gloom-shrine-390.png)
- [exploration-v20-gloom-shrine-detail-390.png](screenshots/exploration-v20-gloom-shrine-detail-390.png)
- [exploration-v20-gloom-village-320.png](screenshots/exploration-v20-gloom-village-320.png)
- [exploration-v20-gloom-village-390.png](screenshots/exploration-v20-gloom-village-390.png)
- [exploration-v20-gloom-village-430.png](screenshots/exploration-v20-gloom-village-430.png)
- [exploration-v20-gloom-village-768.png](screenshots/exploration-v20-gloom-village-768.png)
- [exploration-v20-gloom-village-detail-390.png](screenshots/exploration-v20-gloom-village-detail-390.png)
- [exploration-v20-gloom-woods-390.png](screenshots/exploration-v20-gloom-woods-390.png)
- [exploration-v20-gloom-woods-detail-390.png](screenshots/exploration-v20-gloom-woods-detail-390.png)
- [exploration-v20-grove-garden-390.png](screenshots/exploration-v20-grove-garden-390.png)
- [exploration-v20-grove-village-390.png](screenshots/exploration-v20-grove-village-390.png)
- [exploration-v20-high-reload-390.png](screenshots/exploration-v20-high-reload-390.png)
- [exploration-v20-light-dark-390.png](screenshots/exploration-v20-light-dark-390.png)
- [exploration-v20-light-glimmer-390.png](screenshots/exploration-v20-light-glimmer-390.png)
- [exploration-v20-light-linked-390.png](screenshots/exploration-v20-light-linked-390.png)
- [exploration-v20-light-renewed-390.png](screenshots/exploration-v20-light-renewed-390.png)
- [exploration-v20-low-reload-390.png](screenshots/exploration-v20-low-reload-390.png)
- [exploration-v20-minimap-320.png](screenshots/exploration-v20-minimap-320.png)
- [exploration-v20-minimap-390.png](screenshots/exploration-v20-minimap-390.png)
- [exploration-v20-minimap-430.png](screenshots/exploration-v20-minimap-430.png)
- [exploration-v20-minimap-768.png](screenshots/exploration-v20-minimap-768.png)
- [exploration-v20-minimap-walked-390.png](screenshots/exploration-v20-minimap-walked-390.png)
- [exploration-v20-old-eleven-npc-390.png](screenshots/exploration-v20-old-eleven-npc-390.png)
- [exploration-v20-old-eleven-road-390.png](screenshots/exploration-v20-old-eleven-road-390.png)
- [exploration-v20-resonance-calm-390.png](screenshots/exploration-v20-resonance-calm-390.png)
- [exploration-v20-resonance-faint-390.png](screenshots/exploration-v20-resonance-faint-390.png)
- [exploration-v20-resonance-linked-390.png](screenshots/exploration-v20-resonance-linked-390.png)
- [exploration-v20-resonance-silent-390.png](screenshots/exploration-v20-resonance-silent-390.png)
- [exploration-v20-sky-tower-390.png](screenshots/exploration-v20-sky-tower-390.png)
- [exploration-v20-sky-town-390.png](screenshots/exploration-v20-sky-town-390.png)

</details>

## 既知の制約

- 探索色は永続化しない。再読み込み後も位置・進行・報酬は保持する。
- 正式画像・自由移動の新方式・ジョブ・第13〜18章は追加していない。
- Chromiumタッチ／標準WebGLで検証し、iPhone Safari実機はこの環境では未確認。ユーザーへの手動確認依頼は行わない。
- Viteは既存Phaserチャンクの500kB超警告を出す。新規依存は追加しない。


## 照合で修正した案内

祠戦の説明に番兵の防御・反撃が混在していたため、実際の編成（根縛りの獣・夜光ウィスプ・星喰いの幼体）に合わせて修正。戦闘データや計算式は変更していない。

## 変更ファイル

- `README.md`
- `docs/CHAPTER_TWELVE_V20.md`
- `docs/test-results/v20.json`
- `package.json`
- `src/battle.ts`
- `src/data/chapter-one.ts`
- `src/data/chapter-twelve-enemies.ts`
- `src/data/chapter-twelve.ts`
- `src/data/dialogue-choices.ts`
- `src/data/encounters.ts`
- `src/data/enemy-scripts.ts`
- `src/data/journal.ts`
- `src/data/side-quests.ts`
- `src/data/weapons.ts`
- `src/exploration/chapter-twelve-maps.ts`
- `src/exploration/exploration.css`
- `src/exploration/gloom-effects.ts`
- `src/exploration/light-path.ts`
- `src/exploration/map-art.ts`
- `src/exploration/map-data.ts`
- `src/exploration/map-runtime.ts`
- `src/exploration/map-view.ts`
- `src/exploration/minimap-view.ts`
- `src/exploration/minimap.ts`
- `src/exploration/types.ts`
- `src/main.ts`
- `src/types.ts`
- `tests/browser-suite.mjs`
- `tests/chapter-eight-v16.e2e.mjs`
- `tests/chapter-eight-v16.test.ts`
- `tests/chapter-eleven-v19.e2e.mjs`
- `tests/chapter-eleven-v19.test.ts`
- `tests/chapter-five-v13.e2e.mjs`
- `tests/chapter-five-v13.test.ts`
- `tests/chapter-four-v12.e2e.mjs`
- `tests/chapter-four-v12.test.ts`
- `tests/chapter-nine-v17.e2e.mjs`
- `tests/chapter-nine-v17.test.ts`
- `tests/chapter-seven-v15.e2e.mjs`
- `tests/chapter-seven-v15.test.ts`
- `tests/chapter-six-v14.e2e.mjs`
- `tests/chapter-six-v14.test.ts`
- `tests/chapter-ten-v18.e2e.mjs`
- `tests/chapter-ten-v18.test.ts`
- `tests/chapter-twelve-equipment.e2e.mjs`
- `tests/chapter-twelve-fixture.mjs`
- `tests/chapter-twelve-ui.e2e.mjs`
- `tests/chapter-twelve-v20.e2e.mjs`
- `tests/chapter-twelve-v20.test.ts`
- `tests/chapter-two-v10.test.ts`
- `tests/exploration-v19.smoke.mjs`
- `tests/exploration-v19.test.ts`
- `tests/exploration-v20.e2e.mjs`
- `tests/exploration-v20.smoke.mjs`
- `tests/exploration-v20.test.ts`
- `tests/minimap-v20.e2e.mjs`

画像ファイルは上記一覧を参照。既存の公開設定・保存形式・旧章マップ定義・戦闘基本式は変更しない。
