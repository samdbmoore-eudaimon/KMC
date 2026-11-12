import fs from 'node:fs';
import {generateMaybeFlockCandidate} from '../../expeditions/v2/generation/maybe-flock.js';
import {generateHollowBoughCandidate} from '../../expeditions/v2/generation/hollow-bough.js';
import {generateUnequalCrossingCandidate} from '../../expeditions/v2/generation/unequal-crossing.js';
import {generateTurningRavineCandidate} from '../../expeditions/v2/generation/turning-ravine.js';
import {generateFourLocksCandidate} from '../../expeditions/v2/generation/four-locks.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {planOrchardBlueprint} from './orchard-v2-tactical-planner.mjs';
registerOrchardPuzzleHooks();
const family=process.argv[2]||'roost',tier=Number(process.argv[3]||1),seed=Number(process.argv[4]||1),layoutId=process.argv[5]||'river',planFamily=process.argv[6]||(family==='roost'?'alcove-intercept':'direct-guard');
const generators={roost:generateMaybeFlockCandidate,bough:generateHollowBoughCandidate,unequal:generateUnequalCrossingCandidate,ravine:generateTurningRavineCandidate,four:generateFourLocksCandidate},generator=generators[family];
if(!generator)throw Error('Unknown QA family');
const team=process.argv[7]?.split(',')||(family==='roost'?['tuppence','dapple','sorrel']:['bushel','furrow','pip']),tag=process.argv[8]||family;
if(!/^[a-z0-9-]+$/.test(tag))throw Error('Invalid evidence tag');
const candidate=generator({tier,seed,layoutId});
if(candidate.status!=='success'){fs.writeFileSync(new URL(`../../docs/expeditions/v2/evidence/code-overnight-20261004/${tag}-planner-status.json`,import.meta.url),JSON.stringify({family,tier,seed,layoutId,team,planFamily,...candidate},null,2));throw Error(JSON.stringify(candidate));}
const plan=planOrchardBlueprint({blueprint:candidate.blueprint,teamChoices:[{cardIds:team}],planFamily,maxStates:30000});
if(plan.status!=='success'){fs.writeFileSync(new URL(`../../docs/expeditions/v2/evidence/code-overnight-20261004/${tag}-planner-status.json`,import.meta.url),JSON.stringify({family,tier,seed,layoutId,team,planFamily,status:plan.status,metrics:plan.metrics},null,2));throw Error(JSON.stringify(plan.metrics));}
const trace=plan.traces[0];
fs.writeFileSync(new URL(`../../docs/expeditions/v2/evidence/code-overnight-20261004/${tag}-reference-plan.json`,import.meta.url),JSON.stringify(trace,null,2));
console.log(JSON.stringify(trace.commands.map(command=>({type:command.type,heroId:command.heroId,payload:command.payload})),null,2));
