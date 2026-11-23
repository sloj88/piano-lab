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

export function renderHome(sessions, progress) {
  const current = sessions.find(({ id }) => id === progress.currentSessionId) ?? sessions[0];
  const cards = sessions.map((session, index) => {
    const state = homeSessionState(session, index, sessions, progress);
    const action = state.available
      ? `<button class="button ${state.current ? 'button-primary' : 'button-secondary'}" type="button" data-home-session="${session.id}">${state.current ? 'Open current session' : state.completed ? 'Revisit session' : 'Open session'}</button>`
      : '<p class="home-session-note">Continue in order to make this session available.</p>';
    return `<li class="home-session-card${state.current ? ' is-current' : ''}${state.completed ? ' is-completed' : ''}">
      <div><p class="home-session-number">Session ${session.id} · ${session.type}</p><h3>${session.title}</h3><p>${session.objective}</p></div>
      <div class="home-session-footer"><span class="session-status">${state.label}</span>${action}</div>
    </li>`;
  }).join('');
  return `<section class="home-welcome" aria-labelledby="home-title">
    <p class="eyebrow">Learn on your real instrument</p>
    <h1 id="home-title">Welcome to<br><em>Piano Lab</em></h1>
    <p>Take a calm 10–15 minutes beside your piano or keyboard. Pick up where you left off, repeat what helps, and move forward at your own pace.</p>
    <button class="button button-primary home-continue" type="button" data-continue-learning="${current.id}">Continue Learning · Session ${current.id}</button>
  </section>
  <section class="home-chapter" aria-labelledby="chapter-01-title">
    <div class="home-chapter-heading"><div><p class="eyebrow">Chapter 01</p><h2 id="chapter-01-title">Meet the Piano</h2></div><p>Four short sessions build keyboard landmarks, listening, pulse, and your first steady five-note pattern.</p></div>
    <ol class="home-session-grid">${cards}</ol>
  </section>`;
}
