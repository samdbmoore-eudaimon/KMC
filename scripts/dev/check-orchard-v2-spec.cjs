const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname,'../..');
const out = path.join(root,'docs/expeditions/v2');
const families=['four-locks','turning-ravine','unequal-crossing','maybe-flock','hollow-bough'];
const profiles=[
  [[4,0,2,0,0],[0,4,0,0,2],[0,0,0,5,2]],
  [[6,0,5,0,0],[0,6,0,0,2],[0,0,0,6,4]],
  [[7,0,7,0,0],[0,7,0,0,4],[0,0,6,6,4]],
  [[7,0,7,0,0],[0,8,0,0,4],[0,0,6,7,4]],
  [[8,0,8,0,0],[0,8,0,0,7],[0,0,7,8,4]]
];
const contract={specVersion:'1.0',status:'design-baseline-not-implemented',rulesVersion:2,generatorVersion:1,moduleKey:'primary',families,tiers:5,deadline:5,squadSize:3,apPerRound:2,firstTierClearStars:3,replayStars:0,newModuleSetReward:0,chargeCapacity:[4,6,7,7,8],commissioning:profiles,shapeAlcove:{geometryBonus:2,speedRequired:6,prepareAP:1},bankMinimumPerFamilyTier:64,sudokuOutputBudget:[7,7,7,8,8],operatorFaces:['=','+','−','×','÷',null],topology:{columns:12,rows:9,cutCornerSide:2},scope:'Parameters reflect the v1.0 documents. Development must still implement and certify the real engine, generator bank and UI.'};
const key=(q,r)=>`${q},${r}`;
const dirs=[[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
function footprint(){const cells=[];for(let r=0;r<9;r++)for(let c=0;c<12;c++)if(!((c<2||c>9)&&(r<2||r>6)))cells.push({c,r,q:c-Math.floor(r/2)});return cells;}
function permutations(a){if(!a.length)return [[]];return a.flatMap((x,i)=>permutations(a.filter((_,j)=>i!==j)).map(p=>[x,...p]));}
async function main(){
  fs.mkdirSync(out,{recursive:true});
  const {expeditionRoster}=await import('../../expeditions/expedition-roster.js');
  const roster=expeditionRoster('primary');
  const pass=(c,p)=>p.every((n,i)=>c.stats[i]>=n);
  const counts=[];
  for(let tier=0;tier<5;tier++){
    const direct=new Set(),alcove=new Set(),epicAssignments=[];
    const alt=[...profiles[tier][1]];alt[1]-=2;alt[4]=6;
    for(const a of roster)for(const b of roster)for(const c of roster){
      if(new Set([a.id,b.id,c.id]).size!==3||!pass(a,profiles[tier][0])||!pass(c,profiles[tier][2]))continue;
      const id=[a.id,b.id,c.id].sort().join('|');
      if(pass(b,profiles[tier][1]))direct.add(id);
      if(pass(b,alt))alcove.add(id);
      if(tier===4&&(pass(b,profiles[tier][1])||pass(b,alt))&&[a,b,c].every(x=>x.rarity==='epic'))epicAssignments.push({number:a.id,shape:b.id,sustain:c.id,route:pass(b,profiles[tier][1])?'direct':'alcove'});
    }
    const union=new Set([...direct,...alcove]);
    assert.equal(union.size,[1975,608,210,93,33][tier]);
    if(tier>0)for(const id of union){const cards=id.split('|').map(x=>roster.find(c=>c.id===x));assert(!(cards.filter(x=>x.rarity==='legendary').length===1&&cards.filter(x=>x.rarity==='common').length===2));}
    if(tier===4){for(const c of roster.filter(c=>['common','uncommon','rare'].includes(c.rarity)))assert(!pass(c,profiles[tier][0])&&!pass(c,profiles[tier][1])&&!pass(c,profiles[tier][2])&&!pass(c,alt));const squads=new Set(epicAssignments.map(x=>[x.number,x.shape,x.sustain].sort().join('|')));assert.equal(squads.size,8);for(const c of roster.filter(x=>x.rarity==='epic'))assert([...squads].some(id=>!id.split('|').includes(c.id)));}
    counts.push({tier:tier+1,direct:direct.size,alcove:alcove.size,combined:union.size,epicAssignments});
  }
  const cells=footprint(),cellSet=new Set(cells.map(x=>key(x.q,x.r)));assert.equal(cells.length,92);
  const seen=new Set([key(cells[0].q,cells[0].r)]),queue=[cells[0]];
  for(let i=0;i<queue.length;i++)for(const [dq,dr]of dirs){const q=queue[i].q+dq,r=queue[i].r+dr,k=key(q,r);if(cellSet.has(k)&&!seen.has(k)){seen.add(k);queue.push({q,r});}}
  assert.equal(seen.size,92);
  const centre={q:1,r:4},patch=[];
  for(let q=-2;q<=2;q++)for(let r=-2;r<=2;r++)if((Math.abs(q)+Math.abs(r)+Math.abs(q+r))/2<=2)patch.push([q+centre.q,r+centre.r]);
  assert.equal(patch.length,19);assert(patch.every(([q,r])=>cellSet.has(key(q,r))));assert(patch.every(([q,r])=>q+Math.floor(r/2)<6));
  const rowPerms=permutations([1,2,3,4]),sudokuSolutions=[];
  function sudoku(rows){if(rows.length===4){const g=rows;if(g[0][0]!==1||g[3][3]!==4)return;const cages=[[0,1,1,1,5],[0,2,0,3,6],[1,0,2,0,6],[1,2,2,2,4],[2,1,3,1,5],[2,3,3,2,3]];if(cages.every(([r,c,s,d,sum])=>g[r][c]+g[s][d]===sum))sudokuSolutions.push(g.map(r=>[...r]));return;}for(const row of rowPerms){const r=rows.length;if(rows.some(pr=>pr.some((v,c)=>v===row[c])))continue;if(r%2===1&&[0,2].some(c=>new Set([rows[r-1][c],rows[r-1][c+1],row[c],row[c+1]]).size!==4))continue;sudoku([...rows,row]);}}
  sudoku([]);assert.equal(sudokuSolutions.length,1);
  const rotation=[];
  for(const a of [2,3,4,5,6,7])for(const b of [3,4,5,6,7,8])for(const c of [1,2,3,4,5,6])for(const op of contract.operatorFaces){let value=null;if(op==='+')value=a+b;if(op==='−'&&a>=b)value=a-b;if(op==='×')value=a*b;if(op==='÷'&&b!==0&&a%b===0)value=a/b;if(value===24&&b+c===11&&c-a===1)rotation.push({a,b,c,op});}
  assert.deepEqual(rotation,[{a:4,b:6,c:5,op:'×'}]);
  const balance=[];for(let bits=0;bits<64;bits++){const weights=[1,2,3,4,5,7],left=weights.filter((_,i)=>bits&(1<<i)),right=weights.filter((_,i)=>!(bits&(1<<i)));if(left.reduce((s,v)=>s+v,0)===11&&right.reduce((s,v)=>s+v,0)===11&&left.length<=4&&right.length<=4)balance.push({left,right});}assert(balance.length>=2);
  const rotate=([q,r])=>[-r,q+r],reflect=([q,r])=>[-q-r,r];
  for(const start of [[1,0],[1,1],[-2,1]]){let p=start;for(let i=0;i<6;i++)p=rotate(p);assert.deepEqual(p,start);assert.deepEqual(reflect(reflect(start)),start);}
  for(const t of profiles)assert(t[0][0]>0&&t[0][2]>0&&t[1][1]>0&&t[1][4]>0&&t[2][3]>0);
  for(const file of ['EXPEDITIONS_9FO_IMPLEMENTATION_SPEC.md','EXPEDITIONS_9FO_GENERATION_SPEC.md','EXPEDITIONS_9FO_DELIVERY_BOARD.md','EXPEDITIONS_9FO_ART_REQUEST.md'])assert(fs.readFileSync(path.join(root,file),'utf8').includes('1.0'));
  fs.writeFileSync(path.join(out,'spec-contract.json'),JSON.stringify(contract,null,2));
  fs.writeFileSync(path.join(out,'spec-validation.json'),JSON.stringify({status:'design-checks-only',rosterCounts:counts,footprintCells:92,packingPatchCells:19,sudokuReferenceSolutions:sudokuSolutions,rotationReferenceSolutions:rotation,balanceReferenceSolutions:balance,notValidated:['production engine','tactical traces','64-entry banks','generated clue ladders','runtime viewport','child pacing']},null,2));
  console.log('Design checks passed: five families/25 tiers; exact roster counts and eight non-compulsory-card Epic squads;92-cell connected footprint;19-cell packing disc; unique reference Sudoku and six-face equation solution; balance allocations and hex transforms. Production gameplay/banks/UI are not certified by these checks.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
