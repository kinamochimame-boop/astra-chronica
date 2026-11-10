# v2.5 第17章「星の終着点と最後の約束」

基準main：`c5ccf0bdad9f258c909a0a13203b3a1007a53d36`。作業ブランチ：`feature/v2.5-chapter-seventeen-exploration`。

## 位置づけと引き継ぎ

第16章で得た「終焉記録の宛先」を照合して終着領域へ到達する。記録は結果、予測は条件付きの見通しであり、救済の名で次の者が未来を選ぶ権利を奪わないことが星詠みの約束の核心だったと知る。各地の確定した選択はそのままに、原本の来歴を照合する。過去の選択が保存されていない旧セーブに答えを推測して足さない。

星図・歌・羅針盤、時環・樹海・翼、地下都市・星灯・巡礼・光路、天球儀と鉄道・方舟・星冠・墓標を、選ぶ者へ情報と帰還路を渡す仕組みとして整理する。各人物の結末や古い選択を改変しない。アステルは今の理由で剣を取り、リナは守られる者が選ぶ時間と退路を守り、メイは原文・観測条件・予測を分けて解読する。

ラストジャッジを越えて終着領域の接続権限を得る達成で章を閉じる。最後の敵は終端固定核アナンケ、目的地は「約束の始原」。その固定命令を問い直すため第18章へ出発するところまで。第18章のマップ・戦闘・決着・エンディング・エピローグは未実装／未解放。新しい保存フィールドも作らない。

## NPC

- セリネ：記録の案内人。新規指定名「セレナ」は第4章クリスタリアの管理人と衝突するため改名。第4章のセレナは別人として維持。
- オルフェ：未来の記録を守る番人。帰らぬ者を見送った恐れから道を固定していたが、帰還の返事を受け取る任務へ向き直る。
- ティア：名簿から消えかけた少女。世界の鍵や他者の代役ではなく、今ここで話す一人として扱う。

## 16地点

|地点ID|名称|内容|
|---|---|---|
|`c17-gateway`|終着領域への門|終焉記録の宛先を照合し、戻る道を残して終着領域へ入る。|
|`c17-plaza`|合流する星の広場|案内人セリネと、重なり合う旅の記録を調べる。|
|`c17-library`|未来記録の書庫|過去の記録と未来予測を分け、隠された星路を解読する。|
|`c17-camp`|案内人の待合所|記録されなかった食事の時間にも、選ぶ余地はある。|
|`c17-memory`|消えかけた記憶室|消えかけた少女ティアの声を、勝手な推測で埋めずに聞く。|
|`c17-watch`|番人の監視所|未来を守る番人オルフェは、同じ失敗を繰り返すことを恐れている。|
|`c17-archive`|星詠みの記録殿|各地で選ばれた返事と、星詠みが宛てた約束を照合する。|
|`c17-garden`|選択の庭|誰かの正解を強いる前に、互いの選ぶ時間を守る。|
|`c17-gate`|運命守護機の関門|古い予約を実行する守護機。文字の予兆を読み、防御と回復で備える。|
|`c17-bridge`|分岐する星橋|近道と避難路。選んだ通路を歩き、もう一方を消さずに残す。|
|`c17-sanctuary`|約束の聖域|星図、歌、羅針盤、方舟が伝えてきた共通の問いを読む。|
|`c17-refuge`|帰還の避難所|終着領域にも休める場所を。誰かの決断を急がせない。|
|`c17-tower`|未来を照らす塔|未来が書かれていない余白に、今日の帰還先を書き足す。|
|`c17-observatory`|終着観測所|分かれた道をつなぎ直し、次に選ぶ者へ渡す。|
|`c17-altar`|最後の約束の祭壇|記録の正しさと、人が選ぶ権利を同時に守ると誓う。|
|`c17-heart`|終着領域の心臓|終着の審判者と向き合う。ここは結末ではなく、最後の旅の出発点。|

## 38メインイベントと会話全文

全イベントは既存Chapter定義。`requires`で順次解放し、完了・報酬は既存の完了APIと戦闘serial/resolvedで一度だけ確定する。会話ページ途中の保存は歩行マップの既存world.eventを使い、会話中に戦闘を進めない。ボス勝利でclearも原子的に確定し、後日談の全文は記録装置から再訪できる。

|順|ID|地点|種類|前提|報酬／編成|
|---|---|---|---|---|---|
|1|`c17-arrival`|c17-gateway|story|なし|—|
|2|`c17-gateway-fight`|c17-gateway|battle|c17-arrival|terminal-gate|
|3|`c17-gateway-cache`|c17-gateway|treasure|c17-gateway-fight|{'id': 'potion', 'count': 2}|
|4|`c17-seline`|c17-plaza|story|c17-gateway-cache|—|
|5|`c17-plaza-fight`|c17-plaza|battle|c17-seline|terminal-plaza|
|6|`c17-plaza-record`|c17-plaza|story|c17-plaza-fight|—|
|7|`c17-plaza-cache`|c17-plaza|treasure|c17-plaza-record|{'id': 'potion', 'count': 1}|
|8|`c17-decode`|c17-library|story|c17-plaza-cache|—|
|9|`c17-orphe`|c17-library|story|c17-decode|—|
|10|`c17-library-fight`|c17-library|battle|c17-orphe|terminal-library|
|11|`c17-library-record`|c17-library|story|c17-library-fight|—|
|12|`c17-library-cache`|c17-library|treasure|c17-library-record|{'id': 'potion', 'count': 1}|
|13|`c17-camp-rest`|c17-camp|rest|c17-library-cache|—|
|14|`c17-tia`|c17-memory|story|c17-camp-rest|—|
|15|`c17-memory-fight`|c17-memory|battle|c17-tia|terminal-memory|
|16|`c17-memory-cache`|c17-memory|treasure|c17-memory-fight|{'id': 'ether', 'count': 1}|
|17|`c17-watch-record`|c17-watch|story|c17-memory-cache|—|
|18|`c17-archive-fight`|c17-archive|battle|c17-watch-record|terminal-observatory|
|19|`c17-archive-record`|c17-archive|story|c17-archive-fight|—|
|20|`c17-archive-cache`|c17-archive|treasure|c17-archive-record|{'id': 'ether', 'count': 1}|
|21|`c17-garden-rest`|c17-garden|rest|c17-archive-cache|—|
|22|`c17-guardian`|c17-gate|battle|c17-garden-rest|terminal-guardian|
|23|`c17-branch`|c17-gate|story|c17-guardian|—|
|24|`c17-bridge-record`|c17-bridge|story|c17-branch|promiseward-shield-spear|
|25|`c17-sanctuary-fight`|c17-sanctuary|battle|c17-bridge-record|terminal-sanctuary|
|26|`c17-promise-record`|c17-sanctuary|story|c17-sanctuary-fight|—|
|27|`c17-sanctuary-cache`|c17-sanctuary|treasure|c17-promise-record|{'id': 'potion', 'count': 2}|
|28|`c17-refuge-rest`|c17-refuge|rest|c17-sanctuary-cache|—|
|29|`c17-tower-fight`|c17-tower|battle|c17-refuge-rest|terminal-bridge|
|30|`c17-tower-reading`|c17-tower|story|c17-tower-fight|starpath-sword|
|31|`c17-tower-cache`|c17-tower|treasure|c17-tower-reading|{'id': 'potion', 'count': 1}|
|32|`c17-reconnect`|c17-observatory|story|c17-tower-cache|—|
|33|`c17-seer-record`|c17-observatory|story|c17-reconnect|—|
|34|`c17-promise`|c17-altar|story|c17-seer-record|—|
|35|`c17-inherit`|c17-altar|story|c17-promise|—|
|36|`c17-heart-cache`|c17-heart|treasure|c17-inherit|{'id': 'potion', 'count': 1}|
|37|`c17-last-judge`|c17-heart|boss|c17-heart-cache|destiny-rod|
|38|`c17-clear`|c17-heart|clear|c17-last-judge|—|

### 1. 終焉記録の受取先 (`c17-arrival`)

**メイ**：観測者の原本にあった未送信の宛先が、星脈の合流点と一致した。返事を送る前に、誰が受け取るのか確かめたい。

**リナ**：墓標の帰還灯は残してきたわ。終着点という名でも、私たちの退路まで終わらせない。

**アステル**：終わりの記録の先に、まだ答えを待つ人がいる。三人で確かめに行こう。


### 2. 門を閉ざす残響 (`c17-gateway-fight`)

**セリネ**：私は終着領域の案内人。巡回する残響は古い入域記録を探しています。声をかける前に退路を。

**リナ**：三人の位置を確かめる。敵の予兆を読んで、回復できる余力を残しましょう。


### 3. 門の帰還備蓄 (`c17-gateway-cache`)

**セリネ**：帰る人のための備蓄です。開けた記録は一度だけ残ります。どうか、必要な時に。

**アステル**：誰かが未来のために用意したものだね。僕らも使った先のことを残しておく。


### 4. 案内人の名乗り (`c17-seline`)

**セリネ**：私はセリネ。ここへ届く記録を案内してきました。でも、届かなかった返事まで読んだことはありません。

**メイ**：クリスタリアのセレナとは違う案内人なんだね。歌の一節も、ここでは別々の出典のまま調べたい。

**セリネ**：何から照合しましょう。記録の来歴、それとも今ここにいる人の声でしょうか。


### 5. 広場の記録防衛 (`c17-plaza-fight`)

**メイ**：広場の防衛が、異なる行路を同じ記録へ押し込もうとしている。交わることと、同じになることは違う。

**アステル**：道を一つに決めつけさせない。ここで止めて、通る人の余地を取り戻そう。


### 6. 旅の線が合流する (`c17-plaza-record`)

**メイ**：霧の森の欠片、灰の街の星図、風の峡谷の航路。線がつながっても、それぞれが選んだ理由は消えていない。

**リナ**：クリスタリアの失われた歌も、サハリアの羅針盤も、命令の代わりに問いを渡していた。

**アステル**：あの街で誰が何を選んだかは、手帳の記録のままにしよう。今の僕らが答えを付け替えない。


### 7. 広場の灯火箱 (`c17-plaza-cache`)

**セリネ**：広場に残った灯火を持っていってください。誰の行路にも、暗い区間はありますから。

**メイ**：終着領域でも魔力は有限なんだね。休むことも、進むための選択にしよう。


### 8. 星路の解読 (`c17-decode`)

