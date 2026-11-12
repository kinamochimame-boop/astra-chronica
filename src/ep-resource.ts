import {battleEventParts,type BattleEvent} from './types';
export const EP_MAX=15;
/** Pending reservations are escrow: crediting never discards a future full refund. */
export const epCapacity=(queue:readonly {cost:number}[])=>EP_MAX-queue.reduce((n,r)=>n+r.cost,0);
/** Count actual hit events, including multi-hit/multi-target normals, never misses/reactions. */
export function normalEpHits(event:BattleEvent){return event.command==='attack'?battleEventParts(event).filter(p=>p.actor===event.actor&&p.kind==='damage'&&p.label!=='ミス'&&p.label!=='回避'&&p.actionName!=='反撃').length:0;}
