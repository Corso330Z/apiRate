import express from "express";
import {
  buscarGenerosDoFilme,
  buscarGenerosFilmes,
  buscarFilmesDoGenero,
  buscarRelacaoDeGeneroEFilme,
} from "../servicos/generosFilmes/busca.js";

import {
  deletarGeneroFilmesByGenero,
  deletarGeneroFilmesByFilme,
  deletarGeneroFilmesByFilmeAndGenero,
} from "../servicos/generosFilmes/deletar.js";

import { adicionarGeneroFilmes } from "../servicos/generosFilmes/adicionar.js";

import { validarCriacaoRelacaoGeneroFilme } from "../validacao/validacaoGenerosFilmes.js";

import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js";

const routerGenerosFilmes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gêneros em filmes
 *   description: Endpoints para gerenciar relações entre gêneros e filmes
 */

/**
 * @swagger
 * /generosFilmes:
 *   get:
 *     summary: Lista todas as relações entre gêneros e filmes
 *     tags: [Gêneros em filmes]
 *     responses:
 *       200:
 *         description: Relações encontradas com sucesso.
 *       500:
 *         description: Erro interno ao buscar as relações.
 */
routerGenerosFilmes.get("/", async (req, res) => {
  try {
    const resultado = await buscarGenerosFilmes();
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar as relações entre gêneros e filmes.",
      codigo: "GET_GENEROS_FILMES_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /generosFilmes/genero/{idGenero}:
 *   get:
 *     summary: Lista todos os filmes associados a um gênero
 *     tags: [Gêneros em filmes]
 *     parameters:
 *       - in: path
 *         name: idGenero
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gênero
 *     responses:
 *       200:
 *         description: Relações encontradas com sucesso.
 *       500:
 *         description: Erro interno ao buscar os filmes do gênero.
 */
routerGenerosFilmes.get("/genero/:idGenero", async (req, res) => {
  const { idGenero } = req.params;
  try {
    const resultado = await buscarFilmesDoGenero(idGenero);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar filmes do gênero.",
      codigo: "GET_FILMES_GENERO_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /generosFilmes/filme/{idFilme}:
 *   get:
 *     summary: Lista todos os gêneros de um filme
 *     tags: [Gêneros em filmes]
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
 *         description: Erro interno ao buscar os gêneros do filme.
 */
routerGenerosFilmes.get("/filme/:idFilme", async (req, res) => {
  const { idFilme } = req.params;
  try {
    const resultado = await buscarGenerosDoFilme(idFilme);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar gêneros do filme.",
      codigo: "GET_GENEROS_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /generosFilmes/generoFilme/{idFilme}/{idGenero}:
 *   get:
 *     summary: Busca uma relação específica entre um gênero e um filme
 *     tags: [Gêneros em filmes]
 *     parameters:
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idGenero
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relação encontrada.
 *       500:
 *         description: Erro interno ao buscar a relação.
 */
routerGenerosFilmes.get("/generoFilme/:idFilme/:idGenero", async (req, res) => {
  const { idFilme, idGenero } = req.params;
  try {
    const resultado = await buscarRelacaoDeGeneroEFilme(idFilme, idGenero);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar relação de gênero e filme.",
      codigo: "GET_GENERO_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /generosFilmes:
 *   post:
 *     summary: Cria uma nova relação entre gênero e filme
 *     tags: [Gêneros em filmes]
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
 *               - idGenero
 *             properties:
 *               idFilme:
 *                 type: integer
 *               idGenero:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Relação criada com sucesso.
 *       400:
 *         description: Dados inválidos ou relação já existente.
 *       500:
 *         description: Erro interno ao criar a relação.
 */
routerGenerosFilmes.post("/", async (req, res) => {
  const { idFilme, idGenero } = req.body;

  try {
    const resultado = await adicionarGeneroFilmes(idFilme, idGenero);
    if (resultado[0].affectedRows > 0) {
      return res.status(201).json({ mensagem: "Relação criada com sucesso." });
    } else {
      return res.status(400).json({ mensagem: "Não foi possível criar a relação." });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar relação entre gênero e filme.",
      codigo: "ADD_GENERO_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /generosFilmes/filme/{idFilme}:
 *   delete:
 *     summary: Deleta todas as relações de um filme
 *     tags: [Gêneros em filmes]
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
routerGenerosFilmes.delete("/filme/:idFilme", verifyToken, isAdmin, async (req, res) => {
  const { idFilme } = req.params;
  try {
    const resultado = await deletarGeneroFilmesByFilme(idFilme);
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
 * /generosFilmes/genero/{idGenero}:
 *   delete:
 *     summary: Deleta todas as relações de um gênero
 *     tags: [Gêneros em filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idGenero
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relações deletadas com sucesso.
 *       404:
 *         description: Nenhuma relação encontrada para o gênero.
 *       500:
 *         description: Erro interno ao deletar as relações.
 */
routerGenerosFilmes.delete("/genero/:idGenero", verifyToken, isAdmin, async (req, res) => {
  const { idGenero } = req.params;
  try {
    const resultado = await deletarGeneroFilmesByGenero(idGenero);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Nenhuma relação encontrada para o gênero.",
        codigo: "GENERO_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Relações do gênero deletadas com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar relações do gênero.",
      codigo: "DELETE_GENERO_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /generosFilmes/generoFilme/{idFilme}/{idGenero}:
 *   delete:
 *     summary: Deleta uma relação específica entre um gênero e um filme
 *     tags: [Gêneros em filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idGenero
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
routerGenerosFilmes.delete("/generoFilme/:idFilme/:idGenero", verifyToken, isAdmin, async (req, res) => {
  const { idFilme, idGenero } = req.params;
  try {
    const resultado = await deletarGeneroFilmesByFilmeAndGenero(idFilme, idGenero);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Relação entre gênero e filme não encontrada.",
        codigo: "RELACAO_NOT_FOUND",
      });
    }
    return res.status(200).json({
      mensagem: "Relação entre gênero e filme deletada com sucesso.",
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar relação entre gênero e filme.",
      codigo: "DELETE_RELACAO_ERROR",
      erro: error.message,
    });
  }
});

export default routerGenerosFilmes;
