# v2.3 第15章「虚空の聖域と砕けた星の王冠」

## 基準と維持範囲

基準main：`48b83fabf4360b3ae2b3009359f1be9a0519c389`。新規ブランチ：`feature/v2.3-chapter-fifteen-exploration`。第14章クリア後に解放する。第16〜18章は予告のみで未実装・未解放。3人固定、9武器系統、7属性、7状態異常、星力・必殺技、90ノード、旧章・58マップ、鉄道6駅・方舟8区画、Pages設定を維持する。mainマージ・公開・PLiCy投稿は行わない。

**最大レベルは50のまま。** `src/progression.ts` の上限・必要経験値・成長係数は基準mainから変更しない。Lv50の戦術・装備・回復で攻略する。SPはレベルから導出しLv50は98SP、全30ノード取得後は68SP。旧上限で破棄された経験値を作り直さず、報酬時の既存の上限処理を維持する。

## 物語・NPC

方舟ノアティスが星図にない座標を示す。第14章の北の氷環の予告を取り消さず、氷環を表の目印、その先を聖域へつながる観測路とする。砕けた「星冠」は複数の世界の星脈を接続していたため、同じ回廊が別の場所へつながり、未来の記録が過去の棚へ現れる。

主題は「定められた未来と、自分で選び取る未来」。アステルは予測と違う道を選び、リナは立ち止まる人と帰還路を守り、メイは観測条件と異世界の接続を分ける。第9章の記憶、第10章の観測、第11章の声、第12章の生命循環、第13章の天球儀、第14章の方舟が「返事を運ぶ仕組み」として接続する。ただし署名、未接続環の相手、第18章の結末は確定しない。

- **アリア**：聖域の案内人。予見は一つの観測条件だったと認め、自分も今の考えを話すようになる。
- **レオン**：星冠の守護騎士。台帳から消えた仲間を覚えている。秩序を固定することから、選び直して戻る人を迎える守護へ進む。
- **ティセ**：予測と現実の不一致を調べる研究者。候補名「ノエル」は第13章の整備士と衝突するため変更した。既存ノエルの設定は変更しない。

最終ボス撃破後、星冠を部分修復して位相を安定させる。未接続の環が遠い星脈の合流点を示す第16章予告のみを残す。

## 全16地点・30イベント

地点は順次解放。庭の3端末のみ同じ前提から並列に解放し、3端末を確定して次へ進む。依頼や選択肢の内容で本編を詰ませない。8地点は自由歩行、残る8地点は既存地点UIを共用する。

|地点ID・名称|イベントID・名称|歩行マップ|
|---|---|---|
|c15-gateway 虚空の門|c15-arrival 方舟にない座標 / c15-gateway-fight 門を巡る衛兵 / c15-gateway-cache 帰還隊の備え箱|void-gate|
|c15-field 星冠の前庭|c15-aria 未来を知る案内人 / c15-field-record 欠けた星冠の第一片|void-court|
|c15-monuments 位相の回廊|c15-awakening 最初の位相同期 / c15-leon 星冠を守る騎士 / c15-monument-record 消えるはずのない名前|void-corridor|
|c15-camp 位相避難所|c15-camp-rest 予見から離れて休む|従来地点UI|
|c15-sanctum 未来映しの鏡殿|c15-tise 記録を比べる研究者 / c15-sanctum-fight 鏡殿の異常信号|void-mirror|
|c15-seal 星環観測台|c15-seal-record 観測口を二つ残す|従来地点UI|
|c15-archive 聖域記録庫|c15-archive-fight 記録庫の星界警報 / c15-archive-record 未来が過去になる頁|void-archive|
|c15-garden 静穏の回廊|c15-garden-rest 変わる光の下で|従来地点UI|
|c15-gate 守護騎の門|c15-guardian 星冠守護騎・レガリアガード / c15-key 反転環の破片|従来地点UI|
|c15-bridge 虚空連絡橋|c15-bridge-record 三つの接続を選ぶ橋|従来地点UI|
|c15-corridor 忘却の庭|c15-link-anchor 座標端末をつなぐ / c15-link-observe 観測端末をつなぐ / c15-link-choice 選択端末をつなぐ|void-garden|
|c15-refuge 星冠修復室|c15-refuge-rest 部分修復の作業台|従来地点UI|
|c15-fracture 星冠の祭壇|c15-fracture-fight 祭壇へ漏れる位相 / c15-fracture-reading 記録にない選択|void-sanctum|
|c15-observatory 観測の尖塔|c15-boundary-tune 星冠の三環調律 / c15-seer-record 星冠が結ぶもの|従来地点UI|
|c15-altar 最終調律座|c15-promise まだ書かれない明日へ / c15-inherit 中枢へ残す退路|従来地点UI|
|c15-core 砕けた星冠の中枢|c15-crown-breaker 砕冠の執行者・クラウンブレイカー / c15-clear 砕けた王冠に残る余白|void-core|

通常戦闘4回、中ボス1回、最終ボス1回の計6勝。休息は毎戦HP・MP全快の既存仕様を尊重し、永続HP管理を追加しない。調律パズルは「座標を固定→観測を照合→選択を残す」。誤答、3段階ヒント、リセット、中断、再挑戦に対応。並べかけは再読込で安全にリセットし、確定した進行だけを保存する。

## 星界位相切替

|状態|導出する確定イベント|実効地形|
|---|---|---|
|chaotic 位相混乱|`c15-awakening`前|位相回廊の23〜26列・17〜19行を閉鎖|
|synced 位相同期|`c15-awakening`|上記区画を開き、11〜14列・11行を閉鎖。大きい迂回路を維持|
|inverted 位相反転|`c15-key`|11行を復旧し、別の15〜17列・14行を閉鎖。庭の接続端末を利用可能|
|stable 位相安定|`c15-clear`|両細道と必須通路を復旧し、再訪・依頼を継続可能|

座標は0始まり。`stellarPhase` は時刻・乱数・未知の保存フラグを使用しない。既存の`activeMap`が描画・A*・衝突・ミニマップ・位置修復の唯一の地形を返す。位相変化時は古い移動予約と画面を破棄し、安全な位置で再生成。壁内の保存座標は入口へ修復する。

庭の座標・観測・選択端末は任意順。各確定で20〜21列16〜17行／23〜24列18〜19行／25〜26列20〜21行を開く。端末は閉鎖区画の外に置き、未操作の端末へ常に接近できる。接続順は既存の完了イベント配列へ保存。明示的な`orderGroup`だけ相対順を保ち、旧章は従来どおり正規順へ戻す。`phaseKey`には端末順も含め、同じ位相の地形変更も描画へ反映する。

Phaser図形の輪と光は最大10Hzで更新。低モーションでは静止し、カメラ／入力／物理を反転しない。音声なしで、位相名・接続順・目的を文字でも表示する。

## 共通探索の改善

- 案内文とミニマップは`navigationTarget`を共用する。既知・解放済み・実際に到達可能な対象／出口だけを案内し、閉鎖時は利用可能な装置か前提イベントを案内する。
- ミニマップは発見済みの地形・目的だけを表示。経路キャッシュは現在セル・確定イベント・実効地形・敵位置セルで更新し、位相変更後に再計算する。
- 地形セル配列は探索範囲または実効地形が変わる時だけ再生成。表示DOMは既存の10Hz同期を維持し、毎フレーム更新しない。
- 未解放NPC・装置や未受注の依頼対象は表示・操作対象から除外。人／箱／装と確認済み✓の文字を併用し、色だけに依存しない。
- 会話・戦闘・区画移動で既存pause/lock/stopを使用し、古い予約を再開しない。戻る、撤退、再読込で安全な入口・直前の確定進行へ戻る。
- 鉄道・方舟区画制御の移動APIは共用し、未解放区画への経路を作らない。探索色とミニマップ開閉はページ内セッション限定で、進行・座標は保存する。

## 敵の全数値と行動

|内部キー／敵ID・名称|HP|攻撃|防御|速度|経験値|行動・相性|
|---|---:|---:|---:|---:|---:|---|
|guardian / crown-sentinel 星冠の衛兵|980|70|49|43|620|archiveGuard / {"water": 1.25, "earth": 0.75}|
|phantom / forgetting-shadow 忘却の影|920|68|39|54|600|[{"id": "poison", "chance": 0.2, "turns": 2}, {"id": "paralysis", "chance": 0.15, "turns": 2}] / {}|
|echo / void-echo 虚空の残響|900|66|39|52|610|{"name": "虚空の潮", "power": 102, "element": "water", "statuses": [{"id": "burn", "chance": 0.2, "turns": 2}]} / {}|
|beast / time-wisp 時紡ぎウィスプ|880|68|38|82|620|{"name": "時紡ぎの風", "power": 98, "element": "wind"} / {}|
|pilgrim / phase-slime 位相スライム|950|69|46|55|630|canalKeeper / {"dark": 1.25, "light": 0.75}|
|watcher / astral-watcher 星界の監視者|940|68|41|54|640|astralWatcher / {}|
|guard / regalia-guard 星冠守護騎・レガリアガード|4600|71|50|46|2100|regaliaGuard / {"water": 1.25, "light": 0.75}|
|oblivion / crown-breaker 砕冠の執行者・クラウンブレイカー|6200|70|43|50|2800|crownBreaker / {"water": 1.25, "dark": 0.5}|

