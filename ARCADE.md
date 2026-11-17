---
arcade_version: 1

game:
  title: "PacketJedi"
  slug: "packetjedi"
  tagline: "Trace OSPF LSAs to every router in scope."
  summary: "Players select every router that receives each OSPF LSA in a fictional three-area topology. Five rounds teach area scope, ABR summaries, and Type 5 flooding around a stub area, with RFC-cited feedback after answers."
  topics: [OSPF, OSPFv2, LSA flooding, stub areas]
  category: "routing"
  skill_level: "beginner"
  play_minutes: 10
  levels: 3
  card_image: ""
  card_image_alt: ""
  repo: ""
  repo_path: ""
  license: "Apache-2.0"

creator:
  name: "Seif Allaoua"
  github: "Seifou90"
  location: ""
  organization: ""
  links: []
  first_spec_project: true
  workshop: "NAF AC6"
  consent_to_publish: false

build:
  started: "2026-11-17"
  finished: "2026-11-17"
  wall_time: "unknown"
  spec_driven:
    framework: "GitHub Spec Kit"
    framework_version: "1.4.3.dev0"
    artifacts: [constitution, spec, clarify, plan, tasks, checklists, research, data-model, quickstart, game-ui-contract]
    task_count: 28
    loops_or_phases: 6
  model: "unknown"
  helper_models: []
  harness: "Codex CLI"
  harness_version: "0.169.0"
  mcp_servers: [Node REPL MCP, CUA REPL MCP]
  rag_and_sources: [StarterKit/LAB_README.md, references/rfc2328.txt, references/rfc3101.txt]
  skills_and_plugins: [speckit-constitution, speckit-specify, speckit-clarify, speckit-plan, speckit-tasks, speckit-analyze, speckit-implement, unified-computer-use]
  other_tools: [Python 3.15, curl, Git, Node REPL, specify CLI]
  human_prompts: 11
  usage:
    input_tokens: unknown
    output_tokens: unknown
    cost_note: "unknown"
  ai_generated_assets: [Five hand-authored SVG character illustrations; no image generator used]

runtime:
  kind: "static-web"
  stack: [HTML, CSS, JavaScript ES modules, JSON, SVG]
  start: "python3 -m http.server 8000 --bind 127.0.0.1"
  url_after_start: "http://127.0.0.1:8000/"
  hosted_url: ""
  static_root: "."
  requires_install: false
  requires_network: false
  requires_api_key: false
  uses_ai_at_runtime: false
  browsers: []
  accessibility: "Keyboard controls, visible focus, aria-pressed selection, live status text, a text topology, responsive layout, and reduced-motion styling are implemented. Browser and screen-reader accessibility checks were not run."
  save_state: "Active run is in memory; the top-five leaderboard uses per-browser localStorage with a try/catch fallback."

verification:
  tests: "Node REPL execution of the registered test modules (no repository Node test command); browser suite is available at /tests/ after starting the preview server."
  tests_passing: 22
  facts_sourced_from: [references/rfc2328.txt, references/rfc3101.txt]
  known_limits: ["The topology is fictional and does not model packet-level flooding, acknowledgements, retransmission, or route calculation.", "NSSA and Type 7 behavior are excluded.", "The LSA originator is excluded from selectable receivers by game convention.", "Browser playthrough, accessibility behavior, and repository-subpath hosting remain unverified."]
---

## In one paragraph

PacketJedi is a static browser game for people learning OSPF. In each round, the player sees an LSA type, its origin, and a fictional topology, then selects every router that receives it. The five rounds progress from area-local LSAs to ABR summaries and Type 5 flooding with a stub area. Wrong answers identify extra or missing routers and show the relevant RFC 2328 section.

## How it was built

The work followed the workshop sequence: constitution, specification, clarification, plan, tasks, analysis, and implementation. The project records its constitution and feature artifacts under `.specify/` and `specs/001-lsa-flooding-game/`; the clarification allows negative scores and assigns Youngling to every score below 100. Implementation keeps receiver evaluation separate from scoring, run state, and local leaderboard storage. During RFC review, section references needed correction: §12.1.3 identifies the LS type field, Advertising Router is §12.1.5, Type 4 is covered under §12.4.3, and Type 5 under §12.4.4. The content validator also initially rejected periods in RFC section IDs; its ID pattern was updated to accept them. The documented preview command returned HTTP 200, and 22 domain, state, scoring, and leaderboard checks passed in the Node REPL. Browser automation was unavailable, so the browser suite and manual accessibility checks remain unverified. The next builder should run `/tests/` in a browser and complete tasks T024, T026, and T027 before claiming the release is ready to demo.

## What we'd tell the next builder

- Keep the first three independent fixtures ordered as correct, plausible wrong, and Type 5 stub boundary.
- Run the browser suite and manual keyboard, screen-reader, narrow-width, reduced-motion, and subpath checks; these have not been verified yet.
- Keep scoring out of the receiver evaluator, and retain tests for storage failures and equal-score ordering.
