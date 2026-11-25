export const SESSION_TYPES = ['Learn', 'Practice', 'Play', 'Review'];
export const BLOCK_TYPES = ['text', 'keyboard', 'finger-position', 'musical-pattern', 'practice', 'reflection', 'audio-listening', 'pulse-guide', 'notation', 'rhythm-echo', 'audio-reference', 'pitch-echo', 'hand-lanes', 'dynamic-demo'];

export const assetCatalog = {
  'keyboard-c3-c5': { id: 'keyboard-c3-c5', type: 'generated-diagram' },
  'right-hand-fingers': { id: 'right-hand-fingers', type: 'generated-diagram' },
  'left-hand-fingers': { id: 'left-hand-fingers', type: 'generated-diagram' },
  'e001-pair-a': { id: 'e001-pair-a', type: 'audio', src: 'assets/audio/e001-pair-a.wav' },
  'e001-pair-b': { id: 'e001-pair-b', type: 'audio', src: 'assets/audio/e001-pair-b.wav' },
  'e001-pair-c': { id: 'e001-pair-c', type: 'audio', src: 'assets/audio/e001-pair-c.wav' },
  'e001-pair-d': { id: 'e001-pair-d', type: 'audio', src: 'assets/audio/e001-pair-d.wav' },
  'r002-a-pattern': audioAsset('r002-a-pattern'), 'r002-a-counted': audioAsset('r002-a-counted'),
  'r002-b-pattern': audioAsset('r002-b-pattern'), 'r002-b-counted': audioAsset('r002-b-counted'),
  'r002-c-pattern': audioAsset('r002-c-pattern'), 'r002-c-counted': audioAsset('r002-c-counted'),
  'r002-d-pattern': audioAsset('r002-d-pattern'), 'r002-d-counted': audioAsset('r002-d-counted'),
  'n001-a-shape': audioAsset('n001-a-shape'),
  'p01-practice': audioAsset('p01-practice'), 'p01-musical': audioAsset('p01-musical'),
  'e002-a': audioAsset('e002-a'), 'e002-b': audioAsset('e002-b'), 'e002-c': audioAsset('e002-c'),
  'p02-practice': audioAsset('p02-practice'), 'p02-musical': audioAsset('p02-musical'),
  'd001-soft-strong': audioAsset('d001-soft-strong'),
  'm001-even': audioAsset('m001-even'), 'm001-shaped': audioAsset('m001-shaped'),
  'c001-question-answer': audioAsset('c001-question-answer'),
  'p03-rhythm-count': audioAsset('p03-rhythm-count'), 'p03-sections': audioAsset('p03-sections'),
  'p03-performance': audioAsset('p03-performance')
};

function audioAsset(id) { return { id, type: 'audio', src: `assets/audio/${id}.wav` }; }

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

const sliceBSessions = () => [
  {
    id: '005', title: 'One Beat or Two', summary: 'Read and play quarter notes and half notes while the pulse continues.',
    type: 'Learn', chapter: 1,
    objective: 'Distinguish one-beat quarter notes from two-beat half notes and keep counting while a held sound continues.',
    prerequisites: ['003'], duration: { min: 10, max: 15 }, steps: session005Steps,
    musicRefs: ['R001', 'R001-A', 'R001-B', 'R001-C', 'R001-D'], assetRefs: ['keyboard-c3-c5'],
    outcome: 'Performs at least two four-beat patterns with one press per note and holds each half note for two counts.',
    reflection: { understanding: 'I understand the difference between a one-beat note and a two-beat note.', playing: 'I can keep counting while one piano sound continues for two beats.' },
    keepPlaying: ['Create one four-beat measure from quarter notes and half notes, then repeat it exactly.'],
    readiness: {
      ready: { label: 'Ready', guidance: 'Continue when you choose, or transfer one pattern to another key.' },
      practicing: { label: 'Practicing', guidance: 'Repeat quarter, quarter, half on middle C while counting 1–4.', reinforcementRefs: ['RF-RHY-1'] },
      stuck: { label: 'Stuck', guidance: 'Use four visible beat boxes and join them into two-beat holds.', reinforcementRefs: ['RF-RHY-1'], earlierSessionId: '003' }
    },
    reinforcementRefs: ['RF-PULSE-1', 'RF-RHY-1'],
    pedagogicalReview: ['Session 005 note-duration language, release timing, and visual notation require qualified piano-teacher review.']
  },
  {
    id: '006', title: 'Rhythm Echoes', summary: 'Hear, tap, and play short one-measure rhythm echoes.',
    type: 'Practice', chapter: 1,
    objective: 'Copy one-measure rhythms by listening, tapping, counting, and then playing on physical keys.',
    prerequisites: ['005'], duration: { min: 10, max: 15 }, steps: session006Steps,
    musicRefs: ['R002', 'R002-A', 'R002-B', 'R002-C'],
    assetRefs: ['r002-a-pattern', 'r002-a-counted', 'r002-b-pattern', 'r002-b-counted', 'r002-c-pattern', 'r002-c-counted', 'r002-d-pattern', 'r002-d-counted'],
    outcome: 'Reproduces three one-measure echoes after optional replay and identifies where the two-beat sound occurs.',
    reflection: { understanding: 'I can hear where a sound lasts for two beats.', playing: 'I can hear, tap, and play a short rhythm without adding an extra press.' },
    keepPlaying: ['Try the optional two-measure Echo D after the three core echoes.', 'Invent one four-beat echo with C and D, tap it, then play it.'],
    keepPlayingBlocks: [{ type: 'rhythm-echo', musicRefs: ['R002-D'] }],
    readiness: {
      ready: { label: 'Ready', guidance: 'Continue when you choose, or try optional Echo D.' },
      practicing: { label: 'Practicing', guidance: 'Repeat one echo and make both attempts match.', reinforcementRefs: ['RF-RHY-2'] },
      stuck: { label: 'Stuck', guidance: 'Return to an all-C pattern with visible counts.', reinforcementRefs: ['RF-RHY-1', 'RF-RHY-2'], earlierSessionId: '005' }
    },
    reinforcementRefs: ['RF-RHY-1', 'RF-RHY-2'],
    pedagogicalReview: ['Session 006 recordings, count timing, and hear–tap–play pacing require qualified piano-teacher review.']
  },
  {
    id: '007', title: 'The Staff Shows Shape', summary: 'Follow repeat, upward, and downward movement on a five-line staff.',
    type: 'Learn', chapter: 1,
    objective: 'Read left-to-right pitch contour as repeat, up, and down before relying on note names.',
    prerequisites: ['001'], duration: { min: 10, max: 15 }, steps: session007Steps,
    musicRefs: ['N001', 'N001-A', 'N001-B', 'N001-C'], assetRefs: ['keyboard-c3-c5', 'n001-a-shape'],
    outcome: 'Maps an unfamiliar four-note contour to same, right, or left keyboard movement and plays it on C–E.',
    reflection: { understanding: 'I can follow written music from left to right and see repeat, up, and down.', playing: 'I can turn a short staff shape into movement on neighboring piano keys.' },
    keepPlaying: ['Draw four noteheads that repeat, rise, or fall, then play your shape on C–E.'],
    readiness: {
      ready: { label: 'Ready', guidance: 'Continue when you choose, or invent one more four-note shape.' },
      practicing: { label: 'Practicing', guidance: 'Trace one contour and say each direction before playing.', reinforcementRefs: ['RF-READ-1'] },
      stuck: { label: 'Stuck', guidance: 'Compare only two large noteheads, then move between C and D.', reinforcementRefs: ['RF-READ-1'] }
    },
    reinforcementRefs: ['RF-READ-1', 'RF-EAR-1'],
    pedagogicalReview: ['Session 007 contour-reading language and neutral-staff presentation require qualified piano-teacher review.']
  },
  {
    id: '008', title: 'Two Treble Landmarks', summary: 'Find written middle C and treble G, then connect them to physical keys.',
    type: 'Learn', chapter: 1,
    objective: 'Recognize middle C on its ledger line and G on the second treble-staff line.',
    prerequisites: ['007'], duration: { min: 10, max: 15 }, steps: session008Steps,
    musicRefs: ['N002', 'N002-A', 'N002-B'], assetRefs: ['keyboard-c3-c5'],
    outcome: 'Identifies written C and G without a mnemonic and plays the matching keys in a fixed right-hand position.',
    reflection: { understanding: 'I can recognize middle C and treble G from their staff locations.', playing: 'I can move between C with finger 1 and G with finger 5 without shifting my hand.' },
    keepPlaying: ['Find another C and G on the keyboard and compare whether they sound higher or lower. Staff reading stays at middle C and treble G.'],
    readiness: {
      ready: { label: 'Ready', guidance: 'Continue when you choose, or shuffle the two landmarks once more.' },
      practicing: { label: 'Practicing', guidance: 'Point, name, and play four mixed C and G cards.', reinforcementRefs: ['RF-READ-2'] },
      stuck: { label: 'Stuck', guidance: 'Match only the ledger-line middle C before adding G.', reinforcementRefs: ['RF-READ-2'], earlierSessionId: '007' }
    },
    reinforcementRefs: ['RF-READ-1', 'RF-READ-2'],
    pedagogicalReview: ['Session 008 treble-clef, ledger-line, and landmark teaching require qualified piano-teacher review.']
  },
  {
    id: '009', title: 'Read C, D, E', summary: 'Read short treble-staff patterns with middle C, D, and E.',
    type: 'Practice', chapter: 1,
    objective: 'Use middle C plus step direction to read and play four-note C–D–E patterns.',
    prerequisites: ['005', '008'], duration: { min: 10, max: 15 }, steps: session009Steps,
    musicRefs: ['N003', 'N003-A', 'N003-B', 'N003-C', 'N003-D'], assetRefs: [],
    outcome: 'Plays a new four-note C–E card without letter labels and with no more than one self-corrected pitch.',
    reflection: { understanding: 'I can find D and E by stepping upward from written middle C.', playing: 'I can preview and play a four-note C–D–E pattern without letter labels.' },
    keepPlaying: ['Move the same physical key shape to D–E–F by ear and shape only. This is not a notation-reading test.'],
    readiness: {
      ready: { label: 'Ready', guidance: 'Continue when you choose, or read the optional fourth card.' },
      practicing: { label: 'Practicing', guidance: 'Preview one card and reveal names only after playing.', reinforcementRefs: ['RF-TREBLE-1'] },
      stuck: { label: 'Stuck', guidance: 'Read only two-note C–D, D–C, or C–C patterns.', reinforcementRefs: ['RF-READ-1', 'RF-TREBLE-1'], earlierSessionId: '007' }
    },
    reinforcementRefs: ['RF-RHY-1', 'RF-READ-1', 'RF-READ-2', 'RF-TREBLE-1'],
    pedagogicalReview: ['Session 009 staff-reading sequence, fingering cues, and self-correction expectations require qualified piano-teacher review.']
  },
  {
    id: '010', title: 'A Phrase from the Page', summary: 'Prepare, play, repair, and replay the four-measure Three-Step Walk.',
    type: 'Play', chapter: 1,
    objective: 'Read and complete the four-measure piece Three-Step Walk using preview, sectional practice, and one focused repair.',
    prerequisites: ['005', '009'], duration: { min: 10, max: 15 }, steps: session010Steps,
    musicRefs: ['P01'], assetRefs: ['p01-practice', 'p01-musical'],
    outcome: 'Uses a score preview and focused repair, then reaches the piece’s ending without restarting after every small error.',
    reflection: { understanding: 'I can preview a short score by finding its first note, shape, and note lengths.', playing: 'I can play the complete phrase with a steady thread and a recognizable ending.' },
    keepPlaying: ['Choose a title or character for Three-Step Walk and replay it.', 'Then hear a reference and compare one musical detail rather than judging correctness.'],
    readiness: {
      ready: { label: 'Ready', guidance: 'Finish here or enjoy one more complete performance.' },
      practicing: { label: 'Practicing', guidance: 'Name one measure to repair, play it twice, then reconnect it.', reinforcementRefs: ['RF-PIECE-1'] },
      stuck: { label: 'Stuck', guidance: 'Play only Measures 1–2 or return to a four-note reading card.', reinforcementRefs: ['RF-TREBLE-1', 'RF-PIECE-1'], earlierSessionId: '009' }
    },
    reinforcementRefs: ['RF-RHY-1', 'RF-READ-1', 'RF-READ-2', 'RF-TREBLE-1', 'RF-PIECE-1'],
    pedagogicalReview: ['Three-Step Walk notation, fingering guidance, reference performances, and tempo targets require qualified piano-teacher review.']
  }
];

