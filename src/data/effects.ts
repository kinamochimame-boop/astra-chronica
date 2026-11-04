import type { Element, StatusId } from '../types';
export const ELEMENTS: Record<Element,string> = {fire:'火',water:'水',wind:'風',earth:'土',light:'光',dark:'闇',none:'無属性'};
export const EFFECT_RULES = { maxModifier:0.75, defenseReference:10, minimumDefense:1, maxDuration:99 };
export interface StatusDefinition {
  name:string; chance:number; turns:number; damageRate?:number;
  skipChance?:number; accuracy?:number; attackRate?:number; silence?:boolean; breakOnDamage?:boolean;
}
export const statusDefinitions:Record<StatusId,StatusDefinition> = {
  poison:{name:'毒',chance:0.7,turns:3,damageRate:0.05},
  paralysis:{name:'麻痺',chance:0.6,turns:3,skipChance:0.5},
  sleep:{name:'睡眠',chance:0.6,turns:2,skipChance:1,breakOnDamage:true},
  blind:{name:'暗闇',chance:0.7,turns:3,accuracy:0.5},
  silence:{name:'沈黙',chance:0.7,turns:3,silence:true},
  burn:{name:'火傷',chance:0.5,turns:3,damageRate:0.03,attackRate:0.8},
  freeze:{name:'凍結',chance:0.5,turns:2,skipChance:1,breakOnDamage:true},
};
