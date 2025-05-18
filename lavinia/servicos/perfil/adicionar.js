import pool from '../../../config.js';

async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        const resultado = await conexao.execute(sql, params);
        return resultado;
    } catch (error) {
        throw new Error('Erro ao executar o comando', 500, 'DB_EXEC_ERROR', error.message);
    } finally {
        if (conexao) conexao.release();
    }
}

async function adicionarPerfil(nome, email, biografia, senha, fotoPerfil) {
    try{
        const sql = `INSERT INTO perfil (nome, email, biografia, senha, fotoPerfil, adm) VALUES (?, ?, ?, ?, ?, 0);`;
        return await executarQuery(sql, [nome, email, biografia, senha, fotoPerfil]);
    } catch(error) {
        console.error(error);
    }
    
}

export { adicionarPerfil }