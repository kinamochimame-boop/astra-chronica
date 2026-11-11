import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {state,waitMap,tapWorld,useNearbyObject,selectLocation,contactSymbol} from './map-driver-v15.mjs';
import {saved,tap,menuAction,dialogueUI,fightUI,overflow} from './v26-ui-driver.mjs';
export async function chapterOneRoute({legacy=false}={}){
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(45000);await page.clock.install();await page.addInitScript(()=>{let seed=2701;Math.random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296}});
 await page.goto(process.env.BASE_URL||'http://localhost:4173');
 if(legacy){await page.evaluate(()=>localStorage.setItem('astra-chronica:v1',JSON.stringify({version:2,started:true,wins:2,battles:3,party:{astel:{level:1,experience:0},rina:{level:1,experience:0},mei:{level:1,experience:0}}})));await page.reload()}
 else assert.equal(await page.evaluate(()=>localStorage.getItem('astra-chronica:v1')),null);
 await tap(page,legacy?'ゲーム開始 · 続きから':'ゲーム開始');await tap(page,'冒険へ出発');await waitMap(page);assert.equal((await state(page)).mapId,'mistwood-camp');
 mkdirSync('docs/screenshots',{recursive:true});
 for(const width of [320,390,430]){await page.setViewportSize({width,height:844});await waitMap(page);await overflow(page);assert.ok((await page.locator('#world-menu-button').boundingBox()).height>=44);await page.screenshot({path:`docs/screenshots/free-exploration-v27-camp-${width}.png`,fullPage:true,animations:'disabled'})}
 console.log('stage:three widths');await page.setViewportSize({width:390,height:844});await waitMap(page);console.log('stage:390 restored');
 const reload=async()=>{await page.reload();await tap(page,'ゲーム開始 · 続きから');await tap(page,'冒険へ出発');await waitMap(page)};
 // A distant NPC tap moves first, and cannot complete the event by itself.
 await tapWorld(page,(await state(page)).objects.find(o=>o.eventId==='c1-departure'));await page.waitForFunction(()=>!JSON.parse(document.querySelector('#world-viewport').dataset.state).hero.moving);assert.deepEqual((await saved(page)).adventure.chapters['chapter-01'].completed,[]);
 console.log('stage:departure approach');await useNearbyObject(page,'c1-departure-object');assert.match(await page.locator('.dialogue-count').textContent(),/1 \/ 4/);await page.locator('#dialogue-next').tap();assert.match(await page.locator('.dialogue-speaker').textContent(),/メイ/);await reload();await useNearbyObject(page,'c1-departure-object');assert.match(await page.locator('.dialogue-count').textContent(),/2 \/ 4/);await dialogueUI(page,0);console.log('stage:departure completed');
 await menuAction(page,'地点一覧');assert.ok(await page.locator('[data-location-id="c1-depths"]').isDisabled());assert.ok(await page.locator('[data-location-id="c1-entrance"]').isDisabled());assert.equal(await page.locator('[data-event-action]').count(),0);await page.locator('#enter-walking-map').tap();await waitMap(page);
 const order=['camp','entrance','stele','fork','spring','altar','depths'];
 for(const location of order.slice(1)){console.log('stage:location',location);
  await selectLocation(page,'c1-'+location);await waitMap(page);assert.equal((await state(page)).mapId,'mistwood-'+location);await overflow(page);
  for(const width of [320,390,430]){await page.setViewportSize({width,height:844});await waitMap(page);await overflow(page);await page.screenshot({path:`docs/screenshots/free-exploration-v27-${location}-${width}.png`,fullPage:true,animations:'disabled'})}await page.setViewportSize({width:390,height:844});await waitMap(page);
  if(location==='entrance'){
   await contactSymbol(page,'c1-first-battle-symbol');const prior=await saved(page);await tap(page,'戦闘メニュー');await tap(page,'撤退する（敗北）');assert.equal((await saved(page)).wins,prior.wins);assert.ok(!(await saved(page)).adventure.chapters['chapter-01'].completed.includes('c1-first-battle'));await tap(page,'探索から再挑戦');await waitMap(page);
   await contactSymbol(page,'c1-first-battle-symbol');const pending=await saved(page);await reload();assert.equal((await saved(page)).wins,pending.wins);assert.equal((await saved(page)).adventure.pending,undefined);assert.match(await page.locator('#world-notice').textContent(),/中断した戦闘/);await contactSymbol(page,'c1-first-battle-symbol');await fightUI(page,{id:'c1-first-battle',encounter:'forest-entry'});await tap(page,'冒険へ戻る');await waitMap(page);assert.equal((await state(page)).symbols[0].state,'defeated');const wins=(await saved(page)).wins;await reload();assert.equal((await saved(page)).wins,wins);
  }
  if(location==='stele'){await useNearbyObject(page,'c1-stele-story-object');await dialogueUI(page,0)}
  if(location==='fork'){
   await useNearbyObject(page,'c1-chest-object');await dialogueUI(page,0);assert.equal((await saved(page)).equipment.inventory['windcut-bow'],1);await reload();assert.ok(await page.locator('#world-viewport').count());await useNearbyObject(page,'c1-chest-object');assert.equal(await page.locator('#dialogue-next').count(),0);assert.equal((await saved(page)).equipment.inventory['windcut-bow'],1);
   await contactSymbol(page,'c1-fork-battle-symbol');await fightUI(page,{id:'c1-fork-battle',encounter:'forest-fork'});await tap(page,'冒険へ戻る');await waitMap(page);
  }
  if(location==='spring'){const before=(await saved(page)).party;await useNearbyObject(page,'c1-rest-object');await dialogueUI(page,0);assert.deepEqual((await saved(page)).party,before)}
  if(location==='altar'){await useNearbyObject(page,'c1-altar-story-object');await dialogueUI(page,0)}
  if(location==='depths'){await contactSymbol(page,'c1-guardian-symbol');await fightUI(page,{id:'c1-guardian',encounter:'forest-guardian'});await page.getByRole('heading',{name:'第1章クリア',exact:true}).waitFor();await tap(page,'冒険へ戻る');await waitMap(page);await useNearbyObject(page,'c1-clear-object');await dialogueUI(page,0)}
 }
 const final=await saved(page);assert.deepEqual([...final.world.defeated].sort(),['c1-first-battle-symbol','c1-fork-battle-symbol','c1-guardian-symbol'].sort());assert.deepEqual(final.world.opened,['c1-chest-object']);assert.equal(final.wins,legacy?5:3);assert.equal(final.battles,legacy?7:4);assert.equal(final.adventure.chapters['chapter-01'].completed.length,9);assert.equal(final.equipment.inventory['windcut-bow'],1);await reload();assert.equal((await state(page)).mapId,'mistwood-depths');assert.deepEqual((await saved(page)).party,final.party);
 await menuAction(page,'ホームへ戻る');await tap(page,'装備');await page.locator('#equipment-back').tap();const before=await saved(page);await tap(page,'戦闘基盤テスト（保存なし）');await page.locator('#lab-step').tap();await page.locator('#lab-back').tap();assert.deepEqual(await saved(page),before);await tap(page,'章選択');assert.ok(await page.locator('[data-chapter-id="chapter-02"]').isEnabled());await page.locator('[data-chapter-id="chapter-02"]').tap();assert.ok(await page.locator('.location-list').count());assert.equal(await page.locator('#world-viewport').count(),0);await tap(page,'ホームへ戻る');await tap(page,'戦闘開始　→');assert.match(await page.locator('.enemies').textContent(),/星喰いの影/);await tap(page,'戦闘メニュー');await tap(page,'撤退する（敗北）');await tap(page,'ホームへ戻る');assert.deepEqual(errors,[]);
 await tap(page,'章選択');await page.locator('[data-chapter-id="chapter-01"]').tap();await waitMap(page);
 const durable=await saved(page);await page.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError')}});await tap(page,'探索メニュー');assert.match(await page.locator('#world-notice').textContent(),/保存できません/);assert.deepEqual(await saved(page),durable);
 console.log(`PASS v2.7 chapter1 legacy=${legacy}:7actual maps/9events/3victories/retreat/reload/bow once/3touch widths/Lab isolation/chapter2 unchanged/pageErrors0`);
 }catch(e){console.log('FAIL v27',e.stack);for(const context of browser.contexts())for(const page of context.pages()){console.log((await page.locator('body').innerText()).slice(-2000));await page.screenshot({path:'/tmp/v27-touch-failure.png',fullPage:true})}throw e}finally{await browser.close()}
}
if(import.meta.url===new URL(process.argv[1],'file:').href)await chapterOneRoute();
