import express from "express";
import upload from '../../middlewares/upload.js';
import { adicionarFilme } from "../servicos/filmes/adicionar.js";
import { buscarFilmePorId, buscarFilmesPorNome, buscarFilmes, buscarImagensFilmePorId } from "../servicos/filmes/buscar.js";
import { deletarFilme } from "../servicos/filmes/deletar.js";
import { editarFilmePut, editarFilmePatch } from "../servicos/filmes/editar.js";
import { validarFilmeCompleto, validarFilmeParcial } from "../validacao/validacaoFilmes.js";

const routerFilmes = express.Router();

routerFilmes.post("/", upload.single('fotoFilme'), async (req, res) => {
  const { nome, dataLanc, sinopse, classInd } = req.body;
  const fotoFilme = req.file ? req.file.buffer : null;

  const { valido, erros } = await validarFilmeCompleto({ nome, dataLanc, sinopse, classInd });

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    await adicionarFilme(nome, dataLanc, sinopse, classInd, fotoFilme);
    return res.status(201).json({ mensagem: "Filme adicionado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao adicionar filme.",
      codigo: "ADD_FILME_ERROR",
      erro: error.message
    });
  }
});

routerFilmes.put("/:id", upload.single('fotoFilme'), async (req, res) => {
  const { id } = req.params;
  const { nome, dataLanc, sinopse, classInd } = req.body;
  const fotoFilme = req.file ? req.file.buffer : null;

  const { valido, erros } = await validarFilmeCompleto({ nome, dataLanc, sinopse, classInd });

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await editarFilmePut(nome, dataLanc, sinopse, classInd, fotoFilme, id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Filme não encontrado.",
        codigo: "FILME_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Filme atualizado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar filme.",
      codigo: "UPDATE_FILME_ERROR",
      erro: error.message
    });
  }
});

routerFilmes.patch("/:id", upload.single('fotoFilme'), async (req, res) => {
  const { id } = req.params;
  const { nome, dataLanc, sinopse, classInd } = req.body;
  const fotoFilme = req.file ? req.file.buffer : null;

  const camposAtualizar = {};
  if (nome) camposAtualizar.nome = nome;
  if (dataLanc) camposAtualizar.dataLanc = dataLanc;
  if (sinopse) camposAtualizar.sinopse = sinopse;
  if (classInd) camposAtualizar.classInd = classInd;
  if (fotoFilme) camposAtualizar.fotoFilme = fotoFilme;

  if (Object.keys(camposAtualizar).length === 0) {
    return res.status(400).json({
      mensagem: "Nenhum dado enviado para atualização.",
      codigo: "NO_UPDATE_DATA"
    });
  }

  const { valido, erros } = validarFilmeParcial(camposAtualizar);
  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados parciais.",
      codigo: "PARTIAL_VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await editarFilmePatch(id, camposAtualizar);

    if (resultado.affectedRows > 0) {
      return res.status(200).json({ mensagem: "Filme atualizado com sucesso." });
    } else {
      return res.status(404).json({
        mensagem: "Filme não encontrado.",
        codigo: "FILME_NOT_FOUND"
      });
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar filme.",
      codigo: "UPDATE_FILME_ERROR",
      erro: error.message
    });
  }
});

routerFilmes.get("/", async (req, res) => {
  const { nome } = req.query;

  try {
    const resultado = nome
      ? await buscarFilmesPorNome(nome)
      : await buscarFilmes();

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar filmes.",
      codigo: "GET_FILMES_ERROR",
      erro: error.message
    });
  }
});

routerFilmes.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarFilmePorId(id);

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({
        mensagem: "Filme não encontrado.",
        codigo: "FILME_NOT_FOUND"
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar o filme.",
      codigo: "GET_FILME_ERROR",
      erro: error.message
    });
  }
});

routerFilmes.get("/imagem/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await buscarImagensFilmePorId(id);

    if (!resultado || !resultado.fotoFilme) {
      return res.status(404).json({
        mensagem: "Imagem não encontrada.",
        codigo: "IMAGE_NOT_FOUND"
      });
    }

    res.set("Content-Type", "image/jpeg"); // Ajuste o tipo real se necessário
    return res.send(resultado.fotoFilme);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar imagem do filme.",
      codigo: "GET_IMAGE_ERROR",
      erro: error.message
    });
  }
});

routerFilmes.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await deletarFilme(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Filme não encontrado.",
        codigo: "FILME_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Filme deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar filme.",
      codigo: "DELETE_FILME_ERROR",
      erro: error.message
    });
  }
});


export default routerFilmes;