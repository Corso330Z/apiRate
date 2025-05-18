import pool from '../../config.js';
import { buscarSugestaoAtorPorId } from '../../isa/servicos/sugsAtores/buscar.js';
async function validarAvaliacaoSugsAtorCompleto(positiva, negativa, perfil_idperfil, sugestoesAtores_idsugestoesAtores) {
    const erros = [];

    let conexao;

    try {
        conexao = await pool.getConnection();

        const sql = `
            SELECT * FROM avaliacaoSugsAtores
            WHERE perfil_idperfil = ? AND sugestoesAtores_idsugestoesAtores = ?
        `;
        const resultado = await conexao.query(sql, [perfil_idperfil, sugestoesAtores_idsugestoesAtores]);
        if (resultado[0].length > 0) {
            erros.push("Você já avaliou essa sugestão.");
        }

        const resultadoSugestao = await buscarSugestaoAtorPorId(sugestoesAtores_idsugestoesAtores)
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

async function validarAvaliacaoSugsAtorParcial(positiva, negativa) {
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

export { validarAvaliacaoSugsAtorCompleto, validarAvaliacaoSugsAtorParcial };
