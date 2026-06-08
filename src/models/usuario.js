const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../database/sqlite");

async function login(email, senha, funcao) {
  const db = await getDB();

  email = email.trim().toLowerCase();
  funcao = funcao.trim().toLowerCase();

  const stmt = db.prepare(`
    SELECT * FROM usuarios 
    WHERE LOWER(email) = ? AND LOWER(funcao) = ?
  `);

  stmt.bind([email, funcao]);

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