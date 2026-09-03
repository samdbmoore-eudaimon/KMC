const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, "content", "primary-remaining-migration.js");
const PLACEHOLDER = /Begin with the idea:|What should we notice before trying to calculate\?|How does the method grow from that first idea\?|Explain the main principle behind/i;

const SECTION_FAMILIES = {
  ratioBasics: ["unitary_scale_match_one_quantity", "part_to_whole_ratio", "scale_ratio_by_given_factor", "check_ratio_equivalence", "simplify_ratio_lowest_terms", "find_total_given_one_part", "share_total_find_part", "missing_term_proportion"],
  twoUnknowns: ["given_one_find_other", "count_pairs_with_property", "sum_and_difference", "sum_and_difference", "sum_and_multiple", "sum_and_ratio_parts", "verify_pair_against_two_clues"],
  additiveMultiplicative: ["identify_comparison_type", "additive_diff_basic", "multiplicative_factor_basic", "judge_best_comparison", "identify_comparison_type", "combined_relation_forward", "judge_best_comparison", "combined_relation_reverse"],
  unitConversion: ["recall_fact", "recall_fact", "direct_convert_up", "direct_convert_up", "direct_convert_down", "compare_two_units", "compare_two_units", "sum_mixed_units"],
  areaPerimeter: ["rect_perimeter_basic", "regular_polygon_perimeter", "rect_area_basic", "grid_area_whole_squares", "area_vs_perimeter_concept", "compare_shapes", "L_shape_area", "composite_two_rectangles_area"],
  timeCalendar: ["dow_forward", "dow_forward", "multistep_dow_date", "dow_backward", "duration_simple_minutes", "clock_duration_cross_hour", "elapsed_time_find_duration", "elapsed_time_find_duration", "leap_year_identify"],
  shapeProperties: ["count_sides_vertices", "polygon_name_from_sides", "triangle_classify_sides", "triangle_classify_angles", "regular_vs_irregular", "lines_of_symmetry_recall", "coordinates_read_point", "translate_point_vector"],
  angleBasics: ["turn_direction_compass", "classify_angle_diagram", "right_angle_compare", "classify_angle_diagram", "angle_comparison_line_length", "missing_angle_straight_line", "missing_angle_point", "triangle_missing_angle", "vertically_opposite_crossing", "angle_chain_multistep"],
  symmetryReflection: ["is_shape_symmetric_simple", "lines_of_symmetry_regular", "complete_pattern_vertical_mirror", "reflect_point_axis", "reflect_point_axis", "reflect_point_axis", "reflect_point_diagonal_line", "symmetry_vs_rotational_contrast"],
  sequencePattern: ["cycle_position_forward", "cycle_position_forward", "reverse_position_lookup", "cycle_position_forward", "count_backward_from_end", "arithmetic_next_term", "nth_term_formula_evaluation", "two_stage_sequence"],
  logicGrid: ["must_be_true_statement", "elimination_two_known", "two_by_two_grid", "three_negative_clues", "three_negative_clues", "deduction_chain_three_clues", "chain_comparison_order", "linked_two_attribute_grid"],
  combinatoricsCounting: ["coin_totals_listing", "mult_principle_2way", "mult_principle_2way", "mult_principle_3way", "mult_principle_2way", "mult_principle_3way", "counting_squares_grid", "combinations_pairs", "pigeonhole_guarantee", "multistage_mult_minus_forbidden"],
  spatialPuzzles: ["shape_fev", "paper_fold_cut", "paper_fold_cut", "paper_fold_cut", "rotation_reflection_flag", "rotation_reflection_flag", "cuboid_unit_cubes_simple", "hidden_visible_faces"],
};

function buildFixedExample(structure, structureId, desiredDifficulty) {
  const supported = structure.difficulties;
  const difficulty = supported.reduce((best, value) => Math.abs(value - desiredDifficulty) < Math.abs(best - desiredDifficulty) ? value : best, supported[0]);
  for (let attempt = 0; attempt < 200; attempt++) {
    const question = structure.build(difficulty);
    if (!question?.q || !Array.isArray(question.options) || question.correctIndex == null) continue;
    const solution = question.solution;
    const steps = Array.isArray(solution) ? solution : Array.isArray(solution?.steps) ? solution.steps : [];
    if (!steps.length) continue;
    return { q: question.q, steps: steps.map(String), answer: String(question.options[question.correctIndex]), structureId };
  }
  throw new Error(`Could not generate ${structureId}`);
}

async function main() {
  const [lessonModule, generators, shared] = await Promise.all([
    import(`${pathToFileURL(path.join(ROOT, "content", "primary-lessons.js")).href}?migration=${Date.now()}`),
    import(pathToFileURL(path.join(ROOT, "generators", "primary-generators.js")).href),
    import(pathToFileURL(path.join(ROOT, "generators", "gen-shared.js")).href),
  ]);
  shared.setActiveModuleKey("primary");
  shared.setNamePools(generators.PRIMARY_NAMES_COMMON, generators.PRIMARY_NAMES_RARE, generators.PRIMARY_NAMES_EPIC, generators.PRIMARY_NAMES_LEGENDARY);
  const repairs = {};
  for (const [topic, families] of Object.entries(SECTION_FAMILIES)) {
    const lesson = lessonModule.PRIMARY_LESSONS[topic];
    repairs[topic] = lesson.sections.map((section, sectionIndex) => {
      const structureId = families[sectionIndex];
      const structure = generators.PRIMARY_STRUCTURES[topic][structureId];
      if (!structure) throw new Error(`${topic} section ${sectionIndex}: missing ${structureId}`);
      const desiredDifficulty = Math.min(4, 1 + Math.floor(sectionIndex * 4 / lesson.sections.length));
      return section.examples.map((example) => PLACEHOLDER.test(example.q) ? buildFixedExample(structure, structureId, desiredDifficulty) : { structureId });
    });
  }
  const source = `// Generated fixed lesson repairs. Rebuild with scripts/build_remaining_lesson_migration.cjs.\nconst REPAIRS = ${JSON.stringify(repairs, null, 2)};\n\nexport function applyPrimaryRemainingMigration(lessons) {\n  for (const [topic, sections] of Object.entries(REPAIRS)) {\n    sections.forEach((examples, sectionIndex) => {\n      examples.forEach((repair, exampleIndex) => {\n        const current = lessons[topic].sections[sectionIndex].examples[exampleIndex];\n        if (repair.q) lessons[topic].sections[sectionIndex].examples[exampleIndex] = { ...repair };\n        else current.structureId = repair.structureId;\n      });\n    });\n  }\n}\n`;
  fs.writeFileSync(OUTPUT, source, "utf8");
  console.log(`Wrote ${OUTPUT}`);
}

main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
