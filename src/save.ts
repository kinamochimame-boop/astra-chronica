import {initialParty,PROGRESSION,requiredExperience,type PartyProgress} from './progression';
export interface Progress {version:2; started:boolean; wins:number; battles:number; party:PartyProgress}
/** Keep the original key so existing v1 progress can be read without losing counts. */
export const SAVE_KEY='astra-chronica:v1';
export const fresh=():Progress=>({version:2,started:false,wins:0,battles:0,party:initialParty()});
export function load(storage?:Pick<Storage,'getItem'>):Progress{
 try{
  const p=JSON.parse((storage??localStorage).getItem(SAVE_KEY)||'null');
  if(!p||![1,2].includes(p.version)||typeof p.started!=='boolean'||!Number.isSafeInteger(p.wins)||p.wins<0||!Number.isSafeInteger(p.battles)||p.battles<p.wins)return fresh();
  const party=initialParty();
  if(p.version===2)for(const id of Object.keys(party)){
   const h=p.party?.[id];
   if(h&&Number.isSafeInteger(h.level)&&h.level>=1&&h.level<=PROGRESSION.maxLevel&&Number.isSafeInteger(h.experience)&&h.experience>=0&&h.experience<requiredExperience(h.level))party[id]={level:h.level,experience:h.level===PROGRESSION.maxLevel?0:h.experience};
  }
  return {version:2,started:p.started,wins:p.wins,battles:p.battles,party};
 }catch{return fresh()}
}
export function save(p:Progress,storage?:Pick<Storage,'setItem'>):boolean{try{(storage??localStorage).setItem(SAVE_KEY,JSON.stringify(p));return true}catch{return false}}
