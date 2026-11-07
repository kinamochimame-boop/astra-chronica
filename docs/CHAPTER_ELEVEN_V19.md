# v1.9 第11章「白銀の平原と声なき巡礼者」

## 基準・維持する仕様

最新mainを取得し、指定されたv1.8マージ `21cdcb3b9971f23f213e5dc42a5d4648e2f329a9` と一致することを確認。`feature/v1.9-chapter-eleven-exploration` で開発する。第1〜10章、既存26マップ、3人固定、武器9系統、90ノード、スキル・星力・成長・7属性・7状態異常・サイドビューの計算式を維持する。第12〜18章は未実装・未解放。mainへのマージ、Pages公開、PLiCy投稿は行わない。

## 物語とNPC

主題は「記録された言葉と、記録されなかった想い」。セラの観測記録と地下都市の地図から、白い記録粒子が積もる古代巡礼路へ進む。装置は願いを正確に保存しようとして、ためらい・書き足し・書かない意思まで雑音として消していた。

- **白銀のエイル**：明るい若い記録守。「ミラの声が戻ったら聞く」のではなく、「帰りを待つ間にも話を聞く」という約束を忘れている。新しい約束を本人と選び直す。
- **グレン**：慎重な護送隊長。「全員帰還」という一行と、別の帰路を選んだ一人の足跡を照合する。人数や記録だけで安全を判断しない。
- **白銀のミラ**：身振りと星文字で意思を伝える少女。声は章クリアで都合よく戻らない。意味を勝手に代弁せず、開く頁・伏せる頁を本人が選ぶ。

第6章にもエイルとミラの姉弟が存在するため、今回の2人は**別人**として導入台詞と手帳に明記。既存の姉弟関係や結末を変更しない。内部のイベント・手帳IDも `c11-` / `j11-` で分離する。

アステルは今の本人へ問い直し、リナは退路と選ばない自由を守り、メイは空・地底・海から続く「違う間隔を渡す」術式を読む。最後は言葉の主に巡礼路を返す。東の深い森へ続く記録を第12章への予告とし、第18章の真相は確定しない。

## 16地点・28イベント

メインイベントは直前イベントを前提とする。依頼完了はメインの条件に含めない。

|地点（IDはc11-接頭辞）|イベントID（c11-接頭辞）|歩行マップ|
|---|---|---|
|road 白銀への街道|arrival / road-fight / road-cache|pale-road|
|village 巡礼者の集落|eil（選択）/ rest|pale-village|
|field 白銀の大平原|glen / field-fight / escort-plan|pale-field|
|waystation 護送隊の宿駅|blades（武器）|従来地点UI|
|stones 星文字の石碑群|stones-reading（微かな共鳴）/ mira（選択）|pale-stones|
|ridge 巡礼の尾根|ridge-sign|従来地点UI|
|ravine 白い断層|mei-reading（選択）/ ravine-record|pale-ravine|
|shelter 風除けの小屋|shelter-rest|従来地点UI|
|sanctuary 沈黙の礼拝堂|sanctuary-fight / sanctuary-record|pale-sanctuary|
|garden 名もなき庭|garden-rest|従来地点UI|
|archive 巡礼記録庫|archive-fight / archive-tablet|pale-archive|
|passage 忘れられた渡り廊下|passage-record|従来地点UI|
|gate 巡礼路の守門|guardian / gate-tune（武器）|従来地点UI|
|vault 約束の保管室|vault-code（謎解き・星声の共鳴）/ mira-choice（選択）|従来地点UI|
|altar 星声の祭壇|promise（選択）|従来地点UI|
|core 星声の中枢|requiem（武器）/ clear|pale-core|

会話はゲーム内で複数ページ再生可能。未完了会話は中断再開でき、読了後の再訪は冒頭から再読する。休息は既存どおり各戦闘開始時のHP・MP全快を説明するイベントで、永続HP管理を追加しない。保管室のパズルは **聞く→確かめる→選ぶ**。誤答、リセット、3段階ヒント、再挑戦に対応。未確定の並べかけは再読込でリセットし、確定した進行・報酬は保持する。