const session002Steps = [
  {
    id: 'retrieve-landmarks', title: 'Find the landmarks again', kicker: 'Try before the hint',
    intro: 'A short memory attempt makes the keyboard pattern easier to retrieve next time.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['Without opening a diagram, look for a group of <strong>two black keys</strong>. The white key immediately to its left is C. Find two Cs, then choose the C nearest the middle of your instrument.'] },
      { type: 'practice', phase: 'try', instruction: 'On your physical instrument, point to two groups of two black keys, find the C beside each one, and choose middle C. Try first; open the hint only if you need it.', hint: 'C is the white key immediately to the left of two black keys. On an 88-key piano, middle C is the fourth C from the left. It may be off-center on a smaller keyboard.', hintVisual: { type: 'keyboard', labels: 'middle-c', highlights: ['C4'], assetRef: 'keyboard-c3-c5' } },
      { type: 'reflection', phase: 'reflect', prompt: 'Could you use the black-key shape without counting white keys from one end?', legacySelfCheck: true }
    ]
  },
  {
    id: 'retrieve-melody', title: 'Bring back the melody', kicker: 'Play from memory',
    intro: 'Recall the shape before you reveal the sequence.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['Place right-hand fingers 1–5 over C–G. Try the short melody from Session 001 once from memory. A pause to think is useful; perfection is not required.'] },
      { type: 'practice', phase: 'try', instruction: 'Play the melody once from memory. Then use the hint to check the sequence and make one calm correction if needed.', hint: 'C–D–E–G–E–D–C with right-hand fingers 1–2–3–5–3–2–1.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Which part returned first: the note names, the finger pattern, or the sound?', legacySelfCheck: true }
    ]
  },
  {
    id: 'same-or-different', title: 'Hear same or different', kicker: 'Listen, choose, reveal',
    intro: 'You can compare musical shapes before you can name every sound.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['You will hear two groups of three notes. Choose <strong>Same</strong> if every sound arrives in the same order. Choose <strong>Different</strong> if at least one sound changes.', 'Replay as often as you need. Fewer replays are not better. The notes stay hidden until you choose to reveal them.'] },
      { type: 'text', phase: 'demonstrate', paragraphs: ['First imagine C–D followed by C–D: that is Same. C–D followed by C–E is Different. The three recorded pairs below use only C–G.'] },
      { type: 'audio-listening', musicRef: 'E001', pairIds: ['A', 'B', 'C'] },
      { type: 'reflection', phase: 'reflect', prompt: 'After each reveal, point to the notes on your piano and play both versions. Notice where any change occurs.', legacySelfCheck: true }
    ]
  },
  {
    id: 'review-the-gap', title: 'Choose what to revisit', kicker: 'Name the next useful step',
    intro: 'A specific difficulty gives you a useful practice target.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'Play one revealed pair on your physical piano. Then name the main challenge: remembering the keyboard rule, hearing the change, or moving your fingers.', hint: 'If listening feels unclear, compare only C then C with C then D. Look at the keys after you answer.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you explain Same and Different, and can you use your piano to check what you heard?', legacySelfCheck: true }
    ]
  }
];

const session003Steps = [
  {
    id: 'meet-the-pulse', title: 'Meet the steady pulse', kicker: 'Steady musical time',
    intro: 'A pulse is the even background beat that music moves through.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['Count <strong>1, 2, 3, 4</strong> at an easy walking speed. Give every number the same amount of time. The numbers organize the pulse; they are not finger numbers here.', 'The pulse keeps going even when notes change or when no note sounds.'] },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you describe pulse as steady time rather than a list of notes?', legacySelfCheck: true }
    ]
  },
  {
    id: 'tap-sixteen', title: 'Tap four groups of four', kicker: 'Feel an even beat',
    intro: 'Use the guide, then let your own count carry the pulse.',
    blocks: [
      { type: 'text', phase: 'demonstrate', paragraphs: ['Start the guide and watch 16 evenly spaced beats grouped into four sets. Count 1–4 with each group. The guide is deliberately calm, not a speed target.'] },
      { type: 'pulse-guide', musicRef: 'P001' },
      { type: 'practice', phase: 'try', instruction: 'Keep your hands away from the keys. Tap 16 beats on your leg or another safe, still surface while counting four groups of 1–4.', hint: 'Do not tap a fallboard or key cover that could close or move. Use your leg instead.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Did the final four taps take about as long as the first four?', legacySelfCheck: true }
    ]
  },
  {
    id: 'pause-and-restart', title: 'Pause, then restart', kicker: 'Keep the speed in mind',
    intro: 'Silence can pass without changing the pulse you remember.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'Tap eight even beats. Rest for four silent counts, keeping the count moving in your mind or whispering it. Restart for eight beats at approximately the same speed.', hint: 'Use four beats instead of eight on each side of the rest, then build back up.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Did you restart without a conspicuous rush, long pause, or extra beat?', legacySelfCheck: true }
    ]
  },
  {
    id: 'pulse-on-c', title: 'Move the pulse to one key', kicker: 'One press per beat',
    intro: 'Now the steady beat guides a real piano action.',
    blocks: [
      { type: 'keyboard', labels: 'middle-c', highlights: ['C4'], assetRef: 'keyboard-c3-c5' },
      { type: 'practice', phase: 'try', instruction: 'Find middle C. With right-hand finger 1, play C once on each of eight new beats. Count 1–4 twice and listen without trying to be fast.', hint: 'Tap four beats away from the keys first. Keep that same easy pace when you begin pressing C.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can one key press meet each beat while your hand and shoulder stay easy?', legacySelfCheck: true }
    ]
  }
];

const session004Steps = [
  {
    id: 'reset-the-pulse', title: 'Bring back the pulse', kicker: 'Start with steady time',
    intro: 'Prepare the beat before asking your fingers to move.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'Tap eight even beats and count 1–4 twice. Keep the count moving without emphasizing the final beat.', hint: 'Revisit Session 003’s pulse guide if the beats begin to rush.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you keep eight beats moving at one comfortable pace?', legacySelfCheck: true }
    ]
  },
  {
    id: 'prepare-five-notes', title: 'Prepare C through G', kicker: 'Comfort before motion',
    intro: 'Set up a relaxed right-hand five-note position.',
    blocks: [
      { type: 'finger-position', hand: 'right', assetRef: 'right-hand-fingers' },
      { type: 'keyboard', labels: 'fingers', highlights: ['C4', 'D4', 'E4', 'F4', 'G4'], assetRef: 'keyboard-c3-c5' },
      { type: 'practice', phase: 'try', instruction: 'Place right-hand fingers 1–5 on C–G. Let your shoulders rest, keep your wrist free, and check that no finger is forced to stretch.', hint: 'Release your hand completely, shake it out gently, and place it again. Stop if you feel pain, tingling, or numbness.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can every fingertip rest over its own key without gripping?', legacySelfCheck: true }
    ]
  },
  {
    id: 'walk-with-the-beat', title: 'Walk up and down', kicker: 'One note per beat',
    intro: 'The pulse continues when the notes turn around at G.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['Count 1–4 again and again. G may arrive on a different count each time; that is fine. Do not add a pause at G. A slower, even pattern teaches more than a fast, uneven one.'] },
      { type: 'text', phase: 'demonstrate', paragraphs: ['Start the guide to see one beat move through C–D–E–F–G–F–E–D–C. The turn at G receives exactly one beat, just like every other note.'] },
      { type: 'pulse-guide', musicRef: 'K001' },
      { type: 'practice', phase: 'try', instruction: 'Count four preparation beats. Then play C–D–E–F–G–F–E–D–C, one note per continuing beat. Do not stop at G.', hint: 'Say the note names once without playing. Then try the pattern at a deliberately slower pulse.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Did the count continue through G without an extra pause?', legacySelfCheck: true }
    ]
  },
  {
    id: 'target-one-repair', title: 'Repeat with one focus', kicker: 'Practice one useful change',
    intro: 'A focused repeat is more useful than asking everything to improve at once.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'Play the full nine-note walk twice more. Before each attempt, choose only one focus: steady pulse, correct keys, or physical comfort. Pause and reset between attempts.', hint: 'If the turn is uneven, repeat only E–F–G–F–E on five beats. If that is too much, return to eight C presses from Session 003.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you play the walk twice without an extra pause at G or a marked rush on the way down?', legacySelfCheck: true }
    ]
  }
];

const session005Steps = [
  {
    id: 'one-or-two-beats', title: 'One beat or two beats', kicker: 'Meet two note lengths',
    intro: 'A note can begin once and continue while the pulse keeps moving.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['A <strong>quarter note</strong> lasts for one beat. A <strong>half note</strong> lasts for two beats. During a half note, press once and let the sound continue while you count the second number. Do not press the key again.', 'The pulse never waits for the note. In 4/4, every measure below contains four beats.'] },
      { type: 'notation', musicRefs: ['R001-A', 'R001-D'], options: { showLabels: true, showBeatGrid: true, caption: 'Quarter notes begin on one beat. Half notes continue through two beats.' } },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you point to a one-beat note and a two-beat note?', legacySelfCheck: true }
    ]
  },
  {
    id: 'hold-middle-c', title: 'Hold middle C for two', kicker: 'Press once, keep counting',
    intro: 'The second beat belongs to the same sound—not another key press.',
    blocks: [
      { type: 'keyboard', labels: 'middle-c', highlights: ['C4'], assetRef: 'keyboard-c3-c5' },
      { type: 'practice', phase: 'try', instruction: 'Count four even beats. Press middle C once on count 1, hold through count 2, and release before count 3. Press once again on count 3, hold through count 4, then release.', hint: 'Say “press, hold, press, hold.” Keep the pulse moving even if the piano sound fades.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Did each two-beat sound use only one key press?', legacySelfCheck: true }
    ]
  },
  {
    id: 'four-duration-patterns', title: 'Speak, tap, then play', kicker: 'Read four rhythm patterns',
    intro: 'Prepare the timing away from the keys before you play it.',
    blocks: [
      { type: 'notation', musicRefs: ['R001-A', 'R001-B', 'R001-C', 'R001-D'], options: { showLabels: true, showBeatGrid: true } },
      { type: 'practice', phase: 'try', instruction: 'For each pattern: speak the counts, tap the note beginnings, then play it on middle C. Hold each half note through its second beat without pressing again.', hint: 'Work with Pattern A only until “quarter, quarter, half” fills four even beats.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you keep counting through the held beats in at least two patterns?', legacySelfCheck: true }
    ]
  },
  {
    id: 'move-the-pitches', title: 'Keep the rhythm while notes move', kicker: 'Transfer the first pattern',
    intro: 'Changing the key does not change the written duration.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'Play Pattern A once more as C, D, E: C for one beat, D for one beat, then E for two beats. Count 1–4 and release E after count 4.', hint: 'Say “C on 1, D on 2, E on 3—hold 4” before playing.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you explain one beat versus two beats, and keep counting while E continues?', legacySelfCheck: true }
    ]
  }
];

const session006Steps = [
  {
    id: 'echo-method', title: 'Hear, tap, play', kicker: 'Copy timing by ear',
    intro: 'An echo waits for the whole pattern, then sends the same timing back.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['Listen to the whole rhythm before moving. Then tap it, count it, and finally play it. The note may change, but the timing is the part you are copying.', 'Replay is a practice tool, not a penalty. Each recording begins with a spoken four-count.'] },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you name the order: Hear, Tap, Play?', legacySelfCheck: true }
    ]
  },
  {
    id: 'echo-a', title: 'Echo A', kicker: 'Try before revealing',
    intro: 'Listen once or twice, then tap and play the pattern on middle C.',
    blocks: [
      { type: 'rhythm-echo', musicRefs: ['R002-A'] },
      { type: 'practice', phase: 'try', instruction: 'Hear Echo A. Tap it, then play it on middle C. Reveal the score only after your first attempt.', hint: 'The spoken-count version is available after you try the pattern-only recording.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Where did the two-beat sound occur?', legacySelfCheck: true }
    ]
  },
  {
    id: 'echo-b-c', title: 'Echo B and C', kicker: 'Keep the timing, change the key',
    intro: 'These patterns use C and D, but each measure still contains four beats.',
    blocks: [
      { type: 'rhythm-echo', musicRefs: ['R002-B', 'R002-C'] },
      { type: 'practice', phase: 'try', instruction: 'For Echoes B and C, listen, tap, and then play C and D as written. Use no more than two listens before each first attempt, then reveal and check.', hint: 'If the pitch change distracts you, tap the rhythm first and add C/D afterward.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you hear which sound continues for two beats?', legacySelfCheck: true }
    ]
  },
  {
    id: 'repair-one-echo', title: 'Repair one echo', kicker: 'Repeat the least secure pattern',
    intro: 'Choose one small target instead of repeating everything.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'Choose the least secure echo. Reveal its score and count blocks, then play it twice the same way. Explain where its half note occurs.', hint: 'Return to the all-C Pattern A from Session 005 if hearing, pitch, and movement feel like too much at once.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you copy the rhythm without adding an extra press?', legacySelfCheck: true }
    ]
  }
];

const session007Steps = [
  {
    id: 'meet-the-staff', title: 'Meet the five-line staff', kicker: 'See pitch shape',
    intro: 'Written music moves from left to right and places sounds higher or lower.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['The five horizontal lines are called a <strong>staff</strong>. A note placed higher sounds higher and moves right on this part of the keyboard. A note placed lower sounds lower and moves left. Notes at the same height repeat the same key.', 'Today, follow shape. Specific written note names come next.'] },
      { type: 'notation', musicRefs: ['N001-A'], options: { reveal: true, revealDirections: true, revealLabels: false, revealLabel: 'Reveal directions' } },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you trace the notes from left to right?', legacySelfCheck: true }
    ]
  },
  {
    id: 'trace-three-shapes', title: 'Trace repeat, up, and down', kicker: 'Read movement',
    intro: 'Neighboring line and space positions represent neighboring steps.',
    blocks: [
      { type: 'notation', musicRefs: ['N001-A', 'N001-B', 'N001-C'], options: { reveal: true, revealDirections: true, revealLabels: false, revealLabel: 'Reveal directions' } },
      { type: 'practice', phase: 'try', instruction: 'Point left to right across each card. Between notes, say repeat, up, or down. Then place your right hand over C–D–E and play the same shape on neighboring keys.', hint: 'Use only two notes first: same height means the same key; one step higher means move one white key right.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you connect higher/lower placement with right/left movement?', legacySelfCheck: true }
    ]
  },
  {
    id: 'play-the-shapes', title: 'Play what the shape shows', kicker: 'Staff to physical keys',
    intro: 'The staff guides movement even before every note has a name.',
    blocks: [
      { type: 'keyboard', labels: 'five-notes', highlights: ['C4', 'D4', 'E4'], assetRef: 'keyboard-c3-c5' },
      { type: 'practice', phase: 'try', instruction: 'Choose each contour card in turn. Start on middle C and use adjacent C–D–E keys to follow its repeats, upward steps, and downward steps.', hint: 'Keep fingers 1–3 resting over C–D–E so “up” is one prepared key to the right.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you follow a four-note shape without letter labels?', legacySelfCheck: true }
    ]
  },
  {
    id: 'match-sound-shape', title: 'Match sound to shape', kicker: 'Listen, choose, reveal',
    intro: 'Listen for repeats and upward steps, then choose the matching card.',
    blocks: [
      { type: 'audio-reference', title: 'Contour listening example', tracks: [{ assetRef: 'n001-a-shape', label: 'Hear the contour' }], transcriptHidden: true, transcriptSummary: 'Reveal the accessible audio description after choosing', transcript: 'Four-count, then four notes: repeat, up, up.' },
      { type: 'notation', musicRefs: ['N001-A', 'N001-B', 'N001-C'], options: {} },
      { type: 'practice', phase: 'try', instruction: 'Listen, then choose Contour A, B, or C from the cards you just played. Open the hint only after choosing, then replay and play the answer on your piano.', hint: 'The answer is Contour A: C, C, D, E—repeat, up, up.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you match repeat/up/down in sound to the written shape?', legacySelfCheck: true }
    ]
  }
];

