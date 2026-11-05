import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 // Isolate attack modifiers from critical hits, status effects and random enemy targeting.
 await page.addInitScript(()=>{Math.random=()=>0.99});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BASE_URL||'http://localhost:4173');
 await page.getByRole('button',{name:'ゲーム開始',exact:true}).tap();
 const saved=await page.evaluate(()=>localStorage.getItem('astra-chronica:v1'));
 await page.getByRole('button',{name:'戦闘基盤テスト（保存なし）'}).tap();
 const select=async(id,value)=>page.locator(`#lab-${id}`).selectOption(value);
 const tap=async(id)=>page.locator(`#lab-${id}`).tap();
 const attackTarget=async(value)=>select('action-target',value);
 const astel=()=>page.locator('#lab-units p').first();
 const reset=async()=>{await tap('reset');await select('target','astel');await select('stat','attack');await select('amount','0.25');await select('turns','3');await select('command','attack');await attackTarget('enemy0')};
 const expectHit=async(amount)=>{
  const enemy=()=>page.locator('#lab-units [data-unit-id="enemy0"]');
  const hp=async()=>Number((await enemy().textContent()).match(/HP (\d+)\//)[1]);
  const before=await hp();await tap('step');
  const notice=await page.locator('#lab-notice').textContent();
  assert.match(notice,new RegExp(`アステルの通常攻撃！ 星喰いの影に${amount}ダメージ`));
  assert.match(notice,new RegExp(`基礎 32\\.0 → 実効 ${amount}\\.0`));
  assert.equal(before-await hp(),amount);
 };
 const nextAstel=async()=>{for(let i=0;i<5;i++){const options=await page.locator('#lab-command option').evaluateAll(opts=>opts.map(o=>o.value));if(options.includes('defend'))await select('command','defend');await tap('step')}await page.locator('#lab-current').filter({hasText:'：アステル'}).waitFor();await select('command','attack')};
 // Selecting a foe for an attack must not change the intended buff recipient.
 await reset();await tap('modify');assert.match(await page.locator('#lab-notice').textContent(),/アステル.*32\.0 → 40\.0/);assert.match(await astel().textContent(),/攻 40\.0/);
 await expectHit(40);assert.match(await astel().textContent(),/attack 25%\(2\)/);
 await nextAstel();await expectHit(40);
 // Explicit clear restores both effective attack and actual damage.
 await reset();await tap('modify');await tap('clear-modifiers');assert.match(await astel().textContent(),/攻 32\.0/);await expectHit(32);
 // Same-sign stacking affects damage, not just the unit label.
 await reset();await tap('modify');await tap('modify');assert.match(await astel().textContent(),/攻 48\.0/);await expectHit(48);
 await reset();for(let i=0;i<4;i++)await tap('modify');assert.match(await astel().textContent(),/攻 56\.0/);await expectHit(56);
 // A one-action modifier is used for that action, then removed before the following one.
 await reset();await select('turns','1');await tap('modify');await expectHit(40);assert.match(await astel().textContent(),/攻 32\.0/);
 await nextAstel();await expectHit(32);
 assert.equal(await page.evaluate(()=>localStorage.getItem('astra-chronica:v1')),saved);
 await page.setViewportSize({width:320,height:568});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);console.log('Modifier touch regressions passed: target separation, 32→40 damage, persistence, clear, stacking/cap, expiration, saved data unchanged.');
}finally{await browser.close()}
