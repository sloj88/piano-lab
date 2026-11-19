import { BLACK_KEYS, WHITE_NOTES, lesson } from './lessons.js';
import { calculateProgress, createProgressStore } from './progress.js';

let browserStorage = null;
try { browserStorage = window.localStorage; } catch { /* Access can be blocked by browser privacy settings. */ }
const store = createProgressStore(browserStorage, lesson.steps.length);
let progress = store.load();
const $ = (selector) => document.querySelector(selector);
const elements = {
  step: $('#lesson-step'), list: $('#step-list'), previous: $('#previous-step'), next: $('#next-step'),
  position: $('#step-position'), percent: $('#progress-percent'), fill: $('#progress-fill'),
  progressbar: $('[role="progressbar"]'), reset: $('#reset-progress'), toast: $('#toast')
};

function keyboardMarkup(config) {
  const highlighted = new Set(config.highlights);
  const whiteKeys = WHITE_NOTES.map((key) => {
    let label = '';
    if (config.labels === 'middle-c' && key.id === 'C4') label = '<span>Middle C</span>';
    if (['five-notes', 'fingers'].includes(config.labels) && ['C4', 'D4', 'E4', 'F4', 'G4'].includes(key.id)) {
      label = `<span>${key.note}${config.labels === 'fingers' ? `<small>${key.index - 6}</small>` : ''}</span>`;
    }
    return `<div class="white-key${highlighted.has(key.id) ? ' is-highlighted' : ''}" data-note="${key.id}">${label}</div>`;
  }).join('');
  const blackKeys = BLACK_KEYS.map((key) => `<div class="black-key" style="--left:${((key.after + 1) / WHITE_NOTES.length) * 100}%" data-note="${key.id}"></div>`).join('');
  const groups = config.labels === 'groups' ? '<span class="group-label group-two">group of 2</span><span class="group-label group-three">group of 3</span>' : '';
  const description = config.highlights.length ? `highlighted ${config.highlights.join(', ')}` : 'groups of black and white keys';
  return `<figure class="keyboard-figure"><div class="keyboard" role="img" aria-label="Piano keyboard diagram showing ${description}">${whiteKeys}${blackKeys}${groups}</div><figcaption>Keyboard section from C to C · Green keys are the focus notes</figcaption></figure>`;
}

function melodyMarkup(notes) {
  return `<div class="melody" aria-label="Melody: ${notes.map(({ note }) => note).join(', ')}">${notes.map(({ note, finger }) => `<div><strong>${note}</strong><span>finger ${finger}</span></div>`).join('<i aria-hidden="true">–</i>')}</div>`;
}

function fingerMarkup() {
  return `<div class="finger-guide" aria-label="Right hand finger numbers"><span>Thumb<strong>1</strong></span><span>Index<strong>2</strong></span><span>Middle<strong>3</strong></span><span>Ring<strong>4</strong></span><span>Pinky<strong>5</strong></span></div>`;
}

function renderNavigation() {
  elements.list.innerHTML = lesson.steps.map((step, index) => {
    const state = progress.steps[index];
    const complete = state.understands && state.canPlay;
    return `<li><button type="button" data-step="${index}" ${index === progress.currentStep ? 'aria-current="step"' : ''}><span>${complete ? '✓' : index + 1}</span><span><small>Step ${index + 1}</small>${step.title}</span></button></li>`;
  }).join('');
}

function updateProgress() {
  const percent = calculateProgress(progress, lesson.steps.length);
  elements.percent.textContent = `${percent}%`;
  elements.fill.style.width = `${percent}%`;
  elements.progressbar.setAttribute('aria-valuenow', percent);
}

function renderStep({ focus = false } = {}) {
  const index = progress.currentStep;
  const step = lesson.steps[index];
  const assessment = progress.steps[index];
  elements.step.innerHTML = `
    <header class="step-header"><p class="eyebrow">Step ${index + 1} of ${lesson.steps.length} · ${step.kicker}</p><h2>${step.title}</h2><p>${step.intro}</p></header>
    <section class="learning-block explain-block" aria-labelledby="explain-heading"><p class="phase" id="explain-heading"><span>01</span> Explain</p>${step.explain.map((paragraph) => `<p>${paragraph}</p>`).join('')}${step.fingers ? fingerMarkup() : ''}</section>
    ${keyboardMarkup(step.keyboard)}
    <section class="learning-block demonstrate-block" aria-labelledby="demonstrate-heading"><p class="phase" id="demonstrate-heading"><span>02</span> Demonstrate</p><p>${step.demonstrate}</p>${step.melody ? melodyMarkup(step.melody) : ''}</section>
    <section class="learning-block try-block" aria-labelledby="try-heading"><p class="phase" id="try-heading"><span>03</span> Try it on your piano</p><p>${step.tryIt}</p><details><summary>Need a hint?</summary><p>${step.hint}</p></details></section>
    <section class="learning-block reflect-block" aria-labelledby="reflect-heading"><p class="phase" id="reflect-heading"><span>04</span> Reflect</p><p>${step.reflect}</p>
      <fieldset class="self-check"><legend>Check in with yourself</legend>
        <label><input type="checkbox" data-assessment="understands" ${assessment.understands ? 'checked' : ''}><span><strong>I understand it</strong><small>I can explain the idea in my own words.</small></span></label>
        <label><input type="checkbox" data-assessment="canPlay" ${assessment.canPlay ? 'checked' : ''}><span><strong>I can play it</strong><small>I can do the exercise on my instrument.</small></span></label>
      </fieldset></section>`;
  elements.previous.disabled = index === 0;
  elements.next.textContent = index === lesson.steps.length - 1 ? 'Finish lesson' : 'Next step';
  elements.position.textContent = `${index + 1} / ${lesson.steps.length}`;
  renderNavigation();
  updateProgress();
  if (focus) {
    elements.step.focus({ preventScroll: true });
    $('#lesson').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function goToStep(index) {
  progress = store.setCurrentStep(Math.max(0, Math.min(index, lesson.steps.length - 1)));
  renderStep({ focus: true });
}

elements.list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-step]');
  if (button) goToStep(Number(button.dataset.step));
});
elements.step.addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-assessment]');
  if (!checkbox) return;
  progress = store.setAssessment(progress.currentStep, checkbox.dataset.assessment, checkbox.checked);
  renderNavigation();
  updateProgress();
});
elements.previous.addEventListener('click', () => goToStep(progress.currentStep - 1));
elements.next.addEventListener('click', () => {
  if (progress.currentStep < lesson.steps.length - 1) return goToStep(progress.currentStep + 1);
  elements.toast.textContent = calculateProgress(progress, lesson.steps.length) === 100
    ? 'Lesson complete. You played your first melody!'
    : 'You reached the end. Check both reflections in each step when you feel ready.';
  elements.toast.classList.add('is-visible');
  window.setTimeout(() => elements.toast.classList.remove('is-visible'), 4200);
});
elements.reset.addEventListener('click', () => {
  if (window.confirm('Reset all Lesson 01 progress?')) { progress = store.reset(); renderStep(); }
});

renderStep();