const session008Steps = [
  {
    id: 'treble-c-and-g', title: 'Meet written C and G', kicker: 'Two treble landmarks',
    intro: 'Two dependable locations help you orient without memorizing a sentence.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['The <strong>treble clef</strong> marks the staff used for these right-hand notes. Middle C sits on one short <strong>ledger line</strong> below the staff. G sits on the second line up from the bottom.', 'Count the lines from the bottom for G once. After that, learn its visual location.'] },
      { type: 'notation', musicRefs: ['N002-A'], options: { showLabels: true, showAllFingers: true, showBeatGrid: true } },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you describe where middle C and treble G sit?', legacySelfCheck: true }
    ]
  },
  {
    id: 'match-staff-and-keys', title: 'Match the landmarks to keys', kicker: 'Written note to physical piano',
    intro: 'Connect each staff position to the key under your prepared hand.',
    blocks: [
      { type: 'keyboard', labels: 'fingers', highlights: ['C4', 'G4'], assetRef: 'keyboard-c3-c5' },
      { type: 'practice', phase: 'try', instruction: 'Point to written middle C, then play C with right-hand finger 1. Point to written G, then play G with finger 5. Mix the order four times.', hint: 'Middle C has the short line through it below the staff. G sits on the second full line from the bottom.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you identify each landmark without a mnemonic?', legacySelfCheck: true }
    ]
  },
  {
    id: 'play-landmark-patterns', title: 'Play two landmark patterns', kicker: 'Count in, then read',
    intro: 'Your hand remains in the familiar C–G position while the notation changes.',
    blocks: [
      { type: 'notation', musicRefs: ['N002-A', 'N002-B'], options: { showAllFingers: true, showBeatGrid: true, reveal: true, revealLabel: 'Reveal note names' } },
      { type: 'practice', phase: 'try', instruction: 'Give a four-count, then play Pattern A. Reset and play Pattern B. Keep the half note sounding for two beats.', hint: 'Prepare fingers 1 and 5 over C and G before the count-in.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you move between C and G without shifting your whole hand?', legacySelfCheck: true }
    ]
  },
  {
    id: 'landmarks-without-labels', title: 'Read without labels', kicker: 'Retrieve the locations',
    intro: 'Try one pattern again with only the clef and note positions.',
    blocks: [
      { type: 'notation', musicRefs: ['N002-B'], options: { showBeatGrid: false } },
      { type: 'practice', phase: 'try', instruction: 'Play the pattern after a four-count without revealing note names. If needed, identify the first note, reset your hand, and try once more.', hint: 'The first note is G on the second line from the bottom.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you match both written landmarks to the correct physical keys?', legacySelfCheck: true }
    ]
  }
];

const session009Steps = [
  {
    id: 'map-c-d-e', title: 'Map C, D, and E', kicker: 'Read outward from middle C',
    intro: 'A known landmark plus step direction reveals nearby notes.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['Start from middle C on its ledger line. The next note up is D, in the space below the staff. The next step is E, on the bottom line.', 'Before playing, find the first note and trace whether the pattern repeats, steps up, or steps down.'] },
      { type: 'notation', musicRefs: ['N003-A'], options: { showStartingFinger: true, reveal: true, revealDirections: true, revealLabel: 'Reveal note names and directions' } },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you use middle C plus upward steps to find D and E?', legacySelfCheck: true }
    ]
  },
  {
    id: 'read-card-a', title: 'Preview and read Card A', kicker: 'Landmark, direction, rhythm',
    intro: 'Preview first; the cursor will not follow while you play.',
    blocks: [
      { type: 'notation', musicRefs: ['N003-A'], options: { showStartingFinger: true, showBeatGrid: true, reveal: true, revealDirections: true } },
      { type: 'practice', phase: 'try', instruction: 'Find the first note, speak the directions, prepare right-hand fingers 1–3, count four, and play Card A.', hint: 'The shape is up, up, down from middle C.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you preview before your hand begins moving?', legacySelfCheck: true }
    ]
  },
  {
    id: 'read-card-b-c', title: 'Read Cards B and C', kicker: 'Try before names appear',
    intro: 'Let staff position and direction—not printed letters—lead the first attempt.',
    blocks: [
      { type: 'notation', musicRefs: ['N003-B', 'N003-C'], options: { showStartingFinger: true, reveal: true, revealDirections: true, revealLabel: 'Reveal note names and directions' } },
      { type: 'practice', phase: 'try', instruction: 'Preview and play Card B, then Card C, after separate four-counts. Reveal the names only after each attempt.', hint: 'If three notes are too much, read only C–D, D–C, or C–C.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you keep your right hand prepared while your eyes follow the staff?', legacySelfCheck: true }
    ]
  },
  {
    id: 'independent-reading', title: 'Read one card independently', kicker: 'No labels, no moving cursor',
    intro: 'A calm preview gives you a plan before the count-in.',
    blocks: [
      { type: 'notation', musicRefs: ['N003-C'], options: { showStartingFinger: true } },
      { type: 'practice', phase: 'try', instruction: 'Preview Card C silently, count four, and play it without labels or cursor help. A self-corrected note is useful information, not failure.', hint: 'Find middle C first, then follow repeat, up, up.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you read a four-note C–D–E pattern without letters above the notes?', legacySelfCheck: true }
    ]
  }
];

const session010Steps = [
  {
    id: 'preview-the-piece', title: 'Preview Three-Step Walk', kicker: 'Look before playing',
    intro: 'A short preview turns the score into a practical plan.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['A piece has a beginning, a journey, and an ending. Before playing, find the first note, trace the shape, notice one- and two-beat notes, and prepare your hand.', 'The score is primary. Reference audio stays closed until after your own attempt.'] },
      { type: 'notation', musicRefs: ['P01'], options: { measureNumbers: true, showStartingFinger: true, enlarge: true, caption: 'RH only. Four measures in 4/4. Start on middle C with finger 1.' } },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you point out the first note, the direction changes, and every half note?', legacySelfCheck: true }
    ]
  },
  {
    id: 'prepare-two-sections', title: 'Prepare two sections', kicker: 'Measures 1–2, then 3–4',
    intro: 'Tap and play each half before connecting the full piece.',
    blocks: [
      { type: 'notation', musicRefs: ['P01'], options: { measureNumbers: true, showStartingFinger: true, showBeatGrid: true } },
      { type: 'practice', phase: 'try', instruction: 'Tap and count Measures 1–2, then play them. Reset, tap and count Measures 3–4, then play them. Hold every half note through its second beat.', hint: 'If needed, work with only Measure 1: C quarter, D quarter, E half.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you prepare each two-measure section without hearing a model first?', legacySelfCheck: true }
    ]
  },
  {
    id: 'complete-attempt', title: 'Play the complete phrase', kicker: 'Keep the musical thread',
    intro: 'Small errors do not have to stop the journey to the ending.',
    blocks: [
      { type: 'notation', musicRefs: ['P01'], options: { measureNumbers: true, showStartingFinger: true, enlarge: true } },
      { type: 'practice', phase: 'try', instruction: 'Prepare right-hand fingers 1–3, count four, and play all four measures at a comfortable pulse. If a note is missed, keep moving when you can and reach the final C.', hint: 'A comfortable target is about 56 beats per minute, but an even self-count matters more than the number.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you reach the ending without restarting for every small error?', legacySelfCheck: true }
    ]
  },
  {
    id: 'repair-and-replay', title: 'Repair one measure and replay', kicker: 'Practice a specific place',
    intro: 'One named repair is more useful than judging the whole performance.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'Choose the least secure measure. Speak its count, play it twice, connect it once to the following measure when possible, then replay the complete piece.', hint: 'If the whole piece feels too large, prepare and play only Measures 1–2 today.' },
      { type: 'audio-reference', title: 'Reference performances', collapsed: true, summary: 'Hear after my try', tracks: [{ assetRef: 'p01-practice', label: 'Practice version at 56 bpm' }, { assetRef: 'p01-musical', label: 'Musical version at 64 bpm' }], transcript: 'Spoken four-count, then the four written measures of Three-Step Walk.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you show your preview method and complete the phrase with a recognizable ending?', legacySelfCheck: true }
    ]
  }
];

const session011Steps = [
  {
    id: 'find-lower-c', title: 'Find the C below middle C', kicker: 'Orient the left hand',
    intro: 'Your left-hand home note is the next C to the left of middle C.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['Find middle C, then move left to the next group of two black keys. The white key immediately to its left is <strong>C3</strong>, the C one octave below middle C.', 'Smaller keyboards may place these keys away from the visual center. Use the repeating black-key landmark, not the case of the instrument.'] },
      { type: 'keyboard', labels: 'octave-c', highlights: ['C3', 'C4'], assetRef: 'keyboard-c3-c5' },
      { type: 'practice', phase: 'try', instruction: 'Find middle C, play it once with the right hand, then find and play the next C to the left with left-hand finger 5.', hint: 'Locate two black keys, then use the white key immediately to their left.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you travel from middle C to the next C left without counting every white key?', legacySelfCheck: true }
    ]
  },
  {
    id: 'left-finger-numbers', title: 'Number the left hand', kicker: 'Thumb is still 1',
    intro: 'Finger numbers begin at the thumb on both hands, so they appear reversed across the keyboard.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['On the left hand, the thumb is 1, index 2, middle 3, ring 4, and little finger 5. From C3 to G3, the fingers are <strong>5–4–3–2–1</strong>.', 'Gently move each finger away from the keys once. Keep the shoulder loose and the wrist mobile.'] },
      { type: 'finger-position', hand: 'left', assetRef: 'left-hand-fingers' },
      { type: 'practice', phase: 'try', instruction: 'Away from the keyboard, name left-hand fingers 1–5. Then place finger 5 on C3 and let fingers 4–3–2–1 rest naturally toward G3.', hint: 'Do not force every fingertip into a rigid row. A comfortable curved hand can stay mobile.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you explain why the left little finger is 5?', legacySelfCheck: true }
    ]
  },
  {
    id: 'place-release-reset', title: 'Place, release, and reset', kicker: 'Comfort before movement',
    intro: 'A clean reset teaches the position without holding tension.',
    blocks: [
      { type: 'keyboard', labels: 'left-fingers', highlights: ['C3', 'D3', 'E3', 'F3', 'G3'], assetRef: 'keyboard-c3-c5' },
      { type: 'practice', phase: 'try', instruction: 'Place left-hand fingers 5–1 on C3–G3. Let the arm feel supported, then release the hand completely. Reset once more without stretching.', hint: 'If the span feels forced, begin with only C3–D3–E3 under fingers 5–4–3.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can the wrist stay level and free while the fingertips rest near the keys?', legacySelfCheck: true }
    ]
  },
  {
    id: 'left-five-note-walk', title: 'Play the left-hand walk', kicker: 'K002 on a calm pulse',
    intro: 'Move up and down one neighboring key at a time, pausing after the ascent if useful.',
    blocks: [
      { type: 'pulse-guide', musicRef: 'K002' },
      { type: 'practice', phase: 'try', instruction: 'After four preparation counts, play C–D–E–F–G with left-hand fingers 5–4–3–2–1. Pause if needed, then return G–F–E–D–C with 1–2–3–4–5.', hint: 'Play only C–D–E and back if the five-note position feels tense. Stop if you feel pain.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you find the position and play K002 without forced stretching or held tension?', legacySelfCheck: true }
    ]
  }
];

