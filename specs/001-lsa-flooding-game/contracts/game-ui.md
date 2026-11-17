# Game UI Contract

This is the player-facing interaction contract. PacketJedi has no backend, public API, or external service contract.

## Core Flow

1. Show a briefing, the LSA character, and a worked example before the first challenge.
2. Show the active level, LSA type, origin, area or AS-wide scope, and the fictional topology.
3. Let the player toggle router choices and submit the selected set.
4. On an empty submit, show guidance without counting an attempt or changing score.
5. On an incorrect non-empty submit, show extra/missing routers, the misconception, and RFC citation; allow retry.
6. On an exact set, show why the selected routers receive the LSA and enable Next.
7. After the last challenge, show run summary, rank, assistance, and the local top-five board.

## Router Choice Controls

- Router choices are native HTML buttons associated with the SVG holomap, not custom SVG-only controls.
- Each button has a stable accessible name including router ID and role/area, plus a selected state exposed through `aria-pressed`.
- Standard keyboard activation (Space/Enter) toggles a choice. Focus remains visible.
- Selected state is communicated with text/semantics and visual styling, not color alone.
- BGP-X is labeled as an external BGP peer and is not presented as an OSPF receiver choice.

## Status, Feedback, and Focus

- Correct, incorrect, input guidance, content error, and storage fallback are available as text.
- Feedback updates a polite status/live region without requiring focus to move.
- After Next or Restart, focus moves to the new briefing/challenge heading. On wrong feedback, keep focus predictable and leave router choices available for retry.
- Every wrong choice names the chosen router or omitted receiver, the relevant area/type rule, and its RFC 2328 section.

## Topology Alternative and Responsive Behavior

Provide a visible text equivalent listing Areas 0/1/2; each router's ID, role, and area membership; relevant adjacency/transit-LAN membership; LSA origin/scope; and selected/correct receivers after evaluation. SVG animation is decorative only. Reduced-motion preference removes or minimizes animation without removing meaning. At narrow widths, topology may scroll within a labeled region, but selection, submit, feedback, and Next remain reachable.

## Session Controls

- Formula for router points, perfect-round bonus, streak multiplier, and rank bands is shown before play.
- Hint use is optional, method-focused, and recorded separately from attempts and score.
- Restart asks for confirmation. Confirm resets run state; cancel preserves it. Saved leaderboard entries are retained.
- Storage unavailable status clarifies that the current game remains playable but the leaderboard will not persist.
