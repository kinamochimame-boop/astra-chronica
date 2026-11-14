import {treeNode} from './data/skill-tree';
import {weaponById,type HeroId} from './data/weapons';
import {heroes} from './data/combat';
import {remainingSP,totalSP} from './skill-tree';
import {attackInterval} from './atb-rules';
import {applyBuild,buildReason,buildsFor,growthStats,growthTransaction,renameBuild,resetTree,saveBuild,BUILD_NAME_LIMIT,type GrowthResult} from './growth-builds';
import type {Progress} from './save';
import './growth-builds.css';
export interface GrowthViewState {index?:number;notice?:string;panelOpen?:boolean;overviewOpen?:boolean;comparisonOpen?:boolean}
export interface GrowthViewOptions {state?:GrowthViewState;inBattle?:()=>boolean;onTree?:()=>void;onEquipment?:()=>void}
const signed=(n:number)=>n>0?'+'+n:String(n);
/** Shared by tree and equipment; snapshots contain IDs only, not derived bonuses or inventory. */
export function mountBuildManager(host:HTMLElement,p:Progress,hero:HeroId,persist:()=>boolean,onChanged:()=>void,options:GrowthViewOptions={}){
 const state=options.state??{};let index=state.index??0,notice=state.notice??'';const context=()=>({inBattle:options.inBattle?.()??false});
 const heroName=heroes.find(h=>h.id===hero)!.name;
 function render(){
  host.className='growth-manager';host.setAttribute('aria-label',heroName+'の育成ビルド');
  host.innerHTML=`<details class="growth-overview"><summary>育成効果・能力内訳</summary><p class="growth-budget"></p><p class="growth-weapon"></p><table><caption>レベル成長＋装備＋星脈（一時補正なし）</caption><thead><tr><th>能力</th><th>基礎</th><th>装備</th><th>星脈</th><th>合計</th></tr></thead><tbody></tbody></table><p class="growth-special"></p><p class="growth-ct"></p></details><details class="growth-panel"><summary>ビルド管理・比較・振り直し</summary><nav class="growth-slots" aria-label="ビルド枠"></nav><label>ビルド名（24文字まで）<input class="growth-name" type="text" maxlength="48" autocomplete="off"></label><button class="growth-rename secondary">名前を保存</button><p class="growth-snapshot"></p><div class="growth-actions"><button class="growth-save secondary">現在の構成を保存</button><button class="growth-apply primary">このビルドを適用</button></div><p class="growth-reason" role="status"></p><details class="growth-comparison"><summary>現在の構成と比較</summary><div class="growth-comparison-body"></div></details><button class="growth-reset secondary">スキルを振り直す（無料）</button><p class="hint">振り直しは選択中の1人のみ。装備・所持品・レベル・経験値・保存済みビルドは維持します。</p><div class="growth-links"></div></details><p class="growth-notice" role="status"></p><dialog class="growth-confirm"><h2>スキル振り直しの確認</h2><p></p><button class="growth-confirm-yes primary">振り直しを実行</button><button class="growth-confirm-no secondary">やめる</button></dialog>`;
  const get=<T extends HTMLElement=HTMLElement>(q:string)=>host.querySelector<T>(q)!;
  const level=p.party[hero].level,total=totalSP(level),remaining=remainingSP(p.skillTree,hero,level),current=growthStats(p,hero);
  get('.growth-budget').textContent=`${heroName} Lv.${level} ｜ 総SP ${total} ／ 使用SP ${total-remaining} ／ 残りSP ${remaining}`;
  get('.growth-weapon').textContent='現在の武器：'+(weaponById(p.equipment.equipped[hero])?.name??'装備なし');
  for(const row of current.rows){const tr=document.createElement('tr');tr.dataset.growthStat=row.id;for(const value of [row.name,row.base,signed(row.equipment),signed(row.tree),row.total]){const td=document.createElement('td');td.textContent=String(value);tr.append(td)}get('.growth-overview tbody').append(tr)}
  get('.growth-special').textContent=specials(p.skillTree[hero],p.equipment.equipped[hero]);
  get('.growth-ct').textContent=`通常攻撃CT ${attackInterval(current.unit).toFixed(2)}秒（現在の武器・実効SPD、1倍速）。戦闘中の一時補正は別途反映されます。`;
  renderSelection();
  function renderSelection(){
   const slots=buildsFor(p)[hero],slot=slots[index],reason=buildReason(p,hero,index,context());
   get('.growth-slots').replaceChildren();
   for(const [i,s] of slots.entries()){const b=document.createElement('button');b.type='button';b.textContent=`${i+1}. ${s.name}${s.saved?' ✓':'（未保存）'}`;b.dataset.buildSlot=String(i);b.setAttribute('aria-pressed',String(index===i));b.onclick=()=>{index=i;renderSelection()};get('.growth-slots').append(b)}
   get<HTMLInputElement>('.growth-name').value=slot.name;
   get('.growth-snapshot').textContent=slot.saved?`${slot.name}：${slot.nodes.length}ノード ／ 武器 ${weaponById(slot.weaponId)?.name??'装備なし'}`:'この枠にはまだ育成構成が保存されていません。';
   get('.growth-reason').textContent=reason||'現在のレベル・総SP・所持武器で適用できます。現在の全ノードを置き換えます。';
   get<HTMLButtonElement>('.growth-apply').disabled=!!reason;
   get<HTMLButtonElement>('.growth-save').disabled=context().inBattle;
   get<HTMLButtonElement>('.growth-rename').disabled=context().inBattle;
   get('.growth-rename').onclick=()=>write(()=>renameBuild(p,hero,index,get<HTMLInputElement>('.growth-name').value,context()),'ビルド名を保存しました。');
   get('.growth-save').onclick=()=>{
    if(slot.saved){const dialog=get<HTMLDialogElement>('.growth-confirm');get('.growth-confirm h2').textContent='ビルド上書きの確認';get('.growth-confirm p').textContent=`「${slot.name}」を現在の構成で上書きします。武器やSPは増えません。`;get('.growth-confirm-yes').textContent='上書きを実行';get('.growth-confirm-yes').onclick=()=>{dialog.close();write(()=>saveBuild(p,hero,index,context()),'現在の構成をビルドに保存しました。')};dialog.showModal();}
    else write(()=>saveBuild(p,hero,index,context()),'現在の構成をビルドに保存しました。');
   };
   get('.growth-apply').onclick=()=>write(()=>applyBuild(p,hero,index,context()),'ビルドを一括適用して保存しました。');
   const body=get('.growth-comparison-body');body.replaceChildren();
   const info=document.createElement('p');info.textContent=`武器 ${weaponById(p.equipment.equipped[hero])?.name??'装備なし'} → ${weaponById(slot.weaponId)?.name??'装備なし'} ／ 現在：${p.skillTree[hero].length}ノード・使用${total-remaining}SP ／ 保存：${slot.nodes.length}ノード・使用${slot.nodes.reduce((s,id)=>s+(treeNode(id)?.cost??0),0)}SP`;body.append(info);
   if(reason){const unavailable=document.createElement('p');unavailable.textContent='適用不可：'+reason;body.append(unavailable)}else{
    const next=growthStats(p,hero,slot.nodes,slot.weaponId),table=document.createElement('table');table.innerHTML='<caption>現在 → 保存ビルド（現在レベルで算出）</caption><thead><tr><th>能力</th><th>現在</th><th>ビルド</th><th>差</th></tr></thead><tbody></tbody>';
    for(const [i,row] of next.rows.entries()){const tr=document.createElement('tr');tr.dataset.buildStat=row.id;for(const v of [row.name,current.rows[i].total,row.total,signed(row.total-current.rows[i].total)]){const td=document.createElement('td');td.textContent=String(v);tr.append(td)}table.querySelector('tbody')!.append(tr)}body.append(table);
    const effects=document.createElement('p');effects.textContent=specials(slot.nodes,slot.weaponId);body.append(effects);
   }
  }
  get('.growth-reset').onclick=()=>{
   const dialog=get<HTMLDialogElement>('.growth-confirm');get('.growth-confirm h2').textContent='スキル振り直しの確認';get('.growth-confirm p').textContent=`${heroName}の習得ノードをすべて解除し、${total-remaining}SPを全額返却します。無料です。保存済みビルドは残ります。`;
   get('.growth-confirm-yes').textContent='振り直しを実行';get('.growth-confirm-yes').onclick=()=>{dialog.close();write(()=>resetTree(p,hero,true,context()),'スキルを振り直し、使用SPを全額返却しました。')};dialog.showModal();
  };
  get<HTMLButtonElement>('.growth-reset').disabled=context().inBattle;
  get('.growth-confirm-no').onclick=()=>get<HTMLDialogElement>('.growth-confirm').close();
  for(const [label,callback] of [['装備画面で武器を変更',options.onEquipment],['スキルツリーで育成',options.onTree]] as const)if(callback){const b=document.createElement('button');b.className='secondary';b.textContent=label;b.onclick=callback;get('.growth-links').append(b)}
  get('.growth-notice').textContent=notice;
  get<HTMLDetailsElement>('.growth-panel').open=state.panelOpen??false;get<HTMLDetailsElement>('.growth-overview').open=state.overviewOpen??false;get<HTMLDetailsElement>('.growth-comparison').open=state.comparisonOpen??false;
 }
 function write(action:()=>GrowthResult,success:string){
  const result=growthTransaction(p,persist,action);notice=result.ok?success:result.reason;state.index=index;state.notice=notice;state.panelOpen=host.querySelector<HTMLDetailsElement>('.growth-panel')!.open;state.overviewOpen=host.querySelector<HTMLDetailsElement>('.growth-overview')!.open;state.comparisonOpen=host.querySelector<HTMLDetailsElement>('.growth-comparison')!.open;
  if(result.ok){onChanged();return}render();
 }
 render();
}
function specials(nodes:string[],weapon:string|null){return ['特殊効果：',weaponById(weapon)?.description??'装備効果なし',...nodes.map(treeNode).filter(n=>n&&n.effect.kind!=='stat').map(n=>`${n!.name}：${n!.description}`)].join(' ／ ')}
