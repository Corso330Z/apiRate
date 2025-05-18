import express from "express";
import {
  buscarTodosComentarios,
  buscarComentarioPorId,
  buscarComentariosPorFilme,
  buscarComentariosPorPerfil,
  adicionarComentario,
  editarComentario,
  deletarComentarioPorId,
  deletarComentariosPorFilme,
  deletarComentariosPorPerfil,
} from "../servicos/comentarios.js";

const routerComentarios = express.Router();


routerComentarios.get("/", async (req, res) => {
  try {
    const comentarios = await buscarTodosComentarios();
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar comentários", erro: error.message });
  }
});

routerComentarios.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const comentario = await buscarComentarioPorId(Number(id));
    if (comentario.length === 0) {
      return res.status(404).json({ mensagem: "Comentário não encontrado." });
    }
    res.status(200).json(comentario[0]);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar comentário", erro: error.message });
  }
});

routerComentarios.get("/filme/:idFilme", async (req, res) => {
  const { idFilme } = req.params;
  try {
    const comentarios = await buscarComentariosPorFilme(Number(idFilme));
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar comentários do filme", erro: error.message });
  }
});

routerComentarios.get("/perfil/:idPerfil", async (req, res) => {
  const { idPerfil } = req.params;
  try {
    const comentarios = await buscarComentariosPorPerfil(Number(idPerfil));
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar comentários do perfil", erro: error.message });
  }
});

routerComentarios.post("/", async (req, res) => {
  const dadosComentario = req.body;
  try {
    await adicionarComentario(dadosComentario);
    res.status(201).json({ mensagem: "Comentário criado com sucesso." });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao criar comentário", erro: error.message });
  }
});

routerComentarios.patch("/", async (req, res) => {
  const dadosEdicao = req.body;
  try {
    const result = await editarComentario(dadosEdicao);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Comentário não encontrado para edição." });
    }
    res.status(200).json({ mensagem: "Comentário atualizado com sucesso." });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao editar comentário", erro: error.message });
  }
});


routerComentarios.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deletarComentarioPorId(Number(id));
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Comentário não encontrado para deletar." });
    }
    res.status(200).json({ mensagem: "Comentário deletado com sucesso." });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao deletar comentário", erro: error.message });
  }
});

routerComentarios.delete("/filme/:idFilme", async (req, res) => {
  const { idFilme } = req.params;
  try {
    await deletarComentariosPorFilme(Number(idFilme));
    res.status(200).json({ mensagem: "Comentários do filme deletados com sucesso." });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao deletar comentários do filme", erro: error.message });
  }
});

routerComentarios.delete("/perfil/:idPerfil", async (req, res) => {
  const { idPerfil } = req.params;
  try {
    await deletarComentariosPorPerfil(Number(idPerfil));
    res.status(200).json({ mensagem: "Comentários do perfil deletados com sucesso." });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao deletar comentários do perfil", erro: error.message });
  }
});

export default routerComentarios;
