import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assetCatalog, sessionCatalog } from '../js/session-catalog.js';
import { musicLibrary } from '../js/music-library.js';
import { reinforcementCatalog } from '../js/reinforcements.js';
import { renderHome } from '../js/home-renderer.js';
import { audioControlLabels, renderReadinessGuidance, renderSessionNavigation, renderSessionStep } from '../js/session-renderer.js';
import { createSessionProgressStore } from '../js/session-progress.js';
import { continueTarget, createNavigation, revisitSession } from '../js/session-navigation.js';
import { continueSession, finishSession } from '../js/session-actions.js';
import { SAMPLE_RATE } from '../scripts/generate-audio.js';

const fixtures = [
  ['049-T', 'treble', 3, { min: 52, max: 60 }, 'G4q5 F4q4 E4q3 | E4h3 D4q2 | C4q1 D4q2 E4q3 | D4q2 C4h1'],
  ['049-B', 'bass', 2, { min: 48, max: 58 }, 'F3q2 G3q1 | F3e2 E3e3 D3q4 | C3q5 rq | C3h5'],
  ['051-T', 'treble', 2, { min: 52, max: 60 }, 'E4q3 F4q4 | G4q5 F4q4 | E4q3 D4q2 | C4h1'],
  ['051-B', 'bass', 3, { min: 52, max: 60 }, 'E3q3 D3q4 C3q5 | D3h4 E3q3 | F3q2 E3q3 D3q4 | C3h5 rq'],
  ['052-R', 'treble', 2, { min: 48, max: 56, model: 52 }, 'C4q1 rq | C4e1 C4e1 C4q1 | C4h1'],
  ['052-T', 'treble', 3, { min: 52, max: 60 }, 'F4q4 G4q5 F4q4 | E4q3 D4h2 | D4q2 E4q3 D4q2 | C4h1 rq'],
  ['052-B', 'bass', 3, { min: 52, max: 60 }, 'F3q2 E3q3 D3q4 | E3q3 F3h2 | E3q3 D3q4 C3q5 | D3q4 C3h5']
];
const context = { music: musicLibrary, assets: assetCatalog, reinforcements: reinforcementCatalog };
const session = (id) => sessionCatalog.find((entry) => entry.id === id);
const render = (id, step) => renderSessionStep(session(id), step, {}, context);
const visible = (html) => html.replace(/<details\b[^>]*>([\s\S]*?)<\/details>/g,
  (_, content) => content.match(/<summary>[\s\S]*?<\/summary>/)?.[0] ?? '');

test('the seven final music fixtures match the approved meters, notes, rests and fingering', () => {
  const rhythm = { quarter: 'q', half: 'h', eighth: 'e' };
  const beats = { quarter: 1, half: 2, eighth: 0.5, 'quarter-rest': 1 };
  for (const [id, clef, count, tempo, notation] of fixtures) {
    const example = musicLibrary[`C02-${id}`];
    assert.deepEqual(example.tempo, tempo, id);
    assert.equal(example.notation.clef, clef, id);
    assert.equal(example.hand, clef === 'treble' ? 'RH' : 'LH', id);
    assert.deepEqual(example.meter, { beats: count, beatValue: 4 }, id);
    assert.equal(example.audioRef, id === '052-R' ? 'c02-052-rhythm' : undefined, id);
    const bars = example.measures.map(({ events }) => {
      assert.equal(events.reduce((total, event) => total + event.beats, 0), count, id);
      return events.map((event) => {
        assert.equal(event.beats, beats[event.rhythm], id);
        assert.ok(!event.tieToNext, id);
        if (event.kind === 'rest') {
          assert.equal(event.rhythm, 'quarter-rest', id);
          assert.equal(event.pitch, undefined, id);
          assert.equal(event.finger, undefined, id);
          return 'rq';
        }
        return `${event.pitch}${rhythm[event.rhythm]}${event.finger}`;
      }).join(' ');
    });
    assert.equal(bars.join(' | '), notation, id);
  }
});

