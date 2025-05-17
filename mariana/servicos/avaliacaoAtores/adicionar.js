import pool from '../../../config.js';

export async function inserirAvaliacao(perfilId, atorId, positiva, negativa) {
    const conn = await pool.getConnection();
    try {
        const sql = `
        INSERT INTO avaliacaoAtores (perfil_idperfil, atores_idatores, positiva , negativa)
        VALUES (?, ?, ?, ?)
        `;
        const [result] = await conn.execute(sql, [perfilId, atorId, positiva, negativa]);
        return { idavaliacao: result.insertId };
    } finally {
        conn.release();
    }
}
