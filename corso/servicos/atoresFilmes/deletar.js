import pool from '../../../config.js';

async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        const [resultado] = await conexao.execute(sql, params);
        return resultado;
    } catch (error) {
        throw new Error('Erro ao executar o comando', 500, 'DB_EXEC_ERROR', error.message);
    } finally {
        if (conexao) conexao.release();
    }
}

async function deletarAtoresFilmesByAtor(idAtor) {
    try {
        const sql = `DELETE FROM atoresFilmes WHERE atores_idatores = ?`;
        return await executarQuery(sql, [idAtor]);
    } catch (error) {
        console.error(error);
    }
}

async function deletarAtoresFilmesByFilme(idFilme) {
    try {
        const sql = `DELETE FROM atoresFilmes WHERE filmes_idfilmes = ?`;
        return await executarQuery(sql, [idFilme]);
    } catch (error) {
        console.error(error);
    }
}

async function deletarAtoresFilmesByFilmeAndAtor(idFilme, idAtor) {
    try {
        const sql = `DELETE FROM atoresFilmes WHERE filmes_idfilmes = ? AND atores_idatores = ?`;
        return await executarQuery(sql, [idFilme, idAtor]);
    } catch (error) {
        console.error(error);
    }
}

export { deletarAtoresFilmesByAtor, deletarAtoresFilmesByFilme, deletarAtoresFilmesByFilmeAndAtor}

