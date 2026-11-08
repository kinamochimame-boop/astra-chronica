import {enemyScripts} from './enemy-scripts';
import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
/** Chapter 15 encounters are tuned for the unchanged Lv50 cap. */
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color:0xa1a9cf,affinities:{},statusResistance:{sleep:.2,freeze:.2}});
export const voidEnemies={
 guardian:{...make('crown-sentinel','星冠の衛兵',980,70,49,43,620),enemyPattern:'archiveGuard',affinities:{water:1.25,earth:.75}},
 phantom:{...make('forgetting-shadow','忘却の影',920,68,39,54,600),attackStatuses:[{id:'poison',chance:.2,turns:2},{id:'paralysis',chance:.15,turns:2}]},
 echo:{...make('void-echo','虚空の残響',900,66,39,52,610),enemyMagic:{name:'虚空の潮',power:102,element:'water',statuses:[{id:'burn',chance:.2,turns:2}]}},
 beast:{...make('time-wisp','時紡ぎウィスプ',880,68,38,82,620),enemyMagic:{name:'時紡ぎの風',power:98,element:'wind'}},
 pilgrim:{...make('phase-slime','位相スライム',950,69,46,55,630),enemyPattern:'canalKeeper',affinities:{dark:1.25,light:.75}},
 watcher:{...make('astral-watcher','星界の監視者',940,68,41,54,640),enemyPattern:'astralWatcher'},
 guard:{...make('regalia-guard','星冠守護騎・レガリアガード',4600,71,50,46,2100),enemyPattern:'regaliaGuard',enemyMagic:{power:enemyScripts.regaliaGuard.normalPower,element:enemyScripts.regaliaGuard.element,statuses:enemyScripts.regaliaGuard.statuses},affinities:{water:1.25,light:.75}},
 oblivion:{...make('crown-breaker','砕冠の執行者・クラウンブレイカー',6200,70,43,50,2800),enemyPattern:'crownBreaker',affinities:{water:1.25,dark:.5}},
} satisfies Record<string,Unit>;
export const voidEncounters:Record<string,{name:string;enemies:Unit[]} >={
 'void-gate':{name:'虚空の門',enemies:[voidEnemies.guardian,voidEnemies.beast,voidEnemies.echo]},
 'void-mirror':{name:'未来映しの鏡殿',enemies:[voidEnemies.phantom,voidEnemies.echo,voidEnemies.pilgrim]},
 'void-archive':{name:'聖域記録庫',enemies:[voidEnemies.guardian,voidEnemies.watcher,voidEnemies.pilgrim]},
 'void-sanctum':{name:'星冠の祭壇',enemies:[voidEnemies.beast,voidEnemies.phantom,voidEnemies.watcher]},
 'void-regalia':{name:'守護騎の門',enemies:[voidEnemies.guard]},
 'void-crown-breaker':{name:'砕けた星冠の中枢',enemies:[voidEnemies.oblivion]},
};
