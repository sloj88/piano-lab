import { mkdirSync, writeFileSync } from 'node:fs';
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

function addTone(samples, startSeconds, pitch) {
  const start = Math.round(startSeconds * SAMPLE_RATE);
  const length = Math.round(TONE_SECONDS * SAMPLE_RATE);
  const frequency = pitchFrequency(pitch);
  for (let index = 0; index < length; index += 1) {
    const time = index / SAMPLE_RATE;
    const attack = Math.min(1, time / 0.02);
    const release = Math.min(1, (TONE_SECONDS - time) / 0.08);
    const envelope = Math.max(0, attack * release) * Math.exp(-1.4 * time);
    const fundamental = Math.sin(2 * Math.PI * frequency * time);
    const harmonic = 0.16 * Math.sin(2 * Math.PI * frequency * 2 * time);
    samples[start + index] = (fundamental + harmonic) * envelope * 0.36;
  }
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

export function generateListeningAudio(outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  for (const pair of musicLibrary.E001.pairs) {
    const filename = `e001-pair-${pair.id.toLowerCase()}.wav`;
    writeFileSync(resolve(outputDirectory, filename), encodeWav(synthesizePair(pair)));
  }
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  generateListeningAudio(resolve(dirname(scriptPath), '../assets/audio'));
}
