/** Inspector-only plain-value probes; release all handles so measuring cannot retain the game. */
export async function nativeListeners(session){
 const expression=`Object.fromEntries(Object.entries({window:window,document:document,body:document.body,canvas:document.querySelector('#world-viewport canvas')}).map(([name,target])=>[name,target?Object.fromEntries(Object.entries(getEventListeners(target)).map(([type,list])=>[type,list.length])):{}]))`;
 const r=await session.send('Runtime.evaluate',{expression,includeCommandLineAPI:true,returnByValue:true});if(r.exceptionDetails)throw Error('Inspector listener probe failed');const counts=r.result.value,sum=name=>Object.values(counts[name]).reduce((n,v)=>n+v,0);
 return {nativeListeners:counts,nativeWindowCount:sum('window'),nativeDocumentCount:sum('document'),nativeBodyCount:sum('body'),nativeCanvasCount:sum('canvas'),canvasWheel:counts.canvas.wheel??0};
}
export async function phaserOwners(page,session){
 const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(e=>e.name)),group='v43-owner-probe',result={};
 try{for(const [file,name,inspect] of [['managed-game.ts','ManagedExplorationGame','function(){return this.length}'],['visuals.ts','Stage','function(){return this.map(s=>({inputList:s.input._list.length,activeInput:s.input._list.filter(o=>o.input?.enabled&&o.scene).length,figures:s.figures.size,children:s.children.list.length,tweens:s.tweens.getTweens().length,timers:s.time._active.length}))}']]){
  const url=resources.find(n=>n.includes('/src/')&&n.includes('/'+file));if(!url)throw Error('Loaded owner module was not found');
  const p=await session.send('Runtime.evaluate',{expression:`import(${JSON.stringify(url)}).then(m=>m.${name}.prototype)`,awaitPromise:true,objectGroup:group});
  const q=await session.send('Runtime.queryObjects',{prototypeObjectId:p.result.objectId,objectGroup:group});const value=await session.send('Runtime.callFunctionOn',{objectId:q.objects.objectId,functionDeclaration:inspect,returnByValue:true});result[name]=value.result.value;
 }}finally{await session.send('Runtime.releaseObjectGroup',{objectGroup:group})}return result;
}
