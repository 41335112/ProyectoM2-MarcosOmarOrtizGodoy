const { loadEnvFile } = require('node:process');
const express = require('express');
const authorsRouter = require('./router/authors');
const postsRouter = require('./router/posts');

loadEnvFile('.env');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'MiniBlog API funcionando' });
});

app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);

module.exports = app;