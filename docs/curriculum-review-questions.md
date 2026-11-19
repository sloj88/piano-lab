# Curriculum Architecture v0.1 — Review Questions and Decision Log

Status: open questions for human review
Related documents: [Curriculum architecture](curriculum-architecture.md) · [Chapter 01 outline](chapter-01-outline.md)

## How to use this document

The architecture is a proposal, not a settled syllabus. Reviewers should challenge the learning sequence, expected outcomes, session load, cultural assumptions, and product constraints. For every decision below, record:

- **Accept**, **revise**, or **test first**;
- the reason and evidence;
- the person responsible for resolution;
- the affected chapters or sessions.

## Foundational assumptions to validate

1. The primary learner is an adult complete beginner working mostly without a live teacher.
2. The learner has regular access to a functioning physical piano or touch-sensitive keyboard, ideally with at least 61 keys and a music rest.
3. “365 sessions” is meaningful enough to motivate, even though learners may take more or less than a calendar year.
4. Most core sessions can produce useful progress in 10–15 minutes if they have one main objective.
5. Optional extensions and voluntary repetition can supply additional playing time without making the next session inaccessible.
6. Written English, diagrams, and optional audio can provide adequate initial guidance for the target audience.
7. Browser-local self-assessment is sufficient for progress tracking; the product will not verify acoustic performance.
8. The intended endpoint is capable beginner musicianship, not a guaranteed grade, credential, or fixed repertoire list.

If any assumption is false, the architecture may need more than a wording change.

## Decisions requiring approval

| Decision | v0.1 proposal | Credible alternative | What could change the decision? |
|---|---|---|---|
| First notation | Staff contour in Session 007; named treble landmarks in 008 | Show a staff and middle C in Session 001–002 | Beginner observation: does delaying notation build confidence or create a “pre-reading” detour? |
| First rhythm | Pulse in Session 003; durations in 005 | Introduce pulse inside Session 001 | Whether current Lesson 01 performance becomes rhythmically unstable without an explicit beat |
| Reading method | Landmark-plus-interval reading, supported by limited note naming | Multi-key/intervallic method, middle-C position method, or stronger note-name drill | Comparative teacher review and learner transfer to unfamiliar music |
| Left-hand entry | Separate LH begins Session 011; alternating hands in 015 | Begin RH/LH symmetrically in first five sessions, or delay LH until reading is stronger | Cognitive load, learner expectations, and early hand-balance observations |
| Hands together | Alternation in Chapter 01; sustained simple coordination in Chapter 03 | Start simultaneous playing earlier, or postpone until Chapter 03 | Tension, pulse loss, and dropout patterns in prototypes |
| Finger numbers | Use as movement aids but progressively remove from notation | Retain frequent finger numbers longer | Whether learners substitute finger-number decoding for pitch/interval reading |
| Fixed positions | Five-finger positions first, movement beyond them in Chapter 07 | Introduce position shifts and free keyboard exploration earlier | Evidence of position-locking or fear of moving the hands |
| Pedal | Optional introduction in Chapter 06, functional use in Chapter 09 | Delay until after the 365 sessions, or introduce resonance exploration early | Instrument availability, coordination load, repertoire needs, and expert technique review |
| Scales | Five-finger patterns first; one-octave scales in Chapter 07 | Begin full scales in Chapters 04–05 | Whether technique benefit outweighs fingering/crossing load for independent beginners |
| Chord symbols | Functional use in Chapter 09 | Introduce lead-sheet symbols alongside first triads in Chapter 04 | Learner goals and balance between reading traditions |
| Repertoire choice | Reviewed pool with occasional equivalent choices | Fully fixed sequence or broad learner-selected repertoire | Copyright resources, instructional consistency, autonomy, and support burden |
| End benchmark | Broad late-preparatory/early-graded competence | Explicit RCM/ABRSM equivalence, or a product-specific competency framework only | Formal external mapping by qualified teachers; avoid unsupported grade claims |
| Review cadence | Approximate 2–4, 7–12, and 20–35-session returns | Adaptive-only review or a fixed spiral | Retention data from Piano Lab users; motor versus declarative skill differences |
| Advancement | Sequential path plus targeted reinforcement recommendation | Hard mastery gates or unrestricted skipping | User frustration, false confidence, and technical feasibility without scoring |

