# PacketJedi · Project constitution

**Purpose:** help networking learners practice OSPFv2 LSA flooding scope by predicting which routers receive an LSA.

**First release:** one click-to-select mechanic, three short levels, a browser, and a 60-minute workshop build. The game is a static HTML/CSS/JavaScript project with no backend.

## C1 · Technical truth is a release requirement

The game must never reward an incorrect flooding prediction. Correctness is determined only by the documented OSPF rules and the topology/challenge inputs. Points, streaks, ranks, and leaderboard position are presentation/progression data and must never affect grading. Unsupported or ambiguous authored content is an authoring error: show an explanation and prevent grading it.

Teach OSPFv2 as specified by RFC 2328, especially Sections 3.6, 12.4.1–12.4.4, 13, and 13.3. Section 12.1.3 identifies the LS type field; it does not define area flooding scope. RFC 3101 governs the excluded NSSA/Type 7 exception, which must not be mistaken for a regular stub area. The model is a stable, already-converged, made-up topology with areas 0, 1, and 2, ABRs between areas, an ASBR in Area 2, and a BGP router peering with that ASBR. Distinguish flooding scope from route installation or forwarding. Areas 1 and 2 are regular except for the explicitly declared stub area in Level 3, which blocks Type 5 LSAs. No external routing behavior changes the answer. Fictional characters illustrate LSA types; they do not change the protocol rules.

**Evidence:** hand-checked correct, plausible-wrong, and edge cases; RFC links and sections for each rule; review of all shipped briefings and explanations. Expected results are recorded independently of the implementation.

## C2 · Every round teaches through a decision

The player's main action is clicking every router that receives a named LSA. Introduce the relevant rule before testing it, show the LSA origin and topology, and explain each wrong router choice as a specific misconception with an RFC 2328 reference. Correct answers also explain why selected routers receive the LSA and why others do not.

Use this learning sequence: Types 1–2 within an area → Types 3–4 crossing area boundaries through ABRs → Type 5 AS-external flooding and a stub-area boundary. The original characters are Type 1 Hermit, Type 2 Group-Chat Admin, Type 3 Diplomat, Type 4 Tour Guide, and Type 5 Town Crier. Hints may explain a method; they do not change grading.

**Evidence:** a teammate can map each click to the flooding rule and describe what a deliberately wrong choice teaches.

## C3 · Progress and scoring are honest

A round completes only after the player has selected exactly the correct receiving-router set and submits it. Incorrect clicks earn no progress. Empty submissions show guidance. Each router can be selected/deselected; submitting evaluates the current set. Repeated submission after success has no effect.

Scoring is +10 the first time each correct router is selected in a round, -5 the first time each incorrect router is selected in a round, +20 for a perfect first submission, and a streak multiplier. Toggling a router does not score it repeatedly. Ranks are Youngling, Padawan, Knight, and Master. Scores, ranks, streaks, and the top-five local leaderboard must never change which routers count as correct. Store leaderboard data per browser in `localStorage`, wrapped in `try/catch`; if storage is unavailable, the game remains playable and reports that scores cannot be saved. No countdown or speed bonus. The session ends after all three levels; restart begins a fresh session.

**Evidence:** evaluator cases prove scores cannot alter correctness; wrong answer, repeated router toggle, perfect bonus, streak, local-storage failure, completion, and reset behavior match the specification.

## C4 · Access is part of the core game

All core actions must work by keyboard, with visible focus, readable labels, and a predictable order. Router nodes must be real buttons or equivalent accessible controls. Explain success and failure with text as well as color. Provide a text equivalent for the topology and announce feedback to assistive technology. Respect reduced-motion preferences; animation never delays feedback or controls.

Keep the game usable on a typical laptop and a narrow browser window. Dense topology may scroll in a labeled region without hiding action buttons.

**Evidence:** keyboard-only playthrough, narrow-window check, and reduced-motion check. Record what was actually checked; do not claim full accessibility certification.

## C5 · The first version is deterministic and self-contained

Ship authored content and deterministic domain logic in static HTML, CSS, and JavaScript. No account, backend, live device connection, model, or API key is required. Use relative asset paths so the game works from a repository subpath. The topology is fictional and made up; do not use real network identifiers or claim it describes a production network.

**Evidence:** a clean browser session can play using only project files; no external service decides an answer.

## C6 · Content and logic can be reviewed separately

Keep challenge topology and LSA data editable, and separate domain evaluation from rendering, scoring, and persistence. Validate content before showing a challenge. Feedback must agree with the evaluator; a hand-authored answer key cannot silently override the flooding rules. Adding another challenge must not require a new scoring path.

**Evidence:** inspect a level's data, trace a selection through the evaluator, and add a trial challenge without modifying grading or scoring logic.

## C7 · Done is demonstrated

Ship the agreed scope: one mechanic, three levels, five LSA character types, scoring/ranks, and a best-effort local top-five leaderboard. Requirements, plan, tasks, and README must describe the same game. A feature is complete when its acceptance criteria pass and status is recorded. A screenshot or completion claim is not evidence by itself.

When time is short, reduce scope explicitly. Fix incorrect teaching and broken core interactions before visual effects. Keep failed and untested checks visible.

**Evidence:** working preview command, recorded verification results, fresh-start playthrough, and README another attendee can follow.

## How we change these rules

For any material change, record the reason, update the affected spec and plan, and rerun analysis. A conflict with this constitution is resolved openly; the build agent must not weaken a principle merely to make its implementation pass.
