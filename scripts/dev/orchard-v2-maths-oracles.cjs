const permutations = a => a.length ? a.flatMap((v,i)=>permutations(a.filter((_,j)=>i!==j)).map(p=>[v,...p])) : [[]];
const key = ([q,r]) => `${q},${r}`;
const dirs = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];
const rotate = ([q,r]) => [-r,q+r];
const reflect = ([q,r]) => [-q-r,r];
const sudokuReference = {
  givens:[[0,0,1],[3,3,4]],
  cages:[[[0,1],[1,1],5],[[0,2],[0,3],6],[[1,0],[2,0],6],[[1,2],[2,2],4],[[2,1],[3,1],5],[[2,3],[3,2],3]]
};

function sudokuSolutions({givens=[],cages=[]}={}) {
  const out=[], rows=permutations([1,2,3,4]);
  function visit(grid) {
    if(grid.length===4) {
      if(givens.every(([r,c,v])=>grid[r][c]===v)&&cages.every(([a,b,sum])=>grid[a[0]][a[1]]+grid[b[0]][b[1]]===sum))out.push(grid.map(row=>[...row]));
      return;
    }
    const r=grid.length;
    for(const row of rows) {
      if(givens.some(([gr,c,v])=>gr===r&&row[c]!==v))continue;
      if(grid.some(prev=>prev.some((v,c)=>v===row[c])))continue;
      if(r%2===1&&[0,2].some(c=>new Set([grid[r-1][c],grid[r-1][c+1],row[c],row[c+1]]).size!==4))continue;
      visit([...grid,row]);
    }
  }
  visit([]);return out;
}

const activeFace = (faces,orientation) => faces[((-orientation)%6+6)%6];
function equation(tokens) {
  if(!Array.isArray(tokens)||![5,7].includes(tokens.length))return {valid:false,reason:'length'};
  if(tokens.some((v,i)=>i%2===0?!Number.isInteger(v)||v<0||v>100:!['=','+','−','×','÷'].includes(v)))return {valid:false,reason:'role-or-blank'};
  const eq=tokens.flatMap((v,i)=>v==='='?[i]:[]);
  if(eq.length!==1)return {valid:false,reason:'equals-count'};
  const side=values=>{
    let value=values[0],expression=String(value);
    for(let i=1;i<values.length;i+=2) {
      const op=values[i],b=values[i+1];
      if(op==='÷'&&(b===0||value%b!==0))return {valid:false,reason:b===0?'zero-division':'fraction'};
      value=op==='+'?value+b:op==='−'?value-b:op==='×'?value*b:value/b;
      if(value<0||value>100)return {valid:false,reason:'intermediate-range'};
      expression=`(${expression} ${op} ${b})`;
    }
    return {valid:true,value,expression};
  };
  const left=side(tokens.slice(0,eq[0])),right=side(tokens.slice(eq[0]+1));
  if(!left.valid||!right.valid)return !left.valid?left:right;
  return {valid:true,powered:left.value===right.value,left:left.value,right:right.value,expression:`${left.expression} = ${right.expression}`};
}

function allocations(weights,{target,usedCount=weights.length,capacity=target,maxCount=4,pairs=[]}={}) {
  const out=[];
  for(let n=0;n<3**weights.length;n++) {
    let x=n;const pans=weights.map(()=>{const p=x%3;x=Math.floor(x/3);return p;});
    if(pans.filter(p=>p!==2).length!==usedCount)continue;
    if(pairs.some(([a,b])=>pans[a]!==2&&pans[a]===pans[b]))continue;
    const totals=[0,0],counts=[0,0];
    weights.forEach((v,i)=>{if(pans[i]<2){totals[pans[i]]+=v;counts[pans[i]]++;}});
    if(totals.every(v=>v===target&&v<=capacity)&&counts.every(v=>v<=maxCount))out.push(pans);
  }
  return out;
}

