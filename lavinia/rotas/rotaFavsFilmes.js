import express from "express";
import {
  buscarFavoritosFilmes,
  buscarFavoritosFilmesByIdFilme,
  buscarFavoritosFilmesByIdPefilAndIdFilme,
  buscarFavoritosFilmesByIdPerfil,
} from "../servicos/favoritosFilmes/busca.js";

import {
  deletarFavoritosFilmesByPerfil,
  deletarFavoritosFilmesByFilme,
  deletarFavoritosFilmesByFilmeAndPerfil,
} from "../servicos/favoritosFilmes/deletar.js";

import { adicionarFavoritosFilmes } from "../servicos/favoritosFilmes/adicionar.js";
import { validarRelacaoFavoritosFilme, validarIdFilmeBody } from "../validacao/validacaoFavoritosFilmes.js";
import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js";

const routerFavoritosFilmes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Favoritos filmes
 *   description: Endpoints para gerenciar a lista de filmes favoritos.
 */


/**
 * @swagger
 * /favoritosFilmes:
 *   get:
 *     summary: Lista todas as relações de favoritos entre perfis e filmes.
 *     tags: [Favoritos filmes]
 *     responses:
 *       200:
 *         description: Relações encontradas com sucesso.
 *       500:
 *         description: Erro ao buscar as relações.
 */
