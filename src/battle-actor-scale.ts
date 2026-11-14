import {actorStyle} from './battle-actors';
import {battleAnchor,type BattleLayout} from './battle-layout';
import type {Unit} from './types';

export const BATTLE_ACTOR_SCALE=.65;
export const LARGE_ENEMY_SCALE=1.12;
/** Current placeholder silhouettes, weapons, shield and foot ring, in local coordinates.
 * The marker's -53 tip is checked separately against the field edge. */
export function actorEnvelope(unit:Unit,ally:boolean){
 const style=actorStyle(unit,ally);
 const top=ally?(style.silhouette==='mage'||style.family==='rod'?-49:style.family==='shieldSpear'?-46:-43):
  ({slime:-24,wing:-27,beast:-34,machine:-26,spirit:-45,knight:-43,mage:-49}[style.silhouette]);
 return {left:-46,right:46,top,bottom:39};
}
/** Fixed normal size; only actual edge/neighbor constraints may make a tiny field smaller.
 * One shared base preserves equal ally/enemy sizing and the existing boss ratio. */
export function battleActorScales(units:readonly Unit[],height:number,layout:BattleLayout='side'){
 if(units.length<=3)return units.map(()=>1); // Home portraits are unchanged.
 const h=Number.isFinite(height)?Math.max(0,height):0,enemyCount=units.length-3;
 const models=units.map((u,i)=>({...battleAnchor(i,h,true,layout,enemyCount),...actorEnvelope(u,i<3),factor:i>=3&&u.experienceReward>=800?LARGE_ENEMY_SCALE:1}));
 let base:number=BATTLE_ACTOR_SCALE;
 for(const m of models){
  base=Math.min(base,(m.x-2)/(-m.left*m.factor),(390-2-m.x)/(m.right*m.factor),
   (m.y-2)/(Math.max(54,-m.top)*m.factor),(h-2-m.y)/(m.bottom*m.factor));
 }
 for(let i=0;i<models.length;i++)for(let j=i+1;j<models.length;j++){
  const a=models[i],b=models[j],dx=b.x-a.x,dy=b.y-a.y;
  if(dx===0&&dy===0)continue; // Scaling cannot separate coincident legacy anchors.
  const spanX=dx>=0?a.right*a.factor-b.left*b.factor:b.right*b.factor-a.left*a.factor;
  const spanY=dy>=0?a.bottom*a.factor-b.top*b.factor:b.bottom*b.factor-a.top*a.factor;
  base=Math.min(base,Math.max((Math.abs(dx)-.5)/spanX,(Math.abs(dy)-.5)/spanY));
 }
 return models.map(m=>Math.max(0,base)*m.factor);
}
