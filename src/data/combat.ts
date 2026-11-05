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
  fang:{name:'連牙斬',cost:8,target:'enemy',kind:'physical',element:'none',attackScale:0.65,hits:2,unlockLevel:3,description:'同じ敵に0.65倍×2回攻撃。途中撃破で打ち切り'},
  armorBreak:{name:'破甲撃',cost:10,target:'enemy',kind:'physical',element:'none',attackScale:1.2,unlockLevel:5,modifiers:[{stat:'defense',amount:-0.2,turns:3}],description:'1.2倍攻撃＋敵の防御力20%低下・3行動'},
  galeSlash:{name:'疾風斬',cost:9,target:'enemy',kind:'physical',element:'none',attackScale:1.1,unlockLevel:7,selfModifiers:[{stat:'speed',amount:0.2,turns:3}],description:'1.1倍攻撃＋自身の素早さ20%上昇・3行動'},
  starSlash:{name:'星断の一閃',cost:0,starCost:100,target:'enemy',kind:'physical',element:'none',attackScale:3.5,unlockLevel:10,description:'必殺技：敵単体に3.5倍攻撃'},
  taunt:{name:'挑発',cost:6,target:'self',kind:'taunt',element:'none',unlockLevel:3,description:'発動ラウンドと次ラウンド、敵の単体攻撃を自身へ誘導'},
  guardianField:{name:'守護の陣',cost:12,target:'allAllies',kind:'buff',element:'none',unlockLevel:5,modifiers:[{stat:'defense',amount:0.2,turns:3}],description:'生存する味方全体の防御力20%上昇・3行動'},
  shieldBash:{name:'シールドバッシュ',cost:8,target:'enemy',kind:'physical',element:'none',attackScale:0.9,unlockLevel:7,statuses:[{id:'paralysis',chance:0.25}],description:'0.9倍攻撃＋25%で麻痺'},
  oathShield:{name:'不落の誓盾',cost:0,starCost:100,target:'allAllies',kind:'barrier',element:'none',unlockLevel:10,description:'必殺技：生存する味方それぞれの次の直接攻撃ダメージを1回50%軽減'},
  ice:{name:'アイス',cost:8,target:'enemy',kind:'magic',element:'water',power:68,unlockLevel:3,statuses:[{id:'freeze',chance:0.2}],description:'氷術（水属性系統）・威力68＋20%で凍結'},
  thunder:{name:'サンダー',cost:9,target:'enemy',kind:'magic',element:'wind',power:76,unlockLevel:5,statuses:[{id:'paralysis',chance:0.2}],description:'雷術（風属性系統）・威力76＋20%で麻痺'},
  groupHeal:{name:'グループヒール',cost:16,target:'allAllies',kind:'heal',element:'light',power:45,unlockLevel:7,description:'生存する味方全体のHPを45回復'},
  miracle:{name:'星詠みの奇跡',cost:0,starCost:100,target:'allAllies',kind:'heal',element:'light',power:120,cleanse:true,unlockLevel:10,description:'必殺技：生存する味方全体をHP120回復＋全状態異常解除'},
};
export const EXTRA_COMMANDS:Record<string,Command[]>={astel:['fang','armorBreak','galeSlash','starSlash'],rina:['taunt','guardianField','shieldBash','oathShield'],mei:['ice','thunder','groupHeal','miracle']};
export const commandsFor = (u: Unit): Command[] => [...u.commands,...(EXTRA_COMMANDS[u.id]??[])];
const baseUnit = { defense:10, level:1, star:0, attackElement:'none' as const, affinities:{}, statusResistance:{}, statuses:[], modifiers:[], commands:[] as Command[], experienceReward:0 };
export const heroes: Unit[] = [
  { ...baseUnit, commands:['attack','strong','defend'], id: 'astel', name: 'アステル', role: '戦士', weapons: ['剣', '弓', '双剣'], maxHp: 180, hp: 180, maxMp: 24, mp: 24, attack: 32, speed: 24, color: 0x71b9ff },
  { ...baseUnit, commands:['attack','guard','cover','defend'], id: 'rina', name: 'リナ', role: 'タンク', weapons: ['盾＆槍', '盾＆フレイル', '盾＆突剣'], maxHp: 240, hp: 240, maxMp: 30, mp: 30, attack: 24, speed: 20, color: 0xe1b86c },
  { ...baseUnit, commands:['attack','fire','heal','defend'], id: 'mei', name: 'メイ', role: '魔法攻撃', weapons: ['ワンド', 'ロッド', 'メイス'], maxHp: 150, hp: 150, maxMp: 48, mp: 48, attack: 28, speed: 16, color: 0xc6a1ee },
];
export const enemyTemplates: Unit[] = ['星喰いの影', '霧の番人', '夜の使い'].map((name, i) => ({
  ...baseUnit, commands:['attack'], experienceReward:40, affinities:i===1?{fire:1.5,water:0.5}:i===2?{fire:0.5,light:1.5}:{}, id: `enemy${i}`, name, role: '魔物', weapons: [], maxHp: 240 + i * 20, hp: 240 + i * 20,
  maxMp: 0, mp: 0, attack: 18 + i * 2, speed: [22, 18, 14][i], color: 0x7c83b8,
}));

export function cloneUnit(unit:Unit):Unit {return {...unit,treeEffects:unit.treeEffects?.map(e=>({...e})),treeBonuses:unit.treeBonuses?{...unit.treeBonuses}:undefined,attackStatuses:unit.attackStatuses?.map(s=>({...s})),weapons:[...unit.weapons],commands:[...unit.commands],affinities:{...unit.affinities},statusResistance:{...unit.statusResistance},statuses:unit.statuses.map(s=>({...s})),modifiers:unit.modifiers.map(m=>({...m}))};}
