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

async function deletarProdutorFilmesByAtor(idProdutor) {
    try {
        const sql = `DELETE FROM produtorFilmes WHERE produtor_idprodutor = ?`;
        return await executarQuery(sql, [idProdutor]);
    } catch (error) {
        console.error(error);
    }
}

async function deletarProdutorFilmesByFilme(idFilme) {
    try {
        const sql = `DELETE FROM produtorFilmes WHERE filmes_idfilmes = ?`;
        return await executarQuery(sql, [idFilme]);
    } catch (error) {
        console.error(error);
    }
}

async function deletarProdutorFilmesByFilmeAndAtor(idFilme, idProdutor) {
    try {
        const sql = `DELETE FROM produtorFilmes WHERE filmes_idfilmes = ? AND produtor_idprodutor = ?`;
        return await executarQuery(sql, [idFilme, idProdutor]);
    } catch (error) {
        console.error(error);
    }
}

export { deletarProdutorFilmesByAtor, deletarProdutorFilmesByFilme, deletarProdutorFilmesByFilmeAndAtor}

