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
  P02: pairedExample('P02', 'Hello, Down There', [
    { activeHand: 'RH', treble: [['C4', 1, 'quarter'], ['D4', 2, 'quarter'], ['E4', 3, 'half']] },
    { activeHand: 'LH', bass: [['C3', 5, 'quarter'], ['D3', 4, 'quarter'], ['E3', 3, 'half']] },
    { activeHand: 'RH', treble: [['E4', 3, 'quarter'], ['D4', 2, 'quarter'], ['C4', 1, 'half']] },
    { activeHand: 'LH', bass: [['E3', 3, 'quarter'], ['D3', 4, 'quarter'], ['C3', 5, 'half']] }
  ], { tempo: { min: 52, max: 60 }, audioRefs: ['p02-practice', 'p02-musical'] })
};

function meteredExample(id, title, measures, extra = {}) {
  return {
    id, title, meter: { beats: 4, beatValue: 4 }, notation: { clef: 'treble', ...(extra.notation ?? {}) },
    measures: measures.map((events) => ({ events: events.map(([pitch, finger, rhythm]) => ({ kind: 'note', pitch, finger, rhythm, beats: rhythm === 'half' ? 2 : 1 })) })),
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
