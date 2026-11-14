import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {productionFingerprint} from './production-fingerprint.mjs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']}),cases=[],errors=[];
try{
 for(const width of [320,375,390,430]){
  const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  const tap=name=>page.getByRole('button',{name,exact:true}).tap(),saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('astra-chronica:v1')));
  await page.goto(process.env.BASE_URL||'http://localhost:4173');
  // Declared legacy-save fixture; no model/EP/stat mutation while testing real controls.
  await page.evaluate(()=>localStorage.setItem('astra-chronica:v1',JSON.stringify({version:2,started:true,wins:1,battles:2,party:{astel:{level:5,experience:7},rina:{level:5,experience:9},mei:{level:5,experience:11}},adventure:{chapters:{'chapter-01':{currentLocationId:'c1-camp',completed:['c1-departure']}},serial:0,resolved:0}})));
  await page.reload();await tap('ゲーム開始 · 続きから');await tap('装備');await page.locator('.equipment-test summary').tap();await page.locator('#equipment-unlock').tap();await page.locator('[data-weapon-id="windcut-bow"]').tap();await page.locator('#equipment-equip').tap();await page.locator('.growth-panel > summary').tap();await tap('スキルツリーで育成');
  const learn=async id=>{await page.locator(`[data-node-id="${id}"]`).tap();await page.locator('#tree-acquire').tap()},panel=()=>page.locator('.growth-panel');
  await learn('astel-sword-edge');await panel().locator(':scope > summary').tap();assert.equal(await page.locator('[data-build-slot]').count(),3);
  await page.locator('.growth-name').fill('剣と弓<script>');await page.locator('.growth-rename').tap();assert.equal((await saved()).builds.astel[0].name,'剣と弓script');assert.equal(await page.locator('.growth-manager script').count(),0);
  await page.locator('.growth-save').tap();let p=await saved();assert.deepEqual(p.builds.astel[0].nodes,['astel-sword-edge']);assert.equal(p.builds.astel[0].weaponId,'windcut-bow');const inventory=structuredClone(p.equipment.inventory),party=structuredClone(p.party),adventure=structuredClone(p.adventure);
  await tap('勇気・生存');await learn('astel-courage-vital');await page.locator('[data-build-slot="1"]').tap();await page.locator('.growth-save').tap();assert.equal((await saved()).builds.astel[1].nodes.length,2);
  await page.locator('.growth-reset').tap();await page.locator('.growth-confirm-no').tap();assert.equal((await saved()).skillTree.astel.length,2);
  await page.locator('.growth-reset').tap();await page.locator('.growth-confirm-yes').tap();p=await saved();assert.equal(p.skillTree.astel.length,0);assert.equal(p.builds.astel[1].nodes.length,2);assert.match(await page.locator('.growth-budget').textContent(),/残りSP 8/);
  await page.locator('[data-build-slot="0"]').tap();await page.locator('.growth-apply').tap();assert.deepEqual((await saved()).skillTree.astel,['astel-sword-edge']);
  await page.locator('[data-build-slot="1"]').tap();await page.locator('.growth-comparison > summary').tap();assert.match(await page.locator('[data-build-stat="maxHp"]').textContent(),/243/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));for(const b of await page.locator('.growth-actions button,.growth-slots button,.growth-rename,.growth-reset').all()){const box=await b.boundingBox();assert.ok(box.width>=44&&box.height>=44)}
  mkdirSync('docs/screenshots/v37',{recursive:true});await page.screenshot({path:`docs/screenshots/v37/growth-builds-v37-${width}.png`,fullPage:true,animations:'disabled'});
  // Failed persistence must roll back both active fields, without a success message.
  await page.evaluate(()=>{window.originalGrowthSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='astra-chronica:v1')throw Error('quota');return window.originalGrowthSet.call(this,k,v)}});
  const before=JSON.stringify(await saved());await page.locator('.growth-apply').tap();assert.equal(JSON.stringify(await saved()),before);assert.match(await page.locator('.growth-notice').textContent(),/変更を取り消しました/);assert.match(await page.locator('.growth-budget').textContent(),/使用SP 1/);
  await page.evaluate(()=>{Storage.prototype.setItem=window.originalGrowthSet});await page.locator('.growth-apply').tap();assert.equal((await saved()).skillTree.astel.length,2);
  for(const [hero,node] of [['リナ','rina-fortress-plate'],['メイ','mei-elements-ember']]){
   await tap(hero);const first=page.locator('.tree-node.available').first();await first.tap();await page.locator('#tree-acquire').tap();if(!await panel().evaluate(el=>el.open))await panel().locator(':scope > summary').tap();await page.locator('.growth-save').tap();
  }
  p=await saved();assert.ok(p.builds.rina[0].saved&&p.builds.mei[0].saved);assert.deepEqual(p.equipment.inventory,inventory);assert.deepEqual(p.party,party);assert.deepEqual(p.adventure,adventure);
  await page.reload();await tap('ゲーム開始 · 続きから');await tap('スキルツリー');await panel().locator(':scope > summary').tap();await page.locator('[data-build-slot="1"]').tap();assert.ok(!await page.locator('.growth-apply').isDisabled());
  // A stale pre-battle button must still consult live main.ts screen state.
  await page.evaluate(()=>{window.detachedBuildApply=document.querySelector('.growth-apply')});await page.locator('#tree-back').tap();await page.getByRole('button',{name:/戦闘開始/}).tap();await page.locator('#atb-start').waitFor();const stored=JSON.stringify(await saved());await page.evaluate(()=>window.detachedBuildApply.click());assert.equal(JSON.stringify(await saved()),stored);assert.equal(await page.locator('.atb-screen').count(),1);
  const state=await page.locator('.atb-screen').evaluate(el=>JSON.parse(el.dataset.atbState));assert.equal(state.started,false);assert.equal(state.time,0);assert.equal(state.units[0].maxHp,243);assert.equal(state.units[0].interval,6.25);assert.equal(state.units[0].ep,0);assert.equal(await page.locator('.growth-manager').count(),0);
  await page.getByRole('button',{name:'戦闘メニュー',exact:true}).tap();await tap('撤退する（敗北）');await tap('ホームへ戻る');
  // Invalid saved node identities stay unusable; active progress stays intact.
  await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('astra-chronica:v1'));p.builds.astel[0].nodes.push('unknown-node');localStorage.setItem('astra-chronica:v1',JSON.stringify(p))});await page.reload();await tap('ゲーム開始 · 続きから');await tap('スキルツリー');await panel().locator(':scope > summary').tap();assert.ok(await page.locator('.growth-apply').isDisabled());assert.match(await page.locator('.growth-reason').textContent(),/不正/);assert.equal((await saved()).skillTree.astel.length,2);await page.locator('.growth-save').tap();await page.locator('.growth-confirm-no').tap();assert.ok(await page.locator('.growth-apply').isDisabled());await page.locator('.growth-save').tap();await page.locator('.growth-confirm-yes').tap();assert.ok(!await page.locator('.growth-apply').isDisabled());assert.equal((await saved()).builds.astel[0].invalid,undefined);
  cases.push({width,save:true,rename:true,apply:true,reset:true,cancelReset:true,compare:true,fullRefund:true,inventoryPreserved:true,reload:true,saveFailureRollback:true,staleBattleGuard:true,actualBattleStats:true,corruptRejected:true});console.log('PASS v3.7 growth touch',width);await page.close();
 }
 assert.deepEqual(errors,[]);writeFileSync('/tmp/v37-growth-touch.json',JSON.stringify({sourceHash:productionFingerprint(),cases,pageErrors:errors},null,2));
}finally{await browser.close()}
