import express from "express";
import {
  buscarProdutoresDoFilme,
  buscarProdutorFilmes,
  buscarFilmesDoProdutor,
  buscarRelacaoDeProdutorEFilme,
} from "../servicos/produtorFilmes/busca.js";

import {
  deletarProdutorFilmesByAtor,
  deletarProdutorFilmesByFilme,
  deletarProdutorFilmesByFilmeAndAtor,
} from "../servicos/produtorFilmes/deletar.js";

import { adicionarAtorFilmes } from "../servicos/produtorFilmes/adicionar.js";

import { validarCriacaoRelacaoProdutorFilme } from "../validacao/validacaoProdutorFilmes.js";

import {verifyToken, isAdmin} from "../../middlewares/verifyToken.js"

const routerProdutorFilmes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Produtores em filmes
 *   description: Endpoints para gerenciar relações entre produtores e filmes
 */

/**
 * @swagger
 * /produtorFilmes:
 *   get:
 *     summary: Lista todas as relações entre produtores e filmes
 *     tags: [Produtores em filmes]
 *     responses:
 *       200:
 *         description: Relações encontradas com sucesso.
 *       500:
 *         description: Erro interno ao buscar as relações.
 */
routerProdutorFilmes.get("/", async (req, res) => {
  try {
    const resultado = await buscarProdutorFilmes();
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar as relações entre produtores e filmes.",
      codigo: "GET_PRODUTOR_FILMES_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /produtorFilmes/produtor/{idProdutor}:
 *   get:
 *     summary: Lista todos os filmes de um produtor
 *     tags: [Produtores em filmes]
 *     parameters:
 *       - in: path
 *         name: idProdutor
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produtor
 *     responses:
 *       200:
 *         description: Relações encontradas com sucesso.
 *       500:
 *         description: Erro interno ao buscar os filmes do produtor.
 */
routerProdutorFilmes.get("/produtor/:idProdutor", async (req, res) => {
  const { idProdutor } = req.params;
  try {
    const resultado = await buscarFilmesDoProdutor(idProdutor);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar filmes do produtor.",
      codigo: "GET_FILMES_PRODUTOR_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /produtorFilmes/filme/{idFilme}:
 *   get:
 *     summary: Lista todos os produtores de um filme
 *     tags: [Produtores em filmes]
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
 *         description: Erro interno ao buscar os produtores do filme.
 */
routerProdutorFilmes.get("/filme/:idFilme", async (req, res) => {
  const { idFilme } = req.params;
  try {
    const resultado = await buscarProdutoresDoFilme(idFilme);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar produtores do filme.",
      codigo: "GET_PRODUTORES_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /produtorFilmes/produtorFilme/{idFilme}/{idProdutor}:
 *   get:
 *     summary: Busca uma relação específica entre um produtor e um filme
 *     tags: [Produtores em filmes]
 *     parameters:
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idProdutor
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relação encontrada.
 *       500:
 *         description: Erro interno ao buscar a relação.
 */
routerProdutorFilmes.get("/produtorFilme/:idFilme/:idProdutor", async (req, res) => {
  const { idFilme, idProdutor } = req.params;
  try {
    const resultado = await buscarRelacaoDeProdutorEFilme(idFilme, idProdutor);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar relação de produtor e filme.",
      codigo: "GET_PRODUTOR_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /produtorFilmes:
 *   post:
 *     summary: Cria uma nova relação entre produtor e filme
 *     tags: [Produtores em filmes]
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
 *               - idProdutor
 *             properties:
 *               idFilme:
 *                 type: integer
 *               idProdutor:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Relação criada com sucesso.
 *       400:
 *         description: Dados inválidos ou relação já existente.
 *       500:
 *         description: Erro interno ao criar a relação.
 */
routerProdutorFilmes.post("/", async (req, res) => {
  const { idFilme, idProdutor } = req.body;

  try {
    const resultado = await adicionarAtorFilmes(idFilme, idProdutor);
    if (resultado.affectedRows == 0) {
      return res.status(400).json({ mensagem: "Não foi possível criar a relação." });
    } 
    return res.status(201).json({ mensagem: "Relação criada com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar relação entre produtor e filme.",
      codigo: "ADD_PRODUTOR_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /produtorFilmes/filme/{idFilme}:
 *   delete:
 *     summary: Deleta todas as relações de um filme
 *     tags: [Produtores em filmes]
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
routerProdutorFilmes.delete("/filme/:idFilme", verifyToken, isAdmin, async (req, res) => {
  const { idFilme } = req.params;
  try {
    const resultado = await deletarProdutorFilmesByFilme(idFilme);
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
 * /produtorFilmes/produtor/{idProdutor}:
 *   delete:
 *     summary: Deleta todas as relações de um produtor
 *     tags: [Produtores em filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idProdutor
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relações deletadas com sucesso.
 *       404:
 *         description: Nenhuma relação encontrada para o produtor.
 *       500:
 *         description: Erro interno ao deletar as relações.
 */
routerProdutorFilmes.delete("/produtor/:idProdutor", verifyToken, isAdmin, async (req, res) => {
  const { idProdutor } = req.params;
  try {
    const resultado = await deletarProdutorFilmesByAtor(idProdutor);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Nenhuma relação encontrada para o produtor.",
        codigo: "PRODUTOR_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Relações do produtor deletadas com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar relações do produtor.",
      codigo: "DELETE_PRODUTOR_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /produtorFilmes/{idFilme}/{idProdutor}:
 *   delete:
 *     summary: Deleta a relação específica entre um produtor e um filme
 *     tags: [Produtores em filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idProdutor
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
routerProdutorFilmes.delete("/:idFilme/:idProdutor", verifyToken, isAdmin, async (req, res) => {
  const { idFilme, idProdutor } = req.params;
  try {
    const resultado = await deletarProdutorFilmesByFilmeAndAtor(idFilme, idProdutor);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Relação entre produtor e filme não encontrada.",
        codigo: "RELATION_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Relação deletada com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar relação entre produtor e filme.",
      codigo: "DELETE_RELATION_ERROR",
      erro: error.message,
    });
  }
});

export default routerProdutorFilmes;
