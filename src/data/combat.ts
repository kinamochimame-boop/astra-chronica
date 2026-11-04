import {BALANCE} from '../balance';
import type {Command,Skill,Unit} from '../types';
export const skills: Record<Command, Skill> = {
  attack: { kind:'physical',element:'none',attackScale:1, name: '通常攻撃', cost: 0, target: 'enemy', description: '敵単体に攻撃' },
  strong: { kind:'physical',element:'none',attackScale:BALANCE.strongPower, name: '強撃', cost: 6, target: 'enemy', description: '通常攻撃の2倍の威力' },
  guard: { kind:'guard',element:'none', name: 'ガード', cost: 3, target: 'self', description: '次の自分の行動まで被ダメージ75%軽減' },
  cover: { kind:'cover',element:'none', name: 'かばう', cost: 4, target: 'ally', description: '次の自分の行動まで選んだ味方への攻撃を引き受け、35%軽減' },
  fire: { kind:'magic',element:'fire',power:BALANCE.firePower,statuses:[{id:'burn',chance:0.25}], name: 'ファイア', cost: 7, target: 'enemy', description: '火属性・威力72。25%で火傷を付与' },
  heal: { kind:'heal',element:'light',power:BALANCE.healPower, name: 'ヒール', cost: 8, target: 'ally', description: '味方単体のHPを85回復（蘇生不可）' },
  defend: { kind:'guard',element:'none', name: '防御', cost: 0, target: 'self', description: '次の自分の行動まで被ダメージ50%軽減' },
};
export const commandsFor = (u: Unit): Command[] => u.commands;
const baseUnit = { defense:10, level:1, attackElement:'none' as const, affinities:{}, statusResistance:{}, statuses:[], modifiers:[], commands:[] as Command[], experienceReward:0 };
export const heroes: Unit[] = [
  { ...baseUnit, commands:['attack','strong','defend'], id: 'astel', name: 'アステル', role: '戦士', weapons: ['剣', '弓', '双剣'], maxHp: 180, hp: 180, maxMp: 24, mp: 24, attack: 32, speed: 24, color: 0x71b9ff },
  { ...baseUnit, commands:['attack','guard','cover','defend'], id: 'rina', name: 'リナ', role: 'タンク', weapons: ['盾＆槍', '盾＆フレイル', '盾＆突剣'], maxHp: 240, hp: 240, maxMp: 30, mp: 30, attack: 24, speed: 20, color: 0xe1b86c },
  { ...baseUnit, commands:['attack','fire','heal','defend'], id: 'mei', name: 'メイ', role: '魔法攻撃', weapons: ['ワンド', 'ロッド', 'メイス'], maxHp: 150, hp: 150, maxMp: 48, mp: 48, attack: 28, speed: 16, color: 0xc6a1ee },
];
export const enemyTemplates: Unit[] = ['星喰いの影', '霧の番人', '夜の使い'].map((name, i) => ({
  ...baseUnit, commands:['attack'], experienceReward:40, affinities:i===1?{fire:1.5,water:0.5}:i===2?{fire:0.5,light:1.5}:{}, id: `enemy${i}`, name, role: '魔物', weapons: [], maxHp: 240 + i * 20, hp: 240 + i * 20,
  maxMp: 0, mp: 0, attack: 18 + i * 2, speed: [22, 18, 14][i], color: 0x7c83b8,
}));

export function cloneUnit(unit:Unit):Unit {return {...unit,attackStatuses:unit.attackStatuses?.map(s=>({...s})),weapons:[...unit.weapons],commands:[...unit.commands],affinities:{...unit.affinities},statusResistance:{...unit.statusResistance},statuses:unit.statuses.map(s=>({...s})),modifiers:unit.modifiers.map(m=>({...m}))};}
