import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${process.env.UI_TEST_URL||'http://localhost:5173'}/tests/battle-ui.fixture.html`);await page.waitForFunction(()=>window.battleFixture?.ready());
 const configure=c=>page.evaluate(c=>window.battleFixture.configure(c),c);
 const snap=()=>page.evaluate(()=>window.battleFixture.snapshot());
 const skill=name=>page.getByRole('button',{name,exact:true}).tap();
 const execute=()=>page.locator('.execute-command').tap();
 for(const width of [320,390,430]){
  await page.setViewportSize({width,height:844});await configure({units:{astel:{level:10,star:100}}});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight),true);
  await skill('連牙斬 MP8');await execute();
  let s=await snap();assert.equal(s.event.effects.length,2);assert.deepEqual(s.event.effects.map(e=>e.amount),[21,21]);assert.equal(s.units[0].mp,16);
  assert.equal(await page.locator('.combat-fx').count(),2);assert.equal(await page.getByRole('progressbar',{name:'アステル 星力',exact:true}).getAttribute('aria-valuenow'),'100');
 }
 await configure({units:{astel:{level:1}}});assert.equal(await page.getByRole('button',{name:'連牙斬 MP8',exact:true}).isDisabled(),true);assert.match(await page.locator('.commands').textContent(),/未習得.*Lv.3/);
 await configure({units:{astel:{level:10,star:99}}});assert.equal(await page.getByRole('button',{name:'星断の一閃 星力100',exact:true}).isDisabled(),true);assert.match(await page.locator('.commands').textContent(),/星力不足/);
 await configure({units:{astel:{level:10,star:100}}});await skill('星断の一閃 星力100');await execute();let s=await snap();assert.equal(s.event.amount,112);assert.equal(s.units[0].star,0);assert.equal(s.event.ultimate,true);assert.match(await page.locator('.ultimate-banner').textContent(),/星断の一閃/);
 await configure({actor:'mei',units:{mei:{level:10,star:100,hp:20},rina:{hp:30},astel:{hp:10}}});
 await skill('グループヒール MP16');assert.equal((await snap()).targetId,'all-allies');assert.equal(await page.locator('.party-card.targeted').count(),3);await execute();s=await snap();assert.equal(s.event.effects.length,3);assert.deepEqual(s.event.effects.map(e=>e.amount),[45,45,45]);assert.equal(s.units[2].mp,32);
 await configure({actor:'mei',units:{mei:{level:10,star:100},rina:{hp:30},astel:{hp:0}},statuses:[{target:'rina',id:'poison',turns:3}]});await skill('星詠みの奇跡 星力100');await execute();s=await snap();assert.equal(s.units[0].hp,0);assert.equal(s.units[1].hp,150);assert.equal(s.units[1].statuses.length,0);assert.equal(s.units[2].star,0);
 await configure({actor:'rina',units:{rina:{level:10,star:100}}});await skill('不落の誓盾 星力100');await execute();s=await snap();assert.deepEqual(s.units.slice(0,3).map(u=>u.barrierCharges),[1,1,1]);
 // Reconfigure during a pending multi-hit animation: no old event may mutate the new fight.
 await configure({units:{astel:{level:3}}});await skill('連牙斬 MP8');await execute();await configure({});await page.waitForTimeout(950);assert.equal((await snap()).event,undefined);assert.equal((await snap()).units[0].mp,24);
 await page.goto(process.env.BASE_URL||'http://localhost:4173');
 await page.getByRole('button',{name:'ゲーム開始',exact:true}).tap();
 const saved=await page.evaluate(()=>JSON.stringify({...localStorage}));
 await page.getByRole('button',{name:'戦闘基盤テスト（保存なし）'}).tap();
 await page.locator('#lab-level').selectOption('10');await page.locator('#lab-target').selectOption('astel');await page.locator('#lab-star').tap();
 assert.match(await page.locator('[data-unit-id="astel"]').textContent(),/Lv.10 星力100/);
 await page.locator('#lab-command').selectOption('starSlash');await page.locator('#lab-step').tap();assert.match(await page.locator('#lab-log').textContent(),/星断の一閃/);
 assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),saved);assert.deepEqual(errors,[]);
 console.log('v0.6 touch checks passed: 3 widths, learning, star shortage/ultimate, multi-hit, group targeting/heal/cleanse/barrier, animation reset, lab level/star and save isolation.');
}finally{await browser.close()}
