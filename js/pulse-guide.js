export function pulseIntervalMs(bpm) {
  if (!Number.isFinite(bpm) || bpm <= 0) throw new TypeError('Pulse tempo must be a positive number.');
  return 60000 / bpm;
}

export function nextPulseFrame(current, total) {
  if (!Number.isInteger(total) || total < 1) throw new TypeError('Pulse guide needs at least one beat.');
  const next = current + 1;
  return next >= total
    ? { current: total - 1, complete: true }
    : { current: next, complete: false };
}