const session012Steps = [
  {
    id: 'reset-left-walk', title: 'Reset the left-hand walk', kicker: 'Prepare, count, move',
    intro: 'Release before each attempt so the hand begins easy rather than braced.',
    blocks: [
      { type: 'keyboard', labels: 'left-fingers', highlights: ['C3', 'D3', 'E3', 'F3', 'G3'], assetRef: 'keyboard-c3-c5' },
      { type: 'pulse-guide', musicRef: 'K002' },
      { type: 'practice', phase: 'try', instruction: 'Count four, then play K002 one note per beat twice. Release the hand fully between attempts.', hint: 'Use a slower self-count if the return from G to C becomes uneven.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can your left hand keep an easy shape while the pulse continues?', legacySelfCheck: true }
    ]
  },
  {
    id: 'left-step-shapes', title: 'Trace two step shapes', kicker: 'See movement before hearing it',
    intro: 'A repeat stays on one key; up moves right; down moves left.',
    blocks: [
      { type: 'text', phase: 'demonstrate', paragraphs: ['Trace and play <strong>C3–D3–E3</strong>: up, up. Then trace and play <strong>E3–D3–C3</strong>: down, down. Use left-hand fingers 5–4–3 and 3–4–5.'] },
      { type: 'practice', phase: 'try', instruction: 'Say each direction, then play both three-note shapes twice with clear releases.', hint: 'If three notes are too much, alternate only C3 and D3 with fingers 5 and 4.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you connect heard or seen up/down movement with right/left keyboard movement?', legacySelfCheck: true }
    ]
  },
  {
    id: 'left-pitch-echoes', title: 'Hear, trace, and play', kicker: 'E002 listening echoes',
    intro: 'Listen to the whole three-note echo before moving, then trace its direction and play it.',
    blocks: [
      { type: 'pitch-echo', musicRef: 'E002', echoIds: ['A', 'B', 'C'] },
      { type: 'practice', phase: 'try', instruction: 'For Echoes A–C: listen, trace the direction with one finger, then reproduce the notes in the left-hand C–E position. Reveal only after your first attempt.', hint: 'Replay is allowed. Begin with Echo A and visible arrows if the task feels crowded.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you reproduce at least one three-note echo after optional replay?', legacySelfCheck: true }
    ]
  },
  {
    id: 'release-and-repeat', title: 'Repeat one useful item', kicker: 'Target the least secure movement',
    intro: 'A full release helps the repeat become easier instead of tighter.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'Choose K002 or one E002 echo. Release the hand, prepare C3–E3 or C3–G3, and repeat that item once with a calm count.', hint: 'Return to Session 011 if locating or placing the left hand is still uncertain.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you keep clear releases and an easy hand through two short patterns?', legacySelfCheck: true }
    ]
  }
];

const session013Steps = [
  {
    id: 'meet-bass-landmarks', title: 'Meet bass C and bass F', kicker: 'Two lower-staff landmarks',
    intro: 'The bass clef marks the staff used for these lower left-hand notes.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['C3 sits in the <strong>second space from the bottom</strong> of the bass staff. F3 sits on the <strong>fourth line from the bottom</strong>. They are already under left-hand fingers 5 and 2.', 'These two locations are landmarks. You do not need to memorize a sentence for every line and space.'] },
      { type: 'notation', musicRefs: ['N004-A'], options: { showLabels: true, showAllFingers: true, showBeatGrid: true, enlarge: true } },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you describe where written C3 and F3 sit?', legacySelfCheck: true }
    ]
  },
  {
    id: 'connect-bass-to-keys', title: 'Connect the staff to the keys', kicker: 'Point, name, play',
    intro: 'Match each written landmark to the prepared key and finger.',
    blocks: [
      { type: 'keyboard', labels: 'left-fingers', highlights: ['C3', 'F3'], assetRef: 'keyboard-c3-c5' },
      { type: 'practice', phase: 'try', instruction: 'Point to written C3 and play it with left-hand finger 5. Point to F3 and play it with finger 2. Mix the order six times.', hint: 'Learn bass C alone first. Add F only after C feels dependable.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you match each landmark without shifting the five-note hand position?', legacySelfCheck: true }
    ]
  },
  {
    id: 'play-bass-landmarks', title: 'Play N004 A and B', kicker: 'Read after a four-count',
    intro: 'Preview the first note and keep every measure to four beats.',
    blocks: [
      { type: 'notation', musicRefs: ['N004-A', 'N004-B'], options: { showAllFingers: true, showBeatGrid: true, reveal: true, revealLabel: 'Reveal note names' } },
      { type: 'practice', phase: 'try', instruction: 'Count four, play Pattern A, reset, then count four and play Pattern B. Hold each half note through its second beat.', hint: 'Prepare fingers 5 and 2 over C3 and F3 before counting.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you read both landmarks and keep the written durations?', legacySelfCheck: true }
    ]
  },
  {
    id: 'bass-without-labels', title: 'Retrieve one landmark pattern', kicker: 'No permanent note labels',
    intro: 'Try one pattern from staff location alone before opening the hint.',
    blocks: [
      { type: 'notation', musicRefs: ['N004-B'], options: { showStartingFinger: true } },
      { type: 'practice', phase: 'try', instruction: 'Identify the first note, count four, and play Pattern B without printed note names.', hint: 'F3 is on the fourth line from the bottom and uses left-hand finger 2.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you identify both landmarks without a letter mnemonic?', legacySelfCheck: true }
    ]
  }
];

const session014Steps = [
  {
    id: 'map-bass-c-d-e', title: 'Map bass C, D, and E', kicker: 'Step upward from C',
    intro: 'A landmark plus step direction reveals the nearby notes.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['Begin from bass C in the second space. The next step up is D on the middle line; the next is E in the space above it.', 'On this keyboard area, a written step up still moves one white key to the right.'] },
      { type: 'notation', musicRefs: ['N005-A'], options: { showStartingFinger: true, reveal: true, revealDirections: true, revealLabel: 'Reveal note names and directions' } },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you use bass C plus steps to find D3 and E3?', legacySelfCheck: true }
    ]
  },
  {
    id: 'read-bass-card-a', title: 'Preview and read Card A', kicker: 'Landmark, direction, rhythm',
    intro: 'Preview before moving so the hand has a simple plan.',
    blocks: [
      { type: 'notation', musicRefs: ['N005-A'], options: { showStartingFinger: true, showBeatGrid: true, reveal: true, revealDirections: true } },
      { type: 'practice', phase: 'try', instruction: 'Find the first note, speak the directions, prepare left-hand fingers 5–4–3, count four, and play Card A.', hint: 'The shape is up, up, down from bass C.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you preview the shape before the fingers move?', legacySelfCheck: true }
    ]
  },
  {
    id: 'read-bass-cards-b-c', title: 'Read Cards B and C', kicker: 'Try before revealing names',
    intro: 'Let the bass staff and contour lead the first attempt.',
    blocks: [
      { type: 'notation', musicRefs: ['N005-B', 'N005-C'], options: { showStartingFinger: true, reveal: true, revealDirections: true, revealLabel: 'Reveal note names and directions' } },
      { type: 'practice', phase: 'try', instruction: 'Preview and play Card B, then Card C, after separate four-counts. Reveal the names only after each attempt.', hint: 'If needed, read only C3–D3, D3–C3, or C3–C3.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can the hand stay easy while the eyes follow the bass staff?', legacySelfCheck: true }
    ]
  },
  {
    id: 'independent-bass-reading', title: 'Read one card independently', kicker: 'No labels, no cursor',
    intro: 'Use a silent preview and one calm count-in.',
    blocks: [
      { type: 'notation', musicRefs: ['N005-C'], options: { showStartingFinger: true } },
      { type: 'practice', phase: 'try', instruction: 'Preview Card C silently, count four, and play it without note labels. Look toward the score instead of checking every key.', hint: 'Find bass C first, then follow repeat, up, up.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you read a new C3–E3 card without tightening or labeling every note?', legacySelfCheck: true }
    ]
  }
];

const session015Steps = [
  {
    id: 'prepare-both-hands', title: 'Prepare both hands', kicker: 'One shared pulse',
    intro: 'Both hands wait near their keys, but only one plays at a time.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['Prepare left-hand C3 and right-hand middle C before starting. One hand plays while the other waits easily near its keys. Do not lift the waiting hand high.', 'The count continues through every hand change. No notes sound at the same time in this session.'] },
      { type: 'keyboard', labels: 'octave-c', highlights: ['C3', 'C4'], assetRef: 'keyboard-c3-c5' },
      { type: 'practice', phase: 'try', instruction: 'Silently touch left-hand finger 5 to C3 and right-hand finger 1 to C4. Release, then prepare both again without bracing the shoulders.', hint: 'Locate each C from its two-black-key group before preparing both hands.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can both hands stay prepared without either hand pressing?', legacySelfCheck: true }
    ]
  },
  {
    id: 'first-hand-lane', title: 'Left, right, left, right', kicker: 'H001 Measure 1',
    intro: 'The two labeled lanes show exactly which hand owns each beat.',
    blocks: [
      { type: 'hand-lanes', musicRef: 'H001', measureIndexes: [0], animated: true, bpm: 52 },
      { type: 'practice', phase: 'try', instruction: 'Tap LH–RH–LH–RH on your legs for four beats. Then play C3–C4–C3–C4 with both hands prepared.', hint: 'If the switch adds a pause, use leg taps only while counting 1–4.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you switch hands without inserting an extra beat?', legacySelfCheck: true }
    ]
  },
  {
    id: 'second-hand-lane', title: 'Add the second measure', kicker: 'New keys, same alternation',
    intro: 'Measure 2 keeps the same left-right order while each hand steps upward.',
    blocks: [
      { type: 'hand-lanes', musicRef: 'H001', measureIndexes: [1], animated: true, bpm: 52 },
      { type: 'practice', phase: 'try', instruction: 'Prepare both hands, count four, and play Measure 2: LH D3, RH D4, LH E3, RH E4.', hint: 'Practice D3–D4 alone before adding E3–E4.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can the waiting hand remain near its keys while the other hand plays?', legacySelfCheck: true }
    ]
  },
  {
    id: 'connect-hand-lanes', title: 'Connect both measures', kicker: 'Keep counting across the change',
    intro: 'The pattern lasts eight beats without any simultaneous notes.',
    blocks: [
      { type: 'hand-lanes', musicRef: 'H001', animated: true, bpm: 52 },
      { type: 'practice', phase: 'try', instruction: 'Count four preparation beats, then play both H001 measures at a comfortable 48–56 bpm. Release both hands and check shoulders and wrists.', hint: 'Repeat only Measure 1 three times if the longer pattern feels crowded.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Do you know which hand owns each beat, and can you change hands while the count continues?', legacySelfCheck: true }
    ]
  }
];

const session016Steps = [
  {
    id: 'question-answer-waits', title: 'One hand plays, one hand waits', kicker: 'A practical full-measure rest',
    intro: 'The top staff is right hand; the bottom staff is left hand. Only one hand plays in each measure.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['A centered rest sign in the inactive staff means <strong>this hand waits for all four beats</strong>. Keep counting 1, 2, 3, 4 while that hand stays relaxed near its keys.', 'This is a practical waiting sign. You do not need to compare it with a whole note or calculate a new note value.'] },
      { type: 'hand-lanes', musicRef: 'P02', measureIndexes: [0, 1] },
      { type: 'practice', phase: 'try', instruction: 'Point through Measure 1: RH C, D, E begins, E continues while LH waits on all four counts. Then point through Measure 2 with the roles reversed.', hint: 'Say “right hand plays” or “left hand plays” before each measure.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you explain what the inactive hand does for all four beats?', legacySelfCheck: true }
    ]
  },
  {
    id: 'preview-paired-score', title: 'Preview Hello, Down There', kicker: 'Follow top/right and bottom/left',
    intro: 'Active-hand labels and aligned barlines show the conversation measure by measure.',
    blocks: [
      { type: 'notation', musicRefs: ['P02'], options: { measureNumbers: true, showEntranceFingers: true, enlarge: true, caption: 'RH question, LH answer, RH question, LH answer. The inactive hand waits for all four beats.' } },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you point to each RH and LH entrance before playing?', legacySelfCheck: true }
    ]
  },
  {
    id: 'prepare-separate-parts', title: 'Prepare each hand separately', kicker: 'Measures 1 and 3, then 2 and 4',
    intro: 'Learn each part before practicing the hand changes.',
    blocks: [
      { type: 'notation', musicRefs: ['P02'], options: { measureNumbers: true, showEntranceFingers: true } },
      { type: 'practice', phase: 'try', instruction: 'Play RH Measures 1 and 3 separately. Then play LH Measures 2 and 4 separately. Count four before every attempt and hold each half note for two beats.', hint: 'Use Session 009 for the RH notes or Session 014 for the LH notes if one staff is uncertain.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can each hand play its two measures without the other hand joining?', legacySelfCheck: true }
    ]
  },
  {
    id: 'play-two-hand-conversation', title: 'Play the complete conversation', kicker: 'Change hands by measure',
    intro: 'Practice each hand change, then keep the musical thread through all four measures.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'Practice the Measure 1→2 and Measure 3→4 changes. Then count four and play all of Hello, Down There at a comfortable 52–60 bpm. Repair one transition and replay.', hint: 'If needed, play Measure 1, count one full silent four-beat measure with both hands prepared, then play Measure 2.' },
      { type: 'audio-reference', title: 'Reference performances', collapsed: true, summary: 'Hear after my try', tracks: [{ assetRef: 'p02-practice', label: 'Practice version at 52 bpm' }, { assetRef: 'p02-musical', label: 'Reference version at 60 bpm' }], transcript: 'Four-count, then RH Measure 1, LH Measure 2, RH Measure 3, and LH Measure 4. No notes sound simultaneously.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you follow top/right and bottom/left staves and change hands while the count continues?', legacySelfCheck: true }
    ]
  }
];

