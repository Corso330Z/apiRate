import { buscarDiretoresPorNome } from "../servicos/diretor/buscar.js";

async function validarDiretorCompleto(nome) {
  const erros = [];

  if (!nome || typeof nome !== 'string') {
    erros.push("O nome é obrigatório e deve ser uma string.");
  } else {
    // Verifica se já existe um diretor com o mesmo nome
    const diretoresExistentes = await buscarDiretoresPorNome(nome);
    if (diretoresExistentes.length > 0) {
      erros.push("Já existe um diretor com esse nome cadastrado.");
    }
  }
  return {
    valido: erros.length === 0,
    erros
  };
}

async function validarDiretorParcial(nome) {
  const erros = [];

  if (nome && typeof nome !== 'string') erros.push("O nome deve ser uma string.");
  return {
    valido: erros.length === 0,
    erros
  };
}

export { validarDiretorCompleto, validarDiretorParcial }