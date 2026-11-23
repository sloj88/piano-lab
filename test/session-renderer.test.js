import test from 'node:test';
import assert from 'node:assert/strict';
import { musicLibrary } from '../js/music-library.js';
import { reinforcementCatalog } from '../js/reinforcements.js';
import { sessionCatalog } from '../js/session-catalog.js';
import { createEmptySessionProgress } from '../js/session-progress.js';
import { renderBlock, renderSessionStep, renderStepNavigation } from '../js/session-renderer.js';

const session = sessionCatalog[0];
const state = () => createEmptySessionProgress(sessionCatalog).sessions['001'];

test('Session 001 renders the published Explain, Demonstrate, Try, and Reflect experience', () => {
  const html = renderSessionStep(session, 0, state(), { music: musicLibrary, reinforcements: reinforcementCatalog });
  assert.match(html, /Discover the keyboard/);
  assert.match(html, /groups of <strong>two<\/strong> and <strong>three<\/strong>/);
  assert.match(html, /Explain/);
  assert.match(html, /Demonstrate/);
  assert.match(html, /Try it on your piano/);
  assert.match(html, /Reflect/);
  assert.match(html, /I understand it/);
  assert.match(html, /I can play it/);
});

test('the final step renders the original melody plus optional and readiness content', () => {
  const html = renderSessionStep(session, 4, state(), { music: musicLibrary, reinforcements: reinforcementCatalog });
  assert.match(html, /C–D–E–G–E–D–C/);
  assert.match(html, /Keep Playing/);
  assert.match(html, /Session check-in/);
  assert.match(html, /Ready/);
  assert.match(html, /Practicing/);
  assert.match(html, /Stuck/);
  assert.match(html, /Mark core complete/);
});

test('step navigation retains prior checks without treating them as session completion', () => {
  const progress = state();
  progress.stepAssessments['discover-keyboard'] = { understands: true, canPlay: true };
  const html = renderStepNavigation(session, progress);
  assert.match(html, /<span>✓<\/span>/);
  assert.equal(progress.completed, false);
});

test('unsupported runtime blocks fail distinctly at render time', () => {
  assert.throws(() => renderBlock({ type: 'unknown' }, {}), /Unsupported content block type/);
});
