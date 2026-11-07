# v2.1 第13章「星なき機巧都市と眠れる天球儀」

## 基準と維持仕様

最新mainは指定の `3609219de47bbc6d74165ede2422821fee234055` と一致。`feature/v2.1-chapter-thirteen-exploration` で開発。第1〜12章、3人固定、武器9系統、90ノード、7属性・7状態異常、サイドビュー、基本ダメージ式・旧敵AI・Pages設定を維持。第12章クリアで解放し、第14〜18章は未実装・未解放。mainへのマージ・Pages公開・PLiCy投稿は行わない。

## 物語とNPC

北の台地を示す第12章の観測印には、地下の鉄道へ星脈を返す導線が残っていた。帰りの制動機を直して都市オルディアへ向かう。主題は「守られた偽物の空と、危険を伴う本物の空」。停止は観測記録を今の空と誤認した事故から住民を守る措置だったが、再開の条件まで消されていた。

- **ノエル**：外の空を見たい整備士。進む力だけでなく帰る仕組みを直し、祖母の日誌から再開を次の住民へ託した意思を知る。
- **イザーク**：人工の時刻を守る管理官。停止の理由に固執していたが、開く時刻を住民へ分ける責任を引き受ける。
- **フィオラ**：オルディアの星図研究者。第7章の薬草師フィーネと名前が重複するため、依頼文の新NPC「フィーネ」はフィオラへ変更。既存フィーネの名前・設定は変更しない。

アステルは二者択一で終わらない決断、リナは見ずに休む自由と退路、メイは観測・記録・今の差の読解を担う。第9章の記憶、第10章の観測、第11章の余白、第12章の循環を結ぶ。天球儀は「今の本物の空そのもの」ではなく本物の星々を観測した記録を映す装置と明記し、記録と現実を取り違えない結末。人工の昼夜も休む人のために残す。第14章は東の高原の観測路への導入だけで、最終章の結末は確定しない。

## 16地点・28イベント

直前イベントを前提に順次解放する。依頼完了や選択の種類はメイン進行の条件にしない。歩行マップの接触は従来どおり即戦闘、前後のstory／clear会話で物語を進める。休息は戦闘開始時HP・MP全快という既存仕様を説明し、永続HP管理は増やさない。

|地点ID・名前|イベントID・名前|歩行マップ|
|---|---|---|
|c13-rail 星脈鉄道跡|c13-arrival 根の先に眠る鉄路 / c13-rail-fight 眠る軌道の巡回機 / c13-rail-cache 整備隊の備え箱|gear-rail|
|c13-station 古代鉄道駅|c13-noel 帰りを直す整備士 / c13-rail-start 線路へ返る星脈|gear-station|
|c13-city 機巧都市中央区|c13-isaac 星を映さない都市 / c13-city-fight 人工天空の警報 / c13-residents 空を知らない朝|gear-city|
|c13-platform 上層連絡ホーム|c13-duals 星機の二つの刃|従来地点UI|
|c13-market 歯車市場|c13-aux-power 市場へ灯る補助動力 / c13-fiora 星図を読むフィオラ|gear-market|
|c13-clock 停止した時計塔|c13-clock-sign 誰のための時刻|従来地点UI|
|c13-lower 都市下層区|c13-lower-reading 消された星の余白 / c13-lower-record 整備日誌の空白|gear-lower|
|c13-refuge 地下の待合所|c13-refuge-rest 見ない自由を守る場所|従来地点UI|
|c13-workshop 機巧工房|c13-workshop-fight 工房の暴走警報 / c13-workshop-record 停止は終わりではなかった|gear-workshop|
|c13-garden 人工の庭|c13-garden-rest 同じ昼をほどく庭|従来地点UI|
|c13-observatory 天球儀観測塔|c13-observatory-fight 観測塔の封鎖機 / c13-observatory-tablet 停止された再開条件|gear-observatory|
|c13-bridge 観測連絡橋|c13-bridge-record 星図を分ける橋|従来地点UI|
|c13-gate 天球の守門|c13-guardian 天球守護機・アストロセンチネル / c13-gate-tune 守る規律へ書き足す|従来地点UI|
|c13-charts 原初星図室|c13-chart-sync 観測と記録と今 / c13-fiora-choice 一つに揃えない星空|従来地点UI|
|c13-altar 虚天の祭壇|c13-promise 空を選び直す約束|従来地点UI|
|c13-core 天球儀中枢|c13-zero 虚天の観測者・セレスティアルゼロ / c13-clear 違う空を渡す駅|gear-core|

パズルは **観測→記録→比較**。誤答・リセット・3段階ヒント・再挑戦・中断再開に対応。並べかけは再読み込みでリセットし、確定イベントと報酬は保持する。

## 重要選択と手帳

