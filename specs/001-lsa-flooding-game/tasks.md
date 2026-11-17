# Tasks: PacketJedi OSPF LSA Flooding Game

**Input**: Design documents from `specs/001-lsa-flooding-game/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/game-ui.md`, `quickstart.md`

**Tests**: Included because the specification and plan require independently checked receiver-set fixtures and a browser validation runner.

**Organization**: Tasks are grouped by the three prioritized user stories. Build the first complete round before adding the remaining curriculum and score features.

## Phase 1: Setup

**Purpose**: Create the static application shell and dependency-free browser test runner.

- [x] T001 Create the semantic module entry shell and base styles in `index.html`, `styles.css`, and `main.js`.
- [x] T002 [P] Create the dependency-free browser test runner shell and failed-case output in `tests/index.html` and `tests/runner.js`.

## Phase 2: Foundational

**Purpose**: Implement shared authored-content validation before challenge-specific work begins.

- [x] T003 Implement incremental schema and topology validation in `engine/content.js`: enforce `Router.id`, `Router.role`, `Router.areaIds`, and `Router.externalPeerId`; `Area.id`, `Area.kind`, and `Area.routerIds`; `Adjacency.routerA`, `Adjacency.routerB`, `Adjacency.areaId`, and `Adjacency.kind`; `TransitNetwork.id`, `TransitNetwork.areaId`, `TransitNetwork.drRouterId`, and `TransitNetwork.attachedRouterIds`; `Level.id`, `Level.order`, `Level.title`, `Level.briefing`, `Level.areaOverrides`, and `Level.challengeIds`; `Challenge.id`, `Challenge.levelId`, `Challenge.lsaType`, `Challenge.character`, `Challenge.originRouterId`, `Challenge.linkStateId`, `Challenge.originAreaId`, `Challenge.floodingAreaId`, `Challenge.scope`, `Challenge.subject`, `Challenge.transitNetworkId`, `Challenge.hint`, `Challenge.misconceptionsByReasonCode`, `Challenge.sourceIds`, and `Challenge.reviewedReceiverIds`; and `Source.id`, `Source.document`, `Source.section`, and `Source.claim`, using the canonical definitions in `data-model.md` for each entity field. Validate each present challenge without requiring the final three-level/five-round count until T017.

**Checkpoint**: The shared validator can reject malformed IDs, area membership, source records, and challenge fields before any challenge is graded.

## Phase 3: User Story 1 - Predict LSA Flooding Scope (Priority: P1)

**Goal**: Deliver a complete Type 1 round with a deterministic evaluator, correct/wrong feedback, retry, and advance; prove the Type 5 stub boundary in the rule tests.

**Independent Test**: Start a fresh run at the Type 1 briefing; submit the exact `{J1b, ABR-A1}` set and then a set that also selects J0. Verify exact-set grading, RFC-cited feedback, unchanged completion after the wrong set, and retry. The domain test runner's first three cases remain Type 1 correct, Type 1 plausible wrong, and Type 5 stub boundary.

### Tests for User Story 1

- [x] T004 [US1] Add independent receiver fixtures and browser assertions in `tests/fixtures.js` and `tests/rules.test.js`, ordered first as Type 1 correct `{J1b, ABR-A1}`, Type 1 wrong with extra J0, and Type 5 stub boundary `{J0, ABR-A1, ABR-A2, J2, J2b}`; then cover empty input and malformed content. Assert RFC-cited reason evidence and exact-set behavior.

### Implementation for User Story 1

