import express from "express";
import upload from '../../middlewares/upload.js';
import { adicionarPerfil } from "../servicos/perfil/adicionar.js";
import { buscarPerfilPorId, buscarPerfilPorNome, buscarPerfil, buscarImagensPerfilPorId, buscarPerfilPorEmail } from "../servicos/perfil/buscar.js";
import { deletarPerfil } from "../servicos/perfil/deletar.js";
import { editarPerfilPut, editarPerfilPatch, transformarUserEmAdmin } from "../servicos/perfil/editar.js";
import { validarPerfilCompleto, validarPerfilParcial } from "../validacao/validacaoPerfil.js";

import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js"

const routerPerfil = express.Router();

/**
 * @swagger
 * tags:
 *   name: Perfil
 *   description: Endpoints para gerenciamento de perfil
 */

/**
 * @swagger
 * /perfil:
 *   post:
 *     summary: Adiciona um novo perfil
 *     tags: [Perfil]
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
 *               - email
*               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               biografia:
 *                 type: string
 *               senha:
 *                 type: string
 *               fotoPerfil:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Perfil adicionado com sucesso
 *       400:
 *         description: Erro de validação dos dados
 *       404:
 *         description: Não foi possível adicionar Perfil
 *       500:
 *         description: Erro interno no servidor ao adicionar Perfil
 */
routerPerfil.post("/", upload.single('fotoPerfil'), async (req, res) => {
    const { nome, email, biografia, senha } = req.body;
    const fotoPerfil = req.file ? req.file.buffer : null;
    const { valido, erros } = await validarPerfilCompleto({ nome, email });

    if (!valido) {
        return res.status(400).json({
            mensagem: "Erro de validação dos dados.",
            codigo: "VALIDATION_ERROR",
            erro: erros
        });
    }

    try {
        const resultado = await adicionarPerfil(nome, email, biografia, senha, fotoPerfil);
        if (resultado[0].affectedRows > 0) {
            return res.status(201).json({ mensagem: "Perfil adicionado com sucesso." });
        } else {
            return res.status(404).json({ mensagem: "Não foi possivel, adicionar Perfil." });
        }

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao adicionar Perfil.",
            codigo: "ADD_PERFIL_ERROR",
            erro: error.message
        });
    }
});

/**
 * @swagger
 * /perfil/{id}:
 *   put:
 *     summary: Atualiza completamente um perfil existente
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               biografia:
 *                 type: string
 *               senha:
 *                 type: string
 *               fotoPerfil:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Erro de validação dos dados
 *       404:
 *         description: Perfil não encontrado
 *       500:
 *         description: Erro ao atualizar Perfil
 */
routerPerfil.put("/:id", verifyToken, upload.single('fotoPerfil'), async (req, res) => {
    const { id } = req.user;
    const { nome, email, biografia, senha } = req.body;
    const fotoPerfil = req.file ? req.file.buffer : null;

    const { valido, erros } = await validarPerfilCompleto({ nome, email });

    if (!valido) {
        return res.status(400).json({
            mensagem: "Erro de validação dos dados.",
            codigo: "VALIDATION_ERROR",
            erro: erros
        });
    }

    try {
        const resultado = await editarPerfilPut(nome, email, biografia, senha, fotoPerfil, id);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Perfil não encontrado.",
                codigo: "PERFIL_NOT_FOUND"
            });
        }

        return res.status(200).json({ mensagem: "Perfil atualizado com sucesso." });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao atualizar Perfil.",
            codigo: "UPDATE_PERFIL_ERROR",
            erro: error.message
        });
    }
});


/**
 * @swagger
 * /perfil/adm:
 *   patch:
 *     summary: Transforma um usuário comum em administrador
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       404:
 *         description: Perfil não encontrado
 *       500:
 *         description: Erro ao atualizar Perfil
 */
routerPerfil.patch("/adm", verifyToken, isAdmin, async (req, res) => {
    const { id } = req.body;
    try {
        const resultado = await transformarUserEmAdmin(id);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Perfil não encontrado.",
                codigo: "PERFIL_NOT_FOUND"
            });
        }

        return res.status(200).json({ mensagem: "Perfil atualizado com sucesso." });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao atualizar Perfil.",
            codigo: "UPDATE_PERFIL_ERROR",
            erro: error.message
        });
    }
})

