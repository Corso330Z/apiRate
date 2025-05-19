import express from "express";
import { adicionarSugestaoFilme } from "../servicos/sugsFilmes/adicionar.js";
import { buscarSugestaoFilmePorId, buscarSugestaoFilmePorNome, buscarSugestaoFilme } from "../servicos/sugsFilmes/buscar.js";
import { deletarSugestaoFilme, deletarSugestaoFilmeAdm } from "../servicos/sugsFilmes/deletar.js";
import { atualizarSugestaoFilmePut, atualizarSugestaoFilmePutAdm, atualizarSugestaoFilmePatch, atualizarSugestaoFilmePatchAdm } from "../servicos/sugsFilmes/atualizar.js";
import { validarSugestaoFilmeCompleto } from "../validacao/validacaoSugsFilmes.js";
import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js";

const routerSugestaoFilmes = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Sugestões de Filmes
 *     description: Endpoints para gerenciar sugestões de filmes
 */

/**
 * @swagger
 * /sugestaoFilmes:
 *   post:
 *     summary: Adiciona uma nova sugestão de filme
 *     tags: [Sugestões de Filmes]
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
 *               - sinopse
 *             properties:
 *               nome:
 *                 type: string
 *               sinopse:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sugestão de filme adicionada com sucesso
 *       400:
 *         description: Erro de validação dos dados
 *       500:
 *         description: Erro ao adicionar sugestão de filme
 */
routerSugestaoFilmes.post("/", verifyToken, async (req, res) => {
  const { id } = req.user;
  const { nome, sinopse } = req.body;

  const { valido, erros } = await validarSugestaoFilmeCompleto({ nome, sinopse });

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await adicionarSugestaoFilme(id, nome, sinopse);

    if (resultado[0].affectedRows > 0) {
      return res.status(201).json({ mensagem: "Sugestão de filme adicionada com sucesso." });
    } else {
      return res.status(404).json({ mensagem: "Não foi possível adicionar sugestão de filme." });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao adicionar sugestão de filme.",
      codigo: "ADD_SUGESTAO_FILME_ERROR",
      erro: error.message
    });
  }
});

/**
 * @swagger
 * /sugestaoFilmes/{id}:
 *   put:
 *     summary: Atualiza completamente uma sugestão (usuário comum)
 *     tags: [Sugestões de Filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - sinopse
 *             properties:
 *               nome:
 *                 type: string
 *               sinopse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sugestão de filme atualizada com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Sugestão não encontrada
 *       500:
 *         description: Erro ao atualizar
 */
routerSugestaoFilmes.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const idPerfil = req.user.id;
  const { nome, sinopse } = req.body;

  const { valido, erros } = await validarSugestaoFilmeCompleto({ nome, sinopse });

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await atualizarSugestaoFilmePut(nome, sinopse, id, idPerfil);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Sugestão de filme não encontrada.",
        codigo: "SUGESTAO_FILME_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Sugestão de filme atualizada com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar sugestão de filme.",
      codigo: "UPDATE_SUGESTAO_FILME_ERROR",
      erro: error.message
    });
  }
});

// PATCH comum
/**
 * @swagger
 * /sugestaoFilmes/{id}:
 *   patch:
 *     summary: Atualiza parcialmente uma sugestão (usuário comum)
 *     tags: [Sugestões de Filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               sinopse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sugestão atualizada parcialmente com sucesso
 *       400:
 *         description: Nenhum dado enviado
 *       404:
 *         description: Sugestão não encontrada
 *       500:
 *         description: Erro ao atualizar parcialmente
 */
routerSugestaoFilmes.patch("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const idPerfil = req.user.id;
  const { nome, sinopse } = req.body;

  try {
    const camposAtualizar = {};
    if (nome) camposAtualizar.nomeFilme = nome;
    if (sinopse) camposAtualizar.sinopse = sinopse;


    if (Object.keys(camposAtualizar).length === 0) {
      return res.status(400).json({
        mensagem: "Nenhum dado enviado para atualização.",
        codigo: "NO_UPDATE_DATA"
      });
    }
    const resultado = await atualizarSugestaoFilmePatch(camposAtualizar, id, idPerfil);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Sugestão de filme não encontrada.",
        codigo: "SUGESTAO_FILME_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Sugestão de filme atualizada parcialmente com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar parcialmente sugestão de filme.",
      codigo: "PATCH_SUGESTAO_FILME_ERROR",
      erro: error.message
    });
  }
});

// PATCH admin

/**
 * @swagger
 * /sugestaoFilmes/adm/{id}:
 *   patch:
 *     summary: Atualiza parcialmente uma sugestão (admin)
 *     tags: [Sugestões de Filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               sinopse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sugestão atualizada parcialmente com sucesso
 *       400:
 *         description: Nenhum dado enviado
 *       404:
 *         description: Sugestão não encontrada
 *       500:
 *         description: Erro ao atualizar parcialmente
 */
