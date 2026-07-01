/* Core content: subjects, study notes + ranked sources, formulas, predictions, PYQ, revision.
   All links here were verified to exist. Labels: OFFICIAL / RECONSTRUCTED / PREDICTION. */

window.SUBJECTS = [
  {id:"computer", name:"Computer Applications", icon:"💻", marks:10, tier:1,
   desc:"Easiest, most scoreable section (10 marks). Memory, MS Office, IT Act, e-governance."},
  {id:"reasoning", name:"Logical & Numerical Reasoning", icon:"🧩", marks:22, tier:1,
   desc:"Highest-value section (22 marks) and first tiebreaker. Series, coding, syllogism."},
  {id:"quantitative", name:"Quantitative Ability", icon:"🔢", marks:16, tier:2,
   desc:"Formula-driven (16 marks). Percentage, profit/loss, interest, mensuration."},
  {id:"verbal", name:"Verbal Ability (English)", icon:"📝", marks:16, tier:2,
   desc:"Grammar + vocabulary (16 marks). Errors, idioms, one-word substitution."},
  {id:"general_awareness", name:"General Awareness", icon:"🌍", marks:16, tier:2,
   desc:"Static GK + current affairs (16 marks). Polity, history, science, economy."}
];

window.STUDY = {
  computer: {
    learn: "Computer Applications tests basic computer literacy at a matriculation level. Focus areas: (1) Memory — RAM is volatile (erased on power off), ROM is permanent; speed order Register > Cache > RAM > Disk; 1 byte = 8 bits, 1 KB = 1024 bytes. (2) CPU = ALU + Control Unit + Registers. (3) Generations: vacuum tube → transistor → IC → microprocessor → AI. (4) MS Office: Word .docx, Excel .xlsx (formulas start with =), PowerPoint .pptx (F5 = slideshow). (5) IT Act 2000, digital signatures (authentication), e-governance (G2C/G2B/G2G/G2E) — these are named directly in the IISc syllabus, so prioritise them. Common mistakes: calling ROM volatile, touchscreen only 'input' (it's both), OS as application software. Memory trick: 'RAM Remembers only with Running power' = volatile.",
    sources: [
      {type:"YouTube", rank:5, title:"'Computer Awareness for SSC CGL' one-shot (Adda247 / Career Power)", note:"Search that phrase; one 60-90 min video covers ~80% of this section.", url:""},
      {type:"Website", rank:5, title:"Oliveboard — SSC CGL Computer Awareness (free 100-MCQ PDF)", note:"Read the topic list and download the practice PDF.", url:"https://www.oliveboard.in/blog/ssc-cgl-computer-awareness/"},
      {type:"Official", rank:4, title:"MeitY — IT Act & Digital Signature (authoritative)", note:"For IT Act / digital signature facts.", url:"https://www.meity.gov.in"},
      {type:"Book", rank:4, title:"Lucent's Computer / Objective Computer Awareness (Arihant)", note:"Commercial book. Chapters: Fundamentals, Memory, MS Office, IT Act. Page ranges vary by edition — go by chapter name.", url:""},
      {type:"Free PDF", rank:4, title:"NIELIT basic computer literacy", note:"Official, free basic-computer content.", url:"https://www.nielit.gov.in"}
    ]
  },
  reasoning: {
    learn: "Reasoning is your highest-value section (22 marks) and breaks ties first — invest here. Key types: (1) Series — check differences, then multiplication, squares (1,4,9,16), cubes (1,8,27). (2) Coding-decoding — write A=1..Z=26 on rough sheet; find the shift. (3) Analogy & odd-one-out — state the relationship as a sentence. (4) Blood relations — draw a family tree; 'my mother's only son' = the speaker. (5) Direction — sketch a compass; shortest distance = Pythagoras. (6) Syllogism — draw Venn circles; a conclusion is valid only if true in every diagram. (7) Clock angle = |30H − 5.5M|. This section rewards practice more than theory — drill many questions.",
    sources: [
      {type:"Website", rank:5, title:"IndiaBix — Logical Reasoning (free, with solutions)", note:"Number series, analogies, classification, cubes.", url:"https://www.indiabix.com/logical-reasoning/questions-and-answers/"},
      {type:"Website", rank:5, title:"IndiaBix — Verbal Reasoning (blood relations, syllogism, directions)", note:"Best for syllogism and blood relations practice.", url:"https://www.indiabix.com/verbal-reasoning/questions-and-answers/"},
      {type:"YouTube", rank:4, title:"'Reasoning for SSC' (Feel Free to Learn / Deepak Tirthyani)", note:"Search for syllogism Venn tricks and coding-decoding.", url:""},
      {type:"Website", rank:3, title:"BYJU'S coding-decoding practice set", note:"32 solved coding-decoding questions.", url:"https://byjus.com/govt-exams/coding-decoding-questions/"}
    ]
  },
  quantitative: {
    learn: "Quant (16 marks) is Class-10 level and formula-driven. Master arithmetic first (best marks-per-minute): percentage, profit/loss (always on CP), SI = PRT/100, CI = P(1+R/100)^T, average, ratio, time & work (together = A×B/(A+B)), speed (km/h → m/s is ×5/18). Then mensuration: circle area = πr², cylinder V = πr²h, cube V = a³. Geometry and trigonometry are the slowest per mark — do them last. Data interpretation (pie/bar) is quick: pie value = angle/360 × total. Exam rule: if a question takes over 90 seconds, flag it and move on.",
    sources: [
      {type:"Website", rank:5, title:"IndiaBix — Aptitude (topic-wise, with solutions)", note:"Percentage, profit/loss, interest, time-work, mensuration.", url:"https://www.indiabix.com/aptitude/questions-and-answers/"},
      {type:"YouTube", rank:5, title:"Gagan Pratap — SSC Maths shortcuts", note:"Search 'Gagan Pratap percentage / profit loss tricks'.", url:""},
      {type:"Book", rank:4, title:"Quantitative Aptitude — R. S. Aggarwal (S. Chand)", note:"Commercial book. Study arithmetic + mensuration + DI chapters. Page ranges vary by edition.", url:""},
      {type:"Free PDF", rank:4, title:"NCERT Maths Class 8-10 (free, official)", note:"For concept gaps (mensuration, algebra, trigonometry).", url:"https://ncert.nic.in/textbook.php"}
    ]
  },
  verbal: {
    learn: "Verbal (16 marks) is matriculation-level English. High-yield: (1) Grammar — subject-verb agreement (Each/every = singular; 'one of the + plural + singular verb'), prepositions (good at, afraid of, married to, despite [no 'of']), active/passive, narration. (2) Vocabulary — one-word substitution (Aviary=birds, Illegible=can't read, Inevitable=can't avoid), idioms (burn the midnight oil = work late), synonyms/antonyms. Trick: 'that which cannot be ___' usually maps to an In-/Il- word. Read the sentence aloud — errors often 'sound wrong'.",
    sources: [
      {type:"Website", rank:5, title:"IndiaBix — Verbal Ability (spotting errors, idioms)", note:"Grammar and vocabulary MCQs with answers.", url:"https://www.indiabix.com/verbal-ability/questions-and-answers/"},
      {type:"Website", rank:4, title:"IndiaBix — Idioms and Phrases", note:"High-frequency idioms with meanings.", url:"https://www.indiabix.com/verbal-ability/idioms-and-phrases/"},
      {type:"YouTube", rank:4, title:"'English for SSC' (Dear Sir / Neetu Singh)", note:"Search for error spotting and one-word substitution.", url:""}
    ]
  },
  general_awareness: {
    learn: "General Awareness (16 marks) = static GK + current affairs. Reliable core (learn these cold): Constitution (adopted 26 Nov 1949, enforced 26 Jan 1950, Ambedkar drafting chair, 42nd = Mini Constitution, Article 32 = heart & soul); national symbols (Ganges dolphin, Vande Mataram, Lion Capital); superlatives (Rajasthan largest, Ganga longest); freedom dates (1885, 1919, 1930, 1942, 1947); science basics (206 bones, vitamin C → scurvy); economy (RBI 1935 Mumbai, GST 2017). Current affairs change monthly — verify with a fresh 'last 6 months' capsule. Do NOT blind-guess current affairs (−0.33 penalty).",
    sources: [
      {type:"Website", rank:5, title:"IndiaBix — General Knowledge (polity, history, geography, science)", note:"Topic-wise static GK MCQs with answers.", url:"https://www.indiabix.com/general-knowledge/indian-politics/"},
      {type:"Website", rank:5, title:"GKToday — Current Affairs quiz", note:"Verify recent current affairs close to exam date.", url:"https://www.gktoday.in/gk-current-affairs-quiz-questions-answers/"},
      {type:"YouTube", rank:4, title:"StudyIQ — Polity / Static GK one-shot", note:"Search 'polity one shot SSC StudyIQ'.", url:""},
      {type:"Free PDF", rank:4, title:"NCERT Social Science Class 6-10 (free, official)", note:"Polity, History, Geography concept clarity.", url:"https://ncert.nic.in/textbook.php"}
    ]
  }
};

