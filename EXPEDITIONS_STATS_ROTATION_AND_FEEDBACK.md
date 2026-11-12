# Expeditions: equation rotation, necessary card progression and player feedback

1 October 2026. User requirements supplement to the ten-mission proposal. These requirements take precedence over weaker wording in earlier proposals. Numerical examples below are proposed fixtures, not implemented gameplay.

## 1. Recorded requirements

Sam clarified that rotation should include turning numbers and operators to complete equations. Better cards must be needed for harder difficulties. Every printed stat must count. Players need clear explanations before play, during actions and after results, including combat.

These are product requirements. Exact ability formulas and final combat scale remain design work. A development agent cannot satisfy them merely by displaying all five stats, recommending Epic cards or adding a long help page.

## 2. Equation rotation

The Turning Ravine becomes an equation-wheel mission. Existing current-turner and operator-wheel art supplies the mechanisms; numbers, operators, equation connections and targets are live overlays. Connectivity remains a battlefield consequence, rather than the only rotation puzzle.

### Checked teaching fixture

Four wheels: number A, number B, number C and operator O. Only the displayed face of each wheel is active. A single selected number is shared wherever that wheel appears.

| Wheel | Available faces |
|---|---|
| A | 2, 3, 4, 5, 6, 7 |
| B | 3, 4, 5, 6, 7, 8 |
| C | 1, 2, 3, 4, 5, 6 |
| O | +, −, ×, +, −, × |

Required equations:

```text
A O B = 24
B + C = 11
C − A = 1
```

The unique effective solution is A = 4, B = 6, C = 5 and O = ×. Repeated operator faces give more than one equivalent orientation; the validator accepts these. It must not claim a unique orientation when only the displayed value is unique.

This is a small teaching fixture. The full encounter uses a coupled network of six to nine wheels, with several shared values, permitted operator choices and selected outputs. Rotating one wheel should usually change two or more constraints. At harder tiers, sector wheels can expose different values on different labelled edges; the exact face-to-edge mapping must be defined in the packet.

### Puzzle and tactical decisions

The first equation powers the bridge, the second controls shelter and the third enables a root trap. The player plans freely, then commits a set of rotations with shown action/ability costs. The battlefield may need only a chosen pair of outputs; obtaining every equation is not automatically the best tactical plan. A complete solution can be retained in the planning view while the active battlefield configuration differs.

Distinguish **practice completion**, which solves all teaching equations, from **mission victory**, which satisfies the selected output conditions and tactical objective. This avoids claiming a unique full puzzle while requiring the player to run every output simultaneously.

Partial useful configurations may be committed. Invalid equations remain unpowered and show their actual result. A draft that breaks an already powered output shows the lost benefit before confirmation. Require a second confirmation only for a destructive state change, such as closing an occupied bridge; do not place a confirmation on every wheel click.

Tier progression:

1. Turn number wheels with fixed operators; demonstrate one shared value.
2. Turn numbers and an operator; solve several coupled equations.
3. Use shared sector values and a limited active-output budget.
4. Coordinate separated mechanisms while an enemy reverses a forecast wheel.
5. Hold a valid coupled configuration, stabilise it and exploit its combat window with three different heroes.

Primary uses whole numbers and exact division only when introduced. Every equation is fully parenthesised where evaluation order could be ambiguous. Display multiplication as × and division as ÷; negative results are not silently made positive. Wheel rotations never rotate a numeral upside down or turn 6 into 9 unless that is an explicitly authored puzzle rule.

### Generation and validation

Construct a solved wheel network, derive target equations and allowable faces, then scramble it. Enumerate legal orientation assignments or use a constraint solver. Count effective assignments separately from duplicate-face orientations. Reject trivial networks where each equation can be solved independently or one operator is the answer to every relationship.

Preserve valid alternative tactical configurations. Puzzle uniqueness is required only when the mission claims one full intended deduction solution. Validate committed costs, enemy rewinds, stabilisation and output changes in the tactical solver. Merely solving the equations is not a mission certificate.

## 3. Every stat counts for every hero

Every hero uses all five printed values. Primary discipline and role specialise its hand; they must not switch off the other four values. No hidden Expedition power statistic replaces the collection values.

