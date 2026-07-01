/* Generic multi-exam registry. Adding a new exam = adding a config object here,
   no code changes elsewhere. The app reads the active exam from EXAM_REGISTRY. */
window.EXAM_REGISTRY = {
  active: "iisc_aa",
  exams: {
    iisc_aa: {
      id: "iisc_aa",
      name: "IISc Administrative Assistant",
      shortName: "IISc AA",
      totalQuestions: 80,
      durationMin: 90,
      negativeMark: 0.33,
      examDate: "2026-07-05",
      // section blueprint drives the mock generator + weightage
      sections: [
        { subject: "reasoning",          count: 22 },
        { subject: "quantitative",       count: 16 },
        { subject: "verbal",             count: 16 },
        { subject: "general_awareness",  count: 16 },
        { subject: "computer",           count: 10 }
      ],
      // tiebreaker order (official) used for section-priority hints
      tiebreaker: ["reasoning","verbal","computer","general_awareness","quantitative"]
    }
    /* To add SSC/KPSC/etc later: add another config object with its own
       sections[] blueprint and question namespaces. The engine is generic. */
  }
};
window.ACTIVE_EXAM = window.EXAM_REGISTRY.exams[window.EXAM_REGISTRY.active];
