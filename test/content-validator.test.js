import test from 'node:test';
import assert from 'node:assert/strict';
import { ContentValidationError, assertValidCurriculum, validateCurriculum } from '../js/content-validator.js';
import { assetCatalog, sessionCatalog } from '../js/session-catalog.js';
import { musicLibrary } from '../js/music-library.js';
import { reinforcementCatalog } from '../js/reinforcements.js';

const catalogs = () => structuredClone({ sessions: sessionCatalog, reinforcements: reinforcementCatalog, music: musicLibrary, assets: assetCatalog });
const errorCodes = (result) => result.errors.map(({ code }) => code);

test('the populated learner catalog passes schema validation without treating educator review as an error', () => {
  const result = validateCurriculum(catalogs());
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.warnings.some(({ category }) => category === 'pedagogical'), true);
});

test('duplicate, non-sequential, and invalid session metadata fail schema validation', () => {
  const fixture = catalogs();
  const duplicate = structuredClone(fixture.sessions[0]);
  duplicate.type = 'Lecture';
  duplicate.duration = { min: 40, max: 5 };
  fixture.sessions.push(duplicate);
  const result = validateCurriculum(fixture);
  assert.equal(result.valid, false);
  assert.equal(errorCodes(result).includes('duplicate-session'), true);
  assert.equal(errorCodes(result).includes('session-sequence'), true);
  assert.equal(errorCodes(result).includes('session-type'), true);
  assert.equal(errorCodes(result).includes('duration'), true);
});

test('prerequisites must exist and come before their session', () => {
  const fixture = catalogs();
  fixture.sessions[4].prerequisites = ['010', '999'];
  const result = validateCurriculum(fixture);
  assert.equal(errorCodes(result).includes('prerequisite-order'), true);
  assert.equal(errorCodes(result).includes('prerequisite-reference'), true);
});

test('notation relationships, reference sets, and required audio are validated', () => {
  const fixture = catalogs();
  fixture.music['N001-A'].notation.staffSteps[3] = 7;
  fixture.music['N002-A'].notation.clef = 'alto';
  fixture.music.R001.refs.push('MISSING');
  fixture.music['R002-A'].countedAudioRef = 'missing-audio';
  const codes = errorCodes(validateCurriculum(fixture));
  assert.equal(codes.includes('staff-pitch-relationship'), true);
  assert.equal(codes.includes('notation-clef'), true);
  assert.equal(codes.includes('music-set-reference'), true);
  assert.equal(codes.includes('audio-reference'), true);
});

test('optional Keep Playing blocks receive the same reference validation', () => {
  const fixture = catalogs();
  fixture.sessions[5].keepPlayingBlocks[0].musicRefs = ['MISSING'];
  const codes = errorCodes(validateCurriculum(fixture));
  assert.equal(codes.includes('music-reference'), true);
  assert.equal(codes.includes('block-music-type'), true);
});

test('content blocks and asset, music, and reinforcement references must be recognized', () => {
  const fixture = catalogs();
  fixture.sessions[0].steps[0].blocks.push({ type: 'hologram', assetRef: 'missing-asset', musicRef: 'missing-music' });
  fixture.sessions[0].reinforcementRefs.push('RF-MISSING');
  const codes = errorCodes(validateCurriculum(fixture));
  assert.equal(codes.includes('block-type'), true);
  assert.equal(codes.includes('asset-reference'), true);
  assert.equal(codes.includes('music-reference'), true);
  assert.equal(codes.includes('reinforcement-reference'), true);
});

test('music validation rejects invalid pitches, rhythms, and measure totals', () => {
  const fixture = catalogs();
  fixture.music.BAD = {
    id: 'BAD', meter: { beats: 4, beatValue: 4 },
    measures: [{ events: [{ kind: 'note', pitch: 'H4', rhythm: 'banana', beats: 3 }] }]
  };
  fixture.sessions[0].musicRefs.push('BAD');
  const codes = errorCodes(validateCurriculum(fixture));
  assert.equal(codes.includes('pitch'), true);
  assert.equal(codes.includes('rhythm'), true);
  assert.equal(codes.includes('measure-total'), true);
});

test('music events require compatible note or rest fields', () => {
  const fixture = catalogs();
  fixture.music.MALFORMED = {
    id: 'MALFORMED', meter: null,
    events: [
      null,
      { pitch: 'E4', rhythm: 'quarter' },
      { kind: 'note', rhythm: 'quarter' },
      { kind: 'note', pitch: 'C4' },
      { kind: 'note', pitch: 'D4', finger: 9, rhythm: 'quarter' },
      { kind: 'note', pitch: 'C4', rhythm: 'quarter-rest' },
      { kind: 'rest', pitch: 'D4', finger: 2, rhythm: 'quarter' },
      { kind: 'rest', rhythm: 'whole-measure-rest' }
    ]
  };
  const codes = errorCodes(validateCurriculum(fixture));
  assert.equal(codes.includes('event-shape'), true);
  assert.equal(codes.includes('event-kind'), true);
  assert.equal(codes.includes('pitch-required'), true);
  assert.equal(codes.includes('rhythm-required'), true);
  assert.equal(codes.includes('finger'), true);
  assert.equal(codes.includes('rhythm-meter'), true);
  assert.equal(codes.includes('event-incompatible'), true);
  assert.equal(codes.includes('rest-pitch'), true);
  assert.equal(codes.includes('rest-finger'), true);
});

