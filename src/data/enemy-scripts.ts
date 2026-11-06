import type {Element,StatusEffect} from '../types';
/** Data-only profiles consumed by the existing charge/phase AI. Reservations store their power. */
export interface EnemyScript {observer:boolean;alwaysMagic?:boolean;guardOnCharge:boolean;element:Element;normalPower:number;finalNormalPower:number;chargePower:number;finalChargePower:number;spell:string;charge:string;finalCharge:string;statuses:StatusEffect[]}
export const enemyScripts:Record<string,EnemyScript>={
 clockDrone:{observer:false,guardOnCharge:false,element:'light',normalPower:0,finalNormalPower:0,chargePower:65,finalChargePower:65,spell:'時針光',charge:'時針射',finalCharge:'時針射',statuses:[]},
 clockGuard:{observer:false,guardOnCharge:true,element:'water',normalPower:0,finalNormalPower:0,chargePower:86,finalChargePower:86,spell:'霜刻砲',charge:'時環砲',finalCharge:'時環砲',statuses:[]},
 luciel:{observer:true,guardOnCharge:true,element:'light',normalPower:60,finalNormalPower:74,chargePower:88,finalChargePower:110,spell:'暁光術',charge:'時環の警鐘',finalCharge:'暁刻の終鐘',statuses:[{id:'freeze',chance:0.15,turns:2},{id:'silence',chance:0.2,turns:2}]},
 rootOrb:{observer:false,alwaysMagic:true,guardOnCharge:false,element:'earth',normalPower:64,finalNormalPower:64,chargePower:76,finalChargePower:76,spell:'根光術',charge:'根脈砲',finalCharge:'根脈砲',statuses:[]},
 granGuard:{observer:false,guardOnCharge:true,element:'earth',normalPower:0,finalNormalPower:0,chargePower:94,finalChargePower:94,spell:'森護術',charge:'蓄根砲',finalCharge:'蓄根砲',statuses:[]},
 seles:{observer:true,guardOnCharge:true,element:'wind',normalPower:66,finalNormalPower:82,chargePower:98,finalChargePower:124,spell:'星樹風',charge:'記憶の嵐',finalCharge:'星樹の新生',statuses:[{id:'poison',chance:0.2,turns:3},{id:'silence',chance:0.15,turns:2}]},
};
