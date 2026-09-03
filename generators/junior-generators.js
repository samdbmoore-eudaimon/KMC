// generators/junior-generators.js — Junior module: JUNIOR_G, bosses, cards, and helpers.
import {
  T, DIFF_LABELS, rand, pick, shuffle, gcd, buildMC, buildMCStr, gbp, deg,
  simplifyFrac, sup, svgBox, txt, computePrimaryType, normaliseJoeyCardStats,
  JUNIOR_TOPICS, JUNIOR_DEEP_TOPICS, JUNIOR_CONCEPTS,
  JUNIOR_NAMES_COMMON, JUNIOR_NAMES_RARE, JUNIOR_NAMES_EPIC, JUNIOR_NAMES_LEGENDARY,
  NAMES, namePool, _ND, _NL, NP, N1, DAYS, MONTHS31, SL, SC, SR, ST, dateDigitScenario,
  ACTIVE_MODULE_KEY, TOPICS, DEEP_TOPICS, G,
  setND, setNL, topicMeta, resolvePrereqInfo, pickStructure,
  examKindFor, EXAM_PASS_MARKS, RARITY, CARD_CLASS, CARDS
} from './gen-shared.js';
import { ADVENTURES } from '../kq-content.js';
import { installJuniorCurriculumGenerators } from './junior-curriculum-overlay.js';

export const JUNIOR_G = {

  /* G1 — multi-expression comparison (BIDMAS). The "fix the sum" scenario (which used to be
     its own thin topic, arithCorrect) lives here now as a third d3/d4 scenario — same
     "evaluate carefully under BIDMAS" skill, just a different question shape. Its expression
     evaluator is rewritten here: the original had a latent bug (an "approx" hack) that
     mis-evaluated "a − b×c" as bc−a instead of a−bc about 1 time in 9. */
  multiExpr(d) {
    const nm = N1();
    if (d <= 2) {
      // Retry until the target extreme is achieved by exactly one expression — when a===c,
      // (a+b)×c and a×(b+c) are forced to the same value (both expand to ac+bc), so the
      // "largest"/"smallest" would otherwise have two textually-different but tied answers.
      let a,b,c,exprs,vals,target,tries0=0;
      do {
        a=rand(2,6);b=rand(2,6);c=rand(2,6);
        exprs = [`${a}+${b}×${c}`, `(${a}+${b})×${c}`, `${a}×${b}+${c}`, `${a}×(${b}+${c})`, `${a}+${b}+${c}`];
        vals = [a+b*c,(a+b)*c,a*b+c,a*(b+c),a+b+c];
        target = d===1 ? Math.max(...vals) : Math.min(...vals);
        tries0++;
      } while (vals.filter(v=>v===target).length!==1 && tries0<300);
      const correct = exprs[vals.indexOf(target)];
      const opts = shuffle(exprs);
      return { q:`${nm} works out five expressions: ${exprs.join(",  ")}. Which gives the ${d===1?"largest":"smallest"} value?`, options:opts, correctIndex:opts.indexOf(correct), solution:[`Evaluate each using BIDMAS.`, `${exprs.map((e,i)=>e+" = "+vals[i]).join(";  ")}.`, `The ${d===1?"largest":"smallest"} is ${target}, from ${correct}.`] };
    }
    // d3/d4: four scenarios sharing the same skill (careful BIDMAS evaluation), picked at random
    const evalExpr=(x,y,z,o1,o2)=>{ const app=(p,u,v)=>p==="+"?u+v:p==="-"?u-v:u*v;
      if (o1==="×"&&o2==="×") return x*y*z;
      if (o1==="×") return app(o2,x*y,z);
      if (o2==="×") return app(o1,x,y*z);
      return app(o2,app(o1,x,y),z); };
    const branch = rand(0,3);
    if (branch === 0) {
      // (a) how many distinct values
      const a=rand(2,5);
      const exprs4 = [`${a}+${a}`,`${a}×${a}`,`${a}-${a}`,`${a}÷${a}`,`${a}${a}`];
      const vals4 = [2*a,a*a,0,1,a*10+a];
      const distinct = new Set(vals4).size;
      const { options, correctIndex } = buildMC(distinct,[distinct-1,distinct+1,5,2]);
      return { q:`When the five expressions ${exprs4.join(",  ")} are each simplified, how many different values are obtained?`, options, correctIndex, solution:[`Evaluate each: ${exprs4.map((e,i)=>e+"="+vals4[i]).join("; ")}.`, `Count distinct values: ${[...new Set(vals4)].join(", ")}.`, `That gives ${distinct} different values.`] };
    }
    if (branch === 1) {
      // (b) fix the sum: a op1 b op2 c is wrong; increasing one number by 1 makes it correct.
      // Needs exactly one number to work — with no × at all (op1 and op2 both +/-), every
      // number's +1 shifts the total by exactly ±1 at once, so all three "fix" it and the
      // question would have several correct answers instead of one. Re-roll the operators
      // too when that happens, not just the numbers.
      const ops=["+","-","×"];
      let a2,b2,c2,op1,op2,trueVal,claimedVal,correctIdx2,tries=0;
      do {
        op1=pick(ops);op2=pick(ops);
        a2=rand(2,9+d*2);b2=rand(2,9+d*2);c2=rand(2,9+d*2);
        const base=evalExpr(a2,b2,c2,op1,op2);
        const cands=[[a2+1,b2,c2],[a2,b2+1,c2],[a2,b2,c2+1]];
        const results=cands.map(([x,y,z])=>evalExpr(x,y,z,op1,op2));
        const hits=results.map(v=>v===base+1||v===base-1);
        // base IS the correctly-evaluated (true) value of the ORIGINAL numbers — it was
        // wrongly asserted to be the "incorrect" shown total, which made the question a false
        // premise (a correct calculation labelled wrong, with no actual target ever given).
        // The genuinely wrong "claimed" total is what you get by bumping the identified number
        // by 1 — that's the value the question should ask the student to reach.
        if(hits.filter(Boolean).length===1){ trueVal=base; correctIdx2=hits.indexOf(true); claimedVal=results[correctIdx2]; break; }
        tries++;
      } while(tries<300);
      if(tries>=300) return G.multiExpr(d);
      const vals2=[a2,b2,c2];
      const {options,correctIndex}=buildMC(vals2[correctIdx2],[...vals2.filter((_,i)=>i!==correctIdx2),vals2[correctIdx2]+2]);
      return { q:`${a2} ${op1} ${b2} ${op2} ${c2} actually equals ${trueVal}, but it was WRITTEN DOWN as equalling ${claimedVal}. Which number should be increased by 1 to make the calculation genuinely equal ${claimedVal}?`, options, correctIndex, solution:[`Try increasing each number in turn, working out the expression under BIDMAS each time (multiplication before addition/subtraction).`, `Increasing the ${["first","second","third"][correctIdx2]} number (${vals2[correctIdx2]}) by 1 gives a calculation equal to ${claimedVal}, matching what was written down.`] };
    }
    if (branch === 2) {
      // (c) fix the sum a DIFFERENT way: same wrong calculation, but this time an OPERATOR
      // is wrong, not a number — a genuinely different diagnostic skill from branch (b).
      // Uses 4 numbers / 3 operator-slots (not 3/2) so there are 3 positions x 2 alternate
      // ops each = 6 possible answer-combos, leaving 5 genuine decoys — with only 3 numbers/
      // 2 slots there are just 4 combos total, too few for 4 real decoys (this bug used to
      // make buildMCStr's padding fallback leak a fake "answer+·N" option into the UI).
      const evalSeq2=(nums,opsArr)=>{ let ns=[...nums],os=[...opsArr]; let i=0;
        while(i<os.length){ if(os[i]==="×"){ ns[i]=ns[i]*ns[i+1]; ns.splice(i+1,1); os.splice(i,1);} else i++; }
        let result=ns[0]; for(let j=0;j<os.length;j++) result = os[j]==="+"?result+ns[j+1]:result-ns[j+1]; return result; };
      const ops=["+","-","×"];
      let nums5,opsArr,base,hit,tries=0;
      do {
        nums5=[rand(2,9),rand(2,9),rand(2,9),rand(2,9)];
        opsArr=[pick(ops),pick(ops),pick(ops)];
        base=evalSeq2(nums5,opsArr);
        const alts=[];
        for (let pos=0;pos<3;pos++) for (const o of ops) if (o!==opsArr[pos]) {
          const testOps=[...opsArr]; testOps[pos]=o;
          alts.push({pos,op:o,v:evalSeq2(nums5,testOps)});
        }
        const hits = alts.filter(x=>x.v===base+1||x.v===base-1);
        hit = hits.length===1 ? hits[0] : null;
        tries++;
      } while(!hit && tries<300);
      if(tries>=300) return G.multiExpr(d);
      const posNames=["first","second","third"];
      const posLabel = posNames[hit.pos];
      const correctAns = `${posLabel} operator, changed to ${hit.op}`;
      const allCombos=[];
      for (let pos=0;pos<3;pos++) for (const o of ops) if (o!==opsArr[pos]) allCombos.push(`${posNames[pos]} operator, changed to ${o}`);
      const decoys = allCombos.filter(c=>c!==correctAns);
      const {options,correctIndex}=buildMCStr(correctAns, shuffle(decoys).slice(0,4));
      const exprStr = `${nums5[0]} ${opsArr[0]} ${nums5[1]} ${opsArr[1]} ${nums5[2]} ${opsArr[2]} ${nums5[3]}`;
      // base IS the correctly-evaluated (true) value of exprStr — asserting THAT is "incorrect"
      // made the question a false premise. hit.v (base±1) is the genuinely wrong "claimed"
      // total that changing one operator would actually reach.
      return { q:`${exprStr} actually equals ${base}, but it was WRITTEN DOWN as equalling ${hit.v}. If exactly one OPERATOR is changed (the numbers stay the same), which operator should change, and to what, to make the calculation genuinely equal ${hit.v}?`, options, correctIndex, solution:[`Try changing each operator in turn to each alternative, working out the expression under BIDMAS each time.`, `Changing the ${posLabel} operator to ${hit.op} gives a calculation that equals ${hit.v}, matching what was written down.`] };
    }
    // (d) insert one pair of brackets to hit a target value — tests that brackets override BIDMAS order
    const evalSeq=(nums,opsArr)=>{ let ns=[...nums],os=[...opsArr]; let i=0;
      while(i<os.length){ if(os[i]==="×"){ ns[i]=ns[i]*ns[i+1]; ns.splice(i+1,1); os.splice(i,1);} else i++; }
      let result=ns[0]; for(let j=0;j<os.length;j++) result = os[j]==="+"?result+ns[j+1]:result-ns[j+1]; return result; };
    const bracketAt=(nums,opsArr,pos)=>{ const apply=(x,o,y)=>o==="+"?x+y:o==="-"?x-y:x*y;
      const val=apply(nums[pos],opsArr[pos],nums[pos+1]);
      return evalSeq([...nums.slice(0,pos),val,...nums.slice(pos+2)], [...opsArr.slice(0,pos),...opsArr.slice(pos+1)]); };
    const bracketPairs=(nums,opsArr)=>{ const apply=(x,o,y)=>o==="+"?x+y:o==="-"?x-y:x*y;
      const L=apply(nums[0],opsArr[0],nums[1]), R=apply(nums[2],opsArr[2],nums[3]);
      return apply(L,opsArr[1],R); };
    const opsPool=["+","-","×"];
    // 4 possible single/double bracket placements (3 single-pair positions + one
    // double-pair "(a op b) op (c op d)") give 4 non-plain values, so there are always
    // 3 genuine decoys left after the correct one plus the plain (no-bracket) value —
    // exactly the 4 decoys buildMCStr needs, with no risk of its padding fallback firing.
    let nums4,ops3,plain,bracketVals,uniqueTargetPos,tries3=0;
    do {
      nums4=[rand(2,9),rand(2,9),rand(2,9),rand(2,9)];
      ops3=[pick(opsPool),pick(opsPool),pick(opsPool)];
      plain=evalSeq(nums4,ops3);
      bracketVals=[bracketAt(nums4,ops3,0), bracketAt(nums4,ops3,1), bracketAt(nums4,ops3,2), bracketPairs(nums4,ops3)];
      const allVals=[plain,...bracketVals];
      const counts=allVals.map(v=>allVals.filter(x=>x===v).length);
      uniqueTargetPos = bracketVals.findIndex((v,i)=>counts[i+1]===1 && v!==plain);
      tries3++;
    } while(uniqueTargetPos===-1 && tries3<300);
    if (tries3>=300) return G.multiExpr(d);
    const [n1,n2,n3,n4]=nums4, [o1,o2,o3]=ops3;
    const target=bracketVals[uniqueTargetPos];
    const bracketLabels=[`(${n1} ${o1} ${n2}) ${o2} ${n3} ${o3} ${n4}`, `${n1} ${o1} (${n2} ${o2} ${n3}) ${o3} ${n4}`, `${n1} ${o1} ${n2} ${o2} (${n3} ${o3} ${n4})`, `(${n1} ${o1} ${n2}) ${o2} (${n3} ${o3} ${n4})`];
    const correctLabel=bracketLabels[uniqueTargetPos];
    const decoyLabels=bracketLabels.filter((_,i)=>i!==uniqueTargetPos).concat([`${n1} ${o1} ${n2} ${o2} ${n3} ${o3} ${n4} (no brackets)`]);
    const {options,correctIndex}=buildMCStr(correctLabel, decoyLabels);
    return { q:`${n1} ${o1} ${n2} ${o2} ${n3} ${o3} ${n4} equals ${plain} with no brackets. Where should brackets go to make the expression equal ${target} instead?`, options, correctIndex, solution:[`With no brackets (BIDMAS order): ${n1} ${o1} ${n2} ${o2} ${n3} ${o3} ${n4} = ${plain}.`, `Try each bracket placement: ${bracketLabels.map((l,i)=>l+" = "+bracketVals[i]).join("; ")}.`, `${correctLabel} = ${target}, which is the one that matches.`] };
  },

  /* G2 — counting integers with a digit property */
  countIntegers(d) {
    if (d <= 1) {
      // two-digit numbers where one digit is twice the other
      const pairs = [];
      for(let n=10;n<=99;n++){ const t=Math.floor(n/10),u=n%10; if((t===2*u&&u>0)||(u===2*t&&t>0)) pairs.push(n); }
      const ans = pairs.length;
      const { options, correctIndex } = buildMC(ans,[6,8,10,14]);
      return { q:`How many two-digit numbers have the property that one digit is exactly twice the other digit?`, options, correctIndex, solution:[`Try systematically: if tens digit t = 2×units u, then (t,u) can be (2,1),(4,2),(6,3),(8,4).`, `If units = 2×tens: (1,2),(2,4),(3,6),(4,8).`, `That's 8 numbers each way: ${ans} total.`] };
    }
    if (d <= 2) {
      // integers in a range divisible by their units digit
      const lo=rand(2,4)*10, hi=lo+9;
      let count=0; const hits=[];
      for(let n=lo;n<=hi;n++){ const u=n%10; if(u>0&&n%u===0){ count++; hits.push(n); } }
      const { options, correctIndex } = buildMC(count,[count-1,count+1,count+2,count-2].filter(x=>x>=0));
      return { q:`How many integers between ${lo} and ${hi} are exactly divisible by their units digit?`, options, correctIndex, solution:[`Check each: ${hits.map(n=>`${n}÷${n%10}=${n/(n%10)}`).join(", ")}.`, `That's ${count} integers.`] };
    }
    if (d === 3) {
      if (pick([true,false])) {
        // pairs of 2-digit numbers differing by a fixed amount
        const diff = pick([20,30,40,50]);
        let count=0;
        for(let a=10;a<=99;a++) if(a+diff<=99) count++;
        const { options, correctIndex } = buildMC(count,[count-5,count+5,count-10,count+10]);
        return { q:`How many pairs of two-digit positive integers have a difference of exactly ${diff}?`, options, correctIndex, solution:[`The smaller number a can range from 10 to ${99-diff}.`, `That's ${99-diff}-10+1 = ${count} pairs.`] };
      }
      // (e) two-digit numbers whose digits multiply to a target product — a genuinely
      // different property from digit-sum/divisibility/difference (tests factor pairs).
      const target = pick([6,8,9,10,12,15,16,18,20,24]);
      let count2=0; const hits2=[];
      for(let n=10;n<=99;n++){ const t=Math.floor(n/10), u=n%10; if(t*u===target){ count2++; hits2.push(n); } }
      const { options, correctIndex } = buildMC(count2,[count2+1,count2>1?count2-1:count2+2,count2+2,count2-2].filter(x=>x>=0));
      return { q:`How many two-digit numbers have digits whose product is exactly ${target}?`, options, correctIndex, solution:[`Find every pair of digits (tens, units) that multiply to ${target}: ${hits2.map(n=>`${Math.floor(n/10)}×${n%10}`).join(", ")}.`, `That gives the numbers ${hits2.join(", ")} — ${count2} in total.`] };
    }
    // d4: 3-digit numbers where subtracting 297 reverses digits
    // pqr - 297 = rqp → 99(p-r)=297 → p-r=3, so p∈{4..9}, r=p-3, q can be anything 0-9
    const count = 6*10; // p in 4..9 (6 choices), q in 0..9 (10 choices)
    const { options, correctIndex } = buildMC(count,[30,40,50,70]);
    return { q:`How many three-digit numbers give a second three-digit number (which is the first reversed) when 297 is subtracted?`, options, correctIndex, solution:[`If 'pqr' − 297 = 'rqp', then 100p+10q+r−297 = 100r+10q+p.`, `This gives 99(p−r) = 297, so p−r = 3.`, `p ranges from 4 to 9 (6 values), q is any digit (10 values): 6×10 = ${count}.`] };
  },

  /* G3 — modular/cyclic arithmetic */
  modular(d) {
    if (d <= 1) {
      const total = rand(50,200); const n = N1();
      const days = DAYS;
      const start = rand(0,6);
      const ans = DAYS[(start+total)%7];
      const { options, correctIndex } = buildMCStr(ans, shuffle(DAYS.filter(x=>x!==ans)).slice(0,4));
      return { q:`${n} goes on holiday for ${total} days starting on a ${DAYS[start]}. On which day does the holiday end?`, options, correctIndex, solution:[`${total} ÷ 7 = ${Math.floor(total/7)} weeks and ${total%7} days remainder.`, `Start: ${DAYS[start]}. Count on ${total%7} days.`, `The holiday ends on a ${ans}.`] };
    }
    if (d <= 2) {
      const n = N1(); const hrs = pick([100, 200, 500, 1000, 2021, 2024]);
      const start = rand(0, 6); const startH = rand(8, 20);
      // Add hrs hours to (start day, startH:00), accounting for BOTH the day
      // rollover and the leftover hours (which can roll the day over once more).
      const totalMins = startH * 60 + hrs * 60;
      const dayRoll = Math.floor(totalMins / (24 * 60));
      const remMins = totalMins % (24 * 60);
      const endDay = (start + dayRoll) % 7;
      const endH = Math.floor(remMins / 60);
      const ans = `${DAYS[endDay]} ${String(endH).padStart(2, "0")}:00`;
      const wrongDayOnly = `${DAYS[(start + hrs) % 7]} ${String(startH).padStart(2, "0")}:00`; // the classic mistake
      const decoys = [
        `${DAYS[(endDay + 1) % 7]} ${String(endH).padStart(2, "0")}:00`,
        `${DAYS[(endDay + 6) % 7]} ${String(endH).padStart(2, "0")}:00`,
        `${DAYS[endDay]} ${String((endH + 1) % 24).padStart(2, "0")}:00`,
        wrongDayOnly,
      ].filter(x => x !== ans);
      const { options, correctIndex } = buildMCStr(ans, decoys);
      const days = Math.floor(hrs / 24), leftover = hrs % 24;
      return { q: `It is ${String(startH).padStart(2, "0")}:00 on a ${DAYS[start]}. What day and time will it be exactly ${hrs} hours later?`, options, correctIndex, solution: [`${hrs} hours = ${days} whole days and ${leftover} hours left over.`, `${days} days = ${Math.floor(days / 7)} weeks and ${days % 7} extra days, landing on ${DAYS[(start + days) % 7]} at ${String(startH).padStart(2, "0")}:00.`, `Now add the leftover ${leftover} hours: ${String(startH).padStart(2, "0")}:00 + ${leftover}h = ${ans}${endDay !== (start + days) % 7 ? " (the extra hours roll past midnight into the next day)" : ""}.`] };
    }
    const branch2 = rand(0,2);
    if (branch2 === 0) {
      // coloured integers by position mod 4
      const cols = ["red", "blue", "yellow", "green"];
      // Colour c (0..3) means the integer ≡ (c+1) (mod 4). So:
      //   red = 1 mod 4, blue = 2 mod 4, yellow = 3 mod 4, green = 0 mod 4.
      const pickA = rand(0, 3), pickB = rand(0, 3);
      const rA = (pickA + 1) % 4; // residue of a 'pickA'-coloured number
      const rB = (pickB + 1) % 4;
      const sumRes = (rA + rB) % 4;
      const ansColIdx = (sumRes + 3) % 4; // invert residue→colour map (residue r ↔ colour (r+3)%4)
      const ansCol = cols[ansColIdx];
      // only 4 colours exist total, so "the other 3" alone isn't enough for buildMCStr's 4
      // decoys — add a genuine wrong-reasoning option rather than let it fall back to filler.
      const { options, correctIndex } = buildMCStr(ansCol, [...cols.filter(c => c !== ansCol), "It could be any colour depending on the actual numbers chosen"]);
      return { q: `The integer 1, and every fourth integer after it, is coloured ${cols[0]}; 2 and every fourth after it is ${cols[1]}; 3 and every fourth is ${cols[2]}; 4 and every fourth is ${cols[3]}. ${N1()} adds a ${cols[pickA]} number to a ${cols[pickB]} number. What colour is the result?`, options, correctIndex, solution: [`${cols[pickA]} numbers are ≡ ${rA} (mod 4); ${cols[pickB]} numbers are ≡ ${rB} (mod 4).`, `Their sum is ≡ ${rA} + ${rB} = ${rA + rB} ≡ ${sumRes} (mod 4).`, `A number ≡ ${sumRes} (mod 4) is coloured ${ansCol}.`] };
    }
    if (branch2 === 1) {
      // (d) units digit of a large power — a genuinely different modular-cycle skill:
      // finding the CYCLE LENGTH of repeated multiplication, not adding a fixed step.
      const base = rand(2,9); const exp = rand(15,40);
      const cycle = []; let u = base % 10; const seenU = new Map();
      for (let i=1;i<=12;i++){ if (seenU.has(u)) { break; } seenU.set(u,i); cycle.push(u); u=(u*base)%10; }
      const cycleLen = cycle.length;
      const posInCycle = ((exp-1) % cycleLen);
      const ans = cycle[posInCycle];
      const nm = N1();
      const { options, correctIndex } = buildMC(ans, [0,1,base%10,(ans+5)%10].filter(x=>x!==ans));
      return { q: `${nm} works out the units digit of ${base}^${exp} (that is, ${base} multiplied by itself ${exp} times). What is the units digit?`, options, correctIndex, solution: [`The units digit of powers of ${base} repeats in a cycle: ${cycle.join(", ")} (length ${cycleLen}), then it repeats.`, `${exp} falls at position ${posInCycle+1} in that repeating cycle (since (${exp}-1) mod ${cycleLen} = ${posInCycle}).`, `The units digit of ${base}^${exp} is ${ans}.`] };
    }
    // (e) circular track, fixed step repeated many times — the same modular idea via
    // a spinner/track context rather than days or colours.
    const positions = pick([8,10,12]);
    const start = rand(1,positions); const step = rand(2,positions-1); const jumps = rand(20,80);
    const endPos = (((start-1) + step*jumps) % positions) + 1;
    const nm2 = N1();
    const { options, correctIndex } = buildMC(endPos, [endPos+1>positions?1:endPos+1, endPos-1<1?positions:endPos-1, ((start-1+step*(jumps-1))%positions)+1].filter(x=>x!==endPos));
    return { q: `A spinner has positions numbered 1 to ${positions} arranged in a circle. ${nm2} starts at position ${start} and moves forward ${step} positions at a time, doing this ${jumps} times in total. Which position does ${nm2} end on?`, options, correctIndex, solution: [`Total forward movement: ${step} × ${jumps} = ${step*jumps} positions.`, `Since there are ${positions} positions in the circle, only the remainder after dividing by ${positions} matters: ${step*jumps} mod ${positions} = ${(step*jumps)%positions}.`, `Starting at ${start} and moving ${(step*jumps)%positions} positions forward around the circle lands on position ${endPos}.`] };
  },

  /* G4 — unusual fraction arithmetic */
  fractionUnusual(d) {
    const [nm] = NP();
    if (d <= 2) {
      const closures = [
        // (a) which fraction is closest to a whole-number target — freshly randomised each time
        () => {
          const target = pick([0, 1, 2, 3]);
          let fracs, diffs, minIdx, tries = 0;
          do {
            const dens = shuffle([4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 5);
            const winnerAt = rand(0, 4);
            fracs = dens.map((den, i) => {
              const mag = i === winnerAt ? 1 : rand(2, 4);
              const sign = Math.random() < 0.5 ? 1 : -1;
              let num = target * den + sign * mag;
              if (num < 0) num = target * den + mag;
              return { n: num, d: den };
            });
            diffs = fracs.map(f => Math.abs(f.n / f.d - target));
            minIdx = diffs.indexOf(Math.min(...diffs));
            tries++;
          } while ((diffs.filter(x => Math.abs(x - diffs[minIdx]) < 1e-9).length > 1
              || new Set(fracs.map(f => `${f.n}/${f.d}`)).size < 5) && tries < 25);
          const ans = `${fracs[minIdx].n}/${fracs[minIdx].d}`;
          const opts = fracs.map(f => `${f.n}/${f.d}`);
          return { q:`Which of these fractions is closest to ${target}? ${opts.join("   ")}`, options:opts, correctIndex:minIdx, solution:[`Convert each to a decimal and find the distance from ${target}.`, `${fracs.map((f,i)=>`${f.n}/${f.d} ≈ ${(f.n/f.d).toFixed(3)}, distance ${diffs[i].toFixed(3)}`).join("; ")}.`, `Smallest distance: ${ans}.`] };
        },
        // (b) the odd one out — four fractions are equivalent, one looks similar but isn't
        () => {
          const baseN = rand(1, 4), baseD = rand(baseN + 2, baseN + 6);
          const g0 = gcd(baseN, baseD);
          const simpN = baseN / g0, simpD = baseD / g0;
          const mults = shuffle([2, 3, 4, 5, 6]);
          const equivFracs = mults.map(m => `${simpN * m}/${simpD * m}`);
          const oddMult = pick(mults);
          const oddIdx = mults.indexOf(oddMult);
          const bump = pick([1, -1]);
          const oddFrac = `${simpN * oddMult + bump}/${simpD * oddMult}`;
          const opts = [...equivFracs]; opts[oddIdx] = oddFrac;
          const correctIndex = oddIdx;
          return { q:`Four of these fractions are equal in value, and one is not. Which one is the odd one out? ${opts.join("   ")}`, options: opts, correctIndex, solution:[`Every fraction should simplify to ${simpN}/${simpD}.`, `${opts.map((o,i)=>{const [n,dd]=o.split("/").map(Number); const gg=gcd(n,dd); return `${o} = ${n/gg}/${dd/gg}`;}).join("; ")}.`, `${opts[correctIndex]} is the only one that does not simplify to ${simpN}/${simpD}.`] };
        },
        // (c) different-sized wholes — a bigger fraction of a smaller whole isn't always a bigger amount
        () => {
          const [n1, n2] = NP();
          const fracPool = [[1,2],[1,3],[1,4],[1,6],[1,8],[2,3],[3,4],[5,6],[5,8],[3,8]];
          const wholePool = [120, 240, 360, 480, 600];
          const [fn1, fd1] = pick(fracPool);
          let f2; do { f2 = pick(fracPool); } while (f2[0] === fn1 && f2[1] === fd1);
          const [fn2, fd2] = f2;
          let w1, w2; do { w1 = pick(wholePool); w2 = pick(wholePool); } while (w1 === w2);
          const amt1 = w1 * fn1 / fd1, amt2 = w2 * fn2 / fd2;
          if (amt1 === amt2) return null;
          const winnerAmt = Math.max(amt1, amt2);
          const winnerName = amt1 > amt2 ? n1 : n2;
          const { options, correctIndex } = buildMC(winnerAmt, [Math.min(amt1, amt2), winnerAmt + 20, winnerAmt - 20, w1 > w2 ? w1 : w2].filter(x => x !== winnerAmt));
          return { q:`${n1} has a ${w1} g chocolate bar and eats ${fn1}/${fd1} of it. ${n2} has a ${w2} g chocolate bar and eats ${fn2}/${fd2} of it. Whoever eats MORE chocolate wins a prize. How many grams does the winner eat?`, options, correctIndex, solution:[`${n1} eats ${fn1}/${fd1} × ${w1} = ${amt1} g. ${n2} eats ${fn2}/${fd2} × ${w2} = ${amt2} g.`, `${winnerName} eats more (${winnerAmt} g)${(fn1/fd1 > fn2/fd2) === (amt1<amt2) ? " — even though their fraction of the bar was smaller, their bar was the bigger one." : "."}`] };
        },
      ];
      let result = null, guard = 0;
      while (!result && guard < 10) { guard++; result = pick(closures)(); }
      return result;
    }
    if (d === 3) {
      // a/b + c/d - e/f where denominators form a pattern
      const a=rand(3,8),b=a-1,c=rand(3,6),d2=c-1,e=rand(2,5),f=e-1;
      const val = a/b+c/d2-e/f;
      const valRat = a*d2*f + c*b*f - e*b*d2;
      const den = b*d2*f; const g=gcd(Math.abs(valRat),den);
      const sn=valRat/g,sd=den/g;
      const ans = sd===1?`${sn}`:`${sn}/${sd}`;
      // when sd===1 (the answer is a whole number), Math.round(val*10)/10 collapses to that same
      // whole number and silently collides with `ans` — dedupe + guard rather than let it happen.
      const dsCandidates=[`${sn+1}/${sd}`,`${sn}/${sd+1}`,`${Math.round(val*10)/10}`,`${sn-1}/${sd}`,`${sn+1}`,`${sn-1}`];
      const ds=[...new Set(dsCandidates)].filter(s=>s!==ans).slice(0,4);
      if(ds.length<4) return G.fractionUnusual(3);
      const {options,correctIndex} = buildMCStr(ans,ds);
      return { q:`Work out:   ${a}/${b} + ${c}/${d2} − ${e}/${f}`, options, correctIndex, solution:[`Common denominator: ${b}×${d2}×${f} = ${den}.`, `= ${a*d2*f}/${den} + ${c*b*f}/${den} − ${e*b*d2}/${den}.`, `= ${valRat}/${den}${sn!==valRat?` = ${ans}`:""}.`] };
    }
    // d4: Goldilocks-style: eaten 3/7 of total across 3 equal bowls, what fraction of bowl 2 is eaten?
    const p=rand(2,5),q=rand(p+1,p+4); // eaten p/q of total
    // after bowl 1 (full) and p/q of total eaten: p/q = 1/3 + x/3 where x is fraction of bowl 2
    // p/q - 1/3 = x/3 → x = 3p/q - 1
    const num3p=3*p,x_num=3*p-q,x_den=q;
    const g=gcd(Math.abs(x_num),x_den); const fNum=x_num/g,fDen=x_den/g;
    const ans2 = x_num<=0?"0":(fDen===1?`${fNum}`:`${fNum}/${fDen}`);
    if(x_num<=0||x_num>=q) return G.fractionUnusual(4);
    // 6-candidate pool, deduped and filtered against the answer, then sliced to 4 — the fixed
    // "1/3" candidate can collide with fNum/(fDen+1) when fDen===2 (both become "1/3"), which
    // used to leave only 3 real decoys and trigger buildMCStr's "correct·N" filler fallback.
    const ds2Candidates=[`${p}/${q}`,`1/3`,`${fNum+1}/${fDen}`,`${fNum}/${fDen+1}`,`${fDen-fNum}/${fDen}`,`${fNum+1}/${fDen+1}`];
    const ds2=[...new Set(ds2Candidates)].filter(s=>s!==ans2).slice(0,4);
    if(ds2.length<4) return G.fractionUnusual(4);
    const {options,correctIndex} = buildMCStr(ans2,ds2);
    return { q:`${nm} eats three equal-sized bowls of soup one after another. When ${nm} has eaten ${p}/${q} of the total, what fraction of the second bowl has been eaten?`, options, correctIndex, solution:[`Each bowl is 1/3 of the total. After bowl 1: 1/3 eaten.`, `Remaining to reach ${p}/${q}: ${p}/${q} − 1/3 = ${3*p-q}/${3*q} of total.`, `As a fraction of bowl 2: (${3*p-q}/${3*q}) ÷ (1/3) = ${ans2}.`] };
  },

  /* G5 — cryptarithmetic / digit algebra */
  cryptarith(d) {
    if (d <= 1) {
      if (pick([true,false])) {
      // single digit in all three boxes: □ × □□ = N
      const d1=rand(4,8), d2=rand(11,99);
      // pick d1 and d2 such that d2 has repeated digit = d1's partner
      const targets=[[4,4,176],[5,5,275],[6,6,396],[7,7,539],[8,8,512],[3,3,99],[4,11,44]];
      const [a,b,prod]=pick([[4,44,176],[5,55,275],[6,66,396],[3,33,99],[8,88,704],[7,77,539]]);
      const digit=String(a)[0];
      // the seed digit must also be checked against `digit` itself — otherwise an unlucky seed
      // equal to the answer gets silently deduped by buildMCStr, leaving only 3 real decoys and
      // triggering its "correct·N" filler fallback.
      let seed; do { seed=String(rand(2,9)); } while(seed===digit);
      const ds2=[seed];
      while(ds2.length<4) { const x=String(rand(1,9)); if(!ds2.includes(x)&&x!==digit) ds2.push(x); }
      const {options,correctIndex}=buildMCStr(digit,[...ds2].slice(0,4));
      return { q:`Which single digit should be placed in all three boxes to give a correct calculation?\n□ × □□ = ${prod}`, options, correctIndex, solution:[`Try each digit. ${digit} × ${digit}${digit} = ${a} × ${a*10+a} = ${prod}. ✓`] };
      }
      // (a2) a two-digit number plus its own digit-reversal — classic AB+BA=11(A+B) trick,
      // so the DIGIT SUM (not the number itself) is the uniquely-determined quantity to ask for.
      const A=rand(1,9), B=rand(0,9), S=11*(A+B);
      const nm=N1();
      const digitSum=A+B;
      const {options,correctIndex}=buildMC(digitSum,[digitSum+1,digitSum>1?digitSum-1:digitSum+2,Math.round(S/11)+2,Math.floor(S/10)]);
      return { q:`${nm} takes a two-digit number and adds it to its own digit-reversal (so, for example, 34 and 43). The total is ${S}. What is the sum of the two digits of the original number?`, options, correctIndex, solution:[`If the digits are A and B, the number is 10A+B and its reverse is 10B+A. Their sum is 11A+11B = 11(A+B).`, `So A+B = ${S} ÷ 11 = ${digitSum}.`] };
    }
    if (d <= 2) {
      // JKL + JLL + JKL = 4-digit sum: find J+K+L
      // Parameterise: pick J,K,L distinct 1-9
      let J,K,L,S; let tries=0;
      do { J=rand(1,4);K=rand(1,9);L=rand(1,9);
        if(J!==K&&K!==L&&J!==L){ S=2*(100*J+10*K+L)+(100*J+10*L+L); if(S>999&&S<10000) break; }
        tries++;
      } while(tries<200);
      const ans=J+K+L;
      const {options,correctIndex}=buildMC(ans,[ans+1,ans-1,ans+2,ans+3]);
      return { q:`In the addition sum,  ${J} ${K} ${L}\n+ ${J} ${L} ${L}\n+ ${J} ${K} ${L}\n───────\n${S}, the letters J, K and L stand for different digits. What is J + K + L?`, options, correctIndex, solution:[`J=${J}, K=${K}, L=${L} satisfies the sum: ${100*J+10*K+L}+${100*J+10*L+L}+${100*J+10*K+L}=${S}.`, `J+K+L = ${J}+${K}+${L} = ${ans}.`] };
    }
    if (d === 3) {
      // pqr + qr + r = S, find q. Must verify S uniquely pins down (p,q,r) among ALL distinct-digit
      // triples with p,q in 1-9 (both are leading digits of a number) and r in 0-9 — not just check
      // that the generated triple itself has distinct digits, since a different triple could still
      // hit the same sum and leave q ambiguous (this happened for real: S=387 has two distinct-digit
      // solutions, p=2,q=8,r=9 and p=3,q=3,r=9 — the second is only excluded because p=q there).
      const solutionsFor = (S) => {
        const found = [];
        for (let p2 = 1; p2 <= 9; p2++) for (let q2 = 1; q2 <= 9; q2++) for (let r2 = 0; r2 <= 9; r2++) {
          if (p2 === q2 || q2 === r2 || p2 === r2) continue;
          if (100 * p2 + 20 * q2 + 3 * r2 === S) found.push([p2, q2, r2]);
        }
        return found;
      };
      let p,q,r,S; let tries=0; let unique=null;
      do { p=rand(1,7);q=rand(1,9);r=rand(1,9);
        S=100*p+10*q+r+(10*q+r)+r;
        if (S<1000 && p!==q && q!==r && p!==r) {
          const sols = solutionsFor(S);
          if (sols.length === 1) { unique = sols[0]; break; }
        }
        tries++;
      } while(tries<300);
      if (!unique) return G.cryptarith(2);
      [p,q,r] = unique;
      const {options,correctIndex}=buildMC(q,[q+1,q-1,p,r].filter(x=>x>=0&&x<=9));
      return { q:`The digits p, q and r make the three-digit number 'pqr', the two-digit number 'qr' and the one-digit number 'r'. Their sum is ${S}. What is the value of q?`, options, correctIndex, solution:[`100p+10q+r + 10q+r + r = ${S}.`, `100×${p} + 21×${q} + 3×${r} = ${S}. ✓`, `So q = ${q}.`] };
    }
    // d4: X + X + YY = ZZZ form
    let X,Y,Z,tries2=0;
    do { X=rand(1,9);Y=rand(0,9);Z=rand(1,9);
      if(2*X+(11*Y)===111*Z) break; tries2++;
    } while(tries2<500);
    if(tries2===500){ return G.cryptarith(3); }
    const ans=X+Y+Z;
    const {options,correctIndex}=buildMC(ans,[ans+1,ans-1,ans+3,ans-2]);
    return { q:`In the sum  X\n+ X\n+ YY\n─────\nZZZ, equal letters represent equal digits and different letters represent different digits. What is the value of X + Y + Z?`, options, correctIndex, solution:[`ZZZ = 111Z. YY = 11Y. So 2X + 11Y = 111Z.`, `X=${X}, Y=${Y}, Z=${Z} works: 2×${X}+11×${Y}=${2*X+11*Y}=111×${Z}. ✓`, `X+Y+Z = ${X+Y+Z}.`] };
  },

  /* G6 — mean with removal or insertion */
  meanPuzzle(d) {
    const [a,b]=NP();
    if (d <= 1) {
      const n=rand(4,8),m=rand(6,14); const total=n*m;
      const r=rand(1,3); const rm_mean=rand(m+2,m+6); const rm_total=r*rm_mean;
      if(rm_total>total-6) return G.meanPuzzle(1);
      const newN=n-r; const newMean=(total-rm_total)/newN;
      if(!Number.isInteger(newMean)||newMean<1) return G.meanPuzzle(1);
      const {options,correctIndex}=buildMC(newMean,[newMean+1,newMean-1,m,Math.round((total-rm_total)/(newN+1))]);
      return { q:`The mean of a set of ${n} numbers is ${m}. ${r===1?`One number`:`${r} numbers with a mean of ${rm_mean}`} ${r===1?`equal to ${rm_mean} is`:`are`} removed from the set. What is the mean of the remaining ${newN} numbers?`, options, correctIndex, solution:[`Total of all ${n} numbers: ${n}×${m} = ${total}.`, `Total removed: ${r===1?rm_mean:r+"×"+rm_mean+"="}${rm_total}. Remaining total: ${total}-${rm_total}=${total-rm_total}.`, `New mean: ${total-rm_total}÷${newN} = ${newMean}.`] };
    }
    if (d <= 2) {
      const guests=rand(8,15); const ages=[6,7,8,9,10]; const most=pick([7,8,9]);
      const fixed=rand(2,4); // number of youngest
      const youngest=ages[0];
      // fill rest with most, rest split
      let total=fixed*youngest; let counts={[youngest]:fixed,[most]:0};
      ages.filter(a=>a!==youngest&&a!==most).forEach(a=>{counts[a]=1;total+=a;});
      const remaining=guests-fixed-Object.keys(counts).filter(k=>Number(k)!==youngest&&Number(k)!==most).length;
      counts[most]=remaining; total+=most*remaining;
      const mean=total/guests;
      if(!Number.isInteger(mean*2)||mean<6) return G.meanPuzzle(2);
      const meanAns=Math.round(mean*10)/10;
      // Integer offsets preserve meanAns's own shape (whole number or X.5) in every decoy —
      // a fixed [6,6.5,7,7.5,8] pool used to mix shapes whenever meanAns landed on a whole number.
      const {options,correctIndex}=buildMC(meanAns,[meanAns-2,meanAns-1,meanAns+1,meanAns+2]);
      return { q:`${a} had ${guests} guests at a party, aged between 6 and 10. ${fixed} of the guests were ${youngest} years old. The most common age was ${most}. What was the mean age of the guests?`, options, correctIndex, solution:[`Build counts: ${Object.entries(counts).map(([k,v])=>`${k}yrs:${v}`).join(", ")}.`, `Total age = ${total}. Mean = ${total}÷${guests} = ${mean}.`] };
    }
    const branch3 = rand(0,2);
    if (branch3 === 0) {
      // missing value from known mean
      const n=rand(4,7),m=rand(8,16); const total=n*m;
      let nums=[],sum=0;
      for(let i=0;i<n-1;i++){const x=rand(4,2*m);nums.push(x);sum+=x;}
      const last=total-sum; if(last<1||last>50) return G.meanPuzzle(d);
      const {options,correctIndex}=buildMC(last,[m,Math.round(sum/(n-1)),last+m,n*m]);
      return { q:`The mean of ${n} numbers is ${m}. ${n-1} of them are ${nums.join(", ")}. Find the last number.`, options, correctIndex, solution:[`Total must be ${n}×${m} = ${total}.`, `Known sum: ${nums.join("+")} = ${sum}.`, `Last number: ${total}−${sum} = ${last}.`] };
    }
    if (branch3 === 1) {
      // (d) combining two groups' means — a weighted average, genuinely different from
      // removing/inserting a value: here BOTH group sizes and BOTH means are already known.
      const n1=rand(4,10), n2=rand(4,10); const m1=rand(50,80), m2=rand(50,80);
      const totalN = n1+n2; const combinedTotal = n1*m1 + n2*m2;
      if (combinedTotal % totalN !== 0) return G.meanPuzzle(d);
      const combinedMean = combinedTotal/totalN;
      const {options,correctIndex}=buildMC(combinedMean,[Math.round((m1+m2)/2),combinedMean+1,combinedMean>1?combinedMean-1:combinedMean+2,m1]);
      return { q:`${a}'s class of ${n1} pupils scored a mean of ${m1} in a test. ${b}'s class of ${n2} pupils scored a mean of ${m2} in the same test. What is the mean score across both classes combined?`, options, correctIndex, solution:[`${a}'s class total: ${n1}×${m1} = ${n1*m1}. ${b}'s class total: ${n2}×${m2} = ${n2*m2}.`, `Combined total: ${n1*m1} + ${n2*m2} = ${combinedTotal}, across ${n1}+${n2} = ${totalN} pupils.`, `Combined mean: ${combinedTotal} ÷ ${totalN} = ${combinedMean}.`, `Note this is NOT simply the average of ${m1} and ${m2}, since the two classes are different sizes.`] };
    }
    // (e) insert a new value to hit a TARGET new mean — genuinely different from removing a
    // value or finding a missing original value: here the mean itself is meant to CHANGE.
    const n3=rand(4,8), m3=rand(10,20); const total3=n3*m3;
    const newMean3 = pick([m3+1,m3+2,m3-1,m3-2].filter(x=>x>0 && x!==m3));
    const x = newMean3*(n3+1) - total3;
    if (x<1 || x>60) return G.meanPuzzle(d);
    const {options,correctIndex}=buildMC(x,[m3,newMean3,x+newMean3-m3,total3-x].filter(v=>v!==x));
    const nm3=N1();
    return { q:`The mean of ${n3} numbers is ${m3}. ${nm3} adds one more number, and the mean of all ${n3+1} numbers becomes ${newMean3}. What number did ${nm3} add?`, options, correctIndex, solution:[`Original total: ${n3}×${m3} = ${total3}. New total needed: ${n3+1}×${newMean3} = ${newMean3*(n3+1)}.`, `The number added: ${newMean3*(n3+1)} − ${total3} = ${x}.`] };
  },

  // arithCorrect retired as a standalone topic — its "fix the sum" scenario now lives inside
  // multiExpr's own d3/d4 tier (see G.multiExpr above), with its expression-evaluator bug fixed.

  /* G8 — ratio chains */
  ratioChain(d) {
    // Every branch tests a genuinely different ratio principle: partitioning a total,
    // reading a ratio as a fraction of the whole, simplifying ratios (incl. mixed units),
    // chaining two ratios through a shared term, using a DIFFERENCE (not just a sum) to
    // find the value of one part, what happens when one part of a ratio changes while
    // the other stays fixed, and what stays invariant when a whole category is removed.
    const tier1 = [
      // (a) basic two-part share: the unitary method
      () => {
        const [n1, n2] = NP();
        const p = rand(2, 9), q = rand(2, 9);
        if (gcd(p, q) !== 1 || p === q) return null;
        const k = rand(2, 12);
        const total = (p + q) * k;
        const a = p * k, b = q * k;
        const { options, correctIndex } = buildMC(b, [a, Math.round(total / 2), a + k, b + k], gbp);
        return { q: `${n1} and ${n2} share £${total} in the ratio ${p}:${q}. How much does ${n2} receive?`, options, correctIndex, solution: [
          `Total parts = ${p}+${q} = ${p + q}.`,
          `One part = £${total} ÷ ${p + q} = £${k}.`,
          `${n2}'s share = ${q} parts = ${q}×£${k} = £${b}.`] };
      },
      // (b) ratio as a fraction of the whole (not an amount)
      () => {
        const p = rand(2, 8), q = rand(2, 8);
        if (gcd(p, q) !== 1 || p === q) return null;
        const total = p + q;
        const ans = `${p}/${total}`;
        const candidates = [`${q}/${total}`, `${p}/${q}`, `${q}/${p}`, `${p + 1}/${total}`, `${Math.max(p - 1, 1)}/${total}`];
        const ds = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (ds.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, ds);
        return { q: `Paint is mixed from blue and yellow in the ratio ${p}:${q} (blue:yellow). What fraction of the mixture is blue?`, options, correctIndex, solution: [
          `Total parts = ${p}+${q} = ${total}.`,
          `Blue is ${p} of these ${total} parts.`,
          `Fraction blue = ${p}/${total}.`] };
      },
      // (c) simplify a ratio given in mixed units
      () => {
        const kg = rand(1, 4);
        const gExtra = pick([100, 150, 200, 250, 300, 350, 400, 500, 600, 700, 750, 800, 900]);
        const totalG = kg * 1000 + gExtra;
        const divisors = [2, 3, 4, 5, 6, 7, 8, 9].filter(x => totalG % x === 0);
        if (!divisors.length) return null;
        const rn = pick(divisors);
        const m = totalG / rn;
        const rdCandidates = [2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== rn && gcd(x, rn) === 1);
        if (!rdCandidates.length) return null;
        const rd = pick(rdCandidates);
        const otherG = rd * m;
        if (otherG > 9000) return null;
        const ans = `${rn}:${rd}`;
        const candidates = [`${kg}:${otherG}`, `${gExtra}:${otherG}`, `${rd}:${rn}`, `${totalG}:${otherG}`, `${m}:${otherG}`, `${rn}:${rn}`];
        const ds = [...new Set(candidates)].filter((s) => s !== ans).slice(0, 4);
        if (ds.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, ds);
        return { q: `A bag of flour weighs ${kg} kg ${gExtra} g. A bag of sugar weighs ${otherG} g. Write the ratio of flour to sugar in simplest form.`, options, correctIndex, solution: [
          `Convert to the same units: ${kg} kg ${gExtra} g = ${totalG} g.`,
          `Ratio = ${totalG}:${otherG}.`,
          `Divide both by ${m}: ${rn}:${rd}.`] };
      },
    ];
    const tier2 = [
      // (a) three-part partition: find one specific part, not just the total or largest
      () => {
        const p = rand(1, 5), q = rand(2, 6), r = rand(3, 7);
        if (p === q || q === r || p === r) return null;
        const k = rand(2, 9);
        const total = (p + q + r) * k;
        const a = p * k, b = q * k, c = r * k;
        const { options, correctIndex } = buildMC(b, [a, c, Math.round(total / 3), b + k]);
        return { q: `A total of ${total} sweets are shared between Alex, Bo and Cass in the ratio ${p}:${q}:${r}. How many sweets does Bo get?`, options, correctIndex, solution: [
          `Total parts = ${p}+${q}+${r} = ${p + q + r}.`,
          `One part = ${total} ÷ ${p + q + r} = ${k}.`,
          `Bo gets ${q} parts = ${q}×${k} = ${b}.`] };
      },
      // (b) chain two ratios by making the shared term agree
      () => {
        const p = rand(1, 4), q = rand(1, 4), r = rand(1, 4), s = rand(1, 4), t = rand(1, 4), u = rand(1, 4);
        const an = p * s, ae = r * u; const g = gcd(an, ae);
        const ans = `${an / g} : ${ae / g}`;
        const candidates = [`${p} : ${u}`, `${q} : ${t}`, `${an + 1} : ${ae}`, `${p} : ${r}`, `${an / g} : ${ae / g + 1}`, `${ae / g} : ${an / g}`];
        const ds = [...new Set(candidates)].filter((s2) => s2 !== ans).slice(0, 4);
        if (ds.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, ds);
        return { q: `The ratio a : b : c = ${p} : ${q} : ${r}. The ratio c : d : e = ${s} : ${t} : ${u}. What is the ratio a : e?`, options, correctIndex, solution: [
          `From first ratio: a/c = ${p}/${r}.`, `From second ratio: e/c = ${u}/${s}.`,
          `So a:e = ${p * s} : ${r * u} = ${ans}.`] };
      },
      // (c) use the DIFFERENCE between two parts, not their sum, to find the unit value
      () => {
        const p = rand(2, 9), q = rand(2, 9);
        if (gcd(p, q) !== 1 || p === q) return null;
        const diffParts = Math.abs(p - q);
        const k = rand(2, 10);
        const diffActual = diffParts * k;
        const a = p * k, b = q * k; const total = a + b;
        const { options, correctIndex } = buildMC(total, [a, b, Math.abs(a - b), total + k]);
        return { q: `Two jars of marbles are in the ratio ${p}:${q}. The larger jar has ${diffActual} more marbles than the smaller jar. How many marbles are there in total?`, options, correctIndex, solution: [
          `The ratio ${p}:${q} means a difference of ${diffParts} parts.`,
          `${diffParts} parts = ${diffActual} marbles, so 1 part = ${k} marbles.`,
          `Total parts = ${p + q}, so total = ${p + q}×${k} = ${total} marbles.`] };
      },
    ];
    const tier3 = [
      // (a) change one part, change the whole ratio (the other quantity is fixed)
      () => {
        const p = rand(1, 5), q = rand(1, 5);
        if (gcd(p, q) !== 1 || p === q) return null;
        const k = rand(3, 10);
        const B = p * k, girlsInit = q * k;
        const r = rand(2, 15);
        const girlsNew = girlsInit + r;
        const g = gcd(B, girlsNew);
        const P2 = B / g, Q2 = girlsNew / g;
        if (P2 > 20 || Q2 > 20 || P2 === Q2) return null;
        const { options, correctIndex } = buildMC(B, [girlsInit, girlsNew, B + r, Math.max(B - r, 1)]);
        return { q: `A youth club has boys and girls in the ratio ${p}:${q}. After ${r} more girls join (the number of boys unchanged), the ratio becomes ${P2}:${Q2}. How many boys are in the club?`, options, correctIndex, solution: [
          `Let 1 "unit" = ${k} at the start: boys = ${p}×${k} = ${B}, girls = ${q}×${k} = ${girlsInit}.`,
          `After ${r} more girls: girls = ${girlsInit}+${r} = ${girlsNew}.`,
          `Check: boys:girls = ${B}:${girlsNew} = ${P2}:${Q2} once simplified. ✓`,
          `Boys = ${B}.`] };
      },
      // (b) removing a whole category leaves the ratio BETWEEN the rest unchanged
      () => {
        const p = rand(2, 7), q = rand(2, 7), r = rand(2, 7);
        if (p === q || q === r || p === r) return null;
        const k = rand(2, 8);
        const apples = p * k, oranges = q * k, pears = r * k;
        const remaining = apples + oranges;
        const g = gcd(apples, remaining);
        const fNum = apples / g, fDen = remaining / g;
        const ans = `${fNum}/${fDen}`;
        const dsCandidates = [`${p}/${p + q + r}`, `${oranges}/${remaining}`, `${apples}/${apples + oranges + pears}`, `${fNum}/${fDen + 1}`, `${fDen - fNum}/${fDen}`, `${apples}/${pears}`];
        const ds = [...new Set(dsCandidates)].filter((s) => s !== ans).slice(0, 4);
        if (ds.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, ds);
        return { q: `A fruit bowl has apples, oranges and pears in the ratio ${p}:${q}:${r} (${apples} apples, ${oranges} oranges, ${pears} pears). All the pears are removed and eaten. What fraction of the remaining fruit are apples?`, options, correctIndex, solution: [
          `Removing an entire category does not change the ratio BETWEEN the remaining categories: apples:oranges is still ${p}:${q}.`,
          `Remaining fruit = ${apples}+${oranges} = ${remaining}.`,
          `Fraction apples = ${apples}/${remaining} = ${fNum}/${fDen}.`] };
      },
      // (c) three-part ratio, but using the difference between the two EXTREME terms
      () => {
        const p = rand(1, 4), q = rand(p + 1, p + 4), r = rand(q + 1, q + 5);
        const k = rand(2, 9);
        const a = p * k, b = q * k, c = r * k;
        const diff = c - a; const total = a + b + c;
        const { options, correctIndex } = buildMC(b, [a, c, total, Math.round(diff / 2)]);
        return { q: `Three piles of coins are in the ratio ${p}:${q}:${r}. The largest pile has ${diff} more coins than the smallest. How many coins are in the middle pile?`, options, correctIndex, solution: [
          `Largest and smallest differ by ${r - p} parts.`,
          `${r - p} parts = ${diff} coins, so 1 part = ${k} coins.`,
          `Middle pile = ${q} parts = ${q}×${k} = ${b} coins.`] };
      },
    ];
    const tier4 = [
      // (a) chain THREE ratios through two shared terms, not just one
      () => {
        const p = rand(1, 4), q = rand(1, 4), r = rand(1, 4), s = rand(1, 4), t = rand(1, 4), u = rand(1, 4);
        const an = p * r * t, ad = q * s * u;
        if (an === ad) return null;
        const g = gcd(an, ad);
        const ans = `${an / g} : ${ad / g}`;
        const candidates = [`${an} : ${ad}`, `${p * r} : ${q * s}`, `${q * r * t} : ${p * s * u}`, `${an / g} : ${ad / g + 1}`, `${ad / g} : ${an / g}`, `${p * s} : ${q * u}`];
        const ds = [...new Set(candidates)].filter((x) => x !== ans).slice(0, 4);
        if (ds.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, ds);
        return { q: `a : b = ${p} : ${q}, b : c = ${r} : ${s}, and c : d = ${t} : ${u}. What is a : d, in simplest form?`, options, correctIndex, solution: [
          `a:b and b:c share the term b, so scale them until b agrees: a:b:c = ${p * r} : ${q * r} : ${q * s}.`,
          `That a:b:c ratio shares the term c with c:d. Scale again so c agrees: a:b:c:d = ${p * r * t} : ${q * r * t} : ${q * s * t} : ${q * s * u}.`,
          `So a:d = ${an} : ${ad}, which simplifies to ${ans}.`] };
      },
      // (b) a fixed amount is dealt with BEFORE the ratio is applied, so the split is not a pure scaling
      () => {
        const [n1, n2] = NP();
        const p = rand(2, 7), q = rand(2, 7);
        if (gcd(p, q) !== 1 || p === q) return null;
        const bonus = rand(2, 12) * 5;
        const k = rand(2, 10);
        const shareTotal = (p + q) * k;
        const total = shareTotal + bonus;
        const n1Part = p * k, n2Part = q * k;
        const n1Total = n1Part + bonus;
        const { options, correctIndex } = buildMC(n1Total, [n2Part, n1Part, total, shareTotal], gbp);
        return { q: `${n1} and ${n2} have £${total} between them. ${n1} is first given a fixed £${bonus} on top, and only THEN is the rest shared between ${n1} and ${n2} in the ratio ${p}:${q}. How much does ${n1} end up with in total?`, options, correctIndex, solution: [
          `Deal with the fixed amount first: £${total} − £${bonus} = £${shareTotal} left to share in the ratio ${p}:${q}.`,
          `One part = £${shareTotal} ÷ ${p + q} = £${k}.`,
          `${n1}'s share of that split is ${p} parts = £${n1Part}. Add back the bonus: £${n1Part} + £${bonus} = £${n1Total}.`] };
      },
      // (c) marbles are TRANSFERRED, not added, between two jars, so the combined total is invariant
      () => {
        const p = rand(2, 6), q = rand(1, 5);
        if (gcd(p, q) !== 1 || p === q) return null;
        const k = rand(2, 8);
        const A = p * k, B = q * k;
        const maxM = Math.min(A, B) - 1;
        if (maxM < 1) return null;
        const m = rand(1, Math.min(maxM, 12));
        const newA = A - m, newB = B + m;
        if (newA <= 0 || newB <= 0) return null;
        const g = gcd(newA, newB);
        const r = newA / g, s = newB / g;
        if (r === s || r > 30 || s > 30) return null;
        const T = A + B;
        const { options, correctIndex } = buildMC(T, [A, B, T - m, T + m]);
        return { q: `Jar X and jar Y hold marbles in the ratio ${p}:${q}. ${m} marbles are then poured from jar X into jar Y, and the ratio becomes ${r}:${s}. How many marbles are there in total?`, options, correctIndex, solution: [
          `Pouring marbles between the jars changes the split but not the combined total, since nothing is added or removed overall.`,
          `Originally jar X is ${p}/${p + q} of the total; afterwards jar X is ${r}/${r + s} of that SAME total.`,
          `Jar X's share fell by exactly the ${m} marbles poured out, and only one total makes both fractions consistent with that: T = ${T}.`] };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || G.ratioChain(d);
  },

  /* G9 — system of conditions: the underlying skill is ALWAYS "read the prose, name what's
     unknown, turn each sentence into an equation, solve" — never a specific cover story. Each
     tier below is a bank of scenarios that force a genuinely different translation/solving
     structure (not just different nouns over the same equation shape), so the skill has to be
     re-derived every time rather than pattern-matched. Every scenario is sound by construction:
     the "nice" underlying values are picked first and the presented totals are computed from
     them, so the answer is trivially guaranteed correct. */
  systemWord(d) {
    const tier1 = [
      // (a) balloon/basket: doubling one factor of a linear expression
      () => {
        const basket=rand(1,6)*10; const c1=rand(5,12)*10; const c2=basket+2*c1;
        const kg=(x)=>x+" kg";
        const {options,correctIndex}=buildMC(basket,[c2-c1,basket+10,basket*2,Math.max(basket-10,5)],kg);
        return { q:`One balloon can lift a basket with contents weighing no more than ${c1} kg. Two balloons can lift the same basket with contents weighing no more than ${c2} kg. What is the weight of the basket in kg?`, options, correctIndex, solution:[
          `Unknown: let the basket weigh b kg.`,
          `One balloon lifts b + ${c1} kg. Two balloons lift twice that: 2(b + ${c1}) = 2b + ${2*c1}.`,
          `Two balloons also lift b + ${c2} kg, so b + ${c2} = 2b + ${2*c1}.`,
          `b = ${c2} − ${2*c1} = ${basket} kg.`] };
      },
      // (b) sum + difference: two linear equations, the classic add/subtract-the-equations shape
      () => {
        const [d1,d2]=NP();
        const lighter=rand(5,20); const diff=rand(2,10); const heavier=lighter+diff; const S=lighter+heavier;
        const kg=(x)=>x+" kg";
        const {options,correctIndex}=buildMC(lighter,[heavier,Math.round(S/2),S-diff*2,lighter+diff*2],kg);
        return { q:`${d1} and ${d2}'s dogs have a combined weight of ${S} kg. ${d1}'s dog is ${diff} kg heavier than ${d2}'s dog. How much does ${d2}'s dog weigh?`, options, correctIndex, solution:[
          `Unknown: let ${d2}'s dog weigh x kg, so ${d1}'s dog weighs x + ${diff} kg.`,
          `Together: x + (x + ${diff}) = ${S}, so 2x + ${diff} = ${S}.`,
          `2x = ${S-diff}, so x = ${lighter} kg.`] };
      },
      // (c) heads-and-legs: two categories with different per-unit rates, needs substitution
      () => {
        const sheep=rand(2,9); const chickens=rand(2,12); const heads=sheep+chickens; const legs=2*chickens+4*sheep;
        const {options,correctIndex}=buildMC(sheep,[chickens,Math.round(legs/4),heads-sheep,Math.max(sheep-2,1)]);
        return { q:`A farmer has chickens and sheep. Altogether there are ${heads} heads and ${legs} legs. Chickens have 2 legs and sheep have 4. How many sheep does the farmer have?`, options, correctIndex, solution:[
          `Unknowns: let s = sheep, c = chickens.`,
          `Heads: s + c = ${heads}. Legs: 4s + 2c = ${legs}.`,
          `From the first equation, c = ${heads} − s. Substitute: 4s + 2(${heads} − s) = ${legs}, so 2s + ${2*heads} = ${legs}.`,
          `2s = ${legs-2*heads}, so s = ${sheep}.`] };
      },
      // (d) inclusion-exclusion: a fact defined by combining two overlapping categories
      () => {
        const onlyM=rand(5,14); const onlyA=rand(5,14); const both=rand(2,9);
        const M=onlyM+both, A=onlyA+both, Tt=onlyM+onlyA+both;
        const {options,correctIndex}=buildMC(both,[Tt-M-A,M+A-Tt+2,Math.min(M,A),Math.max(both-2,1)]);
        return { q:`In a class of ${Tt} pupils, ${M} like Maths and ${A} like Art. Every pupil likes at least one of the two subjects. How many pupils like both?`, options, correctIndex, solution:[
          `Unknown: let b = the number who like both.`,
          `Only Maths: ${M} − b. Only Art: ${A} − b. Everyone likes at least one, so (${M} − b) + (${A} − b) + b = ${Tt}.`,
          `${M} + ${A} − b = ${Tt}, so b = ${M} + ${A} − ${Tt} = ${both}.`] };
      },
      // (e) transfer/redistribution: an action links a "before" state to an "after" equation
      () => {
        const [f1,f2]=NP();
        const equalFinal=rand(10,20); const g=rand(1,5);
        const aStart=equalFinal+g; const bStart=equalFinal-g; const P=aStart+bStart;
        const {options,correctIndex}=buildMC(aStart,[bStart,equalFinal,P-g,aStart-g*2]);
        return { q:`${f1} and ${f2} have ${P} sweets between them. ${f1} then gives ${g} sweets to ${f2}, and afterwards they have the same number of sweets each. How many sweets did ${f1} start with?`, options, correctIndex, solution:[
          `Unknown: let ${f1} start with x sweets, so ${f2} starts with ${P} − x.`,
          `After the gift: ${f1} has x − ${g}; ${f2} has (${P} − x) + ${g}. These are equal.`,
          `x − ${g} = ${P} − x + ${g}, so 2x = ${P + 2*g}, so x = ${aStart}.`] };
      },
    ];
    const tier2 = [
      // (a) fruit basket: two quantities each reduced by different known amounts, equal after
      () => {
        const [a,b]=NP();
        const [applesStart,pearsStart]=[rand(10,18),rand(10,18)];
        const [ae,ap]=[rand(1,3),rand(1,3)];
        const [be,bp]=[rand(1,3),rand(1,3)];
        const applesEnd=applesStart-ae-be; const pearsEnd=pearsStart-ap-bp;
        if(applesEnd!==pearsEnd||applesEnd<5) return null;
        const {options,correctIndex}=buildMC(pearsStart,[pearsStart+1,pearsStart-1,applesStart,applesStart+pearsStart]);
        return { q:`${a} and ${b} were given a basket of ${applesStart+pearsStart} pieces of fruit (only apples and pears). ${a} ate ${ae} apple${ae>1?"s":""} and ${ap} pear${ap>1?"s":""}. ${b} ate ${be} apple${be>1?"s":""} and ${bp} pear${bp>1?"s":""}. Afterwards the basket had equal numbers of apples and pears. How many pears were there at the start?`, options, correctIndex, solution:[
          `Unknown: let there have been p pears at the start.`,
          `Apples remaining: ${applesStart} − ${ae+be} = ${applesEnd}. Pears remaining: p − ${ap+bp}.`,
          `Equal means p − ${ap+bp} = ${applesEnd}, so p = ${pearsStart}.`] };
      },
      // (b) savings over time: a fixed offset between two starts, plus a uniform rate, given the total after
      () => {
        const aStart=rand(5,15); const diff=rand(1,8); const bStart=aStart+diff;
        const n=rand(3,6); const w=rand(1,4);
        const T=aStart+bStart+2*n*w;
        const {options,correctIndex}=buildMC(aStart,[bStart,Math.round(T/2),aStart+n*w,Math.max(aStart-diff,1)]);
        return { q:`Two savings jars start with different amounts; the second jar starts with £${diff} more than the first. Both jars then receive £${w} every week for ${n} weeks. After that, the two jars together hold £${T}. How much did the first jar start with?`, options, correctIndex, solution:[
          `Unknown: let the first jar start with x pounds, so the second starts with x + ${diff}.`,
          `After ${n} weeks each jar has gained ${n} × ${w} = £${n*w}.`,
          `Together: (x + ${n*w}) + (x + ${diff} + ${n*w}) = ${T}, so 2x + ${diff + 2*n*w} = ${T}.`,
          `2x = ${T - diff - 2*n*w}, so x = £${aStart}.`] };
      },
      // (c) exclusion/complement: quantities defined by "all but N are X", not stated directly
      () => {
        const x=rand(4,12), y=rand(4,12), z=rand(2,8); // goldfish, guppies, tetras
        const Tt=x+y+z; const Gx=y+z; const Ux=x+z;
        const {options,correctIndex}=buildMC(z,[Tt-Gx-Ux,Gx+Ux-Tt+2,Math.min(Gx,Ux),Math.max(z-2,1)]);
        return { q:`A tank holds only goldfish, guppies and tetras, ${Tt} fish in total. All the fish are goldfish except ${Gx} of them. All the fish are guppies except ${Ux} of them. How many tetras are there?`, options, correctIndex, solution:[
          `Unknown: let there be z tetras.`,
          `"All except ${Gx} are goldfish" means guppies + tetras = ${Gx}. "All except ${Ux} are guppies" means goldfish + tetras = ${Ux}.`,
          `Adding these counts every fish once, plus tetras a second time: ${Tt} + z = ${Gx} + ${Ux}.`,
          `z = ${Gx} + ${Ux} − ${Tt} = ${z}.`] };
      },
      // (d) classic count+value: two unknowns from a total count and a total value
      () => {
        const x=rand(4,14), y=rand(4,14);
        const T=x+y; const V=20*x+50*y;
        return (() => {
          const {options,correctIndex}=buildMC(y,[x,Math.round((V-20*T)/30)+2,Math.round(V/70),Math.max(y-2,1)]);
          return { q:`A jar has ${T} coins, each either 20p or 50p, worth ${V}p in total. How many 50p coins are in the jar?`, options, correctIndex, solution:[
            `Unknown: let there be y 50p coins, so ${T} − y are 20p coins.`,
            `Total value: 20(${T} − y) + 50y = ${V}.`,
            `${20*T} + 30y = ${V}, so 30y = ${V-20*T}, so y = ${y}.`] };
        })();
      },
    ];
    const tier3 = [
      // (a) points game: unknown total split by win/loss, each worth a different amount
      () => {
        const [nm1,nm2]=NP(); const ptsWin=3; const w=rand(4,8); const T=rand(12,22);
        const gNum=T-w; const gDen=ptsWin-1;
        if(gNum%gDen!==0) return null;
        const g=gNum/gDen+w;
        const {options,correctIndex}=buildMC(g,[g-1,g+1,g+2,w+T]);
        return { q:`${nm1} and ${nm2} play a series of games. The winner of each game gets ${ptsWin} points and the loser gets 1. ${nm2} wins ${w} games and ${nm1} has ${T} points in total. How many games do they play altogether?`, options, correctIndex, solution:[
          `Unknown: let g = total games. ${nm1} wins g − ${w} of them and loses the other ${w}.`,
          `${nm1}'s points: (g − ${w}) × ${ptsWin} + ${w} × 1 = ${T}.`,
          `${ptsWin}g − ${3*w} + ${w} = ${T}, so ${ptsWin}g = ${T + 2*w}, so g = ${g}.`] };
      },
      // (b) true elimination: substitution from either equation alone doesn't isolate the answer
      () => {
        const x=rand(2,8)*5; const y=x+rand(3,10)*5;
        const P1=3*x+2*y; const P2=x+4*y;
        const {options,correctIndex}=buildMC(y,[x,y+5,y-5,Math.round((P1+P2)/5)]);
        return { q:`A small box holds x pens and a large box holds y pens (fixed but unknown). 3 small boxes and 2 large boxes hold ${P1} pens in total. 1 small box and 4 large boxes hold ${P2} pens in total. How many pens are in one large box?`, options, correctIndex, solution:[
          `Two equations: 3x + 2y = ${P1}, and x + 4y = ${P2}.`,
          `Multiply the second equation by 3: 3x + 12y = ${3*P2}.`,
          `Subtract the first equation from this: 10y = ${3*P2} − ${P1} = ${3*P2-P1}.`,
          `y = ${y} pens.`] };
      },
      // (c) ratio-chain sum: three quantities in a geometric ratio, solve via the sum of ratio parts
      () => {
        const k=rand(2,4); const m=rand(2,10);
        const mid=m*k, largest=m*k*k, S=m+mid+largest;
        const {options,correctIndex}=buildMC(largest,[mid,Math.round(S/3),S-largest,m]);
        return { q:`Three numbers are in the ratio 1 : ${k} : ${k*k}, and their sum is ${S}. What is the largest of the three numbers?`, options, correctIndex, solution:[
          `Unknown: let the smallest number be m, so the three numbers are m, ${k}m and ${k*k}m.`,
          `Their sum is m(1 + ${k} + ${k*k}) = ${1+k+k*k}m = ${S}.`,
          `m = ${S} ÷ ${1+k+k*k} = ${m}, so the largest is ${k*k} × ${m} = ${largest}.`] };
      },
      // (d) clever combination: subtracting two multiplicative facts beats solving for each variable
      () => {
        const x=rand(3,9), y=rand(3,9);
        const P=x*y; const Q=x*(y+2);
        const {options,correctIndex}=buildMC(x,[y,Q-P,Math.round(P/y),Math.max(x-2,1)]);
        return { q:`Two positive whole numbers x and y satisfy xy = ${P}. If y is increased by 2 (with x unchanged), the product becomes ${Q}. Find x.`, options, correctIndex, solution:[
          `x(y+2) − xy = ${Q} − ${P}, and the left side simplifies to just 2x (the xy terms cancel).`,
          `So 2x = ${Q-P}, meaning x = ${x}.`] };
      },
      // (e) chained substitution: three unknowns defined in sequence from one another
      () => {
        const [n1,n2]=NP(); const n3=pick(NAMES.filter(nm=>nm!==n1&&nm!==n2));
        const a=rand(3,12);
        const B=2*a+3; const C=(a+B)-5; const T=a+B+C;
        const {options,correctIndex}=buildMC(B,[a,C,Math.round(T/3),Math.max(B-3,1)]);
        return { q:`${n1}, ${n2} and ${n3} have been saving money. ${n2} has saved £3 more than twice ${n1}'s savings. ${n3} has saved £5 less than ${n1} and ${n2}'s savings added together. Altogether the three of them have saved £${T}. How much has ${n2} saved?`, options, correctIndex, solution:[
          `Unknowns: let ${n1} = a. Then ${n2} = 2a + 3, and ${n3} = (a + ${n2}) − 5 = 3a − 2.`,
          `Together: a + (2a+3) + (3a−2) = ${T}, so 6a + 1 = ${T}.`,
          `a = ${(T-1)/6}, so ${n2} = 2 × ${a} + 3 = £${B}.`] };
      },
    ];
    const tier4 = [
      // (a) three-unknown pairwise system: no single equation isolates anything, needs the sum-all-three trick
      () => {
        const [p1,p2]=NP(); const p3=pick(NAMES.filter(nm=>nm!==p1&&nm!==p2));
        const a=rand(4,15), b=rand(4,15), c=rand(4,15);
        const AB=a+b, BC=b+c, AC=a+c; const total=(AB+BC+AC)/2;
        const {options,correctIndex}=buildMC(b,[a,c,total,Math.max(b-2,1)]);
        return { q:`${p1}, ${p2} and ${p3} weigh their backpacks in pairs on a two-person scale. ${p1} and ${p2} together carry ${AB} kg. ${p2} and ${p3} together carry ${BC} kg. ${p1} and ${p3} together carry ${AC} kg. How much does ${p2}'s backpack weigh alone?`, options, correctIndex, solution:[
          `Unknowns: let the backpacks weigh a, b and c kg for ${p1}, ${p2} and ${p3}.`,
          `Three equations: a + b = ${AB}, b + c = ${BC}, a + c = ${AC}. No single one gives an answer alone.`,
          `Add all three: each backpack is counted twice, so 2(a + b + c) = ${AB+BC+AC}, meaning a + b + c = ${total}.`,
          `${p2}'s backpack is what's left once ${p1} and ${p3} are removed: b = ${total} − ${AC} = ${b} kg.`] };
      },
      // (b) sum-and-product system: a hidden quadratic identity, not just linear substitution
      () => {
        const x=rand(5,16), y=rand(5,16);
        if (x===y) return null;
        const len=Math.max(x,y), wid=Math.min(x,y);
        const peri=2*(len+wid); const area=len*wid; const S=len+wid; const diff=len-wid;
        const {options,correctIndex}=buildMC(len,[wid,S,Math.round(peri/4),Math.max(len-2,1)]);
        return { q:`A rectangular field (not a square) has a perimeter of ${peri} m and an area of ${area} m². What is the length of its longer side, in metres?`, options, correctIndex, solution:[
          `Unknowns: let the sides be l and w metres, with l the longer side.`,
          `Perimeter: 2(l + w) = ${peri}, so l + w = ${S}. Area: lw = ${area}. Neither equation alone gives l.`,
          `Use the identity (l − w)² = (l + w)² − 4lw = ${S}² − 4×${area} = ${S*S-4*area}, so l − w = ${diff}.`,
          `Adding l + w = ${S} and l − w = ${diff}: 2l = ${S+diff}, so l = ${len} m.`] };
      },
      // (c) three-category system with a ratio clue standing in for the missing third equation
      () => {
        const s=rand(3,10); const b=2*s; const g=rand(3,15);
        const T=g+s+b; const Rev=5*g+3*s+2*b;
        const {options,correctIndex}=buildMC(g,[s,b,T-b,Math.max(g-2,1)]);
        return { q:`A charity raffle sells gold tickets at £5, silver tickets at £3 and bronze tickets at £2. ${T} tickets were sold in total, raising £${Rev}. There were exactly twice as many bronze tickets as silver tickets. How many gold tickets were sold?`, options, correctIndex, solution:[
          `Unknowns: let there be g gold, s silver and b bronze tickets. The ratio clue gives a third equation: b = 2s.`,
          `Total tickets: g + s + b = ${T}, so g + s + 2s = ${T}, giving g + 3s = ${T}.`,
          `Total revenue: 5g + 3s + 2b = ${Rev}, so 5g + 3s + 4s = ${Rev}, giving 5g + 7s = ${Rev}.`,
          `From the first equation, g = ${T} − 3s. Substitute: 5(${T} − 3s) + 7s = ${Rev}, so ${5*T} − 8s = ${Rev}.`,
          `8s = ${5*T} − ${Rev} = ${5*T-Rev}, so s = ${s}, and g = ${T} − 3 × ${s} = ${g}.`] };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || G.systemWord(d);
  },

  /* G10 — work-backwards money */
  /* G10 — work backwards: every tier undoes a genuinely different chain of
     steps (a pure number-machine, a fraction-of-remainder story, repeated
     halving-plus-a-gift, a two-person doubling exchange, a chain including a
     percentage change, and a three-stage fixed+fraction split) — not the
     same "take a fixed amount then a fraction of the rest" template scaled
     from 2 to 3 people. */
  workBackwards(d) {
    const tier1 = [
      // (a) pure number-machine chain of 3 operations
      () => {
        const genOps = [
          () => { const k = rand(3, 25); return { fwd: x => x + k, inv: y => y - k, txt: `add ${k}` }; },
          () => { const k = rand(2, 9); return { fwd: x => x - k, inv: y => y + k, txt: `subtract ${k}`, minReq: k + 1 }; },
          () => { const m = pick([2, 3, 4]); return { fwd: x => x * m, inv: y => y / m, txt: `multiply by ${m}` }; },
        ];
        const x0 = rand(3, 14);
        const ops = [pick(genOps)(), pick(genOps)(), pick(genOps)()];
        let v = x0, ok = true;
        for (const op of ops) { if (op.minReq && v < op.minReq) { ok = false; break; } v = op.fwd(v); if (!Number.isInteger(v) || v < 0 || v > 2000) { ok = false; break; } }
        if (!ok) return null;
        const R = v;
        let back = R; const steps = [];
        for (let i = ops.length - 1; i >= 0; i--) { const before = back; back = ops[i].inv(back); steps.push(`Undo "${ops[i].txt}": ${before} → ${back}.`); }
        if (back !== x0) return null;
        let wrongOrder = R; for (let i = 0; i < ops.length; i++) wrongOrder = ops[i].inv(wrongOrder);
        // Undoing in forward (wrong) order can land on a non-multiple mid-chain and produce a
        // fractional value here — round it so it never breaks the all-integer decoy shape.
        const distractors = [Math.round(wrongOrder), x0 + ops.length, x0 > 2 ? x0 - 2 : x0 + 7, R];
        const { options, correctIndex } = buildMC(x0, distractors);
        const chainText = ops.map(o => o.txt).join(", then ");
        return { q: `I think of a number. I ${chainText}, and the result is ${R}. What was my number?`, options, correctIndex, solution: [
          `Undo the steps in REVERSE order, turning each operation into its opposite.`,
          ...steps,
          `The original number was ${x0}.`] };
      },
      // (b) fraction-of-remainder single-person story
      () => {
        const F = rand(5, 40); const n = pick([2, 3, 4, 5]);
        const T0 = rand(F + n * 4, F + n * 30);
        const afterF = T0 - F; if (afterF <= 0) return null;
        const spent2 = afterF / n; if (!Number.isInteger(spent2)) return null;
        const R = afterF - spent2;
        const nm = N1();
        const nWord = n === 2 ? "half" : n === 3 ? "a third" : n === 4 ? "a quarter" : "a fifth";
        const distractors = [R + F, afterF, T0 + F, T0 - F];
        const { options, correctIndex } = buildMC(T0, distractors, gbp);
        return { q: `${nm} had some money. ${nm} spent £${F}, then spent ${nWord} of what was left, and had £${R} left. How much did ${nm} start with?`, options, correctIndex, solution: [
          `Work backwards from the end. Before spending ${nWord} of it, ${nm} had £${R} + £${spent2} = £${afterF} (since £${R} is what's left AFTER losing ${nWord}, so £${R} is ${n - 1} of the ${n} parts).`,
          `Before spending £${F}, ${nm} had £${afterF} + £${F} = £${T0}.`] };
      },
      // (c) repeated halving + gift over N rounds
      () => {
        const N = rand(2, 3); const G2 = rand(1, 4) * 8;
        const x0 = rand(2, 6) * 8;
        let v = x0, ok = true;
        for (let i = 0; i < N; i++) { if (v % 2 !== 0) { ok = false; break; } v = v / 2; v = v + G2; }
        if (!ok) return null;
        const R = v;
        let back = R; const steps = [];
        for (let i = 0; i < N; i++) { const beforeGift = back - G2; const beforeHalving = beforeGift * 2; steps.push(`Undo night ${N - i}: remove the ${G2} gift (${back} → ${beforeGift}), then undo the halving by doubling (${beforeGift} → ${beforeHalving}).`); back = beforeHalving; }
        if (back !== x0) return null;
        const distractors = [R * Math.pow(2, N), x0 + 2, x0 - 2, R];
        const { options, correctIndex } = buildMC(x0, distractors);
        return { q: `A squirrel had some nuts. Each night for ${N} nights, it ate exactly half its nuts, then received ${G2} more from a friend before sleeping. After ${N} nights it had ${R} nuts. How many nuts did it start with?`, options, correctIndex, solution: [
          `Work backwards one night at a time, undoing the gift first (subtract) and then the halving (double), since that's the reverse of what happened.`,
          ...steps,
          `It started with ${x0} nuts.`] };
      },
    ];
    const tier2 = [
      // (a) two-person doubling exchange, reverse-simulated
      () => {
        const k = rand(2, 15);
        const a1 = 5 * k, b1 = 3 * k, E = 4 * k;
        const [nA, nB] = NP();
        const correctStr = `£${a1} and £${b1}`;
        const distractors = [`£${b1} and £${a1}`, `£${E} and £${E}`, `£${a1 + 2} and £${b1 - 2}`, `£${2 * E} and £0`];
        const { options, correctIndex } = buildMCStr(correctStr, distractors);
        return { q: `${nA} and ${nB} share some money. First, ${nA} gives ${nB} enough to exactly double what ${nB} has. Then ${nB} gives ${nA} enough to exactly double what ${nA} then has. After this, both have £${E}. How much did each start with (${nA}, then ${nB})?`, options, correctIndex, solution: [
          `Work backwards from the end, £${E} each. The LAST thing that happened was ${nB} doubling ${nA}'s money, so undo that: before this step ${nA} had half of £${E} = £${E / 2}, and ${nB} had the rest they gave away plus their own, £${E} + £${E / 2} = £${E * 1.5}.`,
          `Before that, ${nA} had doubled ${nB}'s money. Undo it: ${nB} had half of £${E * 1.5} = £${b1}, and ${nA} had £${E / 2} + £${b1} = £${a1}.`,
          `So ${nA} started with £${a1} and ${nB} started with £${b1}. Check: total is £${a1 + b1} = £${2 * E} throughout, as it must be (nobody adds or removes money, only exchanges it).`] };
      },
      // (b) livestream viewer-count chain incl. a percentage step (was: a second "I think of a number" chain)
      () => {
        const percPool = [
          { num: 6, den: 5, label: "increases by 20%" },
          { num: 4, den: 5, label: "drops by 20%" },
          { num: 3, den: 2, label: "increases by 50%" },
          { num: 9, den: 10, label: "drops by 10%" },
          { num: 11, den: 10, label: "increases by 10%" },
        ];
        const perc = pick(percPool);
        const x0 = rand(2, 10) * perc.den;
        let v = x0 * perc.num / perc.den;
        if (!Number.isInteger(v)) return null;
        const addSub = pick(["add", "sub"]); const k2 = rand(3, 20);
        let v2 = addSub === "add" ? v + k2 : v - k2;
        if (v2 <= 0) return null;
        const m = pick([2, 3]); const v3 = v2 * m;
        if (v3 > 5000) return null;
        const R = v3;
        let back = R / m;
        back = addSub === "add" ? back - k2 : back + k2;
        back = back * perc.den / perc.num;
        if (back !== x0) return null;
        const distractors = [x0 + k2, x0 > k2 ? x0 - k2 : x0 + 7, R, v];
        const { options, correctIndex } = buildMC(x0, distractors);
        return { q: `A livestream's viewer count first ${perc.label}, then ${addSub === "add" ? `gains ${k2} more viewers` : `loses ${k2} viewers`}, and then the clip goes viral and the viewer count ${m === 2 ? "doubles" : "triples"}. It ends at ${R} viewers. How many viewers were watching at the start?`, options, correctIndex, solution: [
          `Undo the LAST step first: the count was multiplied by ${m}, so divide: ${R} ÷ ${m} = ${v2}.`,
          `Undo the middle step: ${v2} was reached by ${addSub === "add" ? `gaining ${k2} viewers` : `losing ${k2} viewers`}, so ${addSub === "add" ? `subtract ${k2}` : `add ${k2}`}: ${v2} ${addSub === "add" ? "−" : "+"} ${k2} = ${v}.`,
          `Undo the first step: a change that ${perc.label} means multiplying by ${perc.num}/${perc.den}, so to reverse it multiply by ${perc.den}/${perc.num} instead: ${v} × ${perc.den}/${perc.num} = ${x0}.`] };
      },
      // (c) three-stage fixed+fraction chain (three people share a sum)
      () => {
        const n = pick([3, 4, 5]);
        const k = rand(3, 20);
        const C = k * (n - 1);
        const f2 = rand(5, 30);
        const R1 = (C * n) / (n - 1) + f2;
        if (R1 % (n - 1) !== 0) return null;
        const f1 = rand(5, 30);
        const T = (R1 * n) / (n - 1) + f1;
        if (!Number.isInteger(T) || T <= 0 || T > 5000) return null;
        const afterA = T - f1; if (afterA <= 0) return null;
        const AmyTake = f1 + afterA / n; if (!Number.isInteger(AmyTake)) return null;
        const rest1 = T - AmyTake; if (rest1 !== R1) return null;
        const afterB = rest1 - f2; if (afterB <= 0) return null;
        const BenTake = f2 + afterB / n; if (!Number.isInteger(BenTake)) return null;
        const rest2 = rest1 - BenTake; if (rest2 !== C) return null;
        const [nA, nB] = NP(); const nC = pick(NAMES.filter(x => x !== nA && x !== nB));
        const frac = n === 3 ? "a third" : n === 4 ? "a quarter" : "a fifth";
        const { options, correctIndex } = buildMC(T, [T + f1, T - f2, C * n, R1], gbp);
        return { q: `A sum of money is divided between ${nA}, ${nB} and ${nC}. First ${nA} takes £${f1} plus ${frac} of what remains. Then ${nB} takes £${f2} plus ${frac} of what remains after that. Finally ${nC} takes what is left, which is £${C}. How much was the original sum?`, options, correctIndex, solution: [
          `Work backwards from ${nC}'s share. ${nC}'s £${C} is what's left after ${nB} took ${frac}, so it's ${n - 1} of ${n} equal parts of the amount ${nB} saw: that amount was £${R1}, so what remained after ${nA}'s turn was £${rest1} (£${R1} plus ${nB}'s fixed £${f2}).`,
          `Now undo ${nA}'s turn the same way: £${rest1} is ${n - 1} of ${n} parts of what ${nA} saw, so ${nA} saw £${R1}, and the original sum was £${R1} plus ${nA}'s fixed £${f1} = £${T}.`,
          `Original sum: £${T}. Check forwards: ${nA} takes £${f1}+£${afterA / n}=£${AmyTake}, leaving £${rest1}; ${nB} takes £${f2}+£${afterB / n}=£${BenTake}, leaving £${rest2}=£${C} for ${nC}. ✓`] };
      },
    ];
    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || G.workBackwards(d);
  },

  /* G11 — multi-rate word problem */
  multiRate(d) {
    const tier1 = [
      // (a) grouped-rate summation: different categories cycle at different rates
      () => {
        const nm = N1();
        const [n1, r1, n2, r2, n3, r3] = [rand(2, 4), 1, rand(2, 4), 2, rand(2, 4), 3];
        const days = rand(6, 15);
        const total = n1 * days + n2 * Math.floor(days / r2) + n3 * Math.floor(days / r3);
        const { options, correctIndex } = buildMC(total, [total - 5, total + 5, total - 10, n1 * days]);
        return { q: `On ${nm}'s farm there are ${n1 + n2 + n3} ducks. ${n1} ducks each lay one egg every day. ${n2} ducks each lay one egg every ${r2} days. ${n3} ducks each lay one egg every ${r3} days. How many eggs are laid in ${days} days?`, options, correctIndex, solution: [
          `Group 1: ${n1}×${days} = ${n1 * days} eggs.`, `Group 2: ${n2}×${Math.floor(days / r2)} = ${n2 * Math.floor(days / r2)} eggs.`,
          `Group 3: ${n3}×${Math.floor(days / r3)} = ${n3 * Math.floor(days / r3)} eggs. Total: ${total}.`] };
      },
      // (b) best buy: convert to a unit rate to compare value, not totals
      () => {
        const item = pick(["pencils", "erasers", "stickers", "balloons", "marbles"]);
        const aCount = rand(4, 9), aPencePrice = rand(80, 250);
        const bCount = rand(aCount + 2, aCount + 8), bPencePrice = rand(aPencePrice, aPencePrice + 150);
        const rateA = aPencePrice / aCount, rateB = bPencePrice / bCount;
        if (Math.abs(rateA - rateB) < 1) return null;
        const cheaperRate = Math.min(rateA, rateB);
        const cheaperPack = rateA < rateB ? "A" : "B";
        const ansRounded = Math.round(cheaperRate * 10) / 10;
        const higherRounded = Math.round(Math.max(rateA, rateB) * 10) / 10;
        const naiveAvg = Math.round(((aPencePrice + bPencePrice) / (aCount + bCount)) * 10) / 10;
        const { options, correctIndex } = buildMC(ansRounded, [higherRounded, naiveAvg, ansRounded + 1, ansRounded - 1], x => x + "p");
        return { q: `A pack of ${aCount} ${item} costs ${aPencePrice}p. A pack of ${bCount} ${item} costs ${bPencePrice}p. What is the price per item in the better-value pack, to 1 decimal place?`, options, correctIndex, solution: [
          `Pack A: ${aPencePrice}p ÷ ${aCount} = ${rateA.toFixed(1)}p each.`, `Pack B: ${bPencePrice}p ÷ ${bCount} = ${rateB.toFixed(1)}p each.`,
          `Pack ${cheaperPack} is better value, at ${ansRounded}p each.`] };
      },
    ];
    const tier2 = [
      // (a) rates add when working the same way at once
      () => {
        const nPipes = pick([2, 3]);
        const rates = Array.from({ length: nPipes }, () => rand(3, 15));
        const combined = rates.reduce((s, x) => s + x, 0);
        const mins = rand(3, 12);
        const tank = combined * mins;
        const { options, correctIndex } = buildMC(mins, [mins + 2, mins - 1, Math.round(tank / rates[0]), mins * 2]);
        const names = ["first", "second", "third"];
        const desc = rates.map((r, i) => `The ${names[i]} pipe pours ${r} litres per minute`).join(". ") + ".";
        return { q: `${desc} All ${nPipes === 2 ? "two" : "three"} pipes pour into an empty tank at the same time. If the tank holds ${tank} litres, how long does it take to fill?`, options, correctIndex, solution: [
          `Combined rate = ${rates.join(" + ")} = ${combined} litres per minute.`, `Time = ${tank} ÷ ${combined} = ${mins} minutes.`] };
      },
      // (b) times, not rates: invent a job size to convert times into rates first (was: hoses filling a pool)
      () => {
        const t1 = pick([2, 3, 4, 6, 8]); const t2 = pick([3, 4, 6, 8, 9, 12].filter(x => x !== t1));
        const L = t1 * t2;
        const r1 = L / t1, r2 = L / t2;
        const combined = r1 + r2;
        const togetherExact = L / combined;
        const together = Math.round(togetherExact * 100) / 100;
        const { options, correctIndex } = buildMC(together, [t1, t2, Math.round(((t1 + t2) / 2) * 100) / 100, Math.round((together + 1) * 100) / 100], (v) => v.toFixed(2));
        return { q: `One gardener can mow a lawn alone in ${t1} hours. A second gardener can mow the same lawn alone in ${t2} hours. How long would it take the two gardeners working together (to 2 d.p.)?`, options, correctIndex, solution: [
          `Invent a lawn size both times divide, e.g. ${L} square metres.`, `First gardener: ${L}÷${t1} = ${r1} m²/hour. Second gardener: ${L}÷${t2} = ${r2} m²/hour.`,
          `Combined: ${r1}+${r2} = ${combined} m²/hour.`, `Time together = ${L} ÷ ${combined} = ${together} hours.`] };
      },
      // (c) rates that fight each other: a battery's charge vs. a draining app (was: a tap and a leak)
      () => {
        const chargeRate = rand(4, 9); const drainRate = rand(1, chargeRate - 2);
        const net = chargeRate - drainRate;
        const mins = rand(4, 12);
        const totalPercent = net * mins;
        const { options, correctIndex } = buildMC(mins, [Math.round(totalPercent / chargeRate), mins + drainRate, mins - 1, mins + 1]);
        return { q: `A phone's battery charges at ${chargeRate}% per minute while a game running in the background drains it at ${drainRate}% per minute, both happening at the same time. Starting from 0%, how many minutes does it take for the battery to gain ${totalPercent}%?`, options, correctIndex, solution: [
          `Net rate = ${chargeRate}% − ${drainRate}% = ${net}% per minute.`, `Time = ${totalPercent} ÷ ${net} = ${mins} minutes.`] };
      },
    ];
    const tier3 = [
      // (a) the weighted-average-speed trap: total distance ÷ total time, NEVER the average of the speeds
      () => {
        const d1 = rand(2, 6) * 10; const s1 = pick([20, 30, 40, 50, 60]);
        const d2 = rand(2, 6) * 10; const s2 = pick([20, 30, 40, 50, 60].filter(x => x !== s1));
        const t1 = d1 / s1; const t2 = d2 / s2;
        const totalDist = d1 + d2; const totalTime = t1 + t2;
        const avgSpeed = totalDist / totalTime;
        const naiveAvg = (s1 + s2) / 2;
        if (Math.abs(avgSpeed - naiveAvg) < 1) return null;
        const ansRounded = Math.round(avgSpeed * 10) / 10;
        const { options, correctIndex } = buildMC(ansRounded, [naiveAvg, Math.round(avgSpeed) + 5, Math.round(avgSpeed) - 5, Math.round(s1 + s2)], x => x + " mph");
        return { q: `A car travels ${d1} miles at ${s1} mph, then a further ${d2} miles at ${s2} mph. What is its average speed for the whole journey, to 1 decimal place?`, options, correctIndex, solution: [
          `Time for first leg = ${d1}÷${s1} = ${t1.toFixed(2)} hours. Time for second leg = ${d2}÷${s2} = ${t2.toFixed(2)} hours.`,
          `Average speed = TOTAL distance ÷ TOTAL time = ${totalDist} ÷ ${totalTime.toFixed(2)} = ${ansRounded} mph.`,
          `This is NOT the same as the average of the two speeds, ${naiveAvg} mph — the slower leg takes longer, so it counts for more.`] };
      },
      // (b) the rate itself changes partway through a fixed total
      () => {
        const initRate = rand(20, 40);
        const upgradeHours = rand(2, 5);
        const producedBeforeUpgrade = initRate * upgradeHours;
        const newRate = initRate + rand(10, 25);
        const hoursAfter = rand(2, 8);
        const remaining = newRate * hoursAfter;
        const totalItems = producedBeforeUpgrade + remaining;
        const totalHours = upgradeHours + hoursAfter;
        const { options, correctIndex } = buildMC(totalHours, [Math.round(upgradeHours + remaining / initRate), Math.round(totalItems / initRate), Math.round(totalItems / newRate), totalHours + 1].filter(x => Number.isFinite(x)));
        return { q: `A factory machine produces ${initRate} toys per hour. After ${upgradeHours} hours it is upgraded and then produces ${newRate} toys per hour. How many hours in total does it take to produce ${totalItems} toys?`, options, correctIndex, solution: [
          `Before the upgrade: ${initRate}×${upgradeHours} = ${producedBeforeUpgrade} toys.`,
          `Remaining: ${totalItems}−${producedBeforeUpgrade} = ${remaining} toys, at ${newRate}/hour: ${remaining}÷${newRate} = ${hoursAfter} hours.`,
          `Total time = ${upgradeHours}+${hoursAfter} = ${totalHours} hours.`] };
      },
      // (c) a linear rate equation: "if I'd caught mult times as many, that's extra more"
      () => {
        const [n1] = NP(); const mult = rand(2, 4); const extra = rand(12, 30);
        const x = extra / (mult - 1);
        if (!Number.isInteger(x) || x < 3) return null;
        const { options, correctIndex } = buildMC(x, [x + extra, x - 2, x + 4, mult * x]);
        return { q: `${n1} realised that if ${n1} had caught ${mult} times as many fish as ${n1} actually did, ${n1} would have had ${extra} more fish. How many fish did ${n1} catch?`, options, correctIndex, solution: [
          `Let x = fish caught. ${mult}x = x + ${extra}.`, `${mult - 1}x = ${extra}. x = ${x}.`] };
      },
    ];
    const tier4 = [
      // (a) three rates at once, two working with you and one working against — an extra rate to combine, not just bigger numbers
      () => {
        const fill1 = rand(4, 12), fill2 = rand(4, 12);
        const twoOnly = fill1 + fill2;
        const drainRate = rand(2, Math.max(2, twoOnly - 3));
        const net = twoOnly - drainRate;
        if (net <= 0) return null;
        const mins = rand(4, 14);
        const tank = net * mins;
        const naiveNet = twoOnly + drainRate;
        const { options, correctIndex } = buildMC(mins, [Math.round(tank / twoOnly), Math.round(tank / naiveNet), mins + drainRate, mins - 1]);
        return { q: `Three pipes are connected to an empty tank. The first pours in ${fill1} litres per minute and the second pours in ${fill2} litres per minute, but a leak drains ${drainRate} litres per minute the whole time. All three act at once. If the tank holds ${tank} litres, how long does it take to fill?`, options, correctIndex, solution: [
          `Combine the two filling rates first: ${fill1} + ${fill2} = ${twoOnly} litres per minute.`,
          `Then subtract the leak, since it works against the fill, not with it: ${twoOnly} − ${drainRate} = ${net} litres per minute net.`,
          `Time = ${tank} ÷ ${net} = ${mins} minutes.`] };
      },
      // (b) a rate that changes partway through AND needs converting from a time first — two escalations stacked, not one
      () => {
        const t1 = pick([4, 6, 8, 9, 12]); const t2 = pick([3, 4, 6, 8, 9, 12].filter(x => x !== t1));
        const L = t1 * t2;
        const rA = L / t1, rB = L / t2;
        const h = rand(1, t1 - 1);
        const doneAlone = rA * h;
        const remaining = L - doneAlone;
        const combined = rA + rB;
        if (remaining % combined !== 0) return null;
        const finishExtra = remaining / combined;
        const total = h + finishExtra;
        if (!Number.isInteger(total) || total <= 0) return null;
        const { options, correctIndex } = buildMC(total, [t1, t2, Math.round(h + remaining / rA), total + 1]);
        return { q: `A painter can paint a fence alone in ${t1} hours. The painter works alone for ${h} hours, then a second painter joins who could paint the same fence alone in ${t2} hours. Working together they finish the rest. How many hours does the whole job take, from start to finish?`, options, correctIndex, solution: [
          `Invent a fence size both times divide exactly, e.g. ${L} "units". First painter's rate: ${L}÷${t1} = ${rA} units/hour. Second painter's rate: ${L}÷${t2} = ${rB} units/hour.`,
          `Working alone for ${h} hours, the first painter does ${rA}×${h} = ${doneAlone} units, leaving ${remaining} units still to do.`,
          `Together their rate is ${rA}+${rB} = ${combined} units/hour, so the rest takes ${remaining}÷${combined} = ${finishExtra} hours.`,
          `Total time = ${h} + ${finishExtra} = ${total} hours.`] };
      },
      // (c) "who finishes first": two combined-rate calculations in one question, then a comparison
      () => {
        const V = pick([60, 72, 90, 96, 120, 144, 180]);
        const rA1 = rand(3, 10), rA2 = rand(3, 10);
        const combinedA = rA1 + rA2;
        if (V % combinedA !== 0) return null;
        const timeA = V / combinedA;
        const tPool = [3, 4, 5, 6, 8, 9, 10, 12];
        const tB1 = pick(tPool); const tB2 = pick(tPool.filter(x => x !== tB1));
        const timeB = (tB1 * tB2) / (tB1 + tB2);
        if (!Number.isInteger(timeB) || timeB === timeA) return null;
        const faster = timeA < timeB ? "A" : "B";
        const diff = Math.abs(timeA - timeB);
        const { options, correctIndex } = buildMC(diff, [timeA, timeB, diff + 1, diff > 1 ? diff - 1 : diff + 2].filter(x => Number.isFinite(x) && x >= 0));
        return { q: `Team A uses two pumps pouring ${rA1} and ${rA2} litres per minute into an empty ${V}-litre tank at the same time. Team B has two different pumps that could each fill that same ${V}-litre tank alone, in ${tB1} minutes and ${tB2} minutes respectively. Both teams start at the same moment. By how many minutes does the faster team finish first?`, options, correctIndex, solution: [
          `Team A's combined rate = ${rA1}+${rA2} = ${combinedA} litres/min, so Team A finishes in ${V}÷${combinedA} = ${timeA} minutes.`,
          `Team B's pumps have rates ${V}/${tB1} and ${V}/${tB2} litres/min; combining them, their time together is ${tB1}×${tB2}÷(${tB1}+${tB2}) = ${timeB} minutes.`,
          `Team ${faster} is faster, finishing ${diff} minute${diff === 1 ? "" : "s"} ahead of the other team.`] };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || G.multiRate(d);
  },

  /* G12 — inverse proportion */
  inverseProp(d) {
    const tier1 = [
      // (a) the classic fixed "pile" of work/food, shared among more or fewer
      () => {
        const nm = N1();
        const n2 = rand(4, 10);
        const days2 = rand(4, 12);
        const total = n2 * days2;
        const n1cands = [2, 3, 4, 5, 6, 7, 8].filter(x => x < n2 && total % x === 0);
        if (!n1cands.length) return null;
        const n1 = pick(n1cands);
        const days1 = total / n1;
        const { options, correctIndex } = buildMC(days2, [days2 + 2, days2 - 2, days1, Math.floor(total / (n1 + 1))]);
        return { q: `${nm} has enough food to last ${n1} cats for ${days1} days. ${nm} then finds ${n2 - n1} more stray cats and takes them home. Assuming each cat eats the same amount per day, how many days does the food last?`, options, correctIndex, solution: [
          `Total food = ${n1}×${days1} = ${total} cat-days.`, `With ${n2} cats: ${total}÷${n2} = ${days2} days.`] };
      },
      // (b) speed and time for a FIXED distance — a continuous version of the same see-saw
      () => {
        const dist = pick([60, 90, 120, 150, 180, 240]);
        const s1cands = [10, 12, 15, 20, 24, 30].filter(s => dist % s === 0);
        if (!s1cands.length) return null;
        const s1 = pick(s1cands);
        const t1 = dist / s1;
        const s2cands = [10, 12, 15, 20, 24, 30, 40, 45, 60].filter(s => s !== s1 && dist % s === 0);
        if (!s2cands.length) return null;
        const s2 = pick(s2cands);
        const t2 = dist / s2;
        const { options, correctIndex } = buildMC(t2, [t1, Math.round((t1 + t2) / 2), t2 + 1, t2 - 1].filter(x => x > 0));
        return { q: `A train covers a fixed distance of ${dist} miles. At ${s1} mph the journey takes ${t1} hours. How long would the journey take at ${s2} mph?`, options, correctIndex, solution: [
          `Distance is fixed: ${dist} miles.`, `Speed × time = distance, so time = ${dist}÷${s2} = ${t2} hours.`, `Check: ${s1}×${t1} = ${dist} = ${s2}×${t2}.`] };
      },
    ];
    const tier2 = [
      // (a) the constant of variation, stated abstractly: find k = xy first, then solve forward
      () => {
        const k = rand(2, 9) * rand(2, 9);
        const x1cands = [2, 3, 4, 5, 6].filter(x => k % x === 0);
        if (!x1cands.length) return null;
        const x1 = pick(x1cands);
        const y1 = k / x1;
        const x2cands = [2, 3, 4, 5, 6, 8, 9, 10, 12].filter(x => x !== x1 && k % x === 0);
        if (!x2cands.length) return null;
        const x2 = pick(x2cands);
        const y2 = k / x2;
        const { options, correctIndex } = buildMC(y2, [y1, Math.round(y1 * x2 / x1), y2 + 2, y2 - 2].filter(v => v > 0));
        return { q: `y is inversely proportional to x. When x = ${x1}, y = ${y1}. What is y when x = ${x2}?`, options, correctIndex, solution: [
          `Inverse proportion means xy is constant: k = ${x1}×${y1} = ${k}.`, `When x = ${x2}: y = ${k}÷${x2} = ${y2}.`] };
      },
      // (b) a fixed extra cost/time on top of an inversely-proportional part
      () => {
        const nm = N1();
        const fixedDays = rand(1, 3);
        const n2 = rand(4, 10); const workDays2 = rand(3, 9);
        const workPile = n2 * workDays2;
        const n1cands = [2, 3, 4, 5, 6, 7].filter(x => x < n2 && workPile % x === 0);
        if (!n1cands.length) return null;
        const n1 = pick(n1cands);
        const workDays1 = workPile / n1;
        const total1 = fixedDays + workDays1; const total2 = fixedDays + workDays2;
        const { options, correctIndex } = buildMC(total2, [total1, workDays2, total2 + fixedDays, total2 - 1].filter(x => x > 0));
        return { q: `Setting up a stage always takes ${fixedDays} fixed days, no matter how many people help. After that, ${n1} people can finish decorating the stage in ${workDays1} more days. How many total days would it take if ${n2} people did the decorating instead (fixed set-up time unchanged)?`, options, correctIndex, solution: [
          `Decorating is the part that depends on team size: ${n1}×${workDays1} = ${workPile} person-days.`,
          `With ${n2} people: ${workPile}÷${n2} = ${workDays2} days of decorating.`, `Total = fixed ${fixedDays} + ${workDays2} = ${total2} days.`] };
      },
    ];
    const tier3 = [
      // (a) the team changes partway through: track the pile in instalments
      () => {
        const n1 = rand(4, 7); const extra = rand(1, 4); const n2 = n1 + extra;
        const m = rand(1, 3);
        const remaining = n1 * n2 * m;
        const daysAfter = remaining / n2;
        const daysBefore = rand(2, 4);
        const doneBefore = n1 * daysBefore;
        const pile = doneBefore + remaining;
        const totalDays = pile / n1;
        const totalActual = daysBefore + daysAfter;
        const { options, correctIndex } = buildMC(totalActual, [totalDays, daysBefore + Math.round(remaining / n1), totalActual + 1, totalActual - 1].filter(x => x > 0));
        return { q: `${n1} builders can complete a wall in ${totalDays} days. They work for ${daysBefore} days, then ${n2 - n1} extra builders join them for the rest of the job. How many days in total does the wall take?`, options, correctIndex, solution: [
          `Whole job = ${n1}×${totalDays} = ${pile} builder-days.`, `First ${daysBefore} days: ${n1}×${daysBefore} = ${doneBefore} builder-days done, leaving ${remaining}.`,
          `Now ${n2} builders: ${remaining}÷${n2} = ${daysAfter} more days.`, `Total = ${daysBefore}+${daysAfter} = ${totalActual} days.`] };
      },
      // (b) comparing two simultaneous changes: workforce AND the job size both scale (was: a second wall of builders)
      () => {
        const n1 = rand(3, 8); const days1 = rand(4, 10);
        const pile = n1 * days1;
        const workerMult = pick([2, 3]);
        const jobMult = pick([2, 3]);
        const n2 = n1 * workerMult;
        const newPile = pile * jobMult;
        if (newPile % n2 !== 0) return null;
        const days2 = newPile / n2;
        const { options, correctIndex } = buildMC(days2, [days1, days1 * jobMult, Math.max(Math.round(days1 / workerMult), 1), days2 + 1]);
        return { q: `${n1} bakers can bake a standard batch of wedding cakes in ${days1} days. A bigger wedding needs ${jobMult} times as many cakes, and ${workerMult} times as many bakers are hired to help make them. How many days does the bigger order take?`, options, correctIndex, solution: [
          `Standard batch = ${n1}×${days1} = ${pile} baker-days. An order ${jobMult}× as big needs ${jobMult}× the baker-days: ${newPile}.`,
          `With ${n2} bakers (${workerMult}× as many): ${newPile}÷${n2} = ${days2} days.`,
          `Bakers increased ${workerMult}×, order grew ${jobMult}×, so days scaled by ${jobMult}/${workerMult} from the original ${days1}.`] };
      },
    ];
    const tier4 = [
      // (a) a fixed non-scaling part AND two simultaneous changes (team size and job size) at once
      () => {
        const fixedDays = rand(1, 3);
        const n1 = rand(3, 6); const days1 = rand(4, 8);
        const paintPile = n1 * days1;
        const workerMult = pick([2, 3]);
        const jobMult = pick([2, 3]);
        const n2 = n1 * workerMult;
        const newPaintPile = paintPile * jobMult;
        if (newPaintPile % n2 !== 0) return null;
        const paintDays2 = newPaintPile / n2;
        const total1 = fixedDays + days1;
        const total2 = fixedDays + paintDays2;
        const { options, correctIndex } = buildMC(total2, [total1, days1 * jobMult + fixedDays, paintDays2, total2 + fixedDays].filter(x => x > 0));
        return { q: `Preparing the plaster for a mural always takes a fixed ${fixedDays} days, however many muralists work on it. After that, ${n1} muralists can paint a standard-size mural in ${days1} more days. A gallery orders a mural ${jobMult} times the size, and hires ${workerMult} times as many muralists to paint it. Including the fixed preparation time, how many days does the whole job take?`, options, correctIndex, solution: [
          `Painting work only scales with team size: standard job = ${n1}×${days1} = ${paintPile} muralist-days.`,
          `A job ${jobMult}× the size needs ${jobMult}× the muralist-days: ${newPaintPile}.`,
          `With ${n2} muralists (${workerMult}× as many): ${newPaintPile}÷${n2} = ${paintDays2} days of painting.`,
          `Preparation is fixed and doesn't scale with team size: total = ${fixedDays} + ${paintDays2} = ${total2} days.`] };
      },
      // (b) the "pile" itself must be pieced together from two given states before it can be applied to a third
      () => {
        const n1 = rand(3, 6); const extra = rand(2, 4); const n2 = n1 + extra;
        const daysBefore = rand(2, 4);
        const doneBefore = n1 * daysBefore;
        const m = rand(1, 3);
        const remaining = n1 * n2 * m;
        const daysAfter = remaining / n2;
        const pile = doneBefore + remaining;
        const n3cands = [2, 3, 4, 5, 6, 7, 8, 9, 10].filter(x => pile % x === 0 && x !== n1 && x !== n2);
        if (!n3cands.length) return null;
        const n3 = pick(n3cands);
        const days3 = pile / n3;
        const { options, correctIndex } = buildMC(days3, [Math.round(pile / n1), Math.round(pile / n2), days3 + 1, days3 - 1].filter(x => x > 0));
        return { q: `${n1} volunteers start clearing a footpath. After ${daysBefore} days, ${extra} more volunteers join, and together they finish the job ${daysAfter} days later. A different village wants to clear an identical footpath from scratch, using a team of ${n3} volunteers throughout. How many days will they need?`, options, correctIndex, solution: [
          `First piece together the size of the job: ${n1}×${daysBefore} = ${doneBefore} volunteer-days done before the team grew.`,
          `Then ${n2}×${daysAfter} = ${remaining} more volunteer-days, so the whole job = ${doneBefore}+${remaining} = ${pile} volunteer-days.`,
          `A team of ${n3} volunteers working throughout: ${pile}÷${n3} = ${days3} days.`] };
      },
    ];
    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || G.inverseProp(d);
  },

  /* G13 — sport score deduction */
  /* G13 — sport score deduction: every tier turns a sentence about goals or
     points into an equation (or a direct calculation) and solves it. The
     tiers deliberately use DIFFERENT deduction shapes (half-time swing, total
     + difference, points-table algebra, a running commentary, a fixed-margin
     round-robin, elimination-by-property) so the underlying skill — translate
     the story into arithmetic, then check it — has to be re-derived each
     time rather than pattern-matched from the wording. */
  sportScore(d) {
    const TEAMS = ["Hawks","Eagles","Lions","Tigers","Wolves","Bears","Foxes","Sharks","Rovers","United"];
    const twoTeams = () => shuffle(TEAMS).slice(0, 2);
    const isPrime = (x) => { if (x < 2) return false; for (let i = 2; i * i <= x; i++) if (x % i === 0) return false; return true; };

    const tier1 = [
      // (a) first-half deficit, second-half comeback to win
      () => {
        const total = rand(5, 9); const h2 = rand(2, 4);
        let home_h1, away_h1;
        for (let hh = 0; hh <= total; hh++) { const ah = total - hh; if (ah > hh && hh + h2 > ah) { home_h1 = hh; away_h1 = ah; break; } }
        if (home_h1 === undefined) return null;
        const home_total = home_h1 + h2, away_total = away_h1;
        const { options, correctIndex } = buildMC(home_total, [home_total + 1, away_total, home_h1, h2], x => `${x}-${away_total}`);
        return { q: `In a hockey match, ${total} goals were scored in the first half and the away team was leading at half-time. In the second half, the home team scored ${h2} goals and won. How many goals did the home team score altogether?`, options, correctIndex, solution: [`First half: home ${home_h1}, away ${away_h1} (away leading).`, `Second half: home adds ${h2} more, giving home ${home_total}, away ${away_total}. Home wins, as required.`, `The home team scored ${home_total} goals altogether.`] };
      },
      // (b) total goals + winning margin -> final score (sum-and-difference)
      () => {
        const total = rand(5, 13); const margin = pick([1, 2, 3, 4, 5]);
        if ((total + margin) % 2 !== 0) return null;
        const winner = (total + margin) / 2, loser = (total - margin) / 2;
        if (loser < 0 || winner <= loser) return null;
        const [tA, tB] = twoTeams();
        const ans = `${winner}-${loser}`;
        const candidates = [`${winner + 1}-${Math.max(loser - 1, 0)}`, `${winner - 1}-${loser + 1}`, `${loser}-${winner}`, `${Math.ceil(total / 2)}-${Math.floor(total / 2)}`, `${winner + 1}-${loser}`, `${winner}-${Math.max(loser - 1, 0)}`];
        const decoys = [...new Set(candidates)].filter(s => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `${tA} played ${tB}. Between them, ${total} goals were scored, and ${tA} won by a margin of ${margin} goal${margin === 1 ? "" : "s"}. What was the final score (${tA} first)?`, options, correctIndex, solution: [`Let ${tA}'s score be w and ${tB}'s be l.`, `w + l = ${total} (total goals) and w − l = ${margin} (winning margin).`, `Adding the two equations: 2w = ${total + margin}, so w = ${winner}.`, `Then l = ${total} − ${winner} = ${loser}.`, `Final score: ${tA} ${winner}-${loser} ${tB}.`] };
      },
    ];

    const tier2 = [
      // (a) points-table single-team deduction: w+d+l=G, 3w+d=P — verified UNIQUE
      // by brute-forcing every value of w, exactly like truthLiars checks every
      // truth/lie assignment before accepting a puzzle.
      () => {
        const G2 = rand(6, 14);
        const wTrue = rand(1, G2 - 1); const dTrue = rand(0, G2 - wTrue); const lTrue = G2 - wTrue - dTrue;
        const P = 3 * wTrue + dTrue;
        const solutions = [];
        for (let w = 0; w <= G2; w++) { const dd = P - 3 * w; if (dd < 0) continue; const l = G2 - w - dd; if (l < 0) continue; solutions.push([w, dd, l]); }
        if (solutions.length !== 1) return null;
        const [w, dd, l] = solutions[0];
        const target = pick(["w", "d", "l"]);
        const answer = target === "w" ? w : target === "d" ? dd : l;
        const verb = target === "w" ? "win" : target === "d" ? "draw" : "lose";
        const past = target === "w" ? "won" : target === "d" ? "drew" : "lost";
        const { options, correctIndex } = buildMC(answer, [answer + 1, answer - 1, answer + 2, Math.max(answer - 2, 0)]);
        return { q: `A team plays ${G2} games, earning 3 points for a win, 1 for a draw and 0 for a loss. They finish with ${P} points. How many games did they ${verb}?`, options, correctIndex, solution: [`Let w = wins, d = draws, l = losses. w + d + l = ${G2} and 3w + d = ${P}.`, `Testing values of w in turn, only w = ${w} gives whole, non-negative d and l.`, `w = ${w}, d = ${dd}, l = ${l}. Check: ${w}+${dd}+${l} = ${G2} games; 3×${w}+${dd} = ${P} points.`, `The team ${past} ${answer} game${answer === 1 ? "" : "s"}.`] };
      },
      // (b) a running commentary of score updates — lead, level, re-lead
      () => {
        const [nm] = NP();
        const lead1 = rand(1, 3); const finalMargin = rand(1, 3);
        const homeTotal = lead1 + finalMargin, awayTotal = lead1;
        const ans = `${homeTotal}-${awayTotal}`;
        const candidates = [`${homeTotal - 1}-${awayTotal}`, `${homeTotal}-${awayTotal + 1}`, `${homeTotal + 1}-${awayTotal + 1}`, `${awayTotal}-${homeTotal}`, `${homeTotal + 1}-${awayTotal}`, `${homeTotal}-${Math.max(awayTotal - 1, 0)}`];
        const decoys = [...new Set(candidates)].filter(s => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `${nm} watched a match. The home team took an early lead of ${lead1}-0. The away team then scored ${lead1} unanswered goals to level the match. The home team then scored ${finalMargin} more goal${finalMargin === 1 ? "" : "s"} without reply to win. What was the final score (home first)?`, options, correctIndex, solution: [`Home leads ${lead1}-0.`, `Away levels it: ${lead1}-${lead1}.`, `Home scores ${finalMargin} more: ${homeTotal}-${awayTotal}.`, `Final score: ${homeTotal}-${awayTotal}.`] };
      },
    ];

    const tier3 = [
      // (a) constant-margin round-robin: every win by the SAME scoreline, with a
      // wide, genuinely varied answer space (fixes the old bug where only 3
      // scorelines were ever possible).
      () => {
        const sPer = rand(1, 6); const cPer = rand(0, sPer - 1);
        const games = 3; const S = sPer * games, C = cPer * games;
        const [tA] = twoTeams();
        const ans = `${sPer}-${cPer}`;
        const candidates = [`${sPer + 1}-${cPer}`, `${sPer}-${cPer + 1}`, `${Math.max(sPer - 1, 0)}-${cPer}`, `${Math.round(S / games)}-${Math.round(C / games) + 1}`, `${sPer + 1}-${cPer + 1}`, `${S}-${C}`];
        const decoys = [...new Set(candidates)].filter(s => s !== ans).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `${tA} won all ${games} of their games by exactly the same scoreline every time, scoring ${S} goals in total and conceding ${C} in total. What was the score in each of ${tA}'s matches (${tA} first)?`, options, correctIndex, solution: [`${tA} scored (and conceded) the same amount every game, so each match's score is (total scored ÷ ${games}) to (total conceded ÷ ${games}).`, `${S} ÷ ${games} = ${sPer}. ${C} ÷ ${games} = ${cPer}.`, `Every one of ${tA}'s wins was by the score ${sPer}-${cPer}.`] };
      },
      // (b) eliminate candidate scorelines via a property test (prime / total)
      () => {
        const total = rand(6, 14);
        let h, a, tries = 0;
        do { h = rand(0, total); a = total - h; tries++; } while (!isPrime(h) && tries < 80);
        if (!isPrime(h)) return null;
        const decoySet = new Set(); const decoys = [];
        for (let hh = 0; hh <= total && decoys.length < 4; hh++) {
          if (hh === h) continue;
          if (!isPrime(hh)) { const key = `${hh}-${total - hh}`; if (!decoySet.has(key)) { decoySet.add(key); decoys.push(key); } }
        }
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(`${h}-${a}`, decoys);
        return { q: `In a match, a total of ${total} goals were scored. The home team's score was a prime number. Which of these could be the final score (home first)?`, options, correctIndex, solution: [`The two scores must add to ${total}.`, `Check each option's home score for being prime: only ${h} is prime among the candidates shown.`, `So the score must be ${h}-${a}.`] };
      },
    ];

    const tier4 = [
      // (a) sum-and-product: harder than tier1's sum-and-difference because the
      // two scores must be found from their SUM and PRODUCT (an implicit
      // quadratic), and every whole-number pair adding to the total must be
      // checked against the product clue before one can be picked out.
      () => {
        const w = rand(5, 9); const l = rand(1, w - 2);
        if (w <= l) return null;
        const total = w + l, product = w * l;
        const [tA, tB] = twoTeams();
        const ans = `${w}-${l}`;
        const candidates = [];
        for (let hh = 0; hh <= total; hh++) { const aa = total - hh; if (hh * aa !== product) candidates.push(`${hh}-${aa}`); }
        candidates.push(`${l}-${w}`);
        const decoys = shuffle([...new Set(candidates)].filter(s => s !== ans)).slice(0, 4);
        if (decoys.length < 4) return null;
        const { options, correctIndex } = buildMCStr(ans, decoys);
        return { q: `${tA} beat ${tB}. Between them the two teams scored ${total} goals, and the product of their two scores was ${product}. What was the final score (${tA} first)?`, options, correctIndex, solution: [`Let ${tA}'s score be h and ${tB}'s be a, so h + a = ${total} and h × a = ${product}.`, `Check the whole-number pairs adding to ${total} in turn and find the one whose product is ${product}: that pair is ${w} and ${l}.`, `${tA} won, so their score is the larger number, ${w}.`, `Final score: ${tA} ${w}-${l} ${tB}.`] };
      },
      // (b) points-table deduction with a second, independent clue: the points
      // equation alone gives SEVERAL surviving (w,d,l) triples (unlike tier2's
      // version, which is engineered to be unique on its own), so every
      // surviving triple must be checked against the extra "draws is prime"
      // clue too, not just the first one that fits the points total.
      () => {
        const G4 = rand(8, 16); const wTrue = rand(1, G4 - 3); const dTrue = pick([2, 3, 5, 7]);
        const lTrue = G4 - wTrue - dTrue;
        if (lTrue < 0) return null;
        const P4 = 3 * wTrue + dTrue;
        const solutions = [];
        for (let w = 0; w <= G4; w++) { const dd = P4 - 3 * w; if (dd < 0) continue; const l = G4 - w - dd; if (l < 0) continue; solutions.push([w, dd, l]); }
        if (solutions.length < 2) return null;
        const survivors = solutions.filter(([, dd]) => isPrime(dd));
        if (survivors.length !== 1) return null;
        const [w, dd, l] = survivors[0];
        const decoys = [...new Set(solutions.filter(([ww]) => ww !== w).map(([ww]) => ww))];
        const { options, correctIndex } = buildMC(w, decoys);
        return { q: `A team plays ${G4} games, gaining 3 points for a win, 1 for a draw and 0 for a loss, and finishes with ${P4} points. The number of games they drew is also a prime number. How many games did they win?`, options, correctIndex, solution: [`Let w = wins, d = draws, l = losses, with w + d + l = ${G4} and 3w + d = ${P4}.`, `Testing values of w in turn gives more than one whole-number solution for d and l, so the points total alone does not pin down the answer.`, `Only one of those solutions also has a prime number of draws: w = ${w}, d = ${dd} (prime), l = ${l}.`, `Check every clue: ${w}+${dd}+${l} = ${G4} games; 3×${w}+${dd} = ${P4} points; and ${dd} is prime, as required.`, `The team won ${w} game${w === 1 ? "" : "s"}.`] };
      },
    ];

    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || G.sportScore(d);
  },

  /* G14 — clock arithmetic */
  clockArith(d) {
    const nm=N1();
    if (d <= 1) {
      const sub = rand(0,2);
      if (sub === 0) {
      // pills every m minutes, find time of kth pill
      const m=pick([30,45,60,75,90]); const k=rand(3,5);
      const startH=rand(8,12),startM=rand(0,3)*5;
      const totalMins=startH*60+startM+(k-1)*m;
      const endH=Math.floor(totalMins/60)%24; const endM=totalMins%60;
      const ans=`${String(endH).padStart(2,"0")}:${String(endM).padStart(2,"0")}`;
      const off1=`${String((endH+1)%24).padStart(2,"0")}:${String(endM).padStart(2,"0")}`;
      const off2=`${String(endH).padStart(2,"0")}:${String((endM+15)%60).padStart(2,"0")}`;
      const off3=`${String((endH-1+24)%24).padStart(2,"0")}:${String(endM).padStart(2,"0")}`;
      const {options,correctIndex}=buildMCStr(ans,[off1,off2,off3,`${String(endH).padStart(2,"0")}:${String((endM+30)%60).padStart(2,"0")}`]);
      return { q:`A doctor tells ${nm} to take a tablet every ${m} minutes. ${nm} takes the first tablet at ${String(startH).padStart(2,"0")}:${String(startM).padStart(2,"0")}. At what time does ${nm} take the ${k===3?"third":k==="4"?"fourth":"fifth"} tablet?`, options, correctIndex, solution:[`Each tablet is ${m} minutes after the last.`, `Tablet 1: ${String(startH).padStart(2,"0")}:${String(startM).padStart(2,"0")}. ${k-1} more tablets = ${(k-1)*m} minutes later.`, `Answer: ${ans}.`] };
      }
      if (sub === 1) {
        // (a2) elapsed duration between two given clock times — subtraction, not projection,
        // and can cross midnight, which is the genuinely different skill here.
        const startH2=rand(8,23), startM2=pick([0,5,10,15,20,25,30,35,40,45,50,55]);
        const durMins=rand(40,600);
        const startTotal=startH2*60+startM2;
        const endTotal=(startTotal+durMins)%(24*60);
        const endH2=Math.floor(endTotal/60), endM2=endTotal%60;
        const crossesMidnight = startTotal+durMins >= 24*60;
        const hh=Math.floor(durMins/60), mm=durMins%60;
        const durStr = mm===0 ? `${hh} hours` : `${hh} hours ${mm} minutes`;
        const {options,correctIndex}=buildMC(durMins,[durMins+60,durMins-60,durMins+30,durMins-30].filter(x=>x!==durMins&&x>0));
        return { q:`${nm}'s train departs at ${String(startH2).padStart(2,"0")}:${String(startM2).padStart(2,"0")} and arrives at ${String(endH2).padStart(2,"0")}:${String(endM2).padStart(2,"0")}${crossesMidnight?" the next day":""}. How many minutes does the journey take?`, options, correctIndex, solution:[`From ${String(startH2).padStart(2,"0")}:${String(startM2).padStart(2,"0")} to midnight${crossesMidnight?"":" (no midnight crossing needed here)"}${crossesMidnight?`, then on to ${String(endH2).padStart(2,"0")}:${String(endM2).padStart(2,"0")}`:""}.`, `Total journey time: ${durStr} = ${durMins} minutes.`] };
      }
      // (a3) 12-hour AM/PM alarm set a fixed time before an event — tests 12-to-24-hour
      // conversion and crossing the noon/midnight AM-PM boundary.
      const eventH12 = rand(1,12); const eventM = pick([0,15,30,45]); const eventPM = pick([true,false]);
      const before = pick([20,30,45,60,90,120]);
      const eventH24 = eventPM ? (eventH12===12?12:eventH12+12) : (eventH12===12?0:eventH12);
      const eventTotal = eventH24*60+eventM;
      const alarmTotal = ((eventTotal - before) % (24*60) + 24*60) % (24*60);
      const alarmH = Math.floor(alarmTotal/60), alarmM = alarmTotal%60;
      const ans2 = `${String(alarmH).padStart(2,"0")}:${String(alarmM).padStart(2,"0")}`;
      const decoys2 = [
        `${String((alarmH+1)%24).padStart(2,"0")}:${String(alarmM).padStart(2,"0")}`,
        `${String(alarmH).padStart(2,"0")}:${String((alarmM+15)%60).padStart(2,"0")}`,
        `${String((alarmH+12)%24).padStart(2,"0")}:${String(alarmM).padStart(2,"0")}`,
        `${String((alarmH-1+24)%24).padStart(2,"0")}:${String(alarmM).padStart(2,"0")}`,
      ];
      const {options,correctIndex}=buildMCStr(ans2,decoys2);
      return { q:`${nm} has an event at ${eventH12}:${String(eventM).padStart(2,"0")} ${eventPM?"pm":"am"}, and sets an alarm ${before} minutes before it. Using the 24-hour clock, what time does the alarm go off?`, options, correctIndex, solution:[`${eventH12}:${String(eventM).padStart(2,"0")} ${eventPM?"pm":"am"} in 24-hour time is ${String(eventH24).padStart(2,"0")}:${String(eventM).padStart(2,"0")}.`, `${before} minutes earlier is ${ans2}.`] };
    }
    if (d <= 2) {
      // watch gaining: slow at 8am, fast at 4pm, when correct?
      const [slow,fast]=[rand(2,5),rand(4,9)]; // slow by 'slow' mins at t1, fast by 'fast' at t2
      const t1=8*60,t2=16*60; // 8am to 4pm = 480 mins
      // watch gains (slow+fast) mins over 480 mins; starts (slow) behind
      // correct when gained 'slow' mins: time = slow*480/(slow+fast) mins after t1
      const totalGain=slow+fast; const correctAfter=Math.round(slow*480/totalGain);
      const correctTime=t1+correctAfter; const ch=Math.floor(correctTime/60); const cm=correctTime%60;
      const ans=`${ch}:${String(cm).padStart(2,"0")}`;
      const off1=`${ch}:${String((cm+10)%60).padStart(2,"0")}`;
      const off2=`${ch+1}:${String(cm).padStart(2,"0")}`;
      const off3=`${ch-1}:${String(cm).padStart(2,"0")}`;
      const {options,correctIndex}=buildMCStr(ans,[off1,off2,off3,`${ch}:${String((cm+20)%60).padStart(2,"0")}`]);
      return { q:`At 08:00, ${nm}'s watch was ${slow} minutes slow. By 16:00 on the same day it was ${fast} minutes fast. At what time did it show the correct time?`, options, correctIndex, solution:[`The watch gained ${slow+fast} minutes over ${(t2-t1)/60} hours (${t2-t1} minutes).`, `It needed to gain ${slow} minutes to catch up: takes ${correctAfter} minutes.`, `08:00 + ${correctAfter} minutes = ${ans}.`] };
    }
    // d3/d4: time zones — offsets are per-triple and match each city's real relationship
    // to London (Tokyo/Sydney are AHEAD, not behind, unlike New York), and every displayed
    // clock time is wrapped mod 24 so nothing like "25:00" can ever show up.
    const wrap24=(x)=>((x%24)+24)%24;
    const cityData=[
      { names:["London","Madrid","New York"], off2:1, off3Range:[-6,-4] },
      { names:["London","Paris","Tokyo"], off2:1, off3Range:[8,9] },
      { names:["London","Dubai","Sydney"], off2:4, off3Range:[9,11] },
    ];
    const cd=pick(cityData); const [c1,c2,c3]=cd.names;
    const off2=cd.off2, off3=rand(cd.off3Range[0],cd.off3Range[1]);
    const event_h=rand(13,20); const bedH=rand(20,23);
    const c2Shown=wrap24(event_h+off2), c3Shown=wrap24(event_h+off3);
    const madridTime=wrap24(bedH-off3+off2);
    const {options,correctIndex}=buildMC(madridTime,[wrap24(madridTime+1),wrap24(madridTime-1),wrap24(madridTime+6),wrap24(madridTime+12)],h=>`${h}:00`);
    return { q:`When it is ${event_h}:00 in ${c1}, it is ${c2Shown}:00 in ${c2} and ${c3Shown}:00 in ${c3}. Someone goes to bed in ${c3} at ${bedH}:00. What time is it in ${c2} at that instant?`, options, correctIndex, solution:[`${c3} is ${off3} hours ${off3<0?"behind":"ahead of"} ${c1} (as a signed offset, ${off3>0?"+":""}${off3}). ${c2} is ${off2} hours ahead.`, `${bedH}:00 in ${c3} = ${wrap24(bedH-off3)}:00 in ${c1} = ${madridTime}:00 in ${c2}.`] };
  },


  // dateDigit retired as a standalone topic — its date-digit-sum scenario now lives inside
  // digitDetective (see the dateDigitScenario() helper used there), with a max/min toggle
  // added for a little more life now that it's one of several scenarios rather than the
  // only question this topic key ever asked.

  /* G17 — multi-step angle chain with parallel lines */
  angleParallel(d) {
    const rad=Math.PI/180;
    const R=(n)=>Math.round(n);
    const bis=(u,v)=>{const bx=u[0]+v[0],by=u[1]+v[1];const l=Math.hypot(bx,by);return [bx/l,by/l];};

    /* ---- Variant 1 (d1): one transversal, one angle given; x is corresponding or co-interior ---- */
    if (d<=1) {
      const a=rand(35,65);
      const ca=Math.cos(a*rad), sa=Math.sin(a*rad);
      const T={x:105,y:60};
      const V={x:T.x+100*ca/sa, y:160};
      const ext=28;
      const t1={x:T.x-ext*ca,y:T.y-ext*sa}, t2={x:V.x+ext*ca,y:V.y+ext*sa};
      const mode=pick(["corr","coint","alt"]);
      const needed = mode==="coint" ? 180-a : a;
      const aB=bis([-ca,-sa],[-1,0]);
      // corresponding: x at V on the SAME side as a at T (both "left-ish" of the transversal).
      // co-interior: x at V on the same side too, but supplementary. alternate: x at V on the
      // OPPOSITE side of the transversal from a — same value as a, different position, hence
      // a genuinely different angle FACT (equal because of the Z-shape, not the F-shape).
      const xB = mode==="alt" ? bis([ca,sa],[1,0]) : (mode==="corr" ? bis([-ca,-sa],[-1,0]) : bis([-ca,-sa],[1,0]));
      const off=22;
      const svg=svgBox(
        SL(20,60,260,60)+SL(20,160,260,160)+
        SL(R(t1.x),R(t1.y),R(t2.x),R(t2.y))+
        ST(R(T.x+aB[0]*off),R(T.y+aB[1]*off)+4,`${a}°`,undefined,13)+
        ST(55,172,"P",undefined,13)+
        ST(R(V.x+xB[0]*(off+4)),R(V.y+xB[1]*(off+4))+4,"x°",undefined,14,"#7c5cff",700)+
        ST(235,52,"Q",undefined,13),
        280,215
      );
      const {options,correctIndex}=buildMC(needed,[180-needed,needed+10,needed-10,90],deg);
      const sol = mode==="corr"
        ? [`The marked angles are corresponding angles (an F shape).`,`Corresponding angles between parallel lines are equal.`,`x = ${a}°.`]
        : mode==="coint"
        ? [`The marked angles are co-interior (a C shape between the parallel lines).`,`Co-interior angles add to 180°.`,`x = 180° − ${a}° = ${needed}°.`]
        : [`The marked angles are alternate angles (a Z shape), on opposite sides of the transversal between the parallel lines.`,`Alternate angles between parallel lines are equal.`,`x = ${a}°.`];
      return { q:`In the diagram, the two horizontal lines are parallel. Find the value of x.`, options, correctIndex, svg, solution:sol };
    }

    /* ---- Variant 2 (d2): Z-point — two segments meet between the lines, x = a + b ---- */
    if (d<=2) {
      const a=rand(25,55); let b=rand(20,50);
      const ca=Math.cos(a*rad), sa=Math.sin(a*rad);
      const cb=Math.cos(b*rad), sb=Math.sin(b*rad);
      const M={x:130,y:110};
      const A={x:M.x+50*ca/sa, y:60};    // segment M→A rises at a°, meets top line
      const B={x:M.x+50*cb/sb, y:160};   // segment M→B falls at b°, meets bottom line
      const off=22;
      const aB=bis([-ca,sa],[-1,0]);     // at A: wedge between ray A→M and leftward line = a
      const bB=bis([-cb,-sb],[-1,0]);    // at B: wedge between ray B→M and leftward line = b
      const xB=bis([ca,-sa],[cb,sb]);    // at M: wedge between M→A and M→B = a+b
      const svg=svgBox(
        SL(20,60,260,60)+SL(20,160,260,160)+
        SL(R(M.x),R(M.y),R(A.x),60)+
        SL(R(M.x),R(M.y),R(B.x),160)+
        ST(R(A.x+aB[0]*off),R(A.y+aB[1]*off)+4,`${a}°`,undefined,13)+
        ST(55,172,"P",undefined,13)+
        ST(R(M.x+xB[0]*(off+4)),R(M.y+xB[1]*(off+4))+4,"x°",undefined,14,"#7c5cff",700)+
        ST(235,52,"Q",undefined,13)+
        ST(R(B.x+bB[0]*off),R(B.y+bB[1]*off)+4,`${b}°`,undefined,13),
        280,215
      );
      const needed=a+b;
      const {options,correctIndex}=buildMC(needed,[180-a-b,Math.abs(a-b),180-needed,needed+10],deg);
      return { q:`In the diagram, the two horizontal lines are parallel. Find the value of x.`, options, correctIndex, svg,
        solution:[
          `Draw a line through the middle point, parallel to both given lines.`,
          `Alternate angles with the top line give ${a}°; alternate angles with the bottom line give ${b}°.`,
          `x = ${a}° + ${b}° = ${needed}°.`
        ]
      };
    }

    /* ---- Variant 4 (d3/d4, picked alongside variant 3): co-interior angles given only by
       their DIFFERENCE, not a direct value — requires setting up and solving an equation
       (p + (p+k) = 180) rather than a direct substitution, a genuinely harder cognitive step. */
    if (pick([true,false])) {
      const k = rand(10,40);
      const smaller = (180-k)/2;
      if (!Number.isInteger(smaller) || smaller<=0) return G.angleParallel(d);
      const larger = smaller+k;
      const {options,correctIndex}=buildMC(larger,[smaller,90,larger+10,larger-10],deg);
      return { q:`Two co-interior (supplementary) angles between a pair of parallel lines differ by ${k}°. What is the LARGER of the two angles?`, options, correctIndex, solution:[`Let the smaller angle be p. The larger is p + ${k} (since they differ by ${k}°).`, `Co-interior angles sum to 180°: p + (p + ${k}) = 180, so 2p = ${180-k}, giving p = ${smaller}.`, `The larger angle is ${smaller} + ${k} = ${larger}°.`] };
    }

    /* ---- Variant 3 (d3/d4): transversal + splitting ray, x = 180 − a − b ---- */
    const a=rand(40,60); let b=rand(25,45);
    if(b===a) b=a-8;
    const ca=Math.cos(a*rad), sa=Math.sin(a*rad);
    const cb=Math.cos(b*rad), sb=Math.sin(b*rad);
    const T={x:105,y:60};
    const V={x:T.x+100*ca/sa, y:160};
    const ext=28;
    const t1={x:T.x-ext*ca,y:T.y-ext*sa}, t2={x:V.x+ext*ca,y:V.y+ext*sa};
    const rayEnd={x:V.x+55*cb, y:V.y-55*sb};
    const off=22;
    const aB=bis([-ca,-sa],[-1,0]);
    const bB=bis([cb,-sb],[1,0]);
    const xB=bis([-ca,-sa],[cb,-sb]);
    const svg=svgBox(
      SL(20,60,260,60)+SL(20,160,260,160)+
      SL(R(t1.x),R(t1.y),R(t2.x),R(t2.y))+
      SL(R(V.x),R(V.y),R(rayEnd.x),R(rayEnd.y))+
      ST(R(T.x+aB[0]*off),R(T.y+aB[1]*off)+4,`${a}°`,undefined,13)+
      ST(55,172,"P",undefined,13)+
      ST(R(V.x+xB[0]*(off+6)),R(V.y+xB[1]*(off+6))+4,"x°",undefined,14,"#7c5cff",700)+
      ST(235,52,"Q",undefined,13)+
      ST(R(V.x+bB[0]*(off+8)),R(V.y+bB[1]*(off+8))+4,`${b}°`,undefined,13),
      280,215
    );
    const needed=180-a-b;
    const {options,correctIndex}=buildMC(needed,[a+b,180-a,180-b,needed+10],deg);
    return { q:`In the diagram, the two horizontal lines are parallel. Find the value of x.`, options, correctIndex, svg,
      solution:[
        `Co-interior angles between parallel lines sum to 180°.`,
        `The full interior angle at the lower crossing = 180° − ${a}° = ${180-a}° (co-interior with ${a}°).`,
        `That angle is split into x° and ${b}° by the third line, so x = ${180-a}° − ${b}° = ${needed}°.`
      ]
    };
  },

  /* G18 — isosceles combined with exterior angle */
  angleIso(d) {
    const tier1 = [
      // (a) apex given -> base angles (direct half-sum)
      () => {
        const top = rand(20, 60) * 2; // even, 40-120
        const base = (180 - top) / 2;
        const svg = svgBox(
          `<polygon points="140,35 60,170 220,170" fill="none" stroke="#2a1a5e" stroke-width="2.5"/>` +
          ST(140, 60, `${top}°`, undefined, 13) +
          ST(78, 158, "x", undefined, 13) +
          ST(200, 158, "x", undefined, 13) +
          ST(140, 20, "A", undefined, 12) + ST(50, 182, "B", undefined, 12) + ST(230, 182, "C", undefined, 12),
          280, 205
        );
        const { options, correctIndex } = buildMC(base, [base + 5, base - 5, top / 2, 90 - base], deg);
        return { q: `Triangle ABC has AB = AC, and angle A = ${top}°. Find the size of angle B (marked x).`, options, correctIndex, svg, solution: [
          `AB = AC, so triangle ABC is isosceles, and the base angles at B and C are equal.`,
          `The three angles sum to 180°, so the two base angles together make 180° − ${top}° = ${180 - top}°.`,
          `Each base angle = ${180 - top}° ÷ 2 = ${base}°.`
        ] };
      },
      // (b) base angle given -> apex angle (direct)
      () => {
        const base = rand(20, 79);
        const apex = 180 - 2 * base;
        if (apex <= 0) return null;
        const svg = svgBox(
          `<polygon points="140,35 60,170 220,170" fill="none" stroke="#2a1a5e" stroke-width="2.5"/>` +
          ST(140, 60, "y", undefined, 13) +
          ST(78, 158, `${base}°`, undefined, 12) +
          ST(200, 158, `${base}°`, undefined, 12) +
          ST(140, 20, "A", undefined, 12) + ST(50, 182, "B", undefined, 12) + ST(230, 182, "C", undefined, 12),
          280, 205
        );
        const { options, correctIndex } = buildMC(apex, [apex + 10, apex - 10, base, 180 - base], deg);
        return { q: `Triangle ABC has AB = AC. Both base angles are ${base}°. Find angle A (marked y).`, options, correctIndex, svg, solution: [
          `AB = AC, so both base angles equal ${base}°.`,
          `The three angles sum to 180°.`,
          `Angle A = 180° − ${base}° − ${base}° = ${apex}°.`
        ] };
      },
      // (c) exterior angle at a base vertex, given the apex
      () => {
        const top = rand(20, 60) * 2;
        const base = (180 - top) / 2;
        const ext = top + base;
        const svg = svgBox(
          `<polygon points="140,35 60,170 220,170" fill="none" stroke="#2a1a5e" stroke-width="2.5"/>` +
          ST(140, 60, `${top}°`, undefined, 13) +
          ST(78, 158, "x", undefined, 13) +
          ST(200, 158, "x", undefined, 13) +
          SL(220, 170, 265, 170) +
          ST(245, 158, "y", undefined, 13),
          280, 205
        );
        const { options, correctIndex } = buildMC(ext, [ext + 5, 180 - ext, top, base + 10], deg);
        return { q: `The diagram shows an isosceles triangle with top angle ${top}°. Find the size of the exterior angle y.`, options, correctIndex, svg, solution: [
          `Base angles of the isosceles triangle: (180° − ${top}°) ÷ 2 = ${base}° each.`,
          `The exterior angle equals the sum of the two non-adjacent interior angles: ${top}° + ${base}° = ${ext}°.`
        ] };
      },
    ];
    const tier2 = [
      // (a) hidden isosceles: two radii of a circle + a chord
      () => {
        const central = rand(20, 60) * 2;
        const base = (180 - central) / 2;
        const r = 80, cx = 140, cy = 130;
        const half = central / 2, rad = Math.PI / 180;
        const bx = cx + r * Math.sin(half * rad), by = cy - r * Math.cos(half * rad);
        const cx2 = cx - r * Math.sin(half * rad), cy2 = cy - r * Math.cos(half * rad);
        const svg = svgBox(
          SC(cx, cy, r, "#c9bff0", 1.5) +
          SL(cx, cy, bx, by) + SL(cx, cy, cx2, cy2) + SL(bx, by, cx2, cy2) +
          ST(cx, cy + 18, `${central}°`, undefined, 12) +
          ST(cx, cy - 6, "O", undefined, 12) +
          ST(bx + 10, by - 2, "B", undefined, 12) + ST(cx2 - 14, cy2 - 2, "C", undefined, 12) +
          ST((bx + cx) / 2 + 6, (by + cy) / 2, "x", undefined, 12) +
          ST((cx2 + cx) / 2 - 10, (cy2 + cy) / 2, "x", undefined, 12),
          280, 240
        );
        const { options, correctIndex } = buildMC(base, [base + 5, central / 2, 90 - base, base - 5], deg);
        return { q: `O is the centre of a circle. B and C are points on the circumference, and angle BOC = ${central}°. The chord BC is drawn. Find the size of angle OBC (marked x).`, options, correctIndex, svg, solution: [
          `OB and OC are both radii of the same circle, so OB = OC, and triangle OBC is isosceles with apex O.`,
          `The base angles share 180° − ${central}° = ${180 - central}°.`,
          `Angle OBC = angle OCB = ${180 - central}° ÷ 2 = ${base}°.`
        ] };
      },
      // (b) line of symmetry from apex to base: given a base angle, find the angle between the symmetry line and the equal side
      () => {
        const base = rand(20, 70);
        const sym = 90 - base;
        const svg = svgBox(
          `<polygon points="140,35 60,170 220,170" fill="none" stroke="#2a1a5e" stroke-width="2.5"/>` +
          SL(140, 35, 140, 170, "#22c8b8", 2) +
          `<rect x="134" y="164" width="6" height="6" fill="none" stroke="#22c8b8" stroke-width="1.2"/>` +
          ST(78, 158, `${base}°`, undefined, 12) +
          ST(150, 70, "z", undefined, 13),
          280, 205
        );
        const { options, correctIndex } = buildMC(sym, [base, sym + 5, sym - 5, 2 * sym], deg);
        return { q: `Triangle ABC has AB = AC and base angle B = ${base}°. The line of symmetry from A meets the base BC at right angles at point M. Find angle BAM (marked z).`, options, correctIndex, svg, solution: [
          `The line of symmetry AM meets the base at a right angle, so triangle ABM has a 90° angle at M.`,
          `Triangle ABM's angles sum to 180°: angle B (${base}°) + angle M (90°) + angle BAM = 180°.`,
          `Angle BAM = 180° − 90° − ${base}° = ${sym}°.`
        ] };
      },
      // (c) inverse exterior-angle algebra: given the exterior angle, find the apex angle
      () => {
        const apex = rand(20, 60) * 2;
        const base = (180 - apex) / 2;
        const ext = (apex + 180) / 2;
        const svg = svgBox(
          `<polygon points="140,35 60,170 220,170" fill="none" stroke="#2a1a5e" stroke-width="2.5"/>` +
          ST(140, 60, "w", undefined, 13) +
          ST(78, 158, "x", undefined, 13) +
          ST(200, 158, "x", undefined, 13) +
          SL(220, 170, 265, 170) +
          ST(245, 158, `${ext}°`, undefined, 13),
          280, 205
        );
        const { options, correctIndex } = buildMC(apex, [apex + 10, apex - 10, ext, 180 - ext], deg);
        return { q: `Triangle ABC has AB = AC. The base BC is extended, and the exterior angle there is ${ext}°. Find angle A (marked w).`, options, correctIndex, svg, solution: [
          `Let angle A = w. Each base angle is (180° − w) ÷ 2.`,
          `The exterior angle equals the sum of the two non-adjacent angles: w + (180° − w) ÷ 2 = ${ext}°.`,
          `Multiply both sides by 2: 2w + 180° − w = ${2 * ext}°, so w = ${2 * ext}° − 180° = ${apex}°.`
        ] };
      },
    ];
    const bank = d <= 1 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || G.angleIso(d);
  },

  /* G19 — rhombus + triangle angle (multi-property) */
  angleRhombus(d) {
    const L = 90, rad = Math.PI / 180;
    // local helpers: build a rhombus PQRS (P bottom-left, Q bottom-right, side length L,
    // angle at P given in degrees) and draw/label it. All private to this method.
    function rhomb(angleP, ox = 70, oy = 170) {
      const P = [ox, oy];
      const Q = [ox + L, oy];
      const S = [ox + L * Math.cos(angleP * rad), oy - L * Math.sin(angleP * rad)];
      const R = [Q[0] + (S[0] - P[0]), Q[1] + (S[1] - P[1])];
      return { P, Q, R, S };
    }
    const poly = (pts) => `<polygon points="${pts.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ")}" fill="none" stroke="#2a1a5e" stroke-width="2.5"/>`;
    const seg = (a, b, col = "#2a1a5e", sw = 1.8) => SL(a[0], a[1], b[0], b[1], col, sw);
    const lab = (pt, text, dx = 0, dy = -8) => ST(pt[0] + dx, pt[1] + dy, text, undefined, 13);

    const tier1 = [
      // (a) opposite angles equal (P & R are opposite: they share no side)
      () => {
        const p = rand(25, 65) * 2;
        const { P, Q, R, S } = rhomb(p);
        const svg = svgBox(poly([P, Q, R, S]) + lab(P, "P", -14, 14) + lab(Q, "Q", 8, 14) + lab(R, "R", 6, -6) + lab(S, "S", -12, -6) + lab(P, `${p}°`, 14, -6) + lab(R, "x", -10, 12), 300, 210);
        const { options, correctIndex } = buildMC(p, [180 - p, p + 10, p - 10, 90], deg);
        return { q: `PQRS is a rhombus. Angle P = ${p}°. Find angle R (marked x).`, options, correctIndex, svg, solution: [
          `In a rhombus, opposite angles are equal. P and R are opposite corners (they don't share a side).`,
          `So angle R = angle P = ${p}°.`
        ] };
      },
      // (b) adjacent angles supplementary
      () => {
        const p = rand(25, 65) * 2;
        const q = 180 - p;
        const { P, Q, R, S } = rhomb(p);
        const svg = svgBox(poly([P, Q, R, S]) + lab(P, "P", -14, 14) + lab(Q, "Q", 8, 14) + lab(R, "R", 6, -6) + lab(S, "S", -12, -6) + lab(P, `${p}°`, 14, -6) + lab(Q, "x", -18, 12), 300, 210);
        const { options, correctIndex } = buildMC(q, [p, q + 10, q - 10, 180 - q], deg);
        return { q: `PQRS is a rhombus. Angle P = ${p}°. Find angle Q (marked x).`, options, correctIndex, svg, solution: [
          `P and Q are adjacent corners (they share the side PQ), and neighbouring angles of a rhombus add to 180°.`,
          `Angle Q = 180° − ${p}° = ${q}°.`
        ] };
      },
      // (c) diagonal bisects a corner angle
      () => {
        const p = rand(25, 65) * 2;
        const half = p / 2;
        const { P, Q, R, S } = rhomb(p);
        const svg = svgBox(poly([P, Q, R, S]) + seg(P, R, "#ff6b4a") + lab(P, "P", -14, 14) + lab(Q, "Q", 8, 14) + lab(R, "R", 6, -6) + lab(S, "S", -12, -6) + lab(P, `${p}°`, 18, -10) + lab(P, "x", 24, 6), 300, 210);
        const { options, correctIndex } = buildMC(half, [half + 5, half - 5, p, 180 - half], deg);
        return { q: `PQRS is a rhombus with angle P = ${p}°. The diagonal PR is drawn, splitting angle P into two equal parts. Find the size of one part (marked x).`, options, correctIndex, svg, solution: [
          `The diagonals of a rhombus bisect the corner angles they pass through.`,
          `So PR splits angle P into two equal halves: ${p}° ÷ 2 = ${half}°.`
        ] };
      },
    ];
    const tier2 = [
      // (a) diagonal PR (not through Q) forms isosceles triangle PQR, apex Q, since QP=QR are rhombus sides
      () => {
        const q = rand(25, 65) * 2;
        const base = (180 - q) / 2;
        const { P, Q, R, S } = rhomb(180 - q); // angle at P is 180-q so that angle at Q = q (adjacent supplementary)
        const svg = svgBox(poly([P, Q, R, S]) + seg(P, R, "#ff6b4a") + lab(P, "P", -14, 14) + lab(Q, "Q", 10, 16) + lab(R, "R", 6, -6) + lab(S, "S", -12, -6) + lab(Q, `${q}°`, -6, -18) + lab(P, "x", 20, 4), 300, 210);
        const { options, correctIndex } = buildMC(base, [q, base + 5, base - 5, 90 - base], deg);
        return { q: `PQRS is a rhombus with angle Q = ${q}°. The diagonal PR is drawn. Since PQ and QR are both sides of the rhombus, triangle PQR is isosceles. Find angle QPR (marked x).`, options, correctIndex, svg, solution: [
          `PQ = QR (both are rhombus sides), so triangle PQR is isosceles with apex Q.`,
          `Its base angles QPR and QRP are equal, and share 180° − ${q}° = ${180 - q}°.`,
          `Angle QPR = ${180 - q}° ÷ 2 = ${base}°.`
        ] };
      },
      // (b) bisected angle at P + perpendicular diagonals -> angle between the OTHER diagonal and a side at Q
      () => {
        const p = rand(25, 65) * 2;
        const halfP = p / 2;
        const ans = 90 - halfP;
        const { P, Q, R, S } = rhomb(p);
        const M = [(P[0] + R[0]) / 2, (P[1] + R[1]) / 2];
        const svg = svgBox(poly([P, Q, R, S]) + seg(P, R, "#ff6b4a") + seg(Q, S, "#22c8b8") + lab(P, "P", -14, 14) + lab(Q, "Q", 8, 14) + lab(R, "R", 6, -6) + lab(S, "S", -12, -6) + lab(P, `${p}°`, 18, -10) + lab(Q, "x", -10, -14), 300, 210);
        const { options, correctIndex } = buildMC(ans, [halfP, ans + 5, ans - 5, 180 - ans], deg);
        return { q: `PQRS is a rhombus with angle P = ${p}°. Both diagonals PR and QS are drawn, meeting at M. Find the angle between diagonal QS and side PQ (marked x, at vertex Q).`, options, correctIndex, svg, solution: [
          `Diagonal PR bisects angle P, so angle QPM = ${p}° ÷ 2 = ${halfP}°.`,
          `The diagonals of a rhombus cross at right angles, so angle PMQ = 90°.`,
          `In triangle PQM, the angles sum to 180°: angle PQM = 180° − 90° − ${halfP}° = ${ans}°.`
        ] };
      },
      // (c) side extended beyond a vertex to form an external isosceles triangle
      () => {
        const p = rand(25, 65) * 2;
        const half = p / 2;
        const { P, Q, R, S } = rhomb(p);
        const T = [2 * P[0] - S[0], 2 * P[1] - S[1]];
        const svg = svgBox(poly([P, Q, R, S]) + seg(S, T, "#c9bff0", 1.2) + `<line x1="${S[0].toFixed(1)}" y1="${S[1].toFixed(1)}" x2="${T[0].toFixed(1)}" y2="${T[1].toFixed(1)}" stroke="#c9bff0" stroke-width="1.2" stroke-dasharray="3,3"/>` + seg(Q, T, "#ff6b4a") + lab(P, "P", -14, 14) + lab(Q, "Q", 8, 14) + lab(R, "R", 6, -6) + lab(S, "S", -12, -6) + lab(T, "T", -6, 16) + lab(P, `${p}°`, 14, -6), 300, 240);
        const { options, correctIndex } = buildMC(half, [p, half + 5, half - 5, 90 - half], deg);
        return { q: `PQRS is a rhombus with angle P = ${p}°. Side SP is extended beyond P to a point T so that PT = PQ, making triangle PQT isosceles. Find angle PQT.`, options, correctIndex, svg, solution: [
          `S, P and T lie on a straight line, so angle QPT = 180° − angle SPQ = 180° − ${p}° = ${180 - p}°.`,
          `Triangle PQT is isosceles with PQ = PT, so the base angles at Q and T are equal: angle PQT = angle PTQ.`,
          `They share 180° − ${180 - p}° = ${p}°, so each is ${p}° ÷ 2 = ${half}°.`
        ] };
      },
    ];
    const bank = d <= 1 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || G.angleRhombus(d);
  },

  /* G20 — triangles inside rectangle */
  trianglesInRect(d) {
    const tier1 = [
      // (a) diagonal splits rectangle into two congruent triangles: each is half
      () => {
        const w = rand(6, 15) * 2, h = rand(4, 10) * 2, S = 8;
        const total = w * h, half = total / 2;
        const x0 = 30, y0 = 20, W = w * S, H = h * S;
        const svg = svgBox(
          SR(x0, y0, W, H) + SL(x0, y0, x0 + W, y0 + H, "#ff6b4a", 2.5) +
          ST(x0, y0 - 8, "A", undefined, 12) + ST(x0 + W, y0 - 8, "B", undefined, 12) +
          ST(x0 + W, y0 + H + 16, "C", undefined, 12) + ST(x0, y0 + H + 16, "D", undefined, 12) +
          ST(x0 + W / 2, y0 + H + 32, `${w} cm`) + ST(x0 - 16, y0 + H / 2, `${h} cm`, undefined, 12),
          x0 + W + 30, y0 + H + 50
        );
        const { options, correctIndex } = buildMC(half, [total, half + w, half - h, half * 2]);
        return { q: `Rectangle ABCD measures ${w} cm by ${h} cm. The diagonal AC is drawn, splitting it into two triangles. What is the area, in cm², of one triangle?`, options, correctIndex, svg, solution: [
          `The diagonal cuts the rectangle into two congruent (identical) right-angled triangles.`,
          `Rectangle area = ${w} × ${h} = ${total} cm².`,
          `The two identical triangles share that area equally: ${total} ÷ 2 = ${half} cm².`
        ] };
      },
      // (b) four congruent triangles from the two midlines fill half the rectangle
      () => {
        const w = rand(6, 15) * 2, h = rand(4, 10) * 2, S = 8;
        const total = w * h, half = total / 2;
        const x0 = 30, y0 = 20, W = w * S, H = h * S;
        const svg = svgBox(
          SR(x0, y0, W, H) +
          SL(x0, y0 + H / 2, x0 + W, y0 + H / 2, "#2a1a5e", 1.5) +
          SL(x0 + W / 2, y0, x0 + W / 2, y0 + H, "#2a1a5e", 1.5) +
          `<polygon points="${x0 + W / 2},${y0} ${x0 + W / 4},${y0 + H / 2} ${x0 + 3 * W / 4},${y0 + H / 2}" fill="#ff6b4a22" stroke="#ff6b4a" stroke-width="2"/>` +
          `<polygon points="${x0},${y0 + H / 2} ${x0 + W / 2},${y0 + H / 4} ${x0 + W / 2},${y0 + 3 * H / 4}" fill="#ff6b4a22" stroke="#ff6b4a" stroke-width="2"/>` +
          ST(x0 + W / 2, y0 + H + 18, `${w} cm`) + ST(x0 - 16, y0 + H / 2, `${h} cm`, undefined, 12),
          x0 + W + 30, y0 + H + 35
        );
        const { options, correctIndex } = buildMC(half, [total, half + w, half - h, half * 2]);
        return { q: `The diagram shows four congruent right-angled triangles inside a ${w} cm × ${h} cm rectangle, formed by joining the midpoints of opposite sides (two are shaded, the other two are formed the same way). What is the total area, in cm², of all four triangles?`, options, correctIndex, svg, solution: [
          `The four triangles, taken together, exactly tile half of the rectangle (the other half is the four corner triangles left over, which match them in area).`,
          `Rectangle area = ${w} × ${h} = ${total} cm².`,
          `Total triangle area = ${total} ÷ 2 = ${half} cm².`
        ] };
      },
      // (c) both diagonals split the rectangle into four triangles of equal area (a quarter each)
      () => {
        const w = rand(6, 15) * 2, h = rand(4, 10) * 2, S = 8;
        const total = w * h, quarter = total / 4;
        const x0 = 30, y0 = 20, W = w * S, H = h * S;
        const svg = svgBox(
          SR(x0, y0, W, H) + SL(x0, y0, x0 + W, y0 + H, "#2a1a5e", 1.5) + SL(x0, y0 + H, x0 + W, y0, "#2a1a5e", 1.5) +
          `<polygon points="${x0},${y0} ${x0 + W},${y0} ${x0 + W / 2},${y0 + H / 2}" fill="#ff6b4a22" stroke="#ff6b4a" stroke-width="2"/>` +
          ST(x0 + W / 2, y0 + H + 18, `${w} cm`) + ST(x0 - 16, y0 + H / 2, `${h} cm`, undefined, 12),
          x0 + W + 30, y0 + H + 35
        );
        const { options, correctIndex } = buildMC(quarter, [total / 2, quarter + w, quarter - h, total]);
        return { q: `Both diagonals of a ${w} cm × ${h} cm rectangle are drawn, crossing at the centre, forming four triangles (one touching each side). What is the area, in cm², of the shaded triangle touching the top side?`, options, correctIndex, svg, solution: [
          `Both diagonals cross at the exact centre, splitting the rectangle into four triangles.`,
          `Even though the top/bottom triangles are a different shape from the left/right ones, all four have equal area — a quarter each.`,
          `Rectangle area = ${w} × ${h} = ${total} cm², so one triangle = ${total} ÷ 4 = ${quarter} cm².`
        ] };
      },
    ];
    const tier2 = [
      // (a) fixed full-width base, apex slides along the opposite side: area is invariant
      () => {
        const w = rand(6, 15) * 2, h = rand(4, 10) * 2, S = 8;
        const total = w * h, half = total / 2;
        const x0 = 30, y0 = 20, W = w * S, H = h * S;
        const apexFrac = rand(2, 8) / 10;
        const apexX = x0 + Math.round(W * apexFrac);
        const svg = svgBox(
          SR(x0, y0, W, H) +
          `<polygon points="${x0},${y0 + H} ${x0 + W},${y0 + H} ${apexX},${y0}" fill="#22c8b822" stroke="#22c8b8" stroke-width="2"/>` +
          ST(x0 + W / 2, y0 + H + 18, `${w} cm`) + ST(x0 - 16, y0 + H / 2, `${h} cm`, undefined, 12) + ST(apexX, y0 - 8, "P", undefined, 12),
          x0 + W + 30, y0 + H + 35
        );
        const { options, correctIndex } = buildMC(half, [total, Math.round(half * apexFrac), half + w, half - h]);
        return { q: `A ${w} cm × ${h} cm rectangle has a point P marked somewhere on its top side. A triangle is drawn using the whole bottom side as its base and P as the opposite vertex. What is the area, in cm², of the triangle?`, options, correctIndex, svg, solution: [
          `The triangle's base is the whole bottom side (${w} cm), and its height is the perpendicular distance from P down to that base — the full ${h} cm, whatever point on the top side P happens to be.`,
          `Area = ½ × ${w} × ${h} = ${half} cm², regardless of exactly where P sits along the top.`
        ] };
      },
      // (b) apex at a partial height (not touching the far side)
      () => {
        const w = rand(6, 15) * 2, hOuter = rand(8, 14) * 2, h2 = rand(3, 7) * 2, S = 8;
        if (h2 >= hOuter) return null;
        const area = w * h2 / 2;
        const x0 = 30, y0 = 20, W = w * S, H = hOuter * S, H2 = h2 * S;
        const apexX = x0 + Math.round(W * rand(3, 7) / 10);
        const svg = svgBox(
          SR(x0, y0, W, H) + SL(x0, y0 + H - H2, x0 + W, y0 + H - H2, "#c9bff0", 1.5) +
          `<polygon points="${x0},${y0 + H} ${x0 + W},${y0 + H} ${apexX},${y0 + H - H2}" fill="#ff6b4a22" stroke="#ff6b4a" stroke-width="2"/>` +
          ST(x0 + W / 2, y0 + H + 18, `${w} cm`) + ST(x0 + W + 14, y0 + H - H2 / 2, `${h2} cm`, undefined, 12),
          x0 + W + 60, y0 + H + 35
        );
        const { options, correctIndex } = buildMC(area, [w * hOuter / 2, area + w, area - h2, w * hOuter]);
        return { q: `A ${w} cm × ${hOuter} cm rectangle contains a triangle. The triangle's base is the whole bottom side, and its apex lies on a line drawn ${h2} cm above the base (not touching the top of the rectangle). Find the area, in cm², of the triangle.`, options, correctIndex, svg, solution: [
          `The triangle's height is the perpendicular distance from the apex to the base — here ${h2} cm, NOT the rectangle's own height of ${hOuter} cm, because the apex doesn't reach the top.`,
          `Area = ½ × base × height = ½ × ${w} × ${h2} = ${area} cm².`
        ] };
      },
      // (c) corner triangle cut away; find the leftover area
      () => {
        const w = rand(8, 16) * 2, h = rand(6, 12) * 2, S = 7;
        const p = rand(2, Math.floor(w / 2) - 1);
        const q = rand(1, Math.floor(h / 4)) * 2;
        const total = w * h, cut = p * q / 2, remain = total - cut;
        const x0 = 30, y0 = 20, W = w * S, H = h * S, P = p * S, Q = q * S;
        const svg = svgBox(
          SR(x0, y0, W, H) +
          `<polygon points="${x0},${y0} ${x0 + P},${y0} ${x0},${y0 + Q}" fill="#ff4d6d22" stroke="#ff4d6d" stroke-width="2"/>` +
          ST(x0 + P / 2, y0 - 8, `${p} cm`, undefined, 11) + ST(x0 - 18, y0 + Q / 2, `${q} cm`, undefined, 11) +
          ST(x0 + W / 2, y0 + H + 18, `${w} cm`) + ST(x0 - 16, y0 + H / 2 + 10, `${h} cm`, undefined, 12),
          x0 + W + 30, y0 + H + 35
        );
        const { options, correctIndex } = buildMC(remain, [total, cut, total - p * q, remain + p]);
        return { q: `A right-angled triangle is cut from one corner of a ${w} cm × ${h} cm rectangle. The triangle's two short sides (along the rectangle's edges) are ${p} cm and ${q} cm. What is the area, in cm², of the shape that remains?`, options, correctIndex, svg, solution: [
          `Rectangle area = ${w} × ${h} = ${total} cm².`,
          `The corner triangle removed has legs ${p} cm and ${q} cm, so its area = ½ × ${p} × ${q} = ${cut} cm².`,
          `Remaining area = ${total} − ${cut} = ${remain} cm².`
        ] };
      },
    ];
    const bank = d <= 1 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || G.trianglesInRect(d);
  },

  /* G21 — midpoints square area */
  midpointSquare(d) {
    const tier1 = [
      // (a) square: side -> midpoint-square area (direct)
      () => {
        const side = rand(2, 6) * 4; // multiple of 4, so half-side squared halves cleanly too
        const innerArea = side * side / 2;
        const svg = svgBox(
          SR(50, 30, side * 10, side * 10) +
          `<polygon points="${50 + side * 5},30 ${50 + side * 10},${30 + side * 5} ${50 + side * 5},${30 + side * 10} 50,${30 + side * 5}" fill="#22c8b822" stroke="#22c8b8" stroke-width="2.5"/>` +
          ST(50 + side * 5, 30 + side * 10 + 18, `${side} cm`),
          50 + side * 10 + 30, 30 + side * 10 + 30
        );
        const { options, correctIndex } = buildMC(innerArea, [side * side, innerArea + side, innerArea - side, side * side / 4]);
        return { q: `A square has side length ${side} cm. The midpoints of its sides are joined to make a smaller square (shaded). What is the area, in cm², of the smaller square?`, options, correctIndex, svg, solution: [
          `Each corner triangle cut off has legs equal to half the side, ${side / 2} cm and ${side / 2} cm, so its area is ½ × ${side / 2} × ${side / 2} = ${side * side / 8} cm².`,
          `There are four identical corners, totalling 4 × ${side * side / 8} = ${side * side / 2} cm², which is half of the original ${side * side} cm².`,
          `So the inner square's area = ${side * side} − ${side * side / 2} = ${innerArea} cm².`
        ] };
      },
      // (b) reverse: given inner square's area, find the original square's area
      () => {
        const side = rand(4, 12) * 2;
        const innerArea = side * side / 2;
        const originalArea = side * side;
        const svg = svgBox(
          SR(50, 30, side * 10, side * 10) +
          `<polygon points="${50 + side * 5},30 ${50 + side * 10},${30 + side * 5} ${50 + side * 5},${30 + side * 10} 50,${30 + side * 5}" fill="#22c8b822" stroke="#22c8b8" stroke-width="2.5"/>` +
          ST(50 + side * 5, 30 + side * 10 + 18, "? cm"),
          50 + side * 10 + 30, 30 + side * 10 + 30
        );
        const { options, correctIndex } = buildMC(originalArea, [innerArea, innerArea * 3, originalArea + side, originalArea - side]);
        return { q: `Joining the midpoints of a square's sides makes a smaller square (shaded) of area ${innerArea} cm². Find the area, in cm², of the original square.`, options, correctIndex, svg, solution: [
          `The midpoint square is always exactly half the area of the original square.`,
          `So the original square's area = ${innerArea} × 2 = ${originalArea} cm².`
        ] };
      },
      // (c) rectangle version: inner shape is a rhombus, still half the area
      () => {
        const w = rand(6, 15) * 2, h = rand(4, 10) * 2;
        const area = w * h, innerArea = area / 2;
        const svg = svgBox(
          SR(50, 30, w * 10, h * 10) +
          `<polygon points="${50 + w * 5},30 ${50 + w * 10},${30 + h * 5} ${50 + w * 5},${30 + h * 10} 50,${30 + h * 5}" fill="#ff5d8f22" stroke="#ff5d8f" stroke-width="2.5"/>` +
          ST(50 + w * 5, 30 + h * 10 + 18, `${w} cm`) + ST(30, 30 + h * 5, `${h} cm`, undefined, 12),
          50 + w * 10 + 30, 30 + h * 10 + 35
        );
        const { options, correctIndex } = buildMC(innerArea, [area, innerArea + w, innerArea - h, area / 4]);
        return { q: `A rectangle measures ${w} cm by ${h} cm. The midpoints of its sides are joined to make a rhombus (shaded). What is the area, in cm², of the rhombus?`, options, correctIndex, svg, solution: [
          `Joining the midpoints of a rectangle's sides always gives a shape with exactly half the rectangle's area (a rhombus, not a square, unless the rectangle was itself a square).`,
          `Rectangle area = ${w} × ${h} = ${area} cm².`,
          `Rhombus area = ${area} ÷ 2 = ${innerArea} cm².`
        ] };
      },
    ];
    const tier2 = [
      // (a) coordinates: axis-aligned square given by corner coordinates
      () => {
        const x1 = rand(-4, 4), y1 = rand(-4, 4), s = rand(4, 10) * 2;
        const innerArea = s * s / 2;
        const CX = 130, CY = 190, PX = 10;
        const toPx = (x, y) => [CX + x * PX, CY - y * PX];
        const [px1, py1] = toPx(x1, y1);
        const [px2] = toPx(x1 + s, y1);
        const [, py2] = toPx(x1, y1 + s);
        const svg = svgBox(
          SR(px1, py2, px2 - px1, py1 - py2) +
          `<polygon points="${(px1 + px2) / 2},${py1} ${px2},${(py1 + py2) / 2} ${(px1 + px2) / 2},${py2} ${px1},${(py1 + py2) / 2}" fill="#22c8b822" stroke="#22c8b8" stroke-width="2.5"/>` +
          ST(px1 - 6, py1 + 14, `(${x1},${y1})`, "end", 11) + ST(px2 + 6, py2 - 6, `(${x1 + s},${y1 + s})`, "start", 11),
          280, 260
        );
        const { options, correctIndex } = buildMC(innerArea, [s * s, innerArea + s, innerArea - s, s * s / 4]);
        return { q: `Square PQRS has vertices P = (${x1},${y1}), Q = (${x1 + s},${y1}), R = (${x1 + s},${y1 + s}) and S = (${x1},${y1 + s}). Find the area, in square units, of the square formed by joining the midpoints of its sides.`, options, correctIndex, svg, solution: [
          `The side length is PQ = ${x1 + s} − ${x1} = ${s} units.`,
          `Original area = ${s} × ${s} = ${s * s}, and the midpoint square is always half of that.`,
          `Midpoint square area = ${s * s} ÷ 2 = ${innerArea} square units.`
        ] };
      },
      // (b) perimeter given instead of side: derive the side first
      () => {
        const side = rand(4, 12) * 2;
        const perim = 4 * side;
        const innerArea = side * side / 2;
        const svg = svgBox(
          SR(50, 30, side * 10, side * 10) +
          `<polygon points="${50 + side * 5},30 ${50 + side * 10},${30 + side * 5} ${50 + side * 5},${30 + side * 10} 50,${30 + side * 5}" fill="#22c8b822" stroke="#22c8b8" stroke-width="2.5"/>` +
          ST(50 + side * 5, 30 + side * 10 + 18, `perimeter ${perim} cm`),
          50 + side * 10 + 30, 30 + side * 10 + 30
        );
        const { options, correctIndex } = buildMC(innerArea, [perim, side * side, innerArea + side, innerArea * 2]);
        return { q: `A square has perimeter ${perim} cm. The midpoints of its sides are joined to make a smaller square (shaded). Find the area, in cm², of the smaller square.`, options, correctIndex, svg, solution: [
          `Side length = perimeter ÷ 4 = ${perim} ÷ 4 = ${side} cm.`,
          `Original area = ${side} × ${side} = ${side * side} cm².`,
          `Midpoint square area = ${side * side} ÷ 2 = ${innerArea} cm².`
        ] };
      },
      // (c) iterate the rule: the midpoint square of the midpoint square
      () => {
        const side = rand(4, 12) * 2;
        const area = side * side;
        const gen1 = area / 2;
        const gen2 = area / 4;
        const svg = svgBox(
          SR(50, 30, side * 10, side * 10) +
          `<polygon points="${50 + side * 5},30 ${50 + side * 10},${30 + side * 5} ${50 + side * 5},${30 + side * 10} 50,${30 + side * 5}" fill="none" stroke="#22c8b8" stroke-width="2" stroke-dasharray="4,3"/>` +
          `<polygon points="${50 + side * 5},${30 + side * 2.5} ${50 + side * 7.5},${30 + side * 5} ${50 + side * 5},${30 + side * 7.5} ${50 + side * 2.5},${30 + side * 5}" fill="#ff5d8f22" stroke="#ff5d8f" stroke-width="2.5"/>` +
          ST(50 + side * 5, 30 + side * 10 + 18, `${side} cm`),
          50 + side * 10 + 30, 30 + side * 10 + 30
        );
        const { options, correctIndex } = buildMC(gen2, [gen1, area, gen2 + side, gen2 - 2]);
        return { q: `A square has side ${side} cm. Its midpoint square is drawn (dashed), and then the midpoints of THAT square's sides are joined to make a second, smaller square (shaded). Find the area, in cm², of the shaded square.`, options, correctIndex, svg, solution: [
          `Original area = ${side} × ${side} = ${area} cm².`,
          `The first midpoint square (dashed) has half that area: ${area} ÷ 2 = ${gen1} cm².`,
          `Applying the same halving rule again to that square gives the second midpoint square: ${gen1} ÷ 2 = ${gen2} cm².`
        ] };
      },
    ];
    const bank = d <= 1 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || G.midpointSquare(d);
  },

  /* G22 — partitioned rectangle perimeters */
  /* G22 — partitioned rectangle perimeters */
  partitionRect(d) {
    const nameMap = { tl: "top-left", tr: "top-right", bl: "bottom-left", br: "bottom-right" };
    const diagPartner = { tl: "br", br: "tl", tr: "bl", bl: "tr" };
    const corners = ["tl", "tr", "bl", "br"];
    const drawGrid = (a, b, c, e, labels) => {
      const x0 = 40, y0 = 30, cw = 12;
      const totalW = (a + b) * cw, totalH = (c + e) * cw;
      let g = SR(x0, y0, totalW, totalH);
      g += SL(x0 + a * cw, y0, x0 + a * cw, y0 + totalH);
      g += SL(x0, y0 + c * cw, x0 + totalW, y0 + c * cw);
      const cx1 = x0 + (a * cw) / 2, cx2 = x0 + a * cw + (b * cw) / 2;
      const cy1 = y0 + (c * cw) / 2, cy2 = y0 + c * cw + (e * cw) / 2;
      if (labels.tl) g += ST(cx1, cy1, labels.tl, "middle", 13, "#2a1a5e", 700);
      if (labels.tr) g += ST(cx2, cy1, labels.tr, "middle", 13, "#2a1a5e", 700);
      if (labels.bl) g += ST(cx1, cy2, labels.bl, "middle", 13, "#2a1a5e", 700);
      if (labels.br) g += ST(cx2, cy2, labels.br, "middle", 13, "#2a1a5e", 700);
      return svgBox(g, x0 + totalW + 40, y0 + totalH + 30);
    };

    const tier1 = [
      // (a) classic: 3 of 4 known, find the 4th via diagonal-pair equality (any corner may be hidden)
      () => {
        const a = rand(3, 9), b = rand(3, 9), c = rand(3, 9), e = rand(3, 9);
        const P = { tl: 2 * (a + c), tr: 2 * (b + c), bl: 2 * (a + e), br: 2 * (b + e) };
        const hidden = pick(corners);
        const partner = diagPartner[hidden];
        const others = corners.filter((k) => k !== hidden && k !== partner);
        const answer = P[others[0]] + P[others[1]] - P[partner];
        if (answer !== P[hidden] || answer <= 0) return null;
        const labels = {}; corners.forEach((k) => { labels[k] = k === hidden ? "?" : P[k] + " cm"; });
        const svg = drawGrid(a, b, c, e, labels);
        const { options, correctIndex } = buildMC(P[hidden], [P[hidden] + 2, P[hidden] - 2, Math.round((P[others[0]] + P[others[1]]) / 2), P[partner]], (x) => x + " cm");
        return { q: `A rectangle is cut by one horizontal and one vertical line into four smaller rectangles (see diagram). The perimeters of the ${nameMap[others[0]]}, ${nameMap[others[1]]} and ${nameMap[partner]} pieces are known. Find the perimeter of the ${nameMap[hidden]} piece, marked "?".`, options, correctIndex, svg, solution: [
          `The ${nameMap[hidden]} piece sits diagonally opposite the ${nameMap[partner]} piece. Diagonally-opposite pairs in this kind of grid always have perimeters that add to the same total as the other diagonal pair.`,
          `So P(${nameMap[hidden]}) + P(${nameMap[partner]}) = P(${nameMap[others[0]]}) + P(${nameMap[others[1]]}).`,
          `P(${nameMap[hidden]}) = ${P[others[0]]} + ${P[others[1]]} − ${P[partner]} = ${P[hidden]} cm.`] };
      },
      // (b) outer perimeter + ONE small perimeter gives its diagonal partner directly
      () => {
        const a = rand(3, 9), b = rand(3, 9), c = rand(3, 9), e = rand(3, 9);
        const P = { tl: 2 * (a + c), tr: 2 * (b + c), bl: 2 * (a + e), br: 2 * (b + e) };
        const outer = 2 * (a + b + c + e);
        const known = pick(corners);
        const target = diagPartner[known];
        const answer = outer - P[known];
        if (answer <= 0) return null;
        const labels = {}; corners.forEach((k) => { labels[k] = k === known ? P[k] + " cm" : (k === target ? "?" : ""); });
        const svg = drawGrid(a, b, c, e, labels);
        const { options, correctIndex } = buildMC(answer, [answer + 2, answer - 2, outer - answer, Math.round(outer / 2)], (x) => x + " cm");
        return { q: `A rectangle with overall perimeter ${outer} cm is cut by one horizontal and one vertical line into four smaller rectangles. The ${nameMap[known]} piece has perimeter ${P[known]} cm. Find the perimeter of the ${nameMap[target]} piece, which is diagonally opposite it.`, options, correctIndex, svg, solution: [
          `Two pieces diagonally opposite each other always have perimeters that add up to exactly the whole rectangle's own outer perimeter.`,
          `P(${nameMap[known]}) + P(${nameMap[target]}) = ${outer}.`,
          `P(${nameMap[target]}) = ${outer} − ${P[known]} = ${answer} cm.`] };
      },
    ];

    const tier2 = [
      // (c) conceptual trap: which pairing is guaranteed to balance?
      () => {
        const a = rand(3, 9), b = rand(4, 10), c = rand(3, 9), e = rand(4, 10);
        const P = { tl: 2 * (a + c), tr: 2 * (b + c), bl: 2 * (a + e), br: 2 * (b + e) };
        const labels = { tl: P.tl + " cm", tr: P.tr + " cm", bl: P.bl + " cm", br: P.br + " cm" };
        const svg = drawGrid(a, b, c, e, labels);
        const correct = "P(top-left) + P(bottom-right) = P(top-right) + P(bottom-left)";
        const distractors = [
          "P(top-left) + P(top-right) = P(bottom-left) + P(bottom-right)",
          "P(top-left) + P(bottom-left) = P(top-right) + P(bottom-right)",
          "All four perimeters are always equal to each other",
          "P(top-left) × P(bottom-right) = P(top-right) × P(bottom-left)",
        ];
        const { options, correctIndex } = buildMCStr(correct, distractors);
        return { q: `A rectangle is divided into four smaller rectangles by one horizontal and one vertical cut (perimeters shown in the diagram). Which of these statements is ALWAYS true, for any such division of any rectangle?`, options, correctIndex, svg, solution: [
          `Each small rectangle is built from one of two widths (call them a, b) and one of two heights (c, e): top-left uses a & c, top-right uses b & c, bottom-left uses a & e, bottom-right uses b & e.`,
          `Top-left + bottom-right uses a, b, c and e each exactly once. Top-right + bottom-left ALSO uses a, b, c and e each exactly once — just paired differently. Both totals equal 2(a+b+c+e), so they must be equal to each other.`,
          `A row pair like top-left + top-right instead uses height c TWICE and never uses e, so its total depends on the actual numbers and is not guaranteed to match anything. Only the diagonal pairing is guaranteed.`] };
      },
      // (d) total of all four = double the outer perimeter (with distractor info given)
      () => {
        const a = rand(3, 9), b = rand(3, 9), c = rand(3, 9), e = rand(3, 9);
        const P = { tl: 2 * (a + c), tr: 2 * (b + c), bl: 2 * (a + e), br: 2 * (b + e) };
        const outer = 2 * (a + b + c + e);
        const total = P.tl + P.tr + P.bl + P.br;
        const shown = shuffle(corners).slice(0, 2);
        const labels = {}; corners.forEach((k) => { labels[k] = shown.includes(k) ? P[k] + " cm" : ""; });
        const svg = drawGrid(a, b, c, e, labels);
        const { options, correctIndex } = buildMC(total, [outer, total + 2, total - 2, Math.round(total / 2)], (x) => x + " cm");
        return { q: `A rectangle with overall perimeter ${outer} cm is divided into four smaller rectangles by one horizontal and one vertical cut. The ${nameMap[shown[0]]} piece has perimeter ${P[shown[0]]} cm and the ${nameMap[shown[1]]} piece has perimeter ${P[shown[1]]} cm. What is the SUM of all FOUR small rectangles' perimeters?`, options, correctIndex, svg, solution: [
          `Every internal cut gets walked twice when you add the four small perimeters separately — once by each rectangle that borders it — so the four small perimeters always add up to exactly double the big rectangle's own outer perimeter, whatever the individual pieces are.`,
          `The two given perimeters (${nameMap[shown[0]]} and ${nameMap[shown[1]]}) are not actually needed here — the total only depends on the outer perimeter.`,
          `Total = 2 × ${outer} = ${total} cm.`] };
      },
      // (e) the AREA version — a PRODUCT relationship, not a sum: diagonal areas multiply
      // to the same value, a genuinely different (and less obvious) fact than the perimeter
      // sum relationships above.
      () => {
        const a=rand(3,9),b=rand(3,9),c=rand(3,9),e=rand(3,9);
        const Ar = { tl:a*c, tr:b*c, bl:a*e, br:b*e };
        const hidden = pick(corners);
        const partner = diagPartner[hidden];
        const others = corners.filter(k=>k!==hidden&&k!==partner);
        if (Ar[others[0]]*Ar[others[1]] % Ar[partner] !== 0) return null;
        const answer = (Ar[others[0]]*Ar[others[1]])/Ar[partner];
        if (answer !== Ar[hidden] || answer<=0) return null;
        const labels={}; corners.forEach(k=>{labels[k]= k===hidden?"?":Ar[k]+" cm²";});
        const svg=drawGrid(a,b,c,e,labels);
        const {options,correctIndex}=buildMC(Ar[hidden],[Ar[hidden]+2,Ar[hidden]-2,Ar[others[0]]+Ar[others[1]]-Ar[partner],Ar[partner]],(x)=>x+" cm²");
        return { q:`A rectangle is cut by one horizontal and one vertical line into four smaller rectangles (see diagram). The AREAS of the ${nameMap[others[0]]}, ${nameMap[others[1]]} and ${nameMap[partner]} pieces are known. Find the area of the ${nameMap[hidden]} piece, marked "?".`, options, correctIndex, svg, solution:[
          `Unlike perimeters, diagonally-opposite AREAS don't add to a fixed total — instead, their PRODUCT is what's guaranteed to match: Area(${nameMap[hidden]}) × Area(${nameMap[partner]}) = Area(${nameMap[others[0]]}) × Area(${nameMap[others[1]]}), since both equal (width₁×width₂×height₁×height₂).`,
          `Area(${nameMap[hidden]}) = (${Ar[others[0]]} × ${Ar[others[1]]}) ÷ ${Ar[partner]} = ${Ar[hidden]} cm².`] };
      },
    ];

    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },

  /* G23 — compound shape perimeter */
  compoundPerimeter(d) {
    const cellKey = (x, y) => x + "," + y;
    const cellPerimeter = (cells) => {
      const set = new Set(cells.map(([x, y]) => cellKey(x, y)));
      let per = 0;
      cells.forEach(([x, y]) => { [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { if (!set.has(cellKey(x + dx, y + dy))) per++; }); });
      return per;
    };
    const drawCells = (cellSets, cellPx = 24) => {
      let g = "", cursorX = 20; const oy = 20; let maxY = 0;
      cellSets.forEach(({ cells }) => {
        const xs = cells.map((c) => c[0]), ys = cells.map((c) => c[1]);
        const minX = Math.min(...xs), minY = Math.min(...ys), maxX = Math.max(...xs), maxYc = Math.max(...ys);
        const w = (maxX - minX + 1) * cellPx, h = (maxYc - minY + 1) * cellPx;
        cells.forEach(([x, y]) => { g += SR(cursorX + (x - minX) * cellPx, oy + (y - minY) * cellPx, cellPx, cellPx); });
        cursorX += w + 30; maxY = Math.max(maxY, h);
      });
      return svgBox(g, cursorX, oy + maxY + 20);
    };
    const cellsRow = (n) => Array.from({ length: n }, (_, i) => [i, 0]);
    const cellsRect = (w, h) => { const c = []; for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) c.push([x, y]); return c; };
    const cellsL = (p, q) => { const c = []; for (let i = 0; i < p; i++) c.push([i, 0]); for (let j = 1; j < q; j++) c.push([0, j]); return c; };
    const cellsT = (p, q) => { const c = []; for (let i = 0; i < p; i++) c.push([i, 0]); const cx = Math.floor(p / 2); for (let j = 1; j < q; j++) c.push([cx, j]); return c; };
    const cellsPlus = (r) => { const c = [[0, 0]]; for (let i = 1; i <= r; i++) { c.push([i, 0]); c.push([-i, 0]); c.push([0, i]); c.push([0, -i]); } return c; };

    const drawLShape = (W, H, w, h, edgeLabels) => {
      const scale = 10, x0 = 40, y0 = 20;
      const Wpx = W * scale, Hpx = H * scale, wpx = w * scale, hpx = h * scale;
      const pts = [[x0, y0 + Hpx], [x0 + Wpx, y0 + Hpx], [x0 + Wpx, y0 + hpx], [x0 + Wpx - wpx, y0 + hpx], [x0 + Wpx - wpx, y0], [x0, y0]];
      const poly = `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="#2a1a5e" stroke-width="2"/>`;
      const mid = (p1, p2) => [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
      let labels = "";
      const put = (i, j, text, dx = 0, dy = 0) => { if (!text) return; const m = mid(pts[i], pts[j]); labels += ST(m[0] + dx, m[1] + dy, text, "middle", 12, "#2a1a5e", 700); };
      put(0, 1, edgeLabels.bottom, 0, 16); put(1, 2, edgeLabels.right1, 14, 0); put(2, 3, edgeLabels.notchBottom, 0, -6);
      put(3, 4, edgeLabels.notchSide, 14, 0); put(4, 5, edgeLabels.top, 0, -6); put(5, 0, edgeLabels.left, -16, 0);
      return svgBox(poly + labels, x0 + Wpx + 40, y0 + Hpx + 30);
    };

    const tier1 = [
      // (a) direct: perimeter of a genuinely different polyomino shape each time, via edge-counting
      () => {
        const kind = pick(["L", "T", "plus"]);
        let cells, n, desc;
        if (kind === "L") { const p = rand(3, 6), q = rand(2, 5); cells = cellsL(p, q); n = p + q - 1; desc = `an L-shape (arms of ${p} and ${q} squares, sharing the corner square)`; }
        else if (kind === "T") { const p = rand(1, 2) * 2 + 3, q = rand(2, 4); cells = cellsT(p, q); n = p + q - 1; desc = `a T-shape (a row of ${p} squares with a stem of ${q - 1} more squares hanging from the middle)`; }
        else { const r = rand(1, 3); cells = cellsPlus(r); n = 4 * r + 1; desc = `a plus-shape (a central square with arms of ${r} square${r > 1 ? "s" : ""} in each direction)`; }
        const per = cellPerimeter(cells);
        const svg = drawCells([{ cells }]);
        const { options, correctIndex } = buildMC(per, [per + 2, per - 2, n * 4, 2 * n + 2], (x) => x + " units");
        return { q: `The diagram shows ${n} identical unit squares arranged in ${desc}. What is the perimeter of the shape, in units?`, options, correctIndex, svg, solution: [
          `Trace the outer boundary and count every exposed unit edge; an edge only counts if it is NOT shared with a neighbouring square in the shape.`,
          `Counting every exposed edge round the outline gives a perimeter of ${per} units.`] };
      },
      // (b) compactness: same number of squares, different arrangement, different perimeter
      () => {
        const pairs = [[6, [2, 3]], [8, [2, 4]], [9, [3, 3]], [10, [2, 5]], [12, [3, 4]]];
        const [n, [h, w]] = pick(pairs);
        const rowCells = cellsRow(n); const blockCells = cellsRect(w, h);
        const perR = cellPerimeter(rowCells), perB = cellPerimeter(blockCells);
        const diff = perR - perB;
        if (diff <= 0) return null;
        const svg = drawCells([{ cells: rowCells }, { cells: blockCells }]);
        const { options, correctIndex } = buildMC(diff, [diff + 2, diff - 2, perR, perB], (x) => x + " units");
        return { q: `Both shapes below are made of the same ${n} identical unit squares: Shape A is a straight row of ${n} squares, and Shape B is a compact ${w} by ${h} block. By how many units is Shape A's perimeter greater than Shape B's?`, options, correctIndex, svg, solution: [
          `Shape A (the row): perimeter = ${perR} units. Shape B (the block): perimeter = ${perB} units.`,
          `Same number of squares, but spreading them into a long thin row gives a bigger perimeter than packing them into a compact block: ${perR} − ${perB} = ${diff} units.`] };
      },
      // (c) glued rectangles: the shared edge vanishes from the boundary
      () => {
        const w1 = rand(2, 4), h1 = rand(2, 4), w2 = rand(2, 4), h2 = rand(2, 4);
        if (h1 === h2) return null;
        const R1 = cellsRect(w1, h1); const R2 = cellsRect(w2, h2).map(([x, y]) => [x + w1, y]);
        const combined = [...R1, ...R2];
        const perDirect = cellPerimeter(combined);
        const shared = Math.min(h1, h2);
        const perR1 = cellPerimeter(R1), perR2 = cellPerimeter(R2);
        const perFormula = perR1 + perR2 - 2 * shared;
        if (perDirect !== perFormula) return null;
        const svg = drawCells([{ cells: combined }]);
        const { options, correctIndex } = buildMC(perDirect, [perDirect + 2, perDirect - 2, perR1 + perR2, perDirect + 2 * shared], (x) => x + " units");
        return { q: `A ${w1} by ${h1} rectangle of unit squares is pushed flush against a ${w2} by ${h2} rectangle of unit squares, sharing part of one edge (see diagram). What is the perimeter of the combined shape?`, options, correctIndex, svg, solution: [
          `Separately, the two rectangles have perimeters ${perR1} and ${perR2} units, adding to ${perR1 + perR2}.`,
          `But ${shared} units of edge where they touch are now INSIDE the combined shape, counted once in each rectangle's own perimeter, so it must be removed twice.`,
          `Combined perimeter = ${perR1} + ${perR2} − 2×${shared} = ${perDirect} units.`] };
      },
    ];

    const tier2 = [
      // (a) corner-notch invariance
      () => {
        const W = rand(8, 16), H = rand(6, 13);
        const w = rand(2, Math.min(6, W - 2)), h = rand(2, Math.min(5, H - 2));
        if (w >= W || h >= H) return null;
        const perim = 2 * (W + H);
        const edgeLabels = { bottom: W + " m", right1: (H - h) + " m", notchBottom: w + " m", notchSide: h + " m", top: (W - w) + " m", left: H + " m" };
        const svg = drawLShape(W, H, w, h, edgeLabels);
        const { options, correctIndex } = buildMC(perim, [perim + 2 * w, perim - 2 * w, perim + 2 * h, W * H - w * h], (x) => x + " m");
        return { q: `A garden is shaped like a large ${W} m by ${H} m rectangle with a smaller ${w} m by ${h} m rectangular corner cut away (see diagram). Find the perimeter of the garden.`, options, correctIndex, svg, solution: [
          `Trace the outline: ${W} + ${H - h} + ${w} + ${h} + ${W - w} + ${H}.`,
          `Group the horizontal pieces: bottom = ${W}; top pieces ${w} + ${W - w} = ${W} too. Group the vertical pieces: right pieces ${H - h} + ${h} = ${H}; left = ${H} too.`,
          `Total = ${W} + ${W} + ${H} + ${H} = 2×(${W}+${H}) = ${perim} m. The corner bite changes the SHAPE but not the perimeter — it removes some length but adds back exactly the same amount elsewhere.`] };
      },
      // (b) balance-rule: find the missing edge, then total the perimeter
      () => {
        const W = rand(8, 16), H = rand(6, 13);
        const w = rand(2, Math.min(6, W - 2)), h = rand(2, Math.min(5, H - 2));
        if (w >= W || h >= H) return null;
        const edges = { bottom: W, right1: H - h, notchBottom: w, notchSide: h, top: W - w, left: H };
        const total = edges.bottom + edges.right1 + edges.notchBottom + edges.notchSide + edges.top + edges.left;
        const hideable = ["bottom", "right1", "notchBottom", "notchSide", "top", "left"];
        const hidden = pick(hideable);
        let recomputed;
        if (hidden === "bottom") recomputed = edges.notchBottom + edges.top;
        else if (hidden === "notchBottom") recomputed = edges.bottom - edges.top;
        else if (hidden === "top") recomputed = edges.bottom - edges.notchBottom;
        else if (hidden === "left") recomputed = edges.right1 + edges.notchSide;
        else if (hidden === "right1") recomputed = edges.left - edges.notchSide;
        else recomputed = edges.left - edges.right1;
        if (recomputed !== edges[hidden] || recomputed <= 0) return null;
        const edgeLabels = {}; hideable.forEach((k) => { edgeLabels[k] = k === hidden ? "?" : edges[k] + " m"; });
        const svg = drawLShape(W, H, w, h, edgeLabels);
        const { options, correctIndex } = buildMC(total, [total + 2, total - 2, total + edges[hidden], total - edges[hidden]], (x) => x + " m");
        const horizGroup = hidden === "bottom" || hidden === "notchBottom" || hidden === "top";
        const ruleText = horizGroup ? `Horizontal balance: the total distance moved rightward must equal the total distance moved leftward, since the outline closes up.` : `Vertical balance: the total distance moved down the right side must equal the total distance moved up the left side, since the outline closes up.`;
        return { q: `An L-shaped plot has six edges; five are labelled in the diagram and the sixth is marked "?". Find the TOTAL perimeter of the plot.`, options, correctIndex, svg, solution: [
          ruleText,
          `Missing edge = ${edges[hidden]} m (found by balancing it against the other edges on the same side).`,
          `Total perimeter = ${edges.bottom} + ${edges.right1} + ${edges.notchBottom} + ${edges.notchSide} + ${edges.top} + ${edges.left} = ${total} m.`] };
      },
    ];

    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },

  /* G24 — pool and path area */
  poolPath(d) {
    const drawPool = (L, W, p) => {
      const scale = Math.min(9, 200 / (L + 2 * p), 150 / (W + 2 * p));
      const x0 = 20, y0 = 20;
      const outerW = (L + 2 * p) * scale, outerH = (W + 2 * p) * scale;
      const innerX = x0 + p * scale, innerY = y0 + p * scale, innerW = L * scale, innerH = W * scale;
      const g = SR(x0, y0, outerW, outerH) + SR(innerX, innerY, innerW, innerH, "#22c8b8", 2);
      return svgBox(g, x0 + outerW + 20, y0 + outerH + 30);
    };
    const drawCirclePool = (r, w) => {
      const scale = Math.min(8, 100 / (r + w));
      const cx = 130, cy = 110;
      const g = SC(cx, cy, (r + w) * scale) + SC(cx, cy, r * scale, "#22c8b8", 2);
      return svgBox(g, 260, 220);
    };
    const PI = 3.14;

    const tier1 = [
      // (a) outer/combined area
      () => {
        const L = rand(6, 20), W = rand(5, 16), p = rand(1, 3);
        const outerL = L + 2 * p, outerW = W + 2 * p;
        const totalArea = outerL * outerW;
        const svg = drawPool(L, W, p);
        const { options, correctIndex } = buildMC(totalArea, [L * W, totalArea + 2 * p, totalArea - 2 * p, (L + p) * (W + p)], (x) => x + " m²");
        return { q: `A rectangular pool ${L} m by ${W} m is surrounded on all four sides by a path ${p} m wide. Find the TOTAL area of pool and path together.`, options, correctIndex, svg, solution: [
          `The path runs all the way round, so it adds ${p} m to EACH side of the pool — ${p} m twice on the length and ${p} m twice on the width.`,
          `Outer length = ${L} + 2×${p} = ${outerL} m. Outer width = ${W} + 2×${p} = ${outerW} m.`,
          `Total area = ${outerL} × ${outerW} = ${totalArea} m².`] };
      },
      // (b) path's own area, with the classic corner-trap distractor
      () => {
        const L = rand(6, 20), W = rand(5, 16), p = rand(1, 3);
        const outerL = L + 2 * p, outerW = W + 2 * p;
        const poolArea = L * W, totalArea = outerL * outerW, pathArea = totalArea - poolArea;
        const trapValue = 2 * (L + W) * p;
        const svg = drawPool(L, W, p);
        const { options, correctIndex } = buildMC(pathArea, [trapValue, pathArea + 2, pathArea - 2, poolArea], (x) => x + " m²");
        return { q: `A rectangular pool ${L} m by ${W} m is surrounded on all four sides by a path ${p} m wide. Find the area of the path ALONE (not including the pool).`, options, correctIndex, svg, solution: [
          `Outer rectangle (pool + path) = (${L}+2×${p}) × (${W}+2×${p}) = ${outerL} × ${outerW} = ${totalArea} m².`,
          `Path area = total area − pool area = ${totalArea} − ${poolArea} = ${pathArea} m².`,
          `Careful: multiplying the pool's perimeter by the path width (2×(${L}+${W})×${p} = ${trapValue}) is a common trap — it misses the four corner squares and gives the wrong answer.`] };
      },
    ];

    const tier2 = [
      // (a) reverse algebra: find the pool's width from the total combined area
      () => {
        const p = rand(1, 3), W = rand(5, 14), L = rand(8, 20);
        const outerL = L + 2 * p, outerW = W + 2 * p;
        const total = outerL * outerW;
        const svg = drawPool(L, W, p);
        const nearMiss = W + p;
        const { options, correctIndex } = buildMC(W, [W + 1, W - 1, nearMiss, Math.max(1, W - p)], (x) => x + " m");
        return { q: `A rectangular pool has length ${L} m and is surrounded on all sides by a path ${p} m wide. The total area of pool and path together is ${total} m². Find the WIDTH of the pool.`, options, correctIndex, svg, solution: [
          `Outer length = ${L} + 2×${p} = ${outerL} m. Since total area = outer length × outer width, outer width = ${total} ÷ ${outerL} = ${outerW} m.`,
          `The path adds ${p} m to BOTH sides of the pool's width, so pool width = outer width − 2×${p} = ${outerW} − ${2 * p} = ${W} m.`] };
      },
      // (b) circular pool: same total-minus-inner logic with pi
      () => {
        const r = rand(3, 9), w = rand(1, 3);
        const poolArea = Math.round(PI * r * r * 100) / 100;
        const outerArea = Math.round(PI * (r + w) * (r + w) * 100) / 100;
        const pathArea = Math.round((outerArea - poolArea) * 100) / 100;
        const svg = drawCirclePool(r, w);
        const trapValue = Math.round(2 * PI * r * w * 100) / 100;
        const { options, correctIndex } = buildMC(pathArea, [trapValue, Math.round((pathArea + 1) * 100) / 100, Math.round((pathArea - 1) * 100) / 100, poolArea], (x) => x + " m²");
        return { q: `A circular pool has radius ${r} m. A path ${w} m wide runs all the way round it. Using π ≈ 3.14, find the area of the path.`, options, correctIndex, svg, solution: [
          `Pool area = π × r² = 3.14 × ${r}² = ${poolArea} m².`,
          `Outer circle (pool + path) has radius ${r}+${w} = ${r + w} m, so its area = 3.14 × ${r + w}² = ${outerArea} m².`,
          `Path area = outer area − pool area = ${outerArea} − ${poolArea} = ${pathArea} m².`] };
      },
      // (c) NON-UNIFORM path width — a genuinely different setup, not just different numbers:
      // the horizontal and vertical sides gain different amounts, so blindly reusing the
      // "add the same p to every side" formula from (a)/(b) gives the wrong answer here.
      () => {
        // L runs left-right (horizontal extent), W runs top-bottom (vertical extent).
        // A path along the TOP and BOTTOM edges sits above/below the pool, so it extends
        // the VERTICAL extent (adds to W). A path along the LEFT and RIGHT edges extends
        // the HORIZONTAL extent (adds to L). Using unambiguous top/bottom vs left/right
        // wording (rather than "length side"/"width side") removes any risk of mislabelling
        // which width belongs to which dimension.
        const L = rand(6, 16), W = rand(5, 14), pTB = rand(1, 3), pLR = rand(1, 3);
        if (pTB === pLR) return null; // keep this distinct from the uniform-path format
        const outerL = L + 2 * pLR, outerW = W + 2 * pTB;
        const totalArea = outerL * outerW, poolArea = L * W, pathArea = totalArea - poolArea;
        const uniformTrap = (L + 2 * pTB) * (W + 2 * pTB); // the mistake: using pTB on both directions
        const svg = drawPool(L, W, Math.max(pTB, pLR));
        const { options, correctIndex } = buildMC(pathArea, [uniformTrap - poolArea, pathArea + 2, pathArea - 2, poolArea], (x) => x + " m²");
        return { q: `A rectangular pool ${L} m by ${W} m has a path running round it that is ${pTB} m wide along the TOP and BOTTOM edges, but ${pLR} m wide along the LEFT and RIGHT edges. Find the area of the path alone.`, options, correctIndex, svg, solution: [
          `The path width is NOT the same on every side here — check which width applies to which pair of edges.`,
          `The top and bottom path adds to the pool's WIDTH: outer width = ${W} + 2×${pTB} = ${outerW} m. The left and right path adds to the pool's LENGTH: outer length = ${L} + 2×${pLR} = ${outerL} m.`,
          `Path area = (${outerL} × ${outerW}) − (${L} × ${W}) = ${totalArea} − ${poolArea} = ${pathArea} m².`] };
      },
    ];

    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },

  /* G25 — cube properties */
  cubeProps(d) {
    const cubeSketch = (label) => {
      const x0 = 60, y0 = 70, s = 100, off = 35;
      const front = SR(x0, y0, s, s);
      const back = SR(x0 + off, y0 - off, s, s, "#c9bff0", 1.5);
      const edges = SL(x0, y0, x0 + off, y0 - off, "#c9bff0", 1.5) + SL(x0 + s, y0, x0 + s + off, y0 - off, "#c9bff0", 1.5) + SL(x0, y0 + s, x0 + off, y0 + s - off, "#c9bff0", 1.5) + SL(x0 + s, y0 + s, x0 + s + off, y0 + s - off, "#c9bff0", 1.5);
      const lbl = label ? ST(x0 + s / 2, y0 + s + 20, label, "middle", 13, "#2a1a5e", 700) : "";
      return svgBox(front + back + edges + lbl, 260, 220);
    };

    const tier1 = [
      // (a) SA = kV algebra
      () => {
        const k = pick([1, 2, 3]);
        const s = 6 / k;
        if (!Number.isInteger(s)) return null;
        const V = s * s * s; const SA = 6 * s * s;
        const svg = cubeSketch(`side = ${s} cm`);
        const { options, correctIndex } = buildMC(V, [V + s, V - s, s * s, SA], (x) => x + " cm³");
        return { q: `The volume of a cube is V cm³. Its surface area is ${k === 1 ? "equal to V" : `${k}V`} cm². What is the value of V?`, options, correctIndex, svg, solution: [
          `Surface area = 6s², volume = s³, where s is the side length.`,
          `Given 6s² = ${k}s³: divide both sides by s² (s ≠ 0) to get 6 = ${k}s, so s = ${s}.`,
          `V = s³ = ${s}³ = ${V} cm³. Check: surface area = 6×${s}² = ${SA} = ${k}×${V}. ✓`] };
      },
      // (b) cuboid volume/surface area, direct
      () => {
        const l = rand(3, 9), w = rand(2, 8), h = rand(2, 7);
        const V = l * w * h;
        const faceLW = l * w, faceLH = l * h, faceWH = w * h;
        const SA = 2 * (faceLW + faceLH + faceWH);
        const askVolume = pick([true, false]);
        const svg = cubeSketch(`${l}×${w}×${h} cm`);
        if (askVolume) {
          const { options, correctIndex } = buildMC(V, [V + w, V - w, SA, faceLW + faceLH + faceWH], (x) => x + " cm³");
          return { q: `Find the volume of a cuboid ${l} cm by ${w} cm by ${h} cm.`, options, correctIndex, svg, solution: [
            `Volume = length × width × height = ${l} × ${w} × ${h}.`,
            `= ${V} cm³.`] };
        }
        const { options, correctIndex } = buildMC(SA, [SA + 2, SA - 2, V, faceLW + faceLH + faceWH], (x) => x + " cm²");
        return { q: `Find the surface area of a cuboid ${l} cm by ${w} cm by ${h} cm.`, options, correctIndex, svg, solution: [
          `The cuboid has 3 pairs of matching faces: ${l}×${w}=${faceLW}, ${l}×${h}=${faceLH}, ${w}×${h}=${faceWH}.`,
          `Add the three: ${faceLW}+${faceLH}+${faceWH} = ${faceLW + faceLH + faceWH}. Double it, since each face type appears twice: ${SA} cm².`] };
      },
      // (c) triangular prism volume — contrasts with "multiply all the lengths"
      () => {
        const legs = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]);
        const [a, b, hyp] = legs;
        const len = rand(4, 12);
        const crossArea = (a * b) / 2;
        const V = crossArea * len;
        const naive = a * b * len;
        const svg = cubeSketch(`prism, length ${len} cm`);
        const { options, correctIndex } = buildMC(V, [naive, V + len, V - len, crossArea], (x) => x + " cm³");
        return { q: `A triangular prism has length ${len} cm. Its triangular cross-section is right-angled with legs ${a} cm and ${b} cm (hypotenuse ${hyp} cm). Find the volume of the prism.`, options, correctIndex, svg, solution: [
          `Volume of ANY prism = area of the cross-section × length. Do not just multiply all the lengths together — that only works for a cuboid.`,
          `Cross-section area = ½ × ${a} × ${b} = ${crossArea} cm² (a triangle is HALF of the rectangle that contains it).`,
          `Volume = ${crossArea} × ${len} = ${V} cm³.`] };
      },
    ];

    const tier2 = [
      // (a) single-colour painted cube: corner / edge / face / interior counts
      () => {
        const n = rand(4, 6);
        const category = pick(["corner", "edge", "face", "interior"]);
        const counts = { corner: 8, edge: 12 * (n - 2), face: 6 * (n - 2) * (n - 2), interior: (n - 2) * (n - 2) * (n - 2) };
        const total = counts.corner + counts.edge + counts.face + counts.interior;
        if (total !== n * n * n) return null;
        const answer = counts[category];
        const label = { corner: "exactly 3 painted faces", edge: "exactly 2 painted faces", face: "exactly 1 painted face", interior: "no painted faces at all" }[category];
        const svg = cubeSketch(`${n}×${n}×${n} cube`);
        const { options, correctIndex } = buildMC(answer, [answer + n, answer - n, total - answer, n * n * n - answer], (x) => String(x));
        return { q: `${N1()} builds a large ${n}×${n}×${n} cube from unit cubes, paints the WHOLE outside one colour, then takes it apart. How many small cubes have ${label}?`, options, correctIndex, svg, solution: [
          `Corners: always 8. Edges (excluding corners): 12×(n−2). Faces (excluding edges): 6×(n−2)². Interior (untouched): (n−2)³.`,
          `For n = ${n}: corners = 8, edges = ${counts.edge}, faces = ${counts.face}, interior = ${counts.interior}. Check total = ${n}³ = ${total}: 8+${counts.edge}+${counts.face}+${counts.interior} = ${total}. ✓`,
          `Answer: ${answer}.`] };
      },
      // (b) two-colour sticker cube: corrected combinatorics (was: a second painted-and-built cube)
      () => {
        const n = rand(3, 6);
        const answer = 8 * (n - 1);
        const svg = cubeSketch(`${n}×${n}×${n} cube`);
        const { options, correctIndex } = buildMC(answer, [answer + 8, answer - 8, 6 * (n - 2) * (n - 2), 12 * (n - 2)], (x) => String(x));
        return { q: `${N1()} takes apart a ${n}×${n}×${n} Rubik's-cube-style puzzle made of unit cubes. A pair of opposite faces was stickered red, a different pair of opposite faces was stickered blue, and on the last pair one face was stickered red and the other blue, so no small cube ends up with three stickers the same colour. How many small cubes have AT LEAST one red sticker AND at least one blue sticker?`, options, correctIndex, svg, solution: [
          `Every one of the 8 corner cubes touches one face from each of the three opposite-face pairs. Two pairs are fully one colour, but the third pair always contributes one red and one blue face — so EVERY corner sees both colours. All 8 corners qualify.`,
          `Along the cube's 12 edges, some border two same-colour faces (excluded) and some border one red and one blue face. Exactly 8 of the 12 edges are "mixed", each contributing (n−2) more qualifying small cubes.`,
          `Total = 8 (corners) + 8×(n−2) (mixed edges) = 8×(1+(n−2)) = 8×(n−1) = ${answer}.`] };
      },
    ];

    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tier1[0]();
  },

  /* G26 — product/sum optimisation: every closure's correct answer now
     genuinely depends on the randomised numbers (fixing the old bug where
     the d3/4 branch's answer was always the same variable regardless of the
     inputs). Tiers cover: fixed-sum max/min product, the rectangle-area
     mirror of that same idea, splitting a total into several parts, and
     comparing concrete candidate allocations. */
  productOpt(d) {
    const bestPartition = (T, k) => { // near-equal positive-integer partition of T into k parts, maximises the product
      const base = Math.floor(T / k), rem = T - base * k;
      const parts = []; for (let i = 0; i < k; i++) parts.push(base + (i < rem ? 1 : 0));
      return parts;
    };
    const product = (arr) => arr.reduce((a, b) => a * b, 1);

    const tier1 = [
      // (a) fixed sum of TWO integers, maximise the product (near-equal split)
      () => {
        const S = rand(6, 40);
        const a = Math.floor(S / 2), b = Math.ceil(S / 2);
        const maxProd = a * b;
        const { options, correctIndex } = buildMC(maxProd, [S - 1, maxProd + 1, maxProd - 1, S]);
        return { q: `Two positive whole numbers add up to ${S}. What is the largest possible value of their product?`, options, correctIndex, solution: [`Split as evenly as possible: ${a} and ${b} (they add to ${S}).`, `Any more lopsided split gives a smaller product — for a fixed sum, equal parts maximise the product.`, `${a} × ${b} = ${maxProd}.`] };
      },
      // (b) fixed product of THREE DISTINCT integers, maximise the sum
      () => {
        const target = pick([12, 18, 24, 30, 36, 48, 60, 72]);
        let best = -1, bestTriple = [];
        for (let a = 1; a < target; a++) for (let b = a + 1; b < target; b++) { if (target % (a * b) !== 0) continue; const c = target / (a * b); if (Number.isInteger(c) && c > b) { if (a + b + c > best) { best = a + b + c; bestTriple = [a, b, c]; } } }
        if (best < 0) return null;
        const { options, correctIndex } = buildMC(best, [best - 2, best + 2, target, Math.floor(Math.sqrt(target)) * 3]);
        return { q: `The product of three different positive integers is ${target}. What is the largest possible sum of these three integers?`, options, correctIndex, solution: [`Factorise ${target} into three distinct factors, trying to make them as UNEQUAL as possible (since 1 costs nothing in the product but adds to the sum).`, `${bestTriple.join(" × ")} = ${target}, sum = ${best}.`, `No other distinct-factor triple gives a bigger sum.`] };
      },
    ];

    const tier2 = [
      // (a) fixed sum of two integers, MINIMISE the product
      () => {
        const S = rand(6, 40);
        const minProd = 1 * (S - 1);
        const maxProdSameS = Math.floor(S / 2) * Math.ceil(S / 2);
        const { options, correctIndex } = buildMC(minProd, [minProd + 1, minProd - 1, maxProdSameS, S]);
        return { q: `Two positive whole numbers add up to ${S}. What is the smallest possible value of their product?`, options, correctIndex, solution: [`The product shrinks the more UNEQUAL the two numbers are.`, `The most lopsided legal split (both positive whole numbers) is 1 and ${S - 1}.`, `1 × ${S - 1} = ${minProd}.`] };
      },
      // (b) fixed-perimeter rectangle: max or min integer-sided area (mirrors (a) in a geometry context)
      () => {
        const S = rand(6, 30); const P = 2 * S;
        const wantMax = rand(0, 1) === 0;
        const a = Math.floor(S / 2), b = Math.ceil(S / 2);
        const maxArea = a * b, minArea = 1 * (S - 1);
        const answer = wantMax ? maxArea : minArea;
        const { options, correctIndex } = buildMC(answer, [wantMax ? minArea : maxArea, answer + 1, answer - 1, S * S]);
        return { q: `A rectangle has integer side lengths and a perimeter of ${P}. What is the ${wantMax ? "largest" : "smallest"} possible area?`, options, correctIndex, solution: [`Perimeter ${P} means the two side lengths add to ${S} (half the perimeter).`, wantMax ? `Area is maximised when the sides are as EQUAL as possible: ${a} and ${b}.` : `Area is minimised when the sides are as UNEQUAL as possible: 1 and ${S - 1}.`, `Area = ${wantMax ? `${a} × ${b}` : `1 × ${S - 1}`} = ${answer}.`] };
      },
    ];

    const tier3 = [
      // (a) split a fixed total into k parts to maximise the product (the true
      // answer depends on T's remainder mod k, not just a fixed rule)
      () => {
        const k = pick([3, 4]);
        const T = rand(k * 3, k * 10);
        const parts = bestPartition(T, k);
        const maxProd = product(parts);
        const { options, correctIndex } = buildMC(maxProd, [T - k + 1, maxProd + k, maxProd - k, T]);
        return { q: `A total of ${T} is to be split into ${k} positive whole numbers. What is the largest possible value of their product?`, options, correctIndex, solution: [`Split as evenly as possible: ${T}÷${k} = ${Math.floor(T / k)} remainder ${T % k}, so the parts are ${parts.join(", ")}.`, `Any less equal split gives a smaller product.`, `Product = ${parts.join(" × ")} = ${maxProd}.`] };
      },
      // (b) compare several concrete candidate allocations of the same fixed total
      () => {
        const k = pick([2, 3]);
        const T = rand(k * 4, k * 12);
        const near = bestPartition(T, k);
        const candidates = [near];
        let tries = 0;
        // build 5 candidates (not 4): `best` is always one of them, so filtering it out for
        // the decoys still leaves a genuine 4 rather than the 3 that a 4-candidate pool gave.
        while (candidates.length < 5 && tries < 80) {
          tries++;
          const spreadMax = Math.max(1, Math.floor(T / k) - 1);
          const spread = rand(1, spreadMax);
          const alt = near.map((p, i) => i === 0 ? p - spread : i === near.length - 1 ? p + spread : p);
          if (alt.some(x => x < 1)) continue;
          const key = alt.slice().sort((a, b) => a - b).join(",");
          if (candidates.some(c => c.slice().sort((a, b) => a - b).join(",") === key)) continue;
          candidates.push(alt);
        }
        if (candidates.length < 5) return null;
        const best = candidates.reduce((b, c) => product(c) > product(b) ? c : b);
        const { options, correctIndex } = buildMCStr(best.join(", "), candidates.filter(c => c !== best).map(c => c.join(", ")));
        return { q: `A total of ${T} is split into ${k} positive whole numbers in the following ways. Which split gives the LARGEST product?`, options, correctIndex, solution: [`Compare the products: ${candidates.map(c => `${c.join(" × ")} = ${product(c)}`).join("; ")}.`, `The largest product comes from the most EQUAL split: ${best.join(", ")}.`] };
      },
    ];

    const tier4 = [
      // (a) fixed sum of THREE DISTINCT integers, maximise the product — the near-equal
      // split from tier3(a) is no longer legal once repeats are banned, so the solver
      // must nudge the parts apart by the smallest amount and re-check the product.
      () => {
        const T = rand(12, 30);
        let best = -1, bestTriple = [];
        for (let a = 1; a < T; a++) {
          for (let b = a + 1; b < T; b++) {
            const c = T - a - b;
            if (c <= b) continue;
            const p = a * b * c;
            if (p > best) { best = p; bestTriple = [a, b, c]; }
          }
        }
        if (best < 0) return null;
        const nearEqual = bestPartition(T, 3);
        const nearProd = product(nearEqual);
        const { options, correctIndex } = buildMC(best, [nearProd, best + 1, best - 1, T]);
        return { q: `Three DIFFERENT positive whole numbers add up to ${T}. What is the largest possible value of their product?`, options, correctIndex, solution: [`With no distinctness rule the best split would be as equal as possible: ${nearEqual.join(", ")} (product ${nearProd}).`, `But the three numbers must all be different, so nudge the split apart by the smallest amount that still keeps them whole and distinct: ${bestTriple.join(", ")}.`, `${bestTriple.join(" × ")} = ${best}.`] };
      },
      // (b) fixed product of two DISTINCT integers, minimise the sum — when the product
      // is a perfect square the tempting equal-factor pair is banned, forcing a search
      // for the next-closest legal factor pair.
      () => {
        const N = pick([36, 64, 100, 144, 196]);
        const pairs = [];
        for (let a = 1; a * a <= N; a++) if (N % a === 0) pairs.push([a, N / a]);
        const distinctPairs = pairs.filter(([a, b]) => a !== b);
        if (!distinctPairs.length) return null;
        const best = distinctPairs.reduce((bb, c) => (c[0] + c[1]) < (bb[0] + bb[1]) ? c : bb);
        const bestSum = best[0] + best[1];
        const equalPair = pairs.find(([a, b]) => a === b);
        const nearSum = equalPair ? equalPair[0] * 2 : bestSum + 2;
        const { options, correctIndex } = buildMC(bestSum, [nearSum, bestSum + 1, bestSum - 1, N]);
        return { q: `Two DIFFERENT positive whole numbers multiply to give ${N}. What is the smallest possible value of their sum?`, options, correctIndex, solution: [`Normally the sum is smallest when the two factors are as close together as possible — here that would be ${equalPair ? `${equalPair[0]} and ${equalPair[1]}` : "a repeated factor"}, but that pair isn't allowed since the numbers must be different.`, `The next-closest legal pair is ${best.join(" and ")}.`, `${best[0]} + ${best[1]} = ${bestSum}.`] };
      },
      // (c) fixed total split into ANY number of parts (2 or more, solver's choice),
      // maximise the product — the genuine insight is that using MORE, smaller parts
      // (built from 3s, tidied up with 2s) beats the "just split into two" instinct.
      () => {
        const T = rand(8, 24);
        let threes = Math.floor(T / 3), rem = T % 3, twos = 0;
        if (rem === 1) { threes -= 1; twos = 2; } else if (rem === 2) { twos = 1; }
        const maxProd = Math.pow(3, threes) * Math.pow(2, twos);
        const a = Math.floor(T / 2), b = Math.ceil(T / 2);
        const twoPartProd = a * b;
        const { options, correctIndex } = buildMC(maxProd, [twoPartProd, maxProd + 1, maxProd - 1, T]);
        const partsDesc = `${threes ? `${threes} three${threes > 1 ? "s" : ""}` : ""}${threes && twos ? " and " : ""}${twos ? `${twos} two${twos > 1 ? "s" : ""}` : ""}`;
        return { q: `A positive whole number ${T} is split into two OR MORE positive whole-number parts — you choose how many. What is the largest possible product of the parts?`, options, correctIndex, solution: [`Splitting into just two parts (like ${a} and ${b}, product ${twoPartProd}) isn't always best — using MORE, smaller parts can beat it.`, `The best strategy is to build the total from as many 3s as possible, tidying up any leftover with 2s (never use a 1): here that's ${partsDesc}.`, `Product = ${maxProd}.`] };
      },
    ];

    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || productOpt(d);
  },

  /* G27 — tiling / placement: every tier proves its answer directly from the
     stated dimensions via a real covering or colouring argument (fixing the
     old bug where the d3/4 branch's answer was picked at random and had no
     connection to the rectangle in the question). Tier1 uses plain area
     bounds that are always achievable; tier2/3 use a real chessboard-colouring
     parity argument (a classic combinatorics result — see LESSONS.tiling
     section 6 for the "Gomory" corner-removal proof it relies on). */
tiling(d) {
    const colourCounts = (m, n) => {
      let c0 = 0, c1 = 0;
      for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) { if ((r + c) % 2 === 0) c0++; else c1++; }
      return [c0, c1];
    };
    const svgGrid = (m, n) => {
      const cell = Math.max(14, Math.min(30, Math.floor(240 / Math.max(m, n))));
      const cells = [];
      for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) cells.push(SR(20 + c * cell, 20 + r * cell, cell, cell));
      return svgBox(cells.join(""), 20 + n * cell + 20, 20 + m * cell + 20);
    };

    const tier1 = [
      () => {
        const m = rand(3, 8), n = rand(3, 9);
        const total = m * n;
        const maxDominoes = Math.floor(total / 2);
        const svg = svgGrid(m, n);
        const { options, correctIndex } = buildMC(maxDominoes, [maxDominoes + 1, maxDominoes - 1, total, Math.ceil(total / 2)]);
        return {
          q: `A ${m}×${n} grid of unit squares is given. What is the largest number of 1×2 dominoes that can be placed on the grid without overlapping (they do not need to cover every square)?`,
          options, correctIndex, svg,
          hint: `Each domino covers exactly 2 squares, so the number of dominoes can never exceed half the total number of squares.`,
          solution: {
            scenario: `Placing as many dominoes as possible on a ${m}×${n} grid.`,
            idea: `The area of the grid gives a hard upper bound: no more than ⌊area ÷ 2⌋ dominoes can ever fit, and this bound is always achievable.`,
            method: `Count squares, divide by 2 (rounding down), verify the bound is reachable by filling row by row.`,
            steps: [
              `The grid has ${m}×${n} = ${total} unit squares, and each domino covers exactly 2 of them.`,
              `So no more than ${total}÷2 = ${maxDominoes}${total % 2 ? " (rounding down, since one square is always left spare)" : ""} dominoes could ever fit.`,
              `This bound is always achievable: fill the grid row by row, laying dominoes end to end.`,
              `Maximum number of dominoes: ${maxDominoes}.`,
            ],
            check: `${maxDominoes} × 2 = ${maxDominoes * 2}, which is ${total % 2 ? `one less than ${total} — one square spare` : `exactly ${total}`}.`,
          },
        };
      },
      () => {
        const s = rand(2, 5);
        const W = s * rand(2, 6), H = s * rand(2, 6);
        const count = (W / s) * (H / s);
        const { options, correctIndex } = buildMC(count, [Math.round(W * H / s), (W / s) + (H / s), W * H, Math.round(W * H / (s * s)) + (W / s)]);
        return {
          q: `A ${W}×${H} rectangular wall is to be tiled exactly with square tiles of side ${s}, with no cutting and no gaps. How many tiles are needed?`,
          options, correctIndex,
          hint: `Find how many tiles fit along each dimension, then multiply — area ÷ tile-area gives the count, but it is cleaner to think per-row and per-column.`,
          solution: {
            scenario: `Covering a ${W}×${H} wall with ${s}×${s} square tiles, no cutting.`,
            idea: `Tiles must fit exactly in each direction, so count along the width and along the height separately, then multiply.`,
            method: `Divide each dimension by the tile side length to find how many fit, then multiply the two counts.`,
            steps: [
              `Along the width: ${W}÷${s} = ${W / s} tiles fit exactly.`,
              `Up the height: ${H}÷${s} = ${H / s} tiles fit exactly.`,
              `Total tiles = ${W / s} × ${H / s} = ${count}.`,
            ],
            check: `${count} tiles × ${s}² = ${count * s * s} square units = ${W}×${H} = ${W * H}. ✓`,
          },
        };
      },
    ];

    const tier2 = [
      () => {
        const m = rand(4, 9), n = rand(4, 9);
        const [c0, c1] = colourCounts(m, n);
        const majority = Math.max(c0, c1);
        const svg = svgGrid(m, n);
        const { options, correctIndex } = buildMC(majority, [Math.min(c0, c1), majority + 1, majority - 1, Math.ceil(m * n / 2) + 1]);
        return {
          q: `A ${m}×${n} grid is coloured like a chessboard (alternating colours, so no two touching squares share a colour). What is the largest possible number of squares of a single colour?`,
          options, correctIndex, svg,
          hint: `On a chessboard colouring, the two colours split as evenly as possible — exactly half each when the total is even, one colour getting one extra when the total is odd.`,
          solution: {
            scenario: `Counting the majority colour on a ${m}×${n} chessboard-coloured grid.`,
            idea: `Each row alternates colours, so the two colour counts differ by at most 1. The total number of squares determines whether they split exactly or one colour gets an extra square.`,
            method: `Count total squares, note whether even or odd, and apply the even-split or majority-by-one rule.`,
            steps: [
              `There are ${m * n} squares in total.`,
              m * n % 2 === 0
                ? `Since ${m}×${n} is even, the two colours split exactly evenly: ${majority} and ${majority}.`
                : `Since ${m}×${n} is odd, the colours cannot split evenly: it is ${majority} of one colour and ${Math.min(c0, c1)} of the other.`,
              `The larger colour count is ${majority}.`,
            ],
            check: `${majority} + ${Math.min(c0, c1)} = ${m * n}. ✓`,
          },
        };
      },
      () => {
        const m = rand(4, 7), n = rand(4, 7);
        if (m * n < 8) return null;
        const [c0, c1] = colourCounts(m, n);
        const cornerA = 0, cornerB = (m - 1 + n - 1) % 2;
        let c0After = c0, c1After = c1;
        if (cornerA === 0) c0After--; else c1After--;
        if (cornerB === 0) c0After--; else c1After--;
        const maxDominoes = Math.min(c0After, c1After);
        const svg = svgGrid(m, n);
        const { options, correctIndex } = buildMC(maxDominoes, [maxDominoes + 1, maxDominoes - 1, Math.floor((m * n - 2) / 2), Math.max(c0After, c1After)]);
        return {
          q: `A ${m}×${n} board is coloured like a chessboard. The two squares in opposite corners (top-left and bottom-right) are removed. What is the largest number of dominoes that can be placed on what remains, with no overlaps?`,
          options, correctIndex, svg,
          hint: `Every domino covers one dark square and one light square. After removing the two corners, count how many of each colour remain — the domino count is limited by whichever colour has fewer squares.`,
          solution: {
            scenario: `Maximum dominoes on a ${m}×${n} board after removing the two opposite corners.`,
            idea: `Colour-parity argument: each domino must cover one square of each chessboard colour, so the maximum equals the smaller of the two colour counts after removal.`,
            method: `Count the two colours on the full board, determine each removed corner's colour, subtract, then take the minimum.`,
            steps: [
              `Colour the board like a chessboard: ${c0} squares of one colour, ${c1} of the other.`,
              `The top-left and bottom-right corners are ${cornerA === cornerB ? "the SAME colour" : "DIFFERENT colours"}, so removing them leaves ${c0After} and ${c1After}.`,
              `Every domino covers exactly one square of each colour, so the number of dominoes can never exceed the smaller count: ${maxDominoes}.`,
              `This maximum can always be achieved on a board shaped like this, so the answer is ${maxDominoes}.`,
            ],
            check: `${maxDominoes} dominoes use ${maxDominoes} of each colour. Remaining unused: ${Math.max(c0After, c1After) - maxDominoes} square(s) of the larger colour — these can never be paired.`,
          },
        };
      },
    ];

    const tier3 = [
      () => {
        const m = rand(6, 9), n = rand(6, 9);
        const [c0, c1] = colourCounts(m, n);
        const cornerA = 0, cornerB = (m - 1 + n - 1) % 2;
        let c0After = c0, c1After = c1;
        if (cornerA === 0) c0After--; else c1After--;
        if (cornerB === 0) c0After--; else c1After--;
        const maxDominoes = Math.min(c0After, c1After);
        const svg = svgGrid(m, n);
        const { options, correctIndex } = buildMC(maxDominoes, [maxDominoes + 1, maxDominoes - 1, Math.floor((m * n - 2) / 2), Math.max(c0After, c1After)]);
        return {
          q: `A ${m}×${n} board is coloured like a chessboard, then the two squares in opposite corners are removed. What is the largest number of dominoes that can be placed on the remaining board?`,
          options, correctIndex, svg,
          hint: `The colour of each corner depends on whether its row-plus-column total is even or odd. Once you know which colours were removed, the domino count is limited by the smaller colour's tally.`,
          solution: {
            scenario: `Maximum dominoes on a ${m}×${n} board after removing the two opposite corners.`,
            idea: `Chessboard colour-parity: each domino covers one of each colour, so the cap equals the smaller colour count after the two corners are removed.`,
            method: `Chessboard-colour the board, determine which colour each removed corner is (row + column parity), subtract, take the minimum.`,
            steps: [
              `Chessboard colouring gives ${c0} of one colour and ${c1} of the other out of ${m * n} squares.`,
              `The removed corners are ${cornerA === cornerB ? "the same colour" : "different colours"}, leaving ${c0After} and ${c1After}.`,
              `Each domino uses one square of each colour, so at most ${maxDominoes} dominoes can fit — and this many can always be placed.`,
            ],
            check: `${maxDominoes} × 2 = ${maxDominoes * 2} squares covered; ${Math.max(c0After, c1After) - maxDominoes} square(s) of the larger colour must remain uncovered.`,
          },
        };
      },
      () => {
        const dims = [[4, 4], [4, 8], [8, 4], [4, 12], [8, 8], [4, 16]];
        const [m, n] = pick(dims);
        const total = m * n;
        const maxPieces = total / 4;
        const svg = svgGrid(m, n);
        const { options, correctIndex } = buildMC(maxPieces, [maxPieces + 1, maxPieces - 1, Math.floor(total / 8), total]);
        return {
          q: `A ${m}×${n} rectangle is to be covered exactly by T-shaped pieces, each covering 4 squares, with no gaps and no overlaps. How many pieces are needed?`,
          options, correctIndex, svg,
          hint: `Each T-piece covers exactly 4 squares, so the number of pieces is the total area divided by 4. The key is that this particular rectangle can always be tiled this way — the count is both necessary and sufficient.`,
          solution: {
            scenario: `Exactly tiling a ${m}×${n} rectangle with T-shaped tetrominoes.`,
            idea: `Area argument gives the exact answer: total squares ÷ 4. This rectangle can be split into 4×4 blocks, each of which tiles neatly with 4 T-pieces.`,
            method: `Divide total squares by 4; verify the rectangle can be partitioned into 4×4 sub-blocks.`,
            steps: [
              `Each T-piece covers 4 squares, and the rectangle has ${total} squares.`,
              `${total}÷4 = ${maxPieces}, so no fewer than ${maxPieces} pieces could ever cover it, since every square must be covered exactly once.`,
              `A ${m}×${n} rectangle splits exactly into 4×4 blocks, and each 4×4 block can be tiled by 4 T-pieces, so ${maxPieces} pieces are both necessary and sufficient.`,
            ],
            check: `${maxPieces} × 4 = ${total} = ${m}×${n}. ✓`,
          },
        };
      },
    ];

    const tier4 = [
      () => {
        const m = rand(7, 10), n = rand(7, 10);
        if (m * n < 12) return null;
        const [c0, c1] = colourCounts(m, n);
        let r1 = rand(0, m - 1), col1 = rand(0, n - 1);
        let r2 = rand(0, m - 1), col2 = rand(0, n - 1), guard2 = 0;
        while (r1 === r2 && col1 === col2 && guard2 < 20) { r2 = rand(0, m - 1); col2 = rand(0, n - 1); guard2++; }
        if (r1 === r2 && col1 === col2) return null;
        const colourA = (r1 + col1) % 2, colourB = (r2 + col2) % 2;
        let c0After = c0, c1After = c1;
        if (colourA === 0) c0After--; else c1After--;
        if (colourB === 0) c0After--; else c1After--;
        const maxDominoes = Math.min(c0After, c1After);
        const cell = Math.max(14, Math.min(30, Math.floor(240 / Math.max(m, n))));
        const cells = [];
        for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
          const removed = (r === r1 && c === col1) || (r === r2 && c === col2);
          cells.push(SR(20 + c * cell, 20 + r * cell, cell, cell, "#2a1a5e", 2, removed ? "#e05d44" : "none"));
        }
        const svg = svgBox(cells.join(""), 20 + n * cell + 20, 20 + m * cell + 20);
        const { options, correctIndex } = buildMC(maxDominoes, [maxDominoes + 1, maxDominoes - 1, Math.floor((m * n - 2) / 2), Math.max(c0After, c1After)]);
        return {
          q: `A ${m}×${n} board is coloured like a chessboard (a square in row r, column c is one colour when r+c is even, the other colour when r+c is odd). The square in row ${r1 + 1}, column ${col1 + 1} and the square in row ${r2 + 1}, column ${col2 + 1} (shaded) are removed — they are not necessarily corners. What is the largest number of dominoes that can be placed on what remains, with no overlaps?`,
          options, correctIndex, svg,
          hint: `Work out each removed square's chessboard colour from its row and column numbers (row + column even → one colour, odd → the other), then apply the domino colour-balance argument.`,
          solution: {
            scenario: `Maximum dominoes on a ${m}×${n} board after removing two specific squares.`,
            idea: `The colour of any square is determined by (row + column) mod 2 — not by whether it looks like a corner. Once you know which colours were removed, the domino cap is the smaller colour count.`,
            method: `Use (row + column) mod 2 to colour each removed square, subtract from its colour's tally, take the minimum of the two tallies.`,
            steps: [
              `Chessboard-colour the board: ${c0} squares have row+column even, ${c1} have row+column odd.`,
              `Row ${r1 + 1}, column ${col1 + 1} has row+column = ${r1 + 1 + col1 + 1}, which is ${colourA === 0 ? "even" : "odd"}.`,
              `Row ${r2 + 1}, column ${col2 + 1} has row+column = ${r2 + 1 + col2 + 1}, which is ${colourB === 0 ? "even" : "odd"}.`,
              `${colourA === colourB ? "Both removed squares turn out to be the same colour, so that colour drops by 2" : "The removed squares turn out to be different colours, so each colour drops by 1"}, leaving ${c0After} and ${c1After} of the two colours.`,
              `Every domino covers exactly one square of each colour, so the number of dominoes can never exceed the smaller count, ${maxDominoes} — and this many can always be placed.`,
            ],
            check: `${maxDominoes} dominoes × 2 = ${maxDominoes * 2} squares covered. Leftover: ${Math.max(c0After, c1After) - maxDominoes} square(s) of the majority colour — permanently unpairable.`,
          },
        };
      },
      () => {
        const m = rand(6, 9), n = pick([6, 8]);
        const [c0, c1] = colourCounts(m, n);
        const colour = rand(0, 1);
        let r1 = rand(0, m - 1), col1 = rand(0, n - 1), guard1 = 0;
        while ((r1 + col1) % 2 !== colour && guard1 < 30) { r1 = rand(0, m - 1); col1 = rand(0, n - 1); guard1++; }
        let r2 = rand(0, m - 1), col2 = rand(0, n - 1), guard2 = 0;
        while (((r2 + col2) % 2 !== colour || (r2 === r1 && col2 === col1)) && guard2 < 30) { r2 = rand(0, m - 1); col2 = rand(0, n - 1); guard2++; }
        if ((r1 + col1) % 2 !== colour || (r2 + col2) % 2 !== colour || (r1 === r2 && col1 === col2)) return null;
        const minUncovered = c1 - (c0 - 2);
        const cell = Math.max(14, Math.min(30, Math.floor(240 / Math.max(m, n))));
        const cells = [];
        for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
          const removed = (r === r1 && c === col1) || (r === r2 && c === col2);
          cells.push(SR(20 + c * cell, 20 + r * cell, cell, cell, "#2a1a5e", 2, removed ? "#e05d44" : "none"));
        }
        const svg = svgBox(cells.join(""), 20 + n * cell + 20, 20 + m * cell + 20);
        const { options, correctIndex } = buildMC(minUncovered, [0, 1, 4]);
        return {
          q: `A ${m}×${n} board is coloured like a chessboard. The square in row ${r1 + 1}, column ${col1 + 1} and the square in row ${r2 + 1}, column ${col2 + 1} are removed — these two squares (shaded) are the SAME colour. Dominoes are then placed to cover as much of the remaining board as possible, with no overlaps. What is the smallest number of squares that must be left uncovered?`,
          options, correctIndex, svg,
          hint: `When two squares of the SAME chessboard colour are removed, one colour ends up with fewer squares than the other. Every domino needs one of each, so the surplus squares of the larger colour can never be covered — they are stranded.`,
          solution: {
            scenario: `Minimum uncovered squares when two same-colour squares are removed from a ${m}×${n} board.`,
            idea: `Removing two squares of the same colour creates a colour imbalance. Since each domino must cover one of each colour, the excess squares of the more plentiful colour cannot be paired and must stay uncovered.`,
            method: `Count each colour on the full board; subtract 2 from the removed colour; the excess of the larger over the smaller gives the minimum uncovered count.`,
            steps: [
              `Since ${n} is even, every row splits exactly in half by colour, so the whole board has ${c0} squares of each colour.`,
              `Both removed squares are the same colour, so that colour drops to ${c0 - 2} while the other colour stays at ${c1}.`,
              `Every domino covers one square of each colour, so at most ${c0 - 2} dominoes can be placed — that uses up all of the smaller colour.`,
              `That leaves ${c1} − ${c0 - 2} = ${minUncovered} squares of the larger colour with no partner left, so at least ${minUncovered} squares must stay uncovered. This minimum can always be achieved.`,
            ],
            check: `${c0 - 2} dominoes × 2 = ${2 * (c0 - 2)} squares covered + ${minUncovered} leftover = ${2 * (c0 - 2) + minUncovered} = ${m * n - 2} remaining squares. ✓`,
          },
        };
      },
    ];

    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || tiling(d);
  },
truthLiars(d) {
    const n = d <= 1 ? 4 : d <= 2 ? 4 : rand(4, 5);
    const askMode = pick(["count","count","person","exactlyOne"]);
    if (askMode === "exactlyOne") {
      for (let attempt2 = 0; attempt2 < 600; attempt2++) {
        const names2 = shuffle([...NAMES]).slice(0, n);
        const accusations = names2.map((_, i) => { let t; do { t = rand(0, n - 1); } while (t === i); return { target: t, claimLying: rand(0, 1) === 1 }; });
        const consistentLiars = [];
        for (let liarIdx = 0; liarIdx < n; liarIdx++) {
          let ok = true;
          for (let i = 0; i < n; i++) {
            const isTruthful = i !== liarIdx;
            const claim = accusations[i].claimLying ? (accusations[i].target === liarIdx) : (accusations[i].target !== liarIdx);
            if (isTruthful !== claim) { ok = false; break; }
          }
          if (ok) consistentLiars.push(liarIdx);
        }
        if (consistentLiars.length === 1) {
          const liarIdx = consistentLiars[0];
          const lines2 = names2.map((_, i) => `${names2[i]} says "${names2[accusations[i].target]} is ${accusations[i].claimLying ? "lying" : "telling the truth"}."`);
          const decoyPool2 = [...names2.filter((_,i)=>i!==liarIdx), ...shuffle(NAMES.filter(nm=>!names2.includes(nm)))];
          const { options, correctIndex } = buildMCStr(names2[liarIdx], decoyPool2.slice(0,4));
          return {
            q: `Exactly one of these ${n} people is lying; everyone else is telling the truth. ${lines2.join(" ")} Who is lying?`,
            options, correctIndex,
            hint: `Try each person in turn as the one liar. If everyone else's statement then holds up as true, you have found the liar. Only one choice works without contradiction.`,
            solution: {
              scenario: `Exactly one of ${n} people is lying; find which one is consistent with all the accusations.`,
              idea: `Test each candidate as the liar. A truth-teller's accusation must accurately describe the actual liar or non-liar; the liar's statement can be anything — but choosing the wrong candidate will always contradict at least one other statement.`,
              method: `For each person, assume they are the liar. Check every other person's statement: if they accuse the candidate of lying, that must be true; if they accuse someone else, that person must be a truth-teller. Accept the candidate only if no contradiction arises.`,
              steps: [
                `Test each person in turn as the possible liar, checking whether everyone else's statement then holds up as true.`,
                `Only one choice works without contradiction: ${names2[liarIdx]} is the liar.`,
              ],
              check: `With ${names2[liarIdx]} as the liar, verify each of the other ${n - 1} statements is true. If any were false, a different person would have to be the liar — but there is no other consistent choice.`,
            },
          };
        }
      }
    }
    for (let attempt = 0; attempt < 600; attempt++) {
      const names = shuffle([...NAMES]).slice(0, n);
      const statements = names.map((_, i) => {
        const useCount = rand(0, 3) === 0 || (d >= 3 && rand(0, 2) === 0);
        if (useCount) return { kind: "count", countLying: rand(1, n - 1) };
        let t; do { t = rand(0, n - 1); } while (t === i);
        return { kind: "accuse", target: t, claimLying: rand(0, 1) === 1 };
      });
      const liarCounts = [];
      const solutions = [];
      for (let mask = 0; mask < (1 << n); mask++) {
        const tr = names.map((_, i) => !!(mask & (1 << i)));
        let ok = true;
        for (let i = 0; i < n; i++) {
          const s = statements[i];
          let claim;
          if (s.kind === "accuse") claim = s.claimLying ? !tr[s.target] : tr[s.target];
          else claim = (tr.filter(x => !x).length === s.countLying);
          if (tr[i] !== claim) { ok = false; break; }
        }
        if (ok) { liarCounts.push(tr.filter(x => !x).length); solutions.push(tr); }
      }
      if (solutions.length === 0) continue;
      const lines = statements.map((s, i) => {
        if (s.kind === "accuse") return `${names[i]} says "${names[s.target]} is ${s.claimLying ? "lying" : "telling the truth"}."`;
        return `${names[i]} says "Exactly ${s.countLying} of us ${s.countLying === 1 ? "is" : "are"} lying."`;
      });
      if (askMode === "count") {
        const uniq = [...new Set(liarCounts)];
        if (uniq.length !== 1) continue;
        const lying = uniq[0];
        const decoys = Array.from({ length: n + 1 }, (_, k) => k).filter((x) => x !== lying);
        const { options, correctIndex } = buildMC(lying, decoys);
        return {
          q: `${lines.join(" ")} How many of the ${n} are lying?`,
          options, correctIndex,
          hint: `Assume a number of liars, then check whether every statement is consistent with that assumption. The right number of liars is the only one that produces no contradiction.`,
          solution: {
            scenario: `${n} people make statements about each other; find how many are lying.`,
            idea: `Try each possible count of liars (0 to ${n}). For each count, check all possible assignments of who is truthful and who is lying, and see which count is consistent with every statement.`,
            method: `Test every combination of truth-values; only one consistent situation exists here.`,
            steps: [
              `Test each possibility for who is telling the truth and who is lying.`,
              `Only one consistent situation works: exactly ${lying} of the ${n} must be lying.`,
              `Any other number leads to a contradiction with at least one statement.`,
            ],
            check: `With ${lying} liar${lying === 1 ? "" : "s"}, go through each statement and confirm it is true (for truth-tellers) or false (for liars). All ${n} statements should be consistent.`,
          },
        };
      }
      const askTruthful = pick([true,false]);
      const candidates = names.map((_, i) => solutions.every(tr => tr[i] === solutions[0][i]) ? solutions[0][i] : null);
      const validIdx = candidates.map((v,i) => (v === askTruthful) ? i : -1).filter(i => i !== -1);
      if (validIdx.length !== 1) continue;
      const targetIdx = validIdx[0];
      const others = names.filter((_,i) => i !== targetIdx);
      const decoyPool = [...shuffle(others), ...shuffle(NAMES.filter(nm=>!names.includes(nm)))];
      const { options, correctIndex } = buildMCStr(names[targetIdx], decoyPool.slice(0,4));
      return {
        q: `${lines.join(" ")} Who is DEFINITELY ${askTruthful ? "telling the truth" : "lying"}, no matter how the rest work out?`,
        options, correctIndex,
        hint: `There may be more than one consistent assignment of who is truthful and who is lying. The question asks for someone whose truth-value is the same in ALL consistent solutions — that is the person you can be certain about.`,
        solution: {
          scenario: `${n} people make statements; find whose truth/lying status is forced regardless of how the others work out.`,
          idea: `Find every assignment of truth-values that is self-consistent. If one person has the same truth-value in all of them, their status is certain; everyone else may vary.`,
          method: `List all consistent truth-assignments (there may be more than one). Check which person's value is the same in every assignment.`,
          steps: [
            `Test every possible combination of who is truthful and who is lying.`,
            `${solutions.length > 1 ? `More than one overall combination is consistent, but` : "Only one overall combination is consistent, and"} ${names[targetIdx]} ${askTruthful ? "tells the truth" : "lies"} in every single one of them.`,
            `So ${names[targetIdx]} is the one who is definitely ${askTruthful ? "telling the truth" : "lying"}.`,
          ],
          check: `Check the other people: for at least one of them, there must be a consistent scenario where they are truthful AND a consistent scenario where they lie — otherwise they would be the certain answer, not ${names[targetIdx]}.`,
        },
      };
    }
    const nm = shuffle([...NAMES]).slice(0, 4);
    const { options, correctIndex } = buildMC(2, [1, 3, 4, 0]);
    return {
      q: `${nm[0]} says "${nm[1]} is lying." ${nm[1]} says "${nm[2]} is lying." ${nm[2]} says "${nm[1]} is lying." ${nm[3]} says "${nm[0]} is lying." How many of the 4 are lying?`,
      options, correctIndex,
      hint: `Try assuming different numbers of liars and check whether all statements are consistent with that assumption.`,
      solution: {
        scenario: `Four people accuse each other; find how many are lying.`,
        idea: `Test each possible liar-count. The only self-consistent answer is exactly 2 liars.`,
        method: `Try 0, 1, 2, 3, 4 liars in turn; only one count avoids contradiction.`,
        steps: [
          `If ${nm[1]} is lying then ${nm[2]} tells the truth, so ${nm[1]} is lying — consistent.`,
          `Working through, exactly 2 of the 4 are lying.`,
        ],
        check: `Verify: with exactly 2 liars, every truth-teller's statement describes a liar correctly and every liar's statement is false.`,
      },
    };
  },
seating(d) {
    const permutations = (arr) => {
      if (arr.length <= 1) return [arr];
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        const rest = arr.slice(0, i).concat(arr.slice(i + 1));
        for (const p of permutations(rest)) result.push([arr[i], ...p]);
      }
      return result;
    };
    const neighboursOf = (arr, name) => { const n = arr.length; const i = arr.indexOf(name); return [arr[(i - 1 + n) % n], arr[(i + 1) % n]]; };
    const isNextIn = (arr, a, b) => { const n = arr.length; const i = arr.indexOf(a); return arr[(i + 1) % n] === b || arr[(i - 1 + n) % n] === b; };
    const isOppIn = (arr, a, b) => { const n = arr.length; const i = arr.indexOf(a); return arr[(i + n / 2) % n] === b; };
    function factorial(k) { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r; }

    const makeDeduction = (n, askOpposite, minClues, maxClues) => () => {
      if (askOpposite && n % 2 !== 0) return null;
      for (let attempt = 0; attempt < 15; attempt++) {
        const trueArr = shuffle([...NAMES]).slice(0, n);
        const X = pick(trueArr);
        const others = trueArr.filter(nm => nm !== X);
        const cluePool = [];
        for (let i = 0; i < others.length; i++) for (let j = i + 1; j < others.length; j++) {
          const a = others[i], b = others[j];
          cluePool.push({ a, b, type: "next", val: isNextIn(trueArr, a, b) });
          if (n % 2 === 0) cluePool.push({ a, b, type: "opp", val: isOppIn(trueArr, a, b) });
        }
        const shuffledClues = shuffle(cluePool);
        const rest = trueArr.slice(1);
        const perms = permutations(rest).map(p => [trueArr[0], ...p]);
        for (let k = minClues; k <= Math.min(maxClues, shuffledClues.length); k++) {
          const chosen = shuffledClues.slice(0, k);
          const validAnswers = new Set(); let validCount = 0;
          for (const arr of perms) {
            let ok = true;
            for (const c of chosen) {
              const actual = c.type === "next" ? isNextIn(arr, c.a, c.b) : isOppIn(arr, c.a, c.b);
              if (actual !== c.val) { ok = false; break; }
            }
            if (ok) {
              validCount++;
              const ans = askOpposite ? arr[(arr.indexOf(X) + n / 2) % n] : neighboursOf(arr, X).slice().sort().join(" and ");
              validAnswers.add(ans);
              if (validAnswers.size > 1) break;
            }
          }
          if (validCount >= 1 && validAnswers.size === 1) {
            const answer = [...validAnswers][0];
            const clueLines = chosen.map(c => {
              if (c.type === "next") return c.val ? `${c.a} sits next to ${c.b}.` : `${c.a} does not sit next to ${c.b}.`;
              return c.val ? `${c.a} sits opposite ${c.b}.` : `${c.a} does not sit opposite ${c.b}.`;
            });
            if (askOpposite) {
              const pairPool = others.filter(nm => nm !== answer);
              const { options, correctIndex } = buildMCStr(answer, shuffle(pairPool).slice(0, 4));
              return {
                q: `${n} people sit around a round table. ${clueLines.join(" ")} Who sits directly opposite ${X}?`,
                options, correctIndex,
                hint: `Use the clues to work out which seating arrangements are consistent. Every consistent arrangement must give the same answer for who sits opposite ${X} — that person is the unique answer.`,
                solution: {
                  scenario: `${n} people seated in a circle; deduce who is opposite a named person using clues about other pairs.`,
                  idea: `Eliminate every seating that contradicts at least one clue. If the same person sits opposite ${X} in all surviving seatings, that is the answer.`,
                  method: `List the clues, rule out inconsistent arrangements, and read off the common answer.`,
                  steps: [
                    ...clueLines.map(l => `Clue: ${l}`),
                    `Testing every seating consistent with the clues, ${X} always ends up opposite ${answer}.`,
                  ],
                  check: `Try to construct a valid seating where ${X} is opposite someone other than ${answer} — every attempt will violate at least one of the given clues.`,
                },
              };
            } else {
              const pairPool = [];
              for (let i = 0; i < others.length; i++) for (let j = i + 1; j < others.length; j++) {
                const key = [others[i], others[j]].sort().join(" and ");
                if (key !== answer) pairPool.push(key);
              }
              const { options, correctIndex } = buildMCStr(answer, shuffle(pairPool).slice(0, 4));
              return {
                q: `${n} people sit around a round table. ${clueLines.join(" ")} Who are the two people sitting next to ${X}?`,
                options, correctIndex,
                hint: `Apply the clues one by one to narrow down where each person can sit. When only one arrangement (or one set of arrangements all agreeing on the same neighbours) survives, you have the answer.`,
                solution: {
                  scenario: `${n} people seated in a circle; deduce who sits on either side of a named person.`,
                  idea: `Use each clue to restrict which positions are possible for each person. The clues together force a unique answer for ${X}'s neighbours.`,
                  method: `Apply clues to eliminate seatings; the one surviving arrangement (or all surviving ones) tells you ${X}'s neighbours.`,
                  steps: [
                    ...clueLines.map(l => `Clue: ${l}`),
                    `Testing every seating consistent with the clues, ${X}'s neighbours are always ${answer}.`,
                  ],
                  check: `Try to seat ${X} next to a different pair while satisfying all the clues — it is impossible.`,
                },
              };
            }
          }
        }
      }
      return null;
    };

    const countingClosure = () => {
      const n = rand(5, 8);
      const [x, y] = NP();
      const together = rand(0, 1) === 0;
      const adjacentCount = factorial(n - 2) * 2;
      const totalCount = factorial(n - 1);
      const answer = together ? adjacentCount : totalCount - adjacentCount;
      const { options, correctIndex } = buildMC(answer, [totalCount, adjacentCount, answer + 1, answer - 1]);
      return {
        q: `${n} people sit around a round table (rotations of the same arrangement are not counted twice). In how many different arrangements ${together ? `are ${x} and ${y} sitting next to each other` : `are ${x} and ${y} NOT sitting next to each other`}?`,
        options, correctIndex,
        hint: `${together ? `Treat the two people who must sit together as a single "glued" block, then count circular arrangements of the remaining items (remembering the block can face two ways).` : `Count all circular arrangements, then subtract those where the two people ARE adjacent.`}`,
        solution: {
          scenario: `Counting circular arrangements of ${n} people ${together ? `where ${x} and ${y} are adjacent` : `where ${x} and ${y} are not adjacent`}.`,
          idea: `${together ? `Gluing two people into one block reduces the problem to arranging fewer items in a circle, then multiply by 2 for the block's internal order.` : `Use complementary counting: total arrangements minus the adjacent ones.`}`,
          method: `${together ? `Fix one person to remove rotational symmetry; glue ${x} and ${y}; count remaining arrangements; multiply by 2.` : `Compute total circular arrangements with (n−1)!, subtract the ${x}-next-to-${y} count.`}`,
          steps: [
            `Total arrangements around the table: (${n}−1)! = ${totalCount}.`,
            `Treat ${x} and ${y} as glued together as one block: that leaves ${n - 1} items to arrange in a circle, (${n - 2})! ways, times 2 for the two orders of ${x} and ${y} within the block: ${adjacentCount}.`,
            together
              ? `So ${x} and ${y} are adjacent in ${adjacentCount} arrangements.`
              : `So ${x} and ${y} are NOT adjacent in ${totalCount} − ${adjacentCount} = ${answer} arrangements.`,
          ],
          check: `${together ? `${adjacentCount} ≤ ${totalCount}` : `${answer} + ${adjacentCount} = ${totalCount}`}. ✓`,
        },
      };
    };

    const tier1 = [ makeDeduction(5, false, 2, 4), makeDeduction(6, true, 2, 4) ];
    const tier2 = [ countingClosure, makeDeduction(6, false, 3, 6) ];
    const tier3 = [
      () => {
        const total = rand(21, 28); const [a, z] = NP(); const ratio = 6;
        const s = (total - 2) / (ratio + 1);
        if (!Number.isInteger(s)) return null;
        const { options, correctIndex } = buildMC(total, [total - 1, total + 1, total - 2, total + 2]);
        return {
          q: `More than 20 and fewer than 30 children stand in a circle. ${a} notices that there are ${ratio} times as many children between ${a} and ${z} going clockwise as there are going anti-clockwise. How many children are there altogether?`,
          options, correctIndex,
          hint: `Let the shorter arc have s children (not counting the two named children). The longer arc has ${ratio}s. The total is s + ${ratio}s + 2. Use the constraint that s must be a whole number.`,
          solution: {
            scenario: `Children in a circle; the arc going one way is ${ratio} times the arc going the other way.`,
            idea: `Express both arcs in terms of one unknown, write an equation for the total, and solve.`,
            method: `Let the shorter arc = s. Longer arc = ${ratio}s. Total = ${ratio}s + s + 2 = total. Solve for s, check it is a whole number, read off total.`,
            steps: [
              `Let the shorter arc have s children (not counting ${a} and ${z}).`,
              `Longer arc: ${ratio}s. Total: ${ratio}s + s + 2 = total.`,
              `(${ratio}+1)s = total−2, so s must be a whole number.`,
              `s = (total−2)÷${ratio + 1} = ${s}. Total = ${total}.`,
            ],
            check: `${s} + ${ratio * s} + 2 = ${total}. The ${ratio}:1 ratio holds, and ${total} is between 20 and 30. ✓`,
          },
        };
      },
      makeDeduction(8, true, 3, 8),
    ];

    const tier4 = [
      () => {
        const n = rand(6, 8);
        const [x, y] = NP();
        const others = shuffle(NAMES.filter(nm => nm !== x && nm !== y));
        const [p, q] = others;
        const totalCount = factorial(n - 1);
        const oneBlock = factorial(n - 2) * 2;
        const bothBlocks = factorial(n - 3) * 4;
        const { options, correctIndex } = buildMC(bothBlocks, [totalCount, oneBlock, bothBlocks * 2, bothBlocks + factorial(n - 3)]);
        return {
          q: `${n} people sit around a round table (rotations of the same arrangement are not counted twice). ${x} insists on sitting next to ${y}, and separately ${p} insists on sitting next to ${q}. In how many different arrangements can this happen?`,
          options, correctIndex,
          hint: `Glue each adjacent pair into a single block. Then count circular arrangements of the resulting smaller set of items, and multiply by 2 for each block's internal order.`,
          solution: {
            scenario: `Circular arrangements of ${n} people with two separate adjacency requirements.`,
            idea: `Treat each required adjacent pair as a single glued block. The problem becomes arranging (n−2) items in a circle, with 2×2 choices for the internal order of the two blocks.`,
            method: `Glue both pairs → ${n - 2} items to arrange in a circle → (n−3)! × 4.`,
            steps: [
              `Glue ${x} and ${y} together as one block, and glue ${p} and ${q} together as a second block.`,
              `That leaves ${n - 4} loose people plus 2 blocks, i.e. ${n - 2} items, to arrange around the table.`,
              `Circular arrangements of ${n - 2} items: (${n - 2}−1)! = ${factorial(n - 3)}.`,
              `Each block can face two ways internally (${x}-${y} or ${y}-${x}, and ${p}-${q} or ${q}-${p}), a factor of 2×2 = 4.`,
              `Total: ${factorial(n - 3)} × 4 = ${bothBlocks}.`,
            ],
            check: `${bothBlocks} ≤ ${oneBlock} ≤ ${totalCount}: both constraints reduce the count. ✓`,
          },
        };
      },
      () => {
        const n = rand(6, 8);
        const [x, y] = NP();
        const others = shuffle(NAMES.filter(nm => nm !== x && nm !== y));
        const [z, w] = others;
        const together = factorial(n - 2) * 2;
        const bothTogether = factorial(n - 3) * 4;
        const answer = together - bothTogether;
        const { options, correctIndex } = buildMC(answer, [together, bothTogether, factorial(n - 1), answer + bothTogether]);
        return {
          q: `${n} people sit around a round table (rotations of the same arrangement are not counted twice). ${x} sits next to ${y}, but ${z} does NOT sit next to ${w}. In how many different arrangements can this happen?`,
          options, correctIndex,
          hint: `Count arrangements where ${x} is next to ${y} (using the glued-block method), then subtract those that also have ${z} next to ${w}.`,
          solution: {
            scenario: `Circular arrangements: one pair must be adjacent, another pair must not be.`,
            idea: `Complementary counting within a constraint: count the restricted set (${x} next to ${y}), subtract the over-restricted overlap (both adjacent pairs hold).`,
            method: `Count "${x} next to ${y}" arrangements, then subtract "${x} next to ${y} AND ${z} next to ${w}" arrangements.`,
            steps: [
              `First count arrangements where ${x} sits next to ${y}: glue them into one block, leaving ${n - 1} items to arrange in a circle, (${n - 2})! ways, times 2 for their internal order: ${together}.`,
              `Among those, find how many also have ${z} next to ${w}: glue both pairs into blocks, leaving ${n - 2} items to arrange in a circle, (${n - 3})! ways, times 2×2 for the two internal orders: ${bothTogether}.`,
              `We want ${x} next to ${y} but ${z} NOT next to ${w}, so subtract the overlap: ${together} − ${bothTogether} = ${answer}.`,
            ],
            check: `${answer} + ${bothTogether} = ${together}: the non-adjacent and adjacent-overlap counts add back to the unconstrained adjacent total. ✓`,
          },
        };
      },
    ];

    const bank = d <= 1 ? tier1 : d <= 2 ? tier2 : d === 3 ? tier3 : tier4;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || G.seating(d);
  },
pigeonhole(d) {
    const [a]=NP();
    if (d <= 2) {
      const sub = rand(0,2);
      if (sub === 0) {
      const greens=rand(3,6),yellows=rand(3,6);
      const gA=rand(2,5),yA=rand(2,5),gP=rand(2,5),yP=rand(2,5);
      const total=greens+yellows;
      const worst=Math.max(gA+yA,gP+yP)+1;
      const {options,correctIndex}=buildMC(worst,[worst-1,worst+1,total,worst+2]);
      return {
        q:`A bag contains ${gA} green apples, ${yA} yellow apples, ${gP} green pears and ${yP} yellow pears. ${a} takes fruit at random one piece at a time. How many pieces must ${a} take to be certain of having at least one apple and at least one pear?`,
        options, correctIndex,
        hint: `Think about the worst case: how many pieces could you pick before being forced to have both types? You might take all the apples first, or all the pears first — whichever gives the longer unlucky run, add one more to guarantee both.`,
        solution: {
          scenario: `Picking fruit from a mixed bag and needing at least one apple and at least one pear.`,
          idea: `Worst case: you pick all pieces of one type before getting any of the other. Add one more piece to break through that worst-case run.`,
          method: `Find the maximum number you could take without having both types: that is max(all apples, all pears). Add 1.`,
          steps: [
            `Worst case: ${a} could take all ${gA+yA} apples or all ${gP+yP} pears first.`,
            `To guarantee both types: take ${Math.max(gA+yA,gP+yP)} then one more = ${worst}.`,
          ],
          check: `After ${worst-1} picks, you might still have only apples (or only pears). The ${worst}th pick must give you the other type.`,
        },
      };
      }
      if (sub === 1) {
        const colours = rand(3,5); const need = rand(2,4);
        const worst2 = colours*(need-1)+1;
        const nm2 = N1();
        const {options,correctIndex}=buildMC(worst2,[worst2-1,worst2+1,colours*need,colours+need]);
        return {
          q:`A drawer contains socks in ${colours} different colours (plenty of each colour). ${nm2} pulls socks out one at a time without looking. How many socks must ${nm2} pull out to be certain of having ${need} socks of the SAME colour?`,
          options, correctIndex,
          hint: `Worst case: you get as many socks as possible without having ${need} of any one colour. That means (${need}−1) of each colour. One more sock must tip one colour over the threshold.`,
          solution: {
            scenario: `Drawing socks from a drawer with ${colours} colours, needing ${need} matching.`,
            idea: `Pigeonhole principle: if you have more than (colours × (need−1)) socks, at least one colour must appear at least ${need} times.`,
            method: `Multiply the number of colours by (need − 1) to get the worst-case count without a matching set, then add 1.`,
            steps: [
              `Worst case: pull ${need-1} of every colour first, with no match yet — that's ${colours} × ${need-1} = ${colours*(need-1)} socks.`,
              `One more sock, of any colour, must complete a set of ${need}: ${colours*(need-1)} + 1 = ${worst2}.`,
            ],
            check: `${worst2 - 1} socks can be all (${need-1}) of each colour with none hitting ${need}; the ${worst2}th must tip one colour to ${need}. ✓`,
          },
        };
      }
      const categories = rand(4,12);
      const worst3 = categories+1;
      const nm3 = N1();
      const {options,correctIndex}=buildMC(worst3,[categories,worst3+1,categories*2,worst3-1]);
      return {
        q:`Every student at a school was born in one of ${categories} different months of intake (there's no limit on how many students share a month). What is the minimum number of students needed in a room to GUARANTEE that at least two of them share the same intake month?`,
        options, correctIndex,
        hint: `With ${categories} possible months, the first ${categories} students could all have different months. The very next student must share a month with someone.`,
        solution: {
          scenario: `Students with ${categories} possible intake months; guarantee a shared month.`,
          idea: `The pigeonhole principle: if there are more students than categories, at least two must share a category.`,
          method: `Add 1 to the number of categories.`,
          steps: [
            `Worst case: the first ${categories} students could all have different intake months, one each — no match yet.`,
            `The next student, number ${worst3}, must share a month with someone already there, since there are only ${categories} months.`,
          ],
          check: `${categories} students can have all different months; ${worst3} students cannot. ✓`,
        },
      };
    }
    const sub2 = rand(0,2);
    if (sub2 === 0) {
      const minRed=rand(2,4),minGreen=rand(2,4);
      const maxSize=(minRed-1)+(minGreen-1);
      const {options,correctIndex}=buildMC(maxSize,[maxSize+1,maxSize-1,minRed*minGreen,maxSize+2]);
      return {
        q:`A bag contains only red and green marbles. For every ${minRed} marbles chosen, at least one is red. For every ${minGreen} marbles chosen, at least one is green. What is the largest number of marbles the bag can contain?`,
        options, correctIndex,
        hint: `The first constraint limits how many greens can appear in a row (at most ${minRed-1} before a red must appear). The second limits consecutive reds (at most ${minGreen-1}). The maximum bag size is both limits added together.`,
        solution: {
          scenario: `A bag of red and green marbles with constraints on consecutive same-colour runs.`,
          idea: `Each constraint caps the maximum run of one colour. To maximise the bag size, place one colour's maximum run followed by the other's maximum run.`,
          method: `Max greens before a red must appear = minRed − 1. Max reds before a green must appear = minGreen − 1. Total = sum of the two limits.`,
          steps: [
            `Max consecutive green = ${minRed-1} (before a red must appear).`,
            `Max consecutive red = ${minGreen-1}. So bag can have at most ${minRed-1} green and ${minGreen-1} red.`,
            `Max total = ${maxSize}.`,
          ],
          check: `A bag of ${minRed-1} green then ${minGreen-1} red satisfies both constraints and cannot have any more marbles added without violating one of them. ✓`,
        },
      };
    }
    const colours2 = rand(3,6); const need2 = rand(2,5);
    const worst4 = colours2*(need2-1)+1;
    const nm4 = N1();
    const {options,correctIndex}=buildMC(need2,[need2+1,need2>1?need2-1:need2+2,colours2,worst4]);
    return {
      q:`At a school fair, a tombola drum holds raffle tickets in ${colours2} different colours (plenty of each colour). ${nm4} works out that the smallest number of tickets that GUARANTEES some colour has been pulled out several times over is exactly ${worst4}. How many tickets of the same colour does that guarantee?`,
      options, correctIndex,
      hint: `Work backwards from the guarantee formula: worst case is (K−1) of every colour, then one more. So ${colours2}×(K−1)+1 = ${worst4}. Solve for K.`,
      solution: {
        scenario: `Reverse-engineering the pigeonhole guarantee: given the worst-case draw number, find the guaranteed count per colour.`,
        idea: `The guarantee formula is: pull (K−1) of every colour = colours×(K−1) tickets before any colour has K, then one more gives K of some colour. Work backwards to find K.`,
        method: `Solve colours×(K−1)+1 = worst case for K.`,
        steps: [
          `If the guarantee is K tickets of one colour, the worst case is (K−1) of every colour first: ${colours2}×(K−1), then one more.`,
          `So ${colours2}×(K−1) + 1 = ${worst4}, giving K−1 = ${need2-1}, so K = ${need2}.`,
        ],
        check: `${colours2}×${need2-1}+1 = ${worst4}. ✓`,
      },
    };
  },
allocation(d) {
    const nm=N1();
    if (d <= 2) {
      const total=rand(20,35),boxes=rand(10,16),ones=rand(3,8);
      const threes=total+ones-2*boxes;
      if(threes<0||threes>boxes-ones) return G.allocation(d);
      const twos=boxes-ones-threes;
      if(twos<0) return G.allocation(d);
      const {options,correctIndex}=buildMC(threes,[threes+1,threes-1,threes+2,ones]);
      return {
        q:`${nm} places ${total} counters into ${boxes} boxes so that each box has 1, 2 or 3 counters. ${ones} boxes have exactly 1 counter. How many boxes have 3 counters?`,
        options, correctIndex,
        hint: `Set up two equations: one for the number of boxes and one for the total counters. The 1-counter boxes are already fixed, so solve for 2-counter and 3-counter boxes together.`,
        solution: {
          scenario: `${total} counters in ${boxes} boxes; each box holds 1, 2 or 3; ${ones} boxes hold 1.`,
          idea: `Two unknowns, two equations: box count and counter total. Eliminating one unknown gives the number of 3-counter boxes directly.`,
          method: `Let two-counter boxes = t, three-counter boxes = h. Write t + h = ${boxes-ones} and 2t + 3h = ${total-ones}. Subtract the first from the second to find h.`,
          steps: [
            `Let two-counter boxes = t, three-counter boxes = h.`,
            `t + h = ${boxes-ones} and 2t + 3h = ${total-ones}.`,
            `h = ${total-ones} − 2×${boxes-ones} = ${threes}.`,
          ],
          check: `t = ${twos}, h = ${threes}: ${twos}×2 + ${threes}×3 + ${ones}×1 = ${twos*2 + threes*3 + ones} = ${total}. Boxes: ${ones}+${twos}+${threes} = ${boxes}. ✓`,
        },
      };
    }
    const sub3 = rand(0,3);
    if (sub3 === 0) {
      const houses=rand(7,11),adj_max=pick([5,6,7]);
      const a=adj_max-1,b=1;
      const n_a=Math.ceil(houses/2),n_b=Math.floor(houses/2);
      const maxTotal=n_a*a+n_b*b;
      const {options,correctIndex}=buildMC(maxTotal,[maxTotal-2,maxTotal+2,houses*Math.floor(adj_max/2),maxTotal-1]);
      return {
        q:`There are ${houses} houses in a row. At least one person lives in each house. Any two neighbouring houses have at most ${adj_max} people between them. What is the largest number of people that could be living in the street altogether?`,
        options, correctIndex,
        hint: `To pack in the most people, alternate between a large house and a small house (size 1). The pair (large, 1) must satisfy: large + 1 ≤ ${adj_max}, so large ≤ ${adj_max-1}.`,
        solution: {
          scenario: `Maximising total occupants with a neighbour-sum cap of ${adj_max}.`,
          idea: `Alternating maximum/minimum makes best use of the constraint: put ${adj_max-1} in every other house and 1 in between.`,
          method: `Alternate ${adj_max-1} and 1. Count how many of each fit in ${houses} houses, then multiply and add.`,
          steps: [
            `To maximise, alternate big and small: ${a} and 1 in turns.`,
            `${n_a} houses with ${a}, ${n_b} houses with 1.`,
            `Total: ${n_a}×${a} + ${n_b}×1 = ${maxTotal}.`,
          ],
          check: `Every adjacent pair sums to ${a}+1 = ${adj_max} ≤ ${adj_max}. ✓`,
        },
      };
    }
    if (sub3 === 1) {
      const sweets = rand(8,14), children = rand(3,4);
      const choose=(nn,kk)=>{ let r=1; for(let i=0;i<kk;i++) r=r*(nn-i)/(i+1); return Math.round(r); };
      const ways = choose(sweets-1, children-1);
      const nm2=N1();
      const {options,correctIndex}=buildMC(ways,[ways+choose(sweets-1,children-2)||ways+5,ways-1>0?ways-1:ways+3,sweets*children,choose(sweets,children)].filter(x=>x!==ways));
      return {
        q:`${nm2} shares ${sweets} identical sweets among ${children} children, so that every child gets at least one sweet (the children can get different numbers). How many different ways can this be done, if it matters WHO gets how many (not just the split itself)?`,
        options, correctIndex,
        hint: `Give every child 1 sweet first to satisfy the "at least one" condition. Then share the remaining ${sweets-children} sweets freely using the stars-and-bars formula: C(remaining + children − 1, children − 1).`,
        solution: {
          scenario: `Distributing ${sweets} identical sweets among ${children} children, each getting at least one.`,
          idea: `Stars-and-bars: guarantee each child at least 1 by pre-allocating, then count the free distributions of the leftovers.`,
          method: `Pre-give 1 to each child (using ${children}), leaving ${sweets-children} to distribute freely. Stars-and-bars: C(${sweets-children} + ${children-1}, ${children-1}) = C(${sweets-1}, ${children-1}).`,
          steps: [
            `Give each child 1 sweet first (using up ${children} of the ${sweets}), leaving ${sweets-children} to share freely (including getting none extra).`,
            `The number of ways to split ${sweets-children} extra identical sweets among ${children} children is "${sweets-1} choose ${children-1}" = ${ways}.`,
          ],
          check: `C(${sweets-1},${children-1}) = ${ways}. Each way corresponds to a distinct distribution where every child has at least 1. ✓`,
        },
      };
    }
    if (sub3 === 2) {
      const d1=pick([2,5]), d2=pick([10,20,25].filter(x=>x!==d1*5));
      const target = d2*rand(2,4) + d1*rand(1,3);
      let best=null;
      for (let big=0; big*d2<=target; big++) { const rem=target-big*d2; if (rem%d1===0) { const count=big+rem/d1; if (best===null||count<best) best=count; } }
      if (best===null) return G.allocation(d);
      const {options,correctIndex}=buildMC(best,[best+1,best>1?best-1:best+2,Math.ceil(target/d2),Math.ceil(target/d1)].filter(x=>x!==best));
      const nm3=N1();
      return {
        q:`${nm3} has plenty of ${d1}p and ${d2}p coins. What is the SMALLEST number of coins ${nm3} needs to make exactly ${target}p?`,
        options, correctIndex,
        hint: `To use the fewest coins, prefer the larger coin. Try as many ${d2}p coins as possible; check whether the remainder divides evenly by ${d1}p. The first combination that works with the most ${d2}p coins gives the fewest total coins.`,
        solution: {
          scenario: `Making exactly ${target}p with ${d1}p and ${d2}p coins using the fewest coins possible.`,
          idea: `Greedy approach: maximise the use of the higher-value coin, then fill the remainder with the lower-value coin.`,
          method: `Try decreasing numbers of ${d2}p coins; for each, check whether the remainder divides by ${d1}. Take the first exact match.`,
          steps: [
            `Use as many ${d2}p coins as possible first, then fill the rest with ${d1}p coins, checking the remainder divides exactly.`,
            `The fewest coins that make exactly ${target}p is ${best}.`,
          ],
          check: `${best} coins making ${target}p: verify by computing how many ${d2}p and ${d1}p coins are used and that they sum to ${target}p.`,
        },
      };
    }
    const totalItems=rand(30,60), capMin=rand(2,3), capMax=capMin+rand(2,3);
    const minBoxes=Math.ceil(totalItems/capMax);
    const leftover = totalItems - (minBoxes-1)*capMax;
    if (leftover < capMin) return G.allocation(d);
    const nm4=N1();
    const {options,correctIndex}=buildMC(minBoxes,[minBoxes+1,minBoxes>1?minBoxes-1:minBoxes+2,Math.ceil(totalItems/capMin),Math.floor(totalItems/capMax)].filter(x=>x!==minBoxes));
    return {
      q:`${nm4} has ${totalItems} identical parcels to deliver using vans. Each van can carry between ${capMin} and ${capMax} parcels. What is the SMALLEST number of vans ${nm4} could possibly need?`,
      options, correctIndex,
      hint: `To use the fewest vans, pack each one as full as possible. Divide the total by the maximum capacity and round up — but check that the last van still meets the minimum.`,
      solution: {
        scenario: `Minimising the number of vans to carry ${totalItems} parcels with capacity ${capMin}–${capMax} each.`,
        idea: `Pack every van to its maximum capacity. The minimum number of vans is ⌈total ÷ max capacity⌉, as long as the last van's load still meets the minimum.`,
        method: `Compute ⌈${totalItems} ÷ ${capMax}⌉ = ${minBoxes}. Check the last van's load ≥ ${capMin}.`,
        steps: [
          `To use the fewest vans, pack each one as full as possible: ${capMax} parcels per van.`,
          `${totalItems} ÷ ${capMax} = ${(totalItems/capMax).toFixed(2)}, which rounds up to ${minBoxes} vans (the last van just holds the leftover, still within the ${capMin}-${capMax} range).`,
        ],
        check: `${minBoxes-1} vans × ${capMax} + ${leftover} = ${totalItems}. Last van has ${leftover} ≥ ${capMin}. ✓`,
      },
    };
  },
repeatOp(d) {
    const digitSum = (x) => String(x).split("").reduce((a, c) => a + Number(c), 0);
    const sumSqDigits = (x) => String(x).split("").reduce((a, c) => a + Number(c) * Number(c), 0);

    const tier1 = [
      () => {
        const x0 = rand(23, 9999);
        let v = x0; const trace = [x0];
        while (v >= 10) { v = digitSum(v); trace.push(v); }
        const root = v;
        const { options, correctIndex } = buildMC(root, [root + 1, root - 1 >= 0 ? root - 1 : root + 2, digitSum(x0), root + 9]);
        return {
          q: `Repeatedly replace ${x0} with the sum of its digits, until a single digit remains. What is the final digit?`,
          options, correctIndex,
          hint: `Each step replaces the number with the sum of its digits, which is always much smaller. Keep going until a single digit is left — this final value is called the digital root.`,
          solution: {
            scenario: `Repeatedly summing digits of ${x0} until a single digit remains.`,
            idea: `Every step shrinks the number dramatically (the digit sum of a k-digit number is at most 9k). The process always terminates in a single digit — the digital root.`,
            method: `Apply the digit-sum rule repeatedly: sum the digits, then sum the digits of the result, and so on until a single digit appears.`,
            steps: [
              `Sum the digits each time: ${trace.join(" → ")}.`,
              `The process always shrinks the number until only one digit is left — this final value is called the digital root.`,
              `The final digit is ${root}.`,
            ],
            check: `A shortcut: the digital root equals n mod 9, except when n is a multiple of 9, in which case it is 9 (and for n=0 it is 0). Check: ${x0} mod 9 = ${x0 % 9 === 0 ? 9 : x0 % 9}${x0 % 9 === root || (x0 % 9 === 0 && root === 9) ? " ✓" : ""}.`,
          },
        };
      },
      () => {
        const P0 = rand(4, 20); const D = rand(4, 10); const cullEvery = 3;
        let v = P0; const trace = [v];
        for (let day = 1; day <= D; day++) { v = v * 2; if (day % cullEvery === 0) v = v / 2; trace.push(v); }
        const R = v;
        if (!Number.isInteger(R) || R > 100000) return null;
        const { options, correctIndex } = buildMC(R, [R * 2, Math.round(R / 2), P0 * Math.pow(2, D), R + P0]);
        const nm = N1();
        return {
          q: `A population of ${P0} bacteria doubles every day. But every ${cullEvery}rd day, a cull happens straight after doubling and half the bacteria die. What is the population after ${D} days?`,
          options, correctIndex,
          hint: `Simulate day by day: every day the population doubles, and every ${cullEvery}rd day the population is then halved. Track the running total — the cull changes the pattern, so you cannot just raise 2 to a power.`,
          solution: {
            scenario: `Bacteria that double daily but are halved every ${cullEvery}rd day; find the count after ${D} days.`,
            idea: `The cull disrupts the simple doubling pattern, so simulate step by step rather than using a formula.`,
            method: `Start with ${P0}. Each day: multiply by 2; then, if the day number is a multiple of ${cullEvery}, divide by 2.`,
            steps: [
              `Simulate day by day: double, and every ${cullEvery}rd day also halve straight afterwards.`,
              `Day by day the population runs: ${trace.slice(1).join(", ")}.`,
              `After ${D} days: ${R}.`,
            ],
            check: `In every 3-day cycle, the net effect is ×2×2×2÷2 = ×4. Check whether ${D} days contain complete cycles and adjust for the partial cycle at the end.`,
          },
        };
      },
      () => {
        const R0 = rand(20, 60); const diff = rand(3, 15); const B0 = R0 - diff;
        const k = rand(1, 9); const N = rand(50, 5000);
        const { options, correctIndex } = buildMC(diff, [diff + k, diff - k, diff * N, R0 + B0]);
        const nm = N1();
        return {
          q: `Every day, ${nm} adds ${k} red counters and ${k} blue counters to two jars, which start with ${R0} red and ${B0} blue counters. After ${N} days, how many MORE red counters are there than blue counters?`,
          options, correctIndex,
          hint: `Adding the same number to both jars every day never changes the gap between them. The difference is an invariant — it stays constant no matter how many days pass.`,
          solution: {
            scenario: `Two jars of counters growing by the same amount daily; find the difference after many days.`,
            idea: `When both jars grow by the same amount each day, the gap between them never changes. This is a conserved quantity — an invariant.`,
            method: `Calculate the starting difference. Since equal amounts are added to each jar, that difference is preserved for all time.`,
            steps: [
              `Adding the SAME amount (${k}) to both jars every day never changes the gap between them — only the total in each jar grows.`,
              `The starting gap is ${R0} − ${B0} = ${diff}, and that gap is an invariant: it stays ${diff} forever, no matter how many days pass.`,
              `After ${N} days, red still has exactly ${diff} more than blue.`,
            ],
            check: `After ${N} days: red = ${R0} + ${k * N} = ${R0 + k * N}; blue = ${B0} + ${k * N} = ${B0 + k * N}. Difference = ${diff}. ✓`,
          },
        };
      },
      () => {
        const R0 = rand(20, 60); const diff0 = rand(3, 15); const B0 = R0 - diff0;
        const kR = rand(2, 9); let kB = rand(1, 8); if (kB === kR) kB = kR + 1;
        const N = rand(5, 40);
        const answer = diff0 + (kR - kB) * N;
        if (answer <= 0) return null;
        const { options, correctIndex } = buildMC(answer, [diff0, (kR - kB) * N, answer + N, answer - (kR - kB)]);
        const nm = N1();
        return {
          q: `${nm} tracks two rival YouTube channels' subscriber counts, which start at ${R0} and ${B0}. The first channel gains ${kR} new subscribers a day, the second gains ${kB} a day. After ${N} days, how many MORE subscribers does the first channel have than the second?`,
          options, correctIndex,
          hint: `Unlike a matched daily amount, the two channels grow at different rates — the gap changes every day. Each day the first channel pulls ${kR - kB} further ahead. Multiply this by the number of days and add to the starting gap.`,
          solution: {
            scenario: `Two channels with different daily growth rates; find the gap after ${N} days.`,
            idea: `The gap changes by (kR − kB) every day. Starting gap plus (daily change × number of days) gives the final gap.`,
            method: `Calculate starting difference: ${R0} − ${B0} = ${diff0}. Daily gap increase: ${kR} − ${kB} = ${kR - kB}. After ${N} days: ${diff0} + ${kR - kB}×${N}.`,
            steps: [
              `Unlike a matched daily amount, the two channels grow at DIFFERENT rates here, so the gap between them changes every day — it does not stay fixed.`,
              `Each day, the first channel pulls ${kR - kB > 0 ? `${kR - kB} further ahead of` : `${kB - kR} closer to`} the second, since it gains ${kR} and the second gains ${kB}.`,
              `Starting gap ${R0} − ${B0} = ${diff0}, plus ${N} days of gaining ${kR - kB} extra each day: ${diff0} + ${N}×${kR - kB} = ${answer}.`,
            ],
            check: `After ${N} days: first = ${R0 + kR * N}, second = ${B0 + kB * N}. Difference = ${R0 + kR * N} − ${B0 + kB * N} = ${answer}. ✓`,
          },
        };
      },
    ];

    const tier2 = [
      () => {
        const [a0, b0, c0] = [rand(2, 9), rand(1, 8), rand(1, 8)];
        const n = rand(100, 5000);
        const actualDiff = Math.max(a0, b0, c0) - Math.min(a0, b0, c0);
        const { options, correctIndex } = buildMC(actualDiff, [actualDiff + 1, actualDiff + a0, n % 7, actualDiff > 1 ? actualDiff - 1 : actualDiff + 3]);
        const nm = N1();
        return {
          q: `For a list of three numbers, "changesum" replaces each number with the sum of the other two. ${nm} starts with [${a0}, ${b0}, ${c0}] and applies changesum ${n} times. What is the largest difference between two numbers in the final list?`,
          options, correctIndex,
          hint: `Apply changesum once and observe the gaps. The largest difference between any two numbers stays the same every time changesum is applied — it is an invariant.`,
          solution: {
            scenario: `Changesum applied ${n} times to [${a0}, ${b0}, ${c0}]; find the largest gap.`,
            idea: `The largest pairwise difference is preserved by changesum. Spot this invariant by computing one step; then it holds for all subsequent steps.`,
            method: `Compute the largest gap in the starting list. Since changesum preserves it, that is also the gap after ${n} applications.`,
            steps: [
              `Try it once: [${a0},${b0},${c0}] becomes [${b0 + c0},${a0 + c0},${a0 + b0}]. The gaps between the numbers have simply been reshuffled — the LARGEST gap comes out the same size every time changesum is applied.`,
              `The largest difference in the starting list [${a0},${b0},${c0}] is ${Math.max(a0, b0, c0)} − ${Math.min(a0, b0, c0)} = ${actualDiff}.`,
              `That largest difference is an invariant: it stays ${actualDiff} no matter how many times changesum is applied, so after ${n} applications it is still ${actualDiff}.`,
            ],
            check: `After one application: [${b0+c0},${a0+c0},${a0+b0}]. Max − min = ${Math.max(b0+c0,a0+c0,a0+b0)} − ${Math.min(b0+c0,a0+c0,a0+b0)} = ${actualDiff}. Invariant confirmed. ✓`,
          },
        };
      },
      () => {
        const x0 = rand(10, 999);
        const seq = [x0]; const seen = new Map([[x0, 0]]);
        let cycleStart = -1, cycleLen = -1, fixedAt1 = -1;
        for (let i = 1; i <= 40; i++) {
          const nv = sumSqDigits(seq[i - 1]);
          if (nv === 1) { fixedAt1 = i; seq.push(1); break; }
          if (seen.has(nv)) { cycleStart = seen.get(nv); cycleLen = i - cycleStart; seq.push(nv); break; }
          seen.set(nv, i); seq.push(nv);
        }
        if (fixedAt1 === -1 && cycleStart === -1) return null;
        const M = rand(30, 80);
        let answer;
        if (fixedAt1 !== -1 && M >= fixedAt1) answer = 1;
        else if (fixedAt1 !== -1) answer = seq[M];
        else if (M >= cycleStart) { const pos = cycleStart + ((M - cycleStart) % cycleLen); answer = seq[pos]; }
        else answer = seq[M];
        const distractors = [answer + 1, answer > 1 ? answer - 1 : answer + 4, x0, seq[1] || x0];
        const { options, correctIndex } = buildMC(answer, distractors);
        const nm = N1();
        const shownSeq = seq.slice(0, Math.min(seq.length, 8)).join(" → ") + (seq.length > 8 ? " → ..." : "");
        return {
          q: `${nm} starts with ${x0} and repeatedly replaces the number with the sum of the squares of its digits. What is the result after ${M} applications?`,
          options, correctIndex,
          hint: `Apply the rule several times and watch for a pattern — the sequence either reaches 1 and stays there, or falls into a repeating cycle. Once you spot the cycle length, use it to find where step ${M} lands.`,
          solution: {
            scenario: `Sum-of-squares-of-digits repeated ${M} times starting from ${x0}.`,
            idea: `The sequence must eventually repeat (finitely many possible values). Either it settles at 1, or it enters a cycle. Find the cycle and use modular arithmetic to skip ahead.`,
            method: `Compute the sequence until repetition. If it reaches 1, the answer is 1 for all later steps. If it cycles, find the cycle length and compute M modulo the cycle length within the cycle.`,
            steps: [
              `Apply the rule repeatedly and watch what happens: ${shownSeq}.`,
              fixedAt1 !== -1
                ? `The sequence settles at 1 after ${fixedAt1} step${fixedAt1 === 1 ? "" : "s"} and stays there forever, so after ${M} applications the answer is 1.`
                : `The sequence falls into a repeating cycle of length ${cycleLen} starting from step ${cycleStart}, so applications beyond that point just cycle round — after ${M} applications the result is ${answer}.`,
            ],
            check: fixedAt1 !== -1
              ? `Steps ${fixedAt1}, ${fixedAt1+1}, ... all give 1 since 1² = 1. ✓`
              : `Step ${M}: within the cycle (start ${cycleStart}, length ${cycleLen}), position (${M} − ${cycleStart}) mod ${cycleLen} = ${(M - cycleStart) % cycleLen} → value ${answer}. ✓`,
          },
        };
      },
      () => {
        const N = rand(4, 9);
        const distractors = [1, 3, 4, N];
        const { options, correctIndex } = buildMC(2, distractors);
        return {
          q: `${N} coins all start showing heads. Each move, you flip exactly 2 of the coins (heads becomes tails, tails becomes heads). What is the smallest number of tails you could ever have showing, other than zero?`,
          options, correctIndex,
          hint: `Each move flips 2 coins, so the number of tails changes by −2, 0, or +2 — always an even change. Since you start with 0 tails (even), the number of tails is always even. The smallest positive even number is 2.`,
          solution: {
            scenario: `${N} coins start all heads; each move flips exactly 2. What is the minimum number of tails achievable (other than 0)?`,
            idea: `Parity invariant: every move changes the tails count by −2, 0, or +2 (always even). Starting from 0 (even), the tails count stays even forever. So an odd count is unreachable.`,
            method: `Note the parity constraint (tails count is always even). The smallest even number greater than 0 is 2, and it is achievable (flip any 2 coins from the all-heads start).`,
            steps: [
              `Flipping any 2 coins changes the number of tails by −2, 0 or +2 — it can NEVER change by an odd amount, since each move touches exactly 2 coins.`,
              `Starting from 0 tails (all heads), the number of tails showing is always EVEN, so an odd count like 1 or 3 is never possible.`,
              `The smallest number of tails other than 0 is therefore 2.`,
            ],
            check: `Flip coins 1 and 2: both become tails. Count = 2, which is even. Can we reach 0 again? Yes (flip the same two back). Is 1 ever reachable? No — it is odd, and all reachable counts are even. ✓`,
          },
        };
      },
    ];

    const bank = d <= 2 ? tier1 : tier2;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || G.repeatOp(d);
  },
customCount(d) {
    const nm=N1();
    if (d <= 2) {
      const sub = rand(0,2);
      if (sub === 0) {
      const d_skip=pick([3,5,7]);
      let count=0, n=1, last=0;
      while(count<20){ if(n%2===1&&!String(n).includes(String(d_skip))){ count++;last=n; } n++; }
      const {options,correctIndex}=buildMC(last,[last+2,last-2,last+4,last+6]);
      return {
        q:`The houses on one side of ${nm}'s street are numbered with consecutive odd numbers starting at 1, except that odd numbers containing the digit ${d_skip} are skipped. What is the number of the 20th house?`,
        options, correctIndex,
        hint: `List odd numbers in order, crossing out any that contain the digit ${d_skip}. Keep counting until you reach the 20th surviving number.`,
        solution: {
          scenario: `Finding the 20th house number on a street using odd numbers with the digit ${d_skip} skipped.`,
          idea: `Apply the two rules simultaneously: only odd numbers, and no number containing the digit ${d_skip}. List and count until the 20th qualifying number is found.`,
          method: `Go through 1, 3, 5, 7, 9, 11, 13, ... in order; skip any that contain a ${d_skip}; count the survivors.`,
          steps: [
            `List the odd numbers, remove those containing a ${d_skip}: ${[...Array(last+2)].map((_,i)=>i).filter(x=>x%2===1&&!String(x).includes(String(d_skip))).slice(0,20).join(",")}...`,
            `The 20th is ${last}.`,
          ],
          check: `Verify: count the numbers listed — there are exactly 20, and the last one is ${last}.`,
        },
      };
      }
      if (sub === 1) {
        const first=rand(1,5), gapStart=rand(2,4), gapStep=rand(1,3);
        const k=rand(8,14);
        let term=first, gap=gapStart; const terms=[first];
        for (let i=2;i<=k;i++) { term+=gap; gap+=gapStep; terms.push(term); }
        const {options,correctIndex}=buildMC(term,[term+gapStep,term-gapStep,term+gap,terms[k-2]]);
        return {
          q:`A sequence begins ${terms.slice(0,5).join(", ")}, ... where the gap between each term and the next increases by ${gapStep} every time. What is the ${k}th term?`,
          options, correctIndex,
          hint: `The differences between consecutive terms form their own arithmetic sequence: the gaps are ${gapStart}, ${gapStart+gapStep}, ${gapStart+2*gapStep}, ... Build the sequence term by term, increasing each gap by ${gapStep}.`,
          solution: {
            scenario: `A sequence where the step size itself grows by ${gapStep} each time; find the ${k}th term.`,
            idea: `The differences form an arithmetic sequence. Add each successive gap to the running total to build up the terms.`,
            method: `Start from ${first}. Add gap ${gapStart}, then ${gapStart+gapStep}, then ${gapStart+2*gapStep}, and so on up to the ${k}th term.`,
            steps: [
              `Gaps: ${Array.from({length:k-1},(_,i)=>gapStart+i*gapStep).join(", ")}.`,
              `Building up term by term: ${terms.join(", ")}.`,
              `The ${k}th term is ${term}.`,
            ],
            check: `The gap before the ${k}th term is ${gapStart + (k-2)*gapStep}. Previous term + gap = ${terms[k-2]} + ${gapStart+(k-2)*gapStep} = ${term}. ✓`,
          },
        };
      }
      const lo2=rand(10,40)*10, hi2=lo2+rand(80,150);
      let cnt2=0; const hitsP=[];
      for (let x=lo2;x<=hi2;x++){ const s=String(x); if (s===[...s].reverse().join("")) { cnt2++; hitsP.push(x); } }
      const {options,correctIndex}=buildMC(cnt2,[cnt2+1,cnt2>1?cnt2-1:cnt2+2,cnt2+2,Math.floor((hi2-lo2)/10)].filter(x=>x!==cnt2));
      return {
        q:`How many palindrome numbers (numbers that read the same forwards and backwards, like 232) are there between ${lo2} and ${hi2} inclusive?`,
        options, correctIndex,
        hint: `A palindrome reads the same forwards and backwards. For 3-digit numbers, the first and last digits must match. Systematically list them in the range.`,
        solution: {
          scenario: `Counting palindromes between ${lo2} and ${hi2}.`,
          idea: `Check each number against its own reversal. For numbers in this range, there is a pattern: the first and last digits must be equal.`,
          method: `Test each number from ${lo2} to ${hi2}: reverse its digits and check if the result is the same number.`,
          steps: [
            `Check each number in the range against its own reversal.`,
            `The palindromes are: ${hitsP.join(", ")}.`,
            `That's ${cnt2} in total.`,
          ],
          check: `Each number listed reads the same backwards. Count: ${cnt2}. ✓`,
        },
      };
    }
    const sub2 = rand(0,1);
    if (sub2 === 0) {
      const target_sum=rand(4,8),lo=rand(10,30)*10,hi=lo+rand(50,100);
      let cnt=0;
      for(let x=lo;x<=hi;x++){ if([...String(x)].reduce((a,c)=>a+Number(c),0)===target_sum) cnt++; }
      const {options,correctIndex}=buildMC(cnt,[cnt-2,cnt+2,cnt+4,Math.floor((hi-lo)/10)]);
      return {
        q:`How many integers between ${lo} and ${hi} (inclusive) have a digit sum equal to ${target_sum}?`,
        options, correctIndex,
        hint: `Go through the range systematically. For each number, add its digits and check whether the total equals ${target_sum}. Be careful not to miss any or double-count.`,
        solution: {
          scenario: `Counting integers in [${lo}, ${hi}] with digit sum = ${target_sum}.`,
          idea: `Enumerate: for each integer in the range, compute its digit sum and check. The range is small enough to count directly.`,
          method: `For each integer from ${lo} to ${hi}, add its digits; tally those that equal ${target_sum}.`,
          steps: [
            `Check each integer: sum its digits and compare to ${target_sum}.`,
            `There are ${cnt} such integers.`,
          ],
          check: `The count of ${cnt} can be verified by listing every qualifying number and confirming their digit sums.`,
        },
      };
    }
    const p=pick([2,3]), q2=pick([5,7].filter(x=>x!==p));
    const lo3=rand(1,20)*10, hi3=lo3+rand(60,120);
    let cnt3=0;
    for (let x=lo3;x<=hi3;x++){ const mp=x%p===0, mq=x%q2===0; if (mp!==mq) cnt3++; }
    const {options,correctIndex}=buildMC(cnt3,[cnt3+2,cnt3-2,cnt3+4,Math.floor((hi3-lo3)/(p*q2))].filter(x=>x!==cnt3));
    return {
      q:`How many integers between ${lo3} and ${hi3} (inclusive) are multiples of ${p} OR multiples of ${q2}, but NOT both?`,
      options, correctIndex,
      hint: `Count multiples of ${p}, count multiples of ${q2}, then subtract multiples of both (those are multiples of ${p*q2}). But here you want exactly one — so you must fully exclude all multiples of both from either group.`,
      solution: {
        scenario: `Counting integers in [${lo3}, ${hi3}] divisible by exactly one of ${p} and ${q2}.`,
        idea: `Symmetric difference: (multiples of ${p}) + (multiples of ${q2}) − 2×(multiples of ${p*q2}). The last term subtracts the shared multiples from both counts entirely.`,
        method: `Count multiples of ${p}, add multiples of ${q2}, subtract twice the multiples of ${p*q2}.`,
        steps: [
          `Count multiples of ${p}: some. Count multiples of ${q2}: some. Multiples of BOTH (i.e. of ${p*q2}) get counted in both groups, so they must be excluded entirely for an "exactly one" count.`,
          `Doing this carefully across the range gives ${cnt3} integers.`,
        ],
        check: `Verify: every number in the result is divisible by ${p} but not ${q2}, or by ${q2} but not ${p}. None should be divisible by ${p*q2}.`,
      },
    };
  },
agePuzzle(d) {
    const tier1 = [
      () => {
        const gap = rand(3, 30); const N = rand(2, 15); const youngNow = rand(4, 25);
        const futureYoung = youngNow + N; const futureOld = futureYoung + gap;
        const { options, correctIndex } = buildMC(futureOld, [futureYoung, futureOld + gap, futureOld - gap, futureYoung + N]);
        const [n1, n2] = NP();
        return {
          q: `${n1} and ${n2} are ${gap} years apart in age. In ${N} years, ${n1} (the younger) will be ${futureYoung}. How old will ${n2} be then?`,
          options, correctIndex,
          hint: `The age gap between two people never changes — it stays the same no matter how many years pass. So if one person is ${gap} years older now, they will still be ${gap} years older in the future.`,
          solution: {
            scenario: `Finding ${n2}'s age in ${N} years, given the gap and ${n1}'s future age.`,
            idea: `The age gap is an invariant: it does not change over time. Both people age at the same rate, so the gap stays fixed.`,
            method: `${n2} is always ${gap} years older than ${n1}. Add the gap directly to ${n1}'s future age.`,
            steps: [
              `The age GAP between two people never changes as time passes — only their individual ages both climb by the same amount.`,
              `${n2} is always ${gap} years older than ${n1}, so when ${n1} is ${futureYoung}, ${n2} is ${futureYoung} + ${gap} = ${futureOld}.`,
            ],
            check: `${n1} is now ${youngNow}; in ${N} years: ${futureYoung}. ${n2} is now ${youngNow + gap}; in ${N} years: ${futureOld}. Gap is still ${gap}. ✓`,
          },
        };
      },
      () => {
        const younger = rand(5, 40); const Dgap = rand(2, 20); const older = younger + Dgap; const S = younger + older;
        const [n1, n2] = NP();
        const correctStr = `${n1}: ${younger}, ${n2}: ${older}`;
        const candidates = [
          `${n1}: ${older}, ${n2}: ${younger}`,
          `${n1}: ${younger + 1}, ${n2}: ${older - 1}`,
          `${n1}: ${Math.round(S / 2)}, ${n2}: ${Math.round(S / 2)}`,
          `${n1}: ${younger - 2 > 0 ? younger - 2 : younger + 3}, ${n2}: ${older + 2}`,
          `${n1}: ${younger + 2}, ${n2}: ${older + 2}`,
          `${n1}: ${younger - 1 > 0 ? younger - 1 : younger + 4}, ${n2}: ${older + 1}`,
        ];
        const seen = new Set([correctStr]); const distractors = [];
        for (const cand of candidates) { if (!seen.has(cand)) { seen.add(cand); distractors.push(cand); } if (distractors.length === 4) break; }
        const { options, correctIndex } = buildMCStr(correctStr, distractors);
        return {
          q: `${n1} and ${n2}'s ages add up to ${S}. ${n2} is ${Dgap} years older than ${n1}. How old is each of them?`,
          options, correctIndex,
          hint: `Two equations, two unknowns. Let ${n1}'s age be x. Then ${n2}'s age is x + ${Dgap}. Their sum is ${S}. Solve for x.`,
          solution: {
            scenario: `Finding two ages given their sum (${S}) and their difference (${Dgap}).`,
            idea: `Sum and difference together fix both ages uniquely. Write an equation for the sum in terms of one unknown.`,
            method: `Let ${n1}'s age = x. Then ${n2} = x + ${Dgap}. Sum: x + (x + ${Dgap}) = ${S}. Solve for x.`,
            steps: [
              `Let ${n1}'s age be x, so ${n2}'s age is x + ${Dgap}. Their sum is x + (x + ${Dgap}) = ${S}, so 2x = ${S - Dgap}, giving x = ${younger}.`,
              `${n1} is ${younger} and ${n2} is ${younger} + ${Dgap} = ${older}. Check: ${younger} + ${older} = ${S}. ✓`,
            ],
            check: `${younger} + ${older} = ${S} ✓ and ${older} − ${younger} = ${Dgap} ✓.`,
          },
        };
      },
      () => {
        const child = rand(3, 15); const ratioNow = pick([3, 4, 5, 6]); const parent = child * ratioNow;
        const N = parent - 2 * child;
        const { options, correctIndex } = buildMC(N, [N + 2, N > 2 ? N - 2 : N + 3, parent - child, child]);
        const nm = N1();
        return {
          q: `${nm}'s parent is currently ${ratioNow} times as old as ${nm} (${nm} is ${child}, parent is ${parent}). In how many years will the parent be exactly twice ${nm}'s age?`,
          options, correctIndex,
          hint: `Let N be the years to wait. In N years, ${nm} is ${child} + N and the parent is ${parent} + N. Set up the equation: parent's future age = 2 × ${nm}'s future age.`,
          solution: {
            scenario: `Finding when a ${ratioNow}:1 age ratio shrinks to 2:1.`,
            idea: `Write an equation using both future ages. The gap stays fixed; only the ratio changes as both ages grow.`,
            method: `In N years: ${child}+N and ${parent}+N. Set ${parent}+N = 2(${child}+N) and solve.`,
            steps: [
              `Let N be the number of years. In N years, ${nm} is ${child}+N and the parent is ${parent}+N, and we need parent = 2 × ${nm}: ${parent}+N = 2(${child}+N).`,
              `${parent}+N = ${2 * child}+2N, so N = ${parent} − ${2 * child} = ${N}.`,
              `Check: in ${N} years, ${nm} is ${child + N} and the parent is ${parent + N} = 2 × ${child + N}. ✓`,
            ],
            check: `${parent + N} = 2 × ${child + N} = ${2 * (child + N)}. ✓`,
          },
        };
      },
    ];

    const tier2 = [
      () => {
        const child = rand(3, 12); const pRatio = pick([3, 4, 5]); const parent = child * pRatio;
        const gGap = rand(20, 35); const grand = parent + gGap;
        const S = child + parent + grand;
        const [n1, n2] = NP(); const n3 = pick(NAMES.filter(x => x !== n1 && x !== n2));
        const { options, correctIndex } = buildMC(grand, [parent, child, grand + gGap, grand - 10]);
        return {
          q: `${n1}, ${n2} and ${n3} are three generations of the same family. ${n2} (the parent) is ${pRatio} times as old as ${n1} (the child). ${n3} (the grandparent) is ${gGap} years older than ${n2}. Together their three ages add up to ${S}. How old is ${n3}?`,
          options, correctIndex,
          hint: `Express all three ages in terms of one unknown (${n1}'s age, call it x). Then set up an equation for their sum and solve.`,
          solution: {
            scenario: `Three generations; ages related by a ratio and a gap; total sum given.`,
            idea: `Chain all three ages through one variable. Solve the resulting linear equation.`,
            method: `Let ${n1} = x. Then ${n2} = ${pRatio}x and ${n3} = ${pRatio}x + ${gGap}. Sum = ${S}. Solve for x, then find ${n3}.`,
            steps: [
              `Let ${n1}'s age be x. Then ${n2} = ${pRatio}x, and ${n3} = ${pRatio}x + ${gGap}.`,
              `Sum: x + ${pRatio}x + (${pRatio}x + ${gGap}) = ${S}, so ${2 * pRatio + 1}x = ${S - gGap}, giving x = ${child}.`,
              `${n2} = ${pRatio}×${child} = ${parent}, and ${n3} = ${parent} + ${gGap} = ${grand}.`,
            ],
            check: `${child} + ${parent} + ${grand} = ${S}. ✓`,
          },
        };
      },
      () => {
        const child = rand(3, 10); const ratioNow = pick([4, 5, 6]); const parent = child * ratioNow;
        const ratioFuture = pick([2, 3]);
        if (ratioFuture >= ratioNow) return null;
        const Nnum = parent - ratioFuture * child, Nden = ratioFuture - 1;
        if (Nnum <= 0 || Nnum % Nden !== 0) return null;
        const N = Nnum / Nden;
        const [n1, n2] = NP();
        const { options, correctIndex } = buildMC(N, [N + 1, N > 1 ? N - 1 : N + 2, N + ratioFuture, child]);
        return {
          q: `${n1} is currently ${ratioNow} times ${n2}'s age (${n1} is ${parent}, ${n2} is ${child}). In how many years will ${n1} be only ${ratioFuture} times as old as ${n2}?`,
          options, correctIndex,
          hint: `Let N be the years to wait. Write both future ages and set the ratio equation. Rearrange to isolate N.`,
          solution: {
            scenario: `Finding when a ratio of ${ratioNow}:1 shrinks to ${ratioFuture}:1.`,
            idea: `Future ratio equation: (parent + N) = ratioFuture × (child + N). Expand and collect terms in N.`,
            method: `${parent}+N = ${ratioFuture}(${child}+N). Expand, rearrange, solve for N.`,
            steps: [
              `Let N be the number of years. In N years, ${n1} is ${parent}+N and ${n2} is ${child}+N, and we need ${n1} = ${ratioFuture} × ${n2}: ${parent}+N = ${ratioFuture}(${child}+N).`,
              `${parent}+N = ${ratioFuture * child}+${ratioFuture}N, so ${parent}−${ratioFuture * child} = ${ratioFuture}N−N = ${Nden}N, giving N = ${Nnum}÷${Nden} = ${N}.`,
              `Check: in ${N} years, ${n1} is ${parent + N} and ${n2} is ${child + N}, and ${parent + N} = ${ratioFuture} × ${child + N}. ✓`,
            ],
            check: `${parent + N} = ${ratioFuture} × ${child + N}? ${parent + N} = ${ratioFuture * (child + N)}. ✓`,
          },
        };
      },
      () => {
        const [a, b] = NP(); const c = pick(NAMES.filter(x => x !== a && x !== b)); const d2 = pick(NAMES.filter(x => x !== a && x !== b && x !== c));
        const diff = rand(2, 5);
        const x = rand(diff + 2, 20); const realSum = 4 * x - diff;
        const bad1 = realSum + 1, bad2 = realSum - 1, bad3 = realSum + 2;
        const { options, correctIndex } = buildMC(realSum, [bad1, bad2, bad3, realSum - 3]);
        return {
          q: `${a}, ${b} and ${c} are triplets. Their younger sibling ${d2} is ${diff} years younger. Which of the following could be the sum of the four siblings' ages?`,
          options, correctIndex,
          hint: `Let the triplets' shared age be x. Write the sum of all four ages in terms of x. The sum must be achievable for some positive whole number x.`,
          solution: {
            scenario: `Determining which total age sum is achievable for a set of triplets and a younger sibling.`,
            idea: `Express the total sum as a formula in x. Check which option can equal that formula for a whole number x.`,
            method: `Sum = 3x + (x − ${diff}) = 4x − ${diff}. Check each option: which equals 4x − ${diff} for some positive integer x?`,
            steps: [
              `Let the triplets' shared age be x (x > ${diff}, since ${d2} is ${diff} years younger and must have a positive age). The sum of all four ages is 3x + (x − ${diff}) = 4x − ${diff}.`,
              `${realSum} = 4×${x} − ${diff}. ✓`,
              `The other options can never be written as 4x − ${diff} for a whole number x, so they are impossible sums for this family.`,
            ],
            check: `4×${x} − ${diff} = ${realSum}. x = ${x} > ${diff}, so ${d2}'s age = ${x - diff} > 0. ✓`,
          },
        };
      },
      () => {
        const yearsAgo = rand(2, 10); const cousinNow = rand(yearsAgo + 4, 30); const cousinPast = cousinNow - yearsAgo;
        const ratioPast = pick([2, 3, 4]);
        const XPast = ratioPast * cousinPast; const XNow = XPast + yearsAgo;
        const [n1, n2] = NP();
        const { options, correctIndex } = buildMC(XNow, [XNow + yearsAgo, XNow > yearsAgo ? XNow - yearsAgo : XNow + 3, XPast, cousinNow]);
        return {
          q: `${yearsAgo} years ago, ${n1} was ${ratioPast} times as old as ${n2}. ${n2} is ${cousinNow} now. How old is ${n1} now?`,
          options, correctIndex,
          hint: `Work out ${n2}'s age at the past moment (subtract ${yearsAgo} years). Multiply by ${ratioPast} to get ${n1}'s past age. Then add ${yearsAgo} years to bring ${n1} back to the present.`,
          solution: {
            scenario: `Using a past age ratio to find a current age.`,
            idea: `Anchor the ratio to the past, find both past ages, then bring the required age forward to the present.`,
            method: `${n2}'s past age = ${cousinNow} − ${yearsAgo}. ${n1}'s past age = ${ratioPast} × that. ${n1}'s present age = past age + ${yearsAgo}.`,
            steps: [
              `${n2} is ${cousinNow} now, so ${yearsAgo} years ago ${n2} was ${cousinNow} − ${yearsAgo} = ${cousinPast}.`,
              `${n1} was ${ratioPast} times that then: ${ratioPast} × ${cousinPast} = ${XPast}.`,
              `${n1} now is ${XPast} + ${yearsAgo} = ${XNow}.`,
            ],
            check: `${yearsAgo} years ago: ${n1} = ${XPast}, ${n2} = ${cousinPast}. Ratio: ${XPast}/${cousinPast} = ${ratioPast}. ✓`,
          },
        };
      },
    ];

    const tier3 = [
      () => {
        const [n1, n2] = NP(); const n3 = pick(NAMES.filter(x => x !== n1 && x !== n2));
        const pNow = rand(4, 14);
        const qRatio = pick([2, 3, 4]); const qNow = pNow * qRatio;
        const rGap = rand(2, 15); const rOlder = pick([true, false]);
        const rNow = rOlder ? pNow + rGap : pNow - rGap;
        if (rNow <= 0) return null;
        const T = qNow + rand(3, 15);
        const yearsUntil = T - qNow;
        const rThen = rNow + yearsUntil;
        const { options, correctIndex } = buildMC(rThen, [rThen + yearsUntil, rThen - yearsUntil, T, rNow]);
        return {
          q: `${n1} is ${pNow}. ${n2} is ${qRatio} times as old as ${n1}. ${n3} is ${rGap} years ${rOlder ? "older" : "younger"} than ${n1}. How old will ${n3} be when ${n2} is ${T}?`,
          options, correctIndex,
          hint: `Find ${n2}'s current age, work out how many years until ${n2} is ${T}, then add that many years to ${n3}'s current age.`,
          solution: {
            scenario: `Chaining three people's ages; find ${n3}'s future age at a moment defined by ${n2}'s age.`,
            idea: `Calculate the time elapsed (years until ${n2} is ${T}), then add it to ${n3}'s current age.`,
            method: `${n2} now = ${qRatio} × ${pNow}. Years until ${n2} is ${T} = T − ${n2}'s current age. ${n3}'s current age ± gap. ${n3} then = current age + years elapsed.`,
            steps: [
              `${n2} is currently ${qRatio} × ${pNow} = ${qNow}.`,
              `${n2} will be ${T} in ${T} − ${qNow} = ${yearsUntil} years.`,
              `${n3} is currently ${pNow} ${rOlder ? "+" : "−"} ${rGap} = ${rNow}. In ${yearsUntil} years, ${n3} will be ${rNow} + ${yearsUntil} = ${rThen}.`,
            ],
            check: `In ${yearsUntil} years: ${n2} will be ${qNow + yearsUntil} = ${T} ✓; ${n3} will be ${rThen}. ✓`,
          },
        };
      },
      () => {
        const [n1, n2, n3, n4] = shuffle(NAMES).slice(0, 4);
        const x = rand(3, 10);
        const r2 = pick([2, 3]); const gen2 = x * r2;
        const gap3 = rand(15, 30); const gen3 = gen2 + gap3;
        const gap4 = rand(15, 30); const gen4 = gen3 + gap4;
        const S = x + gen2 + gen3 + gen4;
        const { options, correctIndex } = buildMC(x, [x + 1, x > 1 ? x - 1 : x + 2, gen2, r2]);
        return {
          q: `${n1}, ${n2}, ${n3} and ${n4} are four generations of the same family. ${n2} is ${r2} times as old as ${n1}. ${n3} is ${gap3} years older than ${n2}. ${n4} is ${gap4} years older than ${n3}. Together their four ages add up to ${S}. How old is ${n1}?`,
          options, correctIndex,
          hint: `Express all four ages in terms of x (${n1}'s age). Add them up, set equal to ${S}, and solve the linear equation for x.`,
          solution: {
            scenario: `Four-generation age chain; all ages expressed through one variable; total sum given.`,
            idea: `Each generation's age is a simple function of x. Sum all four, equate to ${S}, solve.`,
            method: `${n1}=x, ${n2}=${r2}x, ${n3}=${r2}x+${gap3}, ${n4}=${r2}x+${gap3}+${gap4}. Sum = ${S}.`,
            steps: [
              `Let ${n1}'s age be x. Then ${n2} = ${r2}x, ${n3} = ${r2}x + ${gap3}, and ${n4} = ${r2}x + ${gap3} + ${gap4}.`,
              `Sum: x + ${r2}x + (${r2}x + ${gap3}) + (${r2}x + ${gap3} + ${gap4}) = ${S}.`,
              `${3 * r2 + 1}x + ${2 * gap3 + gap4} = ${S}, so x = ${x}.`,
            ],
            check: `${x} + ${gen2} + ${gen3} + ${gen4} = ${S}. ✓`,
          },
        };
      },
      () => {
        const [n1, n2] = NP(); const n3 = pick(NAMES.filter(x => x !== n1 && x !== n2));
        const yearsAgo1 = rand(2, 8); const yearsAgo2 = rand(2, 8);
        const totalAgo = yearsAgo1 + yearsAgo2;
        const cAtEarliest = rand(3, 10);
        const ratio2 = pick([2, 3]); const bAtEarliest = cAtEarliest * ratio2;
        const bAtMiddle = bAtEarliest + yearsAgo2;
        const ratio1 = pick([2, 3]); const aAtMiddle = bAtMiddle * ratio1;
        const cNow = cAtEarliest + totalAgo; const bNow = bAtMiddle + yearsAgo1; const aNow = aAtMiddle + yearsAgo1;
        if (aAtMiddle <= 0 || bAtMiddle <= 0 || cAtEarliest <= 0) return null;
        const { options, correctIndex } = buildMC(cNow, [cNow + yearsAgo1, cNow > yearsAgo1 ? cNow - yearsAgo1 : cNow + 3, bNow, aNow]);
        return {
          q: `${yearsAgo1} years ago, ${n1} was ${ratio1} times as old as ${n2}. ${yearsAgo2} years before that, ${n2} was ${ratio2} times as old as ${n3}. How old is ${n3} now?`,
          options, correctIndex,
          hint: `Work backwards from the earlier event: ${yearsAgo2} years before the first ratio gives you ${n3}'s earliest stated age. Then bring ${n3} forward to the present by adding all elapsed years.`,
          solution: {
            scenario: `Two-step past ratio chain; find current age of the youngest person.`,
            idea: `The earlier ratio anchors ${n3}'s age at the furthest-back moment. Then advance by the total elapsed time to reach the present.`,
            method: `Find ${n3} at the earliest moment from the second ratio, then add all elapsed years.`,
            steps: [
              `${totalAgo} years ago (the earliest point in the story), ${n3} was ${cAtEarliest}.`,
              `${yearsAgo2} years later — ${yearsAgo1} years ago — ${n2} was ${ratio2} × ${cAtEarliest} = ${bAtMiddle}, and ${n1} was ${ratio1} times that: ${aAtMiddle}.`,
              `Bringing ${n3} forward from ${totalAgo} years ago to now: ${cAtEarliest} + ${totalAgo} = ${cNow}.`,
            ],
            check: `${yearsAgo1} years ago: ${n1} = ${aAtMiddle}, ${n2} = ${bAtMiddle}. Ratio = ${aAtMiddle}/${bAtMiddle} = ${ratio1}. ✓ ${totalAgo} years ago: ${n2} = ${bAtEarliest}, ${n3} = ${cAtEarliest}. Ratio = ${ratio2}. ✓`,
          },
        };
      },
    ];

    const bank = d <= 1 ? tier1 : d === 2 ? tier2 : tier3;
    let result = null, guard = 0;
    while (!result && guard < 10) { guard++; result = pick(bank)(); }
    return result || G.agePuzzle(d);
  },
estimation(d) {
    const nm = N1();
    if (d <= 1) {
      const convSub = rand(0, 1);
      if (convSub === 0) {
        const kgPerBag = pick([5, 10, 25]); const numBags = rand(3, 12);
        const totalKg = kgPerBag * numBags; const grams = totalKg * 1000;
        const { options, correctIndex } = buildMC(grams, [grams / 10, grams * 10, totalKg, grams + 1000]);
        return {
          q: `${nm} buys ${numBags} bags of sand, each weighing ${kgPerBag} kg. What is the total weight in grams?`,
          options, correctIndex,
          hint: `There are 1000 grams in every kilogram. First find the total in kilograms, then multiply by 1000 to convert to grams.`,
          solution: {
            scenario: `Converting a total weight from kilograms to grams.`,
            idea: `Unit conversion: 1 kg = 1000 g. Multiply the kilogram total by 1000.`,
            method: `Total kg = ${numBags} × ${kgPerBag} = ${totalKg}. Convert: ${totalKg} × 1000.`,
            steps: [
              `Total weight = ${numBags} × ${kgPerBag} = ${totalKg} kg.`,
              `Convert to grams: ${totalKg} × 1000 = ${grams} g.`,
            ],
            check: `${grams} ÷ 1000 = ${totalKg} kg ✓, and ${totalKg} ÷ ${kgPerBag} = ${numBags} bags ✓.`,
          },
        };
      }
      const mpg = pick([30, 40, 50]); const distMiles = rand(3, 8) * 100;
      const litresPerGallon = 4.5; const gallons = distMiles / mpg;
      const litresExact = gallons * litresPerGallon;
      const litresRounded = Math.round(litresExact / 5) * 5;
      const { options, correctIndex } = buildMC(litresRounded, [litresRounded + 5, litresRounded - 5 > 0 ? litresRounded - 5 : litresRounded + 10, Math.round(gallons * 2) * 5, distMiles / 10]);
      return {
        q: `A car travels ${distMiles} miles and does approximately ${mpg} miles per gallon. Given that 1 gallon ≈ 4.5 litres, roughly how many litres of fuel are used? Give your answer to the nearest 5 litres.`,
        options, correctIndex,
        hint: `Round first to make the arithmetic easier: find the number of gallons by dividing distance by miles-per-gallon, then multiply by 4.5 to convert gallons to litres. Round the result to the nearest 5.`,
        solution: {
          scenario: `Estimating fuel use via a chain of unit conversions.`,
          idea: `Chain the conversions: miles ÷ mpg = gallons, then gallons × 4.5 = litres. Round at the end.`,
          method: `${distMiles} ÷ ${mpg} gallons, then × 4.5 litres/gallon.`,
          steps: [
            `Gallons used: ${distMiles} ÷ ${mpg} = ${gallons.toFixed(1)}.`,
            `Litres: ${gallons.toFixed(1)} × 4.5 ≈ ${litresExact.toFixed(1)}.`,
            `To nearest 5 litres: ${litresRounded}.`,
          ],
          check: `${litresRounded} litres ÷ 4.5 ≈ ${(litresRounded / litresPerGallon).toFixed(1)} gallons × ${mpg} mpg ≈ ${Math.round(litresRounded / litresPerGallon * mpg)} miles. Plausible. ✓`,
        },
      };
    }

    if (d === 2) {
      const sub = rand(0, 1);
      if (sub === 0) {
        const peoplePerHouse = pick([2, 3, 4]); const housesPerStreet = pick([20, 30, 40]);
        const streetsPerTown = pick([50, 100, 200]); const booksPerPerson = pick([2, 3, 5]);
        const total = peoplePerHouse * housesPerStreet * streetsPerTown * booksPerPerson;
        const orderOfMag = Math.pow(10, Math.floor(Math.log10(total)));
        const best = Math.round(total / orderOfMag) * orderOfMag;
        const { options, correctIndex } = buildMC(best, [best * 10, Math.round(best / 10), best * 5, best + orderOfMag]);
        return {
          q: `Estimate the total number of library books owned by households in a town. Assume: ${peoplePerHouse} people per house, ${housesPerStreet} houses per street, ${streetsPerTown} streets, and ${booksPerPerson} books per person. Give your answer to the nearest order of magnitude.`,
          options, correctIndex,
          hint: `Fermi estimation: multiply your chain of estimates together. Don't be distracted by the exact numbers — round heavily and check whether your answer is in the right ballpark (the right power of 10).`,
          solution: {
            scenario: `Estimating the total books in a town via a Fermi chain.`,
            idea: `Fermi estimation: chain rough multiplications. Each factor contributes to the order of magnitude.`,
            method: `People = ${peoplePerHouse} × ${housesPerStreet} × ${streetsPerTown}. Books = people × ${booksPerPerson}.`,
            steps: [
              `People in town: ${peoplePerHouse} × ${housesPerStreet} × ${streetsPerTown} = ${peoplePerHouse * housesPerStreet * streetsPerTown}.`,
              `Books: ${peoplePerHouse * housesPerStreet * streetsPerTown} × ${booksPerPerson} = ${total}.`,
              `To nearest order of magnitude: ${best}.`,
            ],
            check: `Each factor is a reasonable assumption. The chain gives ${total}, which is in the right ballpark. ✓`,
          },
        };
      }
      const sqm = rand(2, 6) * 100; const plantsPerSqm = pick([4, 5, 10]);
      const massGrams = pick([50, 100, 200]); const gPerKg = 1000;
      const totalPlants = sqm * plantsPerSqm; const totalKg = (totalPlants * massGrams) / gPerKg;
      const nearest = Math.round(totalKg / 10) * 10;
      const { options, correctIndex } = buildMC(nearest, [nearest * 10, Math.round(nearest / 10) * 10, totalPlants, nearest + 10]);
      return {
        q: `A rectangular field is ${sqm} m². It is planted with ${plantsPerSqm} plants per m², each weighing about ${massGrams} g. Estimate the total mass of all the plants in kilograms.`,
        options, correctIndex,
        hint: `Find the total number of plants (area × density). Then convert each plant's mass from grams to kilograms and multiply. Keep rounding to "friendly" numbers throughout.`,
        solution: {
          scenario: `Estimating total plant mass via area, density, and unit conversion.`,
          idea: `Chain: total plants = area × density; total mass = plants × mass_per_plant (in kg).`,
          method: `Total plants: ${sqm} × ${plantsPerSqm}. Mass: plants × ${massGrams} g ÷ 1000.`,
          steps: [
            `Total plants: ${sqm} × ${plantsPerSqm} = ${totalPlants}.`,
            `Each plant is ${massGrams} g = ${massGrams / 1000} kg. Total mass: ${totalPlants} × ${massGrams / 1000} = ${totalKg} kg.`,
            `Rounded to nearest 10 kg: ${nearest} kg.`,
          ],
          check: `${nearest} kg ÷ ${plantsPerSqm} plants/m² ÷ ${sqm} m² = ${nearest / plantsPerSqm / sqm} kg/plant ≈ ${nearest / plantsPerSqm / sqm * 1000} g. Close to ${massGrams} g. ✓`,
        },
      };
    }

    if (d === 3) {
      const sub = rand(0, 1);
      if (sub === 0) {
        const W = rand(3, 9) * 10; const H = rand(3, 9) * 10;
        const dW = rand(1, 4); const dH = rand(1, 4);
        const Wmin = W - dW; const Wmax = W + dW; const Hmin = H - dH; const Hmax = H + dH;
        const Amin = Wmin * Hmin; const Amax = Wmax * Hmax; const Anominal = W * H;
        const { options, correctIndex } = buildMC(Amax - Amin, [Amax - Anominal, Anominal - Amin, 2 * dW * H + 2 * dH * W, (Amax - Amin) / 2]);
        return {
          q: `A rectangle is measured as ${W} cm wide and ${H} cm tall, each measurement rounded to the nearest ${Math.max(dW, dH)} cm. What is the difference between the largest and smallest possible areas?`,
          options, correctIndex,
          hint: `The largest area uses the largest possible width and height; the smallest area uses the smallest possible. Subtract to find the range. Remember: rounding to the nearest X means the true value lies within ±X/2 of the stated value, but here the error is given directly as ±${Math.max(dW, dH)}.`,
          solution: {
            scenario: `Bounding the area given measurement errors in width and height.`,
            idea: `The largest area is max_width × max_height; the smallest is min_width × min_height. The difference gives the full range of possible areas.`,
            method: `Amax = ${Wmax} × ${Hmax} = ${Amax}. Amin = ${Wmin} × ${Hmin} = ${Amin}. Difference = ${Amax - Amin}.`,
            steps: [
              `Largest area: (${W}+${dW}) × (${H}+${dH}) = ${Wmax} × ${Hmax} = ${Amax} cm².`,
              `Smallest area: (${W}-${dW}) × (${H}-${dH}) = ${Wmin} × ${Hmin} = ${Amin} cm².`,
              `Difference: ${Amax} − ${Amin} = ${Amax - Amin} cm².`,
            ],
            check: `${Amax} − ${Amin} = ${Amax - Amin}. ✓`,
          },
        };
      }
      const a = rand(2, 5); const b = rand(2, 5); const c = rand(2, 5);
      const exact = a * b * c; const mag = Math.floor(Math.log10(exact));
      const ans = Math.pow(10, mag);
      const { options, correctIndex } = buildMC(mag + 1, [mag, mag + 2, mag - 1, mag + 3]);
      return {
        q: `Without a calculator, what is the order of magnitude (the power of 10) of the product ${a}00 × ${b}0 × ${c}?`,
        options, correctIndex,
        hint: `The order of magnitude of a product is found by adding together the orders of magnitude of each factor. For numbers like ${a}00 = ${a} × 10², remember to include the contributions from both the leading digit AND the power-of-ten part.`,
        solution: {
          scenario: `Finding the order of magnitude of a product without computing it exactly.`,
          idea: `Multiply the leading digits together and count the combined powers of ten. Then find log₁₀ of the overall result.`,
          method: `${a}00 = ${a} × 10². ${b}0 = ${b} × 10¹. ${c} = ${c} × 10⁰. Product = (${a}×${b}×${c}) × 10^(2+1+0) = ${exact} = 10^${mag.toFixed(2)}...`,
          steps: [
            `Combine powers of ten: 10² × 10¹ × 10⁰ = 10³.`,
            `Multiply leading digits: ${a} × ${b} × ${c} = ${exact / Math.pow(10, 3)}.`,
            `Product ≈ ${exact / Math.pow(10, 3)} × 10³ = ${exact}. log₁₀(${exact}) ≈ ${(Math.log10(exact)).toFixed(2)}, so order of magnitude = ${mag + 1} (rounding to nearest whole power of 10).`,
          ],
          check: `10^${mag} = ${Math.pow(10, mag)}, 10^${mag + 1} = ${Math.pow(10, mag + 1)}. ${exact} is closer to 10^${mag + 1}. ✓`,
        },
      };
    }

    const sub = rand(0, 1);
    if (sub === 0) {
      const steps = pick([4000, 5000, 8000]); const km = steps / 1000;
      const calPerKm = pick([60, 80]); const calFromWalk = km * calPerKm;
      const calPerGram = pick([4, 5]); const grams = rand(20, 60);
      const calFood = calPerGram * grams;
      const netCal = Math.round(calFood - calFromWalk);
      const nearest10 = Math.round(netCal / 10) * 10;
      const { options, correctIndex } = buildMC(nearest10, [nearest10 + 50, nearest10 - 50, calFood, calFromWalk]);
      return {
        q: `${nm} walks ${steps} steps (estimating 1 step ≈ 1 m) and burns roughly ${calPerKm} calories per kilometre. They also eat a snack of ${grams} g containing ${calPerGram} calories per gram. Estimate the net calories (food minus burned), to the nearest 10.`,
        options, correctIndex,
        hint: `Chain the conversions: steps → km, km → calories burned, then grams → calories eaten. Subtract to find the net. Keep rounding to manageable numbers throughout.`,
        solution: {
          scenario: `Net calorie calculation via Fermi chain with multiple unit conversions.`,
          idea: `Two separate chains: walking (steps → km → calories burned) and food (grams → calories). Take the difference.`,
          method: `Burned: (${steps}÷1000) km × ${calPerKm} cal/km. Eaten: ${grams} × ${calPerGram}. Net = eaten − burned.`,
          steps: [
            `Distance: ${steps} steps × 1m/step = ${steps} m = ${km} km.`,
            `Calories burned: ${km} × ${calPerKm} = ${calFromWalk}.`,
            `Calories eaten: ${grams} × ${calPerGram} = ${calFood}.`,
            `Net: ${calFood} − ${calFromWalk} = ${netCal} ≈ ${nearest10} cal.`,
          ],
          check: `${calFood} − ${calFromWalk} = ${netCal}. Rounded to nearest 10: ${nearest10}. ✓`,
        },
      };
    }
    const W2 = rand(4, 9) * 10; const H2 = rand(4, 9) * 10;
    const dW2 = rand(2, 5); const dH2 = rand(2, 5);
    const Wmin2 = W2 - dW2; const Wmax2 = W2 + dW2; const Hmin2 = H2 - dH2; const Hmax2 = H2 + dH2;
    const Amin2 = Wmin2 * Hmin2; const Amax2 = Wmax2 * Hmax2;
    const ratio = Amax2 / Amin2;
    const ratioStr = ratio.toFixed(2);
    const ratioRounded = Math.round(ratio * 10) / 10;
    const { options, correctIndex } = buildMC(ratioRounded, [Math.round((Amax2 / (W2 * H2)) * 10) / 10, Math.round(((W2 * H2) / Amin2) * 10) / 10, Math.round((ratio * ratio) * 10) / 10, ratioRounded + 0.5]);
    return {
      q: `A field is estimated as ${W2} m by ${H2} m, but each dimension could be off by up to ${Math.max(dW2, dH2)} m. What is the ratio of the largest possible area to the smallest possible area, to 1 decimal place?`,
      options, correctIndex,
      hint: `Find the maximum area (largest width × largest height) and minimum area (smallest width × smallest height). Divide max by min and round to 1 decimal place.`,
      solution: {
        scenario: `Best-to-worst-case area ratio under measurement uncertainty.`,
        idea: `Maximum area: max dimensions. Minimum area: min dimensions. The ratio shows how far estimates can diverge.`,
        method: `Amax = ${Wmax2} × ${Hmax2} = ${Amax2}. Amin = ${Wmin2} × ${Hmin2} = ${Amin2}. Ratio = ${Amax2}/${Amin2}.`,
        steps: [
          `Largest area: ${Wmax2} × ${Hmax2} = ${Amax2} m².`,
          `Smallest area: ${Wmin2} × ${Hmin2} = ${Amin2} m².`,
          `Ratio: ${Amax2} ÷ ${Amin2} ≈ ${ratioStr} ≈ ${ratioRounded}.`,
        ],
        check: `${Amax2} ÷ ${Amin2} = ${ratioStr}. Rounded to 1 d.p.: ${ratioRounded}. ✓`,
      },
    };
  },
bouncing(d) {
    const nm = N1();
    if (d <= 2) {
      const sub = rand(0, 2);
      if (sub === 0) {
        const h0 = pick([100, 200, 250, 500]); const r = pick([2, 4, 5]);
        const nBounce = rand(3, 6);
        const hAfter = h0 / Math.pow(r, nBounce);
        const threshold = pick([1, 2, 5, 10].filter(t => t > hAfter));
        if (!threshold) return G.bouncing(d);
        let bouncesNeeded = 0, h = h0;
        while (h >= threshold) { h /= r; bouncesNeeded++; }
        const { options, correctIndex } = buildMC(bouncesNeeded, [bouncesNeeded - 1, bouncesNeeded + 1, bouncesNeeded + 2, nBounce]);
        return {
          q: `A ball is dropped from ${h0} cm and each time it bounces it reaches ${100 / r}% of its previous height (i.e., height is divided by ${r} each bounce). After how many bounces does the height first drop below ${threshold} cm?`,
          options, correctIndex,
          hint: `Divide the height by ${r} repeatedly and keep track of how many bounces have occurred. Stop as soon as the height falls below ${threshold} cm — the answer is that bounce number.`,
          solution: {
            scenario: `Counting bounces of a ball whose height shrinks by a factor of ${r} each time, until the height drops below ${threshold} cm.`,
            idea: `Each bounce multiplies the height by 1/${r}. Simulate the sequence: ${h0}, ${h0/r}, ${h0/r/r}, ... and count until the value drops below ${threshold}.`,
            method: `Divide by ${r} repeatedly: ${h0} → ${h0/r} → ... Stop when height < ${threshold}.`,
            steps: [
              `Heights after each bounce: ${Array.from({length:bouncesNeeded},(_,i)=>(h0/Math.pow(r,i+1)).toFixed(2)).join(', ')} cm.`,
              `After ${bouncesNeeded} bounce${bouncesNeeded===1?'':'s'}, the height first falls below ${threshold} cm.`,
            ],
            check: `After ${bouncesNeeded-1} bounces: ${(h0/Math.pow(r,bouncesNeeded-1)).toFixed(2)} ≥ ${threshold}. After ${bouncesNeeded}: ${(h0/Math.pow(r,bouncesNeeded)).toFixed(2)} < ${threshold}. ✓`,
          },
        };
      }
      if (sub === 1) {
        const r2 = pick([2, 3]); const n = rand(4, 8);
        const grains = Math.pow(r2, n) - 1;
        const { options, correctIndex } = buildMC(grains, [Math.pow(r2, n), grains - 1, Math.pow(r2, n) + 1, n * r2]);
        return {
          q: `One grain of rice is placed on square 1 of a board. Each subsequent square has ${r2} times as many grains as the previous square. The first ${n} squares are filled. How many grains are placed on the board in total?`,
          options, correctIndex,
          hint: `The grains form a geometric series: 1, ${r2}, ${r2*r2}, ... The sum of the first n terms of a geometric series with ratio r is (rⁿ − 1)/(r − 1). When r = ${r2}, this simplifies to rⁿ − 1.`,
          solution: {
            scenario: `Summing a geometric series (powers of ${r2}) over ${n} terms.`,
            idea: `The geometric series sum is (rⁿ − 1) / (r − 1). For r = ${r2}, this equals rⁿ − 1.`,
            method: `Sum = 1 + ${r2} + ${r2*r2} + ... (${n} terms) = ${r2}^${n} − 1 = ${grains}.`,
            steps: [
              `Squares: 1 + ${r2} + ${r2**2} + ... + ${r2**(n-1)}.`,
              `Sum of geometric series = (${r2}^${n} − 1)/(${r2}−1) = (${Math.pow(r2,n)} − 1)/${r2-1} = ${grains}.`,
            ],
            check: `Check partial sums: 1, ${1+r2}, ${1+r2+r2**2}, ... up to ${grains}. ✓`,
          },
        };
      }
      const r3 = pick([2, 3]); const step = rand(2, 4);
      const h1 = Math.pow(r3, step * 2); const h2 = Math.pow(r3, step);
      const r3given = `${h1} cm after ${step} bounces and ${h2} cm after ${step * 2} bounces`;
      const { options, correctIndex } = buildMC(h1 * r3, [h1 / r3, h1 + r3, h1 * 2, Math.round(h1 / 2)]);
      return {
        q: `A ball's height after ${step} bounces is ${h2} cm and after ${step * 2} bounces is ${Math.pow(r3, 0)} cm. What was the starting height (height before any bounces)?`,
        options, correctIndex,
        hint: `If the ball's height decreases by the same ratio each bounce, then going from bounce ${step} to bounce ${step*2} divides the height by the ratio to the power of ${step}. Work out the ratio from the two given heights, then multiply bounce-${step} height by that ratio ${step} times to go backwards to the start.`,
        solution: {
          scenario: `Finding the initial drop height given the heights at two non-consecutive bounce numbers.`,
          idea: `In ${step} bounces the height went from h_${step} to h_${step*2}. The ratio of decrease over those ${step} bounces is h_${step*2}/h_${step}. To reverse ${step} bounces, divide by that ratio.`,
          method: `Ratio^${step} = h_${step*2}/h_${step} = ${Math.pow(r3,0)}/${h2}. Per-bounce ratio = ${1/r3}. Go back ${step} bounces: h_0 = h_${step} × ${r3}^${step}.`,
          steps: [
            `From bounce ${step} to bounce ${step*2}: height goes from ${h2} to ${Math.pow(r3,0)} cm. Each bounce divides by ${r3}, so in ${step} bounces the height is divided by ${r3}^${step} = ${h2}.`,
            `Ratio per bounce = ${r3}. To go backwards from bounce ${step} height (${h2}) to the start, multiply by ${r3}^${step} = ${h2}: ${h2} × ${h2} = ${h2*h2}.`,
          ],
          check: `Start ${h2*h2}: after ${step} bounces ${h2*h2/h2} = ${h2} ✓; after ${step*2} bounces ${h2*h2/h2/h2} = 1. ✓`,
        },
      };
    }

    const sub2 = rand(0, 1);
    if (sub2 === 0) {
      const r4 = 5; const h0 = pick([100, 200, 500, 1000]);
      const hAfterN = h0 / Math.pow(r4, rand(2, 4));
      const { options, correctIndex } = buildMC(hAfterN, [hAfterN * 5, hAfterN / 5, h0 / r4, h0]);
      const wrongAnswer = `${h0 / 5} cm (first bounce height)`;
      return {
        q: `Each time a ball bounces it reaches exactly 1/5 of its previous height. Starting from ${h0} cm, it bounces ${Math.round(Math.log(hAfterN / h0) / Math.log(1 / 5))} times. After all those bounces, what height does it reach? Choose the answer that could NOT possibly be a valid height at any point in the sequence.`,
        options, correctIndex,
        hint: `Every power-of-${r4} fraction of ${h0} is a valid height in this sequence. Check each option: can it be obtained from ${h0} by dividing by ${r4} some whole number of times? A height with a factor of 5 in the numerator (not the denominator) when written over a power of ${r4} cannot be reached.`,
        solution: {
          scenario: `Heights in a sequence h₀, h₀/5, h₀/25, ... — identifying which height is impossible.`,
          idea: `Every reachable height is h₀/5^k for some non-negative integer k. Any height that cannot be expressed this way is impossible.`,
          method: `Express each option as a fraction of ${h0} and check if the denominator is a power of 5.`,
          steps: [
            `Reachable heights from ${h0}: ${h0}, ${h0}/5=${h0/5}, ${h0}/25=${h0/25}, ... These are always integers only if ${h0} is divisible by the relevant power of 5.`,
            `A factor of 5 cannot "appear" in the numerator from nowhere — only division by 5 is applied each step. So any height not of the form ${h0}/5^k is impossible.`,
            `The impossible height here is ${hAfterN}.`,
          ],
          check: `Check ${hAfterN}: ${h0} ÷ 5^k = ${hAfterN} → 5^k = ${h0 / hAfterN}. Is ${h0 / hAfterN} a power of 5? ${Number.isInteger(Math.log(h0 / hAfterN) / Math.log(5)) ? 'Yes ✓' : 'No, so this height is unreachable.'}`,
        },
      };
    }
    const r5a = rand(2, 4); const r5b = r5a + rand(1, 2);
    const h0a = Math.pow(r5a, rand(3, 5)); const h0b = h0a * rand(2, 4);
    let nOvertake = 1; let ha = h0a / r5a, hb = h0b / r5b;
    while (ha >= hb && nOvertake < 20) { nOvertake++; ha /= r5a; hb /= r5b; }
    if (nOvertake >= 20) return G.bouncing(d);
    const { options, correctIndex } = buildMC(nOvertake, [nOvertake - 1, nOvertake + 1, nOvertake + 2, Math.ceil(h0b / h0a)]);
    return {
      q: `Two balls are dropped: ball A from ${h0a} cm and ball B from ${h0b} cm. Ball A's height decreases by a factor of ${r5a} each bounce; ball B's decreases by a factor of ${r5b} each bounce. After which bounce does ball B's height FIRST drop below ball A's?`,
      options, correctIndex,
      hint: `Track both heights bounce by bounce. Ball B starts higher but shrinks faster (factor ${r5b} vs ${r5a}). Compute both heights after each bounce until B's drops below A's.`,
      solution: {
        scenario: `Two geometric sequences with different ratios; find when the faster-decreasing one overtakes the other.`,
        idea: `Ball A: h₀ₐ/r5a^n; Ball B: h₀b/r5b^n. Find the first n where Ball B < Ball A.`,
        method: `Compute both sequences and compare term by term.`,
        steps: [
          `Ball A heights: ${Array.from({length:nOvertake+1},(_,i)=>(h0a/Math.pow(r5a,i)).toFixed(1)).join(', ')}...`,
          `Ball B heights: ${Array.from({length:nOvertake+1},(_,i)=>(h0b/Math.pow(r5b,i)).toFixed(1)).join(', ')}...`,
          `After bounce ${nOvertake}, Ball B (${(h0b/Math.pow(r5b,nOvertake)).toFixed(1)} cm) first drops below Ball A (${(h0a/Math.pow(r5a,nOvertake)).toFixed(1)} cm).`,
        ],
        check: `After ${nOvertake-1} bounces: B = ${(h0b/Math.pow(r5b,nOvertake-1)).toFixed(1)} ≥ A = ${(h0a/Math.pow(r5a,nOvertake-1)).toFixed(1)}. After ${nOvertake}: B = ${(h0b/Math.pow(r5b,nOvertake)).toFixed(1)} < A = ${(h0a/Math.pow(r5a,nOvertake)).toFixed(1)}. ✓`,
      },
    };
  },
epicJourney() {
    const lv = Math.max(5, _NL || 5);
    const nm = N1();
    const r2 = (x) => Math.round(x * 100) / 100;
    const clean = (x) => Math.abs(x * 2 - Math.round(x * 2)) < 1e-9; // integer or .5
    if (lv <= 6) {
      // Multi-leg arrival time with a wait in the middle
      let startH, startM, v1, m1, d1, wait, v2, m2, d2;
      for (let t = 0; t < 200; t++) {
        startH = rand(7, 11); startM = pick([0, 5, 10, 15, 20, 25, 30, 40, 45, 50]);
        v1 = pick([3, 4, 5, 6]); m1 = pick([20, 30, 40, 45, 60]);
        d1 = v1 * m1 / 60;
        wait = rand(2, 5) * 5;
        v2 = pick([9, 10, 12, 15, 16, 18]); m2 = pick([15, 20, 30, 40]);
        d2 = v2 * m2 / 60;
        if (clean(d1) && clean(d2) && d1 >= 1 && d2 >= 2) break;
      }
      const total = m1 + wait + m2;
      const endMins = startH * 60 + startM + total;
      const fmt = (mins) => { const h = Math.floor(mins / 60) % 24, m = mins % 60; return `${h}:${String(m).padStart(2, "0")}`; };
      const wrongCandidates = [endMins - wait, endMins + 10, endMins - 5, endMins + wait, endMins - m2, endMins + m1, endMins + 61, endMins - 67, endMins + 73, endMins - 79].map(fmt);
      const wrong = [...new Set(wrongCandidates)].filter((s) => s !== fmt(endMins)).slice(0, 4);
      const { options, correctIndex } = buildMCStr(fmt(endMins), wrong);
      return {
        q: `${nm} leaves home at ${fmt(startH * 60 + startM)} and walks ${d1} km to the library at ${v1} km/h. ${nm} spends ${wait} minutes choosing a book, then cycles ${d2} km to the pool at ${v2} km/h. At what time does ${nm} arrive at the pool?`,
        options, correctIndex,
        hint: `For each leg, use time = distance ÷ speed (in the same units). Convert the results to minutes, add the waiting time, then add the total to the start time.`,
        solution: {
          scenario: `${nm} makes a two-leg journey with a wait in the middle; find the arrival time.`,
          idea: `Time = distance ÷ speed. Calculate each leg's travel time separately (in minutes), add the waiting time, and count forward from the start.`,
          method: `Walking: ${d1} ÷ ${v1} hours = ${m1} min. Wait: ${wait} min. Cycling: ${d2} ÷ ${v2} hours = ${m2} min.`,
          steps: [
            `Walking time: ${d1} km at ${v1} km/h takes ${d1}/${v1} hours = ${m1} minutes.`,
            `Cycling time: ${d2} km at ${v2} km/h takes ${d2}/${v2} hours = ${m2} minutes.`,
            `Total time = ${m1} + ${wait} + ${m2} = ${total} minutes.`,
            `${fmt(startH * 60 + startM)} plus ${total} minutes is ${fmt(endMins)}.`,
          ],
          check: `Count from ${fmt(startH * 60 + startM)}: +${m1} min walk, +${wait} min wait, +${m2} min cycle = ${fmt(endMins)}. ✓`,
        },
      };
    }
    if (lv <= 8) {
      // Average speed for a round trip (harmonic mean trap)
      let v1, v2, dist, t1, t2, avg, ok = false;
      const clean1 = (x) => Math.abs(x * 10 - Math.round(x * 10)) < 1e-9; // at most 1 dp
      for (let t = 0; t < 400 && !ok; t++) {
        v1 = rand(2, 12); v2 = v1 + rand(2, 18);
        const g = gcd(v1, v2);
        dist = v1 * v2 / g;               // whole-number times both ways
        t1 = dist / v1; t2 = dist / v2;
        avg = 2 * dist / (t1 + t2);
        ok = dist <= 90 && clean1(avg) && Math.abs(avg - (v1 + v2) / 2) > 0.4;
      }
      const { options, correctIndex } = buildMC(r2(avg), [(v1 + v2) / 2, r2(avg) + 1, r2(avg) - 1, v2 - v1].map(r2).filter(x => x > 0 && x !== r2(avg)));
      return {
        q: `${nm} hikes ${dist} km up a hill at a steady ${v1} km/h, then runs straight back down the same path at ${v2} km/h. What is ${nm}'s average speed, in km/h, for the whole round trip?`,
        options, correctIndex,
        hint: `Average speed is total distance divided by total time — NOT the average of the two speeds. Compute how long the upward and downward legs each take, add the times, and divide total distance by total time.`,
        solution: {
          scenario: `A round trip at two different speeds; find the true average speed.`,
          idea: `Average speed = total distance ÷ total time. The arithmetic mean of two speeds gives the wrong answer whenever the two legs take different amounts of time.`,
          method: `Total dist = ${2 * dist} km. Time up = ${dist}÷${v1}. Time down = ${dist}÷${v2}. Avg = ${2 * dist} ÷ (sum of times).`,
          steps: [
            `Average speed is total distance ÷ total time, not the average of the two speeds.`,
            `Time up: ${dist} ÷ ${v1} = ${r2(t1)} hours. Time down: ${dist} ÷ ${v2} = ${r2(t2)} hours.`,
            `Total distance = ${2 * dist} km. Total time = ${r2(t1)} + ${r2(t2)} = ${r2(t1 + t2)} hours.`,
            `Average speed = ${2 * dist} ÷ ${r2(t1 + t2)} = ${r2(avg)} km/h.`,
          ],
          check: `${(v1 + v2) / 2} km/h would be the arithmetic mean — wrong here because the upward leg takes longer. The correct answer ${r2(avg)} is less than the mean, as expected. ✓`,
        },
      };
    }
    // lv 9-10: catch-up problem
    let va, vb, gap, head, ans, ok2 = false;
    for (let t = 0; t < 400 && !ok2; t++) {
      va = rand(3, 7); vb = va + rand(2, 9);
      gap = pick([15, 20, 30, 40, 45, 60, 90]);
      head = va * gap / 60;
      if (!clean(head)) continue;
      ans = vb * head / (vb - va);
      ok2 = clean(ans) && ans >= 2 && ans <= 60;
    }
    const catchTimeH = head / (vb - va);
    const catchMins = Math.round(catchTimeH * 60);
    const { options, correctIndex } = buildMC(r2(ans), [ans + 1, ans - 1, ans + 2, r2(vb * gap / 60)].map(r2).filter(x => x > 0 && x !== r2(ans)));
    return {
      q: `${nm} sets off from camp walking at ${va} km/h. Exactly ${gap} minutes later, ${pick(namePool(_ND).filter(n => n !== nm))} sets off from the same camp cycling at ${vb} km/h along the same path. How far from camp, in km, does the cyclist catch the walker?`,
      options, correctIndex,
      hint: `Find the walker's head-start distance when the cyclist sets off. The cyclist closes that gap at a rate of (${vb} − ${va}) km/h. Time to catch up = head-start ÷ closing speed. Distance from camp = cyclist's speed × that time.`,
      solution: {
        scenario: `A catch-up problem: the cyclist sets off later but moves faster and eventually meets the walker.`,
        idea: `The cyclist closes the gap at (vb − va) km/h. Find the head-start, divide by the closing speed to get the catch-up time, then multiply by the cyclist's speed for the distance.`,
        method: `Head-start = ${va}×(${gap}/60) km. Closing rate = ${vb}−${va} km/h. Time = head-start ÷ closing rate. Distance = ${vb} × time.`,
        steps: [
          `In ${gap} minutes the walker covers ${va} × ${gap}/60 = ${r2(head)} km head start.`,
          `The cyclist closes the gap at ${vb} − ${va} = ${vb - va} km/h.`,
          `Time to catch up: ${r2(head)} ÷ ${vb - va} = ${r2(catchTimeH)} hours (about ${catchMins} minutes).`,
          `Distance from camp: ${vb} × ${r2(catchTimeH)} = ${r2(ans)} km.`,
        ],
        check: `At the meeting point: walker has travelled ${va}×(${gap}/60 + ${r2(catchTimeH)}) = ${r2(va*(gap/60+catchTimeH))} km; cyclist has travelled ${vb}×${r2(catchTimeH)} = ${r2(ans)} km. Equal distances ✓.`,
      },
    };
  },
moneyTrail() {
    const lv = Math.max(5, _NL || 5);
    const nm = N1();
    const FR_WORD = { "1/2": "half", "1/3": "a third", "1/4": "a quarter", "1/5": "a fifth", "2/5": "two fifths", "3/4": "three quarters" };
    if (lv <= 6) {
      // Forward chain: fraction, fraction of remainder, fixed spend
      let base, f1, f2, after1, spend2, after2, fixed, left, ok = false;
      for (let t = 0; t < 300 && !ok; t++) {
        base = rand(6, 40) * 100; // £6 - £40
        f1 = pick([[1, 2], [1, 3], [1, 4], [2, 5], [1, 5]]);
        if ((base * f1[0]) % f1[1] !== 0) continue;
        after1 = base - base * f1[0] / f1[1];
        f2 = pick([[1, 2], [1, 3], [1, 4]]);
        if ((after1 * f2[0]) % f2[1] !== 0) continue;
        spend2 = after1 * f2[0] / f2[1];
        after2 = after1 - spend2;
        const fixedOpts = [50, 100, 150, 200, 250, 300, 350, 450].filter(x => x < after2 - 40);
        if (!fixedOpts.length) continue;
        fixed = pick(fixedOpts);
        left = after2 - fixed;
        ok = left >= 50 && left % 10 === 0;
      }
      const moneyDecoyPool1 = [gbp((left + 100) / 100), gbp((left - 50) / 100), gbp(after2 / 100), gbp((left + 37) / 100), gbp((left - 43) / 100)];
      const { options, correctIndex } = buildMCStr(gbp(left / 100), [...new Set(moneyDecoyPool1)].filter((s) => s !== gbp(left / 100)).slice(0, 4));
      return {
        q: `${nm} saves up ${gbp(base / 100)}. At the fair, ${nm} spends ${FR_WORD[f1[0] + "/" + f1[1]]} of it on rides, then ${FR_WORD[f2[0] + "/" + f2[1]]} of what is left on snacks, and finally ${gbp(fixed / 100)} on a badge. How much money does ${nm} have left?`,
        options, correctIndex,
        hint: `Work through the spending step by step. After each purchase, compute the new remaining amount before moving to the next. The fraction at each step is of whatever is LEFT at that point, not of the original total.`,
        solution: {
          scenario: `${nm} spends fractions of a running total, then a fixed amount; find what remains.`,
          idea: `Each fraction is taken from the CURRENT remaining amount, not the starting total. Chain the calculations forward, step by step.`,
          method: `Start with ${gbp(base/100)}. Step 1: subtract fraction of total. Step 2: subtract fraction of remainder. Step 3: subtract fixed cost.`,
          steps: [
            `Rides: ${FR_WORD[f1[0] + "/" + f1[1]]} of ${gbp(base / 100)} is ${gbp(base * f1[0] / f1[1] / 100)}, leaving ${gbp(after1 / 100)}.`,
            `Snacks: ${FR_WORD[f2[0] + "/" + f2[1]]} of ${gbp(after1 / 100)} is ${gbp(spend2 / 100)}, leaving ${gbp(after2 / 100)}.`,
            `Badge: ${gbp(after2 / 100)} − ${gbp(fixed / 100)} = ${gbp(left / 100)}.`,
          ],
          check: `Total spent: ${gbp((base*f1[0]/f1[1] + spend2 + fixed)/100)}. Left: ${gbp(left/100)}. Sum: ${gbp((base*f1[0]/f1[1] + spend2 + fixed + left)/100)} = ${gbp(base/100)}. ✓`,
        },
      };
    }
    if (lv <= 8) {
      // Work backwards through a telescoping fraction chain
      const CHAINS = [
        { fs: [[1, 3], [1, 4], [1, 2]], remN: 1, remD: 4 },
        { fs: [[1, 2], [1, 3], [1, 4]], remN: 1, remD: 4 },
        { fs: [[1, 4], [1, 3], [1, 2]], remN: 1, remD: 4 },
        { fs: [[1, 5], [1, 4], [1, 3]], remN: 2, remD: 5 },
        { fs: [[1, 3], [1, 2], [1, 4]], remN: 1, remD: 4 },
        { fs: [[2, 5], [1, 3], [1, 2]], remN: 1, remD: 5 },
        { fs: [[1, 2], [1, 5], [1, 4]], remN: 3, remD: 10 },
      ];
      const ch = pick(CHAINS);
      const mult = rand(2, 12);
      const start = ch.remD * mult * 100;        // guarantees whole pounds
      const r = start * ch.remN / ch.remD;       // money left, integer pence
      const w = (f) => FR_WORD[f[0] + "/" + f[1]];
      const moneyDecoyPool = [gbp((start + 200) / 100), gbp((start - 200) / 100), gbp((r * 2) / 100), gbp((start + 500) / 100), gbp((start + 61) / 100), gbp((start - 67) / 100)];
      const { options, correctIndex } = buildMCStr(gbp(start / 100), [...new Set(moneyDecoyPool)].filter((s) => s !== gbp(start / 100)).slice(0, 4));
      return {
        q: `${nm} takes some money to market. ${nm} spends ${w(ch.fs[0])} of it on a kite, then ${w(ch.fs[1])} of what remains on ribbons, then ${w(ch.fs[2])} of what is then left on lemonade. ${nm} arrives home with exactly ${gbp(r / 100)}. How much did ${nm} take to market?`,
        options, correctIndex,
        hint: `Work backwards from what ${nm} arrives home with. At each step, the amount left after spending is a known fraction of what was there before — so reverse the fraction to find the earlier amount. The three fractions chain together so that the total fraction remaining is ${ch.remN}/${ch.remD} of the start.`,
        solution: {
          scenario: `A reverse-fraction problem: the end amount is known; find the starting amount.`,
          idea: `Spending a fraction of the current amount leaves the rest. Work backwards: if you have X left after spending a fraction, multiply X by the reciprocal of what remains to get the previous total.`,
          method: `After three spending steps, ${ch.remN}/${ch.remD} of the start is left. So start = ${gbp(r/100)} × ${ch.remD}/${ch.remN}.`,
          steps: [
            `Work backwards through the fractions of what REMAINS at each step.`,
            `After spending ${w(ch.fs[0])}, ${ch.fs[0][1] - ch.fs[0][0]}/${ch.fs[0][1]} remains; after ${w(ch.fs[1])} of that, and then ${w(ch.fs[2])} of that, exactly ${ch.remN}/${ch.remD} of the original is left.`,
            `So ${gbp(r / 100)} is ${ch.remN}/${ch.remD} of the starting amount.`,
            `Starting amount = ${gbp(r / 100)} × ${ch.remD}${ch.remN > 1 ? " ÷ " + ch.remN : ""} = ${gbp(start / 100)}.`,
          ],
          check: `${ch.remN}/${ch.remD} × ${gbp(start/100)} = ${gbp(r/100)}. ✓`,
        },
      };
    }
    // lv 9-10: savings fraction, discounted purchase, work backwards
    let sf, price, discPct, paid, finalLeft, beforeShop, start, ok3 = false;
    for (let t = 0; t < 400 && !ok3; t++) {
      sf = pick([[3, 8], [1, 4], [2, 5], [3, 10], [1, 3], [5, 12]]);
      price = rand(3, 15) * 200;                  // £6 - £30, even pounds
      discPct = pick([10, 20, 25, 50]);
      paid = price * (100 - discPct) / 100;
      if (paid % 10 !== 0) continue;
      finalLeft = rand(6, 44) * 50;               // £3 - £22
      beforeShop = finalLeft + paid;
      const remN = sf[1] - sf[0], remD = sf[1];
      if ((beforeShop * remD) % remN !== 0) continue;
      start = beforeShop * remD / remN;
      ok3 = start % 100 === 0 && start <= 12000;
    }
    const remN = sf[1] - sf[0], remD = sf[1];
    const moneyDecoyPool2 = [gbp((start + 400) / 100), gbp((start - 400) / 100), gbp(((finalLeft + price + start) % 2 === 0 ? start + 200 : start + 300) / 100), gbp(beforeShop / 100), gbp((start + 71) / 100), gbp((start - 73) / 100)];
    const { options, correctIndex } = buildMCStr(gbp(start / 100), [...new Set(moneyDecoyPool2)].filter((s) => s !== gbp(start / 100)).slice(0, 4));
    return {
      q: `${nm} is paid for a week of odd jobs. ${nm} puts ${sf[0]}/${sf[1]} of the money straight into savings, then buys a telescope kit priced ${gbp(price / 100)} in a ${discPct}%-off sale, and is left with ${gbp(finalLeft / 100)}. How much was ${nm} paid?`,
      options, correctIndex,
      hint: `Work backwards: add the discounted price back to the final amount to find what ${nm} had before the purchase. That amount is the ${remN}/${remD} of the original pay that wasn't saved. Multiply up to find the full pay.`,
      solution: {
        scenario: `Two steps to reverse: a discounted purchase and a savings fraction. Work backwards to the original pay.`,
        idea: `Undo the purchase first (add back the sale price), then undo the savings fraction (multiply by the reciprocal of the remaining fraction) to reach the original pay.`,
        method: `Sale price = ${gbp(price/100)} − ${discPct}% = ${gbp(paid/100)}. Before purchase: ${gbp(finalLeft/100)} + ${gbp(paid/100)} = ${gbp(beforeShop/100)}. That is ${remN}/${remD} of pay.`,
        steps: [
          `The kit cost ${gbp(price / 100)} − ${discPct}% = ${gbp(paid / 100)}.`,
          `Before buying it, ${nm} had ${gbp(finalLeft / 100)} + ${gbp(paid / 100)} = ${gbp(beforeShop / 100)}.`,
          `That was after saving ${sf[0]}/${sf[1]}, so it is ${remN}/${remD} of the pay.`,
          `Pay = ${gbp(beforeShop / 100)} × ${remD}/${remN} = ${gbp(start / 100)}.`,
        ],
        check: `${sf[0]}/${sf[1]} of ${gbp(start/100)} = ${gbp(start*sf[0]/sf[1]/100)} saved. Remaining: ${gbp(beforeShop/100)}. After kit: ${gbp(finalLeft/100)}. ✓`,
      },
    };
  },
  digitDetective() {
    const lv = Math.max(5, _NL || 5);
    const nm = N1();
    if (lv <= 6) {
      // One time in five, reach for the folded-in date-digit-sum scenario instead of the
      // reversal puzzle below, so it's a real part of the rotation, not just a rare fallback.
      if (rand(1,5) === 1) return dateDigitScenario();
      // Unique 2-digit number from digit-sum + reversal clue
      for (let tries = 0; tries < 80; tries++) {
        const n = rand(13, 98);
        const t = Math.floor(n / 10), u = n % 10;
        if (t === u) continue;
        const rev = u * 10 + t;
        const diff = Math.abs(n - rev);
        const dsum = t + u;
        let sols = [];
        for (let m = 10; m <= 99; m++) {
          const mt = Math.floor(m / 10), mu = m % 10;
          if (mt + mu === dsum && mt > mu && Math.abs(m - (mu * 10 + mt)) === diff) sols.push(m);
        }
        if (t > u && sols.length === 1) {
          const { options, correctIndex } = buildMC(n, [rev, n + 9, n - 9, n + 1]);
          return {
            q: `${nm} is hunting a two-digit number. Its digits add up to ${dsum}. When its digits are reversed, the number goes down by exactly ${diff}. What is ${nm}'s number?`,
            options, correctIndex,
            solution: [
              `Reversing digits changes a number by 9 × (difference between its digits). So the digits differ by ${diff / 9}.`,
              `Two digits that add to ${dsum} and differ by ${diff / 9}: ${t} and ${u}.`,
              `The number goes DOWN when reversed, so the bigger digit ${t} is in the tens place: ${n}.`,
            ],
          };
        }
      }
      return dateDigitScenario();
    }
    if (lv <= 8) {
      // Count 3-digit numbers with a divisibility + digit condition
      const div = pick([6, 7, 8, 9, 11, 12, 13, 14, 15, 18]);
      const condPick = pick(["increasing", "allEven", "allOdd", "decreasing"]);
      const condFn = condPick === "increasing"
        ? (a, b, c) => a < b && b < c
        : condPick === "decreasing" ? (a, b, c) => a > b && b > c
        : condPick === "allEven" ? (a, b, c) => a % 2 === 0 && b % 2 === 0 && c % 2 === 0
        : (a, b, c) => a % 2 === 1 && b % 2 === 1 && c % 2 === 1;
      const condText = condPick === "increasing" ? "digits that strictly increase from left to right"
        : condPick === "decreasing" ? "digits that strictly decrease from left to right"
        : condPick === "allEven" ? "all three digits even" : "all three digits odd";
      let count = 0;
      for (let m = 100; m <= 999; m++) {
        if (m % div !== 0) continue;
        const a = Math.floor(m / 100), b = Math.floor(m / 10) % 10, c = m % 10;
        if (condFn(a, b, c)) count++;
      }
      if (count < 2 || count > 40) return G.digitDetective();
      const { options, correctIndex } = buildMC(count, [count + 1, count - 1, count + 2, count + 5]);
      return {
        q: `${nm} lines up every three-digit multiple of ${div} and keeps only those with ${condText}. How many numbers does ${nm} keep?`,
        options, correctIndex,
        solution: [
          `Multiples of ${div} between 100 and 999: start at ${Math.ceil(100 / div) * div}, end at ${Math.floor(999 / div) * div}.`,
          `Check each against the digit condition (${condText}).`,
          `Careful counting gives ${count}.`,
        ],
      };
    }
    // lv 9-10: digit product puzzles (largest / smallest / how many)
    const TARGETS = [18, 24, 28, 30, 32, 36, 40, 42, 45, 48, 54, 56, 60, 63, 64, 70, 72, 80, 84, 90, 96, 105, 108, 120, 126, 144, 162, 168, 180, 192, 210, 216];
    let target, hits;
    for (let t = 0; t < 60; t++) {
      target = pick(TARGETS);
      hits = [];
      for (let m = 100; m <= 999; m++) {
        const a = Math.floor(m / 100), b = Math.floor(m / 10) % 10, c = m % 10;
        if (a * b * c === target) hits.push(m);
      }
      if (hits.length >= 3) break;
    }
    const count = hits.length;
    const largest = hits[hits.length - 1];
    const smallest = hits[0];
    const ask = pick(["largest", "smallest", "count"]);
    if (ask === "largest") {
      const { options, correctIndex } = buildMC(largest, [largest - 9, largest - 90, hits.length > 1 ? hits[hits.length - 2] : 999, largest + 9].filter(x => x !== largest && x >= 100 && x <= 999));
      return {
        q: `${nm} wants the LARGEST three-digit number whose digits multiply to give exactly ${target}. What is it?`,
        options, correctIndex,
        solution: [
          `Make the hundreds digit as large as possible first, then the tens digit.`,
          `Split ${target} into three digits from 1-9, keeping the biggest digit at the front.`,
          `Working down systematically, the largest is ${largest} (check: ${Math.floor(largest / 100)}×${Math.floor(largest / 10) % 10}×${largest % 10} = ${target}).`,
        ],
      };
    }
    if (ask === "smallest") {
      const { options, correctIndex } = buildMC(smallest, [smallest + 9, smallest + 90, hits.length > 1 ? hits[1] : 100, smallest - 9].filter(x => x !== smallest && x >= 100 && x <= 999));
      return {
        q: `${nm} wants the SMALLEST three-digit number whose digits multiply to give exactly ${target}. What is it?`,
        options, correctIndex,
        solution: [
          `Make the hundreds digit as small as possible first, then the tens digit.`,
          `Split ${target} into three digits from 1-9, keeping the smallest digit at the front.`,
          `Working up systematically, the smallest is ${smallest} (check: ${Math.floor(smallest / 100)}×${Math.floor(smallest / 10) % 10}×${smallest % 10} = ${target}).`,
        ],
      };
    }
    const { options, correctIndex } = buildMC(count, [count + 1, count - 1, count + 3, count - 3].filter(x => x > 0));
    return {
      q: `${nm} is collecting every three-digit number whose digits multiply to exactly ${target}. How many are there for ${nm} to find?`,
      options, correctIndex,
      solution: [
        `First find the sets of three digits (1-9) whose product is ${target}.`,
        `Each set of three DIFFERENT digits can be arranged 6 ways; a set with a repeated digit only 3 ways.`,
        `Adding the arrangements over all digit sets gives ${count}.`,
      ],
    };
  },

numberMachine() {
    const lv = Math.max(5, _NL || 5);
    const nm = N1();
    if (lv <= 6) {
      // Two machines chained; invert to find the input
      const a = rand(3, 9), b = rand(4, 25);
      const input = rand(3, 19);
      const output = input * a + b;
      const { options, correctIndex } = buildMC(input, [input + 1, input - 1, output - b, Math.round((output + b) / a)].filter(x => x !== input && x > 0));
      return {
        q: `${nm} feeds a number into a chain of two machines. The first machine multiplies by ${a}; the second adds ${b}. The final output is ${output}. What number did ${nm} feed in?`,
        options, correctIndex,
        hint: `Work backwards through the machines, undoing each step in reverse order. The last machine added ${b}, so undo it by subtracting ${b}. Then undo the first machine by dividing by ${a}.`,
        solution: {
          scenario: `A two-machine chain (×${a}, then +${b}) produces output ${output}; find the input.`,
          idea: `Reverse the chain by undoing the last operation first, then the first. Add the inverse of each step in reverse order.`,
          method: `Undo +${b}: output − ${b}. Undo ×${a}: result ÷ ${a}.`,
          steps: [
            `Work backwards through the machines, undoing each step.`,
            `Undo the second machine: ${output} − ${b} = ${output - b}.`,
            `Undo the first machine: ${output - b} ÷ ${a} = ${input}.`,
          ],
          check: `Forward check: ${input} × ${a} = ${input * a}; ${input * a} + ${b} = ${output}. ✓`,
        },
      };
    }
    if (lv <= 8) {
      // Deduce the rule ×a + b from two input/output pairs, apply to a third input
      const a = rand(2, 9), b = rand(-12, 20);
      const x1 = rand(2, 9), x2 = x1 + rand(2, 7);
      const y1 = a * x1 + b, y2 = a * x2 + b;
      const x3 = x2 + rand(2, 8);
      const y3 = a * x3 + b;
      if (b === 0) return G.numberMachine();
      const { options, correctIndex } = buildMC(y3, [y3 + a, y3 - a, a * x3, y3 + 1].filter(x => x !== y3));
      return {
        q: `A mystery machine uses the rule "multiply by something, then add something" (the same two numbers every time). ${nm} tests it: putting in ${x1} gives ${y1}, and putting in ${x2} gives ${y2}. What will the machine give for ${x3}?`,
        options, correctIndex,
        hint: `Find the multiplier first: the output increases by the multiplier for every 1 increase in the input. Measure the change from input ${x1} to input ${x2}. Once you know the multiplier, back-calculate the constant added.`,
        solution: {
          scenario: `Deduce the rule of a linear machine from two input/output pairs, then apply it to a third input.`,
          idea: `The machine applies y = a×x + b. The multiplier a can be read off from how much the output changes per unit change in input.`,
          method: `Δy/Δx = (${y2}−${y1})/(${x2}−${x1}) gives a. Then b = y1 − a×x1. Finally compute a×${x3}+b.`,
          steps: [
            `Going from input ${x1} to ${x2} (up by ${x2 - x1}) raised the output by ${y2 - y1}, so each step of 1 adds ${a}: the multiplier is ${a}.`,
            `Then ${a} × ${x1} = ${a * x1}, and the output was ${y1}, so the machine adds ${b >= 0 ? b : "−" + (-b)}.`,
            `For ${x3}: ${a} × ${x3} ${b >= 0 ? "+ " + b : "− " + (-b)} = ${y3}.`,
          ],
          check: `Verify with given pairs: ${a}×${x1}${b >= 0 ? "+" : ""}${b} = ${y1} ✓ and ${a}×${x2}${b >= 0 ? "+" : ""}${b} = ${y2} ✓.`,
        },
      };
    }
    // lv 9-10: repeated application, inverted
    const a2 = pick([2, 3, 4]), s = rand(1, 9);
    const times = pick([2, 3, 3]);
    let val = rand(2, 19);
    let seqF = [val];
    for (let i = 0; i < times; i++) { val = val * a2 - s; seqF.push(val); }
    const finalV = val, startV = seqF[0];
    if (finalV > 900 || finalV <= 0) return G.numberMachine();
    const passWord = times === 2 ? "two passes" : "three passes";
    const feedsText = times === 2 ? `${nm} feeds a number in, then feeds the result back in — ${passWord} in total.` : `${nm} feeds a number in, then feeds the result back in, then feeds THAT result back in — ${passWord} in total.`;
    const undoSteps = [];
    for (let i = times; i >= 1; i--) undoSteps.push(`Pass ${i} undone: (${seqF[i]} + ${s}) ÷ ${a2} = ${seqF[i - 1]}.`);
    const { options, correctIndex } = buildMC(startV, [startV + 1, startV - 1, startV + 2, seqF[1]].filter(x => x !== startV && x > 0));
    return {
      q: `A machine takes a number, multiplies it by ${a2} and then subtracts ${s}. ${feedsText} The final answer is ${finalV}. What number did ${nm} start with?`,
      options, correctIndex,
      hint: `Undo the machine one pass at a time, working from the final answer backwards. To reverse one pass: add ${s} (to undo the subtraction), then divide by ${a2} (to undo the multiplication). Repeat this ${times} time${times > 1 ? 's' : ''}.`,
      solution: {
        scenario: `A machine applied ${times} times produces ${finalV}; work backwards to find the starting number.`,
        idea: `Undo each application in reverse. One pass forwards is ×${a2} then −${s}; one undo is +${s} then ÷${a2}.`,
        method: `Undo ${times} time${times > 1 ? 's' : ''}: each time do (value + ${s}) ÷ ${a2}.`,
        steps: [
          `Undo the machine ${times === 2 ? "twice" : "three times"}. Undoing one pass means: add ${s}, then divide by ${a2}.`,
          ...undoSteps,
        ],
        check: `Forward check: ${startV}${Array.from({length:times},(_,i) => ` → ${seqF[i+1]}`).join('')}. Final = ${finalV}. ✓`,
      },
    };
  },
pythagQuest() {
    const lv = Math.max(5, _NL || 5);
    const nm = N1();
    const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [6, 8, 10], [9, 12, 15], [10, 24, 26], [12, 16, 20], [15, 20, 25], [16, 30, 34], [18, 24, 30], [21, 28, 35]];
    if (lv <= 6) {
      // One-step Pythagoras in context: hypotenuse or a leg
      const [a, b, c] = pick(TRIPLES);
      const wantHyp = Math.random() < 0.5;
      const ctx = pick(["ladder", "walk", "rect"]);
      if (wantHyp) {
        const { options, correctIndex } = buildMC(c, [a + b, c + 1, c - 1, c + 2]);
        const q = ctx === "ladder"
          ? `A ${a} m pole stands upright, and a support wire runs from its top to a peg ${b} m from its base along flat ground. How long, in metres, is the wire?`
          : ctx === "walk"
            ? `${nm} walks ${a} km due east and then ${b} km due north. How far, in km, is ${nm} from the start in a straight line?`
            : `A rectangle measures ${a} cm by ${b} cm. How long, in cm, is its diagonal?`;
        return { q, options, correctIndex,
          hint: `Draw a right-angled triangle. The two lengths given are the two shorter sides (the legs). Use Pythagoras' theorem: the square of the hypotenuse equals the sum of the squares of the two legs. Square both given lengths, add them, then take the square root.`,
          solution: {
            scenario: `Find the hypotenuse of a right-angled triangle with legs ${a} and ${b}.`,
            idea: `Pythagoras' theorem: c² = a² + b². Square both legs, add them, take the square root.`,
            method: `c² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c}. c = √${c*c}.`,
            steps: [
              `This is a right-angled triangle: the two given lengths are the shorter sides (legs).`,
              `Pythagoras: c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}.`,
              `c = √${c * c} = ${c}.`,
            ],
            check: `${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c} = ${c}². ✓`,
          },
        };
      }
      const { options, correctIndex } = buildMC(a, [c - b, a + 1, a - 1, b]);
      const q = ctx === "ladder"
        ? `A ladder ${c} m long leans against a wall, with its foot ${b} m from the base of the wall. How far up the wall, in metres, does the ladder reach?`
        : ctx === "walk"
          ? `${nm} is ${c} km from camp in a straight line, having walked due east then ${b} km due north. How many km east did ${nm} walk?`
          : `A rectangle has a diagonal of ${c} cm and one side of ${b} cm. How long, in cm, is the other side?`;
      return { q, options, correctIndex,
        hint: `The longest side (${c}) is the hypotenuse — the side opposite the right angle. To find a shorter side, rearrange Pythagoras: a² = c² − b². Subtract the square of the known side from the square of the hypotenuse, then take the square root.`,
        solution: {
          scenario: `Find a leg of a right-angled triangle given the hypotenuse (${c}) and the other leg (${b}).`,
          idea: `Rearrange Pythagoras: a² = c² − b². Subtract the known leg-squared from the hypotenuse-squared.`,
          method: `a² = ${c}² − ${b}² = ${c*c} − ${b*b} = ${a*a}. a = √${a*a}.`,
          steps: [
            `The ${c} is the hypotenuse (opposite the right angle), so this time we SUBTRACT.`,
            `a² = ${c}² − ${b}² = ${c * c} − ${b * b} = ${a * a}.`,
            `a = √${a * a} = ${a}.`,
          ],
          check: `${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c} = ${c}². ✓`,
        },
      };
    }
    if (lv <= 8) {
      // Two-step problems
      const kind = pick(["iso", "perim", "coord"]);
      if (kind === "iso") {
        const [ha, hb, sc] = pick(TRIPLES.filter(t => t[2] <= 41));
        const base = 2 * ha, area = ha * hb;
        const { options, correctIndex } = buildMC(area, [area * 2, ha * sc, base * sc, area + 10]);
        return {
          q: `An isosceles triangle has two sides of length ${sc} cm and a base of ${base} cm. What is its area, in cm²?`,
          options, correctIndex,
          hint: `Drop a perpendicular from the top vertex to the midpoint of the base — it bisects the base and creates two right-angled triangles. Use Pythagoras to find the height (with half the base and the equal side), then use area = ½ × base × height.`,
          solution: {
            scenario: `Find the area of an isosceles triangle using Pythagoras to find its height.`,
            idea: `The altitude bisects the base, creating a right triangle with hypotenuse = equal side, base = half the base. Pythagoras gives the height; then ½×base×height gives the area.`,
            method: `Height² = ${sc}² − ${ha}². Area = ½ × ${base} × height.`,
            steps: [
              `Drop a line from the top vertex to the middle of the base: it splits the triangle into two right-angled triangles, each with base ${ha} cm and hypotenuse ${sc} cm.`,
              `Height² = ${sc}² − ${ha}² = ${sc * sc} − ${ha * ha} = ${hb * hb}, so the height is ${hb} cm.`,
              `Area = ½ × base × height = ½ × ${base} × ${hb} = ${area} cm².`,
            ],
            check: `${hb}² + ${ha}² = ${hb*hb+ha*ha} = ${sc*sc} = ${sc}². Height correct. ½×${base}×${hb} = ${area}. ✓`,
          },
        };
      }
      if (kind === "perim") {
        const [a, b, c] = pick(TRIPLES);
        const perim = a + b + c;
        const { options, correctIndex } = buildMC(perim, [a + b, perim + 2, perim - 2, a + c]);
        return {
          q: `A right-angled triangle has shorter sides of ${a} cm and ${b} cm. What is its perimeter, in cm?`,
          options, correctIndex,
          hint: `First find the hypotenuse using Pythagoras (c² = ${a}² + ${b}²), then add all three sides to find the perimeter.`,
          solution: {
            scenario: `Find the perimeter of a right triangle by finding the hypotenuse first.`,
            idea: `Two steps: Pythagoras gives the missing side; then add all three sides.`,
            method: `c = √(${a}²+${b}²) = ${c}. Perimeter = ${a}+${b}+${c}.`,
            steps: [
              `First find the hypotenuse: c² = ${a}² + ${b}² = ${a * a + b * b}, so c = ${c} cm.`,
              `Then add all three sides: ${a} + ${b} + ${c} = ${perim} cm.`,
              `Two steps: Pythagoras first, THEN the perimeter.`,
            ],
            check: `${a}² + ${b}² = ${a*a+b*b} = ${c}² ✓. Perimeter = ${perim}. ✓`,
          },
        };
      }
      const [dx, dy, dist] = pick(TRIPLES.filter(t => t[2] <= 29));
      const x1 = rand(0, 6), y1 = rand(0, 6);
      const { options, correctIndex } = buildMC(dist, [dx + dy, dist + 1, dist - 1, dist + 2]);
      return {
        q: `On a centimetre grid, ${nm} plots the points (${x1}, ${y1}) and (${x1 + dx}, ${y1 + dy}). How far apart are the two points, in cm?`,
        options, correctIndex,
        hint: `Draw the right-angled triangle with the two points as opposite corners. The horizontal and vertical gaps form the two legs (${dx} and ${dy}). Apply Pythagoras to find the straight-line distance.`,
        solution: {
          scenario: `Find the distance between two grid points using Pythagoras.`,
          idea: `The horizontal and vertical separations are the legs of a right triangle; the straight-line distance is the hypotenuse.`,
          method: `distance² = ${dx}² + ${dy}² = ${dx*dx+dy*dy}. distance = √${dist*dist}.`,
          steps: [
            `The points differ by ${dx} across and ${dy} up — draw the right-angled triangle they make.`,
            `Distance² = ${dx}² + ${dy}² = ${dx * dx} + ${dy * dy} = ${dist * dist}.`,
            `Distance = √${dist * dist} = ${dist} cm.`,
          ],
          check: `${dx}² + ${dy}² = ${dx*dx+dy*dy} = ${dist}². ✓`,
        },
      };
    }
    // lv 9-10: Intermediate Maths Challenge standard
    const kind2 = pick(["cuboid", "wires", "disguise"]);
    if (kind2 === "cuboid") {
      const BOXES = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 5, 14, 15], [2, 10, 11, 15], [8, 9, 12, 17], [1, 12, 12, 17], [6, 10, 15, 19], [4, 13, 16, 21]];
      const [a, b, c, d] = pick(BOXES);
      const fd = Math.round(Math.sqrt(a * a + b * b) * 100) / 100;
      const { options, correctIndex } = buildMC(d, [a + b + c, d + 1, d - 1, d + 2]);
      return {
        q: `A wasp flies in a dead-straight line from one corner of a ${a} m × ${b} m × ${c} m room to the corner diagonally opposite (across the whole room, floor to ceiling). How far does it fly, in metres?`,
        options, correctIndex,
        hint: `Use Pythagoras twice. First find the diagonal across the floor (using width and length). Then treat that floor diagonal and the room height as the two legs of a second right triangle, with the flight path as the hypotenuse.`,
        solution: {
          scenario: `Space diagonal of a cuboid — Pythagoras applied twice.`,
          idea: `The formula for a space diagonal is d² = a² + b² + c². This comes from two applications of Pythagoras: floor diagonal first, then height.`,
          method: `Floor diag² = ${a}²+${b}² = ${a*a+b*b}. Space diag² = floor diag² + ${c}² = ${a*a+b*b+c*c}.`,
          steps: [
            `Use Pythagoras TWICE. First, the diagonal across the floor: f² = ${a}² + ${b}² = ${a * a + b * b}.`,
            `That floor diagonal and the room's height ${c} make another right-angled triangle with the flight path as its hypotenuse.`,
            `d² = f² + ${c}² = ${a * a + b * b} + ${c * c} = ${d * d}.`,
            `d = √${d * d} = ${d} m. (In one line: d² = ${a}² + ${b}² + ${c}².)`,
          ],
          check: `${a}²+${b}²+${c}² = ${a*a+b*b+c*c} = ${d}². ✓`,
        },
      };
    }
    if (kind2 === "wires") {
      const SHARED = { 12: [[5, 13], [9, 15], [16, 20], [35, 37]], 15: [[8, 17], [20, 25], [36, 39]], 20: [[15, 25], [21, 29], [48, 52]], 24: [[7, 25], [10, 26], [18, 30], [32, 40], [45, 51]] };
      const h = pick([12, 15, 20, 24]);
      const pairPool = SHARED[h];
      const two = shuffle([...pairPool]).slice(0, 2);
      const [a1, c1] = two[0], [a2, c2] = two[1];
      const total = a1 + a2;
      const { options, correctIndex } = buildMC(total, [c1 + c2, total + 2, total - 2, Math.abs(a1 - a2)].filter(x => x > 0 && x !== total));
      return {
        q: `A vertical mast is held by two straight wires on opposite sides, both anchored to level ground. One wire is ${c1} m long, the other ${c2} m long, and both are attached to the very top of the mast, which is ${h} m tall. How far apart, in metres, are the two ground anchors?`,
        options, correctIndex,
        hint: `Each wire forms the hypotenuse of a right triangle with the mast (height ${h} m) and the ground. Use Pythagoras to find the ground distance for each wire separately, then add the two distances (they are on opposite sides of the mast).`,
        solution: {
          scenario: `Find the separation of two anchor points via two independent Pythagoras calculations.`,
          idea: `Each wire makes a right triangle with the mast as one leg and the ground distance as the other. Add the two ground distances since the anchors are on opposite sides.`,
          method: `Anchor 1: √(${c1}²−${h}²) = ${a1}. Anchor 2: √(${c2}²−${h}²) = ${a2}. Separation = ${a1}+${a2}.`,
          steps: [
            `Each wire makes a right-angled triangle with the mast (height ${h} m) and the ground.`,
            `First anchor: distance² = ${c1}² − ${h}² = ${c1 * c1} − ${h * h} = ${a1 * a1}, so ${a1} m from the mast.`,
            `Second anchor: distance² = ${c2}² − ${h}² = ${c2 * c2} − ${h * h} = ${a2 * a2}, so ${a2} m from the mast.`,
            `They are on OPPOSITE sides, so the anchors are ${a1} + ${a2} = ${total} m apart.`,
          ],
          check: `${a1}²+${h}² = ${a1*a1+h*h} = ${c1}² ✓. ${a2}²+${h}² = ${a2*a2+h*h} = ${c2}² ✓. Separation = ${total}. ✓`,
        },
      };
    }
    const [a3, b3, c3] = pick(TRIPLES.filter(t => t[2] - t[1] <= 9 && t[0] < t[1]));
    const diff = c3 - b3;
    const perim3 = a3 + b3 + c3;
    const { options, correctIndex } = buildMC(perim3, [a3 + b3 + b3, perim3 + 2, perim3 - 2, a3 * 2 + diff].filter(x => x > 0 && x !== perim3));
    return {
      q: `In a right-angled triangle, the shortest side is ${a3} cm and the hypotenuse is exactly ${diff} cm longer than the remaining side. What is the perimeter of the triangle, in cm?`,
      options, correctIndex,
      hint: `Let the unknown side be b. Then the hypotenuse is b + ${diff}. Substitute into Pythagoras: ${a3}² + b² = (b + ${diff})². Expand the right side and notice that the b² terms cancel — this simplifies to a linear equation.`,
      solution: {
        scenario: `Pythagorean "disguise" problem: b² cancels after expanding, leaving a linear equation.`,
        idea: `(b + ${diff})² = b² + ${2*diff}b + ${diff*diff}. The b² on each side cancels, giving a linear equation for b.`,
        method: `${a3}² + b² = (b+${diff})². Expand, cancel b², solve. Then add all three sides.`,
        steps: [
          `Call the unknown side b, so the hypotenuse is b + ${diff}.`,
          `Pythagoras: ${a3}² + b² = (b + ${diff})². Expand the right side: b² + ${2 * diff}b + ${diff * diff}.`,
          `The b² terms cancel: ${a3 * a3} = ${2 * diff}b + ${diff * diff}, so b = ${b3}.`,
          `Sides are ${a3}, ${b3} and ${c3}; perimeter = ${perim3} cm. The b² cancellation is the Challenge-paper trick worth remembering.`,
        ],
        check: `${a3}² + ${b3}² = ${a3*a3+b3*b3} = ${c3}² ✓. ${a3}+${b3}+${c3} = ${perim3}. ✓`,
      },
    };
  },
coordGeom(d) {
    const CX = 130, CY = 120, PX = 14;
    const toPx = (x, y) => [CX + x * PX, CY - y * PX];
    const axes = () => SL(10, CY, 250, CY, "#c9bff0", 1.5) + SL(CX, 10, CX, 230, "#c9bff0", 1.5);
    const dot = (x, y, col = "#7c5cff") => { const [px, py] = toPx(x, y); return SC(px, py, 4, col, 2, col); };
    const lbl = (x, y, text, dx = 8, dy = -8, sz = 13) => { const [px, py] = toPx(x, y); return ST(px + dx, py + dy, text, "start", sz, "#2a1a5e", 700); };
    const seg = (x1, y1, x2, y2, col = "#2a1a5e", sw = 2) => { const [ax, ay] = toPx(x1, y1); const [bx, by] = toPx(x2, y2); return SL(ax, ay, bx, by, col, sw); };
    const fmtPt = (x, y) => `(${x}, ${y})`;
    const quadrantOf = (x, y) => (x > 0 && y > 0) ? "Quadrant I" : (x < 0 && y > 0) ? "Quadrant II" : (x < 0 && y < 0) ? "Quadrant III" : (x > 0 && y < 0) ? "Quadrant IV" : "On an axis";

    if (d <= 1) {
      const sub = rand(0, 3);
      if (sub === 0) {
        const x1 = rand(-4, 4), y1 = rand(-4, 4), x2 = rand(-4, 4), y2 = rand(-4, 4);
        if (x1 === x2 && y1 === y2) return G.coordGeom(d);
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        if (mx !== Math.round(mx) || my !== Math.round(my)) return G.coordGeom(d);
        const { options, correctIndex } = buildMCStr(fmtPt(mx, my), [fmtPt(mx + 1, my), fmtPt(mx, my + 1), fmtPt(mx - 1, my + 1), fmtPt(x1, y2), fmtPt(x2, y1)].filter(s=>s!==fmtPt(mx,my)));
        const svg = `<svg viewBox="0 0 260 240" xmlns="http://www.w3.org/2000/svg">${axes()}${seg(x1,y1,x2,y2,"#7c5cff",1.5)}${dot(x1,y1)}${lbl(x1,y1,"A",-14,4)}${dot(x2,y2)}${lbl(x2,y2,"B")}${dot(mx,my,"#f90")}${lbl(mx,my,"M")}</svg>`;
        return {
          q: `${svg}What are the coordinates of the midpoint M of the line segment from A = ${fmtPt(x1, y1)} to B = ${fmtPt(x2, y2)}?`,
          options, correctIndex,
          hint: `The midpoint is the average of the two x-coordinates and the average of the two y-coordinates. Add each pair and divide by 2.`,
          solution: {
            scenario: `Find the midpoint of a segment from ${fmtPt(x1,y1)} to ${fmtPt(x2,y2)}.`,
            idea: `Midpoint formula: M = ((x₁+x₂)/2, (y₁+y₂)/2).`,
            method: `x: (${x1}+${x2})/2 = ${mx}. y: (${y1}+${y2})/2 = ${my}.`,
            steps: [`x-coordinate: (${x1}+${x2})÷2 = ${mx}.`, `y-coordinate: (${y1}+${y2})÷2 = ${my}.`, `Midpoint: ${fmtPt(mx,my)}.`],
            check: `${mx} is halfway between ${x1} and ${x2}; ${my} is halfway between ${y1} and ${y2}. ✓`,
          },
        };
      }
      if (sub === 1) {
        const TRIPLES = [[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15],[12,16,20]];
        const [dx, dy, dist] = pick(TRIPLES);
        const x1 = rand(0, 4), y1 = rand(0, 4);
        const { options, correctIndex } = buildMC(dist, [dx+dy, dist+1, dist-1, dist+2]);
        const x2 = x1+dx, y2 = y1+dy;
        const svg = `<svg viewBox="0 0 260 240" xmlns="http://www.w3.org/2000/svg">${axes()}${seg(x1,y1,x2,y2,"#7c5cff",2)}${dot(x1,y1)}${lbl(x1,y1,"A",-14,4)}${dot(x2,y2)}${lbl(x2,y2,"B")}</svg>`;
        return {
          q: `${svg}What is the distance between A = ${fmtPt(x1,y1)} and B = ${fmtPt(x2,y2)}?`,
          options, correctIndex,
          hint: `Draw the right-angled triangle: across by ${dx} and up by ${dy}. Apply Pythagoras: distance = √(${dx}² + ${dy}²).`,
          solution: {
            scenario: `Find the straight-line distance between two grid points.`,
            idea: `Horizontal and vertical gaps are the legs of a right triangle; Pythagoras gives the distance.`,
            method: `d² = ${dx}² + ${dy}² = ${dx*dx}+${dy*dy} = ${dist*dist}. d = ${dist}.`,
            steps: [`Horizontal gap: ${dx}. Vertical gap: ${dy}.`, `d² = ${dx*dx}+${dy*dy} = ${dist*dist}.`, `d = ${dist}.`],
            check: `${dx}²+${dy}² = ${dx*dx+dy*dy} = ${dist}². ✓`,
          },
        };
      }
      if (sub === 2) {
        const x1=rand(-4,4),y1=rand(-4,4),x2=rand(-4,4),y2=rand(-4,4);
        if (x1===x2||y1===y2) return G.coordGeom(d);
        const x4=x2,y4=y1; // complete rectangle
        const { options, correctIndex } = buildMCStr(fmtPt(x4,y4),[fmtPt(x2,y1+1),fmtPt(x2,y1-1),fmtPt(x2+1,y1),fmtPt(x2-1,y1),fmtPt(x1,y2)].filter(s=>s!==fmtPt(x4,y4)));
        const x3=x1, y3=y2;
        const svg = `<svg viewBox="0 0 260 240" xmlns="http://www.w3.org/2000/svg">${axes()}${seg(x1,y1,x2,y1,"#7c5cff",2)}${seg(x2,y1,x2,y2,"#7c5cff",2)}${seg(x2,y2,x1,y2,"#7c5cff",2)}${seg(x1,y2,x1,y1,"#7c5cff",2)}${dot(x1,y1)}${lbl(x1,y1,"A",-14,4)}${dot(x2,y1)}${lbl(x2,y1,"B")}${dot(x3,y3)}${lbl(x3,y3,"C",-14,4)}${lbl(x4,y4,"D?",8,-8)}</svg>`;
        return {
          q: `${svg}Three corners of a rectangle are at A = ${fmtPt(x1,y1)}, B = ${fmtPt(x2,y1)} and C = ${fmtPt(x3,y3)}. What are the coordinates of the fourth corner D?`,
          options, correctIndex,
          hint: `A rectangle has two pairs of parallel equal sides. Opposite corners share one coordinate with each of the two adjacent corners. The missing corner D shares its x-coordinate with B and its y-coordinate with A (or vice versa, depending on the layout).`,
          solution: {
            scenario: `Find the fourth corner of a rectangle from three given corners.`,
            idea: `In a rectangle, opposite sides are parallel. D must be directly below B and directly to the right of C (or whichever combination fits the layout).`,
            method: `D has x = B's x = ${x2} and y = A's y = ${y1}. Wait — check the rectangle: D = (${x4}, ${y4}).`,
            steps: [`A = ${fmtPt(x1,y1)}, B = ${fmtPt(x2,y1)}, C = ${fmtPt(x3,y3)}.`, `D must complete the rectangle: same x as B, same y as A → D = ${fmtPt(x4,y4)}.`],
            check: `All four corners: ${fmtPt(x1,y1)}, ${fmtPt(x2,y1)}, ${fmtPt(x3,y3)}, ${fmtPt(x4,y4)}. Opposite sides are equal and parallel. ✓`,
          },
        };
      }
      const x=rand(-4,4),y=rand(-4,4);
      if (x===0||y===0) return G.coordGeom(d);
      const q_label=quadrantOf(x,y);
      const { options, correctIndex } = buildMCStr(q_label, ["Quadrant I","Quadrant II","Quadrant III","Quadrant IV","On a coordinate axis"].filter(s=>s!==q_label));
      return {
        q: `In which quadrant does the point ${fmtPt(x,y)} lie?`,
        options, correctIndex,
        hint: `Quadrant I is top-right (+,+); II is top-left (−,+); III is bottom-left (−,−); IV is bottom-right (+,−). Check the signs of both coordinates.`,
        solution: {
          scenario: `Identify the quadrant of a point by its coordinate signs.`,
          idea: `The four quadrants are determined by the signs of x and y.`,
          method: `x = ${x} (${x>0?'positive':'negative'}), y = ${y} (${y>0?'positive':'negative'}) → ${q_label}.`,
          steps: [`x = ${x}: ${x>0?'positive (right)':'negative (left)'}.`, `y = ${y}: ${y>0?'positive (up)':'negative (down)'}.`, `That puts the point in ${q_label}.`],
          check: `Quadrant I (+,+), II (−,+), III (−,−), IV (+,−). ${fmtPt(x,y)} → ${q_label}. ✓`,
        },
      };
    }

    if (d === 2) {
      const sub = rand(0, 3);
      if (sub === 0) {
        const TRIPLES = [[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15]];
        const [dx, dy, dist] = pick(TRIPLES);
        const ax=rand(0,3),ay=0,bx=ax,by=dy,cx=ax+dx,cy=0;
        const perim = dy + dx + dist;
        const { options, correctIndex } = buildMC(perim,[dx+dy,perim+2,perim-2,dist*2]);
        const svg = `<svg viewBox="0 0 260 240" xmlns="http://www.w3.org/2000/svg">${axes()}${seg(ax,ay,bx,by,"#7c5cff",2)}${seg(bx,by,cx,cy,"#7c5cff",2)}${seg(cx,cy,ax,ay,"#7c5cff",2)}${dot(ax,ay)}${lbl(ax,ay,"A",-14,4)}${dot(bx,by)}${lbl(bx,by,"B",-14,4)}${dot(cx,cy)}${lbl(cx,cy,"C")}</svg>`;
        return {
          q: `${svg}A = ${fmtPt(ax,ay)}, B = ${fmtPt(bx,by)}, C = ${fmtPt(cx,cy)}. What is the perimeter of triangle ABC?`,
          options, correctIndex,
          hint: `Two sides are axis-aligned (easy to measure). The third is a diagonal — use Pythagoras with the horizontal and vertical gaps between its endpoints.`,
          solution: {
            scenario: `Perimeter of a right triangle with two axis-aligned sides.`,
            idea: `Read the two axis-aligned lengths directly; use Pythagoras for the slanted side.`,
            method: `AB = ${dy}. BC = ${dx}. AC = √(${dx}²+${dy}²) = ${dist}. Perimeter = sum.`,
            steps: [`AB = ${dy} (vertical).`, `BC = ${dx} (horizontal).`, `AC = √(${dx*dx}+${dy*dy}) = ${dist}.`, `Perimeter = ${dy}+${dx}+${dist} = ${perim}.`],
            check: `${dy}+${dx}+${dist} = ${perim}. ✓`,
          },
        };
      }
      if (sub === 1) {
        const mx=rand(-2,2),my=rand(-2,2),dx=rand(2,5),dy=rand(2,5);
        const ax=mx-dx,ay=my-dy,bx=mx+dx,by=my+dy;
        const cx=rand(-5,5),cy=rand(-5,5);
        if (cx===ax||cy===ay) return G.coordGeom(d);
        const dx2=bx-ax,dy2=by-ay,mx2=(ax+bx)/2,my2=(ay+by)/2;
        const { options, correctIndex } = buildMCStr(fmtPt(bx,by),[fmtPt(bx+1,by),fmtPt(bx,by+1),fmtPt(ax,ay),fmtPt(2*mx2-ax-1,2*my2-ay)]);
        return {
          q: `A parallelogram has vertices A = ${fmtPt(ax,ay)}, B = (unknown), C = ${fmtPt(cx,cy)}, D = ${fmtPt(ax+bx-cx,ay+by-cy)} (in order). The diagonals of a parallelogram bisect each other. The midpoint of AC is ${fmtPt(mx,my)}. Find B.`,
          options, correctIndex,
          hint: `The diagonals of a parallelogram bisect each other, so the midpoint of diagonal AC equals the midpoint of diagonal BD. If the midpoint is ${fmtPt(mx,my)} and D = ${fmtPt(ax+bx-cx,ay+by-cy)}, use the midpoint formula in reverse to find B.`,
          solution: {
            scenario: `Find a vertex of a parallelogram using the diagonal-bisection property.`,
            idea: `Diagonal midpoints are equal. Midpoint of BD = ${fmtPt(mx,my)}. D is known, so B = 2×midpoint − D.`,
            method: `B = (2×${mx} − D_x, 2×${my} − D_y).`,
            steps: [`Diagonals bisect each other, so midpoint of BD = ${fmtPt(mx,my)}.`, `D = ${fmtPt(ax+bx-cx,ay+by-cy)}. B_x = 2×${mx} − ${ax+bx-cx} = ${bx}. B_y = 2×${my} − ${ay+by-cy} = ${by}.`, `B = ${fmtPt(bx,by)}.`],
            check: `Midpoint of B${fmtPt(bx,by)} and D${fmtPt(ax+bx-cx,ay+by-cy)}: x = ${(bx+ax+bx-cx)/2} = ${mx} ✓; y = ${my} ✓.`,
          },
        };
      }
      if (sub === 2) {
        const x=rand(1,5),y=rand(1,5);
        const rx=-x,ry=y; // reflect in y-axis
        const q_orig=quadrantOf(x,y), q_refl=quadrantOf(rx,ry);
        const { options, correctIndex } = buildMCStr(q_refl, ["Quadrant I","Quadrant II","Quadrant III","Quadrant IV","On a coordinate axis"].filter(s=>s!==q_refl));
        return {
          q: `Point P = ${fmtPt(x,y)} is reflected in the y-axis to give P'. In which quadrant does P' lie?`,
          options, correctIndex,
          hint: `Reflecting in the y-axis negates the x-coordinate; the y-coordinate stays the same. So ${fmtPt(x,y)} becomes ${fmtPt(rx,ry)}. Then identify the quadrant by the signs of the new coordinates.`,
          solution: {
            scenario: `Reflect a point in the y-axis, then identify its quadrant.`,
            idea: `Reflection in the y-axis: (x,y) → (−x, y).`,
            method: `P' = (−${x}, ${y}) = ${fmtPt(rx,ry)}. Signs: (−, +) → ${q_refl}.`,
            steps: [`Reflect in y-axis: x → −x, y stays. P' = ${fmtPt(rx,ry)}.`, `Signs: x = ${rx} (negative), y = ${ry} (positive) → ${q_refl}.`],
            check: `${fmtPt(rx,ry)}: negative x, positive y → ${q_refl}. ✓`,
          },
        };
      }
      const ax=rand(1,4),ay=rand(1,4),bx=rand(1,4),by=rand(1,4),px=rand(1,4),py=rand(1,4);
      if (ax===bx&&ay===by) return G.coordGeom(d);
      const da=Math.sqrt((px-ax)**2+(py-ay)**2), db=Math.sqrt((px-bx)**2+(py-by)**2);
      if (Math.abs(da-db)<0.01) return G.coordGeom(d);
      const closer=da<db?"A":"B", farther=da<db?"B":"A";
      const { options, correctIndex } = buildMCStr(`Point ${closer}`,[`Point ${farther}`,`They are the same distance`,`Cannot be determined`,`Point P`].filter(s=>s!==`Point ${closer}`).slice(0,4));
      return {
        q: `P = ${fmtPt(px,py)}, A = ${fmtPt(ax,ay)}, B = ${fmtPt(bx,by)}. Which of A or B is closer to P?`,
        options, correctIndex,
        hint: `Calculate PA² and PB² using Pythagoras (you only need to compare, so you can skip the square root). Whichever squared distance is smaller belongs to the closer point.`,
        solution: {
          scenario: `Compare two distances to a point using Pythagoras — no need to fully compute the square root.`,
          idea: `Distance² suffices for comparison (larger squared distance → larger distance).`,
          method: `PA² = ${(px-ax)**2+(py-ay)**2}. PB² = ${(px-bx)**2+(py-by)**2}. Compare.`,
          steps: [`PA² = (${px}−${ax})²+(${py}−${ay})² = ${(px-ax)**2}+${(py-ay)**2} = ${(px-ax)**2+(py-ay)**2}.`, `PB² = ${(px-bx)**2+(py-by)**2}.`, `${da<db?`PA² < PB²`:`PB² < PA²`}, so ${closer} is closer.`],
          check: `${da.toFixed(2)} < ${db.toFixed(2)}: ${closer} is closer. ✓`,
        },
      };
    }

    if (d === 3) {
      const sub = rand(0, 3);
      if (sub === 0) {
        const cx=rand(-2,2),cy=rand(-2,2),side=pick([2,4,6]);
        const h=side/2;
        const corners=[[cx-h,cy-h],[cx+h,cy-h],[cx+h,cy+h],[cx-h,cy+h]];
        const [kx,ky]=corners[rand(0,3)];
        const [fx,fy]=corners.find(([x,y])=>x!==kx&&y!==ky);
        const { options, correctIndex } = buildMCStr(fmtPt(fx,fy),[fmtPt(cx,cy),fmtPt(kx+1,ky+1),fmtPt(kx-1,ky-1),fmtPt(fx+1,fy),fmtPt(kx,ky)].filter(s=>s!==fmtPt(fx,fy)));
        return {
          q: `A square has centre ${fmtPt(cx,cy)} and side length ${side}. One corner is at ${fmtPt(kx,ky)}. What are the coordinates of the corner diagonally opposite?`,
          options, correctIndex,
          hint: `Opposite corners of a square are symmetric about the centre. The opposite corner is the centre's reflection through ${fmtPt(kx,ky)}: compute (2×centre_x − kx, 2×centre_y − ky).`,
          solution: {
            scenario: `Find the corner diagonally opposite a given corner, using the centre.`,
            idea: `The centre is the midpoint of both diagonals. Opposite = 2×centre − given corner.`,
            method: `Opposite = (2×${cx}−${kx}, 2×${cy}−${ky}) = ${fmtPt(fx,fy)}.`,
            steps: [`Centre = ${fmtPt(cx,cy)}, given corner = ${fmtPt(kx,ky)}.`, `Opposite = (2×${cx}−${kx}, 2×${cy}−${ky}) = ${fmtPt(fx,fy)}.`],
            check: `Midpoint of ${fmtPt(kx,ky)} and ${fmtPt(fx,fy)}: ((${kx}+${fx})/2, (${ky}+${fy})/2) = ${fmtPt(cx,cy)} ✓.`,
          },
        };
      }
      if (sub === 1) {
        const mx=rand(-2,2),my=rand(-2,2);
        const dx=rand(2,5),dy=rand(2,5);
        const ax=mx-dx,ay=my-dy,bx=mx+dx,by=my+dy;
        const { options, correctIndex } = buildMCStr(fmtPt(bx,by),[fmtPt(bx+1,by),fmtPt(bx,by+1),fmtPt(ax,ay),fmtPt(mx,my)]);
        return {
          q: `The midpoint of segment AB is ${fmtPt(mx,my)}. A = ${fmtPt(ax,ay)}. Find B.`,
          options, correctIndex,
          hint: `Use the midpoint formula in reverse: B = (2×midpoint_x − A_x, 2×midpoint_y − A_y). Each coordinate of the midpoint is the average of the two endpoints, so multiply by 2 and subtract A.`,
          solution: {
            scenario: `Find an endpoint given the midpoint and the other endpoint.`,
            idea: `Midpoint = (A+B)/2, so B = 2×midpoint − A.`,
            method: `B = (2×${mx}−${ax}, 2×${my}−${ay}) = ${fmtPt(bx,by)}.`,
            steps: [`B_x = 2×${mx}−${ax} = ${bx}.`, `B_y = 2×${my}−${ay} = ${by}.`, `B = ${fmtPt(bx,by)}.`],
            check: `Midpoint: ((${ax}+${bx})/2, (${ay}+${by})/2) = ${fmtPt(mx,my)}. ✓`,
          },
        };
      }
      if (sub === 2) {
        const w=rand(3,8),h=rand(3,8);
        const diag=Math.sqrt(w*w+h*h);
        if (diag!==Math.round(diag)) return G.coordGeom(d);
        const { options, correctIndex } = buildMC(diag,[w+h,diag+1,diag-1,diag+2]);
        return {
          q: `A rectangle has vertices at (0,0), (${w},0), (${w},${h}) and (0,${h}). How long is its diagonal?`,
          options, correctIndex,
          hint: `The diagonal runs from (0,0) to (${w},${h}). Apply Pythagoras with the width and height as the two legs.`,
          solution: {
            scenario: `Find the diagonal of a rectangle using Pythagoras.`,
            idea: `d² = width² + height².`,
            method: `d² = ${w}²+${h}² = ${w*w+h*h} = ${diag*diag}. d = ${diag}.`,
            steps: [`Diagonal from (0,0) to (${w},${h}): d² = ${w}²+${h}² = ${w*w}+${h*h} = ${diag*diag}.`, `d = ${diag}.`],
            check: `${w*w}+${h*h} = ${diag*diag} = ${diag}². ✓`,
          },
        };
      }
      const x0=rand(1,4),y0=rand(1,4);
      const ops=[
        {name:"reflect in x-axis",fn:(x,y)=>[x,-y]},
        {name:"reflect in y-axis",fn:(x,y)=>[-x,y]},
        {name:"reflect in y=x",fn:(x,y)=>[y,x]},
        {name:"rotate 90° clockwise",fn:(x,y)=>[y,-x]},
        {name:"rotate 180°",fn:(x,y)=>[-x,-y]},
      ];
      const [op1,op2]=shuffle([...ops]).slice(0,2);
      const [x1,y1]=op1.fn(x0,y0);
      const [x2,y2]=op2.fn(x1,y1);
      const { options, correctIndex } = buildMCStr(fmtPt(x2,y2),[fmtPt(x2+1,y2),fmtPt(x2,y2+1),fmtPt(x1,y1),fmtPt(x0,y0),fmtPt(x2-1,y2)].filter(s=>s!==fmtPt(x2,y2)));
      return {
        q: `Start at ${fmtPt(x0,y0)}. Apply: (1) ${op1.name}; (2) ${op2.name}. What is the final position?`,
        options, correctIndex,
        hint: `Apply each transformation in order. After step 1 you get an intermediate point; then apply step 2 to that result. Don't try to combine them mentally — do them one at a time.`,
        solution: {
          scenario: `Two-step coordinate transformation.`,
          idea: `Apply transformations sequentially. Each rule changes (x,y) in a predictable way.`,
          method: `Step 1 (${op1.name}): ${fmtPt(x0,y0)} → ${fmtPt(x1,y1)}. Step 2 (${op2.name}): → ${fmtPt(x2,y2)}.`,
          steps: [`Start: ${fmtPt(x0,y0)}.`, `After ${op1.name}: ${fmtPt(x1,y1)}.`, `After ${op2.name}: ${fmtPt(x2,y2)}.`],
          check: `Trace back: reverse step 2 from ${fmtPt(x2,y2)} → ${fmtPt(x1,y1)}, reverse step 1 → ${fmtPt(x0,y0)}. ✓`,
        },
      };
    }

    // d === 4
    const sub = rand(0, 3);
    if (sub === 0) {
      const ax=rand(-3,3),ay=rand(-3,3),bx=rand(-3,3),by=rand(-3,3),cx=rand(-3,3),cy=rand(-3,3);
      if (ax===bx&&ay===by) return G.coordGeom(d);
      const dx1=bx-ax,dy1=by-ay,dx2=cx-bx,dy2=cy-by,dx3=ax-cx,dy3=ay-cy;
      const perim=Math.round((Math.sqrt(dx1*dx1+dy1*dy1)+Math.sqrt(dx2*dx2+dy2*dy2)+Math.sqrt(dx3*dx3+dy3*dy3))*100)/100;
      if (perim!==Math.round(perim)) return G.coordGeom(d);
      const { options, correctIndex } = buildMC(perim,[perim+2,perim-2,perim+4,Math.round(Math.sqrt(dx1*dx1+dy1*dy1)+Math.sqrt(dx2*dx2+dy2*dy2))]);
      return {
        q: `A parallelogram ABCD has A=${fmtPt(ax,ay)}, B=${fmtPt(bx,by)}, C=${fmtPt(cx,cy)}. Opposite sides of a parallelogram are equal. What is the perimeter?`,
        options, correctIndex,
        hint: `In a parallelogram, opposite sides are equal in length. Calculate AB and BC using Pythagoras; the perimeter is 2×(AB + BC).`,
        solution: {
          scenario: `Perimeter of a parallelogram using the opposite-sides shortcut.`,
          idea: `Opposite sides are equal, so only two distinct lengths need computing. Perimeter = 2×(AB+BC).`,
          method: `AB = √(${dx1*dx1+dy1*dy1}). BC = √(${dx2*dx2+dy2*dy2}). Perimeter = 2×(AB+BC).`,
          steps: [`AB = √(${dx1}²+${dy1}²) = √${dx1*dx1+dy1*dy1}.`, `BC = √(${dx2}²+${dy2}²) = √${dx2*dx2+dy2*dy2}.`, `Perimeter = 2×(AB+BC) = ${perim}.`],
          check: `Opposite sides equal → CD = AB, DA = BC. Sum = 2×(AB+BC) = ${perim}. ✓`,
        },
      };
    }
    if (sub === 1) {
      const base_x1=rand(-4,0),base_y=0,base_x2=rand(1,5),apex_x=rand(-3,4),apex_y=rand(2,5);
      const base=base_x2-base_x1;
      const area_2=Math.abs(base*apex_y);
      if (area_2%2!==0) return G.coordGeom(d);
      const area=area_2/2;
      const { options, correctIndex } = buildMC(area,[area*2,area+base,area-1,area+2]);
      return {
        q: `A triangle has vertices at ${fmtPt(base_x1,base_y)}, ${fmtPt(base_x2,base_y)} and ${fmtPt(apex_x,apex_y)}. What is its area?`,
        options, correctIndex,
        hint: `The base lies along the x-axis (y = 0), so its length is just the difference in x-coordinates. The height is the perpendicular distance from the apex to the base — which is simply the apex's y-coordinate. Area = ½ × base × height.`,
        solution: {
          scenario: `Area of a triangle with a horizontal base on the x-axis.`,
          idea: `Base = difference of x-coordinates along y = 0. Height = apex's y-coordinate (perpendicular to base).`,
          method: `Base = ${base_x2}−${base_x1} = ${base}. Height = ${apex_y}. Area = ½×${base}×${apex_y}.`,
          steps: [`Base = ${base_x2}−${base_x1} = ${base} (along x-axis).`, `Height = ${apex_y} (perpendicular from apex to x-axis).`, `Area = ½×${base}×${apex_y} = ${area}.`],
          check: `½×${base}×${apex_y} = ${area}. ✓`,
        },
      };
    }
    const x0=rand(-2,2),y0=rand(-2,2);
    const ops2=[
      {name:"reflect in x-axis",fn:(x,y)=>[x,-y]},
      {name:"reflect in y-axis",fn:(x,y)=>[-x,y]},
      {name:"reflect in y=x",fn:(x,y)=>[y,x]},
      {name:"rotate 90° clockwise",fn:(x,y)=>[y,-x]},
      {name:"rotate 180°",fn:(x,y)=>[-x,-y]},
      {name:"rotate 90° anticlockwise",fn:(x,y)=>[-y,x]},
    ];
    const [o1,o2,o3]=shuffle([...ops2]).slice(0,3);
    const [x1,y1]=o1.fn(x0,y0);
    const [x2,y2]=o2.fn(x1,y1);
    const [x3,y3]=o3.fn(x2,y2);
    const { options, correctIndex } = buildMCStr(fmtPt(x3,y3),[fmtPt(x3+1,y3),fmtPt(x3,y3+1),fmtPt(x1,y1),fmtPt(x0,y0),fmtPt(x3-1,y3),fmtPt(x3,y3-1)].filter(s=>s!==fmtPt(x3,y3)));
    return {
      q: `Start at ${fmtPt(x0,y0)}. Apply: (1) ${o1.name}; (2) ${o2.name}; (3) ${o3.name}. Where do you end up?`,
      options, correctIndex,
      hint: `Apply each transformation in turn, tracking the coordinates through each step. Do not skip ahead — find the intermediate point after step 1, then apply step 2 to that, then step 3.`,
      solution: {
        scenario: `Three-step coordinate transformation chain.`,
        idea: `Apply transformations sequentially. Each has a simple rule for (x,y).`,
        method: `Step 1→2→3.`,
        steps: [`Start: ${fmtPt(x0,y0)}.`, `After (1) ${o1.name}: ${fmtPt(x1,y1)}.`, `After (2) ${o2.name}: ${fmtPt(x2,y2)}.`, `After (3) ${o3.name}: ${fmtPt(x3,y3)}.`],
        check: `Reverse: step 3 from ${fmtPt(x3,y3)} → ${fmtPt(x2,y2)} → ${fmtPt(x1,y1)} → ${fmtPt(x0,y0)}. ✓`,
      },
    };
  },
magicGrid(d) {
    // Lo Shu base (rows/cols/diags all sum to 15): centre=5, scaled by k, shifted by c
    const BASE = [[2,7,6],[9,5,1],[4,3,8]];
    const k = rand(1, 4), c = rand(-5, 10);
    const G3 = BASE.map(r => r.map(v => v * k + c));
    const T = G3[0][0] + G3[0][1] + G3[0][2]; // row/col/diag target
    const gridSvg = (cells, blanks = []) => {
      const S = 54, M = 15;
      let s = `<svg viewBox="0 0 ${3*S+2*M} ${3*S+2*M}" xmlns="http://www.w3.org/2000/svg">`;
      for (let r = 0; r < 3; r++) for (let c2 = 0; c2 < 3; c2++) {
        const x = M + c2 * S, y = M + r * S;
        s += `<rect x="${x}" y="${y}" width="${S}" height="${S}" fill="${blanks.some(([br,bc])=>br===r&&bc===c2)?"#ede9ff":"#f8f6ff"}" stroke="#7c5cff" stroke-width="1.5"/>`;
        if (!blanks.some(([br,bc])=>br===r&&bc===c2))
          s += `<text x="${x+S/2}" y="${y+S/2+6}" text-anchor="middle" font-size="20" font-weight="700" fill="#2a1a5e">${cells[r][c2]}</text>`;
        else
          s += `<text x="${x+S/2}" y="${y+S/2+6}" text-anchor="middle" font-size="20" font-weight="700" fill="#b0a0f8">?</text>`;
      }
      s += `</svg>`; return s;
    };

    if (d <= 1) {
      const sub = rand(0, 2);
      if (sub === 0) {
        // shared-cell cross: row and column both sum to T
        const r0 = rand(0, 2), c0 = rand(0, 2);
        const rowBlanks = [[r0, c0]];
        const knownRowSum = G3[r0].reduce((a,v,i)=>i===c0?a:a+v, 0);
        const ans = T - knownRowSum;
        const { options, correctIndex } = buildMC(ans, [ans+k, ans-k, knownRowSum, T-ans]);
        return {
          q: `${gridSvg(G3, rowBlanks)}In this magic square, every row, column, and diagonal adds up to ${T}. What number goes in the blank cell?`,
          options, correctIndex,
          hint: `Find the row that contains the blank cell. The other two numbers in that row are known — subtract them from the row total (${T}) to find the missing value.`,
          solution: {
            scenario: `Fill the blank cell of a ${k===1&&c===0?'standard':''} magic square with row/col/diag target ${T}.`,
            idea: `Every row sums to ${T}. The blank is in a row where two values are known — subtract to find it.`,
            method: `Row ${r0+1}: values sum to ${T}. Known sum = ${knownRowSum}. Blank = ${T} − ${knownRowSum} = ${ans}.`,
            steps: [`The blank is in row ${r0+1} where the known values sum to ${knownRowSum}.`, `Blank = ${T} − ${knownRowSum} = ${ans}.`],
            check: `${knownRowSum} + ${ans} = ${T}. ✓`,
          },
        };
      }
      if (sub === 1) {
        // two blanks in the same row — give their sum
        const r0 = rand(0, 2);
        const [c1,c2_] = shuffle([0,1,2]).slice(0,2);
        const known = G3[r0][[0,1,2].find(i=>i!==c1&&i!==c2_)];
        const ansSum = T - known;
        const { options, correctIndex } = buildMC(ansSum, [ansSum+k, ansSum-k, T, known]);
        return {
          q: `${gridSvg(G3,[[r0,c1],[r0,c2_]])}In this magic square, every row, column, and diagonal adds up to ${T}. What is the SUM of the two blank cells?`,
          options, correctIndex,
          hint: `You don't need to find each blank individually. The row containing both blanks sums to ${T}. Subtract the one known value in that row to get the combined total of the two blanks.`,
          solution: {
            scenario: `Find the sum of two unknowns in the same row of a magic square.`,
            idea: `The whole row sums to ${T}. Subtract the known entry to get the sum of the two blanks, without needing to find each separately.`,
            method: `Row sum = ${T}. Known = ${known}. Sum of blanks = ${T} − ${known} = ${ansSum}.`,
            steps: [`Row sum = ${T}. Known value in this row = ${known}.`, `Sum of the two blanks = ${T} − ${known} = ${ansSum}.`],
            check: `${known} + ${ansSum} = ${T}. ✓`,
          },
        };
      }
      // opposite pairs sum to 2×centre
      const centre = G3[1][1];
      const pairs = [[0,0,2,2],[0,2,2,0],[0,1,2,1],[1,0,1,2]];
      const [r1,c1_,r2,c2__] = pick(pairs);
      const known2 = G3[r1][c1_];
      const ans2 = 2*centre - known2;
      const { options, correctIndex } = buildMC(ans2,[ans2+k,ans2-k,centre,known2]);
      return {
        q: `${gridSvg(G3,[[r2,c2__]])}In this magic square with target ${T}, the blank cell is opposite the cell containing ${known2}. What goes in the blank?`,
        options, correctIndex,
        hint: `In any magic square, two cells that are symmetric about the centre always add up to twice the centre value. The centre here is ${centre}. So: blank = 2 × ${centre} − ${known2}.`,
        solution: {
          scenario: `Use the centre-symmetry property of a magic square to find an opposite cell.`,
          idea: `Any two cells symmetric about the centre sum to 2 × centre. This follows from the magic-square structure.`,
          method: `Blank = 2 × ${centre} − ${known2} = ${ans2}.`,
          steps: [`Centre = ${centre}. Symmetric pairs always sum to 2×${centre} = ${2*centre}.`, `Blank = ${2*centre} − ${known2} = ${ans2}.`],
          check: `${known2} + ${ans2} = ${2*centre} = 2×${centre}. ✓`,
        },
      };
    }

    if (d === 2) {
      const sub = rand(0, 2);
      const blankPos = [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]];
      const bp = pick(blankPos);
      const [br, bc] = bp;
      const ans = G3[br][bc];
      if (sub === 0) {
        // solve via a complete row
        const completeRow = [0,1,2].find(r=>r!==br||true); // use a non-blank row
        const { options, correctIndex } = buildMC(ans,[ans+k,ans-k,T-ans,k]);
        return {
          q: `${gridSvg(G3,[[br,bc]])}Each row, column and diagonal of this grid sums to the same value. A complete row is shown. What number fills the blank?`,
          options, correctIndex,
          hint: `First find the magic total by summing any complete row. Then find the row or column containing the blank and subtract the known values from the total.`,
          solution: {
            scenario: `Find the magic total from a complete row, then use it to fill the blank.`,
            idea: `Read off the target from any full row. Then apply: blank = target − (sum of others in its line).`,
            method: `Target = ${T} (from a complete row). Fill the blank via its row or column.`,
            steps: [`A complete row sums to ${T} — that is the magic target.`, `The blank's row/column: known values sum to ${T - ans}. Blank = ${T} − ${T-ans} = ${ans}.`],
            check: `${T-ans} + ${ans} = ${T}. ✓`,
          },
        };
      }
      if (sub === 1) {
        // box (2×2) resolves ambiguity
        const { options, correctIndex } = buildMC(ans,[ans+k,ans-k,T-ans,G3[br][(bc+1)%3]]);
        return {
          q: `${gridSvg(G3,[[br,bc]])}This magic grid has the same row, column, and diagonal totals. Use the column containing the blank to find the missing value.`,
          options, correctIndex,
          hint: `Sum the known values in the column that contains the blank. Subtract from the magic total to find the missing entry.`,
          solution: {
            scenario: `Fill a blank via column elimination.`,
            idea: `Column sum = target. Known column entries sum to target − blank.`,
            method: `Column ${bc+1}: known values = ${G3[0][bc]}+${G3[1][bc]}+${G3[2][bc]} − ${ans} = ${T-ans}. Blank = ${ans}.`,
            steps: [`Column containing blank: known entries sum to ${T-ans}.`, `Blank = ${T} − ${T-ans} = ${ans}.`],
            check: `${T-ans} + ${ans} = ${T}. ✓`,
          },
        };
      }
      const { options, correctIndex } = buildMC(ans,[ans+k,ans-k,T-ans,T/3|0]);
      return {
        q: `${gridSvg(G3,[[br,bc]])}In this magic grid, a diagonal sums to ${T}. Use the diagonal containing the blank to find the missing entry.`,
        options, correctIndex,
        hint: `Identify the diagonal that passes through the blank cell. Sum the other two known entries on that diagonal and subtract from ${T}.`,
        solution: {
          scenario: `Fill a blank via diagonal elimination.`,
          idea: `Diagonal sum = target. Blank = target − sum of the other two diagonal entries.`,
          method: `Diagonal sum = ${T}. Known on diagonal: sum to ${T-ans}. Blank = ${ans}.`,
          steps: [`The diagonal through the blank sums to ${T}.`, `Known diagonal entries sum to ${T-ans}. Blank = ${ans}.`],
          check: `${T-ans} + ${ans} = ${T}. ✓`,
        },
      };
    }

    if (d === 3) {
      const sub = rand(0, 2);
      if (sub === 0) {
        // grand total ÷ 3 to find T
        const grandTotal = 3 * T;
        const { options, correctIndex } = buildMC(T,[T+k,T-k,grandTotal,k]);
        return {
          q: `${gridSvg(G3)}All nine numbers in this magic square add up to ${grandTotal}. What is the sum of each row (the "magic total")?`,
          options, correctIndex,
          hint: `The nine entries fill 3 equal rows. If all nine sum to ${grandTotal} and every row has the same total, then each row sums to ${grandTotal} ÷ 3.`,
          solution: {
            scenario: `Derive the magic total from the grand total (all 9 entries).`,
            idea: `Grand total = 3 × magic total. Divide by 3.`,
            method: `Magic total = ${grandTotal} ÷ 3 = ${T}.`,
            steps: [`Nine entries summing to ${grandTotal}, split equally into 3 rows.`, `Each row sums to ${grandTotal} ÷ 3 = ${T}.`],
            check: `3 × ${T} = ${grandTotal}. ✓`,
          },
        };
      }
      if (sub === 1) {
        // two-step chain: a → ? where ? depends on a known cell
        const r0 = rand(0, 2);
        const [ac, bc2, cc_] = [0,1,2];
        const aVal = G3[r0][ac], bVal = G3[r0][bc2], cVal = G3[r0][cc_];
        const otherRow = rand(0,2)===r0 ? (r0+1)%3 : rand(0,2);
        const known = G3[otherRow][0];
        const targetCell = G3[otherRow][2];
        const { options, correctIndex } = buildMC(targetCell,[targetCell+k,targetCell-k,T-targetCell,known]);
        return {
          q: `${gridSvg(G3,[[otherRow,1],[otherRow,2]])}Row ${r0+1} contains ${aVal}, ${bVal}, ${cVal} (magic total ${T}). The first entry in row ${otherRow+1} is ${known}. Using any rows, columns, or diagonals, find the last entry in row ${otherRow+1}.`,
          options, correctIndex,
          hint: `Use whatever line (row, column, or diagonal) lets you express the unknown in terms of known quantities. Chain two steps if necessary: find an intermediate unknown first, then use it to find the final answer.`,
          solution: {
            scenario: `Two-step chain in a magic square: use one elimination to enable another.`,
            idea: `Find an intermediate cell first (e.g., via a column or diagonal), then use that to solve for the target.`,
            method: `Step 1: use a column/diagonal to find the middle entry of row ${otherRow+1}. Step 2: use the row sum to find the last entry.`,
            steps: [
              `From the magic structure, find the middle entry of row ${otherRow+1} via a column or diagonal.`,
              `Middle = ${G3[otherRow][1]}.`,
              `Last entry = ${T} − ${known} − ${G3[otherRow][1]} = ${targetCell}.`,
            ],
            check: `${known} + ${G3[otherRow][1]} + ${targetCell} = ${T}. ✓`,
          },
        };
      }
      // centre-symmetry: two given, find third
      const centre = G3[1][1];
      const { options, correctIndex } = buildMC(centre,[centre+k,centre-k,T/3|0,T]);
      return {
        q: `${gridSvg(G3,[[1,1]])}In a magic square, any two cells opposite the centre sum to twice the centre. The cells at corners sum to ${G3[0][0]+G3[2][2]}. What is the centre value?`,
        options, correctIndex,
        hint: `Opposite cells always sum to 2 × centre. If two opposite cells sum to ${G3[0][0]+G3[2][2]}, then the centre = ${G3[0][0]+G3[2][2]} ÷ 2.`,
        solution: {
          scenario: `Find the centre from the sum of an opposite pair.`,
          idea: `Symmetric pairs sum to 2 × centre. Divide by 2.`,
          method: `Centre = ${G3[0][0]+G3[2][2]} ÷ 2 = ${centre}.`,
          steps: [`Opposite corners sum to ${G3[0][0]+G3[2][2]} = 2 × centre.`, `Centre = ${G3[0][0]+G3[2][2]} ÷ 2 = ${centre}.`],
          check: `2 × ${centre} = ${2*centre} = ${G3[0][0]+G3[2][2]}. ✓`,
        },
      };
    }

    // d === 4
    const sub4 = rand(0, 2);
    if (sub4 === 0) {
      // two blanks in different rows — find SUM
      const bp1=[0,0], bp2=[2,2];
      const v1=G3[0][0], v2=G3[2][2];
      const ansSum=v1+v2;
      const { options, correctIndex } = buildMC(ansSum,[ansSum+k,ansSum-k,T,2*G3[1][1]]);
      return {
        q: `${gridSvg(G3,[[0,0],[2,2]])}Two opposite corners of this magic square are blank. What is the SUM of the two missing values?`,
        options, correctIndex,
        hint: `Opposite corners are symmetric about the centre. Their sum equals twice the centre value. Find the centre from any line passing through it, then double it.`,
        solution: {
          scenario: `Sum of two opposite-corner blanks in a magic square.`,
          idea: `Opposite corners sum to 2 × centre. Find the centre from the middle row (or column), then double.`,
          method: `Centre = ${G3[1][1]} (middle row: ${G3[1][0]}+${G3[1][1]}+${G3[1][2]}=${T}). Sum = 2×${G3[1][1]} = ${ansSum}.`,
          steps: [`Middle row: ${G3[1][0]}+${G3[1][1]}+${G3[1][2]} = ${T}. Centre = ${G3[1][1]}.`, `Opposite-corner sum = 2×${G3[1][1]} = ${ansSum}.`],
          check: `${v1} + ${v2} = ${ansSum} = 2×${G3[1][1]}. ✓`,
        },
      };
    }
    if (sub4 === 1) {
      // three-link chain: row → column → row
      const startR=0, midC=1, endR=2;
      const ans=G3[endR][midC];
      const known1=G3[startR][midC];
      const { options, correctIndex } = buildMC(ans,[ans+k,ans-k,T-ans,known1]);
      return {
        q: `${gridSvg(G3,[[1,0],[1,2],[endR,midC]])}In this magic square (target ${T}), the centre column has known top value ${known1} and the two blanks in the middle row are also unknown. Find the blank at the bottom of the centre column.`,
        options, correctIndex,
        hint: `A three-link chain: use the centre column to find the middle column entry, then use the middle row (once you know enough entries) to find the bottom-of-column entry. Or use the diagonal that passes through that entry.`,
        solution: {
          scenario: `Three-link chain: row → column → row to find a target entry.`,
          idea: `Chain eliminations: each step finds one unknown, which unlocks the next.`,
          method: `Step 1: find the middle cell via a row or diagonal. Step 2: use the column sum to find the bottom.`,
          steps: [
            `Top of centre column = ${known1}. Use a complete row or diagonal to find the centre (${G3[1][1]}).`,
            `Centre column: ${known1} + ${G3[1][1]} + blank = ${T}. Blank = ${T} − ${known1} − ${G3[1][1]} = ${ans}.`,
          ],
          check: `${known1} + ${G3[1][1]} + ${ans} = ${T}. ✓`,
        },
      };
    }
    // simultaneous blanks in same row, difference given
    const r0 = rand(0,2);
    const [pos1,pos2]=shuffle([0,1,2]).slice(0,2);
    const v1_=G3[r0][pos1], v2_=G3[r0][pos2];
    const diff_=Math.abs(v1_-v2_);
    const known_=G3[r0][[0,1,2].find(i=>i!==pos1&&i!==pos2)];
    const { options, correctIndex } = buildMC(Math.max(v1_,v2_),[Math.min(v1_,v2_),Math.max(v1_,v2_)+k,known_,T-known_]);
    return {
      q: `${gridSvg(G3,[[r0,pos1],[r0,pos2]])}In this magic square (target ${T}), a row has one known value (${known_}) and two blanks. The two blanks differ by ${diff_}. Find the larger blank.`,
      options, correctIndex,
      hint: `The two blanks sum to ${T} − ${known_}. They also differ by ${diff_}. Use sum and difference: larger = (sum + difference) ÷ 2.`,
      solution: {
        scenario: `Two unknowns in the same row given their sum and difference.`,
        idea: `Sum = ${T-known_}. Difference = ${diff_}. Larger = (sum + difference) ÷ 2.`,
        method: `Larger = (${T-known_} + ${diff_}) ÷ 2 = ${Math.max(v1_,v2_)}.`,
        steps: [`Sum of blanks = ${T} − ${known_} = ${T-known_}.`, `Difference of blanks = ${diff_}.`, `Larger = (${T-known_} + ${diff_}) ÷ 2 = ${Math.max(v1_,v2_)}.`],
        check: `${Math.max(v1_,v2_)} + ${Math.min(v1_,v2_)} = ${T-known_} ✓; ${Math.max(v1_,v2_)} − ${Math.min(v1_,v2_)} = ${diff_} ✓.`,
      },
    };
  },
shapeFold(d) {
    // R(n) = 1 + n + n(n-1)/2 = max pieces from n straight cuts
    const maxPieces = (n) => 1 + n + n * (n - 1) / 2;
    const nm = N1();

    if (d <= 1) {
      const sub = rand(0, 2);
      if (sub === 0) {
        const folds = rand(1, 4), punches = 1;
        const holes = punches * Math.pow(2, folds);
        const { options, correctIndex } = buildMC(holes, [holes + 1, holes - 1, folds * 2, punches + folds]);
        return {
          q: `${nm} folds a piece of paper ${folds} time${folds > 1 ? "s" : ""} in half, then punches a single hole through all layers. How many holes are there when the paper is unfolded?`,
          options, correctIndex,
          hint: `Each fold doubles the number of layers. After ${folds} fold${folds > 1 ? "s" : ""} there are 2^${folds} = ${Math.pow(2, folds)} layers. One punch through all layers makes one hole per layer, so ${Math.pow(2, folds)} holes total.`,
          solution: {
            scenario: `Folding paper ${folds} times then punching once; count the holes when unfolded.`,
            idea: `Each fold doubles the layers. Punching through k layers creates k holes when unfolded.`,
            method: `Layers = 2^${folds} = ${Math.pow(2, folds)}. Holes = 1 × ${Math.pow(2, folds)} = ${holes}.`,
            steps: [`${folds} fold${folds > 1 ? "s" : ""}: 2^${folds} = ${Math.pow(2, folds)} layers.`, `1 punch through ${Math.pow(2, folds)} layers = ${holes} holes.`],
            check: `Unfold: each fold doubles the hole count. Starting from 1: ×2 repeated ${folds} time${folds > 1 ? "s" : ""} = ${holes}. ✓`,
          },
        };
      }
      if (sub === 1) {
        const n = rand(2, 6);
        const pieces = maxPieces(n);
        const { options, correctIndex } = buildMC(pieces, [n + 1, pieces + 1, pieces - 1, n * n]);
        return {
          q: `What is the maximum number of pieces you can cut a flat shape into with exactly ${n} straight cuts?`,
          options, correctIndex,
          hint: `The first cut makes 2 pieces. Each new cut can cross every previous cut, adding 1 more piece than the cut number. Cut k adds k pieces. So the total is 1 + 1 + 2 + 3 + ... + ${n} = 1 + (1+2+...+${n}).`,
          solution: {
            scenario: `Maximum pieces from ${n} straight cuts.`,
            idea: `Cut k can cross all k−1 previous cuts, creating k new pieces. Total = 1 + sum(1 to n) = 1 + n(n+1)/2... but the formula simplifies to 1 + n + n(n−1)/2.`,
            method: `R(${n}) = 1 + ${n} + ${n}×${n-1}÷2 = ${pieces}.`,
            steps: [`Each cut k adds k new pieces (crossing all previous cuts).`, `R(${n}) = 1 + 1 + 2 + ... + ${n} = 1 + ${n*(n+1)/2} = ${pieces}.`],
            check: `R(1)=2, R(2)=4, R(3)=7, ... R(${n})=${pieces}. ✓`,
          },
        };
      }
      const w = rand(2, 5) * 2, h = rand(2, 5) * 2;
      const sideLen = rand(1, Math.min(w, h) / 2);
      const bigArea = w * h, cutArea = sideLen * sideLen;
      const area = bigArea - cutArea;
      const half = area / 2;
      const { options, correctIndex } = buildMC(half, [bigArea / 2, area, half + sideLen, half - sideLen]);
      return {
        q: `An ${w} cm × ${h} cm rectangle has a ${sideLen} cm × ${sideLen} cm square cut from one corner. A single straight cut divides the remaining shape into two equal-area pieces. What is the area of each piece, in cm²?`,
        options, correctIndex,
        hint: `Find the area of the remaining shape (rectangle minus the notch), then divide by 2 to get each equal piece.`,
        solution: {
          scenario: `Area of each half after a symmetric cut of a notched rectangle.`,
          idea: `Total remaining area = big rectangle − notch. Two equal pieces → area ÷ 2.`,
          method: `Area = ${w}×${h} − ${sideLen}×${sideLen} = ${bigArea} − ${cutArea} = ${area}. Each piece = ${area}÷2 = ${half}.`,
          steps: [`Rectangle area = ${w}×${h} = ${bigArea} cm².`, `Notch area = ${sideLen}² = ${cutArea} cm².`, `Remaining area = ${area} cm². Each half = ${half} cm².`],
          check: `2 × ${half} = ${area} = ${bigArea} − ${cutArea}. ✓`,
        },
      };
    }

    if (d === 2) {
      const sub = rand(0, 2);
      if (sub === 0) {
        const folds = rand(1, 3), punches = rand(2, 4);
        const holes = punches * Math.pow(2, folds);
        const { options, correctIndex } = buildMC(holes, [holes + punches, holes - punches, folds * punches, holes + 1]);
        return {
          q: `${nm} folds paper ${folds} time${folds > 1 ? "s" : ""} in half, then punches ${punches} holes through all the layers. How many holes appear when the paper is fully unfolded?`,
          options, correctIndex,
          hint: `Each fold doubles the layers (to ${Math.pow(2, folds)}). Each punch goes through all ${Math.pow(2, folds)} layers, creating ${Math.pow(2, folds)} holes. With ${punches} punches, multiply.`,
          solution: {
            scenario: `${punches} punches through a paper folded ${folds} times; total holes when unfolded.`,
            idea: `Layers = 2^${folds}. Each punch creates one hole per layer. Total = punches × layers.`,
            method: `${punches} × 2^${folds} = ${punches} × ${Math.pow(2, folds)} = ${holes}.`,
            steps: [`Layers after ${folds} fold${folds>1?"s":""}: 2^${folds} = ${Math.pow(2, folds)}.`, `Each of ${punches} punches creates ${Math.pow(2, folds)} holes.`, `Total = ${punches} × ${Math.pow(2, folds)} = ${holes}.`],
            check: `${punches} × ${Math.pow(2, folds)} = ${holes}. ✓`,
          },
        };
      }
      if (sub === 1) {
        const n = rand(3, 7);
        const piecesN = maxPieces(n), piecesNminus = maxPieces(n - 1);
        const diff = piecesN - piecesNminus;
        const { options, correctIndex } = buildMC(piecesN, [piecesN + 1, piecesNminus, piecesN - 1, piecesN + n]);
        return {
          q: `After ${n - 1} straight cuts, a shape is in ${piecesNminus} pieces. One more cut is made, crossing every previous cut. How many pieces are there now?`,
          options, correctIndex,
          hint: `The ${n}th cut crosses all ${n-1} previous cuts, making ${n-1} intersection points on the new cut. Those ${n-1} points divide the cut into ${n} segments, each adding one extra piece: the cut adds exactly ${n} new pieces.`,
          solution: {
            scenario: `Incremental cut: adding a ${n}th cut that crosses all ${n-1} previous ones.`,
            idea: `Cut k crosses k−1 previous cuts, creating k new pieces. The ${n}th cut adds exactly ${n} pieces.`,
            method: `${piecesNminus} + ${n} = ${piecesN}.`,
            steps: [`The ${n}th cut crosses all ${n-1} previous cuts, adding ${n} new pieces.`, `${piecesNminus} + ${n} = ${piecesN}.`],
            check: `R(${n}) = 1+${n}+${n*(n-1)/2} = ${piecesN}. ✓`,
          },
        };
      }
      const w = rand(3, 7), h = rand(3, 7);
      const notchW = rand(1, w - 1), notchH = rand(1, h - 1);
      const remaining = w * h - notchW * notchH;
      const half = remaining / 2;
      if (!Number.isInteger(half)) return G.shapeFold(d);
      const { options, correctIndex } = buildMC(half, [w * h / 2, remaining, half + 1, half - 1]);
      return {
        q: `A ${w} cm × ${h} cm rectangle has a ${notchW} cm × ${notchH} cm piece cut from one corner. The remainder is then cut in half to give two equal-area pieces. What is the area of each piece, in cm²?`,
        options, correctIndex,
        hint: `First find the remaining area (full rectangle minus the notch). Then divide by 2.`,
        solution: {
          scenario: `Area after two subtractions then halving: compound shape halved.`,
          idea: `Remaining area = w×h − notch. Halve it.`,
          method: `${w*h} − ${notchW*notchH} = ${remaining}. ÷2 = ${half}.`,
          steps: [`Full area = ${w*h}. Notch area = ${notchW*notchH}.`, `Remaining = ${remaining}. Each half = ${half} cm².`],
          check: `2×${half} = ${remaining} = ${w*h}−${notchW*notchH}. ✓`,
        },
      };
    }

    if (d === 3) {
      const sub = rand(0, 2);
      if (sub === 0) {
        const target = rand(5, 15);
        let n = 1;
        while (maxPieces(n) < target) n++;
        if (maxPieces(n) !== target) return G.shapeFold(d);
        const { options, correctIndex } = buildMC(n, [n + 1, n - 1, target - 1, n + 2]);
        return {
          q: `What is the minimum number of straight cuts needed to produce exactly ${target} pieces from a single flat shape?`,
          options, correctIndex,
          hint: `Use the formula: max pieces from n cuts = 1 + n + n(n−1)/2. Try n = 1, 2, 3, ... until you find the first n where this equals ${target}.`,
          solution: {
            scenario: `Reverse the cuts formula: given pieces, find the minimum number of cuts.`,
            idea: `R(n) = 1 + n + n(n−1)/2. Find the smallest n where R(n) = ${target}.`,
            method: `R(${n}) = 1+${n}+${n*(n-1)/2} = ${target}. ✓`,
            steps: [`Try n = 1: R(1) = 2. n = 2: 4. n = 3: 7. Continue until R(n) = ${target}.`, `R(${n}) = ${target}: minimum ${n} cuts.`],
            check: `R(${n-1}) = ${maxPieces(n-1)} ≠ ${target} < R(${n}) = ${target}. ✓`,
          },
        };
      }
      if (sub === 1) {
        const punches = rand(2, 5), folds = rand(2, 4);
        const holes = punches * Math.pow(2, folds);
        const { options, correctIndex } = buildMC(folds, [folds + 1, folds - 1, holes / punches, punches]);
        return {
          q: `${nm} punched ${punches} holes through a folded piece of paper and found ${holes} holes when unfolded. How many times was the paper folded?`,
          options, correctIndex,
          hint: `Total holes = punches × 2^folds. Divide total by punches to get 2^folds, then find folds by asking: 2 to what power equals ${holes / punches}?`,
          solution: {
            scenario: `Reverse the fold-punch formula: given punches and total holes, find the number of folds.`,
            idea: `holes = punches × 2^folds. So 2^folds = holes ÷ punches = ${holes / punches}. Find the exponent.`,
            method: `2^folds = ${holes}÷${punches} = ${Math.pow(2, folds)}. folds = ${folds}.`,
            steps: [`holes = punches × 2^folds → 2^folds = ${holes}÷${punches} = ${Math.pow(2, folds)}.`, `2^${folds} = ${Math.pow(2, folds)} → ${folds} folds.`],
            check: `${punches} × 2^${folds} = ${punches} × ${Math.pow(2, folds)} = ${holes}. ✓`,
          },
        };
      }
      const bigW = rand(4, 8), bigH = rand(4, 8);
      const cut1W = rand(1, bigW - 1), cut1H = rand(1, bigH - 1);
      const cut2W = rand(1, cut1W), cut2H = rand(1, cut1H);
      const remaining2 = bigW * bigH - cut1W * cut1H - cut2W * cut2H;
      const half2 = remaining2 / 2;
      if (!Number.isInteger(half2)) return G.shapeFold(d);
      const { options, correctIndex } = buildMC(half2, [bigW * bigH / 2, remaining2, half2 + 2, half2 - 2]);
      return {
        q: `A ${bigW}×${bigH} rectangle has a ${cut1W}×${cut1H} notch cut from one corner and a ${cut2W}×${cut2H} notch cut from an adjacent corner. The remainder is split into two equal pieces. What is each piece's area in cm²?`,
        options, correctIndex,
        hint: `Calculate the total remaining area (full rectangle minus both notches). Then halve it.`,
        solution: {
          scenario: `Two subtractions then halving: compound shape with two notches.`,
          idea: `Remaining area = big − notch1 − notch2. Each piece = remaining ÷ 2.`,
          method: `${bigW*bigH} − ${cut1W*cut1H} − ${cut2W*cut2H} = ${remaining2}. ÷2 = ${half2}.`,
          steps: [`Full area = ${bigW*bigH}. Notch 1 = ${cut1W*cut1H}. Notch 2 = ${cut2W*cut2H}.`, `Remaining = ${remaining2}. Each piece = ${half2} cm².`],
          check: `2×${half2} = ${remaining2}. ✓`,
        },
      };
    }

    // d === 4
    const sub4 = rand(0, 2);
    if (sub4 === 0) {
      const folds = rand(2, 4), punches = rand(1, 3);
      const holesOnCrease = punches * Math.pow(2, folds - 1);
      const { options, correctIndex } = buildMC(holesOnCrease, [holesOnCrease * 2, punches * Math.pow(2, folds), punches, holesOnCrease + punches]);
      return {
        q: `${nm} folds paper ${folds} times in half (all in the same direction), then punches ${punches} hole${punches>1?"s":""} ON the crease line. How many holes does the crease line have when unfolded?`,
        options, correctIndex,
        hint: `Punching on the crease is a special case: the crease fold only doubles the hole count for folds that create additional layers crossing the crease. Effectively, a crease punch generates 2^(folds−1) holes rather than 2^folds, because the crease itself is shared between the two halves at the last fold.`,
        solution: {
          scenario: `Punch on the crease: fewer holes than an off-crease punch.`,
          idea: `A punch on the last crease passes through 2^(folds−1) layers (not 2^folds), because the crease itself is the fold line — only half the usual layers overlap at exactly that line.`,
          method: `Holes = punches × 2^(${folds}−1) = ${punches} × ${Math.pow(2, folds-1)} = ${holesOnCrease}.`,
          steps: [`Punching ON the crease: only 2^(folds−1) = ${Math.pow(2, folds-1)} layers at the crease.`, `${punches} × ${Math.pow(2, folds-1)} = ${holesOnCrease} holes.`],
          check: `Compare: off-crease punch would give ${punches}×${Math.pow(2, folds)} = ${punches * Math.pow(2, folds)}. Crease punch gives half of that = ${holesOnCrease}. ✓`,
        },
      };
    }
    if (sub4 === 1) {
      const target = rand(10, 22);
      let n = 1;
      while (maxPieces(n) < target) n++;
      const minCuts = n;
      const { options, correctIndex } = buildMC(minCuts, [minCuts + 1, minCuts - 1, target - 1, minCuts + 2]);
      return {
        q: `What is the minimum number of straight cuts needed to produce AT LEAST ${target} pieces from a single flat shape?`,
        options, correctIndex,
        hint: `R(n) = 1 + n + n(n−1)/2 gives the maximum pieces from n cuts. Find the smallest n where R(n) ≥ ${target}.`,
        solution: {
          scenario: `Find the minimum n such that R(n) ≥ ${target}.`,
          idea: `Try n = 1, 2, 3, ... until R(n) first reaches or exceeds ${target}.`,
          method: `R(${minCuts}) = ${maxPieces(minCuts)} ≥ ${target}. R(${minCuts-1}) = ${maxPieces(minCuts-1)} < ${target}.`,
          steps: [`R(${minCuts-1}) = ${maxPieces(minCuts-1)} < ${target}.`, `R(${minCuts}) = ${maxPieces(minCuts)} ≥ ${target}. So minimum = ${minCuts} cuts.`],
          check: `${minCuts} cuts needed; ${minCuts-1} not sufficient. ✓`,
        },
      };
    }
    const folds = rand(2, 3), punches = rand(2, 5);
    const givenHoles = punches * Math.pow(2, folds);
    const givenCreaseHoles = punches * Math.pow(2, folds - 1);
    const totalHoles = givenHoles + givenCreaseHoles;
    const { options, correctIndex } = buildMC(folds, [folds + 1, folds - 1, punches, totalHoles / punches]);
    return {
      q: `${nm} folded paper ${folds} times and made ${punches} holes off the crease AND ${punches} holes on the crease. When unfolded there were ${totalHoles} holes total. How many times was the paper folded?`,
      options, correctIndex,
      hint: `Off-crease holes = punches × 2^folds. On-crease holes = punches × 2^(folds−1). Total = punches × (2^folds + 2^(folds−1)) = punches × 3 × 2^(folds−1). Divide total by (3 × punches) to get 2^(folds−1), then find folds.`,
      solution: {
        scenario: `Reverse-solve for folds given total holes from both crease and off-crease punches.`,
        idea: `Total = off-crease + crease = punches×2^folds + punches×2^(folds−1) = 3×punches×2^(folds−1).`,
        method: `2^(folds−1) = ${totalHoles}÷(3×${punches}) = ${Math.pow(2, folds-1)}. folds = ${folds}.`,
        steps: [
          `Off-crease: ${punches}×2^f. On-crease: ${punches}×2^(f−1). Total = ${punches}×3×2^(f−1) = ${totalHoles}.`,
          `2^(f−1) = ${totalHoles}÷(${3*punches}) = ${Math.pow(2, folds-1)}, so f−1 = ${folds-1}, folds = ${folds}.`,
        ],
        check: `Off-crease: ${punches}×${Math.pow(2,folds)} = ${givenHoles}. On-crease: ${punches}×${Math.pow(2,folds-1)} = ${givenCreaseHoles}. Total = ${totalHoles}. ✓`,
      },
    };
  },
gridLogic(d) {
    // BASE grids and permutation relabelling
    const BASE3 = [[0,1,2],[1,2,0],[2,0,1]];
    const BASE4 = [[0,1,2,3],[2,3,0,1],[1,0,3,2],[3,2,1,0]];
    const relabel = (grid, perm) => grid.map(row => row.map(v => perm[v]));
    const shuffle3 = () => { const p=[0,1,2]; for(let i=2;i>0;i--){const j=rand(0,i);[p[i],p[j]]=[p[j],p[i]];} return p; };
    const shuffle4 = () => { const p=[0,1,2,3]; for(let i=3;i>0;i--){const j=rand(0,i);[p[i],p[j]]=[p[j],p[i]];} return p; };
    const nm = N1();

    const gridSvg3 = (G, blanks=[]) => {
      const S=56,M=10;
      let s=`<svg viewBox="0 0 ${3*S+2*M} ${3*S+2*M}" xmlns="http://www.w3.org/2000/svg">`;
      for(let r=0;r<3;r++) for(let c=0;c<3;c++){
        const x=M+c*S,y=M+r*S;
        const isBlank=blanks.some(([br,bc])=>br===r&&bc===c);
        s+=`<rect x="${x}" y="${y}" width="${S}" height="${S}" fill="${isBlank?"#ede9ff":"#f8f6ff"}" stroke="#7c5cff" stroke-width="1.5"/>`;
        if(!isBlank) s+=`<text x="${x+S/2}" y="${y+S/2+7}" text-anchor="middle" font-size="22" font-weight="700" fill="#2a1a5e">${G[r][c]}</text>`;
        else s+=`<text x="${x+S/2}" y="${y+S/2+7}" text-anchor="middle" font-size="22" font-weight="700" fill="#b0a0f8">?</text>`;
      }
      return s+`</svg>`;
    };
    const gridSvg4 = (G, blanks=[]) => {
      const S=50,M=10;
      let s=`<svg viewBox="0 0 ${4*S+2*M} ${4*S+2*M}" xmlns="http://www.w3.org/2000/svg">`;
      // draw 2×2 box borders
      for(let br=0;br<2;br++) for(let bc=0;bc<2;bc++)
        s+=`<rect x="${M+bc*2*S}" y="${M+br*2*S}" width="${2*S}" height="${2*S}" fill="none" stroke="#7c5cff" stroke-width="3"/>`;
      for(let r=0;r<4;r++) for(let c=0;c<4;c++){
        const x=M+c*S,y=M+r*S;
        const isBlank=blanks.some(([br,bc])=>br===r&&bc===c);
        s+=`<rect x="${x}" y="${y}" width="${S}" height="${S}" fill="${isBlank?"#ede9ff":"#f8f6ff"}" stroke="#9988cc" stroke-width="1"/>`;
        if(!isBlank) s+=`<text x="${x+S/2}" y="${y+S/2+7}" text-anchor="middle" font-size="20" font-weight="700" fill="#2a1a5e">${G[r][c]}</text>`;
        else s+=`<text x="${x+S/2}" y="${y+S/2+7}" text-anchor="middle" font-size="20" font-weight="700" fill="#b0a0f8">?</text>`;
      }
      return s+`</svg>`;
    };

    if (d <= 1) {
      const G = relabel(BASE3, shuffle3());
      const sym = [..."ABCDEFGHIJ"].slice(0, 3);
      // Three tiers of d≤1: row-only, row+col, col+row
      const sub = rand(0, 2);
      let br, bc, ans, svg, hintStr;
      if (sub === 0) {
        // Direct row elimination
        br = rand(0, 2); bc = rand(0, 2);
        ans = G[br][bc];
        svg = gridSvg3(G, [[br, bc]]);
        const rowVals = G[br].filter((_, i) => i !== bc);
        hintStr = `Look at the row containing the blank. Every row uses each symbol exactly once. The row already shows ${rowVals.join(" and ")} — the only remaining symbol is the answer.`;
      } else if (sub === 1) {
        // Row says two options; column disambiguates
        br = rand(0, 2); bc = rand(0, 2);
        ans = G[br][bc];
        svg = gridSvg3(G, [[br, bc]]);
        const colVals = G.map(r => r[bc]).filter((_, i) => i !== br);
        hintStr = `Check the row — it might not be fully resolved. Then check the column: every column also uses each symbol exactly once. The column already has ${colVals.join(" and ")}, which rules out those values.`;
      } else {
        br = rand(0, 2); bc = rand(0, 2);
        ans = G[br][bc];
        svg = gridSvg3(G, [[br, bc]]);
        hintStr = `Each row and each column uses every symbol exactly once. Eliminate the symbols already present in the blank's row, then check the column to confirm or narrow down further.`;
      }
      const distractors = [0,1,2].map(v=>G[0][v]).filter(v=>v!==ans);
      const { options, correctIndex } = buildMC(ans, distractors);
      return {
        q: `${svg}This 3×3 grid uses three symbols. Each row and each column contains each symbol exactly once. What goes in the blank cell?`,
        options, correctIndex,
        hint: hintStr,
        solution: {
          scenario: `Fill the blank in a 3×3 Latin-square grid.`,
          idea: `Each symbol appears once per row and once per column. Eliminate symbols already present in the blank's row and column.`,
          method: `Row has: ${G[br].filter((_,i)=>i!==bc).join(", ")}. Column has: ${G.map(r=>r[bc]).filter((_,i)=>i!==br).join(", ")}. Remaining: ${ans}.`,
          steps: [`Blank is in row ${br+1}, column ${bc+1}.`, `Row already has: ${G[br].filter((_,i)=>i!==bc).join(", ")}.`, `Column already has: ${G.map(r=>r[bc]).filter((_,i)=>i!==br).join(", ")}.`, `Only ${ans} is left.`],
          check: `Row ${br+1}: ${G[br].join(", ")} — all three distinct. Column ${bc+1}: ${G.map(r=>r[bc]).join(", ")} — all three distinct. ✓`,
        },
      };
    }

    if (d === 2) {
      const G = relabel(BASE4, shuffle4());
      const sub = rand(0, 2);
      let br, bc, ans, svg, hintStr;
      if (sub === 0) {
        br = rand(0, 3); bc = rand(0, 3);
        ans = G[br][bc];
        svg = gridSvg4(G, [[br, bc]]);
        const rowVals = G[br].filter((_, i) => i !== bc);
        hintStr = `In a 4×4 grid, each symbol appears once per row and once per column. The blank's row already has ${rowVals.join(", ")} — only one symbol is left.`;
      } else if (sub === 1) {
        br = rand(0, 3); bc = rand(0, 3);
        ans = G[br][bc];
        svg = gridSvg4(G, [[br, bc]]);
        // Box completion
        const boxR = Math.floor(br / 2) * 2, boxC = Math.floor(bc / 2) * 2;
        const boxVals = [];
        for(let r=boxR;r<boxR+2;r++) for(let c=boxC;c<boxC+2;c++) if(r!==br||c!==bc) boxVals.push(G[r][c]);
        hintStr = `If the row alone isn't conclusive, check the 2×2 box containing the blank. Each 2×2 box also uses every symbol exactly once. The box already has ${boxVals.join(", ")}.`;
      } else {
        br = rand(0, 3); bc = rand(0, 3);
        ans = G[br][bc];
        svg = gridSvg4(G, [[br, bc]]);
        const boxR = Math.floor(br / 2) * 2, boxC = Math.floor(bc / 2) * 2;
        const boxVals = [];
        for(let r=boxR;r<boxR+2;r++) for(let c=boxC;c<boxC+2;c++) if(r!==br||c!==bc) boxVals.push(G[r][c]);
        hintStr = `Use the 2×2 box: it already has ${boxVals.join(", ")}. Together with the row and column, this identifies the blank uniquely.`;
      }
      const distractors = [0,1,2,3].map(v=>G[0][v]).filter(v=>v!==ans).slice(0,4);
      const { options, correctIndex } = buildMC(ans, distractors);
      return {
        q: `${svg}This 4×4 grid uses four symbols. Each row, column, and 2×2 box contains each symbol exactly once. What goes in the blank?`,
        options, correctIndex,
        hint: hintStr,
        solution: {
          scenario: `Fill the blank in a 4×4 mini-Sudoku grid.`,
          idea: `Three constraints: each symbol appears once per row, once per column, and once per 2×2 box. Eliminate using whichever is most restrictive.`,
          method: `Eliminate from row, column, and box. Intersection leaves only ${ans}.`,
          steps: [`Blank at row ${br+1}, col ${bc+1}.`, `Row has: ${G[br].filter((_,i)=>i!==bc).join(", ")}.`, `Column has: ${G.map(r=>r[bc]).filter((_,i)=>i!==br).join(", ")}.`, `Only ${ans} remains.`],
          check: `Row, column, and box each contain ${ans} exactly once (after filling). ✓`,
        },
      };
    }

    if (d === 3) {
      const G = relabel(BASE4, shuffle4());
      const sub = rand(0, 2);
      if (sub === 0) {
        // Two-blank chain: find helper via row, use it for column
        const br1 = rand(0, 3), bc1 = rand(0, 3);
        const br2 = rand(0, 3), bc2 = bc1; // same column
        if (br1 === br2) return JUNIOR_G.gridLogic(d);
        const ans1 = G[br1][bc1], ans2 = G[br2][bc2];
        const svg = gridSvg4(G, [[br1,bc1],[br2,bc2]]);
        const { options, correctIndex } = buildMC(ans2, [0,1,2,3].filter(v=>v!==ans2).slice(0,4).map(v=>G[0][v]));
        return {
          q: `${svg}Two cells are blank (same column). What goes in the LOWER blank?`,
          options, correctIndex,
          hint: `Find the upper blank first using its row alone. Then use the column (with the upper blank now known) to determine the lower blank.`,
          solution: {
            scenario: `Two-blank chain in a 4×4 mini-Sudoku: solve upper via row, then lower via column.`,
            idea: `Chain: first blank is uniquely determined by its row. Once filled in, the column has only one unknown left — the second blank.`,
            method: `Upper blank: row ${br1+1} determines it = ${ans1}. Then column ${bc1+1} with ${ans1} known → lower = ${ans2}.`,
            steps: [`Upper blank (row ${br1+1}): row has ${G[br1].filter((_,i)=>i!==bc1).join(", ")} → upper = ${ans1}.`, `Column ${bc1+1} now has all but lower blank: lower = ${ans2}.`],
            check: `Column ${bc1+1}: ${G.map(r=>r[bc1]).join(", ")} — all four distinct. ✓`,
          },
        };
      }
      if (sub === 1) {
        // Count candidates before box constraint
        const br = rand(0, 3), bc = rand(0, 3);
        const ans = G[br][bc];
        const rowExclude = new Set(G[br].filter((_,i)=>i!==bc));
        const colExclude = new Set(G.map(r=>r[bc]).filter((_,i)=>i!==br));
        const candidates = [0,1,2,3].filter(v=>!rowExclude.has(v)&&!colExclude.has(v));
        const boxR = Math.floor(br/2)*2, boxC = Math.floor(bc/2)*2;
        const boxExclude = new Set();
        for(let r=boxR;r<boxR+2;r++) for(let c=boxC;c<boxC+2;c++) if(r!==br||c!==bc) boxExclude.add(G[r][c]);
        const finalCandidates = candidates.filter(v=>!boxExclude.has(v));
        const { options, correctIndex } = buildMC(candidates.length, [1,2,3,4].filter(v=>v!==candidates.length).slice(0,4));
        const svg = gridSvg4(G, [[br,bc]]);
        return {
          q: `${svg}Without using the 2×2 box constraint, how many candidates remain for the blank cell (using only row and column elimination)?`,
          options, correctIndex,
          hint: `Eliminate symbols already in the blank's row, then eliminate symbols already in the blank's column. Count what's left — these are the candidates before the box rule narrows it further.`,
          solution: {
            scenario: `Count candidates after row and column elimination only (before box constraint).`,
            idea: `Row eliminates ${[...rowExclude].join(", ")}. Column eliminates ${[...colExclude].join(", ")}. Intersection gives candidates.`,
            method: `After row+col elimination: ${candidates.join(", ")} — ${candidates.length} candidate${candidates.length!==1?"s":""}.`,
            steps: [`Row ${br+1} has: ${[...rowExclude].join(", ")}.`, `Column ${bc+1} has: ${[...colExclude].join(", ")}.`, `Remaining: ${candidates.join(", ")} (${candidates.length} value${candidates.length!==1?"s":""}).`],
            check: `Adding the box constraint removes ${[...boxExclude].filter(v=>candidates.includes(v)).join(", ")}, leaving just ${ans}. ✓`,
          },
        };
      }
      // Grand total 40 identity
      const grandTotal = G.flat().reduce((a,v)=>a+v,0);
      const { options, correctIndex } = buildMC(grandTotal, [grandTotal+4,grandTotal-4,16,grandTotal+8]);
      const svg = gridSvg4(G, []);
      return {
        q: `${svg}In a 4×4 grid where each symbol appears once per row and once per column, and the four symbols are ${[...new Set(G[0])].join(", ")}, what is the total of ALL 16 cells?`,
        options, correctIndex,
        hint: `Each symbol appears in every row exactly once. So each row sums to the same value (the sum of all four distinct symbols). The grand total is 4 × (row sum) = 4 × (sum of all four symbols).`,
        solution: {
          scenario: `Grand total of all entries in a 4×4 Latin square.`,
          idea: `Each row contains each symbol exactly once → each row sums to ${[...new Set(G[0])].reduce((a,v)=>a+v,0)}. Grand total = 4 × row sum.`,
          method: `Symbol sum = ${[...new Set(G[0])].reduce((a,v)=>a+v,0)}. Grand total = 4 × ${[...new Set(G[0])].reduce((a,v)=>a+v,0)} = ${grandTotal}.`,
          steps: [`Each row uses each symbol once, so each row sums to ${[...new Set(G[0])].reduce((a,v)=>a+v,0)}.`, `Grand total = 4 rows × ${[...new Set(G[0])].reduce((a,v)=>a+v,0)} = ${grandTotal}.`],
          check: `Sum all 16 cells: ${grandTotal}. ✓`,
        },
      };
    }

    // d === 4
    const G = relabel(BASE4, shuffle4());
    const sub4 = rand(0, 2);
    if (sub4 === 0) {
      // Row-fact + solved helper + box all needed
      const br = rand(0, 3), bc = rand(0, 3);
      const ans = G[br][bc];
      const svg = gridSvg4(G, [[br,bc]]);
      const { options, correctIndex } = buildMC(ans, [0,1,2,3].filter(v=>v!==ans).slice(0,4).map(v=>G[0][v]));
      return {
        q: `${svg}Three constraints are needed here: row, column, AND box. What goes in the blank?`,
        options, correctIndex,
        hint: `Apply all three constraints: row, column, and 2×2 box. Only one symbol will survive all three eliminations.`,
        solution: {
          scenario: `Fill a blank requiring all three constraints: row, column, and box.`,
          idea: `Take the intersection of what's not in the row, not in the column, and not in the box.`,
          method: `Row excludes: ${[...new Set(G[br].filter((_,i)=>i!==bc))].join(", ")}. Col excludes: ${[...new Set(G.map(r=>r[bc]).filter((_,i)=>i!==br))].join(", ")}. Box adds further exclusions. Remaining: ${ans}.`,
          steps: [`Row ${br+1}: has ${G[br].filter((_,i)=>i!==bc).join(", ")}.`, `Column ${bc+1}: has ${G.map(r=>r[bc]).filter((_,i)=>i!==br).join(", ")}.`, `Box also rules out some — only ${ans} survives all three constraints.`],
          check: `${ans} not in row, not in column, not in box elsewhere → unique. ✓`,
        },
      };
    }
    if (sub4 === 1) {
      // Three-link chain b→a→?
      const bc0 = rand(0,3), br1 = rand(0,3), br2 = rand(0,3);
      if (br1 === br2) return JUNIOR_G.gridLogic(d);
      const bc2 = (bc0+1)%4;
      const ans = G[br2][bc2];
      const svg = gridSvg4(G, [[br1,bc0],[br2,bc2]]);
      const { options, correctIndex } = buildMC(ans, [0,1,2,3].filter(v=>v!==ans).slice(0,4).map(v=>G[0][v]));
      return {
        q: `${svg}Two cells are blank. Solve for the SECOND blank (bottom-right of the pair).`,
        options, correctIndex,
        hint: `A three-link chain: use the first blank's row to find it, which unlocks information for the second blank's column or box. Solve step by step.`,
        solution: {
          scenario: `Three-link chain: first blank enables second through a shared column or box.`,
          idea: `Find the first blank via its row. Its value then completes the column (or box) information needed for the second blank.`,
          method: `Step 1: row ${br1+1} → first blank = ${G[br1][bc0]}. Step 2: column/box now determines second blank = ${ans}.`,
          steps: [`First blank (row ${br1+1}): row has ${G[br1].filter((_,i)=>i!==bc0).join(", ")} → value = ${G[br1][bc0]}.`, `Now use column/box for second blank → value = ${ans}.`],
          check: `Both blanks filled: row/column/box constraints all satisfied. ✓`,
        },
      };
    }
    // Simultaneous blanks same row
    const br = rand(0,3);
    const twoPos = shuffle([0,1,2,3]).slice(0,2);
    const [bc1_, bc2_] = twoPos;
    const ans1_ = G[br][bc1_], ans2_ = G[br][bc2_];
    const svg = gridSvg4(G, [[br,bc1_],[br,bc2_]]);
    const { options, correctIndex } = buildMC(Math.max(ans1_,ans2_), [0,1,2,3].filter(v=>v!==Math.max(ans1_,ans2_)).slice(0,4).map(v=>G[0][v]));
    return {
      q: `${svg}Two blanks share a row. Use a column hint to find the LARGER of the two missing values.`,
      options, correctIndex,
      hint: `The row already gives you the two missing symbols (subtract the known ones from the full set). To tell them apart, check the column of each blank — one column will already contain one of the candidates, ruling it out for that position.`,
      solution: {
        scenario: `Two blanks in the same row disambiguated by column constraints.`,
        idea: `Row gives two candidates. Columns assign them to specific positions. The larger is the answer.`,
        method: `Row candidates: the two missing symbols. Column check assigns them. Larger = ${Math.max(ans1_,ans2_)}.`,
        steps: [`Row ${br+1} is missing ${ans1_} and ${ans2_}.`, `Column ${bc1_+1} already has ${G.map(r=>r[bc1_]).filter((_,i)=>i!==br).join(", ")} — use this to assign.`, `Larger of the two = ${Math.max(ans1_,ans2_)}.`],
        check: `Both blanks filled consistently with their rows, columns, and boxes. ✓`,
      },
    };
  },
networkGraph(d) {
    const C2 = (n) => n * (n - 1) / 2;
    const nm = N1();

    // SVG helpers
    const nodesOnCircle = (n, cx, cy, r, labels) => {
      const pts = Array.from({length:n},(_,i)=>{const a=i*2*Math.PI/n-Math.PI/2; return [cx+r*Math.cos(a),cy+r*Math.sin(a)];});
      let s="";
      pts.forEach(([x,y],i)=>{
        s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12" fill="#7c5cff" stroke="#fff" stroke-width="2"/>`;
        s+=`<text x="${x.toFixed(1)}" y="${(y+5).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">${labels?labels[i]:i+1}</text>`;
      });
      return {pts,s};
    };
    const completeGraph = (n,cx,cy,r,labels) => {
      const {pts,s:ns}=nodesOnCircle(n,cx,cy,r,labels);
      let es="";
      for(let i=0;i<n;i++) for(let j=i+1;j<n;j++)
        es+=`<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[j][0].toFixed(1)}" y2="${pts[j][1].toFixed(1)}" stroke="#7c5cff" stroke-width="1.5" opacity="0.5"/>`;
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${es}${ns}</svg>`;
    };
    const cycleGraph = (n,cx,cy,r,labels) => {
      const {pts,s:ns}=nodesOnCircle(n,cx,cy,r,labels);
      let es="";
      for(let i=0;i<n;i++) es+=`<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[(i+1)%n][0].toFixed(1)}" y2="${pts[(i+1)%n][1].toFixed(1)}" stroke="#7c5cff" stroke-width="2"/>`;
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${es}${ns}</svg>`;
    };
    const pathGraph = (n,cx,cy,r,labels) => {
      const {pts,s:ns}=nodesOnCircle(n,cx,cy,r,labels);
      let es="";
      for(let i=0;i<n-1;i++) es+=`<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[i+1][0].toFixed(1)}" y2="${pts[i+1][1].toFixed(1)}" stroke="#7c5cff" stroke-width="2"/>`;
      return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${es}${ns}</svg>`;
    };
    const clustersSvg = (groups) => {
      const W=240,H=180;
      let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
      let cx=40;
      for(const g of groups){
        const gy=H/2, r=25;
        if(g===1){
          s+=`<circle cx="${cx}" cy="${gy}" r="12" fill="#7c5cff" stroke="#fff" stroke-width="2"/>`;
          cx+=50; continue;
        }
        const pts=Array.from({length:g},(_,i)=>{const a=i*2*Math.PI/g-Math.PI/2;return [cx+r*Math.cos(a),gy+r*Math.sin(a)];});
        for(let i=0;i<g;i++) for(let j=i+1;j<g;j++)
          s+=`<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[j][0].toFixed(1)}" y2="${pts[j][1].toFixed(1)}" stroke="#7c5cff" stroke-width="1.5" opacity="0.5"/>`;
        pts.forEach(([x,y])=>s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="#7c5cff" stroke="#fff" stroke-width="2"/>`);
        cx+=60;
      }
      return s+`</svg>`;
    };

    if (d <= 1) {
      const sub = rand(0, 2);
      if (sub === 0) {
        const n = rand(5, 10);
        const total = C2(n);
        const { options, correctIndex } = buildMC(total, [total + n, total - n, n, total + 1]);
        return {
          q: `${completeGraph(n,100,100,75)}${n} people are at a party. Each person shakes hands with every other person exactly once. How many handshakes take place in total?`,
          options, correctIndex,
          hint: `Each of the ${n} people shakes hands with ${n-1} others, giving ${n}×${n-1} = ${n*(n-1)} hand-shakes counted — but each handshake is counted twice (once for each person). Divide by 2: ${n}×${n-1}÷2 = ${total}.`,
          solution: {
            scenario: `Counting handshakes among ${n} people — every pair meets once.`,
            idea: `The handshake formula is n(n−1)÷2. It counts pairs, not individual handshakes.`,
            method: `C(${n}) = ${n}×${n-1}÷2 = ${total}.`,
            steps: [`${n} people each shake ${n-1} hands = ${n*(n-1)} total shakes (double-counted).`, `Divide by 2: ${n*(n-1)}÷2 = ${total} handshakes.`],
            check: `C(${n}) = ${total}. ✓`,
          },
        };
      }
      if (sub === 1) {
        const groups = Array.from({length:rand(3,5)},()=>rand(1,3));
        const k = groups.length;
        const needed = k - 1;
        const { options, correctIndex } = buildMC(needed, [needed + 1, k, needed - 1, groups.reduce((a,b)=>a+b,0) - 1]);
        return {
          q: `${clustersSvg(groups)}There are ${k} separate groups of computers (some groups have more than one computer but they are already connected within each group). What is the minimum number of new cables needed to connect all groups into one network?`,
          options, correctIndex,
          hint: `Each new cable can join exactly two currently separate groups into one. Starting from ${k} groups, each cable reduces the group count by 1. To go from ${k} groups to 1 group takes exactly ${k-1} cables.`,
          solution: {
            scenario: `Minimum cables to connect ${k} disconnected groups.`,
            idea: `Each cable merges two groups: (groups − 1) cables reduce ${k} groups to 1. The minimum is always (groups − 1).`,
            method: `${k} − 1 = ${needed} cables.`,
            steps: [`Each cable joins two separate groups into one, reducing the group count by 1.`, `To go from ${k} groups to 1: need ${k}−1 = ${needed} cables.`],
            check: `${needed} cables, each reducing groups by 1: ${k} → 1. ✓`,
          },
        };
      }
      const n2 = rand(4, 8);
      const isEven = n2 % 2 === 0;
      const chromatic = isEven ? 2 : 3;
      const { options, correctIndex } = buildMC(chromatic, [chromatic + 1, isEven ? 3 : 2, n2, 1]);
      return {
        q: `${cycleGraph(n2,100,100,75)}What is the minimum number of colours needed to colour the nodes of this cycle graph with ${n2} nodes, so that no two adjacent nodes have the same colour?`,
        options, correctIndex,
        hint: `In a cycle, every node is connected to its two neighbours. If the cycle has an even number of nodes, you can alternate two colours around the ring. If odd, you need a third colour (try it: you will find the last node clashes with the first).`,
        solution: {
          scenario: `Chromatic number of a cycle graph with ${n2} nodes.`,
          idea: `Even cycles are 2-colourable (bipartite); odd cycles need 3 colours.`,
          method: `${n2} is ${isEven?"even → 2 colours":"odd → 3 colours"}.`,
          steps: [`A cycle with ${n2} nodes: ${isEven?"alternate two colours around the ring — the last node matches back to the first colour cleanly":"trying to alternate two colours, the last node ends up adjacent to the first, creating a clash — a third colour is needed"}.`, `Minimum colours: ${chromatic}.`],
          check: `${n2} ${isEven?"even":"odd"} → chromatic number = ${chromatic}. ✓`,
        },
      };
    }

    if (d === 2) {
      const sub = rand(0, 2);
      if (sub === 0) {
        const total = C2(rand(5, 12));
        let n = 2;
        while (C2(n) < total) n++;
        if (C2(n) !== total) return G.networkGraph(d);
        const { options, correctIndex } = buildMC(n, [n + 1, n - 1, total / (n - 1), total]);
        return {
          q: `At a tournament, ${total} games are played and every team plays every other team exactly once. How many teams are there?`,
          options, correctIndex,
          hint: `The total games equals n(n−1)÷2. Set this equal to ${total} and solve for n. You can try values of n until you find n(n−1)÷2 = ${total}.`,
          solution: {
            scenario: `Reverse the handshake formula: given total games, find n.`,
            idea: `n(n−1)÷2 = ${total}. Try n = 2, 3, 4, ... until the formula matches.`,
            method: `n(n−1) = ${2*total}. Factors: ${n}×${n-1} = ${n*(n-1)} ✓. n = ${n}.`,
            steps: [`n(n−1)÷2 = ${total} → n(n−1) = ${2*total}.`, `Try n = ${n}: ${n}×${n-1} = ${n*(n-1)} = ${2*total}. ✓`, `There are ${n} teams.`],
            check: `C(${n}) = ${n*(n-1)/2} = ${total}. ✓`,
          },
        };
      }
      if (sub === 1) {
        const bigGroup = rand(4, 7), smallGroup = rand(2, 3);
        const totalNodes = bigGroup + smallGroup;
        const edges = C2(bigGroup) + C2(smallGroup);
        const { options, correctIndex } = buildMC(edges, [C2(totalNodes), edges + 2, edges - 2, bigGroup + smallGroup]);
        return {
          q: `${clustersSvg([bigGroup, smallGroup])}Two separate cliques of ${bigGroup} and ${smallGroup} computers (each group fully connected within itself) are not yet joined. How many cables are there altogether?`,
          options, correctIndex,
          hint: `Count the cables inside each group separately using n(n−1)÷2, then add. Do NOT use the total number of computers as if they were one big group — the two groups have no cables between them.`,
          solution: {
            scenario: `Total cables in two disconnected cliques — the group SIZE determines edge count, not total nodes.`,
            idea: `Cables = C(${bigGroup}) + C(${smallGroup}). The inter-group cables don't exist yet.`,
            method: `C(${bigGroup}) = ${C2(bigGroup)}. C(${smallGroup}) = ${C2(smallGroup)}. Total = ${edges}.`,
            steps: [`Group 1 (${bigGroup} nodes): C(${bigGroup}) = ${C2(bigGroup)} cables.`, `Group 2 (${smallGroup} nodes): C(${smallGroup}) = ${C2(smallGroup)} cables.`, `Total = ${edges} cables.`],
            check: `${C2(bigGroup)} + ${C2(smallGroup)} = ${edges}. ✓`,
          },
        };
      }
      const n3 = rand(4, 10);
      const chromatic3 = n3;
      const { options, correctIndex } = buildMC(chromatic3, [chromatic3 + 1, chromatic3 - 1, 2, 3]);
      return {
        q: `${completeGraph(n3,100,100,75)}In a complete graph with ${n3} nodes (every node connected to every other), what is the chromatic number (minimum colours to colour nodes so no two adjacent nodes match)?`,
        options, correctIndex,
        hint: `In a complete graph, every node is directly connected to every other node. Each node is adjacent to all others, so no two nodes can share a colour. You need exactly as many colours as there are nodes.`,
        solution: {
          scenario: `Chromatic number of a complete graph K_n.`,
          idea: `In K_n, every pair is adjacent. All n nodes must have different colours. Chromatic number = n.`,
          method: `K_${n3} requires ${n3} colours.`,
          steps: [`Every node is adjacent to every other in K_${n3}.`, `No two nodes can share a colour → need at least ${n3} colours.`, `Chromatic number = ${n3}.`],
          check: `n = ${n3} nodes, all pairwise adjacent → chromatic = ${n3}. ✓`,
        },
      };
    }

    if (d === 3) {
      const sub = rand(0, 2);
      if (sub === 0) {
        const isCycle = rand(0,1)===0;
        const n4 = rand(4,7);
        const cutsNeeded = isCycle ? 2 : 1;
        const { options, correctIndex } = buildMC(cutsNeeded, [cutsNeeded+1, cutsNeeded-1>0?cutsNeeded-1:cutsNeeded+2, n4-1, n4]);
        const svg = isCycle ? cycleGraph(n4,100,100,75) : pathGraph(n4,100,100,75);
        return {
          q: `${svg}What is the minimum number of edges (cables) you must remove to disconnect this ${isCycle?"cycle":"path"} graph?`,
          options, correctIndex,
          hint: `${isCycle ? `A cycle is a ring — it has two independent paths between any two nodes. To disconnect it, you need to break BOTH paths simultaneously, which requires removing at least 2 edges.` : `A path is a chain — there is only ONE path between any two nodes. Remove any single edge and the chain is broken.`}`,
          solution: {
            scenario: `Edge connectivity of a ${isCycle?"cycle":"path"} graph.`,
            idea: isCycle ? `A cycle has two disjoint paths between any pair of nodes — both must be cut to disconnect it.` : `A path has exactly one path between each pair — one cut disconnects it.`,
            method: `${isCycle?"Cycle: 2 cuts needed.":"Path: 1 cut needed."}`,
            steps: isCycle ? [`A cycle of ${n4} nodes: any two nodes can communicate via two routes (clockwise and anticlockwise).`, `Both routes must be cut → minimum 2 edge removals.`] : [`A path of ${n4} nodes: only one route between any two nodes.`, `Remove any single edge → disconnected. Minimum = 1.`],
            check: `${isCycle?"Cycle":"Path"} graph edge connectivity = ${cutsNeeded}. ✓`,
          },
        };
      }
      if (sub === 1) {
        const g1 = rand(2,4), g2 = rand(2,4);
        const totalEdges = C2(g1) + C2(g2) + 1; // one connector between groups
        const { options, correctIndex } = buildMC(totalEdges, [C2(g1+g2), totalEdges+1, totalEdges-1, g1+g2-1]);
        return {
          q: `${clustersSvg([g1,g2])}Two fully-connected groups of ${g1} and ${g2} computers are joined by a single cable between them. How many cables are there in total?`,
          options, correctIndex,
          hint: `Count within-group cables for each group using n(n−1)÷2, then add the single connecting cable.`,
          solution: {
            scenario: `Two cliques joined by one bridge edge — total edge count.`,
            idea: `Total = C(${g1}) + C(${g2}) + 1 (the bridge).`,
            method: `C(${g1}) + C(${g2}) + 1 = ${C2(g1)} + ${C2(g2)} + 1 = ${totalEdges}.`,
            steps: [`Group 1 (${g1} nodes): ${C2(g1)} cables.`, `Group 2 (${g2} nodes): ${C2(g2)} cables.`, `Bridge: 1 cable.`, `Total = ${totalEdges}.`],
            check: `${C2(g1)} + ${C2(g2)} + 1 = ${totalEdges}. ✓`,
          },
        };
      }
      const n5 = rand(5, 9);
      const isOdd = n5 % 2 !== 0;
      const chromatic5 = isOdd ? 3 : 2;
      const { options, correctIndex } = buildMC(n5, [n5+1, n5-1, chromatic5, 2]);
      return {
        q: `A cycle graph has chromatic number 3. How many nodes does it have, given that it is the smallest such cycle?`,
        options, correctIndex,
        hint: `Cycles with an ODD number of nodes need 3 colours; even cycles need only 2. The smallest odd cycle has 3 nodes — but 3 is a triangle (trivially 3-chromatic). The question asks for the cycle that becomes 3-chromatic because it is odd, starting from the smallest: 3, 5, 7, ...`,
        solution: {
          scenario: `Chromatic 3 → must be an odd cycle. Smallest odd cycle = 3 nodes.`,
          idea: `Odd cycles need 3 colours; even cycles need 2. Chromatic = 3 → n is odd.`,
          method: `Smallest odd n with chromatic 3 is 3 (triangle). General odd n ≥ 3 also has chromatic 3.`,
          steps: [`Chromatic = 3 → odd cycle.`, `The smallest odd cycle is n = 3 (triangle).`],
          check: `C_3 (triangle): each node adjacent to both others, needs 3 colours. ✓`,
        },
      };
    }

    // d === 4
    const sub4 = rand(0, 2);
    if (sub4 === 0) {
      const groups = [rand(2,4), rand(2,4), rand(1,3)];
      const loneNodes = rand(1,3);
      const totalComponents = groups.length + loneNodes;
      const cablesNeeded = totalComponents - 1;
      const { options, correctIndex } = buildMC(cablesNeeded, [cablesNeeded+1, groups.length-1, groups.reduce((a,b)=>a+b,0)-1, totalComponents]);
      return {
        q: `${clustersSvg([...groups,...Array(loneNodes).fill(1)])}A network has ${groups.length} connected groups (of sizes ${groups.join(", ")}) and ${loneNodes} isolated computer${loneNodes>1?"s":""}. What is the minimum number of new cables needed to connect everything?`,
        options, correctIndex,
        hint: `Count the total number of separate components (connected groups AND isolated computers). The minimum cables to unite them all is always (total components − 1), regardless of component size.`,
        solution: {
          scenario: `Mixed components (cliques + lone nodes) — minimum cables to connect all.`,
          idea: `Total components = groups + isolated nodes = ${totalComponents}. Min cables = components − 1.`,
          method: `${totalComponents} − 1 = ${cablesNeeded}.`,
          steps: [`Total separate components: ${groups.length} groups + ${loneNodes} isolated = ${totalComponents}.`, `Minimum cables = ${totalComponents} − 1 = ${cablesNeeded}.`],
          check: `Each cable merges two components; need ${cablesNeeded} to reduce from ${totalComponents} to 1. ✓`,
        },
      };
    }
    if (sub4 === 1) {
      const n6 = rand(5,9);
      const reduce = rand(1,3);
      const removed = n6 * reduce / 2;
      if (!Number.isInteger(removed)) return G.networkGraph(d);
      const remaining = C2(n6) - removed;
      const { options, correctIndex } = buildMC(remaining, [remaining+reduce, remaining-reduce, C2(n6), removed]);
      return {
        q: `In a complete graph with ${n6} nodes, every node's degree is reduced by ${reduce} (by removing edges). Assuming each removed edge reduces exactly two nodes' degrees, how many edges remain?`,
        options, correctIndex,
        hint: `A complete graph K_${n6} has ${C2(n6)} edges. Reducing every node's degree by ${reduce} removes a total of (n × reduce ÷ 2) edges (each edge contributes to two nodes' degrees). Subtract from the original total.`,
        solution: {
          scenario: `Degree reduction → edges removed from a complete graph.`,
          idea: `Reducing n nodes' degrees each by ${reduce} removes n×${reduce}÷2 = ${removed} edges total.`,
          method: `${C2(n6)} − ${removed} = ${remaining}.`,
          steps: [`K_${n6} has ${C2(n6)} edges.`, `Each removed edge reduces two nodes' degrees by 1. To reduce all ${n6} nodes by ${reduce}: remove ${n6}×${reduce}÷2 = ${removed} edges.`, `Remaining = ${C2(n6)} − ${removed} = ${remaining}.`],
          check: `${C2(n6)} − ${removed} = ${remaining}. ✓`,
        },
      };
    }
    const n7 = rand(5,9);
    const half = Math.floor(n7/2), otherHalf = n7 - half;
    const crossEdges = half * otherHalf;
    const { options, correctIndex } = buildMC(crossEdges, [crossEdges+half, crossEdges-1, C2(n7), half*half]);
    return {
      q: `${cycleGraph(n7,100,100,75)}A ${n7}-node graph is to be 2-coloured as evenly as possible (${half} nodes one colour, ${otherHalf} the other). What is the maximum number of edges between the two colour classes?`,
      options, correctIndex,
      hint: `In a 2-colouring, edges WITHIN a colour class are forbidden (those would connect same-colour nodes). To maximise cross-colour edges, split the nodes as evenly as possible. Maximum cross-edges = (nodes of colour 1) × (nodes of colour 2).`,
      solution: {
        scenario: `Maximum bipartite edges from an even 2-split of ${n7} nodes.`,
        idea: `A complete bipartite graph with parts of sizes a and b has a×b edges. Split ${n7} as evenly as possible: ${half} and ${otherHalf}.`,
        method: `${half} × ${otherHalf} = ${crossEdges}.`,
        steps: [`Split ${n7} nodes as evenly as possible: ${half} and ${otherHalf}.`, `Maximum cross-edges = ${half} × ${otherHalf} = ${crossEdges}.`],
        check: `${half} × ${otherHalf} = ${crossEdges}. ✓`,
      },
    };
  },
spatialTransform(d) {
    const nm = N1();

    // Cube net: Latin-cross positions and opposite faces
    const NET_POS = {
      top:[1,0], left:[0,1], front:[1,1], right:[2,1], back:[3,1], bottom:[1,2]
    };
    const OPPOSITE_OF = { top:"bottom", bottom:"top", left:"right", right:"left", front:"back", back:"front" };

    // Named shapes
    const NAMED_SHAPES = [
      {name:"equilateral triangle",sides:3,lines:3,order:3},
      {name:"square",sides:4,lines:4,order:4},
      {name:"regular pentagon",sides:5,lines:5,order:5},
      {name:"regular hexagon",sides:6,lines:6,order:6},
      {name:"rectangle (non-square)",sides:4,lines:2,order:2},
      {name:"isosceles triangle (non-equilateral)",sides:3,lines:1,order:1},
      {name:"scalene triangle",sides:3,lines:0,order:1},
      {name:"regular octagon",sides:8,lines:8,order:8},
      {name:"rhombus (non-square)",sides:4,lines:2,order:2},
      {name:"kite",sides:4,lines:1,order:1},
      {name:"parallelogram (non-rhombus)",sides:4,lines:0,order:2},
    ];

    const isCyclicRotation = (a, b) => {
      if (a.length !== b.length) return false;
      return (a + a).includes(b);
    };

    if (d <= 1) {
      const sub = rand(0, 2);
      if (sub === 0) {
        // Lines of symmetry for a regular polygon
        const shape = pick(NAMED_SHAPES.filter(s => s.order === s.sides));
        const { options, correctIndex } = buildMC(shape.lines, [shape.lines + 1, shape.lines - 1, shape.order, shape.sides + 1]);
        return {
          q: `How many lines of symmetry does a ${shape.name} have?`,
          options, correctIndex,
          hint: `For a regular polygon (all sides equal, all angles equal), the number of lines of symmetry equals the number of sides. Each line passes through a vertex and the midpoint of the opposite side (or through two opposite vertices for even-sided shapes).`,
          solution: {
            scenario: `Lines of symmetry of a regular polygon.`,
            idea: `A regular n-gon has n lines of symmetry — one through each vertex (and the opposite midpoint or vertex).`,
            method: `${shape.name}: ${shape.sides} sides → ${shape.lines} lines of symmetry.`,
            steps: [`A ${shape.name} is regular (all sides and angles equal).`, `Number of lines of symmetry = number of sides = ${shape.lines}.`],
            check: `Regular n-gon: always n lines. ${shape.sides} sides → ${shape.lines}. ✓`,
          },
        };
      }
      if (sub === 1) {
        // Rotational symmetry order
        const shape = pick(NAMED_SHAPES.filter(s => s.order >= 1));
        const { options, correctIndex } = buildMC(shape.order, [shape.order + 1, shape.order > 1 ? shape.order - 1 : shape.order + 2, shape.lines, shape.sides]);
        return {
          q: `What is the order of rotational symmetry of a ${shape.name}?`,
          options, correctIndex,
          hint: `The order of rotational symmetry is the number of times the shape looks identical during one full 360° rotation. A regular n-gon has order n. An irregular shape with no rotational symmetry has order 1 (only the full 360° brings it back).`,
          solution: {
            scenario: `Order of rotational symmetry of a ${shape.name}.`,
            idea: `Order = how many times the shape coincides with itself in one full rotation. Regular n-gon: order n. Irregular shapes: order 1.`,
            method: `${shape.name}: order = ${shape.order}.`,
            steps: [`${shape.name}: ${shape.order === shape.sides ? `regular polygon with ${shape.sides} sides → order ${shape.order}` : `irregular → coincides with itself only at 360°, but has ${shape.order > 1 ? "some" : "no"} rotational symmetry → order ${shape.order}`}.`],
            check: `360° ÷ ${shape.order} = ${360 / shape.order}° per rotation. Each such rotation maps the shape to itself. ✓`,
          },
        };
      }
      // Cube net: direct opposite lookup
      const faces = Object.keys(NET_POS);
      const faceA = pick(faces);
      const opp = OPPOSITE_OF[faceA];
      const { options, correctIndex } = buildMCStr(opp, faces.filter(f => f !== faceA && f !== opp).slice(0, 4));
      const netSvg = () => {
        const S=40,M=5;
        const faceLabels = {...NET_POS};
        let s=`<svg viewBox="0 0 ${5*S+2*M} ${4*S+2*M}" xmlns="http://www.w3.org/2000/svg">`;
        for(const [face,[fc,fr]] of Object.entries(NET_POS)){
          const x=M+fc*S,y=M+fr*S;
          const isMarked=face===faceA;
          s+=`<rect x="${x}" y="${y}" width="${S}" height="${S}" fill="${isMarked?"#ede9ff":"#f8f6ff"}" stroke="#7c5cff" stroke-width="1.5"/>`;
          s+=`<text x="${x+S/2}" y="${y+S/2+5}" text-anchor="middle" font-size="11" font-weight="700" fill="#2a1a5e">${face}</text>`;
        }
        return s+`</svg>`;
      };
      return {
        q: `${netSvg()}This is the net of a cube. Which face is opposite the "${faceA}" face when the cube is folded?`,
        options, correctIndex,
        hint: `Fold the net in your mind (or trace the positions). In a standard Latin-cross cube net, faces that are 2 steps apart along the cross are opposite each other. The "${faceA}" face is opposite "${opp}".`,
        solution: {
          scenario: `Identify the face opposite "${faceA}" in a cube net.`,
          idea: `In a Latin-cross net, each face folds to a fixed position on the cube. Opposite face pairs are fixed: top↔bottom, left↔right, front↔back.`,
          method: `"${faceA}" is opposite "${opp}" in this net.`,
          steps: [`Fold the net: top and bottom end up on opposite faces.`, `In this net, "${faceA}" folds opposite "${opp}".`],
          check: `Top↔bottom, left↔right, front↔back. "${faceA}"↔"${opp}". ✓`,
        },
      };
    }

    if (d === 2) {
      const sub = rand(0, 2);
      if (sub === 0) {
        // Irregular shape — resist applying regular polygon rules
        const shape = pick(NAMED_SHAPES.filter(s => s.lines !== s.sides));
        const { options, correctIndex } = buildMC(shape.lines, [shape.sides, shape.sides - 1, shape.order, shape.lines + 1]);
        return {
          q: `How many lines of symmetry does a ${shape.name} have?`,
          options, correctIndex,
          hint: `Be careful — the "lines = sides" rule only works for regular polygons. A ${shape.name} is not regular: check each potential line of symmetry individually. A line of symmetry must fold the shape onto itself exactly.`,
          solution: {
            scenario: `Lines of symmetry of an irregular shape.`,
            idea: `Only regular polygons have "lines = sides". For irregular shapes, test each candidate line individually.`,
            method: `${shape.name}: ${shape.lines} line${shape.lines !== 1 ? "s" : ""} of symmetry.`,
            steps: [`A ${shape.name} is not regular, so the n-sides rule doesn't apply.`, `Testing symmetry lines individually: ${shape.lines} line${shape.lines !== 1 ? "s" : ""} work.`],
            check: `${shape.name}: ${shape.lines} symmetry line${shape.lines !== 1 ? "s" : ""}. ✓`,
          },
        };
      }
      if (sub === 1) {
        // Cube net reverse-fill: given opposite, find blank
        const faces = Object.keys(NET_POS);
        const faceA = pick(faces);
        const opp = OPPOSITE_OF[faceA];
        // Show all except one that's not opp
        const hidden = pick(faces.filter(f => f !== faceA && f !== opp));
        const { options, correctIndex } = buildMCStr(hidden, faces.filter(f => f !== opp && f !== hidden).slice(0, 4));
        return {
          q: `In a cube net, the "${faceA}" face is shown. The face directly opposite it is "${opp}". One other face label is hidden. Given that the hidden face is adjacent to "${faceA}", which face is it?`,
          options, correctIndex,
          hint: `The cube has 3 pairs of opposite faces: top/bottom, left/right, front/back. You know the ${faceA}/${opp} pair. The remaining four faces are all adjacent to both faces in that pair. Identify which label is missing.`,
          solution: {
            scenario: `Fill in a missing face name on a cube net.`,
            idea: `Six faces, three opposite pairs. Given one pair, the remaining four are candidates for any adjacent position.`,
            method: `The hidden face is "${hidden}" — deduced by elimination from the known opposite pair.`,
            steps: [`Known opposite pair: ${faceA} ↔ ${opp}.`, `The hidden adjacent face is "${hidden}".`],
            check: `All six faces accounted for: ${faces.join(", ")}. ✓`,
          },
        };
      }
      // Chirality: spot the impossible mirror reading
      const words = ["MATHS","QUIZ","CUBE","FOLD","SPIN","AXIS","STAR","KNOT"];
      const word = pick(words);
      const mirrorWord = word.split("").reverse().join("");
      const { options, correctIndex } = buildMCStr(mirrorWord, [word, word.slice(1)+word[0], word[word.length-1]+word.slice(0,-1), word.slice(0,-2)+word[word.length-1]+word[word.length-2]]);
      return {
        q: `The word "${word}" is written on a transparent sheet. What does it look like when held up to a mirror (or when viewed from the other side of the sheet)?`,
        options, correctIndex,
        hint: `Reading through the back of a transparent sheet reverses left and right — it is the same as reflecting in a vertical mirror. The entire word is reversed: the last letter becomes first, and each individual letter also appears mirrored (though we conventionally write them reversed here).`,
        solution: {
          scenario: `Mirror image of a word written on a transparent sheet.`,
          idea: `Viewing from behind is a left-right reflection: the string of letters reverses.`,
          method: `"${word}" reversed: "${mirrorWord}".`,
          steps: [`Reverse the order of letters: ${word.split("").join(" → ")} flips to ${word.split("").reverse().join(" ")} = "${mirrorWord}".`],
          check: `"${mirrorWord}" reversed = "${word}". ✓`,
        },
      };
    }

    if (d === 3) {
      const sub = rand(0, 2);
      if (sub === 0) {
        // Composite: regular polygon lines + irregular shape order
        const regShape = pick(NAMED_SHAPES.filter(s => s.order === s.sides));
        const irrShape = pick(NAMED_SHAPES.filter(s => s.lines !== s.sides));
        const question = rand(0, 1) === 0;
        const { options, correctIndex } = question
          ? buildMC(regShape.lines, [regShape.lines + 1, irrShape.lines, regShape.sides + 1, regShape.lines - 1])
          : buildMC(irrShape.order, [irrShape.order + 1, regShape.order, irrShape.lines, irrShape.order - 1]);
        return {
          q: question
            ? `A ${regShape.name} and a ${irrShape.name} are combined. How many lines of symmetry does the ${regShape.name} contribute on its own?`
            : `What is the order of rotational symmetry of a ${irrShape.name} (be careful — it is not regular)?`,
          options, correctIndex,
          hint: question
            ? `The ${regShape.name} is a regular polygon: lines of symmetry = number of sides = ${regShape.sides}.`
            : `The ${irrShape.name} is not regular. Its order of rotational symmetry is ${irrShape.order} — it ${irrShape.order > 1 ? "does have some rotational symmetry" : "only maps to itself at a full 360° rotation"}.`,
          solution: {
            scenario: question ? `Lines of symmetry: regular polygon.` : `Order of rotational symmetry: irregular shape.`,
            idea: question ? `Regular n-gon: n lines.` : `Test rotations; order = number of coincidences in 360°.`,
            method: question ? `${regShape.sides}-sided regular polygon → ${regShape.lines} lines.` : `${irrShape.name}: order ${irrShape.order}.`,
            steps: question
              ? [`${regShape.name}: regular, ${regShape.sides} sides → ${regShape.lines} lines of symmetry.`]
              : [`${irrShape.name}: not regular. Order of rotational symmetry = ${irrShape.order}.`],
            check: question ? `✓` : `✓`,
          },
        };
      }
      if (sub === 1) {
        // Two linked unknowns on cube net: 5 visible, deduce last
        const faces = Object.keys(NET_POS);
        const hidden = pick(faces);
        const given = faces.filter(f => f !== hidden);
        const { options, correctIndex } = buildMCStr(hidden, faces.filter(f => f !== hidden).slice(0, 4));
        return {
          q: `Five faces of a cube are labelled: ${given.join(", ")}. What is the sixth face?`,
          options, correctIndex,
          hint: `A cube has exactly 6 faces: top, bottom, left, right, front, back. List the 5 given faces and identify which one from the standard set of 6 is missing.`,
          solution: {
            scenario: `Identify the missing face of a cube given 5 of the 6 face labels.`,
            idea: `A cube has exactly 6 faces. Five are given — the sixth is whichever is absent.`,
            method: `Given: ${given.join(", ")}. Missing: "${hidden}".`,
            steps: [`Six cube faces: top, bottom, left, right, front, back.`, `Given 5: ${given.join(", ")}. Missing = "${hidden}".`],
            check: `${given.join(", ")}, ${hidden} — all six accounted for. ✓`,
          },
        };
      }
      // Pick the one valid rotation among mirrors
      const seq = ["R","G","B","Y"].slice(0, 4);
      const rot90 = [seq[3], seq[0], seq[1], seq[2]];
      const rot180 = [seq[2], seq[3], seq[0], seq[1]];
      const rot270 = [seq[1], seq[2], seq[3], seq[0]];
      const mirror = [seq[1], seq[0], seq[3], seq[2]];
      const correct = pick([rot90, rot180, rot270]);
      const wrongSeq = mirror;
      const { options, correctIndex } = buildMCStr(correct.join(""), [wrongSeq.join(""), [seq[0], seq[2], seq[1], seq[3]].join(""), [seq[3], seq[1], seq[0], seq[2]].join(""), [seq[2], seq[1], seq[0], seq[3]].join("")].filter(s=>s!==correct.join("")).slice(0,4));
      return {
        q: `A sequence of colours ${seq.join("-")} is printed on a rotating disc. Which of the following sequences can be produced by rotating the disc (not flipping it)?`,
        options, correctIndex,
        hint: `A rotation keeps the cyclic order of the sequence the same (clockwise order is preserved). A sequence that requires a flip (mirror image) changes the cyclic order — it cannot be achieved by rotation alone. Check each option: is it a cyclic rotation of ${seq.join("-")}?`,
        solution: {
          scenario: `Identify a valid rotation versus a mirror image of a cyclic sequence.`,
          idea: `Rotating a disc produces cyclic rotations of the sequence. Flipping changes the cyclic order (reverses it). A cyclic rotation of ${seq.join("-")} includes: ${rot90.join("-")}, ${rot180.join("-")}, ${rot270.join("-")}.`,
          method: `Test each option: is it a cyclic rotation of "${seq.join("")}"? The valid answer is "${correct.join("")}".`,
          steps: [`Original: ${seq.join("-")}.`, `Valid rotations: ${rot90.join("-")}, ${rot180.join("-")}, ${rot270.join("-")}.`, `"${correct.join("")}" is a cyclic rotation. The others require a flip.`],
          check: `Cyclic rotations of "${seq.join("")}": ${[rot90,rot180,rot270].map(r=>r.join("")).join(", ")}. "${correct.join("")}" is one of these. ✓`,
        },
      };
    }

    // d === 4
    const sub4 = rand(0, 2);
    if (sub4 === 0) {
      // "Which face is NOT adjacent to X?" — correct answer is the opposite face
      const faces = Object.keys(NET_POS);
      const faceA = pick(faces);
      const oppA = OPPOSITE_OF[faceA];
      const adjacent = faces.filter(f => f !== faceA && f !== oppA);
      const { options, correctIndex } = buildMCStr(oppA, adjacent.slice(0, 4));
      return {
        q: `On a cube, which face is NOT adjacent to the "${faceA}" face?`,
        options, correctIndex,
        hint: `Each face of a cube touches 4 other faces along its edges (those are its adjacent faces) and is opposite to exactly 1 face. The one face that is NOT adjacent to "${faceA}" is its opposite: "${oppA}".`,
        solution: {
          scenario: `Identify the face that is opposite (not adjacent) to a given cube face.`,
          idea: `Each face has 4 adjacent faces and 1 opposite face. Opposite pairs: top/bottom, front/back, left/right.`,
          method: `"${faceA}" is opposite "${oppA}", so "${oppA}" is the one face NOT adjacent to it.`,
          steps: [`"${faceA}" shares edges with: ${adjacent.join(", ")} — these are its 4 adjacent faces.`, `The remaining face "${oppA}" is directly opposite — it shares no edge with "${faceA}".`],
          check: `Opposite pairs: top/bottom, front/back, left/right. "${faceA}" ↔ "${oppA}". ✓`,
        },
      };
    }
    if (sub4 === 1) {
      // Irregular order + valid rotation count
      const irrShape = pick(NAMED_SHAPES.filter(s => s.lines !== s.sides));
      const validRotations = irrShape.order; // rotations that map to itself
      const { options, correctIndex } = buildMC(irrShape.order, [irrShape.order + 1, irrShape.lines, irrShape.sides, irrShape.order + 2]);
      return {
        q: `A ${irrShape.name} is rotated. How many distinct rotation angles (including 0°) map the shape onto itself?`,
        options, correctIndex,
        hint: `The number of rotation angles that map a shape to itself equals the order of rotational symmetry. For a ${irrShape.name}, this is ${irrShape.order} — so only ${irrShape.order} angle${irrShape.order > 1 ? "s" : ""} work (including 0°).`,
        solution: {
          scenario: `Count of valid rotations (including 0°) for a ${irrShape.name}.`,
          idea: `Order of rotational symmetry = number of angles (in [0°, 360°)) that map the shape to itself.`,
          method: `${irrShape.name}: order = ${irrShape.order}. Valid rotations: ${Array.from({length:irrShape.order},(_,i)=>Math.round(360*i/irrShape.order)+"°").join(", ")}.`,
          steps: [`Order of rotational symmetry of ${irrShape.name} = ${irrShape.order}.`, `Valid rotation angles: ${Array.from({length:irrShape.order},(_,i)=>Math.round(360*i/irrShape.order)+"°").join(", ")}.`, `Count = ${irrShape.order}.`],
          check: `${irrShape.order} rotations, equally spaced at ${360/irrShape.order}° intervals. ✓`,
        },
      };
    }
    // Combined: irregular order + valid rotation count (R+V)
    const reg = pick(NAMED_SHAPES.filter(s => s.order === s.sides && s.sides >= 4));
    const irr = pick(NAMED_SHAPES.filter(s => s.order < s.sides));
    const R = reg.lines;
    const V = irr.order;
    const RplusV = R + V;
    const { options, correctIndex } = buildMC(RplusV, [RplusV + 1, RplusV - 1, R * V, R + irr.lines]);
    return {
      q: `A ${reg.name} has R lines of symmetry. A ${irr.name} has V valid rotation angles (including 0°). What is R + V?`,
      options, correctIndex,
      hint: `R = lines of symmetry of a ${reg.name} = number of sides = ${R}. V = order of rotational symmetry of a ${irr.name} = ${V} (be careful — it is not regular). R + V = ${RplusV}.`,
      solution: {
        scenario: `Combining symmetry properties of a regular and an irregular shape.`,
        idea: `R = ${reg.name} lines of symmetry = ${R}. V = ${irr.name} rotational order = ${V}. Sum = ${RplusV}.`,
        method: `R + V = ${R} + ${V} = ${RplusV}.`,
        steps: [`R: ${reg.name} is regular with ${reg.sides} sides → ${R} lines of symmetry.`, `V: ${irr.name} has rotational order ${V} → ${V} valid rotation angles.`, `R + V = ${R} + ${V} = ${RplusV}.`],
        check: `${R} + ${V} = ${RplusV}. ✓`,
      },
    };
  },
};

export const JUNIOR_STRUCTURES = installJuniorCurriculumGenerators(JUNIOR_G, { rand, pick, buildMC, buildMCStr, pickStructure });

export function makeQuestion(topicKey, difficulty) {
  setND(difficulty || 1);
  const key = topicKey || pick(TOPICS).key;
  const gen = G[key] || G[pick(TOPICS).key];
  let out; try { out = gen(difficulty); } catch (e) { out = (G.multiExpr || G[pick(TOPICS).key])(difficulty); }
  return { ...out, topic: key, difficulty, id: Math.random().toString(36).slice(2) };
}

// A signature that identifies a question by its actual content, so we can
// avoid serving the same one twice in a session or within one paper.
export function qSignature(q) { return (q.topic || "") + "|" + (q.q || ""); }

// Generate a question that is not in the `seen` set. Tries the requested
// topic/difficulty repeatedly, then falls back to any topic, so it can never
// loop forever.
export function makeFreshQuestion(topicKey, difficulty, seen) {
  for (let i = 0; i < 40; i++) {
    const q = makeQuestion(topicKey, difficulty);
    if (!seen || !seen.has(qSignature(q))) return q;
  }
  // give up trying to vary the topic: accept any unseen question
  for (let i = 0; i < 60; i++) {
    const q = makeQuestion(null, difficulty);
    if (!seen || !seen.has(qSignature(q))) return q;
  }
  return makeQuestion(topicKey, difficulty); // last resort
}

/* Level-aware factory: maps game level (1-10) to generator difficulty and,
   from level 5 upward, mixes in the deep multi-step generators with a
   probability that rises with level. A specific topicKey is respected. */
export function makeLevelQuestion(level, topicKey, seen) {
  const lv = Math.min(Math.max(level || 1, 1), MAX_LEVEL);
  setNL(lv);
  const d = levelToDiff(lv);
  if (!topicKey && DEEP_TOPICS.length && Math.random() < deepChance(lv)) {
    const deepKey = pick(DEEP_TOPICS).key;
    for (let i = 0; i < 25; i++) {
      const q = makeQuestion(deepKey, d);
      if (!seen || !seen.has(qSignature(q))) return { ...q, level: lv, deep: true };
    }
  }
  const q = makeFreshQuestion(topicKey, d, seen);
  return { ...q, level: lv };
}

/* ---------------- original olympiad bank ---------------- */
/* How to attack an Olympiad problem — the training camp playbook.
   Structure follows the NC aims (fluency, reasoning, problem solving) and
   classic UK JMO coaching: understand, plan, execute, check. */
export const JUNIOR_OLYMPIAD_PLAYBOOK = {
  steps: [
    { t: "Understand", d: "Read it twice. What are you asked to FIND? What are you TOLD? Restate the problem in your own words." },
    { t: "Plan", d: "Pick a tactic (see below). If nothing jumps out, try small cases or draw a picture — movement beats staring." },
    { t: "Do", d: "Write every step. In an Olympiad the reasoning IS the answer: a bare number scores almost nothing." },
    { t: "Check", d: "Feed your answer back into the question. Does it satisfy every condition? Could there be another answer?" },
  ],
  tactics: [
    "🔢 Use place value: write a two-digit number as 10a + b.",
    "🔁 Work backwards: undo the steps from the end, in reverse order.",
    "🔍 Try small cases: solve it for 1, 2, 3… and hunt the pattern.",
    "⚖️ Push to extremes: make everything else as small (or large) as possible.",
    "📝 Be systematic: list every case in order, so nothing can hide.",
    "🎭 Use parity: odd and even often decide what is possible.",
    "🧷 Find an invariant: something that never changes, however you act.",
    "✏️ Introduce a letter: name the unknown and let algebra walk for you.",
  ],
};

export const JUNIOR_OLYMPIAD = [
  { id: "o1", section: "B", q: "Find every two-digit number that is exactly three times the sum of its own digits.", answer: "27", tactic: "Use place value: write the number as 10a + b.", sol: ["Write the number as 10a + b, where a is the tens digit and b the units digit.", "The condition says 10a + b = 3(a + b).", "Expand and tidy: 10a + b = 3a + 3b, so 7a = 2b.", "b = 7a/2 must be a whole digit, so a must be even. a = 2 gives b = 7; a = 4 gives b = 14, too big.", "So the only such number is 27. Check: 3 × (2 + 7) = 27 ✓"],
    markScheme: [ { pts: 1, desc: "Wrote the number as 10a + b and formed the equation 10a + b = 3(a + b)." }, { pts: 1, desc: "Simplified correctly to 7a = 2b." }, { pts: 2, desc: "Correctly tested valid even values of a, ruling out a = 4 (b too big)." } ] },
  { id: "o2", section: "A", topic: "modular", q: "A whole number leaves remainder 1 when divided by each of 2, 3, 4, 5 and 6. What is the smallest such number greater than 1?", answer: "61", tactic: "Transform the problem: look at n − 1 instead of n.", sol: ["If n leaves remainder 1 when divided by each of these, then n − 1 divides exactly by ALL of them.", "So n − 1 is a common multiple of 2, 3, 4, 5, 6. The smallest is LCM(2,3,4,5,6) = 60.", "So n = 61. Check: 61 = 30×2+1 = 20×3+1 = 15×4+1 = 12×5+1 = 10×6+1 ✓"],
    markScheme: [ { pts: 1, desc: "Recognised that n − 1 must be divisible by 2, 3, 4, 5 and 6." }, { pts: 1, desc: "Found LCM(2,3,4,5,6) = 60 and added 1." } ] },
  { id: "o3", section: "B", topic: "ratioChain", q: "A bag holds red and blue counters in the ratio 5 : 3. After 8 red are removed the ratio becomes 1 : 1. How many counters were there to begin with?", answer: "32", tactic: "Introduce a letter: call the parts 5k and 3k.", sol: ["Ratios are about multiplication, so call the counts 5k red and 3k blue.", "After removing 8 red: 5k − 8 = 3k (the ratio 1:1 means the counts are equal).", "Solve: 2k = 8, so k = 4.", "Red = 20, blue = 12; total at the start = 32. Check: 20:12 = 5:3 ✓ and 12:12 = 1:1 ✓"],
    markScheme: [ { pts: 1, desc: "Set up the counts as 5k red and 3k blue." }, { pts: 1, desc: "Formed the correct equation 5k − 8 = 3k." }, { pts: 1, desc: "Solved for k = 4." }, { pts: 1, desc: "Found the correct total (32) and checked it against both ratios." } ] },
  { id: "o4", section: "A", q: "The sum of three consecutive even numbers is 84. What is the product of the smallest and the largest?", answer: "780", tactic: "Introduce a letter: name the middle number.", sol: ["Consecutive even numbers step by 2, so call them n, n + 2, n + 4.", "Their sum is 3n + 6 = 84, so n = 26.", "The numbers are 26, 28, 30.", "Smallest × largest = 26 × 30 = 780."],
    markScheme: [ { pts: 1, desc: "Defined the three consecutive even numbers as n, n+2, n+4." }, { pts: 1, desc: "Solved 3n + 6 = 84 to find n = 26 and computed the product." } ] },
  { id: "o5", section: "A", q: "A rectangle has perimeter 36 cm and its length is twice its width. Find its area.", answer: "72 cm²", tactic: "Introduce a letter: everything in terms of the width.", sol: ["Let the width be w, so the length is 2w.", "Perimeter = 2(w + 2w) = 6w = 36, so w = 6.", "Length = 12 cm, width = 6 cm.", "Area = 12 × 6 = 72 cm²."],
    markScheme: [ { pts: 1, desc: "Defined the width w and length 2w." }, { pts: 1, desc: "Solved the perimeter equation for w and computed the area correctly." } ] },
  { id: "o6", section: "B", topic: "allocation", q: "In how many different ways can you make exactly 30p using only 10p and 5p coins?", answer: "4 ways", tactic: "Be systematic: list every case in order.", sol: ["Let a be the number of 10p coins and b the number of 5p coins: 10a + 5b = 30, i.e. 2a + b = 6.", "March a upwards in order: a = 0 → b = 6; a = 1 → b = 4; a = 2 → b = 2; a = 3 → b = 0.", "a = 4 would need b negative, so the list is complete.", "4 ways — and the ordered list PROVES none are missing."],
    markScheme: [ { pts: 1, desc: "Set up the equation 2a + b = 6 for numbers of 10p/5p coins." }, { pts: 2, desc: "Listed all cases systematically in order and showed a = 4 is impossible." }, { pts: 1, desc: "Concluded correctly that there are 4 ways." } ] },
  { id: "o7", section: "B", topic: "meanPuzzle", q: "The mean of five different positive whole numbers is 10. What is the largest the biggest number could possibly be?", answer: "40", tactic: "Push to extremes: make everything else as small as possible.", sol: ["Mean × count = total, so the five numbers add to 50.", "To make one number as big as possible, make the other four as SMALL as possible.", "They must be different positive whole numbers, so the smallest four are 1, 2, 3, 4, which total 10.", "Largest possible = 50 − 10 = 40."],
    markScheme: [ { pts: 1, desc: "Found the total sum of the five numbers (50) from the mean." }, { pts: 2, desc: "Correctly argued the other four should be as small as possible (1,2,3,4, distinct positive)." }, { pts: 1, desc: "Subtracted correctly to reach 40." } ] },
  { id: "o8", section: "A", q: "A square has the same numerical value for its area and its perimeter. What is the side length of the square?", answer: "4", tactic: "Introduce a letter: set the two formulas equal.", sol: ["Side s: area = s² and perimeter = 4s.", "Set them equal: s² = 4s.", "Divide by s (s isn't 0): s = 4.", "Check: area 16, perimeter 16 ✓"],
    markScheme: [ { pts: 1, desc: "Set up the equation s² = 4s." }, { pts: 1, desc: "Solved correctly for s = 4 (dividing by s, not losing the solution)." } ] },
  { id: "o9", section: "B", q: "Using each of the digits 1 to 6 exactly once, three two-digit numbers are formed and added. What is the largest possible total?", answer: "156", tactic: "Use place value: put the biggest digits where they count most.", sol: ["Each tens digit is worth ten times as much as a units digit.", "So the three biggest digits (6, 5, 4) belong in the tens places, and (3, 2, 1) in the units.", "Total = (6 + 5 + 4) × 10 + (3 + 2 + 1) = 150 + 6 = 156.", "It doesn't matter how the digits pair up — only which column each digit sits in."],
    markScheme: [ { pts: 2, desc: "Correctly identified that the three largest digits (6,5,4) should be tens digits." }, { pts: 1, desc: "Computed the tens contribution correctly (150)." }, { pts: 1, desc: "Added the units contribution correctly for a total of 156." } ] },
  { id: "o10", section: "B", q: "Can the numbers 1 to 9 be placed around a circle so that every pair of neighbours differs by an odd number? Explain.", answer: "No — it is impossible", tactic: "Use parity: odd and even often decide what is possible.", sol: ["Two numbers differ by an odd amount exactly when one is odd and one is even.", "So going round the circle, the numbers would have to alternate odd, even, odd, even…", "A circle of 9 numbers that alternates needs the SAME count of odds and evens — but 9 is odd, so that's impossible.", "And indeed 1-9 has five odd numbers and only four evens. So no arrangement works."],
    markScheme: [ { pts: 1, desc: "Recognised that differing by an odd number means one odd, one even neighbour." }, { pts: 1, desc: "Deduced the arrangement must alternate odd/even all the way round the circle." }, { pts: 2, desc: "Correctly argued this needs equal numbers of odds and evens, impossible for 9 numbers (5 odd, 4 even)." } ] },
  { id: "o11", section: "A", topic: "workBackwards", q: "I think of a number, add 7, double the result, subtract 4, then halve what's left. The answer is 20. What was my number?", answer: "15", tactic: "Work backwards: undo the steps from the end.", sol: ["Undo each step in REVERSE order.", "Last step was 'halve' → undo: 20 × 2 = 40.", "Before that 'subtract 4' → undo: 40 + 4 = 44.", "Before that 'double' → undo: 44 ÷ 2 = 22.", "First step was 'add 7' → undo: 22 − 7 = 15. Check forwards: 15 → 22 → 44 → 40 → 20 ✓"],
    markScheme: [ { pts: 1, desc: "Identified the correct forward chain of operations." }, { pts: 1, desc: "Undid each step correctly in reverse order to reach 15." } ] },
  { id: "o12", section: "A", topic: "modular", q: "What is the units digit of 7²⁰²⁶?", answer: "9", tactic: "Try small cases: hunt the repeating pattern.", sol: ["Work out the first few powers, watching only the units digit: 7, 49, 343, 2401 → units digits 7, 9, 3, 1.", "The pattern 7, 9, 3, 1 repeats every 4 powers.", "2026 = 4 × 506 + 2, so 7²⁰²⁶ sits at position 2 of the cycle.", "Position 2 is 9, so the units digit is 9."],
    markScheme: [ { pts: 1, desc: "Found the repeating units-digit cycle (7, 9, 3, 1)." }, { pts: 1, desc: "Used 2026 mod 4 correctly to find the right position in the cycle." } ] },
  { id: "o13", section: "A", topic: "pigeonhole", q: "A drawer holds 10 black socks, 8 blue socks and 6 grey socks. In complete darkness, how many socks must you take out to be CERTAIN of a matching pair?", answer: "4", tactic: "Push to extremes: imagine the worst possible luck.", sol: ["Certainty means it works even with the worst luck.", "The unluckiest start: three socks, all DIFFERENT colours (one black, one blue, one grey).", "There are only three colours, so a fourth sock must repeat one of them.", "So 4 socks guarantee a pair. Three would not: the all-different draw is possible."],
    markScheme: [ { pts: 1, desc: "Identified the worst case (one of each of the 3 colours)." }, { pts: 1, desc: "Concluded a 4th sock forces a repeat, giving 4." } ] },
  { id: "o14", section: "B", q: "A chocolate bar is a 4 × 6 grid of squares. How many snaps are needed to break it into its 24 single squares? (Each snap breaks one piece along a straight line.)", answer: "23", tactic: "Find an invariant: what changes by the same amount every time?", sol: ["Watch the NUMBER OF PIECES: every snap takes one piece and makes two, so each snap increases the count by exactly 1.", "You start with 1 piece and must end with 24 pieces.", "That is an increase of 23, so exactly 23 snaps — no cleverness can beat it.", "This works for any bar: an m × n bar always needs mn − 1 snaps."],
    markScheme: [ { pts: 2, desc: "Identified the number of pieces as the invariant, increasing by exactly 1 per snap." }, { pts: 1, desc: "Linked the target (24 pieces from 1) to the number of snaps needed." }, { pts: 1, desc: "Concluded correctly (23 snaps)." } ] },
  { id: "o15", section: "A", q: "The angles of a triangle are in the ratio 2 : 3 : 4. What is the size of the largest angle?", answer: "80°", tactic: "Introduce a letter: one part = one unknown.", sol: ["The angles are 2k, 3k and 4k for some value k.", "Angles in a triangle sum to 180°: 2k + 3k + 4k = 9k = 180, so k = 20.", "The angles are 40°, 60° and 80°.", "Largest = 80°. Check: 40 + 60 + 80 = 180 ✓"],
    markScheme: [ { pts: 1, desc: "Set up the angles as 2k, 3k and 4k." }, { pts: 1, desc: "Solved 9k = 180 for k and found the largest angle." } ] },
  { id: "o16", section: "A", q: "Two numbers have a sum of 30 and a difference of 6. What is their product?", answer: "216", tactic: "Sum and difference: split evenly, then shift.", sol: ["If both numbers were equal they'd each be 15 (half the sum).", "A difference of 6 means one sits 3 above and one 3 below: 18 and 12.", "In general the numbers are (sum + diff) ÷ 2 and (sum − diff) ÷ 2.", "Product = 18 × 12 = 216."],
    markScheme: [ { pts: 1, desc: "Used the sum-and-difference method to find the two numbers (18 and 12)." }, { pts: 1, desc: "Computed the product correctly (216)." } ] },
  { id: "o17", section: "A", q: "A 5×5 board has 25 unit squares. Can it be tiled exactly by 2×1 dominoes, with no gaps or overlaps? Explain.", answer: "No, it's impossible.", tactic: "Use parity: odd and even often decide what is possible.", sol: ["Each domino covers exactly 2 squares, so any number of dominoes covers an EVEN total number of squares.", "The board has 25 squares, which is ODD.", "An odd number can never equal an even number, so no whole number of dominoes can cover exactly 25 squares.", "So the 5×5 board cannot be tiled by dominoes."],
    markScheme: [ { pts: 1, desc: "Recognised each domino covers 2 squares (an even amount)." }, { pts: 1, desc: "Identified 25 as odd." }, { pts: 1, desc: "Concluded correctly that tiling is impossible." } ] },
  { id: "o18", section: "A", q: "Find the smallest 4-digit number that is divisible by both 4 and 9.", answer: "1008", tactic: "Combine divisibility rules: 4 and 9 together mean divisible by 36.", sol: ["A number divisible by both 4 and 9 must be divisible by 4×9=36 (since 4 and 9 share no common factor).", "The smallest 4-digit number is 1000. Dividing: 1000÷36 ≈ 27.8, so the smallest multiple of 36 that is at least 1000 is 28×36.", "28×36 = 1008.", "Check: 1008's last two digits are 08 (divisible by 4); digit sum 1+0+0+8=9 (divisible by 9). Both hold."],
    markScheme: [ { pts: 1, desc: "Recognised that divisible by both 4 and 9 means divisible by 36." }, { pts: 1, desc: "Correctly found the smallest multiple of 36 that is a 4-digit number." }, { pts: 1, desc: "Checked the answer against both divisibility rules." } ] },
  { id: "o19", section: "A", topic: "workBackwards", q: "After spending 1/3 of her money, then earning £12, a shopper now has £30. How much did she start with?", answer: "£27", tactic: "Work backwards, undoing each change in reverse order.", sol: ["Let x be the shopper's starting amount.", "After spending 1/3, she has (2/3)x left.", "Then earning £12 gives (2/3)x + 12 = 30, so (2/3)x = 18.", "Solving: x = 18 × 3/2 = 27."],
    markScheme: [ { pts: 1, desc: "Defined x as the starting amount." }, { pts: 1, desc: "Formed the correct equation (2/3)x + 12 = 30." }, { pts: 1, desc: "Solved correctly for x = 27." } ] },
  { id: "o20", section: "B", topic: "pigeonhole", q: "Show that among any 5 whole numbers, there must be two whose difference is a multiple of 4.", answer: "Proof — always true.", tactic: "Find an invariant/pigeonhole: remainders when dividing by 4.", sol: ["Every whole number leaves one of 4 possible remainders when divided by 4: 0, 1, 2 or 3. Think of these as 4 'holes'.", "With 5 numbers (pigeons) and only 4 possible remainders (holes), by the pigeonhole principle at least two numbers must share the same remainder.", "If two numbers a and b leave the same remainder mod 4, then a − b is exactly divisible by 4 (the remainders cancel).", "So among any 5 whole numbers, two must have a difference that is a multiple of 4."],
    markScheme: [ { pts: 1, desc: "Identified the 4 possible remainders mod 4 as the holes." }, { pts: 1, desc: "Applied the pigeonhole principle with 5 numbers and 4 holes." }, { pts: 2, desc: "Correctly explained why equal remainders force a difference divisible by 4." } ] },
  { id: "o21", section: "B", q: "Starting number on a board is 5. Each move either adds 4 or subtracts 6. Can the number ever become 100?", answer: "No, impossible.", tactic: "Find an invariant: what stays fixed with every move?", sol: ["Both possible moves change the number by an EVEN amount (+4 or −6).", "Changing a number by an even amount never changes its parity (odd stays odd, even stays even).", "The starting number 5 is odd, so after any number of moves the number must still be odd.", "100 is even, so it can never be reached."],
    markScheme: [ { pts: 1, desc: "Identified parity as the invariant to track." }, { pts: 1, desc: "Showed both moves change the number by an even amount." }, { pts: 1, desc: "Linked the odd starting value to the number always staying odd." }, { pts: 1, desc: "Concluded 100 (even) is unreachable." } ] },
  { id: "o22", section: "A", q: "Find 3+6+9+...+60 (the multiples of 3 up to 60), using pairing.", answer: "630", tactic: "Pair from both ends: symmetry collapses the sum.", sol: ["Pair first and last: 3+60=63. Each such pair (6+57, 9+54, ...) also sums to 63.", "There are 60÷3=20 terms, giving 20÷2=10 pairs.", "The total is 10×63=630."],
    markScheme: [ { pts: 1, desc: "Identified the correct pairing (first+last = 63)." }, { pts: 1, desc: "Correctly counted 20 terms / 10 pairs." }, { pts: 1, desc: "Computed the total correctly (630)." } ] },
  { id: "o23", section: "A", q: "A quadrilateral has angles in the ratio 3:4:5:6. Find the largest angle.", answer: "120°", tactic: "Introduce a letter: one part = one unknown.", sol: ["The four angles are 3k, 4k, 5k, 6k for some k. Angles in a quadrilateral sum to 360°, so 3k+4k+5k+6k=18k=360.", "Solving, k=20.", "The angles are 60°, 80°, 100°, 120° — the largest is 120°. Check: 60+80+100+120=360 ✓"],
    markScheme: [ { pts: 1, desc: "Set up the four angles as 3k, 4k, 5k, 6k." }, { pts: 1, desc: "Used the quadrilateral angle sum (360°) to solve for k." }, { pts: 1, desc: "Found the largest angle (120°) and checked the total." } ] },
  { id: "o24", section: "B", q: "Two similar rectangles have areas 18 cm² and 50 cm². If the smaller rectangle has width 3cm, find the width of the larger rectangle.", answer: "5cm", tactic: "Similar shapes: area scales by the SQUARE of the length scale.", sol: ["For similar shapes, the AREA ratio equals the SQUARE of the length ratio. Area ratio = 50/18 = 25/9.", "So the length ratio is the square root of 25/9, which is 5/3.", "The larger rectangle's width is 3 × 5/3 = 5cm.", "Check: if widths are 3 and 5, areas should be in ratio 9:25 — indeed 18:50 = 9:25 ✓"],
    markScheme: [ { pts: 1, desc: "Found the area ratio (50/18 = 25/9)." }, { pts: 2, desc: "Correctly took the square root to find the length ratio (5/3), not just used the area ratio directly." }, { pts: 1, desc: "Computed the larger width correctly (5cm) and checked it." } ] },
  { id: "o25", section: "B", topic: "seating", q: "A password uses 2 different letters from {A,B,C,D} (in order) followed by 2 different digits from {1,2,3} (in order). How many different passwords are possible?", answer: "72", tactic: "Count in order, then multiply independent parts.", sol: ["For the letters: 4 choices for the first, 3 remaining for the second (must be different), giving 4×3=12 orderings.", "For the digits: 3 choices for the first, 2 remaining for the second, giving 3×2=6 orderings.", "Since the letter part and digit part are independent, multiply: 12×6=72."],
    markScheme: [ { pts: 1, desc: "Counted the letter orderings correctly (4×3=12)." }, { pts: 1, desc: "Counted the digit orderings correctly (3×2=6)." }, { pts: 2, desc: "Correctly multiplied the independent parts to reach 72." } ] },
  { id: "o26", section: "B", q: "Prove that if a whole number's square is even, the whole number itself must be even.", answer: "Proof (if n² is even then n is even).", tactic: "Assume the opposite, and hunt for a contradiction.", sol: ["Suppose, for contradiction, that n² is even but n is ODD.", "Since n is odd, write n=2k+1 for some whole number k. Then n²=(2k+1)²=4k²+4k+1=2(2k²+2k)+1.", "That final form is 2×(a whole number)+1, which is ODD — but we assumed n² was even. That's a contradiction.", "The assumption (n odd) must be false. So whenever n² is even, n itself must be even."],
    markScheme: [ { pts: 1, desc: "Explicitly assumed the opposite (n odd) for contradiction." }, { pts: 2, desc: "Correctly expanded (2k+1)² and showed it's odd." }, { pts: 1, desc: "Identified the contradiction and concluded correctly." } ] },
  { id: "o27", section: "A", q: "A farm has some cows and some chickens, 15 animals in total with 46 legs (cows have 4 legs, chickens have 2). How many cows are there?", answer: "8 cows", tactic: "Introduce a letter for each unknown, then form two equations.", sol: ["Let c be cows and h be chickens. c+h=15 (total animals) and 4c+2h=46 (total legs).", "Divide the legs equation by 2: 2c+h=23.", "Subtract the animals equation (c+h=15) from this: (2c+h)−(c+h)=23−15, giving c=8.", "There are 8 cows (and 7 chickens). Check: 8×4+7×2=32+14=46 ✓"],
    markScheme: [ { pts: 1, desc: "Set up both equations correctly (c+h=15, 4c+2h=46)." }, { pts: 1, desc: "Simplified and solved correctly for c=8." } ] },
  { id: "o28", section: "B", q: "Four different positive whole numbers have a sum of 22. What is the SMALLEST that the largest of them could possibly be?", answer: "7", tactic: "Push to extremes: minimise the spread, not just one number.", sol: ["To make the largest as small as possible, make all four numbers as close together as possible.", "22÷4=5.5, so try numbers near 5.5: the four closest different positive whole numbers are 4,5,6,7, which sum to exactly 22.", "Could the largest be 6 or smaller? Then all four numbers are different and at most 6, so the biggest possible sum is 6+5+4+3=18, less than 22 — impossible.", "So the largest cannot be 6 or less, but 7 works (4+5+6+7=22). The smallest possible value of the largest number is 7."],
    markScheme: [ { pts: 1, desc: "Stated the strategy: make the four numbers as close together as possible." }, { pts: 1, desc: "Tried numbers near 22÷4=5.5 and found 4,5,6,7 sums to 22." }, { pts: 2, desc: "Showed the largest being 6 or less is impossible." } ] },
  { id: "o29", section: "A", q: "How many different total scores can you make by rolling two ordinary dice and adding the two numbers shown?", answer: "11", tactic: "Try small cases: find the smallest and largest, then check for gaps.", sol: ["The smallest possible total is 1+1=2. The largest possible total is 6+6=12.", "Every whole number from 2 to 12 can be achieved (e.g. 2=1+1, 3=1+2, ..., 12=6+6), with no gaps.", "There are 12−2+1=11 different possible totals."],
    markScheme: [ { pts: 1, desc: "Found the smallest possible total (2) and largest possible total (12)." }, { pts: 1, desc: "Recognised every value in between is achievable, giving 11 totals." } ] },
  { id: "o30", section: "B", q: "A four-digit number is 4A3B, where A and B are single unknown digits and B is the units digit. The number is divisible by both 5 and 9. Find all possible values of the number.", answer: "4230 and 4635", tactic: "Combine divisibility rules and test each case in turn.", sol: ["Divisible by 5 means the units digit B is 0 or 5.", "Divisible by 9 means the digit sum 4+A+3+B is a multiple of 9, i.e. 7+A+B is a multiple of 9.", "If B=0: 7+A is a multiple of 9, and since A is a single digit (0-9), A=2 (giving 9). Number: 4230.", "If B=5: 12+A is a multiple of 9, and since A is a single digit, A=6 (giving 18). Number: 4635.", "The two possible numbers are 4230 and 4635."],
    markScheme: [ { pts: 1, desc: "Used the divisible-by-5 rule to restrict B to 0 or 5." }, { pts: 1, desc: "Used the digit-sum rule for divisibility by 9." }, { pts: 2, desc: "Correctly solved both cases (B=0 and B=5) for valid A." } ] },
  { id: "o31", section: "A", q: "Find the value of 100 − 99 + 98 − 97 + ... + 2 − 1 (counting down from 100 in pairs).", answer: "50", tactic: "Pair consecutive terms: each bracket collapses to the same value.", sol: ["Group into pairs: (100−99)+(98−97)+...+(2−1). Each bracket equals 1.", "There are 100 numbers total, giving 100÷2=50 pairs.", "The total is 50×1=50."],
    markScheme: [ { pts: 1, desc: "Grouped the expression into pairs correctly." }, { pts: 1, desc: "Found each pair equals 1." }, { pts: 1, desc: "Counted 50 pairs and concluded 50." } ] },
  { id: "o32", section: "A", q: "A right-angled triangle has one 90° angle, and the ratio of the other two angles is 2:3. Find the two unknown angles.", answer: "36° and 54°", tactic: "Introduce a letter: one part = one unknown.", sol: ["The other two angles are 2k and 3k. Angles sum to 180°, so 90+2k+3k=180.", "This gives 5k=90, so k=18.", "The two unknown angles are 2×18=36° and 3×18=54°. Check: 90+36+54=180 ✓"],
    markScheme: [ { pts: 1, desc: "Set up the two unknown angles as 2k and 3k." }, { pts: 1, desc: "Formed and solved the correct equation 90+2k+3k=180." }, { pts: 1, desc: "Found both angles (36°, 54°) and checked the total." } ] },
  { id: "o33", section: "B", topic: "angleParallel", q: "Two parallel lines are crossed by a transversal, creating co-interior angles of (3x+10)° and (2x+15)°. Find x and both angles.", answer: "x=31; angles 103° and 77°", tactic: "Use the parallel-line angle facts to form an equation.", sol: ["Co-interior angles always add to 180°, so (3x+10)+(2x+15)=180.", "Simplify: 5x+25=180, so 5x=155, giving x=31.", "The two angles are 3(31)+10=103° and 2(31)+15=77°.", "Check: 103+77=180 ✓"],
    markScheme: [ { pts: 1, desc: "Used the co-interior angle fact (sum to 180°)." }, { pts: 1, desc: "Formed the correct equation (3x+10)+(2x+15)=180." }, { pts: 1, desc: "Solved correctly for x=31." }, { pts: 1, desc: "Computed both angles and checked the total." } ] },
  { id: "o34", section: "B", q: "The whole numbers 1 to 10 are written on a board. You repeatedly pick any two numbers, erase them, and write their sum instead. After 9 such moves, only one number remains. What must that number be, and why?", answer: "55, and it must always be 55 regardless of the moves made.", tactic: "Find an invariant: what stays fixed with every move?", sol: ["Consider the TOTAL of all numbers on the board. When two numbers a and b are erased and replaced by a+b, the total is unchanged: it loses a+b (erased) and immediately gains a+b (written) — net zero change.", "So the total sum is an INVARIANT: it never changes, no matter which two numbers you pick each time.", "The starting total is 1+2+...+10 = 55.", "Since the total never changes, the single number left at the end must be exactly 55."],
    markScheme: [ { pts: 1, desc: "Identified the total sum of all numbers on the board as the invariant." }, { pts: 1, desc: "Showed replacing a,b with a+b leaves the total unchanged." }, { pts: 1, desc: "Computed the starting total (55)." }, { pts: 1, desc: "Concluded the final number must be 55." } ] },
  { id: "o35", section: "B", topic: "pigeonhole", q: "Nine people attend a party. Each person shakes hands with some of the others (possibly none, possibly all 8 others), but nobody shakes their own hand. Prove that at least two people at the party have shaken the same number of hands as each other.", answer: "Proof — always true, regardless of who shakes whose hand.", tactic: "Find the pigeons and holes — they aren't always obvious.", sol: ["Each person's handshake count is a whole number from 0 to 8 — 9 possible values for 9 people, so pigeonhole doesn't immediately force a repeat, UNLESS 0 and 8 can't both happen at once.", "If someone shook 0 hands, then nobody at the party shook ALL 8 other people's hands (since that person shook nobody's). So 0 and 8 cannot both occur among the 9 handshake-counts.", "That means only 8 handshake-counts (not 9) are actually available to be shared among the 9 people.", "With 9 people (pigeons) and only 8 possible handshake-counts (holes), by the pigeonhole principle at least two people must have the same handshake count."],
    markScheme: [ { pts: 1, desc: "Recognised the handshake-count range is 0 to 8 (9 possible values) for 9 people." }, { pts: 2, desc: "Correctly argued that 0 and 8 cannot both occur, leaving only 8 available values." }, { pts: 1, desc: "Applied the pigeonhole principle correctly to conclude a repeat is forced." } ] },
  { id: "o36", section: "A", q: "A meal deal lets you choose 1 of 3 sandwiches and 1 of 4 drinks. How many different meal combinations are possible?", answer: "12", tactic: "Count in order: a choice for each position, multiplied.", sol: ["For each of the 3 sandwich choices, there are 4 possible drinks to go with it.", "The total number of combinations is 3×4=12."],
    markScheme: [ { pts: 1, desc: "Recognised that for each sandwich choice there are 4 drink choices." }, { pts: 1, desc: "Multiplied correctly to reach 12." } ] },
  { id: "o37", section: "A", q: "Prove that you cannot have three consecutive whole numbers that are all even.", answer: "Proof (impossible — consecutive numbers always alternate parity).", tactic: "Assume the opposite, and hunt for a contradiction.", sol: ["Suppose, for contradiction, that n and n+1 are BOTH even.", "If n is even, n=2k for some whole number k. Then n+1=2k+1, which is ODD by definition — but we assumed n+1 was even. That's a contradiction.", "So n and n+1 can never both be even — consecutive whole numbers always alternate parity, so three consecutive numbers can never all be even."],
    markScheme: [ { pts: 1, desc: "Assumed the opposite explicitly (n and n+1 both even)." }, { pts: 1, desc: "Correctly showed n+1=2k+1 is odd, contradicting the assumption." } ] },
  { id: "o38", section: "A", topic: "ratioChain", q: "A recipe uses flour and sugar in the ratio 5:2. If 350g of flour is used, how much sugar is needed?", answer: "140g", tactic: "Find the value of one part, then scale up.", sol: ["5 parts = 350g, so 1 part = 350÷5 = 70g.", "Sugar (2 parts) = 2×70 = 140g."],
    markScheme: [ { pts: 1, desc: "Found the value of 1 part (70g) from the flour amount." }, { pts: 1, desc: "Computed the sugar amount correctly (140g)." } ] },
  { id: "o39", section: "A", q: "Using the digits 1,2,3,4 exactly once each, form a 4-digit number. What is the difference between the largest and smallest possible such numbers?", answer: "3087", tactic: "Use place value: extremes come from ordering the digits.", sol: ["To make the LARGEST number, put the biggest digits in the highest place values: 4321.", "To make the SMALLEST number, put the smallest digits in the highest place values: 1234.", "The difference is 4321 − 1234 = 3087."],
    markScheme: [ { pts: 1, desc: "Correctly formed the largest number (4321) by descending digit order." }, { pts: 1, desc: "Correctly formed the smallest number (1234) by ascending digit order." }, { pts: 1, desc: "Computed the difference correctly (3087)." } ] },
  { id: "o40", section: "B", q: "A row of 7 coins alternates Heads, Tails, Heads, Tails, Heads, Tails, Heads (3 Tails, 4 Heads). In one move, you may flip any TWO ADJACENT coins together. Can you ever reach all 7 coins showing Heads?", answer: "No, it's impossible.", tactic: "Find an invariant: track the parity of one quantity.", sol: ["Track the number of Tails. Flipping two adjacent Heads turns them to Tails: tails count +2. Flipping two adjacent Tails turns them to Heads: tails count −2. Flipping one Head and one Tail swaps them: tails count changes by 0.", "So every move changes the tails count by −2, 0, or +2 — always an EVEN change. This means the PARITY of the tails count never changes.", "The starting tails count is 3, which is ODD, so the tails count must stay odd forever.", "All-Heads means 0 tails, which is even — but the tails count can only ever be odd. So it's impossible to reach all Heads."],
    markScheme: [ { pts: 1, desc: "Chose the tails-count as the invariant to track." }, { pts: 2, desc: "Correctly analysed all three flip-cases (HH, TT, HT/TH) and their effect on the tails count." }, { pts: 1, desc: "Concluded correctly using the starting odd count vs the target even count." } ] },
  { id: "o41", section: "B", q: "A 6×6 board (36 squares) is coloured like a chessboard (18 black, 18 white). Two opposite corner squares, which are always the SAME colour on this board, are removed, leaving 34 squares. Can these be tiled exactly by 17 dominoes? Explain using colouring.", answer: "No, it's impossible.", tactic: "Use a colouring argument: each domino must cover one square of each colour.", sol: ["Every domino covers two adjacent squares, and adjacent squares on a chessboard colouring are always different colours.", "So a full tiling by 17 dominoes must cover exactly 17 black and 17 white squares.", "The two removed corners are the same colour (say black), leaving 18−2=16 black and 18 white squares — not equal.", "Since a tiling needs 17 of each colour but only 16 black remain, no such tiling is possible."],
    markScheme: [ { pts: 1, desc: "Identified that each domino covers one black and one white square." }, { pts: 1, desc: "Stated a tiling needs equal black/white counts (17 each)." }, { pts: 2, desc: "Correctly computed the remaining colour counts (16 black, 18 white) and concluded impossibility." } ] },
  { id: "o42", section: "A", q: "A grid is coloured like a chessboard. A counter starts on a white square, and each move slides it to an ADJACENT square (sharing an edge). What colour must the counter be on after 15 moves?", answer: "Black", tactic: "Use colouring: adjacent squares always differ in colour, so each move flips the colour.", sol: ["Adjacent squares on a chessboard colouring are always different colours, so every move flips the counter's colour.", "Starting on white, after 1 move it's black, after 2 moves white again — after an odd number of moves it is black, after an even number it is white.", "15 is odd, so after 15 moves the counter must be black."],
    markScheme: [ { pts: 1, desc: "Recognised that each move flips the counter's colour." }, { pts: 1, desc: "Correctly used the parity of 15 (odd) to conclude black." } ] },
  { id: "o43", section: "A", q: "From 6 different contestants, how many different PAIRS of finalists can be chosen?", answer: "15", tactic: "Count in order, then adjust for the symmetry between a pair and its reverse.", sol: ["Counting in order: 6 choices for the first finalist, 5 for the second, giving 6×5=30 ordered pairs.", "Each unordered pair, like {A,B}, was counted twice in that 30 — once as AB, once as BA.", "So the true number of pairs is 30÷2=15."],
    markScheme: [ { pts: 1, desc: "Counted the ordered pairs correctly (6×5=30)." }, { pts: 1, desc: "Recognised each pair is counted twice and divided correctly to reach 15." } ] },
  { id: "o44", section: "B", topic: "pigeonhole", q: "A bag contains beads in only 5 colours. What is the least number of beads that must be drawn (without looking) to guarantee 3 beads of the same colour?", answer: "11", tactic: "Push to extremes: imagine the worst possible luck, colour by colour.", sol: ["The worst case draws as many beads as possible while keeping every colour's count BELOW 3, i.e. at most 2 of each of the 5 colours.", "That worst case uses 2×5=10 beads with no colour reaching 3.", "The 11th bead must push some colour's count to 3, since all 5 colours already have 2 each.", "So 11 beads guarantee 3 of one colour; 10 does not (the unlucky case: exactly 2 of each colour)."],
    markScheme: [ { pts: 1, desc: "Identified the worst case as 2 of each of the 5 colours." }, { pts: 1, desc: "Computed the worst-case total correctly (10)." }, { pts: 2, desc: "Concluded correctly that the 11th bead forces a 3rd of some colour." } ] },
  { id: "o45", section: "A", q: "A row of 8 numbers all start at 0. Each move, two of the numbers are chosen and 1 is added to each of them. After several moves, could the total of all 8 numbers be 15?", answer: "No, it's impossible.", tactic: "Find an invariant: track the parity of the total sum.", sol: ["Each move adds 1 to two different numbers, so the total sum increases by exactly 2 every move.", "Increasing a quantity by 2 never changes its parity, so the total sum's parity never changes.", "The starting total is 0, which is even, so the total must stay even after every move.", "15 is odd, so the total can never become 15."],
    markScheme: [ { pts: 1, desc: "Identified the total sum as the invariant to track." }, { pts: 1, desc: "Showed each move changes the total by exactly 2 (even)." }, { pts: 1, desc: "Linked the even starting total to the total always staying even." }, { pts: 1, desc: "Concluded correctly that 15 (odd) is unreachable." } ] },
  { id: "o46", section: "B", q: "Five different positive whole numbers have a sum of 40. What is the SMALLEST that the largest of them could possibly be?", answer: "10", tactic: "Push to extremes: minimise the spread, not just one number.", sol: ["To make the largest as small as possible, make all five numbers as close together as possible.", "40÷5=8, and the five closest different positive whole numbers are 6,7,8,9,10, which sum to exactly 40.", "Could the largest be 9 or less? Then all five numbers are different and at most 9, so the biggest possible sum is 5+6+7+8+9=35, less than 40 — impossible.", "So the largest cannot be 9 or less, but 10 works (6+7+8+9+10=40). The smallest possible value of the largest number is 10."],
    markScheme: [ { pts: 1, desc: "Stated the strategy: make the five numbers as close together as possible." }, { pts: 1, desc: "Found 6,7,8,9,10 summing to exactly 40." }, { pts: 2, desc: "Showed the largest being 9 or less is impossible." } ] },
  { id: "o47", section: "A", q: "A code is formed using 3 different digits chosen from {1,2,3,4}, arranged in a row (order matters, no repeats). How many different codes are possible?", answer: "24", tactic: "Count in order: a choice for each position, multiplied.", sol: ["There are 4 choices for the first digit.", "For each of those, 3 remaining digits for the second position (must be different from the first).", "For each of those, 2 remaining digits for the third position.", "Total: 4×3×2=24."],
    markScheme: [ { pts: 1, desc: "Counted the choices correctly at each position (4, then 3, then 2)." }, { pts: 1, desc: "Multiplied correctly to reach 24." } ] },
  { id: "o48", section: "A", q: "Prove that √3 cannot be written as a whole number.", answer: "Proof — √3 is not a whole number.", tactic: "Assume the opposite, and hunt for a contradiction.", sol: ["Suppose, for contradiction, that √3 IS a whole number, call it n. Then n²=3 (squaring both sides).", "Check whole numbers: 1²=1 and 2²=4. There is no whole number whose square is 3 — it would have to sit strictly between 1 and 2, which is impossible for a whole number.", "The assumption that √3 is a whole number leads to an impossible requirement. So √3 cannot be a whole number."],
    markScheme: [ { pts: 1, desc: "Explicitly assumed the opposite (√3 IS a whole number n)." }, { pts: 1, desc: "Correctly derived that n² would have to equal 3." }, { pts: 1, desc: "Showed no whole number's square equals 3 (strictly between 1² and 2²)." }, { pts: 1, desc: "Concluded clearly that √3 is not a whole number." } ] },
  { id: "o49", section: "A", q: "Three consecutive odd numbers sum to 51. Find them.", answer: "15, 17, 19", tactic: "Introduce a letter: name the smallest of the three.", sol: ["Consecutive odd numbers step by 2, so call them n, n+2, n+4.", "Their sum is 3n+6=51, so 3n=45, giving n=15.", "The numbers are 15, 17, 19. Check: 15+17+19=51 ✓"],
    markScheme: [ { pts: 1, desc: "Defined the three consecutive odd numbers as n, n+2, n+4." }, { pts: 1, desc: "Solved 3n+6=51 correctly to find n=15 and stated all three numbers." } ] },
  { id: "o50", section: "A", q: "A quadrilateral has three angles of 85°, 95° and 100°. Find the fourth angle.", answer: "80°", tactic: "Use the angle-sum fact for quadrilaterals (360°).", sol: ["Angles in a quadrilateral sum to 360°.", "The three known angles add to 85+95+100=280°.", "The fourth angle is 360−280=80°."],
    markScheme: [ { pts: 1, desc: "Used the correct angle-sum fact for a quadrilateral (360°)." }, { pts: 1, desc: "Computed the fourth angle correctly (80°)." } ] },
];
// Total marks for a problem = its method-mark scheme, PLUS one automatic accuracy mark for
// the final answer (auto-graded by olympiadMatch — never self-assessed, since that part CAN
// be checked objectively). Mirrors how the real JMO separates "M" method marks from "A" marks.
export function olympiadMarksTotal(p) { return (p.markScheme || []).reduce((a, c) => a + c.pts, 0) + 1; }

/* ---------------- badges ---------------- */
export const BADGES = {
  firstHop: { label: "First Hop", emoji: "🦘", note: "Answer your first question" },
  tenStreak: { label: "Sharp Shooter", emoji: "🎯", note: "10 correct in a row" },
  century: { label: "Centurion", emoji: "💯", note: "Reach 100 XP" },
  fiveHundred: { label: "Maths Hero", emoji: "🦸", note: "Reach 500 XP" },
  scholar: { label: "Scholar", emoji: "🎓", note: "Read 5 lessons" },
  yearNine: { label: "Year 9 Brain", emoji: "🧠", note: "Answer a Year 9+ question correctly" },
  tester: { label: "Test Taker", emoji: "📝", note: "Finish a mock paper" },
  goldPaper: { label: "Gold Standard", emoji: "🥇", note: "Score over 80 in a mock paper" },
  olympian: { label: "Olympian", emoji: "🏛️", note: "Tackle an Olympiad problem" },
  curious: { label: "Curious Mind", emoji: "💡", note: "Ask the tutor for help" },
  weekStreak: { label: "On Fire", emoji: "🔥", note: "Play 3 days in a row" },
  collector: { label: "Collector", emoji: "🃏", note: "Own 10 different creatures" },
  legendFinder: { label: "Legend Finder", emoji: "🌟", note: "Pull a Legendary creature" },
  academyStart: { label: "Apprentice", emoji: "🎓", note: "Finish your first Academy module" },
  academyGrad: { label: "Academy Graduate", emoji: "🏅", note: "Complete every Academy module" },
  muddleKing: { label: "Counted the King In", emoji: "👑", note: "Beat all 10 bosses and finish the whole quest" },
  twentyStreak: { label: "Dead Eye", emoji: "🏹", note: "20 correct in a row" },
  tier5: { label: "Deep Roots", emoji: "🌳", note: "Reach Tier 5 in any topic" },
  giffEntry: { label: "Gifford Bound", emoji: "🏙️", note: "Answer your first question in the Gifford module" },
  giffComplete: { label: "City Reckoned", emoji: "⚖️", note: "Beat all bosses in the Gifford module" },
  packRat: { label: "Pack Rat", emoji: "📦", note: "Open 5 card packs" },
};

/* ============================================================
   THE STORY — The Kangaroo Quest and the Coming of the Muddle
   Chapter 1 unlocked from the start; chapter n+1 unlocks when boss n falls.
   ============================================================ */
export const PACK_COST = 20; // correct answers per pack

export const JUNIOR_RARITY = {
  common:    { label: "Common",    weight: 48, str: 1,  minLevel: 1, color: "#8fa3b8", glow: "rgba(143,163,184,.5)",  foil: false },
  uncommon:  { label: "Uncommon",  weight: 27, str: 2,  minLevel: 3, color: T.green,   glow: "rgba(61,203,120,.55)",  foil: false },
  rare:      { label: "Rare",      weight: 15, str: 4,  minLevel: 5, color: T.teal,    glow: "rgba(34,200,184,.55)",  foil: false },
  epic:      { label: "Epic",      weight:  7, str: 8,  minLevel: 5, color: T.violet,  glow: "rgba(124,92,255,.6)",   foil: true  },
  legendary: { label: "Legendary", weight:  3, str: 16, minLevel: 5, color: T.yellow,  glow: "rgba(255,201,60,.75)",  foil: true  },
  boss:      { label: "Boss",      weight:  0, str: 0,  minLevel: 1, color: "#c0392b", glow: "rgba(192,57,43,.75)",   foil: true  },
};
export const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary"];
// A duplicate pull (after the one reroll) converts to stars instead of a wasted card.
export const DUPLICATE_STARS = { common: 2, uncommon: 2, rare: 3, epic: 4, legendary: 5 };

/* ---------------- adventures: classes, items, upgrades ---------------- */
export const CLASSES = {
  tank:   { key: "tank",   label: "Tank",       emoji: "🛡️", color: "#8fa3b8", move: "Shield Wall",  moveDesc: "Once per adventure: a failed dice roll counts as a success." },
  healer: { key: "healer", label: "Healer",     emoji: "💚", color: "#3dcb78", move: "Mend",         moveDesc: "Once per adventure: turn a wrong puzzle answer back onto the good path." },
  wizard: { key: "wizard", label: "Wizard",     emoji: "🔮", color: "#7d5fff", move: "Reveal",       moveDesc: "Once per adventure: a free hint on one hard puzzle." },
  melee:  { key: "melee",  label: "Melee DPS",  emoji: "⚔️", color: "#ff6b6b", move: "Strike Again", moveDesc: "Once per adventure: reroll a die and keep the new result." },
  ranged: { key: "ranged", label: "Ranged DPS", emoji: "🏹", color: "#f4a62a", move: "Scout Ahead",  moveDesc: "Once per adventure: peek at where each choice in a scene will lead." },
};
export const JUNIOR_CARD_CLASS = {
  cubble: "tank", pebble: "tank", squarby: "tank", multimoo: "tank",
  addy: "healer", frostcal: "healer", flaskfox: "healer",
  countra: "wizard", loopy: "wizard", owlgorith: "wizard",
  tritip: "melee", sparkfin: "melee", fractail: "melee",
  hunchik: "ranged", zoomby: "ranged", burrowl: "ranged", voltbird: "ranged",
};
export const cardClass = (id) => CLASSES[CARD_CLASS[id]] || null;
export const isUpgraded = (progress, cardId) => {
  const adv = ADVENTURES[cardId];
  const found = ((progress || {}).cardItems || {})[cardId] || [];
  return !!adv && adv.items.every((item) => found.includes(item.id));
};
// Render view of a card with item stat boosts applied; fully upgraded commons display as uncommon.
export function adventureCardView(card, progress) {
  const adv = ADVENTURES[card.id];
  if (!adv) return card;
  const items = ((progress || {}).cardItems || {})[card.id] || [];
  if (!items.length) return card;
  const s = [...card.s];
  for (const it of adv.items) if (items.includes(it.id)) s[it.stat] = Math.min(10, s[it.stat] + 1);
  const nextTier = RARITY_ORDER[RARITY_ORDER.indexOf(card.r) + 1];
  const complete = adv.items.every((item) => items.includes(item.id));
  return { ...card, s, r: complete && nextTier ? nextTier : card.r };
}
// Same as adventureCardView, but explicitly scoped to ONE module's own ADVENTURES bundle —
// needed by Card Lab's three grouped sections (Primary/Junior/Intermediate), which show every
// module's cards regardless of which module is currently active (adventureCardView above only
// ever sees the active module's own bundle via the global rebinding).
export function moduleCardView(card, progress, m) {
  const adv = m.ADVENTURES[card.id];
  if (!adv) return card;
  const items = ((progress || {}).cardItems || {})[card.id] || [];
  if (!items.length) return card;
  const s = [...card.s];
  for (const it of adv.items) if (items.includes(it.id)) s[it.stat] = Math.min(10, s[it.stat] + 1);
  const nextTier = RARITY_ORDER[RARITY_ORDER.indexOf(card.r) + 1];
  const complete = adv.items.every((item) => items.includes(item.id));
  return { ...card, s, r: complete && nextTier ? nextTier : card.r };
}

/* Choose-your-path adventures. One per common card; each fully upgrades its hero.
   Scene types: story (text, optional grantItem/grantComponent/setMid, next),
   choice (options with preview lines for Scout), dice (predict question then roll),
   puzzle (hard static question; correct → good, wrong → mid), forge, end. */
export const ADVENTURE_HEROES = Object.keys(ADVENTURES);

/* ============================================================
   LEVELS & THE BOSS TOWER
   10 levels. Boss n sits at the end of level n; beating it needs
   enough combined card strength (unique cards only) and unlocks
   level n+1 plus story chapter n+1.
   ============================================================ */
export const JUNIOR_MAX_LEVEL = 10;
/* Boss portrait art. Add more entries here as pieces are commissioned —
   any boss without an entry falls back to its emoji, so this is safe to
   fill in gradually. Keep pieces roughly square, ~600px, JPEG-compressed. */
export const JUNIOR_BOSSES = [
  { n: 1,  name: "The First Smudge",       emoji: "👣", need: 4,   r: "common",    s: [1,2,4,1,5],   bv: 13, set: "little_reckoning", lore: "A thumbprint on the world, squatting on the Counting Stone. Every time your eyes arrive, they slide off and come back apologising." },
  { n: 2,  name: "Sister Roughly",         emoji: "🌫️", need: 8,   r: "common",    s: [1,2,2,1,6],   bv: 12, set: "little_reckoning", lore: "She drifts through markets in a shawl made of maybes. 'Close enough, dears.' It is so much easier. That is the horror of her." },
  { n: 3,  name: "The Baron of Backwards", emoji: "↩️", need: 13,  r: "uncommon",  s: [3,3,8,2,2],   bv: 16, set: "little_reckoning", lore: "He undoes. Arrows return to their bows apologising. Never show him a beginning; he cannot resist trying to get behind it." },
  { n: 4,  name: "The Forgetting Fog",     emoji: "🌁", need: 18,  r: "uncommon",  s: [2,3,4,7,2],   bv: 16, set: "little_reckoning", lore: "Nobody remembers fighting it. You know you did, because you are on the far side of it and your boots are wet." },
  { n: 5,  name: "General Guesswork",      emoji: "🎲", need: 26,  r: "rare",      s: [8,3,6,4,3],   bv: 25, set: "little_reckoning", lore: "His army attacks presumably from the left. Arrows fired at them wander off to land somewhere statistically reasonable." },
  { n: 6,  name: "The Unshape",            emoji: "🌀", need: 34,  r: "rare",      s: [3,9,4,5,3],   bv: 25, set: "little_reckoning", lore: "It eats geometry. Circles come out of it sad and lumpy, like the first pancake, like a wheel drawn by someone crying." },
  { n: 7,  name: "The Countless",          emoji: "🌪️", need: 50,  r: "epic",      s: [7,5,9,5,4],   bv: 32, set: "little_reckoning", lore: "A swarm that cannot be numbered. Count them one at a time and the count changes because you counted. Try counting another way." },
  { n: 8,  name: "Madam Nought",           emoji: "🕯️", need: 68,  r: "epic",      s: [5,5,8,9,4],   bv: 32, set: "little_reckoning", lore: "The Muddle King's herald. Twelve hundred years she carried his letters, and every answer that came back was a locked door." },
  { n: 9,  name: "The Almost",             emoji: "🌓", need: 90,  r: "legendary", s: [8,9,9,8,9],   bv: 43, set: "little_reckoning", lore: "The King's shadow: everything he nearly was. It does not lie. It shows you real might-have-beens, and they weigh nothing." },
  { n: 10, name: "The Muddle King",        emoji: "👑", need: 105, r: "legendary", s: [10,9,10,9,8], bv: 46, set: "little_reckoning", lore: "Nul, the uncounted number. He cannot be fought, because fighting a thing agrees that it is outside. He can only be counted in." },
];
export const bossForLevel = (lv) => BOSSES[Math.min(Math.max(lv, 1), MAX_LEVEL) - 1];

/* Boss trophy cards. Each boss drops its own card when defeated. These are a
   separate collection from the creature CARDS: they use the boss portrait art,
   carry their own strong stats, live in their own area of the Card Lab, and are
   deliberately NOT part of CARDS. That means they never appear in packs, never
   count toward the card-strength needed to challenge a boss, and never turn up
   as adventure companions. They are pure trophies. Stats climb with boss level;
   the signature (highest) stat rotates so each trophy has a different character.
   Stats order matches STAT_DEFS: [Arithmetic, Geometry, Logic, Science, Speed]. */
// Namespaced per module: every module has its own 10 bosses numbered 1-10, and `cards`
// is deliberately a SHARED object (so Card Lab can show all modules' collections
// together). Without the module prefix, "boss3" from Junior and "boss3" from Primary
// were the exact same key — beating Junior's boss 3 made Primary's boss-3 trophy show
// as already owned too, with no Primary strength or fighting required. moduleKey
// defaults to whichever module is currently active; callers that need a SPECIFIC
// module regardless of the ambient one (e.g. the "test" dev-shortcut, which only ever
// maxes out Junior) can pass it explicitly.
export const bossCardId = (n, moduleKey = ACTIVE_MODULE_KEY) => `boss_${moduleKey}_${n}`;
export let BOSSES = JUNIOR_BOSSES;
export let MAX_LEVEL = JUNIOR_MAX_LEVEL;
export function setBossesAndMaxLevel(bosses, maxLevel) { BOSSES = bosses; MAX_LEVEL = maxLevel; }
let _BOSS_ART = {};
export function setBossArt(art) { _BOSS_ART = art || {}; }
// Computed per-render (not a frozen constant) from whichever module is currently active,
// so each module's own boss roster and portrait art show up in its Boss Trophies section.
export function getBossCards() {
  return BOSSES.map((b) => {
    const s = b.s || [5, 5, 5, 5, 5];
    return {
      id: bossCardId(b.n), name: b.name, r: "boss", joeyR: b.r, n: b.n,
      img: _BOSS_ART[b.n], emoji: b.emoji,
      s, bv: b.bv || 20, set: b.set || null,
      primaryType: b.primaryType ?? computePrimaryType(s),
      flavor: b.lore.split(/(?<=[.!?])\s/)[0],
    };
  });
}

/* Level exam gate: each boss requires passing its own 25-question level paper
   with at least examPassMarkFor(level) correct. */
export const JUNIOR_EXAM_PASS_MARKS = { 1: 12, 2: 14, 3: 16, 4: 18, 5: 12, 6: 14, 7: 16, 8: 18, 9: 12, 10: 14 };
export const examPassMarkFor = (lv) => EXAM_PASS_MARKS[Math.min(Math.max(lv, 1), MAX_LEVEL)] || 18;
export const JUNIOR_examKindFor = (lv) => `level-${Math.min(Math.max(lv, 1), 10)}`;
export const JUNIOR_EXAM_NAMES = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`level-${i + 1}`, `Level ${i + 1} Mock Test`]));
// A player's best result for each level paper, read from their test history.
export const SHINY_MOCK_MARK = 21;
export const bestMockByKind = (progress) => { const b = {}; for (const h of (progress && progress.testHistory) || []) { if (h && (b[h.kind] == null || h.correct > b[h.kind])) b[h.kind] = h.correct; } return b; };
export const examClearedFor = (progress, lv) => (bestMockByKind(progress)[examKindFor(lv)] || 0) >= examPassMarkFor(lv);
// Shiny is a per-boss reward earned by returning to the boss and claiming it. It breeds
// consistency: each shiny trophy costs one SEPARATE strong mock pass (21+) of that boss's
// level paper. `shinyPasses` counts qualifying passes per paper; each shiny already claimed
// spends one, so an available claim exists only when you have more qualifying passes than
// shiny trophies for that paper.
export const shinyBossCountByKind = (progress, kind) => (progress.shinyBosses || []).filter((n) => examKindFor(n) === kind).length;
export const availableShinyClaims = (progress, kind) => Math.max(0, ((progress.shinyPasses || {})[kind] || 0) - shinyBossCountByKind(progress, kind));

// Combined strength of the collection: unique cards only, duplicates don't count.
export function collectionStrength(progress) {
  const owned = progress?.cards || {};
  let s = 0;
  for (const c of CARDS) if (owned[c.id]) {
    if (isUpgraded(progress, c.id)) {
      const nextTier = RARITY_ORDER[RARITY_ORDER.indexOf(c.r) + 1];
      s += (nextTier && RARITY[nextTier].str) || RARITY[c.r]?.str || 1;
    } else s += (RARITY[c.r]?.str || 1);
  }
  return s;
}
export const JUNIOR_MAX_STRENGTH_TOTAL = 144; // 12*2 (commons upgraded via adventures) + 5*4 (uncommons upgraded via adventures) + 5*4 (rares) + 6*8 (epics) + 2*16 (legendaries)

// Stars per correct answer scale with level: L1-3 → 1★, L4-6 → 2★, L7-9 → 3★, L10 → 4★
export const starsFor = (lv) => 1 + Math.floor((Math.max(1, lv) - 1) / 3);

// Anti-guessing star banking, shared by practice and mocks. `run` is how many correct
// answers in a row this one completes (1 = first of a streak, 2 = second, ...). A lone
// correct banks nothing; the 2nd of a streak pays for both (2x); each further correct
// in the streak pays once. `per` is the star value of a single correct answer. Because
// random guessing (about 1 in 5) almost never chains two in a row, it can no longer
// farm card packs — in either practice or a full mock paper.
export function streakStarGain(run, per) { if (run <= 1) return 0; if (run === 2) return per * 2; return per; }

// Per-topic Practice difficulty, auto-driven by topicStats (recordAnswer bumps it every
// 10 credit-eligible correct answers in that topic) rather than one shared global level —
// a player can be tier 8 in one topic and tier 1 in another, entirely independently. Falls
// back to the overall story-driven level (progress.unlockedLevel) when no topic is picked.
export const tierForTopic = (progress, key) => {
  if (!key) return Math.min(Math.max(progress.unlockedLevel || 1, 1), MAX_LEVEL);
  const t = (progress.topicStats || {})[key];
  return Math.min(Math.max((t && t.tier) || 1, 1), MAX_LEVEL);
};

// Map a game level (1-10) onto the internal generator difficulty bands (1-4)
export const levelToDiff = (lv) => lv <= 2 ? 1 : lv <= 4 ? 2 : lv <= 6 ? 3 : 4;

// Probability that a question at this level comes from the deep multi-step set
export const deepChance = (lv) => lv < 5 ? 0 : [0, 0, 0, 0, 0, 0.2, 0.35, 0.5, 0.65, 0.75, 0.85][lv];


// Stats order: [Arithmetic, Geometry, Logic, Science, Speed]
export const STAT_DEFS = [
  { key: "ari", label: "Arithmetic", emoji: "➕", color: T.coral    },
  { key: "geo", label: "Geometry",   emoji: "📐", color: T.green    },
  { key: "log", label: "Logic",      emoji: "🧠", color: T.violet   },
  { key: "sci", label: "Science",    emoji: "🔬", color: T.teal     },
  { key: "spd", label: "Speed",      emoji: "⚡", color: T.yellow   },
];

/* Embedded card artwork (base64 JPEG data URIs). Resized to 512x512. */
export const JUNIOR_CARDS = [
  // ---- COMMON (12) ----
  { id: "addy",      name: "Addy",       emoji: "🐜",  r: "common",    s: [3,1,2,1,6], bv: 13, set: "little_reckoning", flavor: "Adds up everything it sees, twice."            },
  { id: "countra",   name: "Countra",    emoji: "🐞",  r: "common",    s: [4,2,3,2,2], bv: 12, set: "little_reckoning", flavor: "Counts its own spots for fun."                  },
  { id: "tritip",    name: "Tri-Tip",    emoji: "🔺",  r: "common",    s: [1,6,2,1,2], bv: 13, set: "little_reckoning", flavor: "Three sides, no worries."                       },
  { id: "cubble",    name: "Cubble",     emoji: "🧊",  r: "common",    s: [2,2,1,5,1], bv: 11, set: "little_reckoning", flavor: "A cube with a very cool head."                  },
  { id: "hunchik",   name: "Hunchik",   emoji: "🦔",  r: "common",    s: [2,1,6,1,2], bv: 13, set: "little_reckoning", flavor: "Always has a clever hunch."                     },
  { id: "sparkfin",  name: "Sparkfin",  emoji: "🐠",  r: "common",    s: [1,1,2,5,3], bv: 12, set: "little_reckoning", flavor: "Bubbles tiny experiments."                      },
  { id: "zoomby",    name: "Zoomby",    emoji: "🐝",  r: "common",    s: [2,1,1,2,6], bv: 13, set: "little_reckoning", flavor: "Buzzes from sum to sum."                        },
  { id: "pebble",    name: "Pebble",    emoji: "🪨",  r: "common",    s: [2,4,2,2,1], bv: 11, set: "little_reckoning", flavor: "Solid, dependable, a bit slow."                 },
  { id: "loopy",     name: "Loopy",     emoji: "🐌",  r: "common",    s: [3,2,5,1,1], bv: 12, set: "little_reckoning", flavor: "Takes the scenic route to every answer."        },
  { id: "burrowl",   name: "Burrowl",   emoji: "🐛",  r: "common",    s: [3,1,2,5,1], bv: 12, set: "little_reckoning", flavor: "Digs through long division without blinking."   },
  { id: "squarby",   name: "Squarby",   emoji: "🟥",  r: "common",    s: [1,3,1,1,6], bv: 13, set: "little_reckoning", flavor: "Lives in a perfectly right-angled world."       },
  { id: "frostcal",  name: "Frostcal",  emoji: "❄️",  r: "common",    s: [4,2,2,4,1], bv: 13, set: "little_reckoning", flavor: "Keeps its calculations ice cold."               },
  // ---- UNCOMMON (5) + RARE (5) ----
  { id: "multimoo",  name: "Multimoo",  emoji: "🐄",  r: "uncommon",      s: [8,3,4,3,3], bv: 16, set: "little_reckoning", flavor: "Multiplies the herd in seconds."                },
  { id: "anglorap",  name: "Angloraptor",emoji:"🦖", r: "rare",      s: [3,8,4,3,4], bv: 26, set: "little_reckoning", flavor: "Measures every angle before it pounces."        },
  { id: "owlgorith", name: "Owlgorithm",emoji: "🦉",  r: "uncommon",      s: [4,3,8,4,2], bv: 16, set: "little_reckoning", flavor: "Solves puzzles in its sleep."                   },
  { id: "flaskfox",  name: "Flaskfox",  emoji: "🦊",  r: "uncommon",      s: [3,3,4,8,4], bv: 16, set: "little_reckoning", flavor: "Carries a portable lab in its tail."            },
  { id: "cheetawat", name: "Cheetawatt",emoji: "🐆",  r: "rare",      s: [3,3,3,4,8], bv: 25, set: "little_reckoning", flavor: "Times itself with every dash."                  },
  { id: "fractail",  name: "Fractail",  emoji: "🦝",  r: "uncommon",      s: [4,4,5,3,7], bv: 17, set: "little_reckoning", flavor: "Splits snacks into perfect fractions."          },
  { id: "hexabug",   name: "Hexabug",   emoji: "🐢",  r: "rare",      s: [3,7,4,4,3], bv: 24, set: "little_reckoning", flavor: "Wears a flawless hexagon shell."                },
  { id: "voltbird",  name: "Voltbird",  emoji: "🦅",  r: "uncommon",      s: [3,3,4,5,7], bv: 16, set: "little_reckoning", flavor: "Charges through the sky at full speed."         },
  { id: "probear",   name: "Probear",   emoji: "🐻",  r: "rare",      s: [5,3,7,4,3], bv: 25, set: "little_reckoning", flavor: "Never bets without calculating the odds first." },
  { id: "seqviper",  name: "Seqviper",  emoji: "🐍",  r: "rare",      s: [6,3,5,3,6], bv: 26, set: "little_reckoning", flavor: "Follows every pattern to its logical end."      },
  // ---- EPIC (6) ----
  { id: "primearch", name: "Primearch", emoji: "🐲",  r: "epic",      s: [9,5,8,6,5], bv: 34, set: "little_reckoning", flavor: "Speaks only in prime numbers."                  },
  { id: "geodrake",  name: "Geodrake",  emoji: "🐉",  r: "epic",      s: [5,9,6,6,5], bv: 32, set: "little_reckoning", flavor: "Breathes perfect polygons."                     },
  { id: "paradox",   name: "Paradox",   emoji: "🦑",  r: "epic",      s: [6,5,9,6,5], bv: 32, set: "little_reckoning", flavor: "This card's flavour text is false."             },
  { id: "quantakit", name: "Quantakit", emoji: "🐙",  r: "epic",      s: [5,6,6,9,5], bv: 32, set: "little_reckoning", flavor: "Runs eight experiments at once."                },
  { id: "sphinxa",   name: "Sphinxa",   emoji: "🦁",  r: "epic",      s: [6,7,8,5,6], bv: 33, set: "little_reckoning", flavor: "Guards riddles older than maths itself."        },
  { id: "novabear",  name: "Novabear",  emoji: "🐻‍❄️", r: "epic",      s: [6,6,7,8,5], bv: 33, set: "little_reckoning", flavor: "Glows with pure cosmic curiosity."             },
  // ---- LEGENDARY (2) ----
  { id: "infinitus", name: "Infinitus", emoji: "🌌",  r: "legendary", s: [10,9,10,9,8], bv: 47, set: "little_reckoning", flavor: "Knows the answer to every question. Almost." },
  { id: "euclidon",  name: "Euclidon",  emoji: "🛕",  r: "legendary", s: [8,10,9,8,9],  bv: 44, set: "little_reckoning", flavor: "The ancient master of all shapes and proof."  },
];

/* ============================================================
   OLYMPIAD ACADEMY — prewritten teaching curriculum.
   No AI required. Taught by the card creatures, rising in rarity.
   Structure: ACADEMY = [ lesson, ... ]
   Each lesson: { id, title, teacher (card id), rarity, mins, intro, steps:[...] }
   Step kinds:
     - {kind:"teach", heading, body:[paragraphs]}            read-only teaching
     - {kind:"example", problem, working:[steps], answer}    worked example to read
     - {kind:"order", problem, prompt, shuffled:[...], correct:[indices in right order], explain}
                                                              child orders the solution steps (auto-marked)
     - {kind:"choose", problem, prompt, options:[...], correctIndex, explain}
                                                              child picks the best-written step (auto-marked)
     - {kind:"write", problem, prompt, model:[...], answer, markScheme:[{pts,desc}, ...]}
                                                              child free-writes, then self-marks against a real
                                                              mark scheme (pts sum = marks available for the step);
                                                              marks earned convert straight to banked stars
   ============================================================ */
export const JUNIOR_ACADEMY = [
  /* ===================== MODULE 1: WHAT IS A WRITTEN SOLUTION ===================== */
  {
    id: "m1",
    title: "What is a written solution?",
    teacher: "addy",
    rarity: "common",
    mins: 12,
    intro: "In a multiple-choice quiz, only the final letter you pick matters, and nobody sees the thinking behind it. In the Olympiad, the thinking IS the answer: a bare number earns almost no marks on its own. This module shows exactly what a complete written solution looks like, and why it earns full marks.",
    steps: [
      { kind: "teach", heading: "An answer is not a solution", body: [
        "In a multiple-choice quiz, the only thing that matters is the final letter you pick. Nobody sees your thinking.",
        "In the Olympiad, the thinking IS the answer. A bare number like \"42\" earns almost no marks, even if it is correct. The marks are for SHOWING WHY it must be 42.",
        "Think of it like a treasure map. The treasure (the answer) is nice, but the examiner wants to see the MAP that leads there." ] },
      { kind: "teach", heading: "The three parts of every solution", body: [
        "Every good written solution has three parts, in this order:",
        "1. STATE — say what you know and what you are looking for.",
        "2. WORK — show each step of reasoning, one idea at a time.",
        "3. CONCLUDE — write a clear final sentence with the answer." ] },
      { kind: "example", problem: "A crate holds 3 boxes. Each box holds 4 acorns. How many acorns altogether? Write a full solution.",
        working: [
          "STATE: There are 3 boxes, and each box holds 4 acorns. I want the total number of acorns.",
          "WORK: The total is 3 groups of 4, which is 3 × 4 = 12.",
          "CONCLUDE: So the crate holds 12 acorns altogether." ],
        answer: "12 acorns" },
      { kind: "example", problem: "A shelf holds 5 red books and 7 blue books. Write a full solution to find the total number of books.",
        working: [
          "STATE: There are 5 red books and 7 blue books on the shelf. I want the total number of books.",
          "WORK: The total is 5 + 7 = 12.",
          "CONCLUDE: So the shelf holds 12 books altogether." ],
        answer: "12 books" },
      { kind: "teach", heading: "Why bother with all those words?", body: [
        "It feels slow at first. But those three sentences are exactly what earns full marks.",
        "The examiner can follow your thinking with no guessing. Every claim is backed up. That is what a mathematician does.",
        "From now on, every solution you write will STATE, WORK, then CONCLUDE." ] },
      { kind: "choose", problem: "A jar holds 5 red beads and 7 black beads. How many beads in total?",
        prompt: "Which is the best STATE sentence to begin the solution?",
        options: [
          "12.",
          "I want to add them up.",
          "The jar has 5 red beads and 7 black beads, and I want the total number of beads.",
          "Beads are easy." ],
        correctIndex: 2,
        explain: "A good STATE sentence names what you know (5 red, 7 black) AND what you are looking for (the total). Option 3 does both." },
      { kind: "order", problem: "A hiker walks 6 steps north, then 8 steps north. How far north in total?",
        prompt: "Drag the three parts into the correct order for a full solution.",
        shuffled: [
          "WORK: The total distance is 6 + 8 = 14 steps.",
          "CONCLUDE: So the hiker is 14 steps north of where they started.",
          "STATE: A hiker walks 6 steps then 8 steps, all north. I want the total distance north." ],
        correct: [2, 0, 1],
        explain: "Always STATE first, then show your WORK, then CONCLUDE with a clear sentence." },
    ],
  },

  /* ===================== MODULE 2: WRITING ONE STEP AT A TIME ===================== */
  {
    id: "m2",
    title: "One step at a time",
    teacher: "countra",
    rarity: "common",
    mins: 12,
    intro: "A common mistake is cramming every idea into one messy line, so the reader (and often the writer) loses track. This module builds the habit of writing exactly one idea per line, so each line follows clearly from the one before it.",
    steps: [
      { kind: "teach", heading: "One idea per line", body: [
        "A common mistake is to cram all the maths into one messy line. The examiner gets lost, and so do you.",
        "Instead, put ONE idea on each line. Each line should follow clearly from the line above it.",
        "If a line makes the reader ask \"wait, why?\", it needs breaking into smaller steps." ] },
      { kind: "example", problem: "A number is doubled, then 5 is added, to give 17. What was the number?",
        working: [
          "STATE: A number is doubled then 5 is added, giving 17. I want the original number.",
          "WORK: Doubling then adding 5 gives 17, so before adding 5 the value was 17 − 5 = 12.",
          "WORK: That value of 12 is the double of the number, so the number is 12 ÷ 2 = 6.",
          "CONCLUDE: So the original number was 6." ],
        answer: "6" },
      { kind: "example", problem: "A number is multiplied by 3, then 4 is subtracted, to give 11. What was the number?",
        working: [
          "STATE: A number is multiplied by 3 then has 4 subtracted, giving 11. I want the original number.",
          "WORK: Before subtracting 4, the value was 11 + 4 = 15.",
          "WORK: That value of 15 is 3 times the number, so the number is 15 ÷ 3 = 5.",
          "CONCLUDE: So the original number was 5." ],
        answer: "5" },
      { kind: "teach", heading: "Undo in reverse", body: [
        "Notice how each example worked BACKWARDS. One operation happened, THEN another.",
        "To undo it, reverse the order: undo the LAST operation first, then the one before it. Last thing done is the first thing undone.",
        "Writing each undo on its own line makes the reasoning impossible to misread." ] },
      { kind: "order", problem: "A number is multiplied by 3, then has 4 subtracted, to give 11. Find the number.",
        prompt: "Put the WORK steps in the right order (STATE and CONCLUDE are already placed in your head).",
        shuffled: [
          "So before subtracting 4, the value was 11 + 4 = 15.",
          "That 15 is 3 times the number, so the number is 15 ÷ 3 = 5.",
          "The number was multiplied by 3 then had 4 subtracted to give 11." ],
        correct: [2, 0, 1],
        explain: "Restate the situation, undo the last operation first (add the 4 back), then undo the multiply (divide by 3)." },
      { kind: "write", problem: "A number is halved, then 7 is added, to give 12. Find the number, writing a full solution.",
        prompt: "Write your own solution. Use STATE, WORK (one step per line), CONCLUDE. Then reveal the model answer and tick what you did.",
        model: [
          "STATE: A number is halved then 7 is added, giving 12. I want the original number.",
          "WORK: Before adding 7, the value was 12 − 7 = 5.",
          "WORK: That 5 is half the number, so the number is 5 × 2 = 10.",
          "CONCLUDE: So the original number was 10." ],
        answer: "10",
        markScheme: [
          { pts: 1, desc: "Wrote a STATE sentence saying what I knew and wanted." },
          { pts: 1, desc: "Undid the +7 first (subtracted 7)." },
          { pts: 1, desc: "Then undid the halving (multiplied by 2)." },
          { pts: 1, desc: "Wrote a clear CONCLUDE sentence with the answer 10." } ] },
    ],
  },

  /* ===================== MODULE 3: JUSTIFYING EVERY STEP ===================== */
  {
    id: "m3",
    title: "Saying WHY (justifying)",
    teacher: "hunchik",
    rarity: "common",
    mins: 13,
    intro: "A guess isn't enough in maths — every claim needs a reason someone else can check. This module builds the habit of writing WHY each step is true, not just what it is, using the word 'because' as the anchor.",
    steps: [
      { kind: "teach", heading: "The magic word: because", body: [
        "A solution that just lists numbers is weak. A solution that explains WHY is strong.",
        "Get into the habit of writing the word \"because\" or \"so\" on most lines.",
        "Example: \"The two angles are equal BECAUSE the triangle is isosceles.\" That because earns the mark." ] },
      { kind: "example", problem: "Explain why 8 + 6 is even, with a reason (not just the answer).",
        working: [
          "STATE: I want to explain why 8 + 6 is even.",
          "WORK: 8 is even because it is 2 × 4, and 6 is even because it is 2 × 3.",
          "WORK: So 8 + 6 = 2×4 + 2×3 = 2×(4+3) = 2×7, which is 2 times a whole number.",
          "CONCLUDE: Any number that is 2 times a whole number is even, so 8 + 6 = 14 is even." ],
        answer: "14, and it is even because it equals 2 × 7" },
      { kind: "example", problem: "A triangle has one angle of 60° and another of 70°. Explain why the third angle must be 50°, with a reason.",
        working: [
          "STATE: A triangle has angles 60° and 70°. I want to explain why the third angle must be 50°.",
          "WORK: The angles in any triangle always add up to 180° — this is a fixed geometric fact, not a guess.",
          "WORK: So the third angle is 180° − 60° − 70° = 50°.",
          "CONCLUDE: The third angle must be 50°, because the three angles of a triangle always sum to 180°." ],
        answer: "50°, because the angles of a triangle sum to 180°" },
      { kind: "teach", heading: "Good reasons vs weak reasons", body: [
        "A weak reason just repeats the claim: \"It is even because it is even.\" That earns nothing.",
        "A good reason gives a CAUSE the reader can check: \"It is even because it equals 2 × 7.\"",
        "Always ask yourself: could a younger child follow my reason without trusting me? If not, add detail." ] },
      { kind: "choose", problem: "A triangle has angles 70° and 50°, and a solution writes: \"angle A = 60°.\"",
        prompt: "Which version best JUSTIFIES that line?",
        options: [
          "angle A = 60°.",
          "angle A = 60° because I measured it.",
          "angle A = 60° because the three angles add to 180° and the other two are 70° and 50°, so A = 180 − 70 − 50.",
          "angle A = 60°, obviously." ],
        correctIndex: 2,
        explain: "Measuring is not allowed and \"obviously\" is not a reason. Option 3 gives a checkable reason using the angle-sum fact." },
      { kind: "write", problem: "Decide whether 7 + 9 is odd or even and EXPLAIN why, using reasons.",
        prompt: "Write a short solution with a clear reason. Then check against the model.",
        model: [
          "STATE: I want to know whether 7 + 9 is odd or even, with a reason.",
          "WORK: 7 is odd because it is 2×3 + 1, and 9 is odd because it is 2×4 + 1.",
          "WORK: Adding them: (2×3+1) + (2×4+1) = 2×3 + 2×4 + 2 = 2×(3+4+1) = 2×8.",
          "CONCLUDE: 7 + 9 = 16 = 2×8, which is 2 times a whole number, so it is EVEN." ],
        answer: "16, which is even",
        markScheme: [
          { pts: 1, desc: "Stated what I was deciding." },
          { pts: 1, desc: "Gave a reason WHY 7 and 9 are each odd." },
          { pts: 1, desc: "Showed the sum equals 2 times a whole number." },
          { pts: 1, desc: "Concluded clearly that the answer is even." } ] },
    ],
  },

  /* ===================== MODULE 9: PARITY ARGUMENTS ===================== */
  {
    id: "m9",
    title: "Odd, even, and why it matters",
    teacher: "frostcal",
    rarity: "common",
    mins: 13,
    intro: "Every whole number is either odd or even, with no third option — a simple fact, but one certain enough to build a whole argument on. This module shows how that single certainty can crack open problems that look far harder than they are.",
    steps: [
      { kind: "teach", heading: "Odd, even, and why it matters", body: [
        "Every whole number is either odd or even — there's no third option. That sounds obvious, but it's a powerful fact to build an argument on.",
        "An even number can always be written as 2k for some whole number k. An odd number can always be written as 2k+1.",
        "When a problem's answer must be a whole number, and you can show it's forced to be odd (or even), you can rule out entire families of possibilities at once." ] },
      { kind: "example", problem: "Can the sum of three odd numbers ever be even? Explain.",
        working: [
          "STATE: Three odd numbers are added. I want to know if the total can ever be even.",
          "WORK: Write the three odd numbers as 2a+1, 2b+1, 2c+1 for whole numbers a, b, c.",
          "WORK: Adding them: (2a+1)+(2b+1)+(2c+1) = 2a+2b+2c+3 = 2(a+b+c+1)+1.",
          "WORK: That final form is 2 × (a whole number) + 1, which is exactly the pattern for an odd number.",
          "CONCLUDE: No — the sum of three odd numbers is always odd, never even." ],
        answer: "No, it is always odd." },
      { kind: "example", problem: "Can the product of two odd numbers ever be even? Explain.",
        working: [
          "STATE: Two odd numbers are multiplied. I want to know if the product can ever be even.",
          "WORK: Write the two odd numbers as 2a+1 and 2b+1 for whole numbers a, b.",
          "WORK: Multiplying: (2a+1)(2b+1) = 4ab + 2a + 2b + 1 = 2(2ab+a+b) + 1.",
          "WORK: That final form is 2 × (a whole number) + 1, which is exactly the pattern for an odd number.",
          "CONCLUDE: No — the product of two odd numbers is always odd, never even." ],
        answer: "No, it is always odd." },
      { kind: "teach", heading: "Parity as an invariant", body: [
        "This kind of fact — a property that stays fixed no matter which actual numbers you choose — is called an invariant. Parity (odd/even-ness) is one of the simplest and most useful invariants in mathematics.",
        "If a problem asks 'is it possible to reach X', and you can show every move keeps some quantity's parity fixed, but X has the wrong parity, you've PROVED it's impossible — without checking a single case.",
        "Look for parity arguments whenever a problem involves sums, differences or repeated identical steps." ] },
      { kind: "choose", problem: "A claim is made: 'I added two even numbers and got an odd answer.'",
        prompt: "Which response correctly settles this?",
        options: [
          "That's possible if the numbers are big enough.",
          "That's impossible: even + even = 2a + 2b = 2(a+b), which is always even.",
          "It depends which two even numbers.",
          "That's true only for numbers over 100." ],
        correctIndex: 1,
        explain: "Writing both numbers as 2a and 2b shows their sum is always 2(a+b) — always even, regardless of size. The claim must involve an arithmetic slip." },
      { kind: "write", problem: "Sixteen light switches are all OFF. Each move flips exactly one switch. After 25 moves, could all sixteen switches be back to OFF? Explain using parity.",
        prompt: "Think about the TOTAL NUMBER OF SWITCHES THAT ARE ON, and what one flip does to it. Write a full solution, then compare to the model.",
        model: [
          "STATE: 16 switches start OFF (0 switches ON). Each move flips one switch. I want to know if, after 25 moves, all switches can be OFF again (0 switches ON).",
          "WORK: Every single flip changes the number of switches that are ON by exactly 1 (either +1 or −1).",
          "WORK: Starting from 0 (even), after each move the count of ON switches changes parity: after 1 move it's odd, after 2 moves even, and so on — after an EVEN number of moves the count is even, after an ODD number of moves it is odd.",
          "WORK: 25 is odd, so after 25 moves the number of switches ON must be odd.",
          "CONCLUDE: All switches OFF means 0 switches ON, which is even — but after 25 moves the count must be odd. So no, it is impossible." ],
        answer: "No, it's impossible.",
        markScheme: [
          { pts: 1, desc: "Identified the count of ON switches as the quantity to track." },
          { pts: 1, desc: "Explained that each flip changes that count by exactly 1." },
          { pts: 1, desc: "Linked the number of moves (25, odd) to the parity of the final count." },
          { pts: 1, desc: "Concluded correctly that 0 (even) is impossible after an odd number of moves." } ] },
    ],
  },

  /* ===================== MODULE 10: DIVISIBILITY & DIGIT-SUM TRICKS ===================== */
  {
    id: "m10",
    title: "Digit-sum and divisibility tricks",
    teacher: "burrowl",
    rarity: "common",
    mins: 13,
    intro: "Checking divisibility usually means dividing — but the fastest tricks skip division entirely. Digit sums reveal divisibility by 3 and 9 instantly, turning a division question into a much smaller addition question.",
    steps: [
      { kind: "teach", heading: "The digit-sum trick", body: [
        "A number is divisible by 3 exactly when the SUM of its digits is divisible by 3. The same trick works for 9: divisible by 9 exactly when the digit sum is divisible by 9.",
        "This works because 10 leaves remainder 1 when divided by 3 (and by 9), so each digit contributes its own value to the remainder, regardless of its position.",
        "It turns a division question into a much smaller addition question." ] },
      { kind: "example", problem: "Is 4,821 divisible by 3? By 9?",
        working: [
          "STATE: I want to test 4,821 for divisibility by 3 and by 9, using its digit sum.",
          "WORK: The digits are 4, 8, 2, 1. Their sum is 4+8+2+1 = 15.",
          "WORK: 15 is divisible by 3 (15 = 3×5), so 4,821 is divisible by 3. But 15 is NOT divisible by 9 (9×1=9, 9×2=18), so 4,821 is not divisible by 9.",
          "CONCLUDE: 4,821 is divisible by 3 but not by 9." ],
        answer: "Divisible by 3, not by 9." },
      { kind: "example", problem: "Is 6,714 divisible by 3? By 9?",
        working: [
          "STATE: I want to test 6,714 for divisibility by 3 and by 9, using its digit sum.",
          "WORK: The digits are 6, 7, 1, 4. Their sum is 6+7+1+4 = 18.",
          "WORK: 18 is divisible by 3 (18 = 3×6) AND divisible by 9 (18 = 9×2), so 6,714 is divisible by both.",
          "CONCLUDE: 6,714 is divisible by both 3 and 9." ],
        answer: "Divisible by both 3 and 9." },
      { kind: "teach", heading: "Other quick divisibility facts", body: [
        "Divisible by 2: the last digit is even (0,2,4,6,8). Divisible by 5: the last digit is 0 or 5. Divisible by 10: the last digit is 0 — these all depend only on the LAST digit.",
        "Divisible by 4: look at the last TWO digits as their own number (e.g. for 3,716, check whether 16 is divisible by 4 — it is, so 3,716 is too).",
        "Combining these facts lets you check divisibility by numbers like 6 (divisible by both 2 AND 3) very quickly." ] },
      { kind: "order", problem: "Show that 738 is divisible by 6, using the fastest method.",
        prompt: "Put the reasoning steps in the right order.",
        shuffled: [
          "Since 738 is divisible by both 2 and 3, it is divisible by 6.",
          "Last digit 8 is even, so 738 is divisible by 2. Digit sum 7+3+8=18, divisible by 3, so 738 is divisible by 3.",
          "6 = 2 × 3, so a number divisible by 6 must be divisible by both 2 and 3." ],
        correct: [2, 1, 0],
        explain: "First recall WHY checking 2 and 3 works (because 6 = 2×3), then run both quick tests, then combine them into the conclusion." },
      { kind: "write", problem: "Without dividing, decide whether 5,943 is divisible by 9. Write a full solution.",
        prompt: "Use the digit-sum trick, showing your working, then compare to the model.",
        model: [
          "STATE: I want to know if 5,943 is divisible by 9, using the digit-sum trick.",
          "WORK: The digits are 5, 9, 4, 3. Their sum is 5+9+4+3 = 21.",
          "WORK: 21 is not divisible by 9 (9×2=18, 9×3=27), so the digit sum fails the test.",
          "CONCLUDE: 5,943 is not divisible by 9." ],
        answer: "Not divisible by 9.",
        markScheme: [
          { pts: 1, desc: "Named the digit-sum divisibility rule for 9." },
          { pts: 1, desc: "Correctly added the digits to get 21." },
          { pts: 1, desc: "Correctly tested 21 against multiples of 9." },
          { pts: 1, desc: "Concluded clearly that 5,943 is not divisible by 9." } ] },
    ],
  },

  /* ===================== MODULE 11: WORKING BACKWARDS, PROPERLY ===================== */
  {
    id: "m11",
    title: "Working backwards, properly",
    teacher: "loopy",
    rarity: "common",
    mins: 13,
    intro: "When a problem describes a chain of steps ending in a known result, the most reliable route to the start is to walk the chain backwards — undoing each step in reverse order. This module builds that method up to a full, checked solution.",
    steps: [
      { kind: "teach", heading: "When to reverse the chain", body: [
        "An earlier module showed a quick undo. Some Olympiad problems hide a much LONGER chain of steps — but the method is identical: undo the LAST operation first, then work backwards to the start.",
        "The key discipline is to write out the forward chain FIRST (in order), so you know exactly what to undo and in what order.",
        "A backwards solution is just as rigorous as a forwards one, provided every step is properly undone and shown." ] },
      { kind: "example", problem: "A number has 3 added, is doubled, then has 8 subtracted, ending on 20. What was the original number?",
        working: [
          "STATE: A number has 3 added, is doubled, then has 8 subtracted, giving 20. I want the original number.",
          "WORK: The chain in order was: (add 3) → (double) → (subtract 8) = 20. To undo, reverse the order: undo subtract 8, then undo double, then undo add 3.",
          "WORK: Undo 'subtract 8': before that step the value was 20 + 8 = 28.",
          "WORK: Undo 'double': before that step the value was 28 ÷ 2 = 14.",
          "WORK: Undo 'add 3': before that step the value was 14 − 3 = 11.",
          "CONCLUDE: The original number was 11. Check forwards: 11+3=14, 14×2=28, 28−8=20 ✓" ],
        answer: "11" },
      { kind: "example", problem: "A number has 5 subtracted, is tripled, then has 6 added, ending on 21. What was the original number?",
        working: [
          "STATE: A number has 5 subtracted, is tripled, then has 6 added, giving 21. I want the original number.",
          "WORK: The chain in order was: (subtract 5) → (triple) → (add 6) = 21. To undo, reverse the order: undo add 6, then undo triple, then undo subtract 5.",
          "WORK: Undo 'add 6': before that step the value was 21 − 6 = 15.",
          "WORK: Undo 'triple': before that step the value was 15 ÷ 3 = 5.",
          "WORK: Undo 'subtract 5': before that step the value was 5 + 5 = 10.",
          "CONCLUDE: The original number was 10. Check forwards: 10−5=5, 5×3=15, 15+6=21 ✓" ],
        answer: "10" },
      { kind: "teach", heading: "Checking forwards is not optional", body: [
        "Notice the check at the end: running the ORIGINAL forward chain on your answer to confirm it lands on the given result.",
        "This catches the single most common backwards-working mistake: undoing steps in the wrong order.",
        "A backwards solution without a forward check is good; one WITH a forward check is airtight." ] },
      { kind: "choose", problem: "A number has 4 subtracted, then is tripled, ending on 21. Which is the FIRST correct undo step?",
        prompt: "Pick the first correct move to undo the chain.",
        options: [
          "Divide 21 by 3, since tripling was the LAST forward step.",
          "Subtract 4 from 21, since subtracting was the FIRST forward step.",
          "Multiply 21 by 3.",
          "Add 4 to 21." ],
        correctIndex: 0,
        explain: "Undo the chain in REVERSE order — the last forward step (tripling) must be undone FIRST, by dividing." },
      { kind: "write", problem: "A number has 6 added, is halved, then has 2 subtracted, ending on 5. Find the original number with a full backwards solution, including a forward check.",
        prompt: "Write the forward chain, undo it step by step in reverse, conclude, then check forwards.",
        model: [
          "STATE: A number has 6 added, is halved, then has 2 subtracted, giving 5. I want the original number.",
          "WORK: The forward chain was: (add 6) → (halve) → (subtract 2) = 5. Undo in reverse: undo subtract 2, then undo halve, then undo add 6.",
          "WORK: Undo 'subtract 2': before that step the value was 5 + 2 = 7.",
          "WORK: Undo 'halve': before that step the value was 7 × 2 = 14.",
          "WORK: Undo 'add 6': before that step the value was 14 − 6 = 8.",
          "CONCLUDE: The original number was 8. Check forwards: 8+6=14, 14÷2=7, 7−2=5 ✓" ],
        answer: "8",
        markScheme: [
          { pts: 1, desc: "Wrote out the forward chain of operations in order." },
          { pts: 1, desc: "Undid each step in the correct reverse order." },
          { pts: 1, desc: "Reached the correct original number, 8." },
          { pts: 1, desc: "Checked the answer by running the forward chain." } ] },
    ],
  },

  /* ===================== MODULE 4: USING ALGEBRA TO EXPLAIN ===================== */
  {
    id: "m4",
    title: "Letting a letter help",
    teacher: "multimoo",
    rarity: "rare",
    mins: 14,
    intro: "When a number is unknown, giving it a letter lets you reason about it before you've found it. This module shows how that single move turns a word puzzle into an equation, and tidies a solution enormously.",
    steps: [
      { kind: "teach", heading: "A letter stands for the unknown", body: [
        "When you don't yet know a number, call it n (or x, or any letter). Then write down what the problem tells you ABOUT n.",
        "This turns a word puzzle into an equation you can solve, and it makes your reasoning crystal clear.",
        "Always start by saying what your letter means: \"Let n be the number of...\"." ] },
      { kind: "example", problem: "A farmer has some cows. If the herd trebled, there would be 24 more cows than now. How many cows are there?",
        working: [
          "STATE: Let n be the number of cows now. Trebling gives 24 more than now.",
          "WORK: Three times the herd is 3n. This is 24 more than n, so 3n = n + 24.",
          "WORK: Subtracting n from both sides: 2n = 24, so n = 12.",
          "CONCLUDE: So there are 12 cows." ],
        answer: "12 cows" },
      { kind: "example", problem: "A number of sheep is such that doubling the flock gives 18 more sheep than now. How many sheep are there?",
        working: [
          "STATE: Let n be the number of sheep now. Doubling the flock gives 18 more than now.",
          "WORK: Twice the flock is 2n. This is 18 more than n, so 2n = n + 18.",
          "WORK: Subtracting n from both sides: n = 18.",
          "CONCLUDE: So there are 18 sheep." ],
        answer: "18 sheep" },
      { kind: "teach", heading: "Define before you use", body: [
        "The single most common slip is using a letter without saying what it means.",
        "Every letter must be introduced: \"Let h be the height in cm.\" Now the reader knows exactly what h is.",
        "An undefined letter makes a whole solution hard to mark, even when the maths is right." ] },
      { kind: "order", problem: "A number is thought of. Five times the number, less 3, equals 32. Find it.",
        prompt: "Order the WORK lines into a clean algebraic solution.",
        shuffled: [
          "Adding 3 to both sides gives 5n = 35.",
          "Let n be the number. Then five times it, less 3, is 5n − 3 = 32.",
          "Dividing both sides by 5 gives n = 7." ],
        correct: [1, 0, 2],
        explain: "Define n and form the equation first, then undo the −3 (add 3), then undo the ×5 (divide by 5)." },
      { kind: "write", problem: "A number is doubled and 9 is added to give 25. Using a letter, find the number with a full written solution.",
        prompt: "Define your letter, form an equation, solve it line by line, then conclude. Check against the model.",
        model: [
          "STATE: Let n be the number. Doubling and adding 9 gives 25, so 2n + 9 = 25.",
          "WORK: Subtract 9 from both sides: 2n = 16.",
          "WORK: Divide both sides by 2: n = 8.",
          "CONCLUDE: So the number is 8." ],
        answer: "8",
        markScheme: [
          { pts: 1, desc: "Said what my letter n means." },
          { pts: 1, desc: "Wrote a correct equation (2n + 9 = 25)." },
          { pts: 1, desc: "Solved it one step per line." },
          { pts: 1, desc: "Concluded with the answer 8." } ] },
    ],
  },

  /* ===================== MODULE 5: WORKING SYSTEMATICALLY ===================== */
  {
    id: "m5",
    title: "Being systematic",
    teacher: "owlgorith",
    rarity: "rare",
    mins: 14,
    intro: "Many Olympiad problems ask 'how many ways?' — and the secret to answering correctly is to list possibilities in a strict order, so nothing is ever missed or counted twice. This module builds that discipline from a small case up to a genuine counting shortcut.",
    steps: [
      { kind: "teach", heading: "List in order, never at random", body: [
        "When counting possibilities, the danger is missing some or repeating some.",
        "The cure is to work in a fixed order — smallest first, say — and write every case down.",
        "A solution that shows an ORGANISED list proves you found them all. Random guessing never does." ] },
      { kind: "example", problem: "Two-digit numbers are written using only the digits 1, 2 and 3 (repeats allowed). How many are there? List them in order.",
        working: [
          "STATE: I want all two-digit numbers using digits from {1,2,3}, repeats allowed.",
          "WORK: Starting with 1: 11, 12, 13. Starting with 2: 21, 22, 23. Starting with 3: 31, 32, 33.",
          "WORK: That is 3 choices for the first digit and 3 for the second, an organised 3 × 3 grid.",
          "CONCLUDE: There are 9 such numbers, listed above in order." ],
        answer: "9" },
      { kind: "example", problem: "A padlock code uses two digits chosen from {4, 5, 6, 7} (repeats allowed). How many different codes are there? List them in order.",
        working: [
          "STATE: I want all two-digit codes using digits from {4,5,6,7}, repeats allowed.",
          "WORK: Starting with 4: 44, 45, 46, 47. Starting with 5: 54, 55, 56, 57. Starting with 6: 64, 65, 66, 67. Starting with 7: 74, 75, 76, 77.",
          "WORK: That is 4 choices for the first digit and 4 for the second, an organised 4 × 4 grid.",
          "CONCLUDE: There are 16 such codes, listed above in order." ],
        answer: "16" },
      { kind: "teach", heading: "Counting without listing everything", body: [
        "Once you trust your order, you can often count by multiplying choices instead of writing all cases.",
        "Here: 3 ways to pick the first digit, and for EACH of those, 3 ways to pick the second. That is 3 × 3 = 9.",
        "But always be ready to show the ordered list as proof if asked." ] },
      { kind: "choose", problem: "A meal deal offers a choice of a starter and a main, from 4 starters and 5 mains.",
        prompt: "Which reasoning is correctly systematic?",
        options: [
          "4 + 5 = 9 ways.",
          "For each of the 4 starters there are 5 possible mains, giving 4 × 5 = 20 ways.",
          "About 20, roughly.",
          "5 − 4 = 1 way." ],
        correctIndex: 1,
        explain: "For each starter you may choose any main, so you multiply: 4 × 5 = 20. Adding would only count one course, not a pair." },
      { kind: "write", problem: "Three-letter codes are made using only A, B (repeats allowed). How many codes are possible? Show an organised solution.",
        prompt: "Either list in strict order or count by multiplying choices — but justify it. Check the model.",
        model: [
          "STATE: I want the number of three-letter codes using only A and B, repeats allowed.",
          "WORK: There are 2 choices for the first letter, 2 for the second and 2 for the third.",
          "WORK: For each choice of the first two letters there are 2 ways to finish, so the total is 2 × 2 × 2.",
          "CONCLUDE: There are 2 × 2 × 2 = 8 possible codes (AAA, AAB, ABA, ABB, BAA, BAB, BBA, BBB)." ],
        answer: "8",
        markScheme: [
          { pts: 1, desc: "Worked in a fixed order or multiplied the choices." },
          { pts: 1, desc: "Justified WHY I multiply (a choice for each position)." },
          { pts: 1, desc: "Reached 8." },
          { pts: 1, desc: "Could back it up with the ordered list." } ] },
    ],
  },

  /* ===================== MODULE 12: THE PIGEONHOLE PRINCIPLE ===================== */
  {
    id: "m12",
    title: "The pigeonhole principle",
    teacher: "cheetawat",
    rarity: "rare",
    mins: 14,
    intro: "If more items are placed into a fixed set of categories than there are categories, at least one category must hold two or more items — a simple observation that proves surprisingly powerful results without checking a single case. This module shows how to use it.",
    steps: [
      { kind: "teach", heading: "More pigeons than holes", body: [
        "The Pigeonhole Principle says: if you place more than N items into N categories, at least one category must contain 2 or more items.",
        "It sounds too simple to be useful, but it proves things are FORCED to happen without ever checking a single case.",
        "The hard part is usually spotting what the 'pigeons' and 'holes' are in a word problem." ] },
      { kind: "example", problem: "A drawer holds only red and blue socks. How many socks must you pull out (without looking) to be CERTAIN you have a matching pair?",
        working: [
          "STATE: There are 2 colours of sock. I want the smallest number of socks that GUARANTEES a matching pair, however unlucky the draw.",
          "WORK: Think of the 2 colours as 2 'holes'. If I pull out just 2 socks, the worst case is one of each colour — no pair yet.",
          "WORK: Pulling out a 3rd sock, it MUST be red or blue — either way, it matches one of the first two.",
          "CONCLUDE: 3 socks guarantees a matching pair; 2 socks does not (the unlucky case: one of each)." ],
        answer: "3 socks" },
      { kind: "example", problem: "A box holds pencils in 4 colours only. How many pencils must you pull out (without looking) to be CERTAIN two share a colour?",
        working: [
          "STATE: There are 4 colours of pencil. I want the smallest number that GUARANTEES two of the same colour, however unlucky the draw.",
          "WORK: Think of the 4 colours as 4 'holes'. If I pull out 4 pencils, the worst case is one of each colour — no match yet.",
          "WORK: Pulling out a 5th pencil, it MUST match one of the 4 colours already drawn.",
          "CONCLUDE: 5 pencils guarantees a matching pair; 4 pencils does not (the unlucky case: one of each colour)." ],
        answer: "5 pencils" },
      { kind: "teach", heading: "Holes don't have to be obvious", body: [
        "The 'holes' are often something you have to invent — like the 2 colours above, or the 12 remainders when dividing by 12, or the 7 days of the week.",
        "Once you've named the holes, the rule is always the same: (number of pigeons) > (number of holes) forces a shared hole.",
        "State your pigeons and holes explicitly in your solution — that IS the argument." ] },
      { kind: "choose", problem: "A bag holds red, blue and green counters only. How many must you draw to guarantee 2 the SAME colour?",
        prompt: "Which is the correct pigeonhole reasoning?",
        options: [
          "2, since that is likely enough.",
          "3 colours means 3 holes; drawing 3 could give one of each (no pair), so drawing a 4th forces a repeat: the answer is 4.",
          "3, because there are 3 colours.",
          "6, to be extra safe." ],
        correctIndex: 1,
        explain: "With 3 holes (colours), the worst case fills each hole once (3 counters, no pair) before the 4th counter is forced to repeat a colour." },
      { kind: "write", problem: "Nineteen children are in a class. Each was born in one of the 12 months. Explain why at least 2 children must share a birth month.",
        prompt: "Name the pigeons and the holes explicitly, then apply the principle. Write a full solution.",
        model: [
          "STATE: There are 19 children (the pigeons) and 12 possible birth months (the holes). I want to show 2 children must share a month.",
          "WORK: If every month had at most 1 child, the class could hold at most 12 children in total.",
          "WORK: But there are 19 children, and 19 is more than 12.",
          "CONCLUDE: So it's impossible for every month to have at most 1 child — at least one month must contain 2 or more children, meaning at least 2 children share a birth month." ],
        answer: "At least 2 children must share a birth month (a proof, not a specific number).",
        markScheme: [
          { pts: 1, desc: "Identified the 19 children as the pigeons." },
          { pts: 1, desc: "Identified the 12 months as the holes." },
          { pts: 1, desc: "Showed that 12 holes can hold at most 12 pigeons with no repeat." },
          { pts: 1, desc: "Concluded that since 19 > 12, a shared month is forced." } ] },
    ],
  },

  /* ===================== MODULE 13: INVARIANTS ===================== */
  {
    id: "m13",
    title: "Finding an invariant",
    teacher: "seqviper",
    rarity: "rare",
    mins: 14,
    intro: "Some quantities never change, no matter how a puzzle is shuffled or rearranged. Finding that unchanging quantity — an invariant — is often the entire solution, since it can prove something is impossible without ever trying to build it.",
    steps: [
      { kind: "teach", heading: "What is an invariant?", body: [
        "An invariant is a quantity or property that STAYS THE SAME (or changes in a totally predictable way) no matter which allowed move you make.",
        "Parity was one invariant (odd/even-ness never changes under certain moves). But invariants can also be totals, remainders, colours, or counts of something.",
        "If a puzzle asks 'can you reach state X from state Y', find an invariant that's different in X and Y — that alone proves it's impossible." ] },
      { kind: "example", problem: "A chessboard has 64 squares, coloured so opposite corners are the same colour (32 black, 32 white). If the two opposite corner squares are removed, can the remaining 62 squares be tiled exactly by 31 dominoes (each covering two adjacent squares)? Use an invariant to decide.",
        working: [
          "STATE: 62 squares remain after removing two same-coloured opposite corners. I want to know if 31 dominoes can tile them exactly.",
          "WORK: Every domino covers two ADJACENT squares, and any two adjacent squares on a chessboard are always different colours (one black, one white).",
          "WORK: So the invariant is: any full domino tiling must cover EQUAL numbers of black and white squares — 31 of each, for 31 dominoes.",
          "WORK: The two removed corners are the SAME colour (say both black), so the remaining squares are 30 black and 32 white — not equal.",
          "CONCLUDE: Since a tiling needs 31 black and 31 white squares but only 30 black remain, no such tiling is possible." ],
        answer: "No, it's impossible." },
      { kind: "example", problem: "Five numbers on a board are all equal to 1 (total sum 5). Each move, pick any two of the numbers and replace BOTH of them with their average. Could the total sum ever become 6?",
        working: [
          "STATE: Five numbers start at 1 each (sum 5). Each move replaces two chosen numbers a and b with (a+b)/2 each. I want to know if the sum can ever become 6.",
          "WORK: Before the move, those two numbers contribute a + b to the total. After the move, they contribute (a+b)/2 + (a+b)/2 = a + b — exactly the same amount.",
          "WORK: So every move leaves the total sum completely unchanged: it is an invariant.",
          "CONCLUDE: The sum starts at 5 and can never change, so it can never become 6." ],
        answer: "No, the sum always stays 5." },
      { kind: "teach", heading: "Invariants prove impossibility", body: [
        "This is the real power of an invariant: it can prove something is FLATLY impossible, without ever trying to build the arrangement.",
        "The key move was naming a quantity (here, black squares needed vs available) that every allowed action (placing a domino) is forced to respect.",
        "Whenever a puzzle asks 'can you reach/build/rearrange X', hunt for a quantity that every move preserves, then compare its value at the start and at the target." ] },
      { kind: "choose", problem: "A row of 10 coins starts all showing HEADS. Each move flips exactly 2 coins (any two, not necessarily adjacent). After several moves, could the row show exactly 9 heads and 1 tail?",
        prompt: "Which reasoning correctly uses an invariant?",
        options: [
          "Yes, if you flip the right coins.",
          "No — flipping 2 coins always changes the number of tails by 0 or ±2, so the number of tails stays EVEN forever; 1 tail is odd, so it's impossible.",
          "Yes, after exactly 9 moves.",
          "No, because 10 is an even number." ],
        correctIndex: 1,
        explain: "Flipping 2 coins changes the tail-count by −2, 0, or +2 — always an even change. Starting from 0 tails (even), the tail-count can only ever be even, so 1 tail (odd) is impossible." },
      { kind: "write", problem: "A jar contains 8 red and 5 blue marbles. Each move, you either remove 2 marbles of the SAME colour and replace them with 1 blue marble, OR remove 2 marbles of DIFFERENT colours and replace them with 1 red marble. After many moves, only 1 marble remains. Using an invariant, decide whether it must be red or blue.",
        prompt: "Track the PARITY of the number of red marbles through each type of move, then use the starting count to decide. Write a full solution.",
        model: [
          "STATE: Start with R=8 red, B=5 blue marbles. Each move either removes 2 same-colour marbles and adds 1 blue, or removes 1 red + 1 blue and adds 1 red. After many moves, 1 marble remains. I want its colour, using an invariant.",
          "WORK: Track the PARITY (odd/even-ness) of the number of red marbles, R.",
          "WORK: If two red marbles are removed (and a blue added), R decreases by 2 — an even change, so R's parity is unchanged. If two blue marbles are removed (and a blue added), R doesn't change at all — parity unchanged.",
          "WORK: If one red and one blue are removed and a red is added, R loses 1 and gains 1, a net change of 0 — parity unchanged.",
          "WORK: So EVERY move leaves the parity of R exactly as it was. Since R starts at 8 (even), R must stay even after every move, forever.",
          "CONCLUDE: When only 1 marble remains, R must still be even — so R = 0, meaning the last marble is BLUE (if it were red, R would be 1, which is odd)." ],
        answer: "The last marble must be blue.",
        markScheme: [
          { pts: 1, desc: "Chose to track the parity of the red-marble count as the invariant." },
          { pts: 2, desc: "Correctly showed all three move-types leave that parity unchanged." },
          { pts: 1, desc: "Correctly used the starting count (8, even) to conclude the final colour must be blue." } ] },
    ],
  },

  /* ===================== MODULE 19: COLOURING ARGUMENTS ===================== */
  {
    id: "m19",
    title: "Colouring arguments",
    teacher: "seqviper",
    rarity: "rare",
    mins: 14,
    intro: "Colouring a diagram or a set of objects in a deliberate pattern can reveal a constraint that is otherwise invisible. This module shows how a well-chosen colouring turns a geometric or counting puzzle into a simple, checkable counting argument.",
    steps: [
      { kind: "teach", heading: "Colour with a purpose", body: [
        "A colouring argument assigns a colour (or label) to every object in a puzzle, following a fixed rule, so that every allowed move or piece is forced to respect the colours in some predictable way.",
        "Once the colouring is chosen, count how many objects of each colour there are, and compare that with what any valid arrangement or sequence of moves would require.",
        "The classic choice is a chessboard-style colouring — alternating two colours across a grid — because adjacent squares always end up different colours." ] },
      { kind: "example", problem: "A grid of squares is coloured like a chessboard, alternating black and white. A robot starts on a black square, and each move slides it to an ADJACENT square (sharing an edge). What colour must the robot be on after 7 moves?",
        working: [
          "STATE: The robot starts on black. Each move goes to an adjacent square. I want its colour after 7 moves.",
          "WORK: On a chessboard colouring, any two adjacent squares (sharing an edge) are always DIFFERENT colours.",
          "WORK: So every single move flips the robot's colour: black to white, or white to black.",
          "WORK: Starting on black, after 1 move it's white, after 2 moves black again, and so on — after an odd number of moves it is white, after an even number it is black.",
          "CONCLUDE: 7 is odd, so after 7 moves the robot must be on a white square." ],
        answer: "White" },
      { kind: "teach", heading: "Colouring can prove impossibility", body: [
        "Colouring is especially powerful for tiling puzzles: colour the board, then check whether a proposed tile (like a domino) is always forced to cover one square of each colour.",
        "If a domino always covers one black and one white square, then any full tiling by dominoes must cover EQUAL numbers of black and white squares.",
        "If the board being tiled does not have equal numbers of black and white squares, no such tiling can exist — proven without ever attempting to place a single tile." ] },
      { kind: "example", problem: "A 4×4 board (16 squares) is coloured like a chessboard (8 black, 8 white). Two opposite corner squares are removed; on this colouring, opposite corners are always the SAME colour. Can the remaining 14 squares be tiled exactly by 7 dominoes, each covering two adjacent squares?",
        working: [
          "STATE: 14 squares remain after removing two same-coloured opposite corners from a 4×4 board. I want to know if 7 dominoes can tile them exactly.",
          "WORK: Every domino covers two adjacent squares, and adjacent squares on a chessboard colouring are always different colours — so every domino covers exactly one black and one white square.",
          "WORK: So a full tiling by 7 dominoes must cover exactly 7 black and 7 white squares.",
          "WORK: The two removed corners are the same colour (say both black), leaving 8 − 2 = 6 black squares and 8 white squares — not equal.",
          "CONCLUDE: Since a tiling needs 7 black and 7 white squares but only 6 black remain, no such tiling is possible." ],
        answer: "No, it's impossible." },
      { kind: "choose", problem: "A 6×6 board (36 squares) is coloured like a chessboard (18 black, 18 white). One black square is removed, leaving 35 squares. Which conclusion is correctly reasoned?",
        prompt: "Pick the argument that correctly uses colouring.",
        options: [
          "35 is odd, so tiling by dominoes is impossible — no colouring needed.",
          "Each domino covers one black and one white square, so a tiling needs equal black and white counts; with 17 black and 18 white remaining, they are already unequal, so tiling is impossible.",
          "It doesn't matter which square is removed, tiling is always possible.",
          "Since only 1 square was removed, it barely matters and tiling is still possible." ],
        correctIndex: 1,
        explain: "Even though the odd total (35) already rules out tiling by dominoes on its own, option 1 sidesteps the point of THIS technique — option 2 correctly uses the colouring argument: 17 black vs 18 white can never be split into equal domino pairs." },
      { kind: "write", problem: "A 4×4 board (16 squares) is coloured like a chessboard (8 black, 8 white). One black corner square and one white corner square (which are NOT opposite each other, but adjacent along one edge) are removed, leaving 14 squares. Using colouring, decide whether the remaining board can be tiled exactly by 7 dominoes, and explain why this case is different from removing two same-coloured squares.",
        prompt: "Count the black and white squares remaining, compare with what a tiling needs, and explain the contrast with the same-colour case. Write a full solution.",
        model: [
          "STATE: A 4×4 board has 8 black and 8 white squares under a chessboard colouring. One black and one white corner are removed, leaving 14 squares (7 black, 7 white). I want to know if 7 dominoes can tile them, using colouring.",
          "WORK: Each domino covers one black and one white square (adjacent squares are always different colours), so a full tiling needs exactly 7 black and 7 white squares.",
          "WORK: Removing one square of EACH colour leaves 7 black and 7 white — the numbers required for a tiling ARE equal here.",
          "CONCLUDE: Unlike removing two same-coloured squares (which breaks the black-white balance and makes tiling impossible), removing one of each colour keeps the balance intact, so this colour-count argument alone does not rule out a tiling — a full tiling may well exist here, even though the argument could not rule it out in the same-colour case." ],
        answer: "The colour-count argument does not rule out a tiling here (7 black, 7 white remain), unlike the same-colour removal case.",
        markScheme: [
          { pts: 1, desc: "Correctly counted the remaining black and white squares (7 each)." },
          { pts: 1, desc: "Stated that a domino always covers one black and one white square." },
          { pts: 2, desc: "Explained the contrast with the same-colour-removal case: equal counts here do not immediately rule out tiling." } ] },
    ],
  },

  /* ===================== MODULE 14: SYMMETRY & PAIRING TRICKS ===================== */
  {
    id: "m14",
    title: "Symmetry and pairing",
    teacher: "hexabug",
    rarity: "rare",
    mins: 15,
    intro: "Symmetry isn't only for shapes: pairing numbers, choices, or positions cleverly can make a nasty sum or count collapse into something tiny. This module builds the pairing trick for sums, then shows the same symmetric idea at work in counting.",
    steps: [
      { kind: "teach", heading: "Pairing up a sum", body: [
        "Some sums look long and painful until you notice the terms pair up nicely — often from the two ends inward.",
        "The classic example: 1+2+3+...+100. Pair the first and last (1+100=101), the second and second-last (2+99=101)... every pair adds to the SAME total.",
        "Spotting a pairing turns a 100-term sum into a handful of multiplications." ] },
      { kind: "example", problem: "Find 1+2+3+...+20 by pairing.",
        working: [
          "STATE: I want the sum of the whole numbers from 1 to 20, using pairing.",
          "WORK: Pair the first and last: 1+20=21. Pair the second and second-last: 2+19=21. Each such pair adds to 21.",
          "WORK: There are 20 numbers, so there are 20÷2 = 10 pairs, each summing to 21.",
          "CONCLUDE: The total is 10 × 21 = 210." ],
        answer: "210" },
      { kind: "teach", heading: "Pairing to cancel, not just add", body: [
        "Pairing doesn't only help sums — it can also make things CANCEL. In (1−2)+(3−4)+(5−6)+...+(19−20), each bracket is −1, and there are 10 brackets.",
        "The trick is always the same: look for a symmetric structure (first with last, or consecutive pairs) where the pairing simplifies.",
        "State your pairing rule clearly, then just multiply pair-value by number-of-pairs." ] },
      { kind: "teach", heading: "Symmetry in counting: choosing IS the same as leaving behind", body: [
        "Symmetry shows up in counting too, not just in sums. Choosing which 2 of 5 friends go on an errand is EXACTLY the same decision as choosing which 3 stay behind — every choice of 2-to-go pairs up perfectly with one choice of 3-to-stay.",
        "Because the two counts describe the same set of decisions viewed from opposite ends, they must always be equal: the number of ways to choose r items from n is the same as the number of ways to choose the remaining (n − r).",
        "This symmetry is a free check: if you count 'choose 2 from 5' one way and 'choose 3 from 5' another way, both answers must match." ] },
      { kind: "example", problem: "From 5 friends, how many ways can 2 be chosen to go to the shop? Use the symmetry with choosing who stays behind to check your answer.",
        working: [
          "STATE: I want the number of ways to choose 2 friends from 5 to go to the shop, and to check it using the symmetric choice of who stays.",
          "WORK: List the pairs systematically, naming the alphabetically-earlier friend first: AB, AC, AD, AE, BC, BD, BE, CD, CE, DE — that is 10 pairs.",
          "WORK: Choosing 2 to go is the same decision as choosing the other 3 to stay behind. Listing groups of 3 from 5 gives exactly 10 groups too (by the same symmetry).",
          "CONCLUDE: There are 10 ways, and the matching count for 'choose 3' confirms it by symmetry." ],
        answer: "10" },
      { kind: "choose", problem: "A row of even numbers 2+4+6+...+40 is to be summed. Which pairing correctly finds it?",
        prompt: "Pick the correctly reasoned method.",
        options: [
          "There are 40 numbers, so multiply 40 by 2.",
          "Pair first and last: 2+40=42. There are 20 even numbers from 2 to 40, giving 10 pairs, so the total is 10 × 42 = 420.",
          "Just guess around 400.",
          "Add them one at a time; there's no shortcut." ],
        correctIndex: 1,
        explain: "There are 20 even numbers between 2 and 40 inclusive (40÷2=20), pairing first+last gives 10 pairs each worth 42, so 10×42=420." },
      { kind: "write", problem: "Find 1+2+3+...+50 by pairing, showing a full solution.",
        prompt: "Pair from both ends, count the pairs, then multiply. Write it all out.",
        model: [
          "STATE: I want the sum of the whole numbers from 1 to 50, using pairing.",
          "WORK: Pair the first and last: 1+50=51. Every such pair (2+49, 3+48, ...) also adds to 51.",
          "WORK: There are 50 numbers, giving 50÷2 = 25 pairs.",
          "CONCLUDE: The total is 25 × 51 = 1275." ],
        answer: "1275",
        markScheme: [
          { pts: 1, desc: "Identified the correct pairing (first+last = 51)." },
          { pts: 1, desc: "Correctly counted 25 pairs." },
          { pts: 1, desc: "Multiplied correctly to get 1275." },
          { pts: 1, desc: "Wrote a clear STATE and CONCLUDE around the working." } ] },
    ],
  },

  /* ===================== MODULE 15: ANGLE CHASING ===================== */
  {
    id: "m15",
    title: "Angle chasing",
    teacher: "anglorap",
    rarity: "rare",
    mins: 15,
    intro: "Geometry problems often melt away once you 'chase' angles around a diagram, applying one fact at a time from a small toolkit. This module builds that toolkit and shows how to chase an angle in small, fully justified steps.",
    steps: [
      { kind: "teach", heading: "Your angle-chasing toolkit", body: [
        "Angles on a straight line add to 180°. Angles round a full point add to 360°. Angles in a triangle add to 180°. Vertically opposite angles (across an X) are equal.",
        "When lines are parallel: alternate angles are equal (a Z-shape), corresponding angles are equal (an F-shape), and co-interior angles add to 180° (a C-shape).",
        "Angle chasing means working around a diagram, using ONE fact at a time, labelling each new angle as you find it, until you reach the one you want." ] },
      { kind: "example", problem: "Two parallel lines are crossed by a third line. One of the angles formed is 65°. Find the co-interior angle (the one on the same side, between the parallel lines).",
        working: [
          "STATE: Two parallel lines are cut by a third line. One angle is 65°. I want the co-interior angle.",
          "WORK: Co-interior angles (on the same side, between the parallel lines) always add to 180° — this is a fixed fact for any parallel lines.",
          "WORK: So the co-interior angle is 180° − 65° = 115°.",
          "CONCLUDE: The co-interior angle is 115°." ],
        answer: "115°" },
      { kind: "example", problem: "Two straight lines cross, forming an X. One of the four angles is 35°. Find the angle directly opposite it.",
        working: [
          "STATE: Two straight lines cross, forming four angles. One is 35°. I want the angle vertically opposite it.",
          "WORK: Angles directly opposite each other where two lines cross are called vertically opposite angles, and this fact says they are always equal.",
          "CONCLUDE: The angle opposite the 35° angle is also 35°." ],
        answer: "35°" },
      { kind: "teach", heading: "Chase in small, justified steps", body: [
        "Never jump straight to the final angle. Find the NEXT angle you can justify from a known fact, name that fact, then move on.",
        "A typical chase: 'angle B = angle A (vertically opposite), angle C = 180 − angle B (angles on a line), angle D = angle C (alternate angles), so the angle I want = angle D.'",
        "Each arrow in that chain needs its own named reason — that's what earns full marks, not just the final number." ] },
      { kind: "order", problem: "In a triangle, one angle is 50° and another is 65°. Find the third angle.",
        prompt: "Order the reasoning.",
        shuffled: [
          "Angles in a triangle add to 180°.",
          "50° + 65° = 115°, so the third angle is 180° − 115°.",
          "The third angle is 65°." ],
        correct: [0, 1, 2],
        explain: "State the fact first (angles sum to 180°), then do the arithmetic, then give the final value." },
      { kind: "write", problem: "A triangle has one angle of 40° and is isosceles, with the two EQUAL angles being the other two. Find all three angles, with a full justified solution.",
        prompt: "Decide which angles are equal, form an equation, solve, and check the sum is 180°.",
        model: [
          "STATE: A triangle is isosceles with one angle 40°, and the OTHER two angles equal to each other. I want all three angles.",
          "WORK: Let each of the two equal angles be x. Angles in a triangle sum to 180°, so 40 + x + x = 180.",
          "WORK: This gives 2x = 140, so x = 70.",
          "CONCLUDE: The three angles are 40°, 70° and 70°. Check: 40+70+70=180 ✓" ],
        answer: "40°, 70°, 70°",
        markScheme: [
          { pts: 1, desc: "Defined the two equal angles with a letter." },
          { pts: 1, desc: "Formed the correct equation using the angle sum of a triangle." },
          { pts: 1, desc: "Solved to get x = 70." },
          { pts: 1, desc: "Stated all three angles and checked they sum to 180°." } ] },
    ],
  },

  /* ===================== MODULE 16: AREA & SIMILAR SHAPES ===================== */
  {
    id: "m16",
    title: "Area and similar shapes",
    teacher: "squarby",
    rarity: "rare",
    mins: 15,
    intro: "Areas hide some of the neatest Olympiad tricks, especially when one shape is a scaled-up copy of another. This module covers splitting an awkward area into known pieces, and the single most commonly mis-remembered fact about scaling: area does not scale the same way length does.",
    steps: [
      { kind: "teach", heading: "Area by splitting or surrounding", body: [
        "An awkward shape's area is often found by splitting it into rectangles/triangles you DO know how to measure, then adding the pieces.",
        "Alternatively, surround the shape with a simple rectangle, find that big area, and SUBTRACT the extra bits you didn't want.",
        "Always state which method you're using, and be precise about which lengths you're using for each piece." ] },
      { kind: "example", problem: "An L-shaped room is a 6m by 8m rectangle with a 3m by 4m rectangular corner missing. Find its area.",
        working: [
          "STATE: The room is a 6m × 8m rectangle with a 3m × 4m rectangle removed from one corner. I want the remaining area.",
          "WORK: The full rectangle's area is 6 × 8 = 48 square metres.",
          "WORK: The missing corner's area is 3 × 4 = 12 square metres.",
          "CONCLUDE: The room's area is 48 − 12 = 36 square metres." ],
        answer: "36 m²" },
      { kind: "example", problem: "Two similar rectangles have a length scale factor of 4 (every length on the larger rectangle is 4 times the matching length on the smaller). The smaller rectangle has area 6 cm². Find the area of the larger rectangle.",
        working: [
          "STATE: The length scale factor between the two similar rectangles is 4, and the smaller rectangle has area 6 cm². I want the larger rectangle's area.",
          "WORK: For similar shapes, area scales by the SQUARE of the length scale factor, not the length factor itself: 4² = 16.",
          "WORK: So the larger rectangle's area is 6 × 16 = 96 cm².",
          "CONCLUDE: The larger rectangle has area 96 cm²." ],
        answer: "96 cm²" },
      { kind: "teach", heading: "Similar shapes scale area by the SQUARE of the length scale", body: [
        "Two shapes are similar when one is an exact scaled-up (or down) copy of the other — same shape, different size.",
        "If every LENGTH scales by a factor k, then the AREA scales by k² (not just k!). Doubling every side (k=2) makes the area 4 times bigger (2²=4), not 2 times.",
        "This is one of the most commonly mis-remembered facts in Olympiad geometry — always square the length scale factor to get the area scale factor." ] },
      { kind: "choose", problem: "A small triangle has area 5 cm². A similar (scaled-up) triangle has every side 3 times as long. What is the large triangle's area?",
        prompt: "Pick the correctly reasoned answer.",
        options: [
          "15 cm², since 5 × 3 = 15.",
          "45 cm², since the area scales by the SQUARE of the length factor: 5 × 3² = 5 × 9 = 45.",
          "5 cm², areas don't change under scaling.",
          "25 cm², since 5² = 25." ],
        correctIndex: 1,
        explain: "Sides scale by 3, so area scales by 3² = 9 (not by 3), giving 5 × 9 = 45 cm²." },
      { kind: "write", problem: "A photograph is 4cm by 6cm. It is enlarged so that every length is 2.5 times as long. Find the area of the enlarged photograph, and by what factor the area has increased, with a full solution.",
        prompt: "Find the original area, identify the length scale factor, apply it correctly to area, and state both the new area and the area scale factor.",
        model: [
          "STATE: The original photo is 4cm × 6cm. Every length is enlarged by a factor of 2.5. I want the new area and the area scale factor.",
          "WORK: The original area is 4 × 6 = 24 cm².",
          "WORK: Since every length scales by 2.5, the area scales by 2.5² = 6.25 (the SQUARE of the length factor).",
          "WORK: So the new area is 24 × 6.25 = 150 cm².",
          "CONCLUDE: The enlarged photograph has area 150 cm², and the area has increased by a factor of 6.25." ],
        answer: "150 cm², area scale factor 6.25",
        markScheme: [
          { pts: 1, desc: "Found the original area correctly (24 cm²)." },
          { pts: 1, desc: "Identified that area scales by the SQUARE of the length factor." },
          { pts: 1, desc: "Computed the area scale factor correctly (2.5² = 6.25)." },
          { pts: 1, desc: "Computed the new area correctly (150 cm²) and stated the scale factor." } ] },
    ],
  },

  /* ===================== MODULE 6: PROOF BY CONTRADICTION-LITE / EXTREMES ===================== */
  {
    id: "m6",
    title: "Testing the extremes",
    teacher: "geodrake",
    rarity: "epic",
    mins: 15,
    intro: "Some problems look impossible to pin down until you push them to the LIMIT — the biggest or smallest allowed case. This module builds the habit of maximising or minimising one quantity by making every other quantity as extreme as the rules permit.",
    steps: [
      { kind: "teach", heading: "Push to the boundary", body: [
        "When a problem asks for the largest or smallest possible value, think about what is forced at the EXTREME.",
        "Make one quantity as big as the rules allow, and see what the others are forced to be.",
        "Writing \"to make X as large as possible, we make Y as small as possible\" is powerful Olympiad reasoning." ] },
      { kind: "example", problem: "Three different positive whole numbers add to 12. What is the largest any one of them could be?",
        working: [
          "STATE: Three DIFFERENT positive whole numbers add to 12. I want the largest possible single value.",
          "WORK: To make one number as big as possible, make the other two as small as possible.",
          "WORK: The two smallest different positive whole numbers are 1 and 2, which add to 3.",
          "WORK: So the largest number is 12 − 3 = 9, giving the set {1, 2, 9}.",
          "CONCLUDE: The largest any one number could be is 9." ],
        answer: "9" },
      { kind: "example", problem: "Four different positive whole numbers add to 16. What is the largest any one of them could be?",
        working: [
          "STATE: Four DIFFERENT positive whole numbers add to 16. I want the largest possible single value.",
          "WORK: To make one number as big as possible, make the other three as small as possible.",
          "WORK: The three smallest different positive whole numbers are 1, 2 and 3, which add to 6.",
          "WORK: So the largest number is 16 − 6 = 10, giving the set {1, 2, 3, 10}.",
          "CONCLUDE: The largest any one number could be is 10." ],
        answer: "10" },
      { kind: "teach", heading: "Always check your extreme is allowed", body: [
        "Pushing to the extreme is only valid if the result still obeys ALL the rules.",
        "Here the numbers must be DIFFERENT and POSITIVE, so the smallest two are 1 and 2, not 0 and 0.",
        "State the constraints you are respecting; that is what makes the argument airtight." ] },
      { kind: "order", problem: "Three different positive whole numbers add to 20. Find the largest possible single value.",
        prompt: "Order the reasoning.",
        shuffled: [
          "The smallest two different positive whole numbers are 1 and 2, adding to 3.",
          "To maximise one number, minimise the other two.",
          "So the largest is 20 − 3 = 17, from the set {1, 2, 17}." ],
        correct: [1, 0, 2],
        explain: "First state the strategy (minimise the others), then find the smallest allowed pair, then subtract." },
      { kind: "write", problem: "Four different positive whole numbers add to 30. What is the largest one possible? Write a full solution explaining the extreme.",
        prompt: "Explain why you minimise the others, respect 'different and positive', then conclude. Check the model.",
        model: [
          "STATE: Four different positive whole numbers add to 30. I want the largest possible single value.",
          "WORK: To make one as large as possible, the other three must be as small as possible.",
          "WORK: The three smallest different positive whole numbers are 1, 2 and 3, adding to 6.",
          "WORK: So the largest is 30 − 6 = 24, from the set {1, 2, 3, 24}.",
          "CONCLUDE: The largest possible value is 24." ],
        answer: "24",
        markScheme: [
          { pts: 1, desc: "Said I would minimise the other three numbers." },
          { pts: 1, desc: "Used 1, 2, 3 (smallest DIFFERENT positives)." },
          { pts: 1, desc: "Subtracted their sum from 30." },
          { pts: 1, desc: "Concluded 24 and showed the set works." } ] },
    ],
  },

  /* ===================== MODULE 17: COUNTING GROUPS WHERE ORDER DOESN'T MATTER ===================== */
  {
    id: "m17",
    title: "Counting groups, not orders",
    teacher: "quantakit",
    rarity: "epic",
    mins: 16,
    intro: "An earlier module built the basics of systematic counting. This module goes further, handling the case where a GROUP is chosen and order makes no difference — a distinction that changes how the counting must be done.",
    steps: [
      { kind: "teach", heading: "When order doesn't matter", body: [
        "Counting in order usually means multiplying choices (e.g. first digit × second digit). But sometimes you're just CHOOSING a group, where order makes no difference.",
        "Choosing 2 people from a group of 4 to form a pair: {Ann, Ben} is the SAME pair as {Ben, Ann} — order doesn't create a new outcome.",
        "This means ordered-counting methods over count groups where order doesn't matter, and need adjusting." ] },
      { kind: "example", problem: "From 4 friends (A, B, C, D), how many different PAIRS can be chosen to go to the shop together?",
        working: [
          "STATE: I want the number of unordered pairs from 4 friends.",
          "WORK: List systematically, always naming the alphabetically-earlier friend first: AB, AC, AD, BC, BD, CD.",
          "WORK: That's 6 pairs. Notice AB and BA are the SAME pair, so we only listed each pair once.",
          "CONCLUDE: There are 6 different pairs." ],
        answer: "6" },
      { kind: "example", problem: "From 5 different books, how many different PAIRS can be chosen to take on holiday?",
        working: [
          "STATE: I want the number of unordered pairs from 5 books.",
          "WORK: List systematically, naming the alphabetically-earlier book first: AB, AC, AD, AE, BC, BD, BE, CD, CE, DE.",
          "WORK: That's 10 pairs. Notice AB and BA are the SAME pair, so each was only listed once.",
          "CONCLUDE: There are 10 different pairs." ],
        answer: "10" },
      { kind: "teach", heading: "A shortcut: half the ordered count", body: [
        "If order DID matter, there would be 4 choices for the first friend and 3 for the second, giving 4×3=12 ordered pairs.",
        "But each unordered pair (like {A,B}) was counted TWICE in that 12 — once as AB, once as BA. So the true count of unordered pairs is 12 ÷ 2 = 6, matching the list.",
        "This 'count ordered, then divide by the repeats' trick extends to bigger groups too, though the divisor grows (choosing 3 from a group has 3×2×1=6 orderings of each group, so you'd divide by 6)." ] },
      { kind: "choose", problem: "From 5 people, how many different pairs can be chosen for a doubles tennis team (order within the pair doesn't matter)?",
        prompt: "Pick the correctly reasoned answer.",
        options: [
          "5 × 4 = 20 pairs.",
          "Ordered count is 5×4=20, but each pair is counted twice (order doesn't matter), so the answer is 20 ÷ 2 = 10.",
          "5 pairs, one per person.",
          "5 + 4 = 9 pairs." ],
        correctIndex: 1,
        explain: "Counting ordered choices gives 5×4=20, but {X,Y} and {Y,X} are the same pair, so divide by 2 to get 10 genuine pairs." },
      { kind: "write", problem: "A quiz team needs exactly 3 members chosen from 6 students, and the ORDER they're chosen in doesn't matter. How many different teams are possible? (Hint: count ordered choices first, then work out how many times each team of 3 gets repeated.)",
        prompt: "Count the ordered selections, work out the repeat-factor for a group of 3, then divide. Show full working.",
        model: [
          "STATE: I want the number of unordered teams of 3 from 6 students.",
          "WORK: Counting in order: 6 choices for the first member, 5 for the second, 4 for the third, giving 6×5×4=120 ordered selections.",
          "WORK: Each actual team of 3 students can be put in order in 3×2×1=6 different ways (3 choices for who's 'first', 2 left for 'second', 1 left for 'third').",
          "WORK: So every genuine team has been counted 6 times over in the 120 ordered selections.",
          "CONCLUDE: The number of different teams is 120 ÷ 6 = 20." ],
        answer: "20",
        markScheme: [
          { pts: 1, desc: "Counted the ordered selections correctly (6×5×4=120)." },
          { pts: 2, desc: "Correctly worked out that each team of 3 is repeated 3×2×1=6 times." },
          { pts: 1, desc: "Divided correctly to reach 20 teams." } ] },
    ],
  },

  /* ===================== MODULE 18: PROOF BY CONTRADICTION ===================== */
  {
    id: "m18",
    title: "Proof by contradiction",
    teacher: "paradox",
    rarity: "epic",
    mins: 16,
    intro: "To prove a statement is true, the cleanest path is sometimes to assume it is FALSE and show that assumption collapses into something impossible. That trick — assume the opposite, then watch it break — is one of the most powerful proof methods in mathematics.",
    steps: [
      { kind: "teach", heading: "Assume the opposite", body: [
        "To prove a statement is TRUE, sometimes the cleanest path is to assume it's FALSE, and show that assumption leads to something impossible.",
        "If assuming 'not true' forces a contradiction (two facts that can't both hold), then 'not true' must itself be impossible — so the original statement WAS true all along.",
        "This is called proof by contradiction. It feels backwards at first, but it's often the only way to prove something is impossible or that an infinite search would never find a counterexample." ] },
      { kind: "example", problem: "Prove that there is no largest whole number.",
        working: [
          "STATE: I want to prove no whole number is the largest of all whole numbers.",
          "WORK: Suppose, for contradiction, that there WAS a largest whole number. Call it N.",
          "WORK: Consider N + 1. This is also a whole number, and N + 1 > N.",
          "WORK: So N + 1 is a whole number bigger than N — but N was supposed to be the LARGEST. That's a contradiction.",
          "CONCLUDE: The assumption that a largest whole number exists must be false. So there is no largest whole number." ],
        answer: "There is no largest whole number (a proof, not a specific number)." },
      { kind: "example", problem: "Prove that a whole number and the whole number one bigger than it cannot both be even.",
        working: [
          "STATE: I want to prove n and n+1 cannot both be even, for any whole number n.",
          "WORK: Suppose, for contradiction, that n and n+1 are BOTH even.",
          "WORK: If n is even, n = 2k for some whole number k. Then n+1 = 2k+1, which is ODD by definition — but the assumption says n+1 is even. That is a contradiction.",
          "CONCLUDE: The assumption must be false, so n and n+1 can never both be even." ],
        answer: "n and n+1 can never both be even (a proof, not a number)." },
      { kind: "teach", heading: "Spotting the contradiction", body: [
        "The whole method hinges on finding ONE clear contradiction — two things that flatly can't both be true.",
        "Common contradictions in Olympiad problems: a number that must be both odd and even; a count that must be both bigger and smaller than itself; two different values forced to be equal to the same unique thing.",
        "Always state your assumption explicitly ('Suppose, for contradiction, that...') so the reader knows exactly what you're about to disprove." ] },
      { kind: "choose", problem: "A claim is to be proved: 'There is no smallest positive fraction.' Which opening correctly sets up a contradiction proof?",
        prompt: "Pick the correct first move.",
        options: [
          "List a few small fractions like 1/2, 1/4, 1/8.",
          "Suppose, for contradiction, that there IS a smallest positive fraction, call it f. Then consider f/2, which is also positive but smaller than f.",
          "Fractions can't be ordered, so the question doesn't make sense.",
          "The smallest positive fraction is 1/1000000." ],
        correctIndex: 1,
        explain: "A contradiction proof must explicitly assume the opposite of what you want to show (a smallest fraction exists), then find something that breaks it (f/2 is smaller still)." },
      { kind: "write", problem: "Prove that √2 cannot be written as a whole number. (Hint: assume it CAN be written as a whole number n, and think about what n² would have to equal.)",
        prompt: "Assume the opposite explicitly, derive a contradiction, and conclude. Write a full solution.",
        model: [
          "STATE: I want to prove √2 is not a whole number.",
          "WORK: Suppose, for contradiction, that √2 IS a whole number, call it n. Then n² = 2 (squaring both sides).",
          "WORK: Check whole numbers: 1²=1, and 2²=4. There is no whole number whose square is 2 — it would have to sit strictly between 1 and 2, which is impossible for a whole number.",
          "CONCLUDE: The assumption that √2 is a whole number leads to an impossible requirement (a whole number squaring to exactly 2, between 1² and 2²). So √2 cannot be a whole number." ],
        answer: "√2 is not a whole number (a proof, not a number).",
        markScheme: [
          { pts: 1, desc: "Explicitly assumed the opposite (√2 IS a whole number n)." },
          { pts: 1, desc: "Correctly derived that n² would have to equal 2." },
          { pts: 1, desc: "Showed no whole number's square equals 2 (it would sit strictly between 1² and 2²)." },
          { pts: 1, desc: "Concluded clearly that the assumption is impossible, so √2 is not a whole number." } ] },
    ],
  },

  /* ===================== MODULE 7: A FULL OLYMPIAD WRITE-UP ===================== */
  {
    id: "m7",
    title: "Putting it all together",
    teacher: "sphinxa",
    rarity: "epic",
    mins: 16,
    intro: "Every tool from earlier modules — STATE-WORK-CONCLUDE, justifying with 'because', using a letter, working systematically, testing extremes — combines in a real Olympiad-style problem. This module weaves them together into one complete, justified solution.",
    steps: [
      { kind: "teach", heading: "The full toolkit", body: [
        "A complete Olympiad solution weaves together everything you've learned.",
        "You will define any unknowns, reason one justified step at a time, perhaps work systematically or use an extreme, and finish with a clear conclusion.",
        "Length is not the goal — CLARITY is. A short solution where every line is justified beats a long rambling one." ] },
      { kind: "example", problem: "Two different positive whole numbers have a sum of 15 and a product that is as large as possible. Find the two numbers and the product.",
        working: [
          "STATE: Let the two different positive whole numbers be a and b with a + b = 15. I want the pair whose product ab is largest.",
          "WORK: For a fixed sum, the product is largest when the numbers are as CLOSE together as possible.",
          "WORK: Since 15 is odd, the closest different whole numbers are 7 and 8 (they differ by 1).",
          "WORK: Their product is 7 × 8 = 56. Any pair further apart, like 6 and 9, gives a smaller product (54).",
          "CONCLUDE: The numbers are 7 and 8, giving the largest product, 56." ],
        answer: "7 and 8, product 56" },
      { kind: "example", problem: "Two different positive whole numbers have a sum of 13 and a product that is as large as possible. Find the two numbers and the product.",
        working: [
          "STATE: Let the two different positive whole numbers be a and b with a + b = 13. I want the pair whose product ab is largest.",
          "WORK: For a fixed sum, the product is largest when the numbers are as CLOSE together as possible.",
          "WORK: Since 13 is odd, the closest different whole numbers are 6 and 7 (they differ by 1).",
          "WORK: Their product is 6 × 7 = 42. A wider pair, like 5 and 8, gives only 40.",
          "CONCLUDE: The numbers are 6 and 7, giving the largest product, 42." ],
        answer: "6 and 7, product 42" },
      { kind: "teach", heading: "Stating the key principle", body: [
        "Notice the line: \"for a fixed sum, the product is largest when the numbers are closest together.\"",
        "Naming the principle you are using is exactly what examiners reward. It shows you understand WHY, not just THAT.",
        "Then we backed it up by checking a nearby pair (6 and 9) gave less. A quick check strengthens any claim." ] },
      { kind: "choose", problem: "A solution must explain why 7 and 8 beat 6 and 9 for the largest product with sum 15.",
        prompt: "Which sentence is the strongest justification?",
        options: [
          "Because 7 and 8 are nicer numbers.",
          "Because for a fixed sum the product is biggest when the two numbers are closest, and 7, 8 differ by only 1.",
          "Because I tried it and it worked.",
          "Because 7 × 8 is even." ],
        correctIndex: 1,
        explain: "Option 2 names the general principle (closest numbers give the biggest product for a fixed sum) and applies it." },
      { kind: "write", problem: "Two different positive whole numbers have sum 11 and the largest possible product. Find them and the product, with a full justified solution.",
        prompt: "Use the full toolkit: define, state the principle, apply it, check, conclude. Then compare to the model.",
        model: [
          "STATE: Let the two different positive whole numbers be a and b with a + b = 11. I want the largest product ab.",
          "WORK: For a fixed sum, the product is largest when the numbers are as close as possible.",
          "WORK: Since 11 is odd, the closest different whole numbers are 5 and 6.",
          "WORK: Their product is 5 × 6 = 30, and a wider pair such as 4 and 7 gives only 28.",
          "CONCLUDE: The numbers are 5 and 6, giving the largest product, 30." ],
        answer: "5 and 6, product 30",
        markScheme: [
          { pts: 1, desc: "Defined the two numbers with a letter each and stated the sum." },
          { pts: 1, desc: "Named the principle (closest numbers give the biggest product)." },
          { pts: 1, desc: "Found 5 and 6 and computed 30." },
          { pts: 1, desc: "Checked a nearby pair gave less, and concluded clearly." } ] },
    ],
  },

  /* ===================== MODULE 8: THE MASTER CHALLENGE ===================== */
  {
    id: "m8",
    title: "The Master Challenge",
    teacher: "infinitus",
    rarity: "legendary",
    mins: 16,
    intro: "Every technique from earlier modules now comes together in problems written at true Olympiad standard. This module shows exactly how a master writes a complete, checked solution — and how real marks are awarded for it.",
    steps: [
      { kind: "teach", heading: "How marks are really awarded", body: [
        "In the real Junior Mathematical Olympiad, a fully correct answer with NO working can score just 1 mark out of 10.",
        "A complete, clearly justified solution scores all 10 — even the occasional one with a small arithmetic slip can score 8 or 9 if the reasoning is sound.",
        "So your written reasoning is worth far more than the final number. Write for a reader who doubts you and must be convinced." ] },
      { kind: "example", problem: "A two-digit number has digit sum 12, and the number is 36 more than the number with its digits reversed. Find the number.",
        working: [
          "STATE: Let the tens digit be t and the units digit be u. The number is 10t + u. I know t + u = 12, and the number is 36 more than its reverse.",
          "WORK: The reversed number is 10u + t. The condition gives 10t + u = (10u + t) + 36.",
          "WORK: Simplifying: 10t + u − 10u − t = 36, so 9t − 9u = 36, hence t − u = 4.",
          "WORK: Now solve t + u = 12 and t − u = 4. Adding gives 2t = 16, so t = 8, and then u = 4.",
          "CONCLUDE: The tens digit is 8 and the units digit is 4, so the number is 84. (Check: digits add to 12; 84 − 48 = 36.)" ],
        answer: "84" },
      { kind: "teach", heading: "The check at the end", body: [
        "See how the example ended with a CHECK: digits add to 12, and 84 − 48 = 36. Both conditions hold.",
        "A final check catches mistakes and shows the examiner your answer truly fits. Always check when you can.",
        "This is the mark of a master: not just finding an answer, but proving it is right." ] },
      { kind: "write", problem: "MASTER PROBLEM 1. A two-digit number has digit sum 9, and it is 27 more than its reverse. Find the number, with a complete justified solution and a final check.",
        prompt: "Use everything: define digits, form two equations, solve, conclude, CHECK. Then compare with the master solution.",
        model: [
          "STATE: Let the tens digit be t and units digit u, so the number is 10t + u. I know t + u = 9 and the number is 27 more than its reverse.",
          "WORK: The reverse is 10u + t, so 10t + u = (10u + t) + 27.",
          "WORK: This gives 9t − 9u = 27, so t − u = 3.",
          "WORK: Solving t + u = 9 and t − u = 3: adding gives 2t = 12, so t = 6 and u = 3.",
          "CONCLUDE: The number is 63. Check: 6 + 3 = 9, and 63 − 36 = 27. Both conditions hold." ],
        answer: "63",
        markScheme: [
          { pts: 1, desc: "Defined t and u and wrote the number as 10t + u." },
          { pts: 1, desc: "Formed the digit-sum equation t + u = 9." },
          { pts: 2, desc: "Correctly derived the reverse-difference equation t − u = 3." },
          { pts: 1, desc: "Solved the pair of equations to get t = 6, u = 3." },
          { pts: 1, desc: "Concluded 63 AND checked both conditions." } ] },
      { kind: "write", problem: "MASTER PROBLEM 2. Three different positive whole numbers are chosen. Their sum is 100 and the largest is as small as possible. Find the largest number, with a full justified solution.",
        prompt: "Think about the extreme: to make the largest as SMALL as possible, the three should be as close together as possible. Write it all out, then compare.",
        model: [
          "STATE: Three different positive whole numbers add to 100. I want the largest of them to be as small as possible.",
          "WORK: To make the largest as small as possible, the three numbers should be as close together as possible.",
          "WORK: A third of 100 is about 33.3, so the closest three different whole numbers are 32, 33, 34 — but these sum to only 99, one short of 100.",
          "WORK: Increasing the largest by 1 keeps all three different and reaches the target: 32 + 33 + 35 = 100, with largest 35.",
          "WORK: Could the largest be 34 or less? Then the other two (different from each other and from 34, so both at most 33) sum to at most 33 + 32 = 65, but they would need to sum to at least 66 — impossible.",
          "CONCLUDE: So the largest number cannot be 34 or smaller, but 35 works. The smallest possible value of the largest number is 35." ],
        answer: "35",
        markScheme: [
          { pts: 1, desc: "Stated I would make the three numbers as close as possible." },
          { pts: 1, desc: "Tried numbers near 100 ÷ 3 ≈ 33." },
          { pts: 2, desc: "Showed 34 is impossible (the other two cannot reach the needed sum)." },
          { pts: 1, desc: "Found 32 + 33 + 35 = 100." },
          { pts: 1, desc: "Concluded clearly that the answer is 35." } ] },
    ],
  },
];

// Phase 0: stamp primaryType onto every card and boss at module-load time (edge case §6/§7).
// Regular cards: lowest index wins on tie (computePrimaryType uses indexOf = first occurrence).
for (const c of JUNIOR_CARDS) { normaliseJoeyCardStats(c); }
for (const b of JUNIOR_BOSSES) { normaliseJoeyCardStats(b); }
