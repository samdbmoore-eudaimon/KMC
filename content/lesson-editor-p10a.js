import { simple, swc, clear, applyEditorialRevisions } from "./lesson-editor-runtime.js";

const S = (q, state, steps, answer, check, structureId, difficulty) => simple({ q, state, steps, answer, conclusion: answer, check, structureId, difficulty });
const W = (q, state, steps, answer, check, structureId, difficulty) => swc({ q, state, steps, answer, conclusion: answer, check, structureId, difficulty });
const C = (q, comprehend, link, explain, steps, answer, review, structureId) => clear({ q, state: comprehend, comprehend, link, explain, steps, answer, conclusion: answer, check: review, review, structureId, difficulty: 4 });

export function applyPrimaryEditorP10A(lessons) {
  const original = lessons.logicGrid;
  const revisions = {
    logicGrid: {
      intro: "Logic puzzles ask us to find an arrangement that makes every clue true at the same time. We will separate facts from guesses, record possible and impossible matches, follow chains of deductions and prove that a finished answer is both valid and complete.",
      sections: [
        {
          h: "1. Clues, possibilities and conclusions",
          body: [
            "A clue is information the puzzle tells us is true. A possibility is an arrangement that might be true but has not yet been proved. Keeping these separate stops a guess from quietly turning into a fact.",
            "Suppose every squirrel in the tall hedge is silver, and Jon is a squirrel in the tall hedge. Jon fits both parts of the rule, so Jon must be silver. That final statement is a conclusion: it follows from the clues.",
            "The direction of a clue matters. ‘Every tall-hedge squirrel is silver’ does not say that every silver animal is a tall-hedge squirrel. A silver rabbit would not break the clue.",
            "Before accepting a conclusion, point to the exact clue that supports each step. If a step depends only on ‘maybe’, it is still a possibility."
          ],
          examples: [
            S(original.sections[0].examples[0].q, "The rule applies to every squirrel in the tall hedge, and Jon is stated to be one of those squirrels.", original.sections[0].examples[0].steps, "Jon is silver.", "If Jon were not silver, he would be a tall-hedge squirrel that breaks the ‘all are silver’ clue. Therefore the opposite is impossible.", "must_be_true_statement", 1),
            W(original.sections[0].examples[1].q, "Chen belongs to the exact group covered by the rule: hedgehogs living in the tall hedge.", original.sections[0].examples[1].steps, "Chen is brown.", "The conclusion uses both clues. Removing either ‘Chen is a hedgehog there’ or ‘all such hedgehogs are brown’ would make the conclusion unproved.", "must_be_true_statement", 2),
            W("All badgers in the tall hedge are brown. Jon is a badger in the tall hedge. Mina is brown. What must be true, and what is only possible?", "Jon is inside the group covered by the rule. Mina's colour is known, but no clue places her in the tall hedge or says she is a badger.", ["The rule and Jon's membership combine to prove that Jon is brown.", "Mina being brown does not let us reverse the rule.", "Mina might be a tall-hedge badger, but that is only a possibility."], "Jon must be brown. Mina being a tall-hedge badger is only possible, not proved.", "Jon satisfies the rule directly. A brown animal outside the hedge is a counterexample to the reversed claim but does not break the original rule.", "syllogism_quantifier", 3),
            C("Every orchard raven is black. Some black birds live beside the mill. Pip says, ‘Every bird beside the mill is an orchard raven.’ Is Pip's statement always true, sometimes true or never true?", "We know the colour of orchard ravens and that some black birds live beside the mill. We do not know the kind of every mill bird.", "A rule from raven to black cannot automatically be read backwards from black to raven.", "Test two complete cases: one where all mill birds are orchard ravens and one where a black mill bird is a different kind of bird.", ["Case 1: if the mill birds happen all to be orchard ravens, Pip's statement is true.", "Case 2: a black crow beside the mill satisfies the colour clue but makes Pip's statement false.", "Both cases fit the original clues."], "Pip's statement is sometimes true.", "We produced one allowed case where it is true and one allowed case where it is false. That is exactly what ‘sometimes true’ means.", "always_sometimes_never")
          ]
        },
        {
          h: "2. List the full set before eliminating",
          body: [
            "Elimination means ruling out choices that cannot fit. It works only when we know the full set of choices first.",
            "If Kira, Leo and Dee have rabbit, hamster and cat exactly once each, write all three pets down. Leo's hamster removes hamster from Kira and Dee. Dee's cat removes cat. Rabbit is then forced for Kira.",
            "A systematic list is safer than holding possibilities in your head. Cross out a value only because of a clue or because that value is already used.",
            "When one choice remains, say why the list is complete: every allowed value was written once, and every removed value has a reason."
          ],
          examples: [
            S(original.sections[1].examples[0].q, "The three pets form a complete one-each set. Leo and Dee already use two different pets.", original.sections[1].examples[0].steps, "Kira has the rabbit.", "The final pet list is Kira rabbit, Leo hamster, Dee cat. Each allowed pet appears once and no person receives two.", "elimination_two_known", 1),
            W(original.sections[1].examples[1].q, "Jon's rabbit and Chen's fish use two members of the complete pet list, leaving one pet for Amir.", original.sections[1].examples[1].steps, "Amir has the parrot.", "Rabbit, fish and parrot each appear exactly once. Giving Amir either used pet would repeat a pet and leave parrot unused.", "elimination_two_known", 2),
            W(original.sections[1].examples[2].q, "Dog and fish are assigned to Dee and Ewan, while every person must have a different pet from the three-item list.", original.sections[1].examples[2].steps, "Hal has the cat.", "The completed assignment uses cat, dog and fish once each and preserves both stated matches.", "row_position_n", 3),
            C("Asha, Bo, Cora and Dev each have a different pet: cat, dog, fish or rabbit. Asha has neither cat nor dog. Bo has the rabbit. Cora does not have the fish. Dev has neither dog nor rabbit. Who has each pet?", "Four people use four pets exactly once. Every negative clue removes named candidates, while Bo's positive clue fixes rabbit immediately.", "After placing rabbit, compare the remaining candidate sets. A value that appears in only one person's list is forced even if that person still has several candidates.", "Make a candidate list for every person, update all lists after each forced match and continue until each list has one pet.", ["Bo = rabbit, so remove rabbit from Asha, Cora and Dev.", "Asha can be fish only: cat and dog are forbidden, and rabbit is used. Therefore Asha = fish.", "Cora is not fish and rabbit is used, so Cora has cat or dog.", "Dev is not dog or rabbit, and fish is used, so Dev = cat.", "The only pet left for Cora is dog."], "Asha has the fish, Bo the rabbit, Cora the dog and Dev the cat.", "Check every clue: Asha has neither cat nor dog; Bo has rabbit; Cora is not fish; Dev has neither dog nor rabbit. All four pets appear exactly once.", "simultaneous_numeric_constraints")
          ]
        },
        {
          h: "3. A grid records matches and exclusions",
          body: [
            "A logic grid is a table. Put one set, such as people, down the left and another set, such as fruits, across the top.",
            "A tick means a match is certain. A cross means a match is impossible. Leave a box blank while it remains possible.",
            "If Chen = cherry, tick that box. Because each person and fruit is used once, cross every other fruit in Chen's row and every other person in the cherry column.",
            "A grid does not solve the puzzle by itself. It stores the consequences of clues so we can see when a row or column has only one blank box left."
          ],
          examples: [
            S(original.sections[2].examples[0].q, "Chen's cherry match is certain, and the puzzle uses one fruit per person and one person per fruit.", original.sections[2].examples[0].steps, original.sections[2].examples[0].answer, "Chen's row has one tick and two crosses; the cherry column also has one tick and two crosses. No second cherry match remains possible.", "elimination_two_known", 1),
            W(original.sections[2].examples[1].q, "A tick at Cal–nurse removes every other job from Cal and removes nurse from every other person.", original.sections[2].examples[1].steps, original.sections[2].examples[1].answer, "One tick plus three row crosses plus three column crosses gives 1 + 3 + 3 = 7 distinct boxes. The tick is not counted as a cross.", "two_by_two_grid", 2),
            W(original.sections[2].examples[2].q, "Alex's positive match removes red elsewhere. Beth's negative clue then acts on the smaller set of choices.", original.sections[2].examples[2].steps, original.sections[2].examples[2].answer, "Alex red, Beth blue and Carl green use each colour once. Alex is red and Beth is not green, so both original clues hold.", "two_by_two_grid", 3),
            C("Ava, Ben and Cleo each choose a different fruit and a different day. Fruits are apple, pear and plum; days are Monday, Tuesday and Wednesday. Ben chooses apple on Tuesday. Ava does not choose pear or Wednesday. The plum is chosen on Wednesday. What does each person choose, and on which day?", "We must link three sets at once: people, fruits and days. Ben's complete match and the plum–Wednesday link each remove choices from two grids.", "Ava cannot take pear, apple or Wednesday after Ben's match is placed, so her remaining fruit and day become forced.", "Record definite links first, copy every consequence into both grids and only then use the final unused values.", ["Ben = apple and Tuesday.", "Ava is not pear, and apple is used, so Ava = plum.", "Plum is on Wednesday, so Ava = Wednesday, which agrees with neither? This contradicts the clue that Ava is not Wednesday.", "Therefore the stated clues have no possible solution."], "There is no arrangement satisfying all the clues.", "Ben's match forces Ava to plum, while plum forces Wednesday, directly contradicting Ava ≠ Wednesday. Exhibiting the contradiction proves impossibility; guessing a different person cannot repair it.", "linked_two_attribute_grid")
          ]
        },
        {
          h: "4. Use positive and negative clues together",
          body: [
            "A positive clue places a tick. A negative clue places a cross. Both can be equally powerful.",
            "Begin with a positive clue when one exists because its row and column crosses often create new single choices.",
            "After every mark, scan all rows and columns. If two of three choices are crossed, the third is forced even when no clue states it directly.",
            "Write deductions as a chain: clue, exclusions, one remaining value. This makes the reasoning easy to check."
          ],
          examples: [
            S(original.sections[3].examples[0].q, "Chen's cherry is fixed. Amir's and Bo's negative clues decide how apple and banana fill the remaining two places.", original.sections[3].examples[0].steps, original.sections[3].examples[0].answer, "The final list uses each fruit once: Amir apple, Bo banana, Chen cherry. Amir is not banana and Bo is not apple.", "three_negative_clues", 1),
            W(original.sections[3].examples[1].q, "Ed's history match removes history from Fay and Greg. Fay's negative clue then chooses between the two subjects left.", original.sections[3].examples[1].steps, original.sections[3].examples[1].answer, "Ed history, Fay geography and Greg science are different, and Fay is not science as required.", "three_negative_clues", 2),
            W(original.sections[3].examples[2].q, "Jade is ruled out of cat and rabbit, so one pet is forced before the other clues are combined.", original.sections[3].examples[2].steps, original.sections[3].examples[2].answer, "Ivan rabbit, Jade dog and Kim cat satisfy all four negative clues and use each pet exactly once.", "deduction_chain_three_clues", 3),
            C("Ann, Ben, Cara and Deni each own a different pet: cat, dog, fish or rabbit. Ann owns the dog. Ben owns neither cat nor rabbit. Cara does not own the fish. Deni does not own the rabbit. Who owns each pet?", "Ann's positive match fixes dog. Ben's two exclusions leave only one possible unused pet after dog is removed.", "Use the most restricted person first, then remove that pet from the remaining people and repeat.", "Place Ann, solve Ben's reduced candidate list and use the remaining negative clues to separate Cara and Deni.", ["Ann = dog, so dog is unavailable to everyone else.", "Ben is not cat or rabbit, so Ben = fish.", "Cara is not fish and dog is used, so Cara has cat or rabbit.", "Deni is not rabbit, while dog and fish are used, so Deni = cat.", "The remaining pet gives Cara = rabbit."], "Ann has the dog, Ben the fish, Cara the rabbit and Deni the cat.", "Ann dog is correct; Ben has neither cat nor rabbit; Cara is not fish; Deni is not rabbit. All pets are used once.", "deduction_chain_three_clues")
          ]
        },
        {
          h: "5. Negative clues shrink candidate lists",
          body: [
            "‘Does not’ may feel less useful than a direct match, but several exclusions can leave exactly one candidate.",
            "Write the full candidate list beside each person. Cross out the value named by every negative clue rather than trying to remember it.",
            "A negative clue can also force a value through a column. If two people cannot have rabbit, the third person must have rabbit.",
            "Never turn one exclusion into a positive guess too early. ‘Not cat’ still leaves every other unused pet possible."
          ],
          examples: [
            S(original.sections[4].examples[0].q, "Bea is excluded from cat and rabbit, so only one member of the complete pet set remains for her.", original.sections[4].examples[0].steps, "Bea has the fish.", "Fish is allowed for Bea, while both alternatives are explicitly forbidden. A complete arrangement also gives Dee cat and Leo rabbit.", "three_negative_clues", 1),
            W(original.sections[4].examples[1].q, "Amir cannot have dog or rabbit, while Hal cannot have dog. These exclusions must be combined with the one-each rule.", original.sections[4].examples[1].steps, "Hal has the rabbit.", "Hal rabbit, Ida dog and Amir parrot satisfy every exclusion and use all three pets once.", "three_negative_clues", 2),
            W(original.sections[4].examples[2].q, "Ida is excluded from fish and parrot, which fixes her pet. Chen's exclusion then settles the other two.", original.sections[4].examples[2].steps, "Bea has the fish.", "The assignment Chen parrot, Bea fish, Ida dog satisfies all three clues; no pet repeats.", "deduction_chain_three_clues", 3),
            C("Four runners A, B, C and D finish in different places. B is not first or fourth. C finishes after B. D does not finish first. A finishes immediately before D. Find the order.", "The adjacent block A–D can occupy positions 1–2, 2–3 or 3–4. Each case must also leave a legal place for B before C.", "Test the three possible positions of the A–D block systematically and reject a case as soon as it breaks one clue.", "Create a short case table for the block, then fill the two unused positions with B and C in their required order.", ["If A–D are 1st–2nd, the unused places are 3rd–4th; B can be 3rd and C 4th. All clues hold.", "If A–D are 2nd–3rd, B would need to be 1st so C can follow, but B is not first.", "If A–D are 3rd–4th, B and C take 1st–2nd in that order, again making B first.", "Only the first case survives."], "A is first, D second, B third and C fourth.", "The order has A immediately before D; B is neither first nor fourth; C is after B; D is not first. The rejected cases cover every other possible location of the A–D block.", "deduction_chain_three_clues")
          ]
        },
        {
          h: "6. One deduction can unlock the next",
          body: [
            "A deduction chain begins when one clue leaves a single choice. That new fact removes a choice elsewhere, which may force another fact.",
            "Write the chain in order rather than jumping to the final answer. This shows which conclusion depends on which earlier result.",
            "If a clue still leaves two candidates, pause. It may become useful after another row or column is solved.",
            "A good next move is the most restricted row, column or person: the one with the fewest candidates left."
          ],
          examples: [
            S(original.sections[5].examples[0].q, "Max is ruled out of two of the three colours, so Max must be solved before Lily's single exclusion becomes decisive.", original.sections[5].examples[0].steps, original.sections[5].examples[0].answer, "Max blue, Lily green and Nina red use each colour once and satisfy both negative clues.", "elimination_two_known", 1),
            W(original.sections[5].examples[1].q, "Dan's two exclusions force piano. Removing piano then makes Eva's negative clue sufficient.", original.sections[5].examples[1].steps, original.sections[5].examples[1].answer, "Dan piano, Eva violin and Finn guitar satisfy both clues and use each instrument once.", "two_by_two_grid", 2),
            W(original.sections[5].examples[2].q, "Cal's pilot match starts the chain. Al's exclusions then force doctor, and Dan's final exclusion separates chef from artist.", original.sections[5].examples[2].steps, original.sections[5].examples[2].answer, "Al doctor, Beth chef, Cal pilot and Dan artist satisfy all four clues; every job appears once.", "deduction_chain_three_clues", 3),
            C("Five children A, B, C, D and E choose different numbers 1 to 5. C chooses 5. A's number is one less than B's. D chooses neither 1 nor 4. E chooses 2. B does not choose 4. Find every number.", "The fixed values C = 5 and E = 2 leave 1, 3 and 4 for A, B and D. The consecutive A–B link restricts their possible pair.", "List consecutive pairs from the remaining values in the correct A-then-B order, then apply B ≠ 4 and D's exclusions.", "Use fixed values first, test the short list of consecutive pairs and give the unused value to D.", ["After C = 5 and E = 2, the unused values are 1, 3 and 4.", "The only consecutive pair among these is 3, 4, but that would give B = 4, which is forbidden.", "No other unused pair differs by one.", "Therefore the clues are inconsistent."], "There is no possible assignment.", "The remaining-set list {1, 3, 4} is complete. Its only consecutive pair is rejected by B ≠ 4, so no missed arrangement can work.", "meta_which_clue_resolves")
          ]
        },
        {
          h: "7. A solution must satisfy every clue",
          body: [
            "A proposed answer is not finished merely because it fits the last clue used. Every original clue and every one-each condition must hold together.",
            "Make a final checklist. Read each clue, substitute the proposed matches and mark it true or false.",
            "For ordering clues, write one complete chain from earliest to latest or shortest to tallest. This prevents two local comparisons from being joined in the wrong direction.",
            "One failed clue rejects the whole arrangement. If every clue passes, also check completeness: everyone has one value and every value is used once."
          ],
          examples: [
            S(original.sections[6].examples[0].q, "The four comparisons form one connected height chain beginning with Jon.", original.sections[6].examples[0].steps, "Chen is exactly one place taller than Jon.", "The chain Jon < Chen < Farah < Kira < Ewan contains every person once, and Chen is immediately after Jon.", "must_be_true_statement", 1),
            W(original.sections[6].examples[1].q, "Every comparison points from a shorter person to a taller person, so the left end of the completed chain is the shortest.", original.sections[6].examples[1].steps, "Bea is shortest.", "Bea < Dee < Ewan < Hal < Ida reproduces all four stated comparisons in their original direction.", "chain_comparison_order", 2),
            W(original.sections[6].examples[2].q, "The four links connect all five people. We need the person immediately after Farah in the ordered chain.", original.sections[6].examples[2].steps, "Gita is exactly one place taller than Farah.", "Farah < Gita < Dee < Amir < Ida satisfies each clue, and no person lies between Farah and Gita.", "chain_comparison_order", 3),
            C("A puzzle has people Amir, Bo and Chen and fruits apple, banana and cherry. Clues: Amir is not banana; Bo is not cherry; Chen is not apple. A pupil proposes Amir apple, Bo banana, Chen cherry. Is this the unique solution?", "The proposal satisfies the three negative clues, but uniqueness requires us to test whether a different complete arrangement also satisfies them.", "A valid arrangement proves possibility; two different valid arrangements disprove uniqueness.", "Check the proposed assignment, then systematically construct or rule out an alternative using unused fruits.", ["The proposal passes: Amir is not banana, Bo is not cherry and Chen is not apple.", "Try Amir cherry. The remaining apple and banana can be assigned as Bo apple and Chen banana.", "This alternative also passes every clue.", "Therefore the proposal is valid but not forced."], "No. The proposed solution works, but Amir cherry, Bo apple and Chen banana also works.", "Both complete assignments use every fruit once and satisfy all three clues. Two valid arrangements are enough to prove the solution is not unique.", "syllogism_quantifier")
          ]
        },
        {
          h: "8. Solve, then prove completeness",
          body: [
            "A complete method has six stages: list every value, record direct matches, record exclusions, scan for single candidates, repeat the consequences and check every clue.",
            "Do not erase the reasons behind a conclusion. A short written chain beside the grid lets another person follow the proof.",
            "Some clue sets have one solution, some have several and some are contradictory. The method should reveal which kind you have rather than assuming every puzzle is unique.",
            "Completeness means more than finding an answer that works. Explain why all alternatives were eliminated or exhibit a second valid answer when uniqueness fails."
          ],
          examples: [
            S(original.sections[7].examples[0].q, "Sam's cookie is fixed. Rosa is excluded from crisps and cookie, so her snack becomes forced.", original.sections[7].examples[0].steps, original.sections[7].examples[0].answer, "Rosa grapes, Sam cookie and Tess crisps satisfy all three clues and use every snack once.", "three_negative_clues", 1),
            W(original.sections[7].examples[1].q, "B's salad removes salad elsewhere. C's exclusion then selects between the two remaining meals.", original.sections[7].examples[1].steps, original.sections[7].examples[1].answer, "A sandwich, B salad and C soup satisfy each clue; soup, salad and sandwich each appear once.", "two_by_two_grid", 2),
            W(original.sections[7].examples[2].q, "S = green is the strongest direct clue. It reduces P to one colour, which then reduces R and finally Q.", original.sections[7].examples[2].steps, original.sections[7].examples[2].answer, "P yellow, Q blue, R red and S green pass all four clues and use every colour exactly once.", "linked_two_attribute_grid", 3),
            C("Ari, Bo, Cora and Dev each choose a different fruit and sit in a different numbered seat 1 to 4. Fruits are apple, banana, cherry and pear. Ari sits in seat 1. The apple is in seat 2. Bo chooses banana. Cora sits immediately after Bo. Dev does not choose pear. Ari does not choose cherry. Cora chooses neither apple nor banana. Find each person's seat and fruit.", "We must solve two linked one-each sets. Ari's seat and the apple's seat are fixed; Bo and Cora form an adjacent ordered seat block.", "Test the possible Bo–Cora seat blocks against occupied seat 1, then use fruit exclusions and the seat-2 apple link.", "Solve seats first because the adjacency clue is restrictive, transfer the seat-2 fact into the fruit list and finish by elimination.", ["Ari = seat 1. Bo–Cora cannot be seats 1–2, so test 2–3 or 3–4.", "If Bo–Cora are 2–3, Bo would sit in the apple seat but Bo has banana, impossible.", "Therefore Bo = seat 3 and Cora = seat 4; Dev takes seat 2 and therefore apple.", "Bo = banana. Cora is neither apple nor banana, while Dev has apple. Ari is not cherry, so Ari = pear and Cora = cherry."], "Ari: seat 1, pear; Dev: seat 2, apple; Bo: seat 3, banana; Cora: seat 4, cherry.", "Seats 1–4 and all four fruits are used once. Ari is seat 1 and not cherry; seat 2 has apple; Bo has banana; Cora immediately follows Bo and has neither apple nor banana; Dev is not pear.", "linked_two_attribute_grid")
          ]
        }
      ]
    }
  };
  applyEditorialRevisions(lessons, revisions);
}
