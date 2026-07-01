/* =========================================================================
   IISc Master Prep Portal — application logic (vanilla JS, no framework, no build)
   Offline-first (works from file://). Generic multi-exam via EXAM_REGISTRY.
   State persists in localStorage. Modules: study, practice, flashcards+SRS,
   mock, wrong-answers, revision, planner, analytics, AI tutor, command palette.
   ========================================================================= */
(function () {
  "use strict";
  var EXAM = window.ACTIVE_EXAM;
  var APP_SUBS = ["computer", "general_awareness", "quantitative", "reasoning", "verbal"];

  /* ---------- storage ---------- */
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem("iem_" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("iem_" + k, JSON.stringify(v)); } catch (e) {} }
  };
  var state = {
    solved: LS.get("solved", {}),      // qid -> {correct, ts, conf}
    bookmarks: LS.get("bookmarks", []),
    flash: LS.get("flash", {}),        // cardId -> SRS record
    xp: LS.get("xp", 0),
    examDate: LS.get("examDate", EXAM.examDate),
    dailyGoal: LS.get("dailyGoal", 30),
    streak: LS.get("streak", { last: "", count: 0 }),
    theme: LS.get("theme", "light"),
    accent: LS.get("accent", "blue"),
    density: LS.get("density", "comfortable")
  };
  function persist() { Object.keys(state).forEach(function (k) { LS.set(k, state[k]); }); }

  /* ---------- helpers ---------- */
  function subjectName(id){ for (var i=0;i<SUBJECTS.length;i++) if (SUBJECTS[i].id===id) return SUBJECTS[i].name; return id; }
  function subjectIcon(id){ for (var i=0;i<SUBJECTS.length;i++) if (SUBJECTS[i].id===id) return SUBJECTS[i].icon; return "•"; }
  function allQuestions() {
    var out = [];
    for (var s = 0; s < SUBJECTS.length; s++) { var sid = SUBJECTS[s].id, arr = (window.QDATA[sid] || []);
      for (var i = 0; i < arr.length; i++) { arr[i].subject = sid; out.push(arr[i]); } }
    return out;
  }
  function questionById(id){ var all=allQuestions(); for (var i=0;i<all.length;i++) if (all[i].id===id) return all[i]; return null; }
  function stars(n){ var s=""; for (var i=0;i<5;i++) s+= i<n ? "★" : "☆"; return s; }
  function todayStr(){ return new Date().toISOString().slice(0,10); }
  function esc(t){ return String(t==null?"":t).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }

  /* ---------- stats ---------- */
  function stats() {
    var all = allQuestions(), ids = Object.keys(state.solved), correct = 0, guessCorrect = 0, confWrong = 0;
    ids.forEach(function (id) { var r = state.solved[id]; if (r.correct) correct++; if (r.correct && r.conf === "Guess") guessCorrect++; if (!r.correct && r.conf === "Very confident") confWrong++; });
    var perSubject = {}, perTopic = {};
    all.forEach(function (q) {
      var r = state.solved[q.id];
      if (!perSubject[q.subject]) perSubject[q.subject] = { total: 0, done: 0, correct: 0 };
      perSubject[q.subject].total++;
      var tk = q.subject + "|" + q.topic;
      if (!perTopic[tk]) perTopic[tk] = { subject: q.subject, topic: q.topic, done: 0, correct: 0 };
      if (r) { perSubject[q.subject].done++; perTopic[tk].done++; if (r.correct){ perSubject[q.subject].correct++; perTopic[tk].correct++; } }
    });
    return { total: all.length, solved: ids.length, correct: correct, guessCorrect: guessCorrect, confWrong: confWrong,
      accuracy: ids.length ? Math.round(correct / ids.length * 100) : 0, perSubject: perSubject, perTopic: perTopic };
  }
  function weakStrong() {
    var pt = stats().perTopic, arr = [];
    Object.keys(pt).forEach(function (k) { var t = pt[k]; if (t.done >= 2) { t.acc = Math.round(t.correct / t.done * 100); arr.push(t); } });
    arr.sort(function (a, b) { return a.acc - b.acc; });
    return { weak: arr.slice(0, 5), strong: arr.slice().reverse().slice(0, 5) };
  }
  function readiness() {
    var st = stats(); var comp = st.total ? st.solved / st.total : 0;
    var acc = st.accuracy / 100; var score = Math.round((comp * 0.5 + acc * 0.5) * 100);
    var band = score < 20 ? "Needs Foundation" : score < 40 ? "Developing" : score < 60 ? "Improving" : score < 80 ? "Nearly Ready" : "Exam Ready";
    return { score: score, band: band, predicted: Math.round(EXAM.totalQuestions * acc) };
  }
  function solvedToday(){ var n=0,t=todayStr(); Object.keys(state.solved).forEach(function(id){var r=state.solved[id]; if(r&&new Date(r.ts).toISOString().slice(0,10)===t)n++;}); return n; }
  function dueFlashcards(){ return (window.FLASHCARDS||[]).filter(function(c){ return window.SRS.isDue(state.flash[c.id]); }); }

  /* ---------- insights (rule-based, Part 7) ---------- */
  function insights() {
    var st = stats(), ws = weakStrong(), out = [];
    if (st.solved === 0) { out.push("Start with a diagnostic: take a Mixed mock, then practise your weakest section."); return out; }
    if (ws.weak[0]) out.push("Your weakest topic is " + ws.weak[0].topic + " (" + ws.weak[0].acc + "%) — revise it before the next mock.");
    if (st.guessCorrect >= 3) out.push("You've answered " + st.guessCorrect + " questions correctly by guessing — reinforce those concepts so it isn't luck.");
    if (st.confWrong >= 2) out.push("You were confident but wrong on " + st.confWrong + " questions — watch for over-confidence traps.");
    // weakest subject by accuracy
    var worst = null; SUBJECTS.forEach(function (s) { var p = st.perSubject[s.id]; if (p && p.done >= 2) { var a = p.correct / p.done; if (!worst || a < worst.a) worst = { s: s, a: a }; } });
    if (worst) out.push("Lowest-accuracy section: " + worst.s.name + " (" + Math.round(worst.a * 100) + "%). It " + (EXAM.tiebreaker.indexOf(worst.s.id) < 2 ? "also breaks ties early — high priority." : "needs attention."));
    var due = dueFlashcards().length; if (due) out.push(due + " flashcard" + (due>1?"s are":" is") + " due for spaced revision today.");
    return out.slice(0, 5);
  }

  /* ---------- record ---------- */
  function recordAnswer(qid, correct, conf) {
    var first = !state.solved[qid];
    state.solved[qid] = { correct: correct, ts: Date.now(), conf: conf || (state.solved[qid] && state.solved[qid].conf) };
    if (first) state.xp += correct ? 10 : 3;
    var t = todayStr();
    if (state.streak.last !== t) { var y = new Date(Date.now() - 864e5).toISOString().slice(0,10); state.streak.count = (state.streak.last === y) ? state.streak.count + 1 : 1; state.streak.last = t; }
    persist(); updateXP();
    return first;
  }
  function updateXP(){ var el=document.getElementById("xpBadge"); if(el) el.textContent = state.xp + " XP"; }

  /* ---------- toast ---------- */
  var tt; function toast(m){ var e=document.getElementById("toast"); e.textContent=m; e.classList.add("show"); clearTimeout(tt); tt=setTimeout(function(){e.classList.remove("show");},1800); }

  /* ---------- bookmarks ---------- */
  function isBookmarked(id){ return state.bookmarks.indexOf(id)!==-1; }
  function toggleBookmark(id){ var i=state.bookmarks.indexOf(id); if(i===-1){state.bookmarks.push(id);toast("Bookmarked");}else{state.bookmarks.splice(i,1);toast("Removed");} persist(); }

  /* ---------- question card ---------- */
  function tagPills(q) {
    var h = '<span class="pill ' + (q.diff==="H"?"bad":q.diff==="M"?"warn":"good") + '">' + (q.diff==="E"?"Easy":q.diff==="M"?"Medium":"Hard") + '</span>';
    h += '<span class="pill primary"><span class="stars">'+stars(q.imp)+'</span></span>';
    (q.tags||[]).forEach(function(t){ h += t==="Predicted" ? '<span class="pill warn">Predicted</span>' : '<span class="pill">'+esc(t)+'</span>'; });
    return h;
  }
  function questionCard(q) {
    var rec = state.solved[q.id];
    var div = document.createElement("div"); div.className="q-card"; div.dataset.qid=q.id;
    div.innerHTML = '<div class="q-meta">' + tagPills(q) + '<span class="pill">'+esc(subjectName(q.subject))+'</span>' +
      '<button class="icon-btn bm" title="Bookmark" style="margin-left:auto">'+(isBookmarked(q.id)?"🔖":"🏷️")+'</button></div>' +
      '<div class="q-text">'+esc(q.q)+'</div><div class="opts"></div><div class="exp" style="display:none"></div><div class="conf-row" style="display:none"></div>';
    var optsWrap=div.querySelector(".opts"), expEl=div.querySelector(".exp"), confEl=div.querySelector(".conf-row");
    q.options.forEach(function (optText, idx) {
      var b=document.createElement("button"); b.className="opt"; b.textContent=String.fromCharCode(65+idx)+". "+optText;
      b.addEventListener("click", function () {
        if (b.disabled) return;
        var buttons=optsWrap.querySelectorAll(".opt"); buttons.forEach(function(x){x.disabled=true;});
        var correct=idx===q.answer; buttons[q.answer].classList.add("correct"); if(!correct)b.classList.add("wrong");
        expEl.style.display="block";
        expEl.innerHTML="<strong>"+(correct?"Correct ✓":"Answer: "+String.fromCharCode(65+q.answer))+"</strong> — "+esc(q.exp)+(q.src?'<br><span class="muted">Source: '+esc(q.src)+'</span>':"");
        recordAnswer(q.id, correct);
        // confidence capture
        confEl.style.display="flex";
        confEl.innerHTML='<span class="muted" style="align-self:center">How sure were you?</span>';
        ["Very confident","Somewhat","Guess"].forEach(function(c){
          var cb=document.createElement("button"); cb.className="btn sm"; cb.textContent=c;
          cb.onclick=function(){ state.solved[q.id].conf=c; persist(); confEl.querySelectorAll(".btn").forEach(function(x){x.classList.remove("sel");}); cb.classList.add("sel"); };
          confEl.appendChild(cb);
        });
      });
      optsWrap.appendChild(b);
    });
    if (rec) {
      var bts=optsWrap.querySelectorAll(".opt"); bts.forEach(function(x){x.disabled=true;}); bts[q.answer].classList.add("correct");
      expEl.style.display="block"; expEl.innerHTML="<strong>"+(rec.correct?"You answered correctly ✓":"Answer: "+String.fromCharCode(65+q.answer))+"</strong> — "+esc(q.exp);
    }
    div.querySelector(".bm").addEventListener("click", function(){ toggleBookmark(q.id); this.textContent=isBookmarked(q.id)?"🔖":"🏷️"; });
    return div;
  }

  var main=document.getElementById("main"); function setHTML(h){ main.innerHTML=h; }
  function card(stat,label,sub){ return '<div class="card"><div class="stat">'+esc(stat)+'</div><div class="stat-label">'+esc(label)+'</div>'+(sub?'<div class="muted" style="font-size:12px">'+esc(sub)+'</div>':'')+'</div>'; }
  function chartRow(label,val,total){ var pct=total?Math.round(val/total*100):0; return '<div class="chartrow"><div class="label">'+esc(label)+'</div><div class="track"><div class="fill" style="width:'+pct+'%"></div></div><div class="val">'+val+"/"+total+'</div></div>'; }

  /* ---------- Dashboard ---------- */
  function viewDashboard() {
    var st=stats(), ws=weakStrong(), rd=readiness();
    var days=Math.ceil((new Date(state.examDate)-new Date(todayStr()))/864e5);
    var comp=Math.round(st.solved/st.total*100), goalDone=solvedToday(), goalPct=Math.min(100,Math.round(goalDone/state.dailyGoal*100));
    var h='<h1>Dashboard <span class="muted" style="font-size:.9rem">· '+esc(EXAM.name)+'</span></h1>';
    h+='<div class="grid cards">'+card(days>=0?days:0,"Days to exam","("+esc(state.examDate)+")")+
       card(comp+"%","Completion",st.solved+" / "+st.total)+card(st.accuracy+"%","Accuracy",st.correct+" correct")+
       card(rd.score+"%","Exam readiness",rd.band)+'</div>';
    h+='<div class="grid cards" style="margin-top:16px">'+
       '<div class="card"><div class="stat-label">Predicted score</div><div class="stat">'+rd.predicted+' / '+EXAM.totalQuestions+'</div><div class="muted" style="font-size:12px">estimate from your accuracy</div></div>'+
       '<div class="card"><div class="stat-label">Today\'s goal</div><div class="stat">'+goalDone+' / '+state.dailyGoal+'</div><div class="bar"><span style="width:'+goalPct+'%"></span></div></div>'+
       '<div class="card"><div class="stat-label">Streak / XP</div><div class="stat">🔥 '+state.streak.count+'</div><div class="muted" style="font-size:12px">'+state.xp+' XP · '+dueFlashcards().length+' cards due</div></div>'+
       '</div>';
    h+='<div class="card" style="margin-top:16px"><div class="stat-label">Learning insights</div><ul>'+insights().map(function(i){return '<li>'+esc(i)+'</li>';}).join("")+'</ul></div>';
    h+='<div class="grid cards" style="margin-top:16px">'+
       '<div class="card"><div class="stat-label">Weak topics</div>'+(ws.weak.length?ws.weak.map(function(t){return '<div>'+esc(t.topic)+' <span class="pill bad">'+t.acc+'%</span></div>';}).join(""):'<span class="muted">Answer a few questions.</span>')+'</div>'+
       '<div class="card"><div class="stat-label">Strong topics</div>'+(ws.strong.length?ws.strong.map(function(t){return '<div>'+esc(t.topic)+' <span class="pill good">'+t.acc+'%</span></div>';}).join(""):'<span class="muted">—</span>')+'</div>'+
       '</div>';
    h+='<div class="btn-row" style="margin-top:16px"><a class="btn" href="#planner">📅 Today\'s plan</a><a class="btn ghost" href="#practice">Practice</a><a class="btn ghost" href="#flashcards">Flashcards</a><a class="btn ghost" href="#mock">Mock test</a></div>';
    h+='<p class="muted">Press <strong>Ctrl+K</strong> for the command palette · <strong>T</strong> theme · <strong>/</strong> search.</p>';
    setHTML(h);
  }

  /* ---------- Planner (Part 5) ---------- */
  function viewPlanner() {
    var ws=weakStrong(), due=dueFlashcards();
    var recSubject=null,best=2,ps=stats().perSubject;
    SUBJECTS.forEach(function(s){var p=ps[s.id]||{total:1,done:0};var r=p.done/p.total;if(r<best){best=r;recSubject=s;}});
    var h='<h1>Daily Planner</h1><p class="muted">An adaptive plan generated from your weak areas, due revision, and completion. [rule-based]</p>';
    h+='<div class="card"><h2>Today\'s plan</h2><ol>';
    h+='<li><strong>Diagnostic warm-up:</strong> 10-question Mixed mock → <a href="#mock">Mock Tests</a></li>';
    if(recSubject) h+='<li><strong>Study + practise:</strong> '+esc(recSubject.name)+' (least complete) → <a href="#practice/'+recSubject.id+'">practise</a></li>';
    if(ws.weak[0]) h+='<li><strong>Fix weak topic:</strong> '+esc(ws.weak[0].topic)+' ('+ws.weak[0].acc+'%) — read theory, then 10 questions</li>';
    h+='<li><strong>Spaced revision:</strong> '+due.length+' flashcard(s) due → <a href="#flashcards">review now</a></li>';
    h+='<li><strong>Wrap up:</strong> review <a href="#wrong">wrong answers</a> + 5-min <a href="#revision">revision</a></li>';
    h+='</ol><p class="muted">Estimated: ~2 hours.</p></div>';
    h+='<div class="card"><h2>Exam priority (official tiebreaker)</h2><p class="muted">On equal totals IISc ranks: '+EXAM.tiebreaker.map(function(id){return subjectName(id);}).join(" › ")+'. So Reasoning is your highest-value section.</p></div>';
    setHTML(h);
  }

  /* ---------- Study ---------- */
  function viewStudy(sid){
    sid=sid||SUBJECTS[0].id;
    var h='<h1>Study</h1><div class="tabs" id="subjTabs">';
    SUBJECTS.forEach(function(s){h+='<button class="tab'+(s.id===sid?" active":"")+'" data-sid="'+s.id+'">'+esc(s.icon+" "+s.name)+'</button>';});
    h+='</div><div class="tabs" id="innerTabs"><button class="tab active" data-t="learn">Learn</button><button class="tab" data-t="sources">Sources</button></div><div id="studyBody"></div>';
    setHTML(h);
    document.querySelectorAll("#subjTabs .tab").forEach(function(b){b.onclick=function(){location.hash="#study/"+b.dataset.sid;};});
    var study=STUDY[sid]||{learn:"",sources:[]}, body=document.getElementById("studyBody");
    function learn(){ body.innerHTML='<div class="card"><h2>Learn — '+esc(subjectName(sid))+'</h2><p>'+esc(study.learn)+'</p></div>'; }
    function sources(){ var items=(study.sources||[]).slice().sort(function(a,b){return b.rank-a.rank;});
      body.innerHTML='<div class="card"><h2>Best sources (ranked)</h2>'+items.map(function(r){return '<div class="source-item"><span class="stars">'+stars(r.rank)+'</span> <strong>['+esc(r.type)+']</strong> '+(r.url?'<a href="'+esc(r.url)+'" target="_blank" rel="noopener">'+esc(r.title)+'</a>':esc(r.title))+'<div class="muted" style="font-size:13px">'+esc(r.note)+'</div></div>';}).join("")+'</div>'; }
    learn();
    document.querySelectorAll("#innerTabs .tab").forEach(function(b){b.onclick=function(){document.querySelectorAll("#innerTabs .tab").forEach(function(x){x.classList.remove("active");});b.classList.add("active");(b.dataset.t==="learn"?learn:sources)();};});
  }

  /* ---------- Practice ---------- */
  var pf={subject:SUBJECTS[0].id,topic:"All",diff:"All",imp:"All",status:"All",tag:"All"};
  function viewPractice(sid){
    if(sid)pf.subject=sid;
    var h='<h1>Practice</h1><div class="tabs" id="pSubj">';
    SUBJECTS.forEach(function(s){h+='<button class="tab'+(s.id===pf.subject?" active":"")+'" data-sid="'+s.id+'">'+esc(s.icon+" "+s.name)+'</button>';});
    h+='</div><div class="filters">'+sel("fTopic","Topic",["All"].concat(topicsFor(pf.subject)),pf.topic)+sel("fDiff","Difficulty",["All","Easy","Medium","Hard"],pf.diff)+sel("fImp","Importance",["All","5","4","3"],pf.imp)+sel("fStatus","Status",["All","Unsolved","Solved","Incorrect","Bookmarked"],pf.status)+sel("fTag","Repeated in",["All","Predicted","IISc","SSC","KPSC","Banking","PSU"],pf.tag)+'</div><div class="muted" id="pCount"></div><div id="pList"></div>';
    setHTML(h);
    document.querySelectorAll("#pSubj .tab").forEach(function(b){b.onclick=function(){location.hash="#practice/"+b.dataset.sid;};});
    bindF("fTopic","topic");bindF("fDiff","diff");bindF("fImp","imp");bindF("fStatus","status");bindF("fTag","tag");
    renderPractice();
  }
  function bindF(id,k){var e=document.getElementById(id);if(e)e.onchange=function(){pf[k]=e.value;renderPractice();};}
  function topicsFor(sid){var t={};(window.QDATA[sid]||[]).forEach(function(q){t[q.topic]=1;});return Object.keys(t);}
  function sel(id,label,opts,s){return '<label>'+esc(label)+': <select id="'+id+'">'+opts.map(function(o){return '<option'+(String(o)===String(s)?" selected":"")+'>'+esc(o)+'</option>';}).join("")+'</select></label>';}
  function passes(q){var f=pf;if(q.subject!==f.subject)return false;if(f.topic!=="All"&&q.topic!==f.topic)return false;if(f.diff!=="All"&&({Easy:"E",Medium:"M",Hard:"H"}[f.diff])!==q.diff)return false;if(f.imp!=="All"&&String(q.imp)!==f.imp)return false;if(f.tag!=="All"&&(q.tags||[]).indexOf(f.tag)===-1)return false;var r=state.solved[q.id];if(f.status==="Unsolved"&&r)return false;if(f.status==="Solved"&&!r)return false;if(f.status==="Incorrect"&&!(r&&!r.correct))return false;if(f.status==="Bookmarked"&&!isBookmarked(q.id))return false;return true;}
  function renderPractice(){var list=document.getElementById("pList");list.innerHTML="";var qs=(window.QDATA[pf.subject]||[]).slice();qs.forEach(function(q){q.subject=pf.subject;});qs=qs.filter(passes).sort(function(a,b){return b.imp-a.imp;});document.getElementById("pCount").textContent=qs.length+" question(s) — sorted by importance.";if(!qs.length){list.innerHTML='<div class="card muted">No questions match these filters.</div>';return;}qs.forEach(function(q){list.appendChild(questionCard(q));});}

  /* ---------- Flashcards + SRS (Part 8) ---------- */
  var flashState=null;
  function viewFlashcards(sid){
    var pool=(window.FLASHCARDS||[]).slice();
    var due=pool.filter(function(c){return window.SRS.isDue(state.flash[c.id]);});
    var h='<h1>Flashcards</h1><p class="muted">Spaced repetition (SM-2). '+due.length+' of '+pool.length+' cards due today. Click a card to flip; grade honestly.</p>';
    h+='<div class="filters"><label>Deck: <select id="fcDeck"><option value="due">Due today ('+due.length+')</option><option value="all">All ('+pool.length+')</option>';
    SUBJECTS.forEach(function(s){h+='<option value="'+s.id+'">'+esc(s.name)+'</option>';});
    h+='</select></label></div><div id="fcArea"></div>';
    setHTML(h);
    document.getElementById("fcDeck").onchange=function(){ startDeck(this.value); };
    startDeck("due");
  }
  function startDeck(kind){
    var pool=(window.FLASHCARDS||[]).slice();
    if(kind==="due") pool=pool.filter(function(c){return window.SRS.isDue(state.flash[c.id]);});
    else if(kind!=="all") pool=pool.filter(function(c){return c.subject===kind;});
    flashState={pool:pool,i:0,flipped:false};
    renderFlash();
  }
  function renderFlash(){
    var area=document.getElementById("fcArea"); if(!area)return;
    var fs=flashState;
    if(!fs.pool.length){ area.innerHTML='<div class="card muted">No cards in this deck. 🎉 All caught up — check back tomorrow for due cards.</div>'; return; }
    if(fs.i>=fs.pool.length){ area.innerHTML='<div class="card"><h2>Deck complete 🎉</h2><p class="muted">You reviewed '+fs.pool.length+' card(s). Come back tomorrow for the next due batch.</p></div>'; return; }
    var c=fs.pool[fs.i], ret=window.SRS.retention(state.flash[c.id]);
    var h='<div class="muted">Card '+(fs.i+1)+' / '+fs.pool.length+' · '+esc(subjectName(c.subject))+' · retention '+ret+'%</div>';
    h+='<div class="flash"><div class="flash-card" id="flcard">'+(fs.flipped?('<div>'+esc(c.back)+'</div>'):('<div>'+esc(c.front)+'<div class="muted" style="font-size:.85rem;margin-top:10px">(click to reveal)</div></div>'))+'</div>';
    if(fs.flipped){ h+='<div class="grade-row"><button class="btn grade-again" data-g="0">Again</button><button class="btn grade-hard" data-g="1">Hard</button><button class="btn grade-good" data-g="2">Good</button><button class="btn grade-easy" data-g="3">Easy</button></div>'; }
    h+='</div>';
    area.innerHTML=h;
    document.getElementById("flcard").onclick=function(){ fs.flipped=!fs.flipped; renderFlash(); };
    area.querySelectorAll(".grade-row .btn").forEach(function(b){ b.onclick=function(){ var g=+b.dataset.g; state.flash[c.id]=window.SRS.schedule(state.flash[c.id],g); state.xp+=5; persist(); updateXP(); fs.i++; fs.flipped=false; renderFlash(); }; });
  }

  /* ---------- Wrong Answer Notebook (Part 4) ---------- */
  function viewWrong(){
    var wrong=Object.keys(state.solved).filter(function(id){return !state.solved[id].correct;}).map(questionById).filter(Boolean);
    var h='<h1>Wrong Answer Notebook</h1><p class="muted">Every question you answered incorrectly, auto-collected. Retry them until mastered.</p>';
    if(!wrong.length){ setHTML(h+'<div class="card muted">No wrong answers yet — either you\'re perfect, or you haven\'t practised. Go to <a href="#practice">Practice</a>.</div>'); return; }
    // group by subject
    var bySub={}; wrong.forEach(function(q){ (bySub[q.subject]=bySub[q.subject]||[]).push(q); });
    h+='<div class="btn-row"><button class="btn" id="retryAll">Retry all ('+wrong.length+')</button><span class="muted" style="align-self:center">grouped by section</span></div><div id="wList"></div>';
    setHTML(h);
    var list=document.getElementById("wList");
    Object.keys(bySub).forEach(function(sid){ var head=document.createElement("h2"); head.textContent=subjectIcon(sid)+" "+subjectName(sid)+" ("+bySub[sid].length+")"; list.appendChild(head); bySub[sid].forEach(function(q){ list.appendChild(questionCard(q)); }); });
    document.getElementById("retryAll").onclick=function(){ wrong.forEach(function(q){ delete state.solved[q.id]; }); persist(); toast("Cleared — retry them"); viewWrong(); };
  }

  /* ---------- PYQ ---------- */
  function viewPYQ(){
    var h='<h1>Previous Year Questions</h1>';
    h+='<div class="card"><h2>Official IISc previous papers</h2><p class="pill bad">Not available</p><p>'+esc(PYQ.officialNote)+'</p></div>';
    h+='<div class="card"><h2>Where to get genuine practice (ranked)</h2>'+PYQ.sources.slice().sort(function(a,b){return b.rank-a.rank;}).map(function(s){return '<div class="source-item"><span class="stars">'+stars(s.rank)+'</span> '+(s.url?'<a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.name)+'</a>':esc(s.name))+'<div class="muted" style="font-size:13px">'+esc(s.note)+'</div></div>';}).join("")+'</div>';
    h+='<div class="card"><h2>Cross-exam pattern overlap</h2><table><tr><th>Pattern</th><th>IISc</th><th>SSC</th><th>KPSC</th><th>Banking</th><th>Probability</th></tr>'+PYQ.overlap.map(function(o){return '<tr><td>'+esc(o.pattern)+'</td><td>'+esc(o.iisc)+'</td><td>'+esc(o.ssc)+'</td><td>'+esc(o.kpsc)+'</td><td>'+esc(o.banking)+'</td><td><strong>'+esc(o.prob)+'</strong></td></tr>';}).join("")+'</table></div>';
    setHTML(h);
  }

  /* ---------- Predictions ---------- */
  function viewPredictions(){
    var h='<h1>Prediction Engine</h1><p class="muted">[PREDICTION] Highest-probability calls from syllabus overlap. Not an official paper.</p>';
    var order={"Very High":0,"High":1,"Medium":2,"Low":3};
    PREDICTIONS.slice().sort(function(a,b){return order[a.conf]-order[b.conf];}).forEach(function(p){ var cls=p.conf==="Very High"?"good":p.conf==="High"?"primary":"warn"; h+='<div class="q-card"><div class="q-meta"><span class="pill '+cls+'">'+esc(p.conf)+'</span><span class="pill">'+esc(subjectName(p.subject))+'</span></div><div class="q-text">'+esc(p.q)+'</div><div class="muted"><strong>Why:</strong> '+esc(p.reason)+'</div></div>'; });
    setHTML(h);
  }

  /* ---------- Formula sheets ---------- */
  function viewFormulas(){
    var h='<h1>Formula Sheets</h1><div class="btn-row"><button class="btn" onclick="window.print()">🖨️ Print / Save as PDF</button></div>';
    Object.keys(FORMULAS).forEach(function(sid){ h+='<div class="card"><h2>'+esc(subjectName(sid))+'</h2>'; FORMULAS[sid].forEach(function(g){ h+='<div class="fs-group"><h3>'+esc(g.h)+'</h3><ul>'+g.items.map(function(i){return '<li>'+esc(i)+'</li>';}).join("")+'</ul></div>'; }); h+='</div>'; });
    setHTML(h);
  }

  /* ---------- Glossary + directories (Part 10) ---------- */
  function viewGlossary(){
    var h='<h1>Glossary & References</h1>';
    h+='<div class="tabs" id="gTabs"><button class="tab active" data-t="glossary">Glossary</button><button class="tab" data-t="abbr">Abbreviations</button><button class="tab" data-t="formula">Formula Directory</button></div><div id="gBody"></div>';
    setHTML(h);
    var body=document.getElementById("gBody");
    function glossary(){ body.innerHTML='<div class="card">'+(window.GLOSSARY||[]).map(function(g){return '<div class="source-item"><strong>'+esc(g.term)+'</strong> <span class="pill">'+esc(subjectName(g.subject))+'</span><div class="muted" style="font-size:13px">'+esc(g.def)+'</div></div>';}).join("")+'</div>'; }
    function abbr(){ body.innerHTML='<div class="card"><table><tr><th>Abbr</th><th>Full form</th></tr>'+(window.ABBREVIATIONS||[]).map(function(a){return '<tr><td><strong>'+esc(a.abbr)+'</strong></td><td>'+esc(a.full)+'</td></tr>';}).join("")+'</table></div>'; }
    function formula(){ var h2=''; Object.keys(FORMULAS).forEach(function(sid){ FORMULAS[sid].forEach(function(g){ h2+='<div class="fs-group"><h3>'+esc(subjectName(sid))+' — '+esc(g.h)+'</h3><ul>'+g.items.map(function(i){return '<li>'+esc(i)+'</li>';}).join("")+'</ul></div>'; }); }); body.innerHTML='<div class="card">'+h2+'</div>'; }
    glossary();
    document.querySelectorAll("#gTabs .tab").forEach(function(b){b.onclick=function(){document.querySelectorAll("#gTabs .tab").forEach(function(x){x.classList.remove("active");});b.classList.add("active");({glossary:glossary,abbr:abbr,formula:formula}[b.dataset.t])();};});
  }

  /* ---------- Bookmarks ---------- */
  function viewBookmarks(){
    var h='<h1>Bookmarks</h1>';
    if(!state.bookmarks.length){setHTML(h+'<div class="card muted">No bookmarks yet. Tap 🏷️ on any question.</div>');return;}
    setHTML(h+'<div id="bmList"></div>'); var list=document.getElementById("bmList");
    state.bookmarks.forEach(function(id){var q=questionById(id);if(q)list.appendChild(questionCard(q));});
  }

  /* ---------- Revision ---------- */
  function viewRevision(){
    var R=REVISION; var h='<h1>Revision</h1>';
    [["⏱️ 30-minute revision",R.min30],["⏱️ 15-minute revision",R.min15],["⏱️ 5-minute revision",R.min5],["⏱️ 1-minute revision",R.min1]].forEach(function(x){h+='<div class="card"><h2>'+esc(x[0])+'</h2><p>'+esc(x[1])+'</p></div>';});
    h+='<div class="card"><h2>Last-minute facts</h2><ul>'+R.lastMinute.map(function(f){return '<li>'+esc(f)+'</li>';}).join("")+'</ul></div>';
    h+='<div class="btn-row"><a class="btn" href="#flashcards">Review due flashcards ('+dueFlashcards().length+')</a></div>';
    setHTML(h);
  }

  /* ---------- Mock (exam-pattern) ---------- */
  var mock=null;
  function viewMock(){
    if(mock&&mock.active)return renderMockRunning();
    var h='<h1>Mock Tests</h1><div class="card"><h2>Create a test</h2><div class="filters">'+
      sel("mkType","Type",["Mixed (all subjects)","Full (IISc pattern)"].concat(SUBJECTS.map(function(s){return s.name;})),"Mixed (all subjects)")+
      sel("mkCount","Questions",["10","20","30"],"10")+sel("mkTimed","Timer",["Timed","Untimed"],"Timed")+
      '</div><button class="btn" id="mkStart">Start test</button><p class="muted" style="margin-top:8px">"Full (IISc pattern)" uses the official '+EXAM.sections.map(function(s){return s.count+" "+subjectName(s.subject).split(" ")[0];}).join(" · ")+' blueprint (capped to the current verified bank).</p></div>';
    setHTML(h); document.getElementById("mkStart").onclick=startMock;
  }
  function startMock(){
    var type=document.getElementById("mkType").value, count=parseInt(document.getElementById("mkCount").value,10), timed=document.getElementById("mkTimed").value==="Timed";
    var pool=[];
    if(type==="Full (IISc pattern)"){
      EXAM.sections.forEach(function(sec){ var arr=(window.QDATA[sec.subject]||[]).slice().sort(function(a,b){return b.imp-a.imp;}); arr.slice(0,sec.count).forEach(function(q){q.subject=sec.subject;pool.push(q);}); });
      count=pool.length;
    } else {
      pool=allQuestions(); if(type!=="Mixed (all subjects)")pool=pool.filter(function(q){return subjectName(q.subject)===type;});
      pool=pool.slice().sort(function(a,b){return b.imp-a.imp;}).slice(0,count);
    }
    for(var i=pool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=pool[i];pool[i]=pool[j];pool[j]=t;}
    mock={active:true,qs:pool,answers:{},idx:0,timed:timed,remaining:pool.length*60,timer:null};
    if(timed)mock.timer=setInterval(function(){mock.remaining--;var e=document.getElementById("mkTimer");if(e)e.textContent=fmt(mock.remaining);if(mock.remaining<=0)submitMock();},1000);
    renderMockRunning();
  }
  function fmt(s){s=Math.max(0,s);var m=Math.floor(s/60),ss=s%60;return m+":"+(ss<10?"0":"")+ss;}
  function renderMockRunning(){
    var q=mock.qs[mock.idx];
    var h='<h1>Mock Test</h1><div class="q-meta"><span class="pill primary">Q '+(mock.idx+1)+' / '+mock.qs.length+'</span><span class="pill">'+esc(subjectName(q.subject))+'</span>'+(mock.timed?'<span class="mock-timer" id="mkTimer" style="margin-left:auto">'+fmt(mock.remaining)+'</span>':'')+'</div>';
    h+='<div class="q-card"><div class="q-text">'+esc(q.q)+'</div><div class="opts"></div></div><div class="btn-row"><button class="btn ghost" id="mkPrev">← Prev</button><button class="btn ghost" id="mkNext">Next →</button><button class="btn" id="mkSubmit">Submit test</button></div>';
    setHTML(h); var wrap=main.querySelector(".opts");
    q.options.forEach(function(o,idx){var b=document.createElement("button");b.className="opt";b.textContent=String.fromCharCode(65+idx)+". "+o;if(mock.answers[q.id]===idx)b.style.borderColor="var(--primary)";b.onclick=function(){mock.answers[q.id]=idx;renderMockRunning();};wrap.appendChild(b);});
    document.getElementById("mkPrev").onclick=function(){if(mock.idx>0){mock.idx--;renderMockRunning();}};
    document.getElementById("mkNext").onclick=function(){if(mock.idx<mock.qs.length-1){mock.idx++;renderMockRunning();}};
    document.getElementById("mkSubmit").onclick=submitMock;
  }
  function submitMock(){
    if(mock.timer)clearInterval(mock.timer);
    var correct=0,wrong=0,skipped=0,bySub={};
    mock.qs.forEach(function(q){var a=mock.answers[q.id];if(!bySub[q.subject])bySub[q.subject]={c:0,t:0};bySub[q.subject].t++;if(a==null)skipped++;else if(a===q.answer){correct++;bySub[q.subject].c++;recordAnswer(q.id,true);}else{wrong++;recordAnswer(q.id,false);}});
    var score=(correct-wrong*EXAM.negativeMark).toFixed(2);
    var h='<h1>Result</h1><div class="grid cards">'+card(correct,"Correct","")+card(wrong,"Wrong (−"+EXAM.negativeMark+" each)","")+card(skipped,"Skipped","")+card(score,"Net score","of "+mock.qs.length)+'</div>';
    h+='<div class="card" style="margin-top:16px"><h2>Section-wise</h2>';Object.keys(bySub).forEach(function(s){h+=chartRow(subjectName(s),bySub[s].c,bySub[s].t);});h+='</div>';
    h+='<div class="card"><h2>Review</h2><div id="mkReview"></div></div><div class="btn-row"><button class="btn" id="mkAgain">New test</button><a class="btn ghost" href="#wrong">Wrong answers</a></div>';
    mock.active=false; setHTML(h);
    var rev=document.getElementById("mkReview"); mock.qs.forEach(function(q){rev.appendChild(questionCard(q));});
    document.getElementById("mkAgain").onclick=function(){mock=null;location.hash="#mock";};
  }

  /* ---------- Analytics ---------- */
  function viewProgress(){
    var st=stats(),ws=weakStrong(),rd=readiness();
    var h='<h1>Analytics</h1><div class="grid cards">'+card(st.solved+"/"+st.total,"Solved","")+card(st.accuracy+"%","Accuracy","")+card(rd.score+"%","Readiness",rd.band)+card("🔥 "+state.streak.count,"Streak","")+'</div>';
    h+='<div class="card" style="margin-top:16px"><h2>Completion by section</h2>';SUBJECTS.forEach(function(s){var p=st.perSubject[s.id]||{done:0,total:0};h+=chartRow(s.name,p.done,p.total);});h+='</div>';
    h+='<div class="card"><h2>Accuracy by section</h2>';SUBJECTS.forEach(function(s){var p=st.perSubject[s.id]||{correct:0,done:0};h+=chartRow(s.name,p.correct,p.done||0);});h+='</div>';
    h+='<div class="card"><h2>Confidence vs correctness</h2><p class="muted">Correct-by-guess: '+st.guessCorrect+' · Confident-but-wrong: '+st.confWrong+'. These flag shaky knowledge to revise.</p></div>';
    h+='<div class="card"><h2>Insights</h2><ul>'+insights().map(function(i){return '<li>'+esc(i)+'</li>';}).join("")+'</ul></div>';
    h+='<div class="grid cards"><div class="card"><h2>Weak topics</h2>'+(ws.weak.length?ws.weak.map(function(t){return '<div>'+esc(t.topic)+' <span class="pill bad">'+t.acc+'%</span></div>';}).join(""):'<span class="muted">—</span>')+'</div><div class="card"><h2>Achievements</h2>'+achievementsHTML()+'</div></div>';
    setHTML(h);
  }
  function achievementsHTML(){
    var st=stats(),rd=readiness();
    var list=[
      {e:"🎯",t:"First question",got:st.solved>=1},
      {e:"💯",t:"50 solved",got:st.solved>=50},
      {e:"🔥",t:"7-day streak",got:state.streak.count>=7},
      {e:"🧠",t:"80%+ accuracy (20+ done)",got:st.solved>=20&&st.accuracy>=80},
      {e:"🏆",t:"Exam Ready (80%)",got:rd.score>=80}
    ];
    return list.map(function(a){return '<div class="ach'+(a.got?"":" locked")+'"><span class="emoji">'+a.e+'</span><span>'+esc(a.t)+'</span>'+(a.got?'<span class="pill good" style="margin-left:auto">unlocked</span>':'')+'</div>';}).join("");
  }

  /* ---------- AI Tutor (Part 9) ---------- */
  var aiLog=[];
  function viewAI(){
    var h='<h1>AI Tutor</h1><p class="muted">Retrieval-grounded: answers come <strong>only</strong> from this platform\'s verified content — it never fabricates. (Cloud LLM via your own key is an optional future add-on.)</p>';
    h+='<div class="card"><div class="ai-log" id="aiLog"></div><div class="ai-input-row"><input id="aiInput" type="text" placeholder="Ask: \'What is RAM?\', \'explain profit\', \'IT Act year\'…" aria-label="Ask the AI tutor"><button class="btn" id="aiSend">Ask</button></div><div class="btn-row" style="margin-top:8px">'+
      ['What is RAM?','Explain profit and loss','IT Act year','national aquatic animal'].map(function(s){return '<button class="btn ghost sm ai-suggest">'+esc(s)+'</button>';}).join("")+'</div></div>';
    setHTML(h);
    renderAILog();
    document.getElementById("aiSend").onclick=aiAsk;
    document.getElementById("aiInput").addEventListener("keydown",function(e){if(e.key==="Enter")aiAsk();});
    document.querySelectorAll(".ai-suggest").forEach(function(b){b.onclick=function(){document.getElementById("aiInput").value=b.textContent;aiAsk();};});
  }
  function renderAILog(){var l=document.getElementById("aiLog");if(!l)return;l.innerHTML=aiLog.map(function(m){return '<div class="ai-msg '+m.role+'">'+esc(m.text).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")+(m.src?'<span class="src">'+esc(m.src)+'</span>':'')+'</div>';}).join("");l.scrollTop=l.scrollHeight;}
  function aiAsk(){var inp=document.getElementById("aiInput");var q=inp.value.trim();if(!q)return;aiLog.push({role:"user",text:q});inp.value="";renderAILog();window.AITutor.answer(q,{provider:"local"}).then(function(r){aiLog.push({role:"bot",text:r.text,src:r.src});renderAILog();});}

  /* ---------- Notes ---------- */
  function viewNotes(){
    var h='<h1>Notes</h1><p class="muted">Personal notes (Markdown-friendly). Auto-saved on this device.</p><textarea class="notes" id="notesArea" placeholder="# My notes">'+esc(LS.get("notes",""))+'</textarea><div class="btn-row"><button class="btn ghost" id="notesExport">Export .txt</button><span class="muted" id="notesSaved"></span></div>';
    setHTML(h);
    var ta=document.getElementById("notesArea"),saved=document.getElementById("notesSaved"),t;
    ta.addEventListener("input",function(){clearTimeout(t);t=setTimeout(function(){LS.set("notes",ta.value);saved.textContent="Saved ✓";setTimeout(function(){saved.textContent="";},1200);},400);});
    document.getElementById("notesExport").onclick=function(){dl("iisc_notes.txt",ta.value);};
  }

  /* ---------- Settings ---------- */
  function viewSettings(){
    var h='<h1>Settings</h1>';
    h+='<div class="card"><h2>Exam date</h2><input type="date" id="setDate" value="'+esc(state.examDate)+'"><button class="btn sm" id="saveDate">Save</button></div>';
    h+='<div class="card"><h2>Daily goal</h2><input type="number" id="setGoal" value="'+state.dailyGoal+'" min="5" max="200" style="width:90px"><button class="btn sm" id="saveGoal">Save</button></div>';
    h+='<div class="card"><h2>Appearance</h2><div class="btn-row"><button class="btn ghost" id="setTheme">Toggle light / dark</button></div>'+
       '<label>Accent: <select id="setAccent">'+["blue","green","purple","orange","red","teal","gray"].map(function(a){return '<option'+(a===state.accent?" selected":"")+'>'+a+'</option>';}).join("")+'</select></label> '+
       '<label style="margin-left:12px">Density: <select id="setDensity"><option'+(state.density==="comfortable"?" selected":"")+'>comfortable</option><option'+(state.density==="compact"?" selected":"")+'>compact</option></select></label></div>';
    h+='<div class="card"><h2>Export</h2><div class="btn-row"><button class="btn ghost" id="expBm">Bookmarked (.txt)</button><button class="btn ghost" id="expWrong">Incorrect (.txt)</button><button class="btn ghost" id="expData">All data (.json)</button></div></div>';
    h+='<div class="card"><h2>Reset</h2><button class="btn" style="background:var(--bad)" id="resetAll">Reset everything</button></div>';
    h+='<div class="card"><h2>About</h2><p class="muted">IISc Master Prep Portal — offline-first, multi-exam. Data stays on this device. Content labelled OFFICIAL / RECONSTRUCTED / PREDICTION. No official IISc PYQs exist; reconstructed material follows the SSC-pattern syllabus. See ARCHITECTURE.md for what is live vs roadmap.</p></div>';
    setHTML(h);
    document.getElementById("saveDate").onclick=function(){state.examDate=document.getElementById("setDate").value;persist();toast("Saved");};
    document.getElementById("saveGoal").onclick=function(){state.dailyGoal=parseInt(document.getElementById("setGoal").value,10)||30;persist();toast("Saved");};
    document.getElementById("setTheme").onclick=toggleTheme;
    document.getElementById("setAccent").onchange=function(){state.accent=this.value;persist();applyTheme();};
    document.getElementById("setDensity").onchange=function(){state.density=this.value;persist();applyTheme();};
    document.getElementById("expBm").onclick=function(){exportQs(state.bookmarks.map(questionById).filter(Boolean),"bookmarked.txt");};
    document.getElementById("expWrong").onclick=function(){exportQs(Object.keys(state.solved).filter(function(id){return !state.solved[id].correct;}).map(questionById).filter(Boolean),"incorrect.txt");};
    document.getElementById("expData").onclick=function(){dl("iisc_progress.json",JSON.stringify({solved:state.solved,flash:state.flash,bookmarks:state.bookmarks,xp:state.xp},null,2));};
    document.getElementById("resetAll").onclick=function(){if(confirm("Reset all progress, flashcards, bookmarks and notes?")){["solved","bookmarks","flash","notes","streak","xp"].forEach(function(k){localStorage.removeItem("iem_"+k);});state.solved={};state.bookmarks=[];state.flash={};state.streak={last:"",count:0};state.xp=0;persist();updateXP();toast("Reset done");router();}};
  }
  function exportQs(list,fn){if(!list.length){toast("Nothing to export");return;}dl(fn,list.map(function(q,i){return (i+1)+". "+q.q+"\n   Answer: "+String.fromCharCode(65+q.answer)+" — "+q.exp+"\n";}).join("\n"));}
  function dl(fn,txt){var b=new Blob([txt],{type:"text/plain"});var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=fn;a.click();URL.revokeObjectURL(a.href);}

  /* ---------- Admin / Content Management (hidden; #admin) ---------- */
  function viewAdmin(){
    var S = window.BANK_STATS;
    var h = '<h1>Admin — Content Management <span class="pill warn">internal</span></h1>';
    h += '<p class="muted">Not linked in the sidebar. Read-only dashboard over the compiled question bank. Content edits/approvals happen via the Node pipeline (see below).</p>';
    if (!S) { setHTML(h + '<div class="card muted">No stats found. Run <code>node tools/build_questions.js</code> to generate <code>data/stats.js</code>.</div>'); return; }
    var pubTotal = S.totals.published, pct = Math.round(pubTotal / S.target.total * 100);
    h += '<div class="grid cards">' +
      card(pubTotal + " / " + S.target.total, "Published (Phase 1)", pct + "% of target") +
      card(S.byStatus.pending_verification, "Pending verification", "not shown to users") +
      card(S.totals.rejected + S.totals.duplicatesBlocked, "Blocked by gate", "rejected + duplicates") +
      card(S.generated, "Last build", "run build_questions.js") + '</div>';
    h += '<div class="card" style="margin-top:16px"><h2>Per-subject progress (target 200 each)</h2>';
    APP_SUBS.forEach(function (s) { var p = S.perSubject[s] || { published: 0, coverageTopics: 0 }; h += chartRow(subjectName(s) + " (" + p.coverageTopics + " topics)", p.published, S.target.perSubject); });
    h += '</div>';
    h += '<div class="card"><h2>Status lifecycle</h2><p>' +
      ["draft","ai_generated","pending_verification","verified","published","archived"].map(function (k) { return '<span class="pill' + (k === "published" ? " good" : k === "pending_verification" ? " warn" : "") + '">' + k + ": " + (S.byStatus[k] || 0) + '</span>'; }).join(" ") +
      '</p><p class="muted">Only <strong>published</strong> questions are compiled into the app. Current-affairs items sit in <strong>pending_verification</strong> until reviewed before the exam.</p></div>';
    h += '<div class="card"><h2>Difficulty distribution (target 30/45/20/5)</h2><table><tr><th>Subject</th><th>Easy</th><th>Medium</th><th>Hard</th><th>Expert</th></tr>' +
      APP_SUBS.map(function (s) { var d = (S.perSubject[s] || {}).difficulty || { Easy: 0, Medium: 0, Hard: 0, Expert: 0 }; return '<tr><td>' + esc(subjectName(s)) + '</td><td>' + d.Easy + '</td><td>' + d.Medium + '</td><td>' + d.Hard + '</td><td>' + d.Expert + '</td></tr>'; }).join("") + '</table></div>';
    h += '<div class="card"><h2>Validation report</h2>' + (S.issues && S.issues.length ? '<ul>' + S.issues.slice(0, 30).map(function (i) { return '<li class="muted">' + esc(i) + '</li>'; }).join("") + '</ul>' : '<p class="pill good">All published questions passed the gate — no issues.</p>') + '</div>';
    h += '<div class="card"><h2>Tools (Node pipeline — the write path)</h2><ul class="muted">' +
      '<li><code>node tools/build_questions.js</code> — validate + dedup + compile + this report</li>' +
      '<li><code>node tools/add_expansion.js</code> / <code>add_gold.js</code> — author verified questions</li>' +
      '<li><code>node tools/import_dataset.js file.json</code> — import a licensed/owned set (enters as <em>pending_verification</em>)</li>' +
      '</ul><div class="btn-row"><button class="btn ghost" id="admExport">Export published bank (.json)</button></div>' +
      '<p class="muted">A static browser app can\'t write files, so approve/edit/merge/version run through these tools (or a future backend).</p></div>';
    setHTML(h);
    var ex = document.getElementById("admExport"); if (ex) ex.onclick = function () { dl("published_bank.json", JSON.stringify(window.QDATA, null, 1)); };
  }

  /* ---------- Search ---------- */
  function viewSearch(term){
    term=(term||"").toLowerCase().trim(); var h='<h1>Search: "'+esc(term)+'"</h1>';
    if(!term){setHTML(h+'<p class="muted">Type in the search box above, or press Ctrl+K.</p>');return;}
    var qs=allQuestions().filter(function(q){return (q.q+" "+q.topic+" "+q.exp).toLowerCase().indexOf(term)!==-1;});
    var gl=(window.GLOSSARY||[]).filter(function(g){return (g.term+" "+g.def).toLowerCase().indexOf(term)!==-1;});
    var fm=[];Object.keys(FORMULAS).forEach(function(sid){FORMULAS[sid].forEach(function(g){g.items.forEach(function(i){if(i.toLowerCase().indexOf(term)!==-1)fm.push(subjectName(sid)+" — "+i);});});});
    h+='<p class="muted">'+qs.length+' question(s), '+gl.length+' glossary, '+fm.length+' formula(s).</p>';
    if(gl.length)h+='<div class="card"><h2>Glossary</h2>'+gl.map(function(g){return '<div class="source-item"><strong>'+esc(g.term)+'</strong><div class="muted" style="font-size:13px">'+esc(g.def)+'</div></div>';}).join("")+'</div>';
    if(fm.length)h+='<div class="card"><h2>Formulas</h2><ul>'+fm.map(function(f){return '<li>'+esc(f)+'</li>';}).join("")+'</ul></div>';
    setHTML(h+'<div id="sList"></div>'); var list=document.getElementById("sList"); qs.slice(0,60).forEach(function(q){list.appendChild(questionCard(q));});
  }

  /* ---------- router ---------- */
  function router(){
    var hash=location.hash.replace(/^#/,"")||"dashboard", parts=hash.split("/"), view=parts[0], arg=parts[1];
    document.querySelectorAll(".nav-link").forEach(function(a){a.classList.toggle("active",a.dataset.view===view);});
    closeSidebar();
    ({dashboard:viewDashboard,study:function(){viewStudy(arg);},planner:viewPlanner,glossary:viewGlossary,practice:function(){viewPractice(arg);},flashcards:function(){viewFlashcards(arg);},mock:viewMock,pyq:viewPYQ,predictions:viewPredictions,wrong:viewWrong,bookmarks:viewBookmarks,revision:viewRevision,formulas:viewFormulas,progress:viewProgress,ai:viewAI,notes:viewNotes,settings:viewSettings,admin:viewAdmin,search:function(){viewSearch(arg?decodeURIComponent(arg):"");}}[view]||viewDashboard)();
    main.focus();
  }

  /* ---------- theme ---------- */
  function applyTheme(){var r=document.documentElement;r.setAttribute("data-theme",state.theme);r.setAttribute("data-accent",state.accent);r.setAttribute("data-density",state.density);var b=document.getElementById("themeToggle");if(b)b.textContent=state.theme==="dark"?"☀️":"🌙";}
  function toggleTheme(){state.theme=state.theme==="dark"?"light":"dark";persist();applyTheme();}

  /* ---------- sidebar ---------- */
  function openSidebar(){document.getElementById("sidebar").classList.add("open");document.getElementById("backdrop").classList.add("show");}
  function closeSidebar(){document.getElementById("sidebar").classList.remove("open");document.getElementById("backdrop").classList.remove("show");}

  /* ---------- command palette ---------- */
  function paletteCommands(){
    var cmds=[
      {label:"Go to Dashboard",hint:"nav",run:function(){location.hash="#dashboard";}},
      {label:"Study",hint:"nav",run:function(){location.hash="#study";}},
      {label:"Daily Planner",hint:"nav",run:function(){location.hash="#planner";}},
      {label:"Practice",hint:"nav",run:function(){location.hash="#practice";}},
      {label:"Flashcards (spaced repetition)",hint:"nav",run:function(){location.hash="#flashcards";}},
      {label:"Mock Test",hint:"nav",run:function(){location.hash="#mock";}},
      {label:"Wrong Answer Notebook",hint:"nav",run:function(){location.hash="#wrong";}},
      {label:"Revision",hint:"nav",run:function(){location.hash="#revision";}},
      {label:"Formula Sheets",hint:"nav",run:function(){location.hash="#formulas";}},
      {label:"Analytics",hint:"nav",run:function(){location.hash="#progress";}},
      {label:"AI Tutor",hint:"nav",run:function(){location.hash="#ai";}},
      {label:"Glossary & References",hint:"nav",run:function(){location.hash="#glossary";}},
      {label:"Notes",hint:"nav",run:function(){location.hash="#notes";}},
      {label:"Settings",hint:"nav",run:function(){location.hash="#settings";}},
      {label:"Open Admin — content dashboard",hint:"internal",run:function(){location.hash="#admin";}},
      {label:"Toggle theme (light/dark)",hint:"action",run:toggleTheme},
      {label:"Start 10-question Mixed mock",hint:"action",run:function(){location.hash="#mock";}}
    ];
    SUBJECTS.forEach(function(s){cmds.push({label:"Practice: "+s.name,hint:"section",run:function(){location.hash="#practice/"+s.id;}});});
    return cmds;
  }

  /* ---------- init ---------- */
  function init(){
    applyTheme(); updateXP();
    window.Palette.init(paletteCommands);
    window.addEventListener("hashchange",router);
    document.getElementById("themeToggle").onclick=toggleTheme;
    document.getElementById("menuToggle").onclick=openSidebar;
    document.getElementById("backdrop").onclick=closeSidebar;
    document.getElementById("paletteBtn").onclick=function(){window.Palette.open();};
    var search=document.getElementById("globalSearch");
    search.addEventListener("keydown",function(e){if(e.key==="Enter")location.hash="#search/"+encodeURIComponent(search.value);});
    document.addEventListener("keydown",function(e){
      if((e.ctrlKey||e.metaKey)&&(e.key==="k"||e.key==="K")){e.preventDefault();window.Palette.open();return;}
      if((e.ctrlKey||e.metaKey)&&e.shiftKey&&(e.key==="p"||e.key==="P")){e.preventDefault();window.Palette.open();return;}
      if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA"||e.target.tagName==="SELECT")return;
      if(e.key==="t"||e.key==="T")toggleTheme();
      if(e.key==="/"){e.preventDefault();search.focus();}
    });
    router();
    if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0)navigator.serviceWorker.register("service-worker.js").catch(function(){});
  }
  document.addEventListener("DOMContentLoaded",init);
})();
