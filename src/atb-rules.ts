import {EP_MAX} from './ep-resource';
import type {Command,Unit} from './types';
import type {WeaponFamily} from './data/weapons';
import {skills} from './data/combat';
import {equippedWeapon} from './equipment';
import {statValue} from './effects';
import {skillMpCost,treeValue} from './skill-tree';
/** v3.1 weapon CT is approved; EP, skill CT and AUTO rules retain v3.0 provisional tuning. */
export const ATB_RULES={maxEp:EP_MAX,maxReservations:4,motion:.85,referenceSpeed:20,minInterval:.8,maxInterval:60,enemyMaxInterval:6,enemyInterval:3.6,suspensionGap:5} as const;
export const WEAPON_CT:Record<WeaponFamily,number>={sword:8,bow:10,dualBlades:6,shieldSpear:8,shieldFlail:11,shieldRapier:7,wand:7,rod:9,mace:10};
/** Ratio-based progress is retained when effective SPD changes mid-charge. */
export function attackInterval(u:Unit,ally=true){
 const family=equippedWeapon(u)?.family,base=ally?(family?WEAPON_CT[family]:WEAPON_CT.sword):ATB_RULES.enemyInterval;
 const rawSpeed=statValue(u,'speed'),speed=Number.isNaN(rawSpeed)?ATB_RULES.referenceSpeed:Math.max(1,rawSpeed);
 return Math.max(ATB_RULES.minInterval,Math.min(ally?ATB_RULES.maxInterval:ATB_RULES.enemyMaxInterval,base*ATB_RULES.referenceSpeed/speed));
}
export function epCost(u:Unit,c:Command){return c==='attack'||c==='defend'||c==='potion'||c==='ether'?0:skills[c].starCost?10:Math.max(1,Math.ceil(skillMpCost(u,c)/4));}
/** MP capacity and old star-gain nodes remain useful without changing exactly +1 EP/hit. */
export function skillCooldown(u:Unit,c:Command){const capacity=Math.max(0,u.maxMp-({astel:24,rina:30,mei:48}[u.id]??u.maxMp));const reduction=Math.min(.4,capacity*.002+treeValue(u,'starGain')*.02+(treeValue(u,'mpDiscount')+treeValue(u,'commandCost',e=>e.command===c))*.03);return (skills[c].starCost?8:c==='defend'?1:2)*(1-reduction);}