全種は基底Lv1、MP／最大MP0、通常攻撃は無属性。睡眠・凍結耐性20%、他0%。未記載属性倍率は1.0。敵の固定威力魔法はMP非消費という既存仕様。虚空の残響の水魔法102は20%・2行動の火傷で物理攻撃を弱める。忘却の影は毒20%／麻痺15%・2行動。ウィスプは風魔法98。位相スライムは3行動周期の2行動目に防御し、次の本人の機会まで半減。衛兵は防御と1回反撃を使う。

### ボス・監視者のデータ定義

- `regaliaGuard`：`{"counterOnCharge": true, "observer": false, "alwaysMagic": true, "guardOnCharge": true, "chargeAll": true, "element": "earth", "normalPower": 102, "finalNormalPower": 102, "chargePower": 118, "finalChargePower": 118, "spell": "星冠の刻印", "charge": "星冠の防衛波", "finalCharge": "星冠の防衛波", "statuses": [{"id": "silence", "chance": 0.15, "turns": 2}]}`
- `crownBreaker`：`{"guardFirst": true, "guardLabel": "秩序の防壁", "observer": true, "physicalFirst": true, "guardOnCharge": true, "chargeAll": true, "element": "dark", "normalPower": 110, "finalNormalPower": 130, "chargePower": 148, "finalChargePower": 178, "spell": "位相の裂光", "charge": "崩冠の収束", "finalCharge": "未来の断絶", "statuses": [{"id": "blind", "chance": 0.2, "turns": 2}, {"id": "silence", "chance": 0.2, "turns": 2}]}`
- `astralWatcher`：`{"observer": false, "alwaysMagic": true, "chargeAll": true, "guardOnCharge": false, "element": "dark", "normalPower": 102, "finalNormalPower": 102, "chargePower": 124, "finalChargePower": 124, "spell": "境界の視線", "charge": "星界放射", "finalCharge": "星界放射", "statuses": []}`

中ボスは単体の土術→防御・物理反撃1回＋全体攻撃予約→土属性の全体放射。強い単体術には挑発・かばうを適用し、反撃は二次反撃を発生させない。沈黙15%・2行動は実際の敵魔法メタデータへ接続する。

最終ボスはHP65%／30%で3段階。秩序では防壁と物理攻撃、位相崩壊では魔法・暗闇／沈黙と予兆、未来の断絶では強い全体放射。HP閾値・物理倍率・予約保持・状態異常・防御・実被弾者への星力は既存戦闘エンジンで処理する。予約済み148は睡眠と第3段階への移行でも保持し、その後の新しい最終予約は178。全体攻撃を挑発で単体化せず、各対象のかばう・ガード・障壁を個別計算する。新たな星力吸収は追加しない。

### 出現編成

- `void-gate` 虚空の門：星冠の衛兵／時紡ぎウィスプ／虚空の残響。経験値合計1850。
- `void-mirror` 未来映しの鏡殿：忘却の影／虚空の残響／位相スライム。経験値合計1840。
- `void-archive` 聖域記録庫：星冠の衛兵／星界の監視者／位相スライム。経験値合計1890。
- `void-sanctum` 星冠の祭壇：時紡ぎウィスプ／忘却の影／星界の監視者。経験値合計1860。
- `void-regalia` 守護騎の門：星冠守護騎・レガリアガード。経験値合計2100。
- `void-crown-breaker` 砕けた星冠の中枢：砕冠の執行者・クラウンブレイカー。経験値合計2800。

## 新武器

個別能力値が全補正。系統名で二重加算しない。武器比較・装備制限・数量・保存・戦闘特性は既存APIを使用。

|ID・名称|所有者／系統|能力補正|特殊効果|初回報酬|
|---|---|---|---|---|
|starcrown-duals 星冠の双剣|astel / dualBlades|{"attack": 20, "speed": 4}|{"normalHits": 2}|c15-fracture-reading|
|voidward-shield-rapier 虚空守の盾突剣|rina / shieldRapier|{"attack": 17, "defense": 21, "speed": 2, "maxHp": 24}|{"guardReduction": 0.06, "coverReduction": 0.04}|c15-key|
|astral-wand 星界のワンド|mei / wand|{"attack": 18, "maxMp": 20}|{"healingRate": 1.2, "magicRate": 1.1}|c15-crown-breaker|

双剣の2ヒットは通常攻撃だけ。スキルの連撃へ重ねず、各ヒットの実測値を表示する。星力の通常攻撃成功分は2倍にしない。

## 依頼3件

- `sq-vanished-records` **SQ-37 消えた記録の行方**（ティセ）：回廊の台帳片と記録庫の余白を照合し、消えた人物を別の観測口から探す。 対象 `[{"id": "record-page", "name": "回廊の台帳片", "locationId": "c15-monuments", "requires": []}, {"id": "record-margin", "name": "記録庫の別冊", "locationId": "c15-archive", "requires": ["record-page"]}]`。帰還地点 `c15-camp`、報酬 `{"item": "potion", "count": 3}`。
- `sq-knight-oath` **SQ-38 騎士の誓い**（レオン）：守護騎士の誓約具と観測台の銘文を集め、帰還する者を迎える役割を確かめる。 対象 `[{"id": "oath-pin", "name": "鏡殿の誓約具", "locationId": "c15-sanctum", "requires": []}, {"id": "oath-frame", "name": "観測台の銘文", "locationId": "c15-seal", "requires": ["oath-pin"]}]`。帰還地点 `c15-seal`、報酬 `{"experience": 900}`。
- `sq-future-words` **SQ-39 未来に残す言葉**（アリア）：庭の白紙と祭壇の観測印を照合し、予言ではなく未来への返事を書く。 対象 `[{"id": "future-page", "name": "庭の白紙", "locationId": "c15-corridor", "requires": []}, {"id": "future-mark", "name": "祭壇の観測印", "locationId": "c15-fracture", "requires": ["future-page"]}]`。帰還地点 `c15-refuge`、報酬 `{"item": "ether", "count": 3}`。

受注・目的達成・帰還・受領は別状態。章クリア前／後の両方で達成可能。所持上限では受領済みにせず、空きを作って再試行できる。XP報酬もLv50の既存上限処理を尊重する。

## 重要会話選択5件

### c15-aria 予見した未来への質問

- `ask-scope` 見えた条件を確かめる → アリア「見えた場所と時刻を記録します。私の知らない条件まで、未来の答えにしてはいけませんね。」
- `hear-wishes` あなたが選びたい道を聞く → アリア「私は案内の終わりを待つだけでなく、ここから進む人の言葉も聞いてみたいのです。」

### c15-leon 守護騎士への返事

- `name-risk` 今ここにいる人の危険を伝える → リナ「守る未来だけでなく、今の体と帰還路の危険も同じ台帳に残しましょう。」
- `ask-duty` 騎士の誓いを聞く → レオン「世界を守ると誓った。だが、選ぶ者の声を閉ざすことまで誓った覚えはない。」

### c15-tise 研究記録の扱い

- `listen-page` 予測と結果を並べて残す → ティセ「違ったことを失敗として捨てず、選択した条件も並べて書きます。」
- `keep-unknown` 分からない条件は空欄にする → メイ「空欄に理由を書こう。推測で埋めなければ、後から別の人が確かめ直せる。」

### c15-fracture-reading 記録にない勝利

- `carry-record` 何を選んで違ったかを書く → アステル「勝った結末だけでなく、途中で変えた考えも残すよ。同じ道を強いるためではなく。」
- `guard-now` 失敗した未来も捨てずに残す → リナ「避けられた危険があったことも伝えましょう。未来の警告を、罰に変えないために。」

### c15-promise 星冠へ渡す約束

- `share-key` 選び直せる接続を残す → アリア「まだ見えない未来を、皆で問い直せるようにします。私も今の言葉を返します。」
- `keep-question` 違う未来の声を聞き続ける → アステル「僕たちの答えが変わる時もある。その時に違う声を聞ける道を残していこう。」

選択確定時に保存し、再訪で上書きしない。全32組合せで本編を進行可能。未確定の旧セーブの選択は推測補完しない。

## 冒険手帳8記事

|記事ID|解放イベント|種別・題名|内容|
|---|---|---|---|
|j15-1|c15-arrival|summary 方舟が示した虚空|ノアティスの未登録座標から虚空の聖域へ。砕けた星冠が世界の接続を乱していた。|
|j15-2|c15-aria|npc 案内人アリア|未来の場面を知る案内人。その観測条件は完全ではなく、彼女自身にも選びたい道がある。|
|j15-3|c15-leon|npc 星冠騎士レオン|秩序を守る騎士。台帳から消えた仲間を覚えており、記録と現在の違いを警戒する。|
|j15-4|c15-tise|npc 研究者ティセ|予測と結果の不一致を調べる研究者。機巧都市の整備士ノエルとは別人物。|
|j15-5|c15-awakening|record 星界位相の同期|破片と装置の同期で接続が変わる。細道は開閉するが、安全な迂回路と帰還路を残す。|
|j15-6|c15-refuge-rest|record 三つの接続環|座標・観測・選択を別々に確かめた。確認順は残るが、どの順でも部分修復へ進める。|
|j15-7|c15-seer-record|record 世界の返事をつなぐ星冠|記憶、観測、声、命の流れ、天球儀、方舟が星冠につながる。返事を止めた署名と、欠けた環の相手は未解明。|
|j15-8|c15-clear|summary 砕けた王冠に残る余白|星冠を部分修復し位相を安定させた。未接続の環が遠い星脈の合流点を指す。結末はまだ決まっていない。|

