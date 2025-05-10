import express from "express";
import {
    buscarAtoresDoFilme,
    buscarAtoresFilmes,
    buscarFilmesDoAtor
} from "../servicos/atoresFilmes/busca.js";

const routerAtoresFilmes = express.Router();

routerAtoresFilmes.get("/", async (req, res) => {
    try {
        const resultado = await buscarAtoresFilmes();
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar atores e filmes", detalhes: error.message });
    }
});

routerAtoresFilmes.get("/ator/:idAtor", async (req, res) => {
    try {
        const { idAtor } = req.params;
        const resultado = await buscarFilmesDoAtor(idAtor);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar filmes do ator", detalhes: error.message });
    }
});

routerAtoresFilmes.get("/filme/:idFilme", async (req, res) => {
    try {
        const { idFilme } = req.params;
        const resultado = await buscarAtoresDoFilme(idFilme);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar atores do filme", detalhes: error.message });
    }
});

export default routerAtoresFilmes;
