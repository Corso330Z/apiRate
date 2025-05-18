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

async function adicionarGeneroFilmes(idFilme, idGenero) {
    try{        
        const sql = `INSERT INTO generosFilmes (filmes_idfilmes, generos_idgeneros) VALUES (?, ?);`;
        return await executarQuery(sql, [idFilme, idGenero]);
    } catch(error) {
        console.error(error);
    }
    
}

export { adicionarGeneroFilmes }