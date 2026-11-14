import {walkMaps} from './map-data';
/** Compact cell indices, bounded by the actual map definition. Convenience data only. */
export interface SurveyRecord {format:1;width:number;height:number;seen:number[];walked:number[]}
export type SurveyHistory=Record<string,SurveyRecord>;
export function normalizeSurveyHistory(value:unknown):SurveyHistory {
 const result:SurveyHistory={};if(!value||typeof value!=='object'||Array.isArray(value))return result;
 const source=value as Record<string,unknown>;
 for(const map of walkMaps){const raw=source[map.id] as Partial<SurveyRecord>|undefined;
  if(!raw||raw.format!==1||raw.width!==map.width||raw.height!==map.height)continue;
  const limit=map.width*map.height;
  const valid=(a:unknown):a is number[]=>Array.isArray(a)&&a.length<=limit&&a.every(n=>Number.isSafeInteger(n)&&n>=0&&n<limit);
  if(!valid(raw.seen)||!valid(raw.walked))continue;
  const seen=[...new Set(raw.seen)].sort((a,b)=>a-b),known=new Set(seen);
  result[map.id]={format:1,width:map.width,height:map.height,seen,walked:[...new Set(raw.walked)].filter(n=>known.has(n)).sort((a,b)=>a-b)};
 }return result;
}
