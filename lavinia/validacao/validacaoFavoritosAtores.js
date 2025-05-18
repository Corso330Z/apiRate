import { buscarAtorPorId } from "../../corso/servicos/atores/buscar.js";
import { buscarPerfilPorId } from "../servicos/perfil/buscar.js";
import { buscarFavoritosAtoresByIdPerfilAndIdAtor } from "../servicos/favoritosAtores/busca.js";

/**
 * Valida uma relação entre um perfil e um ator para favoritos.
 * Pode ser usada fora de middlewares (em services ou controllers, por exemplo).
 * Retorna um objeto de erro se houver falha ou null se estiver tudo certo.
 */
export async function validarRelacaoFavoritosAtor({ idAtor, idPerfil }) {
  if (!idAtor || !idPerfil) {
    return {
      status: 400,
      erro: {
        mensagem: "Campos 'idAtor' e 'idPerfil' são obrigatórios.",
        codigo: "CAMPOS_OBRIGATORIOS_INVALIDOS"
      }
    };
  }

  if (!Number.isInteger(idAtor) || !Number.isInteger(idPerfil)) {
    return {
      status: 400,
      erro: {
        mensagem: "'idAtor' e 'idPerfil' devem ser números inteiros.",
        codigo: "TIPO_DADO_INVALIDO"
      }
    };
  }

  try {
    const ator = await buscarAtorPorId(idAtor);
    if (!ator || ator.length === 0) {
      return {
        status: 404,
        erro: {
          mensagem: "Ator não encontrado.",
          codigo: "ATOR_NAO_ENCONTRADO"
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

    const relacao = await buscarFavoritosAtoresByIdPerfilAndIdAtor(idPerfil, idAtor);
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
        mensagem: "Erro ao validar relação entre perfil e ator.",
        codigo: "ERRO_VALIDACAO_RELACAO_FAVORITOS",
        erro: error.message
      }
    };
  }
}

export function validarIdAtorBody(req, res, next) {
  const { idAtor } = req.body;

  if (idAtor === undefined) {
    return res.status(400).json({
      mensagem: "O campo 'idAtor' é obrigatório.",
      codigo: "CAMPO_IDATOR_OBRIGATORIO"
    });
  }

  if (!Number.isInteger(idAtor)) {
    return res.status(400).json({
      mensagem: "O campo 'idAtor' deve ser um número inteiro.",
      codigo: "CAMPO_IDATOR_INVALIDO"
    });
  }

  next();
}
