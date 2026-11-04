export interface Unit {id:string; name:string; role:string; weapons:string[]; maxHp:number; hp:number; attack:number; color:number; texture?:string}
export const heroes:Unit[]=[
{id:'astel',name:'アステル',role:'戦士',weapons:['剣','弓','双剣'],maxHp:120,hp:120,attack:32,color:0x71b9ff},
{id:'rina',name:'リナ',role:'タンク',weapons:['盾＆槍','盾＆フレイル','盾＆突剣'],maxHp:180,hp:180,attack:22,color:0xe1b86c},
{id:'mei',name:'メイ',role:'魔法攻撃',weapons:['ワンド','ロッド','メイス'],maxHp:90,hp:90,attack:42,color:0xc6a1ee}];
export class Battle {
 allies=heroes.map(h=>({...h}));
 enemies:Unit[]=['星喰いの影','霧の番人','夜の使い'].map((name,i)=>({id:`enemy${i}`,name,role:'魔物',weapons:[],maxHp:80+i*10,hp:80+i*10,attack:14+i*3,color:0x7c83b8}));
 used=new Set<number>(); round=1;
 get result(): 'victory'|'defeat'|null {return this.enemies.every(e=>e.hp===0)?'victory':this.allies.every(a=>a.hp===0)?'defeat':null}
 attack(actor:number,target:number):string[] {
 const a=this.allies[actor],e=this.enemies[target];
 if(this.result||!a||!e||a.hp===0||e.hp===0||this.used.has(actor))return [];
 this.used.add(actor);e.hp=Math.max(0,e.hp-a.attack);
 const log=[`${a.name}の攻撃！ ${e.name}に${a.attack}ダメージ。`];
 if(e.hp===0)log.push(`${e.name}を撃破！`);
 return log;
 }
 get turnComplete(){return this.allies.every((a,i)=>a.hp===0||this.used.has(i))}
 enemyTurn():string[]{
 if(this.result||!this.turnComplete)return [];
 const logs:string[]=[];
 for(const e of this.enemies.filter(e=>e.hp>0)){
 const living=this.allies.filter(a=>a.hp>0);if(!living.length)break;
 const a=living[(this.round-1)%living.length];a.hp=Math.max(0,a.hp-e.attack);
 logs.push(`${e.name}の攻撃。${a.name}に${e.attack}ダメージ。`);
 }this.used.clear();this.round++;return logs;
 }
}
