import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const c1=['c1-departure','c1-first-battle','c1-stele-story','c1-chest','c1-fork-battle','c1-rest','c1-altar-story','c1-guardian','c1-clear'];
const c2=['c2-arrival','c2-residents','c2-market-fight','c2-potion-chest','c2-fragments','c2-canal-fight','c2-keeper','c2-rest','c2-shield-gift','c2-library-clue','c2-ether-chest','c2-stairs-fight','c2-clock-story','c2-sword-chest','c2-guardian','c2-clear'];
try {
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const tap=name=>page.getByRole('button',{name,exact:true}).tap();
 const layout=async()=>{for(const width of [320,390,430,768]){
  await page.setViewportSize({width,height:width===768?1024:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  for(const button of await page.locator('#content button:visible').all()){
   const rect=await button.boundingBox();assert.ok(rect.height>=44);assert.ok(rect.width>0&&rect.x>=0&&rect.x+rect.width<=width+1);
  }
 }};
 await page.goto(process.env.BASE_URL||'http://localhost:4173');
 await page.evaluate(({c1,c2})=>localStorage.setItem('astra-chronica:v1',JSON.stringify({version:2,started:true,wins:11,battles:11,adventure:{chapters:{'chapter-01':{currentLocationId:'c1-depths',completed:c1},'chapter-02':{currentLocationId:'c2-belfry',completed:c2},'chapter-03':{currentLocationId:'c3-garden',completed:['c3-arrival','c3-fio','c3-rest','c3-bridge-fight','c3-mine-fight','c3-dual-chest','c3-watch-story','c3-warden']}},selectedChapterId:'chapter-03',serial:11,resolved:11}})),{c1,c2});
 await page.reload();await tap('ゲーム開始 · 続きから');await tap('サブクエスト');await layout();
 await page.locator('[data-quest-id="sq-sky-fragments"]').tap();await layout();await page.locator('#quest-accept').tap();await layout();await page.locator('#quest-back').tap();
 await tap('探索記録');await layout();await tap('ホームへ戻る');await tap('冒険へ出発');await layout();await page.locator('[data-event-action="c3-wind-crystals"]').tap();await layout();
 assert.deepEqual(errors,[]);console.log('v1.1 additional touch layouts passed: quests/list/detail/accepted, records, exploration and rotation puzzle at 320/390/430/768px.');
} finally {await browser.close()}
