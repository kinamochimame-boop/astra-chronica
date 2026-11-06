import type {Unit,BattleEvent} from './types';
import {skills,commandsFor} from './battle';
import {ELEMENTS,statusDefinitions,statValue} from './effects';
import {gainExperience,growUnit,initialParty} from './progression';
import {cloneUnit,heroes} from './data/combat';
import {LabSession,seededRandom} from './lab-session';
import type {Command,Element,Stat,StatusId} from './types';

/** Independent lab: manually stepped, no references to the player's progress or save storage. */
export function mountLab(host:HTMLElement,onBack:()=>void,visual?:{host:HTMLElement;show:(units:Unit[],selected:number,target?:string,targets?:string[])=>void;effect:(event:BattleEvent)=>void}){
 let session=new LabSession(),notice='検証専用です。本編の戦績・レベル・保存データには影響しません。';
 const xp=initialParty();
 const options=(items:Record<string,string>)=>Object.entries(items).map(([id,name])=>`<option value="${id}">${name}</option>`).join('');
 host.classList.remove('in-battle','result-screen');
 host.innerHTML=`<p class="eyebrow">BATTLE LAB · v0.4 · 保存なし</p><h1>戦闘基盤テスト</h1>
 <p class="hint">本編と同じ戦闘処理を1行動ずつ実行します。効果付与対象と攻撃対象は独立しています。敵の対象は通常どおりランダムです。</p>
 <div id="lab-sideview" aria-label="保存なしサイドビュー"></div><div class="lab-form">
 <label>効果付与対象（解除・相性も共通）<select id="lab-target">${options(Object.fromEntries(session.battle.units.map(u=>[u.id,u.name])))}</select></label>
 <label>状態異常<select id="lab-status">${options(Object.fromEntries(Object.entries(statusDefinitions).map(([id,s])=>[id,s.name])))}</select></label>
 <label>付与確率<select id="lab-chance"><option value="1">100%</option><option value="0.5">50%</option><option value="0">0%</option></select></label>
 <label>持続（本人の行動回数）<select id="lab-turns"><option>3</option><option>2</option><option>1</option></select></label>
 <button id="lab-inflict">状態異常を付与</button><button id="lab-clear">状態異常を解除</button>
 <label>能力<select id="lab-stat"><option value="attack">攻撃力</option><option value="defense">防御力</option><option value="speed">素早さ</option></select></label>
 <label>補正<select id="lab-amount"><option value="0.25">+25%</option><option value="-0.25">−25%</option><option value="0.5">+50%</option><option value="-0.5">−50%</option></select></label>
 <button id="lab-modify">能力補正を付与</button><button id="lab-clear-modifiers">能力補正を解除</button>
 <label>攻撃属性<select id="lab-element">${options(ELEMENTS)}</select></label>
 <label>効果付与対象の相性<select id="lab-affinity"><option value="1.5">弱点 ×1.5</option><option value="0.5">耐性 ×0.5</option><option value="1">等倍 ×1</option></select></label>
 <button id="lab-element-apply">属性を設定</button><p class="hint">現在の行動者の物理攻撃属性と、効果付与対象の相性を設定します。ファイアは常に火、無属性は常に等倍。</p>
 <label>攻撃対象（生存中の敵）<select id="lab-action-target"></select></label>
 <label>回復・かばう対象<select id="lab-ally-target"></select></label>
 <label>コマンド<select id="lab-command"></select></label><button id="lab-step">1行動進める</button>
 <label class="lab-wide lab-check"><input type="checkbox" id="lab-stop-enemies">敵の攻撃を停止（待機に置換）</label>
 <button id="lab-opportunity" class="lab-wide">効果付与対象の行動機会を1回進める（全員待機）</button>
 <button id="lab-next-round" class="lab-wide">次ラウンドまで進める（全員待機）</button>
 <p class="hint">全員待機の操作では途中の味方・敵も攻撃せず、行動終了処理だけ進めます。毒・火傷の継続ダメージは有効です。</p>
 <label>乱数（変更時に戦闘リセット）<select id="lab-random"><option value="normal">通常乱数</option><option value="seed">固定seed42（再現用）</option><option value="high">固定0.99（非会心・麻痺不発）</option><option value="low">固定0（会心・麻痺発生）</option></select></label>
 <label>検証条件<select id="lab-scenario"><option value="sleep-natural">睡眠の自然解除・持続3</option><option value="freeze-natural">凍結の自然解除・持続3</option><option value="sleep-hit">睡眠の被攻撃解除</option><option value="freeze-hit">凍結の被攻撃解除</option><option value="speed">素早さ検証・メイ+50%</option></select></label>
 <button id="lab-preset" class="lab-wide">条件をセット（検証戦闘リセット）</button>
 <label>検証レベル（変更時リセット）<select id="lab-level"><option>1</option><option>3</option><option>5</option><option>7</option><option>10</option></select></label><button id="lab-star">効果付与対象の星力を100に（保存なし）</button><button id="lab-reset">戦闘をリセット</button><button id="lab-xp">経験値120を試す（保存なし）</button></div>
 <p id="lab-notice" role="status"></p><p id="lab-current"></p><p id="lab-duration"></p>
 <section class="lab-orders"><h2>素早さと行動順</h2><p id="lab-order-fixed"></p><p id="lab-order-remaining"></p><p id="lab-order-projected"></p><p class="hint">順番はラウンド開始時に確定。途中の素早さ変更は次ラウンドから反映します。候補は現時点の能力で仮計算し、次ラウンドまでの期限切れで変わる場合があります。同速は元の登録順です。</p></section>
 <div id="lab-units"></div><h2>検証専用ログ</h2><pre id="lab-log"></pre><p id="lab-growth"></p><button id="lab-back" class="secondary">ホームへ戻る</button>`;
 const el=<T extends HTMLElement=HTMLElement>(id:string)=>host.querySelector<T>(`#lab-${id}`)!;
 const value=(id:string)=>el<HTMLSelectElement>(id).value;
 const statNames:Record<Stat,string>={attack:'攻撃力',defense:'防御力',speed:'素早さ'};
 const newSession=()=>{const mode=value('random'),party=initialParty();for(const hero of Object.values(party))hero.level=Number(value('level'));session=new LabSession(mode==='seed'?seededRandom():mode==='high'?()=>0.99:mode==='low'?()=>0:Math.random,party);session.enemyAttacksEnabled=!el<HTMLInputElement>('stop-enemies').checked;el<HTMLSelectElement>('target').value='astel'};
 const populate=(id:string,units:{id:string;name:string}[],selected:string)=>{const field=el<HTMLSelectElement>(id);field.innerHTML=options(Object.fromEntries(units.map(u=>[u.id,u.name])));field.value=selected;field.disabled=units.length===0};
 function render(){
  const battle=session.battle,current=battle.current;
  const command=el<HTMLSelectElement>('command'),previous=command.value;
  command.innerHTML=current?options(Object.fromEntries(commandsFor(current).map(c=>[c,`${skills[c].name} ${skills[c].starCost?'星力'+skills[c].starCost:'MP'+skills[c].cost}${battle.isLearned(current,c)?'':' 未習得Lv.'+skills[c].unlockLevel}`]))):'';
  if(Array.from(command.options).some(o=>o.value===previous))command.value=previous;
  const cmd=(command.value||'attack') as Command;session.syncTargets(cmd);visual?.show(battle.units,battle.units.indexOf(current!),skills[cmd].target==='self'?current?.id:skills[cmd].target==='ally'?session.allyTarget:session.attackTarget,skills[cmd].target==='allAllies'?battle.allies.filter(u=>u.hp>0).map(u=>u.id):[]);
  populate('action-target',battle.enemies.filter(u=>u.hp>0),session.attackTarget);
  populate('ally-target',skills[cmd].target==='ally'?battle.targets(cmd):battle.allies.filter(u=>u.hp>0),session.allyTarget);
  el('notice').textContent=notice;
  el('current').textContent=battle.result?`戦闘終了：${battle.result==='victory'?'勝利':'敗北'}`:`第${battle.round}ラウンド：${current!.name}${battle.blocked?`（${statusDefinitions[battle.blocked].name}で行動不可）`:''} → 次：${battle.upcoming.map(u=>u.name).join(' → ')}`;
  el('duration').textContent=session.lastOpportunity;
  const order=(entries:{id:string;speed:number}[])=>entries.map((entry,i)=>`${i+1}. ${battle.units.find(u=>u.id===entry.id)!.name}(${entry.speed.toFixed(1)})`).join(' → ');
  el('order-fixed').textContent=`第${battle.round}ラウンド確定順（開始時の実効素早さ）：${order(battle.roundOrder)}`;
  el('order-remaining').textContent=`残りの確定順：${battle.remainingOrder.map(u=>u.name).join(' → ')||'なし'}`;
  el('order-projected').textContent=`現時点の能力で次ラウンド候補：${order(battle.projectedOrder)}`;
  el('units').replaceChildren(...battle.units.map(u=>{const p=document.createElement('p');p.dataset.unitId=u.id;p.textContent=`${u.name} Lv.${u.level} 星力${u.star}/100 HP ${u.hp}/${u.maxHp} MP ${u.mp}/${u.maxMp}｜攻 ${statValue(u,'attack').toFixed(1)} 防 ${statValue(u,'defense').toFixed(1)} 速 ${statValue(u,'speed').toFixed(1)}（基礎速${u.speed.toFixed(1)}）｜${u.statuses.map(s=>`${statusDefinitions[s.id].name}(${s.remaining})`).join(' ')||'状態異常なし'}｜基礎攻 ${u.attack.toFixed(1)}｜${u.modifiers.map(m=>`${m.stat} ${Math.round(m.amount*100)}%(${m.remaining})`).join(' ')}`;return p}));
  el('log').textContent=session.logs.join('\n');
  el<HTMLButtonElement>('step').disabled=!!battle.result;
  el<HTMLButtonElement>('opportunity').disabled=!!battle.result;
  el<HTMLButtonElement>('next-round').disabled=!!battle.result;
 }
 el('target').onchange=()=>{session.effectTarget=value('target')};
 el('action-target').onchange=()=>{session.attackTarget=value('action-target');render()};
 el('ally-target').onchange=()=>{session.allyTarget=value('ally-target');render()};
 el('command').onchange=render;
 el('stop-enemies').onchange=()=>{session.enemyAttacksEnabled=!el<HTMLInputElement>('stop-enemies').checked;notice=session.enemyAttacksEnabled?'敵の攻撃を再開しました。':'敵の攻撃を停止しました。行動機会・期限処理は進みます。';session.append(`[検証設定] ${notice}`);render()};
 el('random').onchange=()=>{newSession();notice='乱数条件を変更し、検証戦闘をリセットしました。';session.append(`[乱数] ${value('random')}`);render()};
 el('level').onchange=()=>{newSession();notice='検証レベルを変更しました。本編のレベルは変更しません。';session.append(`[検証設定] レベル${value('level')}`);render()};
 el('star').onclick=()=>{const u=session.battle.allies.find(u=>u.id===session.effectTarget);notice=u&&u.hp>0?`${u.name}の星力を検証用に100へ設定しました。`:'生存する味方を効果付与対象に選んでください。';if(u&&u.hp>0)u.star=100;session.append(`[検証設定] ${notice}`);render()};
 el('inflict').onclick=()=>{const id=value('status') as StatusId,ok=session.inflict(id,Number(value('chance')),Number(value('turns')));notice=`${statusDefinitions[id].name}：${ok?'付与成功':'付与失敗'}（${session.battle.units.find(u=>u.id===session.effectTarget)!.name}）`;render()};
 el('clear').onclick=()=>{session.clearStatuses();notice='効果付与対象の全状態異常を手動解除しました。';render()};
 el('modify').onclick=()=>{const target=session.battle.units.find(u=>u.id===session.effectTarget)!,stat=value('stat') as Stat,before=statValue(target,stat),amount=Number(value('amount'));const ok=session.modify({stat,amount,turns:Number(value('turns'))});notice=ok?`${target.name}に${statNames[stat]}${amount>0?'+':''}${amount*100}%を付与しました。実効値 ${before.toFixed(1)} → ${statValue(target,stat).toFixed(1)}。同符号は加算・75%上限、持続は長い方へ更新。`:'付与できません。';render()};
 el('clear-modifiers').onclick=()=>{session.clearModifiers();notice='効果付与対象の能力補正を手動解除しました。';render()};
 el('element-apply').onclick=()=>{const battle=session.battle,element=value('element') as Element,target=battle.units.find(u=>u.id===session.effectTarget)!;if(battle.current){battle.current.attackElement=element;target.affinities[element]=Number(value('affinity'));notice=`${ELEMENTS[element]}属性を設定。相性対象：${target.name}。攻撃対象は独立して選択してください。`;session.append(`[属性設定] ${battle.current.name}の攻撃属性=${ELEMENTS[element]}、${target.name}の倍率=${value('affinity')}`)}render()};
 el('step').onclick=()=>{const result=session.step(value('command') as Command);notice=result.ok?result.event.logs.join(' '):result.reason;if(result.ok&&(result.event.damageTrace||result.event.effects?.[0]?.damageTrace)&&skills[result.event.command].kind==='physical'){const trace=(result.event.damageTrace||result.event.effects![0].damageTrace)!;const actor=session.battle.units.find(u=>u.id===result.event.actor)!;notice+=` 実行時の攻撃力：基礎 ${actor.attack.toFixed(1)} → 実効 ${trace.effectiveAttack.toFixed(1)}。`}render();if(result.ok)visual?.effect(result.event)};
 el('opportunity').onclick=()=>{const result=session.targetOpportunity();notice=result.ok?session.lastOpportunity:result.reason;render()};
 el('next-round').onclick=()=>{session.nextRound();notice=`第${session.battle.round}ラウンドの順番を確認してください。全員待機で進めました。`;render()};
 el('preset').onclick=()=>{
  const scenario=value('scenario');el<HTMLInputElement>('stop-enemies').checked=true;newSession();
  if(scenario==='speed'){session.effectTarget='mei';session.modify({stat:'speed',amount:0.5,turns:3});notice='メイ16→24。今ラウンドは固定、次ラウンドに2番手になります。全員待機でラウンドを進め、期限切れ後も比較してください。'}
  else{const id=scenario.startsWith('sleep')?'sleep':'freeze';session.effectTarget=scenario.endsWith('hit')?'enemy0':'astel';session.inflict(id,1,3);notice=scenario.endsWith('hit')?'攻撃対象の星喰いの影に付与しました。通常攻撃で被攻撃解除を確認してください。':'持続3を付与しました。「効果付与対象の行動機会を1回進める」を3回押し、3→2→1→0の自然解除を確認してください。'}
  el<HTMLSelectElement>('target').value=session.effectTarget;el<HTMLSelectElement>('command').value='attack';render();
 };
 el('reset').onclick=()=>{newSession();notice='新しい検証戦闘に戻しました。';render()};
 el('xp').onclick=()=>{for(const h of Object.values(xp))gainExperience(h,120);el('growth').textContent=heroes.map(h=>{const u=growUnit(cloneUnit(h),xp[h.id]);return `${u.name} Lv.${u.level} EXP ${xp[h.id].experience} HP ${u.maxHp} MP ${u.maxMp} 攻${u.attack} 防${u.defense} 速${u.speed}`}).join(' ／ ');notice='各人に経験値120を付与しました（本編には保存しません）。';render()};
 if(visual)host.querySelector('#lab-sideview')!.append(visual.host);el('back').onclick=onBack;render();
}
