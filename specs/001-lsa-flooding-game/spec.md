# Feature Specification: OSPF LSA Flooding Game

**Feature Branch**: `main`

**Created**: 2026-11-17

**Status**: Draft

**Input**: User description: "Read StarterKit/SPEC.md. Specify this game's first playable version, preserving the learning outcomes, non-goals, and acceptance criteria."

## Clarifications

### Session 2026-11-17

- Q: Should the final run score be allowed to fall below zero when wrong-router penalties exceed earned points? → A: Allow negative scores; all scores below 100 are Youngling.

## User Scenarios & Testing

### User Story 1 - Predict LSA Flooding Scope (Priority: P1)

A networking learner enters the holomap briefing, reviews the LSA type and origin, then selects every router that receives that LSA. After submitting, the learner sees whether the set is correct and receives a rule-based explanation. A wrong choice explains the specific misconception and leaves the round available to retry.

**Why this priority**: Correctly predicting flooding scope is the game's sole learning objective and core mechanic.

**Independent Test**: Start at the first Type 1 challenge, select the correct set, then replay it with a plausible wrong router included. Confirm correct feedback in the first run and a specific RFC-cited misconception with retry in the second.

**Acceptance Scenarios**:

1. **Given** a fresh session, **When** the learner starts, **Then** the first briefing and worked example appear before any answer can be submitted.
2. **Given** a valid challenge, **When** the learner submits exactly the expected receiver set, **Then** the round is marked correct and the explanation names the applicable rule and RFC 2328 section.
3. **Given** a valid challenge, **When** the learner submits a set with a plausible wrong router, **Then** feedback identifies the misconception, cites RFC 2328, leaves completion unchanged, and allows a retry.
4. **Given** no routers are selected, **When** the learner submits, **Then** guidance appears and the answer, completion, and score remain unchanged.
5. **Given** malformed or unsupported challenge content, **When** the challenge opens, **Then** a visible content error appears and the challenge cannot be graded.
6. **Given** a challenge has an available hint, **When** the learner requests it, **Then** it reveals a method or rule, does not change correctness or score, and assistance is reflected in the session summary.

---

### User Story 2 - Complete the Levels and Track a Run (Priority: P1)

The learner progresses through three levels and five required rounds: Types 1 and 2, Types 3 and 4, then Type 5 with a stub area. Correct router selections earn points, a perfect first submission earns a bonus, and consecutive perfect rounds build a multiplier. At the end, the learner sees the run summary, rank, and top-five local leaderboard.

**Why this priority**: Progression makes the single mechanic teach a sequence of related concepts, while the score and local leaderboard provide motivating feedback without influencing correctness.

**Independent Test**: Play all five rounds, including one imperfect first submission and one perfect first submission. Confirm the expected score changes, rank, final summary, and leaderboard behavior after reload and when local storage is unavailable.

**Acceptance Scenarios**:

1. **Given** a new run, **When** the learner completes rounds, **Then** Levels 1, 2, and 3 appear in order with Types 1–2, Types 3–4, and Type 5 respectively.
2. **Given** a router has not previously been selected in the current round, **When** it is selected, **Then** it contributes +10 if it is an expected receiver or −5 otherwise; deselecting and reselecting that router contributes no additional points.
3. **Given** the learner's first valid submission in a round is exactly correct, **When** it is submitted, **Then** the round earns +20 perfect-round bonus and increments the perfect-round streak.
4. **Given** the learner's first valid submission is not exact, **When** the round is later solved, **Then** it earns no perfect-round bonus and the streak is reset; score and multiplier never alter the accepted receiver set.
5. **Given** the score changes, **When** the rank is displayed, **Then** scores below 100, including negative scores, are Youngling; Padawan is 100–199, Knight is 200–299, and Master is 300 or higher; rank never gates content.
6. **Given** all five rounds are solved, **When** the learner reaches the end, **Then** a summary shows completed rounds, attempts, score, streak, rank, and hint assistance, plus the top five scores stored for this browser.
7. **Given** browser storage is unavailable or rejects a read/write, **When** a run is completed, **Then** play remains available and a short message explains that leaderboard scores could not be saved.
8. **Given** a solved round or completed run, **When** Submit is activated again, **Then** no progress or score is awarded twice.
9. **Given** the learner reloads, **When** a new session starts, **Then** play begins at the first briefing and saved local leaderboard entries remain when browser storage is available.
10. **Given** the learner chooses Restart during a run, **When** the restart is confirmed, **Then** current-run values clear and the first briefing opens; saved leaderboard entries remain.

