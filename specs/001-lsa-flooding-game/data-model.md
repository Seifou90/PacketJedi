# Data Model: PacketJedi

This model describes authored challenge inputs, computed domain results, the active run, and the local leaderboard. The pure evaluator owns receiver correctness; test fixtures independently verify its output.

## Authored Content

### Topology

| Entity | Fields | Validation |
|---|---|---|
| `Router` | `id`, `role` (`router`, `abr`, `asbr`, or `external-bgp`), `areaIds`, optional `externalPeerId` | Unique ID; known areas; ABR has at least two OSPF area memberships; ASBR is in regular Area 2; BGP-X is external and has no OSPF area membership. |
| `Area` | `id`, `kind` (`regular` or `stub`), `routerIds` | IDs are 0, 1, or 2; member list agrees with router memberships; Level 3 marks Area 1 stub while Areas 0 and 2 remain regular. |
| `Adjacency` | `routerA`, `routerB`, `areaId`, `kind` (`point-to-point` or named transit network) | Both endpoints are OSPF routers attached to that area; adjacency graph is connected within each modeled area. |
| `TransitNetwork` | `id`, `areaId`, `drRouterId`, `attachedRouterIds` | DR and all attached routers belong to the area; at least two OSPF routers are attached for the Type 2 fixture; DR is the Type 2 origin. |

Canonical fictional OSPF routers are J0, ABR-A1, ABR-A2, J1, J1b, J2, J2b, and ASBR-A2. BGP-X is an external peer, never an OSPF participant or answer choice.

### Level and Challenge

| Entity | Fields | Validation |
|---|---|---|
| `Level` | `id`, `order`, `title`, `briefing`, `areaOverrides`, `challengeIds` | Exactly three ordered levels; Level 1 teaches Types 1–2; Level 2 Types 3–4; Level 3 Type 5 and makes Area 1 stub. |
| `Challenge` | `id`, `levelId`, `lsaType`, `character`, `originRouterId` (also Advertising Router), `linkStateId`, `originAreaId`, `floodingAreaId` (Types 1–4), `scope` (`area` or `as`), typed `subject`, optional `transitNetworkId`, `hint`, `misconceptionsByReasonCode`, `sourceIds`, `reviewedReceiverIds` | Unique challenge and LSA identity; supported LSA 1–5; origin/area/role matches type; Type 2 has declared DR and transit network; Types 3/4 name one destination/flooding area and ABR; Type 4 identifies an ASBR and is not flooded into a stub area; Type 5 uses AS scope and an ASBR; source IDs and explanations exist. `reviewedReceiverIds` is validation/test metadata only and must equal the computed set; it never grades a live answer. |
| `Source` | `id`, `document`, `section`, `claim` | Must reference the local RFC 2328 or RFC 3101 text and a section supporting the stated claim. |

The required five challenge inputs and independently reviewed receiver sets are listed in [spec.md](./spec.md#required-challenge-fixtures). Their counts are: Type 1 `{J1b, ABR-A1}`; Type 2 `{J2b, ABR-A2, ASBR-A2}`; Type 3 `{J0, ABR-A2}`; Type 4 `{J0, ABR-A1}`; Type 5 `{J0, ABR-A1, ABR-A2, J2, J2b}`. In every case, the originator (the LSA's Advertising Router) is excluded as a game convention.

The `subject` varies by LSA type: Type 1 describes its originating router's area links; Type 2 names the transit network and attached routers; Type 3 names the summarized fictional network and its source area; Type 4 names the reachable ASBR; Type 5 names a fictional external destination. Type 3/4 each describe a single flooding-area instance, not one LSA copied through multiple areas.

## Domain Evaluation

`evaluate(challenge, topology, selectedRouterIds)` returns:

```text
Evaluation {
  status: correct | incorrect | invalid-input | content-error
  expectedReceiverIds: sorted unique RouterId[] | null
  selectedRouterIds: sorted unique RouterId[]
  extraRouterIds: RouterId[]
  missingRouterIds: RouterId[]
  reasonCodes: ReasonCode[]
  evidence: { lsaType, origin, floodingScope, selectedAreas, excludedAreas, rule, sourceIds }
}
```

The function has no UI, state, scoring, clock, randomness, storage, or network effects. It derives expected receivers from area membership, stub state, LSA type, and Type 2 DR/network constraints. Selected IDs must all be known, selectable OSPF routers. A set is correct only if its normalized values exactly equal the computed receiver set. Empty selection is classified as invalid input before attempt counting.

### Rule Summary

- Type 1: every other OSPF router in the single flooded area.
- Type 2: every other OSPF router in the single flooded area; validate the DR-attached network member list separately.
- Types 3/4: every other OSPF router in the one destination area of that LSA instance; Type 4 cannot target a stub area.
- Type 5: every other OSPF router with at least one eligible non-stub area attachment; an ABR attached to a stub and regular area receives via the regular area, but does not flood into the stub area.
- BGP-X is excluded because it is not an OSPF router. RFC 3101 Type 7/NSSA scope and translation are outside the game.

## Run State

```text
RunState {
  currentLevelId
  currentChallengeId
  selectedRouterIds: Set<RouterId>
  firstSelectedRouterIds: Set<RouterId>
  correctUniqueSelections: Set<RouterId>
  wrongUniqueSelections: Set<RouterId>
  validAttemptsByChallenge: Map<ChallengeId, integer>
  firstValidSubmissionByChallenge: Map<ChallengeId, exact | non-exact>
  hintedChallengeIds: Set<ChallengeId>
  solvedChallengeIds: Set<ChallengeId>
  score: integer
  streak: integer
  view: loading | briefing | challenge | feedback | summary | content-error
}
```

- Empty submissions do not count as attempts or determine whether a round was perfect.
- Each non-empty submission before solve increments valid attempts. The first determines perfect status; a non-exact first submission resets streak and receives no perfect bonus.
- The first selection of each distinct router ID in a challenge contributes +10 if expected and −5 otherwise. Deselecting/reselecting does not rescore it.
- On solve, if the first non-empty submission was exact, add +20 and increment streak before applying the multiplier. Otherwise keep streak at zero. Calculate and commit one round award; negative awards and cumulative scores are allowed.
- A solved challenge cannot award score again. Next advances only after a correct submission. Restart creates a fresh RunState but keeps leaderboard data.

## Rank and Leaderboard

`rankForScore(score)` returns Youngling for `score < 100`, Padawan for 100–199, Knight for 200–299, and Master for 300 or higher. Ranks do not gate content.

```text
LeaderboardEntry {
  sequence: integer
  score: integer
  rank: Youngling | Padawan | Knight | Master
  completedAt: ISO-8601 timestamp
}
```

Maintain at most five completed-run entries. Sort by descending score; for ties preserve ascending insertion sequence. Storage key is versioned (for example `packetjedi.leaderboard.v1`). Validate parsed entry shape before display. Any storage access, parse, validation, quota, or write failure yields a nonpersistent in-memory board and a status message; it never blocks a run.

## State Transitions

```text
loading → briefing → challenge
challenge + empty submit → challenge + guidance
challenge + non-exact submit → feedback → challenge (retry)
challenge + exact submit → feedback → next challenge / next level / summary
loading + invalid content → content-error
run + confirmed restart → fresh briefing
```
