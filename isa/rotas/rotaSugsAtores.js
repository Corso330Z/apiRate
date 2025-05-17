import express from "express";
import { adicionarSugestoesAtores } from "../servicos/sugsAtores/adicionar.js";
import { buscarSugestaoAtorPorId, buscarSugestaoAtorPorNome, buscarSugestaoAtor } from "../servicos/sugsAtores/buscar.js";
import { deletarSugestaoAtor, deletarSugestaoAtorAdm } from "../servicos/sugsAtores/deletar.js";
import { atualizarSugestaoAtorPut, atualizarSugestaoAtorPutAdm } from "../servicos/sugsAtores/atualizar.js";
import { validarSugestaoAtorCompleto } from "../validacao/validacaoSugsAtores.js";

import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js"
const routerSugestaoAtores = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sugestões de atores
 *   description: Endpoints para gerenciar sugestões de atores feitas por usuários
 */


/**
 * @swagger
 * /sugestaoAtores:
 *   post:
 *     summary: Adiciona uma sugestão de ator
 *     tags: [Sugestões de atores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *             required:
 *               - nome
 *     responses:
 *       201:
 *         description: Sugestão de ator adicionada com sucesso.
 *       400:
 *         description: Erro de validação.
 *       500:
 *         description: Erro ao adicionar sugestão de ator.
 */
routerSugestaoAtores.post("/", verifyToken, async (req, res) => {
    const { id } = req.user;
    const { nome } = req.body;


    const { valido, erros } = await validarSugestaoAtorCompleto({ nome });

    if (!valido) {
        return res.status(400).json({
            mensagem: "Erro de validação dos dados.",
            codigo: "VALIDATION_ERROR",
            erro: erros
        });
    }

    try {
        const resultado = await adicionarSugestoesAtores(id, nome);
        //console.log(resultado)
        if (resultado[0].affectedRows > 0) {
            return res.status(201).json({ mensagem: "Sugestão de ator adicionada com sucesso." });
        } else {
            return res.status(404).json({ mensagem: "Não foi possivel, adicionar sugestão de ator." });
        }
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao adicionar sugestão de ator.",
            codigo: "ADD_ATOR_ERROR",
            erro: error.message
        });
    }
});



/**
 * @swagger
 * /sugestaoAtores/{id}:
 *   put:
 *     summary: Atualiza uma sugestão de ator feita pelo usuário autenticado
 *     tags: [Sugestões de atores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da sugestão de ator
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sugestão de ator atualizada com sucesso.
 *       400:
 *         description: Erro de validação.
 *       404:
 *         description: Sugestão de ator não encontrada.
 *       500:
 *         description: Erro interno ao atualizar a sugestão de ator.
 */
routerSugestaoAtores.put("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const idpefil = req.user.id
    const { nome } = req.body;

    const { valido, erros } = await validarSugestaoAtorCompleto({ nome });

    if (!valido) {
        return res.status(400).json({
            mensagem: "Erro de validação dos dados.",
            codigo: "VALIDATION_ERROR",
            erro: erros
        });
    }

    try {
        const resultado = await atualizarSugestaoAtorPut(nome, id, idpefil);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Sugestão de ator não encontrada.",
                codigo: "ATOR_NOT_FOUND"
            });
        }

        return res.status(200).json({ mensagem: "Sugestão de ator atualizada com sucesso." });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao atualizar sugestão de ator.",
            codigo: "UPDATE_SUGESTAO_ATOR_ERROR",
            erro: error.message
        });
    }
});


/**
 * @swagger
 * /sugestaoAtores:
 *   get:
 *     summary: Lista todas as sugestões de atores (ou filtra por nome)
 *     tags: [Sugestões de atores]
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Nome da sugestão de ator para filtrar
 *     responses:
 *       200:
 *         description: Lista de atores.
 *       500:
 *         description: Erro interno ao buscar os atores.
 */
routerSugestaoAtores.get("/", async (req, res) => {
    const { nome } = req.query;

    try {
        const resultado = nome
            ? await buscarSugestaoAtorPorNome(nome)
            : await buscarSugestaoAtor();

        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao buscar sugestão de atores.",
            codigo: "GET_ATORES_ERROR",
            erro: error.message
        });
    }
});


