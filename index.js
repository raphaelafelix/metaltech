// arquivo principal do servidor Express, configurando as rotas, middlewares e a conexão com o banco de dados, além de servir os arquivos estáticos da pasta public e iniciar o servidor na porta especificada nas variáveis de ambiente ou na porta 3000 por padrão
require("dotenv").config(); // carrega as variáveis de ambiente do arquivo .env

const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});