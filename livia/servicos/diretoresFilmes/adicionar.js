import pool from '../../../config.js';

async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        const resultado = await conexao.execute(sql, params);
        return resultado;
    } catch (error) {
        console.log(error)
    } finally {
        if (conexao) conexao.release();
    }
}

async function adicionarDiretorFilmes(idFilme, idDiretor) {
    try{        
        const sql = `INSERT INTO diretorFilmes (filmes_idfilmes, diretor_iddiretor) VALUES (?, ?);`;
        return await executarQuery(sql, [idFilme, idDiretor]);
    } catch(error) {
        console.error(error);
    }
    
}

export { adicionarDiretorFilmes }