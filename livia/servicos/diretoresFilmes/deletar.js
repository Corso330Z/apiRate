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

async function deletarDiretorFilmesByDiretor(idDiretor) {
    try {
        const sql = `DELETE FROM diretorFilmes WHERE diretor_iddiretor = ?`;
        return await executarQuery(sql, [idDiretor]);
    } catch (error) {
        console.error(error);
    }
}

async function deletarDiretorFilmesByFilme(idFilme) {
    try {
        const sql = `DELETE FROM diretorFilmes WHERE filmes_idfilmes = ?`;
        return await executarQuery(sql, [idFilme]);
    } catch (error) {
        console.error(error);
    }
}

async function deletarDiretorFilmesByFilmeAndDiretor(idFilme, idDiretor) {
    try {
        const sql = `DELETE FROM diretorFilmes WHERE filmes_idfilmes = ? AND diretor_iddiretor = ?`;
        return await executarQuery(sql, [idFilme, idDiretor]);
    } catch (error) {
        console.error(error);
    }
}

export { deletarDiretorFilmesByDiretor, deletarDiretorFilmesByFilme, deletarDiretorFilmesByFilmeAndDiretor}

