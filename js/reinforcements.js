export const reinforcementCatalog = {
  'RF-KG-1': {
    id: 'RF-KG-1',
    title: 'Keyboard groups and C landmarks',
    sessions: ['001', '002'],
    repeat: 'Find three groups of two black keys. For each, point to the white key immediately left and say “C.” Choose the C nearest the instrument’s middle and play it once.',
    prerequisite: 'Cover most of the keyboard so only one two-black-key group and nearby white keys remain. Touch the group, slide to its left edge, and point to C without playing.',
    readiness: 'You can find C beside two different two-black-key groups without counting white keys from an end.',
    earlierSessionId: null
  },
  'RF-RH-1': {
    id: 'RF-RH-1',
    title: 'Right-hand five-note position and control',
    sessions: ['001', '004'],
    repeat: 'Place right-hand fingers 1–5 on C–G, play C–D–E–F–G and back once per steady beat, then release the hand completely.',
    prerequisite: 'Rest right-hand finger 1 on C and finger 2 on D. Alternate C and D for four slow beats without moving the wrist sideways.',
    readiness: 'You can play the five-note walk with the intended fingers, no extra turn-around pause, and no pain or persistent tension.',
    earlierSessionId: null
  },
  'RF-EAR-1': {
    id: 'RF-EAR-1',
    title: 'Same and different pitch',
    sessions: ['002'],
    repeat: 'Hear one listening pair, replay it once, choose Same or Different, reveal the notes, and play both versions on your physical keys.',
    prerequisite: 'Compare two single-note pairs on your piano: C then C, and C then D. Say “same key” or “different key,” then look at the keys.',
    readiness: 'You can identify two of the three short pairs with replay available and point to the changed position after the reveal.',
    earlierSessionId: '001'
  },
  'RF-PULSE-1': {
    id: 'RF-PULSE-1',
    title: 'Continuing steady pulse',
    sessions: ['003', '004'],
    repeat: 'Tap 16 beats while counting four groups of 1–4. Rest for four counted beats and restart at approximately the same speed.',
    prerequisite: 'Copy four beats from the pulse guide, pause, then copy four more. Use your leg or another safe surface rather than the keys.',
    readiness: 'You can make 16 beats without an obvious final rush, long unplanned pause, or added beat.',
    earlierSessionId: null
  },
  'RF-RHY-1': {
    id: 'RF-RHY-1', title: 'One- and two-beat durations', sessions: ['005', '006', '009', '010'],
    repeat: 'On middle C, play quarter, quarter, half while counting 1–4. Press once for the half note and release after its second count. Repeat half, half.',
    prerequisite: 'Use four beat boxes. Tap once in each box; then join boxes 1–2 and hold one tap gesture across them before joining 3–4.',
    readiness: 'You can perform at least two R001 patterns with one press per written note and the correct four-beat total.',
    earlierSessionId: '005'
  },
  'RF-RHY-2': {
    id: 'RF-RHY-2', title: 'Hear, tap, and play rhythm echoes', sessions: ['006'],
    repeat: 'Choose one R002 pattern. Hear it once or twice, tap it, reveal the count blocks, and play it twice identically on C and D.',
    prerequisite: 'Use R001 quarter, quarter, half entirely on middle C with spoken count visible; remove audio-comparison pressure.',
    readiness: 'You can reproduce three one-measure echoes after no more than two listens each and identify where the two-beat sound occurs.',
    earlierSessionId: '005'
  },
  'RF-READ-1': {
    id: 'RF-READ-1', title: 'Staff direction and time order', sessions: ['007', '008', '009', '010'],
    repeat: 'Trace N001 left to right. Say repeat, up, or down between notes, then play the shape on C–D–E.',
    prerequisite: 'Compare only two large noteheads: same height, one step higher, or one step lower. Move between C and D to match.',
    readiness: 'You can map an unfamiliar four-note contour to same, right, or left keyboard motion without needing letter names.',
    earlierSessionId: '007'
  },
  'RF-READ-2': {
    id: 'RF-READ-2', title: 'Treble landmarks C and G', sessions: ['008', '009', '010'],
    repeat: 'Shuffle four C and G cards. Point, name, and play; then perform N002 A after a count-in.',
    prerequisite: 'Match only middle C’s ledger-line note to middle C three times. Add G only after C is secure.',
    readiness: 'You can identify C and G from staff position without a mnemonic and play the correct key in the fixed right-hand position.',
    earlierSessionId: '007'
  },
  'RF-TREBLE-1': {
    id: 'RF-TREBLE-1', title: 'Treble C–D–E step reading', sessions: ['009', '010'],
    repeat: 'Preview one N003 card using first note, direction, and rhythm; play after a four-count; reveal names only afterward.',
    prerequisite: 'Read two notes only: C–D, D–C, or C–C. Keep right-hand fingers 1 and 2 prepared.',
    readiness: 'You can play a new four-note C–E card without letters above notes and with no more than one self-corrected pitch.',
    earlierSessionId: '007'
  },
  'RF-PIECE-1': {
    id: 'RF-PIECE-1', title: 'Prepare and repair a complete short piece', sessions: ['010'],
    repeat: 'Choose P01’s least secure measure, speak its count, play it twice, then connect it once to the following measure.',
    prerequisite: 'Play only P01 Measures 1–2 after tracing their contour and tapping rhythm. Completion of the whole piece is not required.',
    readiness: 'You can use preview, complete attempt, named repair, and replay, and reach P01’s ending without restarting after every small error.',
    earlierSessionId: '009'
  }
};
