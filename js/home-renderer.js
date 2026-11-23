export function homeSessionState(session, index, sessions, progress) {
  const currentIndex = sessions.findIndex(({ id }) => id === progress.currentSessionId);
  const state = progress.sessions[session.id];
  const available = index <= currentIndex;
  const current = index === currentIndex;
  const completed = state?.completed === true;
  const labels = [];
  if (current) labels.push('Current');
  if (completed) labels.push('Completed');
  if (!current && available && !completed) labels.push('Available');
  if (!available) labels.push(index === currentIndex + 1 ? 'Up next' : 'Later');
  return { available, current, completed, label: labels.join(' · ') };
}

export function groupSessionsByChapter(sessions) {
  const groups = new Map();
  sessions.forEach((session, index) => {
    if (!groups.has(session.chapter)) groups.set(session.chapter, []);
    groups.get(session.chapter).push({ session, index });
  });
  return [...groups].map(([chapter, entries]) => ({ chapter, entries }));
}

function sessionCard(session, index, sessions, progress) {
  const state = homeSessionState(session, index, sessions, progress);
  const action = state.available
    ? `<button class="button ${state.current ? 'button-primary' : 'button-secondary'}" type="button" data-home-session="${session.id}">${state.current ? 'Open current session' : state.completed ? 'Revisit session' : 'Open session'}</button>`
    : '<p class="home-session-note">Continue in order to make this session available.</p>';
  return `<li class="home-session-card${state.current ? ' is-current' : ''}${state.completed ? ' is-completed' : ''}">
    <div><p class="home-session-number">Session ${session.id} · ${session.type}</p><h3>${session.title}</h3><p>${session.objective}</p></div>
    <div class="home-session-footer"><span class="session-status">${state.label}</span>${action}</div>
  </li>`;
}

export function renderHome(sessions, progress) {
  const current = sessions.find(({ id }) => id === progress.currentSessionId) ?? sessions[0];
  const chapters = groupSessionsByChapter(sessions).map(({ chapter, entries }) => {
    const expanded = entries.some(({ session }) => session.id === current.id);
    const chapterLabel = String(chapter).padStart(2, '0');
    const toggleId = `chapter-${chapter}-toggle`;
    const panelId = `chapter-${chapter}-sessions`;
    const cards = entries.map(({ session, index }) => sessionCard(session, index, sessions, progress)).join('');
    return `<section class="home-chapter">
      <h2><button class="chapter-toggle" id="${toggleId}" type="button" data-chapter-toggle aria-expanded="${expanded}" aria-controls="${panelId}"><span><small>Chapter ${chapterLabel}</small>${entries.length} implemented session${entries.length === 1 ? '' : 's'}</span><i aria-hidden="true"></i></button></h2>
      <div class="chapter-panel" id="${panelId}" role="region" aria-labelledby="${toggleId}" ${expanded ? '' : 'hidden'}><ol class="home-session-grid">${cards}</ol></div>
    </section>`;
  }).join('');
  return `<section class="home-welcome" aria-labelledby="home-title">
    <p class="eyebrow">Learn on your real instrument</p>
    <h1 id="home-title">Welcome to<br><em>Piano Lab</em></h1>
    <p>Take a calm 10–15 minutes beside your piano or keyboard. Pick up where you left off, repeat what helps, and move forward at your own pace.</p>
    <button class="button button-primary home-continue" type="button" data-continue-learning="${current.id}">Continue Learning · Session ${current.id}</button>
  </section>
  <div class="home-chapters" aria-label="Learning chapters">${chapters}</div>`;
}
