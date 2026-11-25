# Shared Learning Engine

Status: v0.2 Slice A reference implementation
Implemented learner catalog: Sessions 001–024

## Purpose

Piano Lab renders numbered learning sessions from structured JavaScript data. A future session should be added to the catalog, not built as a separate HTML page or a custom application branch. Slice A preserves published Session 001 and adds the listening and pulse blocks required by Sessions 002–004. Slice B adds the small monophonic notation and rhythm-audio presentations required by Sessions 005–010. Sessions 011–016 extend that same engine with left-hand listening, bass notation, explicit hand lanes, and one tightly bounded paired-staff score. Sessions 017–024 add quarter rests, mixed rhythm, dynamics, phrase shaping, retrieval, the integrated milestone, and the eight-measure final piece.

The physical piano remains the instrument. Renderer blocks explain, demonstrate, and organize practice; they never create a playable on-screen piano, listen through a microphone, connect to MIDI, or score a performance.

## File responsibilities

| File | Responsibility |
|---|---|
| `js/session-catalog.js` | Ordered learner-facing sessions, supported types/blocks, and generated-asset registry |
| `js/music-library.js` | Structured pitch, fingering, rhythm, meter, and measure data referenced by sessions |
| `js/reinforcements.js` | Optional repeat and simpler-prerequisite cards; these are not numbered sessions |
| `js/content-validator.js` | Catalog, reference, pitch, rhythm, duration, and measure validation |
| `js/session-renderer.js` | Pure HTML rendering for session metadata, blocks, navigation, endings, and reinforcement |
| `js/session-progress.js` | Versioned session progress, v0.1 migration, localStorage persistence, and memory fallback |
| `js/session-navigation.js` | Availability, revisit, and next-session calculations without progress mutation |
| `js/app.js` | Browser event wiring and coordination of the modules above |
| `js/lessons.js` | Keyboard geometry plus a compatibility view of the original v0.1 lesson export |

## Session content model

Each session declares:

- a three-digit sequential `id`, title, type, chapter, objective, prerequisites, and core duration range;
- ordered instructional `steps`, each containing reusable blocks;
- music and generated/external asset references;
- an observable outcome and separate understanding/playing prompts;
- optional Keep Playing activities;
- Ready, Practicing, and Stuck guidance;
- reinforcement references; and
- explicit educator-review flags that remain warnings, not automated failures.

The current renderer supports these minimal block types:

| Block | Current use |
|---|---|
| `text` | Explain or Demonstrate paragraphs |
| `keyboard` | Accurate non-playable keyboard diagram |
| `finger-position` | Right-hand finger-number reference |
| `musical-pattern` | Pitch/finger sequence such as M001 |
| `practice` | Physical-instrument instruction with optional hint |
| `reflection` | Reflect prompt and the published per-step self-check |
| `audio-listening` | User-initiated local audio, Same/Different choice, replay, and answer reveal |
| `pulse-guide` | Even visual beats for tapping or a note/finger sequence |
| `notation` | Responsive five-line neutral or treble notation for the approved monophonic examples |
| `rhythm-echo` | User-started local pattern/count recordings with a score revealed after the attempt |
| `audio-reference` | Optional local reference recordings, including the post-attempt piece models |
| `pitch-echo` | User-started three-note listening examples with contour and names revealed afterward |
| `hand-lanes` | Aligned RH/LH beat columns for alternating-hand preparation and full-measure waits |
| `dynamic-demo` | Local p/f audio plus a lightweight, reduced-motion-safe movement schematic |

Future blocks should be added only with real session content, a renderer, accessibility behavior, and validator tests. The notation renderer intentionally supports only the Chapter 01 monophonic quarter/half-note requirements; it is not a general engraving engine.

## Progress model

The engine stores v2 state under `piano-lab.progress.v2`. It keeps these concepts independent:

1. `currentSessionId`: furthest/current position in the main sequence;
2. per-session `completed` history;
3. session-level `understanding`;
4. session-level `playing`;
5. Ready, Practicing, or Stuck `readiness`;
6. optional `reinforcementHistory`;
7. the current step and published per-step self-checks within each session.

The session being viewed is runtime navigation state, not the current curriculum position. Opening an earlier available session therefore cannot move `currentSessionId` backward. Repeating sets that session's step to the beginning but preserves completion, reflections, readiness, later progress, and reinforcement history. Continue is the only normal UI action that advances the current position, and it is never gated by self-assessment or readiness.

The sidebar labels three different signals rather than compressing them into one score:

- **Self-assessment percentage** counts the published per-step understanding/playing checks, matching the v0.1 meaning. Repeating or revisiting changes no checked evidence unless the learner changes a check.
- **Position** reports the currently viewed step, such as “Step 2 of 5.” Repeating may intentionally return this to Step 1 without implying lost learning.
- **Core status** reports whether the session has ever been explicitly completed. It remains completed through repeats and revisits, even if self-assessments are still developing.

### v0.1 preservation

The original key remains `piano-lab.progress.v1`. When no v2 record exists, the engine reads v1 once and maps:

