import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
import {instrument,telemetry} from './stability-telemetry.mjs';
import {waitMap} from './map-driver-v15.mjs';
import {tap,menuAction} from './v26-ui-driver.mjs';
import {productionFingerprint} from './production-fingerprint.mjs';
const phase=process.env.V43_PHASE||'before',browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-webgl']}),rows=[];
mkdirSync('docs/screenshots/v43',{recursive:true});
try{for(const width of [320,375,390,430]){
 const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});await instrument(page);
 await page.goto(process.env.BASE_URL||'http://localhost:4173');await tap(page,'ゲーム開始');await tap(page,'冒険を再開');await waitMap(page);const before=await telemetry(page);
 await page.locator('#world-menu-button').tap();await page.locator('#world-menu-close').evaluate(b=>window.oldWorldClose=b.onclick);await page.locator('#world-menu-close').tap();await menuAction(page,'ホームへ戻る');
 const stale=await page.evaluate(()=>{try{window.oldWorldClose();return null}catch(e){return e.message}});await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await page.screenshot({path:`docs/screenshots/v43/${phase}-home-${width}.png`,fullPage:true,animations:'disabled'});
 await tap(page,'冒険を再開');await waitMap(page);const after=await telemetry(page);await menuAction(page,'ホームへ戻る');await tap(page,'戦闘開始　→');await page.locator('#atb-start').tap();await page.waitForFunction(()=>JSON.parse(document.querySelector('.atb-screen').dataset.atbState).started);await page.locator('#atb-pause').tap();const combatBefore=await page.locator('.atb-screen').getAttribute('data-atb-state');await page.evaluate(()=>{dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))});const bfcachePreserved=combatBefore===await page.locator('.atb-screen').getAttribute('data-atb-state');await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await page.screenshot({path:`docs/screenshots/v43/${phase}-battle-${width}.png`,fullPage:true,animations:'disabled'});const autoBefore=JSON.parse(await page.locator('.atb-screen').getAttribute('data-atb-state')).auto;await page.locator('#atb-auto').evaluate(b=>b.onclick());const autoAfter=JSON.parse(await page.locator('.atb-screen').getAttribute('data-atb-state')).auto;rows.push({width,before,after,stale,bfcachePreserved,bfcacheControlsRespond:autoBefore!==autoAfter});await page.close();
}writeFileSync(`docs/screenshots/v43/${phase}-metrics.json`,JSON.stringify({phase,sourceHash:productionFingerprint(),clock:'real time',rows},null,2)+'\n');console.log(JSON.stringify({phase,rows}));}finally{await browser.close()}
