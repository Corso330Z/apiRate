import pool from '../../../config.js';

export async function buscarAvaliacaoPorId(perfilId, atorId) {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.execute(`
            SELECT * FROM avaliacaoAtores
            WHERE perfil_idperfil = ? AND atores_idatores = ?
        `, [perfilId, atorId]);
        return rows[0];
    } finally {
        conn.release();
    }
}
