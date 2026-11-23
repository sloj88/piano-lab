const STAFF_TOP = 28;
const STAFF_GAP = 12;
const STAFF_BOTTOM = STAFF_TOP + STAFF_GAP * 4;
const MEASURE_WIDTH = 145;
const TREBLE_LEAD = 88;
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

export function notationText(example) {
  return example.measures.map((measure, index) => `Measure ${index + 1}: ${measure.events.map((event) => `${event.pitch} ${event.rhythm}`).join(', ')}`).join('. ');
}

export function beatGridMarkup(example) {
  return `<div class="beat-grids">${example.measures.map((measure, measureIndex) => {
    const beats = [];
    for (const event of measure.events) {
      beats.push(`<div><strong>${beats.length + 1}</strong><span>${event.pitch.replace(/[0-9]$/, '')} begins</span></div>`);
      for (let held = 1; held < event.beats; held += 1) beats.push(`<div class="is-held"><strong>${beats.length + 1}</strong><span>hold</span></div>`);
    }
    return `<section aria-label="Measure ${measureIndex + 1} beat guide"><p>Measure ${measureIndex + 1}</p><div class="beat-grid">${beats.join('')}</div></section>`;
  }).join('')}</div>`;
}

function staffLines(width) {
  return Array.from({ length: 5 }, (_, index) => `<line x1="0" y1="${STAFF_TOP + index * STAFF_GAP}" x2="${width}" y2="${STAFF_TOP + index * STAFF_GAP}"/>`).join('');
}

function noteMarkup(event, x, y, { label, finger, ledger }) {
  const half = event.rhythm === 'half';
  const ledgerMarkup = ledger ? `<line class="ledger-line" x1="${x - 11}" y1="${y}" x2="${x + 11}" y2="${y}"/>` : '';
  return `${ledgerMarkup}<g class="score-note" data-pitch="${event.pitch}" data-rhythm="${event.rhythm}">
    <ellipse class="notehead${half ? ' is-half' : ''}" cx="${x}" cy="${y}" rx="6.2" ry="4.3" transform="rotate(-16 ${x} ${y})"/>
    <line class="note-stem" x1="${x + 5}" y1="${y - 1}" x2="${x + 5}" y2="${y - 29}"/>
    ${finger ? `<text class="finger-label" x="${x}" y="${y - 34}">${finger}</text>` : ''}
    ${label ? `<text class="pitch-label" x="${x}" y="112">${event.pitch.replace(/[0-9]$/, '')}</text>` : ''}
  </g>`;
}

export function scoreMarkup(example, options = {}) {
  const clef = example.notation?.clef ?? 'treble';
  const lead = clef === 'treble' ? TREBLE_LEAD : NEUTRAL_LEAD;
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
      const y = clef === 'neutral'
        ? STAFF_BOTTOM - (example.notation.staffSteps[flatIndex] * STAFF_GAP / 2)
        : treblePitchY(event.pitch);
      const showFinger = options.showAllFingers || (options.showStartingFinger && flatIndex === 0);
      notes += noteMarkup(event, x, y, { label: options.showLabels, finger: showFinger ? event.finger : null, ledger: clef === 'treble' && event.pitch === 'C4' });
      onset += event.beats;
      flatIndex += 1;
    }
    const measureNumber = options.measureNumbers ? `<text class="measure-number" x="${startX + 5}" y="16">${measureIndex + 1}</text>` : '';
    measures += `${measureNumber}${notes}<line class="barline" x1="${startX + measureWidth}" y1="${STAFF_TOP}" x2="${startX + measureWidth}" y2="${STAFF_BOTTOM}"/>`;
  });
  const clefMarkup = clef === 'treble'
    ? `<text class="treble-clef" x="7" y="78">𝄞</text><g class="time-signature"><text x="62" y="48">4</text><text x="62" y="72">4</text></g>`
    : '';
  const direction = options.showDirections ? `<p class="score-directions">Shape: ${flatEvents.slice(1).map((event, index) => {
    const change = pitchIndex(event.pitch) - pitchIndex(flatEvents[index].pitch);
    return change === 0 ? 'repeat' : change > 0 ? 'up' : 'down';
  }).join(' · ')}</p>` : '';
  return `<figure class="score-figure${clef === 'neutral' ? ' is-neutral' : ''}">
    <div class="score-scroll" tabindex="0" aria-label="Scrollable music notation"><svg class="music-score" viewBox="0 0 ${width} ${height}" role="img" aria-label="${example.title}. ${notationText(example)}" style="--score-width:${width}px"><g class="staff-lines">${staffLines(width)}</g>${clefMarkup}${measures}</svg></div>
    <figcaption>${example.title}. ${options.caption ?? notationText(example)}</figcaption>${direction}
  </figure>`;
}
