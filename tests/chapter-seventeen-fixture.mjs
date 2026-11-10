import {readFileSync} from 'node:fs';
import {completedSave as previous} from './chapter-sixteen-fixture.mjs';
const raw=readFileSync(new URL('../src/data/chapter-seventeen.ts',import.meta.url),'utf8');
export const definition=JSON.parse(raw.slice(raw.indexOf('{',raw.indexOf('export const')),raw.lastIndexOf('}')+1));
export const newChoiceIds=['c17-seline','c17-orphe','c17-tia','c17-branch','c17-promise'];
export function priorSave(){const p=previous();p.adventure.selectedChapterId='chapter-17';delete p.world;p.equipment.equipped={astel:'grave-longbow',rina:'endward-shield-spear',mei:'memory-rod'};return p}
export function completedSave(){const p=priorSave();p.adventure.chapters['chapter-17']={currentLocationId:'c17-heart',completed:definition.events.map(e=>e.id)};for(const id of newChoiceIds)p.choices[id]='confirm';Object.assign(p.equipment.inventory,{'starpath-sword':1,'promiseward-shield-spear':1,'destiny-rod':1});p.world={mapId:'terminal-heart',x:112,y:400,facing:'right',defeated:[],opened:[]};return p}
export function fateSave(phase,route='confirm'){const p=priorSave(),last={fixed:'c17-plaza-cache',decoded:'c17-decode',branched:'c17-branch',reconnected:'c17-reconnect'}[phase],count=definition.events.findIndex(e=>e.id===last)+1;const completed=definition.events.slice(0,count).map(e=>e.id);p.adventure.chapters['chapter-17']={currentLocationId:'c17-library',completed};for(const id of newChoiceIds.filter(id=>completed.includes(id)))p.choices[id]=id==='c17-branch'?route:'confirm';p.world={mapId:'terminal-library',x:112,y:400,facing:'right',defeated:[],opened:[]};return p}
