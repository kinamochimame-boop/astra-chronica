import {withSkillTree,treeValue,treePowerRate,treeHealingRate,treeReduction,skillMpCost,TREE_LIMITS,type SkillTreeState} from './skill-tree';
import {equippedUnit,equippedWeapon,normalizeEquipment,type EquipmentState} from './equipment';
import {isSkillLearned,type SkillAccess} from './learning';
import {STAR_POWER} from './star-power';
import { BALANCE } from './balance';
import {heroes,enemyTemplates,skills,commandsFor,cloneUnit} from './data/combat';
import type {Unit,Command,ActionResult,BattleEvent,StatusId,ModifierEffect,Skill} from './types';
import {inflict,modify,clearStatus,blockingStatus,isSilenced,endTurn,statValue,affinity,statusDefinitions} from './effects';
import {EFFECT_RULES} from './data/effects';
import {growUnit,type PartyProgress} from './progression';
export {heroes,enemyTemplates,skills,commandsFor} from './data/combat';
export type {Unit,Command,ActionResult,BattleEvent} from './types';
/** Each successful action advances exactly once. Invalid commands never consume a turn or MP. */
export interface BattleSetup {name:string;enemies:readonly Unit[]}
export class Battle {
  readonly encounterName:string;
  private enemyActions=new Map<string,number>();
  readonly allies:Unit[];
  readonly enemies:Unit[];
  blocked: StatusId | undefined;
  round = 1;
  private queue: string[] = [];
  private decision:{id:string;speed:number}[]=[];
  readonly log: string[] = ['霧の森で、三体の魔物が立ちはだかった。'];
  constructor(private readonly random: () => number = Math.random, party?:PartyProgress,private readonly skillAccess:SkillAccess=isSkillLearned,equipment?:EquipmentState,setup?:BattleSetup,skillTree?:SkillTreeState) {
    this.enemies=(setup?.enemies??enemyTemplates).map(cloneUnit);this.encounterName=setup?.name??'霧の森の遭遇';
    if(setup)this.log[0]=`${setup.name}で、${this.enemies.length}体の魔物が立ちはだかった。`;
    const slots=equipment?normalizeEquipment(equipment).equipped:undefined;
    this.allies=heroes.map(h=>({...withSkillTree(equippedUnit(growUnit(cloneUnit(h),party?.[h.id]),slots?.[h.id as keyof EquipmentState['equipped']]),skillTree?.[h.id as keyof SkillTreeState]),star:0,tauntRounds:undefined,barrierCharges:undefined}));
    this.refill();this.prepareTurn();
  }
  isLearned(unit:Unit,command:Command){return commandsFor(unit).includes(command)&&this.skillAccess(unit,command)}
  resetBattleResources(){for(const u of this.units){u.star=0;u.tauntRounds=undefined;u.barrierCharges=undefined}}
  private gainStar(unit:Unit,amount:number){if(this.allies.includes(unit))unit.star=Math.min(STAR_POWER.max,unit.star+amount+Math.min(TREE_LIMITS.starBonus,treeValue(unit,'starGain')))}
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
  /** Manual simulation only: consume an opportunity without dealing damage. */
  waitTurn():ActionResult {
    const actor=this.current;
    if(!actor)return {ok:false,reason:'戦闘は終了しています。'};
    if(this.blocked)return this.skipTurn();
    return this.complete({actor:actor.id,target:actor.id,command:'defend',amount:0,kind:'status',critical:false,covered:false,label:'待機',logs:[`${actor.name}は検証用に待機した。`]});
  }
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
  get roundOrder(){return this.decision.map(entry=>({...entry}))}
  get remainingOrder(){return this.queue.map(id=>this.units.find(u=>u.id===id)!).filter(u=>u.hp>0)}
  get projectedOrder(){return this.order().map(u=>({id:u.id,speed:statValue(u,'speed')}))}
  private refill() { this.decision=this.projectedOrder;this.queue = this.decision.map(u => u.id); }
  targets(command: Command, actor = this.current): Unit[] {
    if (!actor) return [];
    const targetKind = skills[command].target;
    if (targetKind === 'self') return [actor];
    if (targetKind === 'allAllies') return this.allies.filter(u=>u.hp>0);
    const pool = targetKind === 'enemy' ? this.enemies : this.allies;
    return pool.filter(u => u.hp > 0 && (command !== 'cover' || u !== actor));
  }
  mpCost(command:Command,actor=this.current){return actor?skillMpCost(actor,command):skills[command].cost}
  canUse(command: Command): boolean {
    const actor = this.current;
    return this.phase === 'player' && !this.blocked && !!actor && this.isLearned(actor,command) && actor.star>=(skills[command].starCost??0) && actor.mp >= this.mpCost(command,actor) && !(isSilenced(actor)&&['magic','heal'].includes(skills[command].kind)) && this.targets(command).length > 0 && !(skills[command].target==='allAllies'&&skills[command].kind==='heal'&&!this.targets(command).some(u=>u.hp<u.maxHp||(skills[command].cleanse&&u.statuses.length>0)));
  }
  act(command: Command, targetId?: string, expectedActor = this.current?.id): ActionResult {
    const actor = this.current;
    if (!actor || actor.id !== expectedActor || !this.canUse(command)) return { ok: false, reason: '今はそのコマンドを使えません。' };
    const skill=skills[command],all=skill.target==='allAllies',weapon=equippedWeapon(actor),hits=command==='attack'?(weapon?.effects.normalHits??1):(skill.hits??1);
    const targets=all?this.targets(command):skill.target==='self'?[actor]:this.targets(command).filter(u=>u.id===targetId);
    if(!targets.length)return {ok:false,reason:'生存している対象を選んでください。'};
    if(skill.kind==='heal'&&!targets.some(u=>u.hp<u.maxHp||(skill.cleanse&&u.statuses.length>0)))return {ok:false,reason:'HPが満タンです。別の味方を選んでください。'};
    actor.mp-=this.mpCost(command,actor);actor.star-=skill.starCost??0;
    const target=targets[0],event=this.makeEvent(actor,target,command);
    if(skill.starCost)event.logs.push(`${actor.name}の必殺技 ${skill.name}！ 星力${skill.starCost}消費。`);
    if(skill.kind==='guard'){
      actor.guarding=command==='guard'?'guard':'defend';event.logs.push(`${actor.name}は${skill.name}！ 次の行動まで身を守る。`);
    }else if(skill.kind==='cover'){
      actor.covering=target.id;event.logs.push(`${actor.name}は${target.name}をかばう！`);
    }else if(skill.kind==='taunt'){
      actor.tauntRounds=2+treeValue(actor,'tauntRounds');event.label='挑発';if(actor.tauntRounds>2)event.logs.push(`星脈の強化で挑発は${actor.tauntRounds}ラウンド持続。`);event.logs.push(`${actor.name}は挑発！ ${actor.tauntRounds===2?'発動ラウンドと次ラウンド':`発動ラウンドを含む${actor.tauntRounds}ラウンド`}の単体攻撃を引き受ける。`);
    }else{
      const parts:BattleEvent[]=[];
      for(const recipient of targets){
        for(let hit=0;hit<hits&&recipient.hp>0;hit++){
          const part=all||hits>1?this.makeEvent(actor,recipient,command):event;
          if(hits>1){part.hitIndex=hit+1;part.logs.push(`${skill.name} 第${hit+1}撃`)}
          if(skill.kind==='heal'){
            part.kind='heal';part.amount=Math.min(Math.round((skill.power??0)*(weapon?.effects.healingRate??1)*treeHealingRate(actor,command)*(1+treeValue(recipient,'receivedHealing'))),recipient.maxHp-recipient.hp);recipient.hp+=part.amount;
            part.logs.push(`${actor.name}の${skill.name}！ ${recipient.name}のHPが${part.amount}回復。`);
            if(skill.cleanse){const names=recipient.statuses.map(s=>statusDefinitions[s.id].name);clearStatus(recipient);if(names.length)part.logs.push(`${recipient.name}の${names.join('・')}を解除。`)}
          }else if(skill.kind==='barrier'){
            recipient.barrierCharges=1;part.label='誓盾';part.logs.push(`${recipient.name}に1回限りの50%軽減を付与。`);
          }else if(skill.kind==='buff'){
            part.label='防御力上昇';
          }else{
            this.damage(part,actor,recipient,skill.power!==undefined?skill.power*(skill.kind==='magic'&&skill.element!=='none'?(weapon?.effects.magicRate??1):1):statValue(actor,'attack')*(skill.attackScale??1)/(command==='attack'?hits:1));
          }
          this.applyEffects(part,actor,recipient,skill);parts.push(part);
        }
      }
      if(all||hits>1){
        event.effects=parts;event.kind=skill.kind==='heal'?'heal':skill.kind==='physical'||skill.kind==='magic'?'damage':'status';
        event.amount=parts.reduce((sum,p)=>sum+p.amount,0);event.critical=parts.some(p=>p.critical);event.affinity=parts[0]?.affinity;
        event.logs.push(...parts.flatMap(p=>p.logs));
      }
    }
    if(['guard','cover','taunt'].includes(skill.kind))this.applyEffects(event,actor,target,skill);
    for(const effect of skill.selfModifiers??[])if(modify(actor,{...effect,turns:effect.turns+treeValue(actor,'modifierDuration',e=>e.command===command)}))event.logs.push(`${actor.name}の能力値が変化した。`);
    if(!skill.starCost){
      if(command==='attack'){if((event.effects??[event]).some(hit=>(hit.hpLoss??0)>0))this.gainStar(actor,STAR_POWER.attack)}
      else this.gainStar(actor,skill.kind==='guard'?STAR_POWER.defend:STAR_POWER.skill);
    }
    return this.complete(event);
  }
  private makeEvent(actor:Unit,target:Unit,command:Command):BattleEvent {
    return {actor:actor.id,target:target.id,command,amount:0,kind:'status',critical:false,covered:false,logs:[],...(skills[command].starCost?{ultimate:true}:{})};
  }
  enemyAct(expectedActor = this.current?.id): ActionResult {
    const actor = this.current;
    if (this.phase !== 'enemy' || this.blocked || !actor || actor.id !== expectedActor) return { ok: false, reason: '敵の行動ではありません。' };
    const action=(this.enemyActions.get(actor.id)??0)+1;this.enemyActions.set(actor.id,action);
    if(actor.enemyPattern==='mistGuardian'&&action%3===2)return this.complete({actor:actor.id,target:actor.id,command:'defend',amount:0,kind:'status',critical:false,covered:false,label:'霧の吸収',hint:'次は霧裂き！ 防御やガードで備えよう。',logs:[`${actor.name}は霧を吸い込んでいる！ 次の行動は強烈な「霧裂き」。防御やガードで備えよう。`]});
    const heavy=actor.enemyPattern==='mistGuardian'&&action%3===0;
    const living = this.allies.filter(u => u.hp > 0);
    const taunter=living.find(u=>(u.tauntRounds??0)>0);
    const original = taunter||living[Math.min(living.length - 1, Math.floor(this.random() * living.length))];
    const protector = this.allies.find(u => u.hp > 0 && u.covering === original.id);
    const target = protector || original;
    const event: BattleEvent = { actor: actor.id, target: target.id, command: 'attack', amount: 0, kind: 'damage', critical: false, covered: !!protector, logs: [] };
    if(taunter){event.taunted=true;event.logs.push(`${actor.name}は${taunter.name}の挑発に引き寄せられた！`)}
    if (protector) event.logs.push(`${protector.name}が${original.name}をかばった！`);
    if(heavy)event.logs.push(`${actor.name}の霧裂き！ 溜めた霧を放つ強攻撃！`);
    this.damage(event, actor, target, statValue(actor,'attack') * (heavy?1.7:1) * (protector ? Math.max(TREE_LIMITS.coverMinimum,BALANCE.coverMultiplier-treeValue(protector,'coverReduction')) : 1));
    this.applyEffects(event,actor,target,skills.attack);
    return this.complete(event);
  }
  private applyEffects(event:BattleEvent,actor:Unit,target:Unit,skill:Skill){
    if(target.hp<=0||event.label==='ミス')return;
    const effects=[...(skill.statuses??[]),...(skill.kind==='physical'?actor.attackStatuses??[]:[])];
    for(const effect of effects)if(inflict(target,effect.id,this.random,Math.min(1,effect.chance+treeValue(actor,'statusChance',e=>e.command===event.command)),effect.turns))event.logs.push(`${target.name}に${statusDefinitions[effect.id].name}を付与！`);
    for(const effect of skill.modifiers??[])if(modify(target,{...effect,amount:effect.amount+treeValue(actor,'modifierStrength',e=>e.command===event.command),turns:effect.turns+treeValue(actor,'modifierDuration',e=>e.command===event.command)}))event.logs.push(`${target.name}の能力値が変化した。`);
  }
  private damage(event: BattleEvent, actor: Unit, target: Unit, power: number) {
    const skill=skills[event.command];
    if(skill.kind==='physical'&&actor.statuses.some(s=>s.id==='blind')&&this.random()>=statusDefinitions.blind.accuracy!){
      event.label='ミス';event.kind='status';event.logs.push(`${actor.name}の攻撃は暗闇で外れた。`);return;
    }
    event.element=skill.kind==='physical'?actor.attackElement:skill.element;
    event.affinity=affinity(target,event.element);
    event.kind = 'damage'; event.critical = this.random() < Math.min(TREE_LIMITS.criticalRate,BALANCE.criticalChance+treeValue(actor,'criticalRate'));
    const treeRate=treePowerRate(actor,event.command,event.element??'none')*treeReduction(target);
    const criticalRate=Math.min(TREE_LIMITS.criticalDamage,BALANCE.criticalMultiplier+treeValue(actor,'criticalDamage'));
    const barrier=(target.barrierCharges??0)>0?0.5:1;
    const reduction = target.guarding === 'guard' ? Math.max(TREE_LIMITS.guardMinimum,BALANCE.guardMultiplier-treeValue(target,'guardReduction')) : target.guarding ? Math.max(TREE_LIMITS.guardMinimum,BALANCE.defendMultiplier-treeValue(target,'defendReduction')) : 1;
    event.amount = Math.max(1, Math.round(power * treeRate * (EFFECT_RULES.defenseReference/Math.max(EFFECT_RULES.minimumDefense,statValue(target,'defense'))) * event.affinity * reduction * barrier * (event.critical ? criticalRate : 1)));
    event.damageTrace={power,effectiveAttack:statValue(actor,'attack'),effectiveDefense:statValue(target,'defense'),
      defenseMultiplier:EFFECT_RULES.defenseReference/Math.max(EFFECT_RULES.minimumDefense,statValue(target,'defense')),
      elementMultiplier:event.affinity,guardMultiplier:reduction,coverMultiplier:event.covered?Math.max(TREE_LIMITS.coverMinimum,BALANCE.coverMultiplier-treeValue(target,'coverReduction')):1,
      criticalMultiplier:event.critical?criticalRate:1,barrierMultiplier:barrier,treeMultiplier:treeRate};
    if(event.affinity===0)event.amount=0;
    const beforeHp=target.hp;target.hp = Math.max(0, target.hp - event.amount);event.hpLoss=beforeHp-target.hp;
    if(event.hpLoss>0){this.gainStar(target,STAR_POWER.damage);if(barrier<1){target.barrierCharges=0;event.logs.push(`${target.name}の誓盾がダメージを50%軽減して消えた。`)}}
    if(event.amount>0){
      for(const state of [...target.statuses])if(statusDefinitions[state.id].breakOnDamage){clearStatus(target,state.id);event.logs.push(`${target.name}の${statusDefinitions[state.id].name}がダメージで解除された。`)}
    }
    if(event.affinity!==1)event.logs.push(event.affinity>1?'弱点を突いた！':'属性耐性で軽減された。');
    event.logs.push(`${actor.name}の${skills[event.command].name}！ ${target.name}に${event.amount}ダメージ。${event.critical ? ' クリティカル！' : ''}`);
    if (target.hp === 0) {target.statuses=[];target.modifiers=[];target.guarding=undefined;target.covering=undefined;target.tauntRounds=undefined;target.barrierCharges=undefined;}
    if (target.hp === 0) event.logs.push(`${target.name}は${this.enemies.includes(target) ? '撃破された' : '戦闘不能になった'}。`);
  }
  private complete(event: BattleEvent): ActionResult {
    const actor=this.units.find(u=>u.id===event.actor)!;
    event.logs.push(...endTurn(actor,()=>this.gainStar(actor,STAR_POWER.damage)));
    if(actor.hp===0){actor.tauntRounds=undefined;actor.barrierCharges=undefined;}
    this.log.push(...event.logs); if (this.log.length > 100) this.log.splice(0, this.log.length - 100);
    this.queue.shift(); this.queue = this.queue.filter(id => this.units.some(u => u.id === id && u.hp > 0));
    if (!this.result && !this.queue.length) {
      for(const u of this.units)if((u.tauntRounds??0)>0){u.tauntRounds=(u.tauntRounds??0)-1;if(u.tauntRounds===0){const line=`${u.name}の挑発が期限切れで解除された。`;event.logs.push(line);this.log.push(line)}}
      this.round++; this.refill();
    }
    if(this.result)this.resetBattleResources();
    // Effects expire at the start of their owner's next turn, including skipped dead units.
    this.prepareTurn();
    return { ok: true, event };
  }
}
