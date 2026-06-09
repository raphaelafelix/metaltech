// middleware de autenticação para proteger as rotas que exigem um token JWT válido, verificando o token enviado no cabeçalho Authorization e decodificando as informações do usuário para permitir o acesso às rotas protegidas
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ erro: "Token não enviado" });
  }

  const token = header.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido" });
  }
}

module.exports = auth;