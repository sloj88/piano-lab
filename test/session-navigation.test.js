import test from 'node:test';
import assert from 'node:assert/strict';
import { availableSessionIds, canViewSession, continueTarget, createNavigation, nextAvailableSessionId, revisitSession } from '../js/session-navigation.js';
import { createSessionProgressStore } from '../js/session-progress.js';
import { sessionCatalog } from '../js/session-catalog.js';
import { continueSession } from '../js/session-actions.js';
import { renderSessionNavigation } from '../js/session-renderer.js';
import { renderHome } from '../js/home-renderer.js';

const sessions = ['001', '002', '003'].map((id) => ({ id, steps: [{ id: `${id}-step` }] }));

test('chapter sidebar follows Continue and revisits at the 024–025 boundary', () => {
  const catalog = ['023', '024', '025', '026'].map((id, index) => ({
    id, chapter: index < 2 ? 1 : 2, title: `Lesson ${id}`, type: 'Practice',
    duration: { min: 10, max: 15 }, steps: [{ id: 'first' }, { id: 'second' }]
  }));
  const store = createSessionProgressStore(null, catalog);
  store.setCurrentSession('024');
  store.setStepIndex('024', 1);
  store.setStepAssessment('024', 'second', 'canPlay', true);
  store.setSessionAssessment('024', 'understanding', true);
  store.setReadiness('024', 'practicing');
  const before = store.load();
  const sidebar = (progress, id) => renderSessionNavigation(catalog, progress, id);
  const entries = (html) => [...html.matchAll(/data-session="(\d+)"/g)].map((match) => match[1]);
  assert.match(sidebar(before, '024'), /Chapter 01 · Available Sessions/);
  assert.deepEqual(entries(sidebar(before, '024')), ['023', '024']);
  const target = continueTarget('024', catalog, before);
  assert.deepEqual(target, { sessionId: '025', advancesCurrent: true });
  const progress = continueSession(store, '024', target.sessionId, target.advancesCurrent);
  const next = revisitSession('025', catalog, progress, createNavigation(before));
  const chapterTwo = sidebar(progress, next.viewingSessionId);
  assert.match(chapterTwo, /Chapter 02 · Available Sessions/);
  assert.match(chapterTwo, /data-session="025" aria-current="page"/);
  assert.deepEqual(entries(chapterTwo), ['025']);

  const revisit = revisitSession('024', catalog, progress, next);
  const chapterOne = sidebar(progress, revisit.viewingSessionId);
  assert.match(chapterOne, /Chapter 01 · Available Sessions/);
  assert.match(chapterOne, /data-session="024" aria-current="page"><span>✓/);
  assert.deepEqual(entries(chapterOne), ['023', '024']);
  assert.match(renderHome(catalog, progress), /data-continue-learning="025"/);
  assert.deepEqual(store.load(), progress);
  assert.deepEqual(progress.sessions['024'], { ...before.sessions['024'], completed: true });
});

test('revisiting an earlier session never moves the current curriculum position backward', () => {
  const store = createSessionProgressStore(null, sessions);
  store.setCurrentSession('003');
  const progress = store.load();
  const navigation = revisitSession('001', sessions, progress, createNavigation(progress));
  assert.equal(navigation.viewingSessionId, '001');
  assert.equal(progress.currentSessionId, '003');
  assert.deepEqual(availableSessionIds(sessions, progress), ['001', '002', '003']);
});

test('a learner cannot navigate to a session beyond the current position', () => {
  const progress = createSessionProgressStore(null, sessions).load();
  const navigation = createNavigation(progress);
  assert.equal(canViewSession('002', sessions, progress), false);
  assert.deepEqual(revisitSession('002', sessions, progress, navigation), navigation);
});

