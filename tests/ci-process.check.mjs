import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {startServer,stopServer} from './ci-process.mjs';
const leaf="const http=require('node:http');const s=http.createServer((q,r)=>r.end('ready'));s.listen(0,'127.0.0.1',()=>console.log(s.address().port));";
for(const mode of ['direct','descendant','exited-parent'])test('server cleanup closes '+mode+' listener',{timeout:10000},async()=>{
 const dir=mkdtempSync(join(tmpdir(),'astra-ci-process-')),log=join(dir,'server.log');
 const code=mode==='direct'?leaf:"const {spawn}=require('node:child_process');const p=spawn(process.execPath,['-e',"+JSON.stringify(leaf)+"],{stdio:'inherit'});"+(mode==='exited-parent'?"p.unref();":"setInterval(()=>{},1000);");
 const child=startServer(process.execPath,['-e',code],log);
 try{
  let port;for(let i=0;i<100;i++){const match=readFileSync(log,'utf8').match(/\d+/);if(match){port=Number(match[0]);break}await new Promise(r=>setTimeout(r,25))}assert.ok(port,'server must actually listen');
  assert.equal(await (await fetch('http://127.0.0.1:'+port)).text(),'ready');
  if(mode==='exited-parent'){for(let i=0;i<100&&child.exitCode===null;i++)await new Promise(r=>setTimeout(r,10));assert.equal(child.exitCode,0)}
  await stopServer(child);await assert.rejects(fetch('http://127.0.0.1:'+port));await stopServer(child);
 }finally{await stopServer(child);rmSync(dir,{recursive:true,force:true})}
});
