# Quickstart and Validation: PacketJedi

## Prerequisites

- Python 3 available for the local preview server.
- An evergreen desktop browser with JavaScript modules, Fetch, SVG, and localStorage support.
- Start commands from the repository root (the directory containing `index.html`).

## Run the Game

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

On Windows, use:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000>. Do not open `index.html` through `file://`; browser modules and JSON need HTTP serving. Keep the server running during play.

## Run Browser Checks

With the same server running, open <http://127.0.0.1:8000/tests/>. The page must report discovered, passed, and failed test totals and list failed fixture IDs. Zero discovered tests is a failure.

The first three domain fixtures must be ordered as follows:

1. **Correct**: Type 1 from J1 in Area 1; select `{J1b, ABR-A1}` → exact/correct.
2. **Plausible wrong**: same challenge; select `{J1b, ABR-A1, J0}` → incorrect with an Area 0/outside-Type-1-scope explanation and RFC 2328 citation.
3. **Boundary**: Type 5 from ASBR-A2 with Area 1 stub; expected `{J0, ABR-A1, ABR-A2, J2, J2b}`; ABR-A1 receives it through Area 0, while J1/J1b do not receive it through the stub area.

Then run Type 2, Type 3, and Type 4 fixtures, invalid-content/input checks, state transitions, scoring, and storage tests. Expected test sets come from [spec.md](./spec.md#required-challenge-fixtures), independently reviewed against `references/rfc2328.txt` and `references/rfc3101.txt`.

## Manual Release Checks

1. Start a fresh run; confirm the first briefing precedes any challenge.
2. Play all five rounds. Submit a wrong set once and read its specific explanation and RFC citation before retrying.
3. Verify points, first-submission bonus, streak multiplier, negative cumulative score behavior, and Youngling for scores below 100.
4. Try empty submit, repeated router toggling, repeated submit after solve, and confirmed/cancelled restart.
5. Play all core actions with keyboard only; verify visible focus, announced result/status, router selected state, and text topology.
6. Check a narrow viewport and reduced-motion preference.
7. Reload after completing a run and confirm the top-five board persists. Exercise an injected storage adapter that throws on reads and writes; gameplay must continue with a status message.
8. If publishing under a repository subpath, verify each data, script, stylesheet, and test resource loads from that path.

Record each result as pass/fail/not run with date, browser/environment, and evidence in the root README or a linked verification note. This document specifies checks; it does not claim that implementation checks have already run.
