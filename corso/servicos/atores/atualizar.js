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


async function atualizarAtorPut(nome, dataNasc, vivo, fotoAtor, id) {
    //console.log({ nome, dataLanc, sinopse, classInd, fotoFilme, id });
    try {
        const sql = `UPDATE atores SET dataNasc = ?, vivo = ?, fotoAtor = ?, nome = ? WHERE idatores = ?`;
        return await executarQuery(sql, [dataNasc, vivo, fotoAtor, nome, id]);
    } catch (error) {
        console.error(error);
    }
}

async function atualizarAtorPatch(id, campos) {
    const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", ");
    const valores = Object.values(campos);
    const sql = `UPDATE atores SET ${colunas} WHERE idatores = ?;`
    valores.push(id);
    return await executarQuery(sql, valores);
}

export { atualizarAtorPut, atualizarAtorPatch }