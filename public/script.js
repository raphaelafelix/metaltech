let token = localStorage.getItem("token") || "";
let usuario = JSON.parse(localStorage.getItem("usuario")) || null;

let produtosLista = [];
let carrinho = [];
let produtoSelecionadoModal = null;

const imagensProdutos = {
  "Parafuso": "/imagens/parafuso.jpg",
  "Porca": "/imagens/porca.jpg",
  "Arruela": "/imagens/arruela.jpg",
  "Flange": "/imagens/flange.jpg",
  "Engrenagem": "/imagens/engrenagem.jpg",
  "Eixo": "/imagens/eixo.jpg",
  "Chapa": "/imagens/chapa.jpg",
  "Rolamento": "/imagens/rolamento.jpg",
  "Mola": "/imagens/mola.jpg"
};

async function fazerLogin() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const funcao = document.getElementById("funcao").value;
  const erro = document.getElementById("erroLogin");

  erro.innerText = "";

  if (!email || !senha || !funcao) {
    erro.innerText = "Preencha todos os campos.";
    return;
  }

  try {
    const resposta = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        senha,
        funcao
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      erro.innerText = dados.erro || "Dados incorretos";
      return;
    }

    token = dados.token;
    usuario = dados.usuario;

    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));

    abrirSistema();

  } catch {
    erro.innerText = "Erro ao conectar com o servidor.";
  }
}

function abrirSistema() {
  document.getElementById("loginPage").classList.add("escondido");
  document.getElementById("sistemaPage").classList.remove("escondido");

  document.getElementById("nomeUsuario").innerText = usuario.nome;

  if (usuario.funcao === "admin") {

    document.getElementById("adminPage").classList.remove("escondido");
    document.getElementById("repositorPage").classList.add("escondido");

    carregarAdmin();

  } else {

    document.getElementById("repositorPage").classList.remove("escondido");
    document.getElementById("adminPage").classList.add("escondido");

    carregarMostruario();
    carregarMeusPedidos();
    atualizarCarrinho();
  }
}

async function carregarMostruario() {

  const area =
    document.getElementById("mostruarioProdutos");

  if (!area) return;

  produtosLista =
    await buscar("/api/produtos");

  area.innerHTML = "";

  produtosLista.forEach((produto) => {

    const imagem =
      imagensProdutos[produto.nome] ||
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=500&q=80";

    area.innerHTML += `
      <div class="produto-card">

        <img
          src="${imagem}"
          alt="${produto.nome}"
        >

        <div class="produto-info">

          <h3>${produto.nome}</h3>

          <p>
            Código: ${produto.codigo}
          </p>

          <strong>
            ${produto.valor.toLocaleString("pt-BR",{
              style:"currency",
              currency:"BRL"
            })}
          </strong>

          <button onclick="adicionarAoCarrinho(${produto.id})">
            🛒 Selecionar produto
          </button>

        </div>

      </div>
    `;
  });
}

function adicionarAoCarrinho(produtoId) {

  const produto =
    produtosLista.find(
      item => item.id === produtoId
    );

  if (!produto) {
    alert("Produto não encontrado.");
    return;
  }

  produtoSelecionadoModal = produto;

  document.getElementById(
    "modalProdutoNome"
  ).innerText = produto.nome;

  document.getElementById(
    "inputQuantidadeModal"
  ).value = 1;

  document.getElementById(
    "modalQuantidade"
  ).classList.remove("escondido");

  document.getElementById(
    "inputQuantidadeModal"
  ).focus();
}

function fecharModalQuantidade() {

  document.getElementById(
    "modalQuantidade"
  ).classList.add("escondido");

  produtoSelecionadoModal = null;
}

