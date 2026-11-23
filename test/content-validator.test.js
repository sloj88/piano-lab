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
  const second = structuredClone(fixture.sessions[0]);
  second.id = '002';
  second.prerequisites = ['002', '999'];
  fixture.sessions.push(second);
  const result = validateCurriculum(fixture);
  assert.equal(errorCodes(result).includes('prerequisite-order'), true);
  assert.equal(errorCodes(result).includes('prerequisite-reference'), true);
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
    measures: [{ events: [{ pitch: 'H4', rhythm: 'banana', beats: 3 }] }]
  };
  fixture.sessions[0].musicRefs.push('BAD');
  const codes = errorCodes(validateCurriculum(fixture));
  assert.equal(codes.includes('pitch'), true);
  assert.equal(codes.includes('rhythm'), true);
  assert.equal(codes.includes('measure-total'), true);
});

test('assertValidCurriculum identifies schema failures distinctly from runtime failures', () => {
  const fixture = catalogs();
  fixture.sessions[0].steps = [];
  assert.throws(() => assertValidCurriculum(fixture), (error) => error instanceof ContentValidationError && error.category === 'schema');
});
