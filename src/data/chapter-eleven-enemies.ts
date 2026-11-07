import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number,color:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color,affinities:{},statusResistance:{sleep:.2,freeze:.2}});
export const paleEnemies={
 crab:{...make('white-scarab','白晶スカラベ',800,58,42,35,470,0x9e9eaa)},
 jelly:{...make('pilgrim-echo','巡礼の残響',820,55,34,34,480,0x8ad1d0),enemyMagic:{name:'忘れ声',power:90,element:'wind' as const,statuses:[{id:'paralysis' as const,chance:.2,turns:2}]}},
 wraith:{...make('starsand-wisp','星砂ウィスプ',740,56,30,48,490,0xb1c2d4),evasion:.12,attackStatuses:[{id:'blind' as const,chance:.2,turns:2}]},
 drone:{...make('silent-sentinel','無音の番兵',820,61,39,37,490,0xa0b6bc),enemyPattern:'archiveGuard' as const},
 lantern:{...make('record-eater','記録喰らい',780,56,33,41,500,0xd3c89c),enemyMagic:{name:'名を削る光',power:92,element:'light' as const,statuses:[{id:'silence' as const,chance:.2,turns:2}]}},
 hunter:{...make('fault-beast','断層の獣',700,57,29,65,470,0x88b9d2),normalAttackHits:2,affinities:{earth:1.25,water:.5}},
 guardian:{...make('pale-guardian','巡礼守護機・サイレンスガード',4100,61,41,39,1600,0x91c1c3),enemyPattern:'silenceGuard' as const},
 requiem:{...make('requiem','星声の封印者・エコーレクイエム',6000,62,35,43,2200,0xd7d4aa),enemyPattern:'requiem' as const,affinities:{dark:1.25,wind:.75,light:.5}},
};
export const paleEncounters:Record<string,{name:string;enemies:Unit[]}>= {
 'pale-road':{name:'白銀への街道',enemies:[paleEnemies.crab,paleEnemies.jelly,paleEnemies.hunter]},
 'pale-field':{name:'白銀の大平原',enemies:[paleEnemies.wraith,paleEnemies.drone,paleEnemies.lantern]},
 'pale-sanctuary':{name:'沈黙の礼拝堂',enemies:[paleEnemies.jelly,paleEnemies.lantern,paleEnemies.wraith]},
 'pale-archive':{name:'巡礼記録庫',enemies:[paleEnemies.crab,paleEnemies.hunter,paleEnemies.drone]},
 'pale-guardian':{name:'巡礼路の守門',enemies:[paleEnemies.guardian]},
 'pale-requiem':{name:'星声の中枢',enemies:[paleEnemies.requiem]},
};
