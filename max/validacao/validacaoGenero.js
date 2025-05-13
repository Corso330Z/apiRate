import { buscarGenero } from "../servicos/genero/buscar";

async function validarGenero({ nome }) {
  const erros = [];

  if (!nome || typeof nome !== "string") {
    erros.push("O nome é obrigatório e deve ser uma string.");
  } else {
    // Verifica se já existe um genero com o mesmo nome
    const atoresExistentes = await buscarAtorPorNome(nome);
    if (atoresExistentes.length > 0) {
      erros.push("Já existe um ator com esse nome cadastrado.");
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
