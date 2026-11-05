# 第9弾 v0.9：星脈スキルツリー

mainのv0.8（69f60e2）を基準とするレビュー用実装です。mainへのマージ・本番公開は行いません。手動プレイ確認はユーザーへ依頼せず、ユニット・タッチブラウザ・スクリーンショットを開発側で確認しています。

## 構成・SP

3人×3系統×10ノード＝90ノードです。各系統は2列×5段で、段階の必要Lvは2／5／10／18／30。2列それぞれに育成経路があり、第5段の左ノードは第4段の両方を前提とします。全ノードを取得できる非循環の構造です。最大ランク1・各1SPです。

|キャラクター|3系統|
|---|---|
|アステル|剣技・攻撃／速攻・技巧／勇気・生存|
|リナ|鉄壁・防御／守護・支援／反撃・制圧|
|メイ|元素魔法／治癒・補助／星術・魔力|

`累計SP = 2 × (Lv - 1)`、`残りSP = 累計SP - 正規化済み習得ノードの総コスト`。Lv1は0、Lv2は2、Lv30は58、既存上限Lv50では98です。各30ノードをLv30で全取得すると残り28、Lv50では68です。上限レベルは変更していません。レベルアップ後は算式から即座にSPが増え、保存時や再読込時に加算処理は行いません。

90ノードには、固定能力、技別威力／コスト、武器条件、低HP条件、会心、回復、既存属性、状態耐性、ガード・防御・かばう・挑発、能力補正の持続／強さ、星力を組み合わせています。「反撃・制圧」は通常攻撃・盾撃・制圧能力を育てる系統で、自動反撃や新規コマンドは追加していません。未対応の効果型はありません。90個別の実効果を前提のみの状態と比較するテストで確認します。

## 計算順序

1. 既存の素のキャラクター定義にレベル成長を加算。
2. 選択した武器の固定補正を加算。
3. 星脈の固定HP／MP／攻撃／防御／速度を加算。弓限定の速度を判定し、HP依存防御は最終最大HP×割合を切り捨てて加算。
4. 戦闘中の実効能力は既存どおりバフ・デバフを加算重複・上限処理し、火傷の攻撃補正を適用。
5. 物理は実効攻撃力×スキル倍率（双剣の通常攻撃のみヒット数で二等分）。魔法は既存の固定威力×武器の魔法倍率。
6. 星脈の攻撃倍率は `1 + 技別威力 + 属性魔法全般 + 個別属性 + 条件付き低HP物理 + 攻撃必殺技 + 双剣通常攻撃` のうち、その行動に該当する分のみ加算。
7. 従来の防御比、属性相性、防御／ガード、かばう、誓盾、会心倍率と、星脈の直接被ダメージ軽減を乗算。最後に既存どおり四捨五入・最低1（属性無効は0）。かばう係数は入力威力に含む既存順序を維持し、実際の係数をトレースへ記録。
8. 回復は `基礎量 × 武器回復倍率 × (1 + 回復全般 + 技別回復) × (1 + 対象の被回復補正)` を一度四捨五入してから不足HPで制限。生存者のみを対象とします。
9. MPは `max(ceil(元コスト / 2), 元コスト - 全般軽減 - 技別軽減)`。可否判定・UI表示・実消費で同一関数を使用。無効行動は消費しません。MP0の必殺技は0のままです。
10. 星力は既存の獲得条件を満たす時だけ元の獲得量＋星脈加算。通常攻撃は1行動で1回、被ダメージは既存どおり実HP減少ごと、毒・火傷も実減少時のみ。必殺技は従来どおり100消費し、使用分を獲得しません。

条件付き低HPはHP30%以下です。属性強化は既存の属性攻撃魔法のみで、回復や属性付き物理には乗りません。氷＝water（水）、雷＝wind（風）を維持します。守護の陣強化はその技の防御バフだけ、疾風斬の持続強化はその自己バフだけへ適用します。持続は本人の行動終了で減る既存ルールを維持します。

会心率は既存12%＋ノード、上限50%。会心倍率は既存1.5＋ノード、上限2.5。星脈の直接被ダメージ軽減は合計50%上限、ガード・防御の倍率は最低0.1、かばう倍率は最低0.25。星脈由来の状態耐性は80%上限で、既存耐性へ加えて最終0〜100%に制限します。状態付与確率は100%上限、星力の追加分は獲得1回につき最大10、ゲージは従来どおり100です。毒・火傷の割合ダメージには直接軽減を適用しません。

