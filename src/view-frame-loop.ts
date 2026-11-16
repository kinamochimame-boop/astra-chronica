export interface FrameDriver {request:(callback:FrameRequestCallback)=>number;cancel:(id:number)=>void}
/** Owns callbacks only. Simulation time, resources and combat rules stay with their owners. */
export class ViewFrameLoop {
 private frame?:number;private generation=0;private active=false;private closed=false;
 constructor(private tick:(time:number)=>boolean,private driver:FrameDriver={request:fn=>requestAnimationFrame(fn),cancel:id=>cancelAnimationFrame(id)}){}
 resume(){if(this.closed||this.active)return;this.active=true;this.schedule()}
 suspend(){this.active=false;this.generation++;if(this.frame!==undefined)this.driver.cancel(this.frame);this.frame=undefined}
 dispose(){if(this.closed)return;this.closed=true;this.suspend()}
 private schedule(){const generation=this.generation;this.frame=this.driver.request(time=>{if(this.closed||!this.active||generation!==this.generation)return;this.frame=undefined;const again=this.tick(time);if(this.closed||!this.active||generation!==this.generation)return;if(again)this.schedule();else this.active=false})}
}
