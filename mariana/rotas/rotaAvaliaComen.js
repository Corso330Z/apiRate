import express from "express";
import { inserirAvaliacao } from "../servicos/avaliacaoComentarios/adicionar.js";
import { buscarAvaliacaoPorId } from "../servicos/avaliacaoComentarios/buscar.js";
import { atualizarAvaliacao } from "../servicos/avaliacaoComentarios/atualizar.js";
import { deletarAvaliacao } from "../servicos/avaliacaoComentarios/deletar.js";
import upload from '../../middlewares/upload.js';

const routerAvaliacaoComentarios = express.Router();

/**
 * @swagger
 * tags:
 *   name: Avaliação de Comentários
 *   description: Endpoints para gerenciar avaliações feitas em comentários de filmes
 */

/**
 * @swagger
 * /avaliacaoComentarios:
 *   post:
 *     summary: Insere uma nova avaliação de comentário
 *     tags: [Avaliação de Comentários]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - perfil_idperfil
 *               - positiva
 *               - negativa
 *               - comentarios_idcomentarios
 *               - comentarios_perfil_idperfil
 *               - comentarios_filmes_idfilmes
 *             properties:
 *               perfil_idperfil:
 *                 type: integer
 *                 description: ID do perfil que está avaliando
 *               positiva:
 *                 type: integer
 *                 description: Quantidade de avaliações positivas
 *               negativa:
 *                 type: integer
 *                 description: Quantidade de avaliações negativas
 *               comentarios_idcomentarios:
 *                 type: integer
 *                 description: ID do comentário avaliado
 *               comentarios_perfil_idperfil:
 *                 type: integer
 *                 description: ID do autor do comentário
 *               comentarios_filmes_idfilmes:
 *                 type: integer
 *                 description: ID do filme ao qual o comentário pertence
 *               fotoFilme:
 *                 type: string
 *                 format: binary
 *                 description: (Opcional) Imagem enviada junto da avaliação
 *     responses:
 *       201:
 *         description: Avaliação inserida com sucesso
 *       400:
 *         description: Erro nos dados enviados
 */
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

/**
 * @swagger
 * /avaliacaoComentarios/{perfil_idperfil}:
 *   get:
 *     summary: Busca avaliações de comentários feitas por um perfil
 *     tags: [Avaliação de Comentários]
 *     parameters:
 *       - in: path
 *         name: perfil_idperfil
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil que avaliou
 *     responses:
 *       200:
 *         description: Avaliações encontradas
 *       404:
 *         description: Nenhuma avaliação encontrada
 *       500:
 *         description: Erro ao buscar avaliações
 */
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

/**
 * @swagger
 * /avaliacaoComentarios/{perfil_idperfil}:
 *   put:
 *     summary: Atualiza uma avaliação de comentário
 *     tags: [Avaliação de Comentários]
 *     parameters:
 *       - in: path
 *         name: perfil_idperfil
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil que avaliou
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - positiva
 *               - negativa
 *               - comentarios_idcomentarios
 *               - comentarios_perfil_idperfil
 *               - comentarios_filmes_idfilmes
 *             properties:
 *               positiva:
 *                 type: integer
 *                 description: Quantidade de avaliações positivas
 *               negativa:
 *                 type: integer
 *                 description: Quantidade de avaliações negativas
 *               comentarios_idcomentarios:
 *                 type: integer
 *               comentarios_perfil_idperfil:
 *                 type: integer
 *               comentarios_filmes_idfilmes:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso
 *       400:
 *         description: Erro ao atualizar a avaliação
 */
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

/**
 * @swagger
 * /avaliacaoComentarios/{perfil_idperfil}:
 *   delete:
 *     summary: Deleta uma avaliação de comentário
 *     tags: [Avaliação de Comentários]
 *     parameters:
 *       - in: path
 *         name: perfil_idperfil
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil que realizou a avaliação
 *     responses:
 *       204:
 *         description: Avaliação deletada com sucesso
 *       500:
 *         description: Erro ao deletar avaliação
 */
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
