/** Collect actual isolated CI receipts. No network writes, deploys or inferred passes. */
import {readdirSync,readFileSync,writeFileSync,mkdirSync,cpSync,copyFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {productionFingerprint} from './production-fingerprint.mjs';
const root='.ci-v28-results',groups=readdirSync(root).map(n=>({path:root+'/'+n,data:JSON.parse(readFileSync(root+'/'+n+'/receipt.json'))}));
const sha=b=>createHash('sha256').update(b).digest('hex'),hash=productionFingerprint(),head=process.env.V26_HEAD_SHA;
assert.equal(groups.length,12);assert.equal(new Set(groups.map(g=>g.data.group)).size,12);
for(const {path,data:r} of groups){assert.equal(r.head,head);assert.equal(r.sourceHash,hash);assert.ok(r.success,r.group);for(const c of r.commands){assert.equal(c.code,0);assert.equal(sha(readFileSync(path+'/'+c.log)),c.sha256)}}
const files=groups.flatMap(g=>g.data.files),expected=readdirSync('tests').filter(f=>/\.(e2e|smoke)\.mjs$/.test(f)).sort();assert.equal(expected.length,86);assert.deepEqual(files.map(f=>f.file).sort(),expected);assert.ok(files.every(f=>f.code===0&&f.sourceHash===hash));
const by=id=>groups.find(g=>g.data.group===id),unit=by('unit'),unitLog=readFileSync(unit.path+'/unit.log','utf8').replace(/\x1b\[[0-9;]*m/g,'');assert.match(unitLog,/Tests\s+2944 passed \(2944\)/);assert.match(unitLog,/Test Files\s+45 passed \(45\)/);
const maps=JSON.parse(readFileSync(by('layouts').path+'/map-cases.json'));assert.equal(maps.cases.length,644);assert.equal(new Set(maps.cases.map(c=>c.map+':'+c.width)).size,644);assert.deepEqual(maps.pageErrors,[]);
const fresh=JSON.parse(readFileSync(by('fresh').path+'/journey/result.json'));assert.equal(fresh.battles,109);assert.equal(fresh.events,452);assert.equal(fresh.reloads,18);assert.equal(fresh.progressWritesFromTest,0);assert.deepEqual(fresh.pageErrors,[]);
for(const g of groups)assert.deepEqual(g.data.build.artifacts,unit.data.build.artifacts);
const evidence='docs/test-results/v28-ci';mkdirSync(evidence,{recursive:true});const images=new Map();
for(const g of groups){cpSync(g.path,evidence+'/'+g.data.group,{recursive:true,filter:p=>!p.endsWith('/screenshots')});for(const s of g.data.screenshots){const b=readFileSync(g.path+'/screenshots/'+s.file);assert.equal(sha(b),s.sha256);assert.ok(b.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')));assert.equal(b.readUInt32BE(16),s.width);assert.equal(s.width,Number(s.file.match(/-(320|390|430)\.png$/)[1]));copyFileSync(g.path+'/screenshots/'+s.file,'docs/screenshots/'+s.file);images.set(s.file,s)}}
assert.equal(images.size,15);
const report={version:'v2.8',status:'passed',head,source_hash:hash,unit:{passed:2944,files:45,default_deadline_ms:5000},browser:{files:86,rows:files},map_layout:{maps:161,cases:644,widths:[320,390,430,768]},fresh_browser:{chapters:18,battles:109,events:452,reloads:18,progressWritesFromTest:0,pageErrors:[]},screenshots:[...images.values()],workers:groups.map(g=>g.data),build:{success:true,artifacts:unit.data.build.artifacts},save:{key:'astra-chronica:v1',version:2},limitations:['iPhone Safari実機は未確認。Chromiumタッチ操作で検証。','既存Phaserチャンク警告あり。'],merged:false,published:false};writeFileSync('docs/test-results/v28-ci.json',JSON.stringify(report,null,2)+'\n');console.log('V28_FINAL '+JSON.stringify({success:true,unit:2944,browser:86,maps:161,cases:644,screenshots:15,hash}));
