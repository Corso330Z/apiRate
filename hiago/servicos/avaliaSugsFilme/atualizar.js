import pool from '../../../config.js';

async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        const [resultado] = await conexao.execute(sql, params);
        return resultado;
    } catch (error) {
        throw {
            message: 'Erro ao executar o comando',
            status: 500,
            code: 'DB_EXEC_ERROR',
            detalhes: error.message,
        };
    } finally {
        if (conexao) conexao.release();
    }
}

async function atualizarAvaliacaoSugsFilmePatch(idavaliacao, positiva, negativa, idpefil) {
    try {
        const sql = `UPDATE avaliacaoSugsFilmes SET positiva = ?, negativa = ? WHERE idavaliacao = ? AND perfil_idperfil = ?`;
        return await executarQuery(sql, [positiva, negativa, idavaliacao, idpefil]);
    } catch (error) {
        console.error(error);
    }
}


export { atualizarAvaliacaoSugsFilmePatch }