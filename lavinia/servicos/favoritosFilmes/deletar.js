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

async function deletarFavoritosFilmesByPerfil(idPerfil) {
    try {
        const sql = `DELETE FROM favoritosFilmes WHERE perfil_idperfil = ?`;
        return await executarQuery(sql, [idPerfil]);
    } catch (error) {
        console.error(error);
    }
}

async function deletarFavoritosFilmesByFilme(idFilme) {
    try {
        const sql = `DELETE FROM favoritosFilmes WHERE filmes_idfilmes = ?`;
        return await executarQuery(sql, [idFilme]);
    } catch (error) {
        console.error(error);
    }
}

async function deletarFavoritosFilmesByFilmeAndPerfil(idFilme, idPerfil) {
    try {
        const sql = `DELETE FROM favoritosFilmes WHERE filmes_idfilmes = ? AND perfil_idperfil = ?`;
        return await executarQuery(sql, [idFilme, idPerfil]);
    } catch (error) {
        console.error(error);
    }
}

export { deletarFavoritosFilmesByPerfil, deletarFavoritosFilmesByFilme, deletarFavoritosFilmesByFilmeAndPerfil}