各2択、計5件。全32通りで章クリア可能。確定直後に保存し、再訪で上書きしない。旧セーブへ選択を推測して補完しない。

|選択ID|選択肢と応答者|
|---|---|
|c13-noel|share-brakes：帰りの仕組みを先に確かめる（ノエル） / ask-dream：見たい空について聞く（ノエル）|
|c13-fiora|compare-skies：違う空の記録を比べる（メイ） / ask-residents：住民の望みを聞く（フィオラ）|
|c13-lower-reading|return-signs：消された署名を戻す（アステル） / keep-shelter：見ないで休む場所を守る（リナ）|
|c13-fiora-choice|read-difference：ずれた理由を読みたい（フィオラ） / leave-pages：次の人の頁を残す（フィオラ）|
|c13-promise|open-with-care：危険を伝えて空を開く（アステル） / share-control：開く時を皆で選ぶ（イザーク）|

|記事ID|記事|解放イベント|
|---|---|---|
|j13-1|根の先の鉄道|c13-arrival|
|j13-2|整備士ノエル|c13-noel|
|j13-3|管理官イザーク|c13-isaac|
|j13-4|星図研究者フィオラ|c13-fiora|
|j13-5|部分起動する空|c13-aux-power|
|j13-6|記録と本物の空|c13-workshop-record|
|j13-7|違いを残す同期|c13-chart-sync|
|j13-8|違う空を渡す駅|c13-clear|

手帳は到達済みの8記事のみ公開。探索記録は16地点＋28イベント＋3依頼＝47項目。メイン完了93%、全依頼受領で100%。

## 敵・編成・ボス

別の戦闘エンジンを作らず、既存Battle・成長・報酬・サイドビューを共用する。

|ID・敵|HP|攻撃|防御|速度|EXP|属性相性|
|---|---:|---:|---:|---:|---:|---|
|gear-scout 歯車スカウト|820|66|35|76|540|全て1.0|
|gear-guardian 機巧ガーディアン|930|66|46|40|550|water×1.25 / earth×0.75|
|vein-drone 星脈ドローン|860|62|37|48|530|全て1.0|
|wild-repair 暴走整備機|880|65|36|52|540|全て1.0|
|sphere-phantom 天球の幻影|830|61|35|59|550|light×1.25 / dark×0.75|
|chart-eater 星図喰らい|840|64|36|50|550|全て1.0|
|astro-sentinel 天球守護機・アストロセンチネル|4600|66|46|42|1800|water×1.25 / light×0.75|
|celestial-zero 虚天の観測者・セレスティアルゼロ|6500|67|38|46|2450|water×1.25 / dark×0.5|

全8種：睡眠・凍結耐性20%、その他0%。未記載属性は1.0。新属性・新状態異常は追加しない。 通常攻撃は無属性。全8種のMP／最大MPは0、基底レベルは1で、上表の能力値を直接指定する。敵の魔法は既存AIと同じ固定威力・MP非消費で処理する。

- スカウト：素早い通常物理。
- ガーディアン：既存archiveGuardの防御と1回の物理反撃。
- ドローン：水魔法98・沈黙15%／2行動。
- 整備機：通常物理に毒20%・麻痺15%／各2行動。
- 幻影：闇魔法100・睡眠15%／2行動。
- 星図喰らい：光魔法94、3行動周期の2回目に予兆、次に単体「星図崩し」116。

編成は鉄道（スカウト／ガーディアン／ドローン）1620EXP、中央区（ドローン／ガーディアン／喰らい）1630、工房（整備機／幻影／喰らい）1640、観測塔（スカウト／ドローン／ガーディアン）1620、中ボス1800、最終2450。合計 **10760EXP／人**、任意依頼750は別。第12章10140から緩やかに増加。レベル上限50を維持し、保守的なLv47・強制習得ノードなしのブラウザfixtureでも通し検証する。

### ボスの行動

- **アストロセンチネル**：高防御。通常光魔法「天球光弾」94→防御と予兆→光の全体「星軌放射」108。旧ガード／障壁／かばうを対象ごとに処理する。反撃は通常敵ガーディアンの役割。戦闘後に星図記録を入手して守護の手順を書き足す。
- **セレスティアルゼロ**：HP65%超／30%超65%以下／30%以下の3段階。第1段階は物理主体、第2段階以降は偶数行動の光魔法「星図干渉」102（第3段階122）と暗闇・沈黙各20%／2行動。周期2回目に防御と全体予兆、次の実行可能行動で「虚天の収束」140、第3段階で新しく予約する攻撃は「虚天展開」170。第3段階の物理補正は既存1.15倍。
- 予兆は行動不能で消えず、段階移行でも予約140を170へ上書きしない。全体攻撃は挑発で1人に集めず、実被弾先ごとのかばう・防御・障壁を処理。旧AIとダメージ式を変更せず、追加プロフィールで実現する。
- 星力吸収は第12章の敵だけのまま。第13章の敵へ流用しない。防御・回復・状態異常・必殺技による既存の対処を維持する。

