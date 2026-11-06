import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
const make=(id:string,name:string,hp:number,attack:number,defense:number,speed:number,xp:number):Unit=>({...cloneUnit(enemyTemplates[0]),id,name,maxHp:hp,hp,attack,defense,speed,experienceReward:xp,color:0x91bba3,affinities:{}});
export const groveEnemies={
 wolf:{...make('mossfang-wolf','苔牙ウルフ',480,42,19,50,280),normalAttackHits:2},
 slime:{...make('vine-slime','蔦絡みスライム',550,38,29,26,290),attackStatuses:[{id:'paralysis' as const,chance:0.2,turns:2}],affinities:{fire:1.25,earth:0.5}},
 spore:{...make('grove-spore','樹海の胞子精',490,38,20,32,290),enemyMagic:{name:'胞子霧',power:64,element:'earth' as const,statuses:[{id:'poison' as const,chance:0.3,turns:3},{id:'silence' as const,chance:0.2,turns:2}]}},
 sentry:{...make('oldwood-sentry','古木の歩哨',570,45,27,28,300),enemyPattern:'groveGuard' as const},
 moth:{...make('stardust-moth','星屑の蛾',470,38,20,39,290),enemyMagic:{name:'星屑風',power:64,element:'wind' as const},affinities:{fire:1.25,wind:0.5}},
 orb:{...make('root-orb','根脈の魔導球',510,40,22,33,300),enemyPattern:'rootOrb' as const,affinities:{fire:1.25,earth:0.5}},
 granguard:{...make('granguard','森護の番人・グランガード',2600,46,24,30,900),enemyPattern:'granGuard' as const},
 seles:{...make('seles','星樹の管理者・セレス',4100,47,23,34,1300),enemyPattern:'seles' as const,phaseEvasion:{threshold:0.65,chance:0.15},affinities:{fire:1.25,wind:0.5}},
};
export const groveEncounters:Record<string,{name:string;enemies:Unit[]}>= {
 'grove-trail':{name:'木漏れ日の小径',enemies:[groveEnemies.wolf,groveEnemies.slime,groveEnemies.moth]},
 'grove-roots':{name:'巨樹の根道',enemies:[groveEnemies.wolf,groveEnemies.spore,groveEnemies.slime]},
 'grove-sentry':{name:'苔むした観測遺跡',enemies:[groveEnemies.sentry,groveEnemies.spore,groveEnemies.orb]},
 'grove-orb':{name:'観測遺跡・根脈通路',enemies:[groveEnemies.orb,groveEnemies.sentry,groveEnemies.moth]},
 'grove-granguard':{name:'番人の聖域',enemies:[groveEnemies.granguard]},
 'grove-seles':{name:'樹海の心核',enemies:[groveEnemies.seles]},
};
