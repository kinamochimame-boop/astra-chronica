import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color:0x94abbc,affinities:{},statusResistance:{sleep:.2,freeze:.2}});
export const gearEnemies={
 scout:{...make('gear-scout','歯車スカウト',820,66,35,76,540)},
 guard:{...make('gear-guardian','機巧ガーディアン',930,66,46,40,550),enemyPattern:'archiveGuard' as const,affinities:{water:1.25,earth:.75}},
 drone:{...make('vein-drone','星脈ドローン',860,62,37,48,530),enemyMagic:{name:'星脈水流',power:98,element:'water' as const,statuses:[{id:'silence' as const,chance:.15,turns:2}]}},
 repair:{...make('wild-repair','暴走整備機',880,65,36,52,540),attackStatuses:[{id:'poison' as const,chance:.2,turns:2},{id:'paralysis' as const,chance:.15,turns:2}]},
 phantom:{...make('sphere-phantom','天球の幻影',830,61,35,59,550),enemyMagic:{name:'虚天の影',power:100,element:'dark' as const,statuses:[{id:'sleep' as const,chance:.15,turns:2}]},affinities:{light:1.25,dark:.75}},
 eater:{...make('chart-eater','星図喰らい',840,64,36,50,550),enemyPattern:'chartEater' as const},
 guardian:{...make('astro-sentinel','天球守護機・アストロセンチネル',4600,66,46,42,1800),enemyPattern:'astroSentinel' as const,affinities:{water:1.25,light:.75}},
 zero:{...make('celestial-zero','虚天の観測者・セレスティアルゼロ',6500,67,38,46,2450),enemyPattern:'celestialZero' as const,affinities:{water:1.25,dark:.5}},
};
export const gearEncounters:Record<string,{name:string;enemies:Unit[]}>= {
 'gear-rail':{name:'星脈鉄道跡',enemies:[gearEnemies.scout,gearEnemies.guard,gearEnemies.drone]},
 'gear-city':{name:'機巧都市中央区',enemies:[gearEnemies.drone,gearEnemies.guard,gearEnemies.eater]},
 'gear-workshop':{name:'機巧工房',enemies:[gearEnemies.repair,gearEnemies.phantom,gearEnemies.eater]},
 'gear-observatory':{name:'天球儀観測塔',enemies:[gearEnemies.scout,gearEnemies.drone,gearEnemies.guard]},
 'gear-guardian':{name:'天球の守門',enemies:[gearEnemies.guardian]},
 'gear-zero':{name:'天球儀中枢',enemies:[gearEnemies.zero]},
};
