import pool from '../../../config.js';

export async function deletarAvaliacao(perfilId, atorId) {
    const conn = await pool.getConnection();
    try {
        const sql = `
            DELETE FROM avaliacaoAtores
            WHERE perfil_idperfil = ? AND atores_idatores = ?
        `;
        await conn.execute(sql, [perfilId, atorId]);
    } finally {
        conn.release();
    }
}

