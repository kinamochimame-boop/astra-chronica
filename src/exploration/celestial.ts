import type {AdventureProgress} from '../adventure';
export type CelestialPhase='stopped'|'partial'|'synchronized'|'complete';
export function celestialPhase(a:AdventureProgress):CelestialPhase{const done=a.chapters['chapter-13']?.completed??[];return done.includes('c13-clear')?'complete':done.includes('c13-chart-sync')?'synchronized':done.includes('c13-aux-power')?'partial':'stopped'}
export const celestialLabel=(phase:CelestialPhase)=>({stopped:'停止',partial:'部分起動',synchronized:'星図同期',complete:'完全起動'})[phase];
