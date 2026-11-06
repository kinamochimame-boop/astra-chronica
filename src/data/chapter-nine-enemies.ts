import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number,color:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color,affinities:{}});
export const veinEnemies={
 mole:{...make('crystal-mole','晶牙モール',700,52,39,32,400,0xbaac91)},
 slime:{...make('starvein-slime','星脈スライム',740,49,31,31,410,0x84c9d4),attackStatuses:[{id:'poison' as const,chance:.2,turns:3}],affinities:{fire:.65,water:.65,wind:.65,earth:.65,light:.65,dark:.65}},
 sentry:{...make('seal-sentry','封印の歩哨',720,55,36,34,410,0x9dabc6),enemyPattern:'archiveGuard' as const},
 eater:{...make('memory-eater','記憶喰らい',640,49,27,40,420,0xb79dcb),enemyMagic:{name:'忘却の波',power:80,element:'dark' as const,statuses:[{id:'sleep' as const,chance:.15,turns:2},{id:'silence' as const,chance:.2,turns:2}]}},
 bat:{...make('crystal-bat','晶翼バット',590,50,26,60,400,0xa4bcdf),normalAttackHits:2,evasion:.12,affinities:{fire:1.25,wind:.5}},
 orb:{...make('starvein-orb','星脈魔導球',700,50,30,38,430,0xd3bb90),enemyPattern:'starOrb' as const},
 guardian:{...make('record-guardian','封印守護機・レコードガーディアン',3600,55,39,36,1350,0xa9b8bb),enemyPattern:'recordGuardian' as const},
 memoria:{...make('memoria','記憶の番人・メモリア',5400,56,32,40,1900,0xb6a5d8),enemyPattern:'memoria' as const,affinities:{fire:.75,light:1.25,dark:.5}},
};
export const veinEncounters:Record<string,{name:string;enemies:Unit[]}>= {
 'vein-path':{name:'蒼光の地下道',enemies:[veinEnemies.mole,veinEnemies.slime,veinEnemies.bat]},
 'vein-waterway':{name:'地下水路',enemies:[veinEnemies.slime,veinEnemies.eater,veinEnemies.orb]},
 'vein-mine':{name:'水晶採掘跡',enemies:[veinEnemies.mole,veinEnemies.bat,veinEnemies.sentry]},
 'vein-guardian':{name:'第一封印区画',enemies:[veinEnemies.guardian]},
 'vein-lab':{name:'星脈研究施設',enemies:[veinEnemies.eater,veinEnemies.sentry,veinEnemies.orb]},
 'vein-memoria':{name:'星脈中枢',enemies:[veinEnemies.memoria]},
};
