import { buscarDiretorPorId } from "../servicos/diretor/buscar.js";
import { buscarFilmePorId } from "../../hiago/servicos/filmes/buscar.js";
import { buscarRelacaoDeDiretorEFilme } from "../servicos/diretoresFilmes/busca.js";

export async function validarCriacaoRelacaoDiretorFilme(req, res, next) {
    const { idFilme, idDiretor } = req.body;

    // Checagem básica
    if (!idFilme || !idDiretor) {
        return res.status(400).json({
            mensagem: "Campos 'idFilme' e 'idDiretor' são obrigatórios."
        });
    }

    if (!Number.isInteger(idFilme) || !Number.isInteger(idDiretor)) {
        return res.status(400).json({
            mensagem: "'idFilme' e 'idDiretor' devem ser números inteiros."
        });
    }

    try {
        // Verificar se o filme existe
        const filme = await buscarFilmePorId(idFilme);

        if (filme.length === 0) {
            return res.status(404).json({ mensagem: "Filme não encontrado." });
        }

        // Verificar se o diretor existe
        const diretor = await buscarDiretorPorId(idDiretor);
        if (diretor.length === 0) {
            return res.status(404).json({ mensagem: "Diretor não encontrado." });
        }

        const relacaoDiretorFilme = await buscarRelacaoDeDiretorEFilme(idFilme, idDiretor);
        if (relacaoDiretorFilme.length > 0) {
            return res.status(400).json({ mensagem: "Essa relação já existe." });
        }

        // Tudo certo, segue para a próxima função
        next();
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao validar dados.",
            codigo: "VALIDACAO_RELACAO_DIRETOR_FILME",
            erro: error.message,
        });
    }
}
