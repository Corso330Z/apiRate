import express from "express";
import upload from '../../middlewares/upload.js';
import {
    buscarGenerosDoFilme,
    buscarGenerosFilmes,
    buscarFilmesDoGenero
} from "../servicos/generosFilmes/busca.js";

const routerGeneroFilmes = express.Router();



routerGeneroFilmes.get("/genero/:idgenero", async (req, res) => {
    try {
        const { idgenero } = req.params;
        const resultado = await buscarGenerosFilmes(nome);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar gênero", detalhes: error.message });
    }
});

routerGeneroFilmes.get("/filme/:idFilme", async (req, res) => {
    try {
        const { idFilme } = req.params;
        const resultado = await buscarFilmesDoGenero(idgenero);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar filmes do gênero ", detalhes: error.message });
    }
});

export default routerGeneroFilmes;
