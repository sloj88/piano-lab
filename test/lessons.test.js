import test from 'node:test';
import assert from 'node:assert/strict';
import { BLACK_KEYS, WHITE_NOTES, getKey, isCBeforeTwoBlackKeys, lesson } from '../js/lessons.js';

test('white notes repeat in the correct C through B order', () => {
  assert.deepEqual(WHITE_NOTES.slice(0, 7).map(({ note }) => note), ['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  assert.equal(getKey('C4').index, 7);
});
test('black keys form groups of two and three', () => {
  assert.deepEqual(BLACK_KEYS.filter(({ after }) => after < 7).map(({ after }) => after), [0, 1, 3, 4, 5]);
});

test('each C is immediately left of a two-black-key group', () => {
  assert.equal(isCBeforeTwoBlackKeys('C3'), true);
  assert.equal(isCBeforeTwoBlackKeys('C4'), true);
  assert.equal(isCBeforeTwoBlackKeys('D4'), false);
});

test('the published Session 001 teaching sequence remains intact', () => {
  assert.deepEqual(lesson.steps.map(({ id }) => id), ['discover-keyboard', 'find-c', 'learn-five-notes', 'finger-pattern', 'first-melody']);
  assert.match(lesson.steps[1].explain.join(' '), /fourth C from the left/);
  assert.match(lesson.steps[3].tryIt, /play up and down three times/);
  assert.deepEqual(lesson.steps[4].melody.map(({ note, finger }) => `${note}${finger}`), ['C1', 'D2', 'E3', 'G5', 'E3', 'D2', 'C1']);
  assert.match(lesson.steps[4].reflect, /mistakes are useful information/);
});

