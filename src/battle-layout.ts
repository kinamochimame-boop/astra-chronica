/** Shared drawing, hit targets and popup coordinates. Legacy rows remain available for home portraits. */
export type BattleLayout='rows'|'side';
export function battleAnchor(index:number,height:number,hasEnemies:boolean,layout:BattleLayout='rows',enemyCount=3){
 if(layout==='side'&&hasEnemies){if(index<3)return {x:78,y:height*(.2+index*.3)};const n=index-3,columns=enemyCount>3?2:1,rows=Math.ceil(enemyCount/columns);return {x:columns===1?302:267+(n%2)*65,y:height*((Math.floor(n/columns)+1)/(rows+1))};}
 return {x:70+(index%3)*125,y:hasEnemies?(index<3?height*.72:height*.25):height*.63};
}
export const attackOffset=(ally:boolean,layout:BattleLayout='rows')=>layout==='side'?{x:ally?13:-13,y:0}:{x:0,y:ally?-13:13};
