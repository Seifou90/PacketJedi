# PacketJedi

**Read the LSA. Know its scope.**

PacketJedi is a keyboard-accessible browser game for networking learners. Play as a Jedi and select every router that receives each OSPF LSA. The game explains wrong choices with rule context and RFC 2328 citations.

A project from **NAF AC6 — Loop Engineering, Spec-Driven Development & the Future of VibeOps**.

| Project | Details |
| --- | --- |
| Status | Playable implementation; browser suite and manual release checks pending |
| Networking topic | OSPF LSA flooding scope, Areas 0, 1, and 2 |
| Typical session | 5–10 minutes (target; not timed or user-tested) |
| Live demo | Not published |
| Built by | PacketJedi workshop project |

## The challenge

An LSA arrives from a fictional router, such as J1 in Area 1 or ASBR-A2 in Area 2. Select all routers that receive that LSA instance; the game compares the complete set, explains extra and missing routers, and lets you retry.

## What you'll learn

| By the end, you can… | You'll practice by… |
| --- | --- |
| Distinguish area-scoped Types 1 and 2 from broader reachability information | Predict the Area 1 or Area 2 receiver set |
| Track a Type 3 or Type 4 summary instance into its destination area | Follow an ABR's advertised instance through Area 0 |
| Explain where a Type 5 LSA is and is not eligible to flood | Exclude Area 1 when it becomes stub, while retaining ABRs with regular-area reachability |

**Before playing:** No prior knowledge is required; briefings introduce the decision and controls.

## Play locally

From the repository root, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

On Windows, use `py -m http.server 8000 --bind 127.0.0.1`. Open <http://127.0.0.1:8000>. Keep the server running; Ctrl+C stops it. Browser modules and JSON require HTTP serving; do not open the page using `file://`.

Run the dependency-free browser checks at <http://127.0.0.1:8000/tests/>.

## How to play

1. Read each level briefing and inspect the topology.
2. Toggle router buttons with a pointer, Space, or Enter, then submit the receiver set.
3. Read the feedback and RFC section citation. Retry a wrong set; Next appears after a correct set.
4. Hints are optional and recorded separately from scoring. Restart asks for confirmation.
5. Complete five rounds across three levels to see the run summary.

| Control | Action |
| --- | --- |
| Router button | Toggle whether that OSPF router is selected; state is shown through text and `aria-pressed` |
| Submit receivers | Check the selected set; empty input does not count as an attempt |
| Hint | Reveal a method-focused clue |
| Retry / Next | Clear current selections to retry, or advance after a correct answer |
| Restart | Confirm to begin a fresh run; saved local scores remain |

**Progress:** A round completes only when the selected set exactly equals the evaluator's receiver set. First selection of each unique router is +10 if correct and −5 if wrong. A perfect first non-empty submission earns +20; consecutive perfect rounds increase the multiplier by 0.1 up to 1.4×. Each completed round commits once. Scores can be negative; below 100 is Youngling. The top-five leaderboard is per-browser local storage; if unavailable, gameplay remains available without persistence.

## What this game models

The topology is made up: J0 and the ABRs connect three OSPF areas; ASBR-A2 in Area 2 peers with external BGP-X. Types 1–4 are evaluated for a specific area flooding instance. Type 5 is evaluated AS-wide over regular areas. In Level 3, Area 1 is stub; an ABR attached to a regular area can still receive a Type 5 there, but does not propagate it into the stub area. The Advertising Router is excluded from selectable receivers as a game convention. The model does not simulate packet-level flooding, acknowledgements, retransmission, route calculation, Type 7/NSSA translation, or live networks.

