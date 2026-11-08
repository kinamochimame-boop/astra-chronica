import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color:0x94abbc,affinities:{},statusResistance:{sleep:.2,freeze:.2}});
export const arkEnemies={
 scout:{...make('inverted-beast','反転の幻獣',850,68,36,78,560)},
 guard:{...make('ark-sentry','方舟警備機',970,68,47,41,580),enemyPattern:'archiveGuard' as const,affinities:{water:1.25,earth:.75}},
 drone:{...make('starsea-wisp','星海ウィスプ',890,64,38,49,550),enemyMagic:{name:'逆潮の光',power:102,element:'water' as const,statuses:[{id:'silence' as const,chance:.15,turns:2}]}},
 repair:{...make('memory-eater','記憶喰らい',910,67,37,53,560),attackStatuses:[{id:'poison' as const,chance:.2,turns:2},{id:'paralysis' as const,chance:.15,turns:2}]},
 phantom:{...make('stardust-horror','星屑の異形',870,63,36,60,570),enemyMagic:{name:'忘却の星屑',power:104,element:'dark' as const,statuses:[{id:'silence' as const,chance:.15,turns:2}]},affinities:{light:1.25,dark:.75}},
 eater:{...make('void-watcher','虚空の監視者',880,66,37,51,570),enemyPattern:'voidWatcher' as const},
 guardian:{...make('gravity-guard','方舟守護機・グラビティガード',4800,68,48,43,1900),enemyPattern:'gravityGuard' as const,affinities:{water:1.25,light:.75}},
 zero:{...make('noa-zero','忘却の星舟・ノアゼロ',6800,69,40,47,2600),enemyPattern:'noaZero' as const,affinities:{water:1.25,dark:.5}},
};
export const arkEncounters:Record<string,{name:string;enemies:Unit[]}>= {
 'ark-gateway':{name:'星海への転送門',enemies:[arkEnemies.scout,arkEnemies.guard,arkEnemies.drone]},
 'ark-dock':{name:'方舟接岸区',enemies:[arkEnemies.drone,arkEnemies.guard,arkEnemies.eater]},
 'ark-records':{name:'記憶保存庫',enemies:[arkEnemies.repair,arkEnemies.phantom,arkEnemies.eater]},
 'ark-sanctuary':{name:'星詠みの聖域',enemies:[arkEnemies.scout,arkEnemies.drone,arkEnemies.guard]},
 'ark-guardian':{name:'方舟の隔壁門',enemies:[arkEnemies.guardian]},
 'ark-zero':{name:'方舟中枢',enemies:[arkEnemies.zero]},
};
