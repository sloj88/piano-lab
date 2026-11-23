# Piano Lab

Piano Lab is a free, open-source learning companion for absolute beginners practicing on a real piano or keyboard. Every exercise is played on the learner's physical instrument—the application guides learning rather than replacing the piano. It is intentionally small: plain HTML, CSS, and JavaScript, with no framework, account, backend, or virtual instrument.

The learner-facing catalog contains the first four consecutive sessions: keyboard landmarks and C–G, same/different listening, steady pulse, and a right-hand five-note pattern played one note per beat. A reusable session engine provides the foundation for the sequential 365-session curriculum without creating separate pages for each lesson.

## Run locally

No installation or build step is required. Serve the repository root with any static web server:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. A local server is recommended because browsers commonly restrict JavaScript modules on `file://` URLs.

## Tests

Node.js 18 or newer is recommended. The suite uses only Node's built-in test runner:

```sh
npm test
npm run validate:content
```

Tests cover piano-key mapping, structured-content validation, local audio assets, pulse behavior, rendering, navigation/revisit behavior, v0.1 progress migration, independent session state, reinforcement history, and localStorage failure fallback.

## Project structure

```text
index.html          Page shell and session navigation
css/styles.css      Responsive, accessible visual design
js/app.js           Browser coordination and interaction handling
js/session-*.js     Session catalog, rendering, navigation, and v2 progress
js/content-validator.js  Structured curriculum validation
js/music-library.js     Referenced musical examples
assets/audio/           Local listening demonstrations
js/reinforcements.js    Optional targeted support content
js/lessons.js       Keyboard model and v0.1 compatibility export
js/progress.js      Preserved v0.1 progress implementation
docs/learning-engine.md Architecture and future-session guide
test/               Dependency-free Node tests
```

## GitHub Pages

After the feature branch has been reviewed and merged:

1. Open the repository on GitHub and choose **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select the `main` branch and `/ (root)` folder, then choose **Save**.
4. Wait for the Pages workflow to finish. GitHub will show the public URL on that settings page.

Do not select the feature branch for the production Pages source. No Pages-specific build configuration is needed.

## Known limitations and privacy

Session position, completion, separate understanding/playing reflections, readiness, per-step checks, and optional reinforcement history are saved in the browser's `localStorage`. Existing v0.1 progress is migrated without deleting or overwriting its original storage record. Progress stays on that browser and device; clearing site data or using another device starts fresh. There is no cloud sync, microphone listening, MIDI, automated scoring, or performance verification.

## Accessibility

Piano Lab uses semantic landmarks, keyboard-operable controls, visible focus styles, large touch targets, reduced-motion support, and text labels alongside color. Listening audio never autoplays and its answers have text reveals. Keyboard diagrams are explanatory references; every playing task is performed on a physical instrument.

## License

[MIT](LICENSE)
