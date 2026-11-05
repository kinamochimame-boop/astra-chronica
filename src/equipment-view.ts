import {withSkillTree} from './skill-tree';
import {heroes,cloneUnit} from './data/combat';
import {HERO_IDS,WEAPON_FAMILIES,allWeapons,weaponById,type HeroId} from './data/weapons';
import {equipReason,equipWeapon,equippedUnit,equippedWeapon,unlockTestWeapons} from './equipment';
import {growUnit} from './progression';
import type {Progress} from './save';
import './equipment.css';
/** Out-of-battle screen only. Battle receives its own derived copies on start. */
export function mountEquipment(host:HTMLElement,progress:Progress,persist:()=>boolean,onBack:()=>void){
 let hero:HeroId='astel',candidate:string|null=progress.equipment.equipped.astel,notice='';
 const state=progress.equipment;
 const write=(message:string)=>{notice=message+(persist()?'（保存済み）':'（保存できません。現在の装備はこの画面内で有効です）');render()};
 function render(){
  const template=heroes.find(h=>h.id===hero)!,base=growUnit(cloneUnit(template),progress.party[hero]);
  const current=withSkillTree(equippedUnit(base,state.equipped[hero]),progress.skillTree[hero]),next=withSkillTree(equippedUnit(base,candidate),progress.skillTree[hero]),weapon=weaponById(candidate);
  const reason=equipReason(state,hero,candidate),same=candidate===state.equipped[hero];
  host.classList.add('equipment-screen');
  host.innerHTML=`<p class="eyebrow">EQUIPMENT</p><h1>星旅の装備</h1><p class="hint">装備は戦闘外で変更できます。所持数には装備中の分も含みます。</p><nav class="equipment-heroes" aria-label="装備キャラクター"></nav>
  <section class="equipment-current"><h2>${template.name} Lv.${base.level}の現在装備</h2><p id="equipment-current-name"></p></section>
  <h2>所持武器・武器図鑑</h2><div class="weapon-list" role="group" aria-label="武器選択"></div>
  <section class="equipment-preview"><h2>装備前 → 装備後</h2><p id="equipment-selected"></p><table><caption>能力値比較（星脈を含む・一時補正を除く）</caption><thead><tr><th>能力</th><th>現在</th><th>変更後</th><th>差分</th></tr></thead><tbody></tbody></table><p id="equipment-description"></p><p id="equipment-reason" role="status"></p><button id="equipment-equip" class="primary">装備する</button><button id="equipment-remove" class="secondary">装備を解除</button></section>
  <p id="equipment-notice" role="status"></p><details class="equipment-test"><summary>装備検証用の武器解放</summary><p>9種類を各1個以上所持できるようにします。戦績・レベルは変わりません。追加分は本編の所持品として保存されます。繰り返しても増殖しません。</p><button id="equipment-unlock" class="secondary">検証用武器9種を解放・保存</button></details><button id="equipment-back" class="secondary">ホームへ戻る</button>`;
  const get=<T extends HTMLElement=HTMLElement>(selector:string)=>host.querySelector<T>(selector)!;
  for(const id of HERO_IDS){const button=document.createElement('button');button.textContent=heroes.find(h=>h.id===id)!.name;button.setAttribute('aria-pressed',String(hero===id));button.onclick=()=>{hero=id;candidate=state.equipped[id];render()};get('.equipment-heroes').append(button)}
  get('#equipment-current-name').textContent=weaponById(current.weaponId)?.name??'装備なし';
  for(const w of allWeapons){
   const card=document.createElement('button');card.className='weapon-choice';card.dataset.weaponId=w.id;card.setAttribute('aria-pressed',String(candidate===w.id));
   const used=HERO_IDS.filter(id=>state.equipped[id]===w.id).length,why=equipReason(state,hero,w.id);
   // Unusable weapons remain inspectable; the equip action below is disabled with a reason.
   card.textContent=`◇ ${w.name} ｜ ${WEAPON_FAMILIES[w.family]}\n所持${state.inventory[w.id]??0}（装備中${used}）${why?' · '+why:''}`;
   card.onclick=()=>{candidate=w.id;render()};get('.weapon-list').append(card);
  }
  get('#equipment-selected').textContent=`選択：${weapon?.name??'装備なし'}`;
  const rate=(u:typeof base,key:'healingRate'|'magicRate')=>Math.round(((equippedWeapon(u)?.effects[key]??1)-1)*100);
  const rows:[string,number,number,string][]=[['攻撃力',current.attack,next.attack,''],['防御力',current.defense,next.defense,''],['素早さ',current.speed,next.speed,''],['最大HP',current.maxHp,next.maxHp,''],['回復量補正',rate(current,'healingRate'),rate(next,'healingRate'),'%'],['属性魔法補正',rate(current,'magicRate'),rate(next,'magicRate'),'%']];
  for(const [name,before,after,suffix] of rows){const row=document.createElement('tr');row.dataset.stat=name;for(const value of [name,`${before}${suffix}`,`${after}${suffix}`,`${after-before>0?'+':''}${after-before}${suffix}`]){const cell=document.createElement('td');cell.textContent=value;row.append(cell)}get('tbody').append(row)}
  get('#equipment-description').textContent=weapon?.description??'武器補正と武器特性がなくなります。';
  get('#equipment-reason').textContent=reason||(same?'現在装備中です':'装備できます');
  const equip=get<HTMLButtonElement>('#equipment-equip');equip.disabled=!!reason||same;equip.onclick=()=>{if(equipWeapon(state,hero,candidate))write('装備を変更しました。')};
  const remove=get<HTMLButtonElement>('#equipment-remove');remove.disabled=state.equipped[hero]===null;remove.onclick=()=>{equipWeapon(state,hero,null);candidate=null;write('装備を解除しました。')};
  get('#equipment-notice').textContent=notice;
  get('#equipment-unlock').onclick=()=>{const changed=unlockTestWeapons(state);write(changed?'検証用武器を解放しました。':'9種類はすべて所持済みです。')};
  get('#equipment-back').onclick=()=>{host.classList.remove('equipment-screen');onBack()};
 }
 render();return ()=>host.classList.remove('equipment-screen');
}
