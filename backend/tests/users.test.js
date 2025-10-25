const request = require('supertest');
const app = require('../src/server');

describe('Users API tests', () => {
  beforeAll(async () => {
    await request(app).post('/dev/seed?users=200&orders=1000&products=50&seed=1');
  });
  test('page beyond range returns empty items', async () => {
    const res = await request(app).get('/api/users?page=999&pageSize=50');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(0);
  });
  test('sort by orderTotal desc order stability', async () => {
    const res = await request(app).get('/api/users?sortBy=orderTotal&sortDir=desc&pageSize=10');
    expect(res.status).toBe(200);
    const items = res.body.items;
    for (let i = 1; i < items.length; i++) {
      expect(items[i-1].orderTotal).toBeGreaterThanOrEqual(items[i].orderTotal);
    }
  });
  test('search filter accuracy', async () => {
    const all = await request(app).get('/api/users?page=1&pageSize=200');
    const u = all.body.items[0];
    const term = u.name.split(' ')[0].slice(0,3);
    const res = await request(app).get(`/api/users?search=${term}&pageSize=200`);
    expect(res.status).toBe(200);
    expect(res.body.items.some(i => i.name === u.name)).toBe(true);
  });
});
