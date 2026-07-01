/* Logical & Numerical Reasoning questions. Verified single-correct. Sorted most-important first. */
window.QDATA = window.QDATA || {};
window.QDATA.reasoning = [
  {id:"R1", topic:"Number Series", q:"Find the next term: 2, 6, 12, 20, 30, ?", options:["40","42","36","44"], answer:1, exp:"Differences 4,6,8,10 -> next +12 -> 42.", diff:"M", imp:5, tags:["IISc","SSC","Banking"], src:"Series"},
  {id:"R2", topic:"Number Series", q:"Find the next term: 3, 9, 27, 81, ?", options:["162","243","234","324"], answer:1, exp:"Each term x3 -> 243.", diff:"E", imp:5, tags:["IISc","SSC"], src:"Series"},
  {id:"R3", topic:"Number Series", q:"Find the next term: 1, 4, 9, 16, 25, ?", options:["30","36","35","32"], answer:1, exp:"Perfect squares -> 6^2 = 36.", diff:"E", imp:5, tags:["IISc","SSC"], src:"Series"},
  {id:"R4", topic:"Coding-Decoding", q:"If CAT is coded as DBU (each letter +1), then DOG is coded as:", options:["EPH","EPF","DPH","EQH"], answer:0, exp:"D->E, O->P, G->H = EPH.", diff:"M", imp:5, tags:["IISc","SSC","Banking"], src:"Coding-Decoding"},
  {id:"R5", topic:"Analogy", q:"Pen : Write :: Knife : ?", options:["Sharp","Cut","Kitchen","Metal"], answer:1, exp:"A pen is used to write; a knife is used to cut.", diff:"E", imp:4, tags:["IISc","SSC"], src:"Analogy"},
  {id:"R6", topic:"Classification", q:"Find the odd one out: Rose, Lotus, Mango, Jasmine", options:["Rose","Lotus","Mango","Jasmine"], answer:2, exp:"Mango is a fruit; the rest are flowers.", diff:"E", imp:4, tags:["IISc","SSC"], src:"Classification"},
  {id:"R7", topic:"Direction Sense", q:"A man walks 6 km North, then 8 km East. How far is he from the start?", options:["10 km","14 km","12 km","2 km"], answer:0, exp:"√(6^2+8^2) = √100 = 10 km.", diff:"M", imp:4, tags:["IISc","SSC","Banking"], src:"Direction Sense"},
  {id:"R8", topic:"Blood Relations", q:"A man says, 'He is the son of my mother's only son.' The boy is the man's:", options:["Brother","Son","Nephew","Cousin"], answer:1, exp:"'My mother's only son' is the man himself; so the boy is his son.", diff:"M", imp:4, tags:["IISc","SSC"], src:"Blood Relations"},
  {id:"R9", topic:"Syllogism", q:"All cats are animals. All animals are living. Conclusion: All cats are living. This is:", options:["True","False","Cannot say","Partly true"], answer:0, exp:"Chain: cats -> animals -> living, so all cats are living is valid.", diff:"M", imp:4, tags:["IISc","SSC"], src:"Syllogism"},
  {id:"R10", topic:"Number Analogy", q:"4 : 16 :: 7 : ?", options:["49","28","14","21"], answer:0, exp:"Relationship is square: 7^2 = 49.", diff:"E", imp:4, tags:["IISc","SSC"], src:"Analogy"},
  {id:"R11", topic:"Alphabet Series", q:"Find the next letter: A, C, E, G, ?", options:["H","I","J","K"], answer:1, exp:"Skip one letter each time: A,C,E,G,I.", diff:"E", imp:4, tags:["IISc","SSC"], src:"Series"},
  {id:"R12", topic:"Clock", q:"What is the angle between the hands of a clock at 3:00?", options:["30 deg","60 deg","90 deg","120 deg"], answer:2, exp:"|30x3 - 5.5x0| = 90 degrees.", diff:"M", imp:3, tags:["IISc","SSC"], src:"Clock"},
  {id:"R13", topic:"Coding-Decoding", q:"If A=1, B=2, ..., the sum of letters in 'CAB' is:", options:["5","6","7","8"], answer:1, exp:"C(3)+A(1)+B(2) = 6.", diff:"E", imp:3, tags:["IISc","SSC"], src:"Coding-Decoding"},
  {id:"R14", topic:"Symbols", q:"If '+' means x, 'x' means -, '-' means +, then 6 + 2 x 4 - 3 = ?", options:["11","9","12","15"], answer:0, exp:"Replace: 6x2-4+3 = 12-4+3 = 11.", diff:"H", imp:3, tags:["IISc","SSC"], src:"Symbol operations"}
];
