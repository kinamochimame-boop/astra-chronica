/** Read-only deterministic balance harness. Does not use localStorage or game progress. */
import {Battle} from '../src/battle';
import {AtbCombat} from '../src/atb-combat';
import {epCost} from '../src/atb-rules';
import {battleEventParts,type BattleEvent} from '../src/types';
import {chapters} from '../src/data/chapter-one';
import {encounters,encounterSetup} from '../src/data/encounters';
import {allWeapons,type HeroId} from '../src/data/weapons';
import {treeNodes} from '../src/data/skill-tree';
import {fresh} from '../src/save';
import {acquireNode} from '../src/skill-tree';
import {equipWeapon} from '../src/equipment';
import {seededRandom} from '../src/lab-session';
import {ENEMY_AI,enemyAiConfig} from '../src/enemy-ai';
export const AI_BASE='e330b270e439128b219b0ee8d106355435c81dd2';
export const aiCatalog=Object.entries(ENEMY_AI).map(([id,config])=>({id,...config,variants:[...new Set(Object.values(encounters).flatMap(e=>e.enemies).filter(u=>u.id===id).map(u=>u.name))],encounters:Object.entries(encounters).filter(([,e])=>e.enemies.some(u=>u.id===id)).map(([id])=>id)}));
export function balanceCases(){const p=fresh(),cases:{chapter:string;event:string;encounter:string;party:typeof p.party;equipment:typeof p.equipment;skillTree:typeof p.skillTree;affected:boolean}[]=[];
 for(const [index,chapter] of chapters.entries()){
  for(const hero of Object.keys(p.party) as HeroId[])p.party[hero].level=Math.min(50,Math.max(1,index*4-1));
  for(const node of treeNodes)acquireNode(p.skillTree,node.hero,p.party[node.hero].level,node.id);
  for(const event of chapter.events){
   for(const hero of Object.keys(p.party) as HeroId[]){const best=allWeapons.filter(w=>w.owner===hero&&p.equipment.inventory[w.id]).sort((a,b)=>score(b,hero)-score(a,hero))[0];if(best)equipWeapon(p.equipment,hero,best.id)}
   if(event.encounter)cases.push({chapter:chapter.id,event:event.id,encounter:event.encounter,party:structuredClone(p.party),equipment:structuredClone(p.equipment),skillTree:structuredClone(p.skillTree),affected:encounterSetup(event.encounter)!.enemies.some(u=>!!enemyAiConfig(u)&&enemyAiConfig(u)!.role!=='standard')});
   if(event.weaponReward)p.equipment.inventory[event.weaponReward]=(p.equipment.inventory[event.weaponReward]??0)+1;
  }
 }return cases;
}
function score(w:typeof allWeapons[number],hero:HeroId){return (w.bonuses.attack??0)+(w.bonuses.defense??0)*(hero==='rina'?1:.1)+(w.bonuses.maxHp??0)*.03+(w.bonuses.maxMp??0)*.3+((w.effects.magicRate??1)-1)*60+((w.effects.healingRate??1)-1)*40}
export function simulate(BattleType:typeof Battle,context:ReturnType<typeof balanceCases>[number],seed:number,policy:'auto'|'support'){
 const b=new BattleType(seededRandom(seed),context.party,undefined,context.equipment,encounterSetup(context.encounter),context.skillTree,{potion:3,ether:3}),c=new AtbCombat(b);
 let damage=0,knockouts=0,guards=0,actions=0;const targets:Record<string,number>={astel:0,rina:0,mei:0};let hp=b.allies.map(u=>u.hp);
 c.onEvent=e=>{const parts=battleEventParts(e);for(const [i,u] of b.allies.entries()){
  const loss=parts.filter(p=>p.target===u.id).reduce((n,p)=>n+(p.hpLoss??0),0),healed=parts.filter(p=>p.target===u.id&&p.kind==='heal'&&p.resource!=='ep'&&p.resource!=='mp').reduce((n,p)=>n+p.amount,0);
  damage+=loss+Math.max(0,hp[i]-u.hp-loss+healed);if(hp[i]>0&&u.hp===0)knockouts++;}
  hp=b.allies.map(u=>u.hp);if(b.enemies.some(u=>u.id===e.actor)){actions++;if(e.command==='defend')guards++;else for(const p of e.effects??[e])if(p.target in targets)targets[p.target]++;}
 };
 c.start();let steps=0;
 while(!b.result&&c.time<600){if(policy==='support'){
  const living=b.allies.filter(u=>u.hp>0),hurt=[...living].sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp),worst=hurt[0];
  for(const u of living){const slot=c.slot(u.id);if(slot.queue.length||slot.busyUntil>c.time)continue;
   const reserve=(cmd:import('../src/types').Command,target?:string)=>{if(!c.reason(u.id,cmd,target)){c.reserve(u.id,cmd,target);return true}return false};
   if(worst?.hp/worst?.maxHp<.35&&reserve('potion',worst.id))continue;
   if(u.id==='mei'&&worst&&worst.hp/worst.maxHp<.7){if(hurt.filter(a=>a.hp/a.maxHp<.75).length>=2&&reserve('groupHeal'))continue;if(reserve('heal',worst.id))continue;}
   if(u.id==='rina'){if(u.hp/u.maxHp<.45&&u.guarding!=='guard'&&reserve('guard'))continue;if(!living.some(a=>(a.tauntRounds??0)>0)&&u.hp/u.maxHp>.45&&reserve('taunt'))continue;}
   if(u.id==='astel'&&c.slot(u.id).ep>=epCost(u,'starSlash')&&reserve('starSlash',c.targetId))continue;
   if(u.id==='astel')reserve('strong',c.targetId);
  }
 }c.advance(.5);steps++;if(steps>1201)throw Error('ATB did not advance');}
 return {outcome:b.result??'timeout',seconds:c.time,damage,knockouts,guards,actions,targets};
}
/** Full events/states for every boss, both last-judge routes, through phases and interrupted charge. */
export const scriptCases=()=>Object.entries(encounters).flatMap(([key,e])=>e.enemies.flatMap((u,index)=>u.enemyPattern?[{key,index,id:u.id,pattern:u.enemyPattern}]:[]));
export function bossTrace(BattleType:typeof Battle,encounter:string,route:'direct'|'shelter',seed:number,index=0){
 const setup=encounterSetup(encounter,{'c17-branch':route==='shelter'?'listen':'ask'})!;setup.enemies=[setup.enemies[index]];
 const b=new BattleType(seededRandom(seed),undefined,()=>true,undefined,setup);
 for(const u of b.allies)u.hp=u.maxHp=1000000;
 const actor=b.enemies[0],trace:{event:BattleEvent;state:unknown}[]=[];let interrupted=false;
 for(let n=0;n<24;n++){
  actor.hp=Math.max(50,Math.floor(actor.maxHp*(n<5?1:n<12?.6:n<18?.2:.01)));
  if(n%3===0)b.allies[0].tauntRounds=2;else b.allies[0].tauntRounds=undefined;
  b.allies[1].covering=n%2===0?'astel':undefined;
  const r=b.resolveRealtime(actor.id,'attack',undefined,true);if(!r.ok)throw Error(r.reason);
  trace.push({event:structuredClone(r.event),state:structuredClone(b.units)});
  if(!interrupted&&r.event.hint?.includes('次は')){actor.statuses=[{id:'freeze',remaining:3}];actor.hp=Math.floor(actor.maxHp*.15);interrupted=true;}
  if(actor.counterReady){const hit=b.resolveRealtime('astel','attack',actor.id,true);if(!hit.ok)throw Error(hit.reason);trace.push({event:structuredClone(hit.event),state:structuredClone(b.units)});}
 }return {trace,interrupted};
}
