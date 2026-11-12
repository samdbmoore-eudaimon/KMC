const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname,'../..');
const artRoot = 'assets/expeditions/production/9fo/runtime/';
const missions = [
  ['four-locks','The Orchard of Four Locks','Sudoku with linked sums',['mechanisms/po-hive-ledger-board-v1.png','mechanisms/po-hive-ledger-corruption-v1.png','objectives/po-orchard-lockdown-living-gate-v1.png','enemies/po-hookmole-idle-front-v1.webp']],
  ['turning-ravine','The Turning Ravine','Rotating numbers and operators in coupled equations',['backgrounds/po-nine-across-wind-ravine-v1.png','mechanisms/po-current-turner-hex-v1.png','mechanisms/po-operator-neutral-v1.webp','mechanisms/po-operator-rotate-v1.webp','mechanisms/po-rooststorm-wind-dial-v2.png','enemies/po-crosswind-idle-v1.png']],
  ['unequal-crossing','The Unequal Crossing','Partition and limited weighing',['objectives/po-balance-empty-v1.webp','objectives/po-unequal-crossing-scale-one-hex-v1.png','props/po-load-neutral-v1.webp','objectives/po-unequal-crossing-burrow-v1.png']],
  ['cider-run','The Cider Run','Flow conservation and operations',['backgrounds/po-cider-run-press-lane-v1.png','objectives/po-cider-press-v1.png','objectives/po-cider-apple-basket-v1.png','effects/po-cider-flow-arrow-v2.png','enemies/po-scruffcrow-perch-v1.png']],
  ['rootfire-relay','Rootfire Relay','Parity and budgeted branching networks',['mechanisms/po-rootfire-relay-node-v1.png','objectives/po-rootfire-source-fruit-v1.png','objectives/po-rootfire-bridge-root-link-v1.png','effects/po-rootfire-parity-v1.png','enemies/po-strawling-idle-v1.png']],
  ['hedgejaw-maze','Hedgejaw Maze','Constrained route optimisation',['terrain/po-terrain-hedge-v1.webp','terrain/po-terrain-path-v1.webp','objectives/po-target-locked-v1.webp','enemies/po-hedgejaw-idle-v1.svg']],
  ['moonfall','Murder at Moonfall','Edge-count loops and enclosure',['objectives/po-moonfall-ring-stone-v3.png','mechanisms/po-moonfall-ring-gap-v1.png','effects/po-moonfall-containment-v1.png','enemies/po-crow-swarm-idle-v1.png','enemies/po-crowbreaker-idle-v1.png']],
  ['hollow-bough','The Hollow Bough','Polyhex packing and forecast shelter',['objectives/po-hollow-bough-living-branches-v1.png','objectives/po-hollow-bough-memorial-hex-v1.png','objectives/po-orchard-root-fall-marker-v1.png','effects/po-overgrowth-forecast-v1.png']],
  ['maybe-flock','Maybe-Flock Roost','Nonogram deduction and beam allocation',['enemies/po-maybe-finch-idle-v2.png','objectives/po-rooststorm-whistle-tower-v2.png','mechanisms/po-rooststorm-wind-dial-v2.png','effects/po-rooststorm-front-v2.png']],
  ['first-whistle','The First Whistle','Periodic schedules and strike windows',['objectives/po-first-whistle-founding-stone-v1.png','mechanisms/po-first-whistle-branch-port-v1.png','mechanisms/po-first-whistle-signal-root-network-v1.png','effects/po-first-whistle-shield-v1.png','effects/po-first-whistle-strike-vulnerability-v1.png']]
].map(([id,title,puzzle,assets],i)=>({id,title,puzzle,deliveryWave:i<5?1:2,tiers:5,firstClearStarsProposed:3,assets:assets.map(p=>artRoot+p)}));
for (const m of missions) for (const p of m.assets) assert(fs.existsSync(path.join(root,p)),p);
assert.equal(new Set(missions.map(m=>m.id)).size,10);
const grid=[[1,3,4,2],[4,2,1,3],[2,4,3,1],[3,1,2,4]];
const validUnit = a => assert.deepEqual([...a].sort(),[1,2,3,4]);
for(let i=0;i<4;i++){validUnit(grid[i]);validUnit(grid.map(r=>r[i]));}
for(let r=0;r<4;r+=2)for(let c=0;c<4;c+=2)validUnit([grid[r][c],grid[r][c+1],grid[r+1][c],grid[r+1][c+1]]);
assert.equal(grid[0][1]+grid[1][1],5);assert.equal(grid[0][2]+grid[0][3],6);
assert.equal(grid[1][0]+grid[2][0],6);assert.equal(grid[1][2]+grid[2][2],4);
assert.equal(grid[2][1]+grid[3][1],5);assert.equal(grid[2][3]+grid[3][2],3);
const equationSolutions=[];
for(const a of [2,3,4,5,6,7])for(const b of [3,4,5,6,7,8])for(const c of [1,2,3,4,5,6])for(const op of ['+','−','×']) {
  const result=op==='+'?a+b:op==='−'?a-b:a*b;
  if(result===24 && b+c===11 && c-a===1)equationSolutions.push({a,b,c,op});
}
assert.deepEqual(equationSolutions,[{a:4,b:6,c:5,op:'×'}]);
assert.equal(7+4,5+3+2+1);
assert.equal(8+10,18);assert.equal(8+2,10);assert.equal(10-2,8);
assert.equal((1+2)%2,1);assert.equal((1+1)%2,0);
assert.equal((2+5+3)%2,0);assert.notEqual((2+5)%2,0);
const ring=Array.from({length:6},(_,i)=>[i,(i+1)%6]);
assert.equal(ring.length,6);for(let i=0;i<6;i++)assert.equal(ring.flat().filter(v=>v===i).length,2);
const region=new Set(['0,0','1,0','2,0','3,0','0,1','1,1','2,1']);
const pieces=[['0,0','1,0'],['2,0'],['0,1']];
assert.equal(new Set(pieces.flat()).size,pieces.flat().length);assert(pieces.flat().every(p=>region.has(p)));
assert.equal(region.size-pieces.flat().length,3);
const runs = line => line.join('').split('0').filter(Boolean).map(s=>s.length);
const cross=Array.from({length:5},(_,r)=>Array.from({length:5},(_,c)=>+(r===2||c===2)));
for(let i=0;i<5;i++){assert.deepEqual(runs(cross[i]),[i===2?5:1]);assert.deepEqual(runs(cross.map(r=>r[i])),[i===2?5:1]);}
const candidates=[[0,0,1,0,0],[0,1,0,0,0],[1,0,0,0,0],[0,0,0,1,0],[0,0,0,0,1]];
let solutions=0;
for(const a of candidates)for(const b of candidates)for(const d of candidates)for(const e of candidates){const board=[a,b,[1,1,1,1,1],d,e];if(board[0].every((_,c)=>JSON.stringify(runs(board.map(r=>r[c])))===JSON.stringify([c===2?5:1])))solutions++;}
assert.equal(solutions,1);
assert.deepEqual([1,4,7,10].filter(n=>[2,6,10].includes(n)),[10]);
fs.writeFileSync(path.join(root,'docs/expeditions/asset-audit-2026-10-01/mission-catalogue.json'),JSON.stringify({status:'design-proposal-not-playable',missions},null,2));
async function checkCardFixture() {
  const {expeditionRoster}=await import('../../expeditions/expedition-roster.js');
  const roster=expeditionRoster('primary');
  const jobs=[c=>c.stats[1]>=9&&c.stats[4]>=8,c=>c.stats[0]>=8&&c.stats[2]>=9,c=>c.stats[3]>=9];
  const example=['gossamer','ninebark','cascade'].map(id=>roster.find(c=>c.id===id));
  example.forEach((c,i)=>assert(jobs[i](c)));
  for(const c of roster.filter(c=>['common','uncommon','rare'].includes(c.rarity))) assert(jobs.every(test=>!test(c)),c.id);
  let feasibleTeams=0;
  for(const a of roster)for(const b of roster)for(const c of roster)if(new Set([a.id,b.id,c.id]).size===3&&jobs[0](a)&&jobs[1](b)&&jobs[2](c))feasibleTeams++;
  assert(feasibleTeams>1);
  console.log(`Checked ${missions.length} mission IDs, ${missions.reduce((s,m)=>s+m.assets.length,0)} existing art references, ten mathematical fixtures and ${feasibleTeams} ordered teams for the static three-job requirements. No base Common/Uncommon/Rare qualifies for any complete job. Bonuses, full tactical play and procedural certification remain to validate.`);
}
checkCardFixture().catch(e=>{console.error(e);process.exitCode=1;});
