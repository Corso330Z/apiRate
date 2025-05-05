import express from "express";
//crio a variavel express que vou usar os verbos http de preferencia nomeie com nomes referentes a tabela, nesse exemplo coloquei routerFilmes
import { adicionarFilme } from "../servicos/filmes/adicionar.js";
import { buscarFilmePorId } from "../servicos/filmes/buscar.js";

import upload from '../../middlewares/upload.js';
const routerFilmes = express.Router();

routerFilmes.patch("/:id", (req, res) => {
    const { id } = req.params;
    res.send("Rota de filmes - PATCH");
});

routerFilmes.delete("/:id", (req, res) => {
    const { id } = req.params;
    res.send("Rota de filmes - DELETE");
});

routerFilmes.put("/:id", (req, res) => {
    const { id } = req.params;
    res.send("Rota de filmes - PUT");
});


routerFilmes.post("/", upload.single('fotoFilme'), async (req, res) => {
    const { nome, dataLanc, sinopse, classInd } = req.body;
    const fotoFilme = req.file ? req.file.buffer : null; // buffer binário
    console.log(nome, dataLanc, sinopse, classInd, fotoFilme);

    try {
        const resultado = await adicionarFilme(nome, dataLanc, sinopse, classInd, fotoFilme);
        res.status(201).json(resultado);
    }
    catch (error) {
        res.status(400).json({
            mensagem: error.message,
            codigo: error.codigo,
            erro: error.erro
        });
    }
});

routerFilmes.get('/:id/imagem', async (req, res) => {
    const { id } = req.params;
    try {
      const [resultado] = await buscarFilmePorId(id);
      console.log(resultado);
  
      if (!resultado || !resultado.fotoFilme) {
        return res.status(404).send('Imagem não encontrada');
      }
  
      // Aqui você pode ajustar o content-type conforme o formato real (jpeg/png...)
      res.set('Content-Type', 'image/jpeg');
      res.send(resultado.fotoFilme);
    } catch (err) {
      res.status(500).json({ mensagem: err.message });
    }
  });

export default routerFilmes;