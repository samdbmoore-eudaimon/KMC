import fs from 'node:fs';
import {freshProgress,freshModuleProgress} from '../../wm-progress.js';
import {registerOrchardPuzzleHooks} from '../../expeditions/v2/puzzles/index.js';
import {replayRun} from '../../expeditions/v2/run.js';
import {saveActiveRun} from '../../expeditions/v2/persistence.js';
registerOrchardPuzzleHooks();
const dir='docs/expeditions/v2/evidence/autonomous-recovery-20261003',record=JSON.parse(fs.readFileSync('docs/expeditions/v2/evidence/playthrough-recovery-20261003/sam-playthrough-trace.json'));
const cards=Object.fromEntries(record.initialRun.cardIds.map(id=>[id,1])),progress={...freshProgress(),cards,modules:{primary:{...freshModuleProgress(),tutorialSeen:true,...saveActiveRun({stars:0,packs:0},replayRun(record).state)}}};
const profiles=[{id:'qa-rooke',name:'eudaimon',avatar:'card:intermediate:gf_rooke',createdAt:1791020000000,activeModule:'primary'},{id:'qa-regular',name:'Quiet Blue Robin',avatar:'card:primary:pip',createdAt:1791020000000,activeModule:'primary'}];
const seed={wm_profiles_v3:profiles,'wm_prof3_qa-rooke':progress,'wm_prof3_qa-regular':{...freshProgress(),cards,modules:{primary:{...freshModuleProgress(),tutorialSeen:true}}}};
const boot=`<script>if(!localStorage.getItem('orchard-full-app-qa-initialised-v3')){const seed=${JSON.stringify(seed).replaceAll('<','\\u003c')};for(const [key,value] of Object.entries(seed))localStorage.setItem('kq:'+key,JSON.stringify(value));localStorage.setItem('orchard-full-app-qa-initialised-v3','1');}</script>`;
const html=fs.readFileSync('WallabyMaths.html','utf8');fs.writeFileSync(`${dir}/full-app-qa.html`,html.replace('<head>','<head>'+boot));
fs.writeFileSync(`${dir}/full-app-qa-fixture.json`,JSON.stringify({scope:'Unmodified rebuilt offline App with synthetic local profiles and initial collection on separate localhost port8755. No winning state injected. Saved starting record is Sam\'s retained four-command record; actual production migration runs on entry.',profiles,initialCommands:record.commands.length},null,2));
console.log('Created full App QA fixture; use only isolated localhost:8755 storage.');