**メイ**：これは未来の出来事そのものではない。観測した条件から計算した通路図だ。記録解読を始めるよ。

**セリネ**：破線が見えてきました。まだ足場ではありません。固定された星路を、別の側から読めるようになったのです。

**アステル**：見えたから飛び込むんじゃない。渡れる条件を確かめてから選ぼう。


### 9. 未来を守る番人 (`c17-orphe`)

**オルフェ**：私は未来の記録を守る番人オルフェ。かつて自由な分岐の先で、帰らぬ者を見送った。だから道を固定した。

**リナ**：失う怖さは分かる。でも、守られる人が何を望むかも聞いてほしい。

**オルフェ**：ならば答えよ。私が守るべきは、成功した一本の未来か、それとも不確かな人々か。


### 10. 書庫の封鎖反応 (`c17-library-fight`)

**オルフェ**：書庫の封鎖機は私の言葉でも止まらない。確定済みの命令を、繰り返すよう作られている。

**メイ**：予約された攻撃を消せないなら、受け止める準備をする。記録も戦闘も、手順を見落とさない。


### 11. 予測と記録の境界 (`c17-library-record`)

**メイ**：時環の都市で知ったのは、同じ時刻でも返事は変わること。樹海の記憶も、空渡りの翼も、誰かの選択を運んでいた。

**アステル**：地下都市から潮騒の観測所へ届いた星灯も、一本の正解を知らせるためじゃなかった。

**セリネ**：記録は結果。予測は条件付きの見通し。その境界を消した時、固定命令が生まれたのですね。


### 12. 書庫の保守箱 (`c17-library-cache`)

**メイ**：書庫の保守箱には補給品がある。古い術式を読み続ける前に、一度手を休めよう。

**リナ**：疲れを押して答えを急がないこと。それも、仲間の判断を守るためよ。


### 13. 書かれない食卓 (`c17-camp-rest`)

**アステル**：ここには食事の予定しか書かれていない。でも、何を話すかまでは決められていないね。

**セリネ**：私も一緒に座ってよいですか。案内する側でない時間は、久しぶりです。

**リナ**：もちろん。戦闘の前は全快で整えるけれど、休む時間そのものも大切にしましょう。


### 14. 消えかけた少女 (`c17-tia`)

**ティア**：私の名前はティア。でも名簿には、いなかったことにする欄がある。決められた未来には、私の席がないの。

**メイ**：消えかけた記録と、今話しているあなたは同じじゃない。声を確かめずに空白を埋めたりしない。

**ティア**：私のことを、どう残してくれる？ 記録にないからといって、誰かの代わりにはなりたくない。


### 15. 記憶の輪郭を守る (`c17-memory-fight`)

**リナ**：少女のまわりの記録を、敵が引きはがそうとしている。後ろへ下がって、私たちの帰還灯を見ていて。

**アステル**：誰かの代わりに戦うんじゃない。ティアが自分の声で話せる時間を守る。


### 16. 記憶室の備蓄 (`c17-memory-cache`)

**ティア**：この箱、前にも誰かが残してくれた気がする。でも、思い出せない名前を作っては書かない。

**メイ**：うん。分からないことと、今受け取ったものを分けて残そう。それなら次に確かめられる。


### 17. 番人の受領記録 (`c17-watch-record`)

**オルフェ**：失敗した未来を読んでから、私は帰還を許す欄を閉じた。守ろうとして、戻る者まで待てなくなった。

**リナ**：白銀の巡礼者の声も、深森へ届いた光も、誰かを待つ余地から生まれたの。任務にその余地を戻してほしい。

**オルフェ**：命令の出所と、受け取った者の返事を別々に記す。まずは、そこからやり直そう。


### 18. 記録殿の防衛 (`c17-archive-fight`)

**メイ**：記録殿の歯車が、未確定の返事を異常と判定した。沈黙や眠りへの備えを確認して。

**アステル**：未確定だから消すなんて、おかしい。僕らが今出せる答えで止めるよ。


### 19. 誰に宛てた約束か (`c17-archive-record`)

**セリネ**：機巧都市の天球儀は観測を、星脈鉄道と方舟は人と記録の移動を支えた。どれも選ぶ人そのものを運転する装置ではなかった。

**メイ**：星冠が予測を確定命令へ読み替えた痕跡と、墓標の保留された返事がつながった。約束の宛先は、生きて選ぶ人なんだ。

**アステル**：星詠みは救済の手順より先に、未来を選ぶ権利を渡そうとしていたんだね。


### 20. 記録殿の補給箱 (`c17-archive-cache`)

**セリネ**：記録殿の補給箱です。読み終えたからといって、旅が終わるわけではありません。

**リナ**：受け取った記録を持って帰るためにも、今の体を大事にしましょう。


### 21. 選ぶための休息 (`c17-garden-rest`)

**ティア**：選ぶのが怖い時は、今すぐ決めなくてもいい？ みんなの未来を、私一人の答えにしたくない。

**アステル**：もちろん。僕らも迷いながらここまで来た。一緒に考える時間を選んでいいんだ。

**リナ**：何も選べなくなる道を避けるため、今夜はここで休みましょう。


### 22. 運命守護機の関門 (`c17-guardian`)

**オルフェ**：フェイトガーディアンは防衛予約を保持する。行動を止めても予約は消えない。盾を閉じたら、次の波に備えろ。

**メイ**：挑発は単体攻撃に、かばうは実際に受ける人へ。全体予兆には全員の防御と回復を合わせよう。

**リナ**：守ると決めた相手だけでなく、私自身も倒れないようにする。それが三人の道を守ることね。


### 23. 未来分岐の選択 (`c17-branch`)

**メイ**：防衛認証を受領。ここで近道と避難路を分けられる。どちらを先につないでも、最後には両方を残せる。

**リナ**：私は守られる人の代わりに未来を決めない。戻れる幅を作って、選ぶ声を待つわ。

**アステル**：今進む道は僕らで決める。もう一方を失敗として消さずに。


### 24. 片方を消さない橋 (`c17-bridge-record`)

**セリネ**：二つの星路は同じ終着点へ続きます。選ばれなかった道も、別の人が必要にするかもしれません。

**オルフェ**：守護機の合鍵を渡そう。約束の盾槍は、門を閉ざすためだけの武器ではない。

**リナ**：受け取るわ。誰を閉じ込めるかではなく、誰が帰るかを考えて使う。


### 25. 聖域の記録防衛 (`c17-sanctuary-fight`)

**メイ**：聖域の影は、違う返事を一つに畳もうとしている。ここには残された選択が多い。

**アステル**：僕らが歩いた道を理由に、他の道まで消させない。最後まで残せるように戦おう。


### 26. 旅路が守ったもの (`c17-promise-record`)

**メイ**：歌は痛みだけでなく帰る道の名を、羅針盤は自分で方向を選ぶための目印を残した。各地の約束は、その人の言葉のままでここにつながる。

**リナ**：一つの旅のために、町で選ばれたことを無効にしない。守る相手の声を聞き直すのが私の役目。

**アステル**：僕が戦士だから決められた道を進むんじゃない。今、二人と一緒に進みたいから剣を取る。


### 27. 聖域の保管箱 (`c17-sanctuary-cache`)

**セリネ**：聖域の箱には、帰還を願う人々の備えが残っています。もう一つの道にも渡るよう記しておきます。

**メイ**：有限の道具を、無限にあることにはしない。受領記録も一緒に残すね。


### 28. 帰還先を書く夜 (`c17-refuge-rest`)

**リナ**：この避難所は、結論を言えなかった人のためにも開けておこう。守るとは、答えを急がせないことでもある。

**ティア**：だったら私は、明日また話すと約束したい。消えないと断言する代わりに、今日の声を残す。

**アステル**：明日の君に、僕らも返事をしよう。そのために、今日はちゃんと休もう。


### 29. 分岐路の侵食 (`c17-tower-fight`)

**オルフェ**：分岐を閉じる侵食が始まった。私が固定を解いたことを、終端の命令が検知したのだろう。

**アステル**：選ぶのをやめれば戻る、なんて道にはしない。もう一度通れるよう、ここを守り切ろう。


### 30. 余白に残る明日 (`c17-tower-reading`)

**ティア**：名簿の余白に、私が明日会いたい人を書けた。未来の全文はなくても、呼びたい名前がある。

**メイ**：星路の剣はここに保管されていた。行く先を指す武器ではなく、閉ざされた線を開くための剣なんだ。

**アステル**：僕らの答えを次の人の命令にしない。今日選んだ理由と、まだ分からないことも残そう。


### 31. 分岐路の救援箱 (`c17-tower-cache`)

**リナ**：分岐路の救援箱ね。帰る人が使えるよう、開けた記録と残りを確かめましょう。

**セリネ**：最後の観測所でも、誰かがここへ戻ることを想定して記録します。


### 32. 運命再接続 (`c17-reconnect`)

**メイ**：過去の条件、今の返事、次に選ぶ余地。この順で照合する。運命再接続は、答えを一つに固定する操作じゃない。

**オルフェ**：どちらの星路も維持したまま、中枢への通信を開く。誤った順序なら閉じたままやり直せる。

**リナ**：選ばれなかった道にも、帰還灯を残してから進みましょう。

パズル：過去の条件→今の返事→次の人の余地。誤答・リセット・ヒントは既存UIを使用。中断では未完了のまま、再開は安全に入力し直す。

### 33. 星詠みが守った権利 (`c17-seer-record`)

**メイ**：星詠みの原文を読めた。「救いの名で、次の者が未来を選ぶ権利を奪わない」。これが約束の核心だ。

**セリネ**：予測は警告として残し、決断の命令にはしない。墓標の未送信の返事は、その照会がまだ生きていた証拠なのですね。

**ティア**：私は未来の正解を知る鍵じゃない。ここで話す一人として、その約束を受け取りたい。


### 34. 最後の約束 (`c17-promise`)

**オルフェ**：終端固定核アナンケは「約束の始原」にある。失われる危険を避けるため、全ての星路を一つの未来へ封じようとしている。

**リナ**：危険があることは隠さない。そのうえで、守られる人の返事を聞ける道を守るわ。

**アステル**：最後の戦いへ進む前に約束する。僕らが勝っても、次の人の未来を僕らの答えで閉じない。


### 35. 審判への通行記録 (`c17-inherit`)

