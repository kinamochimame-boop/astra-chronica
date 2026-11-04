import {Battle,skills,commandsFor} from './battle';
import {ELEMENTS,statusDefinitions,statValue} from './effects';
import {gainExperience,growUnit,initialParty} from './progression';
import {cloneUnit,heroes} from './data/combat';
import type {Command,Element,Stat,StatusId} from './types';

/** Isolated, manually stepped playground. Never reads or writes the player's save. */
export function mountLab(host:HTMLElement,onBack:()=>void){
 let battle=new Battle(),notice='検証専用です。本編の戦績・レベル・保存データには影響しません。';
 const xp=initialParty();
 host.classList.remove('in-battle','result-screen');
 const options=(items:Record<string,string>)=>Object.entries(items).map(([id,name])=>`<option value="${id}">${name}</option>`).join('');
 host.innerHTML=`<p class="eyebrow">BATTLE LAB · 保存なし</p><h1>戦闘基盤テスト</h1>
 <p class="hint">本編と同じ戦闘処理を、1行動ずつ手動で実行します。敵も自動進行しません。</p>
 <div class="lab-form">
 <label>対象<select id="lab-target">${options(Object.fromEntries(battle.units.map(u=>[u.id,u.name])))}</select></label>
 <label>状態異常<select id="lab-status">${options(Object.fromEntries(Object.entries(statusDefinitions).map(([id,s])=>[id,s.name])))}</select></label>
 <label>付与確率<select id="lab-chance"><option value="1">100%</option><option value="0.5">50%</option><option value="0">0%</option></select></label>
 <label>持続（本人の行動回数）<select id="lab-turns"><option>3</option><option>2</option><option>1</option></select></label>
 <button id="lab-inflict">状態異常を付与</button><button id="lab-clear">状態異常を解除</button>
 <label>能力<select id="lab-stat"><option value="attack">攻撃力</option><option value="defense">防御力</option><option value="speed">素早さ</option></select></label>
 <label>補正<select id="lab-amount"><option value="0.25">+25%</option><option value="-0.25">−25%</option><option value="0.5">+50%</option><option value="-0.5">−50%</option></select></label>
 <button id="lab-modify">能力補正を付与</button><button id="lab-clear-modifiers">能力補正を解除</button>
 <label>攻撃属性<select id="lab-element">${options(ELEMENTS)}</select></label>
 <label>対象の相性<select id="lab-affinity"><option value="1.5">弱点 ×1.5</option><option value="0.5">耐性 ×0.5</option><option value="1">等倍 ×1</option></select></label>
 <button id="lab-element-apply">属性を設定</button><p class="hint">現在の行動者の通常攻撃・強撃の属性と、対象の相性を設定します。ファイアは常に火。無属性は常に等倍。</p>
 <label>コマンド<select id="lab-command"></select></label><button id="lab-step">1行動進める</button>
 <button id="lab-reset">戦闘をリセット</button><button id="lab-xp">経験値120を試す（保存なし）</button></div>
 <p id="lab-notice" role="status"></p><p id="lab-current"></p><div id="lab-units"></div><pre id="lab-log"></pre><p id="lab-growth"></p><button id="lab-back" class="secondary">ホームへ戻る</button>`;
 const el=<T extends HTMLElement=HTMLElement>(id:string)=>host.querySelector<T>(`#lab-${id}`)!;
 const value=(id:string)=>el<HTMLSelectElement>(id).value;
 function render(){
  el('notice').textContent=notice;
  const current=battle.current;
  el('current').textContent=battle.result?`戦闘終了：${battle.result==='victory'?'勝利':'敗北'}`:`第${battle.round}ラウンド：${current!.name}${battle.blocked?`（${statusDefinitions[battle.blocked].name}で行動不可）`:''} → 次：${battle.upcoming.map(u=>u.name).join(' → ')}`;
  el('units').replaceChildren(...battle.units.map(u=>{
   const p=document.createElement('p');p.textContent=`${u.name} HP ${u.hp}/${u.maxHp} MP ${u.mp}/${u.maxMp}｜攻 ${statValue(u,'attack').toFixed(1)} 防 ${statValue(u,'defense').toFixed(1)} 速 ${statValue(u,'speed').toFixed(1)}｜${u.statuses.map(s=>`${statusDefinitions[s.id].name}(${s.remaining})`).join(' ')||'状態異常なし'}｜${u.modifiers.map(m=>`${m.stat} ${Math.round(m.amount*100)}%(${m.remaining})`).join(' ')}`;return p;
  }));
  el('log').textContent=battle.log.slice(-15).join('\n');
  const command=el<HTMLSelectElement>('command'),previous=command.value;
  command.innerHTML=current?options(Object.fromEntries(commandsFor(current).map(c=>[c,`${skills[c].name} MP${skills[c].cost}`]))):'';
  if(Array.from(command.options).some(o=>o.value===previous))command.value=previous;
  el<HTMLButtonElement>('step').disabled=!!battle.result;
 }
 el('inflict').onclick=()=>{const id=value('status') as StatusId;const ok=battle.applyStatus(value('target'),id,Number(value('chance')),Number(value('turns')));notice=`${statusDefinitions[id].name}：${ok?'付与成功（再付与は残り時間を長い方へ更新）':'付与失敗'}`;render()};
 el('clear').onclick=()=>{battle.clearStatus(value('target'));notice='選択対象の全状態異常を解除しました。';render()};
 el('modify').onclick=()=>{notice=battle.applyModifier(value('target'),{stat:value('stat') as Stat,amount:Number(value('amount')),turns:Number(value('turns'))})?'能力補正を付与しました。同符号は加算・75%上限、持続は長い方へ更新。':'付与できません。';render()};
 el('clear-modifiers').onclick=()=>{battle.units.find(u=>u.id===value('target'))!.modifiers=[];notice='能力補正を解除しました。';render()};
 el('element-apply').onclick=()=>{const element=value('element') as Element;if(battle.current){battle.current.attackElement=element;battle.units.find(u=>u.id===value('target'))!.affinities[element]=Number(value('affinity'));notice=`${ELEMENTS[element]}属性を設定。攻撃対象も同じ対象欄で選択してください。`}render()};
 el('step').onclick=()=>{const result=battle.blocked?battle.skipTurn():battle.phase==='enemy'?battle.enemyAct():battle.act(value('command') as Command,value('target'));notice=result.ok?result.event.logs.join(' '):result.reason;render()};
 el('reset').onclick=()=>{battle=new Battle();notice='新しい検証戦闘に戻しました。';render()};
 el('xp').onclick=()=>{for(const h of Object.values(xp))gainExperience(h,120);el('growth').textContent=heroes.map(h=>{const u=growUnit(cloneUnit(h),xp[h.id]);return `${u.name} Lv.${u.level} EXP ${xp[h.id].experience} HP ${u.maxHp} MP ${u.maxMp} 攻${u.attack} 防${u.defense} 速${u.speed}`}).join(' ／ ');notice='各人に経験値120を付与しました（本編には保存しません）。';render()};
 el('back').onclick=onBack;render();
}
