/** UI-only touch interpretation. It never advances combat or consumes resources. */
export class BattleGesture {
 private origin?:{pointerId:number;clientX:number;clientY:number};private dragged=false;
 start(p:{pointerId:number;clientX:number;clientY:number}){this.origin={pointerId:p.pointerId,clientX:p.clientX,clientY:p.clientY};this.dragged=false}
 move(p:{pointerId:number;clientX:number;clientY:number}){const o=this.origin;if(o?.pointerId===p.pointerId&&Math.hypot(p.clientX-o.clientX,p.clientY-o.clientY)>8)this.dragged=true}
 cancel(p:{pointerId:number}){if(this.origin?.pointerId===p.pointerId)this.dragged=true}
 allowsClick(detail:number){return detail<=0||!this.dragged}
 clear(){this.origin=undefined;this.dragged=false}
}
