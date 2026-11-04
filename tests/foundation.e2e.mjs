import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BASE_URL||'http://localhost:4173');
 await page.getByRole('button',{name:'ゲーム開始',exact:true}).tap();
 const original=await page.evaluate(()=>localStorage.getItem('astra-chronica:v1'));
 await page.getByRole('button',{name:'戦闘基盤テスト（保存なし）'}).tap();
 const select=async(id,value)=>page.locator(`#lab-${id}`).selectOption(value);
 const tap=async(id)=>page.locator(`#lab-${id}`).tap();
 await select('target','astel');
 for(const [id,name] of Object.entries({poison:'毒',paralysis:'麻痺',sleep:'睡眠',blind:'暗闇',silence:'沈黙',burn:'火傷',freeze:'凍結'})){
  await select('status',id);await tap('inflict');await page.locator('#lab-notice').filter({hasText:`${name}：付与成功`}).waitFor();
  assert.ok((await page.locator('#lab-units').textContent()).includes(`${name}(3)`));await tap('clear');
 }
 await select('chance','0');await tap('inflict');await page.locator('#lab-notice').filter({hasText:'付与失敗'}).waitFor();await select('chance','1');
 // Every actor sleeps for one own turn: six explicit skips must reach the next round.
 await select('status','sleep');await select('turns','1');
 for(const id of ['astel','rina','mei','enemy0','enemy1','enemy2']){await select('target',id);await tap('inflict')}
 for(let i=0;i<6;i++)await tap('step');
 await page.locator('#lab-current').filter({hasText:'第2ラウンド：アステル'}).waitFor();
 assert.ok(!(await page.locator('#lab-units').textContent()).includes('睡眠('));
 await tap('reset');await select('target','astel');await select('stat','attack');await select('amount','0.5');await select('turns','3');
 await tap('modify');await tap('modify');assert.ok((await page.locator('#lab-units').textContent()).includes('攻 56.0'));
 await tap('clear-modifiers');assert.ok((await page.locator('#lab-units').textContent()).includes('攻 32.0'));
 await select('target','enemy0');await select('element','water');await tap('element-apply');await tap('step');
 await page.locator('#lab-log').filter({hasText:'弱点を突いた'}).waitFor();
 await tap('xp');await page.locator('#lab-growth').filter({hasText:'アステル Lv.2'}).waitFor();
 assert.equal(await page.evaluate(()=>localStorage.getItem('astra-chronica:v1')),original);
 await page.setViewportSize({width:320,height:568});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await tap('back');await page.getByRole('button',{name:'戦闘開始'}).waitFor();assert.deepEqual(errors,[]);
 console.log('Foundation touch checks passed: seven statuses, 0%/100%, six skipped turns, buffs, elements, EXP preview, save isolation, 320px.');
}finally{await browser.close()}
