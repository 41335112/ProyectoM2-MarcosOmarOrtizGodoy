const { loadEnvFile } = require ('node:process');
const express = require ('express');
const pool = require ('../db/config');
const router = express.Router();


loadEnvFile('.env');



router.get('/', async (req, res) => {
  try{
    
    const result = await pool.query('SELECT * FROM authors');
    res.json(result.rows);

  }catch (error){

    console.error('Error obteniendo authors', error);
    res.status(500).json({error: 'error obteniendo authors'})
  
  }
});

router.get('/:id', async (req, res)=> {

  try{
    const result = await pool.query(
      'SELECT * FROM authors WHERE id = $1', [req.params.id]
    );

    if(result.rows.length === 0){
      return res.status(404).json({error: 'author no encontrado'});
    };
    
    res.json(result.rows[0]);
  }catch(error){
   console.error('error obteniendo author', error);
   res.status(404).json({error: 'error obteniendo author'})
  }
  
})

router.post('/', async(req, res) => {

  const { name, email, bio } = req.body;

  if(!name || !email || !bio){
    return res.status(404).json({error:'El name, email y bio son obligatorios'});
  };

  try {
    
    const result = await pool.query(
      'INSERT INTO authors( name, email, bio) VALUES ($1, $2, $3) RETURNING *', 
      [name, email, bio]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    
    console.error('error creando author', error);
    res.status(404).json({error: 'error creando author'});
    
  }
  

  
 
});

router.put('/:id', async(req, res) => {
  
  const { name, email, bio } = req.body;
 
  try {
    const result = await pool.query(
     'UPDATE authors SET name = COALESCE($1, name), email = COALESCE($2, email), bio = COALESCE($3, bio) WHERE id = $4 RETURNING *',
     [name, email, bio, req.params.id]
    );

    if(result.rows.length === 0){
      return res.status(404).json({error: 'author no encontrado'});
    };
    
    res.json(result.rows[0]);

  } catch (error) {
    
    console.error('error actualizando author', error);
    res.status(404).json({error: 'error actualizando author'});

  }

});

router.delete('/:id', async(req, res) => {
 

  try {
    
    const result = await pool.query(
     'DELETE FROM authors WHERE id = $1 RETURNING *',
     [req.params.id]
    );

    if(result.rows.length === 0){
      return res.status(404).json({error: 'author no encontrado'});
    };

    res.json({mensaje: 'Author eliminado correctamente'});

  } catch (error) {

    console.error('error al eliminar al  author', error);
    res.status(404).json({error: 'error al eliminar al  author'});
  
  }

})


module.exports = router;



