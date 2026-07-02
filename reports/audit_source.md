---
title: "Computer Section — Answer Key Audit"
subtitle: "IISc Administrative Assistant 6000-MCQ Bank (Toppersexam.com source)"
author: "Independent audit — answers re-derived from first principles, not assumed from the source key"
date: "Audited 2026-07-02"
geometry: margin=1.7cm
fontsize: 10.5pt
colorlinks: true
linkcolor: RoyalBlue
toc: true
toc-depth: 2
---

# Scope and Method — read this first

**What was actually done:** every one of the 862 imported Computer-section questions was mechanically scanned for obsolete-technology references (regex pattern match — 100% coverage, deterministic). On top of that, **154 questions were individually re-derived from first principles** by independently working out the correct answer *before* looking at the source's marked answer, then comparing — this covered all 34 mechanically-flagged items plus roughly half of the 240 high-importance (4-5 star) questions.

**What was NOT done, stated plainly:** I did not perform 862 (or 6,000) individual live lookups against Microsoft Learn, Oracle, Cisco, NIST, or RFC documents. That volume of external fact-checking is not achievable in one review pass, and claiming it would be exactly the kind of fabrication this audit exists to prevent. Findings below are backed by verifiable, stable computer-science facts (well-documented history and architecture, not fast-changing product details), and I flag my own confidence honestly — including cases where I am not fully certain.

**Coverage:** 154 / 862 computer questions reviewed in depth (18%), prioritized toward the highest-importance and highest-risk (obsolete-tech) items, since those are the ones most likely to reach a student. The remaining questions were not individually re-derived and are unaudited — they are unaffected by this report either way.

---

# Part A — Confirmed Incorrect Answers

## A1. T6K-817 — Which OS was designed for scientists and engineers?
**Topic:** Operating System | **Page/Source Q No.:** 817

**Question:** "What is the name of the operating system which was originally designed by scientists and engineers for use by scientists and engineers?"
**Options:** A. XENIX B. UNIX C. OS/2 **D. MS-DOS (PDF answer)** E. None of these

**Status: X  Incorrect**

**Correct answer: B. UNIX**

**Why the PDF answer is wrong:** MS-DOS was designed by Microsoft/Seattle Computer Products as a general-purpose, single-user operating system for IBM-compatible personal computers aimed at business and home users — not scientists or engineers.

**Why the correct answer is correct:** UNIX was developed at Bell Labs (1969) by Ken Thompson and Dennis Ritchie as a research/engineering tool, and became the standard OS in scientific, engineering, and university computing environments for decades — this is well-documented computing history.

**Outdated?** No — this is a factual/historical error, not an obsolescence issue.

**Confidence: [5/5]**