## 武器・依頼

|武器ID・名前|系統・所有者|能力補正|特性・入手|
|---|---|---|---|
|starengine-duals 星機の双剣|dualBlades / astel|attack+17 / speed+4|{"normalHits": 2} / c13-duals|
|celestial-shield-rapier 天球守の盾突剣|shieldRapier / rina|attack+12 / defense+19 / speed+2 / maxHp+25|{"coverReduction": 0.02} / c13-gate-tune|
|starchart-mace 星図のメイス|mace / mei|attack+15 / maxHp+45 / maxMp+10|{"healingRate": 1.15} / c13-zero|

双剣は通常0.5倍×2ヒット、途中撃破で残り中止、星力は行動1回分。連牙斬をさらに二重化しない。系統補正を二重加算せず、装備比較・解除・所持数量・キャラクター制限を既存APIで処理する。

|依頼ID・名前|目的ID・場所|報告先|報酬|
|---|---|---|---|
|sq-stopped-clock SQ-31 止まった時計塔|clock-gear（c13-city） → clock-hand（c13-market）|c13-clock|{"item": "potion", "count": 3}|
|sq-lost-chart SQ-32 失われた星図|chart-edge（c13-lower） → chart-copy（c13-charts）|c13-lower|{"experience": 750}|
|sq-noel-log SQ-33 ノエルの整備日誌|log-page（c13-market） → return-route（c13-observatory）|c13-refuge|{"item": "ether", "count": 3}|

時計修理・星図復元・帰還時刻調整回路の発見を既存依頼の確定状態として管理。日誌と回路図には実際の調査文を表示する。新たな未解放駅の解放や戦闘能力は与えない。初回報酬は一度だけで、上限99で全報酬が入らない時は未受領。章途中／クリア後とも受注・進行・受領できる。

## 天球儀の4状態

|状態|確定条件|経路・表示|
|---|---|---|
|停止 stopped|aux-power前|市場の脇道20〜26列・16〜21行を閉鎖。大通りは維持。人工天空の帯と静止歯車|
|部分起動 partial|c13-aux-power|市場脇道を開放。工房行きはrefuge-restも必要。歯車が回転|
|星図同期 synchronized|c13-chart-sync|観測塔23〜26列・18〜21行を開放。中枢行きはpromiseも必要。星軌を表示|
|完全起動 complete|c13-clear|開いた経路を維持。光が安定し、星々の観測記録を投影|

座標は0始まり。全状態は完了イベントから導出。描画・衝突・A*・保存位置検証に同じactiveMapを使用。閉鎖セルの不正位置は安全な入口へ戻す。時刻・乱数・未知フィールドを根拠にしない。潮位・共鳴・星光導路とは独立。低モーションでは歯車を静止し、画面外を描かず10Hzで更新する。

## 星脈鉄道

- `c13-rail-start` で復旧。駅は既存map IDだけを列挙し、名前・地点・入口・解放条件は既存データから取得。
- 指定駅はgear-rail／station／city／workshop／observatory／coreの6枚。駅マップの探索メニューに鉄道を表示。現在駅と解放済み行き先だけを表示し、現在駅は無効化。旧章・未実装地域・駅以外のマップへは移動しない。
- 予約は純粋な検証。移動中は出発位置と既存進行を保持し、650msの短い演出後またはスキップで完了。低モーションでは即時。中断・キャンセル・ページ再読込では出発前の保存へ戻る。
- 出発元のMapViewを破棄してautosaveを完了させてから、既存enterMapで到着を確定し、安全な入口を設定する。古いビューのflushが到着位置を上書きしない。
- 連打はbusyと一度だけの完了処理で抑止。予約の出発元と現在地を再検証し、古い予約・未解放駅・進行中の戦闘を拒否。
- 鉄道自体は報酬・経験値・戦績・イベント完了を与えない。到着後も既存の接触猶予を維持。
- 駅と現在目的が一致する有効な行き先なら、共通の目的案内へ駅経由の案内を加える。未解放駅は案内しない。
- 新しい保存フィールドや独立ゲームモードを作らず、schema 2と既存地点移動を拡張する。

## 50マップの接続

既存42枚の定義は維持。第7章5＋第8章5＋第9〜13章各8＝50枚。地点IDの出口は従来UIを経由する。以下の条件と各マップの実効地形の両方を満たす場合だけ移動する。

|マップ|出口と必要イベント|
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

## ミニマップ・共通探索・保存

