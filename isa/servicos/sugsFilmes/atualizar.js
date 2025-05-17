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


async function atualizarSugestaoFilmePutAdm(nomeFilme, sinopse, idSugestao) {

    try {
        const sql = `UPDATE sugestoesFilmes SET nomeFilme = ?, sinopse = ? WHERE idsugestoesFilmes = ?`;
        return await executarQuery(sql, [nomeFilme, sinopse, idSugestao]);
    } catch (error) {
        console.error(error);
    }
}

async function atualizarSugestaoFilmePut(nomeFilme, sinopse, idSujetao, idpefil) {
    try {
        const sql = `UPDATE sugestoesFilmes SET nomeFilme = ?, sinopse = ? WHERE idsugestoesFilmes = ? AND perfil_idperfil = ?`;
        return await executarQuery(sql, [nomeFilme, sinopse, idSujetao, idpefil]);
    } catch (error) {
        console.error(error);
    }
}

async function atualizarSugestaoFilmePatch(campos, id, idPerfil) {
    const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", ");
    const valores = Object.values(campos);
    const sql = `UPDATE sugestoesFilmes SET ${colunas} WHERE idsugestoesFilmes = ? AND perfil_idperfil = ?;`
    valores.push(id, idPerfil);
    return await executarQuery(sql, valores);
}

async function atualizarSugestaoFilmePatchAdm(campos, id) {
    const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", ");
    const valores = Object.values(campos);
    const sql = `UPDATE sugestoesFilmes SET ${colunas} WHERE idsugestoesFilmes = ?;`
    valores.push(id);
    return await executarQuery(sql, valores);
}


export { atualizarSugestaoFilmePutAdm, atualizarSugestaoFilmePut, atualizarSugestaoFilmePatch, atualizarSugestaoFilmePatchAdm }