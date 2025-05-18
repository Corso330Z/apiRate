import express from "express"
import { adicionarGenero } from "../servicos/genero/adicionar.js";
import { buscarGeneroPorId, buscarGenerosPorNome, buscarGeneros } from "../servicos/genero/buscar.js";
import { editarGeneroPut } from "../servicos/genero/editar.js";
import { deletarGenero } from "../servicos/genero/deletar.js";
import { validarGeneroCompleto, validarGeneroParcial } from "../validacao/validacaoGenero.js";
const routerGenero = express.Router();

import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js"

/**
 * @swagger
 * tags:
 *   name: Gêneros
 *   description: Endpoints para gerenciamento de gêneros
 */

/**
 * @swagger
 * /generos:
 *   post:
 *     summary: Adiciona um novo gênero
 *     tags: [Gêneros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gênero adicionado com sucesso
 *       400:
 *         description: Erro de validação dos dados
 *       500:
 *         description: Erro interno ao adicionar o gênero
 */
routerGenero.post("/", verifyToken, isAdmin, async (req, res) => {
  const { nome } = req.body;

  const { valido, erros } = await validarGeneroCompleto(nome);

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    await adicionarGenero(nome);
    return res.status(201).json({ mensagem: "Gênero adicionado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao adicionar gênero.",
      codigo: "ADD_GENERO_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /generos/{id}:
 *   put:
 *     summary: Atualiza completamente um gênero
 *     tags: [Gêneros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gênero
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gênero atualizado com sucesso
 *       400:
 *         description: Erro de validação dos dados
 *       404:
 *         description: Gênero não encontrado
 *       500:
 *         description: Erro interno ao atualizar o gênero
 */
routerGenero.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  const { valido, erros } = await validarGeneroCompleto(nome);

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await editarGeneroPut(nome, id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Gênero não encontrado.",
        codigo: "GENERO_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Gênero atualizado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar gênero.",
      codigo: "UPDATE_GENERO_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /generos:
 *   get:
 *     summary: Lista todos os gêneros ou busca por nome
 *     tags: [Gêneros]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Nome do gênero para busca
 *     responses:
 *       200:
 *         description: Lista de gêneros retornada com sucesso
 *       500:
 *         description: Erro ao buscar os gêneros
 */
routerGenero.get("/", async (req, res) => {
  const { nome } = req.query;

  try {
    const resultado = nome
      ? await buscarGenerosPorNome(nome)
      : await buscarGeneros();

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar gêneros.",
      codigo: "GET_GENEROS_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /generos/{id}:
 *   get:
 *     summary: Busca um gênero pelo ID
 *     tags: [Gêneros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gênero
 *     responses:
 *       200:
 *         description: Gênero encontrado com sucesso
 *       404:
 *         description: Gênero não encontrado
 *       500:
 *         description: Erro ao buscar o gênero
 */
routerGenero.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarGeneroPorId(id);

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({
        mensagem: "Gênero não encontrado.",
        codigo: "GENERO_NOT_FOUND"
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar o gênero.",
      codigo: "GET_GENERO_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /generos/{id}:
 *   delete:
 *     summary: Deleta um gênero pelo ID
 *     tags: [Gêneros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gênero
 *     responses:
 *       200:
 *         description: Gênero deletado com sucesso
 *       404:
 *         description: Gênero não encontrado
 *       500:
 *         description: Erro ao deletar o gênero
 */
routerGenero.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await deletarGenero(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Gênero não encontrado.",
        codigo: "GENERO_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Gênero deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar gênero.",
      codigo: "DELETE_GENERO_ERROR",
      erro: error.message
    });
  }
});

export default routerGenero;
