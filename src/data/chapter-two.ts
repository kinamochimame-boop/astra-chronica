import type {Chapter,Dialogue} from './chapter-one';
const p=(speaker:string,text:string):Dialogue=>({speaker,text});
export const cityNpcs=[
 {name:'ナナ',personality:'世話焼きのパン屋。灰の中でも朝の支度を欠かさない。'},
 {name:'オルト',personality:'几帳面な時計修理工。冗談にも時刻で返す。'},
 {name:'セラ',personality:'好奇心旺盛な若い星図師。古い記録を大切にする。'},
 {name:'ピコ',personality:'街を走る配達人。小さな頼み事も放っておけない。'},
];
export const chapterTwo:Chapter={id:'chapter-02',requiresChapterId:'chapter-01',name:'灰の街と消えた星図',setting:'ルミナス旧市街',preview:'第3章予告：星図が示す風の峡谷へ。鐘に応えた光は、まだ名も知らない道を照らす。',locations:[
 {id:'c2-road',name:'灰降る街道',icon:'⋰',description:'森を抜けると、風に乗った灰が降っていた。遠くに動かない時計塔が見える。'},
 {id:'c2-town',name:'ルミナス旧市街',icon:'⌂',description:'灰を掃く住民たち。街の時計は止まっても、暮らしは止まらない。'},
 {id:'c2-market',name:'崩れた市場',icon:'▤',description:'閉じた露店に小さな影が群がる。荷台の下で薬箱が淡く光っている。'},
 {id:'c2-workshop',name:'星図師の工房',icon:'✧',description:'机に並ぶ三つの星図片。失われた絵は、街の道順を表しているらしい。'},
 {id:'c2-canal',name:'地下水路',icon:'≈',description:'水音にまぎれて金属の足音が響く。塔へつながる古い通路を番人が塞ぐ。'},
 {id:'c2-square',name:'灯火の広場',icon:'♨',description:'夕方の広場に人が集まる。小さな灯火と温かいスープが旅人を迎える。'},
 {id:'c2-library',name:'忘却の書庫',icon:'▥',description:'棚の奥に、星詠みと街の鐘を結ぶ記録が眠る。'},
 {id:'c2-stairs',name:'時計塔への階段',icon:'▰',description:'灰に埋もれた長い階段。古い番兵たちはまだ持ち場を守っている。'},
 {id:'c2-clock',name:'止まった時計塔',icon:'◷',description:'動かない歯車の向こうで、存在しないはずの鐘が鳴った。'},
 {id:'c2-belfry',name:'星のない鐘楼',icon:'♜',description:'鐘の影に大きな守護者が立つ。その胸に、消えた星図の光がある。'},
],events:[
 {id:'c2-arrival',locationId:'c2-road',kind:'story',name:'森の先の灰',requires:[],pages:[p('アステル','霧は晴れたのに、今度は空から灰か。旅の洗濯物が増えそうだ。'),p('リナ','まずは目をこすらないこと。それから洗濯。順番は大切よ。'),p('メイ','星図の線、あの時計塔へ続いている。風の街と呼ばれたルミナス……今は、こんなに静かなんだね。')]},
 {id:'c2-residents',locationId:'c2-town',kind:'story',name:'止まった時計と焼きたてのパン',requires:['c2-arrival'],pages:[p('ナナ','旅の子たちかい？ 灰は払えても、お腹は払っても膨れないよ。パンをお食べ。'),p('アステル','それなら得意分野です！ ……代金は、ちゃんと払います。'),p('オルト','私は時計直しのオルト。時計塔は三十年止まったままだ。なのに最近、夜だけ鐘が鳴る。しかも皆、同じ夢を見るんだ。'),p('メイ','同じ夢？ 星図を探す誰かの姿とか……？'),p('ナナ','灯りのない道を歩いて、鐘の下へ行く夢さ。星図師のセラなら何か知っている。市場を抜けた工房にいるよ。'),p('リナ','街のことを教えてくれて、ありがとう。まずは市場の道を確かめましょう。')]},
 {id:'c2-market-fight',locationId:'c2-market',kind:'battle',name:'露店の影を払う',requires:['c2-residents'],encounter:'city-market',pages:[p('アステル','商品を荒らしているのは、あの魔物たちか。まとめて相手をするより、一体ずついこう。'),p('メイ','星屑スライムは火に弱そう。錆びた番兵には魔法や破甲撃を試せるね。')]},
 {id:'c2-potion-chest',locationId:'c2-market',kind:'treasure',name:'薬売りの薬箱',requires:['c2-market-fight'],itemReward:{id:'potion',count:2},pages:[p('ナナ','道を開いてくれたお礼だよ。星露の小瓶を二つ。生きている仲間のHPを100戻せる。'),p('リナ','使うのにも一手必要なのね。苦しくなる前に備えておきましょう。')]},
 {id:'c2-fragments',locationId:'c2-workshop',kind:'story',name:'三枚の星図片',requires:['c2-potion-chest'],puzzle:{pieces:[{id:'lamp',name:'灯の断片'},{id:'path',name:'道の断片'},{id:'bell',name:'鐘の断片'}],solution:['lamp','path','bell'],hint:'「灯をともす。道をたどる。鐘へ至る」。灯→道→鐘の順で選びます。'},pages:[p('セラ','星図を探しているの？ 昨晩、工房の星図だけが白紙になったの。残った三枚も、順番が分からなくて。'),p('メイ','端の文字を読んでみるね。「灯をともす。道をたどる。鐘へ至る」。旅の始まりから並べればよさそう。'),p('アステル','僕ならまずパン、その次に……。'),p('リナ','それはお腹の地図。今回は灯と道と鐘よ。'),p('セラ','ふふ、何度組み直しても壊れないから大丈夫。完成したら地下水路の入口が読めるはず。')]},
 {id:'c2-canal-fight',locationId:'c2-canal',kind:'battle',name:'灯を奪う影',requires:['c2-fragments'],encounter:'city-canal',pages:[p('メイ','灯喰いの影がいる。暗闇にされたら物理攻撃が外れることもあるから気をつけて。')]},
 {id:'c2-keeper',locationId:'c2-canal',kind:'boss',name:'地下水路の番人',requires:['c2-canal-fight'],encounter:'city-keeper',pages:[p('リナ','あの番人、盾を閉じる周期があるわ。守りを固めたらこちらも回復や防御。開いた時に攻めましょう。'),p('アステル','力任せにぶつかるだけじゃ駄目なんだね。間を読んでみる。')]},
 {id:'c2-rest',locationId:'c2-square',kind:'rest',name:'灯火の休息',requires:['c2-keeper'],pages:[p('ピコ','地下を抜けてきたの？ すごいな！ 僕は配達人のピコ。こっち、温かいスープがあるよ。'),p('アステル','本日二度目の歓迎……この街、いい街だ。'),p('メイ','灯火を見ると呼吸が落ち着くね。次の戦いもHPとMPを全快で始められるよ。')]},
 {id:'c2-shield-gift',locationId:'c2-square',kind:'story',name:'街を守る人から',requires:['c2-rest'],weaponReward:'ashward-shield-spear',pages:[p('ピコ','ナナさんからこれを届けるよう頼まれたんだ。昔、広場を守っていた人の「灰守りの槍盾」だって。'),p('リナ','街の守りを預かるのね。ありがとう。必ず、無事に戻ってくる。'),p('ピコ','鐘が止んだら、皆で違う夢を見られるかな。僕は海の夢がいい！')]},
 {id:'c2-library-clue',locationId:'c2-library',kind:'story',name:'星詠みの余白',requires:['c2-shield-gift'],pages:[p('セラ','古い書庫の鍵を持ってきたよ。ここに星詠みが滞在した記録があるはず。'),p('メイ','「鐘は時を告げるものにあらず。道を忘れた光に、帰る場所を教えるもの」……この筆跡、あの人と似ている。'),p('アステル','時計が止まっても鐘が鳴る理由は、それなのかな。消えた星図も、帰り道を探している？'),p('リナ','答えはまだ一つに決めなくていい。けれど、鐘が苦しんでいるなら確かめに行こう。'),p('セラ','昔の星詠みは、ここから風の峡谷へ向かったらしい。ページの続きは破れているけれど。')]},
 {id:'c2-ether-chest',locationId:'c2-library',kind:'treasure',name:'書庫の備え',requires:['c2-library-clue'],itemReward:{id:'ether',count:2},pages:[p('メイ','灯火の雫が二つ。味方のMPを30戻せる。大切な魔法のために持っていこう。')]},
 {id:'c2-stairs-fight',locationId:'c2-stairs',kind:'battle',name:'塔の番兵たち',requires:['c2-ether-chest'],encounter:'city-stairs',pages:[p('リナ','塔の兵たちまで動き出している。ここを越えれば鐘楼よ。回復と守りを忘れずに。')]},
 {id:'c2-clock-story',locationId:'c2-clock',kind:'story',name:'時を刻まぬ鐘',requires:['c2-stairs-fight'],pages:[p('オルト','ここまで来たか。地上で歯車を固定しておく。君たちは鐘へ！'),p('メイ','鐘の音が、星図の光を集めている。守護者はそれを戻せずにいるのかもしれない。'),p('リナ','構えを変えたら予兆を見て。強い一撃には防御、傷ついたら回復。焦らず三人で。')]},
 {id:'c2-sword-chest',locationId:'c2-clock',kind:'treasure',name:'星鉄の贈り物',requires:['c2-clock-story'],weaponReward:'starsteel-sword',pages:[p('オルト','セラの工房に残っていた剣だ。星鉄の刃なら、あの守護者の装甲にも届くだろう。'),p('アステル','星鉄の剣……。街の皆がつないでくれた道だ。必ず戻ってくるよ。')]},
 {id:'c2-guardian',locationId:'c2-belfry',kind:'boss',name:'忘鐘の守護者',requires:['c2-sword-chest'],encounter:'city-bell',weaponReward:'lamplight-rod',pages:[p('忘鐘の守護者','――鐘の下で、忘れられた光が脈打つ。'),p('アステル','その光は、閉じ込めておくためのものじゃない。帰り道を、一緒に探そう！')]},
 {id:'c2-clear',locationId:'c2-belfry',kind:'clear',name:'戻った星図',requires:['c2-guardian'],pages:[p('メイ','星図が戻った……。鐘の中に集まった光が、紙の上へ帰っていく。'),p('リナ','守護者も静かになったわ。壊すためじゃなく、守り続けていたのね。'),p('セラ','星図の続きは風の峡谷を指している。星詠みが遺した約束を、私も記録しておくよ。'),p('アステル','また寄るよ。今度は灰を払うだけじゃなく、ちゃんと洗濯も済ませてから。'),p('ナナ','その時はパンを焼いて待っているさ。道の先でも、三人そろって食べるんだよ。')]},
]};
