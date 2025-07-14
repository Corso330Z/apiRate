import express from "express";
import {
  buscarComentariosFilmes,
  buscarComentariosFilmesByIdFilme,
  buscarComentariosFilmesByIdFilmeAndIdPerfil,
  buscarComentariosFilmesByIdPerfil,
  buscarComentariosFilmesById,
} from "../servicos//comentariosFilmes/buscar.js";

import {
  deletarComentariosFilmes,
  deletarComentariosFilmesByPerfil,
  deletarComentariosFilmesByFilme,
  deletarComentariosFilmesByFilmeAndPerfil,
} from "../servicos/comentariosFilmes/deletar.js";

import { adicionarComentarioFilme } from "../servicos/comentariosFilmes/adicionar.js";
import { validarComentarioFilme } from "../validacao/validacaoComentariosFilmes.js";
import { editarComentario } from "../servicos/comentariosFilmes/editar.js";
import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js";

const routerComentariosFilmes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comentários filmes
 *   description: Endpoints para gerenciar comentários em filmes.
 */

/**
 * @swagger
 * /comentarios:
 *   get:
 *     summary: Lista todos os comentários de filmes
 *     tags: [Comentários filmes]
 *     responses:
 *       200:
 *         description: Comentários encontrados com sucesso
 *       500:
 *         description: Erro ao buscar os comentários de filmes
 */
