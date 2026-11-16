import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
import {installIntegrationTelemetry} from './integration-telemetry.mjs';
import {waitMap,state,approach,tapWorld} from './map-driver-v15.mjs';
import {productionFingerprint} from './production-fingerprint.mjs';

const phase=process.env.V42_PHASE||'before';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const rows=[],errors=[];
mkdirSync('docs/screenshots/v42',{recursive:true});
try{for(const width of [320,375,390,430]){
 const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 await page.addInitScript(installIntegrationTelemetry);
 page.on('pageerror',e=>errors.push(e.message));
 const tap=name=>page.getByRole('button',{name,exact:true}).tap();
 const metrics=()=>page.evaluate(()=>{
  const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,documentY:r.y+scrollY}};
  return {scrollY,scrollRange:Math.max(0,document.documentElement.scrollHeight-innerHeight),horizontal:document.documentElement.scrollWidth>innerWidth,focus:document.activeElement?.tagName,canvas:rect(document.querySelector('#world-viewport canvas')),preview:rect(document.querySelector('.equipment-preview')),equip:rect(document.querySelector('#equipment-equip')),commands:rect(document.querySelector('.commands')),weaponList:rect(document.querySelector('.weapon-list')),weaponCount:document.querySelectorAll('[data-weapon-id]').length,resources:window.integrationTelemetry(),canvases:document.querySelectorAll('canvas').length};
 });
 const photo=async name=>{await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));return page.screenshot({path:`docs/screenshots/v42/${phase}-${name}-${width}.png`,fullPage:true,animations:'disabled'})};
 await page.goto(process.env.BASE_URL||'http://localhost:4173');await tap('ゲーム開始');
 // Explicit UI-only level/owned-weapon fixture. The separate genuine journey never imports it.
 await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('astra-chronica:v1'));for(const h of Object.values(p.party)){h.level=10;h.experience=0}p.equipment.inventory['windcut-bow']=1;localStorage.setItem('astra-chronica:v1',JSON.stringify(p))});
 await page.reload();await tap('ゲーム開始 · 続きから');
 await tap('装備');await page.evaluate(()=>scrollTo(0,0));const equipment=await metrics();await photo('equipment');
 await page.locator('[data-weapon-id="windcut-bow"]').tap();const selectedEquipment=await metrics();
 await page.locator('#equipment-back').tap();await tap('スキルツリー');
 const heroLabels=await page.locator('.tree-heroes button').allTextContents();
 await page.locator('[data-node-id="astel-sword-edge"]').tap();await photo('tree');
 const tree=await metrics();await page.locator('#tree-acquire').tap();const treeAfterAcquire=await metrics();
 await page.locator('#tree-back').tap();await tap('冒険を再開');await waitMap(page);
 const resourcesBefore=(await metrics()).resources,cycles=[];
 for(let i=0;i<8;i++){const start=Date.now();await tap('装備へ');await page.locator('#equipment-back').tap();await waitMap(page);await page.waitForTimeout(120);cycles.push(Date.now()-start)}
 const returned=await metrics();await page.evaluate(()=>scrollTo(0,0));const world=await metrics();await photo('world');
 const overlayRects={};
 for(const [name,open,close] of [['hud',()=>page.locator('#world-compass>summary').tap(),()=>page.locator('#world-compass>summary').tap()],['map',()=>tap('地図を拡大'),()=>page.getByRole('button',{name:'探索に戻る',exact:true}).tap()],['menu',()=>tap('探索メニュー'),()=>page.locator('#world-menu-close').tap()]]){await open();overlayRects[name]=(await metrics()).canvas;await close();await waitMap(page);overlayRects[name+'Closed']=(await metrics()).canvas;}
 await approach(page,'c1-camp-next');const lockedExit=page.locator('[data-world-object="c1-camp-next"]');
 const blockedExit=await lockedExit.evaluate(b=>({disabled:b.disabled,availability:b.dataset.availability??null,text:b.textContent}));
 const s=await state(page);const destination={x:s.hero.x-32,y:s.hero.y};await tapWorld(page,destination);const movementNotice=await page.locator('#world-notice').textContent();await tap('移動をキャンセル');
 await tap('探索メニュー');await tap('ホームへ戻る');await tap('戦闘開始　→');await page.locator('.atb-screen').waitFor();
 await page.locator('#atb-start').tap();await page.locator('#atb-pause').tap();
 await page.locator('.ally[data-target-id="mei"]').tap();await page.locator('[data-command="heal"]').tap();
 await page.locator('.ally[data-target-id="astel"]').tap();await page.locator('.ally[data-target-id="mei"]').tap();
 const remembered=await page.locator('[data-command="heal"]').getAttribute('aria-pressed');let actorRoundtripTaps=2;if(remembered!=='true'){await page.locator('[data-command="heal"]').tap();actorRoundtripTaps++}
 await photo('battle');const battle=await metrics();
 await page.evaluate(()=>{window.v42OldMenu=document.querySelector('.menu-button').onclick});
 await tap('戦闘メニュー');await tap('撤退する（敗北）');await tap('ホームへ戻る');
 const staleMenuError=await page.evaluate(()=>{try{window.v42OldMenu();return null}catch(e){return e.message}});
 rows.push({width,fixture:'UI-only Lv10/owned bow; no chapter progress injected',equipment,selectedEquipment,tree,treeAfterAcquire,heroLabels,world,overlayRects,blockedExit,movementNotice,resourcesBefore,returned,cycles,battle,actorRoundtripTaps,rememberedHeal:remembered==='true',staleMenuError});
 await page.close();
}
 writeFileSync(`docs/screenshots/v42/${phase}-metrics.json`,JSON.stringify({phase,sourceHash:productionFingerprint(),rows,pageErrors:errors},null,2));
 console.log(JSON.stringify({phase,widths:rows.map(r=>({width:r.width,equipmentScroll:r.equipment.scrollRange,equipY:r.equipment.equip.documentY,weaponCount:r.equipment.weaponCount,roundtrip:r.actorRoundtripTaps,staleMenuError:r.staleMenuError,blockedExit:r.blockedExit.availability,afterAcquireFocus:r.treeAfterAcquire.focus})),pageErrors:errors}));
}finally{await browser.close()}
