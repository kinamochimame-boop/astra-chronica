import {tideReason} from './tide';
import {activeMap} from './active-map';
import {clearCircle} from './collision';
import type {Progress} from '../save';
import {chapters} from '../data/chapter-one';
import {chapterOpen,chapterState,locationOpen} from '../adventure';
import {mapById} from './map-data';
import {mapOpen} from './exploration-save';
import type {MapObject,WalkMap} from './types';
export function objectConditionReason(p:Progress,map:WalkMap,o:MapObject){const done=p.adventure.chapters[map.chapterId]?.completed??[];const tide=tideReason(p.adventure,map,o.needsLowTide);if(tide)return tide;return o.requires?.some(id=>!done.includes(id))?'先の地点のメインイベントを完了すると、この対象が開きます。':''}
/** Validation is pure; the existing visitLocation / enterMap APIs own the actual commit. */
export function transitionReason(p:Progress,source:WalkMap,o:MapObject){
 if(o.kind!=='exit')return '出口を選んでください。';
 if(p.world?.mapId!==source.id||p.adventure.chapters[source.chapterId]?.currentLocationId!==source.locationId)return '現在のマップの出口から移動してください。';
 const condition=objectConditionReason(p,source,o);if(condition)return condition;
 if(o.targetMap){const target=mapById(o.targetMap);if(!target)return '移動先のマップが見つかりません。地点一覧から戻れます。';if(!clearCircle(activeMap(target,p.adventure),target.entry))return '移動先に安全な入口がありません。';return mapOpen(p.adventure,target)?'':'先の地点のメインイベントを完了すると、この出口が開きます。'}
 const chapter=chapters.find(c=>c.id===source.chapterId);if(!chapter||!o.targetLocation||!chapter.locations.some(l=>l.id===o.targetLocation))return '移動先の地点が見つかりません。';
 return chapterOpen(p.adventure,chapter)&&locationOpen(chapterState(p.adventure,chapter),chapter,o.targetLocation)?'':'この地点のメインイベントを完了してください。';
}
