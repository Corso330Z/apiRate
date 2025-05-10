import { buscarAtorPorNome } from "../servicos/atores/buscar.js";

async function validarAtorCompleto({ nome, dataNasc, vivo }) {
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

  if (!vivo || isNaN(parseInt(vivo))) {
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

function validarAtorParcial(camposAtualizar) {
  const erros = [];

  if (camposAtualizar.nome && typeof camposAtualizar.nome !== 'string') erros.push("O nome deve ser uma string.");
  if (camposAtualizar.dataNasc && isNaN(Date.parse(camposAtualizar.dataNasc))) erros.push("A data de nascimento é inválida.");
  if (camposAtualizar.vivo && isNaN(parseInt(camposAtualizar.vivo))) erros.push("A opção se o ator está vivo deve ser escolhida, com 1 para vivo e 0 para morto.");
  if (camposAtualizar.vivo < 0 || camposAtualizar.vivo > 1) {
    erros.push("A opção é inválida. 1 - vivo ou 0 - morto.");
  }
  return {
    valido: erros.length === 0,
    erros
  };
}

export { validarAtorCompleto, validarAtorParcial }