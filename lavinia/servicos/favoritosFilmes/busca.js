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

const sqlPadrao = `
            SELECT 
                ff.filmes_idfilmes,
                f.nomeFilme,
                ff.perfil_idperfil,
                p.nome
            FROM favoritosFilmes ff
            JOIN filmes f ON ff.filmes_idfilmes = f.idfilmes
            JOIN perfil p ON ff.perfil_idperfil = p.idperfil
        `

// Busca todos os relacionamentos ator-filme com nomes
async function buscarFavoritosFilmes() {
    try {
        const sql = sqlPadrao;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

async function buscarFavoritosFilmesByIdPerfil(idPerfil) {
    try {
        const sql = `${sqlPadrao} WHERE ff.perfil_idperfil = ?`;
        return await executarQuery(sql, [idPerfil]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarFavoritosFilmesByIdFilme(idFilme) {
    try {
        const sql = `${sqlPadrao} WHERE ff.filmes_idfilmes = ?`;
        return await executarQuery(sql, [idFilme]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarFavoritosFilmesByIdPefilAndIdFilme(idPerfil, idFilme) {
    try {
        const sql = `${sqlPadrao} WHERE ff.perfil_idperfil = ? AND ff.filmes_idfilmes = ?`;
        return await executarQuery(sql, [idPerfil, idFilme]);
    } catch (error) {
        console.error(error);
    }
}

export { buscarFavoritosFilmes, buscarFavoritosFilmesByIdFilme, buscarFavoritosFilmesByIdPefilAndIdFilme, buscarFavoritosFilmesByIdPerfil };
