import { BLOCK_TYPES, SESSION_TYPES } from './session-catalog.js';

const PITCH_PATTERN = /^[A-G](?:#|b)?[0-8]$/;
const RHYTHMS = new Set(['pulse', 'quarter', 'half', 'quarter-rest', 'whole-measure-rest']);
const NOTE_RHYTHMS = new Set(['pulse', 'quarter', 'half']);
const REST_RHYTHMS = new Set(['quarter-rest', 'whole-measure-rest']);
const FIXED_BEATS = { quarter: 1, half: 2, 'quarter-rest': 1 };

export class ContentValidationError extends Error {
  constructor(result) {
    super(`Curriculum content failed validation with ${result.errors.length} error(s).`);
    this.name = 'ContentValidationError';
    this.category = 'schema';
    this.issues = result.errors;
  }
}

function issue(code, path, message, category = 'schema') { return { code, path, message, category }; }

function validateMusicEvent(event, path, meter, errors) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    errors.push(issue('event-shape', path, 'A music event must be an object.'));
    return;
  }
  if (!['note', 'rest'].includes(event.kind)) errors.push(issue('event-kind', `${path}.kind`, 'Event kind must be note or rest.'));
  if (typeof event.rhythm !== 'string' || event.rhythm.length === 0) errors.push(issue('rhythm-required', `${path}.rhythm`, 'Every event requires a rhythmic value.'));
  else if (!RHYTHMS.has(event.rhythm)) errors.push(issue('rhythm', `${path}.rhythm`, `Unrecognized rhythmic value: ${event.rhythm}.`));

  if (event.kind === 'note') {
    if (typeof event.pitch !== 'string' || event.pitch.length === 0) errors.push(issue('pitch-required', `${path}.pitch`, 'A note event requires one pitch.'));
    else if (!PITCH_PATTERN.test(event.pitch)) errors.push(issue('pitch', `${path}.pitch`, `Invalid pitch name: ${event.pitch}.`));
    if (event.finger !== undefined && (!Number.isInteger(event.finger) || event.finger < 1 || event.finger > 5)) errors.push(issue('finger', `${path}.finger`, 'Fingering must be an integer from 1 to 5.'));
    if (RHYTHMS.has(event.rhythm) && !NOTE_RHYTHMS.has(event.rhythm)) errors.push(issue('event-incompatible', path, 'A note event cannot use a rest rhythmic value.'));
  }
  if (event.kind === 'rest') {
    if (event.pitch !== undefined && event.pitch !== null) errors.push(issue('rest-pitch', `${path}.pitch`, 'A rest event cannot contain a pitch.'));
    if (event.finger !== undefined && event.finger !== null) errors.push(issue('rest-finger', `${path}.finger`, 'A rest event cannot contain a fingering.'));
    if (event.rhythm && !REST_RHYTHMS.has(event.rhythm)) errors.push(issue('event-incompatible', path, 'A rest event must use a rest rhythmic value.'));
  }
  if (meter && event.rhythm === 'pulse') errors.push(issue('rhythm-meter', `${path}.rhythm`, 'The unmetered pulse value cannot be used inside a metered measure.'));
  if (!meter && event.rhythm === 'whole-measure-rest') errors.push(issue('rhythm-meter', `${path}.rhythm`, 'A whole-measure rest requires a meter.'));
  if (meter) {
    if (!Number.isFinite(event.beats) || event.beats <= 0) errors.push(issue('beats-required', `${path}.beats`, 'A metered event requires a positive beat duration.'));
    else {
      const expected = event.rhythm === 'whole-measure-rest' ? meter.beats : FIXED_BEATS[event.rhythm];
      if (expected !== undefined && event.beats !== expected) errors.push(issue('rhythm-beats', `${path}.beats`, `${event.rhythm} must last ${expected} beat(s) in this schema.`));
    }
  } else if (event.beats !== undefined && (!Number.isFinite(event.beats) || event.beats <= 0)) {
    errors.push(issue('beats', `${path}.beats`, 'Event beats must be a positive number when supplied.'));
  }
}

