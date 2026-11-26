export const musicLibrary = {
  K001: {
    id: 'K001',
    title: 'Right-hand five-note walk',
    meter: null,
    events: [
      ['C4', 1], ['D4', 2], ['E4', 3], ['F4', 4], ['G4', 5],
      ['F4', 4], ['E4', 3], ['D4', 2], ['C4', 1]
    ].map(([pitch, finger]) => ({ kind: 'note', pitch, finger, rhythm: 'pulse' }))
  },
  M001: {
    id: 'M001',
    title: 'Published first melody',
    meter: null,
    events: [
      ['C4', 1], ['D4', 2], ['E4', 3], ['G4', 5], ['E4', 3], ['D4', 2], ['C4', 1]
    ].map(([pitch, finger]) => ({ kind: 'note', pitch, finger, rhythm: 'pulse' }))
  },
  'M001-METERED': meteredExample('M001-METERED', 'First melody as a musical sentence', [
    [['C4', 1, 'quarter'], ['D4', 2, 'quarter'], ['E4', 3, 'half']],
    [['G4', 5, 'quarter'], ['E4', 3, 'quarter'], ['D4', 2, 'quarter'], ['C4', 1, 'quarter']]
  ], { tempo: { min: 56, max: 66 }, audioRefs: ['m001-even', 'm001-shaped'], destination: { pitch: 'G4', measure: 2, beat: 1 } }),
  E001: {
    id: 'E001',
    title: 'Same or different pitch pairs',
    kind: 'listening-set',
    pairs: [
      {
        id: 'A', answer: 'same', audioRef: 'e001-pair-a',
        first: ['C4', 'D4', 'E4'], second: ['C4', 'D4', 'E4'],
        directions: 'up, up / up, up'
      },
      {
        id: 'B', answer: 'different', audioRef: 'e001-pair-b',
        first: ['C4', 'E4', 'D4'], second: ['C4', 'D4', 'E4'],
        directions: 'up, down / up, up'
      },
      {
        id: 'C', answer: 'same', audioRef: 'e001-pair-c',
        first: ['G4', 'E4', 'C4'], second: ['G4', 'E4', 'C4'],
        directions: 'down, down / down, down'
      },
      {
        id: 'D', answer: 'different', audioRef: 'e001-pair-d',
        first: ['C3', 'D3', 'E3'], second: ['C3', 'E3', 'D3'],
        directions: 'up, up / up, down'
      }
    ]
  },
  P001: {
    id: 'P001',
    title: 'Sixteen steady beats',
    kind: 'pulse-guide',
    beats: 16,
    groupSize: 4,
    bpm: 60
  },
  R001: { id: 'R001', title: 'One- and two-beat durations', kind: 'reference-set', refs: ['R001-A', 'R001-B', 'R001-C', 'R001-D'] },
  'R001-A': meteredExample('R001-A', 'Quarter, quarter, half', [[['C4', 1, 'quarter'], ['C4', 1, 'quarter'], ['C4', 1, 'half']]]),
  'R001-B': meteredExample('R001-B', 'Half, quarter, quarter', [[['C4', 1, 'half'], ['C4', 1, 'quarter'], ['C4', 1, 'quarter']]]),
  'R001-C': meteredExample('R001-C', 'Quarter, half, quarter', [[['C4', 1, 'quarter'], ['C4', 1, 'half'], ['C4', 1, 'quarter']]]),
  'R001-D': meteredExample('R001-D', 'Half, half', [[['C4', 1, 'half'], ['C4', 1, 'half']]]),
  R002: { id: 'R002', title: 'Rhythm echo set', kind: 'reference-set', refs: ['R002-A', 'R002-B', 'R002-C', 'R002-D'] },
  'R002-A': meteredExample('R002-A', 'Rhythm echo A', [[['C4', 1, 'quarter'], ['C4', 1, 'quarter'], ['C4', 1, 'half']]], { audioRef: 'r002-a-pattern', countedAudioRef: 'r002-a-counted' }),
  'R002-B': meteredExample('R002-B', 'Rhythm echo B', [[['C4', 1, 'half'], ['D4', 2, 'quarter'], ['C4', 1, 'quarter']]], { audioRef: 'r002-b-pattern', countedAudioRef: 'r002-b-counted' }),
  'R002-C': meteredExample('R002-C', 'Rhythm echo C', [[['C4', 1, 'quarter'], ['D4', 2, 'half'], ['C4', 1, 'quarter']]], { audioRef: 'r002-c-pattern', countedAudioRef: 'r002-c-counted' }),
  'R002-D': meteredExample('R002-D', 'Rhythm echo D', [
    [['C4', 1, 'quarter'], ['D4', 2, 'quarter'], ['C4', 1, 'quarter'], ['D4', 2, 'quarter']],
    [['C4', 1, 'half'], ['C4', 1, 'half']]
  ], { audioRef: 'r002-d-pattern', countedAudioRef: 'r002-d-counted' }),
  N001: { id: 'N001', title: 'Staff contour cards', kind: 'reference-set', refs: ['N001-A', 'N001-B', 'N001-C'] },
  'N001-A': meteredExample('N001-A', 'Contour A', [[['C4', 1, 'quarter'], ['C4', 1, 'quarter'], ['D4', 2, 'quarter'], ['E4', 3, 'quarter']]], { notation: { clef: 'neutral', staffSteps: [0, 0, 1, 2] }, audioRef: 'n001-a-shape' }),
  'N001-B': meteredExample('N001-B', 'Contour B', [[['E4', 3, 'quarter'], ['D4', 2, 'quarter'], ['D4', 2, 'quarter'], ['C4', 1, 'quarter']]], { notation: { clef: 'neutral', staffSteps: [2, 1, 1, 0] } }),
  'N001-C': meteredExample('N001-C', 'Contour C', [[['C4', 1, 'quarter'], ['D4', 2, 'quarter'], ['E4', 3, 'quarter'], ['D4', 2, 'quarter']]], { notation: { clef: 'neutral', staffSteps: [0, 1, 2, 1] } }),
  N002: { id: 'N002', title: 'Treble landmarks', kind: 'reference-set', refs: ['N002-A', 'N002-B'] },
  'N002-A': meteredExample('N002-A', 'Middle C and treble G', [[['C4', 1, 'quarter'], ['G4', 5, 'quarter'], ['C4', 1, 'half']]]),
  'N002-B': meteredExample('N002-B', 'Treble G and middle C', [[['G4', 5, 'quarter'], ['C4', 1, 'quarter'], ['G4', 5, 'half']]]),
  N003: { id: 'N003', title: 'Treble C–D–E reading cards', kind: 'reference-set', refs: ['N003-A', 'N003-B', 'N003-C', 'N003-D'] },
  'N003-A': meteredExample('N003-A', 'Reading card A', [[['C4', 1, 'quarter'], ['D4', 2, 'quarter'], ['E4', 3, 'quarter'], ['D4', 2, 'quarter']]]),
  'N003-B': meteredExample('N003-B', 'Reading card B', [[['E4', 3, 'quarter'], ['E4', 3, 'quarter'], ['D4', 2, 'quarter'], ['C4', 1, 'quarter']]]),
  'N003-C': meteredExample('N003-C', 'Reading card C', [[['C4', 1, 'quarter'], ['C4', 1, 'quarter'], ['D4', 2, 'quarter'], ['E4', 3, 'quarter']]]),
  'N003-D': meteredExample('N003-D', 'Reading challenge D', [[['D4', 2, 'quarter'], ['C4', 1, 'quarter'], ['D4', 2, 'quarter'], ['E4', 3, 'quarter']]]),
  P01: meteredExample('P01', 'Three-Step Walk', [
    [['C4', 1, 'quarter'], ['D4', 2, 'quarter'], ['E4', 3, 'half']],
    [['E4', 3, 'quarter'], ['D4', 2, 'quarter'], ['C4', 1, 'half']],
    [['C4', 1, 'quarter'], ['C4', 1, 'quarter'], ['D4', 2, 'quarter'], ['E4', 3, 'quarter']],
    [['D4', 2, 'quarter'], ['C4', 1, 'quarter'], ['C4', 1, 'half']]
  ], { tempo: { min: 56, max: 64 }, audioRefs: ['p01-practice', 'p01-musical'], hand: 'RH', startingFinger: 1 }),
  K002: {
    id: 'K002', title: 'Left-hand five-note walk', meter: null,
    events: [
      ['C3', 5], ['D3', 4], ['E3', 3], ['F3', 2], ['G3', 1],
      ['F3', 2], ['E3', 3], ['D3', 4], ['C3', 5]
    ].map(([pitch, finger]) => ({ kind: 'note', pitch, finger, rhythm: 'pulse' }))
  },
  E002: {
    id: 'E002', title: 'Left-hand pitch echoes', kind: 'pitch-echo-set',
    echoes: [
      { id: 'A', pitches: ['C3', 'D3', 'E3'], directions: ['up', 'up'], audioRef: 'e002-a' },
      { id: 'B', pitches: ['E3', 'D3', 'C3'], directions: ['down', 'down'], audioRef: 'e002-b' },
      { id: 'C', pitches: ['C3', 'C3', 'D3'], directions: ['repeat', 'up'], audioRef: 'e002-c' }
    ]
  },
  N004: { id: 'N004', title: 'Bass landmarks', kind: 'reference-set', refs: ['N004-A', 'N004-B'] },
  'N004-A': meteredExample('N004-A', 'Bass C and F', [[['C3', 5, 'quarter'], ['F3', 2, 'quarter'], ['C3', 5, 'half']]], { notation: { clef: 'bass' } }),
  'N004-B': meteredExample('N004-B', 'Bass F and C', [[['F3', 2, 'quarter'], ['C3', 5, 'quarter'], ['F3', 2, 'half']]], { notation: { clef: 'bass' } }),
  N005: { id: 'N005', title: 'Bass C–D–E reading cards', kind: 'reference-set', refs: ['N005-A', 'N005-B', 'N005-C', 'N005-D'] },
  'N005-A': meteredExample('N005-A', 'Bass reading card A', [[['C3', 5, 'quarter'], ['D3', 4, 'quarter'], ['E3', 3, 'quarter'], ['D3', 4, 'quarter']]], { notation: { clef: 'bass' } }),
  'N005-B': meteredExample('N005-B', 'Bass reading card B', [[['E3', 3, 'quarter'], ['E3', 3, 'quarter'], ['D3', 4, 'quarter'], ['C3', 5, 'quarter']]], { notation: { clef: 'bass' } }),
  'N005-C': meteredExample('N005-C', 'Bass reading card C', [[['C3', 5, 'quarter'], ['C3', 5, 'quarter'], ['D3', 4, 'quarter'], ['E3', 3, 'quarter']]], { notation: { clef: 'bass' } }),
  'N005-D': meteredExample('N005-D', 'Bass reading challenge D', [[['D3', 4, 'quarter'], ['C3', 5, 'quarter'], ['D3', 4, 'quarter'], ['E3', 3, 'quarter']]], { notation: { clef: 'bass' } }),
  H001: {
    id: 'H001', title: 'Hands take turns', kind: 'hand-pattern', meter: { beats: 4, beatValue: 4 }, tempo: { min: 48, max: 56 },
    measures: [
      { events: [['LH', 'C3', 5], ['RH', 'C4', 1], ['LH', 'C3', 5], ['RH', 'C4', 1]].map(([hand, pitch, finger]) => ({ kind: 'note', hand, pitch, finger, rhythm: 'quarter', beats: 1 })) },
      { events: [['LH', 'D3', 4], ['RH', 'D4', 2], ['LH', 'E3', 3], ['RH', 'E4', 3]].map(([hand, pitch, finger]) => ({ kind: 'note', hand, pitch, finger, rhythm: 'quarter', beats: 1 })) }
    ]
  },
  R003: { id: 'R003', title: 'Quarter-rest patterns', kind: 'reference-set', refs: ['R003-A', 'R003-B', 'R003-C'] },
  'R003-A': meteredEvents('R003-A', 'Rest pattern A', [note('C4', 1), rest('quarter-rest'), note('D4', 2), note('E4', 3)]),
  'R003-B': meteredEvents('R003-B', 'Rest pattern B', [note('C4', 1, 'half'), rest('quarter-rest'), note('C4', 1)]),
  'R003-C': meteredEvents('R003-C', 'Rest challenge C', [note('C3', 5), note('D3', 4), rest('quarter-rest'), note('E3', 3)], { notation: { clef: 'bass' } }),
  R004: { id: 'R004', title: 'Mixed-rhythm review cards', kind: 'reference-set', refs: ['R004-A', 'R004-B', 'R004-C', 'R004-D', 'R004-E'] },
  'R004-A': meteredEvents('R004-A', 'Mixed rhythm A · RH', [note('C4', 1), note('C4', 1), note('C4', 1, 'half')], { hand: 'RH' }),
  'R004-B': meteredEvents('R004-B', 'Mixed rhythm B · LH', [note('C3', 5, 'half'), note('D3', 4), note('E3', 3)], { notation: { clef: 'bass' }, hand: 'LH' }),
  'R004-C': meteredEvents('R004-C', 'Mixed rhythm C · RH', [note('C4', 1), rest('quarter-rest'), note('D4', 2), note('E4', 3)], { hand: 'RH' }),
  'R004-D': meteredEvents('R004-D', 'Mixed rhythm D · LH', [note('C3', 5), note('D3', 4, 'half'), note('C3', 5)], { notation: { clef: 'bass' }, hand: 'LH' }),
  'R004-E': meteredExample('R004-E', 'Mixed rhythm E · Keep Playing', [
    [['C4', 1, 'quarter'], ['D4', 2, 'quarter'], ['E4', 3, 'quarter'], ['D4', 2, 'quarter']],
    [note('C4', 1, 'half'), rest('quarter-rest'), note('C4', 1)]
  ], { hand: 'RH' }),
  D001: {
    id: 'D001', title: 'Soft and strong groups', kind: 'dynamic-model', meter: { beats: 4, beatValue: 4 },
    groups: [
      { dynamic: 'p', word: 'soft', events: [note('C4', 1), note('C4', 1), note('C4', 1), note('C4', 1)] },
      { dynamic: 'f', word: 'strong, never forced', events: [note('C4', 1), note('C4', 1), note('C4', 1), note('C4', 1)] }
    ],
    audioRef: 'd001-soft-strong'
  },
  C001: { id: 'C001', title: 'Constrained musical answers', kind: 'reference-set', refs: ['C001-A', 'C001-B'] },
  'C001-A': meteredExample('C001-A', 'Answer A', [[['E4', 3, 'quarter'], ['D4', 2, 'quarter'], ['C4', 1, 'half']]]),
  'C001-B': meteredExample('C001-B', 'Answer B', [[['C4', 1, 'quarter'], ['D4', 2, 'quarter'], ['C4', 1, 'half']]]),
  P02: pairedExample('P02', 'Hello, Down There', [
    { activeHand: 'RH', treble: [['C4', 1, 'quarter'], ['D4', 2, 'quarter'], ['E4', 3, 'half']] },
    { activeHand: 'LH', bass: [['C3', 5, 'quarter'], ['D3', 4, 'quarter'], ['E3', 3, 'half']] },
    { activeHand: 'RH', treble: [['E4', 3, 'quarter'], ['D4', 2, 'quarter'], ['C4', 1, 'half']] },
    { activeHand: 'LH', bass: [['E3', 3, 'quarter'], ['D3', 4, 'quarter'], ['C3', 5, 'half']] }
  ], { tempo: { min: 52, max: 60 }, audioRefs: ['p02-practice', 'p02-musical'] }),
  P03: pairedTimelineExample('P03', 'Across the Keys', [
    pairedMeasure({
      activeHand: 'RH', dynamic: 'p', handEntrances: [entrance('RH', 1, 1)],
      treble: [note('C4', 1, 'quarter', true), note('D4', 2), note('E4', 3, 'half')]
    }),
    pairedMeasure({ activeHand: 'RH', treble: [note('E4', 3), note('D4', 2), note('C4', 1, 'half')] }),
    pairedMeasure({
      activeHand: 'LH', handEntrances: [entrance('LH', 1, 5)],
      bass: [note('C3', 5, 'quarter', true), note('D3', 4), note('E3', 3, 'half')]
    }),
    pairedMeasure({ activeHand: 'LH', bass: [note('E3', 3), note('D3', 4), note('C3', 5, 'half')] }),
    pairedMeasure({
      activeHand: 'RH', dynamic: 'f', handEntrances: [entrance('RH', 1, 1)],
      treble: [note('C4', 1, 'quarter', true), note('E4', 3), note('G4', 5, 'half')]
    }),
    pairedMeasure({
      activeHand: 'LH', handEntrances: [entrance('LH', 1, 5)],
      bass: [note('C3', 5, 'quarter', true), note('E3', 3), note('G3', 1, 'half')]
    }),
    pairedMeasure({
      activeHands: ['LH', 'RH'], handEntrances: [entrance('LH', 1, 5), entrance('RH', 3, 1)],
      treble: [rest('quarter-rest'), rest('quarter-rest'), note('C4', 1, 'quarter', true), note('D4', 2)],
      bass: [note('C3', 5, 'quarter', true), rest('quarter-rest'), rest('quarter-rest'), rest('quarter-rest')]
    }),
    pairedMeasure({ activeHand: 'RH', treble: [note('E4', 3), note('D4', 2), note('C4', 1, 'half')] })
  ], {
    alternatingHands: true, dynamics: { 1: 'p', 5: 'f' }, tempo: { practice: [52, 56], performance: [56, 66] },
    audioRefs: ['p03-rhythm-count', 'p03-sections', 'p03-performance']
  }),
  'C02-025': pairedExample('C02-025', 'Two staves, two entrances', [
    { activeHand: 'RH', treble: [['C4', 1, 'quarter'], ['D4', 2, 'quarter'], ['E4', 3, 'half']] },
    { activeHand: 'LH', bass: [['C3', 5, 'quarter'], ['D3', 4, 'quarter'], ['E3', 3, 'half']] }
  ], { tempo: { min: 54, max: 60 } }),
  'C02-026': chapterTwoExample('C02-026', 'Prepare two entrances', 'treble', 4, [
    ['E4q', 'D4q', 'C4h'], ['C4q', 'D4q', 'E4h']
  ]),
  'C02-027': chapterTwoExample('C02-027', 'Treble steps and a repeat', 'treble', 4, [
    ['G4q', 'F4q', 'E4h'], ['E4q', 'F4q', 'F4q', 'G4q']
  ]),
  'C02-028': chapterTwoExample('C02-028', 'Bass steps in both directions', 'bass', 4, [
    ['F3q', 'G3q', 'F3h'], ['F3q', 'E3q', 'D3q', 'C3q']
  ]),
  'C02-029-T': chapterTwoExample('C02-029-T', 'Treble reading card', 'treble', 4, [
    ['F4q', 'E4q', 'D4h'], ['C4q', 'D4q', 'E4h']
  ]),
  'C02-029-B': chapterTwoExample('C02-029-B', 'Bass reading card', 'bass', 4, [
    ['E3q', 'F3q', 'G3h'], ['G3q', 'F3q', 'E3h']
  ]),
  'C02-030': chapterTwoExample('C02-030', 'Two beats in treble', 'treble', 2, [
    ['C4q', 'D4q'], ['E4h'], ['E4q', 'D4q'], ['C4h']
  ], 'c02-030-model'),
  'C02-031': chapterTwoExample('C02-031', 'Two beats in bass', 'bass', 2, [
    ['C3q', 'rq'], ['D3q', 'E3q'], ['D3q', 'rq'], ['C3h']
  ]),
  'C02-032': chapterTwoExample('C02-032', 'Three beats in treble', 'treble', 3, [
    ['C4h', 'D4q'], ['E4q', 'D4q', 'C4q']
  ], 'c02-032-model'),
  'C02-033': chapterTwoExample('C02-033', 'Hold for four beats', 'bass', 4, [
    ['C3w'], ['D3q', 'E3q', 'D3h'], ['C3w']
  ], 'c02-033-model'),
  'C02-034-T2': chapterTwoExample('C02-034-T2', 'Treble card A', 'treble', 2, [
    ['D4q', 'E4q'], ['D4h']
  ]),
  'C02-034-B3': chapterTwoExample('C02-034-B3', 'Bass card B', 'bass', 3, [
    ['D3q', 'E3h'], ['D3q', 'C3h']
  ]),
  'C02-034-T4': chapterTwoExample('C02-034-T4', 'Treble card C', 'treble', 4, [
    ['C4w'], ['D4h', 'C4h']
  ]),
  'C02-035': chapterTwoExample('C02-035', 'Three steady beats in bass', 'bass', 3, [
    ['F3q', 'E3h'], ['D3q', 'C3h'], ['C3q', 'D3q', 'E3q'], ['F3h', 'E3q']
  ], undefined, { min: 52, max: 62 }),
  'C02-036': chapterTwoExample('C02-036', 'Two beats of silence', 'bass', 4, [
    ['C3q', 'rh', 'D3q'], ['E3h', 'D3q', 'C3q']
  ], 'c02-036-model'),
  'C02-037-A': chapterTwoExample('C02-037-A', 'Card A', 'treble', 4, [
    ['C4q', 'rh', 'C4q']
  ], 'c02-037-a', { min: 56, max: 56, model: 56 }),
  'C02-037-B': chapterTwoExample('C02-037-B', 'Card B', 'treble', 4, [
    ['C4q', 'C4q', 'rh']
  ], 'c02-037-b', { min: 56, max: 56, model: 56 }),
  'C02-038': chapterTwoExample('C02-038', 'An eighth-note pair in treble', 'treble', 2, [
    ['C4e', 'D4e', 'E4q'], ['D4q', 'C4q']
  ], 'c02-038-model', { min: 48, max: 56, model: 52 }),
  'C02-039': chapterTwoExample('C02-039', 'Pairs before a barline', 'treble', 2, [
    ['E4q', 'D4e', 'C4e'], ['D4q', 'E4q'], ['F4q', 'E4e', 'D4e'], ['C4h']
  ], undefined, { min: 48, max: 58 }),
  'C02-040': chapterTwoExample('C02-040', 'An eighth-note pair in bass', 'bass', 2, [
    ['C3e', 'D3e', 'E3q'], ['D3q', 'C3q']
  ], 'c02-040-model', { min: 48, max: 56, model: 52 })
};

