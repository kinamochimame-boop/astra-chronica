export type ItemId='potion'|'ether';
export type Consumables=Record<ItemId,number>;
export const itemDefinitions={potion:{name:'星露の小瓶',amount:100,resource:'hp' as const},ether:{name:'灯火の雫',amount:30,resource:'mp' as const}};
export const initialConsumables=():Consumables=>({potion:0,ether:0});
export function normalizeConsumables(raw:unknown):Consumables{const p=raw&&typeof raw==='object'?raw as Record<string,unknown>:{};return Object.fromEntries(Object.keys(itemDefinitions).map(id=>[id,Number.isSafeInteger(p[id])&&(p[id] as number)>=0&&(p[id] as number)<=99?p[id]:0])) as Consumables}
export function grantConsumable(items:Consumables,id:ItemId,count:number){if(!itemDefinitions[id]||!Number.isSafeInteger(count)||count<1||items[id]+count>99)return false;items[id]+=count;return true}
export const isItem=(id:string):id is ItemId=>id==='potion'||id==='ether';
