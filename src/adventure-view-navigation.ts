/** Transient view ownership and return position only; never persisted with game progress. */
export interface ReturnSpot {screen:string;mapId?:string;scrollY:number;focusLabel?:string}
export const captureReturnSpot=(screen:string,mapId:string|undefined,scrollY:number,focusLabel?:string):ReturnSpot=>({screen,mapId,scrollY:Number.isFinite(scrollY)?Math.max(0,scrollY):0,...(focusLabel?{focusLabel:focusLabel.slice(0,80)}:{})});
export function returnScroll(spot:ReturnSpot,screen:string,mapId?:string){return spot.screen===screen&&(screen!=='world'||spot.mapId===mapId)?spot.scrollY:0}
export class ViewSession {
 private generation=0;
 enter(){this.generation++;return this.generation}
 guard(owner:Pick<HTMLElement,'isConnected'>,action:()=>void){const generation=this.generation;return ()=>{if(owner.isConnected&&generation===this.generation)action()}}
}
