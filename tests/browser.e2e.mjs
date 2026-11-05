import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const url=process.env.BASE_URL||'http://localhost:5173';
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await page.addInitScript(()=>{Math.random=()=>0.99});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);
 await page.getByRole('button',{name:'ゲーム開始',exact:true}).tap();
 await page.getByRole('button',{name:'編成を見る'}).tap();
 await page.getByText('使用武器：剣／弓／双剣').waitFor();
 await page.getByRole('button',{name:'ホームへ戻る'}).tap();
 await page.getByRole('button',{name:'戦闘開始'}).tap();
 await page.getByRole('list',{name:'行動順'}).waitFor();
 // Explicit target switching and MP cost on the first turn.
 await page.getByRole('button',{name:'強撃 MP6',exact:true}).tap();
 await page.locator('.enemy').nth(1).tap();
 await page.getByRole('button',{name:'強撃を実行',exact:true}).tap();
 await page.getByText('MP 18 / 24',{exact:true}).waitFor();
 await page.locator('.turn-banner').filter({hasText:'コマンドを選択：リナ'}).waitFor();
 await page.getByRole('button',{name:'かばう MP4',exact:true}).tap();
 await page.locator('.ally').nth(0).tap();
 await page.getByRole('button',{name:'かばうを実行',exact:true}).tap();
 await page.getByText('MP 26 / 30',{exact:true}).waitFor();
 let healUsed=false,guardUsed=false,fireUsed=false;
 for(let i=0;i<100;i++){
  await page.waitForFunction(()=>document.querySelector('h1')?.textContent==='星明かりの勝利'||document.querySelector('h1')?.textContent==='まだ、旅は終わらない'||document.querySelector('.turn-banner')?.textContent?.includes('コマンドを選択'),undefined,{timeout:60000});
  if(await page.getByRole('heading',{name:'星明かりの勝利'}).count())break;
  assert.equal(await page.getByRole('heading',{name:'まだ、旅は終わらない'}).count(),0,'strategy should win');
  const banner=await page.evaluate(()=>document.querySelector('.turn-banner')?.textContent);
  if(!banner?.includes('コマンドを選択')){await page.waitForTimeout(100);continue}
  const tapSkill=async(name)=>{const b=page.getByRole('button',{name,exact:true});if(await b.count()&&await b.isEnabled()){await b.tap();return true}return false};
  if(banner.includes('リナ')&&!guardUsed){guardUsed=await tapSkill('ガード MP3')}
  else if(banner.includes('メイ')){
   // Heal a living wounded ally once, then use fire for a short test.
   const h=page.getByRole('button',{name:'ヒール MP8',exact:true});
   let healed=false;
   if(!healUsed&&await h.isEnabled()){
    await h.tap();
    const allies=page.locator('.ally');
    for(let j=0;j<3;j++){
     const text=await allies.nth(j).textContent();const hp=text.match(/HP (\d+) \/ (\d+)/);
     if(hp&&Number(hp[1])>0&&Number(hp[1])<Number(hp[2])){await allies.nth(j).tap();healed=true;healUsed=true;break}
    }
   }
   if(!healed){fireUsed=(await tapSkill('ファイア MP7'))||fireUsed;if(!await page.getByRole('button',{name:'ファイアを実行',exact:true}).count())await tapSkill('通常攻撃')}
  }else if(banner.includes('アステル')){if(!await tapSkill('強撃 MP6'))await tapSkill('通常攻撃')}
  else await tapSkill('通常攻撃');
  const execute=page.getByRole('button',{name:/を実行$/});
  assert.equal(await execute.isEnabled(),true,`selected command must be executable: ${await page.locator('.hint').last().textContent()}`);
  const before=await page.evaluate(()=>({banner:document.querySelector('.turn-banner')?.textContent,log:document.querySelector('.battle-log')?.textContent,round:document.querySelector('.eyebrow')?.textContent}));
  await execute.tap();
  await page.waitForFunction(previous=>document.querySelector('.turn-banner')?.textContent!==previous.banner||document.querySelector('.battle-log')?.textContent!==previous.log||document.querySelector('.eyebrow')?.textContent!==previous.round,before,{timeout:60000});
 }
 await page.getByRole('heading',{name:'星明かりの勝利'}).waitFor();
 assert.ok(healUsed&&guardUsed&&fireUsed,'skill commands exercised');
 await page.getByText(/一人につき経験値 120 獲得/).waitFor();
 await page.getByRole('button',{name:'ホームへ戻る'}).tap();
 await page.reload();await page.getByRole('button',{name:'ゲーム開始 · 続きから'}).tap();
 await page.getByText('勝利 1回',{exact:true}).waitFor();
 assert.ok((await page.locator('.names').textContent()).includes('Lv.2'));
 await page.getByRole('button',{name:'編成を見る'}).tap();await page.getByRole('heading',{name:/アステル Lv.2/}).waitFor();await page.getByText(/HP 192 · MP 27/).waitFor();await page.getByRole('button',{name:'ホームへ戻る'}).tap();
 const earned=await page.evaluate(()=>JSON.parse(localStorage.getItem('astra-chronica:v1')).party);
 // Retreat during animation and immediately restart: old callbacks must not act in the new fight.
 await page.getByRole('button',{name:'戦闘開始'}).tap();await page.getByRole('button',{name:'通常攻撃を実行'}).tap();
 await page.getByRole('button',{name:'戦闘メニュー'}).tap();await page.getByRole('button',{name:'撤退する（敗北）'}).tap();
 await page.getByRole('heading',{name:'まだ、旅は終わらない'}).waitFor();
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('astra-chronica:v1')).party),earned);
 await page.getByRole('button',{name:'もう一度挑む'}).tap();await page.waitForTimeout(1500);
 await page.locator('.turn-banner').filter({hasText:'コマンドを選択：アステル'}).waitFor();
 await page.setViewportSize({width:320,height:568});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.equal(await page.locator('.ally').count(),3);
 await page.setViewportSize({width:1280,height:800});assert.equal(await page.locator('canvas').count(),1);
 await page.evaluate(()=>localStorage.setItem('astra-chronica:v1',JSON.stringify({version:1,started:true,wins:3,battles:5})));
 await page.reload();await page.getByRole('button',{name:'ゲーム開始 · 続きから'}).tap();await page.getByText('勝利 3回',{exact:true}).waitFor();
 assert.deepEqual(errors,[]);console.log('Browser checks passed: touch targets/skills, victory, defeat, saved progression, interrupted animation, 320/390/1280px, no runtime errors.');
}finally{await browser.close()}
