// variáveis globais para armazenar o token de autenticação, as informações do usuário logado, a lista de produtos, o carrinho de compras e o produto selecionado no modal de quantidade, além de um objeto para mapear os nomes dos produtos às suas respectivas imagens

let token = localStorage.getItem("token") || ""; // tenta recuperar o token de autenticação do localStorage para manter a sessão ativa, ou define como string vazia caso não exista
let usuario = JSON.parse(localStorage.getItem("usuario")) || null;

let produtosLista = [];
let carrinho = [];
let produtoSelecionadoModal = null;

const imagensProdutos = { // mostra imagens na página
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

async function fazerLogin() { // funções para executar login
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const funcao = document.getElementById("funcao").value;
  const erro = document.getElementById("erroLogin");

  erro.innerText = "";

  if (!email || !senha || !funcao) { // valida e analisa se os campos estão preenchidos
    erro.innerText = "Preencha todos os campos.";
    return;
  }

  try { // tenta logar, analisando os dados internos e caso não esteja tudo certo, mostra mensagem de erro!
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

    if (!resposta.ok) { // se a resposta for diferente (!) de ok, mostra mensagem de erro
      erro.innerText = dados.erro || "Dados incorretos";
      return;
    }

    token = dados.token; // salva o token e as informações do usuário no localStorage para manter a sessão ativa
    usuario = dados.usuario;

    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));

    abrirSistema();

  } catch {
    erro.innerText = "Erro ao conectar com o servidor."; // detecta erro
  }
}

function abrirSistema() { // mostra  a tela principal do sistema, escondendo a tela de login e mostrando as informações do usuário logado, além de carregar as informações específicas para cada função (admin ou repositor)
  document.getElementById("loginPage").classList.add("escondido"); // escondendo a tela do login
  document.getElementById("sistemaPage").classList.remove("escondido"); // mostrando a tela do sistema

  document.getElementById("nomeUsuario").innerText = usuario.nome; // mostrando o nome do usuário logado

  if (usuario.funcao === "admin") { // se for admin, mostra a página de admin e carrega as informações de pedidos para o admin, caso contrário, mostra  a página do repositor e carrega as informações de mostruário e pedidos para o repositor

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

async function carregarMostruario() { // função para carregar o mostruário de produtos, buscando as informações da API e mostrando na tela, além de mostrar a imagem correspondente a cada produto (ou uma imagem genérica caso não tenha uma específica)

  const area = // seleciona a área onde os produtos serão mostrados
    document.getElementById("mostruarioProdutos");

  if (!area) return; // se a área não for encontrada, sai da função

  produtosLista =
    await buscar("/api/produtos");

  area.innerHTML = "";

  produtosLista.forEach((produto) => {

    const imagem =
      imagensProdutos[produto.nome] ||
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=500&q=80"; // imagem genérica caso não tenha uma específica para o produto

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
          > Selecionar produto
          </button>

        </div>

      </div>
    `;
  });
}

function adicionarAoCarrinho(produtoId) { // função para adicionar um produto ao carrinho, mostrando um modal para selecionar a quantidade e confirmando a adição ao carrinho, além de validar a quantidade selecionada

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

  document.getElementById( // seta a quantidade inicial como 1 no modal de seleção de quantidade
    "inputQuantidadeModal"
  ).value = 1;

  document.getElementById(
    "modalQuantidade"
  ).classList.remove("escondido");

  document.getElementById(
    "inputQuantidadeModal"
  ).focus();
}

function fecharModalQuantidade() { // função para fechar o modal de quantidade, limpando as informações do produto selecionado e escondendo o modal

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

  if (itemExistente) { // se o produto já estiver no carrinho, apenas atualiza a quantidade, somando a nova quantidade à existente

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


  // após confirmar a quantidade, atualiza o carrinho, fecha o modal de quantidade e abre o carrinho para mostrar os itens adicionados
  atualizarCarrinho();
  fecharModalQuantidade();
  abrirCarrinho();
}
function atualizarCarrinho() {  // função para atualizar as informações do carrinho, mostrando os itens adicionados, a quantidade total e o valor total, além de permitir aumentar ou diminuir a quantidade de cada item ou remover o item do carrinho, e também atualizar o contador de itens no carrinho para a versão mobile

  const lista =
    document.getElementById("listaCarrinho");

  const totalCarrinho =
    document.getElementById("totalCarrinho");

  const contadorMobile =
    document.getElementById(
      "contadorCarrinhoMobile"
    );

  if (!lista) return; // se a lista do carrinho não for encontrada, sai da função

  lista.innerHTML = "";

  if (carrinho.length === 0) { // se o carrinho estiver vazio, mostra uma mensagem indicando que o carrinho está vazio e zera o total e o contador de itens, caso exista a versão mobile

    lista.innerHTML = `
      <div class="carrinho-vazio">
        Seu carrinho está vazio.
      </div>
    `;

    totalCarrinho.innerText = "R$ 0,00"; // zera o total do carrinho

    if (contadorMobile) {
      contadorMobile.innerText = "0"; // zera o contador de itens no carrinho para a versão mobile
    }

    return;
  }

  let total = 0;
  let quantidadeTotal = 0;

  carrinho.forEach((item) => { // para cada item no carrinho, calcula o subtotal (valor do item multiplicado pela quantidade), soma ao total do carrinho e à quantidade total de itens, e mostra as informações do item no carrinho, incluindo nome, código, quantidade, valor, subtotal e botões para aumentar ou diminuir a quantidade ou remover o item do carrinho

    const subtotal =
      item.valor * item.quantidade; // calcula o subtotal do item (valor multiplicado pela quantidade)

    total += subtotal;
    quantidadeTotal += item.quantidade; // soma a quantidade do item à quantidade total de itens no carrinho

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

  totalCarrinho.innerText = // mostra o valor total do carrinho, formatado como moeda brasileira
    total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  if (contadorMobile) {
    contadorMobile.innerText =
      quantidadeTotal;
  }
}
// funções para aumentar ou diminuir a quantidade de um item no carrinho, ou remover o item do carrinho, atualizando as informações do carrinho após cada ação
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
// funções para carregar os pedidos do repositor logado e os pedidos para o admin, mostrando as informações dos pedidos em tabelas específicas para cada função, e também para alterar o status de um pedido ou cancelar um pedido, atualizando as informações após cada ação
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
        <td>${pedido.cliente || "Não informado"}</td>

        <td>${pedido.telefoneContato || "Não informado"}</td>

        <td>${pedido.data}</td>

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

        


      </tr>
    `;
  });
}

async function carregarAdmin() { // função para carregar os pedidos para o admin, mostrando as informações dos pedidos em uma tabela específica para o admin, e também para alterar o status de um pedido ou cancelar um pedido, atualizando as informações após cada ação

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
async function cancelarPedido(id) { // função para cancelar um pedido, mostrando uma confirmação antes de cancelar, e atualizando as informações após a ação

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
async function buscar(url) { // função genérica para buscar informações da API, enviando o token de autenticação no header da requisição e retornando os dados em formato JSON

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

function toggleSenha() { // função para mostrar ou esconder a senha no campo de login, alterando o tipo do input entre "password" e "text"
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

// funções para criar as tabelas no banco de dados, inserir os dados iniciais de clientes e usuários, e também para criar um usuário admin com senha criptografada usando bcrypt