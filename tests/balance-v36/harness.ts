/** Measurement only: uses production ATB, reservations, items and learned commands. */
import {Battle} from '../../src/battle';
import {AtbCombat} from '../../src/atb-combat';
import {attackInterval,epCost} from '../../src/atb-rules';
import {normalEpHits} from '../../src/ep-resource';
import {battleEventParts,type Command,type Unit} from '../../src/types';
import {chapters} from '../../src/data/chapter-one';
import {encounters,encounterSetup} from '../../src/data/encounters';
import {allWeapons,HERO_IDS,type HeroId} from '../../src/data/weapons';
import {treeNodes,treeBranches} from '../../src/data/skill-tree';
import {fresh,type Progress} from '../../src/save';
import {gainExperience} from '../../src/progression';
import {acquireNode} from '../../src/skill-tree';
import {equipWeapon} from '../../src/equipment';
import {seededRandom} from '../../src/lab-session';
import {enemyAiConfig} from '../../src/enemy-ai';

export type Build='standard'|'levelOnly'|'equipmentOnly'|'treeOnly'|'balanced'|'underprepared';
export type Policy='auto'|'tactical';
export interface Context {chapter:string;event:string;encounter:string;kind:'normal'|'elite'|'boss';build:Build;progress:Progress}
/** A conditional first-clear route: only preceding main-event XP/weapons/items, no grind/quest/debug grants.
 * Items are a ceiling (no prior consumption); carry-over spending is measured separately in journeys. */
