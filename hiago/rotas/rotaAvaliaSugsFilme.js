import express from "express";
import {
    buscarAvaliacaoSugsFilmePorId, buscarAvaliacoesPorPerfilAvaliador, buscarAvaliacaoSugsFilme, buscarAvaliacaoSugsFilmePorDeslikeEPerfil, buscarAvaliacaoSugsFilmePorLike, buscarAvaliacaoSugsFilmePorLikeEPerfil, buscarAvaliacaoSugsFilmePorDeslike
} from "../servicos/avaliaSugsFilme/buscar.js";

import {
    adicionarAvaliacaoSugsFilme,
} from "../servicos/avaliaSugsFilme/adicionar.js";

import { atualizarAvaliacaoSugsFilmePatch } from "../servicos/avaliaSugsFilme/atualizar.js";
import { deletarAvaliacaoSugestaoFilme, deletarAvaliacaoSugestaoFilmeAdm} from "../servicos/avaliaSugsFilme/deletar.js";
import { validarAvaliacaoSugsFilmeCompleto, validarAvaliacaoSugsFilmeParcial } from "../validacao/validacaoAvSugsFilme.js";
import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js";

const routerAvaliacaoSugsFilmes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Avaliação da sugestão de filmes
 *   description: Endpoints de avaliação da sugestão de filmes
 */

/**
 * @swagger
 * /avaliacaoSugestaoFilmes:
 *   post:
 *     summary: Adiciona uma nova avaliação
 *     tags: [Avaliação da sugestão de filmes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - positivo
 *               - negativo
 *               - sugsFilme
 *             properties:
 *               positivo:
 *                 type: boolean
 *               negativo:
 *                 type: boolean
 *               sugsFilme:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Avaliação adicionada com sucesso.
 *       400:
 *         description: Erro de validação.
 *       500:
 *         description: Erro ao adicionar avaliação.
 */
routerAvaliacaoSugsFilmes.post("/", verifyToken, async (req, res) => {
    const {positivo, negativo, sugsFilme} = req.body;
    const idPerfil = req.user.id
    const { valido, erros } = await validarAvaliacaoSugsFilmeCompleto(positivo, negativo, idPerfil, sugsFilme);

    if (!valido) {
        return res.status(400).json({
            mensagem: "Erro de validação.",
            codigo: "VALIDATION_ERROR",
            erro: erros,
        });
    }

    try {
        await adicionarAvaliacaoSugsFilme(positivo, negativo, idPerfil, sugsFilme);
        return res.status(201).json({ mensagem: "Avaliação adicionada com sucesso." });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao adicionar avaliação.",
            codigo: "ADD_AVALIACAO_ERROR",
            erro: error.message,
        });
    }
});

/**
 * @swagger
 * /avaliacaoSugestaoFilmes:
 *   get:
 *     summary: Busca todas as avaliações
 *     tags: [Avaliação da sugestão de filmes]
 *     responses:
 *       200:
 *         description: Lista de avaliações retornada com sucesso.
 *       500:
 *         description: Erro ao buscar avaliações.
 */
routerAvaliacaoSugsFilmes.get("/", async (req, res) => {
  try {
    const resultado = await buscarAvaliacaoSugsFilme();
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar avaliações.",
      codigo: "GET_AVALIACOES_ERROR",
      erro: error.message,
    });
  }
});



/**
 * @swagger
 * /avaliacaoSugestaoFilmes/{id}:
 *   get:
 *     summary: Busca avaliação por ID
 *     tags: [Avaliação da sugestão de filmes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da avaliação
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Avaliação encontrada e retornada.
 *       404:
 *         description: Avaliação não encontrada.
 *       500:
 *         description: Erro ao buscar avaliação.
 */
routerAvaliacaoSugsFilmes.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarAvaliacaoSugsFilmePorId(id);
    if (!resultado || resultado.length === 0) {
      return res.status(404).json({ mensagem: "Avaliação não encontrada." });
    }
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar avaliação.",
      codigo: "GET_AVALIACAO_ERROR",
      erro: error.message,
    });
  }
});


/**
 * @swagger
 * /avaliacaoSugestaoFilmes/likes/sugestao/{id}:
 *   get:
 *     summary: Busca avaliações positivas (likes) por sugestão de ator
 *     tags: [Avaliação da sugestão de filmes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da sugestão de ator
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Avaliações positivas retornadas com sucesso.
 *       500:
 *         description: Erro ao buscar likes.
 */
routerAvaliacaoSugsFilmes.get("/likes/sugestao/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarAvaliacaoSugsFilmePorLike(id);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar likes.",
      codigo: "GET_LIKES_ERROR",
      erro: error.message,
    });
  }
});



/**
 * @swagger
 * /avaliacaoSugestaoFilmes/deslikes/sugestao/{id}:
 *   get:
 *     summary: Busca avaliações negativas (deslikes) por sugestão de ator
 *     tags: [Avaliação da sugestão de filmes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da sugestão de ator
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Avaliações negativas retornadas com sucesso.
 *       500:
 *         description: Erro ao buscar deslikes.
 */
