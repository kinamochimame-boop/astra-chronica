import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
export function productionFingerprint(){const root=new URL('../src/',import.meta.url),hash=createHash('sha256');function scan(dir){for(const e of readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const path=new URL(e.name+(e.isDirectory()?'/':''),dir);if(e.isDirectory())scan(path);else {hash.update(path.pathname.slice(root.pathname.length));hash.update(readFileSync(path))}}}scan(root);return hash.digest('hex')}
