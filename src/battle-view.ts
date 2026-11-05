import {skills,commandsFor,type Battle,type Unit,type Command,type BattleEvent} from './battle';
import {badges,commandReason,targetReason,visibleOrder,effectPresentation} from './battle-presentation';

export interface BattleViewState {battle:Battle;command:Command;targetId:string;busy:boolean;actingId?:string;actionRound?:number}
export interface BattleViewActions {choose:(c:Command)=>void;target:(id:string)=>void;execute:()=>void;retreat:()=>void}
/** DOM controls remain separate from Phaser visuals and from all combat calculations. */
export class BattleView {
 private state!:BattleViewState;
 private dialog:HTMLDialogElement;
 private effects:HTMLElement;
 private lastSummary='';
 private commandActor='';
 constructor(private host:HTMLElement,canvasHost:HTMLElement,private actions:BattleViewActions){
  host.className='battle-screen';host.closest('.shell')!.classList.add('battle-mode');
  host.innerHTML=`<div class="battle-top"><div><p class="eyebrow">MISTWOOD · ROUND <span id="ui-round"></span></p><h1>霧の森の遭遇</h1></div><button class="menu-button" aria-label="戦闘メニュー">☰ <span>メニュー</span></button></div>
  <div class="initiative"><p class="turn-banner" role="status"></p><div class="turn-order" role="list" aria-label="行動順"><span class="sr-only">次の行動：</span><div class="turn-chips"></div></div></div>
  <section class="enemies" aria-label="敵と攻撃対象"></section>
  <section class="battle-art" aria-label="敵と三人の味方"><div class="stage-slot"></div><div class="combat-effects" aria-live="polite" aria-atomic="true"></div><p class="ultimate-banner" aria-live="polite"></p><p class="battle-notification" aria-live="polite"></p></section>
  <section class="party" aria-label="味方のHP・MPと対象選択"></section>
  <section class="battle-controls" aria-label="戦闘コマンド"><div class="commands"></div><p class="hint" id="command-description"></p><button class="primary execute-command" aria-describedby="command-description"></button></section>
  <div class="log-strip"><p class="battle-log" role="log" aria-live="polite"></p><button class="log-toggle" aria-label="戦闘ログを開く">ログ ⌃</button></div>
  <dialog class="battle-dialog"><div class="dialog-body"></div><button class="secondary dialog-close">閉じる</button></dialog>`;
  host.querySelector('.stage-slot')!.append(canvasHost);
  this.dialog=host.querySelector('dialog')!;this.effects=host.querySelector('.combat-effects')!;
  host.querySelector<HTMLButtonElement>('.dialog-close')!.onclick=()=>this.dialog.close();
  host.querySelector<HTMLButtonElement>('.menu-button')!.onclick=()=>this.openMenu();
  host.querySelector<HTMLButtonElement>('.log-toggle')!.onclick=()=>this.openLog();
  host.querySelector<HTMLButtonElement>('.execute-command')!.onclick=()=>{if(!this.state.busy)this.actions.execute()};
 }
 private get<T extends HTMLElement=HTMLElement>(selector:string){return this.host.querySelector<T>(selector)!}
 update(state:BattleViewState){
  this.state=state;const {battle:b,command,targetId,busy}=state;
  const actor=b.units.find(u=>u.id===(busy?state.actingId:b.current?.id));if(!actor)return;
  this.host.dataset.actorId=actor.id;this.host.dataset.phase=busy?'animating':b.phase;this.host.dataset.round=String(b.round);
  this.get('#ui-round').textContent=String(busy?state.actionRound??b.round:b.round);
  this.get('.turn-banner').textContent=`${busy?'行動中':b.blocked?'行動不能':b.phase==='enemy'?'敵の行動':'コマンドを選択'}：${actor.name}${busy&&state.actionRound!==b.round?` ｜次はROUND ${b.round}`:''}`;
  const chips=this.get('.turn-chips');chips.replaceChildren(...visibleOrder(b,busy?state.actingId:undefined).map((u,i)=>{
   const now=i===0&&u.id===actor.id;const chip=document.createElement('span');chip.setAttribute('role','listitem');chip.className=`turn-chip ${b.allies.includes(u)?'friend':'foe'} ${now?'now':''}`;chip.dataset.unitId=u.id;chip.setAttribute('aria-label',`${now?'現在':'次'}：${b.allies.includes(u)?'味方':'敵'} ${u.name}`);chip.innerHTML=`<small>${b.allies.includes(u)?'味':'敵'}${now?' ▶':''}</small><span>${u.name}</span>`;return chip;
  }));
  const selectable=b.phase==='player'&&!busy&&!b.blocked;
  this.get('.enemies').replaceChildren(...b.enemies.map(u=>this.card(u,false,actor.id,selectable)));
  this.get('.party').replaceChildren(...b.allies.map(u=>this.card(u,true,actor.id,selectable)));
  const commands=this.get('.commands');commands.replaceChildren();
  const isAlly=b.allies.includes(actor);
  if(isAlly){
   const allCommands=commandsFor(actor),list=[...allCommands.filter(c=>skills[c].starCost),...allCommands.filter(c=>!skills[c].starCost)];commands.style.setProperty('--command-count',String(Math.min(4,allCommands.filter(c=>!skills[c].starCost).length)));if(this.commandActor!==`${actor.id}:${b.round}`){commands.scrollTop=0;this.commandActor=`${actor.id}:${b.round}`}
   list.forEach(c=>{
    const cell=document.createElement('div');cell.className=`command-cell ${skills[c].starCost?'ultimate-cell':''}`;const reason=commandReason(b,actor,c,busy);
    const button=document.createElement('button');button.className=`command ${c===command?'selected':''} ${skills[c].starCost?'ultimate-command':''}`;button.disabled=!!reason;button.dataset.command=c;button.setAttribute('aria-pressed',String(c===command));button.setAttribute('aria-label',`${skills[c].name}${skills[c].starCost?` 星力${skills[c].starCost}`:skills[c].cost?` MP${skills[c].cost}`:''}`);button.setAttribute('aria-describedby',`reason-${c}`);
    button.innerHTML=`<strong>${skills[c].starCost?'★ 必殺 · ':''}${skills[c].name}</strong><small>${skills[c].starCost?`星力 ${skills[c].starCost}`:skills[c].cost?`MP ${skills[c].cost}`:c==='attack'?'ATTACK':'MP 0'}</small>`;button.onclick=()=>{if(!this.state.busy)this.actions.choose(c)};
    const info=document.createElement('small');info.id=`reason-${c}`;info.className='command-reason';info.textContent=reason;
    cell.append(button,info);commands.append(cell);
   });
  }else commands.innerHTML='<p class="enemy-wait">◆ 敵が行動しています</p>';
  const skill=skills[command],target=b.units.find(u=>u.id===targetId);
  const reason=commandReason(b,actor,command,busy)||targetReason(b,command,targetId);
  this.get('.hint').textContent=selectable?`${skill.name} · ${skill.starCost?`星力${skill.starCost}`:`MP${skill.cost}`}｜${skill.description}。対象：${skill.target==='allAllies'?`生存する味方全体（${b.targets(command).length}人）`:target?.name||'選択してください'}${reason?` — ${reason}`:''}`:busy?'行動を処理しています…':b.blocked?'状態異常で行動をスキップします':'敵の行動を待っています…';
  const execute=this.get<HTMLButtonElement>('.execute-command');execute.disabled=!selectable||!!reason;execute.textContent=selectable?`${skill.name}を実行`:'行動中…';
  this.get('.battle-log').textContent=this.lastSummary||b.log.at(-1)||'';
 }
 private card(u:Unit,ally:boolean,actingId:string,selectable:boolean){
  const {battle:b,command,targetId}=this.state,group=skills[command].target==='allAllies',selected=group?ally&&u.hp>0:u.id===targetId;
  const card=document.createElement('article');card.className=`unit-card ${ally?'party-card':'enemy-card'} ${u.hp===0?'fallen':''} ${u.id===actingId?'acting':''} ${selected?'targeted':''}`;card.dataset.unitId=u.id;
  const button=document.createElement('button');button.className=ally?'ally':'enemy';button.disabled=!selectable||group||!b.targets(command).includes(u);button.setAttribute('aria-pressed',String(selected));button.dataset.targetId=u.id;
  const marker=u.hp===0?(ally?'戦闘不能':'撃破'):`${u.id===actingId?'▶ 行動中':ally?u.role:'敵'}${selected?group?' · ◎全体対象':' · ◎対象':''}`;
  button.innerHTML=`<strong>${u.name}</strong><em>${marker}</em>${this.gauge(u,'hp')}${ally?this.gauge(u,'mp')+this.gauge(u,'star'):''}`;
  button.onclick=()=>{if(!this.state.busy)this.actions.target(u.id)};
  const list=badges(u),details=document.createElement('button');details.className='status-details';details.setAttribute('aria-label',`${u.name}の状態詳細${list.length?`：${list.map(s=>s.name).join('、')}`:'：状態なし'}`);details.disabled=list.length===0;
  details.innerHTML=list.length?list.slice(0,3).map(s=>`<span class="status-symbol ${s.kind}">${s.symbol}</span>`).join('')+(list.length>3?`<span>+${list.length-3}</span>`:''):'<span class="no-status">状態なし</span>';
  details.onclick=()=>this.openInfo(u);
  card.append(button,details);return card;
 }
 private gauge(u:Unit,kind:'hp'|'mp'|'star'){
  const value=kind==='hp'?u.hp:kind==='mp'?u.mp:u.star,max=kind==='hp'?u.maxHp:kind==='mp'?u.maxMp:100,label=kind==='star'?'星力':kind.toUpperCase();
  return `<span class="resource-label">${label} ${value} / ${max}</span><span class="${kind==='hp'?'hp':kind==='mp'?'hp mp':'hp star'}" role="progressbar" aria-label="${u.name} ${label}" aria-valuemin="0" aria-valuemax="${max}" aria-valuenow="${value}"><i style="width:${max?Math.max(0,Math.min(100,value/max*100)):0}%"></i></span>`;
 }
 private open(title:string){this.get('.dialog-body').replaceChildren();const h=document.createElement('h2');h.textContent=title;this.get('.dialog-body').append(h);if(!this.dialog.open)this.dialog.showModal()}
 private openInfo(u:Unit){this.open(`${u.name}の状態（表示時点）`);for(const badge of badges(u)){const p=document.createElement('p');p.textContent=`${badge.symbol} ${badge.name}：${badge.detail}`;this.get('.dialog-body').append(p)}}
 private openLog(){this.open('戦闘ログ');const lines=document.createElement('div');lines.className='normal-log-history';for(const line of this.state.battle.log){const p=document.createElement('p');p.textContent=line;lines.append(p)}this.get('.dialog-body').append(lines)}
 private openMenu(){this.open('戦闘メニュー');const note=document.createElement('p');note.textContent='撤退すると敗北として記録されます。';const retreat=document.createElement('button');retreat.className='secondary';retreat.textContent='撤退する（敗北）';retreat.onclick=()=>{this.dialog.close();this.actions.retreat()};this.get('.dialog-body').append(note,retreat)}
 present(event:BattleEvent,notices:string[]){
  const parts=event.effects??[event],actor=this.state.battle.units.find(u=>u.id===event.actor)!,target=this.state.battle.units.find(u=>u.id===event.target)!;
  const group=skills[event.command].target==='allAllies';
  const values=parts.map(p=>effectPresentation(p).value).join(' / ');
  this.lastSummary=`${actor.name} → ${group?'生存する味方全体':target.name}${event.covered?'（かばう）':''}：${skills[event.command].name} ${values}`;this.get('.battle-log').textContent=this.lastSummary;
  this.effects.replaceChildren();
  parts.forEach((part,i)=>{
   const fx=effectPresentation(part),index=this.state.battle.units.findIndex(u=>u.id===part.target);
   const popup=document.createElement('div');popup.className=`combat-fx ${fx.tone}`;popup.dataset.kind=part.kind;popup.dataset.targetId=part.target;popup.dataset.hitIndex=String(part.hitIndex??1);popup.style.left=`${(70+(index%3)*125)/390*100}%`;popup.style.top=index<3?'62%':'20%';
   popup.style.animationDelay=`${i*70}ms`;if(part.hitIndex)popup.style.marginLeft=`${(i-(parts.length-1)/2)*30}px`;
   const tags=document.createElement('small');tags.textContent=[...(part.hitIndex?[`${part.hitIndex} HIT`]:[]),...fx.tags].join(' ');tags.className='fx-tags';const number=document.createElement('strong');number.textContent=fx.value;number.className='fx-value';popup.append(tags,number);this.effects.append(popup);
  });
  this.get('.battle-notification').textContent=notices.slice(0,2).join(' / ');
  this.get('.battle-art').classList.toggle('ultimate-cast',!!event.ultimate);this.get('.ultimate-banner').textContent=event.ultimate?`★ ${skills[event.command].name}`:'';
 }
 clearEffects(){this.effects.replaceChildren();this.get('.battle-notification').textContent='';this.get('.ultimate-banner').textContent='';this.get('.battle-art').classList.remove('ultimate-cast')}
 dispose(){if(this.dialog.open)this.dialog.close();this.host.closest('.shell')?.classList.remove('battle-mode');this.host.className='';this.effects.replaceChildren()}
}
