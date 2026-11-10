/** Sequential, reproducible browser manifest. Existing per-feature npm scripts remain available. */
import {readdirSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const files=readdirSync(new URL('.',import.meta.url)).filter(f=>/\.(e2e|smoke)\.mjs$/.test(f)).sort();
const chosen=process.argv.includes('--v26')?files.filter(f=>/(eighteen|v26|finale-boss)/.test(f)):process.argv.includes('--v25')?files.filter(f=>/(seventeen|v25)/.test(f)):process.argv.includes('--legacy')?files.filter(f=>!/(sixteen|v24|seventeen|v25)/.test(f)):process.argv.includes('--v24')?files.filter(f=>/(sixteen|v24)/.test(f)):process.argv.includes('--v23')?files.filter(f=>/(fifteen|v23)/.test(f)):process.argv.includes('--v22')?files.filter(f=>/(fourteen|v22)/.test(f)):process.argv.includes('--v21')?files.filter(f=>/(thirteen|v21)/.test(f)):process.argv.includes('--v20')?files.filter(f=>/(twelve|v20)/.test(f)):files;
let failed=0;
for(const file of chosen){console.log(`\n>>> ${file}`);const env={...process.env,UI_TEST_URL:process.env.UI_TEST_URL||'http://localhost:5173'};if(file.endsWith('.smoke.mjs'))env.CHROMIUM_PATH=process.env.WEBGL_CHROMIUM_PATH||'/usr/bin/chromium';const child=spawn(process.execPath,[fileURLToPath(new URL(file,import.meta.url))],{stdio:'inherit',env});const code=await new Promise(resolve=>child.on('exit',resolve));if(code!==0){failed++;console.error(`FAIL ${file} (${code})`)}else console.log(`PASS ${file}`)}
console.log(`Browser suite: ${chosen.length-failed}/${chosen.length} files passed`);if(failed)process.exitCode=1;
