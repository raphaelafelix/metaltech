// módulo para gerenciar a conexão com o banco de dados SQLite usando a biblioteca sql.js, permitindo criar, ler, atualizar e salvar o banco de dados em um arquivo local
const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");

const dbPath = path.join(__dirname, "../../metaltech.db");

let db;

async function getDB() {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const filebuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
    salvarDB();
  }

  return db;
}

function salvarDB() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

module.exports = {
  getDB,
  salvarDB
};