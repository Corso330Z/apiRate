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

// Busca todos os relacionamentos Produtor-filme com nomes
async function buscarProdutorFilmes() {
    try {
        const sql = `
            SELECT 
                pf.filmes_idfilmes,
                f.nomeFilme,
                pf.produtor_idprodutor,
                a.nome AS nomeProdutor
            FROM produtorFilmes pf
            JOIN filmes f ON pf.filmes_idfilmes = f.idfilmes
            JOIN produtor a ON pf.produtor_idprodutor = a.idprodutor
        `;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

// Busca os filmes de um Produtor específico (pelo ID)
async function buscarFilmesDoProdutor(idProdutor) {
    try {
        const sql = `
            SELECT 
                f.idfilmes,
                f.nomeFilme,
                f.dataLanc,
                f.sinopse,
                f.classInd
            FROM filmes f
            JOIN produtorFilmes pf ON f.idfilmes = pf.filmes_idfilmes
            WHERE pf.produtor_idprodutor = ?
        `;
        return await executarQuery(sql, [idProdutor]);
    } catch (error) {
        console.error(error);
    }
}

// Busca os Produtores de um filme específico (pelo ID)
async function buscarProdutoresDoFilme(idFilme) {
    try {
        const sql = `
            SELECT 
                p.idprodutor,
                p.nome
            FROM produtor p
            JOIN produtorFilmes pf ON p.idprodutor = pf.produtor_idprodutor
            WHERE pf.filmes_idfilmes = ?
        `;
        return await executarQuery(sql, [idFilme]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarRelacaoDeProdutorEFilme(idFilme, idProdutor) {
    try {
        const sql = `
            SELECT * FROM produtorFilmes WHERE filmes_idfilmes = ? AND produtor_idprodutor = ?
        `;
        return await executarQuery(sql, [idFilme, idProdutor]);
    } catch (error) {
        console.error(error);
    }
}


export { buscarProdutoresDoFilme, buscarProdutorFilmes, buscarFilmesDoProdutor, buscarRelacaoDeProdutorEFilme };
