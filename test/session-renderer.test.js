import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { musicLibrary } from '../js/music-library.js';
import { reinforcementCatalog } from '../js/reinforcements.js';
import { assetCatalog, sessionCatalog } from '../js/session-catalog.js';
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
  assert.match(html, /Finish for today/);
  assert.match(html, /Continue to next session/);
  assert.ok(html.indexOf('Keep Playing') < html.indexOf('Choose what happens next'));
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

test('the page shell labels assessment, position, and completion separately', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, />Self-assessment</);
  assert.match(html, /id="session-position-summary"/);
  assert.match(html, /id="session-completion-summary"/);
  assert.match(html, /aria-label="Session self-assessment progress"/);
});

test('Session 002 renders user-initiated listening controls with hidden accurate reveals', () => {
  const review = sessionCatalog[1];
  const reviewState = createEmptySessionProgress(sessionCatalog).sessions['002'];
  const html = renderSessionStep(review, 2, reviewState, { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(html, /Play pair A/);
  assert.match(html, /assets\/audio\/e001-pair-a\.wav/);
  assert.match(html, /data-answer="same"/);
  assert.match(html, /data-answer="different"/);
  assert.match(html, /data-listening-reveal hidden/);
  assert.doesNotMatch(html, /autoplay/);
});

test('Session 002 keeps the keyboard answer inside the optional retrieval hint', () => {
  const review = sessionCatalog[1];
  const reviewState = createEmptySessionProgress(sessionCatalog).sessions['002'];
  const html = renderSessionStep(review, 0, reviewState, { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(html, /<details><summary>Need a hint\?<\/summary>/);
  assert.match(html, /Middle C/);
  assert.ok(html.indexOf('<details>') < html.indexOf('keyboard-figure'));
});

test('targeted Practicing and Stuck guidance uses each session-specific repair', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  progress.sessions['003'].readiness = 'practicing';
  progress.sessions['004'].readiness = 'stuck';
  const pulse = renderSessionStep(sessionCatalog[2], 3, progress.sessions['003'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  const pattern = renderSessionStep(sessionCatalog[3], 3, progress.sessions['004'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(pulse, /Tap eight beats, rest for four counted beats/);
  assert.match(pattern, /Return to Session 003’s eight C presses/);
  assert.match(pattern, /Revisit Session 003/);
});

test('Sessions 003 and 004 render reusable pulse controls from approved music data', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const pulseHtml = renderSessionStep(sessionCatalog[2], 1, progress.sessions['003'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  const patternHtml = renderSessionStep(sessionCatalog[3], 2, progress.sessions['004'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.equal((pulseHtml.match(/data-pulse-index=/g) ?? []).length, 16);
  assert.equal((patternHtml.match(/data-pulse-index=/g) ?? []).length, 9);
  assert.match(pulseHtml, /Start guide/);
  assert.match(patternHtml, /finger 5/);
});

test('every rendered step has exactly one contextual Ask ChatGPT action after its introduction', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  for (const session of sessionCatalog) {
    session.steps.forEach((step, index) => {
      const html = renderSessionStep(session, index, progress.sessions[session.id], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
      assert.equal((html.match(/data-ask-chatgpt/g) ?? []).length, 1, `${session.id} step ${index + 1}`);
      assert.ok(html.indexOf(step.intro) < html.indexOf('data-ask-chatgpt'));
      assert.ok(html.indexOf('data-ask-chatgpt') < html.indexOf('learning-block'));
    });
  }
});

test('the modal close icon uses geometry rather than a font-positioned multiplication glyph', () => {
  const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
  assert.match(page, /class="dialog-close"[^>]*><\/button>/);
  assert.match(css, /\.dialog-close:before,\.dialog-close:after/);
  assert.match(css, /translate\(-50%,-50%\) rotate\(45deg\)/);
});
