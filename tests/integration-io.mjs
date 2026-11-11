import {writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {productionFingerprint} from './production-fingerprint.mjs';
export function writeManifestIfRequested(data){writeFileSync(process.env.V26_MANIFEST_PATH||join(tmpdir(),'astra-v26-manifest.json'),JSON.stringify({...data,sourceHash:productionFingerprint()}))}
export function recordIntegrationResult(data){console.log('Fresh API journey:',JSON.stringify({chapters:data.chapters,battles:data.battles,cleared:data.cleared}));if(process.env.V26_API_RESULT_PATH)writeFileSync(process.env.V26_API_RESULT_PATH,JSON.stringify(data,null,2))}
