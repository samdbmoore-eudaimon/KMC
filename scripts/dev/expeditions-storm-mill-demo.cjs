const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const DIRECTIONS = [[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
const distance = (a,b) => Math.max(Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1]),Math.abs(a[0]+a[1]-b[0]-b[1]));
const same = (a,b) => a[0] === b[0] && a[1] === b[1];
const tiles = { A:{pos:[0,0],base:[0,3],resistance:2}, B:{pos:[1,0],base:[0,2],resistance:3}, C:{pos:[1,1],base:[0,2],resistance:4} };
const hedges = [[0,2],[0,-2]];
const mill = [2,1];
const ports = (key,orientation) => tiles[key].base.map(p=>(p+orientation)%6);
function connected(s) {
  const p = Object.fromEntries(Object.keys(tiles).map(k=>[k,ports(k,s.orientation[k])]));
  return s.sluice && p.A.includes(3) && p.A.includes(0) && p.B.includes(3) && p.B.includes(1) && p.C.includes(4) && p.C.includes(0);
}
function fresh() {
  return {round:1,sluice:false,orientation:{A:2,B:0,C:1},mill:8,won:false,challenge:false,lastOperator:'kernel',
    heroes:{cornix:{pos:[-1,2],hp:9,max:9,stats:[6,2,6,3,4],move:3,used:[],acted:false,moved:false},kernel:{pos:[-1,1],hp:9,max:9,stats:[6,7,3,3,2],move:2,used:[],acted:false,moved:false},beeswax:{pos:[-2,1],hp:12,max:12,stats:[2,2,4,6,7],move:4,used:[],acted:false,moved:false}},
    enemies:{warden:{pos:[2,0],hp:18,resolve:6},rootling:{pos:[0,-1],hp:6,resolve:3}}};
}
function checkWin(s) {s.won=connected(s)&&Object.values(s.enemies).every(e=>e.hp===0);}
function sight(a,b) {
  const n=distance(a,b);
  const cubeRound = (q,r) => {let x=Math.round(q),z=Math.round(r),y=Math.round(-q-r);const dx=Math.abs(x-q),dz=Math.abs(z-r),dy=Math.abs(y+q+r);if(dx>dy&&dx>dz)x=-y-z;else if(dz>dy)z=-x-y;return [x,z];};
  for(let i=1;i<n;i++){const t=i/n,p=cubeRound(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t);if(hedges.some(h=>same(h,p))||same(mill,p))return false;}
  return true;
}
function act(s,id,card,run) {
  const h=s.heroes[id]; assert(h.hp>0&&!h.acted&&!s.won);
  if(card){assert(!h.used.includes(card));h.used.push(card);}
  run(h);h.acted=true;checkWin(s);
}
function move(s,id,route) {
  const h=s.heroes[id];assert(!h.moved&&!h.acted&&h.hp>0&&route.length<=h.move);
  for(const p of route){assert.equal(distance(h.pos,p),1);assert(distance([0,0],p)<=3);assert(!hedges.some(x=>same(x,p))&&!same(mill,p));assert(!Object.entries(s.heroes).some(([k,v])=>k!==id&&v.hp>0&&same(v.pos,p)));assert(!Object.values(s.enemies).some(v=>v.hp>0&&same(v.pos,p)));h.pos=p;}
  h.moved=true;
}
function turn(s,id,settings,multi=false) {
  act(s,id,multi?'Turn Together':null,h=>{
    const keys=Object.keys(settings);if(!multi)assert.equal(keys.length,1);
    assert(keys.reduce((n,k)=>n+tiles[k].resistance,0)<= (multi?h.stats[1]:Infinity));
    for(const k of keys){assert(distance(h.pos,tiles[k].pos)<=(multi?2:1));assert(k!=='C'||s.sluice);assert(Number.isInteger(settings[k])&&settings[k]>=0&&settings[k]<6);s.orientation[k]=settings[k];}
    s.lastOperator=id;
  });
}
function hit(s,id,target,card=null,boost=false) {
  act(s,id,card,h=>{const e=s.enemies[target],r=card==='Thorn Dart'?3:1;assert(e.hp>0&&distance(h.pos,e.pos)<=r&&sight(h.pos,e.pos));const raw=(card==='Thorn Dart'?h.stats[3]:h.stats[0])+(boost?6:0);const armour=target==='warden'&&!connected(s)?2:0;e.hp=Math.max(0,e.hp-Math.max(0,raw-armour));});
}
function end(s) {
  assert(!s.won);
  if(connected(s))s.enemies.warden.hp=Math.max(0,s.enemies.warden.hp-4);
  checkWin(s);if(s.won)return;
  if(s.enemies.warden.hp>0){
    let target=s.challenge?'cornix':null;
    if(!target&&s.round%2===0)target=Object.entries(s.heroes).filter(([,h])=>h.hp>0&&distance(h.pos,s.enemies.warden.pos)===1).sort((a,b)=>a[1].hp-b[1].hp||a[0].localeCompare(b[0]))[0]?.[0];
    if(target)s.heroes[target].hp=Math.max(0,s.heroes[target].hp-6+(s.challenge?s.heroes[target].stats[1]:0));else s.mill=Math.max(0,s.mill-6);
  }
  if(s.enemies.rootling.hp>0){const h=s.heroes[s.lastOperator];if(h.hp>0&&distance(h.pos,s.enemies.rootling.pos)<=3&&sight(h.pos,s.enemies.rootling.pos))h.hp=Math.max(0,h.hp-4);else s.mill=Math.max(0,s.mill-4);}
  assert(s.mill>0&&Object.values(s.heroes).some(h=>h.hp>0));assert(s.round<4);
  s.round++;s.challenge=false;Object.values(s.heroes).forEach(h=>{h.acted=false;h.moved=false;});
}
function simulate(fast=false,boost=true) {
  const s=fresh(),frames=[];
  const record=(label,detail)=>frames.push({label,detail,state:structuredClone(s),live:connected(s)});
  record('Opening board','Open the sluice, connect A–B–C and defeat both creatures.');
  move(s,'beeswax',[[-1,0],[0,0],[1,-1],[2,-2]]);act(s,'beeswax',null,h=>{assert(same(h.pos,[2,-2]));s.sluice=true;});
  record('Round 1 · Beeswax','Speed 7 gives four movement: reach the sluice and unlock C.');
  move(s,'cornix',[[0,1],[1,0]]);
  if(fast)hit(s,'cornix','warden');else act(s,'cornix','Stand Firm',h=>{assert(distance(h.pos,s.enemies.warden.pos)<=2);assert(h.stats[2]>=s.enemies.warden.resolve);s.challenge=true;});
  record('Round 1 · Cornix',fast?'Strike for 4; accept the volley against the mill.':'Logic 6 diverts the volley; Geometry 2 will absorb two damage.');
  move(s,'kernel',[[0,1]]);turn(s,'kernel',{A:0,B:1},true);
  record('Round 1 · Kernel','Turn A and B together: resistance 2 + 3 fits Geometry 7.');
  end(s);record('First enemy phase',fast?'Mill falls to 2 integrity; Kernel falls to 5 health.':'Cornix and Kernel fall to 5 health; the mill stays unharmed.');
  if(fast){
    turn(s,'kernel',{C:4});record('Round 2 · Kernel','Connect C first: live water immediately removes the Warden’s armour.');
    hit(s,'cornix','warden','Reckoned Blow',boost);record('Round 2 · Cornix',boost?'Solve the spark challenge: 6 + 6 = 12 damage.':'Ordinary blow: 6 damage, without the optional boost.');
    hit(s,'beeswax','rootling','Thorn Dart');record('Round 2 · Beeswax','Science 6 defeats Rootling with one Thorn Dart.');
    end(s);record(s.won?'Victory · two rounds':'Second enemy phase',s.won?'The mill pulse defeats Warden before its next attack.':'Warden survives on 4 and rakes Cornix down to 3.');
    if(!s.won){hit(s,'cornix','warden');record('Victory · three rounds','An ordinary Strike finishes Warden; the unboosted plan remains recoverable.');}
  }else{
    act(s,'beeswax','Shared Remedy',h=>{const allocation={cornix:4,kernel:2};assert(Object.values(allocation).reduce((a,b)=>a+b,0)<=h.stats[3]);for(const [id,n] of Object.entries(allocation)){const v=s.heroes[id];assert(distance(h.pos,v.pos)<=3&&sight(h.pos,v.pos)&&v.hp+n<=v.max);v.hp+=n;}});
    record('Round 2 · Beeswax','Share six healing: four for Cornix, two for Kernel.');
    hit(s,'cornix','warden','Reckoned Blow',true);record('Round 2 · Cornix','Spark answer 6: 6 + 6 − 2 armour = 10 damage.');
    turn(s,'kernel',{C:4});record('Round 2 · Kernel','Turn C north-west to east: water reaches the mill.');
    end(s);record('Second enemy phase','Mill deals 4; both enemies attack. Cornix and Kernel each have 3 health.');
    hit(s,'beeswax','rootling','Thorn Dart');record('Round 3 · Beeswax','Thorn Dart defeats Rootling: Science 6 against 6 health.');
    hit(s,'cornix','warden');record('Victory · three rounds','Cornix’s ordinary Strike finishes Warden. Water flows; mill integrity is 8.');
  }
  assert(s.won);return frames;
}
const safe=simulate(),fast=simulate(true),recovery=simulate(true,false);
assert.equal(safe.at(-1).state.round,3);assert.equal(safe.at(-1).state.mill,8);
assert.equal(fast.at(-1).state.round,2);assert.equal(fast.at(-1).state.mill,2);
assert.equal(recovery.at(-1).state.round,3);
const solutions=[];
for(let a=0;a<6;a++)for(let b=0;b<6;b++)for(let c=0;c<6;c++){const s=fresh();s.sluice=true;s.orientation={A:a,B:b,C:c};if(connected(s))solutions.push([a,b,c]);}
assert.deepEqual(solutions,[[0,1,4],[3,1,4]]);
assert.equal(12*3/4-(12*3/4)/3,6);
const data={safe,fast};
if(process.argv[2]){
  const output=path.resolve(process.argv[2]);const template=path.resolve(__dirname,'storm-mill-visual.template.html');
  fs.writeFileSync(output,fs.readFileSync(template,'utf8').replace('__DEMO_DATA__',JSON.stringify(data)));
}
console.log('Verified: cautious win in round 3; fast win in round 2; unboosted recovery in round 3; movement, ranges, sightlines, action budgets, card expenditure, healing and both valid puzzle orientations.');
module.exports={simulate,connected};
