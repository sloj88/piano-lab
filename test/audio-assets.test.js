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

test('Chapter 02 models have exactly one spoken bar and the approved pitches and lengths at 56 bpm', () => {
  const beat = 60 / 56;
  for (const [id, count, musicBeats, notes] of [
    ['c02-030-model', 2, 8, [[0, 'C4', 1], [1, 'D4', 1], [2, 'E4', 2], [4, 'E4', 1], [5, 'D4', 1], [6, 'C4', 2]]],
    ['c02-032-model', 3, 6, [[0, 'C4', 2], [2, 'D4', 1], [3, 'E4', 1], [4, 'D4', 1], [5, 'C4', 1]]]
  ]) {
    const asset = assetCatalog[id];
    assert.equal(asset.src, `assets/audio/${id}.wav`);
    const audio = readFileSync(new URL(`../${asset.src}`, import.meta.url));
    const sample = (index) => audio.readInt16LE(44 + index * 2);
    assert.equal(audio.toString('ascii', 0, 4), 'RIFF');
    assert.equal(audio.readUInt32LE(24), SAMPLE_RATE);
    assert.equal(audio.readUInt32LE(40) / 2, Math.ceil((count + musicBeats) * beat * SAMPLE_RATE));
    for (let index = 0; index < count; index += 1) {
      const voice = readFileSync(new URL(`../scripts/audio-voice/count-${index + 1}.wav`, import.meta.url));
      const offset = Math.round((index * beat + 0.04) * SAMPLE_RATE);
      const voiceLength = voice.readUInt32LE(40) / 2;
      assert.ok(voiceLength > 0);
      for (let frame = 0; frame < voiceLength; frame += 29) {
        assert.ok(Math.abs(sample(offset + frame) - voice.readInt16LE(44 + frame * 2) * 0.72) <= 1);
      }
    }
    for (const [onset, pitch, duration] of notes) {
      const start = (count + onset) * beat;
      const frequency = pitchFrequency(pitch);
      assert.ok(Math.abs(estimateFrequency(audio, start) - frequency) <= 3);
      if (duration === 2) assert.ok(Math.abs(estimateFrequency(audio, start + beat) - frequency) <= 3);
      assert.equal(sample(Math.round((start + duration * beat - 0.05) * SAMPLE_RATE)), 0);
    }
  }
});

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

test('Sessions 019–020 audio is local, timed, pitched, and carries the specified relative contrast', () => {
  for (const reference of ['d001-soft-strong', 'm001-even', 'm001-shaped', 'c001-question-answer']) {
    const audio = readFileSync(new URL(`../${assetCatalog[reference].src}`, import.meta.url));
    assert.equal(audio.toString('ascii', 0, 4), 'RIFF');
    assert.equal(audio.readUInt32LE(24), SAMPLE_RATE);
  }

  for (const reference of ['m001-even', 'm001-shaped']) {
    const audio = readFileSync(new URL(`../${assetCatalog[reference].src}`, import.meta.url));
    assert.equal(wavDuration(audio), 12);
    const starts = [4, 5, 6, 8, 9, 10, 11];
    const pitches = ['C4', 'D4', 'E4', 'G4', 'E4', 'D4', 'C4'];
    pitches.forEach((pitch, index) => assert.ok(Math.abs(estimateFrequency(audio, starts[index]) - pitchFrequency(pitch)) < 4, `${reference} should sound ${pitch}`));
  }

  const dynamic = readFileSync(new URL(`../${assetCatalog['d001-soft-strong'].src}`, import.meta.url));
  assert.ok(Math.abs(wavDuration(dynamic) - (13 * 60 / 56)) < 1 / SAMPLE_RATE);
  const rms = (start, end) => {
    let total = 0;
    let count = 0;
    for (let index = Math.round(start * SAMPLE_RATE); index < Math.round(end * SAMPLE_RATE); index += 1) {
      const sample = dynamic.readInt16LE(44 + index * 2) / 32768;
      total += sample * sample;
      count += 1;
    }
    return Math.sqrt(total / count);
  };
  const beatSeconds = 60 / 56;
  assert.ok(rms(9 * beatSeconds, 13 * beatSeconds) > rms(4 * beatSeconds, 8 * beatSeconds) * 1.8, 'f group should be clearly stronger than p without asserting musical quality');

  const answer = readFileSync(new URL(`../${assetCatalog['c001-question-answer'].src}`, import.meta.url));
  assert.equal(wavDuration(answer), 16);
  [['E4', 12], ['D4', 13], ['C4', 14]].forEach(([pitch, start]) => assert.ok(Math.abs(estimateFrequency(answer, start) - pitchFrequency(pitch)) < 4));
});

test('P03 practice and performance audio preserves count-ins, tempo, rests, hand sequence, and contrast', () => {
  const durations = {
    'p03-rhythm-count': 36 * 60 / 52,
    'p03-sections': 42 * 60 / 52,
    'p03-performance': 36 * 60 / 62
  };
  for (const [reference, duration] of Object.entries(durations)) {
    const audio = readFileSync(new URL(`../${assetCatalog[reference].src}`, import.meta.url));
    assert.equal(audio.toString('ascii', 0, 4), 'RIFF');
    assert.ok(Math.abs(wavDuration(audio) - duration) < 1 / SAMPLE_RATE, reference);
  }

  const performance = readFileSync(new URL(`../${assetCatalog['p03-performance'].src}`, import.meta.url));
  const beatSeconds = 60 / 62;
  musicLibrary.P03.measures.forEach((measure, measureIndex) => {
    for (const staffName of ['treble', 'bass']) {
      let onset = 0;
      for (const event of measure.staves[staffName].events) {
        if (event.kind === 'note') {
          const start = (4 + measureIndex * 4 + onset) * beatSeconds;
          assert.ok(Math.abs(estimateFrequency(performance, start) - pitchFrequency(event.pitch)) < 4, `Measure ${measureIndex + 1} ${staffName} should sound ${event.pitch}`);
        }
        onset += event.beats;
      }
    }
  });

  const rms = (startBeat, endBeat) => {
    let total = 0;
    let count = 0;
    for (let index = Math.round(startBeat * beatSeconds * SAMPLE_RATE); index < Math.round(endBeat * beatSeconds * SAMPLE_RATE); index += 1) {
      const sample = performance.readInt16LE(44 + index * 2) / 32768;
      total += sample * sample;
      count += 1;
    }
    return Math.sqrt(total / count);
  };
  assert.ok(rms(20, 36) > rms(4, 20) * 1.6, 'Measures 5–8 should be clearly stronger than Measures 1–4 without asserting expressive quality');
});
