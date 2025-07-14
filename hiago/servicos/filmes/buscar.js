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


async function buscarFilmes() {
    try {
        const sql = `SELECT idfilmes, dataLanc, sinopse, classInd, nomeFilme FROM filmes`;
        return await executarQuery(sql);
    } catch (error) {
        console.error(error);
    }
}

async function buscarFilmePorId(id) {
    try {
        const sql = `SELECT idfilmes, dataLanc, sinopse, classInd, nomeFilme FROM filmes WHERE idfilmes = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarFilmesPorNome(nome) {
    try {
        const sql = `SELECT idfilmes, dataLanc, sinopse, classInd, nomeFilme FROM filmes WHERE nomeFilme LIKE ?`;
        return await executarQuery(sql, [`%${nome}%`]);
    } catch (error) {
        console.error(error);
    }
}

async function buscarFilmesPorGenero(genero) {
  try {
    const sql = `
      SELECT 
        f.idfilmes,
        f.nomeFilme,
        f.dataLanc,
        f.sinopse,
        f.classInd,
        g.nome AS nomeGenero 
      FROM 
        filmes f
      JOIN 
        generosFilmes gf ON gf.filmes_idfilmes = f.idfilmes
      JOIN 
        generos g ON g.idgeneros = gf.generos_idgeneros
      WHERE 
        LOWER(g.nome) LIKE LOWER(?);
    `;
    
    return await executarQuery(sql, [`%${genero}%`]);
  } catch (error) {
    console.error("Erro ao buscar filmes por gênero:", error.message);
    throw error;
  }
}


async function buscarImagensFilmePorId(id) {
    try {
        const sql = `SELECT fotoFilme FROM filmes WHERE idfilmes = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

export { buscarFilmePorId, buscarFilmesPorNome, buscarFilmes, buscarImagensFilmePorId, buscarFilmesPorGenero };