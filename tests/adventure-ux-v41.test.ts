/// <reference types="vite/client" />
import {describe,it,expect} from 'vitest';
import {ViewSession,captureReturnSpot,returnScroll} from '../src/adventure-view-navigation';
import {fresh,load,SAVE_KEY} from '../src/save';
import {adventureCompass} from '../src/adventure-compass';
import {createBackup,parseBackup} from '../src/save-backup';
import {learnGrowthNode} from '../src/growth-edit';
const oldSaves=import.meta.glob<string>('./balance-v36/old-save-chapter-*.json',{query:'?raw',import:'default',eager:true});
describe('v4.1 transient adventure view navigation',()=>{
 it('allows a connected current view',()=>{const v=new ViewSession(),owner={isConnected:true};let n=0;v.enter();v.guard(owner,()=>n++)();expect(n).toBe(1)});
 it('blocks detached buttons',()=>{const v=new ViewSession(),owner={isConnected:true};let n=0;const run=v.guard(owner,()=>n++);owner.isConnected=false;run();expect(n).toBe(0)});
 it('blocks a stale callback even when the shared content element remains connected',()=>{const v=new ViewSession(),owner={isConnected:true};let n=0;const old=v.guard(owner,()=>n++);v.enter();old();expect(n).toBe(0);v.guard(owner,()=>n++)();expect(n).toBe(1)});
 it('does not repeat a screen-changing action on double input',()=>{const v=new ViewSession();let n=0;const run=v.guard({isConnected:true},()=>{n++;v.enter()});run();run();expect(n).toBe(1)});
 it.each([NaN,Infinity,-1])('sanitizes invalid transient scroll %s',value=>expect(captureReturnSpot('world','map',value).scrollY).toBe(0));
 it('retains a bounded return-focus label outside saved progress',()=>{const spot=captureReturnSpot('world','map',169,'装備へ');expect(spot.focusLabel).toBe('装備へ');expect(captureReturnSpot('home',undefined,0,'a'.repeat(200)).focusLabel).toHaveLength(80);expect(fresh()).not.toHaveProperty('focusLabel')});
 it('keeps a finite return position without persisting it',()=>{const p=fresh(),before=structuredClone(p),spot=captureReturnSpot('world','mistwood-camp',137.5);expect(returnScroll(spot,'world','mistwood-camp')).toBe(137.5);expect(p).toEqual(before)});
 it('does not restore scroll from a different map',()=>expect(returnScroll(captureReturnSpot('world','a',150),'world','b')).toBe(0));
 it('does not restore scroll to another screen',()=>expect(returnScroll(captureReturnSpot('world','a',150),'equipment','a')).toBe(0));
 it('preserves the home return position',()=>expect(returnScroll(captureReturnSpot('home',undefined,220),'home')).toBe(220));
 it('keeps growth rollback and refuses a stale edit',()=>{const p=fresh();p.party.astel.level=2;const before=structuredClone(p),v=new ViewSession();let calls=0;const run=v.guard({isConnected:true},()=>{calls++;expect(learnGrowthNode(p,'astel','astel-sword-edge',()=>false,{inBattle:false}).ok).toBe(false)});run();expect(p).toEqual(before);v.enter();run();expect(calls).toBe(1)});
 it.each(['01','09','18'])('UI state never changes restored chapter %s progress/backup',chapter=>{const p=load({getItem:()=>oldSaves['./balance-v36/old-save-chapter-'+chapter+'.json']}),before=structuredClone(p);adventureCompass(p);captureReturnSpot('world',p.world?.mapId,200);const roundtrip=parseBackup(createBackup(p).text).progress;expect(p).toEqual(before);for(const key of ['party','equipment','adventure','quests','choices','skillTree','builds','survey'] as const)expect(roundtrip[key]).toEqual(p[key]);expect(roundtrip.version).toBe(2);expect(SAVE_KEY).toBe('astra-chronica:v1')});
});
