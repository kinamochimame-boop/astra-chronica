import {gearEncounters} from './chapter-thirteen-enemies';
import {gloomEncounters} from './chapter-twelve-enemies';
import {paleEncounters} from './chapter-eleven-enemies';
import {tideEncounters} from './chapter-ten-enemies';
import {veinEncounters} from './chapter-nine-enemies';
import {skyEncounters} from './chapter-eight-enemies';
import {groveEncounters} from './chapter-seven-enemies';
import {chronoEncounters} from './chapter-six-enemies';
import {saharaEncounters} from './chapter-five-enemies';
import {crystalEncounters} from './chapter-four-enemies';
import {valleyEncounters} from './chapter-three-enemies';
import {cityEncounters} from './chapter-two-enemies';
import {enemyTemplates,cloneUnit} from './combat';
import type {Unit} from '../types';
const enemy=(id:string,name:string,hp:number,attack:number,speed:number,xp:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,speed,experienceReward:xp,affinities:{},color:0x83a9a0});
export const forestEnemies={
 slime:enemy('mist-slime','霧まといのスライム',190,12,12,35),
 bat:enemy('shadow-bat','影羽コウモリ',110,13,27,35),
 wolf:enemy('forest-wolf','森の番狼',140,17,19,35),
 guardian:{...enemy('mist-guardian','霧喰らいの守護獣',920,22,17,180),enemyPattern:'mistGuardian' as const,affinities:{fire:1.25,water:0.75},color:0x9a86c6},
};
export const encounters:Record<string,{name:string;enemies:Unit[]}>= {
 ...gearEncounters,...cityEncounters,...valleyEncounters,...crystalEncounters,...saharaEncounters,...chronoEncounters,...groveEncounters,...skyEncounters,...veinEncounters,...gloomEncounters,...paleEncounters,...tideEncounters,
 'forest-entry':{name:'霧の森・入口',enemies:[forestEnemies.slime,forestEnemies.bat,forestEnemies.wolf]},
 'forest-fork':{name:'森の分かれ道',enemies:[forestEnemies.wolf,forestEnemies.bat,forestEnemies.wolf].map(u=>({...cloneUnit(u),experienceReward:50}))},
 'forest-guardian':{name:'霧の森・最深部',enemies:[forestEnemies.guardian]},
};
export function encounterSetup(id:string){const e=encounters[id];return e?{name:e.name,enemies:e.enemies.map((u,i)=>({...cloneUnit(u),id:`enemy${i}`}))}:undefined}