## 全66マップの接続

出入口は既存条件を検証して解放。地点UIへの出口は、その地点の解放済み前後へ既存UIで接続する。下表は実登録から生成した出入口の全一覧。

|マップID・地点|出入口ID→接続先（条件）|
|---|---|
|grove-camp / c7-camp|camp-village→grove-village [] / camp-east→grove-trail []|
|grove-trail / c7-trail|trail-west→grove-camp [] / trail-east→grove-ruins [] / trail-stream→c7-stream []|
|grove-ruins / c7-ruins|ruins-west→grove-trail [] / ruins-garden→grove-garden [] / ruins-pond→c7-pond []|
|sky-port / c8-port|port-town→sky-town [] / port-island→sky-island [] / port-deck→c8-deck []|
|sky-island / c8-island|island-port→sky-port [] / island-ruins→sky-ruins [] / island-town→c8-town []|
|sky-ruins / c8-ruins|sky-ruins-west→sky-island [] / ruins-tower→sky-tower [] / ruins-reactor→c8-reactor []|
|grove-village / c7-village|village-camp→grove-camp [] / village-trail→grove-trail [] / village-greenhouse→c7-herbarium ["c7-gran"]|
|grove-garden / c7-garden|garden-ruins→grove-ruins [] / garden-sanctum→c7-sanctum ["c7-seles-truth"]|
|sky-town / c8-town|town-island→sky-island [] / town-port→sky-port [] / town-workshop→c8-workshop ["c8-residents"]|
|sky-tower / c8-observatory|tower-ruins→sky-ruins [] / tower-town→sky-town [] / tower-altar→c8-altar ["c8-records"]|
|star-cave / c9-entrance|cave-path→star-path ["c9-arrival"]|
|star-path / c9-path|path-cave→star-cave [] / path-gate→c9-gate ["c9-path-cache"] / path-city→star-city ["c9-gate-meeting"]|
|star-city / c9-square|city-path→star-path [] / city-market→star-market ["c9-city-rest"]|
|star-market / c9-market|market-city→star-city [] / market-residence→c9-residence ["c9-market-blades"] / market-waterway→star-waterway ["c9-workshop-clue"]|
|star-waterway / c9-waterway|waterway-market→star-market [] / waterway-mine→star-mine ["c9-waterway-record"]|
|star-mine / c9-crystal|mine-waterway→star-waterway [] / mine-guard→c9-guard ["c9-mine-token"] / mine-archive→star-archive ["c9-seal-repair"]|
|star-archive / c9-archive|archive-mine→star-mine [] / archive-lab→c9-lab ["c9-archive-record"] / archive-core→star-core ["c9-sanctum-promise"]|
|star-core / c9-core|core-archive→star-archive []|
|tide-road / c10-road|road-town→tide-town ["c10-road-cache"]|
|tide-town / c10-town|town-road→tide-road [] / town-port→tide-port ["c10-rest"]|
|tide-port / c10-port|port-town→tide-town [] / port-market→c10-market ["c10-high-tide"] / port-beach→tide-beach ["c10-bow"]|
|tide-beach / c10-beach|beach-port→tide-port [] / beach-cliff→c10-cliff ["c10-fiona"] / beach-cave→tide-cave ["c10-low-tide"]|
|tide-observatory / c10-observatory|observatory-cliff→c10-cliff [] / observatory-tower→c10-tower ["c10-observatory-record"]|
|tide-cave / c10-cave|cave-beach→tide-beach [] / cave-pool→c10-tidepool ["c10-cave-record"] / cave-ruins→tide-ruins ["c10-pool-rest"]|
|tide-ruins / c10-ruins|ruins-cave→tide-cave [] / ruins-channel→c10-channel ["c10-ruins-tablet"]|
|tide-core / c10-core|core-sanctum→c10-sanctum []|
|pale-road / c11-road|pale-road-village→pale-village ["c11-road-cache"]|
|pale-village / c11-village|pale-village-road→pale-road [] / pale-village-field→pale-field ["c11-rest"]|
|pale-field / c11-field|pale-field-village→pale-village [] / pale-field-waystation→c11-waystation ["c11-escort-plan"] / pale-field-stones→pale-stones ["c11-blades"]|
|pale-stones / c11-stones|pale-stones-field→pale-field [] / pale-stones-ridge→c11-ridge ["c11-mira"] / pale-stones-sanctuary→pale-sanctuary ["c11-shelter-rest"]|
|pale-ravine / c11-ravine|pale-ravine-ridge→c11-ridge [] / pale-ravine-shelter→c11-shelter ["c11-ravine-record"]|
|pale-sanctuary / c11-sanctuary|pale-sanctuary-stones→pale-stones [] / pale-sanctuary-garden→c11-garden ["c11-sanctuary-record"] / pale-sanctuary-archive→pale-archive ["c11-garden-rest"]|
|pale-archive / c11-archive|pale-archive-sanctuary→pale-sanctuary [] / pale-archive-passage→c11-passage ["c11-archive-tablet"] / pale-archive-core→pale-core ["c11-promise"]|
|pale-core / c11-core|pale-core-altar→c11-altar []|
|gloom-road / c12-road|gloom-road-village→gloom-village ["c12-road-cache"]|
|gloom-village / c12-village|gloom-village-road→gloom-road [] / gloom-village-woods→gloom-woods ["c12-rest"]|
|gloom-woods / c12-woods|gloom-woods-village→gloom-village [] / gloom-woods-watch→c12-watch ["c12-sheltered-record"] / gloom-woods-lake→gloom-lake ["c12-sword"]|
|gloom-lake / c12-lake|gloom-lake-woods→gloom-woods [] / gloom-lake-ridge→c12-ridge ["c12-ciel"] / gloom-lake-shrine→gloom-shrine ["c12-shelter-rest"]|
|gloom-roots / c12-roots|gloom-roots-ridge→c12-ridge [] / gloom-roots-shelter→c12-shelter ["c12-roots-record"]|
|gloom-shrine / c12-shrine|gloom-shrine-lake→gloom-lake [] / gloom-shrine-garden→c12-garden ["c12-shrine-record"] / gloom-shrine-archive→gloom-archive ["c12-garden-rest"]|
|gloom-archive / c12-archive|gloom-archive-shrine→gloom-shrine [] / gloom-archive-channel→c12-channel ["c12-archive-tablet"] / gloom-archive-core→gloom-core ["c12-promise"]|
|gloom-core / c12-core|gloom-core-altar→c12-altar []|
|gear-rail / c13-rail|gear-rail-station→gear-station ["c13-rail-cache"]|
|gear-station / c13-station|gear-station-rail→gear-rail [] / gear-station-city→gear-city ["c13-rail-start"]|
|gear-city / c13-city|gear-city-station→gear-station [] / gear-city-platform→c13-platform ["c13-residents"] / gear-city-market→gear-market ["c13-duals"]|
|gear-market / c13-market|gear-market-city→gear-city [] / gear-market-clock→c13-clock ["c13-fiora"] / gear-market-workshop→gear-workshop ["c13-refuge-rest"]|
|gear-lower / c13-lower|gear-lower-clock→c13-clock [] / gear-lower-refuge→c13-refuge ["c13-lower-record"]|
|gear-workshop / c13-workshop|gear-workshop-market→gear-market [] / gear-workshop-garden→c13-garden ["c13-workshop-record"] / gear-workshop-observatory→gear-observatory ["c13-garden-rest"]|
|gear-observatory / c13-observatory|gear-observatory-workshop→gear-workshop [] / gear-observatory-bridge→c13-bridge ["c13-observatory-tablet"] / gear-observatory-core→gear-core ["c13-promise"]|
|gear-core / c13-core|gear-core-altar→c13-altar []|
|ark-gateway / c14-gateway|ark-gateway-station→ark-shore ["c14-gateway-cache"]|
|ark-shore / c14-shore|ark-shore-rail→ark-gateway [] / ark-shore-city→ark-dock ["c14-control-start"]|
|ark-dock / c14-dock|ark-dock-station→ark-shore [] / ark-dock-platform→c14-deck ["c14-passengers"] / ark-dock-market→ark-hall ["c14-bow"]|
|ark-hall / c14-hall|ark-hall-city→ark-dock [] / ark-hall-clock→c14-beacon ["c14-yuno"] / ark-hall-workshop→ark-records ["c14-refuge-rest"]|
|ark-gravity / c14-gravity|ark-gravity-clock→c14-beacon [] / ark-gravity-refuge→c14-refuge ["c14-gravity-record"]|
|ark-records / c14-records|ark-records-market→ark-hall [] / ark-records-garden→c14-garden ["c14-records-record"] / ark-records-observatory→ark-sanctuary ["c14-garden-rest"]|
|ark-sanctuary / c14-sanctuary|ark-sanctuary-workshop→ark-records [] / ark-sanctuary-bridge→c14-bridge ["c14-sanctuary-tablet"] / ark-sanctuary-core→ark-core ["c14-promise"]|
|ark-core / c14-core|ark-core-altar→c14-altar []|
|void-gate / c15-gateway|void-gate-field→void-court ["c15-gateway-cache"]|
|void-court / c15-field|void-court-gateway→void-gate [] / void-court-monuments→void-corridor ["c15-field-record"]|
|void-corridor / c15-monuments|void-corridor-field→void-court [] / void-corridor-camp→c15-camp ["c15-monument-record"]|
|void-mirror / c15-sanctum|void-mirror-camp→c15-camp [] / void-mirror-seal→c15-seal ["c15-sanctum-fight"]|
|void-archive / c15-archive|void-archive-seal→c15-seal [] / void-archive-garden→c15-garden ["c15-archive-record"]|
|void-garden / c15-corridor|void-garden-bridge→c15-bridge [] / void-garden-refuge→c15-refuge ["c15-link-anchor", "c15-link-observe", "c15-link-choice"]|
|void-sanctum / c15-fracture|void-sanctum-refuge→c15-refuge [] / void-sanctum-observatory→c15-observatory ["c15-fracture-reading"]|
|void-core / c15-core|void-core-altar→c15-altar []|

