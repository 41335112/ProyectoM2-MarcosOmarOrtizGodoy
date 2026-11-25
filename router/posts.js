const { loadEnvFile } = require ('node:process');
const express = require ('express');
const pool = require ('../db/config');
const router = express.Router();

loadEnvFile('.env');

router.get('/', async (req, res) => {
  
  try{

    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  
  }catch(error){
  
    console.error('Error obteniendo posts', error);
    res.status(500).json({error: 'error obteniendo posts'})
  
  }
  
});

router.get('/:id', async (req, res) => {

  try{
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1', [req.params.id]
    );

    if(result.rows.length === 0){
      return res.status(404).json({error: 'Posts no encontrado'});
    };
    
    res.json(result.rows[0]);
  }catch(error){

   console.error('error obteniendo posts', error);
   res.status(404).json({error: 'error obteniendo posts'})

  }
});

router.post('/', async(req, res) => {

  const { title, content, author_id, published } = req.body;

  if(!title || !content || !author_id || !published ){
    return res.status(404).json({error:'El title, el contet y el author id son obligatorios'});
  };
 
  try {
    
    const result = await pool.query(
      'INSERT INTO posts( title, content, author_id, published ) VALUES ($1, $2, $3, $4) RETURNING *', 
      [title, content, author_id, published]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    
    console.error('error creando posts', error);
    res.status(404).json({error: 'error creando posts'});
    
  }

});

router.put('/:id', async(req, res) => {
  
  const { title, content, author_id, published } = req.body;

  try {

    const result = await pool.query(
     'UPDATE posts SET title = COALESCE($1, title), content = COALESCE($2, content), published = COALESCE($3, published) WHERE id = $4 RETURNING *',
     [title, content, published, req.params.id]
    );

    if(result.rows.length === 0){
      return res.status(404).json({error: 'posts no encontrado'});
    };
    
    res.json(result.rows[0]);
    
  } catch (error) {
    
    console.error('error actualizando posts', error);
    res.status(404).json({error: 'error actualizando posts'});

  }

 
});

router.delete('/:id', async(req, res) => {
 
  
  try {
    
    const result = await pool.query(
     'DELETE FROM posts WHERE id = $1 RETURNING *',
     [req.params.id]
    );

    if(result.rows.length === 0){
      return res.status(404).json({error: 'posts no encontrado'});
    };

    res.json({mensaje: 'Posts eliminado correctamente'});

  } catch (error) {

    console.error('error al eliminar Posts', error);
    res.status(404).json({error: 'error al eliminar Posts'});
  
  }
})


module.exports = router;