/** Isolated CI workers; existing tests, assertions, seeds and deadlines are unchanged. */
import {readdirSync,readFileSync,writeFileSync,createWriteStream,mkdirSync,existsSync,copyFileSync,chmodSync,cpSync} from 'node:fs';
import {spawn,execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {chromium} from '@playwright/test';
import {browserShards} from './ci-v29-matrix.mjs';
import {productionFingerprint} from './production-fingerprint.mjs';
import {startServer,stopServer} from './ci-process.mjs';
const group=process.argv[2],dir='.ci-v29/'+group;mkdirSync(dir,{recursive:true});
const sourceHash=productionFingerprint(),start=new Date().toISOString(),servers=[];
const result={group,sourceHash,commit:process.env.GITHUB_SHA,head:process.env.V26_HEAD_SHA,start,success:false,commands:[],files:[],screenshots:[],runtime:{node:process.version,platform:process.platform}};
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
async function run(command,args,label,env=process.env){const path=dir+'/'+label+'.log',out=createWriteStream(path),began=new Date().toISOString();const p=spawn(command,args,{env,stdio:['ignore','pipe','pipe']});p.stdout.pipe(out,{end:false});p.stderr.pipe(out,{end:false});p.stdout.pipe(process.stdout,{end:false});p.stderr.pipe(process.stderr,{end:false});const code=await new Promise(resolve=>{p.on('error',e=>{out.write(String(e));resolve(127)});p.on('close',resolve)});await new Promise(r=>out.end(r));const receipt={command:[command,...args],code,start:began,end:new Date().toISOString(),log:label+'.log',sha256:sha(path)};result.commands.push(receipt);return receipt}
async function ready(port){for(let i=0;i<120;i++){try{if((await fetch('http://localhost:'+port)).ok)return}catch{}await new Promise(r=>setTimeout(r,500))}throw Error('Preview did not become ready: '+port)}
function server(args,name){servers.push(startServer(process.execPath,['node_modules/vite/bin/vite.js',...args],dir+'/'+name+'.log'))}
function copyOptional(from,to){if(existsSync(from))cpSync(from,dir+'/'+to,{recursive:true})}
try{
 const test=JSON.parse(readFileSync('package.json')).scripts.test;
 if(test!=='vitest run --pool=threads --maxWorkers=1 --no-file-parallelism')throw Error('Original unit runner/deadline must be preserved');
 const build=await run('npm',['run','build'],'build');if(build.code!==0)throw Error('Build failed');
 const artifacts=[];function scan(path){for(const e of readdirSync(path,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const p=path+'/'+e.name;if(e.isDirectory())scan(p);else artifacts.push({file:p,sha256:sha(p)})}}scan('dist');result.build={sourceHash,builtAt:new Date().toISOString(),artifacts};
 if(group==='unit'){await run('npm',['test'],'unit');copyOptional('/tmp/astra-v26-manifest.json','manifest.json')}
 else{
  const all=readdirSync('tests').filter(f=>/\.(e2e|smoke)\.mjs$/.test(f));if(all.length!==87)throw Error('Expected all87 browser files');
  const chosen=browserShards.find(s=>s.id===group)?.files??[];
  if(!chosen.length)throw Error('Unknown or empty CI group: '+group);
  const native=chromium.executablePath(),wrapper=process.cwd()+'/'+dir+'/chromium-canvas';
  writeFileSync(wrapper,'#!/bin/sh\nexec "$V26_CHROMIUM_NATIVE" --disable-webgl "$@"\n');chmodSync(wrapper,0o755);
  result.runtime.chromium=execFileSync(native,['--version'],{encoding:'utf8'}).trim();
  server(['preview','--host','0.0.0.0','--port','4173'],'preview');server(['--host','0.0.0.0','--port','5173'],'dev');await ready(4173);await ready(5173);
  const env={...process.env,BASE_URL:'http://localhost:4173',UI_TEST_URL:'http://localhost:5173',BATTLE_VIRTUAL_CLOCK:'1',BATTLE_CLOCK_SKIP_FRAMES:'1',V26_CHROMIUM_NATIVE:native,CHROMIUM_PATH:wrapper};
  for(const file of chosen){const paths=readFileSync('tests/'+file,'utf8').includes('--quests-before')?[['--quests-before'],['--quests-after']]:[[]],attempts=[];for(let i=0;i<paths.length;i++)attempts.push(await run(process.execPath,['tests/'+file,...paths[i]],file+'-'+i,{...env,CHROMIUM_PATH:file.endsWith('.smoke.mjs')?native:wrapper}));result.files.push({file,sourceHash,attempts,code:attempts.every(a=>a.code===0)?0:1});console.log('V26_FILE '+JSON.stringify(result.files.at(-1)))}
  copyOptional('/tmp/astra-v26-manifest.json','manifest.json');
  if(chosen.includes('full-journey-v26.e2e.mjs')&&existsSync('/tmp/v26-fresh-journey-result.json')){const p=JSON.parse(readFileSync('/tmp/v26-fresh-journey-result.json'));cpSync(p.output,dir+'/journey',{recursive:true})}
  copyOptional('/tmp/v29-touch-cases.json','touch-cases.json');copyOptional('/tmp/v26-map-cases.json','map-cases.json');copyOptional('/tmp/v26-chapter-before-receipt.json','chapter-before.json');copyOptional('/tmp/v26-chapter-after-receipt.json','chapter-after.json');
  mkdirSync(dir+'/screenshots',{recursive:true});for(const f of readdirSync('docs/screenshots').filter(f=>chosen.includes('free-exploration-v28.e2e.mjs')&&/^free-exploration-v28-.*\.png$/.test(f)||chosen.includes('smooth-navigation-v29.e2e.mjs')&&/^smooth-navigation-v29-.*\.png$/.test(f))){const path='docs/screenshots/'+f,b=readFileSync(path);if(!b.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')))throw Error('Invalid PNG '+f);copyFileSync(path,dir+'/screenshots/'+f);result.screenshots.push({file:f,sha256:sha(path),width:b.readUInt32BE(16),height:b.readUInt32BE(20)})}
 }
 if(productionFingerprint()!==sourceHash)throw Error('Application source changed during validation');
 result.success=result.commands.every(c=>c.code===0)&&result.files.every(f=>f.code===0);
}catch(error){result.error=String(error);console.error(error)}
finally{await Promise.allSettled(servers.map(stopServer));result.end=new Date().toISOString();writeFileSync(dir+'/receipt.json',JSON.stringify(result,null,2));console.log('V26_GROUP '+JSON.stringify({group,success:result.success,files:result.files.length,sourceHash}));if(!result.success)process.exitCode=1}
