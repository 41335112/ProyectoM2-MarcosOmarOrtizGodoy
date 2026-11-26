
const express = require ('express');
const pool = require ('../db/config');
const {
  validateIdParam,
  validateCreateAuthor,
  validateUpdateAuthor 
} = require('../validaciones/validateAuthors');
const router = express.Router();






router.get('/', async (req, res) => {
  try{
    
    const result = await pool.query('SELECT * FROM authors');
    res.json(result.rows);

  }catch (error){

    console.error('Error obteniendo authors', error);
    return res.status(500).json({error: 'error obteniendo authors'})
  
  }
});

router.get('/:id',validateIdParam, async (req, res)=> {

  try{
    const result = await pool.query(
      'SELECT * FROM authors WHERE id = $1', [Number(req.params.id)]
    );

    if(result.rows.length === 0){
      return res.status(404).json({error: 'Author no encontrado'});
    };
    
    res.status(200).json(result.rows[0]);
  }catch(error){
   
   console.error('error obteniendo author', error);
   return res.status(500).json({error: 'error obteniendo author'})
  
  }
  
})

router.post('/',validateCreateAuthor, async(req, res) => {

  const { name, email, bio = null } = req.body;

  try {
    
    const result = await pool.query(
      'INSERT INTO authors( name, email, bio) VALUES ($1, $2, $3) RETURNING *', 
      [name, email, bio]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    console.error('error creando author', error);
    res.status(500).json({error: 'error creando author'});
    
  }
  

  
 
});

router.put('/:id',validateIdParam ,validateUpdateAuthor, async(req, res) => {
  
  const { name = null , email = null, bio = null } = req.body;
 
  try {
    const result = await pool.query(
     'UPDATE authors SET name = COALESCE($1, name), email = COALESCE($2, email), bio = COALESCE($3, bio) WHERE id = $4 RETURNING *',
     [name, email, bio, Number(req.params.id)]
    );

    if(result.rows.length === 0){
      return res.status(404).json({error: 'author no encontrado'});
    };
    
    res.status(201).json(result.rows[0]);

  } catch (error) {

    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    console.error('error actualizando author', error);
    return res.status(500).json({error: 'error actualizando author'});

  }

});

router.delete('/:id',validateIdParam, async(req, res) => {
 

  try {
    
    const result = await pool.query(
     'DELETE FROM authors WHERE id = $1 RETURNING *',
     [Number(req.params.id)]
    );

    if(result.rows.length === 0){
      return res.status(404).json({error: 'author no encontrado'});
    };

    return res.status(201).json({mensaje: 'Author eliminado correctamente'});

  } catch (error) {

    console.error('error al eliminar al  author', error);
    return res.status(500).json({error: 'error al eliminar al  author'});
  
  }

})


module.exports = router;



