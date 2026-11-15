import {describe,it,expect} from 'vitest';
import {fresh,load,SAVE_KEY} from '../src/save';
import {walkMaps} from '../src/exploration/map-data';
import {MapSurvey,surveyFor,miniMapSnapshot} from '../src/exploration/minimap';
import {normalizeSurveyHistory} from '../src/exploration/survey-save';
import {MapRuntime} from '../src/exploration/map-runtime';
import {clearCircle,clearSegment} from '../src/exploration/collision';

describe('v3.8 survey safety',()=>{
 const map=walkMaps[0];
 it('restores compact seen and walked cells without changing gameplay data',()=>{const p=fresh(),before=structuredClone(p),survey=new MapSurvey(map.width,map.height);survey.discover(map,map.entry);p.survey={[map.id]:survey.snapshot()};const restored=load({getItem:key=>key===SAVE_KEY?JSON.stringify(p):null});expect(surveyFor(restored,map).snapshot()).toEqual(survey.snapshot());delete restored.survey;expect(restored).toEqual(before)});
 it('old saves have no synthetic discoveries',()=>{const p=load({getItem:()=>JSON.stringify(fresh())});expect(p.survey).toBeUndefined();expect(surveyFor(p,map).walkedCount).toBe(0)});
 it.each(['unknown','dimensions','oversized','negative','fraction','infinite'])('rejects %s history',kind=>{const raw={format:1,width:map.width,height:map.height,seen:[0],walked:[0]};let id=map.id;if(kind==='unknown')id='unknown';if(kind==='dimensions')raw.width++;if(kind==='oversized')raw.seen=Array(map.width*map.height+1).fill(0);if(kind==='negative')raw.seen=[-1];if(kind==='fraction')raw.seen=[.5];if(kind==='infinite')raw.seen=[Infinity];expect(normalizeSurveyHistory({[id]:raw})).toEqual({})});
 it('deduplicates and restricts walked cells to discovered cells',()=>{const r=normalizeSurveyHistory({[map.id]:{format:1,width:map.width,height:map.height,seen:[2,2,1],walked:[3,2,2]}})[map.id];expect(r.seen).toEqual([1,2]);expect(r.walked).toEqual([2])});
 it('isolates progress and lab objects',()=>{const a=fresh(),b=fresh();surveyFor(a,map).discover(map,map.entry);expect(surveyFor(b,map).walkedCount).toBe(0)});
 it('empty surveys reveal neither routes nor objectives',()=>{const p=fresh(),s=new MapSurvey(map.width,map.height),snapshot=miniMapSnapshot(p,map,map.entry,s);expect(snapshot.route).toEqual([]);expect(snapshot.objective).toBeUndefined();expect(snapshot.cells).toEqual([])});
 it('blocked taps only suggest reachable geometry and require confirmation',()=>{const rt=new MapRuntime(map,map.entry,()=>false,()=>false);const original={x:rt.hero.x,y:rt.hero.y};expect(rt.moveTo({x:1,y:1})).toBe(false);expect(rt.hero.path).toEqual([]);expect({x:rt.hero.x,y:rt.hero.y}).toEqual(original);if(rt.suggestion){expect(clearCircle(map,rt.suggestion)).toBe(true);expect(rt.moveTo(rt.suggestion)).toBe(true);let start=original;for(const end of rt.hero.path){expect(clearSegment(map,start,end)).toBe(true);start=end}}});
 it('paused and locked states reject movement and candidate creation',()=>{const rt=new MapRuntime(map,map.entry,()=>false,()=>false);rt.paused=true;expect(rt.moveTo({x:1,y:1})).toBe(false);expect(rt.suggestion).toBeUndefined();rt.paused=false;rt.locked=true;expect(rt.moveTo(map.entry)).toBe(false)});
 it('persists independent bounded history on every one of the 161 maps',()=>{const p=fresh();p.survey={};for(const m of walkMaps){const survey=new MapSurvey(m.width,m.height);survey.discover(m,m.entry);p.survey[m.id]=survey.snapshot()}const restored=load({getItem:()=>JSON.stringify(p)});for(const m of walkMaps)expect(surveyFor(restored,m).snapshot()).toEqual(p.survey[m.id]);expect(JSON.stringify(p.survey).length).toBeLessThan(200000)});
 it('draws a safe current objective route and never exposes unknown cells',()=>{const p=fresh(),m=walkMaps.find(m=>m.chapterId==='chapter-01')!,s=new MapSurvey(m.width,m.height);for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++){const q={x:(x+.5)*m.tile,y:(y+.5)*m.tile};if(clearCircle(m,q))s.discover(m,q)}const snapshot=miniMapSnapshot(p,m,m.entry,s);expect(snapshot.route.length).toBeGreaterThan(0);for(const points of snapshot.route)for(let i=1;i<points.length;i++)expect(clearSegment(m,{x:points[i-1].x*m.tile,y:points[i-1].y*m.tile},{x:points[i].x*m.tile,y:points[i].y*m.tile})).toBe(true)});
 it('keeps the complete 161-map registry unchanged',()=>expect(walkMaps).toHaveLength(161));
});
