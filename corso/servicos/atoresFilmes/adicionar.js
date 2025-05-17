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

async function adicionarAtorFilmes(idFilme, idAtor) {
    try{        
        const sql = `INSERT INTO atoresFilmes (filmes_idfilmes, atores_idatores) VALUES (?, ?);`;
        return await executarQuery(sql, [idFilme, idAtor]);
    } catch(error) {
        console.error(error);
    }
    
}

export { adicionarAtorFilmes }