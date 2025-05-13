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

async function adicionarGenero(classInd, dataLanc, sinopse, fotoFilme, nomeFilme) {
    try{        
        //console.log(nome, dataNasc, vivo, fotoAtor)
        const sql = `INSERT INTO genero (classInd, dataLanc, sinopse, fotoFilme, nomeFilme) VALUES (?, ?, ?, ?);`;
        return await executarQuery(sql, [classInd, dataLanc, sinopse, fotoFilme, nomeFilme]);
    } catch(error) {
        console.error(error);
    }
    
}

export { adicionarGenero }