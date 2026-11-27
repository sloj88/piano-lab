import { BLACK_KEYS, WHITE_NOTES } from './lessons.js';
import { beatGridMarkup, pairedScoreMarkup, scoreMarkup } from './notation.js';
import { availableSessionIds } from './session-navigation.js';

const phaseLabels = { explain: ['01', 'Explain'], demonstrate: ['02', 'Demonstrate'], try: ['03', 'Try it on your piano'], reflect: ['04', 'Reflect'] };

function phaseMarkup(phase) {
  const [number, label] = phaseLabels[phase] ?? ['', phase ?? ''];
  return `<p class="phase"><span>${number}</span>${label}</p>`;
}

export function audioControlLabels(action, accessibleAction = action, replay = false) {
  const suffix = replay ? ' again' : '';
  return { text: `${replay ? '↻' : '▶'} ${action}${suffix}`, accessible: `${accessibleAction}${suffix}` };
}

function audioButton(ref, action, { label = action, accessibleAction = action, textButton = false } = {}) {
  const initial = audioControlLabels(action, accessibleAction);
  const classes = textButton ? 'text-button' : 'button button-secondary audio-button';
  return `<button class="${classes}" type="button" data-audio-control="${ref}" data-audio-label="${label}" data-audio-action="${action}" data-audio-accessible-action="${accessibleAction}" aria-label="${initial.accessible}">${textButton ? action : initial.text}</button>`;
}

export function keyboardMarkup(config) {
  const highlighted = new Set(config.highlights ?? []);
  const whiteKeys = WHITE_NOTES.map((key) => {
    let label = '';
    if (config.labels === 'middle-c' && key.id === 'C4') label = '<span>Middle C</span>';
    if (config.labels === 'octave-c' && key.id === 'C3') label = '<span>Lower C<small>C3</small></span>';
    if (config.labels === 'octave-c' && key.id === 'C4') label = '<span>Middle C<small>C4</small></span>';
    if (['five-notes', 'fingers'].includes(config.labels) && ['C4', 'D4', 'E4', 'F4', 'G4'].includes(key.id)) {
      label = `<span>${key.note}${config.labels === 'fingers' ? `<small>${key.index - 6}</small>` : ''}</span>`;
    }
    if (['left-five-notes', 'left-fingers'].includes(config.labels) && ['C3', 'D3', 'E3', 'F3', 'G3'].includes(key.id)) {
      label = `<span>${key.note}${config.labels === 'left-fingers' ? `<small>${5 - key.index}</small>` : ''}</span>`;
    }
    return `<div class="white-key${highlighted.has(key.id) ? ' is-highlighted' : ''}" data-note="${key.id}">${label}</div>`;
  }).join('');
  const blackKeys = BLACK_KEYS.map((key) => `<div class="black-key" style="--left:${((key.after + 1) / WHITE_NOTES.length) * 100}%" data-note="${key.id}"></div>`).join('');
  const groups = config.labels === 'groups' ? '<span class="group-label group-two">group of 2</span><span class="group-label group-three">group of 3</span>' : '';
  const description = highlighted.size ? `highlighted ${[...highlighted].join(', ')}` : 'groups of black and white keys';
  return `<figure class="keyboard-figure"><div class="keyboard" role="img" aria-label="Piano keyboard diagram showing ${description}">${whiteKeys}${blackKeys}${groups}</div><figcaption>Keyboard section from C to C · Green keys are the focus notes</figcaption></figure>`;
}

