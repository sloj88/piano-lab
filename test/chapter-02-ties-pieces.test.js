import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { assetCatalog, sessionCatalog } from '../js/session-catalog.js';
import { musicLibrary } from '../js/music-library.js';
import { reinforcementCatalog } from '../js/reinforcements.js';
import { validateCurriculum } from '../js/content-validator.js';
import { beatGridMarkup, scoreMarkup } from '../js/notation.js';
import { audioControlLabels, renderSessionNavigation, renderSessionStep } from '../js/session-renderer.js';
import { createEmptySessionProgress, createSessionProgressStore } from '../js/session-progress.js';
import { continueTarget, createNavigation, revisitSession } from '../js/session-navigation.js';
import { continueSession } from '../js/session-actions.js';
import { pitchFrequency, SAMPLE_RATE } from '../scripts/generate-audio.js';

const examples = [
  ['041-A', 'bass', 2, [52, 52, 52], 'C3q5 D3q4 | E3h3'],
  ['041-B', 'bass', 2, [52, 52, 52], 'C3e5 C3e5 D3q4 | E3h3'],
  ['042-A', 'treble', 2, [52, 60, 56], 'D4q2 C4q1~ | C4q1 D4q2'],
  ['042-B', 'treble', 2, [52, 60, 56], 'D4q2 C4q1 | C4q1 D4q2'],
  ['043', 'bass', 3, [52, 60, 56], 'D3h4 C3q5~ | C3q5 D3h4'],
  ['044-T', 'treble', 2, [48, 58], 'E4q3 E4q3~ | E4q3 rq | D4e2 C4e1 D4q2 | C4h1'],
  ['044-B', 'bass', 3, [48, 58], 'D3q4 D3q4 E3q3~ | E3q3 rh | D3q4 C3h5'],
  ['P01', 'treble', 3, [52, 56, 60], 'E4q3 F4q4 G4q5 | F4q4 E4h3 | D4q2 E4q3 F4q4 | E4q3 D4h2 | C4q1 D4q2 E4q3 | F4q4 E4h3 | D4q2 E4q3 D4q2 | C4h1 rq'],
  ['P02', 'bass', 2, [48, 54, 56], 'C3q5 D3e4 E3e3 | D3q4 C3q5 | C3q5 rq | C3h5 | F3q2 E3e3 D3e4 | C3q5 D3q4 | E3q3 D3q4 | C3h5']
];

test('the nine new scores match the approved pitches, fingering, meters, ties, rests and tempos', () => {
  const rhythm = { eighth: 'e', quarter: 'q', half: 'h', 'quarter-rest': 'rq', 'half-rest': 'rh' };
  const duration = { e: 0.5, q: 1, h: 2, rq: 1, rh: 2 };
  for (const [id, clef, beats, tempo, tokens] of examples) {
    const example = musicLibrary[`C02-${id}`];
    assert.deepEqual(example.meter, { beats, beatValue: 4 }, id);
    assert.deepEqual(Object.values(example.tempo), tempo, id);
    assert.equal(example.notation.clef, clef, id);
    assert.equal(example.hand, clef === 'bass' ? 'LH' : 'RH', id);
    assert.equal(Boolean(example.audioRef), tempo.length === 3, id);
    const compact = example.measures.map(({ events }) => {
      assert.equal(events.reduce((sum, event) => sum + event.beats, 0), beats, id);
      return events.map((event) => {
        const value = rhythm[event.rhythm];
        assert.equal(event.beats, duration[value], id);
        return event.kind === 'rest' ? value : `${event.pitch}${value}${event.finger}${event.tieToNext ? '~' : ''}`;
      }).join(' ');
    }).join(' | ');
    assert.equal(compact, tokens, id);
  }
});

test('invalid cross-bar tie endpoints fail content validation', () => {
  const mutations = [
    (left) => { left[0].tieToNext = true; },
    (left) => { left[1].tieToNext = 'true'; },
    (left) => { Object.assign(left[1], { kind: 'rest', rhythm: 'quarter-rest', pitch: undefined, finger: undefined }); },
    (left, right) => { right[0].pitch = 'D4'; },
    (left, right) => { right[0].finger = 2; },
    (left, right) => { right[0].rhythm = 'half'; right[0].beats = 2; },
    (left, right) => { right[0].hand = 'LH'; },
    (left, right) => { left[1].hand = right[0].hand = 'LH'; },
    (left, right) => { right[1].tieToNext = true; }
  ];
  for (const mutate of mutations) {
    const music = structuredClone(musicLibrary);
    const [left, right] = music['C02-042-A'].measures;
    mutate(left.events, right.events);
    const { errors } = validateCurriculum({ music, assets: assetCatalog });
    assert.ok(errors.some(({ code, path }) => code === 'tie-endpoint' && path.includes('C02-042-A')));
  }
});

