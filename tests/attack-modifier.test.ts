import {describe,it,expect} from 'vitest';
import {Battle} from '../src/battle';
import {statValue} from '../src/effects';
function damage(b:Battle){const result=b.act('attack','enemy0');expect(result.ok).toBe(true);if(!result.ok)throw Error(result.reason);return result.event.amount}
function nextAstel(b:Battle){for(let n=0;n<12&&b.current?.id!=='astel';n++){if(b.phase==='enemy')b.enemyAct();else b.act('defend')}expect(b.current?.id).toBe('astel')}
describe('attack modifier damage regression',()=>{
 it('holds +25% on Astel and uses effective attack 40 for damage',()=>{const b=new Battle(()=>0.99);b.applyModifier('astel',{stat:'attack',amount:0.25,turns:3});expect(b.allies[0].attack).toBe(32);expect(b.allies[0].modifiers).toEqual([{stat:'attack',amount:0.25,remaining:3}]);expect(statValue(b.allies[0],'attack')).toBe(40);expect(damage(b)).toBe(40);expect(b.enemies[0].hp).toBe(200);expect(b.allies[0].modifiers[0].remaining).toBe(2);nextAstel(b);expect(damage(b)).toBe(40)});
 it('clears held modifiers through the battle API and restores damage 32',()=>{const b=new Battle(()=>0.99);b.applyModifier('astel',{stat:'attack',amount:0.25,turns:3});b.clearModifiers('astel');expect(b.allies[0].modifiers).toEqual([]);expect(statValue(b.allies[0],'attack')).toBe(32);expect(damage(b)).toBe(32)});
 it('stacks to +50% and caps at +75% in actual damage',()=>{const b=new Battle(()=>0.99);for(let i=0;i<2;i++)b.applyModifier('astel',{stat:'attack',amount:0.25,turns:3});expect(damage(b)).toBe(48);nextAstel(b);b.applyModifier('astel',{stat:'attack',amount:0.5,turns:3});expect(b.allies[0].modifiers).toHaveLength(1);expect(damage(b)).toBe(56)});
 it('applies duration-one buff to its final attack before expiring',()=>{const b=new Battle(()=>0.99);b.applyModifier('astel',{stat:'attack',amount:0.25,turns:1});expect(damage(b)).toBe(40);expect(b.allies[0].modifiers).toEqual([]);expect(statValue(b.allies[0],'attack')).toBe(32);nextAstel(b);expect(damage(b)).toBe(32)});
 it('does not transfer enemy buffs to Astel',()=>{const b=new Battle(()=>0.99);b.applyModifier('enemy0',{stat:'attack',amount:0.25,turns:3});expect(statValue(b.enemies[0],'attack')).toBe(22.5);expect(damage(b)).toBe(32)});
});
