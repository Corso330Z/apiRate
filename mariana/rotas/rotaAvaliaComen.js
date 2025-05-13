import express from "express";
import { inserirAvaliacao } from "../servicos/avaliacaoComentarios/adicionar.js";
import { buscarAvaliacaoPorId } from "../servicos/avaliacaoComentarios/buscar.js";
import { atualizarAvaliacao } from "../servicos/avaliacaoComentarios/atualizar.js";
import { deletarAvaliacao } from "../servicos/avaliacaoComentarios/deletar.js";
import upload from '../../middlewares/upload.js';

const routerAvaliacaoComentarios = express.Router();

// Rota POST (inserção)
routerAvaliacaoComentarios.post("/", upload.single('fotoFilme'), async (req, res) => {
    const {
        perfil_idperfil,
        positiva,
        negativa,
        comentarios_idcomentarios,
        comentarios_perfil_idperfil,
        comentarios_filmes_idfilmes
    } = req.body;

    // Validação básica
    if (
        perfil_idperfil === undefined ||
        positiva === undefined ||
        negativa === undefined ||
        comentarios_idcomentarios === undefined ||
        comentarios_perfil_idperfil === undefined ||
        comentarios_filmes_idfilmes === undefined
    ) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    try {
        const resultado = await inserirAvaliacao(
            parseInt(perfil_idperfil),
            parseInt(positiva),
            parseInt(negativa),
            parseInt(comentarios_idcomentarios),
            parseInt(comentarios_perfil_idperfil),
            parseInt(comentarios_filmes_idfilmes)
        );
        res.status(201).json(resultado);
    } catch (error) {
        res.status(400).json({
            mensagem: error.message,
            codigo: error.codigo,
            erro: error.erro
        });
    }
});

// Rota GET (busca por perfil)
routerAvaliacaoComentarios.get('/:perfil_idperfil', async (req, res) => {
    const { perfil_idperfil } = req.params;
    try {
        const resultado = await buscarAvaliacaoPorId(perfil_idperfil);
        if (!resultado) {
            return res.status(404).send('Avaliação não encontrada');
        }
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ mensagem: err.message });
    }
});

// Rota PUT (atualização por perfil)
routerAvaliacaoComentarios.put("/:perfil_idperfil", async (req, res) => {
    const { perfil_idperfil } = req.params;
    const {
        positiva,
        negativa,
        comentarios_idcomentarios,
        comentarios_perfil_idperfil,
        comentarios_filmes_idfilmes
    } = req.body;

    if (
        positiva === undefined ||
        negativa === undefined ||
        comentarios_idcomentarios === undefined ||
        comentarios_perfil_idperfil === undefined ||
        comentarios_filmes_idfilmes === undefined
    ) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    try {
        const resultado = await atualizarAvaliacao(
            parseInt(perfil_idperfil),
            parseInt(positiva),
            parseInt(negativa),
            parseInt(comentarios_idcomentarios),
            parseInt(comentarios_perfil_idperfil),
            parseInt(comentarios_filmes_idfilmes)
        );
        res.json(resultado);
    } catch (err) {
        res.status(400).json({ mensagem: err.message });
    }
});

// Rota DELETE (por perfil)
routerAvaliacaoComentarios.delete("/:perfil_idperfil", async (req, res) => {
    const { perfil_idperfil } = req.params;

    try {
        await deletarAvaliacao(parseInt(perfil_idperfil));
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ mensagem: err.message });
    }
});

export default routerAvaliacaoComentarios;