function fingerMarkup(hand = 'right') {
  const fingers = hand === 'left' ? [['Pinky', 5], ['Ring', 4], ['Middle', 3], ['Index', 2], ['Thumb', 1]] : [['Thumb', 1], ['Index', 2], ['Middle', 3], ['Ring', 4], ['Pinky', 5]];
  return `<div class="finger-guide" aria-label="${hand === 'left' ? 'Left' : 'Right'} hand finger numbers">${fingers.map(([name, number]) => `<span>${name}<strong>${number}</strong></span>`).join('')}</div>`;
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
    return `<article class="listening-card" data-audio-card data-listening-pair="${pair.id}" data-answer="${pair.answer}">
      <p class="listening-title"><strong>Pair ${pair.id}</strong><span>Two groups of three notes</span></p>
      <audio preload="metadata" src="${asset.src}" data-audio-id="${pair.audioRef}"></audio>
      ${audioButton(pair.audioRef, `Play pair ${pair.id}`, { label: `Pair ${pair.id}`, accessibleAction: `Play listening pair ${pair.id}` })}
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

function notationMarkup(block, context) {
  const examples = block.musicRefs.map((reference) => {
    const example = context.music[reference];
    if (!Array.isArray(block.options?.measureIndexes)) return example;
    return {
      ...example,
      title: block.options.sectionTitle ?? example.title,
      measures: block.options.measureIndexes.map((index) => ({ ...example.measures[index], displayNumber: index + 1 }))
    };
  });
  return `<section class="notation-set" aria-label="Music notation">${examples.map((example) => {
    const renderScore = example.kind === 'paired-score' ? pairedScoreMarkup : scoreMarkup;
    const score = renderScore(example, { ...(block.options ?? {}), showDirections: false });
    const beatGrid = block.options?.showBeatGrid ? beatGridMarkup(example) : '';
    const reveal = block.options?.reveal
      ? `<details class="score-reveal"><summary>${block.options.revealLabel ?? 'Reveal notes and reading help'}</summary>${renderScore(example, { ...block.options, readingChallenge: false, showLabels: block.options.revealLabels ?? true, showDirections: block.options.revealDirections })}${beatGrid}</details>`
      : beatGrid;
    const visible = block.options?.hiddenUntilReveal ? '' : score;
    const hiddenScore = block.options?.hiddenUntilReveal ? `<details class="score-reveal"><summary>${block.options.revealLabel ?? 'Reveal the score and counts'}</summary>${score}${beatGrid}</details>` : reveal;
    const enlarged = block.options?.enlarge && !block.options.hiddenUntilReveal ? `<details class="score-enlarge"><summary>Open an enlarged score</summary>${renderScore(example, { ...block.options, enlarged: true })}</details>` : '';
    return `<article class="notation-card"><h4>${example.title}</h4>${visible}${hiddenScore}${enlarged}</article>`;
  }).join('')}</section>`;
}

function pitchEchoMarkup(block, context) {
  const example = context.music[block.musicRef];
  const echoes = (block.echoIds ?? example.echoes.map(({ id }) => id)).map((id) => example.echoes.find((echo) => echo.id === id));
  return `<section class="echo-set pitch-echo-set" aria-label="Left-hand pitch echoes">${echoes.map((echo) => `<article class="echo-card" data-audio-card><h4>Echo ${echo.id}</h4>
    <audio preload="metadata" src="${context.assets[echo.audioRef].src}" data-audio-id="${echo.audioRef}"></audio>
    ${audioButton(echo.audioRef, `Hear Echo ${echo.id}`, { label: `Echo ${echo.id}` })}
    <p class="audio-status" role="status" aria-live="polite">Listen first, trace the direction, then play.</p>
    <details class="echo-reveal"><summary>Reveal contour and note names</summary><p class="echo-arrows">${echo.directions.join(' · ')}</p><p>${echo.pitches.join('–')}</p></details>
  </article>`).join('')}</section>`;
}

function expandBeatLabels(events) {
  const labels = [];
  for (const event of events) {
    if (event.kind === 'rest') {
      for (let beat = 0; beat < event.beats; beat += 1) labels.push('wait');
      continue;
    }
    labels.push(event.beats > 1 ? `${event.pitch} begins (${event.finger})` : `${event.pitch} (${event.finger})`);
    for (let beat = 1; beat < event.beats; beat += 1) labels.push(`${event.pitch} continues`);
  }
  return labels;
}

function handLanesMarkup(block, context) {
  const example = context.music[block.musicRef];
  const selected = block.measureIndexes ?? example.measures.map((_, index) => index);
  let pulseIndex = 0;
  const measures = selected.map((measureIndex) => {
    const measure = example.measures[measureIndex];
    const rows = example.kind === 'paired-score'
      ? { RH: expandBeatLabels(measure.staves.treble.events), LH: expandBeatLabels(measure.staves.bass.events) }
      : {
          RH: measure.events.map((event) => event.hand === 'RH' ? `${event.pitch} (${event.finger})` : 'wait'),
          LH: measure.events.map((event) => event.hand === 'LH' ? `${event.pitch} (${event.finger})` : 'wait')
        };
    const beatHeadings = Array.from({ length: example.meter.beats }, (_, beat) => `<div ${block.animated ? `data-pulse-index="${pulseIndex++}"` : ''}><span>${beat + 1}</span></div>`).join('');
    return `<section class="hand-lane-measure" aria-label="Measure ${measureIndex + 1} hand lanes"><h4>Measure ${measureIndex + 1}${measure.activeHand ? ` · ${measure.activeHand} plays` : ''}</h4><div class="hand-lane-grid"><strong>Beat</strong>${beatHeadings}<strong>RH</strong>${rows.RH.map((label) => `<div>${label}</div>`).join('')}<strong>LH</strong>${rows.LH.map((label) => `<div>${label}</div>`).join('')}</div></section>`;
  }).join('');
  const controls = block.animated ? `<div class="pulse-controls"><button class="button button-secondary" type="button" data-pulse-start>Start beat guide</button><button class="text-button" type="button" data-pulse-reset>Reset</button><span data-pulse-status role="status" aria-live="polite">Ready · ${block.bpm ?? example.tempo?.min ?? 52} beats per minute</span></div>` : '';
  return `<section class="hand-lanes${block.animated ? ' pulse-guide' : ''}" ${block.animated ? `data-pulse-guide data-bpm="${block.bpm ?? example.tempo?.min ?? 52}"` : ''}>${measures}${controls}</section>`;
}

function audioTracksMarkup(block, context) {
  const transcript = block.transcript
    ? block.transcriptHidden
      ? `<details class="audio-transcript"><summary>${block.transcriptSummary ?? 'Read the audio description'}</summary><p>${block.transcript}</p></details>`
      : `<p class="audio-transcript"><strong>Transcript:</strong> ${block.transcript}</p>`
    : '';
  const content = `<section class="audio-reference" data-audio-card aria-label="${block.title}"><h4>${block.title}</h4>${block.tracks.map((track) => {
    const asset = context.assets[track.assetRef];
    return `<audio preload="metadata" src="${asset.src}" data-audio-id="${track.assetRef}"></audio>${audioButton(track.assetRef, track.label)}`;
  }).join('')}<p class="audio-status" role="status" aria-live="polite">Ready to play</p>${transcript}</section>`;
  return block.collapsed ? `<details class="audio-details"><summary>${block.summary ?? 'Hear after my try'}</summary>${content}</details>` : content;
}

function dynamicDemoMarkup(block, context) {
  const example = context.music[block.musicRef];
  const asset = context.assets[example.audioRef];
  return `<section class="dynamic-demo" aria-label="Soft and strong sound and movement demonstration">
    <div class="dynamic-sounds" data-audio-card><div><strong>p</strong><span>soft</span></div><div><strong>f</strong><span>strong, never forced</span></div>
      <audio preload="metadata" src="${asset.src}" data-audio-id="${example.audioRef}"></audio>
      ${audioButton(example.audioRef, 'Hear soft, reset, then strong', { label: 'Soft then strong dynamics' })}
      <p class="audio-status" role="status" aria-live="polite">Four soft C notes, a silent reset, then four stronger C notes.</p>
    </div>
    <div class="motion-model"><div><h4>Easy, free descent</h4><svg viewBox="0 0 260 115" role="img" aria-label="Side-view diagram of a relaxed hand moving a key down with a small free motion"><rect class="motion-key" x="42" y="78" width="176" height="19" rx="3"/><path class="motion-arm" d="M18 37 C72 39 94 48 130 53 C156 57 176 59 202 66"/><circle class="motion-joint" cx="130" cy="53" r="5"/><path class="motion-arrow" d="M206 48 v22 m-7-7 7 7 7-7"/></svg><p>Let the key move a little faster for the fuller sound while shoulder, jaw, and wrist stay easy.</p></div>
      <div class="avoid-motion"><h4>Avoid bracing or striking</h4><p aria-hidden="true" class="avoid-symbol">×</p><p>Do not raise, lock, or drive the hand into the key. Stop for pain, numbness, or persistent tension.</p></div>
    </div>
    <p class="motion-note">On a non-touch-sensitive keyboard, listen for the contrast and rehearse only the relaxed motion. Do not force the instrument to become louder.</p>
  </section>`;
}

function rhythmEchoMarkup(block, context) {
  return `<section class="echo-set" aria-label="Rhythm echo exercises">${block.musicRefs.map((reference) => {
    const example = context.music[reference];
    return `<article class="echo-card" data-audio-card><h4>${example.title}</h4>
      <audio preload="metadata" src="${context.assets[example.audioRef].src}" data-audio-id="${example.audioRef}"></audio>
      <audio preload="metadata" src="${context.assets[example.countedAudioRef].src}" data-audio-id="${example.countedAudioRef}"></audio>
      <div class="echo-actions">${audioButton(example.audioRef, 'Hear pattern', { label: `${example.title} pattern` })}${audioButton(example.countedAudioRef, 'Hear with spoken count', { label: `${example.title} with spoken count`, textButton: true })}</div>
      <p class="audio-status" role="status" aria-live="polite">Listen first, then tap and play.</p>
      <details class="score-reveal"><summary>Reveal score and count blocks</summary>${scoreMarkup(example, { showLabels: true })}${beatGridMarkup(example)}</details>
    </article>`;
  }).join('')}</section>`;
}

function pulseMarkup(block, context) {
  const example = context.music[block.musicRef];
  const events = Array.isArray(example.events) ? example.events : Array.isArray(example.measures) ? example.measures.flatMap((measure) => measure.events) : null;
  const beats = events?.length ?? example.beats;
  const groupSize = example.groupSize ?? 4;
  const bpm = example.bpm ?? 56;
  const cells = Array.from({ length: beats }, (_, index) => {
    const event = events?.[index];
    const label = event ? event.kind === 'rest' ? 'rest' : event.pitch.replace(/[0-9]$/, '') : String((index % groupSize) + 1);
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
    case 'finger-position': return fingerMarkup(block.hand);
    case 'musical-pattern': return patternMarkup(context.music[block.musicRef]);
    case 'audio-listening': return listeningMarkup(block, context);
    case 'pulse-guide': return pulseMarkup(block, context);
    case 'notation': return notationMarkup(block, context);
    case 'rhythm-echo': return rhythmEchoMarkup(block, context);
    case 'audio-reference': return audioTracksMarkup(block, context);
    case 'pitch-echo': return pitchEchoMarkup(block, context);
    case 'hand-lanes': return handLanesMarkup(block, context);
    case 'dynamic-demo': return dynamicDemoMarkup(block, context);
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
  const options = readiness === 'stuck' && !config.earlierSessionId ? reinforcement.revisitOptions : undefined;
  const revisits = options ?? (earlierSessionId ? [{ sessionId: earlierSessionId }] : []);
  const revisitButtons = revisits.map(({ sessionId, label }) =>
    `<button class="text-button" type="button" data-revisit-session="${sessionId}">Revisit Session ${sessionId}${label ? ` — ${label}` : ''}</button>`).join('');
  return `<div class="reinforcement-card"><p><strong>${config.label}:</strong> ${config.guidance}</p><h4>${reinforcement.title}</h4><p>${instruction}</p><button class="text-button" type="button" data-reinforcement="${reinforcement.id}" data-reinforcement-kind="${readiness}">I tried this support</button>${revisitButtons}</div>`;
}

export function renderSessionEnding(session, state, reinforcements, context = {}) {
  const readinessOptions = ['ready', 'practicing', 'stuck'].map((value) => {
    const option = session.readiness[value];
    return `<label><input type="radio" name="readiness" value="${value}" ${state.readiness === value ? 'checked' : ''}><span><strong>${option.label}</strong><small>${option.guidance}</small></span></label>`;
  }).join('');
  const finish = `<button class="button button-secondary" type="button" data-finish-session ${state.completed ? 'disabled' : ''}>${state.completed ? 'Session completed' : 'Finish session'}</button>`;
  const chapterLabel = String(session.chapter).padStart(2, '0');
  const completion = context.endOfCatalog
    ? `<div class="completion-choice"><h3 id="catalog-completion-heading" tabindex="-1">${state.completed ? `Chapter ${chapterLabel} complete` : 'Finish the milestone'}</h3>
    <p>${state.completed ? `You’ve finished the available Chapter ${chapterLabel} sequence. Your learning history is saved. Return home to revisit any session, or repeat this milestone to keep practicing.` : 'Finish when you’re ready to save this milestone. You can record Practicing or Stuck and choose a skill to revisit.'}</p>
    <div class="session-actions">${finish}<button class="button button-primary" type="button" data-return-home>Return home</button></div></div>`
    : `<div class="completion-choice"><h3>Choose what happens next</h3><p>Finish records completion without moving on. When another session is available, Continue records completion and opens it. Your reflections can still say Practicing or Stuck.</p>
    <div class="session-actions"><button class="button button-secondary" type="button" data-finish-session ${state.completed ? 'disabled' : ''}>${state.completed ? 'Finished for today' : 'Finish for today'}</button><button class="button button-primary" type="button" data-continue-session>Continue to next session</button></div></div>`;
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
    <ul>${session.keepPlaying.map((activity) => `<li>${activity}</li>`).join('')}</ul>${(session.keepPlayingBlocks ?? []).map((block) => renderBlock(block, context)).join('')}</div>
    ${completion}
  </section>`;
}

