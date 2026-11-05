import type {Command,Element,Stat,StatusId} from '../types';
import type {HeroId} from './weapons';
export type TreeStat=Stat|'maxHp'|'maxMp';
export type TreeEffect=
 |{kind:'stat';stat:TreeStat;value:number}
 |{kind:'commandPower'|'commandHeal'|'commandCost'|'modifierDuration'|'modifierStrength'|'statusChance';command:Command;value:number}
 |{kind:'elementPower';element:Element;value:number}
 |{kind:'resistance';status:StatusId;value:number}
 |{kind:'criticalRate'|'criticalDamage'|'healing'|'receivedHealing'|'magicPower'|'damageReduction'|'bowSpeed'|'dualPower'|'lowHpPower'|'ultimatePower'|'guardReduction'|'coverReduction'|'tauntRounds'|'defendReduction'|'hpDefense'|'mpDiscount'|'starGain'|'lowHpReduction';value:number};
export interface TreeNode {id:string;hero:HeroId;branch:string;name:string;description:string;level:number;requires:string[];cost:number;effect:TreeEffect;x:number;y:number;maxRank:1}
export interface TreeBranch {hero:HeroId;id:string;name:string;description:string}
export const treeBranches:TreeBranch[]=[
 {hero:'astel',id:'sword',name:'剣技・攻撃',description:'単体攻撃と剣技、必殺技の威力を磨く。'},
 {hero:'astel',id:'technique',name:'速攻・技巧',description:'速度・会心と弓／双剣の扱いを磨く。'},
 {hero:'astel',id:'courage',name:'勇気・生存',description:'生存力と低HP時の粘りを育てる。'},
 {hero:'rina',id:'fortress',name:'鉄壁・防御',description:'ガードと防御、体力を活かす守り。'},
 {hero:'rina',id:'guardian',name:'守護・支援',description:'かばう・挑発・守護の陣を強化する。'},
 {hero:'rina',id:'control',name:'反撃・制圧',description:'攻撃に転じる備えとシールドバッシュによる制圧。自動反撃は追加しない。'},
 {hero:'mei',id:'elements',name:'元素魔法',description:'既存属性の攻撃魔法と追加効果を磨く。'},
 {hero:'mei',id:'healing',name:'治癒・補助',description:'単体・全体回復と継戦の守りを育てる。'},
 {hero:'mei',id:'astral',name:'星術・魔力',description:'魔力・消費MP・星力を整える。'},
];
const stat=(stat:TreeStat,value:number):TreeEffect=>({kind:'stat',stat,value});
const command=(kind:'commandPower'|'commandHeal'|'commandCost'|'modifierDuration'|'modifierStrength'|'statusChance',command:Command,value:number):TreeEffect=>({kind,command,value});
const effect=(kind:Exclude<TreeEffect['kind'],'stat'|'commandPower'|'commandHeal'|'commandCost'|'modifierDuration'|'modifierStrength'|'statusChance'|'elementPower'|'resistance'>,value:number):TreeEffect=>({kind,value});
const element=(element:Element,value:number):TreeEffect=>({kind:'elementPower',element,value});
const resist=(status:StatusId,value=0.15):TreeEffect=>({kind:'resistance',status,value});
type Spec=[string,string,string,TreeEffect];
const specs:Record<HeroId,Record<string,Spec[]>>={
 astel:{sword:[
 ['edge','剣の基礎','攻撃力＋3',stat('attack',3)],['strike','踏み込み','通常攻撃威力＋10%',command('commandPower','attack',0.1)],
 ['strong','強撃の極意','強撃の威力＋15%',command('commandPower','strong',0.15)],['breath','剣士の呼吸','最大MP＋5',stat('maxMp',5)],
 ['fang','連牙の研磨','連牙斬の各ヒット威力＋12%',command('commandPower','fang',0.12)],['breaker','鎧砕き','破甲撃の威力＋15%',command('commandPower','armorBreak',0.15)],
 ['economy','無駄なき一撃','強撃の消費MP−1（元コストの半分以上）',command('commandCost','strong',1)],['resolve','窮地の剣','HP30%以下で物理威力＋20%',effect('lowHpPower',0.2)],
 ['finisher','星断の誓い','攻撃必殺技威力＋20%',effect('ultimatePower',0.2)],['master','剣心','攻撃力＋6',stat('attack',6)],
 ],technique:[
 ['step','軽やかな足','素早さ＋2',stat('speed',2)],['aim','急所の見極め','会心率＋3ポイント（合計上限50%）',effect('criticalRate',0.03)],
 ['bow','風切りの姿勢','弓装備時のみ素早さ＋3',effect('bowSpeed',3)],['twins','双月の型','双剣の通常攻撃各ヒット威力＋10%',effect('dualPower',0.1)],
 ['gale','疾風の刃','疾風斬の威力＋15%',command('commandPower','galeSlash',0.15)],['clarity','澄んだ視界','暗闇耐性＋15ポイント',resist('blind')],
 ['critical','鋭き閃光','会心時の倍率＋0.15（上限2.5倍）',effect('criticalDamage',0.15)],['flow','流れる歩法','疾風斬の自己補正持続＋1行動',command('modifierDuration','galeSlash',1)],
 ['velocity','星追いの速さ','素早さ＋4',stat('speed',4)],['precision','必中への集中','会心率＋5ポイント（合計上限50%）',effect('criticalRate',0.05)],
 ],courage:[
 ['vital','旅人の体力','最大HP＋15',stat('maxHp',15)],['armor','旅装の備え','防御力＋1',stat('defense',1)],
 ['poison','毒に慣れる','毒耐性＋15ポイント',resist('poison')],['recover','仲間への信頼','受ける回復量＋10%',effect('receivedHealing',0.1)],
 ['brace','身を低く','防御コマンドの被ダメージ倍率−0.05',effect('defendReduction',0.05)],['sleep','意志の灯','睡眠耐性＋15ポイント',resist('sleep')],
 ['endure','消えない勇気','HP30%以下で直接被ダメージ10%軽減',effect('lowHpReduction',0.1)],['burn','火を越える','火傷耐性＋15ポイント',resist('burn')],
 ['heart','約束の命脈','最大HP＋30',stat('maxHp',30)],['shelter','星の護り','直接被ダメージ5%軽減',effect('damageReduction',0.05)],
 ]},
 rina:{fortress:[
 ['plate','盾の基礎','防御力＋2',stat('defense',2)],['vital','守り手の体力','最大HP＋20',stat('maxHp',20)],
 ['guard','鉄壁の構え','ガードの被ダメージ倍率−0.05',effect('guardReduction',0.05)],['defend','堅実な備え','防御コマンドの被ダメージ倍率−0.05',effect('defendReduction',0.05)],
 ['body','体幹の鍛錬','最大HPの1%（切捨て）を防御力へ加算',effect('hpDefense',0.01)],['freeze','凍らぬ意志','凍結耐性＋15ポイント',resist('freeze')],
 ['ward','衝撃を流す','直接被ダメージ5%軽減',effect('damageReduction',0.05)],['guard-cost','盾捌き','ガードの消費MP−1（元コストの半分以上）',command('commandCost','guard',1)],
 ['bulwark','不倒の体','最大HP＋35',stat('maxHp',35)],['last-wall','最後の壁','HP30%以下で直接被ダメージ15%軽減',effect('lowHpReduction',0.15)],
 ],guardian:[
 ['care','受け継ぐ灯','受ける回復量＋10%',effect('receivedHealing',0.1)],['reserve','守護の余力','最大MP＋5',stat('maxMp',5)],
 ['cover','庇護の技','かばうの被ダメージ倍率−0.10',effect('coverReduction',0.1)],['taunt','響く挑発','挑発持続＋1ラウンド',effect('tauntRounds',1)],
 ['field','広がる守護','守護の陣の補正持続＋1行動',command('modifierDuration','guardianField',1)],['field-power','強き陣形','守護の陣の防御補正＋5ポイント',command('modifierStrength','guardianField',0.05)],
 ['cover-cost','迷いなき庇護','かばうの消費MP−1（元コストの半分以上）',command('commandCost','cover',1)],['silence','伝わる意志','沈黙耐性＋15ポイント',resist('silence')],
 ['rally','守護の星脈','有効な星力獲得ごとに＋2（加算上限10）',effect('starGain',2)],['oath','誓いの持久力','最大MP＋8',stat('maxMp',8)],
 ],control:[
 ['force','槍の鍛錬','攻撃力＋3',stat('attack',3)],['step','踏み返す足','素早さ＋1',stat('speed',1)],
 ['bash','制圧の盾','シールドバッシュの威力＋15%',command('commandPower','shieldBash',0.15)],['shock','痺れる衝撃','シールドバッシュの麻痺確率＋10ポイント',command('statusChance','shieldBash',0.1)],
 ['aim','隙を読む','会心率＋3ポイント（合計上限50%）',effect('criticalRate',0.03)],['nerve','不屈の神経','麻痺耐性＋15ポイント',resist('paralysis')],
 ['pressure','押し返す盾','通常攻撃威力＋12%',command('commandPower','attack',0.12)],['bash-cost','巧みな盾撃','シールドバッシュの消費MP−1（元コストの半分以上）',command('commandCost','shieldBash',1)],
 ['courage','逆境の槍','HP30%以下で物理威力＋15%',effect('lowHpPower',0.15)],['force-master','守り抜く力','攻撃力＋5',stat('attack',5)],
 ]},
 mei:{elements:[
 ['fire','火の理解','火属性攻撃魔法威力＋10%',element('fire',0.1)],['water','水の理解','水属性攻撃魔法（アイス）威力＋10%',element('water',0.1)],
 ['wind','風の理解','風属性攻撃魔法（サンダー）威力＋10%',element('wind',0.1)],['magic','元素の調和','属性攻撃魔法威力＋5%',effect('magicPower',0.05)],
 ['freeze','凍結の紋','アイスの凍結確率＋10ポイント',command('statusChance','ice',0.1)],['thunder','雷鳴の紋','サンダーの麻痺確率＋10ポイント',command('statusChance','thunder',0.1)],
 ['fire-cost','小さな火種','ファイアの消費MP−1（元コストの半分以上）',command('commandCost','fire',1)],['focus','魔法の急所','会心率＋3ポイント（合計上限50%）',effect('criticalRate',0.03)],
 ['resonance','元素共鳴','属性攻撃魔法威力＋10%',effect('magicPower',0.1)],['flare','燃える星灯','ファイアの威力＋15%',command('commandPower','fire',0.15)],
 ],healing:[
 ['heal','癒しの基礎','ヒール回復量＋10%',command('commandHeal','heal',0.1)],['vital','癒し手の体力','最大HP＋12',stat('maxHp',12)],
 ['healing','優しい手','すべての回復スキルの回復量＋5%',effect('healing',0.05)],['heal-cost','無駄なき癒し','ヒールの消費MP−1（元コストの半分以上）',command('commandCost','heal',1)],
 ['group','広がる癒し','グループヒール回復量＋15%',command('commandHeal','groupHeal',0.15)],['silence','静寂を越えて','沈黙耐性＋15ポイント',resist('silence')],
 ['shelter','癒し手の守り','直接被ダメージ5%軽減',effect('damageReduction',0.05)],['group-cost','調和の詠唱','グループヒールの消費MP−1（元コストの半分以上）',command('commandCost','groupHeal',1)],
 ['miracle','奇跡の輝き','星詠みの奇跡の回復量＋20%',command('commandHeal','miracle',0.2)],['mercy','慈しみの星脈','すべての回復スキルの回復量＋10%',effect('healing',0.1)],
 ],astral:[
 ['mana','魔力の器','最大MP＋6',stat('maxMp',6)],['star','星との呼吸','有効な星力獲得ごとに＋2（加算上限10）',effect('starGain',2)],
 ['economy','節約の詠唱','MP消費をさらに1軽減（元コストの半分以上）',effect('mpDiscount',1)],['speed','詠唱の律動','素早さ＋2',stat('speed',2)],
 ['deep-mana','深き魔力','最大MP＋8',stat('maxMp',8)],['clarity','澄んだ精神','暗闇耐性＋15ポイント',resist('blind')],
 ['starlight','星脈の循環','有効な星力獲得ごとに＋3（加算上限10）',effect('starGain',3)],['critical','星の瞬き','会心時の倍率＋0.15（上限2.5倍）',effect('criticalDamage',0.15)],
 ['vast-mana','星海の器','最大MP＋12',stat('maxMp',12)],['wisdom','星詠みの智慧','MP消費をさらに1軽減（元コストの半分以上）',effect('mpDiscount',1)],
 ]},
};
export const treeNodes:readonly TreeNode[]=treeBranches.flatMap(b=>specs[b.hero][b.id].map(([slug,name,description,effect],i,list)=>({
 id:`${b.hero}-${b.id}-${slug}`,hero:b.hero,branch:b.id,name,description,level:[2,5,10,18,30][Math.floor(i/2)],
 requires:i<2?[]:(i===8?[6,7]:[i-2]).map(n=>`${b.hero}-${b.id}-${list[n][0]}`),cost:1,effect,x:i%2?210:70,y:50+Math.floor(i/2)*100,maxRank:1 as const,
})));
export const treeNode=(id:unknown)=>typeof id==='string'?treeNodes.find(n=>n.id===id):undefined;
