import {ready as beforeSeven,complete} from './v15-helpers';
import {chapters} from '../src/data/chapter-one';
import type {Progress} from '../src/save';
const baselines=new Map<number,Progress>();
/** Identical deterministic prerequisite APIs, built once; each test gets exclusive mutable state. */
export function buildPrerequisite(count:number){const p=beforeSeven();for(const ch of chapters.slice(6,count))complete(p,ch);return p}
export function prerequisite(count:number){let base=baselines.get(count);if(!base){base=buildPrerequisite(count);baselines.set(count,base)}return structuredClone(base)}
