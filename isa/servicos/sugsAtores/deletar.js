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

async function deletarSugestaoAtorAdm(id) {
    try {
        const sql = `DELETE FROM sugestoesAtores WHERE idsugestoesAtores = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

async function deletarSugestaoAtor(id, idpefil) {
    try {
        const sql = `DELETE FROM sugestoesAtores WHERE idsugestoesAtores = ? AND perfil_idperfil = ?`;
        return await executarQuery(sql, [id, idpefil]);
    } catch (error) {
        console.error(error);
    }
}

export { deletarSugestaoAtorAdm, deletarSugestaoAtor }