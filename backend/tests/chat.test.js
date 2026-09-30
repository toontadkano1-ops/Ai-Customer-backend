import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

test('Chat and AI Grounding Suite', async (t) => {
  let token;

  // Login as customer
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'customer@acme.com',
      password: 'Password123!'
    });

  token = loginRes.body.token;

  await t.test('POST /api/chat/message with grounded SLA question returns grounded response', async () => {
    const res = await request(app)
      .post('/api/chat/message')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'What is the SLA uptime guarantee?'
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.message.content.includes('99.99%'));
    assert.equal(res.body.message.sources.length > 0, true);
    assert.equal(res.body.message.is_uncertain, false);
  });

  await t.test('POST /api/chat/message with unknown question returns graceful uncertainty', async () => {
    const res = await request(app)
      .post('/api/chat/message')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Do you sell organic apples and pineapples in Antarctica?'
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.message.is_uncertain, true);
    assert.ok(res.body.message.suggested_actions.includes('Connect with Human Agent'));
  });

  await t.test('POST /api/ai/sentiment identifies negative sentiment and triggers escalation flag', async () => {
    const res = await request(app)
      .post('/api/ai/sentiment')
      .set('Authorization', `Bearer ${token}`)
      .send({
        text: 'This service is broken, terrible and crashed our production cluster! Unacceptable!'
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.data.sentiment, 'negative');
    assert.equal(res.body.data.escalation_recommended, true);
  });
});