export function contexts(build:Build='standard'):Context[]{
 const p=fresh(),rows:Context[]=[];
 for(const chapter of chapters)for(const event of chapter.events){
  const q=structuredClone(p);
  if(build==='equipmentOnly')for(const h of HERO_IDS)q.party[h]={level:1,experience:0};
  if(build==='underprepared')for(const h of HERO_IDS)q.party[h].level=Math.max(1,q.party[h].level-3);
  if(['standard','equipmentOnly','balanced'].includes(build))selectEquipment(q);
  if(['standard','treeOnly','balanced'].includes(build))for(const hero of HERO_IDS){
   const branch=treeBranches.filter(b=>b.hero===hero)[hero==='mei'?1:0].id;
   for(const n of treeNodes)if(n.hero===hero&&(build!=='standard'||n.branch===branch))acquireNode(q.skillTree,hero,q.party[hero].level,n.id);
  }
  if(build==='underprepared')q.consumables={potion:0,ether:0};
  if(event.encounter){const e=encounters[event.encounter];rows.push({chapter:chapter.id,event:event.id,encounter:event.encounter,kind:event.kind==='boss'?'boss':e.enemies.some(u=>u.enemyPattern)?'elite':'normal',build,progress:q});const xp=e.enemies.reduce((s,u)=>s+u.experienceReward,0);for(const hero of HERO_IDS)gainExperience(p.party[hero],xp)}
  if(event.weaponReward)p.equipment.inventory[event.weaponReward]=(p.equipment.inventory[event.weaponReward]??0)+1;
  if(event.itemReward)p.consumables[event.itemReward.id]=Math.min(99,p.consumables[event.itemReward.id]+event.itemReward.count);
 }
 return rows;
}
export function selectEquipment(p:Progress){
 for(const hero of HERO_IDS){
  // Standard keeps a single-hit Astel sword when owned; balanced alternatives are measured independently.
  const candidates=allWeapons.filter(w=>w.owner===hero&&p.equipment.inventory[w.id]);
  const score=(w:typeof allWeapons[number])=>(w.bonuses.attack??0)+(w.bonuses.defense??0)*(hero==='rina'?1:.15)+(w.bonuses.maxHp??0)*.04+(w.bonuses.speed??0)*.5+((w.effects.healingRate??1)-1)*60+((w.effects.magicRate??1)-1)*40;
  candidates.sort((a,b)=>score(b)-score(a)||a.id.localeCompare(b.id));
  if(candidates[0])equipWeapon(p.equipment,hero,candidates[0].id);
 }
}
export function summaryContext(ctx:Context){const p=ctx.progress,b=new Battle(()=>.5,p.party,undefined,p.equipment,encounterSetup(ctx.encounter),p.skillTree,p.consumables);return {
 chapter:ctx.chapter,event:ctx.event,encounter:ctx.encounter,kind:ctx.kind,build:ctx.build,
 party:b.allies.map(u=>({id:u.id,level:u.level,hp:u.maxHp,attack:u.attack,defense:u.defense,speed:u.speed,weapon:u.weaponId,ct:attackInterval(u),tree:p.skillTree[u.id as HeroId]})),
 armor:'not implemented; no imaginary armor',items:p.consumables,
 enemies:b.enemies.map(u=>({id:u.enemyTemplateId,hp:u.maxHp,attack:u.attack,defense:u.defense,speed:u.speed,xp:u.experienceReward,ct:attackInterval(u,false),ai:enemyAiConfig(u)??{role:u.enemyPattern?'script':'legacy'},pattern:u.enemyPattern})),
}}
export function simulate(ctx:Context,seed:number,policy:Policy,BattleType:typeof Battle=Battle,limit=600,items=ctx.progress.consumables,AtbType:typeof AtbCombat=AtbCombat){
 const p=ctx.progress,b=new BattleType(seededRandom(seed),p.party,undefined,p.equipment,encounterSetup(ctx.encounter),p.skillTree,items),c=new AtbType(b);
 const metrics={damage:0,dealt:0,healing:0,knockouts:0,guards:0,enemyGuards:0,epGained:0,epSpent:0,epRefunded:0,epDrained:0,epItem:0,normalHits:0,normalAttacks:0,skills:{} as Record<string,number>,targets:{astel:0,rina:0,mei:0} as Record<string,number>};
 const warning=new Set<string>(),knownEp=new Map(b.allies.map(u=>[u.id,0]));let hp=b.allies.map(u=>u.hp),steps=0;
 c.onEvent=e=>{
  const parts=battleEventParts(e),ally=b.allies.some(u=>u.id===e.actor);
  for(const [i,u] of b.allies.entries()){
   const lost=parts.filter(t=>t.target===u.id).reduce((s,t)=>s+(t.hpLoss??0),0),healed=parts.filter(t=>t.target===u.id&&t.kind==='heal'&&(!t.resource||t.resource==='hp')).reduce((s,t)=>s+t.amount,0);
   metrics.damage+=lost+Math.max(0,hp[i]-u.hp-lost+healed);metrics.healing+=healed;if(hp[i]>0&&u.hp===0)metrics.knockouts++;
   const change=c.slot(u.id).ep-knownEp.get(u.id)!;
   if(change>0){
    if(e.command==='ether'&&e.target===u.id)metrics.epItem+=change;
    else{const earned=e.actor===u.id&&e.command==='attack'?Math.min(change,normalEpHits(e)):0;metrics.epGained+=earned;metrics.epRefunded+=change-earned;}
   }else if(change<0)metrics.epDrained-=change;
   knownEp.set(u.id,c.slot(u.id).ep);
  }
  hp=b.allies.map(u=>u.hp);
  if(ally){metrics.skills[e.actor+':'+e.command]=(metrics.skills[e.actor+':'+e.command]??0)+1;if(e.command==='attack'){metrics.normalAttacks++;metrics.normalHits+=normalEpHits(e)}if(e.command==='defend'||e.command==='guard')metrics.guards++;
   metrics.dealt+=parts.filter(t=>b.enemies.some(u=>u.id===t.target)).reduce((s,t)=>s+(t.hpLoss??0),0);
  }else{if(e.command==='defend')metrics.enemyGuards++;for(const part of parts)if(part.kind==='damage'&&part.target in metrics.targets)metrics.targets[part.target]++;
   if(e.hint?.includes('次は'))warning.add(e.actor);else warning.delete(e.actor);
  }
 };
 c.start();
 while(!b.result&&c.time<limit){if(policy==='tactical')decide();c.advance(.25);
  // Invalid-target/death refunds can occur without publishing an action. They are NOT normal-hit EP.
  for(const u of b.allies){const ep=c.slot(u.id).ep,delta=ep-knownEp.get(u.id)!;if(delta>0)metrics.epRefunded+=delta;knownEp.set(u.id,ep)}
  if(++steps>Math.ceil(limit/.25)+1)throw Error('ATB failed to advance');}
 function decide(){
  const living=b.allies.filter(u=>u.hp>0),hurt=[...living].sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp),worst=hurt[0];
  const enemies=b.enemies.filter(u=>u.hp>0),target=[...enemies].sort((a,b)=>a.hp-b.hp)[0];if(target)c.targetId=target.id;
  for(const u of living){const slot=c.slot(u.id);if(slot.queue.length||slot.busyUntil>c.time)continue;
   const reserve=(cmd:Command,t?:string)=>{if(c.reason(u.id,cmd,t)||(slot.cooldowns[cmd]??0)>c.time)return false;const result=c.reserve(u.id,cmd,t);if(result.ok){metrics.epSpent+=slot.queue.at(-1)!.cost;knownEp.set(u.id,slot.ep)}return result.ok};
   if(worst&&worst.hp/worst.maxHp<.25&&reserve('potion',worst.id))continue;
   if(u.id==='mei'&&worst){
    if((hurt.filter(v=>v.hp/v.maxHp<.65).length>=2||hurt.some(v=>v.statuses.length>=2))&&reserve('miracle'))continue;
    if(hurt.filter(v=>v.maxHp-v.hp>=50).length>=2&&reserve('groupHeal'))continue;
    if(worst.maxHp-worst.hp>=70&&reserve('heal',worst.id))continue;
   }
   if(warning.size&&slot.progress<.85&&!u.guarding&&reserve(u.id==='rina'?'guard':'defend'))continue;
   if(u.id==='rina'){
    if(u.hp/u.maxHp>.5&&!living.some(a=>(a.tauntRounds??0)>0)&&reserve('taunt'))continue;
    if(worst&&worst.id!==u.id&&worst.hp/worst.maxHp<.45&&!u.covering&&reserve('cover',worst.id))continue;
    if(!living.some(a=>a.modifiers.some(m=>m.stat==='defense'&&m.amount>0))&&reserve('guardianField'))continue;
    if(warning.size&&reserve('oathShield'))continue;
    if(target&&!target.statuses.some(s=>s.id==='paralysis'))reserve('shieldBash',target.id);
   }else if(u.id==='astel'){
    if(!target)continue;
    if(reserve('starSlash',target.id))continue;
    if(!target.modifiers.some(m=>m.stat==='defense'&&m.amount<0)&&reserve('armorBreak',target.id))continue;
    if(!u.modifiers.some(m=>m.stat==='speed'&&m.amount>0)&&reserve('galeSlash',target.id))continue;
    reserve('strong',target.id);
   }else if(target){
    const spells=(['fire','ice','thunder'] as Command[]).sort((a,b)=>spellScore(u,b,target)-spellScore(u,a,target));
    if(worst.hp/worst.maxHp>.65)for(const cmd of spells)if(reserve(cmd,target.id))break;
   }
  }
 }
 const remaining=b.allies.map(u=>({id:u.id,hp:u.hp,maxHp:u.maxHp})),consumed={potion:items.potion-b.itemInventory().potion,ether:items.ether-b.itemInventory().ether};
 return {outcome:b.result??'timeout',seconds:c.time,...metrics,remaining,consumed,steps};
}
import {skills} from '../../src/data/combat';
export function spellScore(u:Unit,command:Command,target:Unit){const skill=skills[command];return (skill.power??0)*(target.affinities[skill.element]??1)/(epCost(u,command)||1)}

