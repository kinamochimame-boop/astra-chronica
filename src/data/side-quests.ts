import type {ItemId} from '../consumables';
export interface SideQuest {id:string;chapterId:string;name:string;giver:string;description:string;returnLocation:string;objectives:{id:string;name:string;locationId:string;requires:string[]}[];reward:{item?:ItemId;count?:number;experience?:number}}
export const sideQuests:readonly SideQuest[]=[
 {id:'sq-windvane',chapterId:'chapter-03',name:'SQ-01 失われた風見鶏',giver:'見張りのトル',description:'採掘跡で歯車を探し、見張り台の風見鶏を修理する。',returnLocation:'c3-watch',objectives:[{id:'vane-gear',name:'採掘跡で予備の歯車を探す',locationId:'c3-mine',requires:[]},{id:'vane-repair',name:'見張り台で風見鶏を修理する',locationId:'c3-watch',requires:['vane-gear']}],reward:{item:'potion',count:2}},
 {id:'sq-fio-keepsake',chapterId:'chapter-03',name:'SQ-02 フィオの忘れ物',giver:'フィオ',description:'吊り橋に残された、大切な風読みの組紐を探して届ける。',returnLocation:'c3-camp',objectives:[{id:'fio-cord',name:'吊り橋の欄干で組紐を見つける',locationId:'c3-bridge',requires:[]}],reward:{experience:180}},
 {id:'sq-sky-fragments',chapterId:'chapter-03',name:'SQ-03 空の欠片を集めて',giver:'採掘者ロロ',description:'採掘跡・見張り台・庭園の結晶片を各1つ集め、採掘者へ届ける。',returnLocation:'c3-mine',objectives:[{id:'shard-mine',name:'採掘跡の結晶片',locationId:'c3-mine',requires:[]},{id:'shard-watch',name:'見張り台の結晶片',locationId:'c3-watch',requires:[]},{id:'shard-garden',name:'庭園の結晶片',locationId:'c3-garden',requires:[]}],reward:{item:'ether',count:2}},
];
