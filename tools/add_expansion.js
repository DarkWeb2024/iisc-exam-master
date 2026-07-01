/* add_expansion.js — authoring helper. Holds hand-verified questions in compact form
   and writes schema-complete JSON into content/questions/<folder>/_expansion_v1.json.
   Every answer here was checked by the author. Source label is the honest
   "Verified Model Question" — NOT a Previous Year Question. Run: node tools/add_expansion.js */
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..", "content", "questions");
const SOLVE = { Easy: 30, Medium: 45, Hard: 75, Expert: 100 };

// compact authored questions grouped by folder. answer = index (0-3).
const DATA = {
  quant: [
    ["Percentage","40% of 250 is?",["80","100","120","90"],1,"250 × 40/100 = 100.","E",4],
    ["Profit & Loss","CP = 250, SP = 200. The loss% is?",["25%","20%","15%","10%"],1,"Loss = 50; loss% = 50/250 × 100 = 20% (on CP).","E",4],
    ["Simple Interest","SI on Rs.4000 at 6% p.a. for 2 years?",["Rs.480","Rs.400","Rs.520","Rs.360"],0,"SI = 4000×6×2/100 = 480.","E",4],
    ["Average","The average of 2, 4, 6, 8 is?",["4","5","6","3"],1,"Sum 20 / 4 = 5.","E",3],
    ["Ratio","Divide Rs.480 in the ratio 5:7. The smaller share is?",["Rs.200","Rs.280","Rs.240","Rs.180"],0,"Total parts 12; smaller = 480 × 5/12 = 200.","M",3],
    ["Time & Work","A finishes a job in 20 days, B in 30 days. Together they take?",["10 days","12 days","15 days","14 days"],1,"20×30/(20+30) = 600/50 = 12 days.","M",4],
    ["Speed & Distance","Convert 108 km/h into m/s.",["27","30","33","36"],1,"108 × 5/18 = 30 m/s.","E",4],
    ["Mensuration","Area of a square with side 9 cm?",["18","72","81","36"],2,"Area = 9² = 81.","E",3],
    ["Percentage","15% of 300 is?",["30","45","60","40"],1,"300 × 15/100 = 45.","E",3],
    ["Mensuration","Perimeter of a rectangle with length 8 and breadth 5?",["13","26","40","20"],1,"2(8+5) = 26.","E",3]
  ],
  computer: [
    ["Memory Units","1 MB equals how many KB?",["1000","1024","512","2048"],1,"1 MB = 1024 KB.","E",4],
    ["Devices","Which of the following is an OUTPUT device?",["Keyboard","Scanner","Monitor","Mouse"],2,"Monitor displays output; the rest are input devices.","E",4],
    ["Abbreviations","USB stands for?",["Universal Serial Bus","Unified System Bus","Universal System Board","United Serial Bus"],0,"USB = Universal Serial Bus.","E",4],
    ["Generations","The first generation of computers used?",["Transistors","Vacuum tubes","Integrated circuits","Microprocessors"],1,"First generation used vacuum tubes.","E",4],
    ["Shortcuts","Ctrl + P is used to?",["Paste","Print","Preview","Protect"],1,"Ctrl+P opens the print dialog.","E",4],
    ["Devices","Which of these is a secondary STORAGE device?",["RAM","ALU","Hard disk","CPU"],2,"A hard disk is secondary (non-volatile) storage; RAM is primary memory.","M",3],
    ["Abbreviations","GUI stands for?",["Graphical User Interface","General User Interface","Graphical Unified Interface","Global User Interface"],0,"GUI = Graphical User Interface.","E",3],
    ["MS Office","A file with the .pptx extension is created by?",["MS Word","MS Excel","MS PowerPoint","MS Access"],2,".pptx is a PowerPoint presentation.","E",4],
    ["Shortcuts","Alt + F4 is used to?",["Refresh","Close the active window","Open help","Switch tabs"],1,"Alt+F4 closes the active window.","M",3],
    ["Abbreviations","LAN stands for?",["Local Area Network","Large Area Network","Linked Access Network","Local Access Node"],0,"LAN = Local Area Network.","E",3]
  ],
  reasoning: [
    ["Number Series","Find the next term: 5, 11, 17, 23, ?",["27","29","28","31"],1,"Add 6 each time → 29.","E",4],
    ["Number Series","Find the next term: 100, 96, 88, 76, ?",["64","60","62","58"],1,"Differences −4, −8, −12, −16 → 76 − 16 = 60.","M",4],
    ["Classification","Find the odd one out: 3, 5, 7, 9, 11",["3","5","9","11"],2,"9 is not a prime number; the rest are primes.","E",4],
    ["Analogy","Cow : Calf :: Dog : ?",["Kitten","Puppy","Cub","Foal"],1,"A young dog is a puppy.","E",3],
    ["Number Series","Find the next term: 7, 14, 28, 56, ?",["96","112","98","108"],1,"Each term × 2 → 112.","E",4],
    ["Alphabet Series","Find the next letter: B, D, F, H, ?",["I","J","K","G"],1,"Skip one letter each time → J.","E",3],
    ["Coding-Decoding","If A=1, B=2 …, the sum of the letters in 'DOG' is?",["24","26","28","22"],1,"D(4)+O(15)+G(7) = 26.","M",3],
    ["Direction Sense","Facing South-East, you turn 90° clockwise. You now face?",["North-East","South-West","North-West","East"],1,"South-East + 90° clockwise → South-West.","M",3]
  ],
  verbal: [
    ["Synonyms","Choose the synonym of 'Rapid':",["Slow","Fast","Weak","Late"],1,"Rapid means fast/quick.","E",4],
    ["Antonyms","Choose the antonym of 'Ancient':",["Old","Modern","Historic","Aged"],1,"Ancient means very old; its antonym is modern.","E",4],
    ["One-word Substitution","One word for 'the murder of a king':",["Patricide","Regicide","Genocide","Homicide"],1,"Regicide = killing of a king.","M",3],
    ["Idioms","The idiom 'a piece of cake' means:",["Very difficult","Very easy","Very tasty","Very costly"],1,"It means something very easy to do.","E",4],
    ["Prepositions","Fill in the blank: 'She is afraid ___ dogs.'",["from","of","with","for"],1,"The correct collocation is 'afraid of'.","E",4],
    ["Spotting Errors","Find the error: 'The news (a)/ are (b)/ very good (c)/ No error (d).'",["The news","are","very good","No error"],1,"'News' is singular, so 'are' should be 'is'.","M",4],
    ["One-word Substitution","One word for 'a person who cannot read or write':",["Illiterate","Illegible","Ignorant","Illicit"],0,"Illiterate = unable to read or write.","M",3],
    ["Spelling","Choose the correctly spelt word:",["Definate","Defenite","Definite","Definitte"],2,"The correct spelling is 'Definite'.","E",3]
  ],
  gk: [
    ["Polity","Who was the first President of India?",["Jawaharlal Nehru","Dr. Rajendra Prasad","Dr. B. R. Ambedkar","Sardar Patel"],1,"Dr. Rajendra Prasad was the first President of India.","E",4],
    ["National Symbols","What is the national flower of India?",["Rose","Lotus","Sunflower","Marigold"],1,"The lotus is the national flower of India.","E",4],
    ["National Symbols","What is the national bird of India?",["Peacock","Parrot","Eagle","Sparrow"],0,"The Indian peacock is the national bird.","E",3],
    ["National Symbols","How many spokes are there in the Ashoka Chakra on the national flag?",["12","24","32","16"],1,"The Ashoka Chakra has 24 spokes.","M",3],
    ["History","Who is known as the 'Father of the Nation' in India?",["Jawaharlal Nehru","Mahatma Gandhi","Sardar Patel","Bhagat Singh"],1,"Mahatma Gandhi is called the Father of the Nation.","E",4],
    ["Geography","What is the capital of Karnataka?",["Mysuru","Bengaluru","Hubli","Mangaluru"],1,"Bengaluru is the capital of Karnataka.","E",3]
  ]
};

