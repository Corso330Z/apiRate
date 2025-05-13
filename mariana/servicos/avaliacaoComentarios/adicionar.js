import pool from '../../../config.js';

export async function inserirAvaliacao(perfilId, positiva, negativa, comentarios_idcomentarios, comentarios_perfil_idperfil, comentarios_filmes_idfilmes) {
    const conn = await pool.getConnection();
    try {
        const sql = `
        INSERT INTO avaliacaoComentarios (perfil_idperfil,
         positiva , negativa, comentarios_idcomentarios,
          comentarios_perfil_idperfil, comentarios_filmes_idfilmes)
        VALUES ( ?, ?, ?, ?, ?, ?)
    `;

        const [result] = await conn.execute(sql, [perfilId,
             positiva, negativa,
             comentarios_idcomentarios, comentarios_perfil_idperfil,
              comentarios_filmes_idfilmes]);
        return { idavaliacao: result.insertId };
    } finally {
        conn.release();
    }
}
