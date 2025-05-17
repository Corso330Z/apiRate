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

async function adicionarSugestaoFilme(id, nomeFilme, sinopse) {
    try{        
        //console.log(nome, dataNasc, vivo, fotoAtor)
        const sql = `INSERT INTO sugestoesFilmes (perfil_idperfil, nomeFilme, sinopse) VALUES (?, ?, ?);`;
        return await executarQuery(sql, [id, nomeFilme, sinopse]);
    } catch(error) {
        console.error(error);
    }
    
}

export { adicionarSugestaoFilme }