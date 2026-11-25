import { BLOCK_TYPES, SESSION_TYPES } from './session-catalog.js';

const PITCH_PATTERN = /^[A-G](?:#|b)?[0-8]$/;
const RHYTHMS = new Set(['pulse', 'quarter', 'half', 'quarter-rest', 'whole-measure-rest']);
const NOTE_RHYTHMS = new Set(['pulse', 'quarter', 'half']);
const REST_RHYTHMS = new Set(['quarter-rest', 'whole-measure-rest']);
const FIXED_BEATS = { quarter: 1, half: 2, 'quarter-rest': 1 };
const STAFF_LETTERS = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

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

function validatePitchList(pitches, path, errors) {
  if (!Array.isArray(pitches) || pitches.length === 0) {
    errors.push(issue('pitch-list', path, 'A listening pattern needs at least one pitch.'));
    return;
  }
  pitches.forEach((pitch, index) => {
    if (typeof pitch !== 'string' || !PITCH_PATTERN.test(pitch)) errors.push(issue('pitch', `${path}.${index}`, `Invalid pitch name: ${pitch}.`));
  });
}

function staffIndex(pitch) {
  const match = /^([A-G])(?:#|b)?([0-8])$/.exec(pitch ?? '');
  return match ? Number(match[2]) * 7 + STAFF_LETTERS[match[1]] : null;
}

function eventTimeline(events) {
  let onset = 0;
  return events.map((event) => {
    const entry = { event, onset, end: onset + (Number.isFinite(event?.beats) ? event.beats : 0) };
    onset = entry.end;
    return entry;
  });
}

function validateMusic(music, assets, errors) {
  for (const [id, example] of Object.entries(music)) {
    const path = `music.${id}`;
    if (!example || typeof example !== 'object' || Array.isArray(example)) {
      errors.push(issue('music-shape', path, 'A music entry must be an object.'));
      continue;
    }
    if (example.id !== id) errors.push(issue('music-id', `${path}.id`, 'Music entry ID must match its catalog key.'));
    if (example.kind === 'reference-set') {
      if (!Array.isArray(example.refs) || example.refs.length === 0) errors.push(issue('music-set', `${path}.refs`, 'A reference set needs at least one music reference.'));
      for (const reference of example.refs ?? []) if (!music[reference] || reference === id) errors.push(issue('music-set-reference', `${path}.refs`, `Unknown or recursive music reference ${reference}.`));
      continue;
    }
    if (example.kind === 'listening-set') {
      if (!Array.isArray(example.pairs) || example.pairs.length === 0) errors.push(issue('listening-pairs', `${path}.pairs`, 'A listening set needs at least one pair.'));
      const pairIds = new Set();
      for (const [pairIndex, pair] of (example.pairs ?? []).entries()) {
        const pairPath = `${path}.pairs.${pairIndex}`;
        if (!pair?.id || pairIds.has(pair.id)) errors.push(issue('listening-pair-id', `${pairPath}.id`, 'Listening pair IDs are required and must be unique.'));
        pairIds.add(pair?.id);
        if (!['same', 'different'].includes(pair?.answer)) errors.push(issue('listening-answer', `${pairPath}.answer`, 'Listening answer must be same or different.'));
        validatePitchList(pair?.first, `${pairPath}.first`, errors);
        validatePitchList(pair?.second, `${pairPath}.second`, errors);
        if (pair?.answer === 'same' && JSON.stringify(pair.first) !== JSON.stringify(pair.second)) errors.push(issue('listening-answer-data', pairPath, 'A pair marked same must contain identical pitch sequences.'));
        if (pair?.answer === 'different' && JSON.stringify(pair.first) === JSON.stringify(pair.second)) errors.push(issue('listening-answer-data', pairPath, 'A pair marked different must contain different pitch sequences.'));
        if (!pair?.audioRef || assets[pair.audioRef]?.type !== 'audio') errors.push(issue('audio-reference', `${pairPath}.audioRef`, `Unknown audio asset ${pair?.audioRef ?? 'none'}.`));
      }
      continue;
    }
    if (example.kind === 'pulse-guide') {
      if (!Number.isInteger(example.beats) || example.beats < 1 || !Number.isInteger(example.groupSize) || example.groupSize < 1 || example.beats % example.groupSize !== 0) {
        errors.push(issue('pulse-shape', path, 'A pulse guide needs a positive beat count evenly divisible by its positive group size.'));
      }
      if (!Number.isFinite(example.bpm) || example.bpm < 40 || example.bpm > 120) errors.push(issue('pulse-tempo', `${path}.bpm`, 'Pulse guide tempo must be between 40 and 120 bpm.'));
      continue;
    }
    if (example.kind === 'pitch-echo-set') {
      if (!Array.isArray(example.echoes) || example.echoes.length === 0) errors.push(issue('echo-set', `${path}.echoes`, 'A pitch-echo set needs at least one echo.'));
      const echoIds = new Set();
      for (const [echoIndex, echo] of (example.echoes ?? []).entries()) {
        const echoPath = `${path}.echoes.${echoIndex}`;
        if (!echo?.id || echoIds.has(echo.id)) errors.push(issue('echo-id', `${echoPath}.id`, 'Pitch-echo IDs are required and must be unique.'));
        echoIds.add(echo?.id);
        validatePitchList(echo?.pitches, `${echoPath}.pitches`, errors);
        if (!Array.isArray(echo?.directions) || echo.directions.length !== Math.max(0, (echo?.pitches?.length ?? 0) - 1) || echo.directions.some((direction) => !['repeat', 'up', 'down'].includes(direction))) errors.push(issue('echo-directions', `${echoPath}.directions`, 'Echo directions must describe every movement as repeat, up, or down.'));
        if (!echo?.audioRef || assets[echo.audioRef]?.type !== 'audio') errors.push(issue('audio-reference', `${echoPath}.audioRef`, `Unknown audio asset ${echo?.audioRef ?? 'none'}.`));
      }
      continue;
    }
    if (example.kind === 'dynamic-model') {
      if (!example.meter || example.meter.beats !== 4 || example.meter.beatValue !== 4) errors.push(issue('meter', `${path}.meter`, 'The dynamic model requires 4/4.'));
      if (!Array.isArray(example.groups) || example.groups.length !== 2 || example.groups.map(({ dynamic }) => dynamic).join(',') !== 'p,f') errors.push(issue('dynamic-groups', `${path}.groups`, 'The dynamic model requires p then f groups.'));
      for (const [groupIndex, group] of (example.groups ?? []).entries()) {
        const groupPath = `${path}.groups.${groupIndex}`;
        if (!Array.isArray(group.events) || group.events.length === 0) errors.push(issue('measure-events', `${groupPath}.events`, 'A dynamic group requires events.'));
        for (const [eventIndex, event] of (group.events ?? []).entries()) validateMusicEvent(event, `${groupPath}.events.${eventIndex}`, example.meter, errors);
        const total = (group.events ?? []).reduce((sum, event) => sum + (Number.isFinite(event?.beats) ? event.beats : 0), 0);
        if (total !== 4) errors.push(issue('measure-total', groupPath, `Dynamic group totals ${total} beats; expected 4.`));
      }
      if (!example.audioRef || assets[example.audioRef]?.type !== 'audio') errors.push(issue('audio-reference', `${path}.audioRef`, `Unknown audio asset ${example.audioRef ?? 'none'}.`));
      continue;
    }
    if (example.kind === 'hand-pattern') {
      if (!example.meter || example.meter.beats !== 4 || example.meter.beatValue !== 4) errors.push(issue('meter', `${path}.meter`, 'The hand-pattern schema currently requires 4/4.'));
      if (!Array.isArray(example.measures) || example.measures.length === 0) errors.push(issue('measure-events', `${path}.measures`, 'A hand pattern needs at least one measure.'));
      for (const [measureIndex, measure] of (example.measures ?? []).entries()) {
        const measurePath = `${path}.measures.${measureIndex}`;
        if (!Array.isArray(measure?.events) || measure.events.length === 0) {
          errors.push(issue('measure-events', `${measurePath}.events`, 'A hand-pattern measure needs events.'));
          continue;
        }
        measure.events.forEach((event, eventIndex) => {
          validateMusicEvent(event, `${measurePath}.events.${eventIndex}`, example.meter, errors);
          if (!['RH', 'LH'].includes(event?.hand)) errors.push(issue('hand-assignment', `${measurePath}.events.${eventIndex}.hand`, 'A hand-pattern note requires RH or LH.'));
        });
        const total = measure.events.reduce((sum, event) => sum + (Number.isFinite(event?.beats) ? event.beats : 0), 0);
        if (total !== example.meter.beats) errors.push(issue('measure-total', measurePath, `Measure totals ${total} beats; expected ${example.meter.beats}.`));
      }
      continue;
    }
    if (example.kind === 'paired-score') {
      if (!example.meter || example.meter.beats !== 4 || example.meter.beatValue !== 4) errors.push(issue('meter', `${path}.meter`, 'The paired-score schema currently requires 4/4.'));
      if (example.notation?.layout !== 'paired' || example.notation?.upperClef !== 'treble' || example.notation?.lowerClef !== 'bass') errors.push(issue('paired-notation', `${path}.notation`, 'A paired score requires treble above bass.'));
      if (!Array.isArray(example.measures) || example.measures.length === 0) errors.push(issue('paired-measures', `${path}.measures`, 'A paired score needs at least one measure.'));
      for (const [measureIndex, measure] of (example.measures ?? []).entries()) {
        const measurePath = `${path}.measures.${measureIndex}`;
        const isAlternatingMeasure = Array.isArray(measure?.activeHands);
        if (isAlternatingMeasure) {
          if (!example.alternatingHands) errors.push(issue('alternating-hands-unsupported', `${measurePath}.activeHands`, 'Alternating hands require the bounded alternatingHands score flag.'));
          if (measure.activeHands.length !== 2 || new Set(measure.activeHands).size !== 2 || !measure.activeHands.includes('RH') || !measure.activeHands.includes('LH')) errors.push(issue('active-hands', `${measurePath}.activeHands`, 'An alternating measure requires exactly LH and RH.'));
          if (measure.activeHand !== undefined) errors.push(issue('active-hand-shape', measurePath, 'Use activeHands, not activeHand, for an alternating measure.'));
        } else if (!['RH', 'LH'].includes(measure?.activeHand)) errors.push(issue('active-hand', `${measurePath}.activeHand`, 'A paired measure requires activeHand RH or LH.'));
        for (const [staffName, expectedClef] of [['treble', 'treble'], ['bass', 'bass']]) {
          const staff = measure?.staves?.[staffName];
          const staffPath = `${measurePath}.staves.${staffName}`;
          if (!staff || staff.clef !== expectedClef || !Array.isArray(staff.events) || staff.events.length === 0) {
            errors.push(issue('paired-staff', staffPath, `A paired measure requires a ${expectedClef} staff with events.`));
            continue;
          }
          staff.events.forEach((event, eventIndex) => validateMusicEvent(event, `${staffPath}.events.${eventIndex}`, example.meter, errors));
          const total = staff.events.reduce((sum, event) => sum + (Number.isFinite(event?.beats) ? event.beats : 0), 0);
          if (total !== example.meter.beats) errors.push(issue('staff-total', staffPath, `${staffName} staff totals ${total} beats; expected ${example.meter.beats}.`));
          if (isAlternatingMeasure) {
            if (!staff.events.some((event) => event.kind === 'note')) errors.push(issue('alternating-staff-note', staffPath, 'Each staff in the bounded alternating measure requires a note entrance.'));
            if (staff.events.some((event) => event.kind === 'rest' && event.rhythm !== 'quarter-rest')) errors.push(issue('alternating-staff-rest', staffPath, 'Gaps in the alternating measure must use explicit quarter rests.'));
          } else {
            const activeStaff = measure.activeHand === 'RH' ? 'treble' : 'bass';
            if (staffName === activeStaff && staff.events.some((event) => event.kind !== 'note')) errors.push(issue('active-staff-rest', staffPath, 'The active staff in this bounded schema must contain only notes.'));
            if (staffName !== activeStaff && !(staff.events.length === 1 && staff.events[0].kind === 'rest' && staff.events[0].rhythm === 'whole-measure-rest')) errors.push(issue('inactive-staff-rest', staffPath, 'The inactive staff must contain exactly one whole-measure rest.'));
          }
        }
        if (isAlternatingMeasure && measure.staves?.treble?.events && measure.staves?.bass?.events) {
          const sounding = [
            ...eventTimeline(measure.staves.treble.events).filter(({ event }) => event.kind === 'note').map((entry) => ({ ...entry, hand: 'RH' })),
            ...eventTimeline(measure.staves.bass.events).filter(({ event }) => event.kind === 'note').map((entry) => ({ ...entry, hand: 'LH' }))
          ].sort((a, b) => a.onset - b.onset);
          for (let index = 1; index < sounding.length; index += 1) if (sounding[index].onset < sounding[index - 1].end) errors.push(issue('paired-note-overlap', measurePath, 'The bounded alternating-hand measure cannot contain overlapping notes.'));
          const entrances = measure.handEntrances ?? [];
          if (entrances.length !== 2) errors.push(issue('hand-entrances', `${measurePath}.handEntrances`, 'The alternating measure requires explicit LH and RH entrances.'));
          for (const [entranceIndex, entrance] of entrances.entries()) {
            const entrancePath = `${measurePath}.handEntrances.${entranceIndex}`;
            const staffName = entrance.hand === 'RH' ? 'treble' : entrance.hand === 'LH' ? 'bass' : null;
            const matching = staffName && eventTimeline(measure.staves[staffName].events).find(({ event, onset }) => event.kind === 'note' && onset === entrance.beat - 1);
            if (!staffName || !Number.isInteger(entrance.beat) || entrance.beat < 1 || entrance.beat > 4 || !matching) errors.push(issue('hand-entrance-timing', entrancePath, 'Each hand entrance must identify a sounding note on its exact beat.'));
            else if (matching.event.finger !== entrance.finger) errors.push(issue('hand-entrance-finger', entrancePath, 'Entrance fingering must match the sounding note.'));
          }
        }
      }
      for (const reference of example.audioRefs ?? []) if (assets[reference]?.type !== 'audio') errors.push(issue('audio-reference', `${path}.audioRefs`, `Unknown audio asset ${reference}.`));
      continue;
    }
    const hasEvents = Array.isArray(example.events);
    const hasMeasures = Array.isArray(example.measures);
    if (hasEvents === hasMeasures) errors.push(issue('music-structure', path, 'Music must define either an unmetered events array or a measures array, but not both.'));
    if (example.meter !== null && example.meter !== undefined) {
      if (![2, 3, 4].includes(example.meter.beats) || example.meter.beatValue !== 4) {
        errors.push(issue('meter', `${path}.meter`, 'Single-staff meter must be 2/4, 3/4, or 4/4.'));
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
    if (example.notation !== undefined) {
      if (!['treble', 'bass', 'neutral'].includes(example.notation?.clef)) errors.push(issue('notation-clef', `${path}.notation.clef`, 'Notation clef must be treble, bass, or neutral.'));
      const events = example.measures?.flatMap((measure) => measure.events ?? []) ?? example.events ?? [];
      if (example.notation?.clef === 'neutral') {
        const steps = example.notation.staffSteps;
        if (!Array.isArray(steps) || steps.length !== events.length || steps.some((step) => !Number.isInteger(step))) errors.push(issue('staff-steps', `${path}.notation.staffSteps`, 'Neutral notation needs one integer staff step for every event.'));
        else {
          const basePitch = staffIndex(events[0]?.pitch);
          events.forEach((event, index) => {
            const pitchDistance = staffIndex(event.pitch) - basePitch;
            const stepDistance = steps[index] - steps[0];
            if (pitchDistance !== stepDistance) errors.push(issue('staff-pitch-relationship', `${path}.notation.staffSteps.${index}`, 'Staff-step movement must match the pitch relationship.'));
          });
        }
      }
    }
    for (const field of ['audioRef', 'countedAudioRef']) {
      if (example[field] && assets[example[field]]?.type !== 'audio') errors.push(issue('audio-reference', `${path}.${field}`, `Unknown audio asset ${example[field]}.`));
    }
    for (const reference of example.audioRefs ?? []) if (assets[reference]?.type !== 'audio') errors.push(issue('audio-reference', `${path}.audioRefs`, `Unknown audio asset ${reference}.`));
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
        if (block.hintVisual && block.hintVisual.type !== 'keyboard') errors.push(issue('hint-visual-type', `${blockPath}.hintVisual.type`, 'Practice hint visuals currently support only keyboard diagrams.'));
        if (block.hintVisual?.assetRef && !assets[block.hintVisual.assetRef]) errors.push(issue('asset-reference', `${blockPath}.hintVisual.assetRef`, `Unknown asset ${block.hintVisual.assetRef}.`));
        if (block.musicRef && !music[block.musicRef]) errors.push(issue('music-reference', `${blockPath}.musicRef`, `Unknown music example ${block.musicRef}.`));
        for (const reference of block.musicRefs ?? []) if (!music[reference]) errors.push(issue('music-reference', `${blockPath}.musicRefs`, `Unknown music example ${reference}.`));
        if (block.type === 'audio-listening' && music[block.musicRef]?.kind !== 'listening-set') errors.push(issue('block-music-type', blockPath, 'An audio-listening block requires a listening-set music reference.'));
        if (block.type === 'audio-listening') {
          const availablePairs = new Set(music[block.musicRef]?.pairs?.map(({ id }) => id));
          if (!Array.isArray(block.pairIds) || block.pairIds.length === 0) errors.push(issue('listening-pair-reference', `${blockPath}.pairIds`, 'An audio-listening block needs at least one pair reference.'));
          for (const pairId of block.pairIds ?? []) if (!availablePairs.has(pairId)) errors.push(issue('listening-pair-reference', `${blockPath}.pairIds`, `Unknown listening pair ${pairId}.`));
        }
        if (block.type === 'pulse-guide' && music[block.musicRef]?.kind !== 'pulse-guide' && !Array.isArray(music[block.musicRef]?.events) && !Array.isArray(music[block.musicRef]?.measures)) errors.push(issue('block-music-type', blockPath, 'A pulse-guide block requires pulse-guide data or sequential music events.'));
        if (block.type === 'notation') {
          if (!Array.isArray(block.musicRefs) || block.musicRefs.length === 0) errors.push(issue('notation-reference', `${blockPath}.musicRefs`, 'A notation block needs at least one music reference.'));
          for (const reference of block.musicRefs ?? []) if (!music[reference]?.notation || !Array.isArray(music[reference]?.measures)) errors.push(issue('block-music-type', blockPath, `Notation reference ${reference} must contain notated measures.`));
        }
        if (block.type === 'pitch-echo') {
          const echoes = music[block.musicRef]?.echoes ?? [];
          const availableEchoes = new Set(echoes.map(({ id }) => id));
          if (music[block.musicRef]?.kind !== 'pitch-echo-set') errors.push(issue('block-music-type', blockPath, 'A pitch-echo block requires a pitch-echo-set reference.'));
          for (const echoId of block.echoIds ?? []) if (!availableEchoes.has(echoId)) errors.push(issue('echo-reference', `${blockPath}.echoIds`, `Unknown pitch echo ${echoId}.`));
        }
        if (block.type === 'hand-lanes' && !['hand-pattern', 'paired-score'].includes(music[block.musicRef]?.kind)) errors.push(issue('block-music-type', blockPath, 'A hand-lanes block requires a hand-pattern or paired-score reference.'));
        if (block.type === 'dynamic-demo' && music[block.musicRef]?.kind !== 'dynamic-model') errors.push(issue('block-music-type', blockPath, 'A dynamic-demo block requires a dynamic-model reference.'));
        if (block.type === 'rhythm-echo') {
          if (!Array.isArray(block.musicRefs) || block.musicRefs.length === 0) errors.push(issue('echo-reference', `${blockPath}.musicRefs`, 'A rhythm-echo block needs at least one music reference.'));
          for (const reference of block.musicRefs ?? []) if (!music[reference]?.audioRef || !music[reference]?.countedAudioRef) errors.push(issue('block-music-type', blockPath, `Rhythm echo ${reference} requires pattern and counted audio.`));
        }
        if (block.type === 'audio-reference') {
          if (!Array.isArray(block.tracks) || block.tracks.length === 0) errors.push(issue('audio-reference', `${blockPath}.tracks`, 'An audio-reference block needs at least one track.'));
          for (const track of block.tracks ?? []) if (assets[track.assetRef]?.type !== 'audio') errors.push(issue('audio-reference', `${blockPath}.tracks`, `Unknown audio asset ${track.assetRef}.`));
        }
      }
    }
    for (const [blockIndex, block] of (session.keepPlayingBlocks ?? []).entries()) {
      const blockPath = `${path}.keepPlayingBlocks.${blockIndex}`;
      if (!BLOCK_TYPES.includes(block.type)) errors.push(issue('block-type', `${blockPath}.type`, `Unrecognized block type: ${block.type}.`));
      for (const reference of block.musicRefs ?? []) if (!music[reference]) errors.push(issue('music-reference', `${blockPath}.musicRefs`, `Unknown music example ${reference}.`));
      if (block.type === 'rhythm-echo') {
        for (const reference of block.musicRefs ?? []) if (!music[reference]?.audioRef || !music[reference]?.countedAudioRef) errors.push(issue('block-music-type', blockPath, `Rhythm echo ${reference} requires pattern and counted audio.`));
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
  for (const [id, asset] of Object.entries(assets)) {
    if (asset.id !== id) errors.push(issue('asset-id', `assets.${id}.id`, 'Asset ID must match its catalog key.'));
    if (asset.type === 'audio' && (typeof asset.src !== 'string' || !asset.src.startsWith('assets/audio/'))) errors.push(issue('audio-source', `assets.${id}.src`, 'Audio assets require a local assets/audio source.'));
  }
  validateMusic(music, assets, errors);
  return { valid: errors.length === 0, errors, warnings };
}

export function assertValidCurriculum(catalogs) {
  const result = validateCurriculum(catalogs);
  if (!result.valid) throw new ContentValidationError(result);
  return result;
}
