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


async function editarFilmePut(nome, dataLanc, sinopse, classInd, fotoFilme, id) {
    //console.log({ nome, dataLanc, sinopse, classInd, fotoFilme, id });
    try {
        const sql = `UPDATE filmes SET dataLanc = ?, sinopse = ?, classInd = ?, fotoFilme = ?, nomeFilme = ? WHERE idfilmes = ?`;
        return await executarQuery(sql, [dataLanc, sinopse, classInd, fotoFilme, nome, id]);
    } catch (error) {
        console.error(error);
    }
}

async function editarFilmePatch(id, campos) {
  const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", ");
  const valores = Object.values(campos);
  const sql = `UPDATE filmes SET ${colunas} WHERE idfilmes = ?`
  valores.push(id);
  return await executarQuery(sql, valores);
}

export { editarFilmePut, editarFilmePatch }