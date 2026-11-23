import { assertValidCurriculum } from './content-validator.js';
import { buildChatGPTPrompt, copyPrompt } from './chatgpt-help.js';
import { renderHome as renderHomeMarkup } from './home-renderer.js';
import { musicLibrary } from './music-library.js';
import { reinforcementCatalog } from './reinforcements.js';
import { assetCatalog, sessionCatalog } from './session-catalog.js';
import { continueTarget, createNavigation, revisitSession } from './session-navigation.js';
import { nextPulseFrame, pulseIntervalMs } from './pulse-guide.js';
import { continueSession, finishSession } from './session-actions.js';
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
  heroEyebrow: $('#session-eyebrow'), heroTitle: $('#lesson-title'), heroIntro: $('#session-intro'), shell: $('#lesson'),
  home: $('#home-view'), learning: $('#learning-view'), main: $('#main-content'),
  helpDialog: $('#chatgpt-help-dialog'), helpQuestion: $('#chatgpt-question'), helpPrompt: $('#chatgpt-prompt'),
  helpCopy: $('#copy-chatgpt-prompt'), helpStatus: $('#chatgpt-copy-status')
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
  const finish = $('[data-finish-session]');
  const continueButton = $('[data-continue-session]');
  if (!finish || !continueButton) return;
  finish.disabled = state.completed;
  const target = continueTarget(session.id, sessionCatalog, progress);
  continueButton.hidden = !target;
  if (target) {
    continueButton.dataset.targetSession = target.sessionId;
    continueButton.dataset.advancesCurrent = String(target.advancesCurrent);
    continueButton.textContent = `Continue to Session ${target.sessionId}`;
  }
}

function stopActiveMedia() {
  if (pulseTimer) {
    window.clearInterval(pulseTimer);
    pulseTimer = null;
  }
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
}

function renderHomeView({ focus = false } = {}) {
  stopActiveMedia();
  elements.learning.hidden = true;
  elements.home.hidden = false;
  elements.home.innerHTML = renderHomeMarkup(sessionCatalog, progress);
  elements.release.textContent = 'Chapter 01';
  document.title = 'Piano Lab — Learn on Your Piano';
  if (focus) {
    elements.main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function openSession(sessionId, { focus = true } = {}) {
  const nextNavigation = revisitSession(sessionId, sessionCatalog, progress, navigation);
  if (nextNavigation.viewingSessionId !== sessionId) return;
  navigation = nextNavigation;
  elements.home.hidden = true;
  elements.learning.hidden = false;
  render({ focus });
}

function render({ focus = false } = {}) {
  stopActiveMedia();
  const session = viewedSession();
  const state = progress.sessions[session.id];
  updateMetadata(session);
  elements.step.innerHTML = renderSessionStep(session, state.stepIndex, state, { music: musicLibrary, reinforcements: reinforcementCatalog, assets: assetCatalog });
  renderNavigation(session, state);
  updateProgress(session, state);
  configureEnding(session, state);
  elements.previous.disabled = state.stepIndex === 0;
  elements.next.textContent = state.stepIndex === session.steps.length - 1 ? 'Go to session check-in' : 'Next step';
  elements.position.textContent = `${state.stepIndex + 1} / ${session.steps.length}`;
  if (focus) {
    elements.step.focus({ preventScroll: true });
    elements.shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

elements.home.addEventListener('click', (event) => {
  const chapterToggle = event.target.closest('[data-chapter-toggle]');
  if (chapterToggle) {
    const panel = document.getElementById(chapterToggle.getAttribute('aria-controls'));
    const expanded = chapterToggle.getAttribute('aria-expanded') === 'true';
    chapterToggle.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
    return;
  }
  const target = event.target.closest('[data-continue-learning], [data-home-session]');
  if (target) openSession(target.dataset.continueLearning ?? target.dataset.homeSession);
});
document.addEventListener('click', (event) => {
  const home = event.target.closest('[data-return-home]');
  if (!home) return;
  event.preventDefault();
  renderHomeView({ focus: true });
});

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
  if (event.target.closest('[data-ask-chatgpt]')) {
    openHelpDialog();
    return;
  }
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
  if (event.target.closest('[data-finish-session]')) {
    const session = viewedSession();
    progress = finishSession(store, session.id);
    render();
    showToast(`Session ${session.id} is complete for today. You can repeat it whenever you choose.`);
    return;
  }
  const continueButton = event.target.closest('[data-continue-session]');
  if (continueButton) {
    const session = viewedSession();
    const target = continueButton.dataset.targetSession;
    if (!target) return;
    progress = continueSession(store, session.id, target, continueButton.dataset.advancesCurrent === 'true');
    navigation = { viewingSessionId: target };
    render({ focus: true });
  }
});
elements.previous.addEventListener('click', () => goToStep(progress.sessions[viewedSession().id].stepIndex - 1));
elements.next.addEventListener('click', () => {
  const session = viewedSession();
  const state = progress.sessions[session.id];
  if (state.stepIndex < session.steps.length - 1) return goToStep(state.stepIndex + 1);
  const ending = $('.session-ending');
  ending?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  ending?.focus({ preventScroll: true });
});

function updateHelpPrompt() {
  const session = viewedSession();
  const state = progress.sessions[session.id];
  elements.helpPrompt.value = buildChatGPTPrompt(session, session.steps[state.stepIndex], elements.helpQuestion.value);
}

function openHelpDialog() {
  elements.helpQuestion.value = '';
  elements.helpStatus.textContent = '';
  updateHelpPrompt();
  if (typeof elements.helpDialog.showModal === 'function') elements.helpDialog.showModal();
  else elements.helpDialog.setAttribute('open', '');
  elements.helpQuestion.focus();
}
elements.helpQuestion.addEventListener('input', updateHelpPrompt);
elements.helpDialog.querySelector('[data-close-help]').addEventListener('click', () => {
  if (typeof elements.helpDialog.close === 'function') elements.helpDialog.close();
  else elements.helpDialog.removeAttribute('open');
});
elements.helpCopy.addEventListener('click', async () => {
  const copied = await copyPrompt(elements.helpPrompt.value, navigator.clipboard);
  if (copied) {
    elements.helpStatus.textContent = 'Prompt copied. Open ChatGPT and paste it when you are ready.';
    return;
  }
  elements.helpPrompt.focus();
  elements.helpPrompt.select();
  elements.helpPrompt.setSelectionRange(0, elements.helpPrompt.value.length);
  elements.helpStatus.textContent = 'Automatic copying was blocked. The prompt is selected—use your device’s Copy command, then paste it into ChatGPT.';
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

renderHomeView();
