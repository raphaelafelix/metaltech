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

    // salva informações
    const clientes = 
      ['Lucas Ferreira Santos',   '11991234501']
      ['Camila Rodrigues Lima',   '11991234502']
      ['Rafael Oliveira Costa',   '11991234503']
      ['Isabela Martins Souza',   '11991234504'] 
      ['Bruno Almeida Pereira',   '11991234505'] 
      ['Juliana Nascimento Dias', '11991234506']
      ['Thiago Carvalho Mendes',  '11991234507']
      ['Fernanda Gomes Ribeiro',  '11991234508'] 
      ['Diego Barbosa Freitas',   '11991234509']
      ['Larissa Teixeira Moura',  '11991234510']
      ['Matheus Cardoso Nunes',   '11991234511']
      ['Patrícia Rocha Vieira',   '11991234512']
      ['Anderson Silva Campos',   '11991234513'] 
      ['Natália Araújo Castro',   '11991234514']
      ['Felipe Cunha Rezende',    '11991234515']
      ['Vanessa Lopes Guimarães', '11991234516']
      ['Gustavo Pires Andrade',   '11991234517']
      ['Aline Moreira Fonseca',   '11991234518']
      ['Rodrigo Tavares Monteiro','11991234519']
      ['Carolina Batista Pinto',  '11991234520'];

    for (const [nome, tel, end, obs] of clientes) {
      run('INSERT INTO clientes (nome, telefone, endereco, observacoes) VALUES (?, ?, ?, ?)',
        [nome, tel, JSON.stringify(end), obs]);
    }
    console.log(' 20 clientes criados');

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