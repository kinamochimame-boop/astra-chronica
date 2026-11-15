import Phaser from 'phaser';
/** Phaser 3.90's VisibilityHandler has no destroy hook and overwrites window handlers.
 * Capture only its synchronous boot registrations; keep the library lifecycle intact.
 */
export class ManagedExplorationGame extends Phaser.Game {
 protected start(){
  const descriptor=Object.getOwnPropertyDescriptor(document,'addEventListener'),add=document.addEventListener,blur=window.onblur,focus=window.onfocus;
  const registrations:Parameters<Document['addEventListener']>[]=[];
  document.addEventListener=((...args:Parameters<Document['addEventListener']>)=>{if(args[0]==='visibilitychange')registrations.push(args);add.call(document,...args)}) as Document['addEventListener'];
  try{super.start()}finally{if(descriptor)Object.defineProperty(document,'addEventListener',descriptor);else Reflect.deleteProperty(document,'addEventListener');window.onblur=blur;window.onfocus=focus}
  const onBlur=()=>this.events.emit(Phaser.Core.Events.BLUR),onFocus=()=>this.events.emit(Phaser.Core.Events.FOCUS);
  window.addEventListener('blur',onBlur);window.addEventListener('focus',onFocus);
  this.events.once(Phaser.Core.Events.DESTROY,()=>{for(const [type,listener,options] of registrations)document.removeEventListener(type,listener,typeof options==='boolean'?options:options?.capture);window.removeEventListener('blur',onBlur);window.removeEventListener('focus',onFocus)});
 }
}
