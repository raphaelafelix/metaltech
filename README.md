#Sistema de Gestão de Ordens de Produção

##  Visão Geral

O Sistema de Gestão de Ordens de Produção tem como objetivo controlar e acompanhar o processo produtivo de uma empresa por meio de um aplicativo mobile para líderes de produção, um sistema web para o setor administrativo e uma API responsável pela comunicação e armazenamento dos dados.

---

#  Objetivo

Desenvolver uma solução integrada para registrar, acompanhar e gerenciar ordens de produção, proporcionando maior controle sobre o fluxo produtivo e facilitando a tomada de decisões.

---

#  Equipe

**Empresa: Porigon**

**Integrantes do Grupo:**

* André Pavanelli
* Mariana Ayoub
* Raphaela Felix
* Yasmin Lopes

---

#  Escopo do Sistema

O sistema permitirá o gerenciamento de ordens de produção contendo:

* Cliente
* Produto
* Quantidade
* Prazo de entrega
* Status da produção

### Status disponíveis

* <img src="" alt=""> Aguardando Produção
* <img src="" alt=""> Em Produção
* <img src="" alt=""> Finalizado

---


#  Arquitetura do Sistema

## Componentes

###  Aplicativo Mobile

Utilizado pelo líder de produção para:

* Realizar login
* Cadastrar ordens de produção
* Atualizar status das ordens
* Consultar lista de ordens

###  Sistema Web

Utilizado pelo setor administrativo para:

* Realizar login
* Visualizar ordens cadastradas
* Consultar detalhes das ordens
* Filtrar ordens por status

### 🔗 Back-end

Responsável por:

* Disponibilizar API REST
* Controlar autenticação
* Processar regras de negócio
* Gerenciar banco de dados

###  Banco de Dados

Armazenará:

* Usuários
* Ordens de produção
* Histórico de status

---

#  Requisitos Funcionais

| Código | Requisito                       |
| ------ | ------------------------------- |
| RF01   | Login de usuário (Web e Mobile) |
| RF02   | Cadastro de ordem de produção   |
| RF03   | Listagem de ordens              |
| RF04   | Atualização de status           |
| RF05   | Visualização detalhada          |
| RF06   | Filtro por status               |
| RF07   | Comunicação com API REST        |

---

# ⚙️ Requisitos Não Funcionais

| Código | Requisito                     |
| ------ | ----------------------------- |
| RNF01  | Interface responsiva para web |
| RNF02  | Interface simples para mobile |
| RNF03  | Autenticação segura           |
| RNF04  | Tempo de resposta rápido      |
| RNF05  | Alta disponibilidade          |

---

#  Tecnologias Utilizadas

## Front-end Web

* HTML5
* CSS
* JavaScript


## Back-end

* Node.js
* Express.js

## Banco de Dados

* SQLite


## Comunicação

* API REST
* JSON

---

#  Fluxo do Sistema

1. Usuário realiza login.
2. Líder cadastra uma ordem de produção.
3. Dados são enviados para API.
4. API registra informações no banco de dados.
5. Administrativo consulta as ordens via sistema web.
6. Líder atualiza o status da produção.
7. Alterações são refletidas em todos os módulos.

---

#  Modelo Conceitual

## Entidade Usuário

* id
* nome
* email
* senha
* perfil

## Entidade Ordem de Produção

* id
* cliente
* produto
* quantidade
* prazo
* status
* data_criacao

---

#  Possíveis Desafios

* Integração entre Mobile e API
* Controle de atualização de status
* Segurança na autenticação
* Organização e modelagem do banco de dados
* Sincronização de dados

---

#  Metodologia

A equipe utilizará metodologia ágil baseada em Kanban para organização das tarefas.

Ferramentas:

* Trello
* GitHub
* WhatsApp

---



#  Futuras Melhorias

* Dashboard com indicadores de produção
* Relatórios em PDF
* Notificações em tempo real
* Controle de estoque integrado
* Histórico completo das alterações

---

#  Licença

Projeto desenvolvido para fins acadêmicos.
