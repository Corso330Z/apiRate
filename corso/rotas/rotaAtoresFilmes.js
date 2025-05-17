import express from "express";
import {
  buscarAtoresDoFilme,
  buscarAtoresFilmes,
  buscarFilmesDoAtor,
  buscarRelacaoDeAtorEFilme,
} from "../servicos/atoresFilmes/busca.js";

import {
  deletarAtoresFilmesByAtor,
  deletarAtoresFilmesByFilme,
  deletarAtoresFilmesByFilmeAndAtor,
} from "../servicos/atoresFilmes/deletar.js";

import { adicionarAtorFilmes } from "../servicos/atoresFilmes/adicionar.js";

import { validarCriacaoRelacaoAtorFilme } from "../validacao/validacaoAtoresFilmes.js";


const routerAtoresFilmes = express.Router();

/**
 * @swagger
 * tags:
 *   name: AtoresFilmes
 *   description: Endpoints para gerenciar relações entre atores e filmes
 */


/**
 * @swagger
 * /atoresFilmes:
 *   get:
 *     summary: Lista todas as relações entre atores e filmes
 *     tags: [AtoresFilmes]
 *     responses:
 *       200:
 *         description: Relações encontradas com sucesso.
 *       500:
 *         description: Erro interno ao buscar as relações.
 */
routerAtoresFilmes.get("/", async (req, res) => {
  try {
    const resultado = await buscarAtoresFilmes();
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar as relações entre atores e filmes.",
      codigo: "GET_ATORES_FILMES_ERROR",
      erro: error.message,
    });
  }
});



/**
 * @swagger
 * /atoresFilmes/ator/{idAtor}:
 *   get:
 *     summary: Lista todos os filmes em que um ator participou
 *     tags: [AtoresFilmes]
 *     parameters:
 *       - in: path
 *         name: idAtor
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ator
 *     responses:
 *       200:
 *         description: Relações encontradas com sucesso.
 *       500:
 *         description: Erro interno ao buscar os filmes do ator.
 */
routerAtoresFilmes.get("/ator/:idAtor", async (req, res) => {
  const { idAtor } = req.params;
  try {
    const resultado = await buscarFilmesDoAtor(idAtor);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar filmes do ator.",
      codigo: "GET_FILMES_ATOR_ERROR",
      erro: error.message,
    });
  }
});


/**
 * @swagger
 * /atoresFilmes/filme/{idFilme}:
 *   get:
 *     summary: Lista todos os atores que participaram de um filme
 *     tags: [AtoresFilmes]
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
 *         description: Erro interno ao buscar os atores do filme.
 */
routerAtoresFilmes.get("/filme/:idFilme", async (req, res) => {
  const { idFilme } = req.params;
  try {
    const resultado = await buscarAtoresDoFilme(idFilme);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar atores do filme.",
      codigo: "GET_ATORES_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /atoresFilmes/atorFilme/{idFilme}/{idAtor}:
 *   get:
 *     summary: Busca uma relação específica entre um ator e um filme
 *     tags: [AtoresFilmes]
 *     parameters:
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idAtor
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relação encontrada.
 *       500:
 *         description: Erro interno ao buscar a relação.
 */
routerAtoresFilmes.get("/atorFilme/:idFilme/:idAtor", async (req, res) => {
  const { idFilme, idAtor } = req.params;
  try {
    const resultado = await buscarRelacaoDeAtorEFilme(idFilme, idAtor);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar relação de ator e filme.",
      codigo: "GET_ATOR_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /atoresFilmes:
 *   post:
 *     summary: Cria uma nova relação entre ator e filme
 *     tags: [AtoresFilmes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idFilme
 *               - idAtor
 *             properties:
 *               idFilme:
 *                 type: integer
 *               idAtor:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Relação criada com sucesso.
 *       400:
 *         description: Dados inválidos ou relação já existente.
 *       500:
 *         description: Erro interno ao criar a relação.
 */
routerAtoresFilmes.post("/", validarCriacaoRelacaoAtorFilme, async (req, res) => {
  const { idFilme, idAtor } = req.body;

  try {
    const resultado = await adicionarAtorFilmes(idFilme, idAtor);
    if (resultado[0].affectedRows > 0) {
      return res.status(201).json({ mensagem: "Relação criada com sucesso." });
    } else {
      return res.status(400).json({ mensagem: "Não foi possível criar a relação." });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar relação entre ator e filme.",
      codigo: "ADD_ATOR_FILME_ERROR",
      erro: error.message,
    });
  }
});


/**
 * @swagger
 * /atoresFilmes/filme/{idFilme}:
 *   delete:
 *     summary: Deleta todas as relações de um filme
 *     tags: [AtoresFilmes]
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
routerAtoresFilmes.delete("/filme/:idFilme", async (req, res) => {
  const { idFilme } = req.params;
  try {
    const resultado = await deletarAtoresFilmesByFilme(idFilme);
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
 * /atoresFilmes/ator/{idAtor}:
 *   delete:
 *     summary: Deleta todas as relações de um ator
 *     tags: [AtoresFilmes]
 *     parameters:
 *       - in: path
 *         name: idAtor
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relações deletadas com sucesso.
 *       404:
 *         description: Nenhuma relação encontrada para o ator.
 *       500:
 *         description: Erro interno ao deletar as relações.
 */
routerAtoresFilmes.delete("/ator/:idAtor", async (req, res) => {
  const { idAtor } = req.params;
  try {
    const resultado = await deletarAtoresFilmesByAtor(idAtor);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Nenhuma relação encontrada para o ator.",
        codigo: "ATOR_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Relações do ator deletadas com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar relações do ator.",
      codigo: "DELETE_ATOR_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /atoresFilmes/atorFilme/{idFilme}/{idAtor}:
 *   delete:
 *     summary: Deleta uma relação específica entre um ator e um filme
 *     tags: [AtoresFilmes]
 *     parameters:
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idAtor
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
routerAtoresFilmes.delete("/atorFilme/:idFilme/:idAtor", async (req, res) => {
  const { idFilme, idAtor } = req.params;
  try {
    const resultado = await deletarAtoresFilmesByFilmeAndAtor(idFilme, idAtor);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Relação entre ator e filme não encontrada.",
        codigo: "RELACAO_NOT_FOUND",
      });
    }
    return res.status(200).json({
      mensagem: "Relação entre ator e filme deletada com sucesso.",
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar relação entre ator e filme.",
      codigo: "DELETE_RELACAO_ERROR",
      erro: error.message,
    });
  }
});

export default routerAtoresFilmes;
