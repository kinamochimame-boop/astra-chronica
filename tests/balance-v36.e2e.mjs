import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {productionFingerprint} from './production-fingerprint.mjs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const cases=[],errors=[];
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.UI_TEST_URL||'http://localhost:5173')+'/tests/atb-ui-v30.fixture.html');await page.waitForFunction(()=>window.atbFixture?.ready());
 const config=o=>page.evaluate(o=>window.atbFixture.configure(o),o),snap=()=>page.evaluate(()=>window.atbFixture.snapshot());
 for(const width of [320,375,390,430])for(const [hero,command,cost] of [['astel','starSlash',3],['rina','oathShield',4],['mei','miracle',5]]){
  await page.setViewportSize({width,height:844});await config({busy:2,units:{astel:{hp:9800}}});
  await page.locator(`[data-unit-id="${hero}"] .ally`).tap();await page.locator(`[data-command="${command}"]`).tap();
  const execute=page.locator('.execute-command');assert.match(await execute.textContent(),new RegExp('EP'+cost+'$'));
  await execute.tap();let s=(await snap()).state.units.find(u=>u.id===hero);assert.equal(s.ep,15-cost);assert.equal(s.queue[0].cost,cost);assert.equal(s.queue.length,1);
  await page.locator('.queue-summary').tap();assert.match(await page.locator('[data-reservation-id]').textContent(),new RegExp('EP'+cost));await page.locator('[data-reservation-id]').tap();
  s=(await snap()).state.units.find(u=>u.id===hero);assert.equal(s.ep,15);assert.equal(s.queue.length,0);
  await execute.tap();await page.evaluate(()=>window.atbFixture.advance(2));const state=await snap();s=state.state.units.find(u=>u.id===hero);assert.equal(s.ep,15-cost);assert.equal(s.queue.length,0);assert.ok(state.events.some(e=>e.command===command));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await page.evaluate(()=>localStorage.getItem('astra-chronica:v1')),null);
  await config({ep:{[hero]:cost-1},units:{astel:{hp:9800}}});await page.locator(`[data-unit-id="${hero}"] .ally`).tap();await page.locator(`[data-command="${command}"]`).tap();assert.ok(await page.locator('.execute-command').isDisabled());assert.match(await page.locator('#command-description').textContent(),/EP不足/);
  cases.push({width,hero,command,cost,reserve:true,cancel:true,refund:true,singleDebit:true,insufficient:true,saveUnchanged:true});console.log('PASS v3.6 touch',width,command);
 }
 assert.deepEqual(errors,[]);writeFileSync('/tmp/v36-balance-touch.json',JSON.stringify({sourceHash:productionFingerprint(),cases,pageErrors:errors},null,2));
}finally{await browser.close()}
