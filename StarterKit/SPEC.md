# PacketJedi · First playable specification

## The pitch

The player is a Jedi who clicks every router that receives an arriving OSPF LSA, then learns flooding scope from immediate, specific feedback.

The player is a learner navigating a fictional three-area network. Each round shows a topology, LSA type, and origin; the player selects all receiving routers and submits. A correct decision illuminates the flooding path and explains the scope. An incorrect decision identifies the misconception, cites RFC 2328, and permits a retry. The session ends after all three levels and a results/leaderboard view.

## Who this is for

- **Learner:** networking students and early-career practitioners learning OSPFv2.
- **Assumed knowledge:** basic router and area terminology; the briefing defines the LSA terms used.
- **What the briefing teaches:** LSAs describe link-state information; flooding scope depends on type and area boundaries; ABRs connect areas; an ASBR injects external information; a stub area blocks Type 5 LSAs.
- **Why interaction helps:** learners often assume every LSA floods everywhere, or confuse an LSA's area scope with where its route is installed. The topology makes the receiving set visible.
- **Session target:** 5–10 minutes for a first playthrough, with unlimited thinking time.

## Learning outcomes and evidence

| ID | After playing, the learner can… | The game asks them to… | Evidence of success |
| --- | --- | --- | --- |
| LO1 | Identify Type 1 and Type 2 as area-scoped LSAs | Select routers within the origin area | Correct receiving-router sets and explanations in Level 1 |
| LO2 | Distinguish Type 3 network summaries from Type 4 ASBR summaries | Identify the one destination area of the displayed ABR-originated LSA instance | Correct Type 3/4 sets and explanation in Level 2 |
| LO3 | Predict Type 5 flooding across regular areas and its exclusion from a stub area | Select recipients of an external LSA | Correct set in Level 3, including stub-area routers excluded |

## The technical model

- **Rule being taught:** RFC 2328 Types 1–4 are each associated with one area; an ABR originates area-specific Type 3/4 summary-LSAs into eligible attached areas. A Type 4 ASBR-summary-LSA is never originated into a stub area. Type 5 AS-external-LSAs are flooded throughout the AS except into/throughout stub areas. The game challenges one specific area-scoped LSA instance at a time. A BGP peer is outside OSPF in this topology and is not an OSPF LSA recipient merely because it peers with the ASBR.
- **Context:** OSPFv2, RFC 2328, with a deliberately fixed, converged topology and no link/state changes during a round.
- **Assumptions:** all named OSPF routers are fully adjacent where topology connects them; each area is internally connected; flooding is reliable; no filtering except the stated stub-area Type 5 exclusion. A displayed LSA has already been originated and is being flooded. The answers concern which OSPF routers receive that LSA within the modeled scenario, not route installation, SPF calculation, or forwarding.
- **Topology:** made-up routers: J0 in Area 0; ABR-A1 between Areas 0 and 1; ABR-A2 between Areas 0 and 2; J1 and J1b in Area 1; J2 and J2b in Area 2; ASBR-A2 in Area 2, peering with external BGP peer BGP-X. Area 1 is designated stub for Level 3; Areas 0 and 2 are regular. These are fictional labels.
- **Excluded behavior:** OSPFv3, virtual links, NSSA, route calculation/selection, filtering, multiple paths or retransmission detail, DR election, adjacency formation, packet-level timing, and BGP route exchange. Type 2 challenge includes a stated multi-access LAN and fixed DR so the recipient set is unambiguous.
- **Authoritative references:** RFC 2328 §§3.6, 12.4.1–12.4.4, 13, and 13.3. Section 12.1.3 identifies the LS type field; it does not define area scope. Sections 12.4.1–12.4.4 specify LSA origination/content and scope, including Type 2 LAN membership, Type 3/4 summary-LSAs, Type 4 stub restriction (§12.4.3.1), and Type 5 stub exclusion. Section 13.3 specifies eligible flooding interfaces. RFC 3101 §§1.3, 2.3, and 3.2 define the distinct Type 7/NSSA behavior and translation to Type 5; NSSA is expressly outside this game's modeled area types.

Tell the learner that the game models receiving/flooding, not route installation. Each challenge is one identified LSA instance and declares the area through which it is flooded. For Type 1, receivers are the other OSPF routers in that LSA's area. For Type 2, receivers are the other OSPF routers in that LSA's area; the LSA's attached-router list describes routers fully adjacent to its DR on the transit network, which is not the same thing as the set of routers receiving the LSA. For Type 3/4, the challenge names the ABR-originated LSA instance and its destination area; receivers are other routers in that area. A Type 4 instance cannot be originated into a stub area. For Type 5, a router receives the LSA if it is reached through at least one eligible non-stub interface; Area 1's internal routers do not receive it, while ABR-A1 receives it through Area 0 and does not flood it into Area 1. The originator is displayed but excluded from the selectable receiver set as a game convention. The interface/flooding details needed for each answer are supplied in the challenge. Do not assert that all routers on a drawing necessarily receive every LSA.