## Required challenge: is note reading early enough?

### Concern

The learner spends Sessions 001–006 on keyboard geography, pulse, and sound duration before the staff becomes the main representation. This could unintentionally teach that “real playing” happens from letter patterns and that notation is a later add-on.

### Why the proposal may still work

- The delay is six short sessions, not a long rote phase.
- Directional reading begins in Session 007 and both clefs appear within Chapter 01.
- The learner first gains a physical and aural reference for the symbols.

### Alternative to test

Show a tiny staff preview in Session 002 or 003: middle C, left-to-right time, and rising/falling contour, without adding a note-identification task. Compare later transfer and perceived difficulty.

### Review question

Would an experienced adult-beginner teacher introduce staff contour sooner, and if so, what existing objective should be reduced rather than stacked on top?

## Required challenge: is rhythm introduced early enough?

### Concern

The current Lesson 01 melody has an order of pitches but no explicit pulse or duration pattern. A learner may encode it as a chain of buttons rather than music in time.

### v0.1 response

Pulse becomes the sole objective in Session 003 and is applied to the five-note pattern in 004. Duration and echo work follow in 005–006. Rhythm precedes formal pitch reading.

### Stronger alternative

Revise the future curriculum representation of Session 001 so its melody has a simple count or clearly states that free rhythm is intentional. This would affect the existing lesson and is outside the current documentation-only assignment.

### Review question

Should pulse be added to the published Session 001 before the curriculum launches, or does that make the first encounter too dense?

## Required challenge: are left hand and coordination paced appropriately?

### Concern

Waiting until Session 011 may imply that piano is initially a right-hand activity. Conversely, simultaneous hands too early can produce tension, gaze switching, and pulse collapse.

### v0.1 response

The LH gets its own physical and reading sequence in Sessions 011–014. Hands alternate in 015–016. Sustained hands-together work is delayed until Chapter 03, with the easier hand often holding or repeating.

### Alternatives

- Introduce one-note LH echoes in Session 004 without formal LH position.
- Teach mirrored RH and LH five-finger patterns in parallel from Session 002.
- Delay all combined playing until both clefs are more secure.

### Review question

Which route best supports adult beginners learning without real-time correction, and what signs of tension or overload should trigger a simpler version?

## Required challenge: are 10–15-minute sessions sufficient?

### Concern

The required core totals only about 61–91 hours across 365 sessions. That can establish meaningful beginner skills, but motor fluency and repertoire polish vary widely and usually require repetitions beyond first exposure. “One session completed” must not be interpreted as “skill mastered.”

### v0.1 response

- Core sessions teach a bounded objective and include physical playing.
- Keep Playing, repertoire work, and voluntary repeats add time without creating streak pressure.
- Milestones are demonstrations; targeted reinforcement may be inserted before progression.
- The endpoint is deliberately modest.

### Risk

If most learners do only ten minutes once per session and never repeat or extend, the proposed final repertoire and coordination may be too ambitious.

### Alternatives

- Define certain Play/Practice sessions as 15–20 minutes while preserving a 10-minute minimum path.
- Recommend, but never require, two short sittings between selected sessions.
- Reduce the final technique/repertoire target rather than quietly increasing expected time.

### Review questions

What completion rate and playing quality are realistic after 60, 90, and 120 hours? Should the product state an optional weekly time range even though it avoids calendars?

## Required challenge: is there enough reinforcement?

### Concern

A 365-item sequence can become a conveyor belt of novelty. Checkboxes can reward exposure while weak skills accumulate. Review intervals based on session number may correspond to one day or several weeks of real time.

### v0.1 response

Every chapter includes Practice, Play, and Review sessions; new skills receive near, mixed, and later retrieval; milestone gaps generate targeted reinforcement. Exact repetition gives way to varied context after initial stability.

### Weakness

