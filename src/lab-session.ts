import {battleEventParts} from './types';
import type {PartyProgress} from './progression';
import {Battle,skills} from './battle';
import {statValue,statusDefinitions} from './effects';
import type {ActionResult,Command,ModifierEffect,StatusId,Unit} from './types';

export function seededRandom(seed=42){let state=seed>>>0;return ()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296}}
const statName={attack:'攻撃力',defense:'防御力',speed:'素早さ'};
const snapshot=(units:Unit[])=>units.map(u=>({id:u.id,name:u.name,hp:u.hp,statuses:u.statuses.map(s=>({...s})),modifiers:u.modifiers.map(m=>({...m}))}));
type Snapshot=ReturnType<typeof snapshot>;

/** The lab owns a separate battle; no save module, storage, or player's progress is referenced. */
export class LabSession {
 readonly battle:Battle;
 effectTarget='astel';attackTarget='enemy0';allyTarget='astel';enemyAttacksEnabled=true;
 readonly logs:string[]=[];
 lastOpportunity='まだ行動していません。';
 constructor(random:()=>number=Math.random,party?:PartyProgress){this.battle=new Battle(random,party)}
 append(...lines:string[]){this.logs.push(...lines);if(this.logs.length>1200)this.logs.splice(0,this.logs.length-1200)}
 syncTargets(command:Command='attack'){
  const enemies=this.battle.enemies.filter(u=>u.hp>0);
  if(!enemies.some(u=>u.id===this.attackTarget)){
   const old=this.battle.units.find(u=>u.id===this.attackTarget)?.name||'なし';
   this.attackTarget=enemies[0]?.id||'';
   this.append(`[攻撃対象切替] ${old} → ${enemies[0]?.name||'なし（敵全滅）'}`);
  }
  const allies=skills[command].target==='ally'?this.battle.targets(command):this.battle.allies.filter(u=>u.hp>0);
  if(!allies.some(u=>u.id===this.allyTarget))this.allyTarget=allies[0]?.id||'';
 }
 private changes(before:Snapshot,actorId?:string,damageTarget?:string,cleanse=false){
  for(const old of before){
   const now=this.battle.units.find(u=>u.id===old.id)!;
   for(const s of old.statuses){
    const after=now.statuses.find(a=>a.id===s.id);
    if(after?.remaining!==s.remaining)this.append(`[持続] ${old.name} ${statusDefinitions[s.id].name}：${s.remaining} → ${after?.remaining??0}`);
    if(!after){
     const reason=now.hp===0?'戦闘不能':damageTarget===old.id&&statusDefinitions[s.id].breakOnDamage?'被攻撃':actorId===old.id&&s.remaining===1?'期限切れ':cleanse?'スキル解除':'手動解除';
     this.append(`[解除理由] ${old.name} ${statusDefinitions[s.id].name}：${reason}`);
    }
   }
   for(const m of old.modifiers){
    const after=now.modifiers.find(a=>a.stat===m.stat&&Math.sign(a.amount)===Math.sign(m.amount));
    if(!after||after.remaining!==m.remaining||after.amount!==m.amount)this.append(`[能力補正] ${old.name} ${statName[m.stat]} ${m.amount*100}% 残り${m.remaining} → ${after?`${after.amount*100}% 残り${after.remaining}`:now.hp===0?'解除（戦闘不能）':actorId===old.id&&m.remaining===1?'解除（期限切れ）':'解除（手動）'}`);
   }
  }
 }
 inflict(id:StatusId,chance:number,turns:number){
  const before=snapshot(this.battle.units),u=this.battle.units.find(u=>u.id===this.effectTarget)!;
  const previous=u.statuses.find(s=>s.id===id)?.remaining;
  const ok=this.battle.applyStatus(u.id,id,chance,turns);
  this.append(`[状態${previous?'再付与':'付与'}] ${u.name} ${statusDefinitions[id].name} 確率${chance*100}%：${ok?'成功':'失敗'} 残り${u.statuses.find(s=>s.id===id)?.remaining??0}`);
  this.changes(before);return ok;
 }
 clearStatuses(){const before=snapshot(this.battle.units);this.battle.clearStatus(this.effectTarget);this.changes(before)}
 modify(effect:ModifierEffect){
  const u=this.battle.units.find(u=>u.id===this.effectTarget)!,before=statValue(u,effect.stat);
  const prior=u.modifiers.some(m=>m.stat===effect.stat&&Math.sign(m.amount)===Math.sign(effect.amount));
  const ok=this.battle.applyModifier(u.id,effect);
  this.append(`[能力補正${prior?'重複':'付与'}] ${u.name} ${statName[effect.stat]} ${effect.amount*100}%：${ok?'成功':'失敗'} 実効値${before.toFixed(1)} → ${statValue(u,effect.stat).toFixed(1)} 残り${u.modifiers.find(m=>m.stat===effect.stat&&Math.sign(m.amount)===Math.sign(effect.amount))?.remaining??0}`);
  return ok;
 }
 clearModifiers(){const before=snapshot(this.battle.units);this.battle.clearModifiers(this.effectTarget);this.changes(before)}
 private execute(action:()=>ActionResult):ActionResult {
  const before=snapshot(this.battle.units),actor=this.battle.current,blocked=this.battle.blocked;
  if(actor)this.append(`[行動前状態] ${actor.name}：${before.find(u=>u.id===actor.id)!.statuses.map(s=>`${statusDefinitions[s.id].name} 残り${s.remaining}`).join(' / ')||'状態異常なし'}`);
  const result=action();
  if(!result.ok){this.append(`[操作不可] ${actor?.name??'戦闘終了'}：${result.reason}`);return result}
  const event=result.event,target=this.battle.units.find(u=>u.id===event.target)!;
  this.append(`[行動] ${actor!.name} → ${skills[event.command].target==='allAllies'?'生存する味方全体':target.name}：${event.label||skills[event.command].name}`);
  if(blocked)this.append(`[行動制限] ${actor!.name}：${statusDefinitions[blocked].name}によりスキップ`);
  else if(before.find(u=>u.id===actor!.id)!.statuses.some(s=>s.id==='paralysis'))this.append(`[行動制限判定] ${actor!.name}：麻痺の行動不能は不発`);
  this.append(...event.logs);
  for(const part of battleEventParts(event)){const t=part.damageTrace;
   if(t)this.append(`[計算${part.hitIndex?` 第${part.hitIndex}撃`:''}] 実効攻撃${t.effectiveAttack.toFixed(1)} / 防御${t.effectiveDefense.toFixed(1)}。入力威力${t.power.toFixed(2)}（かばう倍率${t.coverMultiplier}反映済） × 防御補正${t.defenseMultiplier.toFixed(3)} × 属性${t.elementMultiplier} × ガード${t.guardMultiplier} × 誓盾${t.barrierMultiplier??1} × 会心${t.criticalMultiplier} → ${part.amount}ダメージ（丸め・最低値適用）`);
  }
  this.changes(before,event.actor,event.kind==='damage'&&event.amount>0?event.target:undefined,!!skills[event.command].cleanse);
  const prev=before.find(u=>u.id===event.actor)!;
  const states=prev.statuses.map(s=>`${statusDefinitions[s.id].name} ${s.remaining} → ${actor!.statuses.find(a=>a.id===s.id)?.remaining??0}`).join(' / ')||'状態異常なし';
  this.lastOpportunity=`${actor!.name}の行動機会 前後：${states}`;
  this.append(`[行動後状態] ${this.lastOpportunity}`);
  this.syncTargets();return result;
 }
 step(command:Command='attack',waitAll=false):ActionResult {
  this.syncTargets(command);
  if(!waitAll&&!this.battle.blocked&&this.battle.phase==='player'&&this.battle.current?.statuses.some(s=>s.id==='silence')&&['magic','heal'].includes(skills[command].kind))this.append(`[行動制限] ${this.battle.current.name}：沈黙で${skills[command].name}を使用不可（MP・期限は消費しません）`);
  return this.execute(()=>this.battle.blocked?this.battle.skipTurn():waitAll?this.battle.waitTurn():this.battle.phase==='enemy'?(this.enemyAttacksEnabled?this.battle.enemyAct():this.battle.waitTurn()):this.battle.act(command,skills[command].target==='ally'?this.allyTarget:this.attackTarget));
 }
 targetOpportunity():ActionResult {
  const target=this.battle.units.find(u=>u.id===this.effectTarget);
  if(!target||target.hp<=0||this.battle.result)return {ok:false,reason:'生存している効果付与対象を選んでください。'};
  // Everyone waits to avoid damage, healing, MP usage, or accidental early awakening.
  for(let i=0;i<12&&this.battle.current?.id!==target.id&&!this.battle.result;i++)this.step('defend',true);
  if(this.battle.current?.id!==target.id)return {ok:false,reason:'戦闘終了のため対象の行動機会へ進めません。'};
  return this.step('defend',true);
 }
 nextRound(){const round=this.battle.round;for(let i=0;i<6&&this.battle.round===round&&!this.battle.result;i++)this.step('defend',true)}
}
