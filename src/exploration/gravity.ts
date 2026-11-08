import type {AdventureProgress} from '../adventure';
export type GravityPhase='normal'|'reversed'|'stable'|'controlled';
export function gravityPhase(a:AdventureProgress):GravityPhase{const done=a.chapters['chapter-14']?.completed??[];return done.includes('c14-clear')?'controlled':done.includes('c14-gravity-stabilize')?'stable':done.includes('c14-gravity-shift')?'reversed':'normal'}
export const gravityLabel=(p:GravityPhase)=>({normal:'通常重力',reversed:'重力反転',stable:'重力安定',controlled:'完全制御'})[p];
