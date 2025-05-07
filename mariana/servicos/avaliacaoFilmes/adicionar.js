import pool from '../../../config.js';

export async function inserirAvaliacao(perfilId, filmeId, like, dislike) {
    const conn = await pool.getConnection();
    try {
        const sql = `
        INSERT INTO avaliacaoFilmes (perfil_idperfil, filmes_idfilmes, \`like\`, \`dislike\`)
        VALUES (?, ?, ?, ?)
    `;
    
        const [result] = await conn.execute(sql, [perfilId, filmeId, like, dislike]);
        return { idavaliacao: result.insertId };
    } finally {
        conn.release();
    }
}