**セリネ**：終着の審判者ラストジャッジは、私たちの接続資格を試します。最終段階では、先ほど選んだ星路へ攻撃予測を変えるでしょう。

**メイ**：選択の記録は消さず、予兆の名称を読んで備える。勝利だけでなく、生きて先へ進むことを目標にしよう。

**オルフェ**：私はここで、戻る者の記録を受け取る。出発と帰還を、ようやく同じ任務にできる。


### 36. 心臓部の待機備蓄 (`c17-heart-cache`)

**ティア**：心臓部の備蓄を見つけたよ。決戦の前にも、使えるものを確かめる時間があっていいんだね。

**リナ**：ええ。準備をすることも、怖さを認めることも、進む意志と矛盾しないの。


### 37. 終着の審判 (`c17-last-judge`)

**ラストジャッジ**：記録された未来からの逸脱を検出。帰還可能性と、分岐維持の意志を審判する。予兆ののち、星路を照合する。

**アステル**：未来を知ったから従うんじゃない。危険を知ったうえで選べるように、三人でここを越える！

**メイ**：第3段階の星路攻撃も、警告を残してから来る。防御、かばう、回復を忘れないで。


### 38. 最後の旅の出発点 (`c17-clear`)

**ラストジャッジ**：分岐維持、帰還路確保を確認。終着領域の心臓部を開放する。始原への接続権限を、選択する者へ返還。

**セリネ**：終着点は、記録の終わりでした。あなたたちの物語を終わらせる場所ではなかったのですね。

**メイ**：運命のロッドに、照合した条件を保存した。過去の声を消さずに、アナンケの固定命令へ問い直しに行ける。

**リナ**：ティア、オルフェ。ここで待つ人の明日も守りたい。帰ったら、もう一度一緒に食卓を囲みましょう。

**アステル**：「約束の始原」へ行こう。最終決戦はこれからだ。僕らが選んだ道の先を、まだ誰の結末にも決めつけない。


## 運命の星路と計算順序

|段階|確定イベント|地形|
|---|---|---|
|記録固定 fixed|初期|両星路は空隙・通行不可|
|記録解読 decoded|c17-decode|破線と方向が見えるがまだ渡れない|
|未来分岐 branched|c17-branch|confirm＝北の近道、listen＝南の避難路を先行開放|
|運命再接続 reconnected|c17-reconnect|両方を歩ける足場へ統合|

`fatePhase`は確定した第17章イベントだけを参照。`fateRoute`は既存choicesのc17-branchを参照する。選択確定だけでは道を開かず、会話イベント完了で分岐する。読み込み時に正規化済みのchoicesをnormalizeWorldへ渡し、閉じた道の不正座標を既存safePoseで修復する。未知の派生フラグ・不正選択は無視する。第16章の記憶投影などを別段階へ読み替えない。

適用順は既存潮位→記憶投影→第17章星路→既存gate。星路は第17章以外をそのまま返す。描画・MapRuntime・A*・衝突・ミニマップ・座標正規化・復帰は同じactiveMapのgridを使う。必須会話・宝箱・安全路は閉鎖範囲に置かない。低モーションでも破線／実線、北／南、接続済／未接続の文字で識別できる静止Graphics。

## 8マップと接続

全新マップで歩行、衝突、NPC／装置、実報酬付き宝箱、敵シンボル、調査、出入口、ミニマップと次目的を提供。新しい移動・報酬エンジンを重複実装しない。

|ID|地点|条件|接続|
|---|---|---|---|
|`terminal-gate`|c17-gateway|第16章クリア|terminal-plaza（c17-arrival,c17-gateway-fight,c17-gateway-cache）|
|`terminal-plaza`|c17-plaza|c17-arrival, c17-gateway-fight, c17-gateway-cache|terminal-gate / terminal-library（c17-seline,c17-plaza-fight,c17-plaza-record,c17-plaza-cache）|
|`terminal-library`|c17-library|c17-seline, c17-plaza-fight, c17-plaza-record, c17-plaza-cache|terminal-plaza / c17-camp（c17-decode,c17-orphe,c17-library-fight,c17-library-record,c17-library-cache）|
|`terminal-memory`|c17-memory|c17-camp-rest|c17-camp / c17-watch（c17-tia,c17-memory-fight,c17-memory-cache）|
|`terminal-observatory`|c17-archive|c17-watch-record|c17-watch / c17-garden（c17-archive-fight,c17-archive-record,c17-archive-cache）|
|`terminal-sanctuary`|c17-sanctuary|c17-bridge-record|c17-bridge / c17-refuge（c17-sanctuary-fight,c17-promise-record,c17-sanctuary-cache）|
|`terminal-bridge`|c17-tower|c17-refuge-rest|c17-refuge / c17-observatory（c17-tower-fight,c17-tower-reading,c17-tower-cache）|
|`terminal-heart`|c17-heart|c17-promise, c17-inherit|c17-altar|

## 敵とボスの数値

|敵|HP|攻撃|防御|速度|EXP|特徴|
|---|---:|---:|---:|---:|---:|---|
|星路の残響|980|69|40|56|680|風104、暗闇15%・2行動|
|運命の歯車|1080|72|53|44|700|既存archiveGuard、防御、弱点水1.25／土耐性0.75|
|記録喰らい|960|70|41|57|680|通常攻撃に睡眠15%／沈黙20%、2行動|
|終着の守衛|1060|74|49|46|710|既存collapseSoldier、物理予約110|
|未来の幻影|930|70|39|85|690|光103、回避8%|
|星詠みの影|990|71|43|56|710|闇104、速度−15%・2行動|
|運命守護機・フェイトガーディアン|4800|75|54|49|2500|物理重撃108→防御・反撃付き予兆→全体物理124、弱点水1.25／光耐性0.75|
|終着の審判者・ラストジャッジ|6500|73|45|53|3200|HP65%／30%で3段階。弱点風1.25／闇耐性0.5|

全敵の睡眠・凍結耐性は各20%。他の状態耐性・属性倍率は既存の既定値。新属性・新状態は追加しない。

ラストジャッジ第1段階は物理と防壁。第2段階は光／闇の通常魔法112と152の全体予約、暗闇・沈黙各20%・2行動、攻撃−15%・2行動。第3段階は通常魔法132と選択別の予約。北は近道の収束180／近道の交差168（光／闇）、南は避難路の重圧176／避難路の潮流164（土／水）。全体予約は常に文字予兆を出してから次の行動機会で解放する。星力・必殺技・回復・防御・かばうと、単体攻撃への挑発は既存計算を利用。

新ボスの予約時にプロファイルを保持し、睡眠・凍結・フェーズ移行や南北プロファイル変更でも予告済み名称・威力・属性を維持する。旧ボスの予約は従来の処理をそのまま使用。ダメージ式、属性倍率、成長式は変更しない。

## 武器と報酬

- `starpath-sword` 星路の剣：astel／sword。閉ざされた星路を開く剣。攻撃＋23、速度＋3。弓の速さと双剣の二撃に代えて一撃を支える。
- `promiseward-shield-spear` 約束の盾槍：rina／shieldSpear。帰還する者の返事を待つ盾槍。攻撃＋18、防御＋24、HP＋34、ガード軽減＋6%、かばう軽減＋4%。
- `destiny-rod` 運命のロッド：mei／rod。観測条件と返事を分けて残すロッド。攻撃＋21、MP＋24、属性魔法22%強化。回復倍率は追加しない。

剣はc17-tower-reading、盾槍はc17-bridge-record、ロッドは章ボス勝利の報酬。一度のみ付与し、既存inventory/equipmentから実数値へ反映。新武器を必須にせず、Lv50・第16章装備・特定ノードなしで検証する。

## SQ-43〜45

- `sq-lost-star-letter` SQ-43 失われた星の手紙（セリネ）。届かなかった手紙の断片と宛先を照合する。内容を推測せず、残った言葉を届ける。 調査：書庫の手紙の断片（c17-library） → 観測所の受取先（c17-archive）。報告先 c17-camp、報酬 `{"item": "potion", "count": 3}`。
- `sq-guardian-reason` SQ-44 守護者が待つ理由（オルフェ）。番人が帰還を待たなくなった理由を調べ、再び待つ任務へつなぐ。 調査：記憶室の帰還命令（c17-memory） → 監視所の保留返事（c17-watch）。報告先 c17-watch、報酬 `{"experience": 1500}`。
- `sq-choose-tomorrow` SQ-45 明日を選ぶ人々（ティア）。明日の約束を集める。未来の保証ではなく、また会おうとする人々の声を残す。 調査：聖域の明日の予定（c17-sanctuary） → 分岐路の約束の返事（c17-tower）。報告先 c17-refuge、報酬 `{"item": "ether", "count": 3}`。

章クリア前後どちらでも達成可能。報酬上限時はclaimed=falseを維持し、再受領できる。依頼は本編進行条件にしない。

## 重要選択5件

### `c17-seline` 記録の案内を頼む

- `confirm` 出典を照合する → セリネ「来歴を記した資料と、原本を並べて読みましょう。」
- `listen` 今の声を聞く → セリネ「生きている声から確かめます。記録で先回りはしません。」
### `c17-orphe` 番人が守るもの

- `confirm` 帰還の記録を開く → オルフェ「帰還欄を閉ざした判断も残し、これからは返事を受け取ろう。」
- `listen` 恐れた理由を聞く → オルフェ「恐れを消すのではなく、誰かと確かめ直すことから始めよう。」
### `c17-tia` 少女の声を残す

- `confirm` 今日の言葉をそのまま残す → ティア「私が言ったことだけを残してくれるなら、私も読み直せる。」
- `listen` 明日また聞くと約束する → ティア「明日違うことを話してもいいんだね。また会って話したい。」
### `c17-branch` 先につなぐ星路

- `confirm` 近道を先につなぐ → リナ「北の短い星路を開く。南の避難路も、再接続で必ず残すわ。」
- `listen` 避難路を先につなぐ → リナ「南の広い避難路を開く。北の近道も、再接続で閉じずに残すわ。」
### `c17-promise` 最後の旅への約束

- `confirm` 次の人の選択を守る → アステル「僕らの勝利を、次の誰かの命令にしないと誓う。」
- `listen` 違う返事を聞き続ける → アステル「答えが違っても戻って話せる道を、最後まで残そう。」

確定直後に既存recordChoiceと保存を使用し、再訪で上書きしない。全32組で章クリアできる。過去の選択を推測して埋めない。

