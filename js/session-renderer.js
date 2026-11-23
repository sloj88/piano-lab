import { BLACK_KEYS, WHITE_NOTES } from './lessons.js';

const phaseLabels = { explain: ['01', 'Explain'], demonstrate: ['02', 'Demonstrate'], try: ['03', 'Try it on your piano'], reflect: ['04', 'Reflect'] };

function phaseMarkup(phase) {
  const [number, label] = phaseLabels[phase] ?? ['', phase ?? ''];
  return `<p class="phase"><span>${number}</span>${label}</p>`;
}

export function keyboardMarkup(config) {
  const highlighted = new Set(config.highlights ?? []);
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
  const description = highlighted.size ? `highlighted ${[...highlighted].join(', ')}` : 'groups of black and white keys';
  return `<figure class="keyboard-figure"><div class="keyboard" role="img" aria-label="Piano keyboard diagram showing ${description}">${whiteKeys}${blackKeys}${groups}</div><figcaption>Keyboard section from C to C · Green keys are the focus notes</figcaption></figure>`;
}

function fingerMarkup() {
  return '<div class="finger-guide" aria-label="Right hand finger numbers"><span>Thumb<strong>1</strong></span><span>Index<strong>2</strong></span><span>Middle<strong>3</strong></span><span>Ring<strong>4</strong></span><span>Pinky<strong>5</strong></span></div>';
}

function patternMarkup(example) {
  const name = (pitch) => pitch.replace(/[0-9]$/, '');
  return `<div class="melody" aria-label="Melody: ${example.events.map(({ pitch }) => name(pitch)).join(', ')}">${example.events.map(({ pitch, finger }) => `<div><strong>${name(pitch)}</strong><span>finger ${finger}</span></div>`).join('<i aria-hidden="true">–</i>')}</div>`;
}

function legacyCheckMarkup(assessment = {}) {
  return `<fieldset class="self-check"><legend>Check in with yourself</legend>
    <label><input type="checkbox" data-step-assessment="understands" ${assessment.understands ? 'checked' : ''}><span><strong>I understand it</strong><small>I can explain the idea in my own words.</small></span></label>
    <label><input type="checkbox" data-step-assessment="canPlay" ${assessment.canPlay ? 'checked' : ''}><span><strong>I can play it</strong><small>I can do the exercise on my instrument.</small></span></label>
  </fieldset>`;
}

export function renderBlock(block, context) {
  switch (block.type) {
    case 'text':
      return `<section class="learning-block ${block.phase}-block" aria-label="${phaseLabels[block.phase]?.[1] ?? block.phase}">${phaseMarkup(block.phase)}${block.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}</section>`;
    case 'keyboard': return keyboardMarkup(block);
    case 'finger-position': return fingerMarkup();
    case 'musical-pattern': return patternMarkup(context.music[block.musicRef]);
    case 'practice':
      return `<section class="learning-block try-block" aria-label="Try it on your piano">${phaseMarkup(block.phase)}<p>${block.instruction}</p><details><summary>Need a hint?</summary><p>${block.hint}</p></details></section>`;
    case 'reflection':
      return `<section class="learning-block reflect-block" aria-label="Reflect">${phaseMarkup(block.phase)}<p>${block.prompt}</p>${block.legacySelfCheck ? legacyCheckMarkup(context.stepAssessment) : ''}</section>`;
    default: throw new Error(`Unsupported content block type: ${block.type}`);
  }
}

export function renderReadinessGuidance(session, state, reinforcements) {
  const readiness = state.readiness;
  if (!readiness) return '<p class="readiness-guidance">Choose the description that best fits today. None of these choices locks your progress.</p>';
  const config = session.readiness[readiness];
  const reference = config.reinforcementRefs?.[0];
  const reinforcement = reference ? reinforcements[reference] : null;
  if (!reinforcement) return `<p class="readiness-guidance"><strong>${config.label}:</strong> ${config.guidance}</p>`;
  const instruction = readiness === 'stuck' ? reinforcement.prerequisite : reinforcement.repeat;
  return `<div class="reinforcement-card"><p><strong>${config.label}:</strong> ${config.guidance}</p><h4>${reinforcement.title}</h4><p>${instruction}</p><button class="text-button" type="button" data-reinforcement="${reinforcement.id}" data-reinforcement-kind="${readiness}">I tried this support</button>${reinforcement.earlierSessionId ? `<button class="text-button" type="button" data-revisit-session="${reinforcement.earlierSessionId}">Revisit Session ${reinforcement.earlierSessionId}</button>` : ''}</div>`;
}