const session017Steps = [
  {
    id: 'quarter-rest-meaning', title: 'Silence still has a beat', kicker: 'One counted quarter rest',
    intro: 'A quarter rest is one beat with no note, but musical time keeps moving.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['A <strong>quarter rest</strong> means one beat of intentional silence. Keep counting so the next note arrives in the right place.', 'Release the previous note before the rest. The silent beat is not a pause button, and the pulse does not reset.'] },
      { type: 'notation', musicRefs: ['R003-A'], options: { showLabels: true, showBeatGrid: true, enlarge: true, caption: 'Count 1: C. Count 2: quarter rest—silent. Count 3: D. Count 4: E.' } },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you explain why the silent beat still receives a count?', legacySelfCheck: true }
    ]
  },
  {
    id: 'speak-tap-rest', title: 'Speak, then tap', kicker: 'Keep all four counts moving',
    intro: 'Your voice and the moving beat cell continue even when your hands are silent.',
    blocks: [
      { type: 'text', phase: 'demonstrate', paragraphs: ['Say “play, rest, play, play.” Then say “1, 2, 3, 4” and tap on beats 1, 3, and 4. Beat 2 remains silent.'] },
      { type: 'pulse-guide', musicRef: 'R003-A' },
      { type: 'practice', phase: 'try', instruction: 'Start the guide. Say all four numbers, but tap only beats 1, 3, and 4. Repeat without the guide.', hint: 'Keep a small pointing motion through beat 2 even though you do not tap.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can the pulse continue through beat 2 without an extra wait?', legacySelfCheck: true }
    ]
  },
  {
    id: 'play-rest-patterns', title: 'Speak, tap, play', kicker: 'R003 A and B',
    intro: 'Use the same three-part routine for two different rest placements.',
    blocks: [
      { type: 'notation', musicRefs: ['R003-A', 'R003-B'], options: { showBeatGrid: true, showStartingFinger: true, reveal: true, revealLabel: 'Reveal note names and count guide' } },
      { type: 'practice', phase: 'try', instruction: 'Speak and tap Pattern A, then play it on C–D–E. Reset. Speak, tap, and play Pattern B, holding C for two beats before its silent beat.', hint: 'For Pattern A say “C, rest, D, E.” For Pattern B say “C—hold, rest, C.”' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you release before each rest and enter afterward without shortening the measure?', legacySelfCheck: true }
    ]
  },
  {
    id: 'rest-without-cursor', title: 'Keep the silent beat yourself', kicker: 'Independent repeat',
    intro: 'The count now comes from you rather than the moving guide.',
    blocks: [
      { type: 'notation', musicRefs: ['R003-A'], options: { showStartingFinger: true } },
      { type: 'practice', phase: 'try', instruction: 'Count four preparation beats, then play Pattern A without the cursor. Keep saying or thinking 2 during the rest.', hint: 'If the next note arrives early, clap beats 1 and 3 while saying all four counts.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Did one full silent beat fit between C and D?', legacySelfCheck: true }
    ]
  }
];

const session018Steps = [
  {
    id: 'pulse-versus-rhythm', title: 'Steady grid, changing pattern', kicker: 'Retrieve the difference',
    intro: 'Pulse is the steady grid; rhythm is the pattern of sounds and silences on it.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['The four beat cells stay evenly spaced. Quarter notes, half notes, and rests arrange different actions inside that steady space.', 'For every card use the same routine: <strong>Speak → Tap → Play</strong>. Switching hands does not change what a rhythm means.'] },
      { type: 'notation', musicRefs: ['R004-A'], options: { showLabels: true, showBeatGrid: true } },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you point to the steady pulse and the changing rhythm as two related ideas?', legacySelfCheck: true }
    ]
  },
  {
    id: 'right-left-review', title: 'Review with each hand', kicker: 'R004 A and B',
    intro: 'Keep the count-in consistent while the hand, pitches, and durations change.',
    blocks: [
      { type: 'notation', musicRefs: ['R004-A', 'R004-B'], options: { showStartingFinger: true, showBeatGrid: true, reveal: true, revealLabel: 'Reveal notes and counts' } },
      { type: 'practice', phase: 'try', instruction: 'Speak, tap, and play Card A with RH. Give a fresh four-count, then speak, tap, and play Card B with LH.', hint: 'Card A ends with a two-beat C. Card B begins with a two-beat C.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can both hands give the half note its full two beats?', legacySelfCheck: true }
    ]
  },
  {
    id: 'rest-and-middle-half', title: 'Mix the rest and half note', kicker: 'R004 C and D',
    intro: 'These cards move the longer sound and the silence to new places.',
    blocks: [
      { type: 'notation', musicRefs: ['R004-C', 'R004-D'], options: { showStartingFinger: true, showBeatGrid: true, reveal: true, revealLabel: 'Reveal notes and counts' } },
      { type: 'practice', phase: 'try', instruction: 'Speak, tap, and play Card C with its silent beat. Reset and play Card D, pressing D only once for its two-beat half note.', hint: 'Keep pointing through every beat cell. A rest is silent; a half note continues sounding.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Which needs another repetition: the rest, the half note, the hand, or the count-in?', legacySelfCheck: true }
    ]
  },
  {
    id: 'random-no-hint-rhythm', title: 'Choose one without hints', kicker: 'Mixed retrieval',
    intro: 'Pick A, B, C, or D before opening any count help.',
    blocks: [
      { type: 'notation', musicRefs: ['R004-A', 'R004-B', 'R004-C', 'R004-D'], options: { hiddenUntilReveal: true, revealLabel: 'Reveal the four review cards after choosing' } },
      { type: 'practice', phase: 'try', instruction: 'Name one card at random. Try its rhythm from memory or reopen its score without labels, then use the reveal only to check.', hint: 'Choose one element to repair rather than repeating all four cards.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you perform at least three cards with four complete beats and explain pulse versus rhythm?', legacySelfCheck: true }
    ]
  }
];

const session019Steps = [
  {
    id: 'meet-p-and-f', title: 'Meet soft and strong', kicker: 'p and f are relative',
    intro: 'Dynamics describe levels of sound, not a test of strength.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['The symbol <strong><em>p</em></strong> means soft. The symbol <strong><em>f</em></strong> means strong. They are relative musical choices: strong means fuller than soft in this moment.', '<strong>Strong never means stiff, harsh, or forced.</strong> A freely moving key can travel a little faster while shoulder, jaw, fingers, and wrist stay easy.'] },
      { type: 'dynamic-demo', musicRef: 'D001' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you explain p and f without calling f “hard”?', legacySelfCheck: true }
    ]
  },
  {
    id: 'identify-dynamics', title: 'Hear the contrast', kicker: 'Listen before moving',
    intro: 'The local recording gives a clear relative contrast at a comfortable volume.',
    blocks: [
      { type: 'audio-reference', title: 'D001 dynamic contrast', tracks: [{ assetRef: 'd001-soft-strong', label: 'Hear soft, reset, then strong' }], transcript: 'A four-count is followed by four soft C4 quarter notes, one silent reset beat, and four stronger C4 quarter notes. Strong is fuller, not struck.' },
      { type: 'practice', phase: 'try', instruction: 'Listen once. Point to p during the first group and f during the second. Replay once if useful.', hint: 'Listen for a clear level change, not for a different pitch or faster tempo.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you identify the soft and strong group by sound?', legacySelfCheck: true }
    ]
  },
  {
    id: 'play-dynamic-groups', title: 'Make two easy sound levels', kicker: 'Reset between groups',
    intro: 'One comfortable note is enough for this movement experiment.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'On C4, play four relaxed p quarter notes. Release your hand and reset. Then play four comfortably stronger f notes without raising the shoulder or locking the wrist. Alternate only once more.', hint: 'If your keyboard is not touch-sensitive, practice the free motion without demanding a volume change. Stop for pain, numbness, or persistent tension.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can the sound change while your shoulder, jaw, and wrist remain easy?', legacySelfCheck: true }
    ]
  },
  {
    id: 'dynamic-melody-transfer', title: 'Bring the contrast to a melody', kicker: 'M001 at p, then comfortable f',
    intro: 'Keep the notes and pulse the same while the relative sound level changes.',
    blocks: [
      { type: 'musical-pattern', musicRef: 'M001' },
      { type: 'practice', phase: 'try', instruction: 'Play M001 once at p. Fully reset, then play it at a comfortable f. Do not chase maximum loudness.', hint: 'If tension appears, stop the playing task and use listening only. Persistent discomfort deserves qualified guidance.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you make or identify two levels without strain or force?', legacySelfCheck: true }
    ]
  }
];

const session020Steps = [
  {
    id: 'read-metered-melody', title: 'Read the musical sentence', kicker: 'M001 in 4/4',
    intro: 'The familiar melody now has an exact two-measure rhythm on the treble staff.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['A <strong>phrase</strong> is a short musical thought. This one climbs toward G, its destination, then settles back to C.', 'Keep the written pulse and durations unchanged while the sound gently leads toward G and relaxes toward the ending.'] },
      { type: 'notation', musicRefs: ['M001-METERED'], options: { showStartingFinger: true, showBeatGrid: true, enlarge: true, caption: 'Lead gently toward G4 at the start of Measure 2, then settle back to C4. No new articulation or expression symbols are needed.' } },
      { type: 'practice', phase: 'try', instruction: 'Trace the notes, speak the counts, and tap the two-measure rhythm before playing.', hint: 'Measure 1 is quarter, quarter, half. Measure 2 has four quarter notes.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you identify G as the destination and C as the ending?', legacySelfCheck: true }
    ]
  },
  {
    id: 'hear-phrase-shape', title: 'Same notes, different shape', kicker: 'Even and gently directed',
    intro: 'Notation stays visible while two local recordings reveal the musical difference.',
    blocks: [
      { type: 'notation', musicRefs: ['M001-METERED'], options: { showStartingFinger: true } },
      { type: 'audio-reference', title: 'Compare the phrase', tracks: [{ assetRef: 'm001-even', label: 'Hear flat, even playing' }, { assetRef: 'm001-shaped', label: 'Hear a subtle destination and return' }], transcript: 'Both recordings use C4 quarter, D4 quarter, E4 half; then G4, E4, D4, C4 as quarter notes. The shaped version gently leads to G4 and settles on C4 without changing rhythm.' },
      { type: 'practice', phase: 'try', instruction: 'Play the phrase evenly once. Then play it again with a subtle lead toward G and a relaxed return to C.', hint: 'Do not add pauses or change note lengths. The shape can be small.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you hear and make a destination without changing the written rhythm?', legacySelfCheck: true }
    ]
  },
  {
    id: 'choose-an-answer', title: 'Choose a musical answer', kicker: 'C001 A or B',
    intro: 'Two short written choices make answering possible without improvisation expertise.',
    blocks: [
      { type: 'notation', musicRefs: ['C001-A', 'C001-B'], options: { showLabels: true, showBeatGrid: true, enlarge: true } },
      { type: 'audio-reference', title: 'Question and Answer A', tracks: [{ assetRef: 'c001-question-answer', label: 'Hear the written question and Answer A' }], transcript: 'The two-measure M001 question is followed by Answer A: E4 quarter, D4 quarter, C4 half.' },
      { type: 'practice', phase: 'try', instruction: 'Read and play Answer A, then Answer B. Choose one and play M001 followed by that answer.', hint: 'Both answers use two quarter notes and a half note and end on C4.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Which answer sounds more convincing to you, and where does it settle?', legacySelfCheck: true }
    ]
  },
  {
    id: 'return-to-written-model', title: 'Return to the written phrase', kicker: 'Separate choice from the model',
    intro: 'Finish by playing M001 exactly as written, with its destination and return.',
    blocks: [
      { type: 'notation', musicRefs: ['M001-METERED'], options: { showStartingFinger: true } },
      { type: 'practice', phase: 'try', instruction: 'Play M001 from the score with an audible destination at G4 and ending on C4. If you want a created answer, use any three C4–E4 notes in quarter, quarter, half rhythm and end on C4.', hint: 'Accuracy and steady rhythm come first. Keep the sound even if shaping makes the notes less secure.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you shape the phrase and perform one valid answer ending on C4?', legacySelfCheck: true }
    ]
  }
];

const session021Steps = [
  {
    id: 'preview-across-keys', title: 'Preview Across the Keys', kicker: 'Eight measures, two four-measure sections',
    intro: 'Read the plan before hearing a complete performance: one hand sounds at a time, with one within-measure change in Measure 7.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['Building a piece means solving small parts before asking for a full performance. Preview the score, tap its rhythm, prepare each hand, and isolate the hand change.', 'Measures 1–4 are soft (<em>p</em>). Measures 5–8 are strong (<em>f</em>), warm and never forced. No notes sound simultaneously.'] },
      { type: 'notation', musicRefs: ['P03'], options: { measureNumbers: true, showEntranceFingers: true, enlarge: true, caption: 'Measures 1–4 form the first section; Measures 5–8 form the second. RH and LH labels mark every approved entrance.' } },
      { type: 'practice', phase: 'try', instruction: 'Point to every RH and LH entrance, the quarter rest in Measure 7, and the p/f plan before playing.', hint: 'Entrances appear in Measures 1, 3, 5, 6, and twice in Measure 7.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you explain the hand order and where the two sections divide?', legacySelfCheck: true }
    ]
  },
  {
    id: 'tap-piece-rhythm', title: 'Count the two sections', kicker: 'Rhythm before pitch',
    intro: 'Tap Measures 1–4, reset, then tap Measures 5–8 while every sounding and silent beat keeps its place.',
    blocks: [
      { type: 'notation', musicRefs: ['P03'], options: { measureIndexes: [0, 1, 2, 3], sectionTitle: 'Across the Keys · Measures 1–4', measureNumbers: true, showEntranceFingers: true } },
      { type: 'notation', musicRefs: ['P03'], options: { measureIndexes: [4, 5, 6, 7], sectionTitle: 'Across the Keys · Measures 5–8', measureNumbers: true, showEntranceFingers: true } },
      { type: 'audio-reference', title: 'Rhythm and count at 52 bpm', tracks: [{ assetRef: 'p03-rhythm-count', label: 'Hear four-count plus every piece count' }], transcript: 'Four preparatory counts, then all eight measures at 52 bpm. Counts continue through held notes, inactive-hand waits, and the silent beat 2 in Measure 7.' },
      { type: 'practice', phase: 'try', instruction: 'Tap the first section while counting all beats. Reset, then tap the second. Say “rest” on Measure 7 beat 2 without stopping the pulse.', hint: 'Keep the temporary Measure 7 cue: left, rest, right, right.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can both sections keep four beats in every measure?', legacySelfCheck: true }
    ]
  },
  {
    id: 'prepare-each-hand', title: 'Prepare RH, then LH', kicker: 'Hands separately within the piece',
    intro: 'Practice only the measures assigned to one hand before reconnecting the conversation.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'Play RH Measures 1–2 and 5. Then play RH beats 3–4 of Measure 7 through Measure 8. Reset and play LH Measures 3–4 and 6, then only beat 1 of Measure 7.', hint: 'Use the visible entrance fingers. The waiting hand stays easy near its keys and never joins.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can each hand find all of its notes without the other hand sounding?', legacySelfCheck: true }
    ]
  },
  {
    id: 'isolate-six-seven', title: 'Isolate Measures 6–7', kicker: 'The chapter’s key hand change',
    intro: 'Move slowly enough that the rest and the new right-hand entrance remain separate events.',
    blocks: [
      { type: 'notation', musicRefs: ['P03'], options: { measureIndexes: [5, 6], sectionTitle: 'Across the Keys · Measures 6–7', measureNumbers: true, showEntranceFingers: true, enlarge: true, caption: 'Measure 6: LH C–E–G. Measure 7: LH C on beat 1, silence on beat 2, RH C and D on beats 3 and 4.' } },
      { type: 'hand-lanes', musicRef: 'P03', measureIndexes: [5, 6], animated: true, bpm: 50 },
      { type: 'practice', phase: 'try', instruction: 'Loop Measures 6–7 three calm times around 48–52 bpm. Say “left, hold; left, rest; right, right.” Stop and simplify if tension appears.', hint: 'Remove pitch first: tap the hand labels. Then play only C3 on Measure 7 beat 1 and C4/D4 on beats 3/4.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can beat 2 remain silent while the right hand prepares for beat 3?', legacySelfCheck: true }
    ]
  },
  {
    id: 'connect-piece-sections', title: 'Connect each four-measure section', kicker: 'No full run required',
    intro: 'Complete the first section, reset, then complete the second and name one specific place to revisit.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'Count four and play Measures 1–4 at p. Reset. Count four and play Measures 5–8 at a comfortable f. Add contrast only if the hand changes and durations remain dependable.', hint: 'Practice starting from Measure 5 and from Measure 7 so the piece does not depend on always starting at the beginning.' },
      { type: 'audio-reference', title: 'Separate phrase references at 52 bpm', collapsed: true, summary: 'Hear after preparing both sections', tracks: [{ assetRef: 'p03-sections', label: 'Hear Measures 1–4, reset, then 5–8' }], transcript: 'A four-count and Measures 1–4 are followed by a short reset, another four-count, and Measures 5–8. The second section includes the Measure 7 LH-to-RH change.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Which measure is ready, practicing, or stuck, and why?', legacySelfCheck: true }
    ]
  }
];

