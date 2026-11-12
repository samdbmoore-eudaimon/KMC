import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {canonicalTopology,canonicalSudokuPattern,auditFourLocksCoverage} from '../../expeditions/v2/generation/bank.js';
import {certifyCandidate} from './orchard-v2-certification.mjs';
import {orchardGenerationAvailability} from '../../expeditions/v2/generation/index.js';
const root=fileURLToPath(new URL('../../docs/expeditions/v2/certification/four-locks/',import.meta.url)),entries=[];
for(const dir of fs.readdirSync(root,{withFileTypes:true}).filter(d=>d.isDirectory()).sort((a,b)=>a.name<b.name?-1:1)){
  const folder=path.join(root,dir.name),read=name=>JSON.parse(fs.readFileSync(path.join(folder,name+'.json'),'utf8'));
  if(!['candidate','result','traces'].every(name=>fs.existsSync(path.join(folder,name+'.json'))))continue;
  const candidate=read('candidate'),saved=read('result');
  if(candidate.status!=='success'||candidate.blueprint?.familyId!=='four-locks')continue;
  const checked=certifyCandidate(candidate,read('traces'));
  const certified=checked.status==='success'&&saved.certification?.status==='success'&&checked.certificateId===saved.certification.certificateId;
  const puzzle=candidate.blueprint.puzzle,cages=puzzle.cages||[],givenCells=new Set(puzzle.givens.map(g=>g.cellId||`r${g.row}c${g.col}`));
  const patternSummary={givens:givenCells.size,cageSizes:cages.map(c=>c.cellIds.length).sort(),sharedCagePairs:cages.flatMap((c,i)=>cages.slice(i+1).filter(d=>c.cellIds.some(id=>d.cellIds.includes(id)))).length,cagesTouchingGivens:cages.filter(c=>c.cellIds.some(id=>givenCells.has(id))).length,protectionGroups:puzzle.lockGroups?.length||0};
  entries.push({source:dir.name,tier:candidate.blueprint.tier,parameterSeed:candidate.blueprint.parameterSeed,layoutId:candidate.blueprint.layoutId,certified,certificateId:certified?checked.certificateId:null,verificationStatus:checked.status,errors:checked.errors||[],patternSummary,topology:canonicalTopology(candidate.blueprint),puzzle:canonicalSudokuPattern(puzzle)});
}
const coverage=auditFourLocksCoverage(entries);
coverage.countingScope='Distinct certified evidence available for review, including reference candidates; these are not populated bank entries.';
coverage.registeredRuntime=coverage.tiers.map(t=>({tier:t.tier,bankEntries:0,referenceAvailable:orchardGenerationAvailability('four-locks',t.tier)}));
const report={schemaVersion:1,command:'node scripts/dev/audit-four-locks-diversity.mjs',scope:'Saved Four Locks evidence only; no new candidate generation or planner invocation.',canonicalisers:{topology:'12 axial D6 transforms plus translation. Terrain, movement cost, anchor/deployment roles, controlled/permanent passage flags and hazard roles retained. Artwork, entity IDs and pressure numbers omitted. Known engine station IDs resolve to semantic roles; renamed records require explicit role metadata.',puzzle:'8 row and 8 column permutations preserving 2x2 boxes, transpose and all 24 digit bijections (first-occurrence normalisation). Given positions and digit equality, sum-cage cell incidence/linked marker and protection-group membership/effects retained. Decorative IDs/order, sums and solved numeric grids do not count as materially different dependency patterns. Redundant identical constraints are deduplicated. This is a pattern classifier, not a truth/difficulty or tactical certificate.'},entries,coverage,limitations:['Only certified, independently replayed entries count toward coverage. Unsuccessful candidates are listed for inspection.','Canonical serializations, not hash labels, determine distinct counts.','This does not populate a runtime bank. Runtime remains certified T1 only.','QA-01, other families, procedural-bank diversity/coverage and device/child acceptance remain pending.']};
fs.writeFileSync(path.join(root,'diversity-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({savedCandidates:entries.length,certifiedRecords:entries.filter(e=>e.certified).length,complete:coverage.complete,tiers:coverage.tiers.map(t=>({tier:t.tier,materialEntries:t.materialEntries,puzzlePatterns:t.puzzlePatterns,archetypes:t.archetypes.filter(a=>a.records),missingEntries:t.missingEntries}))}));
