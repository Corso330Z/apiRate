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


async function atualizarSugestaoAtorPutAdm(nome, idSujetao) {
    //console.log({ nome, dataLanc, sinopse, classInd, fotoFilme, id });
    try {
        const sql = `UPDATE sugestoesAtores SET nome = ? WHERE idatorSugestoesAtores = ?`;
        return await executarQuery(sql, [nome, idSujetao]);
    } catch (error) {
        console.error(error);
    }
}

async function atualizarSugestaoAtorPut(nome, idSujetao, idpefil) {
    try {
        const sql = `UPDATE sugestoesAtores SET nome = ? WHERE idatorSugestoesAtores = ? AND perfil_idperfil = ?`;
        return await executarQuery(sql, [nome, idSujetao, idpefil]);
    } catch (error) {
        console.error(error);
    }
}


export { atualizarSugestaoAtorPutAdm, atualizarSugestaoAtorPut }