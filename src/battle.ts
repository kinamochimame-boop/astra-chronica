import { BALANCE } from './balance';

export type Command = 'attack' | 'strong' | 'guard' | 'cover' | 'fire' | 'heal' | 'defend';
export type TargetKind = 'enemy' | 'ally' | 'self';
export interface Unit {
  id: string; name: string; role: string; weapons: string[];
  maxHp: number; hp: number; maxMp: number; mp: number;
  attack: number; speed: number; color: number; texture?: string;
  guarding?: 'defend' | 'guard'; covering?: string;
}
export interface Skill { name: string; cost: number; target: TargetKind; description: string }
export const skills: Record<Command, Skill> = {
  attack: { name: '通常攻撃', cost: 0, target: 'enemy', description: '敵単体に攻撃' },
  strong: { name: '強撃', cost: 6, target: 'enemy', description: '通常攻撃の2倍の威力' },
  guard: { name: 'ガード', cost: 3, target: 'self', description: '次の自分の行動まで被ダメージ75%軽減' },
  cover: { name: 'かばう', cost: 4, target: 'ally', description: '次の自分の行動まで選んだ味方への攻撃を引き受け、35%軽減' },
  fire: { name: 'ファイア', cost: 7, target: 'enemy', description: '敵単体に威力72の魔法攻撃' },
  heal: { name: 'ヒール', cost: 8, target: 'ally', description: '味方単体のHPを85回復（蘇生不可）' },
  defend: { name: '防御', cost: 0, target: 'self', description: '次の自分の行動まで被ダメージ50%軽減' },
};
export const commandsFor = (u: Unit): Command[] => u.id === 'astel'
  ? ['attack', 'strong', 'defend'] : u.id === 'rina'
    ? ['attack', 'guard', 'cover', 'defend'] : u.id === 'mei'
      ? ['attack', 'fire', 'heal', 'defend'] : ['attack'];
export const heroes: Unit[] = [
  { id: 'astel', name: 'アステル', role: '戦士', weapons: ['剣', '弓', '双剣'], maxHp: 180, hp: 180, maxMp: 24, mp: 24, attack: 32, speed: 24, color: 0x71b9ff },
  { id: 'rina', name: 'リナ', role: 'タンク', weapons: ['盾＆槍', '盾＆フレイル', '盾＆突剣'], maxHp: 240, hp: 240, maxMp: 30, mp: 30, attack: 24, speed: 20, color: 0xe1b86c },
  { id: 'mei', name: 'メイ', role: '魔法攻撃', weapons: ['ワンド', 'ロッド', 'メイス'], maxHp: 150, hp: 150, maxMp: 48, mp: 48, attack: 28, speed: 16, color: 0xc6a1ee },
];
export const enemyTemplates: Unit[] = ['星喰いの影', '霧の番人', '夜の使い'].map((name, i) => ({
  id: `enemy${i}`, name, role: '魔物', weapons: [], maxHp: 240 + i * 20, hp: 240 + i * 20,
  maxMp: 0, mp: 0, attack: 18 + i * 2, speed: [22, 18, 14][i], color: 0x7c83b8,
}));
export interface BattleEvent {
  actor: string; target: string; command: Command; amount: number;
  kind: 'damage' | 'heal' | 'status'; critical: boolean; covered: boolean; logs: string[];
}
export type ActionResult = { ok: true; event: BattleEvent } | { ok: false; reason: string };

