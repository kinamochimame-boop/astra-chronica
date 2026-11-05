import {treeNodes,treeNode,type TreeEffect,type TreeStat,type TreeNode} from './data/skill-tree';
import {HERO_IDS,type HeroId} from './data/weapons';
import {cloneUnit,skills} from './data/combat';
import {equippedWeapon} from './equipment';
import {PROGRESSION,type PartyProgress} from './progression';
import type {Unit,Command,Element} from './types';
export type SkillTreeState=Record<HeroId,string[]>;
export const initialSkillTree=():SkillTreeState=>({astel:[],rina:[],mei:[]});
export const totalSP=(level:number)=>2*(Math.max(1,Math.min(PROGRESSION.maxLevel,Math.floor(level)))-1);
export function normalizeHeroNodes(raw:unknown,hero:string,level:number):string[]{
 const wanted=new Set(Array.isArray(raw)?raw.filter((v):v is string=>typeof v==='string'):[]),accepted:string[]=[];let spent=0;
 // Definitions are topological; stored ordering never changes prerequisites or total cost.
 for(const n of treeNodes)if(n.hero===hero&&wanted.has(n.id)&&n.level<=level&&n.requires.every(id=>accepted.includes(id))&&spent+n.cost<=totalSP(level)){accepted.push(n.id);spent+=n.cost}
 return accepted;
}
export function normalizeSkillTree(raw:unknown,party:PartyProgress):SkillTreeState {
 const state=initialSkillTree(),source=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw as Record<string,unknown>:{};
 for(const hero of HERO_IDS)state[hero]=normalizeHeroNodes(source[hero],hero,party[hero]?.level??1);return state;
}
export function remainingSP(state:SkillTreeState,hero:HeroId,level:number){return totalSP(level)-normalizeHeroNodes(state[hero],hero,level).reduce((sum,id)=>sum+treeNode(id)!.cost,0)}
export function acquireReason(state:SkillTreeState,hero:HeroId,level:number,id:string):string {
 const n=treeNode(id);if(!n||n.hero!==hero)return 'このキャラクターのノードではありません';
 const learned=normalizeHeroNodes(state[hero],hero,level);
 if(learned.includes(id))return '習得済み';if(level<n.level)return `Lv.${n.level}が必要です`;
 if(!n.requires.every(id=>learned.includes(id)))return '前提ノードが未習得です';
 if(remainingSP(state,hero,level)<n.cost)return 'SP不足';return '';
}
export function acquireNode(state:SkillTreeState,hero:HeroId,level:number,id:string):boolean {
 if(acquireReason(state,hero,level,id))return false;state[hero]=[...normalizeHeroNodes(state[hero],hero,level),id];return true;
}
export function treeValue<K extends TreeEffect['kind']>(u:Unit,kind:K,filter?:(e:TreeEffect & {kind:K})=>boolean):number {
 return (u.treeEffects??[]).reduce((sum,e)=>sum+(e.kind===kind&&(!filter||filter(e as TreeEffect & {kind:K}))?e.value:0),0);
}
/** Always derive from a fresh base; replacing an existing tree snapshot also removes old flat stats. */
export function withSkillTree(base:Unit,ids:unknown):Unit {
 const u=cloneUnit(base);for(const stat of ['maxHp','maxMp','attack','defense','speed'] as TreeStat[])u[stat]-=u.treeBonuses?.[stat]??0;
 const effects=normalizeHeroNodes(ids,u.id,u.level).map(id=>({...treeNode(id)!.effect}));u.treeEffects=effects;u.treeBonuses={};
 for(const e of effects)if(e.kind==='stat')u.treeBonuses[e.stat]=(u.treeBonuses[e.stat]??0)+e.value;
 if(equippedWeapon(u)?.family==='bow')u.treeBonuses.speed=(u.treeBonuses.speed??0)+treeValue(u,'bowSpeed');
 u.treeBonuses.defense=(u.treeBonuses.defense??0)+Math.floor((u.maxHp+(u.treeBonuses.maxHp??0))*treeValue(u,'hpDefense'));
 for(const stat of ['maxHp','maxMp','attack','defense','speed'] as TreeStat[])u[stat]+=u.treeBonuses[stat]??0;
 u.hp=Math.min(u.maxHp,Math.max(0,base.hp+u.maxHp-base.maxHp));u.mp=Math.min(u.maxMp,Math.max(0,base.mp+u.maxMp-base.maxMp));return u;
}
export const TREE_LIMITS={criticalRate:0.5,criticalDamage:2.5,reduction:0.5,guardMinimum:0.1,coverMinimum:0.25,resistance:0.8,starBonus:10} as const;
export function skillMpCost(u:Unit,c:Command){const cost=skills[c].cost;return Math.max(Math.ceil(cost/2),cost-treeValue(u,'mpDiscount')-treeValue(u,'commandCost',e=>e.command===c))}
export function treePowerRate(u:Unit,c:Command,element:Element):number {
 const skill=skills[c];return 1+treeValue(u,'commandPower',e=>e.command===c)
 +(skill.kind==='magic'&&element!=='none'?treeValue(u,'magicPower')+treeValue(u,'elementPower',e=>e.element===element):0)
 +(skill.kind==='physical'&&u.hp/u.maxHp<=0.3?treeValue(u,'lowHpPower'):0)
 +(skill.starCost&&['physical','magic'].includes(skill.kind)?treeValue(u,'ultimatePower'):0)
 +(c==='attack'&&equippedWeapon(u)?.effects.normalHits===2?treeValue(u,'dualPower'):0);
}
export function treeHealingRate(u:Unit,c:Command){return 1+treeValue(u,'healing')+treeValue(u,'commandHeal',e=>e.command===c)}
export function treeReduction(u:Unit){return 1-Math.min(TREE_LIMITS.reduction,treeValue(u,'damageReduction')+(u.hp/u.maxHp<=0.3?treeValue(u,'lowHpReduction'):0))}