能力は毎回新しい派生コピーへ適用し、再適用時は以前の星脈固定分を除いて置換します。再描画で加算しません。装備画面・編成・本編戦闘は同じレベル→装備→星脈の順序を使います。戦闘開始後はそのスナップショットを使用し、本編の習得IDへ参照を持ちません。

## 保存・既存仕様

- 同じ `astra-chronica:v1` キー・version 2へ `skillTree: {astel: string[], rina: string[], mei: string[]}` を加算的に追加。残りSP・派生能力・戦闘効果は保存しません。
- 旧データは未習得の空配列へ補完し、保存済みのレベルから未使用SPを導出。既存のレベル・経験値・武器・数量・装備・第1章フラグ・試行番号・戦績を保持します。
- 未知ID、重複、別キャラクター、不正な前提、必要レベル不足、SP超過を各人独立に除外します。定義の前提順で正規化し、保存配列の並びでは取得可否を変えません。
- 習得に成功した時だけIDを追加し保存。選択・閲覧・失敗では保存しません。再取得・連打で追加消費しません。振り直しは未実装です。
- レベルによる既存技の解放は維持し、ツリーはそれらを強化します。新スキル・新属性・新状態・ジョブ・自動反撃は追加していません。
- 通常戦闘と第1章の全編成に反映。経験値処理と戦闘結果の一度限りの確定は変更していません。初期レベルでノード取得を要求する敵調整もしていません。
- 保存なし検証画面は本編ツリーを読み書きせず、従来の未装備・未取得の数値で動作します。
- Pages公開設定、依存ライブラリ、PROGRESSION.maxLevelは変更していません。

## UI・スクリーンショット確認

ホーム→「スキルツリー」。3人と3系統を切り替え、ノードをタップすると名称・効果・必要レベル・前提・1SP・最大ランクが表示されます。詳細を確認後「習得する」で確定します。状態は✓習得済み／◇習得可能／🔒未解放を文字と色で区別し、前提線をSVGで表示します。ノードは常に詳細を閲覧でき、習得ボタンだけを理由付きで制限します。

320／390／430pxのタッチ対応Chromiumで、主要操作44px以上・ノードの非重複・横はみ出しなしを自動検証し、次の全画面画像を実際に目視確認しました。育成画面は縦スクロール式です。

- [320px](screenshots/skill-tree-v09-320.png)
- [390px](screenshots/skill-tree-v09-390.png)
- [430px](screenshots/skill-tree-v09-430.png)

ユーザーによる開発中の手動確認は不要です。iPhone実機Safariは実行環境がないため未確認として区別します。

## 検証コマンド

```sh
npm test
npm run build
# 別ターミナルで npm run dev と npm run preview
npm run test:tree
npm run test:browser
npm run test:adventure
npm run test:equipment
npm run test:skills
npm run test:ui
npm run test:foundation
npm run test:modifiers
npm run test:lab
```

`BASE_URL`で本編preview、`UI_TEST_URL`でdevフィクスチャのURLを指定できます。treeテストはスクリーンショットを上記パスへ再生成します。ツリーのない旧状態で既存テストの数値を維持し、90ノードは前提のみの状態との比較で個別効果を確認します。ブラウザでは旧セーブ→習得→保存→再読み込み→第1章の実ダメージ46とMP6→勝利経験値によるSP増加→装備変更→検証画面の保存分離まで操作します。

## 変更ファイル

- `src/data/skill-tree.ts`：90ノード・9系統・効果の型と定義
- `src/skill-tree.ts`：SP・取得・正規化・派生能力・倍率・安全上限
- `src/skill-tree-view.ts`, `src/skill-tree.css`：育成画面とSVG接続線
- `src/battle.ts`, `src/effects.ts`, `src/types.ts`, `src/data/combat.ts`：戦闘・耐性・効果コピー・トレース
- `src/battle-presentation.ts`, `src/battle-view.ts`：実際の軽減後MPの可否・表示
- `src/equipment-view.ts`, `src/main.ts`：装備比較・編成・本編開始時の適用、ホーム導線
- `src/save.ts`：旧セーブ補完とノード正規化
- `tests/skill-tree-v09.test.ts`, `tests/skill-tree-v09.e2e.mjs`：追加の数値・統合・操作検証
- `package.json`, `README.md`, 本書、`docs/screenshots/skill-tree-v09-{320,390,430}.png`：実行方法・仕様・確認画像

