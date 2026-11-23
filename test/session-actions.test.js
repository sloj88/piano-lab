import test from 'node:test';
import assert from 'node:assert/strict';
import { continueSession, finishSession } from '../js/session-actions.js';
import { sessionCatalog } from '../js/session-catalog.js';
import { createSessionProgressStore } from '../js/session-progress.js';

test('Finish for today records completion without moving curriculum position', () => {
  const store = createSessionProgressStore(null, sessionCatalog);
  const progress = finishSession(store, '001');
  assert.equal(progress.sessions['001'].completed, true);
  assert.equal(progress.currentSessionId, '001');
});

test('Continue records completion and advances only when requested', () => {
  const store = createSessionProgressStore(null, sessionCatalog);
  let progress = continueSession(store, '001', '002', true);
  assert.equal(progress.sessions['001'].completed, true);
  assert.equal(progress.currentSessionId, '002');
  store.setCurrentSession('004');
  progress = continueSession(store, '001', '002', false);
  assert.equal(progress.currentSessionId, '004');
  assert.equal(progress.sessions['001'].completed, true);
});
