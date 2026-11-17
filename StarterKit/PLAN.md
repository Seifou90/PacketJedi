# PacketJedi · Implementation plan

## Build target

Implement PacketJedi as specified: a static browser game teaching OSPFv2 LSA flooding scope with one router-selection mechanic and three levels. First deliver one complete round with correct grading, explanatory feedback, retry, and advance; then add the five LSA types, scoring, ranks, and local top-five leaderboard.

**Hardest behavior to get right:** compute recipients for one identified LSA instance from its type, flooding area or AS-wide scope, origin router, fixed topology, and Type 5 stub-area exclusion without confusing flooding with route installation or Type 2 attachment-list contents.

**First evidence we'll check:** Type 1 from J1 in Area 1 receives at J1b and ABR-A1 only; adding J0 is a plausible wrong choice explained by RFC 2328 §§12.4.1 and 13.3.

## Workshop seven-step flow

These files are workshop inputs. Keep the lab sequence intact and review each output before continuing: (1) establish the constitution from `CONSTITUTION.md`; (2) specify from `SPEC.md`; (3) clarify until grading, progression, and scope have no unresolved ambiguity; (4) plan from this file and the clarified specification; (5) generate dependency-ordered tasks that build one complete round first; (6) analyze constitution/spec/plan/tasks and fix blocking inconsistencies; (7) implement, run the checks, and report passed, failed, or untested evidence. Do not treat these input files as generated Spec Kit artifacts.

## Stack and serving

- Semantic HTML, CSS, and native JavaScript modules. No framework, bundler, backend, external runtime service, or model.
- SVG topology with native accessible buttons for routers; include an equivalent text topology and ordinary buttons for all actions.
- `data/levels.js` or embedded JavaScript module data to avoid asynchronous JSON complexity while retaining static hosting; if using JSON instead, load with a relative URL and validate before play.
- In-memory current session; local top-five leaderboard stored in `localStorage` inside `try/catch`. If unavailable, keep all gameplay working and show a status message.
- Static hosting, including a repository subpath such as GitHub Pages. Use relative asset paths and case-correct filenames.

