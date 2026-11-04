# アストラクロニカ 〜星詠みの遺した約束〜

Vite + TypeScript + Phaser 3による、日本語・縦画面の3人パーティRPGの最小プロトタイプです。有料サービスや外部画像・Webフォントへの依存はありません。

## 起動

Node.js 22.12以降を推奨します。

```sh
npm install
npm run dev
```

表示されたURLをPCブラウザで開きます。同一LANのiPhoneから試す場合は、開発PCのLAN IPとポート（例 `http://192.168.1.10:5173`）を使用してください。

```sh
npm test           # 戦闘・セーブの自動テスト
npm run build      # 型検査と本番ビルド（dist/）
npm run preview    # ビルド結果の確認
```

ブラウザ操作テストは、別ターミナルで `npm run dev` を起動したうえで `npm run test:browser` を実行してください。Chromiumが必要です（既定 `/usr/bin/chromium`、`CHROMIUM_PATH` で変更可能）。タイトルから勝利、撤退による敗北、保存復元、320/390/1280px幅を確認します。iPhone実機テストの代替にはなりません。

## 遊び方と実装範囲

1. タイトルの「ゲーム開始」でホームへ進みます。
2. 「戦闘開始」で霧の森へ。味方と敵のカードを選び、「攻撃」を押します。
3. 生存している味方は1ターンに各1回攻撃できます。全員行動すると敵が反撃します。
4. HP 0の敵は撃破され、攻撃しなくなります。敵全滅で勝利、味方全滅で敗北です。
5. 勝敗画面からホームへ戻るか再挑戦できます。撤退も敗北として記録します。戦闘開始時にHPは全回復します。

アステル（戦士）、リナ（タンク）、メイ（魔法攻撃）の役割は固定です。攻撃力・HPはそれぞれ異なります。今回は通常攻撃のみで、魔法スキル、武器切り替え、ジョブ・転職はありません。「編成」はキャラクターと対応武器を閲覧する仮画面です。物語は導入と戦闘後の短い文章のみで、長編シナリオは未実装です。

localStorageの `astra-chronica:v1` に開始状態・戦闘回数・勝利回数を保存します。リロードするとタイトルから再開し、戦闘途中の状態は保存しません。保存拒否・破損データでも起動でき、保存不可時は画面に通知します。ブラウザのデータ消去で進行も削除されます。

## 構成・画像の差し替え

- `src/battle.ts`：表示から独立した戦闘処理・キャラクターデータ
- `src/save.ts`：バージョン付き進行保存
- `src/main.ts`：日本語DOM UI、画面遷移、戦闘操作
- `src/visuals.ts`：Phaserによる背景・2頭身SD図形
- `src/style.css`：青と金の縦画面レイアウト、タッチボタン、safe area対応

正式画像を `public/assets/` に置き、`Stage.preload()` を追加して `this.load.image('astel', import.meta.env.BASE_URL + 'assets/astel.png')` のように読み込み、対象Unitの `texture` にキーを設定してください。キーが未設定、または画像が読み込まれていない場合は図形で表示されます。UIはDOMボタンでキーボード操作にも対応します。

## GitHub Pages

相対ベースパス設定済みで、`dist/` は任意の静的ホスティングに配置できます。GitHubの Settings → Pages → Source を **GitHub Actions** に設定してください。付属ワークフローはmainへのpushでテスト・ビルド後にPagesへデプロイします。PRではテストとビルドのみ実施します。初回はPagesの有効化が必要です。この実装作業では公開操作は行っていません。

iPhone実機での検証は別途必要です。音声、正式画像、装備変更、レベルアップ、戦闘中断セーブは未実装です。

## 公開作業とiPhoneでの確認

1. work → mainのPull Requestのテスト・ビルドを確認し、マージします。
2. リポジトリの Settings → Pages → Build and deployment → Source で **GitHub Actions** を選択します。
3. Actions → Validate and deploy Pages を開きます。mainの実行がなければ Run workflow → Branch: main → Run workflow を選びます。
4. build・deployが両方成功し、Settings → Pages に公開先が表示されることを確認します。承認待ちの場合はActionsの Review deployments で github-pages を承認します。
5. Pages画面の Visit site を開いて動作確認し、そのURLをiPhoneのSafariで開きます。

このリポジトリは確認時点で非公開です。非公開リポジトリからPagesを利用するには対応するGitHubプランが必要です。Pages画面でプラン制限が表示された場合は、対応プランを利用するか、所有者がソースコード公開の可否を判断して公開リポジトリに変更する必要があります。リポジトリの公開範囲は自動変更しません。Pagesの公開サイトはソースリポジトリとは別に一般公開される場合があります。

iPhoneでは縦画面で「ゲーム開始」→「戦闘開始」→味方と敵をタップ→「攻撃」を繰り返して勝利画面まで確認してください。下の操作ボタンが見えない場合は縦にスクロールできます。ホームに戻りページを再読み込みし、勝利数が保持されることも確認してください。撤退すると敗北画面を確認できます。

本番ビルドでタッチ操作を再検証する場合は `npm run build` → `npm run preview` の後、別ターミナルで `BASE_URL=http://localhost:4173 npm run test:browser` を実行します。自動テストはタッチ対応Chromiumでの確認で、iPhone実機Safariの検証は含みません。