## 90ノード一覧

各ノードは1SP・最大ランク1。必要Lv・前提ID・効果は以下の通りです。座標は定義のx=70/210、y=50/150/250/350/450です。

### astel：剣技・攻撃

|ID・名称|Lv|前提ID|効果|
|---|---:|---|---|
|`astel-sword-edge` 剣の基礎|2|なし|攻撃力＋3|
|`astel-sword-strike` 踏み込み|2|なし|通常攻撃威力＋10%|
|`astel-sword-strong` 強撃の極意|5|`astel-sword-edge`|強撃の威力＋15%|
|`astel-sword-breath` 剣士の呼吸|5|`astel-sword-strike`|最大MP＋5|
|`astel-sword-fang` 連牙の研磨|10|`astel-sword-strong`|連牙斬の各ヒット威力＋12%|
|`astel-sword-breaker` 鎧砕き|10|`astel-sword-breath`|破甲撃の威力＋15%|
|`astel-sword-economy` 無駄なき一撃|18|`astel-sword-fang`|強撃の消費MP−1（元コストの半分以上）|
|`astel-sword-resolve` 窮地の剣|18|`astel-sword-breaker`|HP30%以下で物理威力＋20%|
|`astel-sword-finisher` 星断の誓い|30|`astel-sword-economy` / `astel-sword-resolve`|攻撃必殺技威力＋20%|
|`astel-sword-master` 剣心|30|`astel-sword-resolve`|攻撃力＋6|

### astel：速攻・技巧

|ID・名称|Lv|前提ID|効果|
|---|---:|---|---|
|`astel-technique-step` 軽やかな足|2|なし|素早さ＋2|
|`astel-technique-aim` 急所の見極め|2|なし|会心率＋3ポイント（合計上限50%）|
|`astel-technique-bow` 風切りの姿勢|5|`astel-technique-step`|弓装備時のみ素早さ＋3|
|`astel-technique-twins` 双月の型|5|`astel-technique-aim`|双剣の通常攻撃各ヒット威力＋10%|
|`astel-technique-gale` 疾風の刃|10|`astel-technique-bow`|疾風斬の威力＋15%|
|`astel-technique-clarity` 澄んだ視界|10|`astel-technique-twins`|暗闇耐性＋15ポイント|
|`astel-technique-critical` 鋭き閃光|18|`astel-technique-gale`|会心時の倍率＋0.15（上限2.5倍）|
|`astel-technique-flow` 流れる歩法|18|`astel-technique-clarity`|疾風斬の自己補正持続＋1行動|
|`astel-technique-velocity` 星追いの速さ|30|`astel-technique-critical` / `astel-technique-flow`|素早さ＋4|
|`astel-technique-precision` 必中への集中|30|`astel-technique-flow`|会心率＋5ポイント（合計上限50%）|

### astel：勇気・生存

|ID・名称|Lv|前提ID|効果|
|---|---:|---|---|
|`astel-courage-vital` 旅人の体力|2|なし|最大HP＋15|
|`astel-courage-armor` 旅装の備え|2|なし|防御力＋1|
|`astel-courage-poison` 毒に慣れる|5|`astel-courage-vital`|毒耐性＋15ポイント|
|`astel-courage-recover` 仲間への信頼|5|`astel-courage-armor`|受ける回復量＋10%|
|`astel-courage-brace` 身を低く|10|`astel-courage-poison`|防御コマンドの被ダメージ倍率−0.05|
|`astel-courage-sleep` 意志の灯|10|`astel-courage-recover`|睡眠耐性＋15ポイント|
|`astel-courage-endure` 消えない勇気|18|`astel-courage-brace`|HP30%以下で直接被ダメージ10%軽減|
|`astel-courage-burn` 火を越える|18|`astel-courage-sleep`|火傷耐性＋15ポイント|
|`astel-courage-heart` 約束の命脈|30|`astel-courage-endure` / `astel-courage-burn`|最大HP＋30|
|`astel-courage-shelter` 星の護り|30|`astel-courage-burn`|直接被ダメージ5%軽減|

### rina：鉄壁・防御

