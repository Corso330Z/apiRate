import express from "express"
import { adicionarDiretor } from "../servicos/diretor/adicionar.js";
import { buscarDiretorPorId, buscarDiretoresPorNome, buscarDiretores } from "../servicos/diretor/buscar.js";
import { editarDiretorPut } from "../servicos/diretor/editar.js";
import { deletarDiretor } from "../servicos/diretor/deletar.js";
import { validarDiretorCompleto, validarDiretorParcial } from "../validacao/validacaoDiretor.js";
const routerDiretor = express.Router();

import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js"

/**
 * @swagger
 * tags:
 *   name: Diretores
 *   description: Endpoints para gerenciamento de diretores
 */

/**
 * @swagger
 * /diretores:
 *   post:
 *     summary: Adiciona um novo diretor
 *     tags: [Diretores]
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
 *         description: Diretor adicionado com sucesso
 *       400:
 *         description: Erro de validação dos dados
 *       500:
 *         description: Erro interno ao adicionar o diretor
 */
routerDiretor.post("/", verifyToken, isAdmin, async (req, res) => {
  const { nome } = req.body;

  const { valido, erros } = await validarDiretorCompleto(nome);

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    await adicionarDiretor(nome);
    return res.status(201).json({ mensagem: "Diretor adicionado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao adicionar diretor.",
      codigo: "ADD_DIRETOR_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /diretores/{id}:
 *   put:
 *     summary: Atualiza completamente um diretor
 *     tags: [Diretores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do diretor
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
 *         description: Diretor atualizado com sucesso
 *       400:
 *         description: Erro de validação dos dados
 *       404:
 *         description: Diretor não encontrado
 *       500:
 *         description: Erro interno ao atualizar o diretor
 */
routerDiretor.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  const { valido, erros } = await validarDiretorParcial(nome);

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await editarDiretorPut(nome, id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Diretor não encontrado.",
        codigo: "DIRETOR_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Diretor atualizado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar diretor.",
      codigo: "UPDATE_DIRETOR_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /diretores:
 *   get:
 *     summary: Lista todos os diretores ou busca por nome
 *     tags: [Diretores]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Nome do diretor para busca
 *     responses:
 *       200:
 *         description: Lista de diretores retornada com sucesso
 *       500:
 *         description: Erro ao buscar os diretores
 */
routerDiretor.get("/", async (req, res) => {
  const { nome } = req.query;

  try {
    const resultado = nome
      ? await buscarDiretoresPorNome(nome)
      : await buscarDiretores();

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar diretores.",
      codigo: "GET_DIRETORES_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /diretores/{id}:
 *   get:
 *     summary: Busca um diretor pelo ID
 *     tags: [Diretores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do diretor
 *     responses:
 *       200:
 *         description: Diretor encontrado com sucesso
 *       404:
 *         description: Diretor não encontrado
 *       500:
 *         description: Erro ao buscar o diretor
 */
routerDiretor.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarDiretorPorId(id);

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({
        mensagem: "Diretor não encontrado.",
        codigo: "DIRETOR_NOT_FOUND"
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar o diretor.",
      codigo: "GET_DIRETOR_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /diretores/{id}:
 *   delete:
 *     summary: Deleta um diretor pelo ID
 *     tags: [Diretores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do diretor
 *     responses:
 *       200:
 *         description: Diretor deletado com sucesso
 *       404:
 *         description: Diretor não encontrado
 *       500:
 *         description: Erro ao deletar o diretor
 */
routerDiretor.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await deletarDiretor(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Diretor não encontrado.",
        codigo: "DIRETOR_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Diretor deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar diretor.",
      codigo: "DELETE_DIRETOR_ERROR",
      erro: error.message
    });
  }
});

export default routerDiretor
