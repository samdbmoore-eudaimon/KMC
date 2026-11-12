import fs from 'node:fs';
import {createRun,reduceCommand,forecastEnemyPhase,orchardRosterProfiles,commissionProfile} from '../../expeditions/v2/index.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {nextStep,controlDistance} from '../../expeditions/v2/ui/next-step.js';
import {intentText,eventText,hazardText} from '../../expeditions/v2/ui/feedback.js';
registerOrchardPuzzleHooks();
const root=new URL('../../docs/expeditions/v2/evidence/code-overnight-20261004/',import.meta.url),findings=[],runs=[];
for(const file of fs.readdirSync(root).filter(name=>name.endsWith('-browser-win-record.json'))){
  const record=JSON.parse(fs.readFileSync(new URL(file,root))),local=[];
  let state=createRun(record.initialRun);
  for(let index=0;index<record.commands.length;index++){
    const location={file,commandIndex:index,revision:state.revision,round:state.round,nextCommand:record.commands[index].type};
    try{
      const guide=nextStep(state);
      if(!guide.title?.trim()||!guide.text?.trim())local.push({...location,kind:'empty-next-step',guide});
      if(guide.id==='walk-to-control'&&!state.heroes.some(hero=>!hero.defeated&&hero.ap>0))local.push({...location,kind:'walk-advice-with-no-actions',guide,nearest:controlDistance(state).nearest});
      if(guide.id==='hold'&&guide.focus==='shape'&&state.preparedAlcove){
        const need=commissionProfile(state.blueprint.tier,'shape',false);
        if(!state.heroes.some(hero=>!hero.defeated&&need.every((value,i)=>state.profiles[hero.id].stats[i]>=value)))local.push({...location,kind:'standard-shape-advice-when-only-alcove-qualifies',guide});
      }
    }catch(error){local.push({...location,kind:'next-step-error',message:error.message});}
    if(record.commands[index].type==='end-round'){
      const forecast=forecastEnemyPhase(state);
      const copy=[...forecast.intents.map(item=>({kind:'intent',item,text:intentText(item,state)})),...forecast.events.map(item=>({kind:'event',item,text:eventText(item,state)})),...forecast.hazards.map(item=>({kind:'hazard',item,text:hazardText(item,state)}))];
      for(const entry of copy){
        if(!entry.text?.trim()||/\[object Object\]|undefined|\.\./.test(entry.text))local.push({...location,...entry,kind:'malformed-phase-copy'});
        if(entry.item.type==='shelter-suppressed'&&entry.text.startsWith('shelter suppressed'))local.push({...location,...entry,kind:'generic-shelter-suppression'});
        if(entry.kind==='intent'&&entry.item.puzzleChange&&!entry.item.puzzleChange.applied&&entry.text.includes('; changes '))local.push({...location,...entry,kind:'unapplied-puzzle-change-labelled-changes'});
      }
    }
    const reduced=reduceCommand(state,record.commands[index]);
    if(!reduced.result.legal)throw Error(`${file} command${index}: ${JSON.stringify(reduced.result)}`);
    state=reduced.state;
  }
  findings.push(...local);runs.push({file,commands:record.commands.length,status:state.status,findings:local.length});
}
const profiles=orchardRosterProfiles(),alternateTeam=['warden','longshadow','cascade'];
const staticJobs=Object.fromEntries(['number','shape','sustain'].map(job=>{const need=commissionProfile(5,job,job==='shape');return [job,{need,cards:alternateTeam.map(id=>({id,stats:profiles[id].stats,shortfalls:need.flatMap((value,i)=>profiles[id].stats[i]<value?[{statIndex:i,required:value,actual:profiles[id].stats[i]}]:[])}))}];}));
const report={provenance:'Read-only production copy functions over actual browser-record reducer replays; no rendered-UI or certification claim',runs,findings,fourTier5AlternateStaticJobs:staticJobs};
fs.writeFileSync(new URL('browser-ui-copy-audit.json',root),JSON.stringify(report,null,2));
console.log(JSON.stringify({runs:runs.length,findings:findings.length,kinds:Object.fromEntries([...new Set(findings.map(item=>item.kind))].map(kind=>[kind,findings.filter(item=>item.kind===kind).length])),fourTier5AlternateStaticJobs:staticJobs}));
