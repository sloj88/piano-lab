import test from 'node:test';
import assert from 'node:assert/strict';
import { buildChatGPTPrompt, copyPrompt } from '../js/chatgpt-help.js';
import { sessionCatalog } from '../js/session-catalog.js';

test('contextual prompt contains only public session context and the learner question', () => {
  const session = sessionCatalog[1];
  const prompt = buildChatGPTPrompt(session, session.steps[2], 'How can I hear the changed note?');
  assert.match(prompt, /Session 002: Find and Hear It Again/);
  assert.match(prompt, /Objective: Retrieve Session 001 landmarks/);
  assert.match(prompt, /Current concept: Hear same or different/);
  assert.match(prompt, /My question: How can I hear the changed note\?/);
  assert.doesNotMatch(prompt, /localStorage|assessment|readiness|completed/i);
});

test('prompt preparation has a useful default without inventing private learner data', () => {
  const session = sessionCatalog[2];
  const prompt = buildChatGPTPrompt(session, session.steps[0]);
  assert.match(prompt, /Please explain this concept in simple language/);
  assert.match(prompt, /physical instrument/);
});

test('copy helper reports success and clipboard failures without throwing', async () => {
  let copied = '';
  assert.equal(await copyPrompt('safe prompt', { writeText: async (value) => { copied = value; } }), true);
  assert.equal(copied, 'safe prompt');
  assert.equal(await copyPrompt('safe prompt', { writeText: async () => { throw new Error('denied'); } }), false);
  assert.equal(await copyPrompt('safe prompt', null), false);
});
