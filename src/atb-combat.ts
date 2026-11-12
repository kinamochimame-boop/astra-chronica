import {epCapacity,normalEpHits} from './ep-resource';
import {isItem} from './consumables';
import {Battle,skills,type Command,type Unit} from './battle';
import {battleEventParts,type BattleEvent} from './types';
import {isSilenced,statusDefinitions} from './effects';
import {ATB_RULES,attackInterval,epCost,skillCooldown} from './atb-rules';
export interface Reservation{id:number;command:Command;targetId:string;cost:number}
export interface AtbSlot{ep:number;progress:number;busyUntil:number;queue:Reservation[];cooldowns:Partial<Record<Command,number>>;restricted:boolean;firstAttack:boolean}
/** Deterministic event-time scheduler. All mutations are synchronous; visuals never own HP. */
export class AtbCombat {
 readonly slots=new Map<string,AtbSlot>();time=0;auto=true;speed:1|2|3=1;paused=false;disposed=false;private hasStarted=false;
 private serial=0;private nextRound=6;
 targetId='';onEvent?:(event:BattleEvent)=>void;
 constructor(readonly battle:Battle){battle.enableRealtime();for(const u of battle.units)this.slots.set(u.id,{ep:0,progress:0,busyUntil:0,queue:[],cooldowns:{},restricted:false,firstAttack:true});this.targetId=battle.enemies.find(u=>u.hp>0)?.id??'';}
 get started(){return this.hasStarted}
 /** Start is idempotent. Zero-CT attacks resolve on the next simulation tick, at time0. */
 start(){if(this.started||this.disposed||this.battle.result)return false;this.hasStarted=true;for(const u of this.battle.units)if(this.chargeInterval(u.id)===0)this.slot(u.id).progress=1;return true;}
 chargeInterval(id:string){const u=this.battle.units.find(u=>u.id===id)!;const ct=attackInterval(u,this.ally(u));return this.ally(u)&&this.slot(id).firstAttack?Math.max(0,ct-4):ct;}
 slot(id:string){return this.slots.get(id)!}
 capacity(id:string){return epCapacity(this.slot(id).queue)}
 private ally(u:Unit){return this.battle.allies.includes(u)}
 targets(id:string,c:Command){return c==='ether'?this.battle.allies.filter(u=>u.hp>0&&this.slot(u.id).ep<this.capacity(u.id)):this.battle.targets(c,this.battle.units.find(u=>u.id===id))}
 reason(id:string,c:Command,targetId?:string){
  if(!this.started)return 'スタートを押してください';
  if(c==='attack')return '通常攻撃はAUTOまたは手動攻撃ボタンを使ってください';
  const u=this.battle.allies.find(u=>u.id===id);if(this.disposed||this.battle.result)return '戦闘は終了しています';if(!u||u.hp<=0)return '戦闘不能';
  if(isItem(c)){const count=this.battle.itemInventory()[c],held=[...this.slots.values()].flatMap(s=>s.queue).filter(r=>r.command===c).length;if(count<1)return '所持していません';if(count<=held)return '所持品はすべて予約中です';}if(!this.battle.availableCommands(u).includes(c))return 'このキャラクターは使用不可';
  if(!this.battle.isLearned(u,c))return `未習得（Lv.${skills[c].unlockLevel??1}）`;
  if(isSilenced(u)&&['magic','heal'].includes(skills[c].kind))return '沈黙で使用不可';
  if(u.statuses.some(s=>s.id==='sleep'||s.id==='freeze'))return '行動不能';
  if(this.slot(id).queue.length>=ATB_RULES.maxReservations)return '予約は4件まで';
  if(this.slot(id).ep<epCost(u,c))return 'EP不足';
  const targets=this.targets(id,c);if(targetId&&skills[c].kind==='heal'&&skills[c].target==='ally'){const t=targets.find(t=>t.id===targetId);if(t&&t.hp===t.maxHp&&!(skills[c].cleanse&&t.statuses.length))return 'この味方のHPは満タンです';}if(!targets.length||targetId&&!targets.some(t=>t.id===targetId)&&skills[c].target!=='allAllies')return '有効な対象がいません';
  if(skills[c].kind==='heal'&&!targets.some(t=>t.hp<t.maxHp||skills[c].cleanse&&t.statuses.length))return '回復できる味方がいません';
  return '';
 }
 reserve(id:string,c:Command,targetId?:string):{ok:boolean;reason?:string;id?:number}{
  const reason=this.reason(id,c,targetId);if(reason)return {ok:false,reason};const u=this.battle.allies.find(u=>u.id===id)!,s=this.slot(id),target=this.targets(id,c).find(t=>t.id===targetId)??this.targets(id,c)[0];
  const reservation={id:++this.serial,command:c,targetId:target.id,cost:epCost(u,c)};s.ep-=reservation.cost;s.queue.push(reservation);return {ok:true,id:reservation.id};
 }
 cancel(id:string,reservationId:number){const s=this.slots.get(id),i=s?.queue.findIndex(r=>r.id===reservationId)??-1;if(!this.started||!s||i<0||this.disposed||this.battle.result)return false;const [r]=s.queue.splice(i,1);s.ep=Math.min(15,s.ep+r.cost);return true;}
 /** AUTO OFF is provisionally manual normal attacks; enemy clocks and queued skills continue. */
 attack(id:string){const u=this.battle.allies.find(u=>u.id===id),s=this.slots.get(id);if(!this.started||this.auto||!u||!s||s.progress<1||s.busyUntil>this.time||s.queue.length&&!this.reservationBlocked(u)||u.hp<=0||this.disposed||this.paused||this.battle.result)return false;this.normal(u);return true;}
 private publish(event:BattleEvent){
  for(const p of battleEventParts(event))if(p.epDrain&&this.slots.has(p.target)){const s=this.slot(p.target),lost=Math.min(s.ep,p.epDrain);s.ep-=lost;if(lost){const line=`${this.battle.units.find(u=>u.id===p.target)!.name}のEPが${lost}吸収された。`;event.logs.push(line);this.battle.log.push(line);}}
  if(event.command==='ether'){const s=this.slot(event.target),amount=Math.min(5,this.capacity(event.target)-s.ep);s.ep+=amount;event.amount=amount;event.resource='ep';const line=`EPが${amount}回復。`;event.logs.push(line);this.battle.log.push(line);}
  const actor=this.battle.allies.find(u=>u.id===event.actor);
  if(actor&&event.command==='attack'){const hits=normalEpHits(event);this.slot(actor.id).ep=Math.min(this.capacity(actor.id),this.slot(actor.id).ep+hits);}
  this.onEvent?.(event);
 }
 private normal(u:Unit){const s=this.slot(u.id);s.firstAttack=false;s.progress=0;
  const target=this.battle.enemies.find(e=>e.id===this.targetId&&e.hp>0)??this.battle.enemies.find(e=>e.hp>0);if(target)this.targetId=target.id;
  const result=this.battle.resolveRealtime(u.id,'attack',target?.id,true);s.busyUntil=this.time+ATB_RULES.motion;s.restricted=!!(result.ok&&result.event.kind==='status'&&result.event.label===statusDefinitions.paralysis.name);if(result.ok)this.publish(result.event);
 }
 private reservationBlocked(u:Unit){const s=this.slot(u.id),r=s.queue[0];return !!r&&(s.restricted&&u.statuses.some(v=>v.id==='paralysis')||u.statuses.some(v=>v.id==='sleep'||v.id==='freeze')||isSilenced(u)&&['magic','heal'].includes(skills[r.command].kind)||(s.cooldowns[r.command]??0)>this.time+1e-8);}
 private flush(){if(!this.started||this.disposed||this.paused)return;for(const u of this.battle.units)if(u.hp>0&&this.chargeInterval(u.id)===0)this.slot(u.id).progress=1;for(const u of this.battle.units){const s=this.slot(u.id);if(u.hp<=0){for(const r of s.queue)s.ep=Math.min(15,s.ep+r.cost);s.queue=[];continue}if(s.busyUntil>this.time+1e-8)continue;
   const r=s.queue[0];if(r){
    if(this.reservationBlocked(u)){if(s.progress>=1-1e-8&&(!this.ally(u)||this.auto))this.normal(u);continue;}
    const targets=this.targets(u.id,r.command);let target=targets.find(t=>t.id===r.targetId);if(!target&&(skills[r.command].target==='enemy'||skills[r.command].target==='allAllies'))target=targets[0];
    if(!target){this.cancel(u.id,r.id);continue}
    const result=this.battle.resolveRealtime(u.id,r.command,target.id);s.queue.shift();
    if(result.ok){s.busyUntil=this.time+ATB_RULES.motion;s.cooldowns[r.command]=this.time+skillCooldown(u,r.command);this.publish(result.event)}else{s.ep=Math.min(15,s.ep+r.cost);this.battle.log.push(result.reason)}
   }else if(s.progress>=1-1e-8&&(!this.ally(u)||this.auto))this.normal(u);
   if(this.battle.result||this.disposed||this.paused)break;
  }if(this.battle.result)this.reset();}
 /** Simulation delta, in seconds. Event boundaries preserve behaviour across 4–120fps. */
 advance(seconds:number){if(!this.started||this.disposed||this.paused||this.battle.result||!Number.isFinite(seconds)||seconds<=0)return;let remaining=seconds*this.speed;this.flush();
  while(remaining>1e-8&&!this.battle.result&&!this.disposed&&!this.paused){let dt=remaining;
   for(const u of this.battle.units){if(u.hp<=0)continue;const s=this.slot(u.id);if(s.progress<1-1e-8)dt=Math.min(dt,(1-s.progress)*this.chargeInterval(u.id));if(s.busyUntil>this.time+1e-8)dt=Math.min(dt,s.busyUntil-this.time);const r=s.queue[0];if(r&&(s.cooldowns[r.command]??0)>this.time+1e-8)dt=Math.min(dt,s.cooldowns[r.command]!-this.time);}
   dt=Math.min(dt,this.nextRound-this.time);if(dt<1e-8)dt=Math.min(remaining,1e-6);
   for(const u of this.battle.units)if(u.hp>0){const s=this.slot(u.id);s.progress=Math.min(1,this.chargeInterval(u.id)===0?1:s.progress+dt/this.chargeInterval(u.id));}
   this.time+=dt;remaining-=dt;
   if(this.time>=this.nextRound-1e-8){this.nextRound+=6;this.battle.round++;for(const u of this.battle.units)if((u.tauntRounds??0)>0)u.tauntRounds!--;}
   this.flush();
  }
 }
 reset(){for(const s of this.slots.values()){s.ep=0;s.queue=[];}this.battle.resetBattleResources()}
 dispose(){this.disposed=true;this.onEvent=undefined;this.reset()}
}
