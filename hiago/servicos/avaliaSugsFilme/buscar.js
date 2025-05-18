import pool from '../../../config.js';

const sqlPadrao = `SELECT
    avsg.idavaliacao,
    avsg.perfil_idperfil AS id_usuario_like,
    p.nome AS nome_usuario_like,
    avsg.sugestoesFilmes_idsugestoesFilmes AS id_sugsFilme,
    sg.nomeFilme AS nome_filme,
    avsg.positiva,
    avsg.negativa,
    sg.perfil_idperfil AS id_usuario_sg,
    filme.nome AS nome_usuario_sg
FROM avaliacaoSugsFilmes AS avsg
INNER JOIN perfil AS p
    ON avsg.perfil_idperfil = p.idperfil
INNER JOIN sugestoesFilmes AS sg
    ON avsg.sugestoesFilmes_idsugestoesFilmes = sg.idsugestoesFilmes
INNER JOIN perfil AS filme
    ON sg.perfil_idperfil = filme.idperfil
`

async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        const [resultado] = await conexao.execute(sql, params);
        return resultado;
    } catch (error) {
        throw new Error(`Erro ao executar o comando: ${error.message}`);
    } finally {
        if (conexao) conexao.release();
    }
}


async function buscarAvaliacaoSugsFilme() {
    try {
        const sql = sqlPadrao;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

async function buscarAvaliacaoSugsFilmePorId(id) {
    try {
        const sql = `${sqlPadrao} WHERE avsg.idavaliacao = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarAvaliacaoSugsFilmePorLike(idavaliacao) {
    try {
        const sql = `${sqlPadrao} WHERE avsg.positiva = 1 AND avsg.sugestoesFilmes_idsugestoesFilmes = ?`;
        return await executarQuery(sql, [idavaliacao]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarAvaliacaoSugsFilmePorDeslike(idavaliacao) {
    try {
        const sql = `${sqlPadrao} WHERE avsg.negativa = 1 AND avsg.sugestoesFilmes_idsugestoesFilmes = ?`;
        return await executarQuery(sql, [idavaliacao]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarAvaliacaoSugsFilmePorLikeEPerfil(idPerfil) {
    try {
        const sql = `${sqlPadrao} WHERE avsg.positiva = 1 AND avsg.perfil_idperfil = ?`;
        return await executarQuery(sql, [idPerfil]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarAvaliacaoSugsFilmePorDeslikeEPerfil(idPerfil) {
    try {
        const sql = `${sqlPadrao} WHERE avsg.negativa = 1 AND avsg.perfil_idperfil = ?`;
        return await executarQuery(sql, [idPerfil]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarAvaliacoesPorPerfilAvaliador(idPerfil) {
    try {
        const sql = `${sqlPadrao} WHERE avsg.perfil_idperfil = ?`;
        return await executarQuery(sql, [idPerfil]);
    } catch (error) {
        console.error(error);
    }
}

export { buscarAvaliacaoSugsFilmePorId, buscarAvaliacoesPorPerfilAvaliador, buscarAvaliacaoSugsFilme, buscarAvaliacaoSugsFilmePorDeslikeEPerfil, buscarAvaliacaoSugsFilmePorLike, buscarAvaliacaoSugsFilmePorLikeEPerfil, buscarAvaliacaoSugsFilmePorDeslike };