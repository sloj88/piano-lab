import { assertValidCurriculum } from './content-validator.js';
import { musicLibrary } from './music-library.js';
import { reinforcementCatalog } from './reinforcements.js';
import { assetCatalog, sessionCatalog } from './session-catalog.js';
import { continueTarget, createNavigation, revisitSession } from './session-navigation.js';
import { nextPulseFrame, pulseIntervalMs } from './pulse-guide.js';
import { calculateAssessmentProgress, createSessionProgressStore } from './session-progress.js';
import { renderReadinessGuidance, renderSessionNavigation, renderSessionStep, renderStepNavigation } from './session-renderer.js';

const validation = assertValidCurriculum({ sessions: sessionCatalog, reinforcements: reinforcementCatalog, music: musicLibrary, assets: assetCatalog });
for (const warning of validation.warnings) console.warn(`[${warning.category}] ${warning.message}`);

let browserStorage = null;
try { browserStorage = window.localStorage; } catch { /* Access can be blocked by browser privacy settings. */ }
const store = createSessionProgressStore(browserStorage, sessionCatalog);
let progress = store.load();
let navigation = createNavigation(progress);
let pulseTimer = null;
let activeAudio = null;
const $ = (selector) => document.querySelector(selector);
const elements = {
  step: $('#lesson-step'), stepList: $('#step-list'), sessionList: $('#session-list'), previous: $('#previous-step'), next: $('#next-step'),
  repeat: $('#repeat-session'), position: $('#step-position'), percent: $('#progress-percent'), fill: $('#progress-fill'),
  progressbar: $('[role="progressbar"]'), reset: $('#reset-progress'), toast: $('#toast'), release: $('#release-label'),
  positionSummary: $('#session-position-summary'), completionSummary: $('#session-completion-summary'),
  heroEyebrow: $('#session-eyebrow'), heroTitle: $('#lesson-title'), heroIntro: $('#session-intro'), shell: $('#lesson')
};

function sessionById(id) { return sessionCatalog.find((session) => session.id === id); }
function viewedSession() { return sessionById(navigation.viewingSessionId) ?? sessionCatalog[0]; }

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('is-visible');
  window.setTimeout(() => elements.toast.classList.remove('is-visible'), 4200);
}

function updateMetadata(session) {
  document.title = `Piano Lab — Session ${session.id}: ${session.title}`;
  elements.release.textContent = `Session ${session.id}`;
  elements.heroEyebrow.textContent = `${session.type} · ${session.duration.min}–${session.duration.max} minute core`;
  elements.heroTitle.innerHTML = session.presentation
    ? `${session.presentation.titleLead}<br><em>${session.presentation.titleEmphasis}</em>`
    : session.title;
  elements.heroIntro.textContent = session.summary ?? session.objective;
  elements.shell.setAttribute('aria-label', `Session ${session.id}: ${session.title}`);
}

function updateProgress(session, state) {
  const percent = calculateAssessmentProgress(session, state);
  elements.percent.textContent = `${percent}%`;
  elements.fill.style.width = `${percent}%`;
  elements.progressbar.setAttribute('aria-valuenow', percent);
  elements.positionSummary.textContent = `Position: Step ${state.stepIndex + 1} of ${session.steps.length}`;
  elements.completionSummary.textContent = state.completed ? 'Core completed' : 'Core in progress';
}

function renderNavigation(session, state) {
  elements.sessionList.innerHTML = renderSessionNavigation(sessionCatalog, progress, navigation.viewingSessionId);
  elements.stepList.innerHTML = renderStepNavigation(session, state);
}

function configureEnding(session, state) {
  const complete = $('[data-complete-session]');
  const continueButton = $('[data-continue-session]');
  if (!complete || !continueButton) return;
  complete.disabled = state.completed;
  const target = continueTarget(session.id, sessionCatalog, progress);
  continueButton.hidden = !target;
  if (target) {
    continueButton.dataset.targetSession = target.sessionId;
    continueButton.dataset.advancesCurrent = String(target.advancesCurrent);
    continueButton.textContent = `${target.advancesCurrent ? 'Continue to' : 'Review'} Session ${target.sessionId}`;
  }
}

