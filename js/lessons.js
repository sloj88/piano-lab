export const WHITE_NOTES = [
  { note: 'C', octave: 3 }, { note: 'D', octave: 3 }, { note: 'E', octave: 3 },
  { note: 'F', octave: 3 }, { note: 'G', octave: 3 }, { note: 'A', octave: 3 }, { note: 'B', octave: 3 },
  { note: 'C', octave: 4 }, { note: 'D', octave: 4 }, { note: 'E', octave: 4 },
  { note: 'F', octave: 4 }, { note: 'G', octave: 4 }, { note: 'A', octave: 4 }, { note: 'B', octave: 4 },
  { note: 'C', octave: 5 }
].map((key, index) => ({ ...key, id: `${key.note}${key.octave}`, index }));

// A black key sits after each listed white-key index. Gaps after E and B
// create the repeating groups of two and three.
export const BLACK_KEYS = WHITE_NOTES
  .filter(({ note }) => !['E', 'B'].includes(note))
  .slice(0, -1)
  .map(({ index, note, octave }) => ({ after: index, id: `${note}♯${octave}` }));

export function getKey(id) {
  return WHITE_NOTES.find((key) => key.id === id) ?? BLACK_KEYS.find((key) => key.id === id);
}

export function isCBeforeTwoBlackKeys(id) {
  const key = getKey(id);
  if (!key || key.note !== 'C') return false;
  return BLACK_KEYS.some(({ after }) => after === key.index)
    && BLACK_KEYS.some(({ after }) => after === key.index + 1);
}

import { sessionCatalog } from './session-catalog.js';

// Compatibility view for the published v0.1 lesson shape. The learner-facing
// engine reads sessionCatalog directly; keeping this export avoids breaking
// small integrations that imported the original lesson object.
const publishedSession = sessionCatalog[0];
export const lesson = {
  id: 'lesson-01',
  title: publishedSession.title,
  steps: publishedSession.steps.map((step) => {
    const text = (phase) => step.blocks.find((block) => block.type === 'text' && block.phase === phase);
    const keyboard = step.blocks.find((block) => block.type === 'keyboard');
    const practice = step.blocks.find((block) => block.type === 'practice');
    const reflection = step.blocks.find((block) => block.type === 'reflection');
    const pattern = step.blocks.find((block) => block.type === 'musical-pattern');
    const legacyStep = {
      id: step.id, title: step.title, kicker: step.kicker, intro: step.intro,
      explain: text('explain')?.paragraphs ?? [],
      keyboard: keyboard ? { labels: keyboard.labels, highlights: keyboard.highlights } : null,
      demonstrate: text('demonstrate')?.paragraphs?.[0] ?? '',
      tryIt: practice?.instruction ?? '', hint: practice?.hint ?? '', reflect: reflection?.prompt ?? ''
    };
    if (step.blocks.some((block) => block.type === 'finger-position')) legacyStep.fingers = true;
    if (pattern?.musicRef === 'M001') legacyStep.melody = [['C', 1], ['D', 2], ['E', 3], ['G', 5], ['E', 3], ['D', 2], ['C', 1]].map(([note, finger]) => ({ note, finger }));
    return legacyStep;
  })
};
