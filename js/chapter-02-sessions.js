const explain = (...paragraphs) => ({ type: 'text', phase: 'explain', paragraphs });
const demonstrate = (...paragraphs) => ({ type: 'text', phase: 'demonstrate', paragraphs });
const score = (musicRefs, options = {}) => ({
  type: 'notation', musicRefs, options: { measureNumbers: true, enlarge: true, ...options }
});
const reading = (musicRefs) => score(musicRefs, { readingChallenge: true, reveal: true });
const tryIt = (instruction, hint) => ({ type: 'practice', phase: 'try', instruction, hint });
const model = (id, counts, transcript) => ({
  type: 'audio-reference', title: 'Hear the example at 56 bpm',
  tracks: [{ assetRef: id, label: `Play with a ${counts}-beat count-in` }], transcript
});

function session({ id, title, type, objective, prerequisites, musicRefs, assetRefs = [], card, revisit,
  preview, demonstration, practice, outcome, understanding, playing, extension }) {
  return {
    id, title, type, chapter: 2, objective, prerequisites,
    duration: { min: 12, max: 12 }, musicRefs, assetRefs,
    steps: [
      { id: 'preview', title: 'Preview the score', kicker: 'Find your starting point', intro: objective, blocks: preview },
      { id: 'model', title: 'Follow the example', kicker: 'Connect the marks to the keys', intro: 'Trace the score before playing.', blocks: demonstration },
      { id: 'play', title: 'Try it at your piano', kicker: 'Play and reflect', intro: 'Choose a comfortable pulse and take a fresh count-in.',
        blocks: [...practice, { type: 'reflection', prompt: outcome }] }
    ],
    outcome, reflection: { understanding, playing }, keepPlaying: [extension],
    readiness: {
      ready: { label: 'Ready', guidance: 'Continue when you choose, or play once more.' },
      practicing: { label: 'Practicing', guidance: 'Try one short repeat and check what changed.', reinforcementRefs: [card] },
      stuck: { label: 'Stuck', guidance: 'Try the simpler starting point below, or revisit the earlier session.', reinforcementRefs: [card], earlierSessionId: revisit }
    },
    reinforcementRefs: [card],
    pedagogicalReview: [`Session ${id} score, physical instructions, and beginner pacing require qualified piano-teacher review.`]
  };
}