function confirmarQuantidade() {

  const quantidade = Number(
    document.getElementById(
      "inputQuantidadeModal"
    ).value
  );

  if (!quantidade || quantidade <= 0) {
    alert("Quantidade inválida.");
    return;
  }

  const produto =
    produtoSelecionadoModal;

  const itemExistente =
    carrinho.find(
      item => item.id === produto.id
    );

  if (itemExistente) {

    itemExistente.quantidade += quantidade;

  } else {

    carrinho.push({
      id: produto.id,
      codigo: produto.codigo,
      nome: produto.nome,
      valor: produto.valor,
      quantidade: quantidade
    });
  }

  atualizarCarrinho();
  fecharModalQuantidade();
  abrirCarrinho();
}
function atualizarCarrinho() {

  const lista =
    document.getElementById("listaCarrinho");

  const totalCarrinho =
    document.getElementById("totalCarrinho");

  const contadorMobile =
    document.getElementById(
      "contadorCarrinhoMobile"
    );

  if (!lista) return;

  lista.innerHTML = "";

  if (carrinho.length === 0) {

    lista.innerHTML = `
      <div class="carrinho-vazio">
        Seu carrinho está vazio.
      </div>
    `;

    totalCarrinho.innerText = "R$ 0,00";

    if (contadorMobile) {
      contadorMobile.innerText = "0";
    }

    return;
  }

  let total = 0;
  let quantidadeTotal = 0;

  carrinho.forEach((item) => {

    const subtotal =
      item.valor * item.quantidade;

    total += subtotal;
    quantidadeTotal += item.quantidade;

    lista.innerHTML += `
      <div class="item-carrinho">

        <div>

          <h4>${item.nome}</h4>

          <p>
            Código: ${item.codigo}
          </p>

          <p>
            ${item.quantidade} x
            ${item.valor.toLocaleString("pt-BR",{
              style:"currency",
              currency:"BRL"
            })}
          </p>

        </div>

        <div class="acoes-carrinho">

          <strong>
            ${subtotal.toLocaleString("pt-BR",{
              style:"currency",
              currency:"BRL"
            })}
          </strong>

          <div class="botoes-qtd">

            <button onclick="diminuirQuantidade(${item.id})">
              -
            </button>

            <span>${item.quantidade}</span>

            <button onclick="aumentarQuantidade(${item.id})">
              +
            </button>

          </div>

          <button
            class="remover"
            onclick="removerDoCarrinho(${item.id})"
          >
            Remover
          </button>

        </div>

      </div>
    `;
  });

  totalCarrinho.innerText =
    total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  if (contadorMobile) {
    contadorMobile.innerText =
      quantidadeTotal;
  }
}

function aumentarQuantidade(id) {

  const item =
    carrinho.find(
      produto => produto.id === id
    );

  if (item) {
    item.quantidade++;
  }

  atualizarCarrinho();
}

function diminuirQuantidade(id) {

  const item =
    carrinho.find(
      produto => produto.id === id
    );

  if (!item) return;

  item.quantidade--;

  if (item.quantidade <= 0) {

    carrinho =
      carrinho.filter(
        produto => produto.id !== id
      );
  }

  atualizarCarrinho();
}

function removerDoCarrinho(id) {

  carrinho =
    carrinho.filter(
      produto => produto.id !== id
    );

  atualizarCarrinho();
}
function enviarCarrinho(){

  if(carrinho.length === 0){

    alert(
      "Seu carrinho está vazio."
    );

    return;
  }

  document
    .getElementById("modalFinalizar")
    .classList.remove("escondido");
}

function abrirCarrinho() {

  const carrinhoBox =
    document.getElementById(
      "carrinhoBox"
    );

  const fundo =
    document.getElementById(
      "fundoCarrinho"
    );

  if (carrinhoBox) {
    carrinhoBox.classList.add("ativo");
  }

  if (fundo) {
    fundo.classList.add("ativo");
  }
}

function fecharCarrinho() {

  const carrinhoBox =
    document.getElementById(
      "carrinhoBox"
    );

  const fundo =
    document.getElementById(
      "fundoCarrinho"
    );

  if (carrinhoBox) {
    carrinhoBox.classList.remove("ativo");
  }

  if (fundo) {
    fundo.classList.remove("ativo");
  }
}

async function carregarMeusPedidos() {

  const pedidos =
    await buscar("/api/meus-pedidos");

  const tabela =
    document.getElementById(
      "tabelaRepositor"
    );

  tabela.innerHTML = "";

  pedidos.forEach((pedido) => {

    tabela.innerHTML += `
      <tr>

        <td>${pedido.codigo}</td>

        <td>${pedido.produto}</td>

        <td>${pedido.quantidade}</td>

        <td>
          R$
          ${pedido.arrecadado
            .toFixed(2)
            .replace(".", ",")}
        </td>

        <td>${pedido.status}</td>

        <td>${pedido.data}</td>

      </tr>
    `;
  });
}

