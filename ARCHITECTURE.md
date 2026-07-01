# IISc Master Prep Portal — Architecture & Status

Built from the 10-part master specification. This document is the **honest map** of what
is actually implemented and working versus what is scaffolded or roadmap. Nothing is faked.

## Tech decision (stated, not asked)
- **Vanilla JS + CSS, no build step, no backend.** Runs by opening `index.html` (works from `file://`) or via any static host. Chosen so it stays **offline-first, free, and instantly deployable** — matching the spec's offline requirement and your existing GitHub Pages workflow.
- **Data layer:** plain JS modules loaded via `<script>` (so it works offline with no fetch/CORS). State + progress in `localStorage`. The spec's IndexedDB/sync backend is the scale-up path (see roadmap).
- **Generic multi-exam engine:** `data/exams.js` holds an exam registry. Adding SSC/KPSC/etc = adding a config object with its own section blueprint. No engine changes needed. (Part 1 requirement.)

## Implemented & verified working (v1 of the platform)
| Spec part | Feature | Status |
|---|---|---|
| 1 | Multi-exam config registry (IISc active) | ✅ working |
| 2 | Sidebar (grouped) + top bar + **command palette (Ctrl+K)** | ✅ working |
| 2 | Theming: light/dark/system + **7 accent colors** + density | ✅ working |
| 2 | Responsive (desktop/tablet/mobile), a11y (skip link, ARIA, keyboard) | ✅ working |
| 3 | Study module: beginner notes + **ranked verified sources** per subject | ✅ working |
| 4 | Practice engine: MCQs sorted by importance, **filters** (difficulty/importance/status/tag) | ✅ working |
| 4 | **Confidence capture** per answer (feeds analytics) | ✅ working |
| 4 | **Wrong Answer Notebook** (auto-collects incorrect, grouped, retry) | ✅ working |
| 4 | Bookmarks, source tags (repeated-in / predicted) | ✅ working |
| 5 | Daily Planner (rule-based adaptive plan) + recommendations | ✅ working |
| 5 | XP, streak, achievements | ✅ working |
| 6 | Mock engine: Mixed / per-subject / **Full IISc-pattern** + timer + −0.33 marking + section analysis | ✅ working |
| 7 | Analytics: completion/accuracy by section, confidence quadrant, **rule-based insights**, readiness score, predicted score | ✅ working |
| 8 | **Flashcards + SM-2 spaced repetition** (due queue, grading, retention) | ✅ working |
| 8 | Revision layers (30/15/5/1-min) + last-minute facts | ✅ working |
| 9 | **AI Tutor — retrieval-grounded** (answers only from verified content; refuses to fabricate) + BYOK provider seam | ✅ working (local); BYOK stubbed |
| 10 | Global search (questions + glossary + formulas) | ✅ working |
| 10 | **Glossary + Abbreviation directory + Formula directory** | ✅ working |
| — | PWA (manifest + service worker), offline, export (txt/json), print-to-PDF | ✅ working |

## Honest limitations (labelled, not hidden)
- **Question bank is a verified seed (~106), not 20,000.** The spec's 20k target is a *sourcing* problem, not something to fabricate. Questions live in `data/questions/*.js` as plain arrays — trivially extendable. The architecture supports unlimited; the content grows over time via (a) authoring, (b) legally-open imports. **No question is shown without a verified answer + explanation.**
- **AI Tutor is offline retrieval-grounded.** A real cloud LLM (BYOK) needs network + a server-side proxy (browser CORS blocks direct calls). The provider abstraction is in `assets/js/ai.js`; the cloud path is a documented seam, deliberately not faked.
- **Percentile / rank** would need a cohort + backend, so they're omitted; "predicted score" and "readiness %" are computed from *your own* history and labelled as estimates.
- **No backend yet** → no cross-device sync, mentor accounts, or leaderboards. `localStorage` today; IndexedDB + optional sync is the documented scale-up.

## Roadmap (spec features not in v1)
Knowledge graph / dependency-map visualizer · full per-topic study template (3-level explanations, mind maps, diagrams) for every topic · notebooks/highlighting · 10 curated full mocks (needs bank growth) · semantic/voice/OCR search · cloud AI + provider proxy · IndexedDB migration + sync backend · mentor/institution views.

## File map
```
index.html                 app shell (sidebar, top bar, script wiring)
manifest.webmanifest        PWA manifest
service-worker.js           offline caching (http/https only)
assets/css/styles.css       design system + accent/density themes
assets/js/app.js            router + all views + state
assets/js/srs.js            SM-2 spaced-repetition engine
assets/js/palette.js        command palette (Ctrl+K)
assets/js/ai.js             AI tutor (retrieval-grounded + provider seam)
data/exams.js               generic multi-exam registry
data/content.js             study notes, sources, formulas, predictions, PYQ, revision
data/flashcards.js          flashcard decks
data/glossary.js            glossary + abbreviations
data/questions/*.js         verified MCQ bank per subject
```
