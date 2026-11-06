export interface Point {x:number;y:number}
export type Facing='up'|'down'|'left'|'right';
export interface Pose extends Point {facing:Facing}
export interface MapObject extends Point {id:string;name:string;kind:'npc'|'chest'|'exit'|'inspect';icon?:'ship';eventId?:string;targetMap?:string;targetLocation?:string;text?:string;questId?:string;objectiveId?:string}
export interface SymbolDefinition extends Point {id:string;name:string;mode:'idle'|'patrol'|'chase';speed:number;radius:number;aggro:number;leash:number;route:Point[];eventId:string;encounterId:string}
export interface WalkMap {id:string;chapterId:string;locationId:string;name:string;kind:'camp'|'field'|'dungeon';theme?:'sky';tile:number;width:number;height:number;grid:string[];entry:Pose;objects:MapObject[];symbols:SymbolDefinition[]}
export interface SymbolContact {mapId:string;symbolId:string;position:Point}
export interface ReturnInfo {chapterId:string;mapId:string;symbolId:string;eventId:string;encounterId:string;serial:number;pose:Pose;outcome?:'victory'|'defeat'}
export interface WorldSave extends Pose {mapId:string;defeated:string[];opened:string[];event?:{id:string;page:number};returnInfo?:ReturnInfo;recovered?:boolean}
