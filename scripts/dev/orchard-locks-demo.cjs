const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const D=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]],key=p=>p.join(','),eq=(a,b)=>key(a)===key(b);
const distance=(a,b)=>Math.max(Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1]),Math.abs(a[0]+a[1]-b[0]-b[1]));
const terminal=[3,3],bell=[9,4],tree=[9,3];
const cuts=new Set(['0,0','0,1','0,7','10,0','10,6','10,7']);
const hedges=new Set(['3,5','4,5','7,5','8,0']);
const board=[];
for(let q=0;q<=10;q++)for(let r=0;r<=7;r++)if(!cuts.has(key([q,r])))board.push({q,r,kind:hedges.has(key([q,r]))?'hedge':q===5&&!([1,3,6].includes(r))?'water':q===5&&r===3?'bridge':'ground'});
const terrain=Object.fromEntries(board.map(h=>[key([h.q,h.r]),h.kind]));
const solution=[1,3,4,2,4,2,1,3,2,4,3,1,3,1,2,4];
const cages=[{id:'A',cells:[1,5],sum:5},{id:'B',cells:[2,3],sum:6},{id:'C',cells:[4,8],sum:6},{id:'D',cells:[6,10],sum:4},{id:'E',cells:[9,13],sum:5},{id:'F',cells:[11,14],sum:3}];
const perm=a=>a.length?a.flatMap((v,i)=>perm(a.filter((_,j)=>j!==i)).map(p=>[v,...p])):[[]];
function solve(){const rows=perm([1,2,3,4]),answers=[];for(const a of rows)for(const b of rows){if(a[0]!==1||new Set([...a.slice(0,2),...b.slice(0,2)]).size!==4||a.some((v,i)=>v===b[i]))continue;for(const c of rows){if(c.some((v,i)=>v===a[i]||v===b[i]))continue;for(const d of rows){if(d[3]!==4||d.some((v,i)=>v===a[i]||v===b[i]||v===c[i])||new Set([...c.slice(0,2),...d.slice(0,2)]).size!==4)continue;const g=[...a,...b,...c,...d];if(cages.every(c=>c.cells.reduce((n,i)=>n+g[i],0)===c.sum))answers.push(g);}}}return answers;}
assert.deepEqual(solve(),[solution]);
const outputs={shelter:{row:0,load:2},bridge:{row:1,load:3},roots:{row:2,load:4},storm:{row:3,load:5}};
function fresh(){return {round:1,orchard:10,rung:false,won:false,powers:[],entered:{},challenge:false,
heroes:{cornix:{pos:[2,3],hp:13,max:13,move:5,stats:[6,2,6,3,4],power:6,used:[],acted:false,moved:false},kernel:{pos:[2,4],hp:13,max:13,move:4,stats:[6,7,3,3,2],power:7,used:[],acted:false,moved:false},beeswax:{pos:[2,2],hp:16,max:16,move:6,stats:[2,2,4,6,7],power:6,used:[],acted:false,moved:false}},
enemies:{captain:{pos:[8,3],hp:24,armour:3,move:2},archer:{pos:[8,1],hp:6,armour:0,move:0},sapper:{pos:[6,1],hp:6,armour:0,move:2}}};}
function walkable(s,p){const t=terrain[key(p)];return !!t&&!['hedge','water'].includes(t)&&(t!=='bridge'||s.powers.includes('bridge'))&&!eq(p,tree);}
function occupied(s,p,ignore){return [...Object.entries(s.heroes),...Object.entries(s.enemies)].some(([id,u])=>id!==ignore&&u.hp>0&&eq(u.pos,p));}
function route(s,start,dest,ignore){const queue=[[start]],seen=new Set([key(start)]);while(queue.length){const p=queue.shift(),v=p.at(-1);if(eq(v,dest))return p.slice(1);for(const d of D){const n=[v[0]+d[0],v[1]+d[1]];if(seen.has(key(n))||!walkable(s,n)||occupied(s,n,ignore))continue;seen.add(key(n));queue.push([...p,n]);}}return null;}
function sight(a,b){const n=distance(a,b);for(let i=1;i<n;i++){const f=i/n,q=a[0]+(b[0]-a[0])*f,r=a[1]+(b[1]-a[1])*f;let x=Math.round(q),z=Math.round(r),y=Math.round(-q-r);const dx=Math.abs(x-q),dz=Math.abs(z-r),dy=Math.abs(y+q+r);if(dx>dy&&dx>dz)x=-y-z;else if(dz>dy)z=-x-y;const p=[x,z];if(hedges.has(key(p))||eq(p,tree))return false;}return true;}
function move(s,id,dest){const h=s.heroes[id];assert(!h.moved&&!h.acted&&h.hp>0);const p=route(s,h.pos,dest,id);assert(p&&p.length<=h.move,`${id} cannot reach ${dest}: ${p?.length}`);h.pos=[...dest];h.moved=true;return p;}
function win(s){s.won=s.orchard>0&&s.enemies.captain.hp===0&&s.rung;}
function action(s,id,card,fn){const h=s.heroes[id];assert(!h.acted&&h.hp>0&&!s.won);if(card){assert(!h.used.includes(card));h.used.push(card);}fn(h);h.acted=true;win(s);}
function activate(s,id,names,multi=false){action(s,id,multi?'Crosswire':null,h=>{assert(distance(h.pos,terminal)<=1);assert(names.length<=2);if(multi)assert(names.reduce((n,k)=>n+outputs[k].load,0)<=h.stats[1]);else assert(names.filter(k=>!s.powers.includes(k)).length<=1);for(const n of names){assert(outputs[n]);s.entered[outputs[n].row]=solution.slice(outputs[n].row*4,outputs[n].row*4+4);}if(s.powers.includes('bridge')&&!names.includes('bridge'))assert(!occupied(s,[5,3]));s.powers=[...names];});}
function hit(s,id,target,card=null,boost=false){action(s,id,card,h=>{const e=s.enemies[target],range=card==='Thorn Dart'||card==='Angle Shot'?3:1;assert(e.hp>0&&distance(h.pos,e.pos)<=range&&sight(h.pos,e.pos),`${id} cannot hit ${target}`);const raw=h.power+(boost?6:0);e.hp=Math.max(0,e.hp-Math.max(0,raw-e.armour));});}
function challenge(s){action(s,'cornix','Stand Firm',h=>{assert(h.stats[2]>=6&&distance(h.pos,s.enemies.captain.pos)<=3);s.challenge=true;});}
function hurt(s,id,amount){const h=s.heroes[id];const shelter=s.powers.includes('shelter')&&h.pos[0]>=6&&h.pos[0]<=9&&h.pos[1]>=2&&h.pos[1]<=4?2:0;h.hp=Math.max(0,h.hp-Math.max(0,amount-shelter));}
function end(s){
  assert(!s.won);const events=[];
  if(s.powers.includes('roots')){s.enemies.captain.hp=Math.max(0,s.enemies.captain.hp-2);events.push('Roots deal 2 and stop the captain moving.');}
  if(s.powers.includes('storm')){s.enemies.captain.hp=Math.max(0,s.enemies.captain.hp-6);s.orchard=Math.max(0,s.orchard-3);events.push('Storm deals 6; orchard loses 3 integrity.');}
  assert(s.orchard>0);win(s);if(s.won)return events;
  const cap=s.enemies.captain;
  if(cap.hp>0){
    if(!s.powers.includes('roots')){for(let step=0;step<cap.move;step++){if(Object.values(s.heroes).some(h=>h.hp>0&&distance(cap.pos,h.pos)===1))break;let best=null;for(const [id,h] of Object.entries(s.heroes).filter(([,h])=>h.hp>0))for(const d of D){const dest=[h.pos[0]+d[0],h.pos[1]+d[1]];if(!walkable(s,dest)||occupied(s,dest,'captain'))continue;const p=route(s,cap.pos,dest,'captain');if(p&&p.length&&(!best||p.length<best.length))best=p;}if(!best)break;cap.pos=best[0];}}
    const adjacent=Object.entries(s.heroes).filter(([,h])=>h.hp>0&&distance(cap.pos,h.pos)===1).sort((a,b)=>a[1].hp-b[1].hp||a[0].localeCompare(b[0]));
    const raw=adjacent.length?5:3,target=s.challenge?'cornix':adjacent[0]?.[0];
    if(target){hurt(s,target,raw-(s.challenge?s.heroes.cornix.stats[1]:0));events.push(`Captain attacks ${target}.`);}else{s.orchard=Math.max(0,s.orchard-3);events.push('Captain scatters thorns: orchard loses 3.');}
  }
  const arch=s.enemies.archer;
  if(arch.hp>0){const candidates=Object.entries(s.heroes).filter(([,h])=>h.hp>0&&distance(arch.pos,h.pos)<=4&&sight(arch.pos,h.pos)).sort((a,b)=>(a[1].pos[1]<=1?0:1)-(b[1].pos[1]<=1?0:1)||distance(arch.pos,a[1].pos)-distance(arch.pos,b[1].pos)||a[0].localeCompare(b[0]));if(candidates.length){hurt(s,candidates[0][0],3);events.push(`Archer shoots ${candidates[0][0]}.`);}}
  const sap=s.enemies.sapper;
  if(sap.hp>0){const block=Object.entries(s.heroes).find(([,h])=>h.hp>0&&distance(h.pos,sap.pos)===1);if(block){hurt(s,block[0],3);events.push('Sapper strikes the blocking hero.');}else{if(distance(sap.pos,terminal)>1){const targets=[terminal,...D.map(d=>[terminal[0]+d[0],terminal[1]+d[1]])];const paths=targets.filter(p=>walkable(s,p)&&!occupied(s,p,'sapper')).map(p=>route(s,sap.pos,p,'sapper')).filter(Boolean).sort((a,b)=>a.length-b.length);const p=paths[0];if(p?.length)sap.pos=p[Math.min(sap.move,p.length)-1];}if(distance(sap.pos,terminal)<=1){const priority=['storm','roots','bridge','shelter'];const shut=priority.find(k=>s.powers.includes(k));if(shut&&!(shut==='bridge'&&occupied(s,[5,3])))s.powers=s.powers.filter(k=>k!==shut);events.push(`Sapper disables ${shut||'nothing'}.`);}}}
  assert(s.orchard>0&&Object.values(s.heroes).some(h=>h.hp>0));assert(s.round<4);s.round++;s.challenge=false;Object.values(s.heroes).forEach(h=>{h.acted=false;h.moved=false;});return events;
}
function simulate(control=false){const s=fresh(),frames=[];const snap=(label,detail,trail=[])=>frames.push({label,detail,trail,state:structuredClone(s)});
  snap('Choose what to power','Two circuits can run. Bridge and shelter, or bridge and trapping roots?');
  const kpath=move(s,'kernel',terminal);activate(s,'kernel',control?['bridge','roots']:['bridge','shelter'],true);snap('Round 1 · Kernel',control?'Solve rows 2 and 3: bridge opens and roots trap the captain.':'Solve rows 1 and 2: bridge opens and the courtyard gains shelter.',kpath);
  const bpath=move(s,'beeswax',[5,1]);hit(s,'beeswax','sapper','Thorn Dart');snap('Round 1 · Beeswax','Take the north crossing and defeat the sapper before it can cut a circuit.',bpath);
  const cpath=move(s,'cornix',[6,3]);challenge(s);snap('Round 1 · Cornix','Cross the new bridge and challenge the captain: Logic 6 meets Resolve 6.',cpath);
  let events=end(s);snap('First enemy response',events.join(' '));
  if(control){
    activate(s,'kernel',['roots','storm']);snap('Round 2 · Kernel','Solve row 4. Replace the bridge with storm: the return shortcut closes.');
    const p=move(s,'cornix',[7,3]);hit(s,'cornix','captain','Reckoned Blow',true);snap('Round 2 · Cornix','Move into reach. The maths-powered blow deals 12 − 3 armour = 9.',p);
    const b=move(s,'beeswax',[7,1]);hit(s,'beeswax','archer');snap('Round 2 · Beeswax','Close on the archer; a basic Science strike defeats it.',b);
    events=end(s);snap('Second enemy response',events.join(' '));
    hit(s,'cornix','captain');snap('Round 3 · Cornix','Strike for 3 after armour; the captain has 2 health left.');
    const bellPath=move(s,'beeswax',bell);action(s,'beeswax',null,()=>{assert(eq(s.heroes.beeswax.pos,bell));s.rung=true;});snap('Round 3 · Beeswax','Reach the eastern bell and ring it; hold until the captain falls.',bellPath);
    events=end(s);snap('Victory · three rounds',events.join(' '));
  }else{
    hit(s,'cornix','captain','Reckoned Blow',true);snap('Round 2 · Cornix','A two-step fraction challenge powers a 9-damage blow after armour.');
    const p=move(s,'kernel',[4,3]);hit(s,'kernel','captain','Angle Shot');snap('Round 2 · Kernel','Leave the controls and fire across the river: Geometry 7 − armour 3 = 4.',p);
    const b=move(s,'beeswax',[7,1]);hit(s,'beeswax','archer');snap('Round 2 · Beeswax','Flank the archer and defeat it with a basic Science strike.',b);
    events=end(s);snap('Second enemy response',events.join(' '));
    hit(s,'cornix','captain');snap('Round 3 · Cornix','Keep the captain occupied with another 3 damage.');
    const kp=move(s,'kernel',[7,2]);hit(s,'kernel','captain');snap('Round 3 · Kernel','Cross the bridge and join the melee: another 4 damage.',kp);
    const bp=move(s,'beeswax',[8,2]);hit(s,'beeswax','captain');snap('Round 3 · Beeswax','Come down from the northern flank: the captain is left on 1 health.',bp);
    events=end(s);snap('Third enemy response',events.join(' '));
    hit(s,'cornix','captain');snap('Round 4 · Cornix','Defeat the captain without firing the orchard-damaging storm.');
    const bp2=move(s,'beeswax',bell);action(s,'beeswax',null,()=>{assert(eq(s.heroes.beeswax.pos,bell));s.rung=true;});snap('Victory · four rounds','Ring the eastern bell. All ten orchard integrity remains.',bp2);
  }
  assert(s.won);return frames;
}
const assault=simulate(),control=simulate(true);
assert.equal(assault.at(-1).state.orchard,10);assert.equal(control.at(-1).state.orchard,4);
assert.equal(assault.at(-1).state.round,4);assert.equal(control.at(-1).state.round,3);
assert.equal(board.filter(h=>!['water','hedge'].includes(h.kind)).length-1,72);
const proof=fresh();assert.equal(route(proof,[4,3],[6,3],'cornix').length,7);proof.powers=['bridge'];assert.equal(route(proof,[4,3],[6,3],'cornix').length,2);
const weaker=fresh();weaker.heroes.kernel.pos=[3,3];weaker.heroes.kernel.stats[1]=4;assert.throws(()=>activate(weaker,'kernel',['bridge','shelter'],true));
const sapperTest=fresh();sapperTest.powers=['bridge','roots'];sapperTest.enemies.sapper.pos=[4,3];end(sapperTest);assert.deepEqual(sapperTest.powers,['bridge']);
const heldBridge=fresh();heldBridge.heroes.kernel.pos=[3,3];heldBridge.heroes.cornix.pos=[5,3];heldBridge.powers=['bridge','roots'];assert.throws(()=>activate(heldBridge,'kernel',['roots','storm']));
const data={board,solution,cages,runs:{assault,control},outputs};
if(process.argv[2])fs.writeFileSync(path.resolve(process.argv[2]),fs.readFileSync(path.join(__dirname,'orchard-locks-visual.template.html'),'utf8').replace('__LOCKS_DATA__',JSON.stringify(data)));
console.log(JSON.stringify({boardHexes:board.length,walkableWhenOpen:72,uniquePuzzleSolutions:solve().length,bridgeJourney:{closed:7,open:2},assault:assault.at(-1).state,control:control.at(-1).state},null,2));
module.exports={data,simulate,solve};