- [x] T005 [US1] Implement the pure Type 1 and Type 5 receiver evaluator in `engine/rules.js`, returning the canonical `Evaluation.status`, `Evaluation.expectedReceiverIds`, `Evaluation.selectedRouterIds`, `Evaluation.extraRouterIds`, `Evaluation.missingRouterIds`, `Evaluation.reasonCodes`, and `Evaluation.evidence.lsaType`, `Evaluation.evidence.origin`, `Evaluation.evidence.floodingScope`, `Evaluation.evidence.selectedAreas`, `Evaluation.evidence.excludedAreas`, `Evaluation.evidence.rule`, and `Evaluation.evidence.sourceIds` defined in `data-model.md`.
- [x] T006 [US1] Author the shared fictional topology and first Type 1 challenge in `data/levels.json`, including the source records and reviewed receiver fixture; follow `data-model.md` fields `Router.id`, `Router.role`, `Router.areaIds`, `Area.id`, `Area.kind`, `Area.routerIds`, `Adjacency.routerA`, `Adjacency.routerB`, `Adjacency.areaId`, `Adjacency.kind`, `Level.id`, `Level.order`, `Level.title`, `Level.briefing`, `Level.areaOverrides`, `Level.challengeIds`, `Challenge.id`, `Challenge.levelId`, `Challenge.lsaType`, `Challenge.character`, `Challenge.originRouterId`, `Challenge.linkStateId`, `Challenge.originAreaId`, `Challenge.floodingAreaId`, `Challenge.scope`, `Challenge.subject`, `Challenge.hint`, `Challenge.misconceptionsByReasonCode`, `Challenge.sourceIds`, `Challenge.reviewedReceiverIds`, and `Source.id`, `Source.document`, `Source.section`, `Source.claim`.
- [x] T007 [US1] Implement rule-reason feedback and RFC section rendering in `engine/feedback.js`, using computed missing/extra router IDs and authored misconception messages without allowing content text to change the evaluator result.
- [x] T008 [US1] Implement initial run state, attempts, retry, solved-round guard, and explicit Next transition in `engine/state.js`, following `RunState.currentLevelId`, `RunState.currentChallengeId`, `RunState.selectedRouterIds`, `RunState.firstSelectedRouterIds`, `RunState.correctUniqueSelections`, `RunState.wrongUniqueSelections`, `RunState.validAttemptsByChallenge`, `RunState.firstValidSubmissionByChallenge`, `RunState.hintedChallengeIds`, `RunState.solvedChallengeIds`, `RunState.score`, `RunState.streak`, and `RunState.view` in `data-model.md`.
- [x] T009 [US1] Render the Type 1 briefing, holomap, router choices, explanation, hint, and Next control in `ui/render.js` according to `contracts/game-ui.md`.
- [x] T010 [US1] Wire native router buttons, empty-submit guidance, answer submission, retry, hint, and Next events in `ui/controls.js` according to `contracts/game-ui.md`.
- [x] T011 [US1] Load challenge data, validate it before showing the first round, handle content/load errors, and start the Type 1 loop in `main.js` using relative paths.

**Checkpoint**: User Story 1 can be played independently; the first three domain fixtures pass in the required order and the Type 1 wrong path explains why J0 is outside Area 1 scope.

## Phase 4: User Story 2 - Complete the Levels and Track a Run (Priority: P1)

**Goal**: Add all five LSA challenges across three levels, scoring, ranks, session summary, and a best-effort browser-local top-five leaderboard.

**Independent Test**: Complete all five rounds with one imperfect first submission and one perfect first submission. Verify level order, all receiver sets, click points, bonus/streak multiplier, negative scores and rank, final summary, leaderboard order/ties/reload, and storage-failure fallback.

### Tests for User Story 2

- [x] T012 [US2] Add independent Type 2, Type 3, and Type 4 receiver fixtures and assertions in `tests/fixtures.js` and `tests/levels.test.js`; append cases after the first three without reordering them.
- [x] T013 [P] [US2] Add valid-attempt, first-submission, progression, hint-assistance, restart, duplicate-submit, and negative-score rank assertions in `tests/state.test.js` and `tests/scoring.test.js`.
- [x] T014 [P] [US2] Add top-five sorting, insertion-order ties, malformed-storage, thrown read/write, reload, and no-storage-failure gameplay assertions in `tests/leaderboard.test.js`.

