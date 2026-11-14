import {heroes,cloneUnit} from './data/combat';
import {HERO_IDS,weaponById,type HeroId} from './data/weapons';
import {treeNode,type TreeStat} from './data/skill-tree';
import {equipReason,equippedUnit} from './equipment';
import {growUnit} from './progression';
import {normalizeHeroNodes,totalSP,withSkillTree} from './skill-tree';
import type {Progress} from './save';

export const BUILD_SLOTS=3;
export const BUILD_NAME_LIMIT=24;
export interface GrowthBuild {name:string;nodes:string[];weaponId:string|null;saved:boolean;invalid?:'nodes'|'weapon'|'format'}
export type GrowthBuilds=Record<HeroId,GrowthBuild[]>;
export interface GrowthContext {inBattle:boolean}
export type GrowthResult={ok:true}|{ok:false;reason:string};
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const slotValid=(i:number)=>Number.isInteger(i)&&i>=0&&i<BUILD_SLOTS;
export function buildName(value:unknown,index:number){
 const clean=typeof value==='string'?value.normalize('NFC').replace(/[\p{Cc}\p{Cf}<>]/gu,'').trim():'';
 return Array.from(clean).slice(0,BUILD_NAME_LIMIT).join('')||`ビルド${index+1}`;
}
export function initialBuilds():GrowthBuilds{
 const slots=():GrowthBuild[]=>Array.from({length:BUILD_SLOTS},(_,i)=>({name:buildName('',i),nodes:[],weaponId:null,saved:false}));
 return {astel:slots(),rina:slots(),mei:slots()};
}
/** Validate identity, not current ownership/level. Temporarily unusable presets remain available later.
 * Corrupt snapshots are marked unusable, never silently turned into a partial usable build. */
