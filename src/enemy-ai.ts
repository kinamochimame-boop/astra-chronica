import type {StatusEffect,Unit} from './types';

export interface EnemyAiConfig {
 readonly role:'standard'|'aggressive'|'defensive'|'disruptor';
 readonly targetPolicy:'random'|'wounded';
 readonly focusChance?:number;
 readonly lowHpThreshold?:number;
 readonly guardChance?:number;
 readonly guardCooldownActions?:number;
 readonly statusTargetPolicy?:'unaffected';
}
const standard:EnemyAiConfig={role:'standard',targetPolicy:'random'};
const aggressive:EnemyAiConfig={role:'aggressive',targetPolicy:'wounded',focusChance:.6};
const defensive:EnemyAiConfig={role:'defensive',targetPolicy:'random',lowHpThreshold:.35,guardChance:.3,guardCooldownActions:1};
const disruptor:EnemyAiConfig={role:'disruptor',targetPolicy:'random',statusTargetPolicy:'unaffected'};
/** Explicit template IDs only. Pattern owners retain their entire existing script. */
export const ENEMY_AI:Readonly<Record<string,EnemyAiConfig>>=Object.freeze({
 'shadow-bat':standard,'ash-bat':standard,
 // Preserve the chapter-17 echo: status spreading reduced auto-only wins in comparison.
 'starpath-echo':standard,
 'forest-wolf':aggressive,'sky-bird':aggressive,'underground-hound':aggressive,
 'sand-jackal':aggressive,'frostfang-wolf':aggressive,'mossfang-wolf':aggressive,
 'windblade-harpy':aggressive,'azure-hunter':aggressive,'fault-beast':aggressive,
 'gear-scout':aggressive,'inverted-beast':aggressive,
 'mist-slime':defensive,'rust-sentinel':defensive,'rock-golem':defensive,
 'crystal-beetle':defensive,'tide-crab':defensive,'white-scarab':defensive,'starmoss-golem':defensive,
 'lamp-shadow':disruptor,'oblivion-shadow':disruptor,'sand-scorpion':disruptor,
 'star-sand-orb':disruptor,'sandstorm-ghost':disruptor,'twilight-orb':disruptor,
 'grove-spore':disruptor,'ancient-wind-orb':disruptor,'memory-eater':disruptor,
 'starsand-jelly':disruptor,'deep-lantern':disruptor,'pilgrim-echo':disruptor,
 'record-eater':disruptor,'darkleaf-sprite':disruptor,'nightglow-wisp':disruptor,
 'wild-repair':disruptor,'sphere-phantom':disruptor,
 'final-echo':disruptor,'final-eater':disruptor,'final-shadow':disruptor,
});
export function enemyAiConfig(actor:Unit){return actor.enemyPattern?undefined:ENEMY_AI[actor.enemyTemplateId??actor.id]}
const pick=(pool:readonly Unit[],random:()=>number)=>pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];
export interface EnemyTargetDecision {target:Unit|undefined;reason?:'wounded'|'unaffected'}
/** Taunt -> tactical choice -> caller's existing cover. No random draw for taunt. */
export function chooseEnemyTarget(actor:Unit,candidates:readonly Unit[],random:()=>number,effects:readonly StatusEffect[]=[]):EnemyTargetDecision {
 const living=candidates.filter(u=>u.hp>0),taunter=living.find(u=>(u.tauntRounds??0)>0);
 if(taunter||!living.length)return {target:taunter};
 // With no choice, keep the legacy single draw (and subsequent critical/proc stream).
 if(living.length===1)return {target:pick(living,random)};
 const config=enemyAiConfig(actor);
 if(config?.targetPolicy==='wounded'&&living.some(u=>u.hp<u.maxHp)&&random()<(config.focusChance??0)){
  const ratio=Math.min(...living.map(u=>u.hp/u.maxHp)),ties=living.filter(u=>u.hp/u.maxHp===ratio);
  return {target:ties.length===1?ties[0]:pick(ties,random),reason:'wounded'};
 }
 if(config?.statusTargetPolicy==='unaffected'){
  const ids=[...new Set(effects.filter(e=>e.chance>0).map(e=>e.id))];
  const missing=(u:Unit)=>ids.filter(id=>!u.statuses.some(s=>s.id===id)).length;
  const max=Math.max(...living.map(missing)),fresh=living.filter(u=>missing(u)===max);
  if(max>0&&fresh.length<living.length)return {target:pick(fresh,random),reason:'unaffected'};
 }
 return {target:pick(living,random)};
}
export function enemyDecisionLog(actor:Unit,decision:EnemyTargetDecision){
 return decision.reason==='wounded'?[`${actor.name}は弱った${decision.target!.name}を狙った！`]:decision.reason==='unaffected'?[`${actor.name}は状態異常の少ない${decision.target!.name}を狙った！`]:[];
}
/** One instance per battle. Skipped opportunities never make AI decisions. */
export class EnemyTactics {
 private lastGuard=new Map<string,number>();
 shouldGuard(actor:Unit,action:number,random:()=>number){
  const c=enemyAiConfig(actor);
  if(c?.role!=='defensive'||actor.hp<=0||actor.hp/actor.maxHp>(c.lowHpThreshold??0)||action-(this.lastGuard.get(actor.id)??-Infinity)<=(c.guardCooldownActions??1))return false;
  if(random()>=(c.guardChance??0))return false;
  this.lastGuard.set(actor.id,action);return true;
 }
 clear(){this.lastGuard.clear()}
}
