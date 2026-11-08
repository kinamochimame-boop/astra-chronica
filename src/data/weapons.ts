import type {Stat} from '../types';
export type HeroId='astel'|'rina'|'mei';
export type WeaponFamily='sword'|'bow'|'dualBlades'|'shieldSpear'|'shieldFlail'|'shieldRapier'|'wand'|'rod'|'mace';
export interface Weapon {
 id:string;name:string;family:WeaponFamily;owner:HeroId;bonuses:Partial<Record<Stat|'maxHp'|'maxMp',number>>;
 effects:{normalHits?:number;healingRate?:number;magicRate?:number;criticalRate?:number;guardReduction?:number;coverReduction?:number};description:string;
}
export const WEAPON_FAMILIES:Record<WeaponFamily,string>={sword:'剣',bow:'弓',dualBlades:'双剣',shieldSpear:'盾＆槍',shieldFlail:'盾＆フレイル',shieldRapier:'盾＆突剣',wand:'ワンド',rod:'ロッド',mace:'メイス'};
/** Bonuses are the complete totals. Family labels never add stats a second time. */
export const weapons:readonly Weapon[]=[
 {id:'travelers-sword',name:'旅人の剣',family:'sword',owner:'astel',bonuses:{attack:4},effects:{},description:'標準型の剣。攻撃＋4。追加効果なし。'},
 {id:'windcut-bow',name:'風切りの弓',family:'bow',owner:'astel',bonuses:{attack:2,speed:4},effects:{},description:'軽快な弓。攻撃＋2、素早さ＋4。'},
 {id:'twinmoon-daggers',name:'双月の短剣',family:'dualBlades',owner:'astel',bonuses:{attack:3},effects:{normalHits:2},description:'攻撃＋3。通常攻撃のみ0.5倍×2ヒット。途中撃破で中止。'},
 {id:'apprentice-shield-spear',name:'見習いの盾槍',family:'shieldSpear',owner:'rina',bonuses:{attack:2,defense:5},effects:{},description:'防御重視の盾と槍。攻撃＋2、防御＋5。'},
 {id:'ironring-shield-flail',name:'鉄環の盾槌',family:'shieldFlail',owner:'rina',bonuses:{attack:4,defense:3},effects:{},description:'攻撃重視の盾とフレイル。攻撃＋4、防御＋3。'},
 {id:'silver-shield-rapier',name:'白銀の盾剣',family:'shieldRapier',owner:'rina',bonuses:{attack:3,defense:4,speed:1},effects:{},description:'攻守の整った盾と突剣。攻撃＋3、防御＋4、素早さ＋1。'},
 {id:'starlight-wand',name:'星灯のワンド',family:'wand',owner:'mei',bonuses:{attack:2},effects:{healingRate:1.1},description:'攻撃＋2。回復スキル・回復必殺技の回復量＋10%。'},
 {id:'azurecrystal-rod',name:'蒼晶のロッド',family:'rod',owner:'mei',bonuses:{attack:3},effects:{magicRate:1.1},description:'攻撃＋3。属性魔法（回復を除く）の威力＋10%。'},
 {id:'prayer-mace',name:'祈りのメイス',family:'mace',owner:'mei',bonuses:{attack:4,maxHp:15},effects:{},description:'攻撃＋4、最大HP＋15。'},
];
export const chapterWeapons:readonly Weapon[]=[
 {id:'starsteel-sword',name:'星鉄の剣',family:'sword',owner:'astel',bonuses:{attack:7},effects:{},description:'工房に遺された剣。攻撃＋7。'},
 {id:'ashward-shield-spear',name:'灰守りの槍盾',family:'shieldSpear',owner:'rina',bonuses:{attack:3,defense:7},effects:{},description:'街の守り手の槍盾。攻撃＋3、防御＋7。'},
 {id:'lamplight-rod',name:'灯火のロッド',family:'rod',owner:'mei',bonuses:{attack:4},effects:{magicRate:1.15},description:'鐘楼の光を宿すロッド。攻撃＋4、属性攻撃魔法＋15%。'},
];
export const chapterThreeWeapons:readonly Weapon[]=[
 {id:'windsplit-dual',name:'風裂きの双剣',family:'dualBlades',owner:'astel',bonuses:{attack:8},effects:{normalHits:2},description:'攻撃＋8。通常攻撃は0.5倍×2ヒット。途中撃破で打切り。'},
 {id:'heavenward-shield-spear',name:'天守の盾槍',family:'shieldSpear',owner:'rina',bonuses:{attack:4,defense:9},effects:{coverReduction:0.05},description:'攻撃＋4、防御＋9。かばうの被ダメージ倍率−0.05。'},
 {id:'starwind-wand',name:'星風のワンド',family:'wand',owner:'mei',bonuses:{attack:5},effects:{magicRate:1.18,healingRate:1.1},description:'攻撃＋5。属性攻撃魔法＋18%、回復量＋10%。'},
];
export const chapterFourWeapons:readonly Weapon[]=[
 {id:'crystal-edge-sword',name:'晶刃の剣',family:'sword',owner:'astel',bonuses:{attack:8},effects:{criticalRate:0.04},description:'攻撃＋8、会心率＋4ポイント（既存上限まで）。単発の剣。'},
 {id:'resonance-shield-flail',name:'共鳴の盾槌',family:'shieldFlail',owner:'rina',bonuses:{attack:6,defense:8},effects:{guardReduction:0.05},description:'盾＆フレイル系。攻撃＋6、防御＋8。ガードの被ダメージ倍率−0.05（防御には適用しない）。'},
 {id:'mooncrystal-rod',name:'月晶のロッド',family:'rod',owner:'mei',bonuses:{attack:5,maxMp:8},effects:{magicRate:1.18},description:'攻撃＋5、最大MP＋8、属性攻撃魔法＋18%。回復量の補正なし。'},
];
export const chapterFiveWeapons:readonly Weapon[]=[
 {id:'sandstar-duals',name:'砂星の双剣',family:'dualBlades',owner:'astel',bonuses:{attack:9,speed:3},effects:{normalHits:2},description:'攻撃＋9、速度＋3。通常攻撃は0.5倍×2。連牙斬等のヒット数は増やさない。'},
 {id:'saharia-guard-spear',name:'王都守護の盾槍',family:'shieldSpear',owner:'rina',bonuses:{attack:4,defense:11},effects:{guardReduction:0.05},description:'攻撃＋4、防御＋11。ガード被ダメージ倍率−0.05（共通防御には適用しない）。'},
 {id:'mirage-wand',name:'蜃気楼のワンド',family:'wand',owner:'mei',bonuses:{attack:5,maxMp:10},effects:{magicRate:1.18},description:'攻撃＋5、最大MP＋10。属性攻撃魔法＋18%。回復補正なし。'},
];
export const chapterSixWeapons:readonly Weapon[]=[
 {id:'froststar-bow',name:'霜星の弓',family:'bow',owner:'astel',bonuses:{attack:10,speed:5},effects:{},description:'攻撃＋10、速度＋5。軽い弓で先手を取る。通常攻撃は1ヒット。'},
 {id:'timeward-shield-rapier',name:'時守の盾突剣',family:'shieldRapier',owner:'rina',bonuses:{attack:5,defense:12,speed:2},effects:{guardReduction:0.05},description:'攻撃＋5、防御＋12、速度＋2。ガード被ダメージ倍率−0.05（共通防御には適用しない）。'},
 {id:'dawncrystal-rod',name:'暁晶のロッド',family:'rod',owner:'mei',bonuses:{attack:6,maxMp:12},effects:{magicRate:1.2},description:'攻撃＋6、最大MP＋12。属性攻撃魔法＋20%。回復補正なし。'},
];
export const chapterSevenWeapons:readonly Weapon[]=[
 {id:'verdant-star-duals',name:'翠星の双剣',family:'dualBlades',owner:'astel',bonuses:{attack:10,speed:3},effects:{normalHits:2},description:'攻撃＋10、速度＋3。通常攻撃0.5倍×2。霜星の弓より速度を抑えた連撃型。'},
 {id:'groveward-shield-spear',name:'樹護の盾槍',family:'shieldSpear',owner:'rina',bonuses:{attack:4,defense:14,maxHp:8},effects:{guardReduction:0.03},description:'攻撃＋4、防御＋14、最大HP＋8。ガード倍率−0.03。時守の盾突剣より耐久重視、速度補正なし。'},
 {id:'startree-wand',name:'星樹のワンド',family:'wand',owner:'mei',bonuses:{attack:5,maxMp:8},effects:{healingRate:1.15,magicRate:1.12},description:'攻撃＋5、最大MP＋8。回復量＋15%、属性魔法＋12%。暁晶のロッドより回復重視。'},
];
export const chapterEightWeapons:readonly Weapon[]=[
 {id:'skysoar-sword',name:'天翔の剣',family:'sword',owner:'astel',bonuses:{attack:13,defense:1,speed:1},effects:{},description:'帰る道を照らす剣。双剣より速度を落とし、単発の攻撃を高める。'},
 {id:'azurewing-shield-flail',name:'蒼翼の盾フレイル',family:'shieldFlail',owner:'rina',bonuses:{attack:9,defense:13,maxHp:5},effects:{},description:'蒼い盾と鎖の槌。盾槍の防御特性と引き換えに攻撃を高める。'},
 {id:'starwind-rod',name:'星風のロッド',family:'rod',owner:'mei',bonuses:{attack:7,maxMp:14},effects:{magicRate:1.22},description:'空の航路を映すロッド。ワンドの回復特性と引き換えに魔法とMPを高める。'},
];
export const chapterNineWeapons:readonly Weapon[]=[
 {id:'starvein-duals',name:'星脈の双剣',family:'dualBlades',owner:'astel',bonuses:{attack:14,speed:3},effects:{normalHits:2},description:'星脈をなぞる二振り。剣の防御補正と引き換えに速度と連撃を得る。'},
 {id:'crystalwall-shield-rapier',name:'晶壁の盾突剣',family:'shieldRapier',owner:'rina',bonuses:{attack:8,defense:16,speed:3},effects:{guardReduction:.01},description:'結晶の盾と細い剣。フレイルの攻撃・HPと引き換えに防御と速度を高める。'},
 {id:'memory-crystal-mace',name:'記憶晶のメイス',family:'mace',owner:'mei',bonuses:{attack:12,maxHp:30,maxMp:6},effects:{healingRate:1.08},description:'記録を守る結晶の槌。ロッドの魔法補正とMPを減らし、HP・物理・回復を支える。'},
];
export const chapterTenWeapons:readonly Weapon[]=[
 {id:'tidestar-bow',name:'潮星の弓',family:'bow',owner:'astel',bonuses:{attack:13,speed:7},effects:{},description:'岸へ合図を届ける弓。双剣の連撃と引き換えに速度を高める。'},
 {id:'azure-tide-shield-spear',name:'蒼潮の盾槍',family:'shieldSpear',owner:'rina',bonuses:{attack:9,defense:18,maxHp:10},effects:{guardReduction:.01},description:'潮門を支える盾と槍。突剣の速度と引き換えに防御とHPを得る。'},
 {id:'starlamp-rod',name:'星灯のロッド',family:'rod',owner:'mei',bonuses:{attack:12,maxMp:10},effects:{magicRate:1.24},description:'変化を知らせる光のロッド。メイスのHPと回復補正を失い、属性魔法とMPを高める。'},
];
export const chapterElevenWeapons:readonly Weapon[]=[
 {id:'whitestar-dual-blades',name:'白星の双剣',family:'dualBlades',owner:'astel',bonuses:{attack:14,speed:3},effects:{normalHits:2},description:'対の光を刻む二振り。通常攻撃0.5倍×2、弓より速度を落として攻撃を重視。'},
 {id:'pilgrim-shield-flail',name:'巡礼守の盾フレイル',family:'shieldFlail',owner:'rina',bonuses:{attack:13,defense:15,maxHp:25},effects:{guardReduction:.01},description:'帰り道を守る盾と鎖球。盾槍より防御を抑え、攻撃とHPを支える。'},
 {id:'starvoice-wand',name:'星声のワンド',family:'wand',owner:'mei',bonuses:{attack:10,maxMp:12},effects:{healingRate:1.25},description:'声の主を待つ杖。ロッドの属性魔法補正と引き換えに回復を強化する。'},
];
export const chapterTwelveWeapons:readonly Weapon[]=[
 {id:'startree-sword',name:'星樹の剣',family:'sword',owner:'astel',bonuses:{attack:16,defense:3},effects:{},description:'未来へ道を開く剣。双剣の連撃や弓の速さと引き換えに、一撃と守りを支える。'},
 {id:'emerald-shield-spear',name:'翠星の盾槍',family:'shieldSpear',owner:'rina',bonuses:{attack:10,defense:20,maxHp:20},effects:{guardReduction:.02},description:'受け渡す光を守る盾と槍。フレイルより攻撃とHPを抑え、防御を重視する。'},
 {id:'eldertree-rod',name:'古樹のロッド',family:'rod',owner:'mei',bonuses:{attack:13,maxMp:14},effects:{magicRate:1.27},description:'年輪の間隔を伝える杖。ワンドの回復補正と引き換えに属性魔法を強める。'},
];
export const chapterThirteenWeapons:readonly Weapon[]=[
 {id:'starengine-duals',name:'星機の双剣',family:'dualBlades',owner:'astel',bonuses:{attack:17,speed:4},effects:{normalHits:2},description:'帰る力を分ける二刀。通常攻撃は合計等倍の二撃。剣の防御補正と引き換えに攻撃と速さを支える。'},
 {id:'celestial-shield-rapier',name:'天球守の盾突剣',family:'shieldRapier',owner:'rina',bonuses:{attack:12,defense:19,speed:2,maxHp:25},effects:{coverReduction:.02},description:'空を選ぶ人を守る盾と突剣。盾槍のガード補正と防御の一部を、速さとかばうへ振り分ける。'},
 {id:'starchart-mace',name:'星図のメイス',family:'mace',owner:'mei',bonuses:{attack:15,maxHp:45,maxMp:10},effects:{healingRate:1.15},description:'記録を次へ渡す祈りの槌。ロッドの属性魔法補正と引き換えにHPと回復を支える。'},
];
export const chapterFourteenWeapons:readonly Weapon[]=[
 {id:'starsea-bow',name:'星海の弓',family:'bow',owner:'astel',bonuses:{attack:16,speed:7},effects:{},description:'揺れる足場で狙いを取り直す弓。双剣の二撃と引き換えに、一射の間合いと速さを支える。'},
 {id:'arkward-shield-spear',name:'方舟守の盾槍',family:'shieldSpear',owner:'rina',bonuses:{attack:13,defense:21,maxHp:30},effects:{guardReduction:.04},description:'乗員の退路を支える盾槍。突剣の速さとかばう補正を、堅さとガードへ振り分ける。'},
 {id:'oblivion-wand',name:'忘却のワンド',family:'wand',owner:'mei',bonuses:{attack:15,maxMp:16},effects:{healingRate:1.2},description:'名を忘れても願いを照らすワンド。メイスのHP補正と引き換えに、魔力の余裕と回復を支える。'},
];
export const allWeapons:readonly Weapon[]=[...weapons,...chapterWeapons,...chapterThreeWeapons,...chapterFourWeapons,...chapterFiveWeapons,...chapterSixWeapons,...chapterSevenWeapons,...chapterEightWeapons,...chapterNineWeapons,...chapterTenWeapons,...chapterElevenWeapons,...chapterTwelveWeapons,...chapterThirteenWeapons,...chapterFourteenWeapons];
export const weaponById=(id:unknown):Weapon|undefined=>typeof id==='string'?allWeapons.find(w=>w.id===id):undefined;
export const HERO_IDS:readonly HeroId[]=['astel','rina','mei'];
export const DEFAULT_WEAPONS:Record<HeroId,string>={astel:'travelers-sword',rina:'apprentice-shield-spear',mei:'starlight-wand'};
