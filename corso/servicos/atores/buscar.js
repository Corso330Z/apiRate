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


async function buscarAtor() {
    try {
        const sql = `SELECT idatores, nome, dataNasc, vivo, fotoAtor FROM atores`;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

async function buscarAtorPorId(id) {
    try {
        const sql = `SELECT idatores, nome, dataNasc, vivo, fotoAtor FROM atores WHERE idatores = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarAtorPorNome(nome) {
    try {
        const sql = `SELECT idatores, nome, dataNasc, vivo, fotoAtor FROM atores WHERE nome LIKE ?`;
        return await executarQuery(sql, [`%${nome}%`]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarImagensAtorPorId(id) {
    try {
        const sql = `SELECT fotoAtor FROM atores WHERE idatores = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

export { buscarAtorPorId, buscarAtorPorNome, buscarAtor, buscarImagensAtorPorId };