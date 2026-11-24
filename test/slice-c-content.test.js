import test from 'node:test';
import assert from 'node:assert/strict';
import { musicLibrary } from '../js/music-library.js';
import { sessionCatalog } from '../js/session-catalog.js';

const compact = (events) => events.map(({ kind, pitch, rhythm, finger, hand, beats }) => ({ kind, pitch, rhythm, finger, hand, beats }));

test('Sessions 011–016 are consecutive with approved types and prerequisites', () => {
  const sessions = sessionCatalog.slice(10, 16);
  assert.deepEqual(sessions.map(({ id }) => id), ['011', '012', '013', '014', '015', '016']);
  assert.deepEqual(sessions.map(({ type }) => type), ['Learn', 'Practice', 'Learn', 'Practice', 'Learn', 'Play']);
  assert.deepEqual(sessions.map(({ prerequisites }) => prerequisites), [
    ['001'], ['003', '011'], ['007', '011'], ['005', '013'], ['003', '009', '014'], ['005', '009', '014', '015']
  ]);
});

test('K002 preserves the approved left-hand walk and fingering', () => {
  assert.deepEqual(musicLibrary.K002.events.map(({ pitch, finger }) => [pitch, finger]), [
    ['C3', 5], ['D3', 4], ['E3', 3], ['F3', 2], ['G3', 1],
    ['F3', 2], ['E3', 3], ['D3', 4], ['C3', 5]
  ]);
});

test('E002 contains the exact three pitch echoes and local audio references', () => {
  assert.deepEqual(musicLibrary.E002.echoes, [
    { id: 'A', pitches: ['C3', 'D3', 'E3'], directions: ['up', 'up'], audioRef: 'e002-a' },
    { id: 'B', pitches: ['E3', 'D3', 'C3'], directions: ['down', 'down'], audioRef: 'e002-b' },
    { id: 'C', pitches: ['C3', 'C3', 'D3'], directions: ['repeat', 'up'], audioRef: 'e002-c' }
  ]);
});

test('N004 and N005 preserve approved bass pitches, rhythms, and fingerings', () => {
  assert.deepEqual(compact(musicLibrary['N004-A'].measures[0].events).map(({ pitch, rhythm, finger }) => [pitch, rhythm, finger]), [
    ['C3', 'quarter', 5], ['F3', 'quarter', 2], ['C3', 'half', 5]
  ]);
  assert.deepEqual(compact(musicLibrary['N005-A'].measures[0].events).map(({ pitch, finger }) => [pitch, finger]), [['C3', 5], ['D3', 4], ['E3', 3], ['D3', 4]]);
  assert.deepEqual(compact(musicLibrary['N005-D'].measures[0].events).map(({ pitch }) => pitch), ['D3', 'C3', 'D3', 'E3']);
  for (const id of ['N004-A', 'N004-B', 'N005-A', 'N005-B', 'N005-C', 'N005-D']) assert.equal(musicLibrary[id].notation.clef, 'bass');
});

test('H001 assigns every beat to exactly one approved hand and pitch', () => {
  assert.deepEqual(musicLibrary.H001.measures.map(({ events }) => events.map(({ hand, pitch, finger }) => [hand, pitch, finger])), [
    [['LH', 'C3', 5], ['RH', 'C4', 1], ['LH', 'C3', 5], ['RH', 'C4', 1]],
    [['LH', 'D3', 4], ['RH', 'D4', 2], ['LH', 'E3', 3], ['RH', 'E4', 3]]
  ]);
  assert.deepEqual(musicLibrary.H001.tempo, { min: 48, max: 56 });
});

test('P02 exactly alternates the approved notes by measure with complete inactive-staff rests', () => {
  const expected = [
    ['RH', 'treble', [['C4', 'quarter', 1], ['D4', 'quarter', 2], ['E4', 'half', 3]]],
    ['LH', 'bass', [['C3', 'quarter', 5], ['D3', 'quarter', 4], ['E3', 'half', 3]]],
    ['RH', 'treble', [['E4', 'quarter', 3], ['D4', 'quarter', 2], ['C4', 'half', 1]]],
    ['LH', 'bass', [['E3', 'quarter', 3], ['D3', 'quarter', 4], ['C3', 'half', 5]]]
  ];
  musicLibrary.P02.measures.forEach((measure, index) => {
    const [hand, activeStaff, notes] = expected[index];
    const inactiveStaff = activeStaff === 'treble' ? 'bass' : 'treble';
    assert.equal(measure.activeHand, hand);
    assert.deepEqual(measure.staves[activeStaff].events.map(({ pitch, rhythm, finger }) => [pitch, rhythm, finger]), notes);
    assert.deepEqual(measure.staves[inactiveStaff].events, [{ kind: 'rest', rhythm: 'whole-measure-rest', beats: 4 }]);
    for (const staff of Object.values(measure.staves)) assert.equal(staff.events.reduce((total, event) => total + event.beats, 0), 4);
  });
  assert.deepEqual(musicLibrary.P02.tempo, { min: 52, max: 60 });
});

test('every new session retains physical practice, separate reflections, support, and optional work', () => {
  for (const session of sessionCatalog.slice(10, 16)) {
    assert.equal(session.steps.some(({ blocks }) => blocks.some(({ type }) => type === 'practice')), true, session.id);
    assert.ok(session.reflection.understanding);
    assert.ok(session.reflection.playing);
    assert.ok(session.keepPlaying.length);
    assert.ok(session.readiness.practicing.reinforcementRefs?.length);
    assert.ok(session.readiness.stuck.reinforcementRefs?.length);
  }
});