const session022Steps = [
  {
    id: 'performance-preview', title: 'Prepare a complete attempt', kicker: 'Score first, reference by choice',
    intro: 'Set up silently, preview the complete score, and choose a comfortable pulse before listening or playing.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['A performance attempt keeps the musical thread from beginning to end. If a small error happens, continue when you can.', 'The goal is recognizable continuity, hand order, and an intentional p/f contrast—not flawless playing.'] },
      { type: 'notation', musicRefs: ['P03'], options: { measureNumbers: true, showEntranceFingers: true, enlarge: true } },
      { type: 'audio-reference', title: 'Reference performance at 62 bpm', collapsed: true, summary: 'Hear after previewing the notation—before or after my first run', tracks: [{ assetRef: 'p03-performance', label: 'Hear the complete reference performance' }], transcript: 'Four-count, then all eight measures. Measures 1–4 are soft; Measures 5–8 are stronger but unforced. Measure 7 changes from LH on beat 1 to RH on beats 3 and 4 after a silent beat 2.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you point to the first notes, hand changes, rest, and dynamic plan before starting?', legacySelfCheck: true }
    ]
  },
  {
    id: 'first-complete-run', title: 'Play from beginning to end', kicker: 'Keep the musical thread',
    intro: 'One complete attempt gives useful information that isolated practice cannot.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'Check bench and keyboard stability, prepare both five-note positions, count four, and perform all eight measures. Continue through a small error when possible.', hint: 'Choose 52–56 bpm if the hand change needs space. The performance range is guidance, not a gate.' },
      { type: 'reflection', phase: 'reflect', prompt: 'What happened with continuity, comfort, pulse, notes/rhythm, and the p/f plan?', legacySelfCheck: true }
    ]
  },
  {
    id: 'one-targeted-repair', title: 'Repair exactly one place', kicker: 'Specific beats beat general judgment',
    intro: 'Choose one measure, transition, rhythm, or sound level rather than judging the whole run.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'Name one precise target. Work on it for no more than two minutes: twice alone, then once with one neighboring measure.', hint: 'If Measure 7 is the target, return to “LH, rest, RH, RH.” If the whole piece felt crowded, repair only one four-measure section.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Did the chosen place become clearer, easier, or more dependable?', legacySelfCheck: true }
    ]
  },
  {
    id: 'second-complete-run', title: 'Try the complete piece again', kicker: 'Accept small errors and preserve the ending',
    intro: 'Carry the one repair back into the full musical context.',
    blocks: [
      { type: 'notation', musicRefs: ['P03'], options: { measureNumbers: true, showEntranceFingers: true, enlarge: true } },
      { type: 'practice', phase: 'try', instruction: 'Count four and perform once more. Keep moving toward the final C even if one detail is imperfect, and stop if discomfort appears.', hint: 'A partial piece can remain completed-in-progress. Return to Session 021’s sections without losing history.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you finish with recognizable hand order, ending, and intentional soft/strong contrast?', legacySelfCheck: true }
    ]
  }
];

const session023Steps = [
  {
    id: 'challenge-format', title: 'Try first, reveal second', kicker: 'A memory check, not an exam',
    intro: 'Each card offers optional help after your attempt. A missed item identifies useful practice; it does not erase progress.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['There is no timer, grade, score, or mastery gate. Choose accuracy, pulse, and comfort over speed.', 'Find C4 and prepare the RH C4–G4 and LH C3–G3 positions before opening the hint.'] },
      { type: 'practice', phase: 'try', instruction: 'Without a diagram, find C4 and both five-note positions. Then identify written C4/G4 and C3/F3 from mixed landmark cards.', hint: 'C sits immediately left of a two-black-key group. Reopen Sessions 008 and 013 only after the first attempt.' },
      { type: 'notation', musicRefs: ['N002-B', 'N004-B'], options: { reveal: true, revealLabel: 'Reveal landmark note names after my attempt', revealLabels: true } },
      { type: 'reflection', phase: 'reflect', prompt: 'Which keyboard or staff landmark needed a hint?', legacySelfCheck: true }
    ]
  },
  {
    id: 'rhythm-reading-challenges', title: 'Retrieve rhythm and reading', kicker: 'R003 C, N003 D, N005 D',
    intro: 'Preview each score silently, attempt it, and open its reading help only afterward.',
    blocks: [
      { type: 'notation', musicRefs: ['R003-C'], options: { showStartingFinger: true, reveal: true, revealLabel: 'Reveal R003 C notes and counts after my attempt', showBeatGrid: true } },
      { type: 'practice', phase: 'try', instruction: 'Speak, tap, and play R003 C, including its silent beat 3.', hint: 'Count 1 D? Check only after trying: the score begins on C3 and the rest is beat 3.' },
      { type: 'notation', musicRefs: ['N003-D', 'N005-D'], options: { showStartingFinger: true, reveal: true, revealLabel: 'Reveal note names after both first attempts', revealDirections: true } },
      { type: 'practice', phase: 'try', instruction: 'After a silent preview, sight-read treble Challenge D and bass Challenge D with separate four-counts.', hint: 'Find the first staff note and follow contour before naming every letter.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Which was least secure: the rest, treble steps, or bass steps?', legacySelfCheck: true }
    ]
  },
  {
    id: 'listening-challenge', title: 'Compare the left-hand patterns', kicker: 'E001 Pair D',
    intro: 'Listen before revealing notes or direction.',
    blocks: [
      { type: 'audio-listening', musicRef: 'E001', pairIds: ['D'] },
      { type: 'practice', phase: 'try', instruction: 'Choose Same or Different after one or two listens. Reveal only after choosing, then play both patterns with LH.', hint: 'Listen for whether the middle and final directions match.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you hear the changed order and reconnect it to the physical keys?', legacySelfCheck: true }
    ]
  },
  {
    id: 'melody-piece-challenge', title: 'Retrieve the melody and piece excerpt', kicker: 'M001 and P03 Measures 5–8',
    intro: 'Recall the first melody before opening its score, then read the final-piece excerpt directly.',
    blocks: [
      { type: 'practice', phase: 'try', instruction: 'Play M001 from memory. Only after the attempt, open its metered score below.', hint: 'The pitch sequence begins C–D–E and reaches G before returning to C.' },
      { type: 'notation', musicRefs: ['M001-METERED'], options: { hiddenUntilReveal: true, revealLabel: 'Reveal M001 after my memory attempt', showStartingFinger: true } },
      { type: 'notation', musicRefs: ['P03'], options: { measureIndexes: [4, 5, 6, 7], sectionTitle: 'Across the Keys · challenge excerpt', measureNumbers: true, showEntranceFingers: true, enlarge: true } },
      { type: 'practice', phase: 'try', instruction: 'Play Measures 5–8 from the score, or choose the full piece if desired. Keep f comfortable and preserve the Measure 7 silence.', hint: 'Use Session 021’s section support only after this first attempt.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Name one understanding target and one physical playing target for later reinforcement.', legacySelfCheck: true }
    ]
  }
];

const session024Steps = [
  {
    id: 'milestone-setup-patterns', title: 'Find landmarks and play both patterns', kicker: 'Part 1 of 6',
    intro: 'Begin independently at a comfortable pace; help remains optional after the first attempt.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['This milestone asks, “What can I do now?” It is not a perfect-performance test.', 'You may complete the chapter and still name one skill to revisit. No percentage, streak, calendar rule, or forced threshold controls completion.'] },
      { type: 'practice', phase: 'try', instruction: 'Find C4 from the black-key landmark. Prepare RH and play K001, then prepare LH and play K002 with an approximately steady pulse.', hint: 'If needed after trying, find C beside two black keys and reopen the finger diagrams from Sessions 001 and 011.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you find the positions and keep each five-note walk moving comfortably?', legacySelfCheck: true }
    ]
  },
  {
    id: 'milestone-reading', title: 'Read treble and bass', kicker: 'Parts 2 and 3 of 6',
    intro: 'Identify the landmarks, then read one short line in each clef.',
    blocks: [
      { type: 'notation', musicRefs: ['N002-A', 'N004-A', 'N003-D', 'N005-D'], options: { showStartingFinger: true, reveal: true, revealLabel: 'Reveal note names after my first attempts' } },
      { type: 'practice', phase: 'try', instruction: 'Identify C4/G4 and C3/F3. Then give separate four-counts and play the short treble and bass reading lines.', hint: 'Use the landmark plus repeat/up/down movement; do not label every note in advance.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Which clef can you read with less help, and which one deserves a later revisit?', legacySelfCheck: true }
    ]
  },
  {
    id: 'milestone-rhythm', title: 'Count and play a mixed rhythm', kicker: 'Part 4 of 6',
    intro: 'This two-measure card includes quarters, a half note, and a quarter rest.',
    blocks: [
      { type: 'notation', musicRefs: ['R004-E'], options: { showStartingFinger: true, showBeatGrid: true, reveal: true, revealLabel: 'Reveal note names and count guide after my attempt' } },
      { type: 'practice', phase: 'try', instruction: 'Speak and tap both measures, then play them after a four-count. Keep the rest silent without resetting the pulse.', hint: 'Measure 2 is C half, rest on beat 3, C on beat 4.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you distinguish continuing sound, silence, and a new note inside the pulse?', legacySelfCheck: true }
    ]
  },
  {
    id: 'milestone-listening', title: 'Respond to a short listening task', kicker: 'Part 5 of 6',
    intro: 'Use one replay if useful, then reconnect the heard contour to the keyboard.',
    blocks: [
      { type: 'audio-listening', musicRef: 'E001', pairIds: ['D'] },
      { type: 'practice', phase: 'try', instruction: 'Choose Same or Different, reveal after choosing, and reproduce either three-note group with LH.', hint: 'Listen for the order of C3, D3, and E3 rather than trying to name the notes during playback.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you respond by ear and then connect the result to keys or contour?', legacySelfCheck: true }
    ]
  },
  {
    id: 'milestone-performance', title: 'Perform Across the Keys', kicker: 'Part 6 of 6',
    intro: 'Use the full score, one silent preview, and the intentional p/f plan.',
    blocks: [
      { type: 'notation', musicRefs: ['P03'], options: { measureNumbers: true, showEntranceFingers: true, enlarge: true } },
      { type: 'audio-reference', title: 'Optional reference replay', collapsed: true, summary: 'Replay only if useful after previewing the score', tracks: [{ assetRef: 'p03-performance', label: 'Hear Across the Keys at 62 bpm' }], transcript: 'Four-count and the complete eight-measure piece with soft Measures 1–4, stronger Measures 5–8, and no simultaneous notes.' },
      { type: 'practice', phase: 'try', instruction: 'Prepare, count four, and perform the piece with intentional contrast. Continue through small errors when comfortable.', hint: 'If the full piece is not ready, perform one four-measure section and name the exact skill to revisit. You can still complete the chapter.' },
      { type: 'reflection', phase: 'reflect', prompt: 'What musical behavior can you demonstrate now, and what one skill will you revisit?', legacySelfCheck: true }
    ]
  },
  {
    id: 'milestone-reflection', title: 'Choose the next useful focus', kicker: 'Understanding, playing, and readiness stay separate',
    intro: 'Finish with evidence rather than a grade.',
    blocks: [
      { type: 'text', phase: 'explain', paragraphs: ['Name one idea you can explain without help and one musical behavior you can demonstrate consistently.', 'Choose Ready, Practicing, or Stuck separately from chapter completion. Completing Chapter 01 never removes your option to revisit a specific skill.'] },
      { type: 'practice', phase: 'try', instruction: 'Choose exactly one revisit target: landmarks, RH/LH patterns, treble/bass reading, mixed rhythm, listening, or expressive piece performance.', hint: 'Choose the earliest missing prerequisite if several tasks felt uncertain.' },
      { type: 'reflection', phase: 'reflect', prompt: 'Can you finish the milestone while naming a specific, kind, useful next step?', legacySelfCheck: true }
    ]
  }
];