/**
 * @swagger
 * /perfil:
 *   patch:
 *     summary: Atualiza parcialmente um perfil existente
 *     tags: [Perfil]
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
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               biografia:
 *                 type: string
 *               senha:
 *                 type: string
 *               fotoPerfil:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       400:
 *         description: Nenhum dado enviado ou erro de validação
 *       404:
 *         description: Perfil não encontrado
 *       500:
 *         description: Erro ao atualizar Perfil
 */
routerPerfil.patch("/", verifyToken, upload.single('fotoPerfil'), async (req, res) => {
    const { id } = req.user;
    const { nome, email, biografia, senha, adm } = req.body;
    const fotoPerfil = req.file ? req.file.buffer : null;

    const camposAtualizar = {};
    if (nome) camposAtualizar.nome = nome;
    if (email) camposAtualizar.email = email;
    if (biografia) camposAtualizar.biografia = biografia;
    if (senha) camposAtualizar.senha = senha;
    if (adm) camposAtualizar.adm = adm;
    if (fotoPerfil) camposAtualizar.fotoPerfil = fotoPerfil;

    if (Object.keys(camposAtualizar).length === 0) {
        return res.status(400).json({
            mensagem: "Nenhum dado enviado para atualização.",
            codigo: "NO_UPDATE_DATA"
        });
    }

    const { valido, erros } = validarPerfilParcial(camposAtualizar);
    if (!valido) {
        return res.status(400).json({
            mensagem: "Erro de validação dos dados parciais.",
            codigo: "PARTIAL_VALIDATION_ERROR",
            erro: erros
        });
    }

    try {
        const resultado = await editarPerfilPatch(id, camposAtualizar);

        if (resultado.affectedRows > 0) {
            return res.status(200).json({ mensagem: "Perfil atualizado com sucesso." });
        } else {
            return res.status(404).json({
                mensagem: "Perfil não encontrado.",
                codigo: "PERFIL_NOT_FOUND"
            });
        }
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao atualizar Perfil.",
            codigo: "UPDATE_PERFIL_ERROR",
            erro: error.message
        });
    }
});

routerPerfil.patch("/:id", upload.single('fotoPerfil'), async (req, res) => {
    const { id } = req.params;
    const { nome, email, biografia, senha, adm } = req.body;
    const fotoPerfil = req.file ? req.file.buffer : null;

    const camposAtualizar = {};
    if (nome) camposAtualizar.nome = nome;
    if (email) camposAtualizar.email = email;
    if (biografia) camposAtualizar.biografia = biografia;
    if (senha) camposAtualizar.senha = senha;
    if (adm) camposAtualizar.adm = adm;
    if (fotoPerfil) camposAtualizar.fotoPerfil = fotoPerfil;

    if (Object.keys(camposAtualizar).length === 0) {
        return res.status(400).json({
            mensagem: "Nenhum dado enviado para atualização.",
            codigo: "NO_UPDATE_DATA"
        });
    }

    const { valido, erros } = validarPerfilParcial(camposAtualizar);
    if (!valido) {
        return res.status(400).json({
            mensagem: "Erro de validação dos dados parciais.",
            codigo: "PARTIAL_VALIDATION_ERROR",
            erro: erros
        });
    }

    try {
        const resultado = await editarPerfilPatch(id, camposAtualizar);

        if (resultado.affectedRows > 0) {
            return res.status(200).json({ mensagem: "Perfil atualizado com sucesso." });
        } else {
            return res.status(404).json({
                mensagem: "Perfil não encontrado.",
                codigo: "PERFIL_NOT_FOUND"
            });
        }
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao atualizar Perfil.",
            codigo: "UPDATE_PERFIL_ERROR",
            erro: error.message
        });
    }
});

