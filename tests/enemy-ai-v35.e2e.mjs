import {chromium} from '@playwright/test';
import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {productionFingerprint} from './production-fingerprint.mjs';
const base='e330b270e439128b219b0ee8d106355435c81dd2',sourceHash=productionFingerprint(),dir='tests/.v35-baseline',url=process.env.UI_TEST_URL||'http://localhost:5195';
// Compile the actual baseline implementation, not a new-mode flag or a handwritten copy.
const original=execFileSync('git',['show',base+':src/battle.ts'],{encoding:'utf8'}),baselineBattleHash=createHash('sha256').update(original).digest('hex');
mkdirSync(dir,{recursive:true});writeFileSync(dir+'/battle.ts',original.replaceAll("from './","from '../../src/"));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const checks=[],touch=[],pageErrors=[];
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.on('pageerror',e=>pageErrors.push(e.message));
 await page.goto(url+'/tests/atb-ui-v30.fixture.html');await page.waitForFunction(()=>window.atbFixture?.ready());
 const configure=options=>page.evaluate(options=>window.atbFixture.configure(options),options),advance=t=>page.evaluate(t=>window.atbFixture.advance(t),t),snapshot=()=>page.evaluate(()=>window.atbFixture.snapshot());
 for(const width of [320,390,430]){
  await page.setViewportSize({width,height:844});
  await configure({waiting:true,opening:true,random:0,ep:{astel:0,rina:0,mei:0},encounter:'forest-entry',units:{astel:{hp:2000},enemy0:{hp:3500}}});
  await advance(60);let s=await snapshot();assert.equal(s.state.time,0);assert.equal(s.events.length,0);
  await page.locator('#atb-start').tap();await advance(6);s=await snapshot();
  assert.ok(s.events.some(e=>e.actor==='enemy2'&&e.target==='astel'&&e.logs.some(l=>l.includes('弱ったアステル'))));
  assert.ok(s.events.some(e=>e.actor==='enemy0'&&e.command==='defend'&&e.logs.some(l=>l.includes('守りを固めた'))));
  const firstGuard=s.events.find(e=>e.actor==='enemy0');await advance(6);s=await snapshot();assert.equal(s.events.filter(e=>e.actor==='enemy0')[1].command,'attack');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('.log-toggle').tap();assert.match(await page.locator('.dialog-body').textContent(),/守りを固めた/);await page.locator('.dialog-close').tap();
  await configure({random:0,encounter:'forest-entry',units:{astel:{hp:2000},rina:{covering:'astel'},enemy0:{hp:0},enemy1:{hp:0}}});await advance(4);s=await snapshot();assert.ok(s.events.some(e=>e.actor==='enemy2'&&e.covered&&e.target==='rina'));
  await configure({random:0,encounter:'sahara-dunes',units:{astel:{statuses:[{id:'silence',remaining:2}]}}});await advance(3);s=await snapshot();const spell=s.events.find(e=>e.actor==='enemy1'&&e.command==='fire');assert.ok(spell);assert.equal(spell.target,'rina');assert.equal(spell.damageTrace.power,52);
  assert.equal(await page.evaluate(()=>localStorage.getItem('astra-chronica:v1')),null);
  touch.push({width,startGate:true,guardAt:firstGuard.time,wounded:true,cover:true,statusTarget:true,saveUnchanged:true});console.log('PASS v3.5 tactical touch',width);
 }
 checks.push('touch start gate / wounded target / guard CT / no consecutive guard / logs / cover / magic statuses / isolated save at 3 widths');
 const catalog=await page.evaluate(async()=>{const m=await import('/tests/enemy-ai-v35-simulation.ts');return m.aiCatalog});
 const contexts=await page.evaluate(async()=>{const m=await import('/tests/enemy-ai-v35-simulation.ts');return m.balanceCases()});assert.equal(contexts.length,109);
 const bossKeys=await page.evaluate(async()=>{const m=await import('/tests/enemy-ai-v35-simulation.ts');return m.scriptCases()});
 const bosses=[];
 for(const scriptCase of bossKeys)for(const route of scriptCase.key==='terminal-last-judge'?['direct','shelter']:['direct'])for(const seed of [35,351]){
  const {key,index}=scriptCase;const result=await page.evaluate(async({key,index,route,seed})=>{const m=await import('/tests/enemy-ai-v35-simulation.ts'),old=await import('/tests/.v35-baseline/battle.ts'),current=await import('/src/battle.ts');return {old:m.bossTrace(old.Battle,key,route,seed,index),current:m.bossTrace(current.Battle,key,route,seed,index)}},{key,index,route,seed});
  assert.deepEqual(result.current,result.old,'boss event/state/random regression '+key+'/'+route+'/'+seed);
  bosses.push({...scriptCase,route,seed,events:result.current.trace.length,interrupted:result.current.interrupted,sha256:createHash('sha256').update(JSON.stringify(result.current)).digest('hex')});
 }
 checks.push('all boss events and states exactly equal to actual main, both final-judge routes, phases, charge interruption and counters');console.log('PASS v3.5 boss baseline comparisons',bosses.length);
 const rows=[];
 for(const policy of ['auto','support'])for(let seed=1;seed<=20;seed++){
  const batch=await page.evaluate(async({policy,seed})=>{const m=await import('/tests/enemy-ai-v35-simulation.ts'),old=await import('/tests/.v35-baseline/battle.ts'),current=await import('/src/battle.ts');return m.balanceCases().map((context,i)=>({chapter:context.chapter,event:context.event,encounter:context.encounter,affected:context.affected,policy,seed,baseline:m.simulate(old.Battle,context,seed*1000+i,policy),current:m.simulate(current.Battle,context,seed*1000+i,policy)}))},{policy,seed});
  for(const r of batch)if(!r.affected)assert.deepEqual(r.current,r.baseline,'non-target changed '+r.event+'/'+policy+'/'+seed);
  rows.push(...batch);console.log('PASS v3.5 seeded simulation',policy,seed,batch.length);
 }
 const aggregate=(set,key)=>({battles:set.length,wins:set.filter(r=>r[key].outcome==='victory').length,timeouts:set.filter(r=>r[key].outcome==='timeout').length,...Object.fromEntries(['seconds','damage','knockouts','guards','actions'].map(k=>[k,set.reduce((n,r)=>n+r[key][k],0)])),targets:Object.fromEntries(['astel','rina','mei'].map(id=>[id,set.reduce((n,r)=>n+r[key].targets[id],0)]))});
 const comparisons=['auto','support'].map(policy=>{const set=rows.filter(r=>r.policy===policy&&r.affected);return {policy,baseline:aggregate(set,'baseline'),current:aggregate(set,'current')}});
 const perEncounter=[...new Set(rows.map(r=>r.encounter))].map(encounter=>({encounter,policies:['auto','support'].map(policy=>{const set=rows.filter(r=>r.encounter===encounter&&r.policy===policy);return {policy,baseline:aggregate(set,'baseline'),current:aggregate(set,'current')}})}));
 const report={sourceHash,base,baselineBattleHash,catalog,bosses,rows,comparisons,perEncounter,touch,checks,pageErrors};
 writeFileSync('/tmp/v35-ai-cases.json',JSON.stringify(report,null,2));
 // Explicit regression gates; tune AI probabilities, never enemy stats or old deadlines, if these fail.
 for(const c of comparisons){assert.ok(c.current.wins>=c.baseline.wins-c.baseline.battles*.05,'win rate dropped >5 percentage points: '+c.policy);assert.ok(c.current.seconds<=c.baseline.seconds*1.15,'duration rose >15%: '+c.policy);assert.ok(c.current.damage<=c.baseline.damage*1.2,'damage rose >20%: '+c.policy);assert.ok(c.current.knockouts-c.baseline.knockouts<=c.baseline.battles*.05,'knockouts rose >0.05 per battle: '+c.policy);assert.equal(c.current.timeouts,0,'tactical battles stalled');}
 for(const e of perEncounter)for(const c of e.policies)assert.ok(c.current.wins>=c.baseline.wins,'per-encounter win regression: '+e.encounter+'/'+c.policy);
 assert.deepEqual(pageErrors,[]);assert.equal(productionFingerprint(),sourceHash);console.log('PASS v3.5 comparison',JSON.stringify(comparisons));
}finally{await browser.close();rmSync(dir,{recursive:true,force:true})}
