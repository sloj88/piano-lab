import test from 'node:test';
import assert from 'node:assert/strict';
import { musicLibrary } from '../js/music-library.js';
import { beatGridMarkup, scoreMarkup, treblePitchY } from '../js/notation.js';

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
