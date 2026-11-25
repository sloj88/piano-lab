# Chapter 02 Music Specification — Read and Feel the Beat

Status: exact draft examples for review before implementation

## Read the fixtures

- T = treble, right hand. B = bass, left hand. RH stays on C4–G4 (fingers 1–5 respectively). LH stays on C3–G3 (fingers 5–1 respectively). These lookup rules specify the fingering of every note, including repetitions. A tie retains its starting finger. Show a starting finger only in guided previews when needed. Hide pitch names and finger cues on independent cards.
- Pitches use scientific octave numbers. Treble positions from C4 to G4 are ledger line below, space below, bottom line, first space, second line. Bass positions from C3 to G3 are second space, middle line, third space, fourth line, fourth space. The grand-staff orientation activity recovers middle C from Chapter 01 as a keyboard landmark between the two ranges. It uses the familiar treble-ledger C4 and does not require reading C4 in bass.
- A pipe marks a barline. Each bar totals the number of quarter beats shown by its meter. `q` = 1, `h` = 2, `w` = 4, `e` = ½, `rq` = 1 silent beat, `rh` = 2 silent beats. `~` connects the preceding written note to the first note in the next bar. Both segments count in their own bars, with one continuous sound and no second attack. A beamed pair always starts on an integer beat and remains within that beat.
- Tempo is quarter beats per minute. Use one spoken preparatory bar in the current meter: “Ready: 1, 2”, “Ready: 1, 2, 3”, or “Ready: 1, 2, 3, 4”. For paired eighths count “number-and” (e.g. “2-and”), keeping the following numbered beat evenly spaced. Note examples begin on the downbeat unless a rest is written. Rests release the key and use no pedal.
- Every score shows clef, meter, barlines, and the stated note/rest values. Use true staff geometry with scrollable notation at narrow sizes, enlarged reading where needed, and plain-language score descriptions. For independent/retrieval cards, explain clef, meter, beat and staff positions before the attempt. Offer exact pitches/durations after reveal. Audio is off by default. **—** means no audio required, **model** means required local example, **ref** means required local reference after initial score preview or trial as specified. Listening comparisons play before showing the answers.

## Reading and rhythm cards

| Stable ID · first session | Clef · meter · beats per bar | Exact measures | BPM · audio / engraving cue |
|---|---|---|---|
| C02-025 · 025 | paired T/B · 4/4 · 4 per staff | T: C4q D4q E4h; B: whole-measure rest \| T: whole-measure rest; B: C3q D3q E3h | 54–60 · —. Align barlines and label RH at bar 1, LH at bar 2. Same four-beat waiting sign as Chapter 01 |
| C02-026 · 026 | T · 4/4 · 4 | E4q D4q C4h \| C4q D4q E4h | 52–60 · —. Prompt silent preparation before playing |
| C02-027 · 027 | T · 4/4 · 4 | G4q F4q E4h \| E4q F4q F4q G4q | 52–60 · —. From treble G, introduce F as the adjacent space below |
| C02-028 · 028 | B · 4/4 · 4 | F3q G3q F3h \| F3q E3q D3q C3q | 52–60 · —. From bass F, introduce G in the space above |
| C02-029-T · 029 | T · 4/4 · 4 | F4q E4q D4h \| C4q D4q E4h | 52–60 · — |
| C02-029-B · 029 | B · 4/4 · 4 | E3q F3q G3h \| G3q F3q E3h | 52–60 · — |
| C02-030 · 030 | T · 2/4 · 2 | C4q D4q \| E4h \| E4q D4q \| C4h | 52–60 · model at 56. Show two count cells per bar |
| C02-031 · 031 | B · 2/4 · 2 | C3q rq \| D3q E3q \| D3q rq \| C3h | 52–60 · — |
| C02-032 · 032 | T · 3/4 · 3 | C4h D4q \| E4q D4q C4q | 52–60 · model at 56. Show three count cells per bar |
| C02-033 · 033 | B · 4/4 · 4 | C3w \| D3q E3q D3h \| C3w | 52–60 · model at 56. Stemless whole note and four linked count cells |
| C02-034-T2 · 034 | T · 2/4 · 2 | D4q E4q \| D4h | 52–60 · — |
| C02-034-B3 · 034 | B · 3/4 · 3 | D3q E3h \| D3q C3h | 52–60 · — |
| C02-034-T4 · 034 | T · 4/4 · 4 | C4w \| D4h C4h | 52–60 · — |
| C02-035 · 035 | B · 3/4 · 3 | F3q E3h \| D3q C3h \| C3q D3q E3q \| F3h E3q | 52–62 · — |
| C02-036 · 036 | B · 4/4 · 4 | C3q rh D3q \| E3h D3q C3q | 52–60 · model at 56. Seat half-rest rectangle on middle line |
| C02-037-A · 037 | T · 4/4 · 4 | C4q rh C4q | 56 · model A |
| C02-037-B · 037 | T · 4/4 · 4 | C4q C4q rh | 56 · model B. Compare A and B before revealing B as the version with attacks on 1 and 2 |
| C02-038 · 038 | T · 2/4 · 2 | C4e D4e E4q \| D4q C4q | 48–56 · model at 52. Beam C4/D4 on beat 1 |
| C02-039 · 039 | T · 2/4 · 2 | E4q D4e C4e \| D4q E4q \| F4q E4e D4e \| C4h | 48–58 · —. Pairs on beat 2 |
| C02-040 · 040 | B · 2/4 · 2 | C3e D3e E3q \| D3q C3q | 48–56 · model at 52. Pair on beat 1 |
| C02-041-A · 041 | B · 2/4 · 2 | C3q D3q \| E3h | 52 · model A |
| C02-041-B · 041 | B · 2/4 · 2 | C3e C3e D3q \| E3h | 52 · model B. Same pitch and pulse on beat 1, two distinct attacks in B |
| C02-042-A · 042 | T · 2/4 · 2 | D4q C4q~ \| C4q D4q | 52–60 · model at 56. Tie joins the two C4s |
| C02-042-B · 042 | T · 2/4 · 2 | D4q C4q \| C4q D4q | 52–60 · model at 56. Reattack C4 at the beginning of bar 2 |
| C02-043 · 043 | B · 3/4 · 3 | D3h C3q~ \| C3q D3h | 52–60 · model at 56. Tie joins the two C3s |
| C02-044-T · 044 | T · 2/4 · 2 | E4q E4q~ \| E4q rq \| D4e C4e D4q \| C4h | 48–58 · —. Two E4 attacks, then sustain through first beat of bar 2 |
| C02-044-B · 044 | B · 3/4 · 3 | D3q D3q E3q~ \| E3q rh \| D3q C3h | 48–58 · —. Two silent beats starting on bar 2 beat 2 |
| C02-049-T · 049 | T · 3/4 · 3 | G4q F4q E4q \| E4h D4q \| C4q D4q E4q \| D4q C4h | 52–60 · — |
| C02-049-B · 049 | B · 2/4 · 2 | F3q G3q \| F3e E3e D3q \| C3q rq \| C3h | 48–58 · — |
| C02-051-T · 051 | T · 2/4 · 2 | E4q F4q \| G4q F4q \| E4q D4q \| C4h | 52–60 · — |
| C02-051-B · 051 | B · 3/4 · 3 | E3q D3q C3q \| D3h E3q \| F3q E3q D3q \| C3h rq | 52–60 · — |
| C02-052-R · 052 | T · 2/4 · 2 | C4q rq \| C4e C4e C4q \| C4h | 48–56 · model after attempt at 52. All sounding notes are C4 for optional transfer to the keys |
| C02-052-T · 052 | T · 3/4 · 3 | F4q G4q F4q \| E4q D4h \| D4q E4q D4q \| C4h rq | 52–60 · —. Milestone-only |
| C02-052-B · 052 | B · 3/4 · 3 | F3q E3q D3q \| E3q F3h \| E3q D3q C3q \| D3q C3h | 52–60 · —. Milestone-only |

