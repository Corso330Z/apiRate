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

// Busca os filmes de um genero específico (pelo ID)
async function buscarFilmesGenero(idgeneros) {
    try {
        const sql = `
            SELECT 
                f.idfilmes,
                f.nomeFilme,
                f.dataLanc,
                f.sinopse,
                f.classInd
            FROM filmes f
            JOIN atoresFilmes af ON f.idfilmes = af.filmes_idfilmes
            WHERE af.generos_idgeneros = ?
        `;
        return await executarQuery(sql, [idgeneros]);
    } catch (error) {
        console.error(error);
    }
}



export { buscarFilmesGenero };