test('ties cross the barline and the count grid distinguishes a held downbeat', () => {
  for (const id of ['042-A', '043', '044-T', '044-B']) {
    const example = musicLibrary[`C02-${id}`];
    for (const enlarged of [false, true]) {
      const html = scoreMarkup(example, { enlarged, readingChallenge: true });
      const tie = html.match(/class="score-tie" d="M ([\d.]+) [\d.]+ Q [\d.]+ [\d.]+ ([\d.]+) [\d.]+"/);
      assert.ok(tie, id);
      const bar = Number(html.match(/class="barline" x1="([\d.]+)"/)[1]);
      assert.ok(Number(tie[1]) < bar && Number(tie[2]) > bar, id);
      assert.match(html, /tied to the first note of the next bar without a new attack/);
    }
    assert.match(beatGridMarkup(example), /is-held"><strong>1<\/strong><span>keep holding/);
  }
  assert.doesNotMatch(scoreMarkup(musicLibrary['C02-042-B']), /score-tie/);
});

const progress = createEmptySessionProgress(sessionCatalog);
const context = { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog };
const render = (id, step) => renderSessionStep(sessionCatalog.find((session) => session.id === id), step, progress.sessions[id], context);
const visible = (html) => html.replace(/<details\b[^>]*>[\s\S]*?<\/details>/g, '');

test('both pieces have eight bars, a dynamic at the first note, and two section starts without visible answer hints', () => {
  for (const [id, dynamic, build, play] of [['P01', 'p', '045', '046'], ['P02', 'f', '047', '048']]) {
    const piece = musicLibrary[`C02-${id}`];
    assert.equal(piece.measures.length, 8);
    assert.deepEqual(piece.measures.map((bar, i) => [i + 1, bar.dynamic, bar.sectionStart]).filter(([, d, s]) => d || s),
      [[1, dynamic, undefined], [5, undefined, true]]);
    const full = visible(render(play, 0));
    assert.match(full, new RegExp(`class="dynamic-label"[^>]*>${dynamic}<`));
    assert.equal((full.match(/class="measure-number"/g) ?? []).length, 8);
    assert.match(full, /section-barline/);
    assert.match(full, /class="score-scroll" tabindex="0"/);
    assert.equal((full.match(/class="eighth-beam"/g) ?? []).length, id === 'P02' ? 2 : 0);
    assert.doesNotMatch(full, /pitch-label|finger-label/);
    const start = render(build, 1);
    const second = render(build, 2);
    assert.match(start, /bars 1–4/);
    assert.match(second, /bars 5–8/);
    assert.match(second, /class="measure-number"[^>]*>5</);
    const finger = id === 'P01' ? /middle C with right-hand finger 1/ : /F3 with left-hand finger 2/;
    assert.match(second, finger);
    assert.doesNotMatch(visible(second), finger);
    assert.doesNotMatch(render(play, 1), finger);
    assert.match(render(play, 1), /<details class="audio-details"><summary>Hear the reference after previewing/);
  }
});

test('each new lesson has an actionable opening, complete phases, and optional answers', () => {
  const sessions = sessionCatalog.slice(40, 48).map(({ id, type }) => [id, type]);
  assert.deepEqual(sessions, [['041', 'Review'], ['042', 'Learn'], ['043', 'Practice'], ['044', 'Review'], ['045', 'Practice'], ['046', 'Play'], ['047', 'Practice'], ['048', 'Play']]);
  for (const [id] of sessions) {
    const preview = visible(render(id, 0));
    assert.match(preview, /<span>01<\/span>Explain/);
    assert.match(preview, /class="music-score/);
    assert.match(preview, /<span>03<\/span>Try it on your piano<\/p><p>[\s\S]+?<\/p>/);
    assert.match(render(id, 1), /<span>02<\/span>Demonstrate/);
    assert.match(render(id, 2), /<span>04<\/span>Reflect/);
    assert.doesNotMatch(render(id, 1) + render(id, 2), /autoplay|Play Play/);
  }
  const challenge = render('041', 1);
  assert.match(visible(challenge), /Play the mystery rhythm/);
  assert.doesNotMatch(visible(challenge), /The mystery recording is|Play Card [AB]|C3 eighth/);
  assert.match(challenge, /<details class="audio-details"><summary>Reveal the answer after choosing<\/summary>[^]*The mystery recording is Card B/);
  for (const [id, action] of [['041', 'Play the mystery rhythm'], ['042', 'Hear the tied C']]) {
    assert.ok(visible(render(id, 1)).includes(`aria-label="${action}">▶ ${action}</button>`));
    assert.equal(audioControlLabels(action, action, true).accessible, `${action} again`);
  }
  for (const step of [0, 1, 2]) assert.doesNotMatch(visible(render('044', step)), /pitch-label|finger-label|[A-G][34] quarter/);
});

test('a 40-session save can advance to Session 041 and revisit Chapter 01 with its history intact', () => {
  const records = new Map();
  const storage = { getItem: (key) => records.get(key), setItem: (key, value) => records.set(key, value) };
  const old = createSessionProgressStore(storage, sessionCatalog.slice(0, 40));
  old.setCurrentSession('040');
  old.setStepIndex('040', 2);
  old.setSessionAssessment('040', 'playing', true);
  old.setReadiness('040', 'practicing');
  const prior = old.load().sessions['040'];
  const store = createSessionProgressStore(storage, sessionCatalog);
  const target = continueTarget('040', sessionCatalog, store.load());
  assert.deepEqual(target, { sessionId: '041', advancesCurrent: true });
  const after = continueSession(store, '040', '041', true);
  assert.deepEqual(after.sessions['040'], { ...prior, completed: true });
  const sidebar = renderSessionNavigation(sessionCatalog, after, '041');
  assert.match(sidebar, /Chapter 02 · Available Sessions/);
  assert.match(sidebar, /data-session="041" aria-current="page"/);
  assert.doesNotMatch(sidebar, /data-session="042"/);
  const priorView = revisitSession('024', sessionCatalog, after, createNavigation(after));
  assert.match(renderSessionNavigation(sessionCatalog, after, priorView.viewingSessionId), /Chapter 01 · Available Sessions/);
  assert.deepEqual(store.load(), after);
});

test('the seven WAVs match the count-in, pitches, attacks, rests and relative dynamics', () => {
  const time = { e: 0.5, q: 1, h: 2, rq: 1, rh: 2 };
  const firstPeaks = {};
  for (const [id, , count, tempo, notation] of examples.filter((row) => row[3].length === 3)) {
    const beat = 60 / tempo[2];
    const assetRef = musicLibrary[`C02-${id}`].audioRef;
    const wav = readFileSync(new URL(`../${assetCatalog[assetRef].src}`, import.meta.url));
    const index = (seconds) => Math.round(seconds * SAMPLE_RATE);
    const sample = (frame) => wav.readInt16LE(44 + 2 * frame);
    const peak = (from, until) => {
      let result = 0;
      for (let frame = index(from); frame < index(until); frame += 1) result = Math.max(result, Math.abs(sample(frame)));
      return result;
    };
    for (let i = 0; i < count; i += 1) {
      const voice = readFileSync(new URL(`../scripts/audio-voice/count-${i + 1}.wav`, import.meta.url));
      for (let j = 0; j < voice.readUInt32LE(40) / 2; j += 43) {
        assert.ok(Math.abs(sample(index(i * beat + 0.04) + j) - 0.72 * voice.readInt16LE(44 + 2 * j)) <= 1, id);
      }
    }
    let onset = count;
    let tiedIn = false;
    for (const token of notation.split(' ').filter((part) => part !== '|')) {
      const rest = token.startsWith('r');
      const span = time[rest ? token : token[2]];
      const start = onset * beat;
      const end = (onset + span) * beat;
      if (rest) assert.equal(peak(start, end), 0, id + ' rest');
      else {
        if (onset === count) firstPeaks[id] = peak(start + 0.04, start + 0.1);
        assert.equal(peak(start - 0.06, start - 0.02) > 0, tiedIn, id + ' ' + token + ' pre-onset');
        assert.ok(peak(start + 0.04, start + 0.11) > 0, id + ' onset');
        let crossings = 0;
        for (let frame = index(start + 0.06); frame < index(start + 0.31); frame += 1) {
          if (sample(frame - 1) <= 0 && sample(frame) > 0) crossings += 1;
        }
        assert.ok(Math.abs(crossings * 4 - pitchFrequency(token.slice(0, 2))) <= 5, id + ' ' + token);
        assert.ok(peak(end - 0.25, end - 0.18) > 0, id + ' sustain');
        assert.equal(peak(end - 0.06, end - 0.02) > 0, token.endsWith('~'), id + ' release');
      }
      tiedIn = token.endsWith('~');
      onset += span;
    }
    assert.equal(wav.readUInt32LE(40) / 2, Math.ceil(onset * beat * SAMPLE_RATE), id);
  }
  assert.ok(firstPeaks.P02 > firstPeaks.P01 * 1.7);
});
