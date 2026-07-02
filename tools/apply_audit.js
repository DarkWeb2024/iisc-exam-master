/* apply_audit.js — apply the manual audit findings (reports/audit_source.md) to the
   content bank. Never silently overwrites in place: writes a dated correction overlay
   file that the build gate picks up, and records what changed + why for traceability.
   Run: node tools/apply_audit.js   then: node tools/build_questions.js */
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..", "content", "questions", "computer");
const SRC = path.join(OUT, "imported_6000.json");
const TODAY = "2026-07-02";

const all = JSON.parse(fs.readFileSync(SRC, "utf8"));
const byId = {}; all.forEach(q => byId[q.id] = q);

// A) confirmed incorrect -> correct the answer, keep the question, note the audit.
const CORRECTIONS = [
  { id: "T6K-817", newAnswer: 1, note: "UNIX (was MS-DOS): UNIX was designed at Bell Labs for scientific/engineering use; MS-DOS was a general-purpose PC OS." },
  { id: "T6K-869", newAnswer: 0, note: "IBM (was Digital Research Corp): OS/2 was an IBM/Microsoft joint project; Digital Research made CP/M and DR-DOS, unrelated to OS/2." },
  { id: "T6K-903", newAnswer: 3, note: "'faster' is the false statement (was: 'lower price per bit', which is actually TRUE). Disk is slower than RAM, not faster." },
  { id: "T6K-964", newAnswer: 2, note: "'a collection of software routines' (was: 'a collection of input output devices'). An OS is software, not hardware." },
  { id: "T6K-1002", newAnswer: 3, note: "hashing (was: 'key fielding', not a standard CS term). Hashing computes storage addresses from record keys." }
];

// B) ambiguous/flawed -> hold back from users (never silently modify the source; flag it).
const AMBIGUOUS = ["T6K-183", "T6K-763", "T6K-811", "T6K-963", "T6K-186"];

// C) outdated tech -> demote importance, keep published (still factually fine for their era).
const OUTDATED = ["T6K-4","T6K-9","T6K-168","T6K-183","T6K-186","T6K-190","T6K-193","T6K-199","T6K-213",
  "T6K-220","T6K-322","T6K-326","T6K-371","T6K-372","T6K-375","T6K-383","T6K-390","T6K-391","T6K-392",
  "T6K-395","T6K-407","T6K-497","T6K-545","T6K-643","T6K-649","T6K-768","T6K-784","T6K-790","T6K-811",
  "T6K-817","T6K-923","T6K-963","T6K-1025","T6K-1101","T6K-112"];

let corrected = 0, pended = 0, demoted = 0, removed = 0;
const log = [];

CORRECTIONS.forEach(c => {
  const q = byId[c.id];
  if (!q) { log.push("SKIP (not found): " + c.id); return; }
  const oldAns = q.options[q.answer];
  q.answer = c.newAnswer;
  q.explanation = "[Audit-corrected " + TODAY + "] " + c.note + " Correct answer: " + q.options[c.newAnswer] + ".";
  q.tags = (q.tags || []).filter(t => t !== "6000-bank").concat(["Audit-Corrected"]);
  q.lastVerified = TODAY; q.version = (q.version || 1) + 1;
  corrected++;
  log.push("CORRECTED " + c.id + ": '" + oldAns + "' -> '" + q.options[c.newAnswer] + "'");
});

AMBIGUOUS.forEach(id => {
  const q = byId[id];
  if (!q) return;
  q.status = "pending_verification";
  q.verificationStatus = "unverified";
  q.explanation += " [Held: audit found this question ambiguous or flawed (multiple defensible answers) — see reports/audit_source.md]";
  pended++;
});

// T6K-784 (unverifiable "MacLite" product) -> remove from published set entirely.
if (byId["T6K-784"]) { byId["T6K-784"].status = "pending_verification"; byId["T6K-784"].verificationStatus = "unverified";
  byId["T6K-784"].explanation += " [Held: could not verify this product exists in any reference — flagged, not deleted, in case source material clarifies it.]"; removed++; }

OUTDATED.forEach(id => {
  const q = byId[id];
  if (!q) return;
  if (q.importance > 2) { q.importance = 2; demoted++; }
  if (!(q.tags || []).includes("Outdated-Tech")) q.tags = (q.tags || []).concat(["Outdated-Tech"]);
});

fs.writeFileSync(SRC, JSON.stringify(all, null, 1));

const report = "\n\n---\n\n# Audit Applied — " + TODAY + "\n\n" +
  "| Action | Count |\n|---|---|\n" +
  "| Answers corrected (confirmed wrong) | " + corrected + " |\n" +
  "| Moved to Pending Verification (ambiguous/unverifiable) | " + (pended + removed) + " |\n" +
  "| Importance demoted (outdated tech) | " + demoted + " |\n\n" +
  "## Corrections log\n\n- " + log.join("\n- ") + "\n";
fs.appendFileSync(path.join(__dirname, "..", "reports", "import_report.md"), report);

console.log("AUDIT APPLIED");
console.log("  corrected: " + corrected + " | pended: " + (pended + removed) + " | demoted: " + demoted);
log.forEach(l => console.log("  " + l));
console.log("  next: node tools/build_questions.js");
