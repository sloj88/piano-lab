export const SESSION_TYPES = ['Learn', 'Practice', 'Play', 'Review'];
export const BLOCK_TYPES = ['text', 'keyboard', 'finger-position', 'musical-pattern', 'practice', 'reflection'];

export const assetCatalog = {
  'keyboard-c3-c5': { id: 'keyboard-c3-c5', type: 'generated-diagram' },
  'right-hand-fingers': { id: 'right-hand-fingers', type: 'generated-diagram' }
};

const publishedSteps = [
  {
    id: 'discover-keyboard',
    title: 'Discover the keyboard',
    kicker: 'See the pattern',
    intro: 'The keyboard may look long, but it is one small pattern repeated again and again.',
    blocks: [
      {
        type: 'text', phase: 'explain',
        paragraphs: [
          'The wide <strong>white keys</strong> are the notes you will begin with. The shorter <strong>black keys</strong> sit above them.',
          'Look across your instrument. Black keys always alternate in groups of <strong>two</strong> and <strong>three</strong>. These groups are your landmarks.'
        ]
      },
      { type: 'keyboard', labels: 'groups', highlights: [], assetRef: 'keyboard-c3-c5' },
      { type: 'text', phase: 'demonstrate', paragraphs: ['Start at the left side of your instrument and let your eyes travel to the right: two black keys, then three, then two, then three.'] },
      {
        type: 'practice', phase: 'try',
        instruction: 'On your physical instrument, point to every group of two black keys. Then point to every group of three. Do not play yet—just notice the repeating shape.',
        hint: 'If the keys blur together, cover part of the keyboard with a sheet of paper and examine one small area at a time.'
      },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you find a two-key group without counting from the end of the piano? That visual landmark is the skill you need.', legacySelfCheck: true }
    ]
  },
  {
    id: 'find-c',
    title: 'Find C',
    kicker: 'Use a landmark',
    intro: 'C is easy to find once you know where to look.',
    blocks: [
      {
        type: 'text', phase: 'explain',
        paragraphs: [
          'Find any group of <strong>two black keys</strong>. The white key immediately to its left is <strong>C</strong>. Every C on the keyboard follows this rule.',
          '<strong>Middle C</strong> is the C nearest the middle of a standard piano. On an 88-key piano it is the fourth C from the left. Smaller keyboards may place it a little off-center.'
        ]
      },
      { type: 'keyboard', labels: 'middle-c', highlights: ['C4'], assetRef: 'keyboard-c3-c5' },
      { type: 'text', phase: 'demonstrate', paragraphs: ['In the diagram, the green key is middle C. Notice that it sits directly to the left of a two-black-key group.'] },
      {
        type: 'practice', phase: 'try',
        instruction: 'Find the C nearest the middle of your physical keyboard. Play it once with any right-hand finger and listen until the sound fades. Then find and play one other C.',
        hint: 'First locate two black keys together. Move to the white key directly beside their left edge.'
      },
      { type: 'reflection', phase: 'reflect', prompt: 'Look away, then try to find middle C again. You are learning a shape, not memorizing a distance.', legacySelfCheck: true }
    ]
  },
  {
    id: 'learn-five-notes',
    title: 'Learn C, D, E, F, G',
    kicker: 'Name the neighbors',
    intro: 'From middle C, the next four white keys form your first five-note area.',
    blocks: [
      {
        type: 'text', phase: 'explain',
        paragraphs: [
          'Moving one white key to the right gives you <strong>C, D, E, F, G</strong>. In music, moving right sounds higher; moving left sounds lower.',
          '<strong>D</strong> sits between the two black keys. <strong>E</strong> is to their right. <strong>F</strong> is left of a three-black-key group, and <strong>G</strong> comes next.'
        ]
      },
      { type: 'keyboard', labels: 'five-notes', highlights: ['C4', 'D4', 'E4', 'F4', 'G4'], assetRef: 'keyboard-c3-c5' },
      { type: 'text', phase: 'demonstrate', paragraphs: ['Trace the five green keys from left to right and say their names aloud: C, D, E, F, G.'] },
      {
        type: 'practice', phase: 'try',
        instruction: 'On your piano, find middle C. Play C, then move right one white key at a time through D, E, F, and G. Say each letter before you press the key.',
        hint: 'If you lose your place, return to the two-black-key group: C is left of it, D is between it, and E is right of it.'
      },
      { type: 'reflection', phase: 'reflect', prompt: 'Mix the order: ask yourself for G, C, E, D, then F. Point to each key before playing it.', legacySelfCheck: true }
    ]
  },
  {
    id: 'finger-pattern',
    title: 'Your first finger pattern',
    kicker: 'Move with ease',
    intro: 'Give each finger one note and let your hand stay calm.',
    blocks: [
      {
        type: 'text', phase: 'explain',
        paragraphs: [
          'Right-hand fingers are numbered from thumb to pinky: <strong>thumb 1</strong>, index 2, middle 3, ring 4, pinky 5.',
          'Sit tall but not stiff. Let your shoulders drop, keep your wrist level, and curve your fingers as if loosely holding a small ball. Place fingers 1–5 on C–G.'
        ]
      },
      { type: 'finger-position', hand: 'right', assetRef: 'right-hand-fingers' },
      { type: 'keyboard', labels: 'fingers', highlights: ['C4', 'D4', 'E4', 'F4', 'G4'], assetRef: 'keyboard-c3-c5' },
      { type: 'text', phase: 'demonstrate', paragraphs: ['Play upward slowly: C–D–E–F–G with fingers 1–2–3–4–5. Then play downward: G–F–E–D–C with 5–4–3–2–1.'] },
      {
        type: 'practice', phase: 'try',
        instruction: 'On your piano, play up and down three times. Lift only the finger you need. Pause if your wrist tightens, gently shake out your hand, and reset.',
        hint: 'Quiet and even is better than fast. There is no need to stretch—place the hand so each fingertip rests naturally over its key.'
      },
      { type: 'reflection', phase: 'reflect', prompt: 'Were your shoulders loose? Did every note sound on its own? Comfort and control matter more than speed.', legacySelfCheck: true }
    ]
  },
  {
    id: 'first-melody',
    title: 'Your first melody',
    kicker: 'Make music',
    intro: 'Seven notes are enough to create a complete musical thought.',
    blocks: [
      {
        type: 'text', phase: 'explain',
        paragraphs: [
          'Keep your right hand in the same five-note position. Your melody is <strong>C–D–E–G–E–D–C</strong>. The matching fingers are <strong>1–2–3–5–3–2–1</strong>.',
          'Each dash means “next note,” not a long pause. Play at any steady, comfortable speed.'
        ]
      },
      { type: 'keyboard', labels: 'five-notes', highlights: ['C4', 'D4', 'E4', 'G4'], assetRef: 'keyboard-c3-c5' },
      { type: 'text', phase: 'demonstrate', paragraphs: ['Read left to right. The melody climbs C–D–E, skips over F to G, then walks back E–D–C.'] },
      { type: 'musical-pattern', musicRef: 'M001' },
      {
        type: 'practice', phase: 'try',
        instruction: 'First say the note names. Next, tap the finger numbers on your leg. Then play one note at a time on your piano. When that feels clear, play the whole melody without stopping.',
        hint: 'The only leap is from E (finger 3) to G (finger 5). Keep finger 5 resting over G so the leap feels small.'
      },
      { type: 'reflection', phase: 'reflect', prompt: 'Now look away from the pattern and play it from memory. If you miss a note, calmly begin again—mistakes are useful information.', legacySelfCheck: true }
    ]
  }
];

