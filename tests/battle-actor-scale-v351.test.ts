import {it,expect} from 'vitest';
import {battleActorScales,actorEnvelope,BATTLE_ACTOR_SCALE} from '../src/battle-actor-scale';
import {heroes,enemyTemplates,cloneUnit} from '../src/data/combat';
import {battleAnchor} from '../src/battle-layout';
const normal=()=>[...heroes,...enemyTemplates].map(cloneUnit);
it.each([193,300,345,500,900])('normal size stays .65 at logical height %s',height=>{expect(battleActorScales(normal(),height)).toEqual(Array(6).fill(.65))});
it('equal ally/enemy size and the exact 1.12 boss ratio',()=>{const units=[...heroes,cloneUnit(enemyTemplates[0])];units[3].experienceReward=800;const s=battleActorScales(units,345);expect(s.slice(0,3)).toEqual([.65,.65,.65]);expect(s[3]).toBeCloseTo(.65*1.12)});
it.each([799,800,801])('preserves the existing reward threshold %s',xp=>{const units=normal();units[3].experienceReward=xp;const s=battleActorScales(units,345);expect(s[3]/s[0]).toBeCloseTo(xp<800?1:1.12)});
it('does not give high-XP allies the boss multiplier',()=>{const units=normal();units[0].experienceReward=5000;expect(battleActorScales(units,345)).toEqual(Array(6).fill(.65))});
it.each([96,120,160,193,300,345])('dense silhouettes fit height %s without moving anchors or overlapping',height=>{
 const units=[...heroes,...Array.from({length:3},(_,i)=>({...cloneUnit(enemyTemplates[0]),id:'enemy'+i,experienceReward:i===2?800:40}))],s=battleActorScales(units,height),models=units.map((u,i)=>{const a=battleAnchor(i,height,true,'side',3),b=actorEnvelope(u,i<3);return {x:a.x,y:a.y,left:a.x+b.left*s[i],right:a.x+b.right*s[i],top:a.y+b.top*s[i],bottom:a.y+b.bottom*s[i]}});
 for(const m of models){expect(m.left).toBeGreaterThanOrEqual(1.99);expect(m.right).toBeLessThanOrEqual(388.01);expect(m.top).toBeGreaterThanOrEqual(1.99);expect(m.bottom).toBeLessThanOrEqual(height-1.99)}
 for(let i=0;i<models.length;i++)for(let j=i+1;j<models.length;j++){const a=models[i],b=models[j];expect(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top).toBe(true)}
 expect(s[5]/s[0]).toBeCloseTo(1.12);expect(s[0]).toBeLessThanOrEqual(BATTLE_ACTOR_SCALE);
});
it('home portraits retain scale 1',()=>{expect(battleActorScales(heroes,345)).toEqual([1,1,1])});
it('six enemies retain their two-column layout and fit a short field',()=>{const units=[...heroes,...Array.from({length:6},(_,i)=>({...cloneUnit(enemyTemplates[0]),id:'enemy'+i,experienceReward:900}))];const scales=battleActorScales(units,193);expect(scales).toHaveLength(9);expect(scales.every(Number.isFinite)).toBe(true);expect(scales[3]/scales[0]).toBeCloseTo(1.12);expect(scales[0]).toBeLessThan(.65)});
it.each([0,-1,NaN,Infinity])('invalid height %s never creates NaN, Infinity or a negative scale',height=>{expect(battleActorScales(normal(),height).every(s=>Number.isFinite(s)&&s>=0&&s<=.65)).toBe(true)});
