import type {AdventureProgress} from '../adventure';
export type Resonance='silent'|'faint'|'linked'|'calm';
export function resonancePhase(a:AdventureProgress):Resonance{const done=a.chapters['chapter-11']?.completed??[];return done.includes('c11-clear')?'calm':done.includes('c11-vault-code')?'linked':done.includes('c11-stones-reading')?'faint':'silent'}
export const resonanceLabel=(phase:Resonance)=>({silent:'沈黙',faint:'微かな共鳴',linked:'星声の共鳴',calm:'鎮静'})[phase];