### Implementation for User Story 2

- [x] T015 [US2] Complete all three levels and five authored challenges in `data/levels.json`, including the Type 2 transit LAN, Type 3 network summary into Area 0, Type 4 ASBR summary into Area 0, Type 5 stub-area state, hints, misconception messages, RFC sources, and reviewed receiver sets; follow the constrained `Level.*`, `Challenge.*`, and `Source.*` fields in `data-model.md`.
- [x] T016 [US2] Extend `engine/rules.js` for Type 2 area-wide receipt versus its DR-attached list and the area-specific Type 3/4 instances; maintain pure exact-set evaluation and the Type 4 stub-area restriction.
- [x] T017 [US2] Enforce complete release validation in `engine/content.js`: exactly three ordered levels and five required LSA types, consistent role/area/scope data, source claims, and `Challenge.reviewedReceiverIds` equal to the computed evaluator set without using the metadata as grading authority.
- [x] T018 [P] [US2] Implement unique-router click points, perfect first-submission bonus, updated-streak multiplier, nearest-integer half-away-from-zero rounding, negative scores, and ranks in `engine/scoring.js`.
- [x] T019 [P] [US2] Implement versioned `localStorage` persistence, try/catch fallback, parsed-entry validation, top-five trimming, descending score order, and tie stability in `engine/leaderboard.js`, following `LeaderboardEntry.sequence`, `LeaderboardEntry.score`, `LeaderboardEntry.rank`, and `LeaderboardEntry.completedAt` in `data-model.md`.
- [x] T020 [US2] Extend `engine/state.js` to count each non-empty submission once, apply the first-valid-submission perfect/streak rule, commit each solved round once, advance across levels, preserve negative cumulative score, create the completed-run summary, and retain saved scores on restart.
- [x] T021 [US2] Integrate all challenge/level views, feedback, progress, provisional and committed score, rank, leaderboard status, final summary, and confirmed/cancelled Restart in `ui/render.js`, `ui/controls.js`, and `main.js`.

**Checkpoint**: All five LSA fixtures agree with reviewed RFC expectations; score/rank never changes accepted receiver sets; local leaderboard failure never blocks play.

## Phase 5: User Story 3 - Play with Accessible Controls (Priority: P1)

**Goal**: Complete keyboard, assistive-technology, text-topology, responsive, and reduced-motion behavior for the full game.

**Independent Test**: Complete a fresh five-round run with keyboard only; confirm selected state and result/status announcements, read the text topology, then repeat at narrow width with reduced motion enabled.

### Implementation for User Story 3

- [x] T022 [P] [US3] Add accessible names and `aria-pressed` state to router choices, a polite status region for results/errors, and predictable focus behavior after feedback/Next/Restart in `ui/render.js` and `ui/controls.js` according to `contracts/game-ui.md`.
- [x] T023 [P] [US3] Add a complete text topology equivalent, visible focus treatment, narrow-viewport layout, and reduced-motion behavior in `index.html` and `styles.css` according to `contracts/game-ui.md`.
- [ ] T024 [US3] Perform the keyboard-only, status-announcement, text-topology, narrow-viewport, and reduced-motion checks; record pass/fail/not-run and evidence in `README.md`.

**Checkpoint**: A learner can complete all core actions without a mouse, color-only cues, animation, or visual-only topology information.

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify the ready-to-demo scope and package honest run/evidence instructions.

