import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { musicLibrary } from '../js/music-library.js';
import { reinforcementCatalog } from '../js/reinforcements.js';
import { assetCatalog, sessionCatalog } from '../js/session-catalog.js';
import { createEmptySessionProgress } from '../js/session-progress.js';
import { audioControlLabels, renderBlock, renderSessionStep, renderStepNavigation } from '../js/session-renderer.js';

const session = sessionCatalog[0];
const state = () => createEmptySessionProgress(sessionCatalog).sessions['001'];

test('initial and replay audio labels preserve natural actions and specific accessible names', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const cases = [
    ['036', 1, 'c02-036-model', 'Play with a four-beat count-in'],
    ['037', 1, 'c02-037-b', 'Play the mystery rhythm'],
    ['007', 3, 'n001-a-shape', 'Hear the contour'],
    ['002', 2, 'e001-pair-a', 'Play pair A', 'Play listening pair A'],
    ['010', 3, 'p01-practice', 'Play the practice version at 56 bpm']
  ];
  for (const [id, stepIndex, ref, action, accessibleAction = action] of cases) {
    const lesson = sessionCatalog.find((entry) => entry.id === id);
    const html = renderSessionStep(lesson, stepIndex, progress.sessions[id], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
    const match = html.match(new RegExp(`data-audio-control="${ref}"[^>]*data-audio-action="([^"]+)" data-audio-accessible-action="([^"]+)" aria-label="([^"]+)">([^<]+)</button>`));
    assert.ok(match, id);
    assert.deepEqual(match.slice(1), [action, accessibleAction, accessibleAction, `▶ ${action}`]);
    assert.deepEqual(audioControlLabels(match[1], match[2], true), {
      text: `↻ ${action} again`,
      accessible: `${accessibleAction} again`
    });
  }
});

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

