import { buscarFilmesPorNome } from "../servicos/filmes/buscar.js";

async function validarFilmeCompleto({ nome, dataLanc, sinopse, classInd }) {
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

  if (!dataLanc || isNaN(Date.parse(dataLanc))) {
    erros.push("A data de lançamento é obrigatória e deve ser válida.");
  }

  if (!sinopse || typeof sinopse !== 'string') {
    erros.push("A sinopse é obrigatória e deve ser uma string.");
  }


  return {
    valido: erros.length === 0,
    erros
  };
}

function validarFilmeParcial(dados) {
  const erros = [];

  if (dados.nome && typeof dados.nome !== 'string') erros.push("O nome deve ser uma string.");
  if (dados.dataLanc && isNaN(Date.parse(dados.dataLanc))) erros.push("A data de lançamento é inválida.");
  if (dados.sinopse && typeof dados.sinopse !== 'string') erros.push("A sinopse deve ser uma string.");
  return {
    valido: erros.length === 0,
    erros
  };
}

export { validarFilmeCompleto, validarFilmeParcial }