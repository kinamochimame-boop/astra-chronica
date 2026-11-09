import type {AdventureEvent} from './data/chapter-one';
/** Only explicitly declared parallel groups retain confirmation order. Old chapters remain canonical. */
export function orderedDefinitions(events:AdventureEvent[],savedIds:string[]):AdventureEvent[]{
 const seen=new Set<string>();
 return events.flatMap(e=>{
  if(!e.orderGroup)return [e];
  if(seen.has(e.orderGroup))return [];
  seen.add(e.orderGroup);
  const rank=(id:string)=>savedIds.includes(id)?savedIds.indexOf(id):Number.MAX_SAFE_INTEGER;
  return events.filter(other=>other.orderGroup===e.orderGroup).sort((a,b)=>rank(a.id)-rank(b.id));
 });
}