async function carregarAdmin() {

  const pedidos = await buscar("/api/pedidos");

  const tabela = document.getElementById("tabelaAdmin");

  tabela.innerHTML = "";

  let total = 0;
  let pendentes = 0;

  pedidos.filter(pedido => pedido.status !== "Cancelado").forEach((pedido) => {

    if (pedido.status !== "Cancelado") {
          total += pedido.arrecadado;
        }

        if (pedido.status === "Pendente") {
          pendentes++;
        }

    tabela.innerHTML += `
      <tr>

        <td>
          ${pedido.nomeContato || pedido.repositor || "Não informado"}
        </td>

        <td>
          ${pedido.telefoneContato || "Não informado"}
        </td>

        <td>
          ${pedido.data
            ? new Date(pedido.data).toLocaleString("pt-BR")
            : "Sem data"}
        </td>

        <td>${pedido.codigo}</td>

        <td>${pedido.produto}</td>

        <td>${pedido.quantidade}</td>

        <td>
          R$ ${pedido.arrecadado
            .toFixed(2)
            .replace(".", ",")}
        </td>

        <td>
          <select onchange="alterarStatus(${pedido.id}, this.value)">
            <option ${pedido.status === "Pendente" ? "selected" : ""}>
              Pendente
            </option>

            <option ${pedido.status === "Produzindo" ? "selected" : ""}>
              Produzindo
            </option>

            <option ${pedido.status === "Finalizado" ? "selected" : ""}>
              Finalizado
            </option>

            <option ${pedido.status === "Cancelado" ? "selected" : ""}>
              Cancelado
            </option>
          </select>
        </td>

        <td>
          <button
            class="btn-cancelar-pedido"
            onclick="cancelarPedido(${pedido.id})"
          >
            Cancelar
          </button>
        </td>

      </tr>
    `;
  });

  document.getElementById("totalFaturado").innerText =
    total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  document.getElementById("pendentes").innerText = pendentes;

 const pedidosValidos = pedidos.filter(
  pedido => pedido.status !== "Cancelado"
);

document.getElementById("totalPedidos").innerText = pedidosValidos.length;
}

async function alterarStatus(id, status) {

  await fetch(
    `/api/pedidos/${id}/status`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify({
        status
      })
    }
  );

  carregarAdmin();
}
async function cancelarPedido(id) {

  const confirmar = confirm(
    "Tem certeza que deseja cancelar este pedido?"
  );

  if (!confirmar) {
    return;
  }

  await fetch(`/api/pedidos/${id}/status`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },

    body: JSON.stringify({
      status: "Cancelado"
    })
  });

  carregarAdmin();
}
async function buscar(url) {

  const resposta =
    await fetch(url, {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    });

  return await resposta.json();
}

function mostrarTelaPrincipal() {
  abrirSistema();
}

function sair() {
  localStorage.clear();
  location.reload();
}

function toggleSenha() {

  const senhaInput =
    document.getElementById("senha");

  if (
    senhaInput.type === "password"
  ) {

    senhaInput.type = "text";

  } else {

    senhaInput.type = "password";
  }
}

window.onload = () => {

  if (token && usuario) {
    abrirSistema();
  }
};
function fecharFinalizacao(){

  document
    .getElementById("modalFinalizar")
    .classList.add("escondido");
}
async function confirmarPedidoFinal(){

  const nome =
    document
      .getElementById("nomeContato")
      .value
      .trim();

  const telefone =
    document
      .getElementById("telefoneContato")
      .value
      .trim();

  if(!nome || !telefone){

    alert(
      "Preencha nome e telefone."
    );

    return;
  }

  try{

    for(const item of carrinho){

      await fetch("/api/pedidos",{

        method:"POST",

        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },

        body:JSON.stringify({

          produto_id:item.id,

          quantidade:item.quantidade,

          nomeContato:nome,

          telefoneContato:telefone

        })
      });
    }

    alert(
      "Pedido enviado com sucesso!"
    );

    carrinho = [];

    atualizarCarrinho();

    fecharCarrinho();

    fecharFinalizacao();

    carregarMeusPedidos();

  }catch{

    alert(
      "Erro ao enviar pedido."
    );
  }
}