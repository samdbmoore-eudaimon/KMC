const words = (value) => String(value || "").trim().split(/\s+/).filter(Boolean).length;

function inspect(name, lessons, visibleKeys) {
  const rows = [];
  const findings = [];
  for (const key of visibleKeys) {
    const lesson = lessons[key];
    if (!lesson) {
      findings.push(`${name}/${key}: missing lesson`);
      continue;
    }
    let exampleCount = 0;
    let minimumBody = Infinity;
    let minimumExplanation = Infinity;
    const formats = { simple: 0, "state-work-conclude": 0, clear: 0 };
    const questions = new Set();
    for (const [sectionIndex, section] of (lesson.sections || []).entries()) {
      minimumBody = Math.min(minimumBody, words((section.body || []).join(" ")));
      const editorV2 = lesson.editorialStandard === "lesson-editor-v2";
      if (!editorV2 && (!section.learningGoal || !section.misconception)) findings.push(`${name}/${key}/${sectionIndex + 1}: missing section teaching field`);
      if (editorV2 && (section.learningGoal || section.misconception)) findings.push(`${name}/${key}/${sectionIndex + 1}: generic section framing survived the editor pass`);
      if (section.bridge) findings.push(`${name}/${key}/${sectionIndex + 1}: generic section topper is still present`);
      if ((section.examples || []).length !== 4) findings.push(`${name}/${key}/${sectionIndex + 1}: expected four examples, found ${(section.examples || []).length}`);
      for (const [exampleIndex, example] of (section.examples || []).entries()) {
        exampleCount += 1;
        minimumExplanation = Math.min(minimumExplanation, words([example.understand, example.plan, ...(example.steps || []), example.check, example.watch].join(" ")));
        const minimumSteps = editorV2 && example.solutionFormat === "simple" ? 1 : 2;
        if (!example.understand || (!editorV2 && !example.plan) || !example.check || (example.steps || []).length < minimumSteps) findings.push(`${name}/${key}/${sectionIndex + 1}/${exampleIndex + 1}: incomplete slow-teaching sequence`);
        if (example.teachingStage !== `Example ${exampleIndex + 1}`) findings.push(`${name}/${key}/${sectionIndex + 1}/${exampleIndex + 1}: child-facing example label is not numbered plainly`);
        if (!example.structureId) findings.push(`${name}/${key}/${sectionIndex + 1}/${exampleIndex + 1}: missing structure link`);
        if (!(example.solutionFormat in formats)) findings.push(`${name}/${key}/${sectionIndex + 1}/${exampleIndex + 1}: missing or unknown solution format`);
        else formats[example.solutionFormat] += 1;
        if (example.solutionFormat === "state-work-conclude" && !example.conclusion) findings.push(`${name}/${key}/${sectionIndex + 1}/${exampleIndex + 1}: incomplete State-Work-Conclude sequence`);
        if (example.solutionFormat === "clear" && (!example.clear?.comprehend || !example.clear?.link || !example.clear?.explain || !example.clear?.apply?.length || !example.clear?.review)) findings.push(`${name}/${key}/${sectionIndex + 1}/${exampleIndex + 1}: incomplete CLEAR sequence`);
        const question = String(example.q || "").replace(/\s+/g, " ").trim().toLowerCase();
        const statedQuestion = String(example.understand || "").replace(/\s+/g, " ").toLowerCase();
        if (!editorV2 && example.structureId !== "digit_from_place_name" && !statedQuestion.includes(question)) findings.push(`${name}/${key}/${sectionIndex + 1}/${exampleIndex + 1}: State does not preserve the complete question`);
        if (/how many times as (?:valuable|many|tall)|how many times (?:bigger|larger|greater)/i.test(question)) {
          const workedText = [...(example.steps || []), example.answer].join(" ");
          if (!/÷|divid|fits into/i.test(workedText) || !/times/i.test(example.answer || "")) findings.push(`${name}/${key}/${sectionIndex + 1}/${exampleIndex + 1}: multiplicative comparison does not compare the actual values`);
        }
        if (questions.has(question)) findings.push(`${name}/${key}: repeated displayed question: ${question}`);
        questions.add(question);
        if (/This is a the|Set up the quantities|To check, [A-Z]/.test([example.understand, example.check, ...(example.steps || [])].join(" "))) findings.push(`${name}/${key}/${sectionIndex + 1}/${exampleIndex + 1}: generic or malformed teaching phrase`);
        if (/recombine the parts|proposed answer|satisfy that check|original setting|decisive relationship|derive the result/i.test([example.understand, example.plan, example.check].join(" "))) findings.push(`${name}/${key}/${sectionIndex + 1}/${exampleIndex + 1}: hard or misplaced wrapper language`);
        if (editorV2 && /before calculating, say in your own words|the question gives us this information|check the worked lines against the question|make sure every number, unit and instruction/i.test([example.understand, example.check, example.clear?.explain, example.clear?.review].join(" "))) findings.push(`${name}/${key}/${sectionIndex + 1}/${exampleIndex + 1}: generic editor-v2 explanation`);
      }
    }
    rows.push([key, lesson.sections.length, exampleCount, formats.simple, formats["state-work-conclude"], formats.clear, minimumBody, minimumExplanation]);
  }
  console.log(`\n${name} learner-experience review evidence`);
  console.log("topic\tsections\texamples\tsimple\tstate-work-conclude\tCLEAR\tshortest section words\tshortest worked explanation words");
  rows.forEach((row) => console.log(row.join("\t")));
  console.log(`Review prompts: ${findings.length}`);
  findings.slice(0, 100).forEach((finding) => console.log(`- ${finding}`));
  if (findings.length > 100) console.log(`- ... ${findings.length - 100} more`);
  return findings.length;
}

Promise.all([
  import("../content/primary-lessons.js"),
  import("../content/junior-lessons.js"),
  import("../generators/gen-shared.js"),
]).then(([primary, junior, shared]) => {
  const primaryKeys = Object.keys(primary.PRIMARY_LESSONS);
  const juniorKeys = shared.JUNIOR_TOPICS.map((topic) => topic.key);
  const count = inspect("Primary", primary.PRIMARY_LESSONS, primaryKeys) + inspect("Junior", junior.JUNIOR_LESSONS, juniorKeys);
  console.log("\nThis script supplies review evidence only. Zero prompts is not a pedagogical approval.");
  process.exitCode = count ? 1 : 0;
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
