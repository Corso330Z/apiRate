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
                fa.atores_idatores,
                a.nome AS nomeAtor,
                fa.perfil_idperfil,
                p.nome AS nomePefil
            FROM favoritosAtores fa
            JOIN atores a ON fa.atores_idatores = a.idatores
            JOIN perfil p ON fa.perfil_idperfil = p.idperfil
        `

// Busca todos os relacionamentos ator-Ator com nomes
async function buscarFavoritosAtores() {
    try {
        const sql = sqlPadrao;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

async function buscarFavoritosAtoresByIdPerfil(idPerfil) {
    try {
        const sql = `${sqlPadrao} WHERE fa.perfil_idperfil = ?`;
        return await executarQuery(sql, [idPerfil]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarFavoritosAtoresByIdAtor(idAtor) {
    try {
        const sql = `${sqlPadrao} WHERE fa.atores_idatores = ?`;
        return await executarQuery(sql, [idAtor]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarFavoritosAtoresByIdPerfilAndIdAtor(idPerfil, idAtor) {
    try {
        const sql = `${sqlPadrao} WHERE fa.perfil_idperfil = ? AND fa.atores_idatores = ?`;
        return await executarQuery(sql, [idPerfil, idAtor]);
    } catch (error) {
        console.error(error);
    }
}

export { buscarFavoritosAtores, buscarFavoritosAtoresByIdAtor, buscarFavoritosAtoresByIdPerfilAndIdAtor, buscarFavoritosAtoresByIdPerfil };