全50枚で既存ミニマップを共用。発見済み地形・実歩行色・現在地・既知の有効な出口・現在の既知目的を表示。開閉と探索色はProgressをキーとするWeakMapでページ内セッションだけ保持し、ホーム／戦闘／マップ／鉄道との往復でも維持する。別セーブ・Labには混入しない。再読み込みでリセットし、新たな保存領域は増やさない。

地形版の移行規約が既存保存にないため、探索色の永続化を導入しない。未発見地形は視線で隠し、折りたたみ可能。SVGはタップを遮らず、開いている場合だけ最大10Hzで更新し、毎フレームDOMを再構築しない。既存A*・方向案内・自動接近・壁越し調査防止・明示的な再タップ・巡回／追跡／待機・接触ロック・入場猶予・安全復帰を維持。

保存キー `astra-chronica:v1`、schema **2**。旧12章のレベル・経験値・90ノード・武器数量・依頼・会話・手帳・道標・時間状態を保持。未知ID・破損フラグ・不正位置を既存正規化で修復。未確定戦闘は報酬なしで取り消し、同じ結果を二重適用しない。正式画像・音声・外部画像URL・新依存は追加しない。

## 検証結果

- 変更前：**1,065 / 1,065件成功**。
- 最終 `npm test`：**1,206 / 1,206件、28ファイル成功**（追加141件）。既存ケースを削除・skip化せず、章数・未実装境界・歴史的マップ集合を実装範囲に合わせた。ミニマップは新しい開閉保持仕様を明示的に検証する。
- Chromium：**既存46＋新規6＝52ファイルすべて成功**。新規の本編2経路は各6戦、計12回の実勝利。依頼を章クリア前／後に受領、撤退・再戦、会話選択、パズルの誤答／中断／再開、鉄道、報酬重複、旧12章・保存なしLab分離を検証。
- 全50マップ×320／390／430／768px＝**200ケース成功**。カメラ、キャンバス縦横比、タップ、44pxメニュー、停止／再開、横スクロールを確認。旧潮位・共鳴・星光導路と天球儀4状態の再読込、鉄道／ミニマップ／会話／装備／ボス／クリアの4幅も確認。
- 標準WebGL：巡回敵との実接触、左味方／右敵のサイドビュー、実測ダメージ表示、撤退・安全復帰、実行時エラーなしを確認。網羅的な長時間の操作テストには同じPhaserのCanvas描画も利用した。
- 最終 `npm run build`：**成功、118モジュール**。最後に鉄道・従来地点見出し・NPC会話と標準WebGLを再確認した候補ビルドと最終ビルドの4出力をSHA-256で照合し、完全一致。GitHub Pages設定は変更していない。
- 旧セーブ：キー・schema 2を維持。全90ノード・第12章武器・依頼受領・旧12章完了・会話・道標・時間状態を持つ保存を往復し、不明ID・破損位置・未確定戦闘も確認した。
- テスト条件：本編通しブラウザは第12章クリア相当Lv47、装備／画面幅用はLv50の配置用fixture。単体では既存報酬だけで12章を進めた状態から、20乱数種×依頼有無の40章クリアを確認。90ノードの全取得を攻略条件にしていない。

実行単位・成功判定・候補と最終ビルドのハッシュは [検証記録JSON](test-results/v21.json) に保存した。再実行は `npm test`、`npm run build`、`BASE_URL=http://localhost:4173 npm run test:browser-v21`。全ブラウザは `npm run test:browser-all`。旧UI fixture用には別途5173番で `npm run dev` を起動する。

## 開発中に修正した点

- 鉄道到着後に出発元ビューのflushが古い位置を書き戻さないよう、出発ビュー破棄→既存enterMap→安全な入口→保存の順序に統一。到着時にも現在章・現在駅・未確定戦闘・解放条件を再検証する。
- 鉄道ダイアログ中の画面復帰イベントで探索が再開する不具合をChromiumで再現。ダイアログが開いている間は一時停止を維持し、キャンセル時だけ正常に再開する追加回帰を確認した。
- 既存ミニマップは再マウントで閉じていたため、ProgressをキーとするWeakMapで同一ページ内の開閉を保持。旧テストは「開いたこと」を確認する方式へ更新し、保持の検証を追加した。
- 従来型の地点一覧の見出しが第10章までの固定配列だったため、第11章以降でundefinedになっていた。既存10ラベルは維持し、以降を章番号で補完。第11〜13章をブラウザで回帰し、NPC会話と選択画面を4幅で再撮影した。16地点の説明も個別に記述した。
- 新しい研究者の名前は第7章の薬草師フィーネと衝突していたため、フィオラに変更。
- 追加E2Eの章クリア後の依頼報告はマップのない待合所で終わるため、最後の鉄道確認前に中枢駅へ明示的に戻すようテスト手順を修正した。

## スクリーンショット