## 保存互換・安全性

保存キー `astra-chronica:v1`、schema version 2を維持。新しい一時的な位相保存フィールドは作らない。旧章、装備数、経験値、90ノード、依頼、選択、探索記録、時間装置、道標を保持する。未知ID・重複・不正前提・不正座標を既存正規化へ通す。未確定戦闘は勝利を推測せず、安全な直前へ戻す。同じ戦闘serialとイベント完了の再適用でXP・戦績・武器・品物を二重付与しない。保存なし検証は独立したProgressを使用する。

## 会話全文

### c15-arrival 方舟にない座標

- **メイ**：方舟ノアティスの保存庫が、星図の外の座標を示している。北の氷環は表の目印で、こちらはそこへ接続する観測路だね。
- **アステル**：ユノと開いた道の、その先だ。星図に載らないからって、誰もいない場所とは決めないで行こう。
- **リナ**：帰還灯は方舟側へ残したわ。行き先が揺れても、三人で戻れる道を先に守りましょう。

### c15-gateway-fight 門を巡る衛兵

- **リナ**：衛兵が道を塞いだわ。盾を構えた相手へ攻撃を急がず、魔法と回復を合わせましょう。

### c15-gateway-cache 帰還隊の備え箱

- **アステル**：薬が二つ残っている。帰る人のための備えだね。必要な時に使って、受け取ったことも記録しておこう。

### c15-aria 未来を知る案内人

- **アリア**：ようこそ、虚空の聖域へ。私はアリア。あなたがこの門を渡る場面を、まだ来ない日の記録で見ました。
- **アステル**：その記録には、僕たちが帰るところもある？ 見えた結末を守るためではなく、今の道を確かめたいんだ。

### c15-field-record 欠けた星冠の第一片

- **アリア**：これは星冠の破片です。複数の世界の星脈を結ぶ装置でした。砕けてから、同じ回廊が違う場所へつながるのです。
- **メイ**：この小さな輪が位相を測っている。欠けた場所を力で埋めず、まず一片だけ接続してみよう。

### c15-awakening 最初の位相同期

- **メイ**：帰還路を固定してから、破片を同期するよ。地形を動かすのではなく、重なっていた接続の一つを選び出すんだ。
- **リナ**：新しい通路が現れたわ。別の細道は閉じたけれど、大きな迂回路は残っている。足元を確かめて進みましょう。
- **アリア**：ここからは位相同期です。装置を触った記録が残るので、灯りが消えても同じ道を呼び戻せます。

### c15-leon 星冠を守る騎士

- **レオン**：星冠守護騎士レオンだ。聖域の秩序を崩す者は通せない。未来を変えれば、守れなくなる世界もある。
- **リナ**：守るために確かめたいの。今ここを歩く人の危険まで、古い予測だけで決めないでほしい。

### c15-monument-record 消えるはずのない名前

- **レオン**：同行した観測員の名が台帳から消えた。私は覚えているのに、聖域は最初から誰も来なかったと返す。
- **メイ**：記録が事実を消したとは限らない。接続が変わって見えなくなった頁かもしれない。別の観測口も調べよう。

### c15-camp-rest 予見から離れて休む

- **リナ**：この幕の中では鏡が見えないわ。これから起きることばかり追わず、今の食事と休息を取りましょう。
- **アステル**：まだ見ていない未来に、今の僕たちを使い切らせない。休んでから、もう一度選ぶよ。

### c15-tise 記録を比べる研究者

- **ティセ**：研究者のティセです。ここの記録には、明日の私がすでに失敗したとある。でも昨日の予測は、今朝の出来事と違いました。
- **メイ**：第十章で観測した海も、条件を書かなければ同じ値にはならなかった。いつ、どこから見た未来なのかを比べよう。
- **アリア**：私が見た場面も一つの接続です。話さなかったのは、答えを聞けば必ずその通りに動くと思っていたからでした。

### c15-sanctum-fight 鏡殿の異常信号

- **メイ**：忘却の影は状態異常、時紡ぎウィスプは速い属性攻撃を使う。沈黙したら回復品や防御も選んでね。

### c15-seal-record 観測口を二つ残す

- **メイ**：鏡と星脈を別々に測ると、同じ日時でも結果が違う。未来の記録は、条件の付いた可能性なんだ。
- **レオン**：ならば一つの未来だけを守ればよいとは言えぬ。違いを残したまま、奥の記録庫へ進め。

### c15-archive-fight 記録庫の星界警報

- **リナ**：監視者が光を集めたら全体攻撃の予兆よ。攻撃を欲張らず、防御と回復で次の行動を支えましょう。

### c15-archive-record 未来が過去になる頁

- **ティセ**：明日の災害が、百年前の出来事として棚に収まっている。日時だけでは並べられない。観測した世界の印が抜けています。
- **メイ**：第九章の記憶と同じで、誰の記録かを消すと一つの歴史に見えてしまう。違う世界の頁を分けて残そう。

### c15-garden-rest 変わる光の下で

- **アステル**：森の芽は、昔と同じ枝には伸びなかったね。記録どおりの花だけを守っていたら、新しい芽は置き去りだった。
- **リナ**：第十二章で返した命の流れも、ここで止めない。守る相手が今も変わることを、騎士にも伝えましょう。

### c15-guardian 星冠守護騎・レガリアガード

- **レオン**：守護騎は破片を外敵から守っている。強い単体術のあと、防御と反撃を構え、全体へ放射する。予兆中は魔法や回復で備えろ。
- **リナ**：倒した後の避難路は確かめたわ。騎士の誓いを壊すためではなく、守る人を確かめ直すために進む。

### c15-key 反転環の破片

- **レオン**：守護騎の中に第二の破片があった。星冠は完全な命令だけを通す装置ではない。異なる道を結ぶ継ぎ目も持っていたのか。
- **メイ**：これで位相を反転できる。同期で閉じた細道が戻り、別の接続が開く。安全な迂回路はそのまま残すよ。

### c15-bridge-record 三つの接続を選ぶ橋

- **アリア**：忘却の庭には座標・観測・選択の端末があります。どの順でも構いません。接続するたび、別の枝道と情報が開きます。
- **アステル**：先に見た答えだけを正解にしない。三つを比べてから、僕たちの道を決めよう。

### c15-link-anchor 座標端末をつなぐ

- **レオン**：この座標は第十三章の天球儀と第十四章の方舟につながる。世界の位置を示すもので、進むべき先を命じる印ではない。
- **アステル**：場所が分かれば、行かない道も選べる。帰れる印と一緒に、この接続を残しておこう。

### c15-link-observe 観測端末をつなぐ

- **メイ**：第十章の観測値と、第十一章の声の記録が同じ条件欄を持っている。値も声も、受け取る場所を消してはいけないんだ。
- **リナ**：違いが聞こえるよう、静かな時間も残しましょう。皆を同じ返事へ揃えるための装置にはしないわ。

### c15-link-choice 選択端末をつなぐ

- **アリア**：私はあなたたちが争う未来を見ました。でも、何を聞いて争ったかは記録されていなかった。見えない理由を、私が決めていたのです。
- **アステル**：争わないと約束して終わりにはしないよ。違う考えが出た時も、聞いて選び直せる道を残そう。

### c15-refuge-rest 部分修復の作業台

- **ティセ**：三つの接続がそろいました。星冠の全てを戻す必要はありません。まず帰還路と観測路を分ければ、今を保ったまま調べられます。
- **リナ**：全部直せないことを失敗にしないわ。休める場所から、安全に直せるところを増やしましょう。

### c15-fracture-fight 祭壇へ漏れる位相

