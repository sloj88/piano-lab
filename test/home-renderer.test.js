import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { groupSessionsByChapter, homeSessionState, renderHome } from '../js/home-renderer.js';
import { sessionCatalog } from '../js/session-catalog.js';
import { createEmptySessionProgress } from '../js/session-progress.js';

test('home shows the implemented sessions in both chapters with current and future availability', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  const html = renderHome(sessionCatalog, progress);
  assert.equal((html.match(/class="home-session-card/g) ?? []).length, 32);
  assert.match(html, /Continue Learning · Session 001/);
  assert.match(html, /Current/);
  assert.match(html, /Up next/);
  assert.match(html, /data-chapter-toggle aria-expanded="true"/);
  assert.match(html, /aria-controls="chapter-1-sessions"/);
  assert.match(html, /Session 024/);
  assert.match(html, /Session 032/);
  assert.doesNotMatch(html, /Session 033/);
  assert.deepEqual(homeSessionState(sessionCatalog[1], 1, sessionCatalog, progress), { available: false, current: false, completed: false, label: 'Up next' });
});

test('home offers revisits for completed earlier sessions without moving the current position', () => {
  const progress = createEmptySessionProgress(sessionCatalog);
  progress.currentSessionId = '004';
  progress.sessions['001'].completed = true;
  progress.sessions['002'].completed = true;
  const html = renderHome(sessionCatalog, progress);
  assert.match(html, /Continue Learning · Session 004/);
  assert.equal((html.match(/Revisit session/g) ?? []).length, 2);
  assert.match(html, /Current/);
  assert.equal(progress.currentSessionId, '004');
});

test('the page shell provides persistent home and lesson help actions', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="home-view"/);
  assert.equal((html.match(/data-return-home/g) ?? []).length, 2);
  assert.doesNotMatch(html, /id="ask-chatgpt"/);
  assert.match(html, /Opening ChatGPT does not send this prompt automatically/);
});

test('chapter grouping scales from metadata and expands only the current chapter by default', () => {
  const sessions = sessionCatalog;
  const progress = createEmptySessionProgress(sessions);
  progress.currentSessionId = '025';
  const groups = groupSessionsByChapter(sessions);
  const html = renderHome(sessions, progress);
  assert.deepEqual(groups.map(({ chapter, entries }) => [chapter, entries.length]), [[1, 24], [2, 8]]);
  assert.match(html, /id="chapter-1-toggle"[^>]*aria-expanded="false"/);
  assert.match(html, /id="chapter-2-toggle"[^>]*aria-expanded="true"/);
  assert.match(html, /id="chapter-1-sessions"[^>]*hidden/);
  assert.doesNotMatch(html, /id="chapter-2-sessions"[^>]*hidden/);
});
