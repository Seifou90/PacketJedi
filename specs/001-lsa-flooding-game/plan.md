# Implementation Plan: PacketJedi OSPF LSA Flooding Game

**Branch**: `main` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Feature directory**: `specs/001-lsa-flooding-game`

## Summary

Build a static, keyboard-accessible browser game with one mechanic: select the routers that receive an OSPF LSA. Five challenges cover Types 1–5 across three levels. A pure rule evaluator computes receiver sets from the fixed fictional topology and LSA fields. Independent, hand-checked fixtures verify those results. Scoring, ranks, and the local top-five leaderboard use evaluator results but cannot affect grading.

The first implementation slice completes the Type 1 J1 round from briefing through retry, explanation, and advance. The remaining four rounds reuse the same screen and evaluator contract.

## Technical Context

**Language/Version**: Native JavaScript ES modules, semantic HTML, and CSS; no framework or build step.

**Primary Dependencies**: None at runtime. Browser support required for ES modules, Fetch, SVG, and Web Storage.

**Storage**: In-memory state for the active run. `localStorage` stores only the top five completed-run scores; access and serialization/parsing are wrapped in `try/catch`. A failure leaves the game playable and displays a status message.

**Testing**: Dependency-free browser test runner at `tests/index.html`. It imports pure domain/state/scoring modules, reports totals and failed case IDs, and treats zero discovered cases as failure. Manual browser checks cover keyboard use, focus, announcements, reduced motion, narrow viewports, fresh reloads, and repository-subpath paths.

**Target Platform**: Current evergreen desktop browsers; static hosting, including a repository subpath. Preview locally with Python's standard HTTP server.

**Project Type**: Static browser application.

**Performance Goals**: No decision timer. Feedback and selection state update in the same user interaction; no network request is needed to grade or advance a challenge. A first playthrough targets 5–10 minutes.

**Constraints**: One selection mechanic, three levels, five required rounds, eight fictional OSPF routers plus external BGP-X, local-only top-five leaderboard, RFC 2328 rules, and RFC 3101 Type 7/NSSA behavior excluded. Relative paths are required. No account, backend, runtime model, CDN, live network, or remote answer service.

**Scale/Scope**: One learner and one active run per page; five authored challenges; at most five persisted leaderboard entries.

## Constitution Check

| Gate | Status | Plan evidence |
|---|---|---|
| C1 · Technical truth | PASS | Receiver sets are computed from RFC-based rules and explicit topology; correct/wrong/boundary fixtures are independently checked. Type 1–4 are area-scoped instances; Type 5 uses eligible non-stub interfaces. |
| C2 · Teaching decision | PASS | One router-set selection mechanic, required briefing, specific wrong-choice feedback, and RFC section citations. |
| C3 · Honest progress and scoring | PASS | Exact set equality alone completes a round. Score state is separate. Empty selections do not count; solved rounds cannot score twice. The clarified negative-score rank rule is preserved. |
| C4 · Accessibility | PASS | Native buttons for router choices, text topology, visible focus, announced result/status, reduced-motion behavior, and narrow-layout checks. |
| C5 · Deterministic and self-contained | PASS | Authored JSON, local deterministic evaluation, no backend or runtime service, relative asset/data URLs. |
| C6 · Reviewable content and logic | PASS | Validated challenge data is separate from rendering and scoring. Hand-checked fixture expectations cannot override the evaluator. |
| C7 · Demonstrated completion | PASS | Browser runner, manual checks, working preview command, and recorded verification status are part of the release work. |

**Explicit conflict resolution**: the quality checklist has two unchecked generic items about implementation details because `localStorage` and guarded storage access are explicit requirements in the StarterKit and constitution. This plan retains those requirements; it does not broaden the implementation stack. The active Git branch is `main`; `001-lsa-flooding-game` is the feature-directory identifier returned when the Spec Kit branch variable is unset.

**Gate result**: PASS. No requested feature conflicts with the constitution. Scoring detail clarified in the spec (unique first selection, first non-empty submitted set determines perfect streak, negative scores allowed) is preserved as written.

## Phase 0: Research Decisions

See [research.md](./research.md) for decisions, alternatives, and source references.

- Use native browser modules and relative data/assets, served over HTTP.
- Keep the holomap visual in SVG and router choices as native HTML buttons.
- Use validated JSON challenge data and pure deterministic evaluator logic.
- Keep leaderboard persistence best-effort and local; test storage failures through a throwing adapter.
- No unresolved technology or protocol questions remain. The local RFCs are the protocol source of truth.

## Phase 1: Design

- [Data model](./data-model.md) specifies topology, areas, challenges, run state, score, and leaderboard entries.
- [Game UI contract](./contracts/game-ui.md) defines player-visible states and accessibility behavior. There is no backend or external service contract.
- [Quickstart](./quickstart.md) gives preview, browser-test, fixture, and manual verification steps.

### Domain Evaluation Contract

`evaluate(challenge, topology, selectedRouterIds)` is a pure function returning status (`correct`, `incorrect`, `invalid-input`, or `content-error`), computed expected receiver IDs, normalized selected IDs, a stable reason code, and rule evidence. It has no DOM, progress, scoring, storage, random, or network side effects.

