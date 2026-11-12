import assert from 'node:assert/strict';
export const atbFightReceipts=[];
export const atbState=page=>page.locator('.atb-screen').evaluate(el=>JSON.parse(el.dataset.atbState));
export async function waitAtb(page,{pause=true}={}){await page.locator('.atb-screen').waitFor();await page.waitForFunction(()=>!!document.querySelector('.atb-screen')?.dataset.atbState);if(pause&&!(await atbState(page)).paused)await page.locator('#atb-pause').tap();}
export async function atbReserve(page,actor,command,target){
 if(!await page.locator('.atb-screen').count())return false;
 const before=await atbState(page),u=before.units.find(u=>u.id===actor);if(!u||u.hp<=0||u.queue.some(r=>r.command===command))return false;
 await page.locator(`[data-queue-actor="${actor}"] > button`).first().tap();const skill=page.locator(`button[data-command="${command}"]`);if(!await skill.count())return false;await skill.tap();if(target){const t=page.locator(`button[data-target-id="${target}"]`);if(!await t.count()||!await t.isEnabled())return false;await t.tap();}
 const execute=page.locator('.execute-command');if(!await execute.isEnabled())return false;await execute.tap();return true;
}
/** Real controls, real clocks, no model writes. Preserves phase callbacks and victory assertions. */
export async function fightAtb(page,event={id:'ATB encounter'},options={}){
 await waitAtb(page);const virtual=process.env.BATTLE_VIRTUAL_CLOCK==='1'||options.clock;if(virtual)await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));const canvas=page.locator('.battle-art canvas');assert.equal(await canvas.getAttribute('data-layout'),'side');const actors=JSON.parse(await canvas.getAttribute('data-actors'));assert.ok(actors.slice(0,3).every(a=>a.x<195));assert.ok(actors.slice(3).every(a=>a.x>195));assert.equal(await page.locator('.ally').count(),3);let initial=await atbState(page);if(!initial.auto)await page.locator('#atb-auto').tap();
 while((await atbState(page)).speed!==3)await page.locator('#atb-speed').tap();
 const phases=new Set();let steps=0;const capturePhase=async()=>{const phase=+(await page.locator('.battle-art').getAttribute('data-finale-phase'));if(phase&&!phases.has(phase)){phases.add(phase);const wasPaused=(await atbState(page)).paused;if(!wasPaused)await page.locator('#atb-pause').tap();await options.capturePhase?.(phase,page);if(!wasPaused)await page.locator('#atb-pause').tap();}return phase;};await capturePhase();if((await atbState(page)).paused)await page.locator('#atb-pause').tap();
 for(;steps<1800;steps++){
  if(await page.locator('.result-screen').count())break;
  const s=await atbState(page);for(const u of s.units.slice(0,3)){assert.ok(u.ep>=0&&u.ep<=15);assert.ok(u.queue.length<=4);assert.equal(u.mp,initial.units.find(v=>v.id===u.id).mp,'ATB never spends MP');}const party=s.units.slice(0,3),wounded=party.filter(u=>u.hp>0&&u.hp/u.maxHp<.75).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp),phase=await capturePhase();
  await options.onTurn?.({page,actor:'ATB',party:party.map(u=>({...u,max:u.maxHp})),phase,turn:steps});
  if(wounded[0]&&party[2].hp>0){if(wounded.length>1&&party[2].ep>=10)await atbReserve(page,'mei','miracle');else if(wounded.length>1&&party[2].ep>=4)await atbReserve(page,'mei','groupHeal');else if(party[2].ep>=2)await atbReserve(page,'mei','heal',wounded[0].id);}
  if(wounded[0]&&wounded[0].hp/wounded[0].maxHp<.3)await atbReserve(page,'rina','potion',wounded[0].id);
  if(party[0].hp>0&&party[0].ep>=2){if(party[0].ep>=10)await atbReserve(page,'astel','starSlash');else await atbReserve(page,'astel','strong');}
  if(party[1].hp>0&&party[1].ep>=3){if(party[1].ep>=10)await atbReserve(page,'rina','oathShield');else if(wounded.length)await atbReserve(page,'rina','guardianField');else await atbReserve(page,'rina','shieldBash');}
  if(!wounded.length&&party[2].hp>0&&party[2].ep>=3)await atbReserve(page,'mei','fire');
  if(process.env.BATTLE_VIRTUAL_CLOCK==='1'||options.clock)await page.clock.runFor(500);else await page.waitForTimeout(500);
 }
 await page.locator('.result-screen').waitFor();assert.ok(steps<1800,'ATB must terminate without deadlock');assert.equal(await page.getByRole('heading',{name:/野営地で立て直そう|まだ、旅は終わらない/}).count(),0,`ATB battle lost: ${event.id}`);atbFightReceipts.push({event:event.id,system:'ATB+EP',steps,initialIntervals:initial.units.slice(0,3).map(u=>u.interval),mpPreserved:true,epAndQueueBounds:true,phases:[...phases]});console.log('ATB UI victory',event.id);if(virtual)await page.clock.resume();return phases;
}