routerComentariosFilmes.get("/", async (req, res) => {
  try {
    const resultado = await buscarComentariosFilmes();
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar os comentários de filmes.",
      codigo: "GET_COMENTARIOS_FILMES_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /comentarios/{id}:
 *   get:
 *     summary: Busca um comentário de filme pelo ID
 *     tags: [Comentários filmes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do comentário
 *     responses:
 *       200:
 *         description: Comentário encontrado com sucesso
 *       500:
 *         description: Erro ao buscar os comentários de filmes
 */
routerComentariosFilmes.get("/:id", async (req, res) => {
  const {id} = req.params
  try {
    const resultado = await buscarComentariosFilmesById(id);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar os comentários de filmes.",
      codigo: "GET_COMENTARIOS_FILMES_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /comentarios/perfil/meuPerfil:
 *   get:
 *     summary: Lista os comentários do perfil autenticado
 *     tags: [Comentários filmes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comentários do perfil encontrados com sucesso
 *       500:
 *         description: Erro ao buscar os comentários do perfil
 */
routerComentariosFilmes.get("/perfil/meuPerfil", verifyToken, async (req, res) => {
  const idPerfil = req.user.id;
  try {
    const resultado = await buscarComentariosFilmesByIdPerfil(idPerfil);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar os comentários do perfil.",
      codigo: "GET_COMENTARIOS_PERFIL_ERROR",
      erro: error.message,
    });
  }
});


/**
 * @swagger
 * /comentarios/perfil/{idPerfil}:
 *   get:
 *     summary: Lista os comentários de um perfil específico
 *     tags: [Comentários filmes]
 *     parameters:
 *       - in: path
 *         name: idPerfil
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil
 *     responses:
 *       200:
 *         description: Comentários encontrados
 *       500:
 *         description: Erro ao buscar os comentários do perfil
 */
routerComentariosFilmes.get("/perfil/:idPerfil", async (req, res) => {
  const { idPerfil } = req.params;
  try {
    const resultado = await buscarComentariosFilmesByIdPerfil(idPerfil);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar os comentários do perfil.",
      codigo: "GET_COMENTARIOS_PERFIL_ERROR",
      erro: error.message,
    });
  }
});


/**
 * @swagger
 * /comentarios/filme/{idFilme}:
 *   get:
 *     summary: Lista os comentários de um filme
 *     tags: [Comentários filmes]
 *     parameters:
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filme
 *     responses:
 *       200:
 *         description: Comentários encontrados
 *       500:
 *         description: Erro ao buscar os comentários do filme
 */
routerComentariosFilmes.get("/filme/:idFilme", async (req, res) => {
  const { idFilme } = req.params;
  try {
    const resultado = await buscarComentariosFilmesByIdFilme(idFilme);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar os comentários do filme.",
      codigo: "GET_COMENTARIOS_FILME_ERROR",
      erro: error.message,
    });
  }
});


/**
 * @swagger
 * /comentarios/perfilEFilme/{idPerfil}/{idFilme}:
 *   get:
 *     summary: Busca um comentário feito por um perfil específico em um filme
 *     tags: [Comentários filmes]
 *     parameters:
 *       - in: path
 *         name: idPerfil
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filme
 *     responses:
 *       200:
 *         description: Comentário encontrado
 *       500:
 *         description: Erro ao buscar o comentário
 */
routerComentariosFilmes.get("/perfilEFilme/:idPerfil/:idFilme", async (req, res) => {
  const { idFilme, idPerfil } = req.params;
  try {
    const resultado = await buscarComentariosFilmesByIdFilmeAndIdPerfil(idPerfil, idFilme);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar o comentário entre perfil e filme.",
      codigo: "GET_COMENTARIO_PERFIL_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /comentarios/adm:
 *   post:
 *     summary: Adiciona um comentário como administrador
 *     tags: [Comentários filmes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idFilme, idPerfil, comentario]
 *             properties:
 *               idFilme:
 *                 type: integer
 *               idPerfil:
 *                 type: integer
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentário adicionado com sucesso
 *       400:
 *         description: Erro de validação ou falha ao adicionar comentário
 *       500:
 *         description: Erro ao criar o comentário
 */
routerComentariosFilmes.post("/adm", verifyToken, isAdmin, async (req, res) => {
  const { idFilme, idPerfil, comentario } = req.body;

  try {
    const erroValidacao = await validarComentarioFilme({ idFilme, idPerfil, comentario });

    if (erroValidacao) {
      return res.status(erroValidacao.status).json(erroValidacao.erro);
    }
    const resultado = await adicionarComentarioFilme(idFilme, idPerfil, comentario);

    if (resultado.affectedRows > 0) {
      return res.status(201).json({ mensagem: "Comentário adicionado com sucesso." });
    } else {
      return res.status(400).json({ mensagem: "Não foi possível adicionar o comentário." });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar o comentário.",
      codigo: "ADD_COMENTARIO_FILME_ERROR",
      erro: error.message,
    });
  }
});


/**
 * @swagger
 * /comentarios:
 *   post:
 *     summary: Adiciona um comentário autenticado
 *     tags: [Comentários filmes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idFilme, comentario]
 *             properties:
 *               idFilme:
 *                 type: integer
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentário adicionado com sucesso
 *       400:
 *         description: Erro de validação ou falha ao adicionar comentário
 *       500:
 *         description: Erro ao criar o comentário
 */
routerComentariosFilmes.post("/:idPerfil", async (req, res) => {
  const idPerfil = req.params.idPerfil;
  const { idFilme, comentario } = req.body;
  try {
    const erroValidacao = await validarComentarioFilme({ idFilme, idPerfil, comentario });

    if (erroValidacao) {
      return res.status(erroValidacao.status).json(erroValidacao.erro);
    }
    const resultado = await adicionarComentarioFilme(idFilme, idPerfil, comentario);
    if (resultado.affectedRows > 0) {
      return res.status(201).json({ mensagem: "Comentário adicionado com sucesso." });
    } else {
      return res.status(400).json({ mensagem: "Não foi possível adicionar o comentário." });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar o comentário.",
      codigo: "ADD_COMENTARIO_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /comentarios:
 *   patch:
 *     summary: Edita um comentário do perfil autenticado
 *     tags: [Comentários filmes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, comentario]
 *             properties:
 *               id:
 *                 type: integer
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentário editado com sucesso
 *       400:
 *         description: Erro de validação ou falha ao editar comentário
 *       500:
 *         description: Erro ao editar o comentário
 */
routerComentariosFilmes.patch("/", verifyToken, async (req, res) => {
  const { id, comentario } = req.body;
  const idPerfil = req.user.id;
  try {
    if (typeof comentario !== 'string' || comentario.trim().length === 0) {
      return res.status(400).json({
        mensagem: "'comentario' deve ser uma string não vazia.",
        codigo: "comentario_INVALIDA"
      })
  }
    const resultado = await editarComentario(comentario, id, idPerfil);
    if (resultado.affectedRows > 0) {
      return res.status(201).json({ mensagem: "Comentário editado com sucesso." });
    } else {
      return res.status(400).json({ mensagem: "Não foi possível editar o comentário." });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao editar o comentário.",
      codigo: "ADD_COMENTARIO_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /comentarios/filme/{idFilme}:
 *   delete:
 *     summary: Remove todos os comentários de um filme
 *     tags: [Comentários filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filme
 *     responses:
 *       200:
 *         description: Comentários deletados com sucesso
 *       404:
 *         description: Nenhum comentário encontrado
 *       500:
 *         description: Erro ao deletar comentários
 */
routerComentariosFilmes.delete("/filme/:idFilme", verifyToken, isAdmin, async (req, res) => {
  const { idFilme } = req.params;
  try {
    const resultado = await deletarComentariosFilmesByFilme(idFilme);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Nenhum comentário encontrado para este filme.",
        codigo: "FILME_COMENTARIO_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Comentários do filme deletados com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar os comentários do filme.",
      codigo: "DELETE_COMENTARIOS_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /comentarios/{id}:
 *   delete:
 *     summary: Remove um comentário do usuario logado por ID do comentário (autenticado)
 *     tags: [Comentários filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do comentário
 *     responses:
 *       200:
 *         description: Comentário deletado com sucesso
 *       404:
 *         description: Comentário não encontrado
 *       500:
 *         description: Erro ao deletar o comentário
 */
routerComentariosFilmes.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const idPerfil = req.user.id
  try {
    const resultado = await deletarComentariosFilmes(id, idPerfil);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Nenhum comentário encontrado.",
        codigo: "FILME_COMENTARIO_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Comentários do filme deletados com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar os comentários do filme.",
      codigo: "DELETE_COMENTARIOS_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /comentarios/perfilEFilme/{idPerfil}/{idFilme}:
 *   delete:
 *     summary: Remove o comentário entre perfil e filme
 *     tags: [Comentários filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPerfil
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comentário removido com sucesso
 *       404:
 *         description: Comentário não encontrado
 *       500:
 *         description: Erro ao deletar o comentário
 */
routerComentariosFilmes.delete("/perfilEFilme/:idPerfil/:idFilme", verifyToken, async (req, res) => {
  const { idFilme, idPerfil } = req.params;
  try {
    const resultado = await deletarComentariosFilmesByFilmeAndPerfil(idFilme, idPerfil);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Comentário entre perfil e filme não encontrado.",
        codigo: "COMENTARIO_RELATION_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Comentário removido com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar o comentário.",
      codigo: "DELETE_COMENTARIO_FILME_PERFIL_ERROR",
      erro: error.message,
    });
  }
});

export default routerComentariosFilmes;
