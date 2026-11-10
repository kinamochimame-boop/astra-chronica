import {describe,it,expect} from 'vitest';
import {walkTargetReached} from './map-driver-v15.mjs';
describe('touch contact navigation reaches a grid cell before re-reading a moving target',()=>{
 const state={tile:32,hero:{x:624,y:496}};
 it('finishes the contact waypoint for fractional patrol coordinates in the same cell',()=>{expect(walkTargetReached(state,{x:632.25,y:496.5},3,true)).toBe(true)});
 it('retains the exact near threshold for ordinary exploration and object approaches',()=>{expect(walkTargetReached(state,{x:632.25,y:496.5},3,false)).toBe(false);expect(walkTargetReached(state,{x:626,y:496},3,false)).toBe(true)});
 it('does not finish contact waypoints in a different grid cell',()=>{expect(walkTargetReached(state,{x:656.1,y:496},3,true)).toBe(false)});
 it('keeps the existing near tolerance even across a cell boundary',()=>{const edge={tile:32,hero:{x:639.9,y:496}};expect(walkTargetReached(edge,{x:640.1,y:496},3,false)).toBe(true);expect(walkTargetReached(edge,{x:640.1,y:496},3,true)).toBe(true)});
 it('moves a hero at a cell corner toward the centre before waiting for contact',()=>{const corner={tile:32,hero:{x:610,y:482}};expect(walkTargetReached(corner,{x:638,y:510},3,true)).toBe(false);expect(walkTargetReached(state,{x:638,y:510},3,true)).toBe(true)});
});