const sliceESessions = () => [
  {
    id: '021', title: 'Build the Chapter Piece', summary: 'Prepare Across the Keys in sections and isolate its Measure 6–7 hand change.', type: 'Practice', chapter: 1,
    objective: 'Prepare P03 in two four-measure sections and improve the Measure 6–7 transition.', prerequisites: ['017', '018', '019', '020'], duration: { min: 10, max: 15 }, steps: session021Steps,
    musicRefs: ['P03'], assetRefs: ['p03-rhythm-count', 'p03-sections'], outcome: 'Plays both four-measure sections separately and improves a specifically identified transition.',
    reflection: { understanding: 'I can explain why isolating a difficult place helps.', playing: 'I can name which measure is ready, practicing, or stuck.' }, keepPlaying: ['Practice starting from Measure 5.', 'Practice starting from Measure 7 so the piece does not depend on its beginning.'],
    readiness: { ready: { label: 'Ready', guidance: 'Continue when you choose after both sections have had a calm attempt.' }, practicing: { label: 'Practicing', guidance: 'Repeat only the named measure plus one neighbor.', reinforcementRefs: ['RF-FINAL-1'] }, stuck: { label: 'Stuck', guidance: 'Remove pitch and tap Measures 6–7 with hand labels.', reinforcementRefs: ['RF-FINAL-1'], earlierSessionId: '017' } },
    reinforcementRefs: ['RF-RHY-3', 'RF-HANDS-1', 'RF-REST-1', 'RF-DYN-1', 'RF-PHRASE-1', 'RF-FINAL-1'], pedagogicalReview: ['P03 engraving, fingerings, dynamics, target tempos, section plan, and Measure 6–7 transition require qualified piano-teacher review.']
  },
  {
    id: '022', title: 'Play the Complete Piece', summary: 'Perform Across the Keys, repair one target, and try the complete piece again.', type: 'Play', chapter: 1,
    objective: 'Perform all eight P03 measures with continuity and an intentional dynamic plan.', prerequisites: ['021'], duration: { min: 10, max: 15 }, steps: session022Steps,
    musicRefs: ['P03'], assetRefs: ['p03-performance'], outcome: 'Completes P03 with recognizable beginning, ending, hand sequence, and intended soft/strong contrast.',
    reflection: { understanding: 'I can name one useful repair without judging the whole performance.', playing: 'I can continue through a small error and finish comfortably.' }, keepPlaying: ['Give the piece a title of your own.', 'Perform once for a trusted listener or private recording only if desired.'],
    readiness: { ready: { label: 'Ready', guidance: 'Finish here or enjoy one more performance later.' }, practicing: { label: 'Practicing', guidance: 'Repair exactly one selected place, then repeat it once in context.', reinforcementRefs: ['RF-FINAL-2'] }, stuck: { label: 'Stuck', guidance: 'Return to one four-measure section without losing completion history.', reinforcementRefs: ['RF-FINAL-1'], earlierSessionId: '021' } },
    reinforcementRefs: ['RF-FINAL-1', 'RF-FINAL-2'], pedagogicalReview: ['P03 reference performance, continuity guidance, and expressive expectations require qualified piano-teacher review.']
  },
  {
    id: '023', title: 'No-Hints Challenge', summary: 'Retrieve Chapter 01 foundations before revealing optional help.', type: 'Review', chapter: 1,
    objective: 'Retrieve landmarks, rhythm, reading, listening, M001, and a P03 excerpt before prompts appear.', prerequisites: ['022'], duration: { min: 10, max: 15 }, steps: session023Steps,
    musicRefs: ['E001', 'N002-B', 'N004-B', 'R003-C', 'N003-D', 'N005-D', 'M001-METERED', 'P03'], assetRefs: ['e001-pair-d'], outcome: 'Demonstrates retained foundations and names one specific reinforcement target with evidence.',
    reflection: { understanding: 'I can name the least secure idea without turning it into a grade.', playing: 'I can name the least secure physical task and its short repair.' }, keepPlaying: ['Shuffle the challenge order and try again later.', 'Play P01 and P02 as a mini-review.'],
    readiness: { ready: { label: 'Ready', guidance: 'Continue when you choose; hints used are information, not failure.' }, practicing: { label: 'Practicing', guidance: 'Use the linked support for one selected skill, not the whole challenge again.', reinforcementRefs: ['RF-FINAL-2'] }, stuck: { label: 'Stuck', guidance: 'Reveal answers and revisit the earliest missing prerequisite.', reinforcementRefs: ['RF-READ-1'], earlierSessionId: '007' } },
    reinforcementRefs: ['RF-KG-1', 'RF-READ-2', 'RF-BASS-1', 'RF-REST-1', 'RF-TREBLE-1', 'RF-BASS-2', 'RF-EAR-1', 'RF-PHRASE-1', 'RF-FINAL-2'], pedagogicalReview: ['Challenge difficulty, reveal timing, and selected P03 excerpt require qualified piano-teacher and accessibility review.']
  },
  {
    id: '024', title: 'Chapter 01 Milestone', summary: 'Integrate keyboard, reading, rhythm, listening, and expressive performance without a grade.', type: 'Play', chapter: 1,
    objective: 'Demonstrate integrated Chapter 01 musicianship and make an evidence-based next-step choice.', prerequisites: ['001'], duration: { min: 14, max: 14 }, steps: session024Steps,
    musicRefs: ['K001', 'K002', 'E001', 'N002-A', 'N004-A', 'N003-D', 'N005-D', 'R004-E', 'P03'], assetRefs: ['e001-pair-d', 'p03-performance'], outcome: 'Demonstrates the integrated milestone or identifies one specific reinforcement next step for an unfinished behavior.',
    reflection: { understanding: 'I can name an idea I explain without help.', playing: 'I can name a musical behavior I demonstrate consistently.' }, keepPlaying: ['Perform P01, P02, and P03 as a three-piece mini-recital, pausing to reset between pieces.'],
    readiness: { ready: { label: 'Ready', guidance: 'Complete Chapter 01 and continue when you choose.' }, practicing: { label: 'Practicing', guidance: 'Complete the chapter while choosing one skill for a later revisit.', reinforcementRefs: ['RF-FINAL-2'] }, stuck: { label: 'Stuck', guidance: 'Complete the chapter if you choose and revisit the earliest missing prerequisite.', reinforcementRefs: ['RF-READ-1'], earlierSessionId: '007' } },
    reinforcementRefs: ['RF-KG-1', 'RF-RH-1', 'RF-LH-1', 'RF-READ-2', 'RF-BASS-1', 'RF-RHY-3', 'RF-EAR-1', 'RF-FINAL-2'], pedagogicalReview: ['The integrated milestone, approximately 14-minute pacing, accessibility, and all performance expectations require qualified piano-teacher and accessibility review.']
  }
];

const sliceDSessions = () => [
  {
    id: '017', title: 'A Beat of Silence', summary: 'Count a quarter rest as one silent beat while the pulse continues.', type: 'Learn', chapter: 1,
    objective: 'Count and perform a quarter rest as one beat of intentional silence.', prerequisites: ['003', '005'], duration: { min: 10, max: 15 }, steps: session017Steps,
    musicRefs: ['R003', 'R003-A', 'R003-B'], assetRefs: [], outcome: 'Leaves one full silent beat and enters the following note without losing the measure.',
    reflection: { understanding: 'I can explain why silence still receives a count.', playing: 'I can release before the rest and enter afterward.' }, keepPlaying: ['Insert one quarter rest into M001’s pitches, choose its exact beat, and repeat the result consistently.'],
    readiness: { ready: { label: 'Ready', guidance: 'Continue when you choose, or repeat Pattern A once without the guide.' }, practicing: { label: 'Practicing', guidance: 'Repeat C4, rest, C4, rest on four counted beats.', reinforcementRefs: ['RF-REST-1'] }, stuck: { label: 'Stuck', guidance: 'Clap only beats 1 and 3 while saying all four numbers.', reinforcementRefs: ['RF-REST-1'], earlierSessionId: '003' } },
    reinforcementRefs: ['RF-PULSE-1', 'RF-REST-1'], pedagogicalReview: ['Quarter-rest engraving, silent-beat pacing, and release guidance require qualified piano-teacher review.']
  },
  {
    id: '018', title: 'Mix the First Rhythms', summary: 'Retrieve quarter notes, half notes, rests, and count-ins with both hands.', type: 'Review', chapter: 1,
    objective: 'Retrieve the first note values and quarter rest in varied right- and left-hand contexts.', prerequisites: ['005', '006', '014', '017'], duration: { min: 10, max: 15 }, steps: session018Steps,
    musicRefs: ['R004', 'R004-A', 'R004-B', 'R004-C', 'R004-D', 'R004-E'], assetRefs: [], outcome: 'Performs at least three mixed cards with correct four-beat totals and explains pulse versus rhythm.',
    reflection: { understanding: 'I can tell the steady pulse from a changing rhythm.', playing: 'I can identify the value, rest, hand, or count-in that needs another repeat.' }, keepPlaying: ['Try optional R004 E.', 'Create a two-measure rhythm for the other hand to answer one octave away.'],
    keepPlayingBlocks: [{ type: 'notation', musicRefs: ['R004-E'], options: { showBeatGrid: true, showStartingFinger: true } }],
    readiness: { ready: { label: 'Ready', guidance: 'Continue when you choose, or replay one mixed card.' }, practicing: { label: 'Practicing', guidance: 'Repair only the quarter, half, rest, or count-in that was least secure.', reinforcementRefs: ['RF-RHY-3'] }, stuck: { label: 'Stuck', guidance: 'Return to four pulse boxes and replace only one event.', reinforcementRefs: ['RF-RHY-3'], earlierSessionId: '005' } },
    reinforcementRefs: ['RF-RHY-1', 'RF-REST-1', 'RF-RHY-3'], pedagogicalReview: ['Mixed-rhythm sequence, hand assignments, and count-in pacing require qualified piano-teacher review.']
  },
  {
    id: '019', title: 'Soft and Strong, Never Forced', summary: 'Hear and make a relative dynamic contrast with relaxed, safe movement.', type: 'Learn', chapter: 1,
    objective: 'Produce or identify p and f as distinct relative dynamics while retaining physical ease.', prerequisites: ['001', '005'], duration: { min: 10, max: 15 }, steps: session019Steps,
    musicRefs: ['D001', 'M001'], assetRefs: ['d001-soft-strong'], outcome: 'Produces or correctly identifies two sound levels without visible strain or discomfort.',
    reflection: { understanding: 'I can explain p and f without treating loudness as strength.', playing: 'I can change the sound while my body stays easy.' }, keepPlaying: ['Choose soft or strong for M001, play it, and explain why the choice suits the melody.'],
    readiness: { ready: { label: 'Ready', guidance: 'Continue when you choose; one clear, comfortable contrast is enough.' }, practicing: { label: 'Practicing', guidance: 'Use one note and reset fully between the soft and strong groups.', reinforcementRefs: ['RF-DYN-1'] }, stuck: { label: 'Stuck', guidance: 'Use listening only. Stop rather than repeat an uncomfortable movement.', reinforcementRefs: ['RF-DYN-1'], earlierSessionId: '001' } },
    reinforcementRefs: ['RF-DYN-1'], pedagogicalReview: ['Dynamic-production wording, motion schematic, audio contrast, and safety guidance require qualified piano-teacher and accessibility review.']
  },
  {
    id: '020', title: 'Make a Musical Sentence', summary: 'Shape M001 toward its destination and choose a constrained musical answer.', type: 'Learn', chapter: 1,
    objective: 'Shape a written phrase toward G4 and back to C4, then choose a valid three-note answer.', prerequisites: ['009', '019'], duration: { min: 10, max: 15 }, steps: session020Steps,
    musicRefs: ['M001-METERED', 'C001', 'C001-A', 'C001-B'], assetRefs: ['m001-even', 'm001-shaped', 'c001-question-answer'], outcome: 'Plays M001 with an audible destination and ending and performs one answer ending on C4.',
    reflection: { understanding: 'I can identify the phrase’s destination and ending.', playing: 'I can shape the phrase without changing its written rhythm.' }, keepPlaying: ['Try the other answer and explain which sounds more convincing in everyday language.'],
    readiness: { ready: { label: 'Ready', guidance: 'Continue when you choose, or play your preferred question-and-answer once.' }, practicing: { label: 'Practicing', guidance: 'Play M001 evenly, then gently shaped, without changing rhythm.', reinforcementRefs: ['RF-PHRASE-1'] }, stuck: { label: 'Stuck', guidance: 'Keep dynamics even and complete M001 accurately before adding shape.', reinforcementRefs: ['RF-PHRASE-1'], earlierSessionId: '019' } },
    reinforcementRefs: ['RF-DYN-1', 'RF-PHRASE-1'], pedagogicalReview: ['Metered M001, phrase-shape recordings, constrained answers, and expressive wording require qualified piano-teacher review.']
  }
];

