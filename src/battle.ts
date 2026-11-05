import { BALANCE } from './balance';
import {heroes,enemyTemplates,skills,commandsFor,cloneUnit} from './data/combat';
import type {Unit,Command,ActionResult,BattleEvent,StatusId,ModifierEffect,Skill} from './types';
import {inflict,modify,clearStatus,blockingStatus,isSilenced,endTurn,statValue,affinity,statusDefinitions} from './effects';
import {EFFECT_RULES} from './data/effects';
import {growUnit,type PartyProgress} from './progression';
export {heroes,enemyTemplates,skills,commandsFor} from './data/combat';
export type {Unit,Command,ActionResult,BattleEvent} from './types';
/** Each successful action advances exactly once. Invalid commands never consume a turn or MP. */
export class Battle {
  readonly allies:Unit[];
  readonly enemies = enemyTemplates.map(cloneUnit);
  blocked: StatusId | undefined;
  round = 1;
  private queue: string[] = [];
  readonly log: string[] = ['霧の森で、三体の魔物が立ちはだかった。'];
  constructor(private readonly random: () => number = Math.random, party?:PartyProgress) {
    this.allies=heroes.map(h=>growUnit(cloneUnit(h),party?.[h.id]));
    this.refill();this.prepareTurn();
  }
  get experienceReward(){return this.enemies.reduce((sum,e)=>sum+e.experienceReward,0)}
  applyStatus(targetId:string,id:StatusId,chance?:number,turns?:number):boolean {
    const target=this.units.find(u=>u.id===targetId);if(!target||this.result)return false;
    const applied=inflict(target,id,this.random,chance,turns);
    this.log.push(`${target.name}への${statusDefinitions[id].name}：${applied?'付与成功':'付与失敗'}`);
    if(applied&&target===this.current)this.prepareTurn();
    return applied;
  }
  clearStatus(targetId:string,id?:StatusId){const u=this.units.find(u=>u.id===targetId);if(u){clearStatus(u,id);if(u===this.current&&(!id||id===this.blocked))this.prepareTurn()}}
  applyModifier(targetId:string,effect:ModifierEffect):boolean {
    const u=this.units.find(u=>u.id===targetId);return !this.result&&!!u&&modify(u,effect);
  }
  clearModifiers(targetId:string){const unit=this.units.find(u=>u.id===targetId);if(unit)unit.modifiers=[]}
  private prepareTurn(){
    const actor=this.current;this.blocked=actor?blockingStatus(actor,this.random):undefined;
    if(actor){actor.guarding=undefined;actor.covering=undefined}
  }
  skipTurn():ActionResult {
    const actor=this.current;
    if(!actor||!this.blocked)return {ok:false,reason:'行動不能ではありません。'};
    const name=statusDefinitions[this.blocked].name;
    return this.complete({actor:actor.id,target:actor.id,command:'attack',amount:0,kind:'status',critical:false,covered:false,label:name,logs:[`${actor.name}は${name}で行動できない。`]});
  }
  get units() { return [...this.allies, ...this.enemies]; }
  get result(): 'victory' | 'defeat' | null {
    return this.enemies.every(e => e.hp === 0) ? 'victory' : this.allies.every(a => a.hp === 0) ? 'defeat' : null;
  }
  get current(): Unit | undefined { return this.result ? undefined : this.units.find(u => u.id === this.queue[0]); }
  get phase(): 'player' | 'enemy' | 'finished' {
    return !this.current ? 'finished' : this.allies.includes(this.current) ? 'player' : 'enemy';
  }
  private order() { return this.units.filter(u => u.hp > 0).sort((a, b) => statValue(b,'speed') - statValue(a,'speed')); }
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
    return this.phase === 'player' && !this.blocked && !!actor && commandsFor(actor).includes(command) && actor.mp >= skills[command].cost && !(isSilenced(actor)&&['magic','heal'].includes(skills[command].kind)) && this.targets(command).length > 0;
  }
  act(command: Command, targetId?: string, expectedActor = this.current?.id): ActionResult {
    const actor = this.current;
    if (!actor || actor.id !== expectedActor || !this.canUse(command)) return { ok: false, reason: '今はそのコマンドを使えません。' };
    const target = skills[command].target === 'self' ? actor : this.targets(command).find(u => u.id === targetId);
    if (!target) return { ok: false, reason: '生存している対象を選んでください。' };
    if (command === 'heal' && target.hp === target.maxHp) return { ok: false, reason: 'HPが満タンです。別の味方を選んでください。' };
    actor.mp -= skills[command].cost;
    const event: BattleEvent = { actor: actor.id, target: target.id, command, amount: 0, kind: 'status', critical: false, covered: false, logs: [] };
    const skill=skills[command];
    if (skill.kind === 'guard') {
      actor.guarding = command==='guard'?'guard':'defend';
      event.logs.push(`${actor.name}は${skills[command].name}！ 次の行動まで身を守る。`);
    } else if (skill.kind === 'cover') {
      actor.covering = target.id;
      event.logs.push(`${actor.name}は${target.name}をかばう！`);
    } else if (skill.kind === 'heal') {
      event.kind = 'heal'; event.amount = Math.min(skill.power??0, target.maxHp - target.hp);
      target.hp += event.amount; event.logs.push(`${actor.name}のヒール！ ${target.name}のHPが${event.amount}回復。`);
    } else {
      const power = skill.power??statValue(actor,'attack')*(skill.attackScale??1);
      this.damage(event, actor, target, power);
    }
    this.applyEffects(event,actor,target,skill);
    return this.complete(event);
  }
  enemyAct(expectedActor = this.current?.id): ActionResult {
    const actor = this.current;
    if (this.phase !== 'enemy' || this.blocked || !actor || actor.id !== expectedActor) return { ok: false, reason: '敵の行動ではありません。' };
    const living = this.allies.filter(u => u.hp > 0);
    const original = living[Math.min(living.length - 1, Math.floor(this.random() * living.length))];
    const protector = this.allies.find(u => u.hp > 0 && u.covering === original.id);
    const target = protector || original;
    const event: BattleEvent = { actor: actor.id, target: target.id, command: 'attack', amount: 0, kind: 'damage', critical: false, covered: !!protector, logs: [] };
    if (protector) event.logs.push(`${protector.name}が${original.name}をかばった！`);
    this.damage(event, actor, target, statValue(actor,'attack') * (protector ? BALANCE.coverMultiplier : 1));
    this.applyEffects(event,actor,target,skills.attack);
    return this.complete(event);
  }
  private applyEffects(event:BattleEvent,actor:Unit,target:Unit,skill:Skill){
    if(target.hp<=0||event.label==='ミス')return;
    const effects=[...(skill.statuses??[]),...(skill.kind==='physical'?actor.attackStatuses??[]:[])];
    for(const effect of effects)if(inflict(target,effect.id,this.random,effect.chance,effect.turns))event.logs.push(`${target.name}に${statusDefinitions[effect.id].name}を付与！`);
    for(const effect of skill.modifiers??[])if(modify(target,effect))event.logs.push(`${target.name}の能力値が変化した。`);
  }
  private damage(event: BattleEvent, actor: Unit, target: Unit, power: number) {
    const skill=skills[event.command];
    if(skill.kind==='physical'&&actor.statuses.some(s=>s.id==='blind')&&this.random()>=statusDefinitions.blind.accuracy!){
      event.label='ミス';event.kind='status';event.logs.push(`${actor.name}の攻撃は暗闇で外れた。`);return;
    }
    event.element=skill.kind==='physical'?actor.attackElement:skill.element;
    event.affinity=affinity(target,event.element);
    event.kind = 'damage'; event.critical = this.random() < BALANCE.criticalChance;
    const reduction = target.guarding === 'guard' ? BALANCE.guardMultiplier : target.guarding ? BALANCE.defendMultiplier : 1;
    event.amount = Math.max(1, Math.round(power * (EFFECT_RULES.defenseReference/Math.max(EFFECT_RULES.minimumDefense,statValue(target,'defense'))) * event.affinity * reduction * (event.critical ? BALANCE.criticalMultiplier : 1)));
    if(event.affinity===0)event.amount=0;
    target.hp = Math.max(0, target.hp - event.amount);
    if(event.amount>0){
      for(const state of [...target.statuses])if(statusDefinitions[state.id].breakOnDamage){clearStatus(target,state.id);event.logs.push(`${target.name}の${statusDefinitions[state.id].name}がダメージで解除された。`)}
    }
    if(event.affinity!==1)event.logs.push(event.affinity>1?'弱点を突いた！':'属性耐性で軽減された。');
    event.logs.push(`${actor.name}の${skills[event.command].name}！ ${target.name}に${event.amount}ダメージ。${event.critical ? ' クリティカル！' : ''}`);
    if (target.hp === 0) {target.statuses=[];target.modifiers=[];target.guarding=undefined;target.covering=undefined;}
    if (target.hp === 0) event.logs.push(`${target.name}は${this.enemies.includes(target) ? '撃破された' : '戦闘不能になった'}。`);
  }
  private complete(event: BattleEvent): ActionResult {
    const actor=this.units.find(u=>u.id===event.actor)!;
    event.logs.push(...endTurn(actor));
    this.log.push(...event.logs); if (this.log.length > 100) this.log.splice(0, this.log.length - 100);
    this.queue.shift(); this.queue = this.queue.filter(id => this.units.some(u => u.id === id && u.hp > 0));
    if (!this.result && !this.queue.length) { this.round++; this.refill(); }
    // Effects expire at the start of their owner's next turn, including skipped dead units.
    this.prepareTurn();
    return { ok: true, event };
  }
}
