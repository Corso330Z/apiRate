import pool from '../../../config.js';

export async function atualizarAvaliacao(
    perfilId,
    positiva,
    negativa,
    comentarios_idcomentarios,
    comentarios_perfil_idperfil,
    comentarios_filmes_idfilmes
) {
    const conn = await pool.getConnection();
    try {
        if (
            perfilId === undefined || 
            positiva === undefined || negativa === undefined ||
            comentarios_idcomentarios === undefined ||
            comentarios_perfil_idperfil === undefined ||
            comentarios_filmes_idfilmes === undefined
        ) {
            throw new Error('Parâmetros ausentes para atualização');
        }

        const sql = `
            UPDATE avaliacaoComentarios
            SET positiva = ?, negativa = ?, 
                comentarios_idcomentarios = ?, 
                comentarios_perfil_idperfil = ?, 
                comentarios_filmes_idfilmes = ?
            WHERE perfil_idperfil = ?
        `;

        const [result] = await conn.execute(sql, [
            positiva,
            negativa,
            comentarios_idcomentarios,
            comentarios_perfil_idperfil,
            comentarios_filmes_idfilmes,
            perfilId
        ]);

        if (result.affectedRows === 0) {
            return { mensagem: 'Nenhuma avaliação encontrada para atualizar' };
        }

        return { mensagem: 'Avaliação atualizada com sucesso' };
    } finally {
        conn.release();
    }
}
