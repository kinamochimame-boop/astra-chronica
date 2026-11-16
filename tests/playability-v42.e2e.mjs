import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {readFileSync,writeFileSync} from 'node:fs';
import {productionFingerprint} from './production-fingerprint.mjs';
import {installIntegrationTelemetry} from './integration-telemetry.mjs';
import {waitMap,state,tapWorld,walkTo,approach,contactSymbol} from './map-driver-v15.mjs';
import {tap,menuAction,dialogueUI,eventUI,fightUI,saved} from './v26-ui-driver.mjs';
import {manifest} from './v26-manifest.mjs';

process.env.V42_PHASE='after';await import('./playability-v42.measure.mjs');
const before=JSON.parse(readFileSync('docs/screenshots/v42/before-metrics.json'));
const after=JSON.parse(readFileSync('docs/screenshots/v42/after-metrics.json'));
assert.equal(before.sourceHash,'33c7486a7042cd0fa24df83b32253e65c039d8f13e2a1c0c9165c8c0e02fdff3');
assert.equal(after.sourceHash,productionFingerprint());assert.deepEqual(after.pageErrors,[]);
for(const row of after.rows){
 const old=before.rows.find(r=>r.width===row.width);
 assert.equal(row.equipment.weaponCount,old.equipment.weaponCount);assert.equal(row.equipment.weaponCount,60);
 assert.ok(row.equipment.scrollRange<old.equipment.scrollRange-2500);
 assert.ok(row.equipment.equip.documentY<old.equipment.equip.documentY-2500);
 assert.equal(old.actorRoundtripTaps,3);assert.equal(row.actorRoundtripTaps,2);assert.ok(row.rememberedHeal);
 assert.ok(old.staleMenuError);assert.equal(row.staleMenuError,null);
 assert.equal(old.treeAfterAcquire.focus,'BODY');assert.equal(row.treeAfterAcquire.focus,'P');
 assert.equal(row.blockedExit.availability,'blocked');assert.match(row.blockedExit.text,/閉ざされた出口/);assert.ok(!row.blockedExit.text.includes('霧の森・入口'));assert.match(row.movementNotice,/移動中/);
 assert.equal(row.cycles.length,8);assert.equal(row.returned.canvases,1);
 for(const key of ['listeners','observers','intervals'])assert.equal(row.returned.resources[key],row.resourcesBefore[key]);
 for(const rect of Object.values(row.overlayRects))assert.deepEqual(rect,row.world.canvas);
 assert.ok(!row.equipment.horizontal&&!row.tree.horizontal&&!row.world.horizontal&&!row.battle.horizontal);
}
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-webgl']});
const cases=[],fixtureCases=[],errors=[];
const box=page=>page.locator('#world-viewport canvas').boundingBox();
const painted=async page=>{
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 await page.waitForFunction(()=>{
  const c=document.querySelector('.battle-art canvas');if(!c||JSON.parse(c.dataset.actors||'[]').length!==6)return false;
  const context=c.getContext('2d');if(!context)return false;
  const pixels=context.getImageData(0,0,c.width,c.height).data,colors=new Set();
  for(let i=0;i<pixels.length;i+=16){colors.add(`${pixels[i]},${pixels[i+1]},${pixels[i+2]},${pixels[i+3]}`);if(colors.size>12)return true}return false;
 });
};
const noOverflow=async page=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
const shortPhoto=(page,name,width)=>page.screenshot({path:`docs/screenshots/v42/after-short-${name}-${width}.png`,fullPage:true,animations:'disabled'});
const failStorage=async page=>page.evaluate(()=>{window.v42NativeSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='astra-chronica:v1')throw Error('quota');return window.v42NativeSet.call(this,k,v)}});
const restoreStorage=page=>page.evaluate(()=>Storage.prototype.setItem=window.v42NativeSet);
try{
 for(const width of [320,375,390,430]){
  const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(installIntegrationTelemetry);await page.clock.install();
  await page.addInitScript(()=>{let seed=4201;Math.random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}});
  await page.goto(process.env.BASE_URL||'http://localhost:4173');await tap(page,'ゲーム開始');await tap(page,'冒険を再開');await waitMap(page);
  assert.equal((await saved(page)).wins,0);assert.ok(Object.values((await saved(page)).party).every(h=>h.level===1));
  await tapWorld(page,{x:240,y:304});assert.equal((await state(page)).hero.moving,true);assert.match(await page.locator('#world-notice').textContent(),/移動中/);
  await tapWorld(page,{x:80,y:336});assert.match(await page.locator('#world-notice').textContent(),/行き先を変更/);
  await page.locator('#world-stop').tap();const stopped=(await state(page)).hero;await page.clock.runFor(500);assert.deepEqual((await state(page)).hero,stopped);
  await tapWorld(page,{x:248,y:144});await page.locator('#world-safe-candidate').waitFor();assert.ok(await page.locator('#world-safe-candidate').isVisible());await page.locator('#world-stop').tap();assert.equal(await page.locator('#world-safe-candidate').isVisible(),false);
  await walkTo(page,{x:112,y:400});let snapshot=await state(page);await tapWorld(page,snapshot.objects.find(o=>o.id==='c1-departure-object'));
  assert.equal(await page.locator('#world-approach').isVisible(),true);await page.locator('#world-stop').tap();assert.equal(await page.locator('#world-approach').isVisible(),false);
  await walkTo(page,{x:464,y:304});snapshot=await state(page);await tapWorld(page,snapshot.objects.find(o=>o.id==='c1-camp-next'));assert.doesNotMatch(await page.locator('#world-notice').textContent(),/霧の森・入口/);await page.getByRole('button',{name:'移動をキャンセル',exact:true}).tap();
  await approach(page,'c1-camp-next');const locked=page.locator('[data-world-object="c1-camp-next"]');assert.equal(await locked.getAttribute('data-availability'),'blocked');await locked.tap();assert.match(await page.locator('#world-notice').textContent(),/メインイベント/);assert.equal((await state(page)).mapId,'mistwood-camp');
  await approach(page,'c1-departure-object');await page.evaluate(()=>scrollTo(0,0));await waitMap(page);const original=await box(page);
  for(const [open,close] of [[()=>page.locator('#world-compass>summary').tap(),()=>page.locator('#world-compass>summary').tap()],[()=>page.getByRole('button',{name:'地図を拡大',exact:true}).tap(),()=>page.getByRole('button',{name:'探索に戻る',exact:true}).tap()],[()=>page.getByRole('button',{name:'探索メニュー',exact:true}).tap(),()=>page.locator('#world-menu-close').tap()]]){
   await open();await page.clock.runFor(40);assert.deepEqual(await box(page),original);assert.equal((await state(page)).paused,true);await close();await page.clock.runFor(40);await waitMap(page);assert.deepEqual(await box(page),original);
  }
  snapshot=await state(page);await tapWorld(page,snapshot.objects.find(o=>o.id==='c1-departure-object'));await page.locator('#world-event[open]').waitFor();assert.deepEqual(await box(page),original);await dialogueUI(page);await waitMap(page);assert.deepEqual(await box(page),original);
  const chapter=manifest.chapters[0];await eventUI(page,chapter,chapter.events.find(e=>e.id==='c1-first-battle'));
  // eventUI performs the real battle; the separate interruption/retry below uses its real result.
  assert.equal((await saved(page)).wins,1);await tap(page,'冒険へ戻る');await waitMap(page);
  const victory=await saved(page);assert.ok(victory.party.astel.level>=2);assert.ok(victory.world.defeated.includes('c1-first-battle-symbol'));
  await eventUI(page,chapter,chapter.events.find(e=>e.id==='c1-stele-story'));await eventUI(page,chapter,chapter.events.find(e=>e.id==='c1-chest'));
  assert.equal((await saved(page)).equipment.inventory['windcut-bow'],1,'the bow is earned from its real story chest');
  await tap(page,'星脈へ');assert.equal(await page.locator('.tree-heroes button').count(),3);assert.ok((await page.locator('.tree-heroes').textContent()).includes('残SP'));
  await page.locator('[data-node-id="astel-sword-edge"]').tap();const prior=await saved(page);await failStorage(page);await page.locator('#tree-acquire').tap();assert.deepEqual(await saved(page),prior);assert.equal(await page.locator('#save-warning').getAttribute('role'),'alert');assert.equal(await page.evaluate(()=>document.activeElement.id),'tree-notice');await restoreStorage(page);
  await page.locator('#tree-acquire').evaluate(b=>window.v42OldAcquire=b.onclick);await page.locator('#tree-acquire').tap();assert.ok((await saved(page)).skillTree.astel.includes('astel-sword-edge'));assert.equal(await page.evaluate(()=>document.activeElement.id),'tree-notice');const learned=await saved(page);await page.evaluate(()=>window.v42OldAcquire());assert.deepEqual(await saved(page),learned);
  await page.locator('.party-growth-comparison>summary').tap();assert.ok(await page.locator('.party-growth-comparison table').isVisible());await page.locator('#tree-back').tap();await waitMap(page);
  await tap(page,'装備へ');await page.locator('[data-weapon-id="windcut-bow"]').tap();assert.equal(await page.locator('.equipment-preview tbody tr').count(),7);assert.equal(await page.evaluate(()=>document.activeElement.id),'equipment-selected');
  const speed=await page.locator('.equipment-preview [data-stat="素早さ"] td').allTextContents();assert.equal(Number(speed[2])-Number(speed[1]),4);
  const equipmentBefore=await saved(page);await failStorage(page);await page.locator('#equipment-equip').tap();assert.deepEqual(await saved(page),equipmentBefore);assert.match(await page.locator('#equipment-current-name').textContent(),/旅人の剣/);assert.equal(await page.evaluate(()=>document.activeElement.id),'equipment-notice');await restoreStorage(page);
  await page.locator('#equipment-equip').tap();assert.equal((await saved(page)).equipment.equipped.astel,'windcut-bow');assert.deepEqual((await saved(page)).equipment.inventory,equipmentBefore.equipment.inventory);
  await page.locator('.growth-panel>summary').tap();await page.locator('.growth-save').tap();const stored=await saved(page);assert.ok(stored.builds.astel[0].saved);assert.equal(stored.builds.astel[0].weaponId,'windcut-bow');
  await page.locator('.growth-name').fill('旅の型');await page.locator('.growth-rename').tap();assert.equal((await saved(page)).builds.astel[0].name,'旅の型');
  await page.setViewportSize({width,height:568});await page.locator('.growth-reset').tap();const dialog=await page.locator('.growth-confirm').boundingBox();assert.ok(dialog.x>=0&&dialog.y>=0&&dialog.x+dialog.width<=width&&dialog.y+dialog.height<=568);await shortPhoto(page,'growth',width);
  await page.locator('.growth-confirm-no').tap();assert.deepEqual((await saved(page)).skillTree,stored.skillTree);await page.locator('.growth-reset').tap();await page.locator('.growth-confirm-yes').tap();assert.equal((await saved(page)).skillTree.astel.length,0);await page.locator('.growth-apply').tap();assert.deepEqual((await saved(page)).skillTree,stored.skillTree);assert.deepEqual((await saved(page)).equipment,stored.equipment);await noOverflow(page);
  await page.setViewportSize({width,height:844});await page.locator('#equipment-back').tap();await waitMap(page);
  const resourceBefore=await page.evaluate(()=>window.integrationTelemetry()),cycles=[];
  for(const kind of ['装備','星脈','依頼','手帳','コンパス','装備','星脈','依頼']){const start=Date.now();if(kind==='装備'||kind==='星脈'||kind==='依頼'){await tap(page,kind+'へ');await page.locator(kind==='装備'?'#equipment-back':kind==='星脈'?'#tree-back':'#quest-back').tap()}else{await menuAction(page,kind==='手帳'?'冒険手帳':'冒険コンパス');await tap(page,'探索へ戻る')}await waitMap(page);assert.equal(await page.locator('canvas').count(),1);cycles.push(Date.now()-start)}
  const resourceAfter=await page.evaluate(()=>window.integrationTelemetry());for(const k of ['listeners','observers','intervals'])assert.equal(resourceAfter[k],resourceBefore[k]);
  await page.setViewportSize({width,height:568});await waitMap(page);await noOverflow(page);await shortPhoto(page,'world',width);await page.setViewportSize({width,height:844});await waitMap(page);
  const checkpoint=await saved(page);await page.reload();await tap(page,'ゲーム開始 · 続きから');await tap(page,'冒険を再開');await waitMap(page);const reloaded=await saved(page);for(const k of ['party','equipment','skillTree','builds','adventure','choices','quests'])assert.deepEqual(reloaded[k],checkpoint[k]);assert.equal(reloaded.world.mapId,checkpoint.world.mapId);
  // Real pending encounter is recovered, then retreat/retry and serial safety are covered without injecting progress.
  await contactSymbol(page,'c1-fork-battle-symbol');await page.setViewportSize({width,height:568});await painted(page);await noOverflow(page);await shortPhoto(page,'battle',width);await page.setViewportSize({width,height:844});await page.reload();await tap(page,'ゲーム開始 · 続きから');await tap(page,'冒険を再開');await waitMap(page);assert.equal((await saved(page)).adventure.pending,undefined);assert.equal((await saved(page)).wins,1);
  await contactSymbol(page,'c1-fork-battle-symbol');await tap(page,'戦闘メニュー');await tap(page,'撤退する（敗北）');await tap(page,'探索から再挑戦');await waitMap(page);assert.equal((await saved(page)).wins,1);await contactSymbol(page,'c1-fork-battle-symbol');await fightUI(page,{id:'c1-fork-battle',encounter:'forest-fork'});await page.getByRole('button',{name:'冒険へ戻る',exact:true}).evaluate(b=>window.v42OldResult=b.onclick);await tap(page,'冒険へ戻る');await waitMap(page);const won=await saved(page);assert.equal(won.wins,2);await page.evaluate(()=>window.v42OldResult());assert.deepEqual(await saved(page),won);
  cases.push({width,mode:'fresh UI, no imported progress or debug weapon unlock',moving:true,retap:true,cancel:true,safeCandidate:true,approachCancel:true,blockedExit:true,overlayRectangles:true,actualVictories:2,earnedBow:true,growthRollback:true,equipmentRollback:true,sharedPreview:true,builds:true,resetRefund:true,staleCallbacks:true,reload:true,pendingRecovery:true,defeatRetry:true,duplicateRewardBlocked:true,shortHeight:true,resourceBefore,resourceAfter,cycles,pageErrors:[]});await page.close();
 }
 // Explicit dev-only fixture for deterministic combat conditions; not normal story completion.
 for(const width of [320,375,390,430]){
  const page=await browser.newPage({viewport:{width,height:568},isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));await page.goto((process.env.UI_TEST_URL||'http://localhost:5173')+'/tests/atb-ui-v30.fixture.html');await page.waitForFunction(()=>window.atbFixture?.ready());
  const config=c=>page.evaluate(c=>window.atbFixture.configure(c),c),advance=t=>page.evaluate(t=>window.atbFixture.advance(t),t),snap=()=>page.evaluate(()=>window.atbFixture.snapshot()),select=id=>page.locator(`.ally[data-target-id="${id}"]`).tap(),choose=id=>page.locator(`[data-command="${id}"]`).tap(),execute=()=>page.locator('.execute-command').tap();
  await config({waiting:true,opening:true,ep:{astel:0,rina:0,mei:0}});const waiting=await snap();await advance(60);assert.deepEqual(await snap(),waiting);await page.locator('#atb-start').tap();await config({ep:{mei:0}});await select('mei');await choose('heal');const empty=await snap();assert.match(await page.locator('[data-command="heal"] .command-reason').textContent(),/EP不足/);await page.locator('.execute-command').evaluate(b=>b.onclick());assert.deepEqual(await snap(),empty);
  await config({busy:5});for(const command of ['strong','fang','armorBreak','galeSlash']){await choose(command);await execute()}let unit=(await snap()).state.units[0];assert.equal(unit.queue.length,4);assert.equal(unit.ep+unit.queue.reduce((n,r)=>n+r.cost,0),15);await choose('galeSlash');unit=(await snap()).state.units[0];assert.equal(unit.queue.length,3);assert.equal(unit.ep+unit.queue.reduce((n,r)=>n+r.cost,0),15);
  await config({ep:{mei:15},units:{mei:{mp:0},rina:{hp:5000}}});await select('mei');await choose('heal');await page.locator('[data-command-target="rina"]').tap();const previous=await snap();await select('astel');await select('mei');assert.equal(await page.locator('[data-command="heal"]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('[data-command-target="rina"]').getAttribute('aria-pressed'),'true');assert.deepEqual(await snap(),previous);await execute();await advance(.05);let healed=await snap();assert.ok(healed.state.units[1].hp>5000);assert.equal(healed.state.units[2].mp,0);assert.ok(healed.events.some(e=>e.command==='heal'&&e.target==='rina'));
  await config({items:{potion:1,ether:1},ep:{mei:5},units:{rina:{hp:5000},mei:{mp:0}}});await select('mei');await choose('potion');await page.locator('[data-command-target="rina"]').tap();await execute();await advance(.05);assert.ok((await snap()).events.some(e=>e.command==='potion'&&e.target==='rina'));assert.equal(await page.locator('[data-command="potion"]').count(),0);assert.equal(await page.locator('[data-command][aria-pressed="true"]').count(),1,'a consumed item must not leave selection missing');await choose('ether');await page.locator('[data-command-target="mei"]').tap();await execute();await advance(1);assert.ok((await snap()).events.some(e=>e.command==='ether'&&e.resource==='ep'&&e.amount===5));
  for(const status of ['sleep','freeze','silence']){await config({units:{mei:{statuses:[{id:status,remaining:3}]}}});await select('mei');await choose('fire');assert.match(await page.locator('[data-command="fire"] .command-reason').textContent(),status==='silence'?/沈黙/:/行動不能/);const restricted=await snap();await page.locator('.execute-command').evaluate(b=>b.onclick());assert.deepEqual(await snap(),restricted)}
  await config({units:{enemy1:{hp:0},rina:{hp:0}}});assert.equal(await page.locator('.enemy[data-target-id="enemy1"]').isDisabled(),true);await select('mei');await choose('heal');assert.equal(await page.locator('[data-command-target="rina"]').count(),0);
  await config();await page.evaluate(()=>window.v42DeadInputs=[...document.querySelectorAll('.atb-screen button')].filter(b=>b.onclick).map(b=>b.onclick));await config();const replacement=await snap();const staleCount=await page.evaluate(()=>{for(const fn of window.v42DeadInputs)fn();return window.v42DeadInputs.length});assert.ok(staleCount>=10);assert.deepEqual(await snap(),replacement);assert.equal(await page.locator('.battle-dialog').evaluate(d=>d.open),false);
  await config({progress:{astel:1},ep:{astel:0},units:{enemy0:{hp:1},enemy1:{hp:0},enemy2:{hp:0}}});await page.locator('#atb-auto').evaluate(b=>window.v42EndedAuto=b.onclick);await choose('attack');assert.equal((await snap()).state.result,'victory');const ended=await snap();await page.evaluate(()=>window.v42EndedAuto());await advance(100);assert.deepEqual(await snap(),ended);await noOverflow(page);
  fixtureCases.push({width,mode:'declared dev combat fixture',waiting:true,epReason:true,mpZeroIsNotEpFailure:true,rememberedAlly:true,realHealing:true,items:true,consumedSelection:true,statusReasons:true,deadTargets:true,maxQueue:4,fullRefund:true,staleCount,staleInputsBlocked:true,finishedInputsBlocked:true});await page.close();
 }
 assert.deepEqual(errors,[]);writeFileSync('/tmp/v42-playability.json',JSON.stringify({sourceHash:productionFingerprint(),before,after,cases,fixtureCases,pageErrors:errors},null,2));
 console.log('PASS v4.2 playability: 4 fresh touch routes/two actual wins each, real chest/equipment/tree/builds, rollback, 32 mixed returns, 568px, declared deterministic combat UI cases');
}finally{await browser.close()}
