const { getDB } = require("../database/sqlite");

// módulo para gerenciar os produtos, incluindo uma função para listar todos os produtos disponíveis, utilizando a conexão com o banco de dados SQLite para recuperar as informações dos produtos
async function listarProdutos() {
  const db = await getDB();

  const result = db.exec("SELECT * FROM produtos");

  if (!result.length) return [];

  return result[0].values.map((item) => ({
    id: item[0],
    codigo: item[1],
    nome: item[2],
    valor: item[3]
  }));
}

module.exports = { listarProdutos };