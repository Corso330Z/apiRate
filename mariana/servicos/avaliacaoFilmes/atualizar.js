import pool from '../../../config.js';

export async function atualizarAvaliacao(perfilId, filmeId, like, dislike) {
    const conn = await pool.getConnection();
    try {
        const sql = `
            UPDATE avaliacaoFilmes
            SET like = ?, dislike = ?
            WHERE perfil_idperfil = ? AND filmes_idfilmes = ?
        `;
        const [result] = await conn.execute(sql, [like, dislike, perfilId, filmeId]);
        return { mensagem: 'Avaliação atualizada com sucesso' };
    } finally {
        conn.release();
    }
}
