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
  }
};