const sliceCSessions = () => [
  {
    id: '011', title: 'Meet the Left Hand', summary: 'Find the lower C and establish a comfortable left-hand five-note position.', type: 'Learn', chapter: 1,
    objective: 'Find C3, understand left-hand finger numbers, and play K002 without forced stretching.', prerequisites: ['001'], duration: { min: 10, max: 15 }, steps: session011Steps,
    musicRefs: ['K002'], assetRefs: ['keyboard-c3-c5', 'left-hand-fingers'], outcome: 'Finds C3, names left-hand fingers, and plays K002 with a comfortable, mobile wrist.',
    reflection: { understanding: 'I know why the left little finger is 5.', playing: 'I can place and move the left hand without pain or held tension.' },
    keepPlaying: ['Play K002 softly and listen for an even, unforced tone.'],
    readiness: { ready: { label: 'Ready', guidance: 'Continue when you choose, or enjoy one soft K002 repeat.' }, practicing: { label: 'Practicing', guidance: 'Play only C3–D3–E3 and back with fingers 5–4–3.', reinforcementRefs: ['RF-LH-1'] }, stuck: { label: 'Stuck', guidance: 'Locate C3 and play it four relaxed times with finger 5.', reinforcementRefs: ['RF-LH-1'], earlierSessionId: '001' } },
    reinforcementRefs: ['RF-LH-1'], pedagogicalReview: ['Session 011 left-hand placement, wrist guidance, and fingering require qualified piano-teacher review.']
  },
  {
    id: '012', title: 'Left-Hand Steps and Echoes', summary: 'Keep a pulse with the left hand and reproduce three-note heard contours.', type: 'Practice', chapter: 1,
    objective: 'Play left-hand step patterns evenly and reproduce E002 pitch echoes.', prerequisites: ['003', '011'], duration: { min: 10, max: 15 }, steps: session012Steps,
    musicRefs: ['K002', 'E002'], assetRefs: ['keyboard-c3-c5', 'e002-a', 'e002-b', 'e002-c'], outcome: 'Plays two left-hand patterns evenly and reproduces at least one three-note echo.',
    reflection: { understanding: 'I can connect heard up/down movement to the keyboard.', playing: 'My left hand can keep an easy shape and clear releases.' },
    keepPlaying: ['Hear a C4–E4 right-hand pattern and copy its shape one octave lower with the left hand.'],
    readiness: { ready: { label: 'Ready', guidance: 'Continue when you choose, or copy one more echo.' }, practicing: { label: 'Practicing', guidance: 'Repeat E002 A with visible arrows, then hide them.', reinforcementRefs: ['RF-LH-2'] }, stuck: { label: 'Stuck', guidance: 'Alternate only C3 and D3, or revisit left-hand placement.', reinforcementRefs: ['RF-LH-1', 'RF-LH-2'], earlierSessionId: '011' } },
    reinforcementRefs: ['RF-LH-1', 'RF-LH-2'], pedagogicalReview: ['Session 012 echo recordings, left-hand releases, and pacing require qualified piano-teacher review.']
  },
  {
    id: '013', title: 'Bass C and Bass F', summary: 'Recognize C3 and F3 as bass-clef landmarks and connect them to the left hand.', type: 'Learn', chapter: 1,
    objective: 'Recognize written C3 and F3 and play them with left-hand fingers 5 and 2.', prerequisites: ['007', '011'], duration: { min: 10, max: 15 }, steps: session013Steps,
    musicRefs: ['N004', 'N004-A', 'N004-B'], assetRefs: ['keyboard-c3-c5'], outcome: 'Matches written C3 and F3 to the correct key and finger without a letter mnemonic.',
    reflection: { understanding: 'I can describe both bass-clef landmarks.', playing: 'I can play them without moving out of the five-note position.' }, keepPlaying: ['Find C3 and F3 in two new short written repeat patterns.'],
    readiness: { ready: { label: 'Ready', guidance: 'Continue when you choose, or identify both landmarks once more.' }, practicing: { label: 'Practicing', guidance: 'Shuffle four C3/F3 cards and answer without a time limit.', reinforcementRefs: ['RF-BASS-1'] }, stuck: { label: 'Stuck', guidance: 'Learn written C3 alone, then add F3.', reinforcementRefs: ['RF-BASS-1'], earlierSessionId: '011' } },
    reinforcementRefs: ['RF-LH-1', 'RF-READ-1', 'RF-BASS-1'], pedagogicalReview: ['Session 013 bass-clef symbol, staff placement, and landmark teaching require qualified piano-teacher review.']
  },
  {
    id: '014', title: 'Read C, D, E with the Left Hand', summary: 'Read short bass-clef patterns from the C3 landmark.', type: 'Practice', chapter: 1,
    objective: 'Read and play stepwise C3–D3–E3 patterns while keeping a comfortable left-hand position.', prerequisites: ['005', '013'], duration: { min: 10, max: 15 }, steps: session014Steps,
    musicRefs: ['N005', 'N005-A', 'N005-B', 'N005-C', 'N005-D'], assetRefs: [], outcome: 'Reads a new four-note C3–E3 card without written letter names and maintains the hand position.',
    reflection: { understanding: 'I can use bass C plus steps to find D and E.', playing: 'I can read without tightening or looking back and forth for every note.' }, keepPlaying: ['Read a short F3-starting step pattern using contour only, then reveal its letters.'],
    readiness: { ready: { label: 'Ready', guidance: 'Continue when you choose, or try one more no-label bass card.' }, practicing: { label: 'Practicing', guidance: 'Alternate Cards A and B with a silent preview.', reinforcementRefs: ['RF-BASS-2'] }, stuck: { label: 'Stuck', guidance: 'Read C3 and D3 only, or revisit the bass C landmark.', reinforcementRefs: ['RF-BASS-1', 'RF-BASS-2'], earlierSessionId: '013' } },
    reinforcementRefs: ['RF-LH-2', 'RF-BASS-1', 'RF-BASS-2'], pedagogicalReview: ['Session 014 bass reading sequence, fingering cues, and gaze guidance require qualified piano-teacher review.']
  },
  {
    id: '015', title: 'Hands Take Turns', summary: 'Keep one pulse while the left and right hands alternate one note at a time.', type: 'Learn', chapter: 1,
    objective: 'Change active hands on a continuing pulse without simultaneous notes or an added pause.', prerequisites: ['003', '009', '014'], duration: { min: 10, max: 15 }, steps: session015Steps,
    musicRefs: ['H001'], assetRefs: ['keyboard-c3-c5'], outcome: 'Changes hands on the intended beats without inserting an extra beat or lifting the shoulders.',
    reflection: { understanding: 'I know which hand owns each beat.', playing: 'The waiting hand can stay prepared and easy while the count continues.' }, keepPlaying: ['Repeat H001 and say “left, right” instead of count numbers, then return to counting.'],
    readiness: { ready: { label: 'Ready', guidance: 'Continue when you choose, or repeat the two measures once.' }, practicing: { label: 'Practicing', guidance: 'Repeat only H001 Measure 1 three times.', reinforcementRefs: ['RF-HANDS-1'] }, stuck: { label: 'Stuck', guidance: 'Alternate hands on the legs, then on C3 and C4 only.', reinforcementRefs: ['RF-HANDS-1'], earlierSessionId: '014' } },
    reinforcementRefs: ['RF-PULSE-1', 'RF-LH-1', 'RF-HANDS-1'], pedagogicalReview: ['Session 015 hand preparation, alternating movement, and target pulse require qualified piano-teacher review.']
  },
  {
    id: '016', title: 'A Two-Hand Conversation', summary: 'Read and play Hello, Down There with the hands alternating by measure.', type: 'Play', chapter: 1,
    objective: 'Perform P02 as a complete paired-staff question-and-answer piece with one active hand per measure.', prerequisites: ['005', '009', '014', '015'], duration: { min: 10, max: 15 }, steps: session016Steps,
    musicRefs: ['P02'], assetRefs: ['p02-practice', 'p02-musical'], outcome: 'Performs all four measures with clear hand changes and an approximately steady pulse.',
    reflection: { understanding: 'I can follow top/right and bottom/left staves.', playing: 'I can change hands by measure while the count continues.' }, keepPlaying: ['Replace Measure 4 with one C3–E3 answer choice, then return to the written score.'],
    readiness: { ready: { label: 'Ready', guidance: 'Finish here or enjoy one more complete conversation.' }, practicing: { label: 'Practicing', guidance: 'Loop one question-and-answer pair, then connect the second pair.', reinforcementRefs: ['RF-HANDS-2'] }, stuck: { label: 'Stuck', guidance: 'Play Measure 1, count four silent beats, then play Measure 2.', reinforcementRefs: ['RF-HANDS-1', 'RF-HANDS-2'], earlierSessionId: '015' } },
    reinforcementRefs: ['RF-RHY-1', 'RF-BASS-1', 'RF-BASS-2', 'RF-HANDS-1', 'RF-HANDS-2'], pedagogicalReview: ['Hello, Down There notation, full-measure-rest explanation, hand changes, audio models, and tempos require qualified piano-teacher review.']
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
  },
  {
    id: '002', title: 'Find and Hear It Again', summary: 'Retrieve the keyboard landmarks and compare short patterns by ear.',
    type: 'Review', chapter: 1,
    objective: 'Retrieve Session 001 landmarks and distinguish tiny pitch patterns that are the same or different.',
    prerequisites: ['001'], duration: { min: 10, max: 15 }, steps: session002Steps,
    musicRefs: ['M001', 'E001'], assetRefs: ['keyboard-c3-c5', 'e001-pair-a', 'e001-pair-b', 'e001-pair-c'],
    outcome: 'Restarts the first melody independently and correctly distinguishes at least two of three pairs after optional replay.',
    reflection: { understanding: 'I know what same and different mean for a note pattern.', playing: 'I can find the notes and check a heard pattern on my piano.' },
    keepPlaying: ['Start the first melody on another C using the same white-key shape.', 'Describe whether the new version sounds higher or lower.'],
    readiness: {
      ready: { label: 'Ready', guidance: 'Continue when you choose, or compare the melody from another C.' },
      practicing: { label: 'Practicing', guidance: 'Replay one missed pair, then play both versions slowly.', exercise: 'Replay one missed pair, sing or hum its direction if comfortable, and play each version slowly.', reinforcementRefs: ['RF-EAR-1'] },
      stuck: { label: 'Stuck', guidance: 'Make the comparison smaller with two single notes.', exercise: 'Compare only two single notes: C then C, followed by C then D. Say “same key” or “different key,” then look at the keys.', reinforcementRefs: ['RF-EAR-1'], earlierSessionId: '001' }
    },
    reinforcementRefs: ['RF-KG-1', 'RF-EAR-1'],
    pedagogicalReview: ['Session 002 listening recordings and pitch-comparison pacing require qualified piano-teacher review.']
  },
  {
    id: '003', title: 'Feel a Steady Pulse', summary: 'Count, tap, and transfer a calm steady beat to one piano key.',
    type: 'Learn', chapter: 1,
    objective: 'Experience pulse as evenly spaced musical time.',
    prerequisites: [], duration: { min: 10, max: 15 }, steps: session003Steps,
    musicRefs: ['P001'], assetRefs: ['keyboard-c3-c5'],
    outcome: 'Produces 16 approximately even taps while counting and restarts without a conspicuous speed change.',
    reflection: { understanding: 'I can describe pulse as steady time, not the notes themselves.', playing: 'I can match one key press to each beat.' },
    keepPlaying: ['Walk or sway safely with a favorite recording and notice its continuing pulse.', 'There is no beat-identification score to pass.'],
    readiness: {
      ready: { label: 'Ready', guidance: 'Continue when you choose, or notice the pulse in music you enjoy.' },
      practicing: { label: 'Practicing', guidance: 'Use eight beats instead of 16, rest, and repeat three times.', exercise: 'Tap eight beats, rest for four counted beats, and repeat three times at the same comfortable pace.', reinforcementRefs: ['RF-PULSE-1'] },
      stuck: { label: 'Stuck', guidance: 'Copy only four beats from the guide, pause, then copy four more.', exercise: 'Let the pulse guide lead four taps. Pause, reset, then copy four taps without the guide.', reinforcementRefs: ['RF-PULSE-1'] }
    },
    reinforcementRefs: ['RF-PULSE-1']
  },
  {
    id: '004', title: 'Five Notes, One Beat Each', summary: 'Play the right-hand five-note walk with one note on every steady beat.',
    type: 'Practice', chapter: 1,
    objective: 'Coordinate one right-hand note with each continuing beat through a direction change.',
    prerequisites: ['001', '003'], duration: { min: 10, max: 15 }, steps: session004Steps,
    musicRefs: ['K001'], assetRefs: ['keyboard-c3-c5', 'right-hand-fingers'],
    outcome: 'Plays the five-note walk twice without an extra pause at G or a marked rush downward.',
    reflection: { understanding: 'I know why the count continues through the turn.', playing: 'My fingers can follow that pulse with an easy hand.' },
    keepPlaying: ['Try the five-note walk at a deliberately slower pulse.', 'Compare control and comfort rather than speed.'],
    readiness: {
      ready: { label: 'Ready', guidance: 'Finish here or use Keep Playing for one slower, comfortable repeat.' },
      practicing: { label: 'Practicing', guidance: 'Repeat only E–F–G–F–E on five even beats, then restore the full walk.', exercise: 'Play E–F–G–F–E on five even beats. Then return to the full C–G walk once.', reinforcementRefs: ['RF-RH-1'] },
      stuck: { label: 'Stuck', guidance: 'Return to eight C presses, then try only C–D.', exercise: 'Return to Session 003’s eight C presses. Then alternate C and D for four slow beats.', reinforcementRefs: ['RF-RH-1'], earlierSessionId: '003' }
    },
    reinforcementRefs: ['RF-RH-1', 'RF-PULSE-1'],
    pedagogicalReview: ['Session 004 hand-position language, fingering, and target pulse require qualified piano-teacher review.']
  },
  ...sliceBSessions(),
  ...sliceCSessions(),
  ...sliceDSessions(),
  ...sliceESessions()
];
