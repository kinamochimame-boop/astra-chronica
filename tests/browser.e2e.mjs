import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:5173');
 await page.getByRole('button',{name:'ゲーム開始',exact:true}).click();
 await page.getByRole('button',{name:'編成を見る'}).click();
 await page.getByText('使用武器：剣／弓／双剣').waitFor();
 await page.getByRole('button',{name:'ホームへ戻る'}).click();
 await page.getByRole('button',{name:'戦闘開始'}).click();
 for(let i=0;i<50;i++){
  if(await page.getByRole('heading',{name:'星明かりの勝利'}).count())break;
  const attack=page.getByRole('button',{name:/で攻撃$/});
  if(await attack.count()&&await attack.isEnabled())await attack.click();else await page.waitForTimeout(100);
 }
 await page.getByRole('heading',{name:'星明かりの勝利'}).waitFor();
 await page.getByRole('button',{name:'ホームへ戻る'}).click();
 await page.reload();await page.getByRole('button',{name:'ゲーム開始 · 続きから'}).click();
 await page.getByText('勝利 1回',{exact:true}).waitFor();
 await page.getByRole('button',{name:'戦闘開始'}).click();await page.getByRole('button',{name:'撤退する（敗北）'}).click();
 await page.getByRole('heading',{name:'まだ、旅は終わらない'}).waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.getByRole('button',{name:'ホームへ戻る'}).click();
 await page.setViewportSize({width:320,height:568});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.setViewportSize({width:1280,height:800});assert.equal(await page.locator('canvas').count(),1);
 assert.deepEqual(errors,[]);console.log('Browser checks passed: title, formation, victory, defeat, persistence, 320/390/1280px, no runtime errors.');
}finally{await browser.close()}