| Stat | Universal useful application | Specialist application | Player-visible comparison |
|---|---|---|---|
| Arithmetic | Capacity for a common calibration, load or power-transfer action | Exact operations, batch effects and number-based attacks | “Transfer 6 power; the relay needs 7.” |
| Geometry | Strength/extent of common bracing, cover or displacement | Multi-wheel manipulation, shapes and remote interactions | “Brace strength 7; this joint needs 8.” |
| Logic | Strength of common locking, prediction or disruption resistance | Coupled rule control, protecting deductions and countering enemy conditions | “Lock strength 6; the crow's rewind is 7.” |
| Science | Common repair/stabilisation strength and survival contribution | Network maintenance, transformations and healing tools | “Repair 6 integrity; 8 is missing.” |
| Speed | Movement, initiative and a direct Dash/relay/interception capacity | Reaching exposed controls and reacting within a forecast window | “Dash reach 7; that control is 8 steps away.” |

These are required applications, not final formulas. Each needs one global cost, range, duration and cap in the final rules. Contextual common actions remain available to every hero, with strength from that hero's stat. Ability-hand cards improve or combine them. Do not add five permanent button rows to the HUD.

Not every action uses all five stats. Each mission must offer consequential uses for all five, and each hero must retain access to those uses. Two to four scenario pressure lanes describe the main challenge; they do not permit the other statistics to become dead values. Roles additionally change whom an effect helps, its positioning or its action efficiency.

Stat-by-stat acceptance:

- For each stat, hold identity, role and the other four stats fixed and compare legal outcomes at several values across the actual roster range.
- A one-point increase must increase a displayed capacity or strength somewhere useful, even if a particular enemy still takes the same number of hits. Rounded movement alone is insufficient for Speed.
- Record a real-card comparison showing a different useful plan, saved action, prevented disruption or met requirement. A higher number on a decorative badge does not pass.
- For each mission, identify the meaningful choice for all five stats and at least one viable plan in which each matters. Do not manufacture five unrelated locks merely to tick the list.
- Show the cost of support: adjacency, a committed action, a spent hand card or a held station. Cap bonuses so weak cards cannot acquire effectively unlimited strength.

## 4. Better cards are necessary at higher tiers

The previous criterion that weaker cards should have fewer plans is insufficient on its own. Stronger tiers require a higher feasible team capability. Do not gate the Embark button by rarity; let the player see and attempt the fixed demands. The actual requirements, not the border colour, determine viability.

### Concrete three-job Masterwork fixture

At a declared end-of-round snapshot, three different heroes must each hold one operating station. Remote/global support does not count. The distances prevent one hero servicing two stations in the same snapshot. Holding consumes the stated action and prevents that hero contributing support elsewhere.

| Job | Printed requirements | Real Epic example |
|---|---|---|
| Brace and reach the western turning station | Geometry 9 and Speed 8 | Gossamer: Geometry 9, Speed 8 |
| Calibrate and lock the central equations | Arithmetic 8 and Logic 9 | Ninebark: Arithmetic 8, Logic 9 |
| Stabilise the eastern power stream | Science 9 | Cascade: Science 9 |

All five stats are essential across the simultaneous plan. Three existing Epic cards meet the requirements. No Common or Rare base card meets any of these complete job profiles, so one Legendary carrying two low cards cannot complete this fixture. This is a checked static feasibility example; it still needs a board, action trace and combat certificate. It is not a demand to put these exact three gates in every mission.

Different families use different profiles and thresholds. Allow alternative complementary Epic parties where the roster permits them, including alternative routes with comparable capability demands. Do not require ownership of one named character. Adventure bonuses, commander effects and every permitted support source must be included when establishing necessity.

### Required certification evidence

For every family/tier, state the target capability band and a lower comparison band. Supply at least two winning target-band teams/plans. For harder tiers, demonstrate why the lower band cannot meet the fixed mandatory demands, not just why a scripted weaker playthrough loses.

For simple simultaneous checks, enumerate assignments of the actual roster to jobs, including allowed bonuses. For more flexible missions, search legal states or derive a valid resource/reach bound that rules out weaker teams. A search timeout means unknown, not impossible. Reject or revise an uncertified seed; do not award it a higher-tier label based only on enemy numbers.

