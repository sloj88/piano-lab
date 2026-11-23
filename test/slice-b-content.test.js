import test from 'node:test';
import assert from 'node:assert/strict';
import { musicLibrary } from '../js/music-library.js';
import { sessionCatalog } from '../js/session-catalog.js';

const sequence = (id) => musicLibrary[id].measures.map((measure) => measure.events.map(({ pitch, rhythm, finger }) => [pitch, rhythm, finger]));

test('Sessions 005–010 are consecutive and use the approved types and prerequisites', () => {
  const sessions = sessionCatalog.slice(4);
  assert.deepEqual(sessions.map(({ id }) => id), ['005', '006', '007', '008', '009', '010']);
  assert.deepEqual(sessions.map(({ type }) => type), ['Learn', 'Practice', 'Learn', 'Learn', 'Practice', 'Play']);
  assert.deepEqual(sessions.map(({ prerequisites }) => prerequisites), [
    ['003'], ['005'], ['001'], ['007'], ['005', '008'], ['005', '009']
  ]);
});

test('R001 and core R002 examples preserve approved four-beat rhythms', () => {
  assert.deepEqual(sequence('R001-A')[0].map(([pitch, rhythm]) => [pitch, rhythm]), [['C4', 'quarter'], ['C4', 'quarter'], ['C4', 'half']]);
  assert.deepEqual(sequence('R001-D')[0].map(([pitch, rhythm]) => [pitch, rhythm]), [['C4', 'half'], ['C4', 'half']]);
  assert.deepEqual(sequence('R002-B')[0].map(([pitch, rhythm]) => [pitch, rhythm]), [['C4', 'half'], ['D4', 'quarter'], ['C4', 'quarter']]);
  assert.equal(musicLibrary['R002-D'].measures.length, 2);
  for (const id of ['R001-A', 'R001-B', 'R001-C', 'R001-D', 'R002-A', 'R002-B', 'R002-C', 'R002-D']) {
    for (const measure of musicLibrary[id].measures) assert.equal(measure.events.reduce((total, event) => total + event.beats, 0), 4, id);
  }
});

test('staff contour and landmark examples preserve approved pitch relationships', () => {
  assert.deepEqual(musicLibrary['N001-A'].notation.staffSteps, [0, 0, 1, 2]);
  assert.deepEqual(sequence('N002-A')[0], [['C4', 'quarter', 1], ['G4', 'quarter', 5], ['C4', 'half', 1]]);
  assert.deepEqual(sequence('N003-A')[0].map(([pitch]) => pitch), ['C4', 'D4', 'E4', 'D4']);
  assert.deepEqual(sequence('N003-D')[0].map(([pitch]) => pitch), ['D4', 'C4', 'D4', 'E4']);
});

test('Session 010 Three-Step Walk exactly matches the approved phrase', () => {
  assert.deepEqual(sequence('P01'), [
    [['C4', 'quarter', 1], ['D4', 'quarter', 2], ['E4', 'half', 3]],
    [['E4', 'quarter', 3], ['D4', 'quarter', 2], ['C4', 'half', 1]],
    [['C4', 'quarter', 1], ['C4', 'quarter', 1], ['D4', 'quarter', 2], ['E4', 'quarter', 3]],
    [['D4', 'quarter', 2], ['C4', 'quarter', 1], ['C4', 'half', 1]]
  ]);
  assert.deepEqual(musicLibrary.P01.tempo, { min: 56, max: 64 });
  assert.deepEqual(musicLibrary.P01.audioRefs, ['p01-practice', 'p01-musical']);
});

test('each new session includes physical practice, independent reflection, support, and optional work', () => {
  for (const session of sessionCatalog.slice(4)) {
    assert.equal(session.steps.some(({ blocks }) => blocks.some(({ type }) => type === 'practice')), true, session.id);
    assert.ok(session.reflection.understanding);
    assert.ok(session.reflection.playing);
    assert.ok(session.keepPlaying.length);
    assert.ok(session.readiness.practicing.reinforcementRefs?.length);
    assert.ok(session.readiness.stuck.reinforcementRefs?.length);
  }
});
