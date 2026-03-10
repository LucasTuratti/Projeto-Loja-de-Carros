# Luxury Cars - Showroom Premium

Uma aplicação web completa para exibição e gerenciamento de uma loja de carros de luxo, inspirada no design da [Mansory](https://www.mansory.com/). A aplicação roda integralmente em containers Docker.

## 🚀 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: PHP 8.2 (PHP-FPM)
- **Banco de Dados**: MySQL 8.0
- **Web Server**: Nginx
- **Containerização**: Docker & Docker Compose
- **Ferramenta Admin**: phpMyAdmin

## 📋 Pré-requisitos

- Docker Desktop instalado e rodando
- Windows PowerShell (ou terminal compatível)

## 🛠️ Instalação e Execução

1. **Clone ou navegue até o diretório do projeto:**
   ```powershell
   cd c:\xampp\htdocs\LojaCarros
   ```

2. **Inicie os containers:**
   ```powershell
   docker compose up --build -d
   ```

3. **Aguarde os containers iniciarem** (primeira vez pode demorar alguns minutos)

4. **Acesse a aplicação:**
   - **Frontend**: http://localhost:8080
   - **phpMyAdmin**: http://localhost:8081

## ✨ Funcionalidades

### Interface Premium
- Design luxuoso com tema escuro (preto/dourado)
- Hero section impactante
- Cards de carros com hover effects e animações suaves
- Layout totalmente responsivo

### Gerenciamento de Carros
- **Adicionar carros** com informações completas:
  - Marca e Modelo (obrigatórios)
  - Ano, Preço
  - Categoria (Luxury, Sports, SUV, Limited Edition)
  - Descrição detalhada
  - Logo/Brand URL
  - Marcação como destaque (Featured)

- **Editar e Excluir** carros existentes
- **Busca em tempo real** por marca ou modelo
- **Filtros por categoria** (Todos, Luxury, Sports, SUV, Limited)
- **Seção de Destaques** para carros em destaque

### API REST

A API está disponível em `/api/cars`:

- **GET** `/api/cars` - Lista todos os carros
- **GET** `/api/cars?id={id}` - Busca um carro específico
- **POST** `/api/cars` - Cria um novo carro (JSON no body)
- **PUT** `/api/cars?id={id}` - Atualiza um carro (JSON no body)
- **DELETE** `/api/cars?id={id}` - Remove um carro

#### Exemplo de JSON para POST/PUT:
```json
{
  "make": "Lamborghini",
  "model": "Urus",
  "year": 2024,
  "price": 300000.00,
  "category": "suv",
  "featured": true,
  "description": "Um SUV de luxo com performance excepcional...",
  "brand_logo": "https://exemplo.com/logo.png"
}
```

## 🗄️ Banco de Dados

### Credenciais MySQL

- **Host** (dentro dos containers): `db`
- **Host** (acesso externo): `localhost`
- **Porta**: `3306`
- **Database**: `lojacarros`
- **Usuário**: `user`
- **Senha**: `password`
- **Root Password**: `rootpass`

### Estrutura da Tabela

A tabela `cars` possui os seguintes campos:

- `id` - INT (Auto Increment, Primary Key)
- `make` - VARCHAR(100) - Marca do veículo
- `model` - VARCHAR(100) - Modelo do veículo
- `year` - INT - Ano de fabricação
- `price` - DECIMAL(10,2) - Preço em euros
- `category` - ENUM('luxury','sports','suv','limited') - Categoria
- `brand_logo` - VARCHAR(255) - URL do logo/marca
- `gallery` - JSON - Galeria de imagens (futuro)
- `specs` - JSON - Especificações técnicas (futuro)
- `featured` - BOOLEAN - Carro em destaque
- `description` - TEXT - Descrição detalhada
- `created_at` - TIMESTAMP - Data de criação
- `updated_at` - TIMESTAMP - Data de atualização

A tabela é criada automaticamente ao iniciar o container MySQL através do script `db/init.sql`.

**Nota**: O script `db/init.sql` já inclui 12 carros de exemplo inspirados na [Mansory](https://www.mansory.com/cars-for-sale?sold=Available), incluindo:

- 4 carros em **destaque** (featured): Rolls-Royce Cullinan LINEA D`ARABO, Ferrari Purosangue Pugnator, Lamborghini Urus SE Venatus, Mercedes-AMG G63 Grande Entrée
- 8 carros na coleção regular: Rolls-Royce Phantom, Ferrari 812 GTS Stallone, Ferrari 12 Cilindri Equestre, Rolls-Royce Spectre, e outros veículos de luxo

Todos os carros incluem informações completas: marca, modelo, ano, preço, categoria, descrição detalhada e links para imagens.

**Para limpar e recriar os dados de exemplo**: Se precisar resetar o banco de dados com os dados iniciais, execute:
```powershell
docker compose down -v
docker compose up --build -d
```

**Alternativa - Executar no phpMyAdmin**: Se os containers já estão rodando e você quer adicionar os carros manualmente:

1. Acesse http://localhost:8081
2. Faça login:
   - Servidor: `db`
   - Usuário: `user`
   - Senha: `password`
3. Selecione o banco `lojacarros` no menu lateral
4. Clique na aba "SQL" no topo
5. Copie e cole o conteúdo do arquivo `db/insert_example_cars.sql` (versão simplificada apenas com INSERTs)
6. Clique em "Executar"

**Nota**: O arquivo `db/insert_example_cars.sql` contém apenas os comandos INSERT, ideal para quando a tabela já existe. O arquivo `db/init.sql` completo é executado automaticamente apenas na primeira criação dos containers.

## 🔧 Comandos Úteis

### Ver logs dos containers
```powershell
docker compose logs -f
```

### Parar os containers
```powershell
docker compose down
```

### Parar e remover volumes (cuidado: apaga o banco)
```powershell
docker compose down -v
```

### Rebuild forçado
```powershell
docker compose up --build --force-recreate -d
```

### Acessar container PHP
```powershell
docker compose exec php sh
```

### Acessar container MySQL
```powershell
docker compose exec db mysql -u user -ppassword lojacarros
```

## 📁 Estrutura do Projeto

```
LojaCarros/
├── backend/
│   ├── Dockerfile          # Imagem PHP-FPM
│   └── www/
│       ├── api.php         # API REST em PHP
│       └── db.php          # Conexão com MySQL
├── db/
│   └── init.sql            # Script de inicialização do banco
├── frontend/
│   ├── assets/
│   │   ├── logo.png        # Logo da aplicação
│   │   └── hero.svg        # Imagem hero
│   ├── index.html          # Frontend principal
│   └── styles.css          # Estilos premium
├── nginx/
│   └── default.conf        # Configuração do Nginx
├── docker-compose.yml      # Orquestração dos containers
└── README.md              # Este arquivo
```

## 🎨 Características do Design

- **Tema**: Preto profundo com acentos dourados
- **Tipografia**: Inter, Segoe UI (moderna e limpa)
- **Animações**: Transições suaves e hover effects elegantes
- **Layout**: Grid responsivo que se adapta a diferentes tamanhos de tela
- **UX**: Interface intuitiva com feedback visual imediato

## 🔒 Segurança

- Validação de dados no frontend e backend
- Prepared statements para prevenir SQL injection
- Sanitização de entrada HTML (XSS protection)
- Configuração segura de containers Docker

## 📝 Notas

- O projeto usa volumes read-only para os arquivos da aplicação
- O banco de dados persiste em volumes do Docker
- Primeira execução: o MySQL cria a estrutura automaticamente
- Para desenvolvimento: edite os arquivos localmente, os containers refletem as mudanças automaticamente

## 🐛 Troubleshooting

### Containers não iniciam
- Verifique se as portas 8080, 8081 e 3306 estão livres
- Verifique os logs: `docker compose logs`

### Erro de conexão com banco
- Aguarde alguns segundos após iniciar os containers (MySQL precisa de tempo para inicializar)
- Verifique se o container `db` está rodando: `docker compose ps`

### Mudanças não aparecem no frontend
- Limpe o cache do navegador (Ctrl+F5)
- Verifique se os volumes estão montados corretamente

## 📄 Licença

Este projeto é uma aplicação de demonstração para fins educacionais.

---

**Desenvolvido com inspiração em [Mansory.com](https://www.mansory.com/)**
