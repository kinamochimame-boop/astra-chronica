import type {TreeEffect,TreeStat} from './data/skill-tree';
export type Element = 'fire' | 'water' | 'wind' | 'earth' | 'light' | 'dark' | 'none';
export type StatusId = 'poison' | 'paralysis' | 'sleep' | 'blind' | 'silence' | 'burn' | 'freeze';
export type Stat = 'attack' | 'defense' | 'speed';
export type Command = 'attack' | 'strong' | 'guard' | 'cover' | 'fire' | 'heal' | 'defend' | 'fang' | 'armorBreak' | 'galeSlash' | 'starSlash' | 'taunt' | 'guardianField' | 'shieldBash' | 'oathShield' | 'ice' | 'thunder' | 'groupHeal' | 'miracle';
export type TargetKind = 'enemy' | 'ally' | 'self' | 'allAllies';
export interface StatusInstance { id: StatusId; remaining: number }
export interface Modifier { stat: Stat; amount: number; remaining: number }
export interface Unit {
  id: string; name: string; role: string; weapons: string[];
  maxHp: number; hp: number; maxMp: number; mp: number;
  attack: number; defense: number; speed: number; color: number; texture?: string; weaponId?:string; enemyPattern?:'mistGuardian';
  treeEffects?:TreeEffect[]; treeBonuses?:Partial<Record<TreeStat,number>>;
  level: number; star:number; tauntRounds?:number; barrierCharges?:number; attackElement: Element; affinities: Partial<Record<Element, number>>;
  statusResistance: Partial<Record<StatusId, number>>;
  statuses: StatusInstance[]; modifiers: Modifier[]; commands: Command[];
  experienceReward: number; attackStatuses?: StatusEffect[]; guarding?: 'defend' | 'guard'; covering?: string;
}
export interface StatusEffect { id: StatusId; chance: number; turns?: number }
export interface ModifierEffect { stat: Stat; amount: number; turns: number }
export interface Skill {
  name: string; cost: number; target: TargetKind; description: string;
  kind: 'physical' | 'magic' | 'heal' | 'guard' | 'cover' | 'buff' | 'taunt' | 'barrier';
  element: Element; power?: number; attackScale?: number;
  statuses?: StatusEffect[]; modifiers?: ModifierEffect[]; selfModifiers?:ModifierEffect[];
  hits?:number; unlockLevel?:number; starCost?:number; cleanse?:boolean;
}
export interface DamageTrace {
  power:number; effectiveAttack:number; effectiveDefense:number; defenseMultiplier:number;
  elementMultiplier:number; guardMultiplier:number; coverMultiplier:number; criticalMultiplier:number; barrierMultiplier?:number; treeMultiplier?:number;
}
export interface BattleEvent {
  actor: string; target: string; command: Command; amount: number;
  kind: 'damage' | 'heal' | 'status'; critical: boolean; covered: boolean; logs: string[];
  hint?:string; label?: string; element?: Element; affinity?: number; damageTrace?:DamageTrace; effects?:BattleEvent[]; hpLoss?:number; ultimate?:boolean; taunted?:boolean; hitIndex?:number;
}
export type ActionResult = { ok: true; event: BattleEvent } | { ok: false; reason: string };
