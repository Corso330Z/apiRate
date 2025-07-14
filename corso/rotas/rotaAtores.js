import express from "express";
import upload from '../../middlewares/upload.js';
import { adicionarAtor } from "../servicos/atores/adicionar.js";
import { buscarAtorPorId, buscarAtorPorNome, buscarAtor, buscarImagensAtorPorId } from "../servicos/atores/buscar.js";
import { deletarAtor } from "../servicos/atores/deletar.js";
import { atualizarAtorPut, atualizarAtorPatch } from "../servicos/atores/atualizar.js";
import { validarAtorCompleto, validarAtorParcial } from "../validacao/validacaoAtores.js";
import { deletarAtoresFilmesByAtor } from "../servicos/atoresFilmes/deletar.js";


import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js";
const routerAtores = express.Router();

/**
 * @swagger
 * tags:
 *   name: Atores
 *   description: Endpoints para gerenciamento de atores
 */


/**
 * @swagger
 * /atores:
 *   post:
 *     summary: Adiciona um novo ator
 *     tags: [Atores]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - dataNasc
 *               - vivo
 *               - fotoAtor
 *             properties:
 *               nome:
 *                 type: string
 *               dataNasc:
 *                 type: string
 *                 format: date
 *               vivo:
 *                 type: boolean
 *               fotoAtor:
 *                 type: string
 *                 format: binary
 *               dataObito:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Ator adicionado com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno no servidor
 */
routerAtores.post("/", upload.single('fotoAtor'), async (req, res) => {
  let { nome, dataNasc, dataObito, vivo } = req.body;
  vivo = vivo === 'true' || vivo === true ? 1 : 0;
  const fotoAtor = req.file ? req.file.buffer : null;

  const { valido, erros } = await validarAtorCompleto(nome, dataNasc, vivo );

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await adicionarAtor(nome, dataNasc, dataObito, vivo, fotoAtor);
    //console.log(resultado)
    if (resultado[0].affectedRows > 0) {
      return res.status(201).json({ mensagem: "Ator adicionado com sucesso." });
    } else {
      return res.status(404).json({ mensagem: "Não foi possivel, adicionar ator." });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao adicionar ator.",
      codigo: "ADD_ATOR_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /atores/{id}:
 *   put:
 *     summary: Atualiza completamente um ator
 *     tags: [Atores]
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ator
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - dataNasc
 *               - vivo
  *               - fotoAtor
 *             properties:
 *               nome:
 *                 type: string
 *               dataNasc:
 *                 type: string
 *                 format: date
 *               vivo:
 *                 type: boolean
 *               fotoAtor:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Ator atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Ator não encontrado
 *       500:
 *         description: Erro interno no servidor
 */

routerAtores.put("/:id", verifyToken, isAdmin, upload.single('fotoAtor'), async (req, res) => {
  const { id } = req.params;
  let { nome, dataNasc, vivo } = req.body;
  vivo = vivo === 'true' || vivo === true ? 1 : 0;
  const fotoAtor = req.file ? req.file.buffer : null;
  const { valido, erros } = await validarAtorCompleto({ nome, dataNasc, vivo });

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await atualizarAtorPut(nome, dataNasc, vivo, fotoAtor, id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Ator não encontrado.",
        codigo: "ATOR_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Ator atualizado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar ator.",
      codigo: "UPDATE_ATOR_ERROR",
      erro: error.message
    });
  }
});


/**
 * @swagger
 * /atores/{id}:
 *   patch:
 *     summary: Atualiza parcialmente os dados de um ator
 *     tags: [Atores]
 *     consumes:
 *       - multipart/form-data
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ator
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               dataNasc:
 *                 type: string
 *                 format: date
 *               vivo:
 *                 type: boolean
 *               fotoAtor:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Ator atualizado com sucesso
 *       400:
 *         description: Erro de validação ou dados ausentes
 *       404:
 *         description: Ator não encontrado
 *       500:
 *         description: Erro interno no servidor
 */

routerAtores.patch("/:id", verifyToken, isAdmin, upload.single('fotoAtor'), async (req, res) => {
  const { id } = req.params;
  let { nome, dataNasc, vivo } = req.body;
  vivo = vivo === 'true' || vivo === true ? 1 : 0;
  const fotoAtor = req.file ? req.file.buffer : null;
  const camposAtualizar = {};
  if (nome) camposAtualizar.nome = nome;
  if (dataNasc) camposAtualizar.dataNasc = dataNasc;
  if (vivo) camposAtualizar.vivo = vivo;
  if (fotoAtor) camposAtualizar.fotoAtor = fotoAtor;

  if (Object.keys(camposAtualizar).length === 0) {
    return res.status(400).json({
      mensagem: "Nenhum dado enviado para atualização.",
      codigo: "NO_UPDATE_DATA"
    });
  }
  const { valido, erros } = validarAtorParcial(camposAtualizar);
  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados parciais.",
      codigo: "PARTIAL_VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await atualizarAtorPatch(id, camposAtualizar);

    if (resultado.affectedRows > 0) {
      return res.status(200).json({ mensagem: "Ator atualizado com sucesso." });
    } else {
      return res.status(404).json({
        mensagem: "Ator não encontrado.",
        codigo: "ATOR_NOT_FOUND"
      });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar ator.",
      codigo: "UPDATE_ATOR_ERROR",
      erro: error.message
    });
  }
});


