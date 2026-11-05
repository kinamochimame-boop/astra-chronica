import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color:0xc9a26e,affinities:{}});
export const saharaEnemies={
 jackal:{...make('sand-jackal','砂牙のジャッカル',350,35,14,43,180),normalAttackHits:2},
 scorpion:{...make('sand-scorpion','砂甲スコーピオン',430,32,25,20,190),attackStatuses:[{id:'poison' as const,chance:0.3,turns:3}]},
 spirit:{...make('mirage-spirit','蜃気楼の精霊',345,30,15,37,190),evasion:0.2,enemyMagic:{power:48,element:'wind' as const},affinities:{earth:1.25,wind:0.5}},
 soldier:{...make('ancient-sand-soldier','古代砂兵',450,38,22,23,200),enemyPattern:'sandSoldier' as const},
 orb:{...make('star-sand-orb','星砂の魔導球',360,30,16,27,200),enemyMagic:{power:52,element:'earth' as const,statuses:[{id:'silence' as const,chance:0.25,turns:2}]},affinities:{wind:1.25,earth:0.5}},
 ghost:{...make('sandstorm-ghost','砂嵐の亡霊',360,30,15,30,200),attackElement:'dark' as const,attackStatuses:[{id:'blind' as const,chance:0.3,turns:2}],attackModifiers:[{stat:'attack' as const,amount:-0.15,turns:2}],affinities:{light:1.25,dark:0.5}},
 gardion:{...make('gardion','砂海の門番・ガルディオン',1850,41,20,24,620),enemyPattern:'gardion' as const},
 zaira:{...make('zaira','星砂の守護者・ザイラ',2850,39,17,28,880),enemyPattern:'zaira' as const,phaseEvasion:{threshold:0.65,chance:0.15},affinities:{water:1.25,earth:0.5}},
};
export const saharaEncounters:Record<string,{name:string;enemies:Unit[]}>= {
 'sahara-market':{name:'黄金の大市場',enemies:[saharaEnemies.jackal,saharaEnemies.scorpion,saharaEnemies.spirit]},
 'sahara-dunes':{name:'流砂の丘陵',enemies:[saharaEnemies.soldier,saharaEnemies.orb,saharaEnemies.ghost]},
 'sahara-gardion':{name:'埋もれた古代街道',enemies:[saharaEnemies.gardion]},
 'sahara-mirror':{name:'蜃気楼の回廊',enemies:[saharaEnemies.spirit,saharaEnemies.soldier,saharaEnemies.ghost]},
 'sahara-zaira':{name:'星砂の玉座',enemies:[saharaEnemies.zaira]},
};