function render({ focus = false } = {}) {
  if (pulseTimer) {
    window.clearInterval(pulseTimer);
    pulseTimer = null;
  }
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
  const session = viewedSession();
  const state = progress.sessions[session.id];
  updateMetadata(session);
  elements.step.innerHTML = renderSessionStep(session, state.stepIndex, state, { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  renderNavigation(session, state);
  updateProgress(session, state);
  configureEnding(session, state);
  elements.previous.disabled = state.stepIndex === 0;
  elements.next.textContent = state.stepIndex === session.steps.length - 1 ? 'Review session' : 'Next step';
  elements.position.textContent = `${state.stepIndex + 1} / ${session.steps.length}`;
  if (focus) {
    elements.step.focus({ preventScroll: true });
    elements.shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function goToStep(index) {
  const session = viewedSession();
  const bounded = Math.max(0, Math.min(index, session.steps.length - 1));
  progress = store.setStepIndex(session.id, bounded);
  render({ focus: true });
}

elements.sessionList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-session]');
  if (!button) return;
  navigation = revisitSession(button.dataset.session, sessionCatalog, progress, navigation);
  render({ focus: true });
});
elements.stepList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-step]');
  if (button) goToStep(Number(button.dataset.step));
});
elements.step.addEventListener('change', (event) => {
  const session = viewedSession();
  const state = progress.sessions[session.id];
  const step = session.steps[state.stepIndex];
  const stepAssessment = event.target.closest('[data-step-assessment]');
  if (stepAssessment) progress = store.setStepAssessment(session.id, step.id, stepAssessment.dataset.stepAssessment, stepAssessment.checked);
  const sessionAssessment = event.target.closest('[data-session-assessment]');
  if (sessionAssessment) progress = store.setSessionAssessment(session.id, sessionAssessment.dataset.sessionAssessment, sessionAssessment.checked);
  const readiness = event.target.closest('input[name="readiness"]');
  if (readiness) progress = store.setReadiness(session.id, readiness.value);
  renderNavigation(session, progress.sessions[session.id]);
  updateProgress(session, progress.sessions[session.id]);
  if (readiness) $('[data-readiness-guidance]').innerHTML = renderReadinessGuidance(session, progress.sessions[session.id], reinforcementCatalog);
});
elements.step.addEventListener('click', (event) => {
  const audioControl = event.target.closest('[data-audio-control]');
  if (audioControl) {
    const card = audioControl.closest('[data-listening-pair]');
    const audio = card.querySelector('[data-listening-audio]');
    const status = card.querySelector('.audio-status');
    if (activeAudio && activeAudio !== audio) activeAudio.pause();
    activeAudio = audio;
    audio.currentTime = 0;
    status.textContent = `Playing pair ${card.dataset.listeningPair}`;
    audioControl.textContent = `↻ Play pair ${card.dataset.listeningPair} again`;
    audio.onended = () => {
      status.textContent = `Pair ${card.dataset.listeningPair} finished. Replay whenever you need.`;
      activeAudio = null;
    };
    audio.play().catch(() => {
      status.textContent = 'Audio could not play in this browser. You can reveal the notes and revisit this listening task.';
      activeAudio = null;
    });
    return;
  }
  const listeningAnswer = event.target.closest('[data-listening-answer]');
  if (listeningAnswer) {
    const card = listeningAnswer.closest('[data-listening-pair]');
    card.dataset.selectedAnswer = listeningAnswer.dataset.listeningAnswer;
    card.querySelectorAll('[data-listening-answer]').forEach((button) => button.setAttribute('aria-pressed', String(button === listeningAnswer)));
    card.querySelector('.audio-status').textContent = `${listeningAnswer.textContent} selected. Reveal when you are ready to check.`;
    return;
  }
  const revealAnswer = event.target.closest('[data-reveal-answer]');
  if (revealAnswer) {
    const card = revealAnswer.closest('[data-listening-pair]');
    const reveal = card.querySelector('[data-listening-reveal]');
    reveal.hidden = false;
    const selected = card.dataset.selectedAnswer;
    const result = selected ? (selected === card.dataset.answer ? 'Your choice matches.' : 'Your choice was different this time.') : 'No choice was recorded; use the notes to explore the sound.';
    card.querySelector('.audio-status').textContent = `${result} The answer and notes are revealed.`;
    revealAnswer.textContent = 'Answer revealed';
    revealAnswer.disabled = true;
    return;
  }
  const pulseStart = event.target.closest('[data-pulse-start]');
  if (pulseStart) {
    const guide = pulseStart.closest('[data-pulse-guide]');
    const cells = [...guide.querySelectorAll('[data-pulse-index]')];
    const status = guide.querySelector('[data-pulse-status]');
    if (pulseTimer) {
      window.clearInterval(pulseTimer);
      pulseTimer = null;
      pulseStart.textContent = 'Continue guide';
      status.textContent = 'Paused';
      return;
    }
    let current = Number(guide.dataset.current ?? -1);
    if (current >= cells.length - 1) current = -1;
    const tick = () => {
      cells.forEach((cell) => cell.removeAttribute('aria-current'));
      const frame = nextPulseFrame(current, cells.length);
      current = frame.current;
      if (frame.complete) {
        window.clearInterval(pulseTimer);
        pulseTimer = null;
        guide.dataset.current = String(cells.length - 1);
        pulseStart.textContent = 'Play guide again';
        status.textContent = `Complete · ${cells.length} steady beats`;
        return;
      }
      guide.dataset.current = String(current);
      cells[current].setAttribute('aria-current', 'true');
      const beatLabel = cells[current].querySelector('span').textContent;
      status.textContent = `Beat ${current + 1} of ${cells.length}: ${beatLabel}`;
    };
    tick();
    if (current < cells.length) pulseTimer = window.setInterval(tick, pulseIntervalMs(Number(guide.dataset.bpm)));
    pulseStart.textContent = 'Pause guide';
    return;
  }
  const pulseReset = event.target.closest('[data-pulse-reset]');
  if (pulseReset) {
    const guide = pulseReset.closest('[data-pulse-guide]');
    if (pulseTimer) window.clearInterval(pulseTimer);
    pulseTimer = null;
    guide.dataset.current = '-1';
    guide.querySelectorAll('[data-pulse-index]').forEach((cell) => cell.removeAttribute('aria-current'));
    guide.querySelector('[data-pulse-start]').textContent = 'Start guide';
    guide.querySelector('[data-pulse-status]').textContent = `Ready · ${guide.dataset.bpm} beats per minute`;
    return;
  }
  const reinforcement = event.target.closest('[data-reinforcement]');
  if (reinforcement) {
    progress = store.recordReinforcement(reinforcement.dataset.reinforcement, reinforcement.dataset.reinforcementKind);
    showToast('Support activity recorded. Your session progress is unchanged.');
    return;
  }
  const revisit = event.target.closest('[data-revisit-session]');
  if (revisit) {
    navigation = revisitSession(revisit.dataset.revisitSession, sessionCatalog, progress, navigation);
    render({ focus: true });
    return;
  }
  if (event.target.closest('[data-complete-session]')) {
    const session = viewedSession();
    progress = store.completeSession(session.id);
    render();
    showToast(`Session ${session.id} recorded as complete. You can repeat it whenever you choose.`);
    return;
  }
  const continueButton = event.target.closest('[data-continue-session]');
  if (continueButton) {
    const session = viewedSession();
    const target = continueButton.dataset.targetSession;
    if (!target) return;
    progress = store.completeSession(session.id);
    if (continueButton.dataset.advancesCurrent === 'true') progress = store.setCurrentSession(target);
    navigation = { viewingSessionId: target };
    render({ focus: true });
  }
});
elements.previous.addEventListener('click', () => goToStep(progress.sessions[viewedSession().id].stepIndex - 1));
elements.next.addEventListener('click', () => {
  const session = viewedSession();
  const state = progress.sessions[session.id];
  if (state.stepIndex < session.steps.length - 1) return goToStep(state.stepIndex + 1);
  $('[data-complete-session]')?.focus();
  $('.session-ending')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
elements.repeat.addEventListener('click', () => {
  const session = viewedSession();
  progress = store.setStepIndex(session.id, 0);
  render({ focus: true });
  showToast('Session restarted. Your completion and reflections are still saved.');
});
elements.reset.addEventListener('click', () => {
  if (window.confirm('Reset Piano Lab progress on this browser? Your original v0.1 progress record will be kept.')) {
    progress = store.reset();
    navigation = createNavigation(progress);
    render();
  }
});

render();
