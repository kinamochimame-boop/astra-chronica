/** Migration of list-era tests to real native map movement; no game state writes or synthetic controls. */
import assert from 'node:assert/strict';
import {puzzleUI} from './v26-ui-driver.mjs';
import {manifest} from './v26-manifest.mjs';
import {state,waitMap,selectLocation,contactSymbol,openNearbyStory,useNearbyObject} from './map-driver-v15.mjs';
export async function installEarlyTestRandom(page){await page.addInitScript(()=>{let seed=2808;Math.random=()=>document.querySelector('.battle-top,#lab-step')?0.99:((seed=(1664525*seed+1013904223)>>>0)/4294967296)});}
export async function earlyTap(page,name){
 if(name==='この地点に再挑戦'&&await page.getByRole('button',{name:'探索から再挑戦',exact:true}).count()){
  const p=await page.evaluate(()=>JSON.parse(localStorage.getItem('astra-chronica:v1'))),id=p.world.returnInfo.eventId;
  await page.getByRole('button',{name:'探索から再挑戦',exact:true}).tap();await waitMap(page);await openEarlyEvent(page,id);return;
 }

 if(await page.locator('#world-viewport').count()&&['ホームへ戻る','章選択','サブクエスト','冒険手帳','探索記録','地点一覧'].includes(name)){
  if(await page.locator('#world-event[open]').count())await page.locator('#world-event #adventure-home').tap();
  if(!await page.locator('#world-menu[open]').count())await page.locator('#world-menu-button').tap();
  if(name==='章選択')await page.getByRole('button',{name:'ホームへ戻る',exact:true}).tap();
 }
 await page.getByRole('button',{name,exact:true}).tap();
}
export async function earlyList(page){if(await page.locator('#world-viewport').count()&&!await page.locator('#world-event[open]').count())await earlyTap(page,'地点一覧');}
export async function openEarlyEvent(page,id){
 if(await page.locator('#world-event[open]').count())await page.locator('#world-event #adventure-home').tap();
 if(await page.locator('#enter-walking-map').isVisible()){await page.locator('#enter-walking-map').tap();await waitMap(page);}
 const chapter=manifest.chapters.find(c=>c.events.some(e=>e.id===id)),e=chapter.events.find(e=>e.id===id);
 const p=await page.evaluate(()=>JSON.parse(localStorage.getItem('astra-chronica:v1')));
 if(p.adventure.chapters[chapter.id].currentLocationId!==e.locationId)await selectLocation(page,e.locationId);
 if(e.encounter){const map=manifest.maps.find(m=>m.locationId===e.locationId),symbol=map.symbols.find(s=>s.eventId===id);await contactSymbol(page,symbol.id);}else await openNearbyStory(page,id);
}
export async function earlyQuestCollect(page,id){
 const q=manifest.quests.find(q=>q.objectives.some(o=>o.id===id));assert.ok(q);
 const original=page.locator(`[data-quest-collect="${id}"]`);assert.ok(await original.isDisabled(),'remote quest collection must be blocked');
 await page.locator('#quest-back').tap();await waitMap(page);
 const target=manifest.maps.flatMap(m=>m.objects).find(o=>o.objectiveId===id&&o.questId===q.id);assert.ok(target);await useNearbyObject(page,target.id);
 assert.ok((await page.evaluate(()=>JSON.parse(localStorage.getItem('astra-chronica:v1')))).quests[q.id].objectives.includes(id));
 await earlyTap(page,'サブクエスト');await page.locator(`[data-quest-id="${q.id}"]`).tap();
}

export const earlyConditionPanel=(page,id)=>openEarlyEvent(page,id);
export async function assertEarlyRestricted(page,id){
 const c=manifest.chapters.find(c=>c.events.some(e=>e.id===id)),e=c.events.find(e=>e.id===id);
 if(e.encounter){assert.equal((await state(page)).symbols.find(s=>s.eventId===id).state,'hidden');assert.equal(await page.locator('.battle-top').count(),0);return;}
 await openEarlyEvent(page,id);for(let n=0;n<e.pages.length;n++)await page.locator('#dialogue-next').tap();
 if(e.puzzle)await puzzleUI(page,e);
 assert.match(await page.locator('#world-event #adventure-notice').textContent(),/解除条件/);
 const p=await page.evaluate(()=>JSON.parse(localStorage.getItem('astra-chronica:v1')));assert.ok(!p.adventure.chapters[c.id].completed.includes(id));
 await page.locator('#world-event #adventure-home').tap();await waitMap(page);
}
