import pool from '../../../config.js';

async function deletarPerfil(id) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        await conexao.beginTransaction();

        // 1. Excluir avaliações relacionadas a comentários feitos por este perfil
        await conexao.execute(`
            DELETE AC FROM avaliacaoComentarios AC
            JOIN comentarios C ON 
                AC.comentarios_idcomentarios = C.idcomentarios
                AND AC.comentarios_perfil_idperfil = C.perfil_idperfil
                AND AC.comentarios_filmes_idfilmes = C.filmes_idfilmes
            WHERE C.perfil_idperfil = ?
        `, [id]);

        // 2. Excluir avaliações feitas pelo perfil
        await conexao.execute(`DELETE FROM avaliacaoSugsFilmes WHERE perfil_idperfil = ?`, [id]);
        await conexao.execute(`DELETE FROM avaliacaoSugsAtores WHERE perfil_idperfil = ?`, [id]);
        await conexao.execute(`DELETE FROM avaliacaoFilmes WHERE perfil_idperfil = ?`, [id]);
        await conexao.execute(`DELETE FROM avaliacaoAtores WHERE perfil_idperfil = ?`, [id]);

        // 3. Excluir favoritos
        await conexao.execute(`DELETE FROM favoritosFilmes WHERE perfil_idperfil = ?`, [id]);
        await conexao.execute(`DELETE FROM favoritosAtores WHERE perfil_idperfil = ?`, [id]);

        // 4. Excluir sugestões
        await conexao.execute(`DELETE FROM sugestoesFilmes WHERE perfil_idperfil = ?`, [id]);
        await conexao.execute(`DELETE FROM sugestoesAtores WHERE perfil_idperfil = ?`, [id]);

        // 5. Excluir comentários (após as avaliações dos comentários)
        await conexao.execute(`DELETE FROM comentarios WHERE perfil_idperfil = ?`, [id]);

        // 6. Excluir perfil
        const [resultado] = await conexao.execute(`DELETE FROM perfil WHERE idperfil = ?`, [id]);

        await conexao.commit();
        return [resultado];
    } catch (error) {
        if (conexao) await conexao.rollback();
        console.error("Erro ao deletar perfil e dependências:", error.message);
        throw error;
    } finally {
        if (conexao) conexao.release();
    }
}

export { deletarPerfil };
