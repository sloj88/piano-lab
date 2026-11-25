import test from 'node:test';
import assert from 'node:assert/strict';
import { musicLibrary } from '../js/music-library.js';
import { assetCatalog, sessionCatalog } from '../js/session-catalog.js';

const eventShape = (event) => [event.kind, event.pitch ?? null, event.rhythm, event.beats, event.finger ?? null];

test('Sessions 017–020 are consecutive and use the approved types', () => {
  const sessions = sessionCatalog.slice(16, 20);
  assert.deepEqual(sessions.map(({ id }) => id), ['017', '018', '019', '020']);
  assert.deepEqual(sessions.map(({ type }) => type), ['Learn', 'Review', 'Learn', 'Learn']);
  assert.deepEqual(sessions[0].musicRefs, ['R003', 'R003-A', 'R003-B']);
  assert.ok(sessions.every(({ duration }) => duration.min >= 10 && duration.max <= 15));
});

test('R003 preserves the approved quarter-rest timing and pitches', () => {
  assert.deepEqual(musicLibrary['R003-A'].measures[0].events.map(eventShape), [
    ['note', 'C4', 'quarter', 1, 1], ['rest', null, 'quarter-rest', 1, null],
    ['note', 'D4', 'quarter', 1, 2], ['note', 'E4', 'quarter', 1, 3]
  ]);
  assert.deepEqual(musicLibrary['R003-B'].measures[0].events.map(eventShape), [
    ['note', 'C4', 'half', 2, 1], ['rest', null, 'quarter-rest', 1, null],
    ['note', 'C4', 'quarter', 1, 1]
  ]);
});

test('R004 A–E exactly preserve approved hand, pitch, duration, and rest data', () => {
  const compact = (id) => musicLibrary[id].measures.map(({ events }) => events.map(({ kind, pitch, rhythm }) => [kind, pitch ?? null, rhythm]));
  assert.deepEqual(compact('R004-A'), [[['note', 'C4', 'quarter'], ['note', 'C4', 'quarter'], ['note', 'C4', 'half']]]);
  assert.deepEqual(compact('R004-B'), [[['note', 'C3', 'half'], ['note', 'D3', 'quarter'], ['note', 'E3', 'quarter']]]);
  assert.deepEqual(compact('R004-C'), [[['note', 'C4', 'quarter'], ['rest', null, 'quarter-rest'], ['note', 'D4', 'quarter'], ['note', 'E4', 'quarter']]]);
  assert.deepEqual(compact('R004-D'), [[['note', 'C3', 'quarter'], ['note', 'D3', 'half'], ['note', 'C3', 'quarter']]]);
  assert.equal(musicLibrary['R004-E'].measures.length, 2);
});

test('D001 and metered M001/C001 match the approved models and local audio references', () => {
  assert.deepEqual(musicLibrary.D001.groups.map(({ dynamic, events }) => [dynamic, events.length]), [['p', 4], ['f', 4]]);
  assert.equal(assetCatalog[musicLibrary.D001.audioRef].src, 'assets/audio/d001-soft-strong.wav');
  assert.deepEqual(musicLibrary['M001-METERED'].measures.flatMap(({ events }) => events.map(({ pitch, rhythm }) => [pitch, rhythm])), [
    ['C4', 'quarter'], ['D4', 'quarter'], ['E4', 'half'], ['G4', 'quarter'], ['E4', 'quarter'], ['D4', 'quarter'], ['C4', 'quarter']
  ]);
  assert.deepEqual(musicLibrary['C001-A'].measures[0].events.map(({ pitch, rhythm }) => [pitch, rhythm]), [['E4', 'quarter'], ['D4', 'quarter'], ['C4', 'half']]);
  assert.deepEqual(musicLibrary['C001-B'].measures[0].events.map(({ pitch, rhythm }) => [pitch, rhythm]), [['C4', 'quarter'], ['D4', 'quarter'], ['C4', 'half']]);
  for (const ref of ['m001-even', 'm001-shaped', 'c001-question-answer']) assert.ok(assetCatalog[ref]?.src.startsWith('assets/audio/'));
});

test('Sessions 017–020 retain physical practice, separate reflection, support, and optional work', () => {
  for (const session of sessionCatalog.slice(16, 20)) {
    assert.ok(session.steps.some(({ blocks }) => blocks.some(({ type }) => type === 'practice')), session.id);
    assert.ok(session.reflection.understanding, session.id);
    assert.ok(session.reflection.playing, session.id);
    assert.ok(session.reinforcementRefs.length, session.id);
    assert.ok(session.keepPlaying.length, session.id);
  }
});
