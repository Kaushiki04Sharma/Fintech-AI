const request = require('supertest');
const app = require('../src/server');
const prisma = require('../src/prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('User preferences API', () => {
  let user;
  let token;

  beforeAll(async () => {
    await prisma.$connect();
    const email = 'prefs-test@example.com';
    await prisma.user.deleteMany({ where: { email } }).catch(() => {});
    const hashed = await bcrypt.hash('Password1!', 10);
    user = await prisma.user.create({ data: { email, name: 'Prefs', password: hashed, emailNotifications: true, pushNotifications: true } });
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
    await prisma.$disconnect();
  });

  test('GET /api/user/preferences returns prefs when authenticated', async () => {
    const res = await request(app).get('/api/user/preferences').set('Cookie', `token=${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('emailNotifications');
    expect(res.body).toHaveProperty('pushNotifications');
  });

  test('PUT /api/user/preferences updates preferences', async () => {
    const res = await request(app).put('/api/user/preferences').set('Cookie', `token=${token}`).send({ emailNotifications: false, pushNotifications: false });
    expect(res.status).toBe(200);
    expect(res.body.emailNotifications).toBe(false);
    expect(res.body.pushNotifications).toBe(false);
  });
});
