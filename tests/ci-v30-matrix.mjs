/** Balance every existing browser file; each runner owns only one browser at a time. */
import {readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const files=readdirSync('tests').filter(f=>/\.(e2e|smoke)\.mjs$/.test(f)).sort();
assert.equal(files.length,94);
function weight(f){if(f==='browser.e2e.mjs')return 10;if(f==='atb-v30.e2e.mjs')return 6;if(f==='full-journey-v26.e2e.mjs')return 45;if(/^chapter-.*-v\d+\.e2e\.mjs$/.test(f)&&!/(equipment|layout|ui)/.test(f))return 32;if(/^exploration-v\d+\.e2e\.mjs$/.test(f))return 16;if(f.endsWith('.smoke.mjs'))return 1;if(/-ui\.e2e\.mjs$/.test(f))return 8;return 4;}
const shards=Array.from({length:26},(_,i)=>({id:'shard-'+String(i).padStart(2,'0'),files:[],estimatedMinutes:0}));
for(const file of [...files].sort((a,b)=>weight(b)-weight(a)||a.localeCompare(b))){const shard=[...shards].sort((a,b)=>a.estimatedMinutes-b.estimatedMinutes||a.id.localeCompare(b.id))[0];shard.files.push(file);shard.estimatedMinutes+=weight(file);}
assert.ok(shards.every(s=>s.files.length>0));assert.deepEqual(shards.flatMap(s=>s.files).sort(),files);
export const browserShards=shards.sort((a,b)=>b.estimatedMinutes-a.estimatedMinutes||a.id.localeCompare(b.id));
if(process.argv[1]?.endsWith('ci-v30-matrix.mjs'))process.stdout.write('groups='+JSON.stringify(browserShards.map(s=>s.id))+'\n');
