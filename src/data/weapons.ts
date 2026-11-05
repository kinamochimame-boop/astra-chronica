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
export const allWeapons:readonly Weapon[]=[...weapons,...chapterWeapons,...chapterThreeWeapons,...chapterFourWeapons,...chapterFiveWeapons];
export const weaponById=(id:unknown):Weapon|undefined=>typeof id==='string'?allWeapons.find(w=>w.id===id):undefined;
export const HERO_IDS:readonly HeroId[]=['astel','rina','mei'];
export const DEFAULT_WEAPONS:Record<HeroId,string>={astel:'travelers-sword',rina:'apprentice-shield-spear',mei:'starlight-wand'};
