export type MapTheme='sky'|'village'|'garden'|'town'|'tower'|'cave'|'path'|'city'|'market'|'waterway'|'mine'|'archive'|'core'|'coast'|'seaside'|'harbor'|'beach'|'observatory'|'seacave'|'undersea'|'tidecore'|'paleRoad'|'paleVillage'|'paleField'|'paleStones'|'paleRavine'|'paleSanctuary'|'paleArchive'|'paleCore';
export interface MapDecoration {kind:'crystal'|'lamp'|'building'|'shelf'|'machine'|'ore'|'flowers'|'bridge';x:number;y:number;w?:number;h?:number}
export interface Point {x:number;y:number}
export type Facing='up'|'down'|'left'|'right';
export interface Pose extends Point {facing:Facing}
export interface MapObject extends Point {id:string;name:string;kind:'npc'|'chest'|'exit'|'inspect';icon?:'ship';requires?:string[];needsLowTide?:boolean;eventId?:string;targetMap?:string;targetLocation?:string;text?:string;questId?:string;objectiveId?:string}
export interface SymbolDefinition extends Point {id:string;name:string;mode:'idle'|'patrol'|'chase';speed:number;radius:number;aggro:number;leash:number;route:Point[];eventId:string;encounterId:string}
export interface WalkMap {id:string;chapterId:string;locationId:string;name:string;kind:'camp'|'field'|'dungeon';theme?:MapTheme;requires?:string[];decorations?:MapDecoration[];gates?:{area:{x:number;y:number;w:number;h:number};requires:string[]}[];tidal?:{x:number;y:number;w:number;h:number}[];tile:number;width:number;height:number;grid:string[];entry:Pose;objects:MapObject[];symbols:SymbolDefinition[]}
export interface SymbolContact {mapId:string;symbolId:string;position:Point}
export interface ReturnInfo {chapterId:string;mapId:string;symbolId:string;eventId:string;encounterId:string;serial:number;pose:Pose;outcome?:'victory'|'defeat'}
export interface WorldSave extends Pose {mapId:string;defeated:string[];opened:string[];event?:{id:string;page:number};returnInfo?:ReturnInfo;recovered?:boolean}