function weighingTree(known,hiddenCandidates,allowance) {
  const queries=[];
  for(let n=0;n<3**(known.length+1);n++) {
    let x=n;const pans=Array.from({length:known.length+1},()=>{const p=x%3;x=Math.floor(x/3);return p;});
    if(!pans.includes(0)||!pans.includes(1))continue;
    const result=v=>Math.sign([...known,v].reduce((s,w,i)=>s+(pans[i]===0?w:pans[i]===1?-w:0),0));
    queries.push({pans,result});
  }
  const memo=new Map();
  function visit(candidates,remaining) {
    if(candidates.length===1)return {value:candidates[0],depth:0};
    if(!remaining)return null;
    const cacheKey=`${candidates.join(',')}|${remaining}`;
    if(memo.has(cacheKey))return memo.get(cacheKey);
    for(const query of queries) {
      const groups=new Map();for(const v of candidates){const r=query.result(v);groups.set(r,[...(groups.get(r)||[]),v]);}
      if(groups.size===1)continue;
      const children={};let depth=0,valid=true;
      for(const [r,group]of groups) {const child=visit(group,remaining-1);if(!child){valid=false;break;}children[r]=child;depth=Math.max(depth,child.depth+1);}
      if(valid){const tree={pans:query.pans,children,depth};memo.set(cacheKey,tree);return tree;}
    }
    memo.set(cacheKey,null);return null;
  }
  return visit(hiddenCandidates,allowance);
}

function runs(line) {
  const out=[];let count=0;
  for(const cell of [...line,0])if(cell===1)count++;else if(count){out.push(count);count=0;}
  return out;
}
function linePatterns(clues) {
  return Array.from({length:32},(_,n)=>Array.from({length:5},(_,i)=>(n>>i)&1)).filter(row=>JSON.stringify(runs(row))===JSON.stringify(clues));
}
function nonogramSolutions(rowClues,colClues,givens=[]) {
  const columns=colClues.map(linePatterns),out=[];
  function visit(grid) {
    if(grid.length===5){out.push(grid.map(r=>[...r]));return;}
    const r=grid.length;
    for(const row of linePatterns(rowClues[r])) {
      if(givens.some(([gr,c,v])=>gr===r&&row[c]!==v))continue;
      const next=[...grid,row];
      if(columns.some((domain,c)=>!domain.some(pattern=>next.every((line,i)=>line[c]===pattern[i]))))continue;
      visit(next);
    }
  }
  visit([]);return out;
}
function forcedLine(clues,partial) {
  const patterns=linePatterns(clues).filter(p=>p.every((v,i)=>partial[i]===null||partial[i]===v));
  return patterns.length?partial.flatMap((v,i)=>v===null&&patterns.every(p=>p[i]===patterns[0][i])?[{index:i,value:patterns[0][i]}]:[]):[];
}

function transforms(piece,allowReflection=false) {
  const out=new Map();
  for(const reflected of allowReflection?[false,true]:[false])for(let orientation=0;orientation<6;orientation++) {
    let cells=piece.map(p=>reflected?reflect(p):[...p]);
    for(let i=0;i<orientation;i++)cells=cells.map(rotate);
    const anchor=cells.toSorted((a,b)=>a[1]-b[1]||a[0]-b[0])[0];
    const normal=cells.map(([q,r])=>[q-anchor[0],r-anchor[1]]).sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
    out.set(normal.map(key).join(';'),normal);
  }
  return [...out.values()];
}
function packingLegal(patch,pieces,sockets=[],forbidden=[],approaches=[]) {
  const allowed=new Set(patch.map(key)),blocked=new Set(forbidden.map(key)),covered=new Set();
  for(const cells of pieces)for(const p of cells) {
    const k=key(p);if(!allowed.has(k)||blocked.has(k)||covered.has(k))return false;covered.add(k);
  }
  if(!sockets.every(p=>covered.has(key(p))))return false;
  const free=new Set([...allowed].filter(k=>!covered.has(k))),seen=new Set(),queue=approaches.map(key).filter(k=>free.has(k));
  queue.forEach(k=>seen.add(k));
  for(let i=0;i<queue.length;i++){const [q,r]=queue[i].split(',').map(Number);for(const [dq,dr]of dirs){const k=key([q+dq,r+dr]);if(free.has(k)&&!seen.has(k)){seen.add(k);queue.push(k);}}}
  return free.size>=3&&seen.size===free.size;
}

module.exports={sudokuReference,sudokuSolutions,activeFace,equation,allocations,weighingTree,runs,linePatterns,nonogramSolutions,forcedLine,rotate,reflect,transforms,packingLegal};
