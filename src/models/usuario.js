const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../database/sqlite");


// módulo para gerenciar os usuários, incluindo uma função de login que verifica as credenciais do usuário e retorna um token JWT válido para autenticação nas rotas protegidas, utilizando a conexão com o banco de dados SQLite para recuperar as informações dos usuários
async function login(email, senha, funcao) {
  const db = await getDB();

  email = email.trim().toLowerCase();
  funcao = funcao.trim().toLowerCase();

  const stmt = db.prepare(`
    SELECT * FROM usuarios 
    WHERE LOWER(email) = ? AND LOWER(funcao) = ?
  `);

  stmt.bind([email, funcao]);

// verifica se o usuário existe e se a senha está correta, retornando um token JWT com as informações do usuário para autenticação nas rotas protegidas
  if (!stmt.step()) {
    stmt.free();
    return null;
  }

  const usuario = stmt.getAsObject();
  stmt.free();

  const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);

  if (!senhaCorreta) {
    return null;
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      funcao: usuario.funcao
    },
    process.env.JWT_SECRET || "metaltech_secreto",
    { expiresIn: "1d" }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      funcao: usuario.funcao
    }
  };
}

module.exports = { login };