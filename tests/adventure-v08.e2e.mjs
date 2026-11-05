import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{Math.random=()=>0.99});
 const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('astra-chronica:v1')));
 const tap=name=>page.getByRole('button',{name,exact:true}).tap();
 const dialogue=async()=>{for(let i=0;i<12&&await page.locator('#dialogue-next').count();i++)await page.locator('#dialogue-next').tap()};
 const event=async id=>{await page.locator(`[data-event-action="${id}"]`).tap();await dialogue()};
 const next=()=>page.locator('#adventure-next-location').tap();
 const fight=async()=>{
  for(let n=0;n<160;n++){
   await page.waitForFunction(()=>document.querySelector('.result-screen')||document.querySelector('.turn-banner')?.textContent?.includes('コマンドを選択'),undefined,{timeout:60000});if(await page.locator('.result-screen').count())break;
   const actor=await page.locator('.turn-banner').textContent();
   const skill=async name=>{const b=page.getByRole('button',{name,exact:true});if(await b.count()&&await b.isEnabled()){await b.tap();return true}return false};
   if(actor.includes('アステル')){if(!await skill('強撃 MP6'))await skill('通常攻撃')}
   else if(actor.includes('メイ')){
    let healed=false;const cards=await page.locator('.ally').allTextContents();const wounded=cards.findIndex(t=>{const hp=t.match(/HP (\d+) \/ (\d+)/);return hp&&+hp[1]>0&&+hp[1]/+hp[2]<0.7});
    if(wounded>=0&&await skill('ヒール MP8')){await page.locator('.ally').nth(wounded).tap();healed=true}
    if(!healed&&!await skill('ファイア MP7'))await skill('通常攻撃');
   }else await skill('通常攻撃');
   await page.locator('.execute-command').tap();await page.waitForTimeout(1000);
  }
  assert.equal(await page.getByRole('heading',{name:'野営地で立て直そう'}).count(),0);await page.locator('.result-screen').waitFor();
 };
 await page.goto(process.env.BASE_URL||'http://localhost:4173');await page.evaluate(()=>localStorage.setItem('astra-chronica:v1',JSON.stringify({version:2,started:true,wins:2,battles:3,party:{astel:{level:1,experience:0},rina:{level:1,experience:0},mei:{level:1,experience:0}}})));await page.reload();await tap('ゲーム開始 · 続きから');assert.deepEqual((await saved()).adventure.chapters,{});await tap('冒険へ出発');
 for(const width of [320,390,430]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.locator('.location-button').count(),7);const box=await page.locator('.location-button').first().boundingBox();assert.ok(box.height>=44)}
 assert.equal(await page.locator('[data-location-id="c1-depths"]').isDisabled(),true);
 await page.locator('[data-event-action="c1-departure"]').tap();assert.match(await page.locator('.dialogue-count').textContent(),/1 \/ 4/);await page.locator('#dialogue-next').tap();assert.match(await page.locator('.dialogue-speaker').textContent(),/メイ/);assert.deepEqual((await saved()).adventure.chapters['chapter-01'].completed,[]);
 await page.reload();await tap('ゲーム開始 · 続きから');await tap('冒険へ出発');await event('c1-departure');await next();await event('c1-first-battle');await page.getByRole('button',{name:'戦闘メニュー'}).tap();await tap('撤退する（敗北）');assert.equal((await saved()).battles,4);assert.equal((await saved()).adventure.chapters['chapter-01'].completed.includes('c1-first-battle'),false);
 await tap('この地点に再挑戦');await page.reload();await tap('ゲーム開始 · 続きから');await tap('冒険へ出発');assert.match(await page.locator('.adventure-content').textContent(),/中断した戦闘/);await event('c1-first-battle');await fight();assert.equal((await saved()).wins,3);assert.equal((await saved()).battles,5);
 await page.reload();await tap('ゲーム開始 · 続きから');await tap('冒険へ出発');assert.equal((await saved()).wins,3);assert.equal(await page.locator('[data-event-action="c1-first-battle"]').isDisabled(),true);await next();await event('c1-stele-story');await next();await event('c1-chest');assert.equal((await saved()).equipment.inventory['windcut-bow'],1);
 await page.locator('[data-location-id="c1-stele"]').tap();await page.locator('[data-location-id="c1-fork"]').tap();assert.equal(await page.locator('[data-event-action="c1-chest"]').isDisabled(),true);assert.equal((await saved()).equipment.inventory['windcut-bow'],1);
 await event('c1-fork-battle');await fight();await tap('冒険へ戻る');await next();const growth=JSON.stringify((await saved()).party);await event('c1-rest');assert.equal(JSON.stringify((await saved()).party),growth);await next();await event('c1-altar-story');await next();await event('c1-guardian');await fight();await page.getByRole('heading',{name:'第1章クリア',exact:true}).waitFor();const final=await saved();assert.equal(final.wins,5);assert.equal(final.battles,7);assert.ok(final.adventure.chapters['chapter-01'].completed.includes('c1-clear'));
 await tap('冒険へ戻る');await event('c1-clear');assert.match(await page.locator('.chapter-preview').textContent(),/第2章/);assert.equal(await page.getByRole('button',{name:'第2章へ進む',exact:true}).isEnabled(),true);await page.reload();await tap('ゲーム開始 · 続きから');await tap('冒険へ出発');assert.match(await page.locator('.chapter-progress').textContent(),/クリア済み/);
 await tap('ホームへ戻る');await tap('装備');await page.locator('#equipment-back').tap();const before=JSON.stringify(await saved());await tap('戦闘基盤テスト（保存なし）');await page.locator('#lab-step').tap();await page.locator('#lab-back').tap();assert.equal(JSON.stringify(await saved()),before);await page.getByRole('button',{name:'戦闘開始'}).tap();assert.match(await page.locator('.enemies').textContent(),/星喰いの影/);assert.deepEqual(errors,[]);
 console.log('v0.8 full chapter touch checks passed: 7 locations, 3 widths, dialogue/reload, defeat/interruption/retry, 3 real victories, one-time chest/rewards, rest, boss/clear, legacy save/equipment and lab isolation.');
} finally {await browser.close()}
