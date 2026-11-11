import {describe,it,expect} from 'vitest';
import {ready,full} from './v26-helpers';
import {arrange,complete} from './v15-helpers';
import {chapterEighteen as c} from '../src/data/chapter-eighteen';
import {walkMaps,mapById} from '../src/exploration/map-data';
import {finalMaps} from '../src/exploration/chapter-eighteen-maps';
import {activeMap} from '../src/exploration/active-map';
import {clearCircle} from '../src/exploration/collision';
import {approachPoint} from '../src/exploration/approach';
import {findPath} from '../src/exploration/pathfinding';
import {enterMap} from '../src/exploration/exploration-save';
import {reformPhase} from '../src/exploration/star-reform';
import {chapterState,chapterOpen} from '../src/adventure';
import {load} from '../src/save';
const completed=full();
describe('ninety-map compatibility and shared effective grid',()=>{
 it('retains all82 IDs and adds eight final maps without a chapter19',()=>{expect(walkMaps).toHaveLength(90);expect(new Set(walkMaps.map(m=>m.id)).size).toBe(90);expect(walkMaps.slice(82)).toEqual(finalMaps);expect(finalMaps).toHaveLength(8)});
 for(const m of walkMaps){
  it(m.id+' retains safe collision, actual reachable object approaches and valid exits',()=>{const p=structuredClone(completed),map=activeMap(m,p.adventure,p.choices);expect(clearCircle(map,map.entry)).toBe(true);expect(map.grid).toHaveLength(map.height);for(const o of map.objects){const goal=approachPoint(map,map.entry,o);expect(goal,o.id).toBeTruthy();expect(findPath(map,map.entry,goal!),o.id).not.toBeNull();if(o.targetMap)expect(mapById(o.targetMap),o.id).toBeTruthy()}expect(m.grid).toHaveLength(m.height)});
  it(m.id+' save/reload repairs invalid wall positions without losing equipment or previous chapters',()=>{const p=structuredClone(completed);expect(enterMap(p,m.id)).toBe(true);Object.assign(p.world!,{x:-999,y:-999});const normalized=load({getItem:()=>JSON.stringify(p)}),map=activeMap(m,normalized.adventure,normalized.choices);expect(normalized.world?.mapId).toBe(m.id);expect(clearCircle(map,normalized.world!)).toBe(true);expect(normalized.party).toEqual(p.party);expect(normalized.equipment).toEqual(p.equipment);expect(normalized.skillTree).toEqual(p.skillTree);expect(normalized.adventure.chapters['chapter-17']?.completed).toEqual(p.adventure.chapters['chapter-17']?.completed)});
 }
 it.each(['severed','connected','resonant','reformed'] as const)('%s is derived only from confirmed events, never raw flags',phase=>{const p=ready(),last={severed:'c18-memory-cache',connected:'c18-connect',resonant:'c18-resonate',reformed:'c18-reform'}[phase];complete(p,c,last);expect(reformPhase(p.adventure)).toBe(phase);for(const m of finalMaps){const map=activeMap(m,p.adventure,p.choices),opens=phase==='severed'?0:phase==='connected'?1:phase==='resonant'?2:3;for(const [i,g] of m.gates!.entries())expect(map.grid[g.area.y][g.area.x]).toBe(i<opens?'.':'#');expect(m.grid[17][23]).toBe('.')}expect(reformPhase(load({getItem:()=>JSON.stringify(p)}).adventure)).toBe(phase)});
 it.each(finalMaps)('$id offers NPC,enemy,chest,inspect,minimap-compatible gates and valid unlocked entry',m=>{expect(m.objects.some(o=>o.kind==='npc')).toBe(true);expect(m.objects.some(o=>o.kind==='chest')).toBe(true);expect(m.objects.some(o=>o.kind==='inspect')).toBe(true);expect(m.symbols.length).toBeGreaterThan(0);expect(m.gates).toHaveLength(3);expect(enterMap(structuredClone(completed),m.id)).toBe(true)});
 it.each(finalMaps)('$id patrol waypoints remain traversable in all four reorganization phases',m=>{for(const last of ['c18-memory-cache','c18-connect','c18-resonate','c18-reform']){const p=ready();complete(p,c,last);const map=activeMap(m,p.adventure,p.choices);for(const symbol of m.symbols)for(const point of symbol.route){expect(clearCircle(map,point,symbol.radius),`${m.id}/${last}`).toBe(true);expect(findPath(map,symbol,point)).not.toBeNull()}}});
 it('new game cannot enter any finale map before chapter17 completion',()=>{for(const m of finalMaps){const p=ready();delete p.adventure.chapters['chapter-17'];expect(enterMap(p,m.id)).toBe(false)}});
});
