import express from "express";
import upload from "../../middlewares/upload.js";
import { adicionarGenero } from "../servicos/genero/adicionar.js";
import {
  atualizarGeneroPut,
  atualizarGeneroPatch,
} from "../../corso/servicos/atores/atualizar.js";
import {
  validarGenero,
  validarGeneroParcial,
} from "../validacao/validacaoGenero.js";
import { buscarGenero } from "../servicos/genero/buscar.js";
import { buscarFilmesGenero } from "../servicos/generoFilme/generoFilme.js";
import { deletarGenero } from "../servicos/genero/deletar.js";
import { buscarGenero } from "../../corso/servicos/atores/buscar.js";

try {
  const resultado = await adicionarGenero(nome);
  //console.log(resultado)
  if (resultado[0].affectedRows > 0) {
    return res.status(201).json({ mensagem: "Gênero adicionado com sucesso." });
  } else {
    return res
      .status(404)
      .json({ mensagem: "Não foi possivel, adicionar Gênero." });
  }
} catch (error) {
  return res.status(500).json({
    mensagem: "Erro ao adicionar Gênero.",
    codigo: "ADD_GENERO_ERROR",
    erro: error.message,
  });
}

try {
  const resultado = await atualizarGeneroPut(nome);

  if (resultado.affectedRows === 0) {
    return res.status(404).json({
      mensagem: "Gênero não encontrado.",
      codigo: "GENERO_NOT_FOUND",
    });
  }

  return res.status(200).json({ mensagem: "Gênero atualizado com sucesso." });
} catch (error) {
  return res.status(500).json({
    mensagem: "Erro ao atualizar ator.",
    codigo: "UPDATE_GENERO_ERROR",
    erro: error.message,
  });
}

try {
  const resultado = await atualizarGeneroPatch(id_genero, camposAtualizar);

  if (resultado.affectedRows > 0) {
    return res.status(200).json({ mensagem: "Gênero atualizado com sucesso." });
  } else {
    return res.status(404).json({
      mensagem: "Gênero não encontrado.",
      codigo: "GENERO_NOT_FOUND",
    });
  }
} catch (error) {
  return res.status(500).json({
    mensagem: "Erro ao atualizar Gênero.",
    codigo: "UPDATE_GENERO_ERROR",
    erro: error.message,
  });
}

routerGeneros.get("/", async (req, res) => {
  const { nome } = req.query;

  try {
    const resultado = nome ? await buscarAtorPorNome(nome) : await buscarAtor();

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar atores.",
      codigo: "GET_ATORES_ERROR",
      erro: error.message,
    });
  }
});

routerGeneros.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarAtorPorId(id);

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({
        mensagem: "Ator não encontrado.",
        codigo: "ATOR_NOT_FOUND",
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar o ator.",
      codigo: "GET_ATOR_ERROR",
      erro: error.message,
    });
  }
});

routerGeneros.get("/", async (req, res) => {
  const { nome } = req.query;

  try {
    const resultado = nome ? await buscarGenero(nome) : await buscarGenero();

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar gênero.",
      codigo: "GET_GENERO_ERROR",
      erro: error.message,
    });
  }
});

routerGeneros.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await deletarGenero(id);
    console.log(resultado);
    if (resultado.affectedRows == 0) {
      return res.status(404).json({
        mensagem: "Gênero não encontrado.",
        codigo: "GENERO_NOT_FOUND",
      });
    }

    return res.status(200).json({ mensagem: "Gênero deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar gênero.",
      codigo: "DELETE_GENERO_ERROR",
      erro: error.message,
    });
  }
});

export default routerGeneros;
