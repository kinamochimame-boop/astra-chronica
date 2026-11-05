import {skills,commandsFor,type Battle,type Unit,type Command,type BattleEvent} from './battle';
import {isSilenced,statusDefinitions} from './effects';

export const STATUS_ICONS={poison:'毒',sleep:'眠',paralysis:'痺',blind:'暗',silence:'黙',burn:'火',freeze:'氷'};
const stats={attack:'攻撃力',defense:'防御力',speed:'素早さ'};
export interface Badge {symbol:string;name:string;detail:string;kind:'status'|'buff'|'debuff'|'guard'}
export function badges(u:Unit):Badge[]{
 return [
  ...u.statuses.map(s=>({symbol:STATUS_ICONS[s.id],name:statusDefinitions[s.id].name,detail:`残り${s.remaining}行動`,kind:'status' as const})),
  ...u.modifiers.map(m=>({symbol:`${m.stat==='attack'?'攻':m.stat==='defense'?'防':'速'}${m.amount>0?'↑':'↓'}`,name:`${stats[m.stat]}${m.amount>0?'+':''}${Math.round(m.amount*100)}%`,detail:`残り${m.remaining}行動`,kind:m.amount>0?'buff' as const:'debuff' as const})),
  ...(u.guarding?[{symbol:'盾',name:u.guarding==='guard'?'ガード':'防御',detail:'次の本人の行動開始まで',kind:'guard' as const}]:[]),
  ...((u.tauntRounds??0)>0?[{symbol:'挑',name:'挑発',detail:`残り${u.tauntRounds}ラウンド`,kind:'guard' as const}]:[]),
  ...((u.barrierCharges??0)>0?[{symbol:'壁',name:'不落の誓盾',detail:`直接攻撃を残り${u.barrierCharges}回50%軽減`,kind:'guard' as const}]:[]),
  ...(u.covering?[{symbol:'庇',name:'かばう',detail:'選んだ味方を次の本人の行動開始まで守る',kind:'guard' as const}]:[]),
 ];
}
export function commandReason(b:Battle,actor:Unit,c:Command,busy=false):string {
 if(busy)return '演出中';
 if(actor.hp<=0)return '戦闘不能';
 if(b.current!==actor||b.phase!=='player')return '行動待ち';
 if(b.blocked)return `${statusDefinitions[b.blocked].name}で行動不能`;
 if(!commandsFor(actor).includes(c))return 'このキャラクターは使用不可';
 if(!b.isLearned(actor,c))return `未習得（Lv.${skills[c].unlockLevel??1}）`;
 if(isSilenced(actor)&&['magic','heal'].includes(skills[c].kind))return '沈黙で使用不可';
 if(actor.star<(skills[c].starCost??0))return '星力不足';
 if(actor.mp<skills[c].cost)return 'MP不足';
 if(!b.targets(c).length)return '有効な対象がいません';
 if(skills[c].kind==='heal'&&b.targets(c).every(u=>u.hp===u.maxHp&&(!skills[c].cleanse||!u.statuses.length)))return '回復できる味方がいません';
 return b.canUse(c)?'':'今は使用できません';
}
export function targetReason(b:Battle,c:Command,id:string):string {
 if(skills[c].target==='allAllies')return b.targets(c).length?'':'生存している味方がいません';
 const target=b.units.find(u=>u.id===id);
 if(!target||target.hp<=0)return '生存している対象を選んでください';
 if(!b.targets(c).includes(target))return c==='cover'&&target===b.current?'自分自身はかばえません':'コマンドに合う対象を選んでください';
 if(c==='heal'&&target.hp===target.maxHp)return 'この味方のHPは満タンです';
 return '';
}
/** Confirmed remaining queue only; never presents a speculative next round as confirmed. */
export function visibleOrder(b:Battle,actingId?:string):Unit[]{
 const actor=actingId?b.units.find(u=>u.id===actingId):undefined;
 if(b.result)return actor&&actor.hp>0?[actor]:[];
 return [...(actor&&actor.hp>0?[actor]:[]),...b.remainingOrder].slice(0,6);
}
export function effectPresentation(event:BattleEvent){
 const tags:string[]=[];
 if(event.kind==='damage'){
  if(event.critical)tags.push('CRITICAL');
  if((event.affinity??1)>1)tags.push('WEAK');
  if((event.affinity??1)<1)tags.push('RESIST');
 }
 const value=event.label==='ミス'?'MISS':event.kind==='heal'?`+${event.amount}`:event.kind==='damage'?String(event.amount):event.label||skills[event.command].name;
 return {value,tags,tone:event.kind==='heal'?'heal':event.critical?'critical':event.kind==='damage'?'damage':'status'};
}
export function statusSnapshot(units:Unit[]){return units.map(u=>({id:u.id,name:u.name,ids:u.statuses.map(s=>s.id)}))}
export function statusNotices(before:ReturnType<typeof statusSnapshot>,units:Unit[]):string[]{
 const messages:string[]=[];
 for(const old of before){const now=units.find(u=>u.id===old.id)!;
  for(const s of now.statuses)if(!old.ids.includes(s.id))messages.push(`${now.name}：${statusDefinitions[s.id].name}を付与`);
  for(const id of old.ids)if(!now.statuses.some(s=>s.id===id))messages.push(`${now.name}：${statusDefinitions[id].name}を解除`);
 }
 return messages;
}