/**
 * @swagger
 * /sugestaoAtores/{id}:
 *   get:
 *     summary: Busca uma sugestão de ator por ID
 *     tags: [Sugestões de atores]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da sugestão de ator
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sugestão de ator encontrada.
 *       404:
 *         description: Sugestão de ator não encontrada.
 *       500:
 *         description: Erro interno ao buscar o ator.
 */
routerSugestaoAtores.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await buscarSugestaoAtorPorId(id);

        if (!resultado || resultado.length === 0) {
            return res.status(404).json({
                mensagem: "Sugestão de ator não encontrada.",
                codigo: "ATOR_NOT_FOUND"
            });
        }

        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao buscar a sugestão de ator.",
            codigo: "GET_SUGESTAO_ATOR_ERROR",
            erro: error.message
        });
    }
});


/**
 * @swagger
 * /sugestaoAtores/{id}:
 *   delete:
 *     summary: Remove uma sugestão de ator feita pelo usuário autenticado
 *     tags: [Sugestões de atores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da sugestão de ator
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sugestão de ator deletada com sucesso.
 *       404:
 *         description: Sugestão de ator não encontrada.
 *       500:
 *         description: Erro interno ao deletar o ator.
 */
routerSugestaoAtores.delete("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const idpefil = req.user.id;
    if (!id || !idpefil) {
        return res.status(404).json({
            mensagem: "precisa ser o dono ou um adm para excluir.",
            codigo: "ATOR_NOT_FOUND"
        });
    }
    try {
        const resultado = await deletarSugestaoAtor(id, idpefil);
        //console.log(resultado)
        if (resultado.affectedRows == 0) {
            return res.status(404).json({
                mensagem: "Sugestão de ator não encontrada.",
                codigo: "ATOR_NOT_FOUND"
            });
        }

        return res.status(200).json({ mensagem: "Sugestão de ator deletada com sucesso." });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao deletar ator.",
            codigo: "DELETE_ATOR_ERROR",
            erro: error.message
        });
    }
});

/**
 * @swagger
 * /sugestaoAtores/adm/{id}:
 *   delete:
 *     summary: Remove uma sugestão de ator (somente admin)
 *     tags: [Sugestões de atores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da sugestão de ator
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sugestão de ator deletada com sucesso.
 *       404:
 *         description: Sugestão de ator não encontrada.
 *       500:
 *         description: Erro interno ao deletar o ator.
 */
routerSugestaoAtores.delete("/adm/:id", verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await deletarSugestaoAtorAdm(id);
        //console.log(resultado)
        if (resultado.affectedRows == 0) {
            return res.status(404).json({
                mensagem: "Sugestão de ator não encontrada.",
                codigo: "ATOR_NOT_FOUND"
            });
        }

        return res.status(200).json({ mensagem: "Sugestão de ator deletada com sucesso." });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao deletar ator.",
            codigo: "DELETE_ATOR_ERROR",
            erro: error.message
        });
    }
});

/**
 * @swagger
 * /sugestaoAtores/adm/{id}:
 *   put:
 *     summary: Atualiza uma sugestão de ator (somente admin)
 *     tags: [Sugestões de atores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da sugestão de ator
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sugestão de ator atualizada com sucesso.
 *       400:
 *         description: Erro de validação.
 *       404:
 *         description: Sugestão de ator não encontrada.
 *       500:
 *         description: Erro interno ao atualizar a sugestão de ator.
 */
routerSugestaoAtores.put("/adm/:id", verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    const { valido, erros } = await validarSugestaoAtorCompleto({ nome });

    if (!valido) {
        return res.status(400).json({
            mensagem: "Erro de validação dos dados.",
            codigo: "VALIDATION_ERROR",
            erro: erros
        });
    }

    try {
        const resultado = await atualizarSugestaoAtorPutAdm(nome, id);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Sugestão de ator não encontrada.",
                codigo: "ATOR_NOT_FOUND"
            });
        }

        return res.status(200).json({ mensagem: "Sugestão de ator atualizada com sucesso." });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao atualizar sugestão de ator.",
            codigo: "UPDATE_SUGESTAO_ATOR_ERROR",
            erro: error.message
        });
    }
});

export default routerSugestaoAtores;