import {DEFAULT_WEAPONS,HERO_IDS,weapons,allWeapons,weaponById,type HeroId} from './data/weapons';
import {cloneUnit} from './data/combat';
import type {Unit} from './types';
export interface EquipmentState {inventory:Record<string,number>;equipped:Record<HeroId,string|null>}
export const MAX_ITEM_COUNT=9999;
export function initialEquipment():EquipmentState{return {inventory:Object.fromEntries(Object.values(DEFAULT_WEAPONS).map(id=>[id,1])),equipped:{...DEFAULT_WEAPONS}}}
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
/** Quantity is total owned, including equipped copies; no consume/grant on switching. */
export function normalizeEquipment(raw:unknown):EquipmentState {
 if(!object(raw)||!object(raw.inventory))return initialEquipment();
 const state:EquipmentState={inventory:{},equipped:{astel:null,rina:null,mei:null}};
 for(const w of allWeapons){const n=raw.inventory[w.id];if(typeof n==='number'&&Number.isSafeInteger(n)&&n>0&&n<=MAX_ITEM_COUNT)state.inventory[w.id]=n}
 const slots=object(raw.equipped)?raw.equipped:{};
 for(const hero of HERO_IDS){const id=Object.hasOwn(slots,hero)?slots[hero]:DEFAULT_WEAPONS[hero];if(typeof id==='string'&&!equipReason(state,hero,id))state.equipped[hero]=id}
 return state;
}
export function equipReason(state:EquipmentState,hero:string,id:string|null):string {
 if(!HERO_IDS.includes(hero as HeroId))return '装備対象が不正です';
 if(id===null)return '';
 const weapon=weaponById(id);if(!weapon)return '武器が見つかりません';
 if(weapon.owner!==hero)return 'このキャラクターは装備できません';
 const count=state.inventory[id]??0;if(count<1)return '所持していません';
 const used=HERO_IDS.filter(h=>h!==hero&&state.equipped[h]===id).length;
 return used>=count?'すべて装備中です':'';
}
export function equipWeapon(state:EquipmentState,hero:HeroId,id:string|null):boolean {
 if(equipReason(state,hero,id))return false;state.equipped[hero]=id;return true;
}
export function grantWeapon(state:EquipmentState,id:string,count=1):boolean {
 const current=state.inventory[id]??0;
 if(!weaponById(id)||!Number.isSafeInteger(count)||count<1||current+count>MAX_ITEM_COUNT)return false;
 state.inventory[id]=current+count;return true;
}
/** Explicit out-of-battle test unlock, idempotent even after reload. */
export function unlockTestWeapons(state:EquipmentState):boolean {
 let changed=false;for(const w of weapons)if(!state.inventory[w.id]){grantWeapon(state,w.id);changed=true}return changed;
}
/** Derived copy, separate from temporary modifiers. Reapplying replaces the old flat bonus. */
export function equippedUnit(base:Unit,id:string|null|undefined):Unit {
 const unit=cloneUnit(base),previous=weaponById(unit.weaponId),next=weaponById(id);
 for(const stat of ['attack','defense','speed','maxHp'] as const)unit[stat]=unit[stat]-(previous?.bonuses[stat]??0)+(next?.owner===base.id?next.bonuses[stat]??0:0);
 unit.hp=Math.min(unit.maxHp,Math.max(0,unit.hp+unit.maxHp-base.maxHp));
 unit.weaponId=next?.owner===base.id?next.id:undefined;return unit;
}
export function equippedWeapon(unit:Unit){const w=weaponById(unit.weaponId);return w?.owner===unit.id?w:undefined}
