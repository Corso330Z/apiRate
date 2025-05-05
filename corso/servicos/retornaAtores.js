import pool from "../../config.js"

export async function retornaAtores() {
    const conexao= await pool.getConnection();
    const query = "SELECT atores.id, atores.nome, atores.dataNasc, atores.vivo, atores.fotoAtor FROM atores inner";
    const atores = executaQuery(conexao, query);
    conexao.release();
    return atores;
}

export async function retornaAtoresPorNome() {
    const conexao= await pool.getConnection();
    const query = "SELECT atores.id, atores.nome, atores.dataNasc, atores.vivo, atores.fotoAtor FROM atores";
    const atores = executaQuery(conexao, query);
    conexao.release();
    return atores;
}