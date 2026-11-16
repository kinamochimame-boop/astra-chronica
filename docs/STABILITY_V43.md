# v4.3 画面ライフサイクルと長時間プレイの安定性

## 基準と調査

origin/mainをfetchし、指定どおり`0f1e4d2d05ccb322c8c0bdf793dd7dd7138c9e52`を確認。`feature/v43-stability-polish`で作業する。README、package、main、ViewSession、ATB表示・選択・エンジン、探索runtime／view／ManagedExplorationGame、装備・星脈・growthTransaction、保存・バックアップ、関連CSS・CIとv3.9〜v4.2設計書を調査した。共有Stageの保持を調べるためvisuals.tsとPhaser 3.90の実装も確認した。

本番変更はmain、map-view、managed-game、save-backup-view、visuals、新規view-frame-loopの6ファイル。全18章・161マップ・109戦闘・452イベント・90ノード・9武器系統の定義と数値、ATB／EP／CT／AI／成長・装備の計算は変更しない。新しい永続フィールド・外部保存・クラウド同期は追加しない。

## 再現した問題と修正

### 離脱済み探索画面

探索メニューの閉じるonclickを保持し、ホームへ移動してから呼ぶと、resumeが次画面にない要素を参照し`Cannot read properties of null (reading 'open')`となった。4幅で再現。終了済みのpause／resume／hide／flush／resize／イベント終了などを無効化し、遅れて呼ばれたObserverや終了処理がDOM・保存に触れないようにした。既存disposeの冪等性とManagedExplorationGameの役割は維持する。

### ページ保存復帰で戦闘が初期化される

従来はpagehideで戦闘をdisposeし、persistedなpageshowでlaunchBattleを再実行していた。操作不能ではなく、開始待ち・時間・HP・EP・予約などが新規戦闘へ戻る挙動だった。実際のPageTransitionEventで4幅とも状態再初期化を確認した。

新規ViewFrameLoopは描画コールバックだけを所有し、resume／suspend／disposeを冪等にする。世代番号で取消済みコールバックを拒否する。visibilitychangeとpersistedなpagehideではRAFと未確定の結果表示タイマーを止め、pageshowで同じ戦闘インスタンスを再開する。復帰最初の経過時間は0。HP・EP・予約・CT・手動一時停止・速度は保持する。非persistedな実際の離脱は従来どおり破棄し、再読込は既存のpending／safePose復旧を使う。報酬serialは変更しない。

結果表示待ちを中断した場合も、既存の勝敗から表示を一度だけ再予約する。戦闘計算・予約・EP返却は既存エンジンの処理を使い、独自の資源計算を追加しない。

### 離脱後のバックアップ読込

ファイル選択ハンドラーを保存して画面離脱後に実行すると、無効な画面でもFile.textを1回開始していた。非同期完了時のガードは既存のまま維持し、開始時にも所有画面の接続・終了状態を確認する。戻る処理も一度だけ実行する。保存形式・厳格な検証・明示確認・失敗時復元は変更しない。

### 探索Gameの保持とwheelリスナー

窓・documentのリスナー数が一定でも、canvasのwheel登録は再利用のたびに増えていた。Phaser 3.90のMouseManager.stopListenersにwheelの解除がないことを実装と実ブラウザで確認。10往復で1→11、90往復で1→91。GC後も旧ManagedExplorationGameが91個残った。

ManagedExplorationGameで対象canvasと当該Gameのwheelハンドラーを保持し、DESTROY時にその登録だけを解除する。Phaser本体、他のGameの登録、タッチ判定・速度・経路は変更しない。現在のGameのwheel動作は残す。共有Stageはアプリの所有物として維持する。

### 共有Stageの古いキャラと入力対象

Stage.paintのchildren.removeAll(true)は破棄ではなかった。Phaser.DisplayListのtrueは「削除コールバックを省略する」の意味で、旧キャラがInputPluginに残る。30往復で入力リスト9→105、90往復で297件まで増加した。ヒープスナップショットでも旧Container／Graphicsの増加を確認した。

表示リストの複製から各GameObject.destroy()を呼び、入れ子の図形・入力・イベントを正式に破棄する。さらにPhaserの追加・削除キューは削除→追加の順なので、同一フレームの再生成で破棄済み対象を後から追加しないよう、再描画前後に既存PRE_UPDATEの入力・タイマー整理を行う。UPDATEは発行せず、deltaは0。ATBやゲーム内時間は進めない。倍率0.65・大型ボス補正、座標、サイズ、ヒット領域、演出計算は変更しない。

## 計測方法と証跡

`docs/screenshots/v43/`に画像・計測JSONを保存する。変更前は別worktreeのmain0f1e4d2（アプリSHA256 `ad9e6f057c92f4e264130f3f82ad10d75fb054cfc701dabb671285b9e4e332d4`）を使用。320/375/390/430×844px、タッチ・reduced-motionで同じ共通シナリオを実行する。進行・報酬の注入はしない。

