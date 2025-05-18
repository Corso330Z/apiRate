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

async function adicionarAvaliacaoSugsFilme(positiva, negativa, idperfil, idsugestao) {
    try{
        const sql = `INSERT INTO avaliacaoSugsFilmes (positiva, negativa, perfil_idperfil, sugestoesFilmes_idsugestoesFilmes) VALUES (?, ?, ?, ?);`;
        return await executarQuery(sql, [positiva, negativa, idperfil, idsugestao]);
    } catch(error) {
        console.error(error);
    }
    
}

export { adicionarAvaliacaoSugsFilme }