import { buscarPerfilPorEmail } from "../servicos/perfil/buscar.js";

async function validarPerfilCompleto({ nome, email }) {
  const erros = [];

  if (!nome || typeof nome !== 'string') {
    erros.push("O nome é obrigatório e deve ser uma string.");
  } else {
    // Verifica se já existe um Perfil com o mesmo nome
    const PerfilExistentes = await buscarPerfilPorEmail(email);
    if (PerfilExistentes.length > 0) {
      erros.push("Já existe um Perfil com esse email cadastrado.");
    }
  }

  return {
    valido: erros.length === 0,
    erros
  };
}

function validarPerfilParcial(dados) {
  const erros = [];

  if (dados.nome && typeof dados.nome !== 'string') erros.push("O nome deve ser uma string.");

  return {
    valido: erros.length === 0,
    erros
  };
}

export { validarPerfilCompleto, validarPerfilParcial }