### 重要選択・手帳

5件の選択 `c11-eil` / `c11-mira` / `c11-mei-reading` / `c11-mira-choice` / `c11-promise` は各2択。確定直後に保存し、再訪で上書きしない。全32通りでクリア可能。既存セーブへ選択を推測で補完しない。

手帳は `j11-1`〜`j11-8`。導入、エイル、グレン、ミラ、微かな共鳴、待つ約束、三つの余白、章クリアを、それぞれの到達イベント後に公開する。未来のNPC・ボス・核心を先に表示しない。探索記録は16地点＋28イベント＋3依頼＝47項目。メイン完了44/47＝93%、全依頼で100%。

## 敵と戦闘

別エンジンは作らず、既存の巡回接触・Battle・BattleEvent・成長・報酬・サイドビューを使用する。

|内部ID|敵|HP|攻撃|防御|速度|EXP|行動・属性|
|---|---|---:|---:|---:|---:|---:|---|
|white-scarab|白晶スカラベ|800|58|42|35|470|高防御の物理型|
|pilgrim-echo|巡礼の残響|820|55|34|34|480|風魔法90・麻痺20%／2行動|
|starsand-wisp|星砂ウィスプ|740|56|30|48|490|回避12%・物理に暗闇20%／2行動|
|silent-sentinel|無音の番兵|820|61|39|37|490|既存archiveGuard型・防御と1回の物理反撃|
|record-eater|記録喰らい|780|56|33|41|500|光魔法92・沈黙20%／2行動|
|fault-beast|断層の獣|700|57|29|65|470|通常2ヒット・土1.25／水0.5|
|pale-guardian|巡礼守護機・サイレンスガード|4100|61|41|39|1600|予兆・反撃・風全体98|
|requiem|星声の封印者・エコーレクイエム|6000|62|35|43|2200|3段階・闇1.25／風0.75／光0.5|

全8種の睡眠・凍結耐性は20%、その他の状態異常耐性は0%。未記載の属性倍率は1.0。武器や道具のランダムドロップは増やさず、既存の敵EXPと初回イベント報酬を使う。

戦闘編成は街道（スカラベ・残響・獣）、大平原（ウィスプ・番兵・記録喰らい）、礼拝堂（残響・記録喰らい・ウィスプ）、記録庫（スカラベ・獣・番兵）、中ボス、最終ボス。EXPは順に1420 / 1480 / 1470 / 1430 / 1600 / 2200、合計 **9600／人**。第10章9040から緩やかに増加。任意依頼EXP650は別途。

### ボスの周期と段階

- サイレンスガード：通常攻撃→防御・反撃・全体攻撃の予兆→風属性全体「無音の波」威力98。物理被弾に対する1回の反撃、行動不能時の反撃不可など既存仕様を利用。
- エコーレクイエム：HP65%超／30%超65%以下／30%以下の3段階。第1段階は単体物理と偶数行動の光魔法「共鳴の遮断」94。第2段階以降は周期2回目に防御と予兆を行い、次の行動で光の全体攻撃「封声の祈り」130、第3段階の新規予約は「白銀の鎮魂」158。第3段階の通常光魔法は112、物理は既存の1.15倍。第2段階以降の魔法に沈黙・暗闇が各20%／2行動。
- 既存の予約攻撃を使い、睡眠等の行動不能で消えず、フェーズ移行でも予約威力130を158へ上書きしない。
- 単体攻撃は挑発・かばうを処理。全体攻撃は挑発で1人に集めず、各対象の防御・かばう・誓盾を実際の被弾先へ適用。表示数値は実測BattleEventを使う。

## 武器・依頼・初回報酬

|武器ID・名前|系統・所有者|補正|特性・入手|
|---|---|---|---|
|whitestar-dual-blades 白星の双剣|dualBlades・アステル|攻撃+14、速度+3|通常0.5倍×2、宿駅の宝箱|
|pilgrim-shield-flail 巡礼守の盾フレイル|shieldFlail・リナ|攻撃+13、防御+15、最大HP+25|ガード軽減+0.01、守門の調律|
|starvoice-wand 星声のワンド|wand・メイ|攻撃+10、最大MP+12|回復1.25倍、最終ボス|

