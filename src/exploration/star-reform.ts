import type {AdventureProgress} from '../adventure';
export type ReformPhase='severed'|'connected'|'resonant'|'reformed';
export function reformPhase(a:AdventureProgress):ReformPhase{const done=a.chapters['chapter-18']?.completed??[];return done.includes('c18-reform')?'reformed':done.includes('c18-resonate')?'resonant':done.includes('c18-connect')?'connected':'severed'}
export const reformLabel=(s:ReformPhase)=>({severed:'星の断絶',connected:'記憶の接続',resonant:'約束の共鳴',reformed:'星の再編'})[s];
