const { loadEnvFile } = require ('node:process');
const express = require ('express');
const authorsRouter = require ('./router/authors');
const postsRouters = require ('./router/posts');



loadEnvFile('.env');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use('/author', authorsRouter);
app.use('/posts', postsRouters);



app.use((req, res) => {
    res.status(404).json({error: 'Ruta no encontrada'});
});

app.use((err, req, res, next)=> {
    console.error(err.stack);
    res.status(500).json({error: 'Error interno del servidor'});
});


app.listen(PORT,() => {
 console.log(`Servidor Corriendo en http://localhost:${PORT}` );
});

