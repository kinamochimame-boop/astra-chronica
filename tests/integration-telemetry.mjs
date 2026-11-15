/** Read-only counters around native browser resources; never changes game state. */
export function installIntegrationTelemetry(){
 const entries=[],types=new Set(['keydown','keyup','resize','orientationchange','visibilitychange','pagehide','pageshow','blur','focus']);
 const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener;
 const capture=o=>typeof o==='boolean'?o:!!o?.capture;
 EventTarget.prototype.addEventListener=function(type,fn,options){if((this===window||this===document)&&fn&&types.has(type)&&!entries.some(e=>e.target===this&&e.type===type&&e.fn===fn&&e.capture===capture(options)))entries.push({target:this,type,fn,capture:capture(options)});return add.call(this,type,fn,options)};
 EventTarget.prototype.removeEventListener=function(type,fn,options){const i=entries.findIndex(e=>e.target===this&&e.type===type&&e.fn===fn&&e.capture===capture(options));if(i>=0)entries.splice(i,1);return remove.call(this,type,fn,options)};
 let observers=0;const Native=window.ResizeObserver;
 window.ResizeObserver=class extends Native{active=false;observe(...args){if(!this.active){this.active=true;observers++}return super.observe(...args)}disconnect(){if(this.active){this.active=false;observers--}return super.disconnect()}};
 const intervals=new Set(),set=window.setInterval,clear=window.clearInterval;
 window.setInterval=function(...args){const id=set.apply(this,args);intervals.add(id);return id};window.clearInterval=function(id){intervals.delete(id);return clear.call(this,id)};
 window.integrationTelemetry=()=>({listeners:entries.length,observers,intervals:intervals.size,heap:performance.memory?.usedJSHeapSize??null});
}
