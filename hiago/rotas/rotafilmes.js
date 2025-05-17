import express from "express";
import upload from '../../middlewares/upload.js';
import { adicionarFilme } from "../servicos/filmes/adicionar.js";
import { buscarFilmePorId, buscarFilmesPorNome, buscarFilmes, buscarImagensFilmePorId } from "../servicos/filmes/buscar.js";
import { deletarFilme } from "../servicos/filmes/deletar.js";
import { editarFilmePut, editarFilmePatch } from "../servicos/filmes/editar.js";
import { validarFilmeCompleto, validarFilmeParcial } from "../validacao/validacaoFilmes.js";

import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js"

const routerFilmes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Filmes
 *   description: Endpoints para gerenciamento de filmes
 */


/**
 * @swagger
 * /filmes:
 *   post:
 *     summary: Adiciona um novo filme
 *     tags: [Filmes]
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
 *               - dataLanc
 *               - sinopse
 *               - classInd
 *             properties:
 *               nome:
 *                 type: string
 *               dataLanc:
 *                 type: string
 *                 format: date
 *               sinopse:
 *                 type: string
 *               classInd:
 *                 type: string
 *               fotoFilme:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Filme adicionado com sucesso
 *       400:
 *         description: Erro de validação dos dados
 *       500:
 *         description: Erro interno ao adicionar filme
 */
routerFilmes.post("/", verifyToken, isAdmin, upload.single('fotoFilme'), async (req, res) => {
  const { nome, dataLanc, sinopse, classInd } = req.body;
  const fotoFilme = req.file ? req.file.buffer : null;

  const { valido, erros } = await validarFilmeCompleto({ nome, dataLanc, sinopse, classInd });

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await adicionarFilme(nome, dataLanc, sinopse, classInd, fotoFilme);
    if (resultado[0].affectedRows > 0) {
      return res.status(201).json({ mensagem: "Filme adicionado com sucesso." });
    } else {
      return res.status(404).json({ mensagem: "Não foi possivel, adicionar filme." });
    }

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao adicionar filme.",
      codigo: "ADD_FILME_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /filmes/{id}:
 *   put:
 *     summary: Atualiza todos os dados de um filme
 *     tags: [Filmes]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - dataLanc
 *               - sinopse
 *               - classInd
 *             properties:
 *               nome:
 *                 type: string
 *               dataLanc:
 *                 type: string
 *                 format: date
 *               sinopse:
 *                 type: string
 *               classInd:
 *                 type: string
 *               fotoFilme:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Filme atualizado com sucesso
 *       400:
 *         description: Erro de validação dos dados
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro ao atualizar filme
 */
routerFilmes.put("/:id", verifyToken, isAdmin, upload.single('fotoFilme'), async (req, res) => {
  const { id } = req.params;
  const { nome, dataLanc, sinopse, classInd } = req.body;
  const fotoFilme = req.file ? req.file.buffer : null;

  const { valido, erros } = await validarFilmeCompleto({ nome, dataLanc, sinopse, classInd });

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await editarFilmePut(nome, dataLanc, sinopse, classInd, fotoFilme, id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Filme não encontrado.",
        codigo: "FILME_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Filme atualizado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar filme.",
      codigo: "UPDATE_FILME_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /filmes/{id}:
 *   patch:
 *     summary: Atualiza parcialmente os dados de um filme
 *     tags: [Filmes]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               dataLanc:
 *                 type: string
 *                 format: date
 *               sinopse:
 *                 type: string
 *               classInd:
 *                 type: string
 *               fotoFilme:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Filme atualizado com sucesso
 *       400:
 *         description: Erro de validação dos dados parciais
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro ao atualizar filme
 */
routerFilmes.patch("/:id", verifyToken, isAdmin, upload.single('fotoFilme'), async (req, res) => {
  const { id } = req.params;
  const { nome, dataLanc, sinopse, classInd } = req.body;
  const fotoFilme = req.file ? req.file.buffer : null;

  const camposAtualizar = {};
  if (nome) camposAtualizar.nome = nome;
  if (dataLanc) camposAtualizar.dataLanc = dataLanc;
  if (sinopse) camposAtualizar.sinopse = sinopse;
  if (classInd) camposAtualizar.classInd = classInd;
  if (fotoFilme) camposAtualizar.fotoFilme = fotoFilme;

  if (Object.keys(camposAtualizar).length === 0) {
    return res.status(400).json({
      mensagem: "Nenhum dado enviado para atualização.",
      codigo: "NO_UPDATE_DATA"
    });
  }

  const { valido, erros } = validarFilmeParcial(camposAtualizar);
  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados parciais.",
      codigo: "PARTIAL_VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await editarFilmePatch(id, camposAtualizar);

    if (resultado.affectedRows > 0) {
      return res.status(200).json({ mensagem: "Filme atualizado com sucesso." });
    } else {
      return res.status(404).json({
        mensagem: "Filme não encontrado.",
        codigo: "FILME_NOT_FOUND"
      });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar filme.",
      codigo: "UPDATE_FILME_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /filmes:
 *   get:
 *     summary: Lista todos os filmes ou busca por nome
 *     tags: [Filmes]
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: false
 *         schema:
 *           type: string
 *         description: Nome do filme para busca
 *     responses:
 *       200:
 *         description: Lista de filmes
 *       500:
 *         description: Erro ao buscar filmes
 */
routerFilmes.get("/", async (req, res) => {
  const { nome } = req.query;

  try {
    const resultado = nome
      ? await buscarFilmesPorNome(nome)
      : await buscarFilmes();

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar filmes.",
      codigo: "GET_FILMES_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /filmes/{id}:
 *   get:
 *     summary: Busca um filme pelo ID
 *     tags: [Filmes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filme encontrado
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro ao buscar o filme
 */
routerFilmes.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarFilmePorId(id);

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({
        mensagem: "Filme não encontrado.",
        codigo: "FILME_NOT_FOUND"
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar o filme.",
      codigo: "GET_FILME_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /filmes/imagem/{id}:
 *   get:
 *     summary: Busca a imagem de um filme pelo ID
 *     tags: [Filmes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retorna a imagem do filme
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Imagem não encontrada
 *       500:
 *         description: Erro ao buscar imagem do filme
 */
routerFilmes.get("/imagem/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await buscarImagensFilmePorId(id);

    if (!resultado || !resultado.fotoFilme) {
      return res.status(404).json({
        mensagem: "Imagem não encontrada.",
        codigo: "IMAGE_NOT_FOUND"
      });
    }

    res.set("Content-Type", "image/jpeg"); // Ajuste o tipo real se necessário
    return res.send(resultado.fotoFilme);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar imagem do filme.",
      codigo: "GET_IMAGE_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /filmes/{id}:
 *   delete:
 *     summary: Deleta um filme pelo ID
 *     tags: [Filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filme deletado com sucesso
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro ao deletar filme
 */
routerFilmes.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await deletarFilme(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Filme não encontrado.",
        codigo: "FILME_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Filme deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar filme.",
      codigo: "DELETE_FILME_ERROR",
      erro: error.message
    });
  }
});


export default routerFilmes;