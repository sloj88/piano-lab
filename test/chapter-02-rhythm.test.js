import test from 'node:test';
import assert from 'node:assert/strict';
import { assetCatalog, sessionCatalog } from '../js/session-catalog.js';
import { musicLibrary } from '../js/music-library.js';
import { reinforcementCatalog } from '../js/reinforcements.js';
import { validateCurriculum } from '../js/content-validator.js';
import { beatGridMarkup, scoreMarkup } from '../js/notation.js';
import { renderSessionNavigation, renderSessionStep } from '../js/session-renderer.js';
import { createEmptySessionProgress, createSessionProgressStore } from '../js/session-progress.js';
import { continueTarget, createNavigation, revisitSession } from '../js/session-navigation.js';
import { continueSession } from '../js/session-actions.js';

const fixtures = [
  ['033', 'bass', 4, [52, 60, 56], 'C3w5 | D3q4 E3q3 D3h4 | C3w5'],
  ['034-T2', 'treble', 2, [52, 60], 'D4q2 E4q3 | D4h2'],
  ['034-B3', 'bass', 3, [52, 60], 'D3q4 E3h3 | D3q4 C3h5'],
  ['034-T4', 'treble', 4, [52, 60], 'C4w1 | D4h2 C4h1'],
  ['035', 'bass', 3, [52, 62], 'F3q2 E3h3 | D3q4 C3h5 | C3q5 D3q4 E3q3 | F3h2 E3q3'],
  ['036', 'bass', 4, [52, 60, 56], 'C3q5 rh D3q4 | E3h3 D3q4 C3q5'],
  ['037-A', 'treble', 4, [56, 56, 56], 'C4q1 rh C4q1'],
  ['037-B', 'treble', 4, [56, 56, 56], 'C4q1 C4q1 rh'],
  ['038', 'treble', 2, [48, 56, 52], 'C4e1 D4e2 E4q3 | D4q2 C4q1'],
  ['039', 'treble', 2, [48, 58], 'E4q3 D4e2 C4e1 | D4q2 E4q3 | F4q4 E4e3 D4e2 | C4h1'],
  ['040', 'bass', 2, [48, 56, 52], 'C3e5 D3e4 E3q3 | D3q4 C3q5']
];

test('Sessions 033–040 use exact scores, fingering, meters, tempos and measure totals', () => {
  const code = { eighth: 'e', quarter: 'q', half: 'h', whole: 'w', 'half-rest': 'rh' };
  const durations = { e: 0.5, q: 1, h: 2, w: 4, rh: 2 };
  for (const [id, clef, beats, tempo, expected] of fixtures) {
    const example = musicLibrary[`C02-${id}`];
    assert.deepEqual(example.meter, { beats, beatValue: 4 }, id);
    assert.equal(example.notation.clef, clef, id);
    assert.equal(example.hand, clef === 'bass' ? 'LH' : 'RH', id);
    assert.deepEqual(Object.values(example.tempo), tempo, id);
    assert.equal(Boolean(example.audioRef), tempo.length === 3, id);
    const bars = example.measures.map(({ events }) => {
      assert.equal(events.reduce((sum, event) => sum + event.beats, 0), beats, id);
      return events.map((event) => {
        const rhythm = code[event.rhythm];
        assert.equal(event.beats, durations[rhythm], id);
        if (event.kind === 'rest') {
          assert.equal(event.pitch, undefined);
          assert.equal(event.finger, undefined);
          return rhythm;
        }
        return `${event.pitch}${rhythm}${event.finger}`;
      }).join(' ');
    });
    assert.equal(bars.join(' | '), expected, id);
  }
});

test('the validator rejects fractional-beat and split-pair errors', () => {
  const music = structuredClone(musicLibrary);
  const [first, second, last] = music['C02-038'].measures[0].events;
  music['C02-038'].measures[0].events = [first, last, second];
  music['C02-040'].measures[0].events[0].beats = 0.25;
  const { errors } = validateCurriculum({ music, assets: assetCatalog });
  assert.ok(errors.some(({ code, path }) => code === 'eighth-pair' && path.includes('C02-038')));
  assert.ok(errors.some(({ code, path }) => code === 'rhythm-beats' && path.includes('C02-040')));
  assert.ok(errors.some(({ code, path }) => code === 'measure-total' && path.includes('C02-040')));
});

