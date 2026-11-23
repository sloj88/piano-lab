import { PROGRESS_KEY as LEGACY_PROGRESS_KEY } from './progress.js';

export const SESSION_PROGRESS_KEY = 'piano-lab.progress.v2';
export const SESSION_PROGRESS_VERSION = 2;
export const READINESS_STATES = ['ready', 'practicing', 'stuck'];

function defaultSessionState(session) {
  return {
    completed: false,
    stepIndex: 0,
    understanding: false,
    playing: false,
    readiness: null,
    stepAssessments: Object.fromEntries(session.steps.map((step) => [step.id, { understands: false, canPlay: false }]))
  };
}

export function createEmptySessionProgress(sessions) {
  return {
    schemaVersion: SESSION_PROGRESS_VERSION,
    currentSessionId: sessions[0]?.id ?? null,
    sessions: Object.fromEntries(sessions.map((session) => [session.id, defaultSessionState(session)])),
    reinforcementHistory: []
  };
}

function normalizeSessionState(value, session) {
  const defaults = defaultSessionState(session);
  const safe = value && typeof value === 'object' ? value : {};
  const stepAssessments = { ...defaults.stepAssessments };
  for (const step of session.steps) {
    const assessment = safe.stepAssessments?.[step.id] ?? {};
    stepAssessments[step.id] = { understands: assessment.understands === true, canPlay: assessment.canPlay === true };
  }
  return {
    completed: safe.completed === true,
    stepIndex: Number.isInteger(safe.stepIndex) ? Math.max(0, Math.min(safe.stepIndex, session.steps.length - 1)) : 0,
    understanding: safe.understanding === true,
    playing: safe.playing === true,
    readiness: READINESS_STATES.includes(safe.readiness) ? safe.readiness : null,
    stepAssessments
  };
}

export function normalizeSessionProgress(value, sessions) {
  const empty = createEmptySessionProgress(sessions);
  const safe = value && typeof value === 'object' && value.schemaVersion === SESSION_PROGRESS_VERSION ? value : {};
  const sessionIds = sessions.map(({ id }) => id);
  const currentSessionId = sessionIds.includes(safe.currentSessionId) ? safe.currentSessionId : empty.currentSessionId;
  const reinforcementHistory = Array.isArray(safe.reinforcementHistory)
    ? safe.reinforcementHistory.filter((entry) => entry && typeof entry.reinforcementId === 'string').map((entry) => ({
      reinforcementId: entry.reinforcementId,
      kind: typeof entry.kind === 'string' ? entry.kind : 'repeat',
      count: Number.isInteger(entry.count) && entry.count > 0 ? entry.count : 1
    }))
    : [];
  return {
    schemaVersion: SESSION_PROGRESS_VERSION,
    currentSessionId,
    sessions: Object.fromEntries(sessions.map((session) => [session.id, normalizeSessionState(safe.sessions?.[session.id], session)])),
    reinforcementHistory
  };
}

export function migrateLegacyProgress(legacy, sessions) {
  const migrated = createEmptySessionProgress(sessions);
  const session = sessions.find(({ id }) => id === '001') ?? sessions[0];
  if (!session || !legacy || typeof legacy !== 'object') return migrated;
  const state = migrated.sessions[session.id];
  state.stepIndex = Number.isInteger(legacy.currentStep) ? Math.max(0, Math.min(legacy.currentStep, session.steps.length - 1)) : 0;
  session.steps.forEach((step, index) => {
    const assessment = legacy.steps?.[index] ?? {};
    state.stepAssessments[step.id] = { understands: assessment.understands === true, canPlay: assessment.canPlay === true };
  });
  const assessments = Object.values(state.stepAssessments);
  state.understanding = assessments.length > 0 && assessments.every(({ understands }) => understands);
  state.playing = assessments.length > 0 && assessments.every(({ canPlay }) => canPlay);
  state.completed = state.understanding && state.playing;
  state.readiness = state.completed ? 'ready' : null;
  migrated.currentSessionId = session.id;
  return migrated;
}

export function createSessionProgressStore(storage, sessions) {
  let memory = createEmptySessionProgress(sessions);
  let storageAvailable = Boolean(storage);
  let initialized = false;

  const read = () => {
    if (initialized || !storageAvailable) return memory;
    initialized = true;
    try {
      const current = storage.getItem(SESSION_PROGRESS_KEY);
      if (current) {
        const parsed = JSON.parse(current);
        if (Number(parsed.schemaVersion) > SESSION_PROGRESS_VERSION) storageAvailable = false;
        else memory = normalizeSessionProgress(parsed, sessions);
      }
      else {
        const legacy = storage.getItem(LEGACY_PROGRESS_KEY);
        if (legacy) memory = migrateLegacyProgress(JSON.parse(legacy), sessions);
      }
    } catch {
      storageAvailable = false;
    }
    return memory;
  };
  const write = (next) => {
    initialized = true;
    memory = normalizeSessionProgress(next, sessions);
    if (storageAvailable) {
      try { storage.setItem(SESSION_PROGRESS_KEY, JSON.stringify(memory)); } catch { storageAvailable = false; }
    }
    return memory;
  };
  const update = (mutate) => {
    const next = JSON.parse(JSON.stringify(read()));
    mutate(next);
    return write(next);
  };

  return {
    load: read,
    setCurrentSession(sessionId) {
      return update((next) => { if (next.sessions[sessionId]) next.currentSessionId = sessionId; });
    },
    setStepIndex(sessionId, stepIndex) {
      return update((next) => { if (next.sessions[sessionId]) next.sessions[sessionId].stepIndex = stepIndex; });
    },
    setStepAssessment(sessionId, stepId, field, checked) {
      return update((next) => {
        const assessment = next.sessions[sessionId]?.stepAssessments?.[stepId];
        if (assessment && ['understands', 'canPlay'].includes(field)) assessment[field] = Boolean(checked);
      });
    },
    setSessionAssessment(sessionId, field, checked) {
      return update((next) => {
        const state = next.sessions[sessionId];
        if (state && ['understanding', 'playing'].includes(field)) state[field] = Boolean(checked);
      });
    },
    setReadiness(sessionId, readiness) {
      return update((next) => { if (next.sessions[sessionId] && READINESS_STATES.includes(readiness)) next.sessions[sessionId].readiness = readiness; });
    },
    completeSession(sessionId) {
      return update((next) => { if (next.sessions[sessionId]) next.sessions[sessionId].completed = true; });
    },
    recordReinforcement(reinforcementId, kind) {
      return update((next) => {
        const existing = next.reinforcementHistory.find((entry) => entry.reinforcementId === reinforcementId && entry.kind === kind);
        if (existing) existing.count += 1;
        else next.reinforcementHistory.push({ reinforcementId, kind, count: 1 });
      });
    },
    reset() { return write(createEmptySessionProgress(sessions)); }
  };
}

export function calculateAssessmentProgress(session, state) {
  if (!session?.steps?.length || !state) return 0;
  const checked = session.steps.reduce((total, step) => {
    const assessment = state.stepAssessments?.[step.id] ?? {};
    return total + Number(assessment.understands === true) + Number(assessment.canPlay === true);
  }, 0);
  return Math.round((checked / (session.steps.length * 2)) * 100);
}
