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

const sqlPadrao = `SELECT 
c.idcomentarios,
  p.nome AS nome_usuario,
  p.email AS email_usuario,
  c.descricao,
  f.nomeFilme AS nome_filme
FROM comentarios c
INNER JOIN perfil p ON c.perfil_idperfil = p.idperfil
INNER JOIN filmes f ON c.filmes_idfilmes = f.idfilmes`

async function buscarComentariosFilmes() {
    try {
        const sql = sqlPadrao;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

async function buscarComentariosFilmesById(id) {
    try {
        const sql = `${sqlPadrao} WHERE c.idcomentarios = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarComentariosFilmesByIdPerfil(idPerfil) {
    try {
        const sql = `${sqlPadrao} WHERE c.perfil_idperfil = ?`;
        return await executarQuery(sql, [idPerfil]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarComentariosFilmesByIdFilme(idFilme) {
    try {
        const sql = `${sqlPadrao} WHERE c.filmes_idfilmes = ?`;
        return await executarQuery(sql, [idFilme]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarComentariosFilmesByIdFilmeAndIdPerfil( idPerfil, idFilme) {
    try {
        const sql = `${sqlPadrao} WHERE c.filmes_idfilmes = ? AND c.perfil_idperfil = ?`;
        return await executarQuery(sql, [idFilme, idPerfil]);
    } catch (error) {
        console.error(error);
    }
}

export { buscarComentariosFilmes, buscarComentariosFilmesById, buscarComentariosFilmesByIdFilme, buscarComentariosFilmesByIdFilmeAndIdPerfil, buscarComentariosFilmesByIdPerfil };