import { buscarAtorPorId } from "../servicos/atores/buscar.js";
import { buscarFilmePorId } from "../../hiago/servicos/filmes/buscar.js";
import { buscarRelacaoDeAtorEFilme } from "../servicos/atoresFilmes/busca.js";
export async function validarCriacaoRelacaoAtorFilme(req, res, next) {
    const { idFilme, idAtor } = req.body;

    // Checagem básica
    if (!idFilme || !idAtor) {
        return res.status(400).json({
            mensagem: "Campos 'idFilme' e 'idAtor' são obrigatórios."
        });
    }

    if (!Number.isInteger(idFilme) || !Number.isInteger(idAtor)) {
        return res.status(400).json({
            mensagem: "'idFilme' e 'idAtor' devem ser números inteiros."
        });
    }

    try {
        // Verificar se o filme existe
        const filme = await buscarFilmePorId(idFilme);

        if (filme.length == 0) {
            return res.status(404).json({ mensagem: "Filme não encontrado." });
        }

        // Verificar se o ator existe
        const ator = await buscarAtorPorId(idAtor);
        if (ator.length == 0) {
            return res.status(404).json({ mensagem: "Ator não encontrado." });
        }


        const relacaoAtorFilme = await buscarRelacaoDeAtorEFilme(idFilme, idAtor);
        if (relacaoAtorFilme.length > 0){
            return res.status(404).json({ mensagem: "Essa relação já existe." });
        }
        // Tudo certo, segue para a próxima função
        next();
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao validar dados.",
            codigo: "VALIDACAO_RELACAO_ATOR_FILME",
            erro: error.message,
        });
    }
}
