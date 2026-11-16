import {describe,it,expect} from 'vitest';
import {ViewFrameLoop,type FrameDriver} from '../src/view-frame-loop';
function setup(tick=(_:number)=>true,first=1){let serial=first;const pending=new Map<number,FrameRequestCallback>(),cancelled:number[]=[];const driver:FrameDriver={request:fn=>{const id=serial++;pending.set(id,fn);return id},cancel:id=>{cancelled.push(id);pending.delete(id)}};const loop=new ViewFrameLoop(tick,driver);const fire=(time=100)=>{const [id,fn]=[...pending][0];pending.delete(id);fn(time)};return {loop,pending,cancelled,fire}}
describe('view-owned frame lifecycle',()=>{
 it('does not schedule until resumed',()=>expect(setup().pending.size).toBe(0));
 it('schedules one frame on resume',()=>{const s=setup();s.loop.resume();expect(s.pending.size).toBe(1)});
 it('coalesces repeated resumes',()=>{const s=setup();for(let i=0;i<20;i++)s.loop.resume();expect(s.pending.size).toBe(1)});
 it('passes the actual browser timestamp through without a time formula',()=>{const seen:number[]=[],s=setup(t=>{seen.push(t);return true});s.loop.resume();s.fire(123.456);expect(seen).toEqual([123.456])});
 it('keeps only one successor',()=>{const s=setup();s.loop.resume();for(let i=0;i<20;i++)s.fire();expect(s.pending.size).toBe(1)});
 it('stops when the owner reports completion',()=>{const s=setup(()=>false);s.loop.resume();s.fire();expect(s.pending.size).toBe(0)});
 it('cancels the outstanding frame on suspension',()=>{const s=setup();s.loop.resume();s.loop.suspend();expect(s.cancelled).toEqual([1]);expect(s.pending.size).toBe(0)});
 it('supports repeated suspension',()=>{const s=setup();s.loop.resume();s.loop.suspend();s.loop.suspend();expect(s.cancelled).toEqual([1])});
 it('rejects callbacks captured before suspend even after resume',()=>{let calls=0;const s=setup(()=>{calls++;return true});s.loop.resume();const stale=[...s.pending.values()][0];s.loop.suspend();s.loop.resume();stale(500);expect(calls).toBe(0);expect(s.pending.size).toBe(1);s.fire();expect(calls).toBe(1)});
 it('cancels and disposes idempotently',()=>{const s=setup();s.loop.resume();s.loop.dispose();s.loop.dispose();expect(s.cancelled).toEqual([1])});
 it('never restarts a disposed owner',()=>{const s=setup();s.loop.dispose();s.loop.resume();expect(s.pending.size).toBe(0)});
 it('rejects a captured callback after disposal',()=>{let calls=0;const s=setup(()=>{calls++;return true});s.loop.resume();const stale=[...s.pending.values()][0];s.loop.dispose();stale(1);expect(calls).toBe(0)});
 it('does not reschedule after disposal from a tick',()=>{const s=setup(()=>{s.loop.dispose();return true});s.loop.resume();s.fire();expect(s.pending.size).toBe(0)});
 it('does not reschedule after suspension from a tick',()=>{const s=setup(()=>{s.loop.suspend();return true});s.loop.resume();s.fire();expect(s.pending.size).toBe(0)});
 it('handles a zero-valued frame ID',()=>{const s=setup(undefined,0);s.loop.resume();s.loop.dispose();expect(s.cancelled).toEqual([0])});
 it('does not accumulate callbacks over twenty background returns',()=>{const s=setup();s.loop.resume();for(let i=0;i<20;i++){s.loop.suspend();s.loop.resume();s.loop.resume();s.fire()}expect(s.pending.size).toBe(1);s.loop.dispose();expect(s.pending.size).toBe(0)});
});
