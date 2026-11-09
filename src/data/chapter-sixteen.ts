import type {Chapter} from './chapter-one';
export const chapterSixteen:Chapter={
  "id": "chapter-16",
  "requiresChapterId": "chapter-15",
  "name": "星の墓標と終焉の観測者",
  "setting": "星の墓標",
  "preview": "第17章予告：終焉記録の宛先は、星脈の合流点へ続いていた。誰が選び、誰へ託したのか。まだ閉じない問いを携え、三人は先へ進む。",
  "locations": [
    {
      "id": "c16-gateway",
      "name": "星墓の入口",
      "icon": "◇",
      "description": "星冠の新座標へ。帰還座標を記録し、漂う星屑の間に道を探す。"
    },
    {
      "id": "c16-field",
      "name": "星屑の荒野",
      "icon": "✧",
      "description": "記録官エルシアと、名前を失った星々の記録を確かめる。"
    },
    {
      "id": "c16-monuments",
      "name": "崩壊文明の遺跡",
      "icon": "◇",
      "description": "投影装置のある遺跡。見える橋と渡れる橋を分けて調べる。"
    },
    {
      "id": "c16-camp",
      "name": "記録官の野営地",
      "icon": "✧",
      "description": "消えた文明の食事や生活を記した帳面が残る休息地。"
    },
    {
      "id": "c16-sanctum",
      "name": "記憶の回廊",
      "icon": "◇",
      "description": "声の断片を受け取る少女リュリア。聞こえない部分は空白のまま残す。"
    },
    {
      "id": "c16-seal",
      "name": "巡回守護者の詰所",
      "icon": "✧",
      "description": "カイルの任務記録と、撤退命令の矛盾を調べる。"
    },
    {
      "id": "c16-archive",
      "name": "失われた観測所",
      "icon": "◇",
      "description": "終焉時刻だけでなく、選択を交わした通信の履歴が残る。"
    },
    {
      "id": "c16-garden",
      "name": "静止した庭",
      "icon": "✧",
      "description": "失われた日常を見送り、今の呼吸を取り戻す休息地。"
    },
    {
      "id": "c16-gate",
      "name": "守護機の封鎖門",
      "icon": "◇",
      "description": "アストラセンチネルが装置を守る。予兆と反撃を見極めよう。"
    },
    {
      "id": "c16-bridge",
      "name": "消えた連絡橋",
      "icon": "✧",
      "description": "過去の橋を今の座標へ接続する。投影と実体は同じではない。"
    },
    {
      "id": "c16-corridor",
      "name": "星魂の祭壇",
      "icon": "◇",
      "description": "過去の記録を今の選択と照合する。消えた星の声を一つに束ねない。"
    },
    {
      "id": "c16-refuge",
      "name": "帰還灯の避難所",
      "icon": "✧",
      "description": "記録を見るのをやめる時間も必要だ。道と仲間を確かめ直す。"
    },
    {
      "id": "c16-fracture",
      "name": "終焉の塔",
      "icon": "◇",
      "description": "終わりの時刻へ向けて並べられた記録に、空白の通信を発見する。"
    },
    {
      "id": "c16-observatory",
      "name": "重ね合わせの調律座",
      "icon": "✧",
      "description": "過去と現在を照合して統合する。異なる記録は消さずに保つ。"
    },
    {
      "id": "c16-altar",
      "name": "最後の観測台",
      "icon": "◇",
      "description": "終焉の観測者に、記録だけでは決められない問いを渡す。"
    },
    {
      "id": "c16-core",
      "name": "観測者の中枢",
      "icon": "✧",
      "description": "終わりを記録し続ける存在と向き合い、次の星脈へ続く手がかりを得る。"
    }
  ],
  "events": [
    {
      "id": "c16-arrival",
      "locationId": "c16-gateway",
      "kind": "story",
      "name": "残された座標",
      "requires": [],
      "pages": [
        {
          "speaker": "メイ",
          "text": "星冠の未接続環に、新しい座標が浮かんだ。第15章で残した別の道が、観測の範囲を広げたんだ。"
        },
        {
          "speaker": "リナ",
          "text": "戻る座標も記しておくわ。先の終わりが見えても、ここへ帰る道まで手放さない。"
        },
        {
          "speaker": "アステル",
          "text": "星の墓標……消えた星にも、名前を呼ぶ人がいたはずだ。まず、その記録から探そう。"
        }
      ]
    },
    {
      "id": "c16-gateway-fight",
      "locationId": "c16-gateway",
      "kind": "battle",
      "name": "星屑の巡回者",
      "requires": [
        "c16-arrival"
      ],
      "pages": [
        {
          "speaker": "カイル",
          "text": "そこから先は記録保全区域だ。残骸の動きが変わった。立ち止まらず、互いの退路を守れ。"
        },
        {
          "speaker": "リナ",
          "text": "敵の予兆は文字でも確かめる。メイ、回復の余力を残して。"
        }
      ],
      "encounter": "grave-gate"
    },
    {
      "id": "c16-gateway-cache",
      "locationId": "c16-gateway",
      "kind": "treasure",
      "name": "入口の救援箱",
      "requires": [
        "c16-gateway-fight"
      ],
      "pages": [
        {
          "speaker": "エルシア",
          "text": "持っていって。救援隊の備えは、誰かが戻ってくるために置かれたものだから。"
        },
        {
          "speaker": "アステル",
          "text": "使った分も記しておくよ。届かなかった救援の記録まで、なかったことにはしない。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 2
      }
    },
    {
      "id": "c16-elsia",
      "locationId": "c16-field",
      "kind": "story",
      "name": "記録官の問い",
      "requires": [
        "c16-gateway-cache"
      ],
      "pages": [
        {
          "speaker": "エルシア",
          "text": "私は記録官エルシア。この星が終わった時刻は分かる。でも、その直前の通信は一部が欠けている。"
        },
        {
          "speaker": "アステル",
          "text": "時刻だけで、ここにいた人の選択まで決められない。残っているものを一緒に確かめたい。"
        },
        {
          "speaker": "エルシア",
          "text": "記録を信じることと、記録だけを信じることは違うのね。あなたたちは、どこから調べたい？"
        }
      ],
      "choiceId": "c16-elsia"
    },
    {
      "id": "c16-field-fight",
      "locationId": "c16-field",
      "kind": "battle",
      "name": "星屑の荒野の巡回者",
      "requires": [
        "c16-elsia"
      ],
      "pages": [
        {
          "speaker": "エルシア",
          "text": "記録板へ近づくと、星屑の群れが動くわ。歩ける場所を確かめながら進みましょう。"
        },
        {
          "speaker": "アステル",
          "text": "星の名前を調べるための道だ。皆が戻れる場所も残して切り開くよ。"
        }
      ],
      "encounter": "grave-field"
    },
    {
      "id": "c16-field-record",
      "locationId": "c16-field",
      "kind": "story",
      "name": "終焉時刻の余白",
      "requires": [
        "c16-field-fight"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "同じ終焉時刻なのに、避難路の開閉記録が一致しない。時計が壊れただけでは説明できないよ。"
        },
        {
          "speaker": "エルシア",
          "text": "誰かが誤りを直そうとして上書きしたと思っていた。でも、別々の立場の記録だったのかもしれない。"
        }
      ]
    },
    {
      "id": "c16-field-cache",
      "locationId": "c16-field",
      "kind": "treasure",
      "name": "荒野の携行箱",
      "requires": [
        "c16-field-record"
      ],
      "pages": [
        {
          "speaker": "エルシア",
          "text": "星名の札を守っていた人の携行箱ね。記録の裏に、救援のための薬が残っている。"
        },
        {
          "speaker": "リナ",
          "text": "持ち出す品と使い道を記しておくわ。次に来る人へ、何が残ったか伝えましょう。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 1
      }
    },
    {
      "id": "c16-projection",
      "locationId": "c16-monuments",
      "kind": "story",
      "name": "過去の輪郭",
      "requires": [
        "c16-field-cache"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "投影装置が応答した！ 建物と橋の輪郭が見える。でも荷重の記録がない。今は眺められるだけで、渡れないよ。"
        },
        {
          "speaker": "リナ",
          "text": "見えることと、安全に使えることを分けましょう。足元の通路は現実のまま残しておくわ。"
        },
        {
          "speaker": "エルシア",
          "text": "薄い線は記憶投影、足場のある線は接続済み。案内にも、その違いを残す。"
        }
      ]
    },
    {
      "id": "c16-kyle",
      "locationId": "c16-monuments",
      "kind": "story",
      "name": "巡回守護者との対立",
      "requires": [
        "c16-projection"
      ],
      "pages": [
        {
          "speaker": "カイル",
          "text": "装置を触るな。私は墓標を変えずに守ると命じられた。あの日、退路を閉じた命令まで変えていいのか。"
        },
        {
          "speaker": "リナ",
          "text": "記録を守るために、今いる人まで閉じ込めるの？ 私は、その境目を確かめたい。"
        },
        {
          "speaker": "カイル",
          "text": "守る相手を取り違えたくはない。ならば、命令書と現場を照合しろ。私も同行する。"
        }
      ],
      "choiceId": "c16-kyle"
    },
    {
      "id": "c16-ruins-fight",
      "locationId": "c16-monuments",
      "kind": "battle",
      "name": "遺跡の巡回防衛",
      "requires": [
        "c16-kyle"
      ],
      "pages": [
        {
          "speaker": "カイル",
          "text": "崩壊機兵が巡回路へ戻ってきた。踏み込みの予兆を見たら、装甲の陰へ誘導するより先に防御を。"
        },
        {
          "speaker": "メイ",
          "text": "投影された壁には隠れられないよ。今の足場だけを使って備えよう。"
        }
      ],
      "encounter": "grave-ruins"
    },
    {
      "id": "c16-monument-record",
      "locationId": "c16-monuments",
      "kind": "story",
      "name": "二つの命令書",
      "requires": [
        "c16-ruins-fight"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "封鎖命令の裏に、避難許可がある。どちらも本物で、届け先が違う。同じ記録を全員に見せれば済む話じゃないんだ。"
        },
        {
          "speaker": "アステル",
          "text": "誰に届いたのかも調べよう。命令を出した人だけが、ここで選んだわけじゃない。"
        }
      ]
    },
    {
      "id": "c16-ruins-cache",
      "locationId": "c16-monuments",
      "kind": "treasure",
      "name": "遺跡の避難備蓄",
      "requires": [
        "c16-monument-record"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "二つの命令書のそばに、避難する人のための備蓄がある。ここへ残った人も、帰還を待っていたのね。"
        },
        {
          "speaker": "カイル",
          "text": "記録はそのまま残す。物資は今、必要な者へ渡そう。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 1
      }
    },
    {
      "id": "c16-camp-rest",
      "locationId": "c16-camp",
      "kind": "rest",
      "name": "冷めた食卓のそばで",
      "requires": [
        "c16-ruins-cache"
      ],
      "pages": [
        {
          "speaker": "エルシア",
          "text": "終焉の記録ばかり見ていると、ここで朝食を待った人がいたことを忘れそうになる。"
        },
        {
          "speaker": "リナ",
          "text": "私たちも休みましょう。次の戦いはいつもどおりHP・MPを整えてから。見る人が倒れたら、記録は届かないわ。"
        }
      ]
    },
    {
      "id": "c16-lyria",
      "locationId": "c16-sanctum",
      "kind": "story",
      "name": "断片を聞く少女",
      "requires": [
        "c16-camp-rest"
      ],
      "pages": [
        {
          "speaker": "リュリア",
          "text": "私はリュリア。ここには、もういない人の声が時々重なるの。「待って」と「先へ」が、同じ場所から聞こえる。"
        },
        {
          "speaker": "メイ",
          "text": "一つの声にまとめなくていい。聞こえた順序と、聞こえなかった所を一緒に残そう。"
        },
        {
          "speaker": "リュリア",
          "text": "分からないと言っても、ちゃんと聞いたことになる？ なら、二人とも置いていかずに済むね。"
        }
      ],
      "choiceId": "c16-lyria"
    },
    {
      "id": "c16-sanctum-fight",
      "locationId": "c16-sanctum",
      "kind": "battle",
      "name": "記憶をほどく影",
      "requires": [
        "c16-lyria"
      ],
      "pages": [
        {
          "speaker": "リュリア",
          "text": "声の隙間に、別の音が入ってくる。私の言葉まで薄くなりそう……。"
        },
        {
          "speaker": "リナ",
          "text": "ここは私が守る。状態異常と残りMPを見ながら、焦らず一体ずつ止めましょう。"
        }
      ],
      "encounter": "grave-memory"
    },
    {
      "id": "c16-hall-cache",
      "locationId": "c16-sanctum",
      "kind": "treasure",
      "name": "回廊の記録箱",
      "requires": [
        "c16-sanctum-fight"
      ],
      "pages": [
        {
          "speaker": "リュリア",
          "text": "箱の札からも声が聞こえる。「これを持って、道を間違えないで」って。誰かを送り出した声だと思う。"
        },
        {
          "speaker": "アステル",
          "text": "誰の声か分からない所も書いておこう。今受け取った気持ちは、僕たちが先へ持っていく。"
        }
      ],
      "itemReward": {
        "id": "ether",
        "count": 1
      }
    },
    {
      "id": "c16-seal-record",
      "locationId": "c16-seal",
      "kind": "story",
      "name": "声を消さない筆記",
      "requires": [
        "c16-hall-cache"
      ],
      "pages": [
        {
          "speaker": "カイル",
          "text": "任務記録には、撤退した者を失踪と記せとある。だが、この声は戻る約束を話している。"
        },
        {
          "speaker": "エルシア",
          "text": "結末が記録と違っても、その人の言葉は消さない。失踪と避難を同じ欄へ押し込めないわ。"
        }
      ]
    },
    {
      "id": "c16-archive-fight",
      "locationId": "c16-archive",
      "kind": "battle",
      "name": "観測所の残存防衛",
      "requires": [
        "c16-seal-record"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "観測所の機兵が起きた。属性の弱点を確かめよう。魔法だけで押し切らず、予兆が出たら防御も選んで。"
        },
        {
          "speaker": "アステル",
          "text": "記録を読む場所を守って、皆で先へ進むよ。"
        }
      ],
      "encounter": "grave-observatory"
    },
    {
      "id": "c16-archive-record",
      "locationId": "c16-archive",
      "kind": "story",
      "name": "転送されなかった返事",
      "requires": [
        "c16-archive-fight"
      ],
      "pages": [
        {
          "speaker": "エルシア",
          "text": "星の消滅前に、選択を求める照会があった。でも住民からの返事だけ、送信済みの印がない。"
        },
        {
          "speaker": "メイ",
          "text": "故障か、保留か、誰かの操作か。今の記録だけじゃ断定できない。観測者が原本を持っているかもしれないよ。"
        }
      ]
    },
    {
      "id": "c16-observatory-cache",
      "locationId": "c16-archive",
      "kind": "treasure",
      "name": "観測所の保守箱",
      "requires": [
        "c16-archive-record"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "観測器を止めるための薬剤と、魔力を補う品が分けてある。装置を動かし続けるだけが、保守の仕事ではなかったんだね。"
        },
        {
          "speaker": "エルシア",
          "text": "休止した記録にも意味がある。必要な分を受け取って、残りを確かめましょう。"
        }
      ],
      "itemReward": {
        "id": "ether",
        "count": 1
      }
    },
    {
      "id": "c16-garden-rest",
      "locationId": "c16-garden",
      "kind": "rest",
      "name": "庭に残る一日",
      "requires": [
        "c16-observatory-cache"
      ],
      "pages": [
        {
          "speaker": "アステル",
          "text": "誰かがこの庭へ帰ってくると思って、花を植えたんだろうな。終わりを知っていたら、植えなかったのかな。"
        },
        {
          "speaker": "リュリア",
          "text": "聞こえたよ。「今日の花を見てほしい」って。明日のためだけじゃなかったんだね。"
        }
      ]
    },
    {
      "id": "c16-sentinel",
      "locationId": "c16-gate",
      "kind": "battle",
      "name": "守護機の封鎖",
      "requires": [
        "c16-garden-rest"
      ],
      "pages": [
        {
          "speaker": "カイル",
          "text": "墓標守護機・アストラセンチネル。高い装甲と反撃機構がある。強攻撃と広域放射は別々の予兆を出す。"
        },
        {
          "speaker": "リナ",
          "text": "予兆を見て備える。守ることが止まることと同じか、私たちの戦い方で示すわ。"
        }
      ],
      "encounter": "grave-sentinel"
    },
    {
      "id": "c16-connection",
      "locationId": "c16-gate",
      "kind": "story",
      "name": "記憶を支える足場",
      "requires": [
        "c16-sentinel"
      ],
      "pages": [
        {
          "speaker": "カイル",
          "text": "認証が通った。観測所の荷重記録を解放する。これは消えた星を生き返らせる鍵ではない。今いる者が橋を渡る許可だ。"
        },
        {
          "speaker": "メイ",
          "text": "記憶接続が成立したよ。半透明だった橋に、今の足場が重なった。地図の通路も同じ状態に更新された。"
        },
        {
          "speaker": "リナ",
          "text": "終焉守の盾槍、預かるわ。記録だけでなく、今ここを歩く人も守るために。"
        }
      ],
      "weaponReward": "endward-shield-spear"
    },
    {
      "id": "c16-bridge-record",
      "locationId": "c16-bridge",
      "kind": "story",
      "name": "渡った人の順序",
      "requires": [
        "c16-connection"
      ],
      "pages": [
        {
          "speaker": "エルシア",
          "text": "橋の通過記録が戻った。避難の列は途中で戻り、誰かを待っていた。命令どおりに進んだ一列ではない。"
        },
        {
          "speaker": "アステル",
          "text": "迷いながら選んだ足跡なんだ。結末だけを見て、間違いだったと片づけたくない。"
        }
      ]
    },
    {
      "id": "c16-sanctuary-fight",
      "locationId": "c16-corridor",
      "kind": "battle",
      "name": "祭壇の防衛反応",
      "requires": [
        "c16-bridge-record"
      ],
      "pages": [
        {
          "speaker": "カイル",
          "text": "祭壇の防衛が反応した。複数の属性を扱う使徒がいる。敵の行動名と次の予兆を見てくれ。"
        },
        {
          "speaker": "メイ",
          "text": "私たちの属性相性も今までと同じ。弱点を突ける時に攻めて、無理な時は備えよう。"
        }
      ],
      "encounter": "grave-sanctuary"
    },
    {
      "id": "c16-civilization-record",
      "locationId": "c16-corridor",
      "kind": "story",
      "name": "残された星の名前",
      "requires": [
        "c16-sanctuary-fight"
      ],
      "pages": [
        {
          "speaker": "リュリア",
          "text": "ここからなら、声が別々に聞こえる。星の名前を呼び合っているの。消えたあとも、相手の名前を忘れないように。"
        },
        {
          "speaker": "エルシア",
          "text": "年代と場所を添えて残すわ。名前が似ていても、一つの星と決めつけない。"
        }
      ]
    },
    {
      "id": "c16-memory-cache",
      "locationId": "c16-corridor",
      "kind": "treasure",
      "name": "祭壇の保管箱",
      "requires": [
        "c16-civilization-record"
      ],
      "pages": [
        {
          "speaker": "カイル",
          "text": "持ち出し記録に空欄がある。必要な人が使った品を、盗難として処理したのかもしれない。"
        },
        {
          "speaker": "リナ",
          "text": "今日は使い道と受取人を残していきましょう。戻ってくる人が、次に困らないように。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 2
      }
    },
    {
      "id": "c16-refuge-rest",
      "locationId": "c16-refuge",
      "kind": "rest",
      "name": "帰還灯を見直す",
      "requires": [
        "c16-memory-cache"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "帰還灯は点いている。私たちの時間は、終焉の記録へ閉じ込められていない。ここで少し息を整えましょう。"
        },
        {
          "speaker": "メイ",
          "text": "過去を知ったことと、同じ結末になることは違う。次の戦いの準備も、今の私たちが決めるんだね。"
        }
      ]
    },
    {
      "id": "c16-fracture-fight",
      "locationId": "c16-fracture",
      "kind": "battle",
      "name": "終焉の塔の残響",
      "requires": [
        "c16-refuge-rest"
      ],
      "pages": [
        {
          "speaker": "エルシア",
          "text": "塔は星の最後の観測を保管している。防衛記録が動くわ。読み解く時間を確保しましょう。"
        },
        {
          "speaker": "アステル",
          "text": "僕が道を作る。終わりの記録の奥に、まだ届かなかった返事があるはずだ。"
        }
      ],
      "encounter": "grave-tower"
    },
    {
      "id": "c16-tower-reading",
      "locationId": "c16-fracture",
      "kind": "story",
      "name": "未来を射抜くのではなく",
      "requires": [
        "c16-fracture-fight"
      ],
      "pages": [
        {
          "speaker": "アステル",
          "text": "星墓の長弓には、戻る人の灯りを探す照準がある。結末を射止めるための道具じゃないんだ。"
        },
        {
          "speaker": "リュリア",
          "text": "聞こえた言葉を書いてもいい？ 「終わると分かっていても、君の選ぶことを止めたくない」って。"
        },
        {
          "speaker": "アステル",
          "text": "誰が誰へ言ったのか、まだ分からない。僕たち自身の答えも、記録の代わりにはしないよ。"
        }
      ],
      "choiceId": "c16-tower-reading",
      "weaponReward": "grave-longbow"
    },
    {
      "id": "c16-tower-cache",
      "locationId": "c16-fracture",
      "kind": "treasure",
      "name": "塔の帰還備蓄",
      "requires": [
        "c16-tower-reading"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "塔から下りる人へ向けた箱だわ。上へ進む者のためだけじゃなく、帰る者の用意もあった。"
        },
        {
          "speaker": "カイル",
          "text": "今日の巡回記録へ、そのことも追記する。もう封鎖命令だけの塔にはしない。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 1
      }
    },
    {
      "id": "c16-integration",
      "locationId": "c16-observatory",
      "kind": "story",
      "name": "過去と現在の照合",
      "requires": [
        "c16-tower-cache"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "まず過去の記録を読み、次に現在の足場で確かめ、最後に違いを残したまま統合する。一致しない声を消す必要はないよ。"
        },
        {
          "speaker": "エルシア",
          "text": "消えた橋の輪郭と、今を支える接続が並んだ。記憶統合が成立すれば、中枢への安全路が開く。"
        }
      ],
      "puzzle": {
        "title": "記憶の重ね合わせ",
        "checkLabel": "統合を確かめる",
        "resetLabel": "照合をやり直す",
        "successMessage": "過去と現在が並び、中枢への安全路が開いた。",
        "pieces": [
          {
            "id": "past",
            "name": "過去を読む"
          },
          {
            "id": "present",
            "name": "現在を確かめる"
          },
          {
            "id": "preserve",
            "name": "違いを残す"
          }
        ],
        "solution": [
          "past",
          "present",
          "preserve"
        ],
        "hint": "過去、現在、違いの順に照合する。",
        "hints": [
          "まず過去の記録を読む。",
          "次に現在の足場を確かめる。",
          "過去を読む→現在を確かめる→違いを残す。"
        ]
      }
    },
    {
      "id": "c16-seer-record",
      "locationId": "c16-observatory",
      "kind": "story",
      "name": "返事の保留欄",
      "requires": [
        "c16-integration"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "星の消滅は、ただの自然現象ではなかった可能性がある。この欄には「接続先の選択」と「返事の保留」が並んでいる。"
        },
        {
          "speaker": "エルシア",
          "text": "でも、誰が何を選んだかは欠けている。終焉の原因だと断定せず、次の原本と照合しなければ。"
        },
        {
          "speaker": "アステル",
          "text": "重大な選択があったかもしれない。それを知って、今どうするかは僕たちが決める。"
        }
      ]
    },
    {
      "id": "c16-promise",
      "locationId": "c16-altar",
      "kind": "story",
      "name": "観測者へ渡す問い",
      "requires": [
        "c16-seer-record"
      ],
      "pages": [
        {
          "speaker": "リュリア",
          "text": "終わりを聞いた声も、今ここにいる私の声とは違う。怖くても、続きを聞きたいって、私は選べるかな。"
        },
        {
          "speaker": "リナ",
          "text": "選べるわ。聞くのをやめることも、また戻ってくることも。あなたの声を私たちの答えにすり替えない。"
        },
        {
          "speaker": "カイル",
          "text": "私は帰還路を守る。記録の終点を、旅人の終点にはしない。"
        }
      ],
      "choiceId": "c16-promise"
    },
    {
      "id": "c16-inherit",
      "locationId": "c16-altar",
      "kind": "story",
      "name": "中枢への通行記録",
      "requires": [
        "c16-promise"
      ],
      "pages": [
        {
          "speaker": "エルシア",
          "text": "記憶統合を確認した。中枢へ進む許可と、ここへ戻る経路を同じ記録に残す。"
        },
        {
          "speaker": "メイ",
          "text": "消えた星の過去と、私たちの現在が混ざらず並んでいる。あとは観測者本人に、聞いてみよう。"
        }
      ]
    },
    {
      "id": "c16-core-cache",
      "locationId": "c16-core",
      "kind": "treasure",
      "name": "中枢の待機備蓄",
      "requires": [
        "c16-inherit"
      ],
      "pages": [
        {
          "speaker": "エルシア",
          "text": "観測を受ける前の待機箱。次へ進む人にも、ここで引き返す人にも開けられるよう残されている。"
        },
        {
          "speaker": "メイ",
          "text": "今の準備を確かめよう。記憶の統合は終わったけれど、戦い方は私たちが選ぶんだ。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 1
      }
    },
    {
      "id": "c16-end-observer",
      "locationId": "c16-core",
      "kind": "boss",
      "name": "終わりを記録する者",
      "requires": [
        "c16-core-cache"
      ],
      "pages": [
        {
          "speaker": "エンドオブザーバー",
          "text": "我は終焉の観測者。記録の終端に至る者を、三度観測する。防護、記録改変、終焉予測。"
        },
        {
          "speaker": "アステル",
          "text": "終わりの記録は消さない。でも、その先へ進む人を止める答えにはさせない。"
        },
        {
          "speaker": "メイ",
          "text": "予測が始まっても、私たちの行動は止まらない。予兆を見て、守って、回復して、選び直すよ。"
        }
      ],
      "encounter": "grave-end-observer",
      "weaponReward": "memory-rod"
    },
    {
      "id": "c16-clear",
      "locationId": "c16-core",
      "kind": "clear",
      "name": "未送信の宛先",
      "requires": [
        "c16-end-observer"
      ],
      "pages": [
        {
          "speaker": "エンドオブザーバー",
          "text": "観測を終える。星の消滅の前に、接続先を選ぶ照会が送られた。返事を受け取る場所は、この墓標ではない。"
        },
        {
          "speaker": "エルシア",
          "text": "未送信の宛先……星脈の合流点。第17章へつながる原本の所在を、今度こそ出典と一緒に残すわ。"
        },
        {
          "speaker": "リュリア",
          "text": "消えた声は戻らない。でも、今聞いたことを誰に渡すかは選べる。私は、まだ続きを聞きたい。"
        },
        {
          "speaker": "リナ",
          "text": "カイルが帰る灯りを守ってくれている。私たちも今の道を歩きましょう。"
        },
        {
          "speaker": "アステル",
          "text": "結末はまだ僕たちのものじゃない。星の墓標で受け取った問いを、次の人へ持っていこう。"
        }
      ]
    }
  ]
};