弓の速度、盾槍の防御、ロッドの属性魔法補正と引き換える選択肢。系統特性との二重加算はしない。既存装備比較・所持数・所有者制限・シルエットを使用。双剣の各ヒットの会心・相性を個別処理し、星力は通常攻撃1回分。スキル連牙斬をさらに二重化しない。ワンドの基礎ヒール85は実回復上限内で106（85×1.25を丸める）。

|依頼ID・名称|目的（順序あり）|報告先|報酬|
|---|---|---|---|
|sq-returning-pilgrim SQ-25 帰らない巡礼者|大平原の結び紐→石碑群の別の帰路の足跡|大平原|星露の小瓶3|
|sq-stone-names SQ-26 石碑に残る名前|断層の薄い名→保管室の写し|白い断層|EXP650／人|
|sq-mira-promise SQ-27 ミラの小さな約束|石碑群の手のひらの写し→記録庫の組紐|風除けの小屋|灯火の雫3|

手掛かりIDは `pilgrim-strap` / `pilgrim-mark` / `stone-name` / `name-copy` / `mira-slate` / `mira-ribbon`。歩行マップでは実際に接近して調べる。未受注・前提未達・遠隔取得を拒否。所持上限99で全報酬を受け取れない場合は未受領を維持。メイン中／章クリア後とも達成・受領可能。初回宝箱・武器・EXP・戦績は既存のイベント完了とserialで重複防止する。

## 34マップ・共鳴

第7章5＋第8章5＋第9章8＋第10章8＋第11章8＝34枚。既存26枚の定義は維持する。

|新マップ|主な対象と出口|
|---|---|
|pale-road|エイル、避難標、巡回敵、箱→集落|
|pale-village|エイル、休息、案内板→街道／大平原|
|pale-field|グレン、巡回敵、護送記録、依頼→集落／宿駅／石碑群|
|pale-stones|共鳴碑、ミラ、石標、依頼→大平原／尾根／条件付き礼拝堂|
|pale-ravine|メイとミラ、筆跡、依頼→尾根／小屋|
|pale-sanctuary|追跡敵、祈りの裏書→石碑群／庭／記録庫|
|pale-archive|巡回敵、空白の石板、依頼→礼拝堂／渡り廊下／条件付き中枢|
|pale-core|接続碑、待機ボス、帰る巡礼者→祭壇|

|共鳴状態|確定条件|通路|
|---|---|---|
|沈黙|stones-reading前|石碑群の低い脇道を閉鎖。尾根の本経路は常に確保|
|微かな共鳴|c11-stones-reading完了|石碑群の20〜26列・16〜21行を開放。礼拝堂の行先はshelter-rest完了も必要|
|星声の共鳴|c11-vault-code完了|記録庫23〜26列・18〜21行を開放。中枢の行先はpromise完了も必要|
|鎮静|c11-clear完了|開放済みの巡礼路は再訪可能|

列・行は0始まりのグリッド座標。

`activeMap` が既存の潮位オーバーレイと汎用 `gates` を合成する。描画・A*・接触検証・位置復元で同じ実効グリッドを使用する。未知の共鳴フィールド・実時間・乱数を根拠に進行させない。閉鎖地形に保存位置がある場合は常設の安全入口へ戻す。入口・NPC・必須の本経路は状態変化で封鎖しない。潮位・砂嵐・旧章の時間状態には書き込まない。

## 共通探索改善