## 手帳8記事

j17-1〜8。到達したeventIdだけを既存journalForで表示。終焉記録の受取先、セリネ、オルフェ、ティア、記録と予測の境界、選ばれなかった星路、約束の核心、約束の始原への順に解放。未到達情報を先出ししない。

## 共通UIと復帰

navigationTargetの一つの座標を、実マップの「次」・近くの対象ボタンの「次 ▶」・目的地案内・ミニマップで共有。重要装置は分岐形の線画と「装」で区別し、確定済み✓を維持。会話確定で段階が変化した場合は既存所有者／破棄・再入場処理で新しい実効グリッドへ切り替え、操作を再開する。

第17章8枚にも既存returnToContactを適用。勝利時は合法な接触位置、敵が残る撤退・敗北時は到達可能かつ176px以上離れた安全位置、候補なしなら入口へ。旧74枚の復帰方針は維持。新しい位置情報の保存形式は追加しない。

## 互換性

保存キーastra-chronica:v1、version/schema2、3人固定、Lv50、9武器系統、7属性、7状態、星力・必殺技、90ノードを維持。進行・クエスト・選択・手帳は既存定義表への登録で拡張。旧16章の完了・装備・所持品・選択・訪問・会話ページ・鉄道・方舟・Labを維持。第17章の確定情報がない旧保存は未開始となる。

## 検証結果

- `npm test`：**2,102/2,102件、39ファイル成功**。既存1,800件を維持し、302件追加（新章・全マップ284件、準備データの同値性／隔離性12件、接触ナビゲーション5件、既存目的地テストの新章1件）。5秒制限・20乱数種・32選択組・元の期待値を維持。
- `npm run build`：成功。既存Phaserの500kB超チャンク警告は維持。成果物4ファイルのSHA-256は結果JSONに記録。
- Chromium：**76/76ファイル成功**（既存70＋新規6）。第17章は依頼を前／後に完了する2経路で、各38イベント・実戦9勝、計18勝。5選択・3依頼・保存再読込・撤退再戦・旧16章・Lab分離を確認。
- **82マップ×4幅＝328ケース成功**。320／390／430／768pxのタッチ・44px・カメラ・ミニマップ・横スクロール・旧ギミックを回帰。
- 星路4段階×両分岐、偽フラグ無視、壁内座標修復、表示と実効gridの一致を確認。新武器の実測攻撃・魔法倍率・星力を確認。
- 標準ChromiumのWebGLで描画・接触・攻撃ポップアップ・撤退を確認。GLエラー0・context lostなし・新章のpageerrorなし。
- スクリーンショット**216枚**。レイアウト用fixtureと、実際の通し戦闘・章クリアの撮影を分けて保存。

初回に、閉鎖中の星路と必須会話の座標が重なる配置を検出した。必須NPCと宝箱を常設の安全路へ移し、全段階・両分岐で到達できることを回帰確認した。

初回失敗と最終成功は [機械可読結果](test-results/v25.json) に分離。環境再起動・負荷による時間超過を確認し、ケースを削除せず再実行した。第8〜13章の準備だけを元のAPIで一度構築し、各テストへ深い複製を返す方式へ変更。12件で同値性と隔離性を確認した。Vitestは1ワーカー・ファイル直列を維持してthreads方式へ変更し、時間制限は緩和していない。

長時間ブラウザ検証は、任意の `V25_MAP_CHECKPOINT`／`V25_CHAPTER_CHECKPOINT` に検証済み地点・実UIセーブ・実勝利数を記録できる。テストファイルと成果物が一致する場合だけ再開し、完了した検証を重複計上しない。環境中断中の戦闘は安全な直前の完了イベントから再試行する。未設定の通常実行は最初から全件を実行する。従来地点画面へ再開する待機条件1箇所の修正では、会話・勝利の検証式と成果物が変わらないことを確認し、旧／新fingerprintをharnessMigrationに記録して再開記録を移行した。完了イベント・実勝利数を保持し、未完了戦闘は再試行している。

新章の通し戦闘と、`BATTLE_VIRTUAL_CLOCK=1`を指定した旧章の長い通し戦闘では、Playwrightの時計で待ち時間を進めるが、全コマンド・HP・MP・ターン数上限・勝敗・期待値は維持する。旧章の標準実行は実時間のまま。任意時計モードではfastForwardで反復描画を省き、BATTLE_CLOCK_SKIP_FRAMES=0ならrunForで進める。第17章はrunForを使用。経路別の実行指定は標準の両経路を削らず、両方の成功を集計条件とする。既存の連打・演出・標準WebGLの専用テストも通常時計で維持。

小数座標で巡回する敵と歩行グリッド中央の不一致を検出し、同じマスの中央への移動完了後は実際の更新を待って敵位置を読み直すようテスト補助処理を修正した。通常の移動精度と、実戦開始を確認する判定は維持し、5件の回帰を追加した。標準WebGLで巡回敵の古い位置を追い続ける失敗も検出し、経路上の固定通過点まで移動して実接触を待つ方式にした。画面外の敵も一時的にhiddenとなる既存仕様を確認し、診断時の除外判定を訂正した。

## 既知の制約・公開

iPhone Safari実機は未確認。Chromiumタッチ4幅／標準WebGLで自動検証済み。図形・グリッド仮素材を維持。探索色はページ内限定、訪問・重要調査は既存永続記録。既存Phaser500kB超チャンク警告は残る。mainマージ・GitHub Pages公開・PLiCy投稿は行わない。ユーザーへ手動プレイを依頼しない。

## 変更ファイル

