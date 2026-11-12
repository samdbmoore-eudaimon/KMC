import {commissionProfile,STAT_NAMES} from '../index.js';
export const SQUAD_JOBS=['number','shape','sustain'];
export function jobShortfalls(profile,tier,job,alcove=false) {
  return commissionProfile(tier,job,alcove).flatMap((need,i)=>need>(profile?.stats[i]??0)?[`${STAT_NAMES[i]} ${profile?.stats[i]??0}/${need}`]:[]);
}
export function suggestOwnedSquad(roster,owned,tier) {
  for(const alcove of [false,true]) {
    const choices=SQUAD_JOBS.map(job=>owned.filter(id=>!jobShortfalls(roster[id],tier,job,alcove&&job==='shape').length));
    for(const a of choices[0])for(const b of choices[1])for(const c of choices[2])if(new Set([a,b,c]).size===3)return {ids:[a,b,c],alcove};
  }
  return null;
}

export const JOB_TITLES={number:'power the number station',shape:'keep the bridge steady',sustain:'keep the tree alive'};
const STRONG_WORDS={0:'counting and charging power',1:'bracing and shielding',2:'locking puzzle cells and countering disruption',3:'repairing and stabilising',4:'moving fast'};

// What a hero could do at the three station jobs with printed stats alone. Never a promise of winning.
export function heroJobSummary(profile,tier) {
  return SQUAD_JOBS.map(job=>{
    const direct=jobShortfalls(profile,tier,job);
    const alcove=job==='shape'?jobShortfalls(profile,tier,job,true):null;
    return {job,title:JOB_TITLES[job],direct:!direct.length,viaAlcove:job==='shape'&&!!direct.length&&!alcove.length,shortfalls:direct,alcoveShortfalls:alcove};
  });
}
export function heroFitLine(profile,tier) {
  const summary=heroJobSummary(profile,tier),can=summary.filter(j=>j.direct).map(j=>j.title),alcove=summary.find(j=>j.viaAlcove);
  if(can.length)return `Meets the printed requirement to ${can.join(' or ')}.`+(alcove?` Can also keep the bridge steady through the prepared alcove.`:'');
  if(alcove)return 'Can keep the bridge steady only through the prepared alcove.';
  const best=summary.map(j=>({j,n:j.shortfalls.length})).sort((a,b)=>a.n-b.n)[0].j;
  return `No station job yet. Closest: ${best.title} (${best.shortfalls.join(' · ')}). Still useful for fighting, protecting and carrying power.`;
}
export function heroRoleLine(profile) {
  const order=profile.stats.map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v||a.i-b.i);
  return `${profile.roleName}: best at ${STRONG_WORDS[order[0].i]}.`;
}
export const PRACTICE_TEXT='A practice attempt uses exactly the same rules. A hero below a job\'s printed stats cannot Hold that station, so the mission can only be won if another hero of yours meets it (or you use the alcove for the bridge job). Nothing is lowered and nothing is chosen for you.';
