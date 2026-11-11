/** Real touch trajectories, without the legacy test driver's grid waypoint route. */
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {completedSave} from './chapter-eighteen-fixture.mjs';
import {manifest} from './v26-manifest.mjs';
import {state,waitMap,tapWorld} from './map-driver-v15.mjs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']}),rows=[];
mkdirSync('docs/screenshots',{recursive:true});
try{for(const width of [320,390,430]){
 const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.install();
 const p=completedSave(),chapter=manifest.chapters[0];p.adventure.selectedChapterId=chapter.id;p.adventure.chapters[chapter.id].currentLocationId=chapter.locations[0].id;delete p.world;
 await page.goto(process.env.BASE_URL||'http://localhost:4173');await page.evaluate(p=>localStorage.setItem('astra-chronica:v1',JSON.stringify(p)),p);await page.reload();await page.getByRole('button',{name:'ゲーム開始 · 続きから',exact:true}).tap();await page.getByRole('button',{name:'冒険へ出発',exact:true}).tap();await waitMap(page);
 await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));const start=(await state(page)).hero,target={x:193.25,y:379.75};await tapWorld(page,target);const trace=[];
 for(let n=0;n<12;n++){await page.clock.runFor(100);const s=await state(page);trace.push(s.hero);if(!s.hero.moving)break;}
 const end=trace.at(-1),dx=end.x-start.x,dy=end.y-start.y;assert.ok(Math.hypot(end.x-target.x,end.y-target.y)<2.5,'exact tap position, not cell centre');assert.ok(trace.length>=3);assert.ok(Math.abs(dx)>30&&Math.abs(dy)>30);
 for(const q of trace)assert.ok(Math.abs((q.x-start.x)*dy-(q.y-start.y)*dx)/Math.hypot(dx,dy)<.01,'all observed positions lie on the direct diagonal');
 await tapWorld(page,{x:220,y:450});await page.clock.runFor(100);assert.equal((await state(page)).hero.moving,false);assert.match(await page.locator('#world-notice').textContent(),/進めません/);assert.ok(Math.hypot((await state(page)).hero.x-end.x,(await state(page)).hero.y-end.y)<.01);await tapWorld(page,{x:190,y:470});await page.clock.runFor(150);const moving=(await state(page)).hero;assert.ok(moving.moving);await tapWorld(page,{x:235,y:300});const immediate=(await state(page)).hero;assert.ok(Math.hypot(immediate.x-moving.x,immediate.y-moving.y)<15,'retap never teleports');
 for(let n=0;n<30;n++){await page.clock.runFor(100);if(!(await state(page)).hero.moving)break;}
 const final=(await state(page)).hero;assert.ok(Math.hypot(final.x-235,final.y-300)<2.5);assert.equal(final.moving,false);assert.equal(await page.locator('#world-event[open]').count(),0,'approach/movement cannot activate a story');assert.equal(await page.locator('.battle-top').count(),0);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('astra-chronica:v1')));assert.ok(Math.hypot(saved.world.x-final.x,saved.world.y-final.y)<.01);assert.equal(saved.version,2);assert.ok(!('path' in saved.world));
 await page.screenshot({path:`docs/screenshots/smooth-navigation-v29-${width}.png`,fullPage:true,animations:'disabled'});await page.clock.resume();await page.reload();await page.getByRole('button',{name:'ゲーム開始 · 続きから',exact:true}).tap();await page.getByRole('button',{name:'冒険へ出発',exact:true}).tap();await waitMap(page);const restored=(await state(page)).hero;assert.ok(Math.hypot(restored.x-final.x,restored.y-final.y)<.01);assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);rows.push({width,trace,start,end,final,reloaded:{x:restored.x,y:restored.y},pageErrors:errors});await page.close();
 }writeFileSync('/tmp/v29-touch-cases.json',JSON.stringify({sourceHash:manifest.sourceHash,cases:rows},null,2));console.log('PASS v2.9 direct diagonal touch,exact target,mid-motion retap,no auto event,safe save/reload at320/390/430.');
}finally{await browser.close()}