|ID・名称|Lv|前提ID|効果|
|---|---:|---|---|
|`rina-fortress-plate` 盾の基礎|2|なし|防御力＋2|
|`rina-fortress-vital` 守り手の体力|2|なし|最大HP＋20|
|`rina-fortress-guard` 鉄壁の構え|5|`rina-fortress-plate`|ガードの被ダメージ倍率−0.05|
|`rina-fortress-defend` 堅実な備え|5|`rina-fortress-vital`|防御コマンドの被ダメージ倍率−0.05|
|`rina-fortress-body` 体幹の鍛錬|10|`rina-fortress-guard`|最大HPの1%（切捨て）を防御力へ加算|
|`rina-fortress-freeze` 凍らぬ意志|10|`rina-fortress-defend`|凍結耐性＋15ポイント|
|`rina-fortress-ward` 衝撃を流す|18|`rina-fortress-body`|直接被ダメージ5%軽減|
|`rina-fortress-guard-cost` 盾捌き|18|`rina-fortress-freeze`|ガードの消費MP−1（元コストの半分以上）|
|`rina-fortress-bulwark` 不倒の体|30|`rina-fortress-ward` / `rina-fortress-guard-cost`|最大HP＋35|
|`rina-fortress-last-wall` 最後の壁|30|`rina-fortress-guard-cost`|HP30%以下で直接被ダメージ15%軽減|

### rina：守護・支援

|ID・名称|Lv|前提ID|効果|
|---|---:|---|---|
|`rina-guardian-care` 受け継ぐ灯|2|なし|受ける回復量＋10%|
|`rina-guardian-reserve` 守護の余力|2|なし|最大MP＋5|
|`rina-guardian-cover` 庇護の技|5|`rina-guardian-care`|かばうの被ダメージ倍率−0.10|
|`rina-guardian-taunt` 響く挑発|5|`rina-guardian-reserve`|挑発持続＋1ラウンド|
|`rina-guardian-field` 広がる守護|10|`rina-guardian-cover`|守護の陣の補正持続＋1行動|
|`rina-guardian-field-power` 強き陣形|10|`rina-guardian-taunt`|守護の陣の防御補正＋5ポイント|
|`rina-guardian-cover-cost` 迷いなき庇護|18|`rina-guardian-field`|かばうの消費MP−1（元コストの半分以上）|
|`rina-guardian-silence` 伝わる意志|18|`rina-guardian-field-power`|沈黙耐性＋15ポイント|
|`rina-guardian-rally` 守護の星脈|30|`rina-guardian-cover-cost` / `rina-guardian-silence`|有効な星力獲得ごとに＋2（加算上限10）|
|`rina-guardian-oath` 誓いの持久力|30|`rina-guardian-silence`|最大MP＋8|

### rina：反撃・制圧

|ID・名称|Lv|前提ID|効果|
|---|---:|---|---|
|`rina-control-force` 槍の鍛錬|2|なし|攻撃力＋3|
|`rina-control-step` 踏み返す足|2|なし|素早さ＋1|
|`rina-control-bash` 制圧の盾|5|`rina-control-force`|シールドバッシュの威力＋15%|
|`rina-control-shock` 痺れる衝撃|5|`rina-control-step`|シールドバッシュの麻痺確率＋10ポイント|
|`rina-control-aim` 隙を読む|10|`rina-control-bash`|会心率＋3ポイント（合計上限50%）|
|`rina-control-nerve` 不屈の神経|10|`rina-control-shock`|麻痺耐性＋15ポイント|
|`rina-control-pressure` 押し返す盾|18|`rina-control-aim`|通常攻撃威力＋12%|
|`rina-control-bash-cost` 巧みな盾撃|18|`rina-control-nerve`|シールドバッシュの消費MP−1（元コストの半分以上）|
|`rina-control-courage` 逆境の槍|30|`rina-control-pressure` / `rina-control-bash-cost`|HP30%以下で物理威力＋15%|
|`rina-control-force-master` 守り抜く力|30|`rina-control-bash-cost`|攻撃力＋5|

### mei：元素魔法

