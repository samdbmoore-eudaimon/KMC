// kq-content.js — thin index: imports from split content files and re-exports
// for backward compatibility with KangarooMathsQuest.jsx and all call sites.

import { JUNIOR_STORY_TITLE, JUNIOR_STORY, JUNIOR_ADVENTURES } from './content/junior-story.js';
import { JUNIOR_LESSONS } from './content/junior-lessons.js';
import { PRIMARY_STORY_TITLE, PRIMARY_STORY, PRIMARY_ADVENTURES } from './content/primary-story.js';
import { PRIMARY_LESSONS } from './content/primary-lessons.js';
import { INTERMEDIATE_STORY_TITLE, INTERMEDIATE_STORY, INTERMEDIATE_ADVENTURES } from './content/intermediate-story.js';
import { INTERMEDIATE_LESSONS } from './content/intermediate-lessons.js';

export const CONTENT_MODULES = {
  junior:       { STORY_TITLE: JUNIOR_STORY_TITLE, STORY: JUNIOR_STORY, ADVENTURES: JUNIOR_ADVENTURES, LESSONS: JUNIOR_LESSONS },
  primary:      { STORY_TITLE: PRIMARY_STORY_TITLE, STORY: PRIMARY_STORY, ADVENTURES: PRIMARY_ADVENTURES, LESSONS: PRIMARY_LESSONS },
  intermediate: { STORY_TITLE: INTERMEDIATE_STORY_TITLE, STORY: INTERMEDIATE_STORY, ADVENTURES: INTERMEDIATE_ADVENTURES, LESSONS: INTERMEDIATE_LESSONS },
};

export let STORY_TITLE = JUNIOR_STORY_TITLE;
export let STORY       = JUNIOR_STORY;
export let ADVENTURES  = JUNIOR_ADVENTURES;
export let LESSONS     = JUNIOR_LESSONS;

export function setContentModule(key) {
  const m = CONTENT_MODULES[key] || CONTENT_MODULES.junior;
  STORY_TITLE = m.STORY_TITLE;
  STORY       = m.STORY;
  ADVENTURES  = m.ADVENTURES;
  LESSONS     = m.LESSONS;
}
