const request = require('supertest');
const assert = require('assert');
const app = require('./app');

const API_KEY = process.env.API_KEY || 'your-secure-api-key';

describe('API Security and Functionality', function () {
  this.timeout(10000);

  it('should reject requests without API key', async () => {
    const res = await request(app)
      .post('/api/v1/shorten')
      .send({ url: 'https://example.com' });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.error, 'Unauthorized');
  });

  it('should accept requests with valid API key', async () => {
    const res = await request(app)
      .post('/api/v1/shorten')
      .set('x-api-key', API_KEY)
      .send({ url: 'https://example.com' });
    assert.ok([200, 201].includes(res.status));
    assert.ok(res.body.shortUrl);
  });

  it('should rate limit after exceeding max requests', async () => {
    for (let i = 0; i < 100; i++) {
      await request(app)
        .post('/api/v1/shorten')
        .set('x-api-key', API_KEY)
        .send({ url: 'https://example.com' });
    }
    const res = await request(app)
      .post('/api/v1/shorten')
      .set('x-api-key', API_KEY)
      .send({ url: 'https://example.com' });
    assert.strictEqual(res.status, 429);
    assert.strictEqual(res.body.error, 'Too many requests, please try again later.');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app)
      .get('/api/v1/unknown')
      .set('x-api-key', API_KEY);
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.error, 'Not Found');
  });

  it('should set security headers', async () => {
    const res = await request(app)
      .post('/api/v1/shorten')
      .set('x-api-key', API_KEY)
      .send({ url: 'https://example.com' });
    assert.ok(res.headers['x-dns-prefetch-control']);
    assert.ok(res.headers['x-frame-options']);
    assert.ok(res.headers['strict-transport-security']);
  });

  it('should allow CORS', async () => {
    const res = await request(app)
      .options('/api/v1/shorten')
      .set('Origin', 'http://localhost')
      .set('Access-Control-Request-Method', 'POST');
    assert.ok(res.headers['access-control-allow-origin']);
    assert.strictEqual(res.headers['access-control-allow-origin'], '*');
  });
});
