import type {Chapter} from './chapter-one';
export const chapterEighteen:Chapter={
  "id": "chapter-18",
  "explicitClear": true,
  "requiresChapterId": "chapter-17",
  "name": "星詠みの遺した約束",
  "setting": "約束の始原",
  "locations": [
    {
      "id": "c18-gate",
      "name": "約束の始原への門",
      "icon": "✧",
      "description": "約束の始原への門。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-memory",
      "name": "旅の記憶路",
      "icon": "✧",
      "description": "旅の記憶路。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-garden",
      "name": "星を待つ庭",
      "icon": "✧",
      "description": "星を待つ庭。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-camp",
      "name": "帰還標の野営地",
      "icon": "✧",
      "description": "帰還標の野営地。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-archive",
      "name": "星詠みの原典庫",
      "icon": "✧",
      "description": "星詠みの原典庫。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-refuge",
      "name": "守る者の待合所",
      "icon": "✧",
      "description": "守る者の待合所。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-sanctum",
      "name": "永遠の守護殿",
      "icon": "✧",
      "description": "永遠の守護殿。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-watch",
      "name": "固定命令の監視台",
      "icon": "✧",
      "description": "固定命令の監視台。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-hall",
      "name": "運命の選択殿",
      "icon": "✧",
      "description": "運命の選択殿。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-path",
      "name": "三つの返事の道",
      "icon": "✧",
      "description": "三つの返事の道。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-observatory",
      "name": "最後の観測所",
      "icon": "✧",
      "description": "最後の観測所。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-threshold",
      "name": "星の再編台",
      "icon": "✧",
      "description": "星の再編台。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-altar",
      "name": "決戦前の祭壇",
      "icon": "✧",
      "description": "決戦前の祭壇。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-heart",
      "name": "星の心臓",
      "icon": "✧",
      "description": "星の心臓。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-return",
      "name": "帰還する声の広場",
      "icon": "✧",
      "description": "帰還する声の広場。旅の記録と今の返事を照合する。"
    },
    {
      "id": "c18-end",
      "name": "明日へ続く野営地",
      "icon": "✧",
      "description": "明日へ続く野営地。旅の記録と今の返事を照合する。"
    }
  ],
  "events": [
    {
      "id": "c18-arrival",
      "locationId": "c18-gate",
      "name": "宛先の向こうへ",
      "kind": "story",
      "requires": [],
      "pages": [
        {
          "speaker": "アステル",
          "text": "ラストジャッジが開いた接続先……「約束の始原」だ。終着領域に、帰還の印を残してきた。"
        },
        {
          "speaker": "メイ",
          "text": "終焉記録は結果の写し。未来を命令する原本じゃない。この区別を、最後まで守ろう。"
        },
        {
          "speaker": "リナ",
          "text": "セリネたちが帰りを待っている。三人で行って、三人で帰るわ。"
        }
      ]
    },
    {
      "id": "c18-gate-fight",
      "locationId": "c18-gate",
      "name": "断絶した星路",
      "kind": "battle",
      "requires": [
        "c18-arrival"
      ],
      "pages": [
        {
          "speaker": "セリネ",
          "text": "始原の固定命令が、外からの返事を遮っています。記録を守りながら通路を確かめて。"
        },
        {
          "speaker": "アステル",
          "text": "道を塞ぐ反応だけを止めよう。ここに残された声まで消す必要はない。"
        }
      ],
      "encounter": "final-gate"
    },
    {
      "id": "c18-gate-cache",
      "locationId": "c18-gate",
      "name": "帰る人の備え",
      "kind": "treasure",
      "requires": [
        "c18-gate-fight"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "備蓄に、戻る人のための印がある。固定された未来にも、誰かの配慮は残っていたのね。"
        },
        {
          "speaker": "メイ",
          "text": "使ったことも記録しておこう。次の人に、何が必要か伝わるように。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 3
      }
    },
    {
      "id": "c18-memory-voices",
      "locationId": "c18-memory",
      "name": "最初の三つの印",
      "kind": "story",
      "requires": [
        "c18-gate-cache"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "森の石碑にあった三つの印は、力、知識、そして相手の返事を待つ境界だった。"
        },
        {
          "speaker": "アステル",
          "text": "力を合わせ、境を守れ。誰も置いていかないって決めた、あの日からつながっていたんだ。"
        },
        {
          "speaker": "リナ",
          "text": "守る境界は、人を閉じ込める壁じゃない。助けを求める声が届く場所だったのね。"
        }
      ]
    },
    {
      "id": "c18-memory-fight",
      "locationId": "c18-memory",
      "name": "消されかけた足跡",
      "kind": "battle",
      "requires": [
        "c18-memory-voices"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "予測に合わない記録が切り離されている。街で選ばれた言葉を、無かったことにはさせない。"
        },
        {
          "speaker": "リナ",
          "text": "ここを守る。二人は記録の結び目を確かめて。"
        }
      ],
      "encounter": "final-memory"
    },
    {
      "id": "c18-memory-cache",
      "locationId": "c18-memory",
      "name": "旅の記録箱",
      "kind": "treasure",
      "requires": [
        "c18-memory-fight"
      ],
      "pages": [
        {
          "speaker": "セリネ",
          "text": "失われた道にも、引き返した人の印があります。成功した記録だけが旅ではないのです。"
        },
        {
          "speaker": "アステル",
          "text": "立ち止まった時間も、僕らをここまで連れてきたんだね。"
        }
      ],
      "itemReward": {
        "id": "ether",
        "count": 3
      }
    },
    {
      "id": "c18-seline",
      "locationId": "c18-garden",
      "name": "案内人へ託す帰路",
      "kind": "story",
      "requires": [
        "c18-memory-cache"
      ],
      "pages": [
        {
          "speaker": "セリネ",
          "text": "終着領域と始原の間を、私が見守ります。何を頼みたいですか。"
        },
        {
          "speaker": "リナ",
          "text": "進む道と同じくらい、帰る道を大事にしたい。待ってくれる人にも、選ぶ時間を残して。"
        },
        {
          "speaker": "アステル",
          "text": "僕らが戻るまでに必要なことを、一緒に決めよう。"
        }
      ],
      "choiceId": "c18-seline"
    },
    {
      "id": "c18-connect",
      "locationId": "c18-garden",
      "name": "記憶の接続",
      "kind": "story",
      "requires": [
        "c18-seline"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "星図と歌は、記録の宛先を示していた。羅針盤と時環は、方角と時刻を照合するためのもの。"
        },
        {
          "speaker": "セリネ",
          "text": "異なる観測を同じ声にしないまま、接続できます。"
        },
        {
          "speaker": "メイ",
          "text": "森、灰の街、風の峡谷、水晶の都、砂の王都、時の街。みんなが残した条件を、そのままつなぐ。"
        }
      ]
    },
    {
      "id": "c18-garden-fight",
      "locationId": "c18-garden",
      "name": "接続口の執行機",
      "kind": "battle",
      "requires": [
        "c18-connect"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "接続が戻ったから、固定する側の反応も来る。予兆を読んで、焦らず進みましょう。"
        }
      ],
      "encounter": "final-garden"
    },
    {
      "id": "c18-garden-cache",
      "locationId": "c18-garden",
      "name": "庭の灯火箱",
      "kind": "treasure",
      "requires": [
        "c18-garden-fight"
      ],
      "pages": [
        {
          "speaker": "オルフェ",
          "text": "これは、帰りを待つ者が使う灯だ。私の任務は未来を塞ぐことではなかった。"
        },
        {
          "speaker": "アステル",
          "text": "その任務を、これから一緒に続けていこう。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 3
      }
    },
    {
      "id": "c18-camp-rest",
      "locationId": "c18-camp",
      "name": "不確かな明日と食卓",
      "kind": "rest",
      "requires": [
        "c18-garden-cache"
      ],
      "pages": [
        {
          "speaker": "ティア",
          "text": "明日のことは分からない。でも、帰ったら何を食べるかは、考えてもいいよね。"
        },
        {
          "speaker": "リナ",
          "text": "もちろん。怖さが消えなくても、楽しみにしていいことはあるわ。"
        },
        {
          "speaker": "メイ",
          "text": "ここで休もう。戦闘はこれまで通りHPとMPが全快で始まる。装備と回復品も見直せるよ。"
        }
      ]
    },
    {
      "id": "c18-truth",
      "locationId": "c18-archive",
      "name": "星詠みが残した理由",
      "kind": "story",
      "requires": [
        "c18-camp-rest"
      ],
      "pages": [
        {
          "speaker": "星詠みの記録",
          "text": "予測で失うものを知った。だから備えを渡したかった。だが、警告を命令に変えれば、救う相手の明日を先に奪ってしまう。"
        },
        {
          "speaker": "星詠みの記録",
          "text": "私の答えを最後の答えにしてはならない。観測条件と帰還路を残す。次の人が、違う答えを選べるように。"
        },
        {
          "speaker": "アステル",
          "text": "「星が消えても、約束は消えない」。あの人は、僕らに正解を守らせたかったんじゃないんだ。"
        },
        {
          "speaker": "メイ",
          "text": "知ったうえで選べるように、情報を遺した。その続きを、今の私たちが受け取る。"
        }
      ]
    },
    {
      "id": "c18-mei",
      "locationId": "c18-archive",
      "name": "知識を命令にしない",
      "kind": "story",
      "requires": [
        "c18-truth"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "樹の根も、翼も、地下都市の記憶も、星灯も、巡礼者の声も……違う場所から同じ予測を問い直していた。"
        },
        {
          "speaker": "オルフェ",
          "text": "原典を書き換えれば、固定を止められるのか。"
        },
        {
          "speaker": "メイ",
          "text": "原典は消さない。過去と予測を区別し、今の観測を隣に記す。私は、その術式を選ぶ。"
        }
      ],
      "choiceId": "c18-mei"
    },
    {
      "id": "c18-archive-fight",
      "locationId": "c18-archive",
      "name": "原典を閉じる守護者",
      "kind": "battle",
      "requires": [
        "c18-mei"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "原典を守る機構も、私たちの敵とは限らない。でも、今の声を閉ざす命令は止める。"
        }
      ],
      "encounter": "final-archive"
    },
    {
      "id": "c18-archive-cache",
      "locationId": "c18-archive",
      "name": "原典庫の補給",
      "kind": "treasure",
      "requires": [
        "c18-archive-fight"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "灯火の雫と、記録を分けるための空欄が残っている。"
        },
        {
          "speaker": "アステル",
          "text": "空欄は欠落じゃない。次に歩く人のための場所だね。"
        }
      ],
      "itemReward": {
        "id": "ether",
        "count": 3
      }
    },
    {
      "id": "c18-rina",
      "locationId": "c18-refuge",
      "name": "盾が守る時間",
      "kind": "story",
      "requires": [
        "c18-archive-cache"
      ],
      "pages": [
        {
          "speaker": "ティア",
          "text": "私がここに残れば、道が安定するって表示されている。でも、私は戻りたい。"
        },
        {
          "speaker": "リナ",
          "text": "あなたを道の部品にはしない。戻りたいと言える時間を、私が守る。"
        },
        {
          "speaker": "リナ",
          "text": "守るというのは、相手の代わりに未来を選ぶことじゃない。選ぶ人が立っていられる場所をつくることよ。"
        }
      ],
      "choiceId": "c18-rina"
    },
    {
      "id": "c18-refuge-rest",
      "locationId": "c18-refuge",
      "name": "三人の歩幅",
      "kind": "rest",
      "requires": [
        "c18-rina"
      ],
      "pages": [
        {
          "speaker": "アステル",
          "text": "リナが前を守ってくれるから、僕は立ち止まって考えられた。"
        },
        {
          "speaker": "メイ",
          "text": "私の知識だけでも、剣だけでも、ここへは来られなかった。"
        },
        {
          "speaker": "リナ",
          "text": "二人がいたから、私も守り方を選び直せた。これからも、三人で。"
        }
      ]
    },
    {
      "id": "c18-guardian",
      "locationId": "c18-sanctum",
      "name": "最後の守護機",
      "kind": "battle",
      "requires": [
        "c18-refuge-rest"
      ],
      "pages": [
        {
          "speaker": "エターナルガーディアン",
          "text": "固定命令を保護。接続変更を阻止する。蓄積後、防衛波を放つ。"
        },
        {
          "speaker": "メイ",
          "text": "水の術式が弱点。眠りや凍結で止めても、予兆は消えない。解除後の攻撃に備えよう。"
        },
        {
          "speaker": "アステル",
          "text": "守る任務を否定しない。でも、誰を何から守るのか、確かめさせてほしい。"
        }
      ],
      "encounter": "final-guardian"
    },
    {
      "id": "c18-shield",
      "locationId": "c18-sanctum",
      "name": "永遠を閉じない盾",
      "kind": "story",
      "requires": [
        "c18-guardian"
      ],
      "pages": [
        {
          "speaker": "エターナルガーディアン",
          "text": "照会を受理。保護対象は命令ではなく、観測を行う者。帰還路の防護へ任務を変更。"
        },
        {
          "speaker": "リナ",
          "text": "終わらないのは閉鎖じゃなく、守り直す意志。この盾と突剣を、そのために受け取るわ。"
        }
      ],
      "weaponReward": "everward-shield-rapier"
    },
    {
      "id": "c18-sanctuary-cache",
      "locationId": "c18-sanctum",
      "name": "守護殿の救援箱",
      "kind": "treasure",
      "requires": [
        "c18-shield"
      ],
      "pages": [
        {
          "speaker": "オルフェ",
          "text": "帰還する者に渡す備えが、ここにもあった。私も、迎える側の仕事をしよう。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 3
      }
    },
    {
      "id": "c18-break",
      "locationId": "c18-watch",
      "name": "固定命令の正体",
      "kind": "story",
      "requires": [
        "c18-sanctuary-cache"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "終端固定核アナンケ。滅びを避ける計算を、一つの結末を強制する命令へ置き換えてしまった機構。"
        },
        {
          "speaker": "オルフェ",
          "text": "その対話形態が「終焉の星詠者・アストラエンド」だ。星詠み本人ではない。"
        },
        {
          "speaker": "リナ",
          "text": "恐れから始まったものでも、他の人の未来を奪う理由にはできない。"
        }
      ]
    },
    {
      "id": "c18-astel",
      "locationId": "c18-hall",
      "name": "剣を取る理由",
      "kind": "story",
      "requires": [
        "c18-break"
      ],
      "pages": [
        {
          "speaker": "アストラエンド",
          "text": "お前たちの勝利も、予測の一つに過ぎない。責任を負えぬなら、固定された未来を受け入れよ。"
        },
        {
          "speaker": "アステル",
          "text": "結果を全部知ることはできない。それでも、危険を知った人と話し、間違えたら選び直す責任は受け取れる。"
        },
        {
          "speaker": "アステル",
          "text": "僕は誰かの予言を成就するためじゃなく、一緒に明日を選ぶために剣を取る。"
        }
      ],
      "choiceId": "c18-astel"
    },
    {
      "id": "c18-hall-fight",
      "locationId": "c18-hall",
      "name": "閉ざされた選択殿",
      "kind": "battle",
      "requires": [
        "c18-astel"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "天球儀は違う空を比べる装置だった。鉄道と方舟は、違う場所の人を同じ決断へ縛るためのものじゃない。"
        },
        {
          "speaker": "リナ",
          "text": "星冠で残した余白も、墓標の未送信の返事も守る。道を開きましょう。"
        }
      ],
      "encounter": "final-hall"
    },
    {
      "id": "c18-hall-cache",
      "locationId": "c18-hall",
      "name": "選ぶ人への備蓄",
      "kind": "treasure",
      "requires": [
        "c18-hall-fight"
      ],
      "pages": [
        {
          "speaker": "ティア",
          "text": "ここには、うまくいった道と、戻った道の記録が両方ある。"
        },
        {
          "speaker": "メイ",
          "text": "どちらにも名前が残っている。誰かの旅を、失敗の一語で閉じないための箱だね。"
        }
      ],
      "itemReward": {
        "id": "ether",
        "count": 3
      }
    },
    {
      "id": "c18-resonate",
      "locationId": "c18-path",
      "name": "約束の共鳴",
      "kind": "story",
      "requires": [
        "c18-hall-cache"
      ],
      "pages": [
        {
          "speaker": "アステル",
          "text": "知ったことを、選ぶ人へ渡す。"
        },
        {
          "speaker": "リナ",
          "text": "選ぶ時間と、戻れる場所を守る。"
        },
        {
          "speaker": "メイ",
          "text": "過去を消さず、今の観測をつなぐ。"
        },
        {
          "speaker": "セリネ",
          "text": "三つの返事が共鳴した。閉じていた星路が、別々の明日へ開いていきます。"
        }
      ]
    },
    {
      "id": "c18-records",
      "locationId": "c18-observatory",
      "name": "最後の観測",
      "kind": "story",
      "requires": [
        "c18-resonate"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "原典の条件と、各地の観測が一致した。世界は一つの予測にしか進めないわけではなかった。"
        },
        {
          "speaker": "セリネ",
          "text": "私たちは誤差ではない。その場所で返事をする人たちだったのですね。"
        },
        {
          "speaker": "アステル",
          "text": "この双剣に、二つの道の印がある。違う歩幅も、同じ旅に重ねられるんだ。"
        }
      ],
      "weaponReward": "starseer-duals"
    },
    {
      "id": "c18-observatory-fight",
      "locationId": "c18-observatory",
      "name": "最後の星影",
      "kind": "battle",
      "requires": [
        "c18-records"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "中枢から反応が来る。最終決戦の前に、ここで通路を安定させましょう。"
        }
      ],
      "encounter": "final-observatory"
    },
    {
      "id": "c18-observatory-cache",
      "locationId": "c18-observatory",
      "name": "観測所の準備箱",
      "kind": "treasure",
      "requires": [
        "c18-observatory-fight"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "未来の保証はできない。でも、必要な備えを分け合うことはできる。"
        }
      ],
      "itemReward": {
        "id": "potion",
        "count": 3
      }
    },
    {
      "id": "c18-reform",
      "locationId": "c18-threshold",
      "name": "星の再編",
      "kind": "story",
      "requires": [
        "c18-observatory-cache"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "記録の保管と、未来を決める命令を分離する。旅で確かめた接続先は、一つも消さない。"
        },
        {
          "speaker": "リナ",
          "text": "帰還路、確保したわ。ティアたちはセリネと一緒に戻れる。"
        },
        {
          "speaker": "アステル",
          "text": "星が動く。あれは決められた線じゃない。今、返事を交わすための道だ。"
        }
      ]
    },
    {
      "id": "c18-promise",
      "locationId": "c18-threshold",
      "name": "最後に交わす約束",
      "kind": "story",
      "requires": [
        "c18-reform"
      ],
      "pages": [
        {
          "speaker": "ティア",
          "text": "勝って帰ったら、今度はどこへ行くの。"
        },
        {
          "speaker": "アステル",
          "text": "その時、みんなで話して決めたい。僕らだけで、誰かの旅の終わりを決めない。"
        },
        {
          "speaker": "リナ",
          "text": "約束する。守った先でも、あなたの声を聞く。"
        }
      ],
      "choiceId": "c18-promise"
    },
    {
      "id": "c18-ready",
      "locationId": "c18-altar",
      "name": "三人で行く",
      "kind": "rest",
      "requires": [
        "c18-promise"
      ],
      "pages": [
        {
          "speaker": "メイ",
          "text": "最終決戦は四段階。HPが75%、45%、20%を下回ると術式が変わる。予約された予兆は、そのまま解放されるよ。"
        },
        {
          "speaker": "リナ",
          "text": "速さを下げられても、行動順が変わるのは次のラウンド。防御と回復で立て直しましょう。"
        },
        {
          "speaker": "アステル",
          "text": "最後まで、三人で。準備ができたら進もう。"
        }
      ]
    },
    {
      "id": "c18-heart-cache",
      "locationId": "c18-heart",
      "name": "最後の救援箱",
      "kind": "treasure",
      "requires": [
        "c18-ready"
      ],
      "pages": [
        {
          "speaker": "リナ",
          "text": "回復品を確かめておきましょう。危険に備えることを、怖がりだなんて言わないわ。"
        }
      ],
      "itemReward": {
        "id": "ether",
        "count": 3
      }
    },
    {
      "id": "c18-oath",
      "locationId": "c18-heart",
      "name": "未来を引き受ける手",
      "kind": "story",
      "requires": [
        "c18-heart-cache"
      ],
      "pages": [
        {
          "speaker": "アステル",
          "text": "世界を救う答えを、僕だけのものにはしない。"
        },
        {
          "speaker": "リナ",
          "text": "この盾は、三人と、帰りを待つ人のために。"
        },
        {
          "speaker": "メイ",
          "text": "過去と現在をつなぐ。未来は、その先で選ぶ人のために残す。"
        }
      ]
    },
    {
      "id": "c18-final-boss",
      "locationId": "c18-heart",
      "name": "終焉の星詠者・アストラエンド",
      "kind": "boss",
      "requires": [
        "c18-oath"
      ],
      "pages": [
        {
          "speaker": "アストラエンド",
          "text": "終端固定核アナンケ、最終照合を開始。記録された終焉から、逸脱を認めない。"
        },
        {
          "speaker": "アステル",
          "text": "終わりを知ったことと、終わりだけを選ぶことは違う。僕たちは、共に選ぶ！"
        },
        {
          "speaker": "リナ",
          "text": "予兆が来る。三人とも、自分の命も守るのよ。"
        },
        {
          "speaker": "メイ",
          "text": "相手の言葉も記録する。でも、それを未来の命令にはさせない。"
        }
      ],
      "encounter": "final-astra-end",
      "weaponReward": "promise-wand"
    },
    {
      "id": "c18-aftermath",
      "locationId": "c18-return",
      "name": "固定の終わり",
      "kind": "story",
      "requires": [
        "c18-final-boss"
      ],
      "pages": [
        {
          "speaker": "アストラエンド",
          "text": "単一終端への固定を解除。観測記録は保持。次の入力を……待機する。"
        },
        {
          "speaker": "メイ",
          "text": "アナンケは止まった。でも、記録は残っている。なくしたものまで無かったことにはしない。"
        },
        {
          "speaker": "リナ",
          "text": "帰還路が光っている。まず、生きている人のもとへ帰りましょう。"
        },
        {
          "speaker": "アステル",
          "text": "星詠みの約束は、ここで果たせたんだね。僕らの答えで、次の人の明日を閉じずに。"
        }
      ]
    },
    {
      "id": "c18-voices",
      "locationId": "c18-return",
      "name": "帰りを待つ声",
      "kind": "story",
      "requires": [
        "c18-aftermath"
      ],
      "pages": [
        {
          "speaker": "セリネ",
          "text": "お帰りなさい。終着領域にも、新しい観測が届き始めています。"
        },
        {
          "speaker": "オルフェ",
          "text": "私は帰還の返事を受け取った。これからは、道を固定するのではなく、待つ任務を続けよう。"
        },
        {
          "speaker": "ティア",
          "text": "明日の予定を書いたよ。空欄も残した。変えたくなったら、また話していいんだもの。"
        },
        {
          "speaker": "リナ",
          "text": "ええ。その時も、一緒に考えましょう。"
        }
      ]
    },
    {
      "id": "c18-journey",
      "locationId": "c18-return",
      "name": "十八章の足跡",
      "kind": "story",
      "requires": [
        "c18-voices"
      ],
      "pages": [
        {
          "speaker": "記録",
          "text": "霧の森、灰の街、風の峡谷、水晶の都。星図と歌は、選ぶ人へ戻った。"
        },
        {
          "speaker": "記録",
          "text": "砂の王都、時の街、樹の根、浮島。方角も時刻も、暮らす人の返事と共にあった。"
        },
        {
          "speaker": "記録",
          "text": "地下都市、潮騒の観測所、巡礼路、常闇の森。声と光は、一つの予測に閉ざされなかった。"
        },
        {
          "speaker": "記録",
          "text": "機巧都市、方舟、虚空の聖域、星の墓標。異なる観測と、戻る道が残った。"
        },
        {
          "speaker": "メイ",
          "text": "終着領域で知った約束を、始原で今の言葉にできた。どの旅も、この答えを選ぶための道だった。"
        }
      ]
    },
    {
      "id": "c18-epilogue",
      "locationId": "c18-return",
      "name": "それぞれの明日",
      "kind": "story",
      "requires": [
        "c18-journey"
      ],
      "pages": [
        {
          "speaker": "記録",
          "text": "セレナはクリスタリアで目覚める人の声を聞き、ナディアはサハリアで道標を確かめる。残された歌と羅針盤の記録は、今を生きる人に読まれ続ける。"
        },
        {
          "speaker": "記録",
          "text": "各地の守護者は、それぞれが確かめ直した任務を続ける。遠く離れた街の暮らしは、旅人の一つの答えでは終わらない。"
        },
        {
          "speaker": "アステル",
          "text": "僕はまた剣を取るよ。誰かの代わりに答えを決めるためじゃなく、話せる場所を守るために。"
        },
        {
          "speaker": "リナ",
          "text": "私は、守られる人が自分の足で歩ける道を守る。休むことも、引き返すことも含めて。"
        },
        {
          "speaker": "メイ",
          "text": "私は記録を読み、今の観測を残す。知らないことを知ったふりせず、次の人へ問いを渡す。"
        }
      ]
    },
    {
      "id": "c18-tomorrow",
      "locationId": "c18-end",
      "name": "星が消えても",
      "kind": "story",
      "requires": [
        "c18-epilogue"
      ],
      "pages": [
        {
          "speaker": "アステル",
          "text": "森の最初の野営地を覚えてる？　誰も置いていかないって言った、あの朝。"
        },
        {
          "speaker": "リナ",
          "text": "覚えているわ。今度は、置いていかれないために自分の声を聞くことも、約束に加えたい。"
        },
        {
          "speaker": "メイ",
          "text": "星が消えても、約束は消えない。でも約束は、私たちを縛る鎖じゃない。"
        },
        {
          "speaker": "三人",
          "text": "また会うために、共に明日を選んでいこう。"
        }
      ]
    },
    {
      "id": "c18-credits",
      "locationId": "c18-end",
      "name": "この旅を支えたもの",
      "kind": "story",
      "requires": [
        "c18-tomorrow"
      ],
      "pages": [
        {
          "speaker": "スタッフロール",
          "text": "企画・制作：クレジット確定後に掲載\nシナリオ・ゲーム実装：制作担当\nキャラクター・背景：仮図形（正式素材は未収録）\n描画基盤：Phaser 3 / MIT License\nビルド基盤：Vite / MIT License\nプレイしてくださるあなたへ、感謝を込めて。"
        }
      ]
    },
    {
      "id": "c18-the-end",
      "locationId": "c18-end",
      "name": "THE END",
      "kind": "story",
      "requires": [
        "c18-credits"
      ],
      "pages": [
        {
          "speaker": "THE END",
          "text": "アストラクロニカ 〜星詠みの遺した約束〜\n未来は、共に選んでいくもの。"
        }
      ]
    },
    {
      "id": "c18-clear",
      "locationId": "c18-end",
      "name": "クリアデータを残す",
      "kind": "clear",
      "requires": [
        "c18-the-end"
      ],
      "pages": [
        {
          "speaker": "記録",
          "text": "十八章の旅は完結しました。クリアデータを保存して、解放済みの場所の探索や未完了の依頼を続けられます。最終決戦が自動的に再開することはありません。"
        }
      ]
    }
  ],
  "preview": "全18章の物語は完結しました。解放済みの場所で、まだ出会っていない明日を探せます。"
};
