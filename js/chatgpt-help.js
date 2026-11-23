export function buildChatGPTPrompt(session, step, question = '') {
  const learnerQuestion = question.trim();
  return [
    'I am an absolute beginner learning on a real physical piano or keyboard.',
    `Piano Lab Session ${session.id}: ${session.title}.`,
    `Objective: ${session.objective}`,
    `Current concept: ${step.title} — ${step.intro}`,
    learnerQuestion ? `My question: ${learnerQuestion}` : 'Please explain this concept in simple language and suggest one short exercise I can try on my physical instrument.',
    'Please do not suggest a virtual piano, microphone, MIDI, or automated scoring.'
  ].join('\n');
}

export async function copyPrompt(text, clipboard) {
  if (!clipboard?.writeText) return false;
  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
