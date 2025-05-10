import express from "express";
import upload from '../../middlewares/upload.js';
import { adicionarAtor } from "../servicos/atores/adicionar.js";
import { buscarAtorPorId, buscarAtorPorNome, buscarAtor, buscarImagensAtorPorId } from "../servicos/atores/buscar.js";
import { deletarAtor } from "../servicos/atores/deletar.js";
import { atualizarAtorPut, atualizarAtorPatch } from "../servicos/atores/atualizar.js";
import { validarAtorCompleto, validarAtorParcial } from "../validacao/validacaoAtores.js";

const routerAtores = express.Router();

routerAtores.post("/", upload.single('fotoAtor'), async (req, res) => {
  const { nome, dataNasc, vivo } = req.body;
  const fotoAtor = req.file ? req.file.buffer : null;

  const { valido, erros } = await validarAtorCompleto({ nome, dataNasc, vivo });

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    await adicionarAtor(nome, dataNasc, vivo, fotoAtor);
    return res.status(201).json({ mensagem: "Ator adicionado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao adicionar ator.",
      codigo: "ADD_ATOR_ERROR",
      erro: error.message
    });
  }
});

routerAtores.put("/:id", upload.single('fotoAtor'), async (req, res) => {
  const { id } = req.params;
  const { nome, dataNasc, vivo } = req.body;
  const fotoAtor = req.file ? req.file.buffer : null;

  const { valido, erros } = await validarAtorCompleto({ nome, dataNasc, vivo });

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await atualizarAtorPut(nome, dataNasc, vivo, fotoAtor, id);

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

routerAtores.patch("/:id", upload.single('fotoAtor'), async (req, res) => {
  const { id } = req.params;
  const { nome, dataNasc, vivo } = req.body;
  const fotoAtor = req.file ? req.file.buffer : null;

  const camposAtualizar = {};
  if (nome) camposAtualizar.nome = nome;
  if (dataNasc) camposAtualizar.dataNasc = dataNasc;
  if (vivo) camposAtualizar.vivo = vivo;
  if (fotoAtor) camposAtualizar.fotoAtor = fotoAtor;

  if (Object.keys(camposAtualizar).length === 0) {
    return res.status(400).json({
      mensagem: "Nenhum dado enviado para atualização.",
      codigo: "NO_UPDATE_DATA"
    });
  }

  const { valido, erros } = validarAtorParcial(camposAtualizar);
  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados parciais.",
      codigo: "PARTIAL_VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await atualizarAtorPatch(id, camposAtualizar);

    if (resultado.affectedRows > 0) {
      return res.status(200).json({ mensagem: "Ator atualizado com sucesso." });
    } else {
      return res.status(404).json({
        mensagem: "Ator não encontrado.",
        codigo: "ATOR_NOT_FOUND"
      });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar ator.",
      codigo: "UPDATE_ATOR_ERROR",
      erro: error.message
    });
  }
});

routerAtores.get("/", async (req, res) => {
  const { nome } = req.query;

  try {
    const resultado = nome
      ? await buscarAtorPorNome(nome)
      : await buscarAtor();

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar atores.",
      codigo: "GET_ATORES_ERROR",
      erro: error.message
    });
  }
});

routerAtores.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarAtorPorId(id);

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

routerAtores.get("/imagem/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await buscarImagensAtorPorId(id);

    if (!resultado || !resultado.fotoAtor) {
      return res.status(404).json({
        mensagem: "Imagem não encontrada.",
        codigo: "IMAGE_NOT_FOUND"
      });
    }

    res.set("Content-Type", "image/jpeg"); // Ajuste o tipo real se necessário
    return res.send(resultado.fotoAtor);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar imagem do ator.",
      codigo: "GET_IMAGE_ERROR",
      erro: error.message
    });
  }
});

routerAtores.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await deletarAtor(id);

    if (resultado.affectedRows === 0) {
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


export default routerAtores;