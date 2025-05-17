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

async function adicionarAtorFilmes(idFilme, idProdutor) {
    try{        
        const sql = `INSERT INTO produtorFilmes (filmes_idfilmes, produtor_idprodutor) VALUES (?, ?);`;
        return await executarQuery(sql, [idFilme, idProdutor]);
    } catch(error) {
        console.error(error);
    }
    
}

export { adicionarAtorFilmes }