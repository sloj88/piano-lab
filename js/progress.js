export const PROGRESS_KEY = 'piano-lab.progress.v1';

function emptyProgress() { return { currentStep: 0, steps: {} }; }

function normalize(value, stepCount) {
  const safe = value && typeof value === 'object' ? value : emptyProgress();
  const currentStep = Number.isInteger(safe.currentStep) ? Math.max(0, Math.min(safe.currentStep, stepCount - 1)) : 0;
  const steps = {};
  for (let index = 0; index < stepCount; index += 1) {
    const stored = safe.steps?.[index] ?? {};
    steps[index] = { understands: stored.understands === true, canPlay: stored.canPlay === true };
  }
  return { currentStep, steps };
}

export function createProgressStore(storage, stepCount) {
  let memory = normalize(null, stepCount);
  let storageAvailable = Boolean(storage);

  const read = () => {
    if (!storageAvailable) return memory;
    try {
      const raw = storage?.getItem(PROGRESS_KEY);
      if (raw) memory = normalize(JSON.parse(raw), stepCount);
    } catch {
      storageAvailable = false;
    }
    return memory;
  };
  const write = (progress) => {
    memory = normalize(progress, stepCount);
    if (storageAvailable) {
      try { storage.setItem(PROGRESS_KEY, JSON.stringify(memory)); } catch { storageAvailable = false; }
    }
    return memory;
  };
  return {
    load: read,
    setCurrentStep(index) { const progress = read(); progress.currentStep = index; return write(progress); },
    setAssessment(index, field, checked) {
      const progress = read();
      if (progress.steps[index] && ['understands', 'canPlay'].includes(field)) progress.steps[index][field] = Boolean(checked);
      return write(progress);
    },
    reset() {
      memory = normalize(null, stepCount);
      if (storageAvailable) {
        try { storage.removeItem(PROGRESS_KEY); } catch { storageAvailable = false; }
      }
      return memory;
    }
  };
}

export function calculateProgress(progress, stepCount) {
  if (!stepCount) return 0;
  const checked = Object.values(progress.steps ?? {}).reduce((total, step) => total + Number(step.understands) + Number(step.canPlay), 0);
  return Math.round((checked / (stepCount * 2)) * 100);
}