test('navigation finds the next available session while revisiting', () => {
  const store = createSessionProgressStore(null, sessions);
  store.setCurrentSession('003');
  const progress = store.load();
  assert.equal(nextAvailableSessionId('001', sessions, progress), '002');
  assert.equal(nextAvailableSessionId('003', sessions, progress), null);
  assert.deepEqual(continueTarget('001', sessions, progress), { sessionId: '002', advancesCurrent: false });
  assert.deepEqual(continueTarget('003', sessions, progress), null);
});

test('continue advances current only from the current session, not from a revisit', () => {
  const store = createSessionProgressStore(null, sessions);
  store.setCurrentSession('002');
  const progress = store.load();
  assert.deepEqual(continueTarget('002', sessions, progress), { sessionId: '003', advancesCurrent: true });
  assert.deepEqual(continueTarget('001', sessions, progress), { sessionId: '002', advancesCurrent: false });
});

test('choosing stuck does not prevent an explicit continue to the next session', () => {
  const store = createSessionProgressStore(null, sessions);
  store.setReadiness('001', 'stuck');
  const continued = store.setCurrentSession('002');
  assert.equal(continued.sessions['001'].readiness, 'stuck');
  assert.equal(continued.currentSessionId, '002');
});

test('the implemented catalog advances consecutively through Sessions 001–032', () => {
  const store = createSessionProgressStore(null, sessionCatalog);
  for (let number = 2; number <= 32; number += 1) {
    const expected = String(number).padStart(3, '0');
    const current = store.load().currentSessionId;
    const target = continueTarget(current, sessionCatalog, store.load());
    assert.deepEqual(target, { sessionId: expected, advancesCurrent: true });
    store.completeSession(current);
    store.setCurrentSession(expected);
  }
  assert.deepEqual(availableSessionIds(sessionCatalog, store.load()), sessionCatalog.map(({ id }) => id));
  assert.equal(continueTarget('032', sessionCatalog, store.load()), null);
});

test('a Chapter 01 save continues into the real Chapter 02 catalog and revisits preserve progress', () => {
  const records = new Map();
  const storage = { getItem: (key) => records.get(key), setItem: (key, value) => records.set(key, value) };
  const priorStore = createSessionProgressStore(storage, sessionCatalog.slice(0, 24));
  priorStore.setCurrentSession('024');
  priorStore.completeSession('016');
  priorStore.setStepIndex('024', 2);
  priorStore.setSessionAssessment('024', 'understanding', true);
  priorStore.setSessionAssessment('024', 'playing', true);
  priorStore.setReadiness('024', 'practicing');
  const original = priorStore.load();

  const store = createSessionProgressStore(storage, sessionCatalog);
  const before = store.load();
  assert.deepEqual(before.sessions['024'], original.sessions['024']);
  assert.match(renderSessionNavigation(sessionCatalog, before, '024'), /Chapter 01 · Available Sessions/);
  const target = continueTarget('024', sessionCatalog, before);
  assert.deepEqual(target, { sessionId: '025', advancesCurrent: true });
  const after = continueSession(store, '024', target.sessionId, target.advancesCurrent);
  const sidebar = renderSessionNavigation(sessionCatalog, after, '025');
  assert.match(sidebar, /Chapter 02 · Available Sessions/);
  assert.deepEqual([...sidebar.matchAll(/data-session="(\d+)"/g)].map((match) => match[1]), ['025']);
  assert.match(sidebar, /data-session="025" aria-current="page"/);

  const revisit = revisitSession('024', sessionCatalog, after, createNavigation(after));
  const earlierSidebar = renderSessionNavigation(sessionCatalog, after, revisit.viewingSessionId);
  assert.match(earlierSidebar, /Chapter 01 · Available Sessions/);
  assert.match(earlierSidebar, /data-session="024" aria-current="page"><span>✓/);
  assert.doesNotMatch(earlierSidebar, /data-session="025"/);
  assert.match(renderHome(sessionCatalog, after), /data-continue-learning="025"/);
  assert.deepEqual(store.load(), after);
  assert.deepEqual(after.sessions['024'], { ...original.sessions['024'], completed: true });
  assert.deepEqual(after.sessions['016'], original.sessions['016']);
});