## Original pieces

| Bar | C02-P01 · Window Lights | C02-P02 · Footpath |
|---|---|---|
| 1 | E4q F4q G4q | C3q D3e E3e |
| 2 | F4q E4h | D3q C3q |
| 3 | D4q E4q F4q | C3q rq |
| 4 | E4q D4h | C3h |
| 5 | C4q D4q E4q | F3q E3e D3e |
| 6 | F4q E4h | C3q D3q |
| 7 | D4q E4q D4q | E3q D3q |
| 8 | C4h rq | C3h |

**Window Lights (045–046, 050, 052).** T only, 3/4, three quarter beats in each of eight bars. Prepare at 52–56 and provide a local 60 bpm reference with a three-beat count-in. Begin at finger 3 on E4. Keep a gentle `p` throughout, with a relaxed finish and the full final counted rest. Place `p` at bar 1. At bar 5 allow an optional starting-finger hint (C4/1) only in the section-preparation view.

**Footpath (047–048, 050, 052).** B only, 2/4, two quarter beats in each of eight bars. Prepare at 48–54 and provide a local 56 bpm reference with a two-beat count-in. Begin at finger 5 on C3. Use a full, comfortable `f` with a clear walking pulse. Place `f` at bar 1. Beam beat 2 in bars 1 and 5. At bar 5 allow an optional starting-finger hint (F3/2) only in the section-preparation view.

Both scores group bars 1–4 and 5–8, allow readable horizontal scrolling, retain a steady pulse, and use neither pedal nor added articulation symbols. Session 050 uses these same scores without previews that name notes. Session 052 uses them after the independent-reading attempt.

## Implementation boundaries and acceptance

- Extend metered monophonic layout only for 2/4, 3/4 and 4/4 with quarter-note beats. Derive count cells, bar widths, time signatures and count-in lengths from meter. Keep the existing paired 4/4 format for C02-025. A whole-measure rest remains a separate construct from a note or a two-beat rest.
- Represent timing in integer half-beat units (or equivalent exact half increments). Validate known value/duration pairs, per-bar totals and beat-aligned eighth pairs. Add stemless whole notes, a half-rest glyph, beam geometry for two adjacent eighths, and readable half-beat spacing.
- Support one cross-bar tie between consecutive same-pitch quarters in the same staff/hand, ending on the next downbeat. Reject rests, mismatched pitches/fingers, nonadjacent endpoints and ties to or from unsupported durations. A tie that crosses a score-system break needs a continuation at each edge. Join playback envelopes across the barline and keep a single note onset. The parallel repeated-note fixture requires two onsets.
- Generate local WAV from the exact fixtures, including chosen spoken count-in tempi. Provide play/replay, visible labels and transcripts. For listening comparisons distinguish versions after learner choice. Verify pitches, release/rest timing, count-in lengths, separate repeated attacks, smooth tie sustain and relative level.
- Inspect rendered examples at desktop and 390px, including enlarged scores, rest shapes, readable beam/curve geometry and screen-reader descriptions. A teacher should check the feel of the count-ins, pulse, dynamics and playability. Audio and graphics checks verify implementation properties.
