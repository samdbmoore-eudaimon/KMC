# C-03/C-08B: full displaced Four Locks offline blueprints

Owner: Codex, coordination1.2. Four-candidate bounded assembly/certification batch complete and stopped. Overall generator/bank tasks remain IN_PROGRESS.

Changed files: new `expeditions/v2/generation/displaced-four-locks.js`, `displaced-four-locks.test.js`, `scripts/dev/certify-displaced-four-locks.mjs`, `docs/expeditions/v2/certification/four-locks/displaced-v1/`, this report and existing C-03/C-08B reports. Defaults, existing version1 candidates/certificates/hashes, runtime entries, Claude's engine/App/planner and shared build outputs were not edited. No other-family packet or paid service.

`assembleDisplacedFourLocks(topology)` consumes the saved explicit T1 `passage-displacement-v1` packet. It rechecks measured geometry, each cut, declared displacement parameters, preserved baseline barriers, canonical topology, footprint/closed eligibility and then entity placement and production schema. Invalid packets fail rather than clearing barriers. The actual Jammer start is a seeded eligible north-entry/jitter neighbour with no deployment/station/footprint overlap, required distances and a closed-state path to control. Outputs, control/station/alcove anchors, all physical passage sites, environmental hazard and puzzle protection groups use those actual moved coordinates. T1 retains the exact4-charge capacities, integrity rules, deadline5, output costs2/3/4/5, budget7, Jammer wake phase2 and Sustain environmental hazard.

`generateDisplacedFourLocksCandidate(parameters)` separately reconstructs the packet. Optional expected `deltas` and `sourceTopologyHash` reject mismatches. The full blueprint uses **generatorVersion2**, not default version1, with `constructionPacket:{id:'four-locks-displaced-v1',version:1,topologyPacketId,parameters,sourceTopologyHash}`. Parameters record tier, seed, archetype,256-attempt cap, reservations and actual deltas. Full canonical topology/puzzle fingerprints live on the candidate alongside complete blueprint content; the certificate binds the entire versioned blueprint hash. This is an offline development packet, not a silently changed default generator or runtime entry. Current runtime explicitly rejects generatorVersion2.

## Four saved topology inputs, eight bounded planner calls

Consumed exactly seed0 from each already sampled archetype. No new seed search. At most two calls per candidate, each requesting8000 states. Direct Common squad Tuppence/Wicker/Pip avoids bridge+shelter. Alcove Common squad Bushel/Dapple/Pip avoids the successful direct output pair. All eight calls succeed; no bounded unknown in this batch. All retain the known R-07 accounting warning although none reports a cap overage. Planner remains read-only.

| Archetype | Offline certificate | Reported states direct/alcove | Win rounds direct/alcove | Outputs direct/alcove |
| --- | --- | --- | --- | --- |
| river | `orchard-v2-17b09eb354d2a122` | 973 / 1382 | 4 / 4 | bridge+roots / bridge+storm |
| islands | `orchard-v2-91f754b4a76a9a59` | 749 / 216 | 5 / 4 | bridge+roots / bridge+shelter |
| hedges | `orchard-v2-a76ac63b62658806` | 1074 / 2015 | 4 / 5 | bridge+roots / bridge+storm |
| terraces | `orchard-v2-3506d26e75f76e17` | 226 / 220 | 4 / 4 | bridge+roots / bridge+shelter |

Both distinct actual target-band teams and different output plans are accepted for each candidate. Each second trace wins from the real prepared alcove: Dapple's Hold IDs are respectively `dapple@r4#40`, `dapple@r4#36`, `dapple@r5#48`, `dapple@r4#35`. These are winning-phase endpoints, not historical preparation/hold events. All eight traces total231 accepted commands with per-command hashes, initial production profiles and terminal hashes. Tier1 lower-band rules remain exactly as before; no invented stats or altered costs/pressure.

Immutable evidence directory per archetype:

```text
docs/expeditions/v2/certification/four-locks/displaced-v1/tier-1-river-seed-0/{candidate,traces,result}.json
docs/expeditions/v2/certification/four-locks/displaced-v1/tier-1-islands-seed-0/{candidate,traces,result}.json
docs/expeditions/v2/certification/four-locks/displaced-v1/tier-1-hedges-seed-0/{candidate,traces,result}.json
docs/expeditions/v2/certification/four-locks/displaced-v1/tier-1-terraces-seed-0/{candidate,traces,result}.json
docs/expeditions/v2/certification/four-locks/displaced-v1/summary.json
```

Results store source-topology hash, candidate hash, packet/version identity, requested limits, avoided pairs, reported metrics/overage and complete independently replayed certificate checks. The driver refuses to overwrite this stopped batch. Its nested packet directory is deliberately outside the old default-candidate audit's immediate evidence scan: no new version2 certificate is credited to the existing version1 runtime bank/audit.

Executable checks:

```text
node scripts/dev/certify-displaced-four-locks.mjs
node --test --test-reporter=dot expeditions/v2/generation/displaced-four-locks.test.js expeditions/v2/generation/displaced-topology.test.js expeditions/v2/generation/runtime-generation.test.js scripts/dev/test-orchard-v2-certification.mjs
```

Outcome:23/23 targeted checks pass. Full reconstruction from the recorded parameters/source hash matches each saved candidate exactly. Tests verify production schema and unchanged pressure, reject source barriers/anchors/footprint/deltas and reconstruction hash tampering, independently replay all eight certificate traces and compare every saved command with actual preview/reducer results. Illegal movement into water/hedges rejects with unchanged state. Preview does not mutate input. Old reconstruction hashes, accepted default certificates and certified T1 runtime routes still pass. An initial test compared an in-memory optional undefined certificate field with its JSON-omitted form; normalized to the persisted JSON representation and additionally checked the exact bound blueprint hash. This was serialization handling, not a replay or certificate failure.

Ready dependency: four full displaced offline blueprints and genuine production-reducer certificates can be reviewed as the explicit new packet. Not accepted: runtime/version migration, populated/diversified banks, private App/QA-01, device/child testing or other-family expansion. The strict native-adjacent mathematical comparison remains stopped with zero accepts. No new screenshot/shared rebuild or deployment. Runtime remains only the existing version1 river T1 reference. C-03/C-08B locks released after this handoff.
