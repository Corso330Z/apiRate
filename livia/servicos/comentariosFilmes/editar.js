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


async function editarComentario(descricao, id, idPerfil) {
    try {
        const sql = `UPDATE comentarios SET descricao = ? WHERE idcomentarios = ? AND perfil_idperfil = ?`;
        return await executarQuery(sql, [descricao, id, idPerfil]);
    } catch (error) {
        console.error(error);
    }
}


export{ editarComentario }