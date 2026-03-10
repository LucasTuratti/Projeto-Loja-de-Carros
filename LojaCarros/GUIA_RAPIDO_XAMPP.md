# 🚀 Guia Rápido - XAMPP

## ⚡ Setup Rápido (5 minutos)

### 1. Ativar Serviços no XAMPP
- ✅ Apache → Start
- ✅ MySQL → Start

### 2. Criar Banco de Dados
1. Acesse: http://localhost/phpmyadmin
2. Clique em "Novo"
3. Nome: `lojacarros`
4. Collation: `utf8mb4_general_ci`
5. Clique "Criar"

### 3. Importar Dados
1. No phpMyAdmin, selecione `lojacarros`
2. Aba "SQL"
3. Abra `db/init.sql` e copie TUDO
4. Cole no phpMyAdmin e clique "Executar"

### 4. Acessar a Aplicação
```
http://localhost/LojaCarros/frontend/
```

## 🔧 Se Não Funcionar

### Erro 404 na API?

**Solução 1:** Ative o mod_rewrite no Apache
1. Abra `C:\xampp\apache\conf\httpd.conf`
2. Procure: `#LoadModule rewrite_module`
3. Remova o `#` (descomente)
4. Procure: `AllowOverride None`
5. Mude para: `AllowOverride All`
6. Reinicie o Apache

**Solução 2:** Use caminho direto
No arquivo `frontend/index.html`, linha 138, mude:
```javascript
// De:
const API_BASE = '/LojaCarros/api/cars';
// Para:
const API_BASE = '/LojaCarros/backend/www/api.php';
```

### Erro de Conexão com Banco?

1. Verifique se MySQL está rodando no XAMPP
2. Verifique se o banco `lojacarros` existe
3. Se alterou a senha do root, edite `backend/www/db.php`:
   ```php
   $pass = 'sua_senha';
   ```

## ✅ Teste Rápido

1. **Testar API diretamente:**
   ```
   http://localhost/LojaCarros/backend/www/api.php
   ```
   Deve retornar JSON com os carros.

2. **Verificar banco:**
   - phpMyAdmin → `lojacarros` → `cars`
   - Deve ter 12 registros

3. **Aplicação:**
   ```
   http://localhost/LojaCarros/frontend/
   ```
   Deve mostrar os carros na tela!

## 📝 URLs Importantes

- 🏠 **Aplicação**: http://localhost/LojaCarros/frontend/
- 🔧 **phpMyAdmin**: http://localhost/phpmyadmin
- 🔌 **API Direta**: http://localhost/LojaCarros/backend/www/api.php
- 🛣️ **API via .htaccess**: http://localhost/LojaCarros/api/cars

---

**Pronto!** Seu projeto está rodando no XAMPP! 🎉