function validateMusic(music, errors) {
  for (const [id, example] of Object.entries(music)) {
    const path = `music.${id}`;
    if (!example || typeof example !== 'object' || Array.isArray(example)) {
      errors.push(issue('music-shape', path, 'A music entry must be an object.'));
      continue;
    }
    if (example.id !== id) errors.push(issue('music-id', `${path}.id`, 'Music entry ID must match its catalog key.'));
    const hasEvents = Array.isArray(example.events);
    const hasMeasures = Array.isArray(example.measures);
    if (hasEvents === hasMeasures) errors.push(issue('music-structure', path, 'Music must define either an unmetered events array or a measures array, but not both.'));
    if (example.meter !== null && example.meter !== undefined) {
      if (!example.meter || !Number.isFinite(example.meter.beats) || example.meter.beats <= 0 || !Number.isInteger(example.meter.beatValue) || example.meter.beatValue <= 0) {
        errors.push(issue('meter', `${path}.meter`, 'Meter requires positive beats and an integer beatValue.'));
      }
      if (!hasMeasures) errors.push(issue('meter-structure', path, 'Metered music must use measures.'));
    } else if (hasMeasures) {
      errors.push(issue('meter-required', `${path}.meter`, 'Measure-based music requires a meter.'));
    }
    if (hasEvents) {
      if (example.events.length === 0) errors.push(issue('events', `${path}.events`, 'An unmetered example needs at least one event.'));
      example.events.forEach((event, index) => validateMusicEvent(event, `${path}.events.${index}`, null, errors));
    }
    if (hasMeasures) {
      example.measures.forEach((measure, measureIndex) => {
        const measurePath = `${path}.measures.${measureIndex}`;
        if (!measure || typeof measure !== 'object' || Array.isArray(measure)) {
          errors.push(issue('measure-shape', measurePath, 'A measure must be an object.'));
          return;
        }
        if (measure.voices !== undefined || measure.staves !== undefined) {
          errors.push(issue('polyphony-unsupported', measurePath, 'Polyphonic or multi-staff measures require the future voice-aware schema and are not summed as monophonic events.'));
          return;
        }
        if (!Array.isArray(measure.events) || measure.events.length === 0) {
          errors.push(issue('measure-events', `${measurePath}.events`, 'A monophonic measure needs at least one event.'));
          return;
        }
        measure.events.forEach((event, eventIndex) => validateMusicEvent(event, `${measurePath}.events.${eventIndex}`, example.meter, errors));
        const hasDurations = measure.events.every((event) => event && Number.isFinite(event.beats) && event.beats > 0);
        if (hasDurations && example.meter?.beats > 0) {
          const total = measure.events.reduce((sum, event) => sum + event.beats, 0);
          if (total !== example.meter.beats) errors.push(issue('measure-total', measurePath, `Measure totals ${total} beats; expected ${example.meter.beats}.`));
        }
      });
    }
  }
}

