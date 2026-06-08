const express = require("express");
const router = express.Router();

const auth = require("../src/middlewares/auth");
const Usuario = require("../src/models/usuario");
const Pedido = require("../src/models/pedido");
const Produto = require("../src/models/produto");

router.post("/login", async (req, res) => {
  const { email, senha, funcao } = req.body;

  const resultado = await Usuario.login(email, senha, funcao);

  if (!resultado) {
    return res.status(401).json({ erro: "Dados incorretos" });
  }

  res.json(resultado);
});

router.get("/produtos", auth, async (req, res) => {
  const produtos = await Produto.listarProdutos();
  res.json(produtos);
});

router.post("/pedidos", auth, async (req, res) => {
  const { produto_id, quantidade } = req.body;

  if (req.usuario.funcao !== "cliente") {
    return res.status(403).json({ erro: "Apenas clientes podem fazer pedidos" });
  }

  const pedido = await Pedido.criarPedido(req.usuario.id, produto_id, quantidade);
  res.json(pedido);
});

router.get("/meus-pedidos", auth, async (req, res) => {
  const pedidos = await Pedido.listarPedidosDoCliente(req.usuario.id);
  res.json(pedidos);
});

router.get("/pedidos", auth, async (req, res) => {
  if (req.usuario.funcao !== "admin") {
    return res.status(403).json({ erro: "Apenas admin pode ver todos os pedidos" });
  }

  const pedidos = await Pedido.listarPedidos();
  res.json(pedidos);
});

router.put("/pedidos/:id/status", auth, async (req, res) => {
  if (req.usuario.funcao !== "admin") {
    return res.status(403).json({ erro: "Apenas admin pode alterar status" });
  }

  const { status } = req.body;
  const resultado = await Pedido.atualizarStatus(req.params.id, status);

  res.json(resultado);
});

module.exports = router;