/**
 * @swagger
 * /perfil:
 *   get:
 *     summary: Busca todos os perfis ou filtra por nome
 *     tags: [Perfil]
 *     parameters:
 *       - name: nome
 *         in: query
 *         description: Nome do perfil a ser buscado
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de perfis encontrados
 *       500:
 *         description: Erro ao buscar Perfil
 */
routerPerfil.get("/", async (req, res) => {
    const { nome } = req.query;

    try {
        const resultado = nome
            ? await buscarPerfilPorNome(nome)
            : await buscarPerfil();

        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao buscar Perfil.",
            codigo: "GET_PERFIL_ERROR",
            erro: error.message
        });
    }
});


routerPerfil.get("/pesquisarEmail", async (req, res) => {
    const { email } = req.query;

    try {
        const resultado = email
            ? await buscarPerfilPorEmail(email)
            : await buscarPerfil();

        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao buscar Perfil.",
            codigo: "GET_PERFIL_ERROR",
            erro: error.message
        });
    }
});

/**
 * @swagger
 * /perfil/{id}:
 *   get:
 *     summary: Busca um perfil pelo ID
 *     tags: [Perfil]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil encontrado
 *       404:
 *         description: Perfil não encontrado
 *       500:
 *         description: Erro ao buscar o Perfil
 */
routerPerfil.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await buscarPerfilPorId(id);

        if (!resultado || resultado.length === 0) {
            return res.status(404).json({
                mensagem: "Perfil não encontrado.",
                codigo: "PERFIL_NOT_FOUND"
            });
        }

        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao buscar o Perfil.",
            codigo: "GET_PERFIL_ERROR",
            erro: error.message
        });
    }
});


/**
 * @swagger
 * /perfil/fotoPerfil/{id}:
 *   get:
 *     summary: Busca a imagem de perfil (foto) pelo ID
 *     tags: [Perfil]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Erro ao buscar imagem do Perfil
 */
routerPerfil.get("/fotoPerfil/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [resultado] = await buscarImagensPerfilPorId(id);

        if (!resultado || !resultado.fotoPerfil) {
            return res.status(404).json({
                mensagem: "Imagem não encontrada.",
                codigo: "IMAGE_NOT_FOUND"
            });
        }

        res.set("Content-Type", "image/jpeg"); // Ajuste o tipo real se necessário
        return res.send(resultado.fotoPerfil);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao buscar imagem do Perfil.",
            codigo: "GET_IMAGE_ERROR",
            erro: error.message
        });
    }
});


/**
 * @swagger
 * /perfil/meuPerfil:
 *   delete:
 *     summary: Deleta o perfil do usuário autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil deletado com sucesso.
 *       404:
 *         description: Perfil não encontrado.
 *       500:
 *         description: Erro ao deletar o perfil.
 */
routerPerfil.delete("/meuPerfil", verifyToken, async (req, res) => {
    const id = req.user.id;

    try {
        const resultado = await deletarPerfil(id);
        console.log(resultado)
        if (resultado[0].affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Perfil não encontrado.",
                codigo: "PERFIL_NOT_FOUND"
            });
        }

        return res.status(200).json({ mensagem: "Perfil deletado com sucesso." });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao deletar Perfil. Esse perfil pode estar sendo usado.",
            codigo: "DELETE_PERFIL_ERROR",
            erro: error.message
        });
    }
});

/**
 * @swagger
 * /perfil/adm/{id}:
 *   delete:
 *     summary: Deleta um perfil específico (apenas para administradores)
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do perfil a ser deletado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil deletado com sucesso.
 *       404:
 *         description: Perfil não encontrado.
 *       500:
 *         description: Erro ao deletar o perfil.
 */
routerPerfil.delete("/adm/:id", verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await deletarPerfil(id);
        console.log(resultado)
        if (resultado[0].affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Perfil não encontrado.",
                codigo: "PERFIL_NOT_FOUND"
            });
        }

        return res.status(200).json({ mensagem: "Perfil deletado com sucesso." });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao deletar Perfil. Esse perfil pode estar sendo usado.",
            codigo: "DELETE_PERFIL_ERROR",
            erro: error.message
        });
    }
});



export default routerPerfil;