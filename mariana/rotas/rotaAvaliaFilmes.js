import express from "express";
import { inserirAvaliacao } from "../servicos/avaliacaoFilmes/adicionar.js";
import { buscarAvaliacaoPorId } from "../servicos/avaliacaoFilmes/buscar.js";
import { atualizarAvaliacao } from "../servicos/avaliacaoFilmes/atualizar.js";
import { deletarAvaliacao } from "../servicos/avaliacaoFilmes/deletar.js";
import upload from '../../middlewares/upload.js';

const routerAvaliacaoFilmes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Avaliação de Filmes
 *   description: Endpoints para gerenciar avaliações feitas em filmes
 */

/**
 * @swagger
 * /avaliacaoFilmes:
 *   post:
 *     summary: Insere uma nova avaliação de filme
 *     tags: [Avaliação de Filmes]
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
 *               - filmes_idfilmes
 *               - positiva
 *               - negativa
 *             properties:
 *               perfil_idperfil:
 *                 type: integer
 *                 description: ID do perfil que está avaliando
 *               filmes_idfilmes:
 *                 type: integer
 *                 description: ID do filme avaliado
 *               positiva:
 *                 type: integer
 *                 description: Quantidade de avaliações positivas
 *               negativa:
 *                 type: integer
 *                 description: Quantidade de avaliações negativas
 *               fotoFilme:
 *                 type: string
 *                 format: binary
 *                 description: (Opcional) Foto relacionada ao filme
 *     responses:
 *       201:
 *         description: Avaliação inserida com sucesso
 *       400:
 *         description: Erro nos dados enviados
 */
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

/**
 * @swagger
 * /avaliacaoFilmes/{perfil_idperfil}/{filmes_idfilmes}:
 *   get:
 *     summary: Busca avaliação de um filme feita por um perfil
 *     tags: [Avaliação de Filmes]
 *     parameters:
 *       - in: path
 *         name: perfil_idperfil
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil que avaliou
 *       - in: path
 *         name: filmes_idfilmes
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filme avaliado
 *     responses:
 *       200:
 *         description: Avaliação encontrada
 *       404:
 *         description: Avaliação não encontrada
 *       500:
 *         description: Erro ao buscar avaliação
 */
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

/**
 * @swagger
 * /avaliacaoFilmes/{perfil_idperfil}/{filmes_idfilmes}:
 *   put:
 *     summary: Atualiza uma avaliação de filme
 *     tags: [Avaliação de Filmes]
 *     parameters:
 *       - in: path
 *         name: perfil_idperfil
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil que avaliou
 *       - in: path
 *         name: filmes_idfilmes
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filme avaliado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - positiva
 *               - negativa
 *             properties:
 *               positiva:
 *                 type: integer
 *                 description: Quantidade de avaliações positivas
 *               negativa:
 *                 type: integer
 *                 description: Quantidade de avaliações negativas
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso
 *       400:
 *         description: Erro ao atualizar a avaliação
 */
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

/**
 * @swagger
 * /avaliacaoFilmes/{perfil_idperfil}/{filmes_idfilmes}:
 *   delete:
 *     summary: Deleta uma avaliação de filme
 *     tags: [Avaliação de Filmes]
 *     parameters:
 *       - in: path
 *         name: perfil_idperfil
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil que avaliou
 *       - in: path
 *         name: filmes_idfilmes
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filme avaliado
 *     responses:
 *       204:
 *         description: Avaliação deletada com sucesso
 *       500:
 *         description: Erro ao deletar avaliação
 */
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
