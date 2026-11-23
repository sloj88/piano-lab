export const musicLibrary = {
  K001: {
    id: 'K001',
    title: 'Right-hand five-note walk',
    meter: null,
    events: [
      ['C4', 1], ['D4', 2], ['E4', 3], ['F4', 4], ['G4', 5],
      ['F4', 4], ['E4', 3], ['D4', 2], ['C4', 1]
    ].map(([pitch, finger]) => ({ pitch, finger, rhythm: 'pulse' }))
  },
  M001: {
    id: 'M001',
    title: 'Published first melody',
    meter: null,
    events: [
      ['C4', 1], ['D4', 2], ['E4', 3], ['G4', 5], ['E4', 3], ['D4', 2], ['C4', 1]
    ].map(([pitch, finger]) => ({ pitch, finger, rhythm: 'pulse' }))
  }
};
