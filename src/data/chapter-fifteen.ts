import type {Chapter} from './chapter-one';
export const chapterFifteen:Chapter={
  "id": "chapter-15",
  "requiresChapterId": "chapter-14",
  "name": "虚空の聖域と砕けた星の王冠",
  "setting": "虚空の聖域と砕けた星の王冠",
  "preview": "第16章予告：星冠の未接続環が、遠い星脈の合流点を示す。選び直す未来へ、三人の旅は続く。",
  "locations": [
    {
      "id": "c15-gateway",
      "name": "虚空の門",
      "icon": "◇",
      "description": "方舟が示した未登録座標。帰還灯を残し、揺らぐ聖域の入口を調べる。"
    },
    {
      "id": "c15-field",
      "name": "星冠の前庭",
      "icon": "✧",
      "description": "案内人アリアが待つ前庭。まだ起きていないことが記録に刻まれている。"
    },
    {
      "id": "c15-monuments",
      "name": "位相の回廊",
      "icon": "◇",
      "description": "星冠の破片が装置へつながる。最初の同期で見える道が変わる。"
    },
    {
      "id": "c15-camp",
      "name": "位相避難所",
      "icon": "✧",
      "description": "位相の影響を遮る休息地。観測を止める時間と帰る道を確保する。"
    },
    {
      "id": "c15-sanctum",
      "name": "未来映しの鏡殿",
      "icon": "◇",
      "description": "研究者ティセが、記録と現実の食い違いを調べている。"
    },
    {
      "id": "c15-seal",
      "name": "星環観測台",
      "icon": "✧",
      "description": "鏡像と実際の星脈を比べる。観測の順序を変えても結果を残す。"
    },
    {
      "id": "c15-archive",
      "name": "聖域記録庫",
      "icon": "◇",
      "description": "未来の日時を持つ記録が眠る。予測と命令を分けて読む。"
    },
    {
      "id": "c15-garden",
      "name": "静穏の回廊",
      "icon": "✧",
      "description": "変わる光を受ける庭の手前。全快で始まる戦闘に向け作戦を話す。"
    },
    {
      "id": "c15-gate",
      "name": "守護騎の門",
      "icon": "◇",
      "description": "レオンが星冠の守護騎を見守る。防御と反撃を見極めて破片を回収する。"
    },
    {
      "id": "c15-bridge",
      "name": "虚空連絡橋",
      "icon": "✧",
      "description": "反転した位相へ渡る橋。来た道へ戻る安全路は閉じない。"
    },
    {
      "id": "c15-corridor",
      "name": "忘却の庭",
      "icon": "◇",
      "description": "座標・観測・選択の三端末。どの順に接続しても調整をやり直せる。"
    },
    {
      "id": "c15-refuge",
      "name": "星冠修復室",
      "icon": "✧",
      "description": "回収した破片を照合する。星冠の全体を無理に復元せず、安定する接続を選ぶ。"
    },
    {
      "id": "c15-fracture",
      "name": "星冠の祭壇",
      "icon": "◇",
      "description": "星冠が照らす複数の航路。予測された結末と実際の行動を比べる。"
    },
    {
      "id": "c15-observatory",
      "name": "観測の尖塔",
      "icon": "✧",
      "description": "異なる章の記録を並べる場所。観測条件を明示して術式を解く。"
    },
    {
      "id": "c15-altar",
      "name": "最終調律座",
      "icon": "◇",
      "description": "案内人の予見と三人の選択。未来を一つに縛らない約束を交わす。"
    },
    {
      "id": "c15-core",
      "name": "砕けた星冠の中枢",
      "icon": "✧",
      "description": "執行者が閉ざす中枢。部分修復を認めない古い命令と対峙する。"
    }
  ],
  "events": [
    {
      "id": "c15-arrival",
      "locationId": "c15-gateway",
      "kind": "story",
      "name": "方舟にない座標",
      "requires": [],
      "pages": [
        {
          "speaker": "メイ",
          "text": "方舟ノアティスの保存庫が、星図の外の座標を示している。北の氷環は表の目印で、こちらはそこへ接続する観測路だね。"
        },
        {
          "speaker": "アステル",
          "text": "ユノと開いた道の、その先だ。星図に載らないからって、誰もいない場所とは決めないで行こう。"
        },
        {
          "speaker": "リナ",
          "text": "帰還灯は方舟側へ残したわ。行き先が揺れても、三人で戻れる道を先に守りましょう。"
        }
      ]
    },
    {
      "id": "c15-gateway-fight",
      "locationId": "c15-gateway",
      "kind": "battle",
      "name": "門を巡る衛兵",
      "requires": [
        "c15-arrival"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "衛兵が道を塞いだわ。盾を構えた相手へ攻撃を急がず、魔法と回復を合わせましょう。"
        }
      ],
      "encounter": "void-gate"
    },
    {
      "id": "c15-gateway-cache",
      "locationId": "c15-gateway",
      "kind": "treasure",
      "name": "帰還隊の備え箱",
      "requires": [
        "c15-gateway-fight"
      ],
      "pages": [
        {
          "speaker": "アステル",
          "text": "薬が二つ残っている。帰る人のための備えだね。必要な時に使って、受け取ったことも記録しておこう。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 2
      }
    },
    {
      "id": "c15-aria",
      "locationId": "c15-field",
      "kind": "story",
      "name": "未来を知る案内人",
      "requires": [
        "c15-gateway-cache"
      ],
      "pages": [
        {
          "speaker": "アリア",
          "text": "ようこそ、虚空の聖域へ。私はアリア。あなたがこの門を渡る場面を、まだ来ない日の記録で見ました。"
        },
        {
          "speaker": "アステル",
          "text": "その記録には、僕たちが帰るところもある？ 見えた結末を守るためではなく、今の道を確かめたいんだ。"
        }
      ],
      "choiceId": "c15-aria"
    },
    {
      "id": "c15-field-record",
      "locationId": "c15-field",
      "kind": "story",
      "name": "欠けた星冠の第一片",
      "requires": [
        "c15-aria"
      ],
      "pages": [
        {
          "speaker": "アリア",
          "text": "これは星冠の破片です。複数の世界の星脈を結ぶ装置でした。砕けてから、同じ回廊が違う場所へつながるのです。"
        },
        {
          "speaker": "メイ",
          "text": "この小さな輪が位相を測っている。欠けた場所を力で埋めず、まず一片だけ接続してみよう。"
        }
      ]
    },
    {
      "id": "c15-awakening",
      "locationId": "c15-monuments",
      "kind": "story",
      "name": "最初の位相同期",
      "requires": [
        "c15-field-record"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "帰還路を固定してから、破片を同期するよ。地形を動かすのではなく、重なっていた接続の一つを選び出すんだ。"
        },
        {
          "speaker": "リナ",
          "text": "新しい通路が現れたわ。別の細道は閉じたけれど、大きな迂回路は残っている。足元を確かめて進みましょう。"
        },
        {
          "speaker": "アリア",
          "text": "ここからは位相同期です。装置を触った記録が残るので、灯りが消えても同じ道を呼び戻せます。"
        }
      ]
    },
    {
      "id": "c15-leon",
      "locationId": "c15-monuments",
      "kind": "story",
      "name": "星冠を守る騎士",
      "requires": [
        "c15-awakening"
      ],
      "pages": [
        {
          "speaker": "レオン",
          "text": "星冠守護騎士レオンだ。聖域の秩序を崩す者は通せない。未来を変えれば、守れなくなる世界もある。"
        },
        {
          "speaker": "リナ",
          "text": "守るために確かめたいの。今ここを歩く人の危険まで、古い予測だけで決めないでほしい。"
        }
      ],
      "choiceId": "c15-leon"
    },
    {
      "id": "c15-monument-record",
      "locationId": "c15-monuments",
      "kind": "story",
      "name": "消えるはずのない名前",
      "requires": [
        "c15-leon"
      ],
      "pages": [
        {
          "speaker": "レオン",
          "text": "同行した観測員の名が台帳から消えた。私は覚えているのに、聖域は最初から誰も来なかったと返す。"
        },
        {
          "speaker": "メイ",
          "text": "記録が事実を消したとは限らない。接続が変わって見えなくなった頁かもしれない。別の観測口も調べよう。"
        }
      ]
    },
    {
      "id": "c15-camp-rest",
      "locationId": "c15-camp",
      "kind": "rest",
      "name": "予見から離れて休む",
      "requires": [
        "c15-monument-record"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "この幕の中では鏡が見えないわ。これから起きることばかり追わず、今の食事と休息を取りましょう。"
        },
        {
          "speaker": "アステル",
          "text": "まだ見ていない未来に、今の僕たちを使い切らせない。休んでから、もう一度選ぶよ。"
        }
      ]
    },
    {
      "id": "c15-tise",
      "locationId": "c15-sanctum",
      "kind": "story",
      "name": "記録を比べる研究者",
      "requires": [
        "c15-camp-rest"
      ],
      "pages": [
        {
          "speaker": "ティセ",
          "text": "研究者のティセです。ここの記録には、明日の私がすでに失敗したとある。でも昨日の予測は、今朝の出来事と違いました。"
        },
        {
          "speaker": "メイ",
          "text": "第十章で観測した海も、条件を書かなければ同じ値にはならなかった。いつ、どこから見た未来なのかを比べよう。"
        },
        {
          "speaker": "アリア",
          "text": "私が見た場面も一つの接続です。話さなかったのは、答えを聞けば必ずその通りに動くと思っていたからでした。"
        }
      ],
      "choiceId": "c15-tise"
    },
    {
      "id": "c15-sanctum-fight",
      "locationId": "c15-sanctum",
      "kind": "battle",
      "name": "鏡殿の異常信号",
      "requires": [
        "c15-tise"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "忘却の影は状態異常、時紡ぎウィスプは速い属性攻撃を使う。沈黙したら回復品や防御も選んでね。"
        }
      ],
      "encounter": "void-mirror"
    },
    {
      "id": "c15-seal-record",
      "locationId": "c15-seal",
      "kind": "story",
      "name": "観測口を二つ残す",
      "requires": [
        "c15-sanctum-fight"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "鏡と星脈を別々に測ると、同じ日時でも結果が違う。未来の記録は、条件の付いた可能性なんだ。"
        },
        {
          "speaker": "レオン",
          "text": "ならば一つの未来だけを守ればよいとは言えぬ。違いを残したまま、奥の記録庫へ進め。"
        }
      ]
    },
    {
      "id": "c15-archive-fight",
      "locationId": "c15-archive",
      "kind": "battle",
      "name": "記録庫の星界警報",
      "requires": [
        "c15-seal-record"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "監視者が光を集めたら全体攻撃の予兆よ。攻撃を欲張らず、防御と回復で次の行動を支えましょう。"
        }
      ],
      "encounter": "void-archive"
    },
    {
      "id": "c15-archive-record",
      "locationId": "c15-archive",
      "kind": "story",
      "name": "未来が過去になる頁",
      "requires": [
        "c15-archive-fight"
      ],
      "pages": [
        {
          "speaker": "ティセ",
          "text": "明日の災害が、百年前の出来事として棚に収まっている。日時だけでは並べられない。観測した世界の印が抜けています。"
        },
        {
          "speaker": "メイ",
          "text": "第九章の記憶と同じで、誰の記録かを消すと一つの歴史に見えてしまう。違う世界の頁を分けて残そう。"
        }
      ]
    },
    {
      "id": "c15-garden-rest",
      "locationId": "c15-garden",
      "kind": "rest",
      "name": "変わる光の下で",
      "requires": [
        "c15-archive-record"
      ],
      "pages": [
        {
          "speaker": "アステル",
          "text": "森の芽は、昔と同じ枝には伸びなかったね。記録どおりの花だけを守っていたら、新しい芽は置き去りだった。"
        },
        {
          "speaker": "リナ",
          "text": "第十二章で返した命の流れも、ここで止めない。守る相手が今も変わることを、騎士にも伝えましょう。"
        }
      ]
    },
    {
      "id": "c15-guardian",
      "locationId": "c15-gate",
      "kind": "battle",
      "name": "星冠守護騎・レガリアガード",
      "requires": [
        "c15-garden-rest"
      ],
      "pages": [
        {
          "speaker": "レオン",
          "text": "守護騎は破片を外敵から守っている。強い単体術のあと、防御と反撃を構え、全体へ放射する。予兆中は魔法や回復で備えろ。"
        },
        {
          "speaker": "リナ",
          "text": "倒した後の避難路は確かめたわ。騎士の誓いを壊すためではなく、守る人を確かめ直すために進む。"
        }
      ],
      "encounter": "void-regalia"
    },
    {
      "id": "c15-key",
      "locationId": "c15-gate",
      "kind": "story",
      "name": "反転環の破片",
      "requires": [
        "c15-guardian"
      ],
      "pages": [
        {
          "speaker": "レオン",
          "text": "守護騎の中に第二の破片があった。星冠は完全な命令だけを通す装置ではない。異なる道を結ぶ継ぎ目も持っていたのか。"
        },
        {
          "speaker": "メイ",
          "text": "これで位相を反転できる。同期で閉じた細道が戻り、別の接続が開く。安全な迂回路はそのまま残すよ。"
        }
      ],
      "weaponReward": "voidward-shield-rapier"
    },
    {
      "id": "c15-bridge-record",
      "locationId": "c15-bridge",
      "kind": "story",
      "name": "三つの接続を選ぶ橋",
      "requires": [
        "c15-key"
      ],
      "pages": [
        {
          "speaker": "アリア",
          "text": "忘却の庭には座標・観測・選択の端末があります。どの順でも構いません。接続するたび、別の枝道と情報が開きます。"
        },
        {
          "speaker": "アステル",
          "text": "先に見た答えだけを正解にしない。三つを比べてから、僕たちの道を決めよう。"
        }
      ]
    },
    {
      "id": "c15-link-anchor",
      "locationId": "c15-corridor",
      "kind": "story",
      "name": "座標端末をつなぐ",
      "requires": [
        "c15-bridge-record"
      ],
      "pages": [
        {
          "speaker": "レオン",
          "text": "この座標は第十三章の天球儀と第十四章の方舟につながる。世界の位置を示すもので、進むべき先を命じる印ではない。"
        },
        {
          "speaker": "アステル",
          "text": "場所が分かれば、行かない道も選べる。帰れる印と一緒に、この接続を残しておこう。"
        }
      ],
      "orderGroup": "c15-corridor"
    },
    {
      "id": "c15-link-observe",
      "locationId": "c15-corridor",
      "kind": "story",
      "name": "観測端末をつなぐ",
      "requires": [
        "c15-bridge-record"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "第十章の観測値と、第十一章の声の記録が同じ条件欄を持っている。値も声も、受け取る場所を消してはいけないんだ。"
        },
        {
          "speaker": "リナ",
          "text": "違いが聞こえるよう、静かな時間も残しましょう。皆を同じ返事へ揃えるための装置にはしないわ。"
        }
      ],
      "orderGroup": "c15-corridor"
    },
    {
      "id": "c15-link-choice",
      "locationId": "c15-corridor",
      "kind": "story",
      "name": "選択端末をつなぐ",
      "requires": [
        "c15-bridge-record"
      ],
      "pages": [
        {
          "speaker": "アリア",
          "text": "私はあなたたちが争う未来を見ました。でも、何を聞いて争ったかは記録されていなかった。見えない理由を、私が決めていたのです。"
        },
        {
          "speaker": "アステル",
          "text": "争わないと約束して終わりにはしないよ。違う考えが出た時も、聞いて選び直せる道を残そう。"
        }
      ],
      "orderGroup": "c15-corridor"
    },
    {
      "id": "c15-refuge-rest",
      "locationId": "c15-refuge",
      "kind": "rest",
      "name": "部分修復の作業台",
      "requires": [
        "c15-link-anchor",
        "c15-link-observe",
        "c15-link-choice"
      ],
      "pages": [
        {
          "speaker": "ティセ",
          "text": "三つの接続がそろいました。星冠の全てを戻す必要はありません。まず帰還路と観測路を分ければ、今を保ったまま調べられます。"
        },
        {
          "speaker": "リナ",
          "text": "全部直せないことを失敗にしないわ。休める場所から、安全に直せるところを増やしましょう。"
        }
      ]
    },
    {
      "id": "c15-fracture-fight",
      "locationId": "c15-fracture",
      "kind": "battle",
      "name": "祭壇へ漏れる位相",
      "requires": [
        "c15-refuge-rest"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "速いウィスプと監視者がいる。星力をためたら、予兆の前後で必殺技を使ってもいい。今の体力を先に守ろう。"
        }
      ],
      "encounter": "void-sanctum"
    },
    {
      "id": "c15-fracture-reading",
      "locationId": "c15-fracture",
      "kind": "story",
      "name": "記録にない選択",
      "requires": [
        "c15-fracture-fight"
      ],
      "pages": [
        {
          "speaker": "ティセ",
          "text": "今の戦いは、失敗すると書かれた頁と違いました。勝った結末だけを書き換えず、何を選んで違ったのかも残したい。"
        },
        {
          "speaker": "アステル",
          "text": "僕たちの選択を、次の人の命令にはしないでね。同じ道が合わない時に、別の選び方を探せる記録にしよう。"
        }
      ],
      "choiceId": "c15-fracture-reading",
      "weaponReward": "starcrown-duals"
    },
    {
      "id": "c15-boundary-tune",
      "locationId": "c15-observatory",
      "kind": "story",
      "name": "星冠の三環調律",
      "requires": [
        "c15-fracture-reading"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "先に座標を固定し、観測の条件を照合する。最後に選べる接続を残す。未来を一つに閉じない順で輪をつなごう。"
        }
      ],
      "puzzle": {
        "title": "星冠の三環をつなぐ",
        "pieces": [
          {
            "id": "keep",
            "name": "座標を固定"
          },
          {
            "id": "check",
            "name": "観測を照合"
          },
          {
            "id": "ask",
            "name": "選択を残す"
          }
        ],
        "solution": [
          "keep",
          "check",
          "ask"
        ],
        "hint": "座標、観測、選択。",
        "hints": [
          "最初に帰還できる座標を固定する。",
          "次に異なる観測条件を照合する。",
          "座標を固定→観測を照合→選択を残す。"
        ],
        "checkLabel": "接続を確かめる",
        "resetLabel": "印を並べ直す",
        "successMessage": "三環がつながり、部分修復へ進む接続が確定した。"
      }
    },
    {
      "id": "c15-seer-record",
      "locationId": "c15-observatory",
      "kind": "story",
      "name": "星冠が結ぶもの",
      "requires": [
        "c15-boundary-tune"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "つながったよ。記憶は残すもの、観測は比べるもの、声は応答を待つもの。命の循環、天球儀、方舟は、その間を運ぶ仕組みだった。"
        },
        {
          "speaker": "ティセ",
          "text": "星冠は未来を管理する王冠というより、世界どうしが返事を交わす接続環だったのですね。まだ欠けた環の相手は分かりません。"
        },
        {
          "speaker": "アリア",
          "text": "結末を命じたのが誰なのか、ここには署名がありません。分かった接続と、まだ読めない空白を分けて渡しましょう。"
        }
      ]
    },
    {
      "id": "c15-promise",
      "locationId": "c15-altar",
      "kind": "story",
      "name": "まだ書かれない明日へ",
      "requires": [
        "c15-seer-record"
      ],
      "pages": [
        {
          "speaker": "アステル",
          "text": "定められた道を選ぶのではなく、今の僕たちで確かめて進む。違っていたら、そこで選び直すよ。"
        },
        {
          "speaker": "リナ",
          "text": "守るのは同じ未来だけではないわ。そこへ進む人と、立ち止まる人が話せる時間も守る。"
        },
        {
          "speaker": "アリア",
          "text": "私も次の記録を待つだけでなく、あなたたちに今の考えを話します。知らない未来を、一緒に迎えたい。"
        }
      ],
      "choiceId": "c15-promise"
    },
    {
      "id": "c15-inherit",
      "locationId": "c15-altar",
      "kind": "story",
      "name": "中枢へ残す退路",
      "requires": [
        "c15-promise"
      ],
      "pages": [
        {
          "speaker": "レオン",
          "text": "帰還路は私が支える。守護の誓いは、同じ形を永久に閉じることではない。問い直して戻る者を迎えることでもある。"
        },
        {
          "speaker": "メイ",
          "text": "執行者は部分修復を誤りと判定している。星冠を壊さず、未来を一つに固定する命令だけを止めよう。"
        }
      ]
    },
    {
      "id": "c15-crown-breaker",
      "locationId": "c15-core",
      "kind": "boss",
      "name": "砕冠の執行者・クラウンブレイカー",
      "requires": [
        "c15-inherit"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "最初は秩序の防御、次は位相の崩壊、最後は未来の断絶へ移るわ。予兆は段階が変わっても残る。防御と回復で受けて、道を開きましょう。"
        }
      ],
      "encounter": "void-crown-breaker",
      "weaponReward": "astral-wand"
    },
    {
      "id": "c15-clear",
      "locationId": "c15-core",
      "kind": "clear",
      "name": "砕けた王冠に残る余白",
      "requires": [
        "c15-crown-breaker"
      ],
      "pages": [
        {
          "speaker": "アリア",
          "text": "星冠は部分修復されました。位相は安定し、閉じていた通路を安全に使えます。まだ見えない世界へ、答えを急がず接続を残せました。"
        },
        {
          "speaker": "レオン",
          "text": "騎士はここへ残る。戻る者も、初めて訪れる者も、同じ未来を選ばずに門を通れるように。"
        },
        {
          "speaker": "メイ",
          "text": "未接続の環が、遠い星脈の合流点を示している。誰が返事を止めたのか、第十六章へ続く手掛かりだね。"
        },
        {
          "speaker": "アステル",
          "text": "結末はまだ決めない。アリアたちの言葉を持って、次の場所でも三人で選んでいこう。"
        }
      ]
    }
  ]
};
