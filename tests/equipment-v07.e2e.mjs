import {manualAtbAttack} from './atb-driver-v30.mjs';
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await page.clock.install();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{Math.random=()=>0.99});
 await page.goto(process.env.BASE_URL||'http://localhost:4173');
 await page.evaluate(()=>localStorage.setItem('astra-chronica:v1',JSON.stringify({version:2,started:true,wins:4,battles:9,party:{astel:{level:1,experience:13},rina:{level:3,experience:17},mei:{level:7,experience:31}}})));
 await page.reload();await page.getByRole('button',{name:'ゲーム開始 · 続きから'}).tap();
 let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('astra-chronica:v1')));assert.equal(saved.party.mei.level,7);assert.equal(saved.party.rina.experience,17);assert.equal(saved.wins,4);assert.equal(saved.equipment.equipped.astel,'travelers-sword');
 await page.getByRole('button',{name:'装備',exact:true}).tap();
 const choose=id=>page.locator(`.weapon-choice[data-weapon-id="${id}"]`).tap();
 for(const width of [320,390,430]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);for(const button of await page.locator('.equipment-heroes button,.weapon-choice').all()){const box=await button.boundingBox();assert.ok(box.height>=44)}}
 assert.equal(await page.locator('#equipment-current-name').textContent(),'旅人の剣');
 await choose('azurecrystal-rod');assert.equal(await page.locator('#equipment-equip').isDisabled(),true);assert.match(await page.locator('#equipment-reason').textContent(),/装備できません/);
 await choose('windcut-bow');assert.equal(await page.locator('#equipment-equip').isDisabled(),true);assert.match(await page.locator('#equipment-reason').textContent(),/所持していません/);
 await page.locator('.equipment-test summary').tap();await page.locator('#equipment-unlock').tap();await page.locator('#equipment-equip').tap();assert.equal(await page.locator('#equipment-current-name').textContent(),'風切りの弓');assert.match(await page.locator('tr[data-stat="素早さ"]').textContent(),/28/);
 await page.locator('.equipment-test summary').tap();await page.locator('#equipment-unlock').tap();saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('astra-chronica:v1')));assert.equal(Object.keys(saved.equipment.inventory).length,9);assert.ok(Object.values(saved.equipment.inventory).every(n=>n===1));
 await choose('twinmoon-daggers');await page.locator('#equipment-equip').tap();assert.match(await page.locator('#equipment-description').textContent(),/0.5倍×2/);
 await page.getByRole('button',{name:'メイ',exact:true}).tap();await choose('prayer-mace');assert.match(await page.locator('tr[data-stat="最大HP"]').textContent(),/237/);await page.locator('#equipment-equip').tap();await page.locator('#equipment-remove').tap();assert.equal(await page.locator('#equipment-current-name').textContent(),'装備なし');await choose('starlight-wand');await page.locator('#equipment-equip').tap();
 await page.locator('#equipment-back').tap();await page.getByRole('button',{name:'戦闘開始'}).tap();
 await manualAtbAttack(page);const effects=await page.locator('.fx-value').allTextContents();assert.deepEqual(effects,['18','18']);assert.equal(await page.getByRole('progressbar',{name:'アステル EP',exact:true}).getAttribute('aria-valuenow'),'2');
 await page.getByRole('button',{name:'戦闘メニュー'}).tap();await page.getByRole('button',{name:'撤退する（敗北）'}).tap();await page.getByRole('button',{name:'ホームへ戻る'}).tap();
 saved=await page.evaluate(()=>JSON.stringify({...localStorage}));await page.evaluate(()=>{window.equipmentWrites=[];const original=Storage.prototype.setItem;Storage.prototype.setItem=function(...args){window.equipmentWrites.push(args[0]);return original.apply(this,args)}});
 await page.getByRole('button',{name:'戦闘基盤テスト（保存なし）'}).tap();await page.locator('#lab-step').tap();assert.match(await page.locator('#lab-notice').textContent(),/32ダメージ/);await page.locator('#lab-level').selectOption('10');await page.locator('#lab-star').tap();await page.locator('#lab-back').tap();assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),saved);assert.deepEqual(await page.evaluate(()=>window.equipmentWrites),[]);
 await page.reload();await page.getByRole('button',{name:'ゲーム開始 · 続きから'}).tap();await page.getByRole('button',{name:'装備',exact:true}).tap();assert.equal(await page.locator('#equipment-current-name').textContent(),'双月の短剣');
 await page.locator('#equipment-remove').tap();await page.reload();await page.getByRole('button',{name:'ゲーム開始 · 続きから'}).tap();await page.getByRole('button',{name:'装備',exact:true}).tap();assert.equal(await page.locator('#equipment-current-name').textContent(),'装備なし');
 assert.deepEqual(errors,[]);console.log('v0.7 touch checks passed: 3 widths/44px, v2 migration, restrictions, unlock idempotency, compare/equip/remove, dual actual hits/EP, reload, lab save isolation.');
} finally {await browser.close()}
