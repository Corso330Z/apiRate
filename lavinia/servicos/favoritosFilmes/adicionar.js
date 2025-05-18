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

async function adicionarFavoritosFilmes(idFilme, idPerfil) {
    try{        
        const sql = `INSERT INTO favoritosFilmes (filmes_idfilmes, perfil_idperfil) VALUES (?, ?);`;
        return await executarQuery(sql, [idFilme, idPerfil]);
    } catch(error) {
        console.error(error);
    }
    
}

export { adicionarFavoritosFilmes }