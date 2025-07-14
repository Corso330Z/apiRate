import { buscarAtorPorNome } from "../../corso/servicos/atores/buscar.js";

async function validarSugestaoAtorCompleto(nome) {
  const erros = [];

  if (!nome || typeof nome !== 'string') {
    erros.push("O nome é obrigatório e deve ser uma string.");
  } else {
    // Verifica se já existe um ator com o mesmo nome
    const atoresExistentes = await buscarAtorPorNome(nome);
    if (atoresExistentes.length > 0) {
      erros.push("Já existe um ator com esse nome cadastrado.");
    }
  }

  return {
    valido: erros.length === 0,
    erros
  };
}


export { validarSugestaoAtorCompleto }