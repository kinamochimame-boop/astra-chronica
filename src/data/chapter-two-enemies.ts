import {enemyTemplates,cloneUnit} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color:0xaca5a4,affinities:{}});
export const cityEnemies={
 bat:make('ash-bat','灰羽コウモリ',155,18,10,29,65),
 sentinel:make('rust-sentinel','錆びた番兵',200,20,14,13,70),
 shadow:{...make('lamp-shadow','灯喰いの影',165,18,10,22,70),attackStatuses:[{id:'blind' as const,chance:0.25,turns:2}]},
 slime:{...make('star-slime','星屑スライム',180,16,10,15,65),affinities:{fire:1.5,water:0.5,wind:1.25}},
 keeper:{...make('canal-keeper','地下水路の番人',820,24,12,16,240),enemyPattern:'canalKeeper' as const},
 bell:{...make('bell-guardian','忘鐘の守護者',1550,25,11,18,380),enemyPattern:'bellGuardian' as const,affinities:{fire:1.25,water:0.75}},
};
export const cityEncounters:Record<string,{name:string;enemies:Unit[]}>= {
 'city-market':{name:'崩れた市場',enemies:[cityEnemies.bat,cityEnemies.sentinel,cityEnemies.slime]},
 'city-canal':{name:'地下水路',enemies:[cityEnemies.shadow,cityEnemies.slime,cityEnemies.bat]},
 'city-keeper':{name:'地下水路の番人',enemies:[cityEnemies.keeper]},
 'city-stairs':{name:'時計塔への階段',enemies:[cityEnemies.sentinel,cityEnemies.shadow,cityEnemies.sentinel].map(u=>({...cloneUnit(u),experienceReward:90}))},
 'city-bell':{name:'星のない鐘楼',enemies:[cityEnemies.bell]},
};
