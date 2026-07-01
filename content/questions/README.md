# Question Bank — Pipeline & Schema

This folder is the **source of truth** for every question. The app never hardcodes
questions in JS; it reads auto-generated bundles compiled from these JSON files.

## How it works (generate → validate → deduplicate → import → index)
```
content/questions/<subject>/<topic>.json     <- you edit these (source of truth)
        │
        ▼   node tools/build_questions.js     <- THE QUALITY GATE
        │     • validates schema on every question
        │     • blocks exact duplicates (stem + options)
        │     • enforces the checklist; rejects anything failing
        │     • writes content/questions/PROGRESS.md
        ▼
data/questions/<subject>.js                   <- AUTO-GENERATED bundles the app loads
```
Subjects (folders): `quant`, `verbal`, `reasoning`, `gk`, `computer`.

## Question schema (every field)
```json
{
  "id": "unique-id",
  "subject": "computer", "section": "computer",
  "topic": "Memory", "subtopic": "RAM",
  "difficulty": "Easy|Medium|Hard|Expert",
  "question": "…?",
  "options": ["A","B","C","D"],      // exactly 4, all distinct
  "answer": 1,                        // index 0-3 of the correct option
  "explanation": "why the answer is correct",
  "whyWrong": [],                     // optional per-option rationale
  "memoryTrick": "", "shortcut": "",
  "solveTimeSec": 30,
  "importance": 4,                    // 1-5 (★)
  "repeated": "Repeated Frequently | Occasionally Asked | Rarely Asked | Expected Question",
  "sourceType": "Verified Model Question",   // see labels below — NEVER fake a PYQ
  "examName": null, "year": null,
  "tags": ["IISc","Memory"], "keywords": ["ram","memory"],
  "verificationStatus": "verified|unverified",
  "explanationComplete": true,
  "createdDate": "2026-07-01", "lastVerified": "2026-07-01",
  "version": 1, "language": "en"
}
```

## Source labels (mandatory, never empty, never false)
`Verified Previous Year Question` · `Repeated Previous Year Question` ·
`Verified Competitive Question` · `Standard Textbook Question` ·
`Verified Model Question` · `AI Generated (Verified)`

Everything currently in the bank is **`Verified Model Question`** — authored and
answer-checked, but NOT claimed to be a real IISc previous-year paper (none are public).

## The honest path from 148 → 5,000
The quality bar (verified, no hallucinated answers, no duplicates) means volume comes
from **legitimate sources fed through the gate**, not mass AI generation:

1. **Author in batches** — add compact entries to `tools/add_expansion.js` (or new JSON
   files), each answer checked, then `node tools/build_questions.js`. Sustainable, verified.
2. **Import a licensed / self-owned dataset** —
   `node tools/import_dataset.js my_questions.json --source "Standard Textbook Question"`.
   Imported items are marked `unverified` until reviewed, so nothing unchecked is trusted.
3. **Official open sources** — e.g. SSC official papers you are permitted to use, NCERT
   exemplar problems. Convert to the input format, import, verify.

> Deliberately NOT done: generating thousands of questions from memory and labelling them
> "verified". That would inject wrong answers and near-duplicates — exactly what the spec
> forbids. The gate exists to make that impossible.

## Commands
```
node tools/migrate.js          # one-time: legacy JS questions -> structured JSON
node tools/add_expansion.js    # author more verified questions (compact form)
node tools/import_dataset.js X # import a licensed/owned dataset (validated + deduped)
node tools/build_questions.js  # THE GATE: validate + dedup + compile + progress report
```
See `PROGRESS.md` (auto-generated) for the current count toward 5,000.
