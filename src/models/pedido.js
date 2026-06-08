const { getDB, salvarDB } = require("../database/sqlite");

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

  const result = db.exec(`
    SELECT 
      pedidos.id,
      usuarios.nome AS cliente,
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

async function listarPedidosDoCliente(usuario_id) {
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

    pedidos.push({
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

  return { mensagem: "Status atualizado!" };
}

module.exports = {
  criarPedido,
  listarPedidos,
  listarPedidosDoCliente,
  atualizarStatus
};