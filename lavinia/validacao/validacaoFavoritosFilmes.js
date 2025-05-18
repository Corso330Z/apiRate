import { buscarFilmePorId } from "../../hiago/servicos/filmes/buscar.js";
import { buscarPerfilPorId } from "../servicos/perfil/buscar.js";
import { buscarFavoritosFilmesByIdPefilAndIdFilme } from "../servicos/favoritosFilmes/busca.js";

/**
 * Valida uma relação entre um perfil e um filme para favoritos.
 * Pode ser usada fora de middlewares (em services ou controllers, por exemplo).
 * Retorna um objeto de erro se houver falha ou null se estiver tudo certo.
 */
export async function validarRelacaoFavoritosFilme({ idFilme, idPerfil }) {
  if (!idFilme || !idPerfil) {
    return {
      status: 400,
      erro: {
        mensagem: "Campos 'idFilme' e 'idPerfil' são obrigatórios.",
        codigo: "CAMPOS_OBRIGATORIOS_INVALIDOS"
      }
    };
  }

  if (!Number.isInteger(idFilme) || !Number.isInteger(idPerfil)) {
    return {
      status: 400,
      erro: {
        mensagem: "'idFilme' e 'idPerfil' devem ser números inteiros.",
        codigo: "TIPO_DADO_INVALIDO"
      }
    };
  }

  try {
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

    const relacao = await buscarFavoritosFilmesByIdPefilAndIdFilme(idPerfil, idFilme);
    if (relacao.length > 0) {
      return {
        status: 409,
        erro: {
          mensagem: "Esta relação já existe.",
          codigo: "RELACAO_JA_EXISTENTE"
        }
      };
    }

    return null; // ✅ Tudo certo!
  } catch (error) {
    return {
      status: 500,
      erro: {
        mensagem: "Erro ao validar relação entre perfil e filme.",
        codigo: "ERRO_VALIDACAO_RELACAO_FAVORITOS",
        erro: error.message
      }
    };
  }
}


export function validarIdFilmeBody(req, res, next) {
  const { idFilme } = req.body;

  if (idFilme === undefined) {
    return res.status(400).json({
      mensagem: "O campo 'idFilme' é obrigatório.",
      codigo: "CAMPO_IDFILME_OBRIGATORIO"
    });
  }

  if (!Number.isInteger(idFilme)) {
    return res.status(400).json({
      mensagem: "O campo 'idFilme' deve ser um número inteiro.",
      codigo: "CAMPO_IDFILME_INVALIDO"
    });
  }

  next();
}