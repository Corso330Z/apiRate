import { buscarPerfilPorId } from "../../lavinia/servicos/perfil/buscar.js";
import { buscarFilmePorId } from "../../hiago/servicos/filmes/buscar.js";

/**
 * Valida dados para criar um comentário relacionado a um perfil e filme.
 * Pode ser usada fora de middlewares (services/controllers).
 * Retorna objeto de erro se falhar, ou null se tudo certo.
 */
export async function validarComentarioFilme({ idPerfil, idFilme, comentario }) {
  console.log(idPerfil, idFilme, comentario)
  if (!idPerfil || !idFilme || comentario === undefined) {
    return {
      status: 400,
      erro: {
        mensagem: "Campos 'idPerfil', 'idFilme' e 'comentario' são obrigatórios.",
        codigo: "CAMPOS_OBRIGATORIOS_INVALIDOS"
      }
    };
  }

  if (!Number.isInteger(idPerfil) || !Number.isInteger(idFilme)) {
    return {
      status: 400,
      erro: {
        mensagem: "'idPerfil' e 'idFilme' devem ser números inteiros.",
        codigo: "TIPO_DADO_INVALIDO"
      }
    };
  }

  if (typeof comentario !== 'string' || comentario.trim().length === 0) {
    return {
      status: 400,
      erro: {
        mensagem: "'comentario' deve ser uma string não vazia.",
        codigo: "comentario_INVALIDA"
      }
    };
  }

  try {
    const perfil = await buscarPerfilPorId(idPerfil);
    if (!perfil || perfil.length === 0) {
      return {
        status: 404,
        erro: {
          mensagem: "Perfil não encontrado.",
          codigo: "PERFIL_NAO_ENCONTRADO"
        }
      };
    }

    const filme = await buscarFilmePorId(idFilme);
    if (!filme || filme.length === 0) {
      return {
        status: 404,
        erro: {
          mensagem: "Filme não encontrado.",
          codigo: "FILME_NAO_ENCONTRADO"
        }
      };
    }

    return null; // tudo certo
  } catch (error) {
    return {
      status: 500,
      erro: {
        mensagem: "Erro ao validar dados do comentário.",
        codigo: "ERRO_VALIDACAO_COMENTARIO",
        erro: error.message
      }
    };
  }
}

/**
 * Middleware Express para validar os campos no corpo da requisição para criar comentário.
 */
export function validarComentarioBody(req, res, next) {
  const { idPerfil, idFilme, comentario } = req.body;

  if (idPerfil === undefined) {
    return res.status(400).json({
      mensagem: "O campo 'idPerfil' é obrigatório.",
      codigo: "CAMPO_IDPERFIL_OBRIGATORIO"
    });
  }
  if (idFilme === undefined) {
    return res.status(400).json({
      mensagem: "O campo 'idFilme' é obrigatório.",
      codigo: "CAMPO_IDFILME_OBRIGATORIO"
    });
  }
  if (comentario === undefined) {
    return res.status(400).json({
      mensagem: "O campo 'comentario' é obrigatório.",
      codigo: "CAMPO_comentario_OBRIGATORIO"
    });
  }

  if (!Number.isInteger(idPerfil)) {
    return res.status(400).json({
      mensagem: "O campo 'idPerfil' deve ser um número inteiro.",
      codigo: "CAMPO_IDPERFIL_INVALIDO"
    });
  }

  if (!Number.isInteger(idFilme)) {
    return res.status(400).json({
      mensagem: "O campo 'idFilme' deve ser um número inteiro.",
      codigo: "CAMPO_IDFILME_INVALIDO"
    });
  }

  if (typeof comentario !== "string" || comentario.trim().length === 0) {
    return res.status(400).json({
      mensagem: "O campo 'comentario' deve ser uma string não vazia.",
      codigo: "CAMPO_comentario_INVALIDO"
    });
  }

  next();
}
