<!--
Sync Impact Report
Version change: none → 1.0.0 (initial constitution)
Modified principles: established C1–C7 from StarterKit/CONSTITUTION.md
Added sections: Product and Technical Constraints; Development Workflow and Quality Gates
Removed sections: none
Follow-up TODOs: none
Conflict review: no conflict found in the supplied principles; seven principles retained.
-->

# PacketJedi Constitution

## Core Principles

### I. Technical Truth Is a Release Requirement

The game MUST determine correctness only from documented OSPFv2 rules and the challenge topology and inputs. Scoring, streaks, ranks, and leaderboard position MUST NOT affect whether an answer is correct. Unsupported or ambiguous authored content MUST produce a visible content error and MUST NOT be graded. The game MUST distinguish flooding scope from route installation and forwarding. RFC 2328 is authoritative for OSPFv2 rules; RFC 3101 governs the excluded NSSA/Type 7 exception. Fictional characters MAY illustrate protocol behavior but MUST NOT alter it.

Evidence: independently hand-check at least one correct case, one plausible wrong case, and one boundary case; retain RFC source sections for every rule; review all shipped challenge briefings and explanations against those sources.

### II. Every Round Teaches Through a Decision

The player's primary action MUST exercise the stated networking skill. PacketJedi MUST use one mechanic: select every router that receives the displayed LSA. Each challenge MUST show its LSA type, origin, topology, and decision-relevant area/flooding information before submission. Feedback MUST explain why the choice is correct or identify the specific misconception behind each wrong selection, with an RFC 2328 reference.

The learning sequence MUST progress from Type 1 and 2 intra-area scope, to Type 3 and 4 area-specific summaries, to Type 5 external flooding and stub-area exclusion. LSA characters MUST be Type 1 Hermit, Type 2 Group-Chat Admin, Type 3 Diplomat, Type 4 Tour Guide, and Type 5 Town Crier.

Evidence: a teammate can connect each action to a learning outcome and explain what a deliberate wrong choice teaches.

### III. Progress and Scoring Are Honest

A round MUST complete only after an explicit submission exactly matches the valid receiving-router set. Incorrect submissions MUST leave the round available to retry. Empty or invalid submissions MUST show guidance and MUST NOT count as valid answers. A solved round MUST NOT award progress or score twice. Restart MUST begin a fresh run.

Scoring MUST be +10 per correct router, −5 per wrong router, +20 for a perfect round, and apply the streak multiplier defined in the specification. Ranks MUST be Youngling, Padawan, Knight, and Master. The top-five leaderboard MUST be per-browser localStorage, with storage access wrapped in try/catch; storage failure MUST NOT prevent play. The score formula and multiplier MUST be visible to players. No timer or speed bonus is allowed. Scoring, rank, and leaderboard state MUST NOT alter grading or gate progression.

Evidence: verify wrong-answer, repeated-submit, perfect-bonus, streak, rank, restart, and localStorage-failure behavior against the specification; evaluator cases MUST show identical correctness regardless of score state.

### IV. Access Is Part of the Core Game

Every core action MUST work by keyboard with visible focus, readable labels, and predictable navigation. Router controls MUST expose accessible names and selected state. Success and failure MUST include text, not color alone, and feedback MUST be announced to assistive technology. The topology MUST have an equivalent text description. The game MUST respect reduced-motion preferences; motion MUST NOT delay feedback or controls. At laptop and narrow viewport widths, topology content MUST remain usable without hiding actions.

Evidence: record a keyboard-only playthrough, narrow-window check, and reduced-motion check. Do not claim full accessibility certification from these checks.

### V. The First Version Is Deterministic and Self-Contained

The game MUST use authored content and deterministic domain logic in static HTML, CSS, and JavaScript. It MUST require no account, backend, live device, model, or API key. Asset paths MUST be relative so static hosting under a repository subpath can work. The topology MUST be fictional and MUST NOT imply production-network accuracy. The game MUST continue to work when localStorage is unavailable, without saving the leaderboard.

Evidence: a clean browser session can play from project files without an external service deciding an answer; confirm the storage-failure path manually.

### VI. Content and Logic Can Be Reviewed Separately

Challenge topology, LSA data, hints, and sources MUST be editable separately from rendering and session state. Domain evaluation MUST be a deterministic function separate from scoring, persistence, and UI. Authored content MUST be validated before a challenge can be graded. Feedback MUST agree with evaluator evidence; an answer key MUST NOT override the rule engine. Adding a challenge that uses the existing mechanic MUST NOT require a separate grading or scoring path.

Evidence: inspect a level's data, trace a selection through the evaluator, and verify that a trial challenge can be added without modifying the rule engine.

### VII. Done Is Demonstrated

The delivered scope MUST match the agreed constitution, specification, plan, tasks, and README. A feature is complete only when its acceptance criteria have recorded results. A screenshot, checked task box, or completion claim alone is not evidence. When time is short, scope reductions MUST be explicit; incorrect teaching and broken core interactions take priority over visual effects. Failed and untested checks MUST remain visible.

Evidence: a reproducible preview command, verification results, a fresh-start playthrough, independently checked cases, and a README another attendee can follow.

## Product and Technical Constraints

The first release MUST contain one router-selection mechanic and exactly three sequential levels: Types 1–2; Types 3–4; and Type 5 with a stub area blocking it. It MUST use areas 0, 1, and 2, ABRs between areas, an ASBR in Area 2 peering with a BGP router, and a made-up topology. Excluded behavior includes OSPFv3, NSSA, virtual links, route calculation/selection, filtering, and production-network access. The game MUST model the specified flooding-scope scenarios, not full OSPF operation.

The first release MUST include the stated scoring, ranks, and top-five local leaderboard. Leaderboard persistence is per-browser and best effort. No accounts, multiplayer, backend, runtime AI, or global leaderboard are in scope.

## Development Workflow and Quality Gates

The seven workshop steps MUST remain separate and reviewed in order: establish the constitution; specify the first playable version; clarify rule, progression, and scope ambiguity; plan implementation and verification; generate dependency-ordered tasks that build one complete round first; analyze and resolve blocking consistency issues; implement and report passed, failed, or untested checks.

Before implementation, retain hand-checked correct, plausible-wrong, and boundary cases as the first tests. Before a demo, verify a fresh-start playthrough, the three case types, misconception-specific wrong-answer feedback, keyboard controls and visible focus, README commands from a fresh checkout, and honest pass/fail/not-run reporting. If published, verify that the live link opens. Do not claim an unrun check passed.

## Governance

This constitution governs project decisions. A material change MUST state its reason, update affected specifications and plans, and trigger a consistency analysis. Conflicts MUST be surfaced and resolved explicitly; no principle may be weakened silently to make an implementation pass.

Reviewers MUST check proposed work against the measurable evidence listed under each principle and record unmet or untested criteria. Version numbers follow semantic versioning: MAJOR for incompatible principle removal or redefinition, MINOR for added principles or material expansion, and PATCH for clarifications or non-semantic edits. The constitution version and amendment date MUST be updated with each amendment.

**Version**: 1.0.0 | **Ratified**: 2026-11-17 | **Last Amended**: 2026-11-17
