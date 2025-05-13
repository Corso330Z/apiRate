import pool from '../../../config.js';

export async function buscarAvaliacaoPorId(perfilId) {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.execute(`
            SELECT * FROM avaliacaoComentarios
            WHERE perfil_idperfil = ?
        `, [perfilId]);
        return rows[0];
    } finally {
        conn.release();
    }
}
