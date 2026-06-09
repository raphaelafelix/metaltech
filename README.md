#<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 16H8M11.5 16H12.5M16 16H17M18.4 20H5.6C5.03995 20 4.75992 20 4.54601 19.891C4.35785 19.7951 4.20487 19.6422 4.10899 19.454C4 19.2401 4 18.9601 4 18.4V4.8C4 4.51997 4 4.37996 4.0545 4.273C4.10243 4.17892 4.17892 4.10243 4.273 4.0545C4.37996 4 4.51997 4 4.8 4H7.2C7.48003 4 7.62004 4 7.727 4.0545C7.82108 4.10243 7.89757 4.17892 7.9455 4.273C8 4.37996 8 4.51997 8 4.8V9.06863C8 9.67445 8 9.97735 8.1198 10.1176C8.22374 10.2393 8.37967 10.3039 8.53923 10.2914C8.72312 10.2769 8.93731 10.0627 9.36569 9.63431L12.6343 6.36569C13.0627 5.93731 13.2769 5.72312 13.4608 5.70865C13.6203 5.69609 13.7763 5.76068 13.8802 5.88238C14 6.02265 14 6.32556 14 6.93137V9.06863C14 9.67445 14 9.97735 14.1198 10.1176C14.2237 10.2393 14.3797 10.3039 14.5392 10.2914C14.7231 10.2769 14.9373 10.0627 15.3657 9.63431L18.6343 6.36569C19.0627 5.93731 19.2769 5.72312 19.4608 5.70865C19.6203 5.69609 19.7763 5.76068 19.8802 5.88238C20 6.02265 20 6.32556 20 6.93137V18.4C20 18.9601 20 19.2401 19.891 19.454C19.7951 19.6422 19.6422 19.7951 19.454 19.891C19.2401 20 18.9601 20 18.4 20Z" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
</svg> <img width="800" height="800" alt="industry-windows-svgrepo-com" src="https://github.com/user-attachments/assets/ff4da38d-9126-41cd-97b5-2e8b06a29b19" />
Sistema de Gestão de Ordens de Produção

## 📌 Visão Geral

O Sistema de Gestão de Ordens de Produção tem como objetivo controlar e acompanhar o processo produtivo de uma empresa por meio de um aplicativo mobile para líderes de produção, um sistema web para o setor administrativo e uma API responsável pela comunicação e armazenamento dos dados.

---

# 🎯 Objetivo

Desenvolver uma solução integrada para registrar, acompanhar e gerenciar ordens de produção, proporcionando maior controle sobre o fluxo produtivo e facilitando a tomada de decisões.

---

# 👥 Equipe

**Empresa: Porigon**

**Integrantes do Grupo:**

* André Pavanelli
* Mariana Ayoub
* Raphaela Felix
* Yasmin Lopes

---

# 📋 Escopo do Sistema

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


# 🏗 Arquitetura do Sistema

## Componentes

### 📱 Aplicativo Mobile

Utilizado pelo líder de produção para:

* Realizar login
* Cadastrar ordens de produção
* Atualizar status das ordens
* Consultar lista de ordens

### 💻 Sistema Web

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

### 🗄 Banco de Dados

Armazenará:

* Usuários
* Ordens de produção
* Histórico de status

---

# 📑 Requisitos Funcionais

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

# 🛠 Tecnologias Utilizadas

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

# 🔄 Fluxo do Sistema

1. Usuário realiza login.
2. Líder cadastra uma ordem de produção.
3. Dados são enviados para API.
4. API registra informações no banco de dados.
5. Administrativo consulta as ordens via sistema web.
6. Líder atualiza o status da produção.
7. Alterações são refletidas em todos os módulos.

---

# 📊 Modelo Conceitual

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

# ⚠️ Possíveis Desafios

* Integração entre Mobile e API
* Controle de atualização de status
* Segurança na autenticação
* Organização e modelagem do banco de dados
* Sincronização de dados

---

# 📌 Metodologia

A equipe utilizará metodologia ágil baseada em Kanban para organização das tarefas.

Ferramentas:

* Trello
* GitHub
* WhatsApp

---



# 🚀 Futuras Melhorias

* Dashboard com indicadores de produção
* Relatórios em PDF
* Notificações em tempo real
* Controle de estoque integrado
* Histórico completo das alterações

---

# 📄 Licença

Projeto desenvolvido para fins acadêmicos.