- 既存の目的・目的地・行動に、現在マップ内の対象の方向（巡回・追跡敵は実位置）、または次に通る有効な出口を追記する。マップの実際の出口と解放済み従来地点をBFSで探索し、未解放・条件未達・到達できない出口を誘導先から除外。目的達成後に更新し、未来の目的は表示しない。
- 遠方の対象タップで既存A*による接近を開始。到着後にもう一度調べるため、会話・出口を自動発火しない。従来の明示的な接近ボタンも維持する。
- 半径52px以内でも、4px間隔の視線検証で壁越し調査を拒否する。近接ボタン、表示の輪、イベント／依頼APIに同じ条件を適用。
- 未調査は◇、調査済みは✓と減光。状態は既存のイベント・依頼の完了から導出する。任意の案内板は何度でも読め、別の保存フラグを追加しない。
- タップ開始時・ガイド更新時・リサイズ時のPhaser座標境界更新を維持。
- 章選択の未実装案内が「第10〜18章」と固定されていた問題を修正。登録章数から次章番号を導出し、現在は「第12〜18章」と表示する。
- 巡回・追跡・待機、障害物回避、画面外更新抑制、0.65秒の接触猶予、戦闘開始時／メニュー時停止を維持。生存敵の途中位置は保存せず再入場時は初期配置、撃破済み状態は完了イベントから復元する。
- 白銀粒子・風・石碑の光と短い調査波紋は10Hzのバッチ図形。表示範囲外を描かず、低モーションは静止表現。タイマーや外部画像・音声・新依存は追加しない。シーン破棄で図形と既存リスナーを破棄する。

## 保存互換性

保存キー `astra-chronica:v1`、schema version **2**、既存save.tsを維持。章、会話ページ、重要選択、武器、依頼、宝箱、敵撃破、現在マップ、位置は既存の保存構造を使う。共鳴と案内は確定データから導出し、新しい永続フィールドを増やさない。

旧章・レベル・経験値・SP導出・90ノード・所持数・戦績・道標・時間・潮位を保持する。未知ID、不正座標、未解放マップは共通の正規化で復旧。未確定戦闘は報酬を与えず安全に取り消す。保存なしLabSessionは本編へ書き込まない。

## 検証結果

- v1.8基準：850/850成功（変更前）。
- `npm test`：**948/948成功、23ファイル、46.87秒**（最終・ブラウザ終了後の単独実行）。既存850件を維持し、第11章36件＋共通探索61件＋既存の汎用目的テストの第11章1ケースを追加。全32選択、両依頼経路各20seed、段階・予兆・武器実補正、34マップ・共鳴・保存と壁越し操作を検証。
- 第11章ブラウザ両経路：成功、計12回の実勝利。依頼をクリア前／後に達成し、全5選択・謎解き・全共鳴状態・旧10章保持・保存なしLab分離を確認。
- 全34マップ×320/390/430/768px：136ケース成功。追加で共鳴4状態の再読込・不正な閉鎖地点からの安全復元・同じ視点の比較画像を確認。
- 新武器の装備・再読込・実測2ヒット：成功。会話・ボス・クリア結果の4幅、選択時の資源非消費、撤退／再挑戦／実勝利も成功。
- 標準WebGL：成功。歩行、NPC直接タップ、調査、巡回敵との実接触、左右のサイドビュー、実測数値、撤退／安全復帰、実行時エラー0件。
- 既存ブラウザ回帰：**35ファイル成功**（31コマンド群）。第1〜10章の通し、旧18・26マップ、基本UI・装備・育成・Lab・サイドビュー・標準WebGLを含む。新規は**5ファイル成功**。
- `npm run build`：**TypeScript＋Vite本番ビルド成功、104モジュール**。最終ビルドの全生成ファイルが、ブラウザ検証用ビルドとバイト単位で一致することを確認。

```sh
npm test
npm run build
# 別ターミナルで npm run preview -- --port 4173
BASE_URL=http://localhost:4173 npm run test:chapter-eleven
BASE_URL=http://localhost:4173 npm run test:exploration-v19
BASE_URL=http://localhost:4173 npm run test:chapter-eleven-equipment
BASE_URL=http://localhost:4173 npm run test:chapter-eleven-ui
BASE_URL=http://localhost:4173 npm run test:exploration-v19-smoke
```

ブラウザはChromiumのタッチ操作。開始時の独立したセーブfixture以外、通しプレイの勝敗・報酬・移動座標は実行途中に注入しない。通常通しはLv39開始、レイアウト専用の追加再挑戦のみLv50。長い通しはCanvasフォールバック、標準WebGLは別smokeで確認する。Phaser.AUTOは変更しない。

