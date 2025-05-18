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

async function buscarGenerosFilmes() {
    try {
        const sql = `
            SELECT 
                gf.filmes_idfilmes,
                f.nomeFilme,
                gf.generos_idgeneros,
                g.nome
            FROM generosFilmes gf
            JOIN filmes f ON gf.filmes_idfilmes = f.idfilmes
            JOIN generos g ON gf.generos_idgeneros = g.idgeneros
        `;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

// Busca os filmes de um Gênero específico (pelo ID)
async function buscarFilmesDoGenero(idGenero) {
    try {
        const sql = `
            SELECT 
                f.idfilmes,
                f.nomeFilme,
                f.dataLanc,
                f.sinopse,
                f.classInd
            FROM filmes f
            JOIN generosFilmes gf ON f.idfilmes = gf.filmes_idfilmes
            WHERE gf.generos_idgeneros = ?
        `;
        return await executarQuery(sql, [idGenero]);
    } catch (error) {
        console.error(error);
    }
}

// Busca os gêneros de um filme específico (pelo ID)
async function buscarGenerosDoFilme(idFilme) {
    try {
        const sql = `
            SELECT 
                g.nome
            FROM generos g
            JOIN generosFilmes gf ON g.idgeneros = gf.generos_idgeneros
            WHERE gf.filmes_idfilmes = ?
        `;
        return await executarQuery(sql, [idFilme]);
    } catch (error) {
        console.error(error);
    }
}

// Busca a relação específica entre um filme e um gênero
async function buscarRelacaoDeGeneroEFilme(idFilme, idGenero) {
    try {
        const sql = `
            SELECT * FROM generosFilmes WHERE filmes_idfilmes = ? AND generos_idgeneros = ?
        `;
        return await executarQuery(sql, [idFilme, idGenero]);
    } catch (error) {
        console.error(error);
    }
}

export {
    buscarGenerosDoFilme,
    buscarGenerosFilmes,
    buscarFilmesDoGenero,
    buscarRelacaoDeGeneroEFilme
};