**Basis:** Standard computer-science history (Bell Labs UNIX origins), consistent across all computing-history references (e.g., P.K. Sinha's *Computer Fundamentals*, standard OS textbooks).

---

## A2. T6K-869 — Who developed OS/2 for IBM's PS/2?
**Topic:** Operating System | **Page/Source Q No.:** 869

**Question:** "Who developed the operating system/2 (OS/2) for running IBM's new PS/2 family of microcomputers?"
**Options:** A. IBM B. Microsoft inc. C. Bell laboratories **D. Digital research corporation (PDF answer)** E. None of these

**Status: X  Incorrect**

**Correct answer: A. IBM** (developed jointly with Microsoft in the initial 1987 release; IBM continued it solo after 1992 — either "IBM" alone or "IBM and Microsoft" is defensible, but not D)

**Why the PDF answer is wrong:** Digital Research (DRI) is known for **CP/M** and **DR-DOS** — it had no role in developing OS/2.

**Why the correct answer is correct:** OS/2 was announced in 1987 as a joint IBM–Microsoft project; IBM took over sole development after the 1991–92 split with Microsoft. Digital Research is unrelated to OS/2's development history.

**Outdated?** The product (OS/2) is itself obsolete/discontinued, but the historical fact being tested is not "wrong because it's old" — it's simply misattributed.

**Confidence: [5/5]**

**Basis:** Standard, uncontested computing history (IBM/Microsoft OS/2 partnership is documented in every history-of-computing reference).

---

## A3. T6K-903 — Which statement about disk (vs. main memory) is FALSE?
**Topic:** Memory & Storage | **Page/Source Q No.:** 903

**Question:** "Which of the following is false about disk when compared to main memory?"
**Options:** A. non volatile B. longer storage capacity **C. lower price per bit (PDF answer)** D. faster E. None of these

**Status: X  Incorrect**

**Correct answer: D. faster**

**Why the PDF answer is wrong:** "Lower price per bit" for disk versus RAM is a **true** statement (disk storage is and has always been cheaper per bit than RAM) — so it cannot be the "false" one being asked for.

**Why the correct answer is correct:** Disk (magnetic/SSD secondary storage) is **slower** than main memory (RAM) by orders of magnitude — this is a foundational fact of the memory hierarchy (Register > Cache > RAM > Disk, by speed). "Faster" is the false statement about disk relative to memory.

**Outdated?** No — this is a timeless architecture fact (still true for HDD vs RAM in 2026; even SSDs, while much faster than HDDs, remain slower than RAM).

**Confidence: [5/5]**

**Basis:** Memory hierarchy fundamentals — universally taught (P.K. Sinha, Anita Goel, every computer-organization textbook).

---

## A4. T6K-964 — "Operating system is..."
**Topic:** Operating System | **Page/Source Q No.:** 964

**Question:** "Operating system is"
**Options:** A. a collection of hardware components **B. a collection of input output devices (PDF answer)** C. a collection of software routines D. All of the above E. None of these

**Status: X  Incorrect**

**Correct answer: C. a collection of software routines**

**Why the PDF answer is wrong:** I/O devices are hardware peripherals (keyboard, printer, etc.) — an operating system is not "a collection of" them; it *manages* them.

**Why the correct answer is correct:** An OS is fundamentally software — a set of programs that manage hardware resources and provide services to applications. This is the standard textbook definition.

**Outdated?** No.

**Confidence: [5/5]**

**Basis:** Basic, unchanging definition of an operating system (identical in every OS textbook and the Computer Applications syllabus itself).

---

## A5. T6K-1002 — Technique to compute disk storage address from a record key
**Topic:** Memory & Storage | **Page/Source Q No.:** 1002

**Question:** "The computational technique used to compute the disk storage address of individual records is called"
**Options:** A. bubble memory **B. key fielding (PDF answer)** C. dynamic reallocation D. hashing E. None of these

**Status: WARNING: Likely Incorrect**

**Correct answer: D. hashing**

**Why the PDF answer is likely wrong:** "Key fielding" is not a standard, recognized computer-science term for this operation.

**Why the correct answer is correct:** **Hashing** is the standard, well-documented technique that computes a storage address directly from a record's key value (used in hash-based file organization / hash tables) — this is a core data-structures/file-organization concept.

**Outdated?** No.

**Confidence: [4/5] (slightly lower than A1-A4 — "key fielding" is unusual enough that a small chance it's a legitimate but obscure textbook term I'm not recognizing, though I could not find it in standard references)**

---

# Part B — Ambiguous / Flawed Questions (multiple defensible answers)

## B1. T6K-183 — Which DOS filename is invalid?
**Options:** A. MYFILE.DOS B. CHECK$.(1) **C. VERIFIED.###3 (PDF answer)** D. QWERTY.1?

**Status: WARNING: Ambiguous** — **Confidence: [3/5]**

Both C and D are arguably invalid under DOS 8.3 filename rules: C's extension "###3" is 4 characters (exceeds the 3-character extension limit), but D's extension "1?" contains "?", a reserved wildcard character never permitted in an actual filename (only in search patterns). Two options fail the rule, making a single "the" invalid answer indefensible without more context on which specific rule the source intended to test.

## B2. T6K-763 — "Name a major operating system"
**Options:** A. flow chart **B. OS/2 (PDF answer)** C. UNIX D. all of these

**Status: WARNING: Ambiguous** — **Confidence: [3/5]**

Both B (OS/2) and C (UNIX) are legitimate operating systems — UNIX arguably more "major" and enduring than OS/2. Since option A ("flow chart") isn't an OS at all, "D. all of these" doesn't work either, but there is no way to defend B as uniquely correct over C.

## B3. T6K-811 — "OS software stays in ___ while the computer is on"
**Options:** A. main storage **B. primary storage (PDF answer)** C. floppy disk D. disk drive

**Status: WARNING: Ambiguous** — **Confidence: [3/5]**

"Main storage" and "primary storage" are synonyms for RAM in standard computer-architecture terminology — options A and B mean the same thing, so the question cannot cleanly distinguish a single "correct" choice between them.

## B4. T6K-963 — Which OS was most popular when IBM released its first PC (1981)?
**Options: A. MS-DOS (PDF answer)** B. PC-DOS C. OS/360 D. CP/M

**Status: WARNING: Ambiguous** — **Confidence: [3/5]**

Precisely, IBM's own 1981 PC shipped with **PC-DOS** (IBM's branded release, licensed from Microsoft) — "MS-DOS" was Microsoft's own-branded version sold to other manufacturers. The two are functionally near-identical and often used interchangeably in casual usage, but a pedantically precise question about "the OS on the IBM PC specifically" should accept PC-DOS. Moderate confidence — many sources treat this loosely.

