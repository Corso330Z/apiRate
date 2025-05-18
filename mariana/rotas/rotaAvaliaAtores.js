import express from "express";
import { inserirAvaliacao } from "../servicos/avaliacaoAtores/adicionar.js";
import { buscarAvaliacaoPorId } from "../servicos/avaliacaoAtores/buscar.js";
import { atualizarAvaliacao } from "../servicos/avaliacaoAtores/atualizar.js";
import { deletarAvaliacao } from "../servicos/avaliacaoAtores/deletar.js";
import upload from '../../middlewares/upload.js';

const routerAvaliacaoAtores = express.Router();

// Inserir avaliação
/**
 * @swagger
 * tags:
 *   name: Avaliação de Atores
 *   description: Endpoints para gerenciar avaliações de atores
 */

/**
 * @swagger
 * /avaliacaoAtores:
 *   post:
 *     summary: Insere uma nova avaliação para um ator
 *     tags: [Avaliação de Atores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - perfil_idperfil
 *               - atores_idatores
 *               - positiva
 *               - negativa
 *             properties:
 *               perfil_idperfil:
 *                 type: integer
 *                 description: ID do perfil que está avaliando
 *               atores_idatores:
 *                 type: integer
 *                 description: ID do ator avaliado
 *               positiva:
 *                 type: integer
 *                 description: Número de avaliações positivas
 *               negativa:
 *                 type: integer
 *                 description: Número de avaliações negativas
 *     responses:
 *       201:
 *         description: Avaliação inserida com sucesso
 *       400:
 *         description: Erro nos dados enviados
 */
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

/**
 * @swagger
 * /avaliacaoAtores/{perfil_idperfil}/{atores_idatores}:
 *   get:
 *     summary: Busca avaliação por ID de perfil e ID de ator
 *     tags: [Avaliação de Atores]
 *     parameters:
 *       - in: path
 *         name: perfil_idperfil
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil
 *       - in: path
 *         name: atores_idatores
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ator
 *     responses:
 *       200:
 *         description: Avaliação encontrada
 *       404:
 *         description: Avaliação não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
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

/**
 * @swagger
 * /avaliacaoAtores/{perfil_idperfil}/{atores_idatores}:
 *   put:
 *     summary: Atualiza uma avaliação existente
 *     tags: [Avaliação de Atores]
 *     parameters:
 *       - in: path
 *         name: perfil_idperfil
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil
 *       - in: path
 *         name: atores_idatores
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ator
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               positiva:
 *                 type: integer
 *                 description: Número de avaliações positivas
 *               negativa:
 *                 type: integer
 *                 description: Número de avaliações negativas
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso
 *       400:
 *         description: Erro ao atualizar avaliação
 */
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

/**
 * @swagger
 * /avaliacaoAtores/{perfil_idperfil}/{atores_idatores}:
 *   delete:
 *     summary: Deleta uma avaliação por ID de perfil e ator
 *     tags: [Avaliação de Atores]
 *     parameters:
 *       - in: path
 *         name: perfil_idperfil
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil
 *       - in: path
 *         name: atores_idatores
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ator
 *     responses:
 *       204:
 *         description: Avaliação deletada com sucesso
 *       500:
 *         description: Erro ao deletar avaliação
 */
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
