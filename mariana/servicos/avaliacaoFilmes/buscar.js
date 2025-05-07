import pool from '../../../config.js';

export async function buscarAvaliacaoPorId(perfilId, filmeId) {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.execute(`
            SELECT * FROM avaliacaoFilmes
            WHERE perfil_idperfil = ? AND filmes_idfilmes = ?
        `, [perfilId, filmeId]);
        return rows[0];
    } finally {
        conn.release();
    }
}
