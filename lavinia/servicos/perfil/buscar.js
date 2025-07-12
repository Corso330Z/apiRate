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


async function buscarPerfil() {
    try {
        const sql = `SELECT idperfil, nome, email, biografia, senha, adm FROM perfil`;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

async function buscarPerfilPorId(id) {
    try {
        const sql = `SELECT idperfil, nome, email, biografia, senha, adm FROM perfil WHERE idperfil = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarPerfilPorNome(nome) {
    try {
        const sql = `SELECT idperfil, nome, email, biografia, senha, adm FROM perfil WHERE nome LIKE ?`;
        return await executarQuery(sql, [`%${nome}%`]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarPerfilPorEmail(email) {
    try {
        const sql = `SELECT idperfil, nome, email, biografia, senha, adm FROM perfil WHERE email LIKE ?`;
        return await executarQuery(sql, [`%${email}%`]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarImagensPerfilPorId(id) {
    try {
        const sql = `SELECT fotoPerfil FROM perfil WHERE idperfil = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

export { buscarPerfilPorId, buscarPerfilPorNome, buscarPerfil, buscarImagensPerfilPorId, buscarPerfilPorEmail };