- [x] T025 Update `README.md` with learning outcomes, controls, fictional-topology scope, leaderboard behavior, preview/test commands, RFC credits, and known limits.
- [ ] T026 Run the browser suite at `tests/index.html`; record date, browser/environment, pass/fail, failed case IDs, and unrun checks in `README.md`.
- [ ] T027 Verify relative module/data/style paths under the root preview and a repository subpath; update affected paths in `main.js`, `index.html`, or `README.md` if a request escapes the subpath.
- [x] T028 Review all five explanations and fixtures against `references/rfc2328.txt` and `references/rfc3101.txt`; record the final ready-to-demo checklist status in `README.md` without marking unrun evidence as passed.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 and T002 can begin immediately; they touch separate files.
- **Foundational (Phase 2)**: T003 depends on the project paths from Setup and blocks challenge content from being graded.
- **User Story 1 (Phase 3)**: Depends on the validator. It creates the first complete Type 1 learning loop and proves the three required initial domain fixtures.
- **User Story 2 (Phase 4)**: Depends on the evaluator and game loop from US1; adds the other LSA content, scoring, progression, and storage.
- **User Story 3 (Phase 5)**: Depends on the complete UI from US1/US2 so the accessibility playthrough covers the full game.
- **Polish (Phase 6)**: Depends on all three stories.

### User Story Dependencies

- **US1 (P1)**: Starts after the shared content validator. This is the MVP: one complete Type 1 round plus the rule tests' Type 5 boundary.
- **US2 (P1)**: Follows US1 because it extends the same authored content, evaluator, run state, and screens.
- **US3 (P1)**: Follows the complete interaction flow; native buttons and visible focus are still required in the MVP shell.

### Dependency Graph

```text
Setup
  ├── T001 ──┐
  └── T002 ──┴── T003
                   │
                   └── US1: T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011
                                                              │
                                                              └── US2: T012 → {T013, T014} → T015 → T016 → {T018, T019} → T020 → T021
                                                                                                              │
                                                                                                              └── US3: {T022, T023} → T024
                                                                                                                                       │
                                                                                                                                       └── Polish: T025 → T026 → T027 → T028
```

### Parallel Opportunities

- T001 and T002 can be created in parallel because the app shell and test-runner shell are separate files.
- In US2, T013 and T014 can be developed in parallel after T012; they own distinct test files. T018 and T019 can be developed in parallel after their tests exist; they own separate scoring and storage modules.
- In US3, T022 and T023 can be developed in parallel because they modify UI behavior files and layout/page files respectively.
- US1, US2, and US3 are not parallel phases: they share the evaluator, game state, and UI, so implement in dependency order.

### Parallel Example: User Story 2

```text
After T012 has added the complete challenge data:
- T013: tests/levels.test.js for Type 2/3/4 scope fixtures
- T014: tests/state.test.js and tests/scoring.test.js for attempts, streak, rank, negative score

After T013 and T014 specify expected behavior:
- T018: engine/scoring.js
- T019: engine/leaderboard.js
```

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Setup and the shared content validator.
2. Add the correct Type 1, plausible-wrong Type 1, and Type 5 stub-boundary fixtures in that order.
3. Implement the pure evaluator, then a complete Type 1 briefing → selection → explanation/retry → advance loop.
4. Stop and verify US1 independently before adding Levels 2–3 or scoring/persistence.

### Incremental Delivery

1. Setup + shared validation.
2. US1: prove the rule and deliver one full round.
3. US2: add Types 2–5 to the game, complete all three levels, then scoring/ranks/leaderboard.
4. US3: complete full-game keyboard and assistive-technology behavior and record manual evidence.
5. Polish: verify root/subpath preview, all checks, and README status.

## Notes

- Every task uses the required checkbox, sequential task ID, applicable `[P]`/`[US#]` labels, and exact file paths.
- Test fixtures are independent of the evaluator. The first three domain cases remain Type 1 correct, Type 1 plausible wrong, and Type 5 stub boundary.
- The score may be negative; any value below 100 maps to Youngling. Do not clamp it to zero.
- `localStorage` and `try/catch` remain required despite the generic checklist's API-detail warning; no alternative persistence service is in scope.
- The $speckit-plan gate passed for all seven constitution principles; see `plan.md` for evidence.
