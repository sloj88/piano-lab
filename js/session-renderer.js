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

function listeningMarkup(block, context) {
  const example = context.music[block.musicRef];
  const pairs = block.pairIds.map((id) => example.pairs.find((pair) => pair.id === id));
  return `<section class="listening-set" aria-label="Same or different listening exercise">${pairs.map((pair) => {
    const asset = context.assets[pair.audioRef];
    const first = pair.first.join('–');
    const second = pair.second.join('–');
    return `<article class="listening-card" data-listening-pair="${pair.id}" data-answer="${pair.answer}">
      <p class="listening-title"><strong>Pair ${pair.id}</strong><span>Two groups of three notes</span></p>
      <audio preload="metadata" src="${asset.src}" data-listening-audio></audio>
      <button class="button button-secondary audio-button" type="button" data-audio-control aria-label="Play listening pair ${pair.id}">▶ Play pair ${pair.id}</button>
      <p class="audio-status" role="status" aria-live="polite">Ready to play</p>
      <fieldset class="listening-choices"><legend>Pair ${pair.id}: choose same or different</legend>
        <button type="button" data-listening-answer="same" aria-pressed="false">Same</button>
        <button type="button" data-listening-answer="different" aria-pressed="false">Different</button>
      </fieldset>
      <button class="text-button reveal-answer" type="button" data-reveal-answer>Reveal notes and answer</button>
      <div class="listening-reveal" data-listening-reveal hidden><p><strong>${pair.answer === 'same' ? 'Same' : 'Different'}.</strong> ${first} / ${second}</p><p>Direction: ${pair.directions}.</p><p>Now play both groups on your physical piano.</p></div>
    </article>`;
  }).join('')}</section>`;
}

function pulseMarkup(block, context) {
  const example = context.music[block.musicRef];
  const events = Array.isArray(example.events) ? example.events : null;
  const beats = events?.length ?? example.beats;
  const groupSize = example.groupSize ?? 4;
  const bpm = example.bpm ?? 56;
  const cells = Array.from({ length: beats }, (_, index) => {
    const event = events?.[index];
    const label = event ? event.pitch.replace(/[0-9]$/, '') : String((index % groupSize) + 1);
    const detail = event?.finger ? `<small>finger ${event.finger}</small>` : '';
    return `<li data-pulse-index="${index}"><span>${label}</span>${detail}</li>`;
  }).join('');
  const label = events ? `${example.title} beat guide` : `${beats}-beat pulse guide`;
  return `<section class="pulse-guide ${events ? 'pulse-pattern' : 'pulse-count'}" data-pulse-guide data-bpm="${bpm}" aria-label="${label}">
    <ol style="--pulse-count:${beats}">${cells}</ol>
    <div class="pulse-controls"><button class="button button-secondary" type="button" data-pulse-start>Start guide</button><button class="text-button" type="button" data-pulse-reset>Reset</button><span data-pulse-status role="status" aria-live="polite">Ready · ${bpm} beats per minute</span></div>
  </section>`;
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
    case 'audio-listening': return listeningMarkup(block, context);
    case 'pulse-guide': return pulseMarkup(block, context);
    case 'practice':
      return `<section class="learning-block try-block" aria-label="Try it on your piano">${phaseMarkup(block.phase)}<p>${block.instruction}</p><details><summary>Need a hint?</summary><p>${block.hint}</p>${block.hintVisual?.type === 'keyboard' ? keyboardMarkup(block.hintVisual) : ''}</details></section>`;
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
  const instruction = config.exercise ?? (readiness === 'stuck' ? reinforcement.prerequisite : reinforcement.repeat);
  const earlierSessionId = config.earlierSessionId ?? reinforcement.earlierSessionId;
  return `<div class="reinforcement-card"><p><strong>${config.label}:</strong> ${config.guidance}</p><h4>${reinforcement.title}</h4><p>${instruction}</p><button class="text-button" type="button" data-reinforcement="${reinforcement.id}" data-reinforcement-kind="${readiness}">I tried this support</button>${earlierSessionId ? `<button class="text-button" type="button" data-revisit-session="${earlierSessionId}">Revisit Session ${earlierSessionId}</button>` : ''}</div>`;
}

export function renderSessionEnding(session, state, reinforcements) {
  const readinessOptions = ['ready', 'practicing', 'stuck'].map((value) => {
    const option = session.readiness[value];
    return `<label><input type="radio" name="readiness" value="${value}" ${state.readiness === value ? 'checked' : ''}><span><strong>${option.label}</strong><small>${option.guidance}</small></span></label>`;
  }).join('');
  return `<section class="session-ending" tabindex="-1" aria-labelledby="session-ending-heading">
    <h3 id="session-ending-heading">Session check-in</h3>
    <fieldset class="session-assessments"><legend>Understanding and playing can develop at different speeds.</legend>
      <label><input type="checkbox" data-session-assessment="understanding" ${state.understanding ? 'checked' : ''}><span><strong>I understand it</strong><small>${session.reflection.understanding}</small></span></label>
      <label><input type="checkbox" data-session-assessment="playing" ${state.playing ? 'checked' : ''}><span><strong>I can play it</strong><small>${session.reflection.playing}</small></span></label>
    </fieldset>
    <fieldset class="readiness-choices"><legend>What would help next?</legend>${readinessOptions}</fieldset>
    <div data-readiness-guidance>${renderReadinessGuidance(session, state, reinforcements)}</div>
    <p class="observable-outcome"><strong>Observable outcome:</strong> ${session.outcome}</p>
    <div class="keep-playing"><p class="eyebrow">Optional extension</p><h3>Keep Playing</h3><p>Stop after the core if that is enough today. These ideas are optional and are not required by the next session.</p>
    <ul>${session.keepPlaying.map((activity) => `<li>${activity}</li>`).join('')}</ul></div>
    <div class="completion-choice"><h3>Choose what happens next</h3><p>Finish records completion without moving on. When another session is available, Continue records completion and opens it. Your reflections can still say Practicing or Stuck.</p>
    <div class="session-actions"><button class="button button-secondary" type="button" data-finish-session ${state.completed ? 'disabled' : ''}>${state.completed ? 'Finished for today' : 'Finish for today'}</button><button class="button button-primary" type="button" data-continue-session>Continue to next session</button></div></div>
  </section>`;
}

export function renderSessionStep(session, stepIndex, state, { music, reinforcements, assets = {} }) {
  const step = session.steps[stepIndex];
  const stepAssessment = state.stepAssessments?.[step.id] ?? {};
  const blocks = step.blocks.map((block) => renderBlock(block, { music, assets, stepAssessment })).join('');
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
