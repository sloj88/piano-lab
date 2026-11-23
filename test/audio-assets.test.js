import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { assetCatalog } from '../js/session-catalog.js';
import { musicLibrary } from '../js/music-library.js';
import { SAMPLE_RATE, pitchFrequency } from '../scripts/generate-audio.js';

function estimateFrequency(buffer, startSeconds) {
  const sample = (index) => buffer.readInt16LE(44 + index * 2);
  const start = Math.round((startSeconds + 0.1) * SAMPLE_RATE);
  const end = Math.round((startSeconds + 0.6) * SAMPLE_RATE);
  let crossings = 0;
  for (let index = start + 1; index < end; index += 1) if (sample(index - 1) <= 0 && sample(index) > 0) crossings += 1;
  return crossings / 0.5;
}

test('all E001 recordings are local PCM audio with the approved seven-second timing', () => {
  for (const pair of musicLibrary.E001.pairs) {
    const asset = assetCatalog[pair.audioRef];
    const url = new URL(`../${asset.src}`, import.meta.url);
    assert.equal(existsSync(url), true, `${asset.src} should exist`);
    const audio = readFileSync(url);
    assert.equal(audio.toString('ascii', 0, 4), 'RIFF');
    assert.equal(audio.toString('ascii', 8, 12), 'WAVE');
    assert.equal(audio.readUInt32LE(24), SAMPLE_RATE);
    assert.equal(audio.readUInt16LE(22), 1);
    assert.equal(audio.readUInt32LE(40) / 2 / SAMPLE_RATE, 7);
  }
});

test('recorded tone positions follow every approved E001 pitch sequence', () => {
  const starts = [0, 1, 2, 4, 5, 6];
  for (const pair of musicLibrary.E001.pairs) {
    const audio = readFileSync(new URL(`../${assetCatalog[pair.audioRef].src}`, import.meta.url));
    const pitches = [...pair.first, ...pair.second];
    pitches.forEach((pitch, index) => {
      const measured = estimateFrequency(audio, starts[index]);
      const expected = pitchFrequency(pitch);
      assert.ok(Math.abs(measured - expected) < 4, `${pair.id} tone ${index + 1} should sound ${pitch}`);
    });
  }
});
