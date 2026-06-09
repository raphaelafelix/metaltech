const bcrypt = require("bcryptjs");
const { getDB, salvarDB } = require("./src/database/sqlite");

async function seed() {
  const db = await getDB();

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      email TEXT UNIQUE,
      senha TEXT,
      funcao TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT,
      nome TEXT,
      valor REAL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      produto_id INTEGER,
      quantidade INTEGER,
      status TEXT,
      data TEXT
    );
  `);


  const senha = bcrypt.hashSync("123456", 10);



  db.run(`
    INSERT OR IGNORE INTO usuarios (id, nome, email, senha, funcao)
    VALUES 
    (1, 'Administrador', 'admin@metaltech.com', '${senha}', 'admin'),
    (2, 'Repositor', 'repositor@metaltech.com', '${senha}', 'repositor');
  `);

  db.run(`
    INSERT OR IGNORE INTO produtos (id, codigo, nome, valor)
    VALUES
    (1, '123872', 'Porca', 2.00),
    (2, '233442', 'Parafuso', 1.50),
    (3, '944141', 'Flange', 8.00),
    (4, '778899', 'Arruela', 0.75),
    (5, '112233', 'Engrenagem', 35.00);
  `);

  salvarDB();
  console.log("Banco criado com sucesso!");
}

seed();