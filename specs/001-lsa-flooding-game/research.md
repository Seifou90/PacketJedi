# Research: PacketJedi OSPF LSA Flooding Game

**Date**: 2026-11-17

## Decisions

### Static browser structure

- **Decision**: Use semantic HTML, CSS, native JavaScript modules, and authored JSON challenge data. Avoid a framework, bundler, CDN, and runtime dependencies.
- **Rationale**: This matches the StarterKit constraint, keeps the workshop build understandable, and makes the game deployable as static files.
- **Alternatives considered**: A framework/bundler would add setup and runtime dependencies without helping a five-challenge game. Keeping challenge data in executable source would make content review less direct than JSON.
- **Sources**: MDN, [JavaScript modules on the web](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules/Modules_on_the_web); MDN, [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

### Relative loading and local preview

- **Decision**: Serve from the repository root over HTTP and load data/assets through relative URLs. Check the data response status before parsing; a not-found HTTP response must become a visible content-loading error.
- **Rationale**: Native modules and JSON fetch are not supported as a reliable `file://` workflow, and relative URLs allow deployment beneath a repository path.
- **Alternatives considered**: Opening `index.html` directly is unreliable for module/fetch security behavior. Leading-slash asset paths can escape a repository subpath.
- **Preview command**: `python3 -m http.server 8000 --bind 127.0.0.1`; on Windows use `py`.
- **Sources**: MDN, [Modules on the web](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules/Modules_on_the_web); MDN, [Fetch API response handling](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch); Python 3.12, [`http.server`](https://docs.python.org/3.12/library/http.server.html).

### Holomap and accessible router choices

- **Decision**: Draw the topology as a noninteractive SVG visual and provide router choices as native HTML buttons associated with it. Buttons expose `aria-pressed`; a text topology lists all areas, routers, roles, links, origin, and selected set.
- **Rationale**: Native buttons provide established keyboard activation and focus semantics; the SVG can remain a visual aid rather than a custom control surface.
- **Alternatives considered**: Interactive SVG nodes require custom keyboard/focus naming and state semantics. Text-only topology is accessible but loses the requested holomap visual metaphor.
- **Sources**: WAI-ARIA APG, [Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/); WAI, [Complex images](https://www.w3.org/WAI/tutorials/images/complex/); WCAG, [Status messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html) and [Focus visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html); MDN, [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion).

### Local top-five persistence

- **Decision**: Save a small versioned JSON leaderboard in `localStorage`, with property access, reads, parsing/validation, and writes protected by `try/catch`. Use an in-memory fallback and an accessible status message if storage is blocked, malformed, or full.
- **Rationale**: This directly meets the per-browser-only requirement without accounts or a backend. The board contains only five scores and no personal data.
- **Alternatives considered**: Server storage violates the no-backend scope. Failing the game when storage fails violates the self-contained gameplay requirement. Cross-tab synchronization is outside the requested single-run leaderboard behavior.
- **Sources**: MDN, [`Window.localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage); MDN, [Storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria); MDN, [Using the Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API).

### Domain facts and test independence

- **Decision**: Build the evaluator from the local RFC texts and fixed topology; keep expected receiver sets in independent test fixtures and optional authoring validation metadata, never as the runtime grading authority.
- **Rationale**: The evaluator must derive answers from rules while tests independently catch errors. Content validation must prevent unsupported or inconsistent challenges from reaching play.
- **Alternatives considered**: A hard-coded answer-key-only quiz risks silently contradicting the RFC rules and violates Constitution C1/C6.
- **Local source basis**: `references/rfc2328.txt`, §§3.6, 12.4.1–12.4.4, 13, and 13.3; `references/rfc3101.txt`, §§1.3, 2.3, and 3.2. RFC 2328 §12.4.1 says Router-LSAs are flooded throughout their particular area; §§12.4.2–12.4.3 define Network/Summary LSA origination and scope; §12.4.4 defines AS-external LSA AS-wide scope and stub-area exclusion. Type 4 is not originated into stub areas (§12.4.3.1). RFC 3101's Type 7/NSSA behavior is excluded.

## Alternatives and contradictions resolved

- The StarterKit plan permits JavaScript data or JSON; JSON is selected for direct content review and validation.
- The StarterKit's review fixture sets are retained as independent checks, not allowed to override domain evaluation.
- The constitution requires `localStorage` and `try/catch`; this explicit product constraint takes precedence over the specification checklist's generic warning about API details. The checklist exception remains documented.
- The clarified specification permits negative run scores. Rank Youngling covers all scores below 100; no score floor will be added.
- The Spec Kit setup output used the feature directory name as a branch fallback, while `git branch --show-current` is `main`. The plan records the actual Git branch and lists the feature directory separately.

## Open research questions

None. Protocol and platform choices are specified sufficiently for implementation planning.