Use monotonic fixed demands across tiers: additional interacting obligations, higher required capacities, reduced recovery or more costly exposure. Do not require better cards only because the puzzle answer is made inaccessible to weaker cards. The child can understand and solve the maths regardless of collection; the team must be strong enough to execute the battlefield plan.

## 5. Feedback before, during and after play

### Before embarking

Use a short illustrated sequence with board highlights:

1. **Goal:** “Open a crossing and ring the eastern bell by the end of round four.”
2. **How:** “Turn the wheels. A shared number changes every equation connected to it.”
3. **Threat:** “After this round, Crosswind turns the upper wheel one step clockwise.”
4. **Team:** “You have enough Geometry to brace the bridge. Your strongest Logic lock is 6; this tier's rewind strength is 7.”

Offer a small playable practice equation with no mission consequences. Explain only the current mission's rules; keep the rest in contextual help. Readiness names the missing job and available plan, rather than presenting an unexplained total strength or rarity recommendation.

### Selecting and previewing an action

Selection highlights the acting hero, target, range, relevant equation links and affected objects. The preview contains action cost, named stats, bonuses, expected change and the next relevant enemy response. It should fit in a compact sentence, with the arithmetic available by expanding it.

Example wheel preview:

> Turn B from 5 to 6. Bridge: 4 × 6 = 24, now powered. Shelter: 6 + 5 = 11, now powered. Root trap stays ready. Costs 1 action. Crosswind will turn B back unless it is stabilised.

If a target is unavailable, explain the actual reason and one feasible remedy: “Out of reach: 6 steps, Move reaches 5. Dash can reach it.” Do not suggest a spent or insufficient ability. Separate arithmetic validity from card capability: “The equation is correct. Kernel's brace is 7; this joint needs 8.”

### Combat previews and results

The engine emits structured factors and the UI renders them. Do not reconstruct a combat explanation from the health-bar animation or maintain separate preview arithmetic. Under the existing impact-scale contract, a correct proposed example is:

```text
Kernel's Geometry 7 + Cornix's adjacent support 1 = Power 8
Enemy Defence 8: 1 heart lost, from 2 to 1
```

With a shown +1 mark, power becomes 9 and still removes one heart. With the same power 8 against Defence 4, it removes two hearts because power is four above Defence. Explain this threshold when it matters. If power is below Defence, say “Blocked: Power 7 is below Defence 8. No hearts lost.” If the target has a shield, explain the shield condition before offering a strike that cannot affect it.

After confirmation, connect number to consequence: “Kernel dealt 1 heart. The Hookmole survives and will jam the bridge next.” On defeat: “Hookmole defeated. The turning station is no longer threatened.” When guarding prevents disruption: “Cornix held the joint; the bridge stays open.” A raw “Success” toast does not pass.

The chosen final combat scale must replace these examples consistently if the larger-health demonstration scale is adopted. Never mix the two scales.

### Enemy phase and progress

Before End Round, display a short ordered forecast with named targets and projected effects. After each enemy action, highlight its cause and outcome. If the player's action changes the forecast, update it immediately and flag what changed.

Show persistent objective progress and current valid outputs: “Bridge powered, shelter off, bell not reached.” At a round boundary, summarise the two or three material changes; retain the full log in a drawer. Permit reduced motion, pausing explanations and replaying the last enemy phase without changing game state. Use text and symbols alongside colour; no information should disappear solely because an animation ended.

### End of mission

Victory explains the team's contribution, completed tier and fixed star award. Replays explicitly show that the tier award was already earned. Failure explains the actual limiting event and a relevant next attempt: “The western joint failed at strength 7 against 8. A stronger Geometry hero or the marked support alcove can hold it.” Hints and losses must not shame the child or expose an opaque internal score.

## 6. Required development evidence

Each scenario packet needs player-facing briefing copy, a five-stat contribution map, a higher/lower team feasibility certificate, action preview examples, enemy forecast examples and success/failure explanation examples.

Acceptance includes UI-performed traces where a player can identify the objective, next threat, missing capability and reason for combat outcome without an adult translating. Preview and actual resolution must agree for every tested action. Observe whether children understand a shared equation change, a blocked hit and a stronger card's benefit. Reading a long rules document or passing a maths solver is not evidence that the feedback works.

No production rules, renderer or persistence changes are made by this requirements document.