export function normalizeBuilds(raw:unknown):GrowthBuilds{
 const result=initialBuilds();if(!object(raw))return result;
 for(const hero of HERO_IDS){const entries=raw[hero];if(!Array.isArray(entries))continue;
  for(let i=0;i<BUILD_SLOTS;i++){const v=entries[i];if(!object(v))continue;
   const slot=result[hero][i];slot.name=buildName(v.name,i);
   if(v.saved!==true)continue;
   slot.saved=true;
   if(v.invalid==='nodes'||v.invalid==='weapon'||v.invalid==='format')slot.invalid=v.invalid;
   if(!Array.isArray(v.nodes)||v.nodes.length>30)slot.invalid='nodes';
   const seen=new Set<string>();
   for(const id of (Array.isArray(v.nodes)?v.nodes:[]).slice(0,31)){
    if(typeof id!=='string'||treeNode(id)?.hero!==hero||seen.has(id)){slot.invalid='nodes';continue}
    seen.add(id);slot.nodes.push(id);
   }
   if(v.weaponId===null)slot.weaponId=null;
   else if(typeof v.weaponId==='string'&&weaponById(v.weaponId)?.owner===hero)slot.weaponId=v.weaponId;
   else slot.invalid='weapon';
  }
 }return result;
}
export const buildsFor=(p:Progress)=>p.builds??initialBuilds();
function actionReason(hero:HeroId,index:number|undefined,context:GrowthContext){
 if(context.inBattle)return '戦闘中は育成構成を変更できません';
 if(!HERO_IDS.includes(hero))return 'キャラクターが不正です';
 if(index!==undefined&&!slotValid(index))return 'ビルドは3枠までです';
 return '';
}
export function snapshotReason(p:Progress,hero:HeroId,build:GrowthBuild):string{
 if(!build.saved)return 'まだ保存されていません';
 if(build.invalid)return '保存されたノードまたは武器データが不正です。現在の構成で上書きしてください';
 if(!Array.isArray(build.nodes)||build.nodes.length>30)return 'ノードデータが不正です';
 const ids=new Set<string>(),level=p.party[hero].level;let spent=0;
 for(const id of build.nodes){const node=treeNode(id);if(!node||node.hero!==hero||ids.has(id))return '不正なノードIDまたは重複があります';ids.add(id);spent+=node.cost;if(level<node.level)return `${node.name}にはLv.${node.level}が必要です`;}
 for(const id of ids)if(!treeNode(id)!.requires.every(required=>ids.has(required)))return '前提ノードが不足しています';
 if(spent>totalSP(level))return 'SP不足です（現在の構成を置き換えても総SPが足りません）';
 if(normalizeHeroNodes(build.nodes,hero,level).length!==ids.size)return 'ノードの条件を満たしていません';
 if(build.weaponId!==null&&typeof build.weaponId!=='string')return '武器データが不正です';
 return equipReason(p.equipment,hero,build.weaponId);
}
export function buildReason(p:Progress,hero:HeroId,index:number,context:GrowthContext){
 return actionReason(hero,index,context)||snapshotReason(p,hero,buildsFor(p)[hero][index]);
}
export function saveBuild(p:Progress,hero:HeroId,index:number,context:GrowthContext):GrowthResult{
 const reason=actionReason(hero,index,context);if(reason)return {ok:false,reason};
 const next:GrowthBuild={name:buildsFor(p)[hero][index].name,nodes:[...p.skillTree[hero]],weaponId:p.equipment.equipped[hero],saved:true};
 const invalid=snapshotReason(p,hero,next);if(invalid)return {ok:false,reason:invalid};
 const library=normalizeBuilds(p.builds);library[hero][index]=next;p.builds=library;return {ok:true};
}
export function renameBuild(p:Progress,hero:HeroId,index:number,name:string,context:GrowthContext):GrowthResult{
 const reason=actionReason(hero,index,context);if(reason)return {ok:false,reason};
 const library=normalizeBuilds(p.builds);library[hero][index].name=buildName(name,index);p.builds=library;return {ok:true};
}
/** Validation finishes before either active field changes. SP/quantities are never stored or granted here. */
export function applyBuild(p:Progress,hero:HeroId,index:number,context:GrowthContext):GrowthResult{
 const reason=buildReason(p,hero,index,context);if(reason)return {ok:false,reason};
 const build=buildsFor(p)[hero][index],nodes=normalizeHeroNodes(build.nodes,hero,p.party[hero].level);
 p.skillTree[hero]=nodes;p.equipment.equipped[hero]=build.weaponId;return {ok:true};
}
export function resetTree(p:Progress,hero:HeroId,confirmed:boolean,context:GrowthContext):GrowthResult{
 const reason=actionReason(hero,undefined,context);if(reason)return {ok:false,reason};
 if(!confirmed)return {ok:false,reason:'振り直しの確認が必要です'};
 p.skillTree[hero]=[];return {ok:true};
}
export const GROWTH_STATS:readonly [TreeStat,string][]=[['maxHp','最大HP'],['maxMp','最大MP'],['attack','攻撃力'],['defense','防御力'],['speed','素早さ']];
/** Same grow -> equip -> tree pipeline as Battle; differences include conditional bow/HP synergy. */
export function growthStats(p:Progress,hero:HeroId,nodes=p.skillTree[hero],weaponId=p.equipment.equipped[hero]){
 const base=growUnit(cloneUnit(heroes.find(u=>u.id===hero)!),p.party[hero]),equipment=equippedUnit(base,weaponId),unit=withSkillTree(equipment,nodes);
 return {unit,rows:GROWTH_STATS.map(([id,name])=>({id,name,base:base[id],equipment:equipment[id]-base[id],tree:unit[id]-equipment[id],total:unit[id]}))};
}
/** Synchronous UI transaction. Failed persistence rolls back all in-memory fields as well. */
export function growthTransaction(p:Progress,persist:()=>boolean,action:()=>GrowthResult):GrowthResult{
 const before=structuredClone(p),result=action();if(!result.ok)return result;
 let saved=false;try{saved=persist()}catch{/* Storage failure must not be reported as success. */}
 if(saved)return result;
 Object.assign(p,before);if(!before.builds)delete p.builds;
 return {ok:false,reason:'保存できなかったため、変更を取り消しました'};
}
