const request = require('supertest');
const app = require('../src/server');
const prisma = require('../src/prismaClient');
const jwt = require('jsonwebtoken');

describe('Goals API', () => {
  let token;
  let user;

  beforeAll(async () => {
    // Ensure DB connection
    await prisma.$connect();

    // create a test user
    await prisma.goal.deleteMany({}).catch(() => {});
    await prisma.user.deleteMany({ where: { email: 'test-goals@example.com' } }).catch(() => {});
    user = await prisma.user.create({ data: { name: 'Test User', email: 'test-goals@example.com', password: 'test' } });

    // create a goal
    await prisma.goal.create({ data: { userId: user.id, name: 'Test Goal', targetAmount: 100, currentAmount: 10 } });

    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  });

  afterAll(async () => {
    await prisma.goal.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
    await prisma.$disconnect();
  });

  test('GET /api/goals returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/goals');
    expect(res.status).toBe(401);
  });

  test('GET /api/goals returns goals when authenticated', async () => {
    const res = await request(app).get('/api/goals').set('Cookie', `token=${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
});
