# Instalação no XAMPP

## 📋 Pré-requisitos

- XAMPP instalado (com Apache e MySQL ativos)
- Projeto na pasta `c:\xampp\htdocs\LojaCarros`

## 🛠️ Passo a Passo

### 1. Verificar Estrutura do Projeto

O projeto deve estar em: `c:\xampp\htdocs\LojaCarros`

Estrutura:
```
LojaCarros/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── assets/
├── backend/
│   └── www/
│       ├── api.php
│       └── db.php
└── .htaccess
```

### 2. Criar o Banco de Dados

1. Abra o phpMyAdmin: http://localhost/phpmyadmin
2. Clique em "Novo" para criar um banco de dados
3. Nome: `lojacarros`
4. Collation: `utf8mb4_general_ci`
5. Clique em "Criar"

### 3. Importar a Estrutura e Dados

1. No phpMyAdmin, selecione o banco `lojacarros`
2. Clique na aba "SQL"
3. Abra o arquivo `db/init.sql` e copie todo o conteúdo
4. Cole no campo SQL do phpMyAdmin
5. Clique em "Executar"

Isso criará a tabela `cars` e inserirá 12 carros de exemplo.

**Alternativa**: Se preferir apenas inserir os dados (tabela já existe):
- Use o arquivo `db/insert_example_cars.sql`

### 4. Configurar a Conexão

O arquivo `backend/www/db.php` já está configurado para XAMPP:
- Host: `localhost`
- Usuário: `root` (padrão do XAMPP)
- Senha: `` (vazia, padrão do XAMPP)
- Banco: `lojacarros`

**Se você alterou a senha do root do MySQL**, edite `backend/www/db.php`:
```php
$user = 'root';
$pass = 'sua_senha_aqui';
```

### 5. Testar o Projeto

1. Inicie o Apache no XAMPP Control Panel
2. Inicie o MySQL no XAMPP Control Panel
3. Acesse no navegador:

**URL Principal:**
```
http://localhost/LojaCarros/frontend/
```

**Ou diretamente:**
```
http://localhost/LojaCarros/frontend/index.html
```

**Testar API diretamente:**
```
http://localhost/LojaCarros/api/cars
```

### 6. Configuração Alternativa (sem .htaccess)

Se o `.htaccess` não funcionar, você pode acessar diretamente:

**Frontend:**
```
http://localhost/LojaCarros/frontend/index.html
```

**API:**
```
http://localhost/LojaCarros/backend/www/api.php
```

E altere no `frontend/index.html` a linha:
```javascript
const API_BASE = '/LojaCarros/backend/www/api.php';
```

## 🔧 Solução de Problemas

### Erro 404 na API

**Opção 1:** Verifique se o `.htaccess` está funcionando:
- No `httpd.conf` do Apache, certifique-se que `AllowOverride All` está ativado

**Opção 2:** Use o caminho direto:
- Altere `API_BASE` no `index.html` para `/LojaCarros/backend/www/api.php`

### Erro de Conexão com Banco

1. Verifique se o MySQL está rodando no XAMPP
2. Verifique as credenciais em `backend/www/db.php`
3. Teste a conexão no phpMyAdmin

### Erro "Access Denied" no MySQL

1. No phpMyAdmin, vá em "Usuários"
2. Edite o usuário `root@localhost`
3. Verifique as permissões ou redefina a senha

## 📝 URLs Importantes

- **Aplicação**: http://localhost/LojaCarros/frontend/
- **phpMyAdmin**: http://localhost/phpmyadmin
- **API**: http://localhost/LojaCarros/api/cars

## ✅ Verificação Final

1. ✅ Apache rodando no XAMPP
2. ✅ MySQL rodando no XAMPP
3. ✅ Banco `lojacarros` criado
4. ✅ Tabela `cars` com dados inseridos
5. ✅ Aplicação acessível no navegador
6. ✅ API retornando JSON com carros

## 🎨 Personalização

Para mudar a URL da API no frontend, edite `frontend/index.html`:

```javascript
// Para usar .htaccess (recomendado)
const API_BASE = '/LojaCarros/api/cars';

// OU caminho direto (alternativa)
const API_BASE = '/LojaCarros/backend/www/api.php';
```



