import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {priorSave} from './chapter-seven-fixture.mjs';
import {state,waitMap,walkTo,useObject} from './map-driver-v15.mjs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__writes=0;const original=Storage.prototype.setItem;Storage.prototype.setItem=function(...args){window.__writes++;return original.apply(this,args)}});
 await page.goto(process.env.BASE_URL||'http://localhost:5173');
 const seed=priorSave();seed.adventure.selectedChapterId='chapter-07';seed.adventure.chapters['chapter-07']={currentLocationId:'c7-camp',completed:['c7-arrival','c7-fine','c7-camp-rest','c7-trail-fight','c7-stream-record','c7-gran','c7-herb-rest','c7-root-fight','c7-ruins-record','c7-ruins-fight','c7-orb-fight','c7-dual-chest','c7-rina-judgment','c7-grove-story','c7-granguard','c7-shield-gift','c7-canopy-story','c7-rings','c7-seles-truth','c7-final-promise','c7-seles','c7-clear']};
 await page.evaluate(v=>localStorage.setItem('astra-chronica:v1',JSON.stringify(v)),seed);await page.reload();
 const tap=name=>page.getByRole('button',{name,exact:true}).tap();
 await tap('ゲーム開始 · 続きから');await tap('冒険へ出発');await waitMap(page);
 for(const [location,map] of [['c7-camp','grove-camp'],['c7-trail','grove-trail'],['c7-ruins','grove-ruins']]){
  if((await state(page)).mapId!==map){await tap('探索メニュー');await tap('地点一覧');await page.locator(`[data-location-id="${location}"]`).tap();await waitMap(page)}
  assert.equal((await state(page)).mapId,map);
  for(const width of [320,390,430,768]){
   await page.setViewportSize({width,height:width===768?1024:844});await waitMap(page);
   const s=await state(page),r=await page.locator('#world-viewport canvas').boundingBox();
   assert.ok(Math.abs(r.height/r.width-s.height/s.width)<.02);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.equal(await page.locator('canvas').count(),1);
   for(const b of await page.locator('#world-menu-button,#world-nearby button').all())assert.ok((await b.boundingBox()).height>=44);
   await walkTo(page,{x:144,y:432});await walkTo(page,{x:112,y:400});
   await page.screenshot({path:`docs/screenshots/chapter-seven-${map}-${width}.png`,fullPage:true,animations:'disabled'});
  }
  await page.setViewportSize({width:390,height:844});await page.waitForTimeout(500);
  const writes=await page.evaluate(()=>window.__writes);await page.waitForTimeout(1100);assert.equal(await page.evaluate(()=>window.__writes),writes,'an idle map must not keep saving');
  await tap('探索メニュー');assert.ok((await state(page)).paused);const before=(await state(page)).hero;await page.keyboard.press('ArrowRight');await page.waitForTimeout(150);assert.deepEqual((await state(page)).hero,before);await tap('探索に戻る');
 }
 await tap('探索メニュー');await tap('装備');assert.equal(await page.locator('#world-viewport').count(),0);await page.locator('#equipment-back').tap();await waitMap(page);assert.equal((await state(page)).mapId,'grove-ruins');assert.equal(await page.locator('canvas').count(),1);
 await tap('探索メニュー');await tap('ホームへ戻る');assert.equal(await page.locator('#world-viewport').count(),0);await tap('冒険へ出発');await waitMap(page);assert.equal(await page.locator('canvas').count(),1);await useObject(page,'ruins-pond');await page.waitForTimeout(350);assert.equal(await page.locator('[data-location-id][aria-current="true"]').getAttribute('data-location-id'),'c7-pond','a touch exit must not click through into the next screen');assert.equal((await page.evaluate(()=>JSON.parse(localStorage.getItem('astra-chronica:v1')))).adventure.chapters['chapter-07'].currentLocationId,'c7-pond');assert.deepEqual(errors,[]);
 console.log('v1.5 exploration UI passed: all 3 maps at 320/390/430/768, actual touch walks, correct FIT aspect ratio, 44px targets, reduced motion, idle save suppression, paused keyboard and equipment/home teardown/reentry, zero runtime errors.');
}finally{await browser.close()}
