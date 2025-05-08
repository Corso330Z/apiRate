import { buscarProdutoresPorNome } from "../servicos/produtor/buscar.js";

async function validarProdutorCompleto(nome) {
  const erros = [];

  if (!nome || typeof nome !== 'string') {
    erros.push("O nome é obrigatório e deve ser uma string.");
  } else {
    // Verifica se já existe um produtor com o mesmo nome
    const produtoresExistentes = await buscarProdutoresPorNome(nome);
    if (produtoresExistentes.length > 0) {
      erros.push("Já existe um produtor com esse nome cadastrado.");
    }
  }
  return {
    valido: erros.length === 0,
    erros
  };
}

async function validarProdutorParcial(nome) {
  const erros = [];

  if (nome && typeof nome !== 'string') erros.push("O nome deve ser uma string.");
  return {
    valido: erros.length === 0,
    erros
  };
}

export { validarProdutorCompleto, validarProdutorParcial }