import {chromium} from '@playwright/test';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {productionFingerprint} from './production-fingerprint.mjs';
import {loadScaleFixture,configureScale,scaleMetrics,captureScaleSet,scaleWidths} from './capture-actor-scale-v351.mjs';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const url=process.env.UI_TEST_URL||'http://localhost:5196',pageErrors=[],checks=[],touch=[],baseline=JSON.parse(readFileSync('docs/screenshots/v351/before-metrics.json'));
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.on('pageerror',e=>pageErrors.push(e.message));await loadScaleFixture(page,url);
 const snapshot=()=>page.evaluate(()=>window.atbFixture.snapshot()),advance=t=>page.evaluate(t=>window.atbFixture.advance(t),t);
 const tapActor=async id=>{const m=await scaleMetrics(page),u=m.figures.units.find(u=>u.id===id);await page.locator('canvas').tap({position:{x:u.x/m.figures.width*m.canvas.width,y:u.y/m.figures.height*m.canvas.height}})};
 const cases=await captureScaleSet(page,'after');
 for(const c of cases){
  const old=baseline.find(b=>b.width===c.width&&b.height===c.height&&b.kind===c.kind);assert.ok(old);assert.equal(c.horizontal,false);
  for(const key of ['field','party','enemies','execute','canvas'])for(const dimension of ['x','y','width','height'])assert.ok(Math.abs(c[key][dimension]-old[key][dimension])<.05,`unchanged UI ${c.width}/${c.height}/${key}/${dimension}`);
  for(const [i,u] of c.figures.units.entries()){
   const original=old.figures.units[i];assert.equal(u.x,original.x);assert.equal(u.y,original.y);assert.ok(u.scale>0&&u.scale<=(i>=3&&c.kind==='boss'?.65*1.12:.65)+1e-8);
   assert.equal(u.interactive,true);assert.deepEqual(u.hitArea,{x:0,y:0,width:90,height:94});
   if(c.height>=300)assert.ok(Math.abs(u.scale-(i>=3&&c.kind==='boss'?.65*1.12:.65))<1e-8);
  }
  if(c.kind==='boss')assert.ok(Math.abs(c.figures.units[3].scale/c.figures.units[0].scale-1.12)<1e-8);
 }
 checks.push('4 widths x 3 heights: .65 cap, normal 300/345 size constant, unchanged anchors/UI, scaled hit rectangles; 4 boss ratios');
 for(const width of scaleWidths){await page.setViewportSize({width,height:844});
  for(const height of [96,193,300,345]){
   await configureScale(page,height);const m=await scaleMetrics(page);
   const bounds=await page.evaluate(async()=>{const {actorEnvelope}=await import('/src/battle-actor-scale.ts'),{Battle}=await import('/src/battle.ts'),b=new Battle(),f=window.atbFixture.figures();return f.units.map((u,i)=>{const e=actorEnvelope(b.units[i],i<3);return {left:u.x+e.left*u.scale,right:u.x+e.right*u.scale,top:u.y+e.top*u.scale,bottom:u.y+e.bottom*u.scale,markerTop:u.y-54*u.scale}})});
   for(const b of bounds){assert.ok(b.left>=1.99&&b.right<=m.figures.width-1.99);assert.ok(b.top>=1.99&&b.bottom<=m.figures.height-1.99&&b.markerTop>=1.99)}
   for(let i=0;i<bounds.length;i++)for(let j=i+1;j<bounds.length;j++){const a=bounds[i],b=bounds[j];assert.ok(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top,'no silhouette overlap')}
   for(const id of ['enemy0','enemy1','enemy2']){await tapActor(id);assert.equal((await page.evaluate(()=>window.atbFixture.selection())).target,id);const model=await page.locator('canvas').evaluate((c,id)=>JSON.parse(c.dataset.actors).find(u=>u.id===id),id);assert.equal(model.targeted,true)}
   touch.push({width,height,scale:m.figures.units[0].scale,tapped:3,overlap:false,edgeSafe:true});
  }
  // Native canvas ally selection and heal target, not the test fixture's stageTap helper.
  await configureScale(page,300,{units:{astel:{hp:5000}}});await tapActor('mei');assert.match(await page.locator('.atb-selection').textContent(),/^メイ/);await page.locator('[data-command="heal"]').tap();await tapActor('astel');assert.match(await page.locator('.atb-selection').textContent(),/対象：アステル/);await page.locator('.execute-command').tap();await advance(.01);assert.ok((await snapshot()).events.some(e=>e.command==='heal'&&e.target==='astel'&&e.amount>0));assert.match(await page.locator('.combat-fx.heal .fx-value').textContent(),/\+/);await advance(1);assert.equal(await page.locator('.combat-fx').count(),0);
  await configureScale(page,300,{units:{enemy0:{hp:0}}});const target=(await page.evaluate(()=>window.atbFixture.selection())).target;await tapActor('enemy0');assert.equal((await page.evaluate(()=>window.atbFixture.selection())).target,target);assert.equal((await scaleMetrics(page)).figures.units.find(u=>u.id==='enemy0').interactive,false);
 }
 checks.push('native canvas taps at 16 width/height cases, dead exclusion, native ally selection/heal targeting and measured heal popup cleanup');
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'no-preference'});
 await configureScale(page,300,{progress:{astel:1},random:0,units:{enemy0:{affinities:{none:1.5}}}});
 await page.locator('[data-command="attack"]').tap();
 await page.waitForFunction(()=>window.atbFixture.positions().astel.x>79);
 await page.waitForFunction(()=>Math.abs(window.atbFixture.positions().astel.x-78)<.1);
 const s=await snapshot();assert.ok(s.events.some(e=>e.actor==='astel'&&e.kind==='damage'&&e.critical));assert.ok(await page.locator('.combat-fx .fx-value').count());
 await advance(2);assert.equal(await page.locator('.combat-fx').count(),0);
 await page.waitForFunction(()=>document.querySelector('canvas').dataset.effects?.includes('astel'));
 checks.push('real Phaser attack advances/returns to the same home, critical damage popup, cleanup and reduced motion captures');
 assert.equal(await page.evaluate(()=>localStorage.getItem('astra-chronica:v1')),null);assert.deepEqual(pageErrors,[]);
 writeFileSync('/tmp/v351-scale-cases.json',JSON.stringify({sourceHash:productionFingerprint(),cases,touch,checks,pageErrors},null,2));console.log('PASS v3.5.1 actor scale',cases.length,touch.length,checks.length);
}finally{await browser.close()}