実時間の各幅：ホーム30往復、装備・星脈・依頼各20往復、手帳・記録・コンパス各8往復、HUD・地図・メニュー各30開閉、未読イベント30開閉、可視状態の模擬20往復。初回地図SVGとイベント内容を生成するための校正1回を別記録し、その後30回で増えないことを確認する。初回SVGの8要素や、近づいたNPCのボタン増加を漏れと誤認しない。開始・終了は同じ位置に揃える。

追加でChromiumのCDP frozen/activeを20回実行し、実際にrendererの実行を止めて復帰させる。これはiPhone OSのバックグラウンド実機試験とは区別する。幅4種類×高さ568/667/844の12条件で探索・装備・星脈・戦闘・dialogを確認する。

戦闘は別の新規データと仮想時計で各2勝。保存復帰20回は休止中の描画を進めず時刻だけ送るfastForwardを使い、同じ状態が維持されることを厳密比較する。30秒をrunForで描画し続ける初期診断も実施したが、通常のBFCache中は描画されないため最終試験は既存の仮想時計基盤と同じ時刻送り方式にした。期限・assertionは緩めていない。通常攻撃で実際に稼いだEPによる有償予約の保存復帰・取消返却、勝利時1回の保存失敗とその後の一度だけの保存も追加検証する。

### 読み取り専用の保持数プローブ

devサーバーで通常UIを90往復し、0/30/60/90時点の値を採取。CDPのqueryObjectsで実際に読み込まれたクラスのインスタンスと共有Stageの入力対象を調べる。リスナーはwindow・document・body・canvasを取得する。Inspectorのハンドルを解放し、計測自体がGameを保持しないようにする。GC後のヒープはRuntime.getHeapUsage。未処理Promiseの一般的な総数は取得できずnull／未計測とする。unhandledrejection数と、離脱後に完了するファイルPromise1件は別に検証する。

ヒープの初期増加にはJIT・初期化が含まれるため、それだけを漏れと判断しない。実測の生値と、Game・入力対象・リスナーの保持数を併せて評価する。CPU改善率やSafariでのメモリ改善率は主張しない。

### 保持数の実測（390px・90往復）

|項目|変更前|変更後|
|---|---:|---:|
|GC後の探索Game保持数|91|1|
|共有Stageの入力リスト|297|3|
|canvasのwheel登録|91|1|
|GC後ヒープ（30往復→90往復）|13,496,972→16,144,340 B|12,088,764→12,117,712 B|

変更後は0/30/60/90の全時点でGame1・入力3・wheel1。ヒープ総量の初期暖機分は除外せず生値をJSONに記録し、暖機後の値も併記した。これを機種一般の改善率やCPU性能として扱わない。

## 保存・互換性

`astra-chronica:v1`／progress version:2、バックアップgame／formatVersion:1／createdAt／progressを維持。2MiB、危険キー、深さ・ノード制限、上書き前保護、確認、復元は変更しない。world／safePose／survey／builds／trackedQuestId／quests／choices／装備／SP／経験値／戦績を保持。育成編集は既存growthTransactionを使用する。保存失敗を成功扱いにせず、role=alertと再保存後の結果を確認する。

## 検証状況

npm ciと本番ビルド成功。v4.3専用Vitestは16件。全体は62ファイル・3,604件すべて成功。CI基盤自己検証15件も成功。専用ブラウザ耐久試験は4幅すべて成功。各工程の所要時間には80msの待機など試験用の安定化待ちが含まれ、純粋な入力遅延やCPU処理時間ではない。ブラウザは従来101ファイルを維持し、新規1ファイルで102。

全件CIは既存の26分割＋単体＋バランス＋集計の29ジョブを再利用。耐久試験を独立した早期ワーカーに置く。全18章・109勝・452イベントの通常UI通し、18回再読込、全161マップ×既存4幅644ケース、26,160組のバランス比較・2,160武器計測・AI比較を維持する。通常UIと保存なしfixtureを区別する。

比較画像は40枚（4幅のホーム・保存復帰戦闘各前後＋12 viewport条件の前後）。既存201枚を含む241枚をSHA256・寸法で照合する。大きな成果物は最終証跡（従来157枚）とv43-stability-screenshots（v4.2の44枚＋v4.3の40枚）へ分割する。

最終CIは本書へ実測結果を追記したもの、生ログ・全章のハッシュ連鎖・画像を成果物に保存する。未実行・失敗・タイムアウトを成功件数へ含めない。変更一覧はCHANGED_FILES_V43.txt。

## 制約

iPhone Safari実機、VoiceOver、実際のOSの背景化・ツールバー変化、ファイル共有は未確認。Chromiumのタッチ・CDP操作と区別する。未処理Promiseの一般的な総数は未計測。既存のバンドルサイズ警告がある。mainへのマージ・Pages本番公開は行わない。
