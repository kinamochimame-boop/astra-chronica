import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color:0xc3badc,affinities:{},statusResistance:{sleep:.2,freeze:.2}});
export const terminalEnemies={
 echo:{...make('starpath-echo','星路の残響',980,69,40,56,680),enemyMagic:{name:'残響の分岐',power:104,element:'wind',statuses:[{id:'blind',chance:.15,turns:2}]}},
 cog:{...make('fate-cog','運命の歯車',1080,72,53,44,700),enemyPattern:'archiveGuard',affinities:{water:1.25,earth:.75}},
 eater:{...make('record-eater','記録喰らい',960,70,41,57,680),attackStatuses:[{id:'sleep',chance:.15,turns:2},{id:'silence',chance:.2,turns:2}]},
 sentry:{...make('terminal-sentry','終着の守衛',1060,74,49,46,710),enemyPattern:'collapseSoldier'},
 phantom:{...make('future-phantom','未来の幻影',930,70,39,85,690),enemyMagic:{name:'未来の残像',power:103,element:'light'},evasion:.08},
 shadow:{...make('seer-shadow','星詠みの影',990,71,43,56,710),enemyMagic:{name:'記録の陰影',power:104,element:'dark',modifiers:[{stat:'speed',amount:-.15,turns:2}]}},
 guardian:{...make('fate-guardian','運命守護機・フェイトガーディアン',4800,75,54,49,2500),enemyPattern:'fateGuardian',affinities:{water:1.25,light:.75}},
 judge:{...make('last-judge','終着の審判者・ラストジャッジ',6500,73,45,53,3200),enemyPattern:'lastJudge',affinities:{wind:1.25,dark:.5}},
} satisfies Record<string,Unit>;
export const terminalEncounters:Record<string,{name:string;enemies:Unit[]} >={
 'terminal-gate':{name:'終着領域への門',enemies:[terminalEnemies.cog,terminalEnemies.phantom,terminalEnemies.echo]},
 'terminal-plaza':{name:'合流する星の広場',enemies:[terminalEnemies.echo,terminalEnemies.eater,terminalEnemies.phantom]},
 'terminal-library':{name:'未来記録の書庫',enemies:[terminalEnemies.sentry,terminalEnemies.cog,terminalEnemies.shadow]},
 'terminal-memory':{name:'消えかけた記憶室',enemies:[terminalEnemies.eater,terminalEnemies.echo,terminalEnemies.phantom]},
 'terminal-observatory':{name:'星詠みの記録殿',enemies:[terminalEnemies.cog,terminalEnemies.sentry,terminalEnemies.shadow]},
 'terminal-sanctuary':{name:'約束の聖域',enemies:[terminalEnemies.shadow,terminalEnemies.eater,terminalEnemies.sentry]},
 'terminal-bridge':{name:'分岐する星橋',enemies:[terminalEnemies.phantom,terminalEnemies.echo,terminalEnemies.shadow]},
 'terminal-guardian':{name:'運命守護機の関門',enemies:[terminalEnemies.guardian]},
 'terminal-last-judge':{name:'終着領域の心臓',enemies:[terminalEnemies.judge]},
};
