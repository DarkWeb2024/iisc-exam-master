/* add_gold.js — the GOLD-STANDARD template batch. Each question carries the full rich
   explanation format the Phase-1 spec requires: why the answer is right, why EACH other
   option is wrong, a memory trick, common mistake, related topic, revision note.
   All hand-verified, published. Run: node tools/add_gold.js  then build_questions.js */
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..", "content", "questions");
const SOLVE = { Easy: 30, Medium: 45, Hard: 75, Expert: 100 };

// [folder, topic, subtopic, difficulty, imp, question, options, answer, explanation,
//  whyWrong[4], memoryTrick, commonMistake, relatedTopic, revisionNote]
const GOLD = [
  ["computer","Memory","RAM","Easy",5,"Which statement about RAM is correct?",
   ["RAM is non-volatile","RAM retains data without power","RAM loses its data when power is switched off","RAM is permanent storage"],2,
   "RAM (Random Access Memory) is volatile primary memory — its contents are erased when power is removed.",
   ["Wrong: RAM is volatile, not non-volatile (ROM is non-volatile).","Wrong: RAM needs continuous power to retain data.","Correct: volatility means data is lost on power-off.","Wrong: RAM is temporary working memory, not permanent storage."],
   "RAM = 'Running-power' memory — needs power to Remember.","Confusing RAM (volatile) with ROM (non-volatile).","Memory hierarchy; ROM","RAM volatile · ROM non-volatile · order Register>Cache>RAM>Disk"],
  ["computer","Generations","Microprocessor","Medium",4,"Which generation of computers introduced the microprocessor?",
   ["First generation","Second generation","Third generation","Fourth generation"],3,
   "The fourth generation (1971 onward) introduced the microprocessor (VLSI).",
   ["Wrong: 1st gen used vacuum tubes.","Wrong: 2nd gen used transistors.","Wrong: 3rd gen used integrated circuits (ICs).","Correct: 4th gen = microprocessors."],
   "'TIC-M': Tube, Transistor, IC, Microprocessor (gens 1-4).","Mixing up IC (3rd) with microprocessor (4th).","Generations of computers","Vacuum tube→Transistor→IC→Microprocessor→AI"],
  ["quant","Compound Interest","CI vs SI","Hard",5,"The difference between compound and simple interest on a sum for 2 years at 10% per annum is Rs.50. The sum is?",
   ["Rs.4000","Rs.5000","Rs.5500","Rs.4500"],1,
   "For 2 years, CI − SI = P(R/100)². So 50 = P(10/100)² = 0.01P → P = 5000.",
   ["Wrong: 0.01×4000 = 40, not 50.","Correct: 0.01×5000 = 50.","Wrong: 0.01×5500 = 55.","Wrong: 0.01×4500 = 45."],
   "2-year CI−SI = P(R/100)² — skip computing both fully.","Calculating CI and SI separately and subtracting (slow, error-prone).","Simple & Compound Interest","CI−SI (2 yr) = P(R/100)²"],
  ["quant","Percentage","Successive change","Medium",4,"A number is first increased by 25% and then decreased by 20%. The net percentage change is?",
   ["Increase of 5%","No change","Decrease of 5%","Increase of 10%"],1,
   "Net = a + b + ab/100 = 25 − 20 − (25×20/100) = 5 − 5 = 0. No net change.",
   ["Wrong: you cannot just add 25 and −20 and ignore the product term.","Correct: the +25% and −20% exactly cancel.","Wrong: sign/product handled incorrectly.","Wrong: overcounts the increase."],
   "+25% = ×5/4, −20% = ×4/5; 5/4 × 4/5 = 1 (unchanged).","Adding percentages directly (25−20=5%).","Successive percentage change","Net = a+b+ab/100"],
  ["verbal","Grammar","Subject-verb agreement","Easy",5,"Choose the correct verb: 'One of the boys ___ absent today.'",
   ["are","were","is","have been"],2,
   "'One of the + plural noun' takes a SINGULAR verb because the subject is 'One'. → 'is'.",
   ["Wrong: 'are' is plural.","Wrong: 'were' is plural/past.","Correct: singular 'is' agrees with 'One'.","Wrong: 'have been' is plural."],
   "The real subject is 'One', not 'boys' — so singular.","Matching the verb to 'boys' instead of 'One'.","Subject-verb agreement","'One of the + plural + singular verb'"],
  ["verbal","One-word Substitution","Places","Medium",3,"One word for 'a place where dead bodies are kept':",
   ["Cemetery","Mortuary","Tomb","Shrine"],1,
   "A mortuary is a place where dead bodies are kept (e.g. for identification before burial/cremation).",
   ["Wrong: a cemetery is a place where the dead are buried.","Correct: a mortuary stores dead bodies.","Wrong: a tomb is a burial chamber for one person.","Wrong: a shrine is a holy place."],
   "Mortuary ~ 'mortal' (death) — where bodies are kept.","Confusing mortuary (kept) with cemetery (buried).","One-word substitution","mortuary=bodies kept · cemetery=buried · aviary=birds"],
  ["reasoning","Blood Relations","Family tree","Medium",4,"Pointing to a woman, a man said, 'She is the daughter of my grandfather's only son.' How is the woman related to the man?",
   ["Mother","Sister","Aunt","Daughter"],1,
   "Grandfather's only son = the man's father. The father's daughter = the man's sister.",
   ["Wrong: his mother is his father's wife, not daughter.","Correct: father's daughter = sister.","Wrong: an aunt would be the father's sister.","Wrong: his daughter would be his own child."],
   "'Grandfather's only son' almost always = the speaker's father.","Assuming 'only son' = the speaker himself (only true if the speaker is male AND the only son).","Blood relations","Draw a tree; solve outward from the speaker"],
  ["reasoning","Number Series","Squares +1","Medium",4,"Find the next term: 2, 5, 10, 17, 26, ?",
   ["35","36","37","38"],2,
   "The differences are 3, 5, 7, 9 (odd numbers). The next difference is 11, so 26 + 11 = 37. (Also n²+1: 1,4,9,16,25,36 +1.)",
   ["Wrong: that adds 9, not 11.","Wrong: 36 = 6², but the pattern is n²+1.","Correct: 26 + 11 = 37 (= 6²+1).","Wrong: overshoots by 1."],
   "Each term is n²+1: 1²+1, 2²+1, 3²+1 …","Adding a constant difference instead of a growing one.","Number series","Check differences first; then squares/cubes"],
  ["gk","Polity","Fundamental Rights","Easy",5,"Which Article of the Indian Constitution guarantees the Right to Constitutional Remedies?",
   ["Article 19","Article 21","Article 32","Article 44"],2,
   "Article 32 guarantees the Right to Constitutional Remedies; Dr. Ambedkar called it the 'heart and soul' of the Constitution.",
   ["Wrong: Article 19 covers the six freedoms.","Wrong: Article 21 covers the right to life and liberty.","Correct: Article 32 = constitutional remedies.","Wrong: Article 44 is a Directive Principle (Uniform Civil Code)."],
   "'32 = heart and soul' — lock this pair.","Confusing Article 32 (remedies) with 21 (life).","Fundamental Rights","Art 14 equality · 19 freedoms · 21 life · 32 remedies"],
  ["gk","Geography","Extremities of India","Medium",4,"What is the southernmost tip of the Indian mainland?",
   ["Indira Point","Kanyakumari","Rameswaram","Point Calimere"],1,
   "Kanyakumari (Cape Comorin) is the southernmost point of the Indian mainland.",
   ["Wrong: Indira Point is the southernmost point of India INCLUDING islands (in the Nicobar Islands), not the mainland.","Correct: Kanyakumari is the mainland's southern tip.","Wrong: Rameswaram is an island town in Tamil Nadu, not the southern tip.","Wrong: Point Calimere is on the south-east coast, not the southern tip."],
   "Mainland → Kanyakumari; whole of India (with islands) → Indira Point.","Answering 'Indira Point' when the question says MAINLAND.","Indian geography","Kanyakumari = mainland south · Indira Point = India south (islands)"]
];

