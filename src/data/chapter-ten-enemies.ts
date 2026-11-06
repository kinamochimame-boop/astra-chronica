import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number,color:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color,affinities:{}});
export const tideEnemies={
 crab:{...make('tide-crab','潮牙クラブ',760,56,41,34,440,0x9e9eaa)},
 jelly:{...make('starsand-jelly','星砂ジェリー',780,53,33,33,450,0x8ad1d0),enemyMagic:{name:'潮のしびれ',power:86,element:'water' as const,statuses:[{id:'paralysis' as const,chance:.2,turns:2}]}},
 wraith:{...make('sea-wraith','海霧レイス',700,54,29,47,460,0xb1c2d4),evasion:.12,attackStatuses:[{id:'blind' as const,chance:.2,turns:2}]},
 drone:{...make('tide-drone','潮流ドローン',780,59,38,36,460,0xa0b6bc),enemyPattern:'archiveGuard' as const},
 lantern:{...make('deep-lantern','深海ランタン',740,54,32,40,470,0xd3c89c),enemyMagic:{name:'深海の灯',power:88,element:'light' as const,statuses:[{id:'silence' as const,chance:.2,turns:2}]}},
 hunter:{...make('azure-hunter','蒼鱗ハンター',660,55,28,64,440,0x88b9d2),normalAttackHits:2,affinities:{earth:1.25,water:.5}},
 guardian:{...make('tide-guardian','潮門守護機・タイドガーディアン',3900,59,40,38,1500,0x91c1c3),enemyPattern:'tideGuardian' as const},
 luminaria:{...make('luminaria','沈黙の星灯・ルミナリア',5800,60,34,42,2100,0xd7d4aa),enemyPattern:'luminaria' as const,affinities:{water:.75,earth:1.25,light:.5}},
};
export const tideEncounters:Record<string,{name:string;enemies:Unit[]}>= {
 'tide-road':{name:'海辺への街道',enemies:[tideEnemies.crab,tideEnemies.jelly,tideEnemies.hunter]},
 'tide-port':{name:'漁港',enemies:[tideEnemies.wraith,tideEnemies.drone,tideEnemies.lantern]},
 'tide-cave':{name:'潮騒の洞窟',enemies:[tideEnemies.jelly,tideEnemies.lantern,tideEnemies.wraith]},
 'tide-ruins':{name:'沈んだ遺跡',enemies:[tideEnemies.crab,tideEnemies.hunter,tideEnemies.drone]},
 'tide-guardian':{name:'潮流制御室',enemies:[tideEnemies.guardian]},
 'tide-luminaria':{name:'海底星脈中枢',enemies:[tideEnemies.luminaria]},
};
