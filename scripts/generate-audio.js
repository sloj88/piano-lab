import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { musicLibrary } from '../js/music-library.js';

export const SAMPLE_RATE = 16000;
const BEAT_SECONDS = 1;
const TONE_SECONDS = 0.78;

export function pitchFrequency(pitch) {
  const match = /^([A-G])(#|b)?([0-8])$/.exec(pitch);
  if (!match) throw new Error(`Invalid pitch: ${pitch}`);
  const semitones = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
  const accidental = match[2] === '#' ? 1 : match[2] === 'b' ? -1 : 0;
  const distanceFromA4 = semitones[match[1]] + accidental + (Number(match[3]) - 4) * 12;
  return 440 * (2 ** (distanceFromA4 / 12));
}

function addTone(samples, startSeconds, pitch, toneSeconds = TONE_SECONDS) {
  const start = Math.round(startSeconds * SAMPLE_RATE);
  const length = Math.round(toneSeconds * SAMPLE_RATE);
  const frequency = pitchFrequency(pitch);
  for (let index = 0; index < length; index += 1) {
    const time = index / SAMPLE_RATE;
    const attack = Math.min(1, time / 0.02);
    const release = Math.min(1, (toneSeconds - time) / 0.08);
    const envelope = Math.max(0, attack * release) * Math.exp(-1.4 * time);
    const fundamental = Math.sin(2 * Math.PI * frequency * time);
    const harmonic = 0.16 * Math.sin(2 * Math.PI * frequency * 2 * time);
    samples[start + index] = (fundamental + harmonic) * envelope * 0.36;
  }
}

function wavSamples(path) {
  const wav = readFileSync(path);
  if (wav.toString('ascii', 0, 4) !== 'RIFF' || wav.readUInt32LE(24) !== SAMPLE_RATE || wav.readUInt16LE(22) !== 1 || wav.readUInt16LE(34) !== 16) throw new Error(`Unsupported count sample: ${path}`);
  const samples = new Float32Array(wav.readUInt32LE(40) / 2);
  for (let index = 0; index < samples.length; index += 1) samples[index] = wav.readInt16LE(44 + index * 2) / 32768;
  return samples;
}

function mix(samples, source, startSeconds, gain = 0.72) {
  const start = Math.round(startSeconds * SAMPLE_RATE);
  for (let index = 0; index < source.length && start + index < samples.length; index += 1) samples[start + index] += source[index] * gain;
}

function synthesizeMetered(example, bpm, countSamples, spokenDuring = false) {
  const beatSeconds = 60 / bpm;
  const musicBeats = example.measures.length * example.meter.beats;
  const samples = new Float32Array(Math.ceil((4 + musicBeats) * beatSeconds * SAMPLE_RATE));
  for (let beat = 0; beat < 4; beat += 1) mix(samples, countSamples[beat], beat * beatSeconds + 0.04);
  example.measures.forEach((measure, measureIndex) => {
    let onset = 0;
    measure.events.forEach((event) => {
      const startBeat = 4 + measureIndex * example.meter.beats + onset;
      addTone(samples, startBeat * beatSeconds, event.pitch, Math.max(0.2, event.beats * beatSeconds - 0.12));
      onset += event.beats;
    });
  });
  if (spokenDuring) {
    for (let beat = 0; beat < musicBeats; beat += 1) mix(samples, countSamples[beat % 4], (4 + beat) * beatSeconds + 0.04, 0.82);
  }
  return samples;
}

export function synthesizePair(pair) {
  const patternSeconds = pair.first.length * BEAT_SECONDS;
  const secondStart = patternSeconds + BEAT_SECONDS;
  const durationSeconds = secondStart + pair.second.length * BEAT_SECONDS;
  const samples = new Float32Array(Math.round(durationSeconds * SAMPLE_RATE));
  pair.first.forEach((pitch, index) => addTone(samples, index * BEAT_SECONDS, pitch));
  pair.second.forEach((pitch, index) => addTone(samples, secondStart + index * BEAT_SECONDS, pitch));
  return samples;
}

export function encodeWav(samples) {
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * bytesPerSample, 28);
  buffer.writeUInt16LE(bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  samples.forEach((sample, index) => buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample)) * 32767), 44 + index * bytesPerSample));
  return buffer;
}

export function generateListeningAudio(outputDirectory, voiceDirectory = resolve(dirname(fileURLToPath(import.meta.url)), 'audio-voice')) {
  mkdirSync(outputDirectory, { recursive: true });
  for (const pair of musicLibrary.E001.pairs) {
    const filename = `e001-pair-${pair.id.toLowerCase()}.wav`;
    writeFileSync(resolve(outputDirectory, filename), encodeWav(synthesizePair(pair)));
  }
  const counts = [1, 2, 3, 4].map((number) => wavSamples(resolve(voiceDirectory, `count-${number}.wav`)));
  for (const suffix of ['A', 'B', 'C', 'D']) {
    const example = musicLibrary[`R002-${suffix}`];
    writeFileSync(resolve(outputDirectory, `r002-${suffix.toLowerCase()}-pattern.wav`), encodeWav(synthesizeMetered(example, 60, counts, false)));
    writeFileSync(resolve(outputDirectory, `r002-${suffix.toLowerCase()}-counted.wav`), encodeWav(synthesizeMetered(example, 60, counts, true)));
  }
  writeFileSync(resolve(outputDirectory, 'n001-a-shape.wav'), encodeWav(synthesizeMetered(musicLibrary['N001-A'], 60, counts, false)));
  writeFileSync(resolve(outputDirectory, 'p01-practice.wav'), encodeWav(synthesizeMetered(musicLibrary.P01, 56, counts, false)));
  writeFileSync(resolve(outputDirectory, 'p01-musical.wav'), encodeWav(synthesizeMetered(musicLibrary.P01, 64, counts, false)));
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  generateListeningAudio(resolve(dirname(scriptPath), '../assets/audio'));
}