export function validateCurriculum({ sessions = [], reinforcements = {}, music = {}, assets = {} }) {
  const errors = [];
  const warnings = [];
  const ids = sessions.map((session) => session.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  [...new Set(duplicateIds)].forEach((id) => errors.push(issue('duplicate-session', `sessions.${id}`, `Session ID ${id} is duplicated.`)));

  sessions.forEach((session, index) => {
    const path = `sessions.${index}`;
    const expectedId = String(index + 1).padStart(3, '0');
    if (session.id !== expectedId) errors.push(issue('session-sequence', `${path}.id`, `Expected populated session ${expectedId}, received ${session.id ?? 'no ID'}.`));
    for (const field of ['id', 'title', 'type', 'chapter', 'objective', 'prerequisites', 'duration', 'steps', 'musicRefs', 'assetRefs', 'outcome', 'reflection', 'keepPlaying', 'readiness', 'reinforcementRefs']) {
      if (session[field] === undefined || session[field] === null || session[field] === '') errors.push(issue('required-field', `${path}.${field}`, `Session field ${field} is required.`));
    }
    if (!SESSION_TYPES.includes(session.type)) errors.push(issue('session-type', `${path}.type`, `Session type must be one of ${SESSION_TYPES.join(', ')}.`));
    if (!Number.isInteger(session.chapter) || session.chapter < 1) errors.push(issue('chapter', `${path}.chapter`, 'Chapter must be a positive integer.'));
    const { min, max } = session.duration ?? {};
    if (!Number.isFinite(min) || !Number.isFinite(max) || min < 5 || max > 30 || min > max) {
      errors.push(issue('duration', `${path}.duration`, 'Duration must be an ordered range between 5 and 30 minutes.'));
    } else if (min < 10 || max > 15) {
      warnings.push(issue('duration-target', `${path}.duration`, 'Core duration falls outside the 10–15-minute design target.', 'pedagogical'));
    }

    for (const prerequisite of session.prerequisites ?? []) {
      const prerequisiteIndex = ids.indexOf(prerequisite);
      if (prerequisiteIndex < 0) errors.push(issue('prerequisite-reference', `${path}.prerequisites`, `Unknown prerequisite session ${prerequisite}.`));
      else if (prerequisiteIndex >= index) errors.push(issue('prerequisite-order', `${path}.prerequisites`, `Prerequisite ${prerequisite} must come before ${session.id}.`));
    }

    const stepIds = new Set();
    for (const [stepIndex, step] of (session.steps ?? []).entries()) {
      const stepPath = `${path}.steps.${stepIndex}`;
      if (!step.id || !step.title || !Array.isArray(step.blocks) || step.blocks.length === 0) errors.push(issue('step-shape', stepPath, 'Each step needs an ID, title, and at least one block.'));
      if (stepIds.has(step.id)) errors.push(issue('duplicate-step', `${stepPath}.id`, `Step ID ${step.id} is duplicated within session ${session.id}.`));
      stepIds.add(step.id);
      for (const [blockIndex, block] of (step.blocks ?? []).entries()) {
        const blockPath = `${stepPath}.blocks.${blockIndex}`;
        if (!BLOCK_TYPES.includes(block.type)) errors.push(issue('block-type', `${blockPath}.type`, `Unrecognized block type: ${block.type}.`));
        if (block.assetRef && !assets[block.assetRef]) errors.push(issue('asset-reference', `${blockPath}.assetRef`, `Unknown asset ${block.assetRef}.`));
        if (block.musicRef && !music[block.musicRef]) errors.push(issue('music-reference', `${blockPath}.musicRef`, `Unknown music example ${block.musicRef}.`));
      }
    }
    if (!Array.isArray(session.steps) || session.steps.length === 0) errors.push(issue('steps', `${path}.steps`, 'A session must contain at least one instructional step.'));

    for (const reference of session.musicRefs ?? []) if (!music[reference]) errors.push(issue('music-reference', `${path}.musicRefs`, `Unknown music example ${reference}.`));
    for (const reference of session.assetRefs ?? []) if (!assets[reference]) errors.push(issue('asset-reference', `${path}.assetRefs`, `Unknown asset ${reference}.`));
    for (const reference of session.reinforcementRefs ?? []) if (!reinforcements[reference]) errors.push(issue('reinforcement-reference', `${path}.reinforcementRefs`, `Unknown reinforcement ${reference}.`));
    for (const readiness of Object.values(session.readiness ?? {})) {
      for (const reference of readiness.reinforcementRefs ?? []) if (!reinforcements[reference]) errors.push(issue('reinforcement-reference', `${path}.readiness`, `Unknown reinforcement ${reference}.`));
    }
    if (!session.reflection?.understanding || !session.reflection?.playing) errors.push(issue('reflection', `${path}.reflection`, 'Understanding and playing reflection prompts are required.'));
    for (const flag of session.pedagogicalReview ?? []) warnings.push(issue('educator-review', `${path}.pedagogicalReview`, flag, 'pedagogical'));
  });

  for (const [id, reinforcement] of Object.entries(reinforcements)) {
    if (reinforcement.id !== id) errors.push(issue('reinforcement-id', `reinforcements.${id}.id`, 'Reinforcement ID must match its catalog key.'));
    for (const sessionId of reinforcement.sessions ?? []) if (!ids.includes(sessionId)) errors.push(issue('reinforcement-session', `reinforcements.${id}.sessions`, `Unknown session ${sessionId}.`));
    if (reinforcement.earlierSessionId && !ids.includes(reinforcement.earlierSessionId)) errors.push(issue('reinforcement-session', `reinforcements.${id}.earlierSessionId`, `Unknown earlier session ${reinforcement.earlierSessionId}.`));
  }
  validateMusic(music, errors);
  return { valid: errors.length === 0, errors, warnings };
}

export function assertValidCurriculum(catalogs) {
  const result = validateCurriculum(catalogs);
  if (!result.valid) throw new ContentValidationError(result);
  return result;
}