/** Controlled training target, NOT a story victory or a player build used for difficulty gates.
 * No target attacks/statuses. Isolates a weapon's own timing, rounding, EP cap and skill conversions. */
export function weaponWindow(weaponId:string,level:number,seconds:30|60,policy:Policy,seed=36){
 const p=fresh(),weapon=allWeapons.find(w=>w.id===weaponId)!;
 for(const id of HERO_IDS)p.party[id].level=level;
 p.equipment.inventory[weaponId]=1;equipWeapon(p.equipment,weapon.owner,weaponId);
 const b=new Battle(seededRandom(seed),p.party,undefined,p.equipment,encounterSetup('forest-entry'));
 const actor=b.allies.find(u=>u.id===weapon.owner)!;
 // Training setup removes interference; it grants no commands, EP, HP or damage to the measured hero.
 for(const u of b.allies)if(u!==actor)u.hp=0;
 b.enemies.splice(1);const dummy=b.enemies[0];dummy.hp=dummy.maxHp=1e9;dummy.defense=10;dummy.attack=0;dummy.speed=1;dummy.attackStatuses=[];
 const c=new AtbCombat(b);c.slot(dummy.id).busyUntil=seconds+1;
 let attacks=0,hits=0,damage=0,epCredited=0,epSpent=0,used:Record<string,number>={};
 c.onEvent=e=>{if(e.actor!==actor.id)return;const parts=battleEventParts(e);damage+=parts.reduce((s,e)=>s+(e.hpLoss??0),0);
  if(e.command==='attack'){attacks++;hits+=normalEpHits(e);}
  else used[e.command]=(used[e.command]??0)+1;
 };
 c.start();let steps=0;
 while(c.time<seconds-1e-8){if(policy==='tactical'&&c.slot(actor.id).busyUntil<=c.time&&!c.slot(actor.id).queue.length){
  const candidates:Command[]=weapon.owner==='astel'?['strong']:weapon.owner==='rina'?['shieldBash']:['fire'];
  for(const command of candidates)if(!c.reason(actor.id,command,dummy.id)&&(c.slot(actor.id).cooldowns[command]??0)<=c.time){const cost=epCost(actor,command);if(c.reserve(actor.id,command,dummy.id).ok)epSpent+=cost;break}
 }c.advance(Math.min(.25,seconds-c.time));if(++steps>241)throw Error('window stalled')}
 // With no drains/items/cancellations, credited EP follows exact conservation.
 epCredited=c.slot(actor.id).ep+epSpent;
 return {weapon:weapon.id,family:weapon.family,owner:weapon.owner,level,seconds,policy,seed,ct:attackInterval(actor),attacks,hits,damage,epPotential:hits,epCredited,epSpent,epRemaining:c.slot(actor.id).ep,skills:used,hp:actor.hp,maxHp:actor.maxHp,healingRate:weapon.effects.healingRate??1,magicRate:weapon.effects.magicRate??1,defense:actor.defense};
}