routerAvaliacaoSugsFilmes.get("/deslikes/sugestao/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarAvaliacaoSugsFilmePorDeslike(id);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar deslikes.",
      codigo: "GET_DESLIKES_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /avaliacaoSugestaoFilmes/likes/perfil/{idPerfil}:
 *   get:
 *     summary: Busca avaliações positivas (likes) por perfil avaliador
 *     tags: [Avaliação da sugestão de filmes]
 *     parameters:
 *       - in: path
 *         name: idPerfil
 *         required: true
 *         description: ID do perfil avaliador
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Avaliações positivas do perfil retornadas com sucesso.
 *       500:
 *         description: Erro ao buscar likes do perfil.
 */
routerAvaliacaoSugsFilmes.get("/likes/perfil/:idPerfil", async (req, res) => {
  const { idPerfil } = req.params;

  try {
    const resultado = await buscarAvaliacaoSugsFilmePorLikeEPerfil(idPerfil);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar likes do perfil.",
      codigo: "GET_LIKES_PERFIL_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /avaliacaoSugestaoFilmes/deslikes/perfil/{idPerfil}:
 *   get:
 *     summary: Busca avaliações negativas (deslikes) por perfil avaliador
 *     tags: [Avaliação da sugestão de filmes]
 *     parameters:
 *       - in: path
 *         name: idPerfil
 *         required: true
 *         description: ID do perfil avaliador
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Avaliações negativas do perfil retornadas com sucesso.
 *       500:
 *         description: Erro ao buscar deslikes do perfil.
 */
routerAvaliacaoSugsFilmes.get("/deslikes/perfil/:idPerfil", async (req, res) => {
  const { idPerfil } = req.params;

  try {
    const resultado = await buscarAvaliacaoSugsFilmePorDeslikeEPerfil(idPerfil);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar deslikes do perfil.",
      codigo: "GET_DESLIKES_PERFIL_ERROR",
      erro: error.message,
    });
  }
});


/**
 * @swagger
 * /avaliacaoSugestaoFilmes/perfil/{idPerfil}:
 *   get:
 *     summary: Busca todas as avaliações feitas por um perfil avaliador
 *     tags: [Avaliação da sugestão de filmes]
 *     parameters:
 *       - in: path
 *         name: idPerfil
 *         required: true
 *         description: ID do perfil avaliador
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Avaliações do perfil retornadas com sucesso.
 *       500:
 *         description: Erro ao buscar avaliações do perfil.
 */
routerAvaliacaoSugsFilmes.get("/perfil/:idPerfil", async (req, res) => {
  const { idPerfil } = req.params;

  try {
    const resultado = await buscarAvaliacoesPorPerfilAvaliador(idPerfil);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar avaliações da sugestão.",
      codigo: "GET_AVALIACOES_SUGESTAO_ERROR",
      erro: error.message,
    });
  }
});


/**
 * @swagger
 * /avaliacaoSugestaoFilmes/{id}:
 *   patch:
 *     summary: Atualiza uma avaliação parcialmente
 *     tags: [Avaliação da sugestão de filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da avaliação
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               positivo:
 *                 type: boolean
 *               negativo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso.
 *       400:
 *         description: Erro de validação.
 *       404:
 *         description: Avaliação não encontrada.
 *       500:
 *         description: Erro ao atualizar avaliação.
 */
routerAvaliacaoSugsFilmes.patch("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const idPerfil = req.user.id;
    const {positivo, negativo} = req.body;

    const { valido, erros } = await validarAvaliacaoSugsFilmeParcial(positivo, negativo);
    if (!valido) {
        return res.status(400).json({
            mensagem: "Erro de validação.",
            codigo: "VALIDATION_ERROR",
            erro: erros,
        });
    }

    try {
        const resultado = await atualizarAvaliacaoSugsFilmePatch(id, positivo, negativo, idPerfil);
        if (resultado.affectedRows == 0) {
            return res.status(404).json({ mensagem: "Avaliação não encontrada." });
        }
        return res.status(200).json({ mensagem: "Avaliação atualizada com sucesso." });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao atualizar avaliação.",
            codigo: "UPDATE_AVALIACAO_ERROR",
            erro: error.message,
        });
    }
});


/**
 * @swagger
 * /avaliacaoSugestaoFilmes/adm/{id}:
 *   delete:
 *     summary: Deleta uma avaliação por ID (somente administrador)
 *     tags: [Avaliação da sugestão de filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da avaliação
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Avaliação deletada com sucesso.
 *       404:
 *         description: Avaliação não encontrada.
 *       500:
 *         description: Erro ao deletar avaliação.
 */
routerAvaliacaoSugsFilmes.delete("/adm/:id", verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await deletarAvaliacaoSugestaoFilmeAdm(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Avaliação não encontrada." });
        }
        return res.status(200).json({ mensagem: "Avaliação deletada com sucesso." });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao deletar avaliação.",
            codigo: "DELETE_AVALIACAO_ERROR",
            erro: error.message,
        });
    }
});

/**
 * @swagger
 * /avaliacaoSugestaoFilmes/{id}:
 *   delete:
 *     summary: Deleta uma avaliação por ID para o perfil logado
 *     tags: [Avaliação da sugestão de filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da avaliação
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Avaliação deletada com sucesso.
 *       404:
 *         description: Avaliação não encontrada.
 *       500:
 *         description: Erro ao deletar avaliação.
 */
routerAvaliacaoSugsFilmes.delete("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const idPerfil = req.user.id;
    try {
        const resultado = await deletarAvaliacaoSugestaoFilme(id, idPerfil);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Avaliação não encontrada." });
        }
        return res.status(200).json({ mensagem: "Avaliação deletada com sucesso." });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao deletar avaliação.",
            codigo: "DELETE_AVALIACAO_ERROR",
            erro: error.message,
        });
    }
});

export default routerAvaliacaoSugsFilmes;
