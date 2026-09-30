import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

test('Authentication API Suite', async (t) => {
  await t.test('POST /api/auth/login with valid credentials succeeds', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@apex.io',
        password: 'Password123!'
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    assert.equal(res.body.user.role, 'admin');
  });

  await t.test('POST /api/auth/login with invalid password fails', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@apex.io',
        password: 'WrongPassword!'
      });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  await t.test('GET /api/auth/me without token returns 401', async () => {
    const res = await request(app).get('/api/auth/me');
    assert.equal(res.status, 401);
  });
});
