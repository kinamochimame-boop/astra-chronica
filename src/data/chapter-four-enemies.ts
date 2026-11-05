import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color:0xa6a2d9,affinities:{}});
export const crystalEnemies={
 bat:{...make('crystal-bat','水晶コウモリ',270,28,12,40,140),evasion:0.2},
 beetle:make('crystal-beetle','結晶甲虫',340,29,22,17,150),
 wisp:{...make('resonant-wisp','響鳴ウィスプ',285,27,13,28,150),enemyMagic:{power:43,element:'light' as const},affinities:{dark:1.25,light:0.5}},
 hound:{...make('underground-hound','地底の番犬',305,29,12,34,150),normalAttackHits:2},
 golem:{...make('resonant-golem','共鳴ゴーレム',390,34,17,18,170),enemyPattern:'ruinSoldier' as const},
 shadow:{...make('oblivion-shadow','忘却の影',290,26,12,29,150),attackElement:'dark' as const,attackStatuses:[{id:'silence' as const,chance:0.25,turns:2},{id:'sleep' as const,chance:0.15,turns:2}],affinities:{light:1.5,dark:0.5}},
 machine:{...make('resonance-machine','共鳴の守護機兵',1500,36,17,21,480),enemyPattern:'resonanceMachine' as const},
 echoria:{...make('echoria','眠れる歌姫・エコーリア',2400,33,14,25,700),enemyPattern:'echoria' as const,affinities:{dark:1.25,light:0.5}},
};
export const crystalEncounters:Record<string,{name:string;enemies:Unit[]}>= {
 'crystal-market':{name:'硝子の市場跡',enemies:[crystalEnemies.bat,crystalEnemies.beetle,crystalEnemies.wisp]},
 'crystal-canal':{name:'地下水路',enemies:[crystalEnemies.hound,crystalEnemies.wisp,crystalEnemies.shadow]},
 'crystal-machine':{name:'水晶の回廊',enemies:[crystalEnemies.machine]},
 'crystal-cathedral':{name:'沈黙の聖堂',enemies:[crystalEnemies.golem,crystalEnemies.shadow,crystalEnemies.beetle]},
 'crystal-echoria':{name:'眠れる歌姫の間',enemies:[crystalEnemies.echoria]},
};