test('the four final lessons provide opening actions, guidance, practice and reflection', () => {
  assert.deepEqual(sessionCatalog.slice(48).map(({ id, type, prerequisites, duration }) => [id, type, prerequisites, duration.min]), [
    ['049', 'Review', ['029', '035', '044', '048'], 13],
    ['050', 'Play', ['019', '046', '048', '049'], 13],
    ['051', 'Practice', ['046', '048', '049', '050'], 13],
    ['052', 'Play', ['046', '048', '051'], 14]
  ]);
  for (const { id } of sessionCatalog.slice(48)) {
    assert.match(visible(render(id, 0)), /01<\/span>Explain[\s\S]+class="music-score[\s\S]+03<\/span>Try it on your piano<\/p><p>[^<]+/);
    assert.match(visible(render(id, 1)), /02<\/span>Demonstrate/);
    assert.match(visible(render(id, 2)), /03<\/span>Try it on your piano[\s\S]+04<\/span>Reflect/);
    assert.match(render(id, 2), /I understand it[\s\S]+I can play it[\s\S]+Ready[\s\S]+Practicing[\s\S]+Stuck/);
  }
});

test('new reading attempts keep pitch names, finger labels and count guides closed', () => {
  for (const id of ['049', '051', '052']) {
    const opening = visible(render(id, 0));
    assert.match(opening, /familiar/);
    assert.doesNotMatch(opening, /New (?:treble|bass) line|rehearsal line|Milestone rhythm|Milestone (?:treble|bass) line/);
    for (const step of [1, 2]) {
      assert.doesNotMatch(visible(render(id, step)), /pitch-label|finger-label|class="beat-grids"|[A-G][34] (?:quarter|half|eighth)/);
    }
  }
  assert.match(render('049', 2), /<details class="score-reveal"><summary>Check notes and counts after your attempt<\/summary>[\s\S]+class="beat-grids"/);
  assert.match(render('051', 2), /<details class="score-reveal"><summary>Check note names after your attempt<\/summary>[\s\S]+class="pitch-label"/);
  assert.match(visible(render('051', 2)), /start from the preceding bar/);
  assert.doesNotMatch(render('052', 2), /class="score-reveal"|class="pitch-label"|class="finger-label"/);
  assert.match(visible(render('052', 2)), /Milestone treble line[\s\S]+Milestone bass line[\s\S]+Window Lights[\s\S]+Footpath/);
  assert.match(visible(render('052', 2)), /Which one skill or session would you revisit/);
});

test('both performance tasks reuse the full scores and existing references', () => {
  for (const id of ['050', '052']) {
    const scores = session(id).steps[2].blocks.find((block) => block.musicRefs?.includes('C02-P01'));
    assert.deepEqual(scores.musicRefs, ['C02-P01', 'C02-P02']);
    assert.equal(scores.options.measureIndexes, undefined);
    assert.equal(scores.options.readingChallenge, true);
    const full = visible(render(id, 2));
    assert.equal((full.match(/class="barline section-barline"/g) ?? []).length, 2);
    assert.match(full, /class="dynamic-label"[^>]*>p<[\s\S]+class="dynamic-label"[^>]*>f</);
    assert.doesNotMatch(full, /pitch-label|finger-label/);
  }
  const page = render('050', 2);
  assert.doesNotMatch(visible(page), /<audio/);
  assert.match(page, /assets\/audio\/c02-p01-reference\.wav[\s\S]+assets\/audio\/c02-p02-reference\.wav/);
  assert.match(page, /chosen order[\s\S]+new count-in/);
});

test('milestone rhythm model is optional and has natural play and replay labels', () => {
  const model = render('052', 1);
  assert.match(visible(model), /clap the three bars from the page/);
  assert.doesNotMatch(visible(model), /<audio|bar 1 sounds on beat 1/);
  assert.match(model, /<details class="audio-details"><summary>Hear the rhythm reference after clapping/);
  assert.match(model, /src="assets\/audio\/c02-052-rhythm.wav"/);
  assert.doesNotMatch(model, /autoplay/);
  const action = 'Play with a two-beat count-in';
  assert.ok(model.includes(`aria-label="${action}">▶ ${action}</button>`));
  assert.deepEqual(audioControlLabels(action, action, true), { text: `↻ ${action} again`, accessible: `${action} again` });
});

test('the 52 bpm milestone WAV contains two spoken beats, one silent beat, a pair, and a held C4', () => {
  const wav = readFileSync(new URL('../assets/audio/c02-052-rhythm.wav', import.meta.url));
  const beat = 60 / 52;
  const time = (beats) => Math.round(beats * beat * SAMPLE_RATE);
  const sample = (frame) => wav.readInt16LE(44 + 2 * frame);
  assert.equal(wav.readUInt32LE(24), SAMPLE_RATE);
  assert.equal(wav.readUInt32LE(40) / 2, Math.ceil(8 * beat * SAMPLE_RATE));
  for (const count of [1, 2]) {
    const voice = readFileSync(new URL(`../scripts/audio-voice/count-${count}.wav`, import.meta.url));
    const offset = Math.round(((count - 1) * beat + 0.04) * SAMPLE_RATE);
    for (let frame = 0; frame < voice.readUInt32LE(40) / 2; frame += 41) {
      assert.ok(Math.abs(sample(offset + frame) - voice.readInt16LE(44 + 2 * frame) * 0.72) <= 1);
    }
  }
  for (let frame = time(3); frame < time(4); frame++) assert.equal(sample(frame), 0);
  for (const onset of [2, 4, 4.5, 5, 6]) {
    const start = time(onset);
    assert.equal(sample(start - 1), 0, `release before beat ${onset}`);
    let crossings = 0;
    for (let frame = start + 960; frame < start + 4960; frame++) {
      if (sample(frame - 1) <= 0 && sample(frame) > 0) crossings += 1;
    }
    assert.ok(Math.abs(crossings * 4 - 261.63) < 5, `C4 at beat ${onset}`);
  }
  assert.ok(Array.from({ length: 120 }, (_, offset) => sample(time(7.25) + offset)).some(Boolean));
  assert.equal(sample(time(8) - 2), 0);
});

test('RF02-READ shows labeled treble, bass and routine revisits for Stuck', () => {
  const buttons = (html) => Array.from(html.matchAll(/<button [^>]*type="button" data-revisit-session="(\d{3})">([^<]+)<\/button>/g),
    ([, id, label]) => [id, label]);
  for (const id of ['049', '051', '052']) {
    const guidance = renderReadinessGuidance(session(id), { readiness: 'stuck' }, reinforcementCatalog);
    assert.deepEqual(buttons(guidance), [
      ['027', 'Revisit Session 027 — Treble'],
      ['028', 'Revisit Session 028 — Bass'],
      ['029', 'Revisit Session 029 — Reading routine']
    ]);
  }
  assert.deepEqual(buttons(renderReadinessGuidance(session('052'), { readiness: 'practicing' }, reinforcementCatalog)),
    [['029', 'Revisit Session 029']]);
  assert.deepEqual(buttons(renderReadinessGuidance(session('031'), { readiness: 'stuck' }, reinforcementCatalog)),
    [['030', 'Revisit Session 030']]);
  assert.deepEqual(buttons(renderReadinessGuidance(session('031'), { readiness: 'practicing' }, reinforcementCatalog)),
    [['003', 'Revisit Session 003']]);
});

test('a saved 48-session catalog can finish Chapter 02 and revisit without losing history', () => {
  const records = new Map();
  const storage = { getItem: (key) => records.get(key), setItem: (key, value) => records.set(key, value) };
  const old = createSessionProgressStore(storage, sessionCatalog.slice(0, 48));
  old.setCurrentSession('048');
  old.completeSession('024');
  old.setStepIndex('024', 2);
  old.setSessionAssessment('024', 'playing', true);
  old.setReadiness('024', 'ready');
  const previous = old.load();

  const store = createSessionProgressStore(storage, sessionCatalog);
  for (const id of ['049', '050', '051', '052']) {
    const before = store.load();
    assert.deepEqual(continueTarget(before.currentSessionId, sessionCatalog, before), { sessionId: id, advancesCurrent: true });
    continueSession(store, before.currentSessionId, id, true);
  }
  store.setStepIndex('052', 2);
  store.setSessionAssessment('052', 'understanding', true);
  store.setReadiness('052', 'stuck');
  const before = store.load();
  const pending = renderSessionStep(session('052'), 2, before.sessions['052'], { ...context, endOfCatalog: true });
  assert.match(pending, /Finish the milestone/);
  assert.doesNotMatch(pending, /data-continue-session|Chapter 02 complete/);

  const after = finishSession(store, '052');
  const ending = renderSessionStep(session('052'), 2, after.sessions['052'], { ...context, endOfCatalog: true });
  assert.match(ending, /Chapter 02 complete[\s\S]+learning history is saved[\s\S]+data-return-home/);
  assert.doesNotMatch(ending, /data-continue-session|Session 053/);
  assert.deepEqual(after.sessions['052'], { ...before.sessions['052'], completed: true });
  assert.deepEqual(after.sessions['024'], previous.sessions['024']);
  assert.equal(after.currentSessionId, '052');
  assert.equal(continueTarget('052', sessionCatalog, after), null);
  assert.match(renderHome(sessionCatalog, after), /Continue Learning · Session 052/);
  const navigation = revisitSession('024', sessionCatalog, after, createNavigation(after));
  assert.match(renderSessionNavigation(sessionCatalog, after, navigation.viewingSessionId), /Chapter 01 · Available Sessions/);
  for (const id of ['027', '028']) {
    assert.ok(ending.includes(`data-revisit-session="${id}"`));
    const support = revisitSession(id, sessionCatalog, after, createNavigation(after));
    assert.equal(support.viewingSessionId, id);
    assert.equal(revisitSession('052', sessionCatalog, after, support).viewingSessionId, '052');
  }
  assert.deepEqual(createSessionProgressStore(storage, sessionCatalog).load(), after);
});
