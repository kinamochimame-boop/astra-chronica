import type {SurveyRecord} from './survey-save';
import {findPath} from './pathfinding';
import {approachPoint} from './approach';
import type {Progress} from '../save';
import type {Point,WalkMap} from './types';
import {cell,center,clearCircle,distance,walkable} from './collision';
import {navigationTarget} from './navigation';
import {transitionReason} from './transitions';
/** A different Progress object (including Lab) always gets an independent survey. */
export class MapSurvey {
 private seen=new Set<number>();private walked=new Set<number>();private lastCell='';private terrain?:string[];version=0;
 constructor(readonly width:number,readonly height:number,record?:SurveyRecord){if(record&&record.format===1&&record.width===width&&record.height===height){const limit=width*height;for(const n of record.seen)if(Number.isSafeInteger(n)&&n>=0&&n<limit)this.seen.add(n);for(const n of record.walked)if(this.seen.has(n))this.walked.add(n)}}
 snapshot():SurveyRecord{return {format:1,width:this.width,height:this.height,seen:[...this.seen].sort((a,b)=>a-b),walked:[...this.walked].sort((a,b)=>a-b)}}
 hasSeen(x:number,y:number){return x>=0&&y>=0&&x<this.width&&y<this.height&&this.seen.has(y*this.width+x)}
 hasWalked(x:number,y:number){return x>=0&&y>=0&&x<this.width&&y<this.height&&this.walked.has(y*this.width+x)}
 get walkedCount(){return this.walked.size}
 discover(map:WalkMap,p:Point){if(map.width!==this.width||map.height!==this.height||!clearCircle(map,p))return;const at=cell(map,p),key=`${at.x}:${at.y}`;if(key===this.lastCell&&this.terrain===map.grid)return;this.lastCell=key;this.terrain=map.grid;let changed=false;const own=at.y*this.width+at.x;if(!this.walked.has(own)){this.walked.add(own);changed=true}
  for(let y=Math.max(0,at.y-3);y<=Math.min(this.height-1,at.y+3);y++)for(let x=Math.max(0,at.x-3);x<=Math.min(this.width-1,at.x+3);x++){
   const end=center(map,{x,y});if(distance(p,end)>map.tile*3)continue;const count=Math.max(1,Math.ceil(distance(p,end)/4));let visible=true;
   for(let i=0;i<=count;i++){const q=cell(map,{x:p.x+(end.x-p.x)*i/count,y:p.y+(end.y-p.y)*i/count});if(!walkable(map,q.x,q.y)){visible=q.x===x&&q.y===y;break}}
   const id=y*this.width+x;if(visible&&!this.seen.has(id)){this.seen.add(id);changed=true}
  }if(changed)this.version++;
 }
}
const terrainCache=new WeakMap<MapSurvey,{grid:WalkMap['grid'];version:number;cells:MiniMapSnapshot['cells']}>();
const sessions=new WeakMap<object,Map<string,MapSurvey>>();
export function surveyFor(owner:object & {survey?:Progress['survey']},map:WalkMap){let maps=sessions.get(owner);if(!maps){maps=new Map();sessions.set(owner,maps)}let s=maps.get(map.id);if(!s||s.width!==map.width||s.height!==map.height){s=new MapSurvey(map.width,map.height,owner.survey?.[map.id]);maps.set(map.id,s)}return s}
export interface MiniMapSnapshot {name:string;route:Point[][];width:number;height:number;version:number;cells:{x:number;y:number;terrain:string;walked:boolean}[];player:Point;exits:{id:string;name:string;x:number;y:number}[];objective?:Point;walkedCount:number}
export function miniMapSnapshot(p:Progress,map:WalkMap,hero:Point,survey:MapSurvey,live:readonly {x:number;y:number;definition:{id:string}}[]=[]):MiniMapSnapshot {
 const pose=clearCircle(map,hero)?hero:map.entry,old=terrainCache.get(survey);let cells=old?.cells;if(!old||old.grid!==map.grid||old.version!==survey.version){cells=[];for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++)if(survey.hasSeen(x,y))cells.push({x,y,terrain:map.grid[y][x],walked:survey.hasWalked(x,y)});terrainCache.set(survey,{grid:map.grid,version:survey.version,cells})}
 const known=(point:Point)=>{const c=cell(map,point);return survey.hasSeen(c.x,c.y)};
 const exits=map.objects.filter(o=>o.kind==='exit'&&known(o)&&!transitionReason(p,map,o)).map(o=>({id:o.id,name:o.name,x:o.x/map.tile,y:o.y/map.tile}));
 const target=navigationTarget(p,map,pose,live),position=target?.point;
 const destination=position&&approachPoint(map,pose,position),path=destination?findPath(map,pose,destination):undefined;
 // Split at every unknown cell: never join two known sections across hidden terrain.
 const route:Point[][]=[];let segment:Point[]=[];let previous=pose;
 for(const end of path??[]){const steps=Math.max(1,Math.ceil(distance(previous,end)/4));for(let i=0;i<=steps;i++){const q={x:previous.x+(end.x-previous.x)*i/steps,y:previous.y+(end.y-previous.y)*i/steps};if(known(q))segment.push({x:q.x/map.tile,y:q.y/map.tile});else if(segment.length){route.push(segment);segment=[]}}previous=end}if(segment.length)route.push(segment);
 return {name:map.name,route,width:map.width,height:map.height,version:survey.version,cells:cells!,player:{x:pose.x/map.tile,y:pose.y/map.tile},exits,objective:position&&known(position)?{x:position.x/map.tile,y:position.y/map.tile}:undefined,walkedCount:survey.walkedCount};
}