## The repeatable game loop

1. **Brief:** introduce the LSA character and its RFC-based scope, with a worked example distinct from the challenge.
2. **Inspect:** show all three areas, router roles, origin, LSA type, and relevant area/flooding notes in both diagram and text.
3. **Choose:** click every router expected to receive the LSA, then explicitly submit. Click again to deselect.
4. **Explain:** show correct/incorrect, selected-set comparison, the specific rule, misconception feedback, and RFC 2328 section.
5. **Retry or advance:** an incorrect answer remains retryable; a correct answer unlocks Next.
6. **Reflect:** level/session summary shows correct rounds, attempts, score, streak, rank, and assistance if hints are used.

**Worked interaction:** An Area 1 Type 1 Hermit originates at J1. The player sees ABR-A1, J1, and J1b marked as Area 1 routers, with Area 0 and Area 2 beyond ABRs. Selecting J0 is a plausible wrong move. Feedback says: “J0 is outside the LSA's Area 1 flooding scope. Type 1 Router-LSAs are flooded throughout their particular area, and no further. See RFC 2328 §§12.4.1, 13.3.” The correct receiving set for this declared challenge is J1b and ABR-A1 (the originator is shown but not counted as a receiver by game convention). The game explains the convention before play.

## Required stories and acceptance criteria

### US1 · Predict LSA scope — P1

As a Jedi learner, I want to select the routers that receive an LSA so I can reason about OSPF flooding scope.

- **AC1:** A fresh session shows the first briefing before the first challenge.
- **AC2:** For each challenge, submitting exactly the expected router set marks the round correct and explains the governing rule with an RFC 2328 section.
- **AC3:** Submitting a plausible wrong set identifies the included/excluded router misconception, cites RFC 2328, leaves completion unchanged, and allows retry.
- **AC4:** Submitting no routers shows guidance without changing completion or score. Invalid content cannot be graded.

### US2 · Progress, score, and leaderboard — P1

As a learner, I want progress and score feedback that rewards correct work without changing protocol correctness.

- **AC5:** Three sequential levels contain Level 1 Types 1–2, Level 2 Types 3–4, and Level 3 Type 5 blocked by a stub area. Characters are Hermit, Group-Chat Admin, Diplomat, Tour Guide, and Town Crier respectively.
- **AC6:** On the first selection of each router ID in a round, score +10 if it is an expected receiver and -5 otherwise. Deselecting/reselecting that same router does not score it again. The first submission that exactly matches the expected set earns +20 perfect bonus; the streak multiplier is applied as defined below. The exact formula is displayed before play. Score never changes the accepted answer, progression, or evaluator.
- **AC7:** Ranks are Youngling, Padawan, Knight, and Master, with thresholds stated in the briefing or results view. Completing all rounds opens a summary.
- **AC8:** The top five scores are saved in browser-local `localStorage` inside `try/catch`. Storage failure leaves play available and gives a short status message. The leaderboard is per-browser and is not presented as global.
- **AC9:** Repeated submission after a solved round cannot score or advance twice; Restart returns to Level 1 and clears only current session values.

### US3 · Play accessibly — P1

As a keyboard user, I want to inspect and select routers without a mouse.

- **AC10:** All router selections and actions are keyboard reachable, visibly focused, labeled, and operable with standard keyboard controls.
- **AC11:** Feedback is textual, announced to assistive technology, and not conveyed by color alone. Reduced motion does not remove information or delay controls.
- **AC12:** Topology has an equivalent text description; the interface works at laptop and narrow viewport widths.

## Version-one content

Exactly three levels, with the one mechanic of selecting every receiving router:

| Level | New concept | Prerequisite | Misconception to expose |
| --- | --- | --- | --- |
| 1 | Type 1 Hermit and Type 2 Group-Chat Admin: intra-area scope | Briefing defines areas, origin, DR, and receiver convention | An LSA automatically crosses an ABR, or only routers listed as attached to the Type 2 LAN receive that area-scoped LSA |
| 2 | Type 3 Diplomat and Type 4 Tour Guide: area-specific summaries for networks and ASBR reachability | Level 1 | Type 3/4 are the same information, a single LSA instance crosses several areas, or Type 4 can be originated into a stub area |
| 3 | Type 5 Town Crier: external LSA scope and stub exclusion | Levels 1–2 | Type 5 reaches every area, including the stub area, or reaches the BGP peer |