function chapterTwoExample(id, title, clef, beats, bars, audioRef, tempo = { min: 52, max: 60, ...(audioRef ? { model: 56 } : {}) }) {
  const fingers = clef === 'bass' ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5];
  const values = { e: 'eighth', q: 'quarter', h: 'half', w: 'whole' };
  const measures = bars.map((bar) => bar.map((token) => {
    if (token === 'rq') return rest('quarter-rest');
    if (token === 'rh') return rest('half-rest');
    const finger = fingers['CDEFG'.indexOf(token[0])];
    return note(token.slice(0, 2), finger, values[token[2]]);
  }));
  return meteredExample(id, title, measures, {
    meter: { beats, beatValue: 4 }, notation: { clef }, hand: clef === 'bass' ? 'LH' : 'RH',
    tempo,
    ...(audioRef ? { audioRef } : {})
  });
}

function meteredExample(id, title, measures, extra = {}) {
  return {
    id, title, meter: { beats: 4, beatValue: 4 }, notation: { clef: 'treble', ...(extra.notation ?? {}) },
    measures: measures.map((events) => ({ events: events.map((event) => Array.isArray(event) ? note(...event) : event) })),
    ...Object.fromEntries(Object.entries(extra).filter(([key]) => key !== 'notation'))
  };
}