test('metered events require beat durations compatible with their rhythms', () => {
  const fixture = catalogs();
  fixture.music.METERED = {
    id: 'METERED', meter: { beats: 4, beatValue: 4 },
    measures: [{ events: [
      { kind: 'note', pitch: 'C4', rhythm: 'quarter' },
      { kind: 'rest', rhythm: 'quarter-rest', beats: 2 },
      { kind: 'note', pitch: 'D4', rhythm: 'pulse', beats: 2 }
    ] }]
  };
  const codes = errorCodes(validateCurriculum(fixture));
  assert.equal(codes.includes('beats-required'), true);
  assert.equal(codes.includes('rhythm-beats'), true);
  assert.equal(codes.includes('rhythm-meter'), true);
});

test('polyphonic fixtures are rejected without monophonic beat summing', () => {
  const fixture = catalogs();
  fixture.music.POLY = {
    id: 'POLY', meter: { beats: 4, beatValue: 4 },
    measures: [{ voices: [
      { id: 'upper', events: [{ kind: 'note', pitch: 'C4', rhythm: 'half', beats: 2 }, { kind: 'note', pitch: 'E4', rhythm: 'half', beats: 2 }] },
      { id: 'lower', events: [{ kind: 'note', pitch: 'C3', rhythm: 'half', beats: 2 }, { kind: 'note', pitch: 'E3', rhythm: 'half', beats: 2 }] }
    ] }]
  };
  const result = validateCurriculum(fixture);
  const polyIssues = result.errors.filter(({ path }) => path.startsWith('music.POLY'));
  assert.deepEqual(polyIssues.map(({ code }) => code), ['polyphony-unsupported']);
});

test('assertValidCurriculum identifies schema failures distinctly from runtime failures', () => {
  const fixture = catalogs();
  fixture.sessions[0].steps = [];
  assert.throws(() => assertValidCurriculum(fixture), (error) => error instanceof ContentValidationError && error.category === 'schema');
});

test('listening answers, pitch data, pair references, and local audio references are validated', () => {
  const fixture = catalogs();
  fixture.music.E001.pairs[0].answer = 'different';
  fixture.music.E001.pairs[1].first[0] = 'H4';
  fixture.music.E001.pairs[2].audioRef = 'missing-audio';
  fixture.sessions[1].steps[2].blocks.find(({ type }) => type === 'audio-listening').pairIds.push('Z');
  const codes = errorCodes(validateCurriculum(fixture));
  assert.equal(codes.includes('listening-answer-data'), true);
  assert.equal(codes.includes('pitch'), true);
  assert.equal(codes.includes('audio-reference'), true);
  assert.equal(codes.includes('listening-pair-reference'), true);
});

test('pulse guide shape and tempo metadata are validated', () => {
  const fixture = catalogs();
  fixture.music.P001.beats = 15;
  fixture.music.P001.bpm = 0;
  const codes = errorCodes(validateCurriculum(fixture));
  assert.equal(codes.includes('pulse-shape'), true);
  assert.equal(codes.includes('pulse-tempo'), true);
});

test('paired scores validate staff timing independently and reject malformed active or waiting staves', () => {
  const fixture = catalogs();
  fixture.music.P02.measures[0].staves.bass.events = [{ kind: 'rest', rhythm: 'quarter-rest', beats: 1 }];
  fixture.music.P02.measures[1].staves.bass.events[0].beats = 3;
  fixture.music.P02.measures[2].activeHand = 'XX';
  delete fixture.music.P02.measures[3].staves.treble;
  const codes = errorCodes(validateCurriculum(fixture));
  assert.equal(codes.includes('staff-total'), true);
  assert.equal(codes.includes('inactive-staff-rest'), true);
  assert.equal(codes.includes('rhythm-beats'), true);
  assert.equal(codes.includes('active-hand'), true);
  assert.equal(codes.includes('paired-staff'), true);
});

test('hand-pattern assignments and pitch-echo metadata are validated', () => {
  const fixture = catalogs();
  fixture.music.H001.measures[0].events[0].hand = 'both';
  fixture.music.H001.measures[1].events.pop();
  fixture.music.E002.echoes[0].directions = ['sideways'];
  fixture.music.E002.echoes[1].audioRef = 'missing';
  const codes = errorCodes(validateCurriculum(fixture));
  assert.equal(codes.includes('hand-assignment'), true);
  assert.equal(codes.includes('measure-total'), true);
  assert.equal(codes.includes('echo-directions'), true);
  assert.equal(codes.includes('audio-reference'), true);
});