---

### User Story 3 - Play with Accessible Controls (Priority: P1)

A learner who uses a keyboard or assistive technology can inspect the topology, select and deselect routers, submit, get feedback, request a hint, and advance without a mouse.

**Why this priority**: Accessible interaction is part of the core game and cannot be added after the decision loop is built.

**Independent Test**: Complete a fresh run using only the keyboard and inspect the challenge and feedback with a screen reader at both a laptop and narrow browser width.

**Acceptance Scenarios**:

1. **Given** any game screen, **When** a learner navigates by keyboard, **Then** all router choices and actions are reachable, have visible focus and clear names, and can be activated with standard keys.
2. **Given** a correct or incorrect result, **When** feedback appears, **Then** it includes text, is announced to assistive technology, and does not rely on color alone.
3. **Given** the topology is shown, **When** visual interpretation is unavailable, **Then** equivalent text identifies routers, areas, roles, LSA origin, and selected receivers.
4. **Given** reduced motion is requested or the viewport is narrow, **When** the learner plays, **Then** no information or control is lost and motion does not delay feedback.

---

### Edge Cases

- An empty selection provides guidance without consuming an attempt, changing score, or advancing.
- A challenge with an unknown LSA type, missing area membership, invalid origin, or inconsistent receiver set is rejected before grading.
- Selecting and deselecting the same router repeatedly cannot farm points; each router ID scores at most once per round.
- An ABR attached to both a regular area and the stub area receives a Type 5 through its regular-area interface but does not flood it into the stub area.
- A Type 2 LSA's attached-router list describes routers fully adjacent to the DR on that transit network; it does not limit which routers in the LSA's area receive the LSA.
- The Type 5 originating ASBR is shown but excluded from the selectable receiver set by the game's convention; the external BGP peer is outside OSPF and is not a receiver.
- Browser storage errors, including unavailable storage, do not block play or erase the current run.
- A run score may fall below zero when penalties exceed earned points; every score below 100 is ranked Youngling.
- Repeated submission after a correct answer or completed run has no effect.

## Requirements

### Learning Outcomes

- **LO1**: Identify Type 1 and Type 2 as area-scoped LSAs by selecting the receivers in the originating area.
- **LO2**: Distinguish Type 3 network summaries from Type 4 ASBR summaries by identifying the receivers of one area-specific ABR-originated instance.
- **LO3**: Predict Type 5 flooding through regular areas and its exclusion from the stub area, including a multi-area ABR that receives through a regular-area interface.

### Functional Requirements

