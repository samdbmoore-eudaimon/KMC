import fs from 'node:fs';
import {generateDisplacedTopology} from '../../expeditions/v2/generation/displaced-topology.js';
import {generateFourLocksPuzzle} from '../../expeditions/v2/generation/four-locks.js';
import {canonicalSudokuPattern} from '../../expeditions/v2/generation/bank.js';
const records=[];
for(const layoutId of ['river','islands','hedges','terraces'])for(let seed=0;seed<4;seed++){
  const topology=generateDisplacedTopology({tier:1,layoutId,seed}),maths=topology.status==='success'?generateFourLocksPuzzle({tier:1,seed,controlHex:topology.anchors.control}):null;
  const status=topology.status==='success'?maths.status:topology.status;
  const pattern=maths?.status==='success'?canonicalSudokuPattern(maths.puzzle):null;
  records.push({tier:1,seed,layoutId,status,certified:false,topology,maths,pattern});
  console.log(JSON.stringify({layoutId,seed,status,attempts:topology.attempts,deltas:topology.deltas,rejections:topology.rejections}));
}
const summary=['river','islands','hedges','terraces'].map(layoutId=>{const selected=records.filter(r=>r.layoutId===layoutId),success=selected.filter(r=>r.status==='success');return {layoutId,requests:4,successes:success.length,unknowns:selected.filter(r=>r.status==='unknown').length,topologyCount:new Set(success.map(r=>r.topology.canonical.serialization)).size,puzzlePatterns:new Set(success.map(r=>r.pattern.serialization)).size,actuallyDisplaced:success.filter(r=>r.topology.deltas.some(d=>d!==0)).length};});
const report={schemaVersion:1,command:'node scripts/dev/sample-displaced-topology.mjs',limits:{requests:16,tier:1,seeds:[0,1,2,3],maxTopologyAttempts:256,maxPuzzleAttempts:256,plannerInvocations:0},summary,records,limitations:['Offline topology/math packets only, not engine blueprints or tactical certificates.','Exposure is a declared geometric proxy: route cells adjacent to water/controlled passages. Actual enemy-route trade-offs need reducer evidence.','Existing generators/certificates/runtime entries remain unchanged. No bank population or QA-01 acceptance.']};
fs.writeFileSync(new URL('../../docs/expeditions/v2/fixtures/four-locks-displaced-topology.json',import.meta.url),JSON.stringify(report,(_,v)=>typeof v==='number'&&!Number.isFinite(v)?String(v):v,2)+'\n');
console.log(JSON.stringify({summary}));