- `README.md`
- `docs/CHAPTER_SEVENTEEN_V25.md`
- `docs/screenshots/chapter-seventeen-arrival-dialogue-320.png`
- `docs/screenshots/chapter-seventeen-arrival-dialogue-390.png`
- `docs/screenshots/chapter-seventeen-arrival-dialogue-430.png`
- `docs/screenshots/chapter-seventeen-arrival-dialogue-768.png`
- `docs/screenshots/chapter-seventeen-c17-archive-fight-battle-390.png`
- `docs/screenshots/chapter-seventeen-c17-archive-fight-result-390.png`
- `docs/screenshots/chapter-seventeen-c17-gateway-fight-battle-390.png`
- `docs/screenshots/chapter-seventeen-c17-gateway-fight-result-390.png`
- `docs/screenshots/chapter-seventeen-c17-guardian-battle-390.png`
- `docs/screenshots/chapter-seventeen-c17-guardian-result-390.png`
- `docs/screenshots/chapter-seventeen-c17-last-judge-battle-390.png`
- `docs/screenshots/chapter-seventeen-c17-last-judge-result-390.png`
- `docs/screenshots/chapter-seventeen-c17-library-fight-battle-390.png`
- `docs/screenshots/chapter-seventeen-c17-library-fight-result-390.png`
- `docs/screenshots/chapter-seventeen-c17-memory-fight-battle-390.png`
- `docs/screenshots/chapter-seventeen-c17-memory-fight-result-390.png`
- `docs/screenshots/chapter-seventeen-c17-plaza-fight-battle-390.png`
- `docs/screenshots/chapter-seventeen-c17-plaza-fight-result-390.png`
- `docs/screenshots/chapter-seventeen-c17-sanctuary-fight-battle-390.png`
- `docs/screenshots/chapter-seventeen-c17-sanctuary-fight-result-390.png`
- `docs/screenshots/chapter-seventeen-c17-tower-fight-battle-390.png`
- `docs/screenshots/chapter-seventeen-c17-tower-fight-result-390.png`
- `docs/screenshots/chapter-seventeen-cleared-card-320.png`
- `docs/screenshots/chapter-seventeen-cleared-card-390.png`
- `docs/screenshots/chapter-seventeen-cleared-card-430.png`
- `docs/screenshots/chapter-seventeen-cleared-card-768.png`
- `docs/screenshots/chapter-seventeen-completed-journal-320.png`
- `docs/screenshots/chapter-seventeen-completed-journal-390.png`
- `docs/screenshots/chapter-seventeen-completed-journal-430.png`
- `docs/screenshots/chapter-seventeen-completed-journal-768.png`
- `docs/screenshots/chapter-seventeen-completed-world-320.png`
- `docs/screenshots/chapter-seventeen-completed-world-390.png`
- `docs/screenshots/chapter-seventeen-completed-world-430.png`
- `docs/screenshots/chapter-seventeen-completed-world-768.png`
- `docs/screenshots/chapter-seventeen-enemy-symbol-390.png`
- `docs/screenshots/chapter-seventeen-equipment-390.png`
- `docs/screenshots/chapter-seventeen-judge-ui-320.png`
- `docs/screenshots/chapter-seventeen-judge-ui-390.png`
- `docs/screenshots/chapter-seventeen-judge-ui-430.png`
- `docs/screenshots/chapter-seventeen-judge-ui-768.png`
- `docs/screenshots/chapter-seventeen-map-archive-320.png`
- `docs/screenshots/chapter-seventeen-map-archive-390.png`
- `docs/screenshots/chapter-seventeen-map-archive-430.png`
- `docs/screenshots/chapter-seventeen-map-archive-768.png`
- `docs/screenshots/chapter-seventeen-map-gateway-320.png`
- `docs/screenshots/chapter-seventeen-map-gateway-390.png`
- `docs/screenshots/chapter-seventeen-map-gateway-430.png`
- `docs/screenshots/chapter-seventeen-map-gateway-768.png`
- `docs/screenshots/chapter-seventeen-map-heart-320.png`
- `docs/screenshots/chapter-seventeen-map-heart-390.png`
- `docs/screenshots/chapter-seventeen-map-heart-430.png`
- `docs/screenshots/chapter-seventeen-map-heart-768.png`
- `docs/screenshots/chapter-seventeen-map-library-320.png`
- `docs/screenshots/chapter-seventeen-map-library-390.png`
- `docs/screenshots/chapter-seventeen-map-library-430.png`
- `docs/screenshots/chapter-seventeen-map-library-768.png`
- `docs/screenshots/chapter-seventeen-map-memory-320.png`
- `docs/screenshots/chapter-seventeen-map-memory-390.png`
- `docs/screenshots/chapter-seventeen-map-memory-430.png`
- `docs/screenshots/chapter-seventeen-map-memory-768.png`
- `docs/screenshots/chapter-seventeen-map-plaza-320.png`
- `docs/screenshots/chapter-seventeen-map-plaza-390.png`
- `docs/screenshots/chapter-seventeen-map-plaza-430.png`
- `docs/screenshots/chapter-seventeen-map-plaza-768.png`
- `docs/screenshots/chapter-seventeen-map-sanctuary-320.png`
- `docs/screenshots/chapter-seventeen-map-sanctuary-390.png`
- `docs/screenshots/chapter-seventeen-map-sanctuary-430.png`
- `docs/screenshots/chapter-seventeen-map-sanctuary-768.png`
- `docs/screenshots/chapter-seventeen-map-tower-320.png`
- `docs/screenshots/chapter-seventeen-map-tower-390.png`
- `docs/screenshots/chapter-seventeen-map-tower-430.png`
- `docs/screenshots/chapter-seventeen-map-tower-768.png`
- `docs/screenshots/chapter-seventeen-minimap-320.png`
- `docs/screenshots/chapter-seventeen-minimap-390.png`
- `docs/screenshots/chapter-seventeen-minimap-430.png`
- `docs/screenshots/chapter-seventeen-minimap-768.png`
- `docs/screenshots/chapter-seventeen-new-weapons-action-390.png`
- `docs/screenshots/chapter-seventeen-retreat-return-320.png`
- `docs/screenshots/chapter-seventeen-retreat-return-390.png`
- `docs/screenshots/chapter-seventeen-retreat-return-430.png`
- `docs/screenshots/chapter-seventeen-retreat-return-768.png`
- `docs/screenshots/chapter-seventeen-weapon-destiny-rod-390.png`
- `docs/screenshots/chapter-seventeen-weapon-promiseward-shield-spear-390.png`
- `docs/screenshots/chapter-seventeen-weapon-starpath-sword-390.png`
- `docs/screenshots/chapter-seventeen-webgl-action-390.png`
- `docs/screenshots/exploration-v25-ark-core-390.png`
- `docs/screenshots/exploration-v25-ark-dock-390.png`
- `docs/screenshots/exploration-v25-ark-gateway-390.png`
- `docs/screenshots/exploration-v25-ark-gravity-390.png`
- `docs/screenshots/exploration-v25-ark-hall-390.png`
- `docs/screenshots/exploration-v25-ark-records-390.png`
- `docs/screenshots/exploration-v25-ark-sanctuary-390.png`
- `docs/screenshots/exploration-v25-ark-shore-390.png`
- `docs/screenshots/exploration-v25-celestial-complete-390.png`
- `docs/screenshots/exploration-v25-celestial-partial-390.png`
- `docs/screenshots/exploration-v25-celestial-stopped-390.png`
- `docs/screenshots/exploration-v25-celestial-synchronized-390.png`
- `docs/screenshots/exploration-v25-fate-confirm-branched-320.png`
- `docs/screenshots/exploration-v25-fate-confirm-branched-390.png`
- `docs/screenshots/exploration-v25-fate-confirm-branched-430.png`
- `docs/screenshots/exploration-v25-fate-confirm-branched-768.png`
- `docs/screenshots/exploration-v25-fate-confirm-branched-minimap-320.png`
- `docs/screenshots/exploration-v25-fate-confirm-branched-minimap-390.png`
- `docs/screenshots/exploration-v25-fate-confirm-branched-minimap-430.png`
- `docs/screenshots/exploration-v25-fate-confirm-branched-minimap-768.png`
- `docs/screenshots/exploration-v25-fate-confirm-decoded-320.png`
- `docs/screenshots/exploration-v25-fate-confirm-decoded-390.png`
- `docs/screenshots/exploration-v25-fate-confirm-decoded-430.png`
- `docs/screenshots/exploration-v25-fate-confirm-decoded-768.png`
- `docs/screenshots/exploration-v25-fate-confirm-decoded-minimap-320.png`
- `docs/screenshots/exploration-v25-fate-confirm-decoded-minimap-390.png`
- `docs/screenshots/exploration-v25-fate-confirm-decoded-minimap-430.png`
- `docs/screenshots/exploration-v25-fate-confirm-decoded-minimap-768.png`
- `docs/screenshots/exploration-v25-fate-confirm-fixed-320.png`
- `docs/screenshots/exploration-v25-fate-confirm-fixed-390.png`
- `docs/screenshots/exploration-v25-fate-confirm-fixed-430.png`
- `docs/screenshots/exploration-v25-fate-confirm-fixed-768.png`
- `docs/screenshots/exploration-v25-fate-confirm-fixed-minimap-320.png`
- `docs/screenshots/exploration-v25-fate-confirm-fixed-minimap-390.png`
- `docs/screenshots/exploration-v25-fate-confirm-fixed-minimap-430.png`
- `docs/screenshots/exploration-v25-fate-confirm-fixed-minimap-768.png`
- `docs/screenshots/exploration-v25-fate-confirm-reconnected-320.png`
- `docs/screenshots/exploration-v25-fate-confirm-reconnected-390.png`
- `docs/screenshots/exploration-v25-fate-confirm-reconnected-430.png`
- `docs/screenshots/exploration-v25-fate-confirm-reconnected-768.png`
- `docs/screenshots/exploration-v25-fate-confirm-reconnected-minimap-320.png`
- `docs/screenshots/exploration-v25-fate-confirm-reconnected-minimap-390.png`
- `docs/screenshots/exploration-v25-fate-confirm-reconnected-minimap-430.png`
- `docs/screenshots/exploration-v25-fate-confirm-reconnected-minimap-768.png`
- `docs/screenshots/exploration-v25-fate-listen-branched-320.png`
- `docs/screenshots/exploration-v25-fate-listen-branched-390.png`
- `docs/screenshots/exploration-v25-fate-listen-branched-430.png`
- `docs/screenshots/exploration-v25-fate-listen-branched-768.png`
- `docs/screenshots/exploration-v25-fate-listen-branched-minimap-320.png`
- `docs/screenshots/exploration-v25-fate-listen-branched-minimap-390.png`
- `docs/screenshots/exploration-v25-fate-listen-branched-minimap-430.png`
- `docs/screenshots/exploration-v25-fate-listen-branched-minimap-768.png`
- `docs/screenshots/exploration-v25-fate-listen-decoded-320.png`
- `docs/screenshots/exploration-v25-fate-listen-decoded-390.png`
- `docs/screenshots/exploration-v25-fate-listen-decoded-430.png`
- `docs/screenshots/exploration-v25-fate-listen-decoded-768.png`
- `docs/screenshots/exploration-v25-fate-listen-decoded-minimap-320.png`
- `docs/screenshots/exploration-v25-fate-listen-decoded-minimap-390.png`
- `docs/screenshots/exploration-v25-fate-listen-decoded-minimap-430.png`
- `docs/screenshots/exploration-v25-fate-listen-decoded-minimap-768.png`
- `docs/screenshots/exploration-v25-fate-listen-fixed-320.png`
- `docs/screenshots/exploration-v25-fate-listen-fixed-390.png`
- `docs/screenshots/exploration-v25-fate-listen-fixed-430.png`
- `docs/screenshots/exploration-v25-fate-listen-fixed-768.png`
- `docs/screenshots/exploration-v25-fate-listen-fixed-minimap-320.png`
- `docs/screenshots/exploration-v25-fate-listen-fixed-minimap-390.png`
- `docs/screenshots/exploration-v25-fate-listen-fixed-minimap-430.png`
- `docs/screenshots/exploration-v25-fate-listen-fixed-minimap-768.png`
- `docs/screenshots/exploration-v25-fate-listen-reconnected-320.png`
- `docs/screenshots/exploration-v25-fate-listen-reconnected-390.png`
- `docs/screenshots/exploration-v25-fate-listen-reconnected-430.png`
- `docs/screenshots/exploration-v25-fate-listen-reconnected-768.png`
- `docs/screenshots/exploration-v25-fate-listen-reconnected-minimap-320.png`
- `docs/screenshots/exploration-v25-fate-listen-reconnected-minimap-390.png`
- `docs/screenshots/exploration-v25-fate-listen-reconnected-minimap-430.png`
- `docs/screenshots/exploration-v25-fate-listen-reconnected-minimap-768.png`
- `docs/screenshots/exploration-v25-gear-city-detail-390.png`
- `docs/screenshots/exploration-v25-gear-core-detail-390.png`
- `docs/screenshots/exploration-v25-gear-lower-detail-390.png`
- `docs/screenshots/exploration-v25-gear-market-detail-390.png`
- `docs/screenshots/exploration-v25-gear-observatory-detail-390.png`
- `docs/screenshots/exploration-v25-gear-station-320.png`
- `docs/screenshots/exploration-v25-gear-station-390.png`
- `docs/screenshots/exploration-v25-gear-station-430.png`
- `docs/screenshots/exploration-v25-gear-station-768.png`
- `docs/screenshots/exploration-v25-gear-station-detail-390.png`
- `docs/screenshots/exploration-v25-gear-workshop-detail-390.png`
- `docs/screenshots/exploration-v25-grave-core-390.png`
- `docs/screenshots/exploration-v25-grave-field-390.png`
- `docs/screenshots/exploration-v25-grave-gate-390.png`
- `docs/screenshots/exploration-v25-grave-memory-390.png`
- `docs/screenshots/exploration-v25-grave-observatory-390.png`
- `docs/screenshots/exploration-v25-grave-ruins-390.png`
- `docs/screenshots/exploration-v25-grave-sanctuary-390.png`
- `docs/screenshots/exploration-v25-grave-tower-390.png`
- `docs/screenshots/exploration-v25-gravity-controlled-390.png`
- `docs/screenshots/exploration-v25-gravity-normal-390.png`
- `docs/screenshots/exploration-v25-gravity-reversed-390.png`
- `docs/screenshots/exploration-v25-gravity-stable-390.png`
- `docs/screenshots/exploration-v25-grove-garden-390.png`
- `docs/screenshots/exploration-v25-grove-village-390.png`
- `docs/screenshots/exploration-v25-high-reload-390.png`
- `docs/screenshots/exploration-v25-light-dark-390.png`
- `docs/screenshots/exploration-v25-light-glimmer-390.png`
- `docs/screenshots/exploration-v25-light-linked-390.png`
- `docs/screenshots/exploration-v25-light-renewed-390.png`
- `docs/screenshots/exploration-v25-low-reload-390.png`
- `docs/screenshots/exploration-v25-old-twelve-npc-390.png`
- `docs/screenshots/exploration-v25-old-twelve-road-390.png`
- `docs/screenshots/exploration-v25-resonance-calm-390.png`
- `docs/screenshots/exploration-v25-resonance-faint-390.png`
- `docs/screenshots/exploration-v25-resonance-linked-390.png`
- `docs/screenshots/exploration-v25-resonance-silent-390.png`
- `docs/screenshots/exploration-v25-sky-tower-390.png`
- `docs/screenshots/exploration-v25-sky-town-390.png`
- `docs/screenshots/exploration-v25-terminal-bridge-390.png`
- `docs/screenshots/exploration-v25-terminal-gate-390.png`
- `docs/screenshots/exploration-v25-terminal-heart-390.png`
- `docs/screenshots/exploration-v25-terminal-library-390.png`
- `docs/screenshots/exploration-v25-terminal-memory-390.png`
- `docs/screenshots/exploration-v25-terminal-observatory-390.png`
- `docs/screenshots/exploration-v25-terminal-plaza-390.png`
- `docs/screenshots/exploration-v25-terminal-sanctuary-390.png`
- `docs/screenshots/exploration-v25-void-archive-390.png`
- `docs/screenshots/exploration-v25-void-core-390.png`
- `docs/screenshots/exploration-v25-void-corridor-390.png`
- `docs/screenshots/exploration-v25-void-court-390.png`
- `docs/screenshots/exploration-v25-void-garden-390.png`
- `docs/screenshots/exploration-v25-void-gate-390.png`
- `docs/screenshots/exploration-v25-void-mirror-390.png`
- `docs/screenshots/exploration-v25-void-sanctum-390.png`
- `docs/test-results/v25.json`
- `package.json`
- `src/battle.ts`
- `src/chapter-selection.ts`
- `src/data/chapter-one.ts`
- `src/data/chapter-seventeen-enemies.ts`
- `src/data/chapter-seventeen.ts`
- `src/data/dialogue-choices.ts`
- `src/data/encounters.ts`
- `src/data/enemy-scripts.ts`
- `src/data/journal.ts`
- `src/data/side-quests.ts`
- `src/data/weapons.ts`
- `src/exploration/access.ts`
- `src/exploration/active-map.ts`
- `src/exploration/chapter-seventeen-maps.ts`
- `src/exploration/exploration-save.ts`
- `src/exploration/exploration.css`
- `src/exploration/fate-effects.ts`
- `src/exploration/fate-path.ts`
- `src/exploration/map-art.ts`
- `src/exploration/map-data.ts`
- `src/exploration/map-view.ts`
- `src/exploration/navigation.ts`
- `src/exploration/transit.ts`
- `src/exploration/transitions.ts`
- `src/exploration/types.ts`
- `src/main.ts`
- `src/save.ts`
- `src/types.ts`
- `tests/browser-clock.mjs`
- `tests/browser-suite.mjs`
- `tests/capture-v25.mjs`
- `tests/chapter-eight-v16.e2e.mjs`
- `tests/chapter-eight-v16.test.ts`
- `tests/chapter-eleven-v19.e2e.mjs`
- `tests/chapter-eleven-v19.test.ts`
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
- `tests/chapter-seventeen-combat-v25.test.ts`
- `tests/chapter-seventeen-equipment.e2e.mjs`
- `tests/chapter-seventeen-fixture.mjs`
- `tests/chapter-seventeen-ui.e2e.mjs`
- `tests/chapter-seventeen-v25.e2e.mjs`
- `tests/chapter-seventeen-v25.test.ts`
- `tests/chapter-six-v14.e2e.mjs`
- `tests/chapter-six-v14.test.ts`
- `tests/chapter-sixteen-v24.e2e.mjs`
- `tests/chapter-sixteen-v24.test.ts`
- `tests/chapter-ten-v18.e2e.mjs`
- `tests/chapter-ten-v18.test.ts`
- `tests/chapter-thirteen-v21.e2e.mjs`
- `tests/chapter-thirteen-v21.test.ts`
- `tests/chapter-three-v11.e2e.mjs`
- `tests/chapter-twelve-v20.e2e.mjs`
- `tests/chapter-twelve-v20.test.ts`
- `tests/chapter-two-v10.e2e.mjs`
- `tests/chapter-two-v10.test.ts`
- `tests/exploration-v19.smoke.mjs`
- `tests/exploration-v20.smoke.mjs`
- `tests/exploration-v21.smoke.mjs`
- `tests/exploration-v22.smoke.mjs`
- `tests/exploration-v23.smoke.mjs`
- `tests/exploration-v23.test.ts`
- `tests/exploration-v24.smoke.mjs`
- `tests/exploration-v24.test.ts`
- `tests/exploration-v25.e2e.mjs`
- `tests/exploration-v25.smoke.mjs`
- `tests/exploration-v25.test.ts`
- `tests/fate-path-v25.e2e.mjs`
- `tests/legacy-fixtures-v25.ts`
- `tests/map-driver-v15.d.mts`
- `tests/map-driver-v15.mjs`
- `tests/map-driver-v25.test.ts`
- `tests/v25-helpers.ts`

