/* import_dataset.js — bulk importer for a LICENSED or SELF-OWNED question dataset.
   This is the realistic path to 5,000: feed a dataset you are legally allowed to use
   (your own authored set, an openly-licensed set, or official sample papers you own),
   and this validates + deduplicates + enriches it into the content bank.

   Usage:  node tools/import_dataset.js <path-to.json> [--source "Standard Textbook Question"]

   Input format: a JSON array of objects with AT LEAST:
     { subject, topic, question, options:[4], answer:(0-3), explanation,
       difficulty?, importance?, sourceType?, tags?, subtopic? }
   subject must be one of: quant | verbal | reasoning | gk | computer

   Rules enforced (same gate as build_questions.js):
     - exactly 4 distinct options, answer 0-3, explanation present
     - NOT a duplicate of anything already in the bank (full stem+options match)
     - sourceType must be a valid label; NEVER auto-label anything as a PYQ
   Accepted questions are written to content/questions/<folder>/imported_<file>.json
   Then run: node tools/build_questions.js */
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..", "content", "questions");
const FOLDERS = ["quant","verbal","reasoning","gk","computer"];
const VALID_SOURCE = ["Verified Previous Year Question","Repeated Previous Year Question","Verified Competitive Question","Standard Textbook Question","Verified Model Question","AI Generated (Verified)"];
const SOLVE = { Easy: 30, Medium: 45, Hard: 75, Expert: 100 };

function norm(s){ return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim(); }
function walk(d){ let o=[]; if(!fs.existsSync(d))return o; for(const f of fs.readdirSync(d)){ const p=path.join(d,f); if(fs.statSync(p).isDirectory())o=o.concat(walk(p)); else if(f.endsWith(".json"))o.push(p);} return o; }

function existingKeys(){
  const set=new Set();
  walk(OUT).forEach(f=>{ try{ JSON.parse(fs.readFileSync(f,"utf8")).forEach(q=>set.add(norm(q.question+" || "+(q.options||[]).join(" | ")))); }catch(e){} });
  return set;
}

function run(){
  const args=process.argv.slice(2);
  const file=args[0];
  const srcFlag=(args.indexOf("--source")>=0)?args[args.indexOf("--source")+1]:null;
  if(!file){ console.error("Usage: node tools/import_dataset.js <dataset.json> [--source \"...\"]"); process.exit(1); }
  let rows; try{ rows=JSON.parse(fs.readFileSync(file,"utf8")); }catch(e){ console.error("Cannot read JSON: "+e.message); process.exit(1); }
  if(!Array.isArray(rows)){ console.error("Dataset must be a JSON array."); process.exit(1); }

  const seen=existingKeys();
  const byFolder={}; let accepted=0,rejected=0,dupes=0; const problems=[];
  rows.forEach((r,i)=>{
    const errs=[];
    if(!FOLDERS.includes(r.subject)) errs.push("subject must be one of "+FOLDERS.join("/"));
    if(!Array.isArray(r.options)||r.options.length!==4) errs.push("need exactly 4 options");
    else if(new Set(r.options.map(o=>String(o).trim().toLowerCase())).size!==4) errs.push("options not distinct");
    if(typeof r.answer!=="number"||r.answer<0||r.answer>3) errs.push("answer must be 0-3");
    if(!r.question||String(r.question).length<5) errs.push("question missing");
    if(!r.explanation||String(r.explanation).length<8) errs.push("explanation missing/too short");
    const src=r.sourceType||srcFlag||"Verified Model Question";
    if(!VALID_SOURCE.includes(src)) errs.push("invalid sourceType");
    if(errs.length){ rejected++; problems.push("row "+i+": "+errs.join(", ")); return; }
    const key=norm(r.question+" || "+r.options.join(" | "));
    if(seen.has(key)){ dupes++; problems.push("row "+i+": duplicate, skipped"); return; }
    seen.add(key);
    const difficulty=r.difficulty||"Medium";
    (byFolder[r.subject]=byFolder[r.subject]||[]).push({
      id:"IMP-"+r.subject.toUpperCase()+"-"+(accepted+1),
      subject:r.subject, section:r.subject, topic:r.topic||"General", subtopic:r.subtopic||r.topic||"General",
      difficulty, question:r.question, options:r.options, answer:r.answer, explanation:r.explanation,
      whyWrong:r.whyWrong||[], memoryTrick:r.memoryTrick||"", shortcut:r.shortcut||"",
      solveTimeSec:SOLVE[difficulty]||45, importance:r.importance||3, repeated:r.repeated||"Occasionally Asked",
      sourceType:src, examName:r.examName||null, year:r.year||null, tags:r.tags||[], keywords:r.keywords||[],
      verificationStatus:r.verificationStatus||"unverified", explanationComplete:!!r.whyWrong,
      createdDate:new Date().toISOString().slice(0,10), lastVerified:r.lastVerified||null, version:1, language:r.language||"en"
    });
    accepted++;
  });
  const base=path.basename(file).replace(/\.json$/,"").replace(/[^a-z0-9]+/gi,"_");
  Object.keys(byFolder).forEach(folder=>{ const dir=path.join(OUT,folder); fs.mkdirSync(dir,{recursive:true}); fs.writeFileSync(path.join(dir,"imported_"+base+".json"),JSON.stringify(byFolder[folder],null,2)); });
  console.log("IMPORT REPORT ("+path.basename(file)+")");
  console.log("  accepted: "+accepted+" | rejected: "+rejected+" | duplicates skipped: "+dupes);
  if(problems.length) console.log("  first issues:\n   - "+problems.slice(0,10).join("\n   - "));
  console.log("  written to content/questions/*/imported_"+base+".json");
  console.log("  NOTE: imported items default to verificationStatus:'unverified' unless your dataset sets it.");
  console.log("  Next: node tools/build_questions.js");
}
run();
