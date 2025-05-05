import pool from '../../../config.js';

async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        const [resultado] = await conexao.execute(sql, params);
        return resultado;
    } catch (error) {
        throw new Error('Erro ao executar o comando', 500, 'DB_EXEC_ERROR', error.message);
    } finally {
        if (conexao) conexao.release();
    }
}

async function adicionarFilme(nome, dataLanc, sinopse, classInd, fotoFilme) {
    try{
        const sql = `INSERT INTO filmes (dataLanc, sinopse, classInd, fotoFilme, nomeFilme) VALUES (?, ?, ?, ?, ?);`;
        return await executarQuery(sql, [dataLanc, sinopse, classInd, fotoFilme, nome]);
    } catch(error) {
        console.error(error);
    }
    
}

export { adicionarFilme }