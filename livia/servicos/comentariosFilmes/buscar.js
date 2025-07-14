import pool from '../../../config.js';

async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        const [resultado] = await conexao.execute(sql, params);
        return resultado;
    } catch (error) {
        throw new Error('Erro ao executar o comando');
    } finally {
        if (conexao) conexao.release();
    }
}

const sqlBase = `
SELECT 
   c.idcomentarios,
   p.nome AS nome_usuario,
   p.email AS email_usuario,
   c.descricao,
   f.nomeFilme AS nome_filme,
   COALESCE(SUM(ac.positiva), 0) AS totalLikes,
   COALESCE(SUM(ac.negativa), 0) AS totalDislikes
FROM comentarios c
INNER JOIN perfil p ON c.perfil_idperfil = p.idperfil
INNER JOIN filmes f ON c.filmes_idfilmes = f.idfilmes
LEFT JOIN avaliacaoComentarios ac  
  ON ac.comentarios_idcomentarios = c.idcomentarios
  AND ac.comentarios_perfil_idperfil = c.perfil_idperfil
  AND ac.comentarios_filmes_idfilmes = c.filmes_idfilmes
`;

const groupBy = `
GROUP BY 
   c.idcomentarios,
   p.nome,
   p.email,
   c.descricao,
   f.nomeFilme
`;

async function buscarComentariosFilmes() {
  try {
    const sql = `${sqlBase} ${groupBy}`;
    return await executarQuery(sql);
  } catch (error) {
    console.error(error);
  }
}

async function buscarComentariosFilmesById(id) {
  try {
    const sql = `${sqlBase} WHERE c.idcomentarios = ? ${groupBy}`;
    return await executarQuery(sql, [id]);
  } catch (error) {
    console.error(error);
  }
}

async function buscarComentariosFilmesByIdPerfil(idPerfil) {
  try {
    const sql = `${sqlBase} WHERE c.perfil_idperfil = ? ${groupBy}`;
    return await executarQuery(sql, [idPerfil]);
  } catch (error) {
    console.error(error);
  }
}

async function buscarComentariosFilmesByIdFilme(idFilme) {
  try {
    const sql = `${sqlBase} WHERE c.filmes_idfilmes = ? ${groupBy}`;
    return await executarQuery(sql, [idFilme]);
  } catch (error) {
    console.error(error);
  }
}

async function buscarComentariosFilmesByIdFilmeAndIdPerfil(idPerfil, idFilme) {
  try {
    const sql = `${sqlBase} WHERE c.filmes_idfilmes = ? AND c.perfil_idperfil = ? ${groupBy}`;
    return await executarQuery(sql, [idFilme, idPerfil]);
  } catch (error) {
    console.error(error);
  }
}

export {
  buscarComentariosFilmes,
  buscarComentariosFilmesById,
  buscarComentariosFilmesByIdFilme,
  buscarComentariosFilmesByIdFilmeAndIdPerfil,
  buscarComentariosFilmesByIdPerfil
};