/** Controlled real manual hit for equipment/tree assertions, then pause for inspection. */
export async function manualAtbAttack(page,id='astel'){
 await waitAtb(page);await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));let s=await atbState(page);if(s.auto)await page.locator('#atb-auto').tap();await page.locator('#atb-pause').tap();await page.locator(`[data-queue-actor="${id}"] > button`).first().tap();
 const chargeSteps=Math.ceil(s.units.find(u=>u.id===id).interval*10)+10;for(let n=0;n<chargeSteps;n++){s=await atbState(page);const u=s.units.find(u=>u.id===id);if(u.progress>=1&&u.busyUntil<=s.time)break;await page.clock.runFor(100);}
 const button=page.locator('button[data-command="attack"]');assert.ok(await button.isEnabled(),'manual normal attack must become ready');await button.tap();await page.clock.runFor(300);await page.locator('#atb-pause').tap();await page.clock.resume();return page.locator('.atb-screen').evaluate(el=>JSON.parse(el.dataset.events).filter(e=>e.actor===el.dataset.actorId&&e.command==='attack').at(-1));
}
/** Observe real enemy AI with AUTO OFF, then freeze on the matching actual event. */
export async function waitAtbEvent(page,predicate){
 await waitAtb(page);await page.clock.pauseAt(await page.evaluate(()=>Date.now()+1000));if((await atbState(page)).auto)await page.locator('#atb-auto').tap();await page.locator('#atb-pause').tap();
 let event;for(let n=0;n<600;n++){const events=await page.locator('.atb-screen').evaluate(el=>JSON.parse(el.dataset.events??'[]'));event=events.find(predicate);if(event)break;await page.clock.runFor(100);}
 assert.ok(event,'expected ATB enemy action within60 simulation seconds; observed '+await page.locator('.atb-screen').evaluate(el=>JSON.stringify(JSON.parse(el.dataset.events??'[]').slice(-6).map(e=>({actor:e.actor,label:e.label,hint:e.hint})))));await page.locator('#atb-pause').tap();await page.clock.resume();return event;
}

/** Match every actual hit, including dual blades and reactions, by its event identity. */
export async function assertAtbHitPopups(page,event){
 const parts=(event.effects??[event]).flatMap(part=>[part,...(part.reactions??[])]);
 for(const part of parts){
  const attrs={'data-actor-id':part.actor,'data-target-id':part.target,'data-hit-index':String(part.hitIndex??1),'data-effect-command':part.command,'data-action-name':part.actionName??''};
  const selector='.combat-fx'+Object.entries(attrs).map(([key,value])=>`[${key}=${JSON.stringify(value)}]`).join('')+' .fx-value';
  const expected=part.label==='ミス'?'MISS':part.kind==='heal'?`+${part.amount}`:part.kind==='damage'?String(part.amount):part.label;
  assert.equal(await page.locator(selector).last().textContent(),expected,`actual ${part.actor}→${part.target} hit ${part.hitIndex??1}`);
 }
}
