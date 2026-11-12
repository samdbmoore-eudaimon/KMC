import fs from 'node:fs';
import crypto from 'node:crypto';
const dir='docs/expeditions/v2/evidence/turning-ravine-20261003';
const sources=[
  'expeditions/v2/generation/turning-ravine.js','expeditions/v2/generation/turning-ravine.test.js','expeditions/v2/generation/topology.js','expeditions/v2/puzzles/rotation.js',
  ...['RotationBoard.jsx','MapViewport.jsx','OrchardExpedition.jsx','PuzzlePanel.jsx','PuzzleNote.jsx','Briefing.jsx','action-guide.js','next-step.js','station-state.js','feedback.js'].map(name=>`expeditions/v2/ui/${name}`),
  ...['EquationWheel.jsx','runtime-art.js','manifest.json','art.test.js'].map(name=>`expeditions/v2/art/${name}`),
  'docs/expeditions/v2/art-preflight-review.json','docs/expeditions/v2/reports/codex-turning-ravine-20261003.md',
  ...['certify-turning-ravine-reference.mjs','test-turning-ravine-ui.mjs','turning-ravine-preview.jsx','build-turning-ravine-preview.cjs','verify-turning-ravine-evidence.mjs','embed-orchard-v2-art.cjs','snapshot-turning-ravine-handoff.mjs'].map(name=>`scripts/dev/${name}`)
];
const record=path=>{const bytes=fs.readFileSync(path);return {path,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};};
const snapshot={schemaVersion:1,originatingThreadId:'01a100e6-b8f7-7a73-97c8-afa8455b7120',status:'legacy-bounded-batch-handoff',createdAt:new Date().toISOString(),sources:sources.map(record),evidence:fs.readdirSync(dir).filter(name=>name!=='handoff-provenance-20261004.json').sort().map(name=>record(`${dir}/${name}`)),sharedBuild:['WallabyMaths.html','www/index.html'].map(record),runtimeAvailable:false,physicalDeviceAccepted:false,comprehensionAccepted:false};
fs.writeFileSync(`${dir}/handoff-provenance-20261004.json`,JSON.stringify(snapshot,null,2));
console.log(JSON.stringify({sources:snapshot.sources.length,evidence:snapshot.evidence.length,sharedBuild:snapshot.sharedBuild},null,2));
