const { getDB } = require("../database/sqlite");

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