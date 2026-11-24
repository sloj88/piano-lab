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

function wavDuration(buffer) { return buffer.readUInt32LE(40) / 2 / SAMPLE_RATE; }

test('Slice B audio references exist locally with PCM metadata', () => {
  const references = [
    ...['A', 'B', 'C', 'D'].flatMap((suffix) => [musicLibrary[`R002-${suffix}`].audioRef, musicLibrary[`R002-${suffix}`].countedAudioRef]),
    musicLibrary['N001-A'].audioRef,
    ...musicLibrary.P01.audioRefs
  ];
  for (const reference of references) {
    const asset = assetCatalog[reference];
    assert.ok(asset, reference);
    const audio = readFileSync(new URL(`../${asset.src}`, import.meta.url));
    assert.equal(audio.toString('ascii', 0, 4), 'RIFF');
    assert.equal(audio.readUInt32LE(24), SAMPLE_RATE);
    assert.equal(audio.readUInt16LE(22), 1);
  }
});

test('rhythm echoes and piece recordings have the approved count-in and tempo lengths', () => {
  for (const suffix of ['A', 'B', 'C']) {
    for (const field of ['audioRef', 'countedAudioRef']) {
      const audio = readFileSync(new URL(`../${assetCatalog[musicLibrary[`R002-${suffix}`][field]].src}`, import.meta.url));
      assert.equal(wavDuration(audio), 8);
    }
  }
  const optional = readFileSync(new URL(`../${assetCatalog[musicLibrary['R002-D'].audioRef].src}`, import.meta.url));
  assert.equal(wavDuration(optional), 12);
  for (const [reference, bpm] of [['p01-practice', 56], ['p01-musical', 64]]) {
    const audio = readFileSync(new URL(`../${assetCatalog[reference].src}`, import.meta.url));
    assert.ok(Math.abs(wavDuration(audio) - (20 * 60 / bpm)) < 1 / SAMPLE_RATE);
  }
});

test('pattern recordings place approved pitches at their musical onsets', () => {
  const fixtures = [
    ...['A', 'B', 'C', 'D'].map((suffix) => [musicLibrary[`R002-${suffix}`], musicLibrary[`R002-${suffix}`].audioRef, 60]),
    [musicLibrary['N001-A'], musicLibrary['N001-A'].audioRef, 60],
    [musicLibrary.P01, 'p01-practice', 56],
    [musicLibrary.P01, 'p01-musical', 64]
  ];
  for (const [example, reference, bpm] of fixtures) {
    const audio = readFileSync(new URL(`../${assetCatalog[reference].src}`, import.meta.url));
    const beatSeconds = 60 / bpm;
    example.measures.forEach((measure, measureIndex) => {
      let onset = 0;
      measure.events.forEach((event) => {
        const start = (4 + measureIndex * example.meter.beats + onset) * beatSeconds;
        assert.ok(Math.abs(estimateFrequency(audio, start) - pitchFrequency(event.pitch)) < 4, `${reference} should sound ${event.pitch}`);
        onset += event.beats;
      });
    });
  }
});

test('the offline generator includes all four local spoken-count source samples', () => {
  for (const number of [1, 2, 3, 4]) assert.equal(existsSync(new URL(`../scripts/audio-voice/count-${number}.wav`, import.meta.url)), true);
});

test('Session 012 and 016 audio assets are local PCM files with approved durations', () => {
  for (const echo of musicLibrary.E002.echoes) {
    const audio = readFileSync(new URL(`../${assetCatalog[echo.audioRef].src}`, import.meta.url));
    assert.equal(audio.toString('ascii', 0, 4), 'RIFF');
    assert.equal(wavDuration(audio), 7);
  }
  for (const [reference, bpm] of [['p02-practice', 52], ['p02-musical', 60]]) {
    const audio = readFileSync(new URL(`../${assetCatalog[reference].src}`, import.meta.url));
    assert.equal(audio.toString('ascii', 0, 4), 'RIFF');
    assert.ok(Math.abs(wavDuration(audio) - (20 * 60 / bpm)) < 1 / SAMPLE_RATE);
  }
});

test('E002 and P02 recordings place every approved pitch at its musical onset', () => {
  for (const echo of musicLibrary.E002.echoes) {
    const audio = readFileSync(new URL(`../${assetCatalog[echo.audioRef].src}`, import.meta.url));
    echo.pitches.forEach((pitch, index) => assert.ok(Math.abs(estimateFrequency(audio, 4 + index) - pitchFrequency(pitch)) < 4, `${echo.audioRef} should sound ${pitch}`));
  }
  for (const [reference, bpm] of [['p02-practice', 52], ['p02-musical', 60]]) {
    const audio = readFileSync(new URL(`../${assetCatalog[reference].src}`, import.meta.url));
    const beatSeconds = 60 / bpm;
    musicLibrary.P02.measures.forEach((measure, measureIndex) => {
      const staff = measure.staves[measure.activeHand === 'RH' ? 'treble' : 'bass'];
      let onset = 0;
      staff.events.forEach((event) => {
        const start = (4 + measureIndex * 4 + onset) * beatSeconds;
        assert.ok(Math.abs(estimateFrequency(audio, start) - pitchFrequency(event.pitch)) < 4, `${reference} should sound ${event.pitch}`);
        onset += event.beats;
      });
    });
  }
});
