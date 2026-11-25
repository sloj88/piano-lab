import test from 'node:test';
import assert from 'node:assert/strict';
import { musicLibrary } from '../js/music-library.js';
import { bassPitchY, beatGridMarkup, notationText, pairedScoreMarkup, scoreMarkup, treblePitchY } from '../js/notation.js';

test('treble C, D, E, and G use adjacent diatonic staff positions', () => {
  assert.equal(treblePitchY('C4') - treblePitchY('D4'), 6);
  assert.equal(treblePitchY('D4') - treblePitchY('E4'), 6);
  assert.equal(treblePitchY('E4') - treblePitchY('G4'), 12);
});

test('treble notation includes clef, meter, correct note values, and middle-C ledger lines', () => {
  const html = scoreMarkup(musicLibrary.P01, { measureNumbers: true, showStartingFinger: true });
  assert.match(html, /class="treble-clef"/);
  assert.match(html, /class="time-signature"/);
  assert.equal((html.match(/class="barline"/g) ?? []).length, 4);
  assert.equal((html.match(/class="ledger-line"/g) ?? []).length, 6);
  assert.equal((html.match(/notehead is-half/g) ?? []).length, 3);
  assert.equal((html.match(/class="measure-number"/g) ?? []).length, 4);
  assert.match(html, /data-pitch="C4" data-rhythm="quarter"/);
});

test('neutral contour notation preserves shape without treble-specific symbols', () => {
  const html = scoreMarkup(musicLibrary['N001-A']);
  assert.doesNotMatch(html, /treble-clef|time-signature|ledger-line/);
  assert.match(html, /Contour A/);
});

test('beat guides total four visible counts per approved measure', () => {
  const html = beatGridMarkup(musicLibrary.P01);
  assert.equal((html.match(/<strong>[1-4]<\/strong>/g) ?? []).length, 16);
  assert.equal((html.match(/class="is-held"/g) ?? []).length, 3);
});

test('enlarged score mode increases horizontal note spacing without changing music data', () => {
  const regular = scoreMarkup(musicLibrary.P01);
  const enlarged = scoreMarkup(musicLibrary.P01, { enlarged: true });
  const width = (html) => Number(html.match(/--score-width:(\d+)px/)[1]);
  assert.ok(width(enlarged) > width(regular));
  assert.equal((enlarged.match(/data-pitch=/g) ?? []).length, (regular.match(/data-pitch=/g) ?? []).length);
});

test('bass C, D, E, and F occupy the approved line and space positions', () => {
  assert.equal(bassPitchY('C3'), 58);
  assert.equal(bassPitchY('D3'), 52);
  assert.equal(bassPitchY('E3'), 46);
  assert.equal(bassPitchY('F3'), 40);
  assert.equal(bassPitchY('C3') - bassPitchY('D3'), 6);
});

test('bass notation renders its clef, meter, notes, and accessible pitch description', () => {
  const html = scoreMarkup(musicLibrary['N004-A'], { showLabels: true });
  assert.match(html, /class="bass-clef"/);
  assert.doesNotMatch(html, /class="treble-clef"/);
  assert.match(html, /C3 quarter/);
  assert.match(html, /F3 quarter/);
});

test('paired P02 notation aligns two staves, barlines, hand labels, and whole-measure rests', () => {
  const html = pairedScoreMarkup(musicLibrary.P02, { showEntranceFingers: true });
  assert.equal((html.match(/class="treble-clef"/g) ?? []).length, 1);
  assert.equal((html.match(/class="bass-clef"/g) ?? []).length, 1);
  assert.equal((html.match(/whole-measure-rest/g) ?? []).length, 8);
  assert.equal((html.match(/paired-barline/g) ?? []).length, 4);
  assert.equal((html.match(/class="active-hand-label"/g) ?? []).length, 4);
  assert.match(notationText(musicLibrary.P02), /LH waits for all four beats/);
  assert.match(notationText(musicLibrary.P02), /RH waits for all four beats/);
});

test('quarter rests occupy one beat in notation, count guides, and accessible text', () => {
  const html = scoreMarkup(musicLibrary['R003-A']);
  const grid = beatGridMarkup(musicLibrary['R003-A']);
  assert.equal((html.match(/class="quarter-rest"/g) ?? []).length, 1);
  assert.match(html, /quarter rest, one silent beat/);
  assert.match(html, /𝄽/);
  assert.equal((grid.match(/<strong>[1-4]<\/strong>/g) ?? []).length, 4);
  assert.match(grid, /rest · silent/);
});

test('P03 renders aligned eight-measure staves, approved entrances, dynamics, and the Measure 7 timeline', () => {
  const html = pairedScoreMarkup(musicLibrary.P03, { showEntranceFingers: true });
  assert.equal((html.match(/paired-barline/g) ?? []).length, 8);
  assert.equal((html.match(/class="active-hand-label"/g) ?? []).length, 6);
  assert.equal((html.match(/class="dynamic-label"/g) ?? []).length, 2);
  assert.equal((html.match(/class="quarter-rest"/g) ?? []).length, 5);
  assert.equal((html.match(/whole-measure-rest/g) ?? []).length, 14);
  assert.match(html, />p<\/text>/);
  assert.match(html, />f<\/text>/);
  assert.match(html, /<em>p<\/em> = soft; <em>f<\/em> = strong, never forced/);
  const text = notationText(musicLibrary.P03);
  assert.match(text, /Measure 7: RH quarter rest, one silent beat, quarter rest, one silent beat, C4 quarter, D4 quarter/);
  assert.match(text, /LH C3 quarter, quarter rest, one silent beat, quarter rest, one silent beat, quarter rest, one silent beat/);
});
