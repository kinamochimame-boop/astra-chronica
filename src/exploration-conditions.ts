import {sandstorms} from './data/exploration-conditions';
import type {AdventureProgress} from './adventure';
/** Weather is derived from committed events/landmarks, never elapsed time or random rolls. */
export function sandstormState(state:AdventureProgress,chapterId:string,locationId:string){const rule=sandstorms.find(r=>r.chapterId===chapterId&&r.locationId===locationId),done=state.chapters[chapterId]?.completed??[];if(!rule||!done.includes(rule.appearsAfter))return;return {rule,active:!(rule.clearedByEvent&&done.includes(rule.clearedByEvent))&&!(rule.clearedByLandmark&&state.landmarks?.includes(rule.clearedByLandmark))}}
export function explorationRestriction(state:AdventureProgress,chapterId:string,locationId:string,actionId:string){const storm=sandstormState(state,chapterId,locationId);return storm?.active&&(storm.rule.restrictedActions as readonly string[]).includes(actionId)?`${storm.rule.reason} 解除条件：${storm.rule.release}`:''}