/** One legal cast at Lv20, with a declared EP15/HP deficit training fixture. Actual event values. */
export function skillTrials(AtbType:typeof AtbCombat=AtbCombat){
 return (['strong','starSlash','heal','miracle','oathShield'] as Command[]).map(command=>{
  const p=fresh();for(const hero of HERO_IDS)p.party[hero].level=20;
  const b=new Battle(()=>.99,p.party,undefined,p.equipment,encounterSetup('forest-guardian'));
  for(const u of b.allies){u.hp-=120;u.statuses=[{id:'poison',remaining:3}]}
  const c=new AtbType(b);c.auto=false;c.start();const hero=['heal','miracle'].includes(command)?'mei':command==='oathShield'?'rina':'astel';
  c.slot(hero).ep=15;let event:import('../../src/types').BattleEvent|undefined;c.onEvent=e=>{event=e};
  const target=command==='strong'||command==='starSlash'?'enemy0':command==='heal'?'astel':undefined;
  const r=c.reserve(hero,command,target);if(!r.ok)throw Error(r.reason);
  const cost=c.slot(hero).queue[0].cost;c.advance(.001);if(!event)throw Error('cast did not fire');
  const parts=battleEventParts(event),damage=parts.filter(e=>e.kind==='damage').reduce((s,e)=>s+(e.hpLoss??0),0),healing=parts.filter(e=>e.kind==='heal').reduce((s,e)=>s+e.amount,0);
  return {command,cost,damage,healing,barriers:b.allies.filter(u=>(u.barrierCharges??0)>0).length,cleansed:b.allies.filter(u=>!u.statuses.length).length,epRemaining:c.slot(hero).ep,damagePerEp:damage/cost,healingPerEp:healing/cost};
 });
}

/** Measured support effects on the same neutral training party; no imaginary weapon passives. */
export function weaponSupport(weaponId:string){
 const p=fresh(),weapon=allWeapons.find(w=>w.id===weaponId)!;for(const id of HERO_IDS)p.party[id].level=20;
 p.equipment.inventory[weaponId]=1;equipWeapon(p.equipment,weapon.owner,weaponId);
 const b=new Battle(()=>.99,p.party,undefined,p.equipment,encounterSetup('forest-entry'));
 const u=b.allies.find(u=>u.id===weapon.owner)!;for(const a of b.allies)a.hp-=120;
 const c=new AtbCombat(b);c.auto=false;c.start();c.slot(u.id).ep=15;
 const command:Command=weapon.owner==='mei'?'heal':weapon.owner==='rina'?'guard':'strong';
 let amount=0;c.onEvent=e=>{amount+=battleEventParts(e).reduce((s,p)=>s+p.amount,0)};
 const r=c.reserve(u.id,command,command==='heal'?'astel':command==='strong'?'enemy0':undefined);if(!r.ok)throw Error(r.reason);const cost=c.slot(u.id).queue[0].cost;c.advance(.001);
 return {weapon:weaponId,family:weapon.family,level:20,command,cost,amount,maxHp:u.maxHp,defense:u.defense,guarding:u.guarding??null};
}
