import type { Element, ModifierEffect, Stat, StatusId, Unit } from './types';
import { EFFECT_RULES, statusDefinitions } from './data/effects';
export { ELEMENTS, statusDefinitions } from './data/effects';
const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export function statValue(u:Unit,stat:Stat):number {
 const sum=clamp(u.modifiers.filter(m=>m.stat===stat).reduce((sum,m)=>sum+m.amount,0),-EFFECT_RULES.maxModifier,EFFECT_RULES.maxModifier);
 const burn=stat==='attack'&&u.statuses.some(s=>s.id==='burn')?statusDefinitions.burn.attackRate!:1;
 return u[stat]*(1+sum)*burn;
}
export function affinity(target:Unit,element:Element):number {
 return element==='none'?1:Math.max(0,target.affinities[element]??1);
}
export function inflict(u:Unit,id:StatusId,random:()=>number,chance=statusDefinitions[id].chance,turns=statusDefinitions[id].turns):boolean {
 if(u.hp<=0||!Number.isFinite(chance)||!Number.isSafeInteger(turns)||turns<1||turns>EFFECT_RULES.maxDuration)return false;
 const probability=clamp(chance,0,1)*(1-clamp(u.statusResistance[id]??0,0,1));
 if(random()>=probability)return false;
 const previous=u.statuses.find(s=>s.id===id);
 if(previous)previous.remaining=Math.max(previous.remaining,turns);else u.statuses.push({id,remaining:turns});
 return true;
}
/** Positive and negative effects have separate stacks. Same-sign reapplication adds magnitude,
 * caps at 75%, and refreshes to the longer duration. Final combined modifier is also capped. */
export function modify(u:Unit,effect:ModifierEffect):boolean {
 if(u.hp<=0||!Number.isFinite(effect.amount)||effect.amount===0||!Number.isSafeInteger(effect.turns)||effect.turns<1||effect.turns>EFFECT_RULES.maxDuration)return false;
 const previous=u.modifiers.find(m=>m.stat===effect.stat&&Math.sign(m.amount)===Math.sign(effect.amount));
 if(previous){previous.amount=clamp(previous.amount+effect.amount,-EFFECT_RULES.maxModifier,EFFECT_RULES.maxModifier);previous.remaining=Math.max(previous.remaining,effect.turns)}
 else u.modifiers.push({stat:effect.stat,amount:clamp(effect.amount,-EFFECT_RULES.maxModifier,EFFECT_RULES.maxModifier),remaining:effect.turns});
 return true;
}
export function clearStatus(u:Unit,id?:StatusId){u.statuses=id?u.statuses.filter(s=>s.id!==id):[]}
export function blockingStatus(u:Unit,random:()=>number):StatusId|undefined {
 return u.statuses.find(s=>{const chance=statusDefinitions[s.id].skipChance;return chance!==undefined&&random()<chance})?.id;
}
export function isSilenced(u:Unit){return u.statuses.some(s=>statusDefinitions[s.id].silence)}
export function endTurn(u:Unit):string[] {
 const logs:string[]=[];
 for(const s of u.statuses){
  const def=statusDefinitions[s.id];
  if(u.hp>0&&def.damageRate){const amount=Math.max(1,Math.floor(u.maxHp*def.damageRate));u.hp=Math.max(0,u.hp-amount);logs.push(`${u.name}は${def.name}で${amount}ダメージ。`);if(u.hp===0)logs.push(`${u.name}は戦闘不能になった。`)}
  s.remaining--;if(s.remaining===0)logs.push(`${u.name}の${def.name}が解除された。`);
 }
 u.statuses=u.statuses.filter(s=>s.remaining>0);
 for(const m of u.modifiers){m.remaining--;if(m.remaining===0)logs.push(`${u.name}の${m.stat==='attack'?'攻撃力':m.stat==='defense'?'防御力':'素早さ'}補正が解除された。`)}
 u.modifiers=u.modifiers.filter(m=>m.remaining>0);
 if(u.hp===0){u.statuses=[];u.modifiers=[];u.guarding=undefined;u.covering=undefined}
 return logs;
}
