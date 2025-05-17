import pool from '../../../config.js';
export async function atualizarAvaliacao(perfilId, atorId, positiva, negativa) {
    const conn = await pool.getConnection();
    try {
        if (
            perfilId === undefined || atorId === undefined ||
            positiva === undefined || negativa === undefined
        ) {
            throw new Error('Parâmetros ausentes para atualização');
        }

        const sql = `
            UPDATE avaliacaoAtores
            SET positiva = ?, negativa = ?
            WHERE perfil_idperfil = ? AND atores_idatores = ?
        `;
        const [result] = await conn.execute(sql, [positiva, negativa, perfilId, atorId]);

        if (result.affectedRows === 0) {
            return { mensagem: 'Nenhuma avaliação encontrada para atualizar' };
        }

        return { mensagem: 'Avaliação atualizada com sucesso' };
    } finally {
        conn.release();
    }
}
