const STAFF_TOP = 28;
const STAFF_GAP = 12;
const STAFF_BOTTOM = STAFF_TOP + STAFF_GAP * 4;
const MEASURE_WIDTH = 145;
const TREBLE_LEAD = 88;
const BASS_LEAD = 88;
const NEUTRAL_LEAD = 24;
const LETTER_INDEX = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

function pitchIndex(pitch) {
  const match = /^([A-G])(?:#|b)?([0-8])$/.exec(pitch);
  if (!match) throw new Error(`Cannot notate invalid pitch ${pitch}.`);
  return Number(match[2]) * 7 + LETTER_INDEX[match[1]];
}

export function treblePitchY(pitch) {
  const e4 = 4 * 7 + LETTER_INDEX.E;
  return STAFF_BOTTOM - (pitchIndex(pitch) - e4) * (STAFF_GAP / 2);
}

export function bassPitchY(pitch) {
  const g2 = 2 * 7 + LETTER_INDEX.G;
  return STAFF_BOTTOM - (pitchIndex(pitch) - g2) * (STAFF_GAP / 2);
}

function eventText(event) {
  if (event.kind !== 'rest') return `${event.pitch} ${event.rhythm}${event.hand ? ` ${event.hand}` : ''}`;
  return event.rhythm === 'whole-measure-rest' ? 'waits for all four beats' : 'quarter rest, one silent beat';
}

export function notationText(example) {
  if (example.kind === 'paired-score') {
    return example.measures.map((measure, index) => `Measure ${index + 1}: RH ${measure.staves.treble.events.map(eventText).join(', ')}; LH ${measure.staves.bass.events.map(eventText).join(', ')}`).join('. ');
  }
  return example.measures.map((measure, index) => `Measure ${index + 1}: ${measure.events.map(eventText).join(', ')}`).join('. ');
}

export function beatGridMarkup(example) {
  return `<div class="beat-grids">${example.measures.map((measure, measureIndex) => {
    const beats = [];
    for (const event of measure.events) {
      const label = event.kind === 'rest' ? 'rest · silent' : `${event.pitch.replace(/[0-9]$/, '')} begins`;
      beats.push(`<div${event.kind === 'rest' ? ' class="is-rest"' : ''}><strong>${beats.length + 1}</strong><span>${label}</span></div>`);
      for (let held = 1; held < event.beats; held += 1) beats.push(`<div class="is-held"><strong>${beats.length + 1}</strong><span>hold</span></div>`);
    }
    return `<section aria-label="Measure ${measureIndex + 1} beat guide"><p>Measure ${measureIndex + 1}</p><div class="beat-grid" style="--measure-beats:${example.meter.beats}">${beats.join('')}</div></section>`;
  }).join('')}</div>`;
}

function quarterRestMarkup(x, top = STAFF_TOP) {
  return `<g class="quarter-rest" data-rhythm="quarter-rest" aria-label="quarter rest, one silent beat"><text x="${x}" y="${top + 38}">𝄽</text></g>`;
}

function staffLines(width, top = STAFF_TOP) {
  return Array.from({ length: 5 }, (_, index) => `<line x1="0" y1="${top + index * STAFF_GAP}" x2="${width}" y2="${top + index * STAFF_GAP}"/>`).join('');
}

function noteMarkup(event, x, y, { label, finger, ledger, labelY = 112 }) {
  const half = event.rhythm === 'half';
  const ledgerMarkup = ledger ? `<line class="ledger-line" x1="${x - 11}" y1="${y}" x2="${x + 11}" y2="${y}"/>` : '';
  return `${ledgerMarkup}<g class="score-note" data-pitch="${event.pitch}" data-rhythm="${event.rhythm}">
    <ellipse class="notehead${half ? ' is-half' : ''}" cx="${x}" cy="${y}" rx="6.2" ry="4.3" transform="rotate(-16 ${x} ${y})"/>
    <line class="note-stem" x1="${x + 5}" y1="${y - 1}" x2="${x + 5}" y2="${y - 29}"/>
    ${finger ? `<text class="finger-label" x="${x}" y="${y - 34}">${finger}</text>` : ''}
    ${label ? `<text class="pitch-label" x="${x}" y="${labelY}">${event.pitch.replace(/[0-9]$/, '')}</text>` : ''}
  </g>`;
}

function clefMarkup(clef, top = 0, { beats = 4, beatValue = 4 } = {}) {
  const symbol = clef === 'bass' ? '𝄢' : '𝄞';
  const className = clef === 'bass' ? 'bass-clef' : 'treble-clef';
  return `<text class="${className}" x="7" y="${top + 78}">${symbol}</text><g class="time-signature"><text x="62" y="${top + 48}">${beats}</text><text x="62" y="${top + 72}">${beatValue}</text></g>`;
}

function readingDescription(example, clef) {
  const treble = ['ledger line below the staff', 'space below the staff', 'bottom line', 'first space', 'second line'];
  const bass = ['second space', 'middle line', 'third space', 'fourth line', 'fourth space'];
  const positions = clef === 'bass' ? bass : treble;
  return example.measures.map(({ events }, index) => {
    const notes = events.map((event) => event.kind === 'rest'
      ? eventText(event)
      : `${positions['CDEFG'.indexOf(event.pitch[0])]}, ${event.rhythm} note`);
    return `Measure ${index + 1}: ${notes.join('; ')}`;
  }).join('. ');
}

export function scoreMarkup(example, options = {}) {
  const clef = example.notation?.clef ?? 'treble';
  const lead = clef === 'treble' ? TREBLE_LEAD : clef === 'bass' ? BASS_LEAD : NEUTRAL_LEAD;
  const measureWidth = options.enlarged ? 180 : MEASURE_WIDTH;
  const width = lead + example.measures.length * measureWidth + 12;
  const height = options.showLabels ? 126 : 108;
  const flatEvents = example.measures.flatMap((measure) => measure.events);
  let flatIndex = 0;
  let measures = '';
  example.measures.forEach((measure, measureIndex) => {
    const startX = lead + measureIndex * measureWidth;
    let onset = 0;
    let notes = '';
    for (const event of measure.events) {
      const x = startX + 18 + onset * ((measureWidth - 28) / example.meter.beats);
      if (event.kind === 'rest') {
        notes += quarterRestMarkup(x);
        onset += event.beats;
        flatIndex += 1;
        continue;
      }
      const y = clef === 'neutral'
        ? STAFF_BOTTOM - (example.notation.staffSteps[flatIndex] * STAFF_GAP / 2)
        : clef === 'bass' ? bassPitchY(event.pitch) : treblePitchY(event.pitch);
      const showFinger = options.showAllFingers || (options.showStartingFinger && flatIndex === 0);
      notes += noteMarkup(event, x, y, { label: options.showLabels, finger: showFinger ? event.finger : null, ledger: clef === 'treble' && event.pitch === 'C4' });
      onset += event.beats;
      flatIndex += 1;
    }
    const measureNumber = options.measureNumbers ? `<text class="measure-number" x="${startX + 5}" y="16">${measure.displayNumber ?? measureIndex + 1}</text>` : '';
    measures += `${measureNumber}${notes}<line class="barline" x1="${startX + measureWidth}" y1="${STAFF_TOP}" x2="${startX + measureWidth}" y2="${STAFF_BOTTOM}"/>`;
  });
  const clefSymbols = clef === 'neutral' ? '' : clefMarkup(clef, 0, example.meter);
  const context = example.hand ? `${clef} clef, ${example.hand === 'LH' ? 'left' : 'right'} hand, ${example.meter.beats}/${example.meter.beatValue}. ` : '';
  const description = options.readingChallenge ? readingDescription(example, clef) : notationText(example);
  const direction = options.showDirections ? `<p class="score-directions">Shape: ${flatEvents.slice(1).map((event, index) => {
    const change = pitchIndex(event.pitch) - pitchIndex(flatEvents[index].pitch);
    return change === 0 ? 'repeat' : change > 0 ? 'up' : 'down';
  }).join(' · ')}</p>` : '';
  return `<figure class="score-figure${clef === 'neutral' ? ' is-neutral' : ''}">
    <div class="score-scroll" tabindex="0" aria-label="Scrollable music notation"><svg class="music-score" viewBox="0 0 ${width} ${height}" role="img" aria-label="${example.title}. ${context}${description}" style="--score-width:${width}px"><g class="staff-lines">${staffLines(width)}</g>${clefSymbols}${measures}</svg></div>
    <figcaption>${example.title}. ${options.caption ?? (options.readingChallenge ? context.trim() : description)}</figcaption>${direction}
  </figure>`;
}

function pairedPitchY(pitch, clef, bottom) {
  const reference = clef === 'treble' ? 4 * 7 + LETTER_INDEX.E : 2 * 7 + LETTER_INDEX.G;
  return bottom - (pitchIndex(pitch) - reference) * (STAFF_GAP / 2);
}

function pairedStaffEvents(events, clef, startX, measureWidth, meter, top, options) {
  if (events.length === 1 && events[0].kind === 'rest') {
    const x = startX + measureWidth / 2;
    return `<g class="whole-measure-rest" data-rhythm="whole-measure-rest" aria-label="wait for all four beats"><rect x="${x - 7}" y="${top + STAFF_GAP}" width="14" height="5"/></g>`;
  }
  let onset = 0;
  return events.map((event, index) => {
    const x = startX + 18 + onset * ((measureWidth - 28) / meter.beats);
    if (event.kind === 'rest') {
      onset += event.beats;
      return quarterRestMarkup(x, top);
    }
    const y = pairedPitchY(event.pitch, clef, top + STAFF_GAP * 4);
    const showFinger = event.showFinger || (options.showEntranceFingers && index === 0);
    onset += event.beats;
    return noteMarkup(event, x, y, { label: options.showLabels, finger: showFinger ? event.finger : null, ledger: clef === 'treble' && event.pitch === 'C4', labelY: top + 84 });
  }).join('');
}

export function pairedScoreMarkup(example, options = {}) {
  const measureWidth = options.enlarged ? 180 : MEASURE_WIDTH;
  const lead = TREBLE_LEAD;
  const width = lead + example.measures.length * measureWidth + 12;
  const trebleTop = 28;
  const bassTop = 128;
  const bassBottom = bassTop + STAFF_GAP * 4;
  const height = options.showLabels ? 230 : 214;
  const measures = example.measures.map((measure, index) => {
    const startX = lead + index * measureWidth;
    const labels = Array.isArray(measure.handEntrances)
      ? measure.handEntrances.map(({ hand, beat }) => {
          const x = startX + 18 + (beat - 1) * ((measureWidth - 28) / example.meter.beats);
          const y = hand === 'RH' ? trebleTop - 8 : bassTop - 8;
          return `<text class="active-hand-label" x="${x}" y="${y}">${hand}</text>`;
        }).join('')
      : `<text class="active-hand-label" x="${startX + 18}" y="${measure.activeHand === 'RH' ? trebleTop - 8 : bassTop - 8}">${measure.activeHand}</text>`;
    const dynamic = measure.dynamic ? `<text class="dynamic-label" x="${startX + 18}" y="${bassBottom + 24}">${measure.dynamic}</text>` : '';
    return `<text class="measure-number" x="${startX + 5}" y="15">${measure.displayNumber ?? index + 1}</text>
      ${labels}${dynamic}
      ${pairedStaffEvents(measure.staves.treble.events, 'treble', startX, measureWidth, example.meter, trebleTop, options)}
      ${pairedStaffEvents(measure.staves.bass.events, 'bass', startX, measureWidth, example.meter, bassTop, options)}
      <line class="barline paired-barline" x1="${startX + measureWidth}" y1="${trebleTop}" x2="${startX + measureWidth}" y2="${bassBottom}"/>`;
  }).join('');
  const dynamicKey = example.dynamics ? '<p class="dynamic-key"><em>p</em> = soft; <em>f</em> = strong, never forced.</p>' : '';
  return `<figure class="score-figure paired-score-figure">
    <div class="score-scroll" tabindex="0" aria-label="Scrollable paired-staff music notation"><svg class="music-score paired-music-score" viewBox="0 0 ${width} ${height}" role="img" aria-label="${example.title}. ${notationText(example)}" style="--score-width:${width}px">
      <g class="staff-lines treble-staff">${staffLines(width, trebleTop)}</g><g class="staff-lines bass-staff">${staffLines(width, bassTop)}</g>
      ${clefMarkup('treble', 0)}${clefMarkup('bass', bassTop - STAFF_TOP)}${measures}
    </svg></div>
    <figcaption>${example.title}. ${options.caption ?? notationText(example)}</figcaption>${dynamicKey}
  </figure>`;
}
