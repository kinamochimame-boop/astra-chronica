import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color:0xa8cddd,affinities:{}});
export const chronoEnemies={
 wolf:{...make('frostfang-wolf','霜牙の狼',410,38,16,46,230),normalAttackHits:2},
 slime:{...make('icecrystal-slime','氷晶スライム',490,34,27,22,240),enemyMagic:{name:'氷晶流',power:57,element:'water' as const},affinities:{fire:1.25,water:0.5}},
 drone:{...make('clockhand-drone','時針ドローン',415,38,18,34,240),enemyPattern:'clockDrone' as const},
 ghost:{...make('frostborder-ghost','霜境の亡霊',420,35,17,33,240),attackElement:'dark' as const,attackStatuses:[{id:'blind' as const,chance:0.3,turns:2}],attackModifiers:[{stat:'speed' as const,amount:-0.15,turns:2}],affinities:{light:1.25,dark:0.5}},
 guard:{...make('gear-sentinel','歯車の守衛',510,41,25,25,250),enemyPattern:'gearGuard' as const},
 orb:{...make('twilight-orb','薄明の魔導球',430,34,19,30,250),enemyMagic:{name:'薄明光',power:60,element:'light' as const,statuses:[{id:'silence' as const,chance:0.25,turns:2}]},affinities:{dark:1.25,light:0.5}},
 clockguard:{...make('clockguard','時環の番兵・クロックガード',2200,44,22,27,750),enemyPattern:'clockGuard' as const},
 luciel:{...make('luciel','暁の観測者・ルシエル',3400,43,20,31,1050),enemyPattern:'luciel' as const,phaseEvasion:{threshold:0.65,chance:0.15},affinities:{dark:1.25,light:0.5}},
};
export const chronoEncounters:Record<string,{name:string;enemies:Unit[]}>= {
 'chrono-bridge':{name:'凍てついた石橋',enemies:[chronoEnemies.wolf,chronoEnemies.slime,chronoEnemies.ghost]},
 'chrono-market':{name:'薄明の市場',enemies:[chronoEnemies.drone,chronoEnemies.guard,chronoEnemies.orb]},
 'chrono-canal':{name:'氷結した運河',enemies:[chronoEnemies.slime,chronoEnemies.guard,chronoEnemies.orb]},
 'chrono-clockguard':{name:'第一時計塔',enemies:[chronoEnemies.clockguard]},
 'chrono-luciel':{name:'暁の中枢',enemies:[chronoEnemies.luciel]},
};