test('whole notes are stemless, half rests sit above the middle line, and eighth beams meet both stems', () => {
  const whole = scoreMarkup(musicLibrary['C02-033']);
  const heads = [...whole.matchAll(/data-rhythm="whole">([^]*?)<\/g>/g)];
  assert.equal(heads.length, 2);
  for (const [, markup] of heads) {
    assert.match(markup, /notehead is-whole/);
    assert.doesNotMatch(markup, /note-stem/);
  }
  assert.match(beatGridMarkup(musicLibrary['C02-033']), /is-held"><strong>4<\/strong><span>hold/);
  const rest = musicLibrary['C02-036'];
  assert.match(scoreMarkup(rest), /class="half-rest"[^>]*y="47"[^>]*height="5"/);
  assert.match(scoreMarkup(rest), /half rest, two silent beats/);
  assert.match(beatGridMarkup(rest), /is-rest"><strong>3<\/strong><span>still silent/);
  for (const [id, count] of [['038', 1], ['039', 2], ['040', 1]]) {
    const example = musicLibrary[`C02-${id}`];
    const html = scoreMarkup(example);
    const beams = [...html.matchAll(/class="eighth-beam" x1="([\d.]+)" x2="([\d.]+)" y1="([\d.]+)" y2="([\d.]+)"/g)];
    const stems = [...html.matchAll(/data-rhythm="eighth">[^]*?class="note-stem" x1="([\d.]+)"[^>]*y2="([\d.]+)"/g)];
    assert.equal(beams.length, count, id);
    assert.equal(stems.length, count * 2, id);
    for (const [i, [, left, right, y1, y2]] of beams.entries()) {
      assert.equal(Number(right) - Number(left), 29.25);
      assert.deepEqual(stems.slice(2 * i, 2 * i + 2).map((stem) => stem.slice(1)), [[left, y1], [right, y2]]);
    }
    const grid = beatGridMarkup(example);
    assert.equal([...grid.matchAll(/<strong>/g)].length, example.measures.length * 2);
    assert.match(grid, /is-subdivided"><strong>[12] and/);
  }
});

test('all eight sessions open with an action and visual and use four complete phase labels', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const context = { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog };
  const sessions = sessionCatalog.slice(32, 40);
  assert.equal(sessions.length, 8);
  for (const session of sessions) {
    const render = (index) => renderSessionStep(session, index, progress.sessions[session.id], context);
    const opening = render(0);
    assert.match(opening, /class="music-score/, session.id);
    assert.match(opening, /class="try-block|learning-block try-block/, session.id);
    assert.match(opening, /<span>01<\/span>Explain/, session.id);
    assert.match(render(1), /<span>02<\/span>Demonstrate/, session.id);
    assert.match(render(2), /<span>03<\/span>Try it on your piano/, session.id);
    assert.match(render(2), /<span>04<\/span>Reflect/, session.id);
    assert.doesNotMatch([opening, render(1), render(2)].join(''), /autoplay|class="phase"><span><\/span>/);
  }
  const review = sessionCatalog[36];
  const html = renderSessionStep(review, 1, progress.sessions['037'], context);
  const visible = html.replace(/<details\b[^>]*>[\s\S]*?<\/details>/g, '');
  assert.match(visible, /Play the mystery rhythm/);
  assert.match(visible, /Card A/);
  assert.match(visible, /Card B/);
  assert.doesNotMatch(visible, /The mystery recording is|Play Card [AB]|C4 quarter|class="pitch-label"/);
  assert.match(html, /<details class="audio-details"><summary>Reveal the answer after choosing<\/summary>[^]*The mystery recording is Card B/);
});

test('a 32-session save expands and a Chapter 01 revisit leaves new rhythm-session progress intact', () => {
  const records = new Map();
  const storage = { getItem: (key) => records.get(key), setItem: (key, value) => records.set(key, value) };
  const old = createSessionProgressStore(storage, sessionCatalog.slice(0, 32));
  old.setCurrentSession('032');
  old.setStepIndex('032', 2);
  old.setReadiness('032', 'practicing');
  old.setSessionAssessment('032', 'understanding', true);
  const oldState = old.load().sessions['032'];
  const store = createSessionProgressStore(storage, sessionCatalog);
  const target = continueTarget('032', sessionCatalog, store.load());
  assert.deepEqual(target, { sessionId: '033', advancesCurrent: true });
  const progress = continueSession(store, '032', target.sessionId, target.advancesCurrent);
  assert.deepEqual(progress.sessions['032'], { ...oldState, completed: true });
  assert.match(renderSessionNavigation(sessionCatalog, progress, '033'), /data-session="033" aria-current="page"/);
  const earlier = revisitSession('024', sessionCatalog, progress, createNavigation(progress));
  assert.match(renderSessionNavigation(sessionCatalog, progress, earlier.viewingSessionId), /Chapter 01 · Available Sessions/);
  assert.deepEqual(store.load(), progress);
});
