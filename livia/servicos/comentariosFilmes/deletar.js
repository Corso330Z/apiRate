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

async function deletarComentariosFilmes(id, idPerfil) {
    try {
        const sql = `DELETE FROM comentarios WHERE idcomentarios = ? AND perfil_idperfil = ?`;
        return await executarQuery(sql, [id, idPerfil]);
    } catch (error) {
        console.error(error);
    }
}

async function deletarComentariosFilmesByPerfil(idPerfil) {
    try {
        const sql = `DELETE FROM comentarios WHERE perfil_idperfil = ?`;
        return await executarQuery(sql, [idPerfil]);
    } catch (error) {
        console.error(error);
    }
}

async function deletarComentariosFilmesByFilme(idFilmes) {
    try {
        const sql = `DELETE FROM comentarios WHERE filmes_idfilmes = ?`;
        return await executarQuery(sql, [idFilmes]);
    } catch (error) {
        console.error(error);
    }
}

async function deletarComentariosFilmesByFilmeAndPerfil(idFilme, idPerfil) {
    try {
        const sql = `DELETE FROM comentarios WHERE filmes_idfilmes = ? AND perfil_idperfil = ?`;
        return await executarQuery(sql, [idFilme, idPerfil]);
    } catch (error) {
        console.error(error);
    }
}

export { deletarComentariosFilmes, deletarComentariosFilmesByFilmeAndPerfil, deletarComentariosFilmesByFilme, deletarComentariosFilmesByPerfil }