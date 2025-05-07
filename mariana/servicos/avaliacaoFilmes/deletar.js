import pool from '../../../config.js';

export async function deletarAvaliacao(perfilId, filmeId) {
    const conn = await pool.getConnection();
    try {
        const sql = `
            DELETE FROM avaliacaoFilmes
            WHERE perfil_idperfil = ? AND filmes_idfilmes = ?
        `;
        await conn.execute(sql, [perfilId, filmeId]);
    } finally {
        conn.release();
    }
}