- **FR-001**: The game MUST show a briefing and a different worked example before the first decision.
- **FR-002**: The game MUST present one mechanic throughout: select every router that receives the displayed LSA, then submit the set. Selecting a selected router again MUST deselect it.
- **FR-003**: The game MUST contain exactly three sequential levels and five required rounds, with one round for each LSA type: Level 1 Types 1–2, Level 2 Types 3–4, Level 3 Type 5 with Area 1 stub.
- **FR-004**: The five LSA characters MUST be Type 1 Hermit, Type 2 Group-Chat Admin, Type 3 Diplomat, Type 4 Tour Guide, and Type 5 Town Crier.
- **FR-005**: Every challenge MUST show its LSA type, origin, area/topology context, and all information needed to determine receivers. The topology MUST show made-up routers in Areas 0, 1, and 2; ABRs between areas; an ASBR in Area 2; and its external BGP peer.
- **FR-006**: The evaluator MUST accept only exact equality between the learner's selected router set and the independently reviewed expected receiver set. Originators are displayed and excluded from selectable expected receivers as a consistent game convention.
- **FR-007**: Every correct answer MUST explain why the selected routers receive the LSA. Every wrong submitted set MUST identify a specific misconception and cite the applicable RFC 2328 section. RFC 3101 Type 7/NSSA behavior MUST remain outside the modeled game.
- **FR-008**: A wrong answer MUST leave the round available to retry. An empty selection MUST show guidance without counting as a valid attempt or changing completion/score. Invalid authored content MUST produce a visible error and MUST NOT be graded.
- **FR-009**: Each round MUST offer a method-focused hint. Hints MUST NOT affect correctness or score, and hint use MUST appear in the final assistance summary.
- **FR-010**: The first selection of each unique router ID in a round MUST add +10 if it is an expected receiver and −5 otherwise. Deselecting or reselecting that ID MUST NOT change its click score.
- **FR-011**: A perfect round is a round whose first valid submitted set is exact. It earns +20 and advances the streak by one. Any non-exact first valid submission resets the streak and earns no perfect bonus, even if a later retry solves the round.
- **FR-012**: The streak multiplier MUST be `1 + 0.1 × min(streak, 4)`, using the updated streak for a perfect round, and MUST apply to that round's accumulated click points plus any perfect bonus. Round score is rounded to the nearest integer, with exact half values rounded away from zero, and committed once when solved. Provisional click points MUST be distinguishable from committed score. The formula MUST be visible before play.
- **FR-013**: Ranks MUST use these thresholds: Youngling for any score below 100 (including negative scores), Padawan 100–199, Knight 200–299, and Master 300+. Ranks MUST NOT gate progression.
- **FR-014**: The final summary MUST report completed rounds, valid attempts, score, streak, rank, hint assistance, and the top five browser-local scores. Equal scores MUST preserve their order of entry.
- **FR-015**: The top-five leaderboard MUST be saved in per-browser `localStorage`, with storage reads and writes wrapped in `try/catch`. A storage failure MUST leave gameplay available and show a status message. Reload MUST start a fresh run while retaining saved leaderboard scores when storage works. Restart MUST clear current-run values but preserve saved scores.
- **FR-016**: Solved rounds and completed runs MUST ignore repeated submissions for scoring and progression.
- **FR-017**: All router selections and core actions MUST be keyboard-operable with visible focus and accessible names. Status and result messages MUST be available as text and announced to assistive technology.
- **FR-018**: The topology MUST have an equivalent text description. The game MUST remain usable at laptop and narrow viewport widths and when reduced motion is requested.
- **FR-019**: The game MUST run as a static browser experience with no account, backend, live-device access, runtime AI, or external service deciding an answer. Asset references MUST work under a repository subpath.
- **FR-020**: Shipped flooding rules MUST be based on RFC 2328 and the local references `references/rfc2328.txt` and `references/rfc3101.txt`; each challenge and explanation MUST cite the relevant section.
- **FR-021**: Before a challenge can be played, its topology, LSA type, origin, expected receiver set, explanation, and source citation MUST be checked for consistency. A hand-authored answer set MUST NOT override the OSPF rule evaluation.

### Required Challenge Fixtures

The first challenge fixtures are independent expected results, not values generated by the evaluator. Router names are fictional. For each Type 1–4 challenge, the listed LSA is one area-specific instance. For Type 5, Area 1 is stub and Areas 0 and 2 are regular. In every fixture, exclude the originator from the expected selectable receiver set by game convention.

| LSA | Origin / flooded area | Expected selectable receivers | Required misconception to explain |
| --- | --- | --- | --- |
| Type 1 Hermit | J1 / Area 1 | J1b, ABR-A1 | J0 in Area 0 does not receive this area-scoped LSA. RFC 2328 §§12.4.1, 13.3. |
| Type 2 Group-Chat Admin | DR J2 / Area 2; transit LAN members J2, J2b, ASBR-A2 | J2b, ABR-A2, ASBR-A2 | ABR-A2 receives the area-flooded LSA even though it is not listed as attached to the transit LAN. RFC 2328 §§12.4.2, 13.3. |
| Type 3 Diplomat | ABR-A1 / Area 0 | J0, ABR-A2 | This is an area-specific summary-LSA instance; it is not a Type 1/2 LSA carried across areas. RFC 2328 §§12.4.3, 13.3. |
| Type 4 Tour Guide | ABR-A2 / Area 0; identifies ASBR-A2 | J0, ABR-A1 | Type 4 advertises ASBR reachability and cannot be originated into a stub area. RFC 2328 §§12.4.3, 12.4.3.1, 13.3. |
| Type 5 Town Crier | ASBR-A2 / AS-wide | J0, ABR-A1, ABR-A2, J2, J2b | The Type 5 reaches eligible regular-area interfaces; J1/J1b in stub Area 1 do not receive it, and ABR-A1 receives via Area 0 without flooding it into Area 1. RFC 2328 §§3.6, 12.4.4, 13.3. |

