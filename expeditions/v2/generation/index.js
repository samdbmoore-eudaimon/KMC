import {generateFourLocksCandidate} from './four-locks.js';
import {generateDisplacedFourLocksCandidate} from './displaced-four-locks.js';
import {ORCHARD_REFERENCE_ENTRIES} from './reference-entries.js';
import {RUNTIME_BANK,RUNTIME_BANK_FALLBACK} from './runtime-bank.js';
import {generateTurningRavineCandidate} from './turning-ravine.js';
import {generateUnequalCrossingCandidate} from './unequal-crossing.js';
import {generateMaybeFlockCandidate} from './maybe-flock.js';
import {generateHollowBoughCandidate} from './hollow-bough.js';
import {PRIVATE_DEV_BANK} from './private-dev-bank.js';
import {hashValue} from '../index.js';

// PRIVATE DEVELOPMENT availability (Sam, 5 October 2026: put every implemented type in the main App for private play).
// These entries are planner-verified winnable (real reducer, direct plus alcove plus a second distinct-team plan) but NOT certified:
// no certificate IDs, no historical certificate touched, and Four Locks tier 1 keeps its certified runtime bank below.
const PRIVATE_GENERATORS={'four-locks':generateFourLocksCandidate,'turning-ravine':generateTurningRavineCandidate,'unequal-crossing':generateUnequalCrossingCandidate,'maybe-flock':generateMaybeFlockCandidate,'hollow-bough':generateHollowBoughCandidate};
const privatePool=(familyId,tier)=>PRIVATE_DEV_BANK[`${familyId}:${tier}`]||[];

export function orchardGenerationAvailability(familyId,tier) {
  return (familyId==='four-locks'&&tier===1)||privatePool(familyId,tier).length>0;
}

// 'certified' (Four Locks T1 bank), 'private-development' (planner-verified, uncertified) or 'unavailable'.
export function orchardGenerationStatus(familyId,tier) {
  if(familyId==='four-locks'&&tier===1)return {available:true,certified:true,status:'certified',label:'Certified'};
  const entries=privatePool(familyId,tier).length;
  return entries?{available:true,certified:false,status:'private-development',label:'Private development: planner-verified, not certified',entries}:{available:false,certified:false,status:'unavailable',label:'Not available'};
}

function generatePrivateBlueprint({familyId,tier,seed,recentParameterSeeds}) {
  const pool=privatePool(familyId,tier),recent=new Set(recentParameterSeeds.map(String));
  const start=seed%pool.length;
  let index=start,repeat=true;
  for(let probe=0;probe<Math.min(BANK_PROBES,pool.length);probe+=1){
    const candidate=(start+probe)%pool.length;
    if(!recent.has(String(candidate))){index=candidate;repeat=false;break;}
  }
  for(let hop=0;hop<pool.length;hop+=1){
    const at=(index+hop)%pool.length,[layoutId,parameterSeed,contentHash]=pool[at];
    const candidate=PRIVATE_GENERATORS[familyId]({tier,seed:parameterSeed,layoutId});
    if(candidate.status==='success'&&hashValue(candidate.blueprint)===contentHash)
      return {...candidate.blueprint,seed,requestedSeed:seed,parameterSeed,bankIndex:at,certificateId:null,certifiedContentHash:null,referenceFallback:false,privateDevelopment:true,bankStatus:'planner-verified-uncertified',repeat:hop?true:repeat};
  }
  throw Error('Private development pool could not regenerate any entry for this family and tier');
}

const BANK_PROBES=8;

// Reconstructs one certified displaced entry and proves it is byte-identical to what was certified.
function reconstruct(entry) {
  const candidate=generateDisplacedFourLocksCandidate({tier:1,seed:entry.parameterSeed,layoutId:entry.layoutId,deltas:entry.deltas,sourceTopologyHash:entry.sourceTopologyHash});
  if(candidate.status!=='success'||hashValue(candidate.blueprint)!==entry.contentHash)throw Error('Certified bank regeneration mismatch');
  return candidate.blueprint;
}

// Four Locks tier 1 runtime selection (generation spec section 1): requestedSeed % bank.length, then up to eight
// deterministic probes past recently used entries; if all eight were recent the first probe is used and `repeat`
// is reported. `bankIndex` identifies the entry uniquely (parameter seeds repeat across layouts).
export function generateOrchardBlueprint({familyId,tier,seed,generatorVersion=1,recentParameterSeeds=[]}) {
  if(!Number.isInteger(seed)||seed<0||seed>0xffffffff||generatorVersion!==1)throw Error('Unsupported Orchard generator request');
  if(!orchardGenerationAvailability(familyId,tier))throw Error('This family and tier are awaiting certified playthroughs');
  if(!(familyId==='four-locks'&&tier===1))return generatePrivateBlueprint({familyId,tier,seed,recentParameterSeeds:recentParameterSeeds||[]});
  const recent=new Set(recentParameterSeeds.map(Number));
  const start=seed%RUNTIME_BANK.length;
  let index=start,repeat=true;
  for(let probe=0;probe<BANK_PROBES;probe+=1){
    const candidate=(start+probe)%RUNTIME_BANK.length;
    if(!recent.has(candidate)){index=candidate;repeat=false;break;}
  }
  const entry=RUNTIME_BANK[index];
  const blueprint=reconstruct(entry);
  return {...blueprint,seed,requestedSeed:seed,parameterSeed:entry.parameterSeed,bankIndex:index,certificateId:entry.certificateId,certifiedContentHash:entry.contentHash,referenceFallback:false,repeat};
}

// The separately certified fallback entry (runtime never silently substitutes it).
export function generateOrchardFallbackBlueprint(seed=0) {
  const blueprint=reconstruct(RUNTIME_BANK_FALLBACK);
  return {...blueprint,seed,requestedSeed:seed,parameterSeed:RUNTIME_BANK_FALLBACK.parameterSeed,bankIndex:-1,certificateId:RUNTIME_BANK_FALLBACK.certificateId,certifiedContentHash:RUNTIME_BANK_FALLBACK.contentHash,referenceFallback:true,repeat:false};
}

// Legacy v1 reference (tier-1-river-seed-1). It has a dead-end bridge and is retained as certified history only.
export function generateLegacyReferenceBlueprint({seed}) {
  const entry=ORCHARD_REFERENCE_ENTRIES['four-locks:1'];
  const candidate=generateFourLocksCandidate({tier:1,seed:entry.parameterSeed,layoutId:entry.layoutId,legacyCrossings:true});
  if(candidate.status!=='success'||hashValue(candidate.blueprint)!==entry.contentHash||candidate.puzzleFingerprint!==entry.puzzleFingerprint)throw Error('Legacy reference regeneration mismatch');
  return {...candidate.blueprint,seed,requestedSeed:seed,parameterSeed:entry.parameterSeed,certificateId:entry.certificateId,certifiedContentHash:entry.contentHash,referenceFallback:true,repeat:false,legacy:true};
}
