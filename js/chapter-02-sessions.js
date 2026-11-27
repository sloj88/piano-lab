const explain = (...paragraphs) => ({ type: 'text', phase: 'explain', paragraphs });
const demonstrate = (...paragraphs) => ({ type: 'text', phase: 'demonstrate', paragraphs });
const score = (musicRefs, options = {}) => ({
  type: 'notation', musicRefs, options: { measureNumbers: true, enlarge: true, ...options }
});
const reading = (musicRefs) => score(musicRefs, { readingChallenge: true, reveal: true });
const firstBar = (musicRef, sectionTitle, options = {}) => score([musicRef], {
  measureIndexes: [0], sectionTitle, ...options
});
const tryIt = (instruction, hint) => ({ type: 'practice', phase: 'try', instruction, hint });
const model = (id, counts, transcript, bpm = 56) => ({
  type: 'audio-reference', title: `Hear the example at ${bpm} bpm`,
  tracks: [{ assetRef: id, label: `Play with a ${counts}-beat count-in` }], transcript
});

function session({ id, title, type, objective, prerequisites, musicRefs, assetRefs = [], card, additionalCards = [], revisit, repeat, minutes = 12,
  preview, demonstration, practice, outcome, understanding, playing, extension }) {
  return {
    id, title, type, chapter: 2, objective, prerequisites,
    duration: { min: minutes, max: minutes }, musicRefs, assetRefs,
    steps: [
      { id: 'preview', title: 'Preview the score', kicker: 'Find your starting point', intro: objective, blocks: preview },
      { id: 'model', title: 'Follow the example', kicker: 'Connect the marks to the keys', intro: 'Trace the score before playing.', blocks: demonstration },
      { id: 'play', title: 'Try it at your piano', kicker: 'Play and reflect', intro: 'Choose a comfortable pulse and take a fresh count-in.',
        blocks: [...practice, { type: 'reflection', phase: 'reflect', prompt: outcome }] }
    ],
    outcome, reflection: { understanding, playing }, keepPlaying: [extension],
    readiness: {
      ready: { label: 'Ready', guidance: 'Continue when you choose, or play once more.' },
      practicing: { label: 'Practicing', guidance: 'Try one short repeat and check what changed.', reinforcementRefs: [card], ...(repeat ? { exercise: repeat } : {}) },
      stuck: { label: 'Stuck', guidance: 'Try the simpler starting point below, or revisit the earlier session.', reinforcementRefs: [card], earlierSessionId: revisit }
    },
    reinforcementRefs: [card, ...additionalCards],
    pedagogicalReview: [`Session ${id} score, physical instructions, and beginner pacing require qualified piano-teacher review.`]
  };
}

