import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {productionFingerprint} from './production-fingerprint.mjs';
import {atbState,fightAtb} from './atb-driver-v30.mjs';
const rows=[];const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{for(const width of [320,390,430]){
 const page=await browser.newPage({viewport:{width,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.install();await page.goto(process.env.BASE_URL||'http://localhost:4173');await page.getByRole('button',{name:'ゲーム開始',exact:true}).tap();await page.getByRole('button',{name:'戦闘開始　→',exact:true}).tap();await page.locator('.atb-screen').waitFor();await page.clock.runFor(4000);let state=await atbState(page);assert.ok(state.units.slice(0,3).every(u=>u.ep>0),'all three attack independently');assert.ok(state.units.slice(0,3).every(u=>u.ep<=15));assert.equal(await page.getByRole('progressbar',{name:'アステル EP',exact:true}).count(),1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('#atb-pause').tap();const old=await atbState(page);await page.clock.runFor(2000);assert.deepEqual(await atbState(page),old);await page.locator('#atb-pause').tap();
 mkdirSync('docs/screenshots',{recursive:true});await page.screenshot({path:`docs/screenshots/atb-v30-${width}.png`,fullPage:true,animations:'disabled'});await fightAtb(page,{id:'regular'},{clock:true});assert.equal(await page.getByRole('heading',{name:'星明かりの勝利',exact:true}).count(),1);const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('astra-chronica:v1')));assert.equal(saved.wins,1);assert.equal(saved.version,2);assert.deepEqual(errors,[]);rows.push({width,initial:state,wins:saved.wins,version:saved.version,pageErrors:errors});await page.close();console.log('PASS ATB v3.0 touch',width);
}writeFileSync('/tmp/v30-touch-cases.json',JSON.stringify({sourceHash:productionFingerprint(),cases:rows},null,2));}finally{await browser.close()}
