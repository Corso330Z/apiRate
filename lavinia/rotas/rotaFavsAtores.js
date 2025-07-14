import express from "express";
import {
  buscarFavoritosAtores,
  buscarFavoritosAtoresByIdAtor,
  buscarFavoritosAtoresByIdPerfilAndIdAtor,
  buscarFavoritosAtoresByIdPerfil,
} from "../servicos/favoritosAtores/busca.js";

import {
  deletarFavoritosAtoresByPerfil,
  deletarFavoritosAtoresByAtor,
  deletarFavoritosAtoresByAtorAndPerfil,
} from "../servicos/favoritosAtores/deletar.js";

import { adicionarFavoritosAtores } from "../servicos/favoritosAtores/adicionar.js";
import { validarRelacaoFavoritosAtor, validarIdAtorBody } from "../validacao/validacaoFavoritosAtores.js";
import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js";

const routerFavoritosAtores = express.Router();

/**
 * @swagger
 * tags:
 *   name: Favoritos atores
 *   description: Endpoints para gerenciar a lista de atores favoritos.
 */

/**
 * @swagger
 * /favoritosAtores:
 *   get:
 *     summary: Lista todas as relações entre perfis e atores favoritos
 *     tags: [Favoritos atores]
 *     responses:
 *       200:
 *         description: Lista de relações retornada com sucesso
 *       500:
 *         description: Erro ao buscar as relações entre perfis e atores favoritos
 */
