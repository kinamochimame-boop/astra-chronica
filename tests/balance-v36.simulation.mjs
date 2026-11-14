/** Reproducible paired baseline/current measurements; never writes game storage. */
import {createServer} from 'vite';
import {writeFileSync,mkdirSync,rmSync,readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {productionFingerprint} from './production-fingerprint.mjs';
const base='bf8921eb0b50ce5da6cabb4aa2c54f3e8cb5f968',legacy='e330b270e439128b219b0ee8d106355435c81dd2',dir='tests/.v36-baseline';
mkdirSync(dir,{recursive:true});const sourceHashes={};
for(const [name,commit,file] of [['battle',base,'battle'],['atb-combat',base,'atb-combat'],['atb-rules',base,'atb-rules'],['legacy-battle',legacy,'battle']]){
 const source=execFileSync('git',['show',commit+':src/'+file+'.ts'],{encoding:'utf8'});sourceHashes[name]=createHash('sha256').update(source).digest('hex');
 let rewritten=source.replaceAll("from './","from '../../src/");
 if(name==='atb-combat')rewritten=rewritten.replace("from '../../src/atb-rules'","from './atb-rules'");
 writeFileSync(dir+'/'+name+'.ts',rewritten);
}
// Isolate focus selection, keeping v3.5 guard/status/boss behavior. Not a production switch.
const aiSource=execFileSync('git',['show',base+':src/enemy-ai.ts'],{encoding:'utf8'});
assert.equal(aiSource.split("role:'aggressive',targetPolicy:'wounded',focusChance:.6").length,2);
writeFileSync(dir+'/random-target-ai.ts',aiSource.replace("role:'aggressive',targetPolicy:'wounded',focusChance:.6","role:'aggressive',targetPolicy:'random',focusChance:0").replaceAll("from './","from '../../src/"));
writeFileSync(dir+'/random-target-battle.ts',readFileSync(dir+'/battle.ts','utf8').replace("from '../../src/enemy-ai'","from './random-target-ai'"));
sourceHashes.randomTargetAi=createHash('sha256').update(readFileSync(dir+'/random-target-ai.ts')).digest('hex');
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
export function aggregate(rows,key){
 const values=rows.map(r=>r[key]),n=values.length;
 return {battles:n,wins:values.filter(r=>r.outcome==='victory').length,timeouts:values.filter(r=>r.outcome==='timeout').length,
  ...Object.fromEntries(['seconds','damage','dealt','healing','knockouts','guards','enemyGuards','epGained','epSpent','epRefunded','epDrained','epItem','normalHits','normalAttacks'].map(k=>[k,values.reduce((s,r)=>s+r[k],0)/n])),
  remainingRatio:values.reduce((s,r)=>s+r.remaining.reduce((s,u)=>s+u.hp,0)/r.remaining.reduce((s,u)=>s+u.maxHp,0),0)/n,
  consumed:Object.fromEntries(['potion','ether'].map(k=>[k,values.reduce((s,r)=>s+r.consumed[k],0)/n])),
  targets:Object.fromEntries(['astel','rina','mei'].map(k=>[k,values.reduce((s,r)=>s+r.targets[k],0)])),
  skills:Object.fromEntries([...new Set(values.flatMap(r=>Object.keys(r.skills)))].sort().map(k=>[k,values.reduce((s,r)=>s+(r.skills[k]??0),0)]))};
}
try{
 const m=await server.ssrLoadModule('/tests/balance-v36/harness.ts'),old=await server.ssrLoadModule('/'+dir+'/battle.ts'),oldAtb=await server.ssrLoadModule('/'+dir+'/atb-combat.ts'),randomAi=await server.ssrLoadModule('/'+dir+'/random-target-battle.ts');
 const seeds=Number(process.env.BALANCE_SEEDS||20);assert.ok(Number.isInteger(seeds)&&seeds>=1&&seeds<=100);
 const rows=[],builds=['standard','levelOnly','equipmentOnly','treeOnly','balanced','underprepared'];
 for(const build of builds){for(const policy of ['auto','tactical'])for(let seed=1;seed<=seeds;seed++)for(const ctx of m.contexts(build)){
  const before=m.simulate(ctx,seed,policy,old.Battle,600,ctx.progress.consumables,oldAtb.AtbCombat),after=m.simulate(ctx,seed,policy);
  const row={event:ctx.event,chapter:ctx.chapter,kind:ctx.kind,build,policy,seed,before,after};
  if(build==='standard'){row.randomBefore=m.simulate(ctx,seed,policy,randomAi.Battle,600,ctx.progress.consumables,oldAtb.AtbCombat);row.randomAfter=m.simulate(ctx,seed,policy,randomAi.Battle);}
  if(policy==='auto')assert.deepEqual(after,before,'AUTO does not spend skill EP: '+ctx.event);
  rows.push(row);
 }console.log('MEASURED paired',build,rows.length)}
 const comparisons=[];for(const build of builds)for(const policy of ['auto','tactical'])for(const kind of ['normal','elite','boss']){
  const set=rows.filter(r=>r.build===build&&r.policy===policy&&r.kind===kind);comparisons.push({build,policy,kind,before:aggregate(set,'before'),after:aggregate(set,'after')});
 }
 const perEncounter=m.contexts().map(ctx=>({event:ctx.event,kind:ctx.kind,chapter:ctx.chapter,policies:['auto','tactical'].map(policy=>{const set=rows.filter(r=>r.build==='standard'&&r.event===ctx.event&&r.policy===policy);return {policy,before:aggregate(set,'before'),after:aggregate(set,'after'),randomBefore:aggregate(set,'randomBefore'),randomAfter:aggregate(set,'randomAfter')}})}));
 const weapons=await server.ssrLoadModule('/src/data/weapons.ts'),windows=[];
 for(const w of weapons.weapons)for(const level of [1,20,50])for(const seconds of [30,60])for(const policy of ['auto','tactical'])for(let seed=1;seed<=seeds;seed++)windows.push(m.weaponWindow(w.id,level,seconds,policy,seed));
 const journeys=[];
 for(const policy of ['auto','tactical'])for(let seed=1;seed<=seeds;seed++){
  let spent={potion:0,ether:0};const battles=[];
  for(const ctx of m.contexts()){
   const items={potion:Math.max(0,ctx.progress.consumables.potion-spent.potion),ether:Math.max(0,ctx.progress.consumables.ether-spent.ether)};
   const result=m.simulate(ctx,seed,policy,undefined,600,items);battles.push({event:ctx.event,outcome:result.outcome,consumed:result.consumed});
   spent.potion+=result.consumed.potion;spent.ether+=result.consumed.ether;
   if(result.outcome!=='victory')break;
  }
  journeys.push({policy,seed,battles,cleared:battles.length===109&&battles.every(b=>b.outcome==='victory'),spent});
 }
 for(const e of perEncounter){const t=e.policies.find(p=>p.policy==='tactical');assert.ok(t.after.wins/t.after.battles>=({normal:.95,elite:.85,boss:.75}[e.kind]),'difficulty target: '+e.event);assert.equal(t.after.timeouts,0);}
 for(const r of rows)for(const key of ['before','after']){const v=r[key];assert.ok(v.epGained<=v.normalHits&&v.epGained>=0);assert.ok(v.remaining.every(u=>u.hp>=0&&u.hp<=u.maxHp));}
 assert.ok(journeys.filter(j=>j.policy==='tactical').every(j=>j.cleared),'finite item supply first-clear route');
 const weaponEncounters=[];
 for(const index of [0,54,108]){const ctx=m.contexts()[index];
  for(const hero of weapons.HERO_IDS)for(const family of [...new Set(weapons.allWeapons.filter(w=>w.owner===hero).map(w=>w.family))]){
   const owned=weapons.allWeapons.filter(w=>w.owner===hero&&w.family===family&&ctx.progress.equipment.inventory[w.id]);
   owned.sort((a,b)=>(b.bonuses.attack??0)-(a.bonuses.attack??0)||a.id.localeCompare(b.id));
   if(!owned[0])continue;
   const variant=structuredClone(ctx);variant.progress.equipment.equipped[hero]=owned[0].id;
   for(const policy of ['auto','tactical'])for(let seed=1;seed<=seeds;seed++)weaponEncounters.push({event:ctx.event,hero,family,weapon:owned[0].id,policy,seed,result:m.simulate(variant,seed,policy)});
  }
 }
 const report={base,legacy,randomTargetPolicy:'aggressive-only random target; guard/status/boss/taunt/cover unchanged',sourceHashes,sourceHash:productionFingerprint(),seeds,skillTrials:{before:m.skillTrials(oldAtb.AtbCombat),after:m.skillTrials()},contexts:m.contexts().map(m.summaryContext),comparisons,perEncounter,journeys,weaponEncounters,weaponWindows:windows,rows};
 const out=process.env.BALANCE_OUTPUT||'/tmp/v36-balance.json';mkdirSync(out.slice(0,out.lastIndexOf('/')),{recursive:true});writeFileSync(out,JSON.stringify(report));
 const compact={...report,rows:undefined,weaponWindows:undefined,weaponSupport:weapons.weapons.map(w=>m.weaponSupport(w.id))};
 compact.weaponSummary=weapons.weapons.flatMap(w=>[1,20,50].flatMap(level=>[30,60].flatMap(seconds=>['auto','tactical'].map(policy=>{const set=windows.filter(x=>x.weapon===w.id&&x.level===level&&x.seconds===seconds&&x.policy===policy);return {weapon:w.id,family:w.family,level,seconds,policy,runs:set.length,...Object.fromEntries(['ct','attacks','hits','damage','epPotential','epCredited','epSpent','epRemaining','hp','maxHp','defense','healingRate','magicRate'].map(k=>[k,set.reduce((s,x)=>s+x[k],0)/set.length])),skills:Object.fromEntries([...new Set(set.flatMap(x=>Object.keys(x.skills)))].map(k=>[k,set.reduce((s,x)=>s+(x.skills[k]??0),0)/set.length]))}}))));
 writeFileSync(out.replace(/\.json$/, '-summary.json'),JSON.stringify(compact,null,2)+'\n');
 writeFileSync(out.replace(/\.json$/, '-encounters.csv'),'chapter,event,kind,policy,before_wins,after_wins,runs,before_seconds,after_seconds,before_knockouts,after_knockouts\n'+perEncounter.flatMap(e=>e.policies.map(p=>[e.chapter,e.event,e.kind,p.policy,p.before.wins,p.after.wins,p.after.battles,p.before.seconds,p.after.seconds,p.before.knockouts,p.after.knockouts].join(','))).join('\n')+'\n');
 console.log('PASS v3.6 balance',JSON.stringify({seeds,paired:rows.length,aiComparisons:rows.filter(r=>r.build==='standard').length,windows:windows.length,journeys:journeys.length,tacticalClears:journeys.filter(j=>j.policy==='tactical'&&j.cleared).length,sourceHash:report.sourceHash,out}));
}catch(e){console.error(e);process.exitCode=1}finally{await server.close();rmSync(dir,{recursive:true,force:true})}
