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

async function deletarGeneroFilmesByGenero(idGenero) {
    try {
        const sql = `DELETE FROM generosFilmes WHERE generos_idgeneros = ?`;
        return await executarQuery(sql, [idGenero]);
    } catch (error) {
        console.error(error);
    }
}

async function deletarGeneroFilmesByFilme(idFilme) {
    try {
        const sql = `DELETE FROM generosFilmes WHERE filmes_idfilmes = ?`;
        return await executarQuery(sql, [idFilme]);
    } catch (error) {
        console.error(error);
    }
}

async function deletarGeneroFilmesByFilmeAndGenero(idFilme, idGenero) {
    try {
        const sql = `DELETE FROM generosFilmes WHERE filmes_idfilmes = ? AND generos_idgeneros = ?`;
        return await executarQuery(sql, [idFilme, idGenero]);
    } catch (error) {
        console.error(error);
    }
}

export {
    deletarGeneroFilmesByGenero,
    deletarGeneroFilmesByFilme,
    deletarGeneroFilmesByFilmeAndGenero
};