function note(pitch, finger, rhythm = 'quarter', showFinger = false) {
  const beats = { eighth: 0.5, quarter: 1, half: 2, whole: 4 }[rhythm];
  return { kind: 'note', pitch, finger, rhythm, beats, ...(showFinger ? { showFinger: true } : {}) };
}

function rest(rhythm) {
  return { kind: 'rest', rhythm, beats: { 'quarter-rest': 1, 'half-rest': 2, 'whole-measure-rest': 4 }[rhythm] };
}

function meteredEvents(id, title, events, extra = {}) {
  return {
    id, title, meter: { beats: 4, beatValue: 4 }, notation: { clef: 'treble', ...(extra.notation ?? {}) },
    measures: [{ events }],
    ...Object.fromEntries(Object.entries(extra).filter(([key]) => key !== 'notation'))
  };
}

function pairedExample(id, title, measures, extra = {}) {
  const rest = () => ({ kind: 'rest', rhythm: 'whole-measure-rest', beats: 4 });
  const notes = (events) => events.map(([pitch, finger, rhythm]) => ({ kind: 'note', pitch, finger, rhythm, beats: rhythm === 'half' ? 2 : 1 }));
  return {
    id, title, kind: 'paired-score', meter: { beats: 4, beatValue: 4 }, notation: { layout: 'paired', upperClef: 'treble', lowerClef: 'bass' },
    measures: measures.map(({ activeHand, treble, bass }) => ({
      activeHand,
      staves: {
        treble: { clef: 'treble', events: treble ? notes(treble) : [rest()] },
        bass: { clef: 'bass', events: bass ? notes(bass) : [rest()] }
      }
    })),
    ...extra
  };
}

function entrance(hand, beat, finger) { return { hand, beat, finger }; }

function pairedMeasure({ activeHand, activeHands, treble, bass, dynamic, handEntrances = [] }) {
  return {
    ...(activeHand ? { activeHand } : {}), ...(activeHands ? { activeHands } : {}), ...(dynamic ? { dynamic } : {}), handEntrances,
    staves: {
      treble: { clef: 'treble', events: treble ?? [rest('whole-measure-rest')] },
      bass: { clef: 'bass', events: bass ?? [rest('whole-measure-rest')] }
    }
  };
}

function pairedTimelineExample(id, title, measures, extra = {}) {
  return {
    id, title, kind: 'paired-score', meter: { beats: 4, beatValue: 4 },
    notation: { layout: 'paired', upperClef: 'treble', lowerClef: 'bass' }, measures, ...extra
  };
}
