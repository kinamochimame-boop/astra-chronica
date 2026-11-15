import {load,SAVE_KEY,type Progress} from './save';
import {PROGRESSION,requiredExperience} from './progression';
import {HERO_IDS} from './data/weapons';
import {normalizeAdventure} from './adventure';
import {normalizeEquipment} from './equipment';
import {normalizeSkillTree} from './skill-tree';
import {normalizeConsumables} from './consumables';
import {normalizeQuests} from './side-quests';
import {normalizeChoices} from './dialogue-choices';
import {normalizeBuilds} from './growth-builds';
import {normalizeSurveyHistory} from './exploration/survey-save';
import {normalizeTrackedQuest} from './adventure-compass';
import {mapById,walkMaps} from './exploration/map-data';
import {normalizeWorld,mapOpen} from './exploration/exploration-save';
export const MAX_BACKUP_NODES=walkMaps.reduce((sum,map)=>sum+2*map.width*map.height,50000);
export const BACKUP_GAME='astra-chronica',BACKUP_FORMAT=1,MAX_BACKUP_BYTES=2*1024*1024,PRE_IMPORT_KEY='astra-chronica:before-import:v1';
export interface Backup {game:typeof BACKUP_GAME;formatVersion:1;createdAt:string;progress:Progress}
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
function fail(message:string):never{throw new Error(message)}
/** Bounded traversal runs before any normalizer. No property copying from untrusted objects. */
function inspect(root:unknown){let nodes=0;const stack:[unknown,number][]=[[root,0]];while(stack.length){const [v,depth]=stack.pop()!;if(++nodes>MAX_BACKUP_NODES||depth>24)fail('データ構造が大きすぎるか深すぎます');if(typeof v==='number'&&(!Number.isFinite(v)||Math.abs(v)>Number.MAX_SAFE_INTEGER))fail('不正な数値です');if(typeof v==='string'&&v.length>200000)fail('文字列が長すぎます');if(v&&typeof v==='object'){for(const key of Object.keys(v)){if(['__proto__','prototype','constructor'].includes(key))fail('安全でないキーを含みます');stack.push([(v as Record<string,unknown>)[key],depth+1])}}}}
function equivalent(a:unknown,b:unknown):boolean{if(a===b)return true;if(Array.isArray(a)&&Array.isArray(b)){if(a.length!==b.length)return false;if(a.every(x=>typeof x!=='object')&&b.every(x=>typeof x!=='object')){const left=[...a].sort(),right=[...b].sort();return left.every((x,i)=>x===right[i])}return a.every((x,i)=>equivalent(x,b[i]))}if(object(a)&&object(b)){const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>Object.hasOwn(b,k)&&equivalent(a[k],b[k]))}return false}
/** Strict import validation is intentionally separate from load()'s fresh-on-corruption fallback. */
export function validateProgress(raw:unknown):Progress {
 inspect(raw);if(!object(raw)||raw.version!==2||typeof raw.started!=='boolean'||!Number.isSafeInteger(raw.wins)||Number(raw.wins)<0||!Number.isSafeInteger(raw.battles)||Number(raw.battles)<Number(raw.wins))fail('進行データの必須項目・戦績が不正です');
 const required=['party','equipment','adventure','skillTree','consumables','quests','choices'];for(const key of required)if(!object(raw[key]))fail(`必須データがありません：${key}`);
 const allowed=new Set(['version','started','wins','battles',...required,'world','builds','survey','trackedQuestId']);for(const key of Object.keys(raw))if(!allowed.has(key))fail('未対応の保存項目です');
 const party=raw.party as Progress['party'];if(Object.keys(party).length!==3)fail('パーティが不正です');for(const id of HERO_IDS){const h=party[id];if(!object(h)||!Number.isSafeInteger(h.level)||h.level<1||h.level>PROGRESSION.maxLevel||!Number.isSafeInteger(h.experience)||h.experience<0||h.experience>=requiredExperience(h.level)||h.level===PROGRESSION.maxLevel&&h.experience!==0||Object.keys(h).length!==2)fail('レベル・経験値が不正です')}
 const adventure=normalizeAdventure(raw.adventure),normalized:Record<string,unknown>={party,equipment:normalizeEquipment(raw.equipment),adventure,skillTree:normalizeSkillTree(raw.skillTree,party),consumables:normalizeConsumables(raw.consumables),quests:normalizeQuests(raw.quests,adventure),choices:normalizeChoices(raw.choices,adventure)};
 if(raw.builds!==undefined)normalized.builds=normalizeBuilds(raw.builds);if(raw.survey!==undefined)normalized.survey=normalizeSurveyHistory(raw.survey);
 for(const [key,value] of Object.entries(normalized))if(!equivalent(raw[key],value))fail(`保存内容を安全に復元できません：${key}`);
 if(raw.trackedQuestId!==undefined&&normalizeTrackedQuest(raw.trackedQuestId,{adventure,quests:normalized.quests as Progress['quests']})!==raw.trackedQuestId)fail('追跡中の依頼が不正です');
 if(raw.world!==undefined){if(!object(raw.world)||!mapById(raw.world.mapId)||typeof raw.world.x!=='number'||typeof raw.world.y!=='number'||raw.world.x<0||raw.world.y<0||!['up','down','left','right'].includes(String(raw.world.facing))||!Array.isArray(raw.world.defeated)||!Array.isArray(raw.world.opened))fail('探索位置が不正です');const map=mapById(raw.world.mapId)!;if(!mapOpen(adventure,map)||raw.world.x>map.width*map.tile||raw.world.y>map.height*map.tile)fail('探索位置が範囲外・未解放です');const safe=normalizeWorld(raw.world,adventure,normalized.choices as Progress['choices'])!;for(const key of Object.keys(raw.world)){if(!['mapId','x','y','facing','defeated','opened','returnInfo','event','recovered'].includes(key))fail('探索情報が未対応です');if(['returnInfo','event'].includes(key)&&!equivalent(raw.world[key],safe[key as keyof typeof safe]))fail('探索復帰情報が不正です')}const defeated=new Set(walkMaps.flatMap(m=>m.symbols.map(s=>s.id))),opened=new Set(walkMaps.flatMap(m=>m.objects.filter(o=>o.kind==='chest').map(o=>o.id)));if(raw.world.defeated.some(id=>typeof id!=='string'||!defeated.has(id)||!safe.defeated.includes(id))||raw.world.opened.some(id=>typeof id!=='string'||!opened.has(id)||!safe.opened.includes(id)))fail('探索対象の記録が不正です')}
 // All core fields have passed; this load only performs existing safe-pose/interrupted-battle recovery.
 return load({getItem:()=>JSON.stringify(raw)});
}
export function parseBackup(text:string):Backup {
 if(new TextEncoder().encode(text).byteLength>MAX_BACKUP_BYTES)fail('ファイルは2MiB以下にしてください');let raw:unknown;try{raw=JSON.parse(text)}catch{fail('JSONファイルを読み取れません')};inspect(raw);if(!object(raw)||raw.game!==BACKUP_GAME)fail('アストラクロニカのバックアップではありません');if(raw.formatVersion!==BACKUP_FORMAT)fail('未対応のバックアップ形式です');if(typeof raw.createdAt!=='string'||raw.createdAt.length>40||!Number.isFinite(Date.parse(raw.createdAt)))fail('作成日時が不正です');return {game:BACKUP_GAME,formatVersion:1,createdAt:raw.createdAt,progress:validateProgress(raw.progress)};
}
export function createBackup(p:Progress,date=new Date()):{text:string;filename:string}{const backup:Backup={game:BACKUP_GAME,formatVersion:1,createdAt:date.toISOString(),progress:validateProgress(JSON.parse(JSON.stringify(p)))},text=JSON.stringify(backup);if(new TextEncoder().encode(text).byteLength>MAX_BACKUP_BYTES)fail('バックアップが2MiBを超えています');return {text,filename:`astra-chronica-save-${date.toISOString().slice(0,16).replace(/[-:T]/g,'')}.json`}}
export type BackupStorage=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
/** localStorage single-key writes are atomic. A verified predecessor is protected before promotion. */
export function importBackup(backup:Backup,storage:BackupStorage,confirmed:boolean):{ok:true;progress:Progress}|{ok:false;reason:string}{
 if(!confirmed)return {ok:false,reason:'読み込みを取り消しました'};
 let previous:string|null=null,touched=false;
 try{const next=parseBackup(JSON.stringify(backup)).progress,text=JSON.stringify(next);previous=storage.getItem(SAVE_KEY);const protection=JSON.stringify({previous});storage.setItem(PRE_IMPORT_KEY,protection);if(storage.getItem(PRE_IMPORT_KEY)!==protection)fail('上書き前のセーブを保護できません');touched=true;storage.setItem(SAVE_KEY,text);if(storage.getItem(SAVE_KEY)!==text)fail('保存結果が一致しません');const restored=validateProgress(JSON.parse(storage.getItem(SAVE_KEY)!));return {ok:true,progress:restored};
 }catch(error){let rollbackFailed=false;if(touched)try{if(storage.getItem(SAVE_KEY)!==previous){if(previous===null)storage.removeItem(SAVE_KEY);else storage.setItem(SAVE_KEY,previous)}rollbackFailed=storage.getItem(SAVE_KEY)!==previous}catch{rollbackFailed=true}return {ok:false,reason:rollbackFailed?'保存先に異常があります。保護した読み込み前データを保持しています。再読み込みせずバックアップを保管してください。':`読み込めませんでした。現在のセーブは変更していません。${error instanceof Error?error.message:''}`}}
}
export function previousImport(storage:Pick<Storage,'getItem'>):Progress{const record=JSON.parse(storage.getItem(PRE_IMPORT_KEY)||'null');if(!object(record)||typeof record.previous!=='string')fail('読み込み前のデータがありません');return validateProgress(JSON.parse(record.previous))}
