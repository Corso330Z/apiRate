import { buscarGeneroPorId } from "../servicos/genero/buscar.js";
import { buscarFilmePorId } from "../../hiago/servicos/filmes/buscar.js";
import { buscarRelacaoDeGeneroEFilme } from "../servicos/generosFilmes/busca.js";

export async function validarCriacaoRelacaoGeneroFilme(req, res, next) {
    const { idFilme, idGenero } = req.body;

    // Checagem básica
    if (!idFilme || !idGenero) {
        return res.status(400).json({
            mensagem: "Campos 'idFilme' e 'idGenero' são obrigatórios."
        });
    }

    if (!Number.isInteger(idFilme) || !Number.isInteger(idGenero)) {
        return res.status(400).json({
            mensagem: "'idFilme' e 'idGenero' devem ser números inteiros."
        });
    }

    try {
        // Verificar se o filme existe
        const filme = await buscarFilmePorId(idFilme);
        if (filme.length === 0) {
            return res.status(404).json({ mensagem: "Filme não encontrado." });
        }

        // Verificar se o gênero existe
        const genero = await buscarGeneroPorId(idGenero);
        if (genero.length === 0) {
            return res.status(404).json({ mensagem: "Gênero não encontrado." });
        }

        // Verificar se a relação já existe
        const relacaoGeneroFilme = await buscarRelacaoDeGeneroEFilme(idFilme, idGenero);
        if (relacaoGeneroFilme.length > 0) {
            return res.status(400).json({ mensagem: "Essa relação já existe." });
        }

        // Tudo certo, segue para a próxima função
        next();
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao validar dados.",
            codigo: "VALIDACAO_RELACAO_GENERO_FILME",
            erro: error.message,
        });
    }
}