| Reference | What it supports |
| --- | --- |
| [RFC 2328, §§3.6, 12.1.5, 12.4.1–12.4.4, 13, 13.3](https://www.rfc-editor.org/rfc/rfc2328) | Stub areas, Advertising Router, LSA types, and flooding procedure |
| [RFC 3101](https://www.rfc-editor.org/rfc/rfc3101) | NSSA / Type 7 distinction; those behaviors are outside this game |

## How it was built

The project follows the Spec Kit workflow: **constitution → specify → clarify → plan → tasks → analyze → implement**.

- **Stack:** Static HTML, CSS, native JavaScript ES modules, and JSON; no runtime dependencies or backend.
- **Preview:** Python's standard HTTP server; relative paths support root and repository-subpath hosting.
- **Planning inputs:** `StarterKit/CONSTITUTION.md`, `StarterKit/SPEC.md`, `StarterKit/PLAN.md`.
- **Working artifacts:** `specs/001-lsa-flooding-game/`.
- **Design decision:** The evaluator computes correctness from topology and LSA fields. Reviewed fixture metadata and scoring do not decide what counts as correct.

## Verification

**Last checked:** 2026-11-17; Node REPL domain checks and local preview endpoint checks. Browser automation was unavailable in this environment.

| Check | Result | Evidence / notes |
| --- | --- | --- |
| Correct, incorrect, and boundary receiver cases | Pass: Node REPL | First three test modules ran in required order; all expected receiver sets matched |
| Domain, state, scoring, and leaderboard suite | Pass: 22/22 in Node REPL | The browser page at `/tests/` was not executed; browser access host unavailable |
| RFC rule citations and receiver fixtures | Pass: local RFC 2328 sections checked; corrected section mismatches during implementation | Type 1/2 §§12.4.1–12.4.2; Type 3/4 §§12.4.3/12.4.3.1; Type 5 §§3.6/12.4.4/13.3 |
| Topology, level shape, and five receiver sets | Pass: Python static source audit | Three levels, 2/2/1 challenges, area membership consistency, and all five fixture sets |
| Root preview resources | Pass: HTTP 200 | `/`, `/tests/`, `/data/levels.json`, `/engine/rules.js` |
| Retry, hint, duplicate Submit, completion, restart | Not manually checked | Manual browser playthrough pending |
| Keyboard-only core playthrough and announcements | Not manually checked | Manual assistive-technology/browser check pending |
| Narrow layout and reduced motion | Not manually checked | Check at a narrow viewport with reduced motion enabled |
| Repository-subpath paths | Not verified | References are relative; run the preview from a repository subpath before publishing there |
| Published demo | Not published | No public URL |

### Ready-to-demo checklist

- [ ] Complete the scoped game from a fresh browser start — implementation is present; full browser playthrough is pending.
- [x] Hand-checked correct, plausible-wrong, and Type 5 stub-boundary receiver sets agree with the authored fixtures and local RFC sections.
- [x] Wrong-answer copy names the extra/missing routers, misconception, and RFC section in the implementation.
- [ ] Complete keyboard-only play and confirm visible focus and live status announcements.
- [x] Preview command starts the server; game, test page, JSON, and rules module returned HTTP 200.
- [x] Verification notes distinguish passed checks from browser checks that remain untested.
- [ ] Commit/push intended files and verify a published demo link — neither has been requested or created.

## Known limitations and next steps

- **Known limitation:** Timing, focus behavior, screen-reader announcements, mobile layout, and browser storage permissions need an actual browser release check.
- **Next improvement:** Record an observed keyboard-only five-round playthrough and inspect responsive/reduced-motion behavior before demoing.

## Credits

Workshop by John Capobianco, Joksan Flores, and Elliot Conner. Adapted from the [NAF AC6 workshop materials](https://github.com/automateyournetwork/NAF_AC6) and [Networking Video Game Starter Kit](https://github.com/automateyournetwork/NetworkingVideoGameStarterKit), using [GitHub Spec Kit](https://github.com/github/spec-kit).

**Assets and dependencies:** Original hand-authored SVG character art, text, HTML, CSS, and topology; no third-party runtime dependencies.

**License:** See [LICENSE](LICENSE).