- **メイ**：速いウィスプと監視者がいる。星力をためたら、予兆の前後で必殺技を使ってもいい。今の体力を先に守ろう。

### c15-fracture-reading 記録にない選択

- **ティセ**：今の戦いは、失敗すると書かれた頁と違いました。勝った結末だけを書き換えず、何を選んで違ったのかも残したい。
- **アステル**：僕たちの選択を、次の人の命令にはしないでね。同じ道が合わない時に、別の選び方を探せる記録にしよう。

### c15-boundary-tune 星冠の三環調律

- **メイ**：先に座標を固定し、観測の条件を照合する。最後に選べる接続を残す。未来を一つに閉じない順で輪をつなごう。

### c15-seer-record 星冠が結ぶもの

- **メイ**：つながったよ。記憶は残すもの、観測は比べるもの、声は応答を待つもの。命の循環、天球儀、方舟は、その間を運ぶ仕組みだった。
- **ティセ**：星冠は未来を管理する王冠というより、世界どうしが返事を交わす接続環だったのですね。まだ欠けた環の相手は分かりません。
- **アリア**：結末を命じたのが誰なのか、ここには署名がありません。分かった接続と、まだ読めない空白を分けて渡しましょう。

### c15-promise まだ書かれない明日へ

- **アステル**：定められた道を選ぶのではなく、今の僕たちで確かめて進む。違っていたら、そこで選び直すよ。
- **リナ**：守るのは同じ未来だけではないわ。そこへ進む人と、立ち止まる人が話せる時間も守る。
- **アリア**：私も次の記録を待つだけでなく、あなたたちに今の考えを話します。知らない未来を、一緒に迎えたい。

### c15-inherit 中枢へ残す退路

- **レオン**：帰還路は私が支える。守護の誓いは、同じ形を永久に閉じることではない。問い直して戻る者を迎えることでもある。
- **メイ**：執行者は部分修復を誤りと判定している。星冠を壊さず、未来を一つに固定する命令だけを止めよう。

### c15-crown-breaker 砕冠の執行者・クラウンブレイカー

- **リナ**：最初は秩序の防御、次は位相の崩壊、最後は未来の断絶へ移るわ。予兆は段階が変わっても残る。防御と回復で受けて、道を開きましょう。

### c15-clear 砕けた王冠に残る余白

- **アリア**：星冠は部分修復されました。位相は安定し、閉じていた通路を安全に使えます。まだ見えない世界へ、答えを急がず接続を残せました。
- **レオン**：騎士はここへ残る。戻る者も、初めて訪れる者も、同じ未来を選ばずに門を通れるように。
- **メイ**：未接続の環が、遠い星脈の合流点を示している。誰が返事を止めたのか、第十六章へ続く手掛かりだね。
- **アステル**：結末はまだ決めない。アリアたちの言葉を持って、次の場所でも三人で選んでいこう。

## 自動検証の再実行

`npm run dev`（5173）と`npm run preview -- --port 4173`を別ターミナルで起動した状態で実行する。旧UIのfixtureも同じソースから配信する。

```sh
npm test
npm run build
BASE_URL=http://localhost:4173 UI_TEST_URL=http://localhost:5173 node tests/browser-suite.mjs
BASE_URL=http://localhost:4173 npm run test:capture-v23
```

長時間のCanvas検証を再現する場合の実行ファイルラッパー。標準WebGLのsmokeは別途ネイティブChromiumで実行する。

```sh
cat > /tmp/astra-canvas-chromium <<'SH'
#!/bin/sh
exec /usr/bin/chromium --disable-webgl "$@"
SH
chmod +x /tmp/astra-canvas-chromium
BASE_URL=http://localhost:4173 UI_TEST_URL=http://localhost:5173 CHROMIUM_PATH=/tmp/astra-canvas-chromium WEBGL_CHROMIUM_PATH=/usr/bin/chromium node tests/browser-suite.mjs
```

## 変更ファイル（画像を除く）

画像は末尾の全PNG一覧に記載。その他の変更ファイルは以下のとおり。

- `README.md`
- `docs/CHAPTER_FIFTEEN_V23.md`
- `docs/test-results/v23.json`
- `package.json`
- `src/adventure-view.ts`
- `src/adventure.ts`
- `src/data/chapter-fifteen-enemies.ts`
- `src/data/chapter-fifteen.ts`
- `src/data/chapter-one.ts`
- `src/data/dialogue-choices.ts`
- `src/data/encounters.ts`
- `src/data/enemy-scripts.ts`
- `src/data/journal.ts`
- `src/data/side-quests.ts`
- `src/data/weapons.ts`
- `src/event-order.ts`
- `src/exploration/chapter-fifteen-maps.ts`
- `src/exploration/map-art.ts`
- `src/exploration/map-data.ts`
- `src/exploration/map-view.ts`
- `src/exploration/minimap.ts`
- `src/exploration/navigation.ts`
- `src/exploration/phase-effects.ts`
- `src/exploration/stellar-phase.ts`
- `src/exploration/transitions.ts`
- `src/exploration/types.ts`
- `src/main.ts`
- `src/types.ts`
- `tests/browser-suite.mjs`
- `tests/capture-v23.mjs`
- `tests/chapter-eight-v16.e2e.mjs`
- `tests/chapter-eight-v16.test.ts`
- `tests/chapter-eleven-v19.e2e.mjs`
- `tests/chapter-eleven-v19.test.ts`
- `tests/chapter-fifteen-equipment.e2e.mjs`
- `tests/chapter-fifteen-fixture.mjs`
- `tests/chapter-fifteen-ui.e2e.mjs`
- `tests/chapter-fifteen-v23.e2e.mjs`
- `tests/chapter-fifteen-v23.test.ts`
- `tests/chapter-five-v13.e2e.mjs`
- `tests/chapter-five-v13.test.ts`
- `tests/chapter-four-v12.e2e.mjs`
- `tests/chapter-four-v12.test.ts`
- `tests/chapter-fourteen-v22.e2e.mjs`
- `tests/chapter-fourteen-v22.test.ts`
- `tests/chapter-nine-v17.e2e.mjs`
- `tests/chapter-nine-v17.test.ts`
- `tests/chapter-seven-v15.e2e.mjs`
- `tests/chapter-seven-v15.test.ts`
- `tests/chapter-six-v14.e2e.mjs`
- `tests/chapter-six-v14.test.ts`
- `tests/chapter-ten-v18.e2e.mjs`
- `tests/chapter-ten-v18.test.ts`
- `tests/chapter-thirteen-v21.e2e.mjs`
- `tests/chapter-thirteen-v21.test.ts`
- `tests/chapter-twelve-v20.e2e.mjs`
- `tests/chapter-twelve-v20.test.ts`
- `tests/chapter-two-v10.test.ts`
- `tests/corridor-v23.e2e.mjs`
- `tests/exploration-v19.smoke.mjs`
- `tests/exploration-v20.smoke.mjs`
- `tests/exploration-v21.smoke.mjs`
- `tests/exploration-v22.smoke.mjs`
- `tests/exploration-v22.test.ts`
- `tests/exploration-v23.e2e.mjs`
- `tests/exploration-v23.smoke.mjs`
- `tests/exploration-v23.test.ts`
- `tests/v23-helpers.ts`

## 検証結果と制約

- `npm test`：**1,572/1,572件成功、33ファイル**。既存1,366ケースを維持し、206ケース追加。skip・削除・判定緩和なし。単独ワーカーで実行し、旧5秒制限は変更していない。
- 旧章の固定乱数一括テストに一時的な実時間超過があり、同じ判定・制限で再実行。最終の全件実行は成功。
- 新章：20乱数種×依頼あり／なしの40通しクリア。新双剣・盾突剣でもLv50で最終ボスに4乱数の実勝利。新しい全戦闘・物理反撃・実被弾者への星力・魔法・回復を数値検証。
- Chromium：**64/64ファイル成功**（既存58＋新規6）。第15章を依頼クリア前／後の2経路、各6戦、計12回の実勝利。Lv50のまま、会話・位相装置・装備・撤退と再戦・中断復旧・保存・手帳・Lab分離を確認。
- 初回の並列操作で失敗したファイル：battle-ui.e2e.mjs, chapter-fourteen-v22.e2e.mjs, chapter-thirteen-v21.e2e.mjs, railway-v21.e2e.mjs, transit-v22.e2e.mjs, chapter-eleven-v19.e2e.mjs, chapter-twelve-v20.e2e.mjs。ブラウザ負荷を抑え、同じ判定・時間制限で再実行し、最終成否を上記64件と機械可読記録へ反映。
- **66マップ×4幅＝264ケース成功**。320/390/430/768pxのタッチ、比率、カメラ、横スクロール、44px、ミニマップ、画面復帰を確認。旧章の潮位・共鳴・光路・天球儀・重力、鉄道・区画制御を回帰。
- 3接続端末の全6順序、未確定の中断・再読込・再訪、位相4状態、実地形とミニマップ、壁内座標の安全修復を確認。
- 標準WebGL成功。実行時エラー0。長時間の網羅テストにはPhaser Canvasも使用。
- `npm run build`成功。本番候補と最終ビルドの4出力のSHA-256が一致。旧UIの3ファイルと第2章の一部検証は同じソースの開発用fixture（5173）を使用し、本編の操作は本番候補（4193）で実施。追加撮影スクリプトも成功。
- [ファイル別検証記録・ビルドハッシュ](test-results/v23.json)。画像リンク、PNG形式とGit管理対象への包含を確認。