## スクリーンショット・変更ファイル

|画面|画像|
|---|---|
|集落・4幅|[320](screenshots/exploration-v19-pale-village-320.png) / [390](screenshots/exploration-v19-pale-village-390.png) / [430](screenshots/exploration-v19-pale-village-430.png) / [768](screenshots/exploration-v19-pale-village-768.png)|
|共鳴4状態・同じ視点|[沈黙](screenshots/exploration-v19-resonance-silent-390.png) / [微かな共鳴](screenshots/exploration-v19-resonance-faint-390.png) / [星声の共鳴](screenshots/exploration-v19-resonance-linked-390.png) / [鎮静](screenshots/exploration-v19-resonance-calm-390.png)|
|平原・石碑・断層|[大平原](screenshots/exploration-v19-pale-field-detail-390.png) / [石碑群](screenshots/exploration-v19-pale-stones-detail-390.png) / [断層](screenshots/exploration-v19-pale-ravine-detail-390.png)|
|礼拝堂・記録庫・中枢|[礼拝堂](screenshots/exploration-v19-pale-sanctuary-detail-390.png) / [記録庫](screenshots/exploration-v19-pale-archive-detail-390.png) / [中枢](screenshots/exploration-v19-pale-core-detail-390.png)|
|会話・4幅|[320](screenshots/chapter-eleven-dialogue-320.png) / [390](screenshots/chapter-eleven-dialogue-390.png) / [430](screenshots/chapter-eleven-dialogue-430.png) / [768](screenshots/chapter-eleven-dialogue-768.png)|
|戦闘|[中ボス](screenshots/chapter-eleven-guardian-battle-390.png) / [最終ボス](screenshots/chapter-eleven-requiem-battle-390.png) / [WebGL実測表示](screenshots/chapter-eleven-webgl-action-390.png)|
|装備|[新武器](screenshots/chapter-eleven-equipment-390.png) / [双剣の実測2ヒット](screenshots/chapter-eleven-new-weapons-action-390.png)|
|クリア|[通常Lv39開始のクリア結果](screenshots/chapter-eleven-requiem-result-390.png) / [320](screenshots/chapter-eleven-clear-320.png) / [390](screenshots/chapter-eleven-clear-390.png) / [430](screenshots/chapter-eleven-clear-430.png) / [768](screenshots/chapter-eleven-clear-768.png) / [手帳](screenshots/chapter-eleven-journal-390.png)|

<details>
<summary>全スクリーンショット一覧（69枚）</summary>

