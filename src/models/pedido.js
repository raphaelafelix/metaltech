// módulo para gerenciar os pedidos, incluindo funções para criar um novo pedido, listar todos os pedidos, listar os pedidos de um repositório específico, atualizar o status de um pedido e excluir um pedido, utilizando a conexão com o banco de dados SQLite para armazenar e recuperar as informações dos pedidos
const { getDB, salvarDB } = require("../database/sqlite"); // importa as funções para obter a conexão com o banco de dados e salvar as alterações no banco de dados

async function criarPedido(usuario_id, produto_id, quantidade) {
  const db = await getDB();

  const data = new Date().toLocaleDateString("pt-BR");

  db.run(`
    INSERT INTO pedidos (usuario_id, produto_id, quantidade, status, data)
    VALUES (?, ?, ?, ?, ?)
  `, [usuario_id, produto_id, quantidade, "Pendente", data]);

  salvarDB();

  return { mensagem: "Pedido criado com sucesso!" };
}

async function listarPedidos() {
  const db = await getDB();

  const result = db.exec(` // consulta SQL para listar todos os pedidos, juntando as tabelas de pedidos, usuários e produtos para obter as informações completas de cada pedido, ordenando por ID em ordem decrescente
    SELECT 
      pedidos.id,
      usuarios.nome AS repositor,
      produtos.codigo,
      produtos.nome,
      pedidos.quantidade,
      produtos.valor,
      pedidos.status,
      pedidos.data
    FROM pedidos
    JOIN usuarios ON usuarios.id = pedidos.usuario_id
    JOIN produtos ON produtos.id = pedidos.produto_id
    ORDER BY pedidos.id DESC
  `);

  if (!result.length) return [];

  return result[0].values.map((item) => ({
    id: item[0],
    cliente: item[1],
    codigo: item[2],
    produto: item[3],
    quantidade: item[4],
    valor: item[5],
    arrecadado: item[4] * item[5],
    status: item[6],
    data: item[7]
  }));
}

async function listarPedidosDoRepositor(usuario_id) {
  const db = await getDB();

  const stmt = db.prepare(`
    SELECT 
      pedidos.id,
      produtos.codigo,
      produtos.nome,
      pedidos.quantidade,
      produtos.valor,
      pedidos.status,
      pedidos.data
    FROM pedidos
    JOIN produtos ON produtos.id = pedidos.produto_id
    WHERE pedidos.usuario_id = ?
    ORDER BY pedidos.id DESC
  `);

  stmt.bind([usuario_id]);

  const pedidos = [];

  while (stmt.step()) {
    const item = stmt.getAsObject();

    pedidos.push({ // mapeia os resultados da consulta para um formato mais amigável, calculando o valor arrecadado multiplicando a quantidade pelo valor do produto
      id: item.id,
      codigo: item.codigo,
      produto: item.nome,
      quantidade: item.quantidade,
      valor: item.valor,
      arrecadado: item.quantidade * item.valor,
      status: item.status,
      data: item.data
    });
  }

  stmt.free();

  return pedidos;
}

async function atualizarStatus(id, status) {
  const db = await getDB();

  db.run(`UPDATE pedidos SET status = ? WHERE id = ?`, [status, id]);

  salvarDB();

  return { mensagem: "Status atualizado!" }; // retorna uma mensagem de sucesso após atualizar o status do pedido no banco de dados
}

module.exports = {
  criarPedido,
  listarPedidos,
  listarPedidosDoRepositor,
  atualizarStatus,
  excluirPedido
};

async function excluirPedido(id) {
  const db = await getDB();

  db.run(`DELETE FROM pedidos WHERE id = ?`, [id]);

  salvarDB();

  return { mensagem: "Pedido excluído com sucesso!" };
}




















































