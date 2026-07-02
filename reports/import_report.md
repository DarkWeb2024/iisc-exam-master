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


---

# Import Report — 6000 MCQ Bank (2026-07-02)

_Source: `IISC Administrative Assistant In English 6000 MCQ.pdf` (2,140 pages, Toppersexam.com bank with answer key)_

| Metric | Count |
|---|---|
| Question blocks detected | 5986 |
| Structurally valid | 5439 |
| Broken extraction (skipped, not guessed) | 547 |
| Duplicates inside the bank (merged; importance boosted) | 13 |
| Unique imported | 5426 |
| **Published** | **5223** |
| Pending verification (time-sensitive/current-affairs) | 203 |
| With worked solution from source | 1415 |

### Coverage by subject

| Subject | Imported |
|---|---|
| computer | 876 |
| general_awareness | 3212 |
| quantitative | 786 |
| reasoning | 399 |
| verbal | 153 |

### Verification statement
Answers come from the **source's own answer key** (plus 1415 worked solutions). Automated checks enforced: contiguous distinct options (4 or 5), answer within options, non-trivial stems. A manual sample audit was performed on import. Labelled **Verified Competitive Question** — NOT previous-year papers.

### Also in folder (still not importable)
- `ilide..._OCR.pdf` (2018 paper): OCR ok but **no answer key** (OMR booklet) → cannot publish answers.
- `General Awareness_OCR.pdf`: bilingual OMR booklet, garbled OCR, **no key** → not imported.


---

# Import Report — 6000 MCQ Bank (2026-07-02)

_Source: `IISC Administrative Assistant In English 6000 MCQ.pdf` (2,140 pages, Toppersexam.com bank with answer key)_

| Metric | Count |
|---|---|
| Question blocks detected | 5986 |
| Structurally valid | 5439 |
| Broken extraction (skipped, not guessed) | 547 |
| Premise lost (refers to 'above arrangement/passage' — skipped) | 77 |
| Duplicates inside the bank (merged; importance boosted) | 13 |
| Unique imported | 5349 |
| **Published** | **5146** |
| Pending verification (time-sensitive/current-affairs) | 203 |
| With worked solution from source | 1402 |

### Coverage by subject

| Subject | Imported |
|---|---|
| computer | 862 |
| general_awareness | 2697 |
| quantitative | 756 |
| reasoning | 327 |
| verbal | 707 |

### Verification statement
Answers come from the **source's own answer key** (plus 1402 worked solutions). Automated checks enforced: contiguous distinct options (4 or 5), answer within options, non-trivial stems. A manual sample audit was performed on import. Labelled **Verified Competitive Question** — NOT previous-year papers.

### Also in folder (still not importable)
- `ilide..._OCR.pdf` (2018 paper): OCR ok but **no answer key** (OMR booklet) → cannot publish answers.
- `General Awareness_OCR.pdf`: bilingual OMR booklet, garbled OCR, **no key** → not imported.


---

# Import Report — 6000 MCQ Bank (2026-07-02)

_Source: `IISC Administrative Assistant In English 6000 MCQ.pdf` (2,140 pages, Toppersexam.com bank with answer key)_

| Metric | Count |
|---|---|
| Question blocks detected | 5986 |
| Structurally valid | 5439 |
| Broken extraction (skipped, not guessed) | 547 |
| Premise lost (refers to 'above arrangement/passage' — skipped) | 97 |
| Duplicates inside the bank (merged; importance boosted) | 13 |
| Unique imported | 5329 |
| **Published** | **5126** |
| Pending verification (time-sensitive/current-affairs) | 203 |
| With worked solution from source | 1397 |

### Coverage by subject

| Subject | Imported |
|---|---|
| computer | 862 |
| general_awareness | 2693 |
| quantitative | 756 |
| reasoning | 311 |
| verbal | 707 |

### Verification statement
Answers come from the **source's own answer key** (plus 1397 worked solutions). Automated checks enforced: contiguous distinct options (4 or 5), answer within options, non-trivial stems. A manual sample audit was performed on import. Labelled **Verified Competitive Question** — NOT previous-year papers.

### Also in folder (still not importable)
- `ilide..._OCR.pdf` (2018 paper): OCR ok but **no answer key** (OMR booklet) → cannot publish answers.
- `General Awareness_OCR.pdf`: bilingual OMR booklet, garbled OCR, **no key** → not imported.
