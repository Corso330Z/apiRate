import express from "express";
import {
    buscarAvaliacaoSugsAtorPorId, buscarAvaliacoesPorPerfilAvaliador, buscarAvaliacaoSugsAtor, buscarAvaliacaoSugsAtorPorDeslikeEPerfil, buscarAvaliacaoSugsAtorPorLike, buscarAvaliacaoSugsAtorPorLikeEPerfil, buscarAvaliacaoSugsAtorPorDeslike
} from "../servicos/avaliaSugsAtor/buscar.js";

import {
    adicionarAvaliacaoSugsAtor,
} from "../servicos/avaliaSugsAtor/adicionar.js";
import { atualizarAvaliacaoSugsAtorPatch } from "../servicos/avaliaSugsAtor/atualizar.js";
import { deletarAvaliacaoSugestaoAtor, deletarAvaliacaoSugestaoAtorAdm} from "../servicos/avaliaSugsAtor/deletar.js";
import { validarAvaliacaoSugsAtorCompleto, validarAvaliacaoSugsAtorParcial } from "../validacao/validacaoAvSugsAtor.js";
import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js";

const routerAvaliacaoSugsAtores = express.Router();

/**
 * @swagger
 * tags:
 *   name: Avaliação da sugestão de atores
 *   description: Endpoints de avaliação da sugestão de atores
 */

/**
 * @swagger
 * /avaliacaoSugestaoAtores:
 *   post:
 *     summary: Adiciona uma nova avaliação
 *     tags: [Avaliação da sugestão de atores]
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
 *               - sugsAtor
 *             properties:
 *               positivo:
 *                 type: boolean
 *               negativo:
 *                 type: boolean
 *               sugsAtor:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Avaliação adicionada com sucesso.
 *       400:
 *         description: Erro de validação.
 *       500:
 *         description: Erro ao adicionar avaliação.
 */
routerAvaliacaoSugsAtores.post("/", verifyToken, async (req, res) => {
    const {positivo, negativo, sugsAtor} = req.body;
    const idPerfil = req.user.id
    const { valido, erros } = await validarAvaliacaoSugsAtorCompleto(positivo, negativo, idPerfil, sugsAtor);

    if (!valido) {
        return res.status(400).json({
            mensagem: "Erro de validação.",
            codigo: "VALIDATION_ERROR",
            erro: erros,
        });
    }

    try {
        await adicionarAvaliacaoSugsAtor(positivo, negativo, idPerfil, sugsAtor);
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
 * /avaliacaoSugestaoAtores:
 *   get:
 *     summary: Busca todas as avaliações
 *     tags: [Avaliação da sugestão de atores]
 *     responses:
 *       200:
 *         description: Lista de avaliações retornada com sucesso.
 *       500:
 *         description: Erro ao buscar avaliações.
 */
routerAvaliacaoSugsAtores.get("/", async (req, res) => {
  try {
    const resultado = await buscarAvaliacaoSugsAtor();
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
 * /avaliacaoSugestaoAtores/{id}:
 *   get:
 *     summary: Busca avaliação por ID
 *     tags: [Avaliação da sugestão de atores]
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
routerAvaliacaoSugsAtores.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarAvaliacaoSugsAtorPorId(id);
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
 * /avaliacaoSugestaoAtores/likes/sugestao/{id}:
 *   get:
 *     summary: Busca avaliações positivas (likes) por sugestão de ator
 *     tags: [Avaliação da sugestão de atores]
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
routerAvaliacaoSugsAtores.get("/likes/sugestao/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarAvaliacaoSugsAtorPorLike(id);
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
 * /avaliacaoSugestaoAtores/deslikes/sugestao/{id}:
 *   get:
 *     summary: Busca avaliações negativas (deslikes) por sugestão de ator
 *     tags: [Avaliação da sugestão de atores]
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
routerAvaliacaoSugsAtores.get("/deslikes/sugestao/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarAvaliacaoSugsAtorPorDeslike(id);
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
 * /avaliacaoSugestaoAtores/likes/perfil/{idPerfil}:
 *   get:
 *     summary: Busca avaliações positivas (likes) por perfil avaliador
 *     tags: [Avaliação da sugestão de atores]
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
routerAvaliacaoSugsAtores.get("/likes/perfil/:idPerfil", async (req, res) => {
  const { idPerfil } = req.params;

  try {
    const resultado = await buscarAvaliacaoSugsAtorPorLikeEPerfil(idPerfil);
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
 * /avaliacaoSugestaoAtores/deslikes/perfil/{idPerfil}:
 *   get:
 *     summary: Busca avaliações negativas (deslikes) por perfil avaliador
 *     tags: [Avaliação da sugestão de atores]
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
routerAvaliacaoSugsAtores.get("/deslikes/perfil/:idPerfil", async (req, res) => {
  const { idPerfil } = req.params;

  try {
    const resultado = await buscarAvaliacaoSugsAtorPorDeslikeEPerfil(idPerfil);
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
 * /avaliacaoSugestaoAtores/perfil/{idPerfil}:
 *   get:
 *     summary: Busca todas as avaliações feitas por um perfil avaliador
 *     tags: [Avaliação da sugestão de atores]
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
routerAvaliacaoSugsAtores.get("/perfil/:idPerfil", async (req, res) => {
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
 * /avaliacaoSugestaoAtores/{id}:
 *   patch:
 *     summary: Atualiza uma avaliação parcialmente
 *     tags: [Avaliação da sugestão de atores]
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
routerAvaliacaoSugsAtores.patch("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const idPerfil = req.user.id;
    const {positivo, negativo} = req.body;

    const { valido, erros } = await validarAvaliacaoSugsAtorParcial(positivo, negativo);
    if (!valido) {
        return res.status(400).json({
            mensagem: "Erro de validação.",
            codigo: "VALIDATION_ERROR",
            erro: erros,
        });
    }

    try {
        const resultado = await atualizarAvaliacaoSugsAtorPatch(id, positivo, negativo, idPerfil);
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
 * /avaliacaoSugestaoAtores/adm/{id}:
 *   delete:
 *     summary: Deleta uma avaliação por ID (somente administrador)
 *     tags: [Avaliação da sugestão de atores]
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
routerAvaliacaoSugsAtores.delete("/adm/:id", verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await deletarAvaliacaoSugestaoAtorAdm(id);
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
 * /avaliacaoSugestaoAtores/{id}:
 *   delete:
 *     summary: Deleta uma avaliação por ID para o perfil logado
 *     tags: [Avaliação da sugestão de atores]
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
routerAvaliacaoSugsAtores.delete("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const idPerfil = req.user.id;
    try {
        const resultado = await deletarAvaliacaoSugestaoAtor(id, idPerfil);
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

export default routerAvaliacaoSugsAtores;