iPhone Safari実機は未確認。Chromiumタッチ・4幅・標準WebGLで自動検証し、全18章完成前のユーザー手動テストは依頼していない。探索色とミニマップ開閉はページ内セッション限定。正式画像・第16〜18章・ジョブ変更は追加しない。既存Phaserチャンクの500kB超警告は残る。mainマージ・Pages公開・PLiCy投稿は行っていない。

## スクリーンショット

実撮影168枚。下表の主要画面はすべて4幅で取得。個別ファイル一覧も続けて記載する。

|画面|320px|390px|430px|768px|
|---|---|---|---|---|
|exploration-v23-phase-gateway|[320](screenshots/exploration-v23-phase-gateway-320.png)|[390](screenshots/exploration-v23-phase-gateway-390.png)|[430](screenshots/exploration-v23-phase-gateway-430.png)|[768](screenshots/exploration-v23-phase-gateway-768.png)|
|exploration-v23-phase-field|[320](screenshots/exploration-v23-phase-field-320.png)|[390](screenshots/exploration-v23-phase-field-390.png)|[430](screenshots/exploration-v23-phase-field-430.png)|[768](screenshots/exploration-v23-phase-field-768.png)|
|exploration-v23-phase-monuments|[320](screenshots/exploration-v23-phase-monuments-320.png)|[390](screenshots/exploration-v23-phase-monuments-390.png)|[430](screenshots/exploration-v23-phase-monuments-430.png)|[768](screenshots/exploration-v23-phase-monuments-768.png)|
|exploration-v23-phase-sanctum|[320](screenshots/exploration-v23-phase-sanctum-320.png)|[390](screenshots/exploration-v23-phase-sanctum-390.png)|[430](screenshots/exploration-v23-phase-sanctum-430.png)|[768](screenshots/exploration-v23-phase-sanctum-768.png)|
|exploration-v23-phase-archive|[320](screenshots/exploration-v23-phase-archive-320.png)|[390](screenshots/exploration-v23-phase-archive-390.png)|[430](screenshots/exploration-v23-phase-archive-430.png)|[768](screenshots/exploration-v23-phase-archive-768.png)|
|exploration-v23-phase-corridor|[320](screenshots/exploration-v23-phase-corridor-320.png)|[390](screenshots/exploration-v23-phase-corridor-390.png)|[430](screenshots/exploration-v23-phase-corridor-430.png)|[768](screenshots/exploration-v23-phase-corridor-768.png)|
|exploration-v23-phase-fracture|[320](screenshots/exploration-v23-phase-fracture-320.png)|[390](screenshots/exploration-v23-phase-fracture-390.png)|[430](screenshots/exploration-v23-phase-fracture-430.png)|[768](screenshots/exploration-v23-phase-fracture-768.png)|
|exploration-v23-phase-core|[320](screenshots/exploration-v23-phase-core-320.png)|[390](screenshots/exploration-v23-phase-core-390.png)|[430](screenshots/exploration-v23-phase-core-430.png)|[768](screenshots/exploration-v23-phase-core-768.png)|
|exploration-v23-phase-chaotic|[320](screenshots/exploration-v23-phase-chaotic-320.png)|[390](screenshots/exploration-v23-phase-chaotic-390.png)|[430](screenshots/exploration-v23-phase-chaotic-430.png)|[768](screenshots/exploration-v23-phase-chaotic-768.png)|
|exploration-v23-phase-synced|[320](screenshots/exploration-v23-phase-synced-320.png)|[390](screenshots/exploration-v23-phase-synced-390.png)|[430](screenshots/exploration-v23-phase-synced-430.png)|[768](screenshots/exploration-v23-phase-synced-768.png)|
|exploration-v23-phase-inverted|[320](screenshots/exploration-v23-phase-inverted-320.png)|[390](screenshots/exploration-v23-phase-inverted-390.png)|[430](screenshots/exploration-v23-phase-inverted-430.png)|[768](screenshots/exploration-v23-phase-inverted-768.png)|
|exploration-v23-phase-stable|[320](screenshots/exploration-v23-phase-stable-320.png)|[390](screenshots/exploration-v23-phase-stable-390.png)|[430](screenshots/exploration-v23-phase-stable-430.png)|[768](screenshots/exploration-v23-phase-stable-768.png)|
|exploration-v23-minimap|[320](screenshots/exploration-v23-minimap-320.png)|[390](screenshots/exploration-v23-minimap-390.png)|[430](screenshots/exploration-v23-minimap-430.png)|[768](screenshots/exploration-v23-minimap-768.png)|
|chapter-fifteen-npc|[320](screenshots/chapter-fifteen-npc-320.png)|[390](screenshots/chapter-fifteen-npc-390.png)|[430](screenshots/chapter-fifteen-npc-430.png)|[768](screenshots/chapter-fifteen-npc-768.png)|
|chapter-fifteen-gateway-fight-battle|[320](screenshots/chapter-fifteen-gateway-fight-battle-320.png)|[390](screenshots/chapter-fifteen-gateway-fight-battle-390.png)|[430](screenshots/chapter-fifteen-gateway-fight-battle-430.png)|[768](screenshots/chapter-fifteen-gateway-fight-battle-768.png)|
|chapter-fifteen-guardian-battle|[320](screenshots/chapter-fifteen-guardian-battle-320.png)|[390](screenshots/chapter-fifteen-guardian-battle-390.png)|[430](screenshots/chapter-fifteen-guardian-battle-430.png)|[768](screenshots/chapter-fifteen-guardian-battle-768.png)|
|chapter-fifteen-boss-ui|[320](screenshots/chapter-fifteen-boss-ui-320.png)|[390](screenshots/chapter-fifteen-boss-ui-390.png)|[430](screenshots/chapter-fifteen-boss-ui-430.png)|[768](screenshots/chapter-fifteen-boss-ui-768.png)|
|chapter-fifteen-clear|[320](screenshots/chapter-fifteen-clear-320.png)|[390](screenshots/chapter-fifteen-clear-390.png)|[430](screenshots/chapter-fifteen-clear-430.png)|[768](screenshots/chapter-fifteen-clear-768.png)|
|chapter-fifteen-weapon-starcrown-duals|[320](screenshots/chapter-fifteen-weapon-starcrown-duals-320.png)|[390](screenshots/chapter-fifteen-weapon-starcrown-duals-390.png)|[430](screenshots/chapter-fifteen-weapon-starcrown-duals-430.png)|[768](screenshots/chapter-fifteen-weapon-starcrown-duals-768.png)|
|chapter-fifteen-weapon-voidward-shield-rapier|[320](screenshots/chapter-fifteen-weapon-voidward-shield-rapier-320.png)|[390](screenshots/chapter-fifteen-weapon-voidward-shield-rapier-390.png)|[430](screenshots/chapter-fifteen-weapon-voidward-shield-rapier-430.png)|[768](screenshots/chapter-fifteen-weapon-voidward-shield-rapier-768.png)|
|chapter-fifteen-weapon-astral-wand|[320](screenshots/chapter-fifteen-weapon-astral-wand-320.png)|[390](screenshots/chapter-fifteen-weapon-astral-wand-390.png)|[430](screenshots/chapter-fifteen-weapon-astral-wand-430.png)|[768](screenshots/chapter-fifteen-weapon-astral-wand-768.png)|

### 全画像ファイル