|ファイル|サイズ|
|---|---|
|[chapter-eleven-archive-390.png](screenshots/chapter-eleven-archive-390.png)|390×845|
|[chapter-eleven-archive-battle-390.png](screenshots/chapter-eleven-archive-battle-390.png)|390×844|
|[chapter-eleven-archive-result-390.png](screenshots/chapter-eleven-archive-result-390.png)|390×912|
|[chapter-eleven-boss-ui-320.png](screenshots/chapter-eleven-boss-ui-320.png)|320×844|
|[chapter-eleven-boss-ui-390.png](screenshots/chapter-eleven-boss-ui-390.png)|390×844|
|[chapter-eleven-boss-ui-430.png](screenshots/chapter-eleven-boss-ui-430.png)|430×844|
|[chapter-eleven-boss-ui-768.png](screenshots/chapter-eleven-boss-ui-768.png)|768×1024|
|[chapter-eleven-choice-390.png](screenshots/chapter-eleven-choice-390.png)|390×2191|
|[chapter-eleven-clear-320.png](screenshots/chapter-eleven-clear-320.png)|320×967|
|[chapter-eleven-clear-390.png](screenshots/chapter-eleven-clear-390.png)|390×992|
|[chapter-eleven-clear-430.png](screenshots/chapter-eleven-clear-430.png)|430×1023|
|[chapter-eleven-clear-768.png](screenshots/chapter-eleven-clear-768.png)|768×1024|
|[chapter-eleven-core-390.png](screenshots/chapter-eleven-core-390.png)|390×863|
|[chapter-eleven-dialogue-320.png](screenshots/chapter-eleven-dialogue-320.png)|320×862|
|[chapter-eleven-dialogue-390.png](screenshots/chapter-eleven-dialogue-390.png)|390×845|
|[chapter-eleven-dialogue-430.png](screenshots/chapter-eleven-dialogue-430.png)|430×845|
|[chapter-eleven-dialogue-768.png](screenshots/chapter-eleven-dialogue-768.png)|768×1024|
|[chapter-eleven-enemy-symbol-390.png](screenshots/chapter-eleven-enemy-symbol-390.png)|390×845|
|[chapter-eleven-equipment-390.png](screenshots/chapter-eleven-equipment-390.png)|390×4106|
|[chapter-eleven-faint-390.png](screenshots/chapter-eleven-faint-390.png)|390×863|
|[chapter-eleven-field-390.png](screenshots/chapter-eleven-field-390.png)|390×863|
|[chapter-eleven-field-battle-390.png](screenshots/chapter-eleven-field-battle-390.png)|390×844|
|[chapter-eleven-field-result-390.png](screenshots/chapter-eleven-field-result-390.png)|390×912|
|[chapter-eleven-guardian-battle-390.png](screenshots/chapter-eleven-guardian-battle-390.png)|390×844|
|[chapter-eleven-guardian-result-390.png](screenshots/chapter-eleven-guardian-result-390.png)|390×912|
|[chapter-eleven-journal-390.png](screenshots/chapter-eleven-journal-390.png)|390×11640|
|[chapter-eleven-linked-390.png](screenshots/chapter-eleven-linked-390.png)|390×863|
|[chapter-eleven-new-weapons-action-390.png](screenshots/chapter-eleven-new-weapons-action-390.png)|390×844|
|[chapter-eleven-npc-390.png](screenshots/chapter-eleven-npc-390.png)|390×845|
|[chapter-eleven-ravine-390.png](screenshots/chapter-eleven-ravine-390.png)|390×863|
|[chapter-eleven-requiem-battle-390.png](screenshots/chapter-eleven-requiem-battle-390.png)|390×844|
|[chapter-eleven-requiem-result-390.png](screenshots/chapter-eleven-requiem-result-390.png)|390×992|
|[chapter-eleven-road-390.png](screenshots/chapter-eleven-road-390.png)|390×845|
|[chapter-eleven-road-battle-390.png](screenshots/chapter-eleven-road-battle-390.png)|390×844|
|[chapter-eleven-road-result-390.png](screenshots/chapter-eleven-road-result-390.png)|390×912|
|[chapter-eleven-sanctuary-390.png](screenshots/chapter-eleven-sanctuary-390.png)|390×863|
|[chapter-eleven-sanctuary-battle-390.png](screenshots/chapter-eleven-sanctuary-battle-390.png)|390×844|
|[chapter-eleven-sanctuary-result-390.png](screenshots/chapter-eleven-sanctuary-result-390.png)|390×912|
|[chapter-eleven-silent-390.png](screenshots/chapter-eleven-silent-390.png)|390×863|
|[chapter-eleven-village-390.png](screenshots/chapter-eleven-village-390.png)|390×845|
|[chapter-eleven-webgl-action-390.png](screenshots/chapter-eleven-webgl-action-390.png)|390×844|
|[exploration-v19-grove-garden-390.png](screenshots/exploration-v19-grove-garden-390.png)|390×845|
|[exploration-v19-grove-village-390.png](screenshots/exploration-v19-grove-village-390.png)|390×845|
|[exploration-v19-high-reload-390.png](screenshots/exploration-v19-high-reload-390.png)|390×863|
|[exploration-v19-low-reload-390.png](screenshots/exploration-v19-low-reload-390.png)|390×863|
|[exploration-v19-pale-archive-390.png](screenshots/exploration-v19-pale-archive-390.png)|390×845|
|[exploration-v19-pale-archive-detail-390.png](screenshots/exploration-v19-pale-archive-detail-390.png)|390×845|
|[exploration-v19-pale-core-390.png](screenshots/exploration-v19-pale-core-390.png)|390×845|
|[exploration-v19-pale-core-detail-390.png](screenshots/exploration-v19-pale-core-detail-390.png)|390×845|
|[exploration-v19-pale-field-390.png](screenshots/exploration-v19-pale-field-390.png)|390×845|
|[exploration-v19-pale-field-detail-390.png](screenshots/exploration-v19-pale-field-detail-390.png)|390×845|
|[exploration-v19-pale-ravine-390.png](screenshots/exploration-v19-pale-ravine-390.png)|390×845|
|[exploration-v19-pale-ravine-detail-390.png](screenshots/exploration-v19-pale-ravine-detail-390.png)|390×845|
|[exploration-v19-pale-road-390.png](screenshots/exploration-v19-pale-road-390.png)|390×845|
|[exploration-v19-pale-sanctuary-390.png](screenshots/exploration-v19-pale-sanctuary-390.png)|390×845|
|[exploration-v19-pale-sanctuary-detail-390.png](screenshots/exploration-v19-pale-sanctuary-detail-390.png)|390×845|
|[exploration-v19-pale-stones-390.png](screenshots/exploration-v19-pale-stones-390.png)|390×845|
|[exploration-v19-pale-stones-detail-390.png](screenshots/exploration-v19-pale-stones-detail-390.png)|390×845|
|[exploration-v19-pale-village-320.png](screenshots/exploration-v19-pale-village-320.png)|320×844|
|[exploration-v19-pale-village-390.png](screenshots/exploration-v19-pale-village-390.png)|390×845|
|[exploration-v19-pale-village-430.png](screenshots/exploration-v19-pale-village-430.png)|430×845|
|[exploration-v19-pale-village-768.png](screenshots/exploration-v19-pale-village-768.png)|768×1024|
|[exploration-v19-pale-village-detail-390.png](screenshots/exploration-v19-pale-village-detail-390.png)|390×845|
|[exploration-v19-resonance-calm-390.png](screenshots/exploration-v19-resonance-calm-390.png)|390×845|
|[exploration-v19-resonance-faint-390.png](screenshots/exploration-v19-resonance-faint-390.png)|390×863|
|[exploration-v19-resonance-linked-390.png](screenshots/exploration-v19-resonance-linked-390.png)|390×863|
|[exploration-v19-resonance-silent-390.png](screenshots/exploration-v19-resonance-silent-390.png)|390×863|
|[exploration-v19-sky-tower-390.png](screenshots/exploration-v19-sky-tower-390.png)|390×845|
|[exploration-v19-sky-town-390.png](screenshots/exploration-v19-sky-town-390.png)|390×845|

