import pool from '../../../config.js';

const sqlPadrao = `SELECT 
    sf.idsugestoesFilmes,
    sf.perfil_idperfil,
    sf.nomeFilme,
    sf.sinopse,
    p.nome AS nomePerfil,
    p.email AS emailPerfil
FROM sugestoesFilmes sf
JOIN perfil p ON sf.perfil_idperfil = p.idperfil
`

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


async function buscarSugestaoFilme() {
    try {
        const sql = sqlPadrao;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

async function buscarSugestaoFilmePorId(id) {
    try {
        const sql = `${sqlPadrao} WHERE sf.idsugestoesFilmes = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
} 

async function buscarSugestaoFilmePorNome(nome) {
    try {
        const sql = `${sqlPadrao} WHERE sf.nomeFilme LIKE ?`;
        return await executarQuery(sql, [`%${nome}%`]);
    } catch (error) {
        console.error(error);
    }
}

export { buscarSugestaoFilmePorId, buscarSugestaoFilmePorNome, buscarSugestaoFilme };