- [画像 chapter-fifteen-archive-battle-390.png](screenshots/chapter-fifteen-archive-battle-390.png)
- [画像 chapter-fifteen-archive-result-390.png](screenshots/chapter-fifteen-archive-result-390.png)
- [画像 chapter-fifteen-boss-ui-320.png](screenshots/chapter-fifteen-boss-ui-320.png)
- [画像 chapter-fifteen-boss-ui-390.png](screenshots/chapter-fifteen-boss-ui-390.png)
- [画像 chapter-fifteen-boss-ui-430.png](screenshots/chapter-fifteen-boss-ui-430.png)
- [画像 chapter-fifteen-boss-ui-768.png](screenshots/chapter-fifteen-boss-ui-768.png)
- [画像 chapter-fifteen-cap50-320.png](screenshots/chapter-fifteen-cap50-320.png)
- [画像 chapter-fifteen-cap50-390.png](screenshots/chapter-fifteen-cap50-390.png)
- [画像 chapter-fifteen-cap50-430.png](screenshots/chapter-fifteen-cap50-430.png)
- [画像 chapter-fifteen-cap50-768.png](screenshots/chapter-fifteen-cap50-768.png)
- [画像 chapter-fifteen-chaotic-390.png](screenshots/chapter-fifteen-chaotic-390.png)
- [画像 chapter-fifteen-choice-320.png](screenshots/chapter-fifteen-choice-320.png)
- [画像 chapter-fifteen-choice-390.png](screenshots/chapter-fifteen-choice-390.png)
- [画像 chapter-fifteen-choice-430.png](screenshots/chapter-fifteen-choice-430.png)
- [画像 chapter-fifteen-choice-768.png](screenshots/chapter-fifteen-choice-768.png)
- [画像 chapter-fifteen-clear-320.png](screenshots/chapter-fifteen-clear-320.png)
- [画像 chapter-fifteen-clear-390.png](screenshots/chapter-fifteen-clear-390.png)
- [画像 chapter-fifteen-clear-430.png](screenshots/chapter-fifteen-clear-430.png)
- [画像 chapter-fifteen-clear-768.png](screenshots/chapter-fifteen-clear-768.png)
- [画像 chapter-fifteen-corridor-1-390.png](screenshots/chapter-fifteen-corridor-1-390.png)
- [画像 chapter-fifteen-corridor-2-390.png](screenshots/chapter-fifteen-corridor-2-390.png)
- [画像 chapter-fifteen-corridor-3-390.png](screenshots/chapter-fifteen-corridor-3-390.png)
- [画像 chapter-fifteen-dialogue-320.png](screenshots/chapter-fifteen-dialogue-320.png)
- [画像 chapter-fifteen-dialogue-390.png](screenshots/chapter-fifteen-dialogue-390.png)
- [画像 chapter-fifteen-dialogue-430.png](screenshots/chapter-fifteen-dialogue-430.png)
- [画像 chapter-fifteen-dialogue-768.png](screenshots/chapter-fifteen-dialogue-768.png)
- [画像 chapter-fifteen-enemy-symbol-390.png](screenshots/chapter-fifteen-enemy-symbol-390.png)
- [画像 chapter-fifteen-equipment-390.png](screenshots/chapter-fifteen-equipment-390.png)
- [画像 chapter-fifteen-fracture-battle-390.png](screenshots/chapter-fifteen-fracture-battle-390.png)
- [画像 chapter-fifteen-fracture-result-390.png](screenshots/chapter-fifteen-fracture-result-390.png)
- [画像 chapter-fifteen-gateway-390.png](screenshots/chapter-fifteen-gateway-390.png)
- [画像 chapter-fifteen-gateway-fight-battle-320.png](screenshots/chapter-fifteen-gateway-fight-battle-320.png)
- [画像 chapter-fifteen-gateway-fight-battle-390.png](screenshots/chapter-fifteen-gateway-fight-battle-390.png)
- [画像 chapter-fifteen-gateway-fight-battle-430.png](screenshots/chapter-fifteen-gateway-fight-battle-430.png)
- [画像 chapter-fifteen-gateway-fight-battle-768.png](screenshots/chapter-fifteen-gateway-fight-battle-768.png)
- [画像 chapter-fifteen-gateway-fight-result-390.png](screenshots/chapter-fifteen-gateway-fight-result-390.png)
- [画像 chapter-fifteen-guardian-battle-320.png](screenshots/chapter-fifteen-guardian-battle-320.png)
- [画像 chapter-fifteen-guardian-battle-390.png](screenshots/chapter-fifteen-guardian-battle-390.png)
- [画像 chapter-fifteen-guardian-battle-430.png](screenshots/chapter-fifteen-guardian-battle-430.png)
- [画像 chapter-fifteen-guardian-battle-768.png](screenshots/chapter-fifteen-guardian-battle-768.png)
- [画像 chapter-fifteen-guardian-result-390.png](screenshots/chapter-fifteen-guardian-result-390.png)
- [画像 chapter-fifteen-journal-390.png](screenshots/chapter-fifteen-journal-390.png)
- [画像 chapter-fifteen-new-weapons-action-390.png](screenshots/chapter-fifteen-new-weapons-action-390.png)
- [画像 chapter-fifteen-npc-320.png](screenshots/chapter-fifteen-npc-320.png)
- [画像 chapter-fifteen-npc-390.png](screenshots/chapter-fifteen-npc-390.png)
- [画像 chapter-fifteen-npc-430.png](screenshots/chapter-fifteen-npc-430.png)
- [画像 chapter-fifteen-npc-768.png](screenshots/chapter-fifteen-npc-768.png)
- [画像 chapter-fifteen-oblivion-battle-390.png](screenshots/chapter-fifteen-oblivion-battle-390.png)
- [画像 chapter-fifteen-oblivion-result-390.png](screenshots/chapter-fifteen-oblivion-result-390.png)
- [画像 chapter-fifteen-sanctum-battle-390.png](screenshots/chapter-fifteen-sanctum-battle-390.png)
- [画像 chapter-fifteen-sanctum-result-390.png](screenshots/chapter-fifteen-sanctum-result-390.png)
- [画像 chapter-fifteen-synced-390.png](screenshots/chapter-fifteen-synced-390.png)
- [画像 chapter-fifteen-weapon-astral-wand-320.png](screenshots/chapter-fifteen-weapon-astral-wand-320.png)
- [画像 chapter-fifteen-weapon-astral-wand-390.png](screenshots/chapter-fifteen-weapon-astral-wand-390.png)
- [画像 chapter-fifteen-weapon-astral-wand-430.png](screenshots/chapter-fifteen-weapon-astral-wand-430.png)
- [画像 chapter-fifteen-weapon-astral-wand-768.png](screenshots/chapter-fifteen-weapon-astral-wand-768.png)
- [画像 chapter-fifteen-weapon-starcrown-duals-320.png](screenshots/chapter-fifteen-weapon-starcrown-duals-320.png)
- [画像 chapter-fifteen-weapon-starcrown-duals-390.png](screenshots/chapter-fifteen-weapon-starcrown-duals-390.png)
- [画像 chapter-fifteen-weapon-starcrown-duals-430.png](screenshots/chapter-fifteen-weapon-starcrown-duals-430.png)
- [画像 chapter-fifteen-weapon-starcrown-duals-768.png](screenshots/chapter-fifteen-weapon-starcrown-duals-768.png)
- [画像 chapter-fifteen-weapon-voidward-shield-rapier-320.png](screenshots/chapter-fifteen-weapon-voidward-shield-rapier-320.png)
- [画像 chapter-fifteen-weapon-voidward-shield-rapier-390.png](screenshots/chapter-fifteen-weapon-voidward-shield-rapier-390.png)
- [画像 chapter-fifteen-weapon-voidward-shield-rapier-430.png](screenshots/chapter-fifteen-weapon-voidward-shield-rapier-430.png)
- [画像 chapter-fifteen-weapon-voidward-shield-rapier-768.png](screenshots/chapter-fifteen-weapon-voidward-shield-rapier-768.png)
- [画像 chapter-fifteen-webgl-action-390.png](screenshots/chapter-fifteen-webgl-action-390.png)
- [画像 exploration-v23-ark-core-390.png](screenshots/exploration-v23-ark-core-390.png)
- [画像 exploration-v23-ark-dock-390.png](screenshots/exploration-v23-ark-dock-390.png)
- [画像 exploration-v23-ark-gateway-390.png](screenshots/exploration-v23-ark-gateway-390.png)
- [画像 exploration-v23-ark-gravity-390.png](screenshots/exploration-v23-ark-gravity-390.png)
- [画像 exploration-v23-ark-hall-390.png](screenshots/exploration-v23-ark-hall-390.png)
- [画像 exploration-v23-ark-records-390.png](screenshots/exploration-v23-ark-records-390.png)
- [画像 exploration-v23-ark-sanctuary-390.png](screenshots/exploration-v23-ark-sanctuary-390.png)
- [画像 exploration-v23-ark-shore-390.png](screenshots/exploration-v23-ark-shore-390.png)
- [画像 exploration-v23-celestial-complete-390.png](screenshots/exploration-v23-celestial-complete-390.png)
- [画像 exploration-v23-celestial-partial-390.png](screenshots/exploration-v23-celestial-partial-390.png)
- [画像 exploration-v23-celestial-stopped-390.png](screenshots/exploration-v23-celestial-stopped-390.png)
- [画像 exploration-v23-celestial-synchronized-390.png](screenshots/exploration-v23-celestial-synchronized-390.png)
- [画像 exploration-v23-gear-city-detail-390.png](screenshots/exploration-v23-gear-city-detail-390.png)
- [画像 exploration-v23-gear-core-detail-390.png](screenshots/exploration-v23-gear-core-detail-390.png)
- [画像 exploration-v23-gear-lower-detail-390.png](screenshots/exploration-v23-gear-lower-detail-390.png)
- [画像 exploration-v23-gear-market-detail-390.png](screenshots/exploration-v23-gear-market-detail-390.png)
- [画像 exploration-v23-gear-observatory-detail-390.png](screenshots/exploration-v23-gear-observatory-detail-390.png)
- [画像 exploration-v23-gear-station-320.png](screenshots/exploration-v23-gear-station-320.png)
- [画像 exploration-v23-gear-station-390.png](screenshots/exploration-v23-gear-station-390.png)
- [画像 exploration-v23-gear-station-430.png](screenshots/exploration-v23-gear-station-430.png)
- [画像 exploration-v23-gear-station-768.png](screenshots/exploration-v23-gear-station-768.png)
- [画像 exploration-v23-gear-station-detail-390.png](screenshots/exploration-v23-gear-station-detail-390.png)
- [画像 exploration-v23-gear-workshop-detail-390.png](screenshots/exploration-v23-gear-workshop-detail-390.png)
- [画像 exploration-v23-gravity-controlled-390.png](screenshots/exploration-v23-gravity-controlled-390.png)
- [画像 exploration-v23-gravity-normal-390.png](screenshots/exploration-v23-gravity-normal-390.png)
- [画像 exploration-v23-gravity-reversed-390.png](screenshots/exploration-v23-gravity-reversed-390.png)
- [画像 exploration-v23-gravity-stable-390.png](screenshots/exploration-v23-gravity-stable-390.png)
- [画像 exploration-v23-grove-garden-390.png](screenshots/exploration-v23-grove-garden-390.png)
- [画像 exploration-v23-grove-village-390.png](screenshots/exploration-v23-grove-village-390.png)
- [画像 exploration-v23-high-reload-390.png](screenshots/exploration-v23-high-reload-390.png)
- [画像 exploration-v23-light-dark-390.png](screenshots/exploration-v23-light-dark-390.png)
- [画像 exploration-v23-light-glimmer-390.png](screenshots/exploration-v23-light-glimmer-390.png)
- [画像 exploration-v23-light-linked-390.png](screenshots/exploration-v23-light-linked-390.png)
- [画像 exploration-v23-light-renewed-390.png](screenshots/exploration-v23-light-renewed-390.png)
- [画像 exploration-v23-low-reload-390.png](screenshots/exploration-v23-low-reload-390.png)
- [画像 exploration-v23-minimap-320.png](screenshots/exploration-v23-minimap-320.png)
- [画像 exploration-v23-minimap-390.png](screenshots/exploration-v23-minimap-390.png)
- [画像 exploration-v23-minimap-430.png](screenshots/exploration-v23-minimap-430.png)
- [画像 exploration-v23-minimap-768.png](screenshots/exploration-v23-minimap-768.png)
- [画像 exploration-v23-old-twelve-npc-390.png](screenshots/exploration-v23-old-twelve-npc-390.png)
- [画像 exploration-v23-old-twelve-road-390.png](screenshots/exploration-v23-old-twelve-road-390.png)
- [画像 exploration-v23-phase-archive-320.png](screenshots/exploration-v23-phase-archive-320.png)
- [画像 exploration-v23-phase-archive-390.png](screenshots/exploration-v23-phase-archive-390.png)
- [画像 exploration-v23-phase-archive-430.png](screenshots/exploration-v23-phase-archive-430.png)
- [画像 exploration-v23-phase-archive-768.png](screenshots/exploration-v23-phase-archive-768.png)
- [画像 exploration-v23-phase-chaotic-320.png](screenshots/exploration-v23-phase-chaotic-320.png)
- [画像 exploration-v23-phase-chaotic-390.png](screenshots/exploration-v23-phase-chaotic-390.png)
- [画像 exploration-v23-phase-chaotic-430.png](screenshots/exploration-v23-phase-chaotic-430.png)
- [画像 exploration-v23-phase-chaotic-768.png](screenshots/exploration-v23-phase-chaotic-768.png)
- [画像 exploration-v23-phase-core-320.png](screenshots/exploration-v23-phase-core-320.png)
- [画像 exploration-v23-phase-core-390.png](screenshots/exploration-v23-phase-core-390.png)
- [画像 exploration-v23-phase-core-430.png](screenshots/exploration-v23-phase-core-430.png)
- [画像 exploration-v23-phase-core-768.png](screenshots/exploration-v23-phase-core-768.png)
- [画像 exploration-v23-phase-corridor-320.png](screenshots/exploration-v23-phase-corridor-320.png)
- [画像 exploration-v23-phase-corridor-390.png](screenshots/exploration-v23-phase-corridor-390.png)
- [画像 exploration-v23-phase-corridor-430.png](screenshots/exploration-v23-phase-corridor-430.png)
- [画像 exploration-v23-phase-corridor-768.png](screenshots/exploration-v23-phase-corridor-768.png)
- [画像 exploration-v23-phase-field-320.png](screenshots/exploration-v23-phase-field-320.png)
- [画像 exploration-v23-phase-field-390.png](screenshots/exploration-v23-phase-field-390.png)
- [画像 exploration-v23-phase-field-430.png](screenshots/exploration-v23-phase-field-430.png)
- [画像 exploration-v23-phase-field-768.png](screenshots/exploration-v23-phase-field-768.png)
- [画像 exploration-v23-phase-fracture-320.png](screenshots/exploration-v23-phase-fracture-320.png)
- [画像 exploration-v23-phase-fracture-390.png](screenshots/exploration-v23-phase-fracture-390.png)
- [画像 exploration-v23-phase-fracture-430.png](screenshots/exploration-v23-phase-fracture-430.png)
- [画像 exploration-v23-phase-fracture-768.png](screenshots/exploration-v23-phase-fracture-768.png)
- [画像 exploration-v23-phase-gateway-320.png](screenshots/exploration-v23-phase-gateway-320.png)
- [画像 exploration-v23-phase-gateway-390.png](screenshots/exploration-v23-phase-gateway-390.png)
- [画像 exploration-v23-phase-gateway-430.png](screenshots/exploration-v23-phase-gateway-430.png)
- [画像 exploration-v23-phase-gateway-768.png](screenshots/exploration-v23-phase-gateway-768.png)
- [画像 exploration-v23-phase-inverted-320.png](screenshots/exploration-v23-phase-inverted-320.png)
- [画像 exploration-v23-phase-inverted-390.png](screenshots/exploration-v23-phase-inverted-390.png)
- [画像 exploration-v23-phase-inverted-430.png](screenshots/exploration-v23-phase-inverted-430.png)
- [画像 exploration-v23-phase-inverted-768.png](screenshots/exploration-v23-phase-inverted-768.png)
- [画像 exploration-v23-phase-monuments-320.png](screenshots/exploration-v23-phase-monuments-320.png)
- [画像 exploration-v23-phase-monuments-390.png](screenshots/exploration-v23-phase-monuments-390.png)
- [画像 exploration-v23-phase-monuments-430.png](screenshots/exploration-v23-phase-monuments-430.png)
- [画像 exploration-v23-phase-monuments-768.png](screenshots/exploration-v23-phase-monuments-768.png)
- [画像 exploration-v23-phase-sanctum-320.png](screenshots/exploration-v23-phase-sanctum-320.png)
- [画像 exploration-v23-phase-sanctum-390.png](screenshots/exploration-v23-phase-sanctum-390.png)
- [画像 exploration-v23-phase-sanctum-430.png](screenshots/exploration-v23-phase-sanctum-430.png)
- [画像 exploration-v23-phase-sanctum-768.png](screenshots/exploration-v23-phase-sanctum-768.png)
- [画像 exploration-v23-phase-stable-320.png](screenshots/exploration-v23-phase-stable-320.png)
- [画像 exploration-v23-phase-stable-390.png](screenshots/exploration-v23-phase-stable-390.png)
- [画像 exploration-v23-phase-stable-430.png](screenshots/exploration-v23-phase-stable-430.png)
- [画像 exploration-v23-phase-stable-768.png](screenshots/exploration-v23-phase-stable-768.png)
- [画像 exploration-v23-phase-synced-320.png](screenshots/exploration-v23-phase-synced-320.png)
- [画像 exploration-v23-phase-synced-390.png](screenshots/exploration-v23-phase-synced-390.png)
- [画像 exploration-v23-phase-synced-430.png](screenshots/exploration-v23-phase-synced-430.png)
- [画像 exploration-v23-phase-synced-768.png](screenshots/exploration-v23-phase-synced-768.png)
- [画像 exploration-v23-resonance-calm-390.png](screenshots/exploration-v23-resonance-calm-390.png)
- [画像 exploration-v23-resonance-faint-390.png](screenshots/exploration-v23-resonance-faint-390.png)
- [画像 exploration-v23-resonance-linked-390.png](screenshots/exploration-v23-resonance-linked-390.png)
- [画像 exploration-v23-resonance-silent-390.png](screenshots/exploration-v23-resonance-silent-390.png)
- [画像 exploration-v23-sky-tower-390.png](screenshots/exploration-v23-sky-tower-390.png)
- [画像 exploration-v23-sky-town-390.png](screenshots/exploration-v23-sky-town-390.png)
- [画像 exploration-v23-void-archive-390.png](screenshots/exploration-v23-void-archive-390.png)
- [画像 exploration-v23-void-core-390.png](screenshots/exploration-v23-void-core-390.png)
- [画像 exploration-v23-void-corridor-390.png](screenshots/exploration-v23-void-corridor-390.png)
- [画像 exploration-v23-void-court-390.png](screenshots/exploration-v23-void-court-390.png)
- [画像 exploration-v23-void-garden-390.png](screenshots/exploration-v23-void-garden-390.png)
- [画像 exploration-v23-void-gate-390.png](screenshots/exploration-v23-void-gate-390.png)
- [画像 exploration-v23-void-mirror-390.png](screenshots/exploration-v23-void-mirror-390.png)
- [画像 exploration-v23-void-sanctum-390.png](screenshots/exploration-v23-void-sanctum-390.png)
