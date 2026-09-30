import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

test('Support Tickets API Suite', async (t) => {
  let token;

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'agent@apex.io',
      password: 'Password123!'
    });

  token = loginRes.body.token;

  await t.test('GET /api/tickets returns list of tickets', async () => {
    const res = await request(app)
      .get('/api/tickets')
      .set('Authorization', `Bearer ${token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(Array.isArray(res.body.data), true);
    assert.ok(res.body.data.length >= 1);
  });

  await t.test('POST /api/tickets with auto-suggest priority creates ticket', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        subject: 'Critical Production Outage in US-East',
        description: 'Entire database cluster stopped responding and crashed under load',
        category: 'Infrastructure'
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.priority, 'urgent');
    assert.equal(res.body.data.status, 'open');
  });
});
