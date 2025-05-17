import { buscarProdutorPorId } from "../../isa/servicos/produtor/buscar.js";
import { buscarFilmePorId } from "../../hiago/servicos/filmes/buscar.js";
import { buscarRelacaoDeProdutorEFilme } from "../servicos/produtorFilmes/busca.js";
export async function validarCriacaoRelacaoProdutorFilme(req, res, next) {
    const { idFilme, idProdutor } = req.body;

    // Checagem básica
    if (!idFilme || !idProdutor) {
        return res.status(400).json({
            mensagem: "Campos 'idFilme' e 'idProdutor' são obrigatórios."
        });
    }

    if (!Number.isInteger(idFilme) || !Number.isInteger(idProdutor)) {
        return res.status(400).json({
            mensagem: "'idFilme' e 'idProdutor' devem ser números inteiros."
        });
    }

    try {
        // Verificar se o filme existe
        const filme = await buscarFilmePorId(idFilme);

        if (filme.length == 0) {
            return res.status(404).json({ mensagem: "Filme não encontrado." });
        }

        // Verificar se o produtor existe
        const produtor = await buscarProdutorPorId(idProdutor);
        if (produtor.length == 0) {
            return res.status(404).json({ mensagem: "Produtor não encontrado." });
        }


        const relacaoProdutorFilme = await buscarRelacaoDeProdutorEFilme(idFilme, idProdutor);
        if (relacaoProdutorFilme.length > 0){
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
