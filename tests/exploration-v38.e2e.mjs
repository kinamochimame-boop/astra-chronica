import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {completedSave} from './chapter-twelve-fixture.mjs';
import {state,waitMap,walkTo} from './map-driver-v15.mjs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const results=[];
try{
 await mkdir('docs/screenshots/v38',{recursive:true});
 for(const width of [320,375,390,430]){
  const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const tap=name=>page.getByRole('button',{name,exact:true}).tap();
  await page.goto(process.env.BASE_URL||'http://localhost:4173');await page.evaluate(p=>localStorage.setItem('astra-chronica:v1',JSON.stringify(p)),completedSave());await page.reload();await tap('ゲーム開始 · 続きから');await tap('冒険へ出発');await waitMap(page);
  await page.locator('#world-minimap-toggle').tap();await page.waitForFunction(()=>!!document.querySelector('#world-minimap').dataset.state);
  await tap('経路 ON');assert.equal(await page.locator('#world-minimap-route').getAttribute('visibility'),'hidden');await tap('経路 OFF');assert.equal(await page.locator('#world-minimap-route').getAttribute('visibility'),'visible');
  await walkTo(page,{x:368,y:400});await page.waitForTimeout(200);const count=await page.locator('#world-minimap').evaluate(e=>JSON.parse(e.dataset.state).walked);assert.ok(count>1);
  await tap('地図を拡大');assert.equal((await state(page)).paused,true);assert.ok(await page.locator('#world-map-expanded').evaluate(e=>e.open));await page.screenshot({path:`docs/screenshots/v38/map-expanded-${width}.png`,fullPage:true,animations:'disabled'});await tap('探索に戻る');await page.waitForFunction(()=>JSON.parse(document.querySelector('#world-viewport').dataset.state).paused===false);assert.equal((await state(page)).paused,false);
  await tap('移動をキャンセル');assert.equal((await state(page)).hero.moving,false);
  await page.reload();await tap('ゲーム開始 · 続きから');await tap('冒険へ出発');await waitMap(page);await page.locator('#world-minimap-toggle').tap();await page.waitForFunction(()=>!!document.querySelector('#world-minimap').dataset.state);
  const after=await page.locator('#world-minimap').evaluate(e=>JSON.parse(e.dataset.state));assert.ok(after.walked>=count);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  for(const id of ['world-minimap-toggle','world-stop'])assert.ok((await page.locator(`#${id}`).boundingBox()).height>=44);
  await page.screenshot({path:`docs/screenshots/v38/navigation-${width}.png`,fullPage:true,animations:'disabled'});assert.deepEqual(errors,[]);results.push({width,walkedBefore:count,walkedAfter:after.walked,pageErrors:errors,touch:true,routeToggle:true,expandedPauseResume:true});await page.close();
 }
 await writeFile('/tmp/v38-exploration-ui.json',JSON.stringify({results},null,2));console.log('PASS v3.8 touch navigation, persisted survey, enlarged map pause/resume, route toggle, four widths');
}finally{await browser.close()}
