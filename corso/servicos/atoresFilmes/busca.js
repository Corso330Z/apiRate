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

// Busca todos os relacionamentos ator-filme com nomes
async function buscarAtoresFilmes() {
    try {
        const sql = `
            SELECT 
                af.filmes_idfilmes,
                f.nomeFilme,
                af.atores_idatores,
                a.nome AS nomeAtor
            FROM atoresFilmes af
            JOIN filmes f ON af.filmes_idfilmes = f.idfilmes
            JOIN atores a ON af.atores_idatores = a.idatores
        `;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

// Busca os filmes de um ator específico (pelo ID)
async function buscarFilmesDoAtor(idAtor) {
    try {
        const sql = `
            SELECT 
                f.idfilmes,
                f.nomeFilme,
                f.dataLanc,
                f.sinopse,
                f.classInd
            FROM filmes f
            JOIN atoresFilmes af ON f.idfilmes = af.filmes_idfilmes
            WHERE af.atores_idatores = ?
        `;
        return await executarQuery(sql, [idAtor]);
    } catch (error) {
        console.error(error);
    }
}

// Busca os atores de um filme específico (pelo ID)
async function buscarAtoresDoFilme(idFilme) {
    try {
        const sql = `
            SELECT 
                a.idatores,
                a.nome,
                a.dataNasc,
                a.vivo
            FROM atores a
            JOIN atoresFilmes af ON a.idatores = af.atores_idatores
            WHERE af.filmes_idfilmes = ?
        `;
        return await executarQuery(sql, [idFilme]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarRelacaoDeAtorEFilme(idFilme, idAtor) {
    try {
        const sql = `
            SELECT * FROM atoresFilmes WHERE filmes_idfilmes = ? AND atores_idatores = ?
        `;
        return await executarQuery(sql, [idFilme, idAtor]);
    } catch (error) {
        console.error(error);
    }
}

export { buscarAtoresDoFilme, buscarAtoresFilmes, buscarFilmesDoAtor, buscarRelacaoDeAtorEFilme };
