import pool from '../../../config.js';
export async function deletarAvaliacao(perfilId) {
    const conn = await pool.getConnection();
    try {
        const sql = `
            DELETE FROM avaliacaoComentarios
            WHERE perfil_idperfil = ?
        `;
        await conn.execute(sql, [perfilId]);
    } finally {
        conn.release();
    }
}