- `currentStep` to Session 001's current step;
- every indexed understanding/playing check to the corresponding published step;
- all-understanding and all-playing to the initial session-level reflections; and
- fully checked legacy progress to completed/Ready.

The migration never writes, changes, or removes the v1 key. The first subsequent change writes v2. Reset writes a fresh v2 record, preventing the preserved legacy record from being imported again on reload. If localStorage cannot be read or written, the same normalized state remains available in memory for the page session. If an older application encounters an unknown future schema version, it uses memory for that page session and leaves the newer stored record untouched.

## Navigation and reinforcement

Only implemented sessions at or before `currentSessionId` are available. Sessions 001–024 complete Chapter 01; no Chapter 02 placeholder is exposed. An earlier session can be revisited, repeated, and left without changing the main position.

Practicing shows one short repeat. Stuck shows one simpler prerequisite and may link to an earlier implemented session. Recording a reinforcement attempt only increments supportive history; it cannot complete, lock, reset, or advance a numbered session.

## Automated validation boundaries

`validateCurriculum` returns schema errors and pedagogical warnings separately.

**Schema/content failures** include missing fields, duplicate or non-sequential IDs, invalid types, forward/missing prerequisites, unknown blocks or references, malformed pitch/rhythm values, and incorrect meter totals. `assertValidCurriculum` throws `ContentValidationError` with category `schema` before browser rendering begins.

**Runtime/application failures** include an unsupported block reaching the renderer or a browser integration defect. These are code failures and are tested separately from content validation.

**Pedagogical questions** include whether wording, fingering, pacing, demonstrations, and exercises work for real beginners. They remain warning records and require beginner observation and qualified teacher review. Passing validation does not establish educational correctness.

The validator checks the actual populated catalog beginning at 001 and requires it to remain sequential. It does not require all 365 sessions to exist.

### Music-event boundary and bounded paired staffs

Most implemented music remains deliberately monophonic. Every event declares `kind: "note"` or `kind: "rest"` plus a recognized rhythm. Notes require one valid scientific pitch and may carry a fingering; rests forbid pitch and fingering and require a rest rhythm. Metered events also require an explicit positive beat duration compatible with the rhythm. The unmetered `pulse` rhythm remains valid for keyboard patterns and does not require a beat duration. Separate validated shapes hold listening sets, pulse guides, and alternating-hand lanes.

Ordinary metered examples have one sequential `events` array, so their event durations may safely be summed and compared with the meter. P02 adds one narrowly defined `paired-score`: exactly one treble staff and one bass staff, each with one sequential event list. Every staff totals four beats independently. A fully inactive staff contains one four-beat whole-measure rest. P03 adds one explicitly flagged alternating measure: both staff timelines contain quarter-note events/rests, both entrances are declared, and sounding intervals are checked for overlap. The validator never adds the two staff totals together.

Future simultaneous or multi-voice music still requires a separate schema and validator extension:

1. Represent each staff and independent voice explicitly, with onset and duration inside the measure.
2. Validate the timeline of each voice independently against the meter; never sum durations across simultaneous voices or staves.
3. Represent a chord as one onset/duration containing multiple pitches, not several sequential events.
4. Validate that every voice ends within the measure and that required rests account for gaps.
5. Validate cross-staff alignment by onset positions while keeping notation/engraving concerns separate from duration arithmetic.

Arbitrary `voices` or unrecognized `staves` still fail with `polyphony-unsupported`. P02/P03 do not create a general polyphonic playback or notation engine; the bounded schema permits only one sounding hand at a time and rejects overlapping note intervals.

## Adding the next session

1. Add only approved, implementation-ready music and reinforcement entries.
2. Append the next sequential session to `sessionCatalog`; never insert a learner-facing placeholder.
3. Reuse existing blocks. Add a new block only when the session genuinely requires it.
4. Add validator and renderer tests for any new data shape.
5. Add progress/navigation coverage if the session introduces a new interaction.
6. Run `npm run validate:content`, `npm test`, JavaScript syntax checks, `git diff --check`, and a desktop/narrow-phone walkthrough beside a physical-instrument layout.
7. Keep pedagogical acceptance separate from implementation correctness.

## Deliberate limitations

- Sessions 001–024 are learner-facing; Chapter 02 remains absent until implemented.
- Listening and reference demonstrations use locally bundled spoken counts and compact synthesized tones, not teacher-performed piano recordings. Their pitch, timing, file format, and references are tested, but timbre, balance, and learning effectiveness still require human and teacher review.
- The current score renderer covers neutral, treble, and bass staffs; quarter and half notes; quarter and whole-measure rests; 4/4; dynamics; labels; finger cues; and aligned paired staffs. Beaming, accidentals, chords, and simultaneous voices remain outside this implementation.
- The v2 migration supports the existing v1 shape; future schema versions need explicit migration functions rather than silent coercion.
- localStorage remains browser/device-local with no account or cloud synchronization.
- The engine records self-report and completion; it does not verify playing.
