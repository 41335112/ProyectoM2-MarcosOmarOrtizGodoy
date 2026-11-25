const { describe, it, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../app');
const pool = require('../db/config');

describe('Endpoints de /authors', () => {
  let createdAuthorId;
  const uniqueEmail = `test.${Date.now()}@example.com`;

  after(async () => {
    if (createdAuthorId) {
      await pool.query('DELETE FROM authors WHERE id = $1', [createdAuthorId]);
    }
    await pool.end();
  });

  it('debe crear un author y devolver 201', async () => {
    const res = await request(app)
      .post('/authors')
      .send({
         name: 'Sofía Test',
         email: uniqueEmail,
         bio: 'Autora de prueba'
        });

     assert.equal(res.status, 201);
     assert.equal(res.body.name, 'Sofía Test');
     assert.equal(res.body.email, uniqueEmail);
     assert.ok(res.body.id);

     createdAuthorId = res.body.id;
    });

  it('debe rechazar un email duplicado con 400', async () => {
     const res = await request(app)
      .post('/authors')
      .send({
         name: 'Otro Nombre',
         email: uniqueEmail,
         bio: 'Duplicado'
        });

     assert.equal(res.status, 400);
    });

  it('debe obtener el author creado por id y devolver 200', async () => {
     const res = await request(app).get(`/authors/${createdAuthorId}`);

     assert.equal(res.status, 200);
     assert.equal(res.body.id, createdAuthorId);
     assert.equal(res.body.email, uniqueEmail);
    });

  it('debe devolver 404 si el author no existe', async () => {
     const res = await request(app).get('/authors/999999');

     assert.equal(res.status, 404);
    });
});