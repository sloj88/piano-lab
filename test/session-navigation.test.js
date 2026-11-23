import test from 'node:test';
import assert from 'node:assert/strict';
import { availableSessionIds, canViewSession, continueTarget, createNavigation, nextAvailableSessionId, revisitSession } from '../js/session-navigation.js';
import { createSessionProgressStore } from '../js/session-progress.js';

const sessions = ['001', '002', '003'].map((id) => ({ id, steps: [{ id: `${id}-step` }] }));

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
