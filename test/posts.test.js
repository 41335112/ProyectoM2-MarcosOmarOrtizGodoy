const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../app');
const pool = require('../db/config');

describe('Endpoints de /posts', () => {
  let testAuthorId;
  let createdPostId;

  before(async () => {
    const authorRes = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id',
      ['Autor Test Posts', `posts.${Date.now()}@example.com`, 'Bio de prueba']
    );
    testAuthorId = authorRes.rows[0].id;
  });

  after(async () => {
    if (createdPostId) {
      await pool.query('DELETE FROM posts WHERE id = $1', [createdPostId]);
    }
    if (testAuthorId) {
      await pool.query('DELETE FROM authors WHERE id = $1', [testAuthorId]);
    }
    await pool.end();
  });

  it('debe crear un post válido y devolver 201', async () => {
    const res = await request(app)
      .post('/posts')
      .send({
        title: 'Mi primer post de prueba',
        content: 'Contenido del post de prueba',
        author_id: testAuthorId,
        published: false
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.title, 'Mi primer post de prueba');
    assert.equal(res.body.author_id, testAuthorId);
    assert.equal(res.body.published, false);
    assert.ok(res.body.id);

    createdPostId = res.body.id;
  });

  it('debe rechazar un post con title o content vacíos con 400', async () => {
    const res = await request(app)
      .post('/posts')
      .send({
        title: '   ',
        content: '',
        author_id: testAuthorId
      });

    assert.equal(res.status, 400);
  });

  it('debe devolver 404 al intentar eliminar un post inexistente', async () => {
    const res = await request(app).delete('/posts/999999');

    assert.equal(res.status, 404);
  });
});