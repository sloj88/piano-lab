export function finishSession(store, sessionId) {
  return store.completeSession(sessionId);
}

export function continueSession(store, sessionId, targetSessionId, advancesCurrent) {
  let progress = store.completeSession(sessionId);
  if (advancesCurrent) progress = store.setCurrentSession(targetSessionId);
  return progress;
}
