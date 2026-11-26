const { loadEnvFile } = require ('node:process');
const express = require ('express');
const pool = require ('../db/config');
const {
  validateIdParam,
  validateCreatePost,
  validateUpdatePost
} = require('../validaciones/validatePosts');
const router = express.Router();

loadEnvFile('.env');

router.get('/', async (req, res) => {
  
  try{

    const result = await pool.query('SELECT * FROM posts');
    return res.status(200).json(result.rows);
  
  }catch(error){
  
    console.error('Error obteniendo posts', error);
    return res.status(500).json({error: 'Error obteniendo posts'})
  
  }
  
});

router.get('/:id',validateIdParam, async (req, res) => {

  try{
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1', [Number(req.params.id)]
    );

    if(result.rows.length === 0){
      return res.status(404).json({error: 'Posts no encontrado'});
    };
    
    return res.status(404).json(result.rows[0]);
  }catch(error){

   console.error('error obteniendo posts', error);
   return res.status(500).json({error: 'Error obteniendo posts'})

  }
});

router.post('/',validateCreatePost, async(req, res) => {

  const { title, content, author_id, published } = req.body;

  try {
    
    const result = await pool.query(
      'INSERT INTO posts( title, content, author_id, published ) VALUES ($1, $2, $3, $4) RETURNING *', 
      [title, content, author_id, published]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    
    if (error.code === '23503') {
      return res.status(400).json({ error: 'El author_id indicado no existe' });
    }

    console.error('error creando posts', error);
    return res.status(500).json({error: 'Error creando posts'});
    
  }

});

router.put('/:id',validateIdParam,validateUpdatePost , async(req, res) => {
  
  const { title = null, content = null, author_id = null, published = null } = req.body;

  try {

    const result = await pool.query(
     'UPDATE posts SET title = COALESCE($1, title), content = COALESCE($2, content), published = COALESCE($3, published) WHERE id = $4 RETURNING *',
     [title, content, published, Number(req.params.id)]
    );

    if(result.rows.length === 0){
      return res.status(404).json({error: 'Posts no encontrado'});
    };
    
    return res.status(200).json(result.rows[0]);
    
  } catch (error) {
    
    if (error.code === '23503') {
      return res.status(400).json({ error: 'El author_id indicado no existe' });
    }

    console.error('error actualizando posts', error);
    return res.status(500).json({error: 'Error actualizando posts'});

  }

 
});

router.delete('/:id',validateIdParam, async(req, res) => {
 
  
  try {
    
    const result = await pool.query(
     'DELETE FROM posts WHERE id = $1 RETURNING *',
     [Number(req.params.id)]
    );

    if(result.rows.length === 0){
      return res.status(404).json({error: 'posts no encontrado'});
    };

    return res.status(200).json({mensaje: 'Posts eliminado correctamente'});

  } catch (error) {

    console.error('error al eliminar Posts', error);
    return res.status(500).json({error: 'Error al eliminar Posts'});
  
  }
})


module.exports = router;