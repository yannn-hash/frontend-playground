# Arsitektur

React + TypeScript + Vite; browser-local, static output `dist`. Katalog memakai metadata ringan; arena dan materi dimuat dinamis. App menjadi composition root. Tidak ada store global atau dependensi runtime server.

## Lokasi dan tanggung jawab

`app`: bootstrap, header, layout, orchestration. `features/catalog`: search/filter/drawer. `features/player`: mission controls, code editor, checks and learning feedback. `features/progress`: badges and completion. `games/<slug>`: definition, missions, immutable markup/Arena, CSS, validators and colocated tests. `platform`: iframe, workers, storage, hash navigation, logging. `shared`: contracts, UI primitives and design tokens; component styles stay next to their owning features. E2E/smoke stay in `tests`; unit tests beside modules.

App composes everything. Features may consume games, platform and shared. Games may import shared contracts/UI only. Platform and shared may not import games/features/app. ESLint restricts forbidden imports; content checker validates registry and mission completeness. Avoid catch-all utils/helpers. Explain rationale, not obvious syntax, in comments.

## Interfaces and data flow

`GameDefinition`: metadata, level, accent, learning goals, craft notes, arena HTML/CSS, missions and validator. `MissionDefinition`: id/revision/title/objective/starter/solution/hints/explanation/controls. `ValidationResult`: passed and a list of observable checks. `ProgressRecord`: schema version, completed IDs and revision-tagged drafts. Render snapshots contain computed styles and element geometry; pure game validators evaluate snapshots. State Quest evaluates returned transitions against host-owned test scenarios.

CSS preview: trusted HTML + fixed base CSS, sandboxed same-origin iframe without allow-scripts. CSS inserted as textContent, not HTML. Frame CSP forbids network and scripts. Parent reads layout at active/required viewport sizes; validation does not match source strings. Motion snapshots additionally sample prefers-reduced-motion using a controlled CSS media rewrite only for the preview's evaluation; actual iframe honors browser preference.

JS runtime: create a dedicated worker from user function text, run host scenarios, timeout and terminate at two seconds. Worker has no DOM; external network is blocked by CSP inherited from the production page (same-origin static assets remain reachable). Participant responses are validated against host expectations; only main app can grant completion. Worker is not a general-purpose security boundary: no application credentials or private data are passed to it.

CSS draft updates debounce 250ms. Navigation cancels old pending results. Store receives functional updates to avoid lost completions. Invalid saved data is ignored; unavailable storage becomes an in-memory session with a visible notice. Build identity generated after bundling.
