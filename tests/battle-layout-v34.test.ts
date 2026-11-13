import {describe,it,expect} from 'vitest';
import {BattleGesture} from '../src/atb-gesture';
const p=(x=10,y=10,id=1)=>({clientX:x,clientY:y,pointerId:id});
describe('v3.4 scrolling never becomes a command',()=>{
 it('accepts ordinary touch and mouse clicks',()=>{const g=new BattleGesture();g.start(p());expect(g.allowsClick(1)).toBe(true)});
 it.each([[10,80],[80,10],[18,18]])('suppresses a real drag to %s,%s', (x,y)=>{const g=new BattleGesture();g.start(p());g.move(p(x,y));expect(g.allowsClick(1)).toBe(false)});
 it('allows small touch jitter at the exact threshold',()=>{const g=new BattleGesture();g.start(p());g.move(p(18,10));expect(g.allowsClick(1)).toBe(true)});
 it('does not turn a drag back into a click when the finger returns',()=>{const g=new BattleGesture();g.start(p());g.move(p(60,10));g.move(p());expect(g.allowsClick(1)).toBe(false)});
 it('keeps native keyboard activation available after scrolling',()=>{const g=new BattleGesture();g.start(p());g.move(p(10,90));expect(g.allowsClick(0)).toBe(true)});
 it('resets on the next deliberate tap',()=>{const g=new BattleGesture();g.start(p());g.move(p(10,90));g.start(p());expect(g.allowsClick(1)).toBe(true)});
 it('cancellation blocks compatibility clicks',()=>{const g=new BattleGesture();g.start(p());g.cancel(p());expect(g.allowsClick(1)).toBe(false)});
 it('another pointer cannot mark the current gesture as dragged',()=>{const g=new BattleGesture();g.start(p());g.move(p(90,90,2));g.cancel(p(90,90,2));expect(g.allowsClick(1)).toBe(true)});
 it('disposal clears state before reuse',()=>{const g=new BattleGesture();g.start(p());g.move(p(90,90));g.clear();expect(g.allowsClick(1)).toBe(true)});
 it('reads native event prototype properties',()=>{const g=new BattleGesture(),event=Object.create(p());g.start(event);g.move(p(80,10));expect(g.allowsClick(1)).toBe(false)});
 it('copies the origin rather than retaining a mutable event',()=>{const g=new BattleGesture(),event=p();g.start(event);event.clientY=90;g.move(event);expect(g.allowsClick(1)).toBe(false)});
});
