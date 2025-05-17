import express from "express";
import { adicionarSugestoesAtores } from "../servicos/sugsAtores/adicionar.js";
import { buscarSugestaoAtorPorId, buscarSugestaoAtorPorNome, buscarSugestaoAtor } from "../servicos/sugsAtores/buscar.js";
import { deletarSugestaoAtor, deletarSugestaoAtorAdm } from "../servicos/sugsAtores/deletar.js";
import { atualizarSugestaoAtorPut, atualizarSugestaoAtorPutAdm } from "../servicos/sugsAtores/atualizar.js";
import { validarSugestaoAtorCompleto } from "../validacao/validacaoAtores.js";

import { verifyToken, isAdmin } from "../../middlewares/verifyToken.js"
const routerSugestaoAtores = express.Router();

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

routerSugestaoAtores.put("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { idpefil } = req.user
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


routerSugestaoAtores.get("/", async (req, res) => {
    const { nome } = req.query;

    try {
        const resultado = nome
            ? await buscarSugestaoAtorPorNome(nome)
            : await buscarSugestaoAtor();

        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao buscar atores.",
            codigo: "GET_ATORES_ERROR",
            erro: error.message
        });
    }
});


routerSugestaoAtores.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await buscarSugestaoAtorPorId(id);

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


routerSugestaoAtores.delete("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { idpefil } = req.user

    try {
        const resultado = await deletarSugestaoAtor(id, idpefil);
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
            mensagem: "Erro ao deletar ator.",
            codigo: "DELETE_ATOR_ERROR",
            erro: error.message
        });
    }
});

routerSugestaoAtores.delete("/adm/:id", verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await deletarSugestaoAtorAdm(id);
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
            mensagem: "Erro ao deletar ator.",
            codigo: "DELETE_ATOR_ERROR",
            erro: error.message
        });
    }
});

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

export default routerSugestaoAtores;