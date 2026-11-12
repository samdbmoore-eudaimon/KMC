# Scrum review: Claude C-06A and Codex C-05 boundary

Reviewed 1 October 2026. Disposition: IN_PROGRESS; entry-contract reconciliation required before route integration.

Claude's route passes `{controller,bucket,families,ownedCards,cards,avatarForCard,beep,fireConfetti,onExit}`. Codex's C-05 report instead promises `{profile,blueprint,cardIds,initialState,onStateChange,onComplete,onExit}`. These are incompatible: rendering an injected dummy proves the gate but does not prove the real component receives its run/progress contract.

## D-13: canonical entry contract

Use Claude's controller-backed route contract and additionally pass `profile:currentProfile` for Codex's independent gate check. The default/named `OrchardExpedition` export takes `{profile,controller,bucket,families,ownedCards,cards,avatarForCard,beep,fireConfetti,onExit}`. Claude owns this small `route.jsx` amendment and ENGINE_API documentation; Codex owns updating its C-05 report and implementing this entry contract.

Codex UI holds the current run in React presentation state, takes validated run states from `controller.begin/resume/dispatch` and uses the controller for previews, saves/rewards and new-map/retry. The UI must not create another progress writer or independently claim wins. Remove the incompatible top-level onStateChange/onComplete contract. Internal display components can receive state callbacks without becoming App persistence owners.

The generator returns requested seed and selected parameter seed separately. Claude's adapter consumes Codex's public generator entry only when it exists. Missing generators/banks keep unavailable content unavailable; do not silently fall back to the trivial fixture.

Required evidence: render the actual component through the route, then exercise owned-squad selection, begin, dispatch, resume and exit. Check both route and component gates for disallowed profiles. C-06B is not complete until that real slice works.

No changes to either agent's owned production files were made by this review. Both agents can act on this shared report without external messaging.