routerFavoritosAtores.get("/", async (req, res) => {
  try {
    const resultado = await buscarFavoritosAtores();
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar as relações entre perfis e atores favoritos.",
      codigo: "GET_FAVORITOS_ATORES_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /favoritosAtores/perfil/meuPerfil:
 *   get:
 *     summary: Retorna a lista de atores favoritos do perfil autenticado
 *     tags: [Favoritos atores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de atores favoritos do perfil retornada com sucesso
 *       500:
 *         description: Erro ao buscar a lista de atores favoritos do perfil
 */
routerFavoritosAtores.get("/perfil/:idPerfil", async (req, res) => {
  const idPerfil = req.params.idPerfil;
  try {
    const resultado = await buscarFavoritosAtoresByIdPerfil(idPerfil);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar a lista de atores favoritos do perfil.",
      codigo: "GET_ATORES_FAVORITOS_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /favoritosAtores/perfil/{idPerfil}:
 *   get:
 *     summary: Retorna a lista de atores favoritos de um perfil específico
 *     tags: [Favoritos atores]
 *     parameters:
 *       - in: path
 *         name: idPerfil
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil
 *     responses:
 *       200:
 *         description: Lista de atores favoritos do perfil retornada com sucesso
 *       500:
 *         description: Erro ao buscar a lista de atores favoritos do perfil
 */
routerFavoritosAtores.get("/perfil/:idPerfil", async (req, res) => {
  const { idPerfil } = req.params;
  try {
    const resultado = await buscarFavoritosAtoresByIdPerfil(idPerfil);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar a lista de atores favoritos do perfil.",
      codigo: "GET_ATORES_FAVORITOS_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /favoritosAtores/ator/{idAtor}:
 *   get:
 *     summary: Retorna as relações de favoritos de um ator específico
 *     tags: [Favoritos atores]
 *     parameters:
 *       - in: path
 *         name: idAtor
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ator
 *     responses:
 *       200:
 *         description: Relações encontradas e retornadas com sucesso
 *       500:
 *         description: Erro ao buscar o ator nos favoritos
 */
routerFavoritosAtores.get("/ator/:idAtor", async (req, res) => {
  const { idAtor } = req.params;
  try {
    const resultado = await buscarFavoritosAtoresByIdAtor(idAtor);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar o ator nos favoritos.",
      codigo: "GET_FAVORITOS_ATOR_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /favoritosAtores/perfilEAtor/{idPerfil}/{idAtor}:
 *   get:
 *     summary: Retorna a relação entre perfil e ator favorito específico
 *     tags: [Favoritos atores]
 *     parameters:
 *       - in: path
 *         name: idPerfil
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil
 *       - in: path
 *         name: idAtor
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ator
 *     responses:
 *       200:
 *         description: Relação entre perfil e ator retornada com sucesso
 *       500:
 *         description: Erro ao buscar a relação entre perfil e ator favorito
 */
routerFavoritosAtores.get("/perfilEAtor/:idPerfil/:idAtor", async (req, res) => {
  const { idAtor, idPerfil } = req.params;
  try {
    const resultado = await buscarFavoritosAtoresByIdPerfilAndIdAtor(idPerfil, idAtor);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar a relação entre perfil e ator favorito.",
      codigo: "GET_FAVORITOS_PERFIL_ATOR_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /favoritosAtores/adm:
 *   post:
 *     summary: Adiciona um ator aos favoritos de um perfil (admin)
 *     tags: [Favoritos atores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idAtor
 *               - idPerfil
 *             properties:
 *               idAtor:
 *                 type: integer
 *                 description: ID do ator a ser adicionado
 *               idPerfil:
 *                 type: integer
 *                 description: ID do perfil que adiciona o ator
 *     responses:
 *       201:
 *         description: Ator adicionado aos favoritos com sucesso
 *       400:
 *         description: Não foi possível adicionar o ator aos favoritos
 *       401:
 *         description: Não autorizado (token inválido ou usuário não admin)
 *       500:
 *         description: Erro ao criar a relação entre perfil e ator favorito
 */
routerFavoritosAtores.post("/adm", verifyToken, isAdmin, async (req, res) => {
  const { idAtor, idPerfil } = req.body;

  try {
    const erroValidacao = await validarRelacaoFavoritosAtor({ idAtor, idPerfil });

    if (erroValidacao) {
      return res.status(erroValidacao.status).json(erroValidacao.erro);
    }
    const resultado = await adicionarFavoritosAtores(idAtor, idPerfil);
    if (resultado[0].affectedRows > 0) {
      return res.status(201).json({ mensagem: "Ator adicionado aos favoritos com sucesso." });
    } else {
      return res.status(400).json({ mensagem: "Não foi possível adicionar o ator aos favoritos." });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar a relação entre perfil e ator favorito.",
      codigo: "ADD_FAVORITOS_ATOR_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /favoritosAtores:
 *   post:
 *     summary: Adiciona um ator aos favoritos do perfil autenticado
 *     tags: [Favoritos atores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idAtor
 *             properties:
 *               idAtor:
 *                 type: integer
 *                 description: ID do ator a ser adicionado
 *     responses:
 *       201:
 *         description: Ator adicionado aos favoritos com sucesso
 *       400:
 *         description: Não foi possível adicionar o ator aos favoritos
 *       401:
 *         description: Não autorizado (token inválido)
 *       500:
 *         description: Erro ao criar a relação entre perfil e ator favorito
 */
routerFavoritosAtores.post("/:id", async (req, res) => {
  const { idAtor } = req.body;
  const idPerfil = req.params.id;
  try {
    const erroValidacao = await validarRelacaoFavoritosAtor({ idAtor, idPerfil });

    if (erroValidacao) {
      return res.status(erroValidacao.status).json(erroValidacao.erro);
    }
    const resultado = await adicionarFavoritosAtores(idAtor, idPerfil);
    if (resultado[0].affectedRows > 0) {
      return res.status(201).json({ mensagem: "Ator adicionado aos favoritos com sucesso." });
    } else {
      return res.status(400).json({ mensagem: "Não foi possível adicionar o ator aos favoritos." });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar a relação entre perfil e ator favorito.",
      codigo: "ADD_FAVORITOS_ATOR_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /favoritosAtores/ator/{idAtor}:
 *   delete:
 *     summary: Deleta todas as relações de favoritos de um ator (admin)
 *     tags: [Favoritos atores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idAtor
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ator a ser removido
 *     responses:
 *       200:
 *         description: Relações do ator deletadas com sucesso
 *       404:
 *         description: Nenhuma relação encontrada para este ator
 *       401:
 *         description: Não autorizado (token inválido ou usuário não admin)
 *       500:
 *         description: Erro ao deletar as relações do ator nos favoritos
 */
routerFavoritosAtores.delete("/ator/:idAtor", verifyToken, isAdmin, async (req, res) => {
  const { idAtor } = req.params;
  try {
    const resultado = await deletarFavoritosAtoresByAtor(idAtor);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Nenhuma relação encontrada para este ator.",
        codigo: "ATOR_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Relações do ator deletadas com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar as relações do ator nos favoritos.",
      codigo: "DELETE_ATOR_ERROR",
      erro: error.message,
    });
  }
});


/**
 * @swagger
 * /favoritosAtores/perfil:
 *   delete:
 *     summary: Deleta todas as relações de favoritos do perfil autenticado
 *     tags: [Favoritos atores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Atores favoritos do perfil removidos com sucesso
 *       404:
 *         description: Nenhuma relação encontrada para este perfil
 *       401:
 *         description: Não autorizado (token inválido)
 *       500:
 *         description: Erro ao deletar os atores favoritos do perfil
 */
routerFavoritosAtores.delete("/perfil", verifyToken, async (req, res) => {
  const idPerfil = req.user.id;
  try {
    const resultado = await deletarFavoritosAtoresByPerfil(idPerfil);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Nenhuma relação encontrada para este perfil.",
        codigo: "FAVORITOS_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Atores favoritos do perfil removidos com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar os atores favoritos do perfil.",
      codigo: "DELETE_FAVORITOS_ERROR",
      erro: error.message,
    });
  }
});

/**
 * @swagger
 * /favoritosAtores/perfilEAtor/{idPerfil}/{idAtor}:
 *   delete:
 *     summary: Deleta a relação entre perfil e ator favorito
 *     tags: [Favoritos atores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPerfil
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do perfil
 *       - in: path
 *         name: idAtor
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ator
 *     responses:
 *       200:
 *         description: Relação entre perfil e ator removida com sucesso
 *       404:
 *         description: Relação entre perfil e ator não encontrada
 *       401:
 *         description: Não autorizado (token inválido)
 *       500:
 *         description: Erro ao deletar a relação entre perfil e ator
 */
routerFavoritosAtores.delete("/perfilEAtor/:idPerfil/:idAtor", async (req, res) => {
  const { idAtor, idPerfil } = req.params;
  try {
    const resultado = await deletarFavoritosAtoresByAtorAndPerfil(idAtor, idPerfil);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Relação entre perfil e ator não encontrada.",
        codigo: "RELATION_NOT_FOUND",
      });
    }
    return res.status(200).json({ mensagem: "Relação entre perfil e ator removida com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar a relação entre perfil e ator.",
      codigo: "DELETE_RELATION_ERROR",
      erro: error.message,
    });
  }
});

export default routerFavoritosAtores;
