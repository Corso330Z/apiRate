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


async function buscarGenero() {
    try {
        const sql = `SELECT idatores, nome, dataNasc, vivo FROM atores`;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}


export { buscarGenero };