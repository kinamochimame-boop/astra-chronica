import {readFileSync} from 'node:fs';
import {completedSave as previous} from './chapter-fifteen-fixture.mjs';
const raw=readFileSync(new URL('../src/data/chapter-sixteen.ts',import.meta.url),'utf8');
export const definition=JSON.parse(raw.slice(raw.indexOf('{',raw.indexOf('export const')),raw.lastIndexOf('}')+1));
export const newChoiceIds=['c16-elsia','c16-kyle','c16-lyria','c16-tower-reading','c16-promise'];
export function priorSave(){const p=previous();p.adventure.selectedChapterId='chapter-16';delete p.world;p.equipment.equipped={astel:'starcrown-duals',rina:'voidward-shield-rapier',mei:'astral-wand'};return p}
export function completedSave(){const p=priorSave();p.adventure.chapters['chapter-16']={currentLocationId:'c16-core',completed:definition.events.map(e=>e.id)};for(const id of newChoiceIds)p.choices[id]='confirm';Object.assign(p.equipment.inventory,{'grave-longbow':1,'endward-shield-spear':1,'memory-rod':1});p.world={mapId:'grave-core',x:112,y:400,facing:'right',defeated:[],opened:[]};return p}
export function projectionSave(phase){const p=priorSave(),last={severed:'c16-field-cache',projected:'c16-projection',connected:'c16-connection',integrated:'c16-integration'}[phase],count=definition.events.findIndex(e=>e.id===last)+1;const completed=definition.events.slice(0,count).map(e=>e.id);p.adventure.chapters['chapter-16']={currentLocationId:'c16-monuments',completed};for(const id of newChoiceIds.filter(id=>completed.includes(id)))p.choices[id]='confirm';p.world={mapId:'grave-ruins',x:112,y:400,facing:'right',defeated:[],opened:[]};return p}
