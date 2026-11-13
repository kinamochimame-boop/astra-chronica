import type {AtbCombat} from './atb-combat';
import type {Unit} from './types';
import {skills} from './data/combat';
import {isSilenced} from './effects';
export type CardPhase='finished'|'fallen'|'waiting'|'paused'|'acting'|'restricted'|'checking'|'queued'|'charging'|'ready';
/** Read-only presentation: simulation seconds, no timers and no combat mutations. */
export function atbCardState(c:AtbCombat,u:Unit){
 const s=c.slot(u.id),raw=c.chargeInterval(u.id),interval=Number.isFinite(raw)?Math.max(0,raw):0;
 const progress=Number.isFinite(s.progress)?Math.max(0,Math.min(1,s.progress)):0,remaining=Math.max(0,interval*(1-progress));
 const full=progress>=1||interval===0,head=s.queue[0];
 const blocked=!!head&&(s.restricted&&u.statuses.some(v=>v.id==='paralysis')||u.statuses.some(v=>v.id==='sleep'||v.id==='freeze')||isSilenced(u)&&['magic','heal'].includes(skills[head.command].kind)||(s.cooldowns[head.command]??0)>c.time+1e-8);
 const canAttempt=c.started&&!c.paused&&!c.disposed&&!c.battle.result&&u.hp>0&&s.busyUntil<=c.time&&full&&(!head||blocked);
 const restricted=u.statuses.some(v=>v.id==='sleep'||v.id==='freeze'),checking=u.statuses.some(v=>v.id==='paralysis');
 const phase:CardPhase=u.hp<=0?'fallen':c.disposed||c.battle.result?'finished':!c.started?'waiting':c.paused?'paused':s.busyUntil>c.time?'acting':restricted?'restricted':!full?'charging':head&&!blocked?'queued':checking?'checking':'ready';
 const label:Record<CardPhase,string>={finished:'戦闘終了',fallen:'戦闘不能',waiting:'開始待ち',paused:'一時停止',acting:'▶ 行動中',restricted:'行動不能',checking:'⚡ 麻痺判定',queued:'予約を優先',charging:'CT充填中',ready:c.auto?'READY':'READY · 手動'};
 return {phase,label:label[phase],interval,progress,remaining,ready:phase==='ready',canAttempt,lowHp:u.hp>0&&u.maxHp>0&&u.hp/u.maxHp<=.25,ctText:phase==='finished'?'戦闘終了':phase==='fallen'?'戦闘不能':phase==='acting'?'行動中':phase==='restricted'?'行動不能':phase==='checking'?'麻痺判定':phase==='ready'?'READY':`${s.firstAttack?'初回':'通常'} あと${remaining.toFixed(1)}秒`};
}
/** Positive observed delta only; never infer credit from hit counts or change EP. */
export function observedEpGain(before:number,after:number){return Number.isFinite(before)&&Number.isFinite(after)?Math.max(0,after-before):0}
