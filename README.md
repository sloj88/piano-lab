# Piano Lab

Piano Lab is a free, open-source learning companion for absolute beginners practicing on a real piano or keyboard. Every exercise is played on the learner's physical instrument—the application guides learning rather than replacing the piano. It is intentionally small: plain HTML, CSS, and JavaScript, with no framework, account, backend, or virtual instrument.

Version 0.1 contains one complete lesson, **Your First Five Notes**. It teaches keyboard landmarks, middle C, C–D–E–F–G, right-hand finger numbers, and an original seven-note melody.

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
```

Tests cover piano-key mapping, the two/three black-key pattern, the C landmark, and local progress persistence.

## Project structure

```text
index.html          Page shell and lesson navigation
css/styles.css      Responsive, accessible visual design
js/app.js           Rendering and lesson interactions
js/lessons.js       Lesson content and keyboard note model
js/progress.js      localStorage-backed progress behavior
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

The two self-assessment checks in each step are saved in the browser's `localStorage`. Progress stays on that browser and device; clearing site data or using another device starts a fresh lesson. There is no cloud sync, microphone listening, MIDI, automated scoring, or performance verification.

## Accessibility

Piano Lab uses semantic landmarks, keyboard-operable controls, visible focus styles, large touch targets, reduced-motion support, and text labels alongside color. Keyboard diagrams are explanatory references; every playing task is performed on a physical instrument.

## License

[MIT](LICENSE)
