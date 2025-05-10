import pool from '../../../config.js';

export async function inserirAvaliacao(perfilId, filmeId, positiva, negativa) {
    const conn = await pool.getConnection();
    try {
        const sql = `
        INSERT INTO avaliacaoFilmes (perfil_idperfil, filmes_idfilmes, positiva , negativa)
        VALUES (?, ?, ?, ?)
    `;
    
        const [result] = await conn.execute(sql, [perfilId, filmeId, positiva, negativa]);
        return { idavaliacao: result.insertId };
    } finally {
        conn.release();
    }
}