The architecture allocates totals by chapter, not a fixed count of each session type, and no adaptive review algorithm has been tested. Self-report may be optimistic.

### Alternatives

- Reserve a minimum percentage, such as 35–45%, for Practice/Review sessions.
- Add a lightweight “show me first” retrieval task at the start of every session.
- Ask learners to choose among “secure / uncertain / not yet” and branch to a short repair path.

### Review questions

What minimum ratio of new to reinforcing sessions should each chapter enforce? How should elapsed calendar time influence review without creating deadlines?

## Required challenge: is the end-of-journey outcome realistic?

### Concern

Adult beginners differ in instrument quality, coordination, prior listening, reading fluency, disability, practice frequency, and access to feedback. Independent learning can allow inefficient movement or misunderstood rhythm to persist.

### v0.1 target

The learner performs three short contrasting beginner pieces, reads substantially easier material, plays selected basic scales/chords, reproduces a short heard pattern, and plans practice for a new suitable piece. The architecture avoids promising intermediate or professional skill.

### Benchmark caution

RCM Preparatory and graded syllabuses are useful completeness references, not evidence that a learner will pass an exam after this course. Any public grade-equivalence claim requires formal mapping and teacher evaluation.

### Alternatives

- Define multiple exit profiles: reader, chord player, and balanced pathway.
- Narrow the core outcome and place some harmony, pedal, or polyphony in optional branches.
- Add recommended teacher check-ins at three milestones while preserving free self-study.

### Review question

Can a representative adult beginner demonstrate the complete final milestone after the proposed hours without live correction? Pilot evidence must answer this before marketing does.

## Required challenge: will the journey remain motivating and enjoyable?

### Concern

Technique drills, repeated self-assessment, and 365 sequential numbers may feel bureaucratic. A fixed path can ignore musical taste. “Learn in a year” may create pressure even when the interface rejects streaks.

### v0.1 response

- Music appears in Session 001 and every chapter ends in actual performance.
- Keep Playing is optional and choice-oriented.
- Repertoire pools offer bounded choice.
- No streaks, deadlines, scores, or punitive resets.
- Play sessions separate musical communication from problem repair.

### Alternatives

- Offer genre-equivalent repertoire choices more often.
- Add short improvisation/creation prompts beginning in Chapter 01.
- Hide total-session progress by default and foreground the current musical goal.
- Permit “concert path” and “chord/song path” electives after common foundations.

### Review questions

How much choice can the product support without losing instructional sequencing? Does numbering to 365 motivate or intimidate the target learner? Are original miniatures musically satisfying enough for an adult?

## Additional educational risks

### Technique without a teacher

Text and diagrams cannot see bench height, locked joints, excessive force, or pain. Repeated neutral-posture reminders help but do not replace observation.

**Mitigation:** conservative tasks, frequent comfort checks, no speed-first goals, clear stop-for-pain guidance, optional video angles, and expert-reviewed technique language. Consider recommending a teacher/qualified clinician when discomfort persists.

### Self-assessment validity

“I understand it” and “I can play it” are useful reflections but not objective evidence. Familiar prompts can create an illusion of competence.

**Mitigation:** observable outcomes, occasional no-hint retrieval, mixed contexts, delayed review, and language that normalizes “not yet.”

### Reading dependency on position or finger numbers

Fixed five-finger positions can cause learners to map notation to fingers rather than pitch relationships.

**Mitigation:** multiple starting notes, minimal printed fingering, early landmark/interval questions, transposition, and wider-range movement by Chapter 07. Expert reviewers may recommend moving shifts earlier.

### Rhythm taught as arithmetic only

Counting can become correct language without embodied pulse.

**Mitigation:** move/tap/speak before play, count-ins, continued pulse through rests, echo work, and complete music. Audio examples must not become passive imitation.

### Repertoire bias and copyright

An easy-to-license canon may overrepresent a narrow tradition, while familiar commercial music may be unavailable.

**Mitigation:** commission original work, review public-domain selections critically, license living composers, provide context, and include multiple traditions without treating style as decoration.

### Accessibility exclusions

