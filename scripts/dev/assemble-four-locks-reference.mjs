import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateFourLocksCandidate} from '../../expeditions/v2/generation/four-locks.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {solvePuzzle} from '../../expeditions/v2/puzzles/sudoku.js';
import {createRun,hexDistance,listCommands,reduceCommand,exportRunRecord,replayRun,stateHash,forecastEnemyPhase} from '../../expeditions/v2/index.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const out=path.join(root,'docs/expeditions/v2/references/four-locks');fs.mkdirSync(out,{recursive:true});
registerOrchardPuzzleHooks();
const candidate=generateFourLocksCandidate({tier:1,seed:1,reference:true});
if(candidate.status!=='success')throw Error(JSON.stringify(candidate));
const blueprint=candidate.blueprint;
const results=[];
for(const squad of [['bushel','furrow','pip'],['tuppence','furrow','sorrel']]) {
  let state=createRun({blueprint,cardIds:squad,runId:`four-locks-reference-${squad.join('-')}`});
  const hashes=[stateHash(state)],events=[];
  const cmd=(type,heroId,payload={})=>{
    const command={type,heroId,expectedRevision:state.revision,payload},next=reduceCommand(state,command);
    if(!next.result.legal)throw Error(`${type}: ${next.result.reasonCode} ${JSON.stringify(next.result.reasonParams)}`);
    state=next.state;hashes.push(stateHash(state));events.push({command,result:next.result});
  };
  const control=blueprint.puzzle.controlHex;
  const solved=solvePuzzle(blueprint.puzzle,{limit:1}).solutions[0].grid;
  for(let row=0;row<4;row++)for(let col=0;col<4;col++)if(state.puzzleDraft.content.grid[row][col]!==solved[row][col])cmd('edit-draft',null,{puzzleId:blueprint.puzzle.id,edit:{type:'set-cell',row,col,value:solved[row][col]}});
  cmd('edit-draft',null,{puzzleId:blueprint.puzzle.id,edit:{type:'select-outputs',outputIds:squad[0]==='bushel'?['bridge','storm']:['bridge','shelter']}});
  function approach(id,target,within=1) {
    let guard=0;
    while(state.heroes.find(h=>h.id===id).ap>0&&hexDistance(state.heroes.find(h=>h.id===id).position,target)>within&&guard++<3) {
      const hero=state.heroes.find(h=>h.id===id),moves=listCommands(state,id).find(c=>c.type==='move');
      const best=moves.targets.map(t=>({...t,d:hexDistance(t.destination,target)})).sort((a,b)=>a.d-b.d||a.cost-b.cost)[0];
      if(!best||best.d>=hexDistance(hero.position,target))return false;
      cmd('move',id,{destination:best.destination,path:null});
    }
    return hexDistance(state.heroes.find(h=>h.id===id).position,target)<=within;
  }
  for(let round=1;round<=5&&state.status==='playing';round++) {
    if(!state.puzzleValid&&approach(squad[0],control)&&state.heroes.find(h=>h.id===squad[0]).ap>0)cmd('operate',squad[0],{draftRevision:state.puzzleDraft.revision,outputIds:state.puzzleDraft.selectedOutputIds,lockGroupId:null});
    if(round===2&&squad[0]==='bushel') {
      const number=blueprint.stations.find(s=>s.id==='number'),shape=blueprint.stations.find(s=>s.id==='shape');
      const moves=listCommands(state,squad[0]).find(c=>c.type==='move').targets;
      for(const move of moves.toSorted((a,b)=>a.cost-b.cost)) {
        if(hexDistance(move.destination,number.hex)>2||hexDistance(move.destination,shape.hex)>2)continue;
        const command={type:'move',heroId:squad[0],expectedRevision:state.revision,payload:{destination:move.destination,path:null}},probe=reduceCommand(state,command);
        const charge={type:'shared-charge',heroId:squad[0],expectedRevision:probe.state.revision,payload:{allocations:[{targetId:'shape',amount:4}]}};
        if(probe.result.legal&&reduceCommand(probe.state,charge).result.legal){cmd('move',squad[0],command.payload);cmd('shared-charge',squad[0],charge.payload);break;}
      }
    }
    for(let i=0;i<3;i++) {
      const id=squad[i],job=['number','shape','sustain'][i],st=blueprint.stations.find(s=>s.id===job);
      approach(id,st.hex);
      while(state.heroes.find(h=>h.id===id).ap>0&&hexDistance(state.heroes.find(h=>h.id===id).position,st.hex)<=1&&state.stationStates[job].charge<st.capacity)cmd('calibrate',id,{targetId:job});
      if(round===2&&squad[0]==='bushel'&&i===1)while(state.heroes.find(h=>h.id===id).ap>0){const strike=listCommands(state,id).find(c=>c.type==='strike').targets.find(t=>t.legal);if(!strike)break;cmd('strike',id,strike.payload);}
    }
    for(let i=0;i<3;i++){const id=squad[i],job=['number','shape','sustain'][i],hero=state.heroes.find(h=>h.id===id),hold=listCommands(state,id).find(c=>c.type==='hold')?.targets.find(t=>t.targetId===job);if(hero.ap>0&&hold?.legal)cmd('hold',id,{targetId:job});}
    const forecast=forecastEnemyPhase(state);cmd('end-round',null,{forecastRevision:forecast.revision});
  }
  const record=exportRunRecord(state),replay=replayRun(record,{recordHashes:true});
  results.push({squad,status:state.status,round:state.round,lossReason:state.lossReason,finalHash:stateHash(state),replayOK:replay.ok,commands:record.commands.length});
  fs.writeFileSync(path.join(out,`${squad.join('-')}.json`),JSON.stringify({status:state.status,record,hashes,events},null,2)+'\n');
}
fs.writeFileSync(path.join(out,'candidate.json'),JSON.stringify(candidate,null,2)+'\n');
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({status:'reference-attempts-not-bank-certification',results},null,2)+'\n');
console.log(JSON.stringify(results,null,2));
