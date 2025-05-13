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


async function atualizarGeneroPut(nome,) {
    //console.log({ nome, dataLanc, sinopse, classInd, fotoFilme, id });
    try {
        const sql = `UPDATE generos SET nome = ? WHERE idgeneros = ?`;
        return await executarQuery(sql,[nome]);
    } catch (error) {
        console.error(error);
    }
}

async function atualizarGeneroPatch(id, campos) {
    const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", ");
    const valores = Object.values(campos);
    const sql = `UPDATE generos SET ${colunas} WHERE idgeneros = ?;`
    valores.push(id);
    return await executarQuery(sql, valores);
}

export { atualizarGeneroPut, atualizarGeneroPatch }