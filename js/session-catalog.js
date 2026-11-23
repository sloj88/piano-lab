export const SESSION_TYPES = ['Learn', 'Practice', 'Play', 'Review'];
export const BLOCK_TYPES = ['text', 'keyboard', 'finger-position', 'musical-pattern', 'practice', 'reflection', 'audio-listening', 'pulse-guide'];

export const assetCatalog = {
  'keyboard-c3-c5': { id: 'keyboard-c3-c5', type: 'generated-diagram' },
  'right-hand-fingers': { id: 'right-hand-fingers', type: 'generated-diagram' },
  'e001-pair-a': { id: 'e001-pair-a', type: 'audio', src: 'assets/audio/e001-pair-a.wav' },
  'e001-pair-b': { id: 'e001-pair-b', type: 'audio', src: 'assets/audio/e001-pair-b.wav' },
  'e001-pair-c': { id: 'e001-pair-c', type: 'audio', src: 'assets/audio/e001-pair-c.wav' }
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
  }
];
