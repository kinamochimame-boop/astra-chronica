import type Phaser from 'phaser';
import type {Unit} from './types';
import {weaponById,type WeaponFamily} from './data/weapons';
export type Silhouette='knight'|'mage'|'beast'|'slime'|'wing'|'machine'|'spirit';
export function actorStyle(u:Unit,ally:boolean){
 const family:WeaponFamily=weaponById(u.weaponId)?.family??(u.id==='rina'?'shieldSpear':u.id==='mei'?'wand':'sword');
 const silhouette:Silhouette=ally?(u.id==='mei'?'mage':'knight'):/スライム|ジェリー/.test(u.name)?'slime':/鳥|蛾|ハーピー|コウモリ|バット|使い/.test(u.name)?'wing':/球|機|ドローン|甲冑|兵|歩哨|ガード|番人/.test(u.name)?'machine':/狼|ウルフ|獣|ジャッカル|モール|クラブ|ハンター/.test(u.name)?'beast':'spirit';
 return {family,silhouette,facing:ally?1:-1};
}
/** Texture replacement is isolated here; combat state is never modified by a visual. */
export function drawActor(scene:Phaser.Scene,u:Unit,ally:boolean){
 const c=scene.add.container(0,0),g=scene.add.graphics(),style=actorStyle(u,ally),d=style.facing;c.add(g);
 if(u.texture&&scene.textures.exists(u.texture)){c.add(scene.add.image(0,0,u.texture).setDisplaySize(54,68));return c}
 g.fillStyle(0x06101b,.4);g.fillEllipse(0,27,57,11);
 if(ally){
  g.fillStyle(u.color);if(style.silhouette==='mage'){g.fillTriangle(-22,22,20,22,0,-18);g.fillTriangle(-25,-21,26,-21,1,-49);}else{g.fillRoundedRect(-15,-10,30,32,7);g.fillTriangle(-17,-7,-30,25,-13,15)}
  g.fillStyle(0x253652);g.fillRoundedRect(-16,19,12,12,3);g.fillRoundedRect(4,19,12,12,3);
  g.fillStyle(0xf3d7bd);g.fillCircle(0,-24,17);g.fillStyle(u.color);g.fillEllipse(-2,-36,37,13);g.fillStyle(0x13243b);g.fillCircle(7*d,-25,2.5);
  g.lineStyle(3,0xe5cd91);const x=24*d;
  if(style.family==='bow'){g.strokeEllipse(x,-5,18,47);g.lineBetween(x,-28,x,18);g.lineBetween(x-12*d,-4,x+12*d,-4)}
  else if(style.family==='dualBlades'){for(const z of [-1,1]){g.fillStyle(0xd6f0ff);g.fillTriangle((16+z*6)*d,6,(30+z*6)*d,-24,(25+z*6)*d,9)}}
  else if(style.family==='shieldFlail'){g.lineBetween(x,10,x,-8);g.lineBetween(x,-8,x+12*d,-20);g.fillStyle(0xb7c8d5);g.fillCircle(x+12*d,-22,9)}
  else if(style.family==='shieldSpear'){g.lineBetween(x,23,x,-38);g.fillStyle(0xd5edf7);g.fillTriangle(x-6,-32,x+6,-32,x,-46)}
  else if(['wand','rod','mace'].includes(style.family)){g.lineBetween(x,20,x,style.family==='rod'?-38:-18);g.fillStyle(style.family==='mace'?0xc4c4cd:0xa0e1ee);if(style.family==='mace')g.fillRect(x-8,-28,16,16);else g.fillCircle(x,style.family==='rod'?-40:-22,style.family==='rod'?9:6)}
  else {g.fillStyle(0xd5edf7);g.fillTriangle(x-4,5,x+4,5,x+7*d,-33);g.lineBetween(x-8,8,x+8,8)}
  if(u.id==='rina'){g.fillStyle(0xd8b66a);g.fillRoundedRect(2,-5,21,30,6);g.lineStyle(2,0xffedb6);g.strokeRoundedRect(2,-5,21,30,6)}
 }else{
  g.fillStyle(u.color);switch(style.silhouette){
   case 'slime':g.fillEllipse(0,8,62,40);g.fillCircle(0,-3,20);break;
   case 'wing':g.fillTriangle(-8,8,-43,-26,-30,18);g.fillTriangle(8,8,43,-26,30,18);g.fillEllipse(0,-3,25,40);break;
   case 'beast':g.fillEllipse(0,3,53,31);g.fillTriangle(-28,-3,-15,-33,-3,-9);g.fillTriangle(11,-7,28,-29,24,15);g.fillRect(-19,14,10,17);g.fillRect(13,14,10,17);break;
   case 'machine':g.fillRoundedRect(-24,-24,48,48,5);g.lineStyle(3,0xd3c18a);g.strokeCircle(0,-1,15);g.fillStyle(0x8febec);g.fillCircle(-5,-1,5);g.fillTriangle(-25,-8,-38,14,-22,18);break;
   default:g.fillTriangle(-24,25,24,25,0,-30);g.fillCircle(0,-25,19);g.lineStyle(3,0xd8cbf2);g.strokeEllipse(0,-30,49,17);
  }g.fillStyle(0xffe0c0);g.fillCircle(-9,-5,3);g.fillCircle(6,-5,3);
 }
 return c;
}
