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

async function adicionarAtor(nome, dataNasc, vivo, fotoAtor) {
    try{
        const sql = `INSERT INTO atores (nome, dataNasc, vivo, fotoAtor) VALUES (?, ?, ?, ?);`;
        return await executarQuery(sql, [nome, dataNasc, vivo, fotoAtor]);
    } catch(error) {
        console.error(error);
    }
    
}

export { adicionarAtor }