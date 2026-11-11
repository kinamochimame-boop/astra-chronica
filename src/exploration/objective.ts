import {isEarlyWalkingChapter} from './early-chapters';
import {chapterOpen,chapterState,eventOpen,locationOpen,type AdventureProgress} from '../adventure';
import type {Chapter} from '../data/chapter-one';
/** Only the first available unfinished event is revealed; never dialogue text or later events. */
export function mainObjective(a:AdventureProgress,c:Chapter){
 if(!chapterOpen(a,c))return {title:'この章は未解放です',destination:'手前の章',action:'現在の章を完了してください。',eventId:undefined,locationId:undefined};
 const state=chapterState(a,c),event=c.events.find(e=>!state.completed.includes(e.id));
 if(!event)return {title:'この章の冒険は完了しました',destination:'解放済みの地点',action:'依頼や調査を続けられます。',eventId:undefined,locationId:state.currentLocationId};
 const location=c.locations.find(l=>l.id===event.locationId)!,open=eventOpen(state,event)&&locationOpen(state,c,location.id);
 if(!open)return {title:'現在の地点の目的を進めましょう',destination:'未解放の行き先はまだ表示しません',action:'手前の地点の会話・調査・戦闘を完了してください。',eventId:undefined,locationId:state.currentLocationId};
 return {title:event.name,destination:location.name,action:(['battle','boss'].includes(event.kind)?'敵と戦う':event.kind==='treasure'?'宝箱を調べる':event.puzzle?'会話の後に手掛かりを組み合わせる':'話を聞く・調べる')+(state.currentLocationId===location.id?'。近くへ歩いて対象をタップ。':isEarlyWalkingChapter(c.id)?'。解放済みの出口から向かいましょう。':'。解放済みの出口・地点一覧から向かいましょう。'),eventId:event.id,locationId:location.id};
}