鉄道・ミニマップ・会話・ボス・章クリアは4幅、探索は全50枚×4幅で自動検証した。PNGは以下に保存し、リンクの実在と形式を確認した。

|代表画面|画像|
|---|---|
|古代鉄道駅|[390px](screenshots/exploration-v21-gear-station-390.png)|
|機巧都市|[中央区](screenshots/exploration-v21-gear-city-390.png)|
|天球儀4状態|[停止](screenshots/exploration-v21-celestial-stopped-390.png) / [部分起動](screenshots/exploration-v21-celestial-partial-390.png) / [同期](screenshots/exploration-v21-celestial-synchronized-390.png) / [完全起動](screenshots/exploration-v21-celestial-complete-390.png)|
|星脈鉄道|[320](screenshots/chapter-thirteen-railway-320.png) / [390](screenshots/chapter-thirteen-railway-390.png) / [430](screenshots/chapter-thirteen-railway-430.png) / [768](screenshots/chapter-thirteen-railway-768.png)|
|ミニマップ|[320](screenshots/exploration-v21-minimap-320.png) / [390](screenshots/exploration-v21-minimap-390.png) / [430](screenshots/exploration-v21-minimap-430.png) / [768](screenshots/exploration-v21-minimap-768.png)|
|通常戦闘・中ボス・最終ボス|[通常](screenshots/chapter-thirteen-field-battle-390.png) / [中ボス](screenshots/chapter-thirteen-guardian-battle-390.png) / [最終ボス](screenshots/chapter-thirteen-zero-battle-390.png)|
|新武器比較|[双剣](screenshots/chapter-thirteen-weapon-starengine-duals-390.png) / [盾突剣](screenshots/chapter-thirteen-weapon-celestial-shield-rapier-390.png) / [メイス](screenshots/chapter-thirteen-weapon-starchart-mace-390.png)|
|NPC会話|[320](screenshots/chapter-thirteen-npc-320.png) / [390](screenshots/chapter-thirteen-npc-390.png) / [430](screenshots/chapter-thirteen-npc-430.png) / [768](screenshots/chapter-thirteen-npc-768.png)|
|重要選択と地点見出し|[320](screenshots/chapter-thirteen-choice-320.png) / [390](screenshots/chapter-thirteen-choice-390.png) / [430](screenshots/chapter-thirteen-choice-430.png) / [768](screenshots/chapter-thirteen-choice-768.png)|
|手帳・クリア|[手帳](screenshots/chapter-thirteen-journal-390.png) / [クリア](screenshots/chapter-thirteen-clear-390.png)|

<details><summary>全追加画像一覧（96枚）</summary>

