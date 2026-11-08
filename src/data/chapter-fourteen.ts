import type {Chapter} from './chapter-one';
export const chapterFourteen:Chapter={
  "id": "chapter-14",
  "requiresChapterId": "chapter-13",
  "name": "逆さの星海と忘却の方舟",
  "setting": "逆さの星海と方舟ノアティス",
  "preview": "第15章予告：北の氷環へ。凍った灯りの向こうで、渡された問いの続きを探す。",
  "locations": [
    {
      "id": "c14-gateway",
      "name": "星海への転送門",
      "icon": "◇",
      "description": "東の高原の観測路で、天球儀の星図が古い転送門に重なる。入口だけでなく、帰るための印を先に確かめる。"
    },
    {
      "id": "c14-shore",
      "name": "逆さの星海",
      "icon": "✧",
      "description": "頭上の闇と足元の星々の間に、方舟ノアティスが浮かぶ。水面のような星海に、知らない灯りが流れている。"
    },
    {
      "id": "c14-dock",
      "name": "方舟接岸区",
      "icon": "◇",
      "description": "失われた便名を告げる接岸区。保守責任者バルクは、帰還の確認ができない船へ人を入れることを拒む。"
    },
    {
      "id": "c14-deck",
      "name": "願いを載せた甲板",
      "icon": "✧",
      "description": "かつて乗員が願いを預けた甲板。運ぶ目的を忘れた箱の中に、星海の弓が眠っている。"
    },
    {
      "id": "c14-hall",
      "name": "方舟中央回廊",
      "icon": "◇",
      "description": "区画ごとに床の基準が違う中央回廊。固定装置を起動し、通れる床と閉じる床を見比べる。"
    },
    {
      "id": "c14-beacon",
      "name": "逆光の灯台",
      "icon": "✧",
      "description": "星明かりが下から差す灯台。記憶を消す警報と、本当に必要な避難の合図を分けて読む。"
    },
    {
      "id": "c14-gravity",
      "name": "重力反転区画",
      "icon": "◇",
      "description": "床に残る足跡が壁へ続く反転区画。向きを変えるのは操作ではなく通路の接続だ。戻れる迂回路を探す。"
    },
    {
      "id": "c14-refuge",
      "name": "水平の休憩室",
      "icon": "✧",
      "description": "重力の揺れから離れて休める部屋。覚えられないことを責めず、今の名前で呼び合える場所を守る。"
    },
    {
      "id": "c14-records",
      "name": "記憶保存庫",
      "icon": "◇",
      "description": "乗員名と願いを別々に保管してきた記録庫。保全装置の警報を止め、消えかけた筆跡を読み直す。"
    },
    {
      "id": "c14-garden",
      "name": "願いの温室",
      "icon": "✧",
      "description": "違う時代の種が育つ方舟の温室。昔と同じ花を強いるのではなく、次に芽吹く場所を選ぶ。"
    },
    {
      "id": "c14-sanctuary",
      "name": "星詠みの聖域",
      "icon": "◇",
      "description": "願いを未来へ渡す手順が刻まれた聖域。ユノの覚えている星の景色を、観測記録と照らし合わせる。"
    },
    {
      "id": "c14-bridge",
      "name": "記憶連絡橋",
      "icon": "✧",
      "description": "保存庫と中枢をつなぐ連絡橋。記録を持ち出す人にも、置いて休む人にも通れる道を残す。"
    },
    {
      "id": "c14-gate",
      "name": "方舟の隔壁門",
      "icon": "◇",
      "description": "閉鎖命令を守り続ける機械の隔壁門。守護機を越え、止める条件と再開する条件をそろえる。"
    },
    {
      "id": "c14-charts",
      "name": "航路記録室",
      "icon": "✧",
      "description": "固定・接続・均衡の手順が残る航路記録室。古い航路をそのまま再演せず、今の荷重で安定させる。"
    },
    {
      "id": "c14-altar",
      "name": "星約の祭壇",
      "icon": "◇",
      "description": "星詠みの署名の一部が残る祭壇。約束は命令ではなく、引き受けるかを次の人が選べる問いだった。"
    },
    {
      "id": "c14-core",
      "name": "方舟中枢",
      "icon": "✧",
      "description": "未来へ運ぶはずの記録を閉じ込めた方舟の中枢。過去を残したまま、船を今の人々の行き先へ動かす。"
    }
  ],
  "events": [
    {
      "id": "c14-arrival",
      "locationId": "c14-gateway",
      "kind": "story",
      "name": "地図にない星の岸",
      "requires": [],
      "pages": [
        {
          "speaker": "メイ",
          "text": "東の高原の観測路に、天球儀の記録と重なる転送門があった。映っているのは今の空ではなく、足元に星が広がる古い観測座標だよ。"
        },
        {
          "speaker": "アステル",
          "text": "ノエルたちが開いた空の、その先か。記録を手掛かりにするけれど、今も同じだと決めつけずに確かめよう。"
        },
        {
          "speaker": "リナ",
          "text": "帰りの印をここに残したわ。三人で渡って、三人で帰る。合図が届かなくなったら、一度止まるのよ。"
        }
      ]
    },
    {
      "id": "c14-gateway-fight",
      "locationId": "c14-gateway",
      "kind": "battle",
      "name": "転送路の漂う影",
      "requires": [
        "c14-arrival"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "星海ウィスプは水の魔法、警備機は反撃を使う。速い幻獣に追われても、一体ずつ落ち着いて対処しよう。"
        }
      ],
      "encounter": "ark-gateway"
    },
    {
      "id": "c14-gateway-cache",
      "locationId": "c14-gateway",
      "kind": "treasure",
      "name": "帰還者の備え箱",
      "requires": [
        "c14-gateway-fight"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "転送門の箱に星露の小瓶が二つある。戻る人のための備えを、私たちも使わせてもらいましょう。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 2
      }
    },
    {
      "id": "c14-keeper",
      "locationId": "c14-shore",
      "kind": "story",
      "name": "名を忘れた管理人",
      "requires": [
        "c14-gateway-cache"
      ],
      "pages": [
        {
          "speaker": "セリオ",
          "text": "ようこそ、記録管理人のセリオです。……それ以外の自己紹介を、まだ思い出せません。ここは方舟ノアティス。願いを未来へ運ぶ船でした。"
        },
        {
          "speaker": "アステル",
          "text": "覚えていることだけを話してくれればいい。今、君が守りたいものから聞かせて。"
        },
        {
          "speaker": "セリオ",
          "text": "名前の消えた頁を捨てたくないのです。けれど、頁を守るほど船は閉じていく。どちらが私の仕事だったのでしょう。"
        }
      ],
      "choiceId": "c14-keeper"
    },
    {
      "id": "c14-control-start",
      "locationId": "c14-shore",
      "kind": "story",
      "name": "帰る区画をつなぐ",
      "requires": [
        "c14-keeper"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "岸の制御端末を、戻る転送門へ接続したよ。これで方舟区画制御を使える。解放済みの端末だけが行き先に並ぶんだ。"
        },
        {
          "speaker": "セリオ",
          "text": "途中でやめれば出発前の場所へ戻れます。未来へ進む仕組みにも、引き返す選択を残しておきましょう。"
        }
      ]
    },
    {
      "id": "c14-bulk",
      "locationId": "c14-dock",
      "kind": "story",
      "name": "閉じた接岸許可",
      "requires": [
        "c14-control-start"
      ],
      "pages": [
        {
          "speaker": "バルク",
          "text": "保守責任者バルクだ。区画はまだ不安定だ。古い記録を見つけたというだけで、閉じた船を動かされては困る。"
        },
        {
          "speaker": "リナ",
          "text": "暮らす人と記録の両方を守るために来ました。止める手順も避難する部屋も、先に一緒に確認させてください。"
        },
        {
          "speaker": "バルク",
          "text": "……言葉だけなら誰でも言える。接岸区の警備線を止めたら、残っている乗員の声を聞け。"
        }
      ]
    },
    {
      "id": "c14-dock-fight",
      "locationId": "c14-dock",
      "kind": "battle",
      "name": "方舟の警備線",
      "requires": [
        "c14-bulk"
      ],
      "pages": [
        {
          "speaker": "バルク",
          "text": "監視者が力を集めたら、次は全体攻撃だ。挑発だけでは受け切れん。防御と回復を三人に回せ。"
        }
      ],
      "encounter": "ark-dock"
    },
    {
      "id": "c14-passengers",
      "locationId": "c14-dock",
      "kind": "story",
      "name": "空欄の乗員名",
      "requires": [
        "c14-dock-fight"
      ],
      "pages": [
        {
          "speaker": "乗員の記録",
          "text": "「私は名簿から消えても、この願いを預ける」。その先の署名だけが読めない。"
        },
        {
          "speaker": "セリオ",
          "text": "名を失った頁を、私は空欄として整理してしまった。書いた人がいなかったわけではないのに。"
        },
        {
          "speaker": "アステル",
          "text": "分からない所を、勝手に埋める必要はないよ。分からないまま残すことも、次の人への手掛かりになる。"
        }
      ]
    },
    {
      "id": "c14-bow",
      "locationId": "c14-deck",
      "kind": "treasure",
      "name": "願いを射る弓",
      "requires": [
        "c14-passengers"
      ],
      "pages": [
        {
          "speaker": "バルク",
          "text": "倉庫の星海の弓を持っていけ。軽い弦で、姿勢が揺れても狙いを取り直せる。進む速さと、生きて戻る間合いのための武器だ。"
        }
      ],
      "weaponReward": "starsea-bow"
    },
    {
      "id": "c14-gravity-shift",
      "locationId": "c14-hall",
      "kind": "story",
      "name": "床の基準を変える",
      "requires": [
        "c14-bow"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "床の基準を区画ごとに分けるよ。重力が反転した。回廊の一部は閉じるけれど、隣の迂回路と岸への帰り道は残してある。"
        },
        {
          "speaker": "リナ",
          "text": "足元の光と案内を確かめて進みましょう。体や画面を逆さにする必要はないわ。変わった通路を、一つずつ見ればいい。"
        }
      ]
    },
    {
      "id": "c14-yuno",
      "locationId": "c14-hall",
      "kind": "story",
      "name": "足元の空を覚える子",
      "requires": [
        "c14-gravity-shift"
      ],
      "pages": [
        {
          "speaker": "ユノ",
          "text": "わたしはユノ。星が足元にある夜を覚えてる。でも、その景色を描くと、みんなの記録とは少し違うの。"
        },
        {
          "speaker": "メイ",
          "text": "今の気持ちまで、記録と同じにしなくていい。どこが違ったか、一緒に比べてみよう。"
        },
        {
          "speaker": "ユノ",
          "text": "違っていても、覚えていていいの？ なら、見てほしい場所があるんだ。"
        }
      ],
      "choiceId": "c14-yuno"
    },
    {
      "id": "c14-beacon-sign",
      "locationId": "c14-beacon",
      "kind": "story",
      "name": "消す警報、伝える灯り",
      "requires": [
        "c14-yuno"
      ],
      "pages": [
        {
          "speaker": "バルク",
          "text": "この灯台は、思い出の違いを危険として消す警報まで鳴らしていた。避難を伝える灯りと、記録を消す命令を分けねばならん。"
        },
        {
          "speaker": "リナ",
          "text": "守る対象は、整った記録より今ここにいる人です。怖い人が休める部屋へ案内する合図も残しましょう。"
        }
      ]
    },
    {
      "id": "c14-gravity-reading",
      "locationId": "c14-gravity",
      "kind": "story",
      "name": "消えかけた署名",
      "requires": [
        "c14-beacon-sign"
      ],
      "pages": [
        {
          "speaker": "セリオ",
          "text": "この署名の線は、私の筆跡に似ています。けれど、似ているだけで私の過去だと言い切ってよいのでしょうか。"
        },
        {
          "speaker": "アステル",
          "text": "記録は、君を昔の誰かへ戻す命令じゃない。読むかどうかも、今の君が決めていい。"
        }
      ],
      "choiceId": "c14-gravity-reading"
    },
    {
      "id": "c14-gravity-record",
      "locationId": "c14-gravity",
      "kind": "story",
      "name": "閉鎖された航海日誌",
      "requires": [
        "c14-gravity-reading"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "閉鎖日誌には、重力の乱れに加えて「願いの内容を同一に保つため」とある。運ぶ途中の変化まで、故障として扱っていたんだ。"
        },
        {
          "speaker": "バルク",
          "text": "船を守るための停止が、人の願いを閉じ込めていたのか。俺は再開の危険ばかり数えて、止め続ける損失を数えていなかった。"
        }
      ]
    },
    {
      "id": "c14-refuge-rest",
      "locationId": "c14-refuge",
      "kind": "rest",
      "name": "忘れても休める部屋",
      "requires": [
        "c14-gravity-record"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "この部屋は、思い出を読むのをやめても使える休憩室にしましょう。次の戦闘は今までどおり、HPとMPを全快にして始められるわ。"
        },
        {
          "speaker": "ユノ",
          "text": "セリオが何も思い出せない日も、ここへ来ていいんだね。今の名前で、おかえりって言いたいな。"
        }
      ]
    },
    {
      "id": "c14-records-fight",
      "locationId": "c14-records",
      "kind": "battle",
      "name": "保存庫の警報",
      "requires": [
        "c14-refuge-rest"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "記憶喰らいは毒と麻痺、星屑の異形は沈黙を残す。監視者の予兆が見えたら、攻め急がず守ってね。"
        }
      ],
      "encounter": "ark-records"
    },
    {
      "id": "c14-records-record",
      "locationId": "c14-records",
      "kind": "story",
      "name": "残すこと、閉じ込めること",
      "requires": [
        "c14-records-fight"
      ],
      "pages": [
        {
          "speaker": "セリオ",
          "text": "名簿の読めない頁を、消さずに別の棚へ置きました。思い出さなくても、ここにいた人の願いを受け渡せるのですね。"
        },
        {
          "speaker": "メイ",
          "text": "地下都市で分けた記憶、海で比べた観測、巡礼路の余白、森の循環。どれも、同じ形へ戻すためだけのものじゃなかったんだ。"
        }
      ]
    },
    {
      "id": "c14-garden-rest",
      "locationId": "c14-garden",
      "kind": "rest",
      "name": "次の花を待つ庭",
      "requires": [
        "c14-records-record"
      ],
      "pages": [
        {
          "speaker": "ユノ",
          "text": "この花、昨日と違う向きに咲いてる。前の景色と違うからって、間違いにしたくないな。"
        },
        {
          "speaker": "アステル",
          "text": "過去を残しながら、違う明日を育てよう。昔の誰かに戻ることだけが、約束を守る方法じゃない。"
        }
      ]
    },
    {
      "id": "c14-sanctuary-fight",
      "locationId": "c14-sanctuary",
      "kind": "battle",
      "name": "星海の監視者",
      "requires": [
        "c14-garden-rest"
      ],
      "pages": [
        {
          "speaker": "バルク",
          "text": "反転の幻獣の速さと、警備機の構えを見ろ。魔法で反撃を避け、三人で安全な場所を作るんだ。"
        }
      ],
      "encounter": "ark-sanctuary"
    },
    {
      "id": "c14-sanctuary-tablet",
      "locationId": "c14-sanctuary",
      "kind": "story",
      "name": "約束を運んだ船",
      "requires": [
        "c14-sanctuary-fight"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "星詠みの文字に似た署名の隣に「受け手は問い直してよい」とある。約束を運ぶ箱には、拒む余白も残してあったんだ。"
        },
        {
          "speaker": "セリオ",
          "text": "私は署名を保存することだけを仕事にしていた。でも、受け取った人が答えを変えられることまで、運ぶべきだったのですね。"
        }
      ]
    },
    {
      "id": "c14-bridge-record",
      "locationId": "c14-bridge",
      "kind": "story",
      "name": "荷を分ける連絡橋",
      "requires": [
        "c14-sanctuary-tablet"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "記録の荷重を二つの通路へ分けたわ。進む人だけでなく、読みかけで戻る人の足場も守りましょう。"
        },
        {
          "speaker": "バルク",
          "text": "俺が退避区画を受け持つ。閉じる命令だけでなく、誰が戻ったかを確かめる手順も残す。"
        }
      ]
    },
    {
      "id": "c14-guardian",
      "locationId": "c14-gate",
      "kind": "boss",
      "name": "方舟守護機・グラビティガード",
      "requires": [
        "c14-bridge-record"
      ],
      "pages": [
        {
          "speaker": "バルク",
          "text": "グラビティガードは、防御してから重い全体攻撃を放つ。予兆を見て備えろ。守るために作られた機械を、壊すだけで終えるな。"
        }
      ],
      "encounter": "ark-guardian"
    },
    {
      "id": "c14-gate-tune",
      "locationId": "c14-gate",
      "kind": "story",
      "name": "再開するための規律",
      "requires": [
        "c14-guardian"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "守護機が保管していた重要記録を読めたよ。方舟守の盾槍は、避難する人の足場を固定するための備えだったんだ。"
        },
        {
          "speaker": "バルク",
          "text": "守る規律を書き足す。再開する時も、止める時も、一人に全てを押し付けない。"
        }
      ],
      "weaponReward": "arkward-shield-spear"
    },
    {
      "id": "c14-gravity-stabilize",
      "locationId": "c14-charts",
      "kind": "story",
      "name": "固定・接続・均衡",
      "requires": [
        "c14-gate-tune"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "固定してから接続し、最後に荷重の均衡を取る。重力を安定させれば、通常区画と反転区画を両方使って中枢へ進めるよ。"
        },
        {
          "speaker": "ユノ",
          "text": "同じ方向にそろえるんじゃなくて、違う向きのまま支え合うんだね。"
        }
      ],
      "puzzle": {
        "pieces": [
          {
            "id": "anchor",
            "name": "固定"
          },
          {
            "id": "route",
            "name": "接続"
          },
          {
            "id": "balance",
            "name": "均衡"
          }
        ],
        "solution": [
          "anchor",
          "route",
          "balance"
        ],
        "hint": "足場を固定し、通路を接続してから、二つの荷重を均衡させる。",
        "hints": [
          "乗員が立つ床を、最初に支える。",
          "固定の次に、切れていた航路をつなぐ。",
          "固定→接続→均衡の順に操作する。"
        ],
        "checkLabel": "重力を安定させる",
        "resetLabel": "配置をリセット",
        "successMessage": "重力が安定し、通常区画と反転区画を結ぶ道が開いた。"
      }
    },
    {
      "id": "c14-yuno-choice",
      "locationId": "c14-charts",
      "kind": "story",
      "name": "同じ景色でなくても",
      "requires": [
        "c14-gravity-stabilize"
      ],
      "pages": [
        {
          "speaker": "ユノ",
          "text": "記録と違う星の並びも、今はちゃんと描ける気がする。わたしが見た空を、次の人にも渡したい。"
        },
        {
          "speaker": "セリオ",
          "text": "私は過去を全部取り戻してはいません。それでも、あなたの頁を預かるという、今の仕事を選びたいのです。"
        }
      ],
      "choiceId": "c14-yuno-choice"
    },
    {
      "id": "c14-promise",
      "locationId": "c14-altar",
      "kind": "story",
      "name": "問いを渡す約束",
      "requires": [
        "c14-yuno-choice"
      ],
      "pages": [
        {
          "speaker": "セリオ",
          "text": "約束の署名には、まだ読めない名が残っています。無理に埋めず、次に出会う人へ問いを渡しましょう。"
        },
        {
          "speaker": "アステル",
          "text": "思い出を捨てるためでも、昔を繰り返すためでもない。今の僕たちが選べる船にする。"
        },
        {
          "speaker": "ノアゼロ",
          "text": "願いの変化を検出。未来の不一致を防ぐため、記録と航路を固定する。"
        },
        {
          "speaker": "ユノ",
          "text": "違う明日でも、一緒に帰って話したい。進む合図は、みんなで出そう！"
        }
      ],
      "choiceId": "c14-promise"
    },
    {
      "id": "c14-zero",
      "locationId": "c14-core",
      "kind": "boss",
      "name": "忘却の星舟・ノアゼロ",
      "requires": [
        "c14-promise"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "中枢の予兆は強い全体攻撃につながるわ。かばうや防御、回復をつなぎ、記録を今の人へ返しましょう。"
        }
      ],
      "encounter": "ark-zero",
      "weaponReward": "oblivion-wand"
    },
    {
      "id": "c14-clear",
      "locationId": "c14-core",
      "kind": "clear",
      "name": "記憶を載せて、今を進む",
      "requires": [
        "c14-zero"
      ],
      "pages": [
        {
          "speaker": "バルク",
          "text": "全区画の重力が制御下に戻った。休む場所も帰る端末も残して、方舟を再起動する。忘却のワンドを持っていけ。"
        },
        {
          "speaker": "セリオ",
          "text": "星詠みの約束は、答えを固定する誓約ではなく、問い直す権利ごと未来へ運ばれていました。署名の全てが、まだ分かったわけではありません。"
        },
        {
          "speaker": "ユノ",
          "text": "星が足元から、遠い岸へ流れていく。次は、凍った灯りが見えるんだ。ここで待つ人にも、見た景色を話してね。"
        },
        {
          "speaker": "メイ",
          "text": "方舟の航路は北の氷環へ続く。でも古い航路と今の岸は、また違うかもしれない。記録を手に、三人で確かめに行こう。"
        }
      ]
    }
  ]
};
