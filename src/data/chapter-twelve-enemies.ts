import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number,color:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color,affinities:{},statusResistance:{sleep:.2,freeze:.2}});
export const gloomEnemies={
 golem:{...make('starmoss-golem','星苔ゴーレム',850,60,44,35,500,0x708878),affinities:{fire:1.25,wind:.75}},
 sprite:{...make('darkleaf-sprite','闇葉スプライト',770,56,33,70,510,0x8093b8),enemyMagic:{name:'闇葉の風',power:94,element:'wind' as const,statuses:[{id:'blind' as const,chance:.2,turns:2}]}},
 beast:{...make('rootbound-beast','根縛りの獣',790,59,32,51,510,0x8e9f85),attackStatuses:[{id:'paralysis' as const,chance:.25,turns:2}]},
 sentinel:{...make('elder-sentinel','古樹の番兵',860,63,40,38,520,0x9e9880),enemyPattern:'archiveGuard' as const},
 wisp:{...make('nightglow-wisp','夜光ウィスプ',820,57,34,44,520,0xc8d69c),enemyMagic:{name:'夜光の火',power:94,element:'fire' as const,statuses:[{id:'burn' as const,chance:.2,turns:2}]}},
 larva:{...make('star-eater-larva','星喰いの幼体',790,59,32,46,510,0x9c92b4),enemyPattern:'gloomLarva' as const,affinities:{light:1.25,dark:.75}},
 guardian:{...make('gloom-guardian','古樹守護機・ルートセンチネル',4300,63,42,40,1700,0x82b6a4),enemyPattern:'rootSentinel' as const,attackStatuses:[{id:'paralysis' as const,chance:.25,turns:2}],affinities:{fire:1.25,earth:.75}},
 astravore:{...make('astravore','星喰いの大樹・アストラヴォア',6200,64,36,44,2300,0xa0b89b),enemyPattern:'astravore' as const,affinities:{fire:1.25,dark:.5}},
};
export const gloomEncounters:Record<string,{name:string;enemies:Unit[]}>= {
 'gloom-road':{name:'深森への街道',enemies:[gloomEnemies.golem,gloomEnemies.sprite,gloomEnemies.beast]},
 'gloom-woods':{name:'常闇の森',enemies:[gloomEnemies.sprite,gloomEnemies.sentinel,gloomEnemies.larva]},
 'gloom-shrine':{name:'古樹の祠',enemies:[gloomEnemies.beast,gloomEnemies.wisp,gloomEnemies.larva]},
 'gloom-archive':{name:'樹海の記録庫',enemies:[gloomEnemies.golem,gloomEnemies.wisp,gloomEnemies.sentinel]},
 'gloom-guardian':{name:'根門の守域',enemies:[gloomEnemies.guardian]},
 'gloom-astravore':{name:'星喰い樹の中枢',enemies:[gloomEnemies.astravore]},
};
