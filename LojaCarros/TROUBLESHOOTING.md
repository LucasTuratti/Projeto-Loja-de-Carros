# Guia de Resolução de Problemas

## Problema: Erro "Not Found" na seção "Nossa Coleção"

### Passo 1: Verificar Containers

Execute no PowerShell (na pasta do projeto):

```powershell
docker compose ps
```

Todos os containers devem estar com status "Up":
- `db` (MySQL)
- `php` (PHP-FPM)
- `nginx` (Nginx)
- `phpmyadmin` (opcional)

**Se algum container não estiver rodando**, execute:
```powershell
docker compose up -d
```

### Passo 2: Verificar Logs

Verifique os logs do PHP para ver erros:

```powershell
docker compose logs php
```

Verifique os logs do Nginx:

```powershell
docker compose logs nginx
```

### Passo 3: Testar a API Diretamente

Abra no navegador ou use o console do navegador:

```
http://localhost:8080/api/cars
```

Deve retornar um JSON com os carros ou uma mensagem de erro mais específica.

### Passo 4: Verificar Banco de Dados

1. Acesse phpMyAdmin: http://localhost:8081
2. Login:
   - Servidor: `db`
   - Usuário: `user`
   - Senha: `password`
3. Selecione o banco `lojacarros`
4. Verifique se a tabela `cars` existe e tem dados

**Se a tabela estiver vazia**, execute novamente o script:
- Aba SQL do phpMyAdmin
- Cole o conteúdo de `db/insert_example_cars.sql`
- Execute

### Passo 5: Reiniciar Containers

Se nada funcionar, reinicie tudo:

```powershell
docker compose down
docker compose up --build -d
```

Aguarde 10-15 segundos para o MySQL inicializar completamente antes de acessar a aplicação.

### Passo 6: Verificar Console do Navegador

1. Abra a aplicação (http://localhost:8080)
2. Pressione F12 para abrir DevTools
3. Vá na aba "Console"
4. Veja se há erros em vermelho
5. Vá na aba "Network" (Rede)
6. Recarregue a página (F5)
7. Procure por uma requisição para `/api/cars`
8. Clique nela e veja a resposta

### Erros Comuns:

#### "Failed to fetch" ou "Network Error"
- Containers não estão rodando
- Porta 8080 está ocupada
- Firewall bloqueando

#### "404 Not Found"
- Rota da API não está configurada corretamente
- Container PHP não está respondendo

#### "500 Internal Server Error"
- Erro no banco de dados
- Erro no código PHP
- Verifique os logs: `docker compose logs php`

#### "Database connection failed"
- Container `db` não está rodando
- MySQL ainda não terminou de inicializar (aguarde mais alguns segundos)
- Verifique: `docker compose logs db`

