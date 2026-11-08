import type {AdventureProgress} from '../adventure';
export const phaseLinks=['anchor','observe','choice'] as const;
export type PhaseLink=typeof phaseLinks[number];
export const linkLabel=(id:PhaseLink)=>({anchor:'座標',observe:'観測',choice:'選択'})[id];
export type StellarPhase='chaotic'|'synced'|'inverted'|'stable';
export function phaseOrder(a:AdventureProgress):PhaseLink[]{
 const done=a.chapters['chapter-15']?.completed??[];
 return done.filter(id=>phaseLinks.some(d=>id==='c15-link-'+d)).map(id=>id.slice('c15-link-'.length) as PhaseLink);
}
export function stellarPhase(a:AdventureProgress):StellarPhase{
 const done=a.chapters['chapter-15']?.completed??[];
 return done.includes('c15-clear')?'stable':done.includes('c15-key')?'inverted':done.includes('c15-awakening')?'synced':'chaotic';
}
export const phaseLabel=(p:StellarPhase)=>({chaotic:'位相混乱',synced:'位相同期',inverted:'位相反転',stable:'位相安定'})[p];
/** Includes door order because doors change effective terrain inside the same phase. */
export const phaseKey=(a:AdventureProgress)=>stellarPhase(a)+':'+phaseOrder(a).join(',');
export function phaseResponse(a:AdventureProgress){
 const order=phaseOrder(a),names=order.map(linkLabel).join(' → ');
 if(!order.length)return 'アステル：この端末から始めよう。別の接続も、後で確かめられるようにするよ。';
 const replies={anchor:'メイ：最初に固定した座標を基準に、別の接続も測り直そう。',observe:'リナ：最初に確かめた観測値だけで、他の道を決めないようにね。',choice:'アリア：最初に選んだ接続も、決まった未来ではありません。違う道を残しましょう。'};
 return `確定した順序：${names}。${replies[order[0]]}`;
}
