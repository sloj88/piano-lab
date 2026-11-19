import test from 'node:test';
import assert from 'node:assert/strict';
import { PROGRESS_KEY, calculateProgress, createProgressStore } from '../js/progress.js';

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
}

test('progress saves separate understanding and playing indicators', () => {
  const store = createProgressStore(memoryStorage(), 5);
  store.setAssessment(0, 'understands', true);
  const progress = store.setAssessment(0, 'canPlay', false);
  assert.deepEqual(progress.steps[0], { understands: true, canPlay: false });
  assert.equal(calculateProgress(progress, 5), 10);
});
test('saved progress loads and clamps an invalid current step', () => {
  const storage = memoryStorage({ [PROGRESS_KEY]: JSON.stringify({ currentStep: 99, steps: { 1: { canPlay: true } } }) });
  const progress = createProgressStore(storage, 5).load();
  assert.equal(progress.currentStep, 4);
  assert.deepEqual(progress.steps[1], { understands: false, canPlay: true });
});

test('corrupt storage falls back safely and reset clears progress', () => {
  const store = createProgressStore(memoryStorage({ [PROGRESS_KEY]: '{broken' }), 5);
  assert.equal(store.load().currentStep, 0);
  store.setAssessment(2, 'canPlay', true);
  assert.equal(store.reset().steps[2].canPlay, false);
});

test('progress remains in memory when storage is unavailable', () => {
  const unavailableStorage = {
    getItem() { throw new Error('storage blocked'); },
    setItem() { throw new Error('storage blocked'); },
    removeItem() { throw new Error('storage blocked'); }
  };
  const store = createProgressStore(unavailableStorage, 5);

  store.setAssessment(2, 'understands', true);
  store.setCurrentStep(2);

  const progress = store.load();
  assert.equal(progress.currentStep, 2);
  assert.equal(progress.steps[2].understands, true);
});

test('a failed write does not let stale storage replace session progress', () => {
  const saved = JSON.stringify({ currentStep: 1, steps: { 1: { understands: true } } });
  const failingStorage = {
    getItem: () => saved,
    setItem() { throw new Error('quota exceeded'); },
    removeItem() { throw new Error('storage blocked'); }
  };
  const store = createProgressStore(failingStorage, 5);

  assert.equal(store.load().currentStep, 1);
  store.setCurrentStep(3);

  assert.equal(store.load().currentStep, 3);
  assert.equal(store.load().steps[1].understands, true);
});