- Type 1/2 receiver candidates are all OSPF routers in the specific flooded area except the originator. For Type 2, the declared DR/LAN membership is validated and describes the LSA's attached-router list; it does not restrict the area-wide receiver set.
- Type 3/4 are separate area-scoped LSA instances. Their origin must be an ABR attached to the declared flooding area. Type 4 identifies an ASBR and cannot target a stub area.
- Type 5 receiver candidates are OSPF routers with at least one eligible non-stub area attachment, excluding the originator. Thus ABR-A1 receives through Area 0 but does not flood Type 5 into stub Area 1. BGP-X is not an OSPF router.
- A selected set is correct only when exact set equality holds. An invalid selection or malformed content is not a wrong answer.
- Runtime grading uses this calculation, not a content answer key. `expectedReceiverIds` may appear in validation metadata and test fixtures only; a mismatch between metadata and computed rules blocks the challenge instead of overriding evaluation.

### Scoring and State Contract

Each distinct router ID selected during a round scores once: +10 if the evaluator's expected set contains it, otherwise −5. Toggling it later does not change its provisional click points. Empty submit is guidance only. Each non-empty submission before solve counts as one valid attempt. The first such submission determines whether the round is perfect. An exact first submission adds +20 and increments the streak before calculating that round's multiplier. A non-exact first submission resets the streak and earns no bonus even if a retry later solves the round.

For a solved round, calculate `roundPoints = correctUniqueSelections × 10 − wrongUniqueSelections × 5 + perfectBonus`; then calculate `roundAward = round(roundPoints × (1 + 0.1 × min(updatedStreak, 4)))`. Use nearest-integer rounding with exact half values away from zero. Add the award to cumulative score without flooring at zero. Any cumulative score below 100 is Youngling; 100–199 Padawan; 200–299 Knight; 300+ Master. Commit a round award only once, when the round is solved. Scoring, streak, and rank never affect exact-set correctness or progression.

At final completion, insert one entry for the run into the browser-local leaderboard, sort by score descending, keep the first five, and preserve entry order for ties. Persist a versioned serialized list in `localStorage`. Catch access, parsing, validation, quota, and write errors; keep the game and in-memory summary available with a storage status message.

### Implementation Order

| Slice | Deliverable | Evidence before the next slice |
|---|---|---|
| 1 · Prove the rule | Pure evaluator, challenge validation, and first three independent fixtures in required order: Type 1 correct, Type 1 plausible wrong, Type 5 stub boundary | Expected sets checked against local RFC text; evaluator exact-set outcomes match all three |
| 2 · Complete one round | Type 1 briefing, holomap, selection, feedback, retry, and Next | Browser playthrough of correct and incorrect paths; explanation cites RFC sections |
| 3 · Add all levels | Type 2–5 data, hints, feedback, all five fixtures, sequential progress | Each receiver set and explanation reviewed against RFC references |
| 4 · Add honest scoring and persistence | Unique-click score, perfect bonus/streak, ranks, top-five browser-local board | Scoring formula, negative score rank, ties, duplicate submit, reload, and thrown-storage cases pass |
| 5 · Accessibility and packaging | Keyboard/focus, text topology, status announcements, reduced motion, narrow layout, README | Manual accessibility and layout checks recorded; preview works at root and subpath |

Generate `tasks.md` from these slices and acceptance criteria. Build one complete round before implementing the remaining challenge data. Keep the Type 1 correct, Type 1 wrong, and Type 5 edge fixtures first in the test run; append Type 2–4 and state/scoring/storage tests afterward.

## Verification and Reporting

The browser runner at `tests/index.html` must show discovered/passed/failed totals and failed IDs; zero discovered cases is a failure. It must cover evaluator rules, invalid content/input, state transitions, scoring independence, restart, rank thresholds, leaderboard sorting/ties, reload persistence, and storage failure.

Manual release checks: fresh start through all five challenges to summary; deliberately wrong choices and cited corrections; keyboard-only play; visible focus and announced results; text topology; narrow viewport; reduced motion; localStorage unavailable; and relative resources under a repository subpath. Record pass/fail/not run, date, browser/environment, and evidence in `README.md` or a linked verification note. Do not claim unrun checks passed.

## Preview Command

Run from the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000**. On Windows, use `py -m http.server 8000 --bind 127.0.0.1`. Run browser checks at **http://127.0.0.1:8000/tests/**. The HTTP server is required for modules and JSON; `file://` is unsupported.

## Project Structure

### Documentation (this feature)

```text
specs/001-lsa-flooding-game/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── game-ui.md
└── tasks.md                 # generated by $speckit-tasks
```

### Source Code (repository root)

```text
index.html                   Semantic page shell and module entry point
styles.css                   Layout, selected/focus/feedback states, reduced motion
main.js                      Relative data load, whole-content validation, app startup
data/
  levels.json                Three levels, five authored challenge descriptions
engine/
  rules.js                   Pure receiver-set evaluator
  content.js                 Topology/challenge/source validation
  state.js                   Run state, attempts, assistance, advancement, restart
  scoring.js                 Click values, bonus, streak, rank; no grading decisions
  leaderboard.js             Versioned localStorage handling, top-five ordering
  feedback.js                Reason codes and RFC-cited explanations
ui/
  render.js                  Briefing, challenge, feedback, summary views
  controls.js                Native router buttons and game actions
tests/
  index.html                 Dependency-free browser test runner
  fixtures.js                Independent hand-checked expectations
  rules.test.js              Scope, exact-set, and invalid-content cases
  state.test.js              Attempts, retries, progression, restart
  scoring.test.js            Unique clicks, negative awards, streak/ranks, no duplication
  leaderboard.test.js        Sorting, tie order, reload, and storage errors
README.md                    Preview, controls, learning outcomes, verification status
```

## Complexity Tracking

No constitution violations or unnecessary architectural complexity are planned. The UI contract documents keyboard and assistive-technology behavior; no network/API contract is needed because the game has no external service interface.
