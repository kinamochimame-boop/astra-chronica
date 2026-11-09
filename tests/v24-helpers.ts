import {full as previousFull} from './v23-helpers';
import {complete} from './v15-helpers';
import {chapterSixteen} from '../src/data/chapter-sixteen';
const legacy=previousFull();
legacy.equipment.equipped={astel:'starcrown-duals',rina:'voidward-shield-rapier',mei:'astral-wand'};
export const ready=()=>structuredClone(legacy);
export const full=()=>{const p=ready();complete(p,chapterSixteen);return p};
