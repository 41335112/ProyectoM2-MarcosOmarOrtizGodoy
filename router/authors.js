const { loadEnvFile } = require ('node:process');
const express = require ('express');
const router = express.Router();


loadEnvFile('.env');

let authors = [
 {
   id: 1,
   name: 'Ana García',
   email: 'ana@example.com',
   bio: 'Desarrolladora full-stack apasionada por Node.js'
 },

 {
   id: 2,
   name: 'Carlos Ruiz',
   email: 'carlos@example.com',
   bio: 'Escritor técnico especializado en bases de datos'
 },

 {
  id: 3,
  name: 'María López',
  email: 'maria@example.com',
  bio: 'Ingeniera de software con foco en APIs REST'
 }
];

router.get('/', (req, res) => {
  res.json(authors);
});

router.get('/:id', (req, res)=> {

  const author = authors.find(m => m.id === parseInt(req.params.id));

  if(!author){
    return res.status(404).json({error: 'author no encontrado'});
  }

  res.json(author);
})

router.post('/', (req, res) => {

  const { name, email, bio } = req.body;

  if(!name || !email || !bio){
    return res.status(404).json({error:'El name, email y bio son obligatorios'});
  };

  const nuevoAuthor = {
    id: authors.length + 1,
    name: name,
    bio: bio
  };

  authors.push(nuevoAuthor);
  res.status(201).json(authors);
});

router.put('/:id', (req, res) => {
  
  const author = authors.find(m => m.id === parseInt(req.params.id));

  if(!author){
    return res.status(404).json({error: 'author no encontrado'});
  }

  const { name, email, bio } = req.body;

  if(name) name.authors = name;
  if(email) email.author = email;
  if(bio) bio.author = bio;


  res.json(author);
});

router.delete('/:id', (req, res) => {
 
  const index = authors.findIndex(m => m.id === parseInt(req.params.id));

  if(index === -1){
    return res.status(404).json({error: 'author no encontrado'});
  }

  authors.splice(index, 1);
  res.json({mensaje: 'Author eliminado correctamente'});
})


module.exports = router;