export const sessionCatalog = [
  {
    id: '001',
    title: 'Your First Five Notes',
    summary: 'Meet the keyboard, find middle C, and play a short melody on your own piano.',
    presentation: { titleLead: 'Your First', titleEmphasis: 'Five Notes' },
    type: 'Learn',
    chapter: 1,
    objective: 'Navigate the keyboard, find middle C, name C–G, use right-hand fingers 1–5, and make a first melody attempt.',
    prerequisites: [],
    duration: { min: 10, max: 15 },
    steps: publishedSteps,
    musicRefs: ['K001', 'M001'],
    assetRefs: ['keyboard-c3-c5', 'right-hand-fingers'],
    outcome: 'Finds middle C from the two-black-key landmark and makes a comfortable first attempt at the seven-note melody.',
    reflection: {
      understanding: 'I can explain how a two-black-key group helps me find C.',
      playing: 'I can place right-hand fingers 1–5 and attempt the whole melody without pain.'
    },
    keepPlaying: [
      'Find more Cs on your instrument.',
      'Repeat the five-note walk up and down.',
      'Try the first melody from memory.',
      'Play the melody once softly and once at a comfortable medium sound.'
    ],
    readiness: {
      ready: { label: 'Ready', guidance: 'Continue when you choose, repeat for enjoyment, or try Keep Playing.' },
      practicing: { label: 'Practicing', guidance: 'Repeat one focused movement, then check in again.', reinforcementRefs: ['RF-RH-1'] },
      stuck: { label: 'Stuck', guidance: 'Make the task smaller and return to one dependable keyboard landmark.', reinforcementRefs: ['RF-KG-1'] }
    },
    reinforcementRefs: ['RF-KG-1', 'RF-RH-1'],
    pedagogicalReview: ['Session 001 technique language and fingering remain subject to qualified piano-teacher review.']
  }
];
