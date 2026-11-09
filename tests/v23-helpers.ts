import {chapters} from '../src/data/chapter-one';
import {chapterFifteen} from '../src/data/chapter-fifteen';
import {ready as beforeSeven,complete} from './v15-helpers';
const legacy=beforeSeven();for(const ch of chapters.slice(6,14))complete(legacy,ch);
for(const h of Object.values(legacy.party)){h.level=50;h.experience=0}
legacy.equipment.equipped={astel:'starsea-bow',rina:'arkward-shield-spear',mei:'oblivion-wand'};
/** A real v2.2-cap legacy save: discarded XP is not reconstructed. Every caller receives an isolated copy. */
export const ready=()=>structuredClone(legacy);
export const full=()=>{const p=ready();complete(p,chapterFifteen);return p};
