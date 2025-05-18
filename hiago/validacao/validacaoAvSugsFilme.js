import pool from '../../config.js';
import { buscarSugestaoFilmePorId } from '../../isa/servicos/sugsFilmes/buscar.js';
async function validarAvaliacaoSugsFilmeCompleto(positiva, negativa, perfil_idperfil, sugestoesFilmes_idsugestoesFilmes) {
    const erros = [];

    let conexao;

    try {
        conexao = await pool.getConnection();

        const sql = `
            SELECT * FROM avaliacaoSugsFilmes
            WHERE perfil_idperfil = ? AND sugestoesFilmes_idsugestoesFilmes = ?
        `;
        const resultado = await conexao.query(sql, [perfil_idperfil, sugestoesFilmes_idsugestoesFilmes]);
        if (resultado[0].length > 0) {
            erros.push("Você já avaliou essa sugestão.");
        }
        const resultadoSugestao = await buscarSugestaoFilmePorId(sugestoesFilmes_idsugestoesFilmes)
        if (resultadoSugestao.length == 0) {
            erros.push("Essa sugestão não existe.");
        }

        if (parseInt(positiva) === 1 && parseInt(negativa) === 1) {
            erros.push("A avaliação não pode ser positiva e negativa ao mesmo tempo.");
        }

    } catch (error) {
        console.error("Erro ao validar avaliação:", error);
        erros.push("Erro interno ao validar os dados.");
    } finally {
        if (conexao) conexao.release();
    }

    return {
        valido: erros.length === 0,
        erros
    };
}

async function validarAvaliacaoSugsFilmeParcial(positiva, negativa) {
    const erros = [];

    let conexao;

    try {

        if (parseInt(positiva) === 1 && parseInt(negativa) === 1) {
            erros.push("A avaliação não pode ser positiva e negativa ao mesmo tempo.");
        }

    } catch (error) {
        console.error("Erro ao validar avaliação:", error);
        erros.push("Erro interno ao validar os dados.");
    } 

    return {
        valido: erros.length === 0,
        erros
    };
}

export { validarAvaliacaoSugsFilmeCompleto, validarAvaliacaoSugsFilmeParcial };
