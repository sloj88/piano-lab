import test from 'node:test';
import assert from 'node:assert/strict';
import { PROGRESS_KEY as LEGACY_PROGRESS_KEY } from '../js/progress.js';
import { sessionCatalog } from '../js/session-catalog.js';
import { SESSION_PROGRESS_KEY, calculateAssessmentProgress, createSessionProgressStore } from '../js/session-progress.js';

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    value: (key) => values.get(key)
  };
}

test('session progress keeps completion, assessments, readiness, and current position independent', () => {
  const storage = memoryStorage();
  const store = createSessionProgressStore(storage, sessionCatalog);
  store.setStepAssessment('001', 'discover-keyboard', 'understands', true);
  store.setSessionAssessment('001', 'understanding', true);
  store.setReadiness('001', 'stuck');
  store.completeSession('001');
  const progress = store.load();
  assert.equal(progress.currentSessionId, '001');
  assert.equal(progress.sessions['001'].completed, true);
  assert.equal(progress.sessions['001'].understanding, true);
  assert.equal(progress.sessions['001'].playing, false);
  assert.equal(progress.sessions['001'].readiness, 'stuck');
  assert.equal(progress.sessions['001'].stepAssessments['discover-keyboard'].understands, true);
});

test('completion and independent reflection state survive a new store instance', () => {
  const storage = memoryStorage();
  const first = createSessionProgressStore(storage, sessionCatalog);
  first.setSessionAssessment('001', 'understanding', true);
  first.setReadiness('001', 'practicing');
  first.completeSession('001');
  const reloaded = createSessionProgressStore(storage, sessionCatalog).load();
  assert.equal(reloaded.sessions['001'].completed, true);
  assert.equal(reloaded.sessions['001'].understanding, true);
  assert.equal(reloaded.sessions['001'].playing, false);
  assert.equal(reloaded.sessions['001'].readiness, 'practicing');
});

test('repeating a completed session changes its step without erasing completion or reflections', () => {
  const store = createSessionProgressStore(memoryStorage(), sessionCatalog);
  store.completeSession('001');
  store.setSessionAssessment('001', 'playing', true);
  store.setStepIndex('001', 4);
  const repeated = store.setStepIndex('001', 0);
  assert.equal(repeated.sessions['001'].stepIndex, 0);
  assert.equal(repeated.sessions['001'].completed, true);
  assert.equal(repeated.sessions['001'].playing, true);
});

test('self-assessment percentage is independent from position, repeat, and completion', () => {
  const store = createSessionProgressStore(memoryStorage(), sessionCatalog);
  store.setStepAssessment('001', 'discover-keyboard', 'understands', true);
  store.setStepAssessment('001', 'discover-keyboard', 'canPlay', true);
  store.setStepIndex('001', 4);
  store.completeSession('001');
  const atEnd = store.load().sessions['001'];
  assert.equal(calculateAssessmentProgress(sessionCatalog[0], atEnd), 20);
  const repeated = store.setStepIndex('001', 0).sessions['001'];
  assert.equal(repeated.completed, true);
  assert.equal(calculateAssessmentProgress(sessionCatalog[0], repeated), 20);
});

test('revisiting a prior session reads its preserved assessment percentage', () => {
  const sessions = [
    { id: '001', steps: [{ id: 'one' }, { id: 'two' }] },
    { id: '002', steps: [{ id: 'three' }] }
  ];
  const store = createSessionProgressStore(memoryStorage(), sessions);
  store.setStepAssessment('001', 'one', 'understands', true);
  store.setStepAssessment('001', 'one', 'canPlay', true);
  store.setCurrentSession('002');
  store.setStepIndex('001', 0);
  const progress = store.load();
  assert.equal(progress.currentSessionId, '002');
  assert.equal(calculateAssessmentProgress(sessions[0], progress.sessions['001']), 50);
});

test('v0.1 progress migrates without modifying the legacy storage record', () => {
  const legacy = JSON.stringify({ currentStep: 2, steps: { 0: { understands: true, canPlay: true }, 2: { understands: true, canPlay: false } } });
  const storage = memoryStorage({ [LEGACY_PROGRESS_KEY]: legacy });
  const store = createSessionProgressStore(storage, sessionCatalog);
  const progress = store.load();
  assert.equal(progress.sessions['001'].stepIndex, 2);
  assert.deepEqual(progress.sessions['001'].stepAssessments['discover-keyboard'], { understands: true, canPlay: true });
  assert.deepEqual(progress.sessions['001'].stepAssessments['learn-five-notes'], { understands: true, canPlay: false });
  assert.equal(progress.sessions['001'].completed, false);
  assert.equal(calculateAssessmentProgress(sessionCatalog[0], progress.sessions['001']), 30);
  assert.equal(storage.value(LEGACY_PROGRESS_KEY), legacy);
  store.setReadiness('001', 'practicing');
  assert.ok(storage.value(SESSION_PROGRESS_KEY));
  assert.equal(storage.value(LEGACY_PROGRESS_KEY), legacy);
});

test('reset writes fresh v2 state so legacy progress is preserved but not re-imported', () => {
  const legacy = JSON.stringify({ currentStep: 4, steps: { 4: { understands: true, canPlay: true } } });
  const storage = memoryStorage({ [LEGACY_PROGRESS_KEY]: legacy });
  const store = createSessionProgressStore(storage, sessionCatalog);
  store.load();
  const reset = store.reset();
  assert.equal(reset.sessions['001'].stepIndex, 0);
  assert.equal(storage.value(LEGACY_PROGRESS_KEY), legacy);
  assert.equal(JSON.parse(storage.value(SESSION_PROGRESS_KEY)).sessions['001'].stepIndex, 0);
});

