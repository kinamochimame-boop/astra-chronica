import type {Progress} from './save';
import {mountCompass} from './adventure-compass-view';
import {adventureCompass,questStatus} from './adventure-compass';
import {heroes} from './data/combat';
import {weaponById,type HeroId} from './data/weapons';
import {remainingSP} from './skill-tree';
export interface DashboardActions {tree?:()=>void;equipment?:()=>void;builds?:()=>void;quests?:()=>void}
export function mountDashboard(host:HTMLElement,p:Progress,resume:()=>void,actions:DashboardActions={}){
 const d=adventureCompass(p);mountCompass(host,p,true);
 const button=(parent:HTMLElement,name:string,action:()=>void,cls='secondary')=>{const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=name;b.onclick=()=>{if(b.isConnected){b.focus({preventScroll:true});action()}};parent.append(b);return b};
 button(host,'冒険を再開',resume,'primary').id='adventure-resume';
 if(d.tracked){const track=document.createElement('aside');track.className='dashboard-tracking';track.setAttribute('aria-label','追跡中の依頼');const h=document.createElement('h2'),text=document.createElement('p');h.textContent=`依頼：${d.tracked.name}`;text.textContent=d.trackedGuide??'';track.append(h,text);if(actions.quests)button(track,'追跡中の依頼を開く',actions.quests);host.append(track)}
 const party=document.createElement('section');party.className='dashboard-party';party.setAttribute('aria-label','パーティ状況');
 for(const h of heroes){const id=h.id as HeroId,card=document.createElement('article'),title=document.createElement('h2'),text=document.createElement('p');title.textContent=`${h.name} Lv.${p.party[id].level}`;text.textContent=`${weaponById(p.equipment.equipped[id])?.name??'装備なし'} ／ 残りSP ${remainingSP(p.skillTree,id,p.party[id].level)}`;card.append(title,text);party.append(card)}host.append(party);
 const growth=document.createElement('nav');growth.className='home-growth';growth.setAttribute('aria-label','装備と育成');for(const [name,action] of [['装備',actions.equipment],['スキルツリー',actions.tree],['育成ビルド',actions.builds]] as const)if(action)button(growth,name,action);host.append(growth);
 const quests=document.createElement('details');quests.className='dashboard-quests';const summary=document.createElement('summary');summary.textContent=`依頼の状況（${d.quests.length}件）`;quests.append(summary);for(const q of d.quests){const text=document.createElement('p');text.textContent=`${q.name}：${questStatus(p,q)}`;quests.append(text)}if(!d.quests.length){const text=document.createElement('p');text.textContent='冒険を進めると依頼が解放されます。';quests.append(text)}host.append(quests);
}
