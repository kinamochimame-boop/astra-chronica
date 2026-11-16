import {heroes} from './data/combat';
import {HERO_IDS,weaponById} from './data/weapons';
import {growthStats} from './growth-builds';
import {remainingSP} from './skill-tree';
import type {Progress} from './save';
/** Fresh derived rows; equipment, level and tree calculations stay in growthStats. */
export function partyGrowth(p:Progress){return HERO_IDS.map(id=>({id,name:heroes.find(h=>h.id===id)!.name,level:p.party[id].level,sp:remainingSP(p.skillTree,id,p.party[id].level),weapon:weaponById(p.equipment.equipped[id])?.name??'装備なし',stats:growthStats(p,id)}))}
export function mountGrowthComparison(host:HTMLElement,p:Progress){
 const party=partyGrowth(p),details=document.createElement('details');details.className='party-growth-comparison';
 const summary=document.createElement('summary');summary.textContent='3人の装備・能力を比較';details.append(summary);
 const table=document.createElement('table');const caption=document.createElement('caption');caption.textContent='現在のレベル・装備・星脈（一時補正なし）';table.append(caption);
 const head=document.createElement('thead'),names=document.createElement('tr');for(const name of ['能力',...party.map(h=>h.name)]){const th=document.createElement('th');th.textContent=name;names.append(th)}head.append(names);table.append(head);
 const body=document.createElement('tbody');const row=(name:string,values:(string|number)[])=>{const tr=document.createElement('tr');for(const v of [name,...values]){const td=document.createElement('td');td.textContent=String(v);tr.append(td)}body.append(tr)};
 row('レベル',party.map(h=>h.level));row('残りSP',party.map(h=>h.sp));row('武器',party.map(h=>h.weapon));
 for(const [i,r] of party[0].stats.rows.entries())row(r.name,party.map(h=>h.stats.rows[i].total));
 table.append(body);details.append(table);host.append(details);return details;
}
