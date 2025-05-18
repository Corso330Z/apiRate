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

// Busca todos os relacionamentos Diretor-filme com nomes
async function buscarDiretoresFilmes() {
    try {
        const sql = `
            SELECT 
                df.filmes_idfilmes,
                f.nomeFilme,
                df.diretor_iddiretor,
                d.nome
            FROM diretorFilmes df
            JOIN filmes f ON df.filmes_idfilmes = f.idfilmes
            JOIN diretor d ON df.diretor_iddiretor = d.iddiretor
        `;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

// Busca os filmes de um Diretor específico (pelo ID)
async function buscarFilmesDoDiretor(idDiretor) {
    try {
        const sql = `
            SELECT 
                f.idfilmes,
                f.nomeFilme,
                f.dataLanc,
                f.sinopse,
                f.classInd
            FROM filmes f
            JOIN diretorFilmes df ON f.idfilmes = df.filmes_idfilmes
            WHERE df.diretor_iddiretor = ?
        `;
        return await executarQuery(sql, [idDiretor]);
    } catch (error) {
        console.error(error);
    }
}

// Busca os diretor de um filme específico (pelo ID)
async function buscarDiretoresDoFilme(idFilme) {
    try {
        const sql = `
            SELECT 
                d.nome
            FROM diretor d
            JOIN diretorFilmes df ON d.iddiretor = df.diretor_iddiretor
            WHERE df.filmes_idfilmes = ?
        `;
        return await executarQuery(sql, [idFilme]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarRelacaoDeDiretorEFilme(idFilme, idDiretor) {
    try {
        const sql = `
            SELECT * FROM diretorFilmes WHERE filmes_idfilmes = ? AND diretor_iddiretor = ?
        `;
        return await executarQuery(sql, [idFilme, idDiretor]);
    } catch (error) {
        console.error(error);
    }
}

export { buscarDiretoresDoFilme, buscarDiretoresFilmes, buscarFilmesDoDiretor, buscarRelacaoDeDiretorEFilme };
