const request = require('supertest');
const app = require('../src/server');
const prisma = require('../src/prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Transactions API', () => {
  let user;
  let token;

  beforeAll(async () => {
    await prisma.$connect();
    // create user with hashed password
    const email = 'tx-test@example.com';
    await prisma.user.deleteMany({ where: { email } }).catch(() => {});
    const hashed = await bcrypt.hash('Password1!', 10);
    user = await prisma.user.create({ data: { email, name: 'TX User', password: hashed } });
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany({ where: { userId: user.id } }).catch(() => {});
    await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
    await prisma.$disconnect();
  });

  test('create and fetch transactions', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Cookie', `token=${token}`)
      .send({ amount: 12.34, category: 'Food', type: 'EXPENSE', date: new Date().toISOString().split('T')[0], description: 'Lunch' });

    expect(res.status).toBe(201);
    expect(res.body.amount).toBeDefined();

    const list = await request(app).get('/api/transactions').set('Cookie', `token=${token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBeGreaterThanOrEqual(1);
  });
});
