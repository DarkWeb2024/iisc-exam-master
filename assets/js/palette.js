/* Command Palette (Part 2 & 10) — Ctrl+K / Ctrl+Shift+P.
   window.Palette.init(commandsFn) where commandsFn() returns [{label,hint,run}].
   Fuzzy-ish filter, keyboard nav (Up/Down/Enter/Esc). */
(function () {
  "use strict";
  var overlay, input, list, commandsFn, items = [], active = 0;

  function build() {
    overlay = document.createElement("div");
    overlay.className = "palette-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Command palette");
    overlay.innerHTML =
      '<div class="palette"><input class="palette-input" type="text" placeholder="Type a command or search… (Esc to close)" aria-label="Command palette input"><div class="palette-list" role="listbox"></div></div>';
    document.body.appendChild(overlay);
    input = overlay.querySelector(".palette-input");
    list = overlay.querySelector(".palette-list");
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    input.addEventListener("input", render);
    input.addEventListener("keydown", onKey);
  }

  function open() {
    if (!overlay) build();
    overlay.classList.add("show");
    input.value = ""; active = 0; render();
    setTimeout(function () { input.focus(); }, 10);
  }
  function close() { if (overlay) overlay.classList.remove("show"); }

  function score(label, q) {
    label = label.toLowerCase(); q = q.toLowerCase();
    if (!q) return 1;
    if (label.indexOf(q) !== -1) return 3;
    // subsequence match
    var i = 0; for (var c = 0; c < label.length && i < q.length; c++) if (label[c] === q[i]) i++;
    return i === q.length ? 1 : 0;
  }
  function render() {
    var q = input.value.trim();
    var all = commandsFn ? commandsFn() : [];
    items = all.map(function (c) { return { c: c, s: score(c.label + " " + (c.hint || ""), q) }; })
               .filter(function (x) { return x.s > 0; })
               .sort(function (a, b) { return b.s - a.s; })
               .map(function (x) { return x.c; })
               .slice(0, 40);
    if (active >= items.length) active = 0;
    list.innerHTML = items.map(function (c, i) {
      return '<div class="palette-item' + (i === active ? " active" : "") + '" data-i="' + i + '" role="option">' +
        '<span>' + esc(c.label) + '</span>' + (c.hint ? '<span class="palette-hint">' + esc(c.hint) + '</span>' : '') + '</div>';
    }).join("") || '<div class="palette-item muted">No matches</div>';
    Array.prototype.forEach.call(list.querySelectorAll(".palette-item"), function (el) {
      el.addEventListener("click", function () { var i = +el.dataset.i; if (items[i]) { close(); items[i].run(); } });
    });
  }
  function onKey(e) {
    if (e.key === "Escape") { close(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(items.length - 1, active + 1); render(); scrollActive(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(0, active - 1); render(); scrollActive(); }
    else if (e.key === "Enter") { e.preventDefault(); if (items[active]) { close(); items[active].run(); } }
  }
  function scrollActive() { var el = list.querySelector(".palette-item.active"); if (el) el.scrollIntoView({ block: "nearest" }); }
  function esc(t){ return String(t).replace(/[&<>]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;"}[c];}); }

  window.Palette = { init: function (fn) { commandsFn = fn; }, open: open, close: close };
})();
