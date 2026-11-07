import type {Progress} from '../save';
import {mapById} from './map-data';
import {enterMap,mapOpen} from './exploration-save';
import {activeMap} from './active-map';
import {clearCircle} from './collision';
import {chapters} from '../data/chapter-one';
import {mainObjective} from './objective';
/** IDs refer to existing maps. Names and locations are never duplicated here. */
export const railStationIds=['gear-rail','gear-station','gear-city','gear-workshop','gear-observatory','gear-core'] as const;
export interface RailTicket {from:string;to:string}
export const railwayRestored=(p:Progress)=>(p.adventure.chapters['chapter-13']?.completed??[]).includes('c13-rail-start');
export function railStations(p:Progress){return railwayRestored(p)?railStationIds.map(id=>mapById(id)!).filter(m=>mapOpen(p.adventure,m)&&clearCircle(activeMap(m,p.adventure),m.entry)):[]}
export function railReason(p:Progress,to:string){const source=mapById(p.world?.mapId),state=p.adventure.chapters['chapter-13'];if(p.adventure.pending)return '戦闘中は鉄道を利用できません。';if(!railwayRestored(p))return '古代鉄道駅で制動機と動力を復旧してください。';if(!source||p.adventure.selectedChapterId!=='chapter-13'||!railStationIds.some(id=>id===source.id)||source.chapterId!=='chapter-13'||state?.currentLocationId!==source.locationId||!mapOpen(p.adventure,source))return '第13章の解放済みの駅から利用してください。';if(!railStations(p).some(m=>m.id===to))return 'この駅はまだ解放されていません。';if(to===source.id)return '現在この駅にいます。';return ''}
/** Pure reservation: closing/reloading during the animation leaves the origin intact. */
export function beginRailTrip(p:Progress,to:string):RailTicket|undefined{return railReason(p,to)?undefined:{from:p.world!.mapId,to}}
/** Call only after disposing the origin map view, so its flush cannot overwrite the destination. */
export function completeRailTrip(p:Progress,ticket:RailTicket){if(!ticket||p.world?.mapId!==ticket.from||railReason(p,ticket.to))return false;const m=mapById(ticket.to)!;if(!enterMap(p,m.id))return false;Object.assign(p.world!,m.entry);p.world!.event=undefined;return true}
export function railGuidance(p:Progress){const map=mapById(p.world?.mapId);if(!map||map.chapterId!=='chapter-13'||!railStations(p).some(m=>m.id===map.id))return '';const c=chapters.find(c=>c.id==='chapter-13')!,goal=mainObjective(p.adventure,c),station=railStations(p).find(m=>m.locationId===goal.locationId&&m.id!==map.id);return station&&!railReason(p,station.id)?` 鉄道：解放済みの${station.name}駅へ移動できます。`:''}
