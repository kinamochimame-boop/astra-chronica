import {EP_MAX} from './ep-resource';
import type {Command,Unit} from './types';
import type {WeaponFamily} from './data/weapons';
import {skills} from './data/combat';
import {equippedWeapon} from './equipment';
import {statValue} from './effects';
import {skillMpCost,treeValue} from './skill-tree';
/** Provisional v3.0 tuning. No historical formal CT/EP specification was found. */
export const ATB_RULES={maxEp:EP_MAX,maxReservations:4,motion:.85,referenceSpeed:20,minInterval:.8,maxInterval:6,enemyInterval:3.6,suspensionGap:5} as const;
export const WEAPON_CT:Record<WeaponFamily,number>={sword:2.4,bow:2.2,dualBlades:2.6,shieldSpear:2.8,shieldFlail:3,shieldRapier:2.5,wand:2.4,rod:2.8,mace:2.6};
export function attackInterval(u:Unit,ally=true){const family=equippedWeapon(u)?.family;return Math.max(ATB_RULES.minInterval,Math.min(ATB_RULES.maxInterval,(ally?(family?WEAPON_CT[family]:2.4):ATB_RULES.enemyInterval)*ATB_RULES.referenceSpeed/Math.max(1,statValue(u,'speed'))));}
export function epCost(u:Unit,c:Command){return c==='attack'||c==='defend'||c==='potion'||c==='ether'?0:skills[c].starCost?10:Math.max(1,Math.ceil(skillMpCost(u,c)/4));}
/** MP capacity and old star-gain nodes remain useful without changing exactly +1 EP/hit. */
export function skillCooldown(u:Unit,c:Command){const capacity=Math.max(0,u.maxMp-({astel:24,rina:30,mei:48}[u.id]??u.maxMp));const reduction=Math.min(.4,capacity*.002+treeValue(u,'starGain')*.02+(treeValue(u,'mpDiscount')+treeValue(u,'commandCost',e=>e.command===c))*.03);return (skills[c].starCost?8:c==='defend'?1:2)*(1-reduction);}
