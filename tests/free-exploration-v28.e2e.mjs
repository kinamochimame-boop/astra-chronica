/** Explicit old-save migration fixtures. The separate full journey proves genuine fresh18-chapter play. */
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {manifest} from './v26-manifest.mjs';
import {completedSave} from './chapter-eighteen-fixture.mjs';
import {saved,tap,dialogueUI,overflow} from './v26-ui-driver.mjs';
import {waitMap,state,walkTo,useObject,useNearbyObject} from './map-driver-v15.mjs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const rows=[];mkdirSync('docs/screenshots',{recursive:true});
try{
 for(const c of manifest.chapters.slice(1,6)){
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.install();
  const p=completedSave();p.adventure.selectedChapterId=c.id;p.adventure.chapters[c.id].currentLocationId=c.locations[0].id;delete p.world;
  await page.goto(process.env.BASE_URL||'http://localhost:4173');await page.evaluate(p=>localStorage.setItem('astra-chronica:v1',JSON.stringify(p)),p);await page.reload();await tap(page,'ゲーム開始 · 続きから');const original=await saved(page);assert.equal(original.world.mapId,manifest.maps.find(m=>m.locationId===c.locations[0].id).id);await tap(page,'冒険へ出発');await waitMap(page);
  for(const width of [320,390,430]){await page.setViewportSize({width,height:844});await waitMap(page);await overflow(page);const s=await state(page);await walkTo(page,{x:144,y:304});await walkTo(page,{x:112,y:336});assert.ok(Math.hypot((await state(page)).hero.x-112,(await state(page)).hero.y-336)<3);assert.ok((await page.locator('#world-menu-button').boundingBox()).height>=44);await page.locator('#world-minimap-toggle').tap();assert.equal(await page.locator('#world-minimap-toggle').getAttribute('aria-expanded'),'true');await page.locator('#world-minimap-toggle').tap();await page.screenshot({path:`docs/screenshots/free-exploration-v28-${c.id}-${width}.png`,fullPage:true,animations:'disabled'});rows.push({chapter:c.id,map:s.mapId,width});}
  await page.setViewportSize({width:390,height:844});const story=manifest.maps.find(m=>m.chapterId===c.id&&m.locationId===c.locations[0].id).objects.find(o=>o.eventId===c.events[0].id);await useObject(page,story.id);assert.ok(await page.locator('#world-event[open] #dialogue-next').isVisible());await dialogueUI(page);await waitMap(page);await useNearbyObject(page,c.locations[0].id+'-next');await waitMap(page);assert.equal((await state(page)).locationId,c.locations[1].id);
  const before=await saved(page);await page.reload();await tap(page,'ゲーム開始 · 続きから');await tap(page,'冒険へ出発');await waitMap(page);const restored=await saved(page);assert.equal(restored.world.mapId,before.world.mapId);for(const key of ['party','equipment','skillTree','consumables','quests','choices','wins','battles'])assert.deepEqual(restored[key],original[key],key);assert.deepEqual(restored.adventure.chapters, before.adventure.chapters);assert.deepEqual(errors,[]);await page.close();console.log('PASS v2.8 migration/native exploration',c.id);
 }
 writeFileSync('/tmp/v28-touch-result.json',JSON.stringify({sourceHash:manifest.sourceHash,cases:rows,pageErrors:[],mode:'old-save-fixtures-real-native-movement-dialogue-exits-reload'},null,2));assert.equal(rows.length,15);console.log('PASS v2.8 early chapters:5 migrations,15 portrait cases,NPC approach,dialogue replay,real exit travel,minimap,save/reload,no duplicate rewards.');
}finally{await browser.close()}