test('reinforcement history is supportive metadata and does not alter completion', () => {
  const store = createSessionProgressStore(memoryStorage(), sessionCatalog);
  store.recordReinforcement('RF-KG-1', 'stuck');
  const progress = store.recordReinforcement('RF-KG-1', 'stuck');
  assert.deepEqual(progress.reinforcementHistory, [{ reinforcementId: 'RF-KG-1', kind: 'stuck', count: 2 }]);
  assert.equal(progress.sessions['001'].completed, false);
});

test('session progress remains in memory when storage reads or writes fail', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  const store = createSessionProgressStore(blocked, sessionCatalog);
  store.setReadiness('001', 'practicing');
  store.setStepIndex('001', 3);
  assert.equal(store.load().sessions['001'].readiness, 'practicing');
  assert.equal(store.load().sessions['001'].stepIndex, 3);
});

test('a failed v2 write cannot let stale storage replace in-session progress', () => {
  const saved = JSON.stringify({ schemaVersion: 2, currentSessionId: '001', sessions: { '001': { stepIndex: 1 } }, reinforcementHistory: [] });
  const failing = { getItem: (key) => key === SESSION_PROGRESS_KEY ? saved : null, setItem() { throw new Error('quota'); } };
  const store = createSessionProgressStore(failing, sessionCatalog);
  assert.equal(store.load().sessions['001'].stepIndex, 1);
  store.setStepIndex('001', 4);
  assert.equal(store.load().sessions['001'].stepIndex, 4);
});

test('an unknown future schema is never overwritten by this version', () => {
  const future = JSON.stringify({ schemaVersion: 3, futureData: { keep: true } });
  const storage = memoryStorage({ [SESSION_PROGRESS_KEY]: future });
  const store = createSessionProgressStore(storage, sessionCatalog);
  store.load();
  store.setStepIndex('001', 3);
  assert.equal(store.load().sessions['001'].stepIndex, 3);
  assert.equal(storage.value(SESSION_PROGRESS_KEY), future);
});

test('an existing four-session v2 record gains new session defaults without losing saved progress', () => {
  const oldCatalog = sessionCatalog.slice(0, 4);
  const oldStore = createSessionProgressStore(memoryStorage(), oldCatalog);
  oldStore.setCurrentSession('004');
  oldStore.setSessionAssessment('002', 'understanding', true);
  oldStore.completeSession('001');
  const saved = JSON.stringify(oldStore.load());
  const expanded = createSessionProgressStore(memoryStorage({ [SESSION_PROGRESS_KEY]: saved }), sessionCatalog).load();
  assert.equal(expanded.currentSessionId, '004');
  assert.equal(expanded.sessions['001'].completed, true);
  assert.equal(expanded.sessions['002'].understanding, true);
  assert.equal(expanded.sessions['005'].completed, false);
  assert.equal(expanded.sessions['010'].stepIndex, 0);
});

test('an existing ten-session v2 record gains Sessions 011–016 without losing saved progress', () => {
  const oldCatalog = sessionCatalog.slice(0, 10);
  const storage = memoryStorage();
  const oldStore = createSessionProgressStore(storage, oldCatalog);
  oldStore.setCurrentSession('010');
  oldStore.setReadiness('010', 'ready');
  oldStore.completeSession('010');
  const expanded = createSessionProgressStore(storage, sessionCatalog).load();
  assert.equal(expanded.currentSessionId, '010');
  assert.equal(expanded.sessions['010'].completed, true);
  assert.equal(expanded.sessions['010'].readiness, 'ready');
  assert.equal(expanded.sessions['011'].completed, false);
  assert.equal(expanded.sessions['016'].stepIndex, 0);
});

test('an existing twenty-session record gains Sessions 021–024 without losing saved progress', () => {
  const oldCatalog = sessionCatalog.slice(0, 20);
  const storage = memoryStorage();
  const oldStore = createSessionProgressStore(storage, oldCatalog);
  oldStore.setCurrentSession('020');
  oldStore.setReadiness('020', 'practicing');
  oldStore.completeSession('019');
  const expanded = createSessionProgressStore(storage, sessionCatalog).load();
  assert.equal(expanded.currentSessionId, '020');
  assert.equal(expanded.sessions['019'].completed, true);
  assert.equal(expanded.sessions['020'].readiness, 'practicing');
  assert.equal(expanded.sessions['021'].completed, false);
  assert.equal(expanded.sessions['024'].stepIndex, 0);
});

test('progress and independent readiness survive reload across all twenty-four sessions', () => {
  const storage = memoryStorage();
  const store = createSessionProgressStore(storage, sessionCatalog);
  for (const session of sessionCatalog) {
    store.setSessionAssessment(session.id, 'understanding', session.id !== '003');
    store.setSessionAssessment(session.id, 'playing', session.id === '001' || session.id === '004');
    store.setReadiness(session.id, session.id === '002' ? 'stuck' : 'practicing');
    store.completeSession(session.id);
  }
  store.setCurrentSession('024');
  const reloaded = createSessionProgressStore(storage, sessionCatalog).load();
  assert.equal(reloaded.currentSessionId, '024');
  assert.equal(reloaded.sessions['002'].readiness, 'stuck');
  assert.equal(reloaded.sessions['003'].understanding, false);
  assert.equal(reloaded.sessions['004'].playing, true);
  assert.equal(reloaded.sessions['024'].readiness, 'practicing');
  assert.equal(Object.values(reloaded.sessions).every(({ completed }) => completed), true);
});
