import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
import {waitMap,state,tapWorld} from './map-driver-v15.mjs';
import {productionFingerprint} from './production-fingerprint.mjs';
const phase=process.env.V44_PHASE||'before',base=process.env.UI_TEST_URL||'http://localhost:5173';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-webgl']});
const rows=[],pageErrors=[];mkdirSync('docs/screenshots/v44',{recursive:true});
try{for(const width of [320,375,390,430]){
 const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.on('pageerror',e=>pageErrors.push(e.message));
 const tap=name=>page.getByRole('button',{name,exact:true}).tap();const focus=()=>page.evaluate(()=>({tag:document.activeElement?.tagName,label:document.activeElement?.getAttribute('aria-label'),text:document.activeElement?.textContent?.slice(0,80)}));
 const photo=name=>page.screenshot({path:`docs/screenshots/v44/${phase}-${name}-${width}.png`,fullPage:true,animations:'disabled'});
 await page.goto(base);await tap('ゲーム開始');await tap('装備');await page.locator('.equipment-heroes').getByRole('button',{name:'リナ',exact:true}).tap();const equipmentFocus=await focus();await photo('equipment');await page.locator('#equipment-back').tap();await tap('スキルツリー');await page.locator('.tree-heroes').getByRole('button',{name:'メイ',exact:true}).tap();const treeHeroFocus=await focus();await page.locator('.tree-branches button').nth(1).tap();const treeBranchFocus=await focus();await page.locator('#tree-back').tap();await tap('冒険を再開');await waitMap(page);
 const s=await state(page),npc=s.objects.find(o=>o.eventId==='c1-departure');await tapWorld(page,npc);const approaching=await page.locator('#world-notice').textContent();await tapWorld(page,{x:s.hero.x-32,y:s.hero.y});const retapApproachVisible=await page.locator('#world-approach').isVisible();await tap('移動をキャンセル');await photo('exploration');
 await page.goto(base+'/tests/atb-ui-v30.fixture.html');await page.waitForFunction(()=>window.atbFixture?.ready());await page.evaluate(()=>window.atbFixture.configure({units:{rina:{hp:5000}}}));await page.locator('.ally[data-target-id="mei"]').tap();await page.locator('[data-command="heal"]').tap();await page.locator('[data-command-target="rina"]').tap();
 await page.evaluate(async()=>{const {AtbView}=await import('/src/atb-view.ts'); const old=AtbView.prototype.update;window.v44Update=old;AtbView.prototype.update=function(){window.v44View=this;return old.call(this)}});await page.evaluate(()=>window.atbFixture.advance(0));
 const deadSelection=await page.evaluate(()=>{const v=window.v44View,b=v.combat.battle;b.allies.find(u=>u.id==='rina').hp=0;v.update();return {target:v.targetId,reason:v.combat.reason(v.actorId,v.command,v.targetId),engineTargets:v.combat.targets(v.actorId,v.command).map(u=>u.id)}});await photo('battle');
 rows.push({width,equipmentFocus,treeHeroFocus,treeBranchFocus,approaching,retapApproachVisible,deadSelection});await page.close();
}}finally{await browser.close()}
writeFileSync(`docs/screenshots/v44/${phase}-metrics.json`,JSON.stringify({phase,sourceHash:productionFingerprint(),mode:'normal fresh UI exploration/growth; separate declared combat fixture with one forced KO',rows,pageErrors},null,2));console.log(JSON.stringify({phase,widths:rows.map(r=>r.width),pageErrors}));
