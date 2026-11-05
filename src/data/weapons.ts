import type {Stat} from '../types';
export type HeroId='astel'|'rina'|'mei';
export type WeaponFamily='sword'|'bow'|'dualBlades'|'shieldSpear'|'shieldFlail'|'shieldRapier'|'wand'|'rod'|'mace';
export interface Weapon {
 id:string;name:string;family:WeaponFamily;owner:HeroId;bonuses:Partial<Record<Stat|'maxHp',number>>;
 effects:{normalHits?:number;healingRate?:number;magicRate?:number};description:string;
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
export const weaponById=(id:unknown):Weapon|undefined=>typeof id==='string'?weapons.find(w=>w.id===id):undefined;
export const HERO_IDS:readonly HeroId[]=['astel','rina','mei'];
export const DEFAULT_WEAPONS:Record<HeroId,string>={astel:'travelers-sword',rina:'apprentice-shield-spear',mei:'starlight-wand'};
