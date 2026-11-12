import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRun,reduceCommand,listCommands,hexDistance,exportRunRecord,replayRun,blueprintHash} from '../../expeditions/v2/index.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {generateFourLocksCandidate} from '../../expeditions/v2/generation/four-locks.js';
import {stationPresentation} from '../../expeditions/v2/ui/station-state.js';
registerOrchardPuzzleHooks();
const root=new URL('../../',import.meta.url),read=p=>JSON.parse(fs.readFileSync(new URL(p,root),'utf8')),snapshots=[];
const evidence='docs/expeditions/v2/evidence/player-recovery/';
for(const [id,file,prefix] of [['initial','winning-replay-trace.json',0],['active','winning-replay-trace.json',3],['three-held','winning-replay-trace.json',30],['corrupted','failed-active-enemy-trace.json',null]]){
  const record=read(evidence+file),part=prefix===null?record:{...record,commands:record.commands.slice(0,prefix),finalStateHash:null};
  const outcome=replayRun(part);assert.equal(outcome.ok,true,`${id}: ${outcome.reason}`);
  snapshots.push({id,label:`${id}: recorded controller UI trace`,state:outcome.state,record:part});
}
for(const job of ['number','shape','sustain']){
  const candidate=generateFourLocksCandidate({tier:3,seed:1,reference:true});assert.equal(candidate.status,'success');
  let state=createRun({blueprint:candidate.blueprint,cardIds:['ninefoldtree','tenthscarecrow','gossamer'],runId:`station-damage-${job}`});
  const original=blueprintHash(state.blueprint);
  const doCommand=(type,heroId,payload={})=>{const result=reduceCommand(state,{type,heroId,expectedRevision:state.revision,payload});assert.equal(result.result.legal,true,JSON.stringify({type,heroId,payload,reason:result.result.reasonCode}));state=result.state;};
  const navigate=(heroId,stationId)=>{
    const target=state.blueprint.stations.find(s=>s.id===stationId).hex;
    while(state.heroes.find(h=>h.id===heroId).ap&&hexDistance(state.heroes.find(h=>h.id===heroId).position,target)>1){
      const choices=listCommands(state,heroId).find(c=>c.type==='move').targets.filter(t=>t.legal!==false).toSorted((a,b)=>hexDistance(a.destination,target)-hexDistance(b.destination,target)||a.cost-b.cost);
      const choice=choices[0];if(!choice||hexDistance(choice.destination,target)>=hexDistance(state.heroes.find(h=>h.id===heroId).position,target))break;
      doCommand('move',heroId,{destination:choice.destination,path:null});
    }
  };
  navigate('tenthscarecrow','control');doCommand('request-hint',null,{puzzleId:state.blueprint.puzzle.id,stage:3});
  doCommand('operate','tenthscarecrow',{draftRevision:state.puzzleDraft.revision,outputIds:['bridge','shelter'],lockGroupId:null});
  for(let round=1;round<=4&&state.status==='playing';round++){
    navigate('ninefoldtree',job);navigate('gossamer','alcove');
    const h=state.heroes.find(h=>h.id==='ninefoldtree');
    if(h.ap&&hexDistance(h.position,state.blueprint.stations.find(s=>s.id===job).hex)<=1){
      if(state.stationStates[job].charge<7)doCommand('calibrate',h.id,{targetId:job});
      if(state.heroes.find(h=>h.id==='ninefoldtree').ap&&!state.holds[job]&&(job!=='shape'||stationPresentation(state,job).damaged))doCommand('hold',h.id,{targetId:job});
    }
    const g=state.heroes.find(h=>h.id==='gossamer');
    if(g.ap&&hexDistance(g.position,state.blueprint.stations.find(s=>s.id==='alcove').hex)<=1){
      if(!state.preparedAlcove)doCommand('prepare-alcove',g.id,{});
      if(state.heroes.find(h=>h.id==='gossamer').ap&&!state.holds.alcove&&job!=='shape')doCommand('hold',g.id,{targetId:'alcove'});
    }
    if(stationPresentation(state,job).cues.includes('damage')&&stationPresentation(state,job).cues.includes('working'))break;
    doCommand('end-round',null,{forecastRevision:state.revision});
  }
  if(state.status==='playing'&&!state.holds[job]&&hexDistance(state.heroes[0].position,state.blueprint.stations.find(s=>s.id===job).hex)<=1)doCommand('hold','ninefoldtree',{targetId:job});
  assert.equal(blueprintHash(state.blueprint),original);
  const record=exportRunRecord(state),verified=replayRun(record);assert.equal(verified.ok,true);
  assert.deepEqual(stationPresentation(state,job).cues,['ready','working','damage'],`real stacked state for ${job}`);
  snapshots.push({id:`damage-${job}`,label:`${job}: legal reducer state in unchanged tier3 candidate; visual fixture only, not a certified mission`,state,record});
}
const dir=new URL('docs/expeditions/v2/evidence/station-integration/',root);fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(new URL('reducer-snapshots.json',dir),JSON.stringify(snapshots,null,2));
console.log(JSON.stringify(snapshots.map(s=>({id:s.id,status:s.state.status,round:s.state.round,commands:s.record.commands.length,states:s.state.blueprint.stations.map(st=>stationPresentation(s.state,st.id))})),null,2));