routerFavoritosFilmes.get("/", async (req, res) => {
  try {
    const resultado = await buscarFavoritosFilmes();
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar as relações entre perfis e filmes favoritos.",
      codigo: "GET_FAVORITOS_FILMES_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /favoritosFilmes/perfil/meuPerfil:
 *   get:
 *     summary: Lista os filmes favoritos do perfil autenticado.
 *     tags: [Favoritos filmes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de favoritos retornada com sucesso.
 *       500:
 *         description: Erro ao buscar os filmes favoritos.
 */
routerFavoritosFilmes.get("/perfil/meuPerfil", verifyToken, async (req, res) => {
  const idPerfil = req.user.id;
  try {
    const resultado = await buscarFavoritosFilmesByIdPerfil(idPerfil);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar a lista de filmes favoritos do perfil.",
      codigo: "GET_FILMES_FAVORITOS_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /favoritosFilmes/perfil/{idPerfil}:
 *   get:
 *     summary: Lista os filmes favoritos de um perfil específico.
 *     tags: [Favoritos filmes]
 *     parameters:
 *       - in: path
 *         name: idPerfil
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de favoritos retornada com sucesso.
 *       500:
 *         description: Erro ao buscar os filmes favoritos.
 */
routerFavoritosFilmes.get("/perfil/:idPerfil", async (req, res) => {
  const { idPerfil } = req.params;
  try {
    const resultado = await buscarFavoritosFilmesByIdPerfil(idPerfil);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar a lista de filmes favoritos do perfil.",
      codigo: "GET_FILMES_FAVORITOS_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /favoritosFilmes/filme/{idFilme}:
 *   get:
 *     summary: Lista os perfis que favoritaram um determinado filme.
 *     tags: [Favoritos filmes]
 *     parameters:
 *       - in: path
 *         name: idFilme
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relações encontradas com sucesso.
 *       500:
 *         description: Erro ao buscar os favoritos do filme.
 */
routerFavoritosFilmes.get("/filme/:idFilme", async (req, res) => {
  const { idFilme } = req.params;
  try {
    const resultado = await buscarFavoritosFilmesByIdFilme(idFilme);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar o filme nos favoritos.",
      codigo: "GET_FAVORITOS_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /favoritosFilmes/perfilEFilme/{idPerfil}/{idFilme}:
 *   get:
 *     summary: Verifica se um perfil favoritou determinado filme.
 *     tags: [Favoritos filmes]
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
 *         description: Relação encontrada com sucesso.
 *       500:
 *         description: Erro ao buscar a relação.
 */
routerFavoritosFilmes.get("/perfilEFilme/:idPerfil/:idFilme", async (req, res) => {
  const { idFilme, idPerfil } = req.params;
  try {
    const resultado = await buscarFavoritosFilmesByIdPefilAndIdFilme(idPerfil, idFilme);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar a relação entre perfil e filme favorito.",
      codigo: "GET_FAVORITOS_PERFIL_FILME_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /favoritosFilmes/adm:
 *   post:
 *     summary: Adiciona um filme aos favoritos de um perfil (acesso administrador).
 *     tags: [Favoritos filmes]
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
 *               - idPerfil
 *             properties:
 *               idFilme:
 *                 type: integer
 *               idPerfil:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Filme adicionado aos favoritos com sucesso.
 *       400:
 *         description: Não foi possível adicionar o filme.
 *       500:
 *         description: Erro ao adicionar aos favoritos.
 */
routerFavoritosFilmes.post("/adm", verifyToken, isAdmin, async (req, res) => {
  const { idFilme, idPerfil } = req.body;

  try {
    const erroValidacao = await validarRelacaoFavoritosFilme({ idFilme, idPerfil });

    if (erroValidacao) {
      return res.status(erroValidacao.status).json(erroValidacao.erro);
    }
    const resultado = await adicionarFavoritosFilmes(idFilme, idPerfil);
    if (resultado[0].affectedRows > 0) {
      return res.status(201).json({ mensagem: "Filme adicionado aos favoritos com sucesso." });
    } else {
      return res.status(400).json({ mensagem: "Não foi possível adicionar o filme aos favoritos." });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar a relação entre perfil e filme favorito.",
      codigo: "ADD_FAVORITOS_FILME_ERROR",
      erro: error.message,
    });
  }
});


/**
 * @swagger
 * /favoritosFilmes:
 *   post:
 *     summary: Adiciona um filme aos favoritos do perfil autenticado.
 *     tags: [Favoritos filmes]
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
 *             properties:
 *               idFilme:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Filme adicionado aos favoritos com sucesso.
 *       400:
 *         description: Não foi possível adicionar o filme.
 *       500:
 *         description: Erro ao adicionar aos favoritos.
 */
routerFavoritosFilmes.post("/:idPerfil", async (req, res) => {
  const { idFilme } = req.body;
  const idPerfil = req.params.idPerfil;
  try {
    const erroValidacao = await validarRelacaoFavoritosFilme({ idFilme, idPerfil });

    if (erroValidacao) {
      return res.status(erroValidacao.status).json(erroValidacao.erro);
    }
    const resultado = await adicionarFavoritosFilmes(idFilme, idPerfil);
    if (resultado[0].affectedRows > 0) {
      return res.status(201).json({ mensagem: "Filme adicionado aos favoritos com sucesso." });
    } else {
      return res.status(400).json({ mensagem: "Não foi possível adicionar o filme aos favoritos." });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar a relação entre perfil e filme favorito.",
      codigo: "ADD_FAVORITOS_FILME_ERROR",
      erro: error.message,
    });
  }
});


/**
 * @swagger
 * /favoritosFilmes/filme/{idFilme}:
 *   delete:
 *     summary: Remove todas as relações de favoritos com um determinado filme (acesso administrador).
 *     tags: [Favoritos filmes]
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
 *         description: Relações do filme removidas com sucesso.
 *       404:
 *         description: Nenhuma relação encontrada para o filme.
 *       500:
 *         description: Erro ao deletar as relações.
 */
routerFavoritosFilmes.delete("/filme/:idFilme", verifyToken, isAdmin, async (req, res) => {
  const { idFilme } = req.params;
  try {
    const resultado = await deletarFavoritosFilmesByFilme(idFilme);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Nenhuma relação encontrada para este filme.",
        codigo: "FILME_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Relações do filme deletadas com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar as relações do filme nos favoritos.",
      codigo: "DELETE_FILME_ERROR",
      erro: error.message,
    });
  }
});


/**
 * @swagger
 * /favoritosFilmes/perfil/{idPerfil}:
 *   delete:
 *     summary: Remove todos os filmes favoritos do perfil autenticado.
 *     tags: [Favoritos filmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPerfil
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favoritos do perfil removidos com sucesso.
 *       404:
 *         description: Nenhuma relação encontrada para o perfil.
 *       500:
 *         description: Erro ao deletar os favoritos.
 */
routerFavoritosFilmes.delete("/perfil", verifyToken, async (req, res) => {
  const idPerfil = req.user.id;
  try {
    const resultado = await deletarFavoritosFilmesByPerfil(idPerfil);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Nenhuma relação encontrada para este perfil.",
        codigo: "FAVORITOS_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Filmes favoritos do perfil removidos com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar os filmes favoritos do perfil.",
      codigo: "DELETE_FAVORITOS_ERROR",
      erro: error.message,
    });
  }
});


/**
 * @swagger
 * /favoritosFilmes/perfilEFilme/{idPerfil}/{idFilme}:
 *   delete:
 *     summary: Remove uma relação de favorito entre um perfil e um filme.
 *     tags: [Favoritos filmes]
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
 *         description: Relação removida com sucesso.
 *       404:
 *         description: Relação não encontrada.
 *       500:
 *         description: Erro ao deletar a relação.
 */
routerFavoritosFilmes.delete("/perfilEFilme/:idPerfil/:idFilme", async (req, res) => {
  const { idFilme, idPerfil } = req.params;
  try {
    const resultado = await deletarFavoritosFilmesByFilmeAndPerfil(idFilme, idPerfil);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Relação entre perfil e filme não encontrada.",
        codigo: "RELATION_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Relação entre perfil e filme removida com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar a relação entre perfil e filme.",
      codigo: "DELETE_RELATION_ERROR",
      erro: error.message,
    });
  }
});

export default routerFavoritosFilmes;
