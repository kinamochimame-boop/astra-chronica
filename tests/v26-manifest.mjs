import {readFileSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {productionFingerprint} from './production-fingerprint.mjs';
const path=process.env.V26_MANIFEST_PATH||join(tmpdir(),'astra-v26-manifest.json'),hash=productionFingerprint();
let data=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):null;
if(data?.sourceHash!==hash||!data?.encounters||!data?.treeBranches){const result=spawnSync(process.execPath,['node_modules/vitest/vitest.mjs','run','tests/final-integration-v26.test.ts','--testNamePattern','all eighteen chapter definitions','--pool=threads','--maxWorkers=1','--no-file-parallelism'],{cwd:fileURLToPath(new URL('../',import.meta.url)),env:{...process.env,V26_MANIFEST_PATH:path},encoding:'utf8'});if(result.status!==0)throw Error('Read-only manifest generation failed: '+result.stdout+result.stderr);data=JSON.parse(readFileSync(path,'utf8'))}
if(data.sourceHash!==hash)throw Error('The UI test manifest is stale');
export const manifest=data;
