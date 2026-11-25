import test from 'node:test';
import assert from 'node:assert/strict';
import { musicLibrary } from '../js/music-library.js';
import { sessionCatalog } from '../js/session-catalog.js';

function compactStaff(events) {
  return events.map(({ kind, pitch, rhythm, beats, finger }) => ({ kind, pitch: pitch ?? null, rhythm, beats, finger: finger ?? null }));
}

test('Sessions 021–024 complete Chapter 01 with the approved types and timing', () => {
  const sessions = sessionCatalog.slice(20, 24);
  assert.deepEqual(sessions.map(({ id }) => id), ['021', '022', '023', '024']);
  assert.deepEqual(sessions.map(({ type }) => type), ['Practice', 'Play', 'Review', 'Play']);
  assert.deepEqual(sessions[3].duration, { min: 14, max: 14 });
  assert.ok(sessions.every(({ chapter }) => chapter === 1));
  assert.equal(sessionCatalog.filter(({ chapter }) => chapter === 1).length, 24);
});

test('P03 Across the Keys has the exact eight approved measures and dynamics', () => {
  const piece = musicLibrary.P03;
  assert.equal(piece.title, 'Across the Keys');
  assert.deepEqual(piece.meter, { beats: 4, beatValue: 4 });
  assert.equal(piece.measures.length, 8);
  assert.deepEqual(piece.dynamics, { 1: 'p', 5: 'f' });
  assert.deepEqual(piece.tempo, { practice: [52, 56], performance: [56, 66] });

  const sounding = piece.measures.map((measure) => ['treble', 'bass'].flatMap((staff) => measure.staves[staff].events.filter(({ kind }) => kind === 'note').map(({ pitch, rhythm, finger }) => [staff, pitch, rhythm, finger])));
  assert.deepEqual(sounding, [
    [['treble', 'C4', 'quarter', 1], ['treble', 'D4', 'quarter', 2], ['treble', 'E4', 'half', 3]],
    [['treble', 'E4', 'quarter', 3], ['treble', 'D4', 'quarter', 2], ['treble', 'C4', 'half', 1]],
    [['bass', 'C3', 'quarter', 5], ['bass', 'D3', 'quarter', 4], ['bass', 'E3', 'half', 3]],
    [['bass', 'E3', 'quarter', 3], ['bass', 'D3', 'quarter', 4], ['bass', 'C3', 'half', 5]],
    [['treble', 'C4', 'quarter', 1], ['treble', 'E4', 'quarter', 3], ['treble', 'G4', 'half', 5]],
    [['bass', 'C3', 'quarter', 5], ['bass', 'E3', 'quarter', 3], ['bass', 'G3', 'half', 1]],
    [['treble', 'C4', 'quarter', 1], ['treble', 'D4', 'quarter', 2], ['bass', 'C3', 'quarter', 5]],
    [['treble', 'E4', 'quarter', 3], ['treble', 'D4', 'quarter', 2], ['treble', 'C4', 'half', 1]]
  ]);
});

test('P03 Measure 7 explicitly accounts for both staff timelines without overlap', () => {
  const measure = musicLibrary.P03.measures[6];
  assert.deepEqual(measure.activeHands, ['LH', 'RH']);
  assert.deepEqual(measure.handEntrances, [{ hand: 'LH', beat: 1, finger: 5 }, { hand: 'RH', beat: 3, finger: 1 }]);
  assert.deepEqual(compactStaff(measure.staves.treble.events), [
    { kind: 'rest', pitch: null, rhythm: 'quarter-rest', beats: 1, finger: null },
    { kind: 'rest', pitch: null, rhythm: 'quarter-rest', beats: 1, finger: null },
    { kind: 'note', pitch: 'C4', rhythm: 'quarter', beats: 1, finger: 1 },
    { kind: 'note', pitch: 'D4', rhythm: 'quarter', beats: 1, finger: 2 }
  ]);
  assert.deepEqual(compactStaff(measure.staves.bass.events), [
    { kind: 'note', pitch: 'C3', rhythm: 'quarter', beats: 1, finger: 5 },
    { kind: 'rest', pitch: null, rhythm: 'quarter-rest', beats: 1, finger: null },
    { kind: 'rest', pitch: null, rhythm: 'quarter-rest', beats: 1, finger: null },
    { kind: 'rest', pitch: null, rhythm: 'quarter-rest', beats: 1, finger: null }
  ]);
});

test('Session 023 includes every approved retrieval item without scores or mastery gates', () => {
  const session = sessionCatalog[22];
  for (const reference of ['E001', 'N003-D', 'N005-D', 'R003-C', 'M001-METERED', 'P03']) assert.ok(session.musicRefs.includes(reference), reference);
  const copy = JSON.stringify(session);
  assert.doesNotMatch(copy, /"score"\s*:|"grade"\s*:|"percentage"\s*:/i);
  assert.match(copy, /no timer, grade, score, or mastery gate/i);
  assert.match(copy, /Reveal/);
});

test('Session 024 integrates every milestone area and preserves separate readiness from completion', () => {
  const session = sessionCatalog[23];
  const copy = JSON.stringify(session);
  for (const phrase of ['Find landmarks', 'Read treble and bass', 'mixed rhythm', 'listening task', 'Perform Across the Keys', 'Understanding, playing, and readiness']) assert.match(copy, new RegExp(phrase, 'i'));
  assert.match(copy, /You can still complete the chapter/);
  assert.match(copy, /three-piece mini-recital/);
  assert.ok(session.reflection.understanding);
  assert.ok(session.reflection.playing);
  assert.deepEqual(Object.keys(session.readiness), ['ready', 'practicing', 'stuck']);
});

test('Sessions 021–024 retain physical practice, reflections, support, and optional playing', () => {
  for (const session of sessionCatalog.slice(20, 24)) {
    assert.ok(session.steps.some(({ blocks }) => blocks.some(({ type }) => type === 'practice')), session.id);
    assert.ok(session.steps.every(({ blocks }) => blocks.some(({ type }) => type === 'reflection')), session.id);
    assert.ok(session.reinforcementRefs.length, session.id);
    assert.ok(session.keepPlaying.length, session.id);
  }
});
