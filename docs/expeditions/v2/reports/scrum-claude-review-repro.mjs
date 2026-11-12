import {makeFixtureBlueprint,registerFixtureHooks} from '../../../../expeditions/v2/fixture.js';
import {beginOrchardRun,applyOrchardV2Result,verifyOrchardV2Win,shouldPersist,orchardV2Bucket} from '../../../../expeditions/v2/persistence.js';
import {Driver,playFixtureToWin} from '../../../../expeditions/v2/test-helpers.js';
import {exportRunRecord,createRun} from '../../../../expeditions/v2/run.js';
import {previewCommand} from '../../../../expeditions/v2/actions.js';
import {orchardRosterProfiles} from '../../../../expeditions/v2/profile.js';

registerFixtureHooks();
const progress={cards:{},stars:0,packs:0,expeditions:{version:2,scenarios:{}}};
const begun=beginOrchardRun(progress,{familyId:'four-locks',tier:1,cardIds:['bushel','furrow','pip'],generateBlueprint:({seed})=>({...makeFixtureBlueprint({tier:1,enemyWake:4}),seed,parameterSeed:999})});
const observations={unownedSquadAccepted:begun.ok,freeDraftEditPersisted:shouldPersist({type:'edit-draft'})};
if(begun.ok){
  const saved=begun.update(progress);
  const won=playFixtureToWin(new Driver(begun.state));
  const record=exportRunRecord(won.state);
  const missingHash={...record};delete missingHash.finalStateHash;
  observations.missingFinalHashVerified=verifyOrchardV2Win(missingHash).ok;
  observations.foreignUnsavedWinStars=applyOrchardV2Result(progress,{record}).stars;
  observations.requestedSeed=begun.state.blueprint.seed;
  observations.parameterSeed=999;
  observations.savedRecentSeeds=orchardV2Bucket(saved).recentSeeds;
}
const healer=Object.values(orchardRosterProfiles()).find(p=>p.role==='healer');
const ids=[healer.cardId,...['bushel','furrow','pip'].filter(id=>id!==healer.cardId).slice(0,2)];
const state=createRun({blueprint:makeFixtureBlueprint(),cardIds:ids,runId:'review-mend'});
const mend=previewCommand(state,{type:'mend-and-mend-again',heroId:healer.cardId,expectedRevision:0,payload:{targetId:healer.cardId}});
observations.fullHealthMend={hero:healer.cardId,science:healer.stats[3],legal:mend.legal,reason:mend.reasonCode};
console.log(JSON.stringify(observations,null,2));
