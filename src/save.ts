export interface Progress {version:1; started:boolean; wins:number; battles:number}
export const SAVE_KEY='astra-chronica:v1';
export const fresh=():Progress=>({version:1,started:false,wins:0,battles:0});
export function load(storage?:Pick<Storage,'getItem'>):Progress{
 try{const p=JSON.parse((storage??localStorage).getItem(SAVE_KEY)||'null');if(p?.version===1&&typeof p.started==='boolean'&&Number.isSafeInteger(p.wins)&&p.wins>=0&&Number.isSafeInteger(p.battles)&&p.battles>=p.wins)return p;}catch{/* Storage may be unavailable. */}return fresh();
}
export function save(p:Progress,storage?:Pick<Storage,'setItem'>):boolean{try{(storage??localStorage).setItem(SAVE_KEY,JSON.stringify(p));return true;}catch{return false;}}
