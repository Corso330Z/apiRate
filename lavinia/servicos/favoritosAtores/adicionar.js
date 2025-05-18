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

async function adicionarFavoritosAtores(idAtore, idPerfil) {
    try{        
        const sql = `INSERT INTO favoritosAtores (atores_idatores, perfil_idperfil) VALUES (?, ?);`;
        return await executarQuery(sql, [idAtore, idPerfil]);
    } catch(error) {
        console.error(error);
    }
    
}

export { adicionarFavoritosAtores }