Preview from the repository root after implementation creates `index.html`:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000**. On Windows use `py` in place of `python3`. Native modules need an HTTP server; `file://` is not the supported run path. [MDN reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

## Proposed files and responsibilities

```text
index.html                   Semantic shell, instructions, live feedback region
style.css                    Layout, focus, selected/correct/error states, reduced motion
main.js                      Load validated data and start game
engine/
  rules.js                   Pure recipient-set evaluation; no DOM or score changes
  content.js                 Validate challenge IDs, topology, areas, origins, sources
  state.js                   Session transitions, attempts, solved rounds, streak/rank
  scoring.js                 Score formula only; cannot change evaluator outcome
  leaderboard.js             Safe localStorage read/write, sort, retain top five
ui/
  render.js                  Briefing, holomap, feedback, level and final summary
  controls.js                Router selection, submit, retry, next, restart
data/
  levels.js                  Three levels, five LSA challenges, briefings and references
tests/
  index.html                 Dependency-free browser test runner
  rules.test.js              Independent protocol fixtures
  state.test.js              Attempts, scoring, duplicate submit, progression
  content.test.js            Invalid/ambiguous authored data
README.md                    Actual run instructions and verification record
```

## Data contract

Store a versioned document with `sources`, `topology`, and exactly three `levels`. Topology lists fictional routers with unique ID, role, and area membership; ABR-A1 belongs to Areas 0 and 1, ABR-A2 to Areas 0 and 2. ASBR-A2 belongs to Area 2 and peers with BGP-X, which is explicitly external to OSPF. Area 1 is regular for Levels 1–2 and marked stub for Level 3. Each challenge is one LSA instance and records its area when Types 1–4, or AS-wide scope when Type 5; it also records origin router/area, any fixed LAN/DR membership, expected recipient IDs as an authoring aid for review only, ordered hints, misconception explanations, and source section IDs.

**Domain fields:** LSA type is integer 1–5; origin is an OSPF router ID; area IDs are 0, 1, or 2; area membership is a nonempty list; challenge recipient choices are unique router IDs. The challenge convention excludes the originator from the selectable receiver set. A router that belongs to both a regular and a stub area is a receiver of Type 5 if it receives that LSA through its regular-area interface; it does not forward Type 5 into its stub area. The BGP peer is never selectable as an OSPF receiver.

**Choice representation:** a set of router IDs. Selection toggles; evaluation compares normalized sets, ignoring click order. A valid submission requires at least one selected router.

**Validation rules:** reject duplicate IDs, unknown types/areas/routers, origin-area mismatch, impossible area membership, invalid/missing source records, missing explanations, duplicate recipient IDs, recipient outside modeled flooding scope, Type 2 without declared LAN members and fixed DR, Type 3/4 without one specific flooding area and an ABR origin, Type 4 targeting a stub area, or Type 5 without external origin and explicit stub status. Reject rather than guess. Validate all authored content before first challenge; show a useful challenge ID and do not score content errors.

Briefings and feedback refer to source records with title, URL, section, and claim. Keep fixed wording and authored challenge details in data; evaluator evidence supplies actual selected/expected IDs for feedback. Expected fixture outcomes in tests are written independently and not generated by the evaluator.

## Domain evaluation contract

```text
evaluate(challenge, topology, selectedRouterIds) → {
  status: "correct" | "incorrect" | "invalid-input" | "content-error",
  expected: canonical recipient ID set or null,
  selected: normalized selected ID set,
  reasonCode: stable flooding-scope identifier,
  evidence: { lsaType, origin, originArea, selectedAreas, excludedAreas, rule }
}
```

- This is pure and deterministic: no DOM, timer, network, random choice, scoring, or progress changes.
- Build recipients using RFC 2328 §§12.4.1–12.4.4 and §13.3: Types 1/2 are flooded on eligible interfaces in their one area; Type 2 describes routers fully adjacent to the DR on its transit network, but the LSA's receivers are area-scoped. Types 3/4 are separate area-scoped instances originated by ABRs; Type 4 is never originated into a stub area (§12.4.3.1). Type 5 is flooded on eligible interfaces across the AS except interfaces attached to stub areas (§§3.6, 12.4.4). Count a multi-area ABR as a receiver if it receives through any eligible interface. Type 5's NSSA/Type 7 exception in RFC 3101 is excluded from play. Exclude originator and non-OSPF BGP-X per the stated challenge convention.
- Exact set equality determines correctness. Score, streak, rank, and leaderboard code receive the evaluator result but cannot modify it.
- Distinguish learner error from invalid input and broken authored content. Feedback is generated from reason codes and observed router/area membership.

**Feedback example:** In the Type 1 J1 challenge, selecting J0 returns `incorrect`, reason `outside-lsa-area`, and evidence that J0 is in Area 0 while the LSA instance is flooded in Area 1. Show: “J0 is outside this LSA's Area 1 scope. A Type 1 Router-LSA is flooded throughout its particular area, and no further. RFC 2328 §§12.4.1, 13.3.”

## Session transitions and scoring

```text
loading → briefing → awaiting-selection
                         ├─ empty/invalid submit → guidance → awaiting-selection
                         ├─ incorrect → explanation → retry same round
                         └─ correct → award round score → Next → next challenge/level/summary
loading/content failure → error view
confirmed Restart → fresh Level 1 briefing; saved leaderboard retained
```

Selection and hints do not submit. Score each distinct router ID only on its first selection in that round: +10 if expected, -5 otherwise. Keep a set of router IDs already scored so toggling cannot farm points. The first exact-set submission earns +20; retries do not award another bonus. A streak increments after a perfect first submission and resets otherwise. Apply multiplier `1 + min(streak,4)*0.1` to that round's accumulated click points plus bonus and round to nearest integer when the round is solved; show provisional points before solve and commit the final score only once. Formula and consequence are visible before the first round. Scoring state has no effect on the pure evaluator or completion transition.

Ranks: Youngling 0–99, Padawan 100–199, Knight 200–299, Master 300+. These never gate progression. Top five leaderboard entries are per-browser, sorted by score, persisted using `try/catch`; unavailable storage disables persistence only. Reload starts a fresh current run but keeps saved entries. Disable Submit after success and guard in state logic. Advance only through explicit Next.

## Interaction and visual direction

Use a readable Jedi holomap with area boundaries, router labels/roles, and a small LSA character cue. Router circles must also be native buttons or have equivalent keyboard semantics, visible focus, names, and selected state. Move focus deliberately after screens change and announce result in a live region. Respect `prefers-reduced-motion`. Display text labels and area membership so color, animation, hover, and pointer precision are never required.

## Implementation order

| Slice | Deliverable | Evidence before the next slice |
| --- | --- | --- |
| 1 · Prove the rule | Pure evaluator plus hand-checked correct, plausible-wrong, and edge fixtures | Expected sets are reviewed independently against RFC 2328 |
| 2 · Complete one round | Briefing, challenge, feedback, retry, Next | Type 1 correct and wrong paths work in browser |
| 3 · Add the curriculum | All three levels, content validation, five characters, scoring and rank | Every shipped LSA has reviewed expected recipient set and rationale |
| 4 · Make it usable | Keyboard/focus, reduced motion, narrow layout, local leaderboard error path | Manual checks and storage-failure behavior recorded |
| 5 · Package the result | README and preview instructions | Another attendee can run from repository root and explain scope |

The hand-checked Type 1 correct, plausible-wrong, and Type 5 stub boundary cases in `SPEC.md` are the first tests and must remain the first test cases. Generate `tasks.md` from these slices and the actual acceptance criteria; build and verify one full round before adding the rest.

## Verification and reporting

Provide a dependency-free browser test runner at `tests/index.html` that imports pure modules and shows totals plus failed case IDs. Zero discovered tests is failure. Open **http://127.0.0.1:8000/tests/** after starting the same preview server.

| Check | What must be established |
| --- | --- |
| Domain cases | Hand-checked correct, plausible wrong, and stub boundary results; each shipped challenge |
| Content/input | Invalid submissions do not score; malformed authored content cannot be graded |
| State/scoring | Retry, perfect bonus, streak, rank thresholds, duplicate submit, level completion, restart |
| Leaderboard | Top-five ordering, reload persistence, and `localStorage` exception fallback |
| Source review | Each briefing and wrong-answer explanation agrees with its RFC citation |
| Browser playthrough | Fresh start to summary; keyboard-only selection; readable feedback |
| Layout/motion | Laptop, narrow viewport, reduced-motion preference |
| Hosting, if used | Relative assets load beneath repository subpath |

For every required criterion, record pass/fail/not run, date, environment, and evidence in README or a linked verification note. The test runner checks code behavior; a human reviews the teaching content and interaction.

## Ready-to-demo checklist

- [ ] A fresh player can complete the scoped game.
- [ ] Correct, plausible-wrong, and stub-boundary cases match independently checked expectations.
- [ ] Every wrong choice explains its misconception and cites RFC 2328.
- [ ] Core interactions work by keyboard with visible focus.
- [ ] README commands work from a fresh checkout.
- [ ] Verification notes distinguish passed, failed, and untested checks.
- [ ] Intended files are pushed; if a live demo is published, its link opens successfully.

## Scope controls

No persistence beyond the top-five local leaderboard, multiplayer, runtime AI, procedural scenarios, editor, audio, or network simulation. If time runs short, propose a coherent reduction and update the spec and tasks. Do not silently weaken correctness, accessibility, explanations, or the ready-to-demo checklist.
