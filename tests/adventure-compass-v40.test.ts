import {describe,it,expect} from 'vitest';
import {fresh,load} from '../src/save';
import {adventureCompass,normalizeTrackedQuest,trackQuest,questStatus} from '../src/adventure-compass';
import {chapterOne,chapters} from '../src/data/chapter-one';
import {sideQuests} from '../src/data/side-quests';
import {mainObjective} from '../src/exploration/objective';
import {acceptQuest} from '../src/side-quests';
describe('v4.0 derived adventure compass',()=>{
 it('reuses existing objective without revealing later chapters',()=>{const p=fresh(),c=adventureCompass(p);expect(c.chapter).toBe(chapterOne);expect(c.goal).toEqual(mainObjective(p.adventure,chapterOne));expect(c.completed).toBe(0);expect(c.total).toBe(chapterOne.events.length);expect(c.quests).toHaveLength(0)});
 it('updates after confirmed progress and never uses locked selected chapter',()=>{const p=fresh();p.adventure.selectedChapterId=chapters[17].id;expect(adventureCompass(p).chapter).toBe(chapterOne);p.adventure.chapters[chapterOne.id]={currentLocationId:chapterOne.locations[0].id,completed:['c1-departure']};expect(adventureCompass(p).goal.eventId).toBe('c1-first-battle');expect(adventureCompass(p).completed).toBe(1)});
 it('announces completed chapter without revealing next events',()=>{const p=fresh();p.adventure.chapters[chapterOne.id]={currentLocationId:chapterOne.locations[6].id,completed:chapterOne.events.map(e=>e.id)};expect(adventureCompass(p).goal.eventId).toBeUndefined();expect(adventureCompass(p).completed).toBe(chapterOne.events.length)});
 it('rejects unknown, unaccepted and claimed tracking',()=>{const p=fresh(),q=sideQuests[0];expect(normalizeTrackedQuest('bad',p)).toBeUndefined();expect(trackQuest(p,q.id,()=>true).ok).toBe(false)});
 it('tracks available accepted quests, persists and rolls back failures',()=>{const p=fresh();for(const c of chapters.slice(0,2))p.adventure.chapters[c.id]={currentLocationId:c.locations[0].id,completed:c.events.map(e=>e.id)};const q=sideQuests.find(q=>q.chapterId===chapters[2].id)!;expect(acceptQuest(p,q.id)).toBe(true);expect(questStatus(p,q)).toBe('進行中');expect(trackQuest(p,q.id,()=>true).ok).toBe(true);expect(adventureCompass(p).tracked?.id).toBe(q.id);expect(trackQuest(p,undefined,()=>false).ok).toBe(false);expect(p.trackedQuestId).toBe(q.id);expect(load({getItem:()=>JSON.stringify(p)}).trackedQuestId).toBe(q.id);p.quests[q.id].claimed=true;expect(normalizeTrackedQuest(q.id,p)).toBeUndefined()});
 it('old saves omit optional tracking safely',()=>expect(load({getItem:()=>JSON.stringify(fresh())}).trackedQuestId).toBeUndefined());
});
