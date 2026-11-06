import type {Facing,Point,Pose} from './types';
export interface Mover extends Pose {path:Point[]}
export function advance(mover:Mover,speed:number,seconds:number){
 let budget=Math.max(0,speed)*Math.max(0,Number.isFinite(seconds)?seconds:0);
 while(budget>0&&mover.path.length){const goal=mover.path[0],dx=goal.x-mover.x,dy=goal.y-mover.y,d=Math.hypot(dx,dy);if(d<.001){mover.path.shift();continue}mover.facing=(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up') as Facing;const step=Math.min(d,budget);mover.x+=dx/d*step;mover.y+=dy/d*step;budget-=step;if(step===d)mover.path.shift();}
}
