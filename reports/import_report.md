# Import Report — Local PDFs/TXT

_Generated 2026-07-01 · source folder: `Downloads/IISC/PDF'ss`_

## Step 1 — Files found (recursive scan)

| File | Pages | Size | Status | Notes |
|---|---|---|---|---|
| IISC Administrative Assistant Important questions.txt | — | 30 KB | PARSED | 80 MCQs w/ answer key + solutions — imported |
| COMPUTER AWARENESS.pdf | 63 | 1.1 MB | PARSED (no answer key) | MCQs but NO answer key — cannot verify answers → not imported |
| Quantitative Aptitude.pdf | 10 | 42 KB | PARSED (no answer key) | Blank test paper, garbled math layout, no answers → not imported |
| Verbal Ability_.pdf | 7 | 66 KB | PARSED (no answer key) | Sample test, no answer key → not imported |
| General Awareness.pdf | 16 | 351 KB | IMAGE/SCANNED | Only 316 chars extracted → needs OCR → not imported |
| General Awareness_OCR.pdf | 16 | 1.0 MB | OCR — POOR QUALITY | Bilingual (Hindi/English) scanned OMR booklet, 75 Qs; OCR text garbled + NO answer key (OMR) → not imported (needs manual transcription) |
| ilide...iisc question paper 2018.pdf | 9 | 6.1 MB | IMAGE/SCANNED | Only page headers extracted → needs OCR → not imported |

**Only the TXT yielded verifiable Q&A** (it ships an answer key + worked solutions). The other PDFs are either scanned images (need OCR) or blank test papers with no answer key, so nothing was fabricated from them.

## Step 15 — Import summary

| Metric | Count |
|---|---|
| Questions parsed | 80 |
| Imported (structurally valid) | 75 |
| **Published** (verified from source key+solution) | **69** |
| **Pending Verification** (current affairs — unverifiable) | **6** |
| Needs manual fix (broken extraction) | 5 |
| Rejected | 0 |

### Coverage by subject (imported)

| Subject | Imported |
|---|---|
| quantitative | 15 |
| verbal | 16 |
| reasoning | 18 |
| general_awareness | 16 |
| computer | 10 |

### Pending Verification (held back — I cannot confirm these)
Questions 65-70 are 2026 current affairs (RBI Mission SAKSHAM, SEBI PaRRVA, E-PRAAPTI, ECL framework, biometric payments, expressway) — beyond my knowledge cutoff, so they are **not published** until verified.

### Needs manual fix
- Q7: incomplete extraction (options/answer)
- Q35: incomplete extraction (options/answer)
- Q41: incomplete extraction (options/answer)
- Q47: incomplete extraction (options/answer)
- Q53: incomplete extraction (options/answer)

## Honesty notes
- Source label is **"Verified Competitive Question"** — a competitive bank with answer key + solutions. **Not** claimed as an official IISc Previous-Year paper.
- Some Quant items (e.g. exponent/fraction questions) lost superscript/layout formatting during text extraction — flagged for review.
- Duplicate detection against the existing bank runs at compile time (`build_questions.js`); any overlaps are dropped there.
- File hashes recorded in `content/imports/_source_hashes.json` so unchanged files aren't re-imported.
