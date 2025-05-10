import express from "express";
import { inserirAvaliacao } from "../servicos/avaliacaoFilmes/adicionar.js";
import { buscarAvaliacaoPorId } from "../servicos/avaliacaoFilmes/buscar.js";
import { atualizarAvaliacao } from "../servicos/avaliacaoFilmes/atualizar.js";
import { deletarAvaliacao } from "../servicos/avaliacaoFilmes/deletar.js";
import upload from '../../middlewares/upload.js';

const routerAvaliacaoFilmes = express.Router();


routerAvaliacaoFilmes.post("/", upload.single('fotoFilme'), async (req, res) => {
    const { perfil_idperfil, filmes_idfilmes, positiva, negativa } = req.body;
    
    try {
        const resultado = await inserirAvaliacao(perfil_idperfil, filmes_idfilmes, positiva, negativa);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(400).json({
            mensagem: error.message,
            codigo: error.codigo,
            erro: error.erro
        });
    }
});


routerAvaliacaoFilmes.get('/:perfil_idperfil/:filmes_idfilmes', async (req, res) => {
    const { perfil_idperfil, filmes_idfilmes } = req.params;
    try {
        const resultado = await buscarAvaliacaoPorId(perfil_idperfil, filmes_idfilmes);
        if (!resultado) {
            return res.status(404).send('Avaliação não encontrada');
        }
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ mensagem: err.message });
    }
});


routerAvaliacaoFilmes.put("/:perfil_idperfil/:filmes_idfilmes", async (req, res) => {
    const { perfil_idperfil, filmes_idfilmes } = req.params;
    const { positiva, negativa } = req.body;

    try {
        const resultado = await atualizarAvaliacao(perfil_idperfil, filmes_idfilmes, positiva, negativa);
        res.json(resultado);
    } catch (err) {
        res.status(400).json({ mensagem: err.message });
    }
});

// Rota para deletar uma avaliação de filme
routerAvaliacaoFilmes.delete("/:perfil_idperfil/:filmes_idfilmes", async (req, res) => {
    const { perfil_idperfil, filmes_idfilmes } = req.params;
    
    try {
        await deletarAvaliacao(perfil_idperfil, filmes_idfilmes);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ mensagem: err.message });
    }
});

export default routerAvaliacaoFilmes;
