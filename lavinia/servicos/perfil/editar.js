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


async function editarPerfilPut(nome, email, biografia, senha, fotoFilme, id) {
    //console.log({ nome, dataLanc, sinopse, classInd, fotoFilme, id });
    try {
        const sql = `UPDATE perfil SET nome = ?, email = ?, biografia = ?, senha = ?, fotoFilme = ? WHERE idperfil = ?`;
        return await executarQuery(sql, [nome, email, biografia, senha, fotoFilme, id]);
    } catch (error) {
        console.error(error);
    }
}

async function editarPerfilPatch(id, campos) {
  const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", ");
  const valores = Object.values(campos);
  const sql = `UPDATE perfil SET ${colunas} WHERE idperfil = ?`
  valores.push(id);
  return await executarQuery(sql, valores);
}

async function transformarUserEmAdmin(id) {
    try {
        const sql = `UPDATE perfil SET adm = 1 WHERE idperfil = ?`;
        return await executarQuery(sql, [id]);
    } catch (error) {
        console.error(error);
    }
}

export { editarPerfilPut, editarPerfilPatch, transformarUserEmAdmin }