import express from "express"
import { adicionarProdutor } from "../servicos/produtor/adicionar.js";
import { buscarProdutorPorId, buscarProdutoresPorNome, buscarProdutores } from "../servicos/produtor/buscar.js";
import { editarProdutorPut } from "../servicos/produtor/editar.js";
import { deletarProdutor } from "../servicos/produtor/deletar.js";
import { validarProdutorCompleto, validarProdutorParcial } from "../validacao/validacaoProdutor.js";
const routerProdutor = express.Router();


routerProdutor.post("/", async (req, res) => {
  const { nome } = req.body;

  const { valido, erros } = await validarProdutorCompleto(nome);

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    await adicionarProdutor(nome);
    return res.status(201).json({ mensagem: "Produtor adicionado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao adicionar produtor.",
      codigo: "ADD_PRODUTOR_ERROR",
      erro: error.message
    });
  }
});

routerProdutor.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;


  const { valido, erros } = await validarProdutorCompleto(nome);

  if (!valido) {
    return res.status(400).json({
      mensagem: "Erro de validação dos dados.",
      codigo: "VALIDATION_ERROR",
      erro: erros
    });
  }

  try {
    const resultado = await editarProdutorPut(nome, id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Produtor não encontrado.",
        codigo: "PRODUTOR_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Produtor atualizado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar produtor.",
      codigo: "UPDATE_PRODUTOR_ERROR",
      erro: error.message
    });
  }
});

routerProdutor.get("/", async (req, res) => {
  const { nome } = req.query;

  try {
    const resultado = nome
      ? await buscarProdutoresPorNome(nome)
      : await buscarProdutores();

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar produtores.",
      codigo: "GET_PRODUTORES_ERROR",
      erro: error.message
    });
  }
});

routerProdutor.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await buscarProdutorPorId(id);

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({
        mensagem: "Produtor não encontrado.",
        codigo: "PRODUTOR_NOT_FOUND"
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar o produtor.",
      codigo: "GET_PRODUTOR_ERROR",
      erro: error.message
    });
  }
});

routerProdutor.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await deletarProdutor(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Produtor não encontrado.",
        codigo: "PRODUTOR_NOT_FOUND"
      });
    }

    return res.status(200).json({ mensagem: "Produtor deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar produtor.",
      codigo: "DELETE_PRODUTOR_ERROR",
      erro: error.message
    });
  }
});


export default routerProdutor