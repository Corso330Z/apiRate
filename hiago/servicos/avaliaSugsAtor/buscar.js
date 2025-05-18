import pool from '../../../config.js';

const sqlPadrao = `SELECT
    avsg.idavaliacao,
    avsg.perfil_idperfil AS id_usuario_like,
    p.nome AS nome_usuario_like,
    avsg.sugestoesAtores_idsugestoesAtores AS id_sugsAtor,
    sg.nome AS nome_ator,
    avsg.positiva,
    avsg.negativa,
    sg.perfil_idperfil AS id_usuario_sg,
    autor.nome AS nome_usuario_sg
FROM avaliacaoSugsAtores AS avsg
INNER JOIN perfil AS p
    ON avsg.perfil_idperfil = p.idperfil
INNER JOIN sugestoesAtores AS sg
    ON avsg.sugestoesAtores_idsugestoesAtores = sg.idsugestoesAtores
INNER JOIN perfil AS autor
    ON sg.perfil_idperfil = autor.idperfil
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


async function buscarAvaliacaoSugsAtor() {
    try {
        const sql = sqlPadrao;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

async function buscarAvaliacaoSugsAtorPorId(id) {
    try {
        const sql = `${sqlPadrao} WHERE avsg.idavaliacao = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarAvaliacaoSugsAtorPorLike(idavaliacao) {
    try {
        const sql = `${sqlPadrao} WHERE avsg.positiva = 1 AND avsg.sugestoesAtores_idsugestoesAtores = ?`;
        return await executarQuery(sql, [idavaliacao]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarAvaliacaoSugsAtorPorDeslike(idavaliacao) {
    try {
        const sql = `${sqlPadrao} WHERE avsg.negativa = 1 AND avsg.sugestoesAtores_idsugestoesAtores = ?`;
        return await executarQuery(sql, [idavaliacao]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarAvaliacaoSugsAtorPorLikeEPerfil(idPerfil) {
    try {
        const sql = `${sqlPadrao} WHERE avsg.positiva = 1 AND avsg.perfil_idperfil = ?`;
        return await executarQuery(sql, [idPerfil]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarAvaliacaoSugsAtorPorDeslikeEPerfil(idPerfil) {
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

export { buscarAvaliacaoSugsAtorPorId, buscarAvaliacoesPorPerfilAvaliador, buscarAvaliacaoSugsAtor, buscarAvaliacaoSugsAtorPorDeslikeEPerfil, buscarAvaliacaoSugsAtorPorLike, buscarAvaliacaoSugsAtorPorLikeEPerfil, buscarAvaliacaoSugsAtorPorDeslike };