export const chapterTwoSessions = [
  session({
    id: '025', title: 'Find Your Place on the Grand Staff', type: 'Learn',
    objective: 'Relate the paired staves to middle C and the two familiar hand positions.',
    prerequisites: ['008', '013', '016', '024'], musicRefs: ['C02-025', 'N002-A', 'N004-A', 'P03'], card: 'RF02-MAP', revisit: '016',
    preview: [explain('The grand staff pairs treble above with bass below. In this example, read treble with your right hand and bass with your left.', 'Find a group of two black keys near the middle. Find middle C just to its left, then find the C one octave lower. Middle C starts your right-hand position. Your left-hand position begins lower.'),
      explain('On these familiar landmark cards, point to G on the second treble line and F on the fourth bass line. Count the lines from the bottom.'),
      score(['N002-A', 'N004-A'], { showLabels: true })],
    demonstration: [demonstrate('Trace middle C on its treble ledger line. Follow the RH and LH entrances in turn.', 'The centered waiting sign tells that hand to wait for all four counts while the other plays.'),
      score(['C02-025'], { showEntranceFingers: true })],
    practice: [score(['C02-025'], { showEntranceFingers: true }),
      tryIt('Find middle C and play the upper bar alone. Reset, find lower C, and play the lower bar alone. If comfortable, count through both bars and let the hands take turns.', 'Match the printed RH or LH label to the hand that plays. Say all four counts while the other hand waits.')],
    outcome: 'Which staff and starting key belong to each hand?',
    understanding: 'I can connect each staff to its starting C and hand.',
    playing: 'I can find each starting key and play its bar separately.',
    extension: 'Revisit Across the Keys. Point to a familiar staff entrance and find its starting key.'
  }),
  session({
    id: '026', title: 'Start Without a Sound', type: 'Practice',
    objective: 'Prepare the first note from the score and begin on time after a silent setup.',
    prerequisites: ['025'], musicRefs: ['C02-026', 'C02-025'], card: 'RF02-START', revisit: '025',
    preview: [explain('Check clef and meter. Find the first written note from a landmark, then scan for a held note or a change in direction.')],
    demonstration: [score(['C02-026'], { showStartingFinger: true }), demonstrate('The first note is E on the bottom treble line. Glance down to rest RH finger 3 on E without pressing. Return your eyes to the first bar, count “1, 2, 3, 4,” then sound E on the next 1.'),
      demonstrate('Use brief glances whenever they help you find the keys. Keep the hand easy and let go if you notice tension.')],
    practice: [reading(['C02-026']), tryIt('Start bar 1 on E. Release, reset, and start bar 2 on C after a new count-in. Connect both bars, then repeat one start with only the glances you need.', 'Prepare and sound just the first note after counting. Add the rest of the bar when the entrance feels settled.')],
    outcome: 'Can you keep the first key silent until your count-in ends?',
    understanding: 'I can explain the difference between preparing and sounding a key.',
    playing: 'I can touch the first key easily, look back at the score, and start on time.',
    extension: 'Use the same routine on the lower bar from Session 025.'
  }),
  session({
    id: '027', title: 'Read from Treble G', type: 'Practice',
    objective: 'Read down from treble G through F, and give a repeated note a new attack.',
    prerequisites: ['008', '026'], musicRefs: ['C02-027'], card: 'RF02-TREBLE', revisit: '008',
    preview: [explain('Find G on the second treble line. F sits in the space immediately below G. E is on the bottom line. On the keys, each downward step moves one white key to the left in this position.')],
    demonstration: [reading(['C02-027']), demonstrate('Trace the first bar downward from the landmark. In bar 2, two noteheads in the same space ask for two presses on the same key. Let the key rise between presses.')],
    practice: [reading(['C02-027']), tryIt('Find the first note and play bar 1. Preview bar 2 and play its repeated note twice. Give a fresh four-count and read both bars.', 'With your RH in C position, finger 5 plays G and finger 4 plays the step down to F.')],
    outcome: 'Did you find F from G and hear two separate attacks where F repeats?',
    understanding: 'I can locate F from the treble G landmark and recognize a repeat.',
    playing: 'I can read both bars from the staff and play repeated notes separately.',
    extension: 'Restart at bar 2 with the hint closed.'
  }),
  session({
    id: '028', title: 'Read from Bass F', type: 'Practice',
    objective: 'Read up and down from bass F in the fixed left-hand C position.',
    prerequisites: ['013', '026'], musicRefs: ['C02-028'], card: 'RF02-BASS', revisit: '013',
    preview: [explain('Find bass F on the fourth line from the bottom. G is in the space immediately above it. In the familiar C3–G3 position, LH fingers 5, 4, 3, 2, 1 rest over C, D, E, F, G.')],
    demonstration: [reading(['C02-028']), demonstrate('Trace bar 1 up and back from F. Follow the downward steps in bar 2. The last note of bar 1 and first note of bar 2 are both F, so release and press again at the barline.')],
    practice: [reading(['C02-028']), tryIt('Prepare LH silently and play each bar alone, then both after one four-count. Notice the direction at each step and listen for two separate F attacks across the barline.', 'Find F with finger 2, then add only the step up to G with finger 1 before trying the full bar.')],
    outcome: 'Can you follow the bass notes in either direction while keeping the hand comfortable?',
    understanding: 'I can find G from F and tell repeats from steps.',
    playing: 'I can read both bars without shifting the left-hand position.',
    extension: 'Return to the start of either bar and play it once more.'
  }),
  session({
    id: '029', title: 'Read, Glance, Return', type: 'Review',
    objective: 'Return to the score after a keyboard glance and recover at a barline.',
    prerequisites: ['027', '028'], musicRefs: ['C02-026', 'C02-029-T', 'C02-029-B'], card: 'RF02-START', revisit: '026',
    preview: [explain('Recall your silent start. Find the beginning on the page, glance down to check your key, then return to that same place. If you lose your place, release and find the start of a bar before counting in again.')],
    demonstration: [reading(['C02-026']), demonstrate('On the familiar treble card, point to bar 2 first. Check the starting position with a brief glance and find bar 2 again. Use the barline as your return point.')],
    practice: [reading(['C02-029-T', 'C02-029-B']), tryIt('Choose either clef first. Point to bar 2, preview the first bar, count in and read the line. On a second pass, start at bar 2. Try the other clef the same way before revealing names.', 'If the place is hard to find, point to the barline and prepare just that bar’s first note before playing.')],
    outcome: 'What cue helped you get back to the score after looking down?',
    understanding: 'I can describe the cue that helps me find my place.',
    playing: 'I can restart from a barline in either clef after a fresh count.',
    extension: 'Repeat only the clef in which finding your place felt less secure.'
  }),
  session({
    id: '030', title: 'Two Beats to a Bar', type: 'Learn',
    objective: 'Read 2/4 and count two steady quarter beats in every bar.',
    prerequisites: ['005', '029'], musicRefs: ['C02-030'], assetRefs: ['c02-030-model'], card: 'RF02-TWO', revisit: '003',
    preview: [explain('In familiar 4/4 you counted four beats before the next barline. In 2/4 the top number tells you there are two beats per measure. The bottom 4 tells you a quarter note still takes one beat.')],
    demonstration: [score(['C02-030'], { showBeatGrid: true }), demonstrate('Say “1, 2” for one whole bar before you play. On the score, say “1, 2” again for every bar. One half note fills both counts with one press.')],
    practice: [score(['C02-030'], { showBeatGrid: true }), tryIt('Speak the counts, tap the attacks, then play at a comfortable pulse. Hold the half notes through beat 2. Listen to the model and retry with the same two-beat count-in.', 'Practice the first two bars alone. Tap twice in bar 1, then tap once and keep the count going in bar 2.'),
      model('c02-030-model', 'two', 'Spoken “1, 2,” then C4 and D4 as quarters, E4 held for two beats, E4 and D4 as quarters, and C4 held for two beats.')],
    outcome: 'Did every bar take two beats, including each half-note bar?',
    understanding: 'I can tell from 2/4 how many beats to count before entering.',
    playing: 'I can keep two steady beats per bar and hold a half note through both.',
    extension: 'Tap the first two bars without the recording.'
  }),
  session({
    id: '031', title: 'Two Beats in the Left Hand', type: 'Practice',
    objective: 'Keep counting in bass-clef 2/4 through a quarter rest.',
    prerequisites: ['005', '017', '030'], musicRefs: ['C02-031'], card: 'RF02-TWO', revisit: '030',
    preview: [explain('Recall the quarter rest from Chapter 01. It takes one silent beat in 2/4 too. You still count two beats in each bar.')],
    demonstration: [score(['C02-031'], { showBeatGrid: true, reveal: true, readingChallenge: true }),
      demonstrate('Trace bars 1 and 3. Point to the note on 1 and the rest on 2. The next bar begins on the next 1 without an extra wait.')],
    practice: [score(['C02-031'], { showBeatGrid: true, reveal: true, readingChallenge: true }), tryIt('Find the first bass note and give a two-count. Speak and tap only the attacks while saying beat 2 through each rest. Then play the line with LH, releasing before the silent beats.', 'Try bars 1–2 at a slower pulse. After playing on 1, lift off for 2 while you keep counting.')],
    outcome: 'Did the note after each silent beat arrive on time?',
    understanding: 'I can point to a quarter rest and identify which count stays silent.',
    playing: 'I can release on time and enter on the next downbeat with my left hand.',
    extension: 'Replay bar 3 into bar 4 at a comfortable pulse.'
  }),
  session({
    id: '032', title: 'Three Beats to a Bar', type: 'Learn',
    objective: 'Count in and read 3/4, holding a half note through beats 1 and 2 before playing beat 3.',
    prerequisites: ['005', '030', '031'], musicRefs: ['C02-032', 'C02-030'], assetRefs: ['c02-032-model'], card: 'RF02-THREE', revisit: '030',
    preview: [explain('The quarter note lasts one beat in 2/4, 3/4, and 4/4. The top number changes how many beats fit before the next barline. In 3/4 count “1, 2, 3” before entering, and again in each measure.')],
    demonstration: [score(['C02-032'], { showBeatGrid: true }), demonstrate('Follow bar 1: press on 1, keep holding through 2, then play the next note on 3. In bar 2 there is a new sound on every beat.'),
      model('c02-032-model', 'three', 'Spoken “1, 2, 3,” then C4 held across beats 1 and 2, D4 on beat 3, and E4, D4, C4 as quarters in bar 2.')],
    practice: [score(['C02-032'], { showBeatGrid: true }), tryIt('Speak the three counts, tap the attacks, then play both bars. Give a fresh three-count and replay from bar 2.', 'If beat 3 rushes, speak three evenly spaced numbers and play only the first bar once.')],
    outcome: 'Could you keep three evenly spaced beats in both bars?',
    understanding: 'I can predict the count of the next attack from the notation.',
    playing: 'I can hold through beat 2 and play beat 3 without rushing.',
    extension: 'Alternate tapping the two-beat card from Session 030 and this three-beat card, giving each a fresh count-in.'
  })
];
