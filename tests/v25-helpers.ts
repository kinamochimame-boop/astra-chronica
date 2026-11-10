import {full as previousFull} from './v24-helpers';
import {complete} from './v15-helpers';
import {chapterSeventeen} from '../src/data/chapter-seventeen';
const legacy=previousFull();
legacy.equipment.equipped={astel:'grave-longbow',rina:'endward-shield-spear',mei:'memory-rod'};
export const ready=()=>structuredClone(legacy);
export const full=()=>{const p=ready();complete(p,chapterSeventeen);return p};
