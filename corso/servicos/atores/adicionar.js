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

async function adicionarAtor(nome, dataNasc, vivo, fotoAtor) {
    try{        
        //console.log(nome, dataNasc, vivo, fotoAtor)
        const sql = `INSERT INTO atores (nome, dataNasc, vivo, fotoAtor) VALUES (?, ?, ?, ?);`;
        return await executarQuery(sql, [nome, dataNasc, vivo, fotoAtor]);
    } catch(error) {
        console.error(error);
    }
    
}

export { adicionarAtor }