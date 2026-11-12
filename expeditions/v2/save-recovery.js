import {blueprintHash,createRun,exportRunRecord,hashValue,replayRun,stateHash} from './run.js';
import {crossingExitViolations} from './generation/crossing-invariants.js';

export const BRIDGE_RECOVERY_VERSION='orchard-legacy-bridge-exits/1';
const SOURCE_CERTIFICATE='orchard-v2-7bb0c308bb8ec44f';
const SOURCE_CONTENT='1c74f11469dfbac5';
const REPAIRS=[{hex:'4,6',from:'hedge',to:'floor'},{hex:'4,2',from:'hedge',to:'floor'}];

export function recoverLegacyBridgeRecord(record) {
  const blueprint=record?.initialRun?.blueprint;
  if(!blueprint||blueprint.recovery||blueprint.familyId!=='four-locks'||blueprint.tier!==1||blueprint.layoutId!=='river'||blueprint.certificateId!==SOURCE_CERTIFICATE||blueprint.certifiedContentHash!==SOURCE_CONTENT)return {needed:false};
  if(!REPAIRS.every(change=>blueprint.tiles.some(t=>`${t.q},${t.r}`===change.hex&&t.terrain===change.from)))return {needed:false};
  const old=replayRun(record);
  if(!old.ok)return {needed:true,ok:false,reason:'recovery-original-replay',index:old.index};
  const repaired=JSON.parse(JSON.stringify(blueprint));
  for(const change of REPAIRS)repaired.tiles.find(t=>`${t.q},${t.r}`===change.hex).terrain=change.to;
  repaired.certificateId=null;
  repaired.certifiedContentHash=null;
  repaired.structuralFingerprint=null;
  repaired.referenceFallback=false;
  repaired.recovery={version:BRIDGE_RECOVERY_VERSION,sourceBlueprintHash:blueprintHash(blueprint),retiredCertificateId:SOURCE_CERTIFICATE,retiredContentHash:SOURCE_CONTENT,changes:REPAIRS.map(c=>({...c}))};
  if(crossingExitViolations(repaired).length)return {needed:true,ok:false,reason:'recovery-crossing-invalid'};
  const initial=record.initialRun;
  const rebuilt=createRun({...initial,blueprint:repaired});
  const next=replayRun({...record,initialRun:rebuilt.initialRun,finalStateHash:null});
  if(!next.ok)return {needed:true,ok:false,reason:'recovery-command-incompatible',index:next.index};
  // A topology repair must not alter retained actions, health, AP, puzzle state, holders or round.
  if(stateHash(next.state)!==stateHash(old.state))return {needed:true,ok:false,reason:'recovery-state-incompatible'};
  return {needed:true,ok:true,state:next.state,record:exportRunRecord(next.state),provenance:{version:BRIDGE_RECOVERY_VERSION,runId:initial.runId,sourceBlueprintHash:blueprintHash(blueprint),repairedBlueprintHash:blueprintHash(repaired),sourceRecordHash:hashValue(record),retainedStateHash:stateHash(old.state),retainedCommands:record.commands.length,retiredCertificateId:SOURCE_CERTIFICATE,changes:REPAIRS.map(c=>({...c}))}};
}