Standard notation, color highlights, audio, small screens, and assumed hand shapes may exclude learners.

**Mitigation:** semantic/zoomable scores, non-color labels, transcripts and visual rhythm alternatives, configurable pace, adaptable fingerings where musically safe, and accessibility review with affected users.

### Instrument variability

Learners may have 49-, 61-, 76-, or 88-key instruments, unweighted keys, no pedal, or poor tuning.

**Mitigation:** state range/pedal needs per session, keep core early repertoire within common ranges, make pedal tasks optional until alternatives exist, and explain relative middle-C placement accurately.

## Content and repertoire questions

1. Which counting language will be used for quarter/eighth/dotted/compound rhythms, and will alternatives be acknowledged?
2. What is the smallest notation size that remains readable on an iPhone beside the instrument?
3. Will audio demonstrations include count-ins, practice tempo, and performance tempo?
4. How will demonstrations avoid encouraging pure imitation instead of reading?
5. Which pieces will serve each chapter milestone, and are equivalent choices genuinely equivalent in reading, coordination, and expression?
6. How many pieces should be memorized, and how will memory remain optional rather than a quality hierarchy?
7. When should learners record themselves, given privacy and the no-backend principle?
8. Is 6/8 in Chapter 08 too late for musical variety?
9. Are primary chords in Chapter 09 too late for learners motivated by songs and lead sheets?
10. Should improvisation and composition have explicit session allocations rather than appearing mainly as extensions?

## Product questions

1. Does “Lesson 01” become “Session 001,” or does a lesson contain several sessions? The information model must use one term consistently.
2. Can learners repeat a session without changing its completion state?
3. How are targeted reinforcement sessions represented without breaking the promise of exactly 365 numbered core sessions?
4. Should separate understanding/playing indicators appear on all session types, or only when both constructs are meaningful?
5. How will the application communicate “ready to continue” without automated scoring or false certification?
6. Can the local progress format evolve to record milestone evidence and learner notes without losing existing v0.1 data?
7. Should elapsed time ever influence suggested review if the product intentionally avoids calendar pressure?
8. What content must work fully offline after first load?

## Expert review panel requested

Before implementation, seek documented feedback from:

- two or more piano pedagogues experienced with adult complete beginners;
- a teacher familiar with at least two different beginner methods, to challenge method bias;
- a performing-arts health professional or appropriately trained reviewer for physical guidance;
- a notation/accessibility specialist and learners with relevant access needs;
- a repertoire/copyright reviewer;
- at least five representative adult beginners in an observed prototype.

No single expert should be treated as proof of universal sequencing.

## Proposed validation sequence

1. **Architecture review:** Experts mark every chapter milestone as too early, appropriate, or too late and identify missing prerequisite chains.
2. **Paper walkthrough:** Review all 24 Chapter 01 sessions for cognitive load, physical safety, notation accuracy, and duplication.
3. **Content prototype:** Build no more than a small representative set only after review authorization; include Learn, Practice, Play, and Review types.
4. **Observed beginner study:** Watch representative adults use the prototype at their own instruments. Record confusion, time-on-core, hint use, tension reports, and delayed recall—not just satisfaction.
5. **Retention check:** Re-test selected rhythm, reading, and motor tasks after intervening sessions.
6. **Revision gate:** Change architecture before scaling content production. Do not use sunk implementation cost as a reason to preserve a weak sequence.

## Approval checklist

- [ ] The 365-session allocation and chapter boundaries are defensible.
- [ ] Chapter 01 begins rhythm, notation, and left-hand work at acceptable points.
- [ ] Every milestone is observable on a real instrument.
- [ ] The final outcome is achievable within the likely range of practice time.
- [ ] Practice/review volume is sufficient and has a testable reinforcement policy.
- [ ] Repertoire strategy is motivating, diverse, legal, and pedagogically leveled.
- [ ] Physical guidance has specialist review and clear safety boundaries.
- [ ] Accessibility assumptions have been reviewed with affected learners.
- [ ] Grade/exam comparisons are removed or formally validated before public claims.
- [ ] The architecture is revised from evidence before lesson implementation begins.