let count = 0;
Object.keys(DATA).forEach(folder => {
  const dir = path.join(OUT, folder);
  fs.mkdirSync(dir, { recursive: true });
  const items = DATA[folder].map((r, i) => {
    const [topic, q, options, answer, exp, diff, imp] = r;
    const difficulty = { E: "Easy", M: "Medium", H: "Hard" }[diff];
    count++;
    return {
      id: "X-" + folder.toUpperCase() + "-" + (i + 1),
      subject: folder, section: folder, topic, subtopic: topic, difficulty,
      question: q, options, answer, explanation: exp,
      whyWrong: [], memoryTrick: "", shortcut: "",
      solveTimeSec: SOLVE[difficulty], importance: imp,
      repeated: "Expected Question", sourceType: "Verified Model Question",
      examName: null, year: null,
      tags: ["IISc", difficulty], keywords: (topic + " " + q).toLowerCase().match(/[a-z]{4,}/g).slice(0, 6),
      verificationStatus: "verified", explanationComplete: true,
      createdDate: "2026-07-01", lastVerified: "2026-07-01", version: 1, language: "en"
    };
  });
  fs.writeFileSync(path.join(dir, "_expansion_v1.json"), JSON.stringify(items, null, 2));
});
console.log("Wrote " + count + " hand-verified expansion questions across " + Object.keys(DATA).length + " subjects.");