export function renderSessionStep(session, stepIndex, state, { music, reinforcements, assets = {}, endOfCatalog = false }) {
  const step = session.steps[stepIndex];
  const stepAssessment = state.stepAssessments?.[step.id] ?? {};
  const blocks = step.blocks.map((block) => renderBlock(block, { music, assets, stepAssessment })).join('');
  const ending = stepIndex === session.steps.length - 1 ? renderSessionEnding(session, state, reinforcements, { music, assets, stepAssessment, endOfCatalog }) : '';
  return `<header class="step-header"><p class="eyebrow">Session ${session.id} · ${session.type} · Step ${stepIndex + 1} of ${session.steps.length} · ${step.kicker}</p><h2>${step.title}</h2><p>${step.intro}</p><button class="step-help" type="button" data-ask-chatgpt>Ask ChatGPT about this step</button></header>${blocks}${ending}`;
}

export function renderStepNavigation(session, state) {
  return session.steps.map((step, index) => {
    const assessment = state.stepAssessments?.[step.id] ?? {};
    const complete = assessment.understands && assessment.canPlay;
    return `<li><button type="button" data-step="${index}" ${index === state.stepIndex ? 'aria-current="step"' : ''}><span>${complete ? '✓' : index + 1}</span><span><small>Step ${index + 1}</small>${step.title}</span></button></li>`;
  }).join('');
}

export function renderSessionNavigation(sessions, progress, viewingSessionId) {
  const viewed = sessions.find(({ id }) => id === viewingSessionId);
  if (!viewed) return '';
  const available = new Set(availableSessionIds(sessions, progress));
  const chapter = String(viewed.chapter).padStart(2, '0');
  const entries = sessions.filter((session) => session.chapter === viewed.chapter && available.has(session.id)).map((session) => {
    const state = progress.sessions[session.id];
    return `<li><button type="button" data-session="${session.id}" ${session.id === viewingSessionId ? 'aria-current="page"' : ''}><span>${state?.completed ? '✓' : session.id}</span><span><small>${session.type}</small>${session.title}</span></button></li>`;
  }).join('');
  return `<h3 class="nav-heading" id="session-list-heading">Chapter ${chapter} · Available Sessions</h3>
    <ol class="session-list" id="session-list" aria-labelledby="session-list-heading">${entries}</ol>`;
}
