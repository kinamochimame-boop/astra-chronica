import {normalizeSurveyHistory,type SurveyHistory} from './exploration/survey-save';
import {normalizeWorld,recoverWorld} from './exploration/exploration-save';
import type {WorldSave} from './exploration/types';
import {normalizeChoices,type ChoiceRecords} from './dialogue-choices';
import {initialQuests,normalizeQuests,type QuestState} from './side-quests';
import {initialConsumables,normalizeConsumables,type Consumables} from './consumables';
import {initialSkillTree,normalizeSkillTree,type SkillTreeState} from './skill-tree';
import {initialAdventure,normalizeAdventure,type AdventureProgress} from './adventure';
import {initialEquipment,normalizeEquipment,type EquipmentState} from './equipment';
import {initialParty,PROGRESSION,requiredExperience,type PartyProgress} from './progression';
import {normalizeBuilds,type GrowthBuilds} from './growth-builds';
export interface Progress {survey?:SurveyHistory;builds?:GrowthBuilds;world?:WorldSave;version:2; started:boolean; wins:number; battles:number; party:PartyProgress; equipment:EquipmentState; adventure:AdventureProgress; skillTree:SkillTreeState; consumables:Consumables;quests:QuestState;choices:ChoiceRecords}
/** Keep the original key so existing v1 progress can be read without losing counts. */
export const SAVE_KEY='astra-chronica:v1';
export const fresh=():Progress=>({version:2,started:false,wins:0,battles:0,party:initialParty(),equipment:initialEquipment(),adventure:initialAdventure(),skillTree:initialSkillTree(),consumables:initialConsumables(),quests:initialQuests(),choices:{}});
export function load(storage?:Pick<Storage,'getItem'>):Progress{
 try{
  const p=JSON.parse((storage??localStorage).getItem(SAVE_KEY)||'null');
  if(!p||![1,2].includes(p.version)||typeof p.started!=='boolean'||!Number.isSafeInteger(p.wins)||p.wins<0||!Number.isSafeInteger(p.battles)||p.battles<p.wins)return fresh();
  const party=initialParty();
  if(p.version===2)for(const id of Object.keys(party)){
   const h=p.party?.[id];
   if(h&&Number.isSafeInteger(h.level)&&h.level>=1&&h.level<=PROGRESSION.maxLevel&&Number.isSafeInteger(h.experience)&&h.experience>=0&&h.experience<requiredExperience(h.level))party[id]={level:h.level,experience:h.level===PROGRESSION.maxLevel?0:h.experience};
  }
  const adventure=normalizeAdventure(p.adventure);
  const result:Progress={version:2,started:p.started,wins:p.wins,battles:p.battles,party,equipment:normalizeEquipment(p.equipment),adventure,skillTree:normalizeSkillTree(p.skillTree,party),consumables:normalizeConsumables(p.consumables),quests:normalizeQuests(p.quests,adventure),choices:normalizeChoices(p.choices,adventure)};if(p.survey!==undefined)result.survey=normalizeSurveyHistory(p.survey);if(p.builds!==undefined)result.builds=normalizeBuilds(p.builds);const world=normalizeWorld(p.world,adventure,result.choices);if(world)result.world=world;recoverWorld(result);return result;
 }catch{return fresh()}
}
export function save(p:Progress,storage?:Pick<Storage,'setItem'>):boolean{try{(storage??localStorage).setItem(SAVE_KEY,JSON.stringify(p));return true}catch{return false}}
