import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color:0x93bfb7,affinities:{}});
export const valleyEnemies={
 lizard:{...make('wind-lizard','風羽トカゲ',195,23,10,37,100),evasion:0.2},
 golem:make('rock-golem','岩殻ゴーレム',285,26,18,14,105),
 wisp:{...make('whirl-wisp','旋風ウィスプ',205,24,11,28,100),attackElement:'wind' as const,affinities:{fire:1.25,wind:0.5}},
 bird:{...make('sky-bird','空喰いバード',210,24,10,33,110),normalAttackHits:2},
 slime:{...make('crystal-slime','結晶スライム',245,22,12,18,105),affinities:{fire:0.5,water:0.75,wind:1.5,earth:1.25}},
 soldier:{...make('ruin-soldier','遺跡の自動兵',290,28,14,21,120),enemyPattern:'ruinSoldier' as const},
 warden:{...make('wind-warden','風鎧の番人',1150,30,14,20,360),enemyPattern:'windWarden' as const},
 guardian:{...make('sky-guardian','天穹の守護獣',1950,32,12,23,520),enemyPattern:'skyGuardian' as const,attackElement:'wind' as const,affinities:{water:1.25,wind:0.5}},
};
export const valleyEncounters:Record<string,{name:string;enemies:Unit[]}>= {
 'valley-bridge':{name:'風切りの吊り橋',enemies:[valleyEnemies.lizard,valleyEnemies.bird,valleyEnemies.wisp]},
 'valley-mine':{name:'結晶採掘跡',enemies:[valleyEnemies.golem,valleyEnemies.slime,valleyEnemies.lizard]},
 'valley-warden':{name:'空渡りの回廊',enemies:[valleyEnemies.warden]},
 'valley-broken':{name:'崩落した空中橋',enemies:[valleyEnemies.soldier,valleyEnemies.bird,valleyEnemies.golem]},
 'valley-sky':{name:'風の記憶の間',enemies:[valleyEnemies.guardian]},
};