routerSugestaoFilmes.patch("/adm/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { nome, sinopse } = req.body;

  try {
    const camposAtualizar = {};
    if (nome) camposAtualizar.nomeFilme = nome;
    if (sinopse) camposAtualizar.sinopse = sinopse;


    if (Object.keys(camposAtualizar).length === 0) {
      return res.status(400).json({
        mensagem: "Nenhum dado enviado para atualização.",
        codigo: "NO_UPDATE_DATA"
      });
    }
    const resultado = await atualizarSugestaoFilmePatchAdm(camposAtualizar, id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Sugestão de filme não encontrada.",
        codigo: "SUGESTAO_FILME_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Sugestão de filme atualizada parcialmente com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar parcialmente sugestão de filme.",
      codigo: "PATCH_SUGESTAO_FILME_ERROR",
      erro: error.message
    });
  }
});


/**
 * @swagger
 * /sugestaoFilmes:
 *   get:
 *     summary: Lista todas as sugestões de filmes ou busca por nome
 *     tags: [Sugestões de Filmes]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Nome do filme para busca
 *     responses:
 *       200:
 *         description: Lista de sugestões de filmes
 *       500:
 *         description: Erro ao buscar sugestões de filmes
 */
routerSugestaoFilmes.get("/", async (req, res) => {
  const { nome } = req.query;

  try {
    const resultado = nome
      ? await buscarSugestaoFilmePorNome(nome)
      : await buscarSugestaoFilme();

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar sugestões de filmes.",
      codigo: "GET_SUGESTAO_FILMES_ERROR",
      erro: error.message
    });
  }
});


/**
 * @swagger
 * /sugestaoFilmes/{id}:
 *   get:
 *     summary: Busca uma sugestão de filme pelo ID
 *     tags: [Sugestões de Filmes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sugestão encontrada
 *       404:
 *         description: Sugestão de filme não encontrada
 *       500:
 *         description: Erro ao buscar a sugestão de filme
 */
routerSugestaoFilmes.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarSugestaoFilmePorId(id);

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({
        mensagem: "Sugestão de filme não encontrada.",
        codigo: "SUGESTAO_FILME_NOT_FOUND"
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar a sugestão de filme.",
      codigo: "GET_SUGESTAO_FILME_ERROR",
      erro: error.message
    });
  }
});


/**
 * @swagger
 * /sugestaoFilmes/{id}:
 *   delete:
 *     summary: Deleta uma sugestão de filme (usuário comum)
 *     tags: [Sugestões de Filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sugestão deletada com sucesso
 *       404:
 *         description: Sugestão não encontrada
 *       500:
 *         description: Erro ao deletar
 */
routerSugestaoFilmes.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const idPerfil = req.user.id;

  try {
    const resultado = await deletarSugestaoFilme(id, idPerfil);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Sugestão de filme não encontrada.",
        codigo: "SUGESTAO_FILME_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Sugestão de filme deletada com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar sugestão de filme.",
      codigo: "DELETE_SUGESTAO_FILME_ERROR",
      erro: error.message
    });
  }
});



/**
 * @swagger
 * /sugestaoFilmes/adm/{id}:
 *   delete:
 *     summary: Deleta uma sugestão de filme (admin)
 *     tags: [Sugestões de Filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sugestão deletada com sucesso
 *       404:
 *         description: Sugestão não encontrada
 *       500:
 *         description: Erro ao deletar
 */
routerSugestaoFilmes.delete("/adm/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await deletarSugestaoFilmeAdm(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Sugestão de filme não encontrada.",
        codigo: "SUGESTAO_FILME_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Sugestão de filme deletada com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar sugestão de filme.",
      codigo: "DELETE_SUGESTAO_FILME_ERROR",
      erro: error.message
    });
  }
});



/**
 * @swagger
 * /sugestaoFilmes/adm/{id}:
 *   put:
 *     summary: Atualiza completamente uma sugestão (admin)
 *     tags: [Sugestões de Filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - sinopse
 *             properties:
 *               nome:
 *                 type: string
 *               sinopse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sugestão atualizada com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Sugestão não encontrada
 *       500:
 *         description: Erro ao atualizar
 */
routerSugestaoFilmes.put("/adm/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { nome, sinopse } = req.body;

  const { valido, erros } = await validarSugestaoFilmeCompleto({ nome, sinopse });

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await atualizarSugestaoFilmePutAdm(nome, sinopse, id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Sugestão de filme não encontrada.",
        codigo: "SUGESTAO_FILME_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Sugestão de filme atualizada com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar sugestão de filme.",
      codigo: "UPDATE_SUGESTAO_FILME_ERROR",
      erro: error.message
    });
  }
});

export default routerSugestaoFilmes;
