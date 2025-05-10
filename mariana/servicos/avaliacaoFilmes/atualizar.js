import pool from '../../../config.js';

export async function atualizarAvaliacao(perfilId, filmeId, positiva, negativa) {
    const conn = await pool.getConnection();
    try {
        if (
            perfilId === undefined || filmeId === undefined ||
            positiva === undefined || negativa === undefined
        ) {
            throw new Error('Parâmetros ausentes para atualização');
        }

        const sql = `
            UPDATE avaliacaoFilmes
            SET positiva = ?, negativa = ?
            WHERE perfil_idperfil = ? AND filmes_idfilmes = ?
        `;
        const [result] = await conn.execute(sql, [positiva, negativa, perfilId, filmeId]);

        if (result.affectedRows === 0) {
            return { mensagem: 'Nenhuma avaliação encontrada para atualizar' };
        }

        return { mensagem: 'Avaliação atualizada com sucesso' };
    } finally {
        conn.release();
    }
}
