import pool from '../../../config.js';

const sqlPadrao = `SELECT 
    sg.idsugestoesAtores,
    sg.perfil_idperfil,
    sg.nome,
    p.nome AS nomePerfil,
    p.email AS emailPerfil
FROM sugestoesAtores sg
JOIN perfil p ON sg.perfil_idperfil = p.idperfil;
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


async function buscarSugestaoAtor() {
    try {
        const sql = sqlPadrao;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

async function buscarSugestaoAtorPorId(id) {
    try {
        const sql = `${sqlPadrao} WHERE sg.idsugestoesAtores = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarSugestaoAtorPorNome(nome) {
    try {
        const sql = `${sqlPadrao} WHERE sg.nome LIKE ?`;
        return await executarQuery(sql, [`%${nome}%`]);
    } catch (error) {
        console.error(error);
    }
}

export { buscarSugestaoAtorPorId, buscarSugestaoAtorPorNome, buscarSugestaoAtor };