test('Session 005 renders accurate one- and two-beat notation with count blocks', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const html = renderSessionStep(sessionCatalog[4], 0, progress.sessions['005'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(html, /data-rhythm="quarter"/);
  assert.match(html, /data-rhythm="half"/);
  assert.match(html, /class="notehead is-half"/);
  assert.match(html, /class="is-held"/);
});

test('Session 006 renders user-initiated pattern and spoken-count audio with hidden scores', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const html = renderSessionStep(sessionCatalog[5], 1, progress.sessions['006'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(html, /r002-a-pattern\.wav/);
  assert.match(html, /r002-a-counted\.wav/);
  assert.match(html, /Reveal score and count blocks/);
  assert.doesNotMatch(html, /autoplay/);
});

test('Sessions 007–009 render neutral contour and accurate treble landmarks', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const contour = renderSessionStep(sessionCatalog[6], 0, progress.sessions['007'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  const landmarks = renderSessionStep(sessionCatalog[7], 0, progress.sessions['008'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  const reading = renderSessionStep(sessionCatalog[8], 0, progress.sessions['009'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.doesNotMatch(contour, /class="treble-clef"/);
  assert.match(landmarks, /class="treble-clef"/);
  assert.match(landmarks, /class="ledger-line"/);
  assert.match(reading, /Reveal note names and directions/);
});

test('Session 007 does not reveal the listening answer before the learner chooses', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const html = renderSessionStep(sessionCatalog[6], 3, progress.sessions['007'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(html, /Reveal the accessible audio description after choosing/);
  assert.match(html, /<details class="audio-transcript">/);
  assert.equal((html.match(/class="notation-card"/g) ?? []).length, 3);
});

test('Session 010 keeps the exact score primary and reference audio closed until after an attempt', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const score = renderSessionStep(sessionCatalog[9], 0, progress.sessions['010'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  const ending = renderSessionStep(sessionCatalog[9], 3, progress.sessions['010'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.equal((score.match(/class="measure-number"/g) ?? []).length >= 4, true);
  assert.match(score, /Three-Step Walk/);
  assert.match(ending, /<details class="audio-details"><summary>Hear after my try<\/summary>/);
  assert.match(ending, /p01-practice\.wav/);
  assert.match(ending, /p01-musical\.wav/);
});

test('optional Echo D appears only in Session 006 Keep Playing', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const ending = renderSessionStep(sessionCatalog[5], 3, progress.sessions['006'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(ending, /Optional extension/);
  assert.match(ending, /Rhythm echo D/);
  assert.match(ending, /r002-d-pattern\.wav/);
});

test('Session 011 introduces left-hand placement without premature bass notation', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const fingers = renderSessionStep(sessionCatalog[10], 1, progress.sessions['011'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  const walk = renderSessionStep(sessionCatalog[10], 3, progress.sessions['011'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(fingers, /aria-label="Left hand finger numbers"/);
  assert.match(fingers, /Pinky<strong>5/);
  assert.equal((walk.match(/data-pulse-index=/g) ?? []).length, 9);
  assert.doesNotMatch(`${fingers}${walk}`, /bass-clef/);
});

test('Session 012 renders user-initiated E002 echoes with optional contour reveals', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const html = renderSessionStep(sessionCatalog[11], 2, progress.sessions['012'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(html, /assets\/audio\/e002-a\.wav/);
  assert.equal((html.match(/Reveal contour and note names/g) ?? []).length, 3);
  assert.match(html, /repeat · up/);
  assert.doesNotMatch(html, /autoplay/);
});

test('Sessions 013 and 014 render bass-clef landmarks and no-label reading cards', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const landmarks = renderSessionStep(sessionCatalog[12], 0, progress.sessions['013'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  const reading = renderSessionStep(sessionCatalog[13], 3, progress.sessions['014'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(landmarks, /class="bass-clef"/);
  assert.match(landmarks, /data-pitch="C3"/);
  assert.match(landmarks, /data-pitch="F3"/);
  assert.match(reading, /class="bass-clef"/);
  assert.doesNotMatch(reading, /class="pitch-label"/);
});

test('Session 015 begins with two explicit hand lanes and aligned beat columns', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const html = renderSessionStep(sessionCatalog[14], 1, progress.sessions['015'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(html, /Measure 1 hand lanes/);
  assert.match(html, /<strong>RH<\/strong>/);
  assert.match(html, /<strong>LH<\/strong>/);
  assert.equal((html.match(/data-pulse-index=/g) ?? []).length, 4);
  assert.match(html, /C3 \(5\)/);
  assert.match(html, /C4 \(1\)/);
  assert.match(html, /Start beat guide/);
});

test('Session 016 shows practical waits, paired staves, entrance labels, and post-attempt audio', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const waits = renderSessionStep(sessionCatalog[15], 0, progress.sessions['016'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  const score = renderSessionStep(sessionCatalog[15], 1, progress.sessions['016'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  const ending = renderSessionStep(sessionCatalog[15], 3, progress.sessions['016'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(waits, /E4 begins \(3\)/);
  assert.match(waits, /E4 continues/);
  assert.equal((waits.match(/>wait<\/div>/g) ?? []).length, 8);
  assert.match(score, /paired-music-score/);
  assert.match(score, /class="bass-clef"/);
  assert.match(score, /whole-measure-rest/);
  assert.match(score, /active-hand-label/);
  assert.match(ending, /<details class="audio-details"><summary>Hear after my try<\/summary>/);
  assert.match(ending, /p02-practice\.wav/);
  assert.match(ending, /p02-musical\.wav/);
});

test('Session 017 keeps the silent beat visible and moving', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const meaning = renderSessionStep(sessionCatalog[16], 0, progress.sessions['017'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  const guide = renderSessionStep(sessionCatalog[16], 1, progress.sessions['017'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(meaning, /class="quarter-rest"/);
  assert.match(meaning, /rest · silent/);
  assert.equal((guide.match(/data-pulse-index=/g) ?? []).length, 4);
  assert.match(guide, /<span>rest<\/span>/);
});

test('Session 018 renders all four core review cards and optional R004 E', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const core = sessionCatalog[17].steps.map((_, index) => renderSessionStep(sessionCatalog[17], index, progress.sessions['018'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog })).join('');
  assert.match(core, /Mixed rhythm A/);
  assert.match(core, /Mixed rhythm B/);
  assert.match(core, /Mixed rhythm C/);
  assert.match(core, /Mixed rhythm D/);
  assert.match(core, /Mixed rhythm E · Keep Playing/);
});

test('Session 019 provides local dynamic audio and a safe reduced-motion-aware model', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const html = renderSessionStep(sessionCatalog[18], 0, progress.sessions['019'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(html, /d001-soft-strong\.wav/);
  assert.match(html, />p<\/strong><span>soft/);
  assert.match(html, />f<\/strong><span>strong, never forced/);
  assert.match(html, /Easy, free descent/);
  assert.match(html, /Stop for pain, numbness, or persistent tension/);
});

test('Session 020 keeps metered notation visible with phrase and answer audio', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const phrase = renderSessionStep(sessionCatalog[19], 1, progress.sessions['020'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  const answers = renderSessionStep(sessionCatalog[19], 2, progress.sessions['020'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(phrase, /First melody as a musical sentence/);
  assert.match(phrase, /m001-even\.wav/);
  assert.match(phrase, /m001-shaped\.wav/);
  assert.match(answers, /Answer A/);
  assert.match(answers, /Answer B/);
  assert.match(answers, /c001-question-answer\.wav/);
});

test('Session 021 separates both P03 sections and isolates the Measure 6–7 hand change', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const rhythm = renderSessionStep(sessionCatalog[20], 1, progress.sessions['021'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  const transition = renderSessionStep(sessionCatalog[20], 3, progress.sessions['021'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(rhythm, /Across the Keys · Measures 1–4/);
  assert.match(rhythm, /Across the Keys · Measures 5–8/);
  assert.match(rhythm, /p03-rhythm-count\.wav/);
  assert.match(transition, /Across the Keys · Measures 6–7/);
  assert.match(transition, /Measure 7 hand lanes/);
  assert.equal((transition.match(/data-pulse-index=/g) ?? []).length, 8);
  assert.match(transition, /C3 \(5\)/);
  assert.match(transition, /C4 \(1\)/);
});

test('Session 022 keeps the full P03 score primary and reference performance optional', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const html = renderSessionStep(sessionCatalog[21], 0, progress.sessions['022'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(html, /paired-music-score/);
  assert.equal((html.match(/paired-barline/g) ?? []).length >= 8, true);
  assert.match(html, /<details class="audio-details"><summary>Hear after previewing the notation—before or after my first run<\/summary>/);
  assert.match(html, /p03-performance\.wav/);
});

test('Session 023 hides listening and M001 answers until learner-controlled reveal', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const listening = renderSessionStep(sessionCatalog[22], 2, progress.sessions['023'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  const melody = renderSessionStep(sessionCatalog[22], 3, progress.sessions['023'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  assert.match(listening, /data-listening-reveal hidden/);
  assert.match(listening, /Reveal notes and answer/);
  assert.match(melody, /<details class="score-reveal"><summary>Reveal M001 after my memory attempt<\/summary>/);
  assert.match(melody, /Across the Keys · challenge excerpt/);
  assert.doesNotMatch(`${listening}${melody}`, /data-score|points earned|percent correct/i);
});

test('Session 024 renders all milestone areas, full P03, and separate completion reflections', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const rendered = sessionCatalog[23].steps.map((_, index) => renderSessionStep(sessionCatalog[23], index, progress.sessions['024'], { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog })).join('');
  assert.match(rendered, /Find landmarks and play both patterns/);
  assert.match(rendered, /Read treble and bass/);
  assert.match(rendered, /Count and play a mixed rhythm/);
  assert.match(rendered, /Respond to a short listening task/);
  assert.match(rendered, /Perform Across the Keys/);
  assert.match(rendered, /Understanding and playing can develop at different speeds/);
  assert.match(rendered, /What would help next/);
  assert.match(rendered, /three-piece mini-recital/);
  assert.doesNotMatch(rendered, /data-score|pass mark|points earned/i);
  assert.match(rendered, /No percentage, streak, calendar rule, or forced threshold controls completion/);
});
