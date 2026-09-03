function finishSentence(value) {
  const text = String(value || "").trim();
  return text && !/[.!?]$/.test(text) ? `${text}.` : text;
}

function baseExample(format, config) {
  const example = {
    q: config.q,
    steps: config.steps,
    answer: config.answer,
    understand: config.state,
    conclusion: finishSentence(config.conclusion || config.answer),
    check: config.check,
    structureId: config.structureId,
    difficulty: config.difficulty,
    solutionFormat: format,
    editorialVersion: 2,
  };
  if (config.watch) example.watch = config.watch;
  return example;
}

export function simple(config) {
  return baseExample("simple", config);
}

export function swc(config) {
  return baseExample("state-work-conclude", config);
}

export function clear(config) {
  const example = baseExample("clear", config);
  example.clear = {
    comprehend: config.comprehend,
    link: config.link,
    explain: config.explain,
    apply: config.steps,
    review: config.review,
  };
  return example;
}

export function applyEditorialRevisions(lessons, revisions) {
  for (const [lessonKey, revision] of Object.entries(revisions)) {
    const lesson = lessons[lessonKey];
    if (!lesson) throw new Error(`Lesson editor could not find ${lessonKey}`);
    const originalSections = lesson.sections || [];
    if ((revision.sections || []).length !== originalSections.length) {
      throw new Error(`${lessonKey} editorial pass has ${revision.sections?.length || 0} sections; expected ${originalSections.length}`);
    }
    if (revision.intro) lesson.intro = revision.intro;
    lesson.sections = revision.sections.map((sectionRevision, sectionIndex) => {
      const originalSection = originalSections[sectionIndex];
      if ((sectionRevision.examples || []).length !== 4) {
        throw new Error(`${lessonKey} section ${sectionIndex + 1} editorial pass must contain four examples`);
      }
      const section = { ...originalSection, ...sectionRevision };
      delete section.bridge;
      delete section.learningGoal;
      delete section.misconception;
      section.examples = sectionRevision.examples.map((example, exampleIndex) => {
        const originalExample = originalSection.examples?.[exampleIndex] || {};
        const merged = {
          ...originalExample,
          ...example,
          structureId: example.structureId || originalExample.structureId,
          difficulty: example.difficulty || originalExample.difficulty || exampleIndex + 1,
          teachingStage: `Example ${exampleIndex + 1}`,
          slowTeachingVersion: 2,
          editorialVersion: 2,
        };
        delete merged.plan;
        if (merged.solutionFormat !== "clear") delete merged.clear;
        if (!merged.structureId) throw new Error(`${lessonKey} section ${sectionIndex + 1} example ${exampleIndex + 1} has no structureId`);
        return merged;
      });
      return section;
    });
    lesson.editorialStandard = "lesson-editor-v2";
  }
}
