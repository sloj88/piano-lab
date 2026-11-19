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

export const lesson = {
  id: 'lesson-01',
  title: 'Your First Five Notes',
  steps: [
    {
      id: 'discover-keyboard', title: 'Discover the keyboard', kicker: 'See the pattern',
      intro: 'The keyboard may look long, but it is one small pattern repeated again and again.',
      explain: [
        'The wide <strong>white keys</strong> are the notes you will begin with. The shorter <strong>black keys</strong> sit above them.',
        'Look across your instrument. Black keys always alternate in groups of <strong>two</strong> and <strong>three</strong>. These groups are your landmarks.'
      ],
      keyboard: { labels: 'groups', highlights: [] },
      demonstrate: 'Start at the left side of your instrument and let your eyes travel to the right: two black keys, then three, then two, then three.',
      tryIt: 'On your physical instrument, point to every group of two black keys. Then point to every group of three. Do not play yet—just notice the repeating shape.',
      hint: 'If the keys blur together, cover part of the keyboard with a sheet of paper and examine one small area at a time.',
      reflect: 'Can you find a two-key group without counting from the end of the piano? That visual landmark is the skill you need.'
    },
    {
      id: 'find-c', title: 'Find C', kicker: 'Use a landmark',
      intro: 'C is easy to find once you know where to look.',
      explain: [
        'Find any group of <strong>two black keys</strong>. The white key immediately to its left is <strong>C</strong>. Every C on the keyboard follows this rule.',
        '<strong>Middle C</strong> is the C nearest the middle of a standard piano. On an 88-key piano it is the fourth C from the left. Smaller keyboards may place it a little off-center.'
      ],
      keyboard: { labels: 'middle-c', highlights: ['C4'] },
      demonstrate: 'In the diagram, the green key is middle C. Notice that it sits directly to the left of a two-black-key group.',
      tryIt: 'Find the C nearest the middle of your physical keyboard. Play it once with any right-hand finger and listen until the sound fades. Then find and play one other C.',
      hint: 'First locate two black keys together. Move to the white key directly beside their left edge.',
      reflect: 'Look away, then try to find middle C again. You are learning a shape, not memorizing a distance.'
    },
    {
      id: 'learn-five-notes', title: 'Learn C, D, E, F, G', kicker: 'Name the neighbors',
      intro: 'From middle C, the next four white keys form your first five-note area.',
      explain: [
        'Moving one white key to the right gives you <strong>C, D, E, F, G</strong>. In music, moving right sounds higher; moving left sounds lower.',
        '<strong>D</strong> sits between the two black keys. <strong>E</strong> is to their right. <strong>F</strong> is left of a three-black-key group, and <strong>G</strong> comes next.'
      ],
      keyboard: { labels: 'five-notes', highlights: ['C4', 'D4', 'E4', 'F4', 'G4'] },
      demonstrate: 'Trace the five green keys from left to right and say their names aloud: C, D, E, F, G.',
      tryIt: 'On your piano, find middle C. Play C, then move right one white key at a time through D, E, F, and G. Say each letter before you press the key.',
      hint: 'If you lose your place, return to the two-black-key group: C is left of it, D is between it, and E is right of it.',
      reflect: 'Mix the order: ask yourself for G, C, E, D, then F. Point to each key before playing it.'
    },
    {
      id: 'finger-pattern', title: 'Your first finger pattern', kicker: 'Move with ease',
      intro: 'Give each finger one note and let your hand stay calm.',
      explain: [
        'Right-hand fingers are numbered from thumb to pinky: <strong>thumb 1</strong>, index 2, middle 3, ring 4, pinky 5.',
        'Sit tall but not stiff. Let your shoulders drop, keep your wrist level, and curve your fingers as if loosely holding a small ball. Place fingers 1–5 on C–G.'
      ],
      fingers: true,
      keyboard: { labels: 'fingers', highlights: ['C4', 'D4', 'E4', 'F4', 'G4'] },
      demonstrate: 'Play upward slowly: C–D–E–F–G with fingers 1–2–3–4–5. Then play downward: G–F–E–D–C with 5–4–3–2–1.',
      tryIt: 'On your piano, play up and down three times. Lift only the finger you need. Pause if your wrist tightens, gently shake out your hand, and reset.',
      hint: 'Quiet and even is better than fast. There is no need to stretch—place the hand so each fingertip rests naturally over its key.',
      reflect: 'Were your shoulders loose? Did every note sound on its own? Comfort and control matter more than speed.'
    },
    {
      id: 'first-melody', title: 'Your first melody', kicker: 'Make music',
      intro: 'Seven notes are enough to create a complete musical thought.',
      explain: [
        'Keep your right hand in the same five-note position. Your melody is <strong>C–D–E–G–E–D–C</strong>. The matching fingers are <strong>1–2–3–5–3–2–1</strong>.',
        'Each dash means “next note,” not a long pause. Play at any steady, comfortable speed.'
      ],
      melody: [
        { note: 'C', finger: 1 }, { note: 'D', finger: 2 }, { note: 'E', finger: 3 },
        { note: 'G', finger: 5 }, { note: 'E', finger: 3 }, { note: 'D', finger: 2 }, { note: 'C', finger: 1 }
      ],
      keyboard: { labels: 'five-notes', highlights: ['C4', 'D4', 'E4', 'G4'] },
      demonstrate: 'Read left to right. The melody climbs C–D–E, skips over F to G, then walks back E–D–C.',
      tryIt: 'First say the note names. Next, tap the finger numbers on your leg. Then play one note at a time on your piano. When that feels clear, play the whole melody without stopping.',
      hint: 'The only leap is from E (finger 3) to G (finger 5). Keep finger 5 resting over G so the leap feels small.',
      reflect: 'Now look away from the pattern and play it from memory. If you miss a note, calmly begin again—mistakes are useful information.'
    }
  ]
};
