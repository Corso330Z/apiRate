import pool from '../../../config.js';

const sqlPadrao = `SELECT 
    sg.idsugestoesAtores,
    sg.perfil_idperfil,
    sg.nome,
    p.nome AS nomePerfil,
    p.email AS emailPerfil
FROM sugestoesAtores sg
JOIN perfil p ON sg.perfil_idperfil = p.idperfil`;

async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        const [resultado] = await conexao.execute(sql, params);
        return resultado;
    } catch (error) {
        // Corrigido: lança erro com informações extras no objeto
        const customError = new Error("Erro ao executar a consulta no banco de dados.");
        customError.status = 500;
        customError.codigo = "DB_EXEC_ERROR";
        customError.detalhes = error.message;
        throw customError;
    } finally {
        if (conexao) conexao.release();
    }
}

async function buscarSugestaoAtor() {
    const sql = sqlPadrao;
    return await executarQuery(sql);
}

async function buscarSugestaoAtorPorId(id) {
    const sql = `${sqlPadrao} WHERE sg.idsugestoesAtores = ?`;
    return await executarQuery(sql, [id]);
}

async function buscarSugestaoAtorPorNome(nome) {
    const sql = `${sqlPadrao} WHERE sg.nome LIKE ?`;
    return await executarQuery(sql, [`%${nome}%`]);
}

export {
    buscarSugestaoAtorPorId,
    buscarSugestaoAtorPorNome,
    buscarSugestaoAtor
};
