import {distance,cell,center,clearCircle,clearSegment} from './collision';
import {findPath} from './pathfinding';
import {advance,type Mover} from './movement';
import type {Point,SymbolDefinition,WalkMap} from './types';
export interface EnemySymbol extends Mover {definition:SymbolDefinition;state:'idle'|'patrol'|'chase'|'return'|'defeated'|'hidden';waypoint:number;goalCell?:string;updates:number}
export const createSymbols=(map:WalkMap):EnemySymbol[]=>map.symbols.map(definition=>({...definition,definition,path:[],facing:'down',state:'hidden',waypoint:0,updates:0}));
export function stepSymbol(map:WalkMap,s:EnemySymbol,hero:Point,seconds:number){
 s.updates++;const d=s.definition;let goal:Point|undefined;
 if(d.mode==='patrol'){s.state='patrol';goal=d.route[s.waypoint%d.route.length];if(distance(s,goal)<1){s.waypoint=(s.waypoint+1)%d.route.length;goal=d.route[s.waypoint]}}
 else if(d.mode==='chase'){if(distance(s,d)>d.leash||distance(hero,d)>d.leash){s.state='return';goal=d;}else if(distance(s,hero)<=d.aggro||s.state==='chase'){s.state='chase';goal=hero;}else if(distance(s,d)>1){s.state='return';goal=d;}else{s.state='idle';s.path=[]}}
 else {s.state='idle';return;}
 if(goal){if(s.state==='chase'&&!clearCircle(map,goal,d.radius)){const safe=center(map,cell(map,goal));if(clearCircle(map,safe,d.radius)&&distance(safe,goal)<=10+d.radius)goal=safe;}const c=cell(map,goal),id=`${c.x},${c.y}`;if(s.goalCell!==id||!s.path.length||!clearSegment(map,s,s.path[0],d.radius)||distance(s.path[s.path.length-1],goal)>(s.state==='chase'?8:.001)){s.path=findPath(map,s,goal,d.radius)??[];s.goalCell=id;}const previous={x:s.x,y:s.y};advance(s,d.speed,seconds,map,d.radius);if(d.leash>0&&distance(s,d)>d.leash){s.x=previous.x;s.y=previous.y;s.path=[];s.state='return';}}
}
