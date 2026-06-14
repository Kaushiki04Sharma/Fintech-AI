const request = require('supertest');
const app = require('../src/server');
const prisma = require('../src/prismaClient');

describe('Auth flows', () => {
  let agent;
  const email = 'auth-test@example.com';
  const name = 'Auth Tester';
  const password = 'Password123!';

  beforeAll(async () => {
    await prisma.$connect();
    // clean up
    await prisma.user.deleteMany({ where: { email } }).catch(() => {});
    agent = request.agent(app);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } }).catch(() => {});
    await prisma.$disconnect();
  });

  test('register -> login -> profile', async () => {
    const reg = await agent.post('/api/auth/register').send({ email, name, password });
    expect(reg.status).toBe(201);
    expect(reg.body.user).toBeTruthy();

    // Logging in again shouldn't fail
    const login = await agent.post('/api/auth/login').send({ email, password });
    expect(login.status).toBe(200);

    // profile should be accessible with cookie
    const profile = await agent.get('/api/user/profile');
    expect(profile.status).toBe(200);
    expect(profile.body.user.email).toBe(email);
  });

  test('change-password with wrong current fails', async () => {
    const agent2 = request.agent(app);
    // register new user
    const uemail = 'change-pass@example.com';
    await prisma.user.deleteMany({ where: { email: uemail } }).catch(() => {});
    await agent2.post('/api/auth/register').send({ email: uemail, name: 'CP', password: 'OldPassword1' });

    const res = await agent2.post('/api/auth/change-password').send({ currentPassword: 'wrong', newPassword: 'NewPassword1' });
    expect(res.status).toBe(400);
  });

  test('change-password works and allows new login', async () => {
    const agent3 = request.agent(app);
    const uemail = 'change-pass2@example.com';
    const upass = 'OldPass2!';
    const newPass = 'NewPass2!';
    await prisma.user.deleteMany({ where: { email: uemail } }).catch(() => {});
    await agent3.post('/api/auth/register').send({ email: uemail, name: 'CP2', password: upass });

    const change = await agent3.post('/api/auth/change-password').send({ currentPassword: upass, newPassword: newPass });
    expect(change.status).toBe(200);

    // logout then login with new password
    await agent3.post('/api/auth/logout');
    const loginNew = await agent3.post('/api/auth/login').send({ email: uemail, password: newPass });
    expect(loginNew.status).toBe(200);
  });
});
