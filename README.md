# IISC Exam Master — offline study app

A complete, offline-first study platform for the IISc Administrative Assistant exam.
No login, no internet, no backend — all your progress stays on your device.

## How to open it (two ways)

**Easiest — just double-click:**
- Open `index.html` in Chrome/Edge/Firefox. Everything works offline immediately.

**Best experience (enables "install as app" / PWA + offline caching):**
- Serve the folder over a local server, then open the address it prints:
  ```
  python -m http.server 8010 --directory "C:\Users\fairo\Downloads\IISC\IISC_Exam_Master"
  ```
  Then visit `http://localhost:8010` in your browser. In Chrome you can then
  "Install" it as an app from the address-bar icon.

## What's inside
- **Dashboard** — exam countdown, completion %, accuracy, streak, weak/strong topics, recommended next, today's goal.
- **Study** — beginner notes + ranked sources (YouTube/websites/books/free PDFs) per subject.
- **Practice** — verified MCQs, sorted most-important first, with filters (difficulty, importance, status, "repeated in").
- **Previous Year** — honest status (no official IISc papers) + cross-exam overlap table + genuine SSC sources.
- **Predictions** — highest-probability questions with confidence + reasoning.
- **Formula Sheets** — printable (click Print / Save as PDF).
- **Bookmarks / Notes** — saved on device; notes auto-save.
- **Revision** — 30/15/5/1-minute layers + last-minute facts.
- **Mock Tests** — timed, mixed or per-subject, instant result with −0.33 negative marking + section analysis.
- **Progress** — charts, streak, accuracy, weak topics.
- **Settings** — exam date, daily goal, theme, export (bookmarked/incorrect), reset.

## Keyboard shortcuts
- `T` — toggle dark/light theme
- `/` — focus search

## Content honesty
Every item is tagged **OFFICIAL** (from IISc PDFs), **RECONSTRUCTED** (SSC-pattern, since the
IISc syllabus is identical to SSC CGL/CHSL), or **PREDICTION**. There are **no** public IISc
previous papers — nothing here is presented as one. Current-affairs questions are dated
Jan–Jun 2026 and flagged to verify closer to the exam.

## Editing / adding questions
Questions live in `data/questions/*.js` as plain arrays — open any file and copy an existing
entry to add your own. Format: `{id, topic, q, options[4], answer(0-3), exp, diff, imp(1-5), tags[], src}`.