/**
 * @swagger
 * /atores:
 *   get:
 *     summary: Lista todos os atores ou busca por nome
 *     tags: [Atores]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Nome do ator para busca
 *     responses:
 *       200:
 *         description: Lista de atores
 *       500:
 *         description: Erro ao buscar atores
 */

routerAtores.get("/", async (req, res) => {
  const { nome } = req.query;

  try {
    const resultado = nome
      ? await buscarAtorPorNome(nome)
      : await buscarAtor();

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar atores.",
      codigo: "GET_ATORES_ERROR",
      erro: error.message
    });
  }
});


/**
 * @swagger
 * /atores/{id}:
 *   get:
 *     summary: Retorna os dados de um ator pelo ID
 *     tags: [Atores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ator
 *     responses:
 *       200:
 *         description: Dados do ator
 *       404:
 *         description: Ator não encontrado
 *       500:
 *         description: Erro ao buscar o ator
 */

routerAtores.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarAtorPorId(id);

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({
        mensagem: "Ator não encontrado.",
        codigo: "ATOR_NOT_FOUND"
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar o ator.",
      codigo: "GET_ATOR_ERROR",
      erro: error.message
    });
  }
});


/**
 * @swagger
 * /atores/fotoAtor/{id}:
 *   get:
 *     summary: Retorna a imagem (foto) de um ator
 *     tags: [Atores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ator
 *     responses:
 *       200:
 *         description: Imagem retornada com sucesso
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Imagem não encontrada
 *       500:
 *         description: Erro ao buscar imagem
 */

routerAtores.get("/fotoAtor/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await buscarImagensAtorPorId(id);

    if (!resultado || !resultado.fotoAtor) {
      return res.status(404).json({
        mensagem: "Imagem não encontrada.",
        codigo: "IMAGE_NOT_FOUND"
      });
    }

    res.set("Content-Type", "image/jpeg"); // Ajuste o tipo real se necessário
    return res.send(resultado.fotoAtor);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar imagem do ator.",
      codigo: "GET_IMAGE_ERROR",
      erro: error.message
    });
  }
});


/**
 * @swagger
 * /atores/{id}:
 *   delete:
 *     summary: Remove um ator pelo ID
 *     tags: [Atores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ator
 *     responses:
 *       200:
 *         description: Ator deletado com sucesso
 *       404:
 *         description: Ator não encontrado
 *       500:
 *         description: Erro ao deletar ator
 */

routerAtores.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await deletarAtoresFilmesByAtor(id)
    const resultado = await deletarAtor(id);
    //console.log(resultado)
    if (resultado.affectedRows == 0) {
      return res.status(404).json({
        mensagem: "Ator não encontrado.",
        codigo: "ATOR_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Ator deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar ator. Esse ator pode estar sendo usado.",
      codigo: "DELETE_ATOR_ERROR",
      erro: error.message
    });
  }
});


export default routerAtores;