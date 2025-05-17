import { buscarFilmesPorNome } from "../../hiago/servicos/filmes/buscar.js"

async function validarSugestaoFilmeCompleto({ nome }) {
  const erros = [];

  if (!nome || typeof nome !== 'string') {
    erros.push("O nome é obrigatório e deve ser uma string.");
  } else {
    // Verifica se já existe um filme com o mesmo nome
    const filmesExistentes = await buscarFilmesPorNome(nome);
    if (filmesExistentes.length > 0) {
      erros.push("Já existe um filme com esse nome cadastrado.");
    }
  }

  return {
    valido: erros.length === 0,
    erros
  };
}


export { validarSugestaoFilmeCompleto }