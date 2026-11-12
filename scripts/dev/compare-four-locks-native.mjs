import fs from 'node:fs';
import {generateNativeSudokuPacket} from '../../expeditions/v2/generation/native-sudoku.js';
import {canonicalSudokuPattern} from '../../expeditions/v2/generation/bank.js';
const original=JSON.parse(fs.readFileSync(new URL('../../docs/expeditions/v2/certification/four-locks/candidate-pool-inventory.json',import.meta.url),'utf8'));
const records=[];
for(const tier of [4,5])for(let seed=0;seed<8;seed++){
  const result=generateNativeSudokuPacket({tier,seed}),pattern=result.status==='success'?canonicalSudokuPattern(result.puzzle):null;
  const baseline=original.requests.find(r=>r.tier===tier&&r.seed===seed&&r.layoutId==='river');
  records.push({tier,seed,status:result.status,pattern,result,baseline:{status:baseline.status,puzzleHash:baseline.puzzleHash,rejections:baseline.rejections||baseline.mathematicalEvidence?.rejections}});
  console.log(JSON.stringify({tier,seed,status:result.status,attempts:result.attempts,rejections:result.rejections||result.mathematicalEvidence.rejections,pattern:pattern?.hash}));
}
const summary=[4,5].map(tier=>{
  const selected=records.filter(r=>r.tier===tier),successes=selected.filter(r=>r.status==='success'),totals={geometry:0,clueTarget:0,cageTarget:0,solverUnknown:0,humanIncomplete:0,techniques:0};
  for(const record of selected){const counts=record.result.rejections||record.result.mathematicalEvidence.rejections;for(const key of Object.keys(totals))totals[key]+=counts[key];}
  return {tier,requests:8,successes:successes.length,unknowns:selected.filter(r=>r.status==='unknown').length,canonicalPatterns:new Set(successes.map(r=>r.pattern.serialization)).size,rejections:totals,baselineSuccesses:selected.filter(r=>r.baseline.status==='success').length,baselinePatterns:new Set(selected.map(r=>r.baseline.puzzleHash).filter(Boolean)).size};
});
const report={schemaVersion:1,command:'node scripts/dev/compare-four-locks-native.mjs',packetId:'native-adjacent-v1',limits:{requests:16,seeds:[0,1,2,3,4,5,6,7],maxAttempts:256,solverNodeBudget:100000,fallbackAttempts:0,plannerInvocations:0},summary,records,limitations:['Separate offline mathematical packet; no tactical certification or runtime import.','Existing baseline results are read from the prior inventory, not regenerated.','Canonical patterns exclude digit/sum/label changes. Unknown is not impossibility.','The default generator and all certified outputs remain unchanged.']};
fs.writeFileSync(new URL('../../docs/expeditions/v2/fixtures/four-locks-native-comparison.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({summary}));
