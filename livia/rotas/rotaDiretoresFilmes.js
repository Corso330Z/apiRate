import express from "express";
import {
  buscarDiretoresDoFilme,
  buscarDiretoresFilmes,
  buscarFilmesDoDiretor,
  buscarRelacaoDeDiretorEFilme,
} from "../servicos/diretoresFilmes/busca.js";

import {
  deletarDiretorFilmesByDiretor,
  deletarDiretorFilmesByFilme,
  deletarDiretorFilmesByFilmeAndDiretor,
} from "../servicos/diretoresFilmes/deletar.js";

import { adicionarDiretorFilmes } from "../servicos/diretoresFilmes/adicionar.js";

import { validarCriacaoRelacaoDiretorFilme } from "../validacao/validacaoDiretoresFilmes.js";

import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js";

const routerDiretoresFilmes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Diretores em filmes
 *   description: Endpoints para gerenciar relações entre diretores e filmes
 */

/**
 * @swagger
 * /diretoresFilmes:
 *   get:
 *     summary: Lista todas as relações entre diretores e filmes
 *     tags: [Diretores em filmes]
 *     responses:
 *       200:
 *         description: Relações encontradas com sucesso.
 *       500:
 *         description: Erro interno ao buscar as relações.
 */
routerDiretoresFilmes.get("/", async (req, res) => {
  try {
    const resultado = await buscarDiretoresFilmes();
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar as relações entre diretores e filmes.",
      codigo: "GET_DIRETORES_FILMES_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /diretoresFilmes/diretor/{idDiretor}:
 *   get:
 *     summary: Lista todos os filmes em que um diretor participou
 *     tags: [Diretores em filmes]
 *     parameters:
 *       - in: path
 *         name: idDiretor
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do diretor
 *     responses:
 *       200:
 *         description: Relações encontradas com sucesso.
 *       500:
 *         description: Erro interno ao buscar os filmes do diretor.
 */
routerDiretoresFilmes.get("/diretor/:idDiretor", async (req, res) => {
  const { idDiretor } = req.params;
  try {
    const resultado = await buscarFilmesDoDiretor(idDiretor);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar filmes do diretor.",
      codigo: "GET_FILMES_DIRETOR_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /diretoresFilmes/filme/{idFilme}:
 *   get:
 *     summary: Lista todos os diretores que participaram de um filme
 *     tags: [Diretores em filmes]
 *     parameters:
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filme
 *     responses:
 *       200:
 *         description: Relações encontradas com sucesso.
 *       500:
 *         description: Erro interno ao buscar os diretores do filme.
 */
routerDiretoresFilmes.get("/filme/:idFilme", async (req, res) => {
  const { idFilme } = req.params;
  try {
    const resultado = await buscarDiretoresDoFilme(idFilme);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar diretores do filme.",
      codigo: "GET_DIRETORES_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /diretoresFilmes/diretorFilme/{idFilme}/{idDiretor}:
 *   get:
 *     summary: Busca uma relação específica entre um diretor e um filme
 *     tags: [Diretores em filmes]
 *     parameters:
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idDiretor
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relação encontrada.
 *       500:
 *         description: Erro interno ao buscar a relação.
 */
routerDiretoresFilmes.get("/diretorFilme/:idFilme/:idDiretor", async (req, res) => {
  const { idFilme, idDiretor } = req.params;
  try {
    const resultado = await buscarRelacaoDeDiretorEFilme(idFilme, idDiretor);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar relação de diretor e filme.",
      codigo: "GET_DIRETOR_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /diretoresFilmes:
 *   post:
 *     summary: Cria uma nova relação entre diretor e filme
 *     tags: [Diretores em filmes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idFilme
 *               - idDiretor
 *             properties:
 *               idFilme:
 *                 type: integer
 *               idDiretor:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Relação criada com sucesso.
 *       400:
 *         description: Dados inválidos ou relação já existente.
 *       500:
 *         description: Erro interno ao criar a relação.
 */
routerDiretoresFilmes.post("/", verifyToken, isAdmin, validarCriacaoRelacaoDiretorFilme, async (req, res) => {
  const { idFilme, idDiretor } = req.body;

  try {
    const resultado = await adicionarDiretorFilmes(idFilme, idDiretor);
    if (resultado[0].affectedRows > 0) {
      return res.status(201).json({ mensagem: "Relação criada com sucesso." });
    } else {
      return res.status(400).json({ mensagem: "Não foi possível criar a relação." });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar relação entre diretor e filme.",
      codigo: "ADD_DIRETOR_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /diretoresFilmes/filme/{idFilme}:
 *   delete:
 *     summary: Deleta todas as relações de um filme
 *     tags: [Diretores em filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relações deletadas com sucesso.
 *       404:
 *         description: Nenhuma relação encontrada para o filme.
 *       500:
 *         description: Erro interno ao deletar as relações.
 */
routerDiretoresFilmes.delete("/filme/:idFilme", verifyToken, isAdmin, async (req, res) => {
  const { idFilme } = req.params;
  try {
    const resultado = await deletarDiretorFilmesByFilme(idFilme);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Nenhuma relação encontrada para o filme.",
        codigo: "FILME_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Relações do filme deletadas com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar relações do filme.",
      codigo: "DELETE_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /diretoresFilmes/diretor/{idDiretor}:
 *   delete:
 *     summary: Deleta todas as relações de um diretor
 *     tags: [Diretores em filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idDiretor
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relações deletadas com sucesso.
 *       404:
 *         description: Nenhuma relação encontrada para o diretor.
 *       500:
 *         description: Erro interno ao deletar as relações.
 */
routerDiretoresFilmes.delete("/diretor/:idDiretor", verifyToken, isAdmin, async (req, res) => {
  const { idDiretor } = req.params;
  try {
    const resultado = await deletarDiretorFilmesByDiretor(idDiretor);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Nenhuma relação encontrada para o diretor.",
        codigo: "DIRETOR_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Relações do diretor deletadas com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar relações do diretor.",
      codigo: "DELETE_DIRETOR_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /diretoresFilmes/diretorFilme/{idFilme}/{idDiretor}:
 *   delete:
 *     summary: Deleta uma relação específica entre um diretor e um filme
 *     tags: [Diretores em filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idDiretor
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relação deletada com sucesso.
 *       404:
 *         description: Relação não encontrada.
 *       500:
 *         description: Erro interno ao deletar a relação.
 */
routerDiretoresFilmes.delete("/diretorFilme/:idFilme/:idDiretor", verifyToken, isAdmin, async (req, res) => {
  const { idFilme, idDiretor } = req.params;
  try {
    const resultado = await deletarDiretorFilmesByFilmeAndDiretor(idFilme, idDiretor);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Relação entre diretor e filme não encontrada.",
        codigo: "RELACAO_NOT_FOUND",
      });
    }
    return res.status(200).json({
      mensagem: "Relação entre diretor e filme deletada com sucesso.",
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar relação entre diretor e filme.",
      codigo: "DELETE_RELACAO_ERROR",
      erro: error.message,
    });
  }
});

export default routerDiretoresFilmes;