### Key Entities

- **Router**: A fictional OSPF participant with a unique label, role, and one or more area memberships. Roles include ordinary router, ABR, and ASBR.
- **Area**: A named OSPF flooding domain. Areas 0 and 2 are regular; Area 1 is regular in Levels 1–2 and stub in Level 3.
- **LSA challenge**: One LSA instance with type, origin, flooding area or AS-wide scope, required evidence, expected receiver set, hint, misconception feedback, and RFC citation.
- **Run**: Current level/round, selections, attempts, assistance, score, streak, and rank. It starts fresh after reload.
- **Leaderboard entry**: A score from one completed run, stored only for this browser; the visible board retains the top five.

## Non-Goals

The first playable version does not include accounts, multiplayer, a backend, external network access, live device connections, runtime AI, a level editor, route calculation or selection, OSPFv3, NSSA behavior, virtual links, real production topologies, a cloud/global leaderboard, a countdown, or a speed bonus. It does not simulate full OSPF operation beyond the stated flooding-scope model.

## Success Criteria

### Measurable Outcomes

- **SC-001**: All five required challenge fixtures produce exactly the expected receiver sets, including the Area 1 stub boundary and ABR-A1's eligible Area 0 receipt of Type 5.
- **SC-002**: Every shipped wrong-answer path provides a misconception-specific explanation and a relevant RFC 2328 section; every shipped correct path explains the governing rule.
- **SC-003**: A fresh run can be completed through all five rounds and the final summary in a 5–10 minute first-playthrough target, with no decision timer.
- **SC-004**: Repeated router toggles and repeated submissions never award duplicate click points, round bonuses, or progression.
- **SC-005**: All core game actions can be completed by keyboard, with visible focus and text feedback; topology information is also available as text.
- **SC-006**: A completed run appears in the top-five local leaderboard after reload when browser storage is available; when storage is unavailable, all five rounds remain playable and a status message is shown.

## Assumptions

- The five required rounds are one round per LSA type, grouped into the three specified levels.
- The fixed fictional topology is: J0 in Area 0; ABR-A1 in Areas 0 and 1; ABR-A2 in Areas 0 and 2; J1 and J1b in Area 1; J2 and J2b in Area 2; ASBR-A2 in Area 2; and external BGP peer BGP-X. For the Type 2 fixture, ABR-A2 is not a member of the declared Area 2 transit LAN.
- Each area is connected, named adjacencies are established, the topology is converged, and no filtering or topology changes occur during a round. Challenges ask which routers receive the displayed LSA, not which routes are installed or how packets are forwarded.
- The originator is displayed but excluded from selectable receivers as a game convention. An ABR counts as a receiver if it receives an AS-wide LSA through any eligible non-stub area interface.
- The first valid submission determines whether the round was perfect. The player can retry until solving it; the round's click score is accumulated once per distinct selected router and committed only when the round is solved.
- Scores are not floored at zero. Any score below 100, including a negative score, is Youngling.
- Leaderboard data is local to one browser and is not a global ranking. If local persistence is unavailable, the session still works without saved scores.
- RFC 2328 governs the modeled OSPFv2 rules. RFC 3101's Type 7/NSSA behavior is referenced only to clarify its exclusion from this game's scope.
- The experience is a static browser game with no account, backend, live network, or runtime AI. Static hosting under a repository subpath is in scope; publishing is not required for the first playable version.
