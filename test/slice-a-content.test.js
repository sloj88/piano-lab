import test from 'node:test';
import assert from 'node:assert/strict';
import { musicLibrary } from '../js/music-library.js';
import { sessionCatalog } from '../js/session-catalog.js';

test('Slice A exposes exactly four consecutive approved session types', () => {
  assert.deepEqual(sessionCatalog.slice(0, 4).map(({ id }) => id), ['001', '002', '003', '004']);
  assert.deepEqual(sessionCatalog.slice(0, 4).map(({ type }) => type), ['Learn', 'Review', 'Learn', 'Practice']);
  assert.deepEqual(sessionCatalog[1].prerequisites, ['001']);
  assert.deepEqual(sessionCatalog[2].prerequisites, []);
  assert.deepEqual(sessionCatalog[3].prerequisites, ['001', '003']);
});

test('E001 listening answers and pitch sequences match the approved specification', () => {
  assert.deepEqual(musicLibrary.E001.pairs.map(({ id, answer, first, second }) => ({ id, answer, first, second })), [
    { id: 'A', answer: 'same', first: ['C4', 'D4', 'E4'], second: ['C4', 'D4', 'E4'] },
    { id: 'B', answer: 'different', first: ['C4', 'E4', 'D4'], second: ['C4', 'D4', 'E4'] },
    { id: 'C', answer: 'same', first: ['G4', 'E4', 'C4'], second: ['G4', 'E4', 'C4'] }
  ]);
});

test('K001 retains the approved C4–G4 right-hand pattern and fingering', () => {
  assert.deepEqual(musicLibrary.K001.events.map(({ pitch, finger }) => [pitch, finger]), [
    ['C4', 1], ['D4', 2], ['E4', 3], ['F4', 4], ['G4', 5],
    ['F4', 4], ['E4', 3], ['D4', 2], ['C4', 1]
  ]);
  assert.deepEqual(musicLibrary.P001, { id: 'P001', title: 'Sixteen steady beats', kind: 'pulse-guide', beats: 16, groupSize: 4, bpm: 60 });
});

test('every Slice A session includes physical practice, separate reflections, and optional extension content', () => {
  for (const session of sessionCatalog.slice(0, 4)) {
    assert.equal(session.steps.some(({ blocks }) => blocks.some(({ type }) => type === 'practice')), true, session.id);
    assert.ok(session.reflection.understanding);
    assert.ok(session.reflection.playing);
    assert.ok(session.keepPlaying.length);
  }
});
