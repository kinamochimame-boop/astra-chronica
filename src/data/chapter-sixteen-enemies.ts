import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color:0x9cb5c0,affinities:{},statusResistance:{sleep:.2,freeze:.2}});
export const graveEnemies={
 ghost:{...make('stardust-ghost','星屑の亡霊',960,68,39,53,650),enemyMagic:{name:'残光の侵食',power:102,element:'dark',modifiers:[{stat:'attack',amount:-.15,turns:2}]}},
 sentinel:{...make('grave-sentry','墓標の番兵',1040,70,51,42,660),enemyPattern:'archiveGuard',affinities:{water:1.25,earth:.75}},
 eater:{...make('memory-eater','記憶喰らい',940,68,40,55,640),attackStatuses:[{id:'sleep',chance:.15,turns:2},{id:'silence',chance:.2,turns:2}]},
 wisp:{...make('hollow-star-wisp','虚星のウィスプ',900,68,38,83,650),enemyMagic:{name:'虚星の疾風',power:100,element:'wind'}},
 machine:{...make('collapsed-soldier','崩壊機兵',1020,72,47,45,670),enemyPattern:'collapseSoldier'},
 apostle:{...make('end-apostle','終焉の使徒',970,69,42,54,680),enemyPattern:'endApostle'},
 guard:{...make('grave-sentinel','墓標守護機・アストラセンチネル',4700,73,53,47,2300),enemyPattern:'graveSentinel',affinities:{water:1.25,light:.75}},
 observer:{...make('end-observer','終焉の観測者・エンドオブザーバー',6400,71,44,51,3000),enemyPattern:'endObserver',affinities:{wind:1.25,dark:.5}},
} satisfies Record<string,Unit>;
export const graveEncounters:Record<string,{name:string;enemies:Unit[]} >={
 'grave-gate':{name:'星墓の入口',enemies:[graveEnemies.sentinel,graveEnemies.wisp,graveEnemies.ghost]},
 'grave-field':{name:'星屑の荒野',enemies:[graveEnemies.ghost,graveEnemies.eater,graveEnemies.wisp]},
 'grave-ruins':{name:'崩壊文明の遺跡',enemies:[graveEnemies.machine,graveEnemies.sentinel,graveEnemies.apostle]},
 'grave-memory':{name:'記憶の回廊',enemies:[graveEnemies.eater,graveEnemies.ghost,graveEnemies.wisp]},
 'grave-observatory':{name:'失われた観測所',enemies:[graveEnemies.sentinel,graveEnemies.machine,graveEnemies.apostle]},
 'grave-sanctuary':{name:'星魂の祭壇',enemies:[graveEnemies.apostle,graveEnemies.eater,graveEnemies.machine]},
 'grave-tower':{name:'終焉の塔',enemies:[graveEnemies.wisp,graveEnemies.ghost,graveEnemies.apostle]},
 'grave-sentinel':{name:'守護機の封鎖門',enemies:[graveEnemies.guard]},
 'grave-end-observer':{name:'観測者の中枢',enemies:[graveEnemies.observer]},
};