## スクリーンショット

<details><summary>全画像と画面幅</summary>

- [chapter-seventeen-arrival-dialogue-320.png](screenshots/chapter-seventeen-arrival-dialogue-320.png)
- [chapter-seventeen-arrival-dialogue-390.png](screenshots/chapter-seventeen-arrival-dialogue-390.png)
- [chapter-seventeen-arrival-dialogue-430.png](screenshots/chapter-seventeen-arrival-dialogue-430.png)
- [chapter-seventeen-arrival-dialogue-768.png](screenshots/chapter-seventeen-arrival-dialogue-768.png)
- [chapter-seventeen-c17-archive-fight-battle-390.png](screenshots/chapter-seventeen-c17-archive-fight-battle-390.png)
- [chapter-seventeen-c17-archive-fight-result-390.png](screenshots/chapter-seventeen-c17-archive-fight-result-390.png)
- [chapter-seventeen-c17-gateway-fight-battle-390.png](screenshots/chapter-seventeen-c17-gateway-fight-battle-390.png)
- [chapter-seventeen-c17-gateway-fight-result-390.png](screenshots/chapter-seventeen-c17-gateway-fight-result-390.png)
- [chapter-seventeen-c17-guardian-battle-390.png](screenshots/chapter-seventeen-c17-guardian-battle-390.png)
- [chapter-seventeen-c17-guardian-result-390.png](screenshots/chapter-seventeen-c17-guardian-result-390.png)
- [chapter-seventeen-c17-last-judge-battle-390.png](screenshots/chapter-seventeen-c17-last-judge-battle-390.png)
- [chapter-seventeen-c17-last-judge-result-390.png](screenshots/chapter-seventeen-c17-last-judge-result-390.png)
- [chapter-seventeen-c17-library-fight-battle-390.png](screenshots/chapter-seventeen-c17-library-fight-battle-390.png)
- [chapter-seventeen-c17-library-fight-result-390.png](screenshots/chapter-seventeen-c17-library-fight-result-390.png)
- [chapter-seventeen-c17-memory-fight-battle-390.png](screenshots/chapter-seventeen-c17-memory-fight-battle-390.png)
- [chapter-seventeen-c17-memory-fight-result-390.png](screenshots/chapter-seventeen-c17-memory-fight-result-390.png)
- [chapter-seventeen-c17-plaza-fight-battle-390.png](screenshots/chapter-seventeen-c17-plaza-fight-battle-390.png)
- [chapter-seventeen-c17-plaza-fight-result-390.png](screenshots/chapter-seventeen-c17-plaza-fight-result-390.png)
- [chapter-seventeen-c17-sanctuary-fight-battle-390.png](screenshots/chapter-seventeen-c17-sanctuary-fight-battle-390.png)
- [chapter-seventeen-c17-sanctuary-fight-result-390.png](screenshots/chapter-seventeen-c17-sanctuary-fight-result-390.png)
- [chapter-seventeen-c17-tower-fight-battle-390.png](screenshots/chapter-seventeen-c17-tower-fight-battle-390.png)
- [chapter-seventeen-c17-tower-fight-result-390.png](screenshots/chapter-seventeen-c17-tower-fight-result-390.png)
- [chapter-seventeen-cleared-card-320.png](screenshots/chapter-seventeen-cleared-card-320.png)
- [chapter-seventeen-cleared-card-390.png](screenshots/chapter-seventeen-cleared-card-390.png)
- [chapter-seventeen-cleared-card-430.png](screenshots/chapter-seventeen-cleared-card-430.png)
- [chapter-seventeen-cleared-card-768.png](screenshots/chapter-seventeen-cleared-card-768.png)
- [chapter-seventeen-completed-journal-320.png](screenshots/chapter-seventeen-completed-journal-320.png)
- [chapter-seventeen-completed-journal-390.png](screenshots/chapter-seventeen-completed-journal-390.png)
- [chapter-seventeen-completed-journal-430.png](screenshots/chapter-seventeen-completed-journal-430.png)
- [chapter-seventeen-completed-journal-768.png](screenshots/chapter-seventeen-completed-journal-768.png)
- [chapter-seventeen-completed-world-320.png](screenshots/chapter-seventeen-completed-world-320.png)
- [chapter-seventeen-completed-world-390.png](screenshots/chapter-seventeen-completed-world-390.png)
- [chapter-seventeen-completed-world-430.png](screenshots/chapter-seventeen-completed-world-430.png)
- [chapter-seventeen-completed-world-768.png](screenshots/chapter-seventeen-completed-world-768.png)
- [chapter-seventeen-enemy-symbol-390.png](screenshots/chapter-seventeen-enemy-symbol-390.png)
- [chapter-seventeen-equipment-390.png](screenshots/chapter-seventeen-equipment-390.png)
- [chapter-seventeen-judge-ui-320.png](screenshots/chapter-seventeen-judge-ui-320.png)
- [chapter-seventeen-judge-ui-390.png](screenshots/chapter-seventeen-judge-ui-390.png)
- [chapter-seventeen-judge-ui-430.png](screenshots/chapter-seventeen-judge-ui-430.png)
- [chapter-seventeen-judge-ui-768.png](screenshots/chapter-seventeen-judge-ui-768.png)
- [chapter-seventeen-map-archive-320.png](screenshots/chapter-seventeen-map-archive-320.png)
- [chapter-seventeen-map-archive-390.png](screenshots/chapter-seventeen-map-archive-390.png)
- [chapter-seventeen-map-archive-430.png](screenshots/chapter-seventeen-map-archive-430.png)
- [chapter-seventeen-map-archive-768.png](screenshots/chapter-seventeen-map-archive-768.png)
- [chapter-seventeen-map-gateway-320.png](screenshots/chapter-seventeen-map-gateway-320.png)
- [chapter-seventeen-map-gateway-390.png](screenshots/chapter-seventeen-map-gateway-390.png)
- [chapter-seventeen-map-gateway-430.png](screenshots/chapter-seventeen-map-gateway-430.png)
- [chapter-seventeen-map-gateway-768.png](screenshots/chapter-seventeen-map-gateway-768.png)
- [chapter-seventeen-map-heart-320.png](screenshots/chapter-seventeen-map-heart-320.png)
- [chapter-seventeen-map-heart-390.png](screenshots/chapter-seventeen-map-heart-390.png)
- [chapter-seventeen-map-heart-430.png](screenshots/chapter-seventeen-map-heart-430.png)
- [chapter-seventeen-map-heart-768.png](screenshots/chapter-seventeen-map-heart-768.png)
- [chapter-seventeen-map-library-320.png](screenshots/chapter-seventeen-map-library-320.png)
- [chapter-seventeen-map-library-390.png](screenshots/chapter-seventeen-map-library-390.png)
- [chapter-seventeen-map-library-430.png](screenshots/chapter-seventeen-map-library-430.png)
- [chapter-seventeen-map-library-768.png](screenshots/chapter-seventeen-map-library-768.png)
- [chapter-seventeen-map-memory-320.png](screenshots/chapter-seventeen-map-memory-320.png)
- [chapter-seventeen-map-memory-390.png](screenshots/chapter-seventeen-map-memory-390.png)
- [chapter-seventeen-map-memory-430.png](screenshots/chapter-seventeen-map-memory-430.png)
- [chapter-seventeen-map-memory-768.png](screenshots/chapter-seventeen-map-memory-768.png)
- [chapter-seventeen-map-plaza-320.png](screenshots/chapter-seventeen-map-plaza-320.png)
- [chapter-seventeen-map-plaza-390.png](screenshots/chapter-seventeen-map-plaza-390.png)
- [chapter-seventeen-map-plaza-430.png](screenshots/chapter-seventeen-map-plaza-430.png)
- [chapter-seventeen-map-plaza-768.png](screenshots/chapter-seventeen-map-plaza-768.png)
- [chapter-seventeen-map-sanctuary-320.png](screenshots/chapter-seventeen-map-sanctuary-320.png)
- [chapter-seventeen-map-sanctuary-390.png](screenshots/chapter-seventeen-map-sanctuary-390.png)
- [chapter-seventeen-map-sanctuary-430.png](screenshots/chapter-seventeen-map-sanctuary-430.png)
- [chapter-seventeen-map-sanctuary-768.png](screenshots/chapter-seventeen-map-sanctuary-768.png)
- [chapter-seventeen-map-tower-320.png](screenshots/chapter-seventeen-map-tower-320.png)
- [chapter-seventeen-map-tower-390.png](screenshots/chapter-seventeen-map-tower-390.png)
- [chapter-seventeen-map-tower-430.png](screenshots/chapter-seventeen-map-tower-430.png)
- [chapter-seventeen-map-tower-768.png](screenshots/chapter-seventeen-map-tower-768.png)
- [chapter-seventeen-minimap-320.png](screenshots/chapter-seventeen-minimap-320.png)
- [chapter-seventeen-minimap-390.png](screenshots/chapter-seventeen-minimap-390.png)
- [chapter-seventeen-minimap-430.png](screenshots/chapter-seventeen-minimap-430.png)
- [chapter-seventeen-minimap-768.png](screenshots/chapter-seventeen-minimap-768.png)
- [chapter-seventeen-new-weapons-action-390.png](screenshots/chapter-seventeen-new-weapons-action-390.png)
- [chapter-seventeen-retreat-return-320.png](screenshots/chapter-seventeen-retreat-return-320.png)
- [chapter-seventeen-retreat-return-390.png](screenshots/chapter-seventeen-retreat-return-390.png)
- [chapter-seventeen-retreat-return-430.png](screenshots/chapter-seventeen-retreat-return-430.png)
- [chapter-seventeen-retreat-return-768.png](screenshots/chapter-seventeen-retreat-return-768.png)
- [chapter-seventeen-weapon-destiny-rod-390.png](screenshots/chapter-seventeen-weapon-destiny-rod-390.png)
- [chapter-seventeen-weapon-promiseward-shield-spear-390.png](screenshots/chapter-seventeen-weapon-promiseward-shield-spear-390.png)
- [chapter-seventeen-weapon-starpath-sword-390.png](screenshots/chapter-seventeen-weapon-starpath-sword-390.png)
- [chapter-seventeen-webgl-action-390.png](screenshots/chapter-seventeen-webgl-action-390.png)
- [exploration-v25-ark-core-390.png](screenshots/exploration-v25-ark-core-390.png)
- [exploration-v25-ark-dock-390.png](screenshots/exploration-v25-ark-dock-390.png)
- [exploration-v25-ark-gateway-390.png](screenshots/exploration-v25-ark-gateway-390.png)
- [exploration-v25-ark-gravity-390.png](screenshots/exploration-v25-ark-gravity-390.png)
- [exploration-v25-ark-hall-390.png](screenshots/exploration-v25-ark-hall-390.png)
- [exploration-v25-ark-records-390.png](screenshots/exploration-v25-ark-records-390.png)
- [exploration-v25-ark-sanctuary-390.png](screenshots/exploration-v25-ark-sanctuary-390.png)
- [exploration-v25-ark-shore-390.png](screenshots/exploration-v25-ark-shore-390.png)
- [exploration-v25-celestial-complete-390.png](screenshots/exploration-v25-celestial-complete-390.png)
- [exploration-v25-celestial-partial-390.png](screenshots/exploration-v25-celestial-partial-390.png)
- [exploration-v25-celestial-stopped-390.png](screenshots/exploration-v25-celestial-stopped-390.png)
- [exploration-v25-celestial-synchronized-390.png](screenshots/exploration-v25-celestial-synchronized-390.png)
- [exploration-v25-fate-confirm-branched-320.png](screenshots/exploration-v25-fate-confirm-branched-320.png)
- [exploration-v25-fate-confirm-branched-390.png](screenshots/exploration-v25-fate-confirm-branched-390.png)
- [exploration-v25-fate-confirm-branched-430.png](screenshots/exploration-v25-fate-confirm-branched-430.png)
- [exploration-v25-fate-confirm-branched-768.png](screenshots/exploration-v25-fate-confirm-branched-768.png)
- [exploration-v25-fate-confirm-branched-minimap-320.png](screenshots/exploration-v25-fate-confirm-branched-minimap-320.png)
- [exploration-v25-fate-confirm-branched-minimap-390.png](screenshots/exploration-v25-fate-confirm-branched-minimap-390.png)
- [exploration-v25-fate-confirm-branched-minimap-430.png](screenshots/exploration-v25-fate-confirm-branched-minimap-430.png)
- [exploration-v25-fate-confirm-branched-minimap-768.png](screenshots/exploration-v25-fate-confirm-branched-minimap-768.png)
- [exploration-v25-fate-confirm-decoded-320.png](screenshots/exploration-v25-fate-confirm-decoded-320.png)
- [exploration-v25-fate-confirm-decoded-390.png](screenshots/exploration-v25-fate-confirm-decoded-390.png)
- [exploration-v25-fate-confirm-decoded-430.png](screenshots/exploration-v25-fate-confirm-decoded-430.png)
- [exploration-v25-fate-confirm-decoded-768.png](screenshots/exploration-v25-fate-confirm-decoded-768.png)
- [exploration-v25-fate-confirm-decoded-minimap-320.png](screenshots/exploration-v25-fate-confirm-decoded-minimap-320.png)
- [exploration-v25-fate-confirm-decoded-minimap-390.png](screenshots/exploration-v25-fate-confirm-decoded-minimap-390.png)
- [exploration-v25-fate-confirm-decoded-minimap-430.png](screenshots/exploration-v25-fate-confirm-decoded-minimap-430.png)
- [exploration-v25-fate-confirm-decoded-minimap-768.png](screenshots/exploration-v25-fate-confirm-decoded-minimap-768.png)
- [exploration-v25-fate-confirm-fixed-320.png](screenshots/exploration-v25-fate-confirm-fixed-320.png)
- [exploration-v25-fate-confirm-fixed-390.png](screenshots/exploration-v25-fate-confirm-fixed-390.png)
- [exploration-v25-fate-confirm-fixed-430.png](screenshots/exploration-v25-fate-confirm-fixed-430.png)
- [exploration-v25-fate-confirm-fixed-768.png](screenshots/exploration-v25-fate-confirm-fixed-768.png)
- [exploration-v25-fate-confirm-fixed-minimap-320.png](screenshots/exploration-v25-fate-confirm-fixed-minimap-320.png)
- [exploration-v25-fate-confirm-fixed-minimap-390.png](screenshots/exploration-v25-fate-confirm-fixed-minimap-390.png)
- [exploration-v25-fate-confirm-fixed-minimap-430.png](screenshots/exploration-v25-fate-confirm-fixed-minimap-430.png)
- [exploration-v25-fate-confirm-fixed-minimap-768.png](screenshots/exploration-v25-fate-confirm-fixed-minimap-768.png)
- [exploration-v25-fate-confirm-reconnected-320.png](screenshots/exploration-v25-fate-confirm-reconnected-320.png)
- [exploration-v25-fate-confirm-reconnected-390.png](screenshots/exploration-v25-fate-confirm-reconnected-390.png)
- [exploration-v25-fate-confirm-reconnected-430.png](screenshots/exploration-v25-fate-confirm-reconnected-430.png)
- [exploration-v25-fate-confirm-reconnected-768.png](screenshots/exploration-v25-fate-confirm-reconnected-768.png)
- [exploration-v25-fate-confirm-reconnected-minimap-320.png](screenshots/exploration-v25-fate-confirm-reconnected-minimap-320.png)
- [exploration-v25-fate-confirm-reconnected-minimap-390.png](screenshots/exploration-v25-fate-confirm-reconnected-minimap-390.png)
- [exploration-v25-fate-confirm-reconnected-minimap-430.png](screenshots/exploration-v25-fate-confirm-reconnected-minimap-430.png)
- [exploration-v25-fate-confirm-reconnected-minimap-768.png](screenshots/exploration-v25-fate-confirm-reconnected-minimap-768.png)
- [exploration-v25-fate-listen-branched-320.png](screenshots/exploration-v25-fate-listen-branched-320.png)
- [exploration-v25-fate-listen-branched-390.png](screenshots/exploration-v25-fate-listen-branched-390.png)
- [exploration-v25-fate-listen-branched-430.png](screenshots/exploration-v25-fate-listen-branched-430.png)
- [exploration-v25-fate-listen-branched-768.png](screenshots/exploration-v25-fate-listen-branched-768.png)
- [exploration-v25-fate-listen-branched-minimap-320.png](screenshots/exploration-v25-fate-listen-branched-minimap-320.png)
- [exploration-v25-fate-listen-branched-minimap-390.png](screenshots/exploration-v25-fate-listen-branched-minimap-390.png)
- [exploration-v25-fate-listen-branched-minimap-430.png](screenshots/exploration-v25-fate-listen-branched-minimap-430.png)
- [exploration-v25-fate-listen-branched-minimap-768.png](screenshots/exploration-v25-fate-listen-branched-minimap-768.png)
- [exploration-v25-fate-listen-decoded-320.png](screenshots/exploration-v25-fate-listen-decoded-320.png)
- [exploration-v25-fate-listen-decoded-390.png](screenshots/exploration-v25-fate-listen-decoded-390.png)
- [exploration-v25-fate-listen-decoded-430.png](screenshots/exploration-v25-fate-listen-decoded-430.png)
- [exploration-v25-fate-listen-decoded-768.png](screenshots/exploration-v25-fate-listen-decoded-768.png)
- [exploration-v25-fate-listen-decoded-minimap-320.png](screenshots/exploration-v25-fate-listen-decoded-minimap-320.png)
- [exploration-v25-fate-listen-decoded-minimap-390.png](screenshots/exploration-v25-fate-listen-decoded-minimap-390.png)
- [exploration-v25-fate-listen-decoded-minimap-430.png](screenshots/exploration-v25-fate-listen-decoded-minimap-430.png)
- [exploration-v25-fate-listen-decoded-minimap-768.png](screenshots/exploration-v25-fate-listen-decoded-minimap-768.png)
- [exploration-v25-fate-listen-fixed-320.png](screenshots/exploration-v25-fate-listen-fixed-320.png)
- [exploration-v25-fate-listen-fixed-390.png](screenshots/exploration-v25-fate-listen-fixed-390.png)
- [exploration-v25-fate-listen-fixed-430.png](screenshots/exploration-v25-fate-listen-fixed-430.png)
- [exploration-v25-fate-listen-fixed-768.png](screenshots/exploration-v25-fate-listen-fixed-768.png)
- [exploration-v25-fate-listen-fixed-minimap-320.png](screenshots/exploration-v25-fate-listen-fixed-minimap-320.png)
- [exploration-v25-fate-listen-fixed-minimap-390.png](screenshots/exploration-v25-fate-listen-fixed-minimap-390.png)
- [exploration-v25-fate-listen-fixed-minimap-430.png](screenshots/exploration-v25-fate-listen-fixed-minimap-430.png)
- [exploration-v25-fate-listen-fixed-minimap-768.png](screenshots/exploration-v25-fate-listen-fixed-minimap-768.png)
- [exploration-v25-fate-listen-reconnected-320.png](screenshots/exploration-v25-fate-listen-reconnected-320.png)
- [exploration-v25-fate-listen-reconnected-390.png](screenshots/exploration-v25-fate-listen-reconnected-390.png)
- [exploration-v25-fate-listen-reconnected-430.png](screenshots/exploration-v25-fate-listen-reconnected-430.png)
- [exploration-v25-fate-listen-reconnected-768.png](screenshots/exploration-v25-fate-listen-reconnected-768.png)
- [exploration-v25-fate-listen-reconnected-minimap-320.png](screenshots/exploration-v25-fate-listen-reconnected-minimap-320.png)
- [exploration-v25-fate-listen-reconnected-minimap-390.png](screenshots/exploration-v25-fate-listen-reconnected-minimap-390.png)
- [exploration-v25-fate-listen-reconnected-minimap-430.png](screenshots/exploration-v25-fate-listen-reconnected-minimap-430.png)
- [exploration-v25-fate-listen-reconnected-minimap-768.png](screenshots/exploration-v25-fate-listen-reconnected-minimap-768.png)
- [exploration-v25-gear-city-detail-390.png](screenshots/exploration-v25-gear-city-detail-390.png)
- [exploration-v25-gear-core-detail-390.png](screenshots/exploration-v25-gear-core-detail-390.png)
- [exploration-v25-gear-lower-detail-390.png](screenshots/exploration-v25-gear-lower-detail-390.png)
- [exploration-v25-gear-market-detail-390.png](screenshots/exploration-v25-gear-market-detail-390.png)
- [exploration-v25-gear-observatory-detail-390.png](screenshots/exploration-v25-gear-observatory-detail-390.png)
- [exploration-v25-gear-station-320.png](screenshots/exploration-v25-gear-station-320.png)
- [exploration-v25-gear-station-390.png](screenshots/exploration-v25-gear-station-390.png)
- [exploration-v25-gear-station-430.png](screenshots/exploration-v25-gear-station-430.png)
- [exploration-v25-gear-station-768.png](screenshots/exploration-v25-gear-station-768.png)
- [exploration-v25-gear-station-detail-390.png](screenshots/exploration-v25-gear-station-detail-390.png)
- [exploration-v25-gear-workshop-detail-390.png](screenshots/exploration-v25-gear-workshop-detail-390.png)
- [exploration-v25-grave-core-390.png](screenshots/exploration-v25-grave-core-390.png)
- [exploration-v25-grave-field-390.png](screenshots/exploration-v25-grave-field-390.png)
- [exploration-v25-grave-gate-390.png](screenshots/exploration-v25-grave-gate-390.png)
- [exploration-v25-grave-memory-390.png](screenshots/exploration-v25-grave-memory-390.png)
- [exploration-v25-grave-observatory-390.png](screenshots/exploration-v25-grave-observatory-390.png)
- [exploration-v25-grave-ruins-390.png](screenshots/exploration-v25-grave-ruins-390.png)
- [exploration-v25-grave-sanctuary-390.png](screenshots/exploration-v25-grave-sanctuary-390.png)
- [exploration-v25-grave-tower-390.png](screenshots/exploration-v25-grave-tower-390.png)
- [exploration-v25-gravity-controlled-390.png](screenshots/exploration-v25-gravity-controlled-390.png)
- [exploration-v25-gravity-normal-390.png](screenshots/exploration-v25-gravity-normal-390.png)
- [exploration-v25-gravity-reversed-390.png](screenshots/exploration-v25-gravity-reversed-390.png)
- [exploration-v25-gravity-stable-390.png](screenshots/exploration-v25-gravity-stable-390.png)
- [exploration-v25-grove-garden-390.png](screenshots/exploration-v25-grove-garden-390.png)
- [exploration-v25-grove-village-390.png](screenshots/exploration-v25-grove-village-390.png)
- [exploration-v25-high-reload-390.png](screenshots/exploration-v25-high-reload-390.png)
- [exploration-v25-light-dark-390.png](screenshots/exploration-v25-light-dark-390.png)
- [exploration-v25-light-glimmer-390.png](screenshots/exploration-v25-light-glimmer-390.png)
- [exploration-v25-light-linked-390.png](screenshots/exploration-v25-light-linked-390.png)
- [exploration-v25-light-renewed-390.png](screenshots/exploration-v25-light-renewed-390.png)
- [exploration-v25-low-reload-390.png](screenshots/exploration-v25-low-reload-390.png)
- [exploration-v25-old-twelve-npc-390.png](screenshots/exploration-v25-old-twelve-npc-390.png)
- [exploration-v25-old-twelve-road-390.png](screenshots/exploration-v25-old-twelve-road-390.png)
- [exploration-v25-resonance-calm-390.png](screenshots/exploration-v25-resonance-calm-390.png)
- [exploration-v25-resonance-faint-390.png](screenshots/exploration-v25-resonance-faint-390.png)
- [exploration-v25-resonance-linked-390.png](screenshots/exploration-v25-resonance-linked-390.png)
- [exploration-v25-resonance-silent-390.png](screenshots/exploration-v25-resonance-silent-390.png)
- [exploration-v25-sky-tower-390.png](screenshots/exploration-v25-sky-tower-390.png)
- [exploration-v25-sky-town-390.png](screenshots/exploration-v25-sky-town-390.png)
- [exploration-v25-terminal-bridge-390.png](screenshots/exploration-v25-terminal-bridge-390.png)
- [exploration-v25-terminal-gate-390.png](screenshots/exploration-v25-terminal-gate-390.png)
- [exploration-v25-terminal-heart-390.png](screenshots/exploration-v25-terminal-heart-390.png)
- [exploration-v25-terminal-library-390.png](screenshots/exploration-v25-terminal-library-390.png)
- [exploration-v25-terminal-memory-390.png](screenshots/exploration-v25-terminal-memory-390.png)
- [exploration-v25-terminal-observatory-390.png](screenshots/exploration-v25-terminal-observatory-390.png)
- [exploration-v25-terminal-plaza-390.png](screenshots/exploration-v25-terminal-plaza-390.png)
- [exploration-v25-terminal-sanctuary-390.png](screenshots/exploration-v25-terminal-sanctuary-390.png)
- [exploration-v25-void-archive-390.png](screenshots/exploration-v25-void-archive-390.png)
- [exploration-v25-void-core-390.png](screenshots/exploration-v25-void-core-390.png)
- [exploration-v25-void-corridor-390.png](screenshots/exploration-v25-void-corridor-390.png)
- [exploration-v25-void-court-390.png](screenshots/exploration-v25-void-court-390.png)
- [exploration-v25-void-garden-390.png](screenshots/exploration-v25-void-garden-390.png)
- [exploration-v25-void-gate-390.png](screenshots/exploration-v25-void-gate-390.png)
- [exploration-v25-void-mirror-390.png](screenshots/exploration-v25-void-mirror-390.png)
- [exploration-v25-void-sanctum-390.png](screenshots/exploration-v25-void-sanctum-390.png)

</details>