/** Each successful action advances exactly once. Invalid commands never consume a turn or MP. */
export class Battle {
  readonly allies = heroes.map(h => ({ ...h }));
  readonly enemies = enemyTemplates.map(e => ({ ...e }));
  round = 1;
  private queue: string[] = [];
  readonly log: string[] = ['霧の森で、三体の魔物が立ちはだかった。'];
  constructor(private readonly random: () => number = Math.random) { this.refill(); }
  get units() { return [...this.allies, ...this.enemies]; }
  get result(): 'victory' | 'defeat' | null {
    return this.enemies.every(e => e.hp === 0) ? 'victory' : this.allies.every(a => a.hp === 0) ? 'defeat' : null;
  }
  get current(): Unit | undefined { return this.result ? undefined : this.units.find(u => u.id === this.queue[0]); }
  get phase(): 'player' | 'enemy' | 'finished' {
    return !this.current ? 'finished' : this.allies.includes(this.current) ? 'player' : 'enemy';
  }
  private order() { return this.units.filter(u => u.hp > 0).sort((a, b) => b.speed - a.speed); }
  /** Remaining actions plus next round, excluding defeated units. Equal speed uses stable party order. */
  get upcoming(): Unit[] {
    if(this.result) return [];
    return [...this.queue.slice(1).map(id => this.units.find(u => u.id === id)!).filter(u => u.hp > 0), ...this.order()].slice(0, 6);
  }
  private refill() { this.queue = this.order().map(u => u.id); }
  targets(command: Command, actor = this.current): Unit[] {
    if (!actor) return [];
    const targetKind = skills[command].target;
    if (targetKind === 'self') return [actor];
    const pool = targetKind === 'enemy' ? this.enemies : this.allies;
    return pool.filter(u => u.hp > 0 && (command !== 'cover' || u !== actor));
  }
  canUse(command: Command): boolean {
    const actor = this.current;
    return this.phase === 'player' && !!actor && commandsFor(actor).includes(command) && actor.mp >= skills[command].cost && this.targets(command).length > 0;
  }
  act(command: Command, targetId?: string, expectedActor = this.current?.id): ActionResult {
    const actor = this.current;
    if (!actor || actor.id !== expectedActor || !this.canUse(command)) return { ok: false, reason: '今はそのコマンドを使えません。' };
    const target = skills[command].target === 'self' ? actor : this.targets(command).find(u => u.id === targetId);
    if (!target) return { ok: false, reason: '生存している対象を選んでください。' };
    if (command === 'heal' && target.hp === target.maxHp) return { ok: false, reason: 'HPが満タンです。別の味方を選んでください。' };
    actor.mp -= skills[command].cost;
    const event: BattleEvent = { actor: actor.id, target: target.id, command, amount: 0, kind: 'status', critical: false, covered: false, logs: [] };
    if (command === 'defend' || command === 'guard') {
      actor.guarding = command;
      event.logs.push(`${actor.name}は${skills[command].name}！ 次の行動まで身を守る。`);
    } else if (command === 'cover') {
      actor.covering = target.id;
      event.logs.push(`${actor.name}は${target.name}をかばう！`);
    } else if (command === 'heal') {
      event.kind = 'heal'; event.amount = Math.min(BALANCE.healPower, target.maxHp - target.hp);
      target.hp += event.amount; event.logs.push(`${actor.name}のヒール！ ${target.name}のHPが${event.amount}回復。`);
    } else {
      const power = command === 'fire' ? BALANCE.firePower : actor.attack * (command === 'strong' ? BALANCE.strongPower : 1);
      this.damage(event, actor, target, power);
    }
    return this.complete(event);
  }
  enemyAct(expectedActor = this.current?.id): ActionResult {
    const actor = this.current;
    if (this.phase !== 'enemy' || !actor || actor.id !== expectedActor) return { ok: false, reason: '敵の行動ではありません。' };
    const living = this.allies.filter(u => u.hp > 0);
    const original = living[Math.min(living.length - 1, Math.floor(this.random() * living.length))];
    const protector = this.allies.find(u => u.hp > 0 && u.covering === original.id);
    const target = protector || original;
    const event: BattleEvent = { actor: actor.id, target: target.id, command: 'attack', amount: 0, kind: 'damage', critical: false, covered: !!protector, logs: [] };
    if (protector) event.logs.push(`${protector.name}が${original.name}をかばった！`);
    this.damage(event, actor, target, actor.attack * (protector ? BALANCE.coverMultiplier : 1));
    return this.complete(event);
  }
  private damage(event: BattleEvent, actor: Unit, target: Unit, power: number) {
    event.kind = 'damage'; event.critical = this.random() < BALANCE.criticalChance;
    const reduction = target.guarding === 'guard' ? BALANCE.guardMultiplier : target.guarding ? BALANCE.defendMultiplier : 1;
    event.amount = Math.max(1, Math.round(power * reduction * (event.critical ? BALANCE.criticalMultiplier : 1)));
    target.hp = Math.max(0, target.hp - event.amount);
    event.logs.push(`${actor.name}の${skills[event.command].name}！ ${target.name}に${event.amount}ダメージ。${event.critical ? ' クリティカル！' : ''}`);
    if (target.hp === 0) event.logs.push(`${target.name}は${this.enemies.includes(target) ? '撃破された' : '戦闘不能になった'}。`);
  }
  private complete(event: BattleEvent): ActionResult {
    this.log.push(...event.logs); if (this.log.length > 100) this.log.splice(0, this.log.length - 100);
    this.queue.shift(); this.queue = this.queue.filter(id => this.units.some(u => u.id === id && u.hp > 0));
    if (!this.result && !this.queue.length) { this.round++; this.refill(); }
    // Effects expire at the start of their owner's next turn, including skipped dead units.
    if (this.current) { this.current.guarding = undefined; this.current.covering = undefined; }
    return { ok: true, event };
  }
}
