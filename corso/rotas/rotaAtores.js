import express from "express";
const routerFilmes = express.Router();

//utilizo o express para criar as rotas, nesse caso criei a rota get, mas poderia ser post, put, delete e etc
routerFilmes.get("/", (req, res) => {
    res.send("API - Hiago");
});

//exportando a rota para ser utilizada em outros arquivos, nesse caso o index.js
export default routerFilmes;