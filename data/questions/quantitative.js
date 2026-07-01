/* Quantitative Ability questions. Verified single-correct. Sorted most-important first. */
window.QDATA = window.QDATA || {};
window.QDATA.quantitative = [
  {id:"Q1", topic:"Percentage", q:"What is 20% of 150?", options:["25","30","35","40"], answer:1, exp:"150 x 20/100 = 30.", diff:"E", imp:5, tags:["IISc","SSC","Banking"], src:"Percentage"},
  {id:"Q2", topic:"Profit & Loss", q:"If CP = 400 and SP = 500, the profit percent is:", options:["20%","25%","15%","10%"], answer:1, exp:"Profit = 100; profit% = 100/400 x 100 = 25%.", diff:"E", imp:5, tags:["IISc","SSC","Banking"], src:"Profit and Loss"},
  {id:"Q3", topic:"Simple Interest", q:"Simple interest on Rs.2000 at 5% p.a. for 3 years is:", options:["Rs.300","Rs.200","Rs.350","Rs.250"], answer:0, exp:"SI = PRT/100 = 2000x5x3/100 = 300.", diff:"E", imp:5, tags:["IISc","SSC"], src:"Simple Interest"},
  {id:"Q4", topic:"Compound Interest", q:"Compound interest on Rs.1000 at 10% p.a. for 2 years is:", options:["Rs.200","Rs.210","Rs.100","Rs.220"], answer:1, exp:"A = 1000(1.1)^2 = 1210; CI = 210.", diff:"M", imp:5, tags:["IISc","SSC","Banking"], src:"Compound Interest"},
  {id:"Q5", topic:"Average", q:"The average of 10, 20, 30, 40, 50 is:", options:["25","30","35","20"], answer:1, exp:"Sum 150 / 5 = 30.", diff:"E", imp:5, tags:["IISc","SSC"], src:"Average"},
  {id:"Q6", topic:"Time & Work", q:"A does a job in 10 days, B in 15 days. Together they finish in:", options:["5 days","6 days","8 days","7 days"], answer:1, exp:"Together = 10x15/(10+15) = 150/25 = 6 days.", diff:"M", imp:5, tags:["IISc","SSC","Banking"], src:"Time and Work"},
  {id:"Q7", topic:"Speed & Distance", q:"Convert 72 km/h into m/s.", options:["18","20","25","36"], answer:1, exp:"72 x 5/18 = 20 m/s.", diff:"E", imp:5, tags:["IISc","SSC"], src:"Time Speed Distance"},
  {id:"Q8", topic:"Mensuration", q:"Area of a circle with radius 7 (use pi = 22/7):", options:["154","144","49","308"], answer:0, exp:"Area = 22/7 x 7 x 7 = 154.", diff:"E", imp:4, tags:["IISc","SSC"], src:"Mensuration"},
  {id:"Q9", topic:"Ratio", q:"Divide Rs.900 in the ratio 2:3:4. The largest share is:", options:["Rs.300","Rs.400","Rs.450","Rs.200"], answer:1, exp:"Total parts 9; largest = 900 x 4/9 = 400.", diff:"M", imp:4, tags:["IISc","SSC"], src:"Ratio and Proportion"},
  {id:"Q10", topic:"Mensuration", q:"Volume of a cube with side 5 cm:", options:["25","75","125","150"], answer:2, exp:"V = 5^3 = 125.", diff:"E", imp:4, tags:["IISc","SSC"], src:"Mensuration"},
  {id:"Q11", topic:"Percentage", q:"A price rises 20% then falls 10%. Net percentage change is:", options:["+10%","+8%","+12%","+6%"], answer:1, exp:"Net = 20 - 10 - (20x10/100) = +8%.", diff:"M", imp:4, tags:["IISc","SSC"], src:"Percentage"},
  {id:"Q12", topic:"Algebra", q:"(a+b)^2 - (a-b)^2 = ?", options:["2ab","4ab","a^2+b^2","2a^2"], answer:1, exp:"Expands to 4ab.", diff:"M", imp:4, tags:["IISc","SSC"], src:"Algebra identities"},
  {id:"Q13", topic:"Trigonometry", q:"Value of sin 30 + cos 60:", options:["0","1","1/2","2"], answer:1, exp:"1/2 + 1/2 = 1.", diff:"E", imp:3, tags:["IISc","SSC"], src:"Trigonometry"},
  {id:"Q14", topic:"HCF/LCM", q:"HCF and LCM of two numbers are 4 and 48. If one number is 16, the other is:", options:["8","12","16","20"], answer:1, exp:"Product = HCFxLCM = 192; other = 192/16 = 12.", diff:"M", imp:3, tags:["IISc","SSC"], src:"Number System"},
  {id:"Q15", topic:"Boats", q:"A boat's speed is 10 km/h and stream is 2 km/h. Downstream speed is:", options:["8","12","5","20"], answer:1, exp:"Downstream = boat + stream = 12 km/h.", diff:"E", imp:3, tags:["IISc","SSC"], src:"Boats and Streams"},
  {id:"Q16", topic:"Data Interpretation", q:"In a pie chart, a sector of 90 degrees represents what percentage of the total?", options:["20%","25%","30%","50%"], answer:1, exp:"90/360 x 100 = 25%.", diff:"E", imp:4, tags:["IISc","SSC","Banking"], src:"Data Interpretation"},
  {id:"Q17", topic:"Mensuration", q:"The diagonal of a square with side 4 is:", options:["8","4√2","16","4"], answer:1, exp:"Diagonal = side x √2 = 4√2.", diff:"E", imp:3, tags:["IISc","SSC"], src:"Mensuration"},
  {id:"Q18", topic:"Profit & Loss", q:"An item sold at 20% profit for Rs.600. Its cost price is:", options:["Rs.480","Rs.500","Rs.520","Rs.450"], answer:1, exp:"CP = 600 x 100/120 = 500.", diff:"M", imp:4, tags:["IISc","SSC"], src:"Profit and Loss"}
];
