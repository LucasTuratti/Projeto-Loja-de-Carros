# 🔧 Guia de Solução de Problemas (Troubleshooting)

Este documento serve como referência para diagnosticar e corrigir erros comuns durante a execução do projeto **Luxury Cars**.

---

## 📋 Checklist Inicial

Antes de investigar erros complexos, verifique o básico:

1. **O Docker Desktop está rodando?** (Verifique o ícone na barra de tarefas).
2. **Os containers estão de pé?**
   Execute no terminal:
   ```powershell
   docker compose ps
   ```
   *Todos os serviços (`db`, `php`, `nginx`) devem estar com status `Up`.*

---

## 🌐 Problemas no Frontend (Interface)

### "Mudanças no código não aparecem na tela"
*   **Causa:** Cache do navegador ou do Nginx.
*   **Solução:**
    1. Pressione `Ctrl + F5` para limpar o cache do navegador.
    2. Se persistir, reinicie o Nginx: `docker compose restart nginx`.

### "Erro ao carregar a lista de carros"
*   **Sintoma:** A seção "Nossa Coleção" fica vazia ou mostra erro.
*   **Verificação:**
    1. Abra o Console do Desenvolvedor (`F12` -> Aba *Console*).
    2. Procure por erros em vermelho (ex: `Failed to fetch`, `404 Not Found`).
    3. Verifique a aba *Network* e recarregue a página. Veja se a requisição para `api/cars` retorna status 200.

---

## ⚙️ Problemas no Backend (API)

### Erro 500 (Internal Server Error)
*   **Causa:** Erro no código PHP ou falha na conexão com o banco.
*   **Solução:** Verifique os logs do container PHP para detalhes:
    ```powershell
    docker compose logs php
    ```

### Erro 404 (Not Found) na API
*   **Causa:** O Nginx não está conseguindo repassar a requisição para o PHP ou o arquivo não existe.
*   **Solução:** Verifique se o arquivo `backend/www/api.php` existe e se o `nginx/default.conf` está configurado corretamente.

---

## 🗄️ Problemas no Banco de Dados

### "Database connection failed"
*   **Causa:** O container `db` ainda não inicializou ou credenciais incorretas.
*   **Solução:**
    1. Aguarde 30 segundos após o `docker compose up`. O MySQL demora um pouco na primeira vez.
    2. Verifique os logs do banco:
       ```powershell
       docker compose logs db
       ```

### Tabela `cars` não existe ou está vazia
*   **Causa:** O script de inicialização falhou ou o volume persistiu dados corrompidos.
*   **Solução:**
    1. Acesse o phpMyAdmin: [http://localhost:8081](http://localhost:8081).
    2. Vá na aba **SQL** e execute o conteúdo do arquivo `db/insert_example_cars.sql`.
    3. **Reset Total (Cuidado):** Apaga tudo e recria.
       ```powershell
       docker compose down -v
       docker compose up --build -d
       ```

---

## 🐳 Comandos Úteis de Manutenção

| Ação | Comando PowerShell |
| :--- | :--- |
| **Ver logs em tempo real** | `docker compose logs -f` |
| **Reiniciar serviços** | `docker compose restart` |
| **Parar tudo** | `docker compose down` |
| **Reconstruir imagens** | `docker compose up --build -d` |

