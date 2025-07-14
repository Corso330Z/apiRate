import { buscarAtorPorNome } from "../servicos/atores/buscar.js";

async function validarAtorCompleto( nome, dataNasc, vivo ) {
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

  if (!dataNasc || isNaN(Date.parse(dataNasc))) {
    erros.push("A data de nascimento é obrigatória e deve ser válida.");
  }
  console.log(!vivo)
  if (isNaN(parseInt(vivo))) {
    erros.push("A opção se o ator está vivo deve ser escolhida, com 1 para vivo e 0 para morto.");
  }

  if (vivo < 0 || vivo > 1) {
    erros.push("A opção é inválida. 1 - vivo ou 0 - morto.");
  }
  return {
    valido: erros.length === 0,
    erros
  };
}

function validarAtorParcial(dados) {
  const erros = [];

  if (dados.nome && typeof dados.nome !== 'string') erros.push("O nome deve ser uma string.");
  if (dados.dataNasc && isNaN(Date.parse(dados.dataNasc))) erros.push("A data de nascimento é inválida.");
  if (dados.vivo && isNaN(parseInt(dados.vivo))) erros.push("A opção se o ator está vivo deve ser escolhida, com 1 para vivo e 0 para morto.");
  if (dados.vivo < 0 || dados.vivo > 1) {
    erros.push("A opção é inválida. 1 - vivo ou 0 - morto.");
  }
  return {
    valido: erros.length === 0,
    erros
  };
}

export { validarAtorCompleto, validarAtorParcial }