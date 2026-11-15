import type {Progress} from './save';
import type {HeroId} from './data/weapons';
import {acquireNode} from './skill-tree';
import {equipWeapon,unlockTestWeapons} from './equipment';
import {growthTransaction,type GrowthContext,type GrowthResult} from './growth-builds';
/** Normal editing uses the same atomic save boundary as build application. */
export function editGrowth(p:Progress,persist:()=>boolean,context:GrowthContext,action:()=>GrowthResult):GrowthResult {
 if(context.inBattle)return {ok:false,reason:'戦闘中は育成を変更できません'};
 return growthTransaction(p,persist,action);
}
export const learnGrowthNode=(p:Progress,hero:HeroId,node:string,persist:()=>boolean,context:GrowthContext)=>editGrowth(p,persist,context,()=>acquireNode(p.skillTree,hero,p.party[hero].level,node)?{ok:true}:{ok:false,reason:'習得条件を満たしていません'});
export const changeGrowthWeapon=(p:Progress,hero:HeroId,weapon:string|null,persist:()=>boolean,context:GrowthContext)=>editGrowth(p,persist,context,()=>equipWeapon(p.equipment,hero,weapon)?{ok:true}:{ok:false,reason:'装備条件を満たしていません'});
export const unlockGrowthWeapons=(p:Progress,persist:()=>boolean,context:GrowthContext)=>editGrowth(p,persist,context,()=>{unlockTestWeapons(p.equipment);return {ok:true}});