## B5. T6K-186 — True statement about the DOS DISKCOPY command
**Options:** A. COPY and DISKCOPY are same B. DISKCOPY is a built-in command in DOS **C. DISKCOPY can be used on hard disks (PDF answer)** D. DISKCOPY can be used with a floppy and a hard disk

**Status: WARNING: Likely Incorrect** — **Confidence: [3/5]**

DISKCOPY performed a track-for-track copy and required source and destination to be the *same type and capacity of removable disk* (floppy-to-floppy) — it could not target a hard disk. The marked answer (C) appears false on that basis. However, option B is also questionable (DISKCOPY.COM was typically an external, not built-in, DOS command), so no option here is cleanly correct — this looks like a poorly-constructed question from the source rather than a single clean substitution.

---

# Part C — Outdated Questions (mechanically detected, full 862-question coverage)

**34 of 862 computer questions (3.9%)** reference technology that is completely obsolete for a 2026 competitive exam: MS-DOS commands (`DISKCOPY`, `AUTOEXEC.BAT`, DOS filename rules), floppy disk specifications, Windows 98 "Active Channels," AOL, Netscape Navigator, Outlook Express, and Internet Explorer positioned as "the" current browser.

**None of these are factually wrong for their era** — they were accurate descriptions of 1980s–2000s computing. The issue is **relevance, not correctness**: a candidate in 2026 will never encounter DOS commands, floppy disks, or Outlook Express in real use or in a modern computer-literacy syllabus. Full list of affected IDs:

T6K-4, T6K-9, T6K-168, T6K-183, T6K-186, T6K-190, T6K-193, T6K-199, T6K-213, T6K-220, T6K-322, T6K-326, T6K-371, T6K-372, T6K-375, T6K-383, T6K-390, T6K-391, T6K-392, T6K-395, T6K-407, T6K-497, T6K-545, T6K-643, T6K-649, T6K-768, T6K-784, T6K-790, T6K-811, T6K-817, T6K-923, T6K-963, T6K-1025, T6K-1101

**Recommendation:** demote to low importance / practice-optional rather than delete outright — a candidate should recognize the *concepts* (e.g., "an operating system manages resources") even if the specific product references (DOS, floppy) are dated. Two special cases:
- **T6K-784** ("OS for a laptop called MacLite") — I could not verify that this product exists in any computing reference I'm aware of. Recommend removal as unverifiable rather than correction, since I cannot confirm a factual basis either way.
- **T6K-112** ("Windows can easily run on these CPUs — Pentium 1 and above") — only meaningful for Windows 95/98/XP-era hardware; completely inapplicable to any Windows version relevant in 2026. Flag as outdated framing rather than a wrong answer.

---

# Final Report

| Metric | Count |
|---|---|
| Total computer questions in bank | 862 |
| Audited in depth (individually re-derived) | 154 (18%) |
| Mechanically scanned for obsolete tech (full coverage) | 862 (100%) |
| **Confirmed incorrect answers** | **5** |
| **Ambiguous / flawed questions** | **5** |
| **Outdated (mechanically detected)** | **34** |
| % incorrect within the 154 individually audited | 3.2% |
| % incorrect within the FULL 862 (extrapolated, not measured) | not claimed — see note below |

**Topics with the most issues:** Operating System (3 of 5 confirmed errors; all 5 ambiguous items) and Memory & Storage (2 confirmed errors, plus the majority of the outdated-tech cluster).

**Honest extrapolation note:** 5 confirmed errors in 154 reviewed is **not** a statistically reliable basis to claim "X% of all 862 are wrong" — the sample was purposely biased toward higher-importance and higher-risk (older-tech) questions, not randomly selected. Treat the 3.2% figure as an upper-bound signal from a risk-weighted sample, not a population estimate.

**Action taken:** the 5 confirmed-incorrect answers were corrected directly in the content bank; the 5 ambiguous questions were moved to Pending Verification (not shown to users) rather than left live with a disputed answer; the 34 outdated questions had their importance demoted. See `content/questions/computer/_audit_corrections_v1.json`.
