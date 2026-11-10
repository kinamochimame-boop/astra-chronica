import {cloneUnit,enemyTemplates} from './combat';
import type {Unit} from '../types';
export const finalEnemies={
echo:{...cloneUnit(enemyTemplates[0]),...{"id": "final-echo", "name": "終焉の残響", "maxHp": 1080, "hp": 1080, "attack": 73, "defense": 44, "speed": 59, "experienceReward": 730, "color": 11128783, "affinities": {}, "statusResistance": {"sleep": 0.2, "freeze": 0.2}, "enemyMagic": {"name": "終焉の残光", "power": 108, "element": "wind", "statuses": [{"id": "blind", "chance": 0.15, "turns": 2}]}}},
eater:{...cloneUnit(enemyTemplates[0]),...{"id": "final-eater", "name": "星喰らい", "maxHp": 1040, "hp": 1040, "attack": 74, "defense": 43, "speed": 60, "experienceReward": 740, "color": 11128783, "affinities": {}, "statusResistance": {"sleep": 0.2, "freeze": 0.2}, "enemyMagic": {"name": "食星術", "power": 108, "element": "dark", "statuses": [{"id": "silence", "chance": 0.18, "turns": 2}]}}},
executor:{...cloneUnit(enemyTemplates[0]),...{"id": "final-executor", "name": "運命の執行機", "maxHp": 1200, "hp": 1200, "attack": 77, "defense": 56, "speed": 46, "experienceReward": 760, "color": 11128783, "affinities": {"water": 1.25, "earth": 0.75}, "statusResistance": {"sleep": 0.2, "freeze": 0.2}, "enemyPattern": "collapseSoldier"}},
keeper:{...cloneUnit(enemyTemplates[0]),...{"id": "final-keeper", "name": "忘却の守護者", "maxHp": 1180, "hp": 1180, "attack": 76, "defense": 54, "speed": 49, "experienceReward": 750, "color": 11128783, "affinities": {}, "statusResistance": {"sleep": 0.2, "freeze": 0.2}, "enemyPattern": "archiveGuard", "attackStatuses": [{"id": "sleep", "chance": 0.12, "turns": 2}]}},
observer:{...cloneUnit(enemyTemplates[0]),...{"id": "final-observer", "name": "虚無の観測体", "maxHp": 1000, "hp": 1000, "attack": 73, "defense": 42, "speed": 88, "experienceReward": 750, "color": 11128783, "affinities": {}, "statusResistance": {"sleep": 0.2, "freeze": 0.2}, "evasion": 0.08, "enemyMagic": {"name": "虚無の照合", "power": 110, "element": "light", "modifiers": [{"stat": "speed", "amount": -0.15, "turns": 2}]}}},
shadow:{...cloneUnit(enemyTemplates[0]),...{"id": "final-shadow", "name": "最後の星影", "maxHp": 1100, "hp": 1100, "attack": 75, "defense": 46, "speed": 61, "experienceReward": 760, "color": 11128783, "affinities": {}, "statusResistance": {"sleep": 0.2, "freeze": 0.2}, "enemyMagic": {"name": "最後の影火", "power": 110, "element": "fire", "statuses": [{"id": "burn", "chance": 0.15, "turns": 2}]}}},
guardian:{...cloneUnit(enemyTemplates[0]),...{"id": "final-guardian", "name": "星界守護機・エターナルガーディアン", "maxHp": 5200, "hp": 5200, "attack": 78, "defense": 57, "speed": 51, "experienceReward": 2800, "color": 11128783, "affinities": {"water": 1.25, "light": 0.75}, "statusResistance": {"sleep": 0.2, "freeze": 0.2}, "enemyPattern": "eternalGuardian"}},
astra:{...cloneUnit(enemyTemplates[0]),...{"id": "final-astra", "name": "終焉の星詠者・アストラエンド", "maxHp": 8000, "hp": 8000, "attack": 77, "defense": 48, "speed": 55, "experienceReward": 4200, "color": 11128783, "affinities": {"wind": 1.25, "dark": 0.75}, "statusResistance": {"sleep": 0.2, "freeze": 0.2}, "enemyPattern": "astraEnd"}},
} satisfies Record<string,Unit>;
export const finalEncounters:Record<string,{name:string;enemies:Unit[]} >={
'final-gate':{name:'星界の門',enemies:[finalEnemies.executor,finalEnemies.observer,finalEnemies.echo]},
'final-memory':{name:'星の記憶回廊',enemies:[finalEnemies.echo,finalEnemies.eater,finalEnemies.shadow]},
'final-garden':{name:'始原の星庭',enemies:[finalEnemies.keeper,finalEnemies.executor,finalEnemies.observer]},
'final-archive':{name:'始原記録殿',enemies:[finalEnemies.shadow,finalEnemies.eater,finalEnemies.keeper]},
'final-hall':{name:'運命の広間',enemies:[finalEnemies.observer,finalEnemies.echo,finalEnemies.shadow]},
'final-observatory':{name:'最後の観測所',enemies:[finalEnemies.executor,finalEnemies.keeper,finalEnemies.eater]},
'final-guardian':{name:'永遠の守護殿',enemies:[finalEnemies.guardian]},
'final-astra-end':{name:'最後の約束',enemies:[finalEnemies.astra]},
};