export const chapterTwoSessions = [
  session({
    id: '025', title: 'Find Your Place on the Grand Staff', type: 'Learn',
    objective: 'Relate the paired staves to middle C and the two familiar hand positions.',
    prerequisites: ['008', '013', '016', '024'], musicRefs: ['C02-025', 'N002-A', 'N004-A', 'P03'], card: 'RF02-MAP', revisit: '016',
    preview: [explain('The grand staff pairs treble above with bass below. In this example, read treble with your right hand and bass with your left. Both hands start on a C, one octave apart.'),
      score(['C02-025'], { caption: 'Treble above for the right hand. Bass below for the left hand.' }),
      tryIt('Point to the upper staff, then touch middle C with your right thumb. Point to the lower staff, then touch the next C to the left with your left little finger. Keep both keys silent.', 'Find each C just to the left of a group of two black keys. The upper staff starts on middle C.')],
    demonstration: [demonstrate('On the familiar landmark cards, point to G on the second treble line and F on the fourth bass line. Count the lines from the bottom.'),
      score(['N002-A', 'N004-A'], { showLabels: true }),
      demonstrate('On the paired score, trace middle C on its treble ledger line. Follow the RH and LH entrances in turn. The centered waiting sign tells that hand to wait for all four counts while the other plays.'),
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
    preview: [explain('Silent preparation means finding your first key before the count-in. Start by checking the clef and meter, then look for the first note.'),
      firstBar('C02-026', 'Find the first note', { readingChallenge: true }),
      tryIt('Point to the first note in the bar. Glance at your piano and rest a right-hand finger on its key without pressing. Look back at the same note, then release your hand.', 'The first note sits on the bottom treble line. Find E, the white key immediately to the right of a group of two black keys, and use finger 3.')],
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
    preview: [explain('Treble G sits on the second line from the bottom. F is in the space immediately below it. A step down on this staff moves left by one white key in this position.'),
      firstBar('C02-027', 'One step down from treble G', { readingChallenge: true }),
      tryIt('Point to the first note on the G line and the next note in the space below. On your piano, find G, then play G and the white key immediately to its left. Say “G, F.”', 'Count up from middle C through D, E, F, and G. With your right hand in C position, use finger 5 for G and 4 for F.')],
    demonstration: [score(['C02-027'], { readingChallenge: true }), demonstrate('Trace the first bar downward from the landmark. In bar 2, two noteheads in the same space ask for two presses on the same key. Let the key rise between presses.')],
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
    preview: [explain('Bass F sits on the fourth line from the bottom. G is in the space immediately above it. In this position, that step up moves right by one white key.'),
      firstBar('C02-028', 'One step up from bass F', { readingChallenge: true }),
      tryIt('Point to F on the line and G in the space above. Set your left little finger on lower C, then play F with finger 2 and G with finger 1 without shifting your hand.', 'Start at the C one octave below middle C. The next white keys to the right are D, E, F, and G.')],
    demonstration: [score(['C02-028'], { readingChallenge: true }), demonstrate('Trace bar 1 up and back from F. Follow the downward steps in bar 2. Notice the matching staff positions across the barline. Release and press again when the same note repeats.')],
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
    preview: [explain('A barline can help you find your place again after a brief glance at the keys. Try it with a score you already know.'),
      score(['C02-026'], { readingChallenge: true }),
      tryIt('Point to the number 2 above the score. Glance toward your keyboard, then look back and point to the first note of bar 2. Try the glance once with your hand resting lightly on the starting key.', 'Bar 2 starts just to the right of the first vertical barline. Use the printed 2 as your return point.')],
    demonstration: [score(['C02-026'], { readingChallenge: true }), demonstrate('If you lose your place while playing, release the key. Find the start of a bar, prepare the first key there, and give yourself a fresh four-count before starting again.')],
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
    preview: [explain('In familiar 4/4 you counted four beats before the next barline. In 2/4 the top number tells you there are two beats per measure. The bottom 4 tells you a quarter note still takes one beat.'),
      firstBar('C02-030', 'One bar in 2/4', { showBeatGrid: true }),
      tryIt('Point to the top 2. Say an even “1, 2” to get ready. Then tap your leg once for each of the two notes, saying “1, 2” again.', 'The two boxes below the staff show the two beats before the barline.')],
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
    preview: [explain('A quarter rest takes one silent beat. In 2/4, keep counting to two even when a beat is silent.'),
      firstBar('C02-031', 'One sounding beat and one silent beat', { showBeatGrid: true }),
      tryIt('Point to the quarter rest in the score. Say “1, 2,” tapping your leg only on 1. Say 2 at the same pace even though your hand stays quiet.', 'Find the rest immediately to the right of the first note. The beat guide marks it as silent.')],
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
    preview: [explain('The quarter note lasts one beat in 2/4, 3/4, and 4/4. The top number tells you how many beats fit before the next barline. Compare the two bars below.'),
      firstBar('C02-030', 'Two beats before the barline', { showBeatGrid: true }),
      firstBar('C02-032', 'Three beats before the barline', { showBeatGrid: true }),
      tryIt('Point to each top number. Say “1, 2” for the first score and “1, 2, 3” for the second, keeping the same pace. Say the three-count once more as if you were about to start playing.', 'In the 3/4 guide, the first note fills beats 1 and 2. The next note begins on 3.')],
    demonstration: [score(['C02-032'], { showBeatGrid: true }), demonstrate('Follow bar 1: press on 1, keep holding through 2, then play the next note on 3. In bar 2 there is a new sound on every beat.'),
      model('c02-032-model', 'three', 'Spoken “1, 2, 3,” then C4 held across beats 1 and 2, D4 on beat 3, and E4, D4, C4 as quarters in bar 2.')],
    practice: [score(['C02-032'], { showBeatGrid: true }), tryIt('Speak the three counts, tap the attacks, then play both bars. Give a fresh three-count and replay from bar 2.', 'If beat 3 rushes, speak three evenly spaced numbers and play only the first bar once.')],
    outcome: 'Could you keep three evenly spaced beats in both bars?',
    understanding: 'I can predict the count of the next attack from the notation.',
    playing: 'I can hold through beat 2 and play beat 3 without rushing.',
    extension: 'Alternate tapping the two-beat card from Session 030 and this three-beat card, giving each a fresh count-in.'
  }),
  session({
    id: '033', title: 'One Sound for Four Beats', type: 'Learn',
    objective: 'Read a whole note in 4/4 and hold one key through four counts.',
    prerequisites: ['016', '026', '032'], musicRefs: ['C02-033', 'C02-025'], assetRefs: ['c02-033-model'],
    card: 'RF02-WHOLE', revisit: '005',
    preview: [
      explain('A whole note is an open oval without a stem. In 4/4 it fills one bar with one sound, even if the sound fades while you hold the key.'),
      firstBar('C02-033', 'One press across four counts', { showBeatGrid: true }),
      tryIt('Find lower C. Point to the oval, press once with your left little finger, and say “1, 2, 3, 4” before releasing.', 'Keep your hand easy as the sound fades.')
    ],
    demonstration: [
      demonstrate('Compare the whole note with the stemmed half note in bar 2. The rectangle in the paired score is a whole-measure rest. Point to a note that sounds and to the sign that tells the other hand to wait.'),
      firstBar('C02-025', 'The lower staff waits'),
      score(['C02-033'], { showBeatGrid: true }),
      model('c02-033-model', 'four', 'After a spoken four-count, lower C sounds across bar 1. Bar 2 is D, E, and D held for two beats. Lower C sounds across bar 3.')
    ],
    practice: [
      score(['C02-033']),
      tryIt('Give a four-count, then play all three bars with your left hand. Aim for a comfortable 52–60 bpm. Count aloud during both whole notes and release after each fourth beat.', 'Rehearse bars 1 and 2 together. Bar 2 begins on a fresh 1.')
    ],
    outcome: 'Did one press last through all four counts in each whole-note bar?',
    understanding: 'I can tell a whole note, a half note, and a waiting sign apart.',
    playing: 'I can hold one key through four beats while the sound fades.',
    extension: 'Compare bars 1 and 2 once more, keeping the same beat.'
  }),
  session({
    id: '034', title: 'Choose the Count-In', type: 'Review',
    objective: 'Read the meter and choose the length of the count-in before playing.',
    prerequisites: ['030', '032', '033'], musicRefs: ['C02-032', 'C02-034-T2', 'C02-034-B3', 'C02-034-T4'],
    card: 'RF02-THREE', additionalCards: ['RF02-TWO', 'RF02-WHOLE'], revisit: '032',
    repeat: 'Pick the count that slipped. Revisit 030 for two beats, 032 for three, or 033 for four. Then count in and play one bar of that meter.',
    preview: [
      explain('The top number tells you how many beats to count before entering. Recall the count for this familiar card.'),
      firstBar('C02-032', 'Recall a familiar count-in', { readingChallenge: true }),
      tryIt('Point to the top number and count one bar aloud before going on.', 'The top 3 asks for three even counts.')
    ],
    demonstration: [
      demonstrate('On the familiar score, point to the meter, silently prepare the first key, and count one bar. Play the first note on the next 1.'),
      firstBar('C02-032', 'Preview and prepare', { readingChallenge: true })
    ],
    practice: [
      reading(['C02-034-T2', 'C02-034-B3', 'C02-034-T4']),
      tryIt('Choose any order. Name each meter, count one matching bar, and play the card around a comfortable 52–60 bpm. Then restart one card from bar 2.', 'Say only the preparatory bar and the first bar before adding pitches.')
    ],
    outcome: 'Which count-in felt least familiar today?',
    understanding: 'I can choose a two-, three-, or four-count from the meter.',
    playing: 'I can keep that count through the first bar.',
    extension: 'Mix the card order once and try again.'
  }),
  session({
    id: '035', title: 'Keep Three in the Bass', type: 'Practice',
    objective: 'Carry a steady three-beat pulse across bass-clef barlines.',
    prerequisites: ['028', '032', '034'], musicRefs: ['C02-035'], card: 'RF02-THREE', revisit: '032',
    preview: [
      explain('The next 1 arrives on the same steady pulse after every barline.'),
      firstBar('C02-035', 'Find the start in bass', { readingChallenge: true }),
      tryIt('Point to the first note. Silently prepare its key, then say a three-beat count-in.', 'Find bass F on the fourth line from the bottom.')
    ],
    demonstration: [
      demonstrate('Look for the longer notes. Point to the start of every bar and tap each new 1 while counting through the holds.'),
      score(['C02-035'], { readingChallenge: true })
    ],
    practice: [
      reading(['C02-035']),
      tryIt('Read all four bars with your left hand at a comfortable 52–62 bpm. Choose one join to repeat, then reconnect all four bars. Reveal note names after trying.', 'Count “3, 1” across your chosen barline at an even pace.')
    ],
    outcome: 'Which barline can you now cross with a steady pulse?',
    understanding: 'I can predict where each new 1 falls.',
    playing: 'I can keep groups of three going in the left hand.',
    extension: 'Start at bar 3 after a fresh three-count.'
  }),
  session({
    id: '036', title: 'Two Beats of Quiet', type: 'Learn',
    objective: 'Read a half rest and keep counting through two silent beats.',
    prerequisites: ['017', '033', '035'], musicRefs: ['C02-036'], assetRefs: ['c02-036-model'],
    card: 'RF02-REST', revisit: '017',
    preview: [
      explain('A half rest is a small rectangle that sits on the middle line. It uses two beats of silence. A half note uses the same two beats with the key held down.'),
      firstBar('C02-036', 'Keep counting through silence', { showBeatGrid: true }),
      tryIt('Point to the rectangle, then say “1, 2, 3, 4.” Tap on 1 and 4 only. Keep saying 2 and 3 evenly.', 'Look at the two silent beat cells.')
    ],
    demonstration: [
      demonstrate('Find the half rest in bar 1 and the half note in bar 2. Listen while pointing to the counts and notice when the key is released.'),
      score(['C02-036'], { showBeatGrid: true }),
      model('c02-036-model', 'four', 'Four spoken counts, then lower C on 1, silence on 2 and 3, and D on 4. Bar 2 holds E through 2, then plays D and C.')
    ],
    practice: [
      score(['C02-036']),
      tryIt('Speak the counts, tap 1 and 4 in bar 1, then play both bars with your left hand around 52–60 bpm. Release the key when the rest starts.', 'Replay the first bar more slowly and let your hand stay easy during the silence.')
    ],
    outcome: 'Did you leave two complete silent beats and resume on 4?',
    understanding: 'I can explain how a half rest differs from a half note.',
    playing: 'I can release for two beats and come back in on time.',
    extension: 'Loop bar 1 once without the count guide.'
  }),
  session({
    id: '037', title: 'Hear the Missing Beats', type: 'Review',
    objective: 'Match a heard two-beat silence to its placement in the score.',
    prerequisites: ['017', '036'], musicRefs: ['C02-037-A', 'C02-037-B'], assetRefs: ['c02-037-a', 'c02-037-b'],
    card: 'RF02-REST', revisit: '036',
    preview: [
      explain('Both scores use the same key and contain two silent beats. The rest placement changes when you hear the second attack.'),
      score(['C02-037-A', 'C02-037-B'], { readingChallenge: true }),
      tryIt('Point to the half rest in each card. Count four evenly and tap each card’s two attacks.', 'Look for the rectangle sitting on the middle line.')
    ],
    demonstration: [
      demonstrate('Listen after the four spoken counts. Point to the matching card and say which beats were silent before opening the answer.'),
      score(['C02-037-A', 'C02-037-B'], { readingChallenge: true }),
      { type: 'audio-reference', title: 'Which card matches?', tracks: [{ assetRef: 'c02-037-b', label: 'Play the mystery rhythm' }], transcript: 'Four spoken beats introduce a one-bar rhythm. The answer describes its attacks and silent beats after your choice.' },
      { type: 'audio-reference', title: 'Compare both cards at 56 bpm', collapsed: true, summary: 'Reveal the answer after choosing',
        tracks: [{ assetRef: 'c02-037-a', label: 'Play Card A' }, { assetRef: 'c02-037-b', label: 'Play Card B' }],
        transcript: 'The mystery recording is Card B. It sounds on 1 and 2 and is silent on 3 and 4. Card A sounds on 1 and 4 and is silent on 2 and 3.' }
    ],
    practice: [
      score(['C02-037-A', 'C02-037-B'], { readingChallenge: true }),
      tryIt('Tap both scores, then play each on middle C after a four-count. Listen for where the second attack falls.', 'Tap the attacks while speaking all four counts.')
    ],
    outcome: 'Could you hear where the second attack fell and make the two versions sound different?',
    understanding: 'I can match the silent beats I heard to a written rest.',
    playing: 'I can place the attacks and rests as written on both cards.',
    extension: 'Read and play the two cards in reverse order.'
  }),
  session({
    id: '038', title: 'Two Notes Inside One Beat', type: 'Learn',
    objective: 'Read two beamed eighth notes as two even attacks inside one quarter beat.',
    prerequisites: ['030', '031', '037'], musicRefs: ['C02-038'], assetRefs: ['c02-038-model'],
    card: 'RF02-PAIR', revisit: '030',
    preview: [
      explain('The bar joining the stems is a beam. These two eighth notes share the first beat. Say “1-and” inside that beat, with 2 arriving at the usual time.'),
      firstBar('C02-038', 'Two attacks on one beat', { showBeatGrid: true }),
      tryIt('Say “1, 2” evenly. Repeat at the same pace and place “and” halfway between 1 and 2. Tap on each syllable.', 'Tap the numbered beats first, then add the middle tap.')
    ],
    demonstration: [
      demonstrate('Follow the beam on beat 1. Listen for C on 1, D on “and,” and E on 2. Point to the beat cells as the first bar plays.'),
      firstBar('C02-038', 'Hear the first beat split in two', { showBeatGrid: true }),
      model('c02-038-model', 'two', 'After a two-count, C and D split beat 1, and E lands on beat 2. The second bar has D and C as quarters.', 52)
    ],
    practice: [
      firstBar('C02-038', 'Try bar 1 first', { showBeatGrid: true }),
      tryIt('Speak, tap, then play bar 1 with right-hand fingers 1, 2, and 3 at a comfortable 48–56 bpm. After that attempt, open the full score and add bar 2.', 'Try a slower pulse and make sure E lands on 2.'),
      score(['C02-038'], { hiddenUntilReveal: true, revealLabel: 'Open both bars after trying bar 1' })
    ],
    outcome: 'Did two evenly spaced attacks fit before your next numbered beat?',
    understanding: 'I can point to the pair and tell how much time it takes.',
    playing: 'I can play two eighths and land the next beat on time.',
    extension: 'Repeat the first bar once at a slower pulse.'
  }),
  session({
    id: '039', title: 'Carry the Pair Through a Barline', type: 'Practice',
    objective: 'Keep the pulse steady when a pair on beat 2 leads into a new bar.',
    prerequisites: ['030', '031', '038'], musicRefs: ['C02-039'], card: 'RF02-PAIR', revisit: '038',
    preview: [
      explain('A pair can divide beat 2 just as it divided beat 1. The downbeat of the next bar follows at the usual pace.'),
      firstBar('C02-039', 'A pair at the end of the bar', { readingChallenge: true }),
      tryIt('Point to the pair and say “1, 2-and, 1.” Tap your leg on the four sounds you just said.', 'Fit “and” midway between 2 and the next 1.')
    ],
    demonstration: [
      score(['C02-039'], { readingChallenge: true }),
      demonstrate('Find where the same rhythm returns in bar 3. Point from each final pair to the next written downbeat.')
    ],
    practice: [
      reading(['C02-039']),
      tryIt('Tap “1, 2-and, 1.” Play bars 1–2, then bars 3–4 around 48–58 bpm. Connect the sections if comfortable.', 'Loop just beat 2 and the new downbeat slowly, keeping your fingers easy.')
    ],
    outcome: 'Did you arrive on the new 1 without adding a beat or rushing the pair?',
    understanding: 'I can predict the downbeat that follows a pair on 2.',
    playing: 'I can cross the barline at a steady pulse.',
    extension: 'Restart at bar 3 and play to the ending.'
  }),
  session({
    id: '040', title: 'Two Inside One, Left Hand', type: 'Practice',
    objective: 'Play an even eighth-note pair in bass and land the following quarter on time.',
    prerequisites: ['030', '031', '038', '039'], musicRefs: ['C02-038', 'C02-040'], assetRefs: ['c02-040-model'],
    card: 'RF02-PAIR', revisit: '038',
    preview: [
      explain('The rhythm from Session 038 can be read in bass. Find the pair on the first beat and prepare the left hand.'),
      firstBar('C02-040', 'Find the pair in bass', { readingChallenge: true }),
      tryIt('Point to the pair, then find lower C and the next white key to its right. Rest your left fingers 5 and 4 on those keys and say “1-and, 2.”', 'Lower C is one octave below middle C.')
    ],
    demonstration: [
      demonstrate('Trace the rise from the pair into beat 2 and the return in bar 2. Tap both bars to hear the same rhythm as the treble example.'),
      score(['C02-040'], { showBeatGrid: true })
    ],
    practice: [
      reading(['C02-040']),
      tryIt('Tap and play both bars with your left hand at a comfortable 48–56 bpm. Listen to the model to check your pulse, then repeat from the score alone.', 'Use fingers 5, 4, and 3 on the way up. Slow down if the hand tightens or beat 2 comes early.'),
      model('c02-040-model', 'two', 'After two spoken counts, lower C and D divide beat 1 and E lands on 2. The second bar descends through D and C as quarters.', 52)
    ],
    outcome: 'Could you land E on beat 2 with your left hand still relaxed?',
    understanding: 'I can recognize the same subdivision in treble and bass.',
    playing: 'I can play the bass pair and following quarter at an even pace.',
    extension: 'Play the treble and bass versions with a separate count-in for each.'
  }),
  session({
    id: '041', title: 'Hear One Attack or Two', type: 'Review',
    objective: 'Hear a subdivided beat and match it to the score while the pulse stays steady.',
    prerequisites: ['030', '031', '038', '040'], musicRefs: ['C02-041-A', 'C02-041-B'],
    assetRefs: ['c02-041-a', 'c02-041-mystery'], card: 'RF02-EAR', revisit: '038',
    preview: [
      explain('The first beat can have one quarter-note attack or two eighth-note attacks. Both take the same amount of time.'),
      score(['C02-041-A', 'C02-041-B'], { readingChallenge: true }),
      tryIt('Point to beat 1 in each card. Tap it once for the quarter and twice for the pair, then land on beat 2 at the same pace.', 'Say “1, 2” for the first card and “1-and, 2” for the second.')
    ],
    demonstration: [
      demonstrate('Listen after the two spoken counts. Choose the matching card and say how many attacks you heard on beat 1. Then open the answer to check.'),
      score(['C02-041-A', 'C02-041-B'], { readingChallenge: true }),
      { type: 'audio-reference', title: 'Which card matches?', tracks: [{ assetRef: 'c02-041-mystery', label: 'Play the mystery rhythm' }],
        transcript: 'Two spoken counts, then two bars. The answer describes the first beat after your choice.' },
      { type: 'audio-reference', title: 'Compare both cards at 52 bpm', collapsed: true, summary: 'Reveal the answer after choosing',
        tracks: [{ assetRef: 'c02-041-a', label: 'Play Card A' }, { assetRef: 'c02-041-mystery', label: 'Play Card B' }],
        transcript: 'The mystery recording is Card B. Its first beat has two C3 attacks. Card A uses one C3 quarter note there. Both then play D3 on beat 2 and hold E3 for two beats in bar 2.' }
    ],
    practice: [
      reading(['C02-041-A', 'C02-041-B']),
      tryIt('Speak and tap each rhythm, then play both cards with your left hand. Let the C key rise easily between the two attacks in the pair.', 'Try the two attacks slowly on lower C before adding the other notes.')
    ],
    outcome: 'Could you hear the extra attack and place it inside one beat?',
    understanding: 'I can hear the difference between the two first beats.',
    playing: 'I can play both versions while keeping the same pulse.',
    extension: 'Play the two scores in reverse order.'
  }),
  session({
    id: '042', title: 'Hold Across the Barline', type: 'Learn',
    objective: 'Read a tie between identical pitches and carry one key press across the barline.',
    prerequisites: ['030', '033', '039', '041'], musicRefs: ['C02-042-A', 'C02-042-B'],
    assetRefs: ['c02-042-a', 'c02-042-b'], card: 'RF02-TIE', revisit: '005',
    preview: [
      explain('A tie is a curve between two notes of the same pitch. Press once and hold for both written durations. The next bar still begins on time.'),
      score(['C02-042-A'], { showBeatGrid: true }),
      tryIt('Trace the curve from middle C at the end of bar 1 to the same note at the start of bar 2. Tap on 2 and keep your finger down through the next 1.', 'Say “2, 1” evenly while the finger stays down.')
    ],
    demonstration: [
      demonstrate('Compare the two scores. Listen at the barline. The tied C carries through the next 1. The same notes without the curve call for a new attack on 1.'),
      score(['C02-042-A', 'C02-042-B']),
      { type: 'audio-reference', title: 'Compare holding and repeating at 56 bpm', tracks: [{ assetRef: 'c02-042-a', label: 'Hear the tied C' }, { assetRef: 'c02-042-b', label: 'Hear the repeated C' }],
        transcript: 'Both start after a spoken two-count. The first holds middle C through the barline for two beats. The second plays C again on the new 1.' }
    ],
    practice: [
      score(['C02-042-A', 'C02-042-B']),
      tryIt('Count through both versions and play them separately. In the tied score, hold C through bar 2 beat 1 and play D on beat 2.', 'Trace both C noteheads before you play. Think “press, hold” on 2 and the next 1.')
    ],
    outcome: 'Did you hear one C attack in the tied version and two in the repeat?',
    understanding: 'I can explain why the tie has two noteheads and one attack.',
    playing: 'I can keep C down across the barline and change notes on time.',
    extension: 'Repeat just the tied bars at a steady count.'
  }),
  session({
    id: '043', title: 'Follow a Bass Tie', type: 'Practice',
    objective: 'Hold lower C from beat 3 through the next beat 1 in bass-clef 3/4.',
    prerequisites: ['035', '042'], musicRefs: ['C02-043', 'C02-042-A', 'C02-042-B'],
    assetRefs: ['c02-043-model'], card: 'RF02-TIE', revisit: '042',
    preview: [
      explain('The same curved tie works in bass and in a three-beat bar. Keep counting through the new 1.'),
      score(['C02-043'], { readingChallenge: true }),
      tryIt('Point to the tie on beat 3 and follow it to the next 1. Say “3, 1, 2” and tap only 3 and 2.', 'Keep your tapping finger down across the middle count.')
    ],
    demonstration: [
      demonstrate('Follow both count guides. The tied C3 continues as the second bar begins. The next attack is D3 on beat 2.'),
      score(['C02-043'], { showBeatGrid: true })
    ],
    practice: [
      reading(['C02-043']),
      tryIt('Count in for three beats, speak both bars, and tap only the attacks. Play both bars with your left hand. Release C as beat 2 arrives and play D.', 'If you replay C by habit, practice just the three counts around the join.'),
      { ...model('c02-043-model', 'three', 'Three spoken counts, then D3 for two beats, one C3 across 3 and the next 1, then D3 for two beats.'),
        collapsed: true, summary: 'Hear the model after trying both bars' }
    ],
    outcome: 'Did C continue through the new 1, with D arriving on 2?',
    understanding: 'I can find the two tied counts in a 3/4 score.',
    playing: 'I can hold across the barline without pressing again.',
    extension: 'Recall and compare the two treble versions from Session 042.'
  }),
  session({
    id: '044', title: 'Rest, Repeat, or Hold', type: 'Review',
    objective: 'Choose whether to release, press again, or keep holding while reading a mixed rhythm.',
    prerequisites: ['036', '039', '040', '043'], musicRefs: ['C02-044-T', 'C02-044-B'],
    card: 'RF02-TIE', additionalCards: ['RF02-REST', 'RF02-PAIR'], revisit: '043',
    repeat: 'Choose one beat to repair. For silence, revisit 036. For the pair, revisit 039 or 040. For a hold, revisit 042 or 043. Then retry the beat in its bar.',
    preview: [
      explain('The score can ask for a release, a fresh attack on the same key, or a continuing hold. Look for the mark that tells you which action to use.'),
      score(['C02-044-T', 'C02-044-B'], { readingChallenge: true }),
      tryIt('Find a rest, an untied repeat, and a tie. Say what your hand does at each one before you try the pitches.', 'Look for a rest sign, equal note heights without a curve, or equal note heights joined by a curve.')
    ],
    demonstration: [
      demonstrate('Point to a beat where the hand must change what it does. Speak the action, then tap only the written attacks. Count through the silent and held beats.'),
      score(['C02-044-T', 'C02-044-B'], { readingChallenge: true })
    ],
    practice: [
      reading(['C02-044-T', 'C02-044-B']),
      tryIt('Preview and play the treble and bass cards separately around 48–58 bpm. Try each before revealing note names. Choose one beat to repair, then play its bar in context.', 'If the count slips, speak the bar without playing, then tap and try it again.')
    ],
    outcome: 'Which action is clearer after your one-beat repair?',
    understanding: 'I can distinguish written repeats, rests, and ties.',
    playing: 'I can make all three actions sound different at a steady pulse.',
    extension: 'Try the cards again in the opposite order.'
  }),
  session({
    id: '045', title: 'Build Window Lights', type: 'Practice', minutes: 13,
    objective: 'Read and prepare the right-hand piece in two four-bar sections.',
    prerequisites: ['019', '027', '032', '044'], musicRefs: ['C02-P01'],
    card: 'RF02-PIECE-T', revisit: '032',
    preview: [
      explain('Window Lights has three beats per bar and begins softly. The p asks for a gentle sound.'),
      firstBar('C02-P01', 'Window Lights · opening bar', { showStartingFinger: true, readingChallenge: true }),
      tryIt('Point to 3/4 and p. Find E4 with right-hand finger 3 and tap a three-count before sounding the first bar gently.', 'E4 is on the bottom line of the treble staff.')
    ],
    demonstration: [
      score(['C02-P01'], { measureIndexes: [0, 1, 2, 3], sectionTitle: 'Window Lights · bars 1–4', readingChallenge: true }),
      demonstrate('Tap the first four bars and notice which notes last two beats. Then count in and read those four bars by themselves.')
    ],
    practice: [
      score(['C02-P01'], { measureIndexes: [4, 5, 6, 7], sectionTitle: 'Window Lights · bars 5–8', readingChallenge: true }),
      tryIt('Find the start of bar 5. Give a new three-count and read bars 5–8. Practice both sections separately around 52–56 bpm before joining them. Repair the join or the last rest.', 'For bar 5, start on middle C with right-hand finger 1. Count the last silent beat before ending.')
    ],
    outcome: 'Can you start both sections from the score and finish each with a steady pulse?',
    understanding: 'I can find the section starts and anticipate the longer notes.',
    playing: 'I can read each section and keep groups of three.',
    extension: 'Start at bar 5 with the finger hint closed.'
  }),
  session({
    id: '046', title: 'Play Window Lights', type: 'Play',
    objective: 'Play all eight bars with a steady three-beat pulse and a gentle ending.',
    prerequisites: ['045'], musicRefs: ['C02-P01'], assetRefs: ['c02-p01-reference'], card: 'RF02-PIECE-T', revisit: '045',
    preview: [
      explain('Use the complete score to plan your start and finish. A double barline separates the two sections.'),
      score(['C02-P01'], { readingChallenge: true }),
      tryIt('Find the first note, point to the start of bar 5, and scroll to the last rest. Say the three-count and decide how softly you want to begin.', 'Follow the measure numbers to bar 8. The rest lasts through the final beat.')
    ],
    demonstration: [
      score(['C02-P01'], { readingChallenge: true }),
      demonstrate('Preview your starting position and the last bar. Count three, then give the whole score a first trial without stopping for small slips.'),
      { ...model('c02-p01-reference', 'three', 'A spoken three-count precedes eight soft bars. The final C holds for two beats, followed by one silent beat.', 60),
        collapsed: true, summary: 'Hear the reference after previewing the score or trying it' }
    ],
    practice: [
      score(['C02-P01'], { readingChallenge: true }),
      tryIt('Play all eight bars at a comfortable pace. Pick one bar or join to repair slowly. Play again from the beginning and keep counting through the last silent beat.', 'For the ending, practice bar 8 alone and breathe out as the final beat passes.')
    ],
    outcome: 'Where did your repair help, and did the ending stay gentle?',
    understanding: 'I can name one useful repair and the sound I wanted at the end.',
    playing: 'I can play through all eight bars and count the final rest.',
    extension: 'Perform once at a comfortable tempo for an imagined listener.'
  }),
  session({
    id: '047', title: 'Build Footpath', type: 'Practice', minutes: 13,
    objective: 'Prepare both left-hand sections and carry each eighth pair into the next bar.',
    prerequisites: ['019', '028', '031', '039', '040', '046'], musicRefs: ['C02-P02'], card: 'RF02-PIECE-B', revisit: '040',
    preview: [
      explain('Footpath has two beats per bar. The f calls for a full, comfortable sound. Keep the hand easy and the pulse like a walk.'),
      firstBar('C02-P02', 'Footpath · opening bar', { showStartingFinger: true, readingChallenge: true }),
      tryIt('Point to 2/4, f, and the beam on beat 2. Find lower C with finger 5 and tap “1, 2-and, 1” without speeding up.', 'Keep the two numbered beats evenly spaced.')
    ],
    demonstration: [
      score(['C02-P02'], { measureIndexes: [0, 1, 2, 3], sectionTitle: 'Footpath · bars 1–4', readingChallenge: true }),
      demonstrate('Tap from the pair in bar 1 into the first beat of bar 2. Then count the silence in bar 3 and read the whole section after a two-count.')
    ],
    practice: [
      score(['C02-P02'], { measureIndexes: [4, 5, 6, 7], sectionTitle: 'Footpath · bars 5–8', readingChallenge: true }),
      tryIt('Give a fresh two-count and read bars 5–8 at 48–54 bpm. Loop the pair in bar 5 into the next bar, then try joining the two sections after each feels comfortable.', 'For bar 5, start on F3 with left-hand finger 2. Let the fingers stay close to the keys.')
    ],
    outcome: 'Could you land the next 1 after each pair and keep the rest silent?',
    understanding: 'I can find the two pairs and the rest before playing.',
    playing: 'I can read both sections and keep the walking pulse.',
    extension: 'Start at bar 5 with the finger hint closed.'
  }),
  session({
    id: '048', title: 'Play Footpath', type: 'Play',
    objective: 'Play all eight bars with a steady walking pulse and a comfortable strong sound.',
    prerequisites: ['047'], musicRefs: ['C02-P02'], assetRefs: ['c02-p02-reference'], card: 'RF02-PIECE-B', revisit: '047',
    preview: [
      explain('Use the complete score to plan the two places where a pair leads into a new bar. Keep the strong sound comfortable and the pulse even.'),
      score(['C02-P02'], { readingChallenge: true }),
      tryIt('Find the pairs in bars 1 and 5 and the rest in bar 3. Tap each pair into the following downbeat before you play.', 'Slow your count until the next 1 arrives without a rush.')
    ],
    demonstration: [
      score(['C02-P02'], { readingChallenge: true }),
      demonstrate('Give a two-count and make a first trial from start to finish. Notice one place that needs a steadier pulse.'),
      { ...model('c02-p02-reference', 'two', 'A spoken two-count precedes eight bars with a full sound. Pairs divide beat 2 in bars 1 and 5. Bar 3 ends with one silent beat.', 56),
        collapsed: true, summary: 'Hear the reference after previewing the score or trying it' }
    ],
    practice: [
      score(['C02-P02'], { readingChallenge: true }),
      tryIt('Choose one pair, rest, or join to repair. Say the count and play just that spot slowly, then give a fresh two-count and replay the complete piece.', 'Use a tempo where your left hand stays relaxed. Count through the rest even when there is no sound.')
    ],
    outcome: 'Did your repair help you finish with a steady pulse and easy left hand?',
    understanding: 'I can name the repair that kept the pulse moving.',
    playing: 'I can play through the piece with a comfortably strong sound.',
    extension: 'Give bars 5–8 one quiet reading pass.'
  })
];
