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


async function buscarGeneros() {
    try {
        const sql = `SELECT * FROM generos`;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

async function buscarGeneroPorId(id) {
    try {
        const sql = `SELECT * FROM generos WHERE idgeneros = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarGenerosPorNome(nome) {
    try {
        const sql = `SELECT * FROM generos WHERE nome LIKE ?`;
        return await executarQuery(sql, [`%${nome}%`]);
    } catch (error) {
        console.error(error);
    }
}

export { buscarGeneroPorId, buscarGenerosPorNome, buscarGeneros};