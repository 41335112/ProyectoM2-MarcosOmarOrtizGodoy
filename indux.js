const express = require ("express");
const { Router } = require("express");

const app = express();

const router = Router();

app.use(router);

router.get("/", (request, response) =>{
    response.send("well done");
})


app.listen(3000, () => {
    console.log(" el servidor 3000 se levanto correctamente ")
}); 