export function renderSessionEnding(session, state, reinforcements) {
  const readinessOptions = ['ready', 'practicing', 'stuck'].map((value) => {
    const option = session.readiness[value];
    return `<label><input type="radio" name="readiness" value="${value}" ${state.readiness === value ? 'checked' : ''}><span><strong>${option.label}</strong><small>${option.guidance}</small></span></label>`;
  }).join('');
  return `<section class="session-ending" aria-labelledby="session-ending-heading">
    <h3 id="session-ending-heading">Session check-in</h3>
    <fieldset class="session-assessments"><legend>Understanding and playing can develop at different speeds.</legend>
      <label><input type="checkbox" data-session-assessment="understanding" ${state.understanding ? 'checked' : ''}><span><strong>I understand it</strong><small>${session.reflection.understanding}</small></span></label>
      <label><input type="checkbox" data-session-assessment="playing" ${state.playing ? 'checked' : ''}><span><strong>I can play it</strong><small>${session.reflection.playing}</small></span></label>
    </fieldset>
    <fieldset class="readiness-choices"><legend>What would help next?</legend>${readinessOptions}</fieldset>
    <div data-readiness-guidance>${renderReadinessGuidance(session, state, reinforcements)}</div>
    <p class="observable-outcome"><strong>Observable outcome:</strong> ${session.outcome}</p>
    <div class="session-actions"><button class="button button-primary" type="button" data-complete-session>${state.completed ? 'Session completed' : 'Mark core complete'}</button><button class="button button-secondary" type="button" data-continue-session>Continue to next session</button></div>
    <div class="keep-playing"><p class="eyebrow">Optional extension</p><h3>Keep Playing</h3><p>Stop after the core if that is enough today. These ideas are optional and are not required by the next session.</p>
    <ul>${session.keepPlaying.map((activity) => `<li>${activity}</li>`).join('')}</ul></div>
  </section>`;
}

export function renderSessionStep(session, stepIndex, state, { music, reinforcements }) {
  const step = session.steps[stepIndex];
  const stepAssessment = state.stepAssessments?.[step.id] ?? {};
  const blocks = step.blocks.map((block) => renderBlock(block, { music, stepAssessment })).join('');
  const ending = stepIndex === session.steps.length - 1 ? renderSessionEnding(session, state, reinforcements) : '';
  return `<header class="step-header"><p class="eyebrow">Session ${session.id} · ${session.type} · Step ${stepIndex + 1} of ${session.steps.length} · ${step.kicker}</p><h2>${step.title}</h2><p>${step.intro}</p></header>${blocks}${ending}`;
}

export function renderStepNavigation(session, state) {
  return session.steps.map((step, index) => {
    const assessment = state.stepAssessments?.[step.id] ?? {};
    const complete = assessment.understands && assessment.canPlay;
    return `<li><button type="button" data-step="${index}" ${index === state.stepIndex ? 'aria-current="step"' : ''}><span>${complete ? '✓' : index + 1}</span><span><small>Step ${index + 1}</small>${step.title}</span></button></li>`;
  }).join('');
}

export function renderSessionNavigation(sessions, progress, viewingSessionId) {
  const currentIndex = sessions.findIndex(({ id }) => id === progress.currentSessionId);
  return sessions.filter((_, index) => index <= currentIndex).map((session) => {
    const state = progress.sessions[session.id];
    return `<li><button type="button" data-session="${session.id}" ${session.id === viewingSessionId ? 'aria-current="page"' : ''}><span>${state?.completed ? '✓' : session.id}</span><span><small>${session.type}</small>${session.title}</span></button></li>`;
  }).join('');
}
