import { buscarGenero } from "../servicos/genero/buscar";
import { buscarFilmesGenero } from "../servicos/generoFilme/generoFilme";

async function validarGenero({ nome }) {
  const erros = [];

  if (!nome || typeof nome !== "string") {
    erros.push("O nome é obrigatório e deve ser uma string.");
  } else {
    // Verifica se já existe um genero com o mesmo nome
    const generoExistentes = await buscarFilmesGenero(nome);
    if (generoExistentes.length > 0) {
      erros.push("Já existe um gênero com esse nome cadastrado.");
    }
  }
}

function validarGeneroParcial(dados) {
  const erros = [];

  if (dados.nome && typeof dados.nome !== "string")
    erros.push("O nome deve ser uma string.");
  return {
    valido: erros.length === 0,
    erros,
  };
}

export { validarGenero, validarGeneroParcial};
