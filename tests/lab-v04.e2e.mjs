import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BASE_URL||'http://localhost:4173');
 await page.evaluate(()=>localStorage.setItem('astra-chronica:v1',JSON.stringify({version:1,started:true,wins:7,battles:9})));
 await page.reload();await page.getByRole('button',{name:'ゲーム開始 · 続きから'}).tap();
 const saved=await page.evaluate(()=>JSON.stringify({...localStorage}));
 await page.evaluate(()=>{window.labWrites=[];const original=Storage.prototype.setItem;Storage.prototype.setItem=function(...args){window.labWrites.push(args[0]);return original.apply(this,args)}});
 await page.getByRole('button',{name:'戦闘基盤テスト（保存なし）'}).tap();
 const select=async(id,value)=>page.locator(`#lab-${id}`).selectOption(value);
 const tap=async(id)=>page.locator(`#lab-${id}`).tap();
 const text=async(id)=>page.locator(`#lab-${id}`).textContent();
 const preset=async(value)=>{await select('scenario',value);await tap('preset')};
 await select('random','high');
 for(const [id,name] of [['sleep','睡眠'],['freeze','凍結']]){
  await preset(`${id}-natural`);assert.equal(await page.locator('#lab-stop-enemies').isChecked(),true);
  for(const [before,after] of [[3,2],[2,1],[1,0]]){await tap('opportunity');assert.match(await text('duration'),new RegExp(`${name} ${before} → ${after}`))}
  assert.match(await text('log'),new RegExp(`${name}：期限切れ`));assert.ok(!(await text('log')).includes(`${name}：被攻撃`));
  assert.match(await page.locator('[data-unit-id="astel"]').textContent(),/HP 180\/180/);
  await preset(`${id}-hit`);await select('command','attack');await tap('step');assert.match(await text('log'),new RegExp(`${name}：被攻撃`));
 }
 await preset('speed');assert.match(await text('order-fixed'),/5\. メイ\(16\.0\)/);assert.match(await text('order-projected'),/2\. メイ\(24\.0\)/);
 await tap('next-round');assert.match(await text('order-fixed'),/第2ラウンド.*2\. メイ\(24\.0\)/);
 await tap('next-round');await tap('next-round');assert.match(await text('order-fixed'),/第4ラウンド.*5\. メイ\(16\.0\)/);assert.match(await text('log'),/素早さ.*期限切れ/);
 // Both selectors remain independent and attacks only list living enemies.
 await tap('reset');await select('target','astel');await select('stat','attack');await select('amount','0.25');await select('action-target','enemy0');await tap('modify');
 assert.equal(await page.locator('#lab-action-target').inputValue(),'enemy0');assert.equal(await page.locator('#lab-target').inputValue(),'astel');
 assert.deepEqual(await page.locator('#lab-action-target option').evaluateAll(opts=>opts.map(o=>o.value)),['enemy0','enemy1','enemy2']);
 await select('command','attack');await tap('step');assert.match(await text('notice'),/40ダメージ/);assert.match(await text('log'),/実効攻撃40\.0/);assert.match(await text('log'),/属性1/);
 // Continue until the first enemy is defeated: select automatically switches to a living foe.
 for(let i=0;i<12&&(await page.locator('#lab-action-target').inputValue())==='enemy0';i++){
  if((await text('current')).includes('：アステル')){await select('command','attack');await tap('step')}
  else await tap('next-round');
 }
 assert.equal(await page.locator('#lab-action-target').inputValue(),'enemy1');assert.match(await text('log'),/攻撃対象切替/);
 assert.deepEqual(await page.locator('#lab-action-target option').evaluateAll(opts=>opts.map(o=>o.value)),['enemy1','enemy2']);
 await tap('xp');assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),saved);assert.deepEqual(await page.evaluate(()=>window.labWrites),[]);
 await page.setViewportSize({width:320,height:568});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await tap('back');await page.getByText('勝利 7回',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),saved);assert.deepEqual(await page.evaluate(()=>window.labWrites),[]);assert.deepEqual(errors,[]);
 console.log('v0.4 touch checks passed: natural/hit release separately, remaining counts, speed and expiry, independent live targets, damage log, zero storage writes, 320px.');
}finally{await browser.close()}