|ID・名称|Lv|前提ID|効果|
|---|---:|---|---|
|`mei-elements-fire` 火の理解|2|なし|火属性攻撃魔法威力＋10%|
|`mei-elements-water` 水の理解|2|なし|水属性攻撃魔法（アイス）威力＋10%|
|`mei-elements-wind` 風の理解|5|`mei-elements-fire`|風属性攻撃魔法（サンダー）威力＋10%|
|`mei-elements-magic` 元素の調和|5|`mei-elements-water`|属性攻撃魔法威力＋5%|
|`mei-elements-freeze` 凍結の紋|10|`mei-elements-wind`|アイスの凍結確率＋10ポイント|
|`mei-elements-thunder` 雷鳴の紋|10|`mei-elements-magic`|サンダーの麻痺確率＋10ポイント|
|`mei-elements-fire-cost` 小さな火種|18|`mei-elements-freeze`|ファイアの消費MP−1（元コストの半分以上）|
|`mei-elements-focus` 魔法の急所|18|`mei-elements-thunder`|会心率＋3ポイント（合計上限50%）|
|`mei-elements-resonance` 元素共鳴|30|`mei-elements-fire-cost` / `mei-elements-focus`|属性攻撃魔法威力＋10%|
|`mei-elements-flare` 燃える星灯|30|`mei-elements-focus`|ファイアの威力＋15%|

### mei：治癒・補助

|ID・名称|Lv|前提ID|効果|
|---|---:|---|---|
|`mei-healing-heal` 癒しの基礎|2|なし|ヒール回復量＋10%|
|`mei-healing-vital` 癒し手の体力|2|なし|最大HP＋12|
|`mei-healing-healing` 優しい手|5|`mei-healing-heal`|すべての回復スキルの回復量＋5%|
|`mei-healing-heal-cost` 無駄なき癒し|5|`mei-healing-vital`|ヒールの消費MP−1（元コストの半分以上）|
|`mei-healing-group` 広がる癒し|10|`mei-healing-healing`|グループヒール回復量＋15%|
|`mei-healing-silence` 静寂を越えて|10|`mei-healing-heal-cost`|沈黙耐性＋15ポイント|
|`mei-healing-shelter` 癒し手の守り|18|`mei-healing-group`|直接被ダメージ5%軽減|
|`mei-healing-group-cost` 調和の詠唱|18|`mei-healing-silence`|グループヒールの消費MP−1（元コストの半分以上）|
|`mei-healing-miracle` 奇跡の輝き|30|`mei-healing-shelter` / `mei-healing-group-cost`|星詠みの奇跡の回復量＋20%|
|`mei-healing-mercy` 慈しみの星脈|30|`mei-healing-group-cost`|すべての回復スキルの回復量＋10%|

### mei：星術・魔力

|ID・名称|Lv|前提ID|効果|
|---|---:|---|---|
|`mei-astral-mana` 魔力の器|2|なし|最大MP＋6|
|`mei-astral-star` 星との呼吸|2|なし|有効な星力獲得ごとに＋2（加算上限10）|
|`mei-astral-economy` 節約の詠唱|5|`mei-astral-mana`|MP消費をさらに1軽減（元コストの半分以上）|
|`mei-astral-speed` 詠唱の律動|5|`mei-astral-star`|素早さ＋2|
|`mei-astral-deep-mana` 深き魔力|10|`mei-astral-economy`|最大MP＋8|
|`mei-astral-clarity` 澄んだ精神|10|`mei-astral-speed`|暗闇耐性＋15ポイント|
|`mei-astral-starlight` 星脈の循環|18|`mei-astral-deep-mana`|有効な星力獲得ごとに＋3（加算上限10）|
|`mei-astral-critical` 星の瞬き|18|`mei-astral-clarity`|会心時の倍率＋0.15（上限2.5倍）|
|`mei-astral-vast-mana` 星海の器|30|`mei-astral-starlight` / `mei-astral-critical`|最大MP＋12|
|`mei-astral-wisdom` 星詠みの智慧|30|`mei-astral-critical`|MP消費をさらに1軽減（元コストの半分以上）|

## 今回の実行結果

- 単体：9ファイル・350件成功（既存238件＋追加112件）。90ノード全件を同じ前提だけの状態と比較し、数値または実際の行動差を確認。
- ブラウザ：既存8スクリプト＋treeの全9スクリプト成功。旧セーブ移行、3人・9系統、取得制限・保存・再読込、実ダメージ46／軽減後MP6、第1章経験値からのSP増加、装備共存、検証画面の保存分離を確認。
- スクリーンショット：320/390/430pxの3枚を取得し、実際に画像を開いて表示・非重複・接続線を確認。
- 本番ビルド・git diff --check：成功。従来のPhaserチャンク500kB超警告は継続。
- iPhone実機Safariと最終的な長期育成バランス：未確認。ユーザーへの開発中の手動確認依頼は行いません。
- mainへのマージ・本番公開：未実施。