- [chapter-thirteen-archive-390.png](screenshots/chapter-thirteen-archive-390.png)
- [chapter-thirteen-archive-battle-390.png](screenshots/chapter-thirteen-archive-battle-390.png)
- [chapter-thirteen-archive-result-390.png](screenshots/chapter-thirteen-archive-result-390.png)
- [chapter-thirteen-boss-ui-320.png](screenshots/chapter-thirteen-boss-ui-320.png)
- [chapter-thirteen-boss-ui-390.png](screenshots/chapter-thirteen-boss-ui-390.png)
- [chapter-thirteen-boss-ui-430.png](screenshots/chapter-thirteen-boss-ui-430.png)
- [chapter-thirteen-boss-ui-768.png](screenshots/chapter-thirteen-boss-ui-768.png)
- [chapter-thirteen-choice-320.png](screenshots/chapter-thirteen-choice-320.png)
- [chapter-thirteen-choice-390.png](screenshots/chapter-thirteen-choice-390.png)
- [chapter-thirteen-choice-430.png](screenshots/chapter-thirteen-choice-430.png)
- [chapter-thirteen-choice-768.png](screenshots/chapter-thirteen-choice-768.png)
- [chapter-thirteen-clear-320.png](screenshots/chapter-thirteen-clear-320.png)
- [chapter-thirteen-clear-390.png](screenshots/chapter-thirteen-clear-390.png)
- [chapter-thirteen-clear-430.png](screenshots/chapter-thirteen-clear-430.png)
- [chapter-thirteen-clear-768.png](screenshots/chapter-thirteen-clear-768.png)
- [chapter-thirteen-core-390.png](screenshots/chapter-thirteen-core-390.png)
- [chapter-thirteen-dialogue-320.png](screenshots/chapter-thirteen-dialogue-320.png)
- [chapter-thirteen-dialogue-390.png](screenshots/chapter-thirteen-dialogue-390.png)
- [chapter-thirteen-dialogue-430.png](screenshots/chapter-thirteen-dialogue-430.png)
- [chapter-thirteen-dialogue-768.png](screenshots/chapter-thirteen-dialogue-768.png)
- [chapter-thirteen-enemy-symbol-390.png](screenshots/chapter-thirteen-enemy-symbol-390.png)
- [chapter-thirteen-equipment-390.png](screenshots/chapter-thirteen-equipment-390.png)
- [chapter-thirteen-faint-390.png](screenshots/chapter-thirteen-faint-390.png)
- [chapter-thirteen-field-390.png](screenshots/chapter-thirteen-field-390.png)
- [chapter-thirteen-field-battle-390.png](screenshots/chapter-thirteen-field-battle-390.png)
- [chapter-thirteen-field-result-390.png](screenshots/chapter-thirteen-field-result-390.png)
- [chapter-thirteen-guardian-battle-390.png](screenshots/chapter-thirteen-guardian-battle-390.png)
- [chapter-thirteen-guardian-result-390.png](screenshots/chapter-thirteen-guardian-result-390.png)
- [chapter-thirteen-journal-390.png](screenshots/chapter-thirteen-journal-390.png)
- [chapter-thirteen-linked-390.png](screenshots/chapter-thirteen-linked-390.png)
- [chapter-thirteen-new-weapons-action-390.png](screenshots/chapter-thirteen-new-weapons-action-390.png)
- [chapter-thirteen-npc-320.png](screenshots/chapter-thirteen-npc-320.png)
- [chapter-thirteen-npc-390.png](screenshots/chapter-thirteen-npc-390.png)
- [chapter-thirteen-npc-430.png](screenshots/chapter-thirteen-npc-430.png)
- [chapter-thirteen-npc-768.png](screenshots/chapter-thirteen-npc-768.png)
- [chapter-thirteen-railway-320.png](screenshots/chapter-thirteen-railway-320.png)
- [chapter-thirteen-railway-390.png](screenshots/chapter-thirteen-railway-390.png)
- [chapter-thirteen-railway-430.png](screenshots/chapter-thirteen-railway-430.png)
- [chapter-thirteen-railway-768.png](screenshots/chapter-thirteen-railway-768.png)
- [chapter-thirteen-ravine-390.png](screenshots/chapter-thirteen-ravine-390.png)
- [chapter-thirteen-road-390.png](screenshots/chapter-thirteen-road-390.png)
- [chapter-thirteen-road-battle-390.png](screenshots/chapter-thirteen-road-battle-390.png)
- [chapter-thirteen-road-result-390.png](screenshots/chapter-thirteen-road-result-390.png)
- [chapter-thirteen-sanctuary-390.png](screenshots/chapter-thirteen-sanctuary-390.png)
- [chapter-thirteen-sanctuary-battle-390.png](screenshots/chapter-thirteen-sanctuary-battle-390.png)
- [chapter-thirteen-sanctuary-result-390.png](screenshots/chapter-thirteen-sanctuary-result-390.png)
- [chapter-thirteen-silent-390.png](screenshots/chapter-thirteen-silent-390.png)
- [chapter-thirteen-village-390.png](screenshots/chapter-thirteen-village-390.png)
- [chapter-thirteen-weapon-celestial-shield-rapier-390.png](screenshots/chapter-thirteen-weapon-celestial-shield-rapier-390.png)
- [chapter-thirteen-weapon-starchart-mace-390.png](screenshots/chapter-thirteen-weapon-starchart-mace-390.png)
- [chapter-thirteen-weapon-starengine-duals-390.png](screenshots/chapter-thirteen-weapon-starengine-duals-390.png)
- [chapter-thirteen-webgl-action-390.png](screenshots/chapter-thirteen-webgl-action-390.png)
- [chapter-thirteen-zero-battle-390.png](screenshots/chapter-thirteen-zero-battle-390.png)
- [chapter-thirteen-zero-result-390.png](screenshots/chapter-thirteen-zero-result-390.png)
- [exploration-v21-celestial-complete-390.png](screenshots/exploration-v21-celestial-complete-390.png)
- [exploration-v21-celestial-partial-390.png](screenshots/exploration-v21-celestial-partial-390.png)
- [exploration-v21-celestial-stopped-390.png](screenshots/exploration-v21-celestial-stopped-390.png)
- [exploration-v21-celestial-synchronized-390.png](screenshots/exploration-v21-celestial-synchronized-390.png)
- [exploration-v21-gear-city-390.png](screenshots/exploration-v21-gear-city-390.png)
- [exploration-v21-gear-city-detail-390.png](screenshots/exploration-v21-gear-city-detail-390.png)
- [exploration-v21-gear-core-390.png](screenshots/exploration-v21-gear-core-390.png)
- [exploration-v21-gear-core-detail-390.png](screenshots/exploration-v21-gear-core-detail-390.png)
- [exploration-v21-gear-lower-390.png](screenshots/exploration-v21-gear-lower-390.png)
- [exploration-v21-gear-lower-detail-390.png](screenshots/exploration-v21-gear-lower-detail-390.png)
- [exploration-v21-gear-market-390.png](screenshots/exploration-v21-gear-market-390.png)
- [exploration-v21-gear-market-detail-390.png](screenshots/exploration-v21-gear-market-detail-390.png)
- [exploration-v21-gear-observatory-390.png](screenshots/exploration-v21-gear-observatory-390.png)
- [exploration-v21-gear-observatory-detail-390.png](screenshots/exploration-v21-gear-observatory-detail-390.png)
- [exploration-v21-gear-rail-390.png](screenshots/exploration-v21-gear-rail-390.png)
- [exploration-v21-gear-station-320.png](screenshots/exploration-v21-gear-station-320.png)
- [exploration-v21-gear-station-390.png](screenshots/exploration-v21-gear-station-390.png)
- [exploration-v21-gear-station-430.png](screenshots/exploration-v21-gear-station-430.png)
- [exploration-v21-gear-station-768.png](screenshots/exploration-v21-gear-station-768.png)
- [exploration-v21-gear-station-detail-390.png](screenshots/exploration-v21-gear-station-detail-390.png)
- [exploration-v21-gear-workshop-390.png](screenshots/exploration-v21-gear-workshop-390.png)
- [exploration-v21-gear-workshop-detail-390.png](screenshots/exploration-v21-gear-workshop-detail-390.png)
- [exploration-v21-grove-garden-390.png](screenshots/exploration-v21-grove-garden-390.png)
- [exploration-v21-grove-village-390.png](screenshots/exploration-v21-grove-village-390.png)
- [exploration-v21-high-reload-390.png](screenshots/exploration-v21-high-reload-390.png)
- [exploration-v21-light-dark-390.png](screenshots/exploration-v21-light-dark-390.png)
- [exploration-v21-light-glimmer-390.png](screenshots/exploration-v21-light-glimmer-390.png)
- [exploration-v21-light-linked-390.png](screenshots/exploration-v21-light-linked-390.png)
- [exploration-v21-light-renewed-390.png](screenshots/exploration-v21-light-renewed-390.png)
- [exploration-v21-low-reload-390.png](screenshots/exploration-v21-low-reload-390.png)
- [exploration-v21-minimap-320.png](screenshots/exploration-v21-minimap-320.png)
- [exploration-v21-minimap-390.png](screenshots/exploration-v21-minimap-390.png)
- [exploration-v21-minimap-430.png](screenshots/exploration-v21-minimap-430.png)
- [exploration-v21-minimap-768.png](screenshots/exploration-v21-minimap-768.png)
- [exploration-v21-old-twelve-npc-390.png](screenshots/exploration-v21-old-twelve-npc-390.png)
- [exploration-v21-old-twelve-road-390.png](screenshots/exploration-v21-old-twelve-road-390.png)
- [exploration-v21-resonance-calm-390.png](screenshots/exploration-v21-resonance-calm-390.png)
- [exploration-v21-resonance-faint-390.png](screenshots/exploration-v21-resonance-faint-390.png)
- [exploration-v21-resonance-linked-390.png](screenshots/exploration-v21-resonance-linked-390.png)
- [exploration-v21-resonance-silent-390.png](screenshots/exploration-v21-resonance-silent-390.png)
- [exploration-v21-sky-tower-390.png](screenshots/exploration-v21-sky-tower-390.png)
- [exploration-v21-sky-town-390.png](screenshots/exploration-v21-sky-town-390.png)

