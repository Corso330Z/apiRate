import express from "express";
import { inserirAvaliacao } from "../servicos/avaliacaoAtores/adicionar.js";
import { buscarAvaliacaoPorId } from "../servicos/avaliacaoAtores/buscar.js";
import { atualizarAvaliacao } from "../servicos/avaliacaoAtores/atualizar.js";
import { deletarAvaliacao } from "../servicos/avaliacaoAtores/deletar.js";
import upload from '../../middlewares/upload.js';

const routerAvaliacaoAtores = express.Router();

// Inserir avaliação
routerAvaliacaoAtores.post("/", upload.single('fotoFilme'), async (req, res) => {
    const { perfil_idperfil, atores_idatores, positiva, negativa } = req.body;
    
    try {
        const resultado = await inserirAvaliacao(perfil_idperfil, atores_idatores, positiva, negativa);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(400).json({
            mensagem: error.message,
            codigo: error.codigo,
            erro: error.erro
        });
    }
});

// Buscar avaliação por ID
routerAvaliacaoAtores.get('/:perfil_idperfil/:atores_idatores', async (req, res) => {
    const { perfil_idperfil, atores_idatores } = req.params;
    try {
        const resultado = await buscarAvaliacaoPorId(perfil_idperfil, atores_idatores);
        if (!resultado) {
            return res.status(404).send('Avaliação não encontrada');
        }
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ mensagem: err.message });
    }
});

// Atualizar avaliação
routerAvaliacaoAtores.put("/:perfil_idperfil/:atores_idatores", async (req, res) => {
    const { perfil_idperfil, atores_idatores } = req.params;
    const { positiva, negativa } = req.body;

    try {
        const resultado = await atualizarAvaliacao(perfil_idperfil, atores_idatores, positiva, negativa);
        res.json(resultado);
    } catch (err) {
        res.status(400).json({ mensagem: err.message });
    }
});

// Deletar avaliação
routerAvaliacaoAtores.delete("/:perfil_idperfil/:atores_idatores", async (req, res) => {
    const { perfil_idperfil, atores_idatores } = req.params;
    
    try {
        await deletarAvaliacao(perfil_idperfil, atores_idatores);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ mensagem: err.message });
    }
});

export default routerAvaliacaoAtores;
