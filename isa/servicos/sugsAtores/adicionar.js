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

async function adicionarSugestoesAtores(id, nome) {
    try{        
        //console.log(nome, dataNasc, vivo, fotoAtor)
        const sql = `INSERT INTO sugestoesAtores (perfil_idperfil, nome) VALUES (?, ?);`;
        return await executarQuery(sql, [id, nome]);
    } catch(error) {
        console.error(error);
    }
    
}

export { adicionarSugestoesAtores }