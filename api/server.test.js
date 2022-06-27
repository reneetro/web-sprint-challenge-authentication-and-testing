const request = require('supertest');
const server = require('./server');
const data = require('./jokes/jokes-data');
const db = require('../data/dbConfig')
const jwtDecode = require('jwt-decode')


beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})


afterAll(async () => {
  await db.destroy();
});

describe('HTTP tests', () => {
  test('[1] POST /api/auth/register: creating account with valid credentials', async () => {
    let res = await request(server).post('/api/auth/register').send({username: 'testing', password:'1234'});
    expect(res.body).toHaveProperty('username', 'testing')
    expect(res.body).toHaveProperty('id', 1)
  })
  test('[2] POST /api/auth/register: creating account with invalid credentials', async () => {
    let res = await request(server).post('/api/auth/register').send({username: ' ', password:'1234'});
    expect(res.body.message).toBe(`username and password required`)

    res = await request(server).post('/api/auth/register').send({username: 'testing', password:' '});
    expect(res.body.message).toBe(`username and password required`)
  })
  test('[4] POST /api/auth/login: logging with valid credentials returns the correct message', async () => {
    await request(server).post('/api/auth/login').send({username: 'testing', password:'1234'})

    let res = await request(server).post('/api/auth/login').send({username: 'testing', password:'1234'});
    expect(res.body.message).toBe(`welcome, testing`)
  })
  test('[5] POST /api/auth/login: logging with invalid credentials returns the correct message', async () => {
    await request(server).post('/api/auth/login').send({username: 'testing', password:'1234'})

    let res = await request(server).post('/api/auth/login').send({username: 'test', password:'1234'});
    expect(res.body.message).toBe('invalid credentials')

    res = await request(server).post('/api/auth/login').send({username: 'testing', password:'blah'});
    expect(res.body.message).toBe('invalid credentials')
  })
  test('[6] POST /api/auth/login: logging with valid credentials returns the correct token', async () => {
    let res = await request(server).post('/api/auth/login').send({username: 'testing', password:'1234'})
    let decoded = jwtDecode(res.body.token)
    expect(res.body.password).not.toBe('drowssap')
    expect(decoded).toMatchObject({
      subject: 1,
      username: 'testing'
    })
    res = await request(server).post('/api/auth/register').send({username: 'debby', password:'drowssap'});

    res = await request(server).post('/api/auth/login').send({username: 'debby', password:'drowssap'})
    decoded = jwtDecode(res.body.token)
    expect(decoded).toMatchObject({
      subject: 2,
      username: 'debby'
    })
  })
})