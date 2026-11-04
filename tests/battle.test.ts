import {describe,it,expect} from 'vitest';
import {Battle} from '../src/battle';
import {fresh,load,save} from '../src/save';
describe('battle',()=>{
 it('rejects repeated, dead, and invalid attacks',()=>{const b=new Battle();b.attack(0,0);const hp=b.enemies[0].hp;expect(b.attack(0,0)).toEqual([]);expect(b.enemies[0].hp).toBe(hp);expect(b.attack(99,0)).toEqual([]);b.allies[1].hp=0;expect(b.attack(1,0)).toEqual([])});
 it('completes a full battle with victory and clamps HP',()=>{const b=new Battle();for(let turn=0;turn<30&&!b.result;turn++){for(let i=0;i<3&&!b.result;i++){const target=b.enemies.findIndex(e=>e.hp>0);b.attack(i,target)}b.enemyTurn()}expect(b.result).toBe('victory');expect(b.enemies.every(e=>e.hp===0)).toBe(true);expect(b.attack(0,0)).toEqual([])});
 it('supports defeat, skips defeated enemies and resets actions',()=>{const b=new Battle();b.enemies[0].hp=0;b.allies.forEach(a=>a.hp=1);for(let i=0;i<3;i++)b.attack(i,1);b.enemyTurn();expect(b.used.size).toBe(0);for(let turn=0;turn<10&&!b.result;turn++){b.allies.forEach((a,i)=>{if(a.hp>0)b.used.add(i)});b.enemyTurn()}expect(b.result).toBe('defeat')});
 it('does not allow enemies to act before the party finishes',()=>{const b=new Battle();expect(b.enemyTurn()).toEqual([]);expect(b.allies[0].hp).toBe(120)});
});
describe('save',()=>{
 it('round trips progress',()=>{let value='';const storage={getItem:()=>value,setItem:(_:string,v:string)=>{value=v}};const p={...fresh(),started:true,wins:1,battles:2};expect(save(p,storage)).toBe(true);expect(load(storage)).toEqual(p)});
 it('recovers from corrupt saves and unavailable storage',()=>{expect(load({getItem:()=>'{broken'})).toEqual(fresh());expect(load({getItem:()=>'{"version":1,"started":true,"wins":-1,"battles":0}'})).toEqual(fresh());expect(save(fresh(),{setItem:()=>{throw Error('blocked')}})).toBe(false)})
});
