# Shared Learning Engine

Status: v0.2 foundation for Slice A
Implemented learner catalog: Session 001 only

## Purpose

Piano Lab renders numbered learning sessions from structured JavaScript data. A future session should be added to the catalog, not built as a separate HTML page or a custom application branch. The first engine release intentionally implements only the block types needed to preserve published Session 001; listening audio, pulse animation, and score rendering will be added when Sessions 002–004 require them.

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

Future blocks should be added only with real session content, a renderer, accessibility behavior, and validator tests. Planned needs include an audio-demonstration block for Session 002 and a pulse visualization for Session 003. A general score block should wait for the notation work in Slice B.

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

Only implemented sessions at or before `currentSessionId` are available. No placeholder Session 002–004 entries are exposed. An earlier session can be revisited, repeated, and left without changing the main position.

Practicing shows one short repeat. Stuck shows one simpler prerequisite and may link to an earlier implemented session. Recording a reinforcement attempt only increments supportive history; it cannot complete, lock, reset, or advance a numbered session.

## Automated validation boundaries

`validateCurriculum` returns schema errors and pedagogical warnings separately.

**Schema/content failures** include missing fields, duplicate or non-sequential IDs, invalid types, forward/missing prerequisites, unknown blocks or references, malformed pitch/rhythm values, and incorrect meter totals. `assertValidCurriculum` throws `ContentValidationError` with category `schema` before browser rendering begins.

**Runtime/application failures** include an unsupported block reaching the renderer or a browser integration defect. These are code failures and are tested separately from content validation.

**Pedagogical questions** include whether wording, fingering, pacing, demonstrations, and exercises work for real beginners. They remain warning records and require beginner observation and qualified teacher review. Passing validation does not establish educational correctness.

The validator checks the actual populated catalog beginning at 001 and requires it to remain sequential. It does not require all 365 sessions to exist.

### Music-event boundary and future polyphony

The implemented music schema is deliberately monophonic. Every event declares `kind: "note"` or `kind: "rest"` plus a recognized rhythm. Notes require one valid scientific pitch and may carry a fingering; rests forbid pitch and fingering and require a rest rhythm. Metered events also require an explicit positive beat duration compatible with the rhythm. The unmetered `pulse` rhythm remains valid for Session 001 and does not require a beat duration.

For now a metered measure has one sequential `events` array, so its event durations may safely be summed and compared with the meter. A measure containing `voices` or `staves` fails with `polyphony-unsupported`; the validator intentionally does not flatten or sum it. This prevents two simultaneous four-beat voices from being misreported as an eight-beat measure.

When two-staff or polyphonic music is implemented, its schema and validator should be added together:

1. Represent each staff and independent voice explicitly, with onset and duration inside the measure.
2. Validate the timeline of each voice independently against the meter; never sum durations across simultaneous voices or staves.
3. Represent a chord as one onset/duration containing multiple pitches, not several sequential events.
4. Validate that every voice ends within the measure and that required rests account for gaps.
5. Validate cross-staff alignment by onset positions while keeping notation/engraving concerns separate from duration arithmetic.

That future work requires representative two-staff fixtures and educator-reviewed scores. This PR only establishes the safe rejection boundary; it does not implement a polyphonic playback or notation engine.

## Adding the next session

1. Add only approved, implementation-ready music and reinforcement entries.
2. Append the next sequential session to `sessionCatalog`; never insert a learner-facing placeholder.
3. Reuse existing blocks. Add a new block only when the session genuinely requires it.
4. Add validator and renderer tests for any new data shape.
5. Add progress/navigation coverage if the session introduces a new interaction.
6. Run `npm run validate:content`, `npm test`, JavaScript syntax checks, `git diff --check`, and a desktop/narrow-phone walkthrough beside a physical-instrument layout.
7. Keep pedagogical acceptance separate from implementation correctness.

## Deliberate limitations

- Only Session 001 is learner-facing in this foundation PR.
- Audio playback, same/different answers, pulse animation, and full score notation are deferred to the sessions that need them.
- The v2 migration supports the existing v1 shape; future schema versions need explicit migration functions rather than silent coercion.
- localStorage remains browser/device-local with no account or cloud synchronization.
- The engine records self-report and completion; it does not verify playing.
