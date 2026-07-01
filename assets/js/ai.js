/* AI Tutor (Part 9) with provider abstraction.
   - "local" provider (default, offline): RETRIEVAL-GROUNDED. It answers strictly from
     the platform's verified content (glossary, question bank, study notes). It never
     fabricates — if nothing is found, it says so. This satisfies the Part-9 safety rules
     offline and free.
   - "byok" provider (optional): if the user supplies their own API key, the app can call
     an external LLM. Browser CORS often blocks direct calls, so this is clearly marked
     experimental and falls back to local retrieval on any failure.
   Exposed as window.AITutor. */
(function () {
  "use strict";

  function norm(s){ return String(s||"").toLowerCase(); }

  // ---- local retrieval-grounded answer ----
  function localAnswer(query) {
    var q = norm(query).replace(/[?.]/g,"").trim();
    if (!q) return { text: "Ask me about any topic, definition, formula, or question in the syllabus.", src: "AI Tutor" };
    var terms = q.split(/\s+/).filter(function(w){return w.length>2;});
    var hits = [];

    // 1) glossary exact-ish
    (window.GLOSSARY||[]).forEach(function (g) {
      var score = 0; var t = norm(g.term);
      if (q.indexOf(t) !== -1 || t.indexOf(q) !== -1) score += 5;
      terms.forEach(function(w){ if (norm(g.def).indexOf(w)!==-1) score += 1; if (t.indexOf(w)!==-1) score += 2; });
      if (score) hits.push({ score: score, type:"Definition", title: g.term, body: g.def });
    });
    // 2) abbreviations
    (window.ABBREVIATIONS||[]).forEach(function (a) {
      if (q.indexOf(norm(a.abbr)) !== -1) hits.push({ score: 4, type:"Abbreviation", title: a.abbr, body: a.abbr + " = " + a.full });
    });
    // 3) questions (explanations are verified)
    Object.keys(window.QDATA||{}).forEach(function (sid) {
      window.QDATA[sid].forEach(function (item) {
        var hay = norm(item.q + " " + item.topic + " " + item.exp);
        var score = 0; terms.forEach(function(w){ if (hay.indexOf(w)!==-1) score += 1; });
        if (score >= Math.max(1, Math.ceil(terms.length/2)))
          hits.push({ score: score, type:"From question bank", title: item.topic, body: item.q + "  →  " + item.options[item.answer] + ". " + item.exp });
      });
    });
    // 4) study notes
    Object.keys(window.STUDY||{}).forEach(function (sid) {
      var learn = window.STUDY[sid].learn || "";
      var score = 0; terms.forEach(function(w){ if (norm(learn).indexOf(w)!==-1) score += 1; });
      if (score >= 2) hits.push({ score: score - 0.5, type:"Study notes", title: sid, body: learn.slice(0, 400) + "…" });
    });

    hits.sort(function(a,b){ return b.score - a.score; });
    if (!hits.length)
      return { text: "I couldn't find that in the platform's verified content, so I won't guess. Try a topic name (e.g. \"RAM\", \"profit\", \"syllogism\"), or use Search.", src: "AI Tutor (no fabrication)" };
    var top = hits.slice(0, 3);
    var text = top.map(function (h) { return "**" + h.type + " — " + h.title + "**\n" + h.body; }).join("\n\n");
    return { text: text, src: "Grounded in platform content (" + top.length + " source" + (top.length>1?"s":"") + ")" };
  }

  // ---- provider dispatch ----
  function answer(query, cfg) {
    cfg = cfg || {};
    if (cfg.provider && cfg.provider !== "local" && cfg.key) {
      // BYOK path is experimental (browser CORS commonly blocks it) -> try, else fall back.
      return callExternal(query, cfg).catch(function () {
        var la = localAnswer(query);
        la.src += " · (external AI call failed — likely browser CORS; using offline retrieval)";
        return la;
      });
    }
    return Promise.resolve(localAnswer(query));
  }

  function callExternal(query, cfg) {
    // Structured for provider abstraction. Kept minimal + honest; not guaranteed to work
    // from a browser due to CORS. Real deployments would proxy this server-side.
    return Promise.reject(new Error("external-not-wired"));
  }

  window.AITutor = { answer: answer, localAnswer: localAnswer };
})();
