import type {Chapter} from './chapter-one';
export const chapterSeventeen:Chapter={
  "id": "chapter-17",
  "requiresChapterId": "chapter-16",
  "name": "星の終着点と最後の約束",
  "setting": "星の終着領域",
  "preview": "第18章予告：終端固定核アナンケが待つ「約束の始原」へ。記録は消さず、選び直す権利を取り戻す。最終決戦・結末・エピローグは未実装です。",
  "locations": [
    {
      "id": "c17-gateway",
      "name": "終着領域への門",
      "icon": "◇",
      "description": "終焉記録の宛先を照合し、戻る道を残して終着領域へ入る。"
    },
    {
      "id": "c17-plaza",
      "name": "合流する星の広場",
      "icon": "✧",
      "description": "案内人セリネと、重なり合う旅の記録を調べる。"
    },
    {
      "id": "c17-library",
      "name": "未来記録の書庫",
      "icon": "◇",
      "description": "過去の記録と未来予測を分け、隠された星路を解読する。"
    },
    {
      "id": "c17-camp",
      "name": "案内人の待合所",
      "icon": "✧",
      "description": "記録されなかった食事の時間にも、選ぶ余地はある。"
    },
    {
      "id": "c17-memory",
      "name": "消えかけた記憶室",
      "icon": "◇",
      "description": "消えかけた少女ティアの声を、勝手な推測で埋めずに聞く。"
    },
    {
      "id": "c17-watch",
      "name": "番人の監視所",
      "icon": "✧",
      "description": "未来を守る番人オルフェは、同じ失敗を繰り返すことを恐れている。"
    },
    {
      "id": "c17-archive",
      "name": "星詠みの記録殿",
      "icon": "◇",
      "description": "各地で選ばれた返事と、星詠みが宛てた約束を照合する。"
    },
    {
      "id": "c17-garden",
      "name": "選択の庭",
      "icon": "✧",
      "description": "誰かの正解を強いる前に、互いの選ぶ時間を守る。"
    },
    {
      "id": "c17-gate",
      "name": "運命守護機の関門",
      "icon": "◇",
      "description": "古い予約を実行する守護機。文字の予兆を読み、防御と回復で備える。"
    },
    {
      "id": "c17-bridge",
      "name": "分岐する星橋",
      "icon": "✧",
      "description": "近道と避難路。選んだ通路を歩き、もう一方を消さずに残す。"
    },
    {
      "id": "c17-sanctuary",
      "name": "約束の聖域",
      "icon": "◇",
      "description": "星図、歌、羅針盤、方舟が伝えてきた共通の問いを読む。"
    },
    {
      "id": "c17-refuge",
      "name": "帰還の避難所",
      "icon": "✧",
      "description": "終着領域にも休める場所を。誰かの決断を急がせない。"
    },
    {
      "id": "c17-tower",
      "name": "未来を照らす塔",
      "icon": "◇",
      "description": "未来が書かれていない余白に、今日の帰還先を書き足す。"
    },
    {
      "id": "c17-observatory",
      "name": "終着観測所",
      "icon": "✧",
      "description": "分かれた道をつなぎ直し、次に選ぶ者へ渡す。"
    },
    {
      "id": "c17-altar",
      "name": "最後の約束の祭壇",
      "icon": "◇",
      "description": "記録の正しさと、人が選ぶ権利を同時に守ると誓う。"
    },
    {
      "id": "c17-heart",
      "name": "終着領域の心臓",
      "icon": "✧",
      "description": "終着の審判者と向き合う。ここは結末ではなく、最後の旅の出発点。"
    }
  ],
  "events": [
    {
      "id": "c17-arrival",
      "locationId": "c17-gateway",
      "kind": "story",
      "name": "終焉記録の受取先",
      "requires": [],
      "pages": [
        {
          "speaker": "メイ",
          "text": "観測者の原本にあった未送信の宛先が、星脈の合流点と一致した。返事を送る前に、誰が受け取るのか確かめたい。"
        },
        {
          "speaker": "リナ",
          "text": "墓標の帰還灯は残してきたわ。終着点という名でも、私たちの退路まで終わらせない。"
        },
        {
          "speaker": "アステル",
          "text": "終わりの記録の先に、まだ答えを待つ人がいる。三人で確かめに行こう。"
        }
      ]
    },
    {
      "id": "c17-gateway-fight",
      "locationId": "c17-gateway",
      "kind": "battle",
      "name": "門を閉ざす残響",
      "requires": [
        "c17-arrival"
      ],
      "pages": [
        {
          "speaker": "セリネ",
          "text": "私は終着領域の案内人。巡回する残響は古い入域記録を探しています。声をかける前に退路を。"
        },
        {
          "speaker": "リナ",
          "text": "三人の位置を確かめる。敵の予兆を読んで、回復できる余力を残しましょう。"
        }
      ],
      "encounter": "terminal-gate"
    },
    {
      "id": "c17-gateway-cache",
      "locationId": "c17-gateway",
      "kind": "treasure",
      "name": "門の帰還備蓄",
      "requires": [
        "c17-gateway-fight"
      ],
      "pages": [
        {
          "speaker": "セリネ",
          "text": "帰る人のための備蓄です。開けた記録は一度だけ残ります。どうか、必要な時に。"
        },
        {
          "speaker": "アステル",
          "text": "誰かが未来のために用意したものだね。僕らも使った先のことを残しておく。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 2
      }
    },
    {
      "id": "c17-seline",
      "locationId": "c17-plaza",
      "kind": "story",
      "name": "案内人の名乗り",
      "requires": [
        "c17-gateway-cache"
      ],
      "pages": [
        {
          "speaker": "セリネ",
          "text": "私はセリネ。ここへ届く記録を案内してきました。でも、届かなかった返事まで読んだことはありません。"
        },
        {
          "speaker": "メイ",
          "text": "クリスタリアのセレナとは違う案内人なんだね。歌の一節も、ここでは別々の出典のまま調べたい。"
        },
        {
          "speaker": "セリネ",
          "text": "何から照合しましょう。記録の来歴、それとも今ここにいる人の声でしょうか。"
        }
      ],
      "choiceId": "c17-seline"
    },
    {
      "id": "c17-plaza-fight",
      "locationId": "c17-plaza",
      "kind": "battle",
      "name": "広場の記録防衛",
      "requires": [
        "c17-seline"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "広場の防衛が、異なる行路を同じ記録へ押し込もうとしている。交わることと、同じになることは違う。"
        },
        {
          "speaker": "アステル",
          "text": "道を一つに決めつけさせない。ここで止めて、通る人の余地を取り戻そう。"
        }
      ],
      "encounter": "terminal-plaza"
    },
    {
      "id": "c17-plaza-record",
      "locationId": "c17-plaza",
      "kind": "story",
      "name": "旅の線が合流する",
      "requires": [
        "c17-plaza-fight"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "霧の森の欠片、灰の街の星図、風の峡谷の航路。線がつながっても、それぞれが選んだ理由は消えていない。"
        },
        {
          "speaker": "リナ",
          "text": "クリスタリアの失われた歌も、サハリアの羅針盤も、命令の代わりに問いを渡していた。"
        },
        {
          "speaker": "アステル",
          "text": "あの街で誰が何を選んだかは、手帳の記録のままにしよう。今の僕らが答えを付け替えない。"
        }
      ]
    },
    {
      "id": "c17-plaza-cache",
      "locationId": "c17-plaza",
      "kind": "treasure",
      "name": "広場の灯火箱",
      "requires": [
        "c17-plaza-record"
      ],
      "pages": [
        {
          "speaker": "セリネ",
          "text": "広場に残った灯火を持っていってください。誰の行路にも、暗い区間はありますから。"
        },
        {
          "speaker": "メイ",
          "text": "終着領域でも魔力は有限なんだね。休むことも、進むための選択にしよう。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 1
      }
    },
    {
      "id": "c17-decode",
      "locationId": "c17-library",
      "kind": "story",
      "name": "星路の解読",
      "requires": [
        "c17-plaza-cache"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "これは未来の出来事そのものではない。観測した条件から計算した通路図だ。記録解読を始めるよ。"
        },
        {
          "speaker": "セリネ",
          "text": "破線が見えてきました。まだ足場ではありません。固定された星路を、別の側から読めるようになったのです。"
        },
        {
          "speaker": "アステル",
          "text": "見えたから飛び込むんじゃない。渡れる条件を確かめてから選ぼう。"
        }
      ]
    },
    {
      "id": "c17-orphe",
      "locationId": "c17-library",
      "kind": "story",
      "name": "未来を守る番人",
      "requires": [
        "c17-decode"
      ],
      "pages": [
        {
          "speaker": "オルフェ",
          "text": "私は未来の記録を守る番人オルフェ。かつて自由な分岐の先で、帰らぬ者を見送った。だから道を固定した。"
        },
        {
          "speaker": "リナ",
          "text": "失う怖さは分かる。でも、守られる人が何を望むかも聞いてほしい。"
        },
        {
          "speaker": "オルフェ",
          "text": "ならば答えよ。私が守るべきは、成功した一本の未来か、それとも不確かな人々か。"
        }
      ],
      "choiceId": "c17-orphe"
    },
    {
      "id": "c17-library-fight",
      "locationId": "c17-library",
      "kind": "battle",
      "name": "書庫の封鎖反応",
      "requires": [
        "c17-orphe"
      ],
      "pages": [
        {
          "speaker": "オルフェ",
          "text": "書庫の封鎖機は私の言葉でも止まらない。確定済みの命令を、繰り返すよう作られている。"
        },
        {
          "speaker": "メイ",
          "text": "予約された攻撃を消せないなら、受け止める準備をする。記録も戦闘も、手順を見落とさない。"
        }
      ],
      "encounter": "terminal-library"
    },
    {
      "id": "c17-library-record",
      "locationId": "c17-library",
      "kind": "story",
      "name": "予測と記録の境界",
      "requires": [
        "c17-library-fight"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "時環の都市で知ったのは、同じ時刻でも返事は変わること。樹海の記憶も、空渡りの翼も、誰かの選択を運んでいた。"
        },
        {
          "speaker": "アステル",
          "text": "地下都市から潮騒の観測所へ届いた星灯も、一本の正解を知らせるためじゃなかった。"
        },
        {
          "speaker": "セリネ",
          "text": "記録は結果。予測は条件付きの見通し。その境界を消した時、固定命令が生まれたのですね。"
        }
      ]
    },
    {
      "id": "c17-library-cache",
      "locationId": "c17-library",
      "kind": "treasure",
      "name": "書庫の保守箱",
      "requires": [
        "c17-library-record"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "書庫の保守箱には補給品がある。古い術式を読み続ける前に、一度手を休めよう。"
        },
        {
          "speaker": "リナ",
          "text": "疲れを押して答えを急がないこと。それも、仲間の判断を守るためよ。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 1
      }
    },
    {
      "id": "c17-camp-rest",
      "locationId": "c17-camp",
      "kind": "rest",
      "name": "書かれない食卓",
      "requires": [
        "c17-library-cache"
      ],
      "pages": [
        {
          "speaker": "アステル",
          "text": "ここには食事の予定しか書かれていない。でも、何を話すかまでは決められていないね。"
        },
        {
          "speaker": "セリネ",
          "text": "私も一緒に座ってよいですか。案内する側でない時間は、久しぶりです。"
        },
        {
          "speaker": "リナ",
          "text": "もちろん。戦闘の前は全快で整えるけれど、休む時間そのものも大切にしましょう。"
        }
      ]
    },
    {
      "id": "c17-tia",
      "locationId": "c17-memory",
      "kind": "story",
      "name": "消えかけた少女",
      "requires": [
        "c17-camp-rest"
      ],
      "pages": [
        {
          "speaker": "ティア",
          "text": "私の名前はティア。でも名簿には、いなかったことにする欄がある。決められた未来には、私の席がないの。"
        },
        {
          "speaker": "メイ",
          "text": "消えかけた記録と、今話しているあなたは同じじゃない。声を確かめずに空白を埋めたりしない。"
        },
        {
          "speaker": "ティア",
          "text": "私のことを、どう残してくれる？ 記録にないからといって、誰かの代わりにはなりたくない。"
        }
      ],
      "choiceId": "c17-tia"
    },
    {
      "id": "c17-memory-fight",
      "locationId": "c17-memory",
      "kind": "battle",
      "name": "記憶の輪郭を守る",
      "requires": [
        "c17-tia"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "少女のまわりの記録を、敵が引きはがそうとしている。後ろへ下がって、私たちの帰還灯を見ていて。"
        },
        {
          "speaker": "アステル",
          "text": "誰かの代わりに戦うんじゃない。ティアが自分の声で話せる時間を守る。"
        }
      ],
      "encounter": "terminal-memory"
    },
    {
      "id": "c17-memory-cache",
      "locationId": "c17-memory",
      "kind": "treasure",
      "name": "記憶室の備蓄",
      "requires": [
        "c17-memory-fight"
      ],
      "pages": [
        {
          "speaker": "ティア",
          "text": "この箱、前にも誰かが残してくれた気がする。でも、思い出せない名前を作っては書かない。"
        },
        {
          "speaker": "メイ",
          "text": "うん。分からないことと、今受け取ったものを分けて残そう。それなら次に確かめられる。"
        }
      ],
      "itemReward": {
        "id": "ether",
        "count": 1
      }
    },
    {
      "id": "c17-watch-record",
      "locationId": "c17-watch",
      "kind": "story",
      "name": "番人の受領記録",
      "requires": [
        "c17-memory-cache"
      ],
      "pages": [
        {
          "speaker": "オルフェ",
          "text": "失敗した未来を読んでから、私は帰還を許す欄を閉じた。守ろうとして、戻る者まで待てなくなった。"
        },
        {
          "speaker": "リナ",
          "text": "白銀の巡礼者の声も、深森へ届いた光も、誰かを待つ余地から生まれたの。任務にその余地を戻してほしい。"
        },
        {
          "speaker": "オルフェ",
          "text": "命令の出所と、受け取った者の返事を別々に記す。まずは、そこからやり直そう。"
        }
      ]
    },
    {
      "id": "c17-archive-fight",
      "locationId": "c17-archive",
      "kind": "battle",
      "name": "記録殿の防衛",
      "requires": [
        "c17-watch-record"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "記録殿の歯車が、未確定の返事を異常と判定した。沈黙や眠りへの備えを確認して。"
        },
        {
          "speaker": "アステル",
          "text": "未確定だから消すなんて、おかしい。僕らが今出せる答えで止めるよ。"
        }
      ],
      "encounter": "terminal-observatory"
    },
    {
      "id": "c17-archive-record",
      "locationId": "c17-archive",
      "kind": "story",
      "name": "誰に宛てた約束か",
      "requires": [
        "c17-archive-fight"
      ],
      "pages": [
        {
          "speaker": "セリネ",
          "text": "機巧都市の天球儀は観測を、星脈鉄道と方舟は人と記録の移動を支えた。どれも選ぶ人そのものを運転する装置ではなかった。"
        },
        {
          "speaker": "メイ",
          "text": "星冠が予測を確定命令へ読み替えた痕跡と、墓標の保留された返事がつながった。約束の宛先は、生きて選ぶ人なんだ。"
        },
        {
          "speaker": "アステル",
          "text": "星詠みは救済の手順より先に、未来を選ぶ権利を渡そうとしていたんだね。"
        }
      ]
    },
    {
      "id": "c17-archive-cache",
      "locationId": "c17-archive",
      "kind": "treasure",
      "name": "記録殿の補給箱",
      "requires": [
        "c17-archive-record"
      ],
      "pages": [
        {
          "speaker": "セリネ",
          "text": "記録殿の補給箱です。読み終えたからといって、旅が終わるわけではありません。"
        },
        {
          "speaker": "リナ",
          "text": "受け取った記録を持って帰るためにも、今の体を大事にしましょう。"
        }
      ],
      "itemReward": {
        "id": "ether",
        "count": 1
      }
    },
    {
      "id": "c17-garden-rest",
      "locationId": "c17-garden",
      "kind": "rest",
      "name": "選ぶための休息",
      "requires": [
        "c17-archive-cache"
      ],
      "pages": [
        {
          "speaker": "ティア",
          "text": "選ぶのが怖い時は、今すぐ決めなくてもいい？ みんなの未来を、私一人の答えにしたくない。"
        },
        {
          "speaker": "アステル",
          "text": "もちろん。僕らも迷いながらここまで来た。一緒に考える時間を選んでいいんだ。"
        },
        {
          "speaker": "リナ",
          "text": "何も選べなくなる道を避けるため、今夜はここで休みましょう。"
        }
      ]
    },
    {
      "id": "c17-guardian",
      "locationId": "c17-gate",
      "kind": "battle",
      "name": "運命守護機の関門",
      "requires": [
        "c17-garden-rest"
      ],
      "pages": [
        {
          "speaker": "オルフェ",
          "text": "フェイトガーディアンは防衛予約を保持する。行動を止めても予約は消えない。盾を閉じたら、次の波に備えろ。"
        },
        {
          "speaker": "メイ",
          "text": "挑発は単体攻撃に、かばうは実際に受ける人へ。全体予兆には全員の防御と回復を合わせよう。"
        },
        {
          "speaker": "リナ",
          "text": "守ると決めた相手だけでなく、私自身も倒れないようにする。それが三人の道を守ることね。"
        }
      ],
      "encounter": "terminal-guardian"
    },
    {
      "id": "c17-branch",
      "locationId": "c17-gate",
      "kind": "story",
      "name": "未来分岐の選択",
      "requires": [
        "c17-guardian"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "防衛認証を受領。ここで近道と避難路を分けられる。どちらを先につないでも、最後には両方を残せる。"
        },
        {
          "speaker": "リナ",
          "text": "私は守られる人の代わりに未来を決めない。戻れる幅を作って、選ぶ声を待つわ。"
        },
        {
          "speaker": "アステル",
          "text": "今進む道は僕らで決める。もう一方を失敗として消さずに。"
        }
      ],
      "choiceId": "c17-branch"
    },
    {
      "id": "c17-bridge-record",
      "locationId": "c17-bridge",
      "kind": "story",
      "name": "片方を消さない橋",
      "requires": [
        "c17-branch"
      ],
      "pages": [
        {
          "speaker": "セリネ",
          "text": "二つの星路は同じ終着点へ続きます。選ばれなかった道も、別の人が必要にするかもしれません。"
        },
        {
          "speaker": "オルフェ",
          "text": "守護機の合鍵を渡そう。約束の盾槍は、門を閉ざすためだけの武器ではない。"
        },
        {
          "speaker": "リナ",
          "text": "受け取るわ。誰を閉じ込めるかではなく、誰が帰るかを考えて使う。"
        }
      ],
      "weaponReward": "promiseward-shield-spear"
    },
    {
      "id": "c17-sanctuary-fight",
      "locationId": "c17-sanctuary",
      "kind": "battle",
      "name": "聖域の記録防衛",
      "requires": [
        "c17-bridge-record"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "聖域の影は、違う返事を一つに畳もうとしている。ここには残された選択が多い。"
        },
        {
          "speaker": "アステル",
          "text": "僕らが歩いた道を理由に、他の道まで消させない。最後まで残せるように戦おう。"
        }
      ],
      "encounter": "terminal-sanctuary"
    },
    {
      "id": "c17-promise-record",
      "locationId": "c17-sanctuary",
      "kind": "story",
      "name": "旅路が守ったもの",
      "requires": [
        "c17-sanctuary-fight"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "歌は痛みだけでなく帰る道の名を、羅針盤は自分で方向を選ぶための目印を残した。各地の約束は、その人の言葉のままでここにつながる。"
        },
        {
          "speaker": "リナ",
          "text": "一つの旅のために、町で選ばれたことを無効にしない。守る相手の声を聞き直すのが私の役目。"
        },
        {
          "speaker": "アステル",
          "text": "僕が戦士だから決められた道を進むんじゃない。今、二人と一緒に進みたいから剣を取る。"
        }
      ]
    },
    {
      "id": "c17-sanctuary-cache",
      "locationId": "c17-sanctuary",
      "kind": "treasure",
      "name": "聖域の保管箱",
      "requires": [
        "c17-promise-record"
      ],
      "pages": [
        {
          "speaker": "セリネ",
          "text": "聖域の箱には、帰還を願う人々の備えが残っています。もう一つの道にも渡るよう記しておきます。"
        },
        {
          "speaker": "メイ",
          "text": "有限の道具を、無限にあることにはしない。受領記録も一緒に残すね。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 2
      }
    },
    {
      "id": "c17-refuge-rest",
      "locationId": "c17-refuge",
      "kind": "rest",
      "name": "帰還先を書く夜",
      "requires": [
        "c17-sanctuary-cache"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "この避難所は、結論を言えなかった人のためにも開けておこう。守るとは、答えを急がせないことでもある。"
        },
        {
          "speaker": "ティア",
          "text": "だったら私は、明日また話すと約束したい。消えないと断言する代わりに、今日の声を残す。"
        },
        {
          "speaker": "アステル",
          "text": "明日の君に、僕らも返事をしよう。そのために、今日はちゃんと休もう。"
        }
      ]
    },
    {
      "id": "c17-tower-fight",
      "locationId": "c17-tower",
      "kind": "battle",
      "name": "分岐路の侵食",
      "requires": [
        "c17-refuge-rest"
      ],
      "pages": [
        {
          "speaker": "オルフェ",
          "text": "分岐を閉じる侵食が始まった。私が固定を解いたことを、終端の命令が検知したのだろう。"
        },
        {
          "speaker": "アステル",
          "text": "選ぶのをやめれば戻る、なんて道にはしない。もう一度通れるよう、ここを守り切ろう。"
        }
      ],
      "encounter": "terminal-bridge"
    },
    {
      "id": "c17-tower-reading",
      "locationId": "c17-tower",
      "kind": "story",
      "name": "余白に残る明日",
      "requires": [
        "c17-tower-fight"
      ],
      "pages": [
        {
          "speaker": "ティア",
          "text": "名簿の余白に、私が明日会いたい人を書けた。未来の全文はなくても、呼びたい名前がある。"
        },
        {
          "speaker": "メイ",
          "text": "星路の剣はここに保管されていた。行く先を指す武器ではなく、閉ざされた線を開くための剣なんだ。"
        },
        {
          "speaker": "アステル",
          "text": "僕らの答えを次の人の命令にしない。今日選んだ理由と、まだ分からないことも残そう。"
        }
      ],
      "weaponReward": "starpath-sword"
    },
    {
      "id": "c17-tower-cache",
      "locationId": "c17-tower",
      "kind": "treasure",
      "name": "分岐路の救援箱",
      "requires": [
        "c17-tower-reading"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "分岐路の救援箱ね。帰る人が使えるよう、開けた記録と残りを確かめましょう。"
        },
        {
          "speaker": "セリネ",
          "text": "最後の観測所でも、誰かがここへ戻ることを想定して記録します。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 1
      }
    },
    {
      "id": "c17-reconnect",
      "locationId": "c17-observatory",
      "kind": "story",
      "name": "運命再接続",
      "requires": [
        "c17-tower-cache"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "過去の条件、今の返事、次に選ぶ余地。この順で照合する。運命再接続は、答えを一つに固定する操作じゃない。"
        },
        {
          "speaker": "オルフェ",
          "text": "どちらの星路も維持したまま、中枢への通信を開く。誤った順序なら閉じたままやり直せる。"
        },
        {
          "speaker": "リナ",
          "text": "選ばれなかった道にも、帰還灯を残してから進みましょう。"
        }
      ],
      "puzzle": {
        "title": "運命再接続：三つの照合",
        "checkLabel": "統合を確かめる",
        "resetLabel": "照合をやり直す",
        "successMessage": "両方の星路と帰還路を維持し、中枢へ再接続した。",
        "pieces": [
          {
            "id": "past",
            "name": "過去の条件"
          },
          {
            "id": "present",
            "name": "今の返事"
          },
          {
            "id": "preserve",
            "name": "次の人の余地"
          }
        ],
        "solution": [
          "past",
          "present",
          "preserve"
        ],
        "hint": "過去を読み、今の返事を確かめ、次に選ぶ余地を残す。",
        "hints": [
          "記録は答えでなく条件。最初は過去。",
          "過去の次に、今の返事。",
          "過去→現在→次の人の余地の順に照合する。"
        ],
        "errorMessage": "照合の順序が違います。記録も選択も消えません。"
      }
    },
    {
      "id": "c17-seer-record",
      "locationId": "c17-observatory",
      "kind": "story",
      "name": "星詠みが守った権利",
      "requires": [
        "c17-reconnect"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "星詠みの原文を読めた。「救いの名で、次の者が未来を選ぶ権利を奪わない」。これが約束の核心だ。"
        },
        {
          "speaker": "セリネ",
          "text": "予測は警告として残し、決断の命令にはしない。墓標の未送信の返事は、その照会がまだ生きていた証拠なのですね。"
        },
        {
          "speaker": "ティア",
          "text": "私は未来の正解を知る鍵じゃない。ここで話す一人として、その約束を受け取りたい。"
        }
      ]
    },
    {
      "id": "c17-promise",
      "locationId": "c17-altar",
      "kind": "story",
      "name": "最後の約束",
      "requires": [
        "c17-seer-record"
      ],
      "pages": [
        {
          "speaker": "オルフェ",
          "text": "終端固定核アナンケは「約束の始原」にある。失われる危険を避けるため、全ての星路を一つの未来へ封じようとしている。"
        },
        {
          "speaker": "リナ",
          "text": "危険があることは隠さない。そのうえで、守られる人の返事を聞ける道を守るわ。"
        },
        {
          "speaker": "アステル",
          "text": "最後の戦いへ進む前に約束する。僕らが勝っても、次の人の未来を僕らの答えで閉じない。"
        }
      ],
      "choiceId": "c17-promise"
    },
    {
      "id": "c17-inherit",
      "locationId": "c17-altar",
      "kind": "story",
      "name": "審判への通行記録",
      "requires": [
        "c17-promise"
      ],
      "pages": [
        {
          "speaker": "セリネ",
          "text": "終着の審判者ラストジャッジは、私たちの接続資格を試します。最終段階では、先ほど選んだ星路へ攻撃予測を変えるでしょう。"
        },
        {
          "speaker": "メイ",
          "text": "選択の記録は消さず、予兆の名称を読んで備える。勝利だけでなく、生きて先へ進むことを目標にしよう。"
        },
        {
          "speaker": "オルフェ",
          "text": "私はここで、戻る者の記録を受け取る。出発と帰還を、ようやく同じ任務にできる。"
        }
      ]
    },
    {
      "id": "c17-heart-cache",
      "locationId": "c17-heart",
      "kind": "treasure",
      "name": "心臓部の待機備蓄",
      "requires": [
        "c17-inherit"
      ],
      "pages": [
        {
          "speaker": "ティア",
          "text": "心臓部の備蓄を見つけたよ。決戦の前にも、使えるものを確かめる時間があっていいんだね。"
        },
        {
          "speaker": "リナ",
          "text": "ええ。準備をすることも、怖さを認めることも、進む意志と矛盾しないの。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 1
      }
    },
    {
      "id": "c17-last-judge",
      "locationId": "c17-heart",
      "kind": "boss",
      "name": "終着の審判",
      "requires": [
        "c17-heart-cache"
      ],
      "pages": [
        {
          "speaker": "ラストジャッジ",
          "text": "記録された未来からの逸脱を検出。帰還可能性と、分岐維持の意志を審判する。予兆ののち、星路を照合する。"
        },
        {
          "speaker": "アステル",
          "text": "未来を知ったから従うんじゃない。危険を知ったうえで選べるように、三人でここを越える！"
        },
        {
          "speaker": "メイ",
          "text": "第3段階の星路攻撃も、警告を残してから来る。防御、かばう、回復を忘れないで。"
        }
      ],
      "encounter": "terminal-last-judge",
      "weaponReward": "destiny-rod"
    },
    {
      "id": "c17-clear",
      "locationId": "c17-heart",
      "kind": "clear",
      "name": "最後の旅の出発点",
      "requires": [
        "c17-last-judge"
      ],
      "pages": [
        {
          "speaker": "ラストジャッジ",
          "text": "分岐維持、帰還路確保を確認。終着領域の心臓部を開放する。始原への接続権限を、選択する者へ返還。"
        },
        {
          "speaker": "セリネ",
          "text": "終着点は、記録の終わりでした。あなたたちの物語を終わらせる場所ではなかったのですね。"
        },
        {
          "speaker": "メイ",
          "text": "運命のロッドに、照合した条件を保存した。過去の声を消さずに、アナンケの固定命令へ問い直しに行ける。"
        },
        {
          "speaker": "リナ",
          "text": "ティア、オルフェ。ここで待つ人の明日も守りたい。帰ったら、もう一度一緒に食卓を囲みましょう。"
        },
        {
          "speaker": "アステル",
          "text": "「約束の始原」へ行こう。最終決戦はこれからだ。僕らが選んだ道の先を、まだ誰の結末にも決めつけない。"
        }
      ]
    }
  ]
};
