/* migrate.js — one-time migration of existing verified questions into the
   structured content bank: /content/questions/<subject>/<topic>.json
   Enriches each with the full metadata schema. Run: node tools/migrate.js
   Source of truth becomes the JSON files; build_questions.js compiles them back
   into the app's data/questions/*.js bundles. */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const QDIR = path.join(ROOT, "data", "questions");
const OUT = path.join(ROOT, "content", "questions");

// map internal subject id -> spec folder name
const SUBJECT_FOLDER = { quantitative: "quant", verbal: "verbal", reasoning: "reasoning", general_awareness: "gk", computer: "computer" };
const DIFF = { E: "Easy", M: "Medium", H: "Hard" };
const SOLVE = { Easy: 30, Medium: 45, Hard: 75, Expert: 100 };

// load existing window.QDATA from the legacy JS files (no fetch; eval in a shim)
function loadLegacy() {
  const win = { QDATA: {} };
  fs.readdirSync(QDIR).filter(f => f.endsWith(".js")).forEach(f => {
    const code = fs.readFileSync(path.join(QDIR, f), "utf8");
    new Function("window", code)(win);
  });
  return win.QDATA;
}
function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function keywords(q) { return Array.from(new Set((q.topic + " " + q.q).toLowerCase().match(/[a-z]{4,}/g) || [])).slice(0, 8); }
function repeatedRating(tags) {
  const exams = (tags || []).filter(t => ["IISc","SSC","KPSC","Banking","PSU","RRB"].includes(t)).length;
  if ((tags || []).includes("Predicted")) return "Expected Question";
  return exams >= 3 ? "Repeated Frequently" : exams === 2 ? "Occasionally Asked" : "Rarely Asked";
}

function enrich(q, subjectId) {
  const difficulty = DIFF[q.diff] || "Medium";
  return {
    id: q.id,
    subject: subjectId,
    section: subjectId,
    topic: q.topic,
    subtopic: q.topic,          // refine later; defaults to topic
    difficulty,
    question: q.q,
    options: q.options,
    answer: q.answer,           // index of correct option
    explanation: q.exp,
    whyWrong: [],               // enhancement field: per-option rationale (to be authored)
    memoryTrick: "",
    shortcut: "",
    solveTimeSec: SOLVE[difficulty],
    importance: q.imp,          // 1-5
    repeated: repeatedRating(q.tags),
    // These are reconstructed/authored questions -> honest source label. NEVER "PYQ".
    sourceType: "Verified Model Question",
    examName: null,
    year: null,
    tags: q.tags || [],
    keywords: keywords(q),
    verificationStatus: "verified",   // answer + explanation verified by author
    explanationComplete: false,       // whyWrong not yet authored
    createdDate: "2026-07-01",
    lastVerified: "2026-07-01",
    version: 1,
    language: "en"
  };
}

function run() {
  const QDATA = loadLegacy();
  let total = 0;
  Object.keys(QDATA).forEach(subjectId => {
    const folder = SUBJECT_FOLDER[subjectId] || subjectId;
    const byTopic = {};
    QDATA[subjectId].forEach(q => {
      const t = slug(q.topic) || "misc";
      (byTopic[t] = byTopic[t] || []).push(enrich(q, subjectId));
    });
    const dir = path.join(OUT, folder);
    fs.mkdirSync(dir, { recursive: true });
    Object.keys(byTopic).forEach(t => {
      const file = path.join(dir, t + ".json");
      // don't clobber hand-authored expansion files
      if (fs.existsSync(file) && file.includes("_expansion")) return;
      fs.writeFileSync(file, JSON.stringify(byTopic[t], null, 2));
      total += byTopic[t].length;
    });
    console.log(`  ${folder}: ${QDATA[subjectId].length} questions -> ${Object.keys(byTopic).length} topic files`);
  });
  console.log(`Migrated ${total} questions into ${OUT}`);
}
run();
