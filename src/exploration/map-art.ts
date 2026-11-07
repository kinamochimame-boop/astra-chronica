import type Phaser from 'phaser';
import type {WalkMap} from './types';
const palettes:Record<string,{floor:number[];wall:number;water:number}>={
 gearRail:{floor:[0x394b55,0x394b55],wall:0x263046,water:0x34576e}, gearStation:{floor:[0x4d5662,0x4d5662],wall:0x263046,water:0x34576e}, gearCity:{floor:[0x555563,0x555563],wall:0x263046,water:0x34576e}, gearMarket:{floor:[0x655e4b,0x655e4b],wall:0x263046,water:0x34576e}, gearLower:{floor:[0x2b3447,0x2b3447],wall:0x263046,water:0x34576e}, gearWorkshop:{floor:[0x4e514d,0x4e514d],wall:0x263046,water:0x34576e}, gearObservatory:{floor:[0x3c4b67,0x3c4b67],wall:0x263046,water:0x34576e}, gearCore:{floor:[0x303c5b,0x303c5b],wall:0x263046,water:0x34576e},
 gloomRoad:{floor:[0x263c34,0x2b453a],wall:0x122b24,water:0x214653},gloomVillage:{floor:[0x415543,0x4b604b],wall:0x293b30,water:0x36585b},gloomWoods:{floor:[0x182e28,0x1d3931],wall:0x0d211c,water:0x203e4b},gloomLake:{floor:[0x2b4841,0x34544c],wall:0x18362d,water:0x254f6a},gloomRoots:{floor:[0x3f3c2f,0x494536],wall:0x272d23,water:0x2d4a3f},gloomShrine:{floor:[0x2b4140,0x34504b],wall:0x506354,water:0x284c50},gloomArchive:{floor:[0x3c4436,0x46513d],wall:0x28362a,water:0x36534b},gloomCore:{floor:[0x283b31,0x304b3d],wall:0x647255,water:0x375c48},
 paleRoad:{floor:[0x8c969f,0x98a1aa],wall:0x546273,water:0x42576c},paleVillage:{floor:[0x7b858a,0x879298],wall:0x4c5d6c,water:0x526a77},paleField:{floor:[0x9ba6b3,0xa7b2bd],wall:0x687381,water:0x52687d},paleStones:{floor:[0x7e8a9b,0x8c97a9],wall:0x566176,water:0x4e637b},paleRavine:{floor:[0x616e83,0x6c7a90],wall:0x303d58,water:0x354969},paleSanctuary:{floor:[0x434f68,0x505f78],wall:0x71829a,water:0x354761},paleArchive:{floor:[0x5e616e,0x696d7c],wall:0x443d58,water:0x4c5a77},paleCore:{floor:[0x444e6a,0x505f7b],wall:0x8693b2,water:0x4d5d8b},
 coast:{floor:[0x655e4e,0x706958],wall:0x485f69,water:0x28718a},seaside:{floor:[0x6b7375,0x737c7c],wall:0x445668,water:0x28788e},harbor:{floor:[0x655d4a,0x71664f],wall:0x3b5365,water:0x236b89},beach:{floor:[0x978c65,0xa49770],wall:0x596c74,water:0x24768b},observatory:{floor:[0x465867,0x526374],wall:0x243f57,water:0x286f88},seacave:{floor:[0x273c4a,0x304856],wall:0x162e40,water:0x215976},undersea:{floor:[0x35545e,0x3d6166],wall:0x274450,water:0x174e6c},tidecore:{floor:[0x2e4853,0x38565c],wall:0x4d6473,water:0x235273},
 sky:{floor:[0x3b5667,0x405f71],wall:0x293e59,water:0x91b9d0},
 village:{floor:[0x425440,0x4b5b42],wall:0x493c2b,water:0x24494b},garden:{floor:[0x263f44,0x2d4b49],wall:0x2f5345,water:0x274e69},town:{floor:[0x546878,0x617080],wall:0x304f69,water:0x8bb4d0},tower:{floor:[0x2a405c,0x31496b],wall:0x152b4a,water:0x54769c},
 cave:{floor:[0x182939,0x1d3042],wall:0x303746,water:0x152c48},path:{floor:[0x223847,0x294452],wall:0x142735,water:0x205363},city:{floor:[0x3e4855,0x46505d],wall:0x273241,water:0x1f405b},market:{floor:[0x4d4540,0x574c44],wall:0x3c3040,water:0x264e61},waterway:{floor:[0x36495a,0x3d5364],wall:0x233348,water:0x1d5f82},mine:{floor:[0x3b3547,0x473d50],wall:0x5a4b66,water:0x284958},archive:{floor:[0x28353e,0x30414a],wall:0x503d38,water:0x243e50},core:{floor:[0x29343e,0x323d48],wall:0x465364,water:0x663d4c},
};
/** Decorative structures sit on their declared blocked tiles; small lamps/flowers are floor markings. */
export function drawTerrain(scene:Phaser.Scene,map:WalkMap){
 const fallback={floor:map.kind==='dungeon'?[0x263d3a,0x2c4440]:[0x234934,0x294f38],wall:0x102c25,water:0x28596b},p=palettes[map.theme??'']??fallback,g=scene.add.graphics(),t=map.tile;
 for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
  const v=map.grid[y][x],px=x*t,py=y*t;g.fillStyle(v==='~'?p.water:v==='#'?p.wall:p.floor[(x+y)%2]);g.fillRect(px,py,t,t);
  if(v==='#'){g.lineStyle(1,map.theme?0x8192a4:0x547e57,.5);g.strokeRect(px+3,py+3,t-6,t-6);if(!map.theme&&map.kind!=='dungeon'){g.fillStyle(0x346344);g.fillCircle(px+16,py+13,12)}if(map.theme==='archive'){for(let i=0;i<4;i++){g.fillStyle([0x967a65,0x6e949d,0x9e9b6b,0x8a768f][i]);g.fillRect(px+5+i*6,py+8,4,17)}}}
  if(v==='~'&&map.theme==='waterway'){g.lineStyle(1,0x88bbd2,.4);g.lineBetween(px+3,py+9,px+24,py+9);g.lineBetween(px+9,py+22,px+29,py+22)}
  if(v==='.'&&(map.theme==='path'||map.theme==='core')){g.lineStyle(1,map.theme==='core'?0x74ccd7:0x6cb3c9,.2);g.lineBetween(px,py+16,px+t,py+16)}
 }
 for(const d of map.decorations??[]){const w=d.w??34,h=d.h??42,x=d.x,y=d.y;
  if(d.kind==='building'){g.fillStyle(map.theme==='market'?0x9b785b:0x617789);g.fillRoundedRect(x-w/2,y-h/2,w,h,6);g.fillStyle(0x243b4b);g.fillTriangle(x-w/2-6,y-h/2+7,x+w/2+6,y-h/2+7,x,y-h/2-20);g.fillStyle(0xd4c486);g.fillRect(x-9,y-8,18,23)}
  else if(d.kind==='lamp'){g.lineStyle(3,0x9f987e);g.lineBetween(x,y+12,x,y-15);g.fillStyle(0xcbe7c8,.2);g.fillCircle(x,y-17,17);g.fillStyle(0xd9e9a6);g.fillCircle(x,y-17,6)}
  else if(d.kind==='crystal'||d.kind==='ore'){g.fillStyle(d.kind==='ore'?0xb3a1bd:0x7ec7dd);g.fillTriangle(x-13,y,x,y-33,x+12,y);g.fillTriangle(x-13,y,x+12,y,x,y+13);g.lineStyle(1,0xe1e0e8,.7);g.lineBetween(x,y-33,x,y+13)}
  else if(d.kind==='machine'){g.fillStyle(0x536578);g.fillRoundedRect(x-w/2,y-h/2,w,h,8);g.lineStyle(3,0x92d2dc);g.strokeCircle(x,y,Math.min(w,h)*.3);g.fillStyle(0xcdebd2);g.fillCircle(x,y,7);g.lineStyle(1,0xb5bb94,.6);g.strokeRect(x-w/2+6,y-h/2+6,w-12,h-12)}
  else if(d.kind==='bridge'){g.lineStyle(3,0xb1a17d);for(let dy=-h/2;dy<=h/2;dy+=12)g.lineBetween(x-w/2,y+dy,x+w/2,y+dy)}
  else if(d.kind==='flowers'){for(let i=0;i<8;i++){g.fillStyle(i%2?0xd4b6da:0xb7d8a0);g.fillCircle(x+(i%4)*12-18,y+Math.floor(i/4)*12-6,3)}}
 }
}
