import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color:0x99bfd9,affinities:{}});
export const skyEnemies={
 harpy:{...make('windblade-harpy','風刃のハーピー',520,47,23,56,320),color:0x91cab8},
 slime:{...make('cloud-slime','雲海スライム',600,43,27,30,330),color:0x8acddd,enemyMagic:{name:'雲水弾',power:70,element:'water' as const},affinities:{wind:.5,fire:1.25}},
 drone:{...make('sky-drone','天穹ドローン',560,46,24,38,330),color:0xcbbd8c,enemyPattern:'skyDrone' as const,affinities:{wind:.5,earth:1.25}},
 armor:{...make('floating-armor','浮遊甲冑',650,49,32,29,340),color:0x91a5c1,enemyPattern:'skyGuard' as const},
 bird:{...make('starwing-bird','星羽の幻鳥',510,45,22,48,330),color:0xd8afe1,evasion:.12,attackStatuses:[{id:'blind' as const,chance:.25,turns:2}],affinities:{fire:1.25,wind:.5}},
 orb:{...make('ancient-wind-orb','古代風導球',580,44,25,37,340),color:0xb2dba8,enemyMagic:{name:'封風術',power:72,element:'wind' as const,statuses:[{id:'silence' as const,chance:.2,turns:2},{id:'paralysis' as const,chance:.15,turns:2}]},affinities:{earth:1.25,wind:.5}},
 aero:{...make('aero-guardian','空域守護機・エアロガーディアン',3000,50,26,35,1100),color:0xc2aa7b,enemyPattern:'aeroGuard' as const,affinities:{earth:1.25,wind:.5}},
 astraeia:{...make('astraeia','星翼の守護者・アストレイア',4700,52,25,38,1550),color:0xc9b5ef,enemyPattern:'astraeia' as const,affinities:{fire:1.25,wind:.5}},
};
export const skyEncounters:Record<string,{name:string;enemies:Unit[]}>= {
 'sky-island':{name:'第一浮島・風の庭',enemies:[skyEnemies.harpy,skyEnemies.slime,skyEnemies.bird]},
 'sky-bridge':{name:'断空の連絡橋',enemies:[skyEnemies.armor,skyEnemies.harpy,skyEnemies.drone]},
 'sky-windway':{name:'風鳴りの回廊',enemies:[skyEnemies.orb,skyEnemies.slime,skyEnemies.bird]},
 'sky-sentry':{name:'空渡りの遺跡',enemies:[skyEnemies.armor,skyEnemies.orb,skyEnemies.drone]},
 'sky-orb':{name:'遺跡の航路',enemies:[skyEnemies.drone,skyEnemies.bird,skyEnemies.orb]},
 'sky-aero':{name:'浮遊炉の中枢',enemies:[skyEnemies.aero]},
 'sky-astraeia':{name:'天穹の心核',enemies:[skyEnemies.astraeia]},
};
