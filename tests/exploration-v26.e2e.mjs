import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,renameSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {manifest} from './v26-manifest.mjs';
import {completedSave} from './chapter-eighteen-fixture.mjs';
import {tap,overflow} from './v26-ui-driver.mjs';
import {state,waitMap,walkTo} from './map-driver-v15.mjs';
const widths=[320,390,430,768],requested=process.env.V26_MAP_IDS?.split(','),selected=requested?manifest.maps.filter(m=>requested.includes(m.id)):manifest.maps,fullMatrix=selected.length===manifest.maps.length,checkpoint=fullMatrix?process.env.V26_MAP_CHECKPOINT:undefined;assert.ok(selected.length>0,'Known map IDs required');
const testHash=createHash('sha256').update(readFileSync(new URL(import.meta.url))).update(readFileSync(new URL('./v26-ui-driver.mjs',import.meta.url))).update(readFileSync(new URL('./map-driver-v15.mjs',import.meta.url))).digest('hex');
let cases=[];
if(checkpoint)try{const previous=JSON.parse(readFileSync(checkpoint,'utf8'));if(previous.sourceHash===manifest.sourceHash&&previous.testHash===testHash)cases=previous.cases.filter(c=>widths.includes(c.width)&&manifest.maps.some(m=>m.id===c.map)&&(c.map.startsWith('final-')?existsSync(`docs/screenshots/exploration-v26-${c.map}-${c.width}.png`):true))}catch{}
cases=[...new Map(cases.map(c=>[`${c.map}:${c.width}`,c])).values()];const reusedCases=cases.length;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 for(const map of selected){
  if(widths.every(width=>cases.some(c=>c.map===map.id&&c.width===width))){console.log('REUSED90 verified layout fixture',map.id);continue}
  // Every map owns a separate browser context. No main save or earlier map runtime is shared.
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),errors=[];page.setDefaultTimeout(Number(process.env.V26_ACTION_TIMEOUT_MS)||90_000);page.setDefaultNavigationTimeout(Number(process.env.V26_ACTION_TIMEOUT_MS)||90_000);page.on('pageerror',e=>errors.push(e.message));console.log('MAP90 start',map.id);
  try{
   const p=completedSave();p.adventure.selectedChapterId=map.chapterId;p.adventure.chapters[map.chapterId].currentLocationId=map.locationId;p.world={mapId:map.id,...map.entry,defeated:[],opened:[]};
   await page.goto(process.env.BASE_URL||'http://localhost:4173');await page.evaluate(p=>localStorage.setItem('astra-chronica:v1',JSON.stringify(p)),p);await page.reload();await tap(page,'ゲーム開始 · 続きから');await tap(page,'冒険へ出発');await waitMap(page);assert.equal((await state(page)).mapId,map.id);
   const verified=[];
   for(const width of widths){
    if(cases.some(c=>c.map===map.id&&c.width===width))continue;
    await page.setViewportSize({width,height:width===768?1024:844});await waitMap(page);await overflow(page);const s=await state(page),r=await page.locator('#world-viewport canvas').boundingBox();assert.ok(Math.abs(r.height/r.width-s.height/s.width)<.02);assert.ok((await page.locator('#world-menu-button').boundingBox()).height>=44);
    const first=map.chapterId==='chapter-01'?{x:map.entry.x+32,y:map.entry.y}:{x:176,y:400},second=map.chapterId==='chapter-01'?{x:map.entry.x,y:map.entry.y+32}:{x:144,y:400};if(map.chapterId==='chapter-01')for(const point of [first,second])assert.ok(s.grid[Math.floor(point.y/s.tile)][Math.floor(point.x/s.tile)]==='.'&&s.objects.every(o=>Math.hypot(o.x-point.x,o.y-point.y)>24),'ground movement targets must be unoccupied floor, not NPC/sign interactions');await walkTo(page,first);await walkTo(page,second);assert.ok(Math.hypot((await state(page)).hero.x-second.x,(await state(page)).hero.y-second.y)<3);
    await page.locator('#world-minimap-toggle').tap();assert.equal(await page.locator('#world-minimap-toggle').getAttribute('aria-expanded'),'true');await page.waitForFunction(()=>!!document.querySelector('#world-minimap').dataset.state);const mini=await page.locator('#world-minimap').evaluate(e=>JSON.parse(e.dataset.state)),live=await state(page);assert.ok(Math.abs(mini.player.x-live.hero.x/live.tile)<.03&&Math.abs(mini.player.y-live.hero.y/live.tile)<.03);await page.locator('#world-minimap-toggle').tap();
    if(map.chapterId==='chapter-18')await page.screenshot({path:`docs/screenshots/exploration-v26-${map.id}-${width}.png`,fullPage:true,animations:'disabled'});assert.deepEqual(errors,[]);verified.push({map:map.id,width,verifiedAt:new Date().toISOString()});
   }
   assert.deepEqual(errors,[]);cases.push(...verified);
   if(checkpoint){writeFileSync(checkpoint+'.tmp',JSON.stringify({mode:'independent-layout-fixtures-not-fresh-journey',sourceHash:manifest.sourceHash,testHash,cases},null,2));renameSync(checkpoint+'.tmp',checkpoint)}console.log('PASS90',map.id);
  }catch(error){console.error('MAP90 failure',map.id);try{console.error((await page.locator('body').innerText({timeout:5000})).slice(-6000));await page.screenshot({path:`/tmp/v26-map-failure-${map.id}.png`,fullPage:true,timeout:5000})}catch{}throw error}finally{await page.close()}
 }
 assert.equal(cases.length,selected.length*4);assert.equal(new Set(cases.map(c=>`${c.map}:${c.width}`)).size,selected.length*4);
 writeFileSync(fullMatrix?'/tmp/v26-map-cases.json':'/tmp/v26-map-focused-cases.json',JSON.stringify({mode:'independent-layout-fixtures-not-fresh-journey',sourceHash:manifest.sourceHash,testHash,fullMatrix,cases,reusedCases,newCases:cases.length-reusedCases,pageErrors:[]},null,2));console.log(`PASS ${selected.length}maps/${cases.length}cases:`,' actual touch, collision, minimap, camera/aspect,44px,reduced motion and no horizontal overflow.');
}finally{await browser.close()}
