import {spawn} from 'node:child_process';
import {openSync,closeSync} from 'node:fs';
/** Own the whole isolated server group, including Vite/esbuild descendants. */
export function startServer(command,args,log){
 const fd=openSync(log,'w');let child;
 try{child=spawn(command,args,{detached:true,stdio:['ignore',fd,fd]})}finally{closeSync(fd)}
 return child;
}
export async function stopServer(child){
 if(!child?.pid)return;
 const closed=child.exitCode!==null||child.signalCode!==null?Promise.resolve():new Promise(resolve=>{child.once('close',resolve);child.once('error',resolve)});
 try{process.kill(-child.pid,'SIGTERM')}catch(error){if(error.code!=='ESRCH')throw error}
 let timer;const graceful=await Promise.race([closed.then(()=>true),new Promise(resolve=>{timer=setTimeout(()=>resolve(false),5000)})]);clearTimeout(timer);
 if(!graceful){try{process.kill(-child.pid,'SIGKILL')}catch(error){if(error.code!=='ESRCH')throw error}await closed}
}
