import {full as prior} from './v25-helpers';
import {complete} from './v15-helpers';
import {chapterEighteen as c} from '../src/data/chapter-eighteen';
import {advanceEnding,nextEndingEvent} from '../src/ending';
const legacy=prior();
export const ready=()=>structuredClone(legacy);
export function beforeEnding(){const p=ready();complete(p,c,'c18-final-boss');return p}
export function full(){const p=beforeEnding();for(let e=nextEndingEvent(p);e;e=nextEndingEvent(p)){const r=advanceEnding(p,e.id,()=>true);if(!r.ok)throw Error(r.message)}return p}