</details>

## 変更ファイル一覧

画像は上記一覧。その他の変更ファイルは以下のとおり。

- [README.md](../README.md)
- [docs/CHAPTER_THIRTEEN_V21.md](../docs/CHAPTER_THIRTEEN_V21.md)
- [docs/test-results/v21.json](../docs/test-results/v21.json)
- [package.json](../package.json)
- [src/adventure-view.ts](../src/adventure-view.ts)
- [src/data/chapter-one.ts](../src/data/chapter-one.ts)
- [src/data/chapter-thirteen-enemies.ts](../src/data/chapter-thirteen-enemies.ts)
- [src/data/chapter-thirteen.ts](../src/data/chapter-thirteen.ts)
- [src/data/dialogue-choices.ts](../src/data/dialogue-choices.ts)
- [src/data/encounters.ts](../src/data/encounters.ts)
- [src/data/enemy-scripts.ts](../src/data/enemy-scripts.ts)
- [src/data/journal.ts](../src/data/journal.ts)
- [src/data/side-quests.ts](../src/data/side-quests.ts)
- [src/data/weapons.ts](../src/data/weapons.ts)
- [src/exploration/celestial.ts](../src/exploration/celestial.ts)
- [src/exploration/chapter-thirteen-maps.ts](../src/exploration/chapter-thirteen-maps.ts)
- [src/exploration/exploration.css](../src/exploration/exploration.css)
- [src/exploration/gear-effects.ts](../src/exploration/gear-effects.ts)
- [src/exploration/map-art.ts](../src/exploration/map-art.ts)
- [src/exploration/map-data.ts](../src/exploration/map-data.ts)
- [src/exploration/map-view.ts](../src/exploration/map-view.ts)
- [src/exploration/minimap-view.ts](../src/exploration/minimap-view.ts)
- [src/exploration/railway-view.ts](../src/exploration/railway-view.ts)
- [src/exploration/railway.ts](../src/exploration/railway.ts)
- [src/exploration/types.ts](../src/exploration/types.ts)
- [src/main.ts](../src/main.ts)
- [src/types.ts](../src/types.ts)
- [tests/browser-suite.mjs](../tests/browser-suite.mjs)
- [tests/chapter-eight-v16.e2e.mjs](../tests/chapter-eight-v16.e2e.mjs)
- [tests/chapter-eight-v16.test.ts](../tests/chapter-eight-v16.test.ts)
- [tests/chapter-eleven-v19.e2e.mjs](../tests/chapter-eleven-v19.e2e.mjs)
- [tests/chapter-eleven-v19.test.ts](../tests/chapter-eleven-v19.test.ts)
- [tests/chapter-five-v13.e2e.mjs](../tests/chapter-five-v13.e2e.mjs)
- [tests/chapter-five-v13.test.ts](../tests/chapter-five-v13.test.ts)
- [tests/chapter-four-v12.e2e.mjs](../tests/chapter-four-v12.e2e.mjs)
- [tests/chapter-four-v12.test.ts](../tests/chapter-four-v12.test.ts)
- [tests/chapter-nine-v17.e2e.mjs](../tests/chapter-nine-v17.e2e.mjs)
- [tests/chapter-nine-v17.test.ts](../tests/chapter-nine-v17.test.ts)
- [tests/chapter-seven-v15.e2e.mjs](../tests/chapter-seven-v15.e2e.mjs)
- [tests/chapter-seven-v15.test.ts](../tests/chapter-seven-v15.test.ts)
- [tests/chapter-six-v14.e2e.mjs](../tests/chapter-six-v14.e2e.mjs)
- [tests/chapter-six-v14.test.ts](../tests/chapter-six-v14.test.ts)
- [tests/chapter-ten-v18.e2e.mjs](../tests/chapter-ten-v18.e2e.mjs)
- [tests/chapter-ten-v18.test.ts](../tests/chapter-ten-v18.test.ts)
- [tests/chapter-thirteen-equipment.e2e.mjs](../tests/chapter-thirteen-equipment.e2e.mjs)
- [tests/chapter-thirteen-fixture.mjs](../tests/chapter-thirteen-fixture.mjs)
- [tests/chapter-thirteen-ui.e2e.mjs](../tests/chapter-thirteen-ui.e2e.mjs)
- [tests/chapter-thirteen-v21.e2e.mjs](../tests/chapter-thirteen-v21.e2e.mjs)
- [tests/chapter-thirteen-v21.test.ts](../tests/chapter-thirteen-v21.test.ts)
- [tests/chapter-twelve-v20.e2e.mjs](../tests/chapter-twelve-v20.e2e.mjs)
- [tests/chapter-twelve-v20.test.ts](../tests/chapter-twelve-v20.test.ts)
- [tests/chapter-two-v10.test.ts](../tests/chapter-two-v10.test.ts)
- [tests/exploration-v19.smoke.mjs](../tests/exploration-v19.smoke.mjs)
- [tests/exploration-v20.smoke.mjs](../tests/exploration-v20.smoke.mjs)
- [tests/exploration-v20.test.ts](../tests/exploration-v20.test.ts)
- [tests/exploration-v21.e2e.mjs](../tests/exploration-v21.e2e.mjs)
- [tests/exploration-v21.smoke.mjs](../tests/exploration-v21.smoke.mjs)
- [tests/exploration-v21.test.ts](../tests/exploration-v21.test.ts)
- [tests/minimap-v20.e2e.mjs](../tests/minimap-v20.e2e.mjs)
- [tests/railway-v21.e2e.mjs](../tests/railway-v21.e2e.mjs)
- [tests/railway-v21.test.ts](../tests/railway-v21.test.ts)

## 既知の制約

- 開閉状態と探索色はページ内セッション限定。位置・進行・報酬は従来どおり保存。
- 第14〜18章・正式画像・ジョブ変更は追加しない。
- Chromiumタッチと標準WebGLで検証し、iPhone Safari実機は未確認。手動確認をユーザーへ依頼しない。
- 既存Phaserチャンクの500kB超警告は維持。
