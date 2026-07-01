/* Spaced Repetition (SM-2-lite) — schedules flashcard reviews (Part 8).
   Each card keeps: ease, interval (days), reps, due (timestamp).
   grade: 0=Again, 1=Hard, 2=Good, 3=Easy. Exposed as window.SRS. */
(function () {
  "use strict";
  var DAY = 86400000;
  function nowDue() { return Date.now(); }

  // returns updated scheduling record from a grade
  function schedule(rec, grade) {
    rec = rec || { ease: 2.5, interval: 0, reps: 0, due: nowDue() };
    if (grade === 0) {                 // Again -> reset to 1 day
      rec.reps = 0; rec.interval = 1; rec.ease = Math.max(1.3, rec.ease - 0.2);
    } else {
      rec.reps += 1;
      if (rec.reps === 1) rec.interval = 1;
      else if (rec.reps === 2) rec.interval = 3;
      else rec.interval = Math.round(rec.interval * rec.ease);
      // ease adjustment
      if (grade === 1) rec.ease = Math.max(1.3, rec.ease - 0.15);
      else if (grade === 3) rec.ease = rec.ease + 0.1;
      // cap intervals to the exam-prep ladder
      var ladder = [1, 3, 7, 14, 30, 60, 90, 180, 365];
      var capped = ladder.reduce(function (p, v) { return Math.abs(v - rec.interval) < Math.abs(p - rec.interval) ? v : p; }, 1);
      rec.interval = capped;
    }
    rec.due = Date.now() + rec.interval * DAY;
    rec.last = Date.now();
    return rec;
  }
  function isDue(rec) { return !rec || rec.due <= Date.now(); }
  function retention(rec) {
    if (!rec || !rec.last) return 0;
    // simple stability proxy: more reps + longer interval survived = higher retention
    var base = Math.min(100, rec.reps * 18 + rec.interval);
    return Math.round(Math.min(100, base));
  }
  window.SRS = { schedule: schedule, isDue: isDue, retention: retention };
})();
