import type {AdventureProgress} from '../adventure';
export type LightPath='dark'|'glimmer'|'linked'|'renewed';
export function lightPathPhase(a:AdventureProgress):LightPath{const done=a.chapters['chapter-12']?.completed??[];return done.includes('c12-clear')?'renewed':done.includes('c12-vault-code')?'linked':done.includes('c12-lake-light')?'glimmer':'dark'}
export const lightPathLabel=(phase:LightPath)=>({dark:'常闇',glimmer:'微光',linked:'星光連結',renewed:'再生'})[phase];
