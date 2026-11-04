import type {Unit} from './types';
export interface HeroProgress { level:number; experience:number }
export type PartyProgress = Record<string,HeroProgress>;
export const PROGRESSION = {maxLevel:50,baseExperience:100,experienceStep:50,growth:{maxHp:12,maxMp:3,attack:3,defense:1,speed:1}};
export const requiredExperience=(level:number)=>PROGRESSION.baseExperience+(level-1)*PROGRESSION.experienceStep;
export const initialParty=():PartyProgress=>Object.fromEntries(['astel','rina','mei'].map(id=>[id,{level:1,experience:0}]));
export function gainExperience(p:HeroProgress,amount:number):number {
 if(!Number.isSafeInteger(amount)||amount<0)throw new Error('経験値は0以上の整数です');
 const before=p.level;p.experience+=amount;
 while(p.level<PROGRESSION.maxLevel&&p.experience>=requiredExperience(p.level)){p.experience-=requiredExperience(p.level);p.level++}
 if(p.level===PROGRESSION.maxLevel)p.experience=0;
 return p.level-before;
}
export function growUnit(unit:Unit,progress?:HeroProgress):Unit {
 if(!progress)return unit;
 const levels=progress.level-1;unit.level=progress.level;
 for(const stat of ['maxHp','maxMp','attack','defense','speed'] as const)unit[stat]+=PROGRESSION.growth[stat]*levels;
 unit.hp=unit.maxHp;unit.mp=unit.maxMp;return unit;
}
