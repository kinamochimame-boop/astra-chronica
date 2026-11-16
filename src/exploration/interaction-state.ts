import type {Progress} from '../save';
import type {MapObject,Point,WalkMap} from './types';
import {canInteract} from './collision';
import {objectConditionReason,objectRevealed,transitionReason} from './transitions';
/** Presentation of existing gates and collision checks; never grants access or moves a hero. */
export function interactionState(p:Progress,map:WalkMap,hero:Point,o:MapObject){
 if(!objectRevealed(p,map,o))return undefined;
 const reason=objectConditionReason(p,map,o)||(o.kind==='exit'?transitionReason(p,map,o):'');
 if(reason)return {name:o.kind==='exit'?'閉ざされた出口':o.name,state:'blocked' as const,label:'条件未達',reason,highlight:false};
 const opened=o.kind==='chest'&&!!o.eventId&&!!p.adventure.chapters[map.chapterId]?.completed.includes(o.eventId);
 if(opened)return {name:o.name,state:'completed' as const,label:'開封済み',reason:'この宝箱は開封済みです。',highlight:false};
 const near=canInteract(map,hero,o);
 return near?{name:o.name,state:'ready' as const,label:o.kind==='exit'?'移動できます':'調べられます',reason:'対象をタップすると操作できます。',highlight:true}:{name:o.name,state:'approach' as const,label:'接近が必要',reason:'近くへ移動してから、もう一度対象を調べてください。',highlight:false};
}
