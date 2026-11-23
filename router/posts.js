const { loadEnvFile } = require ('node:process');
const express = require ('express');
const router = express.Router();

loadEnvFile('.env');

let posts = [
{
   id: 1,
   title: 'Introducción a Node.js',
   content: 'Node.js es un runtime de JavaScript...',
   author_id: 1,
   published: true
 },

 {
   id: 2,
   title: 'PostgreSQL vs MySQL',
   content: 'Ambas bases de datos tienen ventajas...',
   author_id: 2,
   published: true
 },

 {
   id: 3,
   title: 'APIs RESTful',
   content: 'REST es un estilo arquitectónico...',
   author_id: 1,
   published: true
 },

 {
   id: 4,
   title: 'Manejo de errores en Express',
   content: 'El manejo apropiado de errores...',
   author_id: 3,
   published: false
 },

 {
   id: 5,
   title: 'Async/Await explicado',
   content: 'Las promesas simplifican el código asíncrono...',
   author_id: 3,
   published: false
 }

];

router.get('/', (req, res) => {
    res.json(posts);
});

router.get('/:id', (req, res) => {

  const post = posts.find(m => m.id === parseInt(req.params.id));

  if(!post){
    return res.status(404).json({error: 'Post no encontrado'});
  }

  res.json(post);
});

router.post('/', (req, res) => {

  const { title, content, author_id, published } = req.body;

  if(!title || !content || !author_id || !published ){
    return res.status(404).json({error:'El title, el contet y el author id son obligatorios'});
  };

  const nuevoPosts = {
    id: posts.length + 1,
    title: title,
    content : content,
    author_id : author_id,
    published : published
  };

  posts.push(nuevoPosts);
  res.status(201).json(posts);
});

router.put('/:id', (req, res) => {
  
  const post = posts.find(m => m.id === parseInt(req.params.id));

  if(!post){
    return res.status(404).json({error: 'Posts no encontrado'});
  }

  const { title, content, author_id, published } = req.body;

  if(title) title.posts = title;
  if(content) content.posts = content;
  if(author_id) author_id.posts = author_id;
  if(published) published.posts = published;


  res.json(post);
});

router.delete('/:id', (req, res) => {
 
  const index = posts.findIndex(m => m.id === parseInt(req.params.id));

  if(index === -1){
    return res.status(404).json({error: 'Posts no encontrado'});
  }

  posts.splice(index, 1);
  res.json({mensaje: 'Posts eliminado correctamente'});
})


module.exports = router;