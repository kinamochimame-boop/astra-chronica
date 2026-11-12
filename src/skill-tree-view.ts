import {treeNodes,treeBranches,treeNode} from './data/skill-tree';
import {HERO_IDS,type HeroId} from './data/weapons';
import {heroes} from './data/combat';
import {totalSP,remainingSP,acquireReason,acquireNode} from './skill-tree';
import type {Progress} from './save';
import './skill-tree.css';
export function mountSkillTree(host:HTMLElement,p:Progress,persist:()=>boolean,onBack:()=>void){
 let hero:HeroId='astel',branch='sword',selected=treeNodes[0].id,notice='';
 function render(){
  const level=p.party[hero].level,nodes=treeNodes.filter(n=>n.hero===hero&&n.branch===branch),node=treeNode(selected)!,learned=p.skillTree[hero];
  host.classList.add('skill-tree-screen');host.innerHTML=`<p class="eyebrow">STAR VEINS</p><h1>星脈スキルツリー</h1><nav class="tree-heroes" aria-label="育成キャラクター"></nav><p class="tree-sp" role="status"></p><nav class="tree-branches" aria-label="育成系統"></nav><p class="tree-direction"></p><p class="tree-legend">✓ 習得済み　◇ 習得可能　🔒 未解放</p><div class="tree-map" aria-label="ノードツリー"><svg viewBox="0 0 280 500" preserveAspectRatio="none" aria-hidden="true"></svg><div class="tree-node-grid"></div></div><section class="tree-detail" aria-label="選択ノードの詳細"><h2></h2><p class="tree-description"></p><p class="tree-requirements"></p><p class="tree-reason" role="status"></p><button id="tree-acquire" class="primary">習得する（1SP）</button></section><p id="tree-notice" role="status"></p><p class="hint">本編ATBでは最大MP・星力獲得・MP軽減の強化も技CT／EPコストに反映します（暫定対応は仕様書参照）。SPはLv2以降、1レベルにつき2。取得済みIDから残りを計算します。各ノードはランク1で、習得の取り消しは今回ありません。</p><button id="tree-back" class="secondary">ホームへ戻る</button>`;
  const get=<T extends HTMLElement=HTMLElement>(q:string)=>host.querySelector<T>(q)!;
  for(const id of HERO_IDS){const b=document.createElement('button');b.textContent=heroes.find(h=>h.id===id)!.name;b.setAttribute('aria-pressed',String(hero===id));b.onclick=()=>{hero=id;branch=treeBranches.find(b=>b.hero===id)!.id;selected=treeNodes.find(n=>n.hero===id&&n.branch===branch)!.id;notice='';render()};get('.tree-heroes').append(b)}
  get('.tree-sp').textContent=`${heroes.find(h=>h.id===hero)!.name} Lv.${level} ｜ 残りSP ${remainingSP(p.skillTree,hero,level)} / 累計 ${totalSP(level)} ｜ 習得 ${learned.length} / 30`;
  for(const item of treeBranches.filter(b=>b.hero===hero)){const b=document.createElement('button');b.textContent=item.name;b.setAttribute('aria-pressed',String(branch===item.id));b.onclick=()=>{branch=item.id;selected=treeNodes.find(n=>n.hero===hero&&n.branch===branch)!.id;notice='';render()};get('.tree-branches').append(b)}
  get('.tree-direction').textContent=treeBranches.find(b=>b.hero===hero&&b.id===branch)!.description;
  for(const n of nodes){
   for(const id of n.requires){const from=treeNode(id)!;const line=document.createElementNS('http://www.w3.org/2000/svg','line');for(const [k,v] of Object.entries({x1:from.x,y1:from.y,x2:n.x,y2:n.y}))line.setAttribute(k,String(v));line.setAttribute('class',learned.includes(n.id)?'learned':'');get('svg').append(line)}
   const done=learned.includes(n.id),reason=acquireReason(p.skillTree,hero,level,n.id),state=done?'learned':reason?'locked':'available';
   const button=document.createElement('button');button.className=`tree-node ${state}`;button.dataset.nodeId=n.id;button.dataset.state=state;button.setAttribute('aria-pressed',String(selected===n.id));button.setAttribute('aria-label',`${n.name}：${done?'習得済み':reason?'未解放':'習得可能'}`);
   button.innerHTML=`<strong>${done?'✓':reason?'🔒':'◇'} ${n.name}</strong><small>Lv.${n.level} · ${n.cost}SP</small>`;
   button.onclick=()=>{selected=n.id;notice='';render();get('.tree-detail').scrollIntoView({block:'nearest'})};get('.tree-node-grid').append(button);
  }
  get('.tree-detail h2').textContent=node.name;get('.tree-description').textContent=node.description;
  get('.tree-requirements').textContent=`必要Lv.${node.level} ｜ ${node.cost}SP ｜ 最大ランク${node.maxRank} ｜ 前提：${node.requires.map(id=>treeNode(id)!.name).join('・')||'なし'}`;
  const reason=acquireReason(p.skillTree,hero,level,node.id);get('.tree-reason').textContent=reason||'習得可能。内容を確認してから習得してください。';
  const acquire=get<HTMLButtonElement>('#tree-acquire');acquire.disabled=!!reason;acquire.onclick=()=>{if(!acquireNode(p.skillTree,hero,p.party[hero].level,node.id))return;notice=persist()?`${node.name}を習得し、保存しました。`:`${node.name}を習得しましたが保存できません。再読込すると保存前の状態へ戻ります。`;render()};
  get('#tree-notice').textContent=notice;get('#tree-back').onclick=()=>{host.classList.remove('skill-tree-screen');onBack()};
 }
 render();
}