**Scoring formula:** each distinct router ID earns its click value only on its first selection in that round: `+10` when it is an expected receiver, `−5` otherwise. Deselecting/reselecting it cannot score it again. The first submission with an exact expected set earns `+20` perfect-round bonus. A streak increments after a perfect first submission and resets otherwise. Streak multiplier is `1 + min(streak, 4) × 0.1`, applied to the round's accumulated click points plus any perfect bonus and rounded to the nearest integer when the round is solved. A round's final score is committed once, at solve; display provisional points separately. Score does not affect correctness. This makes the stated per-router rewards and wrong-click penalty meaningful while preventing toggle farming.

**Ranks:** Youngling 0–99, Padawan 100–199, Knight 200–299, Master 300+. Ranks are decorative summaries, never gates.

**Session behavior:** current session is in memory; leaderboard is best-effort localStorage. A reload starts a new game session but retains the local top five when storage is available. Restart clears current run values, not saved leaderboard entries.

## Hand-checked cases — first tests

These fixtures are the first tests and their expected router sets are independent of the evaluator. Use only the topology and convention above.

| Case | Input state | Player action | Expected result | Why / source |
| --- | --- | --- | --- | --- |
| Correct | Type 1 from J1 in Area 1; Area 1 routers are J1, J1b, ABR-A1 | Select J1b, ABR-A1 | Correct; exactly those two receivers | Type 1 is flooded throughout its area; originator excluded by game convention. RFC 2328 §12.4.1 |
| Plausible mistake | Same Type 1 challenge | Also select J0 | Incorrect; explain that an area-scoped Type 1 is not flooded by ABR-A1 into Area 0 | RFC 2328 §§12.4.1, 13.3 |
| Edge | Type 5 from ASBR-A2; Area 0 and Area 2 regular, Area 1 stub | Select all expected routers | Receivers are J0, ABR-A1, ABR-A2, J2, J2b; exclude ASBR-A2 (game convention), J1/J1b and BGP-X. ABR-A1 receives via Area 0 but does not flood it into stub Area 1. | Type 5 is flooded across the AS except stub-area interfaces. RFC 2328 §§3.6, 12.4.4, 13.3 |
| Unsupported content | Missing area membership or unknown LSA type | Open challenge | Visible content error; no grading or score | Invalid authoring data is not a learner error |

Additional cases must cover every shipped LSA round, including Type 2 fixed-DR LAN membership and Type 3/4 source/destination areas.

## Experience direction

- **Visual metaphor:** a calm Jedi holomap, with LSA characters traveling only along protocol-permitted flooding paths.
- **One memorable moment:** the Type 5 Town Crier's path stops at the stub-area boundary while the explanation labels the boundary.
- **Always visible:** router IDs, area boundaries, ABRs, ASBR role, BGP peer distinction, LSA type/origin, and selected receivers.
- **Feedback voice:** patient and specific; name the chosen router and the rule it does or does not satisfy.
- **Layout:** topology first, accessible router controls next, explanation and score below or beside it. No hover-only information.

## Non-goals

No accounts, multiplayer, backend, external network access, runtime AI, level editor, route calculation, OSPFv3, NSSA, virtual links, real production topology, or cloud/global leaderboard. RFC 3101 defines NSSA Type 7 LSAs as area-limited and allows translator ABRs to translate selected Type 7 LSAs into Type 5; none of that behavior is part of the game. No protocol simulation beyond the stated flooding-scope model.

## Clarifications resolved

- The player chooses an exact set of receiving routers, not just a path; the originator is displayed but excluded from the receiver set for consistent grading.
- Levels use the same selection mechanic throughout. Type 2 challenges state the fixed DR and LAN membership, while the receiving set is the other routers in the LSA's area. Each Type 3/4 challenge represents one area-specific instance originated by an ABR into one declared eligible area; Type 4 cannot target a stub area. The Type 5 challenge makes Area 1 stub while the ASBR remains in regular Area 2; a multi-area ABR is still selected if it receives the LSA through another, non-stub area.
- Scoring is awarded only once when a round is solved; ranks never gate content. Leaderboard storage is local and best effort.

## Release evidence

Record pass/fail/not run for all acceptance criteria. Independently review each challenge and its explanation against the cited RFC sections. A teammate must complete the core flow using only the keyboard. The root README must state actual behavior, preview command, evidence, and remaining limits.
