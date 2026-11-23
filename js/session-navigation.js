export function availableSessionIds(sessions, progress) {
  const currentIndex = sessions.findIndex(({ id }) => id === progress.currentSessionId);
  return sessions.slice(0, Math.max(0, currentIndex) + 1).map(({ id }) => id);
}

export function canViewSession(sessionId, sessions, progress) {
  return availableSessionIds(sessions, progress).includes(sessionId);
}

export function revisitSession(sessionId, sessions, progress, navigation) {
  if (!canViewSession(sessionId, sessions, progress)) return navigation;
  return { ...navigation, viewingSessionId: sessionId };
}

export function nextSessionId(sessionId, sessions) {
  const index = sessions.findIndex(({ id }) => id === sessionId);
  return index >= 0 ? sessions[index + 1]?.id ?? null : null;
}

export function nextAvailableSessionId(sessionId, sessions, progress) {
  const next = nextSessionId(sessionId, sessions);
  return next && canViewSession(next, sessions, progress) ? next : null;
}

export function continueTarget(sessionId, sessions, progress) {
  const next = nextSessionId(sessionId, sessions);
  if (!next) return null;
  if (sessionId === progress.currentSessionId) return { sessionId: next, advancesCurrent: true };
  return canViewSession(next, sessions, progress) ? { sessionId: next, advancesCurrent: false } : null;
}

export function createNavigation(progress) {
  return { viewingSessionId: progress.currentSessionId };
}
