/* =========================================================================
   IISC Exam Master — application logic (vanilla JS, no framework)
   Works from file:// — all data is loaded via <script>, no fetch/server.
   State persists in localStorage (stays on this device).
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- storage helpers ---------- */
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem("iem_" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("iem_" + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- app state ---------- */
  var state = {
    solved: LS.get("solved", {}),        // qid -> {correct:bool, ts:number}
    bookmarks: LS.get("bookmarks", []),  // [qid]
    examDate: LS.get("examDate", "2026-07-05"),
    dailyGoal: LS.get("dailyGoal", 30),
    streak: LS.get("streak", { last: "", count: 0 }),
    theme: LS.get("theme", "light")
  };
  function persist() {
    LS.set("solved", state.solved); LS.set("bookmarks", state.bookmarks);
    LS.set("examDate", state.examDate); LS.set("dailyGoal", state.dailyGoal);
    LS.set("streak", state.streak); LS.set("theme", state.theme);
  }

  /* ---------- data helpers ---------- */
  function subjectName(id){ for (var i=0;i<SUBJECTS.length;i++) if (SUBJECTS[i].id===id) return SUBJECTS[i].name; return id; }
  function allQuestions() {
    var out = [];
    for (var s = 0; s < SUBJECTS.length; s++) {
      var sid = SUBJECTS[s].id, arr = (window.QDATA[sid] || []);
      for (var i = 0; i < arr.length; i++) { var q = arr[i]; q.subject = sid; out.push(q); }
    }
    return out;
  }
  function questionById(id){ var all=allQuestions(); for (var i=0;i<all.length;i++) if (all[i].id===id) return all[i]; return null; }
  function stars(n){ var s=""; for (var i=0;i<5;i++) s+= i<n ? "★" : "☆"; return s; }
  function todayStr(){ return new Date().toISOString().slice(0,10); }
  function esc(t){ return String(t==null?"":t).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }

  /* ---------- progress calculations ---------- */
  function stats() {
    var all = allQuestions(), solvedIds = Object.keys(state.solved);
    var correct = 0; solvedIds.forEach(function (id) { if (state.solved[id] && state.solved[id].correct) correct++; });
    var perSubject = {}, perTopic = {};
    all.forEach(function (q) {
      var rec = state.solved[q.id];
      if (!perSubject[q.subject]) perSubject[q.subject] = { total: 0, done: 0, correct: 0 };
      perSubject[q.subject].total++;
      var tkey = q.subject + "|" + q.topic;
      if (!perTopic[tkey]) perTopic[tkey] = { subject: q.subject, topic: q.topic, done: 0, correct: 0 };
      if (rec) { perSubject[q.subject].done++; perTopic[tkey].done++; if (rec.correct){ perSubject[q.subject].correct++; perTopic[tkey].correct++; } }
    });
    return {
      total: all.length, solved: solvedIds.length, correct: correct,
      accuracy: solvedIds.length ? Math.round(correct / solvedIds.length * 100) : 0,
      perSubject: perSubject, perTopic: perTopic
    };
  }
  function weakStrongTopics() {
    var pt = stats().perTopic, arr = [];
    Object.keys(pt).forEach(function (k) { var t = pt[k]; if (t.done >= 2) { t.acc = Math.round(t.correct / t.done * 100); arr.push(t); } });
    arr.sort(function (a, b) { return a.acc - b.acc; });
    return { weak: arr.slice(0, 4), strong: arr.slice().reverse().slice(0, 4) };
  }
  function recommendNext() {
    var ps = stats().perSubject;
    // subject with the lowest completion ratio
    var best = null, bestRatio = 2;
    SUBJECTS.forEach(function (s) { var p = ps[s.id] || { total: 1, done: 0 }; var r = p.done / p.total; if (r < bestRatio) { bestRatio = r; best = s; } });
    return best;
  }
  function solvedToday() {
    var n = 0, t = todayStr();
    Object.keys(state.solved).forEach(function (id) { var r = state.solved[id]; if (r && new Date(r.ts).toISOString().slice(0,10) === t) n++; });
    return n;
  }

  /* ---------- record an answer ---------- */
  function recordAnswer(qid, correct) {
    var first = !state.solved[qid];
    state.solved[qid] = { correct: correct, ts: Date.now() };
    // streak
    var t = todayStr();
    if (state.streak.last !== t) {
      var y = new Date(Date.now() - 864e5).toISOString().slice(0,10);
      state.streak.count = (state.streak.last === y) ? state.streak.count + 1 : 1;
      state.streak.last = t;
    }
    persist();
    return first;
  }

  /* ---------- toast ---------- */
  var toastTimer;
  function toast(msg) {
    var el = document.getElementById("toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove("show"); }, 1800);
  }

  /* ---------- bookmarks ---------- */
  function isBookmarked(id){ return state.bookmarks.indexOf(id) !== -1; }
  function toggleBookmark(id) {
    var i = state.bookmarks.indexOf(id);
    if (i === -1) { state.bookmarks.push(id); toast("Bookmarked"); } else { state.bookmarks.splice(i, 1); toast("Removed bookmark"); }
    persist();
  }

  /* =====================================================================
     RENDER: question card (shared by Practice / Bookmarks / Search / Mock review)
     ===================================================================== */
  function tagPills(q) {
    var html = "";
    html += '<span class="pill ' + (q.diff==="H"?"bad":q.diff==="M"?"warn":"good") + '">' + (q.diff==="E"?"Easy":q.diff==="M"?"Medium":"Hard") + '</span>';
    html += '<span class="pill primary" title="Importance">' + '<span class="stars">'+stars(q.imp)+'</span></span>';
    (q.tags||[]).forEach(function (t) {
      if (t === "Predicted") html += '<span class="pill warn">Predicted</span>';
      else html += '<span class="pill">' + esc(t) + '</span>';
    });
    return html;
  }
  function questionCard(q, opts) {
    opts = opts || {};
    var rec = state.solved[q.id];
    var div = document.createElement("div");
    div.className = "q-card"; div.dataset.qid = q.id;
    var head = '<div class="q-meta">' + tagPills(q) +
      '<span class="pill" title="Section">' + esc(subjectName(q.subject)) + '</span>' +
      '<button class="icon-btn bm" title="Bookmark" style="margin-left:auto">' + (isBookmarked(q.id) ? "🔖" : "🏷️") + '</button></div>';
    var body = '<div class="q-text">' + esc(q.q) + '</div><div class="opts"></div>';
    var foot = '<div class="exp" style="display:none"></div>';
    div.innerHTML = head + body + foot;
    var optsWrap = div.querySelector(".opts"), expEl = div.querySelector(".exp");

    q.options.forEach(function (optText, idx) {
      var b = document.createElement("button");
      b.className = "opt"; b.textContent = String.fromCharCode(65 + idx) + ". " + optText;
      b.addEventListener("click", function () {
        if (b.disabled) return;
        var buttons = optsWrap.querySelectorAll(".opt");
        buttons.forEach(function (x) { x.disabled = true; });
        var correct = idx === q.answer;
        buttons[q.answer].classList.add("correct");
        if (!correct) b.classList.add("wrong");
        expEl.style.display = "block";
        expEl.innerHTML = "<strong>" + (correct ? "Correct ✓" : "Answer: " + String.fromCharCode(65 + q.answer)) + "</strong> — " + esc(q.exp) +
          (q.src ? '<br><span class="muted">Source: ' + esc(q.src) + '</span>' : "");
        var first = recordAnswer(q.id, correct);
        if (opts.onAnswer) opts.onAnswer(q, correct, first);
      });
      optsWrap.appendChild(b);
    });

    // show previous result state
    if (rec && !opts.fresh) {
      var bts = optsWrap.querySelectorAll(".opt");
      bts.forEach(function (x) { x.disabled = true; });
      bts[q.answer].classList.add("correct");
      expEl.style.display = "block";
      expEl.innerHTML = "<strong>" + (rec.correct ? "You answered correctly ✓" : "Answer: " + String.fromCharCode(65 + q.answer)) + "</strong> — " + esc(q.exp);
    }
    div.querySelector(".bm").addEventListener("click", function () {
      toggleBookmark(q.id); this.textContent = isBookmarked(q.id) ? "🔖" : "🏷️";
    });
    return div;
  }

  /* =====================================================================
     VIEWS
     ===================================================================== */
  var main = document.getElementById("main");
  function setHTML(h){ main.innerHTML = h; }

  /* ---- Dashboard ---- */
  function viewDashboard() {
    var st = stats(), ws = weakStrongTopics(), rec = recommendNext();
    var days = Math.ceil((new Date(state.examDate) - new Date(todayStr())) / 864e5);
    var goalDone = solvedToday(), goalPct = Math.min(100, Math.round(goalDone / state.dailyGoal * 100));
    var comp = Math.round(st.solved / st.total * 100);
    var h = '<h1>Dashboard</h1>';
    h += '<div class="grid cards">';
    h += card(days >= 0 ? days : 0, "Days to exam", "(" + esc(state.examDate) + ")");
    h += card(comp + "%", "Overall completion", st.solved + " / " + st.total + " questions");
    h += card(st.accuracy + "%", "Accuracy", st.correct + " correct");
    h += card("🔥 " + state.streak.count, "Day streak", "keep it going");
    h += '</div>';

    h += '<div class="card" style="margin-top:16px"><div class="stat-label">Overall progress</div>' +
         '<div class="bar" style="margin-top:8px"><span style="width:' + comp + '%"></span></div></div>';

    h += '<div class="grid cards" style="margin-top:16px">';
    // Today's goal
    h += '<div class="card"><div class="stat-label">Today\'s goal</div><div class="stat">' + goalDone + " / " + state.dailyGoal + '</div>' +
         '<div class="bar"><span style="width:' + goalPct + '%"></span></div></div>';
    // Recommended
    h += '<div class="card"><div class="stat-label">Recommended next</div><div style="font-size:1.1rem;font-weight:700;margin:6px 0">' +
         (rec ? esc(rec.icon + " " + rec.name) : "All done!") + '</div><a class="btn sm" href="#practice/' + (rec?rec.id:"computer") + '">Practice now</a></div>';
    h += '</div>';

    // Weak / strong
    h += '<div class="grid cards" style="margin-top:16px">';
    h += '<div class="card"><div class="stat-label">Weak topics (accuracy)</div>' +
         (ws.weak.length ? ws.weak.map(function (t) { return '<div>' + esc(t.topic) + ' <span class="pill bad">' + t.acc + '%</span></div>'; }).join("") : '<div class="muted">Answer a few questions to see this.</div>') + '</div>';
    h += '<div class="card"><div class="stat-label">Strong topics</div>' +
         (ws.strong.length ? ws.strong.map(function (t) { return '<div>' + esc(t.topic) + ' <span class="pill good">' + t.acc + '%</span></div>'; }).join("") : '<div class="muted">—</div>') + '</div>';
    h += '</div>';

    h += '<p class="muted" style="margin-top:16px">Tip: press <strong>T</strong> to toggle theme. All progress is saved on this device only.</p>';
    setHTML(h);
  }
  function card(stat, label, sub){ return '<div class="card"><div class="stat">' + esc(stat) + '</div><div class="stat-label">' + esc(label) + '</div>' + (sub?'<div class="muted" style="font-size:12px">'+esc(sub)+'</div>':'') + '</div>'; }

  /* ---- Study ---- */
  function viewStudy(sid) {
    sid = sid || SUBJECTS[0].id;
    var h = '<h1>Study</h1><div class="tabs" id="subjTabs">';
    SUBJECTS.forEach(function (s) { h += '<button class="tab' + (s.id===sid?" active":"") + '" data-sid="' + s.id + '">' + esc(s.icon + " " + s.name) + '</button>'; });
    h += '</div>';
    var study = STUDY[sid] || { learn: "", sources: [] };
    h += '<div class="tabs" id="innerTabs"><button class="tab active" data-t="learn">Learn</button><button class="tab" data-t="sources">Sources</button></div>';
    h += '<div id="studyBody"></div>';
    setHTML(h);
    document.querySelectorAll("#subjTabs .tab").forEach(function (b) { b.onclick = function () { location.hash = "#study/" + b.dataset.sid; }; });
    var body = document.getElementById("studyBody");
    function renderLearn(){ body.innerHTML = '<div class="card"><h2>Learn — ' + esc(subjectName(sid)) + '</h2><p>' + esc(study.learn) + '</p></div>'; }
    function renderSources(){
      var items = (study.sources||[]).slice().sort(function(a,b){return b.rank-a.rank;});
      body.innerHTML = '<div class="card"><h2>Best sources (ranked)</h2>' + items.map(function (r) {
        return '<div class="source-item"><span class="stars">' + stars(r.rank) + '</span> <strong>[' + esc(r.type) + ']</strong> ' +
          (r.url ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.title) + '</a>' : esc(r.title)) +
          '<div class="muted" style="font-size:13px">' + esc(r.note) + '</div></div>';
      }).join("") + '</div>';
    }
    renderLearn();
    document.querySelectorAll("#innerTabs .tab").forEach(function (b) {
      b.onclick = function () {
        document.querySelectorAll("#innerTabs .tab").forEach(function (x){x.classList.remove("active");});
        b.classList.add("active"); (b.dataset.t === "learn" ? renderLearn : renderSources)();
      };
    });
  }

  /* ---- Practice ---- */
  var practiceFilters = { subject: SUBJECTS[0].id, topic: "All", diff: "All", imp: "All", status: "All", tag: "All" };
  function viewPractice(sid) {
    if (sid) practiceFilters.subject = sid;
    var h = '<h1>Practice</h1>';
    h += '<div class="tabs" id="pSubj">';
    SUBJECTS.forEach(function (s) { h += '<button class="tab' + (s.id===practiceFilters.subject?" active":"") + '" data-sid="' + s.id + '">' + esc(s.icon + " " + s.name) + '</button>'; });
    h += '</div>';
    h += '<div class="filters">' +
      selectEl("fTopic", "Topic", ["All"].concat(topicsFor(practiceFilters.subject)), practiceFilters.topic) +
      selectEl("fDiff", "Difficulty", ["All", "Easy", "Medium", "Hard"], practiceFilters.diff) +
      selectEl("fImp", "Importance", ["All", "5", "4", "3"], practiceFilters.imp) +
      selectEl("fStatus", "Status", ["All", "Unsolved", "Solved", "Incorrect", "Bookmarked"], practiceFilters.status) +
      selectEl("fTag", "Repeated in", ["All", "Predicted", "IISc", "SSC", "KPSC", "Banking", "PSU"], practiceFilters.tag) +
      '</div>';
    h += '<div class="muted" id="pCount"></div><div id="pList"></div>';
    setHTML(h);
    document.querySelectorAll("#pSubj .tab").forEach(function (b){ b.onclick=function(){ location.hash="#practice/"+b.dataset.sid; }; });
    bindFilter("fTopic","topic"); bindFilter("fDiff","diff"); bindFilter("fImp","imp"); bindFilter("fStatus","status"); bindFilter("fTag","tag");
    renderPracticeList();
  }
  function bindFilter(id, key){ var el=document.getElementById(id); if(el) el.onchange=function(){ practiceFilters[key]=el.value; renderPracticeList(); }; }
  function topicsFor(sid){ var t={}, arr=(window.QDATA[sid]||[]); arr.forEach(function(q){t[q.topic]=1;}); return Object.keys(t); }
  function selectEl(id, label, opts, sel){
    return '<label>' + esc(label) + ': <select id="' + id + '">' + opts.map(function (o) { return '<option' + (String(o)===String(sel)?" selected":"") + '>' + esc(o) + '</option>'; }).join("") + '</select></label>';
  }
  function passesFilters(q){
    var f = practiceFilters;
    if (q.subject !== f.subject) return false;
    if (f.topic !== "All" && q.topic !== f.topic) return false;
    if (f.diff !== "All" && ({Easy:"E",Medium:"M",Hard:"H"}[f.diff]) !== q.diff) return false;
    if (f.imp !== "All" && String(q.imp) !== f.imp) return false;
    if (f.tag !== "All" && (q.tags||[]).indexOf(f.tag) === -1) return false;
    var rec = state.solved[q.id];
    if (f.status === "Unsolved" && rec) return false;
    if (f.status === "Solved" && !rec) return false;
    if (f.status === "Incorrect" && !(rec && !rec.correct)) return false;
    if (f.status === "Bookmarked" && !isBookmarked(q.id)) return false;
    return true;
  }
  function renderPracticeList(){
    var list = document.getElementById("pList"); list.innerHTML = "";
    var qs = (window.QDATA[practiceFilters.subject]||[]).slice();
    qs.forEach(function(q){ q.subject = practiceFilters.subject; });
    qs = qs.filter(passesFilters).sort(function(a,b){ return b.imp - a.imp; }); // most important first
    document.getElementById("pCount").textContent = qs.length + " question(s) — sorted by importance (highest first).";
    if (!qs.length){ list.innerHTML = '<div class="card muted">No questions match these filters.</div>'; return; }
    qs.forEach(function (q) { list.appendChild(questionCard(q, { onAnswer: function(){ /* stays */ } })); });
  }

  /* ---- Previous Year ---- */
  function viewPYQ() {
    var h = '<h1>Previous Year Questions</h1>';
    h += '<div class="card"><h2>Official IISc previous papers</h2><p class="pill bad">Not available</p><p>' + esc(PYQ.officialNote) + '</p></div>';
    h += '<div class="card"><h2>Where to get genuine practice (ranked)</h2>' + PYQ.sources.slice().sort(function(a,b){return b.rank-a.rank;}).map(function (s) {
      return '<div class="source-item"><span class="stars">' + stars(s.rank) + '</span> ' + (s.url ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.name) + '</a>' : esc(s.name)) + '<div class="muted" style="font-size:13px">' + esc(s.note) + '</div></div>';
    }).join("") + '</div>';
    h += '<div class="card"><h2>Cross-exam pattern overlap</h2><p class="muted">How often each pattern repeats across exams, and the resulting IISc probability. [RECONSTRUCTED]</p>' +
      '<table><tr><th>Pattern</th><th>IISc</th><th>SSC</th><th>KPSC</th><th>Banking</th><th>Probability</th></tr>' +
      PYQ.overlap.map(function (o) { return '<tr><td>' + esc(o.pattern) + '</td><td>' + esc(o.iisc) + '</td><td>' + esc(o.ssc) + '</td><td>' + esc(o.kpsc) + '</td><td>' + esc(o.banking) + '</td><td><strong>' + esc(o.prob) + '</strong></td></tr>'; }).join("") + '</table></div>';
    h += '<div class="card"><h2>Reconstructed pattern questions</h2><p class="muted">Every Practice-tab question is tagged with the exams it repeats in. Filter Practice by "Repeated in" to drill them.</p><a class="btn" href="#practice">Go to Practice</a></div>';
    setHTML(h);
  }

  /* ---- Predictions ---- */
  function viewPredictions() {
    var h = '<h1>Prediction Engine</h1><p class="muted">[PREDICTION] Highest-probability calls from syllabus overlap + exam trends. Not an official paper.</p>';
    var order = { "Very High": 0, "High": 1, "Medium": 2, "Low": 3 };
    var preds = PREDICTIONS.slice().sort(function (a, b) { return order[a.conf] - order[b.conf]; });
    preds.forEach(function (p) {
      var cls = p.conf === "Very High" ? "good" : p.conf === "High" ? "primary" : "warn";
      h += '<div class="q-card"><div class="q-meta"><span class="pill ' + cls + '">' + esc(p.conf) + '</span><span class="pill">' + esc(subjectName(p.subject)) + '</span></div>' +
        '<div class="q-text">' + esc(p.q) + '</div><div class="muted"><strong>Why:</strong> ' + esc(p.reason) + '</div></div>';
    });
    setHTML(h);
  }

  /* ---- Formula sheets ---- */
  function viewFormulas() {
    var h = '<h1>Formula Sheets</h1><div class="btn-row"><button class="btn" onclick="window.print()">🖨️ Print / Save as PDF</button></div>';
    Object.keys(FORMULAS).forEach(function (sid) {
      h += '<div class="card"><h2>' + esc(subjectName(sid)) + '</h2>';
      FORMULAS[sid].forEach(function (g) {
        h += '<div class="fs-group"><h3>' + esc(g.h) + '</h3><ul>' + g.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join("") + '</ul></div>';
      });
      h += '</div>';
    });
    h += '<p class="muted">Also in your folder: printable PDFs (Day1_Master_Revision.pdf, IISc_AA_Quick_Revision.pdf).</p>';
    setHTML(h);
  }

  /* ---- Bookmarks ---- */
  function viewBookmarks() {
    var h = '<h1>Bookmarks</h1>';
    if (!state.bookmarks.length) { setHTML(h + '<div class="card muted">No bookmarks yet. Tap the 🏷️ icon on any question to save it here.</div>'); return; }
    setHTML(h + '<div id="bmList"></div>');
    var list = document.getElementById("bmList");
    state.bookmarks.forEach(function (id) { var q = questionById(id); if (q) list.appendChild(questionCard(q, {})); });
  }

  /* ---- Revision ---- */
  function viewRevision() {
    var R = REVISION;
    var h = '<h1>Revision</h1>';
    h += revCard("⏱️ 30-minute revision", R.min30);
    h += revCard("⏱️ 15-minute revision", R.min15);
    h += revCard("⏱️ 5-minute revision", R.min5);
    h += revCard("⏱️ 1-minute revision", R.min1);
    h += '<div class="card"><h2>Last-minute facts</h2><ul>' + R.lastMinute.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join("") + '</ul></div>';
    setHTML(h);
  }
  function revCard(t, body){ return '<div class="card"><h2>' + esc(t) + '</h2><p>' + esc(body) + '</p></div>'; }

  /* ---- Mock tests ---- */
  var mock = null;
  function viewMock() {
    if (mock && mock.active) return renderMockRunning();
    var h = '<h1>Mock Tests</h1><div class="card"><h2>Create a test</h2>' +
      '<div class="filters">' +
      selectEl("mkType", "Type", ["Mixed (all subjects)"].concat(SUBJECTS.map(function(s){return s.name;})), "Mixed (all subjects)") +
      selectEl("mkCount", "Questions", ["10", "20", "30"], "10") +
      selectEl("mkTimed", "Timer", ["Timed", "Untimed"], "Timed") +
      '</div><button class="btn" id="mkStart">Start test</button></div>';
    h += '<p class="muted">Questions are drawn from the verified bank, most-important first. Instant result + analysis at the end.</p>';
    setHTML(h);
    document.getElementById("mkStart").onclick = startMock;
  }
  function startMock() {
    var type = document.getElementById("mkType").value;
    var count = parseInt(document.getElementById("mkCount").value, 10);
    var timed = document.getElementById("mkTimed").value === "Timed";
    var pool = allQuestions();
    if (type !== "Mixed (all subjects)") pool = pool.filter(function (q) { return subjectName(q.subject) === type; });
    pool = pool.slice().sort(function (a, b) { return b.imp - a.imp; }).slice(0, count);
    // shuffle order for exam feel
    for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    mock = { active: true, qs: pool, answers: {}, idx: 0, timed: timed, remaining: count * 60, timer: null };
    if (timed) mock.timer = setInterval(function () { mock.remaining--; var el = document.getElementById("mkTimer"); if (el) el.textContent = fmtTime(mock.remaining); if (mock.remaining <= 0) submitMock(); }, 1000);
    renderMockRunning();
  }
  function fmtTime(s){ s=Math.max(0,s); var m=Math.floor(s/60); var ss=s%60; return m+":"+(ss<10?"0":"")+ss; }
  function renderMockRunning() {
    var q = mock.qs[mock.idx];
    var h = '<h1>Mock Test</h1><div class="q-meta"><span class="pill primary">Q ' + (mock.idx + 1) + ' / ' + mock.qs.length + '</span>' +
      (mock.timed ? '<span class="mock-timer" id="mkTimer" style="margin-left:auto">' + fmtTime(mock.remaining) + '</span>' : '') + '</div>';
    h += '<div class="q-card"><div class="q-text">' + esc(q.q) + '</div><div class="opts"></div></div>';
    h += '<div class="btn-row"><button class="btn ghost" id="mkPrev">← Prev</button><button class="btn ghost" id="mkNext">Next →</button><button class="btn" id="mkSubmit">Submit test</button></div>';
    setHTML(h);
    var wrap = main.querySelector(".opts");
    q.options.forEach(function (o, idx) {
      var b = document.createElement("button"); b.className = "opt"; b.textContent = String.fromCharCode(65 + idx) + ". " + o;
      if (mock.answers[q.id] === idx) b.style.borderColor = "var(--primary)";
      b.onclick = function () { mock.answers[q.id] = idx; renderMockRunning(); };
      wrap.appendChild(b);
    });
    document.getElementById("mkPrev").onclick = function () { if (mock.idx > 0) { mock.idx--; renderMockRunning(); } };
    document.getElementById("mkNext").onclick = function () { if (mock.idx < mock.qs.length - 1) { mock.idx++; renderMockRunning(); } };
    document.getElementById("mkSubmit").onclick = submitMock;
  }
  function submitMock() {
    if (mock.timer) clearInterval(mock.timer);
    var correct = 0, wrong = 0, skipped = 0, bySub = {};
    mock.qs.forEach(function (q) {
      var a = mock.answers[q.id];
      if (!bySub[q.subject]) bySub[q.subject] = { c: 0, t: 0 }; bySub[q.subject].t++;
      if (a == null) skipped++;
      else if (a === q.answer) { correct++; bySub[q.subject].c++; recordAnswer(q.id, true); }
      else { wrong++; recordAnswer(q.id, false); }
    });
    var score = (correct - wrong * 0.33).toFixed(2);
    var h = '<h1>Result</h1><div class="grid cards">' +
      card(correct, "Correct", "") + card(wrong, "Wrong (−0.33 each)", "") + card(skipped, "Skipped", "") + card(score, "Net score", "of " + mock.qs.length) + '</div>';
    h += '<div class="card" style="margin-top:16px"><h2>Section-wise</h2>';
    Object.keys(bySub).forEach(function (s) { var b = bySub[s]; h += chartRow(subjectName(s), b.c, b.t); });
    h += '</div>';
    h += '<div class="card"><h2>Review answers</h2><div id="mkReview"></div></div>';
    h += '<div class="btn-row"><button class="btn" id="mkAgain">New test</button></div>';
    mock.active = false;
    setHTML(h);
    var rev = document.getElementById("mkReview");
    mock.qs.forEach(function (q) { var c = questionCard(q, {}); rev.appendChild(c); });
    document.getElementById("mkAgain").onclick = function () { mock = null; location.hash = "#mock"; };
  }
  function chartRow(label, val, total){
    var pct = total ? Math.round(val / total * 100) : 0;
    return '<div class="chartrow"><div class="label">' + esc(label) + '</div><div class="track"><div class="fill" style="width:' + pct + '%"></div></div><div class="val">' + val + "/" + total + '</div></div>';
  }

  /* ---- Progress ---- */
  function viewProgress() {
    var st = stats(), ws = weakStrongTopics();
    var h = '<h1>Progress</h1><div class="grid cards">' +
      card(st.solved + "/" + st.total, "Questions solved", "") + card(st.accuracy + "%", "Accuracy", "") +
      card("🔥 " + state.streak.count, "Day streak", "") + card(state.bookmarks.length, "Bookmarks", "") + '</div>';
    h += '<div class="card" style="margin-top:16px"><h2>Completion by section</h2>';
    SUBJECTS.forEach(function (s) { var p = st.perSubject[s.id] || { done: 0, total: 0 }; h += chartRow(s.name, p.done, p.total); });
    h += '</div>';
    h += '<div class="card"><h2>Accuracy by section</h2>';
    SUBJECTS.forEach(function (s) { var p = st.perSubject[s.id] || { correct: 0, done: 0 }; h += chartRow(s.name, p.correct, p.done || 0); });
    h += '</div>';
    h += '<div class="grid cards"><div class="card"><h2>Weak topics</h2>' +
      (ws.weak.length ? ws.weak.map(function (t) { return '<div>' + esc(t.topic) + ' <span class="pill bad">' + t.acc + '%</span></div>'; }).join("") : '<span class="muted">Answer more questions.</span>') + '</div>';
    h += '<div class="card"><h2>Strong topics</h2>' +
      (ws.strong.length ? ws.strong.map(function (t) { return '<div>' + esc(t.topic) + ' <span class="pill good">' + t.acc + '%</span></div>'; }).join("") : '<span class="muted">—</span>') + '</div></div>';
    setHTML(h);
  }

  /* ---- Notes ---- */
  function viewNotes() {
    var h = '<h1>Notes</h1><p class="muted">Personal notes (Markdown-friendly). Auto-saved on this device.</p>' +
      '<textarea class="notes" id="notesArea" placeholder="# My notes\n- write anything...">' + esc(LS.get("notes", "")) + '</textarea>' +
      '<div class="btn-row"><button class="btn ghost" id="notesExport">Export .txt</button><span class="muted" id="notesSaved"></span></div>';
    setHTML(h);
    var ta = document.getElementById("notesArea"), saved = document.getElementById("notesSaved"), t;
    ta.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { LS.set("notes", ta.value); saved.textContent = "Saved ✓"; setTimeout(function(){saved.textContent="";}, 1200); }, 400); });
    document.getElementById("notesExport").onclick = function () { downloadText("iisc_notes.txt", ta.value); };
  }

  /* ---- Settings ---- */
  function viewSettings() {
    var h = '<h1>Settings</h1>';
    h += '<div class="card"><h2>Exam date</h2><input type="date" id="setDate" value="' + esc(state.examDate) + '"><button class="btn sm" id="saveDate">Save</button></div>';
    h += '<div class="card"><h2>Daily goal (questions/day)</h2><input type="number" id="setGoal" value="' + state.dailyGoal + '" min="5" max="200" style="width:90px"><button class="btn sm" id="saveGoal">Save</button></div>';
    h += '<div class="card"><h2>Theme</h2><button class="btn ghost" id="setTheme">Toggle light / dark</button></div>';
    h += '<div class="card"><h2>Export</h2><div class="btn-row"><button class="btn ghost" id="expBookmarks">Bookmarked questions (.txt)</button><button class="btn ghost" id="expIncorrect">Incorrect questions (.txt)</button></div></div>';
    h += '<div class="card"><h2>Reset</h2><p class="muted">Clears all progress, bookmarks and notes on this device.</p><button class="btn" style="background:var(--bad)" id="resetAll">Reset everything</button></div>';
    h += '<div class="card"><h2>About</h2><p class="muted">IISC Exam Master — offline study app. All data stays on this device. Content labelled OFFICIAL / RECONSTRUCTED / PREDICTION. There are no official IISc previous papers; reconstructed material follows the SSC-pattern syllabus.</p></div>';
    setHTML(h);
    document.getElementById("saveDate").onclick = function () { state.examDate = document.getElementById("setDate").value; persist(); toast("Exam date saved"); };
    document.getElementById("saveGoal").onclick = function () { state.dailyGoal = parseInt(document.getElementById("setGoal").value, 10) || 30; persist(); toast("Goal saved"); };
    document.getElementById("setTheme").onclick = toggleTheme;
    document.getElementById("expBookmarks").onclick = function () { exportQuestions(state.bookmarks.map(questionById).filter(Boolean), "bookmarked_questions.txt"); };
    document.getElementById("expIncorrect").onclick = function () { var ids = Object.keys(state.solved).filter(function (id) { return !state.solved[id].correct; }); exportQuestions(ids.map(questionById).filter(Boolean), "incorrect_questions.txt"); };
    document.getElementById("resetAll").onclick = function () { if (confirm("Reset all progress, bookmarks and notes?")) { ["solved","bookmarks","notes","streak"].forEach(function(k){localStorage.removeItem("iem_"+k);}); state.solved={};state.bookmarks=[];state.streak={last:"",count:0}; persist(); toast("Reset done"); router(); } };
  }
  function exportQuestions(list, fname){
    if (!list.length){ toast("Nothing to export"); return; }
    var txt = list.map(function (q, i) { return (i+1)+". "+q.q+"\n   ("+["A","B","C","D"].map(function(l,idx){return l+") "+q.options[idx];}).join("  ")+")\n   Answer: "+String.fromCharCode(65+q.answer)+" — "+q.exp+"\n"; }).join("\n");
    downloadText(fname, txt);
  }
  function downloadText(fname, txt){
    var blob = new Blob([txt], { type: "text/plain" }); var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = fname; a.click(); URL.revokeObjectURL(a.href);
  }

  /* ---- Search ---- */
  function viewSearch(term) {
    term = (term || "").toLowerCase().trim();
    var h = '<h1>Search: "' + esc(term) + '"</h1>';
    if (!term) { setHTML(h + '<p class="muted">Type in the search box above.</p>'); return; }
    var qs = allQuestions().filter(function (q) { return (q.q + " " + q.topic + " " + q.exp).toLowerCase().indexOf(term) !== -1; });
    // also search formulas
    var fmatches = [];
    Object.keys(FORMULAS).forEach(function (sid) { FORMULAS[sid].forEach(function (g) { g.items.forEach(function (i) { if (i.toLowerCase().indexOf(term) !== -1) fmatches.push(subjectName(sid) + " — " + i); }); }); });
    h += '<p class="muted">' + qs.length + ' question(s), ' + fmatches.length + ' formula(s).</p>';
    if (fmatches.length){ h += '<div class="card"><h2>Formulas</h2><ul>' + fmatches.map(function(f){return '<li>'+esc(f)+'</li>';}).join("") + '</ul></div>'; }
    setHTML(h + '<div id="searchList"></div>');
    var list = document.getElementById("searchList");
    qs.slice(0, 60).forEach(function (q) { list.appendChild(questionCard(q, {})); });
  }

  /* =====================================================================
     ROUTER
     ===================================================================== */
  function router() {
    var hash = location.hash.replace(/^#/, "") || "dashboard";
    var parts = hash.split("/"); var view = parts[0], arg = parts[1];
    document.querySelectorAll(".nav-link").forEach(function (a) { a.classList.toggle("active", a.dataset.view === view); });
    closeSidebar();
    switch (view) {
      case "dashboard": viewDashboard(); break;
      case "study": viewStudy(arg); break;
      case "practice": viewPractice(arg); break;
      case "pyq": viewPYQ(); break;
      case "predictions": viewPredictions(); break;
      case "formulas": viewFormulas(); break;
      case "bookmarks": viewBookmarks(); break;
      case "revision": viewRevision(); break;
      case "mock": viewMock(); break;
      case "progress": viewProgress(); break;
      case "notes": viewNotes(); break;
      case "settings": viewSettings(); break;
      case "search": viewSearch(arg ? decodeURIComponent(arg) : ""); break;
      default: viewDashboard();
    }
    main.focus();
  }

  /* ---------- theme ---------- */
  function applyTheme(){ document.documentElement.setAttribute("data-theme", state.theme); document.getElementById("themeToggle").textContent = state.theme === "dark" ? "☀️" : "🌙"; }
  function toggleTheme(){ state.theme = state.theme === "dark" ? "light" : "dark"; persist(); applyTheme(); }

  /* ---------- sidebar (mobile) ---------- */
  function openSidebar(){ document.getElementById("sidebar").classList.add("open"); document.getElementById("backdrop").classList.add("show"); }
  function closeSidebar(){ document.getElementById("sidebar").classList.remove("open"); document.getElementById("backdrop").classList.remove("show"); }

  /* ---------- init ---------- */
  function init() {
    applyTheme();
    window.addEventListener("hashchange", router);
    document.getElementById("themeToggle").onclick = toggleTheme;
    document.getElementById("menuToggle").onclick = openSidebar;
    document.getElementById("backdrop").onclick = closeSidebar;
    var search = document.getElementById("globalSearch");
    search.addEventListener("keydown", function (e) { if (e.key === "Enter") location.hash = "#search/" + encodeURIComponent(search.value); });
    // keyboard shortcuts
    document.addEventListener("keydown", function (e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
      if (e.key === "t" || e.key === "T") toggleTheme();
      if (e.key === "/") { e.preventDefault(); search.focus(); }
    });
    router();
    // service worker (only works when served over http/https, not file://)
    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      navigator.serviceWorker.register("service-worker.js").catch(function(){});
    }
  }
  document.addEventListener("DOMContentLoaded", init);
})();
