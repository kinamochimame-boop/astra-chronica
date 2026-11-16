import {installIntegrationTelemetry} from './integration-telemetry.mjs';
/** Counts outstanding callbacks, not cumulative registrations. Unknown promise backlog stays null. */
export function installStabilityTelemetry(){
 const frames=new Set(),timeouts=new Set(),request=window.requestAnimationFrame,cancel=window.cancelAnimationFrame,set=window.setTimeout,clear=window.clearTimeout;
 window.requestAnimationFrame=function(fn){let id;id=request.call(window,t=>{frames.delete(id);fn(t)});frames.add(id);return id};
 window.cancelAnimationFrame=function(id){frames.delete(id);return cancel.call(window,id)};
 window.setTimeout=function(fn,delay,...args){let id;id=set.call(window,typeof fn==='function'?()=>{timeouts.delete(id);fn(...args)}:fn,delay);timeouts.add(id);return id};
 window.clearTimeout=function(id){timeouts.delete(id);return clear.call(window,id)};
 let unhandled=0;window.addEventListener('unhandledrejection',()=>unhandled++);
 window.stabilityTelemetry=()=>({...window.integrationTelemetry(),frames:frames.size,timeouts:timeouts.size,dom:document.querySelectorAll('*').length,canvases:document.querySelectorAll('canvas').length,unhandled,pendingPromises:null});
}
export async function telemetry(page){return page.evaluate(()=>window.stabilityTelemetry())}
export async function instrument(page){await page.addInitScript(installIntegrationTelemetry);await page.addInitScript(installStabilityTelemetry)}
