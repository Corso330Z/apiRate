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


async function buscarProdutores() {
    try {
        const sql = `SELECT * FROM produtor`;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

async function buscarProdutorPorId(id) {
    try {
        const sql = `SELECT * FROM produtor WHERE idprodutor = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarProdutoresPorNome(nome) {
    try {
        const sql = `SELECT * FROM produtor WHERE nome LIKE ?`;
        return await executarQuery(sql, [`%${nome}%`]);
    } catch (error) {
        console.error(error);
    }
}

export { buscarProdutorPorId, buscarProdutoresPorNome, buscarProdutores};