window.FORMULAS = {
  computer: [
    {h:"Memory units", items:["1 nibble = 4 bits","1 byte = 8 bits","1 KB = 1024 B","1 MB = 1024 KB","1 GB = 1024 MB"]},
    {h:"Speed order", items:["Register > Cache > RAM > SSD > HDD","RAM = volatile; ROM = non-volatile"]},
    {h:"Key full forms", items:["CPU Central Processing Unit","ALU Arithmetic Logic Unit","RAM Random Access Memory","ROM Read Only Memory","HTTP HyperText Transfer Protocol","BIOS Basic Input Output System"]},
    {h:"MS Office", items:["Word .docx, Excel .xlsx, PPT .pptx","Excel formula starts with =","F5 = slideshow"]},
    {h:"Law / systems", items:["IT Act 2000 (amended 2008)","Digital signature = authentication","E-gov: G2C, G2B, G2G, G2E"]}
  ],
  quantitative: [
    {h:"Percentage / Profit / Interest", items:["x% = x/100","Profit% = (SP-CP)/CP x 100","SI = PRT/100","CI: A = P(1+R/100)^T"]},
    {h:"Time & motion", items:["Together = AxB/(A+B)","Speed = Distance/Time","km/h -> m/s: x5/18","Boats: down = b+s, up = b-s"]},
    {h:"Mensuration", items:["Circle A = pi r^2","Cylinder V = pi r^2 h","Cube V = a^3","Square diagonal = a√2"]},
    {h:"Algebra", items:["(a+b)^2 = a^2+2ab+b^2","a^2-b^2 = (a+b)(a-b)","a+b+c=0 -> a^3+b^3+c^3 = 3abc"]},
    {h:"Trig", items:["sin^2+cos^2 = 1","sin 0/30/45/60/90 = 0, 1/2, 1/√2, √3/2, 1"]}
  ],
  general_awareness: [
    {h:"Constitution", items:["Adopted 26 Nov 1949, enforced 26 Jan 1950","Drafting chair: Ambedkar","42nd = Mini Constitution","Art 32 = heart & soul; FR = Part III"]},
    {h:"National symbols", items:["Aquatic animal: Ganges Dolphin","Anthem: Tagore; Song: Bankim Chandra","Emblem: Lion Capital, Sarnath"]},
    {h:"Key years", items:["1885 INC, 1919 Jallianwala, 1930 Dandi, 1942 Quit India, 1947","RBI 1935, GST 2017, NITI Aayog 2015"]},
    {h:"Science", items:["206 bones (adult)","Donor O-, recipient AB+","Vitamin C→scurvy, D→rickets"]}
  ]
};

window.PREDICTIONS = [
  {subject:"computer", conf:"Very High", q:"A memory volatility question (RAM/ROM)", reason:"Asked in nearly every computer-awareness paper across SSC/Banking/PSU."},
  {subject:"computer", conf:"Very High", q:"A memory-unit conversion (1 byte = 8 bits / 1 KB = 1024)", reason:"Extremely high-frequency recall item."},
  {subject:"computer", conf:"High", q:"IT Act year (2000) / Digital Signature / E-Governance (G2C)", reason:"These are named explicitly in the IISc syllabus, raising IISc probability above a generic paper."},
  {subject:"computer", conf:"High", q:"An MS Office item (Excel '=', extensions, F5)", reason:"MS Office is named in the syllabus; direct-recall favourite."},
  {subject:"general_awareness", conf:"Very High", q:"A Constitution question (26 Jan 1950 / Ambedkar / 42nd)", reason:"Universal across government exams."},
  {subject:"general_awareness", conf:"High", q:"A national-symbols question (Ganges dolphin / Vande Mataram)", reason:"Direct recall, appears almost every paper."},
  {subject:"general_awareness", conf:"Medium", q:"Budget 2026 / Padma awards / a recent appointment", reason:"Current-affairs topic is certain but the exact fact varies — verify fresh."},
  {subject:"reasoning", conf:"Very High", q:"A number/letter series completion", reason:"The most common reasoning format across all exams."},
  {subject:"reasoning", conf:"High", q:"A coding-decoding letter-shift question", reason:"Reused pattern; method identical even when letters change."},
  {subject:"quantitative", conf:"Very High", q:"A percentage / profit-loss / SI-CI word problem", reason:"Arithmetic dominates SSC-pattern quant."},
  {subject:"verbal", conf:"High", q:"One-word substitution + an idiom", reason:"Vocabulary items repeat heavily in SSC-pattern English."}
];

window.PYQ = {
  officialNote: "There are NO publicly released IISc Administrative Assistant previous-year question papers. Anyone selling 'IISc AA previous papers' is repackaging generic questions. Because the IISc syllabus is copied verbatim from SSC CGL/CHSL Tier-1, the correct practice is genuine SSC papers plus the reconstructed patterns below. Nothing here is presented as an official IISc paper.",
  sources: [
    {name:"Official SSC papers (closest genuine PYQs)", rank:5, note:"SSC CGL/CHSL Tier-1 papers match your syllabus 1:1.", url:"https://ssc.gov.in"},
    {name:"Testbook — SSC CGL previous papers", rank:4, note:"Free previous-year papers with solutions.", url:"https://testbook.com/ssc-cgl/previous-year-papers"},
    {name:"Reconstructed IISc-pattern bank", rank:4, note:"See the Practice tab — every item is tagged with the exams it repeats in.", url:""}
  ],
  overlap: [
    {pattern:"RAM vs ROM / volatile memory", iisc:"Yes", ssc:"High", kpsc:"High", banking:"High", prob:"90%"},
    {pattern:"Memory units (byte/KB)", iisc:"Yes", ssc:"High", kpsc:"High", banking:"Med", prob:"85%"},
    {pattern:"Full forms (CPU/HTTP)", iisc:"Yes", ssc:"High", kpsc:"High", banking:"High", prob:"85%"},
    {pattern:"MS Office (=, extensions)", iisc:"Yes", ssc:"High", kpsc:"Med", banking:"High", prob:"80%"},
    {pattern:"IT Act 2000 / Digital Signature", iisc:"Named", ssc:"Med", kpsc:"Med", banking:"Med", prob:"70%"},
    {pattern:"Constitution (articles/amendments)", iisc:"Yes", ssc:"High", kpsc:"High", banking:"Med", prob:"85%"},
    {pattern:"National symbols", iisc:"Yes", ssc:"High", kpsc:"High", banking:"Med", prob:"80%"},
    {pattern:"Number series / coding", iisc:"Yes", ssc:"High", kpsc:"High", banking:"High", prob:"85%"},
    {pattern:"Percentage / Profit-Loss", iisc:"Yes", ssc:"High", kpsc:"High", banking:"High", prob:"80%"},
    {pattern:"One-word substitution / idioms", iisc:"Yes", ssc:"High", kpsc:"Med", banking:"Med", prob:"75%"}
  ]
};

window.REVISION = {
  min30: "Read every subject's Formula Sheet slowly (Computer full forms + units, Quant formulas, GA Constitution/symbols/years). Then do 5 questions per subject in the Practice tab.",
  min15: "Read only the bold facts in the Formula Sheets. Recite Computer full forms and the Constitution dates (26 Jan 1950, Ambedkar, 42nd).",
  min5: "Recite aloud: 1 byte=8 bits; RAM volatile; IT Act 2000; Excel '='; Constitution enforced 26 Jan 1950; Ganges dolphin; RBI 1935; km/h->m/s x5/18; clock angle |30H-5.5M|.",
  min1: "Three rules: (1) Easy-first — Computer, GA, then Reasoning, then Quant. (2) Guess only if you can eliminate one option (-0.33 penalty). (3) Breathe and read fully.",
  lastMinute: [
    "1 byte = 8 bits; 1 KB = 1024 bytes; RAM is volatile.",
    "IT Act = 2000 (amended 2008); digital signature = authentication.",
    "Constitution enforced 26 Jan 1950; Ambedkar drafting chair; 42nd = Mini Constitution.",
    "National aquatic animal = Ganges River Dolphin; national song = Vande Mataram.",
    "Rajasthan largest state; Ganga longest river; vitamin C → scurvy; 206 bones.",
    "RBI 1935 (Mumbai); GST 1 July 2017; NITI Aayog replaced Planning Commission.",
    "km/h → m/s: ×5/18; together work = AxB/(A+B); circle area = pi r^2.",
    "Clock angle = |30H - 5.5M|; direction distance = Pythagoras."
  ]
};
