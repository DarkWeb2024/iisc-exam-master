/* Flashcards — front/back pairs per subject. Drive the spaced-repetition (SRS) engine.
   Kept factual and verified. The SRS scheduler (srs.js) tracks each card's interval. */
window.FLASHCARDS = [
  // Computer
  {id:"F-C1", subject:"computer", front:"1 byte = ? bits", back:"8 bits (1 nibble = 4 bits)"},
  {id:"F-C2", subject:"computer", front:"Which memory is volatile?", back:"RAM (loses data on power off). ROM is non-volatile."},
  {id:"F-C3", subject:"computer", front:"Full form of CPU", back:"Central Processing Unit (ALU + Control Unit + Registers)"},
  {id:"F-C4", subject:"computer", front:"Father of the computer", back:"Charles Babbage (first programmer: Ada Lovelace)"},
  {id:"F-C5", subject:"computer", front:"IT Act year", back:"2000 (amended 2008)"},
  {id:"F-C6", subject:"computer", front:"Excel formula starts with?", back:"= (equals sign)"},
  {id:"F-C7", subject:"computer", front:"3rd generation computers used?", back:"Integrated Circuits (IC)"},
  {id:"F-C8", subject:"computer", front:"BCC in email means?", back:"Blind Carbon Copy"},
  {id:"F-C9", subject:"computer", front:"E-governance G2C means?", back:"Government to Citizen"},
  // General Awareness
  {id:"F-G1", subject:"general_awareness", front:"Constitution came into force on?", back:"26 January 1950 (adopted 26 Nov 1949)"},
  {id:"F-G2", subject:"general_awareness", front:"Drafting Committee chairman?", back:"Dr. B. R. Ambedkar"},
  {id:"F-G3", subject:"general_awareness", front:"National aquatic animal?", back:"Ganges River Dolphin"},
  {id:"F-G4", subject:"general_awareness", front:"'Mini Constitution' amendment?", back:"42nd Amendment (1976)"},
  {id:"F-G5", subject:"general_awareness", front:"Largest Indian state by area?", back:"Rajasthan (smallest: Goa)"},
  {id:"F-G6", subject:"general_awareness", front:"Vitamin C deficiency causes?", back:"Scurvy (Vitamin D → rickets)"},
  {id:"F-G7", subject:"general_awareness", front:"RBI established / HQ?", back:"1935 / Mumbai"},
  {id:"F-G8", subject:"general_awareness", front:"National song & author?", back:"Vande Mataram — Bankim Chandra Chatterjee"},
  // Quant
  {id:"F-Q1", subject:"quantitative", front:"Simple Interest formula", back:"SI = P × R × T / 100"},
  {id:"F-Q2", subject:"quantitative", front:"Profit% formula", back:"(SP − CP)/CP × 100 (always on CP)"},
  {id:"F-Q3", subject:"quantitative", front:"km/h → m/s", back:"× 5/18"},
  {id:"F-Q4", subject:"quantitative", front:"Two-worker time together", back:"A×B/(A+B)"},
  {id:"F-Q5", subject:"quantitative", front:"Area of circle", back:"π r²  (circumference = 2πr)"},
  {id:"F-Q6", subject:"quantitative", front:"Volume of cylinder", back:"π r² h"},
  // Reasoning
  {id:"F-R1", subject:"reasoning", front:"Clock angle formula", back:"|30H − 5.5M| degrees"},
  {id:"F-R2", subject:"reasoning", front:"Direction shortest distance", back:"Pythagoras: √(NS² + EW²)"},
  {id:"F-R3", subject:"reasoning", front:"'My mother's only son' =", back:"the speaker himself"},
  // Verbal
  {id:"F-V1", subject:"verbal", front:"One word: place for birds", back:"Aviary (bees: apiary)"},
  {id:"F-V2", subject:"verbal", front:"Idiom: 'burn the midnight oil'", back:"to work late into the night"},
  {id:"F-V3", subject:"verbal", front:"'Despite' is followed by?", back:"nothing — never 'despite of'"}
];
