# 🏎️ Luxury Cars - Showroom Premium

![Status](https://img.shields.io/badge/Status-Concluído-green)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![PHP](https://img.shields.io/badge/PHP-8.2-purple)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)

> **Nota:** Este projeto foi desenvolvido como parte de um trabalho acadêmico para a disciplina de COMPUTAÇÃO EM NUVEM E DEVOPS da Faculdade Einstein.

## 📖 Sobre o Projeto

O **Luxury Cars** é uma aplicação web full-stack desenvolvida para simular um showroom de carros de luxo de alto padrão. Inspirado no design sofisticado da [Mansory](https://www.mansory.com/), o projeto foca em oferecer uma experiência visual imersiva e uma gestão eficiente de veículos.

O objetivo principal foi aplicar conceitos de **Containerização**, **Desenvolvimento Web** e **Arquitetura de Microsserviços** utilizando Docker, criando um ambiente isolado, reprodutível e escalável.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído sobre uma arquitetura robusta e moderna:

- **Frontend:** HTML5, CSS3 (Design Responsivo), JavaScript (Vanilla).
- **Backend:** PHP 8.2 (PHP-FPM) para processamento da API.
- **Banco de Dados:** MySQL 8.0 para persistência dos dados.
- **Servidor Web:** Nginx (Alpine Linux) para alta performance.
- **Infraestrutura:** Docker & Docker Compose para orquestração.
- **Ferramentas:** phpMyAdmin para gestão visual do banco de dados.

---

## ✨ Funcionalidades

### 🎨 Interface do Usuário (Frontend)
- **Design Premium:** Tema escuro com acentos dourados, transmitindo luxo e exclusividade.
- **Interatividade:** Efeitos de hover, animações suaves e layout totalmente responsivo.
- **Busca e Filtros:** Pesquisa em tempo real por marca/modelo e filtros por categoria (Luxury, Sports, SUV, Limited).

### ⚙️ Painel de Controle (Backend)
- **Gestão Completa (CRUD):** Adicionar, Editar, Visualizar e Excluir veículos.
- **API RESTful:** Endpoints estruturados para comunicação entre front e back.
- **Dados Detalhados:** Gerenciamento de especificações, preços, categorias e destaques.

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando.
- Terminal (PowerShell, Bash ou CMD).

### Passo a Passo

1. **Clone o repositório** (ou baixe os arquivos):
   ```bash
   cd c:\Users\renat\Downloads\LojaCarros2 (2)\LojaCarros2\LojaCarros
   ```

2. **Inicie o ambiente com Docker Compose:**
   ```bash
   docker compose up --build -d
   ```
   *Aguarde alguns instantes (aprox. 1-2 min na primeira vez) para que o MySQL inicialize completamente.*

3. **Acesse a aplicação:**
   - 🏠 **Showroom:** [http://localhost:8080](http://localhost:8080)
   - 🗄️ **phpMyAdmin:** [http://localhost:8081](http://localhost:8081)
   - 📊 **Grafana (Monitoramento):** [http://localhost:3000](http://localhost:3000)
     - **Usuário:** `admin`
     - **Senha:** `admin`
   - 📈 **Prometheus (Métricas):** [http://localhost:9090](http://localhost:9090)
   - **Loki** | [http://localhost:3100/ready](http://localhost:3100/ready) | Texto simples: `ready`. |

---

## 🔌 Documentação da API

A aplicação expõe uma API REST em `/api/cars`.

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/cars` | Lista todos os carros. |
| `GET` | `/api/cars?id={id}` | Detalhes de um carro específico. |
| `POST` | `/api/cars` | Cadastra um novo carro (JSON). |
| `PUT` | `/api/cars?id={id}` | Atualiza um carro existente. |
| `DELETE` | `/api/cars?id={id}` | Remove um carro do sistema. |

**Exemplo de JSON para cadastro:**
```json
{
  "make": "Ferrari",
  "model": "F8 Tributo",
  "year": 2024,
  "price": 450000.00,
  "category": "sports",
  "featured": true,
  "description": "Motor V8 biturbo premiado...",
  "brand_logo": "url_da_imagem"
}
```

---

## 📂 Estrutura de Arquivos

```
LojaCarros/
├── backend/            # Lógica do servidor (PHP)
│   ├── Dockerfile
│   └── www/            # Código fonte da API
├── db/                 # Scripts de Banco de Dados
│   └── init.sql        # Criação da tabela e dados iniciais
├── frontend/           # Interface do Usuário
│   ├── assets/         # Imagens e recursos
│   ├── js/             # Lógica do frontend
│   ├── index.html
│   └── styles.css
├── nginx/              # Configurações do Servidor Web
├── docker-compose.yml  # Orquestração dos containers
└── README.md           # Documentação do projeto
```

---

## 👥 Autores

Trabalho desenvolvido por:

- **Renato Rissato Da Silva** 
- **LUCAS OLIVEIRA DA COSTA TURATTI** 

---

## 📄 Licença

Este projeto é de uso educacional. Sinta-se à vontade para estudar e modificar o código.
