import test from 'node:test';
import assert from 'node:assert/strict';
import { assetCatalog, sessionCatalog } from '../js/session-catalog.js';
import { musicLibrary } from '../js/music-library.js';
import { reinforcementCatalog } from '../js/reinforcements.js';
import { assertValidCurriculum, ContentValidationError } from '../js/content-validator.js';
import { beatGridMarkup, pairedScoreMarkup, scoreMarkup } from '../js/notation.js';
import { renderSessionStep } from '../js/session-renderer.js';
import { createEmptySessionProgress } from '../js/session-progress.js';

const fixtures = [
  ['026', 'treble', 4, 'E4q3 D4q2 C4h1 | C4q1 D4q2 E4h3'],
  ['027', 'treble', 4, 'G4q5 F4q4 E4h3 | E4q3 F4q4 F4q4 G4q5'],
  ['028', 'bass', 4, 'F3q2 G3q1 F3h2 | F3q2 E3q3 D3q4 C3q5'],
  ['029-T', 'treble', 4, 'F4q4 E4q3 D4h2 | C4q1 D4q2 E4h3'],
  ['029-B', 'bass', 4, 'E3q3 F3q2 G3h1 | G3q1 F3q2 E3h3'],
  ['030', 'treble', 2, 'C4q1 D4q2 | E4h3 | E4q3 D4q2 | C4h1'],
  ['031', 'bass', 2, 'C3q5 rq | D3q4 E3q3 | D3q4 rq | C3h5'],
  ['032', 'treble', 3, 'C4h1 D4q2 | E4q3 D4q2 C4q1']
];
const compact = (events) => events.map(({ kind, pitch, finger, rhythm }) => kind === 'rest'
  ? ({ 'quarter-rest': 'rq', 'whole-measure-rest': 'wr' })[rhythm]
  : `${pitch}${({ quarter: 'q', half: 'h' })[rhythm]}${finger}`).join(' ');

test('Chapter 02 cards preserve exact meters, pitches, hands, fingering, and note/rest durations', () => {
  for (const [id, clef, beats, expected] of fixtures) {
    const example = musicLibrary[`C02-${id}`];
    assert.deepEqual(example.meter, { beats, beatValue: 4 }, id);
    assert.equal(example.notation.clef, clef);
    assert.equal(example.hand, clef === 'bass' ? 'LH' : 'RH');
    assert.equal(example.measures.map(({ events }) => compact(events)).join(' | '), expected);
    for (const { events } of example.measures) {
      assert.equal(events.reduce((total, event) => total + event.beats, 0), beats);
      for (const event of events) assert.equal(event.beats, event.rhythm === 'half' ? 2 : 1);
    }
  }
  const paired = musicLibrary['C02-025'];
  assert.deepEqual(paired.meter, { beats: 4, beatValue: 4 });
  assert.deepEqual(paired.measures.map(({ activeHand, staves }) => [activeHand, compact(staves.treble.events), compact(staves.bass.events)]), [
    ['RH', 'C4q1 D4q2 E4h3', 'wr'], ['LH', 'wr', 'C3q5 D3q4 E3h3']
  ]);
  for (const { staves } of paired.measures) {
    for (const staff of Object.values(staves)) assert.equal(staff.events.reduce((sum, event) => sum + event.beats, 0), 4);
  }
  assert.match(pairedScoreMarkup(paired), /RH C4 quarter.*LH waits for all four beats/);
});

test('unsupported meter and wrong totals are rejected in the new cards', () => {
  const music = structuredClone(musicLibrary);
  music['C02-030'].meter.beatValue = 8;
  music['C02-031'].measures[0].events.pop();
  music['C02-032'].measures[0].events[0].beats = 1;
  assert.throws(() => assertValidCurriculum({ music, assets: assetCatalog }), (error) => {
    assert.ok(error instanceof ContentValidationError);
    for (const [id, code] of [['030', 'meter'], ['031', 'measure-total'], ['032', 'measure-total'], ['032', 'rhythm-beats']]) {
      assert.ok(error.issues.some((issue) => issue.path.startsWith(`music.C02-${id}`) && issue.code === code), `${id} ${code}`);
    }
    return true;
  });
});

test('2/4 and 3/4 scores show meter, matching grids, beat spacing, and scrollable descriptions', () => {
  for (const [id, beats] of [['030', 2], ['031', 2], ['032', 3]]) {
    const example = musicLibrary[`C02-${id}`];
    const html = scoreMarkup(example);
    assert.match(html, new RegExp(`class="time-signature"><text[^>]+>${beats}</text><text[^>]+>4</text>`));
    assert.match(html, new RegExp(`clef, (left|right) hand, ${beats}/4`));
    assert.match(html, /class="score-scroll" tabindex="0"/);
    const enlarged = scoreMarkup(example, { enlarged: true });
    const width = (markup) => Number(markup.match(/--score-width:(\d+)px/)[1]);
    assert.ok(width(enlarged) > width(html));
    const grid = beatGridMarkup(example);
    assert.equal([...grid.matchAll(/<strong>(\d)<\/strong>/g)].length, beats * example.measures.length);
    assert.match(grid, new RegExp(`--measure-beats:${beats}`));
  }
  const bass = musicLibrary['C02-031'];
  const html = scoreMarkup(bass);
  const x = (markup) => Number(markup.match(/ x="([\d.]+)"/)[1]);
  const rests = [...html.matchAll(/class="quarter-rest"[^>]+><text([^>]+)/g)];
  assert.equal(rests.length, 2);
  const bars = [...html.matchAll(/class="barline" x1="([\d.]+)"/g)].map((match) => Number(match[1]));
  const firstNoteX = Number(html.match(/data-pitch="C3"[^>]+>\s*<ellipse[^>]+cx="([\d.]+)"/)[1]);
  assert.equal(x(rests[0][1]) - firstNoteX, (bars[1] - bars[0] - 28) / 2);
  assert.match(beatGridMarkup(bass), /is-rest"><strong>2<\/strong><span>rest · silent/);
});

test('each Chapter 02 session renders the lesson phases, check-in and matched support', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const context = { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog };
  for (const session of sessionCatalog.slice(24)) {
    const state = { ...progress.sessions[session.id], readiness: 'stuck' };
    const html = session.steps.map((_, index) => renderSessionStep(session, index, state, context)).join('');
    for (const required of ['explain-block', 'demonstrate-block', 'try-block', 'reflect-block', 'I understand it', 'I can play it', 'Ready', 'Practicing', 'Stuck', 'Keep Playing']) assert.ok(html.includes(required), session.id + ' ' + required);
    assert.match(html, /data-reinforcement="RF02-[A-Z]+"/);
    assert.match(html, /data-revisit-session="\d{3}"/);
    assert.doesNotMatch(html, /autoplay/);
  }
  const review = sessionCatalog[28];
  const reviewHtml = renderSessionStep(review, 2, progress.sessions['029'], context);
  const visible = reviewHtml.split('<details class="score-reveal"')[0];
  assert.match(visible, /first space, quarter note/);
  assert.doesNotMatch(visible, /F4 quarter|class="pitch-label"|class="finger-label"/);
  assert.match(reviewHtml, /F4 quarter/);
});
