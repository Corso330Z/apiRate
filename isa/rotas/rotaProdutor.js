import express from "express"
import { adicionarProdutor } from "../servicos/produtor/adicionar.js";
import { buscarProdutorPorId, buscarProdutoresPorNome, buscarProdutores } from "../servicos/produtor/buscar.js";
import { editarProdutorPut } from "../servicos/produtor/editar.js";
import { deletarProdutor } from "../servicos/produtor/deletar.js";
import { validarProdutorCompleto, validarProdutorParcial } from "../validacao/validacaoProdutor.js";
const routerProdutor = express.Router();

import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js"



/**
 * @swagger
 * tags:
 *   name: Produtores
 *   description: Endpoints para gerenciamento de produtores
 */

/**
 * @swagger
 * /produtores:
 *   post:
 *     summary: Adiciona um novo produtor
 *     tags: [Produtores]
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
 *         description: Produtor adicionado com sucesso
 *       400:
 *         description: Erro de validação dos dados
 *       500:
 *         description: Erro interno ao adicionar o produtor
 */
routerProdutor.post("/", verifyToken, isAdmin, async (req, res) => {
  const { nome } = req.body;

  const { valido, erros } = await validarProdutorCompleto(nome);

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    await adicionarProdutor(nome);
    return res.status(201).json({ mensagem: "Produtor adicionado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao adicionar produtor.",
      codigo: "ADD_PRODUTOR_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /produtores/{id}:
 *   put:
 *     summary: Atualiza completamente um produtor
 *     tags: [Produtores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produtor
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
 *         description: Produtor atualizado com sucesso
 *       400:
 *         description: Erro de validação dos dados
 *       404:
 *         description: Produtor não encontrado
 *       500:
 *         description: Erro interno ao atualizar o produtor
 */
routerProdutor.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;


  const { valido, erros } = await validarProdutorCompleto(nome);

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await editarProdutorPut(nome, id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Produtor não encontrado.",
        codigo: "PRODUTOR_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Produtor atualizado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar produtor.",
      codigo: "UPDATE_PRODUTOR_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /produtores:
 *   get:
 *     summary: Lista todos os produtores ou busca por nome
 *     tags: [Produtores]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Nome do produtor para busca
 *     responses:
 *       200:
 *         description: Lista de produtores retornada com sucesso
 *       500:
 *         description: Erro ao buscar os produtores
 */
routerProdutor.get("/", async (req, res) => {
  const { nome } = req.query;

  try {
    const resultado = nome
      ? await buscarProdutoresPorNome(nome)
      : await buscarProdutores();

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar produtores.",
      codigo: "GET_PRODUTORES_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /produtores/{id}:
 *   get:
 *     summary: Busca um produtor pelo ID
 *     tags: [Produtores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produtor
 *     responses:
 *       200:
 *         description: Produtor encontrado com sucesso
 *       404:
 *         description: Produtor não encontrado
 *       500:
 *         description: Erro ao buscar o produtor
 */
routerProdutor.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarProdutorPorId(id);

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({
        mensagem: "Produtor não encontrado.",
        codigo: "PRODUTOR_NOT_FOUND"
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar o produtor.",
      codigo: "GET_PRODUTOR_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /produtores/{id}:
 *   delete:
 *     summary: Deleta um produtor pelo ID
 *     tags: [Produtores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produtor
 *     responses:
 *       200:
 *         description: Produtor deletado com sucesso
 *       404:
 *         description: Produtor não encontrado
 *       500:
 *         description: Erro ao deletar o produtor
 */
routerProdutor.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await deletarProdutor(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Produtor não encontrado.",
        codigo: "PRODUTOR_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Produtor deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar produtor.",
      codigo: "DELETE_PRODUTOR_ERROR",
      erro: error.message
    });
  }
});


export default routerProdutor