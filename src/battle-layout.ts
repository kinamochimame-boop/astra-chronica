/** Coordinate policy only. v1.5 keeps rows; v1.6 may opt into a full side-view presentation. */
export type BattleLayout='rows'|'side';
export function battleAnchor(index:number,height:number,hasEnemies:boolean,layout:BattleLayout='rows'){
 if(layout==='side'&&hasEnemies)return {x:index<3?85:305,y:height*(.25+(index%3)*.25)};
 return {x:70+(index%3)*125,y:hasEnemies?(index<3?height*.72:height*.25):height*.63};
}
export const attackOffset=(ally:boolean,layout:BattleLayout='rows')=>layout==='side'?{x:ally?13:-13,y:0}:{x:0,y:ally?-13:13};
