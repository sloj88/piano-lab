import test from 'node:test';
import assert from 'node:assert/strict';
import { nextPulseFrame, pulseIntervalMs } from '../js/pulse-guide.js';

test('pulse controls advance evenly and stop after the configured final beat', () => {
  assert.equal(pulseIntervalMs(60), 1000);
  let current = -1;
  for (let beat = 0; beat < 16; beat += 1) {
    const frame = nextPulseFrame(current, 16);
    assert.equal(frame.current, beat);
    assert.equal(frame.complete, false);
    current = frame.current;
  }
  assert.deepEqual(nextPulseFrame(current, 16), { current: 15, complete: true });
});

test('invalid pulse control metadata fails early', () => {
  assert.throws(() => pulseIntervalMs(0), /positive/);
  assert.throws(() => nextPulseFrame(-1, 0), /at least one beat/);
});