</details>

主な追加：`src/data/chapter-eleven.ts` / `chapter-eleven-enemies.ts`、`src/exploration/chapter-eleven-maps.ts` / `active-map.ts` / `resonance.ts` / `navigation.ts` / `pale-effects.ts`、単体2ファイル・ブラウザ5ファイルとfixture。章・武器・依頼・選択・手帳・敵の既存レジストリ、探索の表示・復元・近接検証、main、型、package.json、READMEを更新。旧サイドビューLabの32ダメージ試験は偶発クリティカルを除くため、テスト側だけ乱数を0.99に固定した。ゲームの乱数・ダメージ計算は変更していない。既存テストは削除せず、章数・将来章の期待値と旧26マップの対象範囲を更新する。

## 既知の制約

- 仮図形・4方向タイル移動。第11章の残り8地点は従来地点UI。正式キャラクターデザイン、ジョブ変更、自由な斜め移動は追加しない。
- 未確定パズルの並べかけと、生存敵の途中位置は再読込でリセットする。確定進行・撃破・報酬・安全な位置は維持。
- iPhone Safari実機／WebKitは未検証。Chromiumタッチの成功を実機確認として扱わない。ユーザーへの手動テスト依頼はしない。
- Phaserの既存チャンクサイズ警告は残る。
- 第12章は予告のみ。以後も共通の章・イベント・serial・実効マップ・保存処理を拡張し、別システムを重複実装しない。