let n = 0;
const byFolder = {};
GOLD.forEach((g, i) => {
  const [folder, topic, subtopic, difficulty, imp, question, options, answer, explanation, whyWrong, memoryTrick, commonMistake, relatedTopic, revisionNote] = g;
  (byFolder[folder] = byFolder[folder] || []).push({
    id: "GOLD-" + folder.toUpperCase() + "-" + ((byFolder[folder] || []).length + 1),
    subject: folder, section: folder, topic, subtopic, difficulty,
    question, options, answer, explanation, whyWrong,
    memoryTrick, commonMistake, relatedTopic, revisionNote, shortcut: "",
    solveTimeSec: SOLVE[difficulty], importance: imp,
    repeated: "Frequently Repeated", sourceType: "Verified Model Question",
    examName: null, year: null,
    tags: ["IISc", topic, difficulty], keywords: (topic + " " + question).toLowerCase().match(/[a-z]{4,}/g).slice(0, 6),
    verificationStatus: "verified", status: "published", explanationComplete: true,
    createdDate: "2026-07-01", lastVerified: "2026-07-01", version: 1, language: "en"
  });
  n++;
});
Object.keys(byFolder).forEach(folder => {
  const dir = folder === "gk" ? path.join(OUT, "gk", "static") : path.join(OUT, folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "_gold_v1.json"), JSON.stringify(byFolder[folder], null, 2));
});
console.log("Wrote " + n + " gold-standard questions (full rich explanations) across " + Object.keys(byFolder).length